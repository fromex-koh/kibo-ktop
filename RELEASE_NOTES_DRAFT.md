# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.
frontend-handoff에 실제 전달되는 파일의 변경만 작성하세요.
프로젝트 서비스 페이지가 아닌 퍼블리싱 가이드 관련 파일은 [덮어쓰기]로 분류하세요.
지워야 하는 파일·화면은 [삭제]로 따로 적으세요.
같은 작업의 카드는 # 작업: 작업 이름 아래에 모으고, 그 아래에서 ## 구분자부터 다시 씁니다.

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

- 카드는 위에서부터 작업할 순서대로 나열했습니다. '한 번에 적용'이 적힌 카드는 함께 넣어야 빌드됩니다.

# 작업: PDF 파일 저장에 필요한 라이브러리 2종 설치(html-to-image · jspdf)

## [Diff 확인]

### [설정] package.json · yarn.lock — PDF 저장용 라이브러리 2종 추가

- 대상: package.json
    - yarn.lock
- 변경:
    - package.json dependencies: html-to-image ^1.11.13 · jspdf ^4.2.1 추가
    - yarn.lock: 두 라이브러리와 하위 패키지 반영
- 결과: K-BIGx 보고서 미리보기의 [PDF 다운로드]가 동작함
    - html-to-image: 화면에 그려진 보고서 한 쪽(차트 · 표 포함)을 그림(JPEG)으로 뜸
    - jspdf: 뜬 그림을 A4 한 쪽에 한 장씩 넣어 PDF 파일 하나로 만들어 저장
- 영향 화면: [오픈소스 라이선스](/component-guide/licenses)
- 적용: package.json 의 dependencies 두 줄 반영 · yarn.lock 교체 후 yarn install
- 함께 작업: lib/download-report-pdf.ts(PDF 내려받기) 카드와 한 번에 적용(이 패키지를 import 함)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a1b3c27eab6b81b13313fde2e2ad0075b1a6a12c)

## [덮어쓰기]

### [문서] 오픈소스 라이선스 고지에 새 라이브러리 2종 추가

- 대상: THIRD_PARTY_LICENSES.md
- 적용: 지정한 파일만 교체
- 내용: 라이선스 고지: html-to-image@1.11.13 · jspdf@4.2.1(둘 다 MIT) 전문 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e713781f2e26899738e52448c31a0ddc1ab328bf)

# 작업: 공용 차트 · 게이지 — 받지 못한 값을 0 대신 '-' 로 표시

## [Diff 확인]

### [컴포넌트] 막대 · 선 차트 9종 — 값이 없는 칸을 '-' 로 표시(선택 옵션)

- 대상: src/components/custom/column-chart.tsx
    - src/components/custom/chart-cells.tsx
    - src/components/custom/grouped-column-chart.tsx
    - src/components/custom/nested-column-chart.tsx
    - src/components/custom/overlay-column-chart.tsx
    - src/components/custom/line-chart.tsx
    - src/components/custom/value-line-chart.tsx
    - src/components/custom/butterfly-bar-chart.tsx
    - src/components/custom/dual-bar-table.tsx
- 변경:
    - ColumnChart · GroupedColumnChart · NestedColumnChart: missingValueText 선택 prop 추가 — 주면 값 없는 막대 자리에 그 글자(말풍선 · 숨김 표 포함), 안 주면 기존 그대로
    - ColumnChart: compactValueLabels(기본 true) 추가 — false 면 긴 값을 '123.5만'으로 줄이지 않음(chart-cells isCompact 옵션)
    - OverlayColumnChart: 값 없는 막대는 바닥선 위 '-', 한 항목이 모두 없으면 가운데 '-' 하나
    - NestedColumnChart: 모두 없으면 기준 막대 자리에 하나만
    - LineChart(cells · 값 글자 있을 때) · ValueLineChart: 선을 끊고 바닥선 위 '-'
    - ButterflyBarChart · DualBarTable: NaN 이면 막대 없이 '-'(0 은 '0'), 최댓값 계산에서 제외
- 결과: 데이터가 빠진 해 · 항목이 0 으로 오해되지 않고 '-' 로 보임(숨김 표도 '-')
- 영향 화면: [막대 차트](/component-guide/column-chart)
    - [묶음 막대 차트](/component-guide/grouped-column-chart)
    - [포갠 막대 차트](/component-guide/nested-column-chart)
    - [겹친 막대 차트](/component-guide/overlay-column-chart)
    - [선 차트](/component-guide/line-chart)
    - [값 선 차트](/component-guide/value-line-chart)
    - [나비 막대 차트](/component-guide/butterfly-bar-chart)
    - [양쪽 막대 표](/component-guide/dual-bar-table)
    - [K-BIGx 웹 보고서](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 함께 작업: 새 props 는 선택이라 단독 빌드됨 — missingValueText · compactValueLabels 를 넘기는 쪽은 K-BIGx 보고서 카드(innovation-growth-report-* · kbigx-print-*)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/58617cd2df586e6a3a09c3c9a50fbed5ed572b0b)

### [컴포넌트] 점수 게이지 · 등급 표 · 비율 막대 — 값이 없으면 '-' 로 표시

- 대상: src/components/custom/score-gauge.tsx
    - src/components/custom/rating-matrix.tsx
    - src/components/custom/ratio-stack-bar.tsx
    - src/components/custom/word-cloud.tsx
- 변경:
    - ScoreGauge: score 가 NaN 이면 트랙만 · 가운데 '-'(단위 · 상태 이름 숨김) — '0점 취약'으로 보이지 않게
    - RatingMatrix: RatingMatrixRow.rating 타입 RatingLevel → RatingLevel | null — null 이면 그 줄 단계 칸마다 '-'
    - RatioStackBar: 합이 0 이거나 숫자가 아닌 값은 범례 비율 '-'(기존 0.0%)
    - WordCloud: 주석만 — 빈 목록은 넘기지 말고 사용처에서 EmptyState 로 분기
- 결과: 점수 · 등급 · 비율이 없을 때 실제 0 과 구분됨
- 영향 화면: [점수 게이지](/component-guide/score-gauge)
    - [등급 표](/component-guide/rating-matrix)
    - [비율 막대](/component-guide/ratio-stack-bar)
    - [워드 클라우드](/component-guide/word-cloud)
    - [K-BIGx 웹 보고서](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d05351075c599464f19b7fe696f68b2b9e5694f5)

## [덮어쓰기]

### [문서] 차트 가이드 13종 — '-' 표시 · 빈 상태 예시 추가

- 대상: src/app/component-guide/(guide)/column-chart/page.tsx
    - src/app/component-guide/(guide)/grouped-column-chart/page.tsx
    - src/app/component-guide/(guide)/nested-column-chart/page.tsx
    - src/app/component-guide/(guide)/overlay-column-chart/page.tsx
    - src/app/component-guide/(guide)/line-chart/page.tsx
    - src/app/component-guide/(guide)/value-line-chart/page.tsx
    - src/app/component-guide/(guide)/butterfly-bar-chart/page.tsx
    - src/app/component-guide/(guide)/dual-bar-table/page.tsx
    - src/app/component-guide/(guide)/score-gauge/page.tsx
    - src/app/component-guide/(guide)/rating-matrix/page.tsx
    - src/app/component-guide/(guide)/ratio-stack-bar/page.tsx
    - src/app/component-guide/(guide)/word-cloud/page.tsx
    - src/app/component-guide/(guide)/empty-state/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - 막대 · 묶음 · 포갠 · 겹친 막대: missingValueText 예시 · props 설명(막대 차트는 compactValueLabels 포함)
    - 선 · 값 선 · 나비 막대 · 양쪽 막대 표: 값 없음 '-' 설명(양쪽 막대 표는 chart-series-1/2 색 예시 추가)
    - 점수 게이지 · 등급 표 · 비율 막대: NaN · null 예시
    - 워드 클라우드 · 빈 상태: 데이터가 없을 때 같은 높이의 EmptyState 로 두는 방법
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1e00f5e958f1a6205dbe9517015a620f6f08e954)

