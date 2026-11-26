import { useEffect, useState } from 'react';
import {
  SpeakCard,
  recordAnonymousEvent,
  type SupportedLangCode,
} from '../kbridge';
import {
  ADMISSION_TERMS,
  APOSTILLE_COUNTRIES,
  EXTERNAL_SCHOLARSHIPS,
  UNIVERSITY_GED_RULES,
  UNIVERSITY_SCHOLARSHIP_RULES,
  UNIVERSITY_TOPIK_TABLE,
  VISA_SKILL_TREE,
  type BackgroundType,
  type InterestField,
  type KoreanLevel,
  type SchoolLevel,
  type UniversityId,
} from '../data/admissionsData';
import { SEOUL_DISTRICTS, SEOUL_SUPPORT_CENTERS } from '../data/centersData';
import { HELP_LINKS } from '../data/helpLinks';
import { OFFICIAL_FORMS, proceduresFor } from '../data/procedures';
import { filterAdmissionTracks, filterVocationalSchools } from '../data/trackFilter';
import { EASY_VISA_PATHS, optionsForVisa, VISA_PATHS, type ProcedureLevel, type VisaCode } from '../data/visaPaths';
import { getCoreCopy } from '../i18n/coreCopy';
import { LANGUAGE_SUPPORT_LEAD, MULTICULTURAL_NOTE, MULTICULTURAL_ROWS, PROCEDURE_COPY, SUPPORT_LANGUAGE } from '../i18n/extraCopy';
import { MULTICULTURAL_TRACKS } from '../data/multiculturalTracks';
import { gapUi } from '../i18n/gapUi';
import { scholarshipTerm, topikHeads, universityCell } from '../i18n/tableCopy';
import { getUiMessages } from '../i18n/messages';
import { easySentence } from '../i18n/shellCopy';
import { pageLink, shareOrCopy } from '../share/parentShare';
import type { PathChoice } from '../session/pathChoice';
import type { RegionId } from '../data/freshness';
import type { StudentType } from '../data/studentType';
import { FreshnessLine } from './FreshnessLine';
import { isNationwideRegion } from '../data/nationwideRegions';
import { GyeonggiGuide } from './GyeonggiGuide';
import { RegionFacts } from './RegionFacts';
import { MulticulturalPathView } from './MulticulturalPath';
import { SpeakButton } from './SpeakButton';
import { loadVocationalSnapshot } from '../services/neisClient';

export interface AdmissionsTabProps {
  lang: SupportedLangCode;
  studentType: StudentType;
  region: RegionId;
  easy: boolean;
  onEventLogged: () => void;
  onChoice: (choice: PathChoice) => void;
}

const BACKGROUND_OPTIONS: { value: BackgroundType; label: string }[] = [
  { value: 'both_foreign', label: '부모 모두 외국인' },
  { value: 'multicultural', label: '국제결혼·다문화' },
  { value: 'mid_entry', label: '중도입국(해외 수학)' },
  { value: 'undocumented', label: '미등록·체류 미확인' },
];

const KOREAN_OPTIONS: { value: KoreanLevel; label: string }[] = [
  { value: 'beginner', label: '초급·TOPIK 미보유' },
  { value: 'topik_3_4', label: '중급(TOPIK 3~4급)' },
  { value: 'topik_5_6', label: '고급(TOPIK 5~6급)' },
];

const FIELD_OPTIONS: { value: InterestField; label: string }[] = [
  { value: 'it', label: 'IT·SW' },
  { value: 'culinary', label: '조리·관광' },
  { value: 'design', label: '디자인' },
  { value: 'business', label: '경영·무역' },
  { value: 'health', label: '보건·간호' },
];

