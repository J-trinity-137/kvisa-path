import type { BackgroundType, KoreanLevel } from '../data/admissionsData';
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
}
