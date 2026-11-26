import type { SupportedLangCode } from '../kbridge';
import { factsFor, NO_TRACK_2027 } from '../data/multiculturalContent';
import { MULTICULTURAL_SECTIONS } from '../data/multiculturalPath';
import { MULTICULTURAL_TRACKS } from '../data/multiculturalTracks';
import { MULTICULTURAL_ROWS } from '../i18n/extraCopy';
import { REGION_COPY } from '../i18n/regionCopy';
import { easySentence } from '../i18n/shellCopy';
import { STUDENT_TYPE_COPY } from '../i18n/studentTypeCopy';
import { FreshnessLine } from './FreshnessLine';

const SECTION_TITLE: Record<(typeof MULTICULTURAL_SECTIONS)[number]['id'], keyof ReturnType<typeof sectionTitles>> = {
  'school-supports': 'school',
  'bilingual-programs': 'bilingual',
  'bilingual-careers': 'career',
  scholarships: 'scholarship',
};

function sectionTitles(lang: SupportedLangCode) {
  const titles = {
    ko: { school: '학교 지원', bilingual: '이중언어', career: '진로', scholarship: '장학금' },
    en: { school: 'School support', bilingual: 'Bilingual programs', career: 'Careers', scholarship: 'Scholarships' },
    'zh-Hans': { school: '学校支持', bilingual: '双语项目', career: '出路', scholarship: '奖学金' },
    'zh-Hant': { school: '學校支持', bilingual: '雙語項目', career: '出路', scholarship: '獎學金' },
    vi: { school: 'Hỗ trợ ở trường', bilingual: 'Chương trình song ngữ', career: 'Hướng nghiệp', scholarship: 'Học bổng' },
    ru: { school: 'Поддержка в школе', bilingual: 'Двуязычные программы', career: 'Карьера', scholarship: 'Стипендии' },
    mn: { school: 'Сургуулийн дэмжлэг', bilingual: 'Хоёр хэлний хөтөлбөр', career: 'Мэргэжил', scholarship: 'Тэтгэлэг' },
    ar: { school: 'دعم المدرسة', bilingual: 'برامج ثنائية اللغة', career: 'المسار المهني', scholarship: 'منح' },
  };
  return titles[lang];
}

export function MulticulturalPathView({ lang, easy }: { lang: SupportedLangCode; easy: boolean }) {
  const copy = STUDENT_TYPE_COPY[lang];
  const labels = REGION_COPY[lang];
  const titles = sectionTitles(lang);
  const lead = easy ? easySentence(copy.domesticLead) : copy.domesticLead;
  const withTrack = MULTICULTURAL_TRACKS.filter((track) => track.hasTrack);
  const withoutTrack = MULTICULTURAL_TRACKS.filter((track) => !track.hasTrack);

  return (
    <section className="kb-section" aria-label={copy.tracksTitle}>
      <h2 className="kb-section-title">{copy.tracksTitle}</h2>
      <p className="kb-subtitle">{labels.closed2027}</p>
      <p style={{ marginTop: 0 }}>{lead}</p>
      <div className="kb-stack">
        {withTrack.map((track) => (
          <article key={track.id} className="kb-card kb-stack" data-track-id={track.id}>
            <strong>{track.university}</strong>
            <p style={{ margin: 0 }}>{easy ? easySentence(MULTICULTURAL_ROWS[lang][track.id]) : MULTICULTURAL_ROWS[lang][track.id]}</p>
            <FreshnessLine lang={lang} verifiedAt={track.verifiedAt} sourceUrl={track.url} />
          </article>
        ))}
      </div>

      <h3 className="kb-section-title" style={{ marginTop: 16 }}>{copy.noTrackTitle}</h3>
      <ul className="kv-list">
        {withoutTrack.map((track) => (
          <li key={track.id} data-track-id={track.id}>
            <strong>{track.university}</strong>
            {' · '}
            {MULTICULTURAL_ROWS[lang][track.id]}
            {' '}
            <a className="kv-link" href={track.url} target="_blank" rel="noreferrer">2027</a>
          </li>
        ))}
        {NO_TRACK_2027.map((fact) => (
          <li key={fact.id} data-track-id={fact.id}>
            <strong>{fact.name}</strong>
            {' · '}
            {fact.text}
            {' '}
            <a className="kv-link" href={fact.sourceUrl} target="_blank" rel="noreferrer">2027</a>
          </li>
        ))}
      </ul>

      {MULTICULTURAL_SECTIONS.map((section) => {
        const facts = factsFor(section.id);
        if (facts.length === 0) return null;
        return (
          <div key={section.id} data-section-id={section.id}>
            <h3 className="kb-section-title" style={{ marginTop: 16 }}>{titles[SECTION_TITLE[section.id]]}</h3>
            {section.id === 'bilingual-programs' ? <p className="kb-subtitle">{labels.ministryNote}</p> : null}
            <div className="kb-stack">
              {facts.map((fact) => (
                <article key={fact.id} className="kb-card kb-stack" data-fact-id={fact.id}>
                  <strong>{fact.name}</strong>
                  {fact.press ? <span className="kb-tag">{labels.press}</span> : null}
                  {fact.status === 'partial' ? <span className="kb-tag">{labels.partial}</span> : null}
                  <p style={{ margin: 0 }}>{easy ? easySentence(fact.text) : fact.text}</p>
                  {fact.name.includes('레인보우') ? <p className="kb-subtitle">{labels.rainbowNote}</p> : null}
                  <FreshnessLine lang={lang} verifiedAt={fact.verifiedAt} sourceUrl={fact.sourceUrl} />
                </article>
              ))}
            </div>
          </div>
        );
      })}

      <h3 className="kb-section-title" style={{ marginTop: 16 }}>{copy.parentTitle}</h3>
      <p className="kb-subtitle">{easy ? easySentence(copy.parentLead) : copy.parentLead}</p>
    </section>
  );
}
