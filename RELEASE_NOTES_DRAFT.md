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

## [신규 추가]

### RadioCard 컴포넌트

- 대상: src/components/composite/radio-card.tsx
    - src/components/theme/radio-card.variants.ts
    - src/app/component-guide/(guide)/radio-card/page.tsx
- 적용: 카드 전체가 라디오 선택지로 동작하는 선택 카드 컴포넌트와 스타일, [RadioCard](/component-guide/radio-card) 가이드 페이지 신규 추가. hover와 선택 상태가 같은 스타일이며 하나를 필수로 선택해야 다음 단계가 활성화되는 평가모형 선택 화면에서 사용

### 기업 Tech-Index 평가모형 선택 폼

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/selection/tech-index-model-form.tsx
- 적용: 혁신성장지수 (일반)·(창업) 중 하나를 RadioCard 로 선택하고 [다음]으로 이동하는 평가모형 선택 폼 신규 추가. 선택 전에는 [다음]이 비활성화되고, 선택한 모형의 (1) 고객정보활용동의 화면으로 이동

### RadioChip 컴포넌트

- 대상: src/components/composite/radio-chip.tsx
    - src/components/theme/radio-chip.variants.ts
    - src/app/component-guide/(guide)/radio-chip/page.tsx
- 적용: 칩 전체가 라디오 선택지로 동작하는 낮은 높이의 선택 칩 컴포넌트와 스타일, [RadioChip](/component-guide/radio-chip) 가이드 페이지 신규 추가. RadioCard 와 같은 hover·선택 스타일(파란 테두리·연한 파란 배경)을 공유하며, 기관 일괄평가의 진행할 업무 선택처럼 카드보다 가벼운 선택 UI 에 사용

### 기관 KTRS-FM 진행방식 선택 폼

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/selection/evaluation-method-form.tsx
- 적용: [평가검증 하기]·[개별평가 하기] 중 하나를 RadioCard 로 선택하고 [다음]으로 이동하는 진행방식 선택 폼 신규 추가. 선택 전에는 [다음]이 비활성화되고, 평가검증은 마이페이지 > 평가검증 신청 조회로, 개별평가는 (1) 고객정보활용동의로 이동

### FileUploadField·FileUploadResult 컴포넌트

- 대상: src/components/composite/file-upload-field.tsx
    - src/components/composite/file-upload-result.tsx
    - src/lib/file.ts
    - src/app/component-guide/(guide)/file-upload/file-upload-result-demo.tsx
- 적용: 기존 공통 FileUpload 와 독립된 업로드 필드 컴포넌트 신규 추가. 선택 전 박스·업로드 성공·오류 세 상태를 가지며, 성공·오류 결과 패널(FileUploadSuccess·FileUploadError)에 다운로드 버튼을 제공. 오류는 첨부 정책 위반과 표준 양식 포맷 위반(hasFormatError, 행·열 오류 목록) 두 케이스를 지원하고 파일 용량은 formatFileSize 유틸로 표기. [FileUpload / Field / Result](/component-guide/file-upload) 가이드에 사용법·문구 규칙 추가
- 참고: 기존 공통 FileUpload 를 쓰는 화면은 영향 없음

### AttachField 컴포넌트

- 대상: src/components/composite/attach-field.tsx
    - src/app/component-guide/(guide)/attach-field/page.tsx
- 적용: 라벨·첨부 버튼·선택된 파일(삭제 버튼 포함)·안내 문구를 한 줄로 배치하는 첨부 필드 컴포넌트와 [AttachField](/component-guide/attach-field) 가이드 페이지 신규 추가. 기관 Tech-Index 평가 신청하기 화면의 첨부서류 입력에 사용

### 기관 Tech-Index 일반/창업 플로우 화면 일체

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/model-meta.ts
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/selection/tech-index-model-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/ 공용 스크린 7개 (customer-consent·company-technology-info·evaluation-application·final-review·complete 스크린과 evaluation-application-form·final-review-confirm)
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/general/ 및 startup/ 전체
- 적용: 기관 개별평가 Tech-Index 를 일반용/창업용 두 경로로 분리해 전체 플로우를 신설. 제목·완료 문구·경로는 model-meta 가 모형별로 결정하고("혁신성장지수 (일반)/(창업)" + Tech-Index 뱃지), 얇은 page 가 공용 스크린에 model 만 넘기는 구조. 플로우는 (1) 고객정보활용동의 → (2) 기업·기술정보 입력(이어서 작성 안내 포함) → (3) 평가 신청하기(AttachField 첨부서류) → 제출 전 최종 확인 모달 → (4) 제출 완료

### 기관 일괄평가 플로우 화면 일체

- 대상: src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/ 전체
    - page.tsx(1단계 선택)·batch-model-meta.ts·폼 3종(batch-evaluation-form·bulk-data-request-form·batch-evaluation-request-form)·스크린 4종
    - general/ 및 startup/ 분기 페이지 전체(대량정보 조회 신청 + 제출 전 최종 확인·신청 완료·일괄평가 진행 신청·신청 완료)
