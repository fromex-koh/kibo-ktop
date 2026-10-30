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

# 작업: 다크모드 색 · PDF 그래프 색 토큰 추가(가장 먼저 적용)

## [Diff 확인]

### [토큰] 소개 화면 다크 색 추가 · PDF 꺾은선 색 변경 — 적용 후 yarn tokens 실행

- 대상: tokens.json
- 변경:
    - 새 토큰: platform-audience · platform-carousel 2종 · platform-kbigx-flow 5종 · service-hero-navy 3종 · service-glass-border · procedure-step-number · rolling-accordion-surface · rolling-accordion-marker · service-hero-marker · platform-connector · platform-icon-surface · platform-kbigx-source-icon-surface · chip-marquee-hover · chip-marquee-hover-border
    - 다크 값 변경: service-accent-green · service-hero-green 계열 · service-target-band · service-glass-border · chip-marquee 계열 · pill-tab 계열
    - 단일 색(extra): nightfall(#0B1640) 추가
    - 투명도: white 90 추가
    - PDF 템플릿 색: chart-trend 를 navy.500 → extra.nightfall 로 변경
- 결과: 소개 화면 다크모드 색과 PDF 꺾은선 색이 토큰으로 칠해짐
- 영향 화면: [시맨틱 색상](/component-guide/semantic-color)
- 적용: tokens.json 반영 후 yarn tokens 실행(tokens.css 재생성)
- 함께 작업: 이 카드 먼저 — 아래 화면 카드들이 새 유틸리티를 씀
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/268812be71d0e05c7e4675f864fcb1e87893d761)

# 작업: 플랫폼 · K-BIGx · 탄소중립 · 특허평가 소개 화면 다크모드 반영

## [신규 추가]

### [기능] 테마에 맞는 그림만 보여 주는 ThemeImage 컴포넌트 추가

- 대상: src/components/custom/theme-image.tsx
- 적용: 신규 파일 추가
- 내용: 라이트 · 다크 파일이 따로인 꾸밈 그림을 테마에 맞춰 하나만 표시
- 함께 작업: 아래 이미지 · 컴포넌트 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/943d93e4d5f006ba951286856a75e6ba5caaabae)

### [이미지] 소개 화면 다크 전용 아이콘 16개 추가

- 대상: public/images/platform-k-bigx-report/ai-analysis-report-dark.webp
    - public/images/platform-k-bigx-report/peer-comparison-dark.webp
    - public/images/platform-k-bigx-report/industry-trend-dark.webp
    - public/images/platform-k-bigx-report/insight-dark.webp
    - public/images/platform-k-bigx-report/applicant-dark.webp
    - public/images/platform-k-bigx-report/patent-info-dark.webp
    - public/images/platform-k-bigx-report/company-info-dark.webp
    - public/images/platform-k-bigx-report/llm-dark.webp
    - public/images/platform-k-bigx-report/k-bigx-report-dark.webp
    - public/images/platform-carbon-neutrality/emission-diagnosis-dark.webp
    - public/images/platform-carbon-neutrality/reduction-plan-dark.webp
    - public/images/platform-carbon-neutrality/keyword-search-dark.webp
    - public/images/platform-carbon-neutrality/self-diagnosis-dark.webp
    - public/images/platform-patent-evaluation/patented-knowledge-dark.webp
    - public/images/platform-patent-evaluation/patent-trade-dark.webp
    - public/images/platform-patent-evaluation/economic-use-dark.webp
- 적용: 신규 파일 추가
- 내용: K-BIGx 분석 기능 4종 · 흐름도 5종, 탄소중립 분석 기능 4종, 특허평가 구조도 3종(탄소중립 분석 기능 2종과 같이 씀)의 다크 전용 그림
- 함께 작업: 아래 컴포넌트 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1cbf34e4908bc5de3864f39913062673a3de9662)

## [Diff 확인]

### [컴포넌트] 소개 화면 히어로 · 아이콘 칸 · 구조도 · 절차 화살표의 다크 색 변경

- 대상: src/components/custom/platform-intro.tsx
    - src/components/custom/platform-service-intro.tsx
    - src/components/custom/card-carousel.tsx
    - src/components/custom/chip-marquee.tsx
    - src/components/custom/procedure-steps.tsx
    - src/components/custom/k-bigx-report-flow-diagram.tsx
    - src/components/custom/platform-k-bigx-report.tsx
    - src/components/custom/platform-patent-evaluation.tsx
    - src/components/composite/rolling-accordion.tsx
