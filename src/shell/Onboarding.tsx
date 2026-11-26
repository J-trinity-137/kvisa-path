import { useMemo, useState } from 'react';
import { LANGUAGES, type SupportedLangCode } from '../kbridge';
import { STUDENT_TYPE_COPY } from '../i18n/studentTypeCopy';
import { navCopy } from '../i18n/navCopy';
import { CONSENT_COPY } from '../i18n/consentCopy';
import { readConsent, writeConsent } from '../privacy/consent';
import {
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
  const [index, setIndex] = useState(0);
  const [countryQuery, setCountryQuery] = useState('');
  const [consent, setConsent] = useState(() => readConsent());
  const step = steps[Math.min(index, steps.length - 1)] ?? 'grade';
  const total = steps.length;
  const current = Math.min(index, total - 1) + 1;
  const types = STUDENT_TYPE_COPY[lang];

  const countries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase();
    return COUNTRIES.map((code) => ({ code, name: labelOf(code, 'region', lang) }))
      .filter((item) => !q || item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q))
      .slice(0, 8);
  }, [countryQuery, lang]);

  const patch = (partial: Partial<StudentProfile>) => onChange({ ...profile, ...partial });

  const skip = () => {
    const skipped = profile.skipped.includes(step) ? profile.skipped : [...profile.skipped, step];
    const next = { ...profile, skipped, consentDecided: step === 'consent' ? true : profile.consentDecided };
    onChange(next);
    if (current >= total) onDone({ ...next, entered: true });
    else setIndex((value) => value + 1);
  };

  const finish = (next: StudentProfile) => {
    onDone({ ...next, entered: true, onboarded: true });
  };

  const goNext = () => {
    if (current >= total) finish(profile);
    else setIndex((value) => value + 1);
  };

  return (
    <div className="setup">
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
      <p className="kicker">
        {current} / {total}
      </p>
      <h1>{copy.ask[step]}</h1>
      <p className="why">
        <span>{copy.why}: </span>
        {copy.because[step]}
      </p>
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
      <div className="setup-actions">
        <button type="button" className="btn ghost" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}>
          {copy.back}
        </button>
        <button type="button" className="btn ghost" onClick={skip}>
          {copy.skip}
        </button>
        <button type="button" className="btn ghost" onClick={() => onDone({ ...profile, entered: true })}>
          {copy.later}
        </button>
        <button type="button" className="btn primary" onClick={goNext}>
          {current >= total ? copy.finish : copy.next}
        </button>
      </div>
    </div>
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
      <div className="choice-grid">
        {LANGUAGES.map((item) => (
          <button key={item.code} type="button" className="choice" aria-pressed={item.code === lang} onClick={() => setLang(item.code)}>
            {item.nativeName}
          </button>
        ))}
      </div>
    );
  }
  if (step === 'grade') return <Choices options={copy.grades} value={profile.grade} onPick={(grade) => patch({ grade })} />;
  if (step === 'region') {
    const options = Object.fromEntries(REGION_IDS.map((id) => [id, regionLabel(lang, id)])) as Record<(typeof REGION_IDS)[number], string>;
    return <Choices options={options} value={profile.region} onPick={(region) => patch({ region })} />;
  }
  if (step === 'type') {
    return (
      <div className="choice-grid">
        {STUDENT_TYPES.map((type) => (
          <button key={type} type="button" className="choice" aria-pressed={profile.studentType === type} onClick={() => patch({ studentType: type })}>
            <strong>{types.types[type]}</strong>
          </button>
        ))}
      </div>
    );
  }
  if (step === 'parents') return <Choices options={copy.parents} value={profile.parentForeign} onPick={(parentForeign) => patch({ parentForeign })} />;
  if (step === 'countries') {
    const showFather = profile.parentForeign !== 'mother';
    const showMother = profile.parentForeign !== 'father';
    return (
      <div className="stack">
        <label className="field">
          {copy.search}
          <input value={countryQuery} onChange={(event) => setCountryQuery(event.target.value)} />
        </label>
        <div className="choice-grid">
          {countries.map((item) => (
            <button
              key={item.code}
              type="button"
              className="choice"
              onClick={() => {
                if (showFather && !profile.fatherCountry) patch({ fatherCountry: item.code });
                else if (showMother) patch({ motherCountry: item.code });
                else patch({ fatherCountry: item.code });
              }}
            >
              {item.name}
            </button>
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
      <div className="choice-grid">
        {HOME_LANGS.map((code) => {
          const on = profile.homeLanguages.includes(code);
          return (
            <button
              key={code}
              type="button"
              className="choice"
              aria-pressed={on}
              onClick={() =>
                patch({
                  homeLanguages: on ? profile.homeLanguages.filter((item) => item !== code) : [...profile.homeLanguages, code],
                })
              }
            >
              {labelOf(code, 'language', lang)}
            </button>
          );
        })}
      </div>
    );
  }
  if (step === 'born') return <Choices options={{ yes: copy.yes, no: copy.no }} value={profile.bornAbroad === null ? null : profile.bornAbroad ? 'yes' : 'no'} onPick={(value) => patch({ bornAbroad: value === 'yes', yearArrived: value === 'yes' ? profile.yearArrived : null })} />;
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
        options={{ yes: copy.yes, no: copy.no }}
        value={profile.koreanNationality === null ? null : profile.koreanNationality ? 'yes' : 'no'}
        onPick={(value) => patch({ koreanNationality: value === 'yes' })}
      />
    );
  }
  if (step === 'school') return <Choices options={copy.schools} value={profile.schoolType} onPick={(schoolType) => patch({ schoolType })} />;
  if (step === 'korean') return <Choices options={copy.korean} value={profile.koreanLevel} onPick={(koreanLevel) => patch({ koreanLevel })} />;
  if (step === 'band') return <Choices options={copy.bands} value={profile.gradeBand} onPick={(gradeBand) => patch({ gradeBand })} />;
  if (step === 'interests') {
    return (
      <div className="choice-grid">
        {(Object.keys(copy.fields) as InterestField[]).map((field) => {
          const on = profile.interests.includes(field);
          return (
            <button
              key={field}
              type="button"
              className="choice"
              aria-pressed={on}
              onClick={() =>
                patch({ interests: on ? profile.interests.filter((item) => item !== field) : [...profile.interests, field] })
              }
            >
              {copy.fields[field]}
            </button>
          );
        })}
      </div>
    );
  }
  if (step === 'goal') return <Choices options={copy.goals} value={profile.goal} onPick={(goal) => patch({ goal })} />;
  if (step === 'support') {
    return (
      <div className="choice-grid">
        {(Object.keys(copy.needs) as Array<keyof typeof copy.needs>).map((need) => {
          const on = profile.supportNeeds.includes(need);
          return (
            <button
              key={need}
              type="button"
              className="choice"
              aria-pressed={on}
              onClick={() =>
                patch({
                  supportNeeds: on ? profile.supportNeeds.filter((item) => item !== need) : [...profile.supportNeeds, need],
                })
              }
            >
              {copy.needs[need]}
            </button>
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
}: {
  options: Record<T, string>;
  value: T | null;
  onPick: (value: T) => void;
}) {
  return (
    <div className="choice-grid" role="group">
      {(Object.keys(options) as T[]).map((key) => (
        <button key={key} type="button" className="choice" aria-pressed={value === key} onClick={() => onPick(key)}>
          {options[key]}
        </button>
      ))}
    </div>
  );
}
