import { useState } from 'react';
import {
  GYEONGGI_CALL_CENTER,
  GYEONGGI_CITIES,
  ANSAN_SCHOOL_PLAN,
  GYEONGGI_COMMON_SUPPORT,
  GYEONGGI_KLS,
  GYEONGGI_NOTES,
  GYEONGGI_PROCEDURES,
  OSAN_KLS_ABSENT,
  rowsFor,
  type GyeonggiCity,
  type GyeonggiRow,
} from '../data/gyeonggiData';
import type { SupportedLangCode } from '../kbridge';
import { REGION_COPY } from '../i18n/regionCopy';
import { FreshnessLine } from './FreshnessLine';

function telHref(phone: string): string | null {
  const match = phone.match(/0\d{1,2}-\d{3,4}-\d{4}/);
  return match ? `tel:${match[0].replaceAll('-', '')}` : null;
}

function FactCard({ row, lang, badge }: { row: GyeonggiRow; lang: SupportedLangCode; badge?: string }) {
  const href = telHref(row.phone);
  return (
    <article className="kb-card kb-stack">
      <strong>{row.name}</strong>
      {badge ? <span className="kb-tag">{badge}</span> : null}
      <p style={{ margin: 0 }}>{row.quote}</p>
      {href ? (
        <a className="kv-link" href={href}>
          {row.phone}
        </a>
      ) : (
        <p className="kb-subtitle" style={{ margin: 0 }}>{row.phone}</p>
      )}
      {row.note ? <p className="kb-subtitle" style={{ margin: 0 }}>{row.note}</p> : null}
      <FreshnessLine lang={lang} verifiedAt={row.verified_at} sourceUrl={row.source_url} />
    </article>
  );
}

export function GyeonggiGuide({ lang }: { lang: SupportedLangCode }) {
  const copy = REGION_COPY[lang];
  const [city, setCity] = useState<GyeonggiCity>('안산');
  const kls = GYEONGGI_KLS.filter((row) => row.city === city);
  const ansanExtra = city === '안산'
    ? [...rowsFor(city, 'foreign_resident_hq'), ...rowsFor(city, 'global_center'), ...rowsFor(city, 'youth_center')]
    : [];

  return (
    <section className="kb-section" aria-label={copy.gyeonggi}>
      <h2 className="kb-section-title">{copy.gyeonggi}</h2>
      <p>{copy.callFirst}</p>
      {GYEONGGI_CALL_CENTER ? <FactCard lang={lang} row={GYEONGGI_CALL_CENTER} /> : null}

      <div className="kb-row" role="group" aria-label={copy.cityAsk}>
        {GYEONGGI_CITIES.map((item) => (
          <button key={item} type="button" className="kb-chip" aria-pressed={city === item} onClick={() => setCity(item)}>
            {item}
          </button>
        ))}
      </div>

      <h3 className="kb-section-title">{copy.familyCenter}</h3>
      <div className="kb-stack">
        {rowsFor(city, 'family_center').map((row) => (
          <FactCard key={row.name} lang={lang} row={row} />
        ))}
      </div>

      <h3 className="kb-section-title">{copy.eduMain}</h3>
      <div className="kb-stack">
        {rowsFor(city, 'edu_office_main').map((row) => (
          <FactCard key={row.name} lang={lang} row={row} />
        ))}
        {rowsFor(city, 'edu_office_multicultural').map((row) => (
          <FactCard key={row.name} lang={lang} row={row} badge={copy.plan2025} />
        ))}
      </div>

      <h3 className="kb-section-title">{copy.immigration}</h3>
      <div className="kb-stack">
        {rowsFor(city, 'immigration').map((row) => (
          <FactCard key={row.name} lang={lang} row={row} />
        ))}
      </div>

      {rowsFor(city, 'foreign_resident_center').length > 0 ? (
        <>
          <h3 className="kb-section-title">{copy.foreignCenter}</h3>
          <div className="kb-stack">
            {rowsFor(city, 'foreign_resident_center').map((row) => (
              <FactCard key={row.name} lang={lang} row={row} />
            ))}
          </div>
        </>
      ) : null}

      {city === '시흥' ? (
        <>
          <h3 className="kb-section-title">{copy.youthCenter}</h3>
          <div className="kb-stack">
            {rowsFor(city, 'youth_center').map((row) => (
              <FactCard key={row.name} lang={lang} row={row} />
            ))}
          </div>
        </>
      ) : null}

      {ansanExtra.length > 0 ? (
        <>
          <h3 className="kb-section-title">{copy.ansanOnly}</h3>
          <div className="kb-stack">
            {ansanExtra.map((row) => (
              <FactCard key={row.name} lang={lang} row={row} badge={row.category === 'public_alt_school_plan' ? copy.planningOnly : undefined} />
            ))}
            {ANSAN_SCHOOL_PLAN ? (
              <article className="kb-card kb-stack">
                <strong>{copy.planningOnly}</strong>
                <p style={{ margin: 0 }}>{ANSAN_SCHOOL_PLAN.quote}</p>
                <FreshnessLine lang={lang} verifiedAt={ANSAN_SCHOOL_PLAN.verified_at} sourceUrl={ANSAN_SCHOOL_PLAN.source_url} />
              </article>
            ) : null}
          </div>
        </>
      ) : null}

      <h3 className="kb-section-title">{copy.klsTitle}</h3>
      <p>{copy.klsLead}</p>
      <p className="kb-subtitle">{copy.klsShort}</p>
      <div className="kb-stack">
        {kls.map((row) => (
          <FactCard key={`${row.name}-${row.phone}`} lang={lang} row={row} />
        ))}
      </div>
      {city === '오산' && OSAN_KLS_ABSENT ? <p>{copy.osanNone}</p> : null}

      <h3 className="kb-section-title">{copy.flowTitle}</h3>
      <div className="kb-stack">
        {GYEONGGI_PROCEDURES.map((row) => (
          <FactCard key={row.name} lang={lang} row={row} />
        ))}
        {GYEONGGI_COMMON_SUPPORT.filter((row) => !row.name.includes('경기에듀콜센터')).map((row) => (
          <FactCard key={row.name} lang={lang} row={row} />
        ))}
        {GYEONGGI_NOTES.map((row) => (
          <article key={row.name} className="kb-card kb-stack">
            <strong>{row.name}</strong>
            <p style={{ margin: 0 }}>{row.quote}</p>
            {row.note ? <p className="kb-subtitle" style={{ margin: 0 }}>{row.note}</p> : null}
            <FreshnessLine lang={lang} verifiedAt={row.verified_at} sourceUrl={row.source_url} />
          </article>
        ))}
      </div>
    </section>
  );
}
