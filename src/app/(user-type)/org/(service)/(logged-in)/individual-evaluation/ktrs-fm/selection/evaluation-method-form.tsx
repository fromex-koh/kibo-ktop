'use client'

import {useId, useState, type ReactNode, type SubmitEvent} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {RadioCard, RadioCardGroup} from '@/components/composite/radio-card'
import {StepNavigation} from '@/components/composite/step-navigation'

// 진행방식 선택 — 기업이 보낸 자가진단 내역을 검증할지, 새 개별평가를 신청할지 고르고 [다음]을 누른다.
// 카드는 링크가 아니라 라디오다 — 고르는 것만으로는 넘어가지 않고, 아래 [다음]을 눌러야 이동한다.
// 필수값이라 고르기 전에는 [다음]이 비활성이다(Tech-Index 평가모형 선택 화면과 같은 구성).
//
// 진행방식마다 가는 화면이 달라서 고른 값이 곧 이동 경로다.

const METHOD_FIELD = 'evaluationMethod'

// 시안 이미지 영역은 148×100 고정이다. preflight 의 img { height: auto } 가 높이만 덮어써
// next/image 비율 경고가 뜨므로 style 로 두 값을 함께 잠근다.
const ILLUSTRATION_SIZE = {width: 148, height: 100} as const

// description 을 문장 단위 배열로 두는 이유 — 시안은 두 문장을 각자 한 줄에 놓는다(문장 사이 줄바꿈).
// 한 문자열로 두면 폭에 따라 문장 중간에서 접혀 시안과 다른 자리에서 끊긴다.
const EVALUATION_METHODS = [
    {
        value: 'verification',
        // 마이페이지 > 평가검증 신청 조회(org-mypage-verification-application).
        href: '/org/mypage/verification-application',
        title: '평가검증 하기',
        description: [
            '기업이 은행으로 전송한 자가진단 입력정보를 수정하여 평가검증을 진행합니다.',
            '평가검증 신청 조회 화면으로 이동합니다.',
        ],
        illustration: '/images/option-card/ktrs-fm.webp',
    },
    {
        value: 'individual',
        // 개별평가 > KTRS-FM > (1) 고객정보활용동의(org-individual-evaluation-ktrs-fm-customer-consent).
        href: '/org/individual-evaluation/ktrs-fm/customer-consent',
        title: '개별평가 하기',
        description: [
            '기업의 자가진단 전송 내역과 관계없이 새로운 KTRS-FM 개별평가를 신청합니다.',
            '고객정보활용동의 단계로 이동합니다.',
        ],
        illustration: '/images/option-card/startup-tech-index.webp',
    },
] as const

type EvaluationMethodFormProps = {
    // 목록의 제목 역할을 하는 요소의 id — 라디오 그룹의 이름으로 잇는다[7.4.1].
    labelledBy: string
    // 카드와 [다음] 사이에 놓이는 내용(안내 상자). 시안 순서가 카드 → 안내 → CTA 라 사이에 받는다.
    children?: ReactNode
}

const EvaluationMethodForm = ({labelledBy, children}: EvaluationMethodFormProps) => {
    const router = useRouter()
    const formId = useId()
    const [method, setMethod] = useState('')

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const selected = EVALUATION_METHODS.find((evaluationMethod) => evaluationMethod.value === method)
        if (!selected) return

        router.push(selected.href)
    }

    return (
        <>
            <form id={formId} noValidate onSubmit={handleSubmit}>
                <RadioCardGroup
                    name={METHOD_FIELD}
                    value={method}
                    onValueChange={setMethod}
                    required
                    aria-labelledby={labelledBy}
                >
                    {EVALUATION_METHODS.map((evaluationMethod) => (
                        <RadioCard
                            key={evaluationMethod.value}
                            value={evaluationMethod.value}
                            title={evaluationMethod.title}
                            description={
                                <>
                                    {evaluationMethod.description[0]}
                                    <br />
                                    {evaluationMethod.description[1]}
                                </>
                            }
                            // 제목·설명이 정보를 전달하므로 일러스트는 장식이다([5.1.1]).
                            illustration={
                                <Image
                                    src={evaluationMethod.illustration}
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

            {/* [다음]은 위 폼의 제출 버튼이다. 진행방식이 필수값이라 고르기 전에는 비활성이고,
                무엇을 골라야 하는지는 화면 제목 아래 안내 문장이 이미 말한다. */}
            <StepNavigation
                appearance="plain"
                // 이 화면에서는 그리드 안에 놓이므로 바깥 여백은 그리드에 맡긴다.
                className="[&>div]:max-w-none [&>div]:px-0 [&>div]:pt-0 [&>div]:pb-15"
                next={{type: 'submit', form: formId, disabled: !method, children: '다음'}}
            />
        </>
    )
}

export {EvaluationMethodForm}
export type {EvaluationMethodFormProps}
