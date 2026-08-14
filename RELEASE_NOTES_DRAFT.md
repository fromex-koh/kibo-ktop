# 다음 릴리스 변경사항

## [Diff 확인]

### Tech-Index 폼 상태·제출 연동 기반

- 대상: src/components/composite/form-values.tsx
    - src/components/composite/form-tabs-submit.ts
    - src/components/composite/self-diagnosis-tabs-form.tsx
    - src/components/custom/customer-consent-agreement.tsx
- 변경: 탭 간 폼 값 보관, blur 형식 검사, 필드 오류 설정, 특허번호 입력, 이메일 검증 문구, 탭 제출 흐름과 고객정보 활용동의 상태 처리 보완
- 결과: 프론트엔드의 기존 폼·API 연동 로직은 유지하고 변경된 입력 검증과 제출 흐름을 비교 반영
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/aa3c88cfa89808f31771f1c0b7ab148b504d03a5)

### Tech-Index 2단계 탭 구성 연동

- 대상: src/components/composite/self-diagnosis-form-tabs.tsx
- 변경: Tech-Index 일반용 6개·창업용 7개 탭의 본문 컴포넌트, 기술인력 입력 옵션과 화면별 기본값 구성을 연결
- 결과: 기존 KTRS-FM·기관 탭 구성을 유지하면서 Tech-Index 일반용·창업용의 기업·기술정보 입력 흐름을 비교 반영
- 커밋 단위: 이 파일만 단독 적용할 수 없으며, 신규 추가 카드의 탭 본문 컴포넌트 7개와 일반용·창업용 화면 2개를 포함한 총 10개 파일을 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/064f15d)

### 평가모형·고객동의 경로 연결

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/selection/page.tsx
- 변경: KTRS-FM 고객동의 완료 후 기업·기술정보 화면으로 이동하는 경로와 Tech-Index 일반용·창업용 평가모형 카드의 고객동의 화면 링크 연결
- 결과: 기존 동의·평가모형 선택 화면을 유지하면서 각 평가 흐름의 실제 다음 화면 경로를 비교 반영
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/de2ac9e)

## [덮어쓰기]

### Tech-Index 공통 폼 UI·입력 규칙

- 대상: src/components/composite/form-card.tsx
    - src/components/composite/repeat-card.tsx
    - src/components/theme/form-tabs.variants.ts
    - src/components/composite/career-form.tsx
    - src/components/composite/company-etc-form.tsx
    - src/components/composite/tech-staff-form.tsx
    - src/constants/technology-evaluation.ts
- 적용: 폼 카드와 반복 카드, 반응형 탭 선택기, 대표자 경력·기업 기타정보·기술인력 입력, Tech-Index 기본값과 특허·기술실적 상수를 포함한 최신 공통 폼 기반으로 교체

### 기술분류 모달 테이블 스타일

- 대상: src/components/theme/dialog-table.variants.ts
- 적용: 기술분류·품목설명 모달에서 함께 사용하는 표 셀·헤더 스타일을 최신 규격으로 교체
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2be6fd0)

### 품목설명 모달 및 확인 페이지

- 대상: src/components/composite/item-description-dialog.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/company-info/item-description/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/company-info/item-description/page.tsx
- 적용: 선택 품목의 카테고리 경로와 예시 구조를 표시하는 품목설명 모달, 기업·기관 Tech-Index 단독 확인 페이지를 최신 UI로 교체
- 함께 적용: 신규 추가 카드의 기술분류 데이터·공통 모달·단독 화면과 같은 커밋 단위로 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f6f5813)

### 퍼블리싱 인덱스 화면 상태

- 대상: src/content/publishing-guide/publishing-index.json
- 적용: 기업 Tech-Index 일반용·창업용과 기관 기술분류 화면의 UIUX 진행 상태를 최신 작업 현황으로 교체

## [신규 추가]

### 특허번호 입력·공통 안내 다이얼로그

- 대상: src/lib/patent-number.ts
    - src/components/composite/notice-dialog.tsx
- 적용: 특허번호 2-4-7 자동 포맷·검증 유틸리티와 특허·재무 탭의 처리 결과를 표시하는 공통 안내 다이얼로그 신규 추가

### 기술분류 데이터·공통 모달·단독 화면

- 대상: src/content/service/technology-categories.ts
    - src/components/composite/technology-category-dialog.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/company-info/technology-category/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/company-info/technology-category/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/company-info/technology-category/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/investment-model/company-info/technology-category/page.tsx
- 적용: 기술분류 선택 데이터와 공통 선택 모달, 기업 일반용·창업용 및 기관 Tech-Index·투자모형의 기술분류 단독 확인 화면 신규 추가
- 함께 적용: 덮어쓰기 카드의 품목설명 모달 및 확인 페이지와 같은 커밋 단위로 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f6f5813)

### Tech-Index 2단계 탭 본문·일반용·창업용 화면

- 대상: src/components/composite/tech-index-company-info-form.tsx
    - src/components/composite/tech-index-representative-capability.tsx
    - src/components/composite/tech-index-staff-summary.tsx
    - src/components/composite/tech-index-patent-form.tsx
    - src/components/composite/tech-index-record-form.tsx
    - src/components/composite/tech-index-finance-form.tsx
    - src/components/composite/tech-index-management-form.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/company-technology-info/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/company-technology-info/page.tsx
- 적용: 기업정보·대표자 역량·기술인력 합계·특허·기술실적·재무정보·경영진 역량 탭 본문과 Tech-Index 일반용·창업용 기업·기술정보 입력 화면 신규 추가
- 커밋 단위: Diff 확인 카드의 Tech-Index 2단계 탭 구성 연동 파일을 포함한 총 10개 파일을 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/064f15d)

### 기업 Tech-Index 고객동의·완료 화면

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/customer-consent/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/customer-consent/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/complete/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/complete/page.tsx
- 적용: Tech-Index 일반용·창업용의 고객정보 활용동의와 평가 완료 화면을 각각 신규 추가하고, 평가모형 선택부터 기업·기술정보 입력 및 완료 단계까지 이어지는 경로 구성
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ca2f0cf)

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
