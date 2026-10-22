// PROJECT-STYLE: ui/switch primitive는 원본 API를 유지하고,
// 프로젝트의 상태색·포커스·lg/md/sm 크기는 ControlSwitch wrapper의 theme에서 관리한다.
const controlSwitchClassName =
    'peer group/switch outline-ring focus-visible:outline-ring data-[state=checked]:bg-primary data-[state=unchecked]:bg-foreground-subtle disabled:data-[state=checked]:bg-disabled disabled:data-[state=unchecked]:bg-control-disabled data-disabled:data-[state=checked]:bg-disabled data-disabled:data-[state=unchecked]:bg-control-disabled [&>[data-slot=switch-thumb]]:bg-surface disabled:data-[state=checked]:[&>[data-slot=switch-thumb]]:bg-surface disabled:data-[state=unchecked]:[&>[data-slot=switch-thumb]]:bg-disabled-subtle data-disabled:data-[state=checked]:[&>[data-slot=switch-thumb]]:bg-surface data-disabled:data-[state=unchecked]:[&>[data-slot=switch-thumb]]:bg-disabled-subtle relative inline-flex shrink-0 items-center rounded-full border border-transparent p-1 transition-colors focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid disabled:opacity-100 data-disabled:opacity-100'

// 켜짐(checked) 이동 거리 = 트랙 안쪽 폭(테두리 1 · 여백 4 를 뺀 폭) - 손잡이 = 손잡이 - 2px(var(--spacing)/2).
// lg 72-10-32=30 · md 64-10-28=26 · sm 56-10-24=22 — 그래야 켜짐 · 꺼짐 모두 손잡이와 트랙 끝 간격이 같다(5px).
// 손잡이 크기만큼(translate-x-8 등) 옮기면 오른쪽 간격이 2px 좁아진다.
const controlSwitchSizeClassNames = {
    lg: 'data-[size=default]:h-control-h-sm data-[size=default]:w-18 data-[size=default]:[&>[data-slot=switch-thumb]]:size-8 data-[size=default]:[&>[data-slot=switch-thumb][data-state=checked]]:translate-x-[calc(100%-var(--spacing)/2)]',
    md: 'data-[size=default]:h-control-h-sm data-[size=default]:w-16 data-[size=default]:[&>[data-slot=switch-thumb]]:size-7 data-[size=default]:[&>[data-slot=switch-thumb][data-state=checked]]:translate-x-[calc(100%-var(--spacing)/2)]',
    sm: 'data-[size=sm]:h-control-h-xs data-[size=sm]:w-14 data-[size=sm]:[&>[data-slot=switch-thumb]]:size-6 data-[size=sm]:[&>[data-slot=switch-thumb][data-state=checked]]:translate-x-[calc(100%-var(--spacing)/2)]',
}

export {controlSwitchClassName, controlSwitchSizeClassNames}
