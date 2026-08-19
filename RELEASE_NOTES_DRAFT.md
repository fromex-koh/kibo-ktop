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

### 퍼블리싱 인덱스 표 행 식별자 개선

- 대상: src/components/custom/publishing-index.tsx
- 변경: 표 행의 React key 를 화면 경로(`path.join(' > ')`) 대신 화면 key 우선(`node.key ?? 경로`)으로 변경
- 결과: 같은 상위 뎁스에 이름이 같은 화면이 여러 개 있어도 행 identity 가 겹치지 않아 필터 전환·정렬 시 행 내용이 섞이지 않음. 화면 key 가 없는 노드는 기존 경로 방식을 그대로 사용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/68d4a78a2e364c69e5fbd4cd71ce422bf64a2c0a)

### Tech-Index 재무정보 연도 카드 계정 정정

- 대상: src/components/composite/tech-index-finance-form.tsx
- 변경: 연도 카드 여덟 번째 칸의 이름을 [복리후생비] 에서 [연구개발비 (손익계산서)] 로 바로잡고, 값 이름도 출처를 따라 정리(welfareExpense2 → incomeStatementResearchDevelopmentCost, researchDevelopmentCost → manufacturingResearchDevelopmentCost)
- 결과: 한 해 카드에 [복리후생비] 가 두 번 나오던 중복이 사라지고, 연구개발비가 제조원가명세서·손익계산서 두 칸으로 구분됨. 재무정보 탭을 쓰는 기업·기관 Tech-Index 일반/창업 네 화면에 함께 반영
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6323aafb61b4e57b3aa9c8c2ffc2372dd6efc613)

### 업종코드 조회 목록을 외부 데이터로 분리

- 대상: src/components/composite/industry-code-dialog.tsx
- 변경: 컴포넌트 안에 배열로 적혀 있던 업종코드 목록을 걷어내고 `@/content/technology-evaluation/industry-codes.json` 을 읽도록 변경
- 결과: 화면 코드와 코드값이 분리되어 업종 분류가 개정되면 JSON 만 교체하면 된다. 모달을 쓰는 쪽(`onSelect` 로 `{code, label}` 을 받는 계약)은 그대로라 기업정보 탭을 가진 화면들은 수정 대상이 아니다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b8450ee6799b48cfbcf442797dc42c7d8f461aed)

### 업종코드별 체크리스트 분기 — 2단계 화면과 공통 폼

- 대상: src/constants/technology-evaluation.ts
    - src/components/composite/company-info-form.tsx
    - src/components/composite/org-company-info-form.tsx
    - src/components/composite/self-diagnosis-tabs-form.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/company-technology-info/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/company-technology-info/page.tsx
- 변경: 업종코드 값 이름(`industryCode`)과 제조 판정(KSIC 중분류 10~34)을 공통 상수로 추가하고, 기업정보 탭이 조회로 고른 코드를 숨은 입력으로 함께 제출하도록 보완. 탭 폼의 `nextHref` 가 문자열뿐 아니라 "입력값을 받아 갈 곳을 돌려주는 함수"도 받도록 넓히고, 두 2단계 화면은 폼을 얇은 클라이언트 조각(checklist-step-form)으로 감싸 그 판단을 넘김
- 결과: [다음]을 누르면 기업정보 탭에서 고른 업종코드에 따라 제조용·서비스용 체크리스트로 갈린다. 서버 화면에서 클라이언트로 함수를 넘길 수 없어 판단을 조각으로 분리했으므로, 연동 시 판정 기준만 `isManufacturingIndustryCode` 에서 고치면 네 모형에 함께 반영된다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f1762e20e2a6ca619aa073c9647d16a96ff91fb4)

### 체크리스트 문항에 보기 선택(체크 후 칩) 추가

- 대상: src/components/composite/checklist-form.tsx
- 변경: 문항 유형에 `check-chips` 를 추가. 체크했을 때만 보기 칩 묶음이 펼쳐지는 문항을 그린다
- 결과: 업종코드별 체크리스트의 "해당 항목을 고르세요" 형태 문항이 기존 체크·선택 문항과 같은 데이터 구조로 표현된다. 기존 문항 유형의 렌더는 바뀌지 않아 KTRS-FM 기존 체크리스트에 영향 없음
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f1762e20e2a6ca619aa073c9647d16a96ff91fb4)

### 투자모형 탭을 위한 공통 폼 조각 확장

- 대상: src/components/composite/company-etc-form.tsx
    - src/components/composite/tech-staff-form.tsx
    - src/components/composite/tech-index-management-form.tsx
    - src/components/composite/self-diagnosis-form-tabs.tsx
