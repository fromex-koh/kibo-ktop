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

- 카드는 위에서부터 작업할 순서대로 나열했습니다. '한 번에 적용'이 적힌 카드는 함께 넣어야 빌드됩니다.

## [신규 추가]

### theme 스타일 — 정보 표의 선 · 여백 · 면 · 글자 스타일 파일 추가

- 대상: src/components/theme/info-table.variants.ts
- 적용: 신규 파일 추가
- 내용: 정보 표의 선 · 여백 · 면 · 글자 값. InfoTable 이 가져다 쓰고, ui/table 로 가로형 · 세로형 · 행/열 머리 · 값 칸 나눔 표를 그릴 때도 씁니다.
- 영향 화면: [정보 표](/component-guide/info-table)
- 함께 작업: [Diff 확인] 정보 표(InfoTable) (이어서 적용 · 함께 넘겨야 빌드됨)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/71775c54b5c39d411d40b3018c4502d7feea920b)

## [Diff 확인]

### [컴포넌트] 정보 표(InfoTable) — 스타일 값을 공용 theme 파일에서 가져오기

- 대상: src/components/composite/info-table.tsx
- 변경:
    - AS-IS: 선 · 여백 · 면 · 글자 클래스가 컴포넌트 파일 안에 직접 적혀 있음
    - TO-BE: 같은 값을 theme/info-table.variants.ts 에서 가져옴(화면 모양 그대로) · 주석을 쓰는 법 위주로 정리
- 결과: 표 모양을 바꿀 때 theme 파일 한 곳만 고치면 InfoTable 과 정보 표 유형이 함께 바뀜
- 영향 화면: [기업 K-BIGx 기업혁신성장 보고서](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [정보 표](/component-guide/info-table)
- 함께 작업: [신규 추가] theme 스타일 — 정보 표 스타일 파일 (바로 위 카드, 먼저 추가)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c5c6b2dc5d2300717b691fe7ba18ddc61e277282)

## [덮어쓰기]

### theme 스타일 — 라디오 칩 비활성

- 대상: src/components/theme/radio-chip.variants.ts
- 적용: 지정한 파일만 교체
- 내용:
    - AS-IS: 비활성(disabled) 모양이 없어 미선택과 똑같이 보임
    - TO-BE: 비활성 = 회색 면 · 회색 테두리 · 흐린 글자 · 마우스를 올려도 그대로 / 선택 · 비활성 = 테두리 한 단계 진하게 + 제목 굵게
    - 지금 쓰는 화면(기관 일괄평가 진행할 업무 선택)은 비활성 칩이 없어 모양이 바뀌지 않음
- 영향 화면: [라디오 칩](/component-guide/radio-chip)
- 함께 작업: [Diff 확인] 라디오 칩(RadioChip) 주석 정리
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5db5e3bd573c4f9383d9788b451ac3eac5cfcb23)

## [Diff 확인]

### [컴포넌트] 라디오 칩(RadioChip) — 주석 정리

- 대상: src/components/composite/radio-chip.tsx
- 변경: 주석만 정리(언제 쓰나 · 상태 지정 방법 · 접근성 · 주의) — 코드 · 화면 그대로
- 결과: 선택 · 비활성을 어떻게 지정하는지 파일에서 바로 보임
- 영향 화면: [라디오 칩](/component-guide/radio-chip)
- 함께 작업: [덮어쓰기] theme 스타일 — 라디오 칩 비활성
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/222b696fbcea02db962da0e5f2362efaded30271)

### [컴포넌트] 판매자 정보 모달 — [닫기] 버튼을 primary 스타일(파랑)로 변경

- 대상: src/components/composite/seller-info-dialog.tsx
- 변경:
    - AS-IS: [닫기] 가 tertiary 스타일 버튼(흰 바탕 · 회색 테두리)
    - TO-BE: [닫기] 가 primary 스타일 버튼(파란 바탕 · 흰 글자) — 크기 · 폭은 그대로
- 결과: 이 모달의 하나뿐인 버튼이 파란 primary 버튼으로 보임
- 영향 화면: [기업 결제하기](/corp/pricing/payment)
    - [판매자 정보](/corp/pricing/payment/seller-info)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a35a6084d45c201db38c9989aa466fc7e6bfde90)

### [컴포넌트] 이용안내 — 브라우저 확대 메뉴 캡처를 화면 크기에 맞게 받기

- 대상: src/components/custom/service-guide.tsx
- 변경:
    - AS-IS: sizes 가 없어 화면에 588px 로 보이는 캡처를 원본 기준 1920px(2배 모니터 3840px)로 받음
    - TO-BE: sizes 추가 — 일반 모니터 640px · 2배 모니터 1200px 로 받음(화면 모양 · 선명도 그대로)
- 결과: 같은 화면에서 내려받는 이미지 용량이 크게 줄어듦
- 영향 화면: [기업 이용안내](/corp/guide)
    - [기관 이용안내](/org/guide)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/7010121d09c5a72cb6ff45c18fdc92fc7048bbe2)

## [신규 추가]

### [화면] 기관 K-BIGx 보고서 — 따로 있던 기업혁신성장 · 대량정보조회 화면을 한 화면으로 합칠 틀 · 탭 추가

- 대상: src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/org-kbigx-report-screen.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/org-kbigx-report-tabs.tsx
- 적용: 신규 파일 추가
- 내용:
    - OrgKbigxReportScreen: 기관 K-BIGx 보고서의 [기업혁신성장] · [대량정보조회] 두 기능을 한 화면에 담는 틀(제목 · 소개 띠 + 탭)
    - OrgKbigxReportTabs: 탭마다 주소가 붙은 알약 탭 — 탭을 누르면 주소가 바뀌고, 주소로 들어오면 그 탭이 켜짐
    - 사용법 · 코드는 탭 가이드의 '주소와 연결된 탭' 예시에 있음
