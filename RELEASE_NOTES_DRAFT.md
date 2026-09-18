# 다음 릴리스 변경사항

## [Diff 확인]

### [기능] 마이페이지 목록 — 페이지 이동 시 목록 맨 위로 스크롤

- 대상:
    - src/components/custom/evaluation-result-list.tsx
    - src/components/custom/inquiry-list.tsx
    - src/components/custom/org-sub-account-list.tsx
    - src/components/custom/org-verification-application-list.tsx
- 변경: 페이지네이션으로 페이지를 넘길 때 화면 맨 위가 아니라 목록 맨 위("총 nn건" 줄)로 이동한다. 상단 고정 영역에 가리지 않도록 띄우는 거리를 화면 폭별로 둔다 — 모바일 224(헤더 56 + 마이페이지 드롭다운 152), 태블릿 112, PC 128.
- 결과: 모바일에서도 넘긴 페이지의 첫 항목이 드롭다운 바로 아래에서 시작한다. 움직임 줄이기 설정에서는 즉시 이동한다.
- 영향 화면:
    - [기업 평가결과 조회](/corp/mypage/evaluation-results)
    - [기업 1:1 문의](/corp/mypage/inquiry-history)
    - [기관 1:1 문의](/org/mypage/inquiry-history)
    - [기관 하위 계정 현황](/org/mypage/sub-account-progress)
    - [기관 평가검증 신청 조회](/org/mypage/verification-application)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1aa26e85)

### [스타일] 조회기간 필터 — 모바일 배치 통일

- 대상:
    - src/components/composite/search-filter-form.tsx
    - src/components/composite/company-info-load-dialog.tsx
- 변경: 좁은 화면에서 날짜 두 칸을 쌓을 때 `~`를 시작일 칸 오른쪽에 붙이고 종료일 칸이 한 줄을 다 쓰게 한다. 모달에만 쓰던 배치를 기본으로 합치고 옵션 `stackedTilde`를 제거했다.
- 결과: 조회기간이 있는 모든 화면의 모바일 배치가 기업정보 불러오기 모달과 같아진다.
- 영향 화면:
    - [기업 평가결과 조회](/corp/mypage/evaluation-results)
    - [기관 평가이력](/org/mypage/evaluation-history)
    - [K-BIGx 보고서 이력](/corp/mypage/k-bigx-report-history)
    - [기관 평가검증 신청 조회](/org/mypage/verification-application)
    - [SearchFilterForm 가이드](/component-guide/search-filter-form)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e6eef5b3)

### [스타일] 1:1 문의 목록 — 제목 줄바꿈과 상태 배지

- 대상: src/components/custom/inquiry-list.tsx
- 변경: 제목을 말줄임하지 않고 줄바꿈해 모두 보이게 하고, 답변 상태 배지를 제목 글 끝에 이어 붙인다. 모바일(768 미만)에서는 분류를 제목 위 줄로 올리고 세로 구분선을 감춘다.
- 결과: 제목이 긴 문의도 전체를 읽을 수 있고, 좁은 화면에서 제목 칸이 눌리지 않는다.
- 영향 화면:
    - [기업 1:1 문의](/corp/mypage/inquiry-history)
    - [기관 1:1 문의](/org/mypage/inquiry-history)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a6437b63)

### [스타일] 문의 등록 — 개인정보 동의 [내용보기] 모바일 배치

- 대상: src/components/custom/inquiry-form.tsx
- 변경: 모바일(768 미만)에서 [내용보기] 버튼을 동의 문구 아래 줄 오른쪽으로 내린다.
- 결과: 동의 안내 문구가 카드 폭을 다 써서 한 줄에 몇 글자씩 끊기지 않는다.
- 영향 화면:
    - [기업 문의하기](/corp/notice/inquiry-create)
    - [기관 문의하기](/org/notice/inquiry-create)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1c0a7cff)

### [스타일] 정보이용동의서 업로드 — [동의서 양식 다운로드] 모바일 배치

- 대상: src/components/composite/org-customer-consent-form.tsx
- 변경: 카드 제목 옆 버튼을 모바일(768 미만)에서 제목 아래 줄로 내린다(FormCard의 기존 `stackActionOnMobile` 사용).
- 결과: "정보이용동의서 업로드" 제목이 접히지 않는다.
- 영향 화면: [기관 KTRS-FM 고객동의](/org/individual-evaluation/ktrs-fm/customer-consent)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/7fc54cc3)

