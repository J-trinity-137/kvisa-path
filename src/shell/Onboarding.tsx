import { useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';
import { LANGUAGES, type SupportedLangCode } from '../kbridge';
import { Glyph, glyphFor, monogram } from '../components/icons';
import { STUDENT_TYPE_COPY } from '../i18n/studentTypeCopy';
import { navCopy } from '../i18n/navCopy';
import { CONSENT_COPY } from '../i18n/consentCopy';
import { readConsent, writeConsent } from '../privacy/consent';
import {
  resumeStep,
  visibleSteps,
  type OnboardingStep,
  type StudentProfile,
} from '../profile/profile';
import type { InterestField } from '../data/admissionsData';
import { REGION_IDS } from '../data/freshness';
import { STUDENT_TYPES } from '../data/studentType';
import { regionLabel } from '../i18n/regionLabels';

const COUNTRIES = ['CN', 'VN', 'MN', 'RU', 'PH', 'TH', 'KH', 'JP', 'US', 'UZ', 'KZ', 'NP', 'BD', 'MM', 'LA', 'ID', 'MY', 'IN', 'PK', 'LK', 'KG', 'TJ', 'UA', 'FR', 'DE', 'GB', 'CA', 'AU', 'NZ', 'KR', 'TW', 'HK', 'MO', 'TR', 'IR', 'ET', 'NG', 'GH', 'KE', 'ZA', 'BR', 'MX', 'PE', 'CO'];
const HOME_LANGS = ['ko', 'en', 'zh', 'vi', 'ru', 'mn', 'ar', 'th', 'km', 'ja', 'uz', 'ne', 'tl', 'id', 'hi', 'ur', 'kk', 'fr', 'es'];

function labelOf(code: string, kind: 'region' | 'language', lang: SupportedLangCode): string {
  try {
    const locale = lang === 'zh-Hans' ? 'zh-CN' : lang === 'zh-Hant' ? 'zh-TW' : lang;
    return new Intl.DisplayNames([locale], { type: kind }).of(code) ?? code;
  } catch {
    return code;
  }
}

export function Onboarding({
  lang,
  setLang,
  profile,
  onChange,
  onDone,
}: {
  lang: SupportedLangCode;
  setLang: (lang: SupportedLangCode) => void;
  profile: StudentProfile;
  onChange: (next: StudentProfile) => void;
  onDone: (next: StudentProfile) => void;
}) {
  const copy = navCopy(lang);
  const steps = visibleSteps(profile);
  const [stepId, setStepId] = useState<OnboardingStep>(() => resumeStep(profile));
  const [countryQuery, setCountryQuery] = useState('');
  const [consent, setConsent] = useState(() => readConsent());
  const resolved = steps.includes(stepId) ? stepId : resumeStep({ ...profile, onboardingStep: steps.includes(stepId) ? stepId : null });
  const index = Math.max(0, steps.indexOf(resolved));
  const step = steps[index] ?? 'grade';
  const total = steps.length;
  const current = index + 1;
  const types = STUDENT_TYPE_COPY[lang];

  const countries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase();
    return COUNTRIES.map((code) => ({ code, name: labelOf(code, 'region', lang) }))
      .filter((item) => !q || item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q))
      .slice(0, 8);
  }, [countryQuery, lang]);

  const patch = (partial: Partial<StudentProfile>) => onChange({ ...profile, ...partial });

  const remember = (next: StudentProfile, id: OnboardingStep) => {
    setStepId(id);
    if (next.onboarded) return;
    onChange({ ...next, onboardingStep: id });
  };

  const skip = () => {
    const skipped = profile.skipped.includes(step) ? profile.skipped : [...profile.skipped, step];
    const next = { ...profile, skipped, consentDecided: step === 'consent' ? true : profile.consentDecided };
    if (current >= total) onDone({ ...next, entered: true, onboarded: true, onboardingStep: null });
    else {
      const id = steps[index + 1] ?? step;
      setStepId(id);
      onChange({ ...next, onboardingStep: next.onboarded ? next.onboardingStep : id });
    }
  };

  const finish = (next: StudentProfile) => {
    onDone({ ...next, entered: true, onboarded: true, onboardingStep: null });
  };

  const goNext = () => {
    if (current >= total) finish(profile);
    else remember(profile, steps[index + 1] ?? step);
  };

  return (
    <div className="setup">
      <div className="setup-body">
      <div className="step-head">
        <p className="step-count">
          <bdi dir="ltr">
            {current}
            <span className="step-total"> / {total}</span>
          </bdi>
        </p>
        <div
          className="setup-bar"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={current}
          aria-label={`${current} / ${total}`}
          aria-valuetext={`${current} / ${total}`}
        >
          <span style={{ width: `${(current / total) * 100}%` }} />
        </div>
      </div>
      <h1>{copy.ask[step]}</h1>
      <StepBody
        step={step}
        lang={lang}
        copy={copy}
        types={types}
        profile={profile}
        setLang={setLang}
        countries={countries}
        countryQuery={countryQuery}
        setCountryQuery={setCountryQuery}
        consent={consent}
        onConsent={(next) => {
          const saved = writeConsent(next);
          setConsent(saved);
          patch({ consentResearch: saved.stats, consentDecided: true });
        }}
        patch={patch}
      />
      </div>
      <div className="setup-actions">
        <button
          type="button"
          className="btn ghost"
          onClick={() => remember(profile, steps[Math.max(0, index - 1)] ?? step)}
          disabled={index === 0}
        >
          {copy.back}
        </button>
        <div className="setup-links">
          <button type="button" className="btn text" onClick={skip}>
            {copy.skip}
          </button>
          <button type="button" className="btn text" onClick={() => onDone({ ...profile, entered: true, onboardingStep: profile.onboarded ? null : step })}>
            {copy.later}
          </button>
        </div>
        <button type="button" className="btn primary" onClick={goNext}>
          {current >= total ? copy.finish : copy.next}
        </button>
      </div>
    </div>
  );
}

