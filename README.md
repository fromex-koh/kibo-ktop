# kibo-ktop — 퍼블리싱 가이드

이 프로젝트는 **프론트엔드 퍼블리싱 가이드 프로젝트**다.
Next.js · TypeScript · TailwindCSS 환경에서 **웹 접근성(KWCAG 2.1)** 을 준수하는
마크업·스타일·컴포넌트 작성 기준을 코드와 문서로 정의하고, 실제 예시로 보여준다.

> 목적: 팀이 일관된 규칙으로 접근성 있는 화면을 퍼블리싱하도록 기준(코딩 규칙·린트·체크리스트)을 제공한다.

## ⚠️ 클론/포크 후 첫 실행 — 꼭 읽어주세요

**설치 직후 `yarn dev` 또는 `yarn build` 를 실행하세요.**

```bash
yarn install
yarn dev        # ← 실행 전에 디자인 토큰 CSS를 자동 생성합니다
```

**왜 그런가요?** 디자인 토큰 CSS는 명령 실행 시 자동으로 만들어지는 파일이며 git 에 올라가지 않습니다.

| 자동 생성 파일       | 무엇                                      | 만드는 명령   |
| -------------------- | ----------------------------------------- | ------------- |
| `src/app/tokens.css` | 디자인 토큰(색·타이포·간격·그리드…) → CSS | `yarn tokens` |

`yarn dev`·`yarn build`는 실행 직전에 `yarn tokens`를 자동으로 실행합니다. `src/content/asset-versions.generated.json`은 GitHub Actions가 릴리스할 때 확정해 커밋하는 파일이므로 클론·Vercel 빌드에서 다시 만들지 않습니다.

> `src/app/tokens.css`가 없는 최초 클론에서는 `yarn dev` 또는 `yarn build`를 먼저 실행하면 됩니다.

### 이 프로젝트를 포크해 화면/컴포넌트를 가져갈 때

- **버전을 맞추세요** — Next 16 · React 19 · TailwindCSS 4 기준입니다. 낮은 버전에선 API 가 달라 동작이 다를 수 있습니다(특히 Tailwind v4 는 설정을 CSS 로 합니다 — `tailwind.config.js` 없음).
- **디자인 값은 `tokens.json` 단일 소스** — 컴포넌트가 쓰는 `bg-primary`·`text-foreground`·`rounded-md`·`.grid-layout` 등은 전부 `tokens.json → yarn tokens → src/app/tokens.css` 로 생성됩니다. **이 파이프라인(`tokens.json`·`scripts/build-tokens.mjs`·`globals.css`·`postcss.config.mjs`)을 함께 가져가야** className 이 살아 있습니다.
- **오픈소스 고지를 함께 옮기세요** — 컴포넌트와 `package.json`을 이식할 때 [`THIRD_PARTY_LICENSES.md`](THIRD_PARTY_LICENSES.md)도 함께 전달합니다. Pretendard를 가져가면 폰트 옆의 `src/app/fonts/LICENSE-PRETENDARD.txt`도 유지합니다.
- **브레이크포인트** — **Tailwind 기본 프리픽스**(`sm:`/`md:`/`lg:`/`xl:`/`2xl:`)를 그대로 씁니다(모바일 퍼스트). 프로젝트 주 티어는 `md:`(768)·`xl:`(1280) 두 단계이며 새 코드는 이 둘을 우선 사용합니다. (기본을 지우지 않아 shadcn·익숙한 유틸이 그대로 동작합니다.)
- **컴포넌트 폴더 구조(레이어)** — 화면·도메인 코드는 `ui/`·`composite/`·`custom/` 를 직접 import 한다. 스타일 수정은 `theme/` 에서만.
    - `src/components/ui/` — shadcn 셸(vendored). 구조·동작·접근성은 **손대지 않음**. 재스킨한 컴포넌트만 cva 를 `theme/` 로 추출(수정 셸).
    - `src/components/theme/` — 프로젝트 스타일(`<name>.variants.ts`, cva). **재스킨의 유일한 작업 장소**(게이트 전체 적용).
    - `src/components/composite/` — `ui` 를 **조합**한 도메인 컴포넌트(header · section-header · sidebar-layout · theme-toggle 등).
    - `src/components/custom/` — 프리미티브 **미사용 자체 구현**(icon · publishing-index · 차트류), 화면 전용 요소(hero-section · stack-pager 등)와 가이드/데모 전용 요소(code-block · copy-chip · guide-page-shell 등)도 여기 둔다.
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

