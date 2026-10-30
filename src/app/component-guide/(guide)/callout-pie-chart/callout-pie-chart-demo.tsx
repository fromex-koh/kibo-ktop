'use client'

// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import {useState} from 'react'
import {CalloutPieChart, type CalloutPieItem} from '@/components/custom/callout-pie-chart'
import {Button} from '@/components/ui/button'

// 지시선 원형 차트 가이드의 데이터 바꿔 보기 — 버튼으로 분포 · 항목 수를 바꿔 라벨 배치가 어떻게 달라지는지 본다.

// 큰 분류부터 진한 남색 → 옅은 파랑, '기타'는 회색.
const COLORS = [
    'var(--ds-navy-800)',
    'var(--ds-navy-500)',
    'var(--ds-blue-700)',
    'var(--ds-blue-500)',
    'var(--ds-blue-400)',
    'var(--ds-blue-300)',
    'var(--ds-blue-200)',
] as const
const OTHERS_COLOR = 'var(--ds-gray-200)'

const NAMES = [
    '무선 통신·네트워크',
    '이동통신 서비스',
    'IoT 플랫폼',
    '네트워크 보안',
    '위성 통신',
    '광통신 부품',
    '전파 계측',
] as const
const OTHERS = '기타'

// 비중 목록 → 차트 데이터. 마지막 항목은 '기타'(회색)로 둔다(othersLast). 건수는 비중의 절반으로 어림한다.
const LONG_NAMES = [
    '차세대 무선 통신·네트워크 기술',
    '차세대 이동통신 기반 초고속 전송 기술',
    '사물인터넷 응용서비스 플랫폼 운영 기술',
    '정보보호 및 네트워크 보안 관제 기술',
] as const

const toData = (
    percentages: readonly number[],
    othersLast: boolean,
    names: readonly string[] = NAMES,
): CalloutPieItem[] =>
    percentages.map((percentage, index) => {
        const isOthers = othersLast && index === percentages.length - 1
        return {
            id: `s${index}`,
            label: isOthers ? OTHERS : names[index % names.length],
            percentage,
            count: Math.max(1, Math.round(percentage / 2)),
            color: isOthers ? OTHERS_COLOR : COLORS[index % COLORS.length],
        }
    })

// PDF 템플릿과 같은 규칙 — 이름은 2줄까지, 넘치면 말줄임.
const LABEL_MAX_LINES = 2

const SCENARIOS = [
    {
        id: 'standard',
        label: '표준',
        description: '가장 큰 분류(50%)가 오른쪽 반원을 차지하고, 모든 분류의 라벨이 지시선 끝에 놓입니다.',
        data: toData([50, 14, 10, 8, 6, 5, 4, 3], true),
    },
    {
        id: 'skewed',
        label: '편중',
        description: '한 분류가 대부분이면 나머지 조각이 위쪽에 몰려 라벨이 위로 밀려 올라갑니다.',
        data: toData([82, 7, 5, 4, 2], true),
    },
    {
        id: 'balanced',
        label: '균형',
        description: '분류가 고르면 조각이 원 둘레에 고르게 퍼져 라벨이 양쪽으로 나뉩니다.',
        data: toData([24, 22, 20, 18, 16], true),
    },
    {
        id: 'long',
        label: '긴 라벨',
        description:
            '라벨이 길면 남은 폭에 맞춰 2줄까지 줄을 바꾸고, 넘치면 둘째 줄 끝에서 말줄임합니다. 비중 · 건수는 옆에 안 들어가면 다음 줄로 내립니다. 원 크기는 그대로입니다.',
        data: toData([50, 20, 16, 14], false, LONG_NAMES),
    },
    {
        id: 'crowded',
        label: '작은 조각 많음',
        description:
            '한 분류가 아주 크고 작은 조각 7개가 12시 근처에 몰리면, 원을 돌려 큰 조각을 위로 보내고 라벨을 원 아래 양옆에 고르게 펼칩니다.',
        data: toData([80, 5, 4, 3, 3, 2, 2, 1], true),
    },
    {
        id: 'two',
        label: '2개',
        description: '두 분류면 라벨이 원 양쪽에 하나씩 놓입니다.',
        data: toData([70, 30], false),
    },
    {
        id: 'single',
        label: '1개',
        description: '한 분류가 100%면 원 전체가 한 조각이고, 라벨은 지시선 하나로 바깥에 놓입니다.',
        data: toData([100], false),
    },
] as const

type ScenarioId = (typeof SCENARIOS)[number]['id']

const CalloutPieScenarioDemo = () => {
    const [scenarioId, setScenarioId] = useState<ScenarioId>('standard')
    const scenario = SCENARIOS.find(({id}) => id === scenarioId) ?? SCENARIOS[0]

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2" role="group" aria-label="지시선 원형 차트 데이터 선택">
                {SCENARIOS.map(({id, label}) => (
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
            <p className="typo-body-l-regular text-label-foreground" aria-live="polite">
                {scenario.description}
            </p>
            <div className="max-w-xl">
                <CalloutPieChart
                    data={[...scenario.data]}
                    maxLabelLines={LABEL_MAX_LINES}
                    ariaLabel={`${scenario.label} 데이터의 분류별 비중과 건수`}
                />
            </div>
        </div>
    )
}

export {CalloutPieScenarioDemo}
