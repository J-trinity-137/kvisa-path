import { describe, expect, it, afterEach } from 'vitest';
import { SUPPORTED_LANGS, type SupportedLangCode } from '../src/kbridge/types';
import { REGION_IDS } from '../src/data/freshness';
import { EVENT_STORAGE_KEY } from '../src/privacy/records';
import { readRegion, REGION_KEY, writeRegion } from '../src/data/regionPref';
import {
  NATIONAL_LINES,
  NATIONWIDE_ENTRIES,
  NATIONWIDE_GAPS,
  NATIONWIDE_IDS,
  entriesFor,
} from '../src/data/nationwideRegions';
import { NATIONWIDE_UI, REGION_LABELS, categoryLabel } from '../src/i18n/regionLabels';

function installMemoryStorage() {
  const mem = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => (mem.has(key) ? mem.get(key)! : null),
    setItem: (key: string, value: string) => {
      mem.set(key, value);
    },
    removeItem: (key: string) => {
      mem.delete(key);
    },
    clear: () => mem.clear(),
    key: () => null,
    get length() {
      return mem.size;
    },
  };
  Object.defineProperty(globalThis, 'window', {
    value: { localStorage, dispatchEvent: () => true },
    configurable: true,
  });
  Object.defineProperty(globalThis, 'localStorage', { value: localStorage, configurable: true });
  return mem;
}

