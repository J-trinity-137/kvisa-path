import { useState } from 'react';
import type { SupportedLangCode } from '../kbridge';
import { homeHeadline, navCopy, seeAllLabel } from '../i18n/navCopy';
import { planCopy } from '../i18n/planCopy';
import { PATHWAYS_2028_COPY } from '../i18n/pathways2028Copy';
import { reasonText } from '../i18n/reasonCopy';
import { easySentence } from '../i18n/shellCopy';
import { EmptyState } from '../components/ui';
import { ddayState, nextUpcoming } from '../deadlines/list';
import { seoulDate } from '../deadlines/seoul';
import { admissionTracks } from '../rules/evaluate';
import { isVerifiedTrack } from '../rules/reasons';
import type { EligibleTrack, WhyCode } from '../rules/types';
import { ddayLabel } from './DeadlinesView';

export function Dashboard({
  lang,
  tracks,
  withheld = [],
  loading,
  easy,
  onEdit,
  chosenIds = [],
  today,
}: {
  lang: SupportedLangCode;
  tracks: EligibleTrack[];
  withheld?: { code: WhyCode; count: number }[];
  loading?: boolean;
  easy: boolean;
  onEdit: () => void;
  chosenIds?: readonly string[];
  today?: string;
}) {
  const copy = navCopy(lang);
  const plan = planCopy(lang);
  const groups = PATHWAYS_2028_COPY[lang].groups;
  const [showAll, setShowAll] = useState(false);
  const day = today ?? seoulDate(new Date());
  const listed = admissionTracks(tracks);
  const next = nextUpcoming(chosenIds, day);
  const nextState = next ? ddayState(next.start, next.end, day) : null;
  const top = listed.slice(0, 3);
  const visible = showAll ? listed : top;

  return (
    <div className="home" id="tracks-print">
      <header className="home-head">
        <h1>{homeHeadline(copy, listed.length)}</h1>
        <p className="lead">{copy.dashLead}</p>
        <div className="action-row">
          {listed.length > 0 ? (
            <button type="button" className="btn primary" aria-expanded={showAll} onClick={() => setShowAll((open) => !open)}>
              {seeAllLabel(copy, listed.length)}
            </button>
          ) : (
            <button type="button" className="btn primary" onClick={onEdit}>
              {copy.edit}
            </button>
          )}
          {listed.length > 0 ? (
            <button type="button" className="btn text" onClick={onEdit}>
              {copy.edit}
            </button>
          ) : null}
        </div>
      </header>

      {loading ? <p className="muted">{copy.loading}</p> : null}
      {!loading && listed.length === 0 ? <EmptyState title={copy.empty} /> : null}

      {top.length > 0 ? (
        <div className="home-grid">
          <ol className="rank-list">
            {visible.map((track) => (
              <li key={track.id}>
                <TrackRow track={track} easy={easy} lang={lang} category={track.category ? groups[track.category] : null} today={day} />
              </li>
            ))}
          </ol>
          <a className="next-card" href="#/deadlines">
            <p className="kicker">{copy.nextUp}</p>
            {next && nextState ? (
              <>
                <p className="next-when">{ddayLabel(nextState.phase, nextState.days, plan)}</p>
                <p className="next-title">{next.title}</p>
                <p className="muted" dir="ltr">
                  {next.start}
                </p>
              </>
            ) : (
              <p className="muted">{plan.none}</p>
            )}
          </a>
        </div>
      ) : null}

      {!loading && withheld.length > 0 ? (
        <details className="fold">
          <summary>{copy.whyNotTitle}</summary>
          <ul>
            {withheld.map((item) => (
              <li key={item.code}>
                {reasonText(lang, item.code)} ({item.count})
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

function oneLine(text: string): string {
  const cut = text.split(' · ')[0]?.split('\n')[0]?.trim() ?? text;
  return cut.length > 80 ? `${cut.slice(0, 80)}…` : cut;
}

function deadlineLabel(yearLabel: string, today: string): string | null {
  const dates = yearLabel.match(/\d{4}-\d{2}-\d{2}/g) ?? [];
  return dates.find((date) => date >= today) ?? null;
}

function TrackRow({
  track,
  easy,
  lang,
  category,
  today,
}: {
  track: EligibleTrack;
  easy: boolean;
  lang: SupportedLangCode;
  category: string | null;
  today: string;
}) {
  const why =
    track.reasons.length > 0 ? reasonText(lang, track.reasons[0]!) : easy ? easySentence(track.reason) : oneLine(track.reason);
  const deadline = deadlineLabel(track.yearLabel, today);
  const body = (
    <>
      {category ? <p className="kicker">{category}</p> : null}
      <h2>{track.title}</h2>
      <p className="rank-why">{why}</p>
      {deadline ? (
        <p className="rank-when" dir="ltr">
          {deadline}
        </p>
      ) : null}
    </>
  );
  if (!isVerifiedTrack(track.id)) return <article className="rank-card">{body}</article>;
  return (
    <a className="rank-card" href={`#/track/${encodeURIComponent(track.id)}`}>
      {body}
    </a>
  );
}
