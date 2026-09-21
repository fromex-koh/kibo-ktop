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

### [기능] 헤더 메뉴 — 특허평가 · K-BIGx 보고서 링크 연결

- 대상: src/constants/header-navigation.ts
- 변경: GNB · 전체메뉴의 특허평가를 하위 메뉴 없이 특허 등급조회로 바로 잇는다(기업 · 기관 각자 경로). K-BIGx 보고서의 기업혁신성장보고서 조회와 기관 대량정보조회에 화면 경로를 건다.
- 결과: 메뉴에서 특허 등급조회 · 기업혁신성장 · 대량정보조회 화면으로 이동한다. 보고서 이력 조회는 아직 '#' 이다.
- 영향 화면:
    - [기업 홈](/corp/home)
    - [기관 홈](/org/home)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/eea2f32c)

### [컴포넌트] 레이더 차트 — 삼각 레이더 · 표시 옵션 추가

- 대상:
    - src/components/custom/comparison-radar-chart.tsx
    - src/hooks/use-is-hydrated.ts
- 변경: 색(primaryColor · comparisonColor · tickColor · gridColor), 비교 계열 모양(comparisonAppearance), 범례 모양(legendAppearance), 축 방향(direction), 꼭짓점 모양(dotAppearance), 차트 칸 크기(chartClassName), 불러오는 중(isLoading) 옵션을 더한다. 새로고침 직후(하이드레이션 전)에는 스켈레톤을 보인다.
- 결과: 옵션을 넘기지 않으면 기존 모양 그대로이고, 특허 등급조회의 세 축 레이더를 같은 컴포넌트로 그린다.
- 영향 화면:
    - [Chart 가이드](/component-guide/chart)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0a774d99)

### [컴포넌트] 차트 스켈레톤 — 등급 추이 · 삼각 레이더 모양 추가

- 대상: src/components/composite/chart-skeleton.tsx
- 변경: type 에 'grade-trend'(등급 추이 선 차트)와 'triangle-radar'(세 축 레이더)를 더한다.
- 결과: 특허 등급조회 차트가 불러오는 동안 실제 차트와 같은 짜임의 스켈레톤이 보인다.
- 영향 화면:
    - [Skeleton 가이드](/component-guide/skeleton)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5078c996)

### [컴포넌트] LoadingState — 보조 설명 옵션

- 대상: src/components/composite/loading-state.tsx
- 변경: description 옵션을 더한다. 주면 제목이 16 Bold 본문 색으로 올라가고 그 아래 14 Regular 설명이 붙는다.
- 결과: 넘기지 않으면 기존 한 줄 모양 그대로다. 대량정보조회 '처리 중' 안내에 쓴다.
- 영향 화면:
    - [LoadingState 가이드](/component-guide/loading-state)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0f70e61f)

### [컴포넌트] 파일 업로드 — 파일 한 줄 보기 · 결과 버튼 문구 옵션

- 대상:
    - src/components/composite/file-upload-field.tsx
    - src/components/composite/file-upload-result.tsx
    - src/components/custom/icon.tsx
- 변경:
    - FileUploadField: attachedView='file' 이면 올린 파일을 결과 패널 대신 파일명 + 삭제(X) 한 줄로 보인다.
    - FileUploadSuccess · FileUploadError: 되돌리기 버튼 글자(reuploadLabel), 성공 상세 가운데 정렬(isDetailsCentered) 옵션을 더한다. 오류 아이콘 느낌표를 60 배지 크기에 맞게 키운다.
    - Icon: 문자형 symbol 의 글자 크기 옵션(symbolClassName)을 더한다.
- 결과: 옵션을 넘기지 않는 기존 화면은 그대로이고, 오류 결과 패널의 느낌표만 커진다.
- 영향 화면:
    - [기관 일괄평가](/org/batch-evaluation/evaluation-history-or-batch)
    - [FileUpload 가이드](/component-guide/file-upload)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/070b2101)

## [신규 추가]

