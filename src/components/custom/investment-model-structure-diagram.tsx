import {ArrowUpFromLine, Network, TrendingUp, User} from 'lucide-react'
import {PlatformDiagramBadge} from '@/components/custom/platform-diagram-badge'
import {platformDiagramSurfaceClassName} from '@/components/theme/platform-intro.variants'
import {INVESTMENT_MODEL_DIAGRAM} from '@/content/service/platform-technology-evaluation'
import {cn} from '@/lib/utils'

// InvestmentModelStructureDiagram — 개방형 투자모형 체계 구성도(두 모형 카드 + 결합평가)를 글 · 도형으로 그린다(플랫폼 소개 > 기술평가 모형 상세 탭).
// 카드 = 머리(배지 · 모형명) → 투입 지표 2칸(공통 · 특화) → 교차 연결선 → 두 모형 2칸(전문가 · 인공신경망) → 연결선 → 평점(알약).
//   · 1280↑: 카드 | 결합평가 | 카드 가로 배치. 1280 미만: 세로로 쌓고 결합평가는 그림 · 글이 한 줄(그보다 좁은 3칸은 칸 글이 넘친다).
//   · 결합평가 모션 — + 원이 살짝 뛰고, 위 화살표는 왼쪽 · 아래 화살표는 오른쪽 모형 쪽으로 그려진 뒤 화살촉이 나타나고,
//     머물렀다 사라지며 3.2초마다 반복한다(animate-platform-combine-*). 느린 꾸밈이라 동작 줄이기면 멈춘다[6.3.1].
//   · 구성도 전체가 role="img" + aria-label 로 한 번에 읽힌다(안쪽 글은 화면용).
// 문구는 content/service/platform-technology-evaluation.ts 의 INVESTMENT_MODEL_DIAGRAM.

type InvestmentModel = (typeof INVESTMENT_MODEL_DIAGRAM.models)[number]

// 카드 색 — growth(기술사업성장모형): 남색 · value(밸류업모형): 강조 파랑.
const TONE_CLASS: Record<
    InvestmentModel['tone'],
    {card: string; head: string; key: string; method: string; icon: string; link: string; out: string}
> = {
    growth: {
        card: 'border-platform-model-growth/16',
        head: 'from-platform-model-growth/10 border-platform-model-growth/12 text-platform-model-growth-foreground',
        key: 'bg-platform-model-growth/9 text-platform-model-growth-foreground',
        method: 'border-platform-model-growth/55',
        icon: 'text-platform-model-growth-foreground',
        link: 'stroke-platform-model-growth/45',
        out: 'from-platform-model-growth-bright to-platform-model-growth',
    },
    value: {
        card: 'border-platform-accent/16',
        head: 'from-platform-accent/10 border-platform-accent/12 text-platform-accent-foreground',
        key: 'bg-platform-accent/9 text-platform-accent-foreground',
        method: 'border-platform-accent/55',
        icon: 'text-platform-accent-foreground',
        link: 'stroke-platform-accent/45',
        out: 'from-platform-accent-bright to-platform-accent',
    },
}

const MODEL_ICONS = {growth: TrendingUp, value: ArrowUpFromLine} as const
const METHOD_ICONS = [User, Network] as const

// 칸 공통 — 높이 46 이상 · 가운데 굵은 글(14.5).
const CELL_CLASS =
    'typo-body-l-bold flex min-h-11.5 items-center justify-center gap-1.5 rounded-md p-2 text-center break-keep'

