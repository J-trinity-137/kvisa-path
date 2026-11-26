import { EmptyState } from '../components/ui';
import { allDates, ddayState, undatedChosen, type Deadline } from '../deadlines/list';
import { navCopy } from '../i18n/navCopy';
import { seoulDate } from '../deadlines/seoul';
import { planCopy } from '../i18n/planCopy';
import type { SupportedLangCode } from '../kbridge';
import { downloadCalendar, eventsToIcs, type CalendarEvent } from '../share/ics';

function toEvent(item: Deadline): CalendarEvent {
  return {
    uid: `${item.id}@kvisa-path`,
    title: item.title,
    start: item.start,
    end: item.end,
    description: [item.verifiedAt, item.appliesTo.join(' / '), item.sourceUrl].filter(Boolean).join(' '),
    url: item.sourceUrl,
  };
}

export function ddayLabel(phase: ReturnType<typeof ddayState>['phase'], days: number, copy: ReturnType<typeof planCopy>): string {
  if (phase === 'past') return `D+${days}`;
  if (phase === 'open' && days === 0) return copy.ddayToday;
  if (phase === 'open') return copy.ddayOpen;
  return `D-${days}`;
}

export function DeadlinesView({
  lang,
  chosenIds,
  today,
}: {
  lang: SupportedLangCode;
  chosenIds: readonly string[];
  today?: string;
}) {
  const copy = planCopy(lang);
  const shell = navCopy(lang);
  const day = today ?? seoulDate(new Date());
  const rows = allDates(chosenIds);
  const undated = undatedChosen(chosenIds);
  const filename = (id: string) => `${id.replace(/[^a-z0-9-]+/gi, '-')}.ics`;
  return (
    <div className="due" id="deadlines-print">
      <header className="page-head">
        <div>
          <h1>{shell.dates}</h1>
          <p className="lead">{copy.deadlinesLead}</p>
          <p className="muted">{copy.localFile}</p>
        </div>
        <div className="action-row no-print">
          <button
            type="button"
            className="btn primary"
            disabled={rows.length === 0}
            onClick={() => downloadCalendar('kvisa-deadlines.ics', eventsToIcs(rows.map(toEvent)))}
          >
            {copy.exportAll}
          </button>
          <button type="button" className="btn ghost" onClick={() => window.print()}>
            {copy.print}
          </button>
        </div>
      </header>
      {rows.length === 0 ? <EmptyState title={copy.none} /> : null}
      {rows.length > 0 ? (
        <div className="due-scroll">
          <table className="due-table">
            <caption>{shell.dates}</caption>
            <thead>
              <tr>
                <th scope="col">D-Day</th>
                <th scope="col">{copy.date}</th>
                <th scope="col">{copy.what}</th>
                <th scope="col">{copy.source}</th>
                <th scope="col" className="no-print">
                  .ics
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const state = ddayState(row.start, row.end, day);
                const label = ddayLabel(state.phase, state.days, copy);
                const range = row.start === row.end ? row.start : `${row.start} – ${row.end}`;
                return (
                  <tr key={row.id}>
                    <td className={`due-${state.phase}`}>
                      <span>{label}</span>
                      {state.phase === 'past' ? <span className="muted"> {copy.ddayPast}</span> : null}
                    </td>
                    <td>
                      <time dir="ltr" className="date-line" dateTime={row.start}>
                        {range}
                      </time>
                    </td>
                    <td>
                      {row.title}
                      {row.appliesTo.length ? <p className="muted">{row.appliesTo.join(' · ')}</p> : null}
                    </td>
                    <td>
                      <a href={row.sourceUrl} target="_blank" rel="noreferrer">
                        {copy.source}
                      </a>
                      {' · '}
                      {copy.verified} <bdi dir="ltr">{row.verifiedAt}</bdi>
                    </td>
                    <td className="no-print">
                      <button
                        type="button"
                        className="btn ghost"
                        aria-label={`${copy.exportOne}: ${row.title}`}
                        onClick={() => downloadCalendar(filename(row.id), eventsToIcs([toEvent(row)]))}
                      >
                        {copy.exportOne}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
      {undated.length > 0 ? (
        <section className="panel">
          <h2>{copy.guide2027}</h2>
          <ul>
            {undated.map((item) => (
              <li key={item.id}>
                <a href={`#/track/${encodeURIComponent(item.id)}`}>{item.name}</a>
                <span> — {copy.undated}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