- 변경: 기업 기타 정보의 구획·수량 칸 조각을 다른 모형이 쓸 수 있도록 내보내고 필수 표시와 라벨 없는 칸을 옵션으로 지원. 기술 인력 카드는 [구분] 칸을 끄는 옵션과 동업종 경력을 [년·개월] 두 칸으로 받는 옵션을 추가. 경영진 카드는 안내 문장을 모형별로 바꿀 수 있게 함. 탭 목록에 투자모형 여섯 탭 구성을 추가
- 결과: 모형마다 조금씩 다른 항목을 조각 복사 없이 옵션으로 표현한다. 기본값이 기존 동작이라 KTRS-FM·Tech-Index 화면의 렌더는 바뀌지 않는다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/00b61d0d5bc7e2eb7e1411ab40d512e799a4306b)

### 기관 개별평가 공통 폼의 위치 이동과 동의 거부 안내 추가

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/customer-consent/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/customer-consent-screen.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/evaluation-application-screen.tsx
- 변경: 고객정보활용동의 폼과 평가 신청하기 폼이 KTRS-FM·Tech-Index 폴더 안에 있어 import 경로가 모형을 가로지르고 있었다. 두 폼을 `@/components/composite` 로 옮기고 세 화면의 import 경로만 교체
- 결과: 화면 렌더와 동작은 그대로이며 import 경로만 바뀐다. 다른 모형이 같은 폼을 쓸 때 남의 모형 폴더를 참조하지 않는다
- 함께: 고객정보활용동의에서 [아니요] 를 고르면 "정보제공 동의를 받지 않은 경우, 평가 진행이 제한될 수 있습니다. 반드시 사전에 동의를 획득하시기 바랍니다." 안내가 물음 아래에 나온다. Tech-Index 에만 있던 문구를 세 모형이 같은 절차이므로 공통으로 올렸다. 고르기 전에는 나오지 않는다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5c2e6a49e405036f0504693f5927a51725949b4c)

### 퍼블리싱 인덱스 표에 뎁스로 세지 않는 묶음 지원

- 대상: src/content/publishing-guide/types.ts
    - src/content/publishing-guide/index.ts
    - src/components/custom/publishing-index.tsx
- 변경: IA 노드에 `isGroupOnly` 옵션을 추가하고 콘텐츠 검증에 boolean 타입 검사를 더했다. 표는 이 옵션이 붙은 행의 뎁스 배지를 숨기고, 그 아래 화면들의 뎁스 번호를 셀 때도 그 행을 빼고 센다
- 결과: 실제 계층이 아니라 보기 좋게 묶기만 한 행(예: 페이지 두 갈래를 모달 목록과 구분하려고 묶은 "선택한 업종코드별 페이지")을 표에 둘 수 있고, 그 아래 화면이 원래 뎁스 번호를 그대로 유지한다. 옵션을 쓰지 않은 기존 IA 데이터의 뎁스 번호는 바뀌지 않는다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fe52277407cd5cee5b0b8c7209eb64a54395f39a)

## [신규 추가]

### 기관 투자모형 1~5단계 화면

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/investment-model/customer-consent/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/investment-model/company-technology-info/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/investment-model/company-technology-info/checklist-step-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/investment-model/checklist/manufacturing/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/investment-model/checklist/service/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/investment-model/evaluation-application/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/investment-model/complete/page.tsx
- 적용: (1) 고객정보활용동의부터 (5) 완료 화면까지 신규 추가. 기업 투자모형과 달리 평가 신청하기가 있어 다섯 단계다
- 화면: 1단계와 4단계는 기관 공통 폼을 그대로 쓴다(동의 묶음 · 첨부 서류 세 종). 2단계는 탭 여섯 개이며 기업정보 탭만 기관용이고(평가 대상 기업 정보를 직접 입력, 기업형태에 따라 법인번호·기업명 표기가 갈림, [기업 담당자 정보] 구획 없음) 나머지 다섯 탭은 기업 투자모형 것을 그대로 쓴다. 3단계 체크리스트는 2단계에서 고른 업종코드로 제조용·서비스용이 갈리고, 5단계 완료 화면은 모형 코드 뱃지 없이 안내가 두 줄이다
- 주의: 링크 경로가 타입으로 검사되므로 일곱 파일을 한 번에 반영해야 한다. 2단계와 체크리스트가 서로를 가리켜, 나눠 넣으면 어느 쪽을 먼저 넣어도 빌드가 실패한다

### 기관 개별평가 공통 폼

- 대상: src/components/composite/org-customer-consent-form.tsx
    - src/components/composite/evaluation-application-form.tsx
