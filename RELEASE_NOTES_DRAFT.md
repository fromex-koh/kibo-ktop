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

### [마크업/스타일] 기관 고객정보활용동의 — 동의서 양식 다운로드 버튼 추가

- 대상: src/components/composite/org-customer-consent-form.tsx
- 관련 화면(퍼블리싱 인덱스 UIUX 보완 뱃지):
    - [기관 KTRS-FM 고객정보활용동의](/org/individual-evaluation/ktrs-fm/customer-consent) — 보완(09/08)
    - [기관 Tech-Index 일반용 고객정보활용동의](/org/individual-evaluation/tech-index/general/customer-consent) — 보완(09/08)
    - [기관 Tech-Index 창업용 고객정보활용동의](/org/individual-evaluation/tech-index/startup/customer-consent) — 보완(09/08)
    - [기관 투자모형 고객정보활용동의](/org/individual-evaluation/investment-model/customer-consent) — 보완(09/08)
- 적용: `OrgCustomerConsentForm`의 `FormCard` 한 곳에 `action` 을 추가한 변경을 Diff로 반영합니다.
- 변경: [정보이용동의서 업로드] 카드 제목 오른쪽에 [동의서 양식 다운로드] 버튼을 두었습니다. 일괄평가 신청 화면의 같은 버튼과 동일한 `variant="secondary" size="xs"` 입니다.
- 연동 확인: 아직 동작이 없는 버튼입니다. 양식 파일 경로가 정해지면 `// [프론트엔드 연동]` 주석 자리에 연결합니다.
- 유지: 동의 여부 라디오·파일 업로드 정책(PDF·ZIP·RAR·7Z, 50MB)·제출 검사·다음 단계 이동은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/745ea52041bf3169846279e0d360f00e0422bef0)

### [마크업/스타일] 기술 인력 현황 — 동업종 종사경력을 년·개월 두 칸으로 통일

- 대상:
    - src/components/composite/self-diagnosis-form-tabs.tsx
    - src/components/composite/tech-staff-form.tsx
    - src/components/composite/form-fields.tsx
- 관련 화면(퍼블리싱 인덱스 UIUX 보완 뱃지):
    - [기업 Tech-Index 일반용 기업·기술정보 입력](/corp/technology-evaluation/tech-index/general/company-technology-info) — 보완(09/08)
    - [기업 Tech-Index 창업용 기업·기술정보 입력](/corp/technology-evaluation/tech-index/startup/company-technology-info) — 보완(09/08)
    - [기관 Tech-Index 일반용 기업·기술정보 입력](/org/individual-evaluation/tech-index/general/company-technology-info) — 보완(09/08)
    - [기관 Tech-Index 창업용 기업·기술정보 입력](/org/individual-evaluation/tech-index/startup/company-technology-info) — 보완(09/08)
- 적용: 세 파일을 함께 Diff로 반영합니다. 탭 설정·인력 카드·필드 행 세 곳의 변경이 한 묶음입니다.
- 입력 칸 변경: Tech-Index 일반용·창업용 탭에 `showIndustryCareerMonth` 를 켜고 창업용의 `industryCareerUnit="년"` 을 지웠습니다. 제출값이 한 칸(`staff-N-industryCareer`)에서 두 칸(`+ staff-N-industryCareerMonth`)으로 늘어납니다. KTRS-FM·투자모형은 이미 두 칸이라 변화가 없습니다.
- 3열 줄 보완: 일치여부 칸이 있는 줄(창업용)이 한 칸 변형만 그리고 있어 두 칸 변형도 쓰도록 고쳤습니다. 이 수정이 없으면 창업용은 오히려 글자 한 칸으로 되돌아갑니다.
- 태블릿 배치: 그 줄만 `md:grid-cols-2 xl:grid-cols-3` 으로 둡니다. 세 칸으로 나누면 [전공과 평가대상 기술 분야 일치여부] 라벨이 두 줄로 접혀 그 칸의 셀렉트만 한 줄 아래로 내려갑니다. `FieldRow3` 는 `className` 만 받도록 넓혔고 기본값은 `md:grid-cols-3` 그대로라 다른 화면·다른 줄은 영향이 없습니다.
- 유지: 라벨 문구·숫자만 입력·앞자리 0 정리·빈 칸을 벗어나면 0 복원·시안 폭(xl)의 3열 배치는 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/36479e2336fdb87c90023079ab9ed1febb9b010f)

