// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import Link from 'next/link'
import {TriangleAlert} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import CopyChip from '@/components/custom/copy-chip'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import MotionPreview, {type MotionPreviewKind} from './motion-preview'

export const metadata: Metadata = {title: '모션 (Motion)'}

// 모션 값의 단일 소스는 src/app/globals.css 의 @theme 이다(다른 토큰과 달리 tokens.json 이 다루지 않는다 —
// @keyframes 와 한 몸이라 CSS 에 둔다). 이름 목록이 그 @theme 과 어긋나면 check:conventions 가 빌드를 세운다.
// 값(value)은 @theme 을 읽어 오지 않고 여기 옮겨 적으므로 globals.css 를 고치면 함께 고친다.
// usage 는 한 줄 쓰임, source 는 그 유틸리티를 실제로 붙이는 파일이다.

const EASINGS = [
    {
        name: 'ease-stack',
        value: 'cubic-bezier(0.5, 0, 0, 1)',
        points: [0.5, 0, 0, 1],
        usage: '메인 섹션 전환(빠르게 밀고 길게 감속)',
        source: 'theme/stack-pager.variants.ts',
    },
    {
        name: 'ease-roll',
        value: 'cubic-bezier(0.22, 1, 0.36, 1)',
        points: [0.22, 1, 0.36, 1],
        usage: '메인 지표 롤러의 행 이동 · 숫자 크기 전환, 카드 캐러셀의 카드 줄 밀기 · 카드 면 색 · 흐림 전환(0.5초)',
        source: 'theme/hero-stats-roller.variants.ts · custom/card-carousel.tsx',
    },
] as const

