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

# 작업: [통합테스트 조치] 이용권 관리 — 사용중 이용권 목록 표시 · 메뉴 이름 변경

## [Diff 확인]

### [화면] 이용권 관리 — 사용중 이용권을 목록 카드로 이동 · [사용중] 탭 추가

- 대상: src/components/custom/paid-service-history.tsx
    - src/content/service/paid-service-current-pass.ts
- 변경:
    - 사용중 이용권: 상단 별도 영역 대신 '구매한 이용권 내역' 목록의 한 카드로 표시(구매일 순 정렬)
    - 필터: [전체] [사용중] [대기중] [만료] [환불] 순으로 [사용중] 추가
    - 목업: 1회권 1건 22,000원 · 베이직 20건 330,000원 · 스탠다드 50건 550,000원 · 프리미엄 200건 1,100,000원, 이용기간 1개월('미니멈'은 '1회권')
- 결과: 사용중 이용권이 목록 첫 카드로 보이고 [사용중] 필터로 골라 볼 수 있음
- 영향 화면: [이용권 관리 (기업)](/corp/mypage/paid-services/payment-history)
- 적용: 목업(CURRENT_PASS · PURCHASED_PASSES · createCurrentPassCase)은 조회 응답으로 교체
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/910b32345b0b21309748a6884a65868a1ffeafe5)

### [문구] 메뉴 · 화면 제목 '유료 서비스 관리' → '이용권 관리'

- 대상: src/components/composite/mypage-sidebar.tsx
    - src/constants/header-navigation.ts
    - src/components/composite/payment-complete-dialog.tsx
    - src/content/service/pricing-payment.ts
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/refundable/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspend-unavailable-free-pass/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspend-unavailable-remaining-day/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspending/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/suspension-history/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/payment-history/usage-history/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/paid-services/refund-reason/page.tsx
- 변경:
    - 마이페이지 사이드메뉴 · 헤더 메뉴: '이용권 관리'
    - 화면 제목(metadata) · 환불 신청 경로 안내: '마이페이지-이용권 관리-환불하기'
- 결과: 모든 메뉴 · 화면에서 '이용권 관리'로 표시
- 함께 작업: 위 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d9b63dd48afa7d586150ca18f397495b71924589)

# 작업: [통합테스트 조치] 마이페이지 목록 — 날짜 뒤에 시각 표시

## [Diff 확인]

### [화면] 보고서 이력 · 평가결과 · 평가검증 신청 — 날짜에 시각(HH:mm) 추가

- 대상: src/constants/k-bigx-report-history.ts
    - src/constants/evaluation-result.ts
    - src/constants/verification-application.ts
    - src/components/custom/k-bigx-report-card.tsx
    - src/components/custom/evaluation-result-list.tsx
    - src/components/custom/org-evaluation-history-list.tsx
    - src/components/custom/verification-application-card.tsx
    - src/content/service/k-bigx-report-history.ts
    - src/content/service/org-k-bigx-report-history.ts
    - src/content/service/evaluation-results.ts
    - src/content/service/org-evaluation-history.ts
    - src/content/service/org-verification-applications.ts
- 변경:
    - 데이터: 시각 칸 추가 — inquiredTime · evaluatedTime · receivedTime(HH:mm, 선택값)
    - 화면: 시각이 있으면 날짜 뒤에 붙이고, 없으면 날짜만 표시
- 결과: 기업 · 기관 보고서 이력 · 평가결과 조회, 기관 평가검증 신청 조회에 시각까지 표시
- 영향 화면: [K-BIGx 보고서 이력 (기업)](/corp/mypage/k-bigx-report-history)
    - [평가결과 조회 (기업)](/corp/mypage/evaluation-results)
    - [평가검증 신청 조회 (기관)](/org/mypage/verification-application)
- 적용: 조회 응답에 시각 값을 함께 넣음
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/dd57811e838b3a1bf821714ed814df02f454f80d)

# 작업: [통합테스트 조치] K-BIGx 서비스 불가 안내 문구 변경

## [Diff 확인]

### [문구] K-BIGx 서비스 불가 안내 — 협약 안내 · 문의전화 문구 변경

- 대상: src/content/service/service-unavailable.ts
    - src/components/composite/service-unavailable-dialog.tsx
