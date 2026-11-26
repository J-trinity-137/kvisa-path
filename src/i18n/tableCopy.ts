import { UNIVERSITY_TOPIK_TABLE, type UniversityId } from '../data/admissionsData';
import type { SupportedLangCode } from '../kbridge';

type Lang7 = Exclude<SupportedLangCode, 'ko'>;

const LANGS: Lang7[] = ['en', 'zh-Hans', 'zh-Hant', 'vi', 'ru', 'mn', 'ar'];

export interface UniversityCell {
  ged: string;
  track: string;
  note: string;
}

const REJECTED: Record<Lang7, string> = {
  en: 'Not accepted',
  'zh-Hans': '不承认',
  'zh-Hant': '不承認',
  vi: 'Không công nhận',
  ru: 'Не принимается',
  mn: 'Хүлээн зөвшөөрөхгүй',
  ar: 'غير مقبول',
};

const UNKNOWN: Record<Lang7, string> = {
  en: 'Not confirmed',
  'zh-Hans': '未确认',
  'zh-Hant': '未確認',
  vi: 'Chưa xác nhận',
  ru: 'Не подтверждено',
  mn: 'Баталгаажаагүй',
  ar: 'غير مؤكد',
};

const REGULAR: Record<Lang7, string> = {
  en: 'In principle not accepted (regular high school)',
  'zh-Hans': '原则上不承认（正规高中）',
  'zh-Hant': '原則上不承認（正規高中）',
  vi: 'Về nguyên tắc không công nhận (THPT chính quy)',
  ru: 'Как правило не принимается (обычная школа)',
  mn: 'Зарчмын хувьд хүлээн зөвшөөрөхгүй (ердийн сургууль)',
  ar: 'غير مقبول من حيث المبدأ (ثانوية نظامية)',
};

interface Row {
  ged: 'rejected' | 'regular' | 'unknown';
  track: Record<Lang7, string>;
  note: Record<Lang7, string>;
}

