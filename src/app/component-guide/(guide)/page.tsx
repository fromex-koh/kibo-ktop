import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {BaseCard} from '@/components/composite/base-card'
import {SectionHeader, SectionHeaderDescription, SectionHeaderTitle} from '@/components/composite/section-header'

export const metadata: Metadata = {
    // layout 의 template('%s · 컴포넌트 가이드')과 겹치지 않도록 개요는 단독 제목을 쓴다.
    title: {absolute: '컴포넌트 가이드'},
}

const REQUIRED_PATHS = [
    {
        path: 'src/components/ui/',
        description: 'shadcn primitive와 프로젝트 스타일이 연결된 기본 컴포넌트',
    },
    {
        path: 'src/components/theme/',
        description: '컴포넌트별 프로젝트 variant와 상태 스타일',
    },
    {
        path: 'src/components/composite/',
        description: 'primitive를 조합한 프로젝트 공통 컴포넌트',
    },
    {
        path: 'src/components/custom/',
        description: '프로젝트 고유 기능을 가진 컴포넌트 중 실제 화면에서 사용할 항목',
    },
    {
        path: 'src/components/theme-provider.tsx · src/constants/theme.ts',
        description: '라이트·다크 테마 Provider와 저장소 키 등 테마 공통 상수',
    },
    {
        path: 'src/lib/utils.ts · src/hooks/use-mobile.ts',
        description: 'className 병합과 반응형 동작에 필요한 공통 코드',
    },
]

const PIPELINE_PATHS = [
    {
        path: 'tokens.json',
        description: '원시·시맨틱 디자인 토큰의 단일 원본',
    },
    {
        path: 'scripts/build-tokens.mjs',
        description: 'tokens.json을 Tailwind CSS 변수와 유틸리티로 변환하는 생성기',
    },
    {
        path: 'src/app/globals.css',
        description: 'Tailwind, 생성 토큰, 전역 base·utility 규칙의 진입점',
    },
    {
        path: 'postcss.config.mjs',
        description: 'Tailwind CSS v4 PostCSS 파이프라인 설정',
    },
]

const REPOSITORY_ONLY_PATHS = [
    {
        path: '.github/workflows/release-main.yml',
        description: '이 퍼블리싱 저장소의 work → main 공유와 자동 패치 태그 생성에만 사용하는 워크플로',
    },
    {
        path: 'scripts/git-info.mjs · scripts/compute-asset-versions.mjs',
        description: '시작 페이지의 현재 버전과 프론트엔드 인계 자산 반영 버전을 계산하는 저장소용 스크립트',
    },
    {
        path: 'src/content/publishing-index.json',
        description: '이 저장소의 퍼블리싱 진행 현황과 인계 자산 목록을 표시하기 위한 문서 데이터',
    },
    {
        path: 'src/content/asset-versions.generated.json',
        description: 'Git 이력에서 생성되는 인계 자산 버전 산출물로, 컴포넌트 실행에는 필요하지 않음',
    },
]

const CORE_PRINCIPLES = [
    {
        title: '토큰 우선',
        description: '색상·간격·타이포그래피는 tokens.json과 시맨틱 유틸리티를 우선 사용합니다.',
    },
    {
        title: 'primitive 보존',
        description: 'shadcn primitive의 구조·동작·접근성은 유지하고 프로젝트 스타일 책임을 분리합니다.',
    },
    {
        title: '접근성 기본값',
        description: '키보드 탐색, 접근 가능한 이름, 폼 레이블과 상태 전달을 컴포넌트 기본 품질로 관리합니다.',
    },
    {
        title: '가이드 동기화',
        description: '컴포넌트 API나 스타일이 변경되면 실제 상태와 사용 예시를 가이드에 함께 반영합니다.',
    },
]

const TECH_STACK = [
    ['Framework', 'Next.js 16.2 · App Router'],
    ['Language', 'TypeScript 5 · strict'],
    ['UI', 'React 19.2 · shadcn/ui · Radix UI · Base UI'],
    ['Style', 'Tailwind CSS 4 · CVA · 디자인 토큰'],
    ['Quality', 'ESLint · jsx-a11y · Prettier · TypeScript'],
    ['Package', 'Yarn 1.x'],
]

