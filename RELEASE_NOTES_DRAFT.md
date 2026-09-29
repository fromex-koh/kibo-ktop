# 다음 릴리스 변경사항

## [Diff 확인]

### [화면] 특허평가 결과 보고서 출력 — 미리보기 화면 없이 바로 인쇄

- 대상: src/components/custom/patent-grade-lookup.tsx
- 변경: [결과 보고서 출력]을 링크에서 버튼으로 바꿨습니다. 누르면 보고서 화면으로 이동하지 않고, 화면 밖에서 보고서를 한 번 그린 뒤 다 그려지면 인쇄 대화상자를 엽니다. 그리는 자리는 용지 한 장 크기(1360 × 1924)로 두었습니다 — 자리가 좁으면 그래프가 그려질 폭을 알지 못해 빈 칸으로 인쇄됩니다.
- 결과: 중간 화면을 거치지 않고 인쇄 미리보기가 바로 열립니다. 인쇄가 끝나거나 취소되면 프레임은 사라집니다.
- 참고: API 연결 시 손봐야 할 두 가지(주소에 조회 조건 담기 · 인쇄 시점 판단)를 버튼 바로 위 [프론트엔드 연동] 주석에 적어 두었습니다.
- 영향 화면:
    - [기업 특허 등급조회](/corp/patent-evaluation/patent-grade-list)
    - [기관 특허 등급조회](/org/patent-evaluation/patent-grade-list)
    - [기업 특허 등급조회 결과](/corp/patent-evaluation/patent-grade-list/patent-grade-result)
    - [기관 특허 등급조회 결과](/org/patent-evaluation/patent-grade-list/patent-grade-result)
    - [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/dd46d9e838445bba0b4505bbeb60d12711c9516c)

### [화면] 특허 등급조회 화면에 보고서 주소 전달

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/patent-evaluation/patent-grade-list/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/patent-evaluation/patent-grade-list/patent-grade-result/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/patent-evaluation/patent-grade-list/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/patent-evaluation/patent-grade-list/patent-grade-result/page.tsx
- 변경: PatentGradeLookup 에 reportHref 한 줄을 추가했습니다. 기업 화면은 /corp/patent-evaluation/patent-grade-list/patent-grade-result/report, 기관 화면은 /org/patent-evaluation/patent-grade-list/patent-grade-result/report 를 가리킵니다.
- 결과: [결과 보고서 출력] 버튼은 이 주소를 열어 인쇄합니다. 인쇄할 문서를 바꾸거나 조회 조건을 붙일 때 화면에서 고칠 곳은 이 한 줄입니다.
- 영향 화면:
    - [기업 특허 등급조회](/corp/patent-evaluation/patent-grade-list)
    - [기관 특허 등급조회](/org/patent-evaluation/patent-grade-list)
    - [기업 특허 등급조회 결과](/corp/patent-evaluation/patent-grade-list/patent-grade-result)
    - [기관 특허 등급조회 결과](/org/patent-evaluation/patent-grade-list/patent-grade-result)
    - [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/dd46d9e838445bba0b4505bbeb60d12711c9516c)

### [데이터] 특허평가 보고서 값 · 문구 확장

- 대상: src/content/service/patent-grade.ts
- 변경: 인쇄용 보고서 다섯 쪽에 들어가는 값과 문구를 모두 이 파일에 담았습니다. 항목별 상세(details — 등급 분포 · 영향요인 · 분석 문단)와 참고자료 쪽 문구가 추가되었습니다.
- 결과: 화면 파일을 열지 않고 이 파일 하나에서 보고서 내용을 고칩니다. details 를 더하면 쪽과 쪽수(1 / 5)가 함께 늘어납니다.
- 영향 화면:
    - [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기업 특허 등급조회 결과](/corp/patent-evaluation/patent-grade-list/patent-grade-result)
    - [기관 특허 등급조회 결과](/org/patent-evaluation/patent-grade-list/patent-grade-result)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1179169575a19cc043bef970e5e1398a53270e22)

### [화면] 이용안내 본문 적용

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-out)/guide/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/guide/page.tsx
- 변경: '내용 추후 업데이트' 임시 구획을 실제 본문(ServiceGuide)으로 교체했습니다.
- 결과: 기업 · 기관이 같은 본문을 씁니다. 문구는 src/content/service/guide.ts 에 있습니다.
- 영향 화면:
    - [기업 이용안내](/corp/guide)
    - [기관 이용안내](/org/guide)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c873407036313e2d025582d4e104da61fc90f6f5)

### [컴포넌트] 세로 막대 그래프에 plain 변형과 로딩 추가

