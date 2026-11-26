import { describe, expect, it } from 'vitest';
import { EMPTY_PROFILE, parseProfile, serializeProfile, statsSnapshot, type StudentProfile } from '../src/profile/profile';
import { eligibleTracks, signalsFor } from '../src/rules/evaluate';
import { mergePathways, normalizePathway, pathwaysFromModules } from '../src/rules/external';
import type { PathwayRecord } from '../src/rules/types';

function profile(partial: Partial<StudentProfile>): StudentProfile {
  return { ...EMPTY_PROFILE, skipped: [], homeLanguages: [], interests: [], supportNeeds: [], ...partial };
}

describe('eligible tracks', () => {
  it('shows multicultural university tracks only for Korean nationals, not the both-parents-foreign track', () => {
    const rows = eligibleTracks(
      profile({
        grade: 'high',
        region: 'seoul',
        studentType: 'domestic_multicultural',
        parentForeign: 'father',
        koreanNationality: true,
        koreanLevel: 'topik_3_4',
        goal: 'study',
      }),
    );
    const ids = rows.map((row) => row.id);
    expect(ids).toContain('multi-univ');
    expect(ids).toContain('univ-multicultural-eq');
    expect(ids).toContain('korea-2028-multicultural');
    expect(ids).not.toContain('univ-foreign-parents');
    expect(ids).not.toContain('kcue-2028-both-parents-foreign');
    expect(rows.find((row) => row.id === 'multi-univ')?.details).toContain('경희대');
    expect(rows.find((row) => row.id === 'multi-univ')?.reason.length).toBeGreaterThan(8);
    expect(rows.find((row) => row.id === 'multi-univ')?.yearLabel).toContain('2027');
  });

  it('shows the parents-both-foreign university track and hides multicultural tracks', () => {
    const rows = eligibleTracks(
      profile({
        grade: 'high',
        region: 'seoul',
        studentType: 'foreign_family',
        parentForeign: 'both',
        koreanNationality: false,
        koreanLevel: 'topik_5_6',
        goal: 'study',
      }),
    );
    const ids = rows.map((row) => row.id);
    expect(ids).toContain('univ-foreign-parents');
    expect(ids).toContain('kcue-2028-both-parents-foreign');
    expect(ids).not.toContain('multi-univ');
    expect(ids).not.toContain('univ-multicultural-eq');
    expect(ids).not.toContain('korea-2028-multicultural');
    expect(signalsFor(profile({ parentForeign: 'both', koreanNationality: false })).backgrounds).toContain('both_foreign');
  });

  it('keeps Seoul social-integration and vocational high-school tracks for a middle-schooler', () => {
    const rows = eligibleTracks(
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
    );
    const ids = rows.map((row) => row.id);
    expect(ids).toContain('hs-vocational-future');
    expect(ids).toContain('hs-special-2c');
    expect(ids).toContain('vocational-schools');
    expect(ids).toContain('ksl-prep');
    expect(ids).not.toContain('univ-foreign-parents');
    expect(rows.find((row) => row.id === 'vocational-schools')?.details.some((line) => line.includes('특성화고') || line.includes('고등학교'))).toBe(true);
  });

  it('uses Gyeonggi KLS and credential review instead of Seoul-only high-school tracks', () => {
    const rows = eligibleTracks(
      profile({
        grade: 'middle',
        region: 'gyeonggi',
        studentType: 'mid_entry',
        bornAbroad: true,
        yearArrived: 2024,
        koreanLevel: 'beginner',
        supportNeeds: ['korean_class'],
      }),
    );
    const ids = rows.map((row) => row.id);
    expect(ids).toContain('gyeonggi-kls');
    expect(ids).toContain('gyeonggi-credential');
    expect(ids).not.toContain('hs-vocational-future');
    expect(ids).not.toContain('hs-special-2c');
    expect(ids).not.toContain('ksl-prep');
  });

  it('hides a track that needs more Korean, and hides the vocational-graduate track unless the school is a 특성화고', () => {
    const beginner = eligibleTracks(
      profile({
        grade: 'high',
        region: 'seoul',
        studentType: 'foreign_family',
        parentForeign: 'both',
        koreanNationality: false,
        koreanLevel: 'beginner',
        schoolType: 'general',
      }),
    );
    expect(beginner.map((row) => row.id)).not.toContain('univ-foreign-parents');
    const vocational = eligibleTracks(
      profile({
        grade: 'high',
        region: 'seoul',
        studentType: 'foreign_family',
        parentForeign: 'both',
        koreanNationality: false,
        koreanLevel: 'topik_3_4',
        schoolType: 'vocational',
      }),
    );
    expect(vocational.map((row) => row.id)).toContain('univ-vocational-grad');
    const meister = eligibleTracks(
      profile({
        grade: 'high',
        region: 'seoul',
        studentType: 'foreign_family',
        parentForeign: 'both',
        koreanNationality: false,
        koreanLevel: 'topik_3_4',
        schoolType: 'meister',
      }),
    );
    expect(meister.map((row) => row.id)).not.toContain('univ-vocational-grad');
  });
});