- 적용: 고객정보활용동의 입력 묶음과 평가 신청하기 첨부파일 묶음을 공통 자리에 신규 추가. 동의 폼은 콘솔에 찍는 이름만 모형별로 받도록 옵션을 두었고, 첨부 폼은 세 서류(대표자 건강보험 자격 득실 확인서 · 4대 사회보험 사업장 가입자 명부 · 특허등록증)가 모형 공통이라 그대로 쓴다
- 삭제: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/customer-consent/org-customer-consent-form.tsx 와 src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/evaluation-application-form.tsx 를 함께 삭제해야 한다. 위 두 파일로 자리를 옮긴 같은 폼이며, 남겨 두면 같은 폼이 두 벌이 된다
- 주의: 추가·삭제와 위 [Diff 확인] 의 import 경로 교체는 한 번에 반영해야 한다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5c2e6a49e405036f0504693f5927a51725949b4c)

### 기업 투자모형 입력 폼

- 대상: src/components/composite/investment-model-company-info-form.tsx
    - src/components/composite/investment-model-representative-capability.tsx
    - src/components/composite/investment-model-company-etc-form.tsx
    - src/components/composite/investment-model-finance-form.tsx
- 적용: 이 모형에만 있는 네 조각 신규 추가. 기업정보는 [기업 담당자 정보] 구획이 없고 회원정보에서 오는 값이 잠긴 채 표시되며 법인일 때만 법인번호가 필수다. 대표자 역량은 최종학력·전공·기술분야 일치여부·기술자격증 네 칸이고 고졸을 고르면 전공이 선택값으로 바뀐다. 기업 기타 정보는 지식재산 11칸을 포함한 10개 구획이며 수량 칸의 처음 값은 0 이다. 재무정보는 당기·전기 금액 다섯 칸이고 필수도 처음 값도 두지 않아, 0 을 그대로 적어도 [작성완료]로 바뀐다

### 기업 투자모형 1~5단계 화면

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/customer-consent/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/company-technology-info/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/company-technology-info/checklist-step-form.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/checklist/manufacturing/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/checklist/service/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/complete/page.tsx
- 적용: (1) 고객정보활용동의부터 (5) 완료 화면까지 신규 추가. 2단계는 탭 여섯 개(기업정보 · 대표자 역량 및 경력사항 · 기업 기타 정보 · 핵심 기술 인력 현황 · 경영진 역량 및 구성 · 재무정보)가 한 화면이고, 3단계 체크리스트는 2단계에서 고른 업종코드로 제조용·서비스용이 갈린다. 완료 화면은 시안에 모형 코드 뱃지가 없고 안내가 두 줄이라 KTRS-FM 완료 화면과 여백 비율이 다르다

### 업종코드별 체크리스트 문항 데이터

- 대상: src/content/technology-evaluation/industry-checklist.ts
- 적용: 제조용·서비스용 체크리스트 문항을 함께 담은 데이터 파일 신규 추가. 앞부분 공통 문항과 뒷부분 공통 문항은 두 업종이 같고 가운데 [생산 방식](자체생산·외주생산) 분기만 다르므로, 한 벌의 뼈대에 자체생산 문항만 갈아 끼워 두 벌을 만든다. 연동 시 같은 모양의 API 응답으로 교체한다

### 업종코드별 체크리스트 화면 — 기업·기관 KTRS-FM

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/manufacturing/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/service/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/company-technology-info/checklist-step-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/checklist/manufacturing/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/checklist/service/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/company-technology-info/checklist-step-form.tsx
- 적용: 체크리스트 입력 화면을 업종코드별 두 화면으로 나눠 신규 추가하고, 2단계에서 갈 곳을 정하는 조각을 각 모형에 추가
- 삭제: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/page.tsx 와 src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/checklist/page.tsx 를 함께 삭제해야 한다. 업종코드로 갈리기 전의 단일 체크리스트 화면이며, 이제 진입 경로가 없다
- 주의: 추가·삭제·위 [Diff 확인] 변경은 한 번에 반영해야 한다. 링크 경로가 타입으로 검사되어 한쪽만 반영하면 빌드가 실패한다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f1762e20e2a6ca619aa073c9647d16a96ff91fb4)

### 업종코드 조회 목업 데이터

- 대상: src/content/technology-evaluation/industry-codes.json
- 적용: 한국표준산업분류(KSIC) 중분류 77개와 그 하위 1,205개를 담은 데이터 파일 신규 추가. 연동 시 업종코드 조회 API 응답으로 교체할 자리이며, 지금은 조회 모달과 다음 단계의 제조·서비스 체크리스트 분기가 이 값을 사용한다

### 기업 KTRS-FM·투자모형 기업기타정보 부가 화면

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/additional-company-info/cancel-confirm/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/additional-company-info/autosave/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/additional-company-info/cancel-confirm/page.tsx
- 적용: 기업 KTRS-FM 기업기타정보의 [작성 취소] 화면과 기업 투자모형 기업기타정보의 자동저장·[작성 취소] 화면 경로 신규 추가. 작성 취소는 KTRS-FM 체크리스트의 공통 확인 다이얼로그를, 자동저장은 KTRS-FM 기업기타정보의 공통 토스트를 재수출하는 얇은 page 라 별도 구현 파일 없음