### [콘텐츠] 헤더·푸터 메뉴 추가

- 대상:
    - src/constants/header-navigation.ts
    - src/components/composite/footer.tsx
- 변경: 헤더 상단 유틸리티 줄의 [이용안내] 앞에 [가격정책]을 넣는다(로그인 전·후, 모바일 전체메뉴 포함). 푸터의 [이용약관] 다음에 [신용정보 활용체제]를 넣고, 기존 [가격 정책] 표기를 [가격정책]으로 맞춘다.
- 결과: 가격정책은 `/{userType}/pricing`, 신용정보 활용체제는 `/{userType}/credit-information-policy` 화면으로 연결된다(로그인 전 유틸리티 줄은 기존과 같이 임시 링크).
- 영향 화면:
    - [기업 홈](/corp/home)
    - [기관 홈](/org/home)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8c92474e)

### [컴포넌트] FormCard — 설명 전체 폭 옵션

- 대상: src/components/composite/form-card.tsx
- 변경: 제목 줄에만 액션을 두고 설명은 아래 전체 폭으로 펼치는 `descriptionFullWidth` 옵션을 추가하고, 제목·설명에 `break-keep`을 적용한다.
- 결과: 설명이 목록인 카드에서 좁은 화면 설명 칸이 눌리지 않는다.
- 영향 화면:
    - [Tech-Index 재무정보](/corp/technology-evaluation/tech-index/finance)
    - [대표자 역량 및 경력사항](/corp/technology-evaluation/tech-index/representative-capability)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/66783098)

### [스타일] 입력 폼 모바일 1단 배치

- 대상:
    - src/components/composite/company-info-form.tsx
    - src/components/composite/investment-model-company-info-form.tsx
    - src/components/composite/tech-index-company-info-form.tsx
    - src/components/composite/mypage-profile-form.tsx
    - src/components/composite/org-company-info-form.tsx
    - src/components/composite/company-etc-form.tsx
    - src/components/composite/career-form.tsx
    - src/components/composite/tech-index-finance-form.tsx
    - src/components/composite/tech-index-patent-form.tsx
- 변경: 주소 영역은 모바일에서 주소 · 상세주소 · [주소 검색] 순으로 한 단씩 쌓고, PC에서는 [주소 검색]이 주소 칸 오른쪽에 선다. 지식재산권 등록번호 줄도 모바일에서 입력 칸과 버튼을 한 단씩 내린다. 재무정보·경력사항 카드는 설명을 전체 폭으로 펼친다.
- 결과: 좁은 화면에서 입력 칸과 버튼이 서로 눌리지 않는다.
- 영향 화면:
    - [기업정보 입력](/corp/technology-evaluation/ktrs-fm/company-info)
    - [Tech-Index 기업정보](/corp/technology-evaluation/tech-index/company-info)
    - [투자모형 기업정보](/corp/technology-evaluation/investment-model/company-info)
    - [마이페이지 회원정보](/corp/mypage/profile)
    - [기관 기관정보](/org/mypage/profile)
    - [지식재산권](/corp/technology-evaluation/tech-index/patent)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/95930676)

#

- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/65e7a2c7)

## [기능] 이용약관 — 기술평가·K-BIGx 탭

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-out)/terms/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/terms/page.tsx
- 변경: 임시 섹션을 이용약관 본문(TermsTabs)으로 바꾼다. [기술평가 이용약관]·[K-BIGx 이용약관] 탭을 두고 ?tab= 으로 처음 탭을 고를 수 있다. K-BIGx 탭은 별도 경로(/terms/k-bigx)로도 연다.
- 결과: 기업·기관 모두 두 약관을 한 화면에서 탭으로 본다.
- 영향 화면:
    - [기업 이용약관](/corp/terms)
    - [기관 이용약관](/org/terms)

#

- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/71335a64)

## [콘텐츠] 신용정보 활용체제 — 공시 본문

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-out)/credit-information-policy/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/credit-information-policy/page.tsx
- 변경: "내용 추후 업데이트" 임시 섹션을 신용정보 활용체제 공시 본문(안내 · 항목 1~8 · 시행일)으로 바꾼다.
- 결과: 개인정보 처리방침 · K-BIGx 이용약관 링크가 각 화면으로 연결된다.
- 영향 화면:
    - [기업 신용정보 활용체제](/corp/credit-information-policy)
    - [기관 신용정보 활용체제](/org/credit-information-policy)

