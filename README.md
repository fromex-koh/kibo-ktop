# kibo-ktop — 기술평가 통합 플랫폼 퍼블리싱

기술평가 통합 플랫폼(기업·기관)의 **서비스 화면 퍼블리싱**과, 그 기준이 되는 **디자인 토큰·컴포넌트 가이드**를 함께 담은 저장소입니다.
서비스 화면(기업·기관)은 웹 접근성(KWCAG 2.1)을 기준으로 작업합니다.

| 경로                               | 내용                                               |
| ---------------------------------- | -------------------------------------------------- |
| `/`                                | 시작 페이지 · 퍼블리싱 인덱스(화면 목록·상태·버전) |
| `/corp/…` · `/org/…`               | 기업 · 기관 서비스 화면                            |
| `/component-guide`                 | 토큰 · 컴포넌트 가이드                             |
| `/component-guide/release-archive` | 첫 버전부터의 버전 업데이트 기록                   |

## 시작하기

```bash
yarn install
cp .env.example .env.local   # 값은 아래 "환경 변수" 참고
yarn dev                     # http://localhost:3000
```

`yarn dev` · `yarn build` 는 실행 직전에 디자인 토큰 CSS(`src/app/tokens.css`)와 화면 목록을 자동 생성합니다. 토큰 CSS 는 git 에 올라가지 않으므로, 클론 직후에는 둘 중 하나를 먼저 실행합니다.

## 기술 스택

| 구분       | 사용 기술                                                        |
| ---------- | ---------------------------------------------------------------- |
| 프레임워크 | Next.js 16 (App Router) · React 19                               |
| 언어       | TypeScript 5 (strict)                                            |
| 스타일     | TailwindCSS 4 (설정은 CSS 로 — `tailwind.config.js` 없음)        |
| 컴포넌트   | shadcn/ui (radix-ui) · Recharts · lucide-react                   |
| 검사       | ESLint 9 + `eslint-plugin-jsx-a11y` · Prettier · Nu Html Checker |
| 패키지     | Yarn 1.x                                                         |
| 폰트       | Pretendard (로컬 가변 폰트 서브셋, `next/font/local`)            |

## 브랜치

| 브랜치             | 역할                                                          |
| ------------------ | ------------------------------------------------------------- |
| `work`             | 퍼블리싱 작업 브랜치. 일상 커밋은 여기서 합니다               |
| `main`             | 안정 브랜치. `work` 머지로만 갱신하며, push 하면 릴리스됩니다 |
| `frontend-handoff` | 프론트엔드 개발 전달용. 검증된 실행 가능한 소스만 담습니다    |

`main` 에 push 하면 GitHub Actions 가 검증 후 버전 태그(`vX.Y.Z`)와 릴리스 커밋을 만듭니다. 절차와 커밋 메시지 규칙은 [GIT_CONVENTION.md](docs/GIT_CONVENTION.md)를 따릅니다.

## 스크립트

| 명령                                | 설명                                                |
| ----------------------------------- | --------------------------------------------------- |
| `yarn dev`                          | 개발 서버                                           |
| `yarn build` · `yarn start`         | 프로덕션 빌드 · 실행                                |
| `yarn verify`                       | push 전 통합 검사(아래 항목을 순서대로 실행)        |
| `yarn tokens`                       | `tokens.json` → `src/app/tokens.css` 생성           |
| `yarn lint`                         | ESLint(접근성 포함)                                 |
| `yarn format` · `yarn format:check` | Prettier 적용 · 검사                                |
| `yarn check:conventions`            | Tailwind/className 컨벤션 검사                      |
| `yarn typecheck`                    | 타입 검사                                           |
| `yarn license-notices`              | 제3자 라이선스 고지(`THIRD_PARTY_LICENSES.md`) 갱신 |
| `yarn audit:accessibility`          | 전체 화면 W3C 마크업 검사                           |
| `yarn frontend-handoff`             | 전달본 생성                                         |
| `yarn asset-versions`               | 릴리스 메타데이터 생성(GitHub Actions 전용)         |

`git push` 때 `yarn verify` 가 자동 실행되고, 실패하면 push 가 거부됩니다.

## 환경 변수

`.env.example` 을 `.env.local` 로 복사해 값을 채웁니다. `.env.local` 은 git 에 올라가지 않습니다.

| 변수                         | 설명                                                                         |
| ---------------------------- | ---------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`       | 사이트 절대 URL(메타데이터·robots). 미설정 시 `https://kibo-ktop.vercel.app` |
| `NEXT_PUBLIC_REPOSITORY_URL` | 퍼블리싱 인덱스에 표시할 저장소 URL. 미설정 시 예시 저장소                   |

변수를 추가·변경하면 `.env.example` 에도 반영합니다.

## 폴더 구조

