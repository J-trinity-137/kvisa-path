import type { SupportedLangCode } from '../kbridge';

export type VerificationState = 'verified' | 'unverified';

export interface SourcedClaim {
  sourceUrl: string;
  verifiedOn: string;
  applicableTerm: string;
  verification: VerificationState;
  unverifiedReason?: string;
}

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
  verification: VerificationState;
  unverifiedReason?: string;
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
  sourceUrl: string;
  verifiedOn: string;
  majorsSourceUrl: string;
  majorsApplicableTerm: string;
}

export interface UniversityTopikRow {
  id: string;
  university: string;
  gedAccepted: '불인정' | '원칙 불인정(정규고)' | '미확인';
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
  sourceUrl: string;
  verifiedOn: string;
  applicableTerm: string;
  verification: VerificationState;
  unverifiedReason?: string;
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
    summary:
      '2026학년도 지침의 유형 2-다입니다. 외국인 학생이 외국 학교에서 국내 중학교로 전학·편입학(재취학 포함)해 졸업한 경우이고, 학교별 정원의 2% 이내 정원 외입니다. 부모 중 1명이 한국 국민이면 외국에서 중학교 과정 2년 이상이 필요하다고 지침이 적습니다. 2027학년도 지침은 이 게시글에 없습니다.',
    requirements: [
      '외국인 학생이고, 외국 학교에서 국내 중학교로 전학·편입학해 졸업(예정). 복수국적은 이 유형이 아니라고 지침의 체크리스트가 적습니다.',
      '2026학년도 서류 마감은 1차 2025-08-28, 2차 2025-10-16. 제출처는 재학·졸업 중학교. 2027학년도 날짜는 이 문서에 없습니다.',
    ],
    requiredDocs: ['고입전형 특례 대상자 심사원서', '외국학교 성적·재학증명서(아포스티유/영사확인)', '외국인등록사실증명(부모 포함)', '출입국사실증명서'],
    termIds: ['supernumerary', 'foreign_credit', 'apostille'],
    visaNote: '아포스티유·영사확인에 2~6주 걸리므로 중3 7월 초부터 서류를 준비하세요.',
    gapHint: '외국 학교 재학 이력이 없다면 아래 특성화고 미래인재전형으로 바로 지원할 수 있어요.',
    referenceUrl: 'https://www.sen.go.kr/user/bbs/BD_selectBbs.do?q_bbsDocNo=20250729131137773&q_bbsSn=1068',
    referenceLabel: '2026학년도 서울 고교 특례 신입학 지침 게시글',
    asOfYear: '2026학년도 지침',
    verification: 'verified',
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
    referenceUrl: 'https://www.sen.go.kr/user/bbs/BD_selectBbs.do?q_bbsDocNo=20261029094009856&q_bbsSn=1028',
    referenceLabel: '서울시교육청 2027학년도 특성화고 모집 안내',
    asOfYear: '2027학년도',
    verification: 'verified',
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
    referenceUrl: 'https://ssu.ac.kr/%ED%95%99%EC%82%AC/%ED%95%99%EC%82%AC%EC%A0%95%EB%B3%B4/%EC%9E%A5%ED%95%99/%EC%99%B8%EA%B5%AD%EC%9D%B8-%EC%9C%A0%ED%95%99%EC%83%9D-%EC%9E%A5%ED%95%99%EA%B8%88/',
    referenceLabel: '예시: 숭실대 외국인 유학생 장학금 (대학마다 다름)',
    asOfYear: '2026~2027학년도',
    verification: 'unverified',
    unverifiedReason: '트랙 설명의 대학별 인원·급수 예시는 이번 점검에서 대학별로 다시 확인하지 못했습니다. 링크는 확인한 숭실대 장학 페이지입니다.',
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
    referenceUrl: '',
    referenceLabel: '대학별 다문화 전형 페이지는 이번 점검에서 확인하지 못함',
    asOfYear: '2027학년도 기준',
    verification: 'unverified',
    unverifiedReason: '어디가 홈페이지 주소만 있었고, 전형별 공고 URL은 확인하지 못했습니다.',
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
    referenceUrl: 'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=103993&lev=0&m=020402&opType=N&page=1&s=moe&searchType=null&statusYN=W',
    referenceLabel: '교육부 2028학년도 대학입학전형기본사항 보도',
    asOfYear: '2027학년도 기준',
    verification: 'unverified',
    unverifiedReason: '일정 틀은 대교협 기본사항으로 확인했으나, 대학별 모집 인원 숫자는 이번 점검에서 요강 원문을 확인하지 못했습니다.',
  },
];

