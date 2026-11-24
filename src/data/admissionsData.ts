import type { SupportedLangCode } from 'kbridge-core';

export type SchoolLevel = 'middle' | 'high';
export type BackgroundType = 'both_foreign' | 'multicultural' | 'mid_entry' | 'undocumented';
export type KoreanLevel = 'beginner' | 'topik_3_4' | 'topik_5_6';
export type InterestField = 'it' | 'culinary' | 'design' | 'business' | 'health';

export interface AdmissionTerm {
  id: string;
  term: string;
  easyKo: string;
  translations: Partial<Record<SupportedLangCode, string>>;
  cluster: string;
}

export interface AdmissionTrack {
  id: string;
  level: SchoolLevel;
  title: string;
  quotaType: '정원 내' | '정원 외' | '정원 내·외';
  legalBasis: string;
  eligibleBackgrounds: BackgroundType[];
  minKorean: KoreanLevel[];
  summary: string;
  requirements: string[];
  requiredDocs: string[];
  termIds: string[];
  visaNote: string;
  gapHint: string;
  referenceUrl: string;
  referenceLabel: string;
  asOfYear: string;
}

export interface SeoulVocationalSchool {
  neisCode: string;
  officeCode: string;
  name: string;
  schoolType: '특성화고' | '마이스터고';
  district: string;
  field: InterestField;
  majors: string[];
  specialTrack: string;
  univSpecialEligible: boolean; // 마이스터고는 대입 특성화고 특별전형 제외
}

export interface UniversityTopikRow {
  id: string;
  university: string;
  gedAccepted: '불인정' | '원칙 불인정(정규고)';
  topik3: string;
  topik4: string;
  topik5: string;
  topik6: string;
  minTopik: string;
  vocationalTrack: string;
  multiculturalTrack: string;
  fields: InterestField[];
  note: string;
}

export interface ExternalScholarshipRule {
  id: string;
  name: string;
  org: string;
  benefit: string;
  eligibleBackgrounds: BackgroundType[];
  excludeRule: string;
  asOfYear: string;
}

export interface ApostilleCountryRule {
  code: string;
  name: string;
  status: 'apostille' | 'transition' | 'consular';
  effectiveDate: string;
  guide: string;
}

export const APOSTILLE_COUNTRIES: ApostilleCountryRule[] = [
  {
    code: 'CN',
    name: '중국 (본토)',
    status: 'apostille',
    effectiveDate: '2023-11-07 발효',
    guide: '아포스티유 협약국이에요. 불필요한 영사확인 없이 아포스티유 발급으로 인증해요.',
  },
  {
    code: 'VN',
    name: '베트남',
    status: 'apostille',
    effectiveDate: '2026-09-11 발효',
    guide: '2026년 9월 11일부터 아포스티유 협약이 공식 발효됐어요. 사립학교 서류는 현지 공증 후 아포스티유를 받아요.',
  },
  {
    code: 'MN',
    name: '몽골',
    status: 'apostille',
    effectiveDate: '협약 적용국',
    guide: '아포스티유 협약국이에요. 출신국 외교부 아포스티유로 해외 학력 서류를 인증해요.',
  },
  {
    code: 'RU',
    name: '러시아 · 우즈벡 · 카자흐',
    status: 'apostille',
    effectiveDate: '협약 적용국',
    guide: '아포스티유 협약국이에요. 졸업·성적증명서 원본에 아포스티유 및 번역 공증을 준비해요.',
  },
  {
    code: 'PH',
    name: '필리핀',
    status: 'apostille',
    effectiveDate: '협약 적용국',
    guide: '아포스티유 협약국(DFA Apostille)이에요. 사립학교 서류는 현지 공증 절차를 함께 확인해요.',
  },
  {
    code: 'BD',
    name: '방글라데시',
    status: 'apostille',
    effectiveDate: '2025-03-30 발효',
    guide: '2025년 3월 30일부터 아포스티유 협약이 발효됐어요.',
  },
  {
    code: 'TH',
    name: '태국',
    status: 'transition',
    effectiveDate: '2027-02-28 발효 예정',
    guide: '2027년 2월 27일 이전 제출 시에는 영사확인(재외동포청·주한공관)이 필요하고, 2027년 2월 28일 이후 아포스티유가 적용돼요.',
  },
  {
    code: 'KH',
    name: '캄보디아 · 미얀마 · 라오스',
    status: 'consular',
    effectiveDate: '비협약국',
    guide: '아포스티유 비협약국이에요. 출신국 외교부 인증 후 주재국 한국대사관(또는 재외동포청) 영사확인을 받아야 해요.',
  },
];

