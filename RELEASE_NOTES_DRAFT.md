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

### [화면] 기관 가격정책 — 구매하기가 결제 불가 안내를 엽니다

- 대상: src/app/(user-type)/org/(service)/(logged-out)/pricing/page.tsx
- 변경:
    - PricingPolicy 에 isPurchaseUnavailable 을 줍니다. 결제 화면 주소(paymentHref)는 더 이상 넘기지 않습니다.
- 결과:
    - 기관회원이 [구매하기]를 누르면 결제 화면으로 가지 않고 결제 불가 안내 모달이 뜹니다.
    - 기관 결제하기 · 판매자 정보 · 결제 완료 화면은 삭제했습니다(아래 [삭제]).
- 영향 화면: [기관 가격정책](/org/pricing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ec229744cdb7a74f57d91383125868cb730cb9c0)

### [컴포넌트] 가격정책 — 구매할 수 없는 회원

- 대상: src/components/custom/pricing-policy.tsx
- 변경:
    - isPurchaseUnavailable prop 이 생겼습니다. 켜면 [구매하기]가 링크 대신 버튼이 되어 결제 불가 안내 모달(PaymentUnavailableDialog)을 엽니다.
    - paymentHref 는 기업처럼 결제 화면이 있을 때만 줍니다.
- 결과: 기업은 그대로 결제 화면(?plan=이용권)으로 이동합니다.
- 영향 화면: [기관 가격정책](/org/pricing)
    - [기업 가격정책](/corp/pricing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3ef64b9e2e252ea0b5d46439ebb311783b41eaaf)

### [서비스 데이터] 결제 문구 — 결제 불가 안내

- 대상: src/content/service/pricing-payment.ts
- 변경: 결제 불가 안내 모달의 문구(PAYMENT_UNAVAILABLE_TITLE · MESSAGE · GUIDE · CONTACT)가 생겼습니다.
- 결과: 문의전화(111-1111-1111)는 임시 번호라 확정된 번호로 바꿉니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5f73408f54bbd9272f6cebfc2bd9df970d534f6a)

### [컴포넌트] 이용약관 — 기술평가 약관에도 버전 셀렉트

- 대상: src/components/custom/terms-tabs.tsx
    - src/content/service/terms.ts
- 변경:
    - 기술평가 이용약관 탭에도 K-BIGx 이용약관과 같은 버전 셀렉트가 생겼습니다. 본문은 "추후 업데이트"입니다.
    - 셀렉트에서 고른 버전의 본문이 보입니다. 버전별 본문은 terms.ts 의 KBIGX_TERMS_BY_VERSION · TECH_TERMS_BY_VERSION 표에서 꺼냅니다.
- 결과:
    - 개정본이 생기면 버전 목록(TERMS_VERSIONS · TECH_TERMS_VERSIONS)과 본문 표에 같은 value 로 한 줄씩 더합니다.
    - 본문 표에 없는 버전은 "추후 업데이트"가 보입니다.
- 영향 화면: [기업 이용약관](/corp/terms)
    - [기관 이용약관](/org/terms)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8b7aa9f1cee65b6208d42cf94fff22ea92227cde)

### [컴포넌트] K-BIGx 보고서 문서 — 머리와 탭 줄 고정

- 대상: src/components/custom/innovation-growth-report-document.tsx
- 변경:
    - 머리(제목 · [보고서 출력])와 구성 항목 탭 줄을 한 덩이로 묶어, PC(768px 이상)에서 스크롤해도 화면 위에 붙게 했습니다(sticky).
    - 모바일과 인쇄에서는 붙지 않습니다.
    - 본문 폭과 간격은 그대로입니다.
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 보고서 결과](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/771397961006d32dd3ec887836e6bd6e53bbf8c7)

## [신규 추가]

### [컴포넌트] 결제 불가 안내 모달

- 대상: src/components/composite/payment-unavailable-dialog.tsx
- 적용: 신규 파일 추가
- 내용:
    - 오류 아이콘 → 안내 문구 → 문의전화 → [확인] 순서의 모달입니다. 닫기(X) 없이 [확인]으로만 닫힙니다.
    - 모달을 여는 버튼은 children 으로 넘깁니다(예: 가격정책의 [구매하기]). defaultOpen · open 으로도 열 수 있습니다.
    - 좁은 화면(360)에서는 좌우 여백이 줄고 문구가 폭에 맞게 접힙니다.
- 영향 화면: [기관 가격정책](/org/pricing)

### [화면] 결제 불가 팝업 단독 화면

- 대상: src/app/(user-type)/org/(service)/(logged-out)/pricing/payment-unavailable
- 적용: 신규 파일 추가
- 내용: 결제 불가 안내 모달만 따로 확인하는 화면입니다. [기관 가격정책](/org/pricing)에서 모두 확인할 수 있어 연동할 때 지워도 됩니다.
- 영향 화면: [결제 불가 팝업](/org/pricing/payment-unavailable)

## [덮어쓰기]

### [문서] 퍼블리싱 인덱스 — 기관 결제 불가 팝업

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
- 적용: 지정한 파일만 교체
- 내용: 기관 결제 불가 팝업을 완료로 바꾸고, 삭제한 기관 결제하기 · 판매자 정보 · 결제 완료 행을 뺐습니다.
- 영향 화면: [시작 페이지](/)

### [문서] 컴포넌트 가이드 — 접근성 검사 예외사항

- 대상: src/app/component-guide/(guide) 폴더 전체
- 적용: (guide) 폴더 전체를 덮어쓰기
- 내용: 검사 방식(주소로 검사) 설명과 새 검사기 문구를 추가하고, 화면별 오류·경고 상세 목록에 번호와 건수 요약을 붙였습니다.
- 영향 화면: [접근성 검사 예외사항](/component-guide/accessibility-exceptions)

### [문서] 버전 업데이트 — 릴리스 날짜 보정

- 대상: src/content/publishing-guide/release-notes.generated.json
    - src/content/publishing-guide/release-notes-archive.generated.json
- 적용: 지정한 파일만 교체
- 내용:
    - 이전 릴리스 17건(v3.0.0 ~ v3.3.8)의 날짜가 하루 앞서 있어 릴리스 당일(한국 날짜)로 바로잡았습니다.
    - 앞으로 릴리스는 만든 날(한국 날짜)이 기록됩니다.
- 영향 화면: [시작 페이지](/)
    - [버전 업데이트 아카이브](/component-guide/release-archive)

## [삭제]

### [화면] 기관 결제하기 · 판매자 정보 · 결제 완료

- 대상: src/app/(user-type)/org/(service)/(logged-out)/pricing/payment
- 적용: 폴더를 삭제합니다(page.tsx · complete · seller-info).
- 내용:
    - 기관회원은 이용권을 직접 구매할 수 없어 세 화면을 지웠습니다.
    - 결제 화면 컴포넌트(PricingPayment · SellerInfoDialog 등)는 기업이 쓰므로 그대로 둡니다.
