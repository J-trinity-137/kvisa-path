import type { BackgroundType, InterestField, KoreanLevel } from '../data/admissionsData';
import type { RegionId } from '../data/freshness';
import type { StudentType } from '../data/studentType';
import type { ProcedureLevel, VisaCode } from '../data/visaPaths';

/** In-memory counselling context. Never written to storage or analytics. */
export interface PathChoice {
  region: RegionId;
  stage: ProcedureLevel;
  background: BackgroundType;
  visa: VisaCode | '';
  koreanLevel: KoreanLevel;
  field: InterestField;
  studentType: StudentType | null;
}

export const EMPTY_PATH: PathChoice = {
  region: 'seoul',
  stage: 'high',
  background: 'both_foreign',
  visa: '',
  koreanLevel: 'topik_3_4',
  field: 'it',
  studentType: null,
};
