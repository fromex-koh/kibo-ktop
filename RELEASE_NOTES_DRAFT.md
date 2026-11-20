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

- 작업 성격: 스타일(hover 모션) 추가 / 검토: 가볍게 — theme 파일 교체만, 동작 · 마크업 변화 없음

## [덮어쓰기]

### [스타일] GNB 메뉴 강조선 — hover · 포커스 모션 추가

- 대상: src/components/theme/header.variants.ts
- 적용: 지정한 파일만 교체
- 내용:
    - 마우스를 올리거나 키보드 포커스를 받으면 강조선이 왼쪽 → 오른쪽으로 그어지고, 떠나면 오른쪽으로 빠져나감(0.3초)
    - 하위 메뉴가 열린 동안은 강조선 유지 — 드롭다운으로 옮겨 가도 사라지지 않음
    - 현재 위치 메뉴는 지금처럼 늘 보임 · 색(header-nav-indicator) · 두께(3px)는 그대로
    - 움직임 줄이기(prefers-reduced-motion) 설정이면 애니메이션 없이 바로 바뀜
    - 전체 메뉴(☰)의 그룹 이름 강조선은 바뀌지 않음
- 영향 화면: GNB 가 있는 모든 화면(PC · 태블릿)
    - [기업 홈](/corp/home)
    - [기관 홈](/org/home)
    - [헤더 가이드](/component-guide/header)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2f385c98c1a3de978fbe6ec39659f63429916cfd)

# 작업: 검색 카드(SelectSearchForm) — 검색어 오류 시 입력칸에 빨간 테두리 표시

- 작업 성격: 스타일 한 줄 수정 / 검토: 가볍게 — className 의 border-0 → border-transparent, 검사 로직 그대로

## [Diff 확인]

### [컴포넌트] SelectSearchForm — 검색어 오류 때 입력칸을 다른 입력칸 오류처럼 빨갛게

- 대상: src/components/composite/select-search-form.tsx
- 변경:
    - 실제 코드 변경은 한 줄 — 검색어 입력(ClearableInput) className 의 border-0 → border-transparent
    - 이유: border-0 이면 테두리 두께가 0 이라, 오류 때 빨간 테두리를 그릴 수 없었음. 투명 테두리로 자리를 잡아 두어 오류 때 색만 바뀌고 칸 크기는 그대로
    - 나머지는 주석 정리(동작 변화 없음)
- 결과:
    - 이전: 검색어가 비었거나 형식이 틀리면 아래에 빨간 문구만 뜨고 입력칸은 그대로
    - 이후: 입력칸도 빨간 테두리(destructive) + 연한 빨간 면(field-invalid) — 다른 입력칸의 오류 모양과 같음
    - 오류가 없을 때 모양 · 크기, 오류 문구 위치 · 색은 그대로
- 연동: 추가 작업 없음 — 빈 값 · 형식 검사와 오류 표시는 컴포넌트 안에서 처리(onSearch 에는 검사를 통과한 값만 옴)
- 영향 화면:
    - [K-BIGx 기업혁신성장 (기업)](/corp/k-bigx-report/innovation-growth-report)
    - [K-BIGx 기업혁신성장 (기관)](/org/k-bigx-report/innovation-growth-report)
    - [특허 등급조회 (기업)](/corp/patent-evaluation/patent-grade-list)
    - [특허 등급조회 (기관)](/org/patent-evaluation/patent-grade-list)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e2b7d41e4fdb6a1f294901dcb02c040403c58667)

# 작업: [현업 요청사항] 가격정책 — 기술평가 · K-BIGx 보고서 탭 문구 · 안내 상자 정리

- 작업 성격: 문구 변경 · 띄어쓰기 · 안 쓰는 문구 삭제 / 검토: 가볍게 — 가격 · 이용권 · 정책 값은 그대로, 문구와 안내 상자 크기만 바뀜

## [Diff 확인]

