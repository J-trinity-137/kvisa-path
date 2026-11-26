import { afterEach, describe, expect, it } from 'vitest';
import { readAnonymousEvents, recordAnonymousEvent } from '../src/kbridge/events';
import { buildQuestionLog } from '../src/data/interactiveModules';
import { clearMyRecords, EVENT_STORAGE_KEY } from '../src/privacy/records';
import { STUDENT_TYPE_KEY } from '../src/data/studentType';

function installMemoryStorage() {
  const mem = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => (mem.has(key) ? mem.get(key)! : null),
    setItem: (key: string, value: string) => {
      mem.set(key, value);
    },
    removeItem: (key: string) => {
      mem.delete(key);
    },
    clear: () => mem.clear(),
    key: () => null,
    get length() {
      return mem.size;
    },
  };
  Object.defineProperty(globalThis, 'window', {
    value: { localStorage, dispatchEvent: () => true },
    configurable: true,
  });
  Object.defineProperty(globalThis, 'localStorage', { value: localStorage, configurable: true });
  return mem;
}

describe('privacy', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'window');
    Reflect.deleteProperty(globalThis, 'localStorage');
  });

  it('stores a topic code and never the question or a visa status', () => {
    installMemoryStorage();
    const raw = '부모는 F-2인데 나는 미등록 상태예요. 검정고시 보면 대학에 갈 수 있나요?';
    recordAnonymousEvent(EVENT_STORAGE_KEY, {
      ...buildQuestionLog(raw, 'ko'),
      spanText: raw,
      visa: 'F-2',
      note: raw,
    } as never);
    const stored = localStorage.getItem(EVENT_STORAGE_KEY) ?? '';
    expect(stored).toContain('"choiceCode":"ged"');
    expect(stored).not.toContain('F-2');
    expect(stored).not.toContain('미등록');
    expect(stored).not.toContain('spanText');
    expect(stored).not.toContain('검정고시');
    const events = readAnonymousEvents(EVENT_STORAGE_KEY);
    expect(events[0]?.choiceCode).toBe('ged');
    expect(Object.keys(events[0] ?? {})).not.toContain('spanText');
  });

  it('rewrites older free-text events and clears them on request', () => {
    const mem = installMemoryStorage();
    mem.set(
      EVENT_STORAGE_KEY,
      JSON.stringify([{ id: 'old', createdAt: '2026-01-01T00:00:00.000Z', app: 'kvisa-path', opportunityId: 'free-question', kind: 'free_question', lang: 'ko', choiceCode: 'visa_status', spanText: '미등록 F-6 체류' }]),
    );
    const events = readAnonymousEvents(EVENT_STORAGE_KEY);
    expect(events).toHaveLength(1);
    expect(mem.get(EVENT_STORAGE_KEY)).not.toContain('미등록');
    expect(mem.get(EVENT_STORAGE_KEY)).not.toContain('F-6');
    clearMyRecords();
    expect(mem.has(EVENT_STORAGE_KEY)).toBe(false);
  });

  it('keeps the on-device student type out of anonymous events', () => {
    const mem = installMemoryStorage();
    mem.set(STUDENT_TYPE_KEY, 'domestic_multicultural');
    recordAnonymousEvent(EVENT_STORAGE_KEY, {
      app: 'kvisa-path',
      opportunityId: 'admission-high-2026',
      kind: 'term_confused',
      lang: 'ko',
      choiceCode: 'topik',
      studentType: 'domestic_multicultural',
    } as never);
    const stored = mem.get(EVENT_STORAGE_KEY) ?? '';
    expect(stored).not.toContain('studentType');
    expect(stored).not.toContain('domestic_multicultural');
    clearMyRecords();
    expect(mem.get(STUDENT_TYPE_KEY)).toBe('domestic_multicultural');
  });
});
