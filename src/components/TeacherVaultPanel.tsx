import { useState } from 'react';
import type { SupportedLangCode } from '../kbridge';
import { languageMeta } from '../kbridge';
import { redact } from '../privacy/redact';
import { createIdbStore, TeacherVault, type KvrecFile, type TeacherNote } from '../teacher/vault';

const COPY = {
  ko: {
    title: '상담 기록',
    lead: '기록은 이 기기에서만 암호화됩니다. 서버로 보내지 않습니다. 암호를 잊으면 복구할 수 없습니다. 이름 대신 별칭을 쓰세요.',
    password: '기록 암호',
    unlock: '잠금 해제',
    lock: '잠그기',
    label: '별칭',
    notes: '메모',
    save: '기록 저장',
    warning: '이름이나 전화번호로 보이는 글자가 있습니다. 저장은 되지만, 학교 규칙에 맞게 확인하세요.',
    export: '암호화 파일 내보내기',
    import: '암호화 파일 가져오기',
    clear: '전체 삭제',
    year: '학년 말에 올해 기록을 정리하세요.',
    school: '이 기록은 학교(교사)가 관리합니다. 학교의 개인정보 처리방침과 보호자 동의를 따르세요.',
  },
  en: {
    title: 'Counselling notes',
    lead: 'Notes are encrypted on this device only and are not sent to a server. A forgotten password cannot be recovered. Use a nickname, not a name.',
    password: 'Record password',
    unlock: 'Unlock',
    lock: 'Lock',
    label: 'Nickname',
    notes: 'Notes',
    save: 'Save note',
    warning: 'This looks like a name or phone number. It can still be saved. Check the school rule.',
    export: 'Export encrypted file',
    import: 'Import encrypted file',
    clear: 'Delete all',
    year: 'Clear this year’s notes at the end of the school year.',
    school: 'The school keeps these notes. Follow the school privacy policy and guardian consent.',
  },
} as const;

function textFor(lang: SupportedLangCode) {
  if (lang === 'ko' || lang === 'en') return COPY[lang];
  return COPY.en;
}

export function TeacherVaultPanel({
  lang,
  region = 'seoul',
  studentType = 'unsure',
  grade = 'hs',
  now = new Date(),
}: {
  lang: SupportedLangCode;
  region?: string;
  studentType?: TeacherNote['studentType'];
  grade?: TeacherNote['grade'];
  now?: Date;
}) {
  const copy = textFor(lang);
  const [vault] = useState(() => new TeacherVault(createIdbStore()));
  const [password, setPassword] = useState('');
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<TeacherNote[]>([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const warning = redact(notes).flags.some((flag) => flag === 'name' || flag === 'phone');
  const yearEnd = now.getMonth() === 11 || now.getMonth() === 0 || now.getMonth() === 1;

  const unlock = async () => {
    try {
      await vault.unlock(password);
      setItems(await vault.list().catch(() => []));
      setOpen(true);
      setMessage('');
    } catch {
      setOpen(false);
      setMessage(copy.lead);
    }
  };

  const save = async () => {
    const note: TeacherNote = {
      id: crypto.randomUUID(),
      label,
      grade,
      studentType,
      region,
      topics: [],
      notes,
      nextSteps: [],
      followUpOn: '',
    };
    await vault.save(note);
    setItems(await vault.list());
    setNotes('');
  };

  return (
    <section className="kb-section" aria-label={copy.title} dir={languageMeta(lang).dir}>
      <h2 className="kb-section-title">{copy.title}</h2>
      <p>{copy.lead}</p>
      <p>{copy.school}</p>
      {yearEnd ? <p>{copy.year}</p> : null}
      <label>
        {copy.password}{' '}
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="off" />
      </label>
      <div className="kb-row">
        <button type="button" className="kb-chip" onClick={() => void unlock()}>
          {copy.unlock}
        </button>
        <button type="button" className="kb-chip" onClick={() => { vault.lock(); setOpen(false); }}>
          {copy.lock}
        </button>
      </div>
      {message ? <p>{message}</p> : null}
      {open ? (
        <div className="kb-card kb-stack">
          <label>
            {copy.label}{' '}
            <input value={label} maxLength={20} onChange={(event) => setLabel(event.target.value)} />
          </label>
          <label>
            {copy.notes}
            <textarea value={notes} maxLength={2000} onChange={(event) => setNotes(event.target.value)} />
          </label>
          {warning ? <p>{copy.warning}</p> : null}
          <button type="button" className="kb-chip" onClick={() => void save()}>
            {copy.save}
          </button>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                {item.label}: {item.notes}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="kb-chip"
            onClick={() => {
              void vault.exportFile().then((file) => {
                const blob = new Blob([JSON.stringify(file)], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'notes.kvrec';
                link.click();
              });
            }}
          >
            {copy.export}
          </button>
          <label>
            {copy.import}
            <input
              type="file"
              accept=".kvrec,application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                void file.text().then(async (raw) => {
                  await vault.importFile(JSON.parse(raw) as KvrecFile, password);
                  setItems(await vault.list());
                });
              }}
            />
          </label>
          <button type="button" className="kb-chip" onClick={() => void vault.clearAll().then(() => { setItems([]); setOpen(false); })}>
            {copy.clear}
          </button>
        </div>
      ) : null}
    </section>
  );
}
