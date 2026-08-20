import {cva, type VariantProps} from 'class-variance-authority'

// PROJECT-STYLE: 외형(variant)과 크기(size)를 동작(type)과 분리한다.
// subtle 은 항목을 감싸는 작은 회색 트랙, solid 는 트랙 없이 낱개 상자가 나란히 놓이는 필터용 외형이다.
const segmentedControlVariants = cva('group/segmented-control flex w-fit items-center data-vertical:flex-col', {
    variants: {
        variant: {
            subtle: 'bg-segmented-track gap-0.5 rounded-xs p-0.5',
            // PROJECT-STYLE: Figma(평가결과 조회의 조회기간) — 항목을 감싸는 트랙 없이 낱개 상자가
            // 4px 간격으로 놓인다. 흰 카드 위에 그대로 올라가는 필터라 트랙을 두면 면이 겹쳐 보인다.
            solid: 'gap-1',
        },
        size: {
            sm: '',
            md: '',
            lg: '',
        },
    },
    defaultVariants: {
        variant: 'subtle',
        size: 'sm',
    },
})

// 크기(높이·타이포·폭)는 외형에 따라 다르다 — subtle 은 촘촘한 트랙, solid 는 폭이 고정된 낱개 상자를
// 따르므로 variant×size 조합으로 지정한다. size 변수 자체는 조합을 위한 축으로만 두고 값은 비운다.
const segmentedControlItemVariants = cva(
    'outline-ring focus-visible:outline-ring tracking-control-label relative flex cursor-pointer items-center justify-center whitespace-nowrap border border-transparent focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
    {
        variants: {
            variant: {
                subtle: 'text-segmented-foreground flex-none rounded-2xs',
                // PROJECT-STYLE: 낱개 상자는 자기 테두리와 흰 면을 갖는다(시안). 고른 항목은 아래
                // 상태 클래스가 테두리까지 함께 채운다.
                solid: 'border-subtle-3 bg-surface text-segmented-foreground flex-none rounded-sm',
            },
            size: {
                sm: '',
                md: '',
                lg: '',
            },
        },
        compoundVariants: [
            // PROJECT-STYLE: 헤더 토글 시안(40006513:19948)은 항목 좌우 여백이 8px 다(41 = 글자 25 + 8×2).
            // md·lg 는 같은 비율로 한 단계씩 올린다 — 트랙 자체가 촘촘한 외형이라 여백이 넓으면 균형이 깨진다.
            {variant: 'subtle', size: 'sm', class: 'h-control-h-2xs typo-body-l-medium px-2'},
            {variant: 'subtle', size: 'md', class: 'h-control-h-sm typo-body-l-medium px-3'},
            {variant: 'subtle', size: 'lg', class: 'h-control-h-md typo-body-xl-medium px-4'},
            // PROJECT-STYLE: 낱개 상자는 글자 길이와 무관하게 폭이 같다(시안 72) — 나란히 놓인
            // 기간 선택지가 들쭉날쭉해 보이지 않는다. 높이는 함께 놓이는 날짜 입력과 같은 컨트롤 높이다.
            {variant: 'solid', size: 'sm', class: 'h-control-h-xs w-16 typo-body-l-regular'},
            {variant: 'solid', size: 'md', class: 'h-control-h-sm w-18 typo-body-l-regular'},
            {variant: 'solid', size: 'lg', class: 'h-control-h-md w-20 typo-body-xl-regular'},
        ],
        defaultVariants: {
            variant: 'subtle',
            size: 'sm',
        },
    },
)

const segmentedControlLinkItemStateClassNames = {
    subtle: 'aria-[current=page]:bg-segmented-active aria-[current=page]:shadow-sm',
    solid: 'aria-[current=page]:border-segmented-solid-active aria-[current=page]:bg-segmented-solid-active aria-[current=page]:text-segmented-solid-active-foreground aria-[current=page]:font-bold',
} as const

// disabled 는 두 상태를 구분한다 — 비선택 비활성은 흐린 텍스트만, 선택 비활성은 전용 표면과 테두리로
// "선택됐지만 꺼짐"을 표시한다. focus-visible outline은 실제 조작 요소를 감싼 item에 그린다.
const segmentedControlRadioItemStateClassNames = {
    subtle: 'has-[[data-state=checked]]:bg-segmented-active has-disabled:text-disabled has-disabled:cursor-not-allowed has-disabled:shadow-none has-[[data-disabled][data-state=checked]]:border-disabled-subtle has-[[data-disabled][data-state=checked]]:bg-control-disabled-subtle has-[[data-disabled][data-state=checked]]:shadow-none has-[[data-state=checked]]:shadow-sm',
    // 낱개 상자는 테두리까지 함께 채워야 고른 항목이 한 덩어리로 보인다.
    // 선택+비활성 solid: navy·흰 글자 대신 흐린 표면(control-disabled-subtle)에 disabled 글자를 쓴다.
    // text-disabled 는 checked 의 흰 글자를 이겨야 하므로 [data-disabled][data-state=checked] 두 조건으로 특정성을 높인다.
    solid: 'has-[[data-state=checked]]:border-segmented-solid-active has-[[data-state=checked]]:bg-segmented-solid-active has-[[data-state=checked]]:text-segmented-solid-active-foreground has-[[data-state=checked]]:font-bold has-disabled:text-disabled has-disabled:cursor-not-allowed has-[[data-disabled][data-state=checked]]:border-disabled-subtle has-[[data-disabled][data-state=checked]]:bg-control-disabled-subtle has-[[data-disabled][data-state=checked]]:text-disabled has-[[data-disabled][data-state=checked]]:font-medium',
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
