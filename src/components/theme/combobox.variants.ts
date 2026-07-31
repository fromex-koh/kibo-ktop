import {selectTriggerClassName} from '@/components/theme/select.variants'

const comboboxInputClassName =
    'w-full gap-1.5 overflow-hidden [&_[data-slot=input-group-control]]:typo-body-xl-regular [&_svg]:size-5 [&_svg]:text-foreground group-has-disabled/input-group:[&_svg]:text-disabled [&_[data-slot=input-group-button]]:size-5 [&_[data-slot=input-group-button]]:min-h-0 [&_[data-slot=input-group-button]]:min-w-0 [&_[data-slot=input-group-button]]:rounded-none [&_[data-slot=input-group-button]]:bg-transparent [&_[data-slot=input-group-button]]:p-0 [&_[data-slot=input-group-button]:hover]:bg-transparent [&_[data-slot=input-group-button]:active]:bg-transparent'
// PROJECT-STYLE: 드롭다운 패널·옵션은 Select 드롭다운과 같은 Figma 시안을 따른다
// (패널 radius 8 · gray.200 테두리 1px · 안쪽 여백 8, 옵션 높이 48 · radius 8 · 좌우 여백 8 · 16px).
const comboboxContentClassName = 'border-subtle-2 min-w-(--anchor-width) rounded-sm border ring-0'
const comboboxListClassName = 'p-2'
const comboboxEmptyClassName = 'typo-body-xl-regular text-foreground-subtle'
// PROJECT-STYLE: hover/키보드 하이라이트는 primary-subtle 면이고, 선택된 옵션은 배경 없이
// select-selected-foreground(navy.600) + Medium 로만 구분한다(체크 아이콘 없는 시안).
// **:text-inherit 은 셸의 하이라이트 자식 규칙을 덮어 자식이 옵션 자신의 색을 상속하게 한다.
// Base UI 는 data-selected/highlighted 를 값 없는 속성으로 찍는데 Tailwind 축약형(data-selected:)은
// [data-selected="true"] 로 컴파일되어 매칭되지 않는다 — 존재 여부로 매칭되는 data-[selected]: 형태를 쓴다.
const comboboxItemClassName =
    '[&>span]:hidden text-label-foreground data-[highlighted]:bg-primary-subtle data-[highlighted]:text-label-foreground data-[highlighted]:**:text-inherit data-[selected]:text-select-selected-foreground data-[disabled]:text-disabled h-control-h-md typo-body-xl-regular gap-1.5 rounded-sm px-2 data-[selected]:font-medium data-[disabled]:opacity-100'
const comboboxDropdownTriggerClassName = `${selectTriggerClassName} h-control-h-md w-full min-w-0 appearance-none px-4`
const comboboxDropdownContentClassName =
    '*:data-[slot=input-group]:h-control-h-sm *:data-[slot=input-group]:border-control *:data-[slot=input-group]:bg-surface *:data-[slot=input-group]:px-3'
const comboboxDropdownSearchClassName = 'w-auto gap-1.5'

export {
    comboboxContentClassName,
    comboboxEmptyClassName,
    comboboxDropdownSearchClassName,
    comboboxDropdownContentClassName,
    comboboxDropdownTriggerClassName,
    comboboxInputClassName,
    comboboxItemClassName,
    comboboxListClassName,
}