#

- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8c9e44e4)

## [기능] 가격정책 — 요금 안내와 결제하기

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-out)/pricing/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/pricing/page.tsx
- 변경: 임시 섹션을 무료·유료 서비스 요금 안내(PricingPolicy)로 바꾸고 화면 바탕을 옅은 회색으로 둔다. 표기를 "가격 정책"에서 "가격정책"으로 맞춘다.
- 결과: 요금 플랜의 [결제하기]가 결제 화면(/pricing/payment)으로 이어진다.
- 영향 화면:
    - [기업 가격정책](/corp/pricing)
    - [기관 가격정책](/org/pricing)

#

- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b6e20b3e)

## [기능] 메인 기술평가 [시작하기] — 평가모형 선택으로 연결

- 대상:
    - src/app/(user-type)/corp/home/page.tsx
    - src/app/(user-type)/corp/home-notice-popup/page.tsx
    - src/app/(user-type)/corp/full-menu/page.tsx
- 변경: 메인 롤링 영역 첫 번째 기술평가 [시작하기]의 이동 경로를 Tech-Index 선택에서 평가모형 선택 화면으로 바꾼다.
- 결과: KTRS-FM · Tech-Index · 투자모형 중 하나를 고른 뒤 평가를 시작한다.
- 영향 화면:
    - [기업 홈](/corp/home)
    - [기술평가 평가모형 선택](/corp/home/technology-evaluation-model-selection)

#

- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/45438700)

## [스타일] Tech-Index 평가모형 선택 — 시안 변경 반영

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/selection/tech-index-model-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/selection/tech-index-model-form.tsx
- 변경: (일반) 카드 일러스트를 로켓 그림으로 바꿔 148×100 자리 가운데에 95×92로 놓는다. 제목의 괄호 앞 띄어쓰기를 뺀다(혁신성장역량지수(일반) · (창업)).
- 결과: 시안 "SB-FOTA-CM0-0103_Tech-Index_평가모형선택"과 같아진다.
- 영향 화면:
    - [기업 Tech-Index 선택](/corp/technology-evaluation/tech-index/selection)
    - [기관 Tech-Index 선택](/org/individual-evaluation/tech-index/selection)

#

- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/87bdf98f)

## [스타일] 옵션카드 일러스트 — 그림 기준 파일명으로 변경

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/selection/tech-index-model-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/selection/tech-index-model-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/batch-evaluation-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/verification-progress/evaluation-method-form.tsx
- 변경: public/images/option-card/ 이미지 이름을 모델명이 아니라 그림 내용으로 바꾸고, 위 파일의 illustration 경로를 새 이름으로 고친다. 폴더 위치는 그대로이고, 아래 4개는 이름만 바뀌었다(그림 같음).
    - growth-index.webp → shield-certificate.webp (방패·인증서)
    - startup-tech-index.webp → lightbulb-magnifier.webp (전구·돋보기)
    - ktrs-fm.webp → rating-magnifier.webp (별점·돋보기)
    - investment.webp → chart-money-bag.webp (차트·돈주머니)
    - Tech-Index 선택 (일반) 카드만 그림 자체도 바뀐다: growth-index.webp(방패·인증서) → rocket-growth.webp(로켓·성장 그래프)
- 결과: 이전 이름 4개 파일은 삭제된다 — 이전 이름으로 참조하는 코드가 있으면 새 이름으로 바꿔야 한다. 새 이름 파일은 [신규 추가]의 "옵션카드 일러스트" 카드로 받는다.
- 영향 화면:
    - [기업 Tech-Index 선택](/corp/technology-evaluation/tech-index/selection)
    - [기관 Tech-Index 선택](/org/individual-evaluation/tech-index/selection)
    - [기관 일괄평가](/org/batch-evaluation/evaluation-history-or-batch)
    - [기관 평가진행방식 선택](/org/individual-evaluation/verification-progress)

#

- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2a61a7c9)

## [스타일] 푸터 — 태블릿 유틸 링크 배치

- 대상: src/components/composite/footer.tsx
- 변경: 로고와 유틸 링크를 PC(xl)부터 한 줄에 두고, 태블릿까지는 링크를 로고 아래 한 줄로 내린다.
- 결과: 태블릿 폭에서 [공지사항]만 아래 줄로 떨어지지 않는다.
- 영향 화면:
    - [기업 홈](/corp/home)
    - [기관 홈](/org/home)

