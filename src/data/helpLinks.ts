export interface HelpLink {
  id: string;
  name: string;
  detail: string;
  url: string;
  verifiedOn: string;
}

/** Official help desks checked on 2026-11-26. Phone numbers are taken from those pages. */
export const HELP_LINKS: readonly HelpLink[] = [
  {
    id: 'danuri-call',
    name: '다누리콜센터 1577-1366',
    detail: '다문화가족 전화 상담·3자 통역. 다누리 안내 페이지 기준 연중 운영.',
    url: 'https://www.liveinkorea.kr/web/lay1/S1T40C44/contents.do',
    verifiedOn: '2026-11-26',
  },
  {
    id: 'hikorea',
    name: '하이코리아',
    detail: '법무부 출입국·외국인 전자민원. 체류자격 안내는 여기서 최종 확인해요.',
    url: 'https://www.hikorea.go.kr/',
    verifiedOn: '2026-11-26',
  },
  {
    id: 'family-centers',
    name: '가족센터 찾기',
    detail: '다누리의 전국 가족센터·다문화가족지원센터 검색.',
    url: 'https://liveinkorea.kr/centerIntro/centerNearListViewHtml.do',
    verifiedOn: '2026-11-26',
  },
  {
    id: 'seoul-multicultural-edu',
    name: '서울다문화교육지원센터',
    detail: '서울시교육청 다+온센터. 대표전화 02-6941-1692 (센터 누리집).',
    url: 'https://multiculture.sen.go.kr/',
    verifiedOn: '2026-11-26',
  },
];
