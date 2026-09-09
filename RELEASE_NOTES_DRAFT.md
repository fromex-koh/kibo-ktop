# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.
frontend-handoff에 실제 전달되는 파일의 변경만 작성하세요.
프로젝트 서비스 페이지가 아닌 퍼블리싱 가이드 관련 파일은 [덮어쓰기]로 분류하세요.

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

### 보증추천 — 은행·영업점명을 한 줄로 묶고 라디오 묶음 라벨을 고침

- 대상: src/components/composite/guarantee-recommendation-dialog.tsx
- 관련 화면: [기관 보증추천](/org/mypage/evaluation-history/guarantee-recommendation) — 보완(09/10)
- 입력 배치: 시안대로 [은행]과 [영업점명]을 한 줄에 두고 [검색] 버튼은 영업점명 쪽 하나만 남겼습니다. 두 칸이 한 모달에서 함께 정해지므로 버튼이 둘일 이유가 없습니다. 칸 폭은 시안값(은행 208 · 영업점명과 버튼이 나머지)이고, 좁은 화면에서는 위아래로 쌓입니다.
- 안내 문구: 구획 끝에 `※ 서류안내, 현장실사 협의 등 평가 진행사항을 안내받을 담당자 정보(휴대폰)를 입력해 주십시오.` 를 더했습니다(시안).
- 접근성 수정: 물음 [현재 다른 보증기관 이용 여부] 를 보기 하나가 아니라 묶음 전체의 이름으로 옮겼습니다[7.4.1].
    - 이전 — 물음이 `<label htmlFor>` 로 첫 보기에 묶여, 그 보기가 "부" 대신 물음 전체로 읽혔고 둘째 보기는 물음 없이 "여" 로만 읽혔습니다.
    - 지금 — 묶음(radiogroup)의 이름은 물음, 보기의 이름은 "여"·"부" 입니다. 기관 고객정보활용동의의 동의 여부 물음과 같은 방식입니다.
- 유지: 네 구획 구성·검사 관문·[임시저장]·[보증 추천] 흐름은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/4ce45813)

### 기술평가센터 검색 — 시안 반영과 검색 시점 정리

- 대상: src/components/composite/search-select-dialog.tsx
    - src/components/composite/guarantee-search-dialogs.tsx
- 관련 화면: [기관 기술평가센터 검색](/org/mypage/evaluation-history/guarantee-recommendation/center-search) — 보완(09/10)
- 안내 박스: 모달 맨 위에 `지역본부 선택 후 기술평가센터를 검색·선택하세요.` 한 줄을 더했습니다(회색 면 · 반경 8 · 여백 20 · 14/21).
- 규격: 지역본부 셀렉트 180 → 208, 표의 지역본부 칸 140 → 200 으로 시안에 맞췄습니다. 좁은 화면에서는 140 으로 되돌려 센터명이 접히지 않게 합니다.
- 버튼: [검색] 을 파란 버튼에서 흰 면·회색 테두리(tertiary)로 바꿨습니다 — 모달의 주된 행동은 아래 [선택 완료] 입니다.
- 표 머리 선: 표 위 진한 선이 옅은 선으로 덮여 있었습니다(같은 요소에 테두리 색을 두 번 지정). 위·아래 색을 따로 지정해 시안대로 되돌렸습니다.
- 검색 시점: 글자를 치는 동안 목록이 저 혼자 바뀌던 것을 [검색](또는 Enter)을 눌렀을 때만 바뀌도록 했습니다. 지역본부 셀렉트도 같은 규칙입니다.
- 제거: 목록 아래 [선택 : …] 요약 줄을 없앴습니다(시안에 없음). 고른 줄은 표에서 파란 면으로 남고, 읽어 주는 알림은 그대로입니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f2c71fb1)

### 업종코드 조회 — 안내 패널 공통화와 표 머리 선 수정

- 대상: src/components/composite/industry-code-dialog.tsx
- 안내 패널: 이 파일 안에 있던 "회색 면 + 불릿" 패널을 공통 조각(DialogNotice)으로 옮겨 씁니다. 같은 규격이 기술평가센터 검색에도 나와, 파일 안 주석에 적어 두었던 대로 공통으로 뺐습니다.
- 표 머리 선: 위 진한 선이 옅은 선에 덮여 있던 것을 함께 고쳤습니다(기술평가센터 검색과 같은 원인).
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/08e4b0e4)

## [신규 추가]

### 은행 영업점 조회 — 은행 검색·영업점 검색 두 모달을 하나로

- 대상: src/components/composite/bank-branch-search-dialog.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/evaluation-history/guarantee-recommendation/bank-branch-search/page.tsx
    - src/content/service/tech-evaluation-centers.ts