const SCHOOL_CODE_CHECKED_ON = '2026-11-26';
const MAJOR_GUIDE_URL =
  'https://buseo.sen.go.kr/component/file/ND_fileDownload.do?q_fileId=a925241d-36f4-45a7-8248-0276bf55c975&q_fileSn=2142453';
const MAJOR_TERM = '서울시교육청 특성화고·마이스터고 안내 문서(본문 표기 2025학년도). 2027 모집학과는 학교 요강이 우선입니다.';

function neisSchoolUrl(code: string): string {
  return `https://open.neis.go.kr/hub/schoolInfo?Type=json&pIndex=1&pSize=5&ATPT_OFCDC_SC_CODE=B10&SD_SCHUL_CODE=${code}`;
}

function school(
  partial: Omit<SeoulVocationalSchool, 'officeCode' | 'sourceUrl' | 'verifiedOn' | 'majorsSourceUrl' | 'majorsApplicableTerm'>,
): SeoulVocationalSchool {
  return {
    ...partial,
    officeCode: 'B10',
    sourceUrl: neisSchoolUrl(partial.neisCode),
    verifiedOn: SCHOOL_CODE_CHECKED_ON,
    majorsSourceUrl: MAJOR_GUIDE_URL,
    majorsApplicableTerm: MAJOR_TERM,
  };
}

