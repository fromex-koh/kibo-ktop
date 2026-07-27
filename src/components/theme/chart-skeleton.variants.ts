import {cva, type VariantProps} from 'class-variance-authority'

const chartSkeletonVariants = cva('min-w-0 animate-pulse', {
    variants: {
        type: {
            bar: 'h-64 sm:h-80',
            benchmark: 'h-auto',
            donut: 'h-auto',
            gauge: 'h-54',
            line: 'h-64 sm:h-80',
            matrix: 'h-80',
            network: 'h-72 sm:h-100 xl:h-120',
            radar: 'h-80 sm:h-96',
            'word-cloud': 'h-72 sm:h-96',
        },
        legend: {
            'company-relationship': '',
            'supply-network': '',
        },
    },
    compoundVariants: [
        {
            type: 'network',
            legend: ['company-relationship', 'supply-network'],
            class: 'h-auto sm:h-auto md:h-auto lg:h-auto xl:h-120',
        },
    ],
})

const chartSkeletonPartVariants = cva('bg-muted', {
    variants: {
        shape: {
            block: 'rounded-md',
            circle: 'rounded-full',
            large: 'rounded-lg',
            small: 'rounded-sm',
            top: 'rounded-t-sm sm:rounded-t-md',
        },
    },
    defaultVariants: {
        shape: 'block',
    },
})

const chartSkeletonNetworkGraphicVariants = cva('', {
    variants: {
        legend: {
            'company-relationship': 'h-72 sm:h-100 md:h-125 xl:col-span-2 xl:h-full',
            'supply-network': 'h-72 sm:h-100 md:h-120 xl:col-span-2 xl:h-full',
        },
    },
})

const chartSkeletonNetworkLayoutClassName =
    'grid h-auto min-h-0 w-full min-w-0 items-start gap-6 xl:h-full xl:grid-cols-3'

type ChartSkeletonStyleProps = VariantProps<typeof chartSkeletonVariants>

export {
    chartSkeletonNetworkGraphicVariants,
    chartSkeletonNetworkLayoutClassName,
    chartSkeletonPartVariants,
    chartSkeletonVariants,
}
export type {ChartSkeletonStyleProps}
