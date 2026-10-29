import {ListMarker} from '@/components/custom/list-marker'
import {ScrollReveal} from '@/components/custom/scroll-reveal'
import {TECH_INDEX_DIAGRAM} from '@/content/service/platform-technology-evaluation'
import {cn} from '@/lib/utils'

// TechIndexStructureDiagram — 혁신성장역량지수(Tech-Index) 산출 흐름도를 글 · 도형으로 그린다.
// 쓰는 곳: 플랫폼 소개 > 기술평가 Tech-Index 탭. 문구는 content/service/platform-technology-evaluation.ts 의 TECH_INDEX_DIAGRAM.
//
// 알아둘 점
//   · 그림이 아니라 글이라 화면 낭독기가 읽고[5.1.1] 모바일에서 글자가 줄지 않는다.
//   · 연결선(FlowConnector)은 흐름도 폭 480 기준 SVG 좌표다 — 두 칸 폭 · 사이를 바꾸면 아래 좌표 상수도 함께 고친다.
//     모바일은 같은 비율로 줄어 연결선이 칸 가운데에 계속 닿는다.
//   · 겹친 칸은 panel-subtle · panel-inset · panel-raised 를 번갈아 써 다크에서도 구분된다.
//   · 화면에 들어오면 연결선이 위에서 아래로 그려진다. 동작 줄이기면 처음부터 다 그려져 있다[6.3.1].

// 흐름도 폭 480 — 연결선 SVG 의 가로 좌표계. 두 칸 가운데는 114 · 366, 흐름 가운데는 240.
const FLOW_WIDTH = 480
const FLOW_CENTER = 240
const METHOD_CENTERS = [114, 366] as const
const ARROW_HALF_WIDTH = 3
const ARROW_HEIGHT = 5

// 칸 머리 · 몸 — 높이 53(여백 위아래 16) · 가운데 글.
const CELL_CLASS_NAME = 'px-2 py-4 text-center break-keep'

type FlowConnectorProps = {
    /** 연결선 칸 높이(시안 32 · 24). */
    height: number
    /** 그릴 선(path d). 위에서 아래로 그려진다. */
    lines: readonly string[]
    /** 화살촉 끝(아래 꼭짓점)의 x — 칸 아래 끝에 닿는다. */
    arrowXs: readonly number[]
}

const FlowConnector = ({height, lines, arrowXs}: FlowConnectorProps) => (
    <svg aria-hidden="true" viewBox={`0 0 ${FLOW_WIDTH} ${height}`} className="block h-auto w-full">
        {lines.map((line) => (
            <path
                key={line}
                d={line}
                strokeWidth={2}
                pathLength={1}
                strokeDasharray="1 2"
                className="stroke-foreground-subtle/50 motion-safe:group-data-[revealed=true]/reveal:animate-chart-draw fill-none"
            />
        ))}
        {arrowXs.map((x) => (
            <polygon
                key={x}
                points={`${x - ARROW_HALF_WIDTH},${height - ARROW_HEIGHT} ${x + ARROW_HALF_WIDTH},${height - ARROW_HEIGHT} ${x},${height}`}
                className="fill-foreground-subtle motion-safe:group-data-[revealed=true]/reveal:animate-chart-label"
            />
        ))}
    </svg>
)

// 연결선 — 시안 좌표(흐름도 480 기준). 가로선은 칸 사이 높이의 가운데(16 · 32 칸), 세로선은 화살촉 위까지.
const SPLIT_CONNECTOR = {
    height: 32,
    lines: [
        `M ${FLOW_CENTER} 0 V 16`,
        `M ${FLOW_CENTER} 16 H ${METHOD_CENTERS[0]} V 27`,
        `M ${FLOW_CENTER} 16 H ${METHOD_CENTERS[1]} V 27`,
    ],
    arrowXs: METHOD_CENTERS,
}
const MERGE_CONNECTOR = {
    height: 32,
    lines: [
        `M ${METHOD_CENTERS[0]} 0 V 16 H ${FLOW_CENTER}`,
        `M ${METHOD_CENTERS[1]} 0 V 16 H ${FLOW_CENTER}`,
        `M ${FLOW_CENTER} 16 V 27`,
    ],
    arrowXs: [FLOW_CENTER],
}
const RESULT_CONNECTOR = {height: 24, lines: [`M ${FLOW_CENTER} 0 V 19`], arrowXs: [FLOW_CENTER]}

const TechIndexStructureDiagram = () => {
    const {indicators, methods, sectors, result, notes} = TECH_INDEX_DIAGRAM

    return (
        <div className="bg-panel-subtle flex flex-col items-center gap-6 px-4 py-12 md:px-6">
            {/* 흐름도 — 역량지표 → 평가 방식 → 4대 부문 → 지수. 순서대로 읽는 목록(ol)이다. */}
            <ScrollReveal className="flex w-full max-w-120 flex-col items-center">
                <ol className="flex w-full flex-col items-center">
                    <li className="flex w-full flex-col items-center">
                        <p className={cn(CELL_CLASS_NAME, 'typo-body-l-bold text-navy-10 bg-navy-500 w-full max-w-57')}>
                            {indicators}
                        </p>
                        <FlowConnector {...SPLIT_CONNECTOR} />
                    </li>
                    <li className="flex w-full flex-col">
                        <ul className="grid grid-cols-[19fr_2fr_19fr]">
                            {methods.map((method, index) => (
                                <li key={method.title} className={cn('flex flex-col', index > 0 && 'col-start-3')}>
                                    <p
                                        className={cn(
                                            CELL_CLASS_NAME,
                                            'typo-body-l-bold bg-primary text-primary-foreground',
                                        )}
                                    >
                                        {method.title}
                                    </p>
                                    <p
                                        className={cn(
                                            CELL_CLASS_NAME,
                                            'typo-body-l-medium text-label-foreground bg-primary-subtle flex-1',
                                        )}
                                    >
                                        {method.basis}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <FlowConnector {...MERGE_CONNECTOR} />
                    </li>
                    <li className="flex w-full flex-col">
                        <ul className="bg-panel-inset grid grid-cols-2 gap-4 p-4">
                            {sectors.map((sector) => (
                                <li
                                    key={sector}
                                    className={cn(
                                        CELL_CLASS_NAME,
                                        'typo-body-l-medium text-label-foreground bg-panel-raised',
                                    )}
                                >
                                    {sector}
                                </li>
                            ))}
                        </ul>
                        <FlowConnector {...RESULT_CONNECTOR} />
                    </li>
                    <li className="flex w-full justify-center">
                        <p
                            className={cn(
                                CELL_CLASS_NAME,
                                'typo-body-l-bold text-purple-10 w-full max-w-57 bg-purple-600',
                            )}
                        >
                            {result}
                        </p>
                    </li>
                </ol>
            </ScrollReveal>

            {/* 안내 상자 */}
            <ScrollReveal className="w-full max-w-186">
                <ul className="typo-body-l-regular text-label-foreground border-navy-200 bg-navy-100 flex flex-col gap-1 rounded-sm border p-6">
                    {notes.map((note) => (
                        <li key={note} className="flex">
                            <ListMarker className="h-lh" />
                            <span className="break-keep">{note}</span>
                        </li>
                    ))}
                </ul>
            </ScrollReveal>
        </div>
    )
}

export {TechIndexStructureDiagram}
