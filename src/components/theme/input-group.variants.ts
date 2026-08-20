import {cva} from 'class-variance-authority'

// PROJECT-STYLE: 검사에 걸린 칸(aria-invalid)은 focus-visible 이 아니라 focus 에도 포커스 표시를 낸다.
// 제출 버튼을 마우스로 누른 뒤 첫 오류 칸으로 포커스를 옮기면 브라우저가 :focus-visible 을 켜지 않아
// 표시가 보이지 않는다 — 어디로 이동했는지 알 수 없으면 안 된다[6.1.2].
//
// PROJECT-STYLE: align="inline-end-fill" — 오른쪽 끝을 버튼이 꽉 채우는 배치.
// 상자의 기본 여백(16) 안에 버튼을 두면 hover 면이 테두리에서 떨어져 상자 위에 얹힌 조각처럼 보인다.
// 이 배치는 그쪽 여백을 없애고 버튼이 상자 높이를 채우며 왼쪽 모서리만 각지게 해, hover 면이 상자의
// 한 구역으로 읽힌다. 버튼은 상자 안쪽 높이를 따라 정사각이 된다(w-auto + aspect-square) —
// size 가 정한 고정 너비를 두면 높이만 늘어나 세로로 긴 상자가 된다.
// 비밀번호 표시/숨김처럼 입력 칸에 붙는 조작 버튼에 쓴다.
// 기존 inline-end 는 그대로 둔다 — [지우기](ClearableInput)처럼 작고 동그란 버튼은 이 처리를 하면 깨진다.
const inputGroupClassName =
    'group/input-group border-control bg-surface has-disabled:bg-field-disabled has-disabled:opacity-100 has-[input:read-only]:bg-field-disabled relative flex h-control-h-md w-full min-w-0 items-center gap-2 rounded-sm border px-4 transition-colors outline-none has-[[data-slot=input-group-control]:focus-visible]:outline-ring has-[[data-slot=input-group-control]:focus-visible]:outline-2 has-[[data-slot=input-group-control]:focus-visible]:outline-offset-2 has-[[data-slot=input-group-control]:focus-visible]:outline-solid has-[[data-slot=input-group-control][aria-invalid=true]:focus]:outline-ring has-[[data-slot=input-group-control][aria-invalid=true]:focus]:outline-2 has-[[data-slot=input-group-control][aria-invalid=true]:focus]:outline-offset-2 has-[[data-slot=input-group-control][aria-invalid=true]:focus]:outline-solid has-[[data-slot][aria-invalid=true]]:border-destructive has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=inline-end-fill]]:pe-0'

const inputGroupAddonVariants = cva(
    "text-foreground-subtle group-has-disabled/input-group:text-disabled flex h-auto cursor-text items-center justify-center gap-2 text-sm font-medium select-none [&>svg:not([class*='size-'])]:size-icon-sm",
    {
        variants: {
            align: {
                'inline-start': 'order-first',
                'inline-end': 'order-last',
                'inline-end-fill':
                    'order-last h-full p-0 [&>button]:aspect-square [&>button]:h-full [&>button]:w-auto [&>button]:rounded-s-none',
                'block-start': 'order-first w-full justify-start pt-2',
                'block-end': 'order-last w-full justify-start pb-2',
            },
        },
        defaultVariants: {align: 'inline-start'},
    },
)

const inputGroupButtonVariants = cva('shrink-0 bg-clip-border shadow-none', {
    variants: {
        size: {
            xs: "h-control-h-xs min-h-0 min-w-control-min-w-xs gap-1 rounded-2xs px-3 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
            sm: "h-control-h-sm min-h-0 min-w-control-min-w-xs gap-1.5 rounded-sm px-4 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
            'icon-xs':
                "size-control-h-xs min-h-0 min-w-0 gap-0 rounded-2xs p-0 [&_svg:not([class*='size-'])]:size-icon-sm",
            'icon-sm':
                "size-control-h-sm min-h-0 min-w-0 gap-0 rounded-sm p-0 [&_svg:not([class*='size-'])]:size-icon-md",
        },
    },
    defaultVariants: {size: 'xs'},
})

const inputGroupTextClassName =
    "text-foreground-subtle [&_svg:not([class*='size-'])]:size-icon-sm flex items-center gap-2 text-sm [&_svg]:pointer-events-none"
const inputGroupInputClassName =
    'h-full flex-1 rounded-none border-0 bg-transparent p-0 shadow-none outline-none ring-0 read-only:bg-transparent disabled:bg-transparent focus-visible:outline-none focus-visible:ring-0 aria-invalid:ring-0'
const inputGroupTextareaClassName =
    'min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent p-0 shadow-none outline-none ring-0 read-only:bg-transparent disabled:bg-transparent focus-visible:outline-none focus-visible:ring-0 aria-invalid:ring-0'

export {
    inputGroupClassName,
    inputGroupAddonVariants,
    inputGroupButtonVariants,
    inputGroupTextClassName,
    inputGroupInputClassName,
    inputGroupTextareaClassName,
}