### [마크업/스타일] 마이페이지 LNB — 메뉴명·아이콘·회원 배지 시안 싱크

- 대상:
    - src/components/composite/mypage-sidebar.tsx
    - src/components/composite/header.tsx
    - src/constants/mypage-profile.ts
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/profile/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/representative-history/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/inquiry-history/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/inquiry-history/inquiry-detail/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/inquiry-history/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/inquiry-history/inquiry-detail/page.tsx
    - src/app/(user-type)/org/(service)/(member-sub-account)/mypage/profile-edit/sub-account/page.tsx
- 관련 화면(퍼블리싱 인덱스 UIUX 보완 뱃지):
    - [기업 내 정보](/corp/mypage/profile) — 보완(09/08)
    - [기업 대표자 이력](/corp/mypage/representative-history) — 보완(09/08)
    - [기업 평가결과 조회](/corp/mypage/evaluation-results) — 보완(09/08)
    - [기관 내 정보(협약은행)](/org/mypage/profile-edit/partner-bank) — 보완(09/08)
    - [기관 내 정보(협약기관)](/org/mypage/profile-edit/partner-agency) — 보완(09/08)
    - [기관 내 정보(하위계정)](/org/mypage/profile-edit/sub-account) — 보완(09/08)
- 적용: 사이드바·헤더·상수와 그 값을 넘기던 화면 파일을 함께 Diff로 반영합니다. 사이드바는 마이페이지 전 화면이 공유하므로 이 카드 하나가 마이페이지 전체에 걸립니다.
- 메뉴명: 기업 [대표자(경영자) 역량 및 경력] → [대표자 이력], 기관 [하위 계정 현황] → [하위계정 현황] · [1:1 문의 내역] → [1:1 문의] 로 시안과 맞췄습니다. 화면이 넘기는 `current` 값도 같은 글자로 바꿨습니다.
- 아이콘: 기관 [평가검증 신청 조회] ClipboardCheck → FolderSearch, [하위계정 현황] Users → UserSearch.
- 배지: 사이드바가 자체 배지를 그리지 않고 헤더의 `UserTypeBadge` 를 그대로 씁니다(기업 info · 기관 purple). 글자와 색이 한 곳에서만 정해집니다 — `header.tsx` 에서 `UserTypeBadge` 를 export 합니다.
- 제거: 쓰이지 않던 `memberType` prop 을 사이드바와 화면 8곳, `MYPAGE_MEMBER`·`ORG_MYPAGE_MEMBERS` 에서 지웠습니다. 넘기던 값이 화면에 나오지 않는 죽은 값이었습니다.
- 유지: 카드 크기(344)·항목 높이(56)·활성 면·폭에 따른 세 가지 모습(사이드바·드롭다운·상단 고정)은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ca2f7bc5a38da9c7fa0cae9d25d8d258c821d5f5)

### [마크업/스타일] 기업 내 정보 — 안내 문구와 담당자 칸 순서

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/profile/page.tsx
    - src/components/composite/mypage-profile-form.tsx
- 관련 화면(퍼블리싱 인덱스 UIUX 보완 뱃지):
    - [기업 내 정보](/corp/mypage/profile) — 보완(09/08)
- 적용: 화면의 서브텍스트와 폼 카드 두 파일을 함께 Diff로 반영합니다.
- 문구: 제목 아래 안내를 "등록된 회원 정보를 수정한 후 저장 버튼을 눌러주세요." 로 교체했습니다(시안).
- 담당자 카드: 제목을 [기업담당자], 설명을 "서류안내, 현장실사 협의 등 평가 진행사항을 안내받을 담당자 정보(휴대폰)를 입력해 주십시오." 로 두고 칸 순서를 이름 → 연락처 → 직위 → 이메일 로 바꿨습니다.
- 삭제: 연락처 아래에 있던 같은 뜻의 안내 문구를 지웠습니다(카드 설명과 중복). 그 문구를 가리키던 `aria-describedby` 도 함께 지워 끊긴 참조가 남지 않게 했습니다.
- 유지: 입력 검사·저장/취소 흐름·업종코드 조회·주소 검색은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f3ba2e5e69771055cfbddee287d687263e6cda8e)

