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

# 작업: [현업 피드백] K-BIGx 기업혁신성장 조회 화면 UI 개선

## [Diff 확인]

### [토큰] 히어로 원형 그라데이션 · 입력박스 글로우 색 추가

- 대상: tokens.json
- 변경:
    - 단일 색(extra): ice · glacier · marine · harbor · teal · sapphire · violet 추가
    - 새 토큰: service-intro-glow · service-intro-glow-soft(소개 띠 그림 뒤 원, 라이트 · 다크 따로) · search-glow-start · middle · end(검색 카드 테두리 글로우, 라이트 · 다크 공통)
    - extra 주석: 쓰는 곳(인쇄본 전용 · 웹 semantic 참조)과 단계 팔레트로 옮기는 기준 정리
- 결과: bg-service-intro-glow* · bg-search-glow-* 유틸리티 생성
- 영향 화면: [색상 (Semantic)](/component-guide/semantic-color)
- 적용: tokens.json 반영 후 yarn tokens 실행(tokens.css 재생성)
- 함께 작업: 이 카드 먼저 — 아래 컴포넌트 · CSS 가 새 토큰을 씀
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4abd7eace88da54fbd83c53cc5d9ae92970ebcce)

## [신규 추가]

### [기능] 마스킹(대표자명 · 사업자번호 · 법인번호) · 기업명 줄바꿈 함수 추가

- 대상: src/lib/mask.ts
    - src/lib/name-break.ts
- 적용: 신규 파일 추가
- 내용:
    - mask: 이름 둘째 글자(김*수) · 사업자번호 끝 4자리 · 법인번호 끝 7자리 가리기 — API 가 가린 값을 주면 화면에서 mask 호출을 빼고 받은 값을 그대로 씀
    - name-break: 회사명 · 기관명 줄바꿈 클래스(띄어쓰기 없으면 줄을 채운 뒤 끊고 끝 글자만 남지 않게)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6ece96c867804ea0591f2add668cddc687058d21)

### [컴포넌트] 신규 3종 — 선택 목록 카드 · 선택 항목 요약 · 하단 고정 바

- 대상: src/components/composite/selectable-list-card.tsx
    - src/components/composite/selected-item-summary.tsx
    - src/components/composite/sticky-action-bar.tsx
- 적용: 신규 파일 추가
- 내용:
    - SelectableListCard: 건수가 많은 목록에서 한 건을 고르는 한 줄 카드(라디오 · 제목 · 항목 · 오른쪽 값)
    - SelectedItemSummary: 고른 항목을 다음 단계 위에 다시 보여 주는 띠(체크 · 이름 · 부가 정보 · 동작)
    - StickyActionBar: 화면 아래에 남는 바(고른 항목 칩 · 상태 안내 · 버튼), 쓰는 화면 main 에 overflow-x-clip 필요
- 함께 작업: 아래 배지 덮어쓰기 · 이름 줄바꿈 함수와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d1c8152768c4d93e7a6c51aeecd04fafba76a115)

### [스타일] 입력박스 아웃라인 글로우 모션 CSS 추가

- 대상: src/styles/select-search-form.css
- 적용: 신규 파일 추가
- 내용: 테두리를 따라 도는 그라데이션 선 · 바깥 번짐 · 포커스 때 진해짐 · 동작 줄이기 때 멈춤(SelectSearchForm 이 import)
- 함께 작업: 아래 SelectSearchForm 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f504c9283c8b74c6d0b49850e9e41a7ff97c3d94)

## [덮어쓰기]

### [스타일] 배지 — 하단 고정 바 선택 칩(outline · primary) 추가

- 대상: src/components/theme/badge.variants.ts
- 적용: 지정한 파일만 교체
- 영향 화면: [배지 (Badge)](/component-guide/badge)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a212d796ed520258125ef39cc3b90b420eb57607)

## [Diff 확인]

### [컴포넌트] 검색 폼 — 입력박스 글로우 · 검색 기준 바꾸면 검색어 초기화

- 대상: src/components/composite/select-search-form.tsx
- 변경:
    - hasGlow prop: 테두리 글로우(감싼 틀에 isolate 필요 — K-BIGx 화면은 KbigxReportFrame 이 처리)
    - isKeywordClearedOnTypeChange prop: 검색 기준을 바꾸면 직접 입력한 값도 비움
