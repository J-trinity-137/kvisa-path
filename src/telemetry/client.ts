import { LAST_SENT_WEEK_KEY, readConsent } from '../privacy/consent';
import { isoWeek, type StatsPayload } from './statsSnapshot';

export function apiBase(): string {
  const value = import.meta.env.VITE_KVISA_API_URL;
  return typeof value === 'string' ? value.trim() : '';
}

export function canSend(): boolean {
  return apiBase().length > 0;
}

export async function postStats(payload: StatsPayload, now = new Date()): Promise<'skipped' | 'sent'> {
  const base = apiBase();
  if (!base || !readConsent().stats) return 'skipped';
  const week = isoWeek(now);
  if (typeof window !== 'undefined' && window.localStorage.getItem(LAST_SENT_WEEK_KEY) === week) return 'skipped';
  await fetch(`${base.replace(/\/$/, '')}/v1/stats`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (typeof window !== 'undefined') window.localStorage.setItem(LAST_SENT_WEEK_KEY, week);
  return 'sent';
}
