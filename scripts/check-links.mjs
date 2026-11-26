/**
 * Scan data JSON (and published track tables) for source URLs and report HTTP status.
 *
 *   node scripts/check-links.mjs
 *   node scripts/check-links.mjs --json /tmp/link-report.json
 *   node scripts/check-links.mjs --host familynet.or.kr --timeout 20000
 *
 * A real browser User-Agent is sent and the request is GET (many .go.kr and
 * .ac.kr hosts answer 404 or 405 to HEAD on pages that GET returns). Redirects
 * are followed. A short body sample distinguishes a WAF "Request Blocked"
 * from a missing page. The process exits 0 unless --strict is set and any URL
 * is not ok or blocked.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'src', 'data');
const URL_KEYS = new Set(['url', 'source_url', 'sourceUrl']);
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (name.endsWith('.json') || name.endsWith('.ts')) acc.push(full);
  }
  return acc;
}

function labelOf(row) {
  if (!row || typeof row !== 'object') return '';
  for (const key of ['id', 'name', 'title']) {
    if (typeof row[key] === 'string' && row[key]) return row[key];
  }
  return '';
}

/** Collect url / source_url / sourceUrl values from JSON rows and TS object literals. */
export function collectSourceRefs(dir = dataDir) {
  const refs = [];
  for (const file of walk(dir)) {
    const rel = path.relative(root, file);
    const text = readFileSync(file, 'utf8');
    if (file.endsWith('.json')) {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        continue;
      }
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      rows.forEach((row, index) => {
        if (!row || typeof row !== 'object') return;
        for (const key of URL_KEYS) {
          const value = row[key];
          if (typeof value === 'string' && /^https?:\/\//.test(value)) {
            refs.push({ file: rel, index, id: labelOf(row), field: key, url: value, status: row.status ?? '' });
          }
        }
      });
      continue;
    }
    const pattern = /"(url|source_url|sourceUrl)"\s*:\s*"(https?:\/\/[^"]+)"/g;
    let match;
    while ((match = pattern.exec(text))) {
      const line = text.slice(0, match.index).split('\n').length;
      refs.push({ file: rel, index: line, id: '', field: match[1], url: match[2], status: '' });
    }
  }
  return refs;
}

function parseArgs(argv) {
  const opts = { json: '', host: '', timeout: 20000, concurrency: 8, strict: false, limit: 0 };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') opts.json = argv[++i] ?? '';
    else if (arg === '--host') opts.host = argv[++i] ?? '';
    else if (arg === '--timeout') opts.timeout = Number(argv[++i] ?? 20000);
    else if (arg === '--concurrency') opts.concurrency = Number(argv[++i] ?? 8);
    else if (arg === '--limit') opts.limit = Number(argv[++i] ?? 0);
    else if (arg === '--strict') opts.strict = true;
    else if (arg === '--help') opts.help = true;
  }
  return opts;
}

async function readSample(body) {
  if (!body) return '';
  const reader = body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (size < 4096) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      size += value.length;
    }
  } catch {
    // The status is already known. A truncated sample is enough.
  }
  await reader.cancel().catch(() => {});
  return Buffer.concat(chunks).toString('utf8');
}

async function request(url, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': BROWSER_UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });
    const sample = await readSample(response.body);
    const title = sample.match(/<title>([^<]{0,160})/i)?.[1]?.replace(/\s+/g, ' ').trim() ?? '';
    const blocked = /Request Blocked/i.test(sample) || /요청이 차단/i.test(sample);
    return {
      ok: response.ok && !blocked,
      status: response.status,
      finalUrl: response.url,
      method: 'GET',
      error: '',
      title,
      blocked,
    };
  } catch (error) {
    const aborted = error?.name === 'AbortError' || error?.name === 'TimeoutError';
    return {
      ok: false,
      status: 0,
      finalUrl: url,
      method: 'GET',
      error: aborted ? 'timeout' : String(error?.cause?.code || error?.message || error),
      title: '',
      blocked: false,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function checkUrl(url, timeout) {
  return request(url, timeout);
}

function bucket(result) {
  if (result.blocked) return 'blocked';
  if (result.error === 'timeout') return 'timeout';
  if (!result.status) return 'error';
  if (result.status >= 200 && result.status < 300) return 'ok';
  if (result.status >= 300 && result.status < 400) return 'redirect';
  if (result.status >= 400 && result.status < 500) return 'client';
  return 'server';
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => run()));
  return results;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log('usage: node scripts/check-links.mjs [--json file] [--host substring] [--timeout ms] [--concurrency n] [--limit n] [--strict]');
    return;
  }
  const refs = collectSourceRefs().filter((ref) => !opts.host || ref.url.includes(opts.host));
  const unique = [...new Set(refs.map((ref) => ref.url))];
  const targets = opts.limit > 0 ? unique.slice(0, opts.limit) : unique;
  console.error(`checking ${targets.length} unique URLs from ${refs.length} fields`);
  const checked = await mapPool(targets, opts.concurrency, async (url) => {
    const result = await checkUrl(url, opts.timeout);
    const kind = bucket(result);
    console.error(`${kind}\t${result.status || result.error}\t${url}`);
    return { url, ...result, kind };
  });
  const byUrl = new Map(checked.map((row) => [row.url, row]));
  const rows = refs
    .filter((ref) => byUrl.has(ref.url))
    .map((ref) => ({ ...ref, ...byUrl.get(ref.url) }));
  const summary = { ok: 0, redirect: 0, client: 0, server: 0, timeout: 0, error: 0, blocked: 0 };
  for (const row of checked) summary[row.kind] += 1;
  const report = {
    checkedAt: new Date().toISOString(),
    unique: checked.length,
    fields: rows.length,
    summary,
    failures: checked.filter((row) => row.kind !== 'ok'),
    rows: rows.filter((row) => row.kind !== 'ok'),
  };
  const text = JSON.stringify(report, null, 2);
  if (opts.json) writeFileSync(opts.json, text);
  console.log(JSON.stringify({ checkedAt: report.checkedAt, unique: report.unique, fields: report.fields, summary: report.summary }, null, 2));
  if (opts.strict && checked.some((row) => row.kind !== 'ok' && row.kind !== 'blocked')) process.exitCode = 1;
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) main();
