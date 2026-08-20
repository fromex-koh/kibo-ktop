# 다음 릴리스 변경사항

## [Diff 확인]

### 체크리스트 조건부 Chip 하단 배치

- 대상: src/components/composite/checklist-form.tsx
    - src/components/composite/question-list.tsx
- 변경: 투자 유치 실적 문항을 체크했을 때 노출되는 `30억 이상`·`30억 미만`·`해당없음` Chip을 체크박스 라벨 오른쪽이 아닌 다음 줄에 동일 너비 3열로 배치
- 결과: 공통 `ChecklistForm`을 사용하는 기업·기관의 KTRS-FM·투자모형 제조/서비스 체크리스트 8개 화면에 동일하게 반영
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/e6244bf41abee4a90ae60aa8a7aef333dedc482c)

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
