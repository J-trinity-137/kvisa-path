import type { SupportedLangCode } from '../kbridge';

export const MULTICULTURAL_NOTE: Record<SupportedLangCode, string> = {
  ko: '대교협 기본사항은 다문화가족 자녀를 기회균형 법정 대상이 아니라 대학이 정한 특별전형의 예시로 적습니다. 동국대 2027 수시 기회균형통합 자격에는 다문화 자녀가 없습니다. 나머지 대학의 2027 수시 원문은 이번 점검에서 열지 못했습니다.',
  en: 'The national admissions framework lists multicultural-family children as an example of a university-defined special track, not as a statutory equal-opportunity group. Dongguk’s 2027 early-admission equal-opportunity track does not list them. The 2027 early-admission guides of the other universities were not opened.',
  'zh-Hans': '大学招生基本事项把多文化家庭子女写成大学自定特别招生的例子，而不是法定机会均衡对象。东国大学2027随时招生的机会均衡统合资格里没有多文化子女。其他大学的2027随时招生原文这次没有打开。',
  'zh-Hant': '大學招生基本事項把多元文化家庭子女寫成大學自定特別招生的例子，而不是法定機會均衡對象。東國大學2027隨時招生的機會均衡統合資格裡沒有多元文化子女。其他大學的2027隨時招生原文這次沒有打開。',
  vi: 'Khung tuyển sinh quốc gia ghi con em gia đình đa văn hóa là ví dụ về tuyển riêng do trường đặt, không phải nhóm cơ hội bình đẳng theo luật. Tuyển cơ hội bình đẳng sớm 2027 của Đại học Dongguk không có nhóm này. Hướng dẫn sớm 2027 của các trường còn lại chưa được mở.',
  ru: 'Базовые правила приёма называют детей мультикультурных семей примером особого набора, который задаёт сам университет, а не обязательной группой равных возможностей. В раннем наборе Университета Тонгук 2027 года такой группы нет. Руководства раннего набора 2027 года остальных университетов не открывались.',
  mn: 'Элсэлтийн суурь дүрэм олон соёлын гэр бүлийн хүүхдийг их сургууль өөрөө тогтоосон тусгай элсэлтийн жишээ гэж бичсэн, хуулийн тэгш боломжийн бүлэг биш. Донгук их сургуулийн 2027 оны эрт элсэлтийн тэгш боломжид энэ бүлэг алга. Бусад их сургуулийн 2027 оны эрт элсэлтийн эх бичгийг нээгээгүй.',
  ar: 'إطار القبول الوطني يذكر أبناء الأسر متعددة الثقافات كمثال لمسار خاص تحدده الجامعة، لا كمجموعة تكافؤ فرص قانونية. مسار تكافؤ الفرص المبكر 2027 في جامعة دونغوك لا يذكرهم. لم تُفتح أدلة القبول المبكر 2027 للجامعات الأخرى.',
};

export const SCHOOL_MAJOR_LEAD: Record<SupportedLangCode, string> = {
  ko: '아래는 이 앱에 이미 있는 서울 직업계 고등학교 학과입니다. 새 직업 통계가 아닙니다.',
  en: 'These are majors already listed on the Seoul vocational schools in this app. They are not a new jobs survey.',
  'zh-Hans': '下面是这个应用里已有的首尔职业高中学科，不是新的职业统计。',
  'zh-Hant': '下面是這個應用裡已有的首爾職業高中學科，不是新的職業統計。',
  vi: 'Đây là ngành đã có trong các trường nghề Seoul của ứng dụng. Không phải khảo sát việc làm mới.',
  ru: 'Это специальности сеульских профессиональных школ, которые уже есть в приложении. Это не новый обзор профессий.',
  mn: 'Эдгээр нь апп дахь Сөүлийн мэргэжлийн сургуулийн мэргэжил. Шинэ ажлын судалгаа биш.',
  ar: 'هذه تخصصات مدارس مهنية في سيول موجودة أصلًا في التطبيق. ليست مسحًا جديدًا للوظائف.',
};

