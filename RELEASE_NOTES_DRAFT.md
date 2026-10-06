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

### [화면] 결제정보 — 현재 이용권 케이스

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/page.tsx
- 변경:
    - 현재 이용권을 currentPass 로 받습니다.
    - 주소에 ?case=1~6 을 붙이면 케이스가 바뀝니다(기본 1).
- 결과:
    - 케이스 표는 파일 맨 위 주석에 있습니다.
    - 연동할 때는 currentPass 에 현재 이용권 조회 응답을 넘깁니다.
- 영향 화면: [결제정보](/corp/mypage/paid-services/payment-history)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b9c3f9cf3d06fd890c4b41188cd4175e9bd336d9)

### [컴포넌트] 유료 서비스 이용 내역 — 현재 이용권 카드

- 대상: src/components/custom/paid-service-history.tsx
- 변경:
    - 현재 이용권(CurrentPaidServicePass)에 startDate · endDate · remainingDays · isFree · isRefundable · suspension · suspensionRecord · hasSuspendedBefore 가 생겼습니다.
    - 이용중지 중: 배지 [이용중지] + 분홍 이용중지 기록 블록.
    - 재개한 뒤: [사용중] + 중립 톤 이력 블록.
    - 버튼: [환불하기](isRefundable) · [이용중지] 또는 [이용중지 변경] · [이용내역]. 이용중지 이력이 있으면 이용중지 버튼이 없습니다.
    - onSuspend(id, values, outcome) prop 이 생겼고, onRefund 는 현재 이용권에도 쓰입니다.
- 결과: 연동할 때 suspendedPass · applyPassSuspension(신청·변경 직후 카드를 바꾸는 목업)을 지웁니다.
- 영향 화면: [결제정보](/corp/mypage/paid-services/payment-history)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3d79e43634f9b78664d90adea32335337888c393)

### [컴포넌트] 안내 모달 — 문구 구조

- 대상: src/components/composite/notice-dialog.tsx
- 변경: 문구를 DialogDescription asChild 안의 블록 span 으로 그립니다.
- 결과:
    - WAVE 의 "Possible heading" 경고가 없어집니다.
    - 모양은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c4e556796b2d1f9347cbba784e07d22b5bd29f99)

### [컴포넌트] 표 — 아래쪽 선

- 대상: src/components/custom/table.tsx
- 변경: line 변형의 아래쪽 선을 진한 2px 에서 행 구분선과 같은 옅은 1px 로 바꿨습니다(위쪽은 그대로 진한 2px).
- 결과: 표를 쓰는 모든 화면에서 맨 아래 선이 옅어집니다.
- 영향 화면: [표](/component-guide/table)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fea596dd38ad81c352110bf4b6456ae2a4550172)

### [컴포넌트] 리포트 문서 — 인쇄 규칙 스타일 위치

- 대상: src/components/custom/report-document.tsx
- 변경:
    - ReportPageStyle 을 report-page-style.tsx 로 옮겼습니다. report-document.tsx 가 그대로 다시 내보내므로 쓰는 쪽 코드(import)는 바꾸지 않습니다.
    - 인쇄 규칙(A4 세로 · 여백 0)의 내용은 같습니다.
    - 새 파일은 [신규 추가]의 "리포트 인쇄 규칙 스타일" 카드와 함께 적용합니다.
- 결과:
    - 보고서 화면 안의 main 에 style 이 들어가 W3C 검사에서 나던 오류가 없어집니다.
    - 인쇄 규칙은 화면이 떠 있는 동안에만 head 에 들어가고, 화면을 떠나면 지워집니다.
- 영향 화면: [기업 일반분석 KTRS-FM](/corp/mypage/evaluation-results/general-analysis/ktrs-fm)
    - [기업 일반분석 Tech-Index](/corp/mypage/evaluation-results/general-analysis/tech-index)
    - [기업 일반분석 창업용 Tech-Index](/corp/mypage/evaluation-results/general-analysis/startup-tech-index)
    - [기업 일반분석 투자모형](/corp/mypage/evaluation-results/general-analysis/investment-model)
    - [기관 일반분석 KTRS-FM](/org/mypage/evaluation-history/general-analysis/ktrs-fm)
    - [기관 일반분석 Tech-Index](/org/mypage/evaluation-history/general-analysis/tech-index)
    - [기관 일반분석 창업용 Tech-Index](/org/mypage/evaluation-history/general-analysis/startup-tech-index)
    - [기관 일반분석 투자모형](/org/mypage/evaluation-history/general-analysis/investment-model)
    - [기관 심층분석 KTRS-FM](/org/mypage/evaluation-history/deep-analysis/ktrs-fm)
    - [기관 심층분석 Tech-Index](/org/mypage/evaluation-history/deep-analysis/tech-index)
    - [기관 심층분석 창업용 Tech-Index](/org/mypage/evaluation-history/deep-analysis/startup-tech-index)
    - [기관 심층분석 투자모형](/org/mypage/evaluation-history/deep-analysis/investment-model)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/06a73ce8a6b6ac6dd6e0174d14b1f87681b63fe8)

