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

### [동작] Tech-Index 평가모형 선택 — 카드를 고르면 [다음]까지 스크롤

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/selection/tech-index-model-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/selection/tech-index-model-form.tsx
- 이전: 카드를 골라 [다음]이 켜져도, 버튼이 화면 아래에 있으면 사용자가 버튼을 찾으려고 직접 스크롤해야 했습니다.
- 지금: 카드를 고르면 [다음]이 화면 밖에 있을 때만 보이는 자리까지 부드럽게 내려갑니다(`scrollIntoView` · `block: 'nearest'`). 버튼에 `id`(`useId`)와 `scroll-mb-6`(아래 끝 24px 여유)를 넘깁니다. 이미 보이면 움직이지 않고, 포커스는 고른 카드에 남으며, 동작 줄이기(`prefers-reduced-motion`) 설정이면 즉시 이동합니다.
- 영향 화면: [기업 Tech-Index (0) 선택 화면](/corp/technology-evaluation/tech-index/selection) `보완(09/07)` · [기관 Tech-Index (0) 선택 화면](/org/individual-evaluation/tech-index/selection) `보완(09/10)`
- 유지: 카드 선택·필수값 전 [다음] 비활성·이동 경로는 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c8da107b)

### [동작] 일괄평가 평가모형·업무 선택 — 고를 때마다 다음 할 일로 스크롤

- 대상: src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/batch-evaluation-form.tsx
- 이전: 평가모형 카드와 진행할 업무를 모두 골라야 [다음]이 켜지는데, 모바일에서는 업무 선택과 [다음]이 화면 아래에 있어 이어서 할 일을 찾기 어려웠습니다.
- 지금: 평가모형 카드를 고르면 "진행할 업무 선택" 제목이 고정 헤더 바로 아래로 올라옵니다(`block: 'start'`, 업무 구획에 `scroll-mt-20 md:scroll-mt-28 xl:scroll-mt-32` — 목록 화면들과 같은 헤더 여백). 업무를 고르면 [다음]이 화면 밖일 때 보이는 자리까지 내려갑니다(`block: 'nearest'` · `scroll-mb-6`). 포커스는 고른 자리에 남고 동작 줄이기 설정이면 즉시 이동합니다.
- 영향 화면: [(1) Tech-Index 선택](/org/batch-evaluation/tech-index-selection) `완료` · [(2) 평가내역조회/일괄평가 진행 선택](/org/batch-evaluation/evaluation-history-or-batch) `완료` — 두 경로가 같은 폼을 씁니다.
- 유지: 두 값 모두 필수인 검사와 이동 경로는 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c39b2a02)

### [경로] 기관 KTRS-FM 고객정보활용동의 — [이전]이 평가진행방식 선택으로

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/customer-consent/page.tsx
- 이전: [이전] 경로(`SELECTION_PATH`)가 `/org/individual-evaluation/ktrs-fm/selection` 이었습니다.
- 지금: `/org/individual-evaluation/verification-progress` 로 바꿨습니다.
- 함께 반영: 아래 "평가진행방식 선택" 경로 이동 카드와 같은 릴리스에서 반영해야 합니다 — 이 파일만 받으면 [이전]이 아직 없는 화면을 가리킵니다.
- 영향 화면: [기관 고객정보활용동의 (KTRS-FM)](/org/individual-evaluation/ktrs-fm/customer-consent) `보완(09/08)`
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f8e1b4c8)

### [경로] 기관 KTRS-FM 진행방식 선택 → 평가진행방식 선택

- 대상: [전] src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/selection/page.tsx
    - [후] src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/verification-progress/page.tsx
    - [전] src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/selection/evaluation-method-form.tsx
    - [후] src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/verification-progress/evaluation-method-form.tsx
- 적용: 파일 2개를 [전] → [후] 경로로 옮긴 뒤 아래 변경을 반영하고, 옛 `ktrs-fm/selection/` 폴더는 삭제(옛 경로 404)
- 변경: `page.tsx` — 제목 '신속표준모형' + KTRS-FM 배지 → '평가진행방식 선택' · 브레드크럼 KTRS-FM 단계 삭제 · 안내문 → "평가를 진행할 방식을 선택해주세요." · "알려드려요" h3 → h2
    - `evaluation-method-form.tsx` — 카드 설명 둘째 줄에 "선택 시" 추가 · 카드 선택 시 [다음]까지 스크롤