// 교차 연결선 — 위 두 칸에서 아래 두 칸으로 곧은 선 2 + 엇갈린 곡선 2(폭에 맞춰 늘어난다).
const Link = ({className}: {className: string}) => (
    <svg
        aria-hidden="true"
        viewBox="0 0 100 32"
        preserveAspectRatio="none"
        className="block h-7.5 w-full overflow-visible"
    >
        <path
            d="M25 0V32M75 0V32M25 0C25 16 75 16 75 32M75 0C75 16 25 16 25 32"
            strokeWidth={1.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className={cn('fill-none', className)}
        />
    </svg>
)

const ModelCard = ({model}: {model: InvestmentModel}) => {
    const tone = TONE_CLASS[model.tone]
    const Icon = MODEL_ICONS[model.tone]
    const [commonInput, keyInput] = model.inputs
    return (
        <div className={cn('bg-platform-panel overflow-hidden rounded-lg border shadow-sm', tone.card)}>
            <div
                className={cn(
                    'typo-title-m-bold to-platform-panel flex items-center justify-center gap-2.5 border-b bg-linear-to-b px-3.5 py-4',
                    tone.head,
                )}
            >
                <PlatformDiagramBadge tone={model.tone === 'growth' ? 'growth' : 'accent'}>
                    <Icon />
                </PlatformDiagramBadge>
                {model.title}
            </div>
            <div className="grid px-5 pt-5 pb-5.5">
                <div className="grid grid-cols-2 gap-3">
                    <span className={cn(CELL_CLASS, 'bg-platform-panel-inset text-label-foreground')}>
                        {commonInput}
                    </span>
                    <span className={cn(CELL_CLASS, tone.key)}>{keyInput}</span>
                </div>
                <Link className={tone.link} />
                <div className="grid grid-cols-2 gap-3">
                    {model.methods.map((method, index) => {
                        const MethodIcon = METHOD_ICONS[index] ?? User
                        return (
                            <span
                                key={method}
                                className={cn(
                                    CELL_CLASS,
                                    'bg-platform-panel text-foreground border shadow-xs',
                                    tone.method,
                                )}
                            >
                                <MethodIcon aria-hidden="true" className={cn('size-4.25 shrink-0', tone.icon)} />
                                {method}
                            </span>
                        )
                    })}
                </div>
                <Link className={tone.link} />
                <span
                    className={cn(
                        'typo-body-xl-bold shadow-lift min-w-2/3 justify-self-center rounded-full bg-linear-135 px-5 py-3 text-center text-white',
                        tone.out,
                    )}
                >
                    {model.outcome}
                </span>
            </div>
        </div>
    )
}

// 결합평가 화살표 — 가로로 놓는 PC(1280↑)는 + 원(가운데 64, 52) 위로 나와 왼쪽으로, 아래로 나와 오른쪽으로 꺾여
// 양옆 카드를 가리킨다(128 × 104). 카드를 쌓는 폭(1280 미만)은 + 원 위아래로 곧은 화살표가 위 카드 · 아래 카드를 가리킨다
// (40 × 104) — 꺾인 화살표를 돌리면 화살표가 원 양옆으로 어긋나 보인다.
const COMBINE_ARROWS = {
    bent: {
        viewBox: '0 0 128 104',
        center: 64,
        className: 'h-26 w-32 max-xl:hidden',
        lines: ['M64 37V14Q64 8 58 8H8', 'M64 67V90Q64 96 70 96H120'],
        heads: ['M14 2L8 8L14 14', 'M114 90L120 96L114 102'],
        headClasses: [
            'motion-safe:animate-platform-combine-head-left',
            'motion-safe:animate-platform-combine-head-right',
        ],
    },
    straight: {
        viewBox: '0 0 40 104',
        center: 20,
        className: 'h-26 w-10 col-start-2 xl:hidden',
        lines: ['M20 37V3', 'M20 67V101'],
        heads: ['M14 9L20 3L26 9', 'M14 95L20 101L26 95'],
        // 화살촉은 선이 다 그려진 뒤 나타나기만 한다(옆으로 밀리는 움직임은 가로 화살표 전용).
        headClasses: ['motion-safe:animate-platform-combine-line', 'motion-safe:animate-platform-combine-line'],
    },
} as const

const CombineMark = ({variant}: {variant: keyof typeof COMBINE_ARROWS}) => {
    const arrow = COMBINE_ARROWS[variant]
    return (
        <svg
            aria-hidden="true"
            viewBox={arrow.viewBox}
            className={cn('block shrink-0 overflow-visible', arrow.className)}
        >
            <g
                className="stroke-foreground-subtle fill-none"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {arrow.lines.map((line) => (
                    <path key={line} d={line} pathLength={1} className="motion-safe:animate-platform-combine-line" />
                ))}
                {arrow.heads.map((head, index) => (
                    <path
                        key={head}
                        d={head}
                        // 곧은 화살표의 화살촉은 선과 같은 그리기 모션을 쓰므로 길이를 1 로 맞춘다(가로 화살촉에는 영향 없음).
                        pathLength={variant === 'straight' ? 1 : undefined}
                        className={arrow.headClasses[index]}
                    />
                ))}
            </g>
            <g className="motion-safe:animate-platform-combine-core origin-center transform-fill">
                <circle cx={arrow.center} cy={52} r={15} className="fill-foreground" />
                <path
                    d={`M${arrow.center} 45V59M${arrow.center - 7} 52H${arrow.center + 7}`}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    className="stroke-page fill-none"
                />
            </g>
        </svg>
    )
}

const InvestmentModelStructureDiagram = () => {
    const [growthModel, valueModel] = INVESTMENT_MODEL_DIAGRAM.models
    return (
        <div className={platformDiagramSurfaceClassName}>
            <p className="typo-body-l-regular text-label-foreground mb-5.5 text-center">
                {INVESTMENT_MODEL_DIAGRAM.caption}
            </p>
            <div
                role="img"
                aria-label={INVESTMENT_MODEL_DIAGRAM.label}
                className="mx-auto grid max-w-215 items-center gap-3 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-x-1 xl:gap-y-4"
            >
                <ModelCard model={growthModel} />
                <div className="typo-body-m-bold text-label-foreground grid grid-cols-[1fr_auto_1fr] items-center gap-2 max-xl:py-1 xl:grid-cols-1 xl:justify-items-center xl:gap-1.5">
                    <CombineMark variant="bent" />
                    <CombineMark variant="straight" />
                    {/* 쌓는 폭에서는 + 원이 가운데, 글은 그 오른쪽(3칸 그리드). */}
                    <span className="max-xl:col-start-3 max-xl:justify-self-start">
                        {INVESTMENT_MODEL_DIAGRAM.combineLabel}
                    </span>
                </div>
                <ModelCard model={valueModel} />
            </div>
        </div>
    )
}

export {InvestmentModelStructureDiagram}
