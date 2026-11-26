import { boardPosts } from './board';
import { FOREIGN_TRACKS } from './foreignTracks';
import { PATHWAYS_2028 } from './pathways2028';
import type { PathwayRecord } from './trackSchema';

interface JsonRow {
  id?: unknown;
  status?: unknown;
  url?: unknown;
  source_url?: unknown;
  sourceUrl?: unknown;
  verified_at?: unknown;
  verifiedAt?: unknown;
}

const sourceFiles = import.meta.glob('./sources/**/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;
const supportFile = import.meta.glob('./board/supportPrograms.json', { eager: true, import: 'default' }) as Record<string, unknown>;

function rowsOf(value: unknown): JsonRow[] {
  return Array.isArray(value) ? (value as JsonRow[]) : [];
}

function httpUrl(value: unknown): boolean {
  return typeof value === 'string' && (value.startsWith('https://') || value.startsWith('http://'));
}

/**
 * Schema checks for shipped JSON and the published track tables.
 * Unverified rows may stay in the files. They must not be posted on the board.
 */
export function collectIntegrityErrors(): string[] {
  const errors: string[] = [];
  const seen = new Map<string, string>();
  const files = { ...sourceFiles, ...supportFile };
  for (const [file, value] of Object.entries(files)) {
    const rows = rowsOf(value);
    if (!rows.length) errors.push(`${file}: expected an array of rows`);
    rows.forEach((row, index) => {
      const id = typeof row.id === 'string' ? row.id : '';
      if (id) {
        const prior = seen.get(id);
        if (prior) errors.push(`duplicate id ${id} in ${file} and ${prior}`);
        else seen.set(id, file);
      }
      const status = typeof row.status === 'string' ? row.status : '';
      if (status && !['verified', 'partial', 'not_found', 'search_index_only'].includes(status)) errors.push(`${file}#${index}: bad status ${status}`);
      if (status === 'verified') {
        const url = row.source_url ?? row.sourceUrl ?? row.url;
        if (!httpUrl(url)) errors.push(`${file} ${id || index}: verified row missing source url`);
        const checked = String(row.verified_at ?? row.verifiedAt ?? '');
        if (!/^\d{4}-\d{2}/.test(checked)) errors.push(`${file} ${id || index}: verified row missing verified_at`);
      }
    });
  }

  const published: PathwayRecord[] = [...PATHWAYS_2028, ...FOREIGN_TRACKS];
  const trackIds = new Map<string, number>();
  for (const row of published) {
    trackIds.set(row.id, (trackIds.get(row.id) ?? 0) + 1);
    if (!httpUrl(row.url)) errors.push(`${row.id}: missing https url`);
    if (!/^\d{4}-\d{2}$/.test(row.verifiedAt)) errors.push(`${row.id}: verifiedAt must be YYYY-MM`);
    if (row.status !== 'verified') errors.push(`${row.id}: published table includes status ${row.status}`);
  }
  for (const [id, count] of trackIds) {
    if (count > 1) errors.push(`duplicate track id ${id}`);
  }

  const hidden = new Set<string>();
  for (const value of Object.values(files)) {
    for (const row of rowsOf(value)) {
      if (typeof row.id === 'string' && row.status && row.status !== 'verified') hidden.add(row.id);
    }
  }
  for (const post of boardPosts()) {
    if (hidden.has(post.id)) errors.push(`unverified row leaked onto the board: ${post.id}`);
    if (!httpUrl(post.sourceUrl)) errors.push(`board ${post.id}: missing source`);
    if (!/^\d{4}-\d{2}/.test(post.verifiedAt)) errors.push(`board ${post.id}: missing verifiedAt`);
  }
  return errors;
}
