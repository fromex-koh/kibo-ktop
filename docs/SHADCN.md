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
  확장은 **래퍼 컴포넌트**로만 한다. (연계: [NA-007])
  → 게이트 통과를 위한 **설치 시 최소 이식**만 예외 (아래 [vendored 예외](#vendored-컴포넌트-예외) 참조).

- **[SC-04] 스타일은 "복사본(styled copy)"에서만 바꾼다 — 원본은 바닐라 그대로 (MUST)**
  이 프로젝트는 shadcn 컴포넌트를 **두 벌**로 운영한다. 자세한 그림은 아래
  [styled copy 패턴](#styled-copy-패턴--원본-보존--스타일-복사본) 참조.
    - **원본(`src/components/ui/<name>.tsx`)** — `npx shadcn add` **갓 다운로드 상태 그대로**. 동작·접근성·
      라이브러리 업데이트를 책임진다. **절대 손대지 않는다**(언제든 재다운로드 가능).
    - **복사본(`src/components/<name>.tsx`)** — 원본을 **그대로 복사**하되 **`buttonVariants` 등 스타일 정의(cva)만**
      프로젝트 Figma 값으로 바꾼다. 함수 셸(컴포넌트 본문·`asChild`·`data-slot`·props·export)은 원본과 **동일**.
      화면·도메인 코드는 **이 복사본만** import 한다(`@/components/button`, `@/components/ui/button` 아님).

    즉 **스타일 책임은 복사본, 그 외 모든 책임은 원본**이다. 라이브러리가 업데이트되면 원본을 다시 받고, 원본의
    **셸 변경분만** 복사본에 옮기면 된다 — 스타일(cva)은 그 diff에 없으므로 그대로 유지된다.

    단, `ui/**` **내부**에서 다른 프리미티브를 합성하는 것(예: `ui/dialog.tsx` 의 닫기 버튼이 `ui/button.tsx`
    의 ghost/icon-sm 을 쓰는 것)은 **원본끼리의 정상적인 합성**이므로 그대로 `ui/**` 경로를 쓴다 — 복사본으로
    바꾸지 않는다(내부 usage 는 Figma type 이 아니라 outline/ghost/icon-* 만 쓰므로 원형 프리미티브로 충분).

- **[SC-03] 화면 작업 시 기본 컴포넌트는 shadcn 컴포넌트를 쓴다 (RECOMMENDED)**
  버튼·인풋·체크박스·셀렉트·다이얼로그·드롭다운·툴팁·사이드바 등 **기본 UI 요소는 손수 만들지 말고
  shadcn 컴포넌트를 사용**한다. 없으면 [CLI 로 추가](#컴포넌트-추가법). 도메인/화면 고유 조합만 직접 만든다.

---

## styled copy 패턴 — "원본 보존 + 스타일 복사본"

이 프로젝트가 shadcn 컴포넌트를 커스텀하는 **핵심 방식**이다([SC-04]). 한 컴포넌트를 **두 파일**로 나눈다.

```
 src/components/ui/button.tsx        ← ① 원본 (바닐라, 손대지 않음)
   · npx shadcn add 갓 다운로드 그대로
   · 동작 · 접근성 · 라이브러리 업데이트 담당
   · ui/** 내부 컴포넌트(dialog·pagination…)가 이 원본을 사용
          │  (그대로 복사, cva 만 교체)
          ▼
 src/components/button.tsx           ← ② 복사본 (styled copy, 실제 사용)
   · 원본과 유일한 차이 = buttonVariants(스타일 cva) 뿐
   · 함수 셸(본문·asChild·data-slot·props·export)은 원본과 동일
   · 화면 · 도메인 코드는 항상 이 복사본을 import
```

**책임 분리 (한 줄):** _스타일은 복사본, 그 외 전부(동작·접근성·업데이트)는 원본._

### 왜 이렇게 하나

- **업데이트가 안전하다.** 라이브러리가 바뀌면 원본만 `npx shadcn add` 로 다시 받고, 원본의 **셸 변경분만**
  복사본에 옮긴다. 스타일(cva)은 그 diff에 없으니 **그대로 유지**된다. 원본을 직접 고쳤다면 매 업데이트가
  머지 충돌이 되지만, 이 방식은 충돌 지점이 "셸"로 한정된다.
- **왜 감싸지(compose) 않고 복사하나.** 얇게 감싸 `cn` 으로 덮어쓰는 방법도 있지만, 이 프로젝트 `cn` 은 순정
  `twMerge`(확장 없음)라 커스텀 색 유틸(`bg-button-primary-fill`)이 원본의 표준 슬롯(`bg-primary`)과
  **중복제거되지 않아** 두 색이 함께 남는다. 색·사이즈를 **전면 재스킨**하는 이 프로젝트에선, 살짝 덧칠하는
  compose 대신 **"복사 후 cva 만 교체"** 가 충돌 없는 방식이다(업계에서 heavy customization 시 쓰는 방식).

### 새 컴포넌트에 적용하는 법

1. `npx shadcn add <name>` 로 원본을 `src/components/ui/<name>.tsx` 에 받는다(그대로 둔다).
2. 그 파일을 `src/components/<name>.tsx` 로 **복사**한다.
3. 복사본에서 **스타일 정의(cva)만** 프로젝트 값으로 바꾼다 — 나머지 셸은 손대지 않는다.
4. 화면·도메인 코드는 `@/components/<name>` 을 import 한다.

> **스타일이 원본과 거의 같아 덧칠로 충분한 컴포넌트**(색·사이즈를 그대로 쓰고 여백만 조금 다른 정도)는
> 복사본 없이 사용처에서 `className` 으로 조정해도 된다. **복사본은 버튼처럼 전면 재스킨이 필요한 경우**에 만든다.
> 판단이 서지 않으면 복사본을 만든다(업데이트 안전이 우선).

### 근거 (이 패턴이 표준인 출처)

임의 규칙이 아니라 업계 정착 패턴이다 — "원본 보존 + 커스텀 분리"에 "**대규모 수정은 소스 복사(fork)**"를 결합.

- [GOV.UK Design System — Extending and modifying components](https://design-system.service.gov.uk/get-started/extending-and-modifying-components/):
  _"If you need to make a large modification to a component you should fork it entirely by copying and pasting the source code to create a new component."_ (영국 정부 공식 디자인 시스템)
- [shadcn/ui — Best practices for customizing (Discussion #9754)](https://github.com/shadcn-ui/ui/discussions/9754) — base `ui/` 는 원형 유지(레지스트리에서 언제든 재다운로드), 커스텀은 wrapper/복사본에.
- [shadcn/ui — 대규모 프로덕션 구조 (Discussion #9756)](https://github.com/shadcn-ui/ui/discussions/9756) · [Vercel Academy — Extending shadcn/ui](https://vercel.com/academy/shadcn-ui/extending-shadcn-ui-with-custom-components) — 원형 레이어와 커스텀 레이어 분리.
- 링크·요약 전체는 [README.md](../README.md) 의 "컴포넌트(shadcn/ui) › 이 패턴이 근거 있는 방식인 이유" 참고.

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

- **shadcn 표준(32)**: `background`·`foreground` · `card(+ -foreground)` · `popover(+…)` · `primary(+…)` ·
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

- `ui/**` 원본 **및 그 styled copy(`src/components/<name>.tsx`)** 안에서만 `text-*`/`font-*` 유틸 허용 —
  `typo-*` 단독 규칙([PB-07/08])의 예외(shadcn 원형·복사본 셸 유지). 복사본은 원본과 같은 컴포넌트라 같은 예외를 받는다.
- **일반 화면(페이지/도메인 컴포넌트)** 에서는 `typo-*` 를 쓴다.

### 2) 설치 시 "최소 이식" 예외

이 프로젝트 게이트/토큰 시스템이 vanilla shadcn 코드와 충돌하는 지점만, **설치 시 1회·최소·주석과 함께** 고친다.
이는 "기능 변경"이 아니라 **프로젝트 규칙 준수를 위한 이식**이다.

| 충돌                                   | 원인                                                | 이식                                                 |
| -------------------------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| `x as React.CSSProperties`             | [ST-002] `as` 금지                                  | 타입 헬퍼(`cssVars`)로 감싸기                        |
| ~~`sm:`/`md:` 등 기본 브레이크포인트~~ | (더 이상 이식 불필요 — 기본 프리픽스가 그대로 동작) | 그대로 둔다. 프로젝트 주 티어는 `md:`/`xl:`([PB-14]) |
| `bg-black/…`·기본 팔레트               | 생성기가 `--color-*: initial` 로 제거               | 토큰(`bg-overlay-*` 등)으로 대체                     |
| `w-[2px]` 등 고정 px                   | [ST-004]/[SC-01] arbitrary 금지                     | 스케일 유틸(`w-0.5`=2px) 로                          |
| 2-space 포맷                           | Prettier(4-space)                                   | `yarn format`                                        |

> 이식 후에는 반드시 `yarn verify` 통과를 확인한다. 이식이 크게 필요하면 그 컴포넌트를 쓰는 게 맞는지 재검토한다.

---

## 컴포넌트 추가법

```bash
npx shadcn@latest add <component>
```

체크리스트:

1. **원본은 `src/components/ui/<name>.tsx` 에 바닐라 그대로 둔다** — 기존 커스텀 파일이 있으면 덮어쓰기 프롬프트에 `N`.
   원본에는 파일이 **컴파일·게이트를 통과할 최소 이식**(아래 [설치 시 최소 이식](#2-설치-시-최소-이식-예외):
   import alias·`as`·포맷 등)만 적용하고, **디자인은 손대지 않는다**.
2. 색/테두리/포커스 유틸(`bg-primary`·`border-input`·`ring-ring` …)이 표준 슬롯이라 자동으로 프로젝트 토큰에 연결됨을 확인.
3. **프로젝트 고유 디자인이 필요하면 styled copy 를 만든다**([SC-04], [styled copy 패턴](#styled-copy-패턴--원본-보존--스타일-복사본)):
   원본을 `src/components/<name>.tsx` 로 복사하고 **cva(스타일)만** 프로젝트 값으로 바꾼다. 화면 코드는 이 복사본을 import.
   덧칠로 충분한 컴포넌트는 복사 없이 사용처 `className` 으로 조정해도 된다.
4. 사이즈에 44px 터치 타깃(`min-h-11`, 아이콘은 `min-w-11`) 반영, 아이콘 버튼 `aria-label` 확인([6.1.3]).
5. 복사본 cva 에서 `dark:` 수동 분기는 쓰지 않는다(토큰 자동 반사, [PB-06]).
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
- **PR 체크리스트**: [SC-01] arbitrary value 없음 / [SC-02] `ui/**` 원본 바닐라 유지 / [SC-03] 기본 UI 는 shadcn /
  [SC-04] 스타일은 styled copy 의 cva 에서만, 화면·도메인 코드는 `ui/**` 대신 복사본(`@/components/<name>`)을 import.