# 작업: 긴 이름이 잘리면 마우스 · 탭 · 터치로 전체 이름 보기(새 컴포넌트 TruncatedText)

## [신규 추가]

### [컴포넌트] 새 컴포넌트 TruncatedText — 넘친 글을 '…' 로 자르고 툴팁으로 전체 보기

- 대상: src/components/composite/truncated-text.tsx
- 적용: 신규 파일 추가
- 내용:
    - TruncatedText: lines(1~3) 줄을 넘으면 '…', 실제로 잘렸을 때만 툴팁으로 전체 글 · suffix(예: ')') 를 끝에 남기는 옵션
    - 여는 방법: 마우스 올리기 · Tab 초점(isFocusable, 기본 true) · 터치 탭(다시 탭 · 바깥 탭으로 닫힘)
    - TruncationTooltip: 글을 직접 자르는 곳(SVG 축 이름 등)용 — isTruncated 만 받아 같은 여닫기
    - 폭 변화 · 웹폰트 로드 후 다시 잼(ResizeObserver · fonts loadingdone)
- 함께 작업: 아래 globals.css 카드와 한 번에 적용(툴팁 위치 상자의 마우스 차단 규칙)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/11d165c839f18e16c0648657f3d43ff56c35d4cb)

## [Diff 확인]

### [스타일] globals.css — 툴팁이 덮은 아래 칸도 마우스로 누를 수 있게

- 대상: src/app/globals.css
- 변경:
    - 규칙 추가: `[data-radix-popper-content-wrapper]:has(> [data-truncation-tooltip])` 에 pointer-events: none
- 결과: 툴팁이 덮은 이웃 줄(범례 · 표 위 칸)에도 마우스가 닿음
- 영향 화면: [말줄임 툴팁](/component-guide/truncated-text)
- 함께 작업: 위 TruncatedText 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/02b156b300ba8b5c0d024491f4152dc5306fd2c1)

### [컴포넌트] 차트 4종 · 스켈레톤 — 잘린 항목 이름에 툴팁 적용 · 도넛 차트 빈 상태 추가

- 대상: src/components/custom/percentage-donut-chart.tsx
    - src/components/composite/chart-skeleton.tsx
    - src/components/custom/diverging-rank-chart.tsx
    - src/components/custom/rank-pyramid-chart.tsx
    - src/components/custom/combo-bar-line-chart.tsx
- 변경:
    - PercentageDonutChart: 범례 분류명 한 줄 말줄임 + 툴팁 · 도넛 · 범례 간격 60 → 30(스켈레톤도 같이) · 조각이 없으면 같은 높이 EmptyState(emptyText prop 추가)
    - DivergingRankChart: 막대 안 · 밖 이름 말줄임 + 툴팁(Tab 초점 없음) · 밖 자리가 있을 때만 이름을 밖으로 · 막대는 줄지 않음(shrink-0)
    - DivergingRankChart: highlightValueClassName 추가 — 별 표시 행 값 글자 모양 지정
    - RankPyramidChart: 업종명 한 줄 말줄임 + 툴팁 · percentile NaN 이면 '-' · 강조 단 없음 · groupLabel 비면 줄 생략
    - ComboBarLineChart: 잘린 항목 이름을 title 대신 TruncationTooltip 으로 · 막대 값 NaN · 선 값 null · 빈 이름은 '-'
- 결과: 잘린 이름을 마우스 · 탭으로 확인, 데이터가 없을 때도 카드 높이가 유지됨
- 영향 화면: [비중 도넛 차트](/component-guide/percentage-donut-chart)
    - [양방향 순위 차트](/component-guide/diverging-rank-chart)
    - [순위 피라미드](/component-guide/rank-pyramid-chart)
    - [막대 + 선 차트](/component-guide/combo-bar-line-chart)
    - [스켈레톤](/component-guide/skeleton)
    - [K-BIGx 웹 보고서](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 함께 작업: 위 두 카드(TruncatedText · globals.css)와 한 번에 적용 — 이 파일들이 truncated-text 를 import
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/58d263bc8911f324ad5c695bb3ad7390a28d233a)

## [덮어쓰기]

### [문서] TruncatedText 새 가이드 · 적용 차트 가이드 5종 갱신

- 대상: src/app/component-guide/(guide)/truncated-text/page.tsx
    - src/app/component-guide/(guide)/percentage-donut-chart/page.tsx
    - src/app/component-guide/(guide)/diverging-rank-chart/page.tsx
    - src/app/component-guide/(guide)/rank-pyramid-chart/page.tsx
    - src/app/component-guide/(guide)/combo-bar-line-chart/page.tsx
    - src/app/component-guide/(guide)/skeleton/page.tsx
- 적용: 지정한 파일만 교체(truncated-text 는 새 파일)
- 내용:
    - 말줄임 툴팁: 새 가이드 — 입력별 여닫기 · 쓰는 곳 · props
    - 비중 도넛: 범례 말줄임 · emptyText 빈 상태 예시
    - 양방향 순위 · 순위 피라미드 · 막대 + 선: 이름 말줄임 툴팁 · 값 없음 '-' · highlightValueClassName 설명
    - 스켈레톤: 도넛 스켈레톤 간격 30
- 함께 작업: 사이드바 메뉴 등록은 src/constants/publishing-guide.ts(별도 카드)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2572c012e26f6b613297798b48766d4cb9801e1f)

# 작업: 신용등급 게이지를 등급마다 다른 색으로 · 평균 막대를 사선 무늬로(토큰 · 공용 차트)

## [Diff 확인]

### [토큰] tokens.json — 등급 게이지 색 · PDF 차트 색 추가(적용 후 yarn tokens)

- 대상: tokens.json
- 변경:
    - 기업신용등급 게이지: 8단계 색(`credit-gauge-*`) · 바탕(`credit-gauge-track`)
    - 현금흐름등급 게이지: 6단계 색(`cash-flow-gauge-cf-1~6`)
    - PDF 차트 색(`chart-*`) · 신용등급 알약 9단계 색(`credit-tag-*`)
    - 위 색에 쓰이는 단일 색(extra) 19개
- 결과: 게이지가 등급 단계마다 다른 색 · PDF 차트가 역할 토큰으로 칠해짐
- 영향 화면: [시맨틱 색상](/component-guide/semantic-color)
    - [K-BIGx 웹 보고서](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [K-BIGx PDF 템플릿](/corp/k-bigx-report/innovation-growth-report/report-print)
- 함께 작업: 이 카드 먼저 · 적용 후 `yarn tokens` 실행(아래 카드들이 새 변수를 씀)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fa8306ae0ce12b60b5b74fb242ed4c787aea5b15)

### [컴포넌트] 등급 게이지 — 원호를 등급 단계 색으로 칠하는 옵션 추가

- 대상: src/components/custom/arc-gauge-shape.ts
    - src/components/custom/semicircle-rating-gauge.tsx
    - src/components/custom/grade-scale-gauge.tsx
    - src/components/custom/gauge-tone-table.tsx
    - src/components/custom/grade-history-chart.tsx
    - src/components/custom/tech-index-radar-style.ts
