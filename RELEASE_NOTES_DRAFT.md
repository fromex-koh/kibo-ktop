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