const ROWS: Record<UniversityId, Row> = {
  ssu: {
    ged: 'rejected',
    track: {
      en: 'Regular admission, group C, 10 seats (CSAT 100%)',
      'zh-Hans': '正时 C 组 10 人（学能 100%）',
      'zh-Hant': '正時 C 組 10 人（學能 100%）',
      vi: 'Tuyển chính thức nhóm C, 10 chỗ (CSAT 100%)',
      ru: 'Основной набор, группа C, 10 мест (CSAT 100%)',
      mn: 'Үндсэн элсэлт, C бүлэг, 10 суудал (CSAT 100%)',
      ar: 'قبول عام، المجموعة C، 10 مقاعد (اختبار القدرات 100%)',
    },
    note: {
      en: 'First semester only (entrants from 2025). Level 3 40%, 4 60%, 5 80%, 6 100%. Checked on the university page on 2026-11-26.',
      'zh-Hans': '仅入学后第一个学期（2025学年及以后入学）。3级 40%、4级 60%、5级 80%、6级 100%。2026-11-26 在学校页面核对。',
      'zh-Hant': '僅入學後第一個學期（2025學年及以後入學）。3級 40%、4級 60%、5級 80%、6級 100%。2026-11-26 在學校頁面核對。',
      vi: 'Chỉ học kỳ đầu (nhập học từ 2025). Cấp 3: 40%, 4: 60%, 5: 80%, 6: 100%. Đã xem trang trường ngày 2026-11-26.',
      ru: 'Только первый семестр (поступившие с 2025). 3 уровень 40%, 4 — 60%, 5 — 80%, 6 — 100%. Страница университета, 2026-11-26.',
      mn: 'Зөвхөн эхний улирал (2025 оноос элсэгчид). 3-р зэрэг 40%, 4: 60%, 5: 80%, 6: 100%. Сургуулийн хуудас, 2026-11-26.',
      ar: 'الفصل الأول فقط (الملتحقون من 2025). المستوى 3: 40%، 4: 60%، 5: 80%، 6: 100%. صفحة الجامعة في 2026-11-26.',
    },
  },
  konkuk: {
    ged: 'rejected',
    track: {
      en: 'Early admission, holistic review, 22 seats (documents 70 + school record 30)',
      'zh-Hans': '随时综合 22 人（材料 70 + 学生簿 30）',
      'zh-Hant': '隨時綜合 22 人（材料 70 + 學生簿 30）',
      vi: 'Tuyển sớm hồ sơ tổng hợp, 22 chỗ (hồ sơ 70 + học bạ 30)',
      ru: 'Досрочный набор, 22 места (документы 70 + табель 30)',
      mn: 'Эрт элсэлт, 22 суудал (баримт 70 + дүн 30)',
      ar: 'قبول مبكر، 22 مقعدًا (وثائق 70 + سجل 30)',
    },
    note: {
      en: '2027 spring guide: GED not accepted. First-semester award is level 3 30%, 4 50%, 5 70%, 6 100% (deducted on the bill). Korean-track freshmen need at least level 4. F visas are exempt from the bank-balance letter.',
      'zh-Hans': '2027 春季简章：检定考试不承认。第一学期奖学金为 3级 30%、4级 50%、5级 70%、6级 100%（通知书减免）。韩语轨道新生最低 4 级。F 签证免余额证明。',
      'zh-Hant': '2027 春季簡章：檢定考試不承認。第一學期獎學金為 3級 30%、4級 50%、5級 70%、6級 100%（通知書減免）。韓語軌道新生最低 4 級。F 簽證免餘額證明。',
      vi: 'Hướng dẫn xuân 2027: không nhận GED. Học kỳ đầu: cấp 3 là 30%, 4 là 50%, 5 là 70%, 6 là 100% (trừ trên giấy báo). Tân sinh viên ngành tiếng Hàn cần tối thiểu cấp 4. Visa F được miễn giấy số dư.',
      ru: 'Весна 2027: GED не принимается. Первый семестр: 3 уровень 30%, 4 — 50%, 5 — 70%, 6 — 100% (вычет в счёте). Для корейского трека минимум 4 уровень. Виза F без справки об остатке.',
      mn: '2027 хавар: GED хүлээн авахгүй. Эхний улирал: 3-р зэрэг 30%, 4: 50%, 5: 70%, 6: 100% (тооцоонд хасна). Солонгос хэлний замд хамгийн багадаа 4-р зэрэг. F визэд үлдэгдлийн тодорхойлолт хэрэггүй.',
      ar: 'دليل ربيع 2027: اختبار المعادلة غير مقبول. الفصل الأول: المستوى 3 بنسبة 30%، و4 بنسبة 50%، و5 بنسبة 70%، و6 بنسبة 100% (يُخصم في الإشعار). مسار الكورية للجدد يتطلب المستوى 4 على الأقل. تأشيرات F معفاة من إثبات الرصيد.',
    },
  },
  kookmin: {
    ged: 'rejected',
    track: {
      en: 'Early admission for workers (documents 100%) · regular admission, outside quota',
      'zh-Hans': '随时在职者（材料 100%）· 正时定员外',
      'zh-Hant': '隨時在職者（材料 100%）· 正時定員外',
      vi: 'Tuyển sớm cho người đang làm (hồ sơ 100%) · tuyển chính thức ngoài chỉ tiêu',
      ru: 'Досрочный набор для работающих (документы 100%) · основной набор вне квоты',
      mn: 'Эрт элсэлт, ажил эрхлэгч (баримт 100%) · үндсэн элсэлт, квотын гадна',
      ar: 'قبول مبكر للعاملين (وثائق 100%) · قبول عام خارج الحصة',
    },
    note: {
      en: '2027 spring freshman guide: GED, homeschooling, and online study are not accepted. First semester only: level 3 is 30%, 4 is 50%, 5 is 70%, 6 is 100%. No minimum TOPIK level. No multicultural-track URL in this guide.',
      'zh-Hans': '2027春季新生简章：不承认检定考试、家庭学校和网课。仅第一学期：3级30%、4级50%、5级70%、6级100%。没有最低TOPIK等级。简章没有多文化选拔网址。',
      'zh-Hant': '2027春季新生簡章：不承認檢定考試、家庭學校和網課。僅第一學期：3級30%、4級50%、5級70%、6級100%。沒有最低TOPIK等級。簡章沒有多文化選拔網址。',
      vi: 'Hướng dẫn tân sinh viên xuân 2027: không nhận GED, học tại nhà, học trực tuyến. Chỉ học kỳ đầu: cấp 3 là 30%, 4 là 50%, 5 là 70%, 6 là 100%. Không có cấp TOPIK tối thiểu. Không có địa chỉ tuyển đa văn hóa trong hướng dẫn này.',
      ru: 'Весна 2027, первокурсники: GED, домашнее и онлайн-обучение не принимаются. Только первый семестр: 3 уровень 30%, 4 — 50%, 5 — 70%, 6 — 100%. Минимального TOPIK нет. Адреса многокультурного трека в этом руководстве нет.',
      mn: '2027 хаврын шинэ оюутны гарын авлага: GED, гэрийн болон цахим сургалтыг хүлээж авахгүй. Зөвхөн эхний улирал: 3-р зэрэг 30%, 4: 50%, 5: 70%, 6: 100%. Доод TOPIK зэрэг байхгүй. Энэ гарын авлагад олон соёлын замын хаяг алга.',
      ar: 'دليل ربيع 2027 للجدد: المعادلة والتعليم المنزلي والدراسة عبر الإنترنت غير مقبولة. الفصل الأول فقط: المستوى 3 بنسبة 30%، و4 بنسبة 50%، و5 بنسبة 70%، و6 بنسبة 100%. لا حد أدنى لـ TOPIK. لا عنوان لمسار متعدد الثقافات في هذا الدليل.',
    },
  },
  seoultech: {
    ged: 'rejected',
    track: {
      en: 'Early and regular admission, outside quota (engineering and IT)',
      'zh-Hans': '随时·正时定员外（工学·IT）',
      'zh-Hant': '隨時·正時定員外（工學·IT）',
      vi: 'Tuyển sớm và chính thức, ngoài chỉ tiêu (kỹ thuật và IT)',
      ru: 'Досрочный и основной набор вне квоты (инженерия и IT)',
      mn: 'Эрт ба үндсэн элсэлт, квотын гадна (инженер, IT)',
      ar: 'قبول مبكر وعام خارج الحصة (هندسة وتقنية معلومات)',
    },
    note: {
      en: 'March 2027 guide: GED, homeschooling, and online study are not accepted. The new-student award is the first semester only and depends on document grades A/B/C. Grade C gets nothing. No multicultural-track URL in this guide.',
      'zh-Hans': '2027年3月简章：不承认检定考试、家庭学校和网课。新生奖学金仅第一学期，并按材料等级A/B/C区分。C级没有。简章没有多文化选拔网址。',
      'zh-Hant': '2027年3月簡章：不承認檢定考試、家庭學校和網課。新生獎學金僅第一學期，並按材料等級A/B/C區分。C級沒有。簡章沒有多文化選拔網址。',
      vi: 'Hướng dẫn tháng 3/2027: không nhận GED, học tại nhà, học trực tuyến. Học bổng tân sinh viên chỉ học kỳ đầu và theo hạng hồ sơ A/B/C. Hạng C không có. Không có địa chỉ tuyển đa văn hóa.',
      ru: 'Март 2027: GED, домашнее и онлайн-обучение не принимаются. Стипендия новичкам только в первом семестре и зависит от оценки документов A/B/C. Оценка C ничего не даёт. Адреса многокультурного трека нет.',
      mn: '2027 оны 3-р сар: GED, гэрийн болон цахим сургалтыг хүлээж авахгүй. Шинэ оюутны тэтгэлэг зөвхөн эхний улиралд, баримтын A/B/C үнэлгээгээр. C үнэлгээнд алга. Олон соёлын замын хаяг алга.',
      ar: 'دليل مارس 2027: المعادلة والتعليم المنزلي والدراسة عبر الإنترنت غير مقبولة. منحة الجدد للفصل الأول فقط وتتبع تقدير الوثائق A/B/C. التقدير C بلا منحة. لا عنوان لمسار متعدد الثقافات.',
    },
  },
  uos: {
    ged: 'rejected',
    track: {
      en: 'Regular admission, group B, 24 seats (CSAT 100%)',
      'zh-Hans': '正时 B 组 24 人（学能 100%）',
      'zh-Hant': '正時 B 組 24 人（學能 100%）',
      vi: 'Tuyển chính thức nhóm B, 24 chỗ (CSAT 100%)',
      ru: 'Основной набор, группа B, 24 места (CSAT 100%)',
      mn: 'Үндсэн элсэлт, B бүлэг, 24 суудал (CSAT 100%)',
      ar: 'قبول عام، المجموعة B، 24 مقعدًا (اختبار القدرات 100%)',
    },
    note: {
      en: '2027 foreign-student guide: GED, homeschooling, online study, and language institutes are not accepted. The award is not by TOPIK level: top 30% get full tuition and the next 20% half, first semester only. The old 2.15 million won figure is not in this guide. No multicultural-track URL.',
      'zh-Hans': '2027外国学生简章：不承认检定考试、家庭学校、网课和语言学院。奖学金不按TOPIK等级：前30%全额，其后20%半额，仅第一学期。旧的215万韩元不在这份简章里。没有多文化选拔网址。',
      'zh-Hant': '2027外國學生簡章：不承認檢定考試、家庭學校、網課和語言學院。獎學金不按TOPIK等級：前30%全額，其後20%半額，僅第一學期。舊的215萬韓元不在這份簡章裡。沒有多文化選拔網址。',
      vi: 'Hướng dẫn sinh viên nước ngoài 2027: không nhận GED, học tại nhà, học trực tuyến và viện ngôn ngữ. Học bổng không theo cấp TOPIK: 30% đầu được toàn phần, 20% kế được một nửa, chỉ học kỳ đầu. Mức 2,15 triệu won cũ không có trong hướng dẫn. Không có địa chỉ tuyển đa văn hóa.',
      ru: 'Руководство 2027 для иностранцев: GED, домашнее и онлайн-обучение и языковые курсы не принимаются. Стипендия не по уровню TOPIK: верхние 30% — полная оплата, следующие 20% — половина, только первый семестр. Старых 2,15 млн вон в руководстве нет. Адреса многокультурного трека нет.',
      mn: '2027 оны гадаад оюутны гарын авлага: GED, гэрийн болон цахим сургалт, хэлний сургуулийг хүлээж авахгүй. Тэтгэлэг TOPIK зэргээр биш: эхний 30% бүтэн, дараагийн 20% хагас, зөвхөн эхний улирал. Хуучин 2.15 сая вон энд алга. Олон соёлын замын хаяг алга.',
      ar: 'دليل 2027 للطلاب الأجانب: المعادلة والتعليم المنزلي والدراسة عبر الإنترنت ومعاهد اللغة غير مقبولة. المنحة ليست حسب مستوى TOPIK: أعلى 30% إعفاء كامل والتالون 20% نصف، للفصل الأول فقط. رقم 2.15 مليون وون القديم غير موجود. لا عنوان لمسار متعدد الثقافات.',
    },
  },
  dongguk: {
    ged: 'rejected',
    track: {
      en: 'Regular admission, groups A·B·C, 15 seats (CSAT 100%)',
      'zh-Hans': '正时 A·B·C 组 15 人（学能 100%）',
      'zh-Hant': '正時 A·B·C 組 15 人（學能 100%）',
      vi: 'Tuyển chính thức nhóm A·B·C, 15 chỗ (CSAT 100%)',
      ru: 'Основной набор, группы A·B·C, 15 мест (CSAT 100%)',
      mn: 'Үндсэн элсэлт, A·B·C бүлэг, 15 суудал (CSAT 100%)',
      ar: 'قبول عام، المجموعات A وB وC، 15 مقعدًا (اختبار القدرات 100%)',
    },
    note: {
      en: 'Spring 2027 first-round guide: GED, homeschooling, online study, and lifelong learning are not accepted. The language award is the first semester only: level 4 is 30%, 5 is 50%, 6 is 100%. Level 3 has no rate. No multicultural-track URL.',
      'zh-Hans': '2027春季第一轮简章：不承认检定考试、家庭学校、网课和终身教育。语言优秀奖仅第一学期：4级30%、5级50%、6级100%。3级没有比例。没有多文化选拔网址。',
      'zh-Hant': '2027春季第一輪簡章：不承認檢定考試、家庭學校、網課和終身教育。語言優秀獎僅第一學期：4級30%、5級50%、6級100%。3級沒有比例。沒有多文化選拔網址。',
      vi: 'Vòng 1 xuân 2027: không nhận GED, học tại nhà, học trực tuyến và giáo dục suốt đời. Học bổng ngôn ngữ chỉ học kỳ đầu: cấp 4 là 30%, 5 là 50%, 6 là 100%. Cấp 3 không có tỷ lệ. Không có địa chỉ tuyển đa văn hóa.',
      ru: 'Первый тур весны 2027: GED, домашнее и онлайн-обучение и непрерывное образование не принимаются. Языковая стипендия только в первом семестре: 4 уровень 30%, 5 — 50%, 6 — 100%. У 3 уровня доли нет. Адреса многокультурного трека нет.',
      mn: '2027 хаврын 1-р шат: GED, гэрийн болон цахим сургалт, насан туршийн боловсролыг хүлээж авахгүй. Хэлний тэтгэлэг зөвхөн эхний улирал: 4-р зэрэг 30%, 5: 50%, 6: 100%. 3-р зэрэгт хувь алга. Олон соёлын замын хаяг алга.',
      ar: 'الجولة الأولى لربيع 2027: المعادلة والتعليم المنزلي والدراسة عبر الإنترنت والتعليم مدى الحياة غير مقبولة. منحة اللغة للفصل الأول فقط: المستوى 4 بنسبة 30%، و5 بنسبة 50%، و6 بنسبة 100%. المستوى 3 بلا نسبة. لا عنوان لمسار متعدد الثقافات.',
    },
  },
  hufs: {
    ged: 'rejected',
    track: {
      en: 'Early and regular admission, outside quota (check the department)',
      'zh-Hans': '随时·正时定员外（确认基准学科）',
      'zh-Hant': '隨時·正時定員外（確認基準學科）',
      vi: 'Tuyển sớm và chính thức, ngoài chỉ tiêu (xem ngành chuẩn)',
      ru: 'Досрочный и основной набор вне квоты (смотрите кафедру)',
      mn: 'Эрт ба үндсэн элсэлт, квотын гадна (тэнхимийг шалга)',
      ar: 'قبول مبكر وعام خارج الحصة (راجع القسم)',
    },
    note: {
      en: 'March 2027 guide: GED, homeschooling, online study, and language institutes are not accepted for new students. First-semester language award: level 6 is 100%, 5 is 50%, 4 is 30%. Level 3 has no rate. No multicultural-track URL.',
      'zh-Hans': '2027年3月简章：新生不承认检定考试、家庭学校、网课和语言学院。第一学期语言奖：6级100%、5级50%、4级30%。3级没有比例。没有多文化选拔网址。',
      'zh-Hant': '2027年3月簡章：新生不承認檢定考試、家庭學校、網課和語言學院。第一學期語言獎：6級100%、5級50%、4級30%。3級沒有比例。沒有多文化選拔網址。',
      vi: 'Hướng dẫn tháng 3/2027: tân sinh viên không được dùng GED, học tại nhà, học trực tuyến hay viện ngôn ngữ. Học kỳ đầu: cấp 6 là 100%, 5 là 50%, 4 là 30%. Cấp 3 không có tỷ lệ. Không có địa chỉ tuyển đa văn hóa.',
      ru: 'Март 2027: для новых студентов GED, домашнее и онлайн-обучение и языковые курсы не принимаются. Первый семестр: 6 уровень 100%, 5 — 50%, 4 — 30%. У 3 уровня доли нет. Адреса многокультурного трека нет.',
      mn: '2027 оны 3-р сар: шинэ оюутны GED, гэрийн болон цахим сургалт, хэлний сургуулийг хүлээж авахгүй. Эхний улирал: 6-р зэрэг 100%, 5: 50%, 4: 30%. 3-р зэрэгт хувь алга. Олон соёлын замын хаяг алга.',
      ar: 'دليل مارس 2027: للجدد لا تُقبل المعادلة ولا التعليم المنزلي ولا الدراسة عبر الإنترنت ولا معاهد اللغة. الفصل الأول: المستوى 6 بنسبة 100%، و5 بنسبة 50%، و4 بنسبة 30%. المستوى 3 بلا نسبة. لا عنوان لمسار متعدد الثقافات.',
    },
  },
  khu: {
    ged: 'rejected',
    track: {
      en: 'Regular admission allows vocational inquiry · early admission for workers (grades 70 + interview 30)',
      'zh-Hans': '正时允许职业探索 · 随时在职者（教科 70 + 面试 30）',
      'zh-Hant': '正時允許職業探索 · 隨時在職者（教科 70 + 面試 30）',
      vi: 'Tuyển chính thức cho phép hỏi nghề · tuyển sớm cho người đang làm (điểm 70 + phỏng vấn 30)',
      ru: 'Основной набор допускает профориентацию · досрочный набор для работающих (оценки 70 + собеседование 30)',
      mn: 'Үндсэн элсэлт мэргэжил асуухыг зөвшөөрнө · эрт элсэлт, ажил эрхлэгч (дүн 70 + ярилцлага 30)',
      ar: 'القبول العام يسمح بالاستفسار المهني · قبول مبكر للعاملين (درجات 70 + مقابلة 30)',
    },
    note: {
      en: 'Spring 2027 undergraduate guide: GED, homeschooling, online study, and lifelong learning are not accepted. Award B is level 6 at 100% for the first semester. Award C is level 5 at 50%. Levels 3 and 4 have no admission rate. No multicultural-track URL.',
      'zh-Hans': '2027春季本科简章：不承认检定考试、家庭学校、网课和终身教育。入学奖B是6级第一学期100%，C是5级50%。3级和4级没有入学比例。没有多文化选拔网址。',
      'zh-Hant': '2027春季本科簡章：不承認檢定考試、家庭學校、網課和終身教育。入學獎B是6級第一學期100%，C是5級50%。3級和4級沒有入學比例。沒有多文化選拔網址。',
      vi: 'Hướng dẫn đại học xuân 2027: không nhận GED, học tại nhà, học trực tuyến và giáo dục suốt đời. Học bổng B là cấp 6 được 100% ở học kỳ đầu, C là cấp 5 được 50%. Cấp 3 và 4 không có tỷ lệ nhập học. Không có địa chỉ tuyển đa văn hóa.',
      ru: 'Весна 2027, бакалавриат: GED, домашнее и онлайн-обучение и непрерывное образование не принимаются. Стипендия B — 6 уровень, 100% в первом семестре. Стипендия C — 5 уровень, 50%. У уровней 3 и 4 доли при поступлении нет. Адреса многокультурного трека нет.',
      mn: '2027 хаврын бакалавр: GED, гэрийн болон цахим сургалт, насан туршийн боловсролыг хүлээж авахгүй. B тэтгэлэг 6-р зэрэг эхний улиралд 100%, C нь 5-р зэрэг 50%. 3 ба 4-р зэрэгт элсэлтийн хувь алга. Олон соёлын замын хаяг алга.',
      ar: 'دليل البكالوريوس لربيع 2027: المعادلة والتعليم المنزلي والدراسة عبر الإنترنت والتعليم مدى الحياة غير مقبولة. المنحة B للمستوى 6 بنسبة 100% في الفصل الأول، وC للمستوى 5 بنسبة 50%. المستويان 3 و4 بلا نسبة قبول. لا عنوان لمسار متعدد الثقافات.',
    },
  },
  hanyang: {
    ged: 'rejected',
    track: {
      en: 'Regular admission, groups A·B (CSAT-based)',
      'zh-Hans': '正时 A·B 组（学能为主）',
      'zh-Hant': '正時 A·B 組（學能為主）',
      vi: 'Tuyển chính thức nhóm A·B (theo CSAT)',
      ru: 'Основной набор, группы A·B (по CSAT)',
      mn: 'Үндсэн элсэлт, A·B бүлэг (CSAT)',
      ar: 'قبول عام، المجموعتان A وB (حسب اختبار القدرات)',
    },
    note: {
      en: 'Spring 2027 Seoul undergraduate guide: overseas equivalency exams, online study, and adult education are not accepted. First semester: level 6 is 100%, level 5 is 50%. Students finishing a Korean high school are excluded from the level-5 award. A bank letter is requested later only for a D-2 visa. No multicultural-track URL.',
      'zh-Hans': '2027春季首尔本科简章：不承认海外检定考试、网课和成人教育。第一学期6级100%、5级50%。韩国高中毕业（预定）者不进5级奖。余额证明稍后只向申请D-2的人要。没有多文化选拔网址。',
      'zh-Hant': '2027春季首爾本科簡章：不承認海外檢定考試、網課和成人教育。第一學期6級100%、5級50%。韓國高中畢業（預定）者不進5級獎。餘額證明稍後只向申請D-2的人要。沒有多文化選拔網址。',
      vi: 'Hướng dẫn đại học Seoul xuân 2027: không nhận thi tương đương ở nước ngoài, học trực tuyến và giáo dục người lớn. Học kỳ đầu: cấp 6 là 100%, cấp 5 là 50%. Người tốt nghiệp THPT Hàn bị loại khỏi học bổng cấp 5. Giấy số dư chỉ xin sau với người xin visa D-2. Không có địa chỉ tuyển đa văn hóa.',
      ru: 'Весна 2027, бакалавриат Сеула: зарубежные эквивалентные экзамены, онлайн-обучение и образование взрослых не принимаются. Первый семестр: 6 уровень 100%, 5 — 50%. Выпускники корейской школы не получают стипендию 5 уровня. Справку об остатке позже просят только для визы D-2. Адреса многокультурного трека нет.',
      mn: '2027 хаврын Сөүлийн бакалавр: гадаад тэнцэх шалгалт, цахим сургалт, насанд хүрэгчдийн боловсролыг хүлээж авахгүй. Эхний улирал: 6-р зэрэг 100%, 5: 50%. Солонгос ахлах төгсөгч 5-р зэргийн тэтгэлгээс хасагдана. Үлдэгдлийг дараа нь зөвхөн D-2 виз хүсэгчээс авна. Олон соёлын замын хаяг алга.',
      ar: 'دليل بكالوريوس سيول لربيع 2027: اختبارات المعادلة الخارجية والدراسة عبر الإنترنت وتعليم الكبار غير مقبولة. الفصل الأول: المستوى 6 بنسبة 100% والمستوى 5 بنسبة 50%. خريجو الثانوية الكورية مستبعدون من منحة المستوى 5. يُطلب إثبات الرصيد لاحقًا فقط لمن يطلب تأشيرة D-2. لا عنوان لمسار متعدد الثقافات.',
    },
  },
  skku: {
    ged: 'unknown',
    track: {
      en: 'Regular admission, group B, 17 seats (CSAT 100%)',
      'zh-Hans': '正时 B 组 17 人（学能 100%）',
      'zh-Hant': '正時 B 組 17 人（學能 100%）',
      vi: 'Tuyển chính thức nhóm B, 17 chỗ (CSAT 100%)',
      ru: 'Основной набор, группа B, 17 мест (CSAT 100%)',
      mn: 'Үндсэн элсэлт, B бүлэг, 17 суудал (CSAT 100%)',
      ar: 'قبول عام، المجموعة B، 17 مقعدًا (اختبار القدرات 100%)',
    },
    note: {
      en: 'Official scholarship page: overseas high-school graduates, first semester only. TOPIK 6 or Sungkyun Language Institute level 6 is 100%. TOPIK 5 or institute level 5 or the prep class is 50%. Levels 3 and 4 have no rate. The GED rule is not on this page. No multicultural-track URL.',
      'zh-Hans': '外国学生奖学金页：海外高中毕业录取者，仅入学第一学期。TOPIK 6级或成均语学院6级为100%，TOPIK 5级或语学院5级、升学准备班为50%。3级和4级没有比例。这一页没有检定考试条款，也没有多文化选拔网址。',
      'zh-Hant': '外國學生獎學金頁：海外高中畢業錄取者，僅入學第一學期。TOPIK 6級或成均語學院6級為100%，TOPIK 5級或語學院5級、升學準備班為50%。3級和4級沒有比例。這一頁沒有檢定考試條款，也沒有多文化選拔網址。',
      vi: 'Trang học bổng: người tốt nghiệp THPT nước ngoài, chỉ học kỳ đầu. TOPIK 6 hoặc viện ngôn ngữ cấp 6 là 100%. TOPIK 5 hoặc cấp 5 hoặc lớp chuẩn bị là 50%. Cấp 3 và 4 không có tỷ lệ. Trang này không có quy tắc GED và không có địa chỉ tuyển đa văn hóa.',
      ru: 'Страница стипендии: выпускники зарубежной школы, только первый семестр. TOPIK 6 или 6 уровень языкового института — 100%. TOPIK 5, 5 уровень института или подготовительный класс — 50%. У уровней 3 и 4 доли нет. Правила GED на странице нет. Адреса многокультурного трека нет.',
      mn: 'Тэтгэлгийн хуудас: гадаад ахлах төгсөгч, зөвхөн эхний улирал. TOPIK 6 эсвэл хэлний дээд сургуулийн 6-р түвшин 100%. TOPIK 5, 5-р түвшин эсвэл бэлтгэл анги 50%. 3 ба 4-р зэрэгт хувь алга. GED дүрэм энэ хуудсанд алга. Олон соёлын замын хаяг алга.',
      ar: 'صفحة المنحة: خريجو ثانوية في الخارج، الفصل الأول فقط. TOPIK 6 أو المستوى 6 في معهد اللغة 100%. TOPIK 5 أو المستوى 5 أو صف الإعداد 50%. المستويان 3 و4 بلا نسبة. قاعدة المعادلة ليست في هذه الصفحة. لا عنوان لمسار متعدد الثقافات.',
    },
  },
  cau: {
    ged: 'rejected',
    track: {
      en: 'Regular admission, groups B·C, 25 seats (CSAT 100%)',
      'zh-Hans': '正时 B·C 组 25 人（学能 100%）',
      'zh-Hant': '正時 B·C 組 25 人（學能 100%）',
      vi: 'Tuyển chính thức nhóm B·C, 25 chỗ (CSAT 100%)',
      ru: 'Основной набор, группы B·C, 25 мест (CSAT 100%)',
      mn: 'Үндсэн элсэлт, B·C бүлэг, 25 суудал (CSAT 100%)',
      ar: 'قبول عام، المجموعتان B وC، 25 مقعدًا (اختبار القدرات 100%)',
    },
    note: {
      en: 'March 2027 guide: online study, the GED, and the self-study degree exam cannot be used to apply. First semester: level 6 is 100%, level 5 is 50%. Levels 3 and 4 have no rate. A Chinese bank balance must stay frozen through 2027-03-31. The new convergence engineering unit needs TOPIK 5. No multicultural-track URL.',
      'zh-Hans': '2027年3月简章：网课、检定考试和自学学位考试不能用来申请。第一学期6级100%、5级50%。3级和4级没有比例。中国银行余额须冻结到2027-03-31。新设融合工学部需要TOPIK 5级。没有多文化选拔网址。',
      'zh-Hant': '2027年3月簡章：網課、檢定考試和自學學位考試不能用來申請。第一學期6級100%、5級50%。3級和4級沒有比例。中國銀行餘額須凍結到2027-03-31。新設融合工學部需要TOPIK 5級。沒有多文化選拔網址。',
      vi: 'Hướng dẫn tháng 3/2027: không dùng học trực tuyến, GED hay thi tự học để nộp. Học kỳ đầu: cấp 6 là 100%, cấp 5 là 50%. Cấp 3 và 4 không có tỷ lệ. Số dư ngân hàng Trung Quốc phải phong tỏa đến 2027-03-31. Khoa kỹ thuật hội tụ mới cần TOPIK 5. Không có địa chỉ tuyển đa văn hóa.',
      ru: 'Март 2027: онлайн-обучение, GED и экзамен самообразования для подачи не подходят. Первый семестр: 6 уровень 100%, 5 — 50%. У уровней 3 и 4 доли нет. Остаток в китайском банке должен быть заморожен до 2027-03-31. Новому подразделению конвергентной инженерии нужен TOPIK 5. Адреса многокультурного трека нет.',
      mn: '2027 оны 3-р сар: цахим сургалт, GED, бие даан суралцах шалгалтаар бүртгүүлэхгүй. Эхний улирал: 6-р зэрэг 100%, 5: 50%. 3 ба 4-р зэрэгт хувь алга. Хятадын банкны үлдэгдэл 2027-03-31 хүртэл царцаана. Шинэ нэгдсэн инженерийн нэгжид TOPIK 5 хэрэгтэй. Олон соёлын замын хаяг алга.',
      ar: 'دليل مارس 2027: لا يُستخدم التعلم عبر الإنترنت ولا المعادلة ولا امتحان الدراسة الذاتية للتقديم. الفصل الأول: المستوى 6 بنسبة 100% والمستوى 5 بنسبة 50%. المستويان 3 و4 بلا نسبة. رصيد بنك صيني يجب أن يبقى مجمدًا حتى 2027-03-31. وحدة الهندسة المتقاربة الجديدة تتطلب TOPIK 5. لا عنوان لمسار متعدد الثقافات.',
    },
  },
  smwu: {
    ged: 'rejected',
    track: {
      en: 'Early admission, holistic review, 24 seats (documents 100%)',
      'zh-Hans': '随时综合 24 人（材料 100%）',
      'zh-Hant': '隨時綜合 24 人（材料 100%）',
      vi: 'Tuyển sớm hồ sơ tổng hợp, 24 chỗ (hồ sơ 100%)',
      ru: 'Досрочный набор, 24 места (документы 100%)',
      mn: 'Эрт элсэлт, 24 суудал (баримт 100%)',
      ar: 'قبول مبكر، 24 مقعدًا (وثائق 100%)',
    },
    note: {
      en: 'The latest undergraduate guide found is spring 2026. A 2027 spring undergraduate guide was not found. That 2026 guide rejects the GED, homeschooling, and online study. First semester: level 6 is 90%, 5 is 70%, 4 is 40%, 3 is 30%. A separate 300,000 won is paid once if level 4 is earned within a year. No multicultural-track URL.',
      'zh-Hans': '找到的最新本科简章是2026春季。没有找到2027春季本科简章。2026简章不承认检定考试、家庭学校和网课。第一学期6级90%、5级70%、4级40%、3级30%。一年内取得4级另发一次30万韩元。没有多文化选拔网址。',
      'zh-Hant': '找到的最新本科簡章是2026春季。沒有找到2027春季本科簡章。2026簡章不承認檢定考試、家庭學校和網課。第一學期6級90%、5級70%、4級40%、3級30%。一年內取得4級另發一次30萬韓元。沒有多文化選拔網址。',
      vi: 'Hướng dẫn đại học mới nhất tìm được là xuân 2026. Chưa thấy hướng dẫn đại học xuân 2027. Bản 2026 không nhận GED, học tại nhà và học trực tuyến. Học kỳ đầu: cấp 6 là 90%, 5 là 70%, 4 là 40%, 3 là 30%. Thêm 300.000 won một lần nếu đạt cấp 4 trong một năm. Không có địa chỉ tuyển đa văn hóa.',
      ru: 'Последнее найденное руководство бакалавриата — весна 2026. Весеннее руководство 2027 не найдено. В руководстве 2026 GED, домашнее и онлайн-обучение не принимаются. Первый семестр: 6 уровень 90%, 5 — 70%, 4 — 40%, 3 — 30%. Отдельно 300 000 вон один раз, если 4 уровень получен в течение года. Адреса многокультурного трека нет.',
      mn: 'Олдсон хамгийн сүүлийн бакалаврын гарын авлага 2026 хавар. 2027 хаврынх олдсонгүй. 2026 оных GED, гэрийн болон цахим сургалтыг хүлээж авахгүй. Эхний улирал: 6-р зэрэг 90%, 5: 70%, 4: 40%, 3: 30%. Нэг жилийн дотор 4-р зэрэг авбал нэг удаа 300,000 вон. Олон соёлын замын хаяг алга.',
      ar: 'أحدث دليل بكالوريوس وُجد هو ربيع 2026. لم يُعثر على دليل بكالوريوس ربيع 2027. دليل 2026 لا يقبل المعادلة ولا التعليم المنزلي ولا الدراسة عبر الإنترنت. الفصل الأول: المستوى 6 بنسبة 90%، و5 بنسبة 70%، و4 بنسبة 40%، و3 بنسبة 30%. مبلغ 300 ألف وون مرة واحدة إذا حصل المستوى 4 خلال سنة. لا عنوان لمسار متعدد الثقافات.',
    },
  },
};

