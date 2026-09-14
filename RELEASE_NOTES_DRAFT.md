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

### [동작] 메인페이지 — PC 의 동작 줄이기 설정과 관계없이 원본 모션 재생

- 대상: src/app/globals.css
    - src/components/custom/stack-pager.tsx
    - src/components/theme/stack-pager.variants.ts
    - src/components/custom/hero-section.tsx
    - src/components/custom/hero-background.tsx
    - src/components/custom/hero-stats-roller.tsx
    - src/components/theme/hero-stats-roller.variants.ts
    - src/components/custom/animated-counter.tsx
    - src/components/custom/main-second-section.tsx
    - src/components/custom/tech-eval-section.tsx
    - src/components/custom/tech-eval-services.tsx
    - src/components/custom/reveal.tsx
    - src/components/custom/home-notice-popup.tsx
- 이전: PC 설정의 동작 줄이기 혹은 애니메이션 줄이기(`prefers-reduced-motion: reduce`)는 대부분 꺼져 있지만 기본으로 켜져 있는 PC 도 있고, 켜져 있으면 메인페이지의 애니메이션 요소가 아예 노출되지 않아 버그처럼 보였습니다.
- 지금: 메인페이지 컴포넌트에서 동작 줄이기 분기(`motion-reduce:*` · `motion-safe:*` · `matchMedia` 판정 · globals.css 의 `@media` 두 블록)를 걷어 내, 설정과 관계없이 원본 모션을 재생합니다.
- 예외 범위: 동작 줄이기 예외는 메인페이지뿐입니다. 나머지 화면은 설정을 켜도 움직임만 줄어들 뿐 메인페이지처럼 내용이 노출되지 않는 경우가 없어, 지금처럼 설정을 따르도록 그대로 둡니다.
- 확인 방법: PC 설정의 동작 줄이기 혹은 애니메이션 줄이기를 켠 상태로 메인페이지를 열어 섹션 내용과 애니메이션이 보이는지 봅니다.
- 영향 화면: [기업 홈](/corp/home) `완료` · [기관 홈](/org/home) `완료` · [기업 메인 공지사항 팝업](/corp/home-notice-popup) `완료` · [기관 메인 공지사항 팝업](/org/home-notice-popup) `완료`
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/73ae2447)

## [덮어쓰기]

### 모션 가이드 — 메인페이지 동작 줄이기 예외 안내

- 대상: src/app/component-guide/(guide)/motion/page.tsx
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다.
- 내용: "모션 적용 방식" 의 접근성 설명을 "기본은 사용처에 `motion-reduce:animate-none` 을 적용해 PC 설정의 동작 줄이기 혹은 애니메이션 줄이기를 따른다" 로 고치고, 그 아래에 경고색 Alert(`role="note"`)로 "예외 — 메인페이지는 동작 줄이기를 적용하지 않습니다" 를 띄웠습니다.
- 영향 화면: [모션 (Motion)](/component-guide/motion)
- 유지: 표의 미리보기 도형은 지금도 동작 줄이기 설정을 따릅니다 — 설정을 켜면 메인 애니메이션도 이 표에서는 멈춰 보입니다.
