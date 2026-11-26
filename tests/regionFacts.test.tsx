// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../src/App';
import { RegionFacts } from '../src/components/RegionFacts';

describe('region facts on the page', () => {
  it('shows Incheon district names, the renamed school, and name-only pre-school sites', () => {
    render(<RegionFacts lang="ko" region="incheon" />);
    expect(screen.getByRole('heading', { name: '인천' })).toBeTruthy();
    expect(document.body.textContent).toContain('제물포구, 영종구, 서해구');
    expect(screen.getByText('세계로국제중고등학교')).toBeTruthy();
    expect(document.body.textContent).toContain('다문화학생만 다니는 학교가 아닙니다');
    const text = document.body.textContent ?? '';
    expect(text).toContain('032-627-2250');
    expect(text).toContain('경인교육대학교 산학협력단');
    expect(text).toContain('인하공업전문대학');
    expect(text).toContain('함박종합사회복지관');
    expect(text).toContain('다문화사랑회');
    expect(text).toContain('1577-1366');
    expect(text).toContain('1345');
    expect(text).toContain('02-722-2585');
  });

  it('shows the merged Jeonnam office name and the Cheonan center number', () => {
    const { unmount } = render(<RegionFacts lang="en" region="jeonnam" />);
    expect(document.body.textContent).toContain('전남광주통합특별시');
    expect(document.body.textContent).toContain('전남광주통합특별시교육청');
    unmount();
    render(<RegionFacts lang="ko" region="chungnam" />);
    const text = document.body.textContent ?? '';
    expect(text).toContain('1577-8653');
    expect(text).toContain('041-549-6402');
    expect(text).toContain('041-360-3200');
  });

  it('switches the region selector to Gangwon and Sejong contacts', async () => {
    localStorage.setItem('kvisa-path.lang', 'ko');
    localStorage.setItem(
      'kvisa-path.profile',
      JSON.stringify({
        version: 1,
        entered: true,
        onboarded: true,
        region: 'seoul',
        studentType: 'domestic_multicultural',
        grade: 'high',
        updatedAt: '2026-11-26T00:00:00.000Z',
      }),
    );
    window.location.hash = '#/me';
    render(<App />);
    const region = await screen.findByLabelText('지역');
    fireEvent.change(region, { target: { value: 'gangwon' } });
    await waitFor(() => expect(document.body.textContent).toContain('033-1396'));
    const gangwon = document.body.textContent ?? '';
    expect(gangwon).toContain('033-640-3315');
    expect(gangwon).toContain('양주출입국');
    expect(gangwon).toContain('031-828-9306');
    fireEvent.change(region, { target: { value: 'sejong' } });
    expect(document.body.textContent).toContain('대전출입국');
    expect(document.body.textContent).toContain('042-220-2001');
  });
});
