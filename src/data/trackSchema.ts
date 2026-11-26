/**
 * Admission-track schema shared by the 2028 pathway rows and the later
 * foreign-track file (외국인 특별전형, 12년/3년 특례, 외국인학교 졸업자,
 * 국제학부, GKS, 북한이탈주민).
 *
 * The app does not collect visa or residency status. Post-graduation stay
 * rows are general information with a source link, and matching ignores them
 * when the query is about nationality.
 */

export const TRACK_CATEGORIES = [
  'multicultural',
  'foreign_special',
  'overseas_12yr',
  'overseas_3yr',
  'foreign_school_graduate',
  'international_college',
  'scholarship',
  'north_korean_defector',
  'mid_entry',
  'ged',
  'alternative_school',
  'vocational_entry',
  'calendar',
  'support_center',
  'post_graduation_stay',
  'admission_overview',
] as const;

export type TrackCategory = (typeof TRACK_CATEGORIES)[number];

export const PATHWAY_STATUSES = ['verified', 'partial', 'not_found'] as const;

export type PathwayStatus = (typeof PATHWAY_STATUSES)[number];

/** 2028 is the cycle a student is aiming at. 2027 guides are closed reference. */
export type CycleRole = 'current_target' | 'closed_reference' | 'standing' | 'general_info';

export type NationalityCondition =
  | 'korean_citizen_only'
  | 'both_parents_and_student_foreign'
  | 'foreign_national_student'
  | 'either'
  | 'unspecified';

export type QuotaKind = 'in_quota' | 'out_of_quota' | 'unrestricted' | 'cap_percent' | 'unknown';

export interface Quota {
  seats: number | null;
  kind: QuotaKind;
  /** Set when the guide caps the track at a percent of the regular quota. */
  capPercent: number | null;
  noteKo: string | null;
}

export interface AgeResidencyCondition {
  minAge: number | null;
  maxAge: number | null;
  minYearsInKorea: number | null;
  /** The residence years must be completed before this age. */
  yearsCountedBeforeAge: number | null;
  domesticSchool: 'elementary_middle_high' | 'high_school' | 'enrolled_or_graduated' | null;
  noteKo: string | null;
}

export interface EligibilityConditions {
  nationality: NationalityCondition;
  /** 다문화가족지원법상 다문화가족의 자녀. null when the row does not say. */
  multiculturalFamilyChild: boolean | null;
  /** 부모와 학생 모두 외국인. null when the row does not say. */
  bothParentsForeign: boolean | null;
  renunciationDisqualifies: boolean;
  foreignHighSchoolExcluded: boolean;
  gedAccepted: boolean | null;
  /** 검정고시 접수 신분증으로 외국인등록증을 받는지. */
  alienRegistrationCardAccepted: boolean | null;
  ageResidency: AgeResidencyCondition | null;
  legalBasis: readonly string[];
  textKo: string;
}

export interface PathwayWindow {
  id: string;
  start: string;
  end: string;
}

export const TARGET_2028_WINDOWS = {
  susi: { id: 'susi-2028', start: '2027-09-20', end: '2027-09-23' },
  jeongsi: { id: 'jeongsi-2028', start: '2028-01-03', end: '2028-01-06' },
} as const satisfies Record<string, PathwayWindow>;

export interface PathwayRecord {
  id: string;
  category: TrackCategory;
  /** Other categories this single source also states. */
  alsoCovers: readonly TrackCategory[];
  name: string;
  university: string | null;
  track: string | null;
  /** false when the guide was checked and this qualification is absent. */
  hasTrack: boolean | null;
  quota: Quota;
  eligibility: EligibilityConditions;
  cycleYear: 2027 | 2028 | null;
  role: CycleRole;
  url: string;
  sourceUrl: string;
  quote: string;
  summaryKo: string;
  verifiedAt: string;
  status: PathwayStatus;
  notes: string | null;
  windows: readonly PathwayWindow[];
  phone: string | null;
  sourceType: string;
  /** Always false. Stay text is not a question and not an answer. */
  asksVisaOrResidency: false;
  /** Always false. Rows are not filtered by a visa or residency answer. */
  tiedToUserInput: false;
}

const VERIFIED_AT_RE = /^\d{4}-\d{2}$/;

export function isShippedPathway(row: PathwayRecord): boolean {
  return (
    row.status === 'verified' &&
    row.url.startsWith('https://') &&
    VERIFIED_AT_RE.test(row.verifiedAt) &&
    row.asksVisaOrResidency === false &&
    row.tiedToUserInput === false
  );
}

export interface TrackQuery {
  nationality?: 'korean' | 'foreign' | 'unknown';
  bothParentsForeign?: boolean;
  multiculturalFamilyChild?: boolean;
  category?: TrackCategory;
}

function covers(row: PathwayRecord, category: TrackCategory): boolean {
  return row.category === category || row.alsoCovers.includes(category);
}

/**
 * Match published rules. General stay rows stay in the list: they are not
 * tied to nationality, visa, or residency input.
 */
export function matchPathways(rows: readonly PathwayRecord[], query: TrackQuery): readonly PathwayRecord[] {
  return rows.filter((row) => {
    if (query.category && !covers(row, query.category)) return false;
    if (row.role === 'general_info' || row.category === 'post_graduation_stay') return true;
    if (query.nationality === 'korean' && row.eligibility.nationality === 'both_parents_and_student_foreign') return false;
    if (query.nationality === 'korean' && row.eligibility.nationality === 'foreign_national_student') return false;
    if (query.nationality === 'foreign' && row.eligibility.nationality === 'korean_citizen_only') return false;
    if (query.bothParentsForeign === false && row.eligibility.bothParentsForeign === true) return false;
    if (
      query.multiculturalFamilyChild === false &&
      row.eligibility.multiculturalFamilyChild === true &&
      row.eligibility.nationality === 'korean_citizen_only'
    ) {
      return false;
    }
    return true;
  });
}
