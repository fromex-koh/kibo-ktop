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
  `bg-[#fff]`·`z-[60]`·`text-[10px]` 등 `[...]` 값)는 **원칙적으로 쓰지 않는다.** CSS 변수·외부 라이브러리 연동·
  구조적 grid template 등 **토큰이나 기존 유틸로 정확히 표현할 수 없는 기술적 사유**가 있을 때만 최소한으로 쓴다.
  `calc()`·`min()`·`max()`·`clamp()`라는 문법 자체는 허용 사유가 아니며, 아래
  [arbitrary value 예외 정책](#arbitrary-value-예외-정책)을 함께 적용한다.
  (연계: [PB-01]·[PB-13]·[NA-009]·[ST-004]·[CD-002])

- **[SC-02] primitive(vendored) shadcn 컴포넌트 수정 금지 (MUST)**
  `src/components/ui/**` 의 shadcn 원본은 **다운로드 순정 그대로** 둔다(고치지 않는다). 확장·커스텀은 kit
  styled copy 로만 한다([SC-04], [NA-007]). ui/** 는 게이트에서 면제되므로 순정 코드가 컨벤션과 달라도 된다
  (아래 [vendored 순정 유지 + 게이트 면제](#vendored-컴포넌트-srccomponentsui--순정-유지--게이트-면제) 참조).

- **[SC-04] 화면은 `kit/` 창구로만 import — 원본(`ui/`)은 바닐라 그대로 (MUST)**
  이 프로젝트는 shadcn 컴포넌트를 **두 레이어**로 운영한다. 자세한 그림은 아래
  [styled copy 패턴](#styled-copy-패턴--원본-보존--스타일-복사본) 참조.
    - **원본(`src/components/ui/<name>.tsx`)** — `npx shadcn add` **갓 다운로드 상태 그대로**. 동작·접근성·
      라이브러리 업데이트를 책임진다. **절대 손대지 않는다**(언제든 재다운로드 가능).
    - **kit 창구(`src/components/kit/<name>.tsx`)** — 화면·도메인 코드가 **유일하게 import 하는 앱-대면 레이어**
      (`@/components/kit/button`, `@/components/ui/button` 직접 import 아님). 두 형태가 있다:
        - **styled copy** — 재스킨이 필요한 컴포넌트(예: button·input·badge·select)는 원본을 **그대로 복사**하되 **스타일 정의
          (cva·className)만** 프로젝트 값으로 바꾼다. 셸(본문·`asChild`·`data-slot`·props·export)은 원본과 **동일**.
        - **facade(재수출)** — 재스킨이 없는 컴포넌트는 `export * from '@/components/ui/<name>'` 한 줄. 중복 없이
          창구만 통일한다. 나중에 재스킨이 필요해지면 그때 styled copy 로 승격한다.

    즉 **스타일 책임은 kit(복사본), 그 외 모든 책임은 원본**이다. 라이브러리가 업데이트되면 원본을 다시 받고,
    원본의 **셸 변경분만** 복사본에 옮기면 된다 — 스타일은 그 diff에 없으므로 그대로 유지된다(facade 는 자동 반영).

    단, `ui/**` **내부**에서 다른 프리미티브를 합성하는 것(예: `ui/dialog.tsx` 의 닫기 버튼이 `ui/button.tsx`
    의 ghost/icon-sm 을 쓰는 것)은 **원본끼리의 정상적인 합성**이므로 그대로 `ui/**` 경로를 쓴다 — kit 으로
    바꾸지 않는다(내부 usage 는 Figma type 이 아니라 outline/ghost/icon-* 만 쓰므로 원형 프리미티브로 충분).

    kit primitive 를 **조합**해 만든 우리 도메인 컴포넌트(예: `header`)는 primitive 가 아니라 별도 3번째 레이어
    `src/components/composite/` 에 둔다 — 아래 [컴포넌트 레이어링](#컴포넌트-레이어링--ui--kit--composite) 참조.

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

- **`ui/**`** — shadcn 다운로드 원본을 수정하지 않는다. 원본에 이미 포함된 arbitrary value 는 vendored 코드로
  인정하지만 프로젝트가 새로 추가하거나 정리하지 않는다([SC-02]).
- **`kit/**`** — 가장 엄격하게 적용한다. 디자인 값은 토큰/variant 로 관리하고, Radix 런타임 CSS 변수처럼 primitive
  계약상 필요한 값이나 대체 불가능한 구조 표현만 허용한다.
- **`composite/**`·`custom/**`** — kit 조합으로 해결한 뒤, 화면 구조상 필요한 grid/template·CSS 변수만 제한적으로 허용한다.
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
- [ ] `ui/**` 원본에 프로젝트 임의 값을 추가하지 않았는가?

---

## styled copy 패턴 — "원본 보존 + 스타일 복사본"

이 프로젝트가 shadcn 컴포넌트를 커스텀하는 **핵심 방식**이다([SC-04]). 두 레이어(폴더)로 나눈다.

```
 src/components/ui/<name>.tsx        ← ① 원본 (바닐라, 손대지 않음)
   · npx shadcn add 갓 다운로드 그대로
   · 동작 · 접근성 · 라이브러리 업데이트 담당
   · ui/** 내부 컴포넌트(dialog·pagination…)가 이 원본을 사용
          │
          ▼
 src/components/kit/<name>.tsx       ← ② kit 창구 (화면·도메인 코드가 유일하게 import)
   ├─ 재스킨 O (button·input·badge·select): styled copy — 원본 복사 + 스타일(cva·className)만 교체
   │                            셸(본문·asChild·data-slot·props·export)은 원본과 동일
   └─ 재스킨 X (그 외 대부분):  facade — export * from '@/components/ui/<name>' 한 줄
```

**책임 분리 (한 줄):** _스타일은 kit(복사본), 그 외 전부(동작·접근성·업데이트)는 원본._
**import 규칙:** 화면·도메인 코드는 항상 `@/components/kit/*`, 절대 `@/components/ui/*` 직접 X.

> ### ⚠️ kit 은 오직 스타일만 책임진다 (MUST)
>
> 승격된 kit styled copy 라 하더라도 **책임은 스타일(cva·className)에만** 있다. **내장 기능·DOM 구조·상호작용
> 동작·웹접근성**(포커스 트랩·Esc·바깥 클릭 닫기·`aria-*`·`role`·스크롤 잠금 등)은 **어떤 이유로도 kit 에서
> 추가하거나 재구현하지 않는다** — 그건 전부 **primitive(바닐라 radix) 원본의 책임**이다. (웹접근성 중 순수 _스타일_
> 에 해당하는 것 — 예: `focus-visible` 링 색·대비 — 만 kit 소관이다.)
>
> **왜** — 라이브러리가 업데이트되면 원본을 다시 받아 **그대로 반영**해야 한다. kit 이 스타일 밖(구조·동작·a11y)을
> 건드리면 그 diff 가 업스트림 변경분에 섞여, "업데이트를 그대로 받는" 게 불가능해진다(머지 충돌·기능 유실 위험).
>
> **기능이 필요하면** kit 셸을 바꾸지 말고 **① 사용처(usage)에서 조합**하거나 **② `composite/` 레이어**로 분리한다.
>
> **위반 예시(하지 말 것):** 다이얼로그를 "모달 전체 스크롤(Apple 식)"로 만들려고 `kit/dialog` 의 DOM 을
> 재구성(전체화면 스크롤 컨테이너)하고, 배경 Close 로 radix 의 바깥클릭 닫기를 **수동 재구현**한 것 → 동작·구조를
> 건드린 [SC-02]/[SC-04] 위반. 올바른 처리: kit 은 style-only 로 두고, 긴 내용은 **사용처에서 `max-h-* +
overflow-y-auto` 내부 스크롤 박스**로 감싼다(Content 내부라 radix 스크롤 잠금이 허용하는 영역).

### 왜 이렇게 하나

- **업데이트가 안전하다.** 라이브러리가 바뀌면 원본만 `npx shadcn add` 로 다시 받고, 원본의 **셸 변경분만**
  복사본에 옮긴다. 스타일(cva)은 그 diff에 없으니 **그대로 유지**된다. 원본을 직접 고쳤다면 매 업데이트가
  머지 충돌이 되지만, 이 방식은 충돌 지점이 "셸"로 한정된다.
- **표준 슬롯을 최대한 공유한다.** kit styled copy 라도 `bg-primary`·`text-primary-foreground`·`border-input`·
  `ring-ring` 처럼 shadcn 이 이미 가진 슬롯으로 표현 가능한 값은 그대로 쓴다. 컴포넌트별 전용 토큰은 표준 슬롯으로
  흡수할 수 없을 때만 남긴다.
- **왜 감싸지(compose) 않고 복사하나.** 얇게 감싸 `cn` 으로 덮어쓰는 방법도 있지만, 이 프로젝트 `cn` 은 순정
  `twMerge`(확장 없음)라 원본의 상태 유틸과 프로젝트 상태 유틸(예: `hover:bg-primary/80` vs
  `hover:bg-primary-hover`)이 안정적으로 **중복제거된다고 보장하기 어렵다**. 색·사이즈를 전면 재스킨하는 이
  프로젝트에선, wrapper override 보다 **"복사 후 cva 만 교체"** 가 충돌 없는 방식이다(업계에서 heavy customization 시
  쓰는 방식).

### 새 컴포넌트에 적용하는 법

1. `npx shadcn add <name>` 로 원본을 `src/components/ui/<name>.tsx` 에 받는다(그대로 둔다).
2. `src/components/kit/<name>.tsx` 창구 파일을 만든다:
    - **재스킨이 필요 없으면** → `export * from '@/components/ui/<name>'` 한 줄(facade).
    - **재스킨이 필요하면** → 원본을 복사해 **스타일 정의(cva·className)만** 프로젝트 값으로 바꾼다(styled copy). 셸은 그대로.
3. 화면·도메인 코드는 `@/components/kit/<name>` 을 import 한다(`@/components/ui/*` 직접 X).

> facade 로 시작하고, 나중에 재스킨이 필요해지면 그 파일만 styled copy 로 승격하면 사용처는 안 바뀐다.
> 판단이 서지 않으면 facade 로 둔다(중복 0).

### `PROJECT-STYLE` 주석 포맷

styled copy 에서 shadcn 원본과 다른 스타일을 남겨야 할 때는 코드 근처에 `PROJECT-STYLE:` 주석을 붙인다.
개발자가 diff 를 보자마자 "실수로 달라진 게 아니라 프로젝트/Figma 사양 때문에 남긴 차이"임을 알 수 있게 하기 위한
표식이다.

형식:

```tsx
// PROJECT-STYLE: <shadcn 원본 방식>이지만,
// <프로젝트/Figma 사양>이므로
// <유지하는 프로젝트 토큰/유틸>을 사용한다.
```

예:

```tsx
// PROJECT-STYLE: shadcn 원본은 hover:bg-primary/80 이지만,
// Figma hover/pressed는 solid brand token(blue.600/blue.700)이므로
// bg-primary-hover/bg-primary-pressed를 유지한다.
```

원칙:

- 표준 슬롯(`bg-primary`, `text-primary-foreground`, `border-input`, `ring-ring` 등)으로 표현 가능하면 주석 없이 표준 슬롯을 쓴다.
- shadcn 원본의 opacity 유틸(`bg-primary/80` 등)과 Figma 의 solid token 이 실제로 다르면, 값을 억지로 맞추지 않고 프로젝트 상태 슬롯(`bg-primary-hover` 등)을 둔다.
- `PROJECT-STYLE` 은 원본과 다르게 남기는 이유가 있을 때만 쓴다.
- 주석은 긴 배경 설명이 아니라 **원본 방식 → 프로젝트 사유 → 유지 토큰**만 적는다.
- 전체 예외 목록은 `rg "PROJECT-STYLE:" src/components/kit` 로 확인한다.

### 근거 (이 패턴이 표준인 출처)

임의 규칙이 아니라 업계 정착 패턴이다 — "원본 보존 + 커스텀 분리"에 "**대규모 수정은 소스 복사(fork)**"를 결합.

- [GOV.UK Design System — Extending and modifying components](https://design-system.service.gov.uk/get-started/extending-and-modifying-components/):
  _"If you need to make a large modification to a component you should fork it entirely by copying and pasting the source code to create a new component."_ (영국 정부 공식 디자인 시스템)
- [shadcn/ui — Best practices for customizing (Discussion #9754)](https://github.com/shadcn-ui/ui/discussions/9754) — base `ui/` 는 원형 유지(레지스트리에서 언제든 재다운로드), 커스텀은 wrapper/복사본에.
- [shadcn/ui — 대규모 프로덕션 구조 (Discussion #9756)](https://github.com/shadcn-ui/ui/discussions/9756) · [Vercel Academy — Extending shadcn/ui](https://vercel.com/academy/shadcn-ui/extending-shadcn-ui-with-custom-components) — 원형 레이어와 커스텀 레이어 분리.
- 링크·요약 전체는 [README.md](../README.md) 의 "컴포넌트(shadcn/ui) › 이 패턴이 근거 있는 방식인 이유" 참고.

---

## 컴포넌트 레이어링 — `ui/` → `kit/` → `composite/`

위 styled copy 패턴이 primitive 를 다루는 **2레이어(`ui/`·`kit/`)** 라면, **그 primitive 들을 조합해 우리 컴포넌트를
만드는 3번째 레이어**가 `composite/` 다.

```
 src/components/ui/<name>.tsx         (L0) shadcn 순정 primitive         ← 게이트 면제, 손대지 않음
        │
        ▼
 src/components/kit/<name>.tsx        (L1) ui/ 의 앱-대면 창구             ← styled copy/facade, primitive 1:1
        │
        ▼
 src/components/composite/<name>.tsx  (L2) kit 을 조합한 도메인 컴포넌트    ← 우리가 만드는 합성 컴포넌트
```

- **`composite/` 에 두는 것** — kit primitive 를 **조합**하거나 디자인 시스템 위에서 **자체 합성(compound)** 한 우리
  컴포넌트. primitive 가 아니므로 `ui/`(순정 전용)·`kit/`(primitive 1:1 창구) 어디에도 넣을 수 없다.
  예: `header`(NavigationMenu·ToggleGroup·Sheet·Button 조합) · `theme-toggle`(Button + 테마 로직) · `sidebar-layout`
  · `section-header` · `sub-section-header` · `panel`.
- **`composite/` 에 두지 않는 것** — provider(`theme-provider`) · 아이콘 시스템(`icon`·`icon-registry`) · 특정 화면
  전용 feature(`publishing-index`) 는 성격이 달라 `src/components` 최상위(또는 각자 폴더)에 둔다. 가이드 화면 전용은 `guide/`.
- **import 규칙** — 화면·도메인 코드는 `@/components/composite/<name>` 로 import 한다. composite 내부에서 조합 대상
  primitive 는 `@/components/kit/*` 로 가져온다(`@/components/ui/*` 직접 X, [SC-04]).
- **게이트 적용** — `composite/` 는 우리 코드라 ESLint·Prettier·check:conventions 가 **전부 정상 적용**된다(`ui/` 면제와 다름).

> **한 줄:** _primitive 는 `ui/`(순정)→`kit/`(창구), 그 primitive 를 조합한 우리 컴포넌트는 `composite/`._

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
- **프로젝트 확장(비-shadcn 표면)**: `scroll-thumb`/`scroll-track`(스크롤바 가상요소 — 유틸 없이 `var()` 직접),
  `overlay`(오버레이/스크림 — `bg-overlay-*` 전용 유틸). shadcn 이 안 다루는 표면이라 직접 정의.
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

## vendored 파일(shadcn 다운로드) — 순정 유지 + 게이트 면제

**`npx shadcn add` 로 받은 파일은 다운로드 순정 상태 그대로 둔다.** 이식·수정하지 않는다 — 그래야 shadcn 이
업데이트될 때 우리가 보는 diff 가 "업스트림이 실제로 바꾼 것"만 남아 확인·반영이 쉽다. 스타일 커스텀은 전부 kit
styled copy 에서 한다([SC-04]). 대상:

- **`src/components/ui/**`** — shadcn UI 컴포넌트 원본
- **`src/lib/utils.ts`** — `cn` 헬퍼(shadcn 이 함께 내려줌)
- **`src/hooks/use-mobile.ts`** — 모바일 판별 훅(Sidebar 의존성)

순정 코드는 `as`(ST-002)·기본 팔레트·`function`·2-space 포맷 등 프로젝트 컨벤션과 다를 수 있으므로, 위 파일들은
**게이트에서 면제**한다(이게 "md 규칙 영향력 밖"의 실체다):

- **ESLint**: `eslint.config.mjs` 의 `globalIgnores` — `src/components/ui/**`·`src/lib/utils.ts`·`src/hooks/use-mobile.ts`.
- **Prettier**: `.prettierignore` 에 위 경로(순정 2-space 유지 → 업스트림과 diff 깨끗).
- **check:conventions**: `scripts/check-conventions.mjs` 의 `SKIP_DIRS`(`components/ui`)·`SKIP_FILES`(`lib/utils.ts`·`hooks/use-mobile.ts`).
- **typecheck 는 유지** — 순정도 타입은 통과해야 한다(안 되면 그 컴포넌트를 쓰는 게 맞는지 재검토).

> **주의** — 이 파일들은 순정 유지가 원칙이지만, 향후 `cn` 확장(예: `extendTailwindMerge`)처럼 프로젝트가 꼭
> 손대야 하면 그 순간 순정에서 벗어나 업데이트 시 diff 가 생긴다. 그런 변경은 "그럴 만한 이유"가 있을 때만 하고
> 주석으로 남긴다. (`use-mobile.ts` 는 과거 SSR 개선을 했었으나, 순정 diff 최소화를 위해 다시 순정으로 되돌렸다.)

CLI 가 설치 시 자동으로 하는 것(=순정 상태의 일부, 우리가 손댄 게 아님)은 그대로 둔다: import alias 재작성
(`@/registry/*` → `@/lib/utils`·`@/components/ui/*`·`@/hooks/*`), 아이콘 placeholder → `lucide-react` 해석.

> **오버레이용 black/white** — 순정 dialog·sheet 등은 `bg-black/10` 스크림을 쓴다. 생성기가 기본 팔레트를
> `--color-*: initial` 로 지우되 **구조색 `black`·`white` 는 되살려**(Tailwind 기본과 동일) 순정 오버레이가 그대로
> 동작하게 한다. black/white 는 브랜드색이 아니라 구조색이라 유지한다(PB-05 의 팔레트-only 취지와 무관).

### 타이포 유틸 예외

- `ui/**` 원본 **및 그 kit 창구(`src/components/kit/<name>.tsx`)** 안에서만 `text-*`/`font-*` 유틸 허용 —
  `typo-*` 단독 규칙([PB-07/08])의 예외(shadcn 원형·복사본 셸 유지). 복사본은 원본과 같은 컴포넌트라 같은 예외를 받는다.
- **일반 화면(페이지/도메인 컴포넌트)** 에서는 `typo-*` 를 쓴다.

---

## 컴포넌트 추가법

```bash
npx shadcn@latest add <component>
```

체크리스트:

1. **원본은 `src/components/ui/<name>.tsx` 에 다운로드 순정 그대로 둔다** — `npx shadcn add <name> --overwrite`
   가 alias 재작성·아이콘 해석을 자동 처리한다. **손대지 않는다**(ui/** 는 게이트 면제라 순정 그대로 통과).
2. 색/테두리/포커스 유틸(`bg-primary`·`border-input`·`ring-ring` …)이 표준 슬롯이라 자동으로 프로젝트 토큰에 연결됨을 확인.
3. **`src/components/kit/<name>.tsx` 창구를 만든다**([SC-04], [styled copy 패턴](#styled-copy-패턴--원본-보존--스타일-복사본)):
   재스킨 없으면 `export * from '@/components/ui/<name>'`(facade), 필요하면 원본 복사 후 **cva(스타일)만** 교체(styled copy).
   화면·도메인 코드는 이 kit 창구를 import(`@/components/ui/*` 직접 X).
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
- **검증 페이지**: `/component-guide` — 각 컴포넌트(Button variant/size/상태·Input 등)를 라이트·다크에서 렌더 확인.
- **PR 체크리스트**: [SC-01] arbitrary value 없음 / [SC-02] `ui/**` 원본 바닐라 유지 / [SC-03] 기본 UI 는 shadcn /
  [SC-04] 화면·도메인 코드는 `ui/**` 대신 `kit/` 창구(`@/components/kit/<name>`)를 import, 스타일은 kit styled copy 에서만.