- 결과: 넘기지 않으면 기존과 같음
- 영향 화면: [기준 선택 검색 (SelectSearchForm)](/component-guide/select-search-form)
- 함께 작업: 위 CSS 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e3968751797f76330d16db06a2ac9fef1bb7765d)

### [컴포넌트] 소개 띠 — 이미지 뒤 원형 그라데이션 · 모바일 이미지 숨김

- 대상: src/components/composite/service-intro-banner.tsx
- 변경: hasIllustrationGlow prop — 1024 이상은 그림 폭 140% 원을 그림 뒤에, 1024 미만은 그림을 숨기고 원만 띠 오른쪽 위에 둠
- 결과: 넘기지 않으면 기존과 같음
- 영향 화면: [서비스 소개 띠 (ServiceIntroBanner)](/component-guide/service-intro-banner)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1e9b6c1f6a2273a52058e1a5b9e11fd166fdbdbb)

### [컴포넌트] 페이지네이션 — 번호 칸 폭 자동(1000쪽 이상 대응)

- 대상: src/components/composite/pagination.tsx
- 변경: compact 번호 칸 size-8 고정 → 높이 32 · 최소 폭 32 · 좌우 4
- 결과: 1000쪽 이상 번호도 칸 밖으로 넘치지 않음
- 영향 화면: compact 를 쓰는 목록 전체(공지 · FAQ · 자료실 · 문의 · 평가결과 · 이용권 · 보고서 이력 등)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/500792fed2e201b8ad9652cc81a4cf26004b8eb0)

### [컴포넌트] 보고서 생성 모달 — 케이스별 안내 · 보고서 새 창 열기

- 대상: src/components/composite/k-bigx-report-create-dialog.tsx
    - src/content/service/k-bigx-report-create.ts
- 변경:
    - notice prop: 안내 상자 내용을 바꿈(자사조회 · 기관회원 등 차감 조건이 다를 때)
    - reportWindow prop: [보고서 생성]이 보고서를 새 창으로 여는 링크가 됨
    - 질문: 20 Bold → 18 Bold, 긴 기업명은 이름 줄바꿈 규칙(name-break)
    - 특허 정보: 값이 길면 항목명 아래로 내려옴, 모바일 상자 여백 16
    - 문구 파일: 주석만 정리(특허 없음 기본 안내는 notice 를 넘기지 않을 때만 쓰임)
- 함께 작업: 위 이름 줄바꿈 함수 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ea90ef194589a25d1ce6b5d90b161c2c8cafb4ce)

### [컴포넌트] K-BIGx 화면 틀 추가 — 그라데이션 · 글로우 가림 방지

- 대상: src/components/custom/k-bigx-report-sections.tsx
- 변경:
    - KbigxReportFrame 추가: 페이지 그리드 · isolate · 제목 · 브레드크럼 · 소개 띠(그림 뒤 원 켬)를 한 번에 그림
    - KbigxReportIntro 는 내보내지 않음(KbigxReportFrame 으로 바꿔 씀)
- 결과: 소개 띠 원 · 검색 카드 글로우가 화면 바탕 아래로 숨지 않음
- 함께 작업: 아래 조회 화면 카드와 한 번에 적용(KbigxReportIntro 를 쓰던 곳이 함께 바뀜)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/efd2f7af2fd97a4ee929565e5b8fa81dc103a1e4)

### [데이터] 기업혁신성장 조회 — 차감 케이스 판정 · 안내 문구 · 목업

