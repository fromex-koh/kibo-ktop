# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.
frontend-handoff에 실제 전달되는 파일의 변경만 작성하세요.
프로젝트 서비스 페이지가 아닌 퍼블리싱 가이드 관련 파일은 [덮어쓰기]로 분류하세요.
지워야 하는 파일·화면은 [삭제]로 따로 적으세요.

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

### [화면] 기업혁신성장보고서 조회 — [K-BIGx 보고서 출력]을 보고서 새 창까지 연결

- 대상:
    - src/components/custom/innovation-growth-report-lookup.tsx
    - src/components/custom/innovation-growth-report-screen.tsx
    - src/components/composite/k-bigx-view-count-deduction-dialog.tsx
    - src/components/composite/new-window-link.tsx
    - src/content/service/innovation-growth-report.ts
- 변경: [K-BIGx 보고서 출력] → 보고서 생성 모달 [보고서 생성] → 조회횟수 차감안내 모달 [이용권 사용] 순서로 잇고, [이용권 사용]이 보고서 문서(진단브리핑)를 새 창으로 연다. 특허 목록에 페이지 넘김을 두고, 검색된 기업이 없으면 두 줄 안내를 보인다. NewWindowLink 에 창 폭을 화면 폭까지 줄일지 정하는 fitToScreen 옵션을 더한다.
- 결과: 조회 화면에서 보고서 문서까지 한 흐름으로 이어진다. fitToScreen 을 넘기지 않는 기존 새 창 링크는 그대로다.
- 영향 화면:
    - [기업 기업혁신성장](/corp/k-bigx-report/innovation-growth-report)
    - [기관 기업혁신성장](/org/k-bigx-report/innovation-growth-report)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/dacf83b7)

### [컴포넌트] 차트 — 보고서용 칸형 모양 · 표시 옵션 추가

- 대상:
    - src/components/custom/column-chart.tsx
    - src/components/custom/grouped-column-chart.tsx
    - src/components/custom/line-chart.tsx
    - src/components/custom/percentage-donut-chart.tsx
    - src/components/custom/comparison-radar-chart.tsx
    - src/components/custom/word-cloud.tsx
    - src/components/custom/rating-matrix.tsx
    - src/components/custom/semicircle-rating-gauge.tsx
    - src/components/custom/network-graph.tsx
    - src/components/custom/company-relationship-graph.tsx
- 변경:
    - ColumnChart · GroupedColumnChart · LineChart: 칸형 모양(cells · columns)을 더한다. 가장 큰 값은 칸 높이의 78%, 0 · 아주 작은 값도 막대 자리와 값 글자를 남기고, 값 글자가 좁으면 솎는다.
    - ColumnChart: 공통 눈금 최댓값(scaleMax)과 막대 높이 비율(maxValueRatio, 기본 0.78)을 더한다.
    - LineChart: 범례 위치(legendPlacement) · 그릴 자리 높이(plotHeight — 140 · 170 · 180 · 200)를 더하고, 선이 둘 이상이면 아래 선 값은 점 아래 · 위 선 값은 점 위에 적는다.
    - 모든 차트: 인쇄용 문서에서 끌 수 있는 animate 옵션(기본 켬).
    - PercentageDonutChart: 항목별 범례 값(valueLabel — 예: 금액) · 건수 생략 · 조각 바깥 강조 글자(calloutId) · 도넛 아래 이름(caption).
    - WordCloud: 단어별 색 · 순서 팔레트(color · colors), 글자 크기를 영역 높이에 비례하게 한다.
    - RatingMatrix · SemicircleRatingGauge: 공통 원호(ArcGauge)와 다섯 단계 색으로 정리한다.
    - NetworkGraph · CompanyRelationshipGraph: 말풍선을 공통 조각(chart-tooltip-parts)으로 바꾼다.
- 결과: 옵션을 넘기지 않는 기존 화면은 그대로다. 보고서의 막대 · 선 · 도넛 차트를 같은 컴포넌트로 그린다.
- 영향 화면:
    - [ColumnChart 가이드](/component-guide/column-chart)
    - [GroupedColumnChart 가이드](/component-guide/grouped-column-chart)
    - [LineChart 가이드](/component-guide/line-chart)
    - [PercentageDonutChart 가이드](/component-guide/percentage-donut-chart)
    - [ComparisonRadarChart 가이드](/component-guide/comparison-radar-chart)
    - [WordCloud 가이드](/component-guide/word-cloud)
    - [NetworkGraph 가이드](/component-guide/network-graph)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fcc8323d)

### [컴포넌트] 차트 스켈레톤 — 칸형 차트 모양 추가

