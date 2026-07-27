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
