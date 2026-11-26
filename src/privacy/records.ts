export const EVENT_STORAGE_KEY = 'kvisa-path.events';
export const DOCS_STORAGE_KEY = 'kvisa-path.done_docs';
export const QUIZ_STORAGE_KEY = 'kvisa-path.quiz_answers';
export const RECORDS_CLEARED_EVENT = 'kvisa-path-records-cleared';

export function clearMyRecords(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(EVENT_STORAGE_KEY);
  window.localStorage.removeItem(DOCS_STORAGE_KEY);
  window.localStorage.removeItem(QUIZ_STORAGE_KEY);
  window.dispatchEvent(new Event(RECORDS_CLEARED_EVENT));
}
