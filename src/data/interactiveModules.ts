import type { InterestField } from './admissionsData';

export type DocBarrierReason = 'overseas' | 'cost' | 'format' | 'deadline';

export interface DocGuideItem {
  id: string;
  name: string;
  whereToGet: string;
  tip: string;
}

export interface QuizItem {
  id: string;
  question: string;
  answer: 'O' | 'X';
  explanation: string;
}

export interface DDaySchedule {
  id: string;
  title: string;
  target: string;
  /** Inclusive start date, YYYY-MM-DD (Korea civil date). */
  dateStr: string;
  /** Inclusive end date. Omit when the event is a single day. */
  endDateStr?: string;
  sourceUrl: string;
  sourceLabel: string;
  verifiedOn: string;
}

export type SchedulePhase = 'upcoming' | 'open' | 'closed';

export function schedulePhase(schedule: DDaySchedule, today: string): SchedulePhase {
  const end = schedule.endDateStr ?? schedule.dateStr;
  if (today < schedule.dateStr) return 'upcoming';
  if (today > end) return 'closed';
  return 'open';
}

export function daysUntil(dateStr: string, today: string): number {
  const start = Date.parse(`${dateStr}T00:00:00Z`);
  const now = Date.parse(`${today}T00:00:00Z`);
  return Math.round((start - now) / 86_400_000);
}

export interface CareerSuggestion {
  field: InterestField;
  jobs: string[];
  majors: string[];
  note: string;
}

export const DOC_BARRIER_LABELS: Record<DocBarrierReason, string> = {
  overseas: '해외 발급 어려움',
  cost: '번역·공증 비용 부담',
  format: '양식·절차 모름',
  deadline: '제출 기한 부족',
};

export const DOC_CHECKLIST_ITEMS: DocGuideItem[] = [
  {
    id: 'doc-apostille',
    name: '아포스티유 · 영사확인 서류',
    whereToGet: '출신국 외교부(아포스티유 협약국) 또는 주한 대사관 영사과',
    tip: '발급에 2~6주 걸릴 수 있어 원서 접수 2개월 전에 먼저 준비해요.',
  },
  {
    id: 'doc-transcript',
    name: '외국학교 전 학년 성적·재학증명서',
    whereToGet: '해외 이전 학교 행정실 (영문 또는 한국어 번역 공증)',
    tip: '입학·전학 날짜와 학년 표기가 누락되지 않았는지 꼭 확인해요.',
  },
  {
    id: 'doc-topik',
    name: 'TOPIK(한국어능력시험) 성적표',
    whereToGet: 'TOPIK 공식 홈페이지(topik.go.kr) 온라인 발급',
    tip: '성적 유효기간은 발표일로부터 2년이에요.',
  },
  {
    id: 'doc-finance',
    name: '재정능력 입증 서류 (잔고증명 등)',
    whereToGet: '본인 또는 부모 명의 은행 창구·앱 (장학금 확인서 대체 가능)',
    tip: '대학별 요구 금액과 발급 유효기간(보통 30일 이내)이 달라요.',
  },
  {
    id: 'doc-family',
    name: '가족관계·다문화가족 증빙 서류',
    whereToGet: '정부24(gov.kr) · 주민센터 · 출신국 가족관계 공증본',
    tip: '귀화 이력이 필요하면 기본증명서(상세)를 함께 발급받아요.',
  },
];

export const ADMISSION_QUIZ_ITEMS: QuizItem[] = [
  {
    id: 'quiz-1',
    question: '부모 모두 외국인인 정원 외 특별전형은 일반 한국 학생 정원과 직접 경쟁한다.',
    answer: 'X',
    explanation: '정원 외 선발은 일반 모집 인원과 별도로 선발하므로 일반 학생과 직접 경쟁하지 않아요.',
  },
  {
    id: 'quiz-2',
    question: '미등록(체류 미확인) 아동이라도 거주사실 확인이 되면 국내 초·중·고 입학이 가능하다.',
    answer: 'O',
    explanation: '초·중등교육법 시행령 제19조로 교육권이 보장되며, 국공립 학교는 출입국 통보 의무가 면제돼요.',
  },
  {
    id: 'quiz-3',
    question: '외국 국적 학생이 대학에 합격하면 동반비자(F-1/F-3) 그대로 자동 연장되므로 D-2 변경은 필요 없다.',
    answer: 'X',
    explanation: '대학 입학 시 표준입학허가서를 받아 유학비자(D-2) 등으로 체류자격 변경 절차를 확인해야 해요.',
  },
  {
    id: 'quiz-4',
    question: '서울 특성화고 미래인재 특별전형은 내신 성적만으로 100% 선발한다.',
    answer: 'X',
    explanation: '취업·창업 의지, 출결, 심층 면접 등 소질과 적성을 종합 평가해요.',
  },
];