- 영향 화면: [기관 기업혁신성장](/org/k-bigx-report/innovation-growth-report)
    - [기관 대량정보조회](/org/k-bigx-report/bulk-data-search)
    - [탭 — 주소와 연결된 탭 예시](/component-guide/tabs#tabs-examples)
- 함께 작업: [Diff 확인] 기업혁신성장 · 대량정보조회 화면을 한 화면으로 합침 (바로 아래 카드, 이어서 적용)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/9fe3e3515b46879c98faf134c5798897be1a8a0f)

## [Diff 확인]

### [화면] 기관 K-BIGx 보고서 — 따로 있던 기업혁신성장 · 대량정보조회 화면을 탭이 있는 한 화면으로 합침

- 대상: src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/selected/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/no-patent/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/not-found/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/patent/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/patent/not-found/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/bulk-data-search/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/bulk-data-search/complete/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/bulk-data-search/failure/page.tsx
    - src/components/custom/innovation-growth-report-lookup.tsx
    - src/components/custom/innovation-growth-report-screen.tsx
- 변경:
    - AS-IS: 기업혁신성장 조회 · 대량정보조회가 서로 다른 화면
    - TO-BE: 한 화면에 [기업혁신성장] [대량정보조회] 탭(알약 탭) — 제목 · 소개 띠([자세히보기] 포함)는 두 탭 공통
    - 주소는 그대로 남음: 각 주소로 들어오면 그 탭이 켜진 채로 열림(헤더 메뉴 · 퍼블리싱 인덱스 그대로)
    - 탭을 누르면 주소도 그 탭 주소로 바뀜 · 뒤로 가기 · 헤더 메뉴로도 탭이 따라 켜짐
    - 페이지 10개는 새 화면 컴포넌트(OrgKbigxReportScreen)를 그리도록 바뀜 · 퍼블리싱 확인용 처음 상태만 넘김
    - innovation-growth-report-lookup: intro 를 넘기지 않으면 바깥 틀 없이 본문만 그림(탭 안에 넣기 위해 · 기업 화면은 그대로)
- 결과: 기관은 한 화면에서 탭으로 두 기능을 오감
- 영향 화면: [기관 기업혁신성장](/org/k-bigx-report/innovation-growth-report)
    - [기관 대량정보조회](/org/k-bigx-report/bulk-data-search)
- 함께 작업: [신규 추가] 기업혁신성장 · 대량정보조회를 합칠 틀 · 탭 (바로 위 카드, 먼저 추가)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e3d6b6fccf147322f9138071af4f6666f64aa873)

## [신규 추가]

### [에셋] 특허 보고서 머리글 로고(svg)

- 대상: public/images/logo-kibo-on-dark.svg
- 적용: 신규 파일 추가
- 내용: 남색 머리글 전용 로고(연두 상자)
- 함께 작업: [Diff 확인] 특허 보고서 머리글 로고 (이어서 적용)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/90632dd1da587b79175c5691efd4afb1eb51a22e)

## [Diff 확인]

### [이미지교체] 특허 보고서 머리글 로고 — webp → svg

- 대상: src/components/custom/patent-report-document.tsx
- 변경: 머리글 로고를 logo-kibo-on-dark.webp → logo-kibo-on-dark.svg 로 교체(디자인 · 크기 그대로)
- 결과: 인쇄 · 확대해도 로고가 선명함
- 영향 화면: [기업 특허평가 결과 보고서](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)
- 함께 작업: [신규 추가] 특허 보고서 머리글 로고(svg) (먼저 추가)
    - [삭제] logo-kibo-on-dark.webp (적용 후 삭제)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/afb6e64879a23b73a6bc2e708182800ab3f13951)

### [이미지교체] 일괄평가 Tech-Index 선택 — 카드 그림

- 대상: src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/batch-evaluation-form.tsx
- 변경:
    - (일반) 카드: shield-certificate.webp → rocket-growth.webp(95×92)
    - (창업) 카드: lightbulb-magnifier.webp → building-lightbulb.webp(136×100)
    - 그림 크기: 148×100 에 늘려 넣음 → 148×100 자리 가운데에 원본 비율대로
- 결과: 기업 · 기관 Tech-Index 선택 화면과 같은 그림 · 배치
- 영향 화면: [기관 Tech-Index 선택](/org/batch-evaluation/tech-index-selection)
- 함께 작업: [삭제] shield-certificate.webp · lightbulb-magnifier.webp (적용 후 삭제)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/480ac4489003b7a1189f8871eab345c8b00e8d51)

### [컴포넌트] 결제하기 — [이용약관] 버튼이 K-BIGx 이용약관으로 열리도록 수정

- 대상: src/components/custom/pricing-payment.tsx
- 변경:
    - AS-IS: [이용약관] 링크가 /corp/terms → 기술평가 이용약관 탭이 먼저 열림
    - TO-BE: /corp/terms/k-bigx → K-BIGx 이용약관 탭이 선택된 채로 열림(새 창 그대로)
- 결과: 결제 화면에서 이용권(K-BIGx)에 맞는 약관이 바로 보임
- 영향 화면: [기업 결제하기](/corp/pricing/payment)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/176f3f221f1dab44d30e367aca807dce040f56ed)

## [신규 추가]

### [컴포넌트] TitleDetailTable — 제목 · 상세 두 줄 목록 표 컴포넌트 추가

- 대상: src/components/composite/title-detail-table.tsx
- 적용: 신규 파일 추가
- 내용: 한 건을 제목 줄(전체 폭) + 상세 줄(들여 쓴 칸 뒤 열마다 값)로 보이는 표. 특허 목록처럼 제목이 길고 상세 값이 여럿일 때 씁니다(한 대상의 항목: 값이면 InfoTable).
- 영향 화면: [제목 · 상세 표](/component-guide/title-detail-table)
- 함께 작업: [덮어쓰기] 컴포넌트 가이드 (제목 · 상세 표 가이드가 사용)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2b4b8c25ccb52371e449c9432ef1e676ad901990)