- 변경:
    - 히어로: 띠 · 번진 원 · 유리 카드 테두리를 다크 전용 토큰으로 변경
    - 캐러셀: 이전 버튼 테두리 · 설명 목록 점 색을 전용 토큰으로 변경
    - 칩 띠: 마우스를 올렸을 때 면 · 테두리 색을 전용 토큰으로 변경
    - 절차 번호 · 롤링 아코디언 판 · 이용 대상 이름: 전용 토큰으로 변경
    - K-BIGx 구조도: 판 · 칸 · 신청기업 칸 색을 전용 토큰으로 변경
    - K-BIGx · 탄소중립 아이콘: 다크 전용 그림으로 표시, 아이콘 칸 바탕을 전용 토큰으로 변경(ServiceFeatureList 에 iconSurfaceClassName 추가)
    - 특허평가 구조도 아이콘 3종: 다크 전용 그림으로 표시
    - 히어로 유리 카드: 다크 테두리 흰색 25%, 목록 점 service-hero-marker
    - 연결선 · 화살표 · 더하기 · 절차 화살표: platform-connector 로 변경
    - 롤링 아코디언 목록 점: rolling-accordion-marker 로 변경
- 결과: 라이트 화면은 그대로이고 다크에서만 색이 바뀜
- 영향 화면: [플랫폼 소개 (기업)](/corp/platform)
    - [플랫폼 소개 (기관)](/org/platform)
    - [K-BIGx 보고서 소개 (기업)](/corp/platform/k-bigx-report)
    - [K-BIGx 보고서 소개 (기관)](/org/platform/k-bigx-report)
    - [탄소중립 소개 (기업)](/corp/platform/carbon-neutrality)
    - [탄소중립 소개 (기관)](/org/platform/carbon-neutrality)
    - [특허평가 소개 (기업)](/corp/platform/patent-evaluation)
    - [특허평가 소개 (기관)](/org/platform/patent-evaluation)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6d5f1dff0ef9560cdfe8878c761d7c03584cd60a)

## [덮어쓰기]

### [스타일] 알약 탭 주석 수정 — 화면 변화 없음

- 대상: src/components/theme/pill-tabs.variants.ts
- 적용: 지정한 파일만 교체
- 내용: 주석만 변경(실제 색은 tokens.json 의 pill-tab 계열)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f4629cc658127c47b6f77484b2b6d32b3a9d0c40)

# 작업: 탄소중립 소개 — 진단 버튼 이동 확인 모달 · 탭 전환 스크롤 추가

## [Diff 확인]

### [화면] 진단 시작 버튼 — [확인]을 눌러야 새 탭으로 이동 · 탭 전환 시 내용으로 스크롤

- 대상: src/components/custom/platform-carbon-neutrality.tsx
    - src/content/service/platform-carbon-neutrality.ts
    - src/constants/header-navigation.ts
- 변경:
    - 탄소중립 진단 · K-택소노미 진단 버튼: 공용 ConfirmDialog 를 열고 [확인] 을 눌러야 새 탭으로 이동
    - 이동 주소: 각 진단 화면 주소로 변경
    - 플랫폼 탭: 고르면 탭과 바뀐 내용이 화면 위쪽에 오도록 스크롤(모바일 · 태블릿 · PC)
    - header-navigation.ts: 주석만 변경
- 결과: [취소] 는 이동하지 않고 [확인] 만 새 탭을 염
- 영향 화면: [탄소중립 소개 (기업)](/corp/platform/carbon-neutrality)
    - [탄소중립 소개 (기관)](/org/platform/carbon-neutrality)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c3187ce0710086fe1d5b46fe51b50df6dedaa6fc)

# 작업: 메인페이지 터치 멈춤 제거 — 자동 롤링 멈춤은 소개 화면에만 적용

## [Diff 확인]

### [컴포넌트] 메인 공지 팝업 · 기술평가 목차 — 터치해도 자동 넘김이 멈추지 않게 변경

- 대상: src/components/custom/home-notice-popup.tsx
    - src/components/custom/tech-eval-section.tsx
    - src/hooks/use-autoplay-pause.ts
