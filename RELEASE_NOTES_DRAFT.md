# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.

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

## [신규 추가]

### 로그인 목업 회원 상수

- 대상: src/constants/preview-user.ts
- 적용: 신규 파일 추가
- 내용: 로그인 상태 화면이 공유하는 목업 회원 정보를 한 파일로 모음. 기업 1건(법인 표기와 원본 기업명을 나눠 두어 헤더용 완성형과 마이페이지 [기업명] 칸 값을 한 값에서 만든다), 기관 회원 유형 3종(협약은행 · 협약기관 · 하위 계정), 유형이 정해지지 않은 기관 화면이 쓰는 기본 회원 1건
- 연동: 로그인 세션(회원정보) 응답으로 교체하는 자리다. 회원명과 잔여 시간 모두 서버 값을 넣으면 된다

## [Diff 확인]

### 로그인 레이아웃의 목업 회원 참조 전환

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/layout.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/layout.tsx
- 변경: 레이아웃 파일에 직접 적혀 있던 목업 회원 객체를 지우고 `@/constants/preview-user` 를 import 하도록 교체. 레이아웃이 넘기는 props 와 화면 구조는 그대로다
- 결과: 헤더의 회원명과 마이페이지의 회원 정보가 같은 값을 본다. 두 곳에 따로 적어 두어 한쪽만 고쳤을 때 같은 화면에서 다른 기업 이름이 보이던 문제를 막는다. 기업 목업 이름은 `한국미래기술혁신성장기업주식회사` 에서 `(주)한국미래기술혁신성장테크놀로지` 로 바뀌었고, 헤더 이름 칸(184px)에서 잘리는지 확인하기 위한 폭은 종전과 같다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fbe0c893d69445836d81a2949434c55628955907)

## [덮어쓰기]

### [SectionHeader] 제목·설명 크기 축 추가

- 대상: src/components/composite/section-header.tsx
- 적용: SectionHeaderTitle·SectionHeaderDescription 에 `size` 를 추가한 파일로 교체. 기본값 `md` 는 종전 타이포(제목 `typo-h4-bold` · 설명 `typo-body-xl-regular`) 그대로라 기존 사용처는 손대지 않아도 같게 보인다
- 사용: 페이지 제목 아래에 화면 제목이 한 단계 더 있는 구성(마이페이지 등)에서 `size="lg"` 를 쓴다 — 제목 `typo-h1-bold` · 설명 `typo-title-m-regular` 로, 단계형 화면의 StepHeader 와 같은 타이포 짝이다

### [StickySidebar 접근성] 이름 헤딩 단계 지원

- 대상: src/components/composite/sticky-sidebar.tsx
    - src/app/component-guide/(guide)/sticky-sidebar/page.tsx
- 적용: StickySidebarProfile 의 이름을 문단이 아닌 실제 헤딩으로 렌더링하고, 화면의 제목 구조에 맞춰 2~4단계를 고를 수 있는 `headingLevel`(기본 2)을 추가한 파일로 교체
- 사용: 쓰는 화면의 앞 제목보다 한 단계 낮춘다 — 페이지 h1 아래면 2, 앞 제목이 h2 인 자리면 3. 크기만 큰 문단으로 두면 WAVE 가 "Possible heading" 으로 잡고 스크린리더의 제목 이동에서도 빠진다[6.4.2]
- 가이드: [StickySidebar](/component-guide/sticky-sidebar) Props 표에 `headingLevel` 추가

## [신규 추가]

### 대표자 역량 학력 선택지 상수

- 대상: src/constants/representative-capability.ts
- 적용: 신규 파일 추가
- 내용: 최종학력 · 학교구분 · 수학상태 · 학위취득 선택지와, 전공을 받지 않는 학력 값(고졸), 졸업년도 입력 규칙(숫자만 네 자리로 정리 · `pattern` · 자릿수가 모자랄 때 띄울 안내 문구)
- 연동: 선택지의 `value` 는 화면에 보이지 않는 제출용 키라 영문 소문자로 두었다. 실제 코드값이 정해지면 이 키만 바꾸면 된다
- 함께 적용: 덮어쓰기 카드의 Tech-Index 대표자 역량 구획과 같은 커밋 단위로 적용

## [덮어쓰기]

### Tech-Index 대표자 역량 구획 상수 참조 전환

