// @vitest-environment jsdom
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { windowText } from '../src/compare/format';
import { compareColumns } from '../src/compare/model';
import { EMPTY_PROFILE, type StudentProfile } from '../src/profile/profile';
import { eligibleTracks } from '../src/rules/evaluate';
import { CompareView } from '../src/shell/CompareView';
import { Dashboard } from '../src/shell/Dashboard';
import { DeadlinesView } from '../src/shell/DeadlinesView';
import { TrackDetail } from '../src/shell/TrackDetail';

function profile(partial: Partial<StudentProfile>): StudentProfile {
  return { ...EMPTY_PROFILE, entered: true, skipped: [], homeLanguages: [], interests: [], supportNeeds: [], ...partial };
}

describe('compare, detail, and deadlines accessibility', () => {
  it('has no axe violations in Arabic, including a failed condition row', async () => {
    const student = profile({
      grade: 'high',
      region: 'seoul',
      studentType: 'domestic_multicultural',
      parentForeign: 'mother',
      koreanNationality: true,
      koreanLevel: 'topik_3_4',
    });
    const ids = ['korea-2028-multicultural', 'ft-snu-global-1'];
    const { container } = render(
      <main lang="ar" dir="rtl">
        <CompareView lang="ar" profile={student} ids={ids} onRemove={() => undefined} />
        <TrackDetail lang="ar" profile={student} id="ft-snu-global-1" comparing={false} saved={false} onCompare={() => 'rejected'} onSave={() => undefined} />
        <DeadlinesView lang="ar" chosenIds={['korea-2028-multicultural']} today="2026-11-26" />
      </main>,
    );
    expect(container.querySelector('main')?.getAttribute('dir')).toBe('rtl');
    expect(container.querySelector('[data-fail-row="nationality"]')).toBeTruthy();
    expect(container.textContent).toContain('هذا المسار لطالب من جنسية أجنبية');
    expect(container.textContent).not.toContain('ما وضع الإقامة');
    const results = await axe.run(container);
    expect(results.violations.map((item) => `${item.id}:${item.help}`)).toEqual([]);
  });

  it('shows add-to-compare on the dashboard and the 2027 guide label in Korean', async () => {
    const student = profile({
      grade: 'high',
      studentType: 'domestic_multicultural',
      parentForeign: 'father',
      koreanNationality: true,
      koreanLevel: 'topik_3_4',
    });
    const { container } = render(
      <Dashboard lang="ko" tracks={eligibleTracks(student).slice(0, 4)} easy={false} onEdit={() => undefined} />,
    );
    expect(container.querySelector('h1')?.textContent).toContain('내가 쓸 수 있는 전형');
    const detail = render(
      <TrackDetail
        lang="ko"
        profile={student}
        id="korea-2028-multicultural"
        comparing={false}
        saved={false}
        onCompare={() => 'added'}
        onSave={() => undefined}
      />,
    );
    expect(detail.getAllByRole('button', { name: /비교에 담기|비교 중/ }).length).toBeGreaterThan(0);
    const columns = compareColumns(['ft-khu-foreign-2027'], student);
    expect(windowText('ko', columns[0]!)).toBe('2027 요강 기준');
    const results = await axe.run(container);
    expect(results.violations.map((item) => item.id)).toEqual([]);
  });
});
