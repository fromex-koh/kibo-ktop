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
- 함께 반영: 아래 [신규 추가] 의 평가진행방식 선택 화면과 [삭제] 의 옛 진행방식 선택 화면을 같은 릴리스에서 반영해야 합니다 — 이 파일만 받으면 [이전]이 아직 없는 화면을 가리킵니다.
- 영향 화면: [기관 고객정보활용동의 (KTRS-FM)](/org/individual-evaluation/ktrs-fm/customer-consent) `보완(09/08)`
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f8e1b4c8)

## [신규 추가]

### 기관 개별평가 평가진행방식 선택 화면 — 옛 KTRS-FM 진행방식 선택 화면 삭제와 함께 반영

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/verification-progress/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/verification-progress/evaluation-method-form.tsx
- 적용: 신규 파일 추가
- 함께 반영: "기관 KTRS-FM 진행방식 선택 화면 — 평가진행방식 선택 화면 추가와 함께 삭제" 카드와 한 번에 반영해 주세요. 이 화면은 옛 `ktrs-fm/selection` 화면을 옮긴 것이라, 이 파일만 추가하면 같은 화면이 두 주소에 남고, 옛 화면만 지우면 진행방식 선택 화면이 사라집니다.
- 내용: Figma "개별평가_평가진행방식 선택" 반영. 기존 `ktrs-fm/selection` 화면을 이 경로로 옮기고 시안에 맞췄습니다 — 제목 '신속표준모형'+KTRS-FM 배지 → '평가진행방식 선택'(배지 없음), 브레드크럼 홈 · 개별평가, 안내문 "평가를 진행할 방식을 선택해주세요.", 카드 설명 둘째 줄에 "선택 시" 를 더했습니다. [평가검증 하기] 는 평가검증 신청 조회로, [개별평가 하기] 는 KTRS-FM 고객정보활용동의로 이동합니다.
- 함께 적용: 카드를 고르면 [다음]까지 스크롤합니다(위 Tech-Index 선택 화면과 같은 방식). "알려드려요" 제목을 h2(`headingLevel={2}`)로 두어 h1 → h3 제목 건너뜀을 없앴습니다.
- 영향 화면: [평가검증 진행확인](/org/individual-evaluation/verification-progress) `완료`

## [삭제]

### 기관 KTRS-FM 진행방식 선택 화면 — 평가진행방식 선택 화면 추가와 함께 삭제

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/selection/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/selection/evaluation-method-form.tsx
- 적용: 파일을 지웁니다(폴더째 비워집니다).
- 함께 반영: "기관 개별평가 평가진행방식 선택 화면 — 옛 KTRS-FM 진행방식 선택 화면 삭제와 함께 반영" 카드와 한 번에 반영해 주세요. 두 카드는 화면 하나를 새 주소로 옮기는 한 작업입니다.
- 이유: 새 시안의 평가진행방식 선택 화면과 구성·동작이 같아 `/org/individual-evaluation/verification-progress` 로 옮겼습니다. 옛 경로는 퍼블리싱 인덱스·경로 레지스트리에 등록되지 않은 화면이었고, 이제 404 입니다.
- 이어서 확인: 고객정보활용동의의 [이전] 경로 변경 카드와 퍼블리싱 인덱스 덮어쓰기 카드도 같은 릴리스에 들어 있습니다. 옛 경로로 연결한 곳이 있다면 새 경로로 바꿔 주세요.

## [덮어쓰기]

### 퍼블리싱 인덱스 — 평가검증 진행확인 완료 반영

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다. 두 파일은 함께 교체해야 합니다 — 콘텐츠 관문이 빌드 시점에 화면 key 를 교차검증합니다.
- 신규 화면: [평가검증 진행확인](/org/individual-evaluation/verification-progress) 을 `대기중` 에서 `완료` 로 올렸습니다. 경로 레지스트리에는 이미 등록돼 있어 구현 여부만 바뀝니다.

### 접근성 검사 예외사항 — 평가진행방식 선택 WAVE 사례 추가

- 대상: src/app/component-guide/(guide)/accessibility-exceptions/page.tsx
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다.
- 내용: WAVE `Missing form label` 2건은 Radix RadioGroup 이 폼 전송용으로 카드마다 만드는 숨은 `<input type="radio">`(`aria-hidden` · `tabindex="-1"`) 에서 나와 라이브러리 원인으로 분류했습니다. 화면별 결과에 기관 개별평가 · 평가진행방식 선택(RadioGroup 2건)을 더하고, RadioGroup 합계를 202건 · 35화면에서 204건 · 36화면으로 고쳤습니다. 같은 화면의 `Skipped heading level` 1건은 프로젝트 원인이라 예외로 두지 않고 화면에서 고쳤습니다(위 [신규 추가]).
- 영향 화면: [접근성 검사 예외사항](/component-guide/accessibility-exceptions)
