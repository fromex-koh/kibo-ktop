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

### [동작] 메인페이지 — PC 의 동작 줄이기 설정과 관계없이 원본 모션 재생

- 대상: src/app/globals.css
    - src/components/custom/stack-pager.tsx
    - src/components/theme/stack-pager.variants.ts
    - src/components/custom/hero-section.tsx
    - src/components/custom/hero-background.tsx
    - src/components/custom/hero-stats-roller.tsx
    - src/components/theme/hero-stats-roller.variants.ts
    - src/components/custom/animated-counter.tsx
    - src/components/custom/main-second-section.tsx
    - src/components/custom/tech-eval-section.tsx
    - src/components/custom/tech-eval-services.tsx
    - src/components/custom/reveal.tsx
    - src/components/custom/home-notice-popup.tsx
- 이전: PC 설정의 동작 줄이기 혹은 애니메이션 줄이기(`prefers-reduced-motion: reduce`)는 대부분 꺼져 있지만 기본으로 켜져 있는 PC 도 있고, 켜져 있으면 메인페이지의 애니메이션 요소가 아예 노출되지 않아 버그처럼 보였습니다.
- 지금: 메인페이지 컴포넌트에서 동작 줄이기 분기(`motion-reduce:*` · `motion-safe:*` · `matchMedia` 판정 · globals.css 의 `@media` 두 블록)를 걷어 내, 설정과 관계없이 원본 모션을 재생합니다.
- 예외 범위: 동작 줄이기 예외는 메인페이지뿐입니다. 나머지 화면은 설정을 켜도 움직임만 줄어들 뿐 메인페이지처럼 내용이 노출되지 않는 경우가 없어, 지금처럼 설정을 따르도록 그대로 둡니다.
- 확인 방법: PC 설정의 동작 줄이기 혹은 애니메이션 줄이기를 켠 상태로 메인페이지를 열어 섹션 내용과 애니메이션이 보이는지 봅니다.
- 영향 화면: [기업 홈](/corp/home) `완료` · [기관 홈](/org/home) `완료` · [기업 메인 공지사항 팝업](/corp/home-notice-popup) `완료` · [기관 메인 공지사항 팝업](/org/home-notice-popup) `완료`
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/73ae2447)

### [동작] 마이페이지 사이드바 — 유료 서비스 관리 메뉴 연결

- 대상: src/components/composite/mypage-sidebar.tsx
- 이전: 기업 메뉴의 [유료 서비스 관리] 주소가 `#` 이라 눌러도 이동하지 않았습니다.
- 지금: `/corp/mypage/paid-services/payment-history` 로 갑니다.
- 영향 화면: 기업 마이페이지 화면 전체의 사이드바(좁은 화면은 메뉴 드롭다운)
- 유지: 기관 메뉴와 나머지 항목·순서·아이콘은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c68c4bc0)

### [접근성] 파일 첨부 — 숨은 파일 선택 칸에 이름 연결

- 대상: src/components/composite/file-upload.tsx
    - src/components/composite/file-upload-field.tsx
    - src/components/composite/org-customer-consent-form.tsx
- 이전: 화면에 보이지 않는 `<input type="file">` 에 이름이 없어, 자동 검사에서 무엇을 올리는 칸인지 알 수 없었습니다.
- 지금: `FileUpload` 에 `inputLabel`(기본값 `'첨부파일'`) prop 을 더해 숨은 입력의 `aria-label` 로 씁니다. `FileUploadField` 는 보이는 라벨을 `aria-labelledby` 로 연결합니다. 기관 고객정보활용동의는 `inputLabel="정보이용동의서 첨부파일"` 을 넘깁니다.
- 영향 화면: [기관 고객정보활용동의 (KTRS-FM)](/org/individual-evaluation/ktrs-fm/customer-consent) `보완(09/08)` · [투자모형](/org/individual-evaluation/investment-model/customer-consent) `보완(09/08)` · [Tech-Index 일반](/org/individual-evaluation/tech-index/general/customer-consent) `보완(09/08)` · [Tech-Index 창업](/org/individual-evaluation/tech-index/startup/customer-consent) `보완(09/08)` · [일괄평가 진행 신청](/org/batch-evaluation/evaluation-history-or-batch/general/batch-evaluation-request) `완료` · [대량정보 조회 신청](/org/batch-evaluation/evaluation-history-or-batch/general/bulk-data-request) `완료`
- 유지: 파일 선택·확장자와 크기 검사·안내 문구와 모양은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b8ab3d9f)

### [접근성] 문의하기 — 개인정보 수집 동의 체크박스에 이름 연결

