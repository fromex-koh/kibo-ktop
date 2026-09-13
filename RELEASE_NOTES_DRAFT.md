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

### [동작] 하위계정 현황 — [⋮] > [수정] 을 모달로 열고 수정 완료 토스트 추가

- 대상: src/components/custom/org-sub-account-list.tsx
    - src/constants/sub-account.ts
    - src/content/service/org-sub-accounts.ts
- 이전: [⋮] > [수정] 은 갈 화면 주소가 비어 있어(`SUB_ACCOUNT_ROUTES.edit = '#'`) 눌러도 아무 일이 없었습니다.
- 지금: 화면을 옮기지 않고 [하위 계정 수정] 모달을 엽니다. [저장하기] 를 누르면 그 자리의 카드가 고친 값으로 바뀌고 "하위계정 정보가 수정되었습니다." 토스트가 뜹니다.
- 모달 닫힘: [⋮] 에서 고른 일(`menuAction`)과 계정(`menuItem`)을 따로 들고, 닫을 때는 고른 일만 거둡니다 — 확인 모달 3종(비밀번호 초기화·상태 변경·삭제)이 닫히며 사라지는 동안 물음 문구가 비지 않습니다.
- 데이터: `SUB_ACCOUNT_TOAST.edit` 을 더하고, 서비스별 배분 이용건수에 이용기간(`SubAccountServiceUsage.period`)을 더했습니다. 목업 메모는 실제 내용처럼 바꿨습니다. 쓰지 않게 된 `SUB_ACCOUNT_ROUTES` 는 지웠습니다.
- 확인 방법: 카드의 [⋮] > [수정] 에서 담당자 이름을 고쳐 [저장하기] 를 누릅니다 — 카드 값이 바뀌고 토스트가 뜹니다.
- 영향 화면: [하위계정 현황 · 기술평가부 비협약](/org/mypage/sub-account-progress) `완료` · [기술평가부 협약](/org/mypage/sub-account-progress/tech-partner) `완료` · [K-BIGx 비협약](/org/mypage/sub-account-progress/k-bigx-non-partner) `완료` · [K-BIGx 협약](/org/mypage/sub-account-progress/k-bigx-partner) `완료`
- 유지: 등록·상세·비밀번호 초기화·상태 변경·삭제의 동작과 문구는 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3bb2b6d1)

### [동작] 하위 계정 등록 모달 — 공통 폼 조각으로 분리하고 공백만 입력 막기

- 대상: src/components/composite/sub-account-create-dialog.tsx
- 이전: 계정 ID(중복확인)·비밀번호·담당자 이름·구분/소속·상태·메모 칸과 검사 규칙이 등록 모달 한 파일에 모두 들어 있었습니다.
- 지금: 수정 모달과 함께 쓰도록 공통 칸·중복확인·제출 검사를 `SubAccountForm`(신규)으로 옮기고, 등록 모달에는 비밀번호 칸만 남겼습니다. 모양·칸 순서·중복확인 동작은 같습니다.
- 달라진 검사: 담당자 이름·구분/소속에 띄어쓰기만 넣으면 빈 칸과 같은 문구("담당자 이름을 입력해 주세요.")로 막습니다. 비밀번호는 띄어쓰기를 받지 않습니다 — 예전에는 "8자 이상" 만 봐서 띄어쓰기 여덟 칸도 통과됐는데, 이제 띄어쓰기가 하나라도 있으면 "비밀번호는 띄어쓰기 없이 8자 이상 입력해 주세요." 로 막습니다(`pattern` `.{8,}` → `\S{8,}`). 두 검사 모두 칸을 벗어날 때와 [저장하기] 를 누를 때 나옵니다.
- 확인 방법: 등록 모달의 담당자 이름에 띄어쓰기만, 비밀번호에 띄어쓰기가 섞인 값을 넣고 칸을 벗어나 봅니다.
- 영향 화면: [하위계정 등록](/org/mypage/sub-account-progress/create) `완료`
- 유지: 폼·칸 id(`sub-account-create-*`)와 `onSubmit` prop 은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3e2304ac)

### [동작] 폼 제출 관문 — 칸마다 빈 칸 안내 문구를 따로 줄 수 있게

