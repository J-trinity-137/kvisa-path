import type { BackgroundType } from '../data/admissionsData';
import { SEOUL_VOCATIONAL_SCHOOLS } from '../data/admissionsData';
import { GYEONGGI_KLS } from '../data/gyeonggiData';
import { MULTICULTURAL_TRACKS } from '../data/multiculturalTracks';
import { PATHWAYS_2028 } from '../data/pathways2028';
import { matchPathways, type PathwayRecord as SchemaPathway, type TrackCategory, type TrackQuery } from '../data/trackSchema';
import type { GradeLevel, StudentProfile } from '../profile/profile';
import { pathwayCatalog } from './catalog';
import type { EligibleTrack, PathwayRecord, PathwayWhen } from './types';

export interface EligibilitySignals {
  backgrounds: BackgroundType[];
  koreanNational: boolean | null;
  bothParentsForeign: boolean | null;
  needsKoreanSupport: boolean;
}

export function signalsFor(profile: StudentProfile): EligibilitySignals {
  const answeredNational = profile.koreanNationality;
  const implied =
    profile.studentType === 'domestic_multicultural' && answeredNational !== false ? true : answeredNational;
  const koreanNational = implied;
  const parent = profile.parentForeign;
  const bothParentsForeign = parent === 'both' ? true : parent === null ? null : false;
  const backgrounds: BackgroundType[] = [];
  if ((parent === 'both' || profile.studentType === 'foreign_family') && koreanNational !== true && parent !== 'neither') {
    if (parent !== 'father' && parent !== 'mother') backgrounds.push('both_foreign');
  }
  if (profile.studentType === 'foreign_family' && parent === null && koreanNational !== true) {
    if (!backgrounds.includes('both_foreign')) backgrounds.push('both_foreign');
  }
  if ((profile.studentType === 'domestic_multicultural' || koreanNational === true) && bothParentsForeign !== true) {
    backgrounds.push('multicultural');
  }
  if (profile.studentType === 'mid_entry' || profile.bornAbroad === true || (profile.yearsSchoolingAbroad ?? 0) > 0) {
    backgrounds.push('mid_entry');
  }
  const needsKoreanSupport =
    profile.koreanLevel === 'beginner' || profile.supportNeeds.includes('korean_class') || profile.supportNeeds.includes('interpretation');
  return { backgrounds, koreanNational, bothParentsForeign, needsKoreanSupport };
}

function gate(expected: PathwayWhen['koreanNational'], actual: boolean | null, mode: 'required-fails-unknown'): boolean {
  if (!expected || expected === 'any') return true;
  if (expected === 'required') return actual === true;
  return actual !== true;
  void mode;
}

function matches(when: PathwayWhen, profile: StudentProfile, signals: EligibilitySignals): boolean {
  if (when.grades) {
    if (!profile.grade || !when.grades.includes(profile.grade)) return false;
  }
  if (when.regions) {
    if (!profile.region || !when.regions.includes(profile.region)) return false;
  }
  if (when.backgrounds?.length && !signals.backgrounds.some((item) => when.backgrounds?.includes(item))) return false;
  if (when.koreanLevels) {
    if (!profile.koreanLevel || !when.koreanLevels.includes(profile.koreanLevel)) return false;
  }
  if (when.goals && profile.goal && !when.goals.includes(profile.goal)) return false;
  if (when.schoolTypes) {
    if (!profile.schoolType || !when.schoolTypes.includes(profile.schoolType)) return false;
  }
  if (!gate(when.koreanNational, signals.koreanNational, 'required-fails-unknown')) return false;
  if (!gate(when.bothParentsForeign, signals.bothParentsForeign, 'required-fails-unknown')) return false;
  const years = profile.yearsSchoolingAbroad;
  if (when.minYearsAbroad) {
    const born = when.bornAbroad === true && profile.bornAbroad === true;
    if (!((years ?? 0) >= when.minYearsAbroad || born)) return false;
  }
  if (when.maxYearsAbroad !== undefined && years !== null && years > when.maxYearsAbroad) return false;
  if (when.koreanSupport && !signals.needsKoreanSupport) return false;
  if (when.needsInterests && profile.interests.length === 0) return false;
  if (when.supportAny && !when.supportAny.some((need) => profile.supportNeeds.includes(need))) return false;
  return true;
}

