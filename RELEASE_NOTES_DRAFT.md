# 다음 릴리스 변경사항

<!--
main 병합 전에 노출할 내용을 아래에 불릿(-)으로 작성하세요.
항목이 많을 때는 `[적용 화면 또는 작업 영역] 변경사항` 형식으로 구분하며, 개수는 제한하지 않습니다.
컴포넌트 가이드 페이지는 `[페이지 제목](/component-guide/경로)` 형식으로 작성하면 새 창 링크로 표시됩니다.
릴리스 성공 후 내용은 자동으로 비워집니다.
-->

- 문의 완료 화면 반응형 개선
- 개인정보 처리방침 디자인 누락 반영
- Header 탄소중립 외부 링크 연결
- FAQ 빈 상태(EmptyState) 처리

- 덮어쓰기: `src/app/(user-type)/corp/(service)/(logged-in)/notice/inquiry-create/inquiry-complete`, `src/app/(user-type)/org/(service)/(logged-in)/notice/inquiry-create/inquiry-complete`, `src/components/custom/inquiry-complete`
- 덮어쓰기: `src/app/component-guide`, `src/constants/header-navigation.ts`
- 덮어쓰기: `src/components`, `src/components/custom/faq-list.tsx`
