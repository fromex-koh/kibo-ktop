# kibo-ktop — 퍼블리싱 가이드

이 프로젝트는 **프론트엔드 퍼블리싱 가이드 프로젝트**다.
Next.js · TypeScript · TailwindCSS 환경에서 **웹 접근성(KWCAG 2.1)** 을 준수하는
마크업·스타일·컴포넌트 작성 기준을 코드와 문서로 정의하고, 실제 예시로 보여준다.

> 목적: 팀이 일관된 규칙으로 접근성 있는 화면을 퍼블리싱하도록 기준(코딩 규칙·린트·체크리스트)을 제공한다.

## ⚠️ 클론/포크 후 첫 실행 — 꼭 읽어주세요

**설치 직후 반드시 `yarn dev` 또는 `yarn build` 를 한 번 먼저 실행하세요.**

```bash
yarn install
yarn dev        # ← 이 첫 실행이 자동 생성 파일을 만들어 줍니다
```

**왜 그런가요?** 이 프로젝트는 명령 실행 시 **자동으로 만들어지는 파일**이 있고, 이 파일들은 git 에 올라가지 않습니다(자동 생성물이라).

| 자동 생성 파일                              | 무엇                                      | 만드는 명령           |
| ------------------------------------------- | ----------------------------------------- | --------------------- |
| `src/app/tokens.css`                        | 디자인 토큰(색·타이포·간격·그리드…) → CSS | `yarn tokens`         |
| `src/content/asset-versions.generated.json` | 자산별 버전 데이터                        | `yarn asset-versions` |

`yarn dev`·`yarn build` 는 실행 직전에 위 두 명령을 **자동으로 먼저 돌려**(package.json 의 `predev`/`prebuild`) 파일을 만들어 줍니다. 그래서 **정상 개발/빌드 흐름에서는 아무 문제가 없습니다.**

> **딱 하나 주의:** 갓 클론한 뒤 `yarn dev`/`yarn build` 를 **한 번도 안 돌린 상태**에서 `yarn typecheck`·`yarn lint` 만 먼저 실행하면, 위 자동 생성 파일이 아직 없어 **에러가 납니다.** → 클론하면 그냥 `yarn install` → `yarn dev`(또는 `yarn build`) 순서로 시작하면 끝입니다. 한 번 실행한 뒤로는 무엇을 돌려도 됩니다.

### 이 프로젝트를 포크해 화면/컴포넌트를 가져갈 때

- **버전을 맞추세요** — Next 16 · React 19 · TailwindCSS 4 기준입니다. 낮은 버전에선 API 가 달라 동작이 다를 수 있습니다(특히 Tailwind v4 는 설정을 CSS 로 합니다 — `tailwind.config.js` 없음).
- **디자인 값은 `tokens.json` 단일 소스** — 컴포넌트가 쓰는 `bg-primary`·`text-foreground`·`rounded-md`·`.grid-layout` 등은 전부 `tokens.json → yarn tokens → src/app/tokens.css` 로 생성됩니다. **이 파이프라인(`tokens.json`·`scripts/build-tokens.mjs`·`globals.css`·`postcss.config.mjs`)을 함께 가져가야** className 이 살아 있습니다.
- **브레이크포인트** — **Tailwind 기본 프리픽스**(`sm:`/`md:`/`lg:`/`xl:`/`2xl:`)를 그대로 씁니다(모바일 퍼스트). 프로젝트 주 티어는 `md:`(768)·`xl:`(1280) 두 단계이며 새 코드는 이 둘을 우선 사용합니다. (기본을 지우지 않아 shadcn·익숙한 유틸이 그대로 동작합니다.)
- **컴포넌트 폴더 구조(레이어)** — 화면·도메인 코드는 `ui/`·`composite/`·`custom/` 를 직접 import 한다. 스타일 수정은 `theme/` 에서만.
    - `src/components/ui/` — shadcn 셸(vendored). 구조·동작·접근성은 **손대지 않음**. 재스킨한 컴포넌트만 cva 를 `theme/` 로 추출(수정 셸).
    - `src/components/theme/` — 프로젝트 스타일(`<name>.variants.ts`, cva). **재스킨의 유일한 작업 장소**(게이트 전체 적용).
    - `src/components/composite/` — `ui` 를 **조합**한 도메인 컴포넌트(header · section-header · sidebar-layout · theme-toggle 등).
    - `src/components/custom/` — 프리미티브 **미사용 자체 구현**(icon · publishing-index).
    - `src/components/guide/` — 컴포넌트 가이드/데모 전용(code-block · copy-chip · guide-page-shell 등).
    - `src/components/theme-provider.tsx` — next-themes provider 래퍼(루트).
    - `vendor/shadcn-baseline/` — cva 추출 시 밀려난 **바닐라 cva 보관소**(업데이트 diff 기준선, 앱에서 import 금지).