export const ADMISSION_TERMS: Record<string, AdmissionTerm> = {
  apostille: {
    id: 'apostille',
    term: '아포스티유(Apostille)',
    easyKo: '외국 학교 졸업장·성적표가 진짜 문서임을 해당 국가 정부에서 확인해 주는 도장(인증서)이에요. (2026년 9월 베트남 포함 131개국 적용)',
    translations: {
      en: 'Official government authentication proving a foreign school certificate is genuine (131 countries including Vietnam as of Sep 2026).',
      'zh-Hans': '证明外国学校毕业证或成绩单真实性的官方认证印章（截至2026年9月含中国、越南共131国适用）。',
      'zh-Hant': '證明外國學校畢業證或成績單真實性的官方認證印章（截至2026年9月含131國適用）。',
      vi: 'Chứng nhận hợp pháp hóa của chính phủ (Việt Nam chính thức áp dụng từ 11/09/2026).',
      ru: 'Официальный штамп, подтверждающий подлинность иностранного аттестата (131 страна).',
      mn: 'Гадаадын сургуулийн гэрчилгээ жинхэнэ болохыг батлах албан ёсны баталгаажуулалт.',
      ar: 'تصديق حكومي رسمي يثبت صحة الشهادة المدرسية الأجنبية.',
    },
    cluster: '해외 학력 인증 서류',
  },
  supernumerary: {
    id: 'supernumerary',
    term: '정원 외 선발',
    easyKo: '일반 학생 모집 인원(정원)과 별도로 따로 뽑는 전형이에요. 고입 특례 2% 이내, 대입 특성화고졸 1.5% 이내, 순수외국인은 수시 6회 제한도 없어요.',
    translations: {
      en: 'Separate quota outside regular student limits (pure-foreigner tracks also bypass the 6-application Susi cap).',
      'zh-Hans': '普通招生名额之外的单独名额，纯外国人招生不受随时6次志愿限制。',
      'zh-Hant': '普通招生名額之外的單獨名額，純外國人招生不受隨時6次志願限制。',
      vi: 'Chỉ tiêu riêng ngoài chỉ tiêu thường; diện người nước ngoài không bị giới hạn 6 nguyện vọng Susi.',
      ru: 'Отдельная квота сверх основного набора без ограничения 6 заявок Susi.',
      mn: 'Ердийн квотоос тусдаа нэмэлт квот.',
      ar: 'مقاعد قبول إضافية منفصلة عن الحصة العادية للطلاب.',
    },
    cluster: '전형 유형·정원 규정',
  },
  foreign_credit: {
    id: 'foreign_credit',
    term: '외국학교 학력인정',
    easyKo: '해외에서 다닌 학교가 교육부 인정 정규 학교인지 확인받아 한국 학년으로 인정받는 절차예요.',
    translations: {
      en: 'Verification that a foreign school is officially accredited so your grade level counts in Korea.',
      'zh-Hans': '确认在海外就读的学校是否为正规认证学校，以换算韩国学历的程序。',
      'zh-Hant': '確認在海外就讀的學校是否為正規認證學校，以換算韓國學歷的程序。',
      vi: 'Thủ tục xác nhận trường học ở nước ngoài được công nhận để tính lớp học tại Hàn Quốc.',
      ru: 'Признание зарубежной школы для зачета пройденных классов в Корее.',
      mn: 'Гадаадад сурсан сургуулийн боловсролыг Солонгост хүлээн зөвшөөрүүлэх журам.',
      ar: 'معادلة الشهادات المدرسية الأجنبية للاعتراف بالصف الدراسي في كوريا.',
    },
    cluster: '해외 학력 인증 서류',
  },
  d2_change: {
    id: 'd2_change',
    term: 'D-2 유학비자 체류자격 변경',
    easyKo: '고교 졸업 후 대학 입학 시 F-1/F-3에서 D-2로 바꾸는 절차예요. F-4·F-5·F-2 비자는 D-2 변경과 잔고증명이 면제돼요.',
    translations: {
      en: 'Changing from F-1/F-3 to D-2 student visa upon university admission (F-4/F-5/F-2 holders are exempt).',
      'zh-Hans': '升入大学时从F-1/F-3变更为D-2留学签证的手续（F-4/F-5/F-2免变更及存款证明）。',
      'zh-Hant': '升入大學時從F-1/F-3變更為D-2留學簽證的手續（F-4/F-5/F-2免變更）。',
      vi: 'Chuyển từ visa F-1/F-3 sang D-2 khi vào đại học (F-4/F-5/F-2 được miễn).',
      ru: 'Смена визы F-1/F-3 на учебную D-2 при поступлении (F-4/F-5/F-2 освобождены).',
      mn: 'F-1/F-3 визээ D-2 болгон солих журам (F-4/F-5/F-2 чөлөөлөгдөнө).',
      ar: 'تحويل تأشيرة المرافقة إلى تأشيرة طالب جامعي (D-2) عند القبول.',
    },
    cluster: '비자·체류자격 전환',
  },
  financial_proof: {
    id: 'financial_proof',
    term: '재정능력 입증 서류',
    easyKo: 'D-2 유학비자 발급 시 필요한 은행 잔고증명서(보통 발급 1개월 이내 원본)예요. F계열 비자나 육성형 전문기술학과(TOPIK 3급+)는 면제돼요.',
    translations: {
      en: 'Bank balance certificate for D-2 visa (typically issued within 1 month; F-visas are exempt).',
      'zh-Hans': '申请D-2签证所需的银行存款证明（通常需1个月内原件；F类签证免交）。',
      'zh-Hant': '申請D-2簽證所需的銀行存款證明（通常需1個月內原件；F類簽證免交）。',
      vi: 'Chứng minh tài chính (số dư ngân hàng trong vòng 1 tháng; visa F được miễn).',
      ru: 'Справка из банка для визы D-2 (обычно не старше 1 месяца; для F-виз не требуется).',
      mn: 'D-2 визэд шаардагдах банкны үлдэгдлийн тодорхойлолт.',
      ar: 'إثبات مالي (كشف حساب بنكي) لتأشيرة D-2.',
    },
    cluster: '비자·체류자격 전환',
  },
  equal_opportunity: {
    id: 'equal_opportunity',
    term: '고른기회(다문화) 특별전형',
    easyKo: '다문화가족지원법 제2조(결혼이민·귀화 가정 한국 국적 자녀)가 지원하는 수시 전형이에요. 부모 모두 외국 국적이면 순수외국인 전형으로 가야 해요.',
    translations: {
      en: 'Susi special track for Korean-citizen children of multicultural families (both-foreign-parent students use the Foreigner Track).',
      'zh-Hans': '面向多元文化家庭韩国籍子女的招生；父母均为外国籍者需申请纯外国人招生。',
      'zh-Hant': '面向多元文化家庭韓國籍子女的招生；父母均為外國籍者需申請純外國人招生。',
      vi: 'Diện tuyển sinh cho con gia đình đa văn hóa có quốc tịch Hàn; cả bố mẹ là người nước ngoài nộp diện người nước ngoài.',
      ru: 'Квота для детей из мультикультурных семей с гражданством Кореи.',
      mn: 'Солонгос иргэншилтэй олон соёлт гэр бүлийн хүүхдийн тусгай элсэлт.',
      ar: 'مسار قبول خاص لأبناء الأسر متعددة الثقافات حاملي الجنسية الكورية.',
    },
    cluster: '전형 유형·정원 규정',
  },
};

