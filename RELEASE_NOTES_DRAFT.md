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

### 인증 모달 — 제목 구조 접근성 보완

- 대상: src/components/custom/auth-flow-page.tsx
- 적용: 아래 네 모달의 제목·안내 문장 변경을 Diff로 반영합니다.
- 적용 범위:
    - 기관 최초 비밀번호 변경: `InitialPasswordChangeDialog`의 ‘내 정보 확인’ 제목과 안내 문장입니다.
    - 기업 실명인증: `RealNameVerificationDialog`의 ‘본인 인증’ 제목과 주민등록번호 입력 안내입니다.
    - 기업·기관 로그인 연장: `SessionExtensionDialog`의 ‘로그인 연장’ 제목과 남은 시간 안내입니다.
    - 기업·기관 로그인 안내: `LoginGuideDialog`의 ‘회원가입/로그인’ 제목과 로그인 안내 문장입니다.
- 공통 변경:
    - 제목을 `DialogTitle asChild` + H1으로 변경해 최상위 제목 누락을 보완했습니다. 로그인 안내 제목은 `sr-only`를 유지해 화면에 표시하지 않습니다.
    - 안내 문장을 `DialogDescription asChild` + 블록 span으로 변경해 Possible heading 경고의 원인을 수정했습니다.
- 유지: 문구·디자인·입력 항목·시간 표시·버튼 동작은 그대로입니다.
- 검증: 타입·린트 검증을 통과했습니다. WAVE의 H1 누락·Possible heading 재검사는 필요합니다.
- 커밋:
    - [기관 최초 비밀번호 변경](https://github.com/fromex-koh/kibo-ktop/commit/cc2320f713a3ee7d7402d148dbe75ffa1583e1b9)
    - [기업 실명인증](https://github.com/fromex-koh/kibo-ktop/commit/4031ed078db424e08af91334af2e6625612d35a1)
    - [기업·기관 로그인 연장](https://github.com/fromex-koh/kibo-ktop/commit/322bfe71dbb404a6f8de8836368c45e3e77aa7e6)
    - [기업·기관 로그인 안내](https://github.com/fromex-koh/kibo-ktop/commit/5cc9f83404a9d52be4efd3e68eef1484eb34a0be)

### 기업·기관 문의 작성·취소 — 접근성 보완

- 대상: src/components/custom/inquiry-form.tsx
- 적용: 아래 두 컴포넌트의 변경을 Diff로 반영합니다. 기업·기관 공통 폼에 적용됩니다.
- 문의 작성 (`InquiryForm`):
    - 숨김 파일 input `#inquiry-attachment`에 `aria-label="문의 첨부파일"`을 추가했습니다.
    - 문의 작성·개인정보 동의 안내 화면에서 발생한 파일 첨부의 Missing form label 오류를 해결했습니다.
- 문의 취소 (`InquiryCancelDialog`):
    - ‘작성 취소’를 `DialogTitle asChild` + H1으로 변경해 최상위 제목 누락을 보완했습니다.
    - ‘문의 작성을 취소하시겠습니까?’를 `DialogDescription asChild` + 블록 span으로 변경해 Possible heading 경고의 원인을 수정했습니다.
- 유지: 화면 문구·디자인·파일 첨부 및 폼 제출·취소 확인 및 이동 동작은 그대로입니다.
- 검증: 타입·린트 검증을 통과했습니다. 파일 첨부 레이블 반영을 확인했으며, 문의 취소의 WAVE H1 누락·Possible heading 재검사는 필요합니다.
- 커밋:
    - [문의 작성 — 파일 첨부 레이블 추가](https://github.com/fromex-koh/kibo-ktop/commit/c7ab0c06f2ae94a7271415eaaf7bc62946f747da)
    - [문의 취소 — 제목·안내 문장 보완](https://github.com/fromex-koh/kibo-ktop/commit/5cdd08cc547a3822b9578a6eab49ed3ac58dd406)

### 기업 문의 내역·상세 — 중복 링크 및 목록 복귀 개선

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/inquiry-history/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/inquiry-history/inquiry-detail/page.tsx
- 적용: 목록의 항목별 링크·복귀 대상 제목과 상세의 목록 복귀 주소를 함께 Diff로 반영합니다.
- 목록 링크: 예제 문의 13개의 상세 링크를 `?id=corp-inquiry-001`처럼 문의별로 구분했습니다. 첫 페이지의 동일 주소 링크 10개에서 발생하던 Redundant link 경고 원인을 제거했습니다.
- 상세 복귀:
    - ‘목록으로 돌아가기’는 `/corp/mypage/inquiry-history#inquiry-history-title`로 이동합니다. 사이드바의 ‘1:1 문의’는 기존 목록 주소를 유지합니다.
    - 목록 제목에 `id="inquiry-history-title"`·`tabIndex={-1}`를 추가해, 하단 복귀 링크로 이동하면 제목에 포커스가 도착하도록 했습니다.
- 연동 확인: 상세 본문은 기존 목업입니다. 실제 연동에서는 URL의 `id`로 문의를 조회하고, 목록 제목의 앵커 ID를 유지해야 합니다.
- 검증: 타입·린트 검증을 통과했습니다. 목록 링크 10개가 서로 다른 것을 확인했고, 상세는 WAVE와 동일한 규칙에서 중복 링크 0건 및 목록 제목 이동·포커스를 확인했습니다.
- 커밋: [문의 내역·상세 변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4e864d974b9f2f591c51b95d2bda6cb0c36d8361)

### 기업·기관 공지사항 — 분류·뱃지·상세 링크·반응형 개선

- 대상:
    - src/components/custom/notice-category.ts
    - src/components/custom/notice-list.tsx
    - src/components/custom/notice-detail.tsx
    - src/app/(user-type)/corp/(service)/(logged-out)/notice/announcements/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-out)/notice/announcements/detail/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/notice/announcements/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/notice/announcements/detail/page.tsx
- 적용: 공통 데이터 타입·목록·상세 컴포넌트와 기업·기관 사용처를 함께 Diff로 반영합니다.
- 데이터·연동:
    - `category`를 `system`·`etc`·`service`·`payment`·`evaluation`으로 변경했습니다. 기존 `important`·`general`·`business` 값은 새 분류에 맞게 매핑해야 합니다.
    - 중요공지·새 글 여부를 `isImportant`·`isNew`로 분리하고, 항목별 필수 `href`를 추가했습니다. `NoticeList`의 공통 `detailHref` prop은 제거했습니다.
    - 예제 링크에 글별 `?id=...`를 지정했습니다. 상세 본문은 아직 목업이므로 실제 연동에서는 해당 ID로 조회한 데이터를 연결해야 합니다.
- 목록 표시:
    - 분류는 텍스트로, 중요공지·새 글은 제목 옆 뱃지로 표시합니다. 새 글 표시는 스크린리더에 ‘새 글’로 전달합니다.
    - 모바일·태블릿·PC 모두 제목을 말줄임·줄 수 제한 없이 표시합니다. 중요공지·새 글 뱃지는 제목 뒤에서 함께 줄바꿈되어 잘리지 않습니다.
    - 모바일은 분류를 윗줄에 두고 세로 구분선을 숨깁니다. 태블릿·PC는 분류·구분선·제목을 가로로 배치하며, 화살표 간격도 화면 폭에 맞췄습니다.
    - 구분선을 감싼 `span`을 `div`로 변경해 목록 10개에서 반복된 잘못된 중첩 오류를 해결했습니다.
- 상세 표시·연동:
    - `NoticeDetail`에 선택 props `isImportant`·`isNew`를 추가했습니다. 상세 조회 결과를 전달하며, 생략하면 해당 뱃지는 표시하지 않습니다.
    - 분류를 무채색 뱃지에서 텍스트로 바꾸고, 분류·구분선·제목·중요공지·새 글 순서로 배치했습니다. 등록일은 다음 줄에 표시합니다.
    - 긴 제목은 말줄임 없이 줄바꿈합니다. 모바일은 목록처럼 분류를 윗줄로 옮기고 구분선을 숨기며, 제목과 뱃지를 글 흐름으로 이어 표시합니다.
    - 새 글 표시는 스크린리더에 ‘새 글’로 전달합니다. 본문·첨부파일·이전/다음 글·목록 이동은 그대로입니다.
    - 기업·기관 상세 예제는 `category: 'system'`, `isImportant: true`, `isNew: true`로 변경했습니다. 상세 표시·props 변경은 `notice-detail.tsx`와 기업·기관 상세 `page.tsx`에, 이후 반응형 보완은 `notice-list.tsx`·`notice-detail.tsx`에 반영했습니다.
- 검증: 타입·린트 검증을 통과했습니다. 기업 공지사항의 실제 DOM에서 `span` 안의 `div`가 없는 것을 확인했습니다.
- 커밋:
    - [목록·공통 데이터 — 분류·표시·상세 링크 및 마크업 개선](https://github.com/fromex-koh/kibo-ktop/commit/94c2a8b8b867b0ad1056172f6aea8de3863cf3b6)
    - [상세 — 분류·제목·중요공지·새 글 표시 개선](https://github.com/fromex-koh/kibo-ktop/commit/94318f43e855403f4ceffa6441fb050c90f178ac)
    - [목록·상세 — 말줄임 제거 및 모바일 배치 보완](https://github.com/fromex-koh/kibo-ktop/commit/b75cab9f97bd8df22452d8c735d1cb96f7af3474)

### 기업·기관 자료실 — 분류·전체 제목·모바일 다운로드 배치 개선

- 대상:
    - src/components/custom/resource-list.tsx
    - src/app/(user-type)/corp/(service)/(logged-out)/notice/resources/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/notice/resources/page.tsx
- 적용: 공통 목록 컴포넌트와 기업·기관 사용처를 함께 Diff로 반영합니다.
- 데이터·연동:
    - `ResourceItem`에 필수 `category`를 추가했습니다. `guide`는 ‘이용안내’, `form`은 ‘신청서식’이며 기존 데이터에도 값을 지정해야 합니다.
    - 기업·기관 예제 데이터에 분류를 반영했습니다. 예제 `href`는 여전히 `#`이므로 실제 다운로드 파일 URL로 연결해야 합니다.
- 화면 표시:
    - 모바일·태블릿·PC 모두 제목을 말줄임 없이 줄바꿈해 전체 표시합니다.
    - 모바일에서는 모든 항목을 ‘분류 → 제목 → 다운로드 버튼’ 순서로 배치합니다. 제목은 전체 너비를 사용하고 버튼은 아래 왼쪽에 표시합니다.
    - 태블릿·PC는 분류·세로 구분선·제목을 가로로 배치하고 다운로드 버튼은 오른쪽에 유지합니다.
- 유지: 다운로드 링크·접근 가능한 버튼 이름·페이지 이동 동작은 그대로입니다.
- 검증: 360·768·1280px에서 제목 말줄임 제거와 가로 넘침이 없음을 확인했습니다. 모바일의 모든 다운로드 버튼이 아래 왼쪽에 표시되는 것도 확인했습니다.
- 커밋: [자료실 변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/71f93a57434ba8fccd25181aa3724d16afe591a6)

### 은행 전송완료 — 완료 아이콘·본문 배치·여백 개선

- 대상: src/components/composite/bank-transfer-dialog.tsx
- 적용: `Check` 아이콘 import와 `BankTransferResultDialog`의 JSX·클래스를 Diff로 반영합니다. 같은 파일의 `BankTransferDialog`는 설명 주석만 정리했습니다.
- 완료 표시:
    - 60px 원형 배경의 체크 아이콘을 추가하고 ‘결과가 전송되었습니다.’ 문구 위에 배치했습니다. 아이콘은 장식으로 처리해 스크린리더에서 제외합니다.
    - 완료 문구와 은행·지점 정보를 하나의 묶음으로 정리했습니다. 아이콘과 문구 묶음 사이는 16px, 문구와 은행·지점 사이는 8px입니다.
- 여백: `min-h-68`을 제거하고 헤더·본문 하단에 32px, 푸터 상단에 24px 여백을 지정했습니다.
- 적용 범위: 기업·기관 KTRS-FM 완료 화면의 은행 전송 후 표시되는 결과 모달과, 이 컴포넌트를 사용하는 전송완료 단독 화면에 함께 적용됩니다.
- 유지: 은행 목록·지점 입력·전송 처리·`onSubmit`·열림 상태 제어·확인 버튼의 닫기 동작은 그대로입니다. 모달 이름은 기존 `DialogTitle`로 유지합니다.
- 커밋: [은행 전송완료 변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c682c9d77b694f64ce1e0b08b1ac83daaf487005)

### 제출 전 최종 확인 — 공통 모달 여백 조정

- 대상: src/components/composite/submit-confirm-dialog.tsx
- 적용: `SubmitConfirmDialog`의 `DialogHeader`·`DialogFooter` 클래스 변경 두 곳을 Diff로 반영합니다.
- 여백 변경:
    - 헤더에 `sm:pt-18`을 추가해 sm 이상에서 상단 여백을 32px에서 72px로 늘렸습니다. 모바일 상단 여백은 기존 32px입니다.
    - 푸터에 `pt-6`을 추가해 버튼 영역 위 여백을 24px로 지정했습니다.
- 적용 범위: 기업·기관의 KTRS-FM·Tech-Index 일반용·창업용·투자모형 최종 확인과, 같은 모달을 사용하는 기관 일괄평가·일괄 자료 요청 화면에 함께 적용됩니다.
- 유지: ‘제출하시겠습니까?’ 문구·모달 제목 연결·취소/제출 버튼·`onSubmit`·열림 상태 제어는 그대로입니다. 실제 제출 처리는 사용처의 `onSubmit`에서 연결합니다.
- 커밋: [공통 모달 여백 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/90a81b7b878ac0159f965fcd34fef666426a7e79)

### 공통 페이지 이동 — 중복 navigation 역할 제거

- 대상: src/components/composite/pagination.tsx
- 적용: `PaginationRoot`에 `role={undefined}`를 지정한 한 곳을 Diff로 반영합니다.
- 변경: `nav` 자체의 탐색 역할과 중복되는 `role="navigation"`을 제거해 HTML 검사 경고를 해결했습니다. 공통 페이지 이동 컴포넌트를 사용하는 화면에 함께 적용됩니다.
- 유지: ‘페이지 이동’ 레이블·버튼·디자인·페이지 전환 동작은 그대로입니다.
- 검증: 타입·린트 검증을 통과했으며, 실제 DOM에서 중복 role이 제거된 것을 확인했습니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/cddc6d787898b769ad79ffe7d689b59b26592e5a)

### 공통 작성 취소 모달 — 최종 확인 모달과 여백 통일

- 대상: src/components/composite/cancel-confirm-dialog.tsx
- 적용: `CancelConfirmDialog`의 `DialogHeader`·`DialogFooter` 클래스 변경 두 곳을 Diff로 반영합니다.
- 여백 변경:
    - 헤더에 `sm:pt-18`을 추가해 sm 이상에서 상단 여백을 32px에서 72px로 늘렸습니다. 모바일 상단 여백은 기존 32px입니다.
    - 푸터에 `pt-6`을 추가해 버튼 영역 위 여백을 24px로 지정했습니다.
    - 결과 치수는 최종 확인 모달과 같습니다. 카드 588×242, 물음 72~102, 버튼 158부터 246×60이며 좌측 40·302에 놓입니다.
- 적용 범위: 기업·기관의 KTRS-FM·Tech-Index 일반용·창업용·투자모형 체크리스트와 기업정보 작성 취소 화면 11개에 함께 적용됩니다.
- 유지: ‘평가 진행을 중단하시겠습니까?’ 문구·모달 제목 연결·계속작성/저장하고 나가기 버튼·`onSaveAndExit`·열림 상태 제어는 그대로입니다.
- 검증: 타입·린트 검증을 통과했으며, 실제 화면에서 최종 확인 모달과 치수가 같은 것을 확인했습니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2b57661c1b869ff1a9e7257cad9dee296e735127)

### 공통 전체메뉴 — 끊긴 ARIA 참조 제거

- 대상: src/components/composite/header.tsx
- 적용: 전체메뉴 `SheetContent`에 `aria-describedby={undefined}`를 지정한 한 곳을 Diff로 반영합니다.
- 변경: 전체메뉴에는 이름(`SheetTitle`)만 두고 설명을 두지 않는데, 지정하지 않으면 라이브러리가 존재하지 않는 설명 id를 자동으로 가리켜 참조가 끊깁니다. WAVE의 Broken ARIA reference 오류 원인을 제거했습니다.
- 적용 범위: 기업·기관 전체메뉴 화면과 헤더 메뉴를 여는 모든 화면에 함께 적용됩니다.
- 유지: 전체메뉴의 이름(‘전체 메뉴’)·디자인·열기/닫기·포커스 이동 동작은 그대로입니다.
- 검증: 타입·린트 검증을 통과했으며, 실제 DOM에서 끊긴 ARIA 참조가 0건임을 확인했습니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d4396aa2a820fa6ff39c1e86a6a4a332c0e37df0)

## [덮어쓰기]

### 퍼블리싱 인덱스 — 화면 ID·진척률·행 구분 안내 개선

- 대상:
    - src/components/custom/publishing-index.tsx
    - src/content/publishing-guide/types.ts
    - src/content/publishing-guide/index.ts
- 적용: 세 파일과 아래 IA 데이터 파일 세 개를 함께 덮어씁니다.
- 화면 ID·구분선: 기업·기관에 엑셀 화면 ID와 칼럼 구분선을 추가했습니다. ID가 없으면 미지정이며, 탄소 ID 열과 응용2–UIUX 사이 구분선은 없습니다.
- 행 수 안내: IA 수·표 행 수·진척률 기준을 dot list로 정리했습니다. 기업은 156개→169행, 기관은 151개→160행이며, 취소선도 표에 유지합니다.
- 진척률 계산: 취소선을 뺀 완료 행 ÷ 집계 대상 행입니다. 완료·최종완료·보완을 완료 수로 세며, IA 외 화면과 업종·회원 유형별 분리 화면도 각각 포함합니다.
- 보완 집계: 응용2·UIUX 모두 보완을 완료 수에 포함합니다. 진척률 카드는 ‘완료(보완 포함)’로 표시하고, 집계 기준을 표 위 안내 목록에 적었습니다. 취소선 제외 기준은 그대로입니다. 최초 비밀번호 변경·실명인증·로그인 연장·로그인 안내 화면은 완료에서 보완으로 변경해도 완료 수에 계속 포함되어 진척률이 유지됩니다.
- 응용2 결과: 기업 127/169(75%) · 기관 104/154(68%)입니다. 기관은 대기중 7개 추가·미완료 1개 제외 및 완료 상태인 취소선 6개의 집계 제외로, 최초 110/153(72%)에서 104/154(68%)로 변경되었습니다.
- 민트색 10행: 기업 8개·기관 2개로, 이전 IA(260731)에 있던 화면 또는 개발 완료 화면 중 최신 IA(V1.23_260831)에 없는 항목입니다. 삭제·누락 확인 대상으로 안내하며, 행 수·진척률에 포함합니다.
- 주황색·취소선 6행: 최신 IA에서 삭제 표시된 기관 평가 신청·최종 확인 화면입니다. 응용2 완료 뱃지·링크·표의 행 수는 유지하고, 진척률 분자·분모에서 제외합니다.
- 강조 순서: 주황색 > 밝은 민트색 > 업데이트 색상입니다. 행과 각 셀에 적용합니다.
- 안내·간격: 릴리즈 카드의 대상·적용·기준 등 항목명 아래에 상세 내용을 dot list로 표시합니다. 색상 설명을 굵은 제목과 짧은 문장으로 정리하고, 공통 레이아웃 표 아래 여백을 24px 늘렸습니다.

### 퍼블리싱 인덱스 — 기업·기관 IA V1.23 데이터 반영

- 대상:
    - src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 세 파일과 위 인덱스 표시·콘텐츠 처리 파일 세 개를 함께 덮어씁니다.
- 상태 변경: 기관 최초 비밀번호 변경(`org-initial-password-change`), 기업 실명인증(`corp-real-name-verification`)·로그인 연장(`corp-session-extension`)·로그인 안내(`corp-login-guide`)·문의 취소(`corp-notice-inquiry-create-inquiry-cancel`)·문의 작성(`corp-notice-inquiry-create`)·공지사항 목록(`corp-notice-announcements`)·공지사항 상세(`corp-notice-announcements-detail`)·자료실(`corp-notice-resources`)·문의 내역(`corp-mypage-inquiry-history`)·문의 상세(`corp-mypage-inquiry-history-inquiry-detail`)의 UIUX 뱃지를 완료에서 보완으로 변경했습니다. 응용2는 모두 완료를 유지하며, 보완도 완료 수에 포함하므로 진척률은 유지됩니다.
- 최종 확인 상태: 기업·기관 각각 KTRS-FM·Tech-Index 일반용·창업용·투자모형의 제출 전 최종 확인 4개씩, 총 8개 화면의 UIUX 뱃지를 보완으로 변경했습니다. 응용2 완료 상태는 유지하며, 기관 취소선 행의 진척률 제외 기준도 유지합니다.
- 은행 전송완료 상태: 기업 KTRS-FM 완료 하위 화면(`corp-technology-evaluation-ktrs-fm-complete-bank-transfer-transfer-complete`)과 마이페이지 평가결과 하위 화면(`corp-mypage-evaluation-results-bank-transfer-transfer-complete`)의 UIUX 뱃지를 보완으로 변경했습니다. 응용2 완료 상태와 진척률은 유지됩니다.
- 작성 취소·전체메뉴 상태: 기업 투자모형 체크리스트 작성 취소(`corp-technology-evaluation-investment-model-checklist-cancel-confirm`)와 기업·기관 전체메뉴(`corp-full-menu`·`org-full-menu`)의 UIUX 뱃지를 보완으로 변경했습니다. 응용2 완료 상태와 진척률은 유지됩니다.
- 상태 변경 커밋:
    - [투자모형 작성 취소·전체메뉴 3개 뱃지 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/923a590df822eecd7c13d7550d665b80ab836d06)
    - [기업 은행 전송완료 2개 뱃지 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/b1d40b9286e76b2671f6d40a20a21455b6d43d7c)
    - [기업·기관 최종 확인 8개 뱃지 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/ee88c218a18b1412108c226aa276e2eb2a2bf00f)
    - [기업 문의 내역·상세 뱃지 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/112d0ce1acae9a203e1685526a0612f7771b7888)
    - [기업 자료실 뱃지 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/9bdd48defb84cce6399ac7b73dc2e13d0f749886)
    - [기업 공지사항 상세 뱃지 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/bfdb058a8c64b7bfa20cbde55ecba4a1b79c423d)
    - [기업 공지사항 뱃지 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/b8d69ab0f8b973ebf0772e0ea0a31086f6b306fc)
    - [기업 문의 작성 뱃지 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/2b1d6e564b7b31ef94ad0043a631131d51513371)
    - [기업 로그인 연장·안내 뱃지 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/b9f51e61ee46f8406ddaad217b4a585b5bad5c9c)
    - [기업 문의 취소 뱃지 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/a977b5052241bcf288cde9d8161fce1d35beca02)
- 기준: 기업·기관 IA를 `V1.23_260831`로 갱신하고 화면 ID·메뉴명·유료 서비스 관리 하위 구조를 반영했습니다.
- 추가 14개:
    - 기업·기관 공통: 기관 로그인, K-BIGx 이용약관, 메인 공지사항 팝업, 신용정보 활용체제를 각각 추가했습니다(8개).
    - 기업: 가격 정책의 결제하기와 유료 서비스 관리의 환불 불가 안내를 추가했습니다(2개).
    - 기관: 하위 계정 등록·저장·비밀번호 초기화·상태 변경 완료 토스트를 추가했습니다(4개). 메뉴명(Depth)이 비어 있어도 화면 Type이 있으면 집계에 포함합니다.
    - 추가 항목은 대기중으로 등록했습니다.
- 제외 3개:
    - 기업 > 마이페이지 > 유료 서비스 관리 > 환불내역·명세서: V1.22 개정이력에 삭제가 명시되어 제외했습니다(2개).
    - 기관 > 마이페이지 > 하위 계정 현황 > 하위 계정 삭제: 최신 IA에 항목이 없어 제외했습니다(1개).
- 취소선 6개 유지:
    - 기관 > 개별평가 > Tech-Index > 일반용: (3) 평가 신청하기, 제출 전 최종 확인입니다.
    - 기관 > 개별평가 > Tech-Index > 창업용: (3) 평가 신청하기, 제출 전 최종 확인입니다.
    - 기관 > 개별평가 > 투자모형: (4) 평가 신청하기, 제출 전 최종 확인입니다.
    - 최신 IA에서는 삭제 표시된 항목이지만 응용2 완료 이력을 확인하도록 유지합니다. Tech-Index 4개는 v2.0.6, 투자모형 2개는 v2.0.7이며 기존 링크를 유지합니다.
- 행 수 차이: IA 전체는 기업 156개·기관 151개입니다. 퍼블리싱 표는 분리된 화면과 IA 외 추가 화면을 포함해 기업 169개·기관 160개입니다. 기업·기관의 차이 22개는 화면 분리로 늘어난 12개 행과 IA 외 추가 화면 10개 행입니다.
- 최초 대비: 전체 퍼블리싱 행은 392개에서 14개 추가·3개 제외되어 403개입니다(기업 169개·기관 160개·탄소 74개). 제외한 3개는 기존 응용2 상태가 미지정이었으며, 기존 응용2 완료 257개는 모두 유지합니다. 위에 명시한 UIUX 상태 변경 외 기존 작업 상태·링크·버전과 탄소 데이터는 유지하며, 실제 페이지 파일은 삭제하지 않았습니다.

### 버전 업데이트 — 기존 릴리즈 설명 말투 통일

- 대상: src/content/publishing-guide/release-notes.generated.json
- 적용: 지정한 파일을 덮어씁니다.
- 변경: 기존 30개 릴리스의 설명 문구 231개를 입니다·합니다체로 통일했습니다.
- 유지: 설명의 의미와 버전·날짜·수치·파일 경로·링크·코드·인용된 화면 문구는 그대로 유지합니다.
