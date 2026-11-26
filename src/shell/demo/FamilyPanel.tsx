import { useState } from 'react';
import { DEMO_BANNER, accessFor, type DemoDb } from '../../accounts/model';
import { guardianLinks, studentLinks } from '../../accounts/roster';
import { accountsCopy } from '../../i18n/accountsCopy';
import { LANGUAGES, type SupportedLangCode } from '../../kbridge';
import { formatWhen } from './format';

export function FamilyPanel({
  lang,
  db,
  accountId,
  error,
  linkCode,
  onIssue,
  onRedeem,
  onConfirm,
  onUnlink,
  onHomeLang,
}: {
  lang: SupportedLangCode;
  db: DemoDb;
  accountId: string;
  error: string | null;
  linkCode: string | null;
  onIssue: () => void;
  onRedeem: (code: string) => void;
  onConfirm: (linkId: string) => void;
  onUnlink: (linkId: string) => void;
  onHomeLang: (lang: SupportedLangCode) => void;
}) {
  const copy = accountsCopy(lang);
  const account = db.accounts.find((item) => item.id === accountId);
  const [code, setCode] = useState('');
  if (!account) return null;
  const student = account.role === 'student' ? studentLinks(db, accountId) : null;
  const guardian = account.role === 'guardian' ? guardianLinks(db, accountId) : null;
  const faces = student ?? guardian;
  const subjects =
    account.role === 'student'
      ? [{ id: accountId, nickname: account.nickname }]
      : (guardian?.active ?? []).map((item) => ({ id: item.studentId, nickname: item.nickname }));

  return (
    <section className="panel demo-panel">
      <p className="demo-banner">
        <bdi dir="ltr">{DEMO_BANNER}</bdi>
      </p>
      <h1>{copy.familyTitle}</h1>
      <p>{copy.profileNote}</p>
      {error ? (
        <p role="alert" className="soft">
          {error}
        </p>
      ) : null}
      {account.role === 'student' ? (
        <div className="stack">
          <label className="field">
            {copy.homeLang}
            <select value={account.lang} onChange={(event) => onHomeLang(event.target.value as SupportedLangCode)}>
              {LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.nativeName}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="btn primary" onClick={onIssue}>
            {copy.makeCode}
          </button>
          <p className="muted">{copy.codeOnce}</p>
          {linkCode ? (
            <p className="code-line" dir="ltr">
              <bdi>{linkCode}</bdi>
            </p>
          ) : null}
          {student?.pending.map((item) => (
            <div key={item.id} className="stack">
              <p>
                <bdi>{item.nickname}</bdi>
              </p>
              <p>{copy.askLink}</p>
              <button type="button" className="btn primary" onClick={() => onConfirm(item.id)}>
                {copy.confirmLink}
              </button>
            </div>
          ))}
        </div>
      ) : null}
      {account.role === 'guardian' ? (
        <form
          className="stack"
          onSubmit={(event) => {
            event.preventDefault();
            onRedeem(code);
          }}
        >
          <label className="field">
            {copy.code}
            <input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} dir="ltr" spellCheck={false} autoComplete="off" />
          </label>
          <button type="submit" className="btn primary">
            {copy.redeem}
          </button>
        </form>
      ) : null}
      {account.role !== 'student' && account.role !== 'guardian' ? <p>{copy.notStudent}</p> : null}
      <h2>{copy.linked}</h2>
      {faces && faces.active.length === 0 && faces.pending.length === 0 ? <p>{copy.noLinks}</p> : null}
      <ul className="stack">
        {faces?.active.map((item) => (
          <li key={item.id}>
            <bdi>{item.nickname}</bdi>
            <button type="button" className="btn ghost" onClick={() => onUnlink(item.id)}>
              {copy.unlink}
            </button>
          </li>
        ))}
      </ul>
      {faces?.ended ? <p role="status">{copy.unlinked}</p> : null}
      {guardian?.pending.map((item) => (
        <p key={item.id}>
          <bdi>{item.nickname}</bdi> · {copy.pending}
        </p>
      ))}
      <h2>{copy.accessTitle}</h2>
      {subjects.length === 0 ? <p>{copy.accessEmpty}</p> : null}
      {subjects.map((subject) => {
        const access = accessFor(db, accountId, subject.id) ?? [];
        return (
          <div key={subject.id}>
            {account.role === 'guardian' ? (
              <h3>
                <bdi>{subject.nickname}</bdi>
              </h3>
            ) : null}
            {access.length === 0 ? <p>{copy.accessEmpty}</p> : null}
            <ul>
              {access.map((item) => (
                <li key={item.id}>
                  <bdi>{item.actorNickname}</bdi> · <time dateTime={item.at}>{formatWhen(item.at, lang)}</time>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