- 적용: 기관 일괄평가 플로우 신설. 1단계에서 Tech-Index 평가모형(일반/창업, RadioCard)과 진행할 업무(대량정보 조회/일괄평가 진행, RadioChip)를 모두 선택해야 [다음]이 활성화되고, 선택에 따라 일반용/창업용 분기 경로로 이동. 2단계는 평가내역조회용 표준엑셀·개인정보활용동의서를 FileUploadField 로 업로드하고(표준 양식 포맷 오류 케이스 지원) 유효성 통과 시 제출 전 최종 확인 모달을 거쳐 신청 완료로 이동. 화면 제목은 batch-model-meta 가 "혁신성장지수 평가 (일반/창업) Tech-Index" 로 결정

## [Diff 확인]

### 컴포넌트 가이드 내비게이션 항목 추가·정리

- 대상: src/constants/publishing-guide.ts
- 변경: Composite 컴포넌트 그룹에 RadioCard·RadioChip·AttachField 가이드 링크 각 1줄 추가, FileUpload 라벨을 "FileUpload / Field / Result" 로 변경
- 결과: 컴포넌트 가이드 사이드바에서 [RadioCard](/component-guide/radio-card)·[RadioChip](/component-guide/radio-chip)·[AttachField](/component-guide/attach-field) 페이지로 이동 가능
- 커밋: [RadioCard 변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/50ef78fee6547be1d35a2eb3b5804bae2146e802) [RadioChip 변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f8870a1d4f26e8ffa56169f1815f4797af2d7c7c) [AttachField·FileUpload 라벨 변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/06084a89cd35749a9590417bc449ff4facafef10)

### 기업 Tech-Index 평가모형 선택 화면 개편

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/selection/page.tsx
- 변경: 카드 전체가 링크였던 OptionCard 구성을 제거하고 RadioCard 선택 폼(tech-index-model-form)으로 교체
- 결과: 평가모형을 필수로 선택해야 [다음]이 활성화되는 방식으로 동작. 경로·퍼블리싱 인덱스 변경 없음
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/60be0b18a34cabc30754001d8ecc6065534c9c8b)

### 이어서 작성 안내 모달 디자인 개편

- 대상: src/components/composite/resume-notice-dialog.tsx
- 변경: 안내 문구를 시안대로 2줄("이전에 작성한 내용이 자동 저장되어 있습니다." / "저장된 내용을 불러와 이어서 진행하시겠습니까?")로 바꾸고 버튼을 [새로 작성]·[이어서 작성] 구성으로 교체
- 결과: 새로 작성·이어서 작성 동작은 onNew·onResume 콜백으로 사용처에서 연결
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d700f9c4470d2664db166e06594451f35ecf8cdd)

### 이어서 작성 안내 화면을 기업·기술정보 입력 하위로 이동

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/company-technology-info/resume-notice/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/general/company-technology-info/resume-notice/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/startup/company-technology-info/resume-notice/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/company-technology-info/resume-notice/page.tsx
- 변경: (1) 고객정보활용동의 하위에 있던 이어서 작성 안내 단독 화면 4개(customer-consent/resume-notice)를 삭제하고 (2) 기업·기술정보 입력 하위(company-technology-info/resume-notice)로 이동. screen-registry·publishing-index 의 화면 key 도 같은 이름으로 개명
- 결과: 기업 KTRS-FM·Tech-Index 일반/창업·투자모형 모두 퍼블리싱 인덱스에서 이어서 작성 안내가 (2) 기업·기술정보 입력의 하위 화면으로 노출
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d700f9c4470d2664db166e06594451f35ecf8cdd)

### 보증신청 완료 안내를 토스트에서 모달로 전환

- 대상: src/components/composite/guarantee-application-dialog.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/complete/guarantee-application/application-complete/page.tsx
    - src/components/custom/check-toast.tsx
- 변경: 보증신청 모달에서 [예]를 누르면 완료 토스트 대신 은행 전송완료와 같은 구성의 완료 모달("보증신청이 완료되었습니다." 가운데 정렬 + 전체 폭 [확인])이 이어서 뜨도록 GuaranteeApplicationCompleteDialog 를 신설하고, 보증신청 완료 단독 확인 화면도 토스트에서 모달로 교체. check-toast 는 보증신청 예시 주석만 정리
- 결과: 공용 컴포넌트라 기업 KTRS-FM 제출 완료, 기관 개별평가 KTRS-FM 완료, 기업 마이페이지 보증신청 완료(re-export) 화면에 함께 반영
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e7c6dc92ed26087734a13a3189dff42c74056031)

### 기관 KTRS-FM 진행방식 선택 화면 개편

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/selection/page.tsx
- 변경: 카드 전체가 링크였던 OptionCard 구성을 제거하고 RadioCard 선택 폼(evaluation-method-form)으로 교체
- 결과: 진행방식을 필수로 선택해야 [다음]이 활성화되는 방식으로 동작. 경로·퍼블리싱 인덱스 변경 없음
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/02d30167b3ca69108ac7830c3d07efd6a9f70293)