### [데이터] 가격정책 — 기술평가 · K-BIGx 탭 문구 변경

- 대상: src/content/service/pricing.ts
- 변경:
    - 공통: 회원유형 탭 위 제목 '회원 별 서비스 안내' → '회원별 서비스 안내'(기술평가 · K-BIGx 탭 모두)
    - 기술평가 › 기업회원: 카드 이름 '기술평가 (자가진단)' → '기술평가(자가진단)' · 보조 설명 '기업회원 (본인 기업 조회)' 삭제 · 안내 '평가모형 별 월 1회 제공 / 이용권 불필요' → '평가모형별 월 1회 / 자사 무료 조회'
    - 기술평가 › 기관회원: 설명 → '기관은 협약을 통해 개별평가 및 일괄평가를 이용할 수 있습니다.' · 개별평가 · 일괄평가 보조 설명 '기관회원 (타 기업 조회)' 삭제
    - 평가모형 순서: KTRS-FM · Tech-Index(일반) · Tech-Index(창업) · 투자모형(투자모형을 맨 뒤로, 기업 자가진단 · 기관 개별평가 공통)
    - K-BIGx › 기업회원: 설명 끝 '(부가세 포함)' 삭제 · 이용권 카드 '다른 기업 보고서 조회' 삭제 · 자사조회 카드 '(본인 기업 조회)' 삭제
    - K-BIGx › 기관회원: 카드 라벨 '파트너(기관)' 삭제 · 안내 '계약 체결 후 이용' → '협약 체결 후 이용'
    - 정리: 쓰이지 않게 된 값 삭제 — 카드 보조 설명(nameDetail) · PAID_PLAN_DESCRIPTION · 자사조회 description · 기관 카드 label
- 결과: 가격정책 기술평가 · K-BIGx 탭의 문구가 위 내용으로 바뀜. 이용권 카드 '1개월 · 부가세 포함' · 비교표 · 이용 안내 · '파트너(기관) 이용 안내' 제목은 그대로
- 영향 화면:
    - [가격정책 (기업)](/corp/pricing)
    - [가격정책 (기관)](/org/pricing)
- 함께 작업: 아래 가격정책 화면 카드와 한 번에 적용(지운 값을 화면 파일이 더 이상 읽지 않아야 빌드됨)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/02b3b9738b65809dd1dba56d0dc2a96c69b3b21e)

### [화면] 가격정책 — 카드 보조 설명 · 금액 위 설명 제거 · K-BIGx 기관 안내 상자 작게

- 대상: src/components/custom/pricing-policy.tsx
- 변경:
    - 기술평가 카드에 보조 설명(nameDetail)을 넘기던 부분 삭제
    - K-BIGx 이용권 카드 · 자사조회 카드의 금액 위 설명(label) 삭제
    - K-BIGx 기관회원 카드: 라벨 삭제 · 안내 상자를 큰 상자(emphasis, 28 Bold) → 작은 상자(inline, 14 Bold)로 — 기술평가 개별 · 일괄평가 카드와 같은 모양
- 결과: 자사조회 카드 금액이 이용권 카드 금액과 같은 높이 · K-BIGx 기관 카드가 '협약 체결 후 이용' 작은 안내 상자 한 줄
- 영향 화면:
    - [가격정책 (기업)](/corp/pricing)
    - [가격정책 (기관)](/org/pricing)
- 함께 작업: 위 가격정책 데이터 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1f4a241e4425787d33b86355c948fcfd0f436747)

### [컴포넌트] PricingCard — 주석 예시 정리

- 대상: src/components/composite/pricing-card.tsx
- 변경: detail · label 설명 주석의 예시 문구를 지금 화면에 맞게 정리(동작 · 스타일 변화 없음)
- 결과: 화면 변화 없음
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ee30425ff974751a4e1b5c619cd2b15602e67d7a)

# 작업: 메인 홈 — 키보드로 섹션 이동

