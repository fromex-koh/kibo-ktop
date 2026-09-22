import type {ComponentPropsWithoutRef} from 'react'
import {Check} from 'lucide-react'
import type {ArcGaugeTone} from '@/components/custom/arc-gauge-shape'
import {cn} from '@/lib/utils'

// 등급 매트릭스(RatingMatrix) — 지표마다 다섯 단계(취약 · 미흡 · 보통 · 양호 · 우수) 중 한 칸에 표시를 두는 표.
// K-BIGx 기업혁신성장 보고서 "재무비율진단" 카드에서 쓴다.
//
// 짜임: 항목 칸 100(모바일 80) + 등급 5칸(나머지 폭을 똑같이). 세로선 없이 줄마다 아래 선(gray.100).
//   머리 줄 = 14 Medium(foreground) 가운데 · 높이 37, 항목 줄 = 항목명 14 Medium 가운데 · 높이 40.
//   표시 = 지름 24 원 + 흰 체크. 원 색은 등급별 — 취약 gray.700 · 미흡 error.500 · 보통 orange.500 · 양호 mint.700 ·
//   우수 blue.500(원호 게이지 범례와 같은 다섯 색).
// 표시 칸은 색만으로 읽히지 않게 화면 낭독기용 글자(항목: 등급)를 함께 둔다[5.3.1].

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

// 낮은 등급 → 높은 등급 순서(열 순서). 표시 원 색은 팔레트 유틸리티(정적 클래스)로 둔다.
const RATING_LEVELS: ReadonlyArray<{id: RatingLevel; label: string; markerClassName: string}> = [
    {id: 'weak', label: '취약', markerClassName: 'bg-gray-700'},
    {id: 'poor', label: '미흡', markerClassName: 'bg-error-500'},
    {id: 'normal', label: '보통', markerClassName: 'bg-orange-500'},
    {id: 'good', label: '양호', markerClassName: 'bg-mint-700'},
    {id: 'excellent', label: '우수', markerClassName: 'bg-blue-500'},
]

const cellClassName = 'border-subtle-3 border-b'

const RatingMatrix = ({ariaLabel, rows, className, ...props}: RatingMatrixProps) => (
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
                {rows.map((row) => (
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
                                        {/* 색 원은 그림이라 숨기고, 읽을 글자는 원 밖(칸의 흰 바탕)에 둔다 — 원 안에 두면 흰 글자 ·
                                            색 바탕 조합으로 대비 검사(WAVE)가 '매우 낮은 대비'를 잡는다(보통 orange · 양호 mint). */}
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'mx-auto flex size-6 items-center justify-center rounded-full text-white',
                                                level.markerClassName,
                                            )}
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

export {RATING_LEVELS, RatingMatrix}
export type {RatingLevel, RatingMatrixProps, RatingMatrixRow}