- 대상: src/components/composite/chart-skeleton.tsx
- 변경: type 에 칸형 막대 · 선(cells-column · cells-line · columns-line), 묶음 막대(grouped-column), 겹친 막대(overlay-column), 원형 레이더(circle-radar), 점수 게이지(score-gauge), 순위 피라미드(rank-pyramid)를 더한다. 칸형 전체 높이는 실제 차트와 같은 226 이다.
- 결과: 보고서 차트가 불러오는 동안 실제 차트와 같은 짜임의 스켈레톤이 보인다.
- 영향 화면:
    - [Skeleton 가이드](/component-guide/skeleton)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/781073e2)

### [토큰] 모서리 반경 3xs(2px) 추가

- 대상: tokens.json
- 변경: radius 에 3xs(2px)를 더한다.
- 결과: 단계 칸 막대(SegmentMeter)의 칸 모서리에 쓴다(rounded-3xs).
- 영향 화면:
    - [모서리 반경 가이드](/component-guide/radius)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1aa304fb)

## [신규 추가]

### [화면] K-BIGx 기업혁신성장 보고서 — 보고서 결과(웹뷰) (기업 · 기관)

- 대상:
    - src/app/(user-type)/corp/(report)/k-bigx-report/innovation-growth-report/diagnostic-briefing/loading.tsx
    - src/app/(user-type)/corp/(report)/k-bigx-report/innovation-growth-report/diagnostic-briefing/page.tsx
    - src/app/(user-type)/org/(report)/k-bigx-report/innovation-growth-report/diagnostic-briefing/loading.tsx
    - src/app/(user-type)/org/(report)/k-bigx-report/innovation-growth-report/diagnostic-briefing/page.tsx
    - src/components/custom/innovation-growth-report-page.tsx
    - src/components/custom/innovation-growth-report-document.tsx
    - src/components/custom/innovation-growth-report-parts.tsx
    - src/components/custom/innovation-growth-report-company.tsx
    - src/components/custom/innovation-growth-report-tech.tsx
    - src/components/custom/innovation-growth-report-tech-index.tsx
    - src/components/custom/innovation-growth-report-credit.tsx
    - src/components/custom/innovation-growth-report-activity.tsx
    - src/content/service/k-bigx-innovation-report.ts
    - src/content/service/cri-grades.ts
    - public/images/emblem-government.webp
    - public/images/rank-pyramid/crown-purple.webp
    - public/images/rank-pyramid/crown.webp
- 적용: 신규 파일 추가
- 내용:
    - 헤더 · 푸터 없는 새 창 문서 한 페이지(…/diagnostic-briefing)에 탭 6개(진단브리핑 · 기업현황 · 기술혁신정보 · Tech-Index · 신용/재무정보 · 활동성정보)를 두고, 탭은 주소의 ?tab= 으로만 바뀐다. 탭마다 같은 모양의 로딩 스켈레톤이 있다.
    - 진단브리핑은 반응형이고 나머지 탭은 PC 폭(1280) 전용이다. 모바일은 진단브리핑과 [더보기](PC 화면 새 창)만 보인다.
    - Tech-Index · 4대 혁신역량의 상태(우수 · 양호 · 보통 · 미흡 · 취약) · 색 · 칸 수는 점수 구간으로 정한다.
    - 신용/재무정보는 열람 케이스(report.viewerCase)에 따라 제공하지 않는 항목을 비공개로 가린다(타기업·협약기관 법인 열람 · 개인 열람).
    - 기술혁신정보 표는 최대 10건만 노출한다(R&D 전문기관은 넘으면 '기타'로 묶음).
    - 탭 주소(?tab=)를 읽는 문서 · 스켈레톤은 Suspense 로 감싼다 — 빌드가 이 페이지를 미리 만들 때도 오류 없이 첫 탭 모양의 스켈레톤을 보인다.
    - [프론트엔드 연동] 체크리스트는 k-bigx-innovation-report.ts 머리 주석에 있다. 보고서 한 건의 데이터 파일이며, 조회 함수(getInnovationGrowthReport)만 API 로 바꾸면 화면은 고치지 않는다.
- 영향 화면:
    - [기업 보고서 결과(진단브리핑)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기업 신용/재무정보 — 법인 열람](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=credit-finance&case=partner-corp)
    - [기업 신용/재무정보 — 개인 열람](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=credit-finance&case=partner-person)
    - [기관 보고서 결과(진단브리핑)](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)

### [화면] K-BIGx 보고서 — 인쇄 출력물 선택 모달 (기업 · 기관)

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/innovation-growth-report/print-output-selection/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/print-output-selection/page.tsx
    - src/components/composite/k-bigx-print-output-selection-dialog.tsx
    - src/content/service/k-bigx-print-output-selection.ts
