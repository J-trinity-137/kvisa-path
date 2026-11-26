import type { StudentType } from '../data/studentType';
import { QUESTION_TOPIC_CODES } from '../data/interactiveModules';

export const STATS_REGIONS = [
  'seoul',
  'busan',
  'daegu',
  'incheon',
  'gwangju',
  'daejeon',
  'ulsan',
  'sejong',
  'gyeonggi',
  'gangwon',
  'chungbuk',
  'chungnam',
  'jeonbuk',
  'jeonnam',
  'gyeongbuk',
  'gyeongnam',
  'jeju',
  'unknown',
] as const;

export const STATS_GRADES = ['ms', 'hs', 'other'] as const;
export const STATS_INTERESTS = ['it', 'culinary', 'design', 'business', 'health'] as const;
export const CHECKLIST_BUCKETS = ['0', '1-25', '26-50', '51-75', '76-99', '100'] as const;

export type StatsRegion = (typeof STATS_REGIONS)[number];
export type StatsGrade = (typeof STATS_GRADES)[number];

export interface StatsPayload {
  v: 1;
  grade: StatsGrade;
  region: StatsRegion;
  studentType: StudentType;
  lang: 'ko' | 'en' | 'zh-Hans' | 'zh-Hant' | 'vi' | 'ru' | 'mn' | 'ar';
  interests: string[];
  checklistBucket: (typeof CHECKLIST_BUCKETS)[number];
  quiz: Record<string, 'right' | 'wrong' | 'skip'>;
}

const LANGS = new Set(['ko', 'en', 'zh-Hans', 'zh-Hant', 'vi', 'ru', 'mn', 'ar']);
const TYPES = new Set(['foreign_family', 'mid_entry', 'domestic_multicultural', 'unsure']);

export function checklistBucket(done: number, total: number): StatsPayload['checklistBucket'] {
  if (total <= 0 || done <= 0) return '0';
  const pct = Math.round((done / total) * 100);
  if (pct >= 100) return '100';
  if (pct >= 76) return '76-99';
  if (pct >= 51) return '51-75';
  if (pct >= 26) return '26-50';
  return '1-25';
}

export function isoWeek(date = new Date()): string {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** Closed fields only. A visa value on the input object is ignored. */
export function buildStatsSnapshot(input: {
  grade?: string;
  region?: string;
  studentType?: string;
  lang?: string;
  interests?: readonly string[];
  checklistDone?: number;
  checklistTotal?: number;
  quiz?: Record<string, string>;
  visa?: string;
}): StatsPayload {
  const grade = (STATS_GRADES as readonly string[]).includes(input.grade ?? '') ? (input.grade as StatsGrade) : 'other';
  const region = (STATS_REGIONS as readonly string[]).includes(input.region ?? '') ? (input.region as StatsRegion) : 'unknown';
  const studentType = TYPES.has(input.studentType ?? '') ? (input.studentType as StudentType) : 'unsure';
  const lang = LANGS.has(input.lang ?? '') ? (input.lang as StatsPayload['lang']) : 'ko';
  const interests = (input.interests ?? []).filter((item) => (STATS_INTERESTS as readonly string[]).includes(item)).slice(0, 3);
  const quiz: StatsPayload['quiz'] = {};
  for (const [key, value] of Object.entries(input.quiz ?? {})) {
    if (!(QUESTION_TOPIC_CODES as readonly string[]).includes(key) && !/^quiz-\d+$/.test(key)) continue;
    if (value === 'right' || value === 'wrong' || value === 'skip') quiz[key] = value;
  }
  return {
    v: 1,
    grade,
    region,
    studentType,
    lang,
    interests,
    checklistBucket: checklistBucket(input.checklistDone ?? 0, input.checklistTotal ?? 0),
    quiz,
  };
}