export const DDAY_SCHEDULES: DDaySchedule[] = [
  {
    id: 'sched-meister-apply',
    title: '서울 마이스터고 원서접수',
    target: '중3 (고입)',
    dateStr: '2026-10-19',
    endDateStr: '2026-10-22',
    sourceUrl: 'https://jinhak.sen.go.kr/subList/20000000430',
    sourceLabel: '서울진로진학정보센터 2027학년도 고입 주요 일정',
    verifiedOn: '2026-11-26',
  },
  {
    id: 'sched-voc-apply',
    title: '서울 특성화고 특별전형 원서접수',
    target: '중3 (고입)',
    dateStr: '2026-11-23',
    endDateStr: '2026-11-24',
    sourceUrl: 'https://www.sen.go.kr/user/bbs/BD_selectBbs.do?q_bbsDocNo=20261029094009856&q_bbsSn=1028',
    sourceLabel: '서울시교육청 정책돋보기, 2027학년도 서울 특성화고 신입생 모집 (2026-10-29)',
    verifiedOn: '2026-11-26',
  },
  {
    id: 'sched-voc-interview',
    title: '서울 특성화고 특별전형 면접',
    target: '중3 (고입)',
    dateStr: '2026-11-25',
    endDateStr: '2026-11-26',
    sourceUrl: 'https://high-job.sen.go.kr/FUS/BO/J1List.do',
    sourceLabel: '서울시교육청 하이잡 특성화고 입학전형 일정',
    verifiedOn: '2026-11-26',
  },
  {
    id: 'sched-topik-109',
    title: '제109회 TOPIK I·II (지필)',
    target: '중·고 전체',
    dateStr: '2026-11-15',
    sourceUrl: 'https://www.niied.go.kr/convert/preview/1765176663798/index.html',
    sourceLabel: '교육부 공고 제2025-317호 (2026년 TOPIK 시행계획), 대한민국 시험일',
    verifiedOn: '2026-11-26',
  },
  {
    id: 'sched-topik-110',
    title: '제110회 TOPIK I·II (지필)',
    target: '중·고 전체',
    dateStr: '2027-01-10',
    sourceUrl: 'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=333&boardSeq=107584&lev=0&m=0205&opType=N&page=1&s=moe&searchType=null&statusYN=W',
    sourceLabel: '교육부 공고 제2026-419호 (2027년 TOPIK 시행계획), 대한민국 시험일 1.10.',
    verifiedOn: '2026-11-26',
  },
  {
    id: 'sched-foreign-early-2028',
    title: '2028학년도 재외국민·외국인 특별전형 원서접수(7월 창구)',
    target: '고3 (대입)',
    dateStr: '2027-07-05',
    endDateStr: '2027-07-09',
    sourceUrl: 'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=103993&lev=0&m=020402&opType=N&page=1&s=moe&searchType=null&statusYN=W',
    sourceLabel: '대교협 2028학년도 대학입학전형기본사항. 대학은 7.5.~7.9. 또는 9.20.~9.23. 중 3일 이상 접수할 수 있음',
    verifiedOn: '2026-11-26',
  },
  {
    id: 'sched-susi-2028',
    title: '2028학년도 수시모집 원서접수',
    target: '고3 (대입)',
    dateStr: '2027-09-20',
    endDateStr: '2027-09-23',
    sourceUrl: 'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=103993&lev=0&m=020402&opType=N&page=1&s=moe&searchType=null&statusYN=W',
    sourceLabel: '대교협 2028학년도 대학입학전형기본사항. 9.20.~9.23. 중 3일 이상',
    verifiedOn: '2026-11-26',
  },
];

export const CAREER_RECOMMENDATIONS: Record<InterestField, CareerSuggestion> = {
  it: {
    field: 'it',
    jobs: ['소프트웨어 개발자', '정보보안 전문가', '데이터 분석가'],
    majors: ['컴퓨터공학과', '소프트웨어학과', '인공지능학과'],
    note: 'E-7 전문취업 비자 전환 수요가 가장 안정적인 분야예요.',
  },
  culinary: {
    field: 'culinary',
    jobs: ['호텔 조리사', '관광통역안내사', '글로벌 호텔리어'],
    majors: ['호텔조리학과', '관광경영학과', '외식산업학과'],
    note: '이중언어(모국어+한국어) 역량이 면접과 취업에서 큰 강점이 돼요.',
  },
  design: {
    field: 'design',
    jobs: ['UI/UX 디자이너', '영상·모션 디자이너', '브랜드 디자이너'],
    majors: ['시각디자인학과', '디지털미디어디자인과', '영상학과'],
    note: '포트폴리오 비중이 높아 한국어 필기 부담이 상대적으로 적어요.',
  },
  business: {
    field: 'business',
    jobs: ['해외영업 담당자', '무역·물류 전문가', '금융·회계 사무원'],
    majors: ['국제통상학과', '경영학과', '글로벌비즈니스학과'],
    note: '모국어권 해외 무역·통상 분야에서 이주배경 인재 수요가 높아요.',
  },
  health: {
    field: 'health',
    jobs: ['간호사', '국제의료 코디네이터', '치위생사'],
    majors: ['간호학과', '보건행정학과', '치위생학과'],
    note: '국가면허 취득 시 국내외 병원·다국어 의료 통역 코디네이터로 진출해요.',
  },
};

export const QUESTION_TOPIC_CODES = [
  'ged',
  'scholarship',
  'part_time',
  'visa_status',
  'documents',
  'other',
] as const;

