import {FileBadge} from 'lucide-react'
import {platformCardClassName} from '@/components/theme/platform-intro.variants'
import {cn} from '@/lib/utils'

// 특허 평가등급 카드 — 특허평가 소개 히어로 오른쪽 그림(PlatformHero visual). 결과보고서의 '특허 평가등급' 영역을 줄인 모양이다.
//   · 왼쪽: 항목별 등급(이름 | 등급 칸). 오른쪽(PC 196 · 그보다 좁은 카드는 40%): 평면 방사형 차트(눈금 삼각형 3겹 · 평균 점선 면 · 대상 면 · 꼭짓점 점) + 기울어진 특허 배지.
//   · 화면을 열면 평균 → 대상 면이 차트 가운데에서 퍼지며 나타난다(1.1초, 한 번). 카드 전체는 히어로 카드처럼 떠다닌다.
//     동작 줄이기면 처음부터 다 그려져 있고 움직이지 않는다[6.3.1].
//   · 한 장의 예시 그림이라 role="img" + aria-label 로 한 번에 읽힌다(label).
// 쓰는 곳: custom/platform-patent-evaluation.tsx.

type PlatformPatentGrade = {label: string; grade: string}

// 차트 좌표 — 중심 (100, 100), 세 꼭짓점 방향(위 · 왼쪽 아래 · 오른쪽 아래). 눈금은 바깥 · 가운데 · 안쪽 삼각형.
const RADAR_VIEW_BOX = '26 16 148 132'
const RADAR_GRID = ['100,28 37.65,136 162.35,136', '100,52 58.43,124 141.57,124', '100,76 79.22,112 120.78,112']
const RADAR_AXES = 'M100 100L100 28M100 100L37.65 136M100 100L162.35 136'
const RADAR_AVERAGE = '100,68 65.36,120 134.64,120'
const RADAR_TARGET = [
    {x: 100, y: 60},
    {x: 58.43, y: 124},
    {x: 148.5, y: 128},
] as const
// 퍼짐 모션의 기준점 — 차트 중심(뷰박스 좌표).
const SPREAD_CLASS = 'motion-safe:animate-platform-radar-spread origin-[100px_100px] transform-view'

const PlatformPatentGradeCard = ({
    title,
    grades,
    label,
    className,
}: {
    title: string
    grades: readonly PlatformPatentGrade[]
    /** 그림 전체 설명(낭독기). */
    label: string
    className?: string
}) => (
    <div
        role="img"
        aria-label={label}
        className={cn(
            platformCardClassName,
            'motion-safe:animate-platform-float shadow-lift grid w-full max-w-120 gap-4 p-4.5 hover:[animation-play-state:paused] md:px-5.5 md:pt-5.5 md:pb-5',
            className,
        )}
    >
        <strong className="typo-body-xl-bold text-foreground">{title}</strong>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,40%)] items-center gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,--spacing(49))]">
            <ul className="grid gap-2">
                {grades.map((grade) => (
                    <li
                        key={grade.label}
                        className="border-platform-panel-border typo-body-l-bold text-foreground flex items-center justify-between gap-2 rounded-sm border py-2.25 pr-2.5 pl-3.5"
                    >
                        <span className="min-w-0 break-keep">{grade.label}</span>
                        <b className="typo-body-xl-bold bg-platform-accent-subtle text-foreground min-w-12.5 rounded-xs px-2 py-1.25 text-center">
                            {grade.grade}
                        </b>
                    </li>
                ))}
            </ul>
            <div aria-hidden="true" className="relative pt-2">
                <svg viewBox={RADAR_VIEW_BOX} className="block h-auto w-full overflow-visible">
                    <g className="stroke-platform-radar-line fill-none" strokeWidth={0.8} strokeLinejoin="round">
                        {RADAR_GRID.map((points) => (
                            <polygon key={points} points={points} />
                        ))}
                        <path d={RADAR_AXES} />
                    </g>
                    <polygon
                        points={RADAR_AVERAGE}
                        strokeWidth={1.15}
                        strokeDasharray="3 2.4"
                        className={cn('fill-platform-radar-target/10 stroke-platform-radar-average', SPREAD_CLASS)}
                    />
                    {/* 대상 면 · 점은 평균보다 0.24초 늦게 퍼진다. */}
                    <g className={cn('[--platform-spread-delay:0.59s]', SPREAD_CLASS)}>
                        <polygon
                            points={RADAR_TARGET.map((point) => `${point.x},${point.y}`).join(' ')}
                            strokeWidth={1.5}
                            strokeLinejoin="round"
                            className="fill-platform-radar-target/28 stroke-platform-radar-target"
                        />
                        {RADAR_TARGET.map((point) => (
                            <circle
                                key={`${point.x}-${point.y}`}
                                cx={point.x}
                                cy={point.y}
                                r={2.6}
                                strokeWidth={1.5}
                                className="fill-platform-panel stroke-platform-radar-target"
                            />
                        ))}
                    </g>
                </svg>
                {/* 배지 뒤 보라 번짐 — 배지(52)보다 6씩 작은 면을 아래로 10 내려 흐리게 깐 것(시안 box-shadow 0 10px 20px -6px 배지색 70%).
                    그림자 토큰은 검정 · 흰색만 받아서 배지색 면 + blur-md 로 만든다. DOM 이 배지보다 앞이라 배지 뒤에 깔린다. */}
                <span className="bg-platform-radar-badge-end/70 absolute top-0.5 -right-0.5 size-10 rotate-8 rounded-lg blur-md" />
                {/* 배지 — 윗변의 옅은 흰 선(border-t)은 시안의 안쪽 하이라이트(inset 0 1px 흰색 35%). */}
                <span className="from-platform-radar-badge-start to-platform-radar-badge-end absolute -top-3.5 -right-2 grid size-13 rotate-8 place-items-center rounded-lg border-t border-white/35 bg-linear-145 text-white">
                    <FileBadge className="size-7" strokeWidth={1.8} />
                </span>
            </div>
        </div>
    </div>
)

export {PlatformPatentGradeCard}
export type {PlatformPatentGrade}
