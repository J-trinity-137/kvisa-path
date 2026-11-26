import { readFileSync } from 'node:fs';
import { describe, expect, it, beforeEach } from 'vitest';
import { handleRequest, resetLimits, runCron, type Env } from '../worker/src/index';
import { MemoryDb } from './workerDb';

const ORIGIN = 'https://j-trinity-137.github.io';

function env(db = new MemoryDb()): { env: Env; db: MemoryDb } {
  return { db, env: { DB: db, ENVIRONMENT: 'production', TURNSTILE_SECRET: 'test', ACCESS_AUD: 'test' } };
}

function statsBody(extra: Record<string, unknown> = {}) {
  return JSON.stringify({
    v: 1,
    grade: 'hs',
    region: 'gyeonggi',
    studentType: 'mid_entry',
    lang: 'ko',
    interests: ['it'],
    checklistBucket: '1-25',
    quiz: { 'quiz-1': 'wrong' },
    ...extra,
  });
}

async function post(path: string, body: string, headers: Record<string, string> = {}) {
  const { env: workerEnv, db } = env();
  const response = await handleRequest(
    new Request(`https://worker.test${path}`, {
      method: 'POST',
      headers: { origin: ORIGIN, 'content-type': 'application/json', ...headers },
      body,
    }),
    workerEnv,
  );
  return { response, db };
}

