import type { PathwayRecord, Quota } from '../data/trackSchema';
import { TARGET_2028_WINDOWS } from '../data/trackSchema';
import { pathwaySections } from '../data/pathways2028';
import type { SupportedLangCode } from '../kbridge';
import { PATHWAYS_2028_COPY } from '../i18n/pathways2028Copy';
import { easySentence } from '../i18n/shellCopy';
import { FreshnessLine } from './FreshnessLine';

function quotaText(quota: Quota, copy: (typeof PATHWAYS_2028_COPY)[SupportedLangCode], showSeats: boolean): string | null {
  const parts: string[] = [];
  if (showSeats && quota.seats != null) parts.push(`${quota.seats}${copy.seatUnit}`);
  if (quota.kind === 'unrestricted') parts.push(copy.unrestricted);
  if (quota.kind === 'out_of_quota') parts.push(copy.outOfQuota);
  if (quota.kind === 'in_quota') parts.push(copy.inQuota);
  if (quota.kind === 'cap_percent' && quota.capPercent != null) parts.push(`${quota.capPercent}${copy.capSuffix}`);
  return parts.length > 0 ? parts.join(' · ') : null;
}

function showSeats(row: PathwayRecord): boolean {
  return row.university != null || row.category === 'alternative_school';
}

export function Pathways2028View({ lang, easy }: { lang: SupportedLangCode; easy: boolean }) {
  const copy = PATHWAYS_2028_COPY[lang];
  const { susi, jeongsi } = TARGET_2028_WINDOWS;
  const sections = pathwaySections();

  return (
    <section className="kb-section" aria-label={copy.sectionTitle} data-cycle="2028" data-role="current_target">
      <h2 className="kb-section-title">{copy.sectionTitle}</h2>
      <p style={{ marginTop: 0 }}>
        {copy.currentTarget} {copy.susi} {susi.start}–{susi.end}. {copy.jeongsi} {jeongsi.start}–{jeongsi.end}.
      </p>
      {sections.map((section) => (
        <div key={section.id} data-pathway-section={section.id}>
          <h3 className="kb-section-title" style={{ marginTop: 16 }}>{copy.groups[section.id]}</h3>
          {section.id === 'post_graduation_stay' ? <p className="kb-subtitle">{copy.stayLead}</p> : null}
          <div className="kb-stack">
            {section.rows.map((row) => {
              const body = row.category === 'support_center' ? row.eligibility.textKo : row.summaryKo;
              const seats = quotaText(row.quota, copy, showSeats(row));
              return (
                <article key={row.id} className="kb-card kb-stack" data-pathway-id={row.id} data-role={row.role}>
                  <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                    <strong>{row.name}</strong>
                    {row.guideBasis === '2027_guide' ? (
                      <span className="kb-tag kb-status-check">{copy.guide2027}</span>
                    ) : row.role === 'closed_reference' ? (
                      <span className="kb-tag kb-status-check">{copy.closedTag}</span>
                    ) : null}
                    {row.hasTrack === false ? <span className="kb-tag">{copy.absent}</span> : null}
                  </div>
                  {row.languageBridge ? <p className="kb-subtitle" style={{ margin: 0 }}>{copy.afterOffer}</p> : null}
                  {row.track ? (
                    <p className="kb-subtitle" style={{ margin: 0 }}>{[row.university, row.track].filter(Boolean).join(' · ')}</p>
                  ) : null}
                  {row.eligibility.nationality === 'korean_citizen_only' ? (
                    <p className="kb-subtitle" style={{ margin: 0 }}>{copy.koreanOnly}</p>
                  ) : null}
                  {row.eligibility.bothParentsForeign ? (
                    <p className="kb-subtitle" style={{ margin: 0 }}>{copy.bothParents}</p>
                  ) : null}
                  {row.language?.noMinimum ? <p className="kb-subtitle" style={{ margin: 0 }}>{copy.topikNone}</p> : null}
                  {row.language?.topikMin != null ? (
                    <p className="kb-subtitle" style={{ margin: 0 }}>{copy.topikAtLeast.replace('{level}', String(row.language.topikMin))}</p>
                  ) : null}
                  {seats ? <p className="kb-subtitle" style={{ margin: 0 }}>{seats}</p> : null}
                  {row.phone ? (
                    <p style={{ margin: 0 }}>
                      <a className="kv-link" href={`tel:${row.phone.replaceAll('-', '')}`}>{copy.phone} {row.phone}</a>
                    </p>
                  ) : null}
                  <p style={{ margin: 0 }}>{easy ? easySentence(body) : body}</p>
                  <FreshnessLine lang={lang} verifiedAt={row.verifiedAt} sourceUrl={row.url} />
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
