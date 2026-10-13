# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.
frontend-handoff에 실제 전달되는 파일의 변경만 작성하세요.
프로젝트 서비스 페이지가 아닌 퍼블리싱 가이드 관련 파일은 [덮어쓰기]로 분류하세요.
지워야 하는 파일·화면은 [삭제]로 따로 적으세요.

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

### [컴포넌트] K-BIGx 보고서 — 카드 제목 · 단위 위치 (모든 탭)

- 대상: src/components/custom/innovation-growth-report-parts.tsx
    - src/components/custom/innovation-growth-report-company.tsx
    - src/components/custom/innovation-growth-report-tech.tsx
    - src/components/custom/innovation-growth-report-activity.tsx
    - src/components/custom/innovation-growth-report-document.tsx
- 변경:
    - 단위 위치: 제목 줄 오른쪽 → 제목 바로 아래 줄
    - 적용 방법: Card 에 className="gap-0" · 표 · 그래프를 WithUnit 으로 감쌈(규칙 설명은 parts.tsx 의 WithUnit 주석)
    - 적용 카드: 진단브리핑 3 · 기업현황 7 · 기술혁신정보 2 · 활동성정보 4
    - 경영진 현황: 최대 10건까지만 표시(주주 · 관계기업과 같음)
    - 탭 다시 열기: 이미 본 탭은 차트 애니메이션 없이 바로 표시
    - Card revealGroup prop 추가: 같은 값을 준 카드끼리 차트가 동시에 움직임
    - 로딩 스켈레톤: 실제 카드와 같은 배치
- 결과: 모든 탭의 단위가 같은 자리(제목 아래)에 보임
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 보고서 결과](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f4fc70022297f80ecc4032b2b1c9077472b54ef1)

### [컴포넌트] K-BIGx 보고서 — 신용/재무정보 탭

- 대상: src/components/custom/innovation-growth-report-credit.tsx
- 변경:
    - 단위 위치: 제목 줄 오른쪽 → 제목 바로 아래 줄(재무비율진단 4 · 차입금 2 · 차입금 현황 3)
    - 기관별 비중: 표 ↔ 도넛 간격 48 → 24
    - 기업신용등급 설명 상자: 고정 문구 → 지금 등급의 정의(cri-grades.ts 에서 찾음)
    - 현금흐름등급 색: 칸 · 원호 · 칸 글자 색을 토큰으로(cash-flow-cr-<n>) — 다크 모드 대응
    - 신용/담보 비중 · 담보 현황: 두 차트가 동시에 움직임
    - 신용/담보 비중: 그래프 ↔ 비율 막대 간격 24
- 결과:
    - 신용등급이 바뀌면 설명 상자 문구도 같이 바뀜(연동 시 등급 코드만 넘김)
    - 정의표에 없는 등급 코드면 설명 상자는 숨김
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 보고서 결과](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/69d0ca8ce7ec314b92c477e8feb5dc0711d26477)

### [컴포넌트] K-BIGx 보고서 — Tech-Index 탭 차트 애니메이션 순서

- 대상: src/components/custom/innovation-growth-report-tech-index.tsx
- 변경:
    - 애니메이션 순서: 카드 한 장씩 차례로 → 같은 줄 카드가 동시에
    - 4대 혁신역량 점수: 4장이 동시에 움직임
    - 기업 유형별 4대 혁신역량 비교 · 세부지표별 상대비교분석: 2장씩(한 줄) 동시에 움직임
- 결과: 줄과 줄 사이는 스크롤해 보이는 순서대로 이어짐 · 카드 수가 늘어도 2장씩 자동으로 묶임(열 수는 GRID_COLUMNS)
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/99c835dd15a5e57750e1b383b52778ea686462be)

### [컴포넌트] 차트 등장 시점

- 대상: src/components/custom/chart-reveal.tsx
    - src/components/custom/percentage-donut-chart.tsx
- 변경:
    - 시작 시점: 차트가 화면에 조금 걸치면 → 절반 이상 보이면(REVEAL_VISIBLE_RATIO = 0.5)
    - 순서: 같은 순간에 보인 카드는 0.12초 간격 · 같은 group 은 동시 · 탭이 바뀌면 순서를 처음부터
    - 도넛: 0.4초 기다림 없이 바로 그림(animationBegin 0)
- 결과: 화면 끝에 걸친 차트가 보기 전에 끝나 버리지 않음 · 탭 전환 · 스크롤 시 빈 화면 시간이 짧아짐
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/531ebaf9da37de92ba41efddd67c4deed5f70e86)

### [컴포넌트] 도넛 조각 색 — 다크