export const SEOUL_VOCATIONAL_SCHOOLS: SeoulVocationalSchool[] = [
  school({
    neisCode: '7010837',
    name: '성암국제무역고등학교',
    schoolType: '특성화고',
    district: '강북구',
    field: 'business',
    majors: ['미주무역과', '중국무역과', '일본무역과', '국제문화콘텐츠과'],
    specialTrack: '무역 특성화고. 2027학년도 특별전형 원서(11.23~24)는 마감됐어요.',
    univSpecialEligible: true,
  }),
  school({
    neisCode: '7010739',
    name: '서울관광고등학교',
    schoolType: '특성화고',
    district: '관악구',
    field: 'culinary',
    majors: ['카페경영과', '관광서비스과', '외식조리과'],
    specialTrack: '조리·관광 특성화고. 2027학년도 특별전형 원서(11.23~24)는 마감됐어요.',
    univSpecialEligible: true,
  }),
  school({
    neisCode: '7011213',
    name: '서울컨벤션고등학교',
    schoolType: '특성화고',
    district: '강동구',
    field: 'culinary',
    majors: ['미디어사운드과', '베이커리카페과', '컨벤션외식조리과', '관광레저과'],
    specialTrack: '컨벤션·조리 특성화고. 2027학년도 특별전형 원서(11.23~24)는 마감됐어요.',
    univSpecialEligible: true,
  }),
  school({
    neisCode: '7010537',
    name: '세명컴퓨터고등학교',
    schoolType: '특성화고',
    district: '은평구',
    field: 'it',
    majors: ['스마트보안솔루션과', '모빌리티메이커과', '인공지능소프트웨어과', '게임소프트웨어과'],
    specialTrack: '소프트웨어 특성화고. 2027학년도 특별전형 원서(11.23~24)는 마감됐어요.',
    univSpecialEligible: true,
  }),
  school({
    neisCode: '7010795',
    name: '서울영상고등학교',
    schoolType: '특성화고',
    district: '양천구',
    field: 'design',
    majors: ['영상프로듀스과', '영상미디어과', '영상콘텐츠과'],
    specialTrack: '영상 특성화고. 2027학년도 특별전형 원서(11.23~24)는 마감됐어요.',
    univSpecialEligible: true,
  }),
  school({
    neisCode: '7010747',
    name: '이화여자대학교병설미디어고등학교',
    schoolType: '특성화고',
    district: '중랑구',
    field: 'design',
    majors: ['국제경영과', '영상콘텐츠과', '디자인과'],
    specialTrack: '미디어 특성화고(중랑구). 2027학년도 특별전형 원서(11.23~24)는 마감됐어요.',
    univSpecialEligible: true,
  }),
  school({
    neisCode: '7011489',
    name: '단국대학교부속소프트웨어고등학교',
    schoolType: '특성화고',
    district: '강남구',
    field: 'it',
    majors: ['인공지능소프트웨어과', '사물인터넷소프트웨어과', '게임콘텐츠과'],
    specialTrack: '소프트웨어 특성화고. 2027학년도 특별전형 원서(11.23~24)는 마감됐어요.',
    univSpecialEligible: true,
  }),
  school({
    neisCode: '7010833',
    name: '대동세무고등학교',
    schoolType: '특성화고',
    district: '종로구',
    field: 'business',
    majors: ['세무회계과', '관세무역과', '세무행정과'],
    specialTrack: '세무·무역 특성화고. 2027학년도 특별전형 원서(11.23~24)는 마감됐어요.',
    univSpecialEligible: true,
  }),
  school({
    neisCode: '7010740',
    name: '대진디자인고등학교',
    schoolType: '특성화고',
    district: '강남구',
    field: 'design',
    majors: ['시각디자인과', '인테리어디자인과', '메타버스디자인과'],
    specialTrack: '디자인 특성화고. 2027학년도 특별전형 원서(11.23~24)는 마감됐어요.',
    univSpecialEligible: true,
  }),
  school({
    neisCode: '7011486',
    name: '서울의료보건고등학교',
    schoolType: '특성화고',
    district: '중구',
    field: 'health',
    majors: ['보건간호과'],
    specialTrack: '보건간호 특성화고. 2027학년도 특별전형 원서(11.23~24)는 마감됐어요.',
    univSpecialEligible: true,
  }),
  school({
    neisCode: '7011569',
    name: '미림마이스터고등학교',
    schoolType: '마이스터고',
    district: '관악구',
    field: 'it',
    majors: ['뉴미디어소프트웨어과', '뉴미디어디자인과'],
    specialTrack: '2027학년도 마이스터고 원서(10.19~22)는 마감. 대입 특성화고 졸업자 특별전형 대상이 아니에요.',
    univSpecialEligible: false,
  }),
  school({
    neisCode: '7010738',
    name: '서울로봇고등학교',
    schoolType: '마이스터고',
    district: '강남구',
    field: 'it',
    majors: ['로봇설계과', '로봇제어과', '로봇소프트웨어과', '로봇정보통신과'],
    specialTrack: '2027학년도 마이스터고 원서(10.19~22)는 마감. 대입 특성화고 졸업자 특별전형 대상이 아니에요.',
    univSpecialEligible: false,
  }),
  school({
    neisCode: '7010346',
    name: '수도전기공업고등학교',
    schoolType: '마이스터고',
    district: '강남구',
    field: 'it',
    majors: ['전기에너지과', '에너지전자제어과', '에너지기계과', '에너지정보통신과'],
    specialTrack: '전기·에너지 마이스터고라 IT 계열 필터에 함께 보여요. 2027학년도 원서는 마감. 대입 특성화고 특별전형 대상이 아니에요.',
    univSpecialEligible: false,
  }),
];

