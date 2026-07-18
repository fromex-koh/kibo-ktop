# 퍼블리싱 컨벤션

이 문서는 프로젝트의 **마크업·디자인 토큰·스타일 사용 규칙**만 다룬다.

- 언어·Next.js·네이밍·메서드 규칙: [CODE_CONVENTION.md](CODE_CONVENTION.md)
- 웹 접근성·명도 대비 기준: [ACCESSIBILITY.md](ACCESSIBILITY.md)
- shadcn 원본 보존·theme 분리·arbitrary value 예외: [SHADCN.md](SHADCN.md)
- 브랜치·커밋·자동 게이트: [GIT_CONVENTION.md](GIT_CONVENTION.md)

충돌 시 `CODE_CONVENTION.md` → `ACCESSIBILITY.md` → 본 문서 순으로 적용한다. shadcn 파일에는 본 문서와 함께 `SHADCN.md`의 더 구체적인 규칙을 적용한다.

## 1. 토큰 파이프라인

디자인 값의 단일 소스는 `tokens.json`이다.

```text
tokens.json(px 입력) → yarn tokens → src/app/tokens.css(rem·CSS 변수·유틸리티 생성)
```

- **[PB-01] 생성된 토큰과 기존 유틸리티 우선(MUST)** — 색상·간격·라운드·크기·그림자·타이포그래피를 임의의 Hex나 px로 직접 작성하지 않는다.
- **[PB-02] 원본과 생성물 분리(MUST)** — 디자인 값은 `tokens.json`에서 수정하고 `yarn tokens`를 실행한다. 생성물 `src/app/tokens.css`는 직접 수정하지 않는다.
- **[PB-03] px 입력, rem 출력(MUST)** — `tokens.json`의 수치형 디자인 값은 px 숫자로 관리하며 `remBase`(현재 16)를 기준으로 생성기가 rem으로 변환한다. `%`나 토큰 참조처럼 단위 변환 대상이 아닌 값만 문자열로 작성한다.

### 용어

| 계층            | 역할                     | 예                                       | 직접 사용하는 곳              |
| --------------- | ------------------------ | ---------------------------------------- | ----------------------------- |
| Primitive 토큰  | 원시 색상·수치           | `blue.500`, `gray.200`                   | `tokens.json`의 semantic 참조 |
| Semantic 토큰   | 용도별 결정값            | `--ds-primary`, `--ds-surface`           | 생성 CSS·특수 CSS             |
| 유틸리티 클래스 | 토큰을 요소에 적용       | `bg-primary`, `bg-surface`, `rounded-md` | JSX `className`               |
| 복합 유틸리티   | 여러 속성을 한 번에 적용 | `typo-*`, `grid-layout`                  | JSX `className`               |

일반 UI에서는 CSS 변수를 직접 쓰지 않고 생성된 유틸리티 클래스를 사용한다.

## 2. 색상

- **[PB-04] 시맨틱 토큰 우선(MUST)** — 요소의 역할에 맞는 시맨틱 유틸리티를 먼저 선택한다.
    - 배경: `bg-background`, `bg-surface`, `bg-card`, `bg-primary`
    - 텍스트: `text-foreground`, `text-foreground-subtle`, `text-label-foreground`, `text-primary-foreground`
    - 테두리·포커스: `border-input`, `border-control`, `border-subtle-2`, `ring-ring`
    - 상태: `text-success`, `text-warning`, `text-error`, `text-info`
- **[PB-05] Primitive 팔레트는 보조 수단(MUST)** — 프로젝트 팔레트는 `blue·navy·green·orange·grape·gray·success·warning·error·info`와 `tokens.json`에 정의된 단계만 사용한다. 같은 값이더라도 의미를 표현할 시맨틱 토큰이 있으면 팔레트 유틸리티보다 시맨틱 유틸리티를 우선한다.
    - Tailwind 기본 팔레트(`slate`, `red`, `amber`, `purple` 등)는 생성 단계에서 제거되며 `check:conventions`가 사용을 차단한다.
    - `transparent`, `current`, `inherit`, 구조색 `black`, `white`는 유지한다.
