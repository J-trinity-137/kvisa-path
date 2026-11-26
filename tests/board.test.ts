import { describe, expect, it } from 'vitest';
import { boardPosts, filterBoard } from '../src/data/board';

describe('board', () => {
  const posts = boardPosts();

  it('lists centers, dates, korean classes, and support posts from existing sources', () => {
    expect(posts.some((post) => post.category === 'centers' && post.region === 'seoul' && post.phone)).toBe(true);
    expect(posts.some((post) => post.category === 'centers' && post.region === 'gyeonggi')).toBe(true);
    expect(posts.some((post) => post.region === 'busan')).toBe(true);
    expect(posts.some((post) => post.region === 'jeju')).toBe(true);
    expect(new Set(posts.map((post) => post.region)).size).toBeGreaterThan(10);
    expect(posts.some((post) => post.category === 'schedule')).toBe(true);
    expect(posts.some((post) => post.category === 'korean' && post.tags.includes('KLS'))).toBe(true);
    expect(posts.some((post) => post.category === 'support')).toBe(true);
    expect(posts.some((post) => post.category === 'notice')).toBe(true);
  });

  it('filters by region, category, and search without visa fields', () => {
    const seoul = filterBoard(posts, { region: 'seoul', category: 'centers' });
    expect(seoul.every((post) => post.region === 'seoul' || post.region === 'all')).toBe(true);
    expect(seoul.some((post) => post.region === 'gyeonggi')).toBe(false);
    const found = filterBoard(posts, { q: '1577-1366' });
    expect(found.length).toBeGreaterThan(0);
    const blob = JSON.stringify(posts);
    expect(blob).not.toContain('"visa"');
    expect(blob).not.toContain('주민등록');
  });
});
