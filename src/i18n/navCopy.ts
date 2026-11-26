import type { InterestField, KoreanLevel } from '../data/admissionsData';
import type { BoardCategory } from '../data/board';
import type { SupportedLangCode } from '../kbridge';
import type { CareerGoal, GradeBand, GradeLevel, OnboardingStep, ParentForeign, SchoolKind, SupportNeed } from '../profile/profile';

export interface NavCopy {
  navLabel: string;
  tracks: string;
  board: string;
  my: string;
  teacher: string;
  dashTitle: string;
  dashLead: string;
  empty: string;
  edit: string;
  skip: string;
  next: string;
  back: string;
  later: string;
  finish: string;
  search: string;
  region: string;
  category: string;
  all: string;
  seoul: string;
  gyeonggi: string;
  source: string;
  checked: string;
  call: string;
  calendar: string;
  noPosts: string;
  backList: string;
  why: string;
  consentLead: string;
  yes: string;
  no: string;
  theme: string;
  light: string;
  dark: string;
  system: string;
  easy: string;
  motion: string;
  font: string;
  fontLarge: string;
  clear: string;
  privacy: string;
  print: string;
  cats: Record<BoardCategory, string>;
  grades: Record<GradeLevel, string>;
  parents: Record<ParentForeign, string>;
  schools: Record<SchoolKind, string>;
  korean: Record<KoreanLevel, string>;
  bands: Record<GradeBand, string>;
  goals: Record<CareerGoal, string>;
  needs: Record<SupportNeed, string>;
  fields: Record<InterestField, string>;
  ask: Record<OnboardingStep, string>;
  because: Record<OnboardingStep, string>;
}

const en: NavCopy = {
  navLabel: 'Sections',
  tracks: 'My tracks',
  board: 'Board',
  my: 'My page',
  teacher: 'Counselling notes',
  dashTitle: 'Tracks I can use',
  dashLead: 'Next step from the answers on this device.',
  empty: 'Answer a few questions and matching tracks show up here.',
  edit: 'Edit answers',
  skip: 'Skip',
  next: 'Next',
  back: 'Back',
  later: 'Finish later',
  finish: 'See my tracks',
  search: 'Search',
  region: 'Region',
  category: 'Category',
  all: 'All',
  seoul: 'Seoul',
  gyeonggi: 'Gyeonggi',
  source: 'Source',
  checked: 'Checked',
  call: 'Call',
  calendar: 'Calendar file',
  noPosts: 'Nothing matches.',
  backList: 'Back to the list',
  why: 'Why we ask',
  consentLead: 'Research use is off unless you turn it on. The app works either way.',
  yes: 'Yes',
  no: 'No',
  theme: 'Theme',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  easy: 'Easy Korean',
  motion: 'Reduce motion',
  font: 'Text size',
  fontLarge: 'Large',
  clear: 'Clear records on this device',
  privacy: 'Nothing is sent unless you opt in. Visa and ID numbers are not asked.',
  print: 'Print this list',
  cats: {
    support: 'Support and scholarships',
    korean: 'Korean classes',
    centers: 'Centers and phones',
    schedule: 'Dates',
    faq: 'FAQ',
    notice: 'Notices',
  },
  grades: { elementary: 'Elementary', middle: 'Middle school', high: 'High school' },
  parents: { father: 'Father', mother: 'Mother', both: 'Both', neither: 'Neither' },
  schools: {
    general: 'General school',
    vocational: 'Vocational high school',
    meister: 'Meister high school',
    alternative: 'Alternative program',
    not_enrolled: 'Not enrolled',
  },
  korean: { beginner: 'Beginner', topik_3_4: 'TOPIK 3–4', topik_5_6: 'TOPIK 5–6' },
  bands: { upper: 'Upper', middle: 'Middle', lower: 'Lower', unknown: 'Not sure' },
  goals: { study: 'Further study', work: 'Work' },
  needs: {
    korean_class: 'Korean class',
    documents: 'Documents',
    counseling: 'Counselling',
    fees: 'Fees',
    career: 'Career',
    interpretation: 'Interpretation',
  },
  fields: { it: 'IT', culinary: 'Cooking', design: 'Design', business: 'Business', health: 'Health' },
  ask: {
    lang: 'Which language?',
    grade: 'Which school level?',
    region: 'Where do you live?',
    type: 'Which student is this?',
    parents: 'Which parent was born outside Korea?',
    countries: 'Which country is that parent from?',
    languages: 'Which languages are used at home?',
    born: 'Were you born outside Korea?',
    arrived: 'Which year did you arrive in Korea?',
    years: 'How many years of school were abroad?',
    nationality: 'Do you have Korean nationality?',
    school: 'What kind of school are you in now?',
    korean: 'How is your Korean?',
    band: 'Roughly where are your grades?',
    interests: 'Which fields interest you?',
    goal: 'What is the next goal?',
    support: 'What help do you need?',
    consent: 'May we use anonymous answers for research?',
  },
  because: {
    lang: 'So the screens match the language you read.',
    grade: 'High-school and university tracks are different.',
    region: 'Seoul and Gyeonggi publish different guides.',
    type: 'It picks a starting point. You can still answer the questions below.',
    parents: 'Some tracks need both parents to be foreign nationals, and some exclude that.',
    countries: 'Origin is used only as a country code, for context and optional statistics.',
    languages: 'So Korean-class and interpretation posts can be filtered later.',
    born: 'The arrival year is asked only if you were born abroad.',
    arrived: 'It is a year, not a status of stay.',
    years: 'Some high-school tracks expect part of school to have been in Korea.',
    nationality: 'Multicultural university tracks in the checked guides are for Korean nationals.',
    school: 'Meister high schools are outside the vocational-graduate university track.',
    korean: 'Several university tracks need a TOPIK level.',
    band: 'A lower band still leaves the interview-based vocational track open.',
    interests: 'Vocational schools are listed by field.',
    goal: 'Study and work change which card is listed first.',
    support: 'Korean class, documents, and fees point to different board posts.',
    consent: 'Off by default. Anonymous fields only, and never visa or an ID number.',
  },
};