- 변경: 둘째 문장 · 문의전화를 서비스마다 따로 둠
- 결과: K-BIGx 안내가 '…별도 협약이 필요합니다. / 문의전화: 1544-1120' 으로 표시
- 영향 화면: [K-BIGx 서비스 불가 안내 (기관)](/org/k-bigx-report/service-unavailable)
- 적용: 기술평가 문의전화는 확정 번호로 교체
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2ad9265eed5a58b16f1059c7d39d30e2ff7e3fc3)

# 작업: [통합테스트 조치] 로그인 — 한 화면에 담기도록 정리

## [Diff 확인]

### [화면] 로그인 — 탭 그림 · 브레드크럼 삭제, 여백 축소

- 대상: src/components/custom/login-screen.tsx
    - src/app/(user-type)/corp/(service)/(logged-out)/auth/page.tsx
    - src/app/(user-type)/org/(service)/(logged-out)/auth/page.tsx
- 변경:
    - 회원 유형 탭 그림 · 브레드크럼 제거, 탭 높이 · 카드 여백 축소(LoginScreen 의 userType prop 삭제)
    - 제목 위 여백을 화면 높이에 따라 조절 — PC · 태블릿 24 ~ 84(높이 900 이상은 시안 84), 모바일 16 ~ 40
- 결과: 낮은 화면(1366×657 등)은 기업회원 로그인 버튼까지 한 화면에 보이고, 높은 화면은 시안처럼 위 여백이 확보됨
- 영향 화면: [기업 로그인](/corp/auth)
    - [기관 로그인](/org/auth)
- 함께 작업: 아래 스타일 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/70782939c42192908909e0e9ac191516d60472ec)

## [덮어쓰기]

### [스타일] 회원 유형 탭 — 그림 없이 이름만, PC 높이 56

- 대상: src/components/theme/member-type-tabs.variants.ts
- 적용: 지정한 파일만 교체
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6b4c73b1008ea3b534b5b6496ab605ddfed2ddc5)

# 작업: [현업 피드백] K-BIGx 웹 보고서 · PDF 템플릿 수정(261030 수정요청)

## [Diff 확인]

### [데이터] K-BIGx 보고서 — 열람 케이스 가림 규칙 · 결산일자 · 소제목 이름

- 대상: src/content/service/k-bigx-innovation-report.ts
    - src/content/service/k-bigx-print-report.ts
    - src/content/service/k-bigx-print-output-selection.ts
    - src/content/service/cri-grades.ts
- 변경:
    - 열람 케이스: 법인 · 개인 열람은 당좌거래정지 · 단기연체 · 상거래연체 · 공공체납 표를 '열람불가(제공 대상 외 정보)'로, 개인 열람의 법인등기는 '해당없음'(hiddenInfoTables · noneInfoTables · applyCreditInfoVisibility)
    - 현금흐름등급: 결산일자 줄(cashFlow.details) 추가
    - 혁신성장역량지수 상단 안내(scoreNote) 삭제
    - 이름: 정부 R&D 사업 현황 · 특허보유 현황 · 기술보유 현황 · 기업 현황 · 차입금 변동 현황
- 결과: 웹 보고서 · PDF 가 같은 규칙으로 표를 가리고 같은 이름을 씀
- 함께 작업: 아래 컴포넌트 · 화면 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/41f57b3b0dc61d7435decb7af15f8b7e46b9a55f)

### [컴포넌트] 보고서 그래프 — 게이지 날짜 줄 · 도넛 폭 · 가로축 선

- 대상: src/components/custom/grade-scale-gauge.tsx
    - src/components/custom/donut-list-chart.tsx
    - src/components/custom/nested-column-chart.tsx
    - src/components/custom/grade-history-chart.tsx
    - src/components/custom/rating-trend-chart.tsx
- 변경:
    - 등급 게이지: details prop 추가(원호 안 등급 아래 이름 · 값 줄, 예: 결산일자)
    - 도넛 목록: donutBoxClassName 만 주어도 도넛을 그 폭 가운데에 둠(도넛 아래 글 없이)
    - 겹친 막대: 가로축 선을 막대 위에 그림
- 함께 작업: 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e3882acf27378a0343255f4087dc385c0e17bd28)

### [화면] K-BIGx 웹 보고서 — 현업 수정요청 반영

- 대상: src/components/custom/innovation-growth-report-document.tsx
    - src/components/custom/innovation-growth-report-tech.tsx
    - src/components/custom/innovation-growth-report-tech-index.tsx
    - src/components/custom/innovation-growth-report-credit.tsx
    - src/components/custom/innovation-growth-report-company.tsx