const ANIMATIONS = [
    {
        name: 'animate-hero-zoom-out',
        value: 'main-hero-zoom-out 7s ease both',
        usage: '메인 배경이 1.2배에서 원래 크기로 물러남',
        source: 'custom/hero-background.tsx',
        preview: 'scale',
    },
    {
        name: 'animate-counter-roll',
        value: 'animated-counter-roll ease both',
        usage: '숫자 카운터 자릿수 회전(시간은 사용처가 인라인으로 줌)',
        source: 'custom/animated-counter.tsx',
        preview: 'counter',
    },
    {
        name: 'animate-scroll-line',
        value: 'main-scroll-line-fill 1.5s ease-in-out infinite',
        usage: 'SCROLL 표시 세로선이 차오름(지금 직접 쓰는 곳 없음)',
        source: 'app/globals.css',
        preview: 'line',
    },
    {
        name: 'animate-header-menu-close-enter',
        value: 'header-menu-close-enter 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
        usage: '전체 메뉴 열 때 닫기 아이콘 회전 · 확대',
        source: 'composite/header.tsx',
        preview: 'menu-close',
    },
    {
        name: 'animate-header-menu-trigger-return',
        value: 'header-menu-trigger-return 340ms cubic-bezier(0.22, 1, 0.36, 1) both',
        usage: '전체 메뉴 닫을 때 메뉴 아이콘 복귀',
        source: 'composite/header.tsx',
        preview: 'menu-return',
    },
    {
        name: 'animate-tech-progress',
        value: 'tech-service-progress 5s linear forwards',
        usage: '메인 2섹션 서비스 목차 진행 바',
        source: 'custom/tech-eval-section.tsx',
        preview: 'progress',
    },
    {
        name: 'animate-tech-enter',
        value: 'tech-service-content-enter 600ms ease both',
        usage: '메인 2섹션 본문이 아래에서 떠오름',
        source: 'custom/tech-eval-section.tsx',
        preview: 'enter',
    },
    {
        name: 'animate-ambient-drift-a',
        value: 'ambient-drift-a 14s ease-in-out infinite alternate',
        usage: '배경 번짐 원이 천천히 떠다님(왼쪽 위 원) — 동작 줄이기면 멈춤',
        source: 'custom/platform-k-bigx-report.tsx',
        preview: 'drift',
    },
    {
        name: 'animate-ambient-drift-b',
        value: 'ambient-drift-b 18s ease-in-out infinite alternate',
        usage: '배경 번짐 원이 천천히 떠다님(오른쪽 아래 원 · a 와 다른 경로 · 주기)',
        source: 'custom/platform-k-bigx-report.tsx',
        preview: 'drift',
    },
    {
        name: 'animate-marquee',
        value: 'marquee 60s linear infinite',
        usage: '칩 줄이 왼쪽으로 끊김 없이 계속 흐름(목록 여러 벌을 이어 붙여 -50% 이동 · 가속 없음) — 마우스 · 터치 · 포커스 때 멈추고, 동작 줄이기면 줄바꿈 목록',
        source: 'custom/chip-marquee.tsx',
        preview: 'marquee',
    },
    {
        name: 'animate-chart-wipe-right',
        value: 'chart-wipe-right 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        usage: '가로 막대가 왼쪽 → 오른쪽으로 자람',
        source: 'custom/diverging-rank-chart.tsx · custom/butterfly-bar-chart.tsx · custom/ktrs-fm-structure-diagram.tsx',
        preview: 'wipe-right',
    },
    {
        name: 'animate-chart-wipe-left',
        value: 'chart-wipe-left 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        usage: '가로 막대가 오른쪽 → 왼쪽으로 자람(가운데 축 왼쪽)',
        source: 'custom/diverging-rank-chart.tsx · custom/butterfly-bar-chart.tsx',
        preview: 'wipe-left',
    },
    {
        name: 'animate-chart-draw',
        value: 'chart-draw 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        usage: '원 그래프 호 · 선이 처음부터 끝까지 그려짐(pathLength={1} · strokeDasharray="1 2" 와 함께)',
        source: 'custom/ktrs-fm-structure-diagram.tsx',
        preview: 'draw',
    },
    {
        name: 'animate-chart-label',
        value: 'chart-label 300ms ease-out 600ms both',
        usage: '막대가 다 자란 뒤 값 · 이름 글자가 나타남 · 원 그래프 호가 다 그려진 뒤 끝 점이 나타남',
        source: 'custom/butterfly-bar-chart.tsx · custom/diverging-rank-chart.tsx · custom/ktrs-fm-structure-diagram.tsx',
        preview: 'label',
    },
    {
        name: 'animate-chart-pop',
        value: 'chart-pop 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        usage: '칸 · 점 표시가 작게 시작해 커짐(조각마다 지연)',
        source: 'custom/segment-meter.tsx · custom/grade-scale-gauge.tsx · custom/rating-matrix.tsx',
        preview: 'pop',
    },
    {
        name: 'animate-chart-rise',
        value: 'chart-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        usage: '순위 피라미드 단 · 워드 클라우드 글자가 떠오름',
        source: 'custom/rank-pyramid-chart.tsx · custom/word-cloud.tsx',
        preview: 'enter',
    },
] as const satisfies readonly {
    name: string
    value: string
    usage: string
    source: string
    preview: MotionPreviewKind
}[]

const TOKEN_COLUMNS = [
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'class', header: '클래스', align: 'start', rowHeader: true},
    // 값 · 사용 파일은 쓰임 칸 아래에 작게 둔다 — 칸이 늘면 좁은 폭에서 표가 옆으로 넘친다.
    {key: 'usage', header: '쓰임 · 값', align: 'start', wrap: true},
] as const

// 가속도 미리보기 — 곡선 자체를 그린다. 움직이는 데모로 보여주려면 가이드 전용 @keyframes 를 새로
// 만들어야 하는데, 그러면 이 페이지가 큐레이션하는 목록에 실제로 쓰지 않는 값이 끼어든다.
// x=시간, y=진행률. 왼쪽 아래(0,0)에서 오른쪽 위(1,1)로 가며, 가파른 구간이 빠르게 움직이는 구간이다.
const CURVE_SIZE = 44

