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

### [기능] 헤더 메뉴 — 시안대로 메뉴명 정정 · 평가모형·마이페이지 화면 연결

- 대상: src/constants/header-navigation.ts
- 이전: 시안과 다른 메뉴명이 남아 있었고(기업 "1:1문의내역" · 알림마당 "FAQ" · 기관 마이페이지 다섯 항목), 평가모형과 마이페이지 항목이 모두 `#` 이라 눌러도 이동하지 않았습니다.
- 메뉴명: 알림마당 `FAQ` → `자주 묻는 질문`(기업·기관 공통 — 화면 제목·퍼블리싱 인덱스와 같은 이름)
    - 기업 마이페이지 `1:1문의내역` → `1:1문의`
    - 기관 마이페이지 `내 정보 수정` → `내 정보` · `평가이력 조회` → `평가결과 조회` · `K-BIGx 보고서 이력` → `평가검증 신청 조회` · `하위 계정 진행 현황` → `하위 계정 현황` · `1:1 문의 내역` → `1:1문의`
- 평가모형 메뉴 링크: 기업 기술평가·기관 개별평가의 네 항목(토글이 가리키는 유형의 화면으로 이동)
    - `KTRS-FM` — 기업 고객정보활용동의 · 기관 평가진행방식 선택
    - `Tech-Index` — 기업·기관 모두 평가모형 선택
    - `투자모형` — 기업·기관 모두 고객정보활용동의
    - `평가결과 조회` — 기업 평가결과 조회 · 기관 평가이력 조회
- 마이페이지 메뉴 링크: 기업 여섯 항목 · 기관 다섯 항목을 각 화면으로 연결
    - 기업 — 내 정보 · 대표자 이력 · 평가결과 조회 · K-BIGx 보고서 이력 · 유료 서비스 관리(첫 화면인 결제내역) · 1:1문의
    - 기관 — 내 정보 · 평가결과 조회 · 평가검증 신청 조회 · 하위 계정 현황 · 1:1문의
- 연동: 시작 화면은 `EVALUATION_MODEL_START_PATHS` 와 `MY_PAGE_ITEMS` 두 곳에만 적혀 있습니다. 화면이 생기면 그 표에 한 줄만 더하면 GNB 드롭다운과 전체 메뉴에 함께 반영됩니다. 기관 "내 정보"는 회원 유형(협약·비협약 은행/기관·하위계정)마다 화면이 갈려 대표로 협약은행 화면을 걸어 두었으니, 서비스에서는 로그인한 회원 유형의 화면으로 바꿔 주세요.
- 유지: 아직 화면이 없는 항목(플랫폼 소개 · 일괄평가 · 특허평가 등)은 `#` 그대로입니다.
- 영향 화면: [기업 전체메뉴](/corp/full-menu) · [기관 전체메뉴](/org/full-menu) 와 헤더 GNB 를 쓰는 모든 화면
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3846ba15)

### [동작] 헤더 — 전체 메뉴를 연 채로 기업·기관을 바꿀 수 있게

- 대상: src/components/composite/header.tsx
- 이전: 전체 메뉴가 열려 있을 때 기업·기관 토글을 누르면 메뉴가 닫혔습니다. 토글이 메뉴(모달) 밖 헤더에 있어 바깥 클릭으로 처리됐기 때문입니다. 바뀐 메뉴를 보려면 다시 열어야 했습니다.
- 지금: 토글에서 시작한 조작만 바깥 클릭으로 보지 않습니다. 토글에 표시(`data-header-user-type-toggle`)를 남기고 메뉴의 `onInteractOutside` 에서 그 자리에서 온 조작이면 닫지 않습니다. 메뉴는 열린 채로 내용만 그 유형의 메뉴로 바뀝니다.
- 유지: 그 밖의 바깥 클릭 · Esc · [닫기]로 닫는 동작과 포커스 처리는 그대로입니다. shadcn 셸은 고치지 않고 사용처에서 props 로만 처리했습니다.
- 영향 화면: 헤더를 쓰는 모든 화면(전체 메뉴가 열린 상태)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f87189db)

