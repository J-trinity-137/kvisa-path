import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from './kbridge';
import { RegionFacts } from './components/RegionFacts';
import { boardPosts } from './data/board';
import { REGION_IDS, type RegionId } from './data/freshness';
import { NATIONWIDE_IDS, type NationwideRegionId } from './data/nationwideRegions';
import { STUDENT_TYPES } from './data/studentType';
import { navCopy } from './i18n/navCopy';
import { regionLabel } from './i18n/regionLabels';
import { STUDENT_TYPE_COPY } from './i18n/studentTypeCopy';
import { readProfile, writeProfile, type StudentProfile } from './profile/profile';
import { readPrefs, writePrefs, type DevicePrefs } from './profile/prefs';
import { clearMyRecords, RECORDS_CLEARED_EVENT } from './privacy/records';
import { eligibleTracks } from './rules/evaluate';
import { BoardView } from './shell/BoardView';
import { Dashboard } from './shell/Dashboard';
import { MyPage } from './shell/MyPage';
import { Onboarding } from './shell/Onboarding';
import { parseRoute, routeHash, type AppRoute } from './shell/route';
import './styles/app.css';
import './styles/shell.css';

export function App() {
  const { lang, setLang } = useLanguage('kvisa-path.lang');
  const [profile, setProfile] = useState<StudentProfile>(() => readProfile());
  const [prefs, setPrefs] = useState<DevicePrefs>(() => readPrefs());
  const [route, setRoute] = useState<AppRoute>(() => parseRoute(typeof window === 'undefined' ? '' : window.location.hash));
  const copy = navCopy(lang);
  const types = STUDENT_TYPE_COPY[lang];
  const nationwide = profile.region && (NATIONWIDE_IDS as readonly string[]).includes(profile.region) ? (profile.region as NationwideRegionId) : null;
  const posts = useMemo(() => boardPosts(), []);
  const tracks = useMemo(() => eligibleTracks(profile), [profile]);

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
      setProfile(readProfile());
      setPrefs(readPrefs());
      window.location.hash = '#/onboarding';
    };
    window.addEventListener(RECORDS_CLEARED_EVENT, onCleared);
    return () => window.removeEventListener(RECORDS_CLEARED_EVENT, onCleared);
  }, []);

  const saveProfile = (next: StudentProfile) => {
    setProfile(next);
    writeProfile(next);
  };
  const savePrefs = (next: DevicePrefs) => {
    setPrefs(next);
    writePrefs(next);
  };
  const go = (next: AppRoute) => {
    const hash = routeHash(next);
    if (window.location.hash !== hash) window.location.hash = hash;
    else setRoute(next);
  };

  const showSetup = !profile.entered || route.name === 'onboarding';

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
          <a href="#/tracks" aria-current={route.name === 'tracks' ? 'page' : undefined}>
            {copy.tracks}
          </a>
          <a href="#/board" aria-current={route.name === 'board' ? 'page' : undefined}>
            {copy.board}
          </a>
          <a href="#/me" aria-current={route.name === 'me' ? 'page' : undefined}>
            {copy.my}
          </a>
          {prefs.teacherMode ? <a href="#/me">{copy.teacher}</a> : null}
        </nav>
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
          <Dashboard lang={lang} profile={profile} tracks={tracks} easy={prefs.easyKorean} onEdit={() => go({ name: 'onboarding' })} />
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
        {nationwide ? <RegionFacts lang={lang} region={nationwide} /> : null}
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
          />
        ) : null}
      </main>
    </div>
  );
}
