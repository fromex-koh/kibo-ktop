# 다음 릴리스 변경사항

## [신규 추가]

### [화면] 기술평가 보고서 화면 세트 (Tech-Index · 창업용 · 투자모형)

- 대상: src/components/custom/tech-index-report.tsx
    - src/components/custom/investment-model-report.tsx
    - src/components/custom/tech-index-deep-report.tsx
    - src/components/custom/investment-model-deep-report.tsx
    - src/app/(user-type)/corp/(report)/mypage/evaluation-results/general-analysis/ktrs-fm/page.tsx
    - src/app/(user-type)/corp/(report)/mypage/evaluation-results/general-analysis/tech-index/page.tsx
    - src/app/(user-type)/corp/(report)/mypage/evaluation-results/general-analysis/startup-tech-index/page.tsx
    - src/app/(user-type)/corp/(report)/mypage/evaluation-results/general-analysis/investment-model/page.tsx
    - src/app/(user-type)/org/(report)/mypage/evaluation-history/general-analysis/ktrs-fm/page.tsx
    - src/app/(user-type)/org/(report)/mypage/evaluation-history/general-analysis/tech-index/page.tsx
    - src/app/(user-type)/org/(report)/mypage/evaluation-history/general-analysis/startup-tech-index/page.tsx
    - src/app/(user-type)/org/(report)/mypage/evaluation-history/general-analysis/investment-model/page.tsx
    - src/app/(user-type)/org/(report)/mypage/evaluation-history/deep-analysis/ktrs-fm/page.tsx
    - src/app/(user-type)/org/(report)/mypage/evaluation-history/deep-analysis/tech-index/page.tsx
    - src/app/(user-type)/org/(report)/mypage/evaluation-history/deep-analysis/startup-tech-index/page.tsx
    - src/app/(user-type)/org/(report)/mypage/evaluation-history/deep-analysis/investment-model/page.tsx
- 적용: 신규 파일 추가
- 내용: 일반분석 한 장과 심층분석 두 장을 A4 한 쪽 단위로 그립니다. 일반분석 문서는 심층분석의 1쪽으로 그대로 재사용합니다.
- 영향 화면: [기업 Tech-Index 일반분석](/corp/mypage/evaluation-results/general-analysis/tech-index)
    - [기업 창업용 Tech-Index 일반분석](/corp/mypage/evaluation-results/general-analysis/startup-tech-index)
    - [기업 투자모형 일반분석](/corp/mypage/evaluation-results/general-analysis/investment-model)
    - [기관 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/tech-index)
    - [기관 창업용 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/startup-tech-index)
    - [기관 투자모형 심층분석](/org/mypage/evaluation-history/deep-analysis/investment-model)

### [데이터] 보고서 목업 데이터 (화면 하나에 진입 함수 하나)

- 대상: src/content/service/tech-index-report.ts
    - src/content/service/startup-tech-index-report.ts
    - src/content/service/tech-index-deep-report.ts
    - src/content/service/startup-tech-index-deep-report.ts
    - src/content/service/investment-model-report.ts
    - src/content/service/investment-model-deep-report.ts
- 적용: 신규 파일 추가
- 내용: 화면은 진입 함수 하나만 부르고 그 함수가 필요한 장을 모두 돌려줍니다. API 연결 시 함수 안의 값만 실제 응답으로 바꾸면 되고 화면 파일은 고치지 않습니다.
- 참고: 값은 항목마다 그대로 적었습니다. 반복문이나 공용 상수로 줄이면 화면에서 본 숫자를 코드에서 찾기 어렵기 때문입니다.
- 영향 화면: [기업 Tech-Index 일반분석](/corp/mypage/evaluation-results/general-analysis/tech-index)
    - [기업 창업용 Tech-Index 일반분석](/corp/mypage/evaluation-results/general-analysis/startup-tech-index)
    - [기업 투자모형 일반분석](/corp/mypage/evaluation-results/general-analysis/investment-model)
    - [기관 Tech-Index 일반분석](/org/mypage/evaluation-history/general-analysis/tech-index)
    - [기관 창업용 Tech-Index 일반분석](/org/mypage/evaluation-history/general-analysis/startup-tech-index)
    - [기관 투자모형 일반분석](/org/mypage/evaluation-history/general-analysis/investment-model)
    - [기관 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/tech-index)
    - [기관 창업용 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/startup-tech-index)
    - [기관 투자모형 심층분석](/org/mypage/evaluation-history/deep-analysis/investment-model)

