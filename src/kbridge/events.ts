import type { AnonymousEvent, AnonymousEventInput } from './types';

const ALLOWED_KEYS = ['app', 'opportunityId', 'kind', 'lang', 'choiceCode'] as const;
const ASCII_TOKEN = /^[A-Za-z0-9_.:-]{1,80}$/;
const DISTRICT_CODE = /^[가-힣]{1,8}구$/;

export function isPersistableChoiceCode(value: string): boolean {
  return ASCII_TOKEN.test(value) || DISTRICT_CODE.test(value);
}

export function isPersistableToken(value: string): boolean {
  return ASCII_TOKEN.test(value);
}

/**
 * Keep only closed-set codes. Free-text fields such as spanText, questions, and visa notes are dropped.
 */
export function sanitizeEventInput(input: object): AnonymousEventInput | null {
  const source = input as Record<string, unknown>;
  const app = source.app;
  const opportunityId = source.opportunityId;
  const kind = source.kind;
  const lang = source.lang;
  if (
    typeof app !== 'string' ||
    typeof opportunityId !== 'string' ||
    typeof kind !== 'string' ||
    typeof lang !== 'string' ||
    !isPersistableToken(app) ||
    !isPersistableToken(opportunityId) ||
    !isPersistableToken(kind) ||
    !isPersistableToken(lang)
  ) {
    return null;
  }

  const event: AnonymousEventInput = { app, opportunityId, kind, lang };
  if (typeof source.choiceCode === 'string' && isPersistableChoiceCode(source.choiceCode)) {
    event.choiceCode = source.choiceCode;
  }
  return event;
}

function hasDisallowedKey(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  return Object.keys(value as object).some((key) => !(ALLOWED_KEYS as readonly string[]).includes(key) && key !== 'id' && key !== 'createdAt');
}

export function recordAnonymousEvent(storageKey: string, input: AnonymousEventInput): AnonymousEvent | null {
  const clean = sanitizeEventInput(input);
  if (!clean) return null;
  const event: AnonymousEvent = {
    ...clean,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    const current = readStored(storageKey);
    current.push(event);
    window.localStorage.setItem(storageKey, JSON.stringify(current.slice(-500)));
  }
  return event;
}

export function readAnonymousEvents(storageKey: string): AnonymousEvent[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const needsRewrite = parsed.some((item) => hasDisallowedKey(item));
  const events = parsed
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const clean = sanitizeEventInput(item);
      if (!clean) return null;
      const row = item as Record<string, unknown>;
      return {
        ...clean,
        id: typeof row.id === 'string' ? row.id : `${Date.now()}`,
        createdAt: typeof row.createdAt === 'string' ? row.createdAt : new Date().toISOString(),
      } satisfies AnonymousEvent;
    })
    .filter((item): item is AnonymousEvent => item !== null);

  if (needsRewrite) {
    window.localStorage.setItem(storageKey, JSON.stringify(events));
  }
  return events;
}

function readStored(storageKey: string): AnonymousEvent[] {
  return readAnonymousEvents(storageKey);
}

export function clearAnonymousEvents(storageKey: string): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(storageKey);
  }
}

export interface MaskResult {
  masked: boolean;
  display: string;
  raw: number | null;
}

export function applyKAnonymityMask(count: number, value: number, threshold = 10): MaskResult {
  if (count < threshold) {
    return { masked: true, display: `<${threshold}명 마스킹`, raw: null };
  }
  return { masked: false, display: String(value), raw: value };
}
