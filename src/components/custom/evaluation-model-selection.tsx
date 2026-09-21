'use client'

import {useId, useState, type SubmitEvent} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {ArrowRight} from 'lucide-react'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import {StepNavigation} from '@/components/composite/step-navigation'
import {
    EVALUATION_MODEL_NOTICE,
    EVALUATION_MODELS,
    type EvaluationModel,
    type EvaluationModelTone,
} from '@/content/service/evaluation-model-selection'
import {cn} from '@/lib/utils'

// 평가모형 선택 — 시안 "SB-FOTA-CM5-0001_메인_평가모형 선택"(40007595:14880).
// 모형 카드 3장(KTRS-FM · Tech-Index · 투자모형) → 알려드려요 안내 → [다음].
// 카드는 링크가 아니라 라디오다(Tech-Index 평가모형 선택과 같은 방식) — 고르는 것만으로는 넘어가지 않고 [다음]을
// 눌러야 고른 모형의 평가 신청 첫 화면으로 간다. 필수값이라 고르기 전에는 [다음]이 비활성이다.
//
// 카드 규격(시안): 반경 16 · 여백 위·좌우 32, 아래 24 · 약칭(14 Bold)과 제목(28 Bold) 8 · 제목과 설명(14) 16 ·
// 설명과 일러스트 자리(높이 144) 32 · 오른쪽 아래 짙은 원형 화살표(48) · 카드 사이 24.
// 마우스를 올리거나 키보드로 포커스하면 테두리가 그라데이션(시안 첫 카드의 표시)으로 바뀌고, 고른 카드는 그대로 남는다.

// 모형별 카드 면 · 약칭 색 — 시안 blue.100/blue.700 · mint.100/mint.800 · orange.100.
// hover — hover·포커스·선택 때의 그라데이션 테두리도 카드 면과 같은 색 계열로 맞춘다(진한 단계 → 옅은 단계).
const TONE_CLASS: Record<EvaluationModelTone, {surface: string; label: string; hover: string}> = {
    blue: {
        surface: 'bg-blue-100',
        label: 'text-blue-700',
        hover: 'hover:from-blue-500 hover:to-blue-300 has-checked:from-blue-500 has-checked:to-blue-300 has-focus-visible:from-blue-500 has-focus-visible:to-blue-300',
    },
    mint: {
        surface: 'bg-mint-100',
        label: 'text-mint-800',
        hover: 'hover:from-mint-700 hover:to-mint-400 has-checked:from-mint-700 has-checked:to-mint-400 has-focus-visible:from-mint-700 has-focus-visible:to-mint-400',
    },
    orange: {
        surface: 'bg-orange-100',
        label: 'text-orange-700',
        hover: 'hover:from-orange-600 hover:to-orange-300 has-checked:from-orange-600 has-checked:to-orange-300 has-focus-visible:from-orange-600 has-focus-visible:to-orange-300',
    },
}

// 테두리는 바깥 상자(1px 여백)의 면으로 그린다 — 평소에는 투명하고, hover·포커스 때 그라데이션이 비친다.
// 안쪽 카드 반경은 바깥(16)보다 1 작아야 모서리가 겹쳐 보이지 않는다.
// 색 단계는 모형별로 TONE_CLASS.hover 가 정한다.
// 라디오는 화면에서 감추고(sr-only) 카드 전체가 그 라디오의 label 이다 — 카드 어디를 눌러도 고른다.
// 키보드 포커스는 감춘 라디오에 가므로 카드가 has-focus-visible 로 포커스 링을 대신 그린다[6.1.2].
const cardOuterClassName =
    'outline-ring block h-full cursor-pointer rounded-lg p-px transition-colors hover:bg-linear-to-br has-checked:bg-linear-to-br has-focus-visible:bg-linear-to-br has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-solid'

type ModelCardProps = {
    model: EvaluationModel
    name: string
    isChecked: boolean
    onSelect: (id: EvaluationModel['id']) => void
}

const ModelCard = ({model, name, isChecked, onSelect}: ModelCardProps) => {
    const tone = TONE_CLASS[model.tone]
    const inputId = `${name}-${model.id}`

    return (
        <li>
            <label htmlFor={inputId} className={cn(cardOuterClassName, tone.hover)}>
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
                <span
                    className={cn(
                        'flex h-full flex-col rounded-[calc(var(--radius-lg)-1px)] px-8 pt-8 pb-6',
                        tone.surface,
                    )}
                >
                    <span className="flex flex-col gap-2">
                        {/* 약칭이 없는 카드(투자모형)도 그 줄을 비워 두어 세 카드의 제목 높이를 맞춘다(시안). */}
                        <span
                            aria-hidden={model.label ? undefined : true}
                            className={cn('typo-body-l-bold', tone.label)}
                        >
                            {model.label ?? '\u00a0'}
                        </span>
                        <span className="typo-h2-bold text-foreground break-keep">{model.title}</span>
                    </span>
                    <span className="typo-body-l-regular text-label-foreground mt-4 break-keep">
                        {model.description}
                    </span>
                    {/* 일러스트 자리(높이 144) — 그림은 시안의 표시 크기로 자리의 가운데(가로·세로)에 놓는다. 시안도 세 그림 모두
                        자리 가운데 기준이며, 투자모형(188)은 자리보다 커서 위아래로 조금씩 넘친다. 좁은 카드에서는 폭에 맞춰
                        줄어든다. 에셋이 없으면 빈 자리로 둔다. 제목이 같은 뜻을 전하므로 그림은 꾸밈이다[5.1.1]. */}
                    <span className="mt-8 flex h-36 items-center justify-center">
                        {model.image ? (
                            <Image
                                src={model.image.src}
                                alt=""
                                width={model.image.width}
                                height={model.image.height}
                                draggable={false}
                                className="h-auto max-w-full"
                            />
                        ) : null}
                    </span>
                    <span
                        aria-hidden="true"
                        className="bg-label-foreground text-primary-foreground mt-auto flex size-12 shrink-0 items-center justify-center self-end rounded-full"
                    >
                        <ArrowRight className="size-8" />
                    </span>
                </span>
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
            {/* 안내 상자 — InfoBox(반경 16 · 여백 40·32 · 제목 20 Bold · 목록 16)와 같은 규격이고, 면만 시안의 gray.10 이다. */}
            <InfoBox title={EVALUATION_MODEL_NOTICE.title} headingLevel={2} className="bg-surface-subtle">
                {EVALUATION_MODEL_NOTICE.items.map((item) => (
                    <InfoBoxItem key={item}>
                        <span className="break-keep">{item}</span>
                    </InfoBoxItem>
                ))}
            </InfoBox>
            {/* [다음]은 위 폼의 제출 버튼이다. 평가모형이 필수값이라 고르기 전에는 비활성이다.
                안내 상자와 [다음] 사이는 시안 72(여기 40 + StepNavigation 위 32). */}
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
