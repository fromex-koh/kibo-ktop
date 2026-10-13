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

### [컴포넌트] K-BIGx 보고서 — 카드 단위 텍스트를 제목 옆에서 제목 아래 줄로

- 대상: src/components/custom/innovation-growth-report-parts.tsx
    - src/components/custom/innovation-growth-report-company.tsx
    - src/components/custom/innovation-growth-report-tech.tsx
    - src/components/custom/innovation-growth-report-activity.tsx
    - src/components/custom/innovation-growth-report-document.tsx
- 변경:
    - AS-IS: 단위 텍스트(예: 단위: 백만원)가 카드 제목과 같은 줄 오른쪽 끝(활동성정보) · 다른 탭은 제목에서 16px 떨어진 줄
    - TO-BE: 모든 카드에서 단위 텍스트가 제목 바로 아래 줄 오른쪽(간격 0) — 그 아래 4px 뒤에 표 · 그래프
    - 적용 카드: 진단브리핑 3 · 기업현황 7 · 기술혁신정보 2 · 활동성정보 4
    - 적용 방법: Card 에 className="gap-0" · 표 · 그래프를 WithUnit 으로 감쌈(규칙 설명은 parts.tsx 의 WithUnit 주석)
    - 함께 바뀐 것: 경영진 현황 최대 10건 표시 · 이미 본 탭은 차트 애니메이션 없이 바로 표시 · Card revealGroup prop 추가(같은 값끼리 차트 동시 등장) · 로딩 스켈레톤도 같은 배치
- 결과: 모든 탭에서 단위 텍스트가 제목 아래 줄에 보임
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 보고서 결과](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f4fc70022297f80ecc4032b2b1c9077472b54ef1)

### [컴포넌트] K-BIGx 보고서 — 신용/재무정보 탭: 단위 위치 · 등급 설명 문구 · 다크 모드 색

- 대상: src/components/custom/innovation-growth-report-credit.tsx
- 변경:
    - 단위 텍스트 위치
        - AS-IS: 제목에서 16px 떨어진 줄에 단위(예: 단위: %)
        - TO-BE: 제목 바로 아래 줄에 단위 — 첫 번째 카드와 같은 규칙(재무비율진단 4 · 차입금 2 · 차입금 현황 3)
    - 기업신용등급 아래 설명 상자
        - AS-IS: 목업에 적어 둔 고정 문구(ratingSummary)를 그대로 표시 — 등급이 바뀌어도 문구는 그대로
        - TO-BE: 지금 등급 코드로 등급 정의표(cri-grades.ts)를 찾아 그 정의를 표시 — 표에 없는 코드면 상자를 숨김
    - 현금흐름등급 게이지 색
        - AS-IS: 칸 · 원호 색이 고정 색(--raw-*)이라 다크 모드에서도 라이트 색 그대로
        - TO-BE: cash-flow-cr-1~~6 토큰(칸 · 원호) + cash-flow-cr-1~~6-foreground(칸 글자) — 다크 모드에서 다크 전용 색
    - 비공개 자리 표시 도넛 색: 고정 색(--raw-*) → donut-<n> 토큰(다크 모드 대응)
    - 간격: 기관별 비중 표 ↔ 도넛 48 → 24px · 신용/담보 비중 그래프 ↔ 비율 막대 16 → 24px
    - 차트 애니메이션: 신용/담보 비중 · 담보 현황(같은 줄 두 카드)이 따로 → 동시에 움직임
- 결과:
    - 연동 시 등급 코드만 넘기면 설명 상자 문구가 등급에 맞게 자동으로 바뀜
    - 다크 모드에서 현금흐름등급 게이지가 카드 바탕 위에서도 또렷이 보임
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 보고서 결과](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/69d0ca8ce7ec314b92c477e8feb5dc0711d26477)

### [컴포넌트] K-BIGx 보고서 — Tech-Index 탭 차트 애니메이션 순서

- 대상: src/components/custom/innovation-growth-report-tech-index.tsx
- 변경:
    - 애니메이션 순서: 카드 한 장씩 차례로 → 같은 줄 카드가 동시에
    - 4대 혁신역량 점수: 4장이 동시에 움직임
    - 기업 유형별 4대 혁신역량 비교 · 세부지표별 상대비교분석: 2장씩(한 줄) 동시에 움직임
