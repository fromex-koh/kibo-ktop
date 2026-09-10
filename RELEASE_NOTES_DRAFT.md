# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.
frontend-handoff에 실제 전달되는 파일의 변경만 작성하세요.
프로젝트 서비스 페이지가 아닌 퍼블리싱 가이드 관련 파일은 [덮어쓰기]로 분류하세요.
지워야 하는 파일·화면은 [삭제]로 따로 적으세요.

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

### [스타일] 문의 상세·자주 묻는 질문 — Q.·A. 표시를 시안 그림으로

- 대상: src/components/custom/inquiry-detail.tsx
    - src/components/custom/faq-list.tsx
    - src/app/(user-type)/corp/(service)/(logged-in)/mypage/inquiry-history/inquiry-detail/page.tsx
    - src/app/(user-type)/org/(service)/(logged-in)/mypage/inquiry-history/inquiry-detail/page.tsx
- 이전: 문의 상세의 Q. 는 글꼴로 찍은 글자였고, 답변 자리에는 A. 표시가 아예 없었습니다. 자주 묻는 질문도 답변에 A. 가 없었습니다.
- 지금: 시안이 그린 24×24 그림(icon-etc/question · icon-etc/reply)을 그대로 씁니다. 그림 24 · 그림과 글 사이 8 · 답변 글이 질문 글과 같은 세로선에서 시작합니다.
- 답변대기: 시안대로 답변이 아직 없을 때도 A. 표시를 두고 그 옆에 대기 안내를 놓습니다(예전에는 표시 없이 글만 있었습니다).
- 확인 방법: [기업 문의 상세](/corp/mypage/inquiry-history/inquiry-detail) · [기관 문의 상세](/org/mypage/inquiry-history/inquiry-detail) · [기업 자주 묻는 질문](/corp/notice/faq) · [기관 자주 묻는 질문](/org/notice/faq) — 질문을 펼쳐 A. 그림이 답변 앞에 오는지 봅니다.
- 유지: 문의 상세의 `answer` prop 은 그대로입니다 — 넘기면 답변 본문이, 넘기지 않으면 대기 안내가 같은 자리에 들어갑니다.
- 화면 두 개(page.tsx)는 주석만 바뀌었습니다 — [프론트엔드 연동] 설명을 지금 동작에 맞췄습니다. 코드는 그대로입니다.
- 인덱스: 위 4개 화면을 `보완(09/11)` 으로 두었습니다.
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e570e9e9)

## [신규 추가]

### QaMark — 문답 표시 공통 조각과 그림 파일

- 대상: src/components/custom/qa-mark.tsx
    - public/images/faq/faq-answer-mark.webp
    - public/images/faq/faq-question-mark-dark.webp
    - public/images/faq/faq-answer-mark-dark.webp
- 적용: 조각과 그림 파일 모두 신규 추가입니다(`faq-question-mark.webp` 는 기존 파일 그대로).
- 내용: 문의 상세와 자주 묻는 질문이 같은 Q.·A. 그림을 쓰고 라이트·다크 짝도 같아 한곳에 모았습니다. `<QaMark type="question" />` · `<QaMark type="answer" />` 로 씁니다.
- 다크모드: 색이 아니라 그림 파일 자체가 갈려 토큰으로 표현할 수 없습니다. 라이트·다크 짝을 함께 두고 보이는 쪽만 남깁니다 — 숨은 쪽은 `display:none` 이라 칸을 차지하지 않아 옆 글과의 간격이 벌어지지 않습니다.
- 접근성: 그림은 장식이라 `alt` 를 비우고, 무엇을 가리키는 묶음인지는 사용처의 `sr-only` 문구가 알립니다[5.1.1].
- 크기: 원본 72×72 · 화면 표시 24×24. 새 그림을 더할 때도 라이트·다크 두 장을 짝으로 넣습니다.

## [덮어쓰기]

### 퍼블리싱 인덱스 — 이번 회차 화면 상태 반영

- 대상: src/content/publishing-guide/publishing-index.json
- 적용: 퍼블리싱 가이드 관련 파일이라 지정한 파일만 교체합니다.
- 상태: 이번에 손댄 4개 화면을 `보완(09/11)` 로 두었습니다 — 기업·기관 문의 상세, 기업·기관 자주 묻는 질문.
- 기존 뱃지 유지: 기업 문의 상세는 09/07 회차에도 손을 타 날짜를 배열로 두어 `보완(09/07)`·`보완(09/11)` 두 뱃지를 함께 남깁니다.
