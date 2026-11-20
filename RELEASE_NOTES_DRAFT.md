# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.
frontend-handoff에 실제 전달되는 파일의 변경만 작성하세요.
프로젝트 서비스 페이지가 아닌 퍼블리싱 가이드 관련 파일은 [덮어쓰기]로 분류하세요.
지워야 하는 파일·화면은 [삭제]로 따로 적으세요.
같은 작업의 카드는 # 작업: 작업 이름 아래에 모으고, 그 아래에서 ## 구분자부터 다시 씁니다.
# 작업: 바로 아래에 '- 작업 성격: <성격> / 검토: 가볍게|보통|꼼꼼히 — <설명>' 한 줄을 두면 작업 머리에 검토 배지로 보입니다.

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
- '검토' 배지는 확인 강도입니다 — 가볍게(문구 · 스타일) · 보통(속성 · 연결) · 꼼꼼히(정책 · 동작 · 구조, 직접 조작).

# 작업: GNB 강조선 hover 모션 — 왼쪽에서 오른쪽으로 그어지는 강조선

- 작업 성격: 스타일 추가 / 검토: 가볍게 — theme 파일 교체만, 마크업 · 동작 변화 없음

## [덮어쓰기]

### [스타일] GNB 메뉴 강조선 — hover · 포커스 모션 추가

- 대상: src/components/theme/header.variants.ts
- 적용: 지정한 파일만 교체
- 내용:
    - hover · 키보드 포커스 시 강조선이 왼쪽 → 오른쪽으로 그어지고, 벗어나면 오른쪽으로 사라짐(0.3초)
    - 하위 메뉴가 열려 있는 동안 강조선 유지
    - 현재 위치 메뉴 · 색 · 두께(3px)는 그대로, 전체 메뉴(☰) 강조선은 변경 없음
    - 동작 줄이기(prefers-reduced-motion) 설정 시 애니메이션 없음
- 영향 화면: GNB 가 있는 모든 화면(PC · 태블릿)
    - [기업 홈](/corp/home)
    - [기관 홈](/org/home)
    - [헤더 가이드](/component-guide/header)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2f385c98c1a3de978fbe6ec39659f63429916cfd)

# 작업: 검색 카드(SelectSearchForm) — 검색어 오류 시 입력칸에 빨간 테두리 표시

- 작업 성격: 스타일 수정 / 검토: 가볍게 — className 한 줄, 검사 로직 그대로

## [Diff 확인]

### [컴포넌트] SelectSearchForm — 검색어 오류 시 입력칸 오류 스타일 적용

- 대상: src/components/composite/select-search-form.tsx
- 변경: 검색어 입력(ClearableInput) className `border-0` → `border-transparent`(오류 시 테두리를 그릴 자리 확보), 나머지는 주석 정리
- 결과: 검색어 오류 시 입력칸에 빨간 테두리 · 연한 빨간 배경 표시(다른 입력칸 오류와 같은 모양). 정상 상태 모양 · 크기는 그대로
- 연동: 추가 작업 없음 — 검사 · 오류 표시는 컴포넌트 안에서 처리(onSearch 에는 검사를 통과한 값만 전달)
- 영향 화면:
    - [K-BIGx 기업혁신성장 (기업)](/corp/k-bigx-report/innovation-growth-report)
    - [K-BIGx 기업혁신성장 (기관)](/org/k-bigx-report/innovation-growth-report)
    - [특허 등급조회 (기업)](/corp/patent-evaluation/patent-grade-list)
    - [특허 등급조회 (기관)](/org/patent-evaluation/patent-grade-list)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e2b7d41e4fdb6a1f294901dcb02c040403c58667)

# 작업: [현업 요청사항] 가격정책 — 기술평가 · K-BIGx 보고서 탭 문구 · 안내 상자 정리

- 작업 성격: 문구 변경 · 미사용 값 삭제 / 검토: 가볍게 — 가격 · 이용권 · 정책 값은 그대로

## [Diff 확인]

### [데이터] 가격정책 — 기술평가 · K-BIGx 탭 문구 변경