function detailsFor(record: PathwayRecord, profile: StudentProfile): string[] {
  if (record.detailSource === 'multicultural-univs') {
    return MULTICULTURAL_TRACKS.filter((track) => track.hasTrack).map((track) => track.university);
  }
  if (record.detailSource === 'vocational-schools') {
    const schools = SEOUL_VOCATIONAL_SCHOOLS.filter((school) => profile.interests.includes(school.field));
    const list = (profile.goal === 'study' ? schools.filter((school) => school.univSpecialEligible) : schools).slice(0, 6);
    return list.map((school) => `${school.name} · ${school.schoolType} · ${school.district}`);
  }
  if (record.detailSource === 'gyeonggi-kls') {
    return GYEONGGI_KLS.map((row) => `${row.city} · ${row.name} · ${row.phone}`);
  }
  return record.details;
}

const HIGH_ONLY = new Set<TrackCategory>([
  'admission_overview',
  'multicultural',
  'foreign_special',
  'overseas_12yr',
  'overseas_3yr',
  'foreign_school_graduate',
  'international_college',
  'scholarship',
]);

function gradeAllows(category: TrackCategory, grade: GradeLevel | null): boolean {
  if (!grade || grade === 'high') return category !== 'post_graduation_stay';
  if (HIGH_ONLY.has(category)) return false;
  return category !== 'post_graduation_stay';
}

function sentence(text: string): string {
  const cut = text.split(/(?<=다\.|요\.|\.)\s+/)[0] ?? text;
  return cut.length > 160 ? `${cut.slice(0, 160)}…` : cut;
}

/** Published 2028 rows, matched with trackSchema. A later foreign-track file can use the same matcher. */
export function tracksFromSchema(profile: StudentProfile, rows: readonly SchemaPathway[] = PATHWAYS_2028): EligibleTrack[] {
  const signals = signalsFor(profile);
  const query: TrackQuery = {};
  if (signals.koreanNational === true) query.nationality = 'korean';
  else if (signals.koreanNational === false) query.nationality = 'foreign';
  if (signals.bothParentsForeign !== null) query.bothParentsForeign = signals.bothParentsForeign;
  if (profile.studentType === 'domestic_multicultural' && signals.koreanNational !== false) query.multiculturalFamilyChild = true;
  return matchPathways(rows, query)
    .filter((row) => row.hasTrack !== false && gradeAllows(row.category, profile.grade))
    .map((row) => ({
      id: row.id,
      kind: row.category === 'scholarship' ? 'scholarship' as const : row.category === 'multicultural' ? 'multicultural-univ' as const : 'admission' as const,
      title: row.name,
      reason: sentence(row.summaryKo || row.eligibility.textKo),
      yearLabel: row.windows[0] ? `${row.windows[0].start} ~ ${row.windows[0].end}` : row.cycleYear ? String(row.cycleYear) : row.verifiedAt,
      details: [row.eligibility.textKo, row.quote].filter(Boolean),
      sourceUrl: row.url,
      sourceLabel: row.university ?? row.name,
      verifiedAt: row.verifiedAt,
      verified: row.status === 'verified',
      sort: row.role === 'current_target' ? 4 : row.hasTrack === true ? 8 : 24,
    }));
}

export function eligibleTracks(profile: StudentProfile, catalog?: readonly PathwayRecord[]): EligibleTrack[] {
  const signals = signalsFor(profile);
  const source = catalog ?? pathwayCatalog();
  const fromCatalog = source
    .filter((record) => matches(record.when, profile, signals))
    .map((record) => {
      let sort = record.sort;
      if (profile.goal === 'work' && (record.kind === 'vocational' || record.kind === 'kls')) sort -= 8;
      if (profile.goal === 'study' && (record.kind === 'admission' || record.kind === 'multicultural-univ')) sort -= 4;
      if (profile.gradeBand === 'lower' && record.id === 'hs-vocational-future') sort = 1;
      return {
        id: record.id,
        kind: record.kind,
        title: record.title,
        reason: record.reason,
        yearLabel: record.yearLabel,
        details: detailsFor(record, profile),
        sourceUrl: record.sourceUrl,
        sourceLabel: record.sourceLabel,
        verifiedAt: record.verifiedAt,
        verified: record.verified,
        sort,
      };
    });
  const published = catalog ? [] : tracksFromSchema(profile);
  return [...fromCatalog, ...published].sort((a, b) => a.sort - b.sort || a.title.localeCompare(b.title, 'ko'));
}
