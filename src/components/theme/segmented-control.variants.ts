// PROJECT-STYLE: Figma "Segmented" 반영 — 24px 높이, label 시맨틱 텍스트, 역할 기반 자간을 공유한다.
const segmentedControlClassName =
    'group/segmented-control bg-muted flex w-fit items-center gap-0.5 rounded-xs p-0.5 data-vertical:flex-col'

const segmentedControlItemClassName =
    'focus-visible:outline-ring h-control-h-2xs rounded-2xs typo-body-l-medium tracking-control-label text-label-foreground relative flex flex-none cursor-pointer items-center justify-center whitespace-nowrap px-3 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid'

const segmentedControlLinkItemStateClassName = 'aria-[current=page]:bg-surface aria-[current=page]:shadow-sm'

const segmentedControlRadioItemStateClassName =
    'has-[[data-state=checked]]:bg-surface has-[:focus-visible]:outline-ring has-disabled:text-disabled has-[[data-disabled][data-state=checked]]:bg-control-disabled-subtle has-disabled:cursor-not-allowed has-disabled:shadow-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-solid has-[[data-disabled][data-state=checked]]:shadow-none has-[[data-state=checked]]:shadow-sm'

const segmentedControlRadioClassName = 'peer absolute inset-0 size-full opacity-0 disabled:opacity-0'

export {
    segmentedControlClassName,
    segmentedControlItemClassName,
    segmentedControlLinkItemStateClassName,
    segmentedControlRadioItemStateClassName,
    segmentedControlRadioClassName,
}
