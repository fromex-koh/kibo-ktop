# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.
frontend-handoff에 실제 전달되는 파일의 변경만 작성하세요.
프로젝트 서비스 페이지가 아닌 퍼블리싱 가이드 관련 파일은 [덮어쓰기]로 분류하세요.

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

### [레이아웃] 보증추천 — 은행·영업점명을 한 줄에 두고 [검색] 버튼을 하나로

- 대상: src/components/composite/guarantee-recommendation-dialog.tsx
- 변경: 세로로 쌓여 있던 [은행]·[영업점명] 두 칸을 한 줄에 두고, 각 칸에 있던 [검색] 버튼을 영업점명 쪽 하나만 남겼습니다. 두 값이 한 모달에서 함께 정해지므로 버튼이 둘일 이유가 없습니다.
- 폭: 시안대로 은행 208 · 영업점명(입력 + 버튼)이 나머지입니다. 좁은 화면(sm 미만)에서는 위아래로 쌓입니다.
- 추가: 구획 끝에 `※ 서류안내, 현장실사 협의 등 평가 진행사항을 안내받을 담당자 정보(휴대폰)를 입력해 주십시오.` 한 줄이 붙습니다.
- 확인 방법: [기관 보증추천](/org/mypage/evaluation-history/guarantee-recommendation) 의 [은행담당자] 구획 — 두 칸이 한 줄인지, [검색]이 하나인지 봅니다.
- 유지: 칸 이름(`guaranteeBankName`·`guaranteeBankBranch`)과 제출값, 검사 관문, [임시저장]·[보증 추천] 흐름은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4ce45813)

### [접근성] 보증추천 — 라디오 묶음의 물음을 묶음 이름으로

- 대상: src/components/composite/guarantee-recommendation-dialog.tsx
- 이전: 물음 [현재 다른 보증기관 이용 여부] 가 `<label htmlFor>` 로 첫 보기에 묶여, 그 보기가 "부" 대신 물음 전체로 읽히고 둘째 보기는 물음 없이 "여" 로만 읽혔습니다.
- 지금: 물음은 `id` 를 가진 글자가 되고 묶음(`role="radiogroup"`)이 `aria-labelledby` 로 그것을 가리킵니다[7.4.1]. 보기의 이름은 "여"·"부" 입니다.
- 확인 방법: 같은 화면에서 라디오에 초점을 두고 읽어 주기를 켜면 "현재 다른 보증기관 이용 여부 … 여/부" 로 읽힙니다. WAVE 의 Missing form label 2건은 Radix 가 만드는 숨은 input 이라 남습니다(아래 접근성 페이지에 기록).
- 주의: label 을 그대로 두고 `htmlFor` 만 지우면 가리키는 컨트롤이 없는 라벨이 되어 검사기가 다시 잡습니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4ce45813)

### [스타일] 기술평가센터 검색 — 시안 반영

- 대상: src/components/composite/search-select-dialog.tsx
    - src/components/composite/guarantee-search-dialogs.tsx
- 추가: 모달 맨 위에 안내 한 줄(`지역본부 선택 후 기술평가센터를 검색·선택하세요.`)이 붙습니다. `notices` prop 을 넘긴 모달만 그립니다 — 넘기지 않으면 이전과 같습니다.
- 규격: 지역본부 셀렉트 180 → 208, 표의 지역본부 칸 140 → 200(좁은 화면은 140 유지), [검색]은 파란 버튼에서 흰 면·회색 테두리로 바뀝니다.
- 제거: 목록 아래 [선택 : …] 요약 줄을 없앴습니다(시안에 없음). 고른 줄은 표에서 파란 면으로 남고, 읽어 주는 알림은 그대로입니다.
- 표 머리: 맨 윗선이 옅은 선에 덮여 있었습니다. 한 요소에 테두리 색을 두 번 지정한 탓(`border-foreground-subtle` + `border-subtle-3`)이라 위·아래를 나눠 지정했습니다(`border-t-…` + `border-b-…`). 시안대로 위가 진한 선(gray.500), 아래가 옅은 선(gray.100)입니다.
- 확인 방법: [기관 기술평가센터 검색](/org/mypage/evaluation-history/guarantee-recommendation/center-search)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f2c71fb1)

