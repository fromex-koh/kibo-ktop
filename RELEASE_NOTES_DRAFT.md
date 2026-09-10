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

### [스타일] 문의 상세·자주 묻는 질문 — Q.·A. 표시를 시안 그림으로

- 대상: src/components/custom/inquiry-detail.tsx
    - src/components/custom/faq-list.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/inquiry-history/inquiry-detail/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/inquiry-history/inquiry-detail/page.tsx
- 이전: 문의 상세의 Q. 는 글꼴로 찍은 글자였고, 답변 자리에는 A. 표시가 아예 없었습니다. 자주 묻는 질문도 답변에 A. 가 없었습니다.
- 지금: 시안이 그린 24×24 그림(icon-etc/question · icon-etc/reply)을 그대로 씁니다. 그림 24 · 그림과 글 사이 8 · 답변 글이 질문 글과 같은 세로선에서 시작합니다.
- 답변대기: 시안대로 답변이 아직 없을 때도 A. 표시를 두고 그 옆에 대기 안내를 놓습니다(예전에는 표시 없이 글만 있었습니다).
- 확인 방법: 아래 화면에서 Q. 그림이 글꼴 글자가 아닌지, 답변 앞에 A. 그림이 오는지 봅니다(자주 묻는 질문은 질문을 펼쳐서).
- 영향 화면: [기업 문의 상세](/corp/mypage/inquiry-history/inquiry-detail) `보완(09/07)·(09/11)` · [기관 문의 상세](/org/mypage/inquiry-history/inquiry-detail) `보완(09/11)` · [기업 자주 묻는 질문](/corp/notice/faq) `보완(09/11)` · [기관 자주 묻는 질문](/org/notice/faq) `보완(09/11)`
- 유지: 문의 상세의 `answer` prop 은 그대로입니다 — 넘기면 답변 본문이, 넘기지 않으면 대기 안내가 같은 자리에 들어갑니다.
- 화면 두 개(page.tsx)는 주석만 바뀌었습니다 — [프론트엔드 연동] 설명을 지금 동작에 맞췄습니다. 코드는 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e570e9e9)

## [신규 추가]

### QaMark — 문답 표시 공통 조각과 그림 파일

- 대상: src/components/custom/qa-mark.tsx
    - public/images/faq/faq-answer-mark.webp
    - public/images/faq/faq-question-mark-dark.webp
    - public/images/faq/faq-answer-mark-dark.webp
- 적용: 조각과 그림 파일 모두 신규 추가입니다(`faq-question-mark.webp` 는 기존 파일 그대로).
- 내용: 문의 상세와 자주 묻는 질문이 같은 Q.·A. 그림을 쓰고 라이트·다크 짝도 같아 한곳에 모았습니다. `<QaMark type="question" />` · `<QaMark type="answer" />` 로 씁니다.
- 다크모드: 색이 아니라 그림 파일 자체가 갈려 토큰으로 표현할 수 없습니다. 라이트·다크 짝을 함께 두고 보이는 쪽만 남깁니다 — 숨은 쪽은 `display:none` 이라 칸을 차지하지 않아 옆 글과의 간격이 벌어지지 않습니다.
- 접근성: 그림은 장식이라 `alt` 를 비우고, 무엇을 가리키는 묶음인지는 사용처의 `sr-only` 문구가 알립니다[5.1.1].
- 크기: 원본 72×72 · 화면 표시 24×24. 새 그림을 더할 때도 라이트·다크 두 장을 짝으로 넣습니다.

## [덮어쓰기]

### 퍼블리싱 인덱스 — 이번 회차 화면 상태 반영

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다. 두 파일은 함께 교체해야 합니다 — 콘텐츠 관문이 빌드 시점에 두 파일의 화면 key 를 교차검증합니다.
- 경로 레지스트리: 평가검증 신청 조회의 page 파일이 생겨 `implemented` 가 켜집니다(생성물이라 `yarn verify` 가 다시 만듭니다).
- 상태: 이번에 손댄 5개 화면을 `보완(09/11)` 로 두었습니다 — [기업 문의 상세](/corp/mypage/inquiry-history/inquiry-detail) · [기관 문의 상세](/org/mypage/inquiry-history/inquiry-detail) · [기업 자주 묻는 질문](/corp/notice/faq) · [기관 자주 묻는 질문](/org/notice/faq) · [기관 평가결과 조회](/org/mypage/evaluation-history).
- 신규 화면: [기관 평가검증 신청 조회](/org/mypage/verification-application) 는 이번에 처음 만든 화면이라 `대기중` 에서 `완료` 로 올렸습니다 — 고친 것이 아니라 새로 생긴 화면이라 `보완` 을 붙이지 않습니다.
- 기존 뱃지 유지: 기업 문의 상세는 09/07 회차에도 손을 타 날짜를 배열로 두어 `보완(09/07)`·`보완(09/11)` 두 뱃지를 함께 남깁니다.

