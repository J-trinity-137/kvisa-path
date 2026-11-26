import { useEffect, useMemo, useState } from 'react';
import { pageLink } from '../../share/parentShare';
import { joinPayload } from '../../accounts/codes';
import { DEMO_BANNER, approveEnrollment, createClass, profileFor, recordView, regenerateClassCode, removeEnrollment, type DemoDb } from '../../accounts/model';
import { loadSample } from '../../accounts/seed';
import { filterRoster, rosterRows, type RosterFilter } from '../../accounts/roster';
import { accountsCopy } from '../../i18n/accountsCopy';
import { navCopy } from '../../i18n/navCopy';
import { reasonText } from '../../i18n/reasonCopy';
import type { SupportedLangCode } from '../../kbridge';
import type { GradeLevel } from '../../profile/profile';
import { formatDay, formatWhen } from './format';
import { ParentNotice } from './ParentNotice';
import { QrCode } from './QrCode';

export function TeacherDesk({
  lang,
  db,
  teacherId,
  onDb,
}: {
  lang: SupportedLangCode;
  db: DemoDb;
  teacherId: string;
  onDb: (next: DemoDb) => void;
}) {
  const copy = accountsCopy(lang);
  const nav = navCopy(lang);
  const classes = db.classes.filter((room) => room.ownerId === teacherId);
  const [classId, setClassId] = useState(classes[0]?.id ?? '');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<RosterFilter>({ status: 'all', grade: 'all', progress: 'all', query: '' });
  const now = useMemo(() => new Date(), []);
  const selected = classes.find((room) => room.id === classId) ?? classes[0] ?? null;
  const rows = selected ? filterRoster(rosterRows(db, selected.id, now), filter) : [];
  const open = rows.find((row) => row.studentId === openId) ?? null;
  const fake = selected?.sample === true || rows.some((row) => row.sample);

  useEffect(() => {
    if (!openId) return;
    const close = document.getElementById('student-detail-close');
    close?.focus();
  }, [openId]);

  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openId]);

  const showError = (code: keyof typeof copy.errors) => setError(copy.errors[code]);

  return (
    <section className="desk">
      <p className="demo-banner">
        <bdi dir="ltr">{DEMO_BANNER}</bdi>
      </p>
      <header className="page-head">
        <h1>{copy.roster}</h1>
        <p>{copy.note}</p>
        <p>{copy.noSecrets}</p>
      </header>
      {error ? (
        <p role="alert" className="soft">
          {error}
        </p>
      ) : null}
      {fake ? <p className="demo-banner">{copy.fake}</p> : null}
      <div className="desk-tools">
        <form
          className="stack"
          onSubmit={(event) => {
            event.preventDefault();
            const result = createClass(db, teacherId, name, new Date().toISOString());
            if (!result.ok) {
              showError(result.error);
              return;
            }
            setName('');
            setClassId(result.value.id);
            setError(null);
            onDb(result.db);
          }}
        >
          <label className="field">
            {copy.className}
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} />
          </label>
          <p className="muted">{copy.classHint}</p>
          <button type="submit" className="btn primary">
            {copy.createClass}
          </button>
        </form>
        <button
          type="button"
          className="btn ghost"
          onClick={() => {
            const result = loadSample(db, teacherId, new Date().toISOString());
            if (!result.ok) {
              setError(result.error === 'already' ? copy.sampleDone : copy.errors[result.error]);
              return;
            }
            setClassId(result.value.id);
            setError(null);
            onDb(result.db);
          }}
        >
          {copy.sample}
        </button>
      </div>
      {classes.length > 1 ? (
        <label className="field">
          {copy.classTitle}
          <select value={selected?.id ?? ''} onChange={(event) => setClassId(event.target.value)}>
            {classes.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {selected ? (
        <div className="code-card">
          <div>
            <p className="kicker">{copy.classCode}</p>
            <p className="code-line" dir="ltr">
              <bdi>{selected.code}</bdi>
            </p>
            <p className="muted">
              {copy.expires} <time dateTime={selected.expiresAt}>{formatWhen(selected.expiresAt, lang)}</time>
            </p>
            <div className="setup-actions kv-no-print">
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  const clip = navigator.clipboard;
                  if (!clip) return;
                  void clip.writeText(selected.code).then(
                    () => setCopied(true),
                    () => setCopied(false),
                  );
                }}
              >
                {copy.copyCode}
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  const result = regenerateClassCode(db, teacherId, selected.id, new Date().toISOString());
                  if (!result.ok) {
                    showError(result.error);
                    return;
                  }
                  setError(null);
                  onDb(result.db);
                }}
              >
                {copy.newCode}
              </button>
              {copied ? <p role="status">{copy.copied}</p> : null}
            </div>
          </div>
          <QrCode text={joinPayload(pageLink(), selected.code)} label={`${copy.qrLabel} ${selected.code}`} />
        </div>
      ) : (
        <p>{copy.emptyRoster}</p>
      )}
      {selected ? (
        <div className="filters" role="search" aria-label={copy.filters}>
          <label>
            {copy.status}
            <select value={filter.status} onChange={(event) => setFilter({ ...filter, status: event.target.value as RosterFilter['status'] })}>
              <option value="all">{copy.all}</option>
              <option value="pending">{copy.pending}</option>
              <option value="active">{copy.active}</option>
            </select>
          </label>
          <label>
            {nav.ask.grade}
            <select value={filter.grade} onChange={(event) => setFilter({ ...filter, grade: event.target.value as RosterFilter['grade'] })}>
              <option value="all">{copy.all}</option>
              {(Object.keys(nav.grades) as GradeLevel[]).map((grade) => (
                <option key={grade} value={grade}>
                  {nav.grades[grade]}
                </option>
              ))}
            </select>
          </label>
          <label>
            {copy.onboarding}
            <select
              value={filter.progress}
              onChange={(event) => setFilter({ ...filter, progress: event.target.value as RosterFilter['progress'] })}
            >
              <option value="all">{copy.all}</option>
              <option value="done">{copy.onboardingDone}</option>
              <option value="open">{copy.onboardingOpen}</option>
            </select>
          </label>
          <label>
            {copy.search}
            <input value={filter.query} onChange={(event) => setFilter({ ...filter, query: event.target.value })} />
          </label>
        </div>
      ) : null}
      {selected ? (
        <div className="roster-wrap" tabIndex={0} aria-label={copy.roster}>
          <table className="roster">
            <caption className="sr">{copy.roster}</caption>
            <thead>
              <tr>
                <th scope="col">{copy.colStudent}</th>
                <th scope="col">{copy.colStatus}</th>
                <th scope="col">{copy.colTracks}</th>
                <th scope="col">{copy.colProgress}</th>
                <th scope="col">{copy.colDeadline}</th>
                <th scope="col">{copy.open}</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6}>{copy.emptyRoster}</td>
                </tr>
              ) : null}
              {rows.map((row) => (
                <tr key={row.studentId}>
                  <th scope="row">
                    <bdi>{row.nickname}</bdi>
                    {row.sample ? <span className="pill">{copy.sampleBadge}</span> : null}
                    {row.ageBand === 'u14' ? <span className="pill">{copy.ageUnderBadge}</span> : null}
                  </th>
                  <td>{row.status === 'pending' ? copy.pending : copy.active}</td>
                  <td>
                    {row.tracks.length === 0 ? copy.noTracks : `${row.tracks.length} · `}
                    <bdi>{row.tracks[0]?.title ?? ''}</bdi>
                  </td>
                  <td>
                    <div
                      className="meter"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={row.percent}
                      aria-label={`${row.nickname} ${copy.colProgress}`}
                    >
                      <span style={{ width: `${row.percent}%` }} />
                    </div>
                    <bdi dir="ltr">{row.percent}%</bdi>
                  </td>
                  <td>{row.deadline ? <bdi dir="ltr">{formatDay(row.deadline.date, lang)}</bdi> : copy.noDeadline}</td>
                  <td className="row-actions">
                    {row.status === 'pending' ? (
                      <button
                        type="button"
                        className="btn primary"
                        onClick={() => {
                          const result = approveEnrollment(db, teacherId, selected.id, row.studentId, new Date().toISOString());
                          if (!result.ok) {
                            showError(result.error);
                            return;
                          }
                          setError(null);
                          onDb(result.db);
                        }}
                      >
                        {copy.approve}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={() => {
                        const result = recordView(db, teacherId, row.studentId, selected.id, new Date().toISOString());
                        if (result.ok) onDb(result.db);
                        setOpenId(row.studentId);
                      }}
                    >
                      {copy.open}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {open && selected ? (
        <div className="drawer-back">
          <div className="drawer" role="dialog" aria-modal="true" aria-labelledby="student-detail-title">
            <div className="setup-actions kv-no-print">
              <h2 id="student-detail-title">{copy.detail}</h2>
              <button id="student-detail-close" type="button" className="btn ghost" onClick={() => setOpenId(null)}>
                {copy.close}
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  const result = removeEnrollment(db, teacherId, selected.id, open.studentId);
                  if (!result.ok) {
                    showError(result.error);
                    return;
                  }
                  setOpenId(null);
                  onDb(result.db);
                }}
              >
                {copy.remove}
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  document.body.classList.add('kv-printing-notice');
                  const done = () => {
                    document.body.classList.remove('kv-printing-notice');
                    window.removeEventListener('afterprint', done);
                  };
                  window.addEventListener('afterprint', done);
                  window.print();
                }}
              >
                {copy.printNotice}
              </button>
            </div>
            <p>
              <bdi>{open.nickname}</bdi>
            </p>
            <p>
              {copy.colProgress} <bdi dir="ltr">{open.percent}%</bdi>
            </p>
            <h3>{copy.tracks}</h3>
            {open.tracks.length === 0 ? <p>{copy.noTracks}</p> : null}
            <ul>
              {open.tracks.slice(0, 12).map((track) => (
                <li key={track.id}>
                  <bdi>{track.title}</bdi>
                  {track.reasons[0] ? <p className="muted">{reasonText(open.lang, track.reasons[0])}</p> : null}
                </li>
              ))}
            </ul>
            {open.withheld.length > 0 ? (
              <>
                <h3>{nav.whyNotTitle}</h3>
                <ul>
                  {open.withheld.slice(0, 6).map((item) => (
                    <li key={item.code}>
                      {reasonText(open.lang, item.code)} <bdi dir="ltr">({item.count})</bdi>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <ParentNotice
              lang={open.lang}
              nickname={open.nickname}
              sample={open.sample}
              profile={profileFor(db, open.studentId)}
              tracks={open.tracks}
              deadline={open.deadline}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
