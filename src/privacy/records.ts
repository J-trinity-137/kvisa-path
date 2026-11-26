import { CONSENT_KEY, DELETE_TOKENS_KEY, LAST_SENT_WEEK_KEY } from './consent';

export const EVENT_STORAGE_KEY = 'kvisa-path.events';
export const DOCS_STORAGE_KEY = 'kvisa-path.done_docs';
export const QUIZ_STORAGE_KEY = 'kvisa-path.quiz_answers';
export const QUIZ_LOGGED_KEY = 'kvisa-path.quiz_logged';
export const PROFILE_STORAGE_KEY = 'kvisa-path.profile';
export const PREFS_STORAGE_KEY = 'kvisa-path.prefs';
export const SAVED_TRACKS_KEY = 'kvisa-path.saved-tracks';
export const COMPARE_KEY = 'kvisa-path.compare';
export const WEEK_STORAGE_KEY = 'kvisa-path.week';
export const STEPS_STORAGE_KEY = 'kvisa-path.steps';
export const VISA_OPT_IN_KEY = 'kvisa-path.visa-optin';
export const STUDY_DAYS_KEY = 'kvisa-path.study-days';
export const RECORDS_CLEARED_EVENT = 'kvisa-path-records-cleared';

const RECORD_KEYS = [
  EVENT_STORAGE_KEY,
  DOCS_STORAGE_KEY,
  QUIZ_STORAGE_KEY,
  QUIZ_LOGGED_KEY,
  PROFILE_STORAGE_KEY,
  SAVED_TRACKS_KEY,
  COMPARE_KEY,
  WEEK_STORAGE_KEY,
  STEPS_STORAGE_KEY,
  VISA_OPT_IN_KEY,
  STUDY_DAYS_KEY,
  CONSENT_KEY,
  LAST_SENT_WEEK_KEY,
  DELETE_TOKENS_KEY,
  'kvisa-path.demo-accounts',
];

export function clearMyRecords(): void {
  if (typeof window === 'undefined') return;
  for (const key of RECORD_KEYS) window.localStorage.removeItem(key);
  const prefsRaw = window.localStorage.getItem(PREFS_STORAGE_KEY);
  if (prefsRaw) {
    try {
      const prefs = JSON.parse(prefsRaw) as Record<string, unknown>;
      prefs.teacherMode = false;
      prefs.studyDays = false;
      window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      window.localStorage.removeItem(PREFS_STORAGE_KEY);
    }
  }
  window.dispatchEvent(new Event(RECORDS_CLEARED_EVENT));
  if (typeof indexedDB !== 'undefined') {
    try {
      indexedDB.deleteDatabase('kvisa-path-demo');
    } catch {
      /* the localStorage copy is already gone */
    }
  }
}