## 기술 스택

| 구분         | 사용 기술                                         |
| ------------ | ------------------------------------------------- |
| 프레임워크   | Next.js 16 (App Router)                           |
| 언어         | TypeScript 5 (strict)                             |
| 패키지매니저 | Yarn 1.x                                          |
| 스타일       | TailwindCSS 4                                     |
| 아이콘       | lucide-react                                      |
| 린트         | ESLint 9 (flat config) + `eslint-plugin-jsx-a11y` |
| 포맷터       | Prettier (+ `prettier-plugin-tailwindcss`)        |
| 폰트         | Pretendard (로컬 가변 폰트, `next/font/local`)    |

## 시작하기

```bash
yarn install                # 의존성 설치
cp .env.example .env.local  # 환경변수 템플릿 복사 → 값 입력 (아래 "환경 변수" 참고)
yarn dev                    # 개발 서버 (http://localhost:3000)
```

시작점: `src/app/page.tsx`

## 스크립트

| 명령                     | 설명                                                  |
| ------------------------ | ----------------------------------------------------- |
| `yarn dev`               | 개발 서버 실행(`predev`에서 토큰·자산 버전 생성)      |
| `yarn build`             | 프로덕션 빌드(`prebuild`에서 토큰·자산 버전 생성)     |
| `yarn start`             | 빌드 결과 실행                                        |
| `yarn tokens`            | `tokens.json` → `src/app/tokens.css` 생성             |
| `yarn asset-versions`    | git 히스토리 기준 자산 버전 생성                      |
| `yarn lint`              | ESLint 검사(접근성 포함)                              |
| `yarn format`            | Prettier 포맷 적용                                    |
| `yarn format:check`      | Prettier 포맷 검사                                    |
| `yarn check:conventions` | Tailwind/className 프로젝트 컨벤션 검사               |
| `yarn typecheck`         | TypeScript 타입 검사                                  |
| `yarn verify`            | push 전 통합 게이트(tokens·asset·lint·format·type 등) |

## 환경 변수

실제 값이 담긴 `.env.local` 은 **git에 커밋되지 않는다**(`.gitignore`). 필요한 변수 목록은
**`.env.example` 에 커밋되어 함께 전달**되므로, 이를 복사해 값을 채운다.

```bash
cp .env.example .env.local   # 복사 후 실제 값 입력
```

| 변수                   | 필수    | 설명                                                                                                                   |
| ---------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | 배포 시 | 사이트 절대 URL. 메타데이터(OG)·`robots.txt`·canonical 의 절대경로 생성에 사용. 미설정 시 `http://localhost:3000` 폴백 |

> 변수를 추가·변경하면 **반드시 `.env.example` 에도 반영**한다(개발팀 공유 소스). 실제 값은 각자 `.env.local`·배포 환경에 설정한다.

## 프로젝트 구조

포크해서 실운영 개발을 이어갈 때, **반드시 참고·버전관리해야 하는 소스 오브 트루스**와 **편집하면 안 되는 자동 생성물**을 구분한다.

```
# ── 소스 오브 트루스 (반드시 참고 · 버전관리 대상) ──
tokens.json                  # 디자인 값 단일 소스(색·타이포·간격·라운드·그림자·그리드·브레이크포인트)
docs/                        # 컨벤션 5종 — 작업 규칙의 기준(아래 "문서")
src/
  app/                       # App Router (layout·page·globals.css) + fonts/(로컬 폰트)
  components/                # ui(+theme) → composite → custom → guide 레이어(위 "포크…" 참고)
  content/                   # 화면·홈·퍼블리싱 인덱스 데이터(JSON 단일 소스) + 타입가드
  constants/                 # 사이트 상수·아이콘 레지스트리·가이드 네비
  lib/ · hooks/              # cn 유틸 · use-mobile 등
scripts/                     # 토큰 생성·자산버전·컨벤션 검사·git 버전 주입
public/                      # 정적 에셋
next.config.ts · tsconfig.json · eslint.config.mjs · .prettierrc.cjs
postcss.config.mjs · components.json · .husky/       # 빌드·린트·포맷·shadcn·git 훅 설정

# ── 자동 생성물 (편집 금지 · 버전관리 X, 첫 yarn dev/build 가 생성) ──
src/app/tokens.css                          # ← tokens.json + yarn tokens
src/content/asset-versions.generated.json   # ← yarn asset-versions
```

