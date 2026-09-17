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

### [기능] 기업정보 불러오기 모달 — 표 → 라디오 목록 + [선택]

- 대상: src/components/composite/company-info-load-dialog.tsx
- 이전: 표 목록 · 줄을 누르면 바로 입력되고 닫힘 · 버튼 `조회`
- 지금: 기본 모달 폭(`max-w-modal`)으로 바꿨습니다.
    - 조회: `오늘` · `1개월` · `3개월` · `전체` / 시작일 `~` 종료일 / `기업명 입력` · `초기화` · `검색`
    - 목록: `KTRS-FM | 총 N건` 아래 라디오 목록 — 기업명 + `기업 사업자번호` · `조회 기관` · `평가일`
    - 페이지: 한 쪽 10줄, 목록 상자는 다섯 줄 높이까지 보이고 안에서 스크롤, 아래에 페이지 이동
    - `선택`: 라디오로 줄을 골라야 활성, 누르면 그 기업 정보가 입력되고 닫힘
    - 빈 결과: `이력이 없습니다.` · `선택` 비활성
    - 모바일(640 미만): 종료일은 아래 줄 · `초기화` `검색` 은 기업명 아래 반씩 · 보조 정보 세로 배치
- 연동: props 는 그대로입니다. `onSelect` 호출 시점만 줄 클릭 → `선택` 클릭으로 바뀌었습니다.
- 영향 화면: [기관 KTRS-FM 기업정보 관리](/org/individual-evaluation/ktrs-fm/company-info/company-management) · [기관 투자모형 기업정보 관리](/org/individual-evaluation/investment-model/company-info/company-management) · [기관 Tech-Index 일반 기업정보 관리](/org/individual-evaluation/tech-index/general/company-info/company-management) · [기관 Tech-Index 창업 기업정보 관리](/org/individual-evaluation/tech-index/startup/company-info/company-management)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/7322e8f3)

### [기능] 조회 필터 — 모바일 날짜 `~` 위치 옵션 추가

- 대상: src/components/composite/search-filter-form.tsx
- 추가: `DateRangeField` 의 `stackedTilde`(기본 `'center'`) — 모바일에서 `~` 를 시작일 칸 오른쪽에 붙이려면 `'inline'`
- 유지: 기본값이 기존 동작과 같아 다른 조회 화면은 바뀌지 않습니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/7f9dfab9)

### [데이터] 기업정보 불러오기 목업 — 긴 이름 케이스 추가

- 대상: src/content/service/company-info-load.ts
- 추가: 긴 기업명 2건 · 긴 조회 기관 2건(줄바꿈 확인용)
- 유지: 한 쪽 10줄 페이징과 반환 모양은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2da7c82f)

### [기능] 혁신성장영위기업 분류근거 모달 — 표 → 묶음별 라디오 목록 + [선택]

- 대상: src/components/composite/technology-category-dialog.tsx
- 이전: 테마·분야·주요품목 3열 표 · 품목명을 누르면 바로 입력되고 닫힘 · 줄마다 품목설명 모달
- 지금:
    - 위: 셀렉트(`품목분류 전체` · 테마) · `품목명·분야·품목분류 검색` · `초기화` · `검색`
    - 목록: `총 N건` 아래 `테마 | 분야` 묶음별 줄(라디오 · 품목명 · `품목설명`), 묶음 머리는 스크롤 시 위에 고정
    - `선택`: 라디오로 하나를 골라야 활성, 누르면 그 품목 하나의 정보를 넘기고 닫힘 · 다시 열면 선택이 비워짐
    - 검색·초기화: 응답을 기다리는 동안 `불러오는 중입니다.`(LoadingState), 결과 없으면 `조회 결과가 없습니다.`
    - 성능: 품목설명 모달은 하나를 나눠 쓰고, 240줄은 창을 먼저 띄운 뒤 채웁니다.