- 대상: src/components/custom/inquiry-form.tsx
- 이전: 개인정보 수집 동의 체크박스가 라벨의 `htmlFor` 연결로만 이름을 얻었습니다.
- 지금: 라벨에 `id="inquiry-consent-label"` 을 주고 체크박스에 `aria-labelledby` 로 직접 연결했습니다.
- 영향 화면: [기업 문의하기](/corp/notice/inquiry-create) `보완(09/07)` · [기관 1:1 문의 등록](/org/notice/inquiry-create) `완료` · [기업 개인정보 수집 및 이용 안내](/corp/notice/inquiry-create/privacy-consent-guide) `완료` · [기관 개인정보 수집 및 이용 안내](/org/notice/inquiry-create/privacy-consent-guide) `완료`
- 유지: 동의 여부 검사와 오류 문구는 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/13e76f03)

### [마크업] 기관 1:1 문의 내역 — 문의마다 다른 상세 주소, 목록 복귀는 목록 제목으로

- 대상: src/app/(user-type)/org/(service)/(logged-in)/mypage/inquiry-history/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/inquiry-history/inquiry-detail/page.tsx
- 이전: 13건 모두 같은 상세 주소(`/org/mypage/inquiry-history/inquiry-detail`)를 가리켜 같은 주소 링크가 여러 개였고, 상세의 [목록으로 돌아가기] 는 목록 화면 맨 위로 갔습니다.
- 지금: 항목마다 `?id=문의번호` 를 붙여 주소를 구분합니다. [목록으로 돌아가기] 는 `#inquiry-history-title` 로 가서 목록 제목(`tabIndex={-1}`)에 닿습니다.
- 연동: 상세 본문은 아직 목업입니다. 실제로는 `id` 로 조회한 문의를 연결합니다.
- 영향 화면: [1:1 문의 내역](/org/mypage/inquiry-history) `보완(09/10)` · [문의하기 상세](/org/mypage/inquiry-history/inquiry-detail) `보완(09/11)`
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/cdc61c90)

### [마크업] 기업 평가결과 조회 — 자가진단 결과 링크에 평가 건 번호

- 대상: src/content/service/evaluation-results.ts
- 이전: 같은 모형의 카드가 여러 장이면 [자가진단 결과] 링크가 모두 같은 주소(`/corp/mypage/evaluation-results/general-analysis/ktrs-fm` 등)였습니다.
- 지금: `selfDiagnosisResult(model, id)` 로 평가 건 id 를 받아 `?id=` 를 붙입니다. 기관 평가결과·평가검증 목록과 같은 형식이고, 연동 후에는 조회 결과의 건 번호가 들어갑니다.
- 영향 화면: [평가결과조회](/corp/mypage/evaluation-results) `보완(09/08)`
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f99483ed)

### [동작] 하위계정 현황 — 삭제 후 완료 토스트 추가

- 대상: src/components/custom/org-sub-account-list.tsx
    - src/constants/sub-account.ts
- 이전: [⋮] > [삭제] 확인 모달에서 [확인] 을 누르면 카드만 목록에서 사라지고 토스트가 없었습니다. 등록·수정·비밀번호 초기화·상태 변경은 완료 토스트가 있었습니다.
- 지금: 다른 흐름과 같이 삭제한 뒤 "하위계정이 삭제되었습니다." 토스트를 띄웁니다. 문구와 id 는 `SUB_ACCOUNT_TOAST.delete` 에 두었습니다.
- 영향 화면: [하위계정 현황 · 기술평가부 비협약](/org/mypage/sub-account-progress) `완료` · [기술평가부 협약](/org/mypage/sub-account-progress/tech-partner) `완료` · [K-BIGx 비협약](/org/mypage/sub-account-progress/k-bigx-non-partner) `완료` · [K-BIGx 협약](/org/mypage/sub-account-progress/k-bigx-partner) `완료`
- 유지: 삭제 확인 모달의 문구와 목록에서 지우는 동작은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6f4e52a8)

## [신규 추가]

### 유료 서비스 관리 화면과 팝업 확인 화면 (기업)

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/usage-history/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/refund-reason/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/refund-reason/refund-processing/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/refund-reason/refund-complete/page.tsx
- 적용: 신규 파일 추가
- 내용: 결제정보는 마이페이지 사이드바와 이용권 목록(`PaidServiceHistory`)으로 이루어진 [유료 서비스 관리] 화면입니다. 나머지 네 화면은 목록의 버튼이 여는 팝업을 단독으로 띄워 확인하는 화면입니다.
- 영향 화면: [결제정보](/corp/mypage/paid-services/payment-history) `완료` · [이용내역](/corp/mypage/paid-services/payment-history/usage-history) `완료` · [환불하기](/corp/mypage/paid-services/refund-reason) `완료` · [환불 진행중](/corp/mypage/paid-services/refund-reason/refund-processing) `완료` · [환불 및 결제 취소 완료](/corp/mypage/paid-services/refund-reason/refund-complete) `완료`

