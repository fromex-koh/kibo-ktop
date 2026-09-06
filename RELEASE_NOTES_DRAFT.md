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

### 인증 모달 — 제목 구조 접근성 보완

- 대상: src/components/custom/auth-flow-page.tsx
- 적용: 아래 네 모달의 제목·안내 문장 변경을 Diff로 반영합니다.
- 적용 범위:
    - 기관 최초 비밀번호 변경: `InitialPasswordChangeDialog`의 ‘내 정보 확인’ 제목과 안내 문장입니다.
    - 기업 실명인증: `RealNameVerificationDialog`의 ‘본인 인증’ 제목과 주민등록번호 입력 안내입니다.
    - 기업·기관 로그인 연장: `SessionExtensionDialog`의 ‘로그인 연장’ 제목과 남은 시간 안내입니다.
    - 기업·기관 로그인 안내: `LoginGuideDialog`의 ‘회원가입/로그인’ 제목과 로그인 안내 문장입니다.
- 공통 변경:
    - 제목을 `DialogTitle asChild` + H1으로 변경해 최상위 제목 누락을 보완했습니다. 로그인 안내 제목은 `sr-only`를 유지해 화면에 표시하지 않습니다.
    - 안내 문장을 `DialogDescription asChild` + 블록 span으로 변경해 Possible heading 경고의 원인을 수정했습니다.
