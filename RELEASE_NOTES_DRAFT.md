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

# 작업: [현업 요청사항] 심층분석 보고서 — KTRS-FM · 창업용 Tech-Index · 투자모형 일부 수정

- 작업 성격: 영역 삭제 · 차트 교체 · 주석 추가 / 검토: 보통 — 보고서 데이터 형태가 바뀜(필드 삭제 · 추가), 조회 API 연결 시 필드 확인

## [Diff 확인]

### [화면] KTRS-FM 심층분석 3쪽 — 동업종 시장규모 삭제 · 비교대상 기준 주석 추가

- 대상:
    - src/constants/evaluation-report.ts
    - src/content/service/evaluation-report.ts
    - src/components/custom/evaluation-report.tsx
- 변경:
    - 타입 · 데이터: marketSize 삭제, comparisonBasis(문자열) 추가
    - 화면: '동업종 시장규모' 구획 삭제, 두 비교 표 아래 '※ {comparisonBasis}' 한 줄(12 Bold)
- 결과: 3쪽 시장규모 표 자리에 비교대상 기준 주석. 일반분석은 변화 없음
- 연동: 조회 응답의 marketSize 대신 comparisonBasis 를 채움
- 영향 화면: [KTRS-FM 심층분석 (기관)](/org/mypage/evaluation-history/deep-analysis/ktrs-fm)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/88bc2c3fe0574691935ad477920c55d160504cb6)

### [데이터] 창업용 Tech-Index 심층분석 3쪽 — 전체기업 · 비창업 막대 삭제

- 대상: src/content/service/startup-tech-index-deep-report.ts
- 변경:
    - 기업 유형별 Tech-Index 비교: '전체기업' · '비창업' 삭제
    - 기업 유형별 4대 혁신역량 비교: '비창업' 삭제
- 결과: 신청기업 · 창업 · 벤처 · 이노비즈 4개가 같은 간격으로 섬. 일반 Tech-Index 는 변화 없음
- 연동: 조회 응답도 이 4개 항목만 채움(컴포넌트 수정 없음)
- 영향 화면: [창업용 Tech-Index 심층분석 (기관)](/org/mypage/evaluation-history/deep-analysis/startup-tech-index)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ae3a5660b43207cb7d51c1b202e68da0bff603eb)

## [신규 추가]

### [컴포넌트] PeerItemBarTable — 칸 안에 막대가 들어가는 항목별 비교 표

- 대상: src/components/custom/peer-item-bar-table.tsx
- 적용: 신규 파일 추가
- 내용:
    - 줄: 평가항목(이름 · 단위) / 항목별 비교(막대) / 신청기업 / PEER 평균
    - 열마다 눈금(ticks)을 따로 받음. 수치는 소수 최대 한 자리, isLoading 시 스켈레톤
- 함께 작업: 아래 투자모형 카드와 한 번에 적용
- 확인 화면: [항목별 막대 표 (PeerItemBarTable)](/component-guide/peer-item-bar-table)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/86e7d49d4617f2d9e25407980a3ba429748aa436)

## [Diff 확인]

### [화면] 투자모형 심층분석 2쪽 — 세부항목비교를 막대 표로 교체 · 재무지표 라벨 · 주석

- 대상:
    - src/content/service/investment-model-deep-report.ts
    - src/components/custom/investment-model-deep-report.tsx
- 변경:
    - 세부항목비교: 방사형 차트 2개 → PeerItemBarTable(8개 항목), 데이터 detailRadars → detailItems
    - 세부항목비교 범례 'PEER 기업군': 막대와 같은 색, 점선 테두리 삭제
    - 재무지표비교: 라벨 매출액 · 자본금 · 순이익증가율 · 총자본순이익률, 아래 '※ {financialComparisonBasis}' 한 줄 추가
- 결과: 2쪽이 A4 한 장 안에 들어감
- 연동: 조회 응답에 detailItems(값 · 눈금 · 소수 자릿수) · financialComparisonBasis 를 채움
- 함께 작업: 위 PeerItemBarTable 카드와 한 번에 적용
- 영향 화면: [투자모형 심층분석 (기관)](/org/mypage/evaluation-history/deep-analysis/investment-model)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a5fcc8a8d6f0bf2a89ebe385770f9a1761879e7b)

# 작업: [현업 요청사항] 마이페이지 · 고객정보활용동의 · 공지사항 · 자료실 — 카드 안쪽 여백 32 로 통일

- 작업 성격: 여백 조정 · 옵션 추가 / 검토: 보통 — FormCard · SelectableCard 에 inset 옵션 추가, 화면은 768 이상 여백만 바뀜

## [Diff 확인]

### [컴포넌트] FormCard — inset 옵션 추가

