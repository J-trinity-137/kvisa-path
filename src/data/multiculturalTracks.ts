export interface MulticulturalTrack {
  id: string;
  university: string;
  hasTrack: boolean;
  url: string;
  verifiedAt?: string;
}

/** 2027 early-admission guides checked 2026-11-26. These are Korean-national tracks. */
export const MULTICULTURAL_TRACKS: readonly MulticulturalTrack[] = [
  {
    id: 'khu',
    university: '경희대',
    hasTrack: true,
    url: 'https://iphak.khu.ac.kr/file/download.do?ofn=2027%ED%95%99%EB%85%84%EB%8F%84+%EA%B2%BD%ED%9D%AC%EB%8C%80%ED%95%99%EA%B5%90+%EC%88%98%EC%8B%9C+%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95-%EC%B5%9C%EC%A2%85_20260826.pdf&sfn=20260826010106889_2027%ED%95%99%EB%85%84%EB%8F%84+%EA%B2%BD%ED%9D%AC%EB%8C%80%ED%95%99%EA%B5%90+%EC%88%98%EC%8B%9C+%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95-%EC%B5%9C%EC%A2%85_20260826.pdf',
  },
  {
    id: 'hanyang',
    university: '한양대',
    hasTrack: true,
    url: 'https://go.hanyang.ac.kr/resources/upload_data/mojib/20260908092452487_.pdf',
  },
  {
    id: 'cau',
    university: '중앙대',
    hasTrack: true,
    url: 'https://admission.cau.ac.kr/file/pdfDown.pdf?ofn=%EC%A4%91%EC%95%99%EB%8C%80%ED%95%99%EA%B5%90_2027%ED%95%99%EB%85%84%EB%8F%84+%EC%88%98%EC%8B%9C%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95_%EC%97%85%EB%A1%9C%EB%93%9C%EC%9A%A9%28%EC%B5%9C%EC%A2%85%29.pdf&sfn=20260805051607003_0c37226bf7e64ad79adafec6f6fdc72c.pdf',
  },
  {
    id: 'uos',
    university: '서울시립대',
    hasTrack: true,
    url: 'https://file.uos.ac.kr/upload/admission/2027%ED%95%99%EB%85%84%EB%8F%84%20%EC%88%98%EC%8B%9C%EB%AA%A8%EC%A7%91%20%EC%8B%A0%EC%9E%85%EC%83%9D%20%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95.pdf',
  },
  {
    id: 'korea',
    university: '고려대',
    hasTrack: true,
    url: 'https://oku.korea.ac.kr/attach/202610/1792973469910_0.pdf',
  },
  {
    id: 'sogang',
    university: '서강대',
    hasTrack: true,
    url: 'https://admission.sogang.ac.kr/enter/html/rolling/noticeView.asp?idx=29002',
  },
  {
    id: 'ewha',
    university: '이화여대',
    hasTrack: true,
    url: 'https://admission.ewha.ac.kr/upload/GUIDES/20260907134642BHLTER.pdf',
  },
  {
    id: 'hongik',
    university: '홍익대',
    hasTrack: true,
    url: 'https://www.hongik.ac.kr/kr/admission/recruitment.do?articleNo=152315&mode=view&title=2027%ED%95%99%EB%85%84%EB%8F%84+%EC%88%98%EC%8B%9C%EB%AA%A8%EC%A7%91+%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95',
  },
  {
    id: 'sejong',
    university: '세종대',
    hasTrack: true,
    url: 'https://ipsi.sejong.ac.kr/ipsi/assistant/notice.do?article.offset=0&articleLimit=10&articleNo=2644&mode=view',
  },
  {
    id: 'mju',
    university: '명지대',
    hasTrack: true,
    url: 'https://iphak.mju.ac.kr/pages/?b=B_1_1&bn=30136&cate=%EC%88%98%EC%8B%9C&m=read&p=9',
  },
  {
    id: 'kookmin',
    university: '국민대',
    hasTrack: false,
    url: 'https://admission.kookmin.ac.kr/common/file_download.php?id=notice&no=2179',
  },
  {
    id: 'seoultech',
    university: '서울과기대',
    hasTrack: false,
    url: 'https://cdn013.negagea.net/dgsmidc/omr/seoul/web/univ_info2026/%EC%84%9C%EC%9A%B8%EA%B3%BC%ED%95%99%EA%B8%B0%EC%88%A0%EB%8C%80%ED%95%99%EA%B5%90/%EC%84%9C%EC%9A%B8%EA%B3%BC%ED%95%99%EA%B8%B0%EC%88%A0%EB%8C%80%ED%95%99%EA%B5%90_2027%ED%95%99%EB%85%84%EB%8F%84_%EC%88%98%EC%8B%9C%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95.pdf',
  },
  {
    id: 'hufs',
    university: '한국외대',
    hasTrack: false,
    url: 'https://cdn013.negagea.net/dgsmidc/omr/seoul/web/univ_info2026/%ED%95%9C%EA%B5%AD%EC%99%B8%EA%B5%AD%EC%96%B4%EB%8C%80%ED%95%99%EA%B5%90/%ED%95%9C%EA%B5%AD%EC%99%B8%EA%B5%AD%EC%96%B4%EB%8C%80%ED%95%99%EA%B5%90_2027%ED%95%99%EB%85%84%EB%8F%84_%EC%88%98%EC%8B%9C%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95.pdf',
  },
  {
    id: 'skku',
    university: '성균관대',
    hasTrack: false,
    url: 'https://admission.skku.edu/common/download.php?fpath=board/202608131045486Q3WAB.pdf&fname=2027%ED%95%99%EB%85%84%EB%8F%84+%EC%88%98%EC%8B%9C+%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95.pdf',
  },
  {
    id: 'smwu',
    university: '숙명여대',
    hasTrack: false,
    url: 'https://cdn013.negagea.net/dgsmidc/omr/seoul/web/univ_info2026/%EC%88%99%EB%AA%85%EC%97%AC%EC%9E%90%EB%8C%80%ED%95%99%EA%B5%90/%EC%88%99%EB%AA%85%EC%97%AC%EC%9E%90%EB%8C%80%ED%95%99%EA%B5%90_2027%ED%95%99%EB%85%84%EB%8F%84_%EC%88%98%EC%8B%9C%EB%AA%A8%EC%A7%91%EC%9A%94%EA%B0%95.pdf',
  },
  {
    id: 'konkuk',
    university: '건국대(서울)',
    hasTrack: false,
    url: 'https://admission.konkuk.ac.kr/sites/admission/atchmnfl/enterGthr/temp_1782714403651100.tmp',
  },
  {
    id: 'dongguk',
    university: '동국대',
    hasTrack: false,
    url: 'https://ipsi.dongguk.edu/upload/file/202605291309499DW33F.PDF',
  },
];

for (const track of MULTICULTURAL_TRACKS) {
  track.verifiedAt = '2026-11';
}