### [마크업/스타일] 기업 대표자 이력 — 한 카드로 묶고 안내 문구 교체

- 대상:
    - src/components/composite/mypage-representative-history-form.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/representative-history/page.tsx
- 관련 화면(퍼블리싱 인덱스 UIUX 보완 뱃지):
    - [기업 대표자 이력](/corp/mypage/representative-history) — 보완(09/08)
- 적용: 폼과 화면 두 파일을 함께 Diff로 반영합니다.
- 구성: 따로 서던 두 카드를 [대표자 이력] 한 카드 안의 두 구획(SubSectionHeader)으로 묶었습니다. 카드 설명은 "본 화면의 정보는 개인정보 수집·이용 동의에 따라 수집·관리되는 대표자 개인정보입니다." 입니다.
- 제목 단계: 카드 제목이 h3 이 되면서 반복 카드의 제목을 h4 로 내렸습니다(제목 단계를 건너뛰지 않습니다).
- 유지: 경력 추가·삭제, 근무기간 짝 검사, 저장/취소 흐름은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/cb53f4cbc2e2dddb2cc30a15283ece9e04350c82)

### [마크업/스타일] 기관 내 정보 — 안내 문구·기본 정보 칸·이용권 정보 구획

- 대상:
    - src/components/composite/org-mypage-profile-screen.tsx
    - src/components/composite/org-mypage-profile-form.tsx
    - src/constants/mypage-profile.ts
    - src/constants/preview-user.ts
- 관련 화면(퍼블리싱 인덱스 UIUX 보완 뱃지):
    - [기관 내 정보(협약은행)](/org/mypage/profile-edit/partner-bank) — 보완(09/08)
    - [기관 내 정보(협약기관)](/org/mypage/profile-edit/partner-agency) — 보완(09/08)
    - [기관 내 정보(하위계정)](/org/mypage/profile-edit/sub-account) — 보완(09/08)
- 적용: 화면 셸·폼·회원 상수를 함께 Diff로 반영합니다. 세 유형(협약은행·협약기관·하위계정)이 같은 폼을 쓰므로 한 묶음입니다.
- 문구: 제목 아래 안내를 "기관회원 정보는 가입 시 담당자가 등록·관리합니다. 수정이 필요하면 담당자에게 요청해 주세요." 로 교체하고, 같은 문구를 [기본 정보] 카드 안에서 다시 알리던 Alert 을 지웠습니다(화면에 한 번만 남깁니다).
- 필수 표시: 시안에 별표가 없는 칸에서 필수 표시를 뺐습니다 — 사업자번호, 하위계정의 잠긴 6칸(기관명·기관구분·ID·상위 마스터 기관·사업기간·가입/생성 일시).
- 하위계정 배치: 담당자·전화번호·비밀번호를 한 줄 3열(`FieldRow3`)로 두고, [이용권 정보] 를 별도 카드에서 같은 카드 안의 하위 구획으로 옮겼습니다(제목+설명은 SubSectionHeader, 목록은 SummaryList).
- 유지: 잠긴 칸의 읽기 전용 처리와 제출값 포함, 평가사업 선택의 읽기 전용 상태는 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/178d37557f79cbc2321d660391e74fc0c38f8937)

### [마크업/스타일] 기업 평가결과 조회 — 시안 재구성과 목업·API 분리

- 대상:
    - src/components/custom/evaluation-result-list.tsx
    - src/constants/evaluation-result.ts
    - src/content/service/evaluation-results.ts
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/evaluation-results/page.tsx
- 관련 화면(퍼블리싱 인덱스 UIUX 보완 뱃지):
    - [기업 평가결과 조회](/corp/mypage/evaluation-results) — 보완(09/08)
