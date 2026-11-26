import { isOlderThanYear } from '../data/freshness';
import type { SupportedLangCode } from '../kbridge';
import { FRESHNESS_COPY } from '../i18n/shellCopy';

export function FreshnessLine({
  lang,
  verifiedAt,
  sourceUrl,
  today,
  referenceLabel,
}: {
  lang: SupportedLangCode;
  verifiedAt?: string;
  sourceUrl?: string;
  today?: Date;
  /** Closed 2027 guide kept beside the 2028 target. */
  referenceLabel?: string;
}) {
  if (!verifiedAt && !sourceUrl && !referenceLabel) return null;
  const copy = FRESHNESS_COPY[lang];
  const stale = verifiedAt ? isOlderThanYear(verifiedAt, today) : false;
  return (
    <p className="kb-subtitle" style={{ margin: '4px 0 0' }}>
      {verifiedAt ? `${copy.checked}: ${verifiedAt}` : null}
      {sourceUrl ? (
        <>
          {verifiedAt ? ' · ' : null}
          <a className="kv-link" href={sourceUrl} target="_blank" rel="noreferrer">
            {copy.source}
          </a>
        </>
      ) : null}
      {referenceLabel ? <span className="kb-tag kb-status-check" style={{ marginInlineStart: 8 }}>{referenceLabel}</span> : null}
      {stale ? <span className="kb-tag kb-status-check" style={{ marginInlineStart: 8 }}>{copy.stale}</span> : null}
    </p>
  );
}