const TERMS: Record<string, Record<Lang7, string>> = {
  미확인: {
    en: 'Term not confirmed',
    'zh-Hans': '适用学期未确认',
    'zh-Hant': '適用學期未確認',
    vi: 'Chưa rõ học kỳ áp dụng',
    ru: 'Семестр не подтверждён',
    mn: 'Улирал баталгаажаагүй',
    ar: 'الفصل غير مؤكد',
  },
  '입학 첫 학기(해외 고교 졸업 합격자)': {
    en: 'First semester after entry (overseas high-school graduates)',
    'zh-Hans': '入学后第一学期（海外高中毕业录取者）',
    'zh-Hant': '入學後第一學期（海外高中畢業錄取者）',
    vi: 'Học kỳ đầu sau nhập học (tốt nghiệp THPT nước ngoài)',
    ru: 'Первый семестр (выпускники зарубежной школы)',
    mn: 'Элсэлтийн дараах эхний улирал (гадаад ахлах төгсөгч)',
    ar: 'الفصل الأول بعد الالتحاق (خريجو ثانوية في الخارج)',
  },
  '입학 직후 첫 학기 1회 (2025학년도 이후 입학자)': {
    en: 'Once, the first semester after entry (entrants from 2025)',
    'zh-Hans': '入学后第一个学期一次（2025学年及以后入学）',
    'zh-Hant': '入學後第一個學期一次（2025學年及以後入學）',
    vi: 'Một lần ở học kỳ đầu sau nhập học (từ 2025)',
    ru: 'Один раз в первом семестре (поступившие с 2025)',
    mn: 'Элссэний дараах эхний улиралд нэг удаа (2025 оноос)',
    ar: 'مرة واحدة في الفصل الأول بعد الالتحاق (من 2025)',
  },
  '2027 전기 첫 학기(신입학·편입학)': {
    en: '2027 spring, first semester (new and transfer)',
    'zh-Hans': '2027 春季第一学期（新入学·插班）',
    'zh-Hant': '2027 春季第一學期（新入學·插班）',
    vi: 'Xuân 2027, học kỳ đầu (mới và chuyển tiếp)',
    ru: 'Весна 2027, первый семестр (новые и перевод)',
    mn: '2027 хавар, эхний улирал (шинэ ба шилжилт)',
    ar: 'ربيع 2027، الفصل الأول (جدد ومنقولون)',
  },
  '2027학년도 1학기 신입학 첫 학기': {
    en: '2027 spring, first semester for freshmen',
    'zh-Hans': '2027春季新生第一学期',
    'zh-Hant': '2027春季新生第一學期',
    vi: 'Xuân 2027, học kỳ đầu cho tân sinh viên',
    ru: 'Весна 2027, первый семестр для первокурсников',
    mn: '2027 хавар, шинэ оюутны эхний улирал',
    ar: 'ربيع 2027، الفصل الأول للجدد',
  },
  '2027학년도 3월 입학 첫 학기': {
    en: 'March 2027 entry, first semester',
    'zh-Hans': '2027年3月入学第一学期',
    'zh-Hant': '2027年3月入學第一學期',
    vi: 'Nhập học tháng 3/2027, học kỳ đầu',
    ru: 'Поступление в марте 2027, первый семестр',
    mn: '2027 оны 3-р сарын элсэлт, эхний улирал',
    ar: 'التحاق مارس 2027، الفصل الأول',
  },
  '2027학년도 전기 첫 학기': {
    en: '2027 spring, first semester',
    'zh-Hans': '2027春季第一学期',
    'zh-Hant': '2027春季第一學期',
    vi: 'Xuân 2027, học kỳ đầu',
    ru: 'Весна 2027, первый семестр',
    mn: '2027 хавар, эхний улирал',
    ar: 'ربيع 2027، الفصل الأول',
  },
  '2027학년도 1학기 입학 첫 학기': {
    en: 'Spring 2027 entry, first semester',
    'zh-Hans': '2027春季入学第一学期',
    'zh-Hant': '2027春季入學第一學期',
    vi: 'Nhập học xuân 2027, học kỳ đầu',
    ru: 'Поступление весной 2027, первый семестр',
    mn: '2027 хаврын элсэлт, эхний улирал',
    ar: 'التحاق ربيع 2027، الفصل الأول',
  },
  '2027학년도 1학기 첫 학기': {
    en: 'Spring 2027, first semester',
    'zh-Hans': '2027春季第一学期',
    'zh-Hant': '2027春季第一學期',
    vi: 'Xuân 2027, học kỳ đầu',
    ru: 'Весна 2027, первый семестр',
    mn: '2027 хавар, эхний улирал',
    ar: 'ربيع 2027، الفصل الأول',
  },
  '2026학년도 전기 첫 학기': {
    en: 'Spring 2026, first semester (latest undergraduate guide found)',
    'zh-Hans': '2026春季第一学期（找到的最新本科简章）',
    'zh-Hant': '2026春季第一學期（找到的最新本科簡章）',
    vi: 'Xuân 2026, học kỳ đầu (hướng dẫn đại học mới nhất tìm được)',
    ru: 'Весна 2026, первый семестр (последнее найденное руководство)',
    mn: '2026 хавар, эхний улирал (олдсон хамгийн сүүлийн гарын авлага)',
    ar: 'ربيع 2026، الفصل الأول (أحدث دليل بكالوريوس وُجد)',
  },
};

