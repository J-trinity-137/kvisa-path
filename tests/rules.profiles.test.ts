import { describe, expect, it } from 'vitest';
import { EMPTY_PROFILE, type StudentProfile } from '../src/profile/profile';
import { explainTracks } from '../src/rules/evaluate';
import { WHY_CODES, type WhyCode } from '../src/rules/types';

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

describe('representative profiles', () => {
  const cases: {
    name: string;
    profile: StudentProfile;
    include: string[];
    exclude: string[];
    reasons: { id: string; codes: WhyCode[] };
    withheld: WhyCode[];
  }[] = [
    {
      name: '국내출생 다문화 Korean national',
      profile: profile({
        ...high,
        studentType: 'domestic_multicultural',
        parentForeign: 'father',
        koreanNationality: true,
        goal: 'study',
      }),
      include: ['korea-2028-multicultural', 'multi-univ', 'univ-multicultural-eq'],
      exclude: ['univ-foreign-parents', 'ft-snu-global-1', 'kcue-2028-both-parents-foreign', 'law-decree-89-2', 'ged-alien-registration-card', 'ft-nk-third-country-child', 'ft-domestic-foreign-school-credit', 'ft-skku-2028-3-12'],
      reasons: { id: 'korea-2028-multicultural', codes: ['korean_national', 'one_parent_foreign', 'domestic_born'] },
      withheld: ['not_mid_entry', 'not_nk', 'not_ged', 'not_foreign_school', 'not_both_parents'],
    },
    {
      name: '중도입국 foreign nationality, both parents foreign',
      profile: profile({
        ...high,
        studentType: 'mid_entry',
        parentForeign: 'both',
        koreanNationality: false,
        bornAbroad: true,
        yearsSchoolingAbroad: 4,
        koreanLevel: 'topik_5_6',
      }),
      include: ['univ-foreign-parents', 'kcue-2028-both-parents-foreign', 'ft-snu-global-1', 'law-decree-89-2'],
      exclude: ['korea-2028-multicultural', 'multi-univ', 'univ-multicultural-eq', 'ft-nk-third-country-child', 'ged-alien-registration-card', 'ft-skku-2028-3-12', 'ft-domestic-foreign-school-credit'],
      reasons: { id: 'ft-snu-global-1', codes: ['foreign_national', 'both_parents_foreign'] },
      withheld: ['not_korean_national', 'not_overseas_posting', 'not_nk'],
    },
    {
      name: 'one parent foreign and Korean nationality',
      profile: profile({
        ...high,
        studentType: null,
        parentForeign: 'mother',
        koreanNationality: true,
      }),
      include: ['korea-2028-multicultural', 'univ-multicultural-eq'],
      exclude: ['univ-foreign-parents', 'ft-snu-global-1', 'law-decree-89-2'],
      reasons: { id: 'univ-multicultural-eq', codes: ['korean_national', 'one_parent_foreign'] },
      withheld: ['not_both_parents', 'not_mid_entry'],
    },
    {
      name: '외국인학교 졸업',
      profile: profile({
        ...high,
        age: 18,
        schoolType: 'foreign_school',
        parentForeign: 'both',
        koreanNationality: false,
        studentType: 'foreign_family',
      }),
      include: ['ft-domestic-foreign-school-credit', 'ft-jeju-domestic-foreign-school'],
      exclude: ['ft-snu-global-1', 'korea-2028-multicultural', 'cau-2028-eoullim', 'ft-skku-2028-3-12', 'univ-foreign-parents'],
      reasons: { id: 'ft-domestic-foreign-school-credit', codes: ['foreign_school'] },
      withheld: ['foreign_school_excluded'],
    },
    {
      name: '검정고시',
      profile: profile({
        ...high,
        age: 18,
        schoolType: 'ged',
        parentForeign: 'both',
        koreanNationality: false,
        studentType: 'foreign_family',
        koreanLevel: 'topik_5_6',
      }),
      include: ['ged-alien-registration-card'],
      exclude: ['ft-khu-foreign-2027', 'ft-kookmin-2028', 'univ-foreign-parents', 'korea-2028-multicultural', 'kopo-dasom-high'],
      reasons: { id: 'ged-alien-registration-card', codes: ['ged'] },
      withheld: ['ged_rejected', 'ged_unconfirmed'],
    },
    {
      name: '북한이탈 제3국 출생',
      profile: profile({
        ...high,
        nkThirdCountryBorn: true,
        koreanNationality: true,
        bornAbroad: true,
        parentForeign: 'neither',
        studentType: null,
      }),
      include: ['ft-nk-third-country-child'],
      exclude: ['ft-kcue-nk-2028', 'ft-snu-nk-2028', 'korea-2028-multicultural', 'ft-snu-global-1', 'univ-multicultural-eq'],
      reasons: { id: 'ft-nk-third-country-child', codes: ['nk_third_country'] },
      withheld: ['not_nk'],
    },
    {
      name: 'under 14',
      profile: profile({
        grade: 'elementary',
        age: 10,
        region: 'seoul',
        studentType: 'domestic_multicultural',
        parentForeign: 'father',
        koreanNationality: true,
        bornAbroad: false,
        koreanLevel: 'beginner',
      }),
      include: ['law-decree-19'],
      exclude: ['korea-2028-multicultural', 'ft-snu-global-1', 'ged-alien-registration-card', 'ft-nk-third-country-child', 'kopo-dasom-high', 'law-decree-89-2', 'univ-foreign-parents', 'hs-special-2c'],
      reasons: { id: 'law-decree-19', codes: ['mid_entry'] },
      withheld: ['too_young'],
    },
  ];

  it.each(cases)('$name', ({ profile: row, include, exclude, reasons, withheld }) => {
    const explained = explainTracks(row);
    const ids = explained.tracks.map((track) => track.id);
    for (const id of include) expect(ids, id).toContain(id);
    for (const id of exclude) expect(ids, id).not.toContain(id);
    const match = explained.tracks.find((track) => track.id === reasons.id);
    expect(match?.reasons).toEqual(expect.arrayContaining(reasons.codes));
    const codes = explained.withheld.map((item) => item.code);
    for (const code of withheld) expect(codes, code).toContain(code);
    for (const track of explained.tracks) {
      expect(track.verifiedAt, track.id).toMatch(/^\d{4}-\d{2}$/);
      expect(track.sourceUrl, track.id).toMatch(/^https:\/\//);
      expect(track.reasons.every((code) => (WHY_CODES as readonly string[]).includes(code))).toBe(true);
    }
    const closed = explained.tracks.filter((track) => track.referenceKind);
    if (row.grade === 'high' && row.schoolType !== 'foreign_school' && !row.nkThirdCountryBorn) {
      expect(closed.length).toBeGreaterThan(0);
    }
  });
});
