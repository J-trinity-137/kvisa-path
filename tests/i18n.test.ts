import { describe, expect, it } from 'vitest';
import { ADMISSION_TRACKS, VISA_SKILL_TREE } from '../src/data/admissionsData';
import { DOC_CHECKLIST_ITEMS } from '../src/data/interactiveModules';
import { getCoreCopy, TRANSLATED_LANGS } from '../src/i18n/coreCopy';
import { applyDocumentLanguage } from '../src/kbridge/documentLang';
import { CONSENT_COPY } from '../src/i18n/consentCopy';
import { LANGUAGES, SUPPORTED_LANGS } from '../src/kbridge';

describe('languages actually shipped', () => {
  it('offers only the eight languages that have interface copy', () => {
    expect(SUPPORTED_LANGS).toEqual(['ko', 'en', 'zh-Hans', 'zh-Hant', 'vi', 'ru', 'mn', 'ar']);
    expect(LANGUAGES.map((lang) => lang.code)).toEqual([...SUPPORTED_LANGS]);
    expect(SUPPORTED_LANGS).not.toContain('ja');
    expect(SUPPORTED_LANGS).not.toContain('fr');
  });

  it('sets Arabic to right-to-left', () => {
    const html = { lang: '', dir: '' };
    applyDocumentLanguage(
      { code: 'ar', locale: 'ar', nativeName: 'العربية', koreanName: '아랍어', dir: 'rtl' },
      { documentElement: html } as unknown as Document,
    );
    expect(html.lang).toBe('ar');
    expect(html.dir).toBe('rtl');
  });

  it('has the same consent keys in all eight languages', () => {
    const keys = Object.keys(CONSENT_COPY.ko);
    for (const lang of SUPPORTED_LANGS) {
      expect(Object.keys(CONSENT_COPY[lang])).toEqual(keys);
      for (const key of keys) {
        expect(CONSENT_COPY[lang][key as keyof typeof CONSENT_COPY.ko].length).toBeGreaterThan(0);
      }
    }
  });

  it('translates admission tracks, the visa tree, and the document list', () => {
    for (const lang of TRANSLATED_LANGS) {
      const copy = getCoreCopy(lang);
      expect(copy).not.toBeNull();
      for (const track of ADMISSION_TRACKS) {
        const translated = copy!.tracks[track.id];
        expect(translated?.title, `${lang} ${track.id}`).toBeTruthy();
        expect(translated.title).not.toBe(track.title);
        expect(translated.requirements).toHaveLength(track.requirements.length);
        expect(translated.requiredDocs).toHaveLength(track.requiredDocs.length);
      }
      for (const background of Object.keys(VISA_SKILL_TREE) as Array<keyof typeof VISA_SKILL_TREE>) {
        expect(copy!.visa[background].nodes).toHaveLength(VISA_SKILL_TREE[background].nodes.length);
        expect(copy!.visa[background].title).not.toBe(VISA_SKILL_TREE[background].title);
      }
      for (const doc of DOC_CHECKLIST_ITEMS) {
        expect(copy!.docs[doc.id]?.name).toBeTruthy();
        expect(copy!.docs[doc.id].name).not.toBe(doc.name);
      }
      expect(copy!.guides.ged.length).toBeGreaterThan(40);
    }
  });
});