### 유지보수자 파일 맵

화면·스타일·원본 기준선을 수정할 때 아래 책임 경계를 먼저 확인한다.

| 경로                                         | 책임                                  | 변경 기준                                                        |
| -------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------- |
| `src/app/page.tsx`                           | 시작 페이지 조합                      | 프로젝트 카드·Badge·링크·퍼블리싱 인덱스 배치만 수정             |
| `src/content/home.json`                      | 시작 페이지 텍스트·아이콘·링크 데이터 | 화면 문구나 링크 변경 시 우선 수정                               |
| `src/components/ui/`                         | shadcn primitive 셸                   | 구조·props·동작·접근성은 원본 유지; 스타일은 theme import만 허용 |
| `src/components/theme/`                      | 프로젝트 전용 CVA·스타일 토큰         | 디자인 스타일 변경의 유일한 작업 위치                            |
| `src/components/composite/`                  | primitive 조합 컴포넌트               | 여러 primitive를 조합하거나 프로젝트 기능을 확장할 때 수정       |
| `src/components/custom/publishing-index.tsx` | 퍼블리싱 인덱스 화면 전용 표현·필터   | 시작 페이지 인덱스 UI와 필터 동작 수정                           |
| `src/content/publishing-index.json`          | 퍼블리싱 인덱스 화면·상태·버전 데이터 | 인덱스 행이나 상태 변경 시 수정                                  |
| `src/app/component-guide/(guide)/`           | 컴포넌트 가이드·사용 예시             | 컴포넌트 API·스타일 변경 시 가이드도 함께 갱신                   |
| `vendor/shadcn-baseline/`                    | shadcn 바닐라 CVA 기준선              | 앱에서 import하지 않으며 업스트림 비교용으로만 갱신              |
| `tokens.json`                                | 디자인 토큰 원본                      | 색상·간격·타이포·효과 변경 시 직접 수정 후 토큰 생성             |

## 문서

프로젝트의 기준은 `docs/` 에 정의되어 있으며, 작업 시 항상 준수한다.
**우선순위: 코드 컨벤션(개발 표준) > 접근성 > 퍼블리싱 컨벤션** (충돌 시 위쪽을 따른다).

- **[docs/CODE_CONVENTION.md](docs/CODE_CONVENTION.md)** — 개발 표준 코드 컨벤션(개발자 기준, **최우선**).
  `any`/`as` 금지·네이밍·Arrow Function·시맨틱 색상 토큰 등 ST/NA/NC/MD/CD 규칙과 PR 체크리스트.
- **[docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md)** — 웹 접근성(KWCAG 2.1) 코딩 규칙.
  4원칙·13지침·24검사항목을 마크업/스타일 관점으로 정리한 규칙·예시·PR 체크리스트.
- **[docs/PUBLISHING_CONVENTION.md](docs/PUBLISHING_CONVENTION.md)** — 퍼블리싱/디자인 토큰 컨벤션.
  색상·타이포(`typo-*`)·간격·라운드·그림자·브레이크포인트·레이아웃 그리드·스크롤바 토큰 사용 규칙(PB-01~16)과 PR 체크리스트.
- **[docs/SHADCN.md](docs/SHADCN.md)** — shadcn/ui 통합 규칙.
  원본은 바닐라로 보존하고 스타일만 복사본에서 바꾸는 **styled copy 패턴**(SC-01~04), 테마 슬롯·컴포넌트 추가법.
- **[docs/GIT_CONVENTION.md](docs/GIT_CONVENTION.md)** — Git 브랜치 전략 & 커밋 메시지 컨벤션.
  현재(1인 작업)와 향후(팀 합류 시) 브랜치 전략, Conventional Commits 기반 커밋 메시지 포맷·예시.

