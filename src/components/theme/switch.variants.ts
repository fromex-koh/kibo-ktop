// PROJECT-STYLE: ui/switch primitive는 원본 API를 유지하고,
// 프로젝트의 상태색·포커스·lg/md/sm 크기는 ControlSwitch wrapper의 theme에서 관리한다.
const controlSwitchClassName =
    'peer group/switch focus-visible:outline-ring data-[state=checked]:bg-primary data-[state=unchecked]:bg-foreground-subtle disabled:data-[state=checked]:bg-disabled disabled:data-[state=unchecked]:bg-control-disabled data-disabled:data-[state=checked]:bg-disabled data-disabled:data-[state=unchecked]:bg-control-disabled [&>[data-slot=switch-thumb]]:bg-surface disabled:data-[state=checked]:[&>[data-slot=switch-thumb]]:bg-surface disabled:data-[state=unchecked]:[&>[data-slot=switch-thumb]]:bg-disabled-subtle data-disabled:data-[state=checked]:[&>[data-slot=switch-thumb]]:bg-surface data-disabled:data-[state=unchecked]:[&>[data-slot=switch-thumb]]:bg-disabled-subtle relative inline-flex shrink-0 items-center rounded-full border border-transparent p-1 transition-colors focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid disabled:opacity-100 data-disabled:opacity-100'

const controlSwitchSizeClassNames = {
    lg: 'data-[size=default]:h-control-h-md data-[size=default]:w-18 data-[size=default]:[&>[data-slot=switch-thumb]]:size-8 data-[size=default]:[&>[data-slot=switch-thumb][data-state=checked]]:translate-x-8',
    md: 'data-[size=default]:h-control-h-sm data-[size=default]:w-16 data-[size=default]:[&>[data-slot=switch-thumb]]:size-7 data-[size=default]:[&>[data-slot=switch-thumb][data-state=checked]]:translate-x-7',
    sm: 'data-[size=sm]:h-control-h-xs data-[size=sm]:w-14 data-[size=sm]:[&>[data-slot=switch-thumb]]:size-6 data-[size=sm]:[&>[data-slot=switch-thumb][data-state=checked]]:translate-x-6',
}

export {controlSwitchClassName, controlSwitchSizeClassNames}
