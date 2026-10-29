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

# 작업: 디자인 토큰 · 공용 애니메이션 추가

## [Diff 확인]

### [토큰] tokens.json — 플랫폼 소개 화면 색 · 타이포 · 반경 추가(적용 후 yarn tokens)

- 대상: tokens.json
- 변경:
    - 색(semantic): 플랫폼 배너 · 히어로 막(platform-banner* · platform-hero-overlay) · 구조도 판(panel-subtle · panel-raised · panel-inset) · 아이콘 바탕(model-icon-surface · icon-surface-raised) · 신청기업 칸(brand-solid*) · 탄소중립(service-accent-green · service-hero-green-* · service-target-band) · 칩 띠(chip-marquee-_) · 알약 탭(pill-tab-_)
    - 단일 색(extra): ink(배너 바탕) · fog
    - 타이포: hero-title-bold · hero-description-medium · callout-bold/medium · display-hero-black · lead-title-bold(모바일 · 태블릿 · PC 크기)
    - 반경: glass(32)
    - PDF 템플릿 색: chart-trend-halo 삭제(추이선 흰 테두리를 없애 쓰는 곳 없음)
- 결과: 플랫폼 소개 화면들이 라이트 · 다크 모두 토큰 색으로 칠해짐
- 영향 화면: [시맨틱 색상](/component-guide/semantic-color)
    - [라운드](/component-guide/radius)
- 적용: tokens.json 반영 후 yarn tokens 실행(tokens.css 재생성)
- 함께 작업: 이 카드 먼저 — 아래 화면 카드들이 새 유틸리티를 씀
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/88bba3dff4be0d9a38a824d36bc08858c0a89af1)

### [스타일] globals.css — 공용 애니메이션 4종 추가

- 대상: src/app/globals.css
- 변경:
    - animate-chart-draw: 선 · 연결선이 그려지는 모션
    - animate-ambient-drift-a · b: 배경 번진 원이 천천히 떠다니는 모션(14 · 18초)
    - animate-marquee: 칩 줄이 끊김 없이 흐르는 모션(60초)
- 결과: 구조도 연결선 · 히어로 배경 · 칩 띠가 움직임(동작 줄이기면 없음)
- 영향 화면: [모션](/component-guide/motion)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c8b462ab28d8d22f64568cef54176fecaa628cfa)

# 작업: 이미지 우선 로딩 속성 변경(priority → preload)

## [Diff 확인]

### [컴포넌트] next/image 의 priority 를 preload 로 교체

- 대상: src/components/composite/header.tsx
    - src/components/custom/auth-flow-page.tsx
    - src/components/custom/full-page-service-status.tsx
    - src/components/custom/k-bigx-report-sections.tsx
    - src/components/custom/patent-grade-sections.tsx
    - src/components/custom/patent-report-document.tsx
    - src/components/custom/patent-report-metric-page.tsx
    - src/components/custom/report-document.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/tech-index/selection/tech-index-model-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/selection/tech-index-model-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/batch-evaluation-form.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/verification-progress/evaluation-method-form.tsx
- 변경: Image 의 priority 속성 → preload(Next.js 16 에서 priority 가 지원 중단됨)
- 결과: 화면 변화 없음 · 지원 중단 경고 제거
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/32c64dc35417b8465178525b4f15bc9413047583)

# 작업: 자동 롤링 멈춤 공통 규칙(useAutoplayPause)

## [신규 추가]

### [기능] 새 훅 — 자동으로 넘어가는 콘텐츠를 보는 동안 멈춤(useAutoplayPause)

- 대상: src/hooks/use-autoplay-pause.ts
- 적용: 신규 파일 추가
- 내용:
    - 마우스: 올리면 멈추고 벗어나면 재생
    - 터치: 누르면 멈춘 채로, 영역 밖을 누르면 재생
    - 키보드: 포커스가 안에 있는 동안 멈춤
    - 사용: const {isPaused, pauseHandlers} = useAutoplayPause() → 영역에 {...pauseHandlers}
