import type { BackgroundType, SchoolLevel } from './admissionsData';

export const VISA_CODES = [
  'F-1',
  'F-2',
  'F-3',
  'F-4',
  'F-5',
  'F-6',
  'D-2',
  'D-4',
  'D-10',
  'E-7',
  'E-9',
  'H-2',
  'G-1',
  'undocumented',
] as const;

export type VisaCode = (typeof VISA_CODES)[number];

export type ProcedureLevel = SchoolLevel | 'elementary';

export interface VisaPath {
  code: VisaCode;
  title: string;
  summary: string;
  steps: string[];
  sourceUrl: string;
  sourceLabel: string;
  verifiedOn: string;
  verification: 'verified' | 'unverified';
  unverifiedReason?: string;
}

const CHECKED = '2026-11-26';
const STUDY =
  'https://www.studyinkorea.go.kr/cmm/life/residenceAndStayInfo.do?tab=part-time-job';
const MOJ_RELIEF = 'https://www.moj.go.kr/bbs/immigration/211/594335/artclView.do';
const MOJ_PRESS = 'https://www.immigration.go.kr/bbs/moj/182/593197/artclView.do';

export const VISA_PATHS: readonly VisaPath[] = [
  {
    code: 'F-1',
    title: 'F-1 방문동거',
    summary:
      '가족 방문·동거로 불리는 자격입니다. 유학생 시간제취업 표(D-2·D-4)에는 들어 있지 않습니다. 고교생 아르바이트 가능 여부는 이번 점검에서 자격별 원문을 열지 못했습니다.',
    steps: ['학교 재학은 아래 편입학 절차를 보세요.', '대학 진학 때 다른 자격으로 바꾸는지 하이코리아에서 확인하세요.'],
    sourceUrl: '',
    sourceLabel: '하이코리아 자격별 안내 미확인',
    verifiedOn: CHECKED,
    verification: 'unverified',
    unverifiedReason: 'F-1 자격별 안내 원문을 이번 점검에서 열지 못했습니다.',
  },
  {
    code: 'F-2',
    title: 'F-2 거주',
    summary: '거주 자격입니다. F-2-R의 한국어 요건처럼 세부 숫자는 이번 점검에서 원문을 열지 못했습니다.',
    steps: ['취업·학업 가능 범위는 하이코리아 자격별 안내를 보세요.'],
    sourceUrl: '',
    sourceLabel: '하이코리아 자격별 안내 미확인',
    verifiedOn: CHECKED,
    verification: 'unverified',
    unverifiedReason: 'F-2 자격별 안내 원문을 이번 점검에서 열지 못했습니다.',
  },
  {
    code: 'F-3',
    title: 'F-3 동반',
    summary: '주 체류자의 가족에게 붙는 동반 자격으로 알려져 있습니다. 시간제취업 표에는 없습니다. 세부 요건은 미확인입니다.',
    steps: ['대학 진학 시 자격 변경이 필요한지 하이코리아에서 확인하세요.'],
    sourceUrl: '',
    sourceLabel: '하이코리아 자격별 안내 미확인',
    verifiedOn: CHECKED,
    verification: 'unverified',
    unverifiedReason: 'F-3 자격별 안내 원문을 이번 점검에서 열지 못했습니다.',
  },
  {
    code: 'F-4',
    title: 'F-4 재외동포',
    summary: '재외동포 자격입니다. 유학 자격 변경이나 잔고증명 면제 여부는 이번 점검에서 원문을 확인하지 못했습니다.',
    steps: ['하이코리아 재외동포 안내를 확인하세요.'],
    sourceUrl: '',
    sourceLabel: '하이코리아 자격별 안내 미확인',
    verifiedOn: CHECKED,
    verification: 'unverified',
    unverifiedReason: 'F-4 자격별 안내 원문을 이번 점검에서 열지 못했습니다.',
  },
  {
    code: 'F-5',
    title: 'F-5 영주',
    summary: '영주 자격입니다. 학업·취업 제한이 없는지로 단정하지 않습니다. 원문을 열지 못했습니다.',
    steps: ['하이코리아 영주 안내를 확인하세요.'],
    sourceUrl: '',
    sourceLabel: '하이코리아 자격별 안내 미확인',
    verifiedOn: CHECKED,
    verification: 'unverified',
    unverifiedReason: 'F-5 자격별 안내 원문을 이번 점검에서 열지 못했습니다.',
  },
  {
    code: 'F-6',
    title: 'F-6 결혼이민',
    summary: '한국 국민의 배우자 자격으로 알려져 있습니다. 자녀의 국적·체류는 가족마다 달라서 이 카드에 단정하지 않습니다.',
    steps: ['자녀가 한국 국적이면 비자 경로가 아니라 고른기회 전형을 보세요.', '자격 요건은 하이코리아에서 확인하세요.'],
    sourceUrl: '',
    sourceLabel: '하이코리아 자격별 안내 미확인',
    verifiedOn: CHECKED,
    verification: 'unverified',
    unverifiedReason: 'F-6 자격별 안내 원문을 이번 점검에서 열지 못했습니다.',
  },
  {
    code: 'D-2',
    title: 'D-2 유학',
    summary:
      '학위 과정 유학 자격입니다. Study in Korea(출처를 하이코리아로 적음)는 D-2-1~4·6·7의 시간제취업을 한국어 기준에 따라 주중 10~30시간, 우대 시 최대 35시간으로 적고, 기준을 채우면 주말·방학은 시간 제한이 없다고 적습니다. 다른 자격에서 바꾸려면 새 활동을 시작하기 전에 체류자격 변경 허가가 필요하다고 같은 페이지가 적습니다.',
    steps: [
      '시간제취업은 학교 확인서와 허가 후에만 합니다.',
      '허가 대상은 그 페이지 기준 D-2-1~4, D-2-6, D-2-7입니다. D-2-8은 6개월 뒤로 적혀 있습니다.',
    ],
    sourceUrl: STUDY,
    sourceLabel: 'Study in Korea 시간제취업·체류자격 변경 (Hi Korea 출처 표기)',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    code: 'D-4',
    title: 'D-4 일반연수',
    summary:
      '같은 페이지는 어학연수 D-4-1·D-4-7을, 자격 변경일 또는 입국일부터 6개월이 지난 뒤 시간제취업 신청이 가능하다고 적습니다. 한국어 기준을 채우면 주중 20시간, 우대 시 25시간, 못 채우면 10시간입니다. 주말 무제한은 그 표에 없습니다. 직업계고 D-4-3은 이 표에 없습니다.',
    steps: ['D-4-1·D-4-7 시간제는 위 표를 따르세요.', 'D-4-3 요건은 미확인입니다.'],
    sourceUrl: STUDY,
    sourceLabel: 'Study in Korea 시간제취업 표의 어학연수 행',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    code: 'D-10',
    title: 'D-10 구직',
    summary:
      '같은 페이지는 구직 D-10-1을 전문 분야 구직용으로 적고, 단순노무는 안 된다고 적습니다. 6개월씩 연장, 최대 2년입니다. 예전에 적었던 최장 3년은 이 페이지에서 확인하지 못했습니다.',
    steps: ['취업이 정해지면 그 일자리에 맞는 자격으로 바꾸어야 한다고 적혀 있습니다.'],
    sourceUrl: STUDY,
    sourceLabel: 'Study in Korea 구직 비자 변경 절',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    code: 'E-7',
    title: 'E-7 특정활동',
    summary:
      '같은 페이지는 정부초청 D-2-7 졸업자가 E-7로 바꿀 때 일부 고용 비율·기업 규모 제한이 면제된다고만 적습니다. E-7 전체 요건과 E-7-Y 나이·연수 조건은 첨부 원문을 열지 못해 미확인입니다. 법무부 2025-03-20 글 제목은 대학 없이 취업·정주 길을 연다고 말합니다.',
    steps: ['세부 숫자는 하이코리아와 법무부 첨부에서 다시 확인하세요.'],
    sourceUrl: MOJ_PRESS,
    sourceLabel: '법무부 보도 글(2025-03-20). 세부 숫자는 첨부 미확인',
    verifiedOn: CHECKED,
    verification: 'unverified',
    unverifiedReason: 'E-7 본표와 E-7-Y 세부 요건 PDF를 이번 점검에서 열지 못했습니다.',
  },
  {
    code: 'E-9',
    title: 'E-9 비전문취업',
    summary: '고용허가제 취업 자격으로 알려져 있습니다. 학생 신분에서의 변경 요건은 이번 점검에서 원문을 열지 못했습니다.',
    steps: ['하이코리아 비전문취업 안내를 확인하세요. 이 앱은 절차를 단정하지 않습니다.'],
    sourceUrl: '',
    sourceLabel: '하이코리아 자격별 안내 미확인',
    verifiedOn: CHECKED,
    verification: 'unverified',
    unverifiedReason: 'E-9 자격별 안내 원문을 이번 점검에서 열지 못했습니다.',
  },
  {
    code: 'H-2',
    title: 'H-2 방문취업',
    summary: '방문취업 자격으로 알려져 있습니다. 학생 경로와의 관계는 이번 점검에서 원문을 열지 못했습니다.',
    steps: ['하이코리아 방문취업 안내를 확인하세요.'],
    sourceUrl: '',
    sourceLabel: '하이코리아 자격별 안내 미확인',
    verifiedOn: CHECKED,
    verification: 'unverified',
    unverifiedReason: 'H-2 자격별 안내 원문을 이번 점검에서 열지 못했습니다.',
  },
  {
    code: 'G-1',
    title: 'G-1 기타',
    summary:
      '법무부 안내(2025-04-17)는, 구제 대상 아동에게 자격을 줄 때 미성년 형제자매에게 G-1을 함께 주고, 실제로 양육하는 부모에게는 범칙금 납부 후 자녀의 고교 졸업 또는 성년까지 G-1을 준다고 적습니다. 그 밖의 G-1 용도는 확인하지 못했습니다.',
    steps: ['신청 기간은 2025-04-01부터 2028-03-31까지라고 같은 글이 적습니다.', '상담은 거주지 출입국·외국인관서 또는 1345입니다.'],
    sourceUrl: MOJ_RELIEF,
    sourceLabel: '법무부 국내 장기체류 아동 교육권 체류자격 부여 방안 안내',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    code: 'undocumented',
    title: '체류자격이 없는 상태',
    summary:
      '법무부 같은 안내는 국내 출생 또는 6세 미만 입국 후 6년 이상, 또는 그 이후 입국 후 7년 이상 체류하고, 신청일 기준 초·중·고 재학 또는 고교 졸업인 아동에게 2025-04-01부터 2028-03-31까지 체류자격을 신청할 수 있다고 적습니다. 재학 중이면 고교 졸업까지 D-4, 이미 졸업했다면 유학·취업 자격 또는 G-1이라고 적습니다. 학교 입학 자체의 법적 조항(시행령 제19조)은 이번 점검에서 법령 원문을 열지 못했습니다.',
    steps: [
      '재학·졸업 증명과 국내 체류 기간을 출입국관서에 가져가세요. 추가 서류는 관서마다 다를 수 있다고 글이 적습니다.',
      '초·중·고 편입학 절차는 아래 서울시교육청 귀국자 편입학 계획을 보세요.',
      '전화는 하이코리아가 아니라 외국인종합안내 1345, 생활 상담은 다누리 1577-1366입니다.',
    ],
    sourceUrl: MOJ_RELIEF,
    sourceLabel: '법무부 장기체류 아동 교육권 안내 (2025-04-17)',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
];

export const EASY_VISA_PATHS: Record<BackgroundType, readonly VisaCode[]> = {
  both_foreign: ['F-1', 'F-3', 'D-4', 'D-2'],
  multicultural: ['F-6', 'F-2'],
  mid_entry: ['F-1', 'F-3', 'D-4'],
  undocumented: ['undocumented', 'G-1'],
};

export function visaPath(code: VisaCode): VisaPath {
  const found = VISA_PATHS.find((item) => item.code === code);
  if (!found) throw new Error(code);
  return found;
}

export function optionsForVisa(code: VisaCode, level: ProcedureLevel): VisaPath[] {
  const own = visaPath(code);
  if (code === 'undocumented') {
    return [own, visaPath('G-1'), visaPath('D-4'), visaPath('D-2')];
  }
  if (level === 'high' && (code === 'F-1' || code === 'F-3' || code === 'D-4')) {
    return [own, visaPath('D-2'), visaPath('undocumented')];
  }
  return [own];
}