### PaidServiceHistory — 유료 서비스 이용권 목록 조각

- 대상: src/components/custom/paid-service-history.tsx
- 적용: 신규 파일 추가
- 구성: [현재 사용중인 이용권] 카드 한 장(등급 이미지 · 잔여 건수 · 이용기간 · 사용량 막대 · 구매일/상품 구성/금액 · [이용내역])과 [구매한 이용권 내역] 목록(상태 필터 전체·대기중·만료·환불, 최신순·오래된순 정렬, 한 페이지 10건)입니다.
- 카드 상태: 대기중은 [환불하기]·[이용내역], 만료는 [이용내역]만 두고, 환불은 잔여 건수 대신 환불금액·환불일을 보여 줍니다. 어드민이 무료로 지급한 이용권은 `purchasedLabel: '지급일'` · `refundable: false` · `refundNotice` 로 환불 불가 안내를 띄웁니다.
- 동작: 필터·정렬을 바꾸면 1페이지로 돌아가고, 정렬을 바꾸면 필터도 전체로 돌아갑니다. 페이지를 넘기면 목록 머리(`총 N건`)로 굴립니다.
- 연동: 목업 `CURRENT_PASS` · `PURCHASED_PASSES` 를 조회 응답으로 바꿉니다. `totalPages` 를 넘기면 서버 페이지로 보고 목록을 자르지 않습니다. `onRefund` 가 Promise 를 돌려주면 끝날 때까지 진행중 모달을 유지합니다.
- props: `currentPass`(없으면 빈 안내) · `purchasedPasses` · `purchasedTotalCount` · `totalPages` · `pageSize` · `onFilterChange` · `onSortChange` · `onPageChange` · `onRefund` · `onViewHistory` · `onUsageHistoryPageChange` · `defaultOpenUsageHistoryId` · `defaultOpenRefundId`

### PaidServiceUsageHistoryDialog — 이용내역 모달

- 대상: src/components/composite/paid-service-usage-history-dialog.tsx
- 적용: 신규 파일 추가
- 내용: 이용권 등급 · 현재 잔여 건수와 사용 내역 표(날짜 · 기업명 · 특허명 · 보고서 유형 · 조회유형 · 차감 · 잔여)입니다. 한 페이지 10건이고, 내역이 없으면 "이용내역이 없습니다." 가 나옵니다.
- 표 너비: 칸 너비를 고정 px 대신 비율(`w-1/8` · `w-1/6` · `w-7/24` · `w-1/10`)로 나누고 표에 최소 폭(`min-w-5xl`)을 두었습니다. 모달이 그보다 좁으면 표 안에서 가로로 스크롤됩니다.
- props: `pass`(`grade` · `remaining`) · `items` · `totalPages`(서버 페이지) · `pageSize` · `onPageChange` · `defaultOpen` · `children`(여는 버튼)

### PaidServiceRefundDialog · PaidServiceRefundCompleteDialog · ProcessingDialog — 환불 확인·진행중·완료 모달

- 대상: src/components/composite/paid-service-refund-dialog.tsx
    - src/components/composite/paid-service-refund-complete-dialog.tsx
    - src/components/composite/processing-dialog.tsx
- 적용: 신규 파일 추가
- 흐름: "{등급} 이용권을 환불하시겠습니까?" 확인 → 진행중 모달 → 완료 모달("이용권 환불 처리가 완료되었습니다. 화면을 새로고침하여 주세요.") 순서로 이어집니다. `onConfirm` 이 Promise 를 돌려주면 성공 때 완료 모달로, 실패 때는 진행중 모달만 닫습니다. Promise 가 아니면(목업) `previewProcessingDuration`(1200ms) 뒤 완료로 넘어갑니다.
- ProcessingDialog: 끝나는 시점을 알 수 없는 작업에 함께 쓰는 진행중 모달입니다. `title` 만 받고, Esc·바깥 클릭으로 닫히지 않으며 문구는 `role="status"` 로 읽힙니다.

### 이용권 등급 이미지

- 대상: public/images/ticket-grade/ticket-grade-minimum.webp
    - public/images/ticket-grade/ticket-grade-basic.webp
    - public/images/ticket-grade/ticket-grade-standard.webp
    - public/images/ticket-grade/ticket-grade-premium.webp
- 적용: 신규 파일 추가
- 내용: 미니멈(M) · 베이직(B) · 스탠다드(S) · 프리미엄(P) 코인 이미지(104×104 webp)입니다. 이용권 카드에 52 크기로 들어가며, 파일 이름은 `ticket-grade-<등급>.webp` 입니다.

