import { afterEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_KEY, LAST_SENT_WEEK_KEY } from '../src/privacy/consent';
import { clearMyRecords } from '../src/privacy/records';
import { readConsent, writeConsent } from '../src/privacy/consent';
import { buildStatsSnapshot } from '../src/telemetry/statsSnapshot';
import { postStats } from '../src/telemetry/client';

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
  };
  Object.defineProperty(globalThis, 'window', { value: { localStorage, dispatchEvent: () => true }, configurable: true });
  Object.defineProperty(globalThis, 'localStorage', { value: localStorage, configurable: true });
  return mem;
}

describe('consent and stats', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    Reflect.deleteProperty(globalThis, 'window');
    Reflect.deleteProperty(globalThis, 'localStorage');
  });

  it('starts off and does not call fetch when no API URL is set', async () => {
    installMemoryStorage();
    expect(readConsent().stats).toBe(false);
    expect(readConsent().questions).toBe(false);
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));
    const payload = buildStatsSnapshot({ visa: 'D-2', grade: 'hs', region: 'seoul', studentType: 'mid_entry', lang: 'ko' });
    const raw = JSON.stringify(payload);
    expect(raw).not.toContain('visa');
    expect(raw).not.toContain('D-2');
    expect(Object.keys(payload)).not.toEqual(expect.arrayContaining(['visa', 'nationality', 'school', 'name', 'age']));
    await expect(postStats(payload)).resolves.toBe('skipped');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('does not turn questions on without cross-border consent', () => {
    installMemoryStorage();
    const saved = writeConsent({ stats: true, questions: true, crossBorder: false });
    expect(saved.questions).toBe(false);
    expect(readConsent().stats).toBe(true);
  });

  it('clears consent and the week marker with the other device records', () => {
    const mem = installMemoryStorage();
    writeConsent({ stats: true, questions: false, crossBorder: false });
    mem.set(LAST_SENT_WEEK_KEY, '2026-W48');
    clearMyRecords();
    expect(mem.has(CONSENT_KEY)).toBe(false);
    expect(mem.has(LAST_SENT_WEEK_KEY)).toBe(false);
  });
});
