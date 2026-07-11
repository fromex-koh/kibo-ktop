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
- **디자인 값은 `tokens.json` 단일 소스** — 컴포넌트가 쓰는 `bg-brand`·`text-foreground`·`rounded-md`·`.grid-layout` 등은 전부 `tokens.json → yarn tokens → src/app/tokens.css` 로 생성됩니다. **이 파이프라인(`tokens.json`·`scripts/build-tokens.mjs`·`globals.css`·`postcss.config.mjs`)을 함께 가져가야** className 이 살아 있습니다.
- **브레이크포인트** — **Tailwind 기본 프리픽스**(`sm:`/`md:`/`lg:`/`xl:`/`2xl:`)를 그대로 씁니다(모바일 퍼스트). 프로젝트 주 티어는 `md:`(768)·`xl:`(1280) 두 단계이며 새 코드는 이 둘을 우선 사용합니다. (기본을 지우지 않아 shadcn·익숙한 유틸이 그대로 동작합니다.)
- **재사용 컴포넌트는 `src/components/` 루트**, 가이드/데모 전용은 `src/components/guide/` 에 있습니다.

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

| 명령          | 설명                      |
| ------------- | ------------------------- |
| `yarn dev`    | 개발 서버 실행            |
| `yarn build`  | 프로덕션 빌드             |
| `yarn start`  | 빌드 결과 실행            |
| `yarn lint`   | ESLint 검사 (접근성 포함) |
| `yarn format` | Prettier 포맷 적용        |

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

```
src/app/          # App Router (layout, page, globals.css)
  └─ fonts/       # 로컬 폰트 파일 (PretendardVariable.woff2)
public/           # 정적 에셋
docs/
  ├─ ACCESSIBILITY.md          # KWCAG 2.1 코딩 규칙 (24개 검사항목) — 퍼블리싱 핵심 기준
  ├─ CODE_CONVENTION.md        # 프론트엔드 표준 코드 컨벤션 (ST/NA/NC/MD/CD)
  ├─ PUBLISHING_CONVENTION.md  # 퍼블리싱/디자인 토큰 컨벤션 (PB-01~16)
  ├─ SHADCN.md                 # shadcn/ui 통합 규칙 (styled copy 패턴, SC-01~04)
  └─ GIT_CONVENTION.md         # Git 브랜치 전략 & 커밋 메시지 컨벤션
eslint.config.mjs # 린트 설정
.prettierrc.json  # Prettier 포맷 규칙
```

## 문서

프로젝트의 기준은 `docs/` 에 정의되어 있으며, 작업 시 항상 준수한다.
**우선순위: 코드 컨벤션(개발 표준) > 접근성 > 퍼블리싱 컨벤션** (충돌 시 위쪽을 따른다).

- **[docs/CODE_CONVENTION.md](docs/CODE_CONVENTION.md)** — 프론트엔드 표준 코드 컨벤션(개발자 기준, **최우선**).
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
- **스크롤바**(두께·색)도 토큰 기반이다 — 두께 `size.scrollbar-w`(6px), 색 `semantic.scroll-thumb`/`scroll-track`(gray 스케일 참조라 다크 자동 반사). `html`에 `scrollbar-gutter: stable` 로 레이아웃 시프트를 방지한다. (규칙: `PB-16`, `system-guide` 프로젝트와 동일 구조)

    > **참고 — 데스크톱에서 폭을 360px로 줄이면 콘텐츠 폭이 6px 작게 보입니다(예: 322 vs 328).** 버그가 아닙니다. `scrollbar-gutter: stable` 이 스크롤바 자리(6px)를 항상 예약하는데, **데스크톱은 클래식 스크롤바(6px 차지)**라 그만큼 빠지고(콘텐츠 354 → 그리드 컨테이너 322), **실제 스마트폰·DevTools 기기 모드는 오버레이 스크롤바(0px)**라 안 빠져(360 → 328) 스펙값 328이 나옵니다. **실제 모바일 값은 328**이므로, 모바일 폭 확인은 브라우저 창 축소가 아니라 **DevTools 기기 모드(또는 실제 기기)**로 하세요. 예약된 6px는 스크롤바가 생겼다 사라질 때 레이아웃이 흔들리지 않게 하는 의도된 여백입니다.

## 컴포넌트 (shadcn/ui)