### icon-solid-error 시맨틱 토큰 추가

- 대상: tokens.json
    - src/app/component-guide/(guide)/semantic-color/page.tsx
- 변경: 오류 상태의 솔리드 아이콘 배경용 시맨틱 토큰 icon-solid-error(light error.500 / dark error.300)를 추가하고 시맨틱 색상 가이드에 등록
- 결과: FileUploadError 오류 패널의 경고 아이콘이 하드코딩 없이 토큰으로 색을 참조
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/06084a89cd35749a9590417bc449ff4facafef10)

### 기관 Tech-Index 평가모형 선택 화면 개편

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/selection/page.tsx
- 변경: 카드 전체가 링크였던 OptionCard 구성을 제거하고 RadioCard 선택 폼(tech-index-model-form)으로 교체, "알려드려요" 안내를 협약기관 3줄 문구로 교체
- 결과: 평가모형을 필수로 선택해야 [다음]이 활성화되고, 선택한 모형(general/startup)의 (1) 고객정보활용동의로 이동
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/08b8a47da8e9afd185f7bc7d81a3a63112c2dad6)

### 기관 Tech-Index 하위 화면 경로 재편

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/company-info/ 4개 페이지 (address-search·industry-code-search·item-description·technology-category)
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/investment-model/company-info/ re-export 2개
    - src/content/publishing-guide/screen-registry.json · publishing-index.json
- 변경: 공용이던 tech-index/company-info 하위 4개 화면을 삭제하고 general/·startup/ 하위로 이동. 투자모형의 품목설명·기술분류 re-export 를 tech-index/general 로 재지정. 퍼블리싱 인덱스는 기관 Tech-Index 트리를 selection + 일반용/창업용 그룹으로 재구성(화면 key 10개 → 분기별 20개)
- 결과: 기관 IA 에서 일반용/창업용 그룹이 각자 전체 플로우 화면을 가지며, 그룹 라벨 행에는 화면 이동 버튼을 두지 않음
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/08b8a47da8e9afd185f7bc7d81a3a63112c2dad6)

### 기관 기업·기술정보 입력 폼 구성 확장

- 대상: src/components/composite/self-diagnosis-form-tabs.tsx
    - src/components/composite/tech-index-company-info-form.tsx
    - src/components/composite/org-company-info-form.tsx
    - src/constants/technology-evaluation.ts
- 변경: 기관 Tech-Index 일반용/창업용 탭 세트를 추가(창업용은 기술인력 현황 다음에 경영진 역량 및 구성 탭 포함). 기업 상세 정보 구획을 TechIndexCompanyDetailSection 으로 추출해 기관 기업정보 탭 하단에 재사용하고, org-company-info-form 에 trailing 슬롯 추가. 진행바 단계 상수 ORG_TECH_INDEX_STEPS·BATCH_EVALUATION_STEPS 등록
- 결과: 기업 쪽 탭 구성·기존 화면은 변경 없음. BATCH_EVALUATION_STEPS 는 일괄평가 커밋에서 사용 예정
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/08b8a47da8e9afd185f7bc7d81a3a63112c2dad6)

### 퍼블리싱 인덱스 일괄평가 트리 재구성

- 대상: src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/publishing-index.json
- 변경: 선택 화면 아래 단일 목록이던 일괄평가 화면 key 4개를 일반용/창업용 그룹의 분기별 10개(제출 전 최종 확인 포함)로 교체하고, 트리를 selection + 일반용/창업용 그룹으로 재구성
- 결과: 기관 IA 에서 일괄평가가 개별평가 Tech-Index 와 같은 일반용/창업용 그룹 구조로 노출되며, 그룹 라벨 행에는 화면 이동 버튼을 두지 않음
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c2c2aaa7a059239d1155689e82b07141b194f09c)

### 일괄평가 진행 신청 제출 흐름·완료 배지 보완

- 대상: src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/batch-evaluation-request-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/batch-evaluation-complete-screen.tsx
- 변경: 일괄평가 진행 신청이 유효성 통과 시 완료 화면으로 바로 이동하던 것을 대량정보 조회 신청과 같은 제출 전 최종 확인 모달을 거치도록 연결하고, 일괄평가 신청 완료 화면의 배지를 시안대로 "대량정보 조회"로 교체
- 결과: 두 신청 갈래 모두 [신청] → 제출 전 최종 확인 → 완료 흐름으로 동작하며, 일반/창업 공용 스크린이라 양쪽 갈래에 함께 반영
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/08f7ec8bd55649ea4e547f5e32c66e32344c244c)

## [덮어쓰기]

### 퍼블리싱 인덱스 화면 상태

- 대상: src/content/publishing-guide/publishing-index.json
- 적용: 기관 Tech-Index 일반용·창업용 플로우 화면 10개와 일괄평가 화면 11개(선택 화면 포함), 총 21개의 UIUX 진행 상태를 완료로 교체
