import { useState } from 'react';
import {
  ActionBar,
  LanguagePicker,
  readAnonymousEvents,
  useLanguage,
  type AnonymousEvent,
} from 'kbridge-core';
import { AdmissionsTab } from './components/AdmissionsTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { MethodologyTab } from './components/MethodologyTab';
import { StudentPrepTools } from './components/StudentPrepTools';
import { getUiMessages } from './i18n/messages';
import './styles/app.css';

type TabKey = 'admissions' | 'prep' | 'analytics' | 'methodology';

const EVENTS_KEY = 'kvisa-path.events';

export function App() {
  const { lang, meta, setLang } = useLanguage('kvisa-path.lang');
  const [activeTab, setActiveTab] = useState<TabKey>('admissions');
  const [langOpen, setLangOpen] = useState(false);
  const [neisApiKey, setNeisApiKey] = useState('');
  const [liveEvents, setLiveEvents] = useState<AnonymousEvent[]>(() => readAnonymousEvents(EVENTS_KEY));

  const ui = getUiMessages(lang);

  const refreshEvents = () => {
    setLiveEvents(readAnonymousEvents(EVENTS_KEY));
  };

  const clearEvents = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(EVENTS_KEY);
    }
    setLiveEvents([]);
  };

  const nextTabLabel =
    activeTab === 'admissions'
      ? ui.nextToPrep
      : activeTab === 'prep'
        ? `${ui.nextToAnalytics} (${liveEvents.length})`
        : activeTab === 'analytics'
          ? ui.nextToMethodology
          : ui.backToAdmissions;

  const handlePrimaryAction = () => {
    if (activeTab === 'admissions') setActiveTab('prep');
    else if (activeTab === 'prep') setActiveTab('analytics');
    else if (activeTab === 'analytics') setActiveTab('methodology');
    else setActiveTab('admissions');
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

      <nav className="kv-tabs" role="tablist" aria-label="화면 전환">
        <button
          type="button"
          role="tab"
          className="kv-tab"
          aria-selected={activeTab === 'admissions'}
          onClick={() => setActiveTab('admissions')}
        >
          {ui.tabAdmissions}
        </button>
        <button
          type="button"
          role="tab"
          className="kv-tab"
          aria-selected={activeTab === 'prep'}
          onClick={() => setActiveTab('prep')}
        >
          {ui.tabPrep}
        </button>
        <button
          type="button"
          role="tab"
          className="kv-tab"
          aria-selected={activeTab === 'analytics'}
          onClick={() => setActiveTab('analytics')}
        >
          {ui.tabAnalytics} ({liveEvents.length})
        </button>
        <button
          type="button"
          role="tab"
          className="kv-tab"
          aria-selected={activeTab === 'methodology'}
          onClick={() => setActiveTab('methodology')}
        >
          {ui.tabMethodology}
        </button>
      </nav>

      <div style={{ marginTop: 16 }}>
        {activeTab === 'admissions' ? (
          <AdmissionsTab lang={lang} neisApiKey={neisApiKey} onEventLogged={refreshEvents} />
        ) : activeTab === 'prep' ? (
          <StudentPrepTools lang={lang} onEventLogged={refreshEvents} />
        ) : activeTab === 'analytics' ? (
          <AnalyticsTab lang={lang} liveEvents={liveEvents} onEventLogged={refreshEvents} />
        ) : (
          <MethodologyTab
            neisApiKey={neisApiKey}
            onNeisApiKeyChange={setNeisApiKey}
            liveEvents={liveEvents}
            onClearEvents={clearEvents}
          />
        )}
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
      />
    </main>
  );
}
