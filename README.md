# kvisa-path

서울·경기 이주배경 학생(외국인가정 자녀, 중도입국)과 국내출생 다문화가정 학생(한국 국적, 부모 한쪽이 외국 출생)이 고입, 대입, 진로를 살펴보는 웹앱입니다. 학생 유형은 이 기기에만 저장하고 서버로 보내지 않습니다. 국내출생 다문화 경로에서는 비자·체류 칸을 숨깁니다.

체류자격, 국적, 이름, 전화번호, 학교명은 묻지도 모으지도 않습니다. `VITE_KVISA_API_URL`이 없으면 통계와 질문을 서버로 보내지 않고, 동의는 기본으로 꺼져 있습니다. 예전 Supabase 스키마는 `docs/archive/supabase-schema.sql`에 보관만 하며 사용하지 않습니다.

## 실제로 동작하는 것

- 화면 안의 입학 경로, 비자 단계, 서류 체크, 퀴즈, D-Day는 저장소에 들어 있는 데이터입니다.
- 학교코드는 2026-11-26에 [NEIS schoolInfo](https://open.neis.go.kr/hub/schoolInfo)로 확인한 스냅샷입니다. 학과명은 서울시교육청 특성화고·마이스터고 안내(문서상 2025학년도)를 따릅니다. 브라우저에서 API 키를 받지 않습니다.
- 일정과 숭실대 장학·검정고시 규칙에는 출처 주소와 확인일이 붙어 있습니다. 원문을 확인하지 못한 대학·장학 칸은 `미확인`입니다.

## 호출하지 않는 것

- 커리어넷 Open API는 연결하지 않습니다. 직업·학과 이름은 앱 안의 고정 예시입니다.
- 서울열린데이터광장 `OA-21713`도 호출하지 않습니다. 확인한 가족센터 전화만 적고, 나머지는 다누리 센터찾기로 연결합니다. 언어별 통역 인원 숫자는 공식 표에서 확인하지 못해 빼 두었습니다.
- 분석 탭의 DiD와 TF-IDF F1은 작은 가상 표본으로 만든 예시입니다. 실제 합격이나 상담 결과가 아닙니다.

## 언어

내용이 있는 언어만 고를 수 있습니다. 한국어, English, 简体中文, 繁體中文, Tiếng Việt, Русский, Монгол хэл, العربية. 아랍어는 오른쪽에서 왼쪽으로 표시합니다.

## 수집을 켜기 전에 운영자가 할 일

통계와 질문은 기본으로 꺼져 있고, `VITE_KVISA_API_URL`이 없으면 아무 것도 보내지 않습니다. 서버를 쓰려면 저장소 밖에서 다음을 직접 넣습니다. 키는 채팅으로 보내지 않습니다.

1. Cloudflare 계정에서 Workers 하위 도메인을 정합니다.
2. D1 데이터베이스 `kvisa-path`를 만들고, `worker/wrangler.toml`의 `database_id`를 바꿉니다.
3. Turnstile 위젯의 사이트 키는 GitHub Variables `VITE_TURNSTILE_SITE_KEY`, 비밀 키는 `wrangler secret put TURNSTILE_SECRET`입니다.
4. Cloudflare Access로 `/admin*`을 본인 이메일만 허용하고, 팀 도메인과 AUD를 Worker 설정에 넣습니다.
5. GitHub Secrets에 `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`를 넣습니다. 토큰이 없으면 배포 워크플로는 배포 단계를 건너뜁니다.
6. GitHub Variables `VITE_KVISA_API_URL`에 Worker 주소를 넣습니다.
7. 처리방침의 `[TODO: 책임자 이름]`과 `[TODO: 전용 이메일]`을 채웁니다.
8. 동의 문구 7개 언어는 `원어민 검토 필요`로 표시되어 있습니다. 출시 전에 검토합니다.
9. 출시 전에 카운터만 남기는 통계가 개인정보 보호법 제58조의2에 해당하는지를 상담 창구에 확인하는 것을 권합니다.

## 실행

```bash
npm ci
npm run dev      # http://localhost:5203/kvisa-path/
npm run build
npm test
```

GitHub Pages는 지금 `gh-pages` 브랜치 루트를 소스로 씁니다. `main`에 푸시되면 `.github/workflows/pages.yml`이 `npm run build` 결과를 그 브랜치에 올립니다. 주소는 `https://j-trinity-137.github.io/kvisa-path/` 이고, 빌드 `base`는 `/kvisa-path/` 입니다. Pages 소스를 GitHub Actions로 바꾸지 않아도 됩니다.
