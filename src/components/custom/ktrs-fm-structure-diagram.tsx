'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'
import {MoveRight, Sparkles, Target, UserCheck} from 'lucide-react'
import {PlatformDiagramBadge} from '@/components/custom/platform-diagram-badge'
import {platformDiagramBoxClassName, platformDiagramSurfaceClassName} from '@/components/theme/platform-intro.variants'
import {
    KTRS_FM_DIAGRAM,
    type KtrsFmEvaluationTime,
    type KtrsFmGradeSample,
} from '@/content/service/platform-technology-evaluation'
import {cn} from '@/lib/utils'

// KtrsFmStructureDiagram — KTRS-FM(신속표준모형) 구조도를 글 · 도형으로 그린다(플랫폼 소개 > 기술평가 모형 상세 탭).
// 짜임: 계승 문구 상자 → 두 칸(핵심 평가항목 선정 — 평가 항목수 막대 | 고객 친화적 평가모형 — 체크리스트 태그)
//       → 두 상자(실시간 등급산출(예시) | 예상 평가 시간 게이지).
//   · PC(1280↑): 두 칸이 같은 폭으로 나란히 놓이고 가운데 세로선. 두 칸의 제목 · 라벨 · 상자 줄 높이를 맞춘다(subgrid).
//     1280 미만: 한 칸씩 쌓이고 사이에 가로선.
//   · 예상 평가 시간 — 상자가 화면에 40% 보이면 호가 12시부터 그려지고 · 띠가 왼쪽부터 펼쳐지고 · 호 끝 점이 나타난다(한 번).
//     동작 줄이기면 처음부터 다 그려져 있다[6.3.1].
//   · 그림이 아니라 글이라 낭독기가 읽는다[5.1.1]. 문구 · 수치는 content/service/platform-technology-evaluation.ts 의 KTRS_FM_DIAGRAM.

const GRADE_TONE_CLASS: Record<KtrsFmGradeSample['tone'], {head: string; body: string; grade: string}> = {
    primary: {head: 'bg-primary text-primary-foreground', body: 'bg-primary-subtle', grade: 'text-primary-strong'},
    purple: {head: 'bg-purple-600 text-purple-10', body: 'bg-purple-50', grade: 'text-purple-600'},
    neutral: {head: 'bg-gray-500 text-gray-10', body: 'bg-panel-subtle', grade: 'text-foreground'},
}

// 소제목 — 배지 · 제목(17 Bold) 한 줄, 아래 설명(14).
const ColumnTitle = ({icon, title, description}: {icon: ReactNode; title: string; description: string}) => (
    <h5 className="typo-title-m-bold text-foreground mb-3 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2.5 break-keep">
        <PlatformDiagramBadge>{icon}</PlatformDiagramBadge>
        {title}
        <span className="typo-body-l-regular text-label-foreground col-span-full mt-2 block">{description}</span>
    </h5>
)

// 평가 항목수 — 이름(14 Bold) · 대상(12) | 둥근 막대 | 개수. 막대 길이 = 가장 많은 항목수에 대한 비율.
// KTRS-FM(강조)은 강조색 그라데이션 막대 · 글자. 모바일은 막대가 이름 아래 줄로 내려간다.
const ItemCountBars = () => {
    const {counts, countUnit, countLabel} = KTRS_FM_DIAGRAM.itemSelection
    const maxCount = Math.max(...counts.map((item) => item.count))

    return (
        <ul aria-label={`모형별 ${countLabel}`} className={cn(platformDiagramBoxClassName, 'grid gap-3.5 px-5 py-4.5')}>
            {counts.map((item) => {
                const isHighlighted = 'isHighlighted' in item && item.isHighlighted
                return (
                    <li
                        key={item.model}
                        className={cn(
                            'typo-body-l-regular grid grid-cols-[minmax(0,1fr)_--spacing(11)] items-center gap-3 md:grid-cols-[--spacing(37.5)_minmax(0,1fr)_--spacing(12)]',
                            isHighlighted ? 'text-platform-accent-foreground' : 'text-foreground',
                        )}
                    >
                        <span className="typo-body-l-bold">
                            {item.model}
                            <small
                                className={cn(
                                    'typo-caption-medium block whitespace-pre-line',
                                    !isHighlighted && 'text-foreground-subtle',
                                )}
                            >
                                {item.target}
                            </small>
                        </span>
                        <span
                            aria-hidden="true"
                            className="bg-platform-accent/8 col-span-full row-start-2 h-3 overflow-hidden rounded-full md:col-span-1 md:row-start-auto"
                        >
                            <span
                                className={cn(
                                    'block h-full rounded-full bg-linear-to-r',
                                    isHighlighted
                                        ? 'from-platform-accent-bright to-platform-accent shadow-sm'
                                        : 'from-platform-bar-start to-platform-bar-end',
                                )}
                                style={{width: `${(item.count / maxCount) * 100}%`}}
                            />
                        </span>
                        <b className="typo-body-l-bold col-start-2 row-start-1 text-right md:col-start-auto md:row-start-auto">
                            {item.count}
                            {countUnit}
                        </b>
                    </li>
                )
            })}
        </ul>
    )
}