## [덮어쓰기]

### theme 스타일 — 스위치 켜짐 간격

- 대상: src/components/theme/switch.variants.ts
- 적용: 지정한 파일만 교체
- 내용: 켜졌을 때 손잡이와 트랙 끝 간격이 3px 로 좁던 것을 꺼짐과 같은 5px 로 맞춤(lg · md · sm 모두)
- 영향 화면: [스위치](/component-guide/switch)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6f1f8a4cd129911131a1df39bda912d5d2423079)

### [이미지교체] 메인페이지 첫 화면 배경

- 대상: public/images/main-hero/hero-bg-1.webp
    - public/images/main-hero/hero-bg-2.webp
- 적용: 지정한 파일만 교체(이름 · 경로 그대로라 코드 수정 없음)
- 내용: 5760×3240 → 3840×2160(next/image 최대 폭) · 용량 1.1MB → 376KB, 333KB → 91KB
- 영향 화면: [기업 홈](/corp/home)
    - [기관 홈](/org/home)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/bce589519b43ceb354e8696632ee7628ed35547a)

## [신규 추가]

### [에셋] K-BIGx 인쇄본 표지 · 목차 그림 4개 추가

- 대상: public/images/report/kbigx-cover.webp
    - public/images/report/kbigx-toc.webp
    - public/images/report/kbigx-toc-star-large.svg
    - public/images/report/kbigx-toc-star-small.svg
- 적용: 신규 파일 추가
- 내용: 인쇄본 표지 그림 · 목차 그림 · 목차 제목 옆 별 두 개(svg). 코드 수정 없이 파일만 넣습니다.
- 영향 화면: [이미지](/component-guide/image)
- 함께 작업: 아래 'K-BIGx 인쇄본 쪽 · 부품' · 컴포넌트 가이드가 이 그림을 씀
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a9f40d18337501d9dfac155c30635030716fe12d)

### [서비스 데이터] 현금흐름등급표(CF1 ~ CF6 이름 · 설명) 파일 추가

- 대상: src/content/service/cash-flow-grades.ts
- 적용: 신규 파일 추가
- 내용: 현금흐름등급 CF1 ~ CF6 의 이름(우수 ~ 부실)과 설명을 담은 표, 그리고 등급 코드로 찾는 함수가 든 새 파일입니다. 웹 보고서 신용/재무정보 · 인쇄본 진단브리핑 · 인쇄본 참고자료가 모두 이 표에서 이름 · 설명을 가져옵니다.
- 함께 작업: 아래 K-BIGx 웹 보고서 카드 · 인쇄본 쪽 · 부품이 이 파일을 씀
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/70b6ce25056268ecade6aadabb63e61f8c544b92)

### [컴포넌트] 인쇄본용 차트 14종과 불러오는 중 모양(스켈레톤) 추가

- 대상: src/components/custom/callout-pie-chart.tsx
    - src/components/custom/combo-value-chart.tsx
    - src/components/custom/distribution-value-chart.tsx
    - src/components/custom/donut-list-chart.tsx
    - src/components/custom/dual-bar-table.tsx
    - src/components/custom/dual-line-chart.tsx
    - src/components/custom/inside-label-pie-chart.tsx
    - src/components/custom/marker-line-chart.tsx
    - src/components/custom/nested-column-chart.tsx
    - src/components/custom/rank-bar-list.tsx
    - src/components/custom/rating-trend-chart.tsx
    - src/components/custom/score-scale-bar.tsx
    - src/components/custom/value-column-chart.tsx
    - src/components/custom/value-line-chart.tsx
    - src/components/composite/callout-pie-chart-skeleton.tsx
    - src/components/composite/combo-value-chart-skeleton.tsx
    - src/components/composite/distribution-value-chart-skeleton.tsx
    - src/components/composite/donut-list-chart-skeleton.tsx
    - src/components/composite/dual-bar-table-skeleton.tsx
    - src/components/composite/dual-line-chart-skeleton.tsx
    - src/components/composite/inside-label-pie-chart-skeleton.tsx
    - src/components/composite/marker-line-chart-skeleton.tsx
    - src/components/composite/nested-column-chart-skeleton.tsx
    - src/components/composite/rank-bar-list-skeleton.tsx
    - src/components/composite/rating-trend-chart-skeleton.tsx
    - src/components/composite/score-scale-bar-skeleton.tsx
    - src/components/composite/value-column-chart-skeleton.tsx
    - src/components/composite/value-line-chart-skeleton.tsx
- 적용: 신규 파일 추가
- 내용: K-BIGx 인쇄본에 들어가는 차트 14종과, 차트마다 같은 크기로 보이는 불러오는 중 모양(스켈레톤)이 든 새 파일들입니다. 색 · 크기를 props 로 받아 웹 화면에서도 쓸 수 있고, 사용법은 차트마다 가이드에 있습니다.
- 영향 화면: 각 차트 가이드(컴포넌트 가이드 > 차트)
- 함께 작업: 아래 인쇄본 쪽 · 부품 · 컴포넌트 가이드가 이 차트를 씀
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/07956a64df2ea45d774e47c4e60d8dcaea42e6e3)

### [유틸] 인쇄본을 새 탭으로 열어 바로 인쇄하는 함수 추가

- 대상: src/lib/open-report-print-tab.ts
- 적용: 신규 파일 추가
- 내용: [출력하기]를 누르면 인쇄본을 새 탭으로 여는 함수가 든 새 파일입니다. 새 탭은 열리자마자 인쇄 창을 띄우고, 브라우저가 팝업을 막으면 지금 탭에서 엽니다. 특허평가처럼 숨긴 프레임으로 인쇄하지 않는 이유(Safari 에서 빈 쪽이 나옴)는 파일 주석에 있습니다.
- 함께 작업: 아래 인쇄 화면 틀 · K-BIGx 웹 보고서 카드가 이 파일을 씀
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/cc672d4baa1cb5dfd915b0ac0b1c750352d2398f)

