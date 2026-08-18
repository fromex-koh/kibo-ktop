'use client'

import {useId, useState, type ReactNode, type SubmitEvent} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {RadioCard, RadioCardGroup} from '@/components/composite/radio-card'
import {StepNavigation} from '@/components/composite/step-navigation'

// Tech-Index 평가모형 선택 — 두 모형 중 하나를 고르고 [다음]을 누른다(시안 "[혁신성장지수 평가 Tech-Index]").
// 카드는 링크가 아니라 라디오다 — 고르는 것만으로는 넘어가지 않고, 아래 [다음]을 눌러야 이동한다.
// 필수값이라 고르기 전에는 [다음]이 비활성이다. 시안의 CTA 문구는 [신청]이지만 뒤에 고객정보활용동의·입력
// 단계가 이어지므로 [다음]으로 둔다(기관 화면과 같은 판단).
//
// 모형마다 가는 1단계가 달라서 고른 값이 곧 이동 경로다.

const MODEL_FIELD = 'evaluationModel'

// 시안 이미지 영역은 148×100 고정이다. preflight 의 img { height: auto } 가 높이만 덮어써
// next/image 비율 경고가 뜨므로 style 로 두 값을 함께 잠근다.
const ILLUSTRATION_SIZE = {width: 148, height: 100} as const

// description 을 문장 단위 배열로 두는 이유 — 시안은 두 문장을 각자 한 줄에 놓는다(문장 사이 줄바꿈).
// 한 문자열로 두면 폭에 따라 문장 중간에서 접혀 시안과 다른 자리에서 끊긴다.
const EVALUATION_MODELS = [
    {
        value: 'general',
        // 기술평가 > Tech-Index > 일반용 > (1) 고객정보활용동의
        // (corp-technology-evaluation-tech-index-general-customer-consent).
        href: '/corp/technology-evaluation/tech-index/general/customer-consent',
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
        // 기술평가 > Tech-Index > 창업용 > (1) 고객정보활용동의
        // (corp-technology-evaluation-tech-index-startup-customer-consent).
        href: '/corp/technology-evaluation/tech-index/startup/customer-consent',
        badge: 'Tech-Index',
        title: '혁신성장지수 (창업)',
        description: [
            '창업 초기 기업의 특성에 맞춰 설계된 평가모형입니다.',
            '보유 기술의 혁신성과 향후 성장 잠재력을 중점적으로 분석합니다.',
        ],
        illustration: '/images/option-card/startup-tech-index.webp',
    },
] as const

type TechIndexModelFormProps = {
    // 목록의 제목 역할을 하는 요소의 id — 라디오 그룹의 이름으로 잇는다[7.4.1].
    labelledBy: string
    // 카드와 [다음] 사이에 놓이는 내용(안내 상자). 시안 순서가 카드 → 안내 → CTA 라 사이에 받는다.
    children?: ReactNode
}

const TechIndexModelForm = ({labelledBy, children}: TechIndexModelFormProps) => {
    const router = useRouter()
    const formId = useId()
    const [model, setModel] = useState('')

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const selected = EVALUATION_MODELS.find((evaluationModel) => evaluationModel.value === model)
        if (!selected) return

        router.push(selected.href)
    }

    return (
        <>
            <form id={formId} noValidate onSubmit={handleSubmit}>
                <RadioCardGroup
                    name={MODEL_FIELD}
                    value={model}
                    onValueChange={setModel}
                    required
                    aria-labelledby={labelledBy}
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
            </form>

            {children}

            {/* [다음]은 위 폼의 제출 버튼이다. 평가모형이 필수값이라 고르기 전에는 비활성이고,
                무엇을 골라야 하는지는 화면 제목("Tech-Index 평가모형을 선택해 주세요.")이 이미 말한다. */}
            <StepNavigation
                appearance="plain"
                // 이 화면에서는 그리드 안에 놓이므로 바깥 여백은 그리드에 맡긴다.
                className="[&>div]:max-w-none [&>div]:px-0 [&>div]:pt-0 [&>div]:pb-15"
                next={{type: 'submit', form: formId, disabled: !model, children: '다음'}}
            />
        </>
    )
}

export {TechIndexModelForm}
export type {TechIndexModelFormProps}
