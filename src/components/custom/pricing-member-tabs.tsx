'use client'

import {useState, type ReactNode} from 'react'
import {SegmentedTabsList, SegmentedTabsTrigger} from '@/components/composite/segmented-tabs'
import {Tabs, TabsContent} from '@/components/ui/tabs'
import {PRICING_MEMBERS, type PricingMember} from '@/content/service/pricing'

// 가격정책 1뎁스 탭 하나의 본문 — 가운데 구획 제목(+설명) → 회원유형 탭(기업회원 · 기관회원) → 고른 회원의 내용.
// 설명 문구가 고른 회원유형에 따라 바뀌어 탭 값을 이 파일이 들고 있다. 탭 본문은 서버에서 그린 그대로 받는다(panels).
// 1뎁스 탭마다 따로 쓰여, 회원유형 선택도 1뎁스 탭마다 따로 기억한다(처음 값은 둘 다 defaultMember).

type PricingMemberTabsProps = {
    /** 구획 제목 id 앞부분 — 1뎁스 탭마다 달라야 한다. */
    idPrefix: string
    title: string
    descriptions: Record<PricingMember, string>
    panels: Record<PricingMember, ReactNode>
    /** 처음 고를 회원유형 — 기업 화면 corp · 기관 화면 org. */
    defaultMember: PricingMember
}

const isPricingMember = (value: string): value is PricingMember =>
    PRICING_MEMBERS.some((member) => member.value === value)

const PricingMemberTabs = ({idPrefix, title, descriptions, panels, defaultMember}: PricingMemberTabsProps) => {
    const [member, setMember] = useState<PricingMember>(defaultMember)
    const titleId = `${idPrefix}-member-title`

    return (
        <section aria-labelledby={titleId} className="flex flex-col gap-10">
            <div className="flex flex-col items-center gap-2 text-center break-keep">
                <h2 id={titleId} className="typo-h2-bold text-foreground">
                    {title}
                </h2>
                <p className="typo-body-xl-regular text-foreground-subtle text-balance">{descriptions[member]}</p>
            </div>
            <Tabs
                value={member}
                onValueChange={(value) => {
                    if (isPricingMember(value)) setMember(value)
                }}
                className="gap-10"
            >
                <SegmentedTabsList aria-label="회원유형" className="self-center">
                    {PRICING_MEMBERS.map((item) => (
                        <SegmentedTabsTrigger key={item.value} value={item.value}>
                            {item.label}
                        </SegmentedTabsTrigger>
                    ))}
                </SegmentedTabsList>
                {PRICING_MEMBERS.map((item) => (
                    <TabsContent key={item.value} value={item.value}>
                        {panels[item.value]}
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    )
}

export default PricingMemberTabs
