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

### [화면] 기관 가격정책 — 구매하기가 결제 불가 안내를 엽니다

- 대상: src/app/(user-type)/org/(service)/(logged-out)/pricing/page.tsx
- 변경:
    - PricingPolicy 에 isPurchaseUnavailable 을 줍니다. 결제 화면 주소(paymentHref)는 더 이상 넘기지 않습니다.
- 결과:
    - 기관회원이 [구매하기]를 누르면 결제 화면으로 가지 않고 결제 불가 안내 모달이 뜹니다.
    - 기관 결제하기 · 판매자 정보 · 결제 완료 화면은 삭제했습니다(아래 [삭제]).
- 영향 화면: [기관 가격정책](/org/pricing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ec229744cdb7a74f57d91383125868cb730cb9c0)

### [컴포넌트] 가격정책 — 구매할 수 없는 회원

- 대상: src/components/custom/pricing-policy.tsx
- 변경:
    - isPurchaseUnavailable prop 이 생겼습니다. 켜면 [구매하기]가 링크 대신 버튼이 되어 결제 불가 안내 모달(PaymentUnavailableDialog)을 엽니다.
    - paymentHref 는 기업처럼 결제 화면이 있을 때만 줍니다.
- 결과: 기업은 그대로 결제 화면(?plan=이용권)으로 이동합니다.
- 영향 화면: [기관 가격정책](/org/pricing)
    - [기업 가격정책](/corp/pricing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3ef64b9e2e252ea0b5d46439ebb311783b41eaaf)

### [데이터] 결제 문구 — 결제 불가 안내

- 대상: src/content/service/pricing-payment.ts
- 변경: 결제 불가 안내 모달의 문구(PAYMENT_UNAVAILABLE_TITLE · MESSAGE · GUIDE · CONTACT)가 생겼습니다.
- 결과: 문의전화(111-1111-1111)는 임시 번호라 확정된 번호로 바꿉니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5f73408f54bbd9272f6cebfc2bd9df970d534f6a)

### [컴포넌트] 이용약관 — 기술평가 약관에도 버전 셀렉트

- 대상: src/components/custom/terms-tabs.tsx
    - src/content/service/terms.ts
- 변경:
    - 기술평가 이용약관 탭에도 K-BIGx 이용약관과 같은 버전 셀렉트가 생겼습니다. 본문은 "추후 업데이트"입니다.
    - 셀렉트에서 고른 버전의 본문이 보입니다. 버전별 본문은 terms.ts 의 KBIGX_TERMS_BY_VERSION · TECH_TERMS_BY_VERSION 표에서 꺼냅니다.
- 결과:
    - 개정본이 생기면 버전 목록(TERMS_VERSIONS · TECH_TERMS_VERSIONS)과 본문 표에 같은 value 로 한 줄씩 더합니다.
    - 본문 표에 없는 버전은 "추후 업데이트"가 보입니다.
- 영향 화면: [기업 이용약관](/corp/terms)
    - [기관 이용약관](/org/terms)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8b7aa9f1cee65b6208d42cf94fff22ea92227cde)

### [컴포넌트] K-BIGx 보고서 문서 — 머리 · 탭 줄 고정 · PC 최소 폭 · 다크 차트 색

- 대상: src/components/custom/innovation-growth-report-document.tsx
- 변경:
    - 머리 · 구성 항목 탭 줄: PC(768px 이상)에서 스크롤해도 화면 위에 고정(sticky) · 모바일 · 인쇄는 고정 안 함
    - PC 전용 탭 최소 폭: 1280 → 1200(min-w-content) · 1280 창에서 가로 스크롤 없음
    - 로딩 자리(스켈레톤): 신용/재무 · 활동성 · Tech-Index 탭을 실제 화면과 같은 짜임으로
    - 탭 제목 띠: section.title 이 있으면 그 글자로 표시(Tech-Index)
    - [보고서 출력] 버튼: 동작 없음(템플릿 결정 전) · 연결 지점을 주석으로 표시
    - 다크 차트 색(보고서 공통 규칙): 계열 색 var(--ds-report-series-1~6) · 그 밖 인라인 색 var(--ds-<색>-<단계>) · 비교용 회색 막대 var(--ds-muted) · 도넛 조각은 라이트와 같은 고정 색
