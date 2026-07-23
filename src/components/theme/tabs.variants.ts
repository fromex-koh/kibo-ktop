import {cva} from 'class-variance-authority'

const tabsListVariants = cva(
    'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-1 text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none',
    {
        variants: {
            variant: {
                default: 'bg-muted',
                line: 'data-[variant=line]:h-tab-line-h data-[variant=line]:w-full data-[variant=line]:justify-start data-[variant=line]:gap-4 data-[variant=line]:border-subtle-2 data-[variant=line]:border-b data-[variant=line]:bg-transparent data-[variant=line]:p-0',
            },
        },
        defaultVariants: {variant: 'default'},
    },
)
const tabsTriggerClassName =
    "focus-outline-inset text-foreground/60 hover:text-foreground focus-visible:outline-ring relative inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start focus-visible:outline-2 focus-visible:outline-solid disabled:pointer-events-none disabled:text-disabled disabled:opacity-100 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
// PROJECT-STYLE: line 탭은 Figma 스펙에 맞춘다 — 활성 = title-l(20px) Bold · label-foreground(gray.700),
// 비활성 = 20px Regular · foreground-subtle(gray.500), 인디케이터·활성 텍스트 = label-foreground(gray.700),
// 트랙 = border-subtle-2(gray.200), 높이 = tab-line-h(46px, Figma 전용 size 토큰).
// shadcn 원본의 24px·foreground(gray.900)·normal·h-control-h-xl(52) 과 다른 지점이다.
const tabsTriggerLineClassName =
    'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent data-active:bg-background data-active:text-foreground after:bg-label-foreground after:absolute after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:-bottom-1 group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100 group-data-[variant=line]/tabs-list:h-tab-line-h group-data-[variant=line]/tabs-list:text-foreground-subtle group-data-[variant=line]/tabs-list:data-active:text-label-foreground group-data-[variant=line]/tabs-list:data-active:font-bold group-data-[variant=line]/tabs-list:flex-none group-data-[variant=line]/tabs-list:justify-start group-data-[variant=line]/tabs-list:gap-0 group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:border-0 group-data-[variant=line]/tabs-list:px-6 group-data-[variant=line]/tabs-list:py-0 group-data-[variant=line]/tabs-list:text-xl group-data-[variant=line]/tabs-list:font-normal group-data-[variant=line]/tabs-list:after:bottom-0'
export {tabsListVariants, tabsTriggerClassName, tabsTriggerLineClassName}
