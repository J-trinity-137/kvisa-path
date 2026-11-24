import { applyKAnonymityMask, type AnonymousEvent } from 'kbridge-core';
import { ADMISSION_TERMS } from './admissionsData';

export interface TermBottleneckRow {
  termId: string;
  term: string;
  cluster: string;
  selectedUsers: number;
  validRespondents: number;
  assignedOpportunities: number;
  smoothedRate: number; // p_tilde = (x + 5 * p0) / (n + 5)
  expectedAffected: number;
  liveAddedCount: number;
}

export interface DistrictFunnelRow {
  district: string;
  langLabel: string;
  episodes: number;
  cardViewed: number;
  contactTried: number;
  connected7d: number;
  failedReported: number;
  noFollowup: number;
  mainDropReason: string;
  interpreterNote: string;
}

export interface WeeklyDidPoint {
  week: number;
  earlyAccuracy: number; // %
  lateAccuracy: number; // %
  responseRate: number; // %
  isExamWeek?: boolean | undefined;
}

export interface ValidationSummary {
  seedCount: number;
  virtualSchools: number;
  virtualStudents: number;
  weeks: number;
  totalOpportunities: number;
  integrityErrors: number;
  effectRecoveryRate: number; // %
  nullFalseAlarmRate: number; // %
  tfidfMacroF1: number;
}

const PRIOR_P0 = 0.22;
const NEXT_DEPLOY_TARGET = 180;

const BASE_TERM_COUNTS: Record<string, { x: number; n: number; assigned: number }> = {
  apostille: { x: 89, n: 186, assigned: 216 },
  d2_change: { x: 78, n: 184, assigned: 216 },
  supernumerary: { x: 64, n: 188, assigned: 216 },
  foreign_credit: { x: 59, n: 182, assigned: 216 },
  financial_proof: { x: 52, n: 180, assigned: 216 },
  equal_opportunity: { x: 31, n: 185, assigned: 216 },
};

export const BASE_DISTRICT_FUNNELS: DistrictFunnelRow[] = [
  {
    district: '구로구',
    langLabel: '중국어(간체)',
    episodes: 54,
    cardViewed: 49,
    contactTried: 41,
    connected7d: 34,
    failedReported: 3,
    noFollowup: 4,
    mainDropReason: '운영 시간(평일 18시 종료)',
    interpreterNote: '배치 4명 (2026-06-30 기준)',
  },
  {
    district: '영등포구',
    langLabel: '중국어(간체)',
    episodes: 48,
    cardViewed: 44,
    contactTried: 37,
    connected7d: 31,
    failedReported: 3,
    noFollowup: 3,
    mainDropReason: '서류 준비 문의 반복',
    interpreterNote: '배치 5명 (2026-06-30 기준)',
  },
  {
    district: '금천구',
    langLabel: '베트남어',
    episodes: 26,
    cardViewed: 23,
    contactTried: 17,
    connected7d: 12,
    failedReported: 3,
    noFollowup: 2,
    mainDropReason: '연락 시간 불일치',
    interpreterNote: '배치 2명 (2026-06-30 기준)',
  },
  {
    district: '용산구',
    langLabel: '아랍어',
    episodes: 18,
    cardViewed: 16,
    contactTried: 12,
    connected7d: 4,
    failedReported: 6,
    noFollowup: 2,
    mainDropReason: '통번역지원사 배치 0명',
    interpreterNote: '배치 0명 — 광역 연계 필요',
  },
  {
    district: '동대문구',
    langLabel: '몽골어',
    episodes: 15,
    cardViewed: 14,
    contactTried: 11,
    connected7d: 8,
    failedReported: 1,
    noFollowup: 2,
    mainDropReason: '대상 조건 안내 모호',
    interpreterNote: '배치 2명 (2026-06-30 기준)',
  },
  {
    district: '관악구',
    langLabel: '태국어',
    episodes: 7, // < 10명: k-익명성 마스킹 검증용 셀
    cardViewed: 6,
    contactTried: 4,
    connected7d: 1,
    failedReported: 2,
    noFollowup: 1,
    mainDropReason: '표본 보호 대상',
    interpreterNote: '배치 0명',
  },
];

/**
 * 조기 도입 학급(6주차 쉬운 입시 용어 카드 도입) vs 지연 도입 학급(9주차 도입)
 * 4주차·8주차는 시험주간으로 응답률만 하락(선택 편향 분리 검증)
 */