- 대상: src/content/service/innovation-growth-report.ts
- 변경:
    - 차감 케이스(getInnovationGrowthReportCase): 기업 타사조회 차감 · 생성불가(재무 · 특허 모두 없음) · 자사조회 차감 없음 · 기관회원 차감 없음
    - 기업 정보: 대표자명 · 개인기업 여부(사업자번호 표시) · 재무정보 여부 · 자사 여부 추가, 법인번호는 법인만
    - 문구: 목록 안내 · 빈 상태(제목 + 설명) · 하단 바 안내 · 목록 안 검색 · 정렬(최신순 · 과거순) · 오류 '올바른 사업자번호 또는 법인번호가 아닙니다' · 특허 안내 문구
    - 문구 상수: 화면 제목 · 건수 단위 · 페이지 넘김 · 특허 건수 줄 · 생성 모달 안내 · 정렬 기본값과 비교 함수
    - 목업: 쪽 이동 함수 2개 추가(쪽 번호를 받음), 케이스 확인용 기업 · 특허 추가, 페이징100 · 페이징1000 검색어
    - 이용횟수 안내 상자 · 'K-BIGx 보고서 출력' 문구 삭제
- 적용: 목업 함수 5개(기업 검색 · 특허 검색 · 기업 선택 · 기업 쪽 이동 · 특허 쪽 이동)를 API 로 교체, 차감 판정은 서버에서도 확인
    - 마스킹은 화면에서 한다 — 서버가 가린 값을 주면 maskPersonName · getInnovationGrowthCompanyNumber 의 mask* 호출을 뺌
    - findMock* 는 search-result 케이스 화면과 함께 지움
- 함께 작업: 아래 화면 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e37238a13c375034c7051455caf184db52cfc740)

### [화면] 기업혁신성장 보고서 — 자사조회 · 기관회원은 차감 알림 숨김

- 대상: src/content/service/k-bigx-innovation-report.ts
    - src/components/custom/innovation-growth-report-page.tsx
    - src/components/custom/innovation-growth-report-document.tsx
- 변경: ?from=free 쿼리(INNOVATION_REPORT_FREE_QUERY_VALUE) 추가 — 자사조회 · 기관회원으로 열면 '이용권이 차감되어…' 알림 없음
- 영향 화면: [기업혁신성장 보고서 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 함께 작업: 아래 조회 화면 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/98fbd72c89ef05ec3fa7b6d432ef3c215bc2066c)

### [화면] 기업혁신성장 조회 — 기업 · 특허 목록 개편 · 하단 고정 바

- 대상: src/components/custom/innovation-growth-report-lookup.tsx
    - src/components/custom/innovation-growth-report-screen.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/org-kbigx-report-screen.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/selected/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/no-patent/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/selected/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/no-patent/page.tsx
- 변경:
    - 화면 틀: KbigxReportFrame 사용, main 에 overflow-x-clip
    - 검색: 검색 전 카드 글로우, 검색 기준을 바꾸면 결과 · 선택 · 검색어 초기화
    - 기업 · 특허 목록: 선택 목록 카드 1열, 한 쪽 10건, 쪽을 넘겨도 화면 위치 · 선택 유지, 다른 쪽에서 고른 항목으로 돌아가는 버튼
    - 기업 카드: 대표자명(가림) · 법인번호 또는 사업자번호(가림) · 특허 건수
    - 선택한 기업: 요약 띠(자사 표시 · 기업 목록 보기) 뒤에 특허 목록, 목록 안 검색 · 최신순/과거순 정렬
    - 특허 검색 결과: 보유 기업 표시, 결과 안 검색
    - 하단 고정 바: 고른 기업 · 특허 칩 · 케이스별 안내 · [보고서 생성](생성불가면 꺼짐)
    - 이용횟수 안내 상자 · 조회횟수 차감안내 모달 단계 삭제 — 생성 모달 [보고서 생성]이 보고서를 새 창으로 엶
    - 기존 결과 화면 제목: '[타사조회 · 차감] 특허 있음 · 재무정보 있음' 같은 케이스 이름(기관은 '차감 없음')
- 결과: 기업 · 기관 조회 화면이 새 목록 · 하단 바 구성으로 바뀜
- 영향 화면: [기업혁신성장 (기업)](/corp/k-bigx-report/innovation-growth-report)
    - [기업혁신성장 (기관)](/org/k-bigx-report/innovation-growth-report)
    - [대량정보조회 (기관)](/org/k-bigx-report/bulk-data-search)
- 적용: userType 은 로그인 정보로 정하고, 쪽 단위 API 면 쪽 · 검색어 · 정렬을 넘김
    - 보고서 생성: 지금은 생성 요청과 새 창 열기가 같은 클릭에 일어남 — 요청을 먼저 보내고 차감에 성공했을 때만 ?from=use 로 창을 열도록 바꿈(코드 주석 참고)