const ko: NavCopy = {
  ...en,
  navLabel: '메뉴',
  tracks: '내 전형',
  board: '게시판',
  my: '마이페이지',
  teacher: '상담 기록',
  dashTitle: '내가 쓸 수 있는 전형',
  dashLead: '이 기기의 답으로 고른 다음 단계입니다.',
  empty: '몇 가지만 답하면 맞는 전형이 여기에 나옵니다.',
  edit: '답 수정',
  skip: '건너뛰기',
  next: '다음',
  back: '뒤로',
  later: '나중에 끝내기',
  finish: '전형 보기',
  search: '검색',
  region: '지역',
  category: '분류',
  all: '전체',
  seoul: '서울',
  gyeonggi: '경기',
  source: '출처',
  checked: '확인',
  call: '전화',
  calendar: '일정 파일',
  noPosts: '맞는 글이 없습니다.',
  backList: '목록으로',
  why: '왜 묻나요',
  consentLead: '연구·통계 이용은 켜기 전까지 꺼져 있습니다. 켜지 않아도 앱은 같습니다.',
  yes: '예',
  no: '아니오',
  theme: '테마',
  light: '라이트',
  dark: '다크',
  system: '시스템',
  easy: '쉬운 한국어',
  motion: '움직임 줄이기',
  font: '글자 크기',
  fontLarge: '크게',
  clear: '이 기기의 기록 지우기',
  privacy: '동의하기 전에는 보내지 않습니다. 체류자격과 주민번호는 묻지 않습니다.',
  print: '이 목록 인쇄',
  cats: {
    support: '지원사업·장학',
    korean: '한국어 교육',
    centers: '센터·연락처',
    schedule: '일정',
    faq: '자주 묻는 질문',
    notice: '공지',
  },
  grades: { elementary: '초등', middle: '중학교', high: '고등학교' },
  parents: { father: '부', mother: '모', both: '둘 다', neither: '없음' },
  schools: {
    general: '일반 학교',
    vocational: '특성화고',
    meister: '마이스터고',
    alternative: '대안·위탁',
    not_enrolled: '학교 밖',
  },
  korean: { beginner: '초급', topik_3_4: 'TOPIK 3–4급', topik_5_6: 'TOPIK 5–6급' },
  bands: { upper: '상', middle: '중', lower: '하', unknown: '잘 모름' },
  goals: { study: '진학', work: '취업' },
  needs: {
    korean_class: '한국어 수업',
    documents: '서류',
    counseling: '상담',
    fees: '비용',
    career: '진로',
    interpretation: '통역',
  },
  fields: { it: 'IT·SW', culinary: '조리·관광', design: '디자인', business: '경영', health: '보건' },
  ask: {
    lang: '어떤 언어로 볼까요?',
    grade: '학교급은 어디인가요?',
    region: '어느 지역인가요?',
    type: '어떤 학생인가요?',
    parents: '외국에서 태어난 부모는 누구인가요?',
    countries: '그 부모의 출신 국가는 어디인가요?',
    languages: '집에서 어떤 언어를 쓰나요?',
    born: '한국 밖에서 태어났나요?',
    arrived: '한국에 온 해는 언제인가요?',
    years: '해외 학교 기간은 몇 년인가요?',
    nationality: '한국 국적인가요?',
    school: '지금 학교 종류는 무엇인가요?',
    korean: '한국어는 어느 정도인가요?',
    band: '성적은 대략 어느 정도인가요?',
    interests: '관심 분야가 있나요?',
    goal: '다음 목표는 무엇인가요?',
    support: '어떤 도움이 필요한가요?',
    consent: '익명 답을 연구·통계에 써도 될까요?',
  },
  because: {
    lang: '읽는 언어에 맞춰 화면을 바꿉니다.',
    grade: '고입 전형과 대입 전형이 다릅니다.',
    region: '서울과 경기 안내가 다릅니다.',
    type: '출발점입니다. 아래 질문으로 더 정확히 가려집니다.',
    parents: '부모 모두 외국 국적인 전형과, 그 경우를 빼는 전형이 있습니다.',
    countries: '국가 코드만 남습니다. 체류자격은 아닙니다.',
    languages: '한국어 수업·통역 글을 나중에 거르기 위해서입니다.',
    born: '해외 출생일 때만 입국 연도를 묻습니다.',
    arrived: '연도만 묻습니다. 체류자격은 묻지 않습니다.',
    years: '고입 특례는 국내 중학교를 다닌 경우를 봅니다.',
    nationality: '확인된 다문화 대학 전형은 한국 국적 기준입니다.',
    school: '마이스터고는 특성화고 졸업자 전형에서 빠집니다.',
    korean: '여러 대학 전형에 TOPIK 기준이 있습니다.',
    band: '성적이 낮아도 면접 중심 특성화고 전형은 열려 있습니다.',
    interests: '특성화고를 분야별로 보여 줍니다.',
    goal: '진학과 취업에 따라 앞에 오는 카드가 달라집니다.',
    support: '한국어·서류·비용은 게시판의 다른 글로 이어집니다.',
    consent: '기본은 끄기입니다. 익명 항목만이며 비자·주민번호는 없습니다.',
  },
};

