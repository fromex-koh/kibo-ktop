'use client'

// [퍼블리싱 가이드 전용] 알약 전환 탭 미리보기 — 고르면 아래 글이 바뀐다.

import {useState} from 'react'
import {Tabs as TabsPrimitive} from 'radix-ui'
import {PILL_TAB_LIST_CLASS_NAME, PILL_TAB_TRIGGER_CLASS_NAME} from '@/components/theme/pill-tabs.variants'

const DEMO_TABS = [
    {value: 'leading-sme', label: '탄소중립 선도중소기업확인 플랫폼'},
    {value: 'taxonomy', label: '개방형 K-택소노미 플랫폼'},
] as const

const PillTabsDemo = () => {
    const [value, setValue] = useState<string>(DEMO_TABS[0].value)

    return (
        <TabsPrimitive.Root value={value} onValueChange={setValue} className="flex flex-col items-center gap-4">
            <TabsPrimitive.List aria-label="미리보기 플랫폼" className={PILL_TAB_LIST_CLASS_NAME}>
                {DEMO_TABS.map((tab) => (
                    <TabsPrimitive.Trigger key={tab.value} value={tab.value} className={PILL_TAB_TRIGGER_CLASS_NAME}>
                        {tab.label}
                    </TabsPrimitive.Trigger>
                ))}
            </TabsPrimitive.List>
            {DEMO_TABS.map((tab) => (
                <TabsPrimitive.Content
                    key={tab.value}
                    value={tab.value}
                    forceMount
                    className="typo-body-l-regular text-label-foreground motion-safe:data-[state=active]:animate-in motion-safe:data-[state=active]:fade-in-0 transition-none outline-none data-[state=inactive]:hidden motion-safe:data-[state=active]:duration-500"
                >
                    {tab.label} 내용이 여기에 보입니다.
                </TabsPrimitive.Content>
            ))}
        </TabsPrimitive.Root>
    )
}

export {PillTabsDemo}