function onChoiceKeyDown(event: KeyboardEvent<HTMLDivElement>) {
  const key = event.key;
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return;
  const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button.choice')];
  const index = buttons.findIndex((button) => button === document.activeElement);
  if (index < 0 || buttons.length === 0) return;
  const columns = getComputedStyle(event.currentTarget).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
  const rtl = document.documentElement.dir === 'rtl';
  let next = index;
  if (key === 'Home') next = 0;
  else if (key === 'End') next = buttons.length - 1;
  else if (key === 'ArrowDown') next = Math.min(buttons.length - 1, index + columns);
  else if (key === 'ArrowUp') next = Math.max(0, index - columns);
  else if (key === 'ArrowRight') next = rtl ? index - 1 : index + 1;
  else if (key === 'ArrowLeft') next = rtl ? index + 1 : index - 1;
  next = Math.max(0, Math.min(buttons.length - 1, next));
  event.preventDefault();
  buttons[next]?.focus();
}

function ChoiceButton({
  pressed,
  onClick,
  mark,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  mark: ReactNode;
  children: ReactNode;
}) {
  return (
    <button type="button" className="choice" aria-pressed={pressed} onClick={onClick}>
      <span className="choice-icon">{mark}</span>
      <span className="choice-label">{children}</span>
      <span className="choice-check" aria-hidden="true">
        <Glyph name="check" />
      </span>
    </button>
  );
}

