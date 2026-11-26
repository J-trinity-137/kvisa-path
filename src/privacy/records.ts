import { CONSENT_KEY, DELETE_TOKENS_KEY, LAST_SENT_WEEK_KEY } from './consent';

export const EVENT_STORAGE_KEY = 'kvisa-path.events';
export const DOCS_STORAGE_KEY = 'kvisa-path.done_docs';
export const QUIZ_STORAGE_KEY = 'kvisa-path.quiz_answers';
export const RECORDS_CLEARED_EVENT = 'kvisa-path-records-cleared';

export function clearMyRecords(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(EVENT_STORAGE_KEY);
  window.localStorage.removeItem(DOCS_STORAGE_KEY);
  window.localStorage.removeItem(QUIZ_STORAGE_KEY);
  window.localStorage.removeItem(CONSENT_KEY);
  window.localStorage.removeItem(LAST_SENT_WEEK_KEY);
  window.localStorage.removeItem(DELETE_TOKENS_KEY);
  window.dispatchEvent(new Event(RECORDS_CLEARED_EVENT));
}
