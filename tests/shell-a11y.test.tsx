// @vitest-environment jsdom
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { EMPTY_PROFILE } from '../src/profile/profile';
import { BoardView } from '../src/shell/BoardView';
import { Dashboard } from '../src/shell/Dashboard';
import { Onboarding } from '../src/shell/Onboarding';
import { boardPosts } from '../src/data/board';
import { eligibleTracks } from '../src/rules/evaluate';

describe('desktop shell accessibility', () => {
  it('has no axe violations on the track dashboard and board in Arabic RTL', async () => {
    const profile = {
      ...EMPTY_PROFILE,
      entered: true,
      grade: 'high' as const,
      region: 'seoul' as const,
      studentType: 'domestic_multicultural' as const,
      koreanNationality: true,
      parentForeign: 'mother' as const,
      koreanLevel: 'topik_3_4' as const,
      skipped: [],
      homeLanguages: [],
      interests: [],
      supportNeeds: [],
    };
    const { container } = render(
      <main lang="ar" dir="rtl">
        <Dashboard lang="ar" profile={profile} tracks={eligibleTracks(profile)} easy={false} onEdit={() => undefined} />
        <BoardView lang="ar" posts={boardPosts().slice(0, 6)} onOpen={() => undefined} onClose={() => undefined} />
      </main>,
    );
    expect(container.querySelector('main')?.getAttribute('dir')).toBe('rtl');
    expect(container.querySelector('h1')?.textContent).toContain('المسارات');
    const results = await axe.run(container);
    expect(results.violations.map((item) => `${item.id}:${item.nodes.length}`)).toEqual([]);
  });

  it('renders one onboarding question with a progress bar', async () => {
    const { container, getByRole } = render(
      <Onboarding lang="ko" setLang={() => undefined} profile={EMPTY_PROFILE} onChange={() => undefined} onDone={() => undefined} />,
    );
    expect(getByRole('progressbar').getAttribute('aria-valuemax')).toBeTruthy();
    expect(container.querySelector('h1')?.textContent).toBeTruthy();
    const results = await axe.run(container);
    expect(results.violations.map((item) => item.id)).toEqual([]);
  });
});
