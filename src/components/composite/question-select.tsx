'use client'

import {useState} from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {
    questionSelectClassName,
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
    defaultValue?: string
    // 미선택 상태의 문구 — 문장 속 [ ] 와 트리거에 함께 쓴다.
    placeholder?: string
    className?: string
    triggerClassName?: string
}

const QuestionSelect = ({
    options,
    label,
    before,
    after,
    name,
    defaultValue = '',
    placeholder = '선택',
    className,
    triggerClassName,
}: QuestionSelectProps) => {
    const [value, setValue] = useState(defaultValue)
    const selected = options.find((option) => option.value === value)
    const selectedToken = selected ? (selected.token ?? selected.label) : placeholder

    return (
        <span data-slot="question-select" className={cn(questionSelectClassName, className)}>
            <span>
                {before}{' '}
                <span data-slot="question-select-value" className={questionSelectValueClassName}>
                    {`[${selectedToken}]`}
                </span>
                {after}
            </span>
            <Select name={name} value={value} onValueChange={setValue}>
                <SelectTrigger
                    size="md"
                    aria-label={label}
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
        </span>
    )
}

export {QuestionSelect}
export type {QuestionSelectProps, QuestionSelectOption}
