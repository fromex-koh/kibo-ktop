import type {ComponentPropsWithoutRef} from 'react'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import {ARC_GAUGE_TONE_COLORS, type ArcGaugeTone} from '@/components/custom/arc-gauge-shape'
import {cn} from '@/lib/utils'

// 점수 원형 게이지(ScoreRing) — 0~100 점수를 한 바퀴 원으로 채우고 가운데에 이름 · 점수 · 등급을 둔다.
// Tech-Index 일반분석 리포트의 지수정보에서 쓴다. 위가 열린 반원(ScoreGauge)과 달리 원을 다 돈다.
//
// 짜임: 지름 160 · 선 굵기 20 · 끝은 둥글다. 12시에서 시작해 시계 방향으로 점수만큼 찬다.
//   트랙 = gray.50, 채움 = 등급 색(양호 mint.700 등 ScoreGauge 와 같은 색을 쓴다).
//   가운데: 이름 11 Regular → 점수(h3 Bold) → 등급 12 Bold.
//
// 그리는 데 브라우저 계산이 필요 없어(고정 좌표 SVG) 인쇄물에도 화면과 같은 모양으로 나간다.
// 수치는 role="img" 의 이름으로 읽어 준다[5.1.1].

type ScoreRingTone = ArcGaugeTone

const RING_SIZE = 160
const RING_STROKE = 20
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2
const RING_LENGTH = 2 * Math.PI * RING_RADIUS
const MAX_SCORE = 100

// 점수 글자 — 소수 첫째 자리까지 늘 보인다(73.7 · 100.0). 자리가 들쭉날쭉하지 않게 0 도 적는다.
const scoreFormatter = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 1, maximumFractionDigits: 1})

type ScoreRingProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    /** 0~100 점수. 범위를 벗어나면 끝(0 · 100)으로 맞춘다. */
    score: number
    /** 원 안 맨 위의 이름(예: Tech-Index Score). */
    caption: string
    /** 점수 아래 등급 이름(예: 양호). */
    statusLabel: string
    /** 등급 — 채움 색을 정한다(우수 · 양호 · 보통 · 미흡 · 취약). */
    tone?: ScoreRingTone
    /** 값을 불러오는 중. 같은 크기의 원 스켈레톤을 대신 보인다. */
    isLoading?: boolean
    /** 불러오는 중에 화면 낭독기가 읽을 말. */
    loadingLabel?: string
    ariaLabel: string
}

const ScoreRing = ({
    score,
    caption,
    statusLabel,
    tone = 'good',
    isLoading = false,
    loadingLabel = '지수 점수를 불러오는 중입니다.',
    ariaLabel,
    className,
    ...props
}: ScoreRingProps) => {
    if (isLoading) return <ChartSkeleton type="score-ring" label={loadingLabel} className={className} />

    const safeScore = Number.isFinite(score) ? Math.min(Math.max(score, 0), MAX_SCORE) : 0
    const filledLength = (RING_LENGTH * safeScore) / MAX_SCORE

    return (
        <div {...props} className={cn('grid size-40 shrink-0 place-items-center', className)}>
            {/* 원과 가운데 글자를 같은 칸에 겹친다 — 자리를 띄워 놓지 않아도 가운데가 맞는다. */}
            <svg
                role="img"
                aria-label={ariaLabel}
                viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                className="col-start-1 row-start-1 size-full"
            >
                <circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    fill="none"
                    stroke="var(--raw-gray-50)"
                    strokeWidth={RING_STROKE}
                />
                {/* 12시에서 시작해 시계 방향으로 돌도록 원을 90도 돌려 그린다.
                    0 점이면 아예 그리지 않는다 — 끝을 둥글린 선은 길이가 0 이어도 점 하나가 찍힌다. */}
                {filledLength > 0 ? (
                    <circle
                        cx={RING_SIZE / 2}
                        cy={RING_SIZE / 2}
                        r={RING_RADIUS}
                        fill="none"
                        stroke={ARC_GAUGE_TONE_COLORS[tone]}
                        strokeWidth={RING_STROKE}
                        strokeLinecap="round"
                        strokeDasharray={`${filledLength} ${RING_LENGTH}`}
                        transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
                    />
                ) : null}
            </svg>
            <p className="col-start-1 row-start-1 flex flex-col items-center">
                <span className="typo-micro-regular text-label-foreground">{caption}</span>
                {/* 점수 글자는 문서에서 가장 큰 글자다 — 시안 28 은 h2 다. */}
                <span className="typo-h2-bold text-foreground">{scoreFormatter.format(safeScore)}</span>
                <span className="typo-caption-bold text-foreground">{statusLabel}</span>
            </p>
        </div>
    )
}

export {ScoreRing}
export type {ScoreRingProps, ScoreRingTone}