### 기관 개별평가 부가 화면

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/ 4개 (additional-company-info 자동저장·작성 취소, checklist 작성 취소, company-technology-info 이어서 작성 안내)
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/investment-model/ 5개 (additional-company-info 자동저장·작성 취소, checklist 자동저장·작성 취소, 제출 전 최종 확인)
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/general/ 및 startup/ 6개 (company-info 자동저장·작성 취소, company-technology-info 이어서 작성 안내)
- 적용: 기관 개별평가 세 모형(KTRS-FM·투자모형·Tech-Index 일반/창업)에 자동저장·작성 취소·이어서 작성 안내·제출 전 최종 확인 화면 경로 15개 신규 추가. 모두 기업 화면 또는 기관 KTRS-FM 화면의 공통 다이얼로그·토스트를 재수출하는 얇은 page 라 별도 구현 파일 없음

### 기관 일괄평가 Tech-Index 선택·제출전 최종확인 화면

- 대상: src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/tech-index-selection/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/general/batch-evaluation-request/final-review/page.tsx
- 적용: IA 에서 분리된 (1) Tech-Index 선택 화면과 일괄평가 진행 신청의 [제출전 최종확인] 화면 신규 추가. 두 화면 모두 새 UI 없이 기존 화면·공통 모달에 경로만 연결한다
- 화면: Tech-Index 선택은 평가모형(혁신성장지수 일반·창업)과 진행할 업무(평가내역조회·일괄평가 진행)를 한 화면에서 고르는 기존 일괄평가 선택 화면을 그대로 재수출. 제출전 최종확인은 [신청]이 검사를 통과하면 뜨는 확인 팝업으로, 공통 SubmitConfirmDialog 를 열어 둔 모달 단독 확인 화면이라 별도 신규 컴포넌트 없음

## [덮어쓰기]

### 퍼블리싱 인덱스 IA 갱신 — FO IA V1.21_260818·응용2팀 진척 상태·업종코드별 체크리스트·기관 투자모형

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체. 세 파일은 반드시 함께 교체해야 한다 — 콘텐츠 관문(src/content/publishing-guide/index.ts)이 빌드 시점에 두 JSON 의 화면 key 를 양방향으로 교차검증하므로, 하나만 바꾸면 빌드가 실패한다
- 변경: 기업 155건·기관 147건 기준으로 IA 트리와 화면 경로 레지스트리를 갱신. 화면명 정정(기술평가 → 기술평가 소개, 입력도우미 → 입력도움말 등), 단계 번호 재정렬, 기관 개별평가·일괄평가 화면 추가와 삭제 항목 정리 포함
- 상태: 응용2팀 화면 진척 상태(application2Status) 62건을 함께 반영. 완료 처리 59건(미설정 → 완료 53, 진행중 → 완료 6)과 진행중 전환 3건이며, 퍼블리싱 인덱스의 응용2 진척률과 표의 응용2 상태가 이 값으로 갱신된다
- 분리: 업종코드별로 갈리는 체크리스트를 네 모형(기업·기관 KTRS-FM, 기업·기관 투자모형)에 반영. 각 모형의 (3) 체크리스트 입력 한 행을 [업종코드 제조 선택]·[업종코드 서비스 선택] 두 행으로 나누고, 두 행을 [선택한 업종코드별 페이지] 묶음 아래에 둔다. 이 묶음은 아래 모달 목록과 구분하기 위한 것이라 뎁스 번호를 차지하지 않는다(isGroupOnly — 표가 이 옵션을 읽으려면 같은 릴리스의 [Diff 확인] 항목이 함께 반영되어야 한다)
- 추가: 기관 투자모형 (1) 고객정보활용동의 ~ (5) 완료 화면의 항목과 경로를 채웠다. 화면 leaf 는 302건에서 306건이 된다
- 정정: K-BIGx 혁신성장리포트 하위 다섯 행(기업정보 수집제공 근거 · 이용약관 · 마케팅 알림 수신동의 · 이용권구매 안내 · 조회횟수 차감안내)이 없어진 화면의 key 를 물려쓰고 있어, 표에 남의 경로와 화면명이 붙어 있었다. 다섯 행에 제 key·경로·화면명을 부여했다. 그중 [조회횟수 차감안내]는 작업하지 않은 화면인데 [완료]로 표시되던 것을 [대기중]으로 되돌렸다
- 완료: 이번 릴리스에서 만든 화면을 완료 처리해 퍼블리싱 완료가 172건에서 184건이 된다(업종코드별 체크리스트 8건, 기업 투자모형 3건, 기관 투자모형 5건 등). 표의 화면 경로 상태는 page 파일 존재 여부로 자동 계산되며 구현 189건이다