- 대상: src/components/custom/percentage-donut-colors.ts
- 변경: 고정 색(--raw-*) → donut-1 ~ 8 토큰. 항목 수별 단계는 8색의 부분집합
- 결과:
    - 라이트: 변화 없음
    - 다크: navy · blue 의 밝은 단계로 바뀌어 어두운 카드 위에서 조각이 구분됨
    - 색을 직접 적어야 하면 var(--ds-donut-<n>) 을 씀
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/71b52db7ffdb8d9082127ae32c2d6268d68fb606)

### [컴포넌트] 기업신용등급 게이지 — 등급과 관계없이 한 가지 색

- 대상: src/components/custom/semicircle-rating-gauge.tsx
- 변경:
    - 원호 색: 등급마다 다른 6가지 색(CR-1 ~ CR-6) → 우수 색 하나(파랑 → 하늘색 그라데이션)
    - 라이트 · 다크: 같은 색(gauge-excellent 토큰)
    - tone prop 삭제: 넘기던 곳이 있으면 타입 오류 — 지우면 됨
- 결과: 등급은 원호 채움 길이와 가운데 등급 글자로 구분
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b8a10c7c405a214e3ddadc867f6b2883c5eae0fc)

### [컴포넌트] 현금흐름등급 게이지 — 다크 모드 색

- 대상: src/components/custom/grade-scale-gauge.tsx
    - src/components/custom/arc-gauge.tsx
- 변경:
    - 다크 등급 칸 · 원호 색: 라이트와 같은 색 → 다크 전용 밝은 색(CR-6 회색 · CR-4 빨강 · CR-3 주황 · CR-2 초록 · CR-1 파랑)
    - 다크 칸 글자: 칸 색에 맞춰 짙은 글자(CR-5 만 밝은 글자)
    - 원호 빈 트랙: 다른 게이지보다 밝게 — 어두운 CR-5 채움이 트랙에 묻히지 않게
    - 새 prop: 등급 칸 foreground(칸 글자 색 · isLightColor 보다 우선) · ArcGauge trackColor(트랙 색 · 안 주면 기존 그대로)
- 결과:
    - 라이트: 변화 없음
    - 다른 원호 게이지(점수 · 기업신용등급): 변화 없음
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e5f2d70258632fa3c46aa2e03989fa714ecc6195)

### [데이터] CRI 등급표 — 게이지 설명

- 대상: src/content/service/cri-grades.ts
- 변경:
    - 게이지 설명: "우량 등급" → "우량"(등급명만)
    - 등급명별 색 단계표 삭제(게이지가 단일 색)
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/376882de8fe7d9599c332ae837821677837a8e74)

### [데이터] K-BIGx 보고서 목업 — 보고용 화면 정리

- 대상: src/content/service/k-bigx-innovation-report.ts
- 변경:
    - 주주 현황 목업: 10건 → 4건 — 보고용 화면이 깔끔하게 보이도록 데이터만 줄임
    - 경영진 현황 목업: 4건 그대로 · 최대 10건 연동 주석 추가
    - 기업신용등급 목업: AA0 → BBB0(이전평가이력 마지막 등급도 BBB0)
    - 기업신용등급 설명 상자의 고정 문구(ratingSummary) 삭제 — 등급 정의로 대체(신용/재무정보 탭 카드)
    - 3색 도넛(기관별 비중 · 담보 현황) 색: donut 토큰으로
- 결과:
    - 화면이 그리는 최대 건수는 그대로: 경영진 · 주주 · 관계기업 최대 10건(COMPANY_LIST_LIMIT)
    - 연동 시 목록은 자르지 않고 그대로 보냄 · ratingSummary 는 보내지 않음
    - 이전평가이력의 마지막 등급 = 현재 등급
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c86a0bb696fa20aeffbf1581ef82da46ce662c1b)

### [컴포넌트] 가격정책 — 이용권 카드 hover

- 대상: src/components/custom/pricing-policy.tsx
    - src/content/service/pricing.ts
- 변경:
    - 스탠다드 상시 강조 삭제(isRecommended 삭제)
    - 네 카드 모두 hover · 카드 안 버튼 포커스 때 옅은 파란 면 · 파란 테두리 · 채운 [구매하기]
- 영향 화면: [기업 가격정책](/corp/pricing)
    - [기관 가격정책](/org/pricing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fad31f044c3e357d28c60584e9f79aa37666b1ac)

### [컴포넌트] 이용약관 · 개인정보 처리방침 — 선택 탭에 밑줄

- 대상: src/components/custom/terms-tabs.tsx
    - src/components/custom/privacy-policy-tabs.tsx
    - src/components/composite/tabs-scroll-area.tsx
