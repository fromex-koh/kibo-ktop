// PROJECT-STYLE: dark:disabled:hover:bg-field-disabled 는 색을 모드별로 나눈 것이 아니라(같은 토큰),
// shadcn 셸의 dark:hover:bg-input/50 을 같은 변형 깊이에서 덮기 위한 방어다. 셸의 그 규칙이 사라지면 함께 지운다.
const selectTriggerClassName =
    'group/select-trigger border-control bg-surface text-label-foreground focus-visible:border-primary outline-ring focus-visible:outline-ring data-[state=open]:border-primary data-[state=open]:outline-ring aria-invalid:border-destructive data-placeholder:text-placeholder data-[size=default]:data-[project-size=lg]:h-control-h-md aria-readonly:bg-field-disabled disabled:border-control disabled:bg-field-disabled disabled:text-disabled disabled:data-placeholder:text-disabled disabled:hover:bg-field-disabled dark:disabled:hover:bg-field-disabled data-[size=default]:data-[project-size=md]:h-control-h-sm flex items-center justify-between gap-1.5 rounded-sm border whitespace-nowrap typo-body-xl-regular transition-colors outline-none select-none focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid disabled:cursor-not-allowed disabled:opacity-100 aria-invalid:ring-0 data-[size=default]:px-4 data-[project-size=md]:px-4 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 data-[state=open]:outline-2 data-[state=open]:outline-offset-2 data-[state=open]:outline-solid [&>svg]:size-5 [&_svg]:text-foreground disabled:[&_svg]:text-disabled [&_svg]:pointer-events-none [&_svg]:shrink-0'
// PROJECT-STYLE: shadcn 원본 드롭다운은 rounded-lg + ring-1 + 여백 없음이지만,
// Figma 는 radius 8 · gray.200 테두리 1px · 안쪽 여백 8px 이라 rounded-sm/border-subtle-2/p-2 를 쓰고 ring 은 끈다.
const selectContentClassName = 'border-subtle-2 rounded-sm border p-2 ring-0'
// PROJECT-STYLE: 옵션은 Figma 스펙(높이 48 · radius 8 · 좌우 여백 8 · 16px Regular)을 따른다.
// hover/키보드 하이라이트는 primary-subtle(blue.50) 면, 선택된 옵션은 배경 없이
// select-selected-foreground(navy.600) + Medium 로만 구분한다. 시안에 체크 아이콘이 없어
// 셸이 그리는 인디케이터 칸은 숨기고(구조는 그대로) 좌우 여백을 대칭으로 맞춘다.
const selectItemClassName =
    "text-label-foreground focus:bg-primary-subtle focus:text-label-foreground not-data-[variant=destructive]:focus:**:text-inherit data-[state=checked]:text-select-selected-foreground data-disabled:text-disabled h-control-h-md rounded-sm relative flex w-full cursor-default items-center gap-1.5 px-2 outline-hidden typo-body-xl-regular select-none data-[state=checked]:font-medium data-disabled:pointer-events-none data-disabled:opacity-100 [&>span:first-child]:hidden [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"

export {selectContentClassName, selectItemClassName, selectTriggerClassName}
