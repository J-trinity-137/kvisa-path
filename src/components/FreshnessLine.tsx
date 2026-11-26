import { isOlderThanYear } from '../data/freshness';
import type { SupportedLangCode } from '../kbridge';
import { FRESHNESS_COPY } from '../i18n/shellCopy';

export function FreshnessLine({
  lang,
  verifiedAt,
  sourceUrl,
  today,
}: {
  lang: SupportedLangCode;
  verifiedAt?: string;
  sourceUrl?: string;
  today?: Date;
}) {
  if (!verifiedAt) return null;
  const copy = FRESHNESS_COPY[lang];
  const stale = isOlderThanYear(verifiedAt, today);
  return (
    <p className="kb-subtitle" style={{ margin: '4px 0 0' }}>
      {copy.checked}: {verifiedAt}
      {sourceUrl ? (
        <>
          {' · '}
          <a className="kv-link" href={sourceUrl} target="_blank" rel="noreferrer">
            {copy.source}
          </a>
        </>
      ) : null}
      {stale ? <span className="kb-tag kb-status-check" style={{ marginLeft: 8 }}>{copy.stale}</span> : null}
    </p>
  );
}
