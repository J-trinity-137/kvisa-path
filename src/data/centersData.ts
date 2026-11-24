import type { SupportedLangCode } from 'kbridge-core';

export interface SupportCenter {
  id: string;
  district: string;
  name: string;
  phone: string;
  hours: string;
  asOfDate: string;
  /** 언어별 통번역지원사 배치 인원 (0은 배치 0명, undefined는 해당 언어 자료 미제공) */
  interpreters: Partial<Record<SupportedLangCode, number>>;
  freeCareerProgram: string;
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
    phone: '02-830-0456',
    hours: '평일 09:00~18:00 (수요일 20:00까지)',
    asOfDate: '2026-06-30 기준',
    interpreters: { 'zh-Hans': 4, 'zh-Hant': 2, vi: 2, mn: 1, ru: 1, en: 1 },
    freeCareerProgram: '이주배경 중·고등학생 특성화고·대입 1:1 통역 컨설팅',
  },
  {
    id: 'center-ydp',
    district: '영등포구',
    name: '영등포구가족센터 · 서울다문화교육지원센터(다+온)',
    phone: '02-846-5432',
    hours: '평일 09:00~18:00',
    asOfDate: '2026-06-30 기준',
    interpreters: { 'zh-Hans': 5, vi: 2, ru: 1, mn: 1, th: 1, en: 1 },
    freeCareerProgram: '중도입국 청소년 학력인정·고입 특례 서류 동행 지원',
  },
  {
    id: 'center-geumcheon',
    district: '금천구',
    name: '금천구가족센터',
    phone: '02-803-7747',
    hours: '평일 09:00~18:00',
    asOfDate: '2026-06-30 기준',
    interpreters: { 'zh-Hans': 3, vi: 2, ru: 0, mn: 0, ar: 0 },
    freeCareerProgram: '외국인가정 학부모 고입·장학금 설명회(중국어·베트남어)',
  },
  {
    id: 'center-yongsan',
    district: '용산구',
    name: '용산구가족센터 · 중부권 다국적 지원',
    phone: '02-797-9184',
    hours: '평일 09:00~18:00',
    asOfDate: '2026-06-30 기준',
    interpreters: { en: 2, vi: 1, ar: 0, ru: 1, id: 1, 'zh-Hans': 1 },
    freeCareerProgram: '다국적·무슬림 청소년 진로 및 체류자격 무료 상담',
  },
  {
    id: 'center-ddm',
    district: '동대문구',
    name: '동대문구가족센터',
    phone: '02-957-1073',
    hours: '평일 09:00~18:00',
    asOfDate: '2026-06-30 기준',
    interpreters: { 'zh-Hans': 2, vi: 2, mn: 2, ru: 1 },
    freeCareerProgram: '몽골·러시아어권 청소년 대입 외국인전형 멘토링',
  },
  {
    id: 'center-gwanak',
    district: '관악구',
    name: '관악구가족센터',
    phone: '02-883-9384',
    hours: '평일 09:00~18:00',
    asOfDate: '2026-06-30 기준',
    interpreters: { 'zh-Hans': 2, vi: 2, ru: 1, en: 1, th: 0 },
    freeCareerProgram: '이주배경 고교생 커리어넷 적성검사·대학 탐방',
  },
];

export const SEOUL_DISTRICTS = SEOUL_SUPPORT_CENTERS.map((c) => c.district);