- 변경:
    - 1뎁스 탭 모양: 글자색만 다른 탭(text) → 선택한 탭 글자 아래 밑줄 2px(underline)
    - 이유: 글자색 차이만으로는 어느 탭이 선택됐는지 잘 보이지 않음
    - 쓰는 법: TabsScrollArea(또는 TabsList)의 variant="text" → variant="underline"
    - 좌우 스크롤 가장자리 흐림: 흰색 덮개 → 글자 자체를 흐리게(마스크)
- 결과:
    - 선택한 탭이 밑줄로 바로 구분됨
    - 회색 · 다크 배경 위에서도 가장자리에 흰 띠가 생기지 않음
- 영향 화면: [기업 이용약관](/corp/terms)
    - [기업 개인정보 처리방침](/corp/privacy-policy)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5e664f0bacffb9a0370349699992036ecc846d96)

### [컴포넌트] 평가결과 조회 — 선택 탭에 밑줄

- 대상: src/components/custom/evaluation-result-list.tsx
    - src/components/custom/org-evaluation-history-list.tsx
- 변경:
    - 모형 탭 모양: 글자색만 다른 탭(TextTabs) → 선택한 탭 글자 아래 밑줄 2px(Tabs underline)
    - 이유: 글자색 차이만으로는 어느 탭이 선택됐는지 잘 보이지 않음
    - 쓰는 법: TextTabs 대신 Tabs + TabsScrollArea variant="underline" · 목록은 지금 고른 값의 TabsContent 하나로 감쌈
- 결과:
    - 선택한 탭이 밑줄로 바로 구분됨(이용약관 · 개인정보 처리방침과 같은 탭)
    - 좁은 화면에서는 탭이 줄바꿈 대신 좌우로 스크롤됨
- 영향 화면: [기업 평가결과 조회](/corp/mypage/evaluation-results)
    - [기관 평가결과 조회](/org/mypage/evaluation-history)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0c83fdb34abf2f6277f1e711a6642fc6901ce35d)

### [컴포넌트] 제출 전 최종 확인 · 작성 종료 모달

- 대상: src/components/composite/submit-confirm-dialog.tsx
    - src/components/composite/cancel-confirm-dialog.tsx
    - src/components/composite/evaluation-application-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/bulk-data-request-form.tsx
- 변경:
    - 제출 확인: 제목 "제출 전 최종 확인" + 닫기(X) · 물음 "최종 제출하시겠습니까?" · 안내 문구 · [제출하기] 하나
    - 작성 종료: 제목 "작성 종료" + 닫기(X) · 물음 "입력 화면을 나가시겠습니까?" · 안내 문구 · [계속 작성] [저장 후 나가기]
    - 입력 폼 두 곳: 모달 이름 주석만 수정
- 결과: props(open · onOpenChange · onSubmit · onSaveAndExit · defaultOpen)는 그대로라 쓰는 곳은 고칠 것 없음
- 영향 화면: [최종 확인 (KTRS-FM)](/corp/technology-evaluation/ktrs-fm/final-review)
    - [작성 취소 (KTRS-FM)](/corp/technology-evaluation/ktrs-fm/checklist/cancel-confirm)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f21461cacf6ef43650732be25f39d4ce44840e6f)

### [컴포넌트] 라디오 카드 — 설명을 그림 옆에 두는 배치 추가

- 대상: src/components/composite/radio-card.tsx
- 변경:
    - 새 prop descriptionPlacement: below(기본) · beside
    - below: 설명이 제목 · 그림 줄 아래 전체 폭 — 기존 화면은 그대로
    - beside: 설명이 제목 바로 아래, 그림 왼쪽 칸 — 카드 높이가 낮아짐
- 결과: 지금 beside 를 쓰는 화면은 평가진행방식 선택 하나 · 모바일은 두 배치 모두 세로로 쌓임
- 영향 화면: [라디오 카드](/component-guide/radio-card)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3ae01dfe09dfefc8e113d1e72238f02a4b5adb9b)

### [이미지교체] 평가진행방식 선택 — 카드 그림 · 디자인 배치

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/verification-progress/evaluation-method-form.tsx
- 변경:
    - 평가검증 하기 그림: rating-magnifier.webp → document-chart-magnifier.webp(92×82)
    - 개별평가 하기 그림: lightbulb-magnifier.webp → clipboard-check-chart.webp(92×92)
    - 그림 크기: 148×100 에 늘려 넣음(찌그러짐) → 148×100 자리 가운데에 원본 비율대로
    - 설명 위치: 그림 아래 전체 폭 → 제목 바로 아래 · 그림 왼쪽(descriptionPlacement="beside")