- 대상: src/components/composite/form-tabs-submit.ts
- 이전: 빈 칸 문구는 라벨로만 만들었습니다("라벨을(를) 입력해 주세요.").
- 지금: 컨트롤에 `data-required-message` 가 있으면 그 문구를 씁니다 — `data-pattern-message` 와 같은 방식입니다. 라벨이 서비스 이름이라 라벨 문장으로는 무엇을 적을지 드러나지 않는 하위계정 수정 모달의 배분 건수 칸에서 씁니다.
- 영향 화면: 이 속성을 쓰지 않는 기존 폼은 그대로입니다. [하위계정 수정](/org/mypage/sub-account-progress/edit) `완료` 에서 처음 씁니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d82afbfc)

### [스타일] 조회 필터 — 좁은 화면 기간 칩 여백과 기업명 칸 높이 옵션

- 대상: src/components/composite/search-filter-form.tsx
- 이전: 640 미만에서 기간 칩 네 개가 한 줄을 나눌 때 칩 좌우 여백이 그대로라 360 폭에서 "3개월" 이 잘렸습니다. `CompanyNameField` 는 높이가 40 하나였습니다.
- 지금: 640 미만에서만 칩 좌우 여백을 8(`max-sm:*:px-2`)로 줄였습니다. `CompanyNameField` 에 `size`(`'lg' | 'md'`)를 더해 `lg` 면 같은 줄의 셀렉트와 같은 48 로 섭니다.
- 확인 방법: 360 폭에서 조회기간 칩 글자가 잘리지 않는지 봅니다.
- 영향 화면: [기업 평가결과 조회](/corp/mypage/evaluation-results) `보완(09/08)` · [기관 평가결과 조회](/org/mypage/evaluation-history) `보완(09/11)` · [기관 평가검증 신청 조회](/org/mypage/verification-application) `완료` · [조회 필터](/component-guide/search-filter-form)
- 유지: 640 이상의 칩 모양과 `CompanyNameField` 의 기본 높이(40)는 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/bd2f8077)

### [동작] 마이페이지 사이드바 — K-BIGx 보고서 이력 메뉴 연결

- 대상: src/components/composite/mypage-sidebar.tsx
- 이전: 기업·기관 메뉴의 [K-BIGx 보고서 이력] 주소가 `#` 이라 눌러도 이동하지 않았습니다.
- 지금: 기업은 `/corp/mypage/k-bigx-report-history`, 기관은 `/org/mypage/k-bigx-report-history` 로 갑니다.
- 영향 화면: 기업·기관 마이페이지 화면 전체의 사이드바(좁은 화면은 메뉴 드롭다운)
- 유지: 나머지 메뉴 항목·순서·아이콘은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/44c8b6b6)

### [동작] 기관 평가결과 조회 — 페이지를 넘길 때 목록 머리가 메뉴 드롭다운에 가리지 않게

- 대상: src/components/custom/org-evaluation-history-list.tsx
- 이전: 페이지를 넘기면 목록 머리(`총 N건`)로 굴리되 자리를 헤더 높이만큼만 비워(`scroll-mt-20`, 80) md 미만에서는 헤더 아래에 붙는 마이페이지 메뉴 드롭다운 줄(152)에 목록 머리가 가렸습니다. md~xl 에서도 헤더(100)보다 자리가 좁아 윗부분이 20 가렸습니다.
- 지금: 위에 붙어 있는 높이를 폭마다 따로 비웁니다 — md 미만은 헤더 56 + 메뉴 드롭다운 줄 152 라 `scroll-mt-56`(224), md~xl 은 헤더 100 이라 `md:scroll-mt-28`(112), xl 이상은 `xl:scroll-mt-32`(128)입니다. K-BIGx 보고서 이력 목록과 같은 값입니다.
- 확인 방법: 360 폭에서 목록 아래의 페이지 번호를 누릅니다 — 목록 머리가 메뉴 드롭다운 줄 바로 아래에 섭니다.
- 영향 화면: [기관 평가결과 조회](/org/mypage/evaluation-history) `보완(09/11)`
- 유지: 페이지 나누기·조회 조건·카드 내용은 그대로이고, `prefers-reduced-motion` 이면 애니메이션 없이 바로 이동합니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/42eb13d7)

