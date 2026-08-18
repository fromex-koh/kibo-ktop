# 다음 릴리스 변경사항

## [Diff 확인]

### Tech-Index 출원 특허 상태·합계 연동

- 대상:
    - src/components/composite/tech-index-patent-form.tsx
    - src/components/composite/self-diagnosis-form-tabs.tsx
    - src/constants/technology-evaluation.ts
- 변경: 일반용·창업용 특허 보유현황의 상태 옵션을 `등록`·`출원`으로 정리하고, `출원 특허`를 직접 입력 방식에서 카드 상태 기반 읽기 전용 자동 합계로 변경
- 결과: 기존 폼·제출 연동은 유지하면서 `appliedPatentCount`가 상태가 `출원`인 특허 카드 수와 일치하도록 비교 반영
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/f3bca572042ea8b9a545bf2edb57fba68ce6a627)
