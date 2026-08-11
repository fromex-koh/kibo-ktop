'use client'

import {useId, useState, type ReactNode} from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {FieldError} from '@/components/ui/field'
import {
    questionSelectClassName,
    questionSelectSentenceClassName,
    questionSelectTriggerClassName,
    questionSelectValueClassName,
} from '@/components/theme/question-list.variants'
import {cn} from '@/lib/utils'

// 선택형 문항 본문(QuestionSelect) — 문장 안에 현재 선택값을 [ ] 로 보여주고, 그 아래 줄에 Select 를 둔다.
// Figma "li_복합형_셀렉트" 반영: "신청기술의 기술성숙도(TRL)는 [3]단계에 해당한다" 처럼 문장이 답과 함께 읽힌다.
// 선택값이 바뀌면 문장 속 값도 즉시 따라 바뀌므로 상태를 가진 클라이언트 컴포넌트다.
// QuestionItem 의 본문(children)으로 넣어 쓴다 — 번호·우측 컨트롤 배치는 QuestionList 가 그대로 담당한다.
type QuestionSelectOption = {
    value: string
    // 목록에 보이는 문구(예: "3단계").
    label: string
    // 문장 안 [ ] 에 넣을 짧은 표기(예: "3"). 생략하면 label 을 쓴다.
    token?: string
}

type QuestionSelectProps = {
    options: readonly QuestionSelectOption[]
    // 선택 컨트롤의 접근 가능한 이름 — 문장이 라벨 역할을 하지만 컨트롤 자체에도 이름이 필요하다[7.4.1].
    label: string
    // 문장에서 선택값 앞·뒤에 오는 문구. 값 앞에는 공백 한 칸이 자동으로 들어간다.
    before: string
    after: string
    name?: string
    // 선택값을 바깥에서 들고 있을 때 쓴다(둘 다 넘기면 제어 컴포넌트로 동작한다).
    value?: string
    onValueChange?: (value: string) => void
    defaultValue?: string
    // 미선택 상태의 문구 — 문장 속 [ ] 와 트리거에 함께 쓴다.
    placeholder?: string
    // 문장 끝에 이어 붙는 인라인 액션(예: "TRL 확인" 안내 버튼) — 시안은 같은 줄에 8 간격으로 둔다.
    action?: ReactNode
    // 검사에 걸렸을 때의 안내 문구 — 선택 상자 아래에 놓이고 컨트롤과 aria 로 이어진다[7.4.2].
    error?: string
    className?: string
    triggerClassName?: string
}

const QuestionSelect = ({
    options,
    label,
    before,
    after,
    name,
    value: valueProp,
    onValueChange,
    defaultValue = '',
    placeholder = '선택',
    action,
    error,
    className,
    triggerClassName,
}: QuestionSelectProps) => {
    const errorId = useId()
    const [internalValue, setInternalValue] = useState(defaultValue)
    const value = valueProp ?? internalValue
    const handleValueChange = (next: string) => {
        setInternalValue(next)
        onValueChange?.(next)
    }
    const selected = options.find((option) => option.value === value)
    const selectedToken = selected ? (selected.token ?? selected.label) : placeholder

    return (
        <span data-slot="question-select" className={cn(questionSelectClassName, className)}>
            <span className={questionSelectSentenceClassName}>
                <span>
                    {before}{' '}
                    <span data-slot="question-select-value" className={questionSelectValueClassName}>
                        {`[${selectedToken}]`}
                    </span>
                    {after}
                </span>
                {action}
            </span>
            <Select name={name} value={value} onValueChange={handleValueChange}>
                <SelectTrigger
                    size="md"
                    aria-label={label}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={cn(questionSelectTriggerClassName, triggerClassName)}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error ? <FieldError id={errorId}>{error}</FieldError> : null}
        </span>
    )
}

export {QuestionSelect}
export type {QuestionSelectProps, QuestionSelectOption}