- 대상: src/content/service/pricing.ts
- 변경:
    - 공통: '회원 별 서비스 안내' → '회원별 서비스 안내'
    - 기술평가 기업: '기술평가 (자가진단)' → '기술평가(자가진단)', 보조 설명 삭제, 안내 → '평가모형별 월 1회 / 자사 무료 조회'
    - 기술평가 기관: 설명 → '기관은 협약을 통해 개별평가 및 일괄평가를 이용할 수 있습니다.', 보조 설명 삭제
    - 평가모형 순서: KTRS-FM · Tech-Index(일반) · Tech-Index(창업) · 투자모형
    - K-BIGx 기업: '(부가세 포함)' · '다른 기업 보고서 조회' · '(본인 기업 조회)' 삭제
    - K-BIGx 기관: '파트너(기관)' 라벨 삭제, '계약 체결 후 이용' → '협약 체결 후 이용'
    - 미사용 값 삭제: nameDetail · PAID_PLAN_DESCRIPTION · 자사조회 description · 기관 카드 label
- 영향 화면:
    - [가격정책 (기업)](/corp/pricing)
    - [가격정책 (기관)](/org/pricing)
- 함께 작업: 아래 화면 카드와 한 번에 적용(삭제한 값을 화면이 읽지 않아야 빌드됨)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/02b3b9738b65809dd1dba56d0dc2a96c69b3b21e)

### [화면] 가격정책 — 보조 설명 · 금액 위 설명 제거, K-BIGx 기관 안내 상자 축소

- 대상: src/components/custom/pricing-policy.tsx
- 변경:
    - 기술평가 카드 nameDetail 전달 삭제
    - K-BIGx 이용권 · 자사조회 카드 label 삭제
    - K-BIGx 기관 카드: 라벨 삭제, 안내 상자 emphasis → inline(기술평가 개별 · 일괄평가 카드와 같은 모양)
- 결과: 자사조회 · 이용권 카드 금액 높이 일치, K-BIGx 기관 카드는 작은 안내 상자 한 줄
- 영향 화면:
    - [가격정책 (기업)](/corp/pricing)
    - [가격정책 (기관)](/org/pricing)
- 함께 작업: 위 데이터 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1f4a241e4425787d33b86355c948fcfd0f436747)

### [컴포넌트] PricingCard — 주석 예시 정리

- 대상: src/components/composite/pricing-card.tsx
- 변경: detail · label 주석 예시를 현재 문구로 정리
- 결과: 화면 변화 없음
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ee30425ff974751a4e1b5c619cd2b15602e67d7a)

# 작업: 메인 홈 — 키보드로 섹션 이동

- 작업 성격: 키보드 동작 추가 / 검토: 꼼꼼히 — 키 입력 · 섹션 이동 로직 변경, 직접 조작 확인 필요

## [Diff 확인]

### [컴포넌트] StackPager — 키보드로 섹션 이동 · 안쪽 스크롤

- 대상: src/components/custom/stack-pager.tsx
- 변경:
    - 키 입력을 문서 전체에서 받음(포커스 위치와 무관)
    - 섹션 이동을 moveToPage 하나로 통합(휠 · 터치 · 키보드 공통)
- 결과:
    - Windows: ↓ · PageDown · Space = 다음, ↑ · PageUp · Shift+Space = 이전, Home · End = 처음 · 마지막 섹션
    - Mac: ↓ · fn+↓ · Space = 다음, ↑ · fn+↑ · Shift+Space = 이전, fn+← · fn+→ = 처음 · 마지막 섹션
    - 안쪽 스크롤이 남은 섹션은 안쪽을 먼저 내린 뒤 섹션 이동
    - 키를 누르고 있어도 섹션을 연달아 넘기지 않음
    - 입력칸 · 탭 · 라디오 · 열린 팝업 · 버튼/링크의 Space · Ctrl/Cmd/Alt 조합은 가로채지 않음
    - 페이저가 켜진 화면(768×640 이상)만 해당
- 영향 화면:
    - [기업 홈](/corp/home)
    - [기관 홈](/org/home)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4647d16042646cd6272c9dc84aa6d7f2053ff691)

# 작업: 디자인 토큰 갱신 (토스트 최대 폭)

- 작업 성격: 토큰 추가 / 검토: 가볍게 — tokens.json 교체 후 yarn tokens 실행

## [Diff 확인]

### [토큰] tokens.json — 토스트 최대 폭