### [컴포넌트] 보고서 문서 공통 뼈대

- 대상: src/components/custom/report-document.tsx
    - src/components/custom/report-emphasis.tsx
    - public/images/report/section-mark.webp
- 적용: 신규 파일 추가
- 내용: 문서 머리 · 구획 제목 · 이름값 표를 공통으로 제공합니다.
    - 인쇄 규칙도 이 파일의 ReportPageStyle 이 담당합니다 — 각 화면의 main 안에 한 번 두면 그 화면의 인쇄 쪽이 A4 세로 · 여백 0 이 됩니다. 이 문서들은 A4 한 쪽(210 × 297mm) 크기이고 여백도 문서가 직접 그리므로, 기본 여백이 붙거나 용지가 A4 가 아니면 폭이 모자라 브라우저가 문서 전체를 줄입니다.
    - 여백이 0 이면 브라우저가 그 자리에 찍던 머리글 · 바닥글(날짜 · 주소 · 쪽 번호)도 사라집니다. 쪽 번호가 필요하면 문서 안에 직접 그려야 합니다.
- 영향 화면: [기업 자가진단 평가결과](/corp/mypage/evaluation-results/general-analysis/ktrs-fm)
    - [기업 Tech-Index 일반분석](/corp/mypage/evaluation-results/general-analysis/tech-index)
    - [기업 창업용 Tech-Index 일반분석](/corp/mypage/evaluation-results/general-analysis/startup-tech-index)
    - [기업 투자모형 일반분석](/corp/mypage/evaluation-results/general-analysis/investment-model)
    - [기관 자가진단 평가결과](/org/mypage/evaluation-history/general-analysis/ktrs-fm)
    - [기관 Tech-Index 일반분석](/org/mypage/evaluation-history/general-analysis/tech-index)
    - [기관 창업용 Tech-Index 일반분석](/org/mypage/evaluation-history/general-analysis/startup-tech-index)
    - [기관 투자모형 일반분석](/org/mypage/evaluation-history/general-analysis/investment-model)
    - [기관 자가진단 심층분석](/org/mypage/evaluation-history/deep-analysis/ktrs-fm)
    - [기관 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/tech-index)
    - [기관 창업용 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/startup-tech-index)
    - [기관 투자모형 심층분석](/org/mypage/evaluation-history/deep-analysis/investment-model)

### [컴포넌트] 차트 4종

- 대상: src/components/custom/score-ring.tsx
    - src/components/custom/grade-arc-gauge.tsx
    - src/components/custom/peer-column-chart.tsx
    - src/components/custom/positioning-scatter-chart.tsx
- 적용: 신규 파일 추가
- 내용: 점수 링 · 등급 반원 게이지 · 피어 비교 막대 · 포지셔닝 산점도입니다. 넘기는 값과 사용법은 각 컴포넌트 가이드 문서에 있습니다.
- 영향 화면: [점수 링](/component-guide/score-ring)
    - [등급 반원 게이지](/component-guide/grade-arc-gauge)
    - [피어 비교 막대](/component-guide/peer-column-chart)
    - [포지셔닝 산점도](/component-guide/positioning-scatter-chart)
    - [기업 Tech-Index 일반분석](/corp/mypage/evaluation-results/general-analysis/tech-index)
    - [기업 창업용 Tech-Index 일반분석](/corp/mypage/evaluation-results/general-analysis/startup-tech-index)
    - [기업 투자모형 일반분석](/corp/mypage/evaluation-results/general-analysis/investment-model)
    - [기관 Tech-Index 일반분석](/org/mypage/evaluation-history/general-analysis/tech-index)
    - [기관 창업용 Tech-Index 일반분석](/org/mypage/evaluation-history/general-analysis/startup-tech-index)
    - [기관 투자모형 일반분석](/org/mypage/evaluation-history/general-analysis/investment-model)
    - [기관 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/tech-index)
    - [기관 창업용 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/startup-tech-index)
    - [기관 투자모형 심층분석](/org/mypage/evaluation-history/deep-analysis/investment-model)

