import { SEOUL_VOCATIONAL_SCHOOLS, type InterestField, type SeoulVocationalSchool } from '../data/admissionsData';

export interface NeisSchoolQueryResult {
  source: 'snapshot';
  asOf: string;
  schools: SeoulVocationalSchool[];
  notice: string;
}

export interface NeisMajorRow {
  SD_SCHUL_CODE: string;
  ATPT_OFCDC_SC_CODE?: string;
  SCHUL_NM?: string;
  DDDEP_NM: string;
}

/**
 * Group NEIS schoolMajorinfo rows by the curated school-code allowlist.
 * Unknown schools are dropped. The result is not truncated to the first page.
 */
export function majorsByKnownSchool(rows: readonly NeisMajorRow[], allowedCodes: ReadonlySet<string>): Map<string, string[]> {
  const bySchool = new Map<string, string[]>();
  for (const row of rows) {
    if (!allowedCodes.has(row.SD_SCHUL_CODE)) continue;
    const majors = bySchool.get(row.SD_SCHUL_CODE) ?? [];
    if (row.DDDEP_NM && !majors.includes(row.DDDEP_NM)) majors.push(row.DDDEP_NM);
    bySchool.set(row.SD_SCHUL_CODE, majors);
  }
  return bySchool;
}

export function loadVocationalSnapshot(field?: InterestField): NeisSchoolQueryResult {
  const schools = field ? SEOUL_VOCATIONAL_SCHOOLS.filter((school) => school.field === field) : SEOUL_VOCATIONAL_SCHOOLS;
  return {
    source: 'snapshot',
    asOf: '2026-11-26',
    schools,
    notice:
      '브라우저에서 NEIS 인증키를 받지 않아요. 학교코드는 2026-11-26에 NEIS schoolInfo로 확인한 스냅샷이고, 학과명은 서울시교육청 특성화고·마이스터고 안내(문서상 2025학년도)를 따릅니다.',
  };
}