- 유지: 카드별 이동 경로와 필수 선택 검사
- 함께 반영: 위 "고객정보활용동의 [이전]" 카드
- 영향 화면: [평가검증 진행확인](/org/individual-evaluation/verification-progress) `완료`
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/compare/955abf34^...dbc41dd4)

### [기능] 기관 기업정보 — [기업정보 관리] 모달 연결 · 기업 선택 시 자동입력

- 대상: src/components/composite/org-company-info-form.tsx
    - src/components/composite/self-diagnosis-form-tabs.tsx
- 이전: [기업정보 관리] 버튼은 눌러도 아무 일이 없었고, [기업 자가진단 결과보기] 아래에 노출 조건 안내 문구가 있었습니다. 투자모형에는 [기업 자가진단 결과보기] 버튼이 없었습니다. 모바일에서는 두 버튼이 제목 칸을 눌러 "기업정보"·필수 안내가 한 글자씩 세로로 쌓였습니다.
- 지금: [기업정보 관리] 가 기업정보 불러오기 모달을 엽니다. 목록에서 기업을 고르면 기업형태 · 기업명 표기 · 사업자번호 · 법인번호 · 기업명 · 설립일 · 대표자명 · 회사전화번호 · 업종코드 · 주소 · 상세주소가 채워지고, 채운 칸에 남아 있던 검사 메시지를 거둡니다(법인이 아니면 기업명 표기·법인번호는 비웁니다). 어느 평가모형의 기업정보를 불러올지는 `model` prop(`ktrs-fm` · `tech-index-general` · `tech-index-startup` · `investment-model`)으로 넘깁니다. 버튼 아래 안내 문구는 지웠고, 투자모형에도 [기업 자가진단 결과보기] 를 붙였습니다. 모바일(md 미만)에서는 버튼 줄이 제목·안내 아래로 내려갑니다(아래 FormCard 카드의 `stackActionOnMobile`).
- 함께 반영: 아래 [신규 추가] 의 "기업정보 불러오기 모달" 카드와 이 목록의 "FormCard" 카드를 같은 릴리스에서 반영해야 합니다 — 이 파일들이 두 파일을 import 합니다.
- 연동: [기업 자가진단 결과보기] 링크는 세 모형 모두 KTRS-FM 자가진단 결과 경로(아직 화면 없음)입니다. [기관] 마이페이지 > 평가검증 신청 조회 > [평가검증 하기] 로 들어왔을 때 [기업정보 관리] 대신 이 버튼만 보이게 하는 조건은 `showSelfDiagnosisResult` 로 겁니다(퍼블리싱에서는 두 버튼을 함께 보여 줍니다).
- 영향 화면: [KTRS-FM 기업·기술정보 입력](/org/individual-evaluation/ktrs-fm/company-technology-info) · [Tech-Index 일반](/org/individual-evaluation/tech-index/general/company-technology-info) · [Tech-Index 창업](/org/individual-evaluation/tech-index/startup/company-technology-info) · [투자모형](/org/individual-evaluation/investment-model/company-technology-info)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a583517e)

### [스타일] FormCard — 좁은 화면에서 액션을 제목 아래로 내리는 옵션

- 대상: src/components/composite/form-card.tsx
- 이전: 제목 줄은 액션이 있으면 늘 "제목 | 액션" 두 칸이라, 액션 버튼이 여럿이거나 이름이 길면 좁은 화면에서 제목 칸이 눌렸습니다.
- 지금: `stackActionOnMobile` prop 을 켜면 md(768) 미만에서 액션을 제목·설명 아래 줄로 내리고 왼쪽에 붙입니다. 기본값은 꺼짐이고, 지금은 기관 기업정보 카드만 켭니다.
- 유지: 옵션을 켜지 않은 다른 폼 카드의 배치는 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1ef37351)

### [스타일] 업종코드 조회 모달 — 줄 hover · 선택 시 밑줄

- 대상: src/components/composite/industry-code-dialog.tsx
- 이전: 줄에 올리거나 골라도 면 색만 바뀌었습니다.
- 지금: 줄에 올리면 코드·업종명 글자에 밑줄이 서고(`group-hover:underline`), 고른 줄은 손을 뗀 뒤에도 밑줄이 남습니다. 밑줄은 grid 줄이 아니라 글자 칸(span)에 직접 줍니다.
- 유지: 고른 줄 면(`bg-secondary`) · 나머지 줄 hover 면(`surface-subtle`)과 고르는 동작은 그대로입니다.
- 영향 화면: [기관 업종코드 조회](/org/individual-evaluation/ktrs-fm/company-info/industry-code-search) 와 기업·기관 기업정보의 업종코드 [조회]
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c2b38267)

