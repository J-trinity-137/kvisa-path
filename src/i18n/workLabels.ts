import type { SupportedLangCode } from '../kbridge';
import type { WorkStage } from '../data/workHours';

const ko: Record<WorkStage, string> = {
  high_school: '고등학생 (F-1·F-3·D-4-3, 표에 없음)',
  d4_lang: '어학연수 D-4-1·D-4-7 (6개월 후, TOPIK 2)',
  d2_college: '전문학사 D-2-1 (TOPIK 3)',
  d2_kcore: '육성형 과정 (표에 없음, 미확인)',
  d2_ba_12: '학사 1–2학년 (TOPIK 3)',
  d2_ba_34: '학사 3–4학년 (TOPIK 4)',
  d2_grad: '석·박사 (TOPIK 4)',
};

const en: Record<WorkStage, string> = {
  high_school: 'High school (F-1, F-3, D-4-3, not on the table)',
  d4_lang: 'Language study D-4-1 / D-4-7 (after 6 months, TOPIK 2)',
  d2_college: 'Associate degree D-2-1 (TOPIK 3)',
  d2_kcore: 'Technical link program (not on the table)',
  d2_ba_12: 'Bachelor years 1–2 (TOPIK 3)',
  d2_ba_34: 'Bachelor years 3–4 (TOPIK 4)',
  d2_grad: 'Master’s or PhD (TOPIK 4)',
};

const zhHans: Record<WorkStage, string> = {
  high_school: '高中（F-1·F-3·D-4-3，表上没有）',
  d4_lang: '语学院 D-4-1·D-4-7（6个月后，TOPIK 2）',
  d2_college: '专科 D-2-1（TOPIK 3）',
  d2_kcore: '育成课程（表上没有）',
  d2_ba_12: '本科 1–2年级（TOPIK 3）',
  d2_ba_34: '本科 3–4年级（TOPIK 4）',
  d2_grad: '硕博士（TOPIK 4）',
};

const zhHant: Record<WorkStage, string> = {
  high_school: '高中（F-1·F-3·D-4-3，表上沒有）',
  d4_lang: '語學院 D-4-1·D-4-7（6個月後，TOPIK 2）',
  d2_college: '專科 D-2-1（TOPIK 3）',
  d2_kcore: '育成課程（表上沒有）',
  d2_ba_12: '學士 1–2年級（TOPIK 3）',
  d2_ba_34: '學士 3–4年級（TOPIK 4）',
  d2_grad: '碩博士（TOPIK 4）',
};

const vi: Record<WorkStage, string> = {
  high_school: 'THPT (F-1, F-3, D-4-3, không có trong bảng)',
  d4_lang: 'Học tiếng D-4-1 / D-4-7 (sau 6 tháng, TOPIK 2)',
  d2_college: 'Cao đẳng D-2-1 (TOPIK 3)',
  d2_kcore: 'Chương trình kỹ thuật (không có trong bảng)',
  d2_ba_12: 'Đại học năm 1–2 (TOPIK 3)',
  d2_ba_34: 'Đại học năm 3–4 (TOPIK 4)',
  d2_grad: 'Thạc sĩ hoặc tiến sĩ (TOPIK 4)',
};

const ru: Record<WorkStage, string> = {
  high_school: 'Старшая школа (F-1, F-3, D-4-3, нет в таблице)',
  d4_lang: 'Языковые курсы D-4-1 / D-4-7 (через 6 месяцев, TOPIK 2)',
  d2_college: 'Колледж D-2-1 (TOPIK 3)',
  d2_kcore: 'Техническая программа (нет в таблице)',
  d2_ba_12: 'Бакалавриат 1–2 курс (TOPIK 3)',
  d2_ba_34: 'Бакалавриат 3–4 курс (TOPIK 4)',
  d2_grad: 'Магистратура или аспирантура (TOPIK 4)',
};

const mn: Record<WorkStage, string> = {
  high_school: 'Ахлах (F-1, F-3, D-4-3, хүснэгтэд байхгүй)',
  d4_lang: 'Хэлний анги D-4-1 / D-4-7 (6 сарын дараа, TOPIK 2)',
  d2_college: 'Коллеж D-2-1 (TOPIK 3)',
  d2_kcore: 'Техникийн хөтөлбөр (хүснэгтэд байхгүй)',
  d2_ba_12: 'Бакалавр 1–2 (TOPIK 3)',
  d2_ba_34: 'Бакалавр 3–4 (TOPIK 4)',
  d2_grad: 'Магистр эсвэл доктор (TOPIK 4)',
};

const ar: Record<WorkStage, string> = {
  high_school: 'ثانوي (F-1 وF-3 وD-4-3، ليس في الجدول)',
  d4_lang: 'دراسة لغة D-4-1 / D-4-7 (بعد 6 أشهر، TOPIK 2)',
  d2_college: 'دبلوم D-2-1 (TOPIK 3)',
  d2_kcore: 'برنامج تقني (ليس في الجدول)',
  d2_ba_12: 'بكالوريوس السنة 1–2 (TOPIK 3)',
  d2_ba_34: 'بكالوريوس السنة 3–4 (TOPIK 4)',
  d2_grad: 'ماجستير أو دكتوراه (TOPIK 4)',
};

const ALL: Record<SupportedLangCode, Record<WorkStage, string>> = {
  ko, en, 'zh-Hans': zhHans, 'zh-Hant': zhHant, vi, ru, mn, ar,
};

export function workStageLabel(lang: SupportedLangCode, stage: WorkStage): string {
  return ALL[lang][stage];
}