- 대상: tokens.json
- 변경: container.toast(640) 추가 — max-w-toast
- 결과: 새 유틸리티 max-w-toast 추가(기존 토큰 값은 그대로)
- 적용: 반영 후 yarn tokens 실행
- 함께 작업: 이 카드 먼저 — 아래 토스트 카드가 새 토큰 사용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/37a4d82cb2c16bab6d2c6108642286fa177f9643)

# 작업: 토스트 — PC에서 한 줄 문구가 줄바꿈되지 않게 폭 넓힘

- 작업 성격: 스타일 교체 / 검토: 가볍게 — 최대 폭만 변경

## [덮어쓰기]

### [스타일] 토스트 — 최대 폭 356px → 640px

- 대상: src/components/theme/sonner.variants.ts
- 적용: 지정한 파일만 교체
- 내용:
    - 기본 폭(356px)에서 PC 한 줄 문구가 줄바꿈되던 문제 수정 — 최대 640px(max-w-toast)
    - 내용만큼의 폭 · 좁은 창 좌우 16px 여백 · 모바일 처리는 그대로
- 영향 화면: 토스트가 뜨는 모든 화면
    - [K-BIGx 기업혁신성장 보고서 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?from=use)
    - [하위계정 상태 변경 완료](/org/mypage/sub-account-progress/status-change/complete-toast)
    - [자동저장](/corp/technology-evaluation/ktrs-fm/additional-company-info/autosave)
- 함께 작업: '디자인 토큰 갱신' 카드 다음에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8ee95ebbda62bef316ba6cdbef5516d5926662ee)

# 작업: [현업 요청사항] K-BIGx 보고서 미리보기에 [인쇄하기] 추가 — PDF 다운로드만 되던 화면에서 바로 인쇄도 가능

- 작업 성격: 버튼 추가 + 문구 · 버튼 이름 변경 / 검토: 보통 — 기존 인쇄 함수 재사용, 버튼 순서 · 모바일 배치 · 인쇄 직접 확인

## [Diff 확인]

### [컴포넌트] ReportPrintShell — 보조 버튼(secondaryAction) 추가 · 모바일 버튼 배치

- 대상: src/components/custom/report-print-shell.tsx
- 변경:
    - secondaryAction('print' | 'pdf-download') 추가 — 주 버튼 앞에 secondary 버튼 하나 더 표시, 같은 runAction 으로 실행
    - PDF 생성 중에는 보조 버튼도 비활성
    - 이름 변경(파일 내부 전용): ReportPrintPrimaryAction → ReportPrintAction, PRIMARY_ACTIONS → REPORT_ACTIONS
    - 모바일(768 미만): 1줄 제목 + [닫기](X 아이콘, aria-label '닫기'), 2줄 보조 · 주 버튼 반씩. 기존 가로 스크롤(458px 밀림) 해소
    - [닫기]: 모바일 X 아이콘(md:hidden) · 태블릿 이상 글자 버튼(max-md:hidden)
    - 태블릿 · PC 배치 · PDF · 인쇄 결과는 그대로
