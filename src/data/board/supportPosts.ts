import type { RegionId } from '../freshness';
import rows from './supportPrograms.json';
import type { BoardCategory, BoardPost, BoardRegion } from './types';

interface SupportProgram {
  id: string;
  category: string;
  title: string;
  summary: string;
  eligibility?: string;
  how_to_apply?: string;
  period?: string;
  region?: string;
  operator?: string;
  phone?: string | null;
  url?: string;
  quote?: string;
  verified_at?: string;
  status?: string;
  notes?: string;
  source_url?: string;
}

const PROGRAM_CATEGORIES = new Set<BoardCategory>([
  'scholarship',
  'mentoring',
  'korean_language',
  'career',
  'counseling_mental',
  'legal_admin',
  'medical',
  'bilingual',
  'education_cost',
  'family_parent',
  'competition',
  'online_learning',
]);

function httpUrl(value: string | undefined): string {
  const url = (value ?? '').trim();
  return url.startsWith('https://') || url.startsWith('http://') ? url : '';
}

/** A period that was not found is shown as unpublished, not as the raw token. */
export function displayPeriod(period: string | undefined): string {
  const text = (period ?? '').trim();
  if (!text || text === '미확인') return '일정 미공개';
  return text.replaceAll('미확인', '일정 미공개');
}

function regionOf(raw: string | undefined): BoardRegion {
  const text = raw ?? '';
  const named: Array<[string, RegionId]> = [
    ['서울', 'seoul'],
    ['부산', 'busan'],
    ['대구', 'daegu'],
    ['인천', 'incheon'],
    ['광주', 'gwangju'],
    ['대전', 'daejeon'],
    ['울산', 'ulsan'],
    ['세종', 'sejong'],
    ['경기', 'gyeonggi'],
    ['강원', 'gangwon'],
    ['충북', 'chungbuk'],
    ['충남', 'chungnam'],
    ['전북', 'jeonbuk'],
    ['전남', 'jeonnam'],
    ['경북', 'gyeongbuk'],
    ['경남', 'gyeongnam'],
    ['제주', 'jeju'],
  ];
  if (text.startsWith('전국')) return 'all';
  for (const [label, id] of named) {
    if (text.startsWith(label)) return id;
  }
  return 'all';
}

function bodyOf(row: SupportProgram): string {
  return [row.eligibility, row.how_to_apply, displayPeriod(row.period), row.operator, row.quote, row.notes]
    .map((part) => (part ?? '').trim())
    .filter(Boolean)
    .join('\n');
}

/** Verified support programs only. Partial and not_found rows stay in the JSON and are not shipped. */
export function supportProgramPosts(): BoardPost[] {
  return (rows as SupportProgram[])
    .filter((row) => row.status === 'verified')
    .flatMap((row) => {
      const sourceUrl = httpUrl(row.source_url) || httpUrl(row.url);
      const verifiedAt = (row.verified_at ?? '').slice(0, 7);
      if (!sourceUrl || !/^\d{4}-\d{2}$/.test(verifiedAt)) return [];
      if (!PROGRAM_CATEGORIES.has(row.category as BoardCategory)) return [];
      const phone = (row.phone ?? '').trim();
      return [
        {
          id: row.id,
          category: row.category as BoardCategory,
          title: row.title,
          summary: row.summary,
          body: bodyOf(row),
          region: regionOf(row.region),
          sourceUrl,
          verifiedAt,
          tags: [row.category, row.region ?? ''].filter(Boolean),
          ...(phone ? { phone } : {}),
        },
      ];
    });
}