export const UNIVERSITY_TOPIK_TABLE: UniversityTopikRow[] = [
  {
    id: 'ssu',
    university: '숭실대',
    gedAccepted: '불인정',
    topik3: '40%',
    topik4: '60%',
    topik5: '80%',
    topik6: '100%',
    minTopik: 'TOPIK 3급 이상 또는 자체시험',
    vocationalTrack: '정시 다군 10명(수능 100%)',
    multiculturalTrack: '기회균형(수시 학종)',
    fields: ['it', 'business', 'design'],
    note: '입학 첫 학기만 적용(2025학년도 이후 입학자). 3급 40%·4급 60%·5급 80%·6급 100%. 2026-11-26 학교 페이지에서 확인.',
  },
  {
    id: 'konkuk',
    university: '건국대',
    gedAccepted: '불인정',
    topik3: '30%',
    topik4: '50%',
    topik5: '70%',
    topik6: '100%',
    minTopik: '한국어트랙 신입 최저 TOPIK 4급(2027 전기)',
    vocationalTrack: '수시 학종 22명(서류70+학생부30)',
    multiculturalTrack: '2027 수시 서울캠퍼스 다문화 자녀 전형 없음',
    fields: ['it', 'business', 'design', 'health'],
    note: '2027 전기 요강: 검정고시 불인정. 첫 학기 장학은 3급 30%·4급 50%·5급 70%·6급 100%(고지 감면). 한국어트랙 신입 최저 등급은 4급. F계열은 잔고증명 면제.',
  },
  {
    id: 'kookmin',
    university: '국민대',
    gedAccepted: '불인정',
    topik3: '30%',
    topik4: '50%',
    topik5: '70%',
    topik6: '100%',
    minTopik: '최소 급수 제한 없음(일부 전공은 한국어 요건 없음)',
    vocationalTrack: '수시 재직자(서류100%) · 정시 정원외',
    multiculturalTrack: '2027 수시 다문화 자녀 전형 없음',
    fields: ['design', 'it', 'business'],
    note: '2027-1 신입학 요강: 검정고시·홈스쿨링·사이버학습 불인정. 첫 학기만 3급 30%·4급 50%·5급 70%·6급 100%. 최소 TOPIK 급수는 없음. 다문화 트랙 주소는 이 요강에 없음.',
  },
  {
    id: 'seoultech',
    university: '서울과기대',
    gedAccepted: '불인정',
    topik3: '없음',
    topik4: 'A 70%·B 50%',
    topik5: 'A 전액·B 70%',
    topik6: 'A 전액+기숙사·B 전액',
    minTopik: '공통 TOPIK 3급 또는 대안. 문예창작학과는 TOPIK 6급',
    vocationalTrack: '수시·정시 정원외(공학·IT 특화)',
    multiculturalTrack: '2027 수시 다문화 자녀 전형 없음',
    fields: ['it', 'design', 'business'],
    note: '2027년 3월 요강: 검정고시·홈스쿨링·사이버학습 불인정. 신·편입 장학은 첫 학기만, 서류·면접 A/B/C에 따라 다름. C등급은 없음. 다문화 트랙 주소는 이 요강에 없음.',
  },
  {
    id: 'uos',
    university: '서울시립대',
    gedAccepted: '불인정',
    topik3: '급수별 없음',
    topik4: '급수별 없음',
    topik5: '상위 30% 전액',
    topik6: '차상위 20% 반액',
    minTopik: '신입 TOPIK 3급 등, 편입 TOPIK 4급 등',
    vocationalTrack: '정시 나군 24명(수능 100%)',
    multiculturalTrack: '2027 수시 사회공헌·통합전형 46명 · 한국 국적',
    fields: ['it', 'business', 'design'],
    note: '2027 학부 외국인 요강: 검정고시·홈스쿨링·사이버학습·어학원 불인정. 입학 장학은 TOPIK 급수가 아니라 첫 학기 성적 상위 30% 전액, 차상위 20% 반액. 약 215만 원 학비는 이 요강에 없음. 다문화 트랙 주소는 이 요강에 없음.',
  },
  {
    id: 'dongguk',
    university: '동국대',
    gedAccepted: '불인정',
    topik3: '없음',
    topik4: '30%',
    topik5: '50%',
    topik6: '100%',
    minTopik: 'TOPIK 3급 또는 세종 3B·본교 어학원 등',
    vocationalTrack: '정시 가·나·다군 15명(수능 100%)',
    multiculturalTrack: '2027 수시 다문화 자녀 전형 없음',
    fields: ['design', 'business', 'it'],
    note: '2027년 1학기 1차 요강: 검정고시·홈스쿨링·사이버·평생교육 불인정. 어학우수장학은 입학 첫 학기만 4급 30%·5급 50%·6급 100%. 3급 비율은 없음. 다문화 트랙 주소는 이 요강에 없음.',
  },
  {
    id: 'hufs',
    university: '한국외대',
    gedAccepted: '불인정',
    topik3: '없음',
    topik4: '30%',
    topik5: '50%',
    topik6: '100%',
    minTopik: '한국어트랙 증빙은 TOPIK 3급부터. 없어도 면접으로 대체',
    vocationalTrack: '수시·정시 정원외(기준학과 확인)',
    multiculturalTrack: '2027 수시 다문화 자녀 전형 없음',
    fields: ['business', 'it', 'culinary'],
    note: '2027년 3월 요강: 신입학의 검정고시·홈스쿨링·사이버·어학원 불인정. 첫 학기 언어우수장학은 6급 100%·5급 50%·4급 30%. 3급 비율은 없음. 다문화 트랙 주소는 이 요강에 없음.',
  },
  {
    id: 'khu',
    university: '경희대',
    gedAccepted: '불인정',
    topik3: '없음',
    topik4: '없음',
    topik5: '50%',
    topik6: '100%',
    minTopik: '신입 한국어트랙 TOPIK 3급 또는 경희대 3급 등. 편입은 TOPIK 4급',
    vocationalTrack: '정시 직탐 허용 · 수시 재직자(교과70+면접30)',
    multiculturalTrack: '2027 수시 기회균형전형Ⅱ(정원외) · 한국 국적 자녀',
    fields: ['culinary', 'business', 'health', 'it'],
    note: '2027년 1학기 학부 요강: 검정고시·홈스쿨링·사이버·평생교육 불인정. 입시장학 B는 TOPIK 6급 첫 학기 100%, C는 5급 첫 학기 50%. 3·4급 입학 장학 비율은 없음. 다문화 트랙 주소는 이 요강에 없음.',
  },
  {
    id: 'hanyang',
    university: '한양대',
    gedAccepted: '불인정',
    topik3: '없음',
    topik4: '없음',
    topik5: '50%',
    topik6: '100%',
    minTopik: '학위 시작은 TOPIK 4급 또는 국제교육원 4급. 미충족은 휴학',
    vocationalTrack: '정시 가·나군(수능 위주)',
    multiculturalTrack: '2027 수시 사회통합 신설 · 인터칼리지 자연 5명 · 한국 국적',
    fields: ['it', 'business', 'design'],
    note: '2027년 1학기 서울 학부 요강: 해외 검정고시·사이버학습·성인교육 불인정. 첫 학기 TOPIK 6급 100%·5급 50%. 국내 고교 졸업예정자는 5급 장학 제외. D-2 신청자에게만 잔고증명을 나중에 요청.',
  },
  {
    id: 'skku',
    university: '성균관대',
    gedAccepted: '불인정',
    topik3: '없음',
    topik4: '없음',
    topik5: '50%',
    topik6: '100%',
    minTopik: '지원 때 최저 급수 없음. 없으면 예비합격, 2년 내 4급 후 재지원',
    vocationalTrack: '정시 나군 17명(수능 100%)',
    multiculturalTrack: '2027 수시 다문화 자녀 전형 없음',
    fields: ['it', 'business', 'design'],
    note: '2027 전기 외국인 요강: 검정고시·홈스쿨링·사이버학습 불인정. 지원에 최저 TOPIK은 없고, 증명서가 없으면 예비합격입니다. 2년 안에 TOPIK 4급 이상 또는 성균어학원 4급 수료 후 같은 모집단위에 다시 지원해야 최종합격입니다. 2학년 전공 진입은 4급, 한국어트랙 졸업은 5급입니다. TOPIK 장학은 입학 첫 학기만, 해외 고교를 졸업(예정)한 합격자에게만 6급 100%·5급 50%입니다. 한국 고등학교를 나온 중도입국 학생은 이 장학 대상이 아닙니다. 3·4급 TOPIK 장학은 없고, 성균어학원 4급 과정 추천자만 첫 학기 25%입니다.',
  },
  {
    id: 'cau',
    university: '중앙대',
    gedAccepted: '불인정',
    topik3: '없음',
    topik4: '없음',
    topik5: '50%',
    topik6: '100%',
    minTopik: '예비합격은 TOPIK 없이 가능. 최종은 2년 내 TOPIK 4급 또는 언어교육원 4급',
    vocationalTrack: '정시 나·다군 25명(수능 100%)',
    multiculturalTrack: '2027 수시 어울림 · 한국 국적 · 외국 고교 불가',
    fields: ['design', 'business', 'it'],
    note: '2027년 3월 요강: 사이버학습·검정고시·독학사 지원 불가. 첫 학기 TOPIK 6급 100%·5급 50%. 3·4급 비율은 없음. 중국 은행 잔고증명은 2027-03-31 이후까지 동결. 융합공학부 신설은 TOPIK 5급. 다문화 트랙 주소는 이 요강에 없음.',
  },
  {
    id: 'smwu',
    university: '숙명여대',
    gedAccepted: '불인정',
    topik3: '30%',
    topik4: '40%',
    topik5: '70%',
    topik6: '90%',
    minTopik: '한국어트랙 대부분 TOPIK 3급 등. 융합·한류국제학부는 성적 없이 가능',
    vocationalTrack: '수시 학종 24명(서류 100%)',
    multiculturalTrack: '2027 수시 다문화 자녀 전형 없음',
    fields: ['design', 'business', 'culinary'],
    note: '연 학부 요강은 2026학년도 전기가 마지막입니다. 2027 전기 학부 요강은 찾지 못함. 그 요강은 검정고시·홈스쿨링·사이버 불인정, 첫 학기 6급 90%·5급 70%·4급 40%·3급 30%. 입학 후 1년 내 4급 취득 시 30만 원은 별도. 다문화 트랙 주소는 이 요강에 없음.',
  },
];

