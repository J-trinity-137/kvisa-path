import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from './kbridge';
import { RegionFacts } from './components/RegionFacts';
import { boardPosts } from './data/board';
import { REGION_IDS, type RegionId } from './data/freshness';
import { NATIONWIDE_IDS, type NationwideRegionId } from './data/nationwideRegions';
import { STUDENT_TYPES } from './data/studentType';
import { navCopy } from './i18n/navCopy';
import { planCopy } from './i18n/planCopy';
import { accountsCopy } from './i18n/accountsCopy';
import { regionLabel } from './i18n/regionLabels';
import { STUDENT_TYPE_COPY } from './i18n/studentTypeCopy';
import { readCompare, readSaved, toggleId, writeCompare, writeSaved, COMPARE_MAX, type ToggleStatus } from './library/tracks';
import { activeAccount, profileFor, setAccountLang } from './accounts/model';
import { readDemo } from './accounts/persist';
import { useDemo } from './accounts/useDemo';
import { noteProfileEdit, switchAccount } from './accounts/session';
import { readProfile, writeProfile, type StudentProfile } from './profile/profile';
import { readPrefs, writePrefs, type DevicePrefs } from './profile/prefs';
import { clearMyRecords, RECORDS_CLEARED_EVENT } from './privacy/records';
import { eligibleTracks } from './rules/evaluate';
import { BoardView } from './shell/BoardView';
import { CompareView } from './shell/CompareView';
import { Dashboard } from './shell/Dashboard';
import { DeadlinesView } from './shell/DeadlinesView';
import { DemoChrome } from './shell/demo/DemoChrome';
import { DemoHost } from './shell/demo/DemoHost';
import { DemoMyCard } from './shell/demo/DemoMyCard';
import { MyPage } from './shell/MyPage';
import { Onboarding } from './shell/Onboarding';
import { TrackDetail } from './shell/TrackDetail';
import { parseRoute, routeHash, type AppRoute } from './shell/route';
import './styles/app.css';
import './styles/shell.css';
import './styles/plan.css';
import './styles/accounts.css';

function initialProfile(): StudentProfile {
  const demo = readDemo();
  const active = activeAccount(demo);
  if (active?.role !== 'student') return readProfile();
  const next = profileFor(demo, active.id);
  writeProfile(next);
  return next;
}

