import rows from './sources/gyeonggi.json';

export interface GyeonggiRow {
  city: string;
  category: string;
  name: string;
  phone: string;
  url: string;
  quote: string;
  source_url: string;
  verified_at: string;
  note?: string;
}

const ALL = rows as GyeonggiRow[];

function usable(row: GyeonggiRow): boolean {
  return row.phone !== 'not_found' && row.quote !== 'not_found' && row.source_url.startsWith('https://');
}

export const GYEONGGI_CITIES = [
  '안산',
  '수원',
  '화성',
  '시흥',
  '부천',
  '김포',
  '평택',
  '포천',
  '파주',
  '고양',
  '남양주',
  '성남',
  '용인',
  '오산',
  '이천',
  '안성',
] as const;

export type GyeonggiCity = (typeof GYEONGGI_CITIES)[number];

export const GYEONGGI_ROWS = ALL.filter(usable);

export function rowsFor(city: string, category: string): GyeonggiRow[] {
  return GYEONGGI_ROWS.filter((row) => row.city === city && row.category === category);
}

export const GYEONGGI_FAMILY_CENTERS = GYEONGGI_CITIES.map((city) => rowsFor(city, 'family_center')[0]).filter(
  (row): row is GyeonggiRow => Boolean(row),
);

export const GYEONGGI_KLS = GYEONGGI_ROWS.filter((row) => row.category === 'kls_korean_language_school');

export const GYEONGGI_CALL_CENTER = GYEONGGI_ROWS.find((row) => row.name.includes('경기에듀콜센터'));

export const GYEONGGI_PROCEDURES = GYEONGGI_ROWS.filter(
  (row) => row.city === '경기도(공통)' && row.category === 'admission_procedure' && !row.source_url.includes('gne.go.kr'),
);

export const GYEONGGI_COMMON_SUPPORT = GYEONGGI_ROWS.filter(
  (row) => row.city === '경기도(공통)' && (row.category === 'school_support' || row.category === 'provincial_edu'),
);

export const OSAN_KLS_ABSENT = ALL.find(
  (row) => row.city === '오산' && row.category === 'kls_korean_language_school' && row.quote === 'not_found',
);

/** Shown only as “설립 추진 중”. No phone was found. */
export const ANSAN_SCHOOL_PLAN = ALL.find(
  (row) => row.category === 'public_alt_school_plan' && row.source_url.startsWith('https://'),
);

/** Checked notes that have a source but no phone. The missing provincial center is left out. */
export const GYEONGGI_NOTES = ALL.filter(
  (row) =>
    row.city === '경기도(공통)' &&
    row.quote !== 'not_found' &&
    row.source_url.startsWith('https://') &&
    row.phone === 'not_found' &&
    !row.name.includes('경기다문화교육센터') &&
    row.category !== 'admission_procedure',
);