- 함께 작업: 아래 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a212da7074721ce14e5fa2ab611784a6d2554b70)

## [Diff 확인]

### [컴포넌트] 메인 공지 팝업 · 메인 기술평가 목차 — 터치로도 자동 넘김 멈춤

- 대상: src/components/custom/home-notice-popup.tsx
    - src/components/custom/tech-eval-section.tsx
- 변경:
    - 공지 팝업: 마우스 · 초점 처리 코드 → useAutoplayPause(터치 추가)
    - 기술평가 목차: 버튼마다 걸던 hover · focus 처리 → 롤링 영역 전체에 useAutoplayPause(터치 추가)
- 결과: 모바일에서 카드 · 목차를 터치하면 멈추고, 다른 곳을 누르면 다시 넘어감
- 영향 화면: [메인 공지 팝업](/component-guide/home-notice-popup)
- 함께 작업: 위 훅 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/7224029241167b314bdc1d5d1b85f574197ca6c6)

# 작업: 평가모형 카드 분리(선택 화면 · 플랫폼 소개 공용)

## [신규 추가]

### [컴포넌트] 새 파일 — 평가모형 카드 겉모습(EvaluationModelCardContent)

- 대상: src/components/custom/evaluation-model-card.tsx
- 적용: 신규 파일 추가
- 내용: 평가모형 선택(라디오)과 플랫폼 소개 기술평가(탭)가 함께 쓰는 카드 면 · 내용 · 모형별 색(EVALUATION_MODEL_TONE_CLASS)
- 함께 작업: 아래 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/93d9a93ed74d90be99e360932798d18b671095dc)

## [Diff 확인]

### [컴포넌트] 평가모형 선택 — 카드 겉모습을 공용 파일로 이전

- 대상: src/components/custom/evaluation-model-selection.tsx
- 변경: 카드 면 · 내용 · 색 정의 삭제 → evaluation-model-card.tsx import(라디오 동작은 그대로)
- 결과: 화면 변화 없음
- 영향 화면: [평가모형 카드](/component-guide/evaluation-model-card)
- 함께 작업: 위 신규 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/37883c403285a7d6545f702759e8faef0786592b)

# 작업: 플랫폼 소개 화면(/platform)

## [신규 추가]

### [화면] 플랫폼 소개 본문 · 등장 연출 · 카드 캐러셀

- 대상: src/components/custom/platform-intro.tsx
    - src/components/custom/platform-intro-motion.tsx
    - src/components/custom/card-carousel.tsx
    - src/content/service/platform-intro.ts
    - src/styles/platform-intro.css
    - public/images/platform-intro/(6장)
- 적용: 신규 파일 추가
- 내용:
    - 본문: 기업 · 기관 공용(PlatformIntro userType) · 문구는 platform-intro.ts
    - 상단 연출: 열면 1단계, 첫 스크롤 · 누름 · 포커스로 2단계(platform-intro.css) · 동작 줄이기면 바로 완성 모습
    - CardCarousel: 이전 · 다음 버튼으로 카드 줄이 한 칸씩 밀리며 고른 카드가 첫 칸에 옴
- 함께 작업: 토큰 카드 다음 · 아래 page 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e2c94fac467f1824bc583796e81e3469754c54b4)

## [Diff 확인]

### [화면] 플랫폼 소개 page — 임시 화면을 본문으로 교체

- 대상: src/app/(user-type)/corp/(service)/(logged-out)/platform/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/platform/page.tsx
- 변경: '내용 추후 업데이트' 칸 → PlatformIntro · platform-intro.css import
- 결과: 플랫폼 소개 화면이 열림
- 영향 화면: [플랫폼 소개 (기업)](/corp/platform)
    - [플랫폼 소개 (기관)](/org/platform)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c763e531f5210311cea5b4a4c224b96feafed840)

