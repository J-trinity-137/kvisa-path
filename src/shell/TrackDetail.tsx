import { Fragment } from 'react';
import { EmptyState } from '../components/ui';
import { categoryText, failText, nationalityText, quotaText, topikText, windowText } from '../compare/format';
import { compareColumns } from '../compare/model';
import { planCopy } from '../i18n/planCopy';
import { navCopy } from '../i18n/navCopy';
import { PATHWAYS_2028_COPY } from '../i18n/pathways2028Copy';
import type { SupportedLangCode } from '../kbridge';
import type { StudentProfile } from '../profile/profile';
import type { ReasonRow } from '../rules/reasons';
import type { ToggleStatus } from '../library/tracks';

export function TrackDetail({
  lang,
  profile,
  id,
  comparing,
  saved,
  onCompare,
  onSave,
}: {
  lang: SupportedLangCode;
  profile: StudentProfile;
  id: string;
  comparing: boolean;
  saved: boolean;
  onCompare: (id: string) => ToggleStatus;
  onSave: (id: string) => void;
}) {
  const copy = planCopy(lang);
  const column = compareColumns([id], profile)[0];
  if (!column) {
    return (
      <div className="detail-page">
        <h1>{copy.detail}</h1>
        <EmptyState
          title={copy.emptyCompare}
          action={
            <a className="btn ghost" href="#/tracks">
              {copy.backTracks}
            </a>
          }
        />
      </div>
    );
  }
  const rows: { key: string; label: string; row: ReasonRow | 'plain'; text: string }[] = [
    { key: 'university', label: copy.university, row: 'plain', text: column.university ?? copy.none },
    { key: 'category', label: navCopy(lang).category, row: 'plain', text: categoryText(lang, column) },
    { key: 'quota', label: copy.quota, row: 'plain', text: quotaText(lang, column) },
    { key: 'nationality', label: copy.nationality, row: 'nationality', text: nationalityText(lang, column) },
    { key: 'topik', label: copy.topik, row: 'topik', text: topikText(lang, column) },
    { key: 'school', label: copy.school, row: 'school', text: column.school || copy.none },
    { key: 'window', label: copy.window, row: 'plain', text: windowText(lang, column) },
  ];
  const stay = column.category === 'post_graduation_stay';
  return (
    <article className="detail-page">
      <header className="page-head">
        <div>
          <p className="kicker">{categoryText(lang, column)}</p>
          <h1>{column.name}</h1>
          {stay ? <p className="lead">{PATHWAYS_2028_COPY[lang].stayLead}</p> : null}
        </div>
        <div className="action-row no-print">
          <a className="btn ghost" href="#/tracks">
            {copy.backTracks}
          </a>
          <button type="button" className="btn primary" aria-pressed={comparing} onClick={() => onCompare(id)}>
            {comparing ? copy.inCompare : copy.addCompare}
          </button>
          <button type="button" className="btn ghost" aria-pressed={saved} onClick={() => onSave(id)}>
            {saved ? copy.saved : copy.save}
          </button>
          <button type="button" className="btn ghost" onClick={() => window.print()}>
            {copy.print}
          </button>
        </div>
      </header>
      {column.fails.length ? <p className="soft">{copy.failLegend}</p> : null}
      <dl className="detail-grid">
        {rows.map((item) => {
          const reason = item.row === 'plain' ? null : failText(lang, column.fails, item.row);
          const mark = reason ? 'is-fail' : undefined;
          return (
            <Fragment key={item.key}>
              <dt className={mark}>{item.label}</dt>
              <dd className={mark}>
                {item.text.split('\n').map((line) =>
                  /^\d{4}-\d{2}-\d{2}/.test(line) ? (
                    <span key={line} dir="ltr" className="date-line">
                      {line}
                    </span>
                  ) : (
                    <span key={line}>{line}</span>
                  ),
                )}
                {reason ? <p className="fail-reason">{reason}</p> : null}
              </dd>
            </Fragment>
          );
        })}
        <dt>{copy.source}</dt>
        <dd>
          {column.sourceUrl ? (
            <a href={column.sourceUrl} target="_blank" rel="noreferrer">
              {copy.source}
            </a>
          ) : (
            copy.none
          )}
          {column.verifiedAt ? (
            <>
              {' · '}
              {copy.verified} <bdi dir="ltr">{column.verifiedAt}</bdi>
            </>
          ) : null}
        </dd>
      </dl>
    </article>
  );
}