- 변경:
    - 공지 팝업: useAutoplayPause 제거, 카드에 마우스 · 초점이 있을 때만 멈춤
    - 기술평가 목차: useAutoplayPause 제거, 목차 · CTA 버튼에 마우스 · 초점이 있을 때만 멈춤
    - use-autoplay-pause.ts: 쓰는 곳 주석만 변경
- 결과: 터치로 멈추는 동작은 소개 화면의 RollingAccordion · ChipMarquee 에만 남음
- 영향 화면: [메인페이지 (기업)](/corp/home)
    - [메인페이지 (기관)](/org/home)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/9bc145c016a14f6c17e1963522b97949f02748e7)

# 작업: [감리 조치] 평가결과 리포트 — 긴 글이 칸 밖으로 넘치지 않게 수정

## [Diff 확인]

### [컴포넌트] 평가결과 리포트 3종 — 띄어쓰기 없는 긴 글도 칸 안에서 줄바꿈

- 대상: src/components/custom/evaluation-report.tsx
    - src/components/custom/tech-index-report.tsx
    - src/components/custom/investment-model-report.tsx
    - src/components/custom/distribution-curve-chart.tsx
- 변경:
    - 리포트 문서 틀: wrap-anywhere 추가
    - 분포 곡선 세로 눈금: whitespace-nowrap 추가('3.5' 가 두 줄로 쪼개지지 않게)
- 결과: 숫자 · 한글 1,000자를 넣어도 칸 밖으로 넘치지 않음. 글이 길면 인쇄 시 2장이 될 수 있음(현행 유지)
- 영향 화면: [KTRS-FM 일반 분석 (기업)](/corp/mypage/evaluation-results/general-analysis/ktrs-fm)
    - [Tech-Index 일반 일반 분석 (기업)](/corp/mypage/evaluation-results/general-analysis/tech-index)
    - [Tech-Index 창업 일반 분석 (기업)](/corp/mypage/evaluation-results/general-analysis/startup-tech-index)
    - [투자모형 일반 분석 (기업)](/corp/mypage/evaluation-results/general-analysis/investment-model)
    - [KTRS-FM 일반 분석 (기관)](/org/mypage/evaluation-history/general-analysis/ktrs-fm)
    - [Tech-Index 일반 일반 분석 (기관)](/org/mypage/evaluation-history/general-analysis/tech-index)
    - [Tech-Index 창업 일반 분석 (기관)](/org/mypage/evaluation-history/general-analysis/startup-tech-index)
    - [투자모형 일반 분석 (기관)](/org/mypage/evaluation-history/general-analysis/investment-model)
    - [KTRS-FM 심층 분석 (기관)](/org/mypage/evaluation-history/deep-analysis/ktrs-fm)
    - [Tech-Index 일반 심층 분석 (기관)](/org/mypage/evaluation-history/deep-analysis/tech-index)
    - [Tech-Index 창업 심층 분석 (기관)](/org/mypage/evaluation-history/deep-analysis/startup-tech-index)
    - [투자모형 심층 분석 (기관)](/org/mypage/evaluation-history/deep-analysis/investment-model)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d62a72d3041008b59f9c8c6c2184fd27fe672dcf)

# 작업: [감리 조치] 기업 · 기술정보 입력 — 숫자 세 자리 쉼표 · 필수(*) 표시 추가

## [신규 추가]

### [기능] 쉼표 표시 · 제출 시 숫자 변환 유틸 추가(number-format)

- 대상: src/lib/number-format.ts
- 적용: 신규 파일 추가
- 내용:
    - formatThousands · formatSignedThousands: 입력 값을 쉼표 형식으로 변환
    - withNumberValues: 제출할 때 표시가 달린 칸만 숫자로 변환
    - parseThousands: 값 하나를 숫자로 변환
    - limitDigits: 자릿수 상한(지금은 어느 칸에도 걸려 있지 않음)
- 함께 작업: 아래 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d80c18fe2b92d559cee9010313ab50019f01becd)

## [Diff 확인]

### [컴포넌트] 수량 · 금액 칸 쉼표 적용 · 재무 5칸 음수 허용 · 누락된 필수(*) 표시 추가

- 대상: src/components/composite/company-etc-form.tsx
    - src/components/composite/investment-model-company-etc-form.tsx
    - src/components/composite/investment-model-finance-form.tsx
    - src/components/composite/tech-index-finance-form.tsx
    - src/components/composite/tech-index-patent-form.tsx
    - src/components/composite/tech-index-record-form.tsx
    - src/components/composite/tech-index-staff-summary.tsx
    - src/components/composite/self-diagnosis-tabs-form.tsx
    - src/constants/technology-evaluation.ts
