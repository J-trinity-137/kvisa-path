import { useCallback, useEffect, useState } from 'react';
import { ActionBar, LanguagePicker, readAnonymousEvents, useLanguage, type AnonymousEvent } from './kbridge';
import { AdmissionsTab } from './components/AdmissionsTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { MethodologyTab } from './components/MethodologyTab';
import { StudentPrepTools } from './components/StudentPrepTools';
import { StudentTypePicker } from './components/StudentTypePicker';
import { PrivacyTools } from './components/PrivacyTools';
import { TeacherSheet } from './components/TeacherSheet';
import { readRegion, writeRegion } from './data/regionPref';
import { readStudentType, writeStudentType, type StudentType } from './data/studentType';
import type { RegionId } from './data/freshness';
import { REGION_COPY } from './i18n/regionCopy';
import { shellCopy } from './i18n/shellCopy';
import { getUiMessages } from './i18n/messages';
import { EVENT_STORAGE_KEY, RECORDS_CLEARED_EVENT, clearMyRecords } from './privacy/records';
import { EMPTY_PATH, type PathChoice } from './session/pathChoice';
import './styles/app.css';

type StudentTab = 'admissions' | 'prep';
type CounselorTab = 'analytics' | 'methodology';
type Audience = 'student' | 'counselor' | 'teacher';