- 유지: 문구·디자인·입력 항목·시간 표시·버튼 동작은 그대로입니다.
- 검증: 타입·린트 검증을 통과했습니다. WAVE의 H1 누락·Possible heading 재검사는 필요합니다.
- 커밋:
    - [기관 최초 비밀번호 변경](https://github.com/fromex-koh/kibo-ktop/commit/cc2320f713a3ee7d7402d148dbe75ffa1583e1b9)
    - [기업 실명인증](https://github.com/fromex-koh/kibo-ktop/commit/4031ed078db424e08af91334af2e6625612d35a1)
    - [기업·기관 로그인 연장](https://github.com/fromex-koh/kibo-ktop/commit/322bfe71dbb404a6f8de8836368c45e3e77aa7e6)
    - [기업·기관 로그인 안내](https://github.com/fromex-koh/kibo-ktop/commit/5cc9f83404a9d52be4efd3e68eef1484eb34a0be)

### 기업·기관 문의 작성·취소 — 접근성 보완

- 대상: src/components/custom/inquiry-form.tsx
- 적용: 아래 두 컴포넌트의 변경을 Diff로 반영합니다. 기업·기관 공통 폼에 적용됩니다.
- 문의 작성 (`InquiryForm`):
    - 숨김 파일 input `#inquiry-attachment`에 `aria-label="문의 첨부파일"`을 추가했습니다.
    - 문의 작성·개인정보 동의 안내 화면에서 발생한 파일 첨부의 Missing form label 오류를 해결했습니다.
- 문의 취소 (`InquiryCancelDialog`):
    - ‘작성 취소’를 `DialogTitle asChild` + H1으로 변경해 최상위 제목 누락을 보완했습니다.
    - ‘문의 작성을 취소하시겠습니까?’를 `DialogDescription asChild` + 블록 span으로 변경해 Possible heading 경고의 원인을 수정했습니다.
- 유지: 화면 문구·디자인·파일 첨부 및 폼 제출·취소 확인 및 이동 동작은 그대로입니다.
- 검증: 타입·린트 검증을 통과했습니다. 파일 첨부 레이블 반영을 확인했으며, 문의 취소의 WAVE H1 누락·Possible heading 재검사는 필요합니다.
- 커밋:
    - [문의 작성 — 파일 첨부 레이블 추가](https://github.com/fromex-koh/kibo-ktop/commit/c7ab0c06f2ae94a7271415eaaf7bc62946f747da)
    - [문의 취소 — 제목·안내 문장 보완](https://github.com/fromex-koh/kibo-ktop/commit/5cdd08cc547a3822b9578a6eab49ed3ac58dd406)

## [덮어쓰기]

### 퍼블리싱 인덱스 — 화면 ID·진척률·행 구분 안내 개선

- 대상:
    - src/components/custom/publishing-index.tsx
    - src/content/publishing-guide/types.ts
    - src/content/publishing-guide/index.ts
- 적용: 세 파일과 아래 IA 데이터 파일 세 개를 함께 덮어씁니다.
- 화면 ID·구분선: 기업·기관에 엑셀 화면 ID와 칼럼 구분선을 추가했습니다. ID가 없으면 미지정이며, 탄소 ID 열과 응용2–UIUX 사이 구분선은 없습니다.
- 행 수 안내: IA 수·표 행 수·진척률 기준을 dot list로 정리했습니다. 기업은 156개→169행, 기관은 151개→160행이며, 취소선도 표에 유지합니다.
- 진척률 계산: 취소선을 뺀 완료 행 ÷ 집계 대상 행입니다. 완료·최종완료·보완을 완료 수로 세며, IA 외 화면과 업종·회원 유형별 분리 화면도 각각 포함합니다.
- 보완 집계: 응용2·UIUX 모두 보완을 완료 수에 포함합니다. 진척률 카드는 ‘완료(보완 포함)’로 표시하고, 집계 기준을 표 위 안내 목록에 적었습니다. 취소선 제외 기준은 그대로입니다. 최초 비밀번호 변경·실명인증·로그인 연장·로그인 안내 화면은 완료에서 보완으로 변경해도 완료 수에 계속 포함되어 진척률이 유지됩니다.
- 응용2 결과: 기업 127/169(75%) · 기관 104/154(68%)입니다. 기관은 대기중 7개 추가·미완료 1개 제외 및 완료 상태인 취소선 6개의 집계 제외로, 최초 110/153(72%)에서 104/154(68%)로 변경되었습니다.
- 민트색 10행: 기업 8개·기관 2개로, 이전 IA(260731)에 있던 화면 또는 개발 완료 화면 중 최신 IA(V1.23_260831)에 없는 항목입니다. 삭제·누락 확인 대상으로 안내하며, 행 수·진척률에 포함합니다.
- 주황색·취소선 6행: 최신 IA에서 삭제 표시된 기관 평가 신청·최종 확인 화면입니다. 응용2 완료 뱃지·링크·표의 행 수는 유지하고, 진척률 분자·분모에서 제외합니다.
- 강조 순서: 주황색 > 밝은 민트색 > 업데이트 색상입니다. 행과 각 셀에 적용합니다.
- 안내·간격: 릴리즈 카드의 대상·적용·기준 등 항목명 아래에 상세 내용을 dot list로 표시합니다. 색상 설명을 굵은 제목과 짧은 문장으로 정리하고, 공통 레이아웃 표 아래 여백을 24px 늘렸습니다.

### 퍼블리싱 인덱스 — 기업·기관 IA V1.23 데이터 반영

- 대상:
    - src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 세 파일과 위 인덱스 표시·콘텐츠 처리 파일 세 개를 함께 덮어씁니다.
- 상태 변경: 기관 최초 비밀번호 변경(`org-initial-password-change`), 기업 실명인증(`corp-real-name-verification`)·로그인 연장(`corp-session-extension`)·로그인 안내(`corp-login-guide`)·문의 취소(`corp-notice-inquiry-create-inquiry-cancel`)·문의 작성(`corp-notice-inquiry-create`)의 UIUX 뱃지를 완료에서 보완으로 변경했습니다. 응용2는 모두 완료를 유지하며, 보완도 완료 수에 포함하므로 진척률은 유지됩니다.
- 상태 변경 커밋:
    - [기업 문의 작성 뱃지 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/2b1d6e564b7b31ef94ad0043a631131d51513371)
    - [기업 로그인 연장·안내 뱃지 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/b9f51e61ee46f8406ddaad217b4a585b5bad5c9c)
    - [기업 문의 취소 뱃지 변경 보기](https://github.com/fromex-koh/kibo-ktop/commit/a977b5052241bcf288cde9d8161fce1d35beca02)
- 기준: 기업·기관 IA를 `V1.23_260831`로 갱신하고 화면 ID·메뉴명·유료 서비스 관리 하위 구조를 반영했습니다.
- 추가 14개:
    - 기업·기관 공통: 기관 로그인, K-BIGx 이용약관, 메인 공지사항 팝업, 신용정보 활용체제를 각각 추가했습니다(8개).
    - 기업: 가격 정책의 결제하기와 유료 서비스 관리의 환불 불가 안내를 추가했습니다(2개).
    - 기관: 하위 계정 등록·저장·비밀번호 초기화·상태 변경 완료 토스트를 추가했습니다(4개). 메뉴명(Depth)이 비어 있어도 화면 Type이 있으면 집계에 포함합니다.
    - 추가 항목은 대기중으로 등록했습니다.
- 제외 3개:
    - 기업 > 마이페이지 > 유료 서비스 관리 > 환불내역·명세서: V1.22 개정이력에 삭제가 명시되어 제외했습니다(2개).
    - 기관 > 마이페이지 > 하위 계정 현황 > 하위 계정 삭제: 최신 IA에 항목이 없어 제외했습니다(1개).
- 취소선 6개 유지:
    - 기관 > 개별평가 > Tech-Index > 일반용: (3) 평가 신청하기, 제출 전 최종 확인입니다.
    - 기관 > 개별평가 > Tech-Index > 창업용: (3) 평가 신청하기, 제출 전 최종 확인입니다.
    - 기관 > 개별평가 > 투자모형: (4) 평가 신청하기, 제출 전 최종 확인입니다.
    - 최신 IA에서는 삭제 표시된 항목이지만 응용2 완료 이력을 확인하도록 유지합니다. Tech-Index 4개는 v2.0.6, 투자모형 2개는 v2.0.7이며 기존 링크를 유지합니다.
- 행 수 차이: IA 전체는 기업 156개·기관 151개입니다. 퍼블리싱 표는 분리된 화면과 IA 외 추가 화면을 포함해 기업 169개·기관 160개입니다. 기업·기관의 차이 22개는 화면 분리로 늘어난 12개 행과 IA 외 추가 화면 10개 행입니다.
- 최초 대비: 전체 퍼블리싱 행은 392개에서 14개 추가·3개 제외되어 403개입니다(기업 169개·기관 160개·탄소 74개). 제외한 3개는 기존 응용2 상태가 미지정이었으며, 기존 응용2 완료 257개는 모두 유지합니다. 위에 명시한 UIUX 상태 변경 외 기존 작업 상태·링크·버전과 탄소 데이터는 유지하며, 실제 페이지 파일은 삭제하지 않았습니다.

### 버전 업데이트 — 기존 릴리즈 설명 말투 통일

- 대상: src/content/publishing-guide/release-notes.generated.json
- 적용: 지정한 파일을 덮어씁니다.
- 변경: 기존 30개 릴리스의 설명 문구 231개를 입니다·합니다체로 통일했습니다.
- 유지: 설명의 의미와 버전·날짜·수치·파일 경로·링크·코드·인용된 화면 문구는 그대로 유지합니다.
