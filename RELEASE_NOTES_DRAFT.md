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