// 체크리스트 — 묶음 이름 | 태그. 마지막 묶음 끝은 점선 '…' 칸(그 외 항목, 낭독기는 moreLabel).
const ChecklistGroups = () => (
    <dl className="grid gap-2.5 xl:auto-rows-fr">
        {KTRS_FM_DIAGRAM.customerFriendly.groups.map((group) => (
            <div
                key={group.title}
                className={cn(
                    platformDiagramBoxClassName,
                    'grid items-center gap-2 rounded-md px-5 py-4 md:grid-cols-[--spacing(32.5)_minmax(0,1fr)] md:gap-3',
                )}
            >
                <dt className="typo-body-l-bold text-foreground">{group.title}</dt>
                <dd>
                    <ul className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                            <li
                                key={item}
                                className="typo-body-m-bold bg-platform-panel-inset border-platform-panel-border text-label-foreground inline-flex min-h-7.5 items-center rounded-xs border px-2.75 py-1 break-keep"
                            >
                                {item}
                            </li>
                        ))}
                        {'moreLabel' in group ? (
                            <li
                                aria-label={group.moreLabel}
                                className="typo-body-m-bold border-platform-panel-border text-label-foreground inline-flex min-h-7.5 items-center rounded-xs border border-dashed px-2.75 py-1"
                            >
                                <span aria-hidden="true">…</span>
                            </li>
                        ) : null}
                    </ul>
                </dd>
            </div>
        ))}
    </dl>
)

// 실시간 등급산출(예시) — 칸 3개. 칸 = 색 머리(줄바꿈돼도 세 칸 높이를 맞춘다 — subgrid) + 옅은 바탕 안 둥근 흰 칸에 등급.
const GradeSamples = () => (
    <ul className="grid grid-cols-3 grid-rows-[auto_1fr] gap-x-2 md:gap-x-3.5">
        {KTRS_FM_DIAGRAM.grade.grades.map(({label, grade, tone}) => {
            const toneClass = GRADE_TONE_CLASS[tone]
            return (
                <li key={label} className="row-span-2 grid min-w-0 grid-rows-subgrid overflow-hidden rounded-md">
                    {/* 짧은 굵은 글이라 문단(p)이면 제목처럼 보인다(WAVE Possible heading) — span 으로 둔다. */}
                    <span
                        className={cn(
                            'typo-body-l-bold grid place-items-center px-1 py-2.5 text-center whitespace-pre-line md:px-2 md:py-4',
                            toneClass.head,
                        )}
                    >
                        {label}
                    </span>
                    <span
                        className={cn('flex items-center justify-center px-1 py-2.5 md:px-3 md:py-5', toneClass.body)}
                    >
                        <span
                            className={cn(
                                'bg-panel-raised grid size-14.5 place-items-center rounded-lg shadow-sm md:size-25 md:rounded-2xl',
                                grade.length > 2 ? 'typo-platform-grade-sm-bold' : 'typo-platform-grade-bold',
                                toneClass.grade,
                            )}
                        >
                            {grade}
                        </span>
                    </span>
                </li>
            )
        })}
    </ul>
)

