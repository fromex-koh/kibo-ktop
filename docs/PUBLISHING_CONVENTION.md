# 퍼블리싱 컨벤션 (디자인 토큰 · 스타일)

이 문서는 **퍼블리싱(마크업·스타일) 작업**에서 지키는 프로젝트 고유 규칙이다.
색상·타이포·간격·라운드·그림자 등 **디자인 값의 사용 방식**을 정의한다.

## 우선순위 (충돌 시)

1. **[docs/CODE_CONVENTION.md](CODE_CONVENTION.md)** — 프론트엔드 개발 표준. **최우선.** 본 문서와 충돌하면 이쪽을 따른다.
2. **[docs/ACCESSIBILITY.md](ACCESSIBILITY.md)** — 웹 접근성(KWCAG 2.1). 법적 필수.
3. **본 문서** — 위 둘과 상충하지 않는 범위에서 적용하는 퍼블리싱/토큰 규칙.

## 원칙

디자인 값(색상·타이포·간격·라운드·그림자)은 **`tokens.json` 단일 소스**에서 생성된 토큰·유틸리티만 사용한다. 하드코딩하지 않는다.

```
tokens.json (px 숫자) → yarn tokens → src/app/tokens.css (자동) → Tailwind 유틸 / .typo-*
```

## 용어 — 토큰 vs 유틸리티 클래스

이 둘을 섞어 쓰면 문서·리뷰가 혼란해진다. 아래로 고정한다.

- **토큰(Design Token)** — 디자인 **결정값**("무엇"). **소스**는 `tokens.json`(px 숫자), **런타임 표현**은 `src/app/tokens.css`의 **CSS 변수**다. 즉 "토큰 = CSS 변수"가 맞되, 그 원천이 `tokens.json`이다. `var(--…)` 로 참조한다.
- **유틸리티 클래스(Utility Class)** — 그 토큰을 요소에 **적용하는 API**("어떻게"). `className` 에 쓴다. Tailwind가 생성한 것(`bg-brand`·`rounded-md`·`p-4`)과 프로젝트 **복합 유틸리티**(`typo-*`·`.grid-layout`, 여러 토큰을 한 번에 적용)로 나뉜다.

> **판별 한 줄** — `className` 에 쓰면 **유틸리티 클래스**, `var(--…)`/`tokens.json` 에 있으면 **토큰**. 예: `rounded-md`(유틸) 가 적용하는 `--ds-radius-md`(토큰).

| 계층                | 예                                            | 실체      | 사용                     |
| ------------------- | --------------------------------------------- | --------- | ------------------------ |
| **Primitive 토큰**  | `--raw-blue-50` (`blue.50`)                   | CSS 변수  | 직접 X — semantic이 참조 |
| **Semantic 토큰**   | `--ds-brand` · `--ds-radius-md`               | CSS 변수  | `var()` / `@theme` 등록  |
| **유틸리티 클래스** | `bg-brand` · `rounded-md` · `typo-heading-lg` | className | JSX `className`          |

---

## 토큰 사용

- **[PB-01] 생성된 토큰/유틸만 사용 (MUST)** — 색상·간격·라운드·그림자·타이포는 임의값(hex·px) 하드코딩 금지. (CODE_CONVENTION `NA-009` 연계)
- **[PB-02] 소스는 `tokens.json`, 생성물은 손대지 않음 (MUST)** — 값 변경은 `tokens.json` 수정 후 `yarn tokens`(predev/prebuild 자동). 생성물 `src/app/tokens.css` **직접 수정 금지**.
- **[PB-03] 입력은 px, 출력은 rem (MUST)** — `tokens.json`엔 사용자 인지 기준인 **px 숫자**로 쓴다. rem 변환(÷16)은 생성기가 자동 처리. (`%`·`em`·특수값만 문자열)

## 색상

