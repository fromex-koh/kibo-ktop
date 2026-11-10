# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.
frontend-handoff에 실제 전달되는 파일의 변경만 작성하세요.
프로젝트 서비스 페이지가 아닌 퍼블리싱 가이드 관련 파일은 [덮어쓰기]로 분류하세요.
지워야 하는 파일·화면은 [삭제]로 따로 적으세요.
같은 작업의 카드는 # 작업: 작업 이름 아래에 모으고, 그 아래에서 ## 구분자부터 다시 씁니다.

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

- 카드는 위에서부터 작업할 순서대로 나열했습니다. '한 번에 적용'이 적힌 카드는 함께 넣어야 빌드됩니다.

# 작업: 마이페이지 카드 버튼 개편 — 평가결과 · 평가검증 · K-BIGx 이력 · 이용권 관리

## [신규 추가]

### [컴포넌트] CardActionBar — 카드 버튼 줄 추가

- 대상: src/components/composite/card-action-bar.tsx
    - src/components/theme/card-action-bar.variants.ts
- 적용: 신규 파일 추가
- 내용:
    - 목록 카드 아래 버튼 묶음: 보조(secondary)는 왼쪽(CardActionBarStart), 주요(primary)는 오른쪽 끝(CardActionBarEnd)
    - 버튼 폭은 글자만큼(폭 클래스 없음)
    - 모바일(640 미만): 주요 버튼이 맨 위 한 줄을 채우고, 나머지는 아래 줄을 같은 폭으로 나눔. 반 칸에 글자가 안 들어가면 다음 줄로 내려감
    - 구역 안에는 버튼을 바로 넣음(모달 트리거로 감싼 버튼은 그대로 됨)
- 영향 화면: [평가결과 조회 (기업)](/corp/mypage/evaluation-results)
    - [평가결과 조회 (기관)](/org/mypage/evaluation-history)
    - [평가검증 신청 조회 (기관)](/org/mypage/verification-application)
    - [K-BIGx 보고서 이력 (기업)](/corp/mypage/k-bigx-report-history)
    - [K-BIGx 보고서 이력 (기관)](/org/mypage/k-bigx-report-history)
    - [이용권 관리 (기업)](/corp/mypage/paid-services/payment-history)
    - [카드 액션 바 가이드](/component-guide/card-action-bar)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2dbc573b5a5e92b53c40cfdc1fb33bbb4c541316)

### [컴포넌트] HorizontalScrollArea — 가로 스크롤 영역 추가

- 대상: src/components/composite/horizontal-scroll-area.tsx
- 적용: 신규 파일 추가
- 내용:
    - 한 줄 목록(탭 · 세그먼트 필터)이 넘치면 그 영역만 가로 스크롤 — 좌우 화살표 · 가장자리 페이드 · 키보드 이동 시 가운데 맞춤
    - 기존 TabsScrollArea 의 스크롤 동작을 공용으로 뺀 것(아래 카드)
    - 안의 목록에는 w-max 를 줌
- 영향 화면: [이용권 관리 (기업)](/corp/mypage/paid-services/payment-history) — 모바일 상태 필터
    - 탭 화면 전체(아래 TabsScrollArea 카드)
    - [가로 스크롤 영역 가이드](/component-guide/horizontal-scroll-area)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d9784b21bae1839611401bb7b9e39272caf1694a)

## [Diff 확인]

### [컴포넌트] TabsScrollArea — HorizontalScrollArea 사용

- 대상: src/components/composite/tabs-scroll-area.tsx
- 변경: 스크롤 · 화살표 · 페이드 로직을 HorizontalScrollArea 로 옮기고 TabsList 만 감쌈
- 결과: 탭 화면의 동작 · 모양은 그대로 — 아래 화면에서 좁은 폭 탭 스크롤만 확인하면 됨
- 영향 화면: [평가결과 조회 (기업)](/corp/mypage/evaluation-results)
    - [평가결과 조회 (기관)](/org/mypage/evaluation-history)
    - [가격정책 (기업)](/corp/pricing)
    - [가격정책 (기관)](/org/pricing)
    - [플랫폼 소개 (기업)](/corp/platform)
    - [플랫폼 소개 (기관)](/org/platform)
    - [개인정보처리방침 (기업)](/corp/privacy-policy)
    - [개인정보처리방침 (기관)](/org/privacy-policy)
    - [이용약관 (기업)](/corp/terms)
    - [이용약관 (기관)](/org/terms)