- 변경:
    - 쉼표: 명 · 건 · 개 · 백만원 · 원 · 일 단위 입력 칸과 자동 계산 칸에 적용(연도 · 월 · 개월 · 날짜 · 번호류 제외)
    - 음수: 투자모형 당기 영업이익 · 당기 순이익 · 전기 순이익 · 당기 자본총계 · 전기 자본총계만 맨 앞 '-' 입력 가능, 이 칸은 일반 키보드
    - 필수 표시: KTRS-FM 거래유형 및 매출처 · 자가사업장 보유 · 신청기술 구분 · 평가기술명 · 신청기술 개요 · 평가기술 IPC, 투자모형 거래유형 및 매출처에 필수 별표 추가(필수 처리 자체는 그대로)
    - 제출: self-diagnosis-tabs-form 이 쉼표를 뺀 payload 를 만듦
- 결과: 화면 값은 쉼표가 든 채로 보관되고, 저장 API 에는 payload(숫자)를 보내면 됨
- 영향 화면: [KTRS-FM 기업·기술정보 입력 (기업)](/corp/technology-evaluation/ktrs-fm/company-technology-info)
    - [Tech-Index 일반 기업·기술정보 입력 (기업)](/corp/technology-evaluation/tech-index/general/company-technology-info)
    - [Tech-Index 창업 기업·기술정보 입력 (기업)](/corp/technology-evaluation/tech-index/startup/company-technology-info)
    - [투자모형 기업·기술정보 입력 (기업)](/corp/technology-evaluation/investment-model/company-technology-info)
    - [KTRS-FM 기업·기술정보 입력 (기관)](/org/individual-evaluation/ktrs-fm/company-technology-info)
    - [Tech-Index 일반 기업·기술정보 입력 (기관)](/org/individual-evaluation/tech-index/general/company-technology-info)
    - [Tech-Index 창업 기업·기술정보 입력 (기관)](/org/individual-evaluation/tech-index/startup/company-technology-info)
    - [투자모형 기업·기술정보 입력 (기관)](/org/individual-evaluation/investment-model/company-technology-info)
- 함께 작업: 위 number-format 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a2f443ef987a6699c8acf030f14af8c9c93a58da)

# 작업: [감리 조치] 고객정보활용동의 — 부분발송 이메일에 필수 뱃지 추가

## [Diff 확인]

### [컴포넌트] 부분발송 이메일등록 제목 앞에 필수 뱃지 추가

- 대상: src/components/custom/customer-consent-agreement.tsx
- 변경: FormCard 제목 앞에 동의 항목과 같은 RequirementBadge(필수) 추가
- 결과: 기업 고객정보활용동의 5개 화면에 표시됨
- 영향 화면: [KTRS-FM 고객정보활용동의](/corp/technology-evaluation/ktrs-fm/customer-consent)
    - [Tech-Index 일반 고객정보활용동의](/corp/technology-evaluation/tech-index/general/customer-consent)
    - [Tech-Index 창업 고객정보활용동의](/corp/technology-evaluation/tech-index/startup/customer-consent)
    - [투자모형 고객정보활용동의](/corp/technology-evaluation/investment-model/customer-consent)
    - [대표자 이력 고객정보활용동의](/corp/mypage/representative-history/customer-consent)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/9d7c89551272ffff50cbf38d411453874618cb60)

# 작업: [현업 피드백] 기업혁신성장보고서조회 — 특허 검색 안내를 특허 검색일 때만 표시

## [Diff 확인]

### [컴포넌트] 특허 검색을 고른 동안만 검색 범위 안내 · 법적 근거 버튼 표시

- 대상: src/components/composite/select-search-form.tsx
    - src/components/custom/innovation-growth-report-lookup.tsx
- 변경:
    - SelectSearchForm: 선택 값 변경을 알리는 onTypeChange prop 추가
    - 조회 화면: 특허 검색을 고른 동안만 안내 문구 · [기업정보 제공법적 근거] 표시
- 결과: 드롭다운을 바꾸는 즉시 표시 여부가 바뀜(검색 버튼 불필요)
- 영향 화면: [기업혁신성장보고서조회 (기업)](/corp/k-bigx-report/innovation-growth-report)
    - [기업혁신성장보고서조회 (기관)](/org/k-bigx-report/innovation-growth-report)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4cef91fd37643733a4ff4331cb3151b19b042040)

