import { EXTERNAL_SCHOLARSHIPS } from '../admissionsData';
import { GYEONGGI_SUPPORT_CENTERS, SEOUL_SUPPORT_CENTERS } from '../centersData';
import { FAQ_ITEMS } from '../faq';
import { monthFromDate } from '../freshness';
import { GYEONGGI_KLS, GYEONGGI_PROCEDURES } from '../gyeonggiData';
import { HELP_LINKS } from '../helpLinks';
import { DDAY_SCHEDULES } from '../interactiveModules';
import { factsFor } from '../multiculturalContent';
import { NATIONAL_LINES, NATIONWIDE_ENTRIES } from '../nationwideRegions';
import { OFFICIAL_FORMS, PROCEDURES } from '../procedures';
import { supportProgramPosts } from './supportPosts';
import type { BoardPost } from './types';

function month(value: string | undefined): string {
  return monthFromDate(value) || (value ?? '').slice(0, 7);
}

function clip(text: string, max = 140): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

/** Extra posts added by later data PRs. Keep this array for support-program notices. */
export const EXTRA_BOARD_POSTS: readonly BoardPost[] = [];

function fromCenters(): BoardPost[] {
  const seoul = SEOUL_SUPPORT_CENTERS.filter((center) => center.phone).map((center) => ({
    id: `center-${center.id}`,
    category: 'centers' as const,
    title: center.name,
    summary: clip(`${center.district} · ${center.phone}`),
    body: [center.freeCareerProgram, center.hours, center.phoneUnverifiedReason].filter(Boolean).join('\n'),
    region: 'seoul' as const,
    sourceUrl: center.phoneSourceUrl || 'https://liveinkorea.kr/centerIntro/centerNearListViewHtml.do',
    verifiedAt: month(center.phoneVerifiedOn || center.verifiedAt || center.asOfDate),
    tags: [center.district, '가족센터', ...(center.languageSupport ?? [])],
    phone: center.phone,
  }));
  const gyeonggi = GYEONGGI_SUPPORT_CENTERS.filter((center) => center.phone).map((center) => ({
    id: `center-${center.id}`,
    category: 'centers' as const,
    title: center.name,
    summary: clip(`${center.district} · ${center.phone}`),
    body: center.freeCareerProgram,
    region: 'gyeonggi' as const,
    sourceUrl: center.phoneSourceUrl || '',
    verifiedAt: month(center.verifiedAt || center.phoneVerifiedOn),
    tags: [center.district, '가족센터'],
    phone: center.phone,
  }));
  const help = HELP_LINKS.map((link) => ({
    id: `help-${link.id}`,
    category: 'centers' as const,
    title: link.name,
    summary: clip(link.detail),
    body: link.detail,
    region: 'all' as const,
    sourceUrl: link.url,
    verifiedAt: month(link.verifiedOn),
    tags: ['긴급', '연락처'],
  }));
  const nationwide = NATIONWIDE_ENTRIES.map((entry) => ({
    id: `region-${entry.region}-${entry.id}`,
    category: entry.category.includes('korean') ? ('korean' as const) : ('centers' as const),
    title: entry.name,
    summary: clip(`${entry.city}${entry.phone ? ` · ${entry.phone}` : ''}`),
    body: [entry.quote, entry.note].filter(Boolean).join('\n'),
    region: entry.region,
    sourceUrl: entry.sourceUrl || entry.url,
    verifiedAt: entry.verifiedAt,
    tags: [entry.city, entry.category],
    phone: entry.phone || undefined,
  }));
  const national = NATIONAL_LINES.map((line) => ({
    id: `national-${line.id}`,
    category: 'centers' as const,
    title: line.name,
    summary: clip(line.phone),
    body: line.phone,
    region: 'all' as const,
    sourceUrl: line.sourceUrl,
    verifiedAt: line.verifiedAt,
    tags: ['전국'],
    phone: line.phone,
  }));
  return [...help, ...seoul, ...gyeonggi, ...nationwide, ...national];
}