export const ADMISSION_TRACKS: AdmissionTrack[] = [
  {
    id: 'hs-special-2c',
    level: 'middle',
    title: '서울 고등학교 특례 신입학 (유형 2-다 · 외국인)',
    quotaType: '정원 외',
    legalBasis: '초·중등교육법 시행령 제82조 제3항 제2호 다목',
    eligibleBackgrounds: ['both_foreign', 'mid_entry'],
    minKorean: ['beginner', 'topik_3_4', 'topik_5_6'],
    summary: '외국 학교에서 국내 중학교로 전·편입학해 졸업 예정인 외국인 학생이 학교별 모집정원 2% 이내 정원 외로 진학하는 전형이에요.',
    requirements: [
      '외국 학교 재학 후 국내 중학교 전·편입 및 졸업(예정)',
      '연 2회(1차 8월 말 / 2차 10월 중순 마감 참고) 서울시교육청 특례심사 통과',
    ],
    requiredDocs: ['고입전형 특례 대상자 심사원서', '외국학교 성적·재학증명서(아포스티유/영사확인)', '외국인등록사실증명(부모 포함)', '출입국사실증명서'],
    termIds: ['supernumerary', 'foreign_credit', 'apostille'],
    visaNote: '아포스티유·영사확인에 2~6주 걸리므로 중3 7월 초부터 서류를 준비하세요.',
    gapHint: '외국 학교 재학 이력이 없다면 아래 특성화고 미래인재전형으로 바로 지원할 수 있어요.',
    referenceUrl: 'https://www.sen.go.kr',
    referenceLabel: '서울시교육청 고입 특례 공고',
    asOfYear: '2026~2027학년도',
  },
  {
    id: 'hs-vocational-future',
    level: 'middle',
    title: '서울 특성화고 미래인재 · 사회통합 특별전형',
    quotaType: '정원 내',
    legalBasis: '2027학년도 서울시교육청 특성화고 신입생 모집 요강',
    eligibleBackgrounds: ['both_foreign', 'multicultural', 'mid_entry', 'undocumented'],
    minKorean: ['beginner', 'topik_3_4', 'topik_5_6'],
    summary: '미래인재전형은 교과 성적을 반영하지 않고 출결+봉사+면접(60~70점) 중심으로 선발해 중도입국·한국어 초기 학생에게 가장 유리해요.',
    requirements: [
      '2027학년도 기준 특별전형 11월 23~24일, 일반전형 11월 30일~12월 1일 접수',
      '주의: 대입 특성화고 특별전형을 노린다면 마이스터고(지원 제외)가 아닌 특성화고를 선택하세요.',
    ],
    requiredDocs: ['입학원서(서울 중학생 NEIS / 검정고시·타시도 방문 접수)', '중학교 학생부 또는 검정고시 합격증', '사회다양성 증빙(중위소득 160% 이하 해당 시)'],
    termIds: ['foreign_credit', 'equal_opportunity'],
    visaNote: '국내 7년+ 체류·초중고 졸업 외국인 청소년은 대학 없이 고졸 직행 취업비자(E-7-Y) 및 구직(D-10, 3년)이 가능해요.',
    gapHint: '모든 배경·한국어 수준에서 바로 지원 가능한 가장 열린 고입 경로예요.',
    referenceUrl: 'https://high-job.sen.go.kr',
    referenceLabel: '서울시교육청 하이잡(High-Job)',
    asOfYear: '2027학년도 확정',
  },
  {
    id: 'univ-foreign-parents',
    level: 'high',
    title: '대학 부모 모두 외국인 특별전형 (순수외국인)',
    quotaType: '정원 외',
    legalBasis: '고등교육법 시행령 제29조 제2항 (수시 6회 제한 미적용)',
    eligibleBackgrounds: ['both_foreign', 'mid_entry'],
    minKorean: ['topik_3_4', 'topik_5_6'],
    summary: '본인과 부모 모두 외국 국적일 때 수능 없이 서류·면접·TOPIK으로 연중 다회(2~4회) 지원할 수 있어요. 검정고시는 주요 대학 대부분 불인정해요.',
    requirements: [
      '학생·부모 모두 외국 국적(복수국적 제외, 한부모 부양의무자 증빙 가능 대학 있음)',
      'TOPIK 3~4급 이상 (건국대 4급, 시립·과기·숭실·동국 3급 이상) 및 정규 고교 졸업',
    ],
    requiredDocs: ['정규 고교 졸업·성적증명서(아포스티유/영사확인)', '가족관계 공증본', '유효기간 2년 내 TOPIK 성적표', '잔고증명(D-2 대상자만, F비자 면제)'],
    termIds: ['supernumerary', 'd2_change', 'financial_proof', 'apostille'],
    visaNote: '등록금 납부 시 사설환전소 이용은 보이스피싱 연루 위험이 크니 반드시 대학 공식 은행 가상계좌를 쓰세요.',
    gapHint: '현재 TOPIK 초급이라면 먼저 TOPIK 3급(숭실·시립·과기 등) 또는 4급(건국 등)을 취득하면 바로 지원 가능해요.',
    referenceUrl: 'https://www.adiga.kr',
    referenceLabel: '대교협 어디가 · 대학 국제처',
    asOfYear: '2026~2027학년도',
  },
  {
    id: 'univ-multicultural-eq',
    level: 'high',
    title: '대학 고른기회(기회균형) · 다문화가정 자녀 특별전형',
    quotaType: '정원 내·외',
    legalBasis: '다문화가족지원법 제2조 · 대교협 2027 수시 시행계획',
    eligibleBackgrounds: ['multicultural'],
    minKorean: ['topik_3_4', 'topik_5_6'],
    summary: '결혼이민·귀화 가정의 대한민국 국적 자녀가 학생부종합·교과 전형으로 지원하는 트랙이에요. 서울 주요 10개대 중 6개교가 운영해요.',
    requirements: [
      '다문화가족지원법 제2조 해당 한국 국적 학생 (부모 모두 외국 국적 제외)',
      '대학별 소득 제한 또는 수능 최저학력기준 확인 (경희대 기회균형Ⅱ 등)',
    ],
    requiredDocs: ['학교생활기록부', '가족관계증명서·혼인관계증명서', '기본증명서(귀화 이력 상세)'],
    termIds: ['equal_opportunity', 'supernumerary'],
    visaNote: '한국 국적 보유 시 국가장학금 및 우리다문화·명인다문화장학재단(중위소득 100% 이하) 지원이 가능해요.',
    gapHint: '교과 학습 한국어(TOPIK 4급 이상 수준)를 갖추면 학생부종합 서류 경쟁력이 크게 올라가요.',
    referenceUrl: 'https://www.adiga.kr',
    referenceLabel: '대교협 어디가 다문화전형',
    asOfYear: '2027학년도 기준',
  },
  {
    id: 'univ-vocational-grad',
    level: 'high',
    title: '특성화고교 졸업자 특별전형 (동일계열)',
    quotaType: '정원 외',
    legalBasis: '초·중등교육법 시행령 제91조 (입학정원 1.5% 이내, 마이스터고 제외)',
    eligibleBackgrounds: ['both_foreign', 'multicultural', 'mid_entry'],
    minKorean: ['topik_3_4', 'topik_5_6'],
    summary: '서울 29개 4년제 대학이 운영해요. 한국어 수능이 부담스럽다면 정시(수능 100%)보다 수시 서류형(건국대 22명·숙명여대 24명 등)을 우선 검토하세요.',
    requirements: [
      '일반 특성화고 졸업(예정) — 마이스터고·종합고 보통과 제외',
      '기준학과 일치 또는 전문교과 30단위 이상 이수 (2028학년도 고교학점제부터 24학점 전환)',
    ],
    requiredDocs: ['특성화고 학교생활기록부', '고교장 확인 동일계열확인서'],
    termIds: ['supernumerary', 'd2_change'],
    visaNote: '국내 체류 7년 미만 외국 국적 특성화고 졸업생은 법무부 지정 전문대 육성형 전문기술학과(E-7-M) 연계도 가능해요.',
    gapHint: '전문교과 30단위(2028년부터 24학점) 이수와 TOPIK 3~4급을 함께 챙기면 수시 서류형 지원이 열려요.',
    referenceUrl: 'https://www.adiga.kr',
    referenceLabel: '대교협 특성화고 특별전형',
    asOfYear: '2027학년도 기준',
  },
];