- 결과:
    - 라이트: 변화 없음
    - 다크: 막대 · 선 · 축 글자가 카드 위에서 보임
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 보고서 결과](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [머리 · 탭 줄 고정 변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/771397961006d32dd3ec887836e6bd6e53bbf8c7)
    - [이번 변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2b0b70cc7fd8c4cf437280994b22a6f242491cd8)

### [화면] 서비스 페이지 본문 바탕 — 다크 모드

- 대상: src/app/(user-type)/corp/(service) 아래 page.tsx(main 이 bg-surface · bg-card 이던 파일)
    - src/app/(user-type)/org/(service) 아래 page.tsx(같은 조건)
    - src/components/custom/auth-flow-page.tsx
    - src/components/custom/full-page-service-status.tsx
- 변경: main 의 바탕 클래스를 bg-page 로 바꿨습니다(한 줄씩).
- 결과:
    - 라이트는 그대로 흰색, 다크는 gray.900 이라 그 위의 카드(gray.800)와 구분됩니다.
    - [덮어쓰기]의 "디자인 토큰" 카드(page 토큰)와 함께 적용합니다.
    - 파일 목록은 `git grep -l 'className="bg-page flex-1"' src` 로 찾습니다.
- 영향 화면: [평가모형 선택](/corp/home/technology-evaluation-model-selection)
    - [평가진행방식 선택](/org/individual-evaluation/verification-progress)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b50ab2878ba0a1bad013ed8bfcaeb2624d23deb1)

### [컴포넌트] 헤더 — 다크 바탕

- 대상: src/components/composite/header.tsx
- 변경: 고정 헤더 바탕을 bg-card 에서 bg-page 로 바꿨습니다. 메인페이지의 겹쳐 뜨는 헤더(overlay)는 그대로 바탕이 없습니다.
- 결과: 다크에서 헤더가 본문과 같은 gray.900 입니다. 라이트 · 메인페이지는 그대로입니다.
- 영향 화면: [메인페이지](/corp/home)를 제외한 모든 화면의 다크 모드 헤더
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/89eeed62faab63fd75311b15b3e7b6110eadfbb0)

### [컴포넌트] 기업 리포트 레이아웃 — K-BIGx 보고서 테마

- 대상: src/app/(user-type)/corp/(report)/layout.tsx
- 변경: 바깥 상자를 ReportThemeScope 로 바꿨습니다([신규 추가] 카드).
- 결과:
    - K-BIGx 보고서(새 창)는 기존 화면의 테마(라이트 · 다크)를 따릅니다.
    - 인쇄물 템플릿이 아직 정해지지 않아 [보고서 출력]은 작업 전이고, 인쇄할 때 라이트로 바뀌는 것만 적용해 두었습니다.
    - 평가결과 · 특허 등급 리포트는 지금처럼 라이트 고정입니다.
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/afc44dcf68a464dacb8b0abf56b3a983d5561fb1)

### [컴포넌트] K-BIGx 보고서 — 신용/재무정보 · 활동성정보 탭

- 대상: src/components/custom/innovation-growth-report-credit.tsx
    - src/components/custom/innovation-growth-report-activity.tsx
    - src/components/custom/innovation-growth-report-parts.tsx
- 변경:
    - 비율 카드: 단위를 "단위: …" 줄로 표시 · 범례를 아래 가운데로
    - 차입 섹션: 카드로 감쌈
    - 현금흐름등급 게이지: 설명 글자 없이 등급만 · 척도 양끝 이름 "취약 · 우수"
    - 이전평가이력 표: 최신순 정렬 후 첫 건(현재 등급) 제외
    - 인력 표: 카드 안에 단위와 함께 배치
    - 에너지 카드: 보고서 선 스타일(REPORT_LINE_STYLES) · 범례를 아래 가운데로
    - 다크 차트 색: 계열 색 report-series · 현금흐름등급 칸(CR-1~6) · 도넛 조각은 고정 색(문서 카드의 공통 규칙)
- 결과: 정렬 · 최대 건수 규칙은 각 파일의 [프론트엔드 연동] 주석을 따릅니다.
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=credit-finance)
    - [활동성정보](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=activity)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8a831a08c69c9ea935ffd4a46dc906dd2833702b)

### [컴포넌트] K-BIGx 보고서 — 기업현황 · 기술혁신정보 · Tech-Index 탭

- 대상: src/components/custom/innovation-growth-report-company.tsx
    - src/components/custom/innovation-growth-report-tech.tsx
    - src/components/custom/innovation-growth-report-tech-index.tsx
