import { compareColumns } from '../compare/model';
import { planCopy } from '../i18n/planCopy';
import type { SupportedLangCode } from '../kbridge';
import type { StudentProfile } from '../profile/profile';

export function SavedTracks({
  lang,
  profile,
  ids,
  onRemove,
}: {
  lang: SupportedLangCode;
  profile: StudentProfile;
  ids: readonly string[];
  onRemove?: (id: string) => void;
}) {
  const copy = planCopy(lang);
  const columns = compareColumns(ids, profile);
  return (
    <section aria-label={copy.savedTitle}>
      {columns.length === 0 ? <p className="muted">{copy.emptySaved}</p> : null}
      <div className="save-list">
        {columns.map((column) => (
          <article key={column.id}>
            <p className="save-name">
              <a href={`#/track/${encodeURIComponent(column.id)}`}>{column.name}</a>
            </p>
            {column.university ? <p className="muted">{column.university}</p> : null}
            {onRemove ? (
              <button type="button" className="btn ghost" aria-label={`${copy.remove}: ${column.name}`} onClick={() => onRemove(column.id)}>
                {copy.remove}
              </button>
            ) : null}
          </article>
        ))}
      </div>
      <a className="btn ghost" href="#/deadlines">
        {copy.openDeadlines}
      </a>
    </section>
  );
}