- **[PB-04] 시맨틱 용도 토큰 우선 (MUST)** — `bg-background` · `text-foreground` · `text-foreground-muted` · `border-border` · `bg-surface` · `bg-brand` · `text-brand-foreground` · `text-danger`/`success`/`warning`/`info` 등.
- **[PB-05] 팔레트 스케일 직접 사용 지양, 시맨틱 우선 (MUST)** — 프로젝트 팔레트는 Figma 원본대로 **50~900 스케일**(`50·100·200·…·900`), 휴는 `blue·navy·green·orange·grape·gray·success·warning·error·info` 10색이다(보라색은 Tailwind 기본 `purple` 과 유틸 이름이 겹쳐 오탐되므로 **`grape`** 로 명명한다). 생성기가 **Tailwind 기본 색 팔레트(`red`·`slate`·`amber`·`purple` 등 50~950)를 제거**(`--color-*: initial`)하므로 이 10색·정의된 스텝만 유효하다 — `bg-red-500`·`bg-slate-500`·`bg-purple-500`·`blue-950` 처럼 없는 키는 무효 유틸이 되어 아무 색도 안 나온다(오사용이 화면에서 바로 드러난다·`check:conventions` 가 차단한다). 구조 키워드 `transparent`·`current`·`inherit` 와 **구조색 `black`·`white`** 는 유지된다(black/white 는 브랜드색이 아니라 구조색 — shadcn 순정 컴포넌트의 오버레이 `bg-black/10` 등이 동작해야 ui/ 를 순정 그대로 둘 수 있다, [SHADCN.md](SHADCN.md)). `bg-gray-100`·`text-blue-700` 같은 팔레트 키는 보조로만 쓰고, 색은 시맨틱 토큰(`bg-brand`·`text-danger` 등)을 우선한다.
- **[PB-06] 라이트/다크를 요소에서 분기하지 않음 (MUST)** — 시맨틱 토큰이 `.dark`에서 자동 반사되므로 `dark:bg-…` 로 색을 수동 분기하지 않는다. 예외적 재매핑이 필요하면 `tokens.json`의 semantic에 `{ "light": …, "dark": … }` 로 지정.

## 타이포그래피

- **[PB-07] `typo-*` 복합 클래스 사용 (MUST)** — 제목·본문은 `typo-heading-*`·`typo-body-*`·`typo-label`·`typo-caption`. 크기·굵기·행간·자간·모바일/PC 반응형이 **한 묶음**으로 적용된다.
- **[PB-08] `typo-*` 와 `text-*`/`font-*`/`leading-*`/`tracking-*` 를 같은 요소에 함께 쓰지 않음 (MUST)** — 둘 다 `font-size` 등을 지정해 cascade 순서로 충돌한다. 한 요소엔 `typo-*` **하나만**.
    ```tsx
    <h1 className="typo-heading-lg">제목</h1>              // O
    <h1 className="typo-heading-lg text-3xl">제목</h1>     // X (충돌)
    ```

## 간격 · 형태 · 효과

- **[PB-09] 간격·라운드·그림자는 토큰 유틸 사용 (MUST)** — 간격 `p-* m-* gap-*`(spacing), 모서리 `rounded-*`(radius), 그림자 `shadow-*`(effect), 블러 `blur-*`. 임의값 `p-[13px]`·`rounded-[7px]` 지양.
- **[PB-10] 고정 크기는 size 토큰 (RECOMMENDED)** — 아이콘은 `size-icon-md`, 컨트롤 높이는 `h-control-h-md` 등. (`control-h-*` 는 버튼·인풋 등 컨트롤의 **높이** 토큰이라 `h-*`/`min-h-*` 로 쓴다.)
- **[PB-13] 간격은 base 배수, 라운드·크기·그림자는 정의된 토큰만 (MUST)**
    - **간격(spacing)**: `tokens.json`의 `spacingBase`(현재 4px)를 기준으로 한 **정수 배수 유틸**(`p-4`·`gap-6`·`mt-8`…)을 쓴다. base가 그리드를 강제하므로 어떤 정수 N이든 4px 그리드에 맞는다(`p-4`=16px·`p-6`=24px). `base` 하나만 바꾸면 전체가 비율대로 조정된다. **임의 px(`p-[13px]`)·반단위(`p-1.5`) 남용은 지양**한다.
    - **라운드·고정크기·그림자(radius·size·shadow)**: `tokens.json`에 **정의된 키만** 쓴다(`rounded-md`·`size-icon-md`·`shadow-2`). 미정의 키는 Tailwind 기본이 나가므로 지양.
    - base 값·정의 목록은 `tokens.json` 또는 가이드 화면 `/component-guide` 에서 확인한다.
    - ⚠️ **현재 spacingBase·radius·size·shadow·typography 값은 디자인 확정 전 임시(placeholder)**다. 확정 후 `tokens.json`을 실제 값으로 교체한다(비선형 스케일이 필요하면 명명 토큰으로 추가). 강제가 필요하면 추후 ESLint 규칙을 추가한다.