- 변경:
    - 기업현황 탭: 표 최대 건수 주석 · 겹친 막대 바탕 var(--ds-muted)
    - 기술혁신정보 탭: 표 노출 건수 · 정렬 규칙 주석([프론트엔드 연동]) · 특허명 2줄 말줄임
    - Tech-Index 탭: 지수설명 카드 · 평가일자 추가 · 역량별 막대 색을 id 기준으로
    - 다크 차트 색: 나비 막대 · Tech-Index 막대 계열 색 report-series(문서 카드의 공통 규칙)
- 영향 화면: [기업현황](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=company)
    - [기술혁신정보](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=innovation)
    - [Tech-Index](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=tech-index)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/efa1a68977d872c95228b04a747f219a01589703)

### [데이터] K-BIGx 보고서 목업 · 등급 색 단계

- 대상: src/content/service/k-bigx-innovation-report.ts
    - src/content/service/cri-grades.ts
- 변경:
    - 목업: 최대 건수로 채움(우수특허 12 · R&D 전문기관 각 12 · 과제 10 · 긴 특허명) · [퍼블리싱 확인용] 표시
    - 정렬 · 최대 건수 규칙: [프론트엔드 연동 · 정렬] · [프론트엔드 연동 · 최대 N건] 주석
    - 워드클라우드 팔레트: report-series 토큰
    - cri-grades.ts toCriRatingData: 등급 코드로 색 단계(tone: cr1~cr6) 결정
- 결과: 연동 시 [퍼블리싱 확인용] 목업을 API 응답으로 바꿉니다.
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c6a1c2d84f5a4b15bce03bf8bd728f0a99684020)

### [컴포넌트] 보고서 차트 공통 — 등장 애니메이션

- 대상: src/app/globals.css
    - src/components/custom/column-chart.tsx
    - src/components/custom/combo-bar-line-chart.tsx
    - src/components/custom/grouped-column-chart.tsx
    - src/components/custom/overlay-column-chart.tsx
    - src/components/custom/grade-history-chart.tsx
    - src/components/custom/grade-trend-chart.tsx
    - src/components/custom/grade-distribution-chart.tsx
    - src/components/custom/positioning-scatter-chart.tsx
    - src/components/custom/comparison-radar-chart.tsx
    - src/components/custom/segment-meter.tsx
    - src/components/custom/ratio-stack-bar.tsx
    - src/components/custom/butterfly-bar-chart.tsx
    - src/components/composite/chart-skeleton.tsx
    - src/components/composite/grade-scale-gauge-skeleton.tsx
- 변경:
    - animate prop: 안 주면 useChartAnimation()(chart-reveal.tsx) 값을 따름
    - 보고서 차트: 카드가 화면에 들어올 때 한 번 움직임
    - globals.css: 차트 등장 움직임(wipe · pop · rise · label) · 대기 중 숨김 규칙 추가
    - 막대 위 값 글자: 막대가 다 그려진 뒤 나타남
    - recharts 키보드 탐색 층: 끔(값은 숨김 표 · role="img" 이름이 읽음)
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e4bccd336964b969913dd9d31666c7f87fc641d8)

### [컴포넌트] 라인 차트 · 도넛 차트

- 대상: src/components/custom/line-chart.tsx
    - src/components/custom/percentage-donut-chart.tsx
- 변경:
    - LineChart 범례 위치: legendPlacement('bottom' · 'bottom-center' · 'top-end') 추가
    - LineChart 표시 옵션: showUnitLabel · isValueFractionFixed 추가
    - LineChart 그래프 높이: 140~200 단계 추가
    - PercentageDonutChart 툴팁: 조각의 분류명만 가운데 표시(비중 · 값은 범례에 있음)
    - PercentageDonutChart 조각 색: donutColorsFor(항목 수)로 지정
- 영향 화면: [라인 차트](/component-guide/line-chart)
    - [도넛 차트](/component-guide/percentage-donut-chart)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/294feb20ecb0acdc2677f32e489d0c4ae9d3d249)

### [컴포넌트] 게이지 — 색 단계 · 트랙 · 등급 칸 글자

- 대상: src/components/custom/arc-gauge.tsx
    - src/components/custom/arc-gauge-shape.ts
    - src/components/custom/score-gauge.tsx
    - src/components/custom/semicircle-rating-gauge.tsx
    - src/components/custom/grade-scale-gauge.tsx