### [화면] 특허 등급조회 — 조회 · 결과 (기업 · 기관)

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/patent-evaluation/
    - src/app/(user-type)/org/(service)/(logged-in)/patent-evaluation/
    - src/components/custom/patent-grade-lookup.tsx
    - src/components/custom/patent-grade-report.tsx
    - src/components/custom/patent-grade-sections.tsx
    - src/components/custom/grade-trend-chart.tsx
    - src/components/custom/grade-radar-chart.tsx
    - src/content/service/patent-grade.ts
    - public/images/service-intro/robot-donut-chart.webp
- 적용: 신규 파일 추가
- 내용: 조회 화면은 검색 전 상태로 시작하고, 특허등록번호 · 특허출원번호(하이픈 없이도 가능)로 검색하면 같은 자리에 특허평가 결과 보고서가 나온다. 결과 화면은 목업 보고서가 보이는 상태로 시작한다. [프론트엔드 연동] 위치는 각 page.tsx · patent-grade-lookup.tsx 머리 주석에 있다.
- 영향 화면:
    - [기업 특허 등급조회](/corp/patent-evaluation/patent-grade-list)
    - [기업 특허 등급조회 결과](/corp/patent-evaluation/patent-grade-list/patent-grade-result)
    - [기관 특허 등급조회](/org/patent-evaluation/patent-grade-list)
    - [기관 특허 등급조회 결과](/org/patent-evaluation/patent-grade-list/patent-grade-result)

### [화면] K-BIGx 기업혁신성장보고서 조회 — 조회 · 케이스별 결과 (기업 · 기관)

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/innovation-growth-report/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/
    - src/components/custom/innovation-growth-report-lookup.tsx
    - src/components/custom/innovation-growth-report-screen.tsx
    - src/components/custom/k-bigx-report-sections.tsx
    - src/content/service/innovation-growth-report.ts
- 적용: 신규 파일 추가
- 내용: 기업 검색 → 기업 선택 → 그 기업의 특허 선택 → 이용횟수 안내 → [K-BIGx 보고서 출력](보고서 생성 모달). 특허 검색은 특허 목록이 바로 나온다. 특허 카드를 골라야 출력 버튼이 켜지고, 특허가 없는 기업은 기업만 골라도 켜진다. 검색 · 선택 뒤 결과 목록 · 출력 버튼으로 스크롤한다. 목업 함수 세 개(searchInnovationGrowthCompanies · getInnovationGrowthPatents · searchInnovationGrowthPatents)만 API 로 바꾸면 된다.
- 영향 화면:
    - [기업 기업혁신성장](/corp/k-bigx-report/innovation-growth-report)
    - [기업 기업 검색 결과](/corp/k-bigx-report/innovation-growth-report/search-result/company)
    - [기업 기업 선택(특허 있음)](/corp/k-bigx-report/innovation-growth-report/search-result/company/selected)
    - [기업 기업 선택(특허 없음)](/corp/k-bigx-report/innovation-growth-report/search-result/company/no-patent)
    - [기업 기업 검색 결과 없음](/corp/k-bigx-report/innovation-growth-report/search-result/company/not-found)
    - [기업 특허 검색 결과](/corp/k-bigx-report/innovation-growth-report/search-result/patent)
    - [기업 특허 검색 결과 없음](/corp/k-bigx-report/innovation-growth-report/search-result/patent/not-found)
    - [기관 기업혁신성장](/org/k-bigx-report/innovation-growth-report)

### [화면] K-BIGx 대량정보조회 — 조회 · 실패 · 완료 (기관)

- 대상:
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/bulk-data-search/
    - src/content/service/bulk-data-search.ts
- 적용: 신규 파일 추가
- 내용: 표준양식 업로드 → [조회 실행](업로드 전 · 실패 시 꺼짐) → 처리 중 → 성공이면 완료 화면([새 조회] · [결과 파일 다운로드]), 실패면 실패 화면(오류 목록 · [다시 업로드]). 업로드 · 실행 뒤 버튼 · 결과로 스크롤한다. [프론트엔드 연동] 위치는 bulk-data-search-form.tsx 머리 주석에 있다.
- 영향 화면:
    - [대량정보조회](/org/k-bigx-report/bulk-data-search)
    - [대량정보조회 실패](/org/k-bigx-report/bulk-data-search/failure)
    - [대량정보조회 완료](/org/k-bigx-report/bulk-data-search/complete)

