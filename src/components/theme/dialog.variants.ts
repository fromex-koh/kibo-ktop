export const dialogOverlayClassName =
    'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 bg-overlay-xl fixed inset-0 isolate z-modal duration-100'
export const dialogContentClassName =
    'bg-popover text-popover-foreground data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed inset-x-4 top-1/2 z-modal grid w-auto -translate-y-1/2 gap-6 rounded-2xl p-10 pb-6 text-base duration-100 outline-none sm:left-1/2 sm:w-full sm:max-w-modal sm:-translate-x-1/2'
export const dialogHeaderClassName = 'flex flex-col gap-2'
// 시안 CTA — 버튼이 본문 폭을 나눠 채운다(둘이면 246+246·간격 16, 하나면 508 전체).
// 모바일에서는 세로로 쌓고 주 동작을 위에 둔다(flex-col-reverse).
export const dialogFooterClassName = 'flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:[&>button]:flex-1'
export const dialogTitleClassName = 'text-2xl leading-tight font-bold'
export const dialogDescriptionClassName =
    'text-label-foreground *:[a]:hover:text-foreground text-base *:[a]:underline *:[a]:underline-offset-3'

// 닫기(X) — 시안은 32px 아이콘만 두고 배경·테두리·호버 면이 없다(모달 우상단, 여백 40).
// 헤더 아이콘 버튼과 같은 판단이다: Button 의 ghost 를 쓰면 호버 배경과 36px 상자가 따라와 시안과 달라진다.
// 클릭 영역은 가상요소로 44×44 를 확보해 보이는 상자는 32px 그대로 두면서 터치 타깃을 만족한다. [KWCAG 6.1.3]
export const dialogCloseClassName = [
    'absolute top-10 right-10 inline-flex size-icon-xl shrink-0 cursor-pointer items-center justify-center',
    'bg-transparent p-0 text-current transition-colors interactive:hover:text-icon-interactive-hover',
    'outline-ring outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-4',
    "after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
    '[&_svg]:pointer-events-none [&_svg]:size-icon-xl [&_svg]:shrink-0',
].join(' ')
