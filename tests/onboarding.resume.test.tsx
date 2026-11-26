// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
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
});
