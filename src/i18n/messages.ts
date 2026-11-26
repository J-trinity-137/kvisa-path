import type { SupportedLangCode } from '../kbridge';

export interface UiMessages {
  appTitle: string;
  appSubtitle: string;
  tabAdmissions: string;
  tabPrep: string;
  tabAnalytics: string;
  tabMethodology: string;
  langButton: string;
  statelessNoticeTitle: string;
  statelessNoticeBody: string;
  printSummaryBtn: string;
  speakCardCaption: string;
  speakCardNative: string;
  nextToPrep: string;
  nextToAnalytics: string;
  nextToMethodology: string;
  backToAdmissions: string;
  clearRecords: string;
  clearRecordsHint: string;
  clearRecordsDone: string;
  studentView: string;
  counselorView: string;
  scheduleClosed: string;
  scheduleOpen: string;
  pickerTitle: string;
  closeLabel: string;
  syntheticBadge: string;
}

const EN_MESSAGES: UiMessages = {
  appTitle: 'K-Visa Student Admission & Career Path',
  appSubtitle: 'Special high school & university tracks for migrant-background students + Seoul Edu analytics',
  tabAdmissions: '1. Admissions & Visa',
  tabPrep: '2. Docs · Quiz · Q&A',
  tabAnalytics: '3. Data Analytics',
  tabMethodology: '4. API & Validation',
  langButton: 'Language',
  clearRecords: 'Clear records on this device',
  clearRecordsHint: 'On a shared school computer, clear this before you leave. Questions and choices stay only in this browser until you do.',
  clearRecordsDone: 'Records in this browser were deleted.',
  studentView: 'Student',
  counselorView: 'Counselor',
  scheduleClosed: 'Closed',
  scheduleOpen: 'Open',
  pickerTitle: 'Language',
  closeLabel: 'Close',
  syntheticBadge: 'Synthetic example',
  statelessNoticeTitle: 'Zero-Tracking (Stateless):',
  statelessNoticeBody:
    'Visa status and background selections are never saved to any server or DB. Only anonymous term clicks and counseling steps are aggregated.',
  printSummaryBtn: 'Print / Save 1-Page Counseling PDF',
  speakCardCaption: 'Show to Career Counselor / Family Center',
  speakCardNative:
    'Please explain in simple Korean which special admission tracks I can apply for and which foreign documents are required.',
  nextToPrep: 'Go to Docs · Quiz · Q&A',
  nextToAnalytics: 'View Data Analytics',
  nextToMethodology: 'View API & Validation',
  backToAdmissions: 'Back to Admissions & Visa',
};

