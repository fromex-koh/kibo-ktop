import {cva, type VariantProps} from 'class-variance-authority'

// PROJECT-STYLE: 외형(variant)과 크기(size)를 동작(type)과 분리한다.
// subtle은 기존의 작은 회색 트랙, solid는 넓은 표면 위 Primary 선택 항목을 사용한다.
const segmentedControlVariants = cva('group/segmented-control flex w-fit items-center data-vertical:flex-col', {
    variants: {
        variant: {
            subtle: 'bg-segmented-track gap-0.5 rounded-xs p-0.5',
            // PROJECT-STYLE: Figma(토글) 사양 — 흰 표면·테두리 없음·라운드 8px·패딩 4px.
            solid: 'bg-surface gap-0 rounded-sm p-1 shadow-sm',
        },
        size: {
            sm: '',
            lg: '',
        },
    },
    defaultVariants: {
        variant: 'subtle',
        size: 'sm',
    },
})

// 크기(높이·타이포·패딩)는 외형에 따라 다르다 — subtle 은 촘촘한 트랙, solid 는 Figma 토글 치수(40px 항목)를
// 따르므로 variant×size 조합으로 지정한다. size 변수 자체는 조합을 위한 축으로만 두고 값은 비운다.
const segmentedControlItemVariants = cva(
    'focus-visible:outline-ring tracking-control-label relative flex cursor-pointer items-center justify-center whitespace-nowrap border border-transparent focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
    {
        variants: {
            variant: {
                subtle: 'text-segmented-foreground flex-none rounded-2xs',
                solid: 'segmented-control-solid-item text-segmented-foreground flex-none rounded-sm',
            },
            size: {
                sm: '',
                lg: '',
            },
        },
        compoundVariants: [
            {variant: 'subtle', size: 'sm', class: 'h-control-h-2xs typo-body-l-medium px-3 py-1'},
            {variant: 'subtle', size: 'lg', class: 'typo-title-m-medium min-h-20 min-w-32 px-8 py-4'},
            {variant: 'solid', size: 'sm', class: 'h-control-h-sm typo-body-l-medium px-3'},
            {variant: 'solid', size: 'lg', class: 'h-control-h-md typo-body-l-medium px-4'},
        ],
        defaultVariants: {
            variant: 'subtle',
            size: 'sm',
        },
    },
)

const segmentedControlLinkItemStateClassNames = {
    subtle: 'aria-[current=page]:bg-segmented-active aria-[current=page]:shadow-sm',
    solid: 'aria-[current=page]:bg-segmented-solid-active aria-[current=page]:text-segmented-solid-active-foreground aria-[current=page]:font-bold',
} as const

// disabled 는 두 상태를 구분한다 — 비선택 비활성은 흐린 텍스트만, 선택 비활성은 전용 표면과 테두리로
// "선택됐지만 꺼짐"을 표시한다. focus-visible outline은 실제 조작 요소를 감싼 item에 그린다.
const segmentedControlRadioItemStateClassNames = {
    subtle: 'has-[[data-state=checked]]:bg-segmented-active has-disabled:text-disabled has-disabled:cursor-not-allowed has-disabled:shadow-none has-[[data-disabled][data-state=checked]]:border-disabled-subtle has-[[data-disabled][data-state=checked]]:bg-control-disabled-subtle has-[[data-disabled][data-state=checked]]:shadow-none has-[[data-state=checked]]:shadow-sm',
    // 선택+비활성 solid: navy·흰 글자 대신 흐린 표면(control-disabled-subtle)에 disabled 글자를 쓴다.
    // text-disabled 는 checked 의 흰 글자를 이겨야 하므로 [data-disabled][data-state=checked] 두 조건으로 특정성을 높인다.
    solid: 'has-[[data-state=checked]]:bg-segmented-solid-active has-[[data-state=checked]]:text-segmented-solid-active-foreground has-[[data-state=checked]]:font-bold has-disabled:text-disabled has-disabled:cursor-not-allowed has-[[data-disabled][data-state=checked]]:border-disabled-subtle has-[[data-disabled][data-state=checked]]:bg-control-disabled-subtle has-[[data-disabled][data-state=checked]]:text-disabled has-[[data-disabled][data-state=checked]]:font-medium',
} as const

const segmentedControlFocusWithinClassName =
    'has-[:focus-visible]:outline-ring has-[:focus-visible]:z-10 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-solid'

const segmentedControlRadioClassName = 'peer absolute inset-0 size-full opacity-0 disabled:opacity-0'

type SegmentedControlStyleProps = VariantProps<typeof segmentedControlVariants>

export {
    segmentedControlVariants,
    segmentedControlItemVariants,
    segmentedControlLinkItemStateClassNames,
    segmentedControlRadioItemStateClassNames,
    segmentedControlFocusWithinClassName,
    segmentedControlRadioClassName,
}
export type {SegmentedControlStyleProps}
