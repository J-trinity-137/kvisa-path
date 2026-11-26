import { redact } from '../../src/privacy/redact';

export interface Prepared {
  bind(...values: unknown[]): Prepared;
  run(): Promise<{ success: boolean }>;
  all<T>(): Promise<{ results: T[] }>;
  first<T>(): Promise<T | null>;
}

export interface Db {
  prepare(sql: string): Prepared;
  batch(statements: Prepared[]): Promise<unknown>;
}

export interface Env {
  DB: Db;
  ENVIRONMENT?: string;
  TURNSTILE_SECRET?: string;
  ACCESS_AUD?: string;
}

const STATS_KEYS = ['v', 'grade', 'region', 'studentType', 'lang', 'interests', 'checklistBucket', 'quiz'];
const QUESTION_KEYS = ['v', 'lang', 'topic', 'submitterKind', 'body', 'deleteTokenHash', 'turnstile'];
const GRADES = new Set(['ms', 'hs', 'other']);
const REGIONS = new Set(['seoul', 'busan', 'daegu', 'incheon', 'gwangju', 'daejeon', 'ulsan', 'sejong', 'gyeonggi', 'gangwon', 'chungbuk', 'chungnam', 'jeonbuk', 'jeonnam', 'gyeongbuk', 'gyeongnam', 'jeju', 'unknown']);
const TYPES = new Set(['foreign_family', 'mid_entry', 'domestic_multicultural', 'unsure']);
const LANGS = new Set(['ko', 'en', 'zh-Hans', 'zh-Hant', 'vi', 'ru', 'mn', 'ar']);
const INTERESTS = new Set(['it', 'culinary', 'design', 'business', 'health']);
const BUCKETS = new Set(['0', '1-25', '26-50', '51-75', '76-99', '100']);
const TOPICS = new Set(['ged', 'scholarship', 'part_time', 'visa_status', 'documents', 'other']);
const KINDS = new Set(['student14', 'guardian', 'teacher']);
const ORIGINS = new Set(['https://j-trinity-137.github.io']);

const hits = new Map<string, number[]>();
const seenBodies = new Map<string, number>();
const daily = { day: '', stats: 0, questions: 0 };

export function resetLimits(): void {
  hits.clear();
  seenBodies.clear();
  daily.day = '';
  daily.stats = 0;
  daily.questions = 0;
}

function dayKey(now: Date): string {
  return now.toISOString().slice(0, 10);
}

function limited(key: string, max: number, windowMs: number, now: Date): boolean {
  const recent = (hits.get(key) ?? []).filter((stamp) => now.getTime() - stamp < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now.getTime());
  hits.set(key, recent);
  return false;
}

export function isoWeek(date: Date): string {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function addDays(date: Date, days: number): string {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function json(status: number, body: unknown, origin: string | null): Response {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (origin && allowedOrigin(origin, 'production')) headers.set('access-control-allow-origin', origin);
  return new Response(JSON.stringify(body), { status, headers });
}

function empty(status: number, origin: string | null, env: Env): Response {
  const headers = new Headers();
  if (origin && allowedOrigin(origin, env.ENVIRONMENT)) headers.set('access-control-allow-origin', origin);
  return new Response(null, { status, headers });
}

function allowedOrigin(origin: string, environment: string | undefined): boolean {
  if (ORIGINS.has(origin)) return true;
  return environment === 'dev' && origin === 'http://localhost:5173';
}

function sameKeys(value: object, allowed: string[]): boolean {
  const keys = Object.keys(value);
  return keys.length === allowed.length && allowed.every((key) => keys.includes(key));
}

async function verifyTurnstile(token: string, secret: string | undefined): Promise<boolean> {
  if (!token || !secret) return false;
  if (secret === 'test') return token === 'pass';
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });
  const payload = (await response.json()) as { success?: boolean };
  return payload.success === true;
}

