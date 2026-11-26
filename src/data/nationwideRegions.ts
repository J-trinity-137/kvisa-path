import type { RegionId } from './freshness';
import busanRows from './sources/regions/busan.json';
import chungbukRows from './sources/regions/chungbuk.json';
import chungnamRows from './sources/regions/chungnam.json';
import daeguRows from './sources/regions/daegu.json';
import daejeonRows from './sources/regions/daejeon.json';
import gangwonRows from './sources/regions/gangwon.json';
import gwangjuRows from './sources/regions/gwangju.json';
import gyeongbukRows from './sources/regions/gyeongbuk.json';
import gyeongnamRows from './sources/regions/gyeongnam.json';
import incheonRows from './sources/regions/incheon.json';
import jejuRows from './sources/regions/jeju.json';
import jeonbukRows from './sources/regions/jeonbuk.json';
import jeonnamRows from './sources/regions/jeonnam.json';
import sejongRows from './sources/regions/sejong.json';
import ulsanRows from './sources/regions/ulsan.json';
import centralRows from './sources/central.json';

/** Fifteen 시도 added on top of the existing Seoul and Gyeonggi guides. */
export const NATIONWIDE_IDS = [
  'busan',
  'daegu',
  'incheon',
  'gwangju',
  'daejeon',
  'ulsan',
  'sejong',
  'gangwon',
  'chungbuk',
  'chungnam',
  'jeonbuk',
  'jeonnam',
  'gyeongbuk',
  'gyeongnam',
  'jeju',
] as const;

export type NationwideRegionId = (typeof NATIONWIDE_IDS)[number];

const CENTRAL_REGIONS = new Set<NationwideRegionId>(['incheon', 'gangwon', 'daejeon', 'sejong', 'chungbuk', 'chungnam']);

const ID_BY_NAME: Record<string, NationwideRegionId> = {
  부산: 'busan',
  대구: 'daegu',
  인천: 'incheon',
  광주: 'gwangju',
  대전: 'daejeon',
  울산: 'ulsan',
  세종: 'sejong',
  강원: 'gangwon',
  충북: 'chungbuk',
  충남: 'chungnam',
  전북: 'jeonbuk',
  전남: 'jeonnam',
  경북: 'gyeongbuk',
  경남: 'gyeongnam',
  제주: 'jeju',
};

interface RawRow {
  region: string;
  city: string;
  category: string;
  name: string;
  phone?: string;
  url?: string;
  quote?: string;
  source_url?: string;
  source_type?: string;
  status?: string;
  verified_at?: string;
  note?: string;
}

export interface RegionEntry {
  id: string;
  region: NationwideRegionId;
  city: string;
  category: string;
  name: string;
  phone: string;
  url: string;
  quote: string;
  sourceUrl: string;
  verifiedAt: string;
  note: string;
  press: boolean;
  nameOnly: boolean;
  planning: boolean;
  notMulticulturalOnly: boolean;
}

export interface RegionGap {
  region: NationwideRegionId;
  category: string;
  centerName: string;
  centerPhone: string;
  sourceUrl: string;
  verifiedAt: string;
}

export interface NationalLine {
  id: string;
  name: string;
  phone: string;
  sourceUrl: string;
  verifiedAt: string;
}

const FILE_ROWS: Record<NationwideRegionId, RawRow[]> = {
  busan: busanRows as RawRow[],
  daegu: daeguRows as RawRow[],
  incheon: incheonRows as RawRow[],
  gwangju: gwangjuRows as RawRow[],
  daejeon: daejeonRows as RawRow[],
  ulsan: ulsanRows as RawRow[],
  sejong: sejongRows as RawRow[],
  gangwon: gangwonRows as RawRow[],
  chungbuk: chungbukRows as RawRow[],
  chungnam: chungnamRows as RawRow[],
  jeonbuk: jeonbukRows as RawRow[],
  jeonnam: jeonnamRows as RawRow[],
  gyeongbuk: gyeongbukRows as RawRow[],
  gyeongnam: gyeongnamRows as RawRow[],
  jeju: jejuRows as RawRow[],
};