- 적용: 목록·상수·데이터·화면 네 파일을 함께 Diff로 반영합니다. 화면은 데이터를 넘기기만 하고 목록이 그리는 구조로 바뀝니다.
- 화면 구성: 모형 셀렉트를 텍스트 탭(TextTabs)으로 바꾸고 조회 필터 + 총 건수 + 결과 카드 + 페이지 이동으로 다시 세웠습니다. 세로 간격은 시안 기준입니다(제목→탭 40 · 탭→조회 40 · 조회→건수 40 · 건수→목록 16 · 카드 사이 16 · 목록→페이지 이동 40).
- 결과 카드: 결과값 단위가 모형마다 다릅니다(KTRS-FM·투자모형 등급 · Tech-Index 계열 점) — 단위는 값이 아니라 모형이 정하므로 모형 표(`EVALUATION_MODEL_TABS.unit`)에 두고 배지가 읽어 씁니다. 버튼도 모형마다 달라(KTRS-FM 셋 · 나머지 하나) 개수에 따라 배치가 갈립니다. 평가일은 한 줄입니다.
- 탭 필터: 탭이 목록을 실제로 거릅니다. 총 건수·페이지 수도 거른 결과 기준이고, 탭을 바꾸면 첫 페이지로 돌아갑니다. 결과 한 건의 `model` 은 탭 값과 같은 코드이고 화면에 쓰는 이름은 모형 표에서 찾습니다.
- 빈 상태: 결과가 없으면 "검색내역이 없습니다."(792×208 · 흰 면 · radius 16)가 목록 자리를 대신하고 페이지 이동은 감춥니다.
- 연동 지점: `src/content/service/evaluation-results.ts` 의 `getEvaluationResults()` 안을 조회 API 로 바꾸면 화면·목록은 손댈 것이 없습니다. 목업을 비우면 빈 상태를 그대로 확인할 수 있습니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ce77527b2c0fdff5c98afb40ce89dc1a5c1fcb42)

### [마크업/스타일] 보증신청 모달 — 안내를 한 문단으로, 버튼명 [아니요]

- 대상: src/components/composite/guarantee-application-dialog.tsx
- 관련 화면(퍼블리싱 인덱스 UIUX 보완 뱃지):
    - [기업 보증신청](/corp/mypage/evaluation-results/guarantee-application) — 보완(09/08)
- 적용: 모달 한 파일만 Diff로 반영합니다.
- 문구: 두 줄로 나뉘어 있던 안내를 한 문단으로 합쳤습니다 — "관할 기술평가 센터에서 평가를 진행합니다. 신청 완료 시 진행상태가 '보증신청 완료'로 표시됩니다."
- 색·버튼: 안내 색을 `text-label-foreground` 로, 버튼명을 [아니오] → [아니요] 로 바꿨습니다.
- 유지: 카드 치수(588×302)·버튼(246×60)·구획 간격(24/16/24)은 이미 시안과 같아 바뀐 것이 없습니다. 이 모달은 기술평가 완료 화면의 [보증신청]과 같은 컴포넌트라 그쪽 문구도 함께 바뀝니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3954bcf7b3f0a1c5d93333f8661e14d405cd6832)

### [마크업/스타일] 조회 필터·달력 — 좁은 화면 배치와 [초기화] 동작

- 대상:
    - src/components/composite/search-filter-form.tsx
    - src/components/composite/date-picker.tsx
- 적용: 두 파일을 함께 Diff로 반영합니다. 조회 필터를 쓰는 모든 목록 화면에 걸립니다.
- 좁은 화면: 날짜 두 칸을 세로로 쌓고(360에서 "연도-월-일"이 두 줄로 접히던 문제), 기간 칩 넷이 카드를 넘던 것을 한 줄 균등 분할로, [초기화]·[조회]가 층지듯 쌓이던 것을 한 줄 반반으로 바꿨습니다. 쌓인 날짜 칸 사이의 `~` 는 가운데에 둡니다.
- [초기화]: 날짜 칸이 비워지지 않던 문제를 고쳤습니다. `DatePicker` 는 값이 빈 상태가 되면 비제어로 돌아가 직전에 고른 날짜를 되살리는데, 폼이 빈 값도 쥐도록 `controlled` 를 연결했습니다.
- 새 필드: 검색 대상 셀렉트 + 검색어 입력을 한 줄에 두는 `KeywordSearchField` 를 더했습니다. 폼의 초기화 신호 안에 있어 [초기화]가 함께 듣습니다.
- 폼 요소 id: 기간 칩·날짜 트리거·달력의 월/연도 셀렉트·날짜 칸에 id 를 부여했습니다. HTML 검사기의 "A form field element should have an id or name attribute" 가 이 요소들을 가리켰습니다(값을 제출하지 않으므로 name 없이 id 만 둡니다). 달력의 날짜 칸은 셸의 `CalendarDayButton` 을 그대로 감싸 id 만 얹어 스타일·포커스 이동은 그대로입니다.
- 여백: `layout="stack"` 카드의 위아래 여백을 24 → 32 로 맞췄습니다(시안 224).
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3b61037f96ec826aa8bbfe5ef8418e06de96f8f7)