## [신규 추가]

### K-BIGx 보고서 이력 화면 (기업·기관)

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/mypage/k-bigx-report-history/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/k-bigx-report-history/page.tsx
    - src/content/service/k-bigx-report-history.ts
    - src/content/service/org-k-bigx-report-history.ts
- 적용: 신규 파일 추가
- 내용: 조회 필터 · 총 건수 · 보고서 카드 · 페이지 이동으로 이루어진 목록 화면입니다. 두 화면이 같은 목록 조각(`KBigxReportHistoryList`)을 쓰고 사이드바·경로·데이터만 다릅니다.
- 기업: Figma "SB-FOTA-CM0-0017_마이페이지_K-BIGx 보고서 이력". 조회 필터는 조회기간 · [조회유형 | 기업명] 입니다. 목업 8건.
- 기관: Figma "마이페이지_K-BIGx 보고서 이력"(기관). 조회 필터는 조회기간(라벨 감춤) · [조회유형 | 보고서 유형] · 검색어(기업명·조회 기관) 입니다. 카드에 보고서 유형 배지와 조회 기관이 더해집니다. 목업 11건(기업혁신성장 8 · 대량정보조회 3).
- 연동: 화면은 `getKBigxReportHistory()` · `getOrgKBigxReportHistory()` 하나씩만 부릅니다. 목업을 조회 API 로 바꿀 때 고칠 파일은 content/service 두 파일뿐입니다. 카드 버튼 주소는 `K_BIGX_REPORT_ROUTES`(download · excel · htmlArchive, 지금은 `#`)가 정합니다.
- 영향 화면: [기업 K-BIGx 보고서 이력](/corp/mypage/k-bigx-report-history) `완료` · [기관 K-BIGx 보고서 이력](/org/mypage/k-bigx-report-history) `완료`

### KBigxReportHistoryList · KBigxReportCard — K-BIGx 보고서 이력 목록 조각

- 대상: src/components/custom/k-bigx-report-history-list.tsx
    - src/components/custom/k-bigx-report-card.tsx
    - src/constants/k-bigx-report-history.ts
- 적용: 신규 파일 추가
- 목록: `userType`('corp' | 'org')에 따라 조회 필터 칸이 갈립니다. 한 페이지 2건(`K_BIGX_REPORT_HISTORY_PAGE_SIZE`)이고, 비었을 때는 "검색내역이 없습니다." 가 결과 카드 자리에 섭니다.
- 카드: 기업명 / 이용권차감 상자(여·부) · 상세(조회유형·조회일시·특허명) · 버튼입니다. 데이터에 `reportType` 이 있으면 기업명 위에 보고서 유형 배지(기업혁신성장 info · 대량정보조회 보라, 공용 Badge outline)가, `inquiryOrganization` 이 있으면 상세 네 번째 칸 [조회 기관]이 붙습니다.
- 버튼: 기업 카드와 기업혁신성장은 [보고서 다운로드] 하나입니다. 대량정보조회는 결과 파일 두 가지 [엑셀 결과] · [HTML 압축파일](`K_BIGX_BULK_REPORT_ACTION`)을 같은 폭으로 나란히 두고, sm 미만에서는 위아래로 쌓습니다. 대량정보조회 카드는 상세 세 번째 칸 이름이 [특허명] 대신 [데이터 건수]입니다.
- 접근성: 이용권 상자는 "이용권차감 여" 한 문장으로 읽히게 하고, 버튼 이름에 기업명을 붙여 어느 건의 보고서인지 알립니다[6.4.3]. 조회유형은 색과 글자가 함께 뜻을 전합니다[5.3.1].

### SubAccountForm — 하위 계정 등록·수정 공통 폼 조각

