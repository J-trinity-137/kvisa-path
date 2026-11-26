import type { BackgroundType, KoreanLevel } from '../data/admissionsData';
import type { TrackCategory } from '../data/trackSchema';
import type { RegionId } from '../data/freshness';
import type { CareerGoal, GradeLevel, SchoolKind, SupportNeed } from '../profile/profile';

export type PathwayKind =
  | 'admission'
  | 'multicultural-univ'
  | 'scholarship'
  | 'procedure'
  | 'vocational'
  | 'kls'
  | 'support';

export type Gate = 'required' | 'rejected' | 'any';

/** Predicates copied from source rows. Omit a field to leave it open. */
export interface PathwayWhen {
  grades?: GradeLevel[];
  regions?: RegionId[];
  backgrounds?: BackgroundType[];
  koreanLevels?: KoreanLevel[];
  goals?: CareerGoal[];
  schoolTypes?: SchoolKind[];
  koreanNational?: Gate;
  bothParentsForeign?: Gate;
  minYearsAbroad?: number;
  maxYearsAbroad?: number;
  bornAbroad?: boolean;
  koreanSupport?: boolean;
  needsInterests?: boolean;
  supportAny?: SupportNeed[];
}

export interface PathwayRecord {
  id: string;
  kind: PathwayKind;
  title: string;
  reason: string;
  yearLabel: string;
  details: string[];
  sourceUrl?: string;
  sourceLabel?: string;
  verifiedAt?: string;
  verified: boolean;
  when: PathwayWhen;
  sort: number;
  /** Filled from live data at evaluation time so school lists are not copied here. */
  detailSource?: 'vocational-schools' | 'multicultural-univs' | 'gyeonggi-kls';
}

export interface EligibleTrack {
  id: string;
  kind: PathwayKind;
  title: string;
  reason: string;
  yearLabel: string;
  details: string[];
  sourceUrl?: string;
  sourceLabel?: string;
  verifiedAt?: string;
  verified: boolean;
  sort: number;
  /** Set when the card comes from a trackSchema row, including foreign tracks. */
  category?: TrackCategory;
  /** Why this profile matches. Codes are translated in the UI. */
  reasons: WhyCode[];
  /** 2027 university guides are closed reference, not the 2028 target. */
  referenceKind?: 'guide' | 'closed';
}

export const WHY_CODES = [
  'korean_national',
  'foreign_national',
  'one_parent_foreign',
  'both_parents_foreign',
  'domestic_born',
  'mid_entry',
  'foreign_school',
  'ged',
  'nk_third_country',
  'topik_short',
  'too_young',
  'grade',
  'not_korean_national',
  'not_foreign_national',
  'not_both_parents',
  'not_multicultural_family',
  'not_mid_entry',
  'not_foreign_school',
  'not_ged',
  'not_nk',
  'ged_rejected',
  'ged_unconfirmed',
  'foreign_school_excluded',
  'overseas_years_short',
  'not_overseas_posting',
  'not_this_overview',
] as const;

export type WhyCode = (typeof WHY_CODES)[number];
