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