### 하위계정 삭제 완료 토스트 화면

- 대상: src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/delete/complete-toast/page.tsx
- 적용: 신규 파일 추가
- 내용: 삭제 확인 모달의 [확인] 이 띄우는 "하위계정이 삭제되었습니다." 토스트를 단독으로 확인하는 화면입니다. 다른 완료 토스트 화면과 같이 노출 시간을 무한으로 두어 사라지지 않습니다(이 화면에서만).
- 영향 화면: [하위계정 삭제 완료 토스트](/org/mypage/sub-account-progress/delete/complete-toast) `완료`

## [덮어쓰기]

### 모션 가이드 — 메인페이지 동작 줄이기 예외 안내

- 대상: src/app/component-guide/(guide)/motion/page.tsx
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다.
- 내용: "모션 적용 방식" 의 접근성 설명을 "기본은 사용처에 `motion-reduce:animate-none` 을 적용해 PC 설정의 동작 줄이기 혹은 애니메이션 줄이기를 따른다" 로 고치고, 그 아래에 경고색 Alert(`role="note"`)로 "예외 — 메인페이지는 동작 줄이기를 적용하지 않습니다" 를 띄웠습니다.
- 영향 화면: [모션 (Motion)](/component-guide/motion)
- 유지: 표의 미리보기 도형은 지금도 동작 줄이기 설정을 따릅니다 — 설정을 켜면 메인 애니메이션도 이 표에서는 멈춰 보입니다.

### 퍼블리싱 인덱스 — 유료 서비스 관리 · 하위계정 삭제 완료 토스트 반영

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다. 세 파일은 함께 교체해야 합니다 — 콘텐츠 관문이 빌드 시점에 화면 key 를 교차검증합니다.
- 신규 화면: [결제정보](/corp/mypage/paid-services/payment-history) · [이용내역](/corp/mypage/paid-services/payment-history/usage-history) · [환불하기](/corp/mypage/paid-services/refund-reason) · [환불 및 결제 취소 완료](/corp/mypage/paid-services/refund-reason/refund-complete) 를 `대기중` 에서 `완료` 로 올리고, [환불 진행중](/corp/mypage/paid-services/refund-reason/refund-processing) 행을 새로 더했습니다(`완료`, 경로 레지스트리에도 추가).
- 환불 불가 안내: 화면이 없어 `대기중` 그대로 둡니다. IA 원본에서 삭제로 표시된 항목(`isRed`, 취소선·빨간색)이지만 작업 이력 확인을 위해 되살린 행(`isRestored`)으로 표시했습니다.
- 하위계정 삭제: [삭제] 묶음에 [하위계정 삭제 완료 토스트](/org/mypage/sub-account-progress/delete/complete-toast) 행을 더했습니다(`완료`, 경로 레지스트리에도 추가). 등록·수정·비밀번호 초기화·사용정지 묶음과 같은 짜임입니다.

### 접근성 검사 예외사항 — 기업·기관별 최근 검사 요약과 최신 검사 결과

- 대상: src/app/component-guide/(guide)/accessibility-exceptions/page.tsx
    - src/app/component-guide/(guide)/accessibility-exceptions/latest-audit.tsx
    - src/app/component-guide/(guide)/accessibility-exceptions/audit-summary-metadata.tsx
    - src/content/publishing-guide/accessibility-audit.json
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다. `audit-summary-metadata.tsx` 는 새 파일입니다.
- 내용: 최근 검사 요약을 기업·기관으로 나눠 보여 주고, 검사 시각은 보는 사람의 브라우저 시간대로 표시합니다(`AuditSummaryMetadata`). 외부 프로젝트인 탄소 화면은 결과 데이터에 섞여 있어도 모든 집계에서 뺍니다. 라이브러리 원인 항목(Radix Select 의 빈 option·필수 select, nav role, 차트)은 설명 자리로 연결하고 발생 원인 설명을 고쳤으며, WAVE 예외는 라디오 · 체크박스 · 셀렉트 오류 · 셀렉트 경고로 나눴습니다.
- 검사 결과: 2026-09-14 커밋 `7d9d2e4f` 운영 빌드 기준으로 새로 검사했습니다 — 기업 136화면 오류 192건 · 기관 130화면 오류 195건, 경고 0건.
- 참고: 검사 스크립트(`scripts/audit-accessibility.mjs`)와 안내 문서는 전달본에 들어가지 않아 대상에서 뺐습니다. 이번 검사부터 퍼블리싱 인덱스에서 취소선(`isRed`)으로 표시된 화면은 검사하지 않습니다.
- 영향 화면: [접근성 검사 예외사항](/component-guide/accessibility-exceptions)
