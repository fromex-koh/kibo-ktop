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

### 평가결과 전송·신청·제출 확인 팝업 개선

- 대상: src/components/composite/bank-transfer-dialog.tsx
    - src/components/composite/guarantee-application-dialog.tsx
    - src/components/composite/submit-confirm-dialog.tsx
- 변경: 은행전송 결과, 보증신청 완료, 제출 전 최종 확인 흐름과 단독 화면 재사용 인터페이스 및 접근성 마크업 보완
- 결과: 기존 서비스 연동 내용을 유지하면서 변경된 팝업 흐름과 완료 상태를 비교 반영
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0322d71)

### 동의·주소·피인용 팝업 접근성 개선

- 대상: src/components/composite/citation-manual-dialog.tsx
    - src/components/composite/consent-terms-dialog.tsx
    - src/components/composite/postcode-search-dialog.tsx
- 변경: 모달 제목·설명 연결, 단계별 제목 구조와 안내 문구를 접근성 기준에 맞게 보완
- 결과: 기존 팝업 동작을 유지하면서 제목 구조와 스크린리더 안내 변경사항을 비교 반영
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/17025e3)

### 자동저장·완료 토스트 재사용 개선

- 대상: src/components/custom/autosave-toast.tsx
    - src/components/custom/check-toast.tsx
- 변경: 단독 확인 화면과 실제 서비스 흐름에서 같은 토스트를 재사용할 수 있도록 노출 시간과 호출 인터페이스 보완
- 결과: 기존 호출부를 유지하면서 자동저장·완료 알림의 변경사항을 비교 반영
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/7f9dbdc)

### 기관 입력폼 공통 동작 확장

- 대상: src/components/composite/form-tabs-submit.ts
    - src/components/composite/form-values.tsx
    - src/components/composite/self-diagnosis-form-tabs.tsx
    - src/components/composite/self-diagnosis-tabs-form.tsx
- 변경: 사업자·법인번호 형식 검사와 기관용 기업정보 탭 구성을 기존 공통 폼 흐름에서 선택해 사용할 수 있도록 확장
- 추가 변경: 반복 카드의 마지막 항목을 초기화할 때 근무 시작·종료 연월도 함께 비워지도록 폼 날짜 필드를 빈 값에서도 제어 상태로 연결
- 결과: 기존 기업용 폼 동작을 유지하면서 기관 개별평가에 필요한 입력값 처리와 탭 구성 변경사항을 비교 반영
- 함께 적용: 덮어쓰기 카드의 src/components/composite/date-picker.tsx를 먼저 적용한 뒤 이 파일의 추가 변경사항을 반영
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f32b540)
- 추가 수정 커밋: [날짜 초기화 변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e0b9a73)

### 공통 컴포넌트·테마 접근성 보완

- 대상: src/components/composite/career-input-help-dialog.tsx
    - src/components/composite/company-etc-form.tsx
    - src/components/composite/company-info-form.tsx
    - src/components/custom/auth-flow-page.tsx
    - src/content/technology-evaluation/ktrs-fm-checklist.ts
- 변경: 제목 구조와 우편번호 화면 접근성, 법인번호 예시 형식 및 입력 안내 문구 보완
- 결과: 기존 서비스 동작을 유지하면서 공통 컴포넌트와 콘텐츠 변경사항을 비교 반영
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/cbcbc29)

## [덮어쓰기]

### 날짜 선택 컴포넌트

- 대상: src/components/composite/date-picker.tsx
- 적용: 폼에서 날짜 값을 초기화할 때 이전 선택값이 다시 노출되지 않도록 빈 값도 제어 상태로 유지하는 최신 날짜 선택 컴포넌트로 교체

### 퍼블리싱 인덱스 화면

- 대상: src/components/custom/publishing-index.tsx
- 적용: 화면 높이·스크롤 구조, 기업·기관 IA 버전 배지와 미사용 보조 색상, 소계 뎁스 표시, 빨간색 꺾쇠 항목 표시를 포함한 최신 퍼블리싱 인덱스 화면으로 교체

### 퍼블리싱 인덱스 관리 데이터

- 대상: src/constants/publishing-guide.ts
    - src/content/publishing-guide/index.ts
    - src/content/publishing-guide/types.ts
    - src/content/publishing-guide/asset-versions.generated.json
    - src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.generated.json
    - src/content/publishing-guide/screen-registry.json
- 적용: 기업 152건·기관 116건 IA 구조, IA 버전 26/07/31, 소계·삭제 항목 표시 규격, 화면 레지스트리와 screenId 검증 데이터를 포함한 최신 퍼블리싱 인덱스 상수·타입·관리 데이터로 교체

### 기업 KTRS-FM 기존 팝업 확인 페이지

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/additional-company-info/technology-definition/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/additional-company-info/transaction-type-guide/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/citation-manual/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/restricted-industries/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/trl-guide/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/company-info/industry-code-search/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/complete/bank-transfer/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/complete/guarantee-application/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/consent-popup/customer-consent-popup.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/detail/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/final-review/page.tsx
- 적용: 기존 팝업 UI와 동작은 유지하고, 단독 확인 화면의 안내 문구·배경 구성·접근성 마크업을 포함한 최신 페이지로 교체

