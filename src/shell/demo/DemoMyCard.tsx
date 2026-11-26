import { DEMO_BANNER, accessFor, activeAccount, type DemoDb } from '../../accounts/model';
import { guardianLinks } from '../../accounts/roster';
import { accountsCopy } from '../../i18n/accountsCopy';
import { LANGUAGES, type SupportedLangCode } from '../../kbridge';
import { formatWhen } from './format';

export function DemoMyCard({
  lang,
  db,
  onHomeLang,
}: {
  lang: SupportedLangCode;
  db: DemoDb;
  onHomeLang: (lang: SupportedLangCode) => void;
}) {
  const active = activeAccount(db);
  if (!active) return null;
  const copy = accountsCopy(lang);
  const role = active.role === 'student' ? copy.roleStudent : active.role === 'guardian' ? copy.roleGuardian : copy.roleTeacher;
  const href = active.role === 'teacher' ? '#/class' : active.role === 'guardian' ? '#/family' : '#/join';
  const linkLabel = active.role === 'teacher' ? copy.navClass : active.role === 'guardian' ? copy.navFamily : copy.navJoin;
  const kids = active.role === 'guardian' ? guardianLinks(db, active.id) : null;
  const ownLog = active.role === 'student' ? accessFor(db, active.id, active.id) : null;

  return (
    <section className="panel" aria-label={copy.myAccount}>
      <h2>{copy.myAccount}</h2>
      <p className="demo-banner">
        <bdi dir="ltr">{DEMO_BANNER}</bdi>
      </p>
      <p>
        <bdi>{active.nickname}</bdi> · {role}
        {active.sample ? ` · ${copy.sampleBadge}` : ''}
      </p>
      <p>{copy.profileNote}</p>
      <p>{copy.noSecrets}</p>
      {active.role === 'student' ? (
        <label className="field">
          {copy.homeLang}
          <select value={active.lang} onChange={(event) => onHomeLang(event.target.value as SupportedLangCode)}>
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.nativeName}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <p>
        <a className="btn primary" href={href}>
          {linkLabel}
        </a>
      </p>
      {active.role === 'student' ? (
        <div>
          <h3>{copy.accessTitle}</h3>
          {!ownLog || ownLog.length === 0 ? <p>{copy.accessEmpty}</p> : null}
          <ul>
            {ownLog?.map((item) => (
              <li key={item.id}>
                <bdi>{item.actorNickname}</bdi> · <time dateTime={item.at}>{formatWhen(item.at, lang)}</time>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {kids ? (
        <div>
          <h3>{copy.accessTitle}</h3>
          {kids.ended ? <p role="status">{copy.unlinked}</p> : null}
          {kids.active.length === 0 && !kids.ended ? <p>{copy.accessEmpty}</p> : null}
          {kids.active.map((kid) => {
            const access = accessFor(db, active.id, kid.studentId) ?? [];
            return (
              <div key={kid.id}>
                <h4>
                  <bdi>{kid.nickname}</bdi>
                </h4>
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
        </div>
      ) : null}
    </section>
  );
}
