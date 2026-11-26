import type { SupportedLangCode } from '../kbridge';
import type { NationwideRegionId, RegionEntry } from '../data/nationwideRegions';
import {
  NATIONAL_LINES,
  REGION_FLAGS,
  entriesFor,
  gapsFor,
} from '../data/nationwideRegions';
import { categoryLabel, regionLabel, NATIONWIDE_UI } from '../i18n/regionLabels';
import { REGION_COPY } from '../i18n/regionCopy';
import { FreshnessLine } from './FreshnessLine';

function telHref(phone: string): string | null {
  const match = phone.match(/0\d{1,2}-\d{3,4}-\d{4}|1\d{3}-\d{4}|1345/);
  if (!match) return null;
  return `tel:${match[0].replaceAll('-', '')}`;
}

function Fact({ row, lang }: { row: RegionEntry; lang: SupportedLangCode }) {
  const copy = REGION_COPY[lang];
  const ui = NATIONWIDE_UI[lang];
  const href = row.phone ? telHref(row.phone) : null;
  return (
    <article className="kb-card kb-stack">
      <strong>{row.name}</strong>
      {row.press ? <span className="kb-tag">{copy.press}</span> : null}
      {row.planning ? <span className="kb-tag">{copy.planningOnly}</span> : null}
      {row.nameOnly ? <span className="kb-tag">{ui.nameOnly}</span> : null}
      {row.notMulticulturalOnly ? <p style={{ margin: 0 }}>{ui.notOnlyMulti}</p> : null}
      {row.quote ? <p style={{ margin: 0 }}>{row.quote}</p> : null}
      {href ? (
        <a className="kv-link" href={href}>{row.phone}</a>
      ) : row.phone ? (
        <p className="kb-subtitle" style={{ margin: 0 }}>{row.phone}</p>
      ) : null}
      {row.note ? <p className="kb-subtitle" style={{ margin: 0 }}>{row.note}</p> : null}
      <FreshnessLine lang={lang} verifiedAt={row.verifiedAt} sourceUrl={row.sourceUrl} />
    </article>
  );
}

export function RegionFacts({ lang, region }: { lang: SupportedLangCode; region: NationwideRegionId }) {
  const ui = NATIONWIDE_UI[lang];
  const flags = REGION_FLAGS[region];
  const entries = entriesFor(region);
  const gaps = gapsFor(region);
  const categories = [...new Set(entries.map((entry) => entry.category))];
  return (
    <section className="kb-section" aria-label={regionLabel(lang, region)} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h2 className="kb-section-title">{regionLabel(lang, region)}</h2>
      {flags.merged ? <p>{ui.mergedMark}</p> : null}
      {flags.incheonDistricts ? <p>{ui.incheonDistricts}</p> : null}
      {categories.map((category) => (
        <div key={category}>
          <h3 className="kb-section-title">{categoryLabel(lang, category)}</h3>
          <div className="kb-stack">
            {entries.filter((entry) => entry.category === category).map((entry) => (
              <Fact key={entry.id} row={entry} lang={lang} />
            ))}
          </div>
        </div>
      ))}
      {gaps.length > 0 ? (
        <div>
          <h3 className="kb-section-title">{ui.callCenter}</h3>
          <div className="kb-stack">
            {gaps.map((gap) => {
              const href = telHref(gap.centerPhone);
              return (
                <article key={gap.category} className="kb-card kb-stack">
                  <strong>{categoryLabel(lang, gap.category)}</strong>
                  <p style={{ margin: 0 }}>{ui.callCenter}</p>
                  <p style={{ margin: 0 }}>{gap.centerName}</p>
                  {href ? <a className="kv-link" href={href}>{gap.centerPhone}</a> : <p style={{ margin: 0 }}>{gap.centerPhone}</p>}
                  <FreshnessLine lang={lang} verifiedAt={gap.verifiedAt} sourceUrl={gap.sourceUrl} />
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
      <h3 className="kb-section-title">{ui.nationalTitle}</h3>
      <div className="kb-stack">
        {NATIONAL_LINES.map((line) => {
          const href = telHref(line.phone);
          return (
            <article key={line.id} className="kb-card kb-stack">
              <strong>{line.name}</strong>
              {href ? <a className="kv-link" href={href}>{line.phone}</a> : <p style={{ margin: 0 }}>{line.phone}</p>}
              <FreshnessLine lang={lang} verifiedAt={line.verifiedAt} sourceUrl={line.sourceUrl} />
            </article>
          );
        })}
      </div>
    </section>
  );
}
