import type { InterestField, KoreanLevel } from '../data/admissionsData';
import { REGION_IDS, type RegionId } from '../data/freshness';
import type { StudentType } from '../data/studentType';
import { PROFILE_STORAGE_KEY } from '../privacy/records';

export const PROFILE_VERSION = 1 as const;

export type GradeLevel = 'elementary' | 'middle' | 'high';
export type ParentForeign = 'father' | 'mother' | 'both' | 'neither';
export type SchoolKind = 'general' | 'vocational' | 'meister' | 'alternative' | 'foreign_school' | 'ged' | 'not_enrolled';
export type GradeBand = 'upper' | 'middle' | 'lower' | 'unknown';
export type CareerGoal = 'study' | 'work';
export type SupportNeed = 'korean_class' | 'documents' | 'counseling' | 'fees' | 'career' | 'interpretation';

const GRADES: readonly GradeLevel[] = ['elementary', 'middle', 'high'];
const PARENTS: readonly ParentForeign[] = ['father', 'mother', 'both', 'neither'];
const SCHOOLS: readonly SchoolKind[] = ['general', 'vocational', 'meister', 'alternative', 'foreign_school', 'ged', 'not_enrolled'];
const BANDS: readonly GradeBand[] = ['upper', 'middle', 'lower', 'unknown'];
const GOALS: readonly CareerGoal[] = ['study', 'work'];
const LEVELS: readonly KoreanLevel[] = ['beginner', 'topik_3_4', 'topik_5_6'];
const INTERESTS: readonly InterestField[] = ['it', 'culinary', 'design', 'business', 'health'];
const NEEDS: readonly SupportNeed[] = ['korean_class', 'documents', 'counseling', 'fees', 'career', 'interpretation'];
const TYPES: readonly StudentType[] = ['foreign_family', 'mid_entry', 'domestic_multicultural', 'unsure'];
const REGIONS: readonly RegionId[] = REGION_IDS;

/** Questions a person can skip. Stored so progress and a later stats export stay stable. */
export const ONBOARDING_STEPS = [
  'lang',
  'grade',
  'region',
  'type',
  'parents',
  'countries',
  'languages',
  'born',
  'arrived',
  'years',
  'nationality',
  'school',
  'korean',
  'band',
  'interests',
  'goal',
  'support',
  'consent',
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

/**
 * One serializable record for a later account sync.
 * Visa, residency, and ID numbers are not fields and are stripped if present.
 */
export interface StudentProfile {
  version: typeof PROFILE_VERSION;
  entered: boolean;
  onboarded: boolean;
  consentResearch: boolean;
  consentDecided: boolean;
  skipped: OnboardingStep[];
  grade: GradeLevel | null;
  region: RegionId | null;
  studentType: StudentType | null;
  parentForeign: ParentForeign | null;
  fatherCountry: string | null;
  motherCountry: string | null;
  homeLanguages: string[];
  bornAbroad: boolean | null;
  yearArrived: number | null;
  yearsSchoolingAbroad: number | null;
  koreanNationality: boolean | null;
  schoolType: SchoolKind | null;
  koreanLevel: KoreanLevel | null;
  gradeBand: GradeBand | null;
  interests: InterestField[];
  goal: CareerGoal | null;
  supportNeeds: SupportNeed[];
  /** Saved question id so refresh and “finish later” return here. */
  onboardingStep: OnboardingStep | null;
  /** Age in years. Under 14 hides university tracks. Null uses elementary as under 14. */
  age: number | null;
  /** Born in a third country while a parent was leaving North Korea. Not the defector themself. */
  nkThirdCountryBorn: boolean | null;
  updatedAt: string;
}

export const EMPTY_PROFILE: StudentProfile = {
  version: PROFILE_VERSION,
  entered: false,
  onboarded: false,
  consentResearch: false,
  consentDecided: false,
  skipped: [],
  grade: null,
  region: null,
  studentType: null,
  parentForeign: null,
  fatherCountry: null,
  motherCountry: null,
  homeLanguages: [],
  bornAbroad: null,
  yearArrived: null,
  yearsSchoolingAbroad: null,
  koreanNationality: null,
  schoolType: null,
  koreanLevel: null,
  gradeBand: null,
  interests: [],
  goal: null,
  supportNeeds: [],
  onboardingStep: null,
  age: null,
  nkThirdCountryBorn: null,
  updatedAt: '',
};

const BANNED_KEY = /visa|residen|passport|rrn|idnumber|staystatus|alien|체류|주민|여권|외국인등록/i;
const VISA_CODE = /^(?:[A-H]-\d|undocumented)$/i;
const LONG_DIGITS = /\d{6,}/;

function pick<T extends string>(allowed: readonly T[], value: unknown): T | null {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

function countryCode(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const code = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return null;
  return code;
}

function languageCode(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const code = value.trim().toLowerCase();
  if (!/^[a-z]{2,3}$/.test(code)) return null;
  return code;
}

function yearOrNull(value: unknown): number | null {
  const year = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isInteger(year) || year < 1980 || year > 2100) return null;
  return year;
}

function yearsCount(value: unknown): number | null {
  const years = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isInteger(years) || years < 0 || years > 20) return null;
  return years;
}

