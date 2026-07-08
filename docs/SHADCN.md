# shadcn/ui 통합 규칙

shadcn/ui(radix 기반, `radix-nova` 스타일)를 이 프로젝트의 **디자인 토큰 시스템에 녹여서** 사용한다.
핵심 원칙: shadcn 컴포넌트가 자체 색/반경을 쓰지 않고 **`tokens.json` 단일 소스에서 나온 `--ds-*` 토큰**을 쓴다.

## 통합 방식 — 브릿지 + 정밀 매핑

### 1) 브릿지 (전역) — `src/app/globals.css`

shadcn 컴포넌트가 참조하는 시맨틱 슬롯(`--background`·`--primary`·`--border`·`--ring`·`--radius` …)을
`:root` 에서 프로젝트 `--ds-*` 토큰으로 연결한다.

- `--ds-*` 는 `.dark` 에서 **자동 반사**되므로, shadcn 이 넣던 `.dark { … }` 수동 분기는 **삭제**했다([PB-06]).
- shadcn 이 넣던 `:root/.dark` 의 oklch 하드코딩, `@theme` 의 `--radius-*` calc 재정의도 **삭제**했다
  (반경은 `tokens.css` 프로젝트 토큰이 제공).
- 값 변경은 항상 `tokens.json → yarn tokens` 로만 한다. `globals.css` 에 hex/oklch 를 직접 쓰지 않는다([PB-01/02]).

주요 매핑:

| shadcn 슬롯                              | → 프로젝트 토큰                                   |
| ---------------------------------------- | ------------------------------------------------- |
| `--background` / `--foreground`          | `--ds-background` / `--ds-bolder`                 |
| `--card` `--popover`                     | `--ds-surface`                                    |
| `--primary` / `--primary-foreground`     | `--ds-button-primary-fill` / `--raw-common-white` |
| `--secondary` / `--secondary-foreground` | `--ds-button-secondary-fill` / `--ds-secondary`   |
| `--muted` `--accent`                     | `--ds-surface-gray-subtle-1` / `-2`               |
| `--muted-foreground`                     | `--ds-subtle`                                     |
| `--destructive`                          | `--ds-error-base`                                 |
| `--border` `--input`                     | `--ds-input-border`                               |
| `--ring`                                 | `--ds-focus`                                      |
| `--radius`                               | `--ds-radius-md`                                  |

### 2) 정밀 매핑 (전용 토큰이 있는 컴포넌트)

Button·Input 처럼 프로젝트에 **전용 토큰**이 있는 컴포넌트는 브릿지에 의존하지 않고 직접 연결한다.

- **Button** (`src/components/ui/button.tsx`) — variant 를 `button-*-fill` / `-hover` / `-pressed` 토큰에 연결.
- **Input** (`src/components/ui/input.tsx`) — `input-surface` / `input-border` / `-active` / `-error` / `-disabled` 에 연결.

## `src/components/ui/**` — 컨벤션 예외 구역

shadcn 원본 컴포넌트는 유지보수(업스트림 업데이트)를 위해 원형을 크게 바꾸지 않는다.
이 디렉토리 **안에서만** 다음을 허용한다:

- `text-*` / `font-*` 유틸 사용 허용 — 즉 `typo-*` 단독 규칙([PB-07/08])의 예외.
  단 **일반 화면(페이지/도메인 컴포넌트)** 에서는 `typo-*` 를 그대로 쓴다.
- 색/반경/포커스는 예외가 아니다 — 반드시 토큰 유틸(브릿지 포함)을 쓴다([PB-01], [NA-009]).

## 접근성 ([docs/ACCESSIBILITY.md](ACCESSIBILITY.md))

- **터치 타깃 44px** ([6.1.3]) — 기본/큰 사이즈·아이콘 버튼·Input 은 `min-h-11`(+아이콘은 `min-w-11`)로 보정.
  `sm`/`xs`/`icon-sm`/`icon-xs` 는 밀도 높은 UI 용 **컴팩트 예외**(44px 미만, 인접 간격 확보 전제).
- **포커스** ([6.1.2]) — `focus-visible:ring-*`(= `--ring` = `--ds-focus`) 로 표시. `outline-none` 단독 아님.
- **아이콘 버튼** ([5.1.1]) — 사용처에서 `aria-label` + 내부 아이콘 `aria-hidden="true"`.
- **폼** ([7.4.1/7.4.2]) — `<label htmlFor>` ↔ `id` 연결, 오류는 `aria-invalid` + `aria-describedby` + `role="alert"`.

## 컴포넌트 추가법

```bash
npx shadcn@latest add <component> -y
```

추가 후 체크:

1. 색/테두리/포커스 클래스(`bg-primary`·`border-border`·`ring-ring` 등)가 브릿지로 프로젝트 토큰에 연결되는지 확인.
2. 전용 토큰이 있는 컴포넌트면 정밀 매핑으로 교체.
3. `dark:` 수동 분기가 있으면 제거(토큰 자동 반사).
4. 사이즈에 44px 터치 타깃(`min-h-11`) 반영, 아이콘 버튼 `aria-label` 확인.
5. `md:` 등 기본 브레이크포인트는 `wide:`/`pc:` 로 교체([PB-14]).

## 참고 — `shadcn` 패키지 의존성

`globals.css` 의 `@import "shadcn/tailwind.css"` 때문에 `shadcn` 패키지는 **빌드 시 필요**하다(제거 시 빌드 실패).
현재 `dependencies` 에 있으며, 이 import 를 걷어내기 전에는 제거하지 않는다.

## 검증 페이지

`/shadcn-test` — Button(variant/size/상태)·Input(기본/오류/비활성)을 라이트·다크에서 렌더 확인.
