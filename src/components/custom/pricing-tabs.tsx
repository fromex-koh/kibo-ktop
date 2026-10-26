'use client'

import type {ReactNode} from 'react'
import {TabsScrollArea} from '@/components/composite/tabs-scroll-area'
import {Tabs, TabsContent, TabsTrigger} from '@/components/ui/tabs'
import {PRICING_VIEWS, type PricingView} from '@/content/service/pricing'

// 가격정책 1뎁스 탭 — [기술평가] · [K-BIGx 보고서]. 이용약관과 같은 underline 탭이다(선택한 탭 아래에만 밑줄).
// 탭 본문은 서버에서 그린 그대로 받는다(views) — 이 파일은 탭 전환만 맡는다.
// 탭 이동, roving tabindex, aria-controls 는 Tabs 내부의 Radix 동작을 따른다.
const PricingTabs = ({
    defaultView = PRICING_VIEWS[0].value,
    views,
}: {
    defaultView?: PricingView
    views: Record<PricingView, ReactNode>
}) => (
    <Tabs defaultValue={defaultView} className="gap-10">
        {/* 모바일에서 탭이 넘치면 TabsScrollArea 가 가로 스크롤을 준다. */}
        <TabsScrollArea variant="underline" aria-label="가격정책 구분">
            {PRICING_VIEWS.map((view) => (
                <TabsTrigger key={view.value} value={view.value}>
                    {view.label}
                </TabsTrigger>
            ))}
        </TabsScrollArea>
        {PRICING_VIEWS.map((view) => (
            <TabsContent key={view.value} value={view.value}>
                {views[view.value]}
            </TabsContent>
        ))}
    </Tabs>
)

export default PricingTabs
