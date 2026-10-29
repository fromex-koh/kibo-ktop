import Image from 'next/image'
import {MoveRight} from 'lucide-react'
import ktrsFmIcon from '@public/images/platform-technology-evaluation/ktrs-fm-icon.webp'
import {ListMarker} from '@/components/custom/list-marker'
import {ScrollReveal} from '@/components/custom/scroll-reveal'
import {
    KTRS_FM_DIAGRAM,
    type KtrsFmEvaluationTime,
    type KtrsFmGradeSample,
} from '@/content/service/platform-technology-evaluation'
import {cn} from '@/lib/utils'

// KtrsFmStructureDiagram — KTRS-FM(신속표준모형) 구조도(평가항목 · 체크리스트 · 등급 · 예상 평가 시간)를 글 · 도형으로 그린다.
// 쓰는 곳: 플랫폼 소개 > 기술평가 KTRS-FM 탭. 문구 · 수치는 content/service/platform-technology-evaluation.ts 의 KTRS_FM_DIAGRAM.
//
// 알아둘 점
//   · 그림이 아니라 글이라 화면 낭독기가 읽고[5.1.1] 모바일에서 글자가 줄지 않는다.
//   · 예상 평가 시간 원 · 띠는 SVG 계산(arcGeometry · TIME_RINGS)으로 그린다 — 크기를 바꾸면 그 상수만 고친다.
//   · 겹친 칸은 panel-subtle · panel-raised 를 번갈아 써 다크에서도 구분된다. 진한 칸 머리는 팔레트 단계 짝(gray-500 · gray-10 등)이라
//     다크에서 함께 반사돼 대비가 유지된다.
//   · 덩어리마다 화면에 들어오면 떠오르고 막대 · 원이 그려진다. 동작 줄이기면 처음부터 다 그려져 있다[6.3.1].

// 칸 머리 — 회색 면 + 가운데 굵은 글(14 Bold) · 위아래 여백 16(높이 53).
const CELL_HEAD_CLASS_NAME = 'typo-body-l-bold px-2 py-4 text-center break-keep'
// 흰 칸 — 높이 40 에 글(14 Medium) 가운데.
const CHIP_CLASS_NAME =
    'bg-panel-raised typo-body-l-medium text-label-foreground flex min-h-10 items-center justify-center px-2 py-2 text-center break-keep'

const GRADE_TONE_CLASS: Record<KtrsFmGradeSample['tone'], {head: string; body: string; grade: string}> = {
    primary: {head: 'bg-primary text-primary-foreground', body: 'bg-primary-subtle', grade: 'text-primary-strong'},
    purple: {head: 'bg-purple-600 text-purple-10', body: 'bg-purple-50', grade: 'text-purple-600'},
    neutral: {head: 'bg-gray-500 text-gray-10', body: 'bg-panel-subtle', grade: 'text-foreground'},
}

// 소제목 묶음 — 제목(18 Bold) + 설명(14) · 사이 4.
const SectionTitle = ({title, description}: {title: string; description: string}) => (
    <div className="flex flex-col gap-1">
        <h4 className="typo-title-m-bold text-foreground break-keep">{title}</h4>
        <p className="typo-body-l-regular text-label-foreground break-keep">{description}</p>
    </div>
)