- 변경:
    - SemicircleRatingGauge 색: tone(cr1~cr6)으로 그라데이션 선택
    - ScoreGauge 색: 상태별 시작 · 끝 색(gradientTo) 사용
    - GradeScaleGauge 설명 글자: description="" 이면 등급만 표시(글자 높이는 그대로)
    - GradeScaleGauge 밝은 칸 글자: grade-scale-chip-foreground(다크도 짙은 색)
    - 원호 빈 트랙: gauge-track 토큰(다크에서 카드와 구분)
- 영향 화면: [등급 원호 게이지](/component-guide/semicircle-rating-gauge)
    - [등급 척도 게이지](/component-guide/grade-scale-gauge)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c0ee2c37fb3cbf8d1f3d60bb1a2d91450215a119)

### [컴포넌트] 워드클라우드 — 키워드 수에 맞춰 글자 크기 자동 조절 · 키워드 누락 없이 모두 표시

- 대상: src/components/custom/word-cloud.tsx
- 변경:
    - 글자 크기: 키워드 수에 맞춰 자동 조절해 상자를 채움
    - 키워드 표시: 받은 키워드를 하나도 빼지 않음
    - 긴 단어: 화면에서만 말줄임(…) · 툴팁 · 숨김 목록은 전체 단어
    - 다시 그릴 때: 같은 단어 · 같은 크기면 맞춘 결과를 기억해 깜빡임 없음
    - 캔버스: willReadFrequently 로 만들어 브라우저 경고 없음
- 결과:
    - words 넘기는 법: 중요도 높은 순 · text 중복 없이(파일 머리 [프론트엔드 연동])
    - 그린 수 확인: canvas 의 data-drawn-words
- 영향 화면: [기업 K-BIGx 보고서 — 진단브리핑 R&D 이슈](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기업 K-BIGx 보고서 — 기술혁신정보 맞춤형 기술정보-R&D](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=innovation)
    - [기관 K-BIGx 보고서 — 진단브리핑 R&D 이슈](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 보고서 — 기술혁신정보 맞춤형 기술정보-R&D](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=innovation)
    - [워드클라우드](/component-guide/word-cloud)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/23d667df7a8092bbc2397d4b002234cebaed7199)

### [컴포넌트] 등급 매트릭스 · 성장률 막대 · 피라미드 · 레이더 · 분포 곡선 — 다크 대비

- 대상: src/components/custom/rating-matrix.tsx
    - src/components/custom/diverging-rank-chart.tsx
    - src/components/custom/rank-pyramid-chart.tsx
    - src/components/custom/tech-index-radar-style.ts
    - src/components/custom/comparison-radar-style.ts
    - src/components/custom/distribution-curve-chart.tsx
- 변경:
    - 등급 표시 원은 rating-marker-_, 성장률 막대 · 별은 rank-bar-_ 시맨틱 토큰입니다(흰 글자 · 체크가 있어 다크에서도 짙은 색).
    - 레이더 눈금은 subtle-3, 축 글자는 label-foreground, 계열 · 피라미드 지시선 · 분포 글자는 var(--ds-<색>-<단계>) 입니다.
    - 등장 애니메이션: 성장률 막대 · 피라미드도 useChartAnimation() 연결(보고서 차트 공통 카드와 같은 방식)
- 결과: 라이트는 그대로이고 다크에서 체크 · 글자 · 선이 보입니다.
- 영향 화면: [등급 매트릭스](/component-guide/rating-matrix)
    - [성장률 막대](/component-guide/diverging-rank-chart)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4e2b7ae6045db4256cd4c28f6a62ee2d6c16a00e)

### [컴포넌트] 평가모형 선택 카드 — 다크 색

- 대상: src/components/custom/evaluation-model-selection.tsx
- 변경: 카드 면 · 약칭 · 그라데이션 테두리를 원시 팔레트 클래스(bg-mint-100 등) 대신 model-card-* 시맨틱 토큰으로 바꿨습니다.
- 결과: 라이트는 그대로이고, 다크에서 설명 글자 대비가 4.5:1 이상입니다(WAVE 저대비 오류 해소).
- 영향 화면: [평가모형 선택](/corp/home/technology-evaluation-model-selection)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ed6cfddefc8d31679a599b32b20399b010212bf4)

### [컴포넌트] 특허 검색 폼 · 첨부 파일 칸

- 대상: src/components/composite/select-search-form.tsx
    - src/components/composite/attach-field.tsx
