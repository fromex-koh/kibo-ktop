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

### [기능] 기업정보 불러오기 모달 — 표 → 라디오 목록 + [선택]

- 대상: src/components/composite/company-info-load-dialog.tsx
- 이전: 표 목록 · 줄을 누르면 바로 입력되고 닫힘 · 버튼 `조회`
- 지금: 기본 모달 폭(`max-w-modal`)으로 바꿨습니다.
    - 조회: `오늘` · `1개월` · `3개월` · `전체` / 시작일 `~` 종료일 / `기업명 입력` · `초기화` · `검색`
    - 목록: `KTRS-FM | 총 N건` 아래 라디오 목록 — 기업명 + `기업 사업자번호` · `조회 기관` · `평가일`
    - 페이지: 한 쪽 10줄, 목록 상자는 다섯 줄 높이까지 보이고 안에서 스크롤, 아래에 페이지 이동
    - `선택`: 라디오로 줄을 골라야 활성, 누르면 그 기업 정보가 입력되고 닫힘
    - 빈 결과: `이력이 없습니다.` · `선택` 비활성
    - 모바일(640 미만): 종료일은 아래 줄 · `초기화` `검색` 은 기업명 아래 반씩 · 보조 정보 세로 배치
- 연동: props 는 그대로입니다. `onSelect` 호출 시점만 줄 클릭 → `선택` 클릭으로 바뀌었습니다.
- 영향 화면: [기관 KTRS-FM 기업정보 관리](/org/individual-evaluation/ktrs-fm/company-info/company-management) · [기관 투자모형 기업정보 관리](/org/individual-evaluation/investment-model/company-info/company-management) · [기관 Tech-Index 일반 기업정보 관리](/org/individual-evaluation/tech-index/general/company-info/company-management) · [기관 Tech-Index 창업 기업정보 관리](/org/individual-evaluation/tech-index/startup/company-info/company-management)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/7322e8f3)

### [기능] 조회 필터 — 모바일 날짜 `~` 위치 옵션 추가

- 대상: src/components/composite/search-filter-form.tsx
- 추가: `DateRangeField` 의 `stackedTilde`(기본 `'center'`) — 모바일에서 `~` 를 시작일 칸 오른쪽에 붙이려면 `'inline'`
- 유지: 기본값이 기존 동작과 같아 다른 조회 화면은 바뀌지 않습니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/7f9dfab9)

### [데이터] 기업정보 불러오기 목업 — 긴 이름 케이스 추가

- 대상: src/content/service/company-info-load.ts
- 추가: 긴 기업명 2건 · 긴 조회 기관 2건(줄바꿈 확인용)
- 유지: 한 쪽 10줄 페이징과 반환 모양은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2da7c82f)
