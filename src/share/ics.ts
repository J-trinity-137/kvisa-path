import type { DDaySchedule } from '../data/interactiveModules';
import { isIsoDate, nextIsoDate } from '../deadlines/seoul';

export interface CalendarEvent {
  uid: string;
  title: string;
  /** Inclusive Korea civil date, YYYY-MM-DD. */
  start: string;
  /** Inclusive Korea civil date, YYYY-MM-DD. */
  end: string;
  description?: string;
  url?: string;
}

function compact(date: string): string {
  return date.replaceAll('-', '');
}

function icsText(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll(',', '\\,').replaceAll(';', '\\;');
}

function stamp(now: Date): string {
  const iso = now.toISOString().replaceAll('-', '').replaceAll(':', '');
  return `${iso.slice(0, 15)}Z`;
}

/** Fold at 75 octets. Continuation lines start with one space. */
export function foldLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let chunk = '';
  let budget = 75;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (chunk && encoder.encode(chunk).length + size > budget) {
      parts.push(chunk);
      chunk = '';
      budget = 74;
    }
    chunk += char;
  }
  if (chunk) parts.push(chunk);
  return parts.map((part, index) => (index === 0 ? part : ` ${part}`)).join('\r\n');
}

/**
 * All-day events on Korea civil dates.
 * VALUE=DATE has no clock time, so the day cannot shift across UTC.
 * The calendar timezone is Asia/Seoul (KST, +0900, no DST).
 * Built on device. Nothing is fetched.
 */
export function eventsToIcs(events: readonly CalendarEvent[], now = new Date()): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//kvisa-path//deadlines//KO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:K-Visa Path',
    'X-WR-TIMEZONE:Asia/Seoul',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Seoul',
    'X-LIC-LOCATION:Asia/Seoul',
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    'TZOFFSETFROM:+0900',
    'TZOFFSETTO:+0900',
    'TZNAME:KST',
    'END:STANDARD',
    'END:VTIMEZONE',
  ];
  const dtstamp = stamp(now);
  for (const event of events) {
    if (!isIsoDate(event.start) || !isIsoDate(event.end) || event.end < event.start) continue;
    const exclusive = nextIsoDate(event.end);
    lines.push(
      'BEGIN:VEVENT',
      `UID:${icsText(event.uid)}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${compact(event.start)}`,
      `DTEND;VALUE=DATE:${compact(exclusive)}`,
      `SUMMARY:${icsText(event.title)}`,
    );
    if (event.description) lines.push(`DESCRIPTION:${icsText(event.description)}`);
    if (event.url) lines.push(`URL:${event.url}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR', '');
  return lines.map(foldLine).join('\r\n');
}

export function scheduleToIcs(schedule: DDaySchedule, now = new Date()): string {
  return eventsToIcs(
    [
      {
        uid: `${schedule.id}@kvisa-path`,
        title: schedule.title,
        start: schedule.dateStr,
        end: schedule.endDateStr ?? schedule.dateStr,
        description: schedule.sourceLabel,
        url: schedule.sourceUrl,
      },
    ],
    now,
  );
}

export function downloadCalendar(filename: string, ics: string): void {
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadIcs(schedule: DDaySchedule): void {
  downloadCalendar(`${schedule.id}.ics`, scheduleToIcs(schedule));
}