## [Diff 확인]

### [동작] 목록 페이지 이동 — 화면 맨 위가 아니라 목록 맨 위로

- 대상: src/components/custom/org-evaluation-history-list.tsx
- 이전: 페이지를 넘기면 화면 맨 위까지 올라가, 조회 조건을 다시 지나쳐야 방금 넘긴 목록을 찾을 수 있었습니다.
- 지금: 목록 머리(`총 N건`)가 붙어 있는 상단 바 바로 아래에 오도록 굴립니다. 자리는 `scroll-mt-20 xl:scroll-mt-32`(80·128)가 비웁니다 — 바 높이가 좁은 화면 56, xl 에서 상단 메뉴 줄까지 112 라 각각 여유를 더한 값입니다.
- 확인 방법: 목록 아래까지 내린 뒤 페이지를 넘겨 봅니다 — 목록 머리가 상단 바에 가리지 않고 화면 위쪽에 섭니다.
- 영향 화면: [기관 평가결과 조회](/org/mypage/evaluation-history) `보완(09/11)`
    - 같은 동작이 [기관 평가검증 신청 조회](/org/mypage/verification-application) `완료` 에도 들어 있습니다 — 그 화면은 이번에 새로 만든 것이라 [신규 추가] 카드가 담당합니다.
- 유지: 페이지 나누기·조회 조건·카드 내용은 그대로입니다. `prefers-reduced-motion` 이면 애니메이션 없이 바로 이동합니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5b68ad0b)

### [마크업] 평가결과 조회 — 결과 링크에 건 번호를 붙여 같은 주소 링크 제거

- 대상: src/content/service/org-evaluation-history.ts
- 원인: 리포트 화면은 모형마다 경로가 하나뿐이라 같은 모형 카드 두 장의 [개별평가 일반/심층 결과] 주소가 똑같았습니다. 이웃한 링크가 같은 곳을 가리켜 스크린리더가 같은 링크를 되풀이해 읽고 WAVE 도 `Redundant link` 로 잡습니다.
- 지금: `?id=<건 번호>` 를 붙여 건마다 구분합니다. 공지 목록에서 쓴 방식과 같습니다.
- 확인 방법: KTRS-FM 카드 두 장에서 결과 버튼 주소가 서로 다른지 봅니다.
- 영향 화면: [기관 평가결과 조회](/org/mypage/evaluation-history) `보완(09/11)`
- 유지: 버튼 이름·여는 방식(새 창)·리포트 화면은 그대로입니다. 연동하면 조회 결과의 건 번호가 그 자리에 들어갑니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0841fc7f)

## [신규 추가]

### 평가검증 신청 조회 화면

- 대상: src/app/(user-type)/org/(service)/(logged-in)/mypage/verification-application/page.tsx
    - src/components/custom/org-verification-application-list.tsx
    - src/components/custom/verification-application-card.tsx
    - src/constants/verification-application.ts
    - src/content/service/org-verification-applications.ts
- 적용: 화면·목록·카드·타입·데이터 모두 신규 추가입니다.
- 화면 구성: 조회 필터(기간 칩 · 날짜 · 기업명) → `총 N건` → 신청 카드 → 페이지 이동. 카드는 모형명·자가진단 등급 / 접수일·기업명·사업자번호와 [평가검증 하기] / 결과 버튼 / 검증 이력 펼침으로 이루어집니다.
- 펼침: 이력이 있는 카드만 펼침 줄이 서고, 펼치면 카드 폭을 가득 채우는 옅은 면에 팀명·검증일·등급·버튼이 들어갑니다. 펼칠 때 그 목록이 화면에 들어오도록 필요한 만큼만 굴립니다.
- 연동 지점: 화면은 `getOrgVerificationApplications()` 하나만 부릅니다. 목업을 지우고 조회 API 응답을 `VerificationApplicationItem` 모양으로 돌려주면 화면·목록은 고치지 않아도 됩니다. 빈 배열이면 `검색내역이 없습니다.` 안내가 나옵니다.
- 아직 비어 있는 것: [평가검증 하기]·[평가검증 결과]가 갈 검증 화면이 없어 주소를 `#` 로 두었습니다. 화면이 생기면 데이터의 `verifyHref` 만 채우면 됩니다.
- 확인 방법: [기관 평가검증 신청 조회](/org/mypage/verification-application)

