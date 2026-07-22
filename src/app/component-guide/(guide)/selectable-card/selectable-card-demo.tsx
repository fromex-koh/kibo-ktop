'use client'

import {useState} from 'react'
import {SelectableCard, SelectableCardGroup} from '@/components/composite/selectable-card'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'

// 라벨 왼쪽 뱃지 — 필수(파란 아웃라인)·선택(회색 아웃라인).
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

// ── control="radio" ──────────────────────────────────────────────────────────
//
// 열 수와 반응형 분기는 컴포넌트가 아니라 이 화면이 정한다. SelectableCardGroup 은 1단 grid 라는
// 고유 스타일만 갖고, 화면마다 필요한 배치를 className 으로 얹는다 — 같은 컴포넌트를 쓰는 다른
// 화면이 2단을 강제로 물려받지 않게 하려는 것이다. 아래 동의 화면들은 Figma 기준(카드 592px 2개
// + 간격 16px = 콘텐츠 폭 1200px)에 맞춰 데스크톱에서만 2단으로 나눈다.

// 기본 — 뱃지 없이 라벨만. 그룹 안에서 하나만 선택된다.
export const RadioBasicDemo = () => {
    const [value, setValue] = useState('required')
    return (
        <SelectableCardGroup
            name="radio-basic"
            aria-label="동의 범위"
            value={value}
            onValueChange={setValue}
            className="gap-4 xl:grid-cols-2"
        >
            <SelectableCard control="radio" value="required">
                필수항목만 동의
            </SelectableCard>
            <SelectableCard control="radio" value="all">
                전체 항목 동의
            </SelectableCard>
        </SelectableCardGroup>
    )
}

// 뱃지 — 라벨 왼쪽에 1개(필수) 또는 2개(필수·선택)를 붙인다.
export const RadioBadgeDemo = () => {
    const [value, setValue] = useState('required')
    return (
        <SelectableCardGroup
            name="radio-badge"
            aria-label="동의 범위 (뱃지)"
            value={value}
            onValueChange={setValue}
            className="gap-4 xl:grid-cols-2"
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

// 비활성 — 미선택·선택을 함께 둬서 테두리 표시 규칙까지 비교한다.
export const RadioDisabledDemo = () => (
    <SelectableCardGroup
        name="radio-disabled"
        aria-label="비활성 라디오 상태"
        value="disabled-checked"
        className="gap-4 xl:grid-cols-2"
    >
        <SelectableCard control="radio" value="disabled-default" disabled>
            비활성 미선택
        </SelectableCard>
        <SelectableCard control="radio" value="disabled-checked" disabled>
            비활성 선택
        </SelectableCard>
    </SelectableCardGroup>
)

// ── control="checkbox" ───────────────────────────────────────────────────────

// 기본 — 카드마다 독립적으로 켜고 끈다. 선택하면 라벨이 Bold 로 강조된다.
export const CheckboxBasicDemo = () => {
    const [unchecked, setUnchecked] = useState(false)
    const [checked, setChecked] = useState(true)
    return (
        <div className="flex flex-col gap-4">
            <SelectableCard control="checkbox" checked={unchecked} onCheckedChange={setUnchecked}>
                본인은 기술보증기금과 동의서를 작성함에 이 동의서의 중요한 내용에 대한 설명을 읽고 이해하였음을
                확인합니다.
            </SelectableCard>
            <SelectableCard control="checkbox" checked={checked} onCheckedChange={setChecked}>
                본인은 회원정보(마이페이지)상 이메일정보를 확인하였으며, 해당 이메일로 발송됨에 동의합니다.
            </SelectableCard>
        </div>
    )
}

// 뱃지 — checkbox 카드도 같은 badges 슬롯을 쓴다. 항목마다 필수·선택이 갈리므로 뱃지로 구분한다.
export const CheckboxBadgeDemo = () => {
    const [required, setRequired] = useState(true)
    const [optional, setOptional] = useState(false)
    return (
        <div className="flex flex-col gap-4">
            <SelectableCard
                control="checkbox"
                checked={required}
                onCheckedChange={setRequired}
                badges={<RequiredBadge />}
            >
                개인정보 수집·이용에 동의합니다.
            </SelectableCard>
            <SelectableCard
                control="checkbox"
                checked={optional}
                onCheckedChange={setOptional}
                badges={<OptionalBadge />}
            >
                마케팅 정보 수신에 동의합니다.
            </SelectableCard>
        </div>
    )
}

// 비활성 — 미선택·선택을 함께 둬서 테두리 표시 규칙까지 비교한다.
export const CheckboxDisabledDemo = () => (
    <div className="flex flex-col gap-4">
        <SelectableCard control="checkbox" checked={false} disabled>
            비활성 미선택
        </SelectableCard>
        <SelectableCard control="checkbox" checked disabled>
            비활성 선택
        </SelectableCard>
    </div>
)

// ── 폼 제출 ──────────────────────────────────────────────────────────────────

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
                    className="gap-4 xl:grid-cols-2"
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
                    <Button type="submit" variant="default" size="md">
                        신청 내용 확인
                    </Button>
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
