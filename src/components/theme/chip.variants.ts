import {cva} from 'class-variance-authority'
import {cn} from '@/lib/utils'

// PROJECT-STYLE: 글이 길고 폭이 좁으면(모바일의 전체폭 칩) 글자를 한 줄에 가두지 않고 줄을 바꾼다 —
// 칩은 그만큼 높아진다. 그래서 상자 높이를 고정값(h-*)이 아니라 최소값(min-h-*)으로 둔다.
// 한 줄이면 최소 높이가 이기므로 시안 높이(lg 48 · md 40) 그대로이고, 두 줄부터는 줄 높이(24)만큼
// 커지면서 위아래 여백(lg 8 · md 4)이 글자와 테두리 사이를 띄운다.
const chipVariants = cva(
    'text-label-foreground border-control bg-surface inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border px-4 text-center text-base font-normal transition-colors outline-none',
    {
        variants: {
            size: {
                lg: 'min-h-control-h-md py-2',
                md: 'min-h-control-h-sm py-1',
            },
        },
        defaultVariants: {
            size: 'lg',
        },
    },
)

const chipStateClassName = cn(
    'outline-ring focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
    'data-checked:border-2 data-checked:border-primary data-checked:text-primary-strong data-checked:font-bold',
    'disabled:border-disabled-subtle disabled:bg-control-disabled disabled:text-disabled disabled:cursor-not-allowed disabled:opacity-100',
)

const chipGroupClassName = 'flex w-fit flex-wrap gap-2'
const chipCheckboxClassName = 'justify-between px-6'
const chipCheckboxContentClassName = 'flex-1 text-left'
const chipCheckboxIndicatorClassName = 'shrink-0 text-current'
const chipCheckboxIconClassName = 'size-4'

export {
    chipVariants,
    chipStateClassName,
    chipGroupClassName,
    chipCheckboxClassName,
    chipCheckboxContentClassName,
    chipCheckboxIndicatorClassName,
    chipCheckboxIconClassName,
}