- 작업 성격: 동작(키보드 인터랙션) 추가 / 검토: 꼼꼼히 — 키 입력 처리 · 섹션 이동 로직이 바뀌어 직접 조작해 확인 필요

## [Diff 확인]

### [컴포넌트] StackPager — 키보드로 섹션 이동 · 안쪽 스크롤

- 대상: src/components/custom/stack-pager.tsx
- 변경:
    - 키 입력을 섹션 묶음 영역이 아닌 문서 전체에서 받음(포커스가 본문 · 헤더 어디에 있어도 동작)
    - 섹션 이동 함수를 moveToPage 하나로 묶음(휠 · 터치 · 키보드 공통) · 주석 정리
- 결과:
    - ↓ · PageDown · Space = 다음 섹션, ↑ · PageUp · Shift+Space = 이전 섹션, Home · End = 첫 · 마지막 섹션
    - 안쪽 내용이 남은 섹션은 안쪽을 먼저 내리고, 끝에 닿은 뒤 다음 입력부터 섹션을 넘김(↑↓ 40px · PageUp/Down · Space 화면 87.5%)
    - 키를 꾹 누르고 있을 때는 섹션을 연달아 넘기지 않음
    - 입력칸 · 탭 · 라디오 그룹 같은 방향키 위젯, 열린 팝업, 버튼 · 링크의 Space, Ctrl · Cmd · Alt 조합은 키를 가져가지 않음
    - 페이저가 켜진 화면(768×640 이상)에서만 해당 — 그보다 작은 화면은 지금처럼 일반 스크롤
- 영향 화면:
    - [기업 홈](/corp/home)
    - [기관 홈](/org/home)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4647d16042646cd6272c9dc84aa6d7f2053ff691)

# 작업: 디자인 토큰 갱신 (토스트 최대 폭)

- 작업 성격: 토큰 추가 / 검토: 가볍게 — tokens.json 교체 후 yarn tokens 로 tokens.css 재생성

## [Diff 확인]

### [토큰] tokens.json — 토스트 최대 폭

- 대상: tokens.json
- 변경: container 에 toast(640) 추가 — 토스트 한 줄의 최대 폭(max-w-toast · --container-toast)
- 결과: 새 유틸리티 max-w-toast 생성(기존 토큰 값은 그대로)
- 적용: 반영 후 yarn tokens 실행(tokens.css 재생성)
- 함께 작업: 이 카드 먼저 — 아래 토스트 카드가 새 토큰을 씀
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/37a4d82cb2c16bab6d2c6108642286fa177f9643)

# 작업: 토스트 — PC에서 한 줄 문구가 줄바꿈되지 않게 폭 넓힘

- 작업 성격: 스타일 교체 / 검토: 가볍게 — 토스트 최대 폭만 바뀜(토큰은 위 '디자인 토큰 갱신' 카드)

## [덮어쓰기]

### [스타일] 토스트 — 토스터 폭을 356px → 최대 640px로

- 대상: src/components/theme/sonner.variants.ts
- 적용: 지정한 파일만 교체
- 내용:
    - 라이브러리 기본 토스터 폭(356px)이 좁아 글자가 조금만 넓어져도(Windows 글꼴 렌더링 등) PC에서 한 줄 문구가 줄바꿈되던 문제 — 최대 640px(container.toast)로 넓힘
    - 토스트는 지금처럼 내용만큼의 폭 · 짧은 문구 모양은 그대로
    - 좁은 창에서는 좌우 16px 을 남기고 줄어듦 · 600px 이하 모바일 처리는 그대로
- 영향 화면: 토스트가 뜨는 모든 화면
    - [K-BIGx 기업혁신성장 보고서 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing?from=use)
    - [하위계정 상태 변경 완료](/org/mypage/sub-account-progress/status-change/complete-toast)
    - [자동저장](/corp/technology-evaluation/ktrs-fm/additional-company-info/autosave)