describe('worker', () => {
  beforeEach(() => resetLimits());

  it('counts only the allowed one-way and two-way stats', async () => {
    const { response, db } = await post('/v1/stats', statsBody());
    expect(response.status).toBe(204);
    expect(db.questions).toHaveLength(0);
    const dims = db.counters.map((row) => row.dim).sort();
    expect(dims).toEqual(
      ['checklist', 'grade', 'grade*interest', 'grade*student_type', 'interest', 'lang', 'lang*student_type', 'quiz:quiz-1', 'region', 'region*student_type', 'student_type'].sort(),
    );
    expect(db.counters.every((row) => row.n === 1)).toBe(true);
    expect(JSON.stringify(db.counters)).not.toContain('visa');
    expect(JSON.stringify(db.questions)).not.toContain('cf-connecting-ip');
  });

  it('rejects unknown fields, bad values, oversized bodies, and other origins', async () => {
    expect((await post('/v1/stats', statsBody({ visa: 'D-2' }))).response.status).toBe(400);
    expect((await post('/v1/stats', statsBody({ grade: 'grade-2' }))).response.status).toBe(400);
    expect((await post('/v1/stats', 'x'.repeat(1025))).response.status).toBe(413);
    const { env: workerEnv } = env();
    const response = await handleRequest(
      new Request('https://worker.test/v1/stats', { method: 'POST', headers: { origin: 'https://example.com' }, body: statsBody() }),
      workerEnv,
    );
    expect(response.status).toBe(403);
  });

  it('refuses an unredacted question, a bad turnstile token, and the fourth question in ten minutes', async () => {
    const token = 'a'.repeat(64);
    const good = {
      v: 1,
      lang: 'ko',
      topic: 'ged',
      submitterKind: 'student14',
      body: '검정고시 보면 대학에 갈 수 있나요',
      deleteTokenHash: token,
      turnstile: 'pass',
    };
    expect((await post('/v1/questions', JSON.stringify({ ...good, body: '제 번호 010-1234-5678 입니다' }))).response.status).toBe(422);
    expect((await post('/v1/questions', JSON.stringify({ ...good, turnstile: 'nope' }))).response.status).toBe(403);
    const { env: workerEnv } = env();
    for (let i = 0; i < 3; i += 1) {
      const response = await handleRequest(
        new Request('https://worker.test/v1/questions', {
          method: 'POST',
          headers: { origin: ORIGIN, 'cf-connecting-ip': '203.0.113.5' },
          body: JSON.stringify({ ...good, body: `검정고시 질문 ${i} 입니다` }),
        }),
        workerEnv,
      );
      expect(response.status).toBe(202);
    }
    const limited = await handleRequest(
      new Request('https://worker.test/v1/questions', {
        method: 'POST',
        headers: { origin: ORIGIN, 'cf-connecting-ip': '203.0.113.5' },
        body: JSON.stringify({ ...good, body: '검정고시 질문 넷째 입니다' }),
      }),
      workerEnv,
    );
    expect(limited.status).toBe(429);
  });

  it('masks counts under 10 and deletes only with the right token', async () => {
    const { env: workerEnv, db } = env();
    await handleRequest(
      new Request('https://worker.test/v1/stats', { method: 'POST', headers: { origin: ORIGIN }, body: statsBody() }),
      workerEnv,
    );
    const hidden = await handleRequest(new Request('https://worker.test/v1/public/stats?dim=region&from=2020-W01'), workerEnv);
    const hiddenBody = (await hidden.json()) as { masked?: boolean }[];
    expect(hiddenBody[0]?.masked).toBe(true);
    const region = db.counters.find((row) => row.dim === 'region');
    region!.n = 10;
    const shown = await handleRequest(new Request('https://worker.test/v1/public/stats?dim=region&from=2020-W01'), workerEnv);
    expect(JSON.stringify(await shown.json())).toContain('"n":10');

    const rawToken = 'delete-token-value';
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rawToken)))]
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
    const created = await handleRequest(
      new Request('https://worker.test/v1/questions', {
        method: 'POST',
        headers: { origin: ORIGIN, 'cf-connecting-ip': '203.0.113.9' },
        body: JSON.stringify({
          v: 1,
          lang: 'ko',
          topic: 'documents',
          submitterKind: 'guardian',
          body: '서류 목록을 어디서 보나요',
          deleteTokenHash: hash,
          turnstile: 'pass',
        }),
      }),
      workerEnv,
    );
    const { id } = (await created.json()) as { id: string };
    const wrong = await handleRequest(
      new Request(`https://worker.test/v1/questions/${id}`, { method: 'DELETE', headers: { 'x-delete-token': 'nope' } }),
      workerEnv,
    );
    expect(wrong.status).toBe(404);
    const right = await handleRequest(
      new Request(`https://worker.test/v1/questions/${id}`, { method: 'DELETE', headers: { 'x-delete-token': rawToken } }),
      workerEnv,
    );
    expect(right.status).toBe(204);
    expect(db.questions.some((row) => row.id === id)).toBe(false);
  });

  it('expires old questions, rolls old weeks into a year, and locks admin routes', async () => {
    const { env: workerEnv, db } = env();
    db.questions.push({
      id: 'old',
      week: '2020-W01',
      lang: 'ko',
      topic: 'other',
      submitter_kind: 'teacher',
      body_redacted: '오래된 질문입니다',
      redaction_flags: '[]',
      status: 'pending',
      faq_id: null,
      delete_token_hash: 'b'.repeat(64),
      delete_after: '2020-01-01',
    });
    db.counters.push({ period: '2024-W01', dim: 'grade', value: 'hs', n: 12 });
    db.counters.push({ period: '2026-W40', dim: 'grade', value: 'ms', n: 3 });
    await runCron(workerEnv, new Date('2026-11-26T00:00:00Z'));
    expect(db.questions).toHaveLength(0);
    expect(db.logs.some((row) => row.action === 'expire')).toBe(true);
    expect(db.counters.some((row) => row.period === '2024' && row.n === 12)).toBe(true);
    expect(db.counters.some((row) => row.period === '2024-W01')).toBe(false);
    expect(db.counters.some((row) => row.period === '2026-W40')).toBe(true);
    const denied = await handleRequest(new Request('https://worker.test/admin/api/questions'), workerEnv);
    expect(denied.status).toBe(401);
  });

  it('does not log requests', () => {
    const source = readFileSync(new URL('../worker/src/index.ts', import.meta.url), 'utf8');
    expect(source).not.toContain('console.log');
  });
});