### 평가 카드 공통 조각 (EvaluationCard)

- 대상: src/components/custom/evaluation-card.tsx
- 적용: 신규 파일 추가. 평가결과 조회 목록은 이 조각들을 import 하도록만 바뀝니다(화면은 그대로).
- 내용: 값 배지(CountBadge) · 상세 줄(EvaluationDetail·EvaluationDetailList) · 동작 버튼(CardActions)입니다. 평가결과 조회와 평가검증 신청 조회가 같은 카드 언어를 써서 한곳에 모았습니다.
- 옮기면서 고친 것: 상세 칸(160)의 긴 값은 그 칸 안에서 줄바꿈되도록 되어 있었지만 한글만 그렇게 접혔습니다. 영문 상호나 긴 번호는 낱말 하나라 칸을 넘어 옆 칸을 덮었습니다(160 칸에 실제 534px). 접을 곳이 없을 때만 낱말 안에서 끊게 했습니다(`break-words`) — 한글·띄어쓴 값의 모습은 그대로입니다.
- 영향 화면: [기관 평가결과 조회](/org/mypage/evaluation-history) `보완(09/11)` · [기관 평가검증 신청 조회](/org/mypage/verification-application) `완료` — 두 화면이 이 조각을 함께 씁니다. 긴 값은 평가검증 신청 조회 2페이지에서 볼 수 있습니다.
- 평가결과 조회 쪽 변화: 그 목록 파일은 이 조각들을 import 하도록만 바뀝니다 — 화면에 보이는 것은 위 줄바꿈뿐입니다.
- 문서: [평가 카드 (EvaluationCard)](/component-guide/evaluation-card)

## [덮어쓰기]

### 컴포넌트 가이드 — 평가 카드 문서 추가

- 대상: src/app/component-guide/(guide)/evaluation-card/page.tsx
    - src/constants/publishing-guide.ts
- 적용: 문서 화면이라 지정한 파일만 교체합니다.
- 내용: 조립된 카드 · 값 배지 · 상세 줄(긴 값 예시 포함) · 동작 버튼 · 결과 링크 주소 규칙 · Props 표입니다. 사이드바 `데이터 표시` 에 `EvaluationCard` 를 넣었습니다.

### 조회 필터 — 기업명 칸의 라벨 감추기 옵션

- 대상: src/components/composite/search-filter-form.tsx
- 적용: 지정한 파일만 교체합니다.
- 변경: `CompanyNameField` 에 `labelHidden` 을 더했습니다 — 시안에 라벨이 보이지 않는 필터에 씁니다(검색어 칸에는 이미 있던 옵션입니다).
- 유지: 넘기지 않으면 이전과 똑같이 라벨이 보입니다.

### 마이페이지 사이드바 — 평가검증 신청 조회 링크 연결

- 대상: src/components/composite/mypage-sidebar.tsx
- 적용: 지정한 파일만 교체합니다.
- 변경: 기관 메뉴의 `평가검증 신청 조회` 가 `#` 였던 것을 새 화면 주소로 연결했습니다.

## [Diff 확인]

### [마크업] 조회 필터 — 상태 셀렉트에 라벨 감추기·칸 높이 옵션

- 대상: src/components/composite/search-filter-form.tsx
- 변경: `SelectFilterField` 에 `labelHidden`(라벨을 화면에서만 감춤)과 `size`(칸 높이 40/48)를 더하고 이 조각을 export 했습니다. 시안에 라벨이 보이지 않고 칸이 48인 필터에 씁니다.
- 유지: 두 값을 넘기지 않으면 이전과 똑같습니다 — 이 조각을 쓰던 기존 화면은 변화가 없습니다.
- 영향 화면: [기관 하위계정 현황](/org/mypage/sub-account-progress) `완료` — 이번 회차에 새로 만든 화면이 첫 사용처입니다.