### [스타일] 인쇄용 보고서 화면 CSS

- 대상: src/styles/report-print.css
    - src/app/(user-type)/corp/(report)/patent-evaluation/patent-grade-list/patent-grade-result/report/page.tsx
    - src/app/(user-type)/org/(report)/patent-evaluation/patent-grade-list/patent-grade-result/report/page.tsx
- 적용: 신규 파일 추가
- 내용: 특허평가 결과 보고서의 용지 규격과 인쇄 규칙입니다. 전역이 아니라 해당 화면의 page.tsx 에서 직접 import 합니다. @page 는 선택자로 좁힐 수 없는 문서 전체 규칙이라, 전역에 두면 이 보고서의 여백 0 이 다른 모든 인쇄 화면에도 걸립니다.
- 영향 화면: [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)

## [Diff 확인]

### [컴포넌트] 인쇄 중 차트 크기 고정

- 대상: src/components/composite/print-button.tsx
- 변경: 인쇄 직전에 차트 칸의 크기를 픽셀로 고정하고 인쇄가 끝나면 되돌립니다.
- 결과: 인쇄 대화상자가 열린 뒤 차트가 폭을 다시 재면서 쪽 나눔이 바뀌던 문제가 없어집니다.
- 영향 화면: [기업 자가진단 평가결과](/corp/mypage/evaluation-results/general-analysis/ktrs-fm)
    - [기업 Tech-Index 일반분석](/corp/mypage/evaluation-results/general-analysis/tech-index)
    - [기업 창업용 Tech-Index 일반분석](/corp/mypage/evaluation-results/general-analysis/startup-tech-index)
    - [기업 투자모형 일반분석](/corp/mypage/evaluation-results/general-analysis/investment-model)
    - [기관 자가진단 평가결과](/org/mypage/evaluation-history/general-analysis/ktrs-fm)
    - [기관 Tech-Index 일반분석](/org/mypage/evaluation-history/general-analysis/tech-index)
    - [기관 창업용 Tech-Index 일반분석](/org/mypage/evaluation-history/general-analysis/startup-tech-index)
    - [기관 투자모형 일반분석](/org/mypage/evaluation-history/general-analysis/investment-model)
    - [기관 자가진단 심층분석](/org/mypage/evaluation-history/deep-analysis/ktrs-fm)
    - [기관 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/tech-index)
    - [기관 창업용 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/startup-tech-index)
    - [기관 투자모형 심층분석](/org/mypage/evaluation-history/deep-analysis/investment-model)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/9e635e4d545793cb89b99be1d359520a12bb47d6)

### [컴포넌트] 특허평가 보고서 인쇄 — Safari 쪽 나눔 보정

- 대상: src/components/custom/report-print-shell.tsx
- 변경: 인쇄 직전에만 html 에 data-print-fit 을 붙여 용지를 A4 한 쪽으로 접고, 인쇄가 끝나면 뗍니다.
- 결과: Safari 미리보기에서 5장이 10쪽으로 보이던 문제가 해결됩니다. 처음부터 접으면 차트가 줄어든 폭을 재서 작게 그려지므로 인쇄 시점에만 적용합니다.
- 영향 화면: [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/df8864892bae8873e01fa778d215d9bd006751c2)

