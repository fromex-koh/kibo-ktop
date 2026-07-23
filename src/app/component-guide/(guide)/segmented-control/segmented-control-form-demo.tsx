'use client'

import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {Field, FieldLabel} from '@/components/ui/field'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'

// 세그먼티드 컨트롤은 토글 성격이라 보통 한 항목이 기본 선택된 상태로 제공된다.
// 따라서 '필수/미선택 오류'보다는 기본값이 있는 컨트롤의 선택값이 name 에 맞춰 FormData 로 제출되는 흐름을 보여준다.
const SegmentedControlFormDemo = () => {
    const [userType, setUserType] = useState('corp')
    const [period, setPeriod] = useState('3months')
    const [result, setResult] = useState('')

    return (
        <form
            className="border-border flex flex-col items-start gap-6 rounded-md border p-6"
            onSubmit={(event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                setResult(JSON.stringify(Object.fromEntries(formData.entries())))
            }}
        >
            <Field className="items-start">
                <FieldLabel id="user-type-label" htmlFor="user-type-corp" className="text-foreground font-bold">
                    회원 유형
                </FieldLabel>
                <div className="w-fit">
                    <SegmentedControl
                        type="radio"
                        name="userType"
                        value={userType}
                        onValueChange={setUserType}
                        aria-labelledby="user-type-label"
                    >
                        <SegmentedControlItem id="user-type-corp" value="corp">
                            기업
                        </SegmentedControlItem>
                        <SegmentedControlItem value="org">기관</SegmentedControlItem>
                    </SegmentedControl>
                </div>
            </Field>

            <Field className="items-start">
                <FieldLabel id="period-label" htmlFor="period-today" className="text-foreground font-bold">
                    조회 기간
                </FieldLabel>
                {/* solid 컨트롤은 항목 폭만큼만 차지하므로 w-fit 로 감싸 Field 의 자식 폭 강제(*:w-full)에서 제외한다. */}
                <div className="w-fit">
                    <SegmentedControl
                        type="radio"
                        variant="solid"
                        size="md"
                        name="period"
                        value={period}
                        onValueChange={setPeriod}
                        aria-labelledby="period-label"
                    >
                        <SegmentedControlItem id="period-today" value="today">
                            오늘
                        </SegmentedControlItem>
                        <SegmentedControlItem value="1month">1개월</SegmentedControlItem>
                        <SegmentedControlItem value="3months">3개월</SegmentedControlItem>
                        <SegmentedControlItem value="all">전체</SegmentedControlItem>
                    </SegmentedControl>
                </div>
            </Field>

            <Button type="submit" variant="default" size="md">
                선택 내용 확인
            </Button>

            {result ? (
                <output className="typo-body-l-regular bg-background border-border rounded-sm border px-4 py-3 font-mono">
                    {result}
                </output>
            ) : null}
        </form>
    )
}

export default SegmentedControlFormDemo