> 위 문서들은 `CLAUDE.md`(→ `AGENTS.md` 경유)로 로드되어 작업 시 자동 적용된다.

## 디자인 토큰

색상·타이포·간격·라운드·그림자는 **`tokens.json` 단일 소스**에서 생성한다(px 입력 → rem 출력).

```bash
yarn tokens   # tokens.json(px) 수정 후 실행 (yarn dev/build 시 자동)
```

- 생성물 `src/app/tokens.css`(자동)를 `globals.css` 가 `@import` → 색상 `bg-*`·타이포 `typo-*`·간격 `p-*`/`gap-*`·`rounded-*`·`shadow-*` 로 사용. 전체 목록은 가이드 화면 `/component-guide` 에서 확인.
- **⚠️ 현재 spacing·radius·size·shadow·typography 값은 디자인 확정 전 임시(placeholder)** 다. 확정되면 `tokens.json` 을 실제 값으로 교체한다(불규칙 스케일도 그대로 정의 가능).
- **간격**은 `spacingBase`(현재 4px)의 **정수 배수**로 제어한다 — `p-4`(16px)·`gap-6`(24px) 등, **base 하나만 바꾸면 전체 간격이 비율대로 조정**된다. **라운드·크기·그림자는 정의된 토큰 키만** 쓴다(미정의는 Tailwind 기본이 나감). (규칙: [docs/PUBLISHING_CONVENTION.md](docs/PUBLISHING_CONVENTION.md) `PB-13`)
- **브레이크포인트**는 **Tailwind 기본**(`sm:`/`md:`/`lg:`/`xl:`/`2xl:`)을 그대로 쓴다(모바일 퍼스트). 프로젝트 주 티어는 **`md:` 768 · `xl:` 1280** 두 단계로, 그리드·타이포 전환이 이 두 폭을 기준으로 한다(`tokens.json` 의 `breakpoint` = grid·typo 티어 데이터). 생성기가 기본을 지우지 않아 `sm:`~`2xl:` 가 모두 동작하고(shadcn·익숙한 유틸의 silent no-op 방지), 콘텐츠 영역은 고정폭 대신 **`max-w-content`**(1200px)로 제한한다. (규칙: `PB-14`)
- **레이아웃 그리드**(컬럼 수·거터·마진)도 `tokens.json`(`grid`, 브레이크포인트별)에서 관리하며, `.grid-layout` 클래스 하나로 적용한다(모바일 4열 → `md` 8열 → `xl` 12열). `grid` 키는 `breakpoint`와 1:1 대응해야 하며 어긋나면 빌드가 실패한다. (규칙: `PB-15`)
- **스크롤바**(두께·색)도 토큰 기반이다 — 두께 `size.scrollbar-w`(6px), 색 `semantic.scroll-thumb`/`scroll-track`(gray 스케일 참조라 다크 자동 반사). `html`에 `scrollbar-gutter: stable` 을 두어 스크롤바가 생겼다 사라질 때 콘텐츠가 좌우로 흔들리지 않게 한다. 상세 정책은 [docs/PUBLISHING_CONVENTION.md](docs/PUBLISHING_CONVENTION.md) `PB-16` 참고.

    > 참고: 데스크톱 창을 직접 줄여 폭을 재면 클래식 스크롤바 자리(6px) 때문에 DevTools 기기 모드보다 콘텐츠 폭이 6px 작게 보일 수 있다. 모바일 폭 검수는 DevTools 기기 모드 또는 실제 기기 기준으로 한다.

## 컴포넌트 (shadcn/ui)

버튼·인풋·다이얼로그 등 기본 UI 는 **shadcn/ui** 를 쓴다. **셸과 스타일을 파일로 분리**한다 — 셸(구조·동작·접근성)은 업스트림 원형을 유지하고, 프로젝트 스타일(cva)은 `theme/` 에서만 관리한다.

```
src/components/ui/<name>.tsx              ← 셸 (업스트림 원형 — 동작·접근성·업데이트 담당)
                                              · 기본은 npx shadcn add 순정 그대로
                                              · 재스킨한 컴포넌트만 cva → theme import 한 줄로 교체
        │ import {xxxVariants} from '@/components/theme/<name>.variants'
        ▼
src/components/theme/<name>.variants.ts   ← 프로젝트 스타일 (cva — 재스킨의 유일한 작업 장소)
        ▼ (추출 시 밀려난 바닐라 cva 는)
vendor/shadcn-baseline/<name>.variants.ts ← 바닐라 cva 보관소 (업데이트 diff 기준선)
```