function counter(db: Db, period: string, dim: string, value: string): Prepared {
  return db
    .prepare('INSERT INTO stat_counter(period, dim, value, n) VALUES (?1, ?2, ?3, 1) ON CONFLICT(period, dim, value) DO UPDATE SET n = n + 1')
    .bind(period, dim, value);
}

export async function handleRequest(request: Request, env: Env, now = new Date()): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (request.method === 'OPTIONS') return empty(204, origin, env);
  if (url.pathname.startsWith('/admin/api') && !(await accessOk(request, env))) return json(401, { error: 'unauthorized' }, origin);
  if (url.pathname === '/admin' && request.method === 'GET') {
    return new Response(ADMIN_HTML, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }
  if (url.pathname === '/v1/stats' && request.method === 'POST') return postStats(request, env, now, origin);
  if (url.pathname === '/v1/questions' && request.method === 'POST') return postQuestion(request, env, now, origin);
  if (url.pathname.startsWith('/v1/questions/') && request.method === 'DELETE') {
    return deleteQuestion(request, env, url.pathname.split('/').pop() ?? '', now);
  }
  if (url.pathname === '/v1/public/stats' && request.method === 'GET') return publicStats(url, env, origin);
  if (url.pathname === '/admin/api/questions' && request.method === 'GET') return listQuestions(url, env, origin);
  if (url.pathname.startsWith('/admin/api/questions/') && request.method === 'POST') {
    return moderate(request, env, url.pathname.split('/').pop() ?? '', now, origin);
  }
  if (url.pathname === '/admin/api/faq/export' && request.method === 'GET') return exportFaq(env, origin);
  return json(404, { error: 'not_found' }, origin);
}

async function accessOk(request: Request, env: Env): Promise<boolean> {
  const header = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!header) return false;
  if (env.ACCESS_AUD === 'test') return header === 'test-jwt';
  return header.split('.').length === 3;
}

async function postStats(request: Request, env: Env, now: Date, origin: string | null): Promise<Response> {
  if (!origin || !allowedOrigin(origin, env.ENVIRONMENT)) return json(403, { error: 'origin' }, origin);
  const raw = await request.text();
  if (raw.length > 1024) return json(413, { error: 'too_large' }, origin);
  const ip = request.headers.get('cf-connecting-ip') ?? '0';
  if (limited(`stats:${ip}`, 5, 60_000, now)) return json(429, { error: 'rate' }, origin);
  if (daily.day !== dayKey(now)) {
    daily.day = dayKey(now);
    daily.stats = 0;
    daily.questions = 0;
  }
  if (daily.stats >= 20_000) return json(503, { error: 'cap' }, origin);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return json(400, { error: 'json' }, origin);
  }
  if (!sameKeys(body, STATS_KEYS) || body.v !== 1) return json(400, { error: 'fields' }, origin);
  if (!GRADES.has(String(body.grade)) || !REGIONS.has(String(body.region)) || !TYPES.has(String(body.studentType))) {
    return json(400, { error: 'value' }, origin);
  }
  if (!LANGS.has(String(body.lang)) || !BUCKETS.has(String(body.checklistBucket)) || !Array.isArray(body.interests)) {
    return json(400, { error: 'value' }, origin);
  }
  const interests = body.interests.map(String);
  if (interests.length > 3 || interests.some((item) => !INTERESTS.has(item))) return json(400, { error: 'value' }, origin);
  const quiz = body.quiz;
  if (!quiz || typeof quiz !== 'object' || Array.isArray(quiz)) return json(400, { error: 'value' }, origin);
  for (const [key, value] of Object.entries(quiz)) {
    if (!/^quiz-\d+$/.test(key) && !TOPICS.has(key)) return json(400, { error: 'value' }, origin);
    if (value !== 'right' && value !== 'wrong' && value !== 'skip') return json(400, { error: 'value' }, origin);
  }
  const period = isoWeek(now);
  const statements = [
    counter(env.DB, period, 'grade', String(body.grade)),
    counter(env.DB, period, 'region', String(body.region)),
    counter(env.DB, period, 'student_type', String(body.studentType)),
    counter(env.DB, period, 'lang', String(body.lang)),
    counter(env.DB, period, 'checklist', String(body.checklistBucket)),
    counter(env.DB, period, 'region*student_type', `${body.region}|${body.studentType}`),
    counter(env.DB, period, 'grade*student_type', `${body.grade}|${body.studentType}`),
    counter(env.DB, period, 'lang*student_type', `${body.lang}|${body.studentType}`),
  ];
  for (const interest of interests) {
    statements.push(counter(env.DB, period, 'interest', interest));
    statements.push(counter(env.DB, period, 'grade*interest', `${body.grade}|${interest}`));
  }
  for (const [key, value] of Object.entries(quiz as Record<string, string>)) {
    statements.push(counter(env.DB, period, `quiz:${key}`, value));
  }
  await env.DB.batch(statements);
  daily.stats += 1;
  return empty(204, origin, env);
}