- 함께 작업: 위 '디자인 토큰 갱신' 카드 다음에 적용(새 토큰이 없으면 폭이 적용되지 않음)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/8ee95ebbda62bef316ba6cdbef5516d5926662ee)

# 작업: 헤더 · 푸터 · 홈 서비스 카드 — 빈 '#' 링크를 실제 화면으로

- 작업 성격: 링크 주소 연결 + 필수 속성(userType) 추가 / 검토: 보통 — 화면 모양은 그대로, MainPageScreen 등에 userType 을 넘기는 곳 확인

## [Diff 확인]

### [데이터] 헤더 · 푸터 · 홈 서비스 카드 링크 주소

- 대상:
    - src/constants/header-navigation.ts
    - src/components/composite/header.tsx
    - src/components/composite/footer.tsx
    - src/components/custom/tech-eval-services.tsx
    - src/components/custom/tech-eval-section.tsx
    - src/components/custom/mobile-tech-eval-content.tsx
    - src/components/custom/main-page-screen.tsx
- 변경:
    - 로그인 전 헤더 위 링크: 로그인/회원가입 → 로그인 안내 · 가격정책 · 이용안내를 회원유형별 실제 주소로(UTILITY_LINKS 를 기업 · 기관별로)
    - 푸터: 이용약관 · 가격정책을 회원유형별 실제 주소로
    - 홈 서비스 카드 [시작하기]: 특허평가 · K-BIGx · 탄소중립을 각 플랫폼 소개 화면으로(buildTechEvalServices 에 userType 추가)
    - MainPageScreen · TechEvalSection · MobileTechEvalContent 가 userType 을 받아 아래로 넘김
- 결과: 같은 '#' 링크가 나란히 있어 생기던 WAVE 'Redundant link' 경고가 사라지고 링크가 실제 화면으로 이동
- 함께 작업: 아래 홈 page.tsx 카드와 한 번에 적용(userType 이 필수 속성이 됨)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/b6b7e4d64bb12b2aa2bc59eeba0ccdfd66ecb92a)

### [화면] 홈 · 전체메뉴 · 공지 팝업 page.tsx — userType 넘김

- 대상:
    - src/app/(user-type)/corp/home/page.tsx
    - src/app/(user-type)/corp/full-menu/page.tsx
    - src/app/(user-type)/corp/home-notice-popup/page.tsx
    - src/app/(user-type)/org/ 아래 같은 3개
- 변경: MainPageScreen 에 userType('corp' · 'org') 추가
- 결과: 화면 변화 없음(링크 주소만 실제 화면으로)
- 영향 화면:
    - [기업 홈](/corp/home)
    - [기관 홈](/org/home)
- 함께 작업: 위 링크 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/97550a08a672a4f557e89b620fffceb39145910f)

# 작업: [현업 요청사항] K-BIGx 보고서 미리보기에 [인쇄하기] 추가 — PDF 다운로드만 되던 화면에서 바로 인쇄도 가능

- 작업 성격: 버튼(동작) 추가 + 안내 문구 · 버튼 이름 변경 / 검토: 보통 — 기존 인쇄 함수를 그대로 부르는 버튼이라 새 로직은 없음, 화면 위쪽 버튼 영역의 버튼 순서 · 모바일 버튼 배치와 Chrome · Safari 인쇄를 직접 눌러 확인(이름 바꾼 카드는 문구만)

## [Diff 확인]

### [컴포넌트] ReportPrintShell — 보조 버튼(secondaryAction) 추가 · 모바일 버튼 배치