- 대상: src/components/custom/column-chart.tsx
- 변경: 축 없이 격자와 두 줄 이름만 두는 variant="plain" 과 isLoading 을 더했습니다. 그래프에 넘기는 값에서 그리기에 필요 없는 필드를 걸러 냅니다.
- 결과: 보고서의 영향요인 비교에 같은 컴포넌트를 씁니다. 필드가 SVG 속성으로 새어 나가 생기던 id 중복 경고도 사라집니다.
- 영향 화면:
    - [ColumnChart 가이드](/component-guide/column-chart)
    - [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2f9ecac144aa2f19a4b6887596aa2c85718f236a)

### [컴포넌트] 차트 스켈레톤 두 종류 추가

- 대상: src/components/composite/chart-skeleton.tsx
- 변경: plain-column(격자 위 막대)과 grade-distribution(가운데가 봉긋한 곡선 + 세로 점선 격자)을 더했습니다.
- 결과: 그래프가 그려지기 전에도 자리와 모양이 유지됩니다.
- 영향 화면:
    - [Skeleton 가이드](/component-guide/skeleton)
    - [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/90c93eb4be1fdf3684b3d30ccb687d7f50ea610c)

### [컴포넌트] 등급 레이더에 말풍선 끄기 옵션

- 대상: src/components/custom/grade-radar-chart.tsx
- 변경: showTooltip 을 더했습니다(기본값은 켬).
- 결과: 손이 닿지 않는 인쇄용 문서에서 말풍선과 꼭짓점 강조를 끕니다.
- 영향 화면:
    - [GradeRadarChart 가이드](/component-guide/grade-radar-chart)
    - [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기업 특허 등급조회 결과](/corp/patent-evaluation/patent-grade-list/patent-grade-result)
    - [기관 특허 등급조회 결과](/org/patent-evaluation/patent-grade-list/patent-grade-result)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8c8e7f2006e21f2fe3c269d5ef03d6aa7acf1889)

### [스타일] 인쇄용 문서 규격 CSS

- 대상: src/app/globals.css
- 변경: 용지 규격(A4 비율 · 화면 배율 · 인쇄 배율)과 @media print 규칙을 더했습니다. 별도 스타일 파일을 만들지 않고 전역 파일에 모았습니다.
- 결과: 보고서 화면은 용지 안의 내용만 그리고, 쪽 나눔 · 여백 · 색 유지는 이 CSS 가 맡습니다.
- 영향 화면:
    - [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/649d0f81788b418034044aa96ff599f0c17cb75f)

### [마크업] 업로드 결과 한 줄의 구분선 위치

- 대상: src/components/composite/file-upload-result.tsx
- 변경: 항목 사이 세로 구분선을 div 바로 아래에서 이름(dt) 안으로 옮겼습니다.
- 결과: dl 안의 div 는 dt · dd 만 담을 수 있다는 규칙을 지킵니다. 보이는 모습은 같습니다.
- 영향 화면:
    - [FileUpload 가이드](/component-guide/file-upload)
    - [기관 평가이력 · 일괄평가](/org/batch-evaluation/evaluation-history-or-batch)
    - [기관 대량정보조회](/org/k-bigx-report/bulk-data-search)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e564308be7315074eab48797b048e9b14c67f98e)

### [마크업] K-BIGx 보고서 카드 — 제목 없을 때 div

- 대상: src/components/custom/innovation-growth-report-parts.tsx
- 변경: 제목이 있을 때만 section 으로 그리고, 없으면 div 로 그립니다.
- 결과: 이름 없는 구획으로 잡히던 마크업 경고가 사라집니다. 스타일과 구조는 그대로입니다.
- 영향 화면:
    - [기업 진단브리핑 보고서](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 진단브리핑 보고서](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/863973f915f85e5b8d723b70386c39a791826b3f)

### [리팩터링] 추이 차트 색 상수 이름

- 대상: src/components/custom/patent-grade-report.tsx
- 변경: TREND_COLOR → PATENT_TREND_COLOR.
- 결과: 인쇄용 보고서가 같은 값을 쓰므로 어느 보고서의 색인지 이름에서 드러납니다.
- 영향 화면:
    - [기업 특허 등급조회 결과](/corp/patent-evaluation/patent-grade-list/patent-grade-result)
    - [기관 특허 등급조회 결과](/org/patent-evaluation/patent-grade-list/patent-grade-result)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/82d81cf4400f0ffe78d399e26688504b76258b28)

## [신규 추가]

### 특허평가 결과 보고서 — 인쇄용 화면

- 대상:
    - src/app/(user-type)/corp/(report)/patent-evaluation/patent-grade-list/patent-grade-result/report/page.tsx
    - src/app/(user-type)/org/(report)/patent-evaluation/patent-grade-list/patent-grade-result/report/page.tsx