```
tokens.json                 # 디자인 값 단일 원본
docs/                       # 컨벤션 문서(아래 "문서")
scripts/                    # 토큰 생성 · 컨벤션 검사 · 접근성 검사 · 릴리스 · 전달본 생성
vendor/shadcn-baseline/     # 수정한 shadcn 셸의 원본 스타일 기준선(앱에서 import 하지 않음)
handoff/                    # 전달본용 사이트 설정 원본
public/                     # 정적 에셋
src/
  app/
    (user-type)/            # 기업(corp) · 기관(org) 서비스 화면
    component-guide/        # 가이드 문서((guide)) · 완성 화면 데모((demo))
    page.tsx                # 시작 페이지 · 퍼블리싱 인덱스
    globals.css · fonts/    # 전역 스타일 · 로컬 폰트
  components/
    ui/                     # shadcn/ui 셸 — 구조 · 동작 · 접근성은 고치지 않습니다
    theme/                  # ui 부품의 프로젝트 스타일 — 모양은 여기서만 고칩니다
    composite/              # shadcn/ui 부품을 합성한 공통 컴포넌트
    custom/                 # 한 화면 · 한 업무를 위해 직접 만든 컴포넌트
  content/                  # 서비스 화면 목업 데이터 · 퍼블리싱 인덱스 데이터(JSON)
  constants/ · lib/ · hooks/
```

### 직접 고치지 않는 생성 파일

| 파일                                                    | 만드는 곳                             |
| ------------------------------------------------------- | ------------------------------------- |
| `src/app/tokens.css`                                    | `yarn tokens` (git 미추적)            |
| `src/content/publishing-guide/*.generated.json`         | 릴리스 때 GitHub Actions 가 생성·커밋 |
| `src/content/publishing-guide/accessibility-audit.json` | `yarn audit:accessibility`            |
| `THIRD_PARTY_LICENSES.md`                               | `yarn license-notices`                |

## 작업 기준

- **디자인 값** — `tokens.json` 을 고치고 `yarn tokens` 를 실행합니다. 색 · 간격 · 타이포를 Hex 나 px 로 직접 쓰지 않습니다.
- **컴포넌트** — 기본 UI 는 shadcn/ui 컴포넌트를 씁니다. 모양은 `theme/` 에서, 기능 확장은 `composite/` 에서 합니다.
- **반응형** — Tailwind 기본 브레이크포인트를 쓰며, 주 구간은 `md:`(768) · `xl:`(1280) 입니다.
- **가이드 동기화** — 토큰 · 컴포넌트를 바꾸면 `/component-guide` 의 해당 문서도 함께 고칩니다.
- **릴리스 노트** — 프론트엔드에 전달할 변경은 `RELEASE_NOTES_DRAFT.md` 에 적습니다. 릴리스 때 버전 업데이트 목록에 반영됩니다.

## 문서

충돌하면 위쪽 문서를 따릅니다.

1. [CODE_CONVENTION.md](docs/CODE_CONVENTION.md) — 개발 표준(최우선)
2. [ACCESSIBILITY.md](docs/ACCESSIBILITY.md) — 웹 접근성(KWCAG 2.1) 규칙과 체크리스트
3. [PUBLISHING_CONVENTION.md](docs/PUBLISHING_CONVENTION.md) — 디자인 토큰 · 스타일 사용 규칙
4. [SHADCN.md](docs/SHADCN.md) — shadcn/ui 셸 보존 · theme 분리 · 추가/업데이트 절차

별도 축: [GIT_CONVENTION.md](docs/GIT_CONVENTION.md) — 브랜치 · 커밋 · 버전 · 자동 검사.

접근성 검사에서 외부 라이브러리 때문에 나오는 메시지와 그 근거는 `/component-guide/accessibility-exceptions` 에 정리되어 있습니다.

## 프론트엔드 전달

`frontend-handoff` 브랜치는 `yarn frontend-handoff` 로 만든 전달본입니다. 제작·검수 도구(`docs/` · `.github/` · 린트 설정 · 대부분의 `scripts/`)는 빼고, 화면 · 컴포넌트 · 가이드 · 토큰 생성 환경을 담습니다. 전달 범위와 흐름은 `/component-guide` 의 "다른 저장소로 이식"에서 확인합니다.

컴포넌트를 다른 저장소로 옮길 때는 다음을 함께 가져갑니다.

- 토큰 파이프라인: `tokens.json` · `scripts/build-tokens.mjs` · `src/app/globals.css` · `postcss.config.mjs`
- 라이선스 고지: `THIRD_PARTY_LICENSES.md` · `src/app/fonts/LICENSE-PRETENDARD.txt`

## 검색 노출 차단

내부용 서비스라 검색엔진 색인을 막습니다(`noindex` 메타 · `X-Robots-Tag` 헤더 · `robots.txt` 전면 차단).
색인만 막을 뿐 접근 자체를 막지는 않으므로, 외부 노출이 없어야 하면 사내망 · 인증 등 접근 제어를 따로 적용합니다.