- 대상: src/components/custom/report-print-shell.tsx
- 변경:
    - secondaryAction('print' | 'pdf-download') 속성 추가 — 주된 버튼 앞에 secondary 모양 버튼을 하나 더 둠
    - 보조 버튼도 주된 버튼과 같은 함수로 실행(runAction) — [인쇄하기]는 A4 맞춤 후 인쇄 대화상자(printWhenFitted)를 그대로 씀
    - PDF 를 만드는 동안 보조 버튼도 함께 막힘
    - 버튼 종류 타입 · 상수 이름에서 '주된'을 뺌 — ReportPrintPrimaryAction → ReportPrintAction, PRIMARY_ACTIONS → REPORT_ACTIONS(보조 버튼도 같이 쓰므로). 이 파일 안에서만 쓰는 이름
    - 모바일(768 미만) 화면 위쪽 버튼 영역 — 1줄은 제목 + [닫기](X 아이콘 버튼, aria-label '닫기'), 2줄은 [인쇄하기] · [PDF 다운로드]가 반씩(좌우 여백 24 → 16). 320 폭까지 가로 스크롤 없음
    - [닫기]는 폭마다 하나만 보임 — 모바일은 X 아이콘(md:hidden), 태블릿 이상은 지금 글자 버튼(max-md:hidden). CSS 로 순서를 바꾸지 않아 읽는 순서 = 화면 순서
    - 고치기 전에는 버튼 세 개가 한 줄로 고정돼 모바일 화면이 458px 로 밀려 가로 스크롤이 생겼음
    - 태블릿 · PC 는 지금처럼 제목 오른쪽에 한 줄 · PDF 다운로드 · 인쇄 결과는 그대로(PDF 는 용지 원래 크기로 뜨고, 인쇄물에서는 버튼 영역이 빠짐)
