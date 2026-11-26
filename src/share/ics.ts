import type { DDaySchedule } from '../data/interactiveModules';

function compact(date: string): string {
  return date.replaceAll('-', '');
}

function nextDay(date: string): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  parsed.setUTCDate(parsed.getUTCDate() + 1);
  return parsed.toISOString().slice(0, 10);
}

function icsText(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll(',', '\\,').replaceAll(';', '\\;');
}

/** Public schedule only. No visa, name, or question text. */
export function scheduleToIcs(schedule: DDaySchedule): string {
  const end = nextDay(schedule.endDateStr ?? schedule.dateStr);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//kvisa-path//schedules//KO',
    'BEGIN:VEVENT',
    `UID:${schedule.id}@kvisa-path`,
    `DTSTART;VALUE=DATE:${compact(schedule.dateStr)}`,
    `DTEND;VALUE=DATE:${compact(end)}`,
    `SUMMARY:${icsText(schedule.title)}`,
    `DESCRIPTION:${icsText(schedule.sourceLabel)}`,
    `URL:${schedule.sourceUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

export function downloadIcs(schedule: DDaySchedule): void {
  const blob = new Blob([scheduleToIcs(schedule)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${schedule.id}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}