### [동작] 기관 투자모형 고객정보활용동의 — [이전] 삭제

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/investment-model/customer-consent/page.tsx
- 이전: [이전]이 `/org/individual-evaluation/investment-model/selection` 을 가리켰는데 그 화면이 없어 404 였습니다.
- 지금: 이 화면이 투자모형의 첫 단계라 [이전]을 두지 않습니다. 함께 쓰이지 않게 된 경로 상수와 `Link` import 도 지웠습니다.
- 유지: [다음](검사 후 기업·기술정보 입력으로 이동)은 그대로입니다.
- 영향 화면: [기관 투자모형 고객정보활용동의](/org/individual-evaluation/investment-model/customer-consent)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ad779aa7)

### [문구] 평가모형 이름 변경 — 화면에 보이는 이름 (혁신성장지수 → 혁신성장역량지수)

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/selection/tech-index-model-form.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/customer-consent/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/company-technology-info/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/complete/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/customer-consent/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/company-technology-info/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/complete/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/model-meta.ts
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/selection/tech-index-model-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/batch-model-meta.ts
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/batch-evaluation-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/batch-evaluation-complete-screen.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/bulk-data-complete-screen.tsx
    - src/components/custom/hero-section.tsx
    - src/content/service/org-sub-accounts.ts
- 이전: 화면에 보이는 모형 이름이 `혁신성장지수` 였습니다.
- 지금: `혁신성장역량지수` 로 바꿨습니다(15개 파일 19곳). 바뀐 것은 이 낱말뿐이고 구조·동작은 그대로입니다.
- 내용: 평가모형 선택 카드 이름 · 화면 제목(일반/창업) · 일괄평가 완료 문구("혁신성장역량지수 평가 Tech-Index 신청이 완료되었습니다.") · 메인페이지 소개 문구 · 하위 계정 서비스 이름입니다.
- 함께 반영: 아래 "주석" 카드와 같은 낱말 변경이지만, 그쪽은 받아도 화면이 달라지지 않습니다. 코드에 옛 이름을 남기지 않으려면 함께 반영해 주세요.
- 영향 화면: [기업 Tech-Index 선택](/corp/technology-evaluation/tech-index/selection) · [기업 일반 고객정보활용동의](/corp/technology-evaluation/tech-index/general/customer-consent) · [기업 창업 고객정보활용동의](/corp/technology-evaluation/tech-index/startup/customer-consent) · [기관 Tech-Index 선택](/org/individual-evaluation/tech-index/selection) · [기관 일괄평가 (1) Tech-Index 선택](/org/batch-evaluation/tech-index-selection) · 기관 개별평가 Tech-Index 각 단계 · [기관 하위계정 상세](/org/mypage/sub-account-progress/detail) 의 "서비스별 배분 이용건수" · 메인페이지 첫 화면 소개 문구
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a6bf7ebb)

### [문구] 평가모형 이름 변경 — 주석만 (화면 변화 없음)

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/selection/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/selection/page.tsx
    - src/components/composite/self-diagnosis-form-tabs.tsx
    - src/components/composite/tech-index-company-info-form.tsx
    - src/components/composite/tech-index-finance-form.tsx
    - src/components/composite/tech-index-management-form.tsx
    - src/components/composite/tech-index-patent-form.tsx
    - src/components/composite/tech-index-record-form.tsx
    - src/components/composite/tech-index-representative-capability.tsx
    - src/components/composite/tech-index-staff-summary.tsx
    - src/components/theme/radio-card.variants.ts
    - src/constants/sub-account.ts
    - src/constants/technology-evaluation.ts
- 이전: 시안 이름·설명 주석에 `혁신성장지수` 가 남아 있었습니다.
- 지금: `혁신성장역량지수` 로 바꿨습니다(13개 파일 25곳). 주석만 바뀌므로 반영해도 화면 글자는 달라지지 않습니다.
- 이유: 코드 검색·리뷰에서 옛 이름이 나오지 않게 맞춥니다.
- 유지: 이미 배포된 회차의 릴리스 기록(`release-notes.generated.json`)에 남은 옛 이름 1건은 지난 기록이라 그대로 둡니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3dd0028e)

### [스타일] PageTitleBar — 좁은 화면에서 제목이 낱말 가운데서 끊기지 않게

- 대상: src/components/composite/page-title-bar.tsx
- 이전: 360 너비에서 제목이 "혁신성장역량지수 (일 / 반)" 처럼 낱말 가운데에서 잘렸습니다.
- 지금: 제목(h1)에 `break-keep` 을 주어 낱말 사이에서만 줄이 바뀝니다 — 괄호 묶음이 통째로 다음 줄로 내려갑니다.
- 유지: 글자 크기·색·배치는 그대로이고, 제목이 한 줄에 들어가는 화면은 달라지지 않습니다.
- 영향 화면: PageTitleBar 를 쓰는 모든 화면
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3a0eea2b)