const MERGED_OFFICE = '전남광주통합특별시교육청';
const MERGED_NOTE = '2026년 7월 광주·전남이 전남광주통합특별시로 통합되었습니다. 교육청 명칭은 전남광주통합특별시교육청입니다.';

function httpUrl(value: string | undefined): string {
  const url = (value ?? '').trim();
  return url.startsWith('http://') || url.startsWith('https://') ? url : '';
}

function hasPhone(phone: string | undefined): boolean {
  const value = (phone ?? '').trim();
  return value !== '' && value !== 'not_found' && value !== '없음' && /\d/.test(value);
}

function phoneKeys(phone: string): string[] {
  const keys = new Set<string>();
  const text = phone.replace(/[()]/g, ' ');
  for (const match of text.matchAll(/(0\d{1,2})-(\d{3,4})-(\d{4})\s*~\s*(\d{1,4})/g)) {
    const start = Number(match[3]);
    const endRaw = match[4] ?? '';
    const end = endRaw.length < 4 ? Number(`${match[3]?.slice(0, 4 - endRaw.length) ?? ''}${endRaw}`) : Number(endRaw);
    const last = Math.min(end, start + 12);
    for (let n = start; n <= last; n += 1) keys.add(`${match[1]}${match[2]}${n}`);
  }
  for (const match of text.matchAll(/(0\d{1,2})-(\d{3,4})-(\d{4})/g)) keys.add(`${match[1]}${match[2]}${match[3]}`);
  for (const match of text.matchAll(/(1\d{3})-(\d{4})/g)) keys.add(`${match[1]}${match[2]}`);
  if (/(^|\D)1345(\D|$)/.test(text)) keys.add('1345');
  return [...keys];
}

function isPress(row: RawRow): boolean {
  if (row.source_type === 'news') return true;
  const src = `${row.source_url ?? ''} ${row.url ?? ''}`;
  return /articleView\.html|newsis\.com|gocj\.net|atnnews\.co\.kr|ihalla\.com|guminews\.net|focusincheon\.com|jbnews\.com|chungnamilbo/.test(src);
}

function nameOnlyAllowed(row: RawRow): boolean {
  if (hasPhone(row.phone)) return false;
  if (row.region === '인천' && row.category === 'pre_school_korean' && row.name.includes('위탁기관')) return true;
  return row.region === '충북' && row.category === 'korean_class_school' && (row.source_url ?? '').includes('cbiei.go.kr');
}

function cityToken(city: string): string {
  const head = city.split('·')[0]?.split('(')[0] ?? city;
  return head.replace(/특별자치도|광역시|특별시/g, '').replace(/[시군구\s]/g, '');
}

function looseName(name: string): string {
  return name.replace(/\(.*?\)/g, '').replace(/\s+/g, '');
}

function differentDesk(a: string, b: string): boolean {
  const mark = /다문화사업|거점팀|직통/;
  return mark.test(a) !== mark.test(b);
}

function preferContact(row: RawRow): RawRow {
  const note = row.note ?? '';
  const source = httpUrl(row.source_url);
  const page = httpUrl(row.url);
  if (note.includes('센터 사이트') && note.includes('우선')) {
    const match = note.match(/대표전화\s*[:：]\s*((?:0\d{1,2}|1\d{3})-\d{3,4}-\d{4})/);
    if (match?.[1]) {
      return { ...row, phone: match[1], source_url: page.includes('familynet.or.kr') ? page : source, url: page || row.url };
    }
  }
  if ((row.phone ?? '').includes('1577-8653')) return { ...row, phone: '1577-8653' };
  if ((row.phone ?? '').includes('064-710-0242') && note.includes('원문 미확인') && (row.quote ?? '').includes('064-710-0294')) {
    return { ...row, phone: '064-710-0294' };
  }
  if ((row.name.includes('세계로') || row.name.includes('한누리')) && (row.phone ?? '').includes('627-2250')) {
    return { ...row, phone: '032-627-2250' };
  }
  return row;
}

