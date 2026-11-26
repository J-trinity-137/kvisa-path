import { useState } from 'react';
import type { SupportedLangCode } from '../kbridge';
import { homeHeadline, navCopy } from '../i18n/navCopy';
import { planCopy } from '../i18n/planCopy';
import { easySentence } from '../i18n/shellCopy';
import { reasonText } from '../i18n/reasonCopy';
import { EmptyState } from '../components/ui';
import { nextUpcoming } from '../deadlines/list';
import { seoulDate } from '../deadlines/seoul';
import { isVerifiedTrack } from '../rules/reasons';
import type { EligibleTrack, WhyCode } from '../rules/types';

export function Dashboard({
  lang,
  tracks,
  withheld = [],
  loading,
  easy,
  onEdit,
  chosenIds = [],
}: {
  lang: SupportedLangCode;
  tracks: EligibleTrack[];
  withheld?: { code: WhyCode; count: number }[];
  loading?: boolean;
  easy: boolean;
  onEdit: () => void;
  chosenIds?: readonly string[];
}) {
  const copy = navCopy(lang);
  const plan = planCopy(lang);
  const [restOpen, setRestOpen] = useState(false);
  const today = seoulDate(new Date());
  const next = nextUpcoming(chosenIds, today);
  const top = tracks.slice(0, 3);
  const rest = tracks.slice(3);
  const first = tracks.find((track) => isVerifiedTrack(track.id));

  return (
    <div className="home" id="tracks-print">
      <header className="home-head">
        <div>
          <h1>{homeHeadline(copy, tracks.length)}</h1>
          <p className="lead">{copy.dashLead}</p>
        </div>
        <div className="action-row">
          {first ? (
            <a className="btn primary" href={`#/track/${encodeURIComponent(first.id)}`}>
              {plan.detail}
            </a>
          ) : (
            <button type="button" className="btn primary" onClick={onEdit}>
              {copy.edit}
            </button>
          )}
          {first ? (
            <button type="button" className="btn text" onClick={onEdit}>
              {copy.edit}
            </button>
          ) : null}
        </div>
      </header>

      {loading ? <p className="muted">{copy.loading}</p> : null}
      {!loading && tracks.length === 0 ? <EmptyState title={copy.empty} /> : null}

      {top.length > 0 ? (
        <div className="home-grid">
          <ol className="rank-list">
            {top.map((track) => (
              <li key={track.id}>
                <TrackRow track={track} easy={easy} lang={lang} />
              </li>
            ))}
          </ol>
          <a className="next-card" href="#/deadlines">
            <p className="kicker">{copy.nextUp}</p>
            {next ? (
              <>
                <p className="next-when" dir="ltr">
                  {next.start}
                </p>
                <p>{next.title}</p>
              </>
            ) : (
              <p className="muted">{plan.none}</p>
            )}
          </a>
        </div>
      ) : null}

      {rest.length > 0 ? (
        <details className="fold" open={restOpen} onToggle={(event) => setRestOpen(event.currentTarget.open)}>
          <summary>{copy.restTracks}</summary>
          <ol className="rank-list" start={4}>
            {rest.map((track) => (
              <li key={track.id}>
                <TrackRow track={track} easy={easy} lang={lang} />
              </li>
            ))}
          </ol>
        </details>
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

function TrackRow({ track, easy, lang }: { track: EligibleTrack; easy: boolean; lang: SupportedLangCode }) {
  const reason = track.reasons.length > 0 ? track.reasons.map((code) => reasonText(lang, code)).join(' ') : easy ? easySentence(track.reason) : track.reason;
  const body = (
    <>
      <p className="kicker">{track.yearLabel}</p>
      <h2>{track.title}</h2>
      <p className="muted">{reason}</p>
    </>
  );
  if (!isVerifiedTrack(track.id)) {
    return <article className="rank-card">{body}</article>;
  }
  return (
    <a className="rank-card" href={`#/track/${encodeURIComponent(track.id)}`}>
      {body}
    </a>
  );
}