async function postQuestion(request: Request, env: Env, now: Date, origin: string | null): Promise<Response> {
  if (!origin || !allowedOrigin(origin, env.ENVIRONMENT)) return json(403, { error: 'origin' }, origin);
  const ip = request.headers.get('cf-connecting-ip') ?? '0';
  if (limited(`q:${ip}`, 3, 600_000, now)) return json(429, { error: 'rate' }, origin);
  if (daily.day !== dayKey(now)) {
    daily.day = dayKey(now);
    daily.stats = 0;
    daily.questions = 0;
  }
  if (daily.questions >= 500) return json(503, { error: 'cap' }, origin);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text()) as Record<string, unknown>;
  } catch {
    return json(400, { error: 'json' }, origin);
  }
  if (!sameKeys(body, QUESTION_KEYS) || body.v !== 1) return json(400, { error: 'fields' }, origin);
  const text = String(body.body ?? '');
  const checked = redact(text);
  if (checked.blocked || checked.text !== text || text.length < 5 || text.length > 1000) return json(422, { error: 'redaction' }, origin);
  if (!LANGS.has(String(body.lang)) || !TOPICS.has(String(body.topic)) || !KINDS.has(String(body.submitterKind))) {
    return json(400, { error: 'value' }, origin);
  }
  if (!/^[a-f0-9]{64}$/.test(String(body.deleteTokenHash))) return json(400, { error: 'token' }, origin);
  if (!(await verifyTurnstile(String(body.turnstile), env.TURNSTILE_SECRET))) return json(403, { error: 'turnstile' }, origin);
  const digest = await sha256(text);
  const seen = seenBodies.get(digest);
  if (seen && now.getTime() - seen < 86_400_000) return json(409, { error: 'duplicate' }, origin);
  seenBodies.set(digest, now.getTime());
  const id = crypto.randomUUID();
  const week = isoWeek(now);
  await env.DB.prepare(
    'INSERT INTO question(id, week, lang, topic, submitter_kind, body_redacted, redaction_flags, status, delete_token_hash, delete_after) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)',
  )
    .bind(id, week, body.lang, body.topic, body.submitterKind, text, JSON.stringify(checked.flags), 'pending', body.deleteTokenHash, addDays(now, 180))
    .run();
  daily.questions += 1;
  return json(202, { id }, origin);
}

async function deleteQuestion(request: Request, env: Env, id: string, now: Date): Promise<Response> {
  const token = request.headers.get('x-delete-token') ?? '';
  const row = await env.DB.prepare('SELECT delete_token_hash, week FROM question WHERE id = ?1').bind(id).first<{ delete_token_hash: string; week: string }>();
  if (!row || (await sha256(token)) !== row.delete_token_hash) return new Response(null, { status: 404 });
  await env.DB.prepare('DELETE FROM question WHERE id = ?1').bind(id).run();
  await env.DB.prepare('INSERT INTO moderation_log(question_id, action, week) VALUES (?1, ?2, ?3)').bind(id, 'self_delete', isoWeek(now)).run();
  return new Response(null, { status: 204 });
}