- 연동: `onSelect` 가 `{code, theme, field, name}` 한 건을 받습니다. `code` 는 코드 데이터가 없어 원문 항목 번호를 임시로 씁니다. 조회는 아래 [데이터] 카드의 함수 한 곳입니다.
- 영향 화면: 모달 확인 화면 — [기업 일반 기술분류](/corp/technology-evaluation/tech-index/general/company-info/technology-category) · [기업 일반 품목설명](/corp/technology-evaluation/tech-index/general/company-info/item-description) · [기업 창업 기술분류](/corp/technology-evaluation/tech-index/startup/company-info/technology-category) · [기업 창업 품목설명](/corp/technology-evaluation/tech-index/startup/company-info/item-description) · [기관 일반 기술분류](/org/individual-evaluation/tech-index/general/company-info/technology-category) · [기관 일반 품목설명](/org/individual-evaluation/tech-index/general/company-info/item-description) · [기관 창업 기술분류](/org/individual-evaluation/tech-index/startup/company-info/technology-category) · [기관 창업 품목설명](/org/individual-evaluation/tech-index/startup/company-info/item-description) · [기관 투자모형 기술분류](/org/individual-evaluation/investment-model/company-info/technology-category) · [기관 투자모형 품목설명](/org/individual-evaluation/investment-model/company-info/item-description)
    - 기업정보 탭 기술분류 [조회] — [기업 Tech-Index 일반 기업·기술정보 입력](/corp/technology-evaluation/tech-index/general/company-technology-info) · [기업 Tech-Index 창업 기업·기술정보 입력](/corp/technology-evaluation/tech-index/startup/company-technology-info) · [기관 Tech-Index 일반 기업·기술정보 입력](/org/individual-evaluation/tech-index/general/company-technology-info) · [기관 Tech-Index 창업 기업·기술정보 입력](/org/individual-evaluation/tech-index/startup/company-technology-info)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/37400cbb)

### [데이터] 분류근거 조회 — 비동기 조회 함수 · 목업 응답 지연

- 대상: src/content/service/technology-categories.ts
- 추가: `fetchTechnologyCategoryGroups(query)` — 목업이 `MOCK_RESPONSE_DELAY_MS`(0.8초) 뒤에 거른 결과를 돌려줍니다.
- 연동: 이 함수 안을 검색 API 로 바꾸고 `filterTechnologyCategoryGroups` · 지연 값은 지웁니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2fab4ce3)

### [기능] Tech-Index 기업정보 — 기술분류 네 칸 · 상장구분 정렬

- 대상: src/components/composite/tech-index-company-info-form.tsx
- 이전: 1번 칸은 임시 코드 `0000`, 고른 품목명은 2~4번 빈 칸에 하나씩 · 지울 방법 없음
- 지금:
    - 기술분류: 고른 품목 하나를 네 칸에 나눠 입력 — `품목코드` · `품목분류`(테마) · `품목분야`(분야) · `품목명` · 다시 고르면 덮어씀
    - 값이 있는 칸에 X — 어느 칸을 눌러도 네 칸을 함께 비움 · 배치는 기존 그대로(1번 + `조회` / 아래 3칸)
    - 상장구분·기업형태 선택지: 양끝 정렬은 PC(1280 이상)에서만, 태블릿·모바일은 앞에서부터 차례로
- 영향 화면: [기업 Tech-Index 일반 기업·기술정보 입력](/corp/technology-evaluation/tech-index/general/company-technology-info) · [기업 Tech-Index 창업 기업·기술정보 입력](/corp/technology-evaluation/tech-index/startup/company-technology-info) · [기관 Tech-Index 일반 기업·기술정보 입력](/org/individual-evaluation/tech-index/general/company-technology-info) · [기관 Tech-Index 창업 기업·기술정보 입력](/org/individual-evaluation/tech-index/startup/company-technology-info)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/927e5866)

### [기능] ClearableInput — 읽기 전용 칸 지우기 옵션 · X 버튼 type 수정

- 대상: src/components/composite/clearable-input.tsx
- 추가: `clearableWhenReadOnly` — 읽기 전용이어도 값이 있으면 X 를 늘 보입니다(기본 끔). 스타일은 아래 [덮어쓰기] `clearable-input.variants.ts`.
- 수정: X 버튼에 `type="button"` — 폼 안에서 X 를 누르면 폼 제출·전체 검사가 돌던 문제를 막습니다.
- 영향 화면: ClearableInput 을 쓰는 모든 폼
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5c85da4e)

### [기능] 업종코드 조회 모달 — 중분류 → 세분류 두 단계

- 대상: src/components/composite/industry-code-dialog.tsx
- 이전: 중분류 표와 그 아래 업종 표 · `검색` 만 있음 · 하단 `닫기` · `선택저장`
- 지금:
    - 위: `꼭 알아두세요` · `중분류명 또는 코드 검색`(세분류 단계는 `세분류명 또는 코드 검색`) · `초기화` · `검색`
    - 1단계: `전체 중분류 N건` 목록(이름 · 코드 · 화살표) — 줄을 누르면 세분류로 이동
    - 2단계: `세분류 N건` 라디오 목록 — 고르면 `선택` 활성, 누르면 값을 넘기고 닫힘
    - 하단: `이전`(세분류 단계에서만) · `선택`
    - 조회 중 `불러오는 중입니다.`, 결과 없으면 `검색내역이 없습니다.`