- 적용: 신규 파일 추가
- 내용: 출력 대상 요약(기업명 · 조회기준일)과 출력 항목 체크(전체선택 · 항목 6개) → [출력하기]. 일부만 고르면 전체선택이 '일부' 상태가 되고, 아무것도 고르지 않으면 [출력하기]가 눌리지 않는다.
- 영향 화면:
    - [기업 인쇄 출력물 선택](/corp/k-bigx-report/innovation-growth-report/print-output-selection)
    - [기관 인쇄 출력물 선택](/org/k-bigx-report/innovation-growth-report/print-output-selection)

### [컴포넌트] 보고서 차트 — 새 차트 · 게이지

- 대상:
    - src/components/custom/chart-cells.tsx
    - src/components/custom/overlay-column-chart.tsx
    - src/components/custom/butterfly-bar-chart.tsx
    - src/components/custom/diverging-rank-chart.tsx
    - src/components/custom/combo-bar-line-chart.tsx
    - src/components/custom/distribution-curve-chart.tsx
    - src/components/custom/grade-history-chart.tsx
    - src/components/custom/grade-scale-gauge.tsx
    - src/components/custom/ratio-stack-bar.tsx
    - src/components/custom/segment-meter.tsx
    - src/components/custom/score-gauge.tsx
    - src/components/custom/rank-pyramid-chart.tsx
    - src/components/custom/arc-gauge.tsx
    - src/components/custom/arc-gauge-shape.ts
    - src/components/custom/comparison-radar-style.ts
    - src/components/custom/tech-index-radar-style.ts
    - src/components/composite/chart-tooltip-parts.tsx
    - src/components/composite/butterfly-bar-chart-skeleton.tsx
    - src/components/composite/diverging-rank-chart-skeleton.tsx
    - src/components/composite/combo-bar-line-chart-skeleton.tsx
    - src/components/composite/distribution-curve-chart-skeleton.tsx
    - src/components/composite/grade-history-chart-skeleton.tsx
    - src/components/composite/grade-scale-gauge-skeleton.tsx
    - src/components/composite/segment-meter-skeleton.tsx
- 적용: 신규 파일 추가
- 내용:
    - OverlayColumnChart(겹친 막대) · ButterflyBarChart(나비 막대) · DivergingRankChart(양쪽 순위 막대) · ComboBarLineChart(막대 + 선) · DistributionCurveChart(분포 곡선) · GradeHistoryChart(등급 이력) · GradeScaleGauge(등급 척도 게이지) · RatioStackBar(비율 막대) · SegmentMeter(단계 칸 막대).
    - ScoreGauge(점수 원호 게이지) · RankPyramidChart(순위 피라미드)와 공통 원호(ArcGauge), 칸형 차트 공통 치수(chart-cells), 말풍선 조각(chart-tooltip-parts).
    - 차트마다 같은 짜임의 스켈레톤이 있고, 가이드 페이지에 특이 케이스(최대 · 최소 · 0 · 음수 · 긴 값 · 항목 수)를 정리했다.
- 영향 화면:
    - [OverlayColumnChart 가이드](/component-guide/overlay-column-chart)
    - [ButterflyBarChart 가이드](/component-guide/butterfly-bar-chart)
    - [DivergingRankChart 가이드](/component-guide/diverging-rank-chart)
    - [ComboBarLineChart 가이드](/component-guide/combo-bar-line-chart)
    - [DistributionCurveChart 가이드](/component-guide/distribution-curve-chart)
    - [GradeHistoryChart 가이드](/component-guide/grade-history-chart)
    - [GradeScaleGauge 가이드](/component-guide/grade-scale-gauge)
    - [RatioStackBar 가이드](/component-guide/ratio-stack-bar)
    - [SegmentMeter 가이드](/component-guide/segment-meter)
    - [ScoreGauge 가이드](/component-guide/score-gauge)
    - [RankPyramidChart 가이드](/component-guide/rank-pyramid-chart)

### [컴포넌트] PrivateContent · InfoTable · LicenseNotice

- 대상:
    - src/components/composite/private-content.tsx
    - src/components/composite/info-table.tsx
    - src/components/custom/license-notice.tsx
- 적용: 신규 파일 추가
- 내용:
    - PrivateContent · PrivateCell: 비공개 정보를 흐린 자리 표시 값 + 흰 가림 면으로 가리고 안내를 띄운다(카드 · 표 · 열 하나).
    - InfoTable: 이름 칸 + 값 칸을 한 줄에 두 쌍씩 늘어놓는 조회용 표.
    - LicenseNotice: 차트 라이브러리 라이선스 고지.
- 영향 화면:
    - [PrivateContent 가이드](/component-guide/private-content)
    - [InfoTable 가이드](/component-guide/info-table)

## [덮어쓰기]

### [스타일] 차트 스켈레톤 · 말풍선 스타일

