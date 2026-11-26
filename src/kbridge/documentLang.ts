import type { LanguageMeta } from './types';

export function applyDocumentLanguage(meta: LanguageMeta, doc: Document = document): void {
  doc.documentElement.lang = meta.locale;
  doc.documentElement.dir = meta.dir;
}
