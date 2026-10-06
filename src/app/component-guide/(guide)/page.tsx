import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {SectionHeader, SectionHeaderDescription, SectionHeaderTitle} from '@/components/composite/section-header'
import CodeBlock from '@/components/custom/code-block'
import {ComponentLayerBadge} from '@/components/custom/component-layer-badge'

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

// 컴포넌트 폴더 네 개 — 무엇이 들어가고, 고쳐도 되는지.
const ARCHITECTURE = [
    {
        name: 'ui',
        summary: 'shadcn/ui 에서 받은 기본 부품',
        examples: 'Button · Input · Select · Dialog',
        rule: '구조 · 동작 · 접근성은 고치지 않습니다. 업데이트 때 다시 받아 덮어씁니다.',
    },
    {
        name: 'theme',
        summary: 'ui 부품의 프로젝트 스타일',
        examples: 'button.variants.ts · dialog.variants.ts',
        rule: '색 · 크기 · 상태 스타일은 여기서만 고칩니다. 컴포넌트가 아니라 클래스 정의입니다.',
    },
    {
        name: 'composite',
        summary: 'shadcn/ui 부품을 합성한 공통 부품',
        examples: 'Select · Field · Header · FormCard',
        rule: 'shadcn/ui 부품끼리, 또는 shadcn/ui 부품과 직접 만든 요소를 합쳐 만듭니다. 어느 화면에서나 쓰도록 내용은 props 로 받습니다.',
    },
    {
        name: 'custom',
        summary: '한 화면 · 한 업무를 위한 전용 부품',
        examples: '평가결과 리포트 · 홈 공지 팝업 · 차트 · 메인페이지 섹션',
        rule: '그 화면의 내용과 동작을 직접 담습니다. 다른 화면에 그대로 가져다 쓰기 어렵습니다.',
    },
] as const

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
    │   ├── (user-type)/                # 기업(corp)·기관(org) 서비스 화면
    │   ├── publishing-guide/page.tsx   # 퍼블리싱 인덱스
    │   ├── component-guide/            # 토큰·컴포넌트 가이드와 예시 화면
    │   ├── globals.css                 # Tailwind·토큰·전역 스타일 진입점
    │   ├── tokens.css                  # 포함·재생성되는 디자인 토큰 결과물
    │   ├── manifest.ts · robots.ts     # 서비스 웹 앱 메타데이터·검색 로봇 설정
    │   ├── icon.svg · apple-icon.png · favicon.ico   # 사이트 아이콘
    │   └── fonts/                      # Pretendard와 폰트 라이선스
    ├── components/
    │   ├── ui/                         # primitive 구조·동작·접근성
    │   ├── theme/                      # variant·size·상태별 스타일
    │   ├── composite/                  # primitive 조합 공통 컴포넌트
    │   ├── custom/                     # 재사용 가능한 프로젝트 컴포넌트
    │   └── theme-provider.tsx          # 공통 라이트·다크 테마 연결
    ├── styles/                         # 한 화면에서만 쓰는 CSS (해당 page.tsx 가 직접 import)
    ├── hooks/                          # 컴포넌트 실행에 필요한 hooks
    ├── constants/                      # 사이트·테마·가이드 설정과 화면 공통 상수
    ├── content/
    │   ├── service/                    # 서비스 화면 목업 데이터 (API 연동 시 교체 지점)
    │   ├── technology-evaluation/      # 기술평가 문항 등 화면 콘텐츠
    │   └── publishing-guide/           # 릴리스·인계 자산·화면 현황 스냅샷
    ├── lib/                            # cn 과 번호·파일 형식 등 공통 유틸리티
    └── types/                          # 외부 플러그인 타입 선언`

const HANDOFF_EXCLUSIONS = `# 제작·검수 규칙
.github/  docs/  .husky/  CLAUDE.md  AGENTS.md
eslint.config.mjs  .prettierrc.cjs  .prettierignore

# 릴리스·검사 생성 도구
scripts/*  (scripts/build-tokens.mjs 제외)
RELEASE_NOTES_DRAFT.md  handoff/  .env.example

# 원본 저장소 전용 (퍼블리싱 인덱스의 새 탭 경유 주소)
src/app/component-guide/open-screen/
src/constants/screen-open.ts

# 전달용으로 재구성
README.md  package.json  .gitignore  src/app/page.tsx
next.config.ts                   # 접근성 검사용 소스 지문 계산 제거
src/constants/site.ts            # handoff/site.ts 로 교체
src/constants/theme-routes.ts    # handoff/theme-routes.ts 로 교체
public/og-image.png              # 원본 이미지 제거 (handoff/og-image.png 가 있으면 교체)
src/components/custom/publishing-index.tsx   # 화면 링크를 경유 없이 화면 주소로

# 전달용으로 추가
src/app/publishing-guide/page.tsx`

