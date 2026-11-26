/**
 * Weekday part-time limits for degree and language students.
 * Source: Study in Korea page that cites Hi Korea, read 2026-11-26.
 * https://www.studyinkorea.go.kr/cmm/life/residenceAndStayInfo.do?tab=part-time-job
 * The language-training weekend cell on that table is blank, so weekend hours are not treated as unlimited.
 * The 35-hour technical-program row is not on that table.
 */

export const WORK_HOUR_SOURCE = {
  sourceUrl: 'https://www.studyinkorea.go.kr/cmm/life/residenceAndStayInfo.do?tab=part-time-job',
  sourceLabel: 'Study in Korea, part-time work table (source line: Hi Korea)',
  verifiedOn: '2026-11-26',
} as const;

export type WorkStage =
  | 'high_school'
  | 'd4_lang'
  | 'd2_college'
  | 'd2_kcore'
  | 'd2_ba_12'
  | 'd2_ba_34'
  | 'd2_grad';

export interface WorkHourResult {
  hours: number;
  weekendUnlimited: boolean;
  verified: boolean;
  ruleLabel: string;
}

const VERIFIED: Record<
  Exclude<WorkStage, 'high_school' | 'd2_kcore'>,
  { unmet: number; met: number; excellent: number; weekendWhenMet: boolean; ruleLabel: string }
> = {
  d4_lang: {
    unmet: 10,
    met: 20,
    excellent: 25,
    weekendWhenMet: false,
    ruleLabel: 'D-4-1·D-4-7, 6개월 후, TOPIK 2급 등',
  },
  d2_college: {
    unmet: 10,
    met: 25,
    excellent: 30,
    weekendWhenMet: true,
    ruleLabel: '전문학사 D-2-1, TOPIK 3급 등',
  },
  d2_ba_12: {
    unmet: 10,
    met: 25,
    excellent: 30,
    weekendWhenMet: true,
    ruleLabel: '학사 1~2학년, TOPIK 3급 등',
  },
  d2_ba_34: {
    unmet: 10,
    met: 25,
    excellent: 30,
    weekendWhenMet: true,
    ruleLabel: '학사 3~4학년, TOPIK 4급 등',
  },
  d2_grad: {
    unmet: 15,
    met: 30,
    excellent: 35,
    weekendWhenMet: true,
    ruleLabel: '석·박사, TOPIK 4급 등',
  },
};

export function partTimeHours(stage: WorkStage, meetsKoreanRule: boolean, excellent: boolean): WorkHourResult {
  if (stage === 'high_school') {
    return {
      hours: 0,
      weekendUnlimited: false,
      verified: false,
      ruleLabel: '2026.6 매뉴얼의 시간제취업 표는 D-2와 어학 D-4만 다룹니다. 고등학생을 전면 금지한다는 문장은 찾지 못했습니다.',
    };
  }
  if (stage === 'd2_kcore') {
    return {
      hours: 0,
      weekendUnlimited: false,
      verified: false,
      ruleLabel: '육성형 전문기술학과 주 35시간은 2026.6 매뉴얼의 시간제취업 표에서 찾지 못했습니다. 같은 매뉴얼의 35시간은 대학원 성적 우수의 평일 상한입니다.',
    };
  }
  const row = VERIFIED[stage];
  return {
    hours: meetsKoreanRule ? (excellent ? row.excellent : row.met) : row.unmet,
    weekendUnlimited: meetsKoreanRule && row.weekendWhenMet,
    verified: true,
    ruleLabel: row.ruleLabel,
  };
}
