import type { SupportedLangCode } from '../kbridge';

export interface FaqItem {
  id: string;
  topic: string;
  question: Record<SupportedLangCode, string>;
  answer: Record<SupportedLangCode, string>;
  sourceUrl: string;
  verifiedOn: string;
}

/** Empty until a reviewed FAQ export is imported. Do not invent answers. */
export const FAQ_ITEMS: readonly FaqItem[] = [];
