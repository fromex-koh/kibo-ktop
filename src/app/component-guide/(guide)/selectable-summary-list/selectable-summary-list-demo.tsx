'use client'

import {useState} from 'react'
import {SummaryListItem} from '@/components/composite/summary-list'
import {FormCard} from '@/components/composite/form-card'
import {SelectableSummaryList, SelectableSummaryListGroup} from '@/components/composite/selectable-summary-list'

// 기업 선택 후보 2건 — Figma "리스트"(기업 선택) 반영.
const COMPANIES = [
    {value: 'promx', name: '프롬엑스테크', corpNumber: '110111-1234567', patentCount: '12건'},
    {value: 'neo-energy', name: '네오에너지솔루션', corpNumber: '220222-9876543', patentCount: '7건'},
] as const

// 카드 선택은 controlled value 로만 강조가 반영된다(SelectableCard 와 동일 이유) — 그래서 데모는
// 'use client' + useState 로 value/onValueChange 를 직접 들고 있다(defaultValue 로는 강조가 안 됨).

// 사용 예시 — 하나 선택, 직접 눌러 바꿔볼 수 있다.
export const SelectableSummaryListUsageDemo = () => {
    const [value, setValue] = useState('neo-energy')
    return (
        <SelectableSummaryListGroup value={value} onValueChange={setValue} aria-label="기업 선택 예시">
            {COMPANIES.map((c) => (
                <SelectableSummaryList key={c.value} value={c.value}>
                    <SummaryListItem term="기업명">{c.name}</SummaryListItem>
                    <SummaryListItem term="법인번호">{c.corpNumber}</SummaryListItem>
                    <SummaryListItem term="특허수">{c.patentCount}</SummaryListItem>
                </SelectableSummaryList>
            ))}
        </SelectableSummaryListGroup>
    )
}

// 비활성 — 두 번째 카드(네오에너지솔루션)는 고를 수 없다.
export const SelectableSummaryListDisabledDemo = () => {
    const [value, setValue] = useState('promx')
    return (
        <SelectableSummaryListGroup value={value} onValueChange={setValue} aria-label="기업 선택 예시(비활성)">
            <SelectableSummaryList value="promx">
                <SummaryListItem term="기업명">프롬엑스테크</SummaryListItem>
                <SummaryListItem term="법인번호">110111-1234567</SummaryListItem>
            </SelectableSummaryList>
            <SelectableSummaryList value="neo-energy" disabled>
                <SummaryListItem term="기업명">네오에너지솔루션</SummaryListItem>
                <SummaryListItem term="법인번호">220222-9876543</SummaryListItem>
            </SelectableSummaryList>
        </SelectableSummaryListGroup>
    )
}

// FormCard 안에서 사용 — 실제 화면처럼 "기업 선택" 제목과 함께.
export const SelectableSummaryListFormCardDemo = () => {
    const [value, setValue] = useState('neo-energy')
    return (
        <FormCard title="기업 선택">
            <SelectableSummaryListGroup value={value} onValueChange={setValue} aria-label="기업 선택">
                {COMPANIES.map((c) => (
                    <SelectableSummaryList key={c.value} value={c.value}>
                        <SummaryListItem term="기업명">{c.name}</SummaryListItem>
                        <SummaryListItem term="법인번호">{c.corpNumber}</SummaryListItem>
                        <SummaryListItem term="특허수">{c.patentCount}</SummaryListItem>
                    </SelectableSummaryList>
                ))}
            </SelectableSummaryListGroup>
        </FormCard>
    )
}