### [스타일] PageTitleBar — 뱃지를 제목 글자 끝에 붙임

- 대상: src/components/composite/page-title-bar.tsx
- 이전: md(768) 이상에서 제목과 뱃지가 각각 flex 칸이라, 제목이 두 줄이 되면 뱃지가 마지막 글자 뒤가 아니라 상자 오른쪽 끝으로 밀렸습니다(태블릿에서 "… Tech-Index" 와 멀리 떨어진 오른쪽 끝에 뱃지).
- 지금: 제목을 inline 으로 흘려 뱃지가 마지막 글자 바로 뒤(간격 8)에 옵니다. 뱃지 윗변은 시안대로 제목 글자 윗변에 맞춥니다(`align-top` + 위 여백 12) — 가운데 정렬로 두면 제목 줄 높이가 커서 뱃지가 글자보다 아래로 내려앉습니다.
- 유지: 모바일(md 미만)에서 뱃지가 제목 위 줄에 오는 배치와 DOM 순서(제목 → 뱃지)는 그대로입니다.
- 영향 화면: 뱃지를 쓰는 모든 PageTitleBar 화면 — [기관 평가내역조회(구: 대량정보조회) — 창업](/org/batch-evaluation/evaluation-history-or-batch/startup/bulk-data-request) · [기업 Tech-Index 일반 고객정보활용동의](/corp/technology-evaluation/tech-index/general/customer-consent) 등
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3a0eea2b)

### [문구] 기관 평가내역조회(구: 대량정보조회) — 화면·탭 제목을 새 이름으로 통일

- 대상: src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/general/bulk-data-request/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/startup/bulk-data-request/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/general/bulk-data-complete/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/startup/bulk-data-complete/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/bulk-data-complete-screen.tsx
- 이전: 브라우저 탭 제목(`metadata.title`)이 "대량정보 조회 신청" · "대량정보 조회 신청 완료" 라, 이미 "평가내역조회" 로 적혀 있던 브레드크럼·단계 제목과 어긋났습니다.
- 지금: 탭 제목을 신청 화면은 "평가내역조회", 완료 화면은 "평가내역조회 완료" 로 바꿔 화면 글자와 맞췄습니다. 탭 제목은 갈래마다 파일이 달라 네 곳(신청·완료 × 일반·창업)을 함께 고쳤습니다. 브레드크럼·단계 제목은 원래부터 "평가내역조회" 라 화면 파일은 바뀌지 않았습니다.
- 함께 바뀐 문구: 완료 화면 안내 "신청하신 대량정보 조회는 접수 후 …" → "신청하신 평가내역조회는 접수 후 …"(공용 화면 파일이라 일반·창업 두 완료 화면에 함께 반영).
- 유지: 큰 제목("일반/창업 Tech-Index")과 카드 안 제목("평가내역조회 목적" · "평가내역조회 필수 양식")은 그대로입니다.
- 그대로 두는 것: 뱃지 "대량정보 조회" 는 시안 표기라 유지합니다. 완료 화면 안내의 "조회 결과는 '대량정보 조회' 화면에서 확인하실 수 있습니다." 는 아직 만들지 않은 결과 조회 화면의 이름이라 확정 뒤에 맞춥니다("값이 없는 항목은 대량정보의 평균값…" 은 화면 이름이 아니라 업로드한 자료를 가리키는 말이라 그대로입니다). K-BIGx 보고서의 "대량정보조회" 는 다른 메뉴라 대상이 아닙니다.
- 함께 반영: 아래 [덮어쓰기] 의 퍼블리싱 인덱스 카드에서 같은 화면의 인덱스 이름도 새 이름으로 바꿉니다.
- 영향 화면: [기관 평가내역조회(일반)](/org/batch-evaluation/evaluation-history-or-batch/general/bulk-data-request) · [기관 평가내역조회(창업)](/org/batch-evaluation/evaluation-history-or-batch/startup/bulk-data-request) · [평가내역조회 완료(일반)](/org/batch-evaluation/evaluation-history-or-batch/general/bulk-data-complete) · [평가내역조회 완료(창업)](/org/batch-evaluation/evaluation-history-or-batch/startup/bulk-data-complete)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/dd294151)

