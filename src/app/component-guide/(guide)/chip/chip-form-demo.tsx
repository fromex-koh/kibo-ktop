'use client'

import {useState} from 'react'
import {ChipCheckbox, ChipCheckboxGroup, ChipRadio, ChipRadioGroup} from '@/components/composite/chip'
import {Button} from '@/components/ui/button'

const ChipFormDemo = () => {
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                const result = {
                    plan: formData.get('plan'),
                    interest: formData.getAll('interest'),
                }
                setSubmittedData(JSON.stringify(result))
            }}
        >
            <fieldset className="flex flex-col gap-3">
                <legend id="chip-plan-label" className="typo-title-l-medium text-foreground">
                    이용 요금제
                </legend>
                <p className="typo-body-l-regular text-muted-foreground">신청할 요금제를 하나 선택해 주세요.</p>
                <ChipRadioGroup name="plan" defaultValue="basic" aria-labelledby="chip-plan-label">
                    <ChipRadio value="basic">기본형</ChipRadio>
                    <ChipRadio value="premium">프리미엄형</ChipRadio>
                    <ChipRadio value="custom">맞춤형</ChipRadio>
                </ChipRadioGroup>
            </fieldset>

            <fieldset className="flex flex-col gap-3">
                <legend id="chip-interest-label" className="typo-title-l-medium text-foreground">
                    관심 분야
                </legend>
                <p className="typo-body-l-regular text-muted-foreground">관심 있는 분야를 모두 선택해 주세요.</p>
                <ChipCheckboxGroup aria-labelledby="chip-interest-label">
                    <ChipCheckbox name="interest" value="ai" defaultChecked>
                        AI
                    </ChipCheckbox>
                    <ChipCheckbox name="interest" value="cloud">
                        클라우드
                    </ChipCheckbox>
                    <ChipCheckbox name="interest" value="security">
                        보안
                    </ChipCheckbox>
                </ChipCheckboxGroup>
            </fieldset>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit">선택 내용 확인</Button>
                    <span className="typo-body-l-regular text-muted-foreground">
                        라디오는 단일 값, 체크박스는 선택된 값 배열로 확인합니다.
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

export default ChipFormDemo
