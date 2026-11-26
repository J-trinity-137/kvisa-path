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
const MOJ_PDF = 'https://www.immigration.go.kr/bbs/moj/182/479025/download.do';
const MANUAL =
  'https://www.hikorea.go.kr/board/BoardNtcDetailR.pt?BBS_SEQ=1&BBS_GB_CD=BS10&NTCCTT_SEQ=1062&page=1';

export const VISA_PATHS: readonly VisaPath[] = [
  {
    code: 'F-1',
    title: 'F-1 방문동거',
    summary:
      '2026.6 체류 안내 매뉴얼은 활동 범위를 친척방문, 가족동거, 피부양, 가사정리로 적습니다. 양육권 있는 한국 국민 부모의 미성년 자녀, F-2 소지자의 배우자·미성년 자녀가 대상 예에 있습니다. 1회 체류기간 상한은 2년입니다. 초·중·고와 대학의 정규교육은 체류기간 안에서 별도 허가가 필요 없다고 2009-06-15 시행으로 적습니다. 시간제취업 표(D-2·D-4)에는 없습니다. 점수제 우수인재의 배우자·미성년 자녀(F-1-12)는 취업과 영리활동이 원칙적으로 안 된다고 적습니다.',
    steps: ['학교 다닐 때 따로 체류자격외 활동허가를 받지 않아도 된다고 매뉴얼이 적습니다.', '고교생 아르바이트를 전면 금지한다는 문장은 이 매뉴얼에서 찾지 못했습니다.'],
    sourceUrl: MANUAL,
    sourceLabel: '2026.6 외국인 체류 안내 매뉴얼 방문동거(F-1). 하이코리아 매뉴얼 게시',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    code: 'F-2',
    title: 'F-2 거주',
    summary:
      '같은 매뉴얼은 F-2를 취업이 가능한 자격으로 보고, 직업과 연간 소득을 신고하게 합니다. 초·중·고와 대학 정규교육은 F-1부터 F-6까지 별도 허가 없이 가능하다고 적습니다. 점수·소득·한국어처럼 세부 유형마다 다른 요건은 한 규칙으로 옮기지 못했습니다.',
    steps: ['F-2-R 같은 세부 유형의 숫자는 이 카드에 단정하지 않습니다.'],
    sourceUrl: MANUAL,
    sourceLabel: '2026.6 외국인 체류 안내 매뉴얼 공통사항·유학활동 면제',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    code: 'F-3',
    title: 'F-3 동반',
    summary:
      '매뉴얼은 D-1부터 E-7까지, F-2, F-4, H-2 체류자의 배우자와 배우자가 없는 미성년 자녀라고 적습니다. 기술연수 D-3 가족은 빠집니다. 초·중·고와 대학 정규교육은 별도 허가가 필요 없습니다. E-1~E-7(E-6-2 제외) 소지자의 배우자는 전문 분야 자격외 활동허가를 받을 수 있고, H-2 배우자는 농업·임업·축산의 단순노무가 적혀 있습니다. 유학생 시간제취업 표에는 없습니다.',
    steps: ['고교생이라는 이유만으로 아르바이트가 금지된다는 문장은 찾지 못했습니다.', '전문 취업은 허가와 그 자격의 서류가 필요합니다.'],
    sourceUrl: MANUAL,
    sourceLabel: '2026.6 외국인 체류 안내 매뉴얼 동반(F-3)',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    code: 'F-4',
    title: 'F-4 재외동포',
    summary:
      '매뉴얼은 F-4를 취업이 가능한 자격으로 보고 직업 신고 대상에 넣되, 연간 소득금액은 적지 않아도 된다고 적습니다. 초·중·고와 대학 정규교육은 별도 허가가 필요 없습니다. 취업이 제한되는 직업은 법무부 고시 제2026-35호에 있다고 목차가 적습니다. 고시 본문의 직업 목록은 이 카드에 옮기지 않았습니다. 2026-02-12부터 중국·CIS 동포의 신규 H-2 대신 F-4를 발급한다고 동포 장이 적습니다.',
    steps: ['제한 직업은 고시 원문을 다시 확인하세요.'],
    sourceUrl: MANUAL,
    sourceLabel: '2026.6 외국인 체류 안내 매뉴얼 공통사항·동포 장',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    code: 'F-5',
    title: 'F-5 영주',
    summary:
      '매뉴얼은 영주(F-5)를 여권 유효기간 안쪽으로 체류기간을 자르는 규칙의 예외로 적습니다. 초·중·고와 대학 정규교육은 F-1부터 F-6까지 별도 허가 없이 가능하다고 적습니다. 투자·박사처럼 유형이 여러 개라는 목록은 보였으나, 유형별 요건 전체를 확인하지는 못했습니다.',
    steps: ['유형별 요건은 하이코리아 영주 안내를 다시 보세요.'],
    sourceUrl: MANUAL,
    sourceLabel: '2026.6 외국인 체류 안내 매뉴얼 공통사항·유학활동 면제',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    code: 'F-6',
    title: 'F-6 결혼이민',
    summary:
      '매뉴얼은 한국에서 혼인이 유효하고 국민과 결혼생활을 이어 가려는 사람, 그 혼인에서 태어난 자녀를 양육하는 부모, 배우자 사망·실종 등 본인 책임이 아닌 이유로 혼인이 끝난 사람을 적습니다. 약호는 F-6-1, F-6-2, F-6-3입니다. 1회 체류기간 상한은 3년이고, 취업활동 제한을 받지 않는다고 적습니다. 초·중·고와 대학 정규교육은 별도 허가가 필요 없습니다. 자녀가 한국 국적인지는 이 매뉴얼 문장만으로 단정하지 않습니다.',
    steps: ['자녀의 국적은 가족관계 증명으로 확인하세요. 한국 국적이면 고른기회 전형을 봅니다.'],
    sourceUrl: MANUAL,
    sourceLabel: '2026.6 외국인 체류 안내 매뉴얼 결혼이민(F-6)',
    verifiedOn: CHECKED,
    verification: 'verified',
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
      '2026.6 매뉴얼은 구직 체류기간 상한을 최대 3년으로 적고, 전문성에 따라 나눕니다. 일반 D-10-1은 점수 80점 이상이면 상한 3년(1회 1년), 60점 이상 80점 미만이면 상한 1년(1회 6개월)입니다. 국내 성장 기반 외국인 청소년은 점수제 면제 특례 대상에 있습니다. 그 행의 상한 숫자는 표가 겹쳐 단정하지 않습니다. Study in Korea 페이지의 최대 2년은 이 매뉴얼과 다릅니다. 단순노무는 Study in Korea 페이지가 구직 활동에서 제외한다고 적습니다.',
    steps: [
      '국내 성장 청소년 특례: 신청일 기준 18~24세 합법체류, 국내 초·중·고를 모두 졸업했거나 동등 학력.',
      '취업이 정해지면 그 일자리에 맞는 자격으로 바꿉니다.',
    ],
    sourceUrl: MANUAL,
    sourceLabel: '2026.6 외국인 체류 안내 매뉴얼 구직(D-10) 체류기간 상한',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    code: 'E-7',
    title: 'E-7 특정활동',
    summary:
      '2026.6 매뉴얼은 E-7-Y를 국내성장인력, 직종코드 9999로 적습니다. 구직 특례 문장은 국내 성장 기반 외국인 청소년을 신청일 기준 18~24세 합법체류자로서 국내 초·중·고를 모두 졸업했거나 동등 학력을 갖춘 사람이라고 적습니다. 법무부 2025-03-20 보도자료는 여기에 더해 18세 전 7년 이상 국내 체류를 요건으로 적고, 2025-04-01부터 D-10 또는 E-7-Y를 허용한다고 적습니다. 매뉴얼의 구직 특례 문장에는 7년 요건이 보이지 않습니다. 일반 E-7은 직종별 학력·경력이 따로 있습니다.',
    steps: ['E-7-Y로 신청하기 전에 관서에 7년 요건이 아직 적용되는지 확인하세요. 두 문서의 문장이 다릅니다.'],
    sourceUrl: MOJ_PDF,
    sourceLabel: '법무부 2025-03-20 보도자료 PDF와 2026.6 체류 매뉴얼 E-7-Y·D-10 특례',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    code: 'E-9',
    title: 'E-9 비전문취업',
    summary:
      '매뉴얼은 고용허가제로 사업주에게 고용되는 조건의 취업이며, 최장 4년 10개월이라고 적습니다. 1회 체류기간 상한은 3년입니다. 원칙적으로 처음 허가받은 사업장에서 일하고, 입국 후 3년 안에는 사업장 변경이 3회를 넘지 않는다고 적습니다. 유학 활동 자체는 별도 허가 없이 가능하지만, 그 체류가 끝난 뒤 학업을 이유로 D-2로 바꾸는 것은 안 되고 출국 후 사증을 받아야 한다고 적습니다.',
    steps: ['학생이 되려면 국내에서 E-9을 D-2로 바꾸는 길이 막혀 있습니다.', '허용 업종과 나라는 고용허가제 안내를 다시 확인하세요.'],
    sourceUrl: MANUAL,
    sourceLabel: '2026.6 외국인 체류 안내 매뉴얼 비전문취업(E-9)',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    code: 'H-2',
    title: 'H-2 방문취업',
    summary:
      '2026.6 매뉴얼의 동포 장은 2026-02-12부터 방문취업(H-2) 사증의 신규 발급을 중단하고 재외동포(F-4)로 통합한다고 적습니다. 이미 H-2를 받은 사람은 외국인 등록을 하면 최대 3년이고, 고용부 확인이 있으면 1년 10개월을 더할 수 있다고 적습니다. 취업은 별첨의 허용 업종 안이며, 초·중·고와 대학 정규교육은 별도 허가가 필요 없습니다.',
    steps: ['새로 받으려면 H-2가 아니라 F-4 요건을 보세요.', '허용 업종 목록 본문은 별첨이라 이 카드에 옮기지 않았습니다.'],
    sourceUrl: MANUAL,
    sourceLabel: '2026.6 외국인 체류 안내 매뉴얼 외국국적동포 장',
    verifiedOn: CHECKED,
    verification: 'verified',
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
      '법무부 같은 안내는 국내 출생 또는 6세 미만 입국 후 6년 이상, 또는 그 이후 입국 후 7년 이상 체류하고, 신청일 기준 초·중·고 재학 또는 고교 졸업인 아동에게 2025-04-01부터 2028-03-31까지 체류자격을 신청할 수 있다고 적습니다. 재학 중이면 고교 졸업까지 D-4, 이미 졸업했다면 유학·취업 자격 또는 G-1이라고 적습니다. 초등학교 입학은 아래 절차의 시행령 제19조를 보세요.',
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