### [동작] 검색 모달 — 목록은 [검색]을 눌렀을 때만 바뀝니다

- 대상: src/components/composite/search-select-dialog.tsx
    - src/components/composite/bank-branch-search-dialog.tsx
- 이전: 셀렉트를 고르거나 글자를 치는 동안 목록이 즉시 걸러졌습니다.
- 지금: [검색] 또는 Enter 를 눌렀을 때만 목록이 바뀝니다. 찾는 동작이 버튼 하나로 모여, 무엇을 눌러 나온 결과인지 분명해집니다.
- 확인 방법: 두 모달에서 글자를 쳐도 목록이 그대로인지 → [검색]을 누르면 걸러지는지 봅니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f2c71fb1)

### [스타일] 업종코드 조회 — 안내 패널과 표 머리 선

- 대상: src/components/composite/industry-code-dialog.tsx
- 안내 패널: 파일 안에 있던 "회색 면 + 불릿" 패널을 공통 조각(DialogNotice)으로 바꿨습니다. 문구·목록은 그대로이고, 불릿이 본문 크기(14/21)에 맞는 작은 점으로 바뀌어 글줄 가운데에 옵니다.
- 표 머리: 맨 윗선이 옅은 선에 덮여 있었습니다. 한 요소에 테두리 색을 두 번 지정한 탓(`border-foreground-subtle` + `border-subtle-3`)이라 위·아래를 나눠 지정했습니다(`border-t-…` + `border-b-…`). 시안대로 위가 진한 선(gray.500), 아래가 옅은 선(gray.100)입니다.
- 유지: 업종 목록·검색 동작·고른 값을 넘기는 방식은 그대로입니다.
- 해당 화면 · 기업: [KTRS-FM](/corp/technology-evaluation/ktrs-fm/company-info/industry-code-search) · [Tech-Index 일반용](/corp/technology-evaluation/tech-index/general/company-info/industry-code-search) · [Tech-Index 창업용](/corp/technology-evaluation/tech-index/startup/company-info/industry-code-search) · [투자모형](/corp/technology-evaluation/investment-model/company-info/industry-code-search) · [내 정보](/corp/mypage/profile/industry-code-search)
- 해당 화면 · 기관: [KTRS-FM](/org/individual-evaluation/ktrs-fm/company-info/industry-code-search) · [Tech-Index 일반용](/org/individual-evaluation/tech-index/general/company-info/industry-code-search) · [Tech-Index 창업용](/org/individual-evaluation/tech-index/startup/company-info/industry-code-search) · [투자모형](/org/individual-evaluation/investment-model/company-info/industry-code-search) · [내 정보 수정](/org/mypage/profile-edit/industry-code-search)
- 인덱스: 위 10개 화면을 `보완(09/10)` 으로 두었습니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/08e4b0e4)

### [접근성] Tech-Index 평가모형 선택 — 안내 상자의 제목 단계

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/selection/page.tsx
- 원인: 화면 제목(h1) 다음에 h2 없이 InfoBox 의 기본 제목(h3)이 와서 제목 단계를 건너뛰었습니다[6.4.2].
- 지금: `headingLevel={2}` 를 넘겨 h2 로 둡니다. InfoBox 는 이미 단계를 받도록 되어 있어 컴포넌트 변경은 없습니다.
- 해당 화면: [기관 Tech-Index 평가모형 선택](/org/individual-evaluation/tech-index/selection) — 제목 구조가 h1 → h2 로 이어지는지 봅니다.
- 인덱스: 위 화면을 `보완(09/10)` 으로 두었습니다. 기업 쪽 같은 화면은 이미 h2 라 바뀐 것이 없습니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8297cc94)

### [마크업] 문의 내역 — 목록 한 줄의 구분선을 inline 으로

