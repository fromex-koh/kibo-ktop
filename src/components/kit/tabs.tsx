'use client'

import * as React from 'react'
import {cva, type VariantProps} from 'class-variance-authority'
import {Tabs as TabsPrimitive} from 'radix-ui'

import {cn} from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// 프로젝트 Tabs (styled copy)
//
// 이 파일은 `src/components/ui/tabs.tsx`(shadcn 갓 다운로드 바닐라 원본)를 **그대로 복사**한 것으로,
// 원본과의 유일한 차이는 아래 `tabsListVariants`·`TabsTrigger` 의 className(스타일 정의)뿐이다. 함수 셸
// (Tabs·TabsList·TabsTrigger·TabsContent·data-slot·props·export)은 원본과 100% 동일하게 유지한다.
//
// Figma "line" 탭(예: 마이페이지 상단 내비 — "내 정보 확인 | 진행현황 결과조회 | …") 반영. shadcn 원본에
// 이미 이 언더라인 탭 패턴을 위한 variant="line" 이 있어([SC-03]), 새로 만들지 않고 그 variant 의 스타일만
// Figma 값으로 교체했다(default=세그먼트 탭은 Figma 스펙이 없어 원본 그대로 둔다).
//
// Figma 실측: 트리거 높이 52px(control-h-xl)·가로 패딩 24px(px-6)·탭 사이 간격 16px(gap-4)·글자 24px.
// 비활성 = text-foreground-subtle(gray.500)·Regular, 활성 = text-foreground(gray.900)·Bold. 밑줄(after
// 의사요소, 원본 그대로 재사용)은 bg-foreground 2px. 리스트 전체 하단에 옅은 구분선(border-subtle-2=gray.200)을
// 깐다 — 탭 바 전체 폭에 걸친 얇은 선 위에, 활성 탭만 진한 밑줄이 겹쳐 보이는 구조다.
// ─────────────────────────────────────────────────────────────────────────────

function Tabs({className, orientation = 'horizontal', ...props}: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            className={cn('group/tabs flex gap-2 data-horizontal:flex-col', className)}
            {...props}
        />
    )
}

const tabsListVariants = cva(
    'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-1 text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none',
    {
        variants: {
            variant: {
                default: 'bg-muted',
                line: 'data-[variant=line]:h-control-h-xl data-[variant=line]:w-full data-[variant=line]:justify-start data-[variant=line]:gap-4 data-[variant=line]:border-subtle-2 data-[variant=line]:border-b data-[variant=line]:bg-transparent data-[variant=line]:p-0',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
)

function TabsList({
    className,
    variant = 'default',
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            className={cn(tabsListVariants({variant}), className)}
            {...props}
        />
    )
}

function TabsTrigger({className, ...props}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(
                "text-foreground/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring relative inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start focus-visible:ring-3 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent',
                'data-active:bg-background data-active:text-foreground',
                'after:bg-foreground after:absolute after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:-bottom-1 group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100',
                // Figma "line" 탭 실측 — 높이 52px·가로 패딩 24px·정사각 아닌 hug 폭(flex-none)·좌측 정렬.
                // 텍스트는 24px, 비활성 Regular/gray.500 → 활성 Bold/gray.900. 밑줄은 리스트 하단 구분선과 같은
                // 높이(after:bottom-0)에 겹치도록 정렬한다.
                'group-data-[variant=line]/tabs-list:h-control-h-xl group-data-[variant=line]/tabs-list:text-foreground-subtle group-data-[variant=line]/tabs-list:data-active:text-foreground group-data-[variant=line]/tabs-list:flex-none group-data-[variant=line]/tabs-list:justify-start group-data-[variant=line]/tabs-list:gap-0 group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:border-0 group-data-[variant=line]/tabs-list:px-6 group-data-[variant=line]/tabs-list:py-0 group-data-[variant=line]/tabs-list:text-2xl group-data-[variant=line]/tabs-list:font-normal group-data-[variant=line]/tabs-list:after:bottom-0 group-data-[variant=line]/tabs-list:data-active:font-bold',
                className,
            )}
            {...props}
        />
    )
}

function TabsContent({className, ...props}: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn('flex-1 text-sm outline-none', className)}
            {...props}
        />
    )
}

export {Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants}