## 반응형 (브레이크포인트)

- **[PB-14] Tailwind 기본 브레이크포인트 사용, 모바일 퍼스트 (MUST/권장)**
    - **Tailwind 기본 프리픽스를 그대로 쓴다**: `sm:`(640) · `md:`(768) · `lg:`(1024) · `xl:`(1280) · `2xl:`(1536). 기본 유틸로 모바일을 만들고 상위 구간만 프리픽스로 덮어쓴다.
    - **프로젝트 주 티어는 `md:`(768px)·`xl:`(1280px)** 두 단계다 — 그리드·타이포 전환이 이 두 폭을 기준으로 한다. `sm:`/`lg:`/`2xl:` 도 동작하지만, 레이아웃 일관성을 위해 **새 코드는 `md:`/`xl:` 우선**을 권장한다.
    - 과거의 커스텀 프리픽스 `wide:`(=md)/`pc:`(=xl)는 **폐기**했다 — 값이 Tailwind 기본과 동일해 별칭만 늘릴 뿐이라, 혼선을 막고 개발자에게 익숙한 표준 이름(`md`/`xl`)으로 통일했다. (생성기가 기본 브레이크포인트를 지우지 않으므로 `sm:`~`2xl:` 가 모두 동작한다 — shadcn 원본·손에 익은 유틸이 silent no-op 되지 않는다.)
    - 콘텐츠 영역은 고정폭 대신 **`max-w-content`**(1200px) + `mx-auto` 로 제한한다(ST-004 연계). `max-w-sm`~`max-w-7xl` 등 Tailwind 기본 max-w 스케일도 **동작한다**(shadcn 다이얼로그 등이 `max-w-xs`/`max-w-sm` 사용) — `content` 키는 그 위에 추가된 것이다.
    - 값 변경은 `tokens.json` 의 `breakpoint`(grid·typo 티어 데이터)/`container` 수정 → `yarn tokens`. 타이포 모바일→PC 전환점(`typographyBreakpoint`)도 breakpoint 키 참조("md")로 연동된다. `md`/`xl` 은 값이 Tailwind 기본과 같아 CSS 로는 중복 선언되지 않는다.
- **[PB-15] 레이아웃 그리드는 `.grid-layout` 하나로 (MUST)** — 컬럼 수·거터(칸 간격)·마진(가장자리 여백)은 `tokens.json`의 `grid`(브레이크포인트별)에서 온다. 컬럼 그리드가 필요한 곳엔 `grid-cols-*`/`gap-*`/`px-*` 를 직접 조합하지 않고 **`.grid-layout`** 클래스를 쓴다 — 내부적으로 `--ds-grid-columns`/`--ds-grid-gutter`/`--ds-grid-margin` 과 공용 `max-w-content` 폭 상한을 함께 캡슐화한다.
    - `grid` 의 키는 `breakpoint`(+`mobile`)와 **정확히 1:1 대응**해야 하며, 어긋나면(키 누락·불일치) 빌드가 실패한다. 브레이크포인트를 리네임·추가하면 `grid` 도 함께 갱신한다.
    - 값 변경은 `tokens.json` 의 `grid` 수정 → `yarn tokens`. 현재 값은 다른 디자인 토큰과 마찬가지로 확정 전 placeholder다.
