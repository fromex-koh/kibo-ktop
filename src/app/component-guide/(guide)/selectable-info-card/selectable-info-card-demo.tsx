'use client'

import {useState} from 'react'
import {SelectableInfoCard, SelectableInfoCardGroup} from '@/components/composite/selectable-info-card'

// 가이드 데모 — 기업혁신성장의 검색된 기업 목록과 같은 모양이다.
const DEMO_COMPANIES = [
    {id: 'c-1', name: '프롬엑스테크', corporateNumber: '110111-1234567', patentCount: '2건'},
    {id: 'c-2', name: '네오에너지솔루션', corporateNumber: '10-2024-0001234', patentCount: '2건'},
] as const

const SelectableInfoCardDemo = () => {
    const [value, setValue] = useState<string>(DEMO_COMPANIES[0].id)

    return (
        <div className="bg-background flex flex-col gap-4 rounded-xl p-4 md:p-6">
            <SelectableInfoCardGroup value={value} onValueChange={setValue} aria-label="검색된 기업 목록">
                {DEMO_COMPANIES.map((company) => (
                    <SelectableInfoCard
                        key={company.id}
                        value={company.id}
                        fields={[
                            {label: '기업명', value: company.name},
                            {label: '법인번호', value: company.corporateNumber},
                            {label: '특허수', value: company.patentCount},
                        ]}
                    />
                ))}
            </SelectableInfoCardGroup>
            <p className="typo-body-l-regular text-foreground-subtle" aria-live="polite">
                onValueChange — 고른 값: {value}
            </p>
        </div>
    )
}

export {SelectableInfoCardDemo}