- 대상: src/components/composite/sub-account-form.tsx
- 적용: 신규 파일 추가
- 내용: 계정 ID(중복확인)·담당자 이름·구분/소속·상태·메모 칸과 본문·CTA([취소]·[저장하기]), 제출 검사를 한곳에 둡니다. 등록은 `afterAccountId` 로 비밀번호 칸을, 수정은 `children` 으로 서비스별 배분 이용건수 구획을 끼웁니다.
- props: `idPrefix`(폼·칸 id 앞머리) · `isAccountIdReadOnly`(계정 ID 잠금 — 중복확인 없음) · `afterAccountId` · `children` · `onValid`
- 검사: required·pattern 은 공통 관문(`useFormTabsSubmit`)이 보고, 계정 ID 중복확인만 이 조각이 따로 봅니다. 담당자 이름·구분/소속은 띄어쓰기만 넣어도 막습니다.
- 연동: `[프론트엔드 연동]` 주석 자리(중복확인의 `setTimeout`)를 계정 ID 중복 확인 API 로 바꿉니다.

### 하위 계정 수정 모달과 화면

- 대상: src/components/composite/sub-account-edit-dialog.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/edit/page.tsx
- 적용: 신규 파일 추가
- 내용: 하위계정 현황 카드의 [⋮] > [수정] 이 여는 모달입니다. 등록 모달과 같은 칸(`SubAccountForm`)이 계정의 지금 값으로 채워져 열리고, 그 아래에 서비스별 배분 이용건수 구획이 붙습니다. 비밀번호는 이 모달에서 바꾸지 않습니다([⋮] > [비밀번호 초기화] 담당).
- 칸과 값: 제출 값의 키는 칸의 `name` 입니다 — `accountId` · `managerName` · `organization`(= `item.name`) · `status` · `memo` · `serviceUsage-{순번}`. 서비스별 건수 칸은 `item.detail.serviceUsages` 순서대로 하나씩 생기고, 칸 위에 그 서비스의 이용기간(`period`)이 붙습니다.
- 저장: 검사를 통과하면 `onSubmit` 에 고친 값을 담은 계정 한 건이 옵니다(계정 ID 는 바뀌지 않음, 글자 칸 앞뒤 띄어쓰기는 걷어 냄, 건수는 숫자로 바꿈). 수정 API 호출은 `handleValid` 의 `[프론트엔드 연동]` 주석 자리에 붙입니다.
- 계정 ID: 읽기 전용이라 [중복확인]과 필수 표시가 없고, 값은 그대로 제출됩니다.
- 유효성검사: 담당자 이름·구분/소속은 비었거나 띄어쓰기만 있으면, 서비스별 건수는 비었으면 막습니다("배분할 건수를 입력해 주세요. 배분하지 않으면 0을 입력합니다."). 건수 칸은 숫자만 입력됩니다.
- props: `open` · `onOpenChange`(목록이 쥘 때) · `defaultOpen`(단독 화면) · `item` · `onSubmit(item)` — 고친 값을 담은 계정 한 건을 넘깁니다.
- 영향 화면: [하위계정 수정](/org/mypage/sub-account-progress/edit) `완료` — 시안과 같은 기술평가부 협약 케이스(KTRS-FM 평가·투자 모형)로 엽니다.

### 하위계정 수정 완료 토스트 화면

- 대상: src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/edit/complete-toast/page.tsx
- 적용: 신규 파일 추가
- 내용: 수정 모달의 [저장하기] 가 띄우는 "하위계정 정보가 수정되었습니다." 토스트를 단독으로 확인하는 화면입니다. 노출 시간을 무한으로 두어 사라지지 않습니다(이 화면에서만).
- 영향 화면: [하위계정 수정 완료 토스트](/org/mypage/sub-account-progress/edit/complete-toast) `완료`

## [덮어쓰기]

### 퍼블리싱 인덱스 — 이번 회차 화면 상태 반영

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다. 세 파일은 함께 교체해야 합니다 — 콘텐츠 관문이 빌드 시점에 화면 key 를 교차검증합니다.
- 신규 화면: [기업 K-BIGx 보고서 이력](/corp/mypage/k-bigx-report-history) · [기관 K-BIGx 보고서 이력](/org/mypage/k-bigx-report-history) · [하위계정 수정](/org/mypage/sub-account-progress/edit) · [하위계정 수정 완료 토스트](/org/mypage/sub-account-progress/edit/complete-toast) 를 `대기중` 에서 `완료` 로 올렸습니다.
- 이름: "하위계정 저장 완료 토스트" 를 "하위계정 수정 완료 토스트" 로 바꿨습니다(인덱스와 경로 레지스트리의 화면 이름).