- 변경:
    - 검색 기준 셀렉트(특허등록번호 등)의 바탕을 라이트 · 다크 모두 투명으로 했습니다(data-[slot=select-trigger]:bg-transparent).
    - 첨부 파일 칸 바탕을 입력 칸과 같은 bg-field 로 바꿨습니다.
- 영향 화면: [특허 등급조회](/corp/patent-evaluation/patent-grade-list)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/42d8c0158824764da076f26c60af05656cb622bf)

### [데이터] 평가 진행 상태 — 색 주석

- 대상: src/constants/evaluation-result.ts
- 변경: 주석만 바꿨습니다(평가완료 색 이름 extra.azure · 다크 값 반영). 동작은 같습니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/29807b4f0dcdfdee920c4a2511831c5aa173f15a)

## [신규 추가]

### [컴포넌트] 결제 불가 안내 모달

- 대상: src/components/composite/payment-unavailable-dialog.tsx
- 적용: 신규 파일 추가
- 내용:
    - 오류 아이콘 → 안내 문구 → 문의전화 → [확인] 순서의 모달입니다. 닫기(X) 없이 [확인]으로만 닫힙니다.
    - 모달을 여는 버튼은 children 으로 넘깁니다(예: 가격정책의 [구매하기]). defaultOpen · open 으로도 열 수 있습니다.
    - 좁은 화면(360)에서는 좌우 여백이 줄고 문구가 폭에 맞게 접힙니다.
- 영향 화면: [기관 가격정책](/org/pricing)

### [화면] 결제 불가 팝업 단독 화면

- 대상: src/app/(user-type)/org/(service)/(logged-out)/pricing/payment-unavailable
- 적용: 신규 파일 추가
- 내용: 결제 불가 안내 모달만 따로 확인하는 화면입니다. [기관 가격정책](/org/pricing)에서 모두 확인할 수 있어 연동할 때 지워도 됩니다.
- 영향 화면: [결제 불가 팝업](/org/pricing/payment-unavailable)

### [컴포넌트] 리포트 테마 범위

- 대상: src/components/custom/report-theme-scope.tsx
- 적용: 신규 파일 추가
- 내용:
    - 기업 리포트 레이아웃이 경로로 테마 범위를 정합니다. /corp/k-bigx-report/ 아래는 화면 테마를 따르고(인쇄는 .print-light 로 라이트), 나머지 리포트는 .light 고정입니다.
    - 테마를 따르는 리포트를 늘리려면 파일 안 THEME_FOLLOWING_REPORT_PREFIXES 에 경로를 더합니다.
- 영향 화면: [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)

### [컴포넌트] 차트 등장 시점 · 도넛 색 단계

- 대상: src/components/custom/chart-reveal.tsx
    - src/components/custom/percentage-donut-colors.ts
- 적용: 신규 파일 추가
- 내용:
    - ChartRevealProvider 로 감싼 영역의 차트는 카드가 화면에 들어올 때 움직입니다. 차트는 useChartAnimation() 으로 이 값을 읽습니다.
    - donutColorsFor(항목 수 2~8)가 도넛 조각 색(진한 순, 고정 색)을 돌려줍니다. 항목은 비중 내림차순으로 넣습니다.

### [에셋] 보고서 이미지 아이콘

- 대상: public/images/icons/bar-chart.webp
    - public/images/icons/building.webp
    - public/images/icons/coins.webp
    - public/images/icons/document-check.webp
    - public/images/icons/gauge.webp
    - public/images/icons/lightbulb.webp
- 적용: 신규 파일 추가
- 내용: K-BIGx 보고서 탭 제목 띠 · 지표 카드에서 쓰는 이미지 아이콘입니다. 쓰는 법은 아이콘 가이드의 이미지 아이콘 절에 있습니다.
- 영향 화면: [아이콘](/component-guide/icon)

## [덮어쓰기]

### [문서] 퍼블리싱 인덱스 — 기관 결제 불가 팝업

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
- 적용: 지정한 파일만 교체
- 내용: 기관 결제 불가 팝업을 완료로 바꾸고, 삭제한 기관 결제하기 · 판매자 정보 · 결제 완료 행을 뺐습니다.
- 영향 화면: [시작 페이지](/)

### [문서] 버전 업데이트 — 릴리스 날짜 보정

- 대상: src/content/publishing-guide/release-notes.generated.json
    - src/content/publishing-guide/release-notes-archive.generated.json