- 대상: src/components/custom/inquiry-list.tsx
- 원인: 목록 한 줄을 span 으로 감쌌는데 그 안의 `InlineSeparator` 가 기본형(div)이었습니다. div 는 span 안에 올 수 없어 검사기가 그 지점에서 아래 트리 검사를 멈췄습니다.
- 지금: `InlineSeparator` 의 `inline` 옵션을 켜 같은 모양을 span 으로 그립니다. 보이는 모습은 그대로입니다.
- 해당 화면: [기업 나의 문의내역](/corp/mypage/inquiry-history) · [기관 1:1 문의 내역](/org/mypage/inquiry-history)
- 인덱스: 위 2개 화면을 `보완(09/10)` 으로 두었습니다. 기업 화면은 09/07 회차에도 손을 타 뱃지가 `보완(09/07)`·`보완(09/10)` 두 개로 섭니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2446fdda)

## [신규 추가]

### 은행 영업점 조회 — 은행 검색·영업점 검색 두 모달을 하나로

- 대상: src/components/composite/bank-branch-search-dialog.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/evaluation-history/guarantee-recommendation/bank-branch-search/page.tsx
    - src/content/service/tech-evaluation-centers.ts
- 적용: 모달과 화면은 신규 추가, 목록 데이터(tech-evaluation-centers.ts)는 기존 파일을 교체합니다.
- 화면 구성: 은행 셀렉트 → 영업점명 입력 + [검색] → 표(은행명 · 지로코드 · 영업점명) → [닫기]. 시안의 CTA 가 [닫기] 하나뿐이라 목록의 한 줄이 곧 버튼입니다 — 누르면 은행과 영업점명이 함께 담기고 닫힙니다.
- 데이터: 영업점 목록에 지로코드를 더했습니다(`BankBranch` = 코드 · 은행명 · 지로코드 · 영업점명). 앞의 다섯 줄은 시안 값 그대로이고, `BANK_BRANCH_BANKS` 는 쓰이지 않아 없앴습니다.
- 연동 지점: `BANK_BRANCHES` 를 조회 API 응답으로 바꾸면 모달은 그대로 동작합니다. 서버에서 검색해야 하면 모달 안 `searchBranches` 자리를 조회 요청으로 바꿉니다.
- 함께 반영: 아래 [삭제] 의 은행 검색 화면과 [덮어쓰기] 의 퍼블리싱 인덱스를 같은 릴리스에서 반영해야 합니다.

### DialogNotice — 모달 안내 패널 공통 조각

- 대상: src/components/composite/dialog-notice.tsx
- 적용: 신규 파일 추가
- 내용: 모달 맨 위에서 "무엇을 하는 자리인지" 한두 줄로 알리는 회색 면 + 불릿 패널입니다. 페이지 하단의 InfoBox 와 규격이 달라(면 gray.10 · 반경 8 · 여백 20 · 본문 14/21 · 제목 없음) 따로 둡니다.
- 쓰는 곳: 업종코드 조회 · 기술평가센터 검색. 새 모달에 안내가 필요하면 `notices` 배열만 넘기면 됩니다.

### 접근성 검사 예외사항 — 검사 결과를 데이터로 읽는 문서 화면

- 대상: src/app/component-guide/(guide)/accessibility-exceptions/page.tsx
    - src/app/component-guide/(guide)/accessibility-exceptions/issue-badge.tsx
    - src/app/component-guide/(guide)/accessibility-exceptions/latest-audit.tsx
    - src/app/component-guide/(guide)/accessibility-exceptions/screen-markup-results.ts
    - src/content/publishing-guide/accessibility-audit.json
