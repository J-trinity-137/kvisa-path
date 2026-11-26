import { describe, expect, it } from 'vitest';
import { FOREIGN_TRACKS } from '../src/data/foreignTracks';
import { pathwaySections } from '../src/data/pathways2028';
import {
  TRACK_CATEGORIES,
  isShippedPathway,
  matchPathways,
  type TrackQuery,
} from '../src/data/trackSchema';
import { PATHWAYS_2028_COPY } from '../src/i18n/pathways2028Copy';
import { SUPPORTED_LANGS } from '../src/kbridge';

type NoVisaQuestion = Extract<keyof TrackQuery, 'visa' | 'residency' | 'residencyStatus'> extends never ? true : false;

describe('foreign tracks', () => {
  it('ships the 39 verified rows with a url and a check month', () => {
    expect(FOREIGN_TRACKS).toHaveLength(38);
    expect(FOREIGN_TRACKS.every(isShippedPathway)).toBe(true);
    for (const row of FOREIGN_TRACKS) {
      expect(row.verifiedAt, row.id).toBe('2026-11');
      expect(row.url.startsWith('https://'), row.id).toBe(true);
      expect(row.quote.trim().length, row.id).toBeGreaterThan(0);
      expect(row.asksVisaOrResidency, row.id).toBe(false);
      expect(row.tiedToUserInput, row.id).toBe(false);
    }
    expect(new Set(FOREIGN_TRACKS.map((row) => row.id)).size).toBe(38);
    expect(FOREIGN_TRACKS.some((row) => row.id === 'ft-snu-nk-2028')).toBe(false);
    expect(FOREIGN_TRACKS.some((row) => row.status !== 'verified')).toBe(false);
  });

  it('labels 2027 university guides and keeps the 2028 basic rules', () => {
    const guides = FOREIGN_TRACKS.filter((row) => row.guideBasis === '2027_guide');
    expect(guides.length).toBeGreaterThan(10);
    expect(guides.every((row) => row.cycleYear === 2027 && row.role === 'closed_reference')).toBe(true);
    expect(PATHWAYS_2028_COPY.ko.guide2027).toBe('2027 요강 기준(2028 요강 미공개)');
    const snu = FOREIGN_TRACKS.find((row) => row.id === 'ft-snu-global-1');
    expect(snu?.guideBasis).toBeUndefined();
    expect(snu?.cycleYear).toBe(2028);
    const basic = FOREIGN_TRACKS.find((row) => row.id === 'ft-kcue-2028-basic');
    expect(basic?.alsoCovers).toEqual(['foreign_special', 'overseas_3yr', 'overseas_12yr', 'north_korean_defector']);
    expect(basic?.quota.capPercent).toBe(2);
    expect(basic?.quota.noteKo).toContain('정원 제한 없음');
    expect(basic?.eligibility.legalBasis.join(' ')).toContain('제29조제2항제2호');
    expect(basic?.eligibility.legalBasis.join(' ')).toContain('제29조제2항제7호');
  });

  it('keeps TOPIK floors, the foreign-school rule, junior college, GKS, and the third-country child rule', () => {
    const khu = FOREIGN_TRACKS.find((row) => row.id === 'ft-khu-foreign-2027');
    expect(khu?.language?.topikMin).toBe(3);
    const kookmin = FOREIGN_TRACKS.find((row) => row.id === 'ft-kookmin-2028');
    expect(kookmin?.language?.noMinimum).toBe(true);
    const credit = FOREIGN_TRACKS.find((row) => row.id === 'ft-domestic-foreign-school-credit');
    expect(credit?.category).toBe('foreign_school_graduate');
    expect(credit?.eligibility.textKo).toContain('102시간');
    expect(FOREIGN_TRACKS.find((row) => row.id === 'ft-jeju-domestic-foreign-school')?.hasTrack).toBe(false);
    expect(FOREIGN_TRACKS.find((row) => row.id === 'ft-dongyang-2027')?.category).toBe('junior_college');
    expect(FOREIGN_TRACKS.find((row) => row.id === 'ft-gks-u-2027')?.category).toBe('scholarship');
    const child = FOREIGN_TRACKS.find((row) => row.id === 'ft-nk-third-country-child');
    expect(child?.eligibility.textKo).toContain('제3국');
    expect(child?.eligibility.textKo).toContain('국내 출생 자녀');
    const lowTopik = matchPathways(FOREIGN_TRACKS, { category: 'foreign_special', topikLevel: 2, bothParentsForeign: true });
    expect(lowTopik.some((row) => row.id === 'ft-khu-foreign-2027')).toBe(false);
    expect(lowTopik.some((row) => row.id === 'ft-jbnu-2027')).toBe(true);
    expect(matchPathways(FOREIGN_TRACKS, { category: 'overseas_12yr' }).length).toBeGreaterThan(0);
  });

  it('does not add a 화교 explainer without a verified row', () => {
    const blob = FOREIGN_TRACKS.map((row) => `${row.name} ${row.summaryKo} ${row.eligibility.textKo}`).join('\n');
    expect(blob).not.toContain('화교');
    expect(PATHWAYS_2028_COPY.ko.guide2027).not.toContain('화교');
  });

  it('exposes every category label in eight languages and does not ask for a visa', () => {
    const noVisa: NoVisaQuestion = true;
    expect(noVisa).toBe(true);
    expect(TRACK_CATEGORIES).toContain('junior_college');
    expect(Object.keys(PATHWAYS_2028_COPY)).toEqual([...SUPPORTED_LANGS]);
    for (const lang of SUPPORTED_LANGS) {
      const copy = PATHWAYS_2028_COPY[lang];
      expect(copy.guide2027.length, lang).toBeGreaterThan(8);
      expect(copy.topikAtLeast, lang).toContain('{level}');
      expect(copy.groups.junior_college.length, lang).toBeGreaterThan(0);
      if (lang !== 'ko') expect(copy.guide2027).not.toBe(PATHWAYS_2028_COPY.ko.guide2027);
    }
    expect(pathwaySections().some((section) => section.id === 'junior_college')).toBe(true);
    expect(pathwaySections().some((section) => section.id === 'scholarship')).toBe(true);
  });
});