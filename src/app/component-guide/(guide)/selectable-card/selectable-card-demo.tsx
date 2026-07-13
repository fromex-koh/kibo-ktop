'use client'

import {useState} from 'react'
import {SelectableCard, SelectableCardGroup} from '@/components/composite/selectable-card'
import {Badge} from '@/components/kit/badge'

// 우측 뱃지 — 필수(파란 아웃라인)·선택(회색 아웃라인).
const RequiredBadge = () => (
    <Badge variant="outline" color="info" shape="round">
        필수
    </Badge>
)
const OptionalBadge = () => (
    <Badge variant="outline" color="neutral" shape="round">
        선택
    </Badge>
)

// 상태 큐레이션 — 체크전·체크후·비활성(disabled)·읽기전용(readOnly).
export const SelectableCardStatesDemo = () => {
    const [unchecked, setUnchecked] = useState(false)
    const [checked, setChecked] = useState(true)
    return (
        <div className="flex flex-col gap-3">
            <SelectableCard control="checkbox" checked={unchecked} onCheckedChange={setUnchecked}>
                체크전 (unchecked)
            </SelectableCard>
            <SelectableCard control="checkbox" checked={checked} onCheckedChange={setChecked}>
                체크후 (checked)
            </SelectableCard>
            <SelectableCard control="checkbox" checked={false} disabled>
                비활성 (disabled)
            </SelectableCard>
            <SelectableCard control="checkbox" checked readOnly>
                읽기전용 (readOnly)
            </SelectableCard>
        </div>
    )
}

// 뱃지 케이스 — 우측 뱃지 1개(필수) / 2개(필수·선택).
export const SelectableCardBadgeDemo = () => {
    const [one, setOne] = useState(true)
    const [two, setTwo] = useState(false)
    return (
        <div className="flex flex-col gap-3">
            <SelectableCard control="checkbox" checked={one} onCheckedChange={setOne} badges={<RequiredBadge />}>
                필수항목만 동의
            </SelectableCard>
            <SelectableCard
                control="checkbox"
                checked={two}
                onCheckedChange={setTwo}
                badges={
                    <>
                        <RequiredBadge />
                        <OptionalBadge />
                    </>
                }
            >
                전체 항목 동의
            </SelectableCard>
        </div>
    )
}

// 라디오 그룹 — 카드형 라디오(단일 선택). Figma "동의" 예시.
export const SelectableCardRadioDemo = () => {
    const [value, setValue] = useState('required')
    return (
        <SelectableCardGroup value={value} onValueChange={setValue} className="grid-cols-2 gap-3">
            <SelectableCard control="radio" value="required" badges={<RequiredBadge />}>
                필수항목만 동의
            </SelectableCard>
            <SelectableCard
                control="radio"
                value="all"
                badges={
                    <>
                        <RequiredBadge />
                        <OptionalBadge />
                    </>
                }
            >
                전체 항목 동의
            </SelectableCard>
        </SelectableCardGroup>
    )
}