export function App() {
  const { lang, setLang } = useLanguage('kvisa-path.lang');
  const { db, replace } = useDemo();
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [prefs, setPrefs] = useState<DevicePrefs>(() => readPrefs());
  const [route, setRoute] = useState<AppRoute>(() => parseRoute(typeof window === 'undefined' ? '' : window.location.hash));
  const [compareIds, setCompareIds] = useState<string[]>(() => readCompare());
  const [savedIds, setSavedIds] = useState<string[]>(() => readSaved());
  const copy = navCopy(lang);
  const plan = planCopy(lang);
  const accountCopy = accountsCopy(lang);
  const types = STUDENT_TYPE_COPY[lang];
  const active = activeAccount(db);
  const appliedStudent = useRef(active?.role === 'student' ? active.id : null);
  const nationwide = profile.region && (NATIONWIDE_IDS as readonly string[]).includes(profile.region) ? (profile.region as NationwideRegionId) : null;
  const posts = useMemo(() => boardPosts(), []);
  const tracks = useMemo(() => eligibleTracks(profile), [profile]);
  const accountScreen = route.name === 'accounts' || route.name === 'class' || route.name === 'join' || route.name === 'family';

  useEffect(() => {
    const root = document.documentElement;
    if (prefs.theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', prefs.theme);
    if (prefs.reduceMotion) root.setAttribute('data-reduce-motion', 'true');
    else root.removeAttribute('data-reduce-motion');
    if (prefs.easyKorean) root.setAttribute('data-easy', 'true');
    else root.removeAttribute('data-easy');
    root.setAttribute('data-font', prefs.fontScale);
    const color = prefs.theme === 'dark' ? '#145C42' : '#0B6B4A';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
  }, [prefs]);

  useEffect(() => {
    const sync = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    const onCleared = () => {
      const cleared = readProfile();
      setProfile(cleared);
      setPrefs(readPrefs());
      setCompareIds([]);
      setSavedIds([]);
      replace((prev) => noteProfileEdit(prev, cleared));
      window.location.hash = '#/onboarding';
    };
    window.addEventListener(RECORDS_CLEARED_EVENT, onCleared);
    return () => window.removeEventListener(RECORDS_CLEARED_EVENT, onCleared);
  }, [replace]);

  useEffect(() => {
    const studentId = active?.role === 'student' ? active.id : null;
    if (studentId === appliedStudent.current) return;
    appliedStudent.current = studentId;
    if (!studentId) return;
    const next = profileFor(db, studentId);
    setProfile(next);
    writeProfile(next);
  }, [active, db]);

  const saveProfile = (next: StudentProfile) => {
    setProfile(next);
    writeProfile(next);
    replace((prev) => noteProfileEdit(prev, next));
  };
  const savePrefs = (next: DevicePrefs) => {
    setPrefs(next);
    writePrefs(next);
  };
  const toggleCompare = (id: string): ToggleStatus => {
    const result = toggleId(compareIds, id, COMPARE_MAX);
    if (result.status === 'added' || result.status === 'removed') {
      setCompareIds(result.ids);
      writeCompare(result.ids);
    }
    return result.status;
  };
  const toggleSaved = (id: string) => {
    const result = toggleId(savedIds, id, 100);
    if (result.status === 'added' || result.status === 'removed') {
      setSavedIds(result.ids);
      writeSaved(result.ids);
    }
  };
  const chosenIds = [...new Set([...savedIds, ...compareIds])];
  const go = (next: AppRoute) => {
    const hash = routeHash(next);
    if (window.location.hash !== hash) window.location.hash = hash;
    else setRoute(next);
  };
  const onSession = (change: { db: typeof db; profile: StudentProfile }) => {
    appliedStudent.current = activeAccount(change.db)?.role === 'student' ? change.db.activeId : null;
    replace(change.db);
    setProfile(change.profile);
    writeProfile(change.profile);
  };

  const showSetup = (!profile.entered || route.name === 'onboarding') && !accountScreen;

  return (
    <div className="shell">
      <a className="skip" href="#main">
        {copy.tracks}
      </a>
      <aside className="sidebar">
        <p className="brand" dir="ltr">
          K-Visa Path
        </p>
        <nav aria-label={copy.navLabel}>
          <a href="#/tracks" aria-current={route.name === 'tracks' || route.name === 'track' ? 'page' : undefined}>
            {copy.tracks}
          </a>
          <a href="#/compare" aria-current={route.name === 'compare' ? 'page' : undefined}>
            {plan.navCompare}
            {compareIds.length > 0 ? ` ${compareIds.length}` : ''}
          </a>
          <a href="#/deadlines" aria-current={route.name === 'deadlines' ? 'page' : undefined}>
            {plan.navDeadlines}
          </a>
          <a href="#/board" aria-current={route.name === 'board' ? 'page' : undefined}>
            {copy.board}
          </a>
          <a href="#/me" aria-current={route.name === 'me' ? 'page' : undefined}>
            {copy.my}
          </a>
          <a href="#/accounts" aria-current={route.name === 'accounts' ? 'page' : undefined}>
            {accountCopy.navAccounts}
          </a>
          {active?.role === 'teacher' ? (
            <a href="#/class" aria-current={route.name === 'class' ? 'page' : undefined}>
              {accountCopy.navClass}
            </a>
          ) : null}
          {active?.role === 'student' ? (
            <a href="#/join" aria-current={route.name === 'join' ? 'page' : undefined}>
              {accountCopy.navJoin}
            </a>
          ) : null}
          {active?.role === 'student' || active?.role === 'guardian' ? (
            <a href="#/family" aria-current={route.name === 'family' ? 'page' : undefined}>
              {accountCopy.navFamily}
            </a>
          ) : null}
          {prefs.teacherMode ? <a href="#/me">{copy.teacher}</a> : null}
        </nav>
        <DemoChrome
          lang={lang}
          accounts={db.accounts}
          activeId={db.activeId}
          onSwitch={(id) => onSession(switchAccount(db, profile, id))}
        />
        <div className="side-picks" role="group" aria-label={copy.region}>
          {STUDENT_TYPES.map((type) => (
            <button key={type} type="button" aria-pressed={profile.studentType === type} onClick={() => saveProfile({ ...profile, studentType: type })}>
              {types.types[type]}
            </button>
          ))}
          {REGION_IDS.map((id) => (
            <button key={id} type="button" aria-pressed={profile.region === id} onClick={() => saveProfile({ ...profile, region: id as RegionId })}>
              {regionLabel(lang, id)}
            </button>
          ))}
        </div>
      </aside>
      <main id="main" tabIndex={-1}>
        {accountScreen ? (
          <DemoHost lang={lang} route={route} db={db} profile={profile} onSession={onSession} onDb={(next) => replace(next)} go={go} />
        ) : null}
        {showSetup ? (
          <Onboarding
            lang={lang}
            setLang={setLang}
            profile={profile}
            onChange={saveProfile}
            onDone={(next) => {
              saveProfile(next);
              go({ name: 'tracks' });
            }}
          />
        ) : null}
        {!showSetup && route.name === 'tracks' ? (
          <Dashboard
            lang={lang}
            profile={profile}
            tracks={tracks}
            easy={prefs.easyKorean}
            onEdit={() => go({ name: 'onboarding' })}
            compareIds={compareIds}
            savedIds={savedIds}
            onToggleCompare={toggleCompare}
            onToggleSave={toggleSaved}
          />
        ) : null}
        {!showSetup && route.name === 'compare' ? (
          <CompareView lang={lang} profile={profile} ids={compareIds} onRemove={toggleCompare} />
        ) : null}
        {!showSetup && route.name === 'deadlines' ? <DeadlinesView lang={lang} chosenIds={chosenIds} /> : null}
        {!showSetup && route.name === 'track' ? (
          <TrackDetail
            lang={lang}
            profile={profile}
            id={route.id}
            comparing={compareIds.includes(route.id)}
            saved={savedIds.includes(route.id)}
            onCompare={toggleCompare}
            onSave={toggleSaved}
          />
        ) : null}
        {!showSetup && route.name === 'board' ? (
          <BoardView
            lang={lang}
            posts={posts}
            selectedId={route.id}
            onOpen={(id) => go({ name: 'board', id })}
            onClose={() => go({ name: 'board' })}
          />
        ) : null}
        {nationwide && !accountScreen ? <RegionFacts lang={lang} region={nationwide} /> : null}
        {!showSetup && route.name === 'me' ? (
          <MyPage
            lang={lang}
            setLang={setLang}
            profile={profile}
            prefs={prefs}
            onProfile={saveProfile}
            onPrefs={savePrefs}
            onClear={() => clearMyRecords()}
            onSetup={() => go({ name: 'onboarding' })}
            savedIds={savedIds}
            onRemoveSaved={toggleSaved}
            demoSlot={
              active ? (
                <DemoMyCard lang={lang} db={db} onHomeLang={(next) => replace((prev) => setAccountLang(prev, active.id, next))} />
              ) : null
            }
          />
        ) : null}
      </main>
    </div>
  );
}