| 명령                         | 설명                                                  |
| ---------------------------- | ----------------------------------------------------- |
| `yarn dev`                   | 개발 서버 실행(`predev`에서 토큰 생성)                |
| `yarn build`                 | 프로덕션 빌드(`prebuild`에서 토큰 생성)               |
| `yarn start`                 | 빌드 결과 실행                                        |
| `yarn tokens`                | `tokens.json` → `src/app/tokens.css` 생성             |
| `yarn license-notices`       | 운영 의존성·로컬 폰트의 제3자 라이선스 고지 생성      |
| `yarn license-notices:check` | 제3자 라이선스 고지가 현재 의존성과 같은지 검사       |
| `yarn asset-versions`        | 릴리스 버전을 받아 자산 메타데이터 생성(Actions 전용) |
| `yarn lint`                  | ESLint 검사(접근성 포함)                              |
| `yarn format`                | Prettier 포맷 적용                                    |
| `yarn format:check`          | Prettier 포맷 검사                                    |
| `yarn check:conventions`     | Tailwind/className 프로젝트 컨벤션 검사               |
| `yarn typecheck`             | TypeScript 타입 검사                                  |
| `yarn verify`                | push 전 통합 게이트(tokens·lint·format·type 등)       |

## 환경 변수

실제 값이 담긴 `.env.local` 은 **git에 커밋되지 않는다**(`.gitignore`). 필요한 변수 목록은
**`.env.example` 에 커밋되어 함께 전달**되므로, 이를 복사해 값을 채운다.

```bash
cp .env.example .env.local   # 복사 후 실제 값 입력
```

| 변수                   | 필수    | 설명                                                                                                                 |
| ---------------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | 배포 시 | 사이트 절대 URL. 메타데이터(OG)·`robots.txt`·canonical 의 절대경로 생성에 사용. 미설정 시 `https://example.com` 폴백 |

> 변수를 추가·변경하면 **반드시 `.env.example` 에도 반영**한다(개발팀 공유 소스). 실제 값은 각자 `.env.local`·배포 환경에 설정한다.

## 프로젝트 구조

포크해서 실운영 개발을 이어갈 때, **반드시 참고·버전관리해야 하는 소스 오브 트루스**와 **편집하면 안 되는 자동 생성물**을 구분한다.

```
# ── 소스 오브 트루스 (반드시 참고 · 버전관리 대상) ──
tokens.json                  # 디자인 값 단일 소스(색·타이포·간격·라운드·그림자·그리드·브레이크포인트)
THIRD_PARTY_LICENSES.md       # 운영 의존성·번들 폰트의 제3자 저작권/라이선스 고지
docs/                        # 컨벤션 5종 — 작업 규칙의 기준(아래 "문서")
src/
  app/                       # App Router (layout·page·globals.css) + fonts/(로컬 폰트)
  components/                # ui(+theme) → composite → custom → guide 레이어(위 "포크…" 참고)
  content/                   # 화면·홈·퍼블리싱 인덱스 데이터(JSON 단일 소스) + 타입가드
  constants/                 # 사이트 상수·아이콘 레지스트리·가이드 네비
  lib/ · hooks/              # cn 유틸 · use-mobile 등
scripts/                     # 토큰 생성·릴리스 자산버전·컨벤션 검사
public/                      # 정적 에셋
next.config.ts · tsconfig.json · eslint.config.mjs · .prettierrc.cjs
postcss.config.mjs · components.json · .husky/       # 빌드·린트·포맷·shadcn·git 훅 설정

# ── 생성물 (직접 편집 금지) ──
src/app/tokens.css                          # git 미추적 · yarn dev/build 전 자동 생성
src/content/asset-versions.generated.json   # git 추적 · GitHub Actions 릴리스 커밋에서 생성
```

### 유지보수자 파일 맵

화면·스타일·원본 기준선을 수정할 때 아래 책임 경계를 먼저 확인한다.