- 영향 화면:
    - [기업 K-BIGx 보고서 미리보기](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [기관 K-BIGx 보고서 미리보기](/org/k-bigx-report/innovation-growth-report/report-print)
    - 아래 화면의 [인쇄 · 다운로드] → 보고서 내용 선택 → [보고서 미리보기]로 진입:
        - [기업 K-BIGx 보고서 결과(웹뷰)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
        - [기관 K-BIGx 보고서 결과(웹뷰)](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
        - [기업 마이페이지 K-BIGx 보고서 이력](/corp/mypage/k-bigx-report-history)
        - [기관 마이페이지 K-BIGx 보고서 이력](/org/mypage/k-bigx-report-history)
    - [특허평가 결과 보고서](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)(모바일 버튼 배치만)
- 함께 작업: 아래 미리보기 화면 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/245ef7eaf0de88048efbf7eb623d41df2f541319)

### [화면] K-BIGx 보고서 미리보기 — [인쇄하기] 버튼 · Safari 안내 문구

- 대상:
    - src/components/custom/kbigx-print-page.tsx
    - src/content/service/k-bigx-print-report.ts
- 변경:
    - [인쇄하기](secondaryAction="print") 추가 — 순서 [인쇄하기] · [PDF 다운로드] · [닫기]
    - 안내 문구(KBIGX_PRINT_PDF_NOTICE) → 'Safari 브라우저에서는 인쇄 시 화면이 깨질 수 있으므로, [PDF 다운로드] 후 PDF 문서에서 인쇄해 주세요.'
    - 주석의 버튼 이름 → [인쇄 · 다운로드]
- 결과: 미리보기 화면에서 바로 인쇄 가능. 안내 문구 · 버튼은 인쇄물에 나오지 않음
- 영향 화면:
    - [기업 K-BIGx 보고서 미리보기](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [기관 K-BIGx 보고서 미리보기](/org/k-bigx-report/innovation-growth-report/report-print)
    - 진입 경로 화면은 위 ReportPrintShell 카드와 같음
- 함께 작업: 위 ReportPrintShell 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5b6ba638ca85954214a498ceec8e37a69514c19a)

### [데이터] 버튼 이름 — [보고서 다운로드] → [인쇄 · 다운로드]

- 대상:
    - src/content/service/k-bigx-innovation-report.ts
    - src/constants/k-bigx-report-history.ts
- 변경:
    - INNOVATION_REPORT_PRINT_LABEL · K_BIGX_REPORT_ACTION.download: '보고서 다운로드' → '인쇄 · 다운로드'
    - 두 파일 주석도 새 이름으로
- 결과: 아이콘 · 동작 그대로
- 영향 화면:
    - [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 보고서 결과](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기업 K-BIGx 보고서 이력](/corp/mypage/k-bigx-report-history)
    - [기관 K-BIGx 보고서 이력](/org/mypage/k-bigx-report-history)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/15e5d267373f2c019944830c2dff22fffc28b2e2)

### [화면] 보고서 내용 선택 확인 화면 page.tsx — 안내 문구 버튼 이름

- 대상:
    - src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/innovation-growth-report/print-output-selection/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/print-output-selection/page.tsx
- 변경: 안내 문구 · 주석의 [보고서 다운로드] → [인쇄 · 다운로드]
- 결과: 퍼블리싱 확인용 안내 문구만 변경
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/60cc8b3afbc03e7540e7d04311b8e9c8273b22a8)

### [컴포넌트] 웹 보고서 — 로딩 중 버튼 스켈레톤 폭 · 주석

- 대상: src/components/custom/innovation-growth-report-document.tsx
- 변경:
    - 버튼 스켈레톤 폭을 실제 버튼에 맞춤 — [인쇄 · 다운로드] 144 → 168px(w-42), 모바일 [더보기] 96 → 116px(w-29)
    - 주석에 [PDF 다운로드] · [인쇄하기] · 새 버튼 이름 반영
- 결과: 로딩 완료 시 버튼 폭이 변하지 않음
- 영향 화면:
    - [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 보고서 결과](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6bf018c3ca94121ba233aa3918b62d3746ea03ee)

### [컴포넌트] 주석 — [인쇄하기] · 새 버튼 이름 반영

- 대상:
    - src/components/composite/k-bigx-print-output-selection-dialog.tsx
    - src/components/custom/innovation-growth-report-page.tsx
    - src/components/custom/kbigx-print-preparing.tsx
    - src/components/custom/k-bigx-report-download-button.tsx
    - src/components/custom/k-bigx-report-card.tsx
    - src/components/custom/k-bigx-report-history-list.tsx
    - src/content/service/k-bigx-report-history.ts
    - src/lib/open-report-print-tab.ts
    - src/app/(user-type)/corp/(report)/k-bigx-report/innovation-growth-report/diagnostic-briefing/page.tsx
    - src/app/(user-type)/org/(report)/k-bigx-report/innovation-growth-report/diagnostic-briefing/page.tsx
- 변경: 흐름 주석에 [인쇄하기] · [인쇄 · 다운로드] 반영, PDF 준비 안내는 '?print=1 흐름 전용'으로 정정
- 결과: 화면 · 동작 변화 없음(주석만)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/87a72a11d5fb039f29d2751e75b65fb96d0f935d)

# 작업: 컴포넌트 가이드 문서 갱신

- 작업 성격: 가이드 · 퍼블리싱 인덱스 데이터 교체 / 검토: 가볍게 — 서비스 화면 영향 없음

## [덮어쓰기]

### [문서] 헤더 가이드 — GNB 강조선 모션

