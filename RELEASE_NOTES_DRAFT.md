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

## [덮어쓰기]

### 모션 가이드 — 메인페이지 동작 줄이기 예외 안내

- 대상: src/app/component-guide/(guide)/motion/page.tsx
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다.
- 내용: "모션 적용 방식" 의 접근성 설명을 "기본은 사용처에 `motion-reduce:animate-none` 을 적용해 PC 설정의 동작 줄이기 혹은 애니메이션 줄이기를 따른다" 로 고치고, 그 아래에 경고색 Alert(`role="note"`)로 "예외 — 메인페이지는 동작 줄이기를 적용하지 않습니다" 를 띄웠습니다.
- 영향 화면: [모션 (Motion)](/component-guide/motion)
- 유지: 표의 미리보기 도형은 지금도 동작 줄이기 설정을 따릅니다 — 설정을 켜면 메인 애니메이션도 이 표에서는 멈춰 보입니다.

### 퍼블리싱 인덱스 — 유료 서비스 관리 회차 반영

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다. 세 파일은 함께 교체해야 합니다 — 콘텐츠 관문이 빌드 시점에 화면 key 를 교차검증합니다.
- 신규 화면: [결제정보](/corp/mypage/paid-services/payment-history) · [이용내역](/corp/mypage/paid-services/payment-history/usage-history) · [환불하기](/corp/mypage/paid-services/refund-reason) · [환불 및 결제 취소 완료](/corp/mypage/paid-services/refund-reason/refund-complete) 를 `대기중` 에서 `완료` 로 올리고, [환불 진행중](/corp/mypage/paid-services/refund-reason/refund-processing) 행을 새로 더했습니다(`완료`, 경로 레지스트리에도 추가).
- 환불 불가 안내: 화면이 없어 `대기중` 그대로 둡니다. IA 원본에서 삭제로 표시된 항목(`isRed`, 취소선·빨간색)이지만 작업 이력 확인을 위해 되살린 행(`isRestored`)으로 표시했습니다.