- 함께 작업: 위 HorizontalScrollArea 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1e5d23487e0abc9695232d1732e7d98517f4cd3d)

## [신규 추가]

### [컴포넌트] 평가 카드 버튼 스타일 표 추가

- 대상: src/components/custom/evaluation-card-action-style.ts
- 적용: 신규 파일 추가
- 내용: 평가 카드 버튼 종류(type)별 아이콘 · 주요/보조 · 왼쪽/오른쪽. 버튼 묶음과 컴포넌트 가이드가 함께 읽음
- 함께 작업: 아래 평가 카드 버튼 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fc1008c1524b8e7445211f75da555e59c4382cac)

## [Diff 확인]

### [데이터 · 컴포넌트] 평가 카드 버튼 — 글자 대신 종류 코드(type)로 변경

- 대상: src/constants/evaluation-result.ts
    - src/components/custom/evaluation-card.tsx
    - src/content/service/evaluation-results.ts
    - src/content/service/org-evaluation-history.ts
    - src/content/service/org-verification-applications.ts
- 변경:
    - 버튼 데이터: { label, href, opens? } → { type, href, done?, newWindow? }. 버튼 글자는 EVALUATION_RESULT_ACTION_LABEL 이 붙임
    - 보증추천 · 보증이력은 type 만 보고 모달을 엶(opens 삭제). 보증추천을 마친 건은 toGuaranteeCompletedActions 가 보증이력으로 바꿈
    - 삭제: GUARANTEE_HISTORY_LABEL · CANCEL_ACTION_LABEL(type 으로 대신함)
    - 버튼 묶음: CardActions → EvaluationCardActions(CardActionBar 위). hasPrimary=false 면 모두 보조 · 왼쪽, end 로 오른쪽 주요 버튼을 더 붙임
    - 목업: label · opens → type 만 바꿈(주소 · 잠김 · 새 창 값은 그대로)
    - [프론트엔드 연동] 응답의 버튼은 type 코드로 받음 — 문구가 바뀌면 EVALUATION_RESULT_ACTION_LABEL 만 고침
- 결과: 기업 · 기관 평가 카드가 같은 버튼 규칙(주요/보조 · 아이콘 · 자리)을 씀
- 영향 화면: [평가결과 조회 (기업)](/corp/mypage/evaluation-results)
    - [평가결과 조회 (기관)](/org/mypage/evaluation-history)
    - [평가검증 신청 조회 (기관)](/org/mypage/verification-application)
- 함께 작업: 위 스타일 표 카드 · 아래 평가 화면 카드 3장과 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3e8e8ebc9a7cd17a375453b82a0d3afce4830fe4)

### [화면] 기업 평가결과 조회 — 버튼 정리

- 대상: src/components/custom/evaluation-result-list.tsx
- 변경:
    - [자가진단 결과] 보조 · 왼쪽 / [은행 전송] 보조 · 오른쪽 / [보증신청] 주요 · 맨 오른쪽, 모두 아이콘 추가
    - 버튼 폭: 카드 폭 균등 분할 → 글자만큼
    - 모형명 · 등급 배지: 들어가면 한 줄, 모자라면 배지가 다음 줄(모형명 말줄임 없음)
- 영향 화면: [평가결과 조회 (기업)](/corp/mypage/evaluation-results)
- 함께 작업: 위 평가 카드 버튼 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/bb8d386bae98eef6444663580e116d3fd0f460ed)

### [화면] 기관 평가결과 조회 — 버튼 정리

- 대상: src/components/custom/org-evaluation-history-list.tsx
- 변경:
    - 개별평가: [개별평가 일반 결과] · [개별평가 심층 결과] 보조 · 왼쪽 / [보증추천] · [보증이력] 주요 · 오른쪽
    - 일괄평가 · 대량정보조회 신청: [접수취소] · [엑셀결과] · [HTML 압축파일] · [재등록] 모두 보조 · 왼쪽
    - 모두 아이콘 추가, 버튼 폭은 글자만큼
    - 모형명 · 결과값(기업 수) 배지: 들어가면 한 줄, 모자라면 배지가 다음 줄
- 영향 화면: [평가결과 조회 (기관)](/org/mypage/evaluation-history)
- 확인 방법: 신청 카드는 모형 탭 [Tech-Index] · [창업용 Tech-Index] → 평가 방식 [일괄평가] · [대량정보조회]에서 보임
- 함께 작업: 위 평가 카드 버튼 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/96c8e194261d1f6a2daa34c4daa5a13b25270c9e)

