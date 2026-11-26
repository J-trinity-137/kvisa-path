import { EmptyState } from '../components/ui';
import { categoryText, failText, nationalityText, quotaText, topikText, windowText } from '../compare/format';
import { compareColumns, rowHasFail, type CompareColumn } from '../compare/model';
import { planCopy } from '../i18n/planCopy';
import { navCopy } from '../i18n/navCopy';
import type { SupportedLangCode } from '../kbridge';
import type { StudentProfile } from '../profile/profile';
import type { ReasonRow } from '../rules/reasons';

function FactCell({
  lang,
  column,
  row,
  text,
}: {
  lang: SupportedLangCode;
  column: CompareColumn;
  row: ReasonRow | 'plain';
  text: string;
}) {
  const reason = row === 'plain' ? null : failText(lang, column.fails, row);
  return (
    <td className={reason ? 'is-fail' : undefined}>
      {text.split('\n').map((line) =>
        /^\d{4}-\d{2}-\d{2}/.test(line) ? (
          <span key={line} dir="ltr" className="date-line">
            {line}
          </span>
        ) : (
          <span key={line}>{line}</span>
        ),
      )}
      {reason ? <p className="fail-reason">{reason}</p> : null}
    </td>
  );
}

export function CompareView({
  lang,
  profile,
  ids,
  onRemove,
}: {
  lang: SupportedLangCode;
  profile: StudentProfile;
  ids: readonly string[];
  onRemove: (id: string) => void;
}) {
  const copy = planCopy(lang);
  const columns = compareColumns(ids, profile);
  const fields: { key: string; label: string; row: ReasonRow | 'plain'; text: (column: CompareColumn) => string }[] = [
    { key: 'university', label: copy.university, row: 'plain', text: (column) => column.university ?? copy.none },
    { key: 'category', label: navCopy(lang).category, row: 'plain', text: (column) => categoryText(lang, column) },
    { key: 'quota', label: copy.quota, row: 'plain', text: (column) => quotaText(lang, column) },
    { key: 'nationality', label: copy.nationality, row: 'nationality', text: (column) => nationalityText(lang, column) },
    { key: 'topik', label: copy.topik, row: 'topik', text: (column) => topikText(lang, column) },
    { key: 'school', label: copy.school, row: 'school', text: (column) => column.school || copy.none },
    { key: 'window', label: copy.window, row: 'plain', text: (column) => windowText(lang, column) },
  ];
  return (
    <div className="cmp" id="compare-print">
      <header className="page-head">
        <div>
          <h1>{copy.compareTitle}</h1>
          <p className="lead">{copy.compareLead}</p>
        </div>
        <div className="action-row no-print">
          <a className="btn ghost" href="#/tracks">
            {copy.backTracks}
          </a>
          <button type="button" className="btn primary" onClick={() => window.print()} disabled={columns.length === 0}>
            {copy.print}
          </button>
        </div>
      </header>
      {columns.length === 0 ? <EmptyState title={copy.emptyCompare} /> : null}
      {columns.some((column) => column.fails.length > 0) ? <p className="soft">{copy.failLegend}</p> : null}
      {columns.length > 0 ? (
        <div className="cmp-scroll">
          <table className="cmp-table">
            <caption>{copy.compareTitle}</caption>
            <thead>
              <tr>
                <th scope="col">{copy.field}</th>
                {columns.map((column) => (
                  <th key={column.id} scope="col">
                    {column.name}
                    <div className="no-print">
                      <button type="button" className="btn ghost" aria-label={`${copy.remove}: ${column.name}`} onClick={() => onRemove(column.id)}>
                        {copy.remove}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => {
                const fail = field.row !== 'plain' && rowHasFail(columns, field.row);
                return (
                  <tr key={field.key} className={fail ? 'is-fail' : undefined} data-fail-row={fail ? field.row : undefined}>
                    <th scope="row">{field.label}</th>
                    {columns.map((column) => (
                      <FactCell key={column.id} lang={lang} column={column} row={field.row} text={field.text(column)} />
                    ))}
                  </tr>
                );
              })}
              <tr>
                <th scope="row">{copy.source}</th>
                {columns.map((column) => (
                  <td key={column.id}>
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
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