function applyCenterSite(row: RawRow, siblings: readonly RawRow[]): RawRow {
  if (row.category !== 'family_center') return row;
  const token = cityToken(row.city);
  const site = siblings.find(
    (other) =>
      other.status === 'verified' &&
      other.category === 'family_center' &&
      (other.source_url ?? '').includes('familynet.or.kr') &&
      cityToken(other.city) === token &&
      hasPhone(other.phone) &&
      !differentDesk(other.name, row.name),
  );
  if (!site) return row;
  const sitePhone = site.phone ?? '';
  if (phoneKeys(sitePhone).some((key) => phoneKeys(row.phone ?? '').includes(key)) && (row.source_url ?? '').includes('familynet.or.kr')) {
    return row;
  }
  const note = [row.note, `센터 누리집 번호 ${sitePhone}을 우선합니다.`].filter(Boolean).join(' ');
  return {
    ...row,
    phone: sitePhone,
    url: site.url || row.url,
    source_url: site.source_url,
    quote: site.quote || row.quote,
    note,
  };
}

function publish(row: RawRow, region: NationwideRegionId, index: number): RegionEntry | null {
  const sourceUrl = httpUrl(row.source_url);
  if (!sourceUrl) return null;
  const nameOnly = nameOnlyAllowed(row);
  if (!nameOnly && !hasPhone(row.phone)) return null;
  const verifiedAt = /^(\d{4}-\d{2})/.exec(row.verified_at ?? '')?.[1] ?? '';
  if (!verifiedAt) return null;
  let name = row.name;
  let note = row.note ?? '';
  if ((region === 'gwangju' || region === 'jeonnam') && row.category.startsWith('edu_office') && !name.includes(MERGED_OFFICE)) {
    name = `${name} (${MERGED_OFFICE})`;
  }
  if ((region === 'gwangju' || region === 'jeonnam') && !note.includes(MERGED_OFFICE)) note = [note, MERGED_NOTE].filter(Boolean).join(' ');
  const notMulticulturalOnly = name.includes('세계로') || row.name.includes('세계로') || row.name.includes('한누리');
  if (notMulticulturalOnly) name = '세계로국제중고등학교';
  const planning = /추진|개교 전|개교 여부/.test(`${name} ${note}`);
  return {
    id: `${region}-${row.category}-${index}`,
    region,
    city: row.city,
    category: row.category,
    name,
    phone: nameOnly ? '' : (row.phone ?? '').trim(),
    url: httpUrl(row.url),
    quote: row.quote ?? '',
    sourceUrl,
    verifiedAt,
    note,
    press: isPress(row),
    nameOnly,
    planning,
    notMulticulturalOnly,
  };
}

function sameInstitution(a: RawRow, b: RawRow): boolean {
  if (differentDesk(a.name, b.name)) return false;
  if (a.category === 'family_center' && b.category === 'family_center' && cityToken(a.city) === cityToken(b.city)) return true;
  const na = looseName(a.name);
  const nb = looseName(b.name);
  return na.includes(nb) || nb.includes(na);
}