export const SEOUL_VOCATIONAL_SCHOOLS: SeoulVocationalSchool[] = [
  {
    neisCode: '7010531',
    officeCode: 'B10',
    name: '성암국제무역고등학교',
    schoolType: '특성화고',
    district: '강북구',
    field: 'business',
    majors: ['미주무역과', '중국무역과', '일본무역과', '국제문화콘텐츠과'],
    specialTrack: '국내 유일 무역 특성화고 · 이중언어 강점 최적',
    univSpecialEligible: true,
  },
  {
    neisCode: '7010524',
    officeCode: 'B10',
    name: '서울관광고등학교',
    schoolType: '특성화고',
    district: '관악구',
    field: 'culinary',
    majors: ['외식조리과', '카페경영과', '관광경영계열'],
    specialTrack: '2027 미래인재전형(160명, 교과 미반영·면접 중심)',
    univSpecialEligible: true,
  },
  {
    neisCode: '7010516',
    officeCode: 'B10',
    name: '서울컨벤션고등학교',
    schoolType: '특성화고',
    district: '강동구',
    field: 'culinary',
    majors: ['컨벤션·관광·비즈니스 계열'],
    specialTrack: '2027 미래인재전형(출결·봉사·면접, 교과 미반영)',
    univSpecialEligible: true,
  },
  {
    neisCode: '7010539',
    officeCode: 'B10',
    name: '세명컴퓨터고등학교',
    schoolType: '특성화고',
    district: '은평구',
    field: 'it',
    majors: ['인공지능소프트웨어과', '게임소프트웨어과', '스마트보안솔루션과', '디바이스소프트웨어과'],
    specialTrack: '2027 미래인재전형(교과 미반영) · 대입 IT 동일계열 유리',
    univSpecialEligible: true,
  },
  {
    neisCode: '7010541',
    officeCode: 'B10',
    name: '서울영상고등학교',
    schoolType: '특성화고',
    district: '양천구',
    field: 'design',
    majors: ['영상·콘텐츠·미디어 계열'],
    specialTrack: '2027 미래인재전형 · 비언어 시각 포트폴리오 강점',
    univSpecialEligible: true,
  },
  {
    neisCode: '7010545',
    officeCode: 'B10',
    name: '이화미디어고등학교',
    schoolType: '특성화고',
    district: '중구',
    field: 'design',
    majors: ['미디어·디자인 계열'],
    specialTrack: '2027 미래인재전형(출결·봉사·면접)',
    univSpecialEligible: true,
  },
  {
    neisCode: '7010518',
    officeCode: 'B10',
    name: '단국대부속소프트웨어고등학교',
    schoolType: '특성화고',
    district: '강남구',
    field: 'it',
    majors: ['소프트웨어·AI·IT 계열'],
    specialTrack: '미래인재전형 · 대입 특성화고 IT 동일계열 연계',
    univSpecialEligible: true,
  },
  {
    neisCode: '7010513',
    officeCode: 'B10',
    name: '대동세무고등학교',
    schoolType: '특성화고',
    district: '종로구',
    field: 'business',
    majors: ['세무·회계·금융 계열'],
    specialTrack: '상업계열 대표교 · 경영/회계 대입 동일계열 폭넓음',
    univSpecialEligible: true,
  },
  {
    neisCode: '7010542',
    officeCode: 'B10',
    name: '대진디자인고등학교',
    schoolType: '특성화고',
    district: '강남구',
    field: 'design',
    majors: ['시각디자인·실내디자인·콘텐츠 계열'],
    specialTrack: '디자인 실무 중심 · 한국어 학술 장벽 상대적 완화',
    univSpecialEligible: true,
  },
  {
    neisCode: '7010555',
    officeCode: 'B10',
    name: '서울의료보건고등학교',
    schoolType: '특성화고',
    district: '중구',
    field: 'health',
    majors: ['보건간호과', '의료경영과', '치의보건간호과'],
    specialTrack: '미래인재전형 · 보건·간호 계열 진학/취업 연계',
    univSpecialEligible: true,
  },
  {
    neisCode: '7010529',
    officeCode: 'B10',
    name: '미림마이스터고등학교',
    schoolType: '마이스터고',
    district: '관악구',
    field: 'it',
    majors: ['소프트웨어·IT 개발 계열'],
    specialTrack: '2027 사회통합·고입 특례 명시 (주의: 대입 특성화고 전형 제외)',
    univSpecialEligible: false,
  },
  {
    neisCode: '7010536',
    officeCode: 'B10',
    name: '서울로봇고등학교 · 수도전기공업고',
    schoolType: '마이스터고',
    district: '강남구',
    field: 'it',
    majors: ['로봇·자동화 · 전기·에너지 계열'],
    specialTrack: '2027 사회통합(중위소득 160%↓)·고입 특례 명시 (대입 특성화고 전형 제외)',
    univSpecialEligible: false,
  },
];

