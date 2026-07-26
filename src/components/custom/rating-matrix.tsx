import type {ComponentPropsWithoutRef} from 'react'
import {Check} from 'lucide-react'
import {cn} from '@/lib/utils'

type RatingLevel = 'average' | 'excellent' | 'good' | 'poor' | 'weak'

type RatingMatrixRow = {
    id: string
    label: string
    rating: RatingLevel
}

type RatingMatrixProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    ariaLabel: string
    rows: RatingMatrixRow[]
}

const RATING_LEVELS: Array<{
    id: RatingLevel
    label: string
    headerClassName: string
    markerClassName: string
}> = [
    {
        id: 'poor',
        label: '취약',
        headerClassName: 'bg-pastel-error text-pastel-error-foreground-strong',
        markerClassName: 'bg-pastel-error text-pastel-error-foreground-strong',
    },
    {
        id: 'weak',
        label: '미흡',
        headerClassName: 'bg-pastel-warning text-pastel-warning-foreground-strong',
        markerClassName: 'bg-pastel-warning text-pastel-warning-foreground-strong',
    },
    {
        id: 'average',
        label: '보통',
        headerClassName: 'bg-muted text-foreground-subtle',
        markerClassName: 'bg-muted text-foreground-subtle',
    },
    {
        id: 'good',
        label: '양호',
        headerClassName: 'bg-pastel-success text-pastel-success-foreground-strong',
        markerClassName: 'bg-pastel-success text-pastel-success-foreground-strong',
    },
    {
        id: 'excellent',
        label: '우수',
        headerClassName: 'bg-pastel-info text-pastel-info-foreground-strong',
        markerClassName: 'bg-pastel-info text-pastel-info-foreground-strong',
    },
]

const RatingMatrix = ({ariaLabel, rows, className, ...props}: RatingMatrixProps) => (
    <div {...props} className={cn('w-full', className)}>
        <div
            className="border-border bg-table-surface mx-auto w-fit max-w-full overflow-x-auto rounded-lg border"
            role="region"
            aria-label={`${ariaLabel} 표 영역`}
        >
            <table className="bg-table-surface w-max table-fixed border-collapse">
                <caption className="sr-only">{ariaLabel}</caption>
                <colgroup>
                    <col className="w-32" />
                    {RATING_LEVELS.map((level) => (
                        <col key={level.id} className="w-24" />
                    ))}
                </colgroup>
                <thead>
                    <tr className="border-border border-b">
                        <th scope="col" className="bg-pastel-navy border-border relative border-r px-3 py-3 text-left">
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                className="pointer-events-none absolute inset-0 size-full"
                            >
                                <line
                                    x1="0"
                                    y1="0"
                                    x2="100"
                                    y2="100"
                                    vectorEffect="non-scaling-stroke"
                                    className="stroke-border"
                                />
                            </svg>
                            <span className="sr-only">평가지표</span>
                        </th>
                        {RATING_LEVELS.map((level) => (
                            <th
                                key={level.id}
                                scope="col"
                                className={cn(
                                    'typo-body-m-bold border-border border-r px-2 py-3 text-center last:border-r-0',
                                    level.headerClassName,
                                )}
                            >
                                {level.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id} className="border-border border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-m-bold bg-pastel-navy text-pastel-navy-foreground border-border border-r px-3 py-3 text-center whitespace-nowrap"
                            >
                                {row.label}
                            </th>
                            {RATING_LEVELS.map((level) => {
                                const isRated = row.rating === level.id

                                return (
                                    <td
                                        key={level.id}
                                        className="bg-table-surface border-border border-r px-2 py-2 text-center last:border-r-0"
                                    >
                                        {isRated ? (
                                            <span
                                                className={cn(
                                                    'mx-auto flex size-6 items-center justify-center rounded-full',
                                                    level.markerClassName,
                                                )}
                                            >
                                                <Check aria-hidden="true" className="size-4" strokeWidth={3} />
                                                <span className="sr-only">
                                                    {row.label}: {level.label}
                                                </span>
                                            </span>
                                        ) : null}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
)

export {RatingMatrix}
export type {RatingLevel, RatingMatrixProps, RatingMatrixRow}