- 결과: 카드 1장씩 차례로 움직이던 차트 애니메이션이, 같은 줄에 있는 카드끼리 동시에 움직임
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

### [컴포넌트] 도넛 차트 — 다크 모드 색 추가

- 대상: src/components/custom/percentage-donut-colors.ts
- 변경:
    - AS-IS: 조각 색이 고정 색이라 다크 모드에서도 라이트 색 그대로 → 어두운 카드 위에서 조각이 잘 구분되지 않음
    - TO-BE: 다크 모드 전용 색 추가(donut-1 ~ 8 토큰) — 라이트 색은 그대로
- 결과: 다크 모드에서 도넛 조각이 밝은 색으로 바뀌어 또렷이 구분됨 · 색을 직접 적어야 하면 var(--ds-donut-<n>) 사용
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/71b52db7ffdb8d9082127ae32c2d6268d68fb606)

### [컴포넌트] 기업신용등급 게이지 — 등급별 색 → 한 가지 색

- 대상: src/components/custom/semicircle-rating-gauge.tsx
- 변경:
    - AS-IS: 등급마다 게이지 색이 달랐음(6가지 색)
    - TO-BE: 등급과 관계없이 파랑 그라데이션 한 가지 색(라이트 · 다크 동일)
    - tone prop 삭제 — 넘기던 곳이 있으면 지우면 됨
- 결과: 등급 차이는 색이 아니라 게이지가 채워진 길이와 가운데 등급 글자로 보여 줌
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b8a10c7c405a214e3ddadc867f6b2883c5eae0fc)

### [컴포넌트] 현금흐름등급 게이지 차트 — 다크 모드 색 추가

- 대상: src/components/custom/grade-scale-gauge.tsx
    - src/components/custom/arc-gauge.tsx
- 변경:
    - AS-IS: 다크 모드에서도 라이트 색 그대로 → 어두운 카드 위에서 등급 칸 · 게이지가 잘 안 보임
    - TO-BE: 다크 모드 전용 색 추가 — 등급 칸 · 게이지는 밝은 색, 칸 글자는 칸 색에 맞춰 짙은 색
    - 게이지 빈 부분(트랙)도 다크에서 조금 밝게 — 어두운 등급(CR-5) 색이 묻히지 않게
    - 새 prop(선택): 등급 칸 foreground(칸 글자 색) · ArcGauge trackColor(빈 부분 색) — 안 넘기면 기존 그대로
- 결과: 다크 모드에서 현금흐름등급 칸과 게이지가 또렷이 보임 · 라이트 모드와 다른 게이지는 변화 없음
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
    - 주주 현황: 목업 10건 → 4건 — 보고용 화면이 깔끔해 보이도록 목업만 줄임
    - 기업신용등급: 목업 등급 AA0 → BBB0 — 보고용 화면이 깔끔해 보이도록 목업만 바꿈
    - 기업신용등급 설명 문구(ratingSummary) 삭제 — 이제 등급 정의표에서 자동으로 가져옴
    - 기관별 비중 · 담보 현황 도넛 색: 다크 모드 색이 있는 donut 토큰으로
- 결과: 화면에 보이는 최대 건수는 그대로(경영진 · 주주 · 관계기업 최대 10건) · 연동 시 목록은 자르지 않고 그대로 보내면 됨
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c86a0bb696fa20aeffbf1581ef82da46ce662c1b)

### [컴포넌트] 가격정책 — 스탠다드 상시 강조 → 카드 hover 강조

- 대상: src/components/custom/pricing-policy.tsx
    - src/content/service/pricing.ts
- 변경:
    - AS-IS: 스탠다드 카드만 항상 강조(파란 테두리 · 채운 [구매하기])
    - TO-BE: 상시 강조 해제 → 네 카드 모두 마우스를 올리거나 키보드로 버튼에 포커스하면 같은 강조 스타일
    - isRecommended(강조 표시 데이터) 삭제
- 영향 화면: [기업 가격정책](/corp/pricing)
    - [기관 가격정책](/org/pricing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fad31f044c3e357d28c60584e9f79aa37666b1ac)

### [컴포넌트] 이용약관 · 개인정보 처리방침 — 탭 모양 교체(글자색 탭 → 밑줄 탭)

- 대상: src/components/custom/terms-tabs.tsx
    - src/components/custom/privacy-policy-tabs.tsx
    - src/components/composite/tabs-scroll-area.tsx