export function universityCell(lang: SupportedLangCode, id: UniversityId): UniversityCell {
  if (lang === 'ko') {
    const row = UNIVERSITY_TOPIK_TABLE.find((item) => item.id === id);
    return {
      ged: row?.gedAccepted ?? '',
      track: row?.vocationalTrack ?? '',
      note: row?.note ?? '',
    };
  }
  const row = ROWS[id];
  return {
    ged: row.ged === 'rejected' ? REJECTED[lang] : row.ged === 'unknown' ? UNKNOWN[lang] : REGULAR[lang],
    track: row.track[lang],
    note: row.note[lang],
  };
}

export function scholarshipTerm(lang: SupportedLangCode, term: string): string {
  if (lang === 'ko') return term;
  return TERMS[term]?.[lang] ?? term;
}

export function topikHeads(lang: SupportedLangCode): { t4: string; t5: string; t6: string } {
  if (lang === 'ko') return { t4: '4급', t5: '5급', t6: '6급' };
  return { t4: 'TOPIK 4', t5: 'TOPIK 5', t6: 'TOPIK 6' };
}

export interface CounselorHeads {
  term: string;
  cluster: string;
  selected: string;
  responseRate: string;
  bottleneck: string;
  affected: string;
  teacher: string;
  district: string;
  language: string;
  asked: string;
  tried: string;
  connected: string;
  failed: string;
  noFollowup: string;
  connectRate: string;
  dropoff: string;
  barrier: string;
  count: string;
  topic: string;
  questions: string;
}

