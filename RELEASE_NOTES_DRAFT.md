# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.

## [Diff 확인]

### Header 반응형 개선
- 대상: src/components/composite/header.tsx
- 변경: 사용자 정보 영역 breakpoint 조정
- 결과: 768px 이상에서 사용자 정보 표시
- 커밋: [변경사항 보기](https://github.com/{organization}/{repository}/commit/{commit-hash})

## [신규 추가]

### EmailField 컴포넌트
- 대상: src/components/composite/email-field.tsx
- 적용: 신규 파일 추가

## [덮어쓰기]

### 문의 완료 화면
- 대상: src/components/custom/inquiry-complete
- 적용: 지정한 파일만 교체

컴포넌트 가이드 페이지는 `[페이지 제목](/component-guide/경로)` 형식으로 작성하면 새 창 링크로 표시됩니다.
릴리스 성공 후 내용은 자동으로 비워집니다.
-->

## [덮어쓰기]

### 색·크기 토큰 — Figma 컬러 변수 최신본 반영

- 대상: tokens.json
- 적용: 지정한 파일만 교체한 뒤 `yarn tokens` 로 `src/app/tokens.css` 를 다시 생성한다. 생성물은 저장소에 두지 않으므로 파일만 받으면 된다(`predev`·`prebuild` 에 포함돼 있어 dev·build 시 자동 생성)
- 변경: Figma 색 변수 전체(brand 7계열·system 4계열·common)를 대조해 달라진 두 값을 반영 — `blue.500` `#3f7deb → #3172e2`, `info.500` `#3674da → #3172e2`. 나머지 값은 모두 같았고 새로 생긴 색은 없다
- 결과: 라이트 모드에서 `--ds-primary`·`--ds-ring`·`--ds-secondary-strong`·`--ds-chart-1`·`--ds-sidebar-ring` 과 배지의 `badge-solid-info`·`border-info-500` 이 함께 이동한다. 다크·메인페이지는 `blue.300`·`info.300` 을 쓰므로 영향 없음
- 함께: 아래 ListMarker 가 쓰는 `size.list-dot-sm`(3px)도 이 파일에 함께 들어 있다 — 토큰 없이 컴포넌트만 받으면 점 크기가 지정되지 않으므로 이 파일을 먼저 반영한다

### [Badge] xs(24px) 크기 추가

- 대상: src/components/theme/badge.variants.ts
    - src/app/component-guide/(guide)/badge/page.tsx
- 적용: `size` 에 `xs` 를 더한 파일로 교체. 기존 `sm`(28px)·`lg`(40px)는 종전과 같아 지금 쓰고 있는 배지는 하나도 변하지 않는다
- 변경: `xs` 는 높이 24px · 글자 12/18(`typo-caption-medium`) · 라운드 8px · 좌우 여백 round 8px·pill 12px. Figma badge 세트의 `size=small` 이며, Figma 의 `size=large` 가 프로젝트 `sm` 에 해당한다
- 참고: 시안이 이 크기를 round 로만 그려 두어 pill 여백은 다른 크기와 같은 12px 를 따랐고, 최소 너비는 두지 않았다(`sm` 의 60px 는 유지)
- 가이드: [Badge](/component-guide/badge) 의 Props 표와 Size 섹션에 xs 행·예시 추가

### [ListMarker] unordered-small 추가

- 대상: src/components/custom/list-marker.tsx
    - src/app/component-guide/(guide)/list-marker/page.tsx
- 적용: `type` 에 `unordered-small` 을 더한 파일로 교체. 기존 `unordered`·`ordered` 는 종전과 같다
- 변경: 칸 12×20 · 점 3×3 원형 · 색 `foreground-subtle`. Figma `list_atomic_bullet` 의 `type=unordered_small` 이며, 13px 본문 옆에 놓는 작은 불릿이다(폭은 일반 점과 같은 12px 라 들여쓰기가 어긋나지 않는다)
- 순서: 위 토큰 파일(`size.list-dot-sm`)을 함께 반영해야 한다
- 가이드: [ListMarker](/component-guide/list-marker) 의 변형 목록·규격 표·Props 에 추가

### [Pagination] 이전/다음 좌우 여백 8px 교정

- 대상: src/components/theme/pagination.variants.ts
- 적용: 이전/다음 버튼의 좌우 여백을 12px 에서 8px 로 고친 파일로 교체
- 변경: Figma `pagination_item` 의 pre/next 폭이 68px(여백 8 + 아이콘 20 + 간격 4 + 글자 28 + 여백 8)인데 76px 로 그려지고 있었다. 번호 버튼(40×40)·색·라운드는 시안과 이미 같아 그대로다
- 결과: 페이지네이션을 쓰는 목록 화면에서 [이전]·[다음] 버튼이 좌우로 4px 씩 좁아진다

## [Diff 확인]

### 메인페이지 1~3섹션 컨테이너 폭을 헤더와 같게 맞춤

- 대상: src/components/custom/hero-section.tsx
    - src/components/custom/main-second-section.tsx
    - src/components/custom/tech-eval-section.tsx
- 변경: 세 섹션의 그리드를 헤더와 같은 `grid-layout` 으로 통일. 1280px 미만에서 본문도 792px 로 좁아져 헤더와 좌우 시작선이 맞는다(1280px 이상은 종전과 같은 1200px)
- 함께: [덮어쓰기] `[히어로] 제목의 태블릿 크기를 1279px 까지 적용` 과 한 벌로 반영한다
- 중복: `tech-eval-section.tsx`·`main-second-section.tsx` 는 다른 카드에도 나온다 — 같은 릴리스의 변경이 모두 담긴 파일 하나를 받으면 된다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/093086a0a516d7e45db965f5484211767213f5b4)

