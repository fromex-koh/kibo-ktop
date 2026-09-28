# 다음 릴리스 변경사항

## [Diff 확인]

### [스타일] 스테퍼 현재 단계 번호 색 교체

- 대상:
    - src/components/composite/step-progress.tsx
    - src/components/composite/step-header.tsx
- 변경:
    - 현재 번호 강조를 primary(blue.500)에서 primary-strong(blue.600)으로 바꿨습니다.
- 결과:
    - 옅은 회색 면 위 대비가 3.59:1 에서 4.69:1 로 올랐습니다.
- 영향 화면:
    - [StepProgress 가이드](/component-guide/step-progress)
    - [StepHeader 가이드](/component-guide/step-header)
    - [기업 KTRS-FM 고객정보 활용 동의](/corp/technology-evaluation/ktrs-fm/customer-consent)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/df815a48)

### [스타일] 기업혁신성장 조회의 건수 · 이용횟수 강조 색 교체

- 대상:
    - src/components/custom/innovation-growth-report-lookup.tsx
- 변경:
    - 목록 제목의 '총 n건' 숫자와 이용횟수 안내의 강조값을 primary-strong 으로 바꿨습니다.
    - 숫자는 크기를 그대로 두고 Bold 로 세웠습니다.
- 결과:
    - 숫자 대비 4.69:1, 이용횟수 강조값 4.86:1 입니다.
- 영향 화면:
    - [기업 기업 선택 결과](/corp/k-bigx-report/innovation-growth-report/search-result/company/selected)
    - [기관 기업 선택 결과](/org/k-bigx-report/innovation-growth-report/search-result/company/selected)
    - [기업 특허 검색 결과](/corp/k-bigx-report/innovation-growth-report/search-result/patent)
    - [기관 특허 검색 결과](/org/k-bigx-report/innovation-growth-report/search-result/patent)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f089e40b)

### [스타일] 대량정보조회 실패 건수 색 교체

- 대상:
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/bulk-data-search/bulk-data-search-form.tsx
- 변경:
    - 문제 건수 강조를 error.500 에서 destructive(error.600)로 바꿨습니다.
- 결과:
    - 실패 안내의 건수 글자가 본문 대비 기준을 충족합니다.
- 영향 화면:
    - [기관 대량정보조회 실패](/org/k-bigx-report/bulk-data-search/failure)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/7823f236)

### [마크업] 신용정보 활용체제 시행일을 이름 · 값 쌍으로 교체

- 대상:
    - src/components/custom/credit-information-policy.tsx
    - src/content/service/credit-information-policy.ts
- 전:
    - 문서 끝 '시행일 2026년 0월 0일' 이 굵은 한 줄 문단이라 검사기가 제목으로 오인했습니다.
- 후:
    - 이름('시행일')과 값('2026년 0월 0일')으로 나눠 dl · dt · dd 로 바꿨습니다(보이는 한 줄은 그대로).
- 영향 화면:
    - [기업 신용정보 활용체제](/corp/credit-information-policy)
    - [기관 신용정보 활용체제](/org/credit-information-policy)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fdb87dd1)

### [마크업] 보고서 문서의 본문 상자(main)와 중복 id 정리

- 대상:
    - src/components/custom/innovation-growth-report-document.tsx
    - src/components/custom/innovation-growth-report-parts.tsx
- 전:
    - 문서(page.tsx)와 스켈레톤(loading.tsx)이 각자 main 을 그려, 내려받는 HTML 한 벌에 main 과 id 가 두 벌씩 담겼습니다.
- 후:
    - main 은 layout.tsx 가 하나만 그리고, 문서와 스켈레톤은 안쪽 내용만 그립니다.
    - 스켈레톤의 구획 id 는 없애고 aria-label 로 대신합니다(SectionTitle 의 id 를 선택 값으로 바꿨습니다).
- 영향 화면:
    - [기업 기업혁신성장 진단 브리핑](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 기업혁신성장 진단 브리핑](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 참고:
    - main 을 그리는 layout.tsx 는 신규 추가입니다 — "[화면] 보고서 문서의 본문 상자 레이아웃" 카드를 함께 봅니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a7a28bbc)

### [마크업] 보고서 탭에 짝이 되는 패널 연결

