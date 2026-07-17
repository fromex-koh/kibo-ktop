import {selectTriggerClassName} from '@/components/theme/select.variants'

const comboboxInputClassName =
    'w-full gap-1.5 overflow-hidden [&_svg]:size-5 [&_svg]:text-foreground [&_[data-slot=input-group-button]]:size-5 [&_[data-slot=input-group-button]]:min-h-0 [&_[data-slot=input-group-button]]:min-w-0 [&_[data-slot=input-group-button]]:rounded-none [&_[data-slot=input-group-button]]:bg-transparent [&_[data-slot=input-group-button]]:p-0 [&_[data-slot=input-group-button]:hover]:bg-transparent [&_[data-slot=input-group-button]:active]:bg-transparent in-data-[slot=field]:has-[[data-slot=input-group-control]:focus-visible]:outline-none'
const comboboxItemClassName =
    'gap-1.5 rounded-md py-1.5 pr-8 pl-2 text-base data-highlighted:bg-accent data-highlighted:text-accent-foreground'
const comboboxDropdownTriggerClassName = `${selectTriggerClassName} h-control-h-lg w-full min-w-0 appearance-none px-4`
const comboboxDropdownContentClassName =
    '*:data-[slot=input-group]:h-control-h-md *:data-[slot=input-group]:border-control *:data-[slot=input-group]:bg-surface *:data-[slot=input-group]:px-3'
const comboboxDropdownSearchClassName = 'w-auto gap-1.5'

export {
    comboboxDropdownSearchClassName,
    comboboxDropdownContentClassName,
    comboboxDropdownTriggerClassName,
    comboboxInputClassName,
    comboboxItemClassName,
}