### [스타일] 전역 CSS — 인쇄 규칙 분리와 차트 면 색 보정

- 대상: src/app/globals.css
    - src/components/custom/grade-distribution-chart.tsx
- 변경: 전역에 있던 보고서 인쇄 규칙(@page · 용지 크기 · 인쇄 배율)을 덜어내 src/styles/report-print.css 로 옮기고, 그 화면에서만 import 하도록 했습니다.
    - @page 는 선택자로 좁힐 수 없는 문서 전체 규칙이라, 전역에 두면 한 보고서를 위한 여백 0 이 인쇄되는 모든 화면에 걸립니다.
    - 전역에는 차트 면 그라데이션의 인쇄 색만 남겼습니다. 화면은 브랜드색에 투명도를 준 값을 그대로 쓰고, 인쇄에서는 같은 색을 흰 표면에 미리 섞은 불투명한 색으로 바꿉니다.
- 결과: 보고서 인쇄 규칙이 다른 화면의 인쇄에 영향을 주지 않습니다. 투명도를 쓴 면이 인쇄에서 단색으로 찍히거나 비어 나오던 문제도 없어집니다.
- 참고: macOS 의 시스템 대화상자로 PDF 를 저장하면 그라데이션이 평평해집니다. 그 PDF 는 브라우저가 아니라 macOS 인쇄 시스템이 만들어 CSS 로 막을 수 없습니다.
- 영향 화면: [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ff07a8ac53bd9680dd74d6dfd18ceaa1dbfd5706)

### [컴포넌트] 분포 곡선 · 비교 레이더 차트 옵션 확장

- 대상: src/components/custom/distribution-curve-chart.tsx
    - src/components/custom/comparison-radar-chart.tsx
- 변경: 눈금 · 축 이름 · 범례 · 높이 · 로딩 상태를 넘길 수 있게 했습니다. 레이더는 중심 높이를 값으로 고정할 수 있습니다.
- 결과: 한 컴포넌트로 일반분석과 심층분석의 서로 다른 모양을 모두 그립니다. 인쇄에서 레이더가 위로 밀리던 것도 중심 고정으로 해결됩니다.
- 영향 화면: [기관 자가진단 심층분석](/org/mypage/evaluation-history/deep-analysis/ktrs-fm)
    - [기관 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/tech-index)
    - [기관 창업용 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/startup-tech-index)
    - [기관 투자모형 심층분석](/org/mypage/evaluation-history/deep-analysis/investment-model)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1c1d90b662175586616563cbc55480e5cb9349a6)

### [컴포넌트] 차트 스켈레톤 추가

- 대상: src/components/composite/chart-skeleton.tsx
- 변경: 오각 레이더 · 포지셔닝 산점도 모양을 추가하고, 모든 차트가 화면에 붙기 전까지 같은 자리에 스켈레톤을 보이도록 맞췄습니다.
- 결과: 새로고침할 때 차트 자리가 덜컹이지 않습니다.
- 영향 화면: [기업 자가진단 평가결과](/corp/mypage/evaluation-results/general-analysis/ktrs-fm)
    - [기업 Tech-Index 일반분석](/corp/mypage/evaluation-results/general-analysis/tech-index)
    - [기업 창업용 Tech-Index 일반분석](/corp/mypage/evaluation-results/general-analysis/startup-tech-index)
    - [기업 투자모형 일반분석](/corp/mypage/evaluation-results/general-analysis/investment-model)
    - [기관 자가진단 평가결과](/org/mypage/evaluation-history/general-analysis/ktrs-fm)
    - [기관 Tech-Index 일반분석](/org/mypage/evaluation-history/general-analysis/tech-index)
    - [기관 창업용 Tech-Index 일반분석](/org/mypage/evaluation-history/general-analysis/startup-tech-index)
    - [기관 투자모형 일반분석](/org/mypage/evaluation-history/general-analysis/investment-model)
    - [기관 자가진단 심층분석](/org/mypage/evaluation-history/deep-analysis/ktrs-fm)
    - [기관 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/tech-index)
    - [기관 창업용 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/startup-tech-index)
    - [기관 투자모형 심층분석](/org/mypage/evaluation-history/deep-analysis/investment-model)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8638ec72209310208a0429bbb1ce3060f00f4174)