function boolOrNull(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function ageOrNull(value: unknown): number | null {
  const age = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isInteger(age) || age < 1 || age > 30) return null;
  return age;
}

export function parseProfile(raw: unknown): StudentProfile {
  const value = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const skipped = Array.isArray(value.skipped)
    ? value.skipped.filter((step): step is OnboardingStep => (ONBOARDING_STEPS as readonly string[]).includes(String(step)))
    : [];
  const bornAbroad = boolOrNull(value.bornAbroad);
  const profile: StudentProfile = {
    version: PROFILE_VERSION,
    entered: value.entered === true,
    onboarded: value.onboarded === true,
    consentResearch: value.consentResearch === true,
    consentDecided: value.consentDecided === true,
    skipped,
    grade: pick(GRADES, value.grade),
    region: pick(REGIONS, value.region),
    studentType: pick(TYPES, value.studentType),
    parentForeign: pick(PARENTS, value.parentForeign),
    fatherCountry: countryCode(value.fatherCountry),
    motherCountry: countryCode(value.motherCountry),
    homeLanguages: Array.isArray(value.homeLanguages)
      ? [...new Set(value.homeLanguages.map(languageCode).filter((code): code is string => Boolean(code)))]
      : [],
    bornAbroad,
    yearArrived: bornAbroad === true ? yearOrNull(value.yearArrived) : null,
    yearsSchoolingAbroad: yearsCount(value.yearsSchoolingAbroad),
    koreanNationality: boolOrNull(value.koreanNationality),
    schoolType: pick(SCHOOLS, value.schoolType),
    koreanLevel: pick(LEVELS, value.koreanLevel),
    gradeBand: pick(BANDS, value.gradeBand),
    interests: Array.isArray(value.interests)
      ? value.interests.filter((item): item is InterestField => (INTERESTS as readonly string[]).includes(String(item)))
      : [],
    goal: pick(GOALS, value.goal),
    supportNeeds: Array.isArray(value.supportNeeds)
      ? value.supportNeeds.filter((item): item is SupportNeed => (NEEDS as readonly string[]).includes(String(item)))
      : [],
    onboardingStep: pick(ONBOARDING_STEPS, value.onboardingStep),
    age: ageOrNull(value.age),
    nkThirdCountryBorn: boolOrNull(value.nkThirdCountryBorn),
    updatedAt: typeof value.updatedAt === 'string' && value.updatedAt.length < 40 ? value.updatedAt : '',
  };
  return profile;
}

export function serializeProfile(profile: StudentProfile): string {
  const clean = parseProfile(profile);
  const json = JSON.stringify(clean);
  if (BANNED_KEY.test(json) || VISA_CODE.test(json) || LONG_DIGITS.test(json)) {
    return JSON.stringify(parseProfile(EMPTY_PROFILE));
  }
  return json;
}

export function readProfile(): StudentProfile {
  if (typeof window === 'undefined') return { ...EMPTY_PROFILE, skipped: [], homeLanguages: [], interests: [], supportNeeds: [] };
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? parseProfile(JSON.parse(raw) as unknown) : { ...EMPTY_PROFILE, skipped: [], homeLanguages: [], interests: [], supportNeeds: [] };
  } catch {
    return { ...EMPTY_PROFILE, skipped: [], homeLanguages: [], interests: [], supportNeeds: [] };
  }
}