export const WEEKLY_DID_SERIES: WeeklyDidPoint[] = [
  { week: 1, earlyAccuracy: 52, lateAccuracy: 53, responseRate: 88 },
  { week: 2, earlyAccuracy: 54, lateAccuracy: 54, responseRate: 86 },
  { week: 3, earlyAccuracy: 51, lateAccuracy: 52, responseRate: 87 },
  { week: 4, earlyAccuracy: 50, lateAccuracy: 51, responseRate: 68, isExamWeek: true },
  { week: 5, earlyAccuracy: 53, lateAccuracy: 52, responseRate: 85 },
  { week: 6, earlyAccuracy: 67, lateAccuracy: 53, responseRate: 86 }, // 조기군 개입 시작
  { week: 7, earlyAccuracy: 71, lateAccuracy: 54, responseRate: 87 },
  { week: 8, earlyAccuracy: 70, lateAccuracy: 52, responseRate: 66, isExamWeek: true },
  { week: 9, earlyAccuracy: 73, lateAccuracy: 66, responseRate: 85 }, // 지연군 개입 시작
  { week: 10, earlyAccuracy: 74, lateAccuracy: 70, responseRate: 86 },
  { week: 11, earlyAccuracy: 75, lateAccuracy: 72, responseRate: 87 },
  { week: 12, earlyAccuracy: 76, lateAccuracy: 73, responseRate: 88 },
];

export const VALIDATION_SUMMARY: ValidationSummary = {
  seedCount: 20,
  virtualSchools: 6,
  virtualStudents: 432,
  weeks: 12,
  totalOpportunities: 5184,
  integrityErrors: 0,
  effectRecoveryRate: 100.0,
  nullFalseAlarmRate: 15.0,
  tfidfMacroF1: 1.0,
};

export function computeTermBottlenecks(liveEvents: AnonymousEvent[]): TermBottleneckRow[] {
  const liveTermMap = new Map<string, number>();
  for (const ev of liveEvents) {
    if (ev.kind === 'term_confused' && ev.choiceCode) {
      liveTermMap.set(ev.choiceCode, (liveTermMap.get(ev.choiceCode) ?? 0) + 1);
    }
  }

  return Object.values(ADMISSION_TERMS)
    .map((termObj) => {
      const base = BASE_TERM_COUNTS[termObj.id] ?? { x: 20, n: 180, assigned: 216 };
      const liveAdded = liveTermMap.get(termObj.id) ?? 0;
      const x = base.x + liveAdded;
      const n = base.n + liveAdded;
      const smoothedRate = (x + 5 * PRIOR_P0) / (n + 5);
      return {
        termId: termObj.id,
        term: termObj.term,
        cluster: termObj.cluster,
        selectedUsers: x,
        validRespondents: n,
        assignedOpportunities: base.assigned + liveAdded,
        smoothedRate,
        expectedAffected: Math.round(NEXT_DEPLOY_TARGET * smoothedRate),
        liveAddedCount: liveAdded,
      };
    })
    .sort((a, b) => b.smoothedRate - a.smoothedRate);
}

export function computeDistrictFunnels(liveEvents: AnonymousEvent[]): (DistrictFunnelRow & {
  rateDisplay: string;
  masked: boolean;
})[] {
  const liveByDistrict = new Map<string, { episodes: number; connected: number; failed: number }>();

  for (const ev of liveEvents) {
    if (!ev.spanText) continue;
    const prev = liveByDistrict.get(ev.spanText) ?? { episodes: 0, connected: 0, failed: 0 };
    if (ev.kind === 'referral_opened') prev.episodes += 1;
    if (ev.kind === 'referral_connected') prev.connected += 1;
    if (ev.kind === 'referral_failed') prev.failed += 1;
    liveByDistrict.set(ev.spanText, prev);
  }

  return BASE_DISTRICT_FUNNELS.map((row) => {
    const delta = liveByDistrict.get(row.district);
    const episodes = row.episodes + (delta?.episodes ?? 0);
    const connected7d = row.connected7d + (delta?.connected ?? 0);
    const failedReported = row.failedReported + (delta?.failed ?? 0);
    const pct = episodes > 0 ? Math.round((connected7d / episodes) * 100) : 0;
    const maskedRes = applyKAnonymityMask(episodes, pct, 10);

    return {
      ...row,
      episodes,
      cardViewed: row.cardViewed + (delta?.episodes ?? 0),
      contactTried: row.contactTried + (delta?.connected ?? 0) + (delta?.failed ?? 0),
      connected7d,
      failedReported,
      masked: maskedRes.masked,
      rateDisplay: maskedRes.masked ? maskedRes.display : `${pct}%`,
    };
  });
}

