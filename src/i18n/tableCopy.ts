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
  ged: 'rejected' | 'regular';
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
    ged: 'regular',
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
      en: 'New-student award listed as level 3 at 30% up to full tuition at level 6. Not re-checked against this year’s guide.',
      'zh-Hans': '记为新生奖学金 3 级 30% 到 6 级全额。尚未对照今年简章。',
      'zh-Hant': '記為新生獎學金 3 級 30% 到 6 級全額。尚未對照今年簡章。',
      vi: 'Ghi học bổng tân sinh viên từ cấp 3 là 30% đến toàn phần ở cấp 6. Chưa đối chiếu hướng dẫn năm nay.',
      ru: 'Записано как стипендия новичкам: 3 уровень 30% и полная оплата на 6 уровне. С этим годом не сверялось.',
      mn: 'Шинэ оюутны тэтгэлэг 3-р зэрэг 30%-аас 6-р зэрэгт бүтэн төлбөр гэж бичсэн. Энэ жилийн гарын авлагатай тулгаагүй.',
      ar: 'مكتوب كمنحة للجدد من 30% في المستوى 3 إلى الإعفاء الكامل في المستوى 6. لم تُراجع مع دليل هذا العام.',
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
      en: 'Older note: document grades A/B, full tuition at level 5 and housing at level 6, same for the English track. Not re-checked.',
      'zh-Hans': '旧记录：材料等级 A/B 时 5 级全额、6 级含宿舍，英语轨道相同。尚未复核。',
      'zh-Hant': '舊記錄：材料等級 A/B 時 5 級全額、6 級含宿舍，英語軌道相同。尚未複核。',
      vi: 'Ghi cũ: hồ sơ hạng A/B thì cấp 5 được toàn phần, cấp 6 thêm ký túc xá, track tiếng Anh như vậy. Chưa đối chiếu lại.',
      ru: 'Старая запись: при оценке документов A/B уровень 5 — полная оплата, уровень 6 — ещё общежитие, английский трек так же. Не сверено.',
      mn: 'Хуучин тэмдэглэл: баримт A/B бол 5-р зэрэг бүтэн төлбөр, 6-р зэрэгт дотуур байр, англи зам мөн адил. Дахин нягтлаагүй.',
      ar: 'ملاحظة قديمة: بتقدير وثائق A/B المستوى 5 إعفاء كامل والمستوى 6 يشمل السكن، ومسار الإنجليزية كذلك. لم تُراجع.',
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
      en: 'Older note for the 2027 cohort: about 2.15 million won tuition plus an automatic reduction. Not re-checked.',
      'zh-Hans': '旧记录按 2027 学号：学费约 215 万韩元并自动减免。尚未复核。',
      'zh-Hant': '舊記錄按 2027 學號：學費約 215 萬韓元並自動減免。尚未複核。',
      vi: 'Ghi cũ cho khóa 2027: học phí khoảng 2,15 triệu won và giảm tự động. Chưa đối chiếu lại.',
      ru: 'Старая запись для набора 2027: плата около 2,15 млн вон и автоматическая скидка. Не сверено.',
      mn: '2027 элсэлтийн хуучин тэмдэглэл: төлбөр ойролцоогоор 2.15 сая вон, автоматаар хасна. Дахин нягтлаагүй.',
      ar: 'ملاحظة قديمة لدفعة 2027: الرسوم نحو 2.15 مليون وون مع خصم تلقائي. لم تُراجع.',
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
      en: 'Older note: language award deducted on the bill, plus a TOPIK fee for enrolled students. Not re-checked.',
      'zh-Hans': '旧记录：外语优秀奖在通知书减免，在校生另有 TOPIK 报名费。尚未复核。',
      'zh-Hant': '舊記錄：外語優秀獎在通知書減免，在校生另有 TOPIK 報名費。尚未複核。',
      vi: 'Ghi cũ: học bổng ngoại ngữ trừ trên giấy báo, sinh viên đang học được hỗ trợ lệ phí TOPIK. Chưa đối chiếu lại.',
      ru: 'Старая запись: языковая стипендия вычитается в счёте, студентам ещё оплачивают сбор TOPIK. Не сверено.',
      mn: 'Хуучин тэмдэглэл: хэлний тэтгэлгийг тооцоонд хасна, суралцагчид TOPIK-ийн хураамж өгнө. Дахин нягтлаагүй.',
      ar: 'ملاحظة قديمة: منحة اللغة تُخصم في الإشعار، وللطلاب المسجلين رسوم TOPIK. لم تُراجع.',
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
      en: 'Older note: GED not accepted, bank letter issued within one month, levels 5–6 while enrolled. Not re-checked.',
      'zh-Hans': '旧记录：不承认检定考试，余额证明须为 1 个月内原件，在学期间 5·6 级有奖。尚未复核。',
      'zh-Hant': '舊記錄：不承認檢定考試，餘額證明須為 1 個月內原件，在學期間 5·6 級有獎。尚未複核。',
      vi: 'Ghi cũ: không nhận GED, giấy số dư gốc trong 1 tháng, cấp 5–6 khi đang học. Chưa đối chiếu lại.',
      ru: 'Старая запись: GED не принимается, оригинал справки об остатке не старше месяца, уровни 5–6 во время учёбы. Не сверено.',
      mn: 'Хуучин тэмдэглэл: GED хүлээн авахгүй, үлдэгдлийн эх хувь 1 сарын дотор, суралцах үед 5–6-р зэрэг. Дахин нягтлаагүй.',
      ar: 'ملاحظة قديمة: المعادلة غير مقبولة، وإثبات الرصيد أصل خلال شهر، والمستويان 5 و6 أثناء الدراسة. لم تُراجع.',
    },
  },
  khu: {
    ged: 'regular',
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
      en: 'Older note: two spring rounds, original bank letter required after admission. Not re-checked.',
      'zh-Hans': '旧记录：春季两次招生，录取后须交余额证明原件。尚未复核。',
      'zh-Hant': '舊記錄：春季兩次招生，錄取後須交餘額證明原件。尚未複核。',
      vi: 'Ghi cũ: hai đợt mùa xuân, sau khi đỗ phải nộp bản gốc giấy số dư. Chưa đối chiếu lại.',
      ru: 'Старая запись: два весенних тура, после зачисления нужен оригинал справки об остатке. Не сверено.',
      mn: 'Хуучин тэмдэглэл: хаврын хоёр удаагийн бүртгэл, тэнцсний дараа үлдэгдлийн эх хувь. Дахин нягтлаагүй.',
      ar: 'ملاحظة قديمة: جولتان في الربيع، وبعد القبول يلزم أصل إثبات الرصيد. لم تُراجع.',
    },
  },
  hanyang: {
    ged: 'regular',
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
      en: 'Older note: bank letter only if the admitted student applies for D-2; levels 5–6 up to twice while enrolled. Not re-checked.',
      'zh-Hans': '旧记录：录取者申请 D-2 时才交余额证明；在学期间 5·6 级最多两次。尚未复核。',
      'zh-Hant': '舊記錄：錄取者申請 D-2 時才交餘額證明；在學期間 5·6 級最多兩次。尚未複核。',
      vi: 'Ghi cũ: chỉ người đỗ xin D-2 mới nộp giấy số dư; cấp 5–6 tối đa hai lần khi đang học. Chưa đối chiếu lại.',
      ru: 'Старая запись: справка об остатке только если поступивший подаёт на D-2; уровни 5–6 не больше двух раз. Не сверено.',
      mn: 'Хуучин тэмдэглэл: D-2 хүссэн тэнцэгч л үлдэгдэл өгнө; суралцах үед 5–6-р зэрэг хамгийн ихдээ хоёр удаа. Дахин нягтлаагүй.',
      ar: 'ملاحظة قديمة: إثبات الرصيد فقط لمن يطلب D-2 بعد القبول؛ المستويان 5 و6 مرتين كحد أقصى أثناء الدراسة. لم تُراجع.',
    },
  },
  skku: {
    ged: 'rejected',
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
      en: 'Older note: GED and homeschooling stated as not accepted; a separate Samsung science scholarship. Not re-checked.',
      'zh-Hans': '旧记录：写明不承认检定考试和家庭学校；另有三星理工奖学金。尚未复核。',
      'zh-Hant': '舊記錄：寫明不承認檢定考試和家庭學校；另有三星理工獎學金。尚未複核。',
      vi: 'Ghi cũ: nêu rõ không nhận GED và học tại nhà; có học bổng Samsung riêng cho khoa học. Chưa đối chiếu lại.',
      ru: 'Старая запись: GED и домашнее обучение прямо не принимаются; отдельно стипендия Samsung для наук. Не сверено.',
      mn: 'Хуучин тэмдэглэл: GED ба гэрийн сургалтыг хүлээн авахгүй гэж бичсэн; Samsung-ийн шинжлэх ухааны тусдаа тэтгэлэг. Дахин нягтлаагүй.',
      ar: 'ملاحظة قديمة: المعادلة والتعليم المنزلي مذكوران كغير مقبولين؛ ومنحة سامسونغ للعلوم منفصلة. لم تُراجع.',
    },
  },
  cau: {
    ged: 'regular',
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
      en: 'Older note: four rounds a year; a Chinese bank balance must stay frozen through 2027-03-31. Not re-checked.',
      'zh-Hans': '旧记录：一年四次；中国银行余额须冻结到 2027-03-31。尚未复核。',
      'zh-Hant': '舊記錄：一年四次；中國銀行餘額須凍結到 2027-03-31。尚未複核。',
      vi: 'Ghi cũ: bốn đợt một năm; số dư ngân hàng Trung Quốc phải phong tỏa đến 2027-03-31. Chưa đối chiếu lại.',
      ru: 'Старая запись: четыре тура в год; остаток в китайском банке должен быть заморожен до 2027-03-31. Не сверено.',
      mn: 'Хуучин тэмдэглэл: жилд дөрвөн удаа; Хятадын банкны үлдэгдэл 2027-03-31 хүртэл царцаасан байх. Дахин нягтлаагүй.',
      ar: 'ملاحظة قديمة: أربع جولات في السنة؛ رصيد بنك صيني يجب أن يبقى مجمدًا حتى 2027-03-31. لم تُراجع.',
    },
  },
  smwu: {
    ged: 'regular',
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
      en: 'Older note: from September 2025 entrants, a flat 300,000 won TOPIK award for new and transfer students. Not re-checked.',
      'zh-Hans': '旧记录：2025年9月入学起，新·插班生 TOPIK 奖学金定额 30 万韩元。尚未复核。',
      'zh-Hant': '舊記錄：2025年9月入學起，新·插班生 TOPIK 獎學金定額 30 萬韓元。尚未複核。',
      vi: 'Ghi cũ: từ người nhập học tháng 9/2025, học bổng TOPIK cố định 300.000 won cho sinh viên mới và chuyển tiếp. Chưa đối chiếu lại.',
      ru: 'Старая запись: с сентября 2025 фиксированные 300 000 вон за TOPIK для новых и переводных студентов. Не сверено.',
      mn: 'Хуучин тэмдэглэл: 2025 оны 9-р сараас шинэ болон шилжиж ирсэн оюутны TOPIK тэтгэлэг 300,000 вон. Дахин нягтлаагүй.',
      ar: 'ملاحظة قديمة: من سبتمبر 2025 منحة TOPIK ثابتة 300 ألف وون للجدد والمنقولين. لم تُراجع.',
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
    ged: row.ged === 'rejected' ? REJECTED[lang] : REGULAR[lang],
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