- 적용: 신규 파일 추가
- 내용: `마크업 검증` 페이지를 `접근성 검사 예외사항` 으로 옮기고, 손으로 적어 두던 검사 결과를 릴리스 때 만들어지는 데이터(`accessibility-audit.json`)에서 읽도록 바꿨습니다. 검사 회차·커밋·검사기 버전이 화면 문구와 어긋나지 않습니다.
- 이번 회차 내용: 라이브러리 원인(Radix Select · shadcn Pagination · sonner · Radix 모달 · recharts)과 프로젝트 원인, WAVE 결과(Radix RadioGroup 의 숨은 input, 이번에 고친 라디오 묶음 라벨)가 함께 들어 있습니다.
- 함께: 검사 자체는 릴리스 워크플로가 vnu.jar 로 돌립니다(`scripts/audit-accessibility.mjs`). 스크립트·워크플로는 전달본에 들어가지 않아 대상에서 뺐고, 전달본에서는 결과 데이터만 읽습니다.

## [덮어쓰기]

### 모달 예시 화면의 숨은 트리거 — 프론트에서 고칠 것 없음

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/company-info/item-description/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/company-info/technology-category/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/general/company-info/item-description/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/general/company-info/technology-category/page.tsx
- 적용: 지정한 파일만 교체합니다.
- 프론트 작업: 없습니다. 모달만 띄워 두는 퍼블리싱 예시 화면의 숨은 트리거를 span → button 으로 바꾼 것입니다. 실제로 이 모달을 여는 [2-1 기업정보] 화면과 모달 컴포넌트는 그대로입니다.
- 해당 화면 · 기업: Tech-Index 일반용 [기술분류](/corp/technology-evaluation/tech-index/general/company-info/technology-category) · [품목설명](/corp/technology-evaluation/tech-index/general/company-info/item-description) / 창업용 [기술분류](/corp/technology-evaluation/tech-index/startup/company-info/technology-category) · [품목설명](/corp/technology-evaluation/tech-index/startup/company-info/item-description)
- 해당 화면 · 기관: Tech-Index 일반용 [기술분류](/org/individual-evaluation/tech-index/general/company-info/technology-category) · [품목설명](/org/individual-evaluation/tech-index/general/company-info/item-description) / 창업용 [기술분류](/org/individual-evaluation/tech-index/startup/company-info/technology-category) · [품목설명](/org/individual-evaluation/tech-index/startup/company-info/item-description) / 투자모형 [기술분류](/org/individual-evaluation/investment-model/company-info/technology-category) · [품목설명](/org/individual-evaluation/investment-model/company-info/item-description)
- 인덱스: 위 10개 화면은 `보완(09/10, 개발수정X)` — 꼬리말이 붙은 행은 확인할 것이 없다는 뜻입니다.

### 컴포넌트 가이드 — 마크업 검증을 접근성 검사 예외사항으로

- 대상: src/app/component-guide/(guide)/validation-exceptions/page.tsx
    - src/app/component-guide/(guide)/toast/page.tsx
    - src/constants/publishing-guide.ts
- 적용: 문서 화면이라 지정한 파일만 교체합니다.
- 변경: 옛 주소(`/component-guide/validation-exceptions`)는 새 주소로 넘겨 주는 화면만 남깁니다. 토스트 가이드의 링크도 새 이름으로 바꿨고, 사이드바 메뉴는 외부에 안내할 때 열 수 있도록 주석으로 남겨 두었습니다.

### next.config.ts — 접근성 검사 소스 지문

- 대상: next.config.ts
- 적용: 지정한 파일만 교체합니다.
- 변경: 화면이 "지금 보고 있는 코드가 검사한 그 코드인지" 알 수 있도록 소스 지문을 환경변수로 넘깁니다. 전달본에서는 지문 계산 없이 결과만 보여 주도록 handoff 생성기가 이 값을 `NEXT_PUBLIC_ACCESSIBILITY_HANDOFF` 로 바꿔 넣습니다 — 전달본에서 따로 손댈 것은 없습니다.

### 퍼블리싱 가이드 스키마 — [삭제] 분류와 상태 뱃지 꼬리말 추가