// 예상 평가 시간 — 두 원(KTRS 30분 → KTRS-FM 5분)과 그 사이 띠를 SVG 하나로 그린다(332 × 140, 띠가 두 원에 걸쳐 겹친다).
//   · 원: 고리(muted) 위에 12시부터 시계 방향으로 호(둥근 끝)를 칠하고, 호 끝에 점을 둔다. 안쪽은 알약과 같은 면.
//     KTRS 지름 124 · 고리 18 · 회색 호 / KTRS-FM 지름 140 · 고리 20 · 파란 호. 호 각도는 콘텐츠의 arcDegrees.
//   · 띠: 두 원의 위 · 아래 끝을 잇는 사다리꼴, 앞 원 가운데에서 옅은 남색(navy.100)으로 시작해 뒤 원 쪽으로 투명해진다.
// 글(분 · 모형명)은 낭독되도록 SVG 밖 HTML 로 두고, 같은 열 비율(124 : 68 : 140)의 그리드로 원 가운데에 겹친다.
const TIME_VIEW = {width: 332, height: 140}
const TIME_RINGS = [
    {cx: 62, outerRadius: 62, strokeWidth: 18},
    {cx: 262, outerRadius: 70, strokeWidth: 20},
] as const
const RING_END_DOT_RADIUS = 3
const DEGREES_PER_HALF_TURN = 180
const TIME_BAND_GRADIENT_ID = 'ktrs-fm-time-band'
// 그리기 시작하는 보이는 비율(상자의 40%).
const TIME_INVIEW_THRESHOLD = 0.4
// 그리는 모션 — 0.9초 · 감속 곡선. 호 끝 점은 0.8초 뒤 0.3초에 걸쳐 나타난다.
const DRAW_CLASS =
    'motion-safe:transition-[stroke-dashoffset,clip-path] motion-safe:duration-900 motion-safe:ease-in-out'

const toRadians = (degrees: number) => (degrees / DEGREES_PER_HALF_TURN) * Math.PI

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

const TimeRingTrack = ({index}: {index: number}) => {
    const ring = TIME_RINGS[index]
    if (!ring) return null
    return (
        <circle
            cx={ring.cx}
            cy={TIME_VIEW.height / 2}
            r={ring.outerRadius - ring.strokeWidth / 2}
            strokeWidth={ring.strokeWidth}
            className="stroke-muted fill-none"
        />
    )
}

const TimeRingFace = ({index, time, isDrawn}: {index: number; time: KtrsFmEvaluationTime; isDrawn: boolean}) => {
    const ring = TIME_RINGS[index]
    if (!ring) return null
    const cy = TIME_VIEW.height / 2
    const radius = ring.outerRadius - ring.strokeWidth / 2
    const arc = arcGeometry(ring.cx, cy, radius, ring.strokeWidth, time.arcDegrees)
    return (
        <>
            <circle
                cx={ring.cx}
                cy={cy}
                r={ring.outerRadius - ring.strokeWidth}
                className="fill-platform-panel-inset"
            />
            <path
                d={arc.path}
                strokeWidth={ring.strokeWidth}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 2"
                strokeDashoffset={isDrawn ? 0 : 1}
                className={cn(DRAW_CLASS, 'fill-none', time.isHighlighted ? 'stroke-primary' : 'stroke-chart-5')}
            />
            <circle
                cx={arc.end.x}
                cy={arc.end.y}
                r={RING_END_DOT_RADIUS}
                className={cn(
                    'fill-platform-panel-inset motion-safe:transition-opacity motion-safe:delay-800 motion-safe:duration-300',
                    !isDrawn && 'motion-safe:opacity-0',
                )}
            />
        </>
    )
}