### [스타일] 혁신성장영위기업 분류근거 모달 — 줄 hover 배경

- 대상: src/components/composite/technology-category-dialog.tsx
- 이전: 본문 줄에 hover 면이 없었습니다(`hover:bg-transparent`).
- 지금: 줄에 올리면 업종코드 조회 모달에서 고른 줄·기업정보 불러오기 모달의 줄과 같은 색(`hover:bg-secondary`)이 됩니다.
- 영향 화면: [기업 Tech-Index 기술분류](/corp/technology-evaluation/tech-index/general/company-info/technology-category) 와 기관 기술분류 화면
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c37e6b01)

### [스타일] 완료 토스트 — 체크 원을 초록으로 · `toast-icon` 토큰 추가

- 대상: tokens.json
    - scripts/build-tokens.mjs
    - src/components/custom/check-toast.tsx
- 이전: 토스트의 체크 원이 `bg-primary`(파랑) · `text-primary-foreground` 였습니다.
- 지금: 시맨틱 토큰 `toast-icon`(세 테마 모두 `success.500`)을 추가하고, 체크 원을 `bg-toast-icon` · `text-toast-foreground` 로 바꿨습니다. 토큰 생성기에 흰 체크와 초록 원의 명도 대비 검사(UI 기준)를 더했습니다.
- 적용: `tokens.json` 을 받은 뒤 `yarn tokens` 로 `tokens.css` 를 다시 만들어야 `bg-toast-icon` 이 생깁니다.
- 유지: 토스트 면(`toast`) · 글자색 · 위치 · 동작은 그대로입니다.
- 영향 화면: [체크 토스트 가이드](/component-guide/check-toast) 와 CheckToast · 자동저장 토스트를 쓰는 화면(기관 마이페이지 부계정 생성 · 수정 · 삭제 · 상태 변경 · 비밀번호 초기화 완료 토스트 등)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/20a79cb1)

## [신규 추가]

### 기업정보 불러오기 모달 — 목업 데이터 파일과 함께 추가

- 대상: src/components/composite/company-info-load-dialog.tsx
    - src/content/service/company-info-load.ts
- 적용: 신규 파일 추가
- 내용: 조회 조건(조회기간 · 기업명) → 결과 요약(모형 이름 · 총 건수) → 기업 목록 표 → 페이지 이동으로 구성하고, 결과가 없으면 빈 상태를 보여 줍니다. 표는 줄 전체가 선택 영역이며(키보드는 첫 칸 버튼으로 선택), 줄을 고르면 `onSelect(item)` 으로 그 기업을 넘기고 모달이 닫힙니다.
- props: `model`(불러올 평가모형) · `initialResult`(처음 보여 줄 결과) · `loadResult(model, filters, page)`(조회·페이지 이동 시 호출, Promise 도 받음, 기본값은 목업 함수) · `onSelect` · `defaultOpen` · `children`(모달을 여는 버튼)
- 연동: 목업과 조회 API 의 교체 지점은 `content/service/company-info-load.ts` 의 `getCompanyInfoLoadResult(model, filters, page)` 한 곳입니다. 응답을 `modelName`(결과 줄의 모형 이름) · `items`(표 한 줄 + 폼에 채울 `companyInfo`) · `totalCount` · `totalPages` 로 맞춰 돌려주면 모달·폼은 그대로입니다. 목업은 15건(10줄 + 5줄, 2쪽)이고 조회 조건으로 거르지 않습니다.

### 기관 개별평가 기업정보 관리 화면 4종

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/company-info/company-management/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/general/company-info/company-management/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/startup/company-info/company-management/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/investment-model/company-info/company-management/page.tsx
- 적용: 신규 파일 추가
- 내용: 기업정보 불러오기 모달을 열어 둔 모달 단독 확인 화면입니다. 설명에 버튼 위치 · 동작 · [기업 자가진단 결과보기] 와의 관계를 적었고, 네 화면은 넘기는 모형 키만 다릅니다.
- 함께 반영: 위 "기업정보 불러오기 모달" 카드가 먼저 있어야 합니다.
- 영향 화면: [KTRS-FM](/org/individual-evaluation/ktrs-fm/company-info/company-management) `완료` · [Tech-Index 일반](/org/individual-evaluation/tech-index/general/company-info/company-management) `완료` · [Tech-Index 창업](/org/individual-evaluation/tech-index/startup/company-info/company-management) `완료` · [투자모형](/org/individual-evaluation/investment-model/company-info/company-management) `완료`