- 대상:
    - src/components/theme/chart-skeleton.variants.ts
    - src/components/theme/chart-tooltip.variants.ts
- 적용: 지정한 파일만 교체
- 내용: 새 스켈레톤 모양의 높이 값과 차트 말풍선 공통 스타일을 더한다.

### [문서] 컴포넌트 가이드 — 차트 가이드 분리 · 새 컴포넌트 문서

- 대상:
    - src/app/component-guide/(guide)/butterfly-bar-chart/page.tsx
    - src/app/component-guide/(guide)/column-chart/page.tsx
    - src/app/component-guide/(guide)/combo-bar-line-chart/page.tsx
    - src/app/component-guide/(guide)/comparison-radar-chart/page.tsx
    - src/app/component-guide/(guide)/distribution-curve-chart/page.tsx
    - src/app/component-guide/(guide)/diverging-rank-chart/page.tsx
    - src/app/component-guide/(guide)/grade-history-chart/page.tsx
    - src/app/component-guide/(guide)/grade-radar-chart/page.tsx
    - src/app/component-guide/(guide)/grade-scale-gauge/page.tsx
    - src/app/component-guide/(guide)/grade-trend-chart/page.tsx
    - src/app/component-guide/(guide)/grouped-column-chart/page.tsx
    - src/app/component-guide/(guide)/info-table/page.tsx
    - src/app/component-guide/(guide)/line-chart/page.tsx
    - src/app/component-guide/(guide)/network-graph/chart-demo.tsx
    - src/app/component-guide/(guide)/network-graph/page.tsx
    - src/app/component-guide/(guide)/overlay-column-chart/page.tsx
    - src/app/component-guide/(guide)/percentage-donut-chart/page.tsx
    - src/app/component-guide/(guide)/percentage-donut-chart/percentage-donut-chart-demo.tsx
    - src/app/component-guide/(guide)/private-content/page.tsx
    - src/app/component-guide/(guide)/radius/page.tsx
    - src/app/component-guide/(guide)/rank-pyramid-chart/page.tsx
    - src/app/component-guide/(guide)/rating-matrix/page.tsx
    - src/app/component-guide/(guide)/ratio-stack-bar/page.tsx
    - src/app/component-guide/(guide)/score-gauge/page.tsx
    - src/app/component-guide/(guide)/segment-meter/page.tsx
    - src/app/component-guide/(guide)/semicircle-rating-gauge/page.tsx
    - src/app/component-guide/(guide)/semicircle-rating-gauge/semicircle-rating-gauge-demo.tsx
    - src/app/component-guide/(guide)/skeleton/page.tsx
    - src/app/component-guide/(guide)/tabs/page.tsx
    - src/app/component-guide/(guide)/word-cloud/page.tsx
    - src/app/component-guide/(guide)/word-cloud/word-cloud-demo.tsx
    - src/constants/publishing-guide.ts
- 적용: 지정한 파일만 교체
- 내용: 차트를 컴포넌트마다 가이드 페이지로 나누고(사이드바 데이터 표시 › 차트), 모든 차트 가이드에 데이터 연결 설명을 넣었다. 기존 Chart 가이드는 남은 관계망 그래프에 맞춰 [NetworkGraph 가이드](/component-guide/network-graph)로 이름과 경로를 바꿨다. PrivateContent 가이드를 추가하고, 모서리 반경 · Skeleton · Tabs 가이드를 최신화했다.

### [문서] 퍼블리싱 인덱스 — 보고서 결과(웹뷰) 묶음

- 대상:
    - src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체
- 내용: 진단브리핑부터 보고서 출력까지를 "보고서 결과 (웹뷰)" 묶음으로 옮기고, 진단브리핑에만 링크를 둔다(나머지 탭은 링크 없이 완료). 비공개 케이스(법인 열람 · 개인 열람) 묶음을 추가하고, 보고서 출력은 대기중, 보고서 이력 조회(마이페이지)는 완료로 둔다.

## [삭제]

### [화면] 이전 보고서 출력 모달 · 점수 비교 차트

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/innovation-growth-report/report-print/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/report-print/page.tsx
    - src/components/composite/k-bigx-report-print-dialog.tsx
    - src/content/service/k-bigx-report-print.ts
    - src/components/custom/score-benchmark-chart.tsx
    - src/app/component-guide/(guide)/chart/chart-demo.tsx
    - src/app/component-guide/(guide)/chart/page.tsx
- 적용: 파일 삭제
- 내용: 보고서 출력 모달은 보고서 생성 → 조회횟수 차감안내 → 보고서 새 창 흐름으로, 점수 비교 차트는 보고서 차트로 대체됐다. Chart 가이드는 NetworkGraph 가이드와 컴포넌트별 차트 가이드로 옮겼다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8eaad727)
