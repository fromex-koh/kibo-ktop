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