### [서비스 데이터] 인쇄본 쪽 순서 · 쪽 번호 · 목차를 만드는 파일 추가

- 대상: src/content/service/k-bigx-print-report.ts
    - src/content/service/k-bigx-print-measure.ts
- 적용: 신규 파일 추가
- 내용: 모달에서 고른 장으로 몇 쪽을 어떤 순서로 찍을지 · 쪽 번호 · 목차 번호를 정하는 새 파일입니다(표지 · 목차 · 참고자료 · 뒷표지는 늘 들어감). 긴 표가 한 쪽에 몇 줄 들어가는지는 글자 수로 미리 계산합니다. 기업 · 기관 인쇄본 주소와 주소 만드는 함수(getKbigxPrintHref)도 여기 있습니다.
- 함께 작업: 아래 K-BIGx 웹 보고서 · 인쇄본 쪽 · 부품 카드가 이 파일을 씀
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/99af92f39aa800ca8d7a5191535ce0df2ba6c7c3)

## [Diff 확인]

### [데이터] CRI 등급표 — 신용등급의 5단계(우수 ~ 취약)를 알려 주는 함수 추가

- 대상: src/content/service/cri-grades.ts
- 변경:
    - 함수 추가(getCriGradeTone): 신용등급(예: BBB0)을 넣으면 우수 · 양호 · 보통 · 미흡 · 취약 중 어느 단계인지 돌려줌 — 유보 · 평가 제외처럼 단계가 없는 등급은 undefined
    - 기존 등급표 · 기존 함수: 바뀐 것 없음
- 결과: 인쇄본 진단브리핑의 기업신용등급 배지가 등급에 따라 혁신성장역량지수와 같은 5단계 색으로 칠해짐 · 웹 보고서는 이 함수를 쓰지 않아 그대로
- 영향 화면: [기업 K-BIGx 보고서 출력](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [기관 K-BIGx 보고서 출력](/org/k-bigx-report/innovation-growth-report/report-print)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/34caaed80a4c874d246ddd01a173f07d942e1259)

### [컴포넌트] 비공개 가림(PrivateContent) — 흐리게 깔리는 가짜 값을 공용으로 내보내기 추가

- 대상: src/components/composite/private-content.tsx
- 변경:
    - 상수 추가(PRIVATE_PLACEHOLDER): 비공개 칸 뒤에 흐리게 깔리는 가짜 값(0000-00-00 · 000,000 · 연도 · 비중 · 금액 등)을 한 곳에 모아 내보냄
    - 기존 PrivateContent · PrivateCell: 바뀐 것 없음
- 결과: 웹 보고서와 인쇄본이 같은 가짜 값을 씀 → 가짜 값을 바꿀 때 이 파일 하나만 고치면 됨(화면 모양 그대로)
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 보고서 결과](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [비공개 가림](/component-guide/private-content)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c7cdea6cfd2c1d79a25b6397b62834ad7f4e8d01)

### [컴포넌트] 레이더 차트(ComparisonRadarChart) — 인쇄본용 옵션 추가(웹 모양 그대로)

- 대상: src/components/custom/comparison-radar-chart.tsx
- 변경:
    - 옵션 추가: 고정 크기로 그리기 · 축 이름 옆에 값 함께 적기 · 축 이름과의 거리 · 선 굵기 · 점선 간격 · 꼭짓점 점 크기 · 비교 면 색 → 넘기지 않으면 지금 모양 그대로
    - 데이터 항목 추가(primaryValueText): 값이 없는 지표는 축 이름 옆에 숫자 대신 '-' 같은 글자를 적을 수 있음
    - 동작 끔: 키보드로 차트 점을 하나씩 도는 recharts 기능을 끔 → 값은 지금처럼 화면에 안 보이는 표가 화면 낭독기에 읽어 줌(마크업 검사 경고가 없어짐)
- 결과: 웹 보고서 레이더는 지금과 똑같이 보이고, 인쇄본은 같은 차트에 옵션만 넘겨 씀
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 보고서 결과](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [비교 레이더 차트](/component-guide/comparison-radar-chart)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/680c9e423a4fe5f6d4eb910114abceaf08cb46ec)

### [컴포넌트] 인쇄 화면 틀(ReportPrintShell) — 안내 문구 옵션 추가 · 인쇄 후 새 탭 자동 닫기

- 대상: src/components/custom/report-print-shell.tsx
    - src/components/custom/report-theme-scope.tsx
- 변경:
    - 안내 문구(옵션 추가): 지금은 인쇄 화면 위쪽 안내 문구가 특허평가 문구로 고정 → notice 로 다른 문구를 넣거나, null 을 넣어 안내 줄을 없앨 수 있음(안 넣으면 지금 문구 그대로)
    - 인쇄 후 탭 닫기(동작 추가): [보고서 출력]이 새 탭으로 연 인쇄본은 인쇄를 끝내거나 취소하면 그 탭이 저절로 닫힘 → 사용자가 원래 보고서 탭으로 바로 돌아옴(특허평가 인쇄는 탭을 새로 열지 않아 해당 없음)
    - 태그만 변경: 위쪽 도구 막대를 header, 보고서 영역을 main 태그로 바꿈 → 화면 낭독기 사용자가 영역 단위로 건너뛸 수 있음(화면 모양은 그대로)
    - 다크 모드 예외(report-theme-scope): 인쇄 화면(주소가 …/report-print)은 앱이 다크여도 종이처럼 흰 바탕으로 보임
