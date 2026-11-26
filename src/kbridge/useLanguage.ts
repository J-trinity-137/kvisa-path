import { useEffect, useState } from 'react';
import { applyDocumentLanguage } from './documentLang';
import { languageMeta, normalizeLang } from './languages';
import type { LanguageMeta, SupportedLangCode } from './types';

const DEFAULT_KEY = 'kbridge.lang';

export function useLanguage(storageKey: string = DEFAULT_KEY): {
  lang: SupportedLangCode;
  meta: LanguageMeta;
  setLang: (lang: SupportedLangCode) => void;
} {
  const [lang, setLangState] = useState<SupportedLangCode>(() => {
    if (typeof window === 'undefined') return 'ko';
    const stored = window.localStorage.getItem(storageKey);
    return normalizeLang(stored || window.navigator.language);
  });
  const meta = languageMeta(lang);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    applyDocumentLanguage(meta);
  }, [meta]);

  const setLang = (next: SupportedLangCode) => {
    setLangState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, next);
    }
  };

  return { lang, meta, setLang };
}