### [화면] 기관 평가검증 신청 조회 — 버튼 정리 · 이력 박스

- 대상: src/components/custom/verification-application-card.tsx
- 변경:
    - [자가진단 일반 결과] · [보증추천]/[보증이력] 보조 · 왼쪽
    - [평가검증 하기]: 밑줄 링크 → 주요 버튼(아이콘) · 오른쪽
    - 펼친 평가검증 이력: 카드 아래 면 → 카드 안의 박스(접힘: 옅은 면 / 펼침: 테두리 + 줄 사이 가로선)
    - 이력 줄 버튼([평가검증 결과] · [보증이력]/[보증추천]) 보조 · 왼쪽
    - 팀 이름 · 등급 배지: 들어가면 한 줄, 모자라면 배지가 다음 줄
    - [프론트엔드 연동] 검증 화면이 생기면 item.verifyHref 만 채움
- 영향 화면: [평가검증 신청 조회 (기관)](/org/mypage/verification-application)
- 확인 방법: 이력 박스는 카드 아래 [평가검증 이력 N건 펼쳐보기]를 눌러 엶
- 함께 작업: 위 평가 카드 버튼 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/34bf6633f39295c145c05042ee56aaf0936fd4c2)

### [화면] K-BIGx 보고서 이력 (기업 · 기관) — 버튼 정리

- 대상: src/components/custom/k-bigx-report-card.tsx
    - src/components/custom/k-bigx-report-download-button.tsx
- 변경:
    - [보고서 다운로드] · 대량정보조회의 [엑셀 결과] · [HTML 압축파일]: 보조 · 아이콘 · 글자 폭 · 왼쪽
    - KBigxReportDownloadButton: className prop 삭제(쓰는 곳 없음)
    - 기업명 · 이용권 배지: 들어가면 한 줄, 모자라면 배지가 다음 줄
- 영향 화면: [K-BIGx 보고서 이력 (기업)](/corp/mypage/k-bigx-report-history)
    - [K-BIGx 보고서 이력 (기관)](/org/mypage/k-bigx-report-history)
- 확인 방법: 기관의 대량정보조회 건([엑셀 결과] · [HTML 압축파일])은 목록 뒤쪽 페이지에 있음
- 함께 작업: 위 CardActionBar 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/12e9206dfa41182be270d7fdd95e87b079296164)

### [화면] 이용권 관리 — 버튼 정리 · 상태 필터 가로 스크롤

- 대상: src/components/custom/paid-service-history.tsx
    - src/components/composite/paid-service-suspend-action.tsx
    - src/components/composite/paid-service-usage-history-dialog.tsx
- 변경:
    - [환불하기] · [이용중지] · [이용중지 변경] 보조 / [이용내역] 주요 · 맨 오른쪽, 모두 아이콘 추가
    - 카드 하단 안내 문구 · 버튼: 1024 이상에서만 한 줄, 태블릿은 문구 위 · 버튼 아래
    - 상태 필터(전체 · 사용중 · 대기중 · 만료 · 환불): 모바일에서 넘치면 필터만 가로 스크롤(페이지 가로 넘침 해결)
    - 이용권 이름 · 상태 배지, 이용내역 팝업의 이름 · 잔여 건수: 들어가면 한 줄, 모자라면 다음 줄
    - 이용권 이름은 단어 단위로 줄바꿈
- 영향 화면: [이용권 관리 (기업)](/corp/mypage/paid-services/payment-history)
    - [환불 가능 — 버튼 셋](/corp/mypage/paid-services/payment-history/refundable)
    - [이용중지 중 — 이용중지 변경](/corp/mypage/paid-services/payment-history/suspending)
    - [이용중지 이력](/corp/mypage/paid-services/payment-history/suspension-history)
    - [이용내역 팝업](/corp/mypage/paid-services/payment-history/usage-history)
- 함께 작업: 위 CardActionBar · HorizontalScrollArea 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8e1af7595875f7d7741fe58a1bd3c8757e04d420)

### [화면] 보증이력 · 하위계정 상세 팝업 — 이름 · 상태 배지 줄바꿈

- 대상: src/components/composite/guarantee-history-dialog.tsx
    - src/components/composite/sub-account-detail-dialog.tsx