### [접근성 보완] 요약 목록 — 좁은 화면에서 라벨이 글자 단위로 쪼개지던 문제

- 대상: src/components/composite/summary-list.tsx
- 적용: 공통 컴포넌트 한 파일만 Diff로 반영합니다. 본인 확인·보증이력 등 요약 목록을 쓰는 모달에 함께 걸립니다.
- 변경: 값이 길면 라벨이 먼저 눌려 "이 / 메 / 일" 처럼 한 글자씩 접히던 것을 막았습니다. 라벨은 줄어들지 않게 두고 띄어 쓴 말에서만 접히도록(`break-keep`), 값은 남는 폭 안에서 접히도록(`break-words`) 했습니다.
- 유지: 라벨·값의 색과 타이포, 카드 면·여백·행 간격은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2f89cf5107f0dafce0ec4fb685697f35562bf784)

## [신규 추가]

### 본인 확인 모달

- 대상:
    - src/components/composite/identity-verification-dialog.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/profile/identity-verification/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/profile-edit/identity-verification/page.tsx
- 적용: 신규 파일 추가
- 내용: 마이페이지 내 정보에 들어가기 전 비밀번호로 한 번 더 확인하는 모달입니다. 가입 정보(기업명·아이디)는 요약 목록으로 두고 입력은 비밀번호 한 칸입니다. 빈 값이면 "비밀번호를 입력해 주세요." 가 칸 밑에 뜨고 그 칸으로 포커스가 갑니다.
- 연동 지점: `onSubmit(password)` 에 인증 API 를 붙이면 됩니다. 서버가 주는 실패 문구도 같은 자리에 띄울 수 있습니다.

### 기관 내 정보 — 비협약 은행·비협약 기관 화면

- 대상:
    - src/app/(user-type)/org/(service)/(member-non-partner-bank)/layout.tsx
    - src/app/(user-type)/org/(service)/(member-non-partner-bank)/mypage/profile-edit/non-partner-bank/page.tsx
    - src/app/(user-type)/org/(service)/(member-non-partner-agency)/layout.tsx
    - src/app/(user-type)/org/(service)/(member-non-partner-agency)/mypage/profile-edit/non-partner-agency/page.tsx
- 적용: 신규 파일 추가
- 내용: 기관 회원 유형이 협약·비협약으로 갈리는 케이스를 화면으로 나눴습니다. 기존 협약은행·협약기관 화면과 같은 폼을 쓰고 값과 기관구분만 다릅니다.

### 기관 평가결과 조회

- 대상:
    - src/components/custom/org-evaluation-history-list.tsx
    - src/content/service/org-evaluation-history.ts
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/evaluation-history/page.tsx
- 적용: 신규 파일 추가
- 화면 구성: 모형 탭 → 평가 방식 2depth(개별평가·일괄평가·대량정보조회, Tech-Index 계열에서만 노출) → 조회 필터 → 총 건수 → 결과 카드 → 페이지 이동.
- 카드 두 종류: 개별평가는 등급/점 배지와 기업 정보(평가일·기업명·사업자번호·조회 기관)를, 일괄평가·대량정보조회는 진행 상태 배지와 신청 정보(신청일·처리일·사업/과제명·조회 기관)와 "N 개 기업" 을 보여 줍니다.
- 버튼: 개별평가는 결과 열기(KTRS-FM·투자모형은 [보증추천]까지), 신청 건은 상태가 정합니다 — 반려 [접수취소][재등록] · 승인대기중 [접수취소][엑셀결과][HTML 압축파일] · 승인완료 [접수취소][엑셀결과][HTML 압축파일]. [접수취소]가 열려 있는지는 상태와 별개로 건이 정합니다(`canCancel`).
- 목업: 시안 케이스 시트의 카드 17장을 그대로 담았습니다. 값(기업명·사업자번호·조회 기관·신청일·처리일·사업/과제명·기업 수)도 시트에 적힌 그대로입니다.
- 연동 지점: `src/content/service/org-evaluation-history.ts` 의 `getOrgEvaluationHistory()` 안을 조회 API 로 바꾸면 화면·목록은 손댈 것이 없습니다.

