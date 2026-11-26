export const CONSENT_KEY = 'kvisa-path.consent';
export const LAST_SENT_WEEK_KEY = 'kvisa-path.lastSentWeek';
export const DELETE_TOKENS_KEY = 'kvisa-path.deleteTokens';
export const POLICY_VERSION = '2026-12';

export interface ConsentState {
  stats: boolean;
  questions: boolean;
  crossBorder: boolean;
  policyVersion: string;
  at: string;
}

export const CONSENT_OFF: ConsentState = {
  stats: false,
  questions: false,
  crossBorder: false,
  policyVersion: POLICY_VERSION,
  at: '',
};

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

export function readConsent(): ConsentState {
  const raw = storage()?.getItem(CONSENT_KEY);
  if (!raw) return { ...CONSENT_OFF };
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.policyVersion !== POLICY_VERSION) return { ...CONSENT_OFF };
    return {
      stats: parsed.stats === true,
      questions: parsed.questions === true && parsed.crossBorder === true,
      crossBorder: parsed.crossBorder === true,
      policyVersion: POLICY_VERSION,
      at: typeof parsed.at === 'string' ? parsed.at : '',
    };
  } catch {
    return { ...CONSENT_OFF };
  }
}

export function writeConsent(next: Pick<ConsentState, 'stats' | 'questions' | 'crossBorder'>): ConsentState {
  const questions = next.questions && next.crossBorder;
  const state: ConsentState = {
    stats: next.stats,
    questions,
    crossBorder: next.crossBorder,
    policyVersion: POLICY_VERSION,
    at: new Date().toISOString().slice(0, 7),
  };
  storage()?.setItem(CONSENT_KEY, JSON.stringify(state));
  return state;
}

export function clearConsentChoice(): void {
  storage()?.removeItem(CONSENT_KEY);
}