const HANDOFF_FLOW = [
    ['1', '제작 검증', '현재 저장소에서 yarn verify, 전체 화면 마크업 검사와 yarn build를 통과합니다.'],
    ['2', '전달본 생성', '화면·컴포넌트·가이드와 실행 설정을 복사하고 제작·검수 도구를 제외합니다.'],
    [
        '3',
        '토큰·경로 구성',
        '토큰 생성 환경을 포함하고 루트 화면과 퍼블리싱 인덱스 경로를 분리하며, 사이트 설정을 전달용으로 바꿉니다.',
    ],
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
            <p className="typo-body-xl-regular text-foreground-subtle">
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
                            className="border-foreground-subtle/30 bg-pastel-neutral/40 hover:border-primary focus-visible:ring-ring flex flex-col gap-2 rounded-sm border p-5 transition-colors outline-none focus-visible:ring-2"
                        >
                            <h3 className="typo-body-xl-bold text-foreground">{item.title}</h3>
                            <p className="text-label-foreground">{item.description}</p>
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
                        <li
                            key={item.number}
                            className="border-foreground-subtle/30 bg-pastel-neutral/40 flex items-start gap-3 rounded-sm border p-5"
                        >
                            <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                                {item.number}
                            </span>
                            <div className="flex flex-col gap-1">
                                <h3 className="typo-body-xl-bold text-foreground">{item.title}</h3>
                                <p className="text-label-foreground">{item.description}</p>
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
                <div className="border-primary/30 bg-primary-subtle text-foreground overflow-x-auto rounded-sm border p-5 text-center font-mono text-sm font-semibold">
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
                    <SectionHeaderTitle id="architecture-title">컴포넌트 폴더</SectionHeaderTitle>
                    <SectionHeaderDescription>
                        <code className="text-foreground font-mono">src/components</code> 아래 네 폴더의 역할입니다.
                    </SectionHeaderDescription>
                </SectionHeader>
                <div className="grid gap-4 md:grid-cols-2">
                    {ARCHITECTURE.map((layer) => (
                        // 카드마다 같은 자리에 같은 종류의 정보가 오게 한다 — 폴더(배지 · 경로) → 한 줄 정의 → 예시 · 규칙.
                        <div
                            key={layer.name}
                            className="border-foreground-subtle/30 bg-pastel-neutral/40 flex flex-col gap-3 rounded-sm border p-5"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <ComponentLayerBadge layer={layer.name} />
                                <code className="text-foreground-subtle font-mono text-xs">
                                    src/components/{layer.name}
                                </code>
                            </div>
                            <h3 className="typo-title-m-bold text-foreground">{layer.summary}</h3>
                            <dl className="border-subtle-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 border-t pt-3">
                                <dt className="typo-body-l-bold text-foreground-subtle">예시</dt>
                                <dd className="text-label-foreground font-mono text-sm">{layer.examples}</dd>
                                <dt className="typo-body-l-bold text-foreground-subtle">규칙</dt>
                                <dd className="text-label-foreground">{layer.rule}</dd>
                            </dl>
                        </div>
                    ))}
                </div>
                <p className="border-primary/30 bg-primary-subtle text-foreground mt-4 overflow-x-auto rounded-sm border p-5 text-center font-mono text-sm font-semibold">
                    tokens → theme + ui → composite / custom → screen
                </p>
                <ul className="text-foreground-subtle mt-5 flex list-disc flex-col gap-2 pl-5">
                    <li>
                        화면에서는 <code className="text-foreground font-mono">ui</code> ·{' '}
                        <code className="text-foreground font-mono">composite</code> ·{' '}
                        <code className="text-foreground font-mono">custom</code>을 직접 불러 씁니다.
                    </li>
                    <li>
                        <code className="text-foreground font-mono">composite</code> ·{' '}
                        <code className="text-foreground font-mono">custom</code>은 둘 다 프로젝트 코드라 자유롭게
                        고칩니다.
                    </li>
                </ul>
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

                {/* 소제목 블록마다 가로선과 같은 여백으로 갈라, 섹션 제목 → 소제목 → 카드 제목 순서가 눈에 보이게 한다. */}
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-3 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">전달 결과물</h3>
                        <p className="text-label-foreground">
                            프로젝트 화면, 퍼블리싱 인덱스, 컴포넌트 가이드와 shadcn 원본 비교 기준을 함께 제공합니다.
                        </p>
                        <CodeBlock code={HANDOFF_TREE} language="bash" />
                    </div>

                    <div className="flex flex-col gap-3 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">전달에서 제외·교체</h3>
                        <p className="text-label-foreground">
                            제작 저장소의 규칙·검사·릴리스 도구와 원본 저장소 전용 코드는 제외합니다. 실행 환경, 루트
                            화면, README와 사이트 설정은 전달 목적에 맞게 재구성합니다.
                        </p>
                        <CodeBlock code={HANDOFF_EXCLUSIONS} language="bash" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">생성·검증 흐름</h3>
                        <ol className="grid gap-4 md:grid-cols-2">
                            {HANDOFF_FLOW.map(([number, title, description]) => (
                                <li
                                    key={number}
                                    className="border-foreground-subtle/30 bg-pastel-neutral/40 flex items-start gap-3 rounded-sm border p-5"
                                >
                                    <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                                        {number}
                                    </span>
                                    <div className="flex flex-col gap-1">
                                        <h4 className="typo-body-xl-bold text-foreground">{title}</h4>
                                        <p className="text-label-foreground">{description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* 흐름(순서)과 책임 범위(누가 맡는가)는 다른 이야기라 소제목으로 가른다. */}
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">책임 범위</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="border-foreground-subtle/30 bg-pastel-neutral/40 rounded-sm border p-5">
                                <h4 className="typo-body-xl-bold text-foreground">제작 품질</h4>
                                <p className="text-label-foreground mt-2">
                                    토큰, 컴포넌트, 페이지와 빌드 품질은 현재 퍼블리싱 저장소가 검증하고 책임합니다.
                                </p>
                            </div>
                            <div className="border-foreground-subtle/30 bg-pastel-neutral/40 rounded-sm border p-5">
                                <h4 className="typo-body-xl-bold text-foreground">전달 이후 개발</h4>
                                <p className="text-label-foreground mt-2">
                                    전달 이후의 개발 규칙과 서비스 운영 정책은 프론트엔드 저장소에서 구성하고
                                    관리합니다.
                                </p>
                            </div>
                        </div>
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
                    <div className="border-foreground-subtle/30 bg-pastel-neutral/40 rounded-sm border p-5">
                        <h3 className="typo-body-xl-bold text-foreground">제작 저장소 검증</h3>
                        <p className="text-label-foreground mt-2">
                            <code className="text-foreground font-mono">yarn verify</code>와{' '}
                            <code className="text-foreground font-mono">yarn build</code>로 토큰, 규칙, 타입과 전체
                            페이지 빌드를 확인합니다.
                        </p>
                    </div>
                    <div className="border-foreground-subtle/30 bg-pastel-neutral/40 rounded-sm border p-5">
                        <h3 className="typo-body-xl-bold text-foreground">가이드·사용처 동기화</h3>
                        <p className="text-label-foreground mt-2">
                            변경된 API, 토큰, 상태 예시와 실제 사용처를 함께 갱신하고 mobile·tablet·PC에서 확인합니다.
                        </p>
                    </div>
                    <div className="border-foreground-subtle/30 bg-pastel-neutral/40 rounded-sm border p-5">
                        <h3 className="typo-body-xl-bold text-foreground">전달 경계 확인</h3>
                        <p className="text-label-foreground mt-2">
                            <code className="text-foreground font-mono">/</code>,{' '}
                            <code className="text-foreground font-mono">/publishing-guide</code>와{' '}
                            <code className="text-foreground font-mono">/component-guide</code> 경로, 토큰 생성 환경과
                            정적 에셋을 확인합니다.
                        </p>
                    </div>
                    <div className="border-foreground-subtle/30 bg-pastel-neutral/40 rounded-sm border p-5">
                        <h3 className="typo-body-xl-bold text-foreground">전달본 최종 빌드</h3>
                        <p className="text-label-foreground mt-2">
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
