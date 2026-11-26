import { useState, type FormEvent } from 'react';
import { DEMO_BANNER, type AgeBand, type ConsentState, type GuardianLabel, type Role } from '../../accounts/model';
import { accountsCopy } from '../../i18n/accountsCopy';
import type { SupportedLangCode } from '../../kbridge';
import { SpeakButton } from '../../components/SpeakButton';

const LABELS: readonly GuardianLabel[] = ['mom', 'dad', 'guardian', 'grandmother', 'grandfather'];

export function SignupPanel({
  lang,
  error,
  onCreate,
}: {
  lang: SupportedLangCode;
  error: string | null;
  onCreate: (input: {
    nickname: string;
    role: Role;
    ageBand: AgeBand | null;
    consent: ConsentState;
    guardianLabel: GuardianLabel | null;
  }) => void;
}) {
  const copy = accountsCopy(lang);
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [ageBand, setAgeBand] = useState<AgeBand>('14p');
  const [label, setLabel] = useState<GuardianLabel>('guardian');
  const [consentStep, setConsentStep] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (role === 'student' && ageBand === 'u14') {
      setConsentStep(true);
      return;
    }
    onCreate({
      nickname,
      role,
      ageBand: role === 'student' ? ageBand : null,
      consent: 'not_required',
      guardianLabel: null,
    });
  };

  return (
    <section className="panel demo-panel">
      <p className="demo-banner">
        <bdi dir="ltr">{DEMO_BANNER}</bdi>
      </p>
      <h1>{copy.signupTitle}</h1>
      <p className="lead">{copy.signupLead}</p>
      <p className="muted">{copy.note}</p>
      <p className="muted">{copy.noSecrets}</p>
      {error ? (
        <p role="alert" className="soft">
          {error}
        </p>
      ) : null}
      {consentStep ? (
        <div className="stack">
          <h2>{copy.consentTitle}</h2>
          <p>{copy.consentBody}</p>
          <SpeakButton lang={lang} text={copy.consentBody} />
          <fieldset>
            <legend>{copy.guardianLabel}</legend>
            <div className="choice-grid">
              {LABELS.map((item) => (
                <label key={item} className="choice">
                  <input type="radio" name="demo-guardian-label" checked={label === item} onChange={() => setLabel(item)} /> {copy.labels[item]}
                </label>
              ))}
            </div>
          </fieldset>
          <ul>
            <li>{copy.scopeAccount}</li>
            <li>{copy.scopeOptional}</li>
          </ul>
          <p className="muted">{copy.consentWait}</p>
          <div className="setup-actions">
            <button type="button" className="btn ghost" onClick={() => setConsentStep(false)}>
              {copy.back}
            </button>
            <button
              type="button"
              className="btn primary"
              onClick={() => onCreate({ nickname, role: 'student', ageBand: 'u14', consent: 'simulated', guardianLabel: label })}
            >
              {copy.consentSimulate}
            </button>
          </div>
        </div>
      ) : (
        <form className="stack" onSubmit={submit}>
          <label className="field">
            {copy.nickname}
            <input value={nickname} onChange={(event) => setNickname(event.target.value)} maxLength={16} autoComplete="off" required />
          </label>
          <p className="muted">{copy.nicknameHint}</p>
          <fieldset>
            <legend>{copy.role}</legend>
            <div className="choice-grid">
              {(
                [
                  ['student', copy.roleStudent],
                  ['guardian', copy.roleGuardian],
                  ['teacher', copy.roleTeacher],
                ] as const
              ).map(([value, text]) => (
                <label key={value} className="choice">
                  <input type="radio" name="demo-role" checked={role === value} onChange={() => setRole(value)} /> {text}
                </label>
              ))}
            </div>
          </fieldset>
          {role === 'student' ? (
            <fieldset>
              <legend>{copy.age}</legend>
              <div className="choice-grid">
                <label className="choice">
                  <input type="radio" name="demo-age" checked={ageBand === '14p'} onChange={() => setAgeBand('14p')} /> {copy.age14}
                </label>
                <label className="choice">
                  <input type="radio" name="demo-age" checked={ageBand === 'u14'} onChange={() => setAgeBand('u14')} /> {copy.ageUnder}
                </label>
              </div>
            </fieldset>
          ) : null}
          <button type="submit" className="btn primary">
            {role === 'student' && ageBand === 'u14' ? copy.continue : copy.create}
          </button>
        </form>
      )}
    </section>
  );
}