### [컴포넌트] SelectSearchForm · SelectableInfoCard · ServiceIntroBanner

- 대상:
    - src/components/composite/select-search-form.tsx
    - src/components/composite/selectable-info-card.tsx
    - src/components/composite/service-intro-banner.tsx
- 적용: 신규 파일 추가
- 내용:
    - SelectSearchForm: 검색 기준 셀렉트 + 큰 입력 검색 카드. 기준별 형식 검사 · 안내 문구 · 도움말, 검색 중 표시, 처음 고를 기준(defaultType), 자동완성 끔.
    - SelectableInfoCard: 항목 이름 · 값 줄로 된 라디오 카드 목록. 긴 값은 카드 안에서 줄바꿈한다.
    - ServiceIntroBanner: 서비스 소개 띠(분류어 · 제목 · 설명 · [자세히보기] · 그림).
- 영향 화면:
    - [SelectSearchForm 가이드](/component-guide/select-search-form)
    - [SelectableInfoCard 가이드](/component-guide/selectable-info-card)
    - [ServiceIntroBanner 가이드](/component-guide/service-intro-banner)

## [덮어쓰기]

### [스타일] 차트 스켈레톤 스타일

- 대상: src/components/theme/chart-skeleton.variants.ts
- 적용: 지정한 파일만 교체
- 내용: 등급 추이 · 삼각 레이더 스켈레톤이 쓰는 스타일 값을 더한다.

### [문서] 컴포넌트 가이드 — 새 컴포넌트 · 옵션 반영

- 대상:
    - src/app/component-guide/(guide)/grade-trend-chart/
    - src/app/component-guide/(guide)/grade-radar-chart/
    - src/app/component-guide/(guide)/select-search-form/
    - src/app/component-guide/(guide)/selectable-info-card/
    - src/app/component-guide/(guide)/service-intro-banner/
    - src/app/component-guide/(guide)/chart/page.tsx
    - src/app/component-guide/(guide)/skeleton/page.tsx
    - src/app/component-guide/(guide)/loading-state/page.tsx
    - src/app/component-guide/(guide)/file-upload/page.tsx
    - src/app/component-guide/(guide)/accessibility-exceptions/page.tsx
    - src/constants/publishing-guide.ts
- 적용: 지정한 파일만 교체
- 내용: 새 컴포넌트 가이드 5종을 추가하고 사이드바에 연결한다. 기존 가이드에 새 옵션(차트 · 스켈레톤 · LoadingState · 파일 업로드)과 대량정보조회 케이스 표를 반영한다. 접근성 예외에 셀렉트의 숨은 native select 항목을 더한다.
- 영향 화면:
    - [GradeTrendChart 가이드](/component-guide/grade-trend-chart)
    - [GradeRadarChart 가이드](/component-guide/grade-radar-chart)
    - [FileUpload 가이드](/component-guide/file-upload)

### [문서] 퍼블리싱 인덱스 — IA V1.24 반영 · 신규 화면 등록

- 대상:
    - src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
    - src/components/custom/publishing-index.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - 기술평가 기업 · 기관 IA 를 V1.24_260908 로 올리고 IA 행 번호를 새 시트 기준으로 갱신한다. 시트에 없는 행은 민트(최신 IA 미기재), 취소선 행은 번호를 유지한다. key · 경로 · 상태는 바꾸지 않는다.
    - 신규 화면을 등록하고 완료로 표시한다: 특허 등급조회 · 결과, 기업혁신성장 조회와 조회 결과 6케이스(기업 · 기관), 대량정보조회 · 실패 · 완료.
    - 행 추가: 기관 결제 불가 팝업, 기업 K-BIGx 보고서 결제(대기중). 기관 '기술평가센터 검색'을 '기술보증기금 지점 선택'으로 바꾼다.
    - 기업 정보 이용 동의를 IA 삭제 행(주황 · 취소선)으로 표시한다. 삭제 표시 안내의 행 수를 사용자 유형별 실제 개수로 보인다.
- 영향 화면: 퍼블리싱 인덱스(시작 페이지)
