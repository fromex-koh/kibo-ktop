// PROJECT-STYLE: Figma pagination 시안 스타일. shadcn 셸(ui/pagination)의 구조(nav·ul·li)는 그대로 쓰고,
// 상호작용 컨트롤(페이지 번호·이전/다음)은 이 className 으로 스킨한다.
// - 페이지 번호: 40×40, rounded-sm. 비활성 gray(muted-foreground), 활성 navy 면 + 흰 굵은 글자.
// - 이전/다음: 텍스트 + chevron. 활성 gray.700(label-foreground)·medium, 비활성 gray.300(disabled).

const paginationFocusClassName =
    'focus-visible:outline-ring outline-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid'

const paginationItemClassName = `${paginationFocusClassName} typo-body-xl-regular text-muted-foreground hover:bg-muted hover:text-foreground disabled:text-disabled aria-[current=page]:bg-pagination-active aria-[current=page]:text-pagination-active-foreground inline-flex size-10 cursor-pointer items-center justify-center rounded-sm transition-colors select-none aria-[current=page]:font-bold aria-[current=page]:hover:bg-pagination-active disabled:cursor-not-allowed`

const paginationNavClassName = `${paginationFocusClassName} typo-body-xl-medium text-label-foreground hover:bg-muted disabled:text-disabled inline-flex h-10 cursor-pointer items-center gap-1 rounded-sm px-3 whitespace-nowrap transition-colors select-none disabled:cursor-not-allowed disabled:hover:bg-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0`

const paginationEllipsisClassName = 'text-muted-foreground inline-flex size-10 items-center justify-center select-none'

export {paginationItemClassName, paginationNavClassName, paginationEllipsisClassName}
