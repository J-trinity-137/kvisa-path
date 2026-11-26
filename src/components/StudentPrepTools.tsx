import { useEffect, useState } from 'react';
import { recordAnonymousEvent, type SupportedLangCode } from '../kbridge';
import type { InterestField } from '../data/admissionsData';
import {
  ADMISSION_QUIZ_ITEMS,
  CAREER_RECOMMENDATIONS,
  DDAY_SCHEDULES,
  DOC_BARRIER_LABELS,
  DOC_CHECKLIST_ITEMS,
  buildQuestionLog,
  classifyQuestionTopic,
  daysUntil,
  schedulePhase,
  type DocBarrierReason,
} from '../data/interactiveModules';
import { getCoreCopy } from '../i18n/coreCopy';
import { gapUi } from '../i18n/gapUi';
import { workStageLabel } from '../i18n/workLabels';
import { getUiMessages } from '../i18n/messages';
import { DOCS_STORAGE_KEY, QUIZ_STORAGE_KEY, RECORDS_CLEARED_EVENT, clearMyRecords } from '../privacy/records';
import { downloadIcs } from '../share/ics';
import { WORK_HOUR_SOURCE, partTimeHours, type WorkStage } from '../data/workHours';

export interface StudentPrepToolsProps {
  lang: SupportedLangCode;
  onEventLogged: () => void;
}

const FIELD_BUTTONS: { value: InterestField; label: string }[] = [
  { value: 'it', label: 'IT·SW' },
  { value: 'culinary', label: '조리·관광' },
  { value: 'design', label: '디자인' },
  { value: 'business', label: '경영·통상' },
  { value: 'health', label: '보건·간호' },
];

