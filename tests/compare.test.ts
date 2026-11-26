import { afterEach, describe, expect, it } from 'vitest';
import { windowText } from '../src/compare/format';
import { compareColumns } from '../src/compare/model';
import { collectDeadlines, ddayState, undatedChosen } from '../src/deadlines/list';
import { nextIsoDate, seoulDate } from '../src/deadlines/seoul';
import { planCopy } from '../src/i18n/planCopy';
import { COMPARE_MAX, readCompare, toggleId, writeCompare, writeSaved } from '../src/library/tracks';
import { SUPPORTED_LANGS } from '../src/kbridge';
import { EMPTY_PROFILE, type StudentProfile } from '../src/profile/profile';
import { COMPARE_KEY, SAVED_TRACKS_KEY, clearMyRecords } from '../src/privacy/records';
import { eligibleTracks } from '../src/rules/evaluate';
import { REASON_CODES, ruleFailures } from '../src/rules/reasons';

function profile(partial: Partial<StudentProfile>): StudentProfile {
  return { ...EMPTY_PROFILE, skipped: [], homeLanguages: [], interests: [], supportNeeds: [], ...partial };
}

function installMemoryStorage() {
  const mem = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => (mem.has(key) ? mem.get(key)! : null),
    setItem: (key: string, value: string) => {
      mem.set(key, value);
    },
    removeItem: (key: string) => {
      mem.delete(key);
    },
    clear: () => mem.clear(),
    key: () => null,
    get length() {
      return mem.size;
    },
  };
  Object.defineProperty(globalThis, 'window', { value: { localStorage, dispatchEvent: () => true }, configurable: true });
  Object.defineProperty(globalThis, 'localStorage', { value: localStorage, configurable: true });
  return mem;
}

const korean = profile({
  grade: 'high',
  region: 'seoul',
  studentType: 'domestic_multicultural',
  parentForeign: 'father',
  koreanNationality: true,
  koreanLevel: 'topik_3_4',
  goal: 'study',
});

describe('track comparison', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'window');
    Reflect.deleteProperty(globalThis, 'localStorage');
  });

  it('keeps at most four verified tracks and clears them with the device records', () => {
    const mem = installMemoryStorage();
    const ids = ['korea-2028-multicultural', 'sogang-2028-value', 'hongik-2028-opportunity-1', 'cau-2028-eoullim', 'ft-snu-global-1'];
    let current: string[] = [];
    for (const id of ids) {
      const next = toggleId(current, id, COMPARE_MAX);
      if (next.status === 'added') current = next.ids;
    }
    expect(current).toHaveLength(4);
    expect(toggleId(current, 'ft-snu-global-1', COMPARE_MAX).status).toBe('full');
    expect(toggleId(current, 'not-a-track', COMPARE_MAX).status).toBe('rejected');
    expect(toggleId(current, current[0]!, COMPARE_MAX).status).toBe('removed');
    writeCompare(current);
    expect(readCompare()).toEqual(current);
    writeSaved(['korea-2028-multicultural', 'visa-status']);
    expect(mem.get(SAVED_TRACKS_KEY)).not.toContain('visa');
    clearMyRecords();
    expect(mem.has(COMPARE_KEY)).toBe(false);
    expect(mem.has(SAVED_TRACKS_KEY)).toBe(false);
  });

  it('does not flag a track the rules engine already kept', () => {
    const samples = [
      korean,
      profile({
        grade: 'high',
        region: 'seoul',
        studentType: 'foreign_family',
        parentForeign: 'both',
        koreanNationality: false,
        koreanLevel: 'topik_5_6',
        goal: 'study',
      }),
      profile({
        grade: 'middle',
        region: 'seoul',
        studentType: 'mid_entry',
        bornAbroad: true,
        yearsSchoolingAbroad: 4,
        koreanNationality: false,
        koreanLevel: 'beginner',
        interests: ['it'],
        goal: 'work',
      }),
    ];
    for (const sample of samples) {
      for (const track of eligibleTracks(sample)) {
        expect(ruleFailures(sample, track.id), track.id).toEqual([]);
      }
    }
  });

  it('highlights nationality, TOPIK, and school rows the profile fails', () => {
    const foreignTrack = ruleFailures(korean, 'ft-snu-global-1');
    expect(foreignTrack.map((fail) => fail.code)).toContain('needs_foreign_national');
    const topik = ruleFailures(korean, 'ft-yonsei-both-parents');
    expect(topik).toContainEqual({ row: 'topik', code: 'topik_below', need: 5 });
    const beginner = profile({ ...korean, studentType: 'foreign_family', parentForeign: 'both', koreanNationality: false, koreanLevel: 'beginner' });
    expect(ruleFailures(beginner, 'ft-kookmin-2028').some((fail) => fail.row === 'topik')).toBe(false);
    expect(ruleFailures(profile({ ...korean, grade: 'middle' }), 'korea-2028-multicultural')).toContainEqual({
      row: 'school',
      code: 'grade_not_eligible',
    });
    const early = profile({ grade: 'high', bornAbroad: true, yearArrived: 2022, schoolType: 'not_enrolled' });
    const stay = ruleFailures(early, 'stay-d10-e7y-f2r', '2026-11-26');
    expect(stay).toContainEqual({ row: 'school', code: 'years_in_korea', need: 7 });
    expect(stay).toContainEqual({ row: 'school', code: 'domestic_school' });
    expect(ruleFailures(profile({ ...early, yearArrived: 2010, schoolType: 'general' }), 'stay-d10-e7y-f2r', '2026-11-26')).toEqual([]);
  });

  it('labels the application window as 2028 or the 2027 guide', () => {
    const columns = compareColumns(['korea-2028-multicultural', 'ft-khu-foreign-2027', 'ft-snu-global-1'], korean);
    expect(columns.map((column) => column.window.kind)).toEqual(['cycle2028', 'guide2027', 'cycle2028']);
    expect(windowText('ko', columns[0]!)).toContain('2028학년도');
    expect(windowText('ko', columns[0]!)).toContain('2027-09-20');
    expect(windowText('ko', columns[1]!)).toBe('2027 요강 기준');
    expect(columns[0]?.university).toBe('고려대(서울)');
    expect(columns[0]?.quota?.seats).toBe(20);
    expect(columns[0]?.verifiedAt).toBe('2026-11');
    expect(columns[0]?.sourceUrl?.startsWith('https://')).toBe(true);
    for (const lang of SUPPORTED_LANGS) {
      const copy = planCopy(lang);
      expect(copy.guide2027.length).toBeGreaterThan(0);
      expect(copy.navCompare.length).toBeGreaterThan(0);
      expect(Object.keys(copy.reasons)).toEqual([...REASON_CODES]);
      for (const code of REASON_CODES) expect(copy.reasons[code].length).toBeGreaterThan(0);
    }
    expect(planCopy('ko').guide2027).toBe('2027 요강 기준');
  });
});

