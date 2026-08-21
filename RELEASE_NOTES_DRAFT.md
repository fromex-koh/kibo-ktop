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

## [Diff 확인]

### KTRS-FM 2단계 — 체크리스트 이동 경로 되돌림

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/company-technology-info/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/company-technology-info/page.tsx
- 변경: 업종코드를 보고 갈 곳을 정하던 얇은 클라이언트 조각(`checklist-step-form`) 사용을 걷어내고, 탭 폼(`SelfDiagnosisTabsForm`)에 체크리스트 경로를 문자열로 다시 넘김. 기관 화면은 기관용 탭 구성(`ORG_SELF_DIAGNOSIS_FORM_TABS`)을 화면에서 직접 넘긴다
- 결과: [다음]을 누르면 업종코드와 관계없이 `/…/ktrs-fm/checklist` 한 화면으로 간다
- 유지: 업종코드 공통 상수(`industryCode`·`isManufacturingIndustryCode`), 기업정보 탭의 숨은 입력, 함수형 `nextHref` 는 그대로 둔다 — 투자모형(기업·기관)이 계속 쓴다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e4025236ddb6d49271d917ceb2a85a989b9ce245)

### 체크리스트 문항 — 제조·서비스 배지 삭제·보증제한 업종 안내 연결

- 대상: src/components/composite/checklist-form.tsx
    - src/content/technology-evaluation/ktrs-fm-checklist.ts
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/restricted-industries/page.tsx
- 변경: 생산과정·원자재 수급 문항에 붙던 제조·서비스 배지(문항 데이터의 `sector` 와 `SECTOR_BADGE`)를 걷어내고, 여러 줄로 갈리는 문항(`check-list`)이 줄마다 안내 버튼을 가질 수 있도록 문항 유형을 넓혀 창업 경력 (1) 줄에 [보증제한 업종] 모달을 연결. 보증제한 업종 단독 화면은 주석만 갱신
- 결과: 한 화면에 제조·서비스 문장이 함께 놓여도 문장이 대상을 밝히므로 배지 없이 읽히고, 퍼블리싱 인덱스에만 있던 보증제한 업종 모달이 체크리스트에서 열린다. 기존 문항 유형의 렌더는 바뀌지 않는다
- 참고: 투자모형 체크리스트 데이터는 `sector` 를 쓰지 않아 표시 변화가 없다
- 커밋: [배지 삭제 변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3785096fbd3d0e1f24a0e5d2fee34b8dcb6ba3d7) [보증제한 업종 연결 변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/86e2c53c231226aa71539f721453ba7226ac2b71)

## [신규 추가]

### 단일 체크리스트 화면 — 기업·기관 KTRS-FM

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/checklist/page.tsx
- 적용: 업종코드로 갈리기 전의 단일 체크리스트 입력 화면을 다시 추가. 문항은 `KTRS_FM_CHECKLIST` 한 벌이며 제출 검사·제출 전 최종 확인 모달·완료 화면 이동은 종전과 같다
- 삭제: 업종코드로 갈린 두 화면과 그 갈림을 판단하던 조각이라 진입 경로가 없어졌다. src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/manufacturing/page.tsx · src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/service/page.tsx · src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/company-technology-info/checklist-step-form.tsx · src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/checklist/manufacturing/page.tsx · src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/checklist/service/page.tsx · src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/company-technology-info/checklist-step-form.tsx 여섯 파일을 함께 삭제해야 한다
- 주의: 추가·삭제와 위 [Diff 확인] 변경은 한 번에 반영해야 한다. 링크 경로가 타입으로 검사되어 한쪽만 반영하면 빌드가 실패한다
- 범위: 투자모형(기업·기관)의 업종코드별 체크리스트 화면은 그대로다. 이번 되돌림은 KTRS-FM 두 모형에만 해당한다

## [덮어쓰기]

### 퍼블리싱 인덱스 — KTRS-FM 체크리스트 화면 구성 되돌림

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체. 세 파일은 반드시 함께 교체해야 한다 — 콘텐츠 관문이 빌드 시점에 두 JSON 의 화면 key 를 양방향으로 교차검증하므로, 하나만 바꾸면 빌드가 실패한다
- 변경: 기업·기관 KTRS-FM 의 (3) 체크리스트 입력이 다시 자기 화면을 갖고, 그 아래 [선택한 업종코드별 페이지] 묶음(업종코드 제조 선택·업종코드 서비스 선택)을 걷어낸다. 화면 경로 레지스트리도 모형마다 2건에서 체크리스트 1건으로 되돌린다
- 범위: 투자모형(기업·기관)의 [선택한 업종코드별 페이지] 묶음은 그대로다
