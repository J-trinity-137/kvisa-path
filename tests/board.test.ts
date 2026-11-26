import { describe, expect, it } from 'vitest';
import { boardPosts, displayPeriod, filterBoard, supportProgramPosts } from '../src/data/board';
import rows from '../src/data/board/supportPrograms.json';

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

  it('ships only verified support programs, each with a url and a check month', () => {
    const programs = supportProgramPosts();
    expect(programs).toHaveLength(48);
    expect(programs.some((post) => post.id === 'sp-sc-ggumladder')).toBe(true);
    expect(programs.some((post) => post.id === 'sp-sc-corp-none')).toBe(false);
    expect(programs.some((post) => post.id === 'sp-sc-daesang')).toBe(false);
    expect(displayPeriod('미확인')).toBe('일정 미공개');
    expect(programs.find((post) => post.id === 'sp-sc-ggumladder')?.body).toContain('일정 미공개');
    expect(programs.find((post) => post.id === 'sp-sc-ggumladder')?.phone).toBe('1599-2290');
    expect(programs.find((post) => post.id === 'sp-co-gb-bilingual')?.phone).toBeUndefined();
    const raw = rows as Array<{ id: string; status: string }>;
    expect(raw.filter((row) => row.status === 'verified')).toHaveLength(48);
    expect(raw).toHaveLength(73);
  });

  it('gives every board post a source url and a check month', () => {
    for (const post of posts) {
      expect(post.sourceUrl.startsWith('http'), post.id).toBe(true);
      expect(post.verifiedAt, post.id).toMatch(/^\d{4}-\d{2}/);
    }
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
