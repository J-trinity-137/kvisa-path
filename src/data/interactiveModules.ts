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
  dateStr: string; // YYYY-MM-DD
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
  { id: 'sched-voc', title: '서울 특성화고 특별전형 원서접수', target: '중3 (고입)', dateStr: '2026-11-26' },
  { id: 'sched-topik', title: '제109회 TOPIK 한국어능력시험', target: '중·고 전체', dateStr: '2027-01-17' },
  { id: 'sched-susi', title: '2028학년도 대입 수시·외국인전형 1차', target: '고3 (대입)', dateStr: '2027-09-08' },
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

export interface QuestionClassification {
  topic: string;
  guideAnswer: string;
}

/**
 * 비정형 학생 질문 텍스트를 클라이언트 측 규칙·키워드로 즉시 토픽 분류하고 맞춤 가이드를 반환한다.
 */
export function classifyQuestionTopic(rawText: string): QuestionClassification {
  const q = rawText.toLowerCase();
  if (q.includes('검정고시') || q.includes('ged') || q.includes('중퇴')) {
    return {
      topic: '검정고시·학력인정',
      guideAnswer:
        '검정고시 합격자도 국내 고교 졸업 동등 학력으로 인정돼요. 다만 대학 외국인 특별전형은 학교마다 검정고시 인정 여부가 다르니 지원 대학 요강을 꼭 확인하세요.',
    };
  }
  if (q.includes('장학') || q.includes('등록금') || q.includes('돈') || q.includes('비용') || q.includes('학비')) {
    return {
      topic: '장학금·비용 지원',
      guideAnswer:
        '다문화가정 자녀는 국가장학금·지자체 다문화 장학금을 신청할 수 있고, 외국인 특별전형 학생은 TOPIK 급수별(4~6급) 대학 입학 장학금 감면 제도가 많아요.',
    };
  }
  if (q.includes('알바') || q.includes('아르바이트') || q.includes('취업') || q.includes('일')) {
    return {
      topic: '시간제 취업·알바',
      guideAnswer:
        '외국 국적 학생(D-2 등)은 출입국관리사무소 사전 허가(시간제 취업 허가) 없이 일하면 체류 연장 불이익이 생겨요. 학교 국제교류팀 확인서를 먼저 받으세요.',
    };
  }
  if (q.includes('비자') || q.includes('d-2') || q.includes('f-1') || q.includes('미등록') || q.includes('체류')) {
    return {
      topic: '비자·체류자격 전환',
      guideAnswer:
        '대학 입학 시 표준입학허가서로 D-2 변경이 필요하며, 미등록 아동은 장기체류 아동 교육권 구제제도를 통해 가족센터·무료 법률상담을 받을 수 있어요.',
    };
  }
  if (q.includes('서류') || q.includes('아포스티유') || q.includes('공증') || q.includes('성적')) {
    return {
      topic: '해외 학력·서류 준비',
      guideAnswer:
        '해외 학교 성적표·재학증명서는 아포스티유 또는 영사확인이 필요해요. 발급 기간이 길어 접수 2개월 전부터 준비하는 게 안전해요.',
    };
  }
  return {
    topic: '기타 입시·진로 질문',
    guideAnswer:
      '질문이 익명 통계에 기록됐어요. 구체적인 전형 상담은 1번 탭의 우리 구 가족센터(무료 통역) 또는 다누리 1577-1366 3자 통역을 이용하면 정확히 안내받을 수 있어요.',
  };
}