- **[PB-16] 스크롤바도 토큰 기반 (MUST)** — 두께는 `size.scrollbar-w`, 색은 `semantic.scroll-thumb`/`scroll-track`(gray 스케일 참조라 다크 자동 반사)에서 온다. **이 커스텀의 목적은 브라우저·OS마다 다른 기본 스크롤바(폭·색·모양)를 프로젝트 전역에서 하나의 모양으로 통일**하는 것이다. `html { scrollbar-gutter: stable }` 도 같은 목적의 일부로, 스크롤바 유무와 무관하게 **자리를 항상 예약해 콘텐츠 폭을 고정**한다(스크롤바가 생겼다 사라질 때의 레이아웃 시프트 방지).
    - **폭 측정 시 주의(모든 해상도에서 6px 차이)**: `scrollbar-gutter: stable` 은 스크롤바 자리(`size.scrollbar-w`=6px)를 늘 예약한다. 그래서 **데스크톱 브라우저 창을 줄여 재면** 클래식 스크롤바(6px)가 자리를 차지해 어떤 폭에서든 콘텐츠 폭이 6px 작게 나오고, **실제 스마트폰·DevTools 기기 모드**는 오버레이 스크롤바(0px)라 스펙값 그대로 나온다(즉 `창 축소값 = 기기 모드값 − 6px`. 예: 360px에서 322 vs 328). 버그가 아니라 스크롤바 종류(클래식 vs 오버레이) 차이이며 **실제 모바일이 보는 값은 기기 모드 쪽**이다 — 폭 확인은 창 축소가 아니라 **DevTools 기기 모드/실제 기기**로 한다.
    - `::-webkit-scrollbar` 만 커스터마이즈한다(Chrome/Safari/Edge). 표준 `scrollbar-width`/`scrollbar-color` 는 **의도적으로 두지 않는다** — Chrome 121+ 에서 표준 속성이 있으면 두께 커스텀을 무시하고 플랫폼 기본(`thin`, ~11px)을 적용해 예약된 gutter 폭과 어긋난다. Firefox 는 기본 스크롤바를 그대로 쓴다.
    - 값 변경은 `tokens.json` 의 `size.scrollbar-w`/`semantic.scroll-thumb`/`scroll-track` 수정 → `yarn tokens`.

## 대비 (접근성 연계)

- **[PB-11] 대비 기준 준수 (MUST)** — 본문 텍스트 **4.5:1**, 큰 텍스트·아이콘·UI 그래픽 **3:1**. 생성기가 빌드 시 자동 검증하며, 미달이면 **빌드가 실패**한다.

## 예외

- **[PB-12] 토큰 뷰어에서만 인라인 `var()` 허용** — 컴포넌트 가이드처럼 토큰을 나열·시연하는 화면에서는 `style={{ background: 'var(--raw-…)' }}` 인라인 참조를 허용한다(동적 클래스명은 Tailwind가 생성하지 못하므로). **일반 UI 화면에서는 유틸 클래스**를 쓴다.

---

## PR 체크리스트 (퍼블리싱)

- [ ] [PB-01] 색·간격·라운드·그림자·타이포가 전부 토큰/유틸 (hex·px 하드코딩 없음)
- [ ] [PB-04/05] 시맨틱 색 토큰 우선, Tailwind 기본 팔레트 키 미사용
- [ ] [PB-06] `dark:` 색 수동 분기 없음 (토큰 자동 반사)
- [ ] [PB-07/08] `typo-*` 단독 사용 (`text-*` 등과 혼용 없음)
- [ ] [PB-13] 간격은 base 배수 유틸(`p-4` 등), 라운드·크기·그림자는 정의된 키만
- [ ] [PB-14] 반응형은 Tailwind 기본 프리픽스(기본 = 모바일), 주 티어 `md:`/`xl:` 우선. 콘텐츠 영역 `max-w-content`
- [ ] [PB-15] 컬럼 그리드는 `.grid-layout` 사용 (개별 `grid-cols-*`+`gap-*`+`px-*` 조합 대신)
- [ ] [PB-16] 스크롤바 두께·색 하드코딩 없음 (`size.scrollbar-w`/`semantic.scroll-thumb`·`scroll-track` 토큰 사용)
- [ ] [PB-02/03] `tokens.json`(px) 수정 → `yarn tokens`, `tokens.css` 직접수정 없음
- [ ] [PB-11] 대비 통과 (빌드 검증)