- 연동: `onSelect({code, name, label})` 는 그대로입니다. 조회는 아래 [신규 추가] `industry-codes.ts` 한 곳입니다.
- 영향 화면: [기업 업종코드 조회](/corp/technology-evaluation/ktrs-fm/company-info/industry-code-search) · [기관 업종코드 조회](/org/individual-evaluation/ktrs-fm/company-info/industry-code-search) · 업종코드 [조회]가 있는 기업정보·마이페이지 폼
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2db880ff)

### [기능] 기업정보 불러오기 — 검색·초기화 동작 · 로딩 안내

- 대상: src/components/composite/company-info-load-dialog.tsx
    - src/content/service/company-info-load.ts
- 지금: `검색` 은 조회기간·기업명으로 거른 목록, `초기화` 는 처음 목록으로 돌아감 · 응답이 0.3초 넘으면 `불러오는 중입니다.`
- 추가: `fetchCompanyInfoLoadResult` — 목업이 `MOCK_RESPONSE_DELAY_MS`(0.8초) 뒤에 돌려줍니다(모달 기본 조회 함수).
- 연동: 이 함수 안을 조회 API 로 바꾸고 목업 거르기(`filterItems`) · 지연 값은 지웁니다.
- 영향 화면: [기관 KTRS-FM 기업정보 관리](/org/individual-evaluation/ktrs-fm/company-info/company-management) 외 기업정보 관리 3화면
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b7a73024)

### [기능] 홈 공지 팝업 — 하단 `닫기` 삭제

- 대상: src/components/custom/home-notice-popup.tsx
- 지금: 하단에는 `오늘 하루 열지 않기` 만 둡니다(시안 확정 전 임시).
- 영향 화면: [기업 홈 공지 팝업](/corp/home-notice-popup) · [기관 홈 공지 팝업](/org/home-notice-popup)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0ff98ba2)

## [신규 추가]

### NoticeAccordion 컴포넌트

- 대상: src/components/composite/notice-accordion.tsx
    - src/components/theme/notice-accordion.variants.ts
- 적용: 신규 파일 추가 — `꼭 알아두세요` 접이식 안내. PC(1280 이상)는 펼침, 태블릿·모바일은 접힘

### LoadingState 컴포넌트

- 대상: src/components/composite/loading-state.tsx
- 적용: 신규 파일 추가 — 목록 자리의 `불러오는 중입니다.` 안내(EmptyState 와 같은 자리·모양)

### 업종코드 조회 데이터

- 대상: src/content/service/industry-codes.ts
- 적용: 신규 파일 추가 — `fetchIndustryCodeGroups` · `fetchIndustrySubCodes`(목업 0.8초 지연)
- 데이터: 새 데이터가 아닙니다. 기존 `src/content/technology-evaluation/industry-codes.json`(중분류 77 · 세분류 1,205)을 그대로 불러 쓰며 JSON 은 바뀌지 않았습니다.

## [덮어쓰기]

### 컴포넌트 가이드 — NoticeAccordion · LoadingState 추가 · WAVE 예외 기록

- 대상: src/app/component-guide/(guide)/notice-accordion/page.tsx
    - src/app/component-guide/(guide)/loading-state/page.tsx
    - src/constants/publishing-guide.ts
    - src/app/component-guide/(guide)/accessibility-exceptions/page.tsx
- 적용: 지정한 파일만 교체
- 내용: WAVE 예외에 기업정보 관리 4화면(RadioGroup 4건) · 기술분류·품목설명 10화면(Select missing label 1건)을 기록
- 확인: [NoticeAccordion](/component-guide/notice-accordion) · [LoadingState](/component-guide/loading-state) · [접근성 예외](/component-guide/accessibility-exceptions)

### [스타일] 토스트 — 로딩 스피너 위치

- 대상: src/components/theme/sonner.variants.ts
- 적용: 지정한 파일만 교체
- 내용: `toast.promise` · `toast.loading` 의 스피너가 토스트 가운데에 겹치던 것을 글자 왼쪽 아이콘 자리(20×20)로 옮깁니다.
- 확인: [Toast](/component-guide/toast) "비동기 상태와 수동 제어"

### [스타일] 모달 하단 버튼 — 모바일에서도 좌우 배치

- 대상: src/components/theme/dialog.variants.ts
- 적용: 지정한 파일만 교체
- 내용: 모바일(640 미만)에서 세로로 쌓던 버튼을 한 줄에 반씩 둡니다(간격 8, PC 16) · 버튼 최소 폭은 이 자리에서 풉니다.
- 영향 화면: DialogFooter 를 쓰는 모든 모달

### [스타일] ClearableInput — 읽기 전용 칸 지우기 버튼 스타일

- 대상: src/components/theme/clearable-input.variants.ts
- 적용: 지정한 파일만 교체
- 내용: `clearableWhenReadOnly` 일 때 X 를 포커스와 무관하게 늘 보이는 스타일을 추가합니다.
