import { useState, type ReactNode } from 'react';
import { PrivacyTools } from '../components/PrivacyTools';
import { TeacherVaultPanel } from '../components/TeacherVaultPanel';
import { ADMISSION_QUIZ_ITEMS, DOC_CHECKLIST_ITEMS } from '../data/interactiveModules';
import { getCoreCopy } from '../i18n/coreCopy';
import { navCopy } from '../i18n/navCopy';
import { regionLabel } from '../i18n/regionLabels';
import { REGION_IDS } from '../data/freshness';
import type { SupportedLangCode } from '../kbridge';
import { LANGUAGES } from '../kbridge';
import type { DevicePrefs } from '../profile/prefs';
import type { StudentProfile } from '../profile/profile';
import { DOCS_STORAGE_KEY } from '../privacy/records';
import { getUiMessages } from '../i18n/messages';
import { SavedTracks } from './SavedTracks';

export function MyPage({
  lang,
  setLang,
  profile,
  prefs,
  onProfile,
  onPrefs,
  onClear,
  onSetup,
  savedIds = [],
  onRemoveSaved,
  demoSlot,
}: {
  lang: SupportedLangCode;
  setLang: (lang: SupportedLangCode) => void;
  profile: StudentProfile;
  prefs: DevicePrefs;
  onProfile: (next: StudentProfile) => void;
  onPrefs: (next: DevicePrefs) => void;
  onClear: () => void;
  onSetup: () => void;
  savedIds?: readonly string[];
  onRemoveSaved?: (id: string) => void;
  demoSlot?: ReactNode;
}) {
  const copy = navCopy(lang);
  const ui = getUiMessages(lang);
  const core = getCoreCopy(lang);
  const [done, setDone] = useState<string[]>(() => {
    try {
      const raw = window.localStorage.getItem(DOCS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [quizId, setQuizId] = useState(0);
  const [picked, setPicked] = useState<'O' | 'X' | null>(null);
  const quiz = ADMISSION_QUIZ_ITEMS[quizId];
  const question = quiz ? (core?.quiz[quiz.id]?.question ?? quiz.question) : '';
  const explanation = quiz ? (core?.quiz[quiz.id]?.explanation ?? quiz.explanation) : '';

  const toggleDoc = (id: string) => {
    const next = done.includes(id) ? done.filter((item) => item !== id) : [...done, id];
    setDone(next);
    window.localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <div className="my">
      <header className="page-head">
        <h1>{copy.my}</h1>
        <p>{copy.privacy}</p>
        <button type="button" className="btn primary" onClick={onSetup}>
          {copy.edit}
        </button>
      </header>
      {demoSlot}
      <SavedTracks lang={lang} profile={profile} ids={savedIds} onRemove={onRemoveSaved} />
      <div className="my-grid">
        <section className="panel">
          <h2>{copy.dashTitle}</h2>
          <label className="field">
            {copy.ask.grade}
            <select value={profile.grade ?? ''} onChange={(event) => onProfile({ ...profile, grade: (event.target.value || null) as StudentProfile['grade'] })}>
              <option value="">—</option>
              {(Object.keys(copy.grades) as Array<keyof typeof copy.grades>).map((key) => (
                <option key={key} value={key}>
                  {copy.grades[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            {copy.region}
            <select value={profile.region ?? ''} onChange={(event) => onProfile({ ...profile, region: (event.target.value || null) as StudentProfile['region'] })}>
              <option value="">—</option>
              {REGION_IDS.map((id) => (
                <option key={id} value={id}>
                  {regionLabel(lang, id)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            {copy.ask.korean}
            <select
              value={profile.koreanLevel ?? ''}
              onChange={(event) => onProfile({ ...profile, koreanLevel: (event.target.value || null) as StudentProfile['koreanLevel'] })}
            >
              <option value="">—</option>
              {(Object.keys(copy.korean) as Array<keyof typeof copy.korean>).map((key) => (
                <option key={key} value={key}>
                  {copy.korean[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            {copy.ask.goal}
            <select value={profile.goal ?? ''} onChange={(event) => onProfile({ ...profile, goal: (event.target.value || null) as StudentProfile['goal'] })}>
              <option value="">—</option>
              <option value="study">{copy.goals.study}</option>
              <option value="work">{copy.goals.work}</option>
            </select>
          </label>
        </section>
        <section className="panel">
          <h2>{copy.theme}</h2>
          <div className="choice-grid">
            {LANGUAGES.map((item) => (
              <button key={item.code} type="button" className="choice" aria-pressed={item.code === lang} onClick={() => setLang(item.code)}>
                {item.nativeName}
              </button>
            ))}
          </div>
          {(['system', 'light', 'dark'] as const).map((theme) => (
            <button key={theme} type="button" className="choice" aria-pressed={prefs.theme === theme} onClick={() => onPrefs({ ...prefs, theme })}>
              {theme === 'system' ? copy.system : theme === 'light' ? copy.light : copy.dark}
            </button>
          ))}
          <label className="check">
            <input type="checkbox" checked={prefs.easyKorean} onChange={(event) => onPrefs({ ...prefs, easyKorean: event.target.checked })} />
            {copy.easy}
          </label>
          <label className="check">
            <input type="checkbox" checked={prefs.reduceMotion} onChange={(event) => onPrefs({ ...prefs, reduceMotion: event.target.checked })} />
            {copy.motion}
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={prefs.fontScale === 'large'}
              onChange={(event) => onPrefs({ ...prefs, fontScale: event.target.checked ? 'large' : 'default' })}
            />
            {copy.fontLarge}
          </label>
          <label className="check">
            <input type="checkbox" checked={prefs.teacherMode} onChange={(event) => onPrefs({ ...prefs, teacherMode: event.target.checked })} />
            {copy.teacher}
          </label>
        </section>
      </div>
      <PrivacyTools lang={lang} easy={prefs.easyKorean} />
      {prefs.teacherMode ? (
        <TeacherVaultPanel lang={lang} region={profile.region ?? 'seoul'} studentType={profile.studentType ?? 'unsure'} grade={profile.grade === 'middle' ? 'ms' : 'hs'} />
      ) : null}
      <details className="panel">
        <summary>
          {done.length}/{DOC_CHECKLIST_ITEMS.length}
        </summary>
        {DOC_CHECKLIST_ITEMS.map((doc) => (
          <label key={doc.id} className="check">
            <input type="checkbox" checked={done.includes(doc.id)} onChange={() => toggleDoc(doc.id)} />
            {core?.docs[doc.id]?.name ?? doc.name}
          </label>
        ))}
      </details>
      {quiz ? (
        <section className="panel">
          <h2>
            {quizId + 1}/{ADMISSION_QUIZ_ITEMS.length}
          </h2>
          <p>{question}</p>
          <div className="choice-grid">
            {(['O', 'X'] as const).map((choice) => (
              <button key={choice} type="button" className="choice" aria-pressed={picked === choice} onClick={() => setPicked(choice)}>
                {choice}
              </button>
            ))}
          </div>
          {picked ? (
            <p role="status" className={picked === quiz.answer ? 'ok' : 'soft'}>
              {picked === quiz.answer ? '맞아요' : '괜찮아요. 다시 보면 돼요.'} {explanation}
            </p>
          ) : null}
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setPicked(null);
              setQuizId((value) => (value + 1) % ADMISSION_QUIZ_ITEMS.length);
            }}
          >
            {copy.next}
          </button>
        </section>
      ) : null}
      <button type="button" className="btn danger" onClick={onClear}>
        {ui.clearRecords}
      </button>
      <p className="muted">{ui.clearRecordsHint}</p>
    </div>
  );
}