- 함께 작업: 이 작업의 위 카드 전부와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c9515dd10016d27b86c2ae3938e05610328518dd)

## [신규 추가]

### [화면] 기업혁신성장 조회 — 케이스 확인 화면 4종 추가

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/patent-no-finance/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/individual/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/blocked/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/self/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/patent-no-finance/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/individual/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/blocked/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/search-result/company/self/page.tsx
- 적용: 신규 파일 추가
- 내용: 특허 있음 · 재무정보 없음 / 개인기업 / 재무 · 특허 모두 없음(기업 생성불가 · 기관 차감 없음) / 자사조회 — 퍼블리싱 확인용 주소이며 실제 서비스는 조회 화면 하나로 충분
- 영향 화면: [특허 있음 · 재무정보 없음 (기업)](/corp/k-bigx-report/innovation-growth-report/search-result/company/patent-no-finance)
    - [개인기업 (기업)](/corp/k-bigx-report/innovation-growth-report/search-result/company/individual)
    - [생성불가 (기업)](/corp/k-bigx-report/innovation-growth-report/search-result/company/blocked)
    - [자사조회 (기업)](/corp/k-bigx-report/innovation-growth-report/search-result/company/self)
- 함께 작업: 위 조회 화면 카드 다음에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/609168106c63d5ca84e4cd44dccf188e1d6f37b3)

# 작업: [통합테스트 조치] K-BIGx 보고서 진단브리핑 — 혁신성장역량지수 왕관 삭제 · 0~25% 표시

## [Diff 확인]

### [컴포넌트] 순위 피라미드 — 맨 위 왕관 대신 0~25% 표시

- 대상: src/components/custom/rank-pyramid-chart.tsx
    - src/components/custom/rank-pyramid-shape.ts
- 변경:
    - 맨 위 단: 왕관 그림 대신 다른 단과 같은 구간 글자(0~25%), 삼각형이라 높이 75% 지점에 둠
    - 바깥 지시선 · 점 · 구간 글자와 지시선 상수(LEADER_* · rightEdgeAt) 삭제, 그림 폭 320 은 유지
- 결과: 네 단 모두 가운데에 구간 글자, 현재 구간은 보라 면 · 흰 글자(기업 · 기관 보고서 공통, 인쇄본은 변화 없음)
- 영향 화면: [기업혁신성장 보고서 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기업혁신성장 보고서 (기관)](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 함께 작업: 맨 아래 '왕관 이미지 삭제' 카드보다 먼저 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8176a7104164f83b9cf2e7c0b2cb9f03abc66f7f)

# 작업: 컴포넌트 개선 — 등급 반원 게이지 다크모드 · 본인 확인 오류 문구

## [Diff 확인]

### [컴포넌트] 등급 반원 게이지 — 다크모드에서 트랙 · 채움 색 보이게

- 대상: src/components/custom/grade-arc-gauge.tsx
- 변경: md 채움색 --raw-purple-500 → --ds-purple-500, 트랙 --raw-gray-50 → --ds-gauge-track
- 결과: 다크 카드 위에서 트랙 · 채움이 보임(라이트는 같음)
- 영향 화면: [등급 반원 게이지 (GradeArcGauge)](/component-guide/grade-arc-gauge)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/111c64f4f4781edca4e73eb68b6b710046ac9979)

### [컴포넌트] 본인 확인 모달 — 서버 오류 문구 표시

- 대상: src/components/composite/identity-verification-dialog.tsx
- 변경: errorMessage prop 추가 — 서버 오류(비밀번호 불일치 등)를 칸 아래 같은 자리에 표시, 빈 칸 안내가 먼저 보임
- 결과: 넘기지 않으면 기존과 같음
- 영향 화면: [본인 확인 (IdentityVerificationDialog)](/component-guide/identity-verification-dialog)
- 적용: 인증 API 오류 문구를 errorMessage 로 넘기고, 다음 제출(onSubmit) 때 바깥에서 비움
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d56575929a6e7d3b9077015cda08c5a28ae2a7e5)

