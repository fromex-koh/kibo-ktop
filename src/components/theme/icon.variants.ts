import {cva, type VariantProps} from 'class-variance-authority'

const iconVariants = cva('', {
    variants: {
        variant: {
            outline: '',
            solid: 'bg-icon-solid-neutral text-icon-solid-neutral-foreground inline-flex items-center justify-center rounded-full',
        },
    },
    defaultVariants: {
        variant: 'outline',
    },
})

type IconVariant = NonNullable<VariantProps<typeof iconVariants>['variant']>

export {iconVariants}
export type {IconVariant}