const ar: NavCopy = {
  ...en,
  navLabel: 'الأقسام',
  tracks: 'مساراتي',
  board: 'اللوحة',
  my: 'صفحتي',
  teacher: 'ملاحظات الإرشاد',
  dashTitle: 'المسارات التي أستطيع استخدامها',
  dashLead: 'الخطوة التالية من الإجابات على هذا الجهاز.',
  empty: 'أجب عن بعض الأسئلة لتظهر المسارات المناسبة.',
  edit: 'تعديل الإجابات',
  skip: 'تخطٍ',
  next: 'التالي',
  back: 'رجوع',
  later: 'الإنهاء لاحقًا',
  finish: 'عرض المسارات',
  search: 'بحث',
  region: 'المنطقة',
  category: 'التصنيف',
  all: 'الكل',
  seoul: 'سيول',
  gyeonggi: 'كيونغي',
  source: 'المصدر',
  checked: 'التحقق',
  call: 'اتصال',
  calendar: 'ملف التقويم',
  noPosts: 'لا نتائج.',
  backList: 'العودة إلى القائمة',
  why: 'لماذا نسأل',
  consentLead: 'استخدام البحث متوقف إلا إذا فعّلته. التطبيق يعمل في الحالتين.',
  yes: 'نعم',
  no: 'لا',
  theme: 'المظهر',
  light: 'فاتح',
  dark: 'داكن',
  system: 'النظام',
  easy: 'كورية مبسطة',
  motion: 'تقليل الحركة',
  font: 'حجم الخط',
  fontLarge: 'كبير',
  clear: 'مسح سجلات هذا الجهاز',
  privacy: 'لا يُرسل شيء إلا بموافقتك. لا نسأل عن الإقامة أو رقم الهوية.',
  print: 'طباعة القائمة',
  cats: {
    support: 'الدعم والمنح',
    korean: 'تعليم الكورية',
    centers: 'المراكز والهواتف',
    schedule: 'المواعيد',
    faq: 'الأسئلة الشائعة',
    notice: 'إعلانات',
  },
  grades: { elementary: 'ابتدائي', middle: 'متوسط', high: 'ثانوي' },
  korean: { beginner: 'مبتدئ', topik_3_4: 'TOPIK 3–4', topik_5_6: 'TOPIK 5–6' },
  goals: { study: 'متابعة الدراسة', work: 'عمل' },
  ask: {
    ...en.ask,
    lang: 'أي لغة؟',
    grade: 'ما المرحلة الدراسية؟',
    region: 'أين تسكن؟',
    type: 'أي طالب؟',
    parents: 'أي من الوالدين وُلد خارج كوريا؟',
    countries: 'ما بلد المنشأ؟',
    languages: 'ما اللغات المستخدمة في البيت؟',
    born: 'هل وُلدت خارج كوريا؟',
    arrived: 'في أي سنة وصلت إلى كوريا؟',
    years: 'كم سنة درست في الخارج؟',
    nationality: 'هل لديك الجنسية الكورية؟',
    school: 'ما نوع مدرستك الآن؟',
    korean: 'كيف مستواك في الكورية؟',
    band: 'أين تقع درجاتك تقريبًا؟',
    interests: 'ما مجالات اهتمامك؟',
    goal: 'ما الهدف التالي؟',
    support: 'أي مساعدة تحتاج؟',
    consent: 'هل نستخدم الإجابات المجهولة للبحث؟',
  },
  because: {
    ...en.because,
    parents: 'بعض المسارات تشترط أن يكون الوالدان أجنبيين، وبعضها يستبعد ذلك.',
    nationality: 'مسارات الجامعات متعددة الثقافة التي تم التحقق منها للحاصلين على الجنسية الكورية.',
    consent: 'الإعداد الافتراضي متوقف. حقول مجهولة فقط، ومن دون تأشيرة أو رقم هوية.',
    arrived: 'نسأل عن السنة فقط، وليس عن صفة الإقامة.',
  },
};