버튼·인풋·다이얼로그 등 기본 UI 는 **shadcn/ui** 를 쓴다. 커스터마이즈는 **styled copy 패턴**으로 한다 — 한 컴포넌트를 **두 파일**로 나눠, 원본은 바닐라로 보존하고 스타일만 복사본에서 바꾼다.

```
src/components/ui/button.tsx   ← ① 원본 (npx shadcn add 그대로, 손대지 않음)
                                    · 동작 · 접근성 · 라이브러리 업데이트 담당
        │  그대로 복사, 스타일(cva)만 교체
        ▼
src/components/button.tsx      ← ② 복사본 (styled copy, 화면이 실제 import)
                                    · 원본과 유일한 차이 = buttonVariants(스타일) 뿐
```

- **책임 분리** — _스타일은 복사본, 그 외 전부(동작·접근성·업데이트)는 원본._
- **왜** — 원본을 안 건드리니 라이브러리 업데이트 시 원본만 다시 받고 **셸 변경분만** 복사본에 옮기면 된다(스타일은 그대로 유지, 머지 충돌 최소화). 색·사이즈를 전면 재스킨하는 경우 `cn` 덧칠은 `twMerge` 한계로 충돌하므로 "복사 후 cva 교체"가 안전하다.
- **화면·도메인 코드는 복사본(`@/components/button`)을 import** 한다(`@/components/ui/*` 직접 사용 금지).
- 규칙·적용법 전체: **[docs/SHADCN.md](docs/SHADCN.md)** 의 `styled copy 패턴`·`[SC-04]`.
- 렌더 확인 페이지: `/shadcn-test`, 토큰·컴포넌트 가이드: `/component-guide`.

### 이 패턴이 근거 있는 방식인 이유 (출처)

이 방식은 임의로 만든 규칙이 아니라, **디자인 커스터마이즈가 많은 프로젝트에서 널리 쓰이는 정착된 패턴**이다. 두 가지 업계 관행을 결합한 것이다 — ① 원본(base)은 손대지 않고 커스터마이즈는 별도 파일에 둔다, ② **수정 폭이 큰 컴포넌트는 소스를 복사해 별도 컴포넌트로 fork** 한다.

- **[GOV.UK Design System — Extending and modifying components](https://design-system.service.gov.uk/get-started/extending-and-modifying-components/)** (영국 정부 공식 디자인 시스템) — 대규모 수정 시 원본을 고치지 말고 **소스를 복사해 새 컴포넌트로 만들 것**을 명시:
    > "If you need to make a large modification to a component you should fork it entirely by copying and pasting the source code to create a new component."
    > ("복사본"이 라이브러리 업데이트로 깨질 위험을 없앤다는 근거까지 같은 문서에 설명됨 — 우리 방식의 핵심 이유와 동일.)
- **[shadcn/ui — Best practices for customizing (GitHub Discussion #9754)](https://github.com/shadcn-ui/ui/discussions/9754)** — base `components/ui/` 는 **원형 그대로 두고**(“overwrite it from the registry anytime”) 커스터마이즈는 wrapper/복사본에 두는 **wrapper pattern** 을 권장.
- **[shadcn/ui — 대규모 프로덕션 디자인 시스템 구조 (GitHub Discussion #9756)](https://github.com/shadcn-ui/ui/discussions/9756)** — 큰 규모에서 `ui/`(원형) · 커스텀 레이어 · 조합 레이어를 **분리**하는 구조 논의.
- **[Vercel Academy — Extending shadcn/ui with Custom Components](https://vercel.com/academy/shadcn-ui/extending-shadcn-ui-with-custom-components)** (shadcn 개발사 Vercel의 공식 학습 자료) — primitive 를 **깨끗하게 유지**하고 커스텀은 wrapper 컴포넌트로 확장.
- **[MUI Design System — Wrapping vs. Global Overrides](https://blog.bitsrc.io/creating-a-mui-design-system-wrapping-vs-global-overrides-31800117dbd7)** — 확장 가능한 디자인 시스템에는 전역 override 보다 **wrapping(감싸기/복사) 방식**이 권장된다는, shadcn 밖(MUI) 사례.

> 요약: "원본 보존 + 커스텀 분리"는 주류 권장이고, **전면 재스킨(heavy customization)에는 소스를 복사하는 fork 방식이 표준**이다. 우리 styled copy 는 이 둘을 그대로 따른 것이다.

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
