import { useState } from 'react';
import { FAQ_ITEMS } from '../data/faq';
import type { SupportedLangCode } from '../kbridge';
import { languageMeta } from '../kbridge';
import { FAQ_EMPTY } from '../i18n/faqCopy';
import { FreshnessLine } from './FreshnessLine';

export function FaqPanel({ lang }: { lang: SupportedLangCode }) {
  const copy = FAQ_EMPTY[lang];
  const [open, setOpen] = useState(false);
  return (
    <section className="kb-section kv-no-print" aria-label={copy.title} dir={languageMeta(lang).dir}>
      <button type="button" className="kb-chip" onClick={() => setOpen((value) => !value)}>
        {copy.title}
      </button>
      {open ? (
        <div className="kb-card kb-stack" style={{ marginTop: 12 }}>
          {FAQ_ITEMS.length === 0 ? <p>{copy.empty}</p> : null}
          {FAQ_ITEMS.map((item) => (
            <article key={item.id}>
              <h2 className="kb-section-title">{item.question[lang]}</h2>
              <p>{item.answer[lang]}</p>
              <FreshnessLine lang={lang} verifiedAt={item.verifiedOn} sourceUrl={item.sourceUrl} />
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
