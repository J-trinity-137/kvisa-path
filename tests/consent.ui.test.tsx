// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { PrivacyTools } from '../src/components/PrivacyTools';

describe('privacy screens', () => {
  it('shows local guidance and no send button for a student under 14', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    render(<PrivacyTools lang="ko" easy />);
    fireEvent.click(screen.getByRole('button', { name: '질문' }));
    fireEvent.click(screen.getByRole('button', { name: '만 14세 미만 학생' }));
    expect(screen.getByText(/1577-1366/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: '이 문장 보내기' })).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('keeps the Arabic consent card right-to-left and free of axe violations', async () => {
    const { container } = render(<PrivacyTools lang="ar" easy={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'المساعدة في تحسين التطبيق' }));
    expect(container.querySelector('[dir="rtl"]')).toBeTruthy();
    const results = await axe.run(container);
    expect(results.violations.map((item) => item.id)).toEqual([]);
  });
});