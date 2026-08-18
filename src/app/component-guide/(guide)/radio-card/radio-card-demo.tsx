'use client'

import {useState} from 'react'
import Image from 'next/image'
import {RadioCard, RadioCardGroup} from '@/components/composite/radio-card'

// 가이드 데모 — 실제로 골라 보며 선택 상태를 확인하는 자리다. 고른 값은 아래 문장으로 보여 준다.

const DEMO_MODELS = [
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
                            <Image
                                src={demoModel.illustration}
                                alt=""
                                draggable={false}
                                {...ILLUSTRATION_SIZE}
                                style={ILLUSTRATION_SIZE}
                            />
                        }
                    />
                ))}
            </RadioCardGroup>
            <p className="typo-body-l-regular text-muted-foreground" role="status">
                {selected ? `선택한 값: ${selected.title} (${selected.value})` : '아직 고른 값이 없습니다.'}
            </p>
        </div>
    )
}

export {RadioCardDemo}