- 대상:
    - src/components/custom/innovation-growth-report-document.tsx
- 전:
    - 탭 버튼만 있고 짝이 되는 패널이 없었습니다.
    - 로딩 중 탭 메뉴(모양만 있는 껍데기)도 누를 수 없는데 탭 역할을 달고 있었습니다.
- 후:
    - 본문을 TabsContent 로 감싸 버튼과 짝을 맞췄습니다.
    - 로딩 중 탭 메뉴는 탭 역할과 id 를 떼어 단순 표시(span + aria-hidden)로 바꿨습니다.
- 영향 화면:
    - [기업 기업혁신성장 진단 브리핑](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 기업혁신성장 진단 브리핑](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a7a28bbc)

### [마크업] 차입금 현황 표의 열 선언 보정

- 대상:
    - src/components/custom/innovation-growth-report-credit.tsx
- 전:
    - 앞 두 칸의 폭만 col 로 선언해, 연도별 금액 · 비중 칸이 선언되지 않은 채 남았습니다(선언한 열보다 셀이 많아 오류).
- 후:
    - col span={연도 수 × 2} 로 나머지 열을 함께 선언합니다(폭은 주지 않아 보이는 모습 동일).
- 영향 화면:
    - [기업 기업혁신성장 진단 브리핑](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 기업혁신성장 진단 브리핑](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/09282068)

### [마크업] 칸 막대(SegmentMeter)를 글줄 안에 놓을 수 있는 태그로 교체

- 대상:
    - src/components/custom/segment-meter.tsx
    - src/components/composite/segment-meter-skeleton.tsx
- 전:
    - 글줄 안에 놓이는데 바깥이 div 였습니다(div 는 span 안에 들어갈 수 없습니다).
- 후:
    - span + inline-flex 로 바꿨습니다(보이는 모습 동일).
- 영향 화면:
    - [SegmentMeter 가이드](/component-guide/segment-meter)
    - [기업 기업혁신성장 진단 브리핑](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 기업혁신성장 진단 브리핑](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/febe68b6)

### [마크업] 이력 목록에서 값 사이 세로선을 감싸던 태그 교체

- 대상:
    - src/components/composite/history-list.tsx
- 변경:
    - 이력 한 줄에 값이 여러 개일 때 값과 값 사이에 세로선을 넣습니다. 이 세로선과 값을 함께 감싸던 태그를 span 에서 div 로 바꿨습니다.
- 이유:
    - 세로선을 그리는 InlineSeparator 가 div 인데, div 는 span 안에 들어갈 수 없습니다.
- 결과:
    - 값이 둘 이상인 줄마다 나던 마크업 오류가 사라졌습니다.
    - 화면에 보이는 모습은 그대로입니다(둘 다 flex 로 배치합니다).
- 영향 화면:
    - [HistoryList 가이드](/component-guide/history-list)
    - [기업 K-BIGx 보고서 발급이력](/corp/mypage/k-bigx-report-history)
    - [기관 평가이력](/org/mypage/evaluation-history)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/32892d27)

### [데이터] 기보 ONE 플랫폼 주소 상수 추가

- 대상:
    - src/constants/site.ts
- 변경:
    - 기업회원 로그인이 나가는 외부 사이트 주소를 상수로 추가했습니다.
    - 실제 진입 주소는 백엔드에서 받는다는 안내를 주석으로 남겼습니다.
- 결과:
    - 로그인 화면이 주소를 직접 쓰지 않고 이 상수를 참조합니다.
- 영향 화면:
    - [기업 로그인](/corp/auth)
    - [기관 로그인](/org/auth)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a3af5ee4)

## [신규 추가]

### [화면] 로그인

- 대상:
    - src/components/custom/login-screen.tsx
    - src/components/theme/member-type-tabs.variants.ts
    - src/content/service/login.ts
    - src/components/composite/login-find-account-dialog.tsx
    - src/components/composite/login-agency-signup-guide-dialog.tsx
    - src/app/(user-type)/corp/(service)/(logged-out)/auth/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-out)/auth/find-account/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-out)/auth/agency-signup-guide/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/auth/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/auth/find-account/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/auth/agency-signup-guide/page.tsx
    - public/images/login/office-building.webp
    - public/images/login/bank-building.webp
