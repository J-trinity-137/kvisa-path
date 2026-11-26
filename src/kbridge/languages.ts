import { SUPPORTED_LANGS, type LanguageMeta, type SupportedLangCode } from './types';

export const LANGUAGES: readonly LanguageMeta[] = [
  { code: 'ko', locale: 'ko-KR', nativeName: '한국어', koreanName: '한국어', dir: 'ltr' },
  { code: 'en', locale: 'en-US', nativeName: 'English', koreanName: '영어', dir: 'ltr' },
  { code: 'zh-Hans', locale: 'zh-Hans-CN', nativeName: '简体中文', koreanName: '중국어 간체', dir: 'ltr' },
  { code: 'zh-Hant', locale: 'zh-Hant-TW', nativeName: '繁體中文', koreanName: '중국어 번체', dir: 'ltr' },
  { code: 'vi', locale: 'vi-VN', nativeName: 'Tiếng Việt', koreanName: '베트남어', dir: 'ltr' },
  { code: 'ru', locale: 'ru-RU', nativeName: 'Русский', koreanName: '러시아어', dir: 'ltr' },
  { code: 'mn', locale: 'mn-MN', nativeName: 'Монгол хэл', koreanName: '몽골어', dir: 'ltr' },
  { code: 'ar', locale: 'ar', nativeName: 'العربية', koreanName: '아랍어', dir: 'rtl' },
];

export function languageMeta(code: SupportedLangCode): LanguageMeta {
  return LANGUAGES.find((lang) => lang.code === code) ?? LANGUAGES[0];
}

export function normalizeLang(raw: string | null | undefined): SupportedLangCode {
  if (!raw) return 'ko';
  const value = raw.trim().toLowerCase();
  const exact = LANGUAGES.find((lang) => lang.code.toLowerCase() === value || lang.locale.toLowerCase() === value);
  if (exact) return exact.code;
  if (value.startsWith('zh')) {
    return value.includes('tw') || value.includes('hk') || value.includes('hant') ? 'zh-Hant' : 'zh-Hans';
  }
  const primary = value.split('-')[0];
  const byPrimary = LANGUAGES.find((lang) => lang.code.toLowerCase() === primary);
  return byPrimary?.code ?? 'en';
}

export function isSupportedLang(code: string): code is SupportedLangCode {
  return (SUPPORTED_LANGS as readonly string[]).includes(code);
}