const KO_HEADS: CounselorHeads = {
  term: '입시 용어',
  cluster: 'TF-IDF 주제 군집',
  selected: '선택/유효응답 (x/n)',
  responseRate: '응답률',
  bottleneck: '평활화 병목률',
  affected: '예상 영향 인원',
  teacher: '교사 개입 시뮬레이션',
  district: '자치구',
  language: '요청 언어',
  asked: '필요 표시',
  tried: '연락 시도',
  connected: '7일 연결됨',
  failed: '실패 보고',
  noFollowup: '후속 미응답',
  connectRate: '7일 연결율',
  dropoff: '주요 중단 원인 · 통역 배치',
  barrier: '장애 사유',
  count: '누적 건수',
  topic: '분류 토픽',
  questions: '질문 건수',
};

const HEADS: Record<Lang7, CounselorHeads> = {
  en: {
    term: 'Admissions term',
    cluster: 'Topic cluster',
    selected: 'Selected / valid answers (x/n)',
    responseRate: 'Response rate',
    bottleneck: 'Smoothed bottleneck',
    affected: 'Students affected',
    teacher: 'Teacher follow-up example',
    district: 'District',
    language: 'Language requested',
    asked: 'Asked for help',
    tried: 'Contact tried',
    connected: 'Connected in 7 days',
    failed: 'Failure reported',
    noFollowup: 'No follow-up reply',
    connectRate: '7-day connection rate',
    dropoff: 'Main drop-off · interpreters',
    barrier: 'Document barrier',
    count: 'Count',
    topic: 'Topic',
    questions: 'Questions',
  },
  'zh-Hans': {
    term: '招生用语',
    cluster: '主题聚类',
    selected: '选择/有效回答 (x/n)',
    responseRate: '回答率',
    bottleneck: '平滑瓶颈率',
    affected: '预计影响人数',
    teacher: '教师跟进示例',
    district: '自治区',
    language: '请求语言',
    asked: '表示需要',
    tried: '尝试联系',
    connected: '7天内接通',
    failed: '报告失败',
    noFollowup: '后续无回复',
    connectRate: '7天接通率',
    dropoff: '主要中断原因 · 口译配置',
    barrier: '材料障碍',
    count: '累计件数',
    topic: '分类主题',
    questions: '问题件数',
  },
  'zh-Hant': {
    term: '招生用語',
    cluster: '主題聚類',
    selected: '選擇/有效回答 (x/n)',
    responseRate: '回答率',
    bottleneck: '平滑瓶頸率',
    affected: '預計影響人數',
    teacher: '教師跟進示例',
    district: '自治區',
    language: '請求語言',
    asked: '表示需要',
    tried: '嘗試聯繫',
    connected: '7天內接通',
    failed: '報告失敗',
    noFollowup: '後續無回覆',
    connectRate: '7天接通率',
    dropoff: '主要中斷原因 · 口譯配置',
    barrier: '材料障礙',
    count: '累計件數',
    topic: '分類主題',
    questions: '問題件數',
  },
  vi: {
    term: 'Thuật ngữ tuyển sinh',
    cluster: 'Nhóm chủ đề',
    selected: 'Chọn / câu hợp lệ (x/n)',
    responseRate: 'Tỷ lệ trả lời',
    bottleneck: 'Tỷ lệ nghẽn đã làm trơn',
    affected: 'Số học sinh bị ảnh hưởng',
    teacher: 'Ví dụ giáo viên hỗ trợ',
    district: 'Quận',
    language: 'Ngôn ngữ yêu cầu',
    asked: 'Báo cần giúp',
    tried: 'Đã thử liên hệ',
    connected: 'Nối máy trong 7 ngày',
    failed: 'Báo thất bại',
    noFollowup: 'Không trả lời tiếp',
    connectRate: 'Tỷ lệ nối máy 7 ngày',
    dropoff: 'Lý do dừng · phiên dịch',
    barrier: 'Trở ngại hồ sơ',
    count: 'Số lượt',
    topic: 'Chủ đề',
    questions: 'Số câu hỏi',
  },
  ru: {
    term: 'Термин поступления',
    cluster: 'Кластер темы',
    selected: 'Выбор / годные ответы (x/n)',
    responseRate: 'Доля ответов',
    bottleneck: 'Сглаженное узкое место',
    affected: 'Оценка числа учеников',
    teacher: 'Пример помощи учителя',
    district: 'Район',
    language: 'Запрошенный язык',
    asked: 'Просили помощь',
    tried: 'Пытались связаться',
    connected: 'Связь за 7 дней',
    failed: 'Сообщили о сбое',
    noFollowup: 'Нет ответа на продолжение',
    connectRate: 'Доля связи за 7 дней',
    dropoff: 'Главная причина срыва · переводчики',
    barrier: 'Препятствие с документами',
    count: 'Число случаев',
    topic: 'Тема',
    questions: 'Число вопросов',
  },
  mn: {
    term: 'Элсэлтийн нэр томьёо',
    cluster: 'Сэдвийн бүлэг',
    selected: 'Сонголт / хүчинтэй хариу (x/n)',
    responseRate: 'Хариултын хувь',
    bottleneck: 'Гөлгөрлөсөн түгжрэл',
    affected: 'Нөлөөлөх сурагчид',
    teacher: 'Багшийн тусламжийн жишээ',
    district: 'Дүүрэг',
    language: 'Хүссэн хэл',
    asked: 'Тусламж хүссэн',
    tried: 'Холбоо барихыг оролдсон',
    connected: '7 хоногт холбогдсон',
    failed: 'Амжилтгүй гэж мэдээлсэн',
    noFollowup: 'Дараагийн хариу алга',
    connectRate: '7 хоногийн холболт',
    dropoff: 'Гол тасалдал · орчуулагч',
    barrier: 'Баримтын саад',
    count: 'Тоо',
    topic: 'Сэдэв',
    questions: 'Асуултын тоо',
  },
  ar: {
    term: 'مصطلح القبول',
    cluster: 'مجموعة الموضوع',
    selected: 'اختيار / إجابات صالحة (x/n)',
    responseRate: 'نسبة الإجابة',
    bottleneck: 'عنق الزجاجة الممهّد',
    affected: 'الطلاب المتأثرون',
    teacher: 'مثال متابعة المعلم',
    district: 'الحي',
    language: 'اللغة المطلوبة',
    asked: 'طلب المساعدة',
    tried: 'جرت محاولة اتصال',
    connected: 'اتصال خلال 7 أيام',
    failed: 'أُبلغ عن فشل',
    noFollowup: 'لا رد لاحق',
    connectRate: 'نسبة الاتصال خلال 7 أيام',
    dropoff: 'سبب التوقف · المترجمون',
    barrier: 'عائق الوثائق',
    count: 'العدد',
    topic: 'الموضوع',
    questions: 'عدد الأسئلة',
  },
};

export function counselorHeads(lang: SupportedLangCode): CounselorHeads {
  if (lang === 'ko') return KO_HEADS;
  return HEADS[lang];
}

export const TABLE_COPY_LANGS = LANGS;
