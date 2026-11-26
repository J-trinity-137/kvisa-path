import { useState } from 'react';
import type { SupportedLangCode } from '../kbridge';
import { languageMeta } from '../kbridge';
import { CONSENT_COPY } from '../i18n/consentCopy';
import { readConsent, writeConsent, type ConsentState } from '../privacy/consent';
import { POLICY_KO_SECTIONS } from '../privacy/policyKo';
import { redact } from '../privacy/redact';
import { canSend } from '../telemetry/client';

type Panel = 'none' | 'settings' | 'policy' | 'question';
type Asker = 'student14' | 'guardian' | 'teacher' | 'under14' | '';

export function PrivacyTools({ lang, easy }: { lang: SupportedLangCode; easy: boolean }) {
  const copy = CONSENT_COPY[lang];
  const dir = languageMeta(lang).dir;
  const [panel, setPanel] = useState<Panel>('none');
  const [consent, setConsent] = useState<ConsentState>(() => readConsent());
  const [asker, setAsker] = useState<Asker>('');
  const [draft, setDraft] = useState('');
  const preview = redact(draft);

  const save = () => {
    setConsent(writeConsent(consent));
    setPanel('none');
  };

  return (
    <section className="kb-section kv-no-print" aria-label={copy.settingsTitle} dir={dir}>
      <div className="kb-row">
        <button type="button" className="kb-chip" onClick={() => setPanel(panel === 'settings' ? 'none' : 'settings')}>
          {copy.openSettings}
        </button>
        <button type="button" className="kb-chip" onClick={() => setPanel(panel === 'policy' ? 'none' : 'policy')}>
          {copy.openPolicy}
        </button>
        <button type="button" className="kb-chip" onClick={() => setPanel(panel === 'question' ? 'none' : 'question')}>
          {copy.openQuestion}
        </button>
      </div>

      {panel === 'settings' ? (
        <div className="kb-card kb-stack" style={{ marginTop: 12 }}>
          <h2 className="kb-section-title">{copy.settingsTitle}</h2>
          {easy ? <p>{copy.easyStats}</p> : null}
          <label>
            <input
              type="checkbox"
              checked={consent.stats}
              onChange={(event) => setConsent({ ...consent, stats: event.target.checked })}
            />{' '}
            {copy.statsLabel}
          </label>
          <p>{copy.statsBody}</p>
          <label>
            <input
              type="checkbox"
              checked={consent.crossBorder}
              onChange={(event) =>
                setConsent({
                  ...consent,
                  crossBorder: event.target.checked,
                  questions: event.target.checked ? consent.questions : false,
                })
              }
            />{' '}
            {copy.crossBorder}
          </label>
          <label>
            <input
              type="checkbox"
              checked={consent.questions}
              disabled={!consent.crossBorder}
              onChange={(event) => setConsent({ ...consent, questions: event.target.checked })}
            />{' '}
            {copy.questionLabel}
          </label>
          <p>{copy.questionBody}</p>
          <button type="button" className="kb-chip" onClick={() => setPanel('policy')}>
            {copy.policyLink}
          </button>
          <button type="button" className="kb-chip" onClick={save}>
            {copy.save}
          </button>
        </div>
      ) : null}

      {panel === 'policy' ? (
        <article className="kb-card kb-stack" style={{ marginTop: 12 }} dir={dir}>
          {lang !== 'ko' ? <p className="kb-tag">{copy.nativeReview}</p> : null}
          <p>{copy.statsBody}</p>
          <p>{copy.questionBody}</p>
          {POLICY_KO_SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="kb-section-title">{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <p>
            {copy.todoName} · {copy.todoEmail}
          </p>
        </article>
      ) : null}

      {panel === 'question' ? (
        <div className="kb-card kb-stack" style={{ marginTop: 12 }} dir={dir}>
          <h2 className="kb-section-title">{copy.askerTitle}</h2>
          <div className="kb-row" role="group" aria-label={copy.askerTitle}>
            {([
              ['student14', copy.student14],
              ['guardian', copy.guardian],
              ['teacher', copy.teacher],
              ['under14', copy.under14],
            ] as const).map(([value, label]) => (
              <button key={value} type="button" className="kb-chip" aria-pressed={asker === value} onClick={() => setAsker(value)}>
                {label}
              </button>
            ))}
          </div>
          {asker === 'under14' ? (
            <p>{copy.under14Body}</p>
          ) : asker ? (
            <>
              <label htmlFor="kvisa-question">{copy.previewTitle}</label>
              <textarea id="kvisa-question" value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} />
              <h3 className="kb-section-title">{copy.previewTitle}</h3>
              <p>{copy.previewLead}</p>
              <p>{preview.text}</p>
              {preview.blocked ? <p>{copy.blocked}</p> : null}
              {canSend() && consent.questions && !preview.blocked && preview.text.trim() ? (
                <button type="button" className="kb-chip">
                  {copy.send}
                </button>
              ) : (
                <p>{copy.noSend}</p>
              )}
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
