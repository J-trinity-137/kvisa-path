import type { BoardCategory, BoardPost, BoardRegion } from './types';

export interface BoardQuery {
  category?: BoardCategory | 'all';
  region?: BoardRegion | 'all';
  q?: string;
}

export function filterBoard(posts: readonly BoardPost[], query: BoardQuery): BoardPost[] {
  const words = (query.q ?? '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  return posts.filter((post) => {
    if (query.category && query.category !== 'all' && post.category !== query.category) return false;
    if (query.region && query.region !== 'all' && post.region !== 'all' && post.region !== query.region) return false;
    if (!words.length) return true;
    const hay = `${post.title} ${post.summary} ${post.body} ${post.tags.join(' ')} ${post.phone ?? ''}`.toLowerCase();
    return words.every((word) => hay.includes(word));
  });
}

export function postById(posts: readonly BoardPost[], id: string): BoardPost | undefined {
  return posts.find((post) => post.id === id);
}