- 대상: src/components/composite/tech-index-representative-capability.tsx
- 적용: 파일 안에 두었던 학력 선택지와 졸업년도 규칙을 지우고 `@/constants/representative-capability` 를 가져다 쓰는 파일로 교체. 화면 구성과 입력 규칙은 종전과 같다
- 이유: 마이페이지 [대표자(경영자) 역량 및 경력] 화면이 같은 목록을 쓴다. 학력 구분은 화면마다 달라질 값이 아니라 한 벌만 두고, 한쪽만 고쳐 두 화면의 선택지가 달라지는 일을 막는다
- 함께 적용: 신규 추가 카드의 상수 파일과 같은 커밋 단위로 적용

## [신규 추가]

### 마이페이지 공통 셸 — LNB · 구획 카드 · 확인 모달

- 대상: src/components/composite/mypage-sidebar.tsx
    - src/components/composite/mypage-form-card.tsx
    - src/components/composite/edit-cancel-confirm-dialog.tsx
    - src/components/composite/save-confirm-dialog.tsx
- 적용: 신규 파일 추가
- 내용: 마이페이지의 모든 화면이 함께 쓰는 조각이다. `MypageSidebar` 는 기업·기관 메뉴를 한 벌로 들고 화면에서는 어느 쪽인지(`userType`)만 넘긴다 — 아이콘이 함수라 서버에서 클라이언트로 넘길 수 없어 목록을 이 파일에 둔다. `MypageFormCard` 는 공통 FormCard 에 마이페이지 카드 폭(792)에 맞춘 안쪽 여백만 정한 조각이다. `EditCancelConfirmDialog`(수정 취소) · `SaveConfirmDialog`(저장 전 최종 확인)는 되돌릴 수 없는 동작 앞에서 한 번 더 묻는다
- 반응형: 사이드바는 폭에 따라 셋으로 그린다 — `xl` 이상은 본문 옆에 붙어 따라오는 카드, `md~xl` 은 콘텐츠 열 안에서 현재 메뉴 한 줄만 두고 눌러서 여는 목록, `md` 미만은 같은 줄을 화면 폭으로 넓혀 헤더 아래 고정. 기업·기술정보 입력(FormTabs)의 탭이 좁은 화면에서 바뀌는 방식과 같고, 임계값도 같은 상수를 가져다 쓴다
- 연동: 아직 만들지 않은 화면의 메뉴 경로는 `'#'` 이다(경로가 타입으로 검사되어 없는 주소를 미리 적어 둘 수 없다). 해당 화면이 생기면 그 경로로 바꾼다 — 현재 `'#'` 인 곳은 기업 [K-BIGx 보고서 이력] · [유료 서비스 관리], 기관 [평가결과 조회] · [평가검증 신청 조회] · [K-BIGx 보고서 이력] · [하위 계정 현황]

### 기업 마이페이지 내 정보 입력 폼 · 회원정보 데이터

- 대상: src/components/composite/mypage-profile-form.tsx
    - src/constants/mypage-profile.ts
- 적용: 신규 파일 추가
- 내용: [기업정보] · [기업 담당자 정보] 두 구획의 입력 폼이다. 기업형태(개인 · 법인 · 기타)에 따라 법인 전용 칸이 열리고 닫히며, 기업명 표기(앞 · 뒤)를 고르면 완성형 이름을 바로 보여 준다. 업종코드 · 주소는 기존 검색 화면으로 이어진다. 칸 이름과 목업 회원정보는 상수 파일로 나눠 두었다
- 연동: 회원정보 조회는 한 번이다. 그 응답을 `MYPAGE_MEMBER_PROFILE` 자리에 넣으면 사이드바(이름 · 회원 구분)와 폼이 같은 값을 함께 받는다 — 화면이 값을 두 경로로 받지 않는다. 법인 전용 칸은 개인 · 기타로 되돌릴 때 값을 지운다(개인사업자인데 법인번호가 담기는 일을 막는다)
- 함께 적용: 신규 추가 카드의 마이페이지 공통 셸과 같은 커밋 단위로 적용

### 기업 마이페이지 내 정보 화면

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/mypage/profile/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/profile/cancel-confirm/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/profile/save-confirm/page.tsx
- 적용: 신규 파일 추가
- 내용: 좌측 LNB 고정 + 우측 본문의 2단 배치다(시안 실측 344 + 64 + 792 = 1200). 페이지 컬럼 그리드가 아니라 사이드바 폭이 정해진 구성이며, 좁은 화면에서는 한 열로 떨어지고 사이드바가 위로 온다 — 메뉴가 본문보다 먼저 읽히는 순서다[7.3.1]. 수정 취소 · 저장 전 최종 확인 모달은 단독으로 열어 볼 수 있는 확인 경로를 함께 둔다
- 함께 적용: 위 두 신규 추가 카드와 같은 커밋 단위로 적용