### 보증추천·보증이력·검색 모달

- 대상:
    - src/components/composite/guarantee-recommendation-dialog.tsx
    - src/components/composite/guarantee-history-dialog.tsx
    - src/components/composite/guarantee-search-dialogs.tsx
    - src/components/composite/search-select-dialog.tsx
    - src/content/service/tech-evaluation-centers.ts
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/evaluation-history/guarantee-recommendation/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/evaluation-history/guarantee-recommendation/complete/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/evaluation-history/guarantee-recommendation/center-search/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/evaluation-history/guarantee-recommendation/bank-search/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/evaluation-history/guarantee-recommendation/bank-branch-search/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/evaluation-history/guarantee-history/page.tsx
- 적용: 신규 파일 추가
- 보증추천: 네 구획(기업정보·기업 담당자·보증추천 정보·은행담당자)을 한 폼에 담은 모달입니다. 카드보다 내용이 길어 본문만 스크롤됩니다. 검사·메시지 표시·걸린 칸으로 이동은 다른 폼 화면과 같은 공통 관문(`useFormTabsSubmit`)이 맡습니다. [보증 추천]을 누르면 검사를 통과했을 때만 닫히고 완료 알림이 이어집니다.
- 검색 모달 셋: [지점 검색]·[은행 검색]·[영업점 검색]이 고르는 방식이 같아 공통 `SearchSelectDialog` 로 만들고 목록과 문구만 바꿔 씁니다. 묶음을 고르거나 검색어를 치면 그 자리에서 걸러지고, 고른 값은 목록 아래에 남습니다. 기술평가센터 목록은 기존 시안(1-fo)의 8개 지역본부·66개 센터를 그대로 옮겼습니다.
- 보증이력: 고칠 수 없는 값만 보여 주는 조회 모달입니다. 상단에 기업명과 [보증완료] 배지, 아래로 담당자·보증추천 정보(대출희망 금액 3칸)·은행담당자를 요약 목록으로 둡니다.
- 버튼 이름: 보증추천 입력을 마치면 그 건의 [보증추천] 이 [보증이력] 으로 바뀌고 여는 모달도 함께 바뀝니다.
- 연동 지점: 보증추천 신청·임시저장 API, 검색 모달의 목록(`src/content/service/tech-evaluation-centers.ts`), 보증이력 값(`values`) 세 곳입니다.

### 텍스트 탭 (TextTabs)

- 대상: src/components/composite/text-tabs.tsx
- 적용: 신규 파일 추가
- 내용: 면·밑줄 없이 글자만으로 고르는 탭입니다. 좌우 화살표 이동과 `aria-selected`·`aria-controls` 를 갖췄고 평가결과 조회의 모형 탭이 씁니다.

## [덮어쓰기]

### 퍼블리싱 인덱스 — UIUX 뱃지에 상태 변경일 표시

- 대상:
    - src/content/publishing-guide/types.ts
    - src/content/publishing-guide/index.ts
    - src/components/custom/publishing-index.tsx
    - src/content/publishing-guide/publishing-index.json
