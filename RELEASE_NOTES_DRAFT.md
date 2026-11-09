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

# 작업: 가격정책 화면 개편 — 기업 · 기관 회원유형 탭 추가 · 로그인 헤더 적용

## [신규 추가]

### [컴포넌트] SegmentedTabs — 세그먼트 탭 추가

- 대상: src/components/composite/segmented-tabs.tsx
    - src/components/theme/segmented-tabs.variants.ts
- 적용: 신규 파일 추가
- 내용:
    - 회색 트랙 안에서 하나를 고르면 아래 내용(TabsContent)이 바뀌는 탭(가격정책의 기업회원 · 기관회원)
    - ui/tabs 의 Tabs · TabsContent 를 그대로 쓰고 목록(SegmentedTabsList) · 칸(SegmentedTabsTrigger)만 바꿈
    - 칸: 높이 40 · 최소 폭 120 · 글자 가운데, 고른 칸은 흰 면 + 파란 굵은 글자
- 영향 화면: [세그먼트 탭 (SegmentedTabs)](/component-guide/segmented-tabs)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/23a52fc95453ef46a281417e39a738d5547c8293)

### [컴포넌트] PricingCard — 가격 카드 추가

- 대상: src/components/composite/pricing-card.tsx
    - src/components/theme/pricing-card.variants.ts
- 적용: 신규 파일 추가
- 내용:
    - 구역을 골라 쌓는 카드: 머리(이름 · 보조 설명 · 무료/유료 배지) · 금액 · 핵심 안내 상자 · 이름표 줄(평가모형) · 버튼
    - size(md 이용권 카드 · lg 서비스 카드) · elevated(한 장 카드 그림자 shadow-1) · interactive(hover · 포커스 강조)
    - interactive 카드는 마우스를 올리거나 버튼에 포커스가 가면 파란 테두리 · 옅은 파란 면, 버튼은 채운 파란 버튼(기존 이용권 카드 강조 그대로)
    - [구매하기] 버튼은 프로젝트 버튼 규격(secondary · md · 반경 8)
- 영향 화면: [가격 카드 (PricingCard)](/component-guide/pricing-card)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/866e7a8efb7531a80e6425656b708685dd010694)

### [컴포넌트] PlanComparisonTable — 플랜 비교표 추가

- 대상: src/components/custom/plan-comparison-table.tsx
- 적용: 신규 파일 추가
- 내용:
    - 이용권을 열로, 비교 항목을 행으로 놓는 표. 칸 값은 글자 · 제공(파란 체크) · 해당 없음(줄표)
    - 좁은 화면은 표만 가로 스크롤 · 항목 이름 열 왼쪽 고정. 스크롤 상자의 contain-inline-size · relative 는 지우지 않음(없으면 모바일 페이지 전체가 가로로 넘침)
- 영향 화면: [플랜 비교표 (PlanComparisonTable)](/component-guide/plan-comparison-table)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/106a3fc10b9adac2a031365c28ea760912db486d)

### [컴포넌트] PricingMemberTabs — 가격정책 회원유형 탭 묶음 추가

- 대상: src/components/custom/pricing-member-tabs.tsx
- 적용: 신규 파일 추가
- 내용: 가운데 제목 · 설명 → 회원유형 탭 → 고른 회원의 내용. 설명 문구가 고른 회원유형에 따라 바뀜
- 함께 작업: 아래 가격정책 카드 · 화면 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/20fba5a07d014f17299b23a17c771463cd28ae66)

## [Diff 확인]

### [데이터 · 화면] 가격정책 — 회원유형 탭 · 카드 · 비교표로 재구성

- 대상: src/content/service/pricing.ts
    - src/components/custom/pricing-policy.tsx
- 변경:
    - 짜임: 1뎁스 탭(기술평가 · K-BIGx 보고서) 아래에 회원유형 탭(기업회원 · 기관회원) 추가
    - 기술평가 · 기업회원: 자가진단 카드 한 장 / 기관회원: 개별평가 · 일괄평가 카드 + 기관 이용 안내
    - K-BIGx · 기업회원: 자사조회 + 이용권 4장 카드, 플랜별 비교표, 이용 안내 / 기관회원: 계약 안내 카드 + 파트너(기관) 이용 안내
    - 반응형: 이용권 카드 PC 5열 · 태블릿 3열 · 모바일 1열, 기관 기술평가 카드 태블릿부터 2열
    - 데이터: 문구 · 이용권은 pricing.ts, 비교표 열 · 행은 buildPlanComparison(이용권 목록)이 만듦
    - [프론트엔드 연동] 이용권을 API 로 받으면 PricingPolicy 의 plans 로 넘김 — 카드 · 비교표가 함께 바뀜(pricing.ts 머리 주석)
- 결과: 기업 · 기관 화면이 같은 본문을 쓰고, 처음 열리는 회원유형만 다름(defaultMember)
- 영향 화면: [가격정책 (기업)](/corp/pricing)
    - [가격정책 (기관)](/org/pricing)