const EasingCurve = ({points}: {points: readonly [number, number, number, number]}) => {
    const [x1, y1, x2, y2] = points
    const toX = (value: number) => (value * CURVE_SIZE).toFixed(2)
    const toY = (value: number) => ((1 - value) * CURVE_SIZE).toFixed(2)

    return (
        <svg
            aria-hidden="true"
            viewBox={`-4 -12 ${CURVE_SIZE + 8} ${CURVE_SIZE + 24}`}
            className="text-primary size-icon-2xl shrink-0"
        >
            <path
                d={`M0 ${CURVE_SIZE} L${CURVE_SIZE} ${CURVE_SIZE} M0 ${CURVE_SIZE} L0 0`}
                className="stroke-border"
                strokeWidth={1}
                fill="none"
            />
            <path
                d={`M0 ${toY(0)} C${toX(x1)} ${toY(y1)}, ${toX(x2)} ${toY(y2)}, ${toX(1)} ${toY(1)}`}
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    )
}

// 쓰임 칸 — 한 줄 쓰임 아래에 값과 사용 파일을 작게 둔다.
const UsageCell = ({usage, value, source}: {usage: string; value: string; source: string}) => (
    <span className="flex flex-col gap-1">
        <span>{usage}</span>
        <span className="text-foreground-subtle font-mono text-xs">{value}</span>
        <span className="text-foreground-subtle font-mono text-xs">{source}</span>
    </span>
)

const BASIC_CODE = `{/* 가속도 — transition · duration 과 함께 */}
<div className="transition-transform duration-300 ease-roll motion-reduce:transition-none">…</div>

{/* 애니메이션 — 클래스 하나(이름 · 시간 · 가속도가 묶여 있다) */}
<span className="animate-tech-enter motion-reduce:animate-none">…</span>`

// 1-2. 규칙
const RULE_COLUMNS = [
    {key: 'rule', header: '항목', align: 'start', rowHeader: true},
    {key: 'note', header: '규칙', align: 'start', wrap: true},
] as const

const RULE_ROWS = [
    {
        key: 'reuse',
        cells: [
            '재사용',
            <span key="n">아래 목록의 ease-* · animate-* 를 씁니다. 같은 값을 컴포넌트에 다시 적지 않습니다.</span>,
        ],
    },
    {
        key: 'edit',
        cells: [
            '값 바꾸기',
            <span key="n">
                <code>src/app/globals.css</code> 의 @theme 에서 고칩니다(tokens.json · yarn tokens 대상 아님). 이 페이지
                목록도 함께 고치고, <code>yarn verify</code> 가 이름이 맞는지 확인합니다.
            </span>,
        ],
    },
    {
        key: 'reduce',
        cells: [
            '동작 줄이기',
            <span key="n">
                움직이는 클래스에는 <code>motion-reduce:animate-none</code>(또는 <code>motion-safe:</code>)를 붙여 OS
                설정을 따릅니다. 반복되는 모션에는 정지 버튼을 둡니다[6.2.2 · 6.3.1].
            </span>,
        ],
    },
    {
        key: 'hide',
        cells: [
            '즉시 감추기',
            <span key="n">
                등장 애니메이션의 <code>duration-*</code>(tw-animate)는 transition 시간도 함께 정합니다. 탭 전환처럼
                감춰야 하는 칸에 붙으면 물려받은 감춤(<code>invisible</code>)이 그 시간만큼 늦게 적용돼 이전 내용이 남아
                보이므로, 그런 칸에는 <code>transition-none</code> 을 함께 붙입니다.
            </span>,
        ],
    },
] as const

// 3. 컴포넌트 모션
const COMPONENT_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'how', header: '동작', align: 'start', wrap: true},
    {key: 'where', header: '쓰는 곳', align: 'start', wrap: true},
] as const

