'use client'

import {useId, useState, type ReactNode, type SubmitEvent} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {RadioCard, RadioCardGroup} from '@/components/composite/radio-card'
import {RadioChip, RadioChipGroup} from '@/components/composite/radio-chip'
import {StepNavigation} from '@/components/composite/step-navigation'
import {BATCH_MODEL_META} from './batch-model-meta'

// 일괄평가 (1) 평가모형 + (2) 진행할 업무 선택 — 둘 다 고르고 [다음]을 눌러야 넘어간다.
// 카드도 칩도 링크가 아니라 라디오다. 두 값 모두 필수라 하나라도 비면 [다음]이 비활성이다.
//
// 이동 경로는 고른 모형과 업무가 함께 정한다 — 기업처럼 라우트가 /general/ 과 /startup/ 으로 나뉜다.

const MODEL_FIELD = 'evaluationModel'
const TASK_FIELD = 'nextTask'

// 시안 이미지 영역은 148×100 고정이다. preflight 의 img { height: auto } 가 높이만 덮어써
// next/image 비율 경고가 뜨므로 style 로 두 값을 함께 잠근다.
const ILLUSTRATION_SIZE = {width: 148, height: 100} as const

// description 을 문장 단위 배열로 두는 이유 — 시안은 두 문장을 각자 한 줄에 놓는다(문장 사이 줄바꿈).
// 한 문자열로 두면 폭에 따라 문장 중간에서 접혀 시안과 다른 자리에서 끊긴다.
// 부제(subtitle) — 시안의 (일반) 카드에는 "KTRS-FM"이 적혀 있으나 두 카드 모두 Tech-Index 모형이라
// KTRS-FM 카드에서 복제된 흔적으로 보고 두지 않는다.
const EVALUATION_MODELS = [
    {
        value: 'general',
        badge: 'Tech-Index',
        title: '혁신성장지수 (일반)',
        description: [
            '일반 혁신성장기업의 미래 성장 가능성을 측정하는 지수형 평가 모형입니다.',
            '기술혁신성, 시장확장성, 성장 잠재력을 중심으로 평가합니다.',
        ],
        illustration: '/images/option-card/growth-index.webp',
    },
    {
        value: 'startup',
        badge: 'Tech-Index',
        title: '혁신성장지수 (창업)',
        description: [
            '창업 초기 기업의 특성에 맞춰 설계된 평가모형입니다.',
            '보유 기술의 혁신성과 향후 성장 잠재력을 중점적으로 분석합니다.',
        ],
        illustration: '/images/option-card/startup-tech-index.webp',
    },
] as const

const NEXT_TASKS = [
    {
        value: 'bulk-data',
        // (3) 대량정보 조회 신청 — 모형 갈래 아래 경로.
        href: 'bulk-data-request',
        title: '평가내역조회',
        description: [
            '선택한 평가모형의 평가 내역 조회를 신청합니다.',
            '선택 시 값이 없는 항목의 노출 방식을 추가로 선택해 주세요.',
        ],
    },
    {
        value: 'batch-evaluation',
        // (3) 일괄평가 진행 신청 — 모형 갈래 아래 경로.
        href: 'batch-evaluation-request',
        title: '일괄평가 진행',
        description: ['표준엑셀·정보이용동의서 업로드로 여러 기업의 평가를 한 번에 신청합니다.'],
    },
] as const

type BatchEvaluationFormProps = {
    // 평가모형 묶음의 이름이 되는 요소 id — 화면 제목 아래 안내 문장을 잇는다[7.4.1].
    modelsLabelledBy: string
    // 진행할 업무 묶음의 이름이 되는 요소 id — 그 구획의 제목을 잇는다.
    tasksLabelledBy: string
    // 업무 선택과 [다음] 사이에 놓이는 내용(안내 상자). 시안 순서가 카드 → 업무 → 안내 → CTA 다.
    children?: ReactNode
    // 업무 구획의 제목 — 카드와 칩 사이에 놓이므로 이 컴포넌트가 자리를 잡는다.
    tasksTitle: ReactNode
}

const BatchEvaluationForm = ({modelsLabelledBy, tasksLabelledBy, tasksTitle, children}: BatchEvaluationFormProps) => {
    const router = useRouter()
    const formId = useId()
    const [model, setModel] = useState('')
    const [task, setTask] = useState('')

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const selectedTask = NEXT_TASKS.find((nextTask) => nextTask.value === task)
        if (!model || !selectedTask) return

        console.log('[기관 일괄평가] 1단계 선택', {[MODEL_FIELD]: model, [TASK_FIELD]: task})
        router.push(`${BATCH_MODEL_META[model === 'startup' ? 'startup' : 'general'].base}/${selectedTask.href}`)
    }

    return (
        <>
            {/* 카드 묶음과 칩 묶음이 한 폼이다 — 시안의 40 간격을 폼 안에서 잡는다.
                (display:contents 로 펼치면 바깥 페이지 그리드가 각 묶음을 컬럼에 나눠 담아 레이아웃이 깨진다.) */}
            <form id={formId} noValidate onSubmit={handleSubmit} className="flex flex-col gap-10">
                <RadioCardGroup
                    name={MODEL_FIELD}
                    value={model}
                    onValueChange={setModel}
                    required
                    aria-labelledby={modelsLabelledBy}
                >
                    {EVALUATION_MODELS.map((evaluationModel) => (
                        <RadioCard
                            key={evaluationModel.value}
                            value={evaluationModel.value}
                            badge={evaluationModel.badge}
                            title={evaluationModel.title}
                            description={
                                <>
                                    {evaluationModel.description[0]}
                                    <br />
                                    {evaluationModel.description[1]}
                                </>
                            }
                            // 제목·설명이 정보를 전달하므로 일러스트는 장식이다([5.1.1]).
                            illustration={
                                <Image
                                    src={evaluationModel.illustration}
                                    alt=""
                                    draggable={false}
                                    {...ILLUSTRATION_SIZE}
                                    priority
                                    style={ILLUSTRATION_SIZE}
                                />
                            }
                        />
                    ))}
                </RadioCardGroup>

                <div className="flex flex-col gap-6">
                    {tasksTitle}
                    <RadioChipGroup
                        name={TASK_FIELD}
                        value={task}
                        onValueChange={setTask}
                        required
                        aria-labelledby={tasksLabelledBy}
                    >
                        {NEXT_TASKS.map((nextTask) => (
                            <RadioChip
                                key={nextTask.value}
                                value={nextTask.value}
                                title={nextTask.title}
                                description={nextTask.description.map((sentence) => (
                                    <span key={sentence} className="block">
                                        {sentence}
                                    </span>
                                ))}
                            />
                        ))}
                    </RadioChipGroup>
                </div>
            </form>

            {children}

            {/* [다음]은 이 폼의 제출 버튼이다. 평가모형과 진행할 업무가 모두 필수라 둘 다 고르기 전에는 비활성이다. */}
            <StepNavigation
                appearance="plain"
                // 이 화면에서는 그리드 안에 놓이므로 바깥 여백은 그리드에 맡긴다.
                className="[&>div]:max-w-none [&>div]:px-0 [&>div]:pt-0 [&>div]:pb-15"
                next={{type: 'submit', form: formId, disabled: !model || !task, children: '다음'}}
            />
        </>
    )
}

export {BatchEvaluationForm}
export type {BatchEvaluationFormProps}