- 변경:
    - 머리: 특허명이 비면 빈칸, 기업명 · 발급일이 비면 '-'
    - 진단브리핑: 단위(건) 크기 조정 · 상단 산출 불가 안내 삭제 · '정부 R&D 사업 현황'
    - 기술혁신정보: 안내문 양쪽 정렬 · '기술보유 현황' · '특허보유 현황'
    - Tech-Index: 지수설명 제목 삭제 · 한 문단 양쪽 정렬 · 점수 없음 문구 '기술신용평가(TCB) 이력이 없어 산출 불가합니다.'
    - 현금흐름등급: 왼쪽 게이지(결산일자) · 등급 정의, 오른쪽 평가이력(그래프 · 표)
    - 기업신용정보: 가린 표는 배지 없이 '열람불가(제공 대상 외 정보)' 한 줄
- 영향 화면: [기업혁신성장 보고서 (기업)](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 함께 작업: 위 데이터 · 컴포넌트 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/62bc35ea9c23a10ceac985aa4399d81b22223f17)

### [화면] K-BIGx PDF 템플릿 — 현업 수정요청 반영

- 대상: src/components/custom/kbigx-print-briefing.tsx
    - src/components/custom/kbigx-print-company.tsx
    - src/components/custom/kbigx-print-innovation.tsx
    - src/components/custom/kbigx-print-tech-index.tsx
    - src/components/custom/kbigx-print-credit.tsx
    - src/components/custom/kbigx-print-activity.tsx
    - src/components/custom/kbigx-print-parts.tsx
- 변경:
    - 진단브리핑: 평균 특허수 단위(건)를 숫자보다 작게 · 'Tech-Index' 타이틀 · '정부 R&D 사업 현황'
    - 기업 현황: 경영진 · 주주 5행 고정 · 특허 및 인증 현황 이름 왼쪽/숫자 오른쪽 · 글자 크기 통일
    - 기술혁신정보: R&D 전문기관 표 본문에도 세로 구분선 · '기술보유 현황'
    - Tech-Index: 소개문구 볼드 해제 · 첫 문장 수정 · 산출 불가 문구
    - 신용/재무정보: '평가이력' · 표와 꺾은선 사이 여백 · 도넛 아래 연도 삭제 · 열람불가
    - 활동성정보: 인당 매출액 연도 가운데 정렬 · 에너지 표와 꺾은선 사이 여백
- 영향 화면: [보고서 미리보기 (기업)](/corp/k-bigx-report/innovation-growth-report/report-print)
- 함께 작업: 위 데이터 · 컴포넌트 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/1f27a41bee156190f0eae483bb8a22a40a4da086)

## [덮어쓰기]

### [문서] PDF 템플릿 HTML 교체

- 대상: templates/kbigx-report-template.html
- 적용: 지정한 파일만 교체
- 내용: 위 PDF 수정을 반영해 다시 만든 파일
- 고쳐 쓰는 경우:
    - ① [AI 적용 내용 보기] → [텍스트 복사]
    - ② 새 버전 템플릿 HTML 을 첨부하고 복사한 지시문을 붙여 넣기
    - ③ 결과가 새 버전 템플릿과 같은지 확인
- 주요 변경:
    - 데이터(JSON) 값: rndNote · 보유기술 안내 · Tech-Index 설명 문장 교체, scoreNote 미사용, 현금흐름등급 결산일자
    - 제목: '현황' 띄어쓰기 · '정부 R&D 사업 현황' · 'Tech-Index' · '기술보유/특허보유 현황' · '평가이력'
    - 스타일: 단위 크기 · 인증 이름 크기 · 표와 꺾은선 사이 여백 · 연도 가운데 · 세로 구분선 · 도넛 아래 연도 삭제 · 가로축 선 위로
    - 열람 케이스: 가린 표 '열람불가(제공 대상 외 정보)' · 개인 열람 법인등기 '해당없음'