# 작업: [현업 피드백] 하위계정현황 — 상세정보를 [⋮] 메뉴로 이동 · 페이지당 10건으로 변경

## [Diff 확인]

### [화면] 카드 하단 상세정보 버튼을 [⋮] 메뉴로 이동 · 목록 페이지당 2건 → 10건

- 대상: src/components/custom/sub-account-card.tsx
    - src/components/custom/org-sub-account-list.tsx
    - src/components/composite/sub-account-detail-dialog.tsx
    - src/constants/sub-account.ts
    - src/content/service/org-sub-accounts.ts
- 변경:
    - 카드: 하단 [상세정보] 버튼 제거, [⋮] 메뉴의 [비밀번호 초기화] 아래로 이동
    - 상세 모달: 목록이 열고 닫도록 open · onOpenChange prop 추가
    - 페이지 크기: 2 → 10
    - 목업: 페이지 넘김 확인용 96건 추가(10페이지), 계정 수 요약은 목록에서 계산
- 결과: 회원 유형 4개 케이스 모두 10페이지 · 페이지당 10건
- 영향 화면: [하위계정현황 기본](/org/mypage/sub-account-progress)
    - [기술평가 협약](/org/mypage/sub-account-progress/tech-partner)
    - [K-BIGx 협약](/org/mypage/sub-account-progress/k-bigx-partner)
    - [K-BIGx 비협약](/org/mypage/sub-account-progress/k-bigx-non-partner)
- 적용: 목업 96건은 실제 데이터로 바꿀 때 삭제
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/09023626eea2bec4b2a97560d2f6f3e4cecf52ee)

# 작업: [현업 피드백] 이용권 차감 표시 변경 · 자가조회를 자사조회로 수정

## [Diff 확인]

### [화면] K-BIGx 보고서 이력 — 여/부 상자를 이용권 차감 배지로 변경 · 자사조회 표기

- 대상: src/components/custom/k-bigx-report-card.tsx
    - src/constants/k-bigx-report-history.ts
- 변경:
    - 카드: 여/부 상자 삭제, '이용권 차감' · '이용권 미차감' 배지로 변경
    - 조회 유형(카드 · 드롭다운): 자가조회 → 자사조회
- 결과: 기업 · 기관 이력 화면에 함께 반영됨
- 영향 화면: [K-BIGx 보고서 이력 (기업)](/corp/mypage/k-bigx-report-history)
    - [K-BIGx 보고서 이력 (기관)](/org/mypage/k-bigx-report-history)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a4b35bc69d56ee78fff8622ecbda28d57faab18d)

### [문구] 가격정책 · 결제하기 — 자가조회를 자사조회로 수정

- 대상: src/content/service/pricing.ts
    - src/content/service/pricing-payment.ts
- 변경: 자가조회 → 자사조회, 안내 문장은 '자사 조회(본인 기업 조회)'
- 결과: 가격정책(기업 · 기관)과 결제하기 이용 안내(기업)에 반영됨
- 영향 화면: [가격정책 (기업)](/corp/pricing)
    - [가격정책 (기관)](/org/pricing)
    - [결제하기 (기업)](/corp/pricing/payment)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/67246de15578bb1ec93402e60798c2e341018183)

# 작업: [현업 피드백] GNB · 마이페이지 — 하위계정 로그인 시 [하위 기관] 담당자명 표시

## [Diff 확인]

### [컴포넌트] 헤더 · 마이페이지 사이드메뉴에 하위계정 배지 · 담당자명 표시(isSubAccount)

- 대상: src/components/composite/header.tsx
    - src/components/composite/mypage-sidebar.tsx
    - src/components/composite/org-mypage-profile-screen.tsx
    - src/constants/preview-user.ts
    - src/constants/mypage-profile.ts
- 변경:
    - HeaderUser: isSubAccount 추가, 켜면 배지가 '하위 기관' · name 은 담당자명
    - 마이페이지 사이드메뉴: GNB 와 같은 배지 · 이름, [내 정보] 는 하위계정 내 정보로 이동
    - 목업: 하위계정 이름 홍길동, 기관명은 orgName 으로 분리
