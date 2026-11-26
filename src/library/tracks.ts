import { COMPARE_KEY, SAVED_TRACKS_KEY } from '../privacy/records';
import { isVerifiedTrack } from '../rules/reasons';

export const COMPARE_MAX = 4;
const SAVED_MAX = 100;

export type ToggleStatus = 'added' | 'removed' | 'full' | 'rejected';

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

export function readIdList(key: string, max = SAVED_MAX): string[] {
  const store = storage();
  if (!store) return [];
  try {
    const raw = store.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    const ids: string[] = [];
    for (const item of parsed) {
      if (typeof item !== 'string' || !isVerifiedTrack(item) || ids.includes(item)) continue;
      ids.push(item);
      if (ids.length >= max) break;
    }
    return ids;
  } catch {
    return [];
  }
}

export function writeIdList(key: string, ids: readonly string[], max = SAVED_MAX): string[] {
  const next: string[] = [];
  for (const id of ids) {
    if (!isVerifiedTrack(id) || next.includes(id)) continue;
    next.push(id);
    if (next.length >= max) break;
  }
  const store = storage();
  if (store) store.setItem(key, JSON.stringify(next));
  return next;
}

export function toggleId(ids: readonly string[], id: string, max: number): { ids: string[]; status: ToggleStatus } {
  if (!isVerifiedTrack(id)) return { ids: [...ids], status: 'rejected' };
  if (ids.includes(id)) return { ids: ids.filter((item) => item !== id), status: 'removed' };
  if (ids.length >= max) return { ids: [...ids], status: 'full' };
  return { ids: [...ids, id], status: 'added' };
}

export function readCompare(): string[] {
  return readIdList(COMPARE_KEY, COMPARE_MAX);
}

export function writeCompare(ids: readonly string[]): string[] {
  return writeIdList(COMPARE_KEY, ids, COMPARE_MAX);
}

export function readSaved(): string[] {
  return readIdList(SAVED_TRACKS_KEY, SAVED_MAX);
}

export function writeSaved(ids: readonly string[]): string[] {
  return writeIdList(SAVED_TRACKS_KEY, ids, SAVED_MAX);
}