- 결과: 카드 높이 215 → 179(디자인 174 · 테두리 두께 차이)
- 영향 화면: [평가진행방식 선택](/org/individual-evaluation/verification-progress)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fdf10107fc0423433f2ce4d6ad8975ec19e6862c)

### [이미지교체] Tech-Index 평가모형 선택 — 창업 카드 그림

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/selection/tech-index-model-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/selection/tech-index-model-form.tsx
- 변경: 창업 카드 그림 lightbulb-magnifier.webp → building-lightbulb.webp(136×100)
- 영향 화면: [기업 평가모형 선택](/corp/technology-evaluation/tech-index/selection)
    - [기관 평가모형 선택](/org/individual-evaluation/tech-index/selection)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/18ac2106d27869acf160b913e40a7c893878ca60)

### [이미지교체] 특허 등급조회 · K-BIGx 소개 영역 그림

- 대상: src/components/custom/patent-grade-sections.tsx
    - src/components/custom/k-bigx-report-sections.tsx
- 변경:
    - 특허 등급조회: robot-donut-chart.webp → search-window-grade-badge.webp
    - K-BIGx 보고서: robot-donut-chart.webp → ai-robot-donut-chart.webp
- 영향 화면: [기업 특허 등급조회](/corp/patent-evaluation/patent-grade-list)
    - [기관 특허 등급조회](/org/patent-evaluation/patent-grade-list)
    - [기관 K-BIGx 대량 데이터 조회](/org/k-bigx-report/bulk-data-search)

## [신규 추가]

- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4fff5e5b0d4c6169c9ae04881e3b0b02b28341b8)

### [에셋] 선택 카드 · 소개 영역 그림

- 대상: public/images/option-card/building-lightbulb.webp
    - public/images/option-card/document-chart-magnifier.webp
    - public/images/option-card/clipboard-check-chart.webp
    - public/images/service-intro/search-window-grade-badge.webp
    - public/images/service-intro/ai-robot-donut-chart.webp
- 적용: 신규 파일 추가
- 내용: 그림 내용을 따른 이름이라 다른 화면에서도 그대로 씁니다. 선택 카드 그림은 option-card/, 소개 영역(440×240) 그림은 service-intro/ 에 둡니다.

## [덮어쓰기]

### 디자인 토큰 — 도넛 · 현금흐름 게이지 색

- 대상: tokens.json
- 적용: 지정한 파일만 교체한 뒤 yarn tokens 로 src/app/tokens.css 를 다시 만듭니다.
- 내용:
    - donut-1 ~ 8: 도넛 조각 색(라이트는 기존 값 · 다크는 밝은 단계)
    - cash-flow-cr-1 ~ 6 · cash-flow-cr-1 ~ 6-foreground: 현금흐름등급 칸 · 원호 색과 칸 글자 색
    - grade-scale-track: 등급 척도 게이지 원호 트랙
    - 다른 카드보다 먼저 적용합니다. 없으면 var(--ds-donut-*) 등이 비어 색이 사라집니다.

### theme 스타일 — 밑줄 탭 · 라디오 카드

- 대상: src/components/theme/tabs.variants.ts
    - src/components/theme/radio-card.variants.ts
- 적용: 지정한 파일만 교체
- 내용:
    - 탭: underline 변형 추가(선택 탭만 밑줄 2px) · text 변형은 그대로
    - 라디오 카드: 설명 옆 배치용 클래스(radioCardHeaderBesideClassName · radioCardTextGroupBesideClassName)
- 영향 화면: [탭](/component-guide/tabs)

### [문서] 컴포넌트 가이드

- 대상: src/app/component-guide/(guide) 폴더 전체
- 적용: (guide) 폴더 전체를 덮어쓰기
- 내용:
    - 차트 · 게이지 20종: 등장 시점 "절반 이상 보일 때"
    - 탭 · 텍스트 탭 · 목록 패턴: underline 변형 · TextTabs 는 서비스 화면 미사용
    - 다이얼로그: 제출 확인 · 작성 종료 모달 사용 기준
    - 라디오 카드: 설명 옆 배치 예시
    - 도넛 · 게이지 · 시맨틱 색상: 새 토큰 · 다크 색 · 단일 색 게이지
    - 소개 배너 · 비공개 정보: 새 그림 · 단위 규칙 예시
- 영향 화면: [탭](/component-guide/tabs)
    - [라디오 카드](/component-guide/radio-card)

## [삭제]

### [에셋] 쓰지 않는 그림

- 대상: public/images/option-card/rating-magnifier.webp
    - public/images/service-intro/robot-donut-chart.webp
- 적용: 파일을 삭제합니다.
- 내용: 새 그림으로 바꾼 뒤 쓰는 곳이 없습니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d8de876484d79368975298d076ec70e2037120c6)