- 변경:
    - AS-IS: TabsScrollArea variant="text" — 선택한 탭이 글자색만 달라 잘 안 보임
    - TO-BE: TabsScrollArea variant="underline" — 선택한 탭 아래에 밑줄(컴포넌트는 그대로, variant 값만 교체)
    - 탭이 많아 좌우로 넘길 때 가장자리 흐림 효과: 흰색 덮개 → 탭 글자 자체를 흐리게
- 결과: 선택한 탭이 바로 구분됨
- 영향 화면: [기업 이용약관](/corp/terms)
    - [기업 개인정보 처리방침](/corp/privacy-policy)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5e664f0bacffb9a0370349699992036ecc846d96)

### [컴포넌트] 평가결과 조회 — 탭 컴포넌트 교체(TextTabs → Tabs 밑줄 탭)

- 대상: src/components/custom/evaluation-result-list.tsx
    - src/components/custom/org-evaluation-history-list.tsx
- 변경:
    - AS-IS: TextTabs(composite/text-tabs) — 선택한 탭이 글자색만 달라 잘 안 보임
    - TO-BE: Tabs(ui/tabs) + TabsScrollArea variant="underline" — 선택한 탭 아래에 밑줄
    - TextTabs 컴포넌트 자체는 그대로 남아 있음(지금은 쓰는 화면 없음)
- 결과: 선택한 탭이 바로 구분됨 · 이용약관 · 개인정보 처리방침과 같은 탭 · 좁은 화면에서는 좌우로 넘어감
- 영향 화면: [기업 평가결과 조회](/corp/mypage/evaluation-results)
    - [기관 평가결과 조회](/org/mypage/evaluation-history)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0c83fdb34abf2f6277f1e711a6642fc6901ce35d)

### [컴포넌트] 제출 전 최종 확인 · 작성 종료 모달

- 대상: src/components/composite/submit-confirm-dialog.tsx
    - src/components/composite/cancel-confirm-dialog.tsx
    - src/components/composite/evaluation-application-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/bulk-data-request-form.tsx
- 변경:
    - 제출 확인 모달
        - AS-IS: 가운데 물음 "제출하시겠습니까?" + [취소] [제출] (제목 · 닫기(X) · 안내 문구 없음)
        - TO-BE: 제목 "제출 전 최종 확인" + 닫기(X) → 물음 "최종 제출하시겠습니까?" → 안내 "입력한 내용을 최종 제출합니다. 제출 전 입력한 정보가 정확한지 다시 한번 확인해 주세요. 제출 후에는 수정이 불가합니다." → [제출하기] 하나(취소는 닫기(X) · Esc)
    - 작성 종료 모달
        - AS-IS: 가운데 물음 "평가 진행을 중단하시겠습니까?" + [계속작성] [저장하고 나가기] (제목 · 닫기(X) · 안내 문구 없음)
        - TO-BE: 제목 "작성 종료" + 닫기(X) → 물음 "입력 화면을 나가시겠습니까?" → 안내 "현재까지 작성한 내용은 자동으로 저장되었습니다. 입력 화면을 나가도 나중에 이어서 작성할 수 있습니다." → [계속 작성] [저장 후 나가기]
    - 입력 폼 두 곳(evaluation-application-form · bulk-data-request-form): 모달 이름 주석만 수정
- 결과: props(open · onOpenChange · onSubmit · onSaveAndExit · defaultOpen)는 그대로라 쓰는 곳은 고칠 것 없음
- 영향 화면: [최종 확인 (KTRS-FM)](/corp/technology-evaluation/ktrs-fm/final-review)
    - [작성 취소 (KTRS-FM)](/corp/technology-evaluation/ktrs-fm/checklist/cancel-confirm)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f21461cacf6ef43650732be25f39d4ce44840e6f)

### [컴포넌트] 라디오 카드 — prop 추가: descriptionPlacement(설명 위치)

- 대상: src/components/composite/radio-card.tsx
- 변경: descriptionPlacement prop 추가 — 설명 문구 위치를 고를 수 있음
    - "below"(기본값): 설명이 제목 · 그림 아래 — 지금까지와 같음
    - "beside": 설명이 제목 바로 아래(그림 왼쪽) — 카드 높이가 낮아짐
- 결과: prop 을 안 넘기면 기존과 같아 쓰는 곳은 고칠 것 없음 · 지금 "beside" 를 쓰는 화면은 평가진행방식 선택 하나
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
