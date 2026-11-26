// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { nextUpcoming } from '../src/deadlines/list';
import { navCopy, seeAllLabel } from '../src/i18n/navCopy';
import { EMPTY_PROFILE, type StudentProfile } from '../src/profile/profile';
import { admissionTracks, explainTracks } from '../src/rules/evaluate';
import { Dashboard } from '../src/shell/Dashboard';

const INFO = new Set(['calendar', 'support_center', 'post_graduation_stay', 'admission_overview']);

function profile(partial: Partial<StudentProfile>): StudentProfile {
  return { ...EMPTY_PROFILE, skipped: [], homeLanguages: [], interests: [], supportNeeds: [], ...partial };
}

const seoulHigh = profile({
  entered: true,
  grade: 'high',
  region: 'seoul',
  studentType: 'domestic_multicultural',
  parentForeign: 'mother',
  koreanNationality: true,
  koreanLevel: 'topik_3_4',
  goal: 'study',
  schoolType: 'general',
  age: 17,
});

describe('home track count', () => {
  it('drops calendar, center, stay, and overview rows from the 전형 count', () => {
    const all = explainTracks(seoulHigh).tracks;
    const listed = admissionTracks(all);
    const info = all.filter((track) => track.category && INFO.has(track.category));
    expect(info.length).toBeGreaterThan(0);
    expect(all.length).toBeGreaterThan(listed.length);
    expect(listed.some((track) => track.category && INFO.has(track.category))).toBe(false);
    expect(listed.some((track) => /핵심 일정|대입개편|공통 조건 정리/.test(track.title))).toBe(false);
    expect(listed.slice(0, 3).every((track) => track.title.length > 0)).toBe(true);
    expect(listed[0]?.reasons.length).toBeGreaterThan(0);
  });

  it('shows the admission count and real track names, not the inflated list', () => {
    const listed = admissionTracks(explainTracks(seoulHigh).tracks);
    render(<Dashboard lang="ko" tracks={explainTracks(seoulHigh).tracks} easy={false} onEdit={() => undefined} today="2026-11-26" />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(`내가 쓸 수 있는 전형 ${listed.length}개`);
    expect(screen.getByRole('button', { name: seeAllLabel(navCopy('ko'), listed.length) })).toBeTruthy();
    const titles = screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent ?? '');
    expect(titles).toEqual(listed.slice(0, 3).map((track) => track.title));
    expect(titles.join(' ')).not.toMatch(/핵심 일정|대입개편|공통 조건/);
  });
});

describe('next date', () => {
  it('skips a window that already started', () => {
    const next = nextUpcoming([], '2026-11-26');
    expect(next).not.toBeNull();
    expect(next!.start >= '2026-11-26').toBe(true);
    expect(next!.start).not.toBe('2026-11-25');
  });
});