// ① 평가 항목수 — 모형 이름(14 Medium · 강조 Bold) · 대상(12) | 막대(높이 24) + 개수(16 Bold + 개).
// 막대 길이는 가장 많은 항목수를 막대 칸 전체로 한 비율이다. 강조 줄(KTRS-FM)은 글 · 막대가 파랑.
// 흰 판이 화면에 들어와 떠오를 때 막대가 왼쪽부터 자란다(감싼 ScrollReveal 의 group/reveal).
// 모바일은 이름 칸이 막대 위로 올라간다(칸 폭이 좁아 140 칸을 두면 막대가 사라진다).
const ItemCountList = () => {
    const {counts, countUnit} = KTRS_FM_DIAGRAM.itemSelection
    const maxCount = Math.max(...counts.map((item) => item.count))

    return (
        <ul className="bg-panel-subtle flex flex-col gap-4 p-4 md:gap-2 md:p-6">
            {counts.map((item) => {
                const isHighlighted = 'isHighlighted' in item && item.isHighlighted
                const toneClassName = isHighlighted ? 'text-primary-strong' : 'text-label-foreground'

                return (
                    <li key={item.model} className="flex flex-col gap-2 md:flex-row md:items-center md:gap-0">
                        <p className={cn('flex flex-col md:w-35 md:shrink-0', toneClassName)}>
                            <span className={isHighlighted ? 'typo-body-l-bold' : 'typo-body-l-medium'}>
                                {item.model}
                            </span>
                            <span className="typo-caption-regular whitespace-pre-line">{item.target}</span>
                        </p>
                        <div className="flex min-w-0 flex-1 items-center gap-5">
                            <div aria-hidden="true" className="h-6 min-w-0 flex-1">
                                <div
                                    className={cn(
                                        'motion-safe:group-data-[revealed=true]/reveal:animate-chart-wipe-right h-full',
                                        isHighlighted ? 'bg-primary' : 'bg-chart-5',
                                    )}
                                    style={{width: `${(item.count / maxCount) * 100}%`}}
                                />
                            </div>
                            <p className={cn('typo-body-xl-regular shrink-0', toneClassName)}>
                                <span className={cn('typo-body-xl-bold', !isHighlighted && 'text-foreground')}>
                                    {item.count}
                                </span>
                                {countUnit}
                            </p>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

// ② 10개 소항목 체크리스트 — 기업정보(2열 칸 4개) | 선택항목(1열 칸 3개), 두 묶음 사이 24. 묶음 = 회색 머리 + 회색 바탕(여백 16) 안 흰 칸(사이 8).
const ChecklistGroup = ({
    title,
    items,
    isTwoColumn,
}: {
    title: string
    items: readonly string[]
    isTwoColumn?: boolean
}) => (
    <div className="flex flex-col">
        <p className={cn(CELL_HEAD_CLASS_NAME, 'text-gray-10 bg-gray-500')}>{title}</p>
        <ul className={cn('bg-panel-subtle grid flex-1 content-start gap-2 p-4', isTwoColumn && 'grid-cols-2')}>
            {items.map((item) => (
                <li key={item} className={CHIP_CLASS_NAME}>
                    {item}
                </li>
            ))}
        </ul>
    </div>
)

// ② 실시간 등급산출(예시) — 칸 3개(사이 24). 칸 = 색 머리 + 옅은 바탕(여백 16) 안 흰 둥근 칸(88)에 등급(AA 32 Bold · 그 외 28 Bold).
// 등급은 짧고 큰 굵은 글이라 문단(p)으로 두면 제목처럼 보인다(WAVE Possible heading) — 칸 머리에 딸린 값이라 span 으로 둔다.
const GradeSample = ({label, grade, tone}: KtrsFmGradeSample) => {
    const toneClass = GRADE_TONE_CLASS[tone]

    return (
        <li className="flex flex-col">
            <p className={cn(CELL_HEAD_CLASS_NAME, toneClass.head)}>{label}</p>
            <div className={cn('flex justify-center p-4', toneClass.body)}>
                <span
                    className={cn(
                        'bg-panel-raised flex size-22 items-center justify-center rounded-2xl',
                        grade.length > 2 ? 'typo-h2-bold' : 'typo-h1-bold',
                        toneClass.grade,
                    )}
                >
                    {grade}
                </span>
            </div>
        </li>
    )
}

// 예상 평가 시간 — 두 원(KTRS 30분 → KTRS-FM 5분)과 그 사이 띠를 SVG 하나로 그린다(시안 332 × 140, 띠가 두 원에 걸쳐 겹치기 때문).
//   · 원: 회색 고리(gauge-track) 위에 12시부터 시계 방향으로 호(둥근 끝)를 칠하고, 호 끝에 흰 점(지름 6)을 둔다. 안쪽은 흰 면.
//     KTRS 지름 124 · 고리 두께 18 · 회색 호 / KTRS-FM 지름 140 · 두께 20 · 파란 호. 호 각도는 콘텐츠의 arcDegrees(시안 값).
//   · 띠: 두 원의 위 · 아래 끝을 잇는 사다리꼴. 앞 원 가운데에서 옅은 남색(navy.100)으로 시작해 뒤 원 쪽으로 투명해진다.
//     앞 원의 오른쪽 고리 위까지 덮고(시안), 뒤 원은 띠 위에 그린다. 앞 원의 흰 안쪽 면 · 호는 띠 위에 다시 그린다.
// 글(분 · 모형명)은 낭독되도록 SVG 밖 HTML 로 두고, 같은 열 비율(124 : 68 : 140)의 그리드로 원 가운데에 겹친다.
// 화살표(가는 긴 화살표)는 두 원 사이 칸 가운데. 모바일은 알약이 화면보다 넓어(388) 그림이 폭에 맞춰 줄어든다.
// 그리는 모션 — 이 덩어리가 화면에 들어와 떠오를 때(감싼 ScrollReveal 의 group/reveal) 호가 12시부터 시계 방향으로 그려지고
// (animate-chart-draw) · 띠가 왼쪽부터 펼쳐지며(animate-chart-wipe-right) · 호 끝 흰 점은 호가 다 그려진 뒤 나타난다
// (animate-chart-label). 동작 줄이기면 처음부터 다 그려진 모습이다[6.3.1].
const TIME_VIEW = {width: 332, height: 140}
const TIME_RINGS = [
    {cx: 62, outerRadius: 62, strokeWidth: 18},
    {cx: 262, outerRadius: 70, strokeWidth: 20},
] as const
const RING_END_DOT_RADIUS = 3
const DEGREES_PER_HALF_TURN = 180
const TIME_BAND_GRADIENT_ID = 'ktrs-fm-time-band'

const toRadians = (degrees: number) => (degrees / DEGREES_PER_HALF_TURN) * Math.PI

// 12시에서 시계 방향 angle 만큼 간 점.
const pointOnCircle = (cx: number, cy: number, radius: number, angle: number) => ({
    x: cx + radius * Math.sin(angle),
    y: cy - radius * Math.cos(angle),
})

// 둥근 끝까지 포함해 arcDegrees 를 칠하도록, 끝 반원(두께/2)만큼 양쪽을 줄인 호의 path 와 끝점.
const arcGeometry = (cx: number, cy: number, radius: number, strokeWidth: number, arcDegrees: number) => {
    const capAngle = strokeWidth / 2 / radius
    const start = pointOnCircle(cx, cy, radius, capAngle)
    const endAngle = toRadians(arcDegrees) - capAngle
    const end = pointOnCircle(cx, cy, radius, endAngle)
    const isLargeArc = endAngle - capAngle > Math.PI ? 1 : 0

    return {path: `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${isLargeArc} 1 ${end.x} ${end.y}`, end}
}

const TimeRingFace = ({index, time}: {index: number; time: KtrsFmEvaluationTime}) => {
    const ring = TIME_RINGS[index]
    if (!ring) return null

    const cy = TIME_VIEW.height / 2
    const radius = ring.outerRadius - ring.strokeWidth / 2
    const arc = arcGeometry(ring.cx, cy, radius, ring.strokeWidth, time.arcDegrees)

    return (
        <>
            <circle cx={ring.cx} cy={cy} r={ring.outerRadius - ring.strokeWidth} className="fill-panel-raised" />
            <path
                d={arc.path}
                strokeWidth={ring.strokeWidth}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 2"
                className={cn(
                    'motion-safe:group-data-[revealed=true]/reveal:animate-chart-draw fill-none',
                    time.isHighlighted ? 'stroke-primary' : 'stroke-chart-5',
                )}
            />
            <circle
                cx={arc.end.x}
                cy={arc.end.y}
                r={RING_END_DOT_RADIUS}
                className="fill-panel-raised motion-safe:group-data-[revealed=true]/reveal:animate-chart-label"
            />
        </>
    )
}

const TimeRingTrack = ({index}: {index: number}) => {
    const ring = TIME_RINGS[index]
    if (!ring) return null

    return (
        <circle
            cx={ring.cx}
            cy={TIME_VIEW.height / 2}
            r={ring.outerRadius - ring.strokeWidth / 2}
            strokeWidth={ring.strokeWidth}
            className="stroke-gauge-track fill-none"
        />
    )
}

const EvaluationTimeComparison = ({before, after}: {before: KtrsFmEvaluationTime; after: KtrsFmEvaluationTime}) => {
    const [beforeRing, afterRing] = TIME_RINGS
    const cy = TIME_VIEW.height / 2
    const bandPoints = [
        `${beforeRing.cx},${cy - beforeRing.outerRadius}`,
        `${afterRing.cx},${cy - afterRing.outerRadius}`,
        `${afterRing.cx},${cy + afterRing.outerRadius}`,
        `${beforeRing.cx},${cy + beforeRing.outerRadius}`,
    ].join(' ')

    return (
        <div className="grid w-full max-w-83 *:col-start-1 *:row-start-1">
            <svg aria-hidden="true" viewBox={`0 0 ${TIME_VIEW.width} ${TIME_VIEW.height}`} className="h-auto w-full">
                <defs>
                    <linearGradient
                        id={TIME_BAND_GRADIENT_ID}
                        gradientUnits="userSpaceOnUse"
                        x1={beforeRing.cx}
                        x2={afterRing.cx}
                        y1={0}
                        y2={0}
                    >
                        <stop offset="0" stopColor="var(--ds-navy-100)" />
                        <stop offset="1" stopColor="var(--ds-navy-100)" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <TimeRingTrack index={0} />
                <polygon
                    points={bandPoints}
                    fill={`url(#${TIME_BAND_GRADIENT_ID})`}
                    className="motion-safe:group-data-[revealed=true]/reveal:animate-chart-wipe-right"
                />
                <TimeRingFace index={0} time={before} />
                <TimeRingTrack index={1} />
                <TimeRingFace index={1} time={after} />
            </svg>
            <ul className="grid grid-cols-[124fr_68fr_140fr] items-center">
                {[before, after].map((time, index) => (
                    <li key={time.model} className={cn('flex flex-col items-center', index > 0 && 'col-start-3')}>
                        <span
                            className={cn(
                                'typo-title-l-regular',
                                time.isHighlighted ? 'text-primary-strong' : 'text-foreground',
                            )}
                        >
                            <span className="typo-title-l-bold">{time.minutes}</span>
                            {KTRS_FM_DIAGRAM.evaluationTime.minuteUnit}
                        </span>
                        <span
                            className={cn(
                                'typo-body-m-regular',
                                time.isHighlighted ? 'text-primary-strong' : 'text-label-foreground',
                            )}
                        >
                            {time.model}
                        </span>
                    </li>
                ))}
            </ul>
            <div aria-hidden="true" className="grid grid-cols-[124fr_68fr_140fr] items-center">
                <MoveRight
                    strokeWidth={1.5}
                    className="text-foreground-subtle size-icon-lg col-start-2 justify-self-center"
                />
            </div>
        </div>
    )
}

const KtrsFmStructureDiagram = () => {
    const {itemSelection, customerFriendly, evaluationTime} = KTRS_FM_DIAGRAM
    const [beforeTime, afterTime] = evaluationTime.times

    return (
        <div className="bg-panel-subtle flex flex-col items-center gap-6 px-4 py-12 md:px-6">
            {/* 모형 머리 */}
            <ScrollReveal className="flex flex-col items-center gap-2 text-center">
                {/* 모형 아이콘 — 그림이라 색을 못 바꿔 바탕(model-icon-surface)은 다크에서도 밝다. 모형명과 같은 뜻이라 alt="". */}
                <div className="bg-model-icon-surface flex size-30 items-center justify-center rounded-3xl">
                    <Image src={ktrsFmIcon} alt="" className="size-15" />
                </div>
                <div className="flex flex-col gap-1">
                    <h4 className="typo-title-m-bold text-foreground">{KTRS_FM_DIAGRAM.model}</h4>
                    <p className="typo-body-l-regular text-label-foreground break-keep">
                        {KTRS_FM_DIAGRAM.descriptionLines.map((line) => (
                            <span key={line} className="block">
                                {line}
                            </span>
                        ))}
                    </p>
                </div>
            </ScrollReveal>

            {/* 흰 판 — ① 핵심 평가항목 선정 · ② 고객 친화적 평가모형 */}
            <ScrollReveal className="bg-panel-raised flex w-full max-w-186 flex-col gap-6 px-4 py-6 md:px-10">
                <section className="flex flex-col gap-6">
                    <SectionTitle title={itemSelection.title} description={itemSelection.description} />
                    <div className="flex flex-col gap-2">
                        <h5 className="typo-body-l-bold text-foreground">{itemSelection.countLabel}</h5>
                        <ItemCountList />
                    </div>
                </section>
                <hr className="border-subtle-3" />
                <section className="flex flex-col gap-6">
                    <SectionTitle title={customerFriendly.title} description={customerFriendly.description} />
                    <div className="flex flex-col gap-2">
                        <h5 className="typo-body-l-bold text-foreground">{customerFriendly.optimizationLabel}</h5>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <h6 className="typo-body-l-medium text-label-foreground">
                                    {customerFriendly.checklistLabel}
                                </h6>
                                <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                                    <ChecklistGroup
                                        title={customerFriendly.companyInfo.title}
                                        items={customerFriendly.companyInfo.items}
                                        isTwoColumn
                                    />
                                    <ChecklistGroup
                                        title={customerFriendly.selectionItems.title}
                                        items={customerFriendly.selectionItems.items}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h6 className="typo-body-l-medium text-label-foreground">
                                    {customerFriendly.gradeLabel}
                                </h6>
                                <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
                                    {customerFriendly.grades.map((grade) => (
                                        <GradeSample key={grade.label} {...grade} />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* 예상 평가 시간 — 흰 알약(388 × 188 · 여백 위아래 24 · 왼쪽 32 · 오른쪽 24) 안 두 원 비교 + 아래 점 목록(사이 8). */}
            <ScrollReveal className="w-full">
                <section className="flex flex-col items-center gap-4">
                    <h4 className="typo-title-m-bold text-foreground">{evaluationTime.title}</h4>
                    <div className="flex w-full flex-col items-center gap-2">
                        <div className="bg-panel-raised flex w-full max-w-97 justify-center rounded-full p-4 md:py-6 md:pr-6 md:pl-8">
                            <EvaluationTimeComparison before={beforeTime} after={afterTime} />
                        </div>
                        <ul className="typo-body-xl-regular text-label-foreground flex flex-col items-center gap-1 text-center">
                            {evaluationTime.notes.map((note) => (
                                <li key={note} className="flex">
                                    <ListMarker className="h-lh" />
                                    <span className="break-keep">{note}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    )
}

export {KtrsFmStructureDiagram}
