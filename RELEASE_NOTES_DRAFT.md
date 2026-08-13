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

### 퍼블리싱 인덱스 화면 및 진행 현황

- 대상: src/components/custom/publishing-index.tsx
- 적용: 릴리즈 인계 카드 정렬, 응용2·UIUX 상태와 개별 진척률, 퀵메뉴의 맨 위로 이동 기능, 응용2 상태 작업 안내를 포함한 최신 퍼블리싱 인덱스 화면으로 교체. 실제 화면명의 뎁스 배지를 누르면 publishing-index.json에서 바로 검색할 고유 키가 복사되고 상단 중앙에 완료 토스트가 표시됨

### 퍼블리싱 인덱스 관리 데이터

- 대상: src/content/publishing-guide/index.ts
    - src/content/publishing-guide/types.ts
    - src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.generated.json
    - src/content/publishing-guide/screen-registry.json
- 적용: 기존 status를 UIUX 상태로 유지하고 새 응용2 상태를 전체 대기중에서 독립적으로 관리하는 스키마·검증 로직과 작성 규칙 주석을 포함한 최신 관리 데이터로 교체. 삭제 항목을 제외한 전체 화면에서 고유 키를 복사할 수 있도록 누락 화면 13개의 키·경로와 생성 레지스트리를 함께 반영

## [신규 추가]

### 기업·기관 Tech-Index 평가모형 선택 화면

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/selection/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/selection/page.tsx
- 적용: 신규 파일 추가. 혁신성장지수(일반)·(창업) 옵션 카드와 "알려드려요" 안내로 구성한 평가모형 선택 화면. 기존 PageTitleBar·OptionCard·InfoBox 조합이라 새 공통 컴포넌트는 없음
- 참고: 이동할 (1) 고객정보활용동의 화면이 아직 없어 두 카드의 링크는 `#`으로 둠. 화면이 준비되면 기업은 tech-index/general·startup의 customer-consent, 기관은 tech-index/customer-consent로 연결
