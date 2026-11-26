import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLanguage } from './kbridge';
import { type RegionId } from './data/freshness';
import { accountsCopy } from './i18n/accountsCopy';
import { navCopy } from './i18n/navCopy';
import { regionLabel } from './i18n/regionLabels';
import { readCompare, readSaved, toggleId, writeCompare, writeSaved, COMPARE_MAX, type ToggleStatus } from './library/tracks';
import { activeAccount, emptyDemo, profileFor, setAccountLang } from './accounts/model';
import { readDemo } from './accounts/persist';
import { useDemo } from './accounts/useDemo';
import { noteProfileEdit, switchAccount } from './accounts/session';
import { readProfile, writeProfile, type StudentProfile } from './profile/profile';
import { readPrefs, writePrefs, type DevicePrefs } from './profile/prefs';
import { clearMyRecords, RECORDS_CLEARED_EVENT } from './privacy/records';
import { CompareView } from './shell/CompareView';
import { Dashboard } from './shell/Dashboard';
import { DeadlinesView } from './shell/DeadlinesView';
import { DemoChrome } from './shell/demo/DemoChrome';
import { DemoHost } from './shell/demo/DemoHost';
import { DemoMyCard } from './shell/demo/DemoMyCard';
import { useTrackExplanation } from './shell/useTracks';
import { Onboarding } from './shell/Onboarding';
import { TopBar, type BarLink } from './shell/TopBar';
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

const RegionFacts = lazy(() => import('./components/RegionFacts').then((mod) => ({ default: mod.RegionFacts })));
const BoardPage = lazy(() => import('./shell/BoardPage').then((mod) => ({ default: mod.BoardPage })));
const MyPage = lazy(() => import('./shell/MyPage').then((mod) => ({ default: mod.MyPage })));

function asNationwide(region: RegionId | null): Exclude<RegionId, 'seoul' | 'gyeonggi'> | null {
  if (!region || region === 'seoul' || region === 'gyeonggi') return null;
  return region;
}

export function App() {
  const { lang, meta, setLang } = useLanguage('kvisa-path.lang');
  const { db, replace } = useDemo();
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [prefs, setPrefs] = useState<DevicePrefs>(() => readPrefs());
  const [route, setRoute] = useState<AppRoute>(() => parseRoute(typeof window === 'undefined' ? '' : window.location.hash));
  const [compareIds, setCompareIds] = useState<string[]>(() => readCompare());
  const [savedIds, setSavedIds] = useState<string[]>(() => readSaved());
  const copy = navCopy(lang);
  const accountCopy = accountsCopy(lang);
  const active = activeAccount(db);
  const appliedStudent = useRef(active?.role === 'student' ? active.id : null);
  const nationwide = asNationwide(profile.region);
  const accountScreen = route.name === 'accounts' || route.name === 'class' || route.name === 'join' || route.name === 'family';
  const showSetup = (!profile.entered || route.name === 'onboarding') && !accountScreen;
  const explained = useTrackExplanation(showSetup || accountScreen ? null : profile);

  useEffect(() => {
    const root = document.documentElement;
    if (prefs.theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', prefs.theme);
    if (prefs.reduceMotion) root.setAttribute('data-reduce-motion', 'true');
    else root.removeAttribute('data-reduce-motion');
    if (prefs.easyKorean) root.setAttribute('data-easy', 'true');
    else root.removeAttribute('data-easy');
    root.setAttribute('data-font', prefs.fontScale);
    const systemDark = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = prefs.theme === 'dark' || (prefs.theme === 'system' && systemDark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#101614' : '#F4F6F5');
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
      appliedStudent.current = null;
      replace(emptyDemo());
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

  const primary: BarLink[] = [
    { href: '#/tracks', label: copy.tracks, current: route.name === 'tracks' || route.name === 'track' },
    { href: '#/board', label: copy.board, current: route.name === 'board' },
    { href: '#/deadlines', label: copy.dates, current: route.name === 'deadlines' },
    { href: '#/me', label: copy.my, current: route.name === 'me' },
  ];
  const accountLinks: BarLink[] = [
    { href: '#/me', label: copy.my, current: route.name === 'me' },
    { href: '#/accounts', label: accountCopy.navAccounts, current: route.name === 'accounts' },
  ];
  if (active?.role === 'teacher') accountLinks.push({ href: '#/class', label: accountCopy.navClass, current: route.name === 'class' });
  if (active?.role === 'student') accountLinks.push({ href: '#/join', label: accountCopy.navJoin, current: route.name === 'join' });
  if (active?.role === 'student' || active?.role === 'guardian') {
    accountLinks.push({ href: '#/family', label: accountCopy.navFamily, current: route.name === 'family' });
  }

  return (
    <div className="app">
      <a className="skip" href="#main">
        {copy.skipToContent}
      </a>
      <TopBar
        lang={lang}
        nativeName={meta.nativeName}
        setLang={setLang}
        focused={showSetup}
        primary={primary}
        accountLinks={accountLinks}
        accountExtra={
          <DemoChrome lang={lang} accounts={db.accounts} activeId={db.activeId} onSwitch={(id) => onSession(switchAccount(db, profile, id))} />
        }
      />
      <main id="main" tabIndex={-1} className={showSetup ? 'main-setup' : 'main-page'}>
        <Suspense fallback={<p className="muted">{copy.loading}</p>}>
          {accountScreen ? <DemoHost lang={lang} route={route} db={db} profile={profile} onSession={onSession} onDb={(next) => replace(next)} go={go} /> : null}
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
          {!showSetup && !accountScreen && route.name === 'tracks' ? (
            <Dashboard
              lang={lang}
              tracks={explained?.tracks ?? []}
              withheld={explained?.withheld ?? []}
              loading={explained == null}
              easy={prefs.easyKorean}
              onEdit={() => go({ name: 'onboarding' })}
              chosenIds={chosenIds}
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
            <BoardPage
              lang={lang}
              selectedId={route.name === 'board' ? route.id : undefined}
              onOpen={(id) => go({ name: 'board', id })}
              onClose={() => go({ name: 'board' })}
            />
          ) : null}
          {!showSetup && route.name === 'me' ? (
            <>
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
                  active ? <DemoMyCard lang={lang} db={db} onHomeLang={(next) => replace((prev) => setAccountLang(prev, active.id, next))} /> : null
                }
              />
              {nationwide ? (
                <details className="fold">
                  <summary>{regionLabel(lang, nationwide)}</summary>
                  <RegionFacts lang={lang} region={nationwide} />
                </details>
              ) : null}
            </>
          ) : null}
        </Suspense>
      </main>
      {showSetup ? null : (
        <footer className="site-foot">
          <p>{copy.privacy}</p>
        </footer>
      )}
    </div>
  );
}
