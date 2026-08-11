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
    ['ui', '기본 구조·동작·접근성을 제공하는 shadcn/ui primitive'],
    ['theme', '프로젝트 variant와 상태별 스타일'],
    ['composite', 'shadcn/ui primitive를 조합한 공통 UI와 프로젝트 API'],
    ['custom', '프로젝트 고유 기능을 가진 UI'],
]

const HANDOFF_TREE = `frontend-handoff/
├── package.json                        # 토큰 생성·dev·build·start 실행 환경
├── yarn.lock                           # 검증된 의존성 버전 고정
├── THIRD_PARTY_LICENSES.md             # 전달 시점 오픈소스 라이선스 고지
├── README.md                            # 전달 버전·실행 방법과 원본 커밋 안내
├── .gitignore                          # 로컬 환경변수·빌드 결과 제외
├── tsconfig.json                       # TypeScript와 경로 별칭
├── next.config.ts                      # 서비스용 Next.js 설정
├── postcss.config.mjs                  # Tailwind CSS v4 빌드 연결
├── components.json                    # shadcn 스타일·CSS 경로·alias 설정
├── tokens.json                         # 디자인 토큰 원본
├── scripts/
│   └── build-tokens.mjs                # tokens.json → tokens.css 생성·검증
├── public/                             # 이미지·아이콘·정적 에셋
├── vendor/
│   └── shadcn-baseline/                # [shadcn 원본] theme variant 비교 기준
└── src/
    ├── app/
    │   ├── layout.tsx                  # 전역 CSS·폰트·ThemeProvider 연결
    │   ├── page.tsx                    # 서비스 화면으로 교체할 최소 시작 화면
    │   ├── publishing-guide/page.tsx   # 퍼블리싱 인덱스
    │   ├── component-guide/            # 토큰·컴포넌트 가이드와 예시 화면
    │   ├── globals.css                 # Tailwind·토큰·전역 스타일 진입점
    │   ├── tokens.css                  # 포함·재생성되는 디자인 토큰 결과물
    │   ├── manifest.ts                 # 서비스 웹 앱 메타데이터
    │   └── fonts/                      # Pretendard와 폰트 라이선스
    ├── components/
    │   ├── ui/                         # primitive 구조·동작·접근성
    │   ├── theme/                      # variant·size·상태별 스타일
    │   ├── composite/                  # primitive 조합 공통 컴포넌트
    │   ├── custom/                     # 재사용 가능한 프로젝트 컴포넌트
    │   └── theme-provider.tsx          # 공통 라이트·다크 테마 연결
    ├── hooks/                          # 컴포넌트 실행에 필요한 hooks
    ├── constants/                      # 테마·가이드 공통 설정
    ├── content/publishing-guide/       # 릴리스·인계 자산·화면 현황 스냅샷
    ├── lib/utils.ts                    # cn 등 공통 유틸리티
    └── types/                          # 외부 플러그인 타입 선언`

const HANDOFF_EXCLUSIONS = `# 제작·검수 규칙
.github/  docs/  .husky/
eslint.config.mjs  .prettierrc.cjs  .prettierignore

# 릴리스·검사 생성 도구
scripts/*  (scripts/build-tokens.mjs 제외)
RELEASE_NOTES_DRAFT.md

# 전달용으로 재구성
README.md  package.json  .gitignore  src/app/page.tsx

# 전달용으로 추가
src/app/publishing-guide/page.tsx`