export const UNIVERSITY_TOPIK_TABLE: UniversityTopikRow[] = [
  {
    id: 'ssu',
    university: '숭실대',
    gedAccepted: '원칙 불인정(정규고)',
    topik3: '40%',
    topik4: '60%',
    topik5: '80%',
    topik6: '100%',
    minTopik: 'TOPIK 3급 이상 또는 자체시험',
    vocationalTrack: '정시 다군 10명(수능 100%)',
    multiculturalTrack: '기회균형(수시 학종)',
    fields: ['it', 'business', 'design'],
    note: '대학 공식 확인 · TOPIK 3~5급 구간 감면율 최상위',
  },
  {
    id: 'konkuk',
    university: '건국대',
    gedAccepted: '원칙 불인정(정규고)',
    topik3: '30%',
    topik4: '50%',
    topik5: '70%',
    topik6: '100%',
    minTopik: 'TOPIK 4급 이상(접수일 유효)',
    vocationalTrack: '수시 학종 22명(서류70+학생부30)',
    multiculturalTrack: '기회균형(수시 학종)',
    fields: ['it', 'business', 'design', 'health'],
    note: '대학 공식 확인 · 2026 후기부터 5급 70% 상향, F비자 잔고증명 면제',
  },
  {
    id: 'kookmin',
    university: '국민대',
    gedAccepted: '원칙 불인정(정규고)',
    topik3: '30%',
    topik4: '50%',
    topik5: '70%',
    topik6: '100%',
    minTopik: 'TOPIK 3급+ / IELTS 6.5',
    vocationalTrack: '수시 재직자(서류100%) · 정시 정원외',
    multiculturalTrack: '기회균형(수시 학종)',
    fields: ['design', 'it', 'business'],
    note: '신입특전장학금 · 3급 30%~6급 전액 감면',
  },
  {
    id: 'seoultech',
    university: '서울과기대',
    gedAccepted: '불인정',
    topik3: '미지급',
    topik4: '50%',
    topik5: '100%',
    topik6: '100%+기숙사',
    minTopik: 'TOPIK 3급 이상 (2027 국제대학 개편)',
    vocationalTrack: '수시·정시 정원외(공학·IT 특화)',
    multiculturalTrack: '기회균형(수시 학종)',
    fields: ['it', 'design', 'business'],
    note: '서류심사 등급(A/B) 충족 시 5급 전액·6급 기숙사비까지 지원, 영어트랙 동일',
  },
  {
    id: 'uos',
    university: '서울시립대',
    gedAccepted: '불인정',
    topik3: '30%',
    topik4: '40%',
    topik5: '50%',
    topik6: '60%',
    minTopik: 'TOPIK 3급 이상 (서류 100%)',
    vocationalTrack: '정시 나군 24명(수능 100%)',
    multiculturalTrack: '고른기회 다문화 운영',
    fields: ['it', 'business', 'design'],
    note: '2027학번 개편 기준 · 국공립 최저 학비(약 215만)에 자동 감면 추가 적용',
  },
  {
    id: 'dongguk',
    university: '동국대',
    gedAccepted: '불인정',
    topik3: '30%',
    topik4: '50%',
    topik5: '50%',
    topik6: '50%',
    minTopik: 'TOPIK 3급 이상',
    vocationalTrack: '정시 가·나·다군 15명(수능 100%)',
    multiculturalTrack: '고른기회 다문화 운영',
    fields: ['design', 'business', 'it'],
    note: '외국인 어학우수장학 · 고지서 자동 감면 + 재학생 TOPIK 응시료 지원',
  },
  {
    id: 'hufs',
    university: '한국외대',
    gedAccepted: '불인정',
    topik3: '미지급',
    topik4: '30%',
    topik5: '50%',
    topik6: '100%',
    minTopik: 'TOPIK 제출 (이중언어 강점)',
    vocationalTrack: '수시·정시 정원외(기준학과 확인)',
    multiculturalTrack: '고른기회 다문화 운영',
    fields: ['business', 'it', 'culinary'],
    note: '검정고시 불인정 · 잔고증명 발급 1개월 이내 원본 · 재학 중 5·6급 장학',
  },
  {
    id: 'khu',
    university: '경희대',
    gedAccepted: '원칙 불인정(정규고)',
    topik3: '미지급',
    topik4: '미지급',
    topik5: '50%',
    topik6: '100%',
    minTopik: 'TOPIK 또는 KHU 시험',
    vocationalTrack: '정시 직탐 허용 · 수시 재직자(교과70+면접30)',
    multiculturalTrack: '학종 기회균형Ⅱ 통합 운영',
    fields: ['culinary', 'business', 'health', 'it'],
    note: '전기 1·2차 다회 모집 · 합격 후 잔고증명 원본 필수',
  },
  {
    id: 'hanyang',
    university: '한양대',
    gedAccepted: '원칙 불인정(정규고)',
    topik3: '미지급',
    topik4: '미지급',
    topik5: '50%',
    topik6: '100%',
    minTopik: 'TOPIK PBT/IBT (시범 제외)',
    vocationalTrack: '정시 가·나군(수능 위주)',
    multiculturalTrack: '기회균형(수시 학종)',
    fields: ['it', 'business', 'design'],
    note: '합격자 중 D-2 비자 신청자만 잔고증명 제출 · 재학 중 5·6급 장학 최대 2회',
  },
  {
    id: 'skku',
    university: '성균관대',
    gedAccepted: '불인정',
    topik3: '미지급',
    topik4: '미지급',
    topik5: '50%',
    topik6: '100%',
    minTopik: '한국어트랙 TOPIK 제출',
    vocationalTrack: '정시 나군 17명(수능 100%)',
    multiculturalTrack: '학종 기회균형 14명(서류 100%)',
    fields: ['it', 'business', 'design'],
    note: 'GED·홈스쿨링 불인정 명시 · 이공계 삼성 글로벌 성균장학 별도 운영',
  },
  {
    id: 'cau',
    university: '중앙대',
    gedAccepted: '원칙 불인정(정규고)',
    topik3: '미지급',
    topik4: '미지급',
    topik5: '50%',
    topik6: '100%',
    minTopik: 'TOPIK 또는 중앙대 어학원 4~5급',
    vocationalTrack: '정시 나·다군 25명(수능 100%)',
    multiculturalTrack: '기회균형(수시 학종)',
    fields: ['design', 'business', 'it'],
    note: '연 4회 모집 · 중국 은행 잔고증명은 2027.3.31 이후까지 동결 필수',
  },
  {
    id: 'smwu',
    university: '숙명여대',
    gedAccepted: '원칙 불인정(정규고)',
    topik3: '정액 30만',
    topik4: '정액 30만',
    topik5: '정액 30만',
    topik6: '정액 30만',
    minTopik: '정규 고교 졸업 여성 외국인',
    vocationalTrack: '수시 학종 24명(서류 100%)',
    multiculturalTrack: '기회균형(수시 학종)',
    fields: ['design', 'business', 'culinary'],
    note: '대학 공식 확인 · 2025.9 입학자부터 신·편입생 TOPIK 장학 정액 30만 원',
  },
];