# 작업: 플랫폼 소개 서비스 화면 공용 부품

## [신규 추가]

### [컴포넌트] 새 파일 — 스크롤 등장 · 절차 단계 · 롤링 아코디언 · 히어로 · 칩 띠

- 대상: src/components/custom/scroll-reveal.tsx
    - src/components/custom/procedure-steps.tsx
    - src/components/composite/rolling-accordion.tsx
    - src/components/custom/platform-service-intro.tsx
    - src/components/custom/chip-marquee.tsx
- 적용: 신규 파일 추가
- 내용:
    - ScrollReveal: 화면에 들어올 때 한 번 떠오름
    - ProcedureSteps: 번호 단계 + 화살표, 왼쪽에서 차례로 밀려옴
    - RollingAccordion: 아코디언 + 옆 그림이 일정 시간마다 다음 항목으로(보는 동안 멈춤)
    - PlatformServiceHero · ServiceGlassCard · ServiceFeatureList: 히어로 띠 · 반투명 카드 · 기능 목록(tone navy · green)
    - ChipMarquee: 칩 줄이 끊김 없이 흐름(마우스 · 터치 · 포커스로 멈춤)
- 함께 작업: 토큰 · globals.css · useAutoplayPause 카드 다음에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/eed75768668b00736bf92ad804bcfd77e64ce1f1)

### [스타일] 새 파일 — 알약 전환 탭 스타일

- 대상: src/components/theme/pill-tabs.variants.ts
- 적용: 신규 파일 추가
- 내용: 트랙 · 고른 항목 클래스 상수(PILL_TAB_LIST_CLASS_NAME · PILL_TAB_TRIGGER_CLASS_NAME) — Radix Tabs 원형에 얹어 씀
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/980749f0497225833c60c3da243fb25c01817906)

# 작업: 플랫폼 소개 > 기술평가

## [신규 추가]

### [화면] 평가모형 탭 · 모형 구조도 3종

- 대상: src/components/custom/evaluation-model-tabs.tsx
    - src/components/custom/ktrs-fm-structure-diagram.tsx
    - src/components/custom/tech-index-structure-diagram.tsx
    - src/components/custom/investment-model-structure-diagram.tsx
    - src/content/service/platform-technology-evaluation.ts
    - public/images/platform-technology-evaluation/(4장)
- 적용: 신규 파일 추가
- 내용:
    - 카드 3장이 탭 · 처음엔 아무것도 고르지 않음 · 고르면 소개 · 구조도 · 결과정보 아코디언
    - 구조도: 그림 대신 글 · 도형(화면 낭독기가 읽음) · 막대 · 선이 그려지는 모션
- 함께 작업: 공용 부품 · 평가모형 카드 분리 카드 다음 · 아래 page 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4a82aa99ddeaf50a1652adad88c1cd046e95149d)

## [Diff 확인]

### [화면] 기술평가 소개 page — 임시 화면을 본문으로 교체

- 대상: src/app/(user-type)/corp/(service)/(logged-out)/platform/technology-evaluation/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/platform/technology-evaluation/page.tsx
- 변경: '내용 추후 업데이트' 칸 → 안내 제목(줄마다 떠오름) + EvaluationModelTabs
- 영향 화면: [기술평가 소개 (기업)](/corp/platform/technology-evaluation)
    - [기술평가 소개 (기관)](/org/platform/technology-evaluation)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6c232e046753c9632ed22508ce7966bba337cd58)

# 작업: 플랫폼 소개 > 특허평가

## [신규 추가]

### [화면] 특허평가 소개 본문

- 대상: src/components/custom/platform-patent-evaluation.tsx
    - src/content/service/platform-patent-evaluation.ts
    - public/images/platform-patent-evaluation/(3장)