### [문구] 기관 일괄평가 — 화면 제목을 "일반 Tech-Index" · "창업 Tech-Index" 로

- 대상: src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/batch-model-meta.ts
- 이전: 제목이 "혁신성장역량지수 평가 (일반) Tech-Index" · "혁신성장역량지수 평가 (창업) Tech-Index" 라 길어서 태블릿에서 두 줄로 넘어갔습니다.
- 지금: "일반 Tech-Index" · "창업 Tech-Index" 로 줄였습니다. 제목은 이 파일 한 곳에 있어 두 갈래의 신청·완료 네 화면에 함께 반영됩니다.
- 함께 반영: 이 파일은 위 "평가모형 이름 변경 — 화면에 보이는 이름" 카드에도 들어 있어 한 커밋에 함께 담겼습니다. 두 카드가 같은 파일을 고치므로 최종 내용은 이 카드 기준입니다.
- 유지: 선택 화면의 카드 이름("혁신성장역량지수 (일반)" · "(창업)")과 완료 화면 본문 문구는 그대로입니다.
- 영향 화면: [평가내역조회(구: 대량정보조회) — 창업](/org/batch-evaluation/evaluation-history-or-batch/startup/bulk-data-request) · [일괄평가 진행 신청(일반)](/org/batch-evaluation/evaluation-history-or-batch/general/batch-evaluation-request) 과 두 갈래의 완료 화면
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a6bf7ebb)

### [기능] 기관 내 정보(하위 계정) — 전화번호 칸 삭제

- 대상: src/components/composite/org-mypage-profile-form.tsx
    - src/app/(user-type)/org/(service)/(member-sub-account)/mypage/profile-edit/sub-account/page.tsx
- 이전: [기본 정보]에 고칠 수 있는 칸이 담당자 · 전화번호 · PW 세 칸이었습니다.
- 지금: 전화번호 칸을 지워 담당자 · PW 두 칸입니다. 하위 계정을 등록할 때 전화번호를 받지 않아 채울 값이 없는 칸이었습니다. 세 칸 줄(`FieldRow3`)이 두 칸 줄(`FieldGrid`)로 바뀝니다.
- 함께 반영: 제목 아래 안내에서도 전화번호를 뺐습니다 — "회원이 직접 수정할 수 있는 항목은 담당자 · 비밀번호(PW)입니다."
- 유지: 잠긴 여섯 칸(기관명 · 기관구분 · ID · 상위 마스터 기관 · 사업기간 · 가입/생성 일시)과 [이용권 정보] 구획은 그대로입니다. 하위 계정이 아닌 기관 회원 화면(협약·비협약 은행/기관)의 전화번호 칸도 그대로입니다.
- 영향 화면: [기관 내 정보 — 기관회원(하위계정)](/org/mypage/profile-edit/sub-account)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d6f8c5e7)

## [덮어쓰기]

### 컴포넌트 가이드 RadioCard 데모 — 평가모형 이름 반영

- 대상: src/app/component-guide/(guide)/radio-card/radio-card-demo.tsx
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다. 서비스 화면이 아니라 가이드 예시라 프론트엔드 작업 대상이 아닙니다.
- 내용: 예시 카드 이름 `혁신성장지수 (일반)` · `(창업)` 을 `혁신성장역량지수 (일반)` · `(창업)` 으로 바꿨습니다(2곳).
- 영향 화면: [RadioCard](/component-guide/radio-card)

### 퍼블리싱 인덱스 — 평가내역조회 이름 반영

- 대상: src/content/publishing-guide/publishing-index.json
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다. 화면 key 는 그대로라 경로 레지스트리는 바뀌지 않습니다.
- 내용: 기관 일괄평가 아래 "(3) 대량정보 조회 신청" · "(4) 대량정보 조회 신청 완료" 를 "(3) 평가내역조회(구: 대량정보조회)" · "(4) 평가내역조회 완료(구: 대량정보조회 완료)" 로 바꿨습니다. 옛 이름을 괄호로 함께 두어 화면정의서의 옛 이름으로 찾는 사람도 같은 줄을 찾을 수 있게 합니다.
- 유지: K-BIGx 보고서의 "대량정보조회" · "대량정보조회 완료" 는 다른 메뉴라 그대로입니다.