### [마크업] 조회 버튼 필드 — 그 자리에서 확인하는 버튼과 형식 검사

- 대상: src/components/composite/form-fields.tsx
- 변경: `LookupField` 에 네 가지를 더했습니다.
    - `onAction` — 모달을 열지 않고 그 자리에서 확인하는 버튼(중복확인 등)의 동작
    - `actionPending`·`actionPendingLabel` — 서버에 물어보는 동안 버튼이 도는 표시로 바뀌고 다시 눌리지 않습니다(`aria-busy`)
    - `pattern`·`patternMessage` — 형식이 어긋나면 칸 밑에 그 문구가 뜹니다. 브라우저 기본 문구는 무엇을 고쳐야 하는지 알려 주지 않습니다[7.4.2]
- 유지: 넘기지 않으면 이전과 똑같습니다 — 업종코드 조회처럼 모달을 여는 기존 사용처는 변화가 없습니다.
- 영향 화면: [기관 하위 계정 등록](/org/mypage/sub-account-progress/create) `완료`

## [신규 추가]

### 기관 하위계정 현황 화면 — 회원 유형 4케이스

- 대상: src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/tech-partner/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/k-bigx-non-partner/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/k-bigx-partner/page.tsx
    - src/components/custom/org-sub-account-progress-screen.tsx
    - src/components/custom/org-sub-account-list.tsx
    - src/components/custom/sub-account-card.tsx
    - src/components/custom/sub-account-summary.tsx
    - src/constants/sub-account.ts
    - src/content/service/org-sub-accounts.ts
- 적용: 화면 4개·셸·목록·카드·협약 정보·타입·데이터 모두 신규 추가입니다.
- 화면 구성: 협약 정보(매칭 사업·사업기간·이용서비스 + 계정 수 3칸) → 조회 필터(상태 · 검색 대상 · 검색어) → `총 N건`·정렬·[하위계정 등록] → 계정 카드 → 페이지 이동.
- 4케이스: 협약 여부와 기술평가부 여부에 따라 협약 정보의 [이용서비스]가 달라집니다. 화면 구성은 넷이 같고, 무엇이 다른지는 `SUB_ACCOUNT_AGREEMENT_CASES` 한 곳이 정합니다.
    - [K-BIGx] 비협약 은행/기관 — `K-BIGx`
    - [K-BIGx] 협약 은행/기관 — `K-BIGx`
    - [기술평가부] 비협약 은행/기관 — `KTRS-FM, Tech-Index, 창업용 Tech-Index, 투자모형`
    - [기술평가부] 협약 은행/기관 — `KTRS-FM, 투자모형`
- 비협약: 맺은 사업이 없어 매칭 사업·사업기간 줄이 통째로 빠지고 이용서비스만 남습니다. `-` 를 채우지 않는 이유는 없는 항목이지 아직 안 정해진 값이 아니기 때문입니다.
- 정렬: [보고서 출력순 정렬]은 누를 때마다 기본 ⇅ → 적은 순 ↑ → 많은 순 ↓ 로 돕니다. 지금 어느 순서인지는 화살표로 보이고 읽어 주기에는 버튼 이름에 붙습니다[6.4.3].
- 빈 상태: `하위계정 내역이 없습니다.` — 조회 결과가 없을 때만이 아니라 아직 등록하지 않았을 때·마지막 계정을 지웠을 때도 같은 자리가 비어서, 세 경우에 모두 맞는 말로 두었습니다.
- 연동 지점: 화면은 `getOrgSubAccountOverview()` 하나만 부릅니다. 목업을 지우고 조회 API 응답을 그대로 돌려주면 화면·목록은 고치지 않아도 됩니다. 케이스도 그때는 로그인한 기관의 속성이라 서버가 정합니다(지금의 `caseKey` 인자는 목업을 보기 위한 것입니다).
- 아직 비어 있는 것: [⋮] > [수정]이 갈 화면이 없어 주소를 `#` 로 두었습니다.
- 목업 참고: 마지막 카드 한 장은 시안에 없습니다 — 계정 ID·담당자 이름이 칸을 넘는 경우를 화면에서 바로 보려고 둔 것이라 실제 데이터로 바꿀 때 지웁니다.
- 확인 방법: [기술평가부 · 비협약 은행/기관](/org/mypage/sub-account-progress) `완료` · [기술평가부 · 협약 은행/기관](/org/mypage/sub-account-progress/tech-partner) `완료` · [K-BIGx · 비협약 은행/기관](/org/mypage/sub-account-progress/k-bigx-non-partner) `완료` · [K-BIGx · 협약 은행/기관](/org/mypage/sub-account-progress/k-bigx-partner) `완료`

