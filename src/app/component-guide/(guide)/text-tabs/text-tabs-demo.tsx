'use client'

import {useId, useState} from 'react'
import {TextTabs} from '@/components/composite/text-tabs'

const MODEL_TABS = [
    {value: 'ktrs-fm', label: 'KTRS-FM'},
    {value: 'tech-index', label: 'Tech-Index'},
    {value: 'startup-tech-index', label: '창업용 Tech-Index'},
    {value: 'investment-model', label: '투자모형'},
] as const

// 가이드 데모 — 고른 탭이 아래 영역을 바꾸는 것까지 함께 보여 준다.
const TextTabsDemo = () => {
    const [model, setModel] = useState<string>(MODEL_TABS[0].value)
    const panelId = useId()

    return (
        <div className="flex flex-col gap-4">
            <TextTabs items={MODEL_TABS} value={model} onValueChange={setModel} label="평가 모형" panelId={panelId} />
            <div
                id={panelId}
                role="tabpanel"
                className="bg-card border-border typo-body-l-regular text-foreground-subtle rounded-lg border p-6"
            >
                고른 값: <code className="font-mono">{model}</code>
            </div>
        </div>
    )
}

export default TextTabsDemo