# 작업: 주석 정리 — 화면 · 동작 변화 없음

## [Diff 확인]

### [주석] 날짜 선택 · 단계 이동 · 선택 정보 카드 · 분포 곡선 차트

- 대상: src/components/composite/date-picker.tsx
    - src/components/composite/step-navigation.tsx
    - src/components/composite/selectable-info-card.tsx
    - src/components/custom/distribution-curve-chart.tsx
- 변경:
    - 주석 용어 정리, StepNavigation 버튼 크기 설명 2xl → xl(실제 값과 맞춤)
    - DistributionCurveChart peakValue 설명 '한 칸' → '반 칸'(실제 동작과 맞춤)
- 결과: 화면 · 동작 변화 없음
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e7a630a2b16d9da3cd83da6b650bd9078ec152f9)

## [덮어쓰기]

### [스타일] 다이얼로그 — 주석만 정리

- 대상: src/components/theme/dialog.variants.ts
- 적용: 지정한 파일만 교체
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/7c94494c12988f466cc02a148f2c33d85b1b2f8e)

# 작업: 컴포넌트 가이드 · 퍼블리싱 인덱스 갱신

## [신규 추가]

### [문서] 새 가이드 6종 — 선택 목록 카드 · 하단 고정 바 · K-BIGx PDF 템플릿 등

- 대상: src/app/component-guide/(guide)/arc-gauge/page.tsx
    - src/app/component-guide/(guide)/chart-tooltip/page.tsx
    - src/app/component-guide/(guide)/kbigx-pdf-template/page.tsx
    - src/app/component-guide/(guide)/selectable-list-card/page.tsx
    - src/app/component-guide/(guide)/selectable-list-card/selectable-list-card-demo.tsx
    - src/app/component-guide/(guide)/selected-item-summary/page.tsx
    - src/app/component-guide/(guide)/sticky-action-bar/page.tsx
- 적용: 신규 파일 추가
- 내용:
    - [원호 게이지 뼈대 (ArcGauge)](/component-guide/arc-gauge): 원호 게이지들이 함께 쓰는 뼈대
    - [차트 툴팁 (ChartTooltip)](/component-guide/chart-tooltip): 차트 공통 툴팁 부품
    - [K-BIGx PDF 템플릿](/component-guide/kbigx-pdf-template): 리포트 공통 가이드에서 K-BIGx 토큰 · 쪽 부품 · 표시 규칙을 옮김
    - [선택 목록 카드 (SelectableListCard)](/component-guide/selectable-list-card) · [선택 항목 요약 (SelectedItemSummary)](/component-guide/selected-item-summary) · [하단 고정 액션 바 (StickyActionBar)](/component-guide/sticky-action-bar): 새 컴포넌트 사용법
- 함께 작업: 아래 가이드 덮어쓰기(메뉴 목록)와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f35fb8a38a2f77cac5444418efc4151a3eb48df7)

## [덮어쓰기]

### [문서] 컴포넌트 가이드 — 용어 통일 · 새 컴포넌트 반영

