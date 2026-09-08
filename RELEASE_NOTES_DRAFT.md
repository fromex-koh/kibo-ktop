# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.
frontend-handoff에 실제 전달되는 파일의 변경만 작성하세요.
프로젝트 서비스 페이지가 아닌 퍼블리싱 가이드 관련 파일은 [덮어쓰기]로 분류하세요.

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

## [Diff 확인]

### 기업 평가결과 조회 — [자가진단 결과]를 새 창 리포트로 연결

- 대상: src/components/custom/evaluation-result-list.tsx
    - src/content/service/evaluation-results.ts
    - src/constants/evaluation-result.ts
- 관련 화면: [기업 평가결과 조회](/corp/mypage/evaluation-results) — 버튼이 달린 목록 화면
    - [기업 자가진단 결과 · KTRS-FM](/corp/mypage/evaluation-results/general-analysis/ktrs-fm) — 버튼이 여는 리포트
- 변경: 자리만 잡아 두었던(`href: '#'`) [자가진단 결과] 버튼이 모형별 리포트 주소를 새 창으로 엽니다. 버튼 한 건에 `newWindow: true` 를 더했고, 목록은 그 값이 있으면 `NewWindowLink`, 없으면 기존 `Link` 로 그립니다.
- 데이터: `selfDiagnosisResult(model)` 이 `/corp/mypage/evaluation-results/general-analysis/<모형>` 을 만듭니다 — 카드의 모형이 그대로 주소가 됩니다.
- 유지: 탭 필터·조회 필터·건수·페이지 이동·빈 상태와 [은행 전송]·[보증신청] 버튼은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/dbffef1)

### 기관 평가결과 조회 — [개별평가 일반 결과]·[개별평가 심층 결과] 연결

- 대상: src/components/custom/org-evaluation-history-list.tsx
    - src/content/service/org-evaluation-history.ts
- 관련 화면: [기관 평가결과 조회](/org/mypage/evaluation-history) — 버튼이 달린 목록 화면
    - [기관 일반분석 · KTRS-FM](/org/mypage/evaluation-history/general-analysis/ktrs-fm) — [개별평가 일반 결과]가 여는 리포트
    - [기관 심층분석 · KTRS-FM](/org/mypage/evaluation-history/deep-analysis/ktrs-fm) — [개별평가 심층 결과]가 여는 리포트
- 변경: 두 버튼 모두 자리만 잡아 두었던(`href: '#'`) 상태에서 모형별 리포트 주소를 새 창으로 열도록 바꿨습니다. `generalResult(model)`·`deepResult(model)` 두 함수가 주소를 만듭니다.
- 차이: 일반 결과는 자가진단 평가결과 한 벌, 심층 결과는 거기에 기술평가서·기술사업평가 세부내역이 더 붙습니다. 어느 쪽을 열었는지는 화면이 리포트에 넘깁니다.
- 유지: 일괄평가·대량정보조회 카드의 상태별 버튼과 보증추천·보증이력 모달은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e812d0f)

## [신규 추가]

### 평가결과 리포트 화면 — 새 창으로 여는 인쇄용 문서

- 대상: src/components/custom/evaluation-report.tsx
    - src/constants/evaluation-report.ts
    - src/content/service/evaluation-report.ts
    - src/app/(user-type)/corp/(report)/ · src/app/(user-type)/org/(report)/ (레이아웃 2 · 화면 12)