## [신규 추가]

### 메인 랜딩 화면 공통 컴포넌트

- 대상: src/components/custom/main-page-screen.tsx
    - src/components/custom/main-page-header-state.tsx
- 적용: 메인 랜딩 화면 한 벌을 공통 자리에 신규 추가. 기업 홈·기관 홈·컴포넌트 가이드 목업이 같은 화면을 쓰므로, 화면마다 다른 값 두 개(`logoHref` · `technologyEvaluationHref`)만 prop 으로 받는다
- 삭제: src/app/component-guide/(demo)/main-page/main-page-header-state.tsx 를 함께 삭제해야 한다. 가이드 폴더 안에 있던 같은 파일을 공통 자리로 옮긴 것이며, 내용은 바뀌지 않았다
- 주의: 이 컴포넌트가 있어야 [덮어쓰기] `컴포넌트 가이드 메인페이지 목업` 과 [신규 추가] `기업 홈·기관 홈 화면` 이 동작한다 — 셋을 한 번에 반영한다

### 기업 홈·기관 홈 화면

- 대상: src/app/(user-type)/corp/home/page.tsx
    - src/app/(user-type)/org/home/page.tsx
- 적용: 위 공통 컴포넌트에 경로 두 개만 넘기는 얇은 화면 신규 추가. 기업 홈은 `/corp/home`, 기관 홈은 `/org/home` 이며 화면정의서에 이미 등록돼 있던 경로다
- 화면: 로고를 누르면 시작 페이지(`/`)로 가고, 3섹션 [기술평가] 시작하기는 기업 홈이 `/corp/technology-evaluation/tech-index/selection`, 기관 홈이 `/org/individual-evaluation/tech-index/selection` 로 간다
- 위치: 라우트 그룹 밖(`corp/home`·`org/home`)에 둔다 — `(logged-in)`·`(logged-out)` 레이아웃 안에 두면 그 레이아웃의 Header 와 메인페이지 Header 가 겹친다

### 마크업 검증 결과 데이터

- 대상: src/app/component-guide/(guide)/validation-exceptions/screen-markup-results.ts
- 적용: 신규 파일 추가. 아래 [덮어쓰기] `마크업 검증 문서` 가 import 하므로 함께 반영한다

## [덮어쓰기]

### [히어로] 제목의 태블릿 크기를 1279px 까지 적용

- 대상: src/components/theme/hero-section.variants.ts
- 적용: 제목 크기 분기를 `max-lg:` 에서 `max-xl:` 로 넓힌 파일로 교체. 값은 종전과 같은 `clamp(32px, 24px + 2.1vw, 44px)` 이고 여백·간격 등 나머지 구간도 그대로다
- 결과: 1024~1279px 구간이 PC 크기(48px)를 쓰던 것을 태블릿 크기로 바꿔, 컨테이너 폭이 갈리는 지점(1280px)에서 함께 갈린다. 1280px 이상 48px 과 1024px 미만은 종전 그대로다
- 함께: 위 [Diff 확인] `메인페이지 1~3섹션 컨테이너 폭` 과 한 벌로 반영한다 — 폭만 좁히고 제목을 48px 로 두면 카피 칸(384px)에서 글자가 지나치게 접힌다

### 메인페이지 3섹션 서비스 CTA 경로를 사용처가 정하도록 변경

