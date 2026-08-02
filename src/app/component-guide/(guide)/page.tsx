import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {SectionHeader, SectionHeaderDescription, SectionHeaderTitle} from '@/components/composite/section-header'
import CodeBlock from '@/components/custom/code-block'

export const metadata: Metadata = {
    title: {absolute: '컴포넌트 가이드'},
}

const START_LINKS = [
    {
        href: '/component-guide/color',
        title: 'Primitive 토큰',
        description: '색상과 폰트의 원시 값, 단계와 생성 규칙을 확인합니다.',
    },
    {
        href: '/component-guide/semantic-color',
        title: 'Semantic 토큰',
        description: '역할 기반 색상과 반응형 타이포그래피를 화면에 적용합니다.',
    },
    {
        href: '/component-guide/breakpoint',
        title: '레이아웃 토큰',
        description: '브레이크포인트, 그리드, 간격과 쌓임 순서를 확인합니다.',
    },
    {
        href: '/component-guide/button',
        title: '공통 컴포넌트',
        description: 'variant, size, 상태와 실제 조합 예시를 확인합니다.',
    },
]

const ARCHITECTURE = [
    ['ui', '기본 구조·동작·접근성을 제공하는 primitive'],
    ['theme', '프로젝트 variant와 상태별 스타일'],
    ['composite', 'primitive를 조합한 공통 UI와 프로젝트 API'],
    ['custom', '프로젝트 고유 기능을 가진 UI'],
]

const TRANSFER_TREE = `kibo-ktop/
├── tokens.json                         # 디자인 토큰 단일 원본
├── package.json                        # 실행·빌드 의존성과 프로젝트 명령
├── yarn.lock                           # 검증된 의존성 버전 고정
├── THIRD_PARTY_LICENSES.md             # 사용 중인 오픈소스 저작권·라이선스 고지
├── .env.example                        # 사이트·저장소·API 환경변수 작성 기준
├── .gitignore                          # 빌드 결과·로컬 환경변수 등 추적 제외
├── .prettierrc.cjs                     # 프로젝트 코드 포맷 규칙
├── .prettierignore                     # 포맷 검사 제외 경로
├── eslint.config.mjs                   # 코드 품질·접근성 검사 규칙
├── tsconfig.json                       # TypeScript와 @/*·@tokens·@public 별칭
├── next.config.ts                      # Next.js 이미지·빌드 설정
├── postcss.config.mjs                  # Tailwind CSS v4 빌드 연결
├── components.json                    # shadcn 스타일·CSS 경로·alias 설정
├── scripts/
│   ├── build-tokens.mjs                # tokens.json → tokens.css 생성
│   ├── build-screen-registry.mjs       # 페이지 경로 상태 데이터 생성
│   ├── generate-third-party-licenses.mjs # 오픈소스 라이선스 고지 생성·검사
│   └── check-conventions.mjs           # 프로젝트 컴포넌트 작성 규칙 검사
├── public/                             # 화면이 참조하는 이미지·아이콘·정적 파일
├── vendor/
│   └── shadcn-baseline/                # 프로젝트 variant와 비교할 shadcn 원본 기준선
└── src/
    ├── app/
    │   ├── layout.tsx                  # 전역 CSS·폰트·ThemeProvider 연결
    │   ├── page.tsx                    # 프로젝트 시작 페이지
    │   ├── globals.css                 # Tailwind·토큰·전역 variant 진입점
    │   ├── tokens.css                  # 생성 파일 — 복사하지 않고 다시 생성
    │   ├── manifest.ts                 # 웹 앱 메타데이터
    │   ├── robots.ts                   # 검색 엔진 크롤링 정책
    │   ├── favicon.ico                 # 브라우저 파비콘
    │   ├── icon.svg                    # 기본 앱 아이콘
    │   ├── apple-icon.png              # Apple 기기 앱 아이콘
    │   ├── fonts/
    │   │   ├── PretendardVariable.woff2 # 프로젝트 기본 웹폰트
    │   │   └── LICENSE-PRETENDARD.txt  # Pretendard 저작권·라이선스 고지
    │   ├── component-guide/            # 컴포넌트 가이드와 화면 예시 전체
    │   ├── corp/                       # 기업용 프로젝트 페이지
    │   └── org/                        # 기관용 프로젝트 페이지
    ├── components/
    │   ├── ui/                         # primitive 구조·동작·접근성
    │   ├── theme/                      # variant·size·상태별 프로젝트 스타일
    │   ├── composite/                  # primitive를 조합한 공통 컴포넌트
    │   ├── custom/                     # 프로젝트 고유 컴포넌트
    │   ├── guide/                      # 가이드 페이지 전용 표현 컴포넌트
    │   └── theme-provider.tsx          # 라이트·다크 테마 상태와 저장소 연결
    ├── hooks/
    │   ├── use-mobile.ts               # Sidebar의 모바일 구간 판별
    │   └── use-theme-toggle.ts         # Header·ThemeToggle의 테마 전환
    ├── constants/
    │   ├── field-focus.ts              # 폼 오류 발생 시 포커스 이동 기준
    │   ├── guide-nav.ts                # 컴포넌트 가이드 사이드바 구조
    │   ├── icon-registry.ts            # 프로젝트 아이콘 등록 정보
    │   ├── self-diagnosis.ts           # 자가진단 화면 공통 설정
    │   ├── site.ts                     # 사이트명·URL·메타데이터 상수
    │   └── theme.ts                    # 테마 이름·저장소 키·경로 상수
    ├── content/                        # 페이지 문구·현황·생성 데이터와 타입
    ├── types/
    │   └── cytoscape-fcose.d.ts        # 그래프 레이아웃 플러그인 타입 선언
    └── lib/
        └── utils.ts                    # cn 등 공통 유틸리티`