- 관련 화면: [기관 은행 영업점 조회](/org/mypage/evaluation-history/guarantee-recommendation/bank-branch-search) — 보완(09/10)
- 적용: 모달 파일과 화면은 신규 추가이고, 목록 데이터(tech-evaluation-centers.ts)는 기존 파일을 교체합니다.
- 함께 반영: 아래 [삭제] 의 은행 검색 화면을 같은 릴리스에서 지워야 합니다 — 남겨 두면 쓰이지 않는 화면이 인덱스와 어긋납니다.
- 화면 구성: 은행 셀렉트 → 영업점명 입력 + [검색] → 표(은행명 · 지로코드 · 영업점명) → [닫기]. 시안의 CTA 가 [닫기] 하나뿐이라 목록의 한 줄이 곧 버튼입니다 — 누르면 은행과 영업점명이 함께 담기고 닫힙니다.
- 데이터: 영업점 목록에 지로코드를 더했습니다(`BankBranch` = 코드 · 은행명 · 지로코드 · 영업점명). 앞의 다섯 줄은 시안에 적힌 값 그대로입니다.
- 연동 지점: `BANK_BRANCHES` 를 조회 API 응답으로 바꾸면 모달은 그대로 동작합니다. 서버에서 검색해야 하면 모달 안 `searchBranches` 자리를 조회 요청으로 바꿉니다.

### DialogNotice — 모달 안내 패널 공통 조각

- 대상: src/components/composite/dialog-notice.tsx
- 적용: 신규 파일 추가
- 내용: 모달 맨 위에서 "무엇을 하는 자리인지" 한두 줄로 알리는 회색 면 + 불릿 패널입니다. 페이지 하단의 InfoBox 와 규격이 달라(면 gray.10 · 반경 8 · 여백 20 · 본문 14/21 · 제목 없음) 따로 둡니다. 업종코드 조회와 기술평가센터 검색이 함께 씁니다.
- 불릿: 본문이 14/21 이라 점도 작은 것(12×20 칸 · 3×3 점)을 씁니다 — 16/24 본문용 점을 쓰면 칸이 24 라 점이 글줄 가운데보다 아래로 내려갑니다.

## [덮어쓰기]

### 컴포넌트 가이드 — 마크업 검증에 모달 관련 항목 추가

- 대상: src/app/component-guide/(guide)/validation-exceptions/page.tsx
- 적용: 개발자가 작업하는 화면이 아니라 문서라 파일을 통째로 덮어씁니다.
- W3C: `Radix 모달 — 배경 감춤 · 스크롤 잠금 스타일` 절을 더했습니다. 모달이 열리면 배경 요소에 `aria-hidden` 이 붙어 Next.js 가 남긴 `<div hidden>` 과 겹치고, 스크롤 잠금 스타일에 `type="text/css"` 가 붙습니다. 둘 다 전송 문서에는 없고 실행된 뒤의 DOM 에만 있습니다.
- WAVE: 비어 있던 탭을 채웠습니다. `Radix RadioGroup — Missing form label`(라이브러리, 수정 불가)과 `라디오 묶음 — 물음이 첫 보기의 이름이 됨`(우리 원인, 이번에 수정 완료) 두 절입니다.

### 릴리즈 노트 — 지울 파일을 따로 표시하는 [삭제] 분류 추가

- 대상: src/content/publishing-guide/types.ts
    - src/content/publishing-guide/index.ts
    - src/components/custom/publishing-index.tsx
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다.
- 왜: 분류가 [Diff 확인]·[신규 추가]·[덮어쓰기] 셋뿐이라, 지워야 하는 파일이 다른 카드 안에 묻혀 놓치기 쉬웠습니다.
- 표시: 릴리즈 노트 카드에 빨간 [삭제] 배지가 서고, 카드 차례는 Diff 확인 → 덮어쓰기 → 신규 추가 → 삭제입니다 — 더하고 바꾼 뒤 마지막에 지우는 것이 순서상 안전합니다.
- 함께: 초안을 읽는 생성기(scripts/compute-asset-versions.mjs)도 `## [삭제]` 를 알아보도록 고쳤습니다. 이 파일은 전달본에 들어가지 않아 대상에서 뺍니다.

### 퍼블리싱 인덱스·화면 경로 레지스트리

- 대상: src/content/publishing-guide/publishing-index.json
    - src/content/publishing-guide/screen-registry.json
    - src/content/publishing-guide/screen-registry.generated.json
- 적용: 지정한 파일만 교체. 세 파일은 반드시 함께 교체해야 합니다 — 콘텐츠 관문이 빌드 시점에 두 JSON 의 화면 key 를 양방향으로 교차검증합니다.
- 행 병합: [은행 검색] · [영업점 검색] 두 행을 [은행 영업점 조회] 한 행으로 합쳤습니다. 레지스트리에서도 `bank-search` 항목을 지우고 남은 항목의 이름을 바꿨습니다.
- 상태: 이번에 고친 세 화면(보증추천 · 기술평가센터 검색 · 은행 영업점 조회)을 `보완(09/10)` 으로 두었습니다.

## [삭제]

### 은행 검색 화면 — 은행 영업점 조회로 합쳐 지웁니다

- 대상: src/app/(user-type)/org/(service)/(logged-in)/mypage/evaluation-history/guarantee-recommendation/bank-search/page.tsx
- 적용: 파일을 지웁니다(폴더째 비워집니다).
- 이유: 은행만 고르던 화면입니다. 은행과 영업점을 한 모달에서 함께 고르게 되면서 이 주소로 들어갈 길이 없어졌습니다.
- 함께 반영: 위 [신규 추가] 의 은행 영업점 조회 모달과 [덮어쓰기] 의 퍼블리싱 인덱스를 같은 릴리스에서 반영해야 합니다 — 화면만 지우면 인덱스가 없는 화면을 가리키고, 인덱스만 바꾸면 쓰이지 않는 화면이 남습니다.