function buildRegion(id: NationwideRegionId): { entries: RegionEntry[]; gaps: RegionGap[] } {
  const local = FILE_ROWS[id];
  const central = (centralRows as RawRow[]).filter((row) => ID_BY_NAME[row.region] === id);
  const chosen: RawRow[] = [];
  if (CENTRAL_REGIONS.has(id)) {
    for (const row of central) {
      const next = applyCenterSite(preferContact(row), local);
      if (hasPhone(next.phone) || nameOnlyAllowed(next)) chosen.push(next);
    }
    for (const row of local) {
      if (row.status !== 'verified' || !hasPhone(row.phone) || !httpUrl(row.source_url)) continue;
      const fixed = preferContact(row);
      const keys = phoneKeys(fixed.phone ?? '');
      const duplicate = chosen.some(
        (other) => sameInstitution(other, fixed) || keys.some((key) => phoneKeys(other.phone ?? '').includes(key)),
      );
      if (!duplicate) chosen.push(fixed);
    }
  } else {
    for (const row of local) {
      if (row.status !== 'verified') continue;
      chosen.push(preferContact(row));
    }
  }

  const entries = chosen
    .map((row, index) => publish(row, id, index))
    .filter((row): row is RegionEntry => row !== null);

  const covered = new Set(entries.map((entry) => entry.category));
  const gapCategories = new Set<string>();
  for (const row of local) {
    if (row.status === 'not_found' || (row.status === 'verified' && !hasPhone(row.phone) && !nameOnlyAllowed(row))) {
      gapCategories.add(row.category);
    }
  }
  for (const row of central) {
    if (!hasPhone(row.phone) && !nameOnlyAllowed(row)) gapCategories.add(row.category);
  }
  const center = entries.find((entry) => entry.category === 'edu_office_multicultural');
  const gaps: RegionGap[] = [];
  if (center) {
    for (const category of gapCategories) {
      if (covered.has(category)) continue;
      gaps.push({
        region: id,
        category,
        centerName: center.name,
        centerPhone: center.phone,
        sourceUrl: center.sourceUrl,
        verifiedAt: center.verifiedAt,
      });
    }
  }
  return { entries, gaps };
}

const BUILT = Object.fromEntries(NATIONWIDE_IDS.map((id) => [id, buildRegion(id)])) as Record<
  NationwideRegionId,
  { entries: RegionEntry[]; gaps: RegionGap[] }
>;

export const NATIONWIDE_ENTRIES: readonly RegionEntry[] = NATIONWIDE_IDS.flatMap((id) => BUILT[id].entries);

export const NATIONWIDE_GAPS: readonly RegionGap[] = NATIONWIDE_IDS.flatMap((id) => BUILT[id].gaps);

export function entriesFor(region: NationwideRegionId): readonly RegionEntry[] {
  return BUILT[region].entries;
}

export function gapsFor(region: NationwideRegionId): readonly RegionGap[] {
  return BUILT[region].gaps;
}

export function isNationwideRegion(region: RegionId): region is NationwideRegionId {
  return (NATIONWIDE_IDS as readonly string[]).includes(region);
}

/** Lines used when a 시도 page has no checked local number. */
export const NATIONAL_LINES: readonly NationalLine[] = [
  {
    id: 'rainbow-hq',
    name: '무지개청소년센터 본부',
    phone: '02-722-2585',
    sourceUrl: 'https://www.gov.kr/portal/foreigner/ko/m030404',
    verifiedAt: '2026-11',
  },
  {
    id: 'danuri',
    name: '다누리콜센터',
    phone: '1577-1366',
    sourceUrl: 'https://www.liveinkorea.kr/web/lay1/S1T40C44/contents.do',
    verifiedAt: '2026-11',
  },
  {
    id: '1345',
    name: '외국인종합안내',
    phone: '1345',
    sourceUrl: 'https://www.immigration.go.kr/immigration/2057/subview.do',
    verifiedAt: '2026-11',
  },
];

export const REGION_FLAGS: Record<NationwideRegionId, { merged: boolean; incheonDistricts: boolean }> = {
  busan: { merged: false, incheonDistricts: false },
  daegu: { merged: false, incheonDistricts: false },
  incheon: { merged: false, incheonDistricts: true },
  gwangju: { merged: true, incheonDistricts: false },
  daejeon: { merged: false, incheonDistricts: false },
  ulsan: { merged: false, incheonDistricts: false },
  sejong: { merged: false, incheonDistricts: false },
  gangwon: { merged: false, incheonDistricts: false },
  chungbuk: { merged: false, incheonDistricts: false },
  chungnam: { merged: false, incheonDistricts: false },
  jeonbuk: { merged: false, incheonDistricts: false },
  jeonnam: { merged: true, incheonDistricts: false },
  gyeongbuk: { merged: false, incheonDistricts: false },
  gyeongnam: { merged: false, incheonDistricts: false },
  jeju: { merged: false, incheonDistricts: false },
};
