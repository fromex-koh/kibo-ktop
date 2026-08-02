# shadcn-baseline — 바닐라 스타일 보관소 (업데이트 diff 기준선)

`npx shadcn add` 로 컴포넌트를 받은 **그 시점의 바닐라 스타일(CVA·className) 원본**을 보관하는 폴더다.
`src/components/ui/<name>.tsx` 셸에서 스타일을 `src/components/theme/<name>.variants.ts`(프로젝트 스타일)로
추출한 경우에만, 셸에서 밀려난 바닐라 스타일을 여기로 옮겨 둔다.

## 왜 보관하나

shadcn 이 업데이트되면 "업스트림이 스타일을 **무엇에서 무엇으로** 바꿨는지"를 알아야
프로젝트 스타일(theme/)에 반영할지 판단할 수 있다. 이 폴더의 파일이 그 비교 기준선이다:

```
새로 받은 바닐라 스타일  ↔  vendor/shadcn-baseline/<name>.variants.ts (직전 바닐라)
                          → diff = 업스트림 스타일 변경분
                          → 필요한 것만 src/components/theme/<name>.variants.ts 에 반영
```

## 규칙

- **순정 `ui/` 셸은 별도 보관하지 않는다** — 셸 자체가 업스트림 원본이므로 vendor 사본을 만들면 업데이트 지점만
  중복된다.
- **vendor 생성 기준은 `ui/<name>.tsx`의 theme import 여부다** — 스타일을 theme으로 추출한 수정 셸만 동일
  이름의 기준선 파일을 둔다.
- composite/custom에서 새로 만든 컴포넌트와 그 theme 스타일은 shadcn 원본이 아니므로 vendor 대상이 아니다.
- **앱 코드에서 절대 import 하지 않는다** — 참조용 사본일 뿐, 실사용 스타일은 `src/components/theme/` 에 있다.
  (그래서 `src/` 밖에 둔다 — IDE 자동완성·검색에서 실사용 파일과 섞이지 않게.)
- 내용은 다운로드 순정 그대로 둔다(수정 금지). export 이름만 `shadcn<Name>Variants` 또는
  `shadcn<Name>ClassName`으로 구분한다.
- tsconfig `exclude` 대상이라 typecheck·빌드에 포함되지 않는다. ESLint·Prettier 도 면제.
- 컴포넌트를 업데이트(`npx shadcn add <name> --overwrite`)하면 새 바닐라 스타일로 이 파일도 갱신한다.
  절차 전체는 [docs/SHADCN.md](../../docs/SHADCN.md) 의 "업데이트 절차" 참조.