- 변경:
    - 이름 · 상태 배지: 모바일에서 배지를 항상 이름 위로 → 들어가면 한 줄, 모자라면 배지가 이름 아래
    - 보증이력 상단의 사업자번호 · 업종코드 값: 길면 자기 칸 안에서 줄바꿈
- 영향 화면: [보증이력 팝업 (기관)](/org/mypage/evaluation-history/guarantee-history)
    - [하위계정 상세 팝업 (기관)](/org/mypage/sub-account-progress/detail)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5e19b07ba78a51441462f4675d2c1afe21d743fd)

# 작업: 컴포넌트 가이드 — CardActionBar · HorizontalScrollArea 추가

## [덮어쓰기]

### [문서] 카드 버튼 · 가로 스크롤 가이드 추가 · 관련 가이드 갱신

- 대상: src/app/component-guide/(guide)/card-action-bar/page.tsx
    - src/app/component-guide/(guide)/horizontal-scroll-area/page.tsx
    - src/app/component-guide/(guide)/action-bar/page.tsx
    - src/app/component-guide/(guide)/evaluation-card/page.tsx
    - src/app/component-guide/(guide)/icon/page.tsx
    - src/app/component-guide/(guide)/kbigx-print-output-selection-dialog/page.tsx
    - src/app/component-guide/(guide)/segmented-control/page.tsx
    - src/app/component-guide/(guide)/tabs/page.tsx
    - src/constants/publishing-guide.ts
- 적용: 지정한 파일만 교체
- 내용:
    - [카드 액션 바 (CardActionBar)](/component-guide/card-action-bar): 새 가이드
    - [가로 스크롤 영역 (HorizontalScrollArea)](/component-guide/horizontal-scroll-area): 새 가이드
    - [평가 카드 (EvaluationCard)](/component-guide/evaluation-card): EvaluationCardActions · 버튼 종류 13개 표(아이콘 포함)
    - [보고서 내용 선택 (KbigxPrintOutputSelectionDialog)](/component-guide/kbigx-print-output-selection-dialog): 이력 카드 예시 · KBigxReportDownloadButton Props
    - [액션 바 (ActionBar)](/component-guide/action-bar): 컴포넌트 선택 표에 CardActionBar 추가
    - [세그먼티드 컨트롤 (Segmented Control)](/component-guide/segmented-control): 넘칠 때 가로 스크롤 예시 추가
    - [탭 (Tabs)](/component-guide/tabs): 스크롤 동작이 HorizontalScrollArea 로 옮겨진 안내
    - [아이콘 (Icon)](/component-guide/icon): 새로 쓴 아이콘 6개 추가
    - 가이드 메뉴: 새 가이드 2개 등록
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3a825235acba1897eec279e1463bd98caa7c4123)

# 작업: 입력칸 오류 표시 — 오류 칸 면 색 추가 · 선택 상자 오류 해제 수정

## [덮어쓰기]

### [토큰] field-invalid — 오류 입력 칸 면 색 추가

- 대상: tokens.json
    - scripts/build-tokens.mjs
- 적용: 두 파일을 교체한 뒤 yarn tokens 로 src/app/tokens.css 를 다시 만듭니다.
- 내용:
    - 시맨틱 색 추가: field-invalid(라이트 error.50 · 다크 error.900) → 클래스 bg-field-invalid
    - 생성기 대비 검사 추가: 오류 칸 글자(label-foreground) · 오류 칸 테두리(destructive) — 다크 대비가 모자라면 빌드가 멈춤
- 함께 작업: 한 번에 적용: 아래 입력 컴포넌트 · 가이드 카드 — 토큰 없이 넣으면 bg-field-invalid 가 비어 면 색이 나오지 않음
- 영향 화면: [색상 (Semantic)](/component-guide/semantic-color)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/49e23d7a70352b6590d6a1d18036f1a603f3ee20)

### [스타일] 입력 컴포넌트 — 오류 칸에 옅은 붉은 면

- 대상: src/components/theme/input.variants.ts
    - src/components/theme/textarea.variants.ts
    - src/components/theme/select.variants.ts
    - src/components/theme/input-group.variants.ts
- 적용: 지정한 파일만 교체
- 내용:
    - 오류(aria-invalid) 칸: 붉은 테두리(destructive) 그대로 + 면 bg-field-invalid 추가
    - 오류 문구(FieldError) 색 · 크기는 그대로
    - 공용 컴포넌트라 서비스 전체의 오류 입력칸에 함께 적용됨(회원가입 · 문의 · 평가 신청 · 마이페이지 정보 수정 등)