function fromKorean(): BoardPost[] {
  const steps = PROCEDURES.filter((step) => ['ksl-prep', 'rainbow', 'ksl-online'].includes(step.id)).map((step) => ({
    id: `korean-${step.id}`,
    category: 'korean' as const,
    title: step.title,
    summary: clip(step.body),
    body: step.body,
    region: step.id === 'ksl-prep' ? ('seoul' as const) : ('all' as const),
    sourceUrl: step.sourceUrl,
    verifiedAt: month(step.verifiedOn),
    tags: ['한국어', step.id],
  }));
  const kls = GYEONGGI_KLS.map((row, index) => ({
    id: `korean-kls-${index}-${row.city}`,
    category: 'korean' as const,
    title: row.name,
    summary: clip(`${row.city} · ${row.phone}`),
    body: row.quote,
    region: 'gyeonggi' as const,
    sourceUrl: row.source_url,
    verifiedAt: row.verified_at,
    tags: [row.city, 'KLS'],
    phone: row.phone,
  }));
  return [...steps, ...kls];
}

function fromSupport(): BoardPost[] {
  const facts = [...factsFor('scholarships'), ...factsFor('school-supports')].map((fact) => ({
    id: `support-${fact.id}`,
    category: 'support' as const,
    title: fact.name,
    summary: clip(fact.text),
    body: fact.text,
    region: 'all' as const,
    sourceUrl: fact.sourceUrl,
    verifiedAt: fact.verifiedAt,
    tags: [fact.category, fact.status],
  }));
  const external = EXTERNAL_SCHOLARSHIPS.map((item) => ({
    id: `support-${item.id}`,
    category: 'support' as const,
    title: item.name,
    summary: clip(item.benefit),
    body: `${item.benefit}\n${item.excludeRule}`,
    region: 'all' as const,
    sourceUrl: item.sourceUrl,
    verifiedAt: month(item.verifiedOn),
    tags: ['장학', item.verification],
  }));
  return [...facts, ...external];
}

function fromSchedule(): BoardPost[] {
  return DDAY_SCHEDULES.map((item) => ({
    id: `schedule-${item.id}`,
    category: 'schedule' as const,
    title: item.title,
    summary: clip(`${item.target} · ${item.dateStr}${item.endDateStr ? ` ~ ${item.endDateStr}` : ''}`),
    body: `${item.target}\n${item.dateStr}${item.endDateStr ? ` ~ ${item.endDateStr}` : ''}\n${item.sourceLabel}`,
    region: /서울/.test(item.title) ? 'seoul' : 'all',
    sourceUrl: item.sourceUrl,
    verifiedAt: month(item.verifiedOn),
    tags: ['일정', item.target],
    scheduleId: item.id,
  }));
}

function fromNotice(): BoardPost[] {
  const steps = PROCEDURES.filter((step) => ['credential', 'elementary', 'elementary-article19'].includes(step.id)).map((step) => ({
    id: `notice-${step.id}`,
    category: 'notice' as const,
    title: step.title,
    summary: clip(step.body),
    body: step.body,
    region: 'all' as const,
    sourceUrl: step.sourceUrl,
    verifiedAt: month(step.verifiedOn),
    tags: ['안내', step.id],
  }));
  const forms = OFFICIAL_FORMS.map((form) => ({
    id: `notice-${form.id}`,
    category: 'notice' as const,
    title: form.title,
    summary: clip(form.note),
    body: form.note,
    region: 'seoul' as const,
    sourceUrl: form.url,
    verifiedAt: month(form.verifiedOn),
    tags: ['서식'],
  }));
  const gg = GYEONGGI_PROCEDURES.map((row, index) => ({
    id: `notice-gg-${index}`,
    category: 'notice' as const,
    title: row.name,
    summary: clip(row.quote),
    body: row.quote,
    region: 'gyeonggi' as const,
    sourceUrl: row.source_url,
    verifiedAt: row.verified_at,
    tags: ['경기', '학력'],
    phone: row.phone === 'not_found' ? undefined : row.phone,
  }));
  return [...steps, ...forms, ...gg];
}

function fromFaq(): BoardPost[] {
  return FAQ_ITEMS.map((item) => ({
    id: `faq-${item.id}`,
    category: 'faq' as const,
    title: item.question.ko || item.question.en,
    summary: clip(item.answer.ko || item.answer.en),
    body: item.answer.ko || item.answer.en,
    region: 'all' as const,
    sourceUrl: item.sourceUrl,
    verifiedAt: month(item.verifiedOn),
    tags: [item.topic, 'faq'],
  }));
}

export function boardPosts(): BoardPost[] {
  return [...supportProgramPosts(), ...fromSupport(), ...fromKorean(), ...fromCenters(), ...fromSchedule(), ...fromFaq(), ...fromNotice(), ...EXTRA_BOARD_POSTS].filter(
    (post) => post.sourceUrl.startsWith('http') && /^\d{4}-\d{2}/.test(post.verifiedAt),
  );
}
