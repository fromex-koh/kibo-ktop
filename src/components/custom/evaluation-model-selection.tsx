'use client'

import {useId, useState, type SubmitEvent} from 'react'
import {useRouter} from 'next/navigation'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import {StepNavigation} from '@/components/composite/step-navigation'
import {
    EVALUATION_MODEL_CARD_OUTER_CLASS_NAME,
    EVALUATION_MODEL_TONE_CLASS,
    EvaluationModelCardContent,
} from '@/components/custom/evaluation-model-card'
import {
    EVALUATION_MODEL_NOTICE,
    EVALUATION_MODELS,
    type EvaluationModel,
} from '@/content/service/evaluation-model-selection'
import {cn} from '@/lib/utils'

// 평가모형 선택(화면 ID SB-FOTA-CM5-0001).
// 모형 카드 3장(KTRS-FM · Tech-Index · 투자모형) → 알려드려요 안내 → [다음].
// 카드는 링크가 아니라 라디오다(Tech-Index 평가모형 선택과 같은 방식) — 고르는 것만으로는 넘어가지 않고 [다음]을
// 눌러야 고른 모형의 평가 신청 첫 화면으로 간다. 필수값이라 고르기 전에는 [다음]이 비활성이다.
//
// 카드 겉모습(면 · 내용 · 규격)은 EvaluationModelCardContent(evaluation-model-card.tsx)가 그리고, 이 파일은 라디오로 감싼다.
// 고른 카드는 그라데이션 테두리가 그대로 남는다.

// 라디오는 화면에서 감추고(sr-only) 카드 전체가 그 라디오의 label 이다 — 카드 어디를 눌러도 고른다.
// 키보드 포커스는 감춘 라디오에 가므로 카드가 has-focus-visible 로 포커스 링을 대신 그린다[6.1.2].
// 테두리 색은 모형별 EVALUATION_MODEL_TONE_CLASS.border 가 정하고, 여기서는 보일 때(hover · 선택 · 포커스)만 정한다.
const cardOuterClassName = cn(
    EVALUATION_MODEL_CARD_OUTER_CLASS_NAME,
    'cursor-pointer hover:bg-linear-to-br has-checked:bg-linear-to-br has-focus-visible:bg-linear-to-br has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-solid',
)

type ModelCardProps = {
    model: EvaluationModel
    name: string
    isChecked: boolean
    onSelect: (id: EvaluationModel['id']) => void
}

const ModelCard = ({model, name, isChecked, onSelect}: ModelCardProps) => {
    const inputId = `${name}-${model.id}`

    return (
        <li>
            <label htmlFor={inputId} className={cn(cardOuterClassName, EVALUATION_MODEL_TONE_CLASS[model.tone].border)}>
                <input
                    id={inputId}
                    type="radio"
                    name={name}
                    value={model.id}
                    checked={isChecked}
                    onChange={() => onSelect(model.id)}
                    required
                    className="sr-only"
                />
                <EvaluationModelCardContent model={model} />
            </label>
        </li>
    )
}

type EvaluationModelSelectionProps = {
    /** 경로 앞에 붙일 서비스 — 기업 /corp. */
    basePath: string
}

const MODEL_FIELD = 'evaluationModel'

const EvaluationModelSelection = ({basePath}: EvaluationModelSelectionProps) => {
    const router = useRouter()
    const formId = useId()
    const nextButtonId = useId()
    const [modelId, setModelId] = useState<EvaluationModel['id'] | ''>('')

    // 카드를 고르면 [다음]이 화면 밖에 있을 때 보이는 자리까지 내려 준다 — 다음 할 일을 바로 찾게 한다
    // (Tech-Index 평가모형 선택과 같다). block: 'nearest' 라 버튼이 이미 다 보이면 움직이지 않고, 포커스는 카드에
    // 그대로 둔다([7.2.1]). PC·태블릿·모바일 모두 같은 동작이다. 동작을 줄이도록 설정한 사용자에게는 즉시 이동한다([6.3.1]).
    const handleSelect = (id: EvaluationModel['id']) => {
        setModelId(id)

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        document
            .getElementById(nextButtonId)
            ?.scrollIntoView({block: 'nearest', behavior: prefersReducedMotion ? 'auto' : 'smooth'})
    }

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const selected = EVALUATION_MODELS.find((model) => model.id === modelId)
        if (!selected) return

        router.push(`${basePath}${selected.path}`)
    }

    return (
        <div className="flex flex-col gap-10">
            <form id={formId} noValidate onSubmit={handleSubmit}>
                <fieldset className="m-0 min-w-0 border-0 p-0">
                    <legend className="sr-only">평가모형</legend>
                    <ul className="grid list-none gap-6 md:grid-cols-3">
                        {EVALUATION_MODELS.map((model) => (
                            <ModelCard
                                key={model.id}
                                model={model}
                                name={MODEL_FIELD}
                                isChecked={modelId === model.id}
                                onSelect={handleSelect}
                            />
                        ))}
                    </ul>
                </fieldset>
            </form>
            {/* 안내 상자 — InfoBox(반경 16 · 여백 40·32 · 제목 20 Bold · 목록 16)와 같은 규격이고, 면만 bg-surface-subtle 로 바꾼다. */}
            <InfoBox title={EVALUATION_MODEL_NOTICE.title} headingLevel={2} className="bg-surface-subtle">
                {EVALUATION_MODEL_NOTICE.items.map((item) => (
                    <InfoBoxItem key={item}>
                        <span className="break-keep">{item}</span>
                    </InfoBoxItem>
                ))}
            </InfoBox>
            {/* [다음]은 위 폼의 제출 버튼이다. 평가모형이 필수값이라 고르기 전에는 비활성이다.
                안내 상자와 [다음] 사이는 72(부모 간격 40 + StepNavigation 위 여백 32). */}
            <StepNavigation
                appearance="plain"
                // 그리드 안에 놓이므로 바깥 여백은 그리드에 맡긴다.
                className="[&>div]:max-w-none [&>div]:px-0 [&>div]:pt-8 [&>div]:pb-0"
                // scroll-mb-6 — 스크롤로 내려왔을 때 버튼이 화면 아래 끝에 붙지 않도록 24px 여유를 둔다.
                next={{
                    id: nextButtonId,
                    type: 'submit',
                    form: formId,
                    disabled: !modelId,
                    className: 'scroll-mb-6',
                    children: '다음',
                }}
            />
        </div>
    )
}

export default EvaluationModelSelection