- 변경:
    - SemicircleRatingGauge: gradient · trackColor props 추가
    - GradeScaleGauge: 항목별 arcColor · arcGradientTo 추가
    - GaugeToneTable: tokenPrefix 추가(기본 'gauge')
    - arc-gauge-shape: creditGaugeGradient · CREDIT_GAUGE_TRACK 추가
    - 나머지 2개 파일은 주석만 변경
- 결과: 기업신용등급 · 현금흐름등급 게이지가 단계별 색으로 표시
- 영향 화면: [등급 원호 게이지](/component-guide/semicircle-rating-gauge)
    - [등급 눈금 게이지](/component-guide/grade-scale-gauge)
    - [K-BIGx 웹 보고서](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 함께 작업: 토큰 카드 다음 · 새 props 는 선택이라 단독 적용 가능
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0248e1809ea48c5c5649061f0175180478929701)

### [컴포넌트] 막대 차트 3종 — 평균 막대 사선 무늬 옵션 추가

- 대상: src/components/custom/combo-value-chart.tsx
    - src/components/custom/rank-bar-list.tsx
    - src/components/custom/value-column-chart.tsx
- 변경:
    - ComboValueChart: averageLine(평균 막대 사선) · lineHalo(선 테두리) 색 추가 · 빈 선 값은 '-'
    - RankBarList: averageLine 추가(평균 줄 사선)
    - ValueColumnChart: highlightLabel 추가(강조 글자 색 따로)
- 결과: 흑백 인쇄에서도 평균 막대가 사선으로 구분됨
- 영향 화면: [막대 + 선 값 차트](/component-guide/combo-value-chart)
    - [순위 막대 목록](/component-guide/rank-bar-list)
    - [값 막대 차트](/component-guide/value-column-chart)
    - [K-BIGx PDF 템플릿](/corp/k-bigx-report/innovation-growth-report/report-print)
- 함께 작업: 새 옵션은 선택이라 단독 적용 가능
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/939aba449bc1fa6abd77dc11d42fd627dc16e3e9)

# 작업: K-BIGx 보고서 데이터 — 웹 · PDF 가 같은 표 줄 · 같은 빈 값 규칙을 쓰도록 정리

## [Diff 확인]

### [데이터] 기업신용등급 구간을 5단계 → 9단계로(getCriGradeTone → getCriGradeBand)

- 대상: src/content/service/cri-grades.ts
- 변경:
    - 함수 교체: getCriGradeTone(우수 · 양호 · 보통 · 미흡 · 취약) → getCriGradeBand(우량 · 양호 · 보통 · 보통이하 · 낮음 · 매우낮음 · 위험 · 유보 · 평가제외)
    - 타입 교체: CriGradeTone → CriGradeBand
    - 유보(R) · 평가제외(NR)도 단계를 돌려줌(예전에는 undefined) — 표에 없는 코드만 undefined
- 결과: 웹 보고서 게이지 · PDF 진단브리핑 · 신용/재무정보 등급 알약이 같은 9단계 색을 씀
- 영향 화면: [K-BIGx 보고서 결과 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [K-BIGx 보고서 결과 (기관)](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [K-BIGx 보고서 PDF (기업)](/corp/k-bigx-report/innovation-growth-report/report-print)
- 함께 작업: PDF 진단브리핑 · 신용/재무정보 카드(kbigx-print-briefing.tsx · kbigx-print-credit.tsx)와 한 번에 적용 — getCriGradeTone 을 지워서 따로 넣으면 빌드 안 됨
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/654bbcde2e11b79d56d691e264902e44434ea98f)

## [신규 추가]

### [데이터] 이력 카드마다 다른 보고서가 열리는 목업 — 퍼블리싱 확인용 · 연동 후 삭제

- 대상: src/content/service/k-bigx-report-history-mock-reports.ts
- 적용: 신규 파일 추가
- 내용:
    - 마이페이지 K-BIGx 보고서 이력 카드의 id 로 보고서를 열면, 기본 목업 위에 그 카드의 기업명 · 제목 · 발급일 · 기업별 예시 값(개요 · 분야 · 점수 · 등급 등)을 덮어 카드마다 다른 보고서를 보여 줌
    - [프론트엔드 연동] 연동에는 필요 없음 — API 연결 시 이 파일 + k-bigx-innovation-report.ts 의 import 1줄 · getInnovationGrowthReport 안 호출을 함께 삭제
- 함께 작업: 아래 보고서 데이터 카드와 한 번에 적용(서로 import)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/47c5410f2bb3673f164d8f2fc0809c079604ab71)

## [Diff 확인]

### [데이터] 보고서 데이터 파일 — 웹 · PDF 공용 표 줄 함수 추가 · 0 은 '0' 으로 표시

- 대상: src/content/service/k-bigx-innovation-report.ts
- 변경:
    - 공용 함수 · 상수 추가: 웹 보고서와 PDF 가 같은 줄 이름 · 줄 수로 표를 그림(재무 · 재무비율 · 차입금 · 업권 · 담보 · 에너지 · 매출 규모 · R&D · 우수특허 · Tech-Index)
    - 빈 값 규칙: 받지 못한 줄은 이름을 남기고 값만 '-' · 0 은 '0'(예전에는 '-')
    - 문구: 버튼 '보고서 출력' → '보고서 다운로드' · 워드클라우드 안내 추가
    - 목업 값 수정: 인당 매출액(천원 단위) · 인적자원 · 재무비율 · 차입금 · 보유기술 분야
    - [프론트엔드 연동] API 의 key · label · id 가 파일 안 상수와 글자까지 같아야 함 — 다르면 그 줄이 '-' 로 나옴
        - 재무 줄 key · 재무비율 묶음 id · 지표 label · 차입금 묶음 key · 항목 label
        - 업권 · 담보 종류 · 에너지 구분('본사 · 공장 · 기타') · 부처명
        - Tech-Index 역량 id(infra · input · activity · output) · 지표 묶음('인프라·투입 부문' · '활동·성과 부문')
    - [프론트엔드 연동] 줄 수 · 단위 규칙은 타입 주석 참고(경영진 · 주주 웹 5줄 · PDF 10행, 인당 매출액 정수 등)
    - [퍼블리싱 확인용 · 연동 후 삭제] 이력 카드별 목업 조회 · `?empty=` 빈 값 미리보기 — '[퍼블리싱 확인용]' 으로 검색해 삭제