- 대상: src/app/component-guide/(guide)/accessibility-exceptions/page.tsx
    - src/app/component-guide/(guide)/accessibility-exceptions/quick-menu.tsx
    - src/app/component-guide/(guide)/accordion/page.tsx
    - src/app/component-guide/(guide)/action-check/page.tsx
    - src/app/component-guide/(guide)/alert/page.tsx
    - src/app/component-guide/(guide)/attach-field/page.tsx
    - src/app/component-guide/(guide)/badge/page.tsx
    - src/app/component-guide/(guide)/base-card/page.tsx
    - src/app/component-guide/(guide)/blur/page.tsx
    - src/app/component-guide/(guide)/breadcrumb/page.tsx
    - src/app/component-guide/(guide)/breakpoint/page.tsx
    - src/app/component-guide/(guide)/butterfly-bar-chart/page.tsx
    - src/app/component-guide/(guide)/button/page.tsx
    - src/app/component-guide/(guide)/callout-pie-chart/page.tsx
    - src/app/component-guide/(guide)/card-carousel/page.tsx
    - src/app/component-guide/(guide)/chart-reveal/page.tsx
    - src/app/component-guide/(guide)/checkbox/page.tsx
    - src/app/component-guide/(guide)/chip-marquee/page.tsx
    - src/app/component-guide/(guide)/color/page.tsx
    - src/app/component-guide/(guide)/column-chart/page.tsx
    - src/app/component-guide/(guide)/combo-bar-line-chart/page.tsx
    - src/app/component-guide/(guide)/combo-value-chart/page.tsx
    - src/app/component-guide/(guide)/combobox/page.tsx
    - src/app/component-guide/(guide)/comparison-radar-chart/page.tsx
    - src/app/component-guide/(guide)/contrast-check/page.tsx
    - src/app/component-guide/(guide)/date-picker/page.tsx
    - src/app/component-guide/(guide)/dialog/page.tsx
    - src/app/component-guide/(guide)/distribution-curve-chart/page.tsx
    - src/app/component-guide/(guide)/distribution-value-chart/page.tsx
    - src/app/component-guide/(guide)/diverging-rank-chart/page.tsx
    - src/app/component-guide/(guide)/donut-list-chart/page.tsx
    - src/app/component-guide/(guide)/dual-bar-table/page.tsx
    - src/app/component-guide/(guide)/dual-line-chart/page.tsx
    - src/app/component-guide/(guide)/email-field/page.tsx
    - src/app/component-guide/(guide)/evaluation-model-card/page.tsx
    - src/app/component-guide/(guide)/file-upload/page.tsx
    - src/app/component-guide/(guide)/font/page.tsx
    - src/app/component-guide/(guide)/form-card/page.tsx
    - src/app/component-guide/(guide)/form-fields/page.tsx
    - src/app/component-guide/(guide)/form-tabs/page.tsx
    - src/app/component-guide/(guide)/grade-arc-gauge/page.tsx
    - src/app/component-guide/(guide)/grade-distribution-chart/page.tsx
    - src/app/component-guide/(guide)/grade-history-chart/page.tsx
    - src/app/component-guide/(guide)/grade-radar-chart/page.tsx
    - src/app/component-guide/(guide)/grade-scale-gauge/page.tsx
    - src/app/component-guide/(guide)/grade-trend-chart/page.tsx
    - src/app/component-guide/(guide)/grouped-column-chart/page.tsx
    - src/app/component-guide/(guide)/history-list/page.tsx
    - src/app/component-guide/(guide)/home-notice-popup/home-notice-popup-cases.tsx
    - src/app/component-guide/(guide)/icon/page.tsx
    - src/app/component-guide/(guide)/identity-verification-dialog/page.tsx
    - src/app/component-guide/(guide)/image/page.tsx
    - src/app/component-guide/(guide)/info-box/page.tsx
    - src/app/component-guide/(guide)/info-table/page.tsx
    - src/app/component-guide/(guide)/input/page.tsx
    - src/app/component-guide/(guide)/inside-label-pie-chart/page.tsx
    - src/app/component-guide/(guide)/label/page.tsx
    - src/app/component-guide/(guide)/line-chart/page.tsx
    - src/app/component-guide/(guide)/list-patterns/page.tsx
    - src/app/component-guide/(guide)/loading-state/page.tsx
    - src/app/component-guide/(guide)/login-dialogs/page.tsx
    - src/app/component-guide/(guide)/main-page-layout/page.tsx
    - src/app/component-guide/(guide)/marker-line-chart/page.tsx
    - src/app/component-guide/(guide)/model-structure-diagram/page.tsx
    - src/app/component-guide/(guide)/motion/page.tsx
    - src/app/component-guide/(guide)/nested-column-chart/page.tsx
    - src/app/component-guide/(guide)/network-graph/page.tsx
    - src/app/component-guide/(guide)/new-window-link/page.tsx
    - src/app/component-guide/(guide)/notice-accordion/page.tsx
    - src/app/component-guide/(guide)/open-graph/page.tsx
    - src/app/component-guide/(guide)/overlay-column-chart/page.tsx
    - src/app/component-guide/(guide)/overlay/page.tsx
    - src/app/component-guide/(guide)/page.tsx
    - src/app/component-guide/(guide)/pagination/page.tsx
    - src/app/component-guide/(guide)/pagination/pagination-demo.tsx
    - src/app/component-guide/(guide)/peer-column-chart/page.tsx
    - src/app/component-guide/(guide)/percentage-donut-chart/page.tsx
    - src/app/component-guide/(guide)/pill-tabs/page.tsx
    - src/app/component-guide/(guide)/platform-service-intro/page.tsx
    - src/app/component-guide/(guide)/positioning-scatter-chart/page.tsx
    - src/app/component-guide/(guide)/postcode-search-dialog/page.tsx
    - src/app/component-guide/(guide)/private-content/page.tsx
    - src/app/component-guide/(guide)/procedure-steps/page.tsx
    - src/app/component-guide/(guide)/process-flow/page.tsx
    - src/app/component-guide/(guide)/question-list/page.tsx
    - src/app/component-guide/(guide)/radio/page.tsx
    - src/app/component-guide/(guide)/radius/page.tsx
    - src/app/component-guide/(guide)/rank-bar-list/page.tsx
    - src/app/component-guide/(guide)/rank-pyramid-chart/page.tsx
    - src/app/component-guide/(guide)/rating-matrix/page.tsx
    - src/app/component-guide/(guide)/rating-trend-chart/page.tsx
    - src/app/component-guide/(guide)/ratio-stack-bar/page.tsx
    - src/app/component-guide/(guide)/report-shell/page.tsx
    - src/app/component-guide/(guide)/rolling-accordion/page.tsx
    - src/app/component-guide/(guide)/score-gauge/page.tsx
    - src/app/component-guide/(guide)/score-ring/page.tsx
    - src/app/component-guide/(guide)/score-scale-bar/page.tsx
    - src/app/component-guide/(guide)/scroll-to-top-button/page.tsx
    - src/app/component-guide/(guide)/search-select-dialog/page.tsx
    - src/app/component-guide/(guide)/segment-meter/page.tsx
    - src/app/component-guide/(guide)/segmented-control/page.tsx
    - src/app/component-guide/(guide)/select-search-form/page.tsx
    - src/app/component-guide/(guide)/select-search-form/select-search-form-demo.tsx
    - src/app/component-guide/(guide)/selectable-card/page.tsx
    - src/app/component-guide/(guide)/selectable-info-card/page.tsx
    - src/app/component-guide/(guide)/selectable-info-card/selectable-info-card-demo.tsx
    - src/app/component-guide/(guide)/selectable-summary-list/page.tsx
    - src/app/component-guide/(guide)/semantic-color/page.tsx
    - src/app/component-guide/(guide)/semicircle-rating-gauge/page.tsx
    - src/app/component-guide/(guide)/service-intro-banner/page.tsx
    - src/app/component-guide/(guide)/skeleton/page.tsx
    - src/app/component-guide/(guide)/skip-nav/page.tsx
    - src/app/component-guide/(guide)/spacing/page.tsx
    - src/app/component-guide/(guide)/sub-page-layout/page.tsx
    - src/app/component-guide/(guide)/sub-section-header/page.tsx
    - src/app/component-guide/(guide)/switch/page.tsx
    - src/app/component-guide/(guide)/tabs/page.tsx
    - src/app/component-guide/(guide)/text-tabs/page.tsx
    - src/app/component-guide/(guide)/textarea/page.tsx
    - src/app/component-guide/(guide)/toast/page.tsx
    - src/app/component-guide/(guide)/truncated-text/page.tsx
    - src/app/component-guide/(guide)/typography/page.tsx
    - src/app/component-guide/(guide)/validation-exceptions/page.tsx
    - src/app/component-guide/(guide)/value-column-chart/page.tsx
    - src/app/component-guide/(guide)/value-line-chart/page.tsx
    - src/app/component-guide/(guide)/version-select-panel/page.tsx
    - src/app/component-guide/(guide)/word-cloud/page.tsx
    - src/app/component-guide/(guide)/word-cloud/word-cloud-demo.tsx
    - src/app/component-guide/(guide)/z-index/page.tsx
    - src/constants/publishing-guide.ts
    - src/components/custom/component-layer-badge.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - 전체 가이드: 용어 통일(말풍선 → 툴팁 · 화면 낭독기 → 스크린리더 · 모션 감소 → 동작 줄이기), 제목 앞 번호 삭제, 사용 예시 코드 import 보강 · 화살표 함수 · --ds 색 변수로 정리, 차트 움직임 설명은 ChartReveal 링크로 정리, 차트 가이드 일부에 Recharts 라이선스 안내
    - 메뉴(publishing-guide.ts): ArcGauge · ChartTooltip · K-BIGx PDF 템플릿 · SelectableListCard · SelectedItemSummary · StickyActionBar 추가, 배지 이름 'bigx print template' → 'bigx pdf template'
    - [리포트 공통 (Report)](/component-guide/report-shell): K-BIGx 내용을 K-BIGx PDF 템플릿 가이드로 옮기고 리포트 공통 부품만 남김
    - [기준 선택 검색 (SelectSearchForm)](/component-guide/select-search-form): 테두리 글로우(hasGlow) · 기준 바꾸면 검색어 비우기
    - [서비스 소개 띠 (ServiceIntroBanner)](/component-guide/service-intro-banner): 그림 뒤 원(hasIllustrationGlow) · KbigxReportFrame
    - [색상 (Semantic)](/component-guide/semantic-color): service-intro-glow · search-glow 토큰 설명
    - [배지 (Badge)](/component-guide/badge): 고른 항목 칩(outline · primary) 예시 · 사용 코드
    - [페이지네이션 (Pagination)](/component-guide/pagination): 아이콘만 남기는 법 · 페이지가 아주 많을 때(모바일) 예시
    - [순위 피라미드 (RankPyramidChart)](/component-guide/rank-pyramid-chart): 왕관 대신 0~25% 표시
    - [본인 확인 (IdentityVerificationDialog)](/component-guide/identity-verification-dialog): errorMessage prop(다음 제출 때 비움)
    - [아이콘 (Icon)](/component-guide/icon) · [이미지 (Image)](/component-guide/image): 왕관 · 로그인 탭 그림 삭제, ThemeImage 사용법 · 쓰는 아이콘 목록 갱신
    - [선택 카드 (SelectableCard)](/component-guide/selectable-card) · [선택 정보 카드 (SelectableInfoCard)](/component-guide/selectable-info-card): 검색된 기업 · 특허는 SelectableListCard 로 안내
    - [비공개 정보 (PrivateContent)](/component-guide/private-content): 예시를 일반 표로 바꿈
    - [인풋 (Input)](/component-guide/input): 수량 · 금액 칸 예시를 세 자리 쉼표 방식으로
    - [말줄임 툴팁 (TruncatedText)](/component-guide/truncated-text) · [이메일 입력 (EmailField)](/component-guide/email-field): isFocusable · onValueChange props 설명
