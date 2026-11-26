import { describe, expect, it } from 'vitest';
import { CONSENT_COPY } from '../src/i18n/consentCopy';
import { navCopy, type NavCopy } from '../src/i18n/navCopy';
import { reasonText } from '../src/i18n/reasonCopy';
import { NATIONWIDE_UI, REGION_LABELS } from '../src/i18n/regionLabels';
import { SUPPORTED_LANGS, type SupportedLangCode } from '../src/kbridge';
import { WHY_CODES } from '../src/rules/types';

const HANGUL = /[가-힣]/;
const SAME_AS_ENGLISH = new Set(['TOPIK 3–4', 'TOPIK 5–6', 'IT']);

function leaves(value: unknown, path = ''): { path: string; text: string }[] {
  if (typeof value === 'string') return [{ path, text: value }];
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, item]) => leaves(item, path ? `${path}.${key}` : key));
}

describe('interface chrome is translated', () => {
  it('has the same navigation strings in eight languages, with no leftover English or Korean', () => {
    const english = leaves(navCopy('en'));
    for (const lang of SUPPORTED_LANGS) {
      const copy = navCopy(lang as SupportedLangCode);
      const rows = leaves(copy);
      expect(rows.map((row) => row.path)).toEqual(english.map((row) => row.path));
      for (const row of rows) {
        expect(row.text.length, `${lang} ${row.path}`).toBeGreaterThan(0);
        if (lang !== 'ko') expect(row.text, `${lang} ${row.path}`).not.toMatch(HANGUL);
        if (lang !== 'en' && !SAME_AS_ENGLISH.has(row.text) && row.path !== 'seoul' && row.path !== 'gyeonggi') {
          const source = english.find((item) => item.path === row.path);
          expect(row.text, `${lang} ${row.path}`).not.toBe(source?.text);
        }
      }
      const schools = (copy as NavCopy).schools;
      expect(schools.foreign_school).toBeTruthy();
      expect(schools.ged).toBeTruthy();
    }
  });

  it('translates why-eligible and why-not reasons', () => {
    for (const lang of SUPPORTED_LANGS) {
      for (const code of WHY_CODES) {
        const text = reasonText(lang as SupportedLangCode, code);
        expect(text.length, `${lang} ${code}`).toBeGreaterThan(8);
        if (lang !== 'ko') expect(text, `${lang} ${code}`).not.toMatch(HANGUL);
        if (lang !== 'en') expect(text).not.toBe(reasonText('en', code));
      }
    }
  });

  it('does not leave Korean in consent chrome or region buttons', () => {
    for (const lang of SUPPORTED_LANGS) {
      if (lang === 'ko') continue;
      const consent = CONSENT_COPY[lang as SupportedLangCode];
      expect(consent.nativeReview).not.toMatch(HANGUL);
      expect(consent.todoName).not.toMatch(HANGUL);
      expect(consent.todoEmail).not.toMatch(HANGUL);
      expect(NATIONWIDE_UI[lang as SupportedLangCode].mergedMark).not.toMatch(HANGUL);
      for (const label of Object.values(REGION_LABELS[lang as SupportedLangCode])) {
        expect(label).not.toMatch(HANGUL);
      }
    }
  });
});
