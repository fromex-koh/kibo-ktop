'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {ComparisonRadarChart} from '@/components/custom/comparison-radar-chart'

// 등급 레이더 차트 — 평가대상과 비교 기준(특허 등급조회에서는 '동일 특허분야 평균')의 항목별 점수를 세 축 삼각형으로 겹쳐 본다.
// 평가대상은 초록 실선과 속 빈 점, 비교 기준은 점선 테두리와 옅은 면(점 없음)이다.
// 축은 반시계 방향으로 놓인다 — 첫 항목이 위, 두 번째가 왼쪽 아래, 세 번째가 오른쪽 아래다.
//
// 시안 규격(특허 등급조회 '특허 평가등급' 오른쪽): 범례(16 견본 · 14 Regular) 오른쪽 정렬 · 차트 높이 222 ·
// 삼각형 폭 192 × 높이 166 · 고리 4겹(25 · 50 · 75 · 100) · 격자 gray.100 · 축 이름 14 Regular gray.700.
// 모양 설정은 이 컴포넌트가 모두 갖고 있어, 쓰는 곳은 받은 점수만 넣는다.

type GradeRadarItem = {
    id: string
    /** 축 이름. */
    label: string
    /** 평가대상 점수(0~100) — 실선과 속 빈 점. 범위를 벗어나면 0 · 100 으로 맞춘다. */
    targetScore: number
    /** 비교 기준 점수(0~100) — 점선과 옅은 면. 없으면 비교 계열을 그리지 않는다. */
    peerScore?: number
}

type GradeRadarChartProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    /** 축마다 한 항목 — 시안은 세 축이다(기술다양성 · 시장확장성 · 가치창출가능성). */
    data: GradeRadarItem[]
    /** 평가대상 계열의 이름(범례 · 숨김 표). */
    targetLabel?: string
    /** 비교 기준 계열의 이름. */
    peerLabel?: string
    /** 처음 펼쳐질 때의 움직임. 한 번 그린 뒤에는 창 폭이 바뀌어도 다시 펼치지 않는다. 인쇄용 문서에서는 끈다. */
    animate?: boolean
    /** 값을 불러오는 중. 같은 높이의 삼각 레이더 스켈레톤을 대신 보인다. */
    isLoading?: boolean
    /** 불러오는 중에 화면 낭독기가 읽을 말. */
    loadingLabel?: string
}

// 축 이름('가치창출가능성')이 좌우로 길어 좁은 화면(360)에서도 잘리지 않도록 좌우 여백 96 을 둔다 — 좁은 화면에서는 이
// 여백이 반지름을 줄이고, PC 에서는 높이가 반지름을 정한다. 세 축 삼각형은 아래 두 꼭짓점이 중심보다 반지름의 절반만
// 내려오므로, 정사각 칸 대신 높이(모바일 176 · md 이상 224)를 직접 정하고 중심을 64% 로 내려 위아래 빈 곳을 없앤다.
// 반지름 115% 는 PC 에서 시안 삼각형(폭 192)이 나오는 값이다.
const RADAR_MARGIN = {top: 24, right: 96, bottom: 8, left: 96}
const RING_COUNT = 5
const TICK_FONT_SIZE = 14
const TICK_FONT_WEIGHT = 400

const GradeRadarChart = ({
    data,
    targetLabel = '평가대상',
    peerLabel = '비교 기준',
    animate = true,
    isLoading = false,
    loadingLabel = '등급 레이더를 불러오는 중입니다.',
    ariaLabel,
    ...props
}: GradeRadarChartProps) => {
    const hasPeer = data.some((item) => item.peerScore !== undefined)

    return (
        <ComparisonRadarChart
            {...props}
            ariaLabel={ariaLabel}
            data={data.map((item) => ({
                id: item.id,
                label: item.label,
                primaryValue: item.targetScore,
                comparisonValue: item.peerScore,
            }))}
            primaryLabel={targetLabel}
            comparisonLabel={hasPeer ? peerLabel : undefined}
            primaryColor="var(--ds-mint-700)"
            comparisonColor="var(--ds-success-200)"
            comparisonAppearance="filled"
            legendAppearance="swatch"
            direction="counterclockwise"
            dotAppearance="hollow"
            gridColor="var(--ds-subtle-3)"
            ringCount={RING_COUNT}
            tickFontSize={TICK_FONT_SIZE}
            tickFontWeight={TICK_FONT_WEIGHT}
            tickColor="var(--ds-label-foreground)"
            outerRadius="115%"
            centerY="64%"
            margin={RADAR_MARGIN}
            chartClassName="aspect-auto h-44 min-h-0 md:h-56"
            animate={animate}
            isLoading={isLoading}
            loadingLabel={loadingLabel}
        />
    )
}

export {GradeRadarChart}
export type {GradeRadarChartProps, GradeRadarItem}