- 함께 작업: 위 새 가이드 카드와 한 번에 적용, 맨 아래 그림 삭제 카드보다 먼저 적용(아이콘 · 이미지 가이드가 삭제할 그림을 더 이상 import 하지 않음)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5d4552487bad619ecac322948bba383ab2055b9a)

### [문서] 퍼블리싱 인덱스 — 조회 케이스 화면 4종 등록

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체
- 내용: 기업혁신성장 조회 결과 케이스 화면 4종(기업 · 기관) 추가 · 기존 결과 화면 이름을 케이스 이름으로 바꾸고 순서 정리
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5386a59d7b101f2af4ae87a14832f21d1a18e8cc)

# 작업: 쓰지 않는 이미지 삭제

## [삭제]

### [이미지] 순위 피라미드 왕관 이미지 삭제

- 대상: public/images/rank-pyramid/crown.webp
    - public/images/rank-pyramid/crown-purple.webp
- 적용: 파일 삭제
- 함께 작업: 순위 피라미드 카드 · 아이콘 가이드 덮어쓰기를 먼저 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/079eaef262f86ae731886b2883abe8b72dbba844)

### [이미지] 로그인 회원 유형 탭 이미지 삭제

- 대상: public/images/login/office-building.webp
    - public/images/login/bank-building.webp
- 적용: 파일 삭제
- 함께 작업: 이미지 가이드 덮어쓰기를 먼저 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8b63812f5a022f58eff429501acb1200b3746242)