const EvaluationTimeGauge = () => {
    const ref = useRef<HTMLDivElement>(null)
    // 동작 줄이기면 처음부터 그려진 모습(motion-safe 밖에서는 감추지 않는다).
    const [isDrawn, setIsDrawn] = useState(false)
    const {times, minuteUnit} = KTRS_FM_DIAGRAM.evaluationTime
    const [before, after] = times
    const [beforeRing, afterRing] = TIME_RINGS
    const cy = TIME_VIEW.height / 2
    const bandPoints = [
        `${beforeRing.cx},${cy - beforeRing.outerRadius}`,
        `${afterRing.cx},${cy - afterRing.outerRadius}`,
        `${afterRing.cx},${cy + afterRing.outerRadius}`,
        `${beforeRing.cx},${cy + beforeRing.outerRadius}`,
    ].join(' ')

    useEffect(() => {
        const element = ref.current
        if (!element) return undefined
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) return
                setIsDrawn(true)
                observer.disconnect()
            },
            {threshold: TIME_INVIEW_THRESHOLD},
        )
        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    return (
        <div ref={ref} className="grid w-full max-w-83 *:col-start-1 *:row-start-1">
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
                    className={cn(DRAW_CLASS, !isDrawn && 'motion-safe:[clip-path:inset(0_100%_0_0)]')}
                />
                {before ? <TimeRingFace index={0} time={before} isDrawn={isDrawn} /> : null}
                <TimeRingTrack index={1} />
                {after ? <TimeRingFace index={1} time={after} isDrawn={isDrawn} /> : null}
            </svg>
            <ul className="grid grid-cols-[124fr_68fr_140fr] items-center">
                {times.map((time, index) => (
                    <li
                        key={time.model}
                        className={cn(
                            'flex flex-col items-center',
                            index > 0 && 'col-start-3',
                            'isHighlighted' in time && time.isHighlighted
                                ? 'text-primary-strong'
                                : 'text-foreground [&>span+span]:text-label-foreground',
                        )}
                    >
                        <span className="typo-platform-gauge-value-regular">
                            <b className="font-bold">{time.minutes}</b>
                            {minuteUnit}
                        </span>
                        <span className="typo-platform-gauge-label-regular">{time.model}</span>
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

// 두 상자 공통 — 제목(18 Bold) 가운데 · 내용.
const PAIR_BOX_CLASS = cn(
    platformDiagramBoxClassName,
    'grid grid-rows-[auto_1fr] gap-4 px-3.5 py-4.5 md:px-6.5 md:pt-6.5 md:pb-7',
)

const KtrsFmStructureDiagram = () => {
    const {lineage, itemSelection, customerFriendly, grade, evaluationTime} = KTRS_FM_DIAGRAM

    return (
        <div className={platformDiagramSurfaceClassName}>
            {/* 계승 문구 — 강조색이 왼쪽에서 옅어지는 상자. */}
            <p
                className={cn(
                    platformDiagramBoxClassName,
                    'from-platform-accent/8 to-platform-panel mb-7 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-md bg-linear-to-r to-60% px-5 py-3.5',
                )}
            >
                <PlatformDiagramBadge size="md">
                    <Sparkles />
                </PlatformDiagramBadge>
                <span className="grid min-w-0 gap-0.5">
                    <span className="typo-body-xl-bold text-foreground break-keep">{lineage.title}</span>
                    <small className="typo-body-m-medium text-foreground-subtle">{lineage.note}</small>
                </span>
            </p>

            {/* 두 칸 — PC 는 제목 · 라벨 · 상자 줄을 subgrid 로 맞추고 가운데 세로선, 1280 미만은 쌓고 가로선. */}
            <div className="xl:before:bg-platform-panel-border relative grid gap-6 xl:grid-cols-2 xl:grid-rows-[auto_auto_1fr] xl:gap-x-20 xl:gap-y-0 xl:before:absolute xl:before:inset-y-0 xl:before:left-1/2 xl:before:w-px">
                <div className="xl:row-span-3 xl:grid xl:grid-rows-subgrid">
                    <ColumnTitle
                        icon={<Target />}
                        title={itemSelection.title}
                        description={itemSelection.description}
                    />
                    <p className="typo-body-m-bold text-foreground-subtle mb-2">{itemSelection.countLabel}</p>
                    <ItemCountBars />
                </div>
                <div className="border-platform-panel-border max-xl:border-t max-xl:pt-6 xl:row-span-3 xl:grid xl:grid-rows-subgrid">
                    <ColumnTitle
                        icon={<UserCheck />}
                        title={customerFriendly.title}
                        description={customerFriendly.description}
                    />
                    <p className="typo-body-m-bold text-foreground-subtle mb-2">
                        {customerFriendly.optimizationLabel}
                        <span className="typo-body-m-medium text-label-foreground border-platform-panel-border ml-2 border-l pl-2.25">
                            {customerFriendly.checklistLabel}
                        </span>
                    </p>
                    <ChecklistGroups />
                </div>
            </div>

            {/* 두 상자 — 같은 높이로 나란히(1280 미만은 쌓는다). */}
            <div className="mt-6 grid gap-4 xl:mt-8 xl:grid-cols-2 xl:gap-6">
                <div className={PAIR_BOX_CLASS}>
                    <h5 className="typo-title-m-bold text-foreground text-center">{grade.title}</h5>
                    <GradeSamples />
                </div>
                <div className={cn(PAIR_BOX_CLASS, 'justify-items-center')}>
                    <h5 className="typo-title-m-bold text-foreground">{evaluationTime.title}</h5>
                    <div className="bg-platform-panel-inset flex w-full max-w-105 justify-center self-center rounded-full py-3 pr-2.5 pl-3 md:py-6 md:pr-6 md:pl-8">
                        <EvaluationTimeGauge />
                    </div>
                </div>
            </div>
        </div>
    )
}

export {KtrsFmStructureDiagram}