- 결과: GNB · 사이드메뉴 · 내 정보 담당자가 같은 이름으로 표시됨
- 영향 화면: [하위계정 내 정보](/org/mypage/profile-edit/sub-account)
- 적용: 로그인 회원 유형으로 isSubAccount · 담당자명을 넣음
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/33950fc90ffe71af53def577fd91cfba2588276a)

# 작업: [현업 피드백] K-BIGx PDF 템플릿 — 원형 라벨을 원 밖으로 이동 · 그래프 색 변경

## [Diff 확인]

### [컴포넌트] 원형 차트 라벨을 지시선 끝으로 이동 · 긴 이름 2줄 말줄임 · 막대 색 변경

- 대상: src/components/custom/callout-pie-chart.tsx
    - src/components/custom/kbigx-print-briefing.tsx
    - src/components/custom/kbigx-print-credit.tsx
    - src/components/custom/kbigx-print-innovation.tsx
    - src/components/custom/kbigx-print-parts.tsx
    - src/components/custom/inside-label-pie-chart.tsx
- 변경:
    - 기업 보유기술 · 신용/담보 비중: 라벨을 모두 원 밖 지시선 끝에 배치(신용/담보 비중은 CalloutPieChart 로 교체)
    - 긴 라벨: 이름 2줄 + 말줄임, 비중 · 건수는 줄 수에서 제외, 원 크기 유지
    - 매출 100억원 이하 막대: 보라(#6B6EEB)
    - 조회기업 막대(프롬엑스테크): 초록 → 진남(#183A6D)
    - inside-label-pie-chart.tsx · kbigx-print-parts.tsx: 주석만 변경
- 결과: PDF 템플릿에 라벨 위치와 색이 반영됨
- 영향 화면: [K-BIGx 보고서 미리보기 (기업)](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [K-BIGx 보고서 미리보기 (기관)](/org/k-bigx-report/innovation-growth-report/report-print)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e49d5dcf518af00c49e818d8f6d50b3de7cd79b3)

## [덮어쓰기]

### [문서] 변경 내용을 반영한 PDF 템플릿 HTML로 교체

- 대상: templates/kbigx-report-template.html
- 적용: 지정한 파일만 교체
- 내용: 위 라벨 · 색 변경이 반영된 생성 파일
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e49ce796c6c89d5e6651fc98c3a080a156abd9c8)

# 작업: 플랫폼 소개 5개 화면에 맨 위로 버튼 추가

## [신규 추가]

### [화면] 긴 소개 화면에서 아래로 내리면 오른쪽 아래에 맨 위로 버튼 표시

- 대상: src/app/(user-type)/corp/(service)/(logged-out)/platform/layout.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/platform/layout.tsx
- 적용: 신규 파일 추가
- 내용: ScrollToTopButton 을 플랫폼 소개 묶음 레이아웃에 한 번 배치. 400px 이상 스크롤하면 표시되므로 기술평가는 탭을 눌러 길어졌을 때부터 보임
- 영향 화면: [플랫폼 소개 (기업)](/corp/platform)
    - [기술평가 소개 (기업)](/corp/platform/technology-evaluation)
    - [특허평가 소개 (기업)](/corp/platform/patent-evaluation)
    - [K-BIGx 보고서 소개 (기업)](/corp/platform/k-bigx-report)
    - [탄소중립 소개 (기업)](/corp/platform/carbon-neutrality)
    - [플랫폼 소개 (기관)](/org/platform)
    - [기술평가 소개 (기관)](/org/platform/technology-evaluation)
    - [특허평가 소개 (기관)](/org/platform/patent-evaluation)
    - [K-BIGx 보고서 소개 (기관)](/org/platform/k-bigx-report)
    - [탄소중립 소개 (기관)](/org/platform/carbon-neutrality)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0a4d3ffc758fc30aabad516c7546d44d0bec0f13)

## [Diff 확인]

### [컴포넌트] 맨 위로 버튼 — 푸터가 보이면 사라지고 위로 올리면 다시 표시

- 대상: src/components/composite/scroll-to-top-button.tsx
- 변경: IntersectionObserver 로 푸터가 화면에 들어왔는지 확인해 버튼을 숨김
- 결과: 모바일 · 태블릿 · PC 에서 푸터 정보 · 링크를 가리지 않음. 이 버튼을 쓰는 모든 화면에 적용됨
- 함께 작업: 위 platform/layout.tsx 와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c2d8e985fa94357d2dbe6899cf9c7abb0fbb1233)