- 함께 작업: 위 토큰 카드와 한 번에 적용
- 영향 화면: [인풋 (Input)](/component-guide/input)
    - [텍스트에어리어 (Textarea)](/component-guide/textarea)
    - [셀렉트 (Select)](/component-guide/select)
    - [날짜 입력 (DatePicker)](/component-guide/date-picker)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3308f4d308f9d17f098f4d024949478ce7611f12)

## [Diff 확인]

### [동작] 폼 선택 상자 — 값을 고르면 오류 표시가 바로 풀리게 수정

- 대상: src/components/composite/form-values.tsx
- 변경:
    - 원인: Select 래퍼만 값을 바꿔도 오류를 지우지 않아, 다음 제출 전까지 오류 문구 · 붉은 테두리 · 면이 남음(입력칸 · 날짜 · 라디오 · 여러 줄 입력 래퍼는 이미 지움)
    - 수정: SelectTrigger 가 자기 오류 지우기(clear)를 Select 에 등록하고, 값이 바뀌면 Select 가 부름
    - 사용처 화면 코드는 그대로 — 래퍼 안에서만 바뀜
- 결과: 값을 고르는 즉시 오류 문구가 사라지고 칸이 기본 모양으로 돌아옴
- 확인 방법: 빈 상태로 [다음] · [저장] → 오류가 난 선택 상자에서 값 선택
- 영향 화면: [기업·기술정보 입력 — KTRS-FM (기업)](/corp/technology-evaluation/ktrs-fm/company-technology-info)
    - [기업·기술정보 입력 — 투자모형 (기업)](/corp/technology-evaluation/investment-model/company-technology-info)
    - [기업·기술정보 입력 — Tech-Index (기업)](/corp/technology-evaluation/tech-index/general/company-technology-info)
    - [기업·기술정보 입력 — 창업용 Tech-Index (기업)](/corp/technology-evaluation/tech-index/startup/company-technology-info)
    - [기업·기술정보 입력 — KTRS-FM (기관)](/org/individual-evaluation/ktrs-fm/company-technology-info)
    - [기업·기술정보 입력 — 투자모형 (기관)](/org/individual-evaluation/investment-model/company-technology-info)
    - [기업·기술정보 입력 — Tech-Index (기관)](/org/individual-evaluation/tech-index/general/company-technology-info)
    - [기업·기술정보 입력 — 창업용 Tech-Index (기관)](/org/individual-evaluation/tech-index/startup/company-technology-info)
    - [내 정보 (기업)](/corp/mypage/profile)
    - [대표자 이력 (기업)](/corp/mypage/representative-history)
    - [회원정보 수정 — 파트너 은행 (기관)](/org/mypage/profile-edit/partner-bank)
    - [회원정보 수정 — 파트너 기관 (기관)](/org/mypage/profile-edit/partner-agency)
    - [회원정보 수정 — 비파트너 은행 (기관)](/org/mypage/profile-edit/non-partner-bank)
    - [회원정보 수정 — 비파트너 기관 (기관)](/org/mypage/profile-edit/non-partner-agency)
    - [회원정보 수정 — 하위계정 (기관)](/org/mypage/profile-edit/sub-account)
    - [하위계정 생성 (기관)](/org/mypage/sub-account-progress/create)
    - [하위계정 수정 (기관)](/org/mypage/sub-account-progress/edit)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e84558dde72f1e87d999bbbc2fa6fdefc5d30031)

## [덮어쓰기]

### [문서] 입력 컴포넌트 가이드 — 오류 칸 면 색 안내

- 대상: src/app/component-guide/(guide)/semantic-color/page.tsx
    - src/app/component-guide/(guide)/input/page.tsx
    - src/app/component-guide/(guide)/textarea/page.tsx
    - src/app/component-guide/(guide)/select/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - [색상 (Semantic)](/component-guide/semantic-color): field-invalid 그룹 추가
    - [인풋 (Input)](/component-guide/input): 상태 설명에 오류 배경 bg-field-invalid 추가
    - [텍스트에어리어 (Textarea)](/component-guide/textarea): 상태 설명에 오류 배경 추가
    - [셀렉트 (Select)](/component-guide/select): 오류 상태 설명에 오류 배경 추가
- 함께 작업: 위 토큰 카드와 한 번에 적용(시맨틱 색상 가이드가 field-invalid 를 읽음)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/bc42a5f08100949aa15ae5626d1a8c866f06622a)