| 경로                                         | 책임                                  | 변경 기준                                                               |
| -------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------- |
| `src/app/page.tsx`                           | 시작 페이지 조합                      | 프로젝트 카드·Badge·링크·퍼블리싱 인덱스 배치만 수정                    |
| `src/content/home.json`                      | 시작 페이지 텍스트·아이콘·링크 데이터 | 화면 문구나 링크 변경 시 우선 수정                                      |
| `src/components/ui/`                         | shadcn primitive 셸                   | 구조·props·동작·접근성은 원본 유지; 스타일은 theme import만 허용        |
| `src/components/theme/`                      | 프로젝트 전용 CVA·스타일 토큰         | 디자인 스타일 변경의 유일한 작업 위치                                   |
| `src/components/composite/`                  | primitive 조합 컴포넌트               | 여러 primitive를 조합하거나 프로젝트 기능을 확장할 때 수정              |
| `src/components/custom/publishing-index.tsx` | 퍼블리싱 인덱스 화면 전용 표현·필터   | 시작 페이지 인덱스 UI와 필터 동작 수정                                  |
| `src/content/publishing-index.json`          | 퍼블리싱 인덱스 화면·상태·버전 데이터 | 인덱스 행이나 상태 변경 시 수정                                         |
| `src/app/component-guide/(guide)/`           | 컴포넌트 가이드·사용 예시             | 컴포넌트 API·스타일 변경 시 가이드도 함께 갱신                          |
| `vendor/shadcn-baseline/`                    | shadcn 바닐라 CVA 기준선              | 앱에서 import하지 않으며 업스트림 비교용으로만 갱신                     |
| `tokens.json`                                | 디자인 토큰 원본                      | 색상·간격·타이포·효과 변경 시 직접 수정 후 토큰 생성                    |
| `THIRD_PARTY_LICENSES.md`                    | 제3자 라이선스 통합 고지              | 의존성 변경 후 `yarn license-notices`로 갱신하고 인계·배포 시 함께 유지 |

## 문서

프로젝트의 기준은 `docs/` 에 정의되어 있으며, 작업 시 항상 준수한다.
**우선순위: 코드 컨벤션(개발 표준) > 접근성 > 퍼블리싱 컨벤션** (충돌 시 위쪽을 따른다).

- **[docs/CODE_CONVENTION.md](docs/CODE_CONVENTION.md)** — 개발 표준 코드 컨벤션(개발자 기준, **최우선**).
  첨부 표준 원문만 반영한 ST/NA/NC/MD/CD 규칙. 내용 변경은 컨벤션 검사에서 차단한다.
- **[docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md)** — 웹 접근성(KWCAG 2.1) 코딩 규칙.
  4원칙·13지침·24검사항목을 마크업/스타일 관점으로 정리한 규칙·예시·PR 체크리스트.
- **[docs/PUBLISHING_CONVENTION.md](docs/PUBLISHING_CONVENTION.md)** — 퍼블리싱/디자인 토큰 컨벤션.
  색상·타이포(`typo-*`)·간격·라운드·그림자·브레이크포인트·레이아웃 그리드·스크롤바 토큰 사용 규칙(PB-01~16)과 PR 체크리스트.
- **[docs/SHADCN.md](docs/SHADCN.md)** — shadcn/ui 통합 규칙.
  원본 셸 보존, 프로젝트 theme 분리, arbitrary value 예외, 컴포넌트 추가·업데이트 방법.
- **[docs/GIT_CONVENTION.md](docs/GIT_CONVENTION.md)** — Git 브랜치 전략 & 커밋 메시지 컨벤션.
  현재(1인 작업)와 향후(팀 합류 시) 브랜치 전략, Conventional Commits 기반 커밋 메시지 포맷·예시.

## 디자인 토큰과 컴포넌트

- 디자인 값은 `tokens.json`을 수정한 뒤 `yarn tokens`로 생성한다. 생성물 `src/app/tokens.css`는 직접 수정하지 않는다.
- 토큰·반응형·그리드·스크롤바의 상세 규칙은 [PUBLISHING_CONVENTION.md](docs/PUBLISHING_CONVENTION.md)를 따른다.
- shadcn 셸·theme·바닐라 CVA의 책임과 업데이트 절차는 [SHADCN.md](docs/SHADCN.md)를 따른다.
- 실제 토큰과 컴포넌트 렌더링은 `/component-guide`에서 확인한다.

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

## 검색 노출 차단 (내부용)

내부 전용 서비스이므로 검색엔진 색인을 차단한다.

- `noindex, nofollow` 메타 태그 + `X-Robots-Tag` 응답 헤더 (전 경로) — [layout.tsx](src/app/layout.tsx) · [next.config.ts](next.config.ts)
- `robots.txt` 전면 차단(`Disallow: /`), sitemap 미제공 — [robots.ts](src/app/robots.ts)

> ⚠️ 위는 **규칙을 지키는 검색엔진**의 색인만 막을 뿐, **접근 자체를 차단하지는 않는다.**
> 외부 노출이 없어야 한다면 사내망/VPN·IP 허용목록·인증 게이트 등 **접근 제어**를 별도로 적용해야 한다.