## [덮어쓰기]

### 퍼블리싱 인덱스 — 평가검증 진행확인 · 기업정보 관리 4종 완료 반영

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다. 두 파일은 함께 교체해야 합니다 — 콘텐츠 관문이 빌드 시점에 화면 key 를 교차검증합니다.
- 신규 화면: [평가검증 진행확인](/org/individual-evaluation/verification-progress) 과 기업정보 관리 4종 — [KTRS-FM](/org/individual-evaluation/ktrs-fm/company-info/company-management) · [Tech-Index 일반](/org/individual-evaluation/tech-index/general/company-info/company-management) · [Tech-Index 창업](/org/individual-evaluation/tech-index/startup/company-info/company-management) · [투자모형](/org/individual-evaluation/investment-model/company-info/company-management) 을 `대기중` 에서 `완료` 로 올렸습니다. 경로 레지스트리에는 이미 등록돼 있어 구현 여부만 바뀝니다.

### 접근성 검사 예외사항 — 평가진행방식 선택 WAVE 사례 · 화면별 검사 기록 순서 · 행 선 · WAVE 기록 보정

- 대상: src/app/component-guide/(guide)/accessibility-exceptions/page.tsx
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다.
- 내용: 기관 개별평가 · 평가진행방식 선택의 WAVE `Missing form label` 2건을 라이브러리 원인(Radix RadioGroup 이 폼 전송용으로 카드마다 만드는 숨은 `<input type="radio">` · `aria-hidden` · `tabindex="-1"`)으로 화면별 결과에 더했습니다. 같은 화면의 `Skipped heading level` 1건은 프로젝트 원인이라 예외로 두지 않고 화면에서 고쳤습니다(위 [Diff 확인] 의 평가진행방식 선택 카드).
- 표 정리: W3C 마크업 검사 · WAVE 웹 접근성 검사 탭의 "화면별 검사 기록" 표를 퍼블리싱 인덱스 순서로 줄 세웠습니다(인덱스에 없는 화면은 묶음 끝). 두 표의 행 선을 페이지의 다른 구분선과 같은 `border-subtle-3` 로 맞췄습니다(색이 없어 아코디언 글자색으로 진하게 그려지던 것).
- 기록 보정: 실제 화면에서 숨은 컨트롤을 세어 보정했습니다 — 일괄평가 창업 갈래의 대량정보 조회 신청 · 평가 신청(각 Select 1건) 두 화면을 더하고, 기업 마이페이지 기업정보의 `Missing form label` 2건을 Select 가 아니라 RadioGroup 으로 바로잡았습니다. 합계는 RadioGroup 206건 · 37화면, Select 오류 115건 · 26화면입니다.
- 참고: 이 파일에는 같은 기간의 다른 작업(WAVE 화면별 기록을 W3C 화면 목록 기준으로 채움 · 화면 이름을 메뉴 뎁스로 표시 · 빈 상태 컴포넌트 적용 등)도 함께 들어 있어, 교체하면 함께 반영됩니다.
- 영향 화면: [접근성 검사 예외사항](/component-guide/accessibility-exceptions)

### 시맨틱 색상 가이드 — `toast-icon` 견본 추가

- 대상: src/app/component-guide/(guide)/semantic-color/page.tsx
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다.
- 내용: 새 토큰 `toast-icon` 의 견본(`bg-toast-icon`)을 넣고, 토스트 묶음을 "toast / toast-foreground / toast-icon" 으로 늘렸습니다.
- 함께 반영: 위 [Diff 확인] 의 "완료 토스트" 카드와 같은 릴리스에 반영해야 합니다 — `tokens.json` 에 `toast-icon` 이 없으면 이 파일이 타입 검사를 통과하지 못합니다.
- 영향 화면: 모든 토스트 컴포넌트 (예: [기관 부계정 생성 완료 토스트](/org/mypage/sub-account-progress/create/complete-toast))

### 퍼블리싱 인덱스 — 화면 링크를 새 창으로 열기

- 대상: src/components/custom/publishing-index.tsx
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다.
- 내용: 인덱스를 보면서 화면을 하나씩 대조할 수 있도록 화면 링크를 새 창(`target="_blank"` · `rel="noopener noreferrer"`)으로 엽니다. 스크린리더 안내도 "화면으로 이동 (새 창)" 으로 바꿨습니다.
- 영향 화면: 퍼블리싱 인덱스 (홈)
