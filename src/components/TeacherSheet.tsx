import type { PathChoice } from '../session/pathChoice';
import { visaPath } from '../data/visaPaths';
import { monthFromDate } from '../data/freshness';
import type { SupportedLangCode } from '../kbridge';
import { FRESHNESS_COPY, easySentence } from '../i18n/shellCopy';
import { STUDENT_TYPE_COPY } from '../i18n/studentTypeCopy';
import { FreshnessLine } from './FreshnessLine';
import { SpeakButton } from './SpeakButton';

const STAGE: Record<PathChoice['stage'], string> = {
  elementary: '초등학교',
  middle: '중학교',
  high: '고등학교',
};

export function TeacherSheet({ lang, choice, easy }: { lang: SupportedLangCode; choice: PathChoice; easy: boolean }) {
  const copy = FRESHNESS_COPY[lang];
  const student = STUDENT_TYPE_COPY[lang];
  const path =
    choice.visa === '' || choice.studentType === 'domestic_multicultural' || choice.studentType === 'unsure'
      ? null
      : visaPath(choice.visa);
  const summary = path ? (easy ? easySentence(path.summary) : path.summary) : student.teacherDomestic;
  const regionName = choice.region === 'seoul' ? copy.seoul : copy.gyeonggi;
  const spoken = `${copy.regionLabel} ${regionName}. ${copy.stage} ${STAGE[choice.stage]}. ${path ? `${copy.visa} ${path.title}. ` : ''}${summary}`;

  return (
    <section className="kb-section kv-print-sheet" aria-label={copy.teacherView}>
      <div className="kb-row kv-no-print" style={{ justifyContent: 'space-between' }}>
        <h2 className="kb-section-title" style={{ margin: 0 }}>{copy.teacherView}</h2>
        <div className="kb-row">
          <SpeakButton lang="ko" text={spoken} />
          <button
            type="button"
            className="kb-chip"
            onClick={() => {
              document.body.classList.add('kv-printing-teacher');
              window.print();
              document.body.classList.remove('kv-printing-teacher');
            }}
          >
            {copy.teacherPrint}
          </button>
        </div>
      </div>
      <p className="kv-no-print">{copy.teacherLead}</p>
      <p className="kb-subtitle kv-no-print">{copy.privacy}</p>
      <div className="kv-print-columns">
        <article className="kb-card kb-stack">
          <strong>한국어</strong>
          <p style={{ margin: 0 }}>{copy.regionLabel}: {choice.region === 'seoul' ? '서울' : '경기'}</p>
          <p style={{ margin: 0 }}>학교급: {STAGE[choice.stage]}</p>
          {path ? <p style={{ margin: 0 }}>체류자격: {path.title}</p> : <p style={{ margin: 0 }}>{student.teacherDomestic}</p>}
          <p style={{ margin: 0 }}>{summary}</p>
          {path ? <FreshnessLine lang="ko" verifiedAt={monthFromDate(path.verifiedOn)} sourceUrl={path.sourceUrl} /> : null}
        </article>
        <article className="kb-card kb-stack" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <strong>{copy.teacherView}</strong>
          <p style={{ margin: 0 }}>{copy.regionLabel}: {regionName}</p>
          <p style={{ margin: 0 }}>{copy.stage}: {STAGE[choice.stage]}</p>
          {path ? <p style={{ margin: 0 }}>{copy.visa}: {path.title}</p> : null}
          <p style={{ margin: 0 }}>{easy ? copy.easyVisaLead : summary}</p>
          <p className="kb-subtitle" style={{ margin: 0 }}>{copy.privacy}</p>
        </article>
      </div>
    </section>
  );
}