export const UNIVERSITY_IDS = [
  'ssu',
  'konkuk',
  'kookmin',
  'seoultech',
  'uos',
  'dongguk',
  'hufs',
  'khu',
  'hanyang',
  'skku',
  'cau',
  'smwu',
] as const;

export type UniversityId = (typeof UNIVERSITY_IDS)[number];

export const UNIVERSITY_GED_RULES: Record<UniversityId, SourcedClaim> = {
  ssu: {
    sourceUrl: 'https://iphak.ssu.ac.kr/upload/SSU(2)_26090184026.pdf',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 1학기 순수외국인 특별전형',
    verification: 'verified',
  },
  konkuk: {
    sourceUrl: 'https://www.konkuk.ac.kr/sites/ciss/건국대_2027전기모집요강_국문.pdf',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 전기',
    verification: 'verified',
  },
  kookmin: {
    sourceUrl: 'https://wfile.kookmin.ac.kr/files-v2/%5B%EC%8B%A0%EC%9E%85%ED%95%99%5D+%5BKR%5D+2027-1+%EB%B6%80%EB%AA%A8%ED%95%99%EC%83%9D%EC%99%B8%EA%B5%AD%EC%9D%B8+%EC%8B%A0%EC%9E%85%ED%95%99+%ED%8A%B9%EB%B3%84%EC%A0%84%ED%98%95+%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95.pdf?id=04649328f294e3a364c8a731dba0c583',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 1학기 신입학',
    verification: 'verified',
  },
  seoultech: {
    sourceUrl: 'https://global.seoultech.ac.kr/storage/irt2/bbs/58432/7C24D887012442A8923DD846EF1E4F4A_.pdf',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 3월 입학',
    verification: 'verified',
  },
  uos: {
    sourceUrl: 'https://oia.uos.ac.kr/koia/web/file/download/uu/1357394c22134489b38acabc744d8eb9',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 학부 외국인특별전형',
    verification: 'verified',
  },
  dongguk: {
    sourceUrl: 'https://www.dongguk.edu/article/INTSTUNOTICE/detail/26766179',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 1학기 1차',
    verification: 'verified',
  },
  hufs: {
    sourceUrl: 'https://international.hufs.ac.kr/sites/international/contents/files/2027spring/HUFS_2027-1_Admission_guide(KOR).pdf',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 3월 입학',
    verification: 'verified',
  },
  khu: {
    sourceUrl: 'https://www.timeshighereducation.com/cms-academic/sites/default/files/institution_downloads/2026-10/Guidelines%20for%20Undergraduate%20International%20Admission_2027%20Spring.pdf',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 1학기 학부',
    verification: 'verified',
  },
  hanyang: {
    sourceUrl: 'https://oia.hanyang.ac.kr/files/attach/filebox/2026/08/24/b95395d7bfde7ab0ed0392027f7c1ff7.pdf',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 1학기 서울 학부',
    verification: 'verified',
  },
  skku: {
    sourceUrl: 'https://admission-global.skku.edu/kor/',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 전기',
    verification: 'verified',
  },
  cau: {
    sourceUrl: 'https://oias.cau.ac.kr/cauoie/under/notice.do?articleNo=51004&attachNo=62965&mode=download',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 3월 입학',
    verification: 'verified',
  },
  smwu: {
    sourceUrl: 'https://e.sookmyung.ac.kr/cms/etcResourceDown.do?key=%24cms%24EwBmDYH0GUAcCcCWA7A5pAhgEwLaIM76ID2ykAqslgKbyrzYCuGALtZANIBKAdLFgDMgA&site=%24cms%24Q',
    verifiedOn: '2026-11-26',
    applicableTerm: '2026학년도 전기 학부',
    verification: 'verified',
  },
};