export function AdmissionsTab({ lang, studentType, region, easy, onEventLogged, onChoice }: AdmissionsTabProps) {
  const [stage, setStage] = useState<ProcedureLevel>('high');
  const [visa, setVisa] = useState<VisaCode>('F-1');
  const [background, setBackground] = useState<BackgroundType>('both_foreign');
  const [koreanLevel, setKoreanLevel] = useState<KoreanLevel>('topik_3_4');
  const [field, setField] = useState<InterestField>('it');
  const [district, setDistrict] = useState<string>(SEOUL_DISTRICTS[0]);
  const [originCountry, setOriginCountry] = useState<string>('VN');
  const [schoolSearch, setSchoolSearch] = useState<string>('');
  const [shareNote, setShareNote] = useState<string | null>(null);

  const [activeTermId, setActiveTermId] = useState<string | null>(null);
  const [referralFeedback, setReferralFeedback] = useState<string | null>(null);
  const snapshot = loadVocationalSnapshot();
  const copy = getCoreCopy(lang);
  const gap = gapUi(lang);
  const schoolLevel: SchoolLevel = stage === 'elementary' ? 'middle' : stage;
  const trackResult =
    stage === 'elementary' ? { matched: [], gaps: [] } : filterAdmissionTracks(schoolLevel, background, koreanLevel);
  const matchedTracks = trackResult.matched;
  const gapTracks = trackResult.gaps;
  const visaCards = optionsForVisa(visa, stage);
  const filteredVocationalSchools = filterVocationalSchools(field, schoolSearch);
  const query = schoolSearch.trim().toLowerCase();

  const filteredUniversities = UNIVERSITY_TOPIK_TABLE.filter(
    (u) =>
      !query ||
      u.university.toLowerCase().includes(query) ||
      u.note.toLowerCase().includes(query) ||
      u.vocationalTrack.toLowerCase().includes(query),
  );

  const matchedScholarships = EXTERNAL_SCHOLARSHIPS.filter((s) =>
    s.eligibleBackgrounds.includes(background),
  );

  const visaTree = VISA_SKILL_TREE[background];
  const center = SEOUL_SUPPORT_CENTERS.find((c) => c.district === district) ?? SEOUL_SUPPORT_CENTERS[0];
  const apostilleRule = APOSTILLE_COUNTRIES.find((c) => c.code === originCountry) ?? APOSTILLE_COUNTRIES[0];

  const handleTermHelpClick = (termId: string) => {
    setActiveTermId(termId);
    recordAnonymousEvent('kvisa-path.events', {
      app: 'kvisa-path',
      opportunityId: `admission-${schoolLevel}-2026`,
      kind: 'term_confused',
      lang,
      choiceCode: termId,
    });
    onEventLogged();
  };

  const handleReferralStep = (kind: 'referral_opened' | 'referral_connected' | 'referral_failed', msg: string) => {
    recordAnonymousEvent('kvisa-path.events', {
      app: 'kvisa-path',
      opportunityId: 'referral',
      kind,
      lang,
      choiceCode: district,
    });
    setReferralFeedback(msg);
    onEventLogged();
  };

  const activeTerm = activeTermId ? ADMISSION_TERMS[activeTermId] : null;
  const activeTermTranslation = activeTerm
    ? activeTerm.translations[lang] ?? activeTerm.translations.en ?? ''
    : '';
  const ui = getUiMessages(lang);
  const hideVisa = studentType === 'domestic_multicultural' || studentType === 'unsure';
  const showMulticultural = studentType === 'domestic_multicultural' || studentType === 'unsure';

  useEffect(() => {
    onChoice({
      region,
      stage,
      background,
      visa: hideVisa ? '' : visa,
      koreanLevel,
      field,
      studentType,
    });
  }, [onChoice, stage, background, visa, koreanLevel, field, studentType, hideVisa, region]);

  return (
    <div className="kb-stack">
      <div className="kv-notice-box kb-row" style={{ justifyContent: 'space-between' }} role="note">
        <span>
          <strong>{ui.statelessNoticeTitle}</strong> {ui.statelessNoticeBody}
        </span>
        <button
          type="button"
          className="kv-term-btn kv-no-print"
          onClick={() => {
            if (typeof window !== 'undefined') window.print();
          }}
        >
          {ui.printSummaryBtn}
        </button>
      </div>

      {/* 1. 조건 선택 */}
      <section className="kb-section" style={{ marginTop: 12 }}>
        <h2 className="kb-section-title">{copy?.conditionsTitle ?? '1. 내 조건 선택하기'}</h2>
        <div className="kb-card kb-stack">
          <div>
            <span className="kv-label">
              {lang === 'ko'
                ? '현재 학교급'
                : lang === 'zh-Hans'
                  ? '现在的学校阶段'
                  : lang === 'zh-Hant'
                    ? '現在的學校階段'
                    : lang === 'vi'
                      ? 'Cấp học hiện tại'
                      : lang === 'ru'
                        ? 'Ступень школы'
                        : lang === 'mn'
                          ? 'Одоогийн сургууль'
                          : lang === 'ar'
                            ? 'المرحلة الحالية'
                            : 'School level'}
            </span>
            <div className="kb-row">
              <button type="button" className="kb-chip" aria-pressed={stage === 'elementary'} onClick={() => setStage('elementary')}>
                {gap.elementary}
              </button>
              <button type="button" className="kb-chip" aria-pressed={stage === 'middle'} onClick={() => setStage('middle')}>
                {copy?.levelMiddle ?? '중학생 (고교 입학전형)'}
              </button>
              <button type="button" className="kb-chip" aria-pressed={stage === 'high'} onClick={() => setStage('high')}>
                {copy?.levelHigh ?? '고등학생 (대학 입학전형 · TOPIK 장학)'}
              </button>
            </div>
            {region === 'gyeonggi' ? <GyeonggiGuide lang={lang} /> : isNationwideRegion(region) ? <RegionFacts lang={lang} region={region} /> : null}
          </div>

          {hideVisa ? null : <>
          <div>
            <span className="kv-label">{gap.easyPath}</span>
            <div className="kb-row">
              {BACKGROUND_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="kb-chip"
                  aria-pressed={background === opt.value}
                  onClick={() => {
                    setBackground(opt.value);
                    setVisa(EASY_VISA_PATHS[opt.value][0]);
                  }}
                >
                  {copy?.backgrounds[opt.value] ?? opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="kv-label">{gap.visaPicker}</span>
            <p className="kb-subtitle" style={{ marginTop: 0 }}>{gap.visaPrivate}</p>
            <div className="kb-row">
              {VISA_PATHS.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className="kb-chip"
                  aria-pressed={visa === item.code}
                  onClick={() => {
                    setVisa(item.code);
                    if (item.code === 'undocumented' || item.code === 'G-1') setBackground('undocumented');
                    else if (item.code === 'F-6') setBackground('multicultural');
                  }}
                >
                  {item.code}
                </button>
              ))}
            </div>
          </div>
          </>}

          <div>
            <span className="kv-label">{copy?.koreanHeading ?? '한국어 수준'}</span>
            <div className="kb-row">
              {KOREAN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="kb-chip"
                  aria-pressed={koreanLevel === opt.value}
                  onClick={() => setKoreanLevel(opt.value)}
                >
                  {copy?.koreanLevels[opt.value] ?? opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="kv-label">{copy?.fieldHeading ?? '관심 계열'}</span>
            <div className="kb-row">
              {FIELD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="kb-chip"
                  aria-pressed={field === opt.value}
                  onClick={() => setField(opt.value)}
                >
                  {copy?.fields[opt.value] ?? opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showMulticultural ? <MulticulturalPathView lang={lang} easy={easy} /> : null}

      {/* Pre-flight 치명적 함정 경고 */}
      {hideVisa ? null : (background === 'both_foreign' || background === 'mid_entry') ? (
        <div className="kb-card" style={{ borderColor: 'var(--kb-avoid)' }} role="alert">
          <div className="kb-row" style={{ justifyContent: 'space-between' }}>
            <strong style={{ color: 'var(--kb-avoid)' }}>{copy?.warningTitle ?? '사전 경고: 입시·비자 3대 함정 체크'}</strong>
            <span className="kb-tag kb-status-avoid">필독</span>
          </div>
          <ul className="kv-list">
            {(copy?.warnings ?? [
              '검정고시 함정: 외국 국적 학생이 검정고시를 선택하면 이 앱의 대학 표에 있는 순수외국인 전형은 받지 않아요. 숭실대 2027학년도 1학기 요강만 원문으로 확인했습니다.',
              '마이스터고 졸업생은 대입 정원 외 특성화고 졸업자 특별전형에 지원할 수 없어요.',
              'F-1·F-3·D-4-3 고교생은 아르바이트가 원칙적으로 금지돼요. 등록금은 대학 공식 계좌로 내세요.',
            ]).map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {hideVisa ? null : <section className="kb-section">
        <h2 className="kb-section-title">{gap.procedures}</h2>
        <div className="kb-stack">
          {visaCards.map((item) => (
            <article key={item.code} className="kb-card kb-stack">
              <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                <strong>{item.code} · {item.title}</strong>
                <span className={`kb-tag ${item.verification === 'verified' ? 'kb-status-safe' : 'kb-status-check'}`}>
                  {item.verification === 'verified' ? (copy?.verified ?? '확인') : (copy?.unverified ?? '미확인')}
                </span>
              </div>
              <p style={{ margin: 0 }}>{easy ? easySentence(item.summary) : item.summary}</p>
              <FreshnessLine lang={lang} verifiedAt={item.verifiedAt} sourceUrl={item.sourceUrl} />
              <SpeakButton lang={lang} text={easy ? easySentence(item.summary) : item.summary} />
              <ul className="kv-list">
                {item.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              {item.sourceUrl ? (
                <a className="kv-link" href={item.sourceUrl} target="_blank" rel="noreferrer">
                  {item.sourceLabel} · {item.verifiedOn}
                </a>
              ) : (
                <p className="kb-subtitle" style={{ margin: 0 }}>{item.unverifiedReason}</p>
              )}
            </article>
          ))}
          {proceduresFor(stage).map((step) => {
            const translated = lang === 'ko' ? null : PROCEDURE_COPY[lang][step.id];
            return (
            <article key={step.id} className="kb-card kb-stack">
              <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                <strong>{translated?.title ?? step.title}</strong>
                <span className={`kb-tag ${step.verification === 'verified' ? 'kb-status-safe' : 'kb-status-check'}`}>
                  {step.verification === 'verified' ? (copy?.verified ?? '확인') : (copy?.unverified ?? '미확인')}
                </span>
              </div>
              <p style={{ margin: 0 }}>{easy ? easySentence(translated?.body ?? step.body) : (translated?.body ?? step.body)}</p>
              <FreshnessLine lang={lang} verifiedAt={step.verifiedAt} sourceUrl={step.sourceUrl} />
              <a className="kv-link" href={step.sourceUrl} target="_blank" rel="noreferrer">
                {step.sourceLabel} · {step.verifiedOn}
              </a>
            </article>
            );
          })}
          <article className="kb-card kb-stack">
            <strong>{gap.forms}</strong>
            {OFFICIAL_FORMS.map((form) => (
              <p key={form.id} style={{ margin: 0 }}>
                <a className="kv-link" href={form.url} target="_blank" rel="noreferrer">{form.title}</a>
                {' — '}
                {form.note}
              </p>
            ))}
            <button
              type="button"
              className="kb-chip"
              onClick={() => {
                const text = `${visaCards[0]?.title ?? ''}\n${visaCards[0]?.summary ?? ''}\n${pageLink()}`;
                void shareOrCopy(text).then((result) => setShareNote(result));
              }}
            >
              {gap.shareParents}
            </button>
            {shareNote ? <p className="kb-subtitle" style={{ margin: 0 }}>{shareNote}</p> : null}
          </article>
        </div>
      </section>}

      {/* 2. 지원 가능 입학전형 조회 결과 + Gap 진단 */}
      {hideVisa ? null : <section className="kb-section">
        <h2 className="kb-section-title">
          {copy?.matchedTitle ?? '2. 지원 가능한 전형'} ({matchedTracks.length})
        </h2>

        {matchedTracks.length > 0 ? (
          <div className="kb-stack">
            {matchedTracks.map((track) => {
              const shown = copy?.tracks[track.id];
              return (
              <article key={track.id} className="kb-card kb-stack">
                <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: 16 }}>{shown?.title ?? track.title}</strong>
                  <span className="kb-tag">
                    {track.quotaType} · {track.asOfYear}
                  </span>
                </div>
                <p style={{ margin: 0 }}>{shown?.summary ?? track.summary}</p>
                <p className="kb-subtitle" style={{ margin: 0 }}>
                  {copy?.legalLead ?? '근거'}: {track.legalBasis}
                  {track.verification === 'unverified' ? ` · ${copy?.unverified ?? '미확인'}` : ''}
                </p>

                <div className="kv-grid-2">
                  <div className="kb-card-soft">
                    <strong style={{ fontSize: 13 }}>{copy?.requirementsLabel ?? '주요 지원 자격'}</strong>
                    <ul className="kv-list">
                      {(shown?.requirements ?? track.requirements).map((req) => (
                        <li key={req}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="kb-card-soft">
                    <strong style={{ fontSize: 13 }}>{copy?.docsLabel ?? '필요 서류 체크리스트'}</strong>
                    <ul className="kv-list">
                      {(shown?.requiredDocs ?? track.requiredDocs).map((doc) => (
                        <li key={doc}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <span className="kv-label">{copy?.termHint ?? '이해가 어려운 입시 용어를 눌러 보세요. 용어 코드만 이 기기에 남아요.'}</span>
                  <div className="kb-row">
                    {track.termIds.map((tid) => {
                      const t = ADMISSION_TERMS[tid];
                      if (!t) return null;
                      return (
                        <button
                          key={tid}
                          type="button"
                          className="kv-term-btn"
                          aria-pressed={activeTermId === tid}
                          onClick={() => handleTermHelpClick(tid)}
                        >
                          ? {t.term}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                  <span className="kb-subtitle" style={{ margin: 0 }}>
                    {shown?.visaNote ?? track.visaNote}
                  </span>
                  {track.referenceUrl ? (
                    <a className="kv-link" href={track.referenceUrl} target="_blank" rel="noreferrer">
                      {track.referenceLabel}
                    </a>
                  ) : (
                    <span className="kb-subtitle">{copy?.sourceMissing ?? track.referenceLabel}</span>
                  )}
                </div>
              </article>
            );
            })}
          </div>
        ) : null}

        {gapTracks.length > 0 ? (
          <div className="kb-stack" style={{ marginTop: 12 }}>
            {gapTracks.map((track) => (
              <div key={track.id} className="kb-card-soft kb-stack">
                <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                  <strong>{copy?.tracks[track.id]?.title ?? track.title}</strong>
                  <span className="kb-tag kb-status-check">{copy?.gapBadge ?? '조건 보완 시 지원 가능'}</span>
                </div>
                <p style={{ margin: 0, fontSize: 14 }}>
                  <strong>{copy?.gapLead ?? '부족한 조건:'}</strong> {copy?.tracks[track.id]?.gapHint ?? track.gapHint}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {activeTerm ? (
          <div className="kb-card-soft kb-stack" style={{ marginTop: 12 }} role="status">
            <div className="kb-row" style={{ justifyContent: 'space-between' }}>
              <strong>{activeTerm.term}</strong>
              <span className="kb-tag">주제: {activeTerm.cluster}</span>
            </div>
            <p style={{ margin: 0 }}>{activeTerm.easyKo}</p>
            {activeTermTranslation ? (
              <p className="kb-subtitle" style={{ margin: 0 }}>
                {activeTermTranslation}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>}

      {/* 3. 서울 특성화고 12개교 / 주요 대학 12개교 TOPIK 장학금 비교 + 검색 */}
      {(region === 'gyeonggi' && schoolLevel !== 'high') || (hideVisa && schoolLevel === 'high') ? null : <section className="kb-section">
        <h2 className="kb-section-title">
          {schoolLevel === 'middle'
            ? (copy?.schoolsTitle ?? '3. 서울 특성화고·마이스터고')
            : (copy?.universitiesTitle ?? '3. 서울 주요 대학 TOPIK 장학금')}
        </h2>
        {schoolLevel === 'high' ? (
          <div className="kb-card kb-stack" style={{ marginBottom: 12 }}>
            <p style={{ margin: 0 }}>{MULTICULTURAL_NOTE[lang]}</p>
            {MULTICULTURAL_TRACKS.map((track) => (
              <p key={track.id} style={{ margin: 0, fontSize: 14 }}>
                <strong>{track.university}</strong>
                {' · '}
                {MULTICULTURAL_ROWS[lang][track.id]}
                {' '}
                <a className="kv-link" href={track.url} target="_blank" rel="noreferrer">2027</a>
              </p>
            ))}
          </div>
        ) : null}

        <div style={{ marginBottom: 12 }}>
            <label htmlFor="school-search-input" className="kv-label">
            {copy?.searchLabel ?? '학교명 · 학과 · 키워드 검색'}
          </label>
          <input
            id="school-search-input"
            type="text"
            className="kv-input"
            value={schoolSearch}
            onChange={(e) => setSchoolSearch(e.target.value)}
            placeholder={
              schoolLevel === 'middle'
                ? (copy?.searchMiddle ?? '예: 성암국제무역, 관광, 소프트웨어')
                : (copy?.searchHigh ?? '예: 숭실대, TOPIK')
            }
          />
        </div>

        {schoolLevel === 'middle' ? (
          <div className="kb-stack">
            <p className="kb-subtitle" style={{ margin: 0 }}>
              {snapshot.notice} ({snapshot.asOf})
            </p>
            <div className="kv-grid-2">
              {filteredVocationalSchools.map((s) => (
                <div key={s.neisCode} className="kb-card">
                  <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                    <strong>{s.name}</strong>
                    <span className={`kb-tag ${s.univSpecialEligible ? 'kb-status-safe' : 'kb-status-avoid'}`}>
                      {s.schoolType} · {s.district}
                    </span>
                  </div>
                  <p className="kb-subtitle">{s.specialTrack}</p>
                  <p style={{ margin: '8px 0 0', fontSize: 14 }}>{copy?.majorsLead ?? '대표 학과'}: {s.majors.join(', ')}</p>
                  <p className="kb-subtitle" style={{ margin: '4px 0 0' }}>NEIS {s.neisCode}</p>
                  <FreshnessLine lang={lang} verifiedAt={s.verifiedAt} sourceUrl={s.sourceUrl} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="kb-stack">
            <div className="kb-card kv-table-wrap">
              <table className="kv-table">
                <thead>
                  <tr>
                    <th>{gap.tableUniversity}</th>
                    <th>{copy?.gedHead ?? '검정고시'}</th>
                    <th className="num">{gap.topik3}</th>
                    <th className="num">{topikHeads(lang).t4}</th>
                    <th className="num">{topikHeads(lang).t5}</th>
                    <th className="num">{topikHeads(lang).t6}</th>
                    <th>{gap.tableRest}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUniversities.map((u) => {
                    const cell = universityCell(lang, u.id as UniversityId);
                    return (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.university}</strong>
                        <div className="kb-subtitle" style={{ margin: 0 }}>
                          {UNIVERSITY_SCHOLARSHIP_RULES[u.id as UniversityId].verification === 'verified'
                            ? (copy?.verified ?? '확인')
                            : (copy?.unverified ?? '미확인')}
                          {' · '}
                          {scholarshipTerm(lang, UNIVERSITY_SCHOLARSHIP_RULES[u.id as UniversityId].applicableTerm)}
                        </div>
                      </td>
                      <td>
                        <span className={`kb-tag ${u.gedAccepted === '불인정' ? 'kb-status-avoid' : ''}`}>
                          {cell.ged}
                        </span>
                        <div className="kb-subtitle" style={{ margin: 0 }}>
                          {UNIVERSITY_GED_RULES[u.id as UniversityId].verification === 'verified'
                            ? (copy?.verified ?? '확인')
                            : (copy?.unverified ?? '미확인')}
                        </div>
                      </td>
                      <td className="num">{u.topik3}</td>
                      <td className="num">{u.topik4}</td>
                      <td className="num">
                        <strong>{u.topik5}</strong>
                      </td>
                      <td className="num">
                        <strong>{u.topik6}</strong>
                      </td>
                      <td style={{ fontSize: 13 }}>
                        {cell.track} · {cell.note}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="kb-card kb-stack">
              <strong style={{ fontSize: 14 }}>
                {copy?.scholarshipTitle ?? '내 배경 맞춤 외부 장학금'} ({copy?.backgrounds[background] ?? BACKGROUND_OPTIONS.find((b) => b.value === background)?.label})
              </strong>
              {matchedScholarships.length === 0 ? (
                <p className="kb-subtitle" style={{ margin: 0 }}>
                  {copy?.noScholarship ?? '미등록 상태에서는 먼저 지원 경로를 확인한 뒤 장학금 자격을 보세요.'}
                </p>
              ) : (
                <div className="kv-grid-2">
                  {matchedScholarships.map((sc) => (
                    <div key={sc.id} className="kb-card-soft">
                      <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                        <strong>{copy?.scholarships[sc.id]?.name ?? sc.name}</strong>
                        <span className={`kb-tag ${sc.verification === 'verified' ? 'kb-status-safe' : 'kb-status-check'}`}>
                          {sc.verification === 'verified' ? (copy?.verified ?? '확인') : (copy?.unverified ?? '미확인')}
                        </span>
                      </div>
                      <p style={{ margin: '6px 0 0', fontSize: 14 }}>{copy?.scholarships[sc.id]?.benefit ?? sc.benefit}</p>
                      <p className="kb-subtitle" style={{ margin: '4px 0 0' }}>
                        {copy?.applies ?? '적용'}: {sc.applicableTerm}
                      </p>
                      <p className="kb-subtitle" style={{ margin: '4px 0 0' }}>
                        {copy?.scholarships[sc.id]?.excludeRule ?? sc.excludeRule}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>}

      {/* 4. 출신국 해외 서류 인증 (2026.9 아포스티유 vs 영사확인 자동 분기) */}
      {hideVisa ? null : <section className="kb-section">
        <h2 className="kb-section-title">{copy?.apostilleTitle ?? '4. 해외 학력 서류 인증'}</h2>
        <div className="kb-card kb-stack">
          <div className="kb-row">
            {APOSTILLE_COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                className="kv-term-btn"
                aria-pressed={originCountry === c.code}
                onClick={() => setOriginCountry(c.code)}
              >
                {copy?.countries[c.code]?.name ?? c.name}
              </button>
            ))}
          </div>
          <div className="kb-card-soft">
            <div className="kb-row" style={{ justifyContent: 'space-between' }}>
              <strong>{copy?.countries[apostilleRule.code]?.name ?? apostilleRule.name}</strong>
              <span
                className={`kb-tag ${
                  apostilleRule.status === 'apostille'
                    ? 'kb-status-safe'
                    : apostilleRule.status === 'transition'
                      ? 'kb-status-check'
                      : 'kb-status-avoid'
                }`}
              >
                {copy?.apostilleStatus[apostilleRule.status] ??
                  (apostilleRule.status === 'apostille'
                    ? '아포스티유 적용'
                    : apostilleRule.status === 'transition'
                      ? '전환기 (제출일 확인)'
                      : '영사확인 필수')}
                {' · '}
                {apostilleRule.effectiveDate}
              </span>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 14 }}>{copy?.countries[apostilleRule.code]?.guide ?? apostilleRule.guide}</p>
          </div>
        </div>
      </section>}

      {/* 5. 체류자격·진로 스킬트리 */}
      {hideVisa ? null : <section className="kb-section">
        <h2 className="kb-section-title">5. {copy?.visa[background]?.title ?? visaTree.title}</h2>
        <p className="kb-subtitle" style={{ marginBottom: 12 }}>
          {copy?.visa[background]?.warning ?? visaTree.warning}
        </p>
        <div className="kv-grid-2">
          {visaTree.nodes.map((node, idx) => {
            const shown = copy?.visa[background]?.nodes[idx];
            return (
            <div key={node.code} className="kb-card">
              <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                <span className="kb-tag">
                  {idx + 1}. {shown?.stage ?? node.stage}
                </span>
                <strong>{node.code}</strong>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 14 }}>{shown?.desc ?? node.desc}</p>
            </div>
            );
          })}
        </div>
      </section>}

      {/* 6. 자치구 가족센터 통역·상담 연결 + 4단계 퍼널 기록 */}
      {region === 'seoul' ? <section className="kb-section">
        <h2 className="kb-section-title">{copy?.referralTitle ?? '6. 우리 구 무료 진로·입시 통역 상담'}</h2>
        <div className="kb-card kb-stack" style={{ marginBottom: 12 }}>
          <strong>{copy?.helpTitle ?? '공식 도움 창구'}</strong>
          <p className="kb-subtitle" style={{ margin: 0 }}>{copy?.helpLead ?? '아래 링크는 2026-11-26에 열어서 확인했습니다.'}</p>
          <ul className="kv-list">
            {HELP_LINKS.map((link) => (
              <li key={link.id}>
                <a className="kv-link" href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
                {' — '}
                {link.detail}
              </li>
            ))}
          </ul>
          <p className="kb-subtitle" style={{ margin: 0 }}>{copy?.centerSnapshot ?? '구별 전화·통역 인원은 이전 스냅샷이에요.'}</p>
        </div>
        <div className="kb-row" style={{ marginBottom: 12 }}>
          {SEOUL_DISTRICTS.map((d) => (
            <button
              key={d}
              type="button"
              className="kb-chip"
              aria-pressed={district === d}
              onClick={() => {
                setDistrict(d);
                setReferralFeedback(null);
              }}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="kb-card kb-stack">
          <div className="kb-row" style={{ justifyContent: 'space-between' }}>
            <strong>{center.name}</strong>
            <span className="kb-tag">{center.asOfDate}</span>
          </div>
          <p style={{ margin: 0, fontSize: 14 }}>
            {center.phone ? (
              <a className="kv-link" href={`tel:${center.phone.replaceAll('-', '')}`}>{gap.call}: {center.phone}</a>
            ) : (
              <span>{copy?.unverified ?? '미확인'}</span>
            )}
            {' · '}
            <a className="kv-link" href="https://liveinkorea.kr/centerIntro/centerNearListViewHtml.do" target="_blank" rel="noreferrer">{gap.centerSite}</a>
            {' · '}
            {center.hours}
            {center.phoneVerifiedOn ? ` · ${center.phoneVerifiedOn}` : ` · ${copy?.unverified ?? '미확인'}`}
            {center.phoneUnverifiedReason ? ` · ${center.phoneUnverifiedReason}` : ''}
          </p>
          <p className="kb-subtitle" style={{ margin: 0 }}>
            진로 프로그램: {center.freeCareerProgram}
          </p>
          <p className="kb-subtitle" style={{ margin: 0 }}>
            {center.languageSupport && center.languageSupport.length > 0
              ? `${LANGUAGE_SUPPORT_LEAD[lang]} ${center.languageSupport.map((code) => SUPPORT_LANGUAGE[lang][code]).join(' · ')}`
              : (copy?.interpreterMissing ?? '이 센터의 언어 지원은 이번 점검에서 확인하지 못했습니다.')}
          </p>

          <div className="kb-row kv-no-print">
            <button
              type="button"
              className="kb-chip"
              onClick={() => handleReferralStep('referral_opened', `${district} 상담 안내 열람을 익명으로 기록했어요.`)}
            >
              상담 필요 표시
            </button>
            <button
              type="button"
              className="kb-chip"
              onClick={() => handleReferralStep('referral_connected', `${district} 7일 내 상담 연결 완료를 기록했어요.`)}
            >
              상담 연결됨
            </button>
            <button
              type="button"
              className="kb-chip"
              onClick={() =>
                handleReferralStep('referral_failed', `${district} 연결 실패(시간·통역 부족)를 교육청 지표에 반영했어요.`)
              }
            >
              연결 안 됨 보고
            </button>
          </div>
          {referralFeedback ? <p className="kb-subtitle" style={{ margin: 0 }}>{referralFeedback}</p> : null}
        </div>
      </section> : null}

      {/* 7. 진로상담실 소통 카드 */}
      <section className="kb-section">
        <h2 className="kb-section-title">{copy?.speakTitle ?? '7. 진로상담 선생님께 보여 주는 카드'}</h2>
        <SpeakCard
          caption={ui.speakCardCaption}
          koreanText="제가 지원할 수 있는 고입·대입 특별전형과 필요한 해외 서류 목록을 쉬운 한국어로 알려 주세요."
          nativeText={ui.speakCardNative}
        />
      </section>

      <footer className="kb-subtitle" style={{ marginTop: 12 }}>
        {copy?.disclaimer ??
          '입학전형·장학금·체류 규정은 바뀔 수 있어요. 접수 전에 대학 요강과 하이코리아를 다시 확인하세요. 미확인으로 표시된 내용은 이번 점검에서 원문을 확인하지 못했습니다.'}
      </footer>
    </div>
  );
}