describe('nationwide region contacts', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'window');
    Reflect.deleteProperty(globalThis, 'localStorage');
  });

  it('gives every published row a checked month and a source link', () => {
    expect(NATIONWIDE_IDS).toHaveLength(15);
    expect(REGION_IDS).toHaveLength(17);
    expect(NATIONWIDE_ENTRIES.length).toBeGreaterThan(150);
    for (const entry of NATIONWIDE_ENTRIES) {
      expect(entry.verifiedAt).toMatch(/^\d{4}-\d{2}$/);
      expect(entry.sourceUrl.startsWith('http://') || entry.sourceUrl.startsWith('https://')).toBe(true);
      expect(entry.phone).not.toContain('not_found');
      expect(entry.quote).not.toContain('not_found');
      if (entry.nameOnly) expect(entry.phone).toBe('');
      else expect(entry.phone).toMatch(/\d/);
    }
    for (const line of NATIONAL_LINES) {
      expect(line.verifiedAt).toMatch(/^\d{4}-\d{2}$/);
      expect(line.sourceUrl.startsWith('https://')).toBe(true);
    }
    for (const gap of NATIONWIDE_GAPS) {
      expect(gap.verifiedAt).toMatch(/^\d{4}-\d{2}$/);
      expect(gap.sourceUrl.startsWith('http')).toBe(true);
      expect(gap.centerPhone).toMatch(/\d/);
    }
  });

  it('keeps the checked phones and the named exceptions', () => {
    const incheon = entriesFor('incheon');
    const schools = incheon.filter((row) => row.name === '세계로국제중고등학교');
    expect(schools).toHaveLength(1);
    expect(schools[0]?.phone).toBe('032-627-2250');
    expect(schools[0]?.notMulticulturalOnly).toBe(true);
    const preschool = incheon.filter((row) => row.nameOnly && row.name.includes('위탁기관'));
    expect(preschool.map((row) => row.name)).toEqual(expect.arrayContaining([
      expect.stringContaining('경인교육대학교'),
      expect.stringContaining('인하공업전문대학'),
      expect.stringContaining('함박종합사회복지관'),
      expect.stringContaining('다문화사랑회'),
    ]));
    expect(preschool).toHaveLength(4);
    expect(incheon.some((row) => row.city.includes('제물포구'))).toBe(true);
    expect(incheon.some((row) => row.city.includes('영종구'))).toBe(true);
    expect(incheon.some((row) => row.city.includes('서해구'))).toBe(true);
    expect(incheon.some((row) => row.phone === '032-822-9995')).toBe(true);

    const chungbuk = entriesFor('chungbuk');
    expect(chungbuk.filter((row) => row.category === 'korean_class_school')).toHaveLength(28);

    const chungnam = entriesFor('chungnam');
    const dauri = chungnam.find((row) => row.name.includes('다우리 배움교실'));
    expect(dauri?.phone).toBe('041-549-6402');
    expect(dauri?.press).toBe(false);
    const cheonan = chungnam.find((row) => row.name.includes('천안시 다문화가족지원센터'));
    expect(cheonan?.phone).toBe('1577-8653');
    expect(chungnam.some((row) => row.phone === '041-566-1345')).toBe(false);
    const dangjin = chungnam.find((row) => row.name.includes('당진'));
    expect(dangjin?.phone).toBe('041-360-3200');
    expect(chungnam.find((row) => row.category === 'edu_office_multicultural')?.phone).toBe('041-549-6409');

    const gangwon = entriesFor('gangwon');
    expect(gangwon.find((row) => row.category === 'edu_office_multicultural')?.phone).toBe('033-1396');
    expect(gangwon.some((row) => row.phone === '033-670-1515' || row.phone === '033-670-1508')).toBe(false);
    expect(gangwon.find((row) => row.city === '강릉' && row.category === 'pre_school_korean')?.phone).toBe('033-640-3315');
    expect(gangwon.find((row) => row.city === '원주' && row.category === 'family_center')?.phone).toBe('033-765-8135');
    const cheorwon = gangwon.find((row) => row.city === '철원' && row.category === 'immigration');
    expect(cheorwon?.name).toContain('양주');
    expect(cheorwon?.phone).toBe('031-828-9306');

    const sejong = entriesFor('sejong');
    const immigration = sejong.find((row) => row.category === 'immigration');
    expect(immigration?.name).toContain('대전');
    expect(immigration?.phone.startsWith('042-220-2001')).toBe(true);

    const jeonnam = entriesFor('jeonnam');
    const gwangju = entriesFor('gwangju');
    expect(jeonnam.some((row) => row.name.includes('전남광주통합특별시교육청'))).toBe(true);
    expect(gwangju.some((row) => row.name.includes('전남광주통합특별시교육청') || row.note.includes('전남광주통합특별시교육청'))).toBe(true);
    expect(jeonnam.some((row) => row.note.includes('전남광주통합특별시'))).toBe(true);

    expect(entriesFor('daejeon').some((row) => row.press && row.phone.includes('042-253-7588'))).toBe(true);
    expect(entriesFor('gyeongbuk').some((row) => row.press && row.name.includes('61학급'))).toBe(true);
    expect(entriesFor('gyeongnam').some((row) => row.name.includes('김해시 가족센터'))).toBe(false);
    expect(NATIONWIDE_ENTRIES.some((row) => row.phone === 'not_found' || row.name.includes('검색 색인'))).toBe(false);
  });

  it('lists missing categories as a call to the provincial center and keeps eight languages', () => {
    for (const id of NATIONWIDE_IDS) {
      expect(NATIONWIDE_GAPS.some((gap) => gap.region === id && gap.category === 'youth_center')).toBe(true);
    }
    expect(NATIONAL_LINES.map((line) => line.phone)).toEqual(['02-722-2585', '1577-1366', '1345']);
    expect(SUPPORTED_LANGS).toHaveLength(8);
    const categories = new Set(NATIONWIDE_ENTRIES.map((row) => row.category).concat(NATIONWIDE_GAPS.map((gap) => gap.category)));
    for (const lang of SUPPORTED_LANGS as readonly SupportedLangCode[]) {
      expect(REGION_LABELS[lang].gwangju.length).toBeGreaterThan(0);
      expect(REGION_LABELS[lang].jeonnam.length).toBeGreaterThan(0);
      expect(NATIONWIDE_UI[lang].callCenter.length).toBeGreaterThan(0);
      expect(NATIONWIDE_UI[lang].mergedMark.length).toBeGreaterThan(12);
      if (lang === 'ko') {
        expect(NATIONWIDE_UI[lang].mergedMark).toContain('전남광주통합특별시교육청');
        expect(NATIONWIDE_UI[lang].incheonDistricts).toContain('제물포구');
      } else {
        expect(REGION_LABELS[lang].gwangju).not.toMatch(/[가-힣]/);
        expect(REGION_LABELS[lang].jeonnam).not.toMatch(/[가-힣]/);
        expect(NATIONWIDE_UI[lang].mergedMark).not.toMatch(/[가-힣]/);
        expect(NATIONWIDE_UI[lang].incheonDistricts).not.toMatch(/[가-힣]/);
      }
      for (const category of categories) expect(categoryLabel(lang, category)).not.toBe(category);
    }
  });

  it('stores only a known region id on this device', () => {
    const mem = installMemoryStorage();
    mem.set(EVENT_STORAGE_KEY, '[]');
    writeRegion('busan');
    expect(readRegion()).toBe('busan');
    expect(mem.get(REGION_KEY)).toBe('busan');
    expect(mem.get(EVENT_STORAGE_KEY)).toBe('[]');
    mem.set(REGION_KEY, 'parent visa F-2');
    expect(readRegion()).toBe('seoul');
  });
});
