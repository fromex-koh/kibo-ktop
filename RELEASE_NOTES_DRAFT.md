# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.

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

### 퍼블리싱 인덱스 표 행 식별자 개선

- 대상: src/components/custom/publishing-index.tsx
- 변경: 표 행의 React key 를 화면 경로(`path.join(' > ')`) 대신 화면 key 우선(`node.key ?? 경로`)으로 변경
- 결과: 같은 상위 뎁스에 이름이 같은 화면이 여러 개 있어도 행 identity 가 겹치지 않아 필터 전환·정렬 시 행 내용이 섞이지 않음. 화면 key 가 없는 노드는 기존 경로 방식을 그대로 사용
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/68d4a78a2e364c69e5fbd4cd71ce422bf64a2c0a)

### Tech-Index 재무정보 연도 카드 계정 정정

- 대상: src/components/composite/tech-index-finance-form.tsx
- 변경: 연도 카드 여덟 번째 칸의 이름을 [복리후생비] 에서 [연구개발비 (손익계산서)] 로 바로잡고, 값 이름도 출처를 따라 정리(welfareExpense2 → incomeStatementResearchDevelopmentCost, researchDevelopmentCost → manufacturingResearchDevelopmentCost)
- 결과: 한 해 카드에 [복리후생비] 가 두 번 나오던 중복이 사라지고, 연구개발비가 제조원가명세서·손익계산서 두 칸으로 구분됨. 재무정보 탭을 쓰는 기업·기관 Tech-Index 일반/창업 네 화면에 함께 반영
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/6323aafb61b4e57b3aa9c8c2ffc2372dd6efc613)

## [신규 추가]

### 기업 KTRS-FM·투자모형 기업기타정보 부가 화면

- 대상: src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/ktrs-fm/additional-company-info/cancel-confirm/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/additional-company-info/autosave/page.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/technology-evaluation/investment-model/additional-company-info/cancel-confirm/page.tsx
- 적용: 기업 KTRS-FM 기업기타정보의 [작성 취소] 화면과 기업 투자모형 기업기타정보의 자동저장·[작성 취소] 화면 경로 신규 추가. 작성 취소는 KTRS-FM 체크리스트의 공통 확인 다이얼로그를, 자동저장은 KTRS-FM 기업기타정보의 공통 토스트를 재수출하는 얇은 page 라 별도 구현 파일 없음

### 기관 개별평가 부가 화면

- 대상: src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/ktrs-fm/ 4개 (additional-company-info 자동저장·작성 취소, checklist 작성 취소, company-technology-info 이어서 작성 안내)
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/investment-model/ 5개 (additional-company-info 자동저장·작성 취소, checklist 자동저장·작성 취소, 제출 전 최종 확인)
    - src/app/(user-type)/org/(service)/(logged-in)/individual-evaluation/tech-index/general/ 및 startup/ 6개 (company-info 자동저장·작성 취소, company-technology-info 이어서 작성 안내)
- 적용: 기관 개별평가 세 모형(KTRS-FM·투자모형·Tech-Index 일반/창업)에 자동저장·작성 취소·이어서 작성 안내·제출 전 최종 확인 화면 경로 15개 신규 추가. 모두 기업 화면 또는 기관 KTRS-FM 화면의 공통 다이얼로그·토스트를 재수출하는 얇은 page 라 별도 구현 파일 없음

### 기관 일괄평가 Tech-Index 선택·제출전 최종확인 화면

- 대상: src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/tech-index-selection/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/batch-evaluation/evaluation-history-or-batch/general/batch-evaluation-request/final-review/page.tsx
- 적용: IA 에서 분리된 (1) Tech-Index 선택 화면과 일괄평가 진행 신청의 [제출전 최종확인] 화면 신규 추가. 두 화면 모두 새 UI 없이 기존 화면·공통 모달에 경로만 연결한다
- 화면: Tech-Index 선택은 평가모형(혁신성장지수 일반·창업)과 진행할 업무(평가내역조회·일괄평가 진행)를 한 화면에서 고르는 기존 일괄평가 선택 화면을 그대로 재수출. 제출전 최종확인은 [신청]이 검사를 통과하면 뜨는 확인 팝업으로, 공통 SubmitConfirmDialog 를 열어 둔 모달 단독 확인 화면이라 별도 신규 컴포넌트 없음

## [덮어쓰기]

### 퍼블리싱 인덱스 FO IA V1.21_260818·응용2팀 진척 상태 반영

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체. 세 파일은 반드시 함께 교체해야 한다 — 콘텐츠 관문(src/content/publishing-guide/index.ts)이 빌드 시점에 두 JSON 의 화면 key 를 양방향으로 교차검증하므로, 하나만 바꾸면 빌드가 실패한다
- 변경: 기업 155건·기관 147건 기준으로 IA 트리와 화면 경로 레지스트리를 갱신. 화면명 정정(기술평가 → 기술평가 소개, 입력도우미 → 입력도움말 등), 단계 번호 재정렬, 기관 개별평가·일괄평가 화면 추가와 삭제 항목 정리 포함
- 상태: 응용2팀 화면 진척 상태(application2Status) 62건을 함께 반영. 완료 처리 59건(미설정 → 완료 53, 진행중 → 완료 6)과 진행중 전환 3건이며, 퍼블리싱 인덱스의 응용2 진척률과 표의 응용2 상태가 이 값으로 갱신된다