type Lang7 = Exclude<SupportedLangCode, 'ko'>;

type Doc = { name: string; whereToGet: string; tip: string };
type Quiz = { question: string; explanation: string };

export const EXTRA_DOCS: Record<Lang7, Record<string, Doc>> = {
  en: {
    'doc-special-form': {
      name: '2026 special high-school admission form (blank)',
      whereToGet: 'The hwp attachment on the Seoul education office post',
      tip: 'That post has no filled sample. Use the blank form only.',
    },
    'doc-elementary-residence': {
      name: 'Proof of residence for elementary enrollment',
      whereToGet: 'A lease or a residence guarantee',
      tip: 'Article 19 says these replace an immigration check when the guardian refuses it. The article names the elementary principal.',
    },
  },
  'zh-Hans': {
    'doc-special-form': {
      name: '2026学年高中特例申请表（空白）',
      whereToGet: '首尔教育厅帖子的 hwp 附件',
      tip: '那篇帖子没有填写范例。只用空白表格。',
    },
    'doc-elementary-residence': {
      name: '小学入学的居住证明',
      whereToGet: '租赁合同或居住保证书',
      tip: '施行令第19条说，监护人拒绝出入境核对时用这些文件只确认居住。条文的对象是小学校长。',
    },
  },
  'zh-Hant': {
    'doc-special-form': {
      name: '2026學年高中特例申請表（空白）',
      whereToGet: '首爾教育廳貼文的 hwp 附件',
      tip: '那篇貼文沒有填寫範例。只用空白表格。',
    },
    'doc-elementary-residence': {
      name: '小學入學的居住證明',
      whereToGet: '租賃合約或居住保證書',
      tip: '施行令第19條說，監護人拒絕出入境核對時用這些文件只確認居住。條文的對象是小學校長。',
    },
  },
  vi: {
    'doc-special-form': {
      name: 'Đơn đặc cách vào THPT 2026 (mẫu trống)',
      whereToGet: 'File hwp đính kèm trên bài của Sở giáo dục Seoul',
      tip: 'Bài đó không có mẫu đã điền. Chỉ dùng mẫu trống.',
    },
    'doc-elementary-residence': {
      name: 'Giấy cư trú để vào tiểu học',
      whereToGet: 'Hợp đồng thuê hoặc giấy bảo lãnh cư trú',
      tip: 'Điều 19 nói dùng các giấy này khi người giám hộ không đồng ý kiểm tra xuất nhập cảnh. Điều này chỉ nêu hiệu trưởng tiểu học.',
    },
  },
  ru: {
    'doc-special-form': {
      name: 'Бланк особого приёма в старшую школу 2026 года',
      whereToGet: 'Вложение hwp в записи управления образования Сеула',
      tip: 'Заполненного образца там нет. Используйте пустой бланк.',
    },
    'doc-elementary-residence': {
      name: 'Подтверждение проживания для начальной школы',
      whereToGet: 'Договор аренды или гарантия проживания',
      tip: 'Статья 19 говорит использовать их, если опекун отказывается от проверки въезда. Статья обращена к директору начальной школы.',
    },
  },
  mn: {
    'doc-special-form': {
      name: '2026 оны ахлах сургуулийн тусгай маягт (хоосон)',
      whereToGet: 'Сөүлийн боловсролын газрын нийтлэлийн hwp хавсралт',
      tip: 'Бөглөсөн жишээ алга. Зөвхөн хоосон маягтыг ашигла.',
    },
    'doc-elementary-residence': {
      name: 'Бага сургуульд орох оршин суух баримт',
      whereToGet: 'Түрээсийн гэрээ эсвэл оршин суух баталгаа',
      tip: '19-р зүйлд асран хамгаалагч хил нэвтрэлтийг шалгуулахгүй бол эдгээр баримтаар зөвхөн оршин суухыг батална гэж бичсэн. Өргөдөл хүлээн авагч нь бага сургуулийн захирал.',
    },
  },
  ar: {
    'doc-special-form': {
      name: 'نموذج القبول الخاص للثانوية لعام 2026 (فارغ)',
      whereToGet: 'مرفق hwp في منشور مكتب التعليم في سيول',
      tip: 'المنشور بلا نموذج معبّأ. استخدم النموذج الفارغ فقط.',
    },
    'doc-elementary-residence': {
      name: 'إثبات سكن للالتحاق بالابتدائية',
      whereToGet: 'عقد إيجار أو ضمان سكن',
      tip: 'المادة 19 تقول إن هذه الوثائق تكفي لإثبات السكن إذا رفض الوصي فحص الهجرة. المخاطب هو مدير المدرسة الابتدائية.',
    },
  },
};