# 작업: 컴포넌트 가이드 최신화

## [덮어쓰기]

### [문서] 변경된 컴포넌트 설명 갱신 · 아이콘 · 이미지 가이드 형식 개선

- 대상: src/app/component-guide/(guide)/callout-pie-chart/callout-pie-chart-demo.tsx
    - src/app/component-guide/(guide)/callout-pie-chart/page.tsx
    - src/app/component-guide/(guide)/card-carousel/page.tsx
    - src/app/component-guide/(guide)/chip-marquee/page.tsx
    - src/app/component-guide/(guide)/combo-value-chart/page.tsx
    - src/app/component-guide/(guide)/dialog/page.tsx
    - src/app/component-guide/(guide)/dual-line-chart/page.tsx
    - src/app/component-guide/(guide)/email-field/page.tsx
    - src/app/component-guide/(guide)/form-tabs/page.tsx
    - src/app/component-guide/(guide)/header/page.tsx
    - src/app/component-guide/(guide)/home-notice-popup/page.tsx
    - src/app/component-guide/(guide)/input/page.tsx
    - src/app/component-guide/(guide)/inside-label-pie-chart/page.tsx
    - src/app/component-guide/(guide)/model-structure-diagram/page.tsx
    - src/app/component-guide/(guide)/mypage-shell/page.tsx
    - src/app/component-guide/(guide)/pill-tabs/page.tsx
    - src/app/component-guide/(guide)/platform-service-intro/page.tsx
    - src/app/component-guide/(guide)/procedure-steps/page.tsx
    - src/app/component-guide/(guide)/rank-bar-list/page.tsx
    - src/app/component-guide/(guide)/report-shell/page.tsx
    - src/app/component-guide/(guide)/rolling-accordion/page.tsx
    - src/app/component-guide/(guide)/select-search-form/page.tsx
    - src/app/component-guide/(guide)/semantic-color/page.tsx
    - src/app/component-guide/(demo)/self-diagnosis/customer-consent/page.tsx
    - src/app/component-guide/(guide)/icon/page.tsx
    - src/app/component-guide/(guide)/image/page.tsx
    - src/app/component-guide/(guide)/scroll-to-top-button/page.tsx
    - src/components/custom/guide-asset-group.tsx
    - src/constants/publishing-guide.ts
- 적용: 지정한 파일만 교체
- 내용:
    - [지시선 원형](/component-guide/callout-pie-chart): 라벨 원 밖 · 긴 라벨 규칙 · 예시
    - [조각 안 라벨 원형](/component-guide/inside-label-pie-chart): 현재 쓰는 화면 없음 안내
    - [폼 탭](/component-guide/form-tabs) · [입력](/component-guide/input): 쉼표 · 음수 · 제출 값 · 자릿수 상한
    - [이메일 입력](/component-guide/email-field): 필수 뱃지 예시
    - [검색 폼](/component-guide/select-search-form): onTypeChange
    - [헤더](/component-guide/header) · [마이페이지 셸](/component-guide/mypage-shell): 하위계정 케이스
    - [순위 막대](/component-guide/rank-bar-list) · [복합 차트](/component-guide/combo-value-chart) · [이중 꺾은선](/component-guide/dual-line-chart) · [보고서 셸](/component-guide/report-shell): PDF 색 · 긴 글 안내
    - [모달](/component-guide/dialog): 외부 이동 확인 용도
    - [공지 팝업](/component-guide/home-notice-popup) · [롤링 아코디언](/component-guide/rolling-accordion) · [칩 띠](/component-guide/chip-marquee): 멈춤 범위 · 다크 색
    - [카드 캐러셀](/component-guide/card-carousel) · [절차](/component-guide/procedure-steps) · [알약 탭](/component-guide/pill-tabs) · [서비스 소개](/component-guide/platform-service-intro) · [구조도](/component-guide/model-structure-diagram) · [시맨틱 색상](/component-guide/semantic-color) : 다크 토큰
    - [맨 위로 버튼](/component-guide/scroll-to-top-button): 플랫폼 소개 묶음 사용처 추가
    - [아이콘](/component-guide/icon) · [이미지](/component-guide/image): 라이트 · 다크 짝을 한 카드로 묶고 분류별로 정리, 설명 간소화, 파일 용량 표시
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/3e84a50a55841a11c17bbe2dea1c907ea0d3be44)
