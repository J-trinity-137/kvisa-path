import { readFileSync, writeFileSync } from 'node:fs';

const input = process.argv[2];
const out = process.argv[3];
if (!input) {
  console.error('usage: node scripts/faq-import.mjs faq-export.json [src/data/faq.ts]');
  process.exit(1);
}

const rows = JSON.parse(readFileSync(input, 'utf8'));
const langs = ['ko', 'en', 'zh-Hans', 'zh-Hant', 'vi', 'ru', 'mn', 'ar'];
const items = rows.map((row) => ({
  id: row.id,
  topic: row.topic,
  question: Object.fromEntries(langs.map((lang) => [lang, lang === 'ko' ? row.question_ko : ''])),
  answer: Object.fromEntries(langs.map((lang) => [lang, lang === 'ko' ? row.answer_ko : ''])),
  sourceUrl: row.source_url,
  verifiedOn: row.verified_on,
}));
const source = `import type { SupportedLangCode } from '../kbridge';

export interface FaqItem {
  id: string;
  topic: string;
  question: Record<SupportedLangCode, string>;
  answer: Record<SupportedLangCode, string>;
  sourceUrl: string;
  verifiedOn: string;
}

export const FAQ_ITEMS: readonly FaqItem[] = ${JSON.stringify(items, null, 2)};
`;
if (out) writeFileSync(out, source);
else process.stdout.write(source);