- AI 첨부: 새 버전 템플릿 HTML 을 이 지시문과 함께 꼭 첨부하세요. 새 버전이 없으면 지시문만으로는 정확히 반영되지 않습니다.
- AI 적용 내용:
    - 다음은 K-BIGx PDF 템플릿 HTML 의 이전 템플릿(직전 릴리스) 대비 변경분이다. 프로젝트에 있는 이전 템플릿 HTML 에 아래 변경을 적용해 줘.
    - 이 지시문은 요약이라 빠지거나 틀린 부분이 있을 수 있다. 함께 첨부한 새 버전 템플릿 HTML 과 프로젝트의 이전 템플릿을 비교해(마지막 <script>(③ 화면 코드)와 맨 위 안내문) 이 지시문에 없는 차이까지 찾아 반영하고, 지시문과 새 버전이 다르면 새 버전을 기준으로 한다.
    - 적용이 끝나면 같은 데이터(JSON)로 고친 파일과 새 버전을 열어 화면 · 쪽 수 · 문구가 같은지 확인해 줘. 압축된 이름(변수 · 함수 이름)이 다른 것은 차이가 아니다.
    - 찾기 단서는 모두 이전 템플릿에 있다. 같은 글자 · 클래스가 여러 곳이면 괄호에 적힌 1곳만 바꾼다.
    - ■ 적용 방법
    - · 문구는 데이터(JSON) 값과 화면 코드 두 곳에 있다 — 아래 '데이터 값'은 보내는 JSON 을, 나머지는 템플릿 마지막 <script>(③ 화면 코드)를 고친다
    - · ② #kbigx-report-root 미리 그린 마크업은 열 때 ③ 으로 다시 그려지므로 고치지 않아도 된다
    - · '찾기' 의 글자 · 클래스로 ③ 안의 위치를 찾고 '→' 뒤 값으로 바꾼다(크기 숫자는 용지 px, kbx-text-N = N px)
    - · ③ 안의 한글 문자열은 \uXXXX 로 적혀 있다(예: '평가이력' = \uD3C9\uAC00\uC774\uB825) — 한글은 이 형태로 찾고 바꾼다. 컴포넌트 · 변수 이름은 압축돼 없으니 클래스 · 문자열로 찾는다
    - ■ 데이터 값(JSON)
    - · innovation.rndNote: '* 상위 4개만 있으므로 상세 내용은 ‘기술혁신 > 정부 R&D 사업’ 페이지 참조 해주세요.' → '* 상위 4개만 표시되므로, 추가 정보는 기술혁신정보 - 정부R&D사업 페이지를 참조해주세요.'
    - · techInnovation.holdings.description: '기술 보유현황은 귀사의 특허(기술)를 AI로 분석하고, 분석결과에 따라 보유 기술을 국가과학기술표준분류체계(중분류, 세부분야)로 분류한 것입니다.' → '보유기술은 귀사의 특허(기술)를 AI로 분석하고, 분석결과에 따라 국가과학기술표준분류체계(중분류 - 세부분야)로 분류한 것입니다.'
    - · techIndexDetail.descriptions: 앞 두 항목 'Tech-Index는 현재의 기술역량과 미래성장의 잠재력 수준을 측정하는 AI평가모형 기반의 복합지수입니다.' · 'Tech-Index는 현재 기업의 내재적 기술혁신역량을 나타내는 지수(Index)이면서 동시에 미래성장성을 예측해 볼 수 있는 확률적인 점수를 의미합니다.' → 한 항목 'Tech-Index는 현재의 기술역량과 미래성장의 잠재력 수준을 측정하는 AI평가모형 기반의 복합지수로, 현재 기업의 내재적 기술혁신역량을 나타내는 지수(Index)이면서 동시에 미래성장성을 예측해 볼 수 있는 확률적인 점수를 의미합니다.'
    - · techIndex.scoreNote: 화면에서 쓰지 않음(보내지 않아도 됨)
    - · creditDetail.cashFlow.details: [{"label": "결산일자", "value": "YYYY-MM-DD"}] — 현금흐름등급 원호 안 날짜 줄
    - ■ 제목 글자(찾기 → 바꾸기) — 같은 글자는 목차 · 쪽 제목 · 표 캡션 · 낭독용 이름까지 모두 바꾼다(아래 '혁신성장역량지수' 만 예외)
    - · '관련 기업 및 특허현황' → '관련 기업 및 특허 현황'
    - · '정부 R&D사업 접수현황' → '정부 R&D 사업 현황'
    - · 진단브리핑 블록 제목 '혁신성장역량지수' → 'Tech-Index'(제목 옆 scoreNote 단위 글 삭제). 이 글자는 ③ 에 7곳 — 진단브리핑 블록 제목 1곳만 바꾸고 Tech-Index 장의 '혁신성장역량지수 비교' 등은 그대로
    - · '경영진 및 주주현황' → '경영진 및 주주 현황' · '특허 및 인증현황' → '특허 및 인증 현황' · '거래처현황' → '거래처 현황' · 목차 '기업현황' → '기업 현황'
    - · 기업 현황 > 재무 블록 제목 '재무현황' → '재무 현황', 손익 그래프 제목 '손익현황' → '손익 현황'(낭독용 이름 '연도별 손익현황 — …' 의 '손익현황' 도 같이 — 2곳)
    - · '기술 보유현황' → '기술보유 현황' · '특허 보유현황' → '특허보유 현황'(캡션 '특허 보유현황(최대 10개, 출원일 최근순)' 포함)
    - · 신용/재무정보 기업신용등급 '이전평가이력' → '평가이력' · '차입금 변동현황' → '차입금 변동 현황'
    - · Tech-Index 점수 없음 문구 '평가 점수가 없습니다.' → '기술신용평가(TCB) 이력이 없어 산출 불가합니다.'
    - ■ 스타일 · 배치(찾기 → 바꾸기)
    - · 진단브리핑 Tech-Index 블록: 점수 위 'Tech-Index' 작은 글(class 'kbx-text-22 font-kbx-bold text-kbx-foreground-subtle', lang="en") 삭제
    - · 진단브리핑 평균 특허수 목록(dl class 'kbx-text-28 text-kbx-primary'): 값 '1.6건' 을 숫자 + 단위로 나눔 — 숫자 뒤에 <span class="font-kbx-bold kbx-text-22 ml-1">건</span>(숫자 28 · 단위 22)
    - · Tech-Index 지수설명 문단: 'AI평가모형 기반의 복합지수' 글자를 감싼 <b class="text-kbx-foreground font-kbx-bold"> 만 제거(같은 클래스가 5곳 — 이 글자를 감싼 1곳만), 문단 전체 굵기 400
    - · 특허 및 인증 현황 건수 카드: 'h-20 justify-center gap-0.5 px-6' → 'h-20 justify-between px-6 pt-3 pb-1', 숫자 줄 'leading-kbx-100' → 'leading-kbx-100 self-end'(이름 왼쪽 위 · 숫자 오른쪽 아래)
    - · 특허 및 인증 현황 인증 상자 이름: 'kbx-text-26 font-kbx-bold' → 'kbx-text-22 font-kbx-bold'
    - · 경영진 · 주주 표: 행 수를 첫 쪽 높이 어림값 대신 5 로 고정(많으면 앞 5건, 모자라면 '-' 줄)
    - · 표 금액 칸 글자 자동 축소: 숫자 문자열의 폭(수치 카드 글자 크기 고를 때 쓰는 기존 글자 폭 어림 함수 — 코드포인트 0x1100 이상 1 · 대문자 · 숫자 0.62 · 소문자 0.55 · 그 밖(쉼표 등) 0.35 em 합계) × 글자 크기가 칸 폭을 넘으면 다음 단계로 — 단계 kbx-text-20 → 18 → 16 → 14 → 12(가장 작아도 넘치면 12), 결과를 <span class="kbx-text-N whitespace-nowrap"> 로 감쌈. 칸 폭(용지 px): 주주 주식수 159 · 관계기업 총자산 122 · 관계기업 매출 102 · 재무 표 값 칸(18 부터 시작)은 구분 열 'w-1/4'(재무상태 · 손익) 123 · 'w-2/5'(주요재무비율) 95 · 'w-1/2'(현금흐름) 77
    - · 한 줄 말줄임 칸 추가: 관계기업 결산연도 · 경영진 생년월일 · 거래처 신용등급/평가일자 칸 값을 기존 한 줄 말줄임 요소(<div class="truncate">, 비면 '-')로 감쌈(지금은 글자 그대로 — 길면 줄이 늘어 쪽 높이가 어긋남)
    - · 재무상태 · 손익 겹친 막대 SVG: 가로축 <line stroke=기준선 색> 을 막대 <rect> 들 뒤(SVG 맨 끝)로 옮겨 막대 위에 보이게
    - · R&D 전문기관 현황 표: 둘째 묶음 첫 열(산학협력단 '기관명')에 붙는 'kbx-border-l-hairline'(지금 머리글 th 2곳)을 본문 칸 td 에도
    - · 재무비율진단(성장성 · 수익성 · 안정성 · 활동성): 재무비율 표 바로 아래 꺾은선 + 범례 묶음의 'flex flex-col gap-2.5' → 'mt-6 flex flex-col gap-2.5'(표와 사이 16 → 40). 같은 클래스가 3곳 — 재무비율진단 1곳만
    - · 에너지 사용 현황(전기 · 가스): 사용량 표 바로 아래 꺾은선 그래프 상자(emptyClassName:"h-60")를 <div class="mt-6"> 로 감쌈(표와 사이 16 → 40). emptyClassName:"h-60" 은 2곳 — 에너지 사용 현황 그래프 1곳만(나머지는 인당 매출액)
    - · 인당 매출액 막대 목록 연도 칸(막대 왼쪽 연도 글자): className "w-35 shrink-0"(정확히 이 값 1곳) → "w-35 shrink-0 text-center"
    - · 기관별 비중 도넛 아래 '<p class="kbx-text-18 text-kbx-foreground-subtle text-center">○○년 기준</p>' 삭제, 담보 현황 도넛 아래 '○○년 기준' 글 삭제(도넛 칸 'w-1/2 pr-7' 은 유지)
    - · 도넛 묶음 상자(class 'flex w-full items-center gap-15' 안): 조건 'h ? (상자 + 아래 글 p) : 도넛' → '(아래 글 || 상자 클래스) ? (상자 + (아래 글 ? p : 없음)) : 도넛' — 아래 글을 지워도 도넛이 'w-1/2 pr-7' 상자 가운데에 남게(담보 현황 도넛 칸 'w-1/2 pr-7 gap-2.5' → 'w-1/2 pr-7')
    - · 특허 및 인증 현황 건수 카드 숫자 크기 단계: '{className:"kbx-text-28",size:28}],unit:"kbx-text-24 ml-1.5"' 앞 단계 목록 끝에 {className:"kbx-text-24",size:24} 추가(40 → 34 → 28 → 24)
    - · 기업 정보 · 개요 값 칸 줄바꿈: '"break-normal wrap-anywhere":"break-keep"' → '"break-normal wrap-anywhere":"wrap-anywhere break-keep"'(띄어쓰기 없는 긴 영문 · 숫자도 칸 안에서 끊음)
    - ■ 기업 현황 첫 쪽 행 수 계산(찾기: 'baseBottom:1732' 가 있는 설정 객체와 그 아래 계산 함수)
    - · 설정: overviewWidth 391 → 360, estimateMargin: 8 추가(나머지 baseBottom 1732 · overviewLine 29 · overviewFontSize 24 · overviewMaxLines 2 · tableRow 43.5 그대로)
    - · 개요 값 줄 수 어림(글자 크기를 고를 때와 줄 수를 셀 때 모두 이 함수로 교체): 글자별 폭(em) — 코드포인트 0x1100 이상(한글 등) 1 · W M @ 0.95 · m w 0.86 · 대문자 0.72 · 숫자 · 소문자 0.62 · 그 밖 0.35, 띄어쓰기 0.3. 값을 띄어쓰기로 낱말로 나눠 lines=1 · used=0 에서 시작 — 낱말 폭 w=글자 폭 합 × 글자 크기, 앞 공백 sp=(used>0 ? 0.3 × 글자 크기 : 0). used+sp+w ≤ 칸 폭이면 used+=sp+w, 아니면 k=ceil(w ÷ 칸 폭), lines += (used>0 ? 1 : 0) + k − 1, used = w − (k − 1) × 칸 폭. 끝난 뒤 lines 가 줄 수(기존 영문 · 숫자 0.56em 어림을 대체)
    - · 행 수: 경영진 · 주주는 늘 5행(tableRows 계산 삭제). 관계기업 행 수 = 3 + floor((budgetBottom − baseBottom − 개요 추가 높이 − estimateMargin) ÷ tableRow), 최소 1 · 최대 10(기존 '경영진 · 주주와 번갈아 줄이고 늘리는' 단계 계산 삭제)
    - ■ 열람 케이스(viewerCase)
    - · partner-corp · partner-person: id suspension · short-overdue · trade-overdue · public-arrears 표 — 받은 상태가 '해당없음' 이어도 가림. 제목 옆 상태 배지 숨김, 값 줄 '비공개' → '열람불가(제공 대상 외 정보)' 한 줄, 표 캡션 '제목 — 열람불가(제공 대상 외 정보)'
    - · partner-person: id registry 표 — 받은 값과 관계없이 상태 '해당없음' · 값 줄 없음([해당없음] 배지 + '해당사항 없음' 한 줄)
    - ■ 맨 위 안내문(파일 첫 주석) 문장 교체 — 바꿀 문장은 「 」 안 그대로
    - · [4] viewerCase "partner-corp" 줄: 「단기연체 · 상거래연체 · 공공체납 표 + 차입금 현황 가림」 → 「당좌거래정지 · 단기연체 · 상거래연체 · 공공체납 표 가림 + 차입금 현황 가림」
    - · [4] viewerCase "partner-person" 줄: 「위 + 법인등기 · 당좌거래정지 표 가림」 → 「위 + 법인등기 표는 '해당없음'」
    - · [4] 그 바로 아래 두 줄 추가: 「가린 표 = 상태 배지 없이 값 줄 '열람불가(제공 대상 외 정보)' 한 줄(받은 상태가 '해당없음' 이어도)」 · 「'해당없음' 표 = [해당없음] 배지 + 값 줄 '해당사항 없음'(받은 값과 관계없이)」
    - · [5] creditDetail.creditInfo[].status "해당없음" 줄: 「'해당사항 없음' 으로 보이고 가리지 않는다」 → 「[해당없음] 배지 + '해당사항 없음' 줄(viewerCase 로 가린 표는 '열람불가' 가 우선)」
    - · techInnovation.holdings.patents 줄: 「(특허 보유현황)」 → 「(특허보유 현황)」
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/0150db556d6cc012afdb1c05dcdbdd6f973ac2d0)

