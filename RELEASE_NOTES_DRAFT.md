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

# 작업: [현업 요청사항] K-BIGx 기업혁신성장 조회 — 보고서 재조회 안내 팝업 추가

## [신규 추가]

### [데이터] 보고서 재조회 안내 — 팝업 문구

- 대상: src/content/service/k-bigx-report-recheck.ts
- 적용: 신규 파일 추가
- 내용:
    - 팝업 제목 · 안내 · 설명 2줄 · 차감 안내("신규 보고서 생성 시 이용권이 차감됩니다.") · [조회하기] 문구
    - 모달 확인 화면의 바닥 설명(노출 시점 · 노출 조건 · 버튼 구성 · 적용 범위)
- 함께 작업: 이 카드 먼저 — 아래 모달 · 화면이 이 문구를 씀
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/ecc076231dfdb318ddd7916c8e1e42b586238d16)

### [컴포넌트] 보고서 재조회 안내 모달 추가

- 대상: src/components/composite/k-bigx-report-recheck-dialog.tsx
- 적용: 신규 파일 추가
- 내용:
    - 구성: 아이콘(문서 + 시계) → 안내 "금일 조회한 보고서가 있습니다." → 설명 2줄 → 차감 안내 상자 → [취소] [조회하기]
    - [취소]는 팝업 닫기, [조회하기]는 신규 보고서 조회(onConfirm · 새 창 보고서 reportWindow — 보고서 생성 모달과 같은 방식)
    - 여는 방식: children(여는 버튼) · defaultOpen · open/onOpenChange
    - 규격은 다른 K-BIGx 모달과 같음(폭 588 · 여백 32, 모바일 24)
- 영향 화면: [보고서 재조회 안내 (기업)](/corp/k-bigx-report/innovation-growth-report/report-recheck)
- 함께 작업: 위 문구 카드 다음에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/a3c48aee32fbc08a722f711cd1bbb3efaa3118e8)

### [화면] 보고서 재조회 안내 — 모달 확인 화면 추가(기업 · 기관)

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/k-bigx-report/innovation-growth-report/report-recheck/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/innovation-growth-report/report-recheck/page.tsx
- 적용: 신규 파일 추가
- 내용:
    - 노출 시점: 조회 화면 [보고서 생성] 버튼 선택 시([기업혁신성장 보고서 생성] 팝업 대신 노출)
    - 노출 조건: 동일 이용자가 금일 이미 조회한 기업을 동일한 선택 특허 조건으로 다시 조회하는 경우
    - 적용 범위: FO 보고서 조회 화면 · 대량정보조회 제외
    - 퍼블리싱 확인용 주소 — 실제 서비스는 조회 화면의 [보고서 생성]에서 조건에 따라 이 모달을 연다(연결 방법은 innovation-growth-report-lookup.tsx 의 [프론트엔드 연동] 3)
- 영향 화면: [보고서 재조회 안내 (기업)](/corp/k-bigx-report/innovation-growth-report/report-recheck)
    - [보고서 재조회 안내 (기관)](/org/k-bigx-report/innovation-growth-report/report-recheck)
- 함께 작업: 위 모달 카드 다음에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/26de7f7fcd0648e8e8cd92f55d67a1b45676b936)

## [Diff 확인]

### [주석] 기업혁신성장 조회 — 재조회 안내 모달 연결 안내 추가

- 대상: src/components/custom/innovation-growth-report-lookup.tsx
- 변경:
    - 흐름: [보고서 생성] 때 금일 같은 기업 · 같은 선택 특허로 조회한 이력이 있으면 생성 모달 대신 재조회 안내 모달
    - [프론트엔드 연동] 3: 이력 판정은 서버 값 · KbigxReportRecheckDialog 를 open 으로 열기 · [조회하기]는 생성 모달과 같게 연결 · 대량정보조회 제외
- 결과: 주석만 바뀜 — 화면 · 동작 변화 없음
- 영향 화면: [기업혁신성장 조회 (기업)](/corp/k-bigx-report/innovation-growth-report)
- 함께 작업: 위 모달 카드 다음에 적용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/45614eb01b0fe5c49eb4ae1d7ec1a155fc86e614)

# 작업: 컴포넌트 가이드 · 퍼블리싱 인덱스 갱신

## [덮어쓰기]

### [문서] 아이콘 가이드 — FileClock 추가

- 대상: src/app/component-guide/(guide)/icon/page.tsx
- 적용: 지정한 파일만 교체
- 내용: 아이콘 목록에 FileClock(보고서 재조회 안내 모달) 추가
- 영향 화면: [아이콘 (Icon)](/component-guide/icon)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/667b80de14410d0d56a0155631d9a2c28e922652)

### [문서] 퍼블리싱 인덱스 — 보고서 재조회 안내 화면 등록

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체
- 내용: K-BIGx 보고서 › 기업혁신성장보고서 조회에 "보고서 재조회 안내" 행 추가(기업: 보고서 이용 안내 위 · 기관: 기업정보 제공법적 근거 위)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/889d53eb0a3ad9142db7a015e691fa5e460e45fb)
