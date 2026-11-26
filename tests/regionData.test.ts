import { describe, expect, it } from 'vitest';
import { GYEONGGI_SUPPORT_CENTERS } from '../src/data/centersData';
import {
  ANSAN_SCHOOL_PLAN,
  GYEONGGI_CITIES,
  GYEONGGI_FAMILY_CENTERS,
  GYEONGGI_KLS,
  GYEONGGI_PROCEDURES,
  GYEONGGI_ROWS,
} from '../src/data/gyeonggiData';
import { MULTICULTURAL_FACTS, NO_TRACK_2027 } from '../src/data/multiculturalContent';
import { MULTICULTURAL_ROWS } from '../src/i18n/extraCopy';
import { REGION_COPY } from '../src/i18n/regionCopy';

describe('gyeonggi and multicultural sources', () => {
  it('keeps a family center phone from the center site for every listed city', () => {
    expect(GYEONGGI_CITIES).toHaveLength(16);
    expect(GYEONGGI_FAMILY_CENTERS).toHaveLength(16);
    expect(GYEONGGI_FAMILY_CENTERS.map((row) => row.city)).toEqual([...GYEONGGI_CITIES]);
    expect(GYEONGGI_SUPPORT_CENTERS.every((center) => center.phone !== 'not_found' && center.verifiedAt === '2026-11')).toBe(true);
    const hwaseong = GYEONGGI_FAMILY_CENTERS.find((row) => row.city === '화성');
    expect(hwaseong?.phone).toBe('031-352-1214');
    expect(GYEONGGI_ROWS.some((row) => row.phone === 'not_found' || row.quote === 'not_found')).toBe(false);
  });

  it('lists the March 2026 KLS sites and the credential flow', () => {
    expect(GYEONGGI_KLS).toHaveLength(35);
    expect(GYEONGGI_KLS.every((row) => row.quote.includes('2026.3.31'))).toBe(true);
    expect(GYEONGGI_KLS.filter((row) => row.quote.includes('50과정'))).toHaveLength(33);
    expect(GYEONGGI_KLS.some((row) => row.quote.includes('장기형(2과정)'))).toBe(true);
    expect(GYEONGGI_KLS.some((row) => row.quote.includes('13과정'))).toBe(true);
    expect(ANSAN_SCHOOL_PLAN?.quote).toContain('설립 추진');
    const flow = GYEONGGI_PROCEDURES.map((row) => row.quote).join(' ');
    expect(flow).toContain('임대차계약서');
    expect(flow).toContain('인우보증서');
    expect(flow).toContain('연 4회');
    expect(GYEONGGI_PROCEDURES[0]?.phone).toBe('031-1396');
    expect(GYEONGGI_PROCEDURES.some((row) => row.source_url.includes('gne.go.kr'))).toBe(false);
  });

  it('shows verified multicultural facts, partial quotes only, and skips missing scholarships', () => {
    expect(MULTICULTURAL_FACTS.every((fact) => fact.verifiedAt === '2026-11' && fact.sourceUrl.startsWith('https://'))).toBe(true);
    expect(MULTICULTURAL_FACTS.some((fact) => fact.text.includes('월 25만'))).toBe(true);
    expect(MULTICULTURAL_FACTS.some((fact) => fact.text.includes('1,090'))).toBe(false);
    expect(MULTICULTURAL_FACTS.some((fact) => fact.name.includes('정몽구'))).toBe(false);
    expect(MULTICULTURAL_FACTS.some((fact) => fact.press)).toBe(true);
    expect(NO_TRACK_2027.length).toBeGreaterThan(5);
    const langs = Object.keys(MULTICULTURAL_ROWS);
    expect(langs).toHaveLength(8);
    for (const lang of langs) {
      expect(MULTICULTURAL_ROWS[lang as keyof typeof MULTICULTURAL_ROWS].korea).toBeTruthy();
      expect(REGION_COPY[lang as keyof typeof REGION_COPY].closed2027).toBeTruthy();
      expect(REGION_COPY[lang as keyof typeof REGION_COPY].press).toBeTruthy();
    }
  });
});
