import type { SupportedLangCode } from '../kbridge';

export interface SupportCenter {
  id: string;
  district: string;
  name: string;
  phone: string;
  hours: string;
  asOfDate: string;
  /** Left empty. Per-language headcounts were not on the pages opened in this pass. */
  interpreters: Partial<Record<SupportedLangCode | 'th' | 'id', number>>;
  freeCareerProgram: string;
  /** Set only when this pass opened an official page that showed the number. */
  phoneVerifiedOn?: string;
  phoneSourceUrl?: string;
  /** Why this pass did not treat the listed number as confirmed. */
  phoneUnverifiedReason?: string;
}

/**
 * 한국건강가정진흥원 다문화가족지원센터·통번역지원사 배치 현황(3081602/3077033) 및
 * 서울외국인포털 진로·진학 컨설팅(OA-21713) 구조에 맞춘 서울 6개 자치구 스냅샷
 */
export const SEOUL_SUPPORT_CENTERS: SupportCenter[] = [
  {
    id: 'center-guro',
    district: '구로구',
    name: '구로구가족센터 · 남부권 다문화교육 거점',
    phone: '02-869-0317',
    phoneVerifiedOn: '2026-11-26',
    phoneSourceUrl: 'https://www.guro.go.kr/www/contents.do?key=2375',
    hours: '평일 09:00~18:00 (수요일 20:00까지)',
    asOfDate: '2026-11-26 센터 소개 페이지. 보육 안내(key=2336, 2026-09-23 수정)는 02-830-0456을 따로 적음',
    interpreters: {},
    freeCareerProgram: '이주배경 중·고등학생 특성화고·대입 1:1 통역 컨설팅',
  },
  {
    id: 'center-ydp',
    district: '영등포구',
    name: '영등포구가족센터 · 서울다문화교육지원센터(다+온)',
    phone: '02-846-5432',
    phoneVerifiedOn: '2026-11-26',
    phoneSourceUrl: 'https://ydpfc.familynet.or.kr/center/lay1/program/S295T315C321/center_info/view.do',
    hours: '평일 09:00~18:00',
    asOfDate: '2026-11-26 센터 오시는 길',
    interpreters: {},
    freeCareerProgram: '중도입국 청소년 학력인정·고입 특례 서류 동행 지원',
  },
  {
    id: 'center-geumcheon',
    district: '금천구',
    name: '금천구가족센터',
    phone: '02-803-7747',
    hours: '평일 09:00~18:00',
    asOfDate: '2026-11-26 다누리 센터검색',
    interpreters: {},
    phoneVerifiedOn: '2026-11-26',
    phoneSourceUrl: 'https://liveinkorea.kr/centerIntro/centerNearListViewHtml.do',
    freeCareerProgram: '외국인가정 학부모 고입·장학금 설명회(중국어·베트남어)',
  },
  {
    id: 'center-yongsan',
    district: '용산구',
    name: '용산구가족센터 · 중부권 다국적 지원',
    phone: '02-797-9184',
    phoneVerifiedOn: '2026-11-26',
    phoneSourceUrl: 'https://yongsan.familynet.or.kr/center/',
    hours: '평일 09:00~18:00',
    asOfDate: '2026-11-26 센터 홈페이지',
    interpreters: {},
    freeCareerProgram: '다국적·무슬림 청소년 진로 및 체류자격 무료 상담',
  },
  {
    id: 'center-ddm',
    district: '동대문구',
    name: '동대문구가족센터',
    phone: '02-957-1073',
    hours: '평일 09:00~18:00',
    asOfDate: '2026-11-26 다누리 센터검색',
    interpreters: {},
    phoneVerifiedOn: '2026-11-26',
    phoneSourceUrl: 'https://liveinkorea.kr/centerIntro/centerNearListViewHtml.do',
    freeCareerProgram: '몽골·러시아어권 청소년 대입 외국인전형 멘토링',
  },
  {
    id: 'center-gwanak',
    district: '관악구',
    name: '관악구가족센터',
    phone: '02-883-9383',
    hours: '평일 09:00~18:00',
    asOfDate: '2026-11-26 다누리 센터검색',
    interpreters: {},
    freeCareerProgram: '이전 스냅샷의 프로그램 문구입니다. 이 앱이 적성검사를 실행하지는 않습니다.',
    phoneVerifiedOn: '2026-11-26',
    phoneSourceUrl: 'https://liveinkorea.kr/centerIntro/centerNearListViewHtml.do',
  },
  {
    id: 'center-sdm',
    district: '서대문구',
    name: '서대문구 가족센터',
    phone: '02-375-7530',
    hours: '다누리 검색 결과에 운영시간이 없습니다',
    asOfDate: '2026-11-26',
    interpreters: {},
    freeCareerProgram: '프로그램 내용은 이 검색 결과에 없습니다.',
    phoneVerifiedOn: '2026-11-26',
    phoneSourceUrl: 'https://liveinkorea.kr/centerIntro/centerNearListViewHtml.do',
  },
  {
    id: 'center-dobong',
    district: '도봉구',
    name: '도봉구 가족센터',
    phone: '02-995-6800',
    hours: '다누리 검색 결과에 운영시간이 없습니다',
    asOfDate: '2026-11-26',
    interpreters: {},
    freeCareerProgram: '프로그램 내용은 이 검색 결과에 없습니다.',
    phoneVerifiedOn: '2026-11-26',
    phoneSourceUrl: 'https://liveinkorea.kr/centerIntro/centerNearListViewHtml.do',
  },
  {
    id: 'center-sd',
    district: '성동구',
    name: '성동구 가족센터',
    phone: '02-3395-9445',
    hours: '다누리 검색 결과에 운영시간이 없습니다',
    asOfDate: '2026-11-26',
    interpreters: {},
    freeCareerProgram: '프로그램 내용은 이 검색 결과에 없습니다.',
    phoneVerifiedOn: '2026-11-26',
    phoneSourceUrl: 'https://liveinkorea.kr/centerIntro/centerNearListViewHtml.do',
  },
  {
    id: 'center-gangbuk',
    district: '강북구',
    name: '강북구 가족센터',
    phone: '02-987-2567',
    hours: '다누리 검색 결과에 운영시간이 없습니다',
    asOfDate: '2026-11-26',
    interpreters: {},
    freeCareerProgram: '프로그램 내용은 이 검색 결과에 없습니다.',
    phoneVerifiedOn: '2026-11-26',
    phoneSourceUrl: 'https://liveinkorea.kr/centerIntro/centerNearListViewHtml.do',
  },
  {
    id: 'center-jongno',
    district: '종로구',
    name: '종로구 가족센터',
    phone: '02-764-3521',
    hours: '다누리 검색 결과에 운영시간이 없습니다',
    asOfDate: '2026-11-26',
    interpreters: {},
    freeCareerProgram: '프로그램 내용은 이 검색 결과에 없습니다.',
    phoneVerifiedOn: '2026-11-26',
    phoneSourceUrl: 'https://liveinkorea.kr/centerIntro/centerNearListViewHtml.do',
  },
  {
    id: 'center-gangnam',
    district: '강남구',
    name: '강남구 가족센터',
    phone: '02-3414-3346',
    hours: '다누리 검색 결과에 운영시간이 없습니다',
    asOfDate: '2026-11-26',
    interpreters: {},
    freeCareerProgram: '프로그램 내용은 이 검색 결과에 없습니다.',
    phoneVerifiedOn: '2026-11-26',
    phoneSourceUrl: 'https://liveinkorea.kr/centerIntro/centerNearListViewHtml.do',
  },
  {
    id: 'center-gangdong',
    district: '강동구',
    name: '강동구 가족센터',
    phone: '02-471-0812',
    hours: '다누리 검색 결과에 운영시간이 없습니다',
    asOfDate: '2026-11-26',
    interpreters: {},
    freeCareerProgram: '프로그램 내용은 이 검색 결과에 없습니다.',
    phoneVerifiedOn: '2026-11-26',
    phoneSourceUrl: 'https://liveinkorea.kr/centerIntro/centerNearListViewHtml.do',
  },
  ...[
    '강서구',
    '광진구',
    '노원구',
    '동작구',
    '마포구',
    '서초구',
    '성북구',
    '송파구',
    '양천구',
    '은평구',
    '중구',
    '중랑구',
  ].map((district) => ({
    id: `center-${district}`,
    district,
    name: `${district}가족센터`,
    phone: '',
    hours: '',
    asOfDate: '2026-11-26',
    interpreters: {},
    freeCareerProgram: '대표전화와 프로그램은 이번 점검에서 구청·센터 원문으로 확인하지 못했습니다.',
    phoneUnverifiedReason: '다누리 센터찾기에서 자치구를 고르세요. 전화번호를 추정해 적지 않았습니다.',
  })),
];

export const SEOUL_DISTRICTS = SEOUL_SUPPORT_CENTERS.map((c) => c.district);