## [신규 추가]

### [기능] 기술평가 평가모형 선택

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-out)/home/technology-evaluation-model-selection/page.tsx
    - src/components/custom/evaluation-model-selection.tsx
    - src/content/service/evaluation-model-selection.ts
- 적용: 신규 파일 추가(일러스트는 [신규 추가]의 "옵션카드 일러스트 — 이미지 파일" 카드)
- 내용: KTRS-FM · Tech-Index · 투자모형 카드(라디오) 중 하나를 고르면 [다음]이 켜지고, 고른 뒤 [다음]이 보이도록 스크롤한다. 카드마다 색에 맞는 그라데이션 테두리를 hover·포커스·선택 때 보인다.
- 영향 화면: [기술평가 평가모형 선택](/corp/home/technology-evaluation-model-selection)

### [기능] 이용약관 · 신용정보 활용체제 · 가격정책 본문

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-out)/terms/k-bigx/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/terms/k-bigx/page.tsx
    - src/components/custom/terms-tabs.tsx
    - src/content/service/terms.ts
    - src/components/custom/credit-information-policy.tsx
    - src/content/service/credit-information-policy.ts
    - src/components/custom/pricing-policy.tsx
    - src/content/service/pricing.ts
    - public/images/pricing/icon-won-light.webp
    - public/images/pricing/icon-won-dark.webp
- 적용: 신규 파일 추가
- 내용: 약관 탭 · 신용정보 활용체제 공시 · 요금 안내 본문 컴포넌트와 문구 데이터. 원화 아이콘은 라이트·다크 이미지를 테마에 따라 바꿔 보인다.
- 영향 화면:
    - [기업 K-BIGx 이용약관](/corp/terms/k-bigx)
    - [기관 K-BIGx 이용약관](/org/terms/k-bigx)

### [기능] 결제하기 · 판매자 정보 · 결제 완료

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-out)/pricing/payment/
    - src/app/(user-type)/org/(service)/(logged-out)/pricing/payment/
    - src/components/custom/pricing-payment.tsx
    - src/content/service/pricing-payment.ts
    - src/components/composite/seller-info-dialog.tsx
    - src/components/composite/payment-complete-dialog.tsx
- 적용: 신규 파일 추가
- 내용: 이용권 플랜 선택 · 결제 정보 · 약관 동의 후 결제하는 화면과 판매자 정보 · 결제 완료 모달. [이용약관] 링크는 약관 첫 탭을 연다.
- 영향 화면:
    - [기업 결제하기](/corp/pricing/payment)
    - [기업 판매자 정보](/corp/pricing/payment/seller-info)
    - [기업 결제 완료](/corp/pricing/payment/complete)
    - [기관 결제하기](/org/pricing/payment)
    - [기관 판매자 정보](/org/pricing/payment/seller-info)
    - [기관 결제 완료](/org/pricing/payment/complete)

### [기능] K-BIGx 보고서 모달

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/
    - src/app/(user-type)/corp/(service)/(logged-out)/k-bigx-report/
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/
    - src/components/composite/k-bigx-legal-basis-dialog.tsx
    - src/components/composite/k-bigx-marketing-consent-dialog.tsx
    - src/components/composite/k-bigx-terms-agreement-dialog.tsx
    - src/components/composite/k-bigx-report-create-dialog.tsx
    - src/components/composite/k-bigx-report-print-dialog.tsx
    - src/components/composite/k-bigx-pass-purchase-guide-dialog.tsx
    - src/components/composite/k-bigx-view-count-deduction-dialog.tsx
    - src/components/composite/k-bigx-login-guide-dialog.tsx
    - src/content/service/k-bigx-*.ts