## [덮어쓰기]

### [InputGroup] 오른쪽 끝을 채우는 버튼 배치 추가

- 대상: src/components/theme/input-group.variants.ts
- 적용: `InputGroupAddon` 의 `align` 에 `inline-end-fill` 을 더한 파일로 교체. 기존 `inline-start` · `inline-end` · `block-start` · `block-end` 는 그대로다
- 사용: 비밀번호 표시/숨김처럼 입력 칸에 붙는 조작 버튼에 쓴다. 상자의 오른쪽 여백을 없애고 버튼이 상자 높이를 채우며 왼쪽 모서리만 각져, hover 면이 상자 위에 얹힌 조각이 아니라 상자의 한 구역으로 읽힌다. [지우기](ClearableInput)처럼 작고 동그란 버튼에는 쓰지 않는다 — 기존 `inline-end` 를 그대로 쓴다

## [신규 추가]

### 기관 마이페이지 내 정보 공통 셸 · 입력 폼

- 대상: src/components/composite/org-mypage-profile-screen.tsx
    - src/components/composite/org-mypage-profile-form.tsx
- 적용: 신규 파일 추가
- 내용: 회원 유형 세 화면이 함께 쓰는 조각이다. `OrgMypageProfileScreen` 은 기업 [내 정보]와 같은 2단 구성을 갖고, 유형마다 달라지는 회원 정보 · 브레드크럼 · 폼만 화면(page)에서 받는다. `OrgMypageProfileForm` 은 `variant` 로 [기본 정보] 구성을 바꾸고, 하위 계정일 때만 [이용권 정보] 구획을 더 그린다
- 잠긴 값: 고칠 수 없는 값(ID · 기관구분 · 상위 마스터 기관 · 사업기간 등)은 입력 칸 모양을 유지한 채 잠근다. 배분받은 이용권은 고칠 수 없는 값이라 입력 칸이 아니라 목록으로 둔다
- 연동: 계정 정보와 이용권은 화면(page)이 읽어 폼에 내려 준다 — 조회 코드를 폼 안에서 찾아다니지 않아도 된다
- 함께 적용: 아래 신규 추가 카드의 화면들과 같은 커밋 단위로 적용

### 기관 마이페이지 내 정보 화면 — 회원 유형 3종