- 결과: 웹 보고서와 PDF 가 같은 줄 수 · 같은 빈 값 표시를 씀
- 영향 화면: [K-BIGx 보고서 결과 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [K-BIGx 보고서 결과 (기관)](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [K-BIGx 보고서 PDF (기업)](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [K-BIGx 보고서 PDF (기관)](/org/k-bigx-report/innovation-growth-report/report-print)
- 함께 작업: 위 목업 신규 카드 · PDF 보고서 데이터(k-bigx-print-report.ts)와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/519c1a8fbbe8d47e2fbce1576c939370ce4a1d08)

# 작업: K-BIGx 보고서 받기를 '바로 인쇄' → '미리보기 후 PDF 다운로드'로 변경

## [신규 추가]

### [기능] 새 파일 — 화면의 보고서 쪽을 A4 PDF 파일로 저장(downloadReportPdf)

- 대상: src/lib/download-report-pdf.ts
- 적용: 신규 파일 추가
- 내용:
    - downloadReportPdf(fileName): 화면의 쪽(.report-sheet)을 차례로 그림(JPEG)으로 떠 A4 한 쪽에 한 장씩 넣어 PDF 로 저장
    - 라이브러리: html-to-image · jsPDF(둘 다 MIT) — 버튼을 누를 때만 불러와 첫 로딩에 영향 없음
    - 대기: 글꼴 로딩 · 차트 스켈레톤이 사라질 때까지(최대 5초) 기다린 뒤 뜸
    - 보정: SVG 색의 CSS 변수(var(--kbx-…))를 실제 색으로 바꿔 뜬 뒤 되돌림 · img · canvas 는 따로 제자리에 그림(Safari 에서 그림 · 워드클라우드 누락 방지)
    - 속도: 기본값과 다른 스타일 속성만 사본에 옮김(CSS 변수 제외, 누를 때마다 자동으로 모음) — 28쪽 기준 약 31초 → 10초, 결과 그림은 그대로
    - 한계: PDF 글자는 그림이라 선택 · 검색이 안 됨 — 글자를 살린 PDF 가 필요하면 서버에서 만들어 내려주는 방식으로 교체
- 함께 작업: 아래 '보고서 인쇄 틀' 카드와 한 번에 적용 · package.json 의존성(html-to-image · jspdf) 추가가 먼저 들어가야 빌드됨
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/841c777995f1dc0432c49ad6a8b6bb6660881b9e)

## [Diff 확인]

### [컴포넌트] 보고서 인쇄 틀 — [PDF 다운로드] 버튼 추가 · Safari 인쇄 빈 쪽 수정(ReportPrintShell)

- 대상: src/components/custom/report-print-shell.tsx
    - src/lib/open-report-print-tab.ts
    - src/styles/report-print.css
- 변경:
    - props: primaryAction('print' | 'pdf-download', 기본 print) · pdfFileName(확장자 제외, 없으면 title) 추가 · ReportPrintPrimaryAction 타입 export
    - pdf-download: 도구 막대 주된 버튼이 [PDF 다운로드] — 만드는 동안 disabled · aria-busy · 스피너 + 'PDF 만드는 중…'
    - 실패: 도구 막대 아래 role="alert" 오류 문구 'PDF 파일을 만들지 못했습니다. …'
    - 인쇄: 자동 인쇄 · [인쇄하기]는 글꼴 로딩 + A4 접힘(data-print-fit)이 화면에 그려진 뒤 print() — Safari 에서 쪽 사이에 빈 쪽이 끼던 문제 보정
    - openReportTab(href) 추가: 문서 화면만 새 탭으로 엶(자동 인쇄 없음) · openReportPrintTab(?print=1)은 남겨 두지만 지금은 쓰는 곳 없음
    - report-print.css: data-print-fit 을 붙이는 시점 주석만 갱신
    - [프론트엔드 연동] 서버에서 PDF 를 만들어 주게 되면 handlePrimaryAction 의 downloadReportPdf 자리를 그 다운로드로 교체
- 결과: K-BIGx 보고서 화면은 [PDF 다운로드]로 바로 파일을 받음 · 특허평가 결과 보고서는 기존 [인쇄하기] 그대로(Safari 빈 쪽만 보정)
- 영향 화면: [특허평가 결과 보고서 (기업)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [특허평가 결과 보고서 (기관)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)
- 함께 작업: 위 PDF 다운로드 카드와 한 번에 적용 · 웹 보고서 문서(innovation-growth-report-document.tsx) · 보고서 이력 다운로드 버튼(k-bigx-report-download-button.tsx)이 openReportTab 을 쓰므로 이 카드가 먼저
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/eda367703a3b4a62d16b955cec2bc75f2a5c051f)

### [컴포넌트] '인쇄 출력물 선택' 모달 → '보고서 내용 선택'으로 이름 · 버튼 문구 변경

- 대상: src/components/composite/k-bigx-print-output-selection-dialog.tsx
    - src/content/service/k-bigx-print-output-selection.ts
- 변경:
    - 제목: '인쇄 출력물 선택' → '보고서 내용 선택'
    - 버튼: [출력하기](Printer) → [보고서 미리보기](Eye)
    - 숨김 legend: '출력할 항목' → '보고서에 넣을 내용'
    - props · 항목 id(?sections= 값)는 그대로 — onPrint 이름도 유지
    - [프론트엔드 연동] [보고서 미리보기]는 고른 항목으로 report-print 를 새 탭으로 엶(openReportTab) — 주석 갱신
- 결과: 웹 보고서 [보고서 다운로드] → 보고서 내용 선택 [보고서 미리보기] 흐름 문구로 바뀜
- 영향 화면: [K-BIGx 보고서 내용 선택 (기업)](/corp/k-bigx-report/innovation-growth-report/print-output-selection)
    - [K-BIGx 보고서 내용 선택 (기관)](/org/k-bigx-report/innovation-growth-report/print-output-selection)
    - [K-BIGx 보고서 조회](/corp/k-bigx-report/innovation-growth-report)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/bc3ec0fd64a488aa1a067b6aa3b4659b7f3ab7b2)

### [화면] K-BIGx 보고서 미리보기 — 고른 장만 보여 주고 [PDF 다운로드]로 저장

- 대상: src/components/custom/kbigx-print-page.tsx
    - src/content/service/k-bigx-print-report.ts
    - src/components/custom/kbigx-print-preparing.tsx
    - src/components/custom/kbigx-print-cover.tsx
    - src/app/(user-type)/corp/(report)/k-bigx-report/innovation-growth-report/report-print/page.tsx
    - src/app/(user-type)/org/(report)/k-bigx-report/innovation-growth-report/report-print/page.tsx
- 변경:
    - 흐름: 웹 보고서 [보고서 다운로드] → 보고서 내용 선택 [보고서 미리보기] → 이 화면 새 탭 → 도구 막대 [PDF 다운로드]
    - 도구 막대: primaryAction="pdf-download" · 파일 이름 `K-BIGx 기업혁신성장 보고서_<기업명>.pdf`
    - 안내 줄: KBIGX_PRINT_TEMPLATE_NOTICE → KBIGX_PRINT_PDF_NOTICE '보고서를 인쇄하려면 PDF 파일을 다운로드한 후, 파일에서 인쇄해 주세요.'
    - ?print=1: 예전 바로 인쇄 흐름 — 지금 서비스는 쓰지 않지만 남겨 둠(준비 안내 문구만 PDF 기준으로 변경)
    - [퍼블리싱 확인용] ?empty=<모드> 추가(withPreviewEmpty — 웹 보고서와 같은 빈 값 · 긴 글 모드) · getKbigxPrintHref 에 previewEmpty 추가 — ?case= 와 함께 연동 후 삭제
    - 우수특허 줄: 자체 정렬 로직 → 웹과 공용 toExcellentPatentRows
    - 표지: 발급일이 비면 '-'
    - 라우트 page.tsx: 주석의 화면 이름만 '보고서 출력' → '보고서 미리보기'
- 결과: [보고서 미리보기]로 연 탭에서 고른 장만 확인하고 PDF 로 받음
- 영향 화면: [K-BIGx 보고서 미리보기 (기업)](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [K-BIGx 보고서 미리보기 (기관)](/org/k-bigx-report/innovation-growth-report/report-print)
- 함께 작업: 아래 '인쇄본 장별' 카드와 한 번에 적용 · 위 보고서 인쇄 틀 카드(primaryAction) 이후 · k-bigx-innovation-report.ts 의 withPreviewEmpty · INNOVATION_REPORT_EMPTY_QUERY · toExcellentPatentRows 가 먼저 있어야 빌드됨
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ec269ba5b65ed7baee182253ababe70b6fb52b08)

