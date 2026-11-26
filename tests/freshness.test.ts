import { describe, expect, it } from 'vitest';
import { EXTERNAL_SCHOLARSHIPS, SEOUL_VOCATIONAL_SCHOOLS, UNIVERSITY_GED_RULES, UNIVERSITY_SCHOLARSHIP_RULES } from '../src/data/admissionsData';
import { GYEONGGI_SUPPORT_CENTERS, SEOUL_SUPPORT_CENTERS } from '../src/data/centersData';
import { GYEONGGI_FAMILY_CENTERS, GYEONGGI_KLS } from '../src/data/gyeonggiData';
import { isOlderThanYear } from '../src/data/freshness';
import { DDAY_SCHEDULES } from '../src/data/interactiveModules';
import { MULTICULTURAL_SECTIONS } from '../src/data/multiculturalPath';
import { MULTICULTURAL_TRACKS } from '../src/data/multiculturalTracks';
import { FOREIGN_TRACKS } from '../src/data/foreignTracks';
import { PATHWAYS_2028 } from '../src/data/pathways2028';
import { PROCEDURES } from '../src/data/procedures';
import { STUDENT_TYPE_KEY, STUDENT_TYPES, writeStudentType } from '../src/data/studentType';
import { VISA_PATHS } from '../src/data/visaPaths';

function months(items: readonly { verifiedAt?: string }[], label: string) {
  const missing = items.filter((item) => !/^\d{4}-\d{2}$/.test(item.verifiedAt ?? ''));
  expect(missing, label).toEqual([]);
}

describe('verified dates', () => {
  it('stamps every checked entry with YYYY-MM', () => {
    months(SEOUL_VOCATIONAL_SCHOOLS, 'schools');
    months(Object.values(UNIVERSITY_GED_RULES), 'ged');
    months(Object.values(UNIVERSITY_SCHOLARSHIP_RULES), 'scholarship');
    months(EXTERNAL_SCHOLARSHIPS, 'external');
    months(VISA_PATHS, 'visa');
    months(SEOUL_SUPPORT_CENTERS, 'centers');
    months(DDAY_SCHEDULES, 'schedules');
    months(PROCEDURES, 'procedures');
    months(MULTICULTURAL_TRACKS, 'tracks');
    months(PATHWAYS_2028, 'pathways2028');
    months(FOREIGN_TRACKS, 'foreignTracks');
  });

  it('keeps Seoul rows on seoul and leaves Gyeonggi empty', () => {
    expect(SEOUL_VOCATIONAL_SCHOOLS.every((school) => school.region === 'seoul')).toBe(true);
    expect(SEOUL_SUPPORT_CENTERS.every((center) => center.region === 'seoul')).toBe(true);
    expect(GYEONGGI_SUPPORT_CENTERS).toHaveLength(GYEONGGI_FAMILY_CENTERS.length);
    expect(GYEONGGI_SUPPORT_CENTERS.every((center) => center.region === 'gyeonggi')).toBe(true);
    expect(GYEONGGI_KLS.length).toBeGreaterThan(30);
  });

  it('flags a check older than 12 months and keeps 2026-11 current', () => {
    const today = new Date('2026-11-26T00:00:00Z');
    expect(isOlderThanYear('2026-11', today)).toBe(false);
    expect(isOlderThanYear('2025-10', today)).toBe(true);
  });

  it('fills multicultural sections only when verified rows exist', () => {
    expect(MULTICULTURAL_SECTIONS.map((section) => section.id)).toEqual([
      'school-supports',
      'bilingual-programs',
      'bilingual-careers',
      'scholarships',
    ]);
    expect(MULTICULTURAL_SECTIONS.every((section) => section.itemIds.length > 0)).toBe(true);
    expect(STUDENT_TYPES).toEqual(['foreign_family', 'mid_entry', 'domestic_multicultural', 'unsure']);
  });

  it('stores the student type on device and not inside the event log', () => {
    const mem = new Map<string, string>();
    Object.defineProperty(globalThis, 'window', {
      value: { localStorage: { setItem: (key: string, value: string) => mem.set(key, value), getItem: (key: string) => mem.get(key) ?? null } },
      configurable: true,
    });
    writeStudentType('domestic_multicultural');
    expect(mem.get(STUDENT_TYPE_KEY)).toBe('domestic_multicultural');
    expect(JSON.stringify([...mem.keys()])).not.toContain('events');
    Reflect.deleteProperty(globalThis, 'window');
  });
});
