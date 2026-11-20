import {Plus} from 'lucide-react'
import {ScrollReveal} from '@/components/custom/scroll-reveal'
import {Badge} from '@/components/ui/badge'
import {INVESTMENT_MODEL_DIAGRAM} from '@/content/service/platform-technology-evaluation'
import {cn} from '@/lib/utils'

// InvestmentModelStructureDiagram — 개방형 투자모형 구조도(모형 카드 두 장 + 결합평가)를 글 · 도형으로 그린다.
// 쓰는 곳: 플랫폼 소개 > 기술평가 투자모형 탭. 문구는 content/service/platform-technology-evaluation.ts 의 INVESTMENT_MODEL_DIAGRAM.
//
// 알아둘 점
//   · 그림이 아니라 글이라 화면 낭독기가 읽고[5.1.1] 모바일에서 글자가 줄지 않는다.
//   · 모바일은 카드를 세로로 쌓고 결합평가 화살표 SVG 를 90° 돌려 위 · 아래 카드를 가리킨다.
//   · 화면에 들어오면 + 원 · 화살표가 차례로 그려진다. 동작 줄이기면 처음부터 다 그려져 있다[6.3.1].

type InvestmentModel = (typeof INVESTMENT_MODEL_DIAGRAM.models)[number]

const MODEL_HEAD_TONE_CLASS: Record<InvestmentModel['tone'], string> = {
    navy: 'bg-navy-500 text-navy-10',
    primary: 'bg-primary text-primary-foreground',
}

// 결합평가 화살표 — + 원(가운데 38, 28 · 반지름 12) 위에서 나와 왼쪽으로, 아래에서 나와 오른쪽으로 꺾인다(모서리 반지름 6).
const COMBINE_VIEW = {width: 76, height: 56}
const COMBINE_LINES = ['M 38 16 V 10 A 6 6 0 0 0 32 4 H 6', 'M 38 40 V 46 A 6 6 0 0 0 44 52 H 70'] as const
const COMBINE_ARROWS = ['6,1 6,7 1,4', '70,49 70,55 75,52'] as const

const ModelCard = ({model}: {model: InvestmentModel}) => {
    const {inputLabel, outcomeBadge} = INVESTMENT_MODEL_DIAGRAM

    return (
        <li className="flex w-full max-w-80 flex-col">
            <h4 className={cn('typo-body-xl-bold px-2 py-4 text-center break-keep', MODEL_HEAD_TONE_CLASS[model.tone])}>
                {model.title}
            </h4>
            <div className="bg-panel-raised flex flex-1 flex-col gap-4 p-4">
                <div className="border-subtle-2 flex flex-col gap-4 rounded-sm border border-dashed p-4">
                    <div className="flex items-center justify-center gap-2">
                        <h5 className="typo-body-xl-bold text-label-foreground">{inputLabel}</h5>
                        <Badge variant="outline" color="info" size="xs" shape="round">
                            {model.inputBadge}
                        </Badge>
                    </div>
                    <ul className="grid grid-cols-2 gap-2">
                        {model.inputs.map((input) => (
                            <li
                                key={input}
                                className="bg-primary-subtle typo-body-l-medium text-label-foreground flex min-h-10 items-center justify-center px-2 text-center break-keep"
                            >
                                {input}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border-primary bg-panel-raised flex items-center justify-center gap-2 rounded-sm border px-2 py-3">
                    <p className="typo-body-xl-bold text-primary-strong">{model.outcome}</p>
                    <Badge variant="solid-pastel" color="info" size="xs" shape="round">
                        {outcomeBadge}
                    </Badge>
                </div>
            </div>
        </li>
    )
}

const InvestmentModelStructureDiagram = () => {
    const [growthModel, recoveryModel] = INVESTMENT_MODEL_DIAGRAM.models

    return (
        <div className="bg-panel-subtle flex justify-center px-4 py-12 md:px-6">
            <ScrollReveal className="w-full max-w-186">
                <ul className="flex flex-col items-center md:flex-row md:items-stretch">
                    <ModelCard model={growthModel} />
                    {/* 결합평가 — 두 카드 사이 104(모바일은 위아래 사이). 화살표 그림은 꾸밈이라 읽지 않고, 글만 읽는다. */}
                    <li className="flex shrink-0 flex-col items-center justify-center gap-1 py-4 md:w-26 md:py-0">
                        <div className="grid place-items-center *:col-start-1 *:row-start-1 max-md:my-2.5 max-md:rotate-90">
                            <svg
                                aria-hidden="true"
                                viewBox={`0 0 ${COMBINE_VIEW.width} ${COMBINE_VIEW.height}`}
                                className="w-19"
                            >
                                {COMBINE_LINES.map((line) => (
                                    <path
                                        key={line}
                                        d={line}
                                        strokeWidth={1}
                                        pathLength={1}
                                        strokeDasharray="1 2"
                                        className="stroke-foreground-subtle motion-safe:group-data-[revealed=true]/reveal:animate-chart-draw fill-none"
                                    />
                                ))}
                                {COMBINE_ARROWS.map((points) => (
                                    <polygon
                                        key={points}
                                        points={points}
                                        className="fill-foreground-subtle motion-safe:group-data-[revealed=true]/reveal:animate-chart-label"
                                    />
                                ))}
                            </svg>
                            <span
                                aria-hidden="true"
                                className="bg-foreground-subtle text-panel-raised motion-safe:group-data-[revealed=true]/reveal:animate-chart-pop flex size-6 items-center justify-center rounded-full"
                            >
                                <Plus className="size-icon-sm" />
                            </span>
                        </div>
                        <p className="typo-body-l-medium text-label-foreground">
                            {INVESTMENT_MODEL_DIAGRAM.combineLabel}
                        </p>
                    </li>
                    <ModelCard model={recoveryModel} />
                </ul>
            </ScrollReveal>
        </div>
    )
}

export {InvestmentModelStructureDiagram}