function StepBody({
  step,
  lang,
  copy,
  types,
  profile,
  setLang,
  countries,
  countryQuery,
  setCountryQuery,
  consent,
  onConsent,
  patch,
}: {
  step: OnboardingStep;
  lang: SupportedLangCode;
  copy: ReturnType<typeof navCopy>;
  types: (typeof STUDENT_TYPE_COPY)[SupportedLangCode];
  profile: StudentProfile;
  setLang: (lang: SupportedLangCode) => void;
  countries: { code: string; name: string }[];
  countryQuery: string;
  setCountryQuery: (value: string) => void;
  consent: ReturnType<typeof readConsent>;
  onConsent: (next: { stats: boolean; questions: boolean; crossBorder: boolean }) => void;
  patch: (partial: Partial<StudentProfile>) => void;
}) {
  const consentCopy = CONSENT_COPY[lang];
  if (step === 'lang') {
    return (
      <div className="choice-grid" onKeyDown={onChoiceKeyDown}>
        {LANGUAGES.map((item) => (
          <ChoiceButton key={item.code} pressed={item.code === lang} onClick={() => setLang(item.code)} mark={<span className="mark-text">{monogram(item.nativeName)}</span>}>
            {item.nativeName}
          </ChoiceButton>
        ))}
      </div>
    );
  }
  if (step === 'grade') return <Choices step="grade" options={copy.grades} value={profile.grade} onPick={(grade) => patch({ grade })} />;
  if (step === 'region') {
    const options = Object.fromEntries(REGION_IDS.map((id) => [id, regionLabel(lang, id)])) as Record<(typeof REGION_IDS)[number], string>;
    return <Choices step="region" options={options} value={profile.region} onPick={(region) => patch({ region })} />;
  }
  if (step === 'type') {
    return (
      <div className="choice-grid" onKeyDown={onChoiceKeyDown}>
        {STUDENT_TYPES.map((type) => (
          <ChoiceButton key={type} pressed={profile.studentType === type} onClick={() => patch({ studentType: type })} mark={<Glyph name={glyphFor('type', type)} />}>
            {types.types[type]}
          </ChoiceButton>
        ))}
      </div>
    );
  }
  if (step === 'parents') return <Choices step="parents" options={copy.parents} value={profile.parentForeign} onPick={(parentForeign) => patch({ parentForeign })} />;
  if (step === 'countries') {
    const showFather = profile.parentForeign !== 'mother';
    const showMother = profile.parentForeign !== 'father';
    return (
      <div className="stack">
        <label className="field">
          {copy.search}
          <input value={countryQuery} onChange={(event) => setCountryQuery(event.target.value)} />
        </label>
        <div className="choice-grid" onKeyDown={onChoiceKeyDown}>
          {countries.map((item) => (
            <ChoiceButton
              key={item.code}
              pressed={profile.fatherCountry === item.code || profile.motherCountry === item.code}
              mark={<Glyph name="pin" />}
              onClick={() => {
                if (showFather && !profile.fatherCountry) patch({ fatherCountry: item.code });
                else if (showMother) patch({ motherCountry: item.code });
                else patch({ fatherCountry: item.code });
              }}
            >
              {item.name}
            </ChoiceButton>
          ))}
        </div>
        <p>
          {showFather ? profile.fatherCountry ?? '—' : null} {showMother ? ` / ${profile.motherCountry ?? '—'}` : null}
        </p>
      </div>
    );
  }
  if (step === 'languages') {
    return (
      <div className="choice-grid" onKeyDown={onChoiceKeyDown}>
        {HOME_LANGS.map((code) => {
          const on = profile.homeLanguages.includes(code);
          const label = labelOf(code, 'language', lang);
          return (
            <ChoiceButton
              key={code}
              pressed={on}
              mark={<span className="mark-text">{monogram(label)}</span>}
              onClick={() =>
                patch({
                  homeLanguages: on ? profile.homeLanguages.filter((item) => item !== code) : [...profile.homeLanguages, code],
                })
              }
            >
              {label}
            </ChoiceButton>
          );
        })}
      </div>
    );
  }
  if (step === 'born') return <Choices step="born" options={{ yes: copy.yes, no: copy.no }} value={profile.bornAbroad === null ? null : profile.bornAbroad ? 'yes' : 'no'} onPick={(value) => patch({ bornAbroad: value === 'yes', yearArrived: value === 'yes' ? profile.yearArrived : null })} />;
  if (step === 'arrived') {
    return (
      <label className="field">
        {copy.ask.arrived}
        <input
          type="number"
          inputMode="numeric"
          min={1980}
          max={2100}
          value={profile.yearArrived ?? ''}
          onChange={(event) => patch({ yearArrived: event.target.value ? Number(event.target.value) : null })}
        />
      </label>
    );
  }
  if (step === 'years') {
    return (
      <label className="field">
        {copy.ask.years}
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={20}
          value={profile.yearsSchoolingAbroad ?? ''}
          onChange={(event) => patch({ yearsSchoolingAbroad: event.target.value === '' ? null : Number(event.target.value) })}
        />
      </label>
    );
  }
  if (step === 'nationality') {
    return (
      <Choices
        step="nationality"
        options={{ yes: copy.yes, no: copy.no }}
        value={profile.koreanNationality === null ? null : profile.koreanNationality ? 'yes' : 'no'}
        onPick={(value) => patch({ koreanNationality: value === 'yes' })}
      />
    );
  }
  if (step === 'school') return <Choices step="school" options={copy.schools} value={profile.schoolType} onPick={(schoolType) => patch({ schoolType })} />;
  if (step === 'korean') return <Choices step="korean" options={copy.korean} value={profile.koreanLevel} onPick={(koreanLevel) => patch({ koreanLevel })} />;
  if (step === 'band') return <Choices step="band" options={copy.bands} value={profile.gradeBand} onPick={(gradeBand) => patch({ gradeBand })} />;
  if (step === 'interests') {
    return (
      <div className="choice-grid" onKeyDown={onChoiceKeyDown}>
        {(Object.keys(copy.fields) as InterestField[]).map((field) => {
          const on = profile.interests.includes(field);
          return (
            <ChoiceButton
              key={field}
              pressed={on}
              mark={<Glyph name={glyphFor('interests', field)} />}
              onClick={() =>
                patch({ interests: on ? profile.interests.filter((item) => item !== field) : [...profile.interests, field] })
              }
            >
              {copy.fields[field]}
            </ChoiceButton>
          );
        })}
      </div>
    );
  }
  if (step === 'goal') return <Choices step="goal" options={copy.goals} value={profile.goal} onPick={(goal) => patch({ goal })} />;
  if (step === 'support') {
    return (
      <div className="choice-grid" onKeyDown={onChoiceKeyDown}>
        {(Object.keys(copy.needs) as Array<keyof typeof copy.needs>).map((need) => {
          const on = profile.supportNeeds.includes(need);
          return (
            <ChoiceButton
              key={need}
              pressed={on}
              mark={<Glyph name={glyphFor('support', need)} />}
              onClick={() =>
                patch({
                  supportNeeds: on ? profile.supportNeeds.filter((item) => item !== need) : [...profile.supportNeeds, need],
                })
              }
            >
              {copy.needs[need]}
            </ChoiceButton>
          );
        })}
      </div>
    );
  }
  return (
    <div className="stack">
      <p>{copy.consentLead}</p>
      <label className="check">
        <input type="checkbox" checked={consent.stats} onChange={(event) => onConsent({ ...consent, stats: event.target.checked })} />
        {consentCopy.statsLabel}
      </label>
      <p className="muted">{consentCopy.statsBody}</p>
      <label className="check">
        <input
          type="checkbox"
          checked={consent.crossBorder}
          onChange={(event) =>
            onConsent({ ...consent, crossBorder: event.target.checked, questions: event.target.checked ? consent.questions : false })
          }
        />
        {consentCopy.crossBorder}
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={consent.questions}
          disabled={!consent.crossBorder}
          onChange={(event) => onConsent({ ...consent, questions: event.target.checked })}
        />
        {consentCopy.questionLabel}
      </label>
    </div>
  );
}

function Choices<T extends string>({
  options,
  value,
  onPick,
  step,
}: {
  options: Record<T, string>;
  value: T | null;
  onPick: (value: T) => void;
  step: string;
}) {
  return (
    <div className="choice-grid" role="group" onKeyDown={onChoiceKeyDown}>
      {(Object.keys(options) as T[]).map((key) => (
        <ChoiceButton key={key} pressed={value === key} onClick={() => onPick(key)} mark={<Glyph name={glyphFor(step, key)} />}>
          {options[key]}
        </ChoiceButton>
      ))}
    </div>
  );
}