- **책임 분리** — _스타일은 theme, 그 외 전부(구조·동작·접근성·업데이트)는 ui 셸 = 업스트림._
- **⚠️ 순정 파일은 코드 컨벤션·게이트에서 면제한다.** 대상은 `ui/` 중 순정 셸(theme import 없음 — 게이트가 자동 판별) + `src/lib/utils.ts`(cn) + `src/hooks/use-mobile.ts` + `vendor/`. shadcn 업데이트 시 **diff 가 업스트림 변경분만** 남아 확인·반영이 쉽도록 하기 위함이다. cva 를 추출한 **수정 셸은 검사 대상**이다(포맷만 업스트림 2-space 유지). 순정 코드의 `as`·기본 팔레트·2-space 는 버그가 아니라 의도다 → [docs/CODE_CONVENTION.md](docs/CODE_CONVENTION.md) 상단 예외 참고.
- **왜(분리)** — 셸이 업스트림과 거의 같으니(차이는 theme import 한 줄) 라이브러리 업데이트 시 새로 받아 `git diff` 하면 업스트림 변경분이 그대로 보인다. 색·사이즈를 전면 재스킨하는 경우 `cn` 덧칠은 `twMerge` 한계로 충돌할 수 있어 "cva 교체"가 안전하다.
- **스타일 전략** — shadcn 표준 슬롯(`bg-primary`, `text-primary-foreground`, `border-input`, `ring-ring` 등)으로 표현 가능한 값은 theme 에서도 그대로 쓴다. 다만 Figma 가 shadcn 원본의 opacity 표현(`hover:bg-primary/80` 등)과 다른 **solid token** 을 정의한 상태는 프로젝트 토큰을 남기고, 코드 근처에 `PROJECT-STYLE:` 주석으로 표시한다.
- **화면·도메인 코드는 `@/components/ui/<name>` 을 직접 import** 한다(별도 창구 레이어 없음).
- 재스킨이 필요 없으면 순정 셸 그대로 쓰고, 필요해지면 그때 cva 를 theme 로 추출하면 사용처는 안 바뀐다.
- 규칙·적용법 전체: **[docs/SHADCN.md](docs/SHADCN.md)** 의 `셸·스타일 분리 패턴`·`[SC-02]/[SC-04]`.
- 토큰·컴포넌트 렌더 확인: `/component-guide`.

### 이 설계의 의도

이 프로젝트의 목표는 theme 를 독립적인 별도 디자인 시스템으로 키우는 것이 아니라, **가능한 스타일을 shadcn 표준 슬롯으로 되돌리는 것**이다. 그래서 기본/공유 상태는 `bg-primary`·`text-primary-foreground` 같은 슬롯을 우선 쓰고, 디자인 토큰이 shadcn 원본 유틸과 실제로 다를 때만 `PROJECT-STYLE:` 예외로 남긴다.

예를 들어 Button hover 는 shadcn 원본의 `hover:bg-primary/80` 과 달리 Figma 가 `brand/blue/600` solid 로 정의했기 때문에 wrapper override 대신 `bg-primary-hover` 를 쓰는 theme cva 로 유지한다. 이 편이 원본 primitive 를 보존하면서도 디자인 값을 정확히 지키는 가장 예측 가능한 방식이다.

근거와 운영 규칙은 [docs/SHADCN.md](docs/SHADCN.md)의 `셸·스타일 분리 패턴`·`PROJECT-STYLE 주석 포맷`을 기준으로 한다.

> **구조 변천** — 과거 `ui/`(순정)+`kit/`(styled copy·facade 창구) 2중 레이어였으나 2026-07 에 현재 구조로
> 통합했다(커밋 `3316ff8`). 오래된 자료의 `kit/` 언급은 `theme/`(스타일)·`ui/` 직접 import 로 읽으면 된다.

## 폰트

- **Pretendard** 를 로컬 가변 폰트로 사용한다 (CDN 미사용).
- 폰트 파일: `src/app/fonts/PretendardVariable.woff2` — **서브셋** (한글 완성형 전체 + Latin + 문서용 기호, weight 100~900). 원본 2.1MB → **약 1.7MB**.

