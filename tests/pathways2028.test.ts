import { describe, expect, it } from 'vitest';
import { MULTICULTURAL_TRACKS } from '../src/data/multiculturalTracks';
import { PATHWAYS_2028, pathwaySections } from '../src/data/pathways2028';
import {
  TARGET_2028_WINDOWS,
  TRACK_CATEGORIES,
  isShippedPathway,
  matchPathways,
  type TrackQuery,
} from '../src/data/trackSchema';
import { isSpecificHttpUrl } from '../src/data/validateFacts';
import { PATHWAYS_2028_COPY } from '../src/i18n/pathways2028Copy';
import { SUPPORTED_LANGS } from '../src/kbridge';

type NoVisaQuestion = Extract<keyof TrackQuery, 'visa' | 'residency' | 'residencyStatus'> extends never ? true : false;

describe('2028 pathway rows', () => {
  it('ships only verified rows, each with a specific url and a check month', () => {
    expect(PATHWAYS_2028).toHaveLength(47);
    expect(PATHWAYS_2028.some((row) => row.id === 'snu-2028-no-multicultural')).toBe(false);
    expect(PATHWAYS_2028.every(isShippedPathway)).toBe(true);
    for (const row of PATHWAYS_2028) {
      expect(row.status, row.id).toBe('verified');
      expect(row.verifiedAt, row.id).toBe('2026-11');
      expect(isSpecificHttpUrl(row.url), row.id).toBe(true);
      expect(row.quote.trim().length, row.id).toBeGreaterThan(0);
      expect(row.asksVisaOrResidency, row.id).toBe(false);
      expect(row.tiedToUserInput, row.id).toBe(false);
    }
    expect(PATHWAYS_2028.some((row) => row.name.includes('not_found'))).toBe(false);
    expect(PATHWAYS_2028.some((row) => row.name.includes('경희대'))).toBe(false);
    expect(PATHWAYS_2028.some((row) => row.name.includes('이화여대'))).toBe(false);
    expect(new Set(PATHWAYS_2028.map((row) => row.id)).size).toBe(PATHWAYS_2028.length);
  });

  it('keeps 2028 as the target cycle and 2027 tracks as closed reference', () => {
    const plan = PATHWAYS_2028.find((row) => row.id === 'kcue-2028-plan');
    expect(plan?.role).toBe('current_target');
    expect(plan?.windows).toEqual([TARGET_2028_WINDOWS.susi, TARGET_2028_WINDOWS.jeongsi]);
    expect(TARGET_2028_WINDOWS.susi).toEqual({ id: 'susi-2028', start: '2027-09-20', end: '2027-09-23' });
    expect(TARGET_2028_WINDOWS.jeongsi).toEqual({ id: 'jeongsi-2028', start: '2028-01-03', end: '2028-01-06' });
    expect(PATHWAYS_2028.filter((row) => row.cycleYear === 2027).every((row) => row.role === 'closed_reference')).toBe(true);
    expect(MULTICULTURAL_TRACKS.every((track) => track.role === 'closed_reference' && track.cycleYear === 2027)).toBe(true);
  });

  it('records nationality, the mid-entry articles, the GED card, and Dasom', () => {
    const multicultural = PATHWAYS_2028.filter((row) => row.category === 'multicultural' && row.hasTrack === true);
    expect(multicultural.length).toBeGreaterThan(0);
    expect(multicultural.every((row) => row.eligibility.nationality === 'korean_citizen_only')).toBe(true);
    const foreign = PATHWAYS_2028.filter((row) => row.category === 'foreign_special' && row.hasTrack === true);
    expect(foreign.every((row) => row.eligibility.bothParentsForeign === true)).toBe(true);
    const basis = PATHWAYS_2028.flatMap((row) => row.eligibility.legalBasis).join('\n');
    expect(basis).toContain('초·중등교육법 시행령 제19조');
    expect(basis).toContain('초·중등교육법 시행령 제75조');
    expect(basis).toContain('초·중등교육법 시행령 제89조의2');
    expect(basis).toContain('초·중등교육법 시행령 제98조의2');
    expect(PATHWAYS_2028.find((row) => row.id === 'ged-alien-registration-card')?.eligibility.alienRegistrationCardAccepted).toBe(true);
    expect(PATHWAYS_2028.find((row) => row.id === 'kopo-dasom-high')?.name).toContain('다솜');
  });

  it('uses the Seoul center number 02-6941-1692 and leaves stay rows untied to input', () => {
    const seoul = PATHWAYS_2028.filter((row) => row.id === 'center-seoul' || row.id === 'seoul-daon-center-entry');
    expect(seoul.map((row) => row.phone)).toEqual(['02-6941-1692', '02-6941-1692']);
    expect(PATHWAYS_2028.every((row) => row.phone == null || !row.phone.startsWith('070'))).toBe(true);
    const stay = PATHWAYS_2028.filter((row) => row.category === 'post_graduation_stay');
    expect(stay.map((row) => row.id)).toEqual([
      'stay-d10-e7y-f2r',
      'stay-relief-until-2028-03-31',
      'e7-4-not-school-path',
    ]);
    expect(stay.every((row) => row.role === 'general_info')).toBe(true);
    const relief = stay.find((row) => row.id === 'stay-relief-until-2028-03-31');
    expect(relief?.windows[0]).toMatchObject({ start: '2025-04-01', end: '2028-03-31' });
  });

  it('matches nationality without a visa question and keeps room for later foreign tracks', () => {
    const noVisa: NoVisaQuestion = true;
    expect(noVisa).toBe(true);
    expect(TRACK_CATEGORIES).toEqual(expect.arrayContaining([
      'foreign_special',
      'overseas_12yr',
      'overseas_3yr',
      'foreign_school_graduate',
      'international_college',
      'scholarship',
      'north_korean_defector',
    ]));
    const basic = PATHWAYS_2028.find((row) => row.id === 'kcue-2028-overseas-foreign-basic');
    expect(basic?.alsoCovers).toEqual(['foreign_special', 'overseas_12yr', 'overseas_3yr']);
    expect(matchPathways(PATHWAYS_2028, { category: 'overseas_12yr' }).map((row) => row.id)).toEqual([
      'kcue-2028-overseas-foreign-basic',
    ]);
    const korean = matchPathways(PATHWAYS_2028, { nationality: 'korean', multiculturalFamilyChild: true });
    expect(korean.some((row) => row.id === 'korea-2028-multicultural')).toBe(true);
    expect(korean.some((row) => row.id === 'ssu-2028-pure-foreign')).toBe(false);
    expect(korean.some((row) => row.id === 'stay-d10-e7y-f2r')).toBe(true);
    const foreign = matchPathways(PATHWAYS_2028, { nationality: 'foreign', bothParentsForeign: true });
    expect(foreign.some((row) => row.id === 'ssu-2028-pure-foreign')).toBe(true);
    expect(foreign.some((row) => row.id === 'korea-2028-multicultural')).toBe(false);
    expect(pathwaySections().every((section) => section.rows.length > 0)).toBe(true);
  });

  it('has a label for every track category in all eight languages', () => {
    expect(Object.keys(PATHWAYS_2028_COPY)).toEqual([...SUPPORTED_LANGS]);
    for (const lang of SUPPORTED_LANGS) {
      const copy = PATHWAYS_2028_COPY[lang];
      expect(copy.currentTarget.length, lang).toBeGreaterThan(0);
      expect(copy.stayLead.length, lang).toBeGreaterThan(20);
      expect(copy.closedTag.length, lang).toBeGreaterThan(0);
      for (const category of TRACK_CATEGORIES) {
        expect(copy.groups[category], `${lang} ${category}`).toBeTruthy();
      }
      if (lang !== 'ko') expect(copy.stayLead).not.toBe(PATHWAYS_2028_COPY.ko.stayLead);
    }
  });
});