### [화면] K-BIGx PDF 각 장 — 값이 없어도 표 모양 유지 · 흑백 인쇄에서도 막대 구분

- 대상: src/components/custom/kbigx-print-parts.tsx
    - src/components/custom/kbigx-print-format.ts
    - src/components/custom/kbigx-print-briefing.tsx
    - src/components/custom/kbigx-print-company.tsx
    - src/components/custom/kbigx-print-credit.tsx
    - src/components/custom/kbigx-print-innovation.tsx
    - src/components/custom/kbigx-print-tech-index.tsx
    - src/components/custom/kbigx-print-activity.tsx
- 변경:
    - 공용 규칙: 고정 라벨 · 묶음(R&D 부처 · 재무 행 · 재무비율 묶음 · 차입금 · 기관 업권 · 담보 · 에너지 구분 · Tech-Index 역량 등)을 웹 보고서와 공용 상수 · 함수(k-bigx-innovation-report.ts)로 이전 — 데이터가 없어도 줄 · 카드 이름은 남고 칸만 '-'
    - 빈 상태: 재무비율진단 · 부문별 비교 · 3개년 재무 현황 · 신용/담보 비중 · Tech-Index 역량 카드 · 이머징 기술(머리 · 칸 '-' 줄)은 값이 하나도 없을 때 빈 상태 또는 '-' 표, 높이는 그대로
    - 기업현황: 특허 · 인증 4칸 고정(받지 못하면 '-') · 재무 연도가 없으면 '-' 연도 칸 · 겹친 막대 그래프의 빈 값은 '-'
    - 기업신용등급 알약: 5단계 tone → 9단계(getCriGradeBand) KBX_CREDIT_TAG_CLASS(kbx credit-tag 색) — 진단브리핑 · 신용/재무정보 공용
    - 신용정보 표: 숫자 값(금액 · 일자 · 번호)은 자르지 않고 쉼표 뒤 줄바꿈, 글 값은 한 줄 말줄임 · 상태 값이 없으면 알약 숨김 · 등급 없음 '-' 는 작은 글자
    - 인당 매출액: 소수 한 자리 → 정수(kbxIntegerFormat 추가, 천원 단위)
    - 흑백 인쇄 구분: 경쟁기업 · Tech-Index · 시장규모 막대 색을 kbx chart-* 토큰(조회기업 진남 · 일반 파랑 · 평균 옅은 바탕 + 사선)으로 변경
    - 말줄임: 머리말 기업명 · 블록 꼬리표 한 줄 말줄임 · 업종명 2줄 · 기업명 비면 '-'
    - 문구: R&D 과제 열 머리 '부처명 (전문기관)' → '전문기관'
- 결과: 값이 비거나 일부만 와도 쪽 모양이 무너지지 않고 웹 보고서와 같은 규칙으로 '-' · 빈 상태 표시
- 영향 화면: [K-BIGx 보고서 미리보기 (기업)](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [K-BIGx 보고서 미리보기 (기관)](/org/k-bigx-report/innovation-growth-report/report-print)
- 함께 작업: 위 미리보기 카드와 한 번에 적용 · 먼저 들어가야 하는 다른 작업: k-bigx-innovation-report.ts 공용 상수 · 함수, cri-grades.ts getCriGradeBand · CriGradeBand, tokens.json kbigxPrint 색(credit-tag-* · chart-subject · chart-general · chart-average-* · chart-series-* · chart-trend* · chart-track), 차트 props(NestedColumnChart missingValueText · ValueColumnChart highlightLabel · RankBarList · ComboValueChart averageLine)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/231c68bf3f4e22fd39d48f4d53ed1649b925fdd8)

## [덮어쓰기]

### [문서] 보고서 내용 선택 모달 새 가이드

- 대상: src/app/component-guide/(guide)/kbigx-print-output-selection-dialog/page.tsx
- 적용: 지정한 파일만 교체(새 가이드 페이지)
- 내용: 새 가이드 페이지 — 사용법(openReportTab 으로 report-print 새 탭) · 다운로드 흐름 단계 · props 정리
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e3cf48eec62067a1f3080453768b394a9a9fde08)

# 작업: K-BIGx 웹 보고서 — 태블릿 지원 · 빈 값과 긴 이름 정리 · [보고서 다운로드] 버튼

## [신규 추가]

### [컴포넌트] 새 파일 — 신용등급 코드를 게이지 색 · 채움 값으로 바꾸는 함수(toCreditGaugeData)

- 대상: src/components/custom/credit-gauge-data.ts
- 적용: 신규 파일 추가
- 내용:
    - 등급 코드 → 반원 게이지 data — 등급 단계(getCriGradeBand)마다 credit-gauge-<단계> 그라데이션 · 트랙 색
    - 채움: 등급 순위 · 유보(R)는 절반 · 평가제외(NR) · 표에 없는 코드는 트랙만 · 등급이 비면 '-'
    - [프론트엔드 연동] API 등급 코드 · 날짜 목록을 toCreditGaugeData(코드, 날짜 목록)에 넘김
- 함께 작업: cri-grades.ts · arc-gauge-shape.ts(creditGaugeGradient · CREDIT_GAUGE_TRACK) · semicircle-rating-gauge.tsx · tokens.json(credit-gauge-*) 카드 다음에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fa1a270db3fa427fcce0546218bf0c007caa36bf)

## [Diff 확인]

### [컴포넌트] 웹 보고서 공용 부품 — 긴 글 칸(2줄 말줄임) · 소제목 추가

- 대상: src/components/custom/innovation-growth-report-parts.tsx
- 변경:
    - 추가(SubSectionTitle): 구획 안 소구획 제목(h4)
    - 추가(Card titleAs): 'h4' | 'h5' — 소구획 아래 카드만 h5(모양 같음)
    - 추가(ReportTable emptyClassName): 빈 줄 칸 모양 지정
    - 추가(ReportTextCell): 표 긴 글 칸 — 기본 2줄 말줄임 + 잘렸을 때만 툴팁 · '(주)' · '주식회사' 뒤에서 줄 안 바뀜 · 값 없으면 '-'
- 결과: 기업현황 · 기술혁신정보 · 신용/재무정보 표의 긴 이름이 칸을 넘지 않음
- 영향 화면: [K-BIGx 보고서 결과 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 함께 작업: 말줄임 글(truncated-text.tsx) 신규 카드 다음에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a9b56911f95aad08c16c55a39e1d2f82873349d5)

### [컴포넌트] 웹 보고서 틀 · 진단브리핑 — [보고서 다운로드] 버튼 · 모든 탭 태블릿 지원 · 빈 값 처리

- 대상: src/components/custom/innovation-growth-report-document.tsx
    - src/components/custom/innovation-growth-report-page.tsx