const IntegrationStep = ({number, title, children}: {number: number; title: string; children: ReactNode}) => (
    <li className="flex items-start gap-3">
        <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold">
            {number}
        </span>
        <div className="flex flex-col gap-1">
            <strong className="text-foreground">{title}</strong>
            <div className="text-foreground-subtle">{children}</div>
        </div>
    </li>
)

const PathList = ({items}: {items: typeof REQUIRED_PATHS}) => (
    <dl className="divide-border divide-y">
        {items.map((item) => (
            <div
                key={item.path}
                className="grid gap-1 py-3 first:pt-0 last:pb-0 md:grid-cols-[minmax(14rem,0.8fr)_1.2fr] md:gap-6"
            >
                <dt>
                    <code className="text-primary font-mono text-sm font-semibold">{item.path}</code>
                </dt>
                <dd className="text-foreground-subtle">{item.description}</dd>
            </div>
        ))}
    </dl>
)

const ComponentGuidePage = () => (
    <div className="max-w-content mx-auto flex w-full flex-col gap-10 px-6 py-12 md:py-16">
        <header className="flex flex-col gap-3">
            <h1 className="typo-display-m-bold text-foreground text-balance">컴포넌트 가이드</h1>
            <p className="typo-body-xl-regular text-foreground-subtle max-w-3xl">
                프로젝트의 디자인 토큰, UI 설계 원칙과 공통 컴포넌트 사용법을 확인하는 기준 문서입니다.
            </p>
        </header>

        <section className="flex flex-col gap-6" aria-labelledby="project-introduction-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="project-introduction-title">프로젝트 소개</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        Next.js와 Tailwind CSS 환경에서 일관된 디자인과 웹 접근성을 갖춘 화면을 구현하기 위한 퍼블리싱
                        가이드 프로젝트입니다.
                        <br />
                        디자인 값을 토큰으로 관리하고, shadcn 기반 공통 컴포넌트와 실제 사용 예시를 함께 제공합니다.
                        다음 작업자는 가이드에서 컴포넌트의 variant·size·상태·폼 동작을 확인한 뒤 화면을 조합할 수
                        있습니다.
                    </SectionHeaderDescription>
                </SectionHeader>
            </BaseCard>
        </section>

        <section className="flex flex-col gap-6" aria-labelledby="core-principles-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="core-principles-title">핵심 원칙</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        컴포넌트를 추가하거나 수정할 때 아래 기준을 우선합니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <div className="grid gap-4 md:grid-cols-2">
                    {CORE_PRINCIPLES.map((principle) => (
                        <div key={principle.title} className="border-border flex flex-col gap-2 rounded-xl border p-5">
                            <h3 className="typo-body-l-medium text-foreground">{principle.title}</h3>
                            <p className="text-foreground-subtle">{principle.description}</p>
                        </div>
                    ))}
                </div>
            </BaseCard>
        </section>

        <section className="flex flex-col gap-6" aria-labelledby="technology-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="technology-title">기술 스택</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        컴포넌트와 토큰 파이프라인이 동작하는 기준 환경입니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <dl className="grid gap-x-8 gap-y-4 md:grid-cols-2">
                    {TECH_STACK.map(([category, value]) => (
                        <div key={category} className="border-border flex flex-col gap-1 border-b pb-3">
                            <dt className="text-foreground font-semibold">{category}</dt>
                            <dd className="text-foreground-subtle">{value}</dd>
                        </div>
                    ))}
                </dl>
            </BaseCard>
        </section>

        <section className="flex flex-col gap-6" aria-labelledby="project-structure-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="project-structure-title">프로젝트 구조</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        컴포넌트 개발과 스타일 관리에 직접 관련된 주요 경로입니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <pre className="bg-muted text-foreground overflow-x-auto rounded-md p-4 font-mono text-sm leading-relaxed">
                    <code>{`kibo-ktop/
├── tokens.json                  # 디자인 토큰 단일 원본
├── scripts/
│   └── build-tokens.mjs         # 토큰 CSS 생성기
├── src/
│   ├── app/                     # App Router·전역 CSS·폰트
│   ├── components/
│   │   ├── ui/                  # shadcn primitive 셸
│   │   ├── theme/               # 프로젝트 variant·상태 스타일
│   │   ├── composite/           # primitive 조합 컴포넌트
│   │   ├── custom/              # 프로젝트 고유 컴포넌트
│   │   └── guide/               # 가이드 전용 표현 컴포넌트
│   ├── constants/               # 테마·사이트 등 공통 상수
│   ├── hooks/                   # 공통 React hooks
│   └── lib/                     # cn 등 공통 유틸리티
└── vendor/shadcn-baseline/      # 바닐라 CVA 비교 기준선`}</code>
                </pre>
            </BaseCard>
        </section>

        <section className="flex flex-col gap-6" aria-labelledby="ui-architecture-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="ui-architecture-title">UI Architecture</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        원본 구조와 프로젝트 스타일 책임을 분리하고, 필요한 기능은 조합 계층에서 확장합니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        ['ui', 'primitive의 구조·동작·접근성을 담당하는 기반 계층'],
                        ['theme', '프로젝트 CVA, variant와 상태별 시각 스타일을 담당'],
                        ['composite', 'ui를 import해 조합하고 프로젝트 API가 필요할 때 확장'],
                        ['custom', '적합한 primitive가 없는 프로젝트 고유 UI를 구현'],
                    ].map(([title, description]) => (
                        <div key={title} className="border-border flex flex-col gap-2 rounded-xl border p-5">
                            <h3 className="typo-body-l-medium text-foreground font-mono">{title}</h3>
                            <p className="text-foreground-subtle">{description}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-muted text-foreground mt-4 flex flex-col gap-1 rounded-md p-4 text-center font-mono font-semibold">
                    <p>tokens → theme → ui</p>
                    <p>theme + ui → composite / custom → screen</p>
                </div>
            </BaseCard>
        </section>

        <div className="border-border border-t pt-10">
            <BaseCard>
                <SectionHeader>
                    <SectionHeaderTitle>컴포넌트 이식 가이드</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        다른 프로젝트에서도 동일한 스타일과 기능을 사용하려면 컴포넌트뿐 아니라 토큰·설정·의존성을 함께
                        옮깁니다.
                    </SectionHeaderDescription>
                </SectionHeader>
            </BaseCard>
        </div>

        <section className="flex flex-col gap-6" aria-labelledby="migration-required-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="migration-required-title">필수 복사 범위</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        아래 경로는 서로 import로 연결되어 있으므로 사용하려는 컴포넌트의 의존 관계를 따라 함께
                        복사합니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <PathList items={REQUIRED_PATHS} />
            </BaseCard>
        </section>

        <section className="flex flex-col gap-6" aria-labelledby="migration-token-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="migration-token-title">토큰·스타일 파이프라인</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        프로젝트 디자인 값은 아래 파일을 거쳐 생성됩니다. 하나라도 빠지면 시맨틱 유틸리티가 정상
                        동작하지 않습니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <PathList items={PIPELINE_PATHS} />
                <div className="border-border bg-muted mt-5 rounded-md border p-4">
                    <p className="text-foreground font-semibold">생성 파일 처리</p>
                    <p className="text-foreground-subtle mt-1">
                        <code className="font-mono">src/app/tokens.css</code>는 직접 복사하거나 수정하지 않고, 이식한
                        프로젝트에서 <code className="font-mono">yarn tokens</code>를 실행해 다시 생성합니다.
                    </p>
                </div>
            </BaseCard>
        </section>

        <section className="flex flex-col gap-6" aria-labelledby="migration-repository-only-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="migration-repository-only-title">
                        퍼블리싱 저장소 전용 — 복사 제외
                    </SectionHeaderTitle>
                    <SectionHeaderDescription>
                        아래 항목은 이 저장소의 배포 버전과 퍼블리싱 현황을 관리하기 위한 기능입니다. 컴포넌트의
                        스타일·동작과 무관하므로 프론트엔드 개발자가 다른 저장소로 컴포넌트를 이식할 때 가져가지
                        않습니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <PathList items={REPOSITORY_ONLY_PATHS} />
                <div className="border-border bg-muted mt-5 rounded-md border p-4">
                    <p className="text-foreground font-semibold">대상 저장소의 릴리스는 별도 관리</p>
                    <p className="text-foreground-subtle mt-1">
                        새 프론트엔드 저장소에서도 자동 버전 태그가 필요할 때만 해당 저장소의 브랜치·배포 정책에 맞는
                        GitHub Actions를 별도로 구성합니다. 이 저장소의 workflow permissions 설정은 이식하지 않아도
                        됩니다.
                    </p>
                </div>
            </BaseCard>
        </section>

        <section className="grid gap-6 lg:grid-cols-2" aria-label="설정 및 적용 절차">
            <BaseCard title="설정·의존성">
                <ul className="flex flex-col gap-4">
                    <IntegrationStep number={1} title="패키지 병합">
                        <p>
                            <code className="font-mono">package.json</code>의 dependencies와 Tailwind 관련
                            devDependencies를 대상 프로젝트에 병합하고 lockfile을 다시 생성합니다.
                        </p>
                    </IntegrationStep>
                    <IntegrationStep number={2} title="shadcn 설정 병합">
                        <p>
                            <code className="font-mono">components.json</code>의 radix-nova 스타일, CSS 경로, 아이콘과
                            alias 설정을 유지합니다.
                        </p>
                    </IntegrationStep>
                    <IntegrationStep number={3} title="경로 별칭 병합">
                        <p>
                            <code className="font-mono">tsconfig.json</code>의 <code className="font-mono">@/*</code>와{' '}
                            <code className="font-mono">@tokens</code> 별칭을 대상 프로젝트 구조에 맞게 연결합니다.
                        </p>
                    </IntegrationStep>
                </ul>
            </BaseCard>

            <BaseCard title="애플리케이션 연결">
                <ul className="flex flex-col gap-4">
                    <IntegrationStep number={1} title="전역 CSS import">
                        <p>루트 layout에서 이식한 globals.css를 불러옵니다.</p>
                    </IntegrationStep>
                    <IntegrationStep number={2} title="ThemeProvider 적용">
                        <p>body 내부를 ThemeProvider로 감싸 라이트·다크 테마 상태를 연결합니다.</p>
                    </IntegrationStep>
                    <IntegrationStep number={3} title="폰트·에셋 연결">
                        <p>
                            동일한 외관이 필요하면 <code className="font-mono">src/app/fonts/</code>의 Pretendard와 실제
                            사용 컴포넌트가 참조하는 <code className="font-mono">public/</code> 에셋도 함께 옮깁니다.
                        </p>
                    </IntegrationStep>
                </ul>
            </BaseCard>
        </section>

        <section className="flex flex-col gap-6" aria-labelledby="migration-check-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="migration-check-title">이식 후 확인</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        가이드 페이지 자체는 실행에 필요하지 않습니다. 실제 컴포넌트를 대상 프로젝트 화면에 렌더링한 뒤
                        아래 순서로 확인합니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <ol className="grid gap-4 md:grid-cols-2">
                    <IntegrationStep number={1} title="토큰 생성">
                        <p>
                            <code className="font-mono">yarn tokens</code>
                        </p>
                    </IntegrationStep>
                    <IntegrationStep number={2} title="정적 검사">
                        <p>lint, format, TypeScript 검사를 실행합니다.</p>
                    </IntegrationStep>
                    <IntegrationStep number={3} title="상태 확인">
                        <p>default, hover, pressed, focus, disabled와 폼 제출 동작을 확인합니다.</p>
                    </IntegrationStep>
                    <IntegrationStep number={4} title="반응형·접근성 확인">
                        <p>키보드 탐색, 접근 가능한 이름, 모바일 레이아웃과 다크 모드를 확인합니다.</p>
                    </IntegrationStep>
                </ol>
            </BaseCard>
        </section>
    </div>
)

export default ComponentGuidePage