- 대상: src/components/composite/form-card.tsx
- 변경: inset prop 추가 — default(기존 그대로) · compact(768 이상 상하좌우 32)
- 결과: inset 을 안 넘기는 화면은 변화 없음
- 함께 작업: 아래 inset="compact" 를 넘기는 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6d43545d5055fd46c5c403c0a4d24bf18fc9c0f4)

## [덮어쓰기]

### [스타일] SelectableCard — inset variant 추가

- 대상: src/components/theme/selectable-card.variants.ts
- 적용: 지정한 파일만 교체
- 내용: inset variant 추가 — default(기존 그대로) · compact(768 이상 상하좌우 32)
- 함께 작업: 아래 SelectableCard 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ce6bc8f8b2eea402cc664bd3f4d8cda6374dd5cb)

## [Diff 확인]

### [컴포넌트] SelectableCard — inset prop 전달

- 대상: src/components/composite/selectable-card.tsx
- 변경: inset prop 을 받아 theme variant 로 넘김
- 결과: 기존 사용처는 변화 없음
- 함께 작업: 위 스타일 카드와 한 번에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/db542097a1c764dae2fb03fd3a9d77c7925047e2)

### [화면] 고객정보활용동의 — 동의서 카드 · 선택 카드 여백 32

- 대상:
    - src/components/custom/customer-consent-agreement.tsx
    - src/components/composite/org-customer-consent-form.tsx
- 변경: FormCard · SelectableCard 에 inset="compact"
- 결과: 768 이상에서 동의서 카드 · 선택 카드 상하좌우 32
- 영향 화면:
    - [KTRS-FM 고객정보활용동의 (기업)](/corp/technology-evaluation/ktrs-fm/customer-consent)
    - [Tech-Index 일반 고객정보활용동의 (기업)](/corp/technology-evaluation/tech-index/general/customer-consent)
    - [Tech-Index 창업 고객정보활용동의 (기업)](/corp/technology-evaluation/tech-index/startup/customer-consent)
    - [투자모형 고객정보활용동의 (기업)](/corp/technology-evaluation/investment-model/customer-consent)
    - [대표자 이력 고객정보활용동의 (기업)](/corp/mypage/representative-history/customer-consent)
    - [KTRS-FM 고객정보활용동의 (기관)](/org/individual-evaluation/ktrs-fm/customer-consent)
    - [Tech-Index 일반 고객정보활용동의 (기관)](/org/individual-evaluation/tech-index/general/customer-consent)
    - [Tech-Index 창업 고객정보활용동의 (기관)](/org/individual-evaluation/tech-index/startup/customer-consent)
    - [투자모형 고객정보활용동의 (기관)](/org/individual-evaluation/investment-model/customer-consent)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/5702e25f39e5400896e04d6abe1ddc95a3b2c101)

### [화면] 마이페이지 정보 패널 — 여백 32 · 구분선 위아래 32

- 대상:
    - src/components/composite/mypage-form-card.tsx
    - src/components/composite/mypage-profile-form.tsx
    - src/components/composite/org-mypage-profile-form.tsx
- 변경:
    - 1280 이상 좌우 40 덮어쓰기 className 삭제 → inset="compact"
    - 내 정보 구분선 위아래 40 → 32
- 결과: 768 이상에서 패널 상하좌우 32
- 영향 화면:
    - [내 정보 (기업)](/corp/mypage/profile)
    - [대표자 이력 (기업)](/corp/mypage/representative-history)
    - [회원정보 수정 — 협약 기관 (기관)](/org/mypage/profile-edit/partner-agency)
    - [회원정보 수정 — 협약 은행 (기관)](/org/mypage/profile-edit/partner-bank)
    - [회원정보 수정 — 비협약 기관 (기관)](/org/mypage/profile-edit/non-partner-agency)
    - [회원정보 수정 — 비협약 은행 (기관)](/org/mypage/profile-edit/non-partner-bank)
    - [하위계정 내 정보 (기관)](/org/mypage/profile-edit/sub-account)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4a48bf7e5b8d2da2be27b9ee3d06f05c9e78704d)

### [화면] 마이페이지 조회 카드 · 목록 카드 · 하위계정 요약 — 여백 32

- 대상:
    - src/components/composite/search-filter-form.tsx
    - src/components/custom/evaluation-result-list.tsx
    - src/components/custom/k-bigx-report-card.tsx
    - src/components/custom/org-evaluation-history-list.tsx
    - src/components/custom/sub-account-card.tsx
    - src/components/custom/verification-application-card.tsx
    - src/components/custom/sub-account-summary.tsx