- 변경:
    - [보고서 출력] → [보고서 다운로드]: 보고서 내용 선택 모달 → [보고서 미리보기]가 PDF 문서 화면을 새 탭으로 엶(자동 인쇄 없음, openReportPrintTab → openReportTab) · 모바일에서도 [더보기] 옆에 보임
    - 진단브리핑 외 탭: PC 전용(최소 폭 1200) → 태블릿 · PC 지원(768 미만은 태블릿 모양 · 최소 폭 768 가로 스크롤)
    - 머리 · 기업 정보 · 기준일자: 값이 비면 '-' · 모두 비면 같은 높이의 빈 상태
    - 진단브리핑 그래프 · 표: 데이터가 없으면 빈 상태(워드클라우드 · 신용/재무 현황 · 재무비율진단), 일부만 없으면 '-'(막대 자리 포함) · 정부 R&D 늘 4칸
    - 기업신용등급 게이지: 등급 단계별 색(toCreditGaugeData)
    - 스켈레톤: Tech-Index 구획 순서 · 제목을 탭과 맞춤(혁신성장역량지수 부문별 지표 비교 · 혁신성장역량지수 비교) · '맞춤형 기술정보-우수기술' → '맞춤형 기술정보 · 우수기술'
    - [퍼블리싱 확인용 · 연동 후 삭제] page.tsx 의 ?empty= 적용(withPreviewEmpty) · 모달이 여는 주소에 ?case= · ?empty= 전달
- 결과: 태블릿에서 모든 탭을 볼 수 있고, 다운로드는 고른 장만 담은 PDF 미리보기로 이어짐
- 영향 화면: [K-BIGx 보고서 결과 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [K-BIGx 보고서 결과 (기관)](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 함께 작업: 아래 탭 카드 5장과 한 번에 적용(탭에 fallbackYears · SubSectionTitle 등을 넘김) · 보고서 내용 선택 모달 · open-report-print-tab.ts(openReportTab) 카드 다음에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e2b88004e2beebaeb5a0a40ee7544cde2c881dfb)

### [컴포넌트] 기업현황 탭 — 표 줄 수 고정 · 값 없으면 '-' · 긴 이름 말줄임

- 대상: src/components/custom/innovation-growth-report-company.tsx
- 변경:
    - 경영진 · 주주 표: 늘 5줄(모자라면 '-' 줄 · 0건이면 5줄 높이 빈 상태) · 주주 단위를 머리글로(소유주식수(주) · 지분율(%))
    - 관계기업 · 거래처: 최대 10줄 · 0건이면 빈 상태
    - 재무 표: 줄 고정(FINANCE_ROW_LABELS) — 받지 못한 줄도 이름 남기고 '-' · 0 은 0 · 그래프 자리는 빈 상태
    - 특허 및 인증현황: 4칸씩 고정(PDF 와 같은 순서 · 이름)
    - 긴 글 칸: 2줄 말줄임 + 툴팁(ReportTextCell) · 개요가 모두 비면 빈 상태
- 결과: 데이터 건수 · 길이와 관계없이 표 모양이 일정함
- 영향 화면: [기업현황 탭 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=company)
    - [기업현황 탭 (기관)](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=company)
- 함께 작업: 위 문서 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0e910c056fa6312dabaecbf6d363c3ebaf5528b1)

### [컴포넌트] 기술혁신정보 탭 — 기술분야 단계 표시 · 합계 줄 추가 · 값 없으면 '-'

- 대상: src/components/custom/innovation-growth-report-tech.tsx
- 변경:
    - 분석특허 · 맞춤형 기술분야 상자: 같은 짜임 — 기술분야는 '대분류 › 중분류 › 소분류(태그)' 단계 표시
    - [프론트엔드 연동] 기술분야 path 는 '(기술분야) 대분류 – 중분류 – 소분류' 모양 문자열 — 단계가 없으면 분야 이름 하나만 태그
    - 이머징 기술 · R&D 전문기관: 합계 줄 추가(숫자인 칸만 더함, 없으면 '-') · 기간을 못 받으면 '-' 기간 5칸
    - 매출 규모: 5행 고정(toMarketScaleRows) · 우수특허: 10건 + '기타' 줄(toExcellentPatentRows, PDF 와 공용)
    - 빈 값: 0건 표 · 키워드 없음 · 카드 값 모두 없음 → 빈 상태 · 일부 없음 → '-' · 비중 · 증가율 소수 첫째 자리 고정
    - 긴 글: 출원인 / 권리자 · 공고명 · 전문기관 2줄 말줄임 + 툴팁(권리자 닫는 괄호는 남김) · 태블릿에서는 표 안 가로 스크롤
    - 제목: '맞춤형 기술정보-우수기술' → '맞춤형 기술정보 · 우수기술'
- 결과: 빈 데이터 · 긴 이름에서도 표가 깨지지 않고, 합계를 바로 볼 수 있음
- 영향 화면: [기술혁신정보 탭 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=innovation)
    - [기술혁신정보 탭 (기관)](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=innovation)
- 함께 작업: 위 문서 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1f84a7b88a200e4f64867cea8e62bc7916ce0394)

### [컴포넌트] Tech-Index 탭 — 구획 순서 · 제목을 PDF 와 맞춤 · 값 없으면 빈 상태

- 대상: src/components/custom/innovation-growth-report-tech-index.tsx
- 변경:
    - 구획 순서(PDF 와 같음): 지수설명 → 혁신성장역량지수 → 부문별 지표 비교 → 혁신성장역량지수 비교(아래 소구획 h4: 4대 혁신역량 부분별 비교 · 기업 유형별 4대 혁신역량 비교)
    - 제목: '세부지표별 상대비교분석' → '혁신성장역량지수 부문별 지표 비교' · 범례는 구획 제목 줄에 한 번
    - 카드 고정: 4대 역량 카드 4장 · 지표 비교 카드 2장은 데이터가 없어도 그림 — 없으면 빈 상태, 한쪽 점수만 없으면 '-'
    - 표준정보 비교: 분포 값이 없으면 평균 '-' · 곡선은 모양용 값으로 그림
    - 문장 속 기업명: 한 줄 말줄임 + 툴팁(조사는 붙여 남김)
- 결과: 점수 · 역량 데이터가 없어도 구획 모양이 유지됨
- 영향 화면: [Tech-Index 탭 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=tech-index)
    - [Tech-Index 탭 (기관)](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=tech-index)
- 함께 작업: 위 문서 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/59ccd533de058b4be6eeb6153cea605d49786ac9)

### [컴포넌트] 신용/재무정보 탭 — 등급 이력 그래프 · 표 줄 수 고정 · 값 없으면 '-'

- 대상: src/components/custom/innovation-growth-report-credit.tsx
- 변경:
    - 등급 이력(기업신용등급 · 현금흐름등급): 같은 추이 그래프 + 최근 3건 표 · 늘 3줄('-' 줄) · 0건이면 빈 상태
    - 현금흐름등급 원호: 등급 단계 그라데이션(cash-flow-gauge-cf-<n> 토큰)
    - 재무비율 묶음 4 × 지표 4 · 차입금 변동 4줄 · 업권 5줄 · 담보 3종 고정 — 없는 값은 '-' · 연도는 최근 3개년
    - 차입금 현황: 묶음 · 항목 줄 고정 · 칸이 한 줄로 넓어지고 태블릿에서는 표 안 가로 스크롤(최소 폭 800)
    - 기업신용정보 표: 글 값 한 줄 말줄임 + 툴팁 · 숫자 값은 줄바꿈해 다 보임 · '해당사항 없음' · '비공개' 줄은 옅은 면
    - 새 prop: fallbackYears(연도를 못 받을 때 쓸 대체 연도 — 문서가 넘김)
- 결과: 데이터가 없거나 큰 금액이어도 표가 겹치지 않음
- 영향 화면: [신용/재무정보 탭 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=credit-finance)
    - [신용/재무정보 탭 (기관)](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=credit-finance)
- 함께 작업: 위 문서 카드와 한 번에 적용 · tokens.json(cash-flow-gauge-*) 카드 다음에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/75dc80b203d67c4f98d79ea4c358202fe4a7b1b3)