export function computeDidEffect(): {
  earlyDiff: number;
  lateDiff: number;
  didEstimate: number;
} {
  // 공통 비교 구간: 사전(1~5주) vs 조기 도입 후·지연 도입 전(6~8주)
  const preEarly = avg(WEEKLY_DID_SERIES.slice(0, 5).map((p) => p.earlyAccuracy));
  const postEarly = avg(WEEKLY_DID_SERIES.slice(5, 8).map((p) => p.earlyAccuracy));
  const preLate = avg(WEEKLY_DID_SERIES.slice(0, 5).map((p) => p.lateAccuracy));
  const postLate = avg(WEEKLY_DID_SERIES.slice(5, 8).map((p) => p.lateAccuracy));

  const earlyDiff = round1(postEarly - preEarly);
  const lateDiff = round1(postLate - preLate);
  return {
    earlyDiff,
    lateDiff,
    didEstimate: round1(earlyDiff - lateDiff),
  };
}

function avg(nums: number[]): number {
  return nums.reduce((acc, v) => acc + v, 0) / nums.length;
}

function round1(val: number): number {
  return Math.round(val * 10) / 10;
}

export interface StudentSignalSummary {
  quizTotal: number;
  quizCorrect: number;
  quizAccuracyPct: number | null;
  docBarriers: { reason: string; count: number; liveAdded: number }[];
  questionTopics: { topic: string; count: number; liveAdded: number }[];
}

const BASE_DOC_BARRIERS: Record<string, number> = {
  overseas: 46,
  format: 34,
  cost: 27,
  deadline: 19,
};

const BASE_QUESTION_TOPICS: Record<string, number> = {
  '장학금·비용 지원': 38,
  '비자·체류자격 전환': 35,
  '해외 학력·서류 준비': 29,
  '시간제 취업·알바': 24,
  '검정고시·학력인정': 17,
  '기타 입시·진로 질문': 9,
};

const BARRIER_LABELS: Record<string, string> = {
  overseas: '해외 발급 어려움',
  format: '양식·절차 모름',
  cost: '번역·공증 비용 부담',
  deadline: '제출 기한 부족',
};

export function computeStudentSignalSummary(liveEvents: AnonymousEvent[]): StudentSignalSummary {
  let quizTotal = 0;
  let quizCorrect = 0;
  const liveBarrierMap = new Map<string, number>();
  const liveTopicMap = new Map<string, number>();

  for (const ev of liveEvents) {
    if (ev.kind === 'quiz_first_answer') {
      quizTotal += 1;
      if (ev.choiceCode === 'correct') quizCorrect += 1;
    } else if (ev.kind === 'doc_barrier' && ev.choiceCode) {
      liveBarrierMap.set(ev.choiceCode, (liveBarrierMap.get(ev.choiceCode) ?? 0) + 1);
    } else if (ev.kind === 'free_question' && ev.choiceCode) {
      liveTopicMap.set(ev.choiceCode, (liveTopicMap.get(ev.choiceCode) ?? 0) + 1);
    }
  }

  const docBarriers = Object.entries(BASE_DOC_BARRIERS)
    .map(([code, base]) => {
      const liveAdded = liveBarrierMap.get(code) ?? 0;
      return {
        reason: BARRIER_LABELS[code] ?? code,
        count: base + liveAdded,
        liveAdded,
      };
    })
    .sort((a, b) => b.count - a.count);

  const questionTopics = Object.entries(BASE_QUESTION_TOPICS)
    .map(([topic, base]) => {
      const liveAdded = liveTopicMap.get(topic) ?? 0;
      return {
        topic,
        count: base + liveAdded,
        liveAdded,
      };
    })
    .sort((a, b) => b.count - a.count);

  return {
    quizTotal,
    quizCorrect,
    quizAccuracyPct: quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : null,
    docBarriers,
    questionTopics,
  };
}
