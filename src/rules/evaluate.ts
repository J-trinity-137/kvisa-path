import type { BackgroundType } from '../data/admissionsData';
import { SEOUL_VOCATIONAL_SCHOOLS } from '../data/admissionsData';
import { GYEONGGI_KLS } from '../data/gyeonggiData';
import { MULTICULTURAL_TRACKS } from '../data/multiculturalTracks';
import { FOREIGN_TRACKS } from '../data/foreignTracks';
import { PATHWAYS_2028 } from '../data/pathways2028';
import { matchPathways, type PathwayRecord as SchemaPathway, type TrackCategory, type TrackQuery } from '../data/trackSchema';
import { isUnder14, type GradeLevel, type StudentProfile } from '../profile/profile';
import type { KoreanLevel } from '../data/admissionsData';
import { pathwayCatalog } from './catalog';
import { blockForCatalog, catalogReasons, decideSchemaRow, referenceKindOf } from './situation';
import type { EligibleTrack, PathwayRecord, PathwayWhen, WhyCode } from './types';

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
  if (profile.nkThirdCountryBorn) {
    return { backgrounds: [], koreanNational, bothParentsForeign: false, needsKoreanSupport };
  }
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
  'junior_college',
]);

export function gradeAllows(category: TrackCategory, grade: GradeLevel | null): boolean {
  if (!grade || grade === 'high') return category !== 'post_graduation_stay';
  if (HIGH_ONLY.has(category)) return false;
  return category !== 'post_graduation_stay';
}

function sentence(text: string): string {
  const cut = text.split(/(?<=다\.|요\.|\.)\s+/)[0] ?? text;
  return cut.length > 160 ? `${cut.slice(0, 160)}…` : cut;
}

export function topikFloor(level: KoreanLevel | null): number | undefined {
  if (level === 'beginner') return 1;
  if (level === 'topik_3_4') return 3;
  if (level === 'topik_5_6') return 5;
  return undefined;
}

const PUBLISHED_ROWS: readonly SchemaPathway[] = [...PATHWAYS_2028, ...FOREIGN_TRACKS];

function trackQuery(profile: StudentProfile, signals: EligibilitySignals): TrackQuery {
  const query: TrackQuery = {};
  if (signals.koreanNational === true) query.nationality = 'korean';
  else if (signals.koreanNational === false) query.nationality = 'foreign';
  if (signals.bothParentsForeign !== null) query.bothParentsForeign = signals.bothParentsForeign;
  const oneForeignParent = profile.parentForeign === 'father' || profile.parentForeign === 'mother';
  if (profile.nkThirdCountryBorn === true || signals.koreanNational === false || signals.bothParentsForeign === true || profile.parentForeign === 'neither') {
    query.multiculturalFamilyChild = false;
  } else if (signals.koreanNational === true && (oneForeignParent || profile.studentType === 'domestic_multicultural')) {
    query.multiculturalFamilyChild = true;
  }
  const topikLevel = topikFloor(profile.koreanLevel);
  if (topikLevel != null) query.topikLevel = topikLevel;
  return query;
}

function baseBlock(row: SchemaPathway, query: TrackQuery): WhyCode | null {
  if (
    query.topikLevel != null &&
    row.language &&
    !row.language.noMinimum &&
    row.language.topikMin != null &&
    query.topikLevel < row.language.topikMin
  ) {
    return 'topik_short';
  }
  if (query.nationality === 'korean' && row.eligibility.nationality === 'both_parents_and_student_foreign') return 'not_both_parents';
  if (query.nationality === 'korean' && row.eligibility.nationality === 'foreign_national_student') return 'not_foreign_national';
  if (query.nationality === 'foreign' && row.eligibility.nationality === 'korean_citizen_only') return 'not_korean_national';
  if (query.bothParentsForeign === false && row.eligibility.bothParentsForeign === true) return 'not_both_parents';
  if (
    query.multiculturalFamilyChild === false &&
    row.eligibility.multiculturalFamilyChild === true &&
    row.eligibility.nationality === 'korean_citizen_only'
  ) {
    return 'not_multicultural_family';
  }
  return null;
}

