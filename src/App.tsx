import { useEffect, useState } from 'react';
import { ActionBar, LanguagePicker, readAnonymousEvents, useLanguage, type AnonymousEvent } from './kbridge';
import { AdmissionsTab } from './components/AdmissionsTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { MethodologyTab } from './components/MethodologyTab';
import { StudentPrepTools } from './components/StudentPrepTools';
import { getUiMessages } from './i18n/messages';
import { EVENT_STORAGE_KEY, RECORDS_CLEARED_EVENT, clearMyRecords } from './privacy/records';
import './styles/app.css';

type StudentTab = 'admissions' | 'prep';
type CounselorTab = 'analytics' | 'methodology';
type Audience = 'student' | 'counselor';

export function App() {
  const { lang, meta, setLang } = useLanguage('kvisa-path.lang');
  const [audience, setAudience] = useState<Audience>('student');
  const [studentTab, setStudentTab] = useState<StudentTab>('admissions');
  const [counselorTab, setCounselorTab] = useState<CounselorTab>('analytics');
  const [langOpen, setLangOpen] = useState(false);
  const [liveEvents, setLiveEvents] = useState<AnonymousEvent[]>(() => readAnonymousEvents(EVENT_STORAGE_KEY));
  const [clearedNote, setClearedNote] = useState<string | null>(null);

  const ui = getUiMessages(lang);

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
    audience === 'student'
      ? studentTab === 'admissions'
        ? ui.nextToPrep
        : ui.backToAdmissions
      : counselorTab === 'analytics'
        ? ui.nextToMethodology
        : ui.nextToAnalytics;

  const handlePrimaryAction = () => {
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

      <div className="kb-row kv-no-print" style={{ marginTop: 12 }}>
        <button type="button" className="kb-chip" aria-pressed={audience === 'student'} onClick={() => setAudience('student')}>
          {ui.studentView}
        </button>
        <button type="button" className="kb-chip" aria-pressed={audience === 'counselor'} onClick={() => setAudience('counselor')}>
          {ui.counselorView}
        </button>
        {audience === 'student' ? (
          <button type="button" className="kb-chip" onClick={clearEvents}>
            {ui.clearRecords}
          </button>
        ) : null}
      </div>
      {audience === 'student' ? <p className="kb-subtitle">{ui.clearRecordsHint}</p> : null}
      {clearedNote ? <p className="kb-subtitle">{clearedNote}</p> : null}

      {audience === 'student' ? (
        <nav className="kv-tabs" role="tablist" aria-label="학생 화면">
          <button type="button" role="tab" className="kv-tab" aria-selected={studentTab === 'admissions'} onClick={() => setStudentTab('admissions')}>
            {ui.tabAdmissions}
          </button>
          <button type="button" role="tab" className="kv-tab" aria-selected={studentTab === 'prep'} onClick={() => setStudentTab('prep')}>
            {ui.tabPrep}
          </button>
        </nav>
      ) : (
        <nav className="kv-tabs" role="tablist" aria-label="상담 교사 화면">
          <button type="button" role="tab" className="kv-tab" aria-selected={counselorTab === 'analytics'} onClick={() => setCounselorTab('analytics')}>
            {ui.tabAnalytics} ({liveEvents.length})
          </button>
          <button type="button" role="tab" className="kv-tab" aria-selected={counselorTab === 'methodology'} onClick={() => setCounselorTab('methodology')}>
            {ui.tabMethodology}
          </button>
        </nav>
      )}

      <div style={{ marginTop: 16 }}>
        {audience === 'student' && studentTab === 'admissions' ? (
          <AdmissionsTab lang={lang} onEventLogged={refreshEvents} />
        ) : null}
        {audience === 'student' && studentTab === 'prep' ? <StudentPrepTools lang={lang} onEventLogged={refreshEvents} /> : null}
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
