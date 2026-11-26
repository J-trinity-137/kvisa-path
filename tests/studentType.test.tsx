// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdmissionsTab } from '../src/components/AdmissionsTab';
import { MULTICULTURAL_SECTIONS } from '../src/data/multiculturalPath';

describe('domestic multicultural path', () => {
  it('hides visa controls and shows only verified university tracks', () => {
    render(
      <AdmissionsTab
        lang="ko"
        studentType="domestic_multicultural"
        easy={false}
        onEventLogged={() => undefined}
        onChoice={() => undefined}
      />,
    );
    expect(screen.queryByText('체류자격 직접 고르기 (이 선택은 저장하지 않아요)')).toBeNull();
    expect(screen.getByText('2027학년도 수시, 다문화 전형이 확인된 대학')).toBeTruthy();
    expect(screen.getByText('경희대')).toBeTruthy();
    expect(screen.getByText('한양대')).toBeTruthy();
    expect(screen.getByText('중앙대')).toBeTruthy();
    expect(screen.getByText('서울시립대')).toBeTruthy();
    expect(screen.getByText('부모 통역은 가족센터')).toBeTruthy();
    for (const section of MULTICULTURAL_SECTIONS) {
      expect(document.querySelector(`[data-section-id="${section.id}"]`)).toBeNull();
    }
  });
});