- 적용: 신규 파일 추가
- 내용: KPAS 소개 · 특허평가 구조도 · 평가절차(ProcedureSteps)
- 함께 작업: 아래 page 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/99c35cbb3e4ab7b03761129cbf67c641e858d519)

## [Diff 확인]

### [화면] 특허평가 소개 page — 임시 화면을 본문으로 교체

- 대상: src/app/(user-type)/corp/(service)/(logged-out)/platform/patent-evaluation/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/platform/patent-evaluation/page.tsx
- 변경: '내용 추후 업데이트' 칸 → PlatformPatentEvaluation
- 영향 화면: [특허평가 소개 (기업)](/corp/platform/patent-evaluation)
    - [특허평가 소개 (기관)](/org/platform/patent-evaluation)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/156bd897e0960e88a17efd52fb610905a22e15f4)

# 작업: 플랫폼 소개 > K-BIGx 보고서

## [신규 추가]

### [화면] K-BIGx 보고서 소개 본문 · 보고서 생성 흐름도

- 대상: src/components/custom/platform-k-bigx-report.tsx
    - src/components/custom/k-bigx-report-flow-diagram.tsx
    - src/content/service/platform-k-bigx-report.ts
    - public/images/platform-k-bigx-report/(11장)
- 적용: 신규 파일 추가
- 내용: 히어로(카드 3장) · 분석 기능 · 생성 흐름도 · 절차 · 결과정보 아코디언
- 함께 작업: 아래 page 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8dc0a9bec33d6d23bba49ab005c8de47f5bf3ccf)

## [Diff 확인]

### [화면] K-BIGx 보고서 소개 page — 임시 화면을 본문으로 교체

- 대상: src/app/(user-type)/corp/(service)/(logged-out)/platform/k-bigx-report/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/platform/k-bigx-report/page.tsx
- 변경: '내용 추후 업데이트' 칸 → PlatformKBigxReport(화면 제목 줄은 히어로 띠 안으로)
- 영향 화면: [K-BIGx 보고서 소개 (기업)](/corp/platform/k-bigx-report)
    - [K-BIGx 보고서 소개 (기관)](/org/platform/k-bigx-report)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fa2d31336f23e326bbd013802774c10afb80a941)

# 작업: 플랫폼 소개 > 탄소중립

## [Diff 확인]

### [설정] 탄소중립 플랫폼 주소를 상수로 분리

- 대상: src/constants/header-navigation.ts
- 변경: 헤더 메뉴의 탄소중립 주소 → CARBON_NEUTRAL_HOME_URL 상수(export)
- 결과: 화면 변화 없음 · 탄소중립 소개의 진단 바로가기가 같은 주소를 씀
- 함께 작업: 아래 탄소중립 본문 카드보다 먼저
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0a6d2a3186d968f54481d395baff83ac881370a3)

## [신규 추가]

### [화면] 탄소중립 소개 본문

- 대상: src/components/custom/platform-carbon-neutrality.tsx
    - src/content/service/platform-carbon-neutrality.ts
    - public/images/platform-carbon-neutrality/(8장)
- 적용: 신규 파일 추가
- 내용:
    - 알약 탭으로 두 플랫폼(선도중소기업확인 · K-택소노미) 전환 — 카드 · 기능 · 아래 묶음이 바뀜
    - 이런 기업에 적합합니다: 칩 띠(ChipMarquee) · 진단 바로가기(외부 · 새 탭)
    - [프론트엔드 연동] K-택소노미 진단 주소는 임시값(#k-taxonomy) — 받으면 platform-carbon-neutrality.ts 의 startHref 교체
- 함께 작업: 아래 page 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/83cd1392a5a8dd7ee3ca3f4c69c874211a0d5e44)

## [Diff 확인]

### [화면] 탄소중립 소개 page — 임시 화면을 본문으로 교체