- 대상: src/app/(user-type)/org/(service)/(member-partner-bank)/**
    - src/app/(user-type)/org/(service)/(member-partner-agency)/**
    - src/app/(user-type)/org/(service)/(member-sub-account)/**
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/profile-edit/cancel-confirm/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/profile-edit/save-confirm/page.tsx
- 적용: 신규 파일 추가
- 내용: 협약은행 · 협약기관 · 기관회원(하위 계정) 세 화면과, 수정 취소 · 저장 전 최종 확인 모달의 단독 확인 경로. 하위 계정은 상위 마스터 기관이 만들어 준 계정이라 묻는 칸이 다르고 [이용권 정보] 구획이 더 있다
- 구조: 세 화면은 유형별 경로 그룹 안에 있다. 헤더에 보이는 기관명이 유형마다 다른데 레이아웃은 자식이 값을 올려 줄 수 없어, 유형별 레이아웃을 나란히 두었다. 경로 그룹은 주소에 드러나지 않으므로 URL 은 `/org/mypage/profile-edit/<유형>` 그대로다
- 연동: 마이페이지 LNB 의 기관 [내 정보] 는 협약기관 화면으로 이어 두었다. 실제로는 로그인한 회원 유형의 화면으로 보내면 된다

## [신규 추가]

### 기업 대표자 역량 및 경력 입력 폼 · 이력 데이터

- 대상: src/components/composite/mypage-representative-history-form.tsx
    - src/constants/mypage-representative-history.ts
- 적용: 신규 파일 추가
- 내용: [경영자 역량] · [대표자 경력사항] 두 구획의 입력 폼이다. 같은 칸이 기술평가 신청의 [대표자 역량 및 경력사항] 탭에도 있지만 화면이 다르다 — 탭이 없고, 두 구획이 각각 카드가 되며, 총 경력 연수를 세지 않는다. 그래서 낮은 조각(Field · FieldGrid · RepeatCard)만 함께 쓰고 배치는 이 화면이 갖는다. 학력 선택지는 신청 화면과 같은 공통 상수를 가져다 쓴다
- 필수 규칙: 두 구획의 모든 칸이 필수다. 전공만 최종학력이 [고졸] 일 때 풀린다. 경력은 카드 단위로 본다 — 완전히 빈 카드는 검사하지 않고(적을 경력이 없는 대표자가 빈 카드 한 장 때문에 저장하지 못하면 안 된다), 한 칸이라도 채우면 그때부터 그 카드의 나머지 칸이 모두 필수가 된다. 라벨의 `*` 는 늘 보여 어떤 칸이 필수가 될지 미리 알려 준다
- 제출: 빈 경력 카드는 제출 데이터에서 걷어내고, 남는 카드의 번호를 화면에 보이는 순서(경력1 · 경력2…)로 다시 매긴다. 카드 번호는 값이 섞이지 않도록 붙인 고유 번호라 가운데 카드를 지우면 1 · 3 이 남는데, 화면은 경력1 · 경력2 인데 데이터만 1 · 3 이면 읽는 쪽이 헷갈린다
- 연동: 대표자 이력 조회 응답을 `REPRESENTATIVE_HISTORY` 자리에 넣으면 폼이 그 값으로 열리고, 경력은 응답 건수만큼 카드가 그려진다(등록된 경력이 없으면 빈 카드 한 장). [취소] 는 값뿐 아니라 지운 경력 카드까지 처음 상태로 되돌린다 — 카드 수는 값이 아니라 목록의 상태라 따로 되돌린다

### 기업 대표자 역량 및 경력 화면

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/mypage/representative-history/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/representative-history/cancel-confirm/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/representative-history/save-confirm/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/representative-history/input-helper/page.tsx
- 적용: 신규 파일 추가
- 내용: 기업 [내 정보]와 같은 2단 배치의 마이페이지 화면이다. 평가 신청 때 받아 둔 대표자 이력을 여기서 확인하고 고친다. 수정 취소 · 저장 전 최종 확인 모달과, [대표자 경력사항] 제목 옆 물음표가 여는 [입력 도움말] 모달의 단독 확인 경로를 함께 둔다 — 입력 도움말 내용은 신청 화면의 것과 같다
- 함께 적용: 위 신규 추가 카드의 폼 · 데이터와 같은 커밋 단위로 적용

### 대표자 이력 고객 정보 활용 동의 화면

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/mypage/representative-history/customer-consent/page.tsx
- 적용: 신규 파일 추가
- 내용: 기술평가 신청 1단계의 고객정보활용동의와 같은 화면이다. 동의서 본문뿐 아니라 화면 구성(단계 머리 · 동의서 · 부분발송 이메일등록 · 하단 CTA)도 그대로 쓴다. 필수 · 선택 동의 팝업과 개별 상세의 단독 확인 경로는 앞서 전달한 것을 그대로 쓴다
- 원본과 다른 점: 화면 제목 줄(PageTitleBar)을 두지 않는다 · 단계 진행 표시(StepProgress)를 두지 않는다(5단계 신청 흐름 안의 화면이 아니다) · 앞뒤로 잇는 화면이 신청 흐름이 아니라 대표자 이력이다. 마이페이지의 두 열(LNB + 본문)에도 넣지 않는다 — 메뉴를 오가는 자리가 아니라 앞뒤가 정해진 한 단계다

## [신규 추가]

### 기업 기술평가 신청 대표자 역량 입력 도움말 화면 3건

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/representative-capability-career/input-helper/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/representative-capability-career/input-helper/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/representative-capability-career/input-helper/page.tsx
- 적용: 신규 파일 추가
- 내용: Tech-Index 2단계 [대표자 역량 및 경력사항] 탭의 [입력 도움말] 버튼이 여는 모달을, 화면정의서의 하위 화면으로 따로 확인하는 경로다. 뒤 배경을 비우고 모달만 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다
- 구조: 내용이 셋 다 같아 일반용에 한 벌만 두고, 창업기업용 · 투자모형은 그 화면을 다시 내보낸다. 모달 자체는 기존 `CareerInputHelpDialog` 를 그대로 쓴다 — 새로 만든 모달이 아니다

## [신규 추가]

### 인라인 구분선 (InlineSeparator)

- 대상: src/components/composite/inline-separator.tsx
- 적용: 신규 파일 추가
- 내용: 한 줄 안에서 값과 값을 가르는 세로선이다(시안 divider 1×12). 1:1 문의의 [분류 │ 제목], 평가결과 조회의 [일시 │ 상태 │ 등급]처럼 나란히 놓인 값 사이에 쓴다. 세로 Separator 를 쓸 때마다 되풀이되던 손질 두 가지를 이 조각이 갖는다 — 셸이 세로 방향에 `self-stretch` 를 걸어 두어 높이를 12 로 묶으면 줄 위쪽에 붙는 것, 그리고 제목처럼 글자만 담을 수 있는 자리에는 블록 요소를 넣을 수 없는 것[8.1.1]
- 사용: 기본은 좌우 여백 12 다. 제목 안에 넣을 때는 `inline` 을 켠다 — `asChild` 로 같은 스타일을 `span` 에 씌워 글 흐름에 놓는다
- 가이드: [Separator](/component-guide/separator) 에 인라인 구분선 사용 예시 추가

### 1:1 문의 목록 · 상세 컴포넌트 · 공통 값

- 대상: src/components/custom/inquiry-list.tsx
    - src/components/custom/inquiry-detail.tsx
    - src/constants/inquiry.ts
- 적용: 신규 파일 추가
- 내용: 기업 · 기관이 같은 컴포넌트를 쓴다 — 다른 것은 목록 데이터와 이동 경로뿐이라 화면(page)이 넘긴다. 목록은 공지사항 목록과 같은 틀이고(BaseCard · 구분선 · Badge · Pagination) 한 줄에 담기는 것만 다르다. 상세는 카드 한 장에 [문의 요약 · 문의 내용 · 첨부파일 · 답변]이 구분선으로 나뉘어 들어간다
- 상태 · 유형: 답변 상태는 `waiting`(답변대기) · `answered`(답변완료) 두 가지이며 색만으로 전달하지 않고 글자를 함께 둔다[5.3.1]. 문의 유형은 알림마당 > 문의하기의 [유형 선택]과 같은 목록을 본다. 두 값은 서버 컴포넌트(상세)와 클라이언트 컴포넌트(목록)가 함께 읽어야 해 `src/constants/inquiry.ts` 에 둔다 — `'use client'` 파일의 상수를 서버에서 import 하면 실제 값이 아니라 빈 참조가 넘어온다
- 첨부파일: 파일 이름 한 벌로 받고 그릴 때만 이름과 확장자로 나눈다. 자리가 모자라면 이름만 줄이고 확장자는 남긴다 — 이름째 말줄임하면 무슨 형식의 파일인지가 먼저 사라진다
- 답변: 답변 본문을 넘기지 않으면 그 자리에 대기 안내가 대신 보인다

### 기업 · 기관 1:1 문의 화면 (목록 · 상세)

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/mypage/inquiry-history/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/inquiry-history/inquiry-detail/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/inquiry-history/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/inquiry-history/inquiry-detail/page.tsx
- 적용: 신규 파일 추가
- 내용: 마이페이지 2단 배치의 목록 화면과 상세 화면이다. [문의 등록] 은 각 회원 유형의 알림마당 > 문의하기로 이어진다
- 연동: 화면이 쓰는 값은 모두 page.tsx 의 상수뿐이고 컴포넌트는 넘겨받은 것만 그린다 — 조회 코드를 컴포넌트 안에서 찾아다니지 않아도 된다. 항목마다 `href` 를 들고 있어 퍼블리싱에서는 모두 같은 상세 화면을 가리키지만, 연동할 때 이 값만 문의별 주소로 바꾸면 화면은 손댈 것이 없다. 목록에 빈 배열을 넘기면 빈 상태 안내가 나온다 — 조회 결과가 없을 때의 화면을 따로 만들 필요가 없다
- 함께 적용: 위 두 신규 추가 카드와 같은 커밋 단위로 적용

## [덮어쓰기]

### 문의하기 폼의 유형 목록 공통 상수 참조 전환

- 대상: src/components/custom/inquiry-form.tsx
- 적용: 파일 안에 두었던 문의 유형 목록을 지우고 `@/constants/inquiry` 를 가져다 쓰는 파일로 교체. 화면 구성과 입력 규칙은 종전과 같다
- 이유: 같은 목록을 마이페이지 1:1 문의 목록 · 상세가 함께 본다. 한 벌만 두어 한쪽만 고쳐 두 화면의 분류가 달라지는 일을 막는다