- 적용: 네 파일을 함께 덮어씁니다.
- 표시: 화면에 `statusDate` 가 있으면 UIUX 뱃지를 `보완(09/08)` 처럼 상태 뒤에 날짜를 붙여 그립니다. 없으면 이전과 같이 상태만 나옵니다.
- 데이터: 상태값 자체는 `보완` 그대로이고 날짜는 `statusDate` 라는 별도 값입니다. `"09/08"` 형태(MM/DD)가 아니면 빌드가 멈춥니다.
- 진척률: 완료 수를 세는 기준(`완료`·`최종완료`·`보완`)이 그대로라 수치가 바뀌지 않습니다. 전체 309/403 으로 변경 전과 같습니다.
- 상태 변경: 오늘 화면이 바뀐 8개를 완료에서 보완으로 옮기고 `09/08` 을 붙였습니다(기관 고객정보활용동의 4개 · Tech-Index 기업·기술정보 입력 4개). 기존 보완 24개에는 `09/07` 을 붙였습니다.
- 유지: 상태 범례의 `보완` 은 상태 종류를 설명하는 자리라 날짜 없이 둡니다. 응용2 상태·버전·링크는 손대지 않았습니다.
- 상태 변경 커밋: [뱃지 날짜 표시와 8개 화면 상태 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/5ee874912bcb82c5dee8430d9ed6c94f0d971613)

### 퍼블리싱 인덱스 — 화면 추가·상태 변경과 강조색 정리

- 대상:
    - src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/components/custom/publishing-index.tsx
- 적용: 세 파일을 함께 덮어씁니다.
- 추가한 행 8개: 기업·기관 본인확인, 기관 비협약 은행·비협약 기관, 기술평가센터 검색·은행 검색·영업점 검색, 보증이력. 보증이력은 보증추천과 같은 뎁스(형제)에 둡니다.
- 상태 변경(UIUX): 이번에 화면이 바뀐 7개를 보완(09/08)로 두고, 새로 만든 화면(기관 평가결과 조회·보증추천·보증추천완료·기술평가센터 검색·보증이력 등)을 완료로 올렸습니다. 은행 검색·영업점 검색은 대기중으로 둡니다.
- 강조색: 최신 IA 미기재 행의 민트를 두 단계 옅게(mint.200 → mint.50) 바꿔 그 위의 상태 뱃지가 묻히지 않게 했습니다. 배포 강조(이번 릴리스에서 변경된 행)가 민트보다 앞서도록 우선순위도 바꿨습니다.
- 유지: 응용2 상태값은 한 건도 바꾸지 않았습니다(변경 0건). 진척률 계산 기준과 버전·링크도 그대로입니다.

### 컴포넌트 가이드 — 누락 컴포넌트 8종 추가와 버튼 비활성 큐레이션

- 대상:
    - src/app/component-guide/(guide)/form-fields
    - src/app/component-guide/(guide)/date-field
    - src/app/component-guide/(guide)/empty-state
    - src/app/component-guide/(guide)/text-tabs
    - src/app/component-guide/(guide)/mypage-shell
    - src/app/component-guide/(guide)/theme-toggle
    - src/app/component-guide/(guide)/check-toast
    - src/app/component-guide/(guide)/list-patterns
    - src/app/component-guide/(guide)/button/page.tsx
    - src/constants/publishing-guide.ts
- 적용: 새 가이드 페이지 8개와 버튼 가이드·내비 설정을 덮어씁니다.
- 새 페이지: [Field / FieldGrid](/component-guide/form-fields) · [DateField](/component-guide/date-field) · [EmptyState](/component-guide/empty-state) · [TextTabs](/component-guide/text-tabs) · [MypageSidebar / FormCard](/component-guide/mypage-shell) · [ThemeToggle](/component-guide/theme-toggle) · [CheckToast](/component-guide/check-toast) · [목록 패턴 (List)](/component-guide/list-patterns).
- 버튼 가이드: [버튼 (Button)](/component-guide/button) 에 "비활성(disabled) 스타일" 표를 더했습니다. variant 마다 잠긴 모습이 달라(면을 채우는 primary·secondary / 면을 그대로 두는 tertiary·text) 기본·비활성 미리보기와 면·테두리·글자 토큰을 나란히 둡니다.
- 선정 기준: 화면·도메인 전용 폼과 안내 모달은 넣지 않았습니다. 여러 화면이 공유하는 컴포넌트와 반복되는 목록 패턴만 문서로 남겼습니다.