- 변경:
    - 조회 카드(SearchFilterForm): 768 이상 좌우 40 → 32, 상하 40(row) → 32
    - 목록 카드: 1280 이상 좌우 40 덮어쓰기 삭제(BaseCard lg 의 32 로)
    - 하위계정 요약: 768 이상 24 → 32(SummaryList md:p-8)
- 결과: 768 이상에서 세 카드 모두 상하좌우 32. 모바일은 그대로
- 영향 화면:
    - [평가결과 (기업)](/corp/mypage/evaluation-results)
    - [K-BIGx 보고서 이력 (기업)](/corp/mypage/k-bigx-report-history)
    - [평가이력 (기관)](/org/mypage/evaluation-history)
    - [K-BIGx 보고서 이력 (기관)](/org/mypage/k-bigx-report-history)
    - [검증신청 (기관)](/org/mypage/verification-application)
    - [하위계정현황 (기관)](/org/mypage/sub-account-progress)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/bea51f697c30b2f4df2db94b9ed1b8599cb88da1)

### [화면] 1:1 문의 · 공지사항 · 자료실 — 목록 · 상세 카드 좌우 32

- 대상:
    - src/components/custom/inquiry-list.tsx
    - src/components/custom/inquiry-detail.tsx
    - src/components/custom/notice-list.tsx
    - src/components/custom/notice-detail.tsx
    - src/components/custom/resource-list.tsx
- 변경: BaseCard 에 768 이상 좌우 24 → 32
- 결과: 768 이상에서 카드 상하좌우 32. 모바일은 그대로
- 영향 화면:
    - [1:1 문의 (기업)](/corp/mypage/inquiry-history)
    - [1:1 문의 상세 (기업)](/corp/mypage/inquiry-history/inquiry-detail)
    - [공지사항 (기업)](/corp/notice/announcements)
    - [공지사항 상세 (기업)](/corp/notice/announcements/detail)
    - [자료실 (기업)](/corp/notice/resources)
    - [1:1 문의 (기관)](/org/mypage/inquiry-history)
    - [1:1 문의 상세 (기관)](/org/mypage/inquiry-history/inquiry-detail)
    - [공지사항 (기관)](/org/notice/announcements)
    - [공지사항 상세 (기관)](/org/notice/announcements/detail)
    - [자료실 (기관)](/org/notice/resources)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ff119b3f928a4d0399cc819794b179902b10116a)

# 작업: 컴포넌트 가이드 문서 갱신

- 작업 성격: 가이드 문서 교체 · 추가 / 검토: 가볍게 — 서비스 화면 영향 없음

## [신규 추가]

### [문서] 항목별 막대 표 가이드 — 신규 페이지 · 메뉴 등록

- 대상:
    - src/app/component-guide/(guide)/peer-item-bar-table/page.tsx
    - src/constants/publishing-guide.ts
- 적용: 신규 파일 추가 · 메뉴 파일 교체
- 내용: [항목별 막대 표 (PeerItemBarTable)](/component-guide/peer-item-bar-table) 페이지 추가, 메뉴 차트 › 막대에 등록
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/56f24919a4104af548b9a15e27b3bc4c6bc5848c)

## [덮어쓰기]

### [문서] 여백 가이드 8개 — inset 옵션 · 32 기준

- 대상:
    - src/app/component-guide/(guide)/form-card/page.tsx
    - src/app/component-guide/(guide)/selectable-card/page.tsx
    - src/app/component-guide/(guide)/consent-list/page.tsx
    - src/app/component-guide/(guide)/email-field/page.tsx
    - src/app/component-guide/(guide)/mypage-shell/page.tsx
    - src/app/component-guide/(guide)/search-filter-form/page.tsx
    - src/app/component-guide/(guide)/summary-list/page.tsx
    - src/app/component-guide/(guide)/list-patterns/page.tsx
- 적용: 지정한 파일만 교체
- 내용:
    - [폼 카드 (FormCard)](/component-guide/form-card): inset 옵션 · 여백 표(default · compact)
    - [선택 카드 (SelectableCard)](/component-guide/selectable-card): inset 속성
    - [동의 목록 (ConsentList)](/component-guide/consent-list) · [이메일 입력 (EmailField)](/component-guide/email-field): 동의서 카드는 inset="compact"
    - [마이페이지 셸](/component-guide/mypage-shell): 패널 · 목록 카드 · 구분선 32 기준
    - [조회 필터 (SearchFilterForm)](/component-guide/search-filter-form): 카드 여백 md 이상 32
    - [요약 목록 (SummaryList)](/component-guide/summary-list): 하위계정 요약 md:p-8 예시
    - [목록 패턴](/component-guide/list-patterns): 목록 · 상세 카드 여백
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/fe9d2644698fbca7f7925b84bed1e709192d247f)