### 하위 계정 상세정보 모달

- 대상: src/components/composite/sub-account-detail-dialog.tsx
    - src/components/composite/sub-account-status-badge.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/detail/page.tsx
- 적용: 모달·상태 배지·단독 확인 화면 신규 추가입니다.
- 내용: 계정 요약(옅은 파랑 카드) → 서비스별 배분 이용건수(2열) → 내역 갈래(접속 일시 / 활동) 순입니다. 이용건수는 그 기관의 이용서비스에서 나오므로, K-BIGx 만 쓰는 기관은 칸도 하나만 섭니다.
- 빈 상태: 기록이 없는 계정도 있어 갈래별로 `접속 일시 내역이 없습니다.` · `활동 내역이 없습니다.` 가 같은 자리를 대신합니다.
- 상태 배지: 목록 카드와 모달이 `SubAccountStatusBadge` 하나를 함께 씁니다 — 색은 한 곳에서만 정해지고(사용 하늘색 · 사용정지 회색), 놓이는 자리에 따라 채운 면(목록)과 테두리(모달) 두 모습이 있습니다. 모달이 테두리인 이유는 옅은 파랑 카드 위에서 면을 채우면 카드와 뭉개지기 때문입니다.
- 확인 방법: [기관 하위계정 상세](/org/mypage/sub-account-progress/detail) `완료`

### 하위 계정 등록 모달 — 유효성 검사와 중복확인

- 대상: src/components/composite/sub-account-create-dialog.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/create/page.tsx
- 적용: 모달·단독 확인 화면 신규 추가입니다.
- 입력 칸: 계정 ID(+[중복확인]) · 비밀번호 · 담당자 이름 · 구분/소속 · 상태 · 메모 순입니다.
- 검사: 다른 폼 화면과 같은 공통 관문(`useFormTabsSubmit`)이 맡아 오류 문구의 말투가 화면마다 달라지지 않습니다. 기준은 화면에 적어 둔 `required`·`pattern` 입니다.
    - 계정 ID `영문으로 시작하는 4~20자, 숫자·_ 허용` — 칸을 벗어날 때와 제출할 때 모두 봅니다
    - 비밀번호 `비밀번호를 8자 이상 입력해 주세요.`
    - 중복확인 전에는 제출을 세웁니다(`계정 ID 중복확인을 해 주세요.`). 단, 계정 ID 자체가 비었거나 형식이 어긋났으면 그 문구가 먼저입니다
- 중복확인: 누르면 버튼이 `확인 중`(도는 표시·`aria-busy`)으로 바뀌고, 끝나면 칸 밑에 `사용할 수 있는 계정 ID 입니다.` 가 붙습니다. ID 를 고치면 다시 확인해야 합니다.
- 연동 지점: 등록 API 와 계정 ID 중복 확인 API 두 곳입니다(`// [프론트엔드 연동]` 주석 자리). 지금은 목업이 0.8초 뒤 통과한 것처럼 답합니다.
- 시안과 다르게 둔 것: 메모 라벨에 필수 표시(`*`)가 남아 있지만 안내 글이 `메모 입력 (선택)` 이라 선택 입력으로 두었습니다 — 컴포넌트 기본값이 지워지지 않은 것으로 봤습니다. 실제 정책이 필수면 `required` 만 켜면 됩니다.
- 확인 방법: [기관 하위 계정 등록](/org/mypage/sub-account-progress/create) `완료`

### 확인 모달 공통 조각과 하위계정 확인 모달 3종

- 대상: src/components/composite/confirm-dialog.tsx
    - src/components/composite/delete-confirm-dialog.tsx
    - src/components/composite/sub-account-delete-dialog.tsx
    - src/components/composite/sub-account-password-reset-dialog.tsx
    - src/components/composite/sub-account-status-change-dialog.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/delete/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/password-reset/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/status-change/page.tsx