### [컴포넌트] 활동성정보 탭 — 증감을 '▲ 3.5%' 글자로 · 표 줄 수 고정 · 값 없으면 '-'

- 대상: src/components/custom/innovation-growth-report-activity.tsx
- 변경:
    - 전년대비 증감(율): 화살표 아이콘 → '1명 (▲ 3.5%)' — 증가 빨강 ▲ · 감소 파랑 ▼ · 같으면 기호 없음 · 화면 낭독기는 '증가 · 감소 · 변동 없음'
    - 인적자원 표: 늘 최근 3개년 3줄 · 인당 매출액 정수 반올림(천원)
    - 에너지 표: 본사 · 공장 · 기타 3줄 고정 + 합계 줄(값 있는 구분만 더함)
    - 그래프: 일부 값 없음 → 선 끊김 · 막대 자리 '-' / 모두 없음 → 빈 상태
    - 새 prop: fallbackYears(연도를 못 받을 때 쓸 대체 연도 — 문서가 넘김)
- 결과: PDF 와 같은 증감 표기 · 같은 빈 값 표시
- 영향 화면: [활동성정보 탭 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=activity)
    - [활동성정보 탭 (기관)](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=activity)
- 함께 작업: 위 문서 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e134b6effce9d0a94f1dcb152e5ea5a3c0cd913d)

### [화면] 보고서 내용 선택 화면 이름 변경('인쇄 출력물 선택' → '보고서 내용 선택')

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/innovation-growth-report/print-output-selection/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/print-output-selection/page.tsx
    - src/app/(user-type)/corp/(report)/k-bigx-report/innovation-growth-report/diagnostic-briefing/page.tsx
    - src/app/(user-type)/org/(report)/k-bigx-report/innovation-growth-report/diagnostic-briefing/page.tsx
- 변경:
    - 화면 이름(metadata · 안내): '인쇄 출력물 선택' → '보고서 내용 선택' · 호출 버튼 '[K-BIGx 보고서 출력]' → '[보고서 다운로드]'
    - 보고서 결과 화면: 주석만 변경(다운로드 → 보고서 내용 선택 → PDF 문서 새 탭)
- 결과: 화면 이름이 바뀐 버튼 · 모달 이름과 맞음
- 영향 화면: [보고서 내용 선택 (기업)](/corp/k-bigx-report/innovation-growth-report/print-output-selection)
    - [보고서 내용 선택 (기관)](/org/k-bigx-report/innovation-growth-report/print-output-selection)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/efdfd78332b1fe732396ef004c8a50251f8c9f5f)

## [덮어쓰기]

### [문서] 등급 게이지 · 막대 차트 가이드 8종 — 단계 색 · 사선 막대 예시 추가

- 대상: src/app/component-guide/(guide)/semantic-color/page.tsx
    - src/app/component-guide/(guide)/semicircle-rating-gauge/page.tsx
    - src/app/component-guide/(guide)/semicircle-rating-gauge/semicircle-rating-gauge-demo.tsx
    - src/app/component-guide/(guide)/grade-scale-gauge/page.tsx
    - src/app/component-guide/(guide)/grade-history-chart/page.tsx
    - src/app/component-guide/(guide)/combo-value-chart/page.tsx
    - src/app/component-guide/(guide)/rank-bar-list/page.tsx
    - src/app/component-guide/(guide)/value-column-chart/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - 시맨틱 색상: credit-gauge-* · cash-flow-gauge-* 그룹 · 설명 추가
    - 등급 원호 게이지: toCreditGaugeData 예시 · CRI 24개 등급 데모(단계 색) · gradient/trackColor props
    - 등급 눈금 게이지: arcColor · arcGradientTo props · 현금흐름등급 원호 예시
    - 등급 이력: 현금흐름등급(CF1~CF6) 값 변환 예시
    - 막대 + 선 값 · 순위 막대 목록 · 값 막대: averageLine · lineHalo · highlightLabel props와 PDF 템플릿 색 예시 · 용어 '인쇄본 → PDF 템플릿'
- 함께 작업: 등급 원호 게이지 가이드는 credit-gauge-data.ts(신규) · cri-grades.ts 를 import — 두 카드 다음에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/dada2b981dfd5195d32c300558287a15b019ab07)

# 작업: 마이페이지 보고서 이력 — [보고서 다운로드]도 내용 선택 → PDF 저장으로

## [신규 추가]

### [컴포넌트] 새 파일 — 이력 카드의 [보고서 다운로드] 버튼(KBigxReportDownloadButton)

- 대상: src/components/custom/k-bigx-report-download-button.tsx
- 적용: 신규 파일 추가
- 내용:
    - 흐름: [보고서 다운로드] → 보고서 내용 선택 모달 → [보고서 미리보기] → 새 탭 report-print?reportId=<item.id>&sections=<고른 장> → [PDF 다운로드]
    - [프론트엔드 연동] reportId 는 item.id 하나만 넘김 — PDF 는 보고서 조회 API 값으로만 그림(카드 값은 넘기지 않음) · 이력 id 가 보고서 id 와 다르면 보고서 id 로 바꿔 넣음
    - [프론트엔드 연동] 모달의 조회기준일은 지금 조회일시(inquiredAt) — 이력 API 가 조회기준일을 주면 그 값으로 바꿈
- 함께 작업: 아래 카드와 한 번에 적용 · 보고서 내용 선택 모달 · open-report-print-tab.ts(openReportTab) 카드 다음에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c80c529c3a29a102d7c294fe7be4cae5da72f890)

## [Diff 확인]

### [컴포넌트] 보고서 이력 카드 · 목록 — 파일 링크 대신 내용 선택 모달 연결(props 변경)

- 대상: src/components/custom/k-bigx-report-card.tsx
    - src/components/custom/k-bigx-report-history-list.tsx
    - src/constants/k-bigx-report-history.ts
    - src/content/service/k-bigx-report-history.ts
- 변경:
    - 카드 [보고서 다운로드]: 파일 링크(routes.download) → KBigxReportDownloadButton(모달 → PDF 미리보기)
    - KBigxReportCard props: routes 는 대량정보조회 [엑셀 결과] · [HTML 압축파일]만 · printPath 필수 추가
    - 목록: 사용자 유형에 맞는 printPath(기업 KBIGX_PRINT_CORP_PATH · 기관 KBIGX_PRINT_ORG_PATH)를 카드에 넘김
    - K_BIGX_REPORT_ROUTES: download 삭제
    - [프론트엔드 연동] KBigxReportHistoryItem 주석: id = 보고서 조회 id · 기업명 = report.companyName · 조회일시 = report.issuedAt · 특허명 = report.title — 카드와 PDF 값은 백엔드가 같은 보고서에서 내려 줘야 맞음
- 결과: 이력 카드에서도 장을 골라 PDF 로 받음
- 영향 화면: [K-BIGx 보고서 이력 (기업)](/corp/mypage/k-bigx-report-history)
    - [K-BIGx 보고서 이력 (기관)](/org/mypage/k-bigx-report-history)
- 함께 작업: 위 신규 카드와 한 번에 적용(props 변경이라 함께 넣어야 빌드됨)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3af09e161bbdcc23c2c3de353ba1b6722448b3e4)

# 작업: 백엔드 전달용 K-BIGx PDF 템플릿 HTML 추가 · 다운로드 주소

## [신규 추가]

### [자산] 새 파일 — PDF 템플릿 HTML 한 장 · /downloads 다운로드 주소

- 대상: templates/kbigx-report-template.html
    - src/app/downloads/kbigx-report-template.html/route.ts
