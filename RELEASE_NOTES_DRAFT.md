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

### [컴포넌트] 이용안내 — 브라우저 확대 메뉴 캡처를 화면 크기에 맞게 받기

- 대상: src/components/custom/service-guide.tsx
- 변경:
    - AS-IS: sizes 가 없어 화면에 588px 로 보이는 캡처를 원본 기준 1920px(2배 모니터 3840px)로 받음
    - TO-BE: sizes 추가 — 일반 모니터 640px · 2배 모니터 1200px 로 받음(화면 모양 · 선명도 그대로)
- 결과: 같은 화면에서 내려받는 이미지 용량이 크게 줄어듦
- 영향 화면: [기업 이용안내](/corp/guide)
    - [기관 이용안내](/org/guide)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/7010121d09c5a72cb6ff45c18fdc92fc7048bbe2)

### [화면] 기관 K-BIGx 보고서 — 기업혁신성장 · 대량정보조회를 한 화면 탭으로

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
- 함께 작업: [신규 추가] 기관 K-BIGx 보고서 탭 화면 (먼저 추가)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e3d6b6fccf147322f9138071af4f6666f64aa873)

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

### [컴포넌트] TitleDetailTable — 제목 · 상세 두 줄 목록 표

- 대상: src/components/composite/title-detail-table.tsx
- 적용: 신규 파일 추가
- 내용: 한 건을 제목 줄(전체 폭) + 상세 줄(들여 쓴 칸 뒤 열마다 값)로 보이는 표. 특허 목록처럼 제목이 길고 상세 값이 여럿일 때 씁니다(한 대상의 항목: 값이면 InfoTable).
- 영향 화면: [제목 · 상세 표](/component-guide/title-detail-table)
- 함께 작업: [덮어쓰기] 컴포넌트 가이드 (제목 · 상세 표 가이드가 사용)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2b4b8c25ccb52371e449c9432ef1e676ad901990)

### [화면] 기관 K-BIGx 보고서 탭 화면

- 대상: src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/org-kbigx-report-screen.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/org-kbigx-report-tabs.tsx
- 적용: 신규 파일 추가
- 내용: 합쳐진 화면 틀(OrgKbigxReportScreen)과 주소와 연결된 탭(OrgKbigxReportTabs)
- 함께 작업: [Diff 확인] 기관 K-BIGx 보고서 한 화면 탭 (이어서 적용)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/9fe3e3515b46879c98faf134c5798897be1a8a0f)

### [에셋] 특허 보고서 머리글 로고(svg)

- 대상: public/images/logo-kibo-on-dark.svg
- 적용: 신규 파일 추가
- 내용: 남색 머리글 전용 로고(연두 상자)
- 함께 작업: [Diff 확인] 특허 보고서 머리글 로고 (이어서 적용)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/90632dd1da587b79175c5691efd4afb1eb51a22e)

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

### [문서] 컴포넌트 가이드

- 대상: src/app/component-guide/(guide) 폴더 전체
    - src/app/component-guide/(demo)/self-diagnosis/evaluation-model/page.tsx
    - src/constants/publishing-guide.ts
- 적용: (guide) 폴더 전체와 나머지 두 파일을 덮어쓰기
- 내용:
    - 신규 가이드: 이미지 · 제목 · 상세 표 · 우편번호 검색 · 검색 선택 모달 · 리포트 공통
    - 가이드 홈 · 모션 · Open Graph: 번호 단계로 다시 정리 · 내용 간결하게
    - 다이얼로그: 완성된 모달 8종 표 · 데모
    - 탭: 주소와 연결된 탭 예시 · pill-outline 쓰는 곳
    - 아이콘 · 옵션 카드 · 라디오 카드 · 자가진단 목업 · 서비스 소개 띠: 서비스에서 쓰는 그림으로 교체
    - 전체: 섹션 설명이 카드 폭을 끝까지 쓰도록 폭 제한 해제
- 영향 화면: [컴포넌트 가이드 홈](/component-guide)
    - [이미지](/component-guide/image)
- 함께 작업: [신규 추가] TitleDetailTable · 특허 보고서 머리글 로고(svg) (먼저 추가)
    - [삭제] 쓰지 않는 그림 (적용 후 삭제)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/628359f74f6aba6951cdc4c9c83ae8041bb71b17)

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
