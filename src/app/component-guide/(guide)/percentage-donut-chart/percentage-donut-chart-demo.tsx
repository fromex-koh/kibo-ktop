'use client'

// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import {useState} from 'react'
import {PercentageDonutChart, type PercentageDonutItem} from '@/components/custom/percentage-donut-chart'
import {Button} from '@/components/ui/button'

// 기업 보유기술 도넛 가이드의 분포 데모 — 버튼으로 비중 분포(균형 · 근접 · 편중)를 바꿔 본다.
type TechnologyHoldingScenarioId = 'balanced' | 'clustered' | 'skewed'

const TECHNOLOGY_HOLDING_BASE = [
    {id: 'wireless-service', label: '무선·이동통신 서비스', count: 13, color: 'var(--ds-chart-2)'},
    {id: 'wireless-system', label: '무선·이동통신 시스템', count: 11, color: 'var(--ds-chart-4)'},
    {id: 'iot-service', label: '사물인터넷 응용서비스', count: 6, color: 'var(--ds-chart-1)'},
    {id: 'platform', label: '정보통신 융합 플랫폼', count: 4, color: 'var(--ds-chart-3)'},
    {id: 'other', label: '기타', count: 9, color: 'var(--ds-chart-5)'},
] as const

const TECHNOLOGY_HOLDING_SCENARIOS: Array<{
    id: TechnologyHoldingScenarioId
    label: string
    percentages: number[]
}> = [
    {id: 'balanced', label: '균형', percentages: [30, 25, 15, 10, 20]},
    {id: 'clustered', label: '근접', percentages: [55, 18, 11, 9, 7]},
    {id: 'skewed', label: '편중', percentages: [82, 7, 5, 4, 2]},
]

const DonutDistributionDemo = () => {
    const [scenarioId, setScenarioId] = useState<TechnologyHoldingScenarioId>('balanced')
    const scenario = TECHNOLOGY_HOLDING_SCENARIOS.find(({id}) => id === scenarioId) ?? TECHNOLOGY_HOLDING_SCENARIOS[0]
    const data: PercentageDonutItem[] = TECHNOLOGY_HOLDING_BASE.map((item, index) => ({
        ...item,
        percentage: scenario.percentages[index],
    }))

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-end gap-3">
                <div className="flex flex-wrap gap-2" role="group" aria-label="기업 보유기술 비율 분포 선택">
                    {TECHNOLOGY_HOLDING_SCENARIOS.map(({id, label}) => (
                        <Button
                            key={id}
                            type="button"
                            size="xs"
                            variant={scenarioId === id ? 'default' : 'outline'}
                            aria-pressed={scenarioId === id}
                            onClick={() => setScenarioId(id)}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </div>
            <PercentageDonutChart
                data={data}
                ariaLabel={`${scenario.label} 분포의 기업 보유기술 5개 분류 비중과 건수`}
            />
        </div>
    )
}

export {DonutDistributionDemo}