## [신규 추가]

### [컴포넌트] 이용중지 신청 · 변경 팝업

- 대상: src/components/composite/paid-service-suspend-action.tsx
    - src/components/composite/paid-service-suspend-dialog.tsx
    - src/components/composite/paid-service-suspend-confirm-dialog.tsx
    - src/components/composite/paid-service-suspend-info.tsx
- 적용: 신규 파일 추가
- 내용:
    - PaidServiceSuspendAction 이 이용권 상태에 따라 팝업을 엽니다.
    - 무료 지급 · 잔여 1일: 불가 안내
    - 이용중지 중: 변경 팝업
    - 그 밖: 신청 팝업
    - 흐름: 입력 팝업(시작일 읽기 전용 + 종료일) → 확인 팝업 → 완료 알림
- 참고:
    - [확인]에서 onSubmit(values, outcome)이 호출됩니다.
    - values: suspendStartDate · suspendEndDate(yyyy-MM-dd)
    - outcome: apply · change · release(종료일을 오늘로 골라 즉시 해제)

### [서비스 데이터] 이용중지 정책 · 문구 · 케이스 목업

- 대상: src/lib/suspend-policy.ts
    - src/lib/service-today.ts
    - src/content/service/paid-service-suspend.ts
    - src/content/service/paid-service-current-pass.ts
- 적용: 신규 파일 추가
- 내용:
    - suspend-policy.ts: 종료일 범위 · 이용중지 일수 · 재개일 · 만료일(원래 만료일 + 이용중지 일수) 계산
    - service-today.ts: 서비스 기준일(한국 날짜)
    - paid-service-suspend.ts: 팝업 · 알림 문구와 타입
    - paid-service-current-pass.ts: 케이스 1~6 목업

### [화면] 이용중지 케이스 · 팝업 미리보기

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspending
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspension-history
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/refundable
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspend
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspend-confirm
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspend-complete
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspend-change
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspend-change-confirm
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspend-change-complete
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspend-release-complete
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspend-unavailable-remaining-day
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspend-unavailable-free-pass
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspend-confirm-preview.tsx
- 적용: 신규 파일 추가
- 내용:
    - 결제정보의 케이스 3개와 팝업 9개를 따로 열어 보는 미리보기 전용 화면입니다.
    - [결제정보 화면](/corp/mypage/paid-services/payment-history)에서 모두 확인할 수 있어 연동할 때 지워도 됩니다.

### [컴포넌트] 리포트 인쇄 규칙 스타일

- 대상: src/components/custom/report-page-style.tsx
- 적용: 신규 파일 추가
- 내용:
    - 보고서 화면의 main 안에 ReportPageStyle 을 한 번 둡니다(기존과 같은 사용법).
    - 화면이 뜨면 인쇄 규칙을 head 에 넣고, 떠나면 지웁니다.
    - [Diff 확인]의 "리포트 문서 — 인쇄 규칙 스타일 위치" 카드와 함께 적용합니다.

## [덮어쓰기]

### [문서] 퍼블리싱 인덱스 — 이용중지 · 환불 가능 화면

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
- 적용: 지정한 파일만 교체
- 내용: 결제정보 아래에 케이스 3행과 팝업 9행을 추가했습니다.
- 영향 화면: [시작 페이지](/)

### [문서] 컴포넌트 가이드 — 설명 문서 정리

- 대상: src/app/component-guide/(guide) 폴더 전체
- 적용: (guide) 폴더 전체를 덮어쓰기
- 내용:
    - 제목 위계를 정리하고 사용법 · 넘기는 값 · 케이스 설명을 현재 코드에 맞춰 다시 썼습니다.
    - 아래 두 카드(메뉴 · 폼 제출 데모 지원 파일, 버전 업데이트 아카이브)와 함께 적용합니다.
    - 컴포넌트 카드를 먼저 적용한 뒤 덮어씁니다.

### [문서] 컴포넌트 가이드 — 메뉴 · 폼 제출 데모 지원 파일

- 대상: src/constants/publishing-guide.ts
    - src/components/composite/sidebar-layout.tsx
    - src/components/custom/form-submit-result.tsx
- 적용: 지정한 파일만 교체
- 내용: 가이드 메뉴를 한 단계 더 묶고(폼 항목 등) 폼 제출 데모의 결과 표시 조각을 추가했습니다. (guide) 폴더와 함께 덮어씁니다.

### [문서] 버전 업데이트 아카이브

- 대상: src/components/custom/release-note-change-list.tsx
    - src/components/custom/publishing-index.tsx
    - src/content/publishing-guide/index.ts
    - src/content/publishing-guide/release-notes-archive.generated.json
- 적용: 지정한 파일만 교체
- 내용: 첫 버전부터 모든 릴리스를 보는 아카이브 화면(가이드 폴더 안)을 추가했습니다. 시작 페이지의 릴리스 노트는 최근 30개만 보입니다.
- 영향 화면: [버전 업데이트 아카이브](/component-guide/release-archive)