const WORKFLOW = [
    {
        number: 1,
        title: '기존 항목 확인',
        description: '사이드바에서 필요한 토큰이나 컴포넌트를 먼저 찾고 API와 상태 예시를 확인합니다.',
    },
    {
        number: 2,
        title: '시맨틱 값 적용',
        description: '화면에서는 raw 값보다 역할이 드러나는 시맨틱 유틸리티와 컴포넌트 variant를 사용합니다.',
    },
    {
        number: 3,
        title: '상태와 화면 크기 확인',
        description: '키보드 포커스, disabled, 오류, 다크 모드와 mobile·tablet·PC 구간을 확인합니다.',
    },
    {
        number: 4,
        title: '변경 사항 검증',
        description: '토큰이나 API 변경 후 관련 가이드를 함께 갱신하고 yarn verify를 실행합니다.',
    },
]

const ComponentGuidePage = () => (
    <div className="max-w-content mx-auto flex w-full flex-col gap-10 px-6 py-12 md:py-16">
        <header className="flex flex-col gap-3">
            <h1 className="typo-display-s-bold text-foreground text-balance">컴포넌트 가이드</h1>
            <p className="typo-body-xl-regular text-foreground-subtle max-w-3xl text-pretty">
                디자인 토큰과 공통 컴포넌트의 실제 구현 기준을 확인합니다. 필요한 항목을 찾고, 적용 가능한 API와 상태를
                검증하는 문서입니다.
            </p>
        </header>

        <section aria-labelledby="guide-map-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="guide-map-title">가이드 탐색</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        기초 값에서 화면 구현으로 이어지는 순서입니다. 전체 문서는 사이드바에서 항목별로 이동할 수
                        있습니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <div className="grid gap-4 md:grid-cols-2">
                    {START_LINKS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="border-border hover:border-primary focus-visible:ring-ring flex flex-col gap-2 rounded-xl border p-5 transition-colors outline-none focus-visible:ring-2"
                        >
                            <h3 className="typo-body-l-medium text-primary">{item.title}</h3>
                            <p className="text-foreground-subtle">{item.description}</p>
                        </Link>
                    ))}
                </div>
            </BaseCard>
        </section>

        <section aria-labelledby="application-flow-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="application-flow-title">화면 적용 흐름</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        새로운 값을 바로 추가하기 전에 기존 토큰과 컴포넌트로 표현할 수 있는지 확인합니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <ol className="grid gap-4 md:grid-cols-2">
                    {WORKFLOW.map((item) => (
                        <li key={item.number} className="border-border flex items-start gap-3 rounded-xl border p-5">
                            <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                                {item.number}
                            </span>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-foreground font-semibold">{item.title}</h3>
                                <p className="text-foreground-subtle">{item.description}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </BaseCard>
        </section>

        <section aria-labelledby="token-source-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="token-source-title">토큰 변경 흐름</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        <code className="text-foreground font-mono">tokens.json</code>이 디자인 값의 단일 원본입니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <div className="bg-muted text-foreground overflow-x-auto rounded-md p-4 text-center font-mono text-sm font-semibold">
                    tokens.json → scripts/build-tokens.mjs → src/app/tokens.css → globals.css
                </div>
                <ul className="text-foreground-subtle mt-5 flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code className="text-foreground font-mono">src/app/tokens.css</code>는 생성 파일이므로 직접
                        수정하지 않습니다.
                    </li>
                    <li>
                        토큰을 변경하면 <code className="text-foreground font-mono">yarn tokens</code>로 CSS를 다시
                        생성합니다.
                    </li>
                    <li>색상은 Primitive에서 값을 정의하고 Semantic에서 역할을 연결합니다.</li>
                    <li>타이포그래피는 mobile·tablet·PC 값을 분리하고 각 구간에서 시맨틱 토큰으로 적용합니다.</li>
                </ul>
            </BaseCard>
        </section>

        <section aria-labelledby="architecture-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="architecture-title">컴포넌트 계층</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        구조와 접근성은 기반 계층에 두고, 프로젝트 스타일과 조합 책임을 분리합니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {ARCHITECTURE.map(([name, description]) => (
                        <div key={name} className="border-border flex flex-col gap-2 rounded-xl border p-5">
                            <h3 className="typo-body-l-medium text-foreground font-mono">{name}</h3>
                            <p className="text-foreground-subtle">{description}</p>
                        </div>
                    ))}
                </div>
                <p className="bg-muted text-foreground mt-4 overflow-x-auto rounded-md p-4 text-center font-mono font-semibold">
                    tokens → theme + ui → composite / custom → screen
                </p>
            </BaseCard>
        </section>

        <section aria-labelledby="transfer-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="transfer-title">다른 저장소로 이식</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        이 프로젝트의 모든 컴포넌트와 페이지를 다른 저장소에서 동일하게 실행하려면 아래 소스, 설정,
                        토큰과 에셋을 하나의 세트로 이식합니다.
                    </SectionHeaderDescription>
                </SectionHeader>

                <CodeBlock code={TRANSFER_TREE} language="bash" />

                <div className="bg-muted mt-6 rounded-md p-4">
                    <h3 className="text-foreground font-semibold">대상 저장소에서 연결</h3>
                    <ol className="text-foreground-subtle mt-2 flex list-decimal flex-col gap-2 pl-5">
                        <li>
                            대상 저장소의 기존 설정과 충돌을 확인한 뒤{' '}
                            <code className="text-foreground font-mono">package.json</code>,{' '}
                            <code className="text-foreground font-mono">tsconfig.json</code>,{' '}
                            <code className="text-foreground font-mono">postcss.config.mjs</code>와{' '}
                            <code className="text-foreground font-mono">components.json</code>을 병합합니다.
                        </li>
                        <li>
                            <code className="text-foreground font-mono">@/*</code>와{' '}
                            <code className="text-foreground font-mono">@tokens</code> 별칭, 전역 CSS import와 루트{' '}
                            <code className="text-foreground font-mono">ThemeProvider</code> 연결을 유지합니다.
                        </li>
                        <li>
                            의존성을 설치하고 <code className="text-foreground font-mono">yarn tokens</code>와{' '}
                            <code className="text-foreground font-mono">yarn screen-registry</code>를 실행합니다.
                        </li>
                        <li>
                            <code className="text-foreground font-mono">yarn build</code>로 모든 페이지의 빌드와 타입을
                            확인한 뒤 실제 경로를 로드합니다.
                        </li>
                    </ol>
                </div>

                <p className="border-border text-foreground-subtle mt-6 border-t pt-5">
                    <code className="text-foreground font-mono">src/app/component-guide/</code>는 가이드 페이지 실행에,
                    그 외 <code className="text-foreground font-mono">src/app/</code> 경로는 프로젝트 페이지 실행에
                    필요합니다. 모든 페이지를 그대로 로드하는 기준에서는 둘 다 복사합니다.{' '}
                    <code className="text-foreground font-mono">.github/workflows/</code>와 Git 릴리스 스크립트는 화면
                    실행과 무관하므로 이식 대상에서 제외합니다.
                </p>
            </BaseCard>
        </section>

        <section aria-labelledby="verification-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="verification-title">변경 후 확인</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        컴포넌트 API나 토큰을 변경하면 사용처와 관련 가이드 예시를 같은 작업에서 갱신합니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border-border rounded-xl border p-5">
                        <h3 className="text-foreground font-semibold">코드 검사</h3>
                        <p className="text-foreground-subtle mt-2">
                            <code className="text-foreground font-mono">yarn verify</code>로 토큰 생성, lint, format,
                            convention과 TypeScript 검사를 실행합니다.
                        </p>
                    </div>
                    <div className="border-border rounded-xl border p-5">
                        <h3 className="text-foreground font-semibold">화면 검사</h3>
                        <p className="text-foreground-subtle mt-2">
                            mobile·tablet·PC, 라이트·다크 테마, 키보드 탐색과 주요 상태를 실제 화면에서 확인합니다.
                        </p>
                    </div>
                </div>
            </BaseCard>
        </section>
    </div>
)

export default ComponentGuidePage