export const EXTRA_QUIZ: Record<Lang7, Record<string, Quiz>> = {
  en: {
    'quiz-2': {
      question: 'Article 19 says a foreign child may apply to the elementary principal of the school district.',
      explanation: 'If the guardian refuses an immigration check, a lease or a residence guarantee confirms residence only. The article names the elementary principal, not middle or high school.',
    },
    'quiz-5': {
      question: 'The D-10 job-seeker stay cap is two years for everyone.',
      explanation: 'The June 2026 manual sets the ceiling at up to three years. General D-10-1 is three years at 80 points or more, and one year from 60 up to 80.',
    },
    'quiz-6': {
      question: 'Soongsil pays the same TOPIK scholarship rate every semester.',
      explanation: 'The university page says one time, the first semester after entry for students admitted from 2025. Level 3 is 40%, 4 is 60%, 5 is 80%, and 6 is 100%.',
    },
    'quiz-7': {
      question: 'After an E-9 stay ends, you can change to D-2 inside Korea in order to study.',
      explanation: 'The June 2026 manual says study itself may not need a permit, but changing to D-2 for study after that stay ends is not allowed. You leave and get a visa.',
    },
    'quiz-8': {
      question: 'Konkuk’s spring 2027 foreign-student track accepts the GED.',
      explanation: 'The spring 2027 guide says the GED, correspondence, online, lifelong, and language courses are not accepted as academic credentials.',
    },
  },
  'zh-Hans': {
    'quiz-2': {
      question: '施行令第19条写明，外国儿童可以向学区的小学校长申请入学。',
      explanation: '监护人拒绝出入境核对时，用租赁合同或居住保证书只确认居住。条文的对象是小学校长，不是中学或高中。',
    },
    'quiz-5': {
      question: '求职 D-10 的停留上限对所有人都是两年。',
      explanation: '2026年6月手册把上限写成最多三年。一般 D-10-1 在80分以上是三年，60分到不满80分是一年。',
    },
    'quiz-6': {
      question: '崇实大学的外国人 TOPIK 奖学金每个学期按同一比例发放。',
      explanation: '学校页面写的是2025学年及以后入学的人，入学后第一个学期一次。3级40%、4级60%、5级80%、6级100%。',
    },
    'quiz-7': {
      question: 'E-9 停留结束后，可以在韩国国内以学业为由改成 D-2。',
      explanation: '2026年6月手册写，学习本身可以不另许可，但那段停留结束后不能以学业为由改成 D-2，要出境后办签证。',
    },
    'quiz-8': {
      question: '建国大学2027春季外国人特别招生承认检定考试学历。',
      explanation: '2027春季简章写明检定考试、函授、网课、终身教育和语言课程不算学历。',
    },
  },
  'zh-Hant': {
    'quiz-2': {
      question: '施行令第19條寫明，外國兒童可以向學區的小學校長申請入學。',
      explanation: '監護人拒絕出入境核對時，用租賃合約或居住保證書只確認居住。條文的對象是小學校長，不是中學或高中。',
    },
    'quiz-5': {
      question: '求職 D-10 的停留上限對所有人都是兩年。',
      explanation: '2026年6月手冊把上限寫成最多三年。一般 D-10-1 在80分以上是三年，60分到不滿80分是一年。',
    },
    'quiz-6': {
      question: '崇實大學的外國人 TOPIK 獎學金每個學期按同一比例發放。',
      explanation: '學校頁面寫的是2025學年及以後入學的人，入學後第一個學期一次。3級40%、4級60%、5級80%、6級100%。',
    },
    'quiz-7': {
      question: 'E-9 停留結束後，可以在韓國國內以學業為由改成 D-2。',
      explanation: '2026年6月手冊寫，學習本身可以不另許可，但那段停留結束後不能以學業為由改成 D-2，要出境後辦簽證。',
    },
    'quiz-8': {
      question: '建國大學2027春季外國人特別招生承認檢定考試學歷。',
      explanation: '2027春季簡章寫明檢定考試、函授、網課、終身教育和語言課程不算學歷。',
    },
  },
  vi: {
    'quiz-2': {
      question: 'Điều 19 nói trẻ em nước ngoài có thể nộp đơn cho hiệu trưởng tiểu học của học khu.',
      explanation: 'Nếu người giám hộ không đồng ý kiểm tra xuất nhập cảnh, hợp đồng thuê hoặc giấy bảo lãnh chỉ xác nhận cư trú. Điều này nêu hiệu trưởng tiểu học, không phải trung học.',
    },
    'quiz-5': {
      question: 'Trần thời gian D-10 tìm việc là hai năm với mọi người.',
      explanation: 'Sổ tay tháng 6/2026 đặt trần tối đa ba năm. D-10-1 thường là ba năm từ 80 điểm, và một năm từ 60 đến dưới 80.',
    },
    'quiz-6': {
      question: 'Đại học Soongsil trả học bổng TOPIK cùng một tỷ lệ mỗi học kỳ.',
      explanation: 'Trang trường nói một lần ở học kỳ đầu sau nhập học, với người nhập học từ 2025. Cấp 3 là 40%, 4 là 60%, 5 là 80%, 6 là 100%.',
    },
    'quiz-7': {
      question: 'Sau khi E-9 kết thúc, có thể đổi sang D-2 trong Hàn Quốc để học.',
      explanation: 'Sổ tay tháng 6/2026 nói việc học có thể không cần giấy phép riêng, nhưng hết thời hạn đó thì không đổi sang D-2 vì học. Phải xuất cảnh rồi xin visa.',
    },
    'quiz-8': {
      question: 'Tuyển sinh nước ngoài xuân 2027 của Đại học Konkuk công nhận GED.',
      explanation: 'Hướng dẫn xuân 2027 nói GED, học từ xa, học trực tuyến, giáo dục suốt đời và khóa tiếng không được tính là học lực.',
    },
  },
  ru: {
    'quiz-2': {
      question: 'Статья 19 говорит, что иностранный ребёнок может подать заявление директору начальной школы района.',
      explanation: 'Если опекун отказывается от проверки въезда, договор аренды или гарантия подтверждают только проживание. Статья обращена к директору начальной школы, не средней и не старшей.',
    },
    'quiz-5': {
      question: 'Потолок D-10 для поиска работы — два года для всех.',
      explanation: 'Справочник июня 2026 года ставит потолок до трёх лет. Обычный D-10-1 — три года от 80 баллов и один год от 60 до 80.',
    },
    'quiz-6': {
      question: 'Университет Сунсиль платит одну и ту же долю стипендии TOPIK каждый семестр.',
      explanation: 'Страница университета говорит об одном разе в первом семестре для поступивших с 2025 года. 3 уровень 40%, 4 — 60%, 5 — 80%, 6 — 100%.',
    },
    'quiz-7': {
      question: 'После окончания E-9 можно сменить статус на D-2 внутри Кореи ради учёбы.',
      explanation: 'Справочник июня 2026 года говорит, что учёба может не требовать отдельного разрешения, но после окончания этого пребывания менять статус на D-2 ради учёбы нельзя. Нужно выехать и получить визу.',
    },
    'quiz-8': {
      question: 'Весенний набор иностранцев 2027 года университета Конкук принимает GED.',
      explanation: 'Весеннее руководство 2027 года говорит, что GED, заочное, онлайн, непрерывное образование и языковые курсы не считаются образованием.',
    },
  },
  mn: {
    'quiz-2': {
      question: '19-р зүйлд гадаадын хүүхэд сургуулийн тойргийн бага сургуулийн захиралд өргөдөл гаргаж болно гэж бичсэн.',
      explanation: 'Асран хамгаалагч хил нэвтрэлтийг шалгуулахгүй бол түрээс эсвэл оршин суух баталгаа зөвхөн оршин суухыг батална. Зүйл бага сургуулийн захирлыг заасан, дунд ба ахлахыг биш.',
    },
    'quiz-5': {
      question: 'Ажил хайх D-10-ийн дээд хугацаа хүн бүрт хоёр жил.',
      explanation: '2026 оны 6-р сарын гарын авлага дээд хязгаарыг хамгийн ихдээ гурван жил гэж бичсэн. Ердийн D-10-1 нь 80 ба түүнээс дээш бол гурван жил, 60-аас 80 хүртэл бол нэг жил.',
    },
    'quiz-6': {
      question: 'Сүнсил их сургууль TOPIK-ийн тэтгэлгийг улирал бүр ижил хувиар өгнө.',
      explanation: 'Сургуулийн хуудас 2025 оноос элсэгчдийн эхний улиралд нэг удаа гэж бичсэн. 3-р зэрэг 40%, 4: 60%, 5: 80%, 6: 100%.',
    },
    'quiz-7': {
      question: 'E-9 дууссаны дараа сурах гэж Солонгос дотор D-2 болгож болно.',
      explanation: '2026 оны 6-р сарын гарын авлагад суралцах нь тусдаа зөвшөөрөлгүй байж болох ч тэр хугацаа дууссаны дараа сурах гэж D-2 болгохгүй, гарч виз авна гэж бичсэн.',
    },
    'quiz-8': {
      question: 'Конкук их сургуулийн 2027 хаврын гадаадын элсэлт GED-г хүлээн зөвшөөрнө.',
      explanation: '2027 хаврын гарын авлагад GED, захидал, цахим, насан туршийн болон хэлний сургалтыг боловсрол гэж үзэхгүй гэж бичсэн.',
    },
  },
  ar: {
    'quiz-2': {
      question: 'المادة 19 تقول إن الطفل الأجنبي يمكنه التقديم إلى مدير المدرسة الابتدائية في منطقته.',
      explanation: 'إذا رفض الوصي فحص الهجرة، فعقد الإيجار أو ضمان السكن يثبت السكن فقط. المادة تخاطب مدير الابتدائية لا المتوسطة ولا الثانوية.',
    },
    'quiz-5': {
      question: 'سقف إقامة D-10 للبحث عن عمل سنتان للجميع.',
      explanation: 'دليل يونيو 2026 يضع السقف عند ثلاث سنوات كحد أقصى. D-10-1 العام ثلاث سنوات من 80 نقطة، وسنة واحدة من 60 إلى أقل من 80.',
    },
    'quiz-6': {
      question: 'جامعة سونغسيل تدفع منحة TOPIK بالنسبة نفسها كل فصل.',
      explanation: 'صفحة الجامعة تقول مرة واحدة في الفصل الأول بعد الالتحاق لمن التحق من 2025. المستوى 3 بنسبة 40%، و4 بنسبة 60%، و5 بنسبة 80%، و6 بنسبة 100%.',
    },
    'quiz-7': {
      question: 'بعد انتهاء E-9 يمكن التغيير إلى D-2 داخل كوريا من أجل الدراسة.',
      explanation: 'دليل يونيو 2026 يقول إن الدراسة قد لا تحتاج إذنًا منفصلًا، لكن بعد انتهاء تلك الإقامة لا يُسمح بالتغيير إلى D-2 للدراسة. تغادر ثم تحصل على تأشيرة.',
    },
    'quiz-8': {
      question: 'قبول الأجانب لربيع 2027 في جامعة كونكوك يعترف باختبار المعادلة.',
      explanation: 'دليل ربيع 2027 يقول إن المعادلة والتعليم بالمراسلة وعبر الإنترنت والتعليم مدى الحياة ودورات اللغة لا تُعد مؤهلًا دراسيًا.',
    },
  },
};