- 적용: 신규 파일 추가
- 내용:
    - 기업회원 · 기관회원을 한 화면에서 탭으로 오갑니다.
    - 기업회원은 기보 ONE 플랫폼으로 나가고, 기관회원은 아이디 · 비밀번호를 입력합니다.
    - [아이디 · 비밀번호 찾기]와 [회원가입]이 여는 안내 모달 둘, 그 모달만 확인하는 주소를 함께 둡니다.
- 이어서 할 일:
    - 빈 값 검사와 로그인 실패 안내는 문구 확인용 목업입니다. 이어서 작업할 자리를 주석으로 표시해 두었습니다.

### [화면] 보고서 문서의 본문 상자 레이아웃

- 대상:
    - src/app/(user-type)/corp/(report)/k-bigx-report/innovation-growth-report/diagnostic-briefing/layout.tsx
    - src/app/(user-type)/org/(report)/k-bigx-report/innovation-growth-report/diagnostic-briefing/layout.tsx
- 적용: 신규 파일 추가
- 내용:
    - 문서와 스켈레톤이 공유하는 main 을 이 자리에서 하나만 그립니다.

## [덮어쓰기]

### [스타일] 배지 파스텔/오렌지 글자색 교체

- 대상:
    - src/components/theme/badge.variants.ts
- 적용: 지정한 파일만 교체
- 변경:
    - 파스텔/오렌지 글자를 orange.700 에서 orange.800 으로 바꿨습니다.
- 결과:
    - 대비가 4.27:1 에서 6.34:1 로 올랐습니다.
- 영향 화면:
    - [Badge 가이드](/component-guide/badge)

### [스타일] 입력 탭의 '미작성' 상태 글자색 교체

- 대상:
    - src/components/theme/form-tab-title.variants.ts
- 적용: 지정한 파일만 교체
- 변경:
    - 미작성 상태 글자를 disabled(gray.300)에서 foreground-subtle(gray.500)로 바꿨습니다.
    - 세 상태(미작성 · 작성중 · 작성완료)가 같은 색이 되고 굵기로만 갈립니다.
- 결과:
    - 자가진단 입력 화면 전체(기업 · 기관)의 미작성 표시가 본문 대비 기준을 충족합니다.
- 영향 화면:
    - [FormTabs 가이드](/component-guide/form-tabs)
    - [기업 기업기술정보](/corp/technology-evaluation/ktrs-fm/company-technology-info)

### [문서] 컴포넌트 가이드 — 접근성 검사 예외사항 · 시맨틱 색상

- 대상:
    - src/app/component-guide/(guide)/accessibility-exceptions/page.tsx
    - src/app/component-guide/(guide)/semantic-color/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - 로그인 화면과 K-BIGx 조회 · 특허등급평가 결과 화면의 WAVE 기록을 추가했습니다.
    - 새로 나눈 배지 테두리 토큰을 시맨틱 색상 목록에 등록했습니다.
- 문서: [접근성 검사 예외사항](/component-guide/accessibility-exceptions)

### [토큰] 디자인 토큰

- 대상:
    - tokens.json
- 적용: 지정한 파일만 교체
- 할 일:
    - tokens.json 만 교체하면 됩니다. 생성물 src/app/tokens.css 는 따로 받지 않습니다.
    - yarn dev 또는 yarn build 를 실행하면 tokens.css 가 다시 만들어집니다(predev · prebuild 가 yarn tokens 를 돌립니다).
- 바뀐 값:
    - 파스텔/빨강 글자 — error.500 에서 error.600 으로
    - 솔리드/회색 배경 — gray.300 에서 gray.500 으로
    - 아웃라인/회색 — 테두리(gray.300)와 글자(gray.500)를 서로 다른 토큰으로 분리

### [문서] 퍼블리싱 인덱스 — 로그인 · 탄소 로그인 행 추가

- 대상:
    - src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
- 적용: 지정한 파일만 교체
- 내용:
    - 기업 · 기관의 로그인과 모달 두 개를 완료로 등록했습니다.
    - 탄소 FO 의 로그인 화면과 하위 팝업 두 개를 완료로 추가했습니다.