# 작업: [현업 피드백] 가격정책 K-BIGx 탭 — 가격 · 조회 건수 · 안내 문구 변경

## [Diff 확인]

### [화면] 가격정책 K-BIGx 탭 — 가격 · 조회 건수 · 안내 문구 변경

- 대상: src/content/service/pricing.ts
    - src/components/custom/pricing-policy.tsx
- 변경:
    - 이용권: 1회권 22,000원 · 1건 / 베이직 330,000원 · 20건 / 스탠다드 550,000원 · 50건 / 프리미엄 1,100,000원 · 200건
    - 이용 안내: '타사 조회 시 일부 정보(단기연체·공공체납 등)는 제공 대상이 아닙니다.' 추가
    - 차감 예외 안내('다음의 경우에는 이용 횟수가 차감되지 않습니다.') 삭제
    - 파트너(기관) 이용 안내: 담당자 연락처에 kbigx@kibo.or.kr 추가
- 결과: 가격정책 · 결제하기 · 결제 완료에 새 가격 · 건수가 표시
- 영향 화면: [가격정책 (기업)](/corp/pricing?tab=kbigx)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/94ab6896dd0f69bcd275136f1ba44fe1b0df1286)

# 작업: [기획수정] 내 정보 — K-BIGx 마케팅 알림 수신 동의로 변경