### 컴포넌트 가이드·디자인 토큰

- 대상: src/app/component-guide/(guide)/contrast-check/page.tsx
    - src/app/component-guide/(guide)/form-card/page.tsx
    - src/app/component-guide/(guide)/input/input-form-demo.tsx
    - src/app/component-guide/(guide)/input/page.tsx
    - src/app/component-guide/(guide)/semantic-color/page.tsx
    - tokens.json
- 적용: 법인번호 예시 형식과 파일 업로드 완료 색상 토큰이 반영된 최신 컴포넌트 가이드 및 디자인 토큰 원본으로 교체

### 버튼·옵션 카드 테마

- 대상: src/components/theme/button.variants.ts
    - src/components/theme/option-card.variants.ts
- 적용: 버튼 크기 체계와 모바일 옵션 카드 배치가 반영된 최신 프로젝트 테마 variant로 교체

## [신규 추가]

### 기관 개별평가 KTRS-FM 진행방식 선택 화면

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/selection/page.tsx
- 적용: 신규 파일 추가. [평가검증 하기]는 마이페이지 > 평가검증 신청 조회, [개별평가 하기]는 개별평가 > KTRS-FM > (1) 고객정보활용동의로 이동하는 옵션 카드 화면

### 작성 취소·이어서 작성 팝업과 확인 화면 안내

- 대상: src/components/composite/cancel-confirm-dialog.tsx
    - src/components/composite/resume-notice-dialog.tsx
    - src/components/custom/popup-preview-note.tsx
- 적용: 작성 중 이탈 확인, 이어서 작성 안내와 팝업 단독 확인 화면 설명을 위한 신규 컴포넌트 추가

### 품목설명 팝업 데이터 패키지

- 대상: src/components/composite/item-description-dialog.tsx
    - src/content/service/item-descriptions.ts
- 적용: 품목설명 선택 팝업과 표시 데이터를 신규 파일로 추가

### 기업 KTRS-FM 팝업 단독 확인 경로

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/additional-company-info/autosave
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/checklist/cancel-confirm
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/complete/bank-transfer/transfer-complete
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/complete/guarantee-application/application-complete
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/customer-consent/resume-notice
- 적용: 자동저장, 작성 취소, 은행전송 완료, 보증신청 완료, 이어서 작성 안내를 각각 직접 확인할 수 있는 신규 페이지 경로 추가

### 기업 Tech-Index 일반용·창업용 팝업 경로

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup
- 적용: 일반용·창업용 각각 주소 찾기, 자동저장, 작성 취소, 업종코드 조회, 품목설명, 필수/선택 동의 팝업, 개별 상세 보기, 이어서 작성 안내, 제출 전 최종 확인을 직접 확인할 수 있는 신규 페이지 경로 18개 추가

### 기업 투자모형 팝업 경로

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model
- 적용: 거래유형 설명, 전문기술/숙련기술 정의, 자동저장, 작성 취소, 피인용 확인 메뉴얼, 보증제한 업종, TRL 확인, 주소 찾기, 업종코드 조회, 필수/선택 동의 팝업, 개별 상세 보기, 이어서 작성 안내, 제출 전 최종 확인을 직접 확인할 수 있는 신규 페이지 경로 13개 추가

### 기업 마이페이지 팝업 경로

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/mypage
- 적용: 평가결과 조회의 은행전송·은행전송 완료·보증신청·보증신청 완료, 내 정보의 업종코드 조회·주소 찾기, 대표자 이력의 필수/선택 동의 팝업·개별 상세 보기를 직접 확인할 수 있는 신규 페이지 경로 8개 추가

### 기관 개별평가 화면

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation
- 적용: 기관 개별평가의 KTRS-FM 18개, 투자모형 6개, Tech-Index 3개를 직접 확인할 수 있는 신규 화면 및 팝업 경로 총 27개 추가

### 기관 입력폼 신규 컴포넌트·유틸

- 대상: src/components/composite/file-upload.tsx
    - src/components/composite/org-company-info-form.tsx
    - src/lib/business-number.ts
    - src/lib/corporate-number.ts
- 적용: 기관 고객정보활용동의의 파일 첨부, 기관 기업정보 직접 입력, 사업자번호·법인번호 형식 처리를 위한 신규 공통 컴포넌트와 유틸 추가

### 파일 업로드 컴포넌트 가이드

- 대상: src/app/component-guide/(guide)/file-upload/page.tsx
- 적용: 파일 선택·드래그 앤 드롭·업로드 완료·오류 상태를 확인할 수 있는 신규 컴포넌트 가이드 페이지 추가

### 기관 마이페이지 내 정보 조회 팝업 경로

- 대상: src/app/(user-type)/org/(service)/(logged-in)/mypage/profile-edit/address-search/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/profile-edit/industry-code-search/page.tsx
- 적용: 기관 마이페이지의 내 정보 수정 화면에서 주소 찾기와 업종코드 조회 팝업을 직접 확인할 수 있는 신규 페이지 경로 2개 추가
