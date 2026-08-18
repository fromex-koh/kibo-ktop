'use client'

import {useState} from 'react'
import {RadioChip, RadioChipGroup} from '@/components/composite/radio-chip'

// 가이드 데모 — 실제로 골라 보며 선택 상태를 확인하는 자리다. 고른 값은 아래 문장으로 보여 준다.

const DEMO_TASKS = [
    {
        value: 'bulk-data',
        title: '평가내역조회',
        description: [
            '선택한 평가모형의 평가 내역 조회를 신청합니다.',
            '선택 시 값이 없는 항목의 노출 방식을 추가로 선택해 주세요.',
        ],
    },
    {
        value: 'batch-evaluation',
        title: '일괄평가 진행',
        description: ['표준엑셀·정보이용동의서 업로드로 여러 기업의 평가를 한 번에 신청합니다.'],
    },
] as const

const RadioChipDemo = ({labelledBy}: {labelledBy: string}) => {
    const [task, setTask] = useState('')
    const selected = DEMO_TASKS.find((demoTask) => demoTask.value === task)

    return (
        <div className="flex flex-col gap-4">
            <RadioChipGroup value={task} onValueChange={setTask} aria-labelledby={labelledBy}>
                {DEMO_TASKS.map((demoTask) => (
                    <RadioChip
                        key={demoTask.value}
                        value={demoTask.value}
                        title={demoTask.title}
                        description={demoTask.description.map((sentence) => (
                            <span key={sentence} className="block">
                                {sentence}
                            </span>
                        ))}
                    />
                ))}
            </RadioChipGroup>
            <p className="typo-body-l-regular text-muted-foreground" role="status">
                {selected ? `선택한 값: ${selected.title} (${selected.value})` : '아직 고른 값이 없습니다.'}
            </p>
        </div>
    )
}

export {RadioChipDemo}