const COMPONENT_ROWS = [
    {
        key: 'chart-reveal',
        cells: [
            <code key="c">ChartRevealProvider · ChartReveal</code>,
            <ul key="h" className="flex list-disc flex-col gap-1 pl-5">
                <li>차트가 화면에 절반 이상 보이면 한 번 움직입니다.</li>
                <li>여러 장은 문서 순서로 0.12초 간격, 같은 revealGroup 은 동시에.</li>
                <li>이미 본 탭에 다시 들어가면 움직이지 않습니다.</li>
            </ul>,
            <Link
                key="w"
                href="/component-guide/chart-reveal"
                className="text-primary-strong underline underline-offset-4"
            >
                K-BIGx 보고서 · PDF 템플릿(ChartReveal 가이드)
            </Link>,
        ],
    },
    {
        key: 'reveal',
        cells: [
            <code key="c">Reveal</code>,
            <ul key="h" className="flex list-disc flex-col gap-1 pl-5">
                <li>화면에 30% 이상 들어오면 아래에서 떠오르며 나타납니다(0.7초).</li>
                <li>벗어났다 다시 들어오면 반복됩니다.</li>
            </ul>,
            '메인 기술평가 섹션(custom/reveal.tsx)',
        ],
    },
    {
        key: 'scroll-reveal',
        cells: [
            <code key="c">ScrollReveal</code>,
            <ul key="h" className="flex list-disc flex-col gap-1 pl-5">
                <li>
                    윗부분이 화면 아래 15% 선을 넘으면 아래에서 떠오르며 나타납니다(0.9초 · ease-roll). 키가 화면보다 큰
                    덩어리도 나타납니다.
                </li>
                <li>한 번만 나타납니다 — 읽는 화면에서 내용이 사라졌다 나타나기를 반복하지 않습니다.</li>
                <li>
                    안쪽은 <code>group-data-[revealed=true]/reveal:</code> 로 나타나는 순간에 맞춰 움직입니다(예: 막대가
                    자람 — animate-chart-wipe-right).
                </li>
                <li>
                    <code>hasRise={'{false}'}</code> 면 래퍼는 움직이지 않고 나타나는 시점만 알립니다 — 안쪽 조각이 따로
                    움직입니다(예: 특허평가 평가절차 단계가 왼쪽에서 0.12초 간격으로 밀려옴).
                </li>
                <li>동작 줄이기 설정이면 처음부터 제자리에 보입니다.</li>
            </ul>,
            <Link
                key="w"
                href="/corp/platform/technology-evaluation"
                className="text-primary-strong underline underline-offset-4"
            >
                플랫폼 소개 &gt; 기술평가 · 특허평가(custom/scroll-reveal.tsx)
            </Link>,
        ],
    },
] as const

const JUMP_LINK_CLASS =
    'border-border bg-card typo-body-l-bold text-foreground hover:bg-muted focus-visible:ring-ring rounded-md border px-4 py-2 outline-ring focus:outline-none focus-visible:ring-2'

// 섹션 묶음 제목 — 아래 카드들이 이 묶음에 속한다.
const GroupHeading = ({id, title, children}: {id: string; title: string; children: ReactNode}) => (
    <div className="flex scroll-mt-24 flex-col gap-2 pt-4" id={id}>
        <h2 className="typo-h3-bold text-foreground">{title}</h2>
        <p className="typo-body-l-regular text-label-foreground">{children}</p>
    </div>
)

