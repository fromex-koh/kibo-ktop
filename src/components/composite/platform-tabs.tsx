'use client'

import {createContext, useContext, type ComponentProps} from 'react'
import {platformTabsListVariants, platformTabsTriggerVariants} from '@/components/theme/platform-intro.variants'
import {TabsList, TabsTrigger} from '@/components/ui/tabs'
import {cn} from '@/lib/utils'

// 플랫폼 탭 — 플랫폼 소개 화면의 회색 트랙 탭(모형 상세 · 보고서 미리보기 등). 칸 폭이 글자 길이를 따르고, 고른 칸은 카드 면 + 강조 글자.
// Tabs · TabsContent 는 ui/tabs 를 그대로 쓰고 목록과 칸만 이 파일의 것으로 바꾼다(SegmentedTabs 와 같은 방식).
// 탭 역할 · 방향키 이동 · aria-selected 는 Radix Tabs 가 맡는다[8.2.1]. size: md(기본 · 칸 높이 42) · sm(36).
//
//   <Tabs defaultValue="a">
//     <PlatformTabsList aria-label="평가모형 상세">
//       <PlatformTabsTrigger value="a">KTRS-FM</PlatformTabsTrigger>
//     </PlatformTabsList>
//     <TabsContent value="a">…</TabsContent>
//   </Tabs>

type PlatformTabsSize = 'md' | 'sm'

const PlatformTabsSizeContext = createContext<PlatformTabsSize>('md')

const PlatformTabsList = ({
    size = 'md',
    className,
    ...props
}: Omit<ComponentProps<typeof TabsList>, 'variant'> & {size?: PlatformTabsSize}) => (
    <PlatformTabsSizeContext.Provider value={size}>
        <TabsList
            variant="plain"
            data-slot="platform-tabs-list"
            className={cn(platformTabsListVariants({size}), className)}
            {...props}
        />
    </PlatformTabsSizeContext.Provider>
)

const PlatformTabsTrigger = ({className, ...props}: ComponentProps<typeof TabsTrigger>) => {
    const size = useContext(PlatformTabsSizeContext)
    return (
        <TabsTrigger
            data-slot="platform-tabs-trigger"
            className={cn(platformTabsTriggerVariants({size}), className)}
            {...props}
        />
    )
}

export {PlatformTabsList, PlatformTabsTrigger}
