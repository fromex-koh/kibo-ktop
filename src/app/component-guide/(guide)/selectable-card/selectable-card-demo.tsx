'use client'

import {useState} from 'react'
import {SelectableCard, SelectableCardGroup} from '@/components/composite/selectable-card'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'

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

// 상태 큐레이션 — 체크전·체크후·비활성(disabled).
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
        <SelectableCardGroup
            name="agreement"
            aria-label="동의 범위"
            value={value}
            onValueChange={setValue}
            className="grid-cols-2 gap-3"
        >
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

export const SelectableCardRadioStatesDemo = () => (
    <div className="flex flex-col gap-3">
        <SelectableCardGroup
            name="radio-default-state"
            aria-label="기본 라디오 상태"
            value="checked"
            className="grid-cols-2 gap-3"
        >
            <SelectableCard control="radio" value="default">
                기본 (default)
            </SelectableCard>
            <SelectableCard control="radio" value="checked">
                선택됨 (checked)
            </SelectableCard>
        </SelectableCardGroup>
        <SelectableCardGroup
            name="radio-disabled-state"
            aria-label="비활성 라디오 상태"
            value="disabled-checked"
            className="grid-cols-2 gap-3"
        >
            <SelectableCard control="radio" value="disabled-default" disabled>
                비활성 미선택
            </SelectableCard>
            <SelectableCard control="radio" value="disabled-checked" disabled>
                비활성 선택
            </SelectableCard>
        </SelectableCardGroup>
    </div>
)

export const SelectableCardFormDemo = () => {
    const [consent, setConsent] = useState(false)
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
                event.preventDefault()
                const entries = Array.from(new FormData(event.currentTarget).entries()).map(([key, value]) => [
                    key,
                    String(value),
                ])
                setSubmittedData(JSON.stringify(entries))
            }}
        >
            <fieldset className="flex flex-col gap-3">
                <legend id="applicant-type-label" className="typo-title-l-medium text-foreground">
                    신청 주체
                </legend>
                <p className="typo-body-l-regular text-muted-foreground">
                    사업자 유형에 맞는 신청 주체를 선택해 주세요.
                </p>
                <SelectableCardGroup
                    name="applicantType"
                    aria-labelledby="applicant-type-label"
                    defaultValue="corporation"
                    className="grid-cols-2 gap-3"
                    required
                >
                    <SelectableCard control="radio" value="corporation">
                        법인사업자
                    </SelectableCard>
                    <SelectableCard control="radio" value="sole-proprietor">
                        개인사업자
                    </SelectableCard>
                </SelectableCardGroup>
            </fieldset>

            <fieldset className="flex flex-col gap-3">
                <legend className="typo-title-l-medium text-foreground">필수 동의</legend>
                <SelectableCard
                    control="checkbox"
                    name="privacyConsent"
                    value="agreed"
                    checked={consent}
                    onCheckedChange={setConsent}
                    badges={<RequiredBadge />}
                    required
                >
                    개인정보 수집·이용에 동의합니다.
                </SelectableCard>
            </fieldset>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit">신청 내용 확인</Button>
                    <span className="typo-body-l-regular text-muted-foreground">
                        name과 value를 지정한 선택값이 FormData에 포함되는지 확인합니다.
                    </span>
                </div>
                <output
                    className="typo-body-l-regular bg-surface border-border text-muted-foreground min-h-10 rounded-md border px-3 py-2 break-all"
                    aria-live="polite"
                >
                    {submittedData}
                </output>
            </div>
        </form>
    )
}