export type QuestionTopicCode = (typeof QUESTION_TOPIC_CODES)[number];

export interface QuestionClassification {
  topicCode: QuestionTopicCode;
  topic: string;
  guideAnswer: string;
}

/**
 * 비정형 학생 질문 텍스트를 클라이언트 측 규칙·키워드로 즉시 토픽 분류하고 맞춤 가이드를 반환한다.
 */
const TOPIC_KEYWORDS: Record<QuestionTopicCode, readonly string[]> = {
  ged: ['검정고시', 'ged', '중퇴', '검정신분', '同等学力', '检定', '檢定', 'tương đương', 'экстерн', 'тэнцэх шалгалт', 'معادلة'],
  scholarship: ['장학', '등록금', '돈', '비용', '학비', '奖学金', '學費', '學費', 'học bổng', 'học phí', 'стипенд', 'тэтгэлэг', 'منحة', 'رسوم'],
  part_time: ['알바', '아르바이트', '취업', '시간제', '打工', '兼职', 'làm thêm', 'подработ', 'ажил', 'عمل'],
  visa_status: ['비자', '체류', '미등록', 'd-2', 'f-1', '签证', '簽證', '居留', 'visa', 'виза', 'виз', 'تأشيرة', 'إقامة'],
  documents: ['서류', '아포스티유', '공증', '성적', '材料', '公证', '海牙', 'giấy tờ', 'apostille', 'апостил', '문서', 'бичиг', 'وثائق', 'تصديق'],
  other: [],
};

export function classifyQuestionTopic(rawText: string): QuestionClassification {
  const q = rawText.toLowerCase();
  const hit = (code: QuestionTopicCode) => TOPIC_KEYWORDS[code].some((word) => q.includes(word.toLowerCase()));
  if (hit('ged') || q.includes('검정고시') || q.includes('ged') || q.includes('중퇴')) {
    return {
      topicCode: 'ged',
      topic: '검정고시·학력인정',
      guideAnswer:
        '검정고시 합격은 국내에서 고등학교 졸업과 같은 학력으로 인정돼요. 대학 순수외국인 전형은 이와 달라서, 정규 고등학교 졸업만 받고 검정고시를 받지 않는 곳이 많아요. 이 앱의 대학 표는 모두 불인정 또는 원칙 불인정으로 표시돼 있어요. 그중 숭실대 2027학년도 1학기 모집요강만 국내·외 검정고시 지원 불가를 확인했고, 다른 대학 칸은 아직 요강 원문을 확인하지 못했습니다.',
    };
  }
  if (hit('scholarship')) {
    return {
      topicCode: 'scholarship',
      topic: '장학금·비용 지원',
      guideAnswer:
        '한국 국적 학생은 국가장학금과 다문화 장학금을 따로 확인하고, 외국 국적 학생은 대학별 TOPIK 장학을 확인해요. 숭실대 입학장학금(TOPIK 3급 40%·4급 60%·5급 80%·6급 100%)은 입학 직후 첫 학기만 적용돼요. 다른 대학 숫자는 이번 점검에서 원문을 확인하지 못했습니다.',
    };
  }
  if (hit('part_time')) {
    return {
      topicCode: 'part_time',
      topic: '시간제 취업·알바',
      guideAnswer:
        '외국 국적 학생은 출입국 사전 허가 없이 일하면 체류 연장에 불이익이 생길 수 있어요. 학교 국제교류팀에 먼저 확인하세요. 질문 문장 자체는 저장하지 않아요.',
    };
  }
  if (hit('visa_status')) {
    return {
      topicCode: 'visa_status',
      topic: '비자·체류자격 전환',
      guideAnswer:
        '대학 입학 때는 표준입학허가서로 유학 체류자격 변경이 필요한지 하이코리아에서 확인해요. 체류 상태가 불안정하면 가족센터나 다누리콜센터 1577-1366에 문의할 수 있어요. 질문 문장과 체류자격은 저장하지 않아요.',
    };
  }
  if (hit('documents')) {
    return {
      topicCode: 'documents',
      topic: '해외 학력·서류 준비',
      guideAnswer:
        '해외 학교 성적표·재학증명서는 아포스티유 또는 영사확인이 필요해요. 발급에 여러 주가 걸릴 수 있어 접수보다 일찍 준비하는 편이 안전해요.',
    };
  }
  return {
    topicCode: 'other',
    topic: '기타 입시·진로 질문',
    guideAnswer:
      '질문 문장은 저장하지 않고 주제 코드만 이 기기에 남아요. 구체적인 상담은 우리 구 가족센터 또는 다누리콜센터 1577-1366을 이용하세요.',
  };
}

export function buildQuestionLog(rawText: string, lang: string): {
  app: string;
  opportunityId: string;
  kind: string;
  lang: string;
  choiceCode: QuestionTopicCode;
} {
  const classified = classifyQuestionTopic(rawText);
  return {
    app: 'kvisa-path',
    opportunityId: 'free-question',
    kind: 'free_question',
    lang,
    choiceCode: classified.topicCode,
  };
}
