# 다음 릴리스 변경사항

## [신규 추가]

### 이용안내·가격 정책·플랫폼 소개 화면 14건

- 대상: src/app/(user-type)/corp/(service)/(logged-out)/guide/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-out)/pricing/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-out)/platform/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-out)/platform/technology-evaluation/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-out)/platform/patent-evaluation/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-out)/platform/k-bigx-report/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-out)/platform/carbon-neutrality/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/guide/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/pricing/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/platform/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/platform/technology-evaluation/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/platform/patent-evaluation/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/platform/k-bigx-report/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/platform/carbon-neutrality/page.tsx
- 적용: 신규 파일 추가. 기업·기관 각 7건이고 다른 파일에 영향이 없다
- 화면: 이용약관과 같은 짜임(PageTitleBar + 임시 섹션)이고, 화면마다 다른 것은 제목과 브레드크럼뿐이다. 원고를 받기 전이라 본문은 `내용 추후 업데이트` 한 줄이다
- 참고: 화면명은 화면정의서 라벨을 따랐다(`기술평가 소개`). 헤더 메뉴의 `기술평가` 와 다르다

### 전체메뉴 화면 2건

- 대상: src/app/(user-type)/corp/full-menu/page.tsx
    - src/app/(user-type)/org/full-menu/page.tsx
    - src/components/custom/full-menu-auto-open.tsx
- 적용: 신규 파일 추가. 세 파일을 함께 받는다
- 화면: 홈과 같은 메인 랜딩 화면을 그대로 두고 전체 메뉴만 연 상태로 시작한다. 메뉴를 닫으면 그 아래 홈이 드러난다
- 방식: 여는 일은 화면 쪽 조각(`FullMenuAutoOpen`)이 헤더의 메뉴 버튼을 한 번 눌러 맡는다 — Header·PageLayout·MainPageScreen 은 손대지 않았으므로 다른 화면은 하나도 변하지 않는다
- 위치: 홈과 같은 이유로 라우트 그룹 밖(`corp/full-menu`·`org/full-menu`)에 둔다 — 레이아웃 안에 두면 Header 가 겹친다

## [덮어쓰기]

### mainpage 테마를 적용할 경로 목록

- 대상: src/constants/theme-routes.ts
- 적용: 지정한 파일만 교체. 위 [신규 추가] `전체메뉴 화면 2건` 과 함께 반영한다
- 변경: mainpage 테마 경로에 `/corp/full-menu`·`/org/full-menu` 를 더한다. 빠지면 홈과 같은 화면인데 그 두 경로만 기본 테마로 떨어진다

### 퍼블리싱 인덱스 — 소개·전체메뉴 화면 16건 완료 처리

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체. 화면 경로 정보(`screen-registry.json`)는 바뀌지 않았다 — 16건 모두 이미 등록돼 있었다
- 변경: 이번에 연 16건의 UIUX 상태를 대기중에서 완료로 바꾼다. 응용2 상태와 IA 구조는 그대로다
