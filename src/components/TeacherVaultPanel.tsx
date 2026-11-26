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

const MORE = {
  'zh-Hans': { ...COPY.en, title: '咨询记录', lead: '记录只在这台设备上加密，不会送到服务器。忘记密码无法恢复。请用别名，不要写姓名。', password: '记录密码', unlock: '解锁', lock: '锁定', label: '别名', notes: '备注', save: '保存记录', warning: '这段文字看起来像姓名或电话。仍可保存，请按学校规定确认。', export: '导出加密文件', import: '导入加密文件', clear: '全部删除', year: '学年结束时整理今年的记录。', school: '这些记录由学校（教师）管理。请遵守学校的隐私政策和监护人同意。' },
  'zh-Hant': { ...COPY.en, title: '諮詢紀錄', lead: '紀錄只在這台裝置上加密，不會送到伺服器。忘記密碼無法復原。請用別名，不要寫姓名。', password: '紀錄密碼', unlock: '解鎖', lock: '鎖定', label: '別名', notes: '備註', save: '儲存紀錄', warning: '這段文字看起來像姓名或電話。仍可儲存，請按學校規定確認。', export: '匯出加密檔', import: '匯入加密檔', clear: '全部刪除', year: '學年結束時整理今年的紀錄。', school: '這些紀錄由學校（教師）管理。請遵守學校的隱私政策和監護人同意。' },
  vi: { ...COPY.en, title: 'Ghi chú tư vấn', lead: 'Ghi chú được mã hóa trên máy này và không gửi lên máy chủ. Quên mật khẩu thì không khôi phục được. Dùng biệt danh, không ghi tên.', password: 'Mật khẩu ghi chú', unlock: 'Mở khóa', lock: 'Khóa', label: 'Biệt danh', notes: 'Ghi chú', save: 'Lưu ghi chú', warning: 'Đoạn này trông như tên hoặc số điện thoại. Vẫn lưu được. Hãy kiểm quy định của trường.', export: 'Xuất tệp mã hóa', import: 'Nhập tệp mã hóa', clear: 'Xóa hết', year: 'Cuối năm học hãy dọn ghi chú năm nay.', school: 'Nhà trường giữ các ghi chú này. Làm theo chính sách riêng tư và sự đồng ý của người giám hộ.' },
  ru: { ...COPY.en, title: 'Заметки консультации', lead: 'Заметки шифруются только на этом устройстве и не отправляются на сервер. Забытый пароль не восстановить. Пишите прозвище, не имя.', password: 'Пароль записей', unlock: 'Открыть', lock: 'Закрыть', label: 'Прозвище', notes: 'Заметка', save: 'Сохранить', warning: 'Это похоже на имя или телефон. Сохранить можно. Проверьте правило школы.', export: 'Экспорт зашифрованного файла', import: 'Импорт зашифрованного файла', clear: 'Удалить всё', year: 'В конце учебного года разберите записи этого года.', school: 'Записи хранит школа. Следуйте политике школы и согласию родителей.' },
  mn: { ...COPY.en, title: 'Зөвлөгөөний тэмдэглэл', lead: 'Тэмдэглэл зөвхөн энэ төхөөрөмж дээр шифрлэгдэж, сервер лүү явахгүй. Нууц үгээ мартвал сэргээхгүй. Нэр биш хоч ашигла.', password: 'Бичлэгийн нууц үг', unlock: 'Нээх', lock: 'Түгжих', label: 'Хоч', notes: 'Тэмдэглэл', save: 'Хадгалах', warning: 'Энэ нь нэр эсвэл утас мэт харагдана. Хадгалж болно. Сургуулийн дүрмийг шалга.', export: 'Шифрлэсэн файл гаргах', import: 'Шифрлэсэн файл оруулах', clear: 'Бүгдийг устгах', year: 'Хичээлийн жил дуусахад энэ жилийн тэмдэглэлийг цэгцэл.', school: 'Эдгээр тэмдэглэлийг сургууль хадгална. Сургуулийн нууцлал ба асран хамгаалагчийн зөвшөөрлийг дага.' },
  ar: { ...COPY.en, title: 'ملاحظات الإرشاد', lead: 'تُشفّر الملاحظات على هذا الجهاز فقط ولا تُرسل إلى خادم. لا يمكن استرجاع كلمة مرور منسية. استخدم لقبًا لا اسمًا.', password: 'كلمة مرور السجل', unlock: 'فتح', lock: 'قفل', label: 'لقب', notes: 'ملاحظة', save: 'حفظ', warning: 'يبدو هذا اسمًا أو رقم هاتف. يمكن حفظه. راجع قاعدة المدرسة.', export: 'تصدير ملف مشفّر', import: 'استيراد ملف مشفّر', clear: 'حذف الكل', year: 'رتّب ملاحظات هذا العام في نهاية السنة الدراسية.', school: 'المدرسة تحتفظ بهذه الملاحظات. اتبع سياسة الخصوصية وموافقة ولي الأمر.' },
} as const;

function textFor(lang: SupportedLangCode) {
  if (lang === 'ko' || lang === 'en') return COPY[lang];
  return MORE[lang];
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