export function writeProfile(profile: StudentProfile): void {
  if (typeof window === 'undefined') return;
  const next = parseProfile({ ...profile, updatedAt: new Date().toISOString() });
  window.localStorage.setItem(PROFILE_STORAGE_KEY, serializeProfile(next));
}

/** Coded fields for a later stats pipeline. Nothing is sent unless consent is on, and nothing leaves the device here. */
export interface ProfileStats {
  v: 1;
  consent: true;
  grade: GradeLevel | null;
  region: RegionId | null;
  studentType: StudentType | null;
  parentForeign: ParentForeign | null;
  fatherCountry: string | null;
  motherCountry: string | null;
  homeLanguages: string[];
  bornAbroad: boolean | null;
  yearArrived: number | null;
  yearsSchoolingAbroad: number | null;
  koreanNationality: boolean | null;
  schoolType: SchoolKind | null;
  koreanLevel: KoreanLevel | null;
  gradeBand: GradeBand | null;
  interests: InterestField[];
  goal: CareerGoal | null;
  supportNeeds: SupportNeed[];
  skipped: OnboardingStep[];
}

export function statsSnapshot(profile: StudentProfile): ProfileStats | null {
  if (!profile.consentResearch) return null;
  const clean = parseProfile(profile);
  return {
    v: 1,
    consent: true,
    grade: clean.grade,
    region: clean.region,
    studentType: clean.studentType,
    parentForeign: clean.parentForeign,
    fatherCountry: clean.fatherCountry,
    motherCountry: clean.motherCountry,
    homeLanguages: clean.homeLanguages,
    bornAbroad: clean.bornAbroad,
    yearArrived: clean.yearArrived,
    yearsSchoolingAbroad: clean.yearsSchoolingAbroad,
    koreanNationality: clean.koreanNationality,
    schoolType: clean.schoolType,
    koreanLevel: clean.koreanLevel,
    gradeBand: clean.gradeBand,
    interests: clean.interests,
    goal: clean.goal,
    supportNeeds: clean.supportNeeds,
    skipped: clean.skipped,
  };
}

export function visibleSteps(profile: StudentProfile): OnboardingStep[] {
  return ONBOARDING_STEPS.filter((step) => {
    if (step === 'arrived') return profile.bornAbroad === true;
    if (step === 'countries') return profile.parentForeign !== 'neither';
    return true;
  });
}

export function stepAnswered(profile: StudentProfile, step: OnboardingStep): boolean {
  if (profile.skipped.includes(step)) return true;
  switch (step) {
    case 'lang':
      return true;
    case 'grade':
      return profile.grade !== null;
    case 'region':
      return profile.region !== null;
    case 'type':
      return profile.studentType !== null;
    case 'parents':
      return profile.parentForeign !== null;
    case 'countries':
      return Boolean(profile.fatherCountry || profile.motherCountry);
    case 'languages':
      return profile.homeLanguages.length > 0;
    case 'born':
      return profile.bornAbroad !== null;
    case 'arrived':
      return profile.yearArrived !== null;
    case 'years':
      return profile.yearsSchoolingAbroad !== null;
    case 'nationality':
      return profile.koreanNationality !== null;
    case 'school':
      return profile.schoolType !== null;
    case 'korean':
      return profile.koreanLevel !== null;
    case 'band':
      return profile.gradeBand !== null;
    case 'interests':
      return profile.interests.length > 0;
    case 'goal':
      return profile.goal !== null;
    case 'support':
      return profile.supportNeeds.length > 0;
    case 'consent':
      return profile.consentDecided;
    default:
      return false;
  }
}

/** First visit starts at the language question. A saved step resumes. A finished profile opens at the start for editing. */
export function resumeStep(profile: StudentProfile): OnboardingStep {
  const steps = visibleSteps(profile);
  const first = steps[0] ?? 'lang';
  if (profile.onboarded) return first;
  if (profile.onboardingStep && steps.includes(profile.onboardingStep)) return profile.onboardingStep;
  if (!profile.entered && !profile.updatedAt) return first;
  return steps.find((step) => !stepAnswered(profile, step)) ?? first;
}

export function isUnder14(profile: StudentProfile): boolean {
  if (profile.age != null) return profile.age < 14;
  return profile.grade === 'elementary';
}
