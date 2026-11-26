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
    <section className="panel" aria-labelledby="saved-tracks">
      <h2 id="saved-tracks">{copy.savedTitle}</h2>
      {columns.length === 0 ? <p className="empty">{copy.emptySaved}</p> : null}
      <div className="save-list">
        {columns.map((column) => (
          <article key={column.id}>
            <h3>
              <a href={`#/track/${encodeURIComponent(column.id)}`}>{column.name}</a>
            </h3>
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