export const PROCEDURE_COPY: Record<Lang7, Record<string, { title: string; body: string }>> = {
  en: {
    'ksl-online': {
      title: 'Official online Korean study',
      body: 'Danuri’s free online Korean page lists Nuri-Sejong (speaking, listening, reading, writing) and EBS Durian for marriage migrants and multicultural children, including school clips. The National Institute of Korean Language textbook search includes materials for multicultural elementary, middle, and high school students in Korea. These pages do not assign a school seat.',
    },
  },
  'zh-Hans': {
    'ksl-online': {
      title: '官方在线韩语学习',
      body: '多文化门户的免费在线韩语页列出了世宗学堂在线（听说读写）和 EBS Durian（结婚移民和多文化家庭子女，含中小学课程片段）。国立国语院教材检索包含国内多文化小学生和中高中生的教材。这些页面不分配学校名额。',
    },
  },
  'zh-Hant': {
    'ksl-online': {
      title: '官方線上韓語學習',
      body: '多元文化入口的免費線上韓語頁列出了世宗學堂線上（聽說讀寫）和 EBS Durian（結婚移民和多元文化家庭子女，含中小學課程片段）。國立國語院教材檢索包含國內多元文化小學生和中高中生的教材。這些頁面不分配學校名額。',
    },
  },
  vi: {
    'ksl-online': {
      title: 'Học tiếng Hàn trực tuyến chính thức',
      body: 'Trang tiếng Hàn miễn phí của Danuri nêu Nuri-Sejong (nói, nghe, đọc, viết) và EBS Durian cho người kết hôn nhập cư và con em gia đình đa văn hóa, gồm clip môn học. Trang giáo trình của Viện quốc ngữ có tài liệu cho học sinh tiểu học, trung học đa văn hóa trong nước. Các trang này không xếp chỗ ở trường.',
    },
  },
  ru: {
    'ksl-online': {
      title: 'Официальное онлайн-изучение корейского',
      body: 'Бесплатная страница Данури называет Нури-Седжон (говорение, аудирование, чтение, письмо) и EBS Durian для супругов-мигрантов и детей мультикультурных семей, включая школьные ролики. Поиск учебников Национального института корейского языка включает материалы для мультикультурных учеников начальной, средней и старшей школы. Эти страницы не распределяют место в школе.',
    },
  },
  mn: {
    'ksl-online': {
      title: 'Албан ёсны цахим солонгос хэл',
      body: 'Дануригийн үнэгүй хуудас Нури-Сежон (ярих, сонсох, унших, бичих) болон гэрлэлтийн цагаач, олон соёлын хүүхдэд зориулсан EBS Durian-г бичсэн. Үндэсний хэлний хүрээлэнгийн сурах бичгийн хайлт дотоодын олон соёлын бага, дунд, ахлах сурагчдын материалтай. Эдгээр хуудас сургуулийн суудал хуваарилдаггүй.',
    },
  },
  ar: {
    'ksl-online': {
      title: 'تعلم كوري رسمي عبر الإنترنت',
      body: 'صفحة دانوري المجانية تذكر نوري-سيجونغ (كلام واستماع وقراءة وكتابة) وEBS دوريان للمهاجرين بالزواج وأبناء الأسر متعددة الثقافات، بما في ذلك مقاطع مدرسية. بحث كتب المعهد الوطني للغة الكورية يشمل مواد لطلاب ابتدائي ومتوسط وثانوي متعددي الثقافات داخل كوريا. هذه الصفحات لا تخصص مقعدًا مدرسيًا.',
    },
  },
};
