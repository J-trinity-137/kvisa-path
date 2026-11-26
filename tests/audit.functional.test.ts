import { describe, expect, it } from 'vitest';
import { nextDeadline, rosterRows } from '../src/accounts/roster';
import { createAccount, createClass, emptyDemo, joinClass, approveEnrollment, withProfile } from '../src/accounts/model';
import { compareColumns } from '../src/compare/model';
import { boardPosts, filterBoard } from '../src/data/board';
import { collectIntegrityErrors } from '../src/data/integrity';
import { FOREIGN_TRACKS } from '../src/data/foreignTracks';
import { PATHWAYS_2028 } from '../src/data/pathways2028';
import { REGION_IDS } from '../src/data/freshness';
import { TARGET_2028_WINDOWS } from '../src/data/trackSchema';
import { collectDeadlines, nextUpcoming } from '../src/deadlines/list';
import { seoulDate } from '../src/deadlines/seoul';
import { SUPPORTED_LANGS } from '../src/kbridge';
import { EMPTY_PROFILE, type StudentProfile } from '../src/profile/profile';
import { DEMO_STORAGE_KEY } from '../src/accounts/persist';
import { COMPARE_KEY, SAVED_TRACKS_KEY, clearMyRecords } from '../src/privacy/records';
import { admissionTracks, explainTracks } from '../src/rules/evaluate';
import { ruleFailures } from '../src/rules/reasons';
import type { EligibleTrack } from '../src/rules/types';

function profile(partial: Partial<StudentProfile>): StudentProfile {
  return { ...EMPTY_PROFILE, skipped: [], homeLanguages: [], interests: [], supportNeeds: [], ...partial };
}

const high = {
  grade: 'high' as const,
  region: 'seoul' as const,
  koreanLevel: 'topik_3_4' as const,
  schoolType: 'general' as const,
  age: 17,
  yearsSchoolingAbroad: 0,
  bornAbroad: false,
};

const UNIVERSITY = new Set([
  'multicultural',
  'foreign_special',
  'overseas_12yr',
  'overseas_3yr',
  'foreign_school_graduate',
  'international_college',
  'scholarship',
  'junior_college',
]);

function listed(row: StudentProfile): EligibleTrack[] {
  return admissionTracks(explainTracks(row).tracks);
}

function ids(row: StudentProfile): string[] {
  return listed(row).map((track) => track.id);
}