- **[PB-06] 색상 모드를 사용처에서 재정의하지 않음(MUST)** — 시맨틱 토큰의 light/dark 매핑을 사용한다. 컴포넌트에서 `dark:bg-*`로 같은 의미의 색을 다시 분기하지 않는다. 필요한 매핑은 `tokens.json`의 semantic에 `{ "light": ..., "dark": ... }`로 정의한다.

shadcn 표준 슬롯과 프로젝트 상태 토큰의 선택 기준은 [SHADCN.md](SHADCN.md)의 "테마 모델"을 따른다.

## 3. 타이포그래피

- **[PB-07] `typo-*` 복합 유틸리티 사용(MUST)** — 제목과 본문은 컴포넌트 가이드의 타이포그래피 목록에 정의된 `typo-*` 클래스를 사용한다. 크기·굵기·행간·자간과 반응형 전환이 함께 적용된다.
- **[PB-08] 동일 속성 유틸리티 중복 금지(MUST)** — 하나의 요소에서 `typo-*`와 `text-*`(크기), `font-*`, `leading-*`, `tracking-*`를 조합해 같은 속성을 다시 지정하지 않는다. 색상용 `text-<semantic>`은 함께 사용할 수 있다.

```tsx
// 권장
<h2 className="typo-h2-bold text-foreground">제목</h2>

// 금지: font-size를 두 번 정의
<h2 className="typo-h2-bold text-3xl">제목</h2>
```

## 4. 간격·크기·형태·효과

- **[PB-09] 기존 유틸리티 우선(MUST)** — 간격은 `p-*`, `m-*`, `gap-*`; 라운드는 `rounded-*`; 그림자는 `shadow-*`; 블러는 `blur-*`를 사용한다. 같은 값을 표현할 기존 유틸리티가 있으면 arbitrary value를 사용하지 않는다.
- **[PB-10] 의미 있는 고정 크기는 size 토큰 사용(RECOMMENDED)** — 아이콘은 `size-icon-*`, 컨트롤 높이는 `h-control-h-*`, 레이아웃 고정값은 해당 의미의 size 유틸리티를 사용한다.
- **[PB-13] 토큰 스케일 준수(MUST)**
    - spacing은 `spacingBase`(현재 4px)의 정수 배수 유틸리티를 사용한다. 예: `p-4` = 16px, `gap-6` = 24px.
    - radius·size·shadow는 `tokens.json`에 정의된 이름만 사용한다.
    - 공통으로 반복되는 디자인 값은 arbitrary value로 남기지 않고 `tokens.json`의 의미 있는 토큰으로 승격한다.
    - 현재 값과 사용 가능한 이름은 `tokens.json`과 `/component-guide`에서 확인한다.

arbitrary value의 허용 범위, 반복 시 승격 기준, `ui/` 원본 예외는 [SHADCN.md](SHADCN.md)의 "arbitrary value 예외 정책"에만 정의한다.

## 5. 반응형·레이아웃

- **[PB-14] 모바일 퍼스트와 Tailwind 기본 브레이크포인트 사용(MUST)**
    - 기본 클래스는 모바일 스타일이며 `sm:`(640), `md:`(768), `lg:`(1024), `xl:`(1280), `2xl:`(1536)로 확장한다.
    - 프로젝트 주 티어는 `md:`와 `xl:`이다. 새 레이아웃은 두 티어를 우선하되 필요한 경우 다른 기본 티어도 사용할 수 있다.
    - 콘텐츠 폭 상한은 `max-w-content`(현재 1200px)와 `mx-auto`를 사용한다.
    - 프로젝트 티어 값은 `tokens.json`의 `breakpoint`, `container`, `typographyBreakpoint`에서 관리한다.