## [Diff 확인]

### [화면] 내 정보 — K-BIGx 마케팅 알림 수신 동의로 변경

- 대상: src/components/composite/mypage-profile-form.tsx
    - src/content/service/k-bigx-marketing-consent.ts
    - src/components/composite/k-bigx-marketing-consent-dialog.tsx
    - src/constants/mypage-profile.ts
- 변경:
    - 이름: '[선택] K-BIGx 마케팅 알림 수신 동의'
    - [자세히]: K-BIGx 보고서 마케팅 정보 수신 동의 모달을 그대로 엶(MYPAGE_MARKETING_CONSENT_TITLE 삭제)
- 영향 화면: [내 정보 (기업)](/corp/mypage/profile)
- 함께 작업: 아래 삭제 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/22bfb8a9f8cc79f58f83361b6a453430056a79b7)

## [삭제]

### [화면] 기술평가 마케팅 수신 동의 팝업 삭제

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/mypage/profile/marketing-consent/page.tsx
- 적용: 파일 삭제
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/31b149ec182e56ff44c20223c4b5068a15b410f1)

# 작업: [기획수정] 탄소중립 소개 — 진단 시작 버튼 링크 변경

## [Diff 확인]

### [문구] 탄소중립 소개 — 진단 시작 버튼 링크 변경