- 적용:
    - 신규 파일 추가. 헤더 · 푸터가 없는 (report) 레이아웃을 쓰는 A4 다섯 쪽 문서이며, 쪽 차례와 쪽수는 이 파일의 REPORT_PAGES 가 정합니다.
    - 파일 맨 위 주석에 API 연결 흐름을 적어 두었습니다 — 버튼이 조회 조건을 붙인 주소를 열면 이 화면이 searchParams 로 그 조건을 읽어 조회하고, 그 결과로 쪽을 만듭니다. 바꿀 자리(MOCK_REPORT)와 코드 모양도 함께 있습니다.
- 영향 화면:
    - [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)

### 인쇄용 보고서 컴포넌트

- 대상:
    - src/components/custom/report-print-shell.tsx
    - src/components/custom/patent-report-document.tsx
    - src/components/custom/patent-report-metric-page.tsx
    - src/components/custom/patent-report-reference-page.tsx
- 적용: 신규 파일 추가. 도구 막대 · 용지(ReportPrintShell · ReportSheet)와 첫 쪽 · 항목별 쪽 · 참고자료 쪽입니다.
- 영향 화면:
    - [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)

### GradeDistributionChart · ProcessFlow

- 대상:
    - src/components/custom/grade-distribution-chart.tsx
    - src/components/custom/process-flow.tsx
- 적용: 신규 파일 추가. 등급 분포 곡선과 표를 한 격자에 맞춘 그래프, 둥근 단계를 화살표로 잇는 흐름도입니다.
- 영향 화면:
    - [GradeDistributionChart 가이드](/component-guide/grade-distribution-chart)
    - [ProcessFlow 가이드](/component-guide/process-flow)
    - [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)

### 이용안내 본문과 문구

- 대상:
    - src/components/custom/service-guide.tsx
    - src/content/service/guide.ts
- 적용: 신규 파일 추가. 지원 브라우저 · 화면 확대 방법 · 접근성 안내 · 문의처로 이루어집니다.
- 영향 화면:
    - [기업 이용안내](/corp/guide)
    - [기관 이용안내](/org/guide)

### 이미지

- 대상:
    - public/images/grade-medal
    - public/images/browser
    - public/images/logo-kibo-on-dark.webp
- 적용: 신규 파일 추가. 등급 메달 아홉 장, 브라우저 아이콘과 화면 확대 안내 그림, 남색 머리글용 로고입니다.
- 영향 화면:
    - [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기업 이용안내](/corp/guide)
    - [기관 이용안내](/org/guide)

## [덮어쓰기]

### 차트 스켈레톤 스타일

- 대상: src/components/theme/chart-skeleton.variants.ts
- 적용: 지정한 파일만 교체
- 영향 화면:
    - [Skeleton 가이드](/component-guide/skeleton)
    - [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)

### [문서] 컴포넌트 가이드 신규 문서

- 대상:
    - src/app/component-guide/(guide)/grade-distribution-chart/page.tsx
    - src/app/component-guide/(guide)/process-flow/page.tsx
- 적용: 지정한 파일만 교체
- 영향 화면:
    - [GradeDistributionChart 가이드](/component-guide/grade-distribution-chart)
    - [ProcessFlow 가이드](/component-guide/process-flow)

### [문서] 컴포넌트 가이드 갱신

- 대상:
    - src/app/component-guide/(guide)/column-chart/page.tsx
    - src/app/component-guide/(guide)/skeleton/page.tsx
    - src/constants/publishing-guide.ts
- 적용: 지정한 파일만 교체. plain 변형 · 로딩과 새 스켈레톤 두 종류를 문서에 더하고, 좌측 내비에 새 문서 두 개를 넣었습니다.
- 영향 화면:
    - [ColumnChart 가이드](/component-guide/column-chart)
    - [Skeleton 가이드](/component-guide/skeleton)

### [문서] 퍼블리싱 인덱스

- 대상:
    - src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/components/custom/publishing-index.tsx
- 적용:
    - 지정한 파일만 교체
    - 기업 · 기관 '보고서' 화면(특허평가 결과 보고서)의 퍼블리싱 상태를 대기중에서 완료로 바꿉니다.
    - 탄소 로그인 · 기관회원 가입 안내 팝업 · 아이디 · 비밀번호 찾기 팝업 세 행에 응용2 상태 완료를 넣습니다(응용2팀 반영).
    - 기업 기술평가의 '평가결과 조회'(corp-technology-evaluation-results) 행을 빼고 짝이 되는 화면 경로 키도 지웁니다 — 등록 화면 수가 387건에서 386건으로 줄어듭니다.
    - 보완 행의 상태 칸을 완료 뱃지 하나로 정리하고, 옆의 시계 아이콘에 마우스를 올리거나 키보드로 이동하면 보완 회차와 꼬리말을 말풍선으로 보여 줍니다. 회차 기록과 진척률 집계 방식은 그대로입니다.
    - 상태 범례에 '보완 표시' 항목을 더하고 개발수정X 설명을 새 표기에 맞췄습니다.
- 영향 화면:
    - [퍼블리싱 인덱스](/)
