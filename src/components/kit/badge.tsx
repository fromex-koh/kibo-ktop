import * as React from 'react'
import {cva, type VariantProps} from 'class-variance-authority'
import {Slot} from 'radix-ui'
import {cn} from '@/lib/utils'

// PROJECT-STYLE: shadcn Badge styled copy. variant는 표현 방식, type은 label/number 목적을 구분한다.
// 숫자 배지는 같은 Badge의 type="number"로 관리하며, NumberBadge는 기존 사용처 호환용 래퍼다.
const badgeVariants = cva(
    'group/badge inline-flex w-fit shrink-0 items-center justify-center border border-transparent px-4 font-medium whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 [&>svg]:pointer-events-none',
    {
        variants: {
            variant: {
                'solid-pastel': '',
                outline: 'bg-card',
                solid: 'text-badge-solid-fg',
            },
            type: {
                label: '',
                number: 'typo-body-l-bold h-6 min-w-7 rounded-full px-2',
            },
            size: {
                sm: 'h-7 gap-1 text-sm [&>svg]:size-3.5',
                lg: 'h-10 gap-1.5 text-base [&>svg]:size-4',
            },
            color: {
                info: '',
                success: '',
                warning: '',
                error: '',
                neutral: '',
                navy: '',
                'secondary-green': '',
                'secondary-orange': '',
                'secondary-grape': '',
                primary: '',
                new: '',
            },
            shape: {
                pill: 'rounded-full',
                round: 'rounded-sm',
            },
        },
        compoundVariants: [
            {variant: 'solid-pastel', color: 'info', class: 'bg-info-50 text-info-600'},
            {variant: 'solid-pastel', color: 'success', class: 'bg-success-50 text-success-600'},
            {variant: 'solid-pastel', color: 'warning', class: 'bg-warning-50 text-warning-600'},
            {variant: 'solid-pastel', color: 'error', class: 'bg-error-50 text-error-500'},
            {variant: 'solid-pastel', color: 'neutral', class: 'bg-gray-100 text-gray-500'},
            {variant: 'solid-pastel', color: 'navy', class: 'bg-navy-50 text-navy-600'},
            {variant: 'solid-pastel', color: 'secondary-green', class: 'bg-green-50 text-green-800'},
            {variant: 'solid-pastel', color: 'secondary-orange', class: 'bg-orange-50 text-orange-700'},
            {variant: 'solid-pastel', color: 'secondary-grape', class: 'bg-grape-50 text-grape-600'},
            {variant: 'outline', color: 'info', class: 'border-info-500 text-info-600'},
            {variant: 'outline', color: 'success', class: 'border-success-500 text-success-600'},
            {variant: 'outline', color: 'warning', class: 'border-warning-500 text-warning-600'},
            {variant: 'outline', color: 'error', class: 'border-error-500 text-error-500'},
            {variant: 'outline', color: 'neutral', class: 'border-gray-300 text-gray-300'},
            {variant: 'outline', color: 'navy', class: 'border-navy-500 text-navy-600'},
            {variant: 'outline', color: 'secondary-green', class: 'border-green-800 text-green-800'},
            {variant: 'outline', color: 'secondary-orange', class: 'border-orange-700 text-orange-700'},
            {variant: 'outline', color: 'secondary-grape', class: 'border-grape-600 text-grape-600'},
            {variant: 'solid', color: 'info', class: 'bg-info-500'},
            {variant: 'solid', color: 'success', class: 'bg-success-500'},
            {variant: 'solid', color: 'warning', class: 'bg-warning-500'},
            {variant: 'solid', color: 'error', class: 'bg-error-500'},
            {variant: 'solid', color: 'neutral', class: 'bg-gray-300'},
            {variant: 'solid', color: 'navy', class: 'bg-navy-500'},
            {variant: 'solid', color: 'secondary-green', class: 'bg-green-800'},
            {variant: 'solid', color: 'secondary-orange', class: 'bg-orange-700'},
            {variant: 'solid', color: 'secondary-grape', class: 'bg-grape-600'},
            {type: 'number', color: 'primary', class: 'bg-primary text-primary-foreground'},
            {type: 'number', color: 'new', class: 'bg-number-badge-new text-badge-solid-fg'},
        ],
        defaultVariants: {
            variant: 'solid-pastel',
            color: 'neutral',
            shape: 'pill',
            size: 'sm',
        },
    },
)

function Badge({
    className,
    variant = 'solid-pastel',
    type = 'label',
    color = 'neutral',
    shape = 'pill',
    size = 'sm',
    asChild = false,
    ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & {asChild?: boolean}) {
    const Comp = asChild ? Slot.Root : 'span'

    return (
        <Comp
            data-slot="badge"
            data-variant={variant}
            data-type={type}
            data-color={color}
            data-shape={shape}
            data-size={size}
            className={cn(badgeVariants({variant, type, color, shape, size}), className)}
            {...props}
        />
    )
}

type NumberBadgeProps = Omit<React.ComponentProps<'span'>, 'color'> & {
    variant?: 'primary' | 'new'
}

function NumberBadge({className, variant = 'primary', ...props}: NumberBadgeProps) {
    return <Badge data-slot="number-badge" type="number" color={variant} className={className} {...props} />
}

export {Badge, NumberBadge, badgeVariants}