- 대상: src/app/(user-type)/corp/(service)/(logged-out)/platform/carbon-neutrality/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/platform/carbon-neutrality/page.tsx
- 변경: '내용 추후 업데이트' 칸 → PlatformCarbonNeutrality(화면 제목 줄은 히어로 띠 안으로)
- 영향 화면: [탄소중립 소개 (기업)](/corp/platform/carbon-neutrality)
    - [탄소중립 소개 (기관)](/org/platform/carbon-neutrality)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e0c0f5417eb619b63524c2c56e7598b0a5b18da0)

# 작업: K-BIGx 웹 보고서 — 참고자료 탭 추가

## [신규 추가]

### [화면] 참고자료 탭 본문 · 탭 아이콘

- 대상: src/components/custom/innovation-growth-report-reference.tsx
    - public/images/icons/document-chart.webp
- 적용: 신규 파일 추가
- 내용: 등급정의 — 신용등급(24줄) · 현금흐름등급(6줄) 표(ReportTable) · API 연동 없음(등급표 상수)
- 함께 작업: 아래 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/7c9c205c8f6a5cd2f8555d135a5dd79a01f04d9f)

## [Diff 확인]

### [화면] 보고서 탭 목록 · 본문 — 참고자료 탭 연결

- 대상: src/content/service/k-bigx-innovation-report.ts
    - src/components/custom/innovation-growth-report-document.tsx
    - src/content/service/cri-grades.ts
    - src/content/service/cash-flow-grades.ts
    - src/components/custom/kbigx-print-reference.tsx
- 변경:
    - 탭 목록(INNOVATION_REPORT_SECTIONS): 활동성정보 뒤에 reference(참고자료) 추가
    - 보고서 본문: 탭 제목 띠 아이콘 · 본문 분기 · 불러오는 중 화면에 참고자료 추가
    - cri-grades · cash-flow-grades · kbigx-print-reference: 주석만(웹 탭도 같은 표를 씀)
- 결과: 보고서 탭 끝에 '참고자료'가 생기고 ?tab=reference 로 열림
- 영향 화면: [K-BIGx 웹 보고서 참고자료 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=reference)
    - [K-BIGx 웹 보고서 참고자료 (기관)](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing?tab=reference)
- 함께 작업: 위 신규 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8a1e6f311d1567e78bb397a1b354606a4ef93542)

# 작업: K-BIGx PDF 템플릿 — 경쟁기업 추이선 흰 테두리 삭제

## [Diff 확인]

### [화면] 경쟁기업 사업실적 그래프 — 추이선 흰 테두리 삭제

- 대상: src/components/custom/kbigx-print-innovation.tsx
- 변경: 그래프 색(COMPETITOR_CHART_COLORS)에서 lineHalo 삭제
- 결과: 영업이익률 선이 흰 테두리 없이 진남 한 줄로 그려짐
- 영향 화면: [K-BIGx 보고서 미리보기 (기업)](/corp/k-bigx-report/innovation-growth-report/report-print)
- 함께 작업: 토큰 카드(chart-trend-halo 삭제)와 같은 릴리스에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/670fe45ab076b0de6891e127f7dc239514542f8b)

## [덮어쓰기]

### [자산] K-BIGx PDF 템플릿 HTML 재생성

- 대상: templates/kbigx-report-template.html
- 적용: 지정한 파일만 교체
- 내용: 추이선 흰 테두리 삭제 · 최신 스타일 반영(손으로 고치지 않음)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/60422d7ce678ebc04034f1e8c5d42e2af4f9e9d4)

# 작업: 컴포넌트 가이드 · 퍼블리싱 인덱스

## [덮어쓰기]

### [문서] 새 가이드 9종 추가

- 대상: src/app/component-guide/(guide)/card-carousel/
    - src/app/component-guide/(guide)/chip-marquee/
    - src/app/component-guide/(guide)/evaluation-model-card/
    - src/app/component-guide/(guide)/model-structure-diagram/
    - src/app/component-guide/(guide)/pill-tabs/
    - src/app/component-guide/(guide)/platform-service-intro/
    - src/app/component-guide/(guide)/procedure-steps/
    - src/app/component-guide/(guide)/rolling-accordion/
    - src/app/component-guide/(guide)/version-select-panel/
    - src/constants/publishing-guide.ts