- 대상: src/components/custom/tech-eval-services.tsx
    - src/components/custom/tech-eval-section.tsx
    - src/components/custom/mobile-tech-eval-content.tsx
- 적용: `[기술평가]` 카드의 시작하기 경로를 데이터에 박아 두던 것을, 사용처가 넘긴 값으로 갈아끼우는 `buildTechEvalServices(href)` 방식으로 교체. 나머지 세 서비스(특허평가·K-BIGx·탄소중립)는 목업이 없어 종전대로 `#` 이다
- 변경: 섹션 컴포넌트 둘(PC 롤링·모바일 정적)이 `technologyEvaluationHref` 를 받는다. 두 배치가 같은 경로를 쓰므로 화면마다 한 번만 정하면 된다
- 중복: `tech-eval-section.tsx` 는 [Diff 확인] `메인페이지 1~3섹션 컨테이너 폭`·[덮어쓰기] `메인페이지 3섹션 — 화면 폭에 맞는 한 벌만 렌더` 에도, `mobile-tech-eval-content.tsx` 는 [덮어쓰기] `제목처럼 읽히던 문단 정리` 에도 나온다. 카드마다 다른 버전이 있는 것이 아니라, 변경이 모두 담긴 파일 하나를 받으면 된다
- 순서: 위 [신규 추가] 공통 컴포넌트와 함께 반영한다 — `technologyEvaluationHref` 는 필수 값이라 한쪽만 넣으면 타입이 맞지 않는다

### 컴포넌트 가이드 메인페이지 목업 — 공통 컴포넌트 사용

- 대상: src/app/component-guide/(demo)/main-page/page.tsx
- 적용: 화면을 직접 조립하던 것을 공통 `MainPageScreen` 에 경로 두 개만 넘기는 얇은 page 로 교체
- 결과: **화면에 보이는 것과 동작은 종전과 완전히 같다** — 로고 링크·시작하기 경로·Skip Link·섹션 구성 모두 그대로다. 조립 코드를 기업 홈·기관 홈과 공유하려고 옮긴 것뿐이다
- 순서: 위 [신규 추가] `메인 랜딩 화면 공통 컴포넌트` 와 함께 반영한다

### mainpage 테마를 적용할 경로 목록

- 대상: src/components/theme-provider.tsx
    - src/constants/theme-routes.ts
- 적용: 메인페이지 경로를 하나만 두고 `===` 로 비교하던 것을, 목록에 있는지 확인하는 방식으로 교체. 상수 이름이 `mainPagePath` 에서 `mainPagePaths` 로 바뀌므로 두 파일을 함께 받아야 한다
- 이유: 같은 메인 랜딩 화면이 기업 홈·기관 홈·가이드 목업 세 경로에 있는데, 경로가 하나뿐이라 기업 홈·기관 홈이 mainpage 스킨을 받지 못하고 기본 테마로 떨어졌다
- 설정: 목록에 있는 경로만 mainpage 로 고정되고 나머지는 기본 테마를 쓴다. 서비스에서 이 화면을 루트(`/`)에도 두면 `/` 를 목록에 추가한다

### 메인페이지 2섹션 — 제목 마크업·진행 레일 정리

- 대상: src/components/custom/main-second-section.tsx
- 제목: 대상 머리말(`중소벤쳐기업`·`금융·기관`)을 제목 밖 굵은 문단에서 `<h2>` 안의 줄로 옮긴다. 크기·굵기·간격은 시안 그대로이고, 제목처럼 보이는데 제목이 아닌 글이 사라져 WAVE `Possible heading` 이 걸리지 않는다[6.4.2]
- 레일: 진행 레일이 세 상태로 갈린다 — ① 화면에 들어오면 좌→우 계단식으로 채우고 ② 섹션 안에서 좌우로 교차하면 채운 순서를 거꾸로 되감고(1.85초) ③ 섹션을 아예 벗어나면 지연·길이 0 으로 그 자리에서 리셋한다
- 이유: 첫 화면 레일이 교차 진행도를 보지 않아 두 번째 화면에 갔다 돌아와도 다 채워진 채였고, 되감는 1.85초 안에 다시 들어오면 반쯤 지워진 레일에서 이어져 버벅였다. 채우는 쪽은 조리개 상태와 무관하게 제 길이를 유지해, 3섹션에서 올라와 두 번째 화면으로 들어올 때도 계단식 재생이 살아 있다
- 중복: 이 파일은 [Diff 확인] `메인페이지 1~3섹션 컨테이너 폭` 카드에도 나온다. 카드마다 다른 버전이 있는 것이 아니라, 두 변경이 모두 담긴 파일 하나를 받으면 된다

