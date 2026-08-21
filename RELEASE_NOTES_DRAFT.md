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

## [덮어쓰기]

### 색·크기 토큰 — Figma 컬러 변수 최신본 반영

- 대상: tokens.json
- 적용: 지정한 파일만 교체한 뒤 `yarn tokens` 로 `src/app/tokens.css` 를 다시 생성한다. 생성물은 저장소에 두지 않으므로 파일만 받으면 된다(`predev`·`prebuild` 에 포함돼 있어 dev·build 시 자동 생성)
- 변경: Figma 색 변수 전체(brand 7계열·system 4계열·common)를 대조해 달라진 두 값을 반영 — `blue.500` `#3f7deb → #3172e2`, `info.500` `#3674da → #3172e2`. 나머지 값은 모두 같았고 새로 생긴 색은 없다
- 결과: 라이트 모드에서 `--ds-primary`·`--ds-ring`·`--ds-secondary-strong`·`--ds-chart-1`·`--ds-sidebar-ring` 과 배지의 `badge-solid-info`·`border-info-500` 이 함께 이동한다. 다크·메인페이지는 `blue.300`·`info.300` 을 쓰므로 영향 없음
- 함께: 아래 ListMarker 가 쓰는 `size.list-dot-sm`(3px)도 이 파일에 함께 들어 있다 — 토큰 없이 컴포넌트만 받으면 점 크기가 지정되지 않으므로 이 파일을 먼저 반영한다

### [Badge] xs(24px) 크기 추가

- 대상: src/components/theme/badge.variants.ts
    - src/app/component-guide/(guide)/badge/page.tsx
- 적용: `size` 에 `xs` 를 더한 파일로 교체. 기존 `sm`(28px)·`lg`(40px)는 종전과 같아 지금 쓰고 있는 배지는 하나도 변하지 않는다
- 변경: `xs` 는 높이 24px · 글자 12/18(`typo-caption-medium`) · 라운드 8px · 좌우 여백 round 8px·pill 12px. Figma badge 세트의 `size=small` 이며, Figma 의 `size=large` 가 프로젝트 `sm` 에 해당한다
- 참고: 시안이 이 크기를 round 로만 그려 두어 pill 여백은 다른 크기와 같은 12px 를 따랐고, 최소 너비는 두지 않았다(`sm` 의 60px 는 유지)
- 가이드: [Badge](/component-guide/badge) 의 Props 표와 Size 섹션에 xs 행·예시 추가

### [ListMarker] unordered-small 추가

- 대상: src/components/custom/list-marker.tsx
    - src/app/component-guide/(guide)/list-marker/page.tsx
- 적용: `type` 에 `unordered-small` 을 더한 파일로 교체. 기존 `unordered`·`ordered` 는 종전과 같다
- 변경: 칸 12×20 · 점 3×3 원형 · 색 `foreground-subtle`. Figma `list_atomic_bullet` 의 `type=unordered_small` 이며, 13px 본문 옆에 놓는 작은 불릿이다(폭은 일반 점과 같은 12px 라 들여쓰기가 어긋나지 않는다)
- 순서: 위 토큰 파일(`size.list-dot-sm`)을 함께 반영해야 한다
- 가이드: [ListMarker](/component-guide/list-marker) 의 변형 목록·규격 표·Props 에 추가

### [Pagination] 이전/다음 좌우 여백 8px 교정

- 대상: src/components/theme/pagination.variants.ts
- 적용: 이전/다음 버튼의 좌우 여백을 12px 에서 8px 로 고친 파일로 교체
- 변경: Figma `pagination_item` 의 pre/next 폭이 68px(여백 8 + 아이콘 20 + 간격 4 + 글자 28 + 여백 8)인데 76px 로 그려지고 있었다. 번호 버튼(40×40)·색·라운드는 시안과 이미 같아 그대로다
- 결과: 페이지네이션을 쓰는 목록 화면에서 [이전]·[다음] 버튼이 좌우로 4px 씩 좁아진다