- 결과: 모바일에서 버튼이 화면 안에 자연스럽게 놓이고 태블릿 · PC 는 그대로. 특허평가 결과 보고서도 같은 틀이라 모바일 배치가 함께 바뀜(제목 옆 X · 아래 [인쇄하기] 전체 폭)
- 영향 화면:
    - [기업 K-BIGx 보고서 미리보기](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [기관 K-BIGx 보고서 미리보기](/org/k-bigx-report/innovation-growth-report/report-print)
    - 아래 화면들의 [인쇄 · 다운로드] → 보고서 내용 선택 → [보고서 미리보기]로 위 화면이 열림:
        - [기업 K-BIGx 보고서 결과(웹뷰)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
        - [기관 K-BIGx 보고서 결과(웹뷰)](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
        - [기업 마이페이지 K-BIGx 보고서 이력](/corp/mypage/k-bigx-report-history)
        - [기관 마이페이지 K-BIGx 보고서 이력](/org/mypage/k-bigx-report-history)
    - [특허평가 결과 보고서](/corp/patent-evaluation/patent-grade-list/patent-grade-result/report)(모바일 버튼 배치만)
- 함께 작업: 아래 보고서 미리보기 화면 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/245ef7eaf0de88048efbf7eb623d41df2f541319)

### [화면] K-BIGx 보고서 미리보기 — [인쇄하기] 버튼 · Safari 안내 문구

- 대상:
    - src/components/custom/kbigx-print-page.tsx
    - src/content/service/k-bigx-print-report.ts
- 변경:
    - 화면 위쪽 버튼 영역에 [인쇄하기](secondaryAction="print") 추가 — 버튼 순서 [인쇄하기] · [PDF 다운로드] · [닫기]
    - 흐름 주석의 버튼 이름을 [인쇄 · 다운로드]로
    - 화면 위쪽 버튼 영역 아래 안내 문구(KBIGX_PRINT_PDF_NOTICE)를 'Safari 브라우저에서는 인쇄 시 화면이 깨질 수 있으므로, [PDF 다운로드] 후 PDF 문서에서 인쇄해 주세요.'로 변경
- 결과: [PDF 다운로드]만 있던 화면에서 바로 인쇄도 고를 수 있음. 안내 문구 · 버튼은 인쇄물에 나오지 않음(Chrome 인쇄 A4 확인)
- 영향 화면:
    - [기업 K-BIGx 보고서 미리보기](/corp/k-bigx-report/innovation-growth-report/report-print)
    - [기관 K-BIGx 보고서 미리보기](/org/k-bigx-report/innovation-growth-report/report-print)
    - 아래 화면들의 [인쇄 · 다운로드] → 보고서 내용 선택 → [보고서 미리보기]로 위 화면이 열림:
        - [기업 K-BIGx 보고서 결과(웹뷰)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
        - [기관 K-BIGx 보고서 결과(웹뷰)](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
        - [기업 마이페이지 K-BIGx 보고서 이력](/corp/mypage/k-bigx-report-history)
        - [기관 마이페이지 K-BIGx 보고서 이력](/org/mypage/k-bigx-report-history)
- 함께 작업: 위 ReportPrintShell 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5b6ba638ca85954214a498ceec8e37a69514c19a)

### [데이터] 버튼 이름 — [보고서 다운로드] → [인쇄 · 다운로드]

- 대상:
    - src/content/service/k-bigx-innovation-report.ts
    - src/constants/k-bigx-report-history.ts
- 변경:
    - 웹 보고서 머리 버튼(INNOVATION_REPORT_PRINT_LABEL): '보고서 다운로드' → '인쇄 · 다운로드'
    - 마이페이지 보고서 이력 카드 버튼(K_BIGX_REPORT_ACTION.download): '보고서 다운로드' → '인쇄 · 다운로드'
    - 두 파일의 흐름 주석도 새 이름으로
- 결과: 다음 화면(보고서 인쇄본)에서 인쇄와 PDF 다운로드를 둘 다 하게 된 흐름에 맞춘 이름. 아이콘 · 동작은 그대로
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
- 변경: 화면 위 안내('… [보고서 다운로드]를 눌렀을 때 …')와 주석의 버튼 이름을 [인쇄 · 다운로드]로
- 결과: 퍼블리싱 확인용 안내 문구만 바뀜
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/60cc8b3afbc03e7540e7d04311b8e9c8273b22a8)

### [컴포넌트] 웹 보고서 — 불러오는 중 버튼 자리 폭 · 흐름 주석

- 대상: src/components/custom/innovation-growth-report-document.tsx
- 변경:
    - 머리 버튼 스켈레톤 폭을 실제 버튼에 맞춤 — [인쇄 · 다운로드] 144 → 168px(w-42), 모바일 [더보기] 96 → 116px(w-29)
    - 흐름 주석에 '[PDF 다운로드] · [인쇄하기]' · 버튼 새 이름([인쇄 · 다운로드]) 반영
- 결과: 보고서를 다 불러온 순간 버튼 폭이 튀지 않음. 그 밖의 화면 · 동작 변화 없음
- 영향 화면:
    - [기업 K-BIGx 보고서 결과](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 보고서 결과](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6bf018c3ca94121ba233aa3918b62d3746ea03ee)

### [컴포넌트] 흐름 주석 — [인쇄하기] 반영 · 버튼 새 이름

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
- 변경: 흐름 주석에 '[PDF 다운로드] · [인쇄하기]' 반영 · [보고서 다운로드] → [인쇄 · 다운로드] · PDF 준비 안내가 '예전 바로 인쇄 흐름(?print=1)'에서만 쓰인다고 바로잡음
- 결과: 화면 · 동작 변화 없음(주석만)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/87a72a11d5fb039f29d2751e75b65fb96d0f935d)

# 작업: 컴포넌트 가이드 문서 갱신

- 작업 성격: 가이드 문서 교체 · 추가 · 삭제 / 검토: 가볍게 — 서비스 화면에 영향 없음, 파일 교체만

## [덮어쓰기]

### [문서] 헤더 가이드 — GNB 강조선 hover 모션 안내

- 대상: src/app/component-guide/(guide)/header/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - [헤더 (Header)](/component-guide/header): 현재 위치 표시 표의 GNB 행에 hover · 포커스 · 하위 메뉴 열림 모션 설명 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e65e26ab844ead54281781f60ffde81b74b87021)

