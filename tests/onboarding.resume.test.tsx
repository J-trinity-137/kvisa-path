// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { navCopy } from '../src/i18n/navCopy';
import { EMPTY_PROFILE, resumeStep, type StudentProfile } from '../src/profile/profile';
import { Onboarding } from '../src/shell/Onboarding';

function profile(partial: Partial<StudentProfile>): StudentProfile {
  return { ...EMPTY_PROFILE, skipped: [], homeLanguages: [], interests: [], supportNeeds: [], ...partial };
}

describe('onboarding resume', () => {
  it('returns to the saved step and starts a finished profile at the first question', () => {
    const saved = profile({ entered: true, onboardingStep: 'korean', grade: 'high', region: 'seoul' });
    expect(resumeStep(saved)).toBe('korean');
    expect(resumeStep(profile({ onboarded: true, onboardingStep: 'korean', grade: 'high' }))).toBe('lang');
    expect(resumeStep(profile({}))).toBe('lang');
  });

  it('keeps the step when the person leaves and comes back', () => {
    let current = profile({});
    const { getByRole, unmount } = render(
      <Onboarding lang="en" setLang={() => undefined} profile={current} onChange={(next) => { current = next; }} onDone={(next) => { current = next; }} />,
    );
    expect(getByRole('heading').textContent).toBe(navCopy('en').ask.lang);
    fireEvent.click(screen.getByRole('button', { name: navCopy('en').next }));
    expect(current.onboardingStep).toBe('grade');
    unmount();
    render(
      <Onboarding lang="en" setLang={() => undefined} profile={current} onChange={(next) => { current = next; }} onDone={(next) => { current = next; }} />,
    );
    expect(screen.getByRole('heading').textContent).toBe(navCopy('en').ask.grade);
  });

  it('skips a question, resumes after later, and keeps the answer when the language changes', () => {
    let current = profile({});
    let lang: 'ko' | 'ar' = 'ko';
    const view = render(
      <Onboarding lang={lang} setLang={() => undefined} profile={current} onChange={(next) => { current = next; }} onDone={(next) => { current = next; }} />,
    );
    const ui = within(view.container);
    const sync = () => {
      view.rerender(
        <Onboarding lang={lang} setLang={() => undefined} profile={current} onChange={(next) => { current = next; }} onDone={(next) => { current = next; }} />,
      );
    };
    fireEvent.click(ui.getByRole('button', { name: navCopy('ko').next }));
    sync();
    fireEvent.click(ui.getByRole('button', { name: navCopy('ko').grades.high }));
    sync();
    expect(current.grade).toBe('high');
    fireEvent.click(ui.getByRole('button', { name: navCopy('ko').skip }));
    sync();
    expect(current.skipped).toContain('grade');
    expect(current.onboardingStep).toBe('region');
    fireEvent.click(ui.getByRole('button', { name: navCopy('ko').later }));
    expect(current.entered).toBe(true);
    expect(current.onboarded).toBeFalsy();
    expect(current.grade).toBe('high');
    expect(resumeStep(current)).toBe('region');
    lang = 'ar';
    sync();
    expect(ui.getByRole('heading').textContent).toBe(navCopy('ar').ask.region);
    fireEvent.click(ui.getByRole('button', { name: navCopy('ar').back }));
    sync();
    fireEvent.click(ui.getByRole('button', { name: navCopy('ar').grades.middle }));
    expect(current.grade).toBe('middle');
    expect(current.onboardingStep).toBe('grade');
  });
});