const DICT: Partial<Record<SupportedLangCode, UiMessages>> = {
  ko: {
    appTitle: 'K-Visa 학생 입학전형 · 진로 스킬트리',
    appSubtitle: '이주배경 중·고등학생 맞춤 고입·대입 특별전형 조회 및 서울시교육청 진로 병목 분석',
    tabAdmissions: '1. 입학전형 · 비자',
    tabPrep: '2. 서류 · 퀴즈 · 질문',
    tabAnalytics: '3. 데이터 분석',
    tabMethodology: '4. API · 연구 검증',
    langButton: '언어',
  clearRecords: '이 기기의 기록 지우기',
  clearRecordsHint: '학교 공용 컴퓨터에서는 마치기 전에 눌러 주세요. 질문 문장은 저장하지 않고, 남은 선택 기록도 이 브라우저에서 지워져요.',
  clearRecordsDone: '이 브라우저에 남아 있던 기록을 지웠어요.',
  studentView: '학생 화면',
  counselorView: '상담 교사 화면',
  scheduleClosed: '마감',
  scheduleOpen: '진행 중',
  pickerTitle: '언어',
  closeLabel: '닫기',
  syntheticBadge: '가상·예시 데이터',
    statelessNoticeTitle: '비저장(Stateless) 조회 원칙:',
    statelessNoticeBody:
      '체류자격·배경 선택값은 서버와 DB에 저장하지 않고 브라우저에서만 판정해요. 익명 통계에는 어려운 용어 선택·상담 연결 단계만 기록돼요.',
    printSummaryBtn: '상담용 1장 요약 인쇄(PDF)',
    speakCardCaption: '학교 진로상담실 · 가족센터용',
    speakCardNative:
      '제가 지원할 수 있는 고입·대입 특별전형과 필요한 해외 서류 목록을 쉬운 한국어로 알려 주세요.',
    nextToPrep: '서류 체크리스트 · 퀴즈 · 질문으로 이동',
    nextToAnalytics: '데이터 분석 대시보드 보기',
    nextToMethodology: '공공 API · 연구 검증 보기',
    backToAdmissions: '입학전형 · 비자 조회로 돌아가기',
  },
  en: EN_MESSAGES,
  'zh-Hans': {
    appTitle: 'K-Visa 移居背景学生升学与签证指南',
    appSubtitle: '韩国初高中特别招生查询、签证路径模拟与首尔教育厅数据分析',
    tabAdmissions: '1. 升学 · 签证',
    tabPrep: '2. 材料 · 测验 · 提问',
    tabAnalytics: '3. 数据分析',
    tabMethodology: '4. API · 研究验证',
    langButton: '语言',
  clearRecords: '清除这台设备上的记录',
  clearRecordsHint: '用学校公用电脑时，离开前请清除。问题原文不会保存，已留下的选择也只在这个浏览器里。',
  clearRecordsDone: '已删除这个浏览器里的记录。',
  studentView: '学生',
  counselorView: '咨询老师',
  scheduleClosed: '已截止',
  scheduleOpen: '进行中',
  pickerTitle: '语言',
  closeLabel: '关闭',
  syntheticBadge: '虚拟示例数据',
    statelessNoticeTitle: '无痕查询原则 (Stateless)：',
    statelessNoticeBody:
      '您的签证类型和家庭背景绝不会保存到服务器或数据库，仅在浏览器临时判断。匿名统计仅记录难懂术语点击与咨询连接步骤。',
    printSummaryBtn: '打印 / 保存1页咨询摘要 (PDF)',
    speakCardCaption: '给学校升学老师 / 家庭中心看',
    speakCardNative: '请用简单的韩语告诉我我可以申请哪些特别招生，以及需要准备哪些海外证明材料。',
    nextToPrep: '前往材料清单 · 测验 · 提问',
    nextToAnalytics: '查看学生数据分析',
    nextToMethodology: '查看公共API与验证',
    backToAdmissions: '返回升学与签证查询',
  },
  'zh-Hant': {
    appTitle: 'K-Visa 移居背景學生升學與簽證指南',
    appSubtitle: '韓國國高中特別招生查詢、簽證路徑模擬與首爾教育廳數據分析',
    tabAdmissions: '1. 升學 · 簽證',
    tabPrep: '2. 文件 · 測驗 · 提問',
    tabAnalytics: '3. 數據分析',
    tabMethodology: '4. API · 研究驗證',
    langButton: '語言',
  clearRecords: '清除這台裝置上的紀錄',
  clearRecordsHint: '使用學校公用電腦時，離開前請清除。問題原文不會保存，留下的選擇也只在這個瀏覽器裡。',
  clearRecordsDone: '已刪除這個瀏覽器裡的紀錄。',
  studentView: '學生',
  counselorView: '諮詢老師',
  scheduleClosed: '已截止',
  scheduleOpen: '進行中',
  pickerTitle: '語言',
  closeLabel: '關閉',
  syntheticBadge: '虛擬示例資料',
    statelessNoticeTitle: '無痕查詢原則 (Stateless)：',
    statelessNoticeBody:
      '您的簽證類型與家庭背景絕不會儲存至伺服器或資料庫，僅在瀏覽器暫時判斷。匿名統計僅記錄難懂術語點擊與諮詢連接步驟。',
    printSummaryBtn: '列印 / 儲存1頁諮詢摘要 (PDF)',
    speakCardCaption: '給學校升學老師 / 家庭中心看',
    speakCardNative: '請用簡單的韓語告訴我我可以申請哪些特別招生，以及需要準備哪些海外證明文件。',
    nextToPrep: '前往文件清單 · 測驗 · 提問',
    nextToAnalytics: '查看學生數據分析',
    nextToMethodology: '查看公共API與驗證',
    backToAdmissions: '返回升學與簽證查詢',
  },
  vi: {
    appTitle: 'K-Visa Hướng dẫn Tuyển sinh & Visa Học sinh',
    appSubtitle: 'Tra cứu diện tuyển sinh đặc biệt cấp 3 & đại học cho học sinh gốc di cư tại Hàn Quốc',
    tabAdmissions: '1. Tuyển sinh & Visa',
    tabPrep: '2. Hồ sơ · Quiz · Hỏi đáp',
    tabAnalytics: '3. Phân tích dữ liệu',
    tabMethodology: '4. API & Kiểm chứng',
    langButton: 'Ngôn ngữ',
  clearRecords: 'Xóa dữ liệu trên máy này',
  clearRecordsHint: 'Nếu dùng máy tính dùng chung ở trường, hãy xóa trước khi rời. Câu hỏi không được lưu nguyên văn.',
  clearRecordsDone: 'Đã xóa dữ liệu trên trình duyệt này.',
  studentView: 'Học sinh',
  counselorView: 'Tư vấn',
  scheduleClosed: 'Đã đóng',
  scheduleOpen: 'Đang mở',
  pickerTitle: 'Ngôn ngữ',
  closeLabel: 'Đóng',
  syntheticBadge: 'Dữ liệu ví dụ',
    statelessNoticeTitle: 'Nguyên tắc Không lưu trữ (Stateless):',
    statelessNoticeBody:
      'Thông tin visa và hoàn cảnh gia đình không bao giờ được lưu lên máy chủ. Hệ thống chỉ thống kê ẩn danh thuật ngữ khó và bước kết nối tư vấn.',
    printSummaryBtn: 'In / Lưu bản tóm tắt tư vấn (PDF)',
    speakCardCaption: 'Đưa cho giáo viên hướng nghiệp / Trung tâm gia đình',
    speakCardNative:
      'Xin hãy giải thích bằng tiếng Hàn đơn giản các diện tuyển sinh đặc biệt tôi có thể nộp và danh sách giấy tờ nước ngoài cần thiết.',
    nextToPrep: 'Đến Hồ sơ · Quiz · Hỏi đáp',
    nextToAnalytics: 'Xem bảng phân tích dữ liệu',
    nextToMethodology: 'Xem API & Kiểm chứng',
    backToAdmissions: 'Quay lại Tuyển sinh & Visa',
  },
  ru: {
    appTitle: 'K-Visa Поступление и визовый маршрут',
    appSubtitle: 'Специальные квоты в школы и вузы Кореи для учеников с миграционным опытом',
    tabAdmissions: '1. Поступление · Виза',
    tabPrep: '2. Документы · Тест · Вопрос',
    tabAnalytics: '3. Аналитика данных',
    tabMethodology: '4. API и проверка',
    langButton: 'Язык',
  clearRecords: 'Удалить записи на этом устройстве',
  clearRecordsHint: 'На общем школьном компьютере удалите записи перед уходом. Текст вопроса не сохраняется.',
  clearRecordsDone: 'Записи в этом браузере удалены.',
  studentView: 'Ученик',
  counselorView: 'Консультант',
  scheduleClosed: 'Закрыто',
  scheduleOpen: 'Идёт',
  pickerTitle: 'Язык',
  closeLabel: 'Закрыть',
  syntheticBadge: 'Учебный пример',
    statelessNoticeTitle: 'Без сохранения данных (Stateless):',
    statelessNoticeBody:
      'Визовый статус и данные о семье не сохраняются на сервере. В анонимную статистику попадают только клики по сложным терминам и шаги консультации.',
    printSummaryBtn: 'Печать / Сохранить PDF (1 стр.)',
    speakCardCaption: 'Покажите школьному консультанту / центру семьи',
    speakCardNative:
      'Пожалуйста, объясните простым корейским языком, на какие специальные квоты я могу подать и какие зарубежные документы нужны.',
    nextToPrep: 'К документам, тесту и вопросам',
    nextToAnalytics: 'Открыть аналитику данных',
    nextToMethodology: 'Открыть API и валидацию',
    backToAdmissions: 'Вернуться к поступлению',
  },
  mn: {
    appTitle: 'K-Visa Сурагчийн Элсэлт ба Визний Замнал',
    appSubtitle: 'Солонгосын ахлах сургууль, их сургуулийн тусгай элсэлт ба зөвлөгөөний хөтөч',
    tabAdmissions: '1. Элсэлт · Виз',
    tabPrep: '2. Бичиг · Тест · Асуулт',
    tabAnalytics: '3. Өгөгдлийн шинжилгээ',
    tabMethodology: '4. API ба Шалгалт',
    langButton: 'Хэл',
  clearRecords: 'Энэ төхөөрөмжийн тэмдэглэлийг устгах',
  clearRecordsHint: 'Сургуулийн нийтийн компьютерт гарахын өмнө дар. Асуултын эх текстийг хадгалдаггүй.',
  clearRecordsDone: 'Энэ хөтөч дээрх тэмдэглэлийг устгалаа.',
  studentView: 'Сурагч',
  counselorView: 'Зөвлөх',
  scheduleClosed: 'Хаагдсан',
  scheduleOpen: 'Нээлттэй',
  pickerTitle: 'Хэл',
  closeLabel: 'Хаах',
  syntheticBadge: 'Жишээ өгөгдөл',
    statelessNoticeTitle: 'Мэдээлэл хадгалахгүй (Stateless):',
    statelessNoticeBody:
      'Визний төрөл болон гэр бүлийн мэдээллийг серверт хадгалахгүй. Зөвхөн нэр томьёо болон зөвлөгөөний алхмыг нэргүйгээр тооцно.',
    printSummaryBtn: 'Зөвлөгөөний 1 хуудас хэвлэх (PDF)',
    speakCardCaption: 'Сургуулийн зөвлөх багш / Гэр бүлийн төвд үзүүлэх',
    speakCardNative:
      'Миний өргөдөл гаргаж болох тусгай элсэлт болон гадаадын шаардлагатай бичиг баримтыг энгийн солонгос хэлээр тайлбарлаж өгнө үү.',
    nextToPrep: 'Бичиг баримт · Тест рүү очих',
    nextToAnalytics: 'Өгөгдлийн шинжилгээ харах',
    nextToMethodology: 'API ба баталгаажуулалт харах',
    backToAdmissions: 'Элсэлт ба виз рүү буцах',
  },
  ar: {
    appTitle: 'K-Visa مسار القبول والتأشيرة للطلاب',
    appSubtitle: 'دليل القبول الخاص بالمدارس والجامعات الكورية للطلاب ذوي الخلفية المهاجرة',
    tabAdmissions: '1. القبول والتأشيرة',
    tabPrep: '2. المستندات · اختبار · سؤال',
    tabAnalytics: '3. تحليل البيانات',
    tabMethodology: '4. واجهات API والتحقق',
    langButton: 'اللغة',
  clearRecords: 'مسح السجلات على هذا الجهاز',
  clearRecordsHint: 'على جهاز المدرسة المشترك، امسح السجلات قبل المغادرة. لا يُحفظ نص السؤال.',
  clearRecordsDone: 'حُذفت السجلات من هذا المتصفح.',
  studentView: 'طالب',
  counselorView: 'مستشار',
  scheduleClosed: 'مغلق',
  scheduleOpen: 'جارٍ',
  pickerTitle: 'اللغة',
  closeLabel: 'إغلاق',
  syntheticBadge: 'بيانات توضيحية',
    statelessNoticeTitle: 'مبدأ عدم التخزين (Stateless):',
    statelessNoticeBody:
      'لا يتم حفظ نوع التأشيرة أو الخلفية العائلية في أي خادم أو قاعدة بيانات. يتم جمع إحصاءات مجهولة للمصطلحات الصعبة وخطوات الاستشارة فقط.',
    printSummaryBtn: 'طباعة / حفظ ملخص الاستشارة (PDF)',
    speakCardCaption: 'أظهر هذه البطاقة للمرشد المدرسي أو مركز الأسرة',
    speakCardNative:
      'يرجى شرح مسارات القبول الخاصة التي يمكنني التقديم إليها والمستندات الأجنبية المطلوبة بلغة كورية بسيطة.',
    nextToPrep: 'الانتقال إلى المستندات والاختبار',
    nextToAnalytics: 'عرض لوحة تحليل البيانات',
    nextToMethodology: 'عرض API والتحقق البحثي',
    backToAdmissions: 'العودة إلى القبول والتأشيرة',
  },
};

export function getUiMessages(lang: SupportedLangCode): UiMessages {
  return DICT[lang] ?? EN_MESSAGES;
}