const MotionGuidePage = () => (
    <GuidePageShell
        title="모션 (Motion)"
        description="프로젝트에서 재사용하는 가속도(ease-*)와 애니메이션(animate-*)입니다."
    >
        <BaseCard>
            <nav aria-label="모션 문서 구성" className="flex flex-wrap gap-3">
                <a href="#motion-rule-group" className={JUMP_LINK_CLASS}>
                    1. 쓰는 법 · 규칙
                </a>
                <a href="#motion-token-group" className={JUMP_LINK_CLASS}>
                    2. 목록 ({EASINGS.length + ANIMATIONS.length}개)
                </a>
                <a href="#motion-component-group" className={JUMP_LINK_CLASS}>
                    3. 컴포넌트 모션
                </a>
            </nav>
        </BaseCard>

        <GroupHeading id="motion-rule-group" title="1. 쓰는 법 · 규칙">
            새 값을 만들기 전에 목록에 있는 클래스를 먼저 찾습니다.
        </GroupHeading>

        <BaseCard>
            <section aria-labelledby="motion-basic" className="flex flex-col gap-6">
                <h3 id="motion-basic" className="typo-h4-bold">
                    1-1. 쓰는 법
                </h3>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="motion-rule" className="flex flex-col gap-6">
                <h3 id="motion-rule" className="typo-h4-bold">
                    1-2. 규칙
                </h3>
                <Table caption="모션 사용 규칙" columns={RULE_COLUMNS} rows={RULE_ROWS} size="md" />
                {/* 기본 규칙에서 벗어나는 자리라 표에 묻히지 않게 따로 띄운다. 늘 놓여 있는 안내라 role 을 note 로 둔다. */}
                <Alert color="warning" role="note">
                    <TriangleAlert aria-hidden="true" />
                    <AlertTitle>예외: 메인페이지는 동작 줄이기를 적용하지 않습니다</AlertTitle>
                    <AlertDescription>
                        동작 줄이기를 켜면 내용이 아예 보이지 않는 경우가 있어, 메인페이지는 설정과 관계없이 원래 모션을
                        재생합니다.
                    </AlertDescription>
                </Alert>
            </section>
        </BaseCard>

        <GroupHeading id="motion-token-group" title="2. 목록">
            미리보기는 실제 클래스를 그대로 붙인 것이라 원본과 같은 속도로 움직입니다.
        </GroupHeading>

        <BaseCard>
            <section aria-labelledby="motion-easing" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 id="motion-easing" className="typo-h4-bold">
                        2-1. 가속도 (ease-*)
                    </h3>
                    <p className="typo-body-l-regular text-label-foreground">
                        곡선의 가로는 시간, 세로는 진행률입니다. 가파른 구간이 빠르게 움직입니다.
                    </p>
                </div>
                <Table
                    caption="ease-* 가속도 목록"
                    columns={TOKEN_COLUMNS}
                    rows={EASINGS.map((easing) => ({
                        key: easing.name,
                        cells: [
                            <EasingCurve key="preview" points={easing.points} />,
                            <CopyChip key="class" value={easing.name} />,
                            <UsageCell key="usage" usage={easing.usage} value={easing.value} source={easing.source} />,
                        ],
                    }))}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="motion-animation" className="flex flex-col gap-6">
                <h3 id="motion-animation" className="typo-h4-bold">
                    2-2. 애니메이션 (animate-*)
                </h3>
                <Table
                    caption="animate-* 애니메이션 목록"
                    columns={TOKEN_COLUMNS}
                    rows={ANIMATIONS.map((animation) => ({
                        key: animation.name,
                        cells: [
                            <MotionPreview
                                key="preview"
                                kind={animation.preview}
                                loop={animation.value.includes('infinite')}
                                label={animation.name}
                            />,
                            <CopyChip key="class" value={animation.name} />,
                            <UsageCell
                                key="usage"
                                usage={animation.usage}
                                value={animation.value}
                                source={animation.source}
                            />,
                        ],
                    }))}
                />
            </section>
        </BaseCard>

        <GroupHeading id="motion-component-group" title="3. 컴포넌트 모션">
            화면에 들어올 때 움직이는 래퍼 컴포넌트입니다. 감싸기만 하면 됩니다.
        </GroupHeading>

        <BaseCard>
            <section aria-labelledby="motion-component" className="flex flex-col gap-6">
                <h3 id="motion-component" className="typo-h4-bold">
                    3-1. 등장 모션
                </h3>
                <Table caption="컴포넌트 등장 모션" columns={COMPONENT_COLUMNS} rows={COMPONENT_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default MotionGuidePage