- 적용: 신규 파일 추가
- 문서 구성: 한 화면에 문서가 최대 세 벌입니다 — 자가진단 평가결과 · 기술평가서 · 기술사업평가 세부내역. 뒤의 두 벌은 기관 심층분석에만 있고, 기업 자가진단 결과와 기관 일반분석은 `hasTechnicalReport={false}` 로 첫 벌만 그립니다.
- 화면 12개: 기업 자가진단 결과 4(모형별) · 기관 일반분석 4 · 기관 심층분석 4. 시안이 나온 KTRS-FM 세 화면만 문서를 그리고 나머지 아홉은 주소와 인덱스 행만 잡아 둔 빈 화면입니다.
- 레이아웃: 헤더·푸터가 없는 `(report)` 라우트 그룹입니다. 새 창은 문서 한 장만 보여 주는 자리라 사이트 내비게이션이 따라 들어가지 않습니다. 라이트 고정도 이 레이아웃의 `.light` 스코프가 맡아 경로 등록이 필요 없습니다.
- 연동 지점: `src/content/service/evaluation-report.ts` 의 `getEvaluationReport(모형, 연 자리)` 안을 조회 API 로 바꾸면 화면·문서 컴포넌트는 손댈 것이 없습니다. 값의 뜻과 단위는 `constants/evaluation-report.ts` 의 타입 주석에 있습니다.
- 문서 꼬리표: 같은 문서라도 연 자리에 따라 뒷말이 갈립니다 — 기업 `[KTRS-FM · 자가진단 결과]`, 기관 `[KTRS-FM · 개별평가 · 일반분석]`·`[KTRS-FM · 개별평가 · 심층분석]`. 투자모형만 시안대로 `[개방형투자용평가모형평가 · 일반 평가]` 하나입니다.
- 인쇄: 구획은 쪽 경계에서 나뉘지 않고(`break-inside-avoid`), 제목은 내용과 떨어지지 않으며(`break-after-avoid`), 줄만 이어지는 세부내역 표만 나뉩니다. 차트는 애니메이션을 꺼서 언제 인쇄해도 같은 그림이 찍히고, 높이는 비율이 아니라 값으로 고정해 크롬·사파리가 같은 자리에서 쪽을 나눕니다.

### NewWindowLink · PrintButton

- 대상: src/components/composite/new-window-link.tsx
    - src/components/composite/print-button.tsx
- 적용: 신규 파일 추가
- NewWindowLink: 시안 폭에 맞춘 창으로 문서를 여는 링크입니다. `<a target="_blank">` 위에 얹은 것이라 창 열기가 막히거나 자바스크립트가 없어도 같은 주소로 이동하고, 가운데 클릭·⌘/Ctrl+클릭 같은 브라우저 기본 동작도 살아 있습니다. 창 이름을 고정해 여러 번 눌러도 창이 쌓이지 않고, 재사용되는 창은 열린 뒤 가운데로 옮깁니다(재사용 시 브라우저가 크기·자리 지정을 무시하기 때문).
- PrintButton: 보고 있는 문서를 그대로 인쇄합니다. 인쇄물에서는 스스로 사라집니다(`print:hidden`).
- 가이드: [NewWindowLink / PrintButton](/component-guide/new-window-link)

## [덮어쓰기]

### 전역 스타일 — 인쇄에서 면 색이 빠지지 않게 하는 print-exact

- 대상: src/app/globals.css
- 적용: 지정한 파일만 교체
- 변경: `@utility print-exact` 를 더했습니다. 브라우저는 잉크를 아끼려고 인쇄 때 배경색을 빼는데, 고른 등급 칸처럼 면 색이 뜻을 나르는 문서에서는 그 색이 빠지면 종이에서 무엇이 골라졌는지 알 수 없습니다.
- 위치: `@layer utilities` 가 아니라 `@utility` 여야 합니다 — layer 안에 두면 Tailwind 빌드가 걷어냅니다.
- 범위: 상속되는 속성이라 문서 뿌리 한 곳(리포트 화면)에만 붙입니다. 다른 화면·다른 규칙은 바뀌지 않았습니다.

### 디자인 토큰 — 리포트 문서 폭 추가

- 대상: tokens.json
- 적용: 지정한 파일만 교체
- 변경: `container.report = 595` 를 더했습니다(시안 문서 폭). 화면에서는 `w-report` 로 씁니다. 다른 토큰 값은 손대지 않았습니다.
- 순서: 교체한 뒤 `yarn tokens` 를 한 번 실행해야 생성물 `src/app/tokens.css` 에 반영됩니다.

### ProgressBar — 배경 띠 스타일을 밖에서 지정

- 대상: src/components/custom/progress-bar.tsx
- 적용: 아직 쓰지 않은 컴포넌트라 파일을 통째로 덮어씁니다.
- 변경: `trackClassName` 을 더해 막대가 지나갈 배경 띠의 굵기·색을 사용처에서 정할 수 있게 했습니다(리포트의 8px 띠).
- 유지: 기존 props(`indicatorClassName`·`showValue`·`max`)와 기본 모습은 그대로입니다.
- 가이드: [프로그래스 바 (ProgressBar)](/component-guide/progress-bar)