- 적용: 지정한 파일만 교체(새 폴더는 추가)
- 내용:
    - [카드 캐러셀](/component-guide/card-carousel): 사용법 · 모션 · props
    - [칩 마퀴](/component-guide/chip-marquee): 흐름 · 멈춤 규칙 · props
    - [평가모형 카드](/component-guide/evaluation-model-card): 라디오 · 탭에서 함께 쓰는 법
    - [평가모형 구조도](/component-guide/model-structure-diagram): KTRS-FM · Tech-Index · 투자모형 · 특허평가 · K-BIGx 흐름도
    - [알약 전환 탭](/component-guide/pill-tabs): 스타일 · 내용 전환 방식
    - [서비스 소개 틀](/component-guide/platform-service-intro): 히어로 · 유리 카드 · 기능 목록
    - [절차 단계](/component-guide/procedure-steps): 사용법 · 모션
    - [롤링 아코디언](/component-guide/rolling-accordion): 자동 전환 · 멈춤 규칙
    - [버전 선택 본문](/component-guide/version-select-panel): 개정 이력 문서의 버전 셀렉트 · 본문 전환 사용법
    - 사이드바 메뉴(publishing-guide.ts): 위 가이드 등록
- 함께 작업: 가이드 폴더와 publishing-guide.ts 를 한 번에 적용(메뉴가 가리키는 페이지가 있어야 함)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/bd3dbe5dca19d9ef2668cb7046d83e9e77f16c01)

### [문서] 기존 가이드 10종 갱신

- 대상: src/app/component-guide/(guide)/accordion/page.tsx
    - src/app/component-guide/(guide)/combo-value-chart/page.tsx
    - src/app/component-guide/(guide)/home-notice-popup/page.tsx
    - src/app/component-guide/(guide)/icon/page.tsx
    - src/app/component-guide/(guide)/image/page.tsx
    - src/app/component-guide/(guide)/motion/page.tsx
    - src/app/component-guide/(guide)/motion/motion-preview.tsx
    - src/app/component-guide/(guide)/radius/page.tsx
    - src/app/component-guide/(guide)/report-shell/page.tsx
    - src/app/component-guide/(guide)/semantic-color/page.tsx
    - src/app/component-guide/(demo)/self-diagnosis/evaluation-model/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - 아코디언: 롤링 아코디언 안내 링크
    - 막대 + 선 값 차트: PDF 색 예시에서 추이선 흰 테두리 삭제
    - 메인 공지 팝업: 터치로 멈춤 설명
    - 아이콘: 플랫폼 소개 아이콘 묶음 · 참고자료 탭 아이콘
    - 이미지: 플랫폼 소개 화면 그림 묶음
    - 모션: 그리기 · 떠다님 · 흐름 모션, 즉시 감추기 규칙
    - 라운드: glass(32)
    - 보고서 틀: 참고자료를 웹 탭도 쓴다는 안내
    - 시맨틱 색상: 새 색 토큰
    - 평가모형 데모: priority → preload
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/aae8d25e759b3cda0141f5fbb669707f05188a6c)

### [문서] 퍼블리싱 인덱스 — 참고자료 탭 행 · 템플릿 다운로드 버전 자동 표시

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
    - src/content/publishing-guide/index.ts
- 적용: 지정한 파일만 교체
- 내용:
    - 기업 · 기관 K-BIGx 보고서에 '참고자료' 행 추가(누르면 해당 탭)
    - '보고서 템플릿 다운로드' 행: versionAsset 으로 템플릿 파일의 자산 버전을 자동 표시(기존 '미배포' 고정)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/9ae95464a23c3d96699772b965193518e30a0bc1)