const HANDOFF_FLOW = [
    ['1', '제작 검증', '현재 저장소에서 yarn verify와 yarn build를 통과합니다.'],
    ['2', '전달본 생성', '화면·컴포넌트·가이드와 실행 설정을 복사하고 제작·검수 도구를 제외합니다.'],
    ['3', '토큰·경로 구성', '토큰 생성 환경을 포함하고 루트 화면과 퍼블리싱 인덱스 경로를 분리합니다.'],
    ['4', '독립 검증', '전달본에서 의존성 설치, 타입 검사와 프로덕션 빌드를 다시 통과합니다.'],
    ['5', '이력 반영', '기존 handoff 브랜치의 다음 커밋으로 결과를 반영해 버전별 변경 이력을 유지합니다.'],
]

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
            <h1 className="typo-display-s-bold text-foreground">컴포넌트 가이드</h1>
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
                    <SectionHeaderDescription asChild>
                        <ul className="flex list-disc flex-col gap-1 pl-5">
                            <li>
                                <code className="text-foreground font-mono">frontend-handoff</code>는 프론트엔드 개발
                                작업 전달을 위한 브랜치로, 현재 저장소의 검수 기준과 독립 빌드를 통과한 실행 가능한
                                소스를 제공합니다.
                            </li>
                            <li>
                                전달 이후의 코드 스타일, 브랜치 전략, Lint와 포맷 정책은 프론트엔드 저장소에서
                                관리합니다.
                            </li>
                        </ul>
                    </SectionHeaderDescription>
                </SectionHeader>

                <div className="flex flex-col gap-3">
                    <h3 className="typo-body-l-medium text-foreground">전달 결과물</h3>
                    <p className="text-foreground-subtle">
                        프로젝트 화면, 퍼블리싱 인덱스, 컴포넌트 가이드와 shadcn 원본 비교 기준을 함께 제공합니다.
                    </p>
                    <CodeBlock code={HANDOFF_TREE} language="bash" />
                </div>

                <div className="mt-8 flex flex-col gap-3">
                    <h3 className="typo-body-l-medium text-foreground">전달에서 제외·교체</h3>
                    <p className="text-foreground-subtle">
                        제작 저장소의 규칙·검사·릴리스 도구는 제외합니다. 실행 환경, 루트 화면과 README는 전달 목적에
                        맞게 재구성합니다.
                    </p>
                    <CodeBlock code={HANDOFF_EXCLUSIONS} language="bash" />
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <h3 className="typo-body-l-medium text-foreground">생성·검증 흐름</h3>
                    <ol className="grid gap-4 md:grid-cols-2">
                        {HANDOFF_FLOW.map(([number, title, description]) => (
                            <li key={number} className="border-border flex items-start gap-3 rounded-xl border p-5">
                                <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                                    {number}
                                </span>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-foreground font-semibold">{title}</h4>
                                    <p className="text-foreground-subtle">{description}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    <div className="border-border rounded-xl border p-5">
                        <h3 className="text-foreground font-semibold">제작 품질</h3>
                        <p className="text-foreground-subtle mt-2">
                            토큰, 컴포넌트, 페이지와 빌드 품질은 현재 퍼블리싱 저장소가 검증하고 책임합니다.
                        </p>
                    </div>
                    <div className="border-border rounded-xl border p-5">
                        <h3 className="text-foreground font-semibold">전달 이후 개발</h3>
                        <p className="text-foreground-subtle mt-2">
                            전달 이후의 개발 규칙과 서비스 운영 정책은 프론트엔드 저장소에서 구성하고 관리합니다.
                        </p>
                    </div>
                </div>
            </BaseCard>
        </section>

        <section aria-labelledby="verification-title">
            <BaseCard>
                <SectionHeader className="mb-6">
                    <SectionHeaderTitle id="verification-title">변경 후 확인</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        토큰이나 컴포넌트를 변경하면 원본 검증부터 전달본 재생성·독립 빌드·이력 반영까지 확인합니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="border-border rounded-xl border p-5">
                        <h3 className="text-foreground font-semibold">제작 저장소 검증</h3>
                        <p className="text-foreground-subtle mt-2">
                            <code className="text-foreground font-mono">yarn verify</code>와{' '}
                            <code className="text-foreground font-mono">yarn build</code>로 토큰, 규칙, 타입과 전체
                            페이지 빌드를 확인합니다.
                        </p>
                    </div>
                    <div className="border-border rounded-xl border p-5">
                        <h3 className="text-foreground font-semibold">가이드·사용처 동기화</h3>
                        <p className="text-foreground-subtle mt-2">
                            변경된 API, 토큰, 상태 예시와 실제 사용처를 함께 갱신하고 mobile·tablet·PC에서 확인합니다.
                        </p>
                    </div>
                    <div className="border-border rounded-xl border p-5">
                        <h3 className="text-foreground font-semibold">전달 경계 확인</h3>
                        <p className="text-foreground-subtle mt-2">
                            <code className="text-foreground font-mono">/</code>,{' '}
                            <code className="text-foreground font-mono">/publishing-guide</code>와{' '}
                            <code className="text-foreground font-mono">/component-guide</code> 경로, 토큰 생성 환경과
                            정적 에셋을 확인합니다.
                        </p>
                    </div>
                    <div className="border-border rounded-xl border p-5">
                        <h3 className="text-foreground font-semibold">전달본 최종 빌드</h3>
                        <p className="text-foreground-subtle mt-2">
                            전달본에서 <code className="text-foreground font-mono">yarn build</code>를 통과한 뒤 기존{' '}
                            <code className="text-foreground font-mono">frontend-handoff</code> 이력의 다음 커밋으로
                            반영됐는지 확인합니다.
                        </p>
                    </div>
                </div>
            </BaseCard>
        </section>
    </div>
)

export default ComponentGuidePage