### [문서] 기준 선택 검색 가이드 — 오류 칸 모양 안내

- 대상: src/app/component-guide/(guide)/select-search-form/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - [기준 선택 검색 (SelectSearchForm)](/component-guide/select-search-form): 상태 표의 빈 값 오류 · 형식 오류에 오류 칸(빨간 테두리 · 연한 빨간 면) 설명 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ff6a2405277d38be0fd580f4eb4deee16d372253)

### [문서] 가격 카드 가이드 — 예시를 바뀐 문구에 맞춤

- 대상: src/app/component-guide/(guide)/pricing-card/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - [가격 카드 (PricingCard)](/component-guide/pricing-card): 이용권 카드 예시 금액 위 설명 삭제 · 서비스 카드 예시 이름 · 안내 문구 · 평가모형 순서 갱신(보조 설명 삭제) · 큰 안내 예시 라벨 삭제 · '협약 체결 후 이용'으로, 큰 안내는 지금 서비스 화면에서 쓰지 않는다는 설명 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/cfa448c5cdcef256acd3729aee8cc6883a4fb1ff)

### [문서] 토스트 가이드 — 최대 폭 안내

- 대상: src/app/component-guide/(guide)/toast/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - [토스트 (Toast)](/component-guide/toast): 면과 색 설명에 최대 폭 640px(container.toast) · 좁은 화면 좌우 16px 여백 안내 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a173f091620e6bb4f03ec6b1507cbf98d148a2d9)

### [문서] 버전 업데이트 표 — 작업마다 작업 성격 · 검토 배지 표시

- 대상: src/components/custom/release-note-change-list.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - 퍼블리싱 인덱스 · [버전 업데이트 아카이브](/component-guide/release-archive): 작업 머리 아래 '작업 성격' 줄을 검토 배지(가볍게 · 보통 · 꼼꼼히)와 함께 표시 · 작업의 카드 수에서 이 줄은 빼고 셈
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c639b8dec20e1645008547d8325fbb763f7ee320)

### [문서] 리포트 가이드 4개 — [인쇄하기] 보조 버튼 · 버튼 새 이름 안내

- 대상:
    - src/app/component-guide/(guide)/report-shell/page.tsx
    - src/app/component-guide/(guide)/kbigx-pdf-template/page.tsx
    - src/app/component-guide/(guide)/kbigx-print-output-selection-dialog/page.tsx
    - src/app/component-guide/(guide)/card-action-bar/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - [리포트 공통 (Report)](/component-guide/report-shell): 화면 위쪽 버튼 영역 설명에 보조 버튼 · 모바일 버튼 배치 추가, 속성 표에 secondaryAction 추가, K-BIGx 보고서 버튼을 [인쇄하기] · [PDF 다운로드]로, 접근성에 모바일 X 닫기(aria-label) 설명 추가
    - [K-BIGx PDF 템플릿](/component-guide/kbigx-pdf-template): 코드 예시에 secondaryAction="print" · 문서 틀 · 준비 안내 설명에 [인쇄하기]
    - [KbigxPrintOutputSelectionDialog](/component-guide/kbigx-print-output-selection-dialog): 흐름 표 마지막 단계를 'PDF 다운로드 · 인쇄하기'로(Safari 는 PDF 를 받아 인쇄하도록 안내) · 예시 · 설명의 버튼 이름을 [인쇄 · 다운로드]로
    - [CardActionBar](/component-guide/card-action-bar): 카드 예시 버튼 이름을 [인쇄 · 다운로드]로
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6b6366325829e625dc048a2bcf25939b9e5de505)

### [문서] 메인 페이지 데모 — userType 전달

- 대상: src/app/component-guide/(demo)/main-page/page.tsx
- 적용: 지정한 파일만 교체
- 내용: 메인 페이지 데모(MainPageScreen)에 userType="corp" 추가(userType 이 필수 속성이 됨)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4ce2857d121ed96e81a451f6f6f048cb8adb1023)