- 결과: 특허평가 보고서 인쇄는 지금과 똑같이 동작하고, K-BIGx 인쇄본도 같은 인쇄 화면 틀을 함께 씀
- 영향 화면: [기업 특허평가 결과 보고서(인쇄용)](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기관 특허평가 결과 보고서(인쇄용)](/org/patent-evaluation/patent-grade-list/patent-grade-result/report)
    - [기업 K-BIGx 보고서 출력](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [기관 K-BIGx 보고서 출력](/org/k-bigx-report/innovation-growth-report/report-print)
- 함께 작업: 위 '인쇄본을 새 탭으로 여는 함수'를 먼저 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1d2bfcb0e99be44e83bb816139659dc1515ad8fe)

### [스타일] 인쇄용 보고서 CSS — Safari 에서 목차가 아래로 밀리던 문제 수정

- 대상: src/styles/report-print.css
- 변경:
    - 문제 수정: Safari 로 인쇄하면 목차 목록이 아래로 밀려, 마지막 줄(참고자료)이 아래 유의사항 상자에 가려지는 경우가 있었음 → Safari 가 용지 안쪽까지 쪽을 나누며 목록을 밀어내던 것을 막음(K-BIGx 인쇄본 용지에만 contain: strict 추가)
    - 주석만 변경: 파일 머리 사용처에 K-BIGx 인쇄본 추가
- 결과: Chrome · Safari 모두 목차가 위에 붙고 참고자료 줄까지 보임 · 특허평가 보고서 인쇄는 영향 없음
- 영향 화면: [기업 K-BIGx 보고서 출력](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [기관 K-BIGx 보고서 출력](/org/k-bigx-report/innovation-growth-report/report-print)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2a503356e144ef3d6db56a02b77df1772c88e83c)

### [데이터] K-BIGx 보고서 목업 — 현금흐름등급 CF 표기로 변경 · 인쇄본에 필요한 값 추가

- 대상: src/content/service/k-bigx-innovation-report.ts
- 변경:
    - 표기 변경: 현금흐름등급 코드 'CR-6' → 'CF6'(평가이력 포함) — 인쇄본 참고자료 등급 정의와 같은 표기
    - 항목 삭제: 현금흐름등급 설명 문장(summary) → 이제 등급 코드만 받으면 화면이 현금흐름등급표에서 설명을 찾아 보여 줌
    - 항목 추가: 현금흐름등급 평가일자 · 결산일자(details — 인쇄본 등급 박스) · 이력마다 그래프 아래 시점 글자(chartLabel, 예: 24.11월)
    - 항목 추가: 담보 현황 기준 연도(collateralYear — 인쇄본 도넛 아래 '2024년 기준')
    - 함수 추가: 최근 3개년 연도 만들기(getRecentYears 등) — 받지 못한 연도는 화면이 '-' 로 그림(인적자원 · 에너지 사용 현황)
    - 타입 변경: 관련 기업 · 특허 수치와 평균 특허수는 값을 못 받으면 null — 화면이 '-' 로 적어 실제 0건과 구분
    - 문구 변경: 영업이익율 → 영업이익률 · 기술 보유현황 설명 소분류 → 세부분야 · R&D 안내 끝 '(정보가 없을 경우 ‘-’ 표시)' 삭제
    - 목업 값만 변경: 거래처 10건으로 늘림(인쇄본 10행 표 확인용) · 유사 기업 이름 기업1 ~ 10 → (주)비상 같은 회사 이름 · 기업신용정보 3개 표에 비공개 케이스 확인용 행 1줄씩(연동 후 API 값으로 바뀜)
- 결과: 웹 보고서와 인쇄본이 이 파일 하나에서 데이터를 받음 · 연동 시 현금흐름등급은 CF 코드 · 평가일자 · 결산일자 · 이력 시점을 받고, 설명 문장은 받지 않으면 됨
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 보고서 결과](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기업 K-BIGx 보고서 출력](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [기관 K-BIGx 보고서 출력](/org/k-bigx-report/innovation-growth-report/report-print)
- 함께 작업: 한 번에 적용: 바로 아래 K-BIGx 웹 보고서 카드 — 이 파일만 먼저 넣으면 웹 보고서가 지운 설명 문장(summary)을 찾다가 빌드 오류가 남
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0dde24040ff7f027ebac381698da360532444a9e)

### [컴포넌트] K-BIGx 웹 보고서 — 현금흐름등급 · 세부분야 · 빈 값 표시 변경 · [보고서 출력] 버튼 동작 추가

- 대상: src/components/custom/innovation-growth-report-document.tsx
    - src/components/custom/innovation-growth-report-credit.tsx
    - src/components/custom/innovation-growth-report-tech.tsx
    - src/components/custom/innovation-growth-report-tech-index.tsx
    - src/components/custom/innovation-growth-report-page.tsx
    - src/components/custom/grade-scale-gauge.tsx
    - src/components/custom/gauge-tone-table.tsx
    - src/app/(user-type)/corp/(report)/k-bigx-report/innovation-growth-report/diagnostic-briefing/page.tsx
    - src/app/(user-type)/org/(report)/k-bigx-report/innovation-growth-report/diagnostic-briefing/page.tsx
    - src/components/composite/k-bigx-print-output-selection-dialog.tsx
    - src/content/service/k-bigx-print-output-selection.ts