- 대상: src/content/publishing-guide/types.ts
    - src/content/publishing-guide/index.ts
    - src/components/custom/publishing-index.tsx
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다.
- 릴리즈 노트 [삭제] 분류: 분류가 [Diff 확인]·[신규 추가]·[덮어쓰기] 셋뿐이라 지워야 하는 파일이 다른 카드 안에 묻혀 놓치기 쉬웠습니다. 빨간 [삭제] 배지가 서고, 카드 차례는 Diff 확인 → 덮어쓰기 → 신규 추가 → 삭제입니다.
- 상태 뱃지 꼬리말(`statusNote`): 같은 회차의 `보완(09/10)` 이 다 똑같이 보여, 프론트가 다시 볼 것이 있는 행과 없는 행이 구분되지 않았습니다. 이제 `보완(09/10, 개발수정X)` 처럼 날짜 뒤에 꼬리말이 붙습니다. 값은 열거형(`개발수정X`)이라 아무 글자나 들어가지 않고, `statusDate` 없이 혼자 쓰면 콘텐츠 관문이 빌드를 세웁니다. 색이 아니라 글자로 구분하고 읽어 주기에는 뜻을 문장으로 넘깁니다[5.3.1]. 표 위 범례에도 뜻을 한 줄 적었습니다.
- 상태 날짜 여러 건(`statusDate`): 한 화면이 여러 회차에 걸쳐 같은 상태로 손을 타면 이전 날짜가 덮여 이력이 사라졌습니다. 이제 `"09/10"` 대신 `["09/07", "09/10"]` 처럼 배열로 적으면 회차 수만큼 뱃지가 세로로 섭니다. 문자열 하나로 적던 기존 행은 그대로 동작합니다.
- 상태 칸 폭: [응용2]·[UIUX] 두 칸을 같은 폭(112)으로 묶고 안쪽 여백을 줄였습니다. 꼬리말이 붙은 긴 뱃지는 칸 안에서 두 줄로 접힙니다 — 뱃지 길이에 따라 상태 칸이 늘어나 뎁스 칸을 좁히던 것을 막습니다.

### 퍼블리싱 인덱스·화면 경로 레지스트리

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체. 세 파일은 반드시 함께 교체해야 합니다 — 콘텐츠 관문이 빌드 시점에 두 JSON 의 화면 key 를 양방향으로 교차검증합니다.
- 행 병합: [은행 검색] · [영업점 검색] 두 행을 [은행 영업점 조회] 한 행으로 합쳤습니다.
- 상태: 이번에 손댄 26개 화면의 상태를 옮겼습니다 — 업종코드 조회 10 · 문의 내역 2 · 보증추천 · 기술평가센터 검색 · 은행 영업점 조회 · Tech-Index 평가모형 선택까지 16개는 `보완(09/10)`, 모달 예시 화면 10개(기술분류 · 품목설명)는 `보완(09/10, 개발수정X)` 입니다. 어느 화면인지는 각 카드의 [해당 화면] 에 링크로 달아 두었습니다.

## [삭제]

### 은행 검색 화면 — 은행 영업점 조회로 합쳐 지웁니다

- 대상: src/app/(user-type)/org/(service)/(logged-in)/mypage/evaluation-history/guarantee-recommendation/bank-search/page.tsx
- 적용: 파일을 지웁니다(폴더째 비워집니다).
- 이유: 은행만 고르던 화면입니다. 은행과 영업점을 한 모달에서 함께 고르게 되면서 이 주소로 들어갈 길이 없어졌습니다.
- 함께 반영: [신규 추가] 의 은행 영업점 조회 모달, [덮어쓰기] 의 퍼블리싱 인덱스와 같은 릴리스에서 반영해야 합니다 — 화면만 지우면 인덱스가 없는 화면을 가리키고, 인덱스만 바꾸면 쓰이지 않는 화면이 남습니다.

### 손으로 적어 두던 마크업 검사 결과 파일

- 대상: src/app/component-guide/(guide)/validation-exceptions/screen-markup-results.ts
- 적용: 파일을 지웁니다.
- 이유: 화면 246개의 검사 결과를 손으로 적어 둔 파일입니다. 검사 결과를 릴리스 때 만들어지는 데이터로 읽게 되면서 자리를 옮겼습니다 — 종류 이름만 쓰는 새 파일이 접근성 검사 예외사항 폴더에 있습니다.