### [화면] 자가진단 보고서 표 · 그래프 정리

- 대상: src/components/custom/evaluation-report.tsx
    - src/constants/evaluation-report.ts
    - src/content/service/evaluation-report.ts
- 변경: 표의 바깥 좌우 선을 없애고, 기술성숙도 그래프를 표 밖으로 분리했습니다. 값 쌍은 dl 로 바꾸고 색 칸 안의 읽어 줄 말은 이름 칸으로 옮겼습니다.
- 결과: 웹 접근성 검사에서 잡히던 제목 오인식 1건과 명도 대비 경고 10건이 해소됩니다.
- 영향 화면: [기업 자가진단 평가결과](/corp/mypage/evaluation-results/general-analysis/ktrs-fm)
    - [기관 자가진단 평가결과](/org/mypage/evaluation-history/general-analysis/ktrs-fm)
    - [기관 자가진단 심층분석](/org/mypage/evaluation-history/deep-analysis/ktrs-fm)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/74e67d70e0ee1facbf30577dc21e9b96921d91c7)

## [덮어쓰기]

### [문서] 컴포넌트 가이드 — 신규 4종

- 대상: src/app/component-guide/(guide)/score-ring
    - src/app/component-guide/(guide)/grade-arc-gauge
    - src/app/component-guide/(guide)/peer-column-chart
    - src/app/component-guide/(guide)/positioning-scatter-chart
- 적용: 지정한 파일만 교체
- 내용: 사용법 · 넘기는 값 · 케이스별 모양을 담았습니다.
- 영향 화면: [점수 링](/component-guide/score-ring)
    - [등급 반원 게이지](/component-guide/grade-arc-gauge)
    - [피어 비교 막대](/component-guide/peer-column-chart)
    - [포지셔닝 산점도](/component-guide/positioning-scatter-chart)

### [문서] 컴포넌트 가이드 — 최신화

- 대상: src/app/component-guide/(guide)/distribution-curve-chart
    - src/app/component-guide/(guide)/skeleton
    - src/app/component-guide/(guide)/step-navigation
- 적용: 지정한 파일만 교체
- 내용: 확장된 옵션과 새로 추가된 스켈레톤 모양을 반영했습니다.
- 영향 화면: [분포 곡선 차트](/component-guide/distribution-curve-chart)
    - [스켈레톤](/component-guide/skeleton)
    - [스텝 내비게이션](/component-guide/step-navigation)

### [문서] 퍼블리싱 인덱스 · 화면 목록

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/constants/publishing-guide.ts
- 적용: 지정한 파일만 교체
- 내용: 새로 만든 보고서 화면과 컴포넌트 가이드를 목록에 등록하고 상태를 갱신했습니다.
- 영향 화면: [시작 페이지](/)

### [토큰] 디자인 토큰

- 대상: tokens.json
- 적용: 지정한 파일만 교체
- 내용: 보고서 화면에서 쓰는 크기 토큰(게이지 · 용지 폭 등)을 추가했습니다. 값은 yarn tokens 가 CSS 로 생성합니다.
- 영향 화면: [원시 색상](/component-guide/raw-color)
    - [시맨틱 색상](/component-guide/semantic-color)
    - [효과](/component-guide/effect)

### [스타일] 차트 스켈레톤 스타일

- 대상: src/components/theme/chart-skeleton.variants.ts
- 적용: 지정한 파일만 교체
- 내용: 새로 추가한 스켈레톤 모양의 크기 · 색을 정의합니다.
- 영향 화면: [스켈레톤](/component-guide/skeleton)