const zhHans: NavCopy = {
  ...en,
  tracks: '我的招生',
  board: '信息板',
  my: '我的',
  dashTitle: '我可以申请的招生',
  empty: '回答几个问题后，符合的招生会显示在这里。',
  edit: '修改答案',
  skip: '跳过',
  next: '下一步',
  back: '返回',
  later: '稍后完成',
  finish: '查看招生',
  search: '搜索',
  all: '全部',
  seoul: '首尔',
  gyeonggi: '京畿',
  noPosts: '没有相符的内容。',
  cats: { support: '支援与奖学金', korean: '韩语教育', centers: '中心与电话', schedule: '日程', faq: '常见问题', notice: '公告' },
  privacy: '未经同意不会发送。不问停留资格和身份证号。',
};

const zhHant: NavCopy = {
  ...zhHans,
  tracks: '我的招生',
  board: '資訊板',
  my: '我的',
  dashTitle: '我可以申請的招生',
  empty: '回答幾個問題後，符合的招生會顯示在這裡。',
  edit: '修改答案',
  skip: '跳過',
  next: '下一步',
  back: '返回',
  later: '稍後完成',
  finish: '查看招生',
  search: '搜尋',
  all: '全部',
  seoul: '首爾',
  gyeonggi: '京畿',
  noPosts: '沒有相符的內容。',
  cats: { support: '支援與獎學金', korean: '韓語教育', centers: '中心與電話', schedule: '日程', faq: '常見問題', notice: '公告' },
  privacy: '未經同意不會傳送。不問停留資格和身分證號。',
};