- 적용: 신규 파일 추가
- 내용:
    - 템플릿: 백엔드가 맨 위 `<script id="kbigx-report-data">`(JSON)만 바꿔 PDF 를 만드는 HTML 한 장 — 사용법은 파일 맨 위 주석
    - 다운로드 주소: /downloads/kbigx-report-template.html — 빌드 때 templates/ 의 파일을 읽어 정적 응답으로 굳힘(templates/ 를 지우면 빌드 실패)
    - 템플릿은 손으로 고치지 않음 — 바꿀 일이 있으면 퍼블리싱 저장소에서 다시 만들어 전달
- 함께 작업: 두 파일 한 번에 적용(다운로드 주소가 템플릿 파일을 읽음)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/7cc0456d7d9aa00e4fb7f9a16c278844df81ae54)

## [덮어쓰기]

### [문서] 퍼블리싱 인덱스 — '보고서 템플릿 다운로드' 행 추가 · 중복 메뉴 삭제

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
    - src/content/publishing-guide/index.ts
    - src/content/publishing-guide/types.ts
    - src/components/custom/publishing-index.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - 다운로드 행: 마이페이지 › K-BIGx 보고서 이력 › 보고서 템플릿 다운로드(기업 · 기관) — 화면 대신 파일 다운로드 링크(downloadHref)
    - 메뉴 정리: K-BIGx 메뉴의 중복 '보고서 이력 조회 (마이페이지)' 행 삭제(마이페이지 행으로 일원화)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f3ef4a3ce2224ef355df52caa2f354f2b5eeb9f0)

# 작업: 검색 폼 — [검색하기] 후 키보드 위치가 맨 위로 튀지 않게

## [Diff 확인]

### [컴포넌트] 검색 폼 — 조회 중에도 [검색하기]에 포커스 유지(SelectSearchForm)

- 대상: src/components/composite/select-search-form.tsx
- 변경:
    - [검색하기]: 조회 중 disabled → aria-disabled — 키보드로 누른 버튼에서 포커스가 빠지지 않음
    - 제출: 조회 중 다시 제출하면 handleSubmit 에서 막음
- 결과: 검색 후 다음 Tab 이 화면 맨 위가 아니라 [검색하기] 다음으로 이어짐
- 영향 화면: [특허등급 조회 (기업)](/corp/patent-evaluation/patent-grade-list)
    - [특허등급 조회 (기관)](/org/patent-evaluation/patent-grade-list)
    - [K-BIGx 보고서 조회](/corp/k-bigx-report/innovation-growth-report)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/113642d09e2d294cd19c4f288b428b7482fec1ed)

## [덮어쓰기]

### [문서] 검색 폼 · 보고서 틀 · 가이드 홈 — 설명 갱신

- 대상: src/app/component-guide/(guide)/select-search-form/page.tsx
    - src/app/component-guide/(guide)/report-shell/page.tsx
    - src/app/component-guide/(guide)/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - 검색 폼: 조회 중 포커스 유지 접근성 설명 추가
    - 보고서 틀: PDF 템플릿 단독 HTML 사용법 · 데이터 표시 규칙
    - 시작 페이지: 전달본에서 바뀌는 파일 목록에 PDF 템플릿 관련 3개 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/044c35d3768b963496e4f99214e4eef6284eaab6)

# 작업: 새 가이드 페이지 5개 — 모달 4종 · 오픈소스 라이선스

## [신규 추가]

### [문서] 전자서명 · 인증서 선택 · 본인 확인 · 로그인 안내 모달 · 라이선스 가이드 추가

- 대상: src/app/component-guide/(guide)/e-signature-dialog/page.tsx
    - src/app/component-guide/(guide)/certificate-select-dialog/page.tsx
    - src/app/component-guide/(guide)/identity-verification-dialog/page.tsx
    - src/app/component-guide/(guide)/login-dialogs/page.tsx
    - src/app/component-guide/(guide)/licenses/page.tsx
    - src/content/publishing-guide/third-party-licenses.generated.json
- 적용: 신규 파일 추가
- 내용:
    - [약정서 전자서명](/component-guide/e-signature-dialog): 법인인증 · 개인인증 화면, props, 연동 방법
    - [인증서 선택](/component-guide/certificate-select-dialog): 공동인증서 · 금융인증서 선택 모달 사용법
    - [본인 확인](/component-guide/identity-verification-dialog): 비밀번호 확인 모달 · 쓰는 곳별 가입 정보 표시
    - [로그인 안내 모달](/component-guide/login-dialogs): 아이디 · 비밀번호 찾기 · 회원가입 안내 모달 문구 관리
    - [오픈소스 라이선스](/component-guide/licenses): 라이브러리 · 폰트 라이선스와 지킬 것 정리(목록은 third-party-licenses.generated.json 자동 생성 파일에서 읽음)
- 함께 작업: 사이드바 메뉴(src/constants/publishing-guide.ts) 카드와 한 번에 적용 · 라이선스 페이지와 JSON 은 함께 넣어야 빌드됨
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0223c1a6b60440d9236d87d249f8533533ba9698)

# 작업: 가이드 문구 정리 — '인쇄본' → 'PDF 템플릿'

## [덮어쓰기]

### [문서] 가이드 15종 — '인쇄본' 표기를 'PDF 템플릿'으로 통일

- 대상: src/app/component-guide/(guide)/callout-pie-chart/page.tsx
    - src/app/component-guide/(guide)/chart-reveal/page.tsx
    - src/app/component-guide/(guide)/color/page.tsx
    - src/app/component-guide/(guide)/comparison-radar-chart/page.tsx
    - src/app/component-guide/(guide)/distribution-curve-chart/page.tsx
    - src/app/component-guide/(guide)/distribution-value-chart/page.tsx
    - src/app/component-guide/(guide)/donut-list-chart/page.tsx
    - src/app/component-guide/(guide)/dual-line-chart/page.tsx
    - src/app/component-guide/(guide)/image/page.tsx
    - src/app/component-guide/(guide)/inside-label-pie-chart/page.tsx
    - src/app/component-guide/(guide)/marker-line-chart/page.tsx
    - src/app/component-guide/(guide)/motion/page.tsx
    - src/app/component-guide/(guide)/private-content/page.tsx
    - src/app/component-guide/(guide)/rating-trend-chart/page.tsx
    - src/app/component-guide/(guide)/score-scale-bar/page.tsx
- 적용: 지정한 파일만 교체
- 내용: 설명 · 코드 예시 주석의 '인쇄본'을 'PDF 템플릿'으로 통일(비교 레이더 차트는 카드 이름 '혁신성장역량지수 부문별 지표 비교'도 갱신)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/885602d7794afe81e46de1b749afd1f334b770bf)

# 작업: 가이드 사이드바에 새 페이지 메뉴 7개 등록

## [덮어쓰기]

### [문서] 가이드 사이드바 메뉴 — 새 가이드 7개 추가

- 대상: src/constants/publishing-guide.ts
- 적용: 지정한 파일만 교체
- 내용:
    - 메뉴 추가: 오픈소스 라이선스 · TruncatedText · ESignatureDialog · CertificateSelectDialog · IdentityVerificationDialog · KbigxPrintOutputSelectionDialog · 로그인 안내 모달
    - 설명: K-BIGx PDF 템플릿 컴포넌트 묶음 안내 문구 갱신
- 함께 작업: 위 새 가이드 페이지 카드들 다음에 적용(메뉴가 가리키는 페이지가 있어야 함)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c0d8a034fe5fd5b8bc87e967ac10e74a4186abfa)