### 제목처럼 읽히던 문단 정리 — 히어로 지표·모바일 3섹션

- 대상: src/components/custom/hero-stats-roller.tsx
    - src/components/custom/mobile-tech-eval-content.tsx
- 적용: 본문보다 크거나 굵은 짧은 `<p>` 를 걷어낸 파일로 교체. 보이는 글·크기·굵기는 그대로다
- 변경: 히어로 지표 줄(`1,350,000 건의 특허분석`)과 기준 문구는 문단이 아니라 수치 한 줄의 이름표라 블록 `<span>` 으로 두고(목록 항목이라는 뜻은 감싸는 `<li>` 가 전한다), 모바일 3섹션의 서비스 이름은 아래 제목의 머리말이라 `<h2>` 안으로 옮긴다
- 이유: WAVE 는 본문보다 크거나 굵은 짧은 `<p>` 를 `Possible heading`(제목처럼 보이는데 제목이 아닌 글)으로 짚는다. 가짜 제목 레벨을 만들지 않아 헤딩 계층(h1 → h2 → h3)은 그대로다
- 중복: `mobile-tech-eval-content.tsx` 는 [덮어쓰기] `메인페이지 3섹션 서비스 CTA 경로` 카드에도 나온다. 두 변경이 모두 담긴 파일 하나를 받으면 된다

### 메인페이지 3섹션 — 화면 폭에 맞는 한 벌만 렌더

- 대상: src/components/custom/tech-eval-section.tsx
    - scripts/build-tokens.mjs
- 적용: 두 파일을 함께 교체한다 — 새 미디어쿼리 상수와 그 값을 검증하는 생성기가 한 세트다
- 변경: PC 목차와 모바일 목록을 둘 다 그린 뒤 CSS 로 한쪽만 감추던 것을, 마운트 후 화면 폭에 맞는 한 벌만 그리도록 바꾼다. 첫 그림에서는 종전처럼 두 벌을 두어(판정 전) 반대 배치가 한 프레임 보이는 일을 막고, 판정이 끝나면 맞는 쪽만 남는다
- 이유: 같은 주소·같은 이름의 `[기술평가] 시작하기` 링크가 DOM 에 두 벌 있어 WAVE 가 `Redundant link` 로 짚었다. 감춰진 쪽까지 링크로 세기 때문이다
- 검증: `TECH_EVAL_DESKTOP_QUERY` 가 `tokens.json` 의 `breakpoint.md` 와 어긋나면 `yarn tokens` 가 빌드를 세운다(`STACK_PAGER_QUERY`·`FORM_TABS_QUERY` 와 같은 방식) — 값이 갈리면 두 벌이 함께 보이거나 둘 다 사라진다
- 중복: 이 파일은 [Diff 확인] `메인페이지 1~3섹션 컨테이너 폭`·[덮어쓰기] `메인페이지 3섹션 서비스 CTA 경로` 카드에도 나온다. 세 변경이 모두 담긴 파일 하나를 받으면 된다

### 퍼블리싱 인덱스 — 화면 상태 갱신

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체. 화면 경로 정보(`screen-registry.json`)는 이번에 바뀌지 않았다 — 여섯 경로 모두 이미 등록돼 있었다
- 변경: 기업·기관 `홈` 2건과 그 아래 `평가모형 선택`·`Tech-Index 선택 화면` 4건의 퍼블리싱 상태를 대기중에서 완료로 바꾼다
- 함께: 응용2팀이 직접 갱신한 15개 화면의 `application2Status`(약관·개인정보 처리방침·로그인 안내·실명인증·KTRS-FM 하위 화면 등)가 같은 파일에 담겨 있다. 퍼블리싱이 손댄 값이 아니라 표의 응용2 열에만 반영된다
- 참고: 아래 4건은 화면정의서에서 같은 화면을 홈 트리에 한 번 더 적어 둔 행이라 자기 경로의 page 파일이 없다. 표에서 이동 버튼 없이 라벨만 나오는 것이 정상이며, 실제 화면은 기술평가 트리의 `Tech-Index > (0) 선택 화면` 에 연결돼 있다

### 마크업 검증 문서

- 대상: src/app/component-guide/(guide)/validation-exceptions/page.tsx
- 적용: 파일 교체. 위 [신규 추가] 데이터 파일과 함께 반영한다
- 변경: 서비스 화면 217개 전수 검사 결과로 문서를 다시 작성. 감리 제출용 가이드 페이지라 서비스 화면 동작에는 영향이 없다