- 대상: src/content/service/platform-carbon-neutrality.ts
- 변경:
    - 탄소중립 진단 시작하기: https://www.kibo.or.kr/carbon/carbon-reduction/guide
    - K-택소노미 진단 시작하기: https://www.kibo.or.kr/carbon/k-taxonomy/guide
- 영향 화면: [탄소중립 소개 (기업)](/corp/platform/carbon-neutrality)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/9710bbb099a02487282bc5f82442d55439484b00)

# 작업: 퍼블리싱 가이드 · 컴포넌트 가이드 갱신

## [덮어쓰기]

### [문서] 컴포넌트 가이드 — 변경 화면 설명 · 예시 갱신

- 대상: src/app/component-guide/(guide)/accessibility-exceptions/page.tsx
    - src/app/component-guide/(guide)/callout-pie-chart/page.tsx
    - src/app/component-guide/(guide)/donut-list-chart/page.tsx
    - src/app/component-guide/(guide)/empty-state/page.tsx
    - src/app/component-guide/(guide)/evaluation-card/page.tsx
    - src/app/component-guide/(guide)/grade-history-chart/page.tsx
    - src/app/component-guide/(guide)/grade-scale-gauge/page.tsx
    - src/app/component-guide/(guide)/icon/page.tsx
    - src/app/component-guide/(guide)/image/page.tsx
    - src/app/component-guide/(guide)/info-table/info-table-types.tsx
    - src/app/component-guide/(guide)/kbigx-print-output-selection-dialog/page.tsx
    - src/app/component-guide/(guide)/mypage-shell/page.tsx
    - src/app/component-guide/(guide)/rating-trend-chart/page.tsx
    - src/app/component-guide/(guide)/report-shell/page.tsx
    - src/app/component-guide/(guide)/sticky-sidebar/page.tsx
    - src/app/component-guide/(guide)/tabs/page.tsx
    - src/app/component-guide/(guide)/truncated-text/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - [웹접근성 예외사항](/component-guide/accessibility-exceptions): WAVE 양쪽 정렬 알림(고객사 요청) 카테고리 추가
    - [등급 척도 게이지](/component-guide/grade-scale-gauge): details(결산일자 줄) 예시 추가
    - [보고서 셸](/component-guide/report-shell): 열람 케이스 가림 규칙 · 특허보유 현황
    - [도넛 목록 차트](/component-guide/donut-list-chart): 도넛 아래 글 예시를 일반 사례로
    - [빈 상태](/component-guide/empty-state): 점수 없음 문구 변경
    - [평가 카드](/component-guide/evaluation-card): 접수일 시각 예시
    - [아이콘](/component-guide/icon) · [정보 표](/component-guide/info-table): 1회권 · 새 가격 예시
    - [이미지](/component-guide/image): 로그인 탭 그림 사용처 없음
    - [탭](/component-guide/tabs) · [고정 사이드바](/component-guide/sticky-sidebar) · [마이페이지 셸](/component-guide/mypage-shell): '이용권 관리'
    - 그 밖(차트 · 말줄임 · 출력 선택 모달): 소제목 띄어쓰기 · 이름 맞춤
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/238c33c4223fec91bfbdcba5b1237c88f985fccd)

