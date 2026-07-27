// PROJECT-STYLE: shadcn 원본은 --cell-size 7(28px) 정사각 셀이지만,
// Figma 날짜선택은 날짜 셀이 44×40(가로 44 / 세로 40)이므로
// 셀 높이를 --cell-size(40px)로 두고 가로는 min-w-11(44px)로 채운다.
// 40px 높이는 [6.1.3] 44px 터치 타깃보다 작지만, 셀이 가로로 맞닿아 있고
// 디자인이 지정한 밀집 그리드라 컴팩트 예외로 둔다.
const calendarClassName =
    'group/calendar bg-surface p-6 [--cell-size:--spacing(10)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent'

// PROJECT-STYLE: shadcn 원본은 hover:bg-accent 만 있는 ghost 버튼이지만,
// Figma 월 이동 버튼은 surface 배경 + gray.100 테두리의 28px 컨트롤이므로
// bg-surface/border-subtle-3 를 유지한다. 28px 은 터치 타깃보다 작아
// after 로 히트 영역을 44px 까지 넓힌다([6.1.3]).
const calendarNavButtonClassName =
    'border-subtle-3 bg-surface text-foreground aria-disabled:text-disabled-subtle relative size-7 min-h-0 min-w-0 shrink-0 rounded-sm border p-0 select-none after:absolute after:-inset-2 aria-disabled:bg-surface aria-disabled:opacity-100'

const calendarClassNames = {
    // PROJECT-STYLE: 시안 날짜선택은 360×350(패딩 24 + 그리드 312)이라 폭을 고정한다.
    // 셀이 flex-1 이라 그리드 폭이 곧 셀 폭(312/7 = 44.57)을 정한다.
    root: 'w-90',
    months: 'relative flex flex-col gap-4 md:flex-row',
    // PROJECT-STYLE: shadcn 원본은 세로 스택(flex-col)이지만, Figma 는
    // [이전] 2026.07 [다음] 이 20px 간격으로 가운데 모인 헤더라
    // navLayout="around" 의 3요소를 헤더 한 줄(3열)에 두고 달력 표를 그 아래 행에 둔다.
    // (flex-wrap 은 fit-content 폭이 '줄바꿈 전 합계'로 잡혀 표가 늘어나므로 grid 를 쓴다.)
    month: 'grid w-full grid-cols-[1fr_auto_1fr] items-center gap-x-2 gap-y-2',
    nav: 'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
    // justify-self: 시안은 이동 버튼이 달력 그리드의 좌우 끝에 붙고 캡션만 가운데 온다.
    button_previous: `${calendarNavButtonClassName} justify-self-start`,
    button_next: `${calendarNavButtonClassName} justify-self-end`,
    // col-start-2: navLayout 없이 쓸 때(월 이동 버튼이 nav 로 따로 렌더될 때)도
    // 캡션이 헤더 가운데 열에 오게 해 좌우 정렬이 흔들리지 않게 한다.
    month_caption: 'text-foreground col-start-2 flex h-7 items-center justify-center text-base font-medium',
    // 시안: 월·연도 드롭다운 사이 12px, 글자와 화살표 사이 4px.
    dropdowns: 'flex h-7 items-center justify-center gap-3 text-base font-medium',
    dropdown_root:
        'cn-calendar-dropdown-root outline-ring relative rounded-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-solid',
    dropdown: 'bg-popover absolute inset-0 opacity-0',
    caption_label: 'font-medium select-none',
    caption_label_label: 'cn-calendar-caption text-base',
    caption_label_dropdown:
        'cn-calendar-caption-label flex items-center gap-1 rounded-sm text-base [&>svg]:size-icon-sm [&>svg]:text-foreground-subtle',
    month_grid: 'col-span-3 w-full border-collapse',
    weekdays: 'flex',
    // PROJECT-STYLE: Figma 의 일요일 빨강(error.500)·토요일 파랑(blue.600)은 상태색(destructive 등)과
    // 의미가 달라 calendar-sunday/calendar-saturday 시맨틱 토큰으로 추가해 그대로 적용한다.
    // first/last 는 주 시작이 일요일인 로케일(ko) 기준이다.
    weekday:
        'text-label-foreground first:text-calendar-sunday last:text-calendar-saturday flex-1 py-2 text-base font-normal select-none',
    week: 'mt-1 flex w-full first:mt-2',
    week_number_header: 'w-(--cell-size) select-none',
    week_number: 'text-foreground-subtle text-sm select-none',
    day: 'group/day relative h-(--cell-size) flex-1 rounded-sm p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-sm',
    day_week_number: '[&:nth-child(2)[data-selected=true]_button]:rounded-l-sm',
    day_first_child: '[&:first-child[data-selected=true]_button]:rounded-l-sm',
    range_start:
        'bg-primary-subtle after:bg-primary-subtle relative isolate z-0 rounded-l-sm after:absolute after:inset-y-0 after:right-0 after:w-4',
    range_middle: 'rounded-none',
    range_end:
        'bg-primary-subtle after:bg-primary-subtle relative isolate z-0 rounded-r-sm after:absolute after:inset-y-0 after:left-0 after:w-4',
    today: 'bg-primary-subtle rounded-sm data-[selected=true]:rounded-none',
    outside: 'text-disabled-subtle',
    disabled: 'text-disabled-subtle',
    hidden: 'invisible',
}

// PROJECT-STYLE: shadcn 원본은 3px focus 링과 muted 계열 상태색이지만,
// 프로젝트 포커스는 Button 셸의 focus-visible outline 을 그대로 쓰고
// 선택/오늘/비활성 색은 Figma 의 primary·primary-subtle·disabled-subtle 을 따른다.
// not-data-[selected-single=true] 로 감싸 선택 상태가 항상 우선하게 한다.
const calendarDayButtonClassName =
    'text-label-foreground relative isolate z-10 flex h-(--cell-size) w-full min-h-0 min-w-11 flex-col items-center justify-center gap-1 rounded-sm border-0 text-base leading-6 font-normal select-none group-data-today/day:font-medium group-data-outside/day:not-data-[selected-single=true]:text-disabled-subtle disabled:bg-transparent disabled:not-data-[selected-single=true]:text-disabled-subtle data-[range-end=true]:rounded-r-sm data-[range-end=true]:bg-primary data-[range-end=true]:font-medium data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-primary-subtle data-[range-middle=true]:text-label-foreground data-[range-start=true]:rounded-l-sm data-[range-start=true]:bg-primary data-[range-start=true]:font-medium data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:font-medium data-[selected-single=true]:text-primary-foreground [&>span]:text-foreground-subtle [&>span]:text-xs'

export {calendarClassName, calendarClassNames, calendarDayButtonClassName, calendarNavButtonClassName}
