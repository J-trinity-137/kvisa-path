import { DDAY_SCHEDULES, daysUntil } from '../data/interactiveModules';
import { TARGET_2028_WINDOWS, type PathwayWindow } from '../data/trackSchema';
import { isIsoDate } from './seoul';
import { isAdmissionCategory, schemaTrack, shippedSchema } from '../rules/reasons';

export interface Deadline {
  id: string;
  title: string;
  start: string;
  end: string;
  sourceUrl: string;
  verifiedAt: string;
  trackId: string;
  shared: boolean;
  /** Chosen tracks that use this same verified window. */
  appliesTo: string[];
}

export type DdayPhase = 'upcoming' | 'open' | 'past';

export interface DdayState {
  phase: DdayPhase;
  days: number;
}

const ADMISSION_WINDOWS: readonly PathwayWindow[] = [TARGET_2028_WINDOWS.susi, TARGET_2028_WINDOWS.jeongsi];

function pushWindow(
  events: Deadline[],
  rowId: string,
  title: string,
  sourceUrl: string,
  verifiedAt: string,
  window: PathwayWindow,
  shared: boolean,
): void {
  if (!isIsoDate(window.start) || !isIsoDate(window.end) || window.end < window.start) return;
  if (!shared) {
    const existing = events.find((event) => event.start === window.start && event.end === window.end);
    if (existing) {
      if (!existing.appliesTo.includes(title)) existing.appliesTo.push(title);
      return;
    }
  }
  const id = `${rowId}:${window.id}`;
  if (events.some((event) => event.id === id)) return;
  events.push({
    id,
    title,
    start: window.start,
    end: window.end,
    sourceUrl,
    verifiedAt,
    trackId: rowId,
    shared,
    appliesTo: [],
  });
}

/**
 * Verified calendar rows, plus windows for tracks the student saved or compared.
 * 2027-guide rows do not inherit the 2028 national dates.
 * Post-graduation stay rows are not deadlines.
 */
export function collectDeadlines(chosenIds: readonly string[]): Deadline[] {
  const events: Deadline[] = [];
  for (const row of shippedSchema()) {
    if (row.category !== 'calendar' || row.status !== 'verified') continue;
    for (const window of row.windows) {
      pushWindow(events, row.id, row.name, row.url, row.verifiedAt, window, true);
    }
  }
  const seen = new Set<string>();
  for (const id of chosenIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    const row = schemaTrack(id);
    if (!row || row.category === 'calendar' || row.category === 'post_graduation_stay' || row.hasTrack === false) continue;
    if (row.windows.length) {
      for (const window of row.windows) pushWindow(events, row.id, row.name, row.url, row.verifiedAt, window, false);
      continue;
    }
    if (row.guideBasis === '2027_guide' || row.role !== 'current_target' || row.cycleYear !== 2028 || !isAdmissionCategory(row.category)) continue;
    for (const window of ADMISSION_WINDOWS) pushWindow(events, row.id, row.name, row.url, row.verifiedAt, window, false);
  }
  return events.sort((a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title, 'ko'));
}

export function undatedChosen(chosenIds: readonly string[]): { id: string; name: string }[] {
  const dated = new Set(collectDeadlines(chosenIds).map((event) => event.trackId));
  const notes: { id: string; name: string }[] = [];
  for (const id of chosenIds) {
    const row = schemaTrack(id);
    if (!row || dated.has(row.id) || row.category === 'calendar' || row.category === 'post_graduation_stay') continue;
    if (row.guideBasis !== '2027_guide') continue;
    notes.push({ id: row.id, name: row.name });
  }
  return notes;
}

/** Exam dates plus verified windows. `collectDeadlines` stays the track-window list. */
export function allDates(chosenIds: readonly string[]): Deadline[] {
  const exams: Deadline[] = DDAY_SCHEDULES.map((exam) => ({
    id: exam.id,
    title: exam.title,
    start: exam.dateStr,
    end: exam.endDateStr ?? exam.dateStr,
    sourceUrl: exam.sourceUrl,
    verifiedAt: exam.verifiedOn.slice(0, 7),
    trackId: exam.id,
    shared: true,
    appliesTo: [exam.target],
  }));
  return [...collectDeadlines(chosenIds), ...exams].sort((a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title, 'ko'));
}

/** Next date that has not started yet, in Seoul civil time. A window that began yesterday is not “next”. */
export function nextUpcoming(chosenIds: readonly string[], today: string): Deadline | null {
  return (
    allDates(chosenIds)
      .filter((item) => item.start >= today)
      .sort((a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title, 'ko'))[0] ?? null
  );
}

/** Upcoming and open dates first, then past dates newest-first. */
export function datesForDisplay(chosenIds: readonly string[], today: string): Deadline[] {
  const rank = (item: Deadline) => (item.start >= today ? 0 : item.end >= today ? 1 : 2);
  return [...allDates(chosenIds)].sort((a, b) => {
    const order = rank(a) - rank(b);
    if (order !== 0) return order;
    return rank(a) === 2 ? b.start.localeCompare(a.start) : a.start.localeCompare(b.start);
  });
}

export function ddayState(start: string, end: string, today: string): DdayState {
  const untilStart = daysUntil(start, today);
  const untilEnd = daysUntil(end, today);
  if (untilStart > 0) return { phase: 'upcoming', days: untilStart };
  if (untilEnd < 0) return { phase: 'past', days: -untilEnd };
  if (untilStart === 0) return { phase: 'open', days: 0 };
  return { phase: 'open', days: untilEnd };
}