export const UNIVERSITY_SCHOLARSHIP_RULES: Record<UniversityId, SourcedClaim> = {
  ssu: {
    sourceUrl: 'https://ssu.ac.kr/%ED%95%99%EC%82%AC/%ED%95%99%EC%82%AC%EC%A0%95%EB%B3%B4/%EC%9E%A5%ED%95%99/%EC%99%B8%EA%B5%AD%EC%9D%B8-%EC%9C%A0%ED%95%99%EC%83%9D-%EC%9E%A5%ED%95%99%EA%B8%88/',
    verifiedOn: '2026-11-26',
    applicableTerm: '입학 직후 첫 학기 1회 (2025학년도 이후 입학자)',
    verification: 'verified',
  },
  konkuk: {
    sourceUrl: 'https://www.konkuk.ac.kr/sites/ciss/건국대_2027전기모집요강_국문.pdf',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027 전기 첫 학기(신입학·편입학)',
    verification: 'verified',
  },
  kookmin: {
    sourceUrl: 'https://wfile.kookmin.ac.kr/files-v2/%5B%EC%8B%A0%EC%9E%85%ED%95%99%5D+%5BKR%5D+2027-1+%EB%B6%80%EB%AA%A8%ED%95%99%EC%83%9D%EC%99%B8%EA%B5%AD%EC%9D%B8+%EC%8B%A0%EC%9E%85%ED%95%99+%ED%8A%B9%EB%B3%84%EC%A0%84%ED%98%95+%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95.pdf?id=04649328f294e3a364c8a731dba0c583',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 1학기 신입학 첫 학기',
    verification: 'verified',
  },
  seoultech: {
    sourceUrl: 'https://global.seoultech.ac.kr/storage/irt2/bbs/58432/7C24D887012442A8923DD846EF1E4F4A_.pdf',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 3월 입학 첫 학기',
    verification: 'verified',
  },
  uos: {
    sourceUrl: 'https://oia.uos.ac.kr/koia/web/file/download/uu/1357394c22134489b38acabc744d8eb9',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 전기 첫 학기',
    verification: 'verified',
  },
  dongguk: {
    sourceUrl: 'https://www.dongguk.edu/article/INTSTUNOTICE/detail/26766179',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 1학기 입학 첫 학기',
    verification: 'verified',
  },
  hufs: {
    sourceUrl: 'https://international.hufs.ac.kr/sites/international/contents/files/2027spring/HUFS_2027-1_Admission_guide(KOR).pdf',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 3월 입학 첫 학기',
    verification: 'verified',
  },
  khu: {
    sourceUrl: 'https://www.timeshighereducation.com/cms-academic/sites/default/files/institution_downloads/2026-10/Guidelines%20for%20Undergraduate%20International%20Admission_2027%20Spring.pdf',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 1학기 첫 학기',
    verification: 'verified',
  },
  hanyang: {
    sourceUrl: 'https://oia.hanyang.ac.kr/files/attach/filebox/2026/08/24/b95395d7bfde7ab0ed0392027f7c1ff7.pdf',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 1학기 첫 학기',
    verification: 'verified',
  },
  skku: {
    sourceUrl: 'https://admission-global.skku.edu/kor/',
    verifiedOn: '2026-11-26',
    applicableTerm: '입학 첫 학기, 해외 고교 졸업(예정)자만',
    verification: 'verified',
  },
  cau: {
    sourceUrl: 'https://oias.cau.ac.kr/cauoie/under/notice.do?articleNo=51004&attachNo=62965&mode=download',
    verifiedOn: '2026-11-26',
    applicableTerm: '2027학년도 3월 입학 첫 학기',
    verification: 'verified',
  },
  smwu: {
    sourceUrl: 'https://e.sookmyung.ac.kr/cms/etcResourceDown.do?key=%24cms%24EwBmDYH0GUAcCcCWA7A5pAhgEwLaIM76ID2ykAqslgKbyrzYCuGALtZANIBKAdLFgDMgA&site=%24cms%24Q',
    verifiedOn: '2026-11-26',
    applicableTerm: '2026학년도 전기 첫 학기',
    verification: 'verified',
  },
};

