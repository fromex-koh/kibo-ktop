import {cva, type VariantProps} from 'class-variance-authority'

const baseCardVariants = cva('', {
    variants: {
        variant: {
            default: '',
            outlined: 'border-subtle-3 border',
        },
        padding: {
            md: '',
            lg: '[--card-spacing:--spacing(8)]',
        },
    },
    defaultVariants: {
        variant: 'default',
        padding: 'md',
    },
})

type BaseCardVariantProps = VariantProps<typeof baseCardVariants>

export {baseCardVariants}
export type {BaseCardVariantProps}
