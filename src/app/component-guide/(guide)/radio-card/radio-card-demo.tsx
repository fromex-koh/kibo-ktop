'use client'

import {useState} from 'react'
import Image from 'next/image'
import {RadioCard, RadioCardGroup} from '@/components/composite/radio-card'

// 가이드 데모 — 실제로 골라 보며 선택 상태를 확인하는 자리다. 고른 값은 아래 문장으로 보여 준다.

const DEMO_MODELS = [
    {
        value: 'general',
        badge: 'Tech-Index',
        title: '혁신성장역량지수 (일반)',
        description: [
            '일반 혁신성장기업의 미래 성장 가능성을 측정하는 지수형 평가 모형입니다.',
            '기술혁신성, 시장확장성, 성장 잠재력을 중심으로 평가합니다.',
        ],
        illustration: '/images/option-card/rocket-growth.webp',
        illustrationSize: {width: 95, height: 92},
    },
    {
        value: 'startup',
        badge: 'Tech-Index',
        title: '혁신성장역량지수 (창업)',
        description: [
            '창업 초기 기업의 특성에 맞춰 설계된 평가모형입니다.',
            '보유 기술의 혁신성과 향후 성장 잠재력을 중점적으로 분석합니다.',
        ],
        illustration: '/images/option-card/building-lightbulb.webp',
        illustrationSize: {width: 136, height: 100},
    },
] as const

// 그림은 148×100 자리 가운데에 원본 비율대로(illustrationSize) 놓는다 — 실제 선택 화면과 같다.
const ILLUSTRATION_SIZE = {width: 148, height: 100} as const

const RadioCardDemo = ({labelledBy}: {labelledBy: string}) => {
    const [model, setModel] = useState('')
    const selected = DEMO_MODELS.find((demoModel) => demoModel.value === model)

    return (
        <div className="flex flex-col gap-4">
            <RadioCardGroup value={model} onValueChange={setModel} aria-labelledby={labelledBy}>
                {DEMO_MODELS.map((demoModel) => (
                    <RadioCard
                        key={demoModel.value}
                        value={demoModel.value}
                        badge={demoModel.badge}
                        title={demoModel.title}
                        description={
                            <>
                                {demoModel.description[0]}
                                <br />
                                {demoModel.description[1]}
                            </>
                        }
                        illustration={
                            <span className="flex items-center justify-center" style={ILLUSTRATION_SIZE}>
                                <Image
                                    src={demoModel.illustration}
                                    alt=""
                                    draggable={false}
                                    {...demoModel.illustrationSize}
                                    style={demoModel.illustrationSize}
                                />
                            </span>
                        }
                    />
                ))}
            </RadioCardGroup>
            <p className="typo-body-l-regular text-label-foreground" role="status">
                {selected ? `선택한 값: ${selected.title} (${selected.value})` : '아직 고른 값이 없습니다.'}
            </p>
        </div>
    )
}

// 설명 옆 배치(descriptionPlacement="beside") 데모 — 기관 평가진행방식 선택 화면과 같은 카드다.
// 그림은 148×100 자리 가운데에 원본 비율대로 놓는다.
const BESIDE_METHODS = [
    {
        value: 'verification',
        title: '평가검증 하기',
        description: [
            '기업이 은행으로 전송한 자가진단 입력정보를 수정하여 평가검증을 진행합니다.',
            '선택 시 평가검증 신청 조회 화면으로 이동합니다.',
        ],
        illustration: '/images/option-card/document-chart-magnifier.webp',
        illustrationSize: {width: 92, height: 82},
    },
    {
        value: 'individual',
        title: '개별평가 하기',
        description: [
            '기업의 자가진단 전송 내역과 관계없이 새로운 KTRS-FM 개별평가를 신청합니다.',
            '선택 시 고객정보활용동의 단계로 이동합니다.',
        ],
        illustration: '/images/option-card/clipboard-check-chart.webp',
        illustrationSize: {width: 92, height: 92},
    },
] as const

const RadioCardBesideDemo = ({labelledBy}: {labelledBy: string}) => {
    const [method, setMethod] = useState('')

    return (
        <RadioCardGroup value={method} onValueChange={setMethod} aria-labelledby={labelledBy}>
            {BESIDE_METHODS.map((item) => (
                <RadioCard
                    key={item.value}
                    value={item.value}
                    descriptionPlacement="beside"
                    title={item.title}
                    description={
                        <>
                            {item.description[0]}
                            <br />
                            {item.description[1]}
                        </>
                    }
                    illustration={
                        <span className="flex items-center justify-center" style={ILLUSTRATION_SIZE}>
                            <Image
                                src={item.illustration}
                                alt=""
                                draggable={false}
                                {...item.illustrationSize}
                                style={item.illustrationSize}
                            />
                        </span>
                    }
                />
            ))}
        </RadioCardGroup>
    )
}

export {RadioCardBesideDemo, RadioCardDemo}
