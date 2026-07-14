'use client'

import {useState} from 'react'
import {DescriptionListItem} from '@/components/composite/description-list'
import {FormCard} from '@/components/composite/form-card'
import {
    SelectableDescriptionList,
    SelectableDescriptionListGroup,
} from '@/components/composite/selectable-description-list'

// 기업 선택 후보 2건 — Figma "리스트"(기업 선택) 반영.
const COMPANIES = [
    {value: 'promx', name: '프롬엑스테크', corpNumber: '110111-1234567', patentCount: '12건'},
    {value: 'neo-energy', name: '네오에너지솔루션', corpNumber: '220222-9876543', patentCount: '7건'},
] as const

// 카드 선택은 controlled value 로만 강조가 반영된다(SelectableCard 와 동일 이유) — 그래서 데모는
// 'use client' + useState 로 value/onValueChange 를 직접 들고 있다(defaultValue 로는 강조가 안 됨).

// 사용 예시 — 하나 선택, 직접 눌러 바꿔볼 수 있다.
export const SelectableDescriptionListUsageDemo = () => {
    const [value, setValue] = useState('neo-energy')
    return (
        <SelectableDescriptionListGroup value={value} onValueChange={setValue} aria-label="기업 선택 예시">
            {COMPANIES.map((c) => (
                <SelectableDescriptionList key={c.value} value={c.value}>
                    <DescriptionListItem term="기업명">{c.name}</DescriptionListItem>
                    <DescriptionListItem term="법인번호">{c.corpNumber}</DescriptionListItem>
                    <DescriptionListItem term="특허수">{c.patentCount}</DescriptionListItem>
                </SelectableDescriptionList>
            ))}
        </SelectableDescriptionListGroup>
    )
}

// 비활성 — 두 번째 카드(네오에너지솔루션)는 고를 수 없다.
export const SelectableDescriptionListDisabledDemo = () => {
    const [value, setValue] = useState('promx')
    return (
        <SelectableDescriptionListGroup value={value} onValueChange={setValue} aria-label="기업 선택 예시(비활성)">
            <SelectableDescriptionList value="promx">
                <DescriptionListItem term="기업명">프롬엑스테크</DescriptionListItem>
                <DescriptionListItem term="법인번호">110111-1234567</DescriptionListItem>
            </SelectableDescriptionList>
            <SelectableDescriptionList value="neo-energy" disabled>
                <DescriptionListItem term="기업명">네오에너지솔루션</DescriptionListItem>
                <DescriptionListItem term="법인번호">220222-9876543</DescriptionListItem>
            </SelectableDescriptionList>
        </SelectableDescriptionListGroup>
    )
}

// FormCard 안에서 사용 — 실제 화면처럼 "기업 선택" 제목과 함께.
export const SelectableDescriptionListFormCardDemo = () => {
    const [value, setValue] = useState('neo-energy')
    return (
        <FormCard title="기업 선택">
            <SelectableDescriptionListGroup value={value} onValueChange={setValue} aria-label="기업 선택">
                {COMPANIES.map((c) => (
                    <SelectableDescriptionList key={c.value} value={c.value}>
                        <DescriptionListItem term="기업명">{c.name}</DescriptionListItem>
                        <DescriptionListItem term="법인번호">{c.corpNumber}</DescriptionListItem>
                        <DescriptionListItem term="특허수">{c.patentCount}</DescriptionListItem>
                    </SelectableDescriptionList>
                ))}
            </SelectableDescriptionListGroup>
        </FormCard>
    )
}
