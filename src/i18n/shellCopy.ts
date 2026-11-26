import type { SupportedLangCode } from '../kbridge';

export interface ShellCopy {
  checked: string;
  source: string;
  stale: string;
  readAloud: string;
  noVoice: string;
  teacherView: string;
  easyToggle: string;
  easyOn: string;
  teacherLead: string;
  teacherPrint: string;
  regionLabel: string;
  seoul: string;
  gyeonggi: string;
  gyeonggiEmpty: string;
  stage: string;
  background: string;
  visa: string;
  korean: string;
  field: string;
  privacy: string;
  easyVisaLead: string;
}

export const FRESHNESS_COPY: Record<SupportedLangCode, ShellCopy> = {
  ko: {
    checked: '확인',
    source: '출처',
    stale: '오래되었을 수 있어요. 출처를 다시 보세요.',
    readAloud: '읽어 주기',
    noVoice: '이 브라우저에는 읽어 주기 기능이 없어요.',
    teacherView: '선생님용',
    easyToggle: '쉬운 한국어',
    easyOn: '짧은 문장으로 봅니다.',
    teacherLead: '학생과 함께 보는 상담 요약입니다. 이 선택은 이 화면에만 있고 저장하지 않습니다.',
    teacherPrint: '한 장 인쇄',
    regionLabel: '지역',
    seoul: '서울',
    gyeonggi: '경기',
    gyeonggiEmpty: '경기 자료는 아직 없습니다. 확인된 자료를 다음에 넣습니다.',
    stage: '학교급',
    background: '배경',
    visa: '체류자격',
    korean: '한국어',
    field: '관심 분야',
    privacy: '이름, 학교, 체류자격은 서버로 보내지 않습니다.',
    easyVisaLead: '고른 자격의 핵심만 적습니다.',
  },
  en: {
    checked: 'Checked',
    source: 'Source',
    stale: 'This may be old. Check the source.',
    readAloud: 'Read aloud',
    noVoice: 'This browser cannot read aloud.',
    teacherView: 'For teachers',
    easyToggle: 'Easy Korean',
    easyOn: 'Short sentences.',
    teacherLead: 'A short counselling summary to use with a student. This choice stays on this screen and is not saved.',
    teacherPrint: 'Print one page',
    regionLabel: 'Region',
    seoul: 'Seoul',
    gyeonggi: 'Gyeonggi',
    gyeonggiEmpty: 'No Gyeonggi data yet. Verified data will be added later.',
    stage: 'School level',
    background: 'Background',
    visa: 'Status of stay',
    korean: 'Korean',
    field: 'Interest',
    privacy: 'Name, school, and status of stay are not sent to a server.',
    easyVisaLead: 'Only the main point of the chosen status.',
  },
  'zh-Hans': {
    checked: '核对',
    source: '来源',
    stale: '可能旧了。请再看来源。',
    readAloud: '朗读',
    noVoice: '这个浏览器不能朗读。',
    teacherView: '教师用',
    easyToggle: '简单韩语',
    easyOn: '用短句看。',
    teacherLead: '和学生一起看的简短咨询摘要。这个选择只在这个画面，不保存。',
    teacherPrint: '打印一页',
    regionLabel: '地区',
    seoul: '首尔',
    gyeonggi: '京畿',
    gyeonggiEmpty: '还没有京畿资料。确认后的资料以后再加。',
    stage: '学校阶段',
    background: '背景',
    visa: '停留资格',
    korean: '韩语',
    field: '兴趣',
    privacy: '姓名、学校和停留资格不会送到服务器。',
    easyVisaLead: '只写所选资格的要点。',
  },
  'zh-Hant': {
    checked: '核對',
    source: '來源',
    stale: '可能舊了。請再看來源。',
    readAloud: '朗讀',
    noVoice: '這個瀏覽器不能朗讀。',
    teacherView: '教師用',
    easyToggle: '簡單韓語',
    easyOn: '用短句看。',
    teacherLead: '和學生一起看的簡短諮詢摘要。這個選擇只在這個畫面，不保存。',
    teacherPrint: '列印一頁',
    regionLabel: '地區',
    seoul: '首爾',
    gyeonggi: '京畿',
    gyeonggiEmpty: '還沒有京畿資料。確認後的資料以後再加。',
    stage: '學校階段',
    background: '背景',
    visa: '停留資格',
    korean: '韓語',
    field: '興趣',
    privacy: '姓名、學校和停留資格不會送到伺服器。',
    easyVisaLead: '只寫所選資格的要點。',
  },
  vi: {
    checked: 'Đã kiểm',
    source: 'Nguồn',
    stale: 'Có thể đã cũ. Hãy xem lại nguồn.',
    readAloud: 'Đọc to',
    noVoice: 'Trình duyệt này không đọc được.',
    teacherView: 'Cho giáo viên',
    easyToggle: 'Tiếng Hàn dễ',
    easyOn: 'Câu ngắn.',
    teacherLead: 'Tóm tắt tư vấn để xem cùng học sinh. Lựa chọn chỉ ở màn hình này và không được lưu.',
    teacherPrint: 'In một trang',
    regionLabel: 'Vùng',
    seoul: 'Seoul',
    gyeonggi: 'Gyeonggi',
    gyeonggiEmpty: 'Chưa có dữ liệu Gyeonggi. Dữ liệu đã kiểm sẽ được thêm sau.',
    stage: 'Cấp học',
    background: 'Hoàn cảnh',
    visa: 'Tư cách lưu trú',
    korean: 'Tiếng Hàn',
    field: 'Quan tâm',
    privacy: 'Tên, trường và tư cách lưu trú không được gửi lên máy chủ.',
    easyVisaLead: 'Chỉ nêu ý chính của tư cách đã chọn.',
  },
  ru: {
    checked: 'Проверено',
    source: 'Источник',
    stale: 'Может быть устаревшим. Откройте источник.',
    readAloud: 'Прочитать',
    noVoice: 'Этот браузер не умеет читать вслух.',
    teacherView: 'Для учителя',
    easyToggle: 'Простой корейский',
    easyOn: 'Короткие фразы.',
    teacherLead: 'Краткая сводка для консультации с учеником. Выбор остаётся на этом экране и не сохраняется.',
    teacherPrint: 'Печать на одну страницу',
    regionLabel: 'Регион',
    seoul: 'Сеул',
    gyeonggi: 'Кёнги',
    gyeonggiEmpty: 'Данных по Кёнги пока нет. Проверенные данные добавят позже.',
    stage: 'Ступень',
    background: 'Ситуация',
    visa: 'Статус пребывания',
    korean: 'Корейский',
    field: 'Интерес',
    privacy: 'Имя, школа и статус пребывания не отправляются на сервер.',
    easyVisaLead: 'Только главное о выбранном статусе.',
  },
  mn: {
    checked: 'Нягталсан',
    source: 'Эх сурвалж',
    stale: 'Хуучирсан байж болно. Эх сурвалжаа дахин үз.',
    readAloud: 'Уншиж өгөх',
    noVoice: 'Энэ хөтөч уншиж чадахгүй.',
    teacherView: 'Багшид',
    easyToggle: 'Хялбар солонгос',
    easyOn: 'Богино өгүүлбэр.',
    teacherLead: 'Сурагчтай хамт үзэх товч зөвлөгөө. Энэ сонголт зөвхөн энэ дэлгэцэнд үлдэнэ, хадгалахгүй.',
    teacherPrint: 'Нэг хуудас хэвлэх',
    regionLabel: 'Бүс',
    seoul: 'Сөүл',
    gyeonggi: 'Кёнги',
    gyeonggiEmpty: 'Кёнгийн мэдээлэл хараахан алга. Нягталсан мэдээллийг дараа нэмнэ.',
    stage: 'Сургуулийн шат',
    background: 'Нөхцөл',
    visa: 'Оршин суух эрх',
    korean: 'Солонгос хэл',
    field: 'Сонирхол',
    privacy: 'Нэр, сургууль, оршин суух эрхийг сервер лүү илгээхгүй.',
    easyVisaLead: 'Сонгосон эрхийн гол санааг л бичнэ.',
  },
  ar: {
    checked: 'تاريخ المراجعة',
    source: 'المصدر',
    stale: 'قد يكون قديمًا. راجع المصدر.',
    readAloud: 'اقرأ بصوت',
    noVoice: 'هذا المتصفح لا يقرأ بصوت.',
    teacherView: 'للمعلم',
    easyToggle: 'كورية سهلة',
    easyOn: 'جمل قصيرة.',
    teacherLead: 'ملخص استشارة قصير مع الطالب. هذا الاختيار يبقى على هذه الشاشة ولا يُحفظ.',
    teacherPrint: 'طباعة صفحة واحدة',
    regionLabel: 'المنطقة',
    seoul: 'سيول',
    gyeonggi: 'كيونغي',
    gyeonggiEmpty: 'لا بيانات لكيونغي بعد. ستُضاف البيانات الموثقة لاحقًا.',
    stage: 'المرحلة',
    background: 'الخلفية',
    visa: 'صفة الإقامة',
    korean: 'الكورية',
    field: 'الاهتمام',
    privacy: 'الاسم والمدرسة وصفة الإقامة لا تُرسل إلى خادم.',
    easyVisaLead: 'النقطة الأساسية للصفة المختارة فقط.',
  },
};

export function shellCopy(lang: SupportedLangCode): ShellCopy {
  return FRESHNESS_COPY[lang];
}

export function easySentence(text: string): string {
  const cut = text.split(/(?<=[.。])\s*/)[0] ?? text;
  return cut.length > 180 ? `${cut.slice(0, 180)}…` : cut;
}
