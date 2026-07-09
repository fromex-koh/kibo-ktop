# shadcn/ui 통합 규칙

shadcn/ui(radix 기반, `radix-nova` 스타일)를 이 프로젝트의 **디자인 토큰 시스템에 녹여서** 사용한다.
핵심: shadcn 컴포넌트가 참조하는 **표준 색 슬롯(`--color-*`)을 `tokens.json` 단일 소스**에 연결하고,
컴포넌트 자체(vendored 코드)는 원형을 유지한다.

## 우선순위 (충돌 시)

1. **[docs/CODE_CONVENTION.md](CODE_CONVENTION.md)** — 프론트엔드 개발 표준. **최우선.**
2. **[docs/ACCESSIBILITY.md](ACCESSIBILITY.md)** — 웹 접근성(KWCAG 2.1). 법적 필수.
3. **[docs/PUBLISHING_CONVENTION.md](PUBLISHING_CONVENTION.md)** — 디자인 토큰/스타일.
4. **본 문서** — 위와 상충하지 않는 범위에서 shadcn 사용 규칙.

---

## 개발자 요구사항 (MUST)

프로젝트 개발자가 요구한 규칙이다. 아래 `SC-*` 는 병합 전 반드시 통과해야 한다.

- **[SC-01] 기본값은 토큰/기존 유틸리티, arbitrary value 최소화 (MUST)**
  색·간격·라운드·타이포·크기 등은 **생성된 토큰 유틸/기존 유틸**을 쓴다. Tailwind arbitrary value(`w-[13px]`·
  `bg-[#fff]`·`z-[60]`·`text-[10px]` 등 `[...]` 값)는 **원칙적으로 쓰지 않는다.** 불가피한 경우(예: CSS 변수를
  받는 `w-(--sidebar-width)`)만 **최소한**으로, 주석과 함께 남긴다. (연계: [PB-01]·[PB-13]·[NA-009]·[ST-004]·[CD-002])