export function App() {
  const { lang, meta, setLang } = useLanguage('kvisa-path.lang');
  const [audience, setAudience] = useState<Audience>('student');
  const [studentTab, setStudentTab] = useState<StudentTab>('admissions');
  const [counselorTab, setCounselorTab] = useState<CounselorTab>('analytics');
  const [langOpen, setLangOpen] = useState(false);
  const [liveEvents, setLiveEvents] = useState<AnonymousEvent[]>(() => readAnonymousEvents(EVENT_STORAGE_KEY));
  const [clearedNote, setClearedNote] = useState<string | null>(null);
  const [studentType, setStudentType] = useState<StudentType | null>(() => readStudentType());
  const [region, setRegion] = useState<RegionId>(() => readRegion());
  const [easy, setEasy] = useState(false);
  const [choice, setChoice] = useState<PathChoice>(EMPTY_PATH);

  const ui = getUiMessages(lang);
  const shell = shellCopy(lang);
  const onChoice = useCallback((next: PathChoice) => {
    setChoice(next);
  }, []);
  const chooseStudentType = (value: StudentType) => {
    writeStudentType(value);
    setStudentType(value);
  };
  const chooseRegion = (value: RegionId) => {
    writeRegion(value);
    setRegion(value);
    setChoice((current) => ({ ...current, region: value }));
  };
  const regionCopy = REGION_COPY[lang];

  const refreshEvents = () => {
    setLiveEvents(readAnonymousEvents(EVENT_STORAGE_KEY));
  };

  useEffect(() => {
    const onCleared = () => {
      setLiveEvents([]);
      setClearedNote(ui.clearRecordsDone);
    };
    window.addEventListener(RECORDS_CLEARED_EVENT, onCleared);
    return () => window.removeEventListener(RECORDS_CLEARED_EVENT, onCleared);
  }, [ui.clearRecordsDone]);

  const clearEvents = () => {
    clearMyRecords();
  };

  const nextTabLabel =
    audience === 'teacher'
      ? shell.teacherPrint
      : audience === 'student'
        ? studentTab === 'admissions'
          ? ui.nextToPrep
          : ui.backToAdmissions
        : counselorTab === 'analytics'
          ? ui.nextToMethodology
          : ui.nextToAnalytics;

  const handlePrimaryAction = () => {
    if (audience === 'teacher') {
      document.body.classList.add('kv-printing-teacher');
      window.print();
      document.body.classList.remove('kv-printing-teacher');
      return;
    }
    if (audience === 'student') setStudentTab((tab) => (tab === 'admissions' ? 'prep' : 'admissions'));
    else setCounselorTab((tab) => (tab === 'analytics' ? 'methodology' : 'analytics'));
  };

  return (
    <main className="kv-page-wide">
      <header className="kb-header">
        <div>
          <h1 className="kb-title">{ui.appTitle}</h1>
          <p className="kb-subtitle">{ui.appSubtitle}</p>
        </div>
        <button type="button" className="kb-chip kv-no-print" onClick={() => setLangOpen(true)}>
          {meta.nativeName}
        </button>
      </header>

      <PrivacyTools lang={lang} easy={easy} />

      <div className="kb-row kv-no-print" style={{ marginTop: 12 }}>
        <button type="button" className="kb-chip" aria-pressed={audience === 'student'} onClick={() => setAudience('student')}>
          {ui.studentView}
        </button>
        <button type="button" className="kb-chip" aria-pressed={audience === 'counselor'} onClick={() => setAudience('counselor')}>
          {ui.counselorView}
        </button>
        <button type="button" className="kb-chip" aria-pressed={audience === 'teacher'} onClick={() => setAudience('teacher')}>
          {shell.teacherView}
        </button>
        <button type="button" className="kb-chip" aria-pressed={easy} onClick={() => setEasy((on) => !on)}>
          {shell.easyToggle}
        </button>
        {audience === 'student' ? (
          <button type="button" className="kb-chip" onClick={clearEvents}>
            {ui.clearRecords}
          </button>
        ) : null}
      </div>
      {audience === 'student' ? <p className="kb-subtitle">{ui.clearRecordsHint}</p> : null}
      {clearedNote ? <p className="kb-subtitle">{clearedNote}</p> : null}

      {audience === 'student' && studentType ? (
        <nav className="kv-tabs" role="tablist" aria-label="학생 화면">
          <button type="button" role="tab" className="kv-tab" aria-selected={studentTab === 'admissions'} onClick={() => setStudentTab('admissions')}>
            {ui.tabAdmissions}
          </button>
          <button type="button" role="tab" className="kv-tab" aria-selected={studentTab === 'prep'} onClick={() => setStudentTab('prep')}>
            {ui.tabPrep}
          </button>
        </nav>
      ) : audience === 'counselor' ? (
        <nav className="kv-tabs" role="tablist" aria-label="상담 교사 화면">
          <button type="button" role="tab" className="kv-tab" aria-selected={counselorTab === 'analytics'} onClick={() => setCounselorTab('analytics')}>
            {ui.tabAnalytics} ({liveEvents.length})
          </button>
          <button type="button" role="tab" className="kv-tab" aria-selected={counselorTab === 'methodology'} onClick={() => setCounselorTab('methodology')}>
            {ui.tabMethodology}
          </button>
        </nav>
      ) : null}

      <div style={{ marginTop: 16 }}>
        {audience === 'student' ? (
          <>
            <section className="kb-section" aria-label={regionCopy.regionAsk}>
              <h2 className="kb-section-title">{regionCopy.regionAsk}</h2>
              <div className="kb-row" role="group" aria-label={regionCopy.regionAsk}>
                <button type="button" className="kb-chip" aria-pressed={region === 'seoul'} onClick={() => chooseRegion('seoul')}>
                  {regionCopy.seoul}
                </button>
                <button type="button" className="kb-chip" aria-pressed={region === 'gyeonggi'} onClick={() => chooseRegion('gyeonggi')}>
                  {regionCopy.gyeonggi}
                </button>
              </div>
            </section>
            <StudentTypePicker lang={lang} value={studentType} onChange={chooseStudentType} />
          </>
        ) : null}
        {audience === 'student' && studentType && studentTab === 'admissions' ? (
          <AdmissionsTab
            lang={lang}
            studentType={studentType}
            region={region}
            easy={easy}
            onEventLogged={refreshEvents}
            onChoice={onChoice}
          />
        ) : null}
        {audience === 'student' && studentType && studentTab === 'prep' ? (
          <StudentPrepTools
            lang={lang}
            hideVisa={studentType === 'domestic_multicultural' || studentType === 'unsure'}
            onEventLogged={refreshEvents}
          />
        ) : null}
        {audience === 'teacher' ? (
          <div className="kv-teacher-root">
            <TeacherSheet lang={lang} choice={choice} easy={easy} />
          </div>
        ) : null}
        {audience === 'counselor' && counselorTab === 'analytics' ? (
          <AnalyticsTab lang={lang} liveEvents={liveEvents} onEventLogged={refreshEvents} />
        ) : null}
        {audience === 'counselor' && counselorTab === 'methodology' ? (
          <MethodologyTab lang={lang} liveEvents={liveEvents} onClearEvents={clearEvents} />
        ) : null}
      </div>

      <ActionBar
        secondaryLabel={ui.langButton}
        onSecondary={() => setLangOpen(true)}
        primaryLabel={nextTabLabel}
        onPrimary={handlePrimaryAction}
      />

      <LanguagePicker
        open={langOpen}
        currentLang={lang}
        onSelect={setLang}
        onClose={() => setLangOpen(false)}
        title={ui.pickerTitle}
        closeLabel={ui.closeLabel}
      />
    </main>
  );
}