async function publicStats(url: URL, env: Env, origin: string | null): Promise<Response> {
  const dim = url.searchParams.get('dim') ?? '';
  const from = url.searchParams.get('from') ?? '0000-W01';
  if (!/^[a-z0-9_*:.-]+$/i.test(dim)) return json(400, { error: 'dim' }, origin);
  const rows = await env.DB.prepare('SELECT value, n FROM stat_counter WHERE dim = ?1 AND period >= ?2').bind(dim, from).all<{ value: string; n: number }>();
  const results = rows.results.map((row) => (row.n < 10 ? { value: row.value, masked: true } : { value: row.value, n: row.n }));
  return json(200, results, origin);
}

async function listQuestions(url: URL, env: Env, origin: string | null): Promise<Response> {
  const status = url.searchParams.get('status') ?? 'pending';
  const rows = await env.DB.prepare('SELECT id, lang, topic, body_redacted, status FROM question WHERE status = ?1').bind(status).all();
  return json(200, rows.results, origin);
}

async function moderate(request: Request, env: Env, id: string, now: Date, origin: string | null): Promise<Response> {
  const body = (await request.json()) as { action?: string; faqId?: string };
  if (body.action !== 'reject' && body.action !== 'candidate' && body.action !== 'link_faq') return json(400, { error: 'action' }, origin);
  const status = body.action === 'reject' ? 'rejected' : body.action === 'candidate' ? 'faq_candidate' : 'answered_faq';
  const deleteAfter = body.action === 'reject' ? addDays(now, 30) : addDays(now, 180);
  await env.DB.prepare('UPDATE question SET status = ?1, faq_id = ?2, delete_after = ?3 WHERE id = ?4').bind(status, body.faqId ?? null, deleteAfter, id).run();
  await env.DB.prepare('INSERT INTO moderation_log(question_id, action, week) VALUES (?1, ?2, ?3)').bind(id, body.action, isoWeek(now)).run();
  return empty(204, origin, env);
}

async function exportFaq(env: Env, origin: string | null): Promise<Response> {
  const rows = await env.DB.prepare('SELECT id, topic, question_ko, answer_ko, source_url, verified_on FROM faq_draft').bind().all();
  return json(200, rows.results, origin);
}

export async function runCron(env: Env, now = new Date()): Promise<void> {
  const today = dayKey(now);
  const expired = await env.DB.prepare('SELECT id FROM question WHERE delete_after < ?1').bind(today).all<{ id: string }>();
  for (const row of expired.results) {
    await env.DB.prepare('INSERT INTO moderation_log(question_id, action, week) VALUES (?1, ?2, ?3)').bind(row.id, 'expire', isoWeek(now)).run();
  }
  await env.DB.prepare('DELETE FROM question WHERE delete_after < ?1').bind(today).run();
  const counters = await env.DB.prepare("SELECT period, dim, value, n FROM stat_counter WHERE period LIKE '%-W%'").bind().all<{
    period: string;
    dim: string;
    value: string;
    n: number;
  }>();
  const cutoff = new Date(now.getTime());
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 24);
  for (const row of counters.results) {
    const match = /^(\d{4})-W(\d{2})$/.exec(row.period);
    if (!match) continue;
    const start = new Date(Date.UTC(Number(match[1]), 0, 1 + (Number(match[2]) - 1) * 7));
    if (start >= cutoff) continue;
    await env.DB.prepare(
      'INSERT INTO stat_counter(period, dim, value, n) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(period, dim, value) DO UPDATE SET n = n + ?4',
    )
      .bind(match[1], row.dim, row.value, row.n)
      .run();
    await env.DB.prepare('DELETE FROM stat_counter WHERE period = ?1 AND dim = ?2 AND value = ?3').bind(row.period, row.dim, row.value).run();
  }
}

const ADMIN_HTML = `<!doctype html><meta charset="utf-8"><title>kvisa admin</title><p>Cloudflare Access sits in front of this page. Questions stay redacted.</p>`;

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env);
  },
  scheduled(_event: unknown, env: Env): Promise<void> {
    return runCron(env);
  },
};
