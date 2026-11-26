import type { SupportedLangCode } from '../kbridge';
import { MULTICULTURAL_SECTIONS } from '../data/multiculturalPath';
import { MULTICULTURAL_TRACKS } from '../data/multiculturalTracks';
import { MULTICULTURAL_ROWS } from '../i18n/extraCopy';
import { easySentence } from '../i18n/shellCopy';
import { STUDENT_TYPE_COPY } from '../i18n/studentTypeCopy';
import { FreshnessLine } from './FreshnessLine';

export function MulticulturalPathView({ lang, easy }: { lang: SupportedLangCode; easy: boolean }) {
  const copy = STUDENT_TYPE_COPY[lang];
  const lead = easy ? easySentence(copy.domesticLead) : copy.domesticLead;
  const withTrack = MULTICULTURAL_TRACKS.filter((track) => track.hasTrack);
  const withoutTrack = MULTICULTURAL_TRACKS.filter((track) => !track.hasTrack);
  const filled = MULTICULTURAL_SECTIONS.filter((section) => section.itemIds.length > 0);

  return (
    <section className="kb-section" aria-label={copy.tracksTitle}>
      <h2 className="kb-section-title">{copy.tracksTitle}</h2>
      <p style={{ marginTop: 0 }}>{lead}</p>
      <div className="kb-stack">
        {withTrack.map((track) => (
          <article key={track.id} className="kb-card kb-stack" data-track-id={track.id}>
            <strong>{track.university}</strong>
            <p style={{ margin: 0 }}>{easy ? easySentence(MULTICULTURAL_ROWS[lang][track.id]) : MULTICULTURAL_ROWS[lang][track.id]}</p>
            <FreshnessLine lang={lang} verifiedAt={track.verifiedAt} sourceUrl={track.url} />
          </article>
        ))}
      </div>

      <h3 className="kb-section-title" style={{ marginTop: 16 }}>{copy.noTrackTitle}</h3>
      <ul className="kv-list">
        {withoutTrack.map((track) => (
          <li key={track.id} data-track-id={track.id}>
            <strong>{track.university}</strong>
            {' · '}
            {MULTICULTURAL_ROWS[lang][track.id]}
            {' '}
            <a className="kv-link" href={track.url} target="_blank" rel="noreferrer">2027</a>
          </li>
        ))}
      </ul>

      {filled.map((section) => (
        <div key={section.id} data-section-id={section.id}>
          {section.itemIds.join(', ')}
        </div>
      ))}

      <h3 className="kb-section-title" style={{ marginTop: 16 }}>{copy.parentTitle}</h3>
      <p className="kb-subtitle">{easy ? easySentence(copy.parentLead) : copy.parentLead}</p>
    </section>
  );
}