function toSchemaTrack(row: SchemaPathway, reasons: WhyCode[]): EligibleTrack {
  const referenceKind = referenceKindOf(row);
  return {
    id: row.id,
    kind: row.category === 'scholarship' ? 'scholarship' : row.category === 'multicultural' ? 'multicultural-univ' : 'admission',
    title: row.name,
    reason: sentence(row.summaryKo || row.eligibility.textKo),
    yearLabel: row.windows[0] ? `${row.windows[0].start} ~ ${row.windows[0].end}` : row.cycleYear ? String(row.cycleYear) : row.verifiedAt,
    details: [row.language?.noteKo, row.eligibility.textKo, row.quote].filter((line): line is string => Boolean(line)),
    sourceUrl: row.url || row.sourceUrl,
    sourceLabel: row.university ?? row.name,
    verifiedAt: row.verifiedAt,
    verified: row.status === 'verified',
    sort: row.role === 'current_target' ? 4 : row.hasTrack === true ? 8 : 24,
    category: row.category,
    reasons,
    referenceKind,
  };
}

export interface TrackExplanation {
  tracks: EligibleTrack[];
  withheld: { code: WhyCode; count: number }[];
}

/** Published schema rows, including foreign tracks. A later file can be concatenated the same way. */
export function tracksFromSchema(profile: StudentProfile, rows: readonly SchemaPathway[] = PUBLISHED_ROWS): EligibleTrack[] {
  return explainTracks(profile, undefined, rows).tracks.filter((track) => track.category);
}

export function explainTracks(
  profile: StudentProfile,
  catalog?: readonly PathwayRecord[],
  rows: readonly SchemaPathway[] = PUBLISHED_ROWS,
): TrackExplanation {
  const signals = signalsFor(profile);
  const withheld = new Map<WhyCode, number>();
  const note = (code: WhyCode) => withheld.set(code, (withheld.get(code) ?? 0) + 1);
  const source = catalog ?? pathwayCatalog();
  const fromCatalog = source.flatMap((record) => {
    if (!matches(record.when, profile, signals)) return [];
    const blocked = blockForCatalog(profile, record.id, record.kind);
    if (blocked) {
      note(blocked);
      return [];
    }
    let sort = record.sort;
    if (profile.goal === 'work' && (record.kind === 'vocational' || record.kind === 'kls')) sort -= 8;
    if (profile.goal === 'study' && (record.kind === 'admission' || record.kind === 'multicultural-univ')) sort -= 4;
    if (profile.gradeBand === 'lower' && record.id === 'hs-vocational-future') sort = 1;
    const referenceKind = record.kind === 'multicultural-univ' || record.id.startsWith('univ-') ? ('closed' as const) : undefined;
    return [
      {
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
        reasons: catalogReasons(profile, signals, record.id),
        referenceKind,
      },
    ];
  });

  const published = catalog
    ? []
    : rows.flatMap((row) => {
        const foreignSchool = profile.schoolType === 'foreign_school';
        if (row.hasTrack === false && !(foreignSchool && row.category === 'foreign_school_graduate')) return [];
        const decision = decideSchemaRow(row, profile, signals);
        if (decision.skip) return [];
        if (!decision.ok) {
          if (decision.block) note(decision.block);
          return [];
        }
        if (!gradeAllows(row.category, profile.grade)) {
          note(isUnder14(profile) ? 'too_young' : 'grade');
          return [];
        }
        const blocked = baseBlock(row, trackQuery(profile, signals));
        if (blocked) {
          note(blocked);
          return [];
        }
        if (!matchPathways([row], trackQuery(profile, signals)).length) return [];
        return [toSchemaTrack(row, decision.reasons)];
      });

  const tracks = [...fromCatalog, ...published].sort((a, b) => a.sort - b.sort || a.title.localeCompare(b.title, 'ko'));
  return {
    tracks,
    withheld: [...withheld.entries()]
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code)),
  };
}

export function eligibleTracks(profile: StudentProfile, catalog?: readonly PathwayRecord[]): EligibleTrack[] {
  return explainTracks(profile, catalog).tracks;
}
