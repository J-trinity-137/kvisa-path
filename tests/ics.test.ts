import { describe, expect, it } from 'vitest';
import { DDAY_SCHEDULES } from '../src/data/interactiveModules';
import { collectDeadlines } from '../src/deadlines/list';
import { eventsToIcs, foldLine, scheduleToIcs, type CalendarEvent } from '../src/share/ics';

function unfold(ics: string): string {
  return ics.replace(/\r\n[ \t]/g, '');
}

function linesOf(ics: string): string[] {
  return ics.split('\r\n').filter((line) => line.length > 0);
}

describe('calendar export', () => {
  it('writes a valid all-day Asia/Seoul calendar on this device', () => {
    const events: CalendarEvent[] = collectDeadlines(['korea-2028-multicultural']).map((item) => ({
      uid: `${item.id}@kvisa-path`,
      title: item.title,
      start: item.start,
      end: item.end,
      description: `${item.verifiedAt} ${item.sourceUrl}`,
      url: item.sourceUrl,
    }));
    const ics = eventsToIcs(events, new Date('2026-11-26T00:00:00Z'));
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    const flat = unfold(ics);
    expect(flat).toContain('VERSION:2.0');
    expect(flat).toContain('X-WR-TIMEZONE:Asia/Seoul');
    expect(flat).toContain('TZID:Asia/Seoul');
    expect(flat).toContain('TZOFFSETFROM:+0900');
    expect(flat).toContain('TZOFFSETTO:+0900');
    expect(flat).toContain('TZNAME:KST');
    expect(flat).toContain('DTSTART;VALUE=DATE:20270920');
    expect(flat).toContain('DTEND;VALUE=DATE:20270924');
    expect(flat).toContain('DTSTART;VALUE=DATE:20280103');
    expect(flat).toContain('DTEND;VALUE=DATE:20280107');
    expect(flat).toContain('DTSTAMP:20261126T000000Z');
    const eventsOnly = flat.split('BEGIN:VEVENT').slice(1).join('\n');
    expect(eventsOnly).not.toMatch(/DT(?:START|END)[^:\n]*:\d{8}T/);
    expect(flat).not.toContain('F-2');
    expect(flat).not.toContain('체류자격');
    for (const line of linesOf(ics)) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
    const susi = flat.split('BEGIN:VEVENT').find((block) => block.includes('DTSTART;VALUE=DATE:20270920'));
    expect(susi).toContain('END:VEVENT');
    expect(susi).toContain('UID:');
    expect(susi).toContain('SUMMARY:');
  });

  it('ends a one-day event on the next civil date and escapes text', () => {
    const ics = eventsToIcs(
      [
        {
          uid: 'topik,112@kvisa-path',
          title: 'TOPIK; 제112회',
          start: '2027-05-16',
          end: '2027-05-16',
          description: 'line\nnext',
          url: 'https://www.niied.go.kr/convert/preview/1794882279397/index.html',
        },
      ],
      new Date('2026-11-26T00:00:00Z'),
    );
    const flat = unfold(ics);
    expect(flat).toContain('DTSTART;VALUE=DATE:20270516');
    expect(flat).toContain('DTEND;VALUE=DATE:20270517');
    expect(flat).toContain('SUMMARY:TOPIK\\; 제112회');
    expect(flat).toContain('UID:topik\\,112@kvisa-path');
    expect(flat).toContain('DESCRIPTION:line\\nnext');
    expect(flat).not.toContain('DTSTART;VALUE=DATE:20270515');
  });

  it('drops an impossible date and still closes the calendar', () => {
    const ics = eventsToIcs([{ uid: 'bad', title: 'Bad', start: '2027-02-31', end: '2027-02-31' }]);
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).not.toContain('BEGIN:VEVENT');
  });

  it('keeps the older schedule export as a calendar file', () => {
    const ics = scheduleToIcs(DDAY_SCHEDULES[0]!);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('DTSTART;VALUE=DATE:20261019');
    expect(ics).toContain('DTEND;VALUE=DATE:20261023');
    expect(ics).toContain('TZID:Asia/Seoul');
    expect(ics).not.toContain('F-2');
    expect(ics).not.toContain('미등록');
    expect(foldLine('x'.repeat(80)).includes('\r\n ')).toBe(true);
  });
});
