'use client'

// 'use client' — 표시 점이 나타나는 움직임 여부를 문서 설정(chart-reveal.tsx)에서 읽는다.
import {useChartAnimation} from '@/components/custom/chart-reveal'
import type {ComponentPropsWithoutRef} from 'react'
import {Check} from 'lucide-react'
import type {ArcGaugeTone} from '@/components/custom/arc-gauge-shape'
import {cn} from '@/lib/utils'

// 등급 매트릭스(RatingMatrix) — 지표마다 다섯 단계(취약 · 미흡 · 보통 · 양호 · 우수) 중 한 칸에 표시를 두는 표.
// K-BIGx 기업혁신성장 보고서 "재무비율진단" 카드에서 쓴다.
//
// 짜임: 항목 칸 100(모바일 80) + 등급 5칸(나머지 폭을 똑같이). 세로선 없이 줄마다 아래 선(border-subtle-3).
//   머리 줄 = 14 Medium(foreground) 가운데 · 높이 37, 항목 줄 = 항목명 14 Medium 가운데 · 높이 40.
//   표시 = 지름 24 원 + 흰 체크. 원 색은 등급별 rating-marker-* — 라이트는 취약 gray.700 · 미흡 error.500 · 보통 orange.500 ·
//   양호 mint.700 · 우수 blue.500(arc-gauge-shape 의 ARC_GAUGE_TONE_COLORS 와 같은 다섯 색). 다크 값은 RATING_LEVELS 위 설명 참고.
// 표시 칸은 색만으로 읽히지 않게 화면 낭독기용 글자(항목: 등급)를 함께 둔다[5.3.1].
// 보고서 안에서는 카드가 보일 때 표시 원이 위 줄부터 차례로 튀어나온다(chart-reveal.tsx · animate-chart-pop).
//
// [프론트엔드 연동] rows 는 화면에 보일 순서대로 넘긴다. rating 은 'weak' · 'poor' · 'normal' · 'good' · 'excellent' 중 하나.

type RatingLevel = ArcGaugeTone

type RatingMatrixRow = {
    id: string
    label: string
    rating: RatingLevel
}

type RatingMatrixProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    rows: readonly RatingMatrixRow[]
}

// 낮은 등급 → 높은 등급 순서(열 순서). 표시 원 색은 시맨틱 토큰 rating-marker-*(tokens.json) — 흰 체크가 올라가므로
// 다크에서도 짙은 색을 유지한다(팔레트 유틸리티는 다크에서 밝은 단계로 뒤집혀 흰 체크가 묻힌다). 다크에서는 취약만
// gray.500(어두운 카드 면과 구분), 보통만 orange.600(흰 체크와 3:1)이고 나머지는 라이트와 같다.
const RATING_LEVELS: ReadonlyArray<{id: RatingLevel; label: string; markerClassName: string}> = [
    {id: 'weak', label: '취약', markerClassName: 'bg-rating-marker-weak'},
    {id: 'poor', label: '미흡', markerClassName: 'bg-rating-marker-poor'},
    {id: 'normal', label: '보통', markerClassName: 'bg-rating-marker-normal'},
    {id: 'good', label: '양호', markerClassName: 'bg-rating-marker-good'},
    {id: 'excellent', label: '우수', markerClassName: 'bg-rating-marker-excellent'},
]

const cellClassName = 'border-subtle-3 border-b'

// 줄마다 표시 점이 차례로 나타나는 간격(ms).
const POP_STAGGER_MS = 80

const RatingMatrix = ({ariaLabel, rows, className, ...props}: RatingMatrixProps) => {
    const animate = useChartAnimation()
    return (
        <div {...props} className={cn('w-full', className)}>
            <table className="w-full table-fixed border-collapse">
                <caption className="sr-only">{ariaLabel}</caption>
                <colgroup>
                    <col className="w-20 md:w-25" />
                    {RATING_LEVELS.map((level) => (
                        <col key={level.id} />
                    ))}
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col" className={cn(cellClassName, 'py-2')}>
                            <span className="sr-only">평가지표</span>
                        </th>
                        {RATING_LEVELS.map((level) => (
                            <th
                                key={level.id}
                                scope="col"
                                className={cn(cellClassName, 'typo-body-l-medium text-foreground py-2 text-center')}
                            >
                                {level.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={row.id}>
                            <th
                                scope="row"
                                className={cn(
                                    cellClassName,
                                    'typo-body-l-medium text-foreground px-1 py-2 text-center break-keep',
                                )}
                            >
                                {row.label}
                            </th>
                            {RATING_LEVELS.map((level) => (
                                <td key={level.id} className={cn(cellClassName, 'py-2 text-center')}>
                                    {row.rating === level.id ? (
                                        <>
                                            {/* 색 원은 그림이라 숨기고, 읽을 글자는 원 밖(칸 바탕)에 둔다 — 원 안에 두면 흰 글자 ·
                                            색 바탕 조합으로 대비 검사(WAVE)가 '매우 낮은 대비'를 잡는다(보통 orange · 양호 mint). */}
                                            <span
                                                data-chart-reveal=""
                                                aria-hidden="true"
                                                className={cn(
                                                    'mx-auto flex size-6 items-center justify-center rounded-full text-white',
                                                    level.markerClassName,
                                                    animate && 'motion-safe:animate-chart-pop',
                                                )}
                                                style={{animationDelay: `${rowIndex * POP_STAGGER_MS}ms`}}
                                            >
                                                <Check className="size-3.5" strokeWidth={3} />
                                            </span>
                                            <span className="sr-only">
                                                {row.label}: {level.label}
                                            </span>
                                        </>
                                    ) : null}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export {RATING_LEVELS, RatingMatrix}
export type {RatingLevel, RatingMatrixProps, RatingMatrixRow}