const vi: NavCopy = {
  ...en,
  tracks: 'Tuyển sinh của tôi',
  board: 'Bảng tin',
  my: 'Trang của tôi',
  dashTitle: 'Tuyển sinh tôi có thể dùng',
  empty: 'Trả lời vài câu để thấy tuyển sinh phù hợp.',
  edit: 'Sửa câu trả lời',
  skip: 'Bỏ qua',
  next: 'Tiếp',
  back: 'Quay lại',
  later: 'Để sau',
  finish: 'Xem tuyển sinh',
  search: 'Tìm',
  all: 'Tất cả',
  seoul: 'Seoul',
  gyeonggi: 'Gyeonggi',
  noPosts: 'Không có bài phù hợp.',
  cats: { support: 'Hỗ trợ và học bổng', korean: 'Lớp tiếng Hàn', centers: 'Trung tâm', schedule: 'Lịch', faq: 'Câu hỏi', notice: 'Thông báo' },
  privacy: 'Không gửi nếu bạn chưa đồng ý. Không hỏi tình trạng cư trú hay số giấy tờ.',
};

const ru: NavCopy = {
  ...en,
  tracks: 'Мои треки',
  board: 'Доска',
  my: 'Моя страница',
  dashTitle: 'Куда я могу поступить',
  empty: 'Ответьте на несколько вопросов, и подходящие треки появятся здесь.',
  edit: 'Изменить ответы',
  skip: 'Пропустить',
  next: 'Дальше',
  back: 'Назад',
  later: 'Закончить позже',
  finish: 'Показать треки',
  search: 'Поиск',
  all: 'Все',
  seoul: 'Сеул',
  gyeonggi: 'Кёнги',
  noPosts: 'Ничего не найдено.',
  cats: { support: 'Поддержка и стипендии', korean: 'Корейский язык', centers: 'Центры', schedule: 'Даты', faq: 'Вопросы', notice: 'Объявления' },
  privacy: 'Ничего не отправляется без согласия. Визу и номер документа не спрашиваем.',
};

const mn: NavCopy = {
  ...en,
  tracks: 'Миний элсэлт',
  board: 'Самбар',
  my: 'Миний хуудас',
  dashTitle: 'Миний ашиглаж болох элсэлт',
  empty: 'Хэдэн асуултад хариулбал тохирох элсэлт энд гарна.',
  edit: 'Хариулт засах',
  skip: 'Алгасах',
  next: 'Дараах',
  back: 'Буцах',
  later: 'Дараа дуусгах',
  finish: 'Элсэлт харах',
  search: 'Хайх',
  all: 'Бүгд',
  seoul: 'Сөүл',
  gyeonggi: 'Кёнги',
  noPosts: 'Тохирох нийтлэл алга.',
  cats: { support: 'Дэмжлэг, тэтгэлэг', korean: 'Солонгос хэл', centers: 'Төв, утас', schedule: 'Хуваарь', faq: 'Асуулт', notice: 'Мэдээ' },
  privacy: 'Зөвшөөрөлгүйгээр илгээхгүй. Виз, регистрийн дугаар асуухгүй.',
};

const PACK: Record<SupportedLangCode, NavCopy> = {
  ko,
  en,
  'zh-Hans': zhHans,
  'zh-Hant': zhHant,
  vi,
  ru,
  mn,
  ar,
};

export function navCopy(lang: SupportedLangCode): NavCopy {
  return PACK[lang];
}