- 대상: src/app/component-guide/(guide)/header/page.tsx
- 적용: 지정한 파일만 교체
- 내용: [헤더 (Header)](/component-guide/header): GNB 강조선 hover · 포커스 모션 설명 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e65e26ab844ead54281781f60ffde81b74b87021)

### [문서] 기준 선택 검색 가이드 — 오류 칸 모양

- 대상: src/app/component-guide/(guide)/select-search-form/page.tsx
- 적용: 지정한 파일만 교체
- 내용: [기준 선택 검색 (SelectSearchForm)](/component-guide/select-search-form): 오류 상태 입력칸 모양 설명 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ff6a2405277d38be0fd580f4eb4deee16d372253)

### [문서] 가격 카드 가이드 — 예시 문구 갱신

- 대상: src/app/component-guide/(guide)/pricing-card/page.tsx
- 적용: 지정한 파일만 교체
- 내용: [가격 카드 (PricingCard)](/component-guide/pricing-card): 바뀐 가격정책 문구 · 평가모형 순서로 예시 갱신
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/cfa448c5cdcef256acd3729aee8cc6883a4fb1ff)

### [문서] 토스트 가이드 — 최대 폭

- 대상: src/app/component-guide/(guide)/toast/page.tsx
- 적용: 지정한 파일만 교체
- 내용: [토스트 (Toast)](/component-guide/toast): 최대 폭 640px · 좁은 화면 좌우 16px 여백 안내 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a173f091620e6bb4f03ec6b1507cbf98d148a2d9)

### [문서] 버전 업데이트 표 — 작업 성격 · 검토 배지

- 대상: src/components/custom/release-note-change-list.tsx
- 적용: 지정한 파일만 교체
- 내용: 퍼블리싱 인덱스 · [버전 업데이트 아카이브](/component-guide/release-archive): 작업마다 '작업 성격' 줄과 검토 배지 표시(카드 수에서 제외)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c639b8dec20e1645008547d8325fbb763f7ee320)

### [문서] 리포트 가이드 4개 — [인쇄하기] 보조 버튼 · 새 버튼 이름

- 대상:
    - src/app/component-guide/(guide)/report-shell/page.tsx
    - src/app/component-guide/(guide)/kbigx-pdf-template/page.tsx
    - src/app/component-guide/(guide)/kbigx-print-output-selection-dialog/page.tsx
    - src/app/component-guide/(guide)/card-action-bar/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - [리포트 공통 (Report)](/component-guide/report-shell): secondaryAction · 모바일 버튼 배치 · X 닫기 설명 추가
    - [K-BIGx PDF 템플릿](/component-guide/kbigx-pdf-template): 예시에 secondaryAction="print"
    - [KbigxPrintOutputSelectionDialog](/component-guide/kbigx-print-output-selection-dialog): 마지막 단계 'PDF 다운로드 · 인쇄하기', 버튼 이름 [인쇄 · 다운로드]
    - [CardActionBar](/component-guide/card-action-bar): 예시 버튼 이름 [인쇄 · 다운로드]
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6b6366325829e625dc048a2bcf25939b9e5de505)

### [문서] 퍼블리싱 인덱스 — 원래대로 돌린 화면 · public 버전 고정

- 대상:
    - src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/types.ts
- 적용: 지정한 파일만 교체
- 내용:
    - 화면 현황표: 원래대로 돌린 화면을 이전 버전으로 고정(versionOverrides)
        - 플랫폼 소개 10개 화면: v3.4.7
        - 기업 홈 · 전체메뉴 v3.3.0, 기관 홈 v3.0.4, 기관 전체메뉴 v3.0.7, 공지 팝업 홈 v3.3.7
    - 인계 자산 표: public 을 v3.5.0 으로 고정(versionOverride 항목 · AssetVersionSource 타입 추가)
    - 해당 화면 · public 이 다시 바뀌면 고정은 자동 해제
- 커밋: [플랫폼 소개 · public](https://github.com/fromex-koh/kibo-ktop/commit/2e0dd616f43a909ac69bc7a89c2eccc628bbb9d3) · [홈 · 전체메뉴 · 공지 팝업](https://github.com/fromex-koh/kibo-ktop/commit/f0cb6cfbe6747335f225b323f5e43aa643516458)
