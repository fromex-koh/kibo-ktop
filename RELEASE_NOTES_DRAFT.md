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

# 작업: GNB 강조선 hover 모션 — 왼쪽에서 오른쪽으로 그어지는 강조선

## [덮어쓰기]

### [스타일] GNB 메뉴 강조선 — hover · 포커스 모션 추가

- 대상: src/components/theme/header.variants.ts
- 적용: 지정한 파일만 교체
- 내용:
    - 마우스를 올리거나 키보드 포커스를 받으면 강조선이 왼쪽 → 오른쪽으로 그어지고, 떠나면 오른쪽으로 빠져나감(0.3초)
    - 하위 메뉴가 열린 동안은 강조선 유지 — 드롭다운으로 옮겨 가도 사라지지 않음
    - 현재 위치 메뉴는 지금처럼 늘 보임 · 색(header-nav-indicator) · 두께(3px)는 그대로
    - 움직임 줄이기(prefers-reduced-motion) 설정이면 애니메이션 없이 바로 바뀜
    - 전체 메뉴(☰)의 그룹 이름 강조선은 바뀌지 않음
- 영향 화면: GNB 가 있는 모든 화면(PC · 태블릿)
    - [기업 홈](/corp/home)
    - [기관 홈](/org/home)
    - [헤더 가이드](/component-guide/header)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2f385c98c1a3de978fbe6ec39659f63429916cfd)

### [문서] 헤더 가이드 — GNB 강조선 hover 모션 안내

- 대상: src/app/component-guide/(guide)/header/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - [헤더 (Header)](/component-guide/header): 현재 위치 표시 표의 GNB 행에 hover · 포커스 · 하위 메뉴 열림 모션 설명 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e65e26ab844ead54281781f60ffde81b74b87021)

# 작업: 기준 선택 검색 카드 — 입력칸 오류 표시

## [Diff 확인]

### [컴포넌트] SelectSearchForm — 입력칸 오류 표시 추가

- 대상: src/components/composite/select-search-form.tsx
- 변경: 입력 상자의 평소 테두리를 border-0 → border-transparent 로 바꿈(자리만 잡아 둠) · 주석 정리
- 결과:
    - 검색어가 비었거나 형식이 틀리면 입력칸이 다른 입력칸의 오류 칸과 같아짐 — 빨간 테두리(destructive) · 연한 빨간 면(field-invalid) · 반경 8
    - 오류가 없을 때 모양 · 크기는 그대로, 오류 문구 위치 · 색도 그대로
- 영향 화면:
    - [K-BIGx 기업혁신성장 (기업)](/corp/k-bigx-report/innovation-growth-report)
    - [K-BIGx 기업혁신성장 (기관)](/org/k-bigx-report/innovation-growth-report)
    - [특허 등급조회 (기업)](/corp/patent-evaluation/patent-grade-list)
    - [특허 등급조회 (기관)](/org/patent-evaluation/patent-grade-list)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e2b7d41e4fdb6a1f294901dcb02c040403c58667)

## [덮어쓰기]

### [문서] 기준 선택 검색 가이드 — 오류 칸 모양 안내

- 대상: src/app/component-guide/(guide)/select-search-form/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - [기준 선택 검색 (SelectSearchForm)](/component-guide/select-search-form): 상태 표의 빈 값 오류 · 형식 오류에 오류 칸(빨간 테두리 · 연한 빨간 면) 설명 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ff6a2405277d38be0fd580f4eb4deee16d372253)