- 적용: 지정한 파일만 교체
- 내용:
    - 이전 릴리스 17건(v3.0.0 ~ v3.3.8)의 날짜가 하루 앞서 있어 릴리스 당일(한국 날짜)로 바로잡았습니다.
    - 앞으로 릴리스는 만든 날(한국 날짜)이 기록됩니다.
- 영향 화면: [시작 페이지](/)
    - [버전 업데이트 아카이브](/component-guide/release-archive)

### 디자인 토큰 — 다크 값 · 새 토큰 · 인쇄용 라이트

- 대상: tokens.json
    - scripts/build-tokens.mjs
- 적용: 지정한 파일만 교체한 뒤 yarn tokens 로 src/app/tokens.css 를 다시 만듭니다.
- 내용:
    - 시맨틱 다크 값을 디자인 Dark 값에 맞췄습니다(57개). 메인페이지 테마 값은 그대로입니다.
    - 새 토큰: page · field · gauge-track · report-series-1~6 · rating-marker-* · rank-bar-* · grade-scale-chip-foreground · model-card-*.
    - 단계 없는 단일 색을 common 에서 extra 그룹으로 옮기고 색 이름으로 바꿨습니다(예: gauge-cyan → extra.cyan). shadow-1 다크 색은 라이트와 같은 검정 5% 입니다.
    - 생성기가 extra 그룹과 인쇄 전용 라이트 블록(@media print .print-light)을 만듭니다.
    - 다른 카드보다 먼저 적용합니다. 새 토큰이 없으면 bg-page · bg-field 등의 클래스가 생기지 않습니다.

### theme 스타일 — 입력 칸 바탕 · 차트 툴팁

- 대상: src/components/theme/input.variants.ts
    - src/components/theme/textarea.variants.ts
    - src/components/theme/select.variants.ts
    - src/components/theme/input-group.variants.ts
    - src/components/theme/combobox.variants.ts
    - src/components/theme/chart-tooltip.variants.ts
- 적용: 지정한 파일만 교체
- 내용:
    - 입력 칸 바탕을 bg-field 로 바꿨습니다(다크 gray.900). 선택 상자는 셸의 다크 반투명 배경(dark:bg-input/30)을 dark:bg-field 로 덮습니다.
    - 차트 툴팁 폭은 글자만큼(w-fit · min-w-0)입니다.
- 영향 화면: [인풋](/component-guide/input)

### [문서] 컴포넌트 가이드 — 차트 · 색상 · 아이콘 · 접근성 예외

- 대상: src/app/component-guide/(guide) 폴더 전체
    - src/components/custom/gauge-tone-table.tsx
- 적용: (guide) 폴더 전체와 지정한 파일을 덮어쓰기
- 내용:
    - 차트 · 게이지 가이드: 바뀐 사용법 · 보고서 계열 색(report-series) 예시로 갱신
    - 워드클라우드 가이드: 단어 수별 · 긴 단어 예시 추가
    - 아이콘 가이드: lucide · 이미지 아이콘 두 절로 나누고 이미지 아이콘 쓰는 법 추가
    - 색상 가이드: Extra 절(단계 없는 단일 색) 추가
    - 시맨틱 색상 가이드: 새 토큰(page · field · report-series 등) 추가
    - 접근성 예외 가이드: 검사 방식(주소로 검사) 설명 · 새 검사기 문구 · 상세 목록 번호와 건수 요약 · 삭제된 화면 제외 · 결제 불가 팝업 추가
    - gauge-tone-table.tsx: 게이지 가이드 전용 색 단계표(서비스 화면 미사용)
- 영향 화면: [접근성 검사 예외사항](/component-guide/accessibility-exceptions)

### [문서] 퍼블리싱 데이터 — 시맨틱 색 원본 · 화면 목록

- 대상: src/content/publishing-guide/semantic-colors.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체
- 내용: 디자인 시맨틱 색(라이트 · 다크) 원본을 새로 뽑고, 삭제한 기관 결제 화면을 화면 목록에서 뺐습니다.

## [삭제]

### [화면] 기관 결제하기 · 판매자 정보 · 결제 완료

- 대상: src/app/(user-type)/org/(service)/(logged-out)/pricing/payment
- 적용: 폴더를 삭제합니다(page.tsx · complete · seller-info).
- 내용:
    - 기관회원은 이용권을 직접 구매할 수 없어 세 화면을 지웠습니다.
    - 결제 화면 컴포넌트(PricingPayment · SellerInfoDialog 등)는 기업이 쓰므로 그대로 둡니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ffb5f29f2561637a3b4d990d07a30b38b5396c0d)