- 변경:
    - 동작 추가([보고서 출력] 버튼): 지금은 눌러도 아무 일이 없음 → 인쇄 출력물 선택 모달이 열리고, [출력하기]를 누르면 고른 장만 담은 인쇄본이 새 탭에서 바로 인쇄 창을 띄움(인쇄가 끝나면 탭이 닫힘)
    - 연결 방법: 기업 · 기관 보고서 page.tsx 가 자기 인쇄본 주소를 printPath 로 넘김 → 안 넘기면 지금처럼 동작 없는 버튼
    - 모달 동작 변경(인쇄 출력물 선택): [출력하기]를 누르면 닫힘 · 다시 열면 지난번 체크가 남지 않고 처음 상태 · 위쪽 기업명 · 조회기준일은 보고서 값으로 채움(toPrintOutputSummary)
    - 표시 방법 변경(신용/재무정보 현금흐름등급): 게이지 칸 이름(CF6 ~ CF1) · 양 끝 이름(부실 · 우수) · 아래 설명 상자를 현금흐름등급표에서 가져옴 → 표에 없는 코드가 오면 설명 상자를 숨김
    - 문구 변경: 소분류 → 세부분야(기업 보유기술 카드 '세부분야 기준' · 차트 이름 · 이머징 기술 · R&D 이슈 설명 · R&D 전문기관 각주 · 불러오는 중 문구)
    - 빈 값 표시 추가(기술혁신정보): 수치 · 평균 특허수 값이 없으면 단위 없이 '-' → 실제 0건과 구분됨
    - 빈 값 표시 추가(Tech-Index): 점수가 없으면 요약 문장 대신 '평가 점수가 없습니다.'
    - 가져오는 곳만 변경: 신용/재무정보 비공개 가짜 값을 공용 PRIVATE_PLACEHOLDER 에서 가져옴(화면 모양 그대로)
    - 주석만 변경: 게이지 · 등급표 파일의 등급 예시 CR → CF
- 결과: 기업 · 기관 모두 웹 보고서에서 원하는 장만 골라 인쇄 · 현금흐름등급 이름 · 설명이 인쇄본 참고자료와 같은 표에서 나옴 · 값이 없을 때 '-' 로 보임
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 보고서 결과](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기업 인쇄 출력물 선택](/corp/k-bigx-report/innovation-growth-report/print-output-selection)
    - [기관 인쇄 출력물 선택](/org/k-bigx-report/innovation-growth-report/print-output-selection)
- 함께 작업: 한 번에 적용: 바로 위 목업
    - 현금흐름등급 칸 색(cash-flow-cf)은 아래 디자인 토큰을 넣어야 보임(빌드는 됨)
    - [출력하기]로 열리는 인쇄본 화면은 아래 '보고서 출력 화면' 카드에서 추가됨(빌드는 됨)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b40e51fd1f023c8fa5635e9e9e15a13cde586f37)

## [신규 추가]

### [컴포넌트] K-BIGx 인쇄본 쪽 · 부품 파일 추가

- 대상: src/components/custom/kbigx-print-page.tsx
    - src/components/custom/kbigx-print-document.tsx
    - src/components/custom/kbigx-print-parts.tsx
    - src/components/custom/kbigx-print-page-body.tsx
    - src/components/custom/kbigx-print-page-placeholder.tsx
    - src/components/custom/kbigx-print-preparing.tsx
    - src/components/custom/kbigx-print-format.ts
    - src/components/custom/kbigx-print-fit-value.tsx
    - src/components/custom/kbigx-print-cover.tsx
    - src/components/custom/kbigx-print-briefing.tsx
    - src/components/custom/kbigx-print-company.tsx
    - src/components/custom/kbigx-print-innovation.tsx
    - src/components/custom/kbigx-print-tech-index.tsx
    - src/components/custom/kbigx-print-credit.tsx
    - src/components/custom/kbigx-print-activity.tsx
    - src/components/custom/kbigx-print-reference.tsx
- 적용: 신규 파일 추가
- 내용:
    - 페이지 본문(kbigx-print-page): 보고서 조회 · 고른 장 · 자동 인쇄 — 기업 · 기관 화면이 함께 씀
    - 쪽 틀 · 공용 부품(kbigx-print-document · parts · page-body · page-placeholder · fit-value · format): 머리말 · 바닥글 · 표 · 범례 · 등급 알약 · 비공개 가림 · 숫자 표기 규칙
    - 장별 쪽(cover · briefing · company · innovation · tech-index · credit · activity · reference): 표지 · 목차 · 진단브리핑 ~ 활동성정보 · 참고자료 · 뒷표지
    - 인쇄 준비 안내(kbigx-print-preparing): 인쇄 창이 뜰 때까지 화면을 덮는 안내
    - 색 · 글자 · 간격은 인쇄본 전용 kbx 토큰만 씀(아래 디자인 토큰 카드)
- 영향 화면: [기업 K-BIGx 보고서 출력](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [기관 K-BIGx 보고서 출력](/org/k-bigx-report/innovation-growth-report/report-print)
    - [리포트 공통](/component-guide/report-shell)
- 함께 작업: 인쇄본 색 · 글자 크기는 아래 디자인 토큰을 넣어야 제대로 보임(빌드는 됨)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c18f0260672ee1460ee070e9e0bc183cd4261fa9)

### [화면] K-BIGx 보고서 출력 화면(기업 · 기관) 추가

- 대상: src/app/(user-type)/corp/(report)/k-bigx-report/innovation-growth-report/report-print/page.tsx
    - src/app/(user-type)/org/(report)/k-bigx-report/innovation-growth-report/report-print/page.tsx
- 적용: 신규 파일 추가
- 내용: 기업 · 기관 인쇄본 화면 파일 2개입니다. 둘 다 같은 페이지 본문(kbigx-print-page.tsx)을 그려서, 인쇄본을 고치면 두 화면이 함께 바뀝니다. 주소에 ?sections= 로 찍을 장, ?case= 로 비공개 케이스를 골라 볼 수 있습니다.
- 영향 화면: [기업 K-BIGx 보고서 출력](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [기관 K-BIGx 보고서 출력](/org/k-bigx-report/innovation-growth-report/report-print)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2893e7d268015cb86805234f25c49db010378dcb)

## [덮어쓰기]

### 디자인 토큰 — 인쇄본 전용 토큰 추가 · 현금흐름등급 토큰 이름 cr → cf 변경

- 대상: tokens.json
    - scripts/build-tokens.mjs