const EXTERNAL_NOT_RECONFIRMED = {
  sourceUrl: '',
  verifiedOn: '2026-11-26',
  verification: 'unverified' as const,
  unverifiedReason: '이번 점검에서 해당 장학 공고 원문을 확인하지 못했습니다.',
};

export const EXTERNAL_SCHOLARSHIPS: ExternalScholarshipRule[] = [
  {
    id: 'kosaf',
    name: '국가장학금 (한국장학재단)',
    org: '교육부 · 한국장학재단',
    benefit: '학자금 지원구간별 등록금 차등 지원',
    eligibleBackgrounds: ['multicultural'],
    excludeRule: '대한민국 국적 대학생 대상 (부모 모두 외국 국적 학생 원칙 제외)',
    asOfYear: '2026 기준',
    applicableTerm: '미확인',
    ...EXTERNAL_NOT_RECONFIRMED,
  },
  {
    id: 'woori',
    name: '우리다문화장학재단 (학업·특기장학)',
    org: '우리다문화장학재단',
    benefit: '초 100만 · 중 150만 · 고 250만 · 대학생 500만 원 (중위소득 100% 이하)',
    eligibleBackgrounds: ['multicultural'],
    excludeRule: '부모 모두 외국 국적인 가정 및 북한이탈주민 지원 불가',
    asOfYear: '2026 공고',
    applicableTerm: '미확인',
    ...EXTERNAL_NOT_RECONFIRMED,
  },
  {
    id: 'myungin',
    name: '명인다문화장학재단 대학 장학생',
    org: '명인다문화장학재단',
    benefit: '1인당 400만 원 생활비성 장학금 (중위소득 100% 이하)',
    eligibleBackgrounds: ['multicultural'],
    excludeRule: '부모 모두 외국 국적 불가 · 입학 첫 학기 및 졸업 직전 학기 제외',
    asOfYear: '2026 1·2학기',
    applicableTerm: '미확인',
    ...EXTERNAL_NOT_RECONFIRMED,
  },
  {
    id: 'gks',
    name: '정부초청외국인장학 (GKS-U)',
    org: '교육부 · 국립국제교육원',
    benefit: '등록금 전액 + 생활비(연 약 1,440만 원 참고) · TOPIK 5~6급 어학연수 면제',
    eligibleBackgrounds: ['both_foreign', 'mid_entry'],
    excludeRule: '외국 국적 학부 진학자 대상 (공관·대학 전형 세부 요강 확인)',
    asOfYear: '2027 기준',
    applicableTerm: '미확인',
    ...EXTERNAL_NOT_RECONFIRMED,
  },
  {
    id: 'sdream',
    name: '삼성꿈장학재단 글로벌 희망장학',
    org: '삼성꿈장학재단',
    benefit: '등록금 전액 + 월 80만 원 생활비 (TOPIK 2급 이상, 협력대학 추천)',
    eligibleBackgrounds: ['both_foreign'],
    excludeRule: '주의: 한국 초·중·고 1학기라도 이수한 학생 및 교포는 지원 불가!',
    asOfYear: '2026~2027',
    applicableTerm: '미확인',
    ...EXTERNAL_NOT_RECONFIRMED,
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
