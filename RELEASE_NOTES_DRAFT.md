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