- 적용: 공통 조각·모달 3종·단독 확인 화면 3개 신규 추가입니다.
- 공통 조각(`ConfirmDialog`): 되묻고 실행하는 자리를 하나로 모았습니다. 생김새는 이미 있던 확인 모달([기업 수정 취소](/corp/mypage/profile/cancel-confirm))을 그대로 따릅니다 — 닫기(X) 없음 · 가운데 정렬 · 굵은 첫 줄(20) + 옅은 물음(16) + 같은 크기의 덧붙임(16) · [취소](tertiary)/[확인] 두 칸.
- 문구: 물음에는 지울·바꿀 대상을 굵게 드러냅니다 — 목록에서 여러 건을 다룰 때 엉뚱한 것을 고르지 않기 위해서입니다.
    - 계정 삭제 — `계정 sub_002(이영희)을(를) 삭제하시겠습니까?` / `삭제된 계정은 복구할 수 없습니다.`
    - 비밀번호 초기화 — `…의 비밀번호를 초기화하시겠습니까?` / `초기화 후 임시 비밀번호가 등록된 이메일(…)로 발송됩니다.`
    - 상태 변경 — `…의 상태를 사용정지로 변경하시겠습니까?` (조사는 상태 이름의 받침에 맞춰 `사용으로`·`사용정지로` 로 붙습니다)
- 목록에서의 동작: [확인]이 실제로 일합니다 — 삭제는 카드가 사라지고, 상태 변경은 배지와 [⋮] 메뉴 이름이 함께 뒤집힙니다.
- 확인 방법: [기관 하위계정 삭제 확인](/org/mypage/sub-account-progress/delete) `완료` · [기관 하위계정 비밀번호 초기화](/org/mypage/sub-account-progress/password-reset) `완료` · [기관 하위계정 상태 변경](/org/mypage/sub-account-progress/status-change) `완료`

### 하위계정 완료 토스트 3종

- 대상: src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/create/complete-toast/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/password-reset/complete-toast/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/sub-account-progress/status-change/complete-toast/page.tsx
- 적용: 단독 확인 화면 3개 신규 추가입니다. 문구는 `src/constants/sub-account.ts` 가 들고 있습니다.
- 내용: 이미 있던 공통 완료 토스트([확인 토스트](/component-guide/check-toast))를 그대로 씁니다 — 새로 만든 것은 문구뿐이라 생김새·위치·노출 시간이 자동저장 토스트와 같습니다.
    - `하위계정이 등록되었습니다.`
    - `비밀번호가 초기화되었습니다.`
    - `계정 상태가 사용정지로 변경되었습니다.` — 바뀐 뒤의 상태가 문구에 들어갑니다
- 실제 흐름: 목록 화면에서도 뜹니다 — 등록 모달의 [저장하기], 초기화·상태 변경 확인 모달의 [확인]이 각각 띄웁니다.
- 삭제에는 토스트가 없습니다 — 지운 카드가 목록에서 사라지는 것이 그 자체로 결과를 알리고, 화면정의서에도 없습니다.
- 확인 방법: [하위계정 등록 완료 토스트](/org/mypage/sub-account-progress/create/complete-toast) `완료` · [비밀번호 초기화 완료 토스트](/org/mypage/sub-account-progress/password-reset/complete-toast) `완료` · [상태 변경 완료 토스트](/org/mypage/sub-account-progress/status-change/complete-toast) `완료`

### 드롭다운 메뉴 (DropdownMenu)

- 대상: src/components/ui/dropdown-menu.tsx
    - src/components/theme/dropdown-menu.variants.ts
    - vendor/shadcn-baseline/dropdown-menu.variants.ts
- 적용: shadcn 셸을 새로 받고 프로젝트 스타일을 theme 으로 분리했습니다. 밀려난 바닐라 스타일은 vendor 기준선에 보관합니다([SC-02]/[SC-04]).
- 스타일: 시안의 [⋮] 패널에 맞춰 면·테두리·반경·그림자와 항목 높이(48)·글자·hover 면을 두었습니다. 항목에 `cursor: pointer` 를 둡니다.
- 첫 사용처: 하위계정 카드의 [⋮] 관리 메뉴(수정 · 비밀번호 초기화 · 상태 변경 · 삭제)입니다.

## [덮어쓰기]