describe('deadlines', () => {
  it('counts D-day on Seoul civil dates and skips unverified windows', () => {
    expect(seoulDate(new Date('2026-11-25T15:30:00Z'))).toBe('2026-11-26');
    expect(seoulDate(new Date('2026-11-25T14:30:00Z'))).toBe('2026-11-25');
    expect(nextIsoDate('2027-09-23')).toBe('2027-09-24');
    expect(nextIsoDate('2027-12-31')).toBe('2028-01-01');
    expect(ddayState('2027-09-20', '2027-09-23', '2027-09-01')).toEqual({ phase: 'upcoming', days: 19 });
    expect(ddayState('2027-09-20', '2027-09-23', '2027-09-20')).toEqual({ phase: 'open', days: 0 });
    expect(ddayState('2027-09-20', '2027-09-23', '2027-09-22').phase).toBe('open');
    expect(ddayState('2027-09-20', '2027-09-23', '2027-09-24')).toEqual({ phase: 'past', days: 1 });
    const shared = collectDeadlines([]);
    expect(shared.map((item) => item.id)).toContain('cal-09:susi-2028');
    expect(shared.map((item) => item.id)).toContain('cal-01:jeongsi-2028');
    expect(shared.every((item) => item.verifiedAt === '2026-11')).toBe(true);
    expect(shared.some((item) => item.trackId.startsWith('stay-'))).toBe(false);
    const chosen = collectDeadlines(['korea-2028-multicultural', 'ft-khu-foreign-2027', 'stay-d10-e7y-f2r']);
    const susi = chosen.find((item) => item.id === 'cal-09:susi-2028');
    expect(susi?.appliesTo.some((name) => name.includes('고려대'))).toBe(true);
    expect(chosen.filter((item) => item.start === '2027-09-20')).toHaveLength(1);
    expect(chosen.some((item) => item.trackId === 'ft-khu-foreign-2027')).toBe(false);
    expect(chosen.some((item) => item.trackId === 'stay-d10-e7y-f2r')).toBe(false);
    expect(undatedChosen(['ft-khu-foreign-2027']).map((item) => item.id)).toEqual(['ft-khu-foreign-2027']);
    const starts = chosen.map((item) => item.start);
    expect([...starts].sort()).toEqual(starts);
  });
});