### [문서] 퍼블리싱 인덱스 · 화면 등록 갱신

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체
- 내용: 기술평가 마케팅 수신 동의 팝업 행 삭제 · 기관 '기업 자가진단 결과보기' 완료 처리 · 이용권 관리 명칭
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/d36d72a120b0a6a4704bd5e06c441fae103b6240)

## [신규 추가]

### [기능] 릴리즈 노트 카드 'AI 적용 내용' 버튼 · 모달 추가

- 대상: src/components/custom/release-note-ai-guide.tsx
- 적용: 신규 파일 추가
- 내용:
    - '- AI 적용 내용:' 아래 줄: 카드에 펼치지 않고 [AI 적용 내용 보기] → 모달 본문으로 표시, [텍스트 복사]로 전체 복사
    - '- AI 첨부:' 값: 카드에 그리지 않고 모달 제목 바로 아래 큰 설명으로 표시(복사 대상 아님) — 없으면 '아래 지시문을 복사해 AI 에 넣으세요.'
    - 자동 복사가 막힌 환경: 본문 전체를 선택해 두고 Ctrl+C(Mac ⌘+C) 안내
- 함께 작업: 아래 덮어쓰기 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/00afd4ed9c2ba3e6a876557fc1ab4e79111730d7)

## [덮어쓰기]

### [문서] 릴리즈 노트 카드 목록 — 'AI 적용 내용'은 버튼으로, 'AI 첨부'는 모달 안내로 표시

- 대상: src/components/custom/release-note-change-list.tsx
- 적용: 지정한 파일만 교체
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/2b81ac3e2a62f62504eff056ac6d81e2df5d280c)
