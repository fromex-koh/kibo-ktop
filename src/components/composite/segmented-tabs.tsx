'use client'

import type {ComponentProps} from 'react'
import {TabsList, TabsTrigger} from '@/components/ui/tabs'
import {segmentedTabsListClassName, segmentedTabsTriggerClassName} from '@/components/theme/segmented-tabs.variants'
import {cn} from '@/lib/utils'

// 세그먼트 탭(SegmentedTabs) — 회색 트랙 안에서 하나를 고르는 탭 목록. 고른 칸에 따라 아래 패널(TabsContent)이 바뀐다.
// 예: 가격정책의 회원유형 탭(기업회원 · 기관회원).
//
// 모양만 다른 Tabs 다 — Tabs · TabsContent 는 ui/tabs 를 그대로 쓰고, 목록과 칸만 이 파일의 것으로 바꾼다.
// 탭 역할(role=tablist · tab · tabpanel), 방향키 이동, aria-selected 는 Radix Tabs 가 맡는다.
// 패널 없이 값만 고르는 경우(필터 등)는 SegmentedControl 을 쓴다.
//
//   <Tabs defaultValue="corp">
//     <SegmentedTabsList aria-label="회원유형">
//       <SegmentedTabsTrigger value="corp">기업회원</SegmentedTabsTrigger>
//       <SegmentedTabsTrigger value="org">기관회원</SegmentedTabsTrigger>
//     </SegmentedTabsList>
//     <TabsContent value="corp">…</TabsContent>
//   </Tabs>

const SegmentedTabsList = ({className, ...props}: Omit<ComponentProps<typeof TabsList>, 'variant'>) => (
    <TabsList
        variant="plain"
        data-slot="segmented-tabs-list"
        className={cn(segmentedTabsListClassName, className)}
        {...props}
    />
)

const SegmentedTabsTrigger = ({className, ...props}: ComponentProps<typeof TabsTrigger>) => (
    <TabsTrigger
        data-slot="segmented-tabs-trigger"
        className={cn(segmentedTabsTriggerClassName, className)}
        {...props}
    />
)

export {SegmentedTabsList, SegmentedTabsTrigger}