### 적용 방식

1. `next/font/local` 로 폰트를 로드하고 CSS 변수 `--font-pretendard` 로 노출한다. ([layout.tsx](src/app/layout.tsx))
    ```tsx
    const pretendard = localFont({
        src: './fonts/PretendardVariable.woff2',
        display: 'swap',
        weight: '100 900',
        variable: '--font-pretendard',
    })
    ```
2. `globals.css` 의 `--font-sans` 에 위 변수 + 한글 폴백을 연결한다. → Tailwind `font-sans` 유틸리티가 이를 사용.
3. `<body>` 에 `font-sans` 적용 → 전역 기본 서체가 된다.

- 폴백: `Apple SD Gothic Neo`, `Malgun Gothic`, `system-ui`.

> 서브셋 재생성: `pyftsubset` 로 유니코드 범위를 지정해 다시 만들 수 있다(한글 완성형 `U+AC00-D7A3` 유지 권장).

## 퍼블리싱 기준

이 프로젝트가 정의하는 퍼블리싱 규칙은 다음과 같이 구성된다.

- **웹 접근성 (KWCAG 2.1)** — 4원칙·13지침·24검사항목 전체를 코딩 규칙으로 정리.
  규칙·예시·PR 체크리스트는 [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) 참고.

    > **기준: KWCAG 2.1** — 공공기관 프로젝트로, 국내 웹 접근성 의무의 기술 기준은
    > 국제 표준(WCAG)이 아니라 **국가표준 KWCAG**다. 본 프로젝트는 요구 기준에 따라 **2.1**(2015)을 적용한다.
    > 「디지털포용법」(2026.1.22 시행)·「장애인차별금지법」 등에 따라 공공기관은 준수 의무가 있다.

- **마크업** — 시맨틱 태그 우선, 논리적 헤딩 계층, 랜드마크(`header`/`nav`/`main`/`footer`) 사용.
- **스타일** — TailwindCSS 유틸리티 기반, 명도 대비·포커스 표시 등 접근성 스타일 준수.
- **자동 검사** — `yarn lint`가 대체 텍스트, 레이블 연결, 키보드 대응 등 접근성 위반 상당수를 검출.
- **색상 대비** — light/dark 컬러 정합 작업 중이라 토큰 생성기의 대비 게이트는 현재 임시 비활성화되어 있다. 재활성 전까지 실제 대비는 수동 검수한다.

### 근거

- [KWCAG 2.1 지침 (한국형 웹 콘텐츠 접근성 지침 2.1)](https://websoul.co.kr/accessibility/WA_guide21.asp)
- [디지털포용법 (국가법령정보센터) — 웹 접근성 품질인증의 현행 법적 근거(제21조)](https://www.law.go.kr/법령/디지털포용법)
- [장애인차별금지 및 권리구제 등에 관한 법률 (국가법령정보센터)](https://www.law.go.kr/법령/장애인차별금지및권리구제등에관한법률)
- [웹 접근성 품질마크(인증) 제도 안내 (문화체육관광부)](https://www.mcst.go.kr/site/s_etc/webAccess/accessibility.jsp)

## 한계 (자동 검사로 못 잡는 항목)

정적 분석은 접근성 문제의 일부만 잡는다. 아래는 **수동 점검**이 필요하다.

- 명도 대비(색상값), 실제 대체 텍스트의 적절성, 실제 자막 유무
- CSS/Tailwind 스타일 오류(ESLint는 CSS를 검사하지 않음)
- 키보드 전체 흐름, 스크린리더 확인

## 검색 노출 차단 (내부용)

내부 전용 서비스이므로 검색엔진 색인을 차단한다.

- `noindex, nofollow` 메타 태그 + `X-Robots-Tag` 응답 헤더 (전 경로) — [layout.tsx](src/app/layout.tsx) · [next.config.ts](next.config.ts)
- `robots.txt` 전면 차단(`Disallow: /`), sitemap 미제공 — [robots.ts](src/app/robots.ts)

> ⚠️ 위는 **규칙을 지키는 검색엔진**의 색인만 막을 뿐, **접근 자체를 차단하지는 않는다.**
> 외부 노출이 없어야 한다면 사내망/VPN·IP 허용목록·인증 게이트 등 **접근 제어**를 별도로 적용해야 한다.
