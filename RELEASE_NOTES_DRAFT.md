# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.
frontend-handoff에 실제 전달되는 파일의 변경만 작성하세요.
프로젝트 서비스 페이지가 아닌 퍼블리싱 가이드 관련 파일은 [덮어쓰기]로 분류하세요.

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

### [마크업/스타일] 기관 고객정보활용동의 — 동의서 양식 다운로드 버튼 추가

- 대상: src/components/composite/org-customer-consent-form.tsx
- 관련 화면(퍼블리싱 인덱스 UIUX 보완 뱃지):
    - [기관 KTRS-FM 고객정보활용동의](/org/individual-evaluation/ktrs-fm/customer-consent) — 보완(09/08)
    - [기관 Tech-Index 일반용 고객정보활용동의](/org/individual-evaluation/tech-index/general/customer-consent) — 보완(09/08)
    - [기관 Tech-Index 창업용 고객정보활용동의](/org/individual-evaluation/tech-index/startup/customer-consent) — 보완(09/08)
    - [기관 투자모형 고객정보활용동의](/org/individual-evaluation/investment-model/customer-consent) — 보완(09/08)
- 적용: `OrgCustomerConsentForm`의 `FormCard` 한 곳에 `action` 을 추가한 변경을 Diff로 반영합니다.
- 변경: [정보이용동의서 업로드] 카드 제목 오른쪽에 [동의서 양식 다운로드] 버튼을 두었습니다. 일괄평가 신청 화면의 같은 버튼과 동일한 `variant="secondary" size="xs"` 입니다.
- 연동 확인: 아직 동작이 없는 버튼입니다. 양식 파일 경로가 정해지면 `// [프론트엔드 연동]` 주석 자리에 연결합니다.
- 유지: 동의 여부 라디오·파일 업로드 정책(PDF·ZIP·RAR·7Z, 50MB)·제출 검사·다음 단계 이동은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/745ea52041bf3169846279e0d360f00e0422bef0)

### [마크업/스타일] 기술 인력 현황 — 동업종 종사경력을 년·개월 두 칸으로 통일

- 대상:
    - src/components/composite/self-diagnosis-form-tabs.tsx
    - src/components/composite/tech-staff-form.tsx
    - src/components/composite/form-fields.tsx
- 관련 화면(퍼블리싱 인덱스 UIUX 보완 뱃지):
    - [기업 Tech-Index 일반용 기업·기술정보 입력](/corp/technology-evaluation/tech-index/general/company-technology-info) — 보완(09/08)
    - [기업 Tech-Index 창업용 기업·기술정보 입력](/corp/technology-evaluation/tech-index/startup/company-technology-info) — 보완(09/08)
    - [기관 Tech-Index 일반용 기업·기술정보 입력](/org/individual-evaluation/tech-index/general/company-technology-info) — 보완(09/08)
    - [기관 Tech-Index 창업용 기업·기술정보 입력](/org/individual-evaluation/tech-index/startup/company-technology-info) — 보완(09/08)
- 적용: 세 파일을 함께 Diff로 반영합니다. 탭 설정·인력 카드·필드 행 세 곳의 변경이 한 묶음입니다.
- 입력 칸 변경: Tech-Index 일반용·창업용 탭에 `showIndustryCareerMonth` 를 켜고 창업용의 `industryCareerUnit="년"` 을 지웠습니다. 제출값이 한 칸(`staff-N-industryCareer`)에서 두 칸(`+ staff-N-industryCareerMonth`)으로 늘어납니다. KTRS-FM·투자모형은 이미 두 칸이라 변화가 없습니다.
- 3열 줄 보완: 일치여부 칸이 있는 줄(창업용)이 한 칸 변형만 그리고 있어 두 칸 변형도 쓰도록 고쳤습니다. 이 수정이 없으면 창업용은 오히려 글자 한 칸으로 되돌아갑니다.
- 태블릿 배치: 그 줄만 `md:grid-cols-2 xl:grid-cols-3` 으로 둡니다. 세 칸으로 나누면 [전공과 평가대상 기술 분야 일치여부] 라벨이 두 줄로 접혀 그 칸의 셀렉트만 한 줄 아래로 내려갑니다. `FieldRow3` 는 `className` 만 받도록 넓혔고 기본값은 `md:grid-cols-3` 그대로라 다른 화면·다른 줄은 영향이 없습니다.
- 유지: 라벨 문구·숫자만 입력·앞자리 0 정리·빈 칸을 벗어나면 0 복원·시안 폭(xl)의 3열 배치는 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/36479e2336fdb87c90023079ab9ed1febb9b010f)

## [덮어쓰기]

### 퍼블리싱 인덱스 — UIUX 뱃지에 상태 변경일 표시

- 대상:
    - src/content/publishing-guide/types.ts
    - src/content/publishing-guide/index.ts
    - src/components/custom/publishing-index.tsx
    - src/content/publishing-guide/publishing-index.json
- 적용: 네 파일을 함께 덮어씁니다.
- 표시: 화면에 `statusDate` 가 있으면 UIUX 뱃지를 `보완(09/08)` 처럼 상태 뒤에 날짜를 붙여 그립니다. 없으면 이전과 같이 상태만 나옵니다.
- 데이터: 상태값 자체는 `보완` 그대로이고 날짜는 `statusDate` 라는 별도 값입니다. `"09/08"` 형태(MM/DD)가 아니면 빌드가 멈춥니다.
- 진척률: 완료 수를 세는 기준(`완료`·`최종완료`·`보완`)이 그대로라 수치가 바뀌지 않습니다. 전체 309/403 으로 변경 전과 같습니다.
- 상태 변경: 오늘 화면이 바뀐 8개를 완료에서 보완으로 옮기고 `09/08` 을 붙였습니다(기관 고객정보활용동의 4개 · Tech-Index 기업·기술정보 입력 4개). 기존 보완 24개에는 `09/07` 을 붙였습니다.
- 유지: 상태 범례의 `보완` 은 상태 종류를 설명하는 자리라 날짜 없이 둡니다. 응용2 상태·버전·링크는 손대지 않았습니다.
- 상태 변경 커밋: [뱃지 날짜 표시와 8개 화면 상태 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/5ee874912bcb82c5dee8430d9ed6c94f0d971613)
