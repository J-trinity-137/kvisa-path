import type { RegionId } from '../freshness';

export const BOARD_CATEGORIES = ['support', 'korean', 'centers', 'schedule', 'faq', 'notice'] as const;

export type BoardCategory = (typeof BOARD_CATEGORIES)[number];

export type BoardRegion = RegionId | 'all';

/** A board post. Later data PRs can append posts without changing the page. */
export interface BoardPost {
  id: string;
  category: BoardCategory;
  title: string;
  summary: string;
  body: string;
  region: BoardRegion;
  sourceUrl: string;
  verifiedAt: string;
  tags: string[];
  phone?: string;
  scheduleId?: string;
}
