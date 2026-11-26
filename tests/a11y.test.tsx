// @vitest-environment jsdom
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { StudentTypePicker } from '../src/components/StudentTypePicker';
import { FreshnessLine } from '../src/components/FreshnessLine';

describe('accessibility', () => {
  it('has no axe violations on the onboarding picker, including Arabic RTL', async () => {
    const { container } = render(
      <main lang="ar" dir="rtl">
        <StudentTypePicker lang="ar" value={null} onChange={() => undefined} />
        <FreshnessLine lang="ar" verifiedAt="2026-11" sourceUrl="https://www.moe.go.kr/" />
      </main>,
    );
    expect(container.querySelector('main')?.getAttribute('dir')).toBe('rtl');
    const results = await axe.run(container);
    expect(results.violations.map((item) => item.id)).toEqual([]);
  });
});