- 적용: 신규 파일 추가
- 내용: 기업정보 제공 법적 근거 · 마케팅 활용 동의 · 이용약관 동의 · 보고서 생성(특허수 있음/없음) · 보고서 출력 · 이용권 구매 안내 · 이용횟수 차감 · 보고서 이용 안내(로그인) 모달과 모달 단독 화면. 긴 기업명도 말줄임 없이 모두 보인다.
- 영향 화면:
    - [기업 법적 근거](/corp/k-bigx-report/innovation-growth-report/legal-basis)
    - [기업 마케팅 활용 동의](/corp/k-bigx-report/innovation-growth-report/marketing-consent)
    - [기업 이용약관 동의](/corp/k-bigx-report/innovation-growth-report/terms-of-service)
    - [기업 보고서 생성](/corp/k-bigx-report/innovation-growth-report/report-search-results/report-create)
    - [기업 보고서 생성(특허 없음)](/corp/k-bigx-report/innovation-growth-report/report-search-results/report-create/no-patent)
    - [기업 보고서 출력](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [기업 이용권 구매 안내](/corp/k-bigx-report/innovation-growth-report/pass-purchase-guide)
    - [기업 이용횟수 차감](/corp/k-bigx-report/innovation-growth-report/view-count-deduction)
    - [기업 보고서 이용 안내](/corp/k-bigx-report/innovation-growth-report/login-guide)
    - [기관 법적 근거](/org/k-bigx-report/innovation-growth-report/legal-basis)
    - [기관 보고서 출력](/org/k-bigx-report/innovation-growth-report/report-print)
    - [기관 이용권 구매 안내](/org/k-bigx-report/innovation-growth-report/pass-purchase-guide)

### [스타일] 옵션카드 일러스트 — 이미지 파일

- 대상:
    - public/images/option-card/shield-certificate.webp
    - public/images/option-card/lightbulb-magnifier.webp
    - public/images/option-card/rating-magnifier.webp
    - public/images/option-card/chart-money-bag.webp
    - public/images/option-card/rocket-growth.webp
    - public/images/option-card/speed-gauge.webp
    - public/images/option-card/building-coins.webp
- 적용: 신규 파일 추가 + 이전 파일 삭제
    - 삭제: growth-index.webp · startup-tech-index.webp · ktrs-fm.webp · investment.webp
- 내용:
    - 이름만 바뀐 파일(그림 같음): shield-certificate(← growth-index) · lightbulb-magnifier(← startup-tech-index) · rating-magnifier(← ktrs-fm) · chart-money-bag(← investment)
    - 새 그림: rocket-growth(로켓·성장 그래프 — 평가모형 선택 Tech-Index 카드, Tech-Index 선택 (일반) 카드) · speed-gauge(게이지 — 평가모형 선택 KTRS-FM 카드) · building-coins(빌딩·동전 — 평가모형 선택 투자모형 카드)
- 영향 화면: 옵션카드·라디오카드 일러스트를 쓰는 모든 화면

## [덮어쓰기]

### [문서] 접근성 예외 문서 — W3C 검사기 문구 갱신

- 대상: src/app/component-guide/(guide)/accessibility-exceptions/page.tsx
- 적용: 지정한 파일만 교체
- 내용: required select 예외의 검사기 메시지를 현재 판(descendant “option”)으로 맞추고 이전 판 문구를 같은 항목으로 모은다. 해당 예외는 8건·2개 화면으로 집계된다.
- 영향 화면: [접근성 예외 기록](/component-guide/accessibility-exceptions)

### [스타일] 입력 칸 — 안내 문구 말줄임

- 대상: src/components/theme/input.variants.ts
- 적용: 지정한 파일만 교체
- 내용: 칸이 좁아 안내 문구(placeholder)가 넘치면 끝을 말줄임(…)으로 줄인다. 입력한 값도 포커스가 없을 때 같은 방식으로 줄여 보인다.
- 영향 화면: 입력 칸을 쓰는 모든 화면

### [스타일] 셀렉트 목록 — 긴 항목 줄바꿈

- 대상: src/components/theme/select.variants.ts
- 적용: 지정한 파일만 교체
- 내용: 항목 높이를 최소 높이로 바꾸고 위아래 여백과 낱말 단위 줄바꿈(break-keep)을 둔다.
- 영향 화면: 셀렉트를 쓰는 모든 화면 — 긴 항목이 잘리지 않고 여러 줄로 보인다

### [문서] 옵션카드 · 라디오카드 가이드 — 일러스트 경로

- 대상:
    - src/app/component-guide/(guide)/option-card/page.tsx
    - src/app/component-guide/(guide)/radio-card/radio-card-demo.tsx
    - src/app/component-guide/(demo)/self-diagnosis/evaluation-model/page.tsx
- 적용: 지정한 파일만 교체
- 내용: 옵션카드 일러스트 경로를 새 이름으로 바꾼다(growth-index → shield-certificate, startup-tech-index → lightbulb-magnifier).
- 영향 화면:
    - [OptionCard 가이드](/component-guide/option-card)
    - [RadioCard 가이드](/component-guide/radio-card)