describe('persona tracks match the published rows', () => {
  const cases: { name: string; profile: StudentProfile; include: string[]; exclude: string[] }[] = [
    {
      name: '국내출생 다문화 한국국적',
      profile: profile({ ...high, studentType: 'domestic_multicultural', parentForeign: 'father', fatherCountry: 'VN', koreanNationality: true, bornAbroad: false, goal: 'study' }),
      include: ['korea-2028-multicultural', 'multi-univ'],
      exclude: ['snu-2028-global-1', 'univ-multicultural-eq', 'ft-snu-global-1', 'ft-hanyang-korean-bridge'],
    },
    {
      name: '중도입국 외국국적 부모 모두 외국인',
      profile: profile({ ...high, studentType: 'mid_entry', parentForeign: 'both', koreanNationality: false, bornAbroad: true, yearsSchoolingAbroad: 4, yearArrived: 2022, koreanLevel: 'topik_5_6' }),
      include: ['snu-2028-global-1', 'korea-2028-foreign-special'],
      exclude: ['korea-2028-multicultural', 'multi-univ', 'ft-snu-global-1', 'univ-foreign-parents', 'ft-hanyang-korean-bridge', 'ft-kw-korean-bridge'],
    },
    {
      name: '부모 중 1명 외국인',
      profile: profile({ ...high, parentForeign: 'mother', motherCountry: 'CN', koreanNationality: true, bornAbroad: false }),
      include: ['korea-2028-multicultural'],
      exclude: ['snu-2028-global-1', 'univ-foreign-parents', 'ft-skku-2028-3-12'],
    },
    {
      name: '외국인학교 졸업',
      profile: profile({ ...high, age: 18, schoolType: 'foreign_school', parentForeign: 'both', koreanNationality: false, studentType: 'foreign_family' }),
      include: ['ft-domestic-foreign-school-credit'],
      exclude: ['ft-gks-u-2027', 'ft-yonsei-intl-track-ged', 'ft-jeju-domestic-foreign-school', 'snu-2028-global-1', 'korea-2028-multicultural'],
    },
    {
      name: '해외 12년 전과정',
      profile: profile({ ...high, parentForeign: 'neither', koreanNationality: true, bornAbroad: true, yearsSchoolingAbroad: 12, yearArrived: 2024 }),
      include: ['ft-korea-2028-3-12', 'ft-skku-2028-3-12'],
      exclude: ['korea-2028-multicultural', 'multi-univ', 'multi-scholarship', 'snu-2028-global-1'],
    },
    {
      name: '해외 3년',
      profile: profile({ ...high, parentForeign: 'neither', koreanNationality: true, bornAbroad: true, yearsSchoolingAbroad: 3, yearArrived: 2023 }),
      include: ['ft-korea-2028-3-12', 'ft-ajou-2028-3-12'],
      exclude: ['korea-2028-multicultural', 'multi-univ', 'snu-2028-global-1'],
    },
    {
      name: '검정고시',
      profile: profile({ ...high, age: 18, schoolType: 'ged', parentForeign: 'both', koreanNationality: false, studentType: 'foreign_family', koreanLevel: 'topik_5_6' }),
      include: ['ft-yonsei-intl-track-ged'],
      exclude: ['snu-2028-global-1', 'kookmin-2028-both-parents-foreign', 'korea-2028-multicultural', 'univ-foreign-parents'],
    },
    {
      name: '북한이탈 제3국 출생',
      profile: profile({ ...high, nkThirdCountryBorn: true, koreanNationality: true, bornAbroad: true, parentForeign: 'neither' }),
      include: ['ft-nk-third-country-child'],
      exclude: ['ft-kcue-nk-2028', 'korea-2028-multicultural', 'snu-2028-global-1', 'multi-univ'],
    },
    {
      name: '초등학생',
      profile: profile({ grade: 'elementary', age: 10, region: 'seoul', studentType: 'domestic_multicultural', parentForeign: 'father', koreanNationality: true, bornAbroad: false, koreanLevel: 'beginner' }),
      include: [],
      exclude: ['korea-2028-multicultural', 'multi-scholarship', 'snu-2028-global-1', 'hs-vocational-future', 'kopo-dasom-high'],
    },
    {
      name: '중학생 고입',
      profile: profile({ grade: 'middle', age: 14, region: 'seoul', studentType: 'mid_entry', parentForeign: 'both', koreanNationality: false, bornAbroad: true, yearsSchoolingAbroad: 3, koreanLevel: 'beginner' }),
      include: ['hs-special-2c'],
      exclude: ['korea-2028-multicultural', 'snu-2028-global-1', 'multi-scholarship', 'ft-yonsei-intl-track-ged'],
    },
    {
      name: '특성화고 지망',
      profile: profile({ grade: 'middle', age: 15, region: 'seoul', studentType: 'domestic_multicultural', parentForeign: 'father', koreanNationality: true, bornAbroad: false, interests: ['it', 'design'], goal: 'work', schoolType: 'general', koreanLevel: 'topik_3_4' }),
      include: ['vocational-schools', 'hs-vocational-future', 'kopo-dasom-high'],
      exclude: ['korea-2028-multicultural', 'multi-scholarship', 'snu-2028-global-1', 'multi-univ'],
    },
  ];

  it.each(cases)('$name', ({ profile: row, include, exclude }) => {
    const tracks = listed(row);
    const found = tracks.map((track) => track.id);
    for (const id of include) expect(found, id).toContain(id);
    for (const id of exclude) expect(found, id).not.toContain(id);
    const keys = new Set<string>();
    for (const track of tracks) {
      expect(track.verified, track.id).toBe(true);
      expect(track.verifiedAt, track.id).toMatch(/^\d{4}-\d{2}/);
      expect(track.sourceUrl, track.id).toMatch(/^https?:\/\//);
      const key = `${track.sourceUrl}|${track.title}`;
      expect(keys.has(key), track.id).toBe(false);
      keys.add(key);
      if (row.grade === 'elementary' || row.grade === 'middle') {
        expect(UNIVERSITY.has(track.category ?? ''), track.id).toBe(false);
      }
    }
    for (const track of explainTracks(row).tracks) {
      if (!track.verified) expect.fail(`${track.id} is not verified`);
    }
  });

  it('keeps a foreign national with 12 years of school abroad on the 12-year rows', () => {
    const found = ids(profile({ ...high, koreanNationality: false, parentForeign: 'both', bornAbroad: true, yearsSchoolingAbroad: 12, studentType: 'foreign_family' }));
    expect(found).toContain('ft-korea-2028-3-12');
    expect(found).not.toContain('korea-2028-multicultural');
  });
});

describe('dates stay on Seoul civil time', () => {
  it('does not treat yesterday in Seoul as the next date', () => {
    const now = new Date('2026-11-25T15:30:00Z');
    expect(seoulDate(now)).toBe('2026-11-26');
    const track = {
      id: 'x',
      kind: 'admission' as const,
      title: '지난 일정',
      reason: '',
      yearLabel: '2026-11-25',
      details: [],
      verified: true,
      sort: 1,
      reasons: [],
    };
    expect(nextDeadline([track], now)).toBeNull();
    expect(nextUpcoming([], seoulDate(now))!.start >= '2026-11-26').toBe(true);
  });

  it('does not invent 2028 national windows for 2027 reference rows', () => {
    const invented = new Set<string>([TARGET_2028_WINDOWS.susi.start, TARGET_2028_WINDOWS.jeongsi.start]);
    for (const row of [...PATHWAYS_2028, ...FOREIGN_TRACKS]) {
      const reference = row.guideBasis === '2027_guide' || row.cycleYear === 2027 || row.role === 'closed_reference';
      if (!reference) continue;
      const owned = new Set(row.windows.map((window) => window.start));
      for (const event of collectDeadlines([row.id])) {
        if (event.trackId !== row.id) continue;
        if (invented.has(event.start)) expect(owned.has(event.start), row.id).toBe(true);
      }
    }
  });
});

describe('compare, save, and clear', () => {
  it('highlights a track the profile fails and leaves a kept track clean', () => {
    const foreignSchool = profile({ ...high, schoolType: 'foreign_school', parentForeign: 'both', koreanNationality: false, studentType: 'foreign_family' });
    expect(ruleFailures(foreignSchool, 'ft-gks-u-2027').some((fail) => fail.row === 'school')).toBe(true);
    const neither = profile({ ...high, parentForeign: 'neither', koreanNationality: true, bornAbroad: true, yearsSchoolingAbroad: 12 });
    expect(ruleFailures(neither, 'korea-2028-multicultural').map((fail) => fail.code)).toContain('not_multicultural_family');
    const ged = profile({ ...high, schoolType: 'ged', parentForeign: 'both', koreanNationality: false, koreanLevel: 'topik_5_6' });
    expect(ruleFailures(ged, 'ft-khu-foreign-2027').some((fail) => fail.code === 'school_type')).toBe(true);
    const kept = listed(profile({ ...high, studentType: 'domestic_multicultural', parentForeign: 'father', koreanNationality: true }));
    for (const track of kept) expect(ruleFailures(profile({ ...high, studentType: 'domestic_multicultural', parentForeign: 'father', koreanNationality: true }), track.id), track.id).toEqual([]);
    const columns = compareColumns(['korea-2028-multicultural', 'snu-2028-global-1'], neither);
    expect(columns.find((column) => column.id === 'korea-2028-multicultural')?.failRows).toContain('nationality');
    expect(columns).toHaveLength(2);
  });

  it('clears saved tracks, compare, and demo accounts', () => {
    const mem = new Map<string, string>();
    const localStorage = {
      getItem: (key: string) => (mem.has(key) ? mem.get(key)! : null),
      setItem: (key: string, value: string) => void mem.set(key, value),
      removeItem: (key: string) => void mem.delete(key),
      clear: () => mem.clear(),
      key: () => null,
      get length() {
        return mem.size;
      },
    };
    Object.defineProperty(globalThis, 'window', { value: { localStorage, dispatchEvent: () => true, indexedDB: undefined }, configurable: true });
    Object.defineProperty(globalThis, 'localStorage', { value: localStorage, configurable: true });
    mem.set(SAVED_TRACKS_KEY, '["korea-2028-multicultural"]');
    mem.set(COMPARE_KEY, '["korea-2028-multicultural"]');
    mem.set(DEMO_STORAGE_KEY, '{"version":1,"accounts":[{"id":"s"}]}');
    clearMyRecords();
    expect(mem.has(SAVED_TRACKS_KEY)).toBe(false);
    expect(mem.has(COMPARE_KEY)).toBe(false);
    expect(mem.has(DEMO_STORAGE_KEY)).toBe(false);
    Reflect.deleteProperty(globalThis, 'window');
    Reflect.deleteProperty(globalThis, 'localStorage');
  });
});

describe('board search and regions', () => {
  const posts = boardPosts();

  it('searches Korean and the other seven languages', () => {
    expect(filterBoard(posts, { q: '장학금' }).length).toBeGreaterThan(0);
    const mongolian = filterBoard(posts, { q: 'Тэтгэлэг' });
    expect(mongolian.length).toBeGreaterThan(0);
    expect(mongolian.some((post) => post.category === 'scholarship')).toBe(true);
    expect(filterBoard(posts, { q: 'Busan' }).some((post) => post.region === 'busan')).toBe(true);
    expect(filterBoard(posts, { q: '부산' }).some((post) => post.region === 'busan')).toBe(true);
    expect(filterBoard(posts, { q: 'not-a-real-track-xyz' }).length).toBe(0);
  });

  it('filters each of the 17 시도 and keeps a check month', () => {
    expect(REGION_IDS).toHaveLength(17);
    for (const region of REGION_IDS) {
      const rows = filterBoard(posts, { region });
      expect(rows.length, region).toBeGreaterThan(0);
      expect(rows.every((post) => post.region === region || post.region === 'all')).toBe(true);
    }
    for (const post of posts) expect(post.verifiedAt, post.id).toMatch(/^\d{4}-\d{2}/);
  });
});

describe('teacher roster matches the student home count', () => {
  it('uses the same admission tracks and a Seoul date', () => {
    const teacher = createAccount(emptyDemo(), { nickname: '선생', role: 'teacher', lang: 'ko', now: '2026-11-26T00:00:00.000Z' });
    if (!teacher.ok) throw new Error(teacher.error);
    const student = createAccount(teacher.db, { nickname: '학생', role: 'student', lang: 'ar', now: '2026-11-26T00:00:00.000Z', ageBand: '14p' });
    if (!student.ok) throw new Error(student.error);
    const room = createClass(student.db, teacher.value.id, '고입반', '2026-11-26T00:00:00.000Z');
    if (!room.ok) throw new Error(room.error);
    const joined = joinClass(room.db, student.value.id, room.value.code, '2026-11-26T01:00:00.000Z');
    if (!joined.ok) throw new Error(joined.error);
    const approved = approveEnrollment(joined.db, teacher.value.id, room.value.id, student.value.id, '2026-11-26T02:00:00.000Z');
    if (!approved.ok) throw new Error(approved.error);
    const answers = profile({ grade: 'middle', age: 15, region: 'seoul', studentType: 'domestic_multicultural', parentForeign: 'father', koreanNationality: true, interests: ['it'], goal: 'work' });
    const saved = withProfile(approved.db, student.value.id, answers);
    const row = rosterRows(saved, room.value.id, new Date('2026-11-25T16:00:00Z'))[0];
    const own = listed(answers);
    expect(row?.tracks.map((track) => track.id)).toEqual(own.map((track) => track.id));
    expect(own.some((track) => UNIVERSITY.has(track.category ?? ''))).toBe(false);
    expect(row?.tracks.some((track) => track.id === 'kopo-dasom-high')).toBe(true);
  });
});

describe('data integrity', () => {
  it('validates json rows, ids, sources, and verified-only board posts', () => {
    expect(collectIntegrityErrors()).toEqual([]);
  });
});

describe('parent notice languages', () => {
  it('has a notice string in every language', async () => {
    const { accountsCopy } = await import('../src/i18n/accountsCopy');
    for (const lang of SUPPORTED_LANGS) {
      const copy = accountsCopy(lang);
      expect(copy.noticeTitle.length).toBeGreaterThan(0);
      expect(copy.printNotice.length).toBeGreaterThan(0);
    }
  });
});
