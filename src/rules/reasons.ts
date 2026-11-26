import type { KoreanLevel } from '../data/admissionsData';
import { isIsoDate, seoulDate } from '../deadlines/seoul';
import type { PathwayRecord as SchemaPathway, TrackCategory } from '../data/trackSchema';
import type { StudentProfile } from '../profile/profile';
import { pathwayCatalog } from './catalog';
import { gradeAllows, signalsFor, topikFloor } from './evaluate';
import type { PathwayRecord, PathwayWhen } from './types';
import { FOREIGN_TRACKS } from '../data/foreignTracks';
import { PATHWAYS_2028 } from '../data/pathways2028';
import { isShippedPathway } from '../data/trackSchema';

/**
 * Why a published track does not fit this profile.
 * Schema checks follow matchPathways and gradeAllows.
 * Catalog checks follow the same clauses as matches().
 * Unknown answers fail only where that engine already fails them.
 */
export const REASON_CODES = [
  'needs_korean_national',
  'needs_foreign_national',
  'needs_both_parents_foreign',
  'parents_not_both_foreign',
  'topik_below',
  'grade_not_eligible',
  'school_type',
  'years_abroad',
  'years_in_korea',
  'domestic_school',
] as const;

export type ReasonCode = (typeof REASON_CODES)[number];

export type ReasonRow = 'nationality' | 'topik' | 'school';

export interface RuleFailure {
  row: ReasonRow;
  code: ReasonCode;
  need?: number;
}

const SHIPPED: readonly SchemaPathway[] = [...PATHWAYS_2028, ...FOREIGN_TRACKS].filter(isShippedPathway);

const schemaById = new Map(SHIPPED.map((row) => [row.id, row]));

export function shippedSchema(): readonly SchemaPathway[] {
  return SHIPPED;
}

export function schemaTrack(id: string): SchemaPathway | undefined {
  return schemaById.get(id);
}

export function catalogTrack(id: string): PathwayRecord | undefined {
  const row = pathwayCatalog().find((item) => item.id === id);
  return row?.verified ? row : undefined;
}

export function isVerifiedTrack(id: string): boolean {
  return schemaById.has(id) || Boolean(catalogTrack(id));
}

function dedupe(fails: RuleFailure[]): RuleFailure[] {
  const seen = new Set<string>();
  return fails.filter((fail) => {
    const key = `${fail.row}:${fail.code}:${fail.need ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function minimumTopik(levels: readonly KoreanLevel[]): number | undefined {
  const floors = levels.map((level) => topikFloor(level)).filter((level): level is number => level != null);
  return floors.length ? Math.min(...floors) : undefined;
}

function yearsInKorea(yearArrived: number, today: string): number | null {
  if (!isIsoDate(today)) return null;
  const year = Number(today.slice(0, 4));
  if (!Number.isInteger(year)) return null;
  return year - yearArrived;
}

function schemaFailures(profile: StudentProfile, row: SchemaPathway, today: string): RuleFailure[] {
  const signals = signalsFor(profile);
  const fails: RuleFailure[] = [];
  const nationality = signals.koreanNational === true ? 'korean' : signals.koreanNational === false ? 'foreign' : undefined;
  if (
    nationality === 'korean' &&
    (row.eligibility.nationality === 'both_parents_and_student_foreign' || row.eligibility.nationality === 'foreign_national_student')
  ) {
    fails.push({ row: 'nationality', code: 'needs_foreign_national' });
  }
  if (nationality === 'foreign' && row.eligibility.nationality === 'korean_citizen_only') {
    fails.push({ row: 'nationality', code: 'needs_korean_national' });
  }
  if (signals.bothParentsForeign === false && row.eligibility.bothParentsForeign === true) {
    fails.push({ row: 'nationality', code: 'needs_both_parents_foreign' });
  }
  const floor = topikFloor(profile.koreanLevel);
  if (floor != null && row.language && !row.language.noMinimum && row.language.topikMin != null && floor < row.language.topikMin) {
    fails.push({ row: 'topik', code: 'topik_below', need: row.language.topikMin });
  }
  if (row.category !== 'post_graduation_stay' && profile.grade && !gradeAllows(row.category, profile.grade)) {
    fails.push({ row: 'school', code: 'grade_not_eligible' });
  }
  const stay = row.eligibility.ageResidency;
  if (stay?.minYearsInKorea != null && profile.yearArrived != null) {
    const years = yearsInKorea(profile.yearArrived, today);
    if (years != null && years < stay.minYearsInKorea) {
      fails.push({ row: 'school', code: 'years_in_korea', need: stay.minYearsInKorea });
    }
  }
  if (stay?.domesticSchool && profile.schoolType === 'not_enrolled') {
    fails.push({ row: 'school', code: 'domestic_school' });
  }
  return fails;
}

function catalogFailures(profile: StudentProfile, when: PathwayWhen): RuleFailure[] {
  const signals = signalsFor(profile);
  const fails: RuleFailure[] = [];
  if (when.grades && (!profile.grade || !when.grades.includes(profile.grade))) {
    fails.push({ row: 'school', code: 'grade_not_eligible' });
  }
  if (when.koreanLevels && (!profile.koreanLevel || !when.koreanLevels.includes(profile.koreanLevel))) {
    fails.push({ row: 'topik', code: 'topik_below', need: minimumTopik(when.koreanLevels) });
  }
  if (when.koreanNational === 'required' && signals.koreanNational !== true) {
    fails.push({ row: 'nationality', code: 'needs_korean_national' });
  }
  if (when.koreanNational === 'rejected' && signals.koreanNational === true) {
    fails.push({ row: 'nationality', code: 'needs_foreign_national' });
  }
  if (when.bothParentsForeign === 'required' && signals.bothParentsForeign !== true) {
    fails.push({ row: 'nationality', code: 'needs_both_parents_foreign' });
  }
  if (when.bothParentsForeign === 'rejected' && signals.bothParentsForeign === true) {
    fails.push({ row: 'nationality', code: 'parents_not_both_foreign' });
  }
  if (when.schoolTypes && (!profile.schoolType || !when.schoolTypes.includes(profile.schoolType))) {
    fails.push({ row: 'school', code: 'school_type' });
  }
  const years = profile.yearsSchoolingAbroad;
  if (when.minYearsAbroad) {
    const born = when.bornAbroad === true && profile.bornAbroad === true;
    if (!((years ?? 0) >= when.minYearsAbroad || born)) {
      fails.push({ row: 'school', code: 'years_abroad', need: when.minYearsAbroad });
    }
  }
  if (when.maxYearsAbroad !== undefined && years !== null && years > when.maxYearsAbroad) {
    fails.push({ row: 'school', code: 'years_abroad', need: when.maxYearsAbroad });
  }
  return fails;
}

export function ruleFailures(profile: StudentProfile, id: string, today = seoulDate(new Date())): RuleFailure[] {
  const schema = schemaById.get(id);
  if (schema) return dedupe(schemaFailures(profile, schema, today));
  const catalog = catalogTrack(id);
  if (!catalog) return [];
  return dedupe(catalogFailures(profile, catalog.when));
}

export function failureRows(fails: readonly RuleFailure[]): ReasonRow[] {
  return [...new Set(fails.map((fail) => fail.row))];
}

export function isAdmissionCategory(category: TrackCategory): boolean {
  return (
    category === 'multicultural' ||
    category === 'foreign_special' ||
    category === 'overseas_12yr' ||
    category === 'overseas_3yr' ||
    category === 'foreign_school_graduate' ||
    category === 'international_college' ||
    category === 'scholarship' ||
    category === 'junior_college'
  );
}