- **[PB-15] 페이지 컬럼 그리드는 `grid-layout` 사용(MUST)** — 페이지의 공통 컬럼·거터·가장자리 여백은 개별 `grid-cols-*`, `gap-*`, `px-*` 조합 대신 `grid-layout`으로 적용한다. `tokens.json`의 `grid` 키는 `mobile`과 모든 프로젝트 breakpoint 키에 1:1로 대응해야 하며, 누락·불일치 시 토큰 생성이 실패한다.

현재 그리드는 모바일 4열, `md` 8열, `xl` 12열이며 구체적인 값은 `tokens.json`을 단일 소스로 한다.

## 6. 스크롤바

- **[PB-16] 전역 스크롤바는 토큰 기반(MUST)** — 두께는 `size.scrollbar-w`, 색상은 `semantic.scroll-thumb`과 `semantic.scroll-track`에서 관리한다.
- `scrollbar-gutter: stable`로 스크롤바 자리를 예약해 페이지 이동 시 레이아웃 시프트를 줄인다. 스크롤 잠금 라이브러리가 보정값을 적용하는 동안에는 `globals.css`의 `:has(body[data-scroll-locked])` 규칙이 중복 보정을 방지한다.
- WebKit/Blink는 프로젝트 스크롤바를 사용하고 Firefox는 기본 스크롤바를 유지한다. 표준 `scrollbar-width`와 `scrollbar-color`를 전역에 추가하면 예약 폭과 실제 폭이 달라질 수 있으므로 추가하지 않는다.
- 실제 모바일 폭은 클래식 스크롤바가 있는 데스크톱 창 축소가 아니라 DevTools 기기 모드 또는 실제 기기에서 검수한다.

## 7. 접근성·예외

- **[PB-11] 명도 대비 준수(MUST)** — 기준과 수동 검수 방법은 [ACCESSIBILITY.md의 텍스트 콘텐츠 명도 대비](ACCESSIBILITY.md#지침-53-명료성)를 따른다. 현재 light/dark 색상 정합 작업으로 토큰 생성기의 자동 대비 게이트는 임시 비활성화되어 있으므로, 재활성화 전까지 수동 검수가 필요하다.
- **[PB-12] 토큰 가이드에서만 인라인 CSS 변수 허용** — 토큰을 동적으로 나열하는 가이드 화면은 Tailwind가 동적 클래스명을 생성할 수 없으므로 `style={{background: 'var(--raw-...)'}}` 형태를 허용한다. 일반 UI는 생성된 유틸리티 클래스를 사용한다.

## 8. 변경 절차

1. `tokens.json`에서 값을 수정하거나 의미 있는 토큰을 추가한다.
2. `yarn tokens`를 실행한다.
3. `/component-guide`의 원시 색상·시맨틱 색상·타이포그래피·효과 페이지에서 생성 결과와 사용처를 확인한다.
4. 컴포넌트 스타일 변경이면 해당 컴포넌트 가이드도 함께 최신화한다.
5. `yarn verify`를 통과시킨다.

## 퍼블리싱 체크리스트

- [ ] 색상·간격·라운드·크기·그림자·타이포그래피가 토큰 또는 기존 유틸리티를 사용하는가?
- [ ] 시맨틱 색상으로 표현할 수 있는 값을 Primitive 팔레트로 직접 표현하지 않았는가?
- [ ] light/dark 색상을 사용처에서 중복 분기하지 않았는가?
- [ ] `typo-*`와 같은 속성의 유틸리티가 충돌하지 않는가?
- [ ] spacing은 base 배수이고 radius·size·shadow는 정의된 토큰인가?
- [ ] 공통 페이지 그리드는 `grid-layout`, 콘텐츠 폭은 `max-w-content`를 사용하는가?
- [ ] `tokens.css`를 직접 수정하지 않았는가?
- [ ] 컴포넌트 가이드와 수동 명도 대비 검수를 완료했는가?