- 적용: 두 파일을 교체한 뒤 yarn tokens 로 src/app/tokens.css 를 다시 만듭니다.
- 내용:
    - 토큰 추가(kbigxPrint): 인쇄본 전용 색 · 글자 크기 · 간격 등 → 인쇄본 상자(.kbigx-print) 안에서만 값이 있어 다른 화면에는 영향 없음 · 클래스 이름에 모두 kbx 가 붙음(예: text-kbx-primary)
    - 색 추가: 인쇄본 전용 색 23개(extra) — 인쇄본 토큰만 참조
    - 색 추가: 미리 섞은 옅은 등급 색(grade-*-fill) — 투명도를 쓰지 않아 Chrome · Safari 인쇄 색이 같게 나옴
    - 이름 변경: cash-flow-cr-1 ~ 6 → cash-flow-cf-1 ~ 6(등급 표기 CF 에 맞춤) → 이 이름을 쓰던 웹 보고서 · 가이드도 이번 카드들에서 함께 바뀜
    - 생성기 변경(build-tokens.mjs): 위 인쇄본 토큰 · 섞은 색을 tokens.css 로 만들어 줌
- 함께 작업: 한 번에 적용: 바로 아래 컴포넌트 가이드 — 토큰만 먼저 넣으면 이름이 바뀐 cash-flow-cr 을 쓰던 시맨틱 색상 가이드가 빌드 오류
    - 넣은 뒤 yarn tokens 실행 — 인쇄본 · 현금흐름등급 색이 이때부터 보임
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/afdbd653ca08837a51fe1a2a2399dff56f662687)

### [문서] 컴포넌트 가이드 — 새 가이드 추가(차트 14종 · 차트 등장 · 이미지 등) · 기존 가이드 내용 정리

- 대상: src/app/component-guide/(guide) 폴더 전체
    - src/app/component-guide/(demo)/self-diagnosis/evaluation-model/page.tsx
    - src/constants/publishing-guide.ts
    - src/components/custom/component-layer-badge.tsx
- 적용: (guide) 폴더 전체와 나머지 세 파일을 덮어쓰기
- 내용:
    - 신규 가이드: 이미지 · 제목 · 상세 표 · 우편번호 검색 · 검색 선택 모달 · 리포트 공통
    - 가이드 홈 · 모션 · Open Graph: 번호 단계로 다시 정리 · 내용 간결하게
    - 다이얼로그: 완성된 모달 8종 표 · 데모
    - 탭: 주소와 연결된 탭 예시 · pill-outline 쓰는 곳
    - 아이콘 · 옵션 카드 · 라디오 카드 · 자가진단 목업 · 서비스 소개 띠: 서비스에서 쓰는 그림으로 교체
    - 전체: 섹션 설명이 카드 폭을 끝까지 쓰도록 폭 제한 해제
    - 다이얼로그 · 폼 탭 · 파일 업로드 · 시맨틱 색상 · 세그먼트 컨트롤 · 문항 목록 · 네트워크 그래프: 번호 단계(1. / 1-1.) 적용
    - 접근성 섹션 추가: 기본 카드 · 라벨 · 문항 그룹 헤더 · 리포트 공통
    - 설명 문장 정리: 대시(—) 문장을 일반 문장 · 목록으로(접근성 검사 예외사항 · 워드 클라우드 · z-index · 아이콘 · 홈 공지 팝업) · 첫 설명이 긴 5개 한 문장으로
    - 정보 표: 표 유형 4가지(가로형 · 세로형 · 행/열 머리 · 값 칸 나눔) 데모 · 코드 · 스타일 상수 표 추가
    - 체크박스 · 라디오: 상태 표에 비활성 열 추가(미선택 · 선택 · 부분 선택 각각) · 표에 생기던 스크롤 제거
    - 라디오 칩: 상태 섹션 추가(미선택 · 선택 × 기본 · 비활성)
    - 신규 가이드(K-BIGx 인쇄본): 보고서 차트 14종 · 차트 등장(ChartReveal)
    - 리포트 공통: K-BIGx 인쇄본 토큰 · 파일 구성 · 쪽 부품 · 규칙(한 쪽 맞춤 · 빈 값 · 옅은 색 등) · 인쇄 흐름
    - 가이드 홈 · 가이드 제목 옆: bigx print template 배지(인쇄본에서 쓰는 컴포넌트 표시 · 목록)
    - 색상 · 시맨틱 색상: 인쇄본 전용 색 · 섞은 색 · cash-flow-cf 이름
    - 기존 차트 가이드(막대 · 선 · 도넛 · 진행 막대 등): 비슷한 인쇄본 차트 안내 링크
    - 등급 척도 게이지 · 비공개 가림 · 이미지 · 모션 · 등급 매트릭스: 현금흐름 CF · 인쇄본 사용처 · 영업이익률
- 영향 화면: [컴포넌트 가이드 홈](/component-guide)
    - [이미지](/component-guide/image)
    - [정보 표](/component-guide/info-table)
    - [체크박스](/component-guide/checkbox)
    - [라디오](/component-guide/radio)
    - [라디오 칩](/component-guide/radio-chip)
    - [리포트 공통](/component-guide/report-shell)
- 함께 작업: [신규 추가] TitleDetailTable · 특허 보고서 머리글 로고(svg) · theme 스타일 — 정보 표 (먼저 추가)
    - 한 번에 적용: 바로 위 디자인 토큰
    - [삭제] 쓰지 않는 그림 (적용 후 삭제)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/628359f74f6aba6951cdc4c9c83ae8041bb71b17)
    - [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/44aef3ebc927557db7c81c0a0cedb2da43fc0cbd)
    - [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b3f1f0028922704f0db1a8ac8b7ac5a55a48ed55)
    - [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/9864ed9ad3a5ea74a7f2a458841f1f0fbf1e6f65)

### [문서] 퍼블리싱 인덱스 — 보고서 출력(기업 · 기관) 완료 · 기관 비공개 케이스 행 추가

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체
- 내용:
    - 상태 변경: 기업 · 기관 '보고서 출력'과 비공개 케이스(법인 · 개인 열람) → 완료
    - 행 추가: 기관 '보고서 출력 비공개 케이스' 2행(기업과 같은 이름)