### 차트 컴포넌트 3종 — 리포트에 넣기 위한 옵션 확장

- 대상: src/components/custom/grouped-column-chart.tsx
    - src/components/custom/line-chart.tsx
    - src/components/custom/comparison-radar-chart.tsx
- 적용: 이번에 처음 쓰는 컴포넌트라 파일을 통째로 덮어씁니다.
- 공통: 축·범례·말풍선을 끌 수 있게 했습니다(`showAxes`·`showLegend`·`showTooltip`). 말풍선을 끄면 마우스를 올렸을 때 나타나던 강조(점·막대 색)도 함께 사라집니다 — 손이 닿지 않는 인쇄용 문서를 위한 것입니다.
- GroupedColumnChart: `animate`(움직임) · `showTrack`(막대 뒤 눈금 기둥) · `maxBarSize` · `barGap` · `barRadius`. 값이 0 인 막대도 눈금 기둥이 서도록 직접 그리는 모양을 넘깁니다(recharts 는 높이 0 인 사각형을 배경까지 통째로 걷어냅니다).
- ComparisonRadarChart: `animate` · `showDots` · `ringCount` · `outerRadius` · `centerY` · `margin` · `tickFontSize` · `tickFontWeight`, 그리고 비교 계열 없이 한 계열만 그리는 사용(`comparisonLabel` 생략).
- LineChart: `strokeDasharray`(점선) 와 축·말풍선 끄기.
- 접근성·마크업: 세 컴포넌트 모두 자료의 `id` 를 도형에 실어 보내지 않도록 고쳤습니다 — recharts 가 자료의 속성을 그린 도형에 그대로 옮겨, 한 문서에 같은 `id` 가 여러 번 생기던 문제입니다. recharts 자식 요소에 `key` 도 함께 채웠습니다.
- 기본값: 더한 옵션의 기본값이 모두 기존 동작이라, 쓰고 있던 화면의 모습은 바뀌지 않습니다.
- 가이드: [차트 (Chart)](/component-guide/chart)

### 컴포넌트 가이드 — 차트 props 표·마크업 예외·새 페이지

- 대상: src/app/component-guide/(guide)/chart/page.tsx
    - src/app/component-guide/(guide)/progress-bar/page.tsx
    - src/app/component-guide/(guide)/validation-exceptions/page.tsx
    - src/app/component-guide/(guide)/new-window-link/
    - src/constants/publishing-guide.ts
- 적용: 개발자가 작업하는 화면이 아니라 문서라 파일을 통째로 덮어씁니다.
- 차트 가이드: 위에서 더한 옵션을 props 표에 채웠습니다. ProgressBar 가이드에는 `trackClassName` 을 더했습니다.
- 마크업 예외: 차트 라이브러리가 만들어 내는 HTML 검사 오류(SVG 요소의 `x`·`y`·`width`·`height`, 극좌표 요소의 이름 등)를 "우리가 고칠 수 없는 것"으로 정리해 두었습니다 — 검사기를 돌렸을 때 무엇이 우리 문제이고 무엇이 아닌지 가릅니다.
- 새 페이지: [NewWindowLink / PrintButton](/component-guide/new-window-link) 을 더하고 사이드바 목록에 넣었습니다.

### 퍼블리싱 인덱스·화면 경로 레지스트리

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체. 세 파일은 반드시 함께 교체해야 합니다 — 콘텐츠 관문이 빌드 시점에 두 JSON 의 화면 key 를 양방향으로 교차검증합니다.
- 행 추가: 기업 자가진단 결과, 기관 일반분석·심층분석을 각각 모형 4행으로 나눴습니다(KTRS-FM · Tech-Index · 창업용 Tech-Index · 투자모형). 화면 ID 와 IA 행 번호는 묶음 안에서 같습니다.
- 이름: 화면명을 첫 구분자 앞까지만 남겨 짧게 했습니다(`KTRS-FM / 개별평가 / 심층분석` → `KTRS-FM`), `개방형투자용평가모형평가` 는 `투자모형` 으로 통일했습니다.
- 빈 자리 화면: 시안이 없어 내용이 없는 화면 9개에 `placeholder` 를 표시해 구현으로 세지 않습니다. 표에서 대기중으로 남고 화면 이동 링크도 붙지 않습니다 — 파일만 있으면 진행중으로 보이던 것을 바로잡은 것입니다.