export function StudentPrepTools({ lang, onEventLogged }: StudentPrepToolsProps) {
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const copy = getCoreCopy(lang);
  const ui = getUiMessages(lang);
  const gap = gapUi(lang);

  // 1. 서류 체크리스트 상태 (기기 영구 저장)
  const [doneDocs, setDoneDocs] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(DOCS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [barrierDocId, setBarrierDocId] = useState<string | null>(null);
  const [docNotice, setDocNotice] = useState<string | null>(null);

  // 2. 1분 O/X 퀴즈 상태 (기기 영구 저장)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, 'O' | 'X'>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, 'O' | 'X'>) : {};
    } catch {
      return {};
    }
  });

  // 3. 1줄 비정형 질문함 상태
  const [questionText, setQuestionText] = useState('');
  const [questionResult, setQuestionResult] = useState<{ topic: string; answer: string } | null>(null);

  useEffect(() => {
    const reset = () => {
      setDoneDocs([]);
      setQuizAnswers({});
      setQuestionResult(null);
      setQuestionText('');
    };
    window.addEventListener(RECORDS_CLEARED_EVENT, reset);
    return () => window.removeEventListener(RECORDS_CLEARED_EVENT, reset);
  }, []);

  // 4. 커리어넷 계열 탐색 상태
  const [careerField, setCareerField] = useState<InterestField>('it');

  // 5. TOPIK 유효기간(2년) & 합법 알바 허용시간 계산기 상태
  const [topikDate, setTopikDate] = useState<string>('2025-05-29');
  const [studentStage, setStudentStage] = useState<WorkStage>('d2_ba_12');
  const [meetsTopikReq, setMeetsTopikReq] = useState<boolean>(true);
  const [hasBonusReq, setHasBonusReq] = useState<boolean>(false);

  const computeTopikValidity = () => {
    const issued = new Date(`${topikDate}T00:00:00`);
    if (Number.isNaN(issued.getTime())) return null;
    const expiry = new Date(issued);
    expiry.setFullYear(expiry.getFullYear() + 2);
    const todayDate = new Date(`${today}T00:00:00`);
    const diffDays = Math.ceil((expiry.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
    return {
      expiryStr: expiry.toISOString().slice(0, 10),
      diffDays,
      isValid: diffDays >= 0,
    };
  };

  const computePartTimeHours = () => partTimeHours(studentStage, meetsTopikReq, hasBonusReq);

  const topikValidity = computeTopikValidity();
  const partTimeInfo = computePartTimeHours();

  const toggleDocDone = (docId: string) => {
    setDoneDocs((prev) => {
      const next = prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId];
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(next));
      }
      if (!prev.includes(docId)) {
        recordAnonymousEvent('kvisa-path.events', {
          app: 'kvisa-path',
          opportunityId: `doc-${docId}`,
          kind: 'doc_completed',
          lang,
          choiceCode: docId,
        });
        onEventLogged();
      }
      return next;
    });
  };

  const handleReportBarrier = (docId: string, reason: DocBarrierReason) => {
    recordAnonymousEvent('kvisa-path.events', {
      app: 'kvisa-path',
      opportunityId: `doc-${docId}`,
      kind: 'doc_barrier',
      lang,
      choiceCode: reason,
    });
    setBarrierDocId(null);
    setDocNotice(`서류 준비 어려움(${DOC_BARRIER_LABELS[reason]})을 익명 통계에 반영했어요.`);
    onEventLogged();
  };

  const handleQuizSelect = (quizId: string, choice: 'O' | 'X', correctAnswer: 'O' | 'X') => {
    if (quizAnswers[quizId]) return; // 최초 응답만 기록 (전후 검증 원칙)
    setQuizAnswers((prev) => {
      const next = { ...prev, [quizId]: choice };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
    recordAnonymousEvent('kvisa-path.events', {
      app: 'kvisa-path',
      opportunityId: quizId,
      kind: 'quiz_first_answer',
      lang,
      choiceCode: choice === correctAnswer ? 'correct' : 'wrong',
    });
    onEventLogged();
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = questionText.trim();
    if (!trimmed) return;
    const classified = classifyQuestionTopic(trimmed);
    const logged = buildQuestionLog(trimmed, lang);
    recordAnonymousEvent('kvisa-path.events', logged);
    setQuestionResult({
      topic: gap.topics[classified.topicCode],
      answer: copy?.guides[logged.choiceCode] ?? classified.guideAnswer,
    });
    setQuestionText('');
    onEventLogged();
  };

  const careerInfo = CAREER_RECOMMENDATIONS[careerField];
  const progressPct = Math.round((doneDocs.length / DOC_CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="kb-stack">
      {/* 1. 서류 준비 체크리스트 */}
      <section className="kb-section" style={{ marginTop: 12 }}>
        <div className="kb-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 className="kb-section-title" style={{ margin: 0 }}>
            {gap.docSection} ({doneDocs.length}/{DOC_CHECKLIST_ITEMS.length} · {progressPct}%)
          </h2>
        </div>
        <div className="kv-bar-track" style={{ marginBottom: 12 }}>
          <div className="kv-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
        {docNotice ? <p className="kb-subtitle" style={{ marginBottom: 10 }}>{docNotice}</p> : null}

        <div className="kb-stack">
          {DOC_CHECKLIST_ITEMS.map((doc) => {
            const isDone = doneDocs.includes(doc.id);
            const isBarrierOpen = barrierDocId === doc.id;
            return (
              <div key={doc.id} className="kb-card kb-stack">
                <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                  <strong>{copy?.docs[doc.id]?.name ?? doc.name}</strong>
                  <div className="kb-row">
                    <button
                      type="button"
                      className="kb-chip"
                      aria-pressed={isDone}
                      onClick={() => toggleDocDone(doc.id)}
                    >
                      {isDone ? gap.docDone : gap.docMark}
                    </button>
                    <button
                      type="button"
                      className="kv-term-btn"
                      aria-pressed={isBarrierOpen}
                      onClick={() => setBarrierDocId(isBarrierOpen ? null : doc.id)}
                    >
                      {gap.docHard}
                    </button>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 14 }}>{copy?.whereLead ?? '발급처'}: {copy?.docs[doc.id]?.whereToGet ?? doc.whereToGet}</p>
                <p className="kb-subtitle" style={{ margin: 0 }}>
                  {copy?.tipLead ?? '안내'}: {copy?.docs[doc.id]?.tip ?? doc.tip}
                </p>

                {isBarrierOpen ? (
                  <div className="kb-card-soft kb-stack">
                    <span className="kv-label" style={{ marginBottom: 0 }}>
                      {gap.barrierAsk}
                    </span>
                    <div className="kb-row">
                      {(Object.keys(DOC_BARRIER_LABELS) as DocBarrierReason[]).map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          className="kb-chip"
                          onClick={() => handleReportBarrier(doc.id, reason)}
                        >
                          {copy?.barriers[reason] ?? DOC_BARRIER_LABELS[reason]}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. 1분 입시 O/X 확인 퀴즈 */}
      <section className="kb-section">
        <h2 className="kb-section-title">{gap.quizSection}</h2>
        <p className="kb-subtitle" style={{ marginBottom: 12 }}>{gap.quizLead}</p>
        <div className="kb-stack">
          {ADMISSION_QUIZ_ITEMS.map((item, idx) => {
            const chosen = quizAnswers[item.id];
            const isCorrect = chosen === item.answer;
            return (
              <div key={item.id} className="kb-card kb-stack">
                <p style={{ margin: 0, fontWeight: 600 }}>
                  Q{idx + 1}. {copy?.quiz[item.id]?.question ?? item.question}
                </p>
                <div className="kb-row">
                  <button
                    type="button"
                    className="kb-chip"
                    aria-pressed={chosen === 'O'}
                    disabled={Boolean(chosen)}
                    onClick={() => handleQuizSelect(item.id, 'O', item.answer)}
                  >
                    {gap.quizYes}
                  </button>
                  <button
                    type="button"
                    className="kb-chip"
                    aria-pressed={chosen === 'X'}
                    disabled={Boolean(chosen)}
                    onClick={() => handleQuizSelect(item.id, 'X', item.answer)}
                  >
                    {gap.quizNo}
                  </button>
                  {chosen ? (
                    <span className={`kb-tag ${isCorrect ? 'kb-status-safe' : 'kb-status-avoid'}`}>
                      {isCorrect ? gap.quizOk : `${gap.quizBad} (${item.answer})`}
                    </span>
                  ) : null}
                </div>
                {chosen ? (
                  <p className="kb-subtitle" style={{ margin: 0 }}>
                    {copy?.explainLead ?? '해설'}: {copy?.quiz[item.id]?.explanation ?? item.explanation}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. 1줄 입시·진로 질문함 (비정형 텍스트 수집 + 토픽 분류) */}
      <section className="kb-section">
        <h2 className="kb-section-title">{copy?.questionTitle ?? '3. 1줄 입시·진로 질문'}</h2>
        <p className="kb-subtitle">{copy?.topicSaved ?? '질문 문장은 저장하지 않아요.'}</p>
        <form className="kb-card kb-stack" onSubmit={handleSubmitQuestion}>
          <div>
            <label htmlFor="free-question-input" className="kv-label">
              {gap.questionLabel}
            </label>
            <input
              id="free-question-input"
              type="text"
              className="kv-input"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder={gap.questionPlaceholder}
            />
          </div>
          <div className="kb-row">
            <button type="submit" className="kb-chip" disabled={!questionText.trim()}>
              {copy?.questionSubmit ?? '질문 보내고 가이드 보기'}
            </button>
            <button type="button" className="kb-chip" onClick={() => clearMyRecords()}>
              {ui.clearRecords}
            </button>
          </div>
          {questionResult ? (
            <div className="kb-card-soft kb-stack" role="status">
              <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                <strong>{gap.topicPrefix}: {questionResult.topic}</strong>
                <span className="kb-tag">{copy?.topicSaved ?? '주제만 기록됨'}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14 }}>{questionResult.answer}</p>
            </div>
          ) : null}
        </form>
      </section>

      {/* 4. D-Day 일정 & 커리어넷 계열별 직업·학과 */}
      <section className="kb-section">
        <h2 className="kb-section-title">{gap.scheduleHeading}</h2>
        <div className="kv-grid-2">
          <div className="kb-card kb-stack">
            <strong style={{ fontSize: 14 }}>입시·시험 일정 D-Day</strong>
            {DDAY_SCHEDULES.map((s) => {
              const phase = schedulePhase(s, today);
              const end = s.endDateStr ?? s.dateStr;
              const range = s.endDateStr ? `${s.dateStr} ~ ${end}` : s.dateStr;
              const label =
                phase === 'closed'
                  ? ui.scheduleClosed
                  : phase === 'open'
                    ? ui.scheduleOpen
                    : `D-${daysUntil(s.dateStr, today)}`;
              const shown = copy?.schedules[s.id];
              return (
                <div key={s.id} className="kb-stack">
                  <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{shown?.title ?? s.title}</div>
                      <div className="kb-subtitle" style={{ margin: 0 }}>
                        {shown?.target ?? s.target} · {range}
                      </div>
                    </div>
                    <span className={`kb-tag ${phase === 'closed' ? 'kb-status-avoid' : phase === 'open' ? 'kb-status-safe' : ''}`}>{label}</span>
                  </div>
                  <div className="kb-row">
                    <a className="kv-link" href={s.sourceUrl} target="_blank" rel="noreferrer">
                      {s.sourceLabel} · {s.verifiedOn}
                    </a>
                    <button type="button" className="kv-term-btn" onClick={() => downloadIcs(s)}>
                      {gap.addCalendar}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="kb-card kb-stack">
            <strong style={{ fontSize: 14 }}>{gap.careerHeading}</strong>
            <p className="kb-subtitle" style={{ margin: 0 }}>{gap.careerNote}</p>
            <div className="kb-row">
              {FIELD_BUTTONS.map((fb) => (
                <button
                  key={fb.value}
                  type="button"
                  className="kv-term-btn"
                  aria-pressed={careerField === fb.value}
                  onClick={() => {
                    setCareerField(fb.value);
                    recordAnonymousEvent('kvisa-path.events', {
                      app: 'kvisa-path',
                      opportunityId: 'career-explore',
                      kind: 'career_field_viewed',
                      lang,
                      choiceCode: fb.value,
                    });
                    onEventLogged();
                  }}
                >
                  {copy?.fields[fb.value] ?? fb.label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 14 }}>
              <strong>{copy?.jobsLead ?? '대표 직업'}:</strong> {copy?.career[careerField]?.jobs ?? careerInfo.jobs.join(', ')}
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>
              <strong>{copy?.majorsWord ?? '관련 학과'}:</strong> {copy?.career[careerField]?.majors ?? careerInfo.majors.join(', ')}
            </p>
            <p className="kb-subtitle" style={{ margin: 0 }}>
              {copy?.career[careerField]?.note ?? careerInfo.note}
            </p>
          </div>
        </div>
      </section>

      {/* 5. TOPIK 유효기간(2년) & 합법 알바 허용시간 계산기 */}
      <section className="kb-section">
        <h2 className="kb-section-title">{gap.workSection}</h2>
        <p className="kb-subtitle">
          {gap.workSource}{' '}
          <a className="kv-link" href={WORK_HOUR_SOURCE.sourceUrl} target="_blank" rel="noreferrer">{WORK_HOUR_SOURCE.verifiedOn}</a>
        </p>
        <div className="kv-grid-2">
          <div className="kb-card kb-stack">
            <strong style={{ fontSize: 14 }}>TOPIK 성적 유효기간(2년) 확인</strong>
            <div>
              <label htmlFor="topik-date-input" className="kv-label">
                TOPIK 성적 발표일 선택
              </label>
              <input
                id="topik-date-input"
                type="date"
                className="kv-input"
                value={topikDate}
                onChange={(e) => setTopikDate(e.target.value)}
              />
            </div>
            {topikValidity ? (
              <div className="kb-card-soft">
                <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                  <span>만료 예정일: <strong>{topikValidity.expiryStr}</strong></span>
                  <span className={`kb-tag ${topikValidity.isValid ? 'kb-status-safe' : 'kb-status-avoid'}`}>
                    {topikValidity.isValid ? `유효 (D-${topikValidity.diffDays})` : '만료됨 · 재응시 필요'}
                  </span>
                </div>
                <p className="kb-subtitle" style={{ margin: '6px 0 0' }}>
                  대학별 원서접수 시작일 기준 유효 성적만 인정되며 시범시행·말하기 성적은 제외돼요.
                </p>
              </div>
            ) : null}
          </div>

          <div className="kb-card kb-stack">
            <strong style={{ fontSize: 14 }}>{gap.workPick}</strong>
            <div>
              <label htmlFor="stage-select" className="kv-label">
                {gap.workPick}
              </label>
              <select
                id="stage-select"
                className="kv-input"
                value={studentStage}
                onChange={(e) => setStudentStage(e.target.value as WorkStage)}
              >
                {(['high_school', 'd4_lang', 'd2_college', 'd2_kcore', 'd2_ba_12', 'd2_ba_34', 'd2_grad'] as const).map((stage) => (
                  <option key={stage} value={stage}>{workStageLabel(lang, stage)}</option>
                ))}
              </select>
            </div>
            {studentStage !== 'high_school' ? (
              <div className="kb-row">
                <button
                  type="button"
                  className="kv-term-btn"
                  aria-pressed={meetsTopikReq}
                  onClick={() => setMeetsTopikReq((v) => !v)}
                >
                  TOPIK: {meetsTopikReq ? 'O' : 'X'}
                </button>
                {studentStage !== 'd2_kcore' ? (
                  <button
                    type="button"
                    className="kv-term-btn"
                    aria-pressed={hasBonusReq}
                    onClick={() => setHasBonusReq((v) => !v)}
                  >
                    TOPIK 5 / A / accredited: {hasBonusReq ? 'O' : 'X'}
                  </button>
                ) : null}
              </div>
            ) : null}
            <div className="kb-card-soft">
              <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                <strong>{partTimeInfo.verified ? `${partTimeInfo.hours}h` : '—'}</strong>
                <span className={`kb-tag ${partTimeInfo.verified ? 'kb-status-safe' : 'kb-status-check'}`}>
                  {partTimeInfo.verified ? (copy?.verified ?? '확인') : gap.workUnverified}
                </span>
              </div>
              <p className="kb-subtitle" style={{ margin: '6px 0 0' }}>
                {lang === 'ko' ? partTimeInfo.ruleLabel : workStageLabel(lang, studentStage)}
                {partTimeInfo.weekendUnlimited ? ' · weekend/vacation unlimited' : ''}
              </p>
              <p className="kb-subtitle" style={{ margin: '4px 0 0' }}>
                {gap.workSource}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
