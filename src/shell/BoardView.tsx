import { useMemo, useState } from 'react';
import { BOARD_CATEGORIES, filterBoard, type BoardCategory, type BoardPost, type BoardRegion } from '../data/board';
import { REGION_IDS } from '../data/freshness';
import { regionLabel } from '../i18n/regionLabels';
import { DDAY_SCHEDULES } from '../data/interactiveModules';
import type { SupportedLangCode } from '../kbridge';
import { navCopy } from '../i18n/navCopy';
import { FAQ_EMPTY } from '../i18n/faqCopy';
import { FreshnessLine } from '../components/FreshnessLine';
import { EmptyState } from '../components/ui';
import { downloadIcs } from '../share/ics';

export function BoardView({
  lang,
  posts,
  selectedId,
  onOpen,
  onClose,
}: {
  lang: SupportedLangCode;
  posts: readonly BoardPost[];
  selectedId?: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}) {
  const copy = navCopy(lang);
  const [category, setCategory] = useState<BoardCategory | 'all'>('all');
  const [region, setRegion] = useState<BoardRegion | 'all'>('all');
  const [q, setQ] = useState('');
  const rows = useMemo(() => filterBoard(posts, { category, region, q }), [posts, category, region, q]);
  const selected = selectedId ? posts.find((post) => post.id === selectedId) : undefined;

  if (selected) {
    const schedule = selected.scheduleId ? DDAY_SCHEDULES.find((item) => item.id === selected.scheduleId) : undefined;
    return (
      <article className="post">
        <button type="button" className="btn text" onClick={onClose}>
          {copy.backList}
        </button>
        <p className="kicker">
          {copy.cats[selected.category]} · {selected.region === 'all' ? copy.all : regionLabel(lang, selected.region)}
        </p>
        <h1>{selected.title}</h1>
        {lang !== 'ko' ? <p className="muted">{copy.koreanOnly}</p> : null}
        <p>{selected.body}</p>
        {selected.phone ? (
          <p>
            <a className="btn primary" dir="ltr" href={`tel:${selected.phone.replace(/[^\d+]/g, '')}`}>
              {copy.call} {selected.phone}
            </a>
          </p>
        ) : null}
        {schedule ? (
          <button type="button" className="btn text" onClick={() => downloadIcs(schedule)}>
            {copy.calendar}
          </button>
        ) : null}
        <FreshnessLine lang={lang} verifiedAt={selected.verifiedAt} sourceUrl={selected.sourceUrl || undefined} />
      </article>
    );
  }

  return (
    <div className="board">
      <header className="page-head">
        <div>
          <h1>{copy.board}</h1>
        </div>
      </header>
      <div className="filters">
        <label>
          {copy.search}
          <input value={q} onChange={(event) => setQ(event.target.value)} />
        </label>
        <label>
          {copy.category}
          <select value={category} onChange={(event) => setCategory(event.target.value as BoardCategory | 'all')}>
            <option value="all">{copy.all}</option>
            {BOARD_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {copy.cats[item]}
              </option>
            ))}
          </select>
        </label>
        <label>
          {copy.region}
          <select value={region} onChange={(event) => setRegion(event.target.value as BoardRegion | 'all')}>
            <option value="all">{copy.all}</option>
            {REGION_IDS.map((id) => (
              <option key={id} value={id}>
                {regionLabel(lang, id)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {category === 'faq' && rows.length === 0 ? <EmptyState title={FAQ_EMPTY[lang].empty} /> : null}
      {rows.length === 0 && category !== 'faq' ? <EmptyState title={copy.noPosts} /> : null}
      {rows.length > 0 ? (
        <ul className="post-list">
          {rows.map((post) => (
            <li key={post.id} className="post-row">
              <button type="button" className="post-card" onClick={() => onOpen(post.id)}>
                <span className="post-meta">
                  <span className="pill">{copy.cats[post.category]}</span>
                  <span>{post.region === 'all' ? copy.all : regionLabel(lang, post.region)}</span>
                  <span>{post.verifiedAt}</span>
                </span>
                <strong>{post.title}</strong>
                <span className="muted">{post.summary}</span>
              </button>
              {post.sourceUrl ? (
                <a className="post-source" href={post.sourceUrl} target="_blank" rel="noreferrer">
                  {copy.source}
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
