# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.
frontend-handoff에 실제 전달되는 파일의 변경만 작성하세요.
프로젝트 서비스 페이지가 아닌 퍼블리싱 가이드 관련 파일은 [덮어쓰기]로 분류하세요.
지워야 하는 파일·화면은 [삭제]로 따로 적으세요.
같은 작업의 카드는 # 작업: 작업 이름 아래에 모으고, 그 아래에서 ## 구분자부터 다시 씁니다.

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

- 카드는 위에서부터 작업할 순서대로 나열했습니다. '한 번에 적용'이 적힌 카드는 함께 넣어야 빌드됩니다.

# 작업: [감리 권고 조치] 헤더 — 현재 화면 메뉴 표시 · 메뉴 링크 연결

## [Diff 확인]

### [토큰] GNB 현재 위치 강조선 색 추가 · 전체 메뉴 강조색 다크 값 변경

- 대상: tokens.json
- 변경:
    - 새 토큰: header-nav-indicator(GNB 강조선 — 라이트 blue.500 · 다크 blue.300 · 메인페이지 mint.500)
    - menu-overlay-accent 다크 값: mint.500 → blue.300(전체 메뉴 강조를 GNB 와 같은 하늘색으로)
- 결과: bg-header-nav-indicator 유틸리티 생성, 다크 전체 메뉴의 현재 항목 · 마우스 올림 색이 하늘색으로 바뀜
- 영향 화면: [색상 (Semantic)](/component-guide/semantic-color)
- 적용: tokens.json 반영 후 yarn tokens 실행(tokens.css 재생성)
- 함께 작업: 이 카드 먼저 — 아래 헤더 스타일이 새 토큰을 씀
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b97faee3748361ed691ffbab78494bc5aeee1319)

### [데이터] 헤더 메뉴 — 현재 위치 판별 · 플랫폼 소개 · 보고서 이력 조회 링크 연결

- 대상: src/constants/header-navigation.ts
- 변경:
    - 메뉴 항목에 matchPaths(단계 화면까지 묶을 경로) · isExactMatch(경로가 정확히 같을 때만) 추가
    - 현재 위치 판별 isHeaderNavLinkActive · 경로의 사용자 유형 getUserTypeFromPath 추가
    - 판별은 /corp · /org 를 떼고 비교 — 토글을 바꿔도 알림마당 등 공통 메뉴의 현재 위치 유지
    - 플랫폼 소개 하위 5개(플랫폼 소개 · 기술평가 · 특허평가 · K-BIGx 보고서 · 탄소중립)를 기업 · 기관 소개 화면에 연결
    - K-BIGx 보고서 › 보고서 이력 조회를 기업 · 기관 마이페이지 K-BIGx 보고서 이력 화면에 연결
    - 평가모형 · 일괄평가 · K-BIGx 보고서에 신청 단계 화면까지 묶는 경로 지정
    - 파일 맨 위에 [프론트엔드 연동] 안내 — 실제 라우트로 바꿀 때 경로만 바꾸면 표시는 자동
- 결과: 메뉴 데이터만으로 현재 화면 메뉴가 표시됨, '#' 이던 메뉴 6개(기업 · 기관 각각)가 실제 화면으로 이동
- 영향 화면: [헤더 (Header)](/component-guide/header)
    - [플랫폼 소개 (기업)](/corp/platform)
    - [K-BIGx 보고서 이력 (기업)](/corp/mypage/k-bigx-report-history)
- 함께 작업: 아래 헤더 컴포넌트 · 스타일과 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/26f90e7633c8fd55b45ce2726a1b0cc7697069c0)

## [덮어쓰기]

### [스타일] 헤더 — 현재 위치 강조선 스타일 추가

- 대상: src/components/theme/header.variants.ts
- 적용: 지정한 파일만 교체
- 내용:
    - headerNavLabelClassName: GNB 메뉴 글자 바로 아래 3px 강조선(자리를 차지하지 않아 글자가 움직이지 않음)
    - headerMenuLabelClassName: 전체 메뉴 그룹 이름 강조선(글자 폭에 맞춤)
    - 드롭다운 항목: 현재 위치일 때 셸 기본 회색 면이 깔리지 않게 정리
- 영향 화면: [헤더 (Header)](/component-guide/header)
- 함께 작업: 위 토큰 카드 다음, 아래 헤더 컴포넌트와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/22f5f3859bf006dcae0b2563112f9db6e1f26c82)

## [Diff 확인]

### [컴포넌트] 헤더 — 현재 화면 메뉴 표시 · 토글 처음 값

- 대상: src/components/composite/header.tsx
- 변경:
    - GNB: 현재 화면이 속한 상위 메뉴에 강조선, 드롭다운의 해당 항목은 굵은 글씨
    - 전체 메뉴(☰): 그룹 이름에 강조선, 현재 항목은 강조색 + 굵은 글씨(마이페이지 · 알림마당 포함)
    - 현재 항목 링크에 aria-current="page"
    - 로그인 전 기업/기관 토글이 화면 경로의 유형으로 시작(/org/… 면 기관)
- 결과: 진입한 화면의 메뉴가 GNB · 전체 메뉴에서 구분됨, 기관 화면에서 처음부터 기관 메뉴가 나옴
- 영향 화면: 헤더를 쓰는 서비스 화면 전체
    - [헤더 (Header)](/component-guide/header)
- 함께 작업: 위 메뉴 데이터 · 스타일과 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fe0b84ffd9fa2605404c1e17b847ade09aa1131c)

# 작업: 컴포넌트 가이드 갱신

## [덮어쓰기]

### [문서] 헤더 · 시맨틱 색상 가이드 — 현재 위치 표시 반영

- 대상: src/app/component-guide/(guide)/header/page.tsx
    - src/app/component-guide/(guide)/semantic-color/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - 헤더: 현재 위치 표시 섹션(표시 방식 · 경로 설정 표 · 미리보기) 추가, 전체 문구를 짧게 정리
    - 시맨틱 색상: header-nav-indicator 색 견본 · 설명 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b29b1c2be112e65d5d288b277a459b3b95e09558)