- **[SC-02] primitive(vendored) shadcn 컴포넌트 수정 금지 (MUST)**
  `src/components/ui/**` 의 shadcn 원본 컴포넌트는 **기능·스타일을 목적으로 내부를 고치지 않는다.**
  확장은 **`className`·`props`·`variant`·래퍼 컴포넌트**로만 한다. (연계: [NA-007])
  → 게이트 통과를 위한 **설치 시 최소 이식**만 예외 (아래 [vendored 예외](#vendored-컴포넌트-예외) 참조).

- **[SC-03] 화면 작업 시 기본 컴포넌트는 shadcn 컴포넌트를 쓴다 (RECOMMENDED)**
  버튼·인풋·체크박스·셀렉트·다이얼로그·드롭다운·툴팁·사이드바 등 **기본 UI 요소는 손수 만들지 말고
  shadcn 컴포넌트를 사용**한다. 없으면 [CLI 로 추가](#컴포넌트-추가법). 도메인/화면 고유 조합만 직접 만든다.

---

## 테마 모델 — "슬롯은 계약, 값만 커스텀" (shadcn 공식 권고)

shadcn 의 [theming](https://ui.shadcn.com/docs/theming) 모델을 그대로 따른다.

- shadcn 컴포넌트는 마크업에 **표준 색 슬롯 유틸(`bg-primary`·`text-muted-foreground`·`border-input`·
  `ring-ring` …)을 하드코딩**한다. 이 유틸은 `@theme inline` 에 등록된 **`--color-<slot>` 슬롯**이 있어야 생성된다.
- **슬롯 이름은 컴포넌트↔테마의 계약**이다 → **이름을 바꾸거나 지우지 않는다.** 색은 **값만** 바꾼다([SC-01]).
- **역할(role) 기반**: `primary`·`secondary`·`muted`·`accent`·`destructive` 는 "무슨 색"이 아니라 "무슨 용도"다.
  버튼·체크박스·스위치 등이 같은 역할 슬롯을 재사용해 시각적 일관성이 자동 유지된다. **컴포넌트별 슬롯은 없다**
  (예외: `sidebar-*`·`chart-*` — 독립 색 맥락이 필요한 것만 자체 슬롯).

### 파이프라인 (값 변경은 여기로만)

```
tokens.json  semantic(=shadcn 표준 슬롯명)   →  yarn tokens  →  src/app/tokens.css
   ├ 색 원시값: --raw-*  (Primitive)                              @theme inline {
   └ 역할값:    --ds-<slot>  (Semantic, --raw 참조)                 --color-<slot>: var(--ds-<slot>)
                                                                  }  → bg-<slot>/text-<slot>/… 유틸
```

- shadcn 슬롯 색을 바꾸려면 **`tokens.json` 의 `semantic.<slot>` 값만** 고치고 `yarn tokens`. 생성물
  `tokens.css`·`globals.css` 에 hex/oklch 를 직접 쓰지 않는다([PB-01/02]).
- 다크는 `--ds-*` 가 `.dark` 에서 **자동 반사**된다 → shadcn 이 넣는 `.dark { … }` 수동 분기·`dark:` 유틸은
  **쓰지 않는다**([PB-06]).
- **색 포맷**: 이 프로젝트는 Figma 원본대로 **hex** 를 쓴다. shadcn 기본/권고는 `oklch` 지만, 슬롯 계약이
  핵심이고 값 포맷은 무관하므로 hex 를 유지한다(단일 소스 = Figma).

### 현재 정의된 슬롯 (tokens.json `semantic`)

- **shadcn 표준(34)**: `background`·`foreground` · `card(+ -foreground)` · `popover(+…)` · `primary(+…)` ·
  `secondary(+…)` · `muted(+…)` · `accent(+…)` · `destructive(+…)` · `border` · `input` · `ring` ·
  `chart-1~5` · `sidebar` (+`-foreground`/`-primary`/`-primary-foreground`/`-accent`/`-accent-foreground`/
  `-border`/`-ring`)
- **프로젝트 확장(비-shadcn 표면)**: `scroll-thumb`/`scroll-track`(스크롤바 가상요소 — 유틸 없이 `var()` 직접),
  `overlay`(오버레이/스크림 — `bg-overlay-*` 전용 유틸). shadcn 이 안 다루는 표면이라 직접 정의.
- 상태색(`success`/`warning`/`info`) 등 shadcn 에 없는 역할이 필요하면 **표준 슬롯을 지우지 말고 새 슬롯을
  추가**한다(tokens.json semantic 에 키 추가).

---

## vendored 컴포넌트 (`src/components/ui/**`) 예외

[SC-02] 대로 **기능/스타일 목적의 수정은 금지**하되, 아래 둘만 허용한다.

### 1) 타이포 유틸 예외

- `ui/**` **안에서만** `text-*`/`font-*` 유틸 허용 — `typo-*` 단독 규칙([PB-07/08])의 예외(shadcn 원형 유지).
- **일반 화면(페이지/도메인 컴포넌트)** 에서는 `typo-*` 를 쓴다.

### 2) 설치 시 "최소 이식" 예외

이 프로젝트 게이트/토큰 시스템이 vanilla shadcn 코드와 충돌하는 지점만, **설치 시 1회·최소·주석과 함께** 고친다.
이는 "기능 변경"이 아니라 **프로젝트 규칙 준수를 위한 이식**이다.

| 충돌                               | 원인                                         | 이식                                   |
| ---------------------------------- | -------------------------------------------- | -------------------------------------- |
| `x as React.CSSProperties`         | [ST-002] `as` 금지                           | 타입 헬퍼(`cssVars`)로 감싸기          |
| `sm:`/`md:` 등 기본 브레이크포인트 | [PB-14] 기본 프리픽스 제거(`wide:`/`pc:` 만) | `md:`→`wide:`(둘 다 768px) 등으로 치환 |
| `bg-black/…`·기본 팔레트           | 생성기가 `--color-*: initial` 로 제거        | 토큰(`bg-overlay-*` 등)으로 대체       |
| `w-[2px]` 등 고정 px               | [ST-004]/[SC-01] arbitrary 금지              | 스케일 유틸(`w-0.5`=2px) 로            |
| 2-space 포맷                       | Prettier(4-space)                            | `yarn format`                          |

> 이식 후에는 반드시 `yarn verify` 통과를 확인한다. 이식이 크게 필요하면 그 컴포넌트를 쓰는 게 맞는지 재검토한다.

---

## 컴포넌트 추가법

```bash
npx shadcn@latest add <component>
```

체크리스트:

1. **커스터마이즈한 기존 파일(`button.tsx`·`input.tsx`)은 덮어쓰지 않는다** — 덮어쓰기 프롬프트에 `N`.
2. 색/테두리/포커스 유틸(`bg-primary`·`border-input`·`ring-ring` …)이 표준 슬롯이라 자동으로 프로젝트 토큰에 연결됨을 확인.
3. 위 [설치 시 최소 이식](#2-설치-시-최소-이식-예외) 적용(`as`·브레이크포인트·팔레트·포맷).
4. 사이즈에 44px 터치 타깃(`min-h-11`, 아이콘은 `min-w-11`) 반영, 아이콘 버튼 `aria-label` 확인([6.1.3]).
5. `dark:` 수동 분기 있으면 제거(토큰 자동 반사, [PB-06]).
6. `yarn verify` 통과.

---

## 접근성 ([docs/ACCESSIBILITY.md](ACCESSIBILITY.md))

- **터치 타깃 44px** ([6.1.3]) — 기본/큰 사이즈·아이콘 버튼·Input 은 `min-h-11`(+아이콘 `min-w-11`).
  `sm`/`xs`/`icon-sm`/`icon-xs` 는 밀도 높은 UI 용 **컴팩트 예외**(44px 미만, 인접 간격 확보 전제).
- **포커스** ([6.1.2]) — `focus-visible:ring-ring`(= `--color-ring`) 로 표시. `outline-none` 단독 금지.
- **아이콘 버튼** ([5.1.1]) — 사용처에서 `aria-label` + 내부 아이콘 `aria-hidden="true"`.
- **폼** ([7.4.1/7.4.2]) — `<label htmlFor>` ↔ `id`, 오류는 `aria-invalid` + `aria-describedby` + `role="alert"`.
- **모달/드로어**(Dialog·Sheet 등) — Radix 가 **포커스 트랩·Esc·포커스 복귀·배경 스크롤 잠금**을 제공하므로
  이를 신뢰하고 손수 구현하지 않는다([8.2.1]).

---

## 참고

- **`shadcn` 패키지 의존성**: `globals.css` 의 `@import "shadcn/tailwind.css"`(Radix 상태 변형·유틸 제공) 때문에
  `shadcn` 패키지는 **빌드 시 필요**하다. 이 import 를 걷어내기 전에는 `dependencies` 에서 제거하지 않는다.
- **검증 페이지**: `/shadcn-test` — Button(variant/size/상태)·Input 을 라이트·다크에서 렌더 확인.
- **PR 체크리스트**: [SC-01] arbitrary value 없음 / [SC-02] `ui/**` 원형 유지(외부 확장) / [SC-03] 기본 UI 는 shadcn.