- 함께 작업: 위 컴포넌트 카드 · 아래 화면 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/18a4ede76ab7bfae1f7fbdd8169ac4509d8c145e)

### [화면] 가격정책 · 결제 화면 — 로그인 헤더로 이동

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/pricing/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/pricing/payment/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/pricing/payment/complete/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/pricing/payment/seller-info/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/pricing/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/pricing/payment-unavailable/page.tsx
- 변경:
    - 폴더 이동: (logged-out)/pricing → (logged-in)/pricing (기업 · 기관). 주소는 그대로
    - 헤더: 로그인 전 헤더 → 기업 · 기관 로그인 헤더(회원유형별 흐름이 화면에서 구분됨)
    - 가격정책 page.tsx: defaultMember 전달(기업 corp · 기관 org) — 기관은 기존처럼 [구매하기]가 결제 불가 안내 모달을 엶
- 결과: 예전 (logged-out)/pricing 폴더는 지움(아래 [삭제])
- 영향 화면: [가격정책 (기업)](/corp/pricing)
    - [가격정책 (기관)](/org/pricing)
    - [결제하기](/corp/pricing/payment)
    - [결제 불가 팝업](/org/pricing/payment-unavailable)
- 함께 작업: 위 가격정책 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/05b13af8b0a55ac207df486c9efeaeb353786625)

## [삭제]

### [화면] 로그인 전 레이아웃의 가격정책 폴더

- 대상: src/app/(user-type)/corp/(service)/(logged-out)/pricing
    - src/app/(user-type)/org/(service)/(logged-out)/pricing
- 적용: 폴더 삭제(위 카드에서 (logged-in) 아래로 옮김 — 같은 주소가 두 곳에 있으면 빌드 오류)
- 함께 작업: 위 화면 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c70bb4a3991623449dd4b87b3e1f6e66945ea3b5)

## [Diff 확인]

### [문구] 결제 불가 안내 팝업 · 결제하기 이용 안내 수정

- 대상: src/components/composite/payment-unavailable-dialog.tsx
    - src/content/service/pricing-payment.ts
- 변경:
    - 결제 불가 안내 문구: 쉼표 뒤 강제 줄바꿈 대신 문장 단위로 나눔 — 굵은 안내 "기관회원은 이용권을 직접 구매할 수 없습니다." + 설명(16 · 회색)
    - 결제 불가 안내 좁은 화면: 두 문장 모두 낱말 단위로 고르게 접힘
    - 결제 불가 안내 연락처: "문의전화: 111-1111-1111" → "담당자 연락처 : 051-606-7596"
    - 결제하기 이용 안내 3번째 줄: "자사 조회(본인 기업 조회), 기술혁신정보 미제공, 당일 재조회 등의 경우 …" → "자사 조회(본인 기업 조회)의 경우 이용 횟수가 차감되지 않습니다."
- 결과: 문구만 바뀜 — 팝업 · 결제하기 화면 짜임과 동작은 그대로
- 영향 화면: [결제 불가 팝업](/org/pricing/payment-unavailable)
    - [결제하기](/corp/pricing/payment)
- 커밋: [결제 불가 안내](https://github.com/fromex-koh/kibo-ktop/commit/f025ab73fe87b7fe8414882af3b7d3cc2053bd3d) · [결제하기 이용 안내](https://github.com/fromex-koh/kibo-ktop/commit/3d350da59da2c54f21d6898ebf93b860fa5878c6)

# 작업: 컴포넌트 가이드 — 가격정책 컴포넌트 3종 추가

## [덮어쓰기]

### [문서] 가격정책 컴포넌트 가이드 추가 · 탭 가이드 갱신

- 대상: src/app/component-guide/(guide)/segmented-tabs/page.tsx
    - src/app/component-guide/(guide)/pricing-card/page.tsx
    - src/app/component-guide/(guide)/plan-comparison-table/page.tsx
    - src/app/component-guide/(guide)/segmented-control/page.tsx
    - src/app/component-guide/(guide)/tabs/page.tsx
    - src/constants/publishing-guide.ts
- 적용: 지정한 파일만 교체
- 내용:
    - [세그먼트 탭 (SegmentedTabs)](/component-guide/segmented-tabs): 새 가이드
    - [가격 카드 (PricingCard)](/component-guide/pricing-card): 새 가이드
    - [플랜 비교표 (PlanComparisonTable)](/component-guide/plan-comparison-table): 새 가이드
    - [세그먼티드 컨트롤 (Segmented Control)](/component-guide/segmented-control): 고르는 기준 표에 SegmentedTabs 추가
    - [탭 (Tabs)](/component-guide/tabs): default · plain 행에 SegmentedTabs 안내
    - 가이드 메뉴: 위 새 가이드 3개 등록
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/42cb883b45a61ced19e76a5594403c9d759028fd)
