# shadcn/ui 통합 규칙

shadcn/ui(radix 기반, `radix-nova` 스타일)를 이 프로젝트의 **디자인 토큰 시스템에 녹여서** 사용한다.
핵심: shadcn 컴포넌트가 참조하는 **표준 색 슬롯(`--color-*`)을 `tokens.json` 단일 소스**에 연결하고,
컴포넌트 **셸(구조·동작·접근성)은 업스트림 원형을 유지**하며, **스타일(cva)만 `theme/` 레이어**에서 관리한다.

## 우선순위 (충돌 시)

1. **[docs/CODE_CONVENTION.md](CODE_CONVENTION.md)** — 개발 표준. **최우선.**
2. **[docs/ACCESSIBILITY.md](ACCESSIBILITY.md)** — 웹 접근성(KWCAG 2.1). 법적 필수.
3. **[docs/PUBLISHING_CONVENTION.md](PUBLISHING_CONVENTION.md)** — 디자인 토큰/스타일.
4. **본 문서** — 위와 상충하지 않는 범위에서 shadcn 사용 규칙.

---

## 개발자 요구사항 (MUST)

프로젝트 개발자가 요구한 규칙이다. 아래 `SC-*` 는 병합 전 반드시 통과해야 한다.

- **[SC-01] 기본값은 토큰/기존 유틸리티, arbitrary value 최소화 (MUST)**
  색·간격·라운드·타이포·크기 등은 **생성된 토큰 유틸/기존 유틸**을 쓴다. Tailwind arbitrary value(`w-[13px]`·
  `bg-[#fff]`·`z-[60]`·`text-[10px]` 등 `[...]` 값)는 **원칙적으로 쓰지 않는다.** CSS 변수·외부 라이브러리 연동·
  구조적 grid template 등 **토큰이나 기존 유틸로 정확히 표현할 수 없는 기술적 사유**가 있을 때만 최소한으로 쓴다.
  `calc()`·`min()`·`max()`·`clamp()`라는 문법 자체는 허용 사유가 아니며, 아래
  [arbitrary value 예외 정책](#arbitrary-value-예외-정책)을 함께 적용한다.
  (연계: [PB-01]·[PB-13]·[NA-009]·[ST-004]·[CD-002])

- **[SC-02] shadcn 셸(ui/)의 구조·동작·접근성 수정 금지 — 허용된 수정은 "cva 추출" 하나뿐 (MUST)**
  `src/components/ui/<name>.tsx` 는 `npx shadcn add` 로 받은 **업스트림 셸**이다. DOM 구조·props·상호작용·
  `aria-*`·포커스 관리 등은 **어떤 이유로도 수정하지 않는다**([NA-007]). 유일하게 허용되는 수정은 **재스킨을
  위해 셸 안의 cva 정의를 `theme/<name>.variants.ts` import 로 바꾸는 것**이며, 이때 밀려난 바닐라 cva 는
  `vendor/shadcn-baseline/` 에 보관한다(아래 [셸·스타일 분리 패턴](#셸스타일-분리-패턴--ui-셸--theme-스타일) 참조).
  cva 를 추출하지 않은 셸은 다운로드 순정 그대로 둔다.

- **[SC-04] 스타일 수정은 `theme/*.variants.ts` 에서만 — 셸·화면에서 재스킨하지 않는다 (MUST)**
  화면·도메인 코드는 `@/components/ui/<name>` 을 **직접 import** 한다(별도 창구 레이어 없음). 컴포넌트의
  색·크기·라운드 등 프로젝트 스타일을 바꿀 일이 있으면 **`src/components/theme/<name>.variants.ts` 의 cva 만**
  고친다 — 셸(ui)이나 사용처(className 덧씌우기 남발)에서 재스킨하지 않는다. 일회성 조정은 사용처 `className`
  으로 가능하지만, 반복되면 variant 로 승격한다.

- **[SC-03] 화면 작업 시 기본 컴포넌트는 shadcn 컴포넌트를 쓴다 (RECOMMENDED)**
  버튼·인풋·체크박스·셀렉트·다이얼로그·드롭다운·툴팁·사이드바 등 **기본 UI 요소는 손수 만들지 말고
  shadcn 컴포넌트를 사용**한다. 없으면 [CLI 로 추가](#컴포넌트-추가법). 도메인/화면 고유 조합만 직접 만든다.

---

## arbitrary value 예외 정책

`[...]`가 보인다는 이유만으로 모두 같은 위반은 아니다. `data-[state=open]`·`aria-[invalid=true]`·`[&_svg]`는
**상태/선택자를 표현하는 arbitrary variant**이고, `w-[13px]`처럼 값을 직접 넣는 **arbitrary value**와 구분한다.
이 절의 제한 대상은 arbitrary value 다.

### 판단 순서 (MUST)

arbitrary value 를 쓰기 전에 아래 순서대로 대체 가능성을 확인한다. 앞 단계로 표현할 수 있으면 다음 단계로 넘어가지 않는다.

1. **기존 프로젝트 토큰 유틸** — `h-control-h-lg`·`rounded-sm`·`bg-primary` 등.
2. **Tailwind 기존 유틸** — `p-4`·`bottom-1`·`ring-3`·`h-full` 등.
3. **컴포넌트 variant 또는 공통 조합** — 반복되는 상태/크기는 cva variant 나 공통 컴포넌트로 표현.
4. **새 토큰/공통 유틸 승격** — 디자인 시스템 값이 누락됐거나 여러 사용처가 공유할 값이면 `tokens.json` 에 등록.
5. **arbitrary value 예외** — 위 방식으로 정확히 표현할 수 없고 아래 허용 사유가 명확할 때만 사용.

`p-[16px]`처럼 기존 `p-4`와 같은 값, `bottom-[-4px]`처럼 `-bottom-1`로 표현 가능한 값, Figma 수치를 그대로
옮긴 `w-[257px]`는 5단계 예외가 아니다.

### 유형별 허용 기준

| 유형                               | 정책                                                                           | 예시                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| 색상·그림자·z-index                | **금지.** semantic/design token 또는 정의된 계층을 사용                        | `bg-[#356df3]`·`shadow-[...]`·`z-[9999]` 금지                           |
| 간격·위치·크기·라운드·타이포       | **원칙적 금지.** 기존 scale 우선, 공통 디자인 값이면 토큰으로 승격             | `p-[3px]`·`h-[52px]`·`rounded-[10px]` 금지                              |
| CSS 변수·Radix 측정값              | 해당 값이 런타임/외부 컴포넌트에서 주입되어 정적 토큰으로 바꿀 수 없을 때 허용 | `w-(--sidebar-width)`·`max-h-(--radix-select-content-available-height)` |
| `calc()`·`min()`·`max()`·`clamp()` | 계산이 실제로 필요하고 기존 레이아웃/토큰 조합으로 표현할 수 없을 때만 허용    | 고정 숫자를 감싼 계산식은 허용하지 않음                                 |
| grid/template·구조적 레이아웃      | 열의 의미나 비대칭 구조를 Tailwind 기본 유틸로 표현할 수 없을 때 허용          | `grid-cols-[1fr_auto_1fr]`                                              |
| 외부 라이브러리·브라우저 우회      | 외부 계약 또는 재현 가능한 브라우저 문제에 맞춰야 할 때 허용                   | 관련 라이브러리/이슈와 제거 조건 기록                                   |
| aspect ratio                       | 기본 `aspect-*`에 없는 실제 콘텐츠 비율일 때 화면/가이드에서 제한적으로 허용   | `aspect-[16/10]`                                                        |

CSS 변수나 함수 문법이라고 **자동 허용되는 것은 아니다.** 예를 들어 `rounded-[min(var(--radius-md),10px)]`가 여러
공통 컴포넌트에서 필요하다면 예외를 복제하지 말고 radius token 또는 공통 variant 로 승격한다.

### 레이어별 강도

- **`ui/**` 순정 셸** — 업스트림 코드를 수정하지 않는다. 원본에 이미 포함된 arbitrary value 는 vendored 코드로
  인정하지만 프로젝트가 새로 추가하거나 정리하지 않는다([SC-02]).
- **`theme/**`** — 가장 엄격하게 적용한다. 디자인 값은 토큰/variant 로 관리하고, Radix 런타임 CSS 변수처럼 primitive
  계약상 필요한 값이나 대체 불가능한 구조 표현만 허용한다.
- **`composite/**`·`custom/**`** — ui/theme 조합으로 해결한 뒤, 화면 구조상 필요한 grid/template·CSS 변수만 제한적으로 허용한다.
- **`app/**`·`guide/**`** — 화면 고유 구조·실제 미디어 비율은 제한적으로 허용하되, 다른 화면에서도 재사용되면 즉시
  composite·공통 유틸·토큰으로 승격한다.

### 반복·기록·리뷰 기준

- **1회** — 허용 사유와 대체 불가능성을 PR에서 확인한다. 코드만 보고 의도가 드러나지 않으면 바로 위 주석에
  외부 계약·브라우저 이슈·제거 조건을 적는다.
- **2회** — 같은 값/구조를 재사용할 가능성과 공통 variant 승격을 검토한다.
- **3회 이상 또는 여러 컴포넌트에서 사용** — 일회성 예외로 보지 않는다. 토큰·공통 유틸·variant·composite 중
  적절한 형태로 승격하는 것이 원칙이다.
- 임시 우회는 관련 이슈 또는 제거 조건을 반드시 기록한다. 이유 없는 `TODO`만 남기지 않는다.

`scripts/check-conventions.mjs`는 색상·고정 px·간격·위치·크기처럼 기계적으로 판별 가능한 위반을 차단한다. 다만
구조적 필요성, 반복 횟수, 주석의 타당성까지 판단하지는 못하므로 자동 검사 통과가 예외 승인과 같지는 않다.

### PR 체크리스트

- [ ] 토큰이나 기존 Tailwind 유틸로 같은 값을 표현할 수 없는가?
- [ ] 컴포넌트 variant 또는 기존 composite 로 해결할 수 없는가?
- [ ] 색상·간격·크기·라운드 등 토큰으로 관리해야 할 디자인 값을 직접 입력하지 않았는가?
- [ ] 같은 arbitrary value 가 반복되거나 다른 컴포넌트에도 존재하지 않는가?
- [ ] 예외라면 기술적 사유와 제거 조건이 코드/PR에서 확인되는가?
- [ ] `ui/**` 셸에 프로젝트 임의 값을 추가하지 않았는가?

---

## 셸·스타일 분리 패턴 — "ui 셸 + theme 스타일"

이 프로젝트가 shadcn 컴포넌트를 커스텀하는 **핵심 방식**이다([SC-02]/[SC-04]). 책임을 파일로 나눈다.

```
 src/components/ui/<name>.tsx              ← 셸 (업스트림 원형 — 구조·동작·접근성·업데이트 담당)
   · 기본: npx shadcn add 갓 다운로드 순정 그대로
   · 재스킨한 컴포넌트만: cva 정의 → theme import 한 줄로 교체 ("수정 셸")
   · 화면·도메인 코드가 직접 import 하는 앱-대면 레이어
          │ import {xxxVariants} from '@/components/theme/<name>.variants'
          ▼
 src/components/theme/<name>.variants.ts   ← 프로젝트 스타일 (cva — 색·크기·라운드·타이포)
   · 재스킨의 유일한 작업 장소. 게이트(ESLint·Prettier·conventions) 전체 적용
          │ (추출 시 밀려난 바닐라 cva 는)
          ▼
 vendor/shadcn-baseline/<name>.variants.ts ← 바닐라 cva 보관소 (업데이트 diff 기준선)
   · 앱 코드에서 import 금지 · src/ 밖이라 빌드/게이트/IDE 자동완성에 안 잡힘
```

**책임 분리 (한 줄):** _스타일은 theme, 그 외 전부(구조·동작·접근성·업데이트)는 ui 셸 = 업스트림._
**import 규칙:** 화면·도메인·composite 코드는 `@/components/ui/*` 를 직접 import. 스타일 수정은 `theme/` 에서만.

> ### ⚠️ theme 은 오직 스타일만 책임진다 (MUST)
>
> `theme/*.variants.ts` 의 책임은 **스타일(cva·className)에만** 있다. **내장 기능·DOM 구조·상호작용 동작·
> 웹접근성**(포커스 트랩·Esc·바깥 클릭 닫기·`aria-*`·`role`·스크롤 잠금 등)은 **어떤 이유로도 셸에서
> 수정하거나 재구현하지 않는다** — 그건 전부 **업스트림 셸(바닐라 radix)의 책임**이다. (웹접근성 중 순수
> _스타일_ 에 해당하는 것 — 예: `focus-visible` 링 색·대비 — 만 theme 소관이다.)
>
> **왜** — 라이브러리가 업데이트되면 셸을 다시 받아 **그대로 반영**해야 한다. 셸의 구조·동작·a11y 를 건드리면
> 그 diff 가 업스트림 변경분에 섞여, "업데이트를 그대로 받는" 게 불가능해진다(머지 충돌·기능 유실 위험).
>
> **기능이 필요하면** 셸을 바꾸지 말고 **① 사용처(usage)에서 조합**하거나 **② `composite/` 레이어**로 분리한다.
>
> **위반 예시(하지 말 것):** 다이얼로그를 "모달 전체 스크롤(Apple 식)"로 만들려고 셸의 DOM 을 재구성
> (전체화면 스크롤 컨테이너)하고, 배경 Close 로 radix 의 바깥클릭 닫기를 **수동 재구현**한 것 → 동작·구조를
> 건드린 [SC-02] 위반. 올바른 처리: 긴 내용은 **사용처에서 `max-h-* + overflow-y-auto` 내부 스크롤 박스**로
> 감싼다(Content 내부라 radix 스크롤 잠금이 허용하는 영역).

### 왜 이렇게 하나

- **업데이트가 안전하다.** 셸은 95% 이상 업스트림 코드 그대로라(차이는 theme import 한 줄), 새 버전을 받아
  `git diff` 하면 업스트림 변경분이 그대로 보인다. 스타일은 theme 에 격리돼 있어 그 diff 에 섞이지 않는다.
- **표준 슬롯을 최대한 공유한다.** theme cva 라도 `bg-primary`·`text-primary-foreground`·`border-input`·
  `ring-ring` 처럼 shadcn 이 이미 가진 슬롯으로 표현 가능한 값은 그대로 쓴다. 컴포넌트별 전용 토큰은 표준 슬롯으로
  흡수할 수 없을 때만 남긴다.
- **왜 감싸지(compose) 않고 교체하나.** 셸 밖에서 `cn` 으로 덮어쓰는 wrapper 방식은 원본의 상태 유틸과 프로젝트
  상태 유틸(예: `hover:bg-primary/80` vs `hover:bg-primary-hover`)이 twMerge 에서 안정적으로 중복제거된다고
  보장하기 어렵다. 색·사이즈를 전면 재스킨하는 이 프로젝트에선 **cva 자체를 프로젝트 정의로 교체**하는 것이
  충돌 없는 방식이다(업계에서 heavy customization 시 쓰는 소스 fork 방식의 변형).

### `PROJECT-STYLE` 주석 포맷

theme cva 에서 shadcn 바닐라와 다른 스타일을 남겨야 할 때는 코드 근처에 `PROJECT-STYLE:` 주석을 붙인다.
개발자가 diff 를 보자마자 "실수로 달라진 게 아니라 프로젝트/Figma 사양 때문에 남긴 차이"임을 알 수 있게 하기 위한
표식이다.

형식:

```ts
// PROJECT-STYLE: <shadcn 원본 방식>이지만,
// <프로젝트/Figma 사양>이므로
// <유지하는 프로젝트 토큰/유틸>을 사용한다.
```

예:

```ts
// PROJECT-STYLE: shadcn 원본은 hover:bg-primary/80 이지만,
// Figma hover/pressed는 solid brand token(blue.600/blue.700)이므로
// bg-primary-hover/bg-primary-pressed를 유지한다.
```

원칙:

- 표준 슬롯(`bg-primary`, `text-primary-foreground`, `border-input`, `ring-ring` 등)으로 표현 가능하면 주석 없이 표준 슬롯을 쓴다.
- shadcn 원본의 opacity 유틸(`bg-primary/80` 등)과 Figma 의 solid token 이 실제로 다르면, 값을 억지로 맞추지 않고 프로젝트 상태 슬롯(`bg-primary-hover` 등)을 둔다.
- `PROJECT-STYLE` 은 원본과 다르게 남기는 이유가 있을 때만 쓴다.
- 주석은 긴 배경 설명이 아니라 **원본 방식 → 프로젝트 사유 → 유지 토큰**만 적는다.
- 전체 예외 목록은 `rg "PROJECT-STYLE:" src/components` 로 확인한다.

### 근거 (이 패턴이 표준인 출처)

임의 규칙이 아니라 업계 정착 패턴이다 — "원본 보존 + 커스텀 분리"에 "**대규모 수정은 소스 fork**"를 결합한
것이며, shadcn 의 "you own the code" 모델(코드를 소유하고 직접 유지보수)의 정석적 적용이다.

- [GOV.UK Design System — Extending and modifying components](https://design-system.service.gov.uk/get-started/extending-and-modifying-components/):
  _"If you need to make a large modification to a component you should fork it entirely by copying and pasting the source code to create a new component."_ (영국 정부 공식 디자인 시스템)
- [shadcn/ui — Best practices for customizing (Discussion #9754)](https://github.com/shadcn-ui/ui/discussions/9754) — base 셸은 원형 유지(레지스트리에서 언제든 재다운로드), 커스텀은 분리된 레이어에.
- [shadcn/ui — 대규모 프로덕션 구조 (Discussion #9756)](https://github.com/shadcn-ui/ui/discussions/9756) · [Vercel Academy — Extending shadcn/ui](https://vercel.com/academy/shadcn-ui/extending-shadcn-ui-with-custom-components) — 원형 레이어와 커스텀 레이어 분리.
- 링크·요약 전체는 [README.md](../README.md) 의 "컴포넌트(shadcn/ui)" 절 참고.

---

## 컴포넌트 레이어링 — `ui/`(+`theme/`) → `composite/`

위 셸·스타일 분리가 primitive 를 다루는 층이라면, **그 primitive 들을 조합해 우리 컴포넌트를 만드는 층**이
`composite/` 다.

```
 src/components/ui/<name>.tsx          (L0) shadcn 셸 — 순정 또는 수정 셸(theme import)
   +  src/components/theme/<name>.variants.ts   프로젝트 스타일(cva)
        │
        ▼
 src/components/composite/<name>.tsx   (L1) ui(+theme) 를 조합한 도메인 컴포넌트 ← 우리가 만드는 합성 컴포넌트
```

- **`composite/` 에 두는 것** — ui primitive 를 **조합**하거나 디자인 시스템 위에서 **자체 합성(compound)** 한 우리
  컴포넌트. 예: `header`(NavigationMenu·SegmentedRadioGroup·Sheet·Button 조합) · `section-header` ·
  `sub-section-header` · `step-header` · `stepper` · `action-bar` · `chip` · `search-bar` 등.
  shadcn 에 대응 primitive 가 없어 직접 만든 것도 여기 둔다(스타일이 크면 cva 를 `theme/` 로 분리해도 된다 —
  예: `chip.variants.ts`·`segmented-control.variants.ts`).
- **`composite/` 에 두지 않는 것** — provider(`theme-provider`) · 아이콘 시스템(`icon`·`icon-registry`) · 특정 화면
  전용 feature(`publishing-index`) 는 성격이 달라 `src/components` 최상위(또는 각자 폴더)에 둔다. 가이드 화면 전용은 `guide/`.
- **import 규칙** — 화면·도메인 코드는 `@/components/composite/<name>` 또는 `@/components/ui/<name>` 을 그대로
  import 한다. composite 내부에서 primitive 는 `@/components/ui/*` 로 가져온다.
- **게이트 적용** — `composite/`·`theme/` 는 우리 코드라 ESLint·Prettier·check:conventions 가 **전부 정상
  적용**된다(순정 셸 면제와 다름 — 아래 [게이트 정책](#게이트-정책--순정만-면제) 참조).

> **한 줄:** _primitive 는 `ui/`(셸)+`theme/`(스타일), 그걸 조합한 우리 컴포넌트는 `composite/`._

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

- **shadcn 표준(32개)**: `background`·`foreground` · `card(+ -foreground)` · `popover(+…)` · `primary(+…)` ·
  `secondary(+…)` · `muted(+…)` · `accent(+…)` · `destructive(+…)` · `border` · `input` · `ring` ·
  `chart-1~5` · `sidebar` (+`-foreground`/`-primary`/`-primary-foreground`/`-accent`/`-accent-foreground`/
  `-border`/`-ring`)
    - **개수는 빌드가 강제한다** — 표준 목록은 생성기의 `SHADCN_SLOTS`(32개)이고, tokens.json semantic 에서 하나라도
      빠지면 `yarn tokens` 가 **빌드를 실패**시킨다(`❌ shadcn 표준 슬롯 누락(n/32)`). 생성물 `tokens.css` 의 슬롯 주석에도
      `(32/32개)` 로 개수가 박혀, 하나 사라지면 바로 드러난다. (과거 `card-foreground` 가 조용히 빠졌던 걸 이 검증으로 방지.)
- **프로젝트 확장(비-shadcn 표면)**: `surface`(컨트롤 표면 — 아래 사용 규칙), `scroll-thumb`/`scroll-track`
  (스크롤바 가상요소 — 유틸 없이 `var()` 직접), `overlay`(오버레이/스크림 — `bg-overlay-*` 전용 유틸).
  shadcn 이 안 다루는 표면이라 직접 정의.
- 상태색(`success`/`warning`/`info`) 등 shadcn 에 없는 역할이 필요하면 **표준 슬롯을 지우지 말고 새 슬롯을
  추가**한다(tokens.json semantic 에 키 추가).

### `card` 와 `surface` 사용 규칙

`card` 는 shadcn 표준 슬롯이고, `surface` 는 프로젝트 확장 슬롯이다. 현재 light mode 에서는 둘 다
`common.white` 를 참조할 수 있지만, **값이 같다는 이유로 둘을 합치지 않는다.** 두 슬롯은 "현재 색"이 아니라
**미래에 달라질 수 있는 역할**을 분리하기 위해 둔다.

- **`bg-card` 사용** — Card·BaseCard·FormCard·Dialog/Popover content 처럼 독립된 카드/패널/컨테이너 배경.
  shadcn 이 이미 표준으로 제공하는 "떠 있는 면" 역할이다.
- **`bg-surface` 사용** — 카드가 아닌 기본 흰 표면. Input·Select·Combobox·Checkbox·Radio·Chip·SelectableCard
  처럼 컨트롤 또는 선택 UI 자체의 바탕 면에 쓴다.

정리 기준:

- 컴포넌트가 의미적으로 **카드/패널**이면 `bg-card`.
- 컴포넌트가 의미적으로 **컨트롤 표면**이면 `bg-surface`.
- 두 값이 현재 같더라도 사용처의 의미가 다르면 그대로 분리한다.
- 디자인에서 카드 배경과 컨트롤 표면이 실제로 달라질 경우, `tokens.json` 의 `surface` 값만 바꾸면 컨트롤 표면만
  함께 이동한다.

---

## 게이트 정책 — "순정만 면제"

vendored 순정 코드는 `as`(ST-002)·기본 팔레트·`function`·2-space 포맷 등 프로젝트 컨벤션과 다를 수 있어
게이트에서 면제한다. 단 **면제 대상은 "순정" 파일뿐**이고, cva 를 추출한 **수정 셸은 프로젝트가 유지보수하는
코드이므로 검사 대상**이다. 순정/수정 판별은 목록 관리가 아니라 **`@/components/theme/` import 여부로 기계
판별**한다(수정하는 순간 자동으로 검사 대상에 편입 — drift 없음).

| 게이트            | ui/ 순정 셸 | ui/ 수정 셸 | theme/·composite/·앱 코드 | vendor/shadcn-baseline |
| ----------------- | ----------- | ----------- | ------------------------- | ---------------------- |
| ESLint            | 면제        | **검사**    | 검사                      | 면제                   |
| check:conventions | 면제        | **검사**    | 검사                      | 면제(src 밖)           |
| Prettier          | 면제        | 면제¹       | 검사                      | 면제                   |
| typecheck         | 검사        | 검사        | 검사                      | 제외(tsconfig)         |

¹ 수정 셸도 본문은 업스트림 코드라 **업스트림 2-space 포맷을 유지**한다 — 프로젝트 포맷(4-space)으로
재포맷하면 업데이트 diff 전체가 포맷 노이즈로 오염된다. 포맷은 정확성 게이트가 아니므로 예외로 둔다.

- **ESLint**: `eslint.config.mjs` 가 ui/ 를 읽어 순정 파일만 `globalIgnores` 에 동적 등록한다.
  (예외: `ui/input-group.tsx` 순정 셸의 "그룹 클릭→포커스" 패턴이 jsx-a11y 2개 규칙에 걸려, 셸을 오염시키지
  않도록 config 레벨에서 해당 파일만 규칙을 끈다.)
- **check:conventions**: `scripts/check-conventions.mjs` 의 `isVanillaUiFile` — 같은 판별.
- **Prettier**: `.prettierignore` — `src/components/ui`(전체)·`src/lib/utils.ts`·`src/hooks/use-mobile.ts`·`vendor`.
- **typecheck**: `tsconfig.json` `exclude` 에 `vendor` — 보관소는 빌드와 무관해야 한다. 셸은 전부 typecheck 통과 필수.

shadcn 이 함께 내려주는 `src/lib/utils.ts`(cn)·`src/hooks/use-mobile.ts` 도 순정 유지 대상이다. 단 `cn` 은
커스텀 spacing 스케일(twMerge `extendTailwindMerge`) 등록이 꼭 필요해 순정에서 벗어나 있다 — 이런 변경은
"그럴 만한 이유"가 있을 때만 하고 주석으로 남긴다.

> **오버레이용 black/white** — 순정 dialog·sheet 등은 `bg-black/10` 스크림을 쓴다. 생성기가 기본 팔레트를
> `--color-*: initial` 로 지우되 **구조색 `black`·`white` 는 되살려**(Tailwind 기본과 동일) 순정 오버레이가 그대로
> 동작하게 한다. black/white 는 브랜드색이 아니라 구조색이라 유지한다(PB-05 의 팔레트-only 취지와 무관).

### 타이포 유틸 예외

- `ui/**` 셸과 `theme/**` variants 안에서만 `text-*`/`font-*` 유틸 허용 — `typo-*` 단독 규칙([PB-07/08])의
  예외(shadcn 원형 유지·cva 는 원형에서 파생). **일반 화면(페이지/도메인 컴포넌트)** 에서는 `typo-*` 를 쓴다.

---

## 컴포넌트 추가법

```bash
npx shadcn@latest add <component>
```

1. **셸이 `src/components/ui/<name>.tsx` 에 순정으로 내려온다** — CLI 가 alias 재작성·아이콘 해석을 자동
   처리한다. 재스킨이 필요 없으면 **여기서 끝** — 화면에서 `@/components/ui/<name>` 을 바로 쓴다(순정 셸은
   게이트 면제로 자동 인식).
2. 색/테두리/포커스 유틸(`bg-primary`·`border-input`·`ring-ring` …)이 표준 슬롯이라 자동으로 프로젝트 토큰에
   연결됨을 확인한다.
3. **재스킨이 필요하면 cva 를 추출한다**:
    - 셸의 바닐라 cva 정의를 `vendor/shadcn-baseline/<name>.variants.ts` 로 옮긴다(export 이름은
      `shadcn<Name>Variants`, 내용 수정 금지).
    - `src/components/theme/<name>.variants.ts` 를 만들고 프로젝트 값(cva)을 정의한다. 바닐라와 다른 지점엔
      `PROJECT-STYLE` 주석.
    - 셸에서는 cva 정의를 지우고 `import {xxxVariants} from '@/components/theme/<name>.variants'` 한 줄만 남긴다
      — **셸의 다른 부분은 손대지 않는다**([SC-02]).
4. 사이즈에 44px 터치 타깃(`min-h-11`, 아이콘은 `min-w-11`) 반영, 아이콘 버튼 `aria-label` 확인([6.1.3]).
5. theme cva 에서 `dark:` 수동 분기는 쓰지 않는다(토큰 자동 반사, [PB-06]).
6. `yarn verify` 통과.

## 업데이트 절차 (shadcn 버전 올릴 때)

1. `npx shadcn add <name> --overwrite` — 셸이 새 순정으로 덮인다.
2. `git diff src/components/ui/<name>.tsx` — 업스트림 셸 변경을 확인한다. 재스킨된 컴포넌트라면 새 셸의 cva 를
   다시 추출한다(theme import 복원). 이때 **새 바닐라 cva** 를 `vendor/shadcn-baseline/<name>.variants.ts` 에
   덮어쓴다.
3. baseline 의 **직전 바닐라 vs 새 바닐라** diff(git diff 로 자동 확인됨)가 곧 업스트림 스타일 변경분이다 —
   필요한 것만 `theme/<name>.variants.ts` 에 선별 반영한다.
4. `yarn verify` + `/component-guide` 렌더 확인.

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
- **검증 페이지**: `/component-guide` — 각 컴포넌트(Button variant/size/상태·Input 등)를 라이트·다크에서 렌더 확인.
- **PR 체크리스트**: [SC-01] arbitrary value 없음 / [SC-02] `ui/**` 셸의 구조·동작·a11y 수정 없음(cva 추출만 허용) /
  [SC-03] 기본 UI 는 shadcn / [SC-04] 스타일 수정은 `theme/*.variants.ts` 에서만, 바닐라 cva 는
  `vendor/shadcn-baseline/` 에 보관.