describe('profile record', () => {
  it('stores one object and drops visa, residency, and id numbers', () => {
    const parsed = parseProfile({
      version: 1,
      grade: 'high',
      parentForeign: 'both',
      fatherCountry: 'vn',
      visa: 'F-2',
      residency: '미등록',
      rrn: '900101-1234567',
      passport: 'M1234567',
      yearArrived: 2019,
      bornAbroad: false,
    });
    const saved = serializeProfile(parsed);
    expect(saved).not.toContain('F-2');
    expect(saved).not.toContain('미등록');
    expect(saved).not.toContain('900101');
    expect(saved).not.toContain('visa');
    expect(JSON.parse(saved).fatherCountry).toBe('VN');
    expect(JSON.parse(saved).yearArrived).toBeNull();
    expect(statsSnapshot(parsed)).toBeNull();
    const consented = statsSnapshot({ ...parsed, consentResearch: true });
    expect(consented?.fatherCountry).toBe('VN');
    expect(consented?.parentForeign).toBe('both');
    expect(JSON.stringify(consented)).not.toContain('F-2');
  });
});

describe('pathways2028 adapter', () => {
  it('normalizes an external list and lets a later file replace a track by id', () => {
    const incoming = pathwaysFromModules({
      '../data/pathways2028.ts': {
        PATHWAYS_2028: [
          {
            id: 'univ-foreign-parents',
            title: '2028 부모 모두 외국인',
            summary: '2028 요강의 순수외국인 전형',
            asOfYear: '2028학년도',
            level: 'high',
            eligibleBackgrounds: ['both_foreign'],
            minKorean: ['topik_3_4', 'topik_5_6'],
            requiresBothParentsForeign: true,
            verification: 'verified',
          },
          { id: '', title: '버림' },
        ],
      },
    });
    expect(incoming).toHaveLength(1);
    expect(normalizePathway(incoming[0])?.id).toBe('univ-foreign-parents');
    const merged = mergePathways(
      [{ id: 'univ-foreign-parents', title: 'old', reason: '', yearLabel: '', details: [], verified: false, when: {}, sort: 1, kind: 'admission' }],
      incoming,
    );
    expect(merged).toHaveLength(1);
    expect(merged[0]?.title).toBe('2028 부모 모두 외국인');
    const live = eligibleTracks(
      profile({
        grade: 'high',
        region: 'seoul',
        studentType: 'foreign_family',
        parentForeign: 'both',
        koreanNationality: false,
        koreanLevel: 'topik_3_4',
      }),
      mergePathways(
        eligibleTracks.length ? [] : [],
        incoming as PathwayRecord[],
      ),
    );
    expect(live.map((row) => row.id)).toEqual(['univ-foreign-parents']);
    expect(live[0]?.yearLabel).toBe('2028학년도');
  });
});