### 퍼블리싱 인덱스 — 하위계정 현황 회차 반영

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
- 적용: 지정한 파일만 교체합니다.
- 화면 나누기: `하위 계정 현황` 한 행을 회원 유형 4케이스로 나눴습니다(내 정보 수정과 같은 방식). 네 행의 `iaRow` 가 같아 화면정의서에서는 여전히 한 행으로 집계됩니다.
- 묶기: 그 아래 화면들을 동작별로 묶었습니다 — `등록` · `수정` · `비밀번호 초기화` · `사용정지` · `삭제`. 묶음 행은 뎁스로 세지 않으므로(`isGroupOnly`) 아래 화면의 뎁스 번호와 행 수·진척률은 그대로입니다. `하위계정 상세`는 [상세정보] 버튼이 여는 별도 동작이라 묶지 않고 목록 화면 바로 아래에 둡니다.
- 상태 변경: 이번에 만든 10개 화면을 `완료`로 올렸습니다(케이스 4 · 상세 · 등록 · 비밀번호 초기화 · 상태 변경 · 삭제 확인과 완료 토스트 3). 남은 `대기중`은 `하위계정 수정`과 그 짝인 `하위계정 저장 완료 토스트` 둘입니다.
- 유지: 응용2 상태값은 한 건도 바꾸지 않았습니다.

### 퍼블리싱 인덱스 화면 — 1뎁스 열 세로쓰기

- 대상: src/components/custom/publishing-index.tsx
- 적용: 지정한 파일만 교체합니다.
- 변경: 아래 뎁스가 있는 1뎁스 칸을 세로쓰기로 두어 열 폭이 98 → 53 이 되고, 그만큼이 아래 뎁스·화면명으로 넘어갑니다. 열 머리(`1뎁스`)와 뎁스 뱃지는 가로로 둡니다 — 읽는 자리와 기호는 눕히지 않습니다.
- 예외: 아래 뎁스가 없는 칸(`404 에러`처럼 1뎁스가 곧 화면인 행)은 나머지 뎁스 열을 통째로 쓰므로 돌리지 않습니다.
- 이 파일 하나로 끝납니다: `writing-mode` 는 Tailwind 에 유틸리티가 없지만, 이 표에서만 쓰는 값 두 개라 `globals.css` 나 화면 전용 CSS 를 만들지 않고 쓰는 자리에 그대로 얹었습니다. 서비스 화면의 CSS 에는 한 줄도 늘지 않습니다.

### 버전 업데이트 카드 — 항목명과 내용을 두 칸으로

- 대상: src/components/custom/publishing-index.tsx
- 적용: 지정한 파일만 교체합니다.
- 이전: 항목명이 내용 위에 얹혀 카드 하나가 두 배로 길었고, 한 줄짜리 항목에도 점이 찍혀 카드가 온통 점으로 덮였습니다.
- 지금: 항목명과 내용이 두 칸으로 서서 값의 시작점이 한 줄로 맞습니다. 항목명 칸은 그 카드에서 가장 긴 이름에 맞춰지고(`max-content`), 좁은 화면에서는 예전처럼 위아래로 쌓습니다. 점은 내용이 여러 줄일 때만 찍습니다.
- 대상 경로: 파일 경로라 고정폭 글꼴로 두고 한 단 작게 둡니다 — 글 사이에서 경로가 바로 구분됩니다.
- 유지: 카드 내용·순서·배지·링크는 그대로입니다.

### 접근성 검사 예외사항 — Radix Select 의 WAVE 예외 추가

- 대상: src/app/component-guide/(guide)/accessibility-exceptions/page.tsx
- 적용: 문서 화면이라 지정한 파일만 교체합니다.
- 내용: 조회 필터가 있는 목록 화면에서 나오는 `Missing form label`(오류)·`Select missing label`(경고)의 원인을 `WAVE` 탭 › 라이브러리 원인에 적었습니다. Radix 셀렉트가 폼 제출용으로 만드는 숨은 native `select` 가 원인이고, `aria-hidden`·`tabindex="-1"` 이라 스크린리더·키보드는 닿지 않습니다. 실제 컨트롤에는 이름이 있습니다.
- 조치: 고칠 자리가 없습니다 — 우리 코드에 그 `select` 가 없고 이름을 넣을 prop 도 없어, 고치려면 셸을 손대야 합니다([SC-02]).

### 마이페이지 사이드바 — 하위계정 현황 링크 연결

- 대상: src/components/composite/mypage-sidebar.tsx
- 적용: 지정한 파일만 교체합니다.
- 변경: 기관 메뉴의 `하위계정 현황` 이 `#` 였던 것을 새 화면 주소로 연결했습니다.
