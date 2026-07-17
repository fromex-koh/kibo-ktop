import {cva} from 'class-variance-authority'

const selectableCardVariants = cva(
    'bg-surface flex cursor-pointer items-center gap-2 rounded-lg border-2 px-10 py-6 transition-colors has-[>[data-slot=field]]:border-2 *:data-[slot=field]:p-0 has-[:focus-visible]:outline-ring has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-solid',
    {
        variants: {
            selected: {
                true: 'border-primary bg-primary-subtle has-data-checked:border-primary has-data-checked:bg-primary-subtle dark:has-data-checked:border-primary dark:has-data-checked:bg-primary-subtle',
                false: '',
            },
            unselected: {
                true: 'border-transparent',
                false: '',
            },
            locked: {
                true: 'bg-control-disabled text-disabled opacity-100',
                false: '',
            },
            lockedSelected: {
                true: 'border-disabled-subtle has-data-checked:border-disabled-subtle has-data-checked:bg-control-disabled dark:has-data-checked:border-disabled-subtle dark:has-data-checked:bg-control-disabled',
                false: '',
            },
            disabled: {
                true: 'cursor-not-allowed',
                false: '',
            },
            readOnly: {
                true: 'pointer-events-none cursor-default',
                false: '',
            },
        },
    },
)

const selectableCardFieldClassName = 'items-center gap-2 has-[>[data-slot=field-content]]:items-center'
const selectableCardControlClassName = 'focus-visible:outline-none'
const selectableCardContentClassName = 'gap-0'
const selectableCardTitleClassName = 'typo-title-l-bold text-current'
const selectableCardBadgesClassName = 'flex shrink-0 items-center gap-2'

export {
    selectableCardVariants,
    selectableCardFieldClassName,
    selectableCardControlClassName,
    selectableCardContentClassName,
    selectableCardTitleClassName,
    selectableCardBadgesClassName,
}