export const EXTERNAL_SCHOLARSHIPS: ExternalScholarshipRule[] = [
  {
    id: 'kosaf',
    name: '국가장학금 (한국장학재단)',
    org: '교육부 · 한국장학재단',
    benefit: '학자금 지원구간별 등록금 차등 지원',
    eligibleBackgrounds: ['multicultural'],
    excludeRule: '대한민국 국적 대학생 대상 (부모 모두 외국 국적 학생 원칙 제외)',
    asOfYear: '2026 기준',
  },
  {
    id: 'woori',
    name: '우리다문화장학재단 (학업·특기장학)',
    org: '우리다문화장학재단',
    benefit: '초 100만 · 중 150만 · 고 250만 · 대학생 500만 원 (중위소득 100% 이하)',
    eligibleBackgrounds: ['multicultural'],
    excludeRule: '부모 모두 외국 국적인 가정 및 북한이탈주민 지원 불가',
    asOfYear: '2026 공고',
  },
  {
    id: 'myungin',
    name: '명인다문화장학재단 대학 장학생',
    org: '명인다문화장학재단',
    benefit: '1인당 400만 원 생활비성 장학금 (중위소득 100% 이하)',
    eligibleBackgrounds: ['multicultural'],
    excludeRule: '부모 모두 외국 국적 불가 · 입학 첫 학기 및 졸업 직전 학기 제외',
    asOfYear: '2026 1·2학기',
  },
  {
    id: 'gks',
    name: '정부초청외국인장학 (GKS-U)',
    org: '교육부 · 국립국제교육원',
    benefit: '등록금 전액 + 생활비(연 약 1,440만 원 참고) · TOPIK 5~6급 어학연수 면제',
    eligibleBackgrounds: ['both_foreign', 'mid_entry'],
    excludeRule: '외국 국적 학부 진학자 대상 (공관·대학 전형 세부 요강 확인)',
    asOfYear: '2027 기준',
  },
  {
    id: 'sdream',
    name: '삼성꿈장학재단 글로벌 희망장학',
    org: '삼성꿈장학재단',
    benefit: '등록금 전액 + 월 80만 원 생활비 (TOPIK 2급 이상, 협력대학 추천)',
    eligibleBackgrounds: ['both_foreign'],
    excludeRule: '주의: 한국 초·중·고 1학기라도 이수한 학생 및 교포는 지원 불가!',
    asOfYear: '2026~2027',
  },
];

