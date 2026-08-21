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

### KTRS-FM 2단계 — 업종코드로 체크리스트 갈래 정하기

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/company-technology-info/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/company-technology-info/page.tsx
- 변경: 탭 폼에 체크리스트 경로를 문자열로 넘기던 것을, 값을 보고 갈 곳을 정하는 얇은 클라이언트 조각(`checklist-step-form`)으로 감싸도록 교체. 기관 화면의 기관용 탭 구성(`ORG_SELF_DIAGNOSIS_FORM_TABS`)은 그 조각이 들고 간다
- 결과: [다음]을 누르면 기업정보 탭에서 고른 업종코드에 따라 제조용·서비스용 체크리스트로 갈린다. 판정 기준(`isManufacturingIndustryCode`, KSIC 중분류 10~34)은 투자모형과 같은 공통 상수라 네 모형이 함께 쓴다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ae3b6cac18c0b717aafc6b6a30ced773a18843ea)

### 컴포넌트 가이드 자가진단 체크리스트 데모 — 제조 한 벌 사용

- 대상: src/app/component-guide/(demo)/self-diagnosis/checklist/page.tsx
- 변경: 데이터 import 를 `KTRS_FM_CHECKLIST` 에서 `KTRS_FM_MANUFACTURING_CHECKLIST` 로 교체. 화면 구성은 종전과 같다
- 결과: 목업 화면이라 업종 갈래 하나만 보여 준다. 문항 데이터가 두 벌로 갈리면서 이름이 바뀐 것을 따라간 것이고, 화면에서 달라지는 것은 생산·제작 과정과 원자재 수급 두 문항이 제조용 문장 한 줄로 보이는 점뿐이다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ae3b6cac18c0b717aafc6b6a30ced773a18843ea)

## [신규 추가]

### 업종코드별 체크리스트 화면·갈래 조각 — 기업·기관 KTRS-FM

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/manufacturing/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/service/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/company-technology-info/checklist-step-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/checklist/manufacturing/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/checklist/service/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/company-technology-info/checklist-step-form.tsx
- 적용: 체크리스트 입력 화면을 업종코드별 두 화면으로 나눠 신규 추가하고, 2단계에서 갈 곳을 정하는 조각을 각 모형에 추가. 두 화면은 제목·단계·이전/다음 흐름이 같고 받는 문항 데이터만 다르다
- 삭제: 업종코드로 갈리기 전의 단일 체크리스트 화면이라 진입 경로가 없어졌다. src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/page.tsx · src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/checklist/page.tsx 두 파일을 함께 삭제해야 한다
- 주의: 추가·삭제와 위 [Diff 확인]·[덮어쓰기] 항목은 한 번에 반영해야 한다. 링크 경로와 데이터 이름이 타입으로 검사되어 한쪽만 반영하면 빌드가 실패한다
- 범위: 투자모형(기업·기관)은 종전과 같다. 이번 분리는 KTRS-FM 두 모형에만 해당하며, 투자모형이 쓰는 `industry-checklist.ts` 는 손대지 않았다

## [덮어쓰기]

### KTRS-FM 체크리스트 문항 데이터 — 업종코드별 두 벌

- 대상: src/content/technology-evaluation/ktrs-fm-checklist.ts
- 적용: 문항 한 벌을 내보내던 파일을 업종코드별 두 벌(`KTRS_FM_MANUFACTURING_CHECKLIST`·`KTRS_FM_SERVICE_CHECKLIST`)을 내보내는 파일로 교체. 문항 글·보기·분기는 종전과 같다
- 변경: 시안에서 업종별로 갈리는 문항은 생산·제작 과정(`q17`)과 원자재 수급(`q18`) 둘뿐이라, 두 문장을 갈래별로 두고 나머지 문항은 한 벌을 두 데이터가 함께 쓴다(투자모형 `industry-checklist.ts` 와 같은 구조). 화면에는 고른 업종의 줄만 남는다
- 이유: 예전에는 두 줄을 한 화면에 함께 두고 제조·서비스 배지로 구분했는데, 배지를 걷어낸 뒤로는 해당 없는 업종의 문항까지 답하게 된다. 값 이름(`q17-manufacturing` 등)은 그대로라 제출 데이터의 모양은 바뀌지 않는다

### 퍼블리싱 인덱스 — KTRS-FM 체크리스트 업종코드별 화면

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체. 세 파일은 반드시 함께 교체해야 한다 — 콘텐츠 관문이 빌드 시점에 두 JSON 의 화면 key 를 양방향으로 교차검증하므로, 하나만 바꾸면 빌드가 실패한다
- 변경: 기업·기관 KTRS-FM 의 (3) 체크리스트 입력 한 행을 [업종코드 제조 선택]·[업종코드 서비스 선택] 두 행으로 나누고, 두 행을 [선택한 업종코드별 페이지] 묶음 아래에 둔다. 이 묶음은 아래 모달 목록과 구분하기 위한 것이라 뎁스 번호를 차지하지 않는다(isGroupOnly). 화면 경로 레지스트리도 모형마다 체크리스트 1건에서 제조·서비스 2건이 된다
- 순서: 위 [신규 추가] 화면과 함께 반영해야 표의 화면 이동 버튼이 실제 화면으로 간다. 화면 없이 인덱스만 반영하면 두 행이 미구현으로 표시된다
- 범위: 투자모형(기업·기관)의 같은 묶음은 종전과 같다
