import type { ProcedureLevel } from './visaPaths';

export interface ProcedureStep {
  id: string;
  levels: ProcedureLevel[];
  title: string;
  body: string;
  sourceUrl: string;
  sourceLabel: string;
  verifiedOn: string;
  verification: 'verified' | 'unverified';
  unverifiedReason?: string;
}

export interface OfficialForm {
  id: string;
  title: string;
  url: string;
  note: string;
  verifiedOn: string;
}

const CHECKED = '2026-11-26';
const LAW19 = 'https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=273709';
const RETURNEE = 'https://www.sen.go.kr/resources/www/data/intoschool_7_02.pdf';
const SPECIAL = 'https://www.sen.go.kr/user/bbs/BD_selectBbs.do?q_bbsDocNo=20250729131137773&q_bbsSn=1068';
const PREP = 'https://www.sen.go.kr/www/eduinfo/edumaterial/alternative/alternative_2.jsp';
const PREP_NOTICE = 'https://www.sen.go.kr/user/bbs/BD_selectBbs.do?q_bbsDocNo=20250106132933510&q_bbsSn=1100';
const RAINBOW = 'https://www.rainbowyouth.or.kr/posts/rwdboard/19171';
const GENERAL = 'https://hinfo.sen.go.kr/high/highContent.do?subMenuNo=03';

export const PROCEDURES: readonly ProcedureStep[] = [
  {
    id: 'credential',
    levels: ['elementary', 'middle', 'high'],
    title: '외국 학교 학력 인정과 학년 배정',
    body:
      '서울시교육청 2026학년도 귀국자 편입학 시행계획은 외국인 학생도 대상이라고 적습니다. 외국의 정규학교 재학만 인정하고, 유치원·어학연수·개인학습은 학력으로 보지 않습니다. 외국 1~6학년은 초등학교, 7~9학년은 중학교, 10~12학년은 고등학교 과정으로 맞춥니다. 재학이 6개월(한 학기) 미만이면 그 기간만으로 학년을 올리지 않습니다. 학력심의위원회는 같은 문서에서 북한이탈학생 학력인정으로 적혀 있어, 모든 중도입국 학생의 절차로 쓰지 않습니다.',
    sourceUrl: RETURNEE,
    sourceLabel: '2026학년도 귀국자 편입학 시행계획 (서울시교육청 PDF)',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    id: 'elementary',
    levels: ['elementary'],
    title: '초등학교 입학·편입학',
    body:
      '같은 계획은 외국 유학 후 국내 초등학교에 편입학하는 학생과 외국인 학생을 적용 대상에 넣습니다. 학년은 외국 학교 재학기간과 성적의 이수 내용을 한국 학제에 맞추어 학교장이 정합니다. 거주지 학교 배정 창구는 이 PDF가 교육청 전편입학 안내로 안내합니다. 체류자격이 없을 때의 초등학교 입학은 바로 아래 시행령 제19조 카드를 보세요.',
    sourceUrl: RETURNEE,
    sourceLabel: '2026학년도 귀국자 편입학 시행계획',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    id: 'elementary-article19',
    levels: ['elementary'],
    title: '초등학교 입학·전학 (시행령 제19조)',
    body: '초·중등교육법 시행령 제19조는 외국인 아동이 사는 학구의 초등학교장에게 입학이나 전학을 신청할 수 있다고 적습니다. 출입국 사실 확인에 보호자가 동의하지 않으면 임대차계약서나 거주 인우보증서로 거주 사실만 확인하면 됩니다. 이 조문의 신청 상대는 초등학교장입니다. 중학교·고등학교에는 이 문장을 그대로 적용하지 않습니다.',
    sourceUrl: LAW19,
    sourceLabel: '국가법령정보센터 초·중등교육법 시행령 (시행 2025-09-19) 제19조',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    id: 'middle-transfer',
    levels: ['middle'],
    title: '중학교 편입학',
    body:
      '같은 계획의 학년 맞춤을 따릅니다. 외국 7~9학년 과정이 중학교에 해당합니다. 고입 특례를 나중에 쓰려면, 외국 학교에서 국내 중학교로 전학·편입학해 졸업하는 경로가 2026학년도 특례 지침의 유형 2에 적혀 있습니다.',
    sourceUrl: RETURNEE,
    sourceLabel: '귀국자 편입학 시행계획, 특례 지침은 별도 게시글',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    id: 'high-transfer',
    levels: ['high'],
    title: '고등학교 편입학',
    body:
      '외국 10~12학년 과정이 고등학교에 해당합니다. 고등학생으로 출국했던 학생은 자퇴 처리 후 편입학을 원할 수 있다고 같은 계획이 적습니다. 학년 배정은 학교장 결정입니다.',
    sourceUrl: RETURNEE,
    sourceLabel: '2026학년도 귀국자 편입학 시행계획',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    id: 'general-high',
    levels: ['middle'],
    title: '일반고 경로 (후기 일반고)',
    body:
      '2026학년도 특례 지침은 교육감이 선발하는 후기 일반고에서 유형 2·3을 학교별 정원의 2% 이내 정원 외로 배정한다고 적습니다. 하이인포도 후기 일반고 특례 배정을 안내합니다. 이 문서는 2026학년도 지침이라 2027학년도 날짜는 확인하지 못했습니다.',
    sourceUrl: GENERAL,
    sourceLabel: '서울교육청 하이인포 고입 안내. 세부 유형은 2026 특례 지침',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    id: 'ksl-prep',
    levels: ['middle', 'high'],
    title: '서울형 한국어 예비학교 (KSL)',
    body:
      '서울시교육청 대안교육 위탁 목록은 2026학년도 서울형 한국어 예비학교를 동양미래대학교(구로, 02-2610-1921)와 숙명여자대학교(용산, 02-2077-7964)로 적습니다. 대상은 입국 초기 중도입국·외국인 학생, 중1~고2, 정원 각 30명입니다. 선정 공고는 2025~2026 위탁기관 선정 결과입니다.',
    sourceUrl: PREP,
    sourceLabel: '서울시교육청 대안교육 위탁교육기관 목록',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
  {
    id: 'rainbow',
    levels: ['elementary', 'middle', 'high'],
    title: '레인보우스쿨',
    body:
      '이주배경청소년지원재단의 2026년 레인보우스쿨 공고는 만 9~24세 국외 출생 이주배경청소년을 대상으로 하고, 한국어 수업과 공교육 편입학 지원을 운영 내용에 적습니다. 국내 출생은 정원의 10% 이내에서 한국어가 어려운 경우만 가능하다고 적습니다. 운영은 2026년 3~11월, 문의 02-6261-7202입니다. 서울만의 단독 학교가 아니라 지역 개설기관 방식입니다.',
    sourceUrl: RAINBOW,
    sourceLabel: '이주배경청소년지원재단 2026년 레인보우스쿨 개설기관 공고',
    verifiedOn: CHECKED,
    verification: 'verified',
  },
];

export const OFFICIAL_FORMS: readonly OfficialForm[] = [
  {
    id: 'special-2026',
    title: '2026학년도 고입 특례 심사원서·표지 (빈 서식)',
    url: SPECIAL,
    note: '게시글 붙임에 hwp 빈 서식이 있습니다. 관청이 만든 작성 예시본은 이 글에서 확인하지 못해 올리지 않습니다.',
    verifiedOn: CHECKED,
  },
];

export function proceduresFor(level: ProcedureLevel): ProcedureStep[] {
  return PROCEDURES.filter((item) => item.levels.includes(level));
}

export const PROCEDURE_SOURCES = { PREP_NOTICE, SPECIAL };