- 영향 화면: [시작 페이지](/)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a752e02136b2cb4d5deb4ceffcabb97b42ee16fa)

### [문서] 퍼블리싱 인덱스 — 버전 업데이트 카드를 초안에 적은 순서대로 보이기

- 대상: src/components/custom/release-note-change-list.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - 정렬 삭제: 지금은 카드를 종류별(Diff → 덮어쓰기 → 신규 추가 → 삭제)로 다시 묶어 보여 줌 → 릴리즈 노트 초안에 적은 순서 그대로 보임
    - 이번 릴리스부터 카드를 작업할 순서대로 적으므로, 위에서부터 차례로 적용하면 됨 · 지난 릴리스 카드도 그때 적은 순서로 보임
- 영향 화면: [시작 페이지](/)
    - [버전 업데이트 아카이브](/component-guide/release-archive)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/92e89a962b14a396b601609fc2b25b3fc6aa8641)

## [신규 추가]

### [컴포넌트] 날짜(버전) 셀렉트 + 본문 공용 컴포넌트 추가

- 대상: src/components/composite/version-select-panel.tsx
- 적용: 신규 파일 추가
- 내용: 셀렉트에서 날짜(버전)를 고르면 그 날짜의 본문을 아래에 보여 주는 컴포넌트(VersionSelectPanel)입니다. 이용약관 안에 있던 같은 부분을 꺼내 개인정보 처리방침과 함께 씁니다.
- 함께 작업: 아래 이용약관 · 개인정보 처리방침 카드가 이 파일을 씀
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/70e8ca40f5c084db11c51334459a94cd2a61e5c0)

### [서비스 데이터] 개인정보 처리방침 날짜 · 본문 파일 추가

- 대상: src/content/service/privacy-policy.ts
- 적용: 신규 파일 추가
- 내용:
    - 날짜 목록: 지금은 셀렉트 동작을 보이기 위한 예시 두 개(현재 2026-06-19 · 이전 2025-07-01) — 실제 시행일로 바꿈
    - 본문: 개인정보 처리방침은 날짜별, 알기 쉬운 처리방침은 항목 5개 × 날짜별 — 지금은 모두 '추후 업데이트'
    - 원문이 나오면 이 파일의 본문(문단 목록)만 바꾸면 됨 — 바꾸는 방법은 파일 머리 주석에 있음
- 함께 작업: 아래 개인정보 처리방침 카드가 이 파일을 씀
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/484a77c34a326e680cc04f655a901197b71a7192)

## [Diff 확인]

### [컴포넌트] 이용약관 — 날짜 셀렉트를 공용 컴포넌트로 바꿈(화면 그대로)

- 대상: src/components/custom/terms-tabs.tsx
- 변경:
    - 가져오는 곳만 변경: 파일 안에 있던 '날짜 셀렉트 + 본문' 부분(TermsVersionPanel)을 지우고 공용 VersionSelectPanel 을 씀
    - 화면 · 동작 · 약관 내용: 바뀐 것 없음
- 결과: 이용약관과 개인정보 처리방침이 같은 날짜 셀렉트를 씀 — 셀렉트 모양을 바꿀 때 한 곳만 고치면 됨
- 영향 화면: [기업 이용약관](/corp/terms)
    - [기업 K-BIGx 이용약관](/corp/terms/k-bigx)
    - [기관 이용약관](/org/terms)
    - [기관 K-BIGx 이용약관](/org/terms/k-bigx)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4295858c49054c4dc4c504788a95b2a0c038427e)

### [컴포넌트] 개인정보 처리방침 — 이용약관처럼 날짜 셀렉트로 내용 보기

- 대상: src/components/custom/privacy-policy-tabs.tsx
- 변경:
    - 레이아웃 변경(개인정보 처리방침 탭): 지금은 '내용 추후 업데이트' 회색 상자만 있음 → 탭 아래 날짜 셀렉트 → 고른 날짜의 본문
    - 레이아웃 변경(알기 쉬운 개인정보 처리방침 탭): 항목 탭(수집 · 이용 · 제공 · 파기 · 이용자 권리 보호) 아래에 항목마다 날짜 셀렉트가 따로 붙음 → 항목별로 날짜마다 내용을 봄
    - 본문 모양 변경: 회색 상자를 없애고 이용약관 본문과 같은 글자만 보임(지금은 모두 '추후 업데이트' 한 줄)
    - 데이터 분리: 날짜 · 본문을 화면 파일에서 빼서 privacy-policy.ts 에서 가져옴
- 결과: 원문이 나오면 privacy-policy.ts 의 본문만 바꾸면 4개 화면에 바로 적용됨
- 영향 화면: [기업 개인정보 처리방침](/corp/privacy-policy)
    - [기업 알기 쉬운 개인정보 처리방침](/corp/privacy-policy/easy-privacy-policy)
    - [기관 개인정보 처리방침](/org/privacy-policy)
    - [기관 알기 쉬운 개인정보 처리방침](/org/privacy-policy/easy-privacy-policy)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e27351c0fdb923b700a036b2024be7c0c5b479d5)

## [삭제]

### [에셋] 쓰지 않는 그림

- 대상: public/images/option-card/chart-money-bag.webp
    - public/images/option-card/shield-certificate.webp
    - public/images/option-card/lightbulb-magnifier.webp
    - public/images/logo-kibo-on-dark.webp
- 적용: 파일을 삭제합니다.
- 내용: 새 그림 · svg 로 바꾼 뒤 쓰는 곳이 없습니다.
- 함께 작업: [Diff 확인] 특허 보고서 머리글 로고 · 일괄평가 카드 그림 (먼저 적용)
    - [덮어쓰기] 컴포넌트 가이드 (먼저 적용)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/aca9d53c10168416704bec77b584a4c8827f8bd9)
