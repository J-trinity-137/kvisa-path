import { useState } from 'react';
import type { SupportedLangCode } from '../kbridge';
import { navCopy } from '../i18n/navCopy';
import { planCopy } from '../i18n/planCopy';
import { STUDENT_TYPE_COPY } from '../i18n/studentTypeCopy';
import { PATHWAYS_2028_COPY } from '../i18n/pathways2028Copy';
import { easySentence } from '../i18n/shellCopy';
import { FreshnessLine } from '../components/FreshnessLine';
import { SpeakButton } from '../components/SpeakButton';
import { regionLabel } from '../i18n/regionLabels';
import type { ToggleStatus } from '../library/tracks';
import type { StudentProfile } from '../profile/profile';
import { isVerifiedTrack } from '../rules/reasons';
import type { EligibleTrack } from '../rules/types';

export function Dashboard({
  lang,
  profile,
  tracks,
  easy,
  onEdit,
  compareIds = [],
  savedIds = [],
  onToggleCompare,
  onToggleSave,
}: {
  lang: SupportedLangCode;
  profile: StudentProfile;
  tracks: EligibleTrack[];
  easy: boolean;
  onEdit: () => void;
  compareIds?: readonly string[];
  savedIds?: readonly string[];
  onToggleCompare?: (id: string) => ToggleStatus;
  onToggleSave?: (id: string) => void;
}) {
  const copy = navCopy(lang);
  const plan = planCopy(lang);
  const [note, setNote] = useState('');
  const groups = PATHWAYS_2028_COPY[lang].groups;
  const [open, setOpen] = useState<string | null>(null);
  const typeLabel = profile.studentType ? STUDENT_TYPE_COPY[lang].types[profile.studentType] : null;
  const chips = [
    profile.grade ? copy.grades[profile.grade] : null,
    profile.region ? regionLabel(lang, profile.region) : null,
    typeLabel,
    profile.koreanLevel ? copy.korean[profile.koreanLevel] : null,
    profile.goal ? copy.goals[profile.goal] : null,
  ].filter((item): item is string => Boolean(item));
  const lead = tracks.map((track) => track.title).join('. ');
  return (
    <div className="dash" id="tracks-print">
      <header className="band">
        <div>
          <p className="brand" dir="ltr">
            K-Visa Path
          </p>
          <h1>{copy.dashTitle}</h1>
          <p>{copy.dashLead}</p>
        </div>
        <div className="band-actions">
          <SpeakButton lang={lang} text={lead || copy.dashTitle} />
          <button type="button" className="btn light" onClick={onEdit}>
            {copy.edit}
          </button>
          <button type="button" className="btn light" onClick={() => window.print()}>
            {copy.print}
          </button>
          {compareIds.length > 0 ? (
            <a className="btn light" href="#/compare">
              {plan.openCompare} {compareIds.length}
            </a>
          ) : null}
        </div>
      </header>
      {note ? (
        <p role="status" className="soft">
          {note}
        </p>
      ) : null}
      <div className="chips" aria-label={copy.region}>
        {chips.map((item) => (
          <span key={item} className="pill">
            {item}
          </span>
        ))}
      </div>
      {tracks.length === 0 ? <p className="empty">{copy.empty}</p> : null}
      <div className="track-grid">
        {tracks.map((track) => {
          const reason = easy ? easySentence(track.reason) : track.reason;
          const expanded = open === track.id;
          return (
            <article key={track.id} className={`track-card kind-${track.kind}`}>
              <p className="year">{track.category ? groups[track.category] : track.yearLabel}</p>
              {track.category ? <p className="muted">{track.yearLabel}</p> : null}
              <h2>{track.title}</h2>
              <p>{reason}</p>
              <div className="card-actions">
                <button type="button" className="btn primary" aria-expanded={expanded} onClick={() => setOpen(expanded ? null : track.id)}>
                  {copy.next}
                </button>
                {track.verified && isVerifiedTrack(track.id) && onToggleCompare ? (
                  <button
                    type="button"
                    className="btn ghost"
                    aria-pressed={compareIds.includes(track.id)}
                    aria-label={`${compareIds.includes(track.id) ? plan.inCompare : plan.addCompare}: ${track.title}`}
                    onClick={() => {
                      const status = onToggleCompare(track.id);
                      setNote(status === 'full' ? plan.compareFull : '');
                    }}
                  >
                    {compareIds.includes(track.id) ? plan.inCompare : plan.addCompare}
                  </button>
                ) : null}
                {track.verified && isVerifiedTrack(track.id) && onToggleSave ? (
                  <button
                    type="button"
                    className="btn ghost"
                    aria-pressed={savedIds.includes(track.id)}
                    aria-label={`${savedIds.includes(track.id) ? plan.saved : plan.save}: ${track.title}`}
                    onClick={() => onToggleSave(track.id)}
                  >
                    {savedIds.includes(track.id) ? plan.saved : plan.save}
                  </button>
                ) : null}
                {track.verified && isVerifiedTrack(track.id) ? (
                  <a className="btn ghost" href={`#/track/${encodeURIComponent(track.id)}`}>
                    {plan.detail}
                  </a>
                ) : null}
              </div>
              {expanded ? (
                <div className="detail">
                  <ul>
                    {track.details.slice(0, 8).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <FreshnessLine lang={lang} verifiedAt={track.verifiedAt} sourceUrl={track.sourceUrl} />
                  {!track.verified ? <p className="muted">{copy.checked}</p> : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
