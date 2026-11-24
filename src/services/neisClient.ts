import { SEOUL_VOCATIONAL_SCHOOLS, type InterestField, type SeoulVocationalSchool } from '../data/admissionsData';

export interface NeisSchoolQueryResult {
  source: 'live_neis' | 'snapshot_fallback';
  asOf: string;
  schools: SeoulVocationalSchool[];
  notice: string;
}

interface NeisMajorRow {
  SD_SCHUL_CODE: string;
  ATPT_OFCDC_SC_CODE: string;
  SCHUL_NM: string;
  DDDEP_NM: string;
}

/**
 * NEIS schoolMajorinfo Open API 실시간 조회 (키 미입력·오류 시 2026 서울 특성화고 스냅샷 자동 폴백)
 */
export async function fetchSeoulVocationalMajors(
  field: InterestField,
  apiKey?: string,
): Promise<NeisSchoolQueryResult> {
  const fallbackSchools = SEOUL_VOCATIONAL_SCHOOLS.filter((s) => s.field === field);
  const trimmedKey = apiKey?.trim();

  if (!trimmedKey) {
    return {
      source: 'snapshot_fallback',
      asOf: '2026-09-01 스냅샷',
      schools: fallbackSchools,
      notice: 'NEIS API 키 미입력 상태이므로 서울 특성화고 고정 스냅샷을 표시해요.',
    };
  }

  try {
    const url = new URL('https://open.neis.go.kr/hub/schoolMajorinfo');
    url.searchParams.set('KEY', trimmedKey);
    url.searchParams.set('Type', 'json');
    url.searchParams.set('pIndex', '1');
    url.searchParams.set('pSize', '60');
    url.searchParams.set('ATPT_OFCDC_SC_CODE', 'B10');

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as {
      schoolMajorinfo?: [{ head: unknown }, { row: NeisMajorRow[] }];
    };
    const rows = data.schoolMajorinfo?.[1]?.row;
    if (!rows || rows.length === 0) throw new Error('빈 응답');

    const bySchool = new Map<string, SeoulVocationalSchool>();
    for (const row of rows) {
      const existing = bySchool.get(row.SD_SCHUL_CODE);
      if (existing) {
        if (!existing.majors.includes(row.DDDEP_NM)) existing.majors.push(row.DDDEP_NM);
      } else {
        bySchool.set(row.SD_SCHUL_CODE, {
          neisCode: row.SD_SCHUL_CODE,
          officeCode: row.ATPT_OFCDC_SC_CODE,
          name: row.SCHUL_NM,
          schoolType: row.SCHUL_NM.includes('마이스터') ? '마이스터고' : '특성화고',
          district: '서울시교육청(B10)',
          field,
          majors: [row.DDDEP_NM],
          specialTrack: 'NEIS 실시간 조회 학과',
          univSpecialEligible: !row.SCHUL_NM.includes('마이스터'),
        });
      }
    }

    return {
      source: 'live_neis',
      asOf: new Date().toISOString().slice(0, 10),
      schools: Array.from(bySchool.values()).slice(0, 8),
      notice: 'NEIS Open API(schoolMajorinfo)에서 서울 고교 학과를 실시간으로 불러왔어요.',
    };
  } catch {
    return {
      source: 'snapshot_fallback',
      asOf: '2026-09-01 스냅샷',
      schools: fallbackSchools,
      notice: 'NEIS 실시간 호출 실패(CORS 또는 키 확인 필요)로 마지막 성공 스냅샷을 표시해요.',
    };
  }
}