export interface VisaStepNode {
  stage: string;
  code: string;
  desc: string;
}

export const VISA_SKILL_TREE: Record<BackgroundType, { title: string; warning: string; nodes: VisaStepNode[] }> = {
  both_foreign: {
    title: '외국인가정 학생 진학·고졸취업 비자 스킬트리 (2025~2026 개정)',
    warning: '선택하신 배경 정보는 서버에 저장되지 않아요. 외국 국적 고교생(F-1·F-3·D-4-3)은 원칙적으로 아르바이트가 금지돼요.',
    nodes: [
      {
        stage: '고졸 직행(국내 7년+)',
        code: 'E-7-Y / D-10(3년)',
        desc: '2025.4.1 신설: 18~24세, 국내 7년+ 체류·초중고 졸업(또는 KIIP 5단계) 시 대학 없이 점수제 면제 D-10(3년) 및 E-7-Y 취업 가능',
      },
      {
        stage: '대학·전문대 진학',
        code: 'D-2 / E-7-M',
        desc: 'D-2 변경(F-4/F-5/F-2는 면제). 체류 7년 미만 직업계고 졸업생은 육성형 전문기술학과(TOPIK 3급+ 잔고증명 면제·주 35시간 알바) → E-7-M 연계',
      },
      {
        stage: '대학 졸업·구직',
        code: 'D-10 (최장 3년)',
        desc: '2025.10.29 개정: 체류 상한 3년 확대, TOPIK 4급+ 국내 대졸 시 점수제 면제, 인턴 누적 제한 폐지',
      },
      {
        stage: '취업·장기 정주',
        code: 'E-7 / F-2-R',
        desc: '2026.2.1 E-7 최저연봉(E-7-1 3,112만 · E-7-2/3 2,589만). 2026.8.3 F-2-R 한국어 요건 TOPIK 3급 완화',
      },
    ],
  },
  multicultural: {
    title: '국제결혼·다문화가정 학생 진학 경로',
    warning: '대한민국 국적 보유 시 비자 제약 없이 고른기회(다문화) 전형, 국가장학금, 우리·명인다문화장학금을 활용할 수 있어요.',
    nodes: [
      { stage: '중학교 → 고입', code: '미래인재·사회통합', desc: '서울 특성화고 미래인재(교과 미반영·면접 중심) 또는 일반고·사회통합전형 선택' },
      { stage: '고등학교', code: '이중언어·세특', desc: '모국어·한국어 이중언어 역량과 전공 연계 활동 관리 (특성화고는 전문교과 30단위/2028년 24학점 확인)' },
      { stage: '대학 입학', code: '고른기회·특성화고졸', desc: '다문화 고른기회(서울 주요 6개대 145명) 또는 특성화고 수시 서류형(건국·숙명 등) 지원' },
    ],
  },
  mid_entry: {
    title: '중도입국 학생 학력인정 → 진학·취업 경로 (2026 최신)',
    warning: '주의: 해외 신규 유치 직업계고 유학생(D-4-3)은 2025.10 사증 발급이 중단됐고, 외국 국적 학생이 검정고시를 선택하면 주요대 순수외국인 전형 지원이 막혀요.',
    nodes: [
      { stage: '공교육 진입', code: '학력심의·KSL', desc: '베트남(2026.9 발효)·중국은 아포스티유, 태국(~2027.2.27)·캄보디아는 영사확인 준비' },
      { stage: '고교 진학', code: '고입 특례 2-다', desc: '외국 학교 → 국내 중학 전편입 졸업 시 정원 외 2% 특례 또는 특성화고 미래인재전형' },
      { stage: '대학·전문대', code: 'D-2 / 육성형 E-7-M', desc: '정규 고교 졸업 후 순수외국인(TOPIK 3~6급 장학) 또는 전문대 육성형 전문기술학과(E-7-M) 연계' },
    ],
  },
  undocumented: {
    title: '미등록 장기체류 아동 구제대책 (2025.4.1 ~ 2028.3.31 연장)',
    warning: '이 선택값은 서버·DB에 절대 남지 않아요. 국공립 학교는 출입국 통보 의무가 면제돼요(출입국관리법 제84조).',
    nodes: [
      { stage: '구제 요건', code: '국내 6년/7년+', desc: '국내출생·6세 미만 입국 6년+ / 6세 이후 입국 7년+ 체류 + 초·중·고 재학 또는 졸업' },
      { stage: '아동·형제 체류', code: 'D-4 / 형제 G-1', desc: '재학 중 고교 졸업까지 D-4 부여. 2025.4 신설: 미성년 형제·자매도 체류기간 무관 G-1 동시 부여' },
      { stage: '부모 동반 체류', code: 'G-1 · 범칙금 70%↓', desc: '실제 양육 부모는 자녀 고교 졸업·성년까지 G-1 허용, 불법체류 범칙금 70% 감경(소명 시 추가 감면)' },
      { stage: '고교 졸업 후', code: 'D-2 / D-10 / E-7-Y', desc: '대학 진학(D-2) 또는 구직(D-10)·국내성장취업(E-7-Y)으로 합법 정주 전환 가능' },
    ],
  },
};
