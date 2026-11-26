export const SUPPORTED_LANGS = [
  'ko',
  'en',
  'zh-Hans',
  'zh-Hant',
  'vi',
  'ru',
  'mn',
  'ar',
] as const;

export type SupportedLangCode = (typeof SUPPORTED_LANGS)[number];

export interface LanguageMeta {
  code: SupportedLangCode;
  locale: string;
  nativeName: string;
  koreanName: string;
  dir: 'ltr' | 'rtl';
}

export interface AnonymousEventInput {
  app: string;
  opportunityId: string;
  kind: string;
  lang: string;
  choiceCode?: string;
}

export interface AnonymousEvent {
  id: string;
  createdAt: string;
  app: string;
  opportunityId: string;
  kind: string;
  lang: string;
  choiceCode?: string;
}
