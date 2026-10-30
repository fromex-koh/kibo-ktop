// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {CalloutPieChartSkeleton} from '@/components/composite/callout-pie-chart-skeleton'
import {CalloutPieChart, type CalloutPieItem} from '@/components/custom/callout-pie-chart'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {CalloutPieScenarioDemo} from './callout-pie-chart-demo'

export const metadata: Metadata = {title: '지시선 원형 차트 (CalloutPieChart)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

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

// 비중 목록 → 예시 데이터. othersLast 면 마지막을 '기타'(회색)로 둔다. 건수는 비중의 절반으로 어림한다.
const toData = (
    percentages: readonly number[],
    othersLast = true,
    names: readonly string[] = NAMES,
): CalloutPieItem[] =>
    percentages.map((percentage, index) => {
        const isOthers = othersLast && index === percentages.length - 1
        return {
            id: `s${index}`,
            label: isOthers ? '기타' : names[index % names.length],
            percentage,
            count: Math.max(1, Math.round(percentage / 2)),
            color: isOthers ? OTHERS_COLOR : COLORS[index % COLORS.length],
        }
    })

// 예시는 모두 PDF 템플릿과 같은 규칙으로 그린다 — 이름은 2줄까지, 넘치면 말줄임(비중 · 건수 줄은 세지 않음).
const LABEL_MAX_LINES = 2

const STANDARD_DATA = toData([50, 14, 10, 8, 6, 5, 4, 3])

// 지시선 · 엣지 케이스 예시.
const PUSHED_DATA = toData([82, 7, 5, 4, 2])
const ROUNDED_SUM_DATA = toData([33, 33, 33])
const ZERO_DATA = toData([60, 25, 15, 0])
// 한 분류가 아주 커서 작은 조각 7개가 한곳에 몰린 경우(최대 8개) — 원 돌리기 · 세로줄 배치 예시.
const TAIL_DATA = toData([90, 2, 2, 2, 1, 1, 1, 1])
const CROWDED_LONG_DATA = toData([80, 5, 4, 3, 3, 2, 2, 1], true, [
    '무선 통신·네트워크',
    '차세대 이동통신 기반 초고속 전송 기술',
    '사물인터넷 응용서비스 플랫폼 운영 기술',
    '정보보호 및 네트워크 보안 관제 기술',
    '위성 통신 및 광통신 부품 설계 기술',
    '광통신 부품 및 광소자 모듈 제조 기술',
    '전파 계측 및 전자파 환경 시험 기술',
])

// 라벨이 길 때.
const ONE_LONG_DATA = toData([50, 22, 16, 12], true, [
    '무선 통신·네트워크',
    '차세대 이동통신 기반 초고속 전송 및 접속 기술',
    'IoT 플랫폼',
])
const ALL_LONG_DATA = toData([50, 18, 14, 10, 8], false, [
    '무선 통신·네트워크',
    '차세대 이동통신 기반 초고속 전송 기술',
    '사물인터넷 응용서비스 플랫폼 운영 기술',
    '정보보호 및 네트워크 보안 관제 기술',
    '위성 통신 및 광통신 부품 설계 기술',
])
// 표준과 같은 8조각(+ 기타)에 이름이 모두 긴 경우.
// 고른 8개 + 긴 이름 · 한 분류 100% + 긴 이름 · 아주 작은 조각 · 가운뎃점 · 말줄임 예시.
const EVEN_LONG_DATA = toData(
    [13, 13, 13, 13, 12, 12, 12, 12],
    true,
    CROWDED_LONG_DATA.map((item) => item.label),
)
const SINGLE_LONG_DATA = toData([100], false, ['차세대 무선 통신·네트워크 기반 초고속 전송 및 접속 기술'])
const TINY_SLICE_DATA = toData([99, 1], false)
const MIDDLE_DOT_DATA = toData([40, 30, 20, 10], true, [
    '이차전지 소재 · 부품 · 장비 고도화 기술',
    '바이오 의약품 공정 개발 및 품질 관리 기술',
    '광통신 부품 및 광소자 모듈 제조 기술',
])
// 칸 높이가 정해진 자리에서 라벨을 줄이는 예시 — 큰 분류 뒤로 이름이 긴 작은 조각 7개(90%).
const TAIL_LONG_DATA = toData(
    [90, 2, 2, 2, 1, 1, 1, 1],
    true,
    CROWDED_LONG_DATA.map((item) => item.label),
)
const EIGHT_LONG_DATA = toData([50, 14, 10, 8, 6, 5, 4, 3], true, [
    '무선 통신·네트워크',
    '차세대 이동통신 기반 초고속 전송 기술',
    '사물인터넷 응용서비스 플랫폼 운영 기술',
    '정보보호 및 네트워크 보안 관제 기술',
    '위성 통신 및 광통신 부품 설계 기술',
    '광통신 부품 및 광소자 모듈 제조 기술',
    '전파 계측 및 전자파 환경 시험 기술',
])
const NO_SPACE_DATA = toData([50, 30, 20], false, [
    '무선 통신·네트워크',
    'IoTPlatformServiceIntegrationTechnology',
    '이동통신서비스플랫폼운영기술고도화',
])
// 데이터 값이 클 때 — 건수 천 단위 · 소수 비중.
const LARGE_VALUE_DATA: CalloutPieItem[] = [
    {id: 'v1', label: '무선 통신·네트워크', percentage: 48.6, count: 12345, color: COLORS[0]},
    {id: 'v2', label: '이동통신 서비스', percentage: 21.35, count: 5432, color: COLORS[1]},
    {id: 'v3', label: 'IoT 플랫폼', percentage: 17.05, count: 4321, color: COLORS[3]},
    {id: 'v4', label: '기타', percentage: 13, count: 3210, color: OTHERS_COLOR},
]

const USAGE_CODE = `import {CalloutPieChart} from '@/components/custom/callout-pie-chart'

// 비중이 큰 분류부터 넘기면 12시에서 시계 방향으로 이어집니다.
<CalloutPieChart
  ariaLabel="기업 보유기술 소분류별 비중과 건수"
  // 이름 줄 수 상한 — 넘치면 말줄임(생략하면 모두 적음).
  maxLabelLines={2}
  data={[
    {id: 't1', label: '무선 통신·네트워크', percentage: 50, count: 24, color: 'var(--ds-navy-800)'},
    {id: 't2', label: '이동통신 서비스', percentage: 14, count: 7, color: 'var(--ds-navy-500)'},
    // …
  ]}
/>`

const LOADING_CODE = `import {CalloutPieChartSkeleton} from '@/components/composite/callout-pie-chart-skeleton'

{isLoading ? (
  <CalloutPieChartSkeleton label="기업 보유기술을 불러오는 중입니다." />
) : (
  <CalloutPieChart data={technologies} ariaLabel="기업 보유기술 소분류별 비중과 건수" />
)}`

const PRINT_CODE = `// K-BIGx PDF 템플릿 — 조각 · 글자 · 선 색을 kbx 토큰으로 넘깁니다(.kbigx-print 안).
<CalloutPieChart
  ariaLabel="기업 보유기술 소분류별 비중과 건수"
  data={technologies.map((item, index) => ({...item, color: KBX_PIE_COLORS[index]}))}
  colors={{
    label: 'var(--kbx-color-foreground)',
    value: 'var(--kbx-color-primary)',
    count: 'var(--kbx-color-chart-label)',
    leader: 'var(--kbx-color-chart-line)',
    inside: 'var(--kbx-color-paper)',
  }}
  // 칸 높이(폭 556 기준) — 원 중심을 칸 세로 가운데에 맞춘다(아래 '높이가 정해진 자리' 참고).
  areaHeight={387}
  // 이름은 2줄까지 — 넘치면 말줄임. 비중 · 건수는 옆에 안 들어가면 다음 줄.
  maxLabelLines={2}
  // 높이가 정해진 자리에서는 줄어들 수 있게 한다.
  className="my-auto min-h-0 pt-4"
/>`

// 4. 지시선 모양.
const LEADER_RULE_COLUMNS = [
    {key: 'case', header: '경우', align: 'start', rowHeader: true},
    {key: 'shape', header: '모양', align: 'start', wrap: true},
] as const

const LEADER_RULE_ROWS = [
    {
        key: 'side',
        cells: [
            '라벨 방향',
            '조각 가운데가 오른쪽 반원(12~6시)이면 오른쪽, 왼쪽 반원이면 왼쪽에 라벨을 둡니다. 원은 데이터 · 라벨 길이와 관계없이 늘 같은 크기로 가운데에 있습니다.',
        ],
    },
    {
        key: 'straight',
        cells: [
            '기본(원 둘레 배치)',
            '조각 가장자리에서 반지름 × 1.21 원 둘레까지 곧은 선을 긋고 그 끝에 라벨을 둡니다.',
        ],
    },
    {
        key: 'pushed',
        cells: [
            '라벨이 겹칠 때(밀어내기)',
            '같은 쪽 라벨이 46 간격이 되도록 위아래로 밀고, 밀린 높이의 원 둘레로 가로 위치를 다시 맞춥니다. 원보다 멀리 밀리면 원 중심에서 40 떨어진 세로줄에 맞춥니다.',
        ],
    },
    {
        key: 'column',
        cells: [
            '선이 엇갈리거나 원을 가로지를 때(세로줄 배치)',
            '작은 조각이 한쪽에 많이 몰리면 그쪽만 라벨을 원 바깥 세로줄에 놓습니다. 선은 보고서 차트의 꺾은 지시선입니다: 조각 바로 바깥에서 라벨 높이까지 세로로 오르내린 뒤 꺾여, 가로선으로 라벨에 닿습니다. 세로 · 가로로만 꺾여 이웃 선과 엇갈리지 않습니다. 라벨 묶음은 원래 자리들의 평균 높이를 중심으로 위아래로 고르게 펼쳐 원 위 · 아래 빈 자리까지 씁니다.',
        ],
    },
    {
        key: 'rotate',
        cells: [
            '라벨이 한쪽에 몰릴 때(원 돌리기)',
            '세로줄 배치가 생기거나, 위로 밀어 올린 라벨 때문에 그림 높이가 420 을 넘으면(한 분류가 아주 클 때) 원을 15° 씩 돌려 보며 가장 깔끔한 각도를 고릅니다. 기준은 ① 선끼리 엇갈림 · 선이 원을 가로지름 · 라벨끼리 겹침 · 선이 다른 라벨 글자를 지남의 합이 가장 적고 ② 그다음 그림 높이가 가장 낮은 쪽입니다. 큰 조각이 아래 · 옆으로 가면서 작은 조각이 양옆으로 나뉘어, 왼쪽에만 쌓이던 라벨이 오른쪽 · 위 · 아래 빈 자리도 씁니다. 돌린 배치에서는 라벨 묶음을 위로만 밀지 않고 위아래로 고르게 펼칩니다. 엉키지 않고 높이도 넘지 않는 데이터는 돌리지 않고 12시에서 시작합니다(템플릿 모양).',
        ],
    },
    {
        key: 'row',
        cells: [
            '원 위 · 아래가 비어 있을 때(가로줄 배치)',
            '원 돌리기와 함께, 12시 · 6시 근처(30° · 45° 안) 조각의 라벨을 원 위 · 아래에 가로로 나란히 놓는 배치도 비교합니다. 라벨은 조각 방향 가운데 정렬, 한 줄 160 폭으로 접고, 겹치면 좌우로 고르게 펼칩니다. 그림 폭에 다 들어가지 않으면 이 배치는 쓰지 않습니다.',
        ],
    },
    {
        key: 'wrap',
        cells: [
            '라벨이 길 때(줄바꿈)',
            '라벨 자리에서 그림 가장자리까지 남은 폭에 맞춰 줄을 바꿉니다. 이름은 maxLabelLines(PDF 템플릿 2)줄까지 적고 넘치면 마지막 줄 끝에서 말줄임합니다. 비중 · 건수가 마지막 이름 줄에 들어가지 않으면 다음 줄로 내립니다. 줄이 늘면 이웃 라벨과의 간격을 그만큼 늘리고, 그림 높이만 늘어납니다.',
        ],
    },
    {
        key: 'limit',
        cells: ['최대 개수', "조각은 최대 8개(기타 포함)입니다. 9번째부터는 백엔드에서 '기타'로 합쳐 보냅니다."],
    },
] as const

const PROPS_ITEMS = [
    [
        'CalloutPieChart',
        'data',
        '조각 목록입니다. 비중 내림차순, 최대 8개(기타 포함)로 넘깁니다.',
        '-',
        'readonly CalloutPieItem[]',
    ],
    ['CalloutPieChart', 'ariaLabel', '차트 전체의 이름입니다.', '-', 'string'],
    ['CalloutPieChart', 'countUnit', '건수 단위입니다.', "'개'", 'string'],
    [
        'CalloutPieChart',
        'colors',
        '글자 · 선 색(label · value · count · leader · inside(조각 사이 선))입니다. 넘기지 않으면 웹 시맨틱 색입니다.',
        '웹 시맨틱 색',
        'Partial<CalloutPieColors>',
    ],
    [
        'CalloutPieChart',
        'emptyText',
        '그릴 조각이 없을 때(빈 목록 · 모두 0%) 보이는 문구입니다.',
        "'표시할 데이터가 없습니다.'",
        'string',
    ],
    [
        'CalloutPieChart',
        'areaHeight',
        '그림 칸 높이(칸 폭을 556 으로 볼 때)입니다. 주면 원 크기는 그대로 두고, 라벨이 칸 밖으로 나가지 않는 범위에서 원 중심을 칸 세로 가운데에 맞춥니다. maxLabelLines 와 함께 주면 라벨 때문에 그림이 칸보다 길어질 때 라벨을 줄여(이름 1줄 → 비중 · 건수를 같은 줄에) 원 크기를 지킵니다.',
        '-',
        'number',
    ],
    [
        'CalloutPieChart',
        'maxLabelLines',
        '바깥 라벨 이름 줄 수 상한입니다(비중 · 건수 줄은 세지 않음). 주면 이름이 그 줄 수를 넘을 때 마지막 줄 끝에서 말줄임해 그림 높이가 이름 길이로 끝없이 늘지 않습니다(PDF 템플릿 진단브리핑은 2). 비중 · 건수는 마지막 이름 줄 옆에 들어가지 않으면 한 줄 더 내립니다. 안 주면 줄 수 제한 없이 모두 보입니다.',
        '-',
        'number',
    ],
    ['CalloutPieItem', 'id · label', '조각 식별자와 이름입니다.', '-', 'string'],
    ['CalloutPieItem', 'percentage', '비중(%)입니다. 적힌 그대로 보입니다. 0 이하는 그리지 않습니다.', '-', 'number'],
    ['CalloutPieItem', 'count', '건수입니다. 없으면 비중만 적습니다.', '-', 'number'],
    ['CalloutPieItem', 'color', '조각 색(CSS 변수)입니다.', '-', 'string'],
    [
        'CalloutPieChartSkeleton',
        'label',
        '불러오는 중 문구(화면 낭독기용)입니다.',
        "'그래프를 불러오는 중입니다.'",
        'string',
    ],
] as const

// 예시 한 칸 — 제목 · 설명 · 차트.
const Example = ({title, description, children}: {title: string; description: string; children: ReactNode}) => (
    <div className="flex flex-col gap-2">
        <p className="typo-body-xl-bold text-foreground">{title}</p>
        <p className="typo-body-m-regular text-foreground-subtle break-keep">{description}</p>
        <div className="border-subtle-3 bg-card rounded-sm border p-6">{children}</div>
    </div>
)

const SectionHeading = ({id, title, children}: {id: string; title: string; children?: ReactNode}) => (
    <div className="flex flex-col gap-2">
        <h2 id={id} className="typo-h4-bold">
            {title}
        </h2>
        {children ? <p className="typo-body-l-regular text-label-foreground">{children}</p> : null}
    </div>
)

const CalloutPieChartGuidePage = () => (
    <GuidePageShell
        title="지시선 원형 차트 (CalloutPieChart)"
        description="분류별 비중을 꽉 찬 원형과 지시선 라벨로 보여 주는 차트입니다. 범례 없이 조각마다 이름 · 비중 · 건수를 적습니다."
    >
        <BaseCard>
            <section aria-labelledby="cpc-basic" className="flex flex-col gap-6">
                <SectionHeading id="cpc-basic" title="1. 기본 사용">
                    K-BIGx 보고서 PDF 템플릿의 기업 보유기술 · 신용/담보 비중 원형 차트입니다. 가운데가 빈 도넛과 범례
                    모양은{' '}
                    <Link href="/component-guide/percentage-donut-chart" className={LINK_CLASS}>
                        PercentageDonutChart
                    </Link>
                    를 씁니다.
                </SectionHeading>
                <div className="max-w-xl">
                    <CalloutPieChart
                        maxLabelLines={LABEL_MAX_LINES}
                        data={STANDARD_DATA}
                        ariaLabel="기업 보유기술 소분류별 비중과 건수 예시"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cpc-label-rule" className="flex flex-col gap-6">
                <SectionHeading id="cpc-label-rule" title="2. 라벨 기준 (모두 지시선)">
                    비중과 관계없이 모든 분류를 지시선 끝에 &apos;이름 비중 건수&apos;로 적습니다. 조각 안에는 글자를
                    적지 않습니다 — 가장 큰 조각 안에 적던 방식은 조각 모양에 따라 어색하게 놓이는 경우가 있어
                    없앴습니다(분류가 하나뿐이어도 지시선 라벨입니다).
                </SectionHeading>
                <div className="grid gap-6 md:grid-cols-2">
                    <Example title="큰 분류가 있을 때" description="50% 조각도 다른 분류처럼 지시선 라벨입니다.">
                        <CalloutPieChart
                            maxLabelLines={LABEL_MAX_LINES}
                            data={toData([50, 50])}
                            ariaLabel="큰 분류가 있는 예시"
                        />
                    </Example>
                    <Example title="고른 분포" description="모든 분류가 지시선 라벨입니다.">
                        <CalloutPieChart
                            maxLabelLines={LABEL_MAX_LINES}
                            data={toData([24, 22, 20, 18, 16])}
                            ariaLabel="큰 분류가 없는 예시"
                        />
                    </Example>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cpc-scenario" className="flex flex-col gap-6">
                <SectionHeading id="cpc-scenario" title="3. 데이터에 따른 모양">
                    버튼으로 분포 · 항목 수를 바꿔 보면 라벨 자리와 원 위치가 데이터에 따라 저절로 정해지는 것을 볼 수
                    있습니다.
                </SectionHeading>
                <div className="bg-surface border-border overflow-hidden rounded-xl border p-4 sm:p-6">
                    <CalloutPieScenarioDemo />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cpc-leader" className="flex flex-col gap-6">
                <SectionHeading id="cpc-leader" title="4. 지시선 모양">
                    선이 서로 엇갈리거나 원을 가로지르지 않도록 경우에 따라 배치를 바꿉니다.
                </SectionHeading>
                <Table
                    caption="CalloutPieChart 지시선 규칙"
                    columns={LEADER_RULE_COLUMNS}
                    rows={LEADER_RULE_ROWS}
                    size="md"
                />
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <Example title="기본" description="원 둘레까지 곧은 선입니다.">
                        <CalloutPieChart
                            maxLabelLines={LABEL_MAX_LINES}
                            data={STANDARD_DATA}
                            ariaLabel="원 둘레 배치 예시"
                        />
                    </Example>
                    <Example title="밀어내기" description="위로 몰린 라벨을 46 간격으로 밀어 올립니다.">
                        <CalloutPieChart
                            maxLabelLines={LABEL_MAX_LINES}
                            data={PUSHED_DATA}
                            ariaLabel="라벨 밀어내기 예시"
                        />
                    </Example>
                    <Example
                        title="원 돌리기"
                        description="90% 뒤로 1~2% 조각 7개가 12시 근처에 몰리면 위로만 쌓여 그림이 길어지므로, 원을 돌려 큰 조각을 위로 보내고 라벨을 원 아래 양옆에 고르게 펼칩니다."
                    >
                        <CalloutPieChart maxLabelLines={LABEL_MAX_LINES} data={TAIL_DATA} ariaLabel="원 돌리기 예시" />
                    </Example>
                    <Example
                        title="세로줄 배치 · 꺾은 지시선"
                        description="80% 뒤로 이름이 긴 작은 조각 7개가 몰리면 돌린 뒤에도 선이 엉키는 쪽을 세로줄에 놓고, 선을 세로 → 가로로 꺾어 잇습니다. 8개 안에서 가장 긴 그림입니다(높이 약 425). PDF 템플릿 칸(387)에서는 이름을 1줄로 줄여 0.95배로 들어갑니다(7번 참고)."
                    >
                        <CalloutPieChart
                            maxLabelLines={LABEL_MAX_LINES}
                            data={CROWDED_LONG_DATA}
                            ariaLabel="세로줄 배치 예시"
                        />
                    </Example>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cpc-edge" className="flex flex-col gap-6">
                <SectionHeading id="cpc-edge" title="5. 엣지 케이스">
                    라벨 · 값은 데이터마다 달라집니다. 원 크기는 그대로 두고, 길어진 이름은 2줄까지 줄을 바꾸고 넘치면
                    둘째 줄 끝에서 말줄임합니다. 비중 · 건수는 마지막 이름 줄 옆에 들어가지 않으면 다음 줄로 내립니다.
                </SectionHeading>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">5-1. 지시선 라벨이 길 때</h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            <Example
                                title="한 분류만 긴 경우"
                                description="그 라벨만 2줄로 접고(넘치면 말줄임), 이웃 라벨은 늘어난 줄만큼 간격을 벌립니다."
                            >
                                <CalloutPieChart
                                    maxLabelLines={LABEL_MAX_LINES}
                                    data={ONE_LONG_DATA}
                                    ariaLabel="한 분류만 긴 예시"
                                />
                            </Example>
                            <Example
                                title="모든 분류가 긴 경우"
                                description="모든 라벨이 2줄까지 접히고 넘치면 말줄임합니다. 줄이 늘어난 만큼 그림 높이만 늘고 원 크기는 그대로입니다."
                            >
                                <CalloutPieChart
                                    maxLabelLines={LABEL_MAX_LINES}
                                    data={ALL_LONG_DATA}
                                    ariaLabel="모든 분류가 긴 예시"
                                />
                            </Example>
                            <Example
                                title="8조각 모두 긴 경우"
                                description="표준과 같은 8조각에 이름이 모두 길면 왼쪽에 쌓인 라벨이 엉켜, 원을 돌려 라벨을 양옆에 나눕니다."
                            >
                                <CalloutPieChart
                                    maxLabelLines={LABEL_MAX_LINES}
                                    data={EIGHT_LONG_DATA}
                                    ariaLabel="8조각 모두 긴 예시"
                                />
                            </Example>
                            <Example
                                title="띄어쓰기 없는 긴 이름"
                                description="끊을 자리가 없으면 글자 단위로 끊어 2줄까지 적고, 넘치면 말줄임합니다. 말줄임할 뒷부분은 원래 이름에서 잘라 와, 글자 단위로 끊긴 자리에 없던 띄어쓰기가 끼어들지 않습니다."
                            >
                                <CalloutPieChart
                                    maxLabelLines={LABEL_MAX_LINES}
                                    data={NO_SPACE_DATA}
                                    ariaLabel="띄어쓰기 없는 긴 이름 예시"
                                />
                            </Example>
                            <Example
                                title="줄 수 상한 없이(maxLabelLines 생략)"
                                description="maxLabelLines 를 넘기지 않으면 이름을 말줄임하지 않고 남은 폭에 맞춰 모두 적습니다. 그림 높이가 이름 길이만큼 늘어납니다."
                            >
                                <CalloutPieChart data={EIGHT_LONG_DATA} ariaLabel="줄 수 상한 없이 긴 이름 예시" />
                            </Example>
                            <Example
                                title="고른 8개가 모두 긴 경우"
                                description="큰 분류 없이 8개가 고르면 라벨이 원 둘레 양쪽에 나뉘고, 이름은 저마다 2줄까지 접혀 말줄임합니다."
                            >
                                <CalloutPieChart
                                    maxLabelLines={LABEL_MAX_LINES}
                                    data={EVEN_LONG_DATA}
                                    ariaLabel="고른 8개가 모두 긴 예시"
                                />
                            </Example>
                            <Example
                                title="가운뎃점 · 말줄임 다듬기"
                                description="'소재 · 부품' 처럼 띄운 가운뎃점은 앞 말에 붙여 줄이 '·' 로 시작하지 않습니다. 말줄임 앞의 띄어쓰기는 지웁니다('및 …' → '및…')."
                            >
                                <CalloutPieChart
                                    maxLabelLines={LABEL_MAX_LINES}
                                    data={MIDDLE_DOT_DATA}
                                    ariaLabel="가운뎃점 · 말줄임 예시"
                                />
                            </Example>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">5-2. 데이터 값이 클 때</h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            <Example
                                title="큰 건수 · 소수 비중"
                                description="건수는 천 단위 쉼표를 넣고(12,345개), 비중은 받은 자릿수 그대로 적습니다. 마지막 줄에 들어가지 않으면 비중 · 건수를 다음 줄로 내립니다."
                            >
                                <CalloutPieChart
                                    maxLabelLines={LABEL_MAX_LINES}
                                    data={LARGE_VALUE_DATA}
                                    ariaLabel="데이터 값이 큰 예시"
                                />
                            </Example>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">5-3. 데이터 구성</h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            <Example
                                title="비중 합이 100 이 아닌 경우"
                                description="반올림으로 합이 99 여도 합 기준으로 원을 채우고, 글자는 받은 비중(33%)을 그대로 적습니다."
                            >
                                <CalloutPieChart
                                    maxLabelLines={LABEL_MAX_LINES}
                                    data={ROUNDED_SUM_DATA}
                                    ariaLabel="비중 합이 99 인 예시"
                                />
                            </Example>
                            <Example
                                title="0% 항목이 있는 경우"
                                description="0% 이하는 그리지 않습니다. 숨김 목록에는 남습니다."
                            >
                                <CalloutPieChart
                                    maxLabelLines={LABEL_MAX_LINES}
                                    data={ZERO_DATA}
                                    ariaLabel="0% 항목이 있는 예시"
                                />
                            </Example>
                            <Example
                                title="데이터가 없는 경우"
                                description="빈 목록이거나 모두 0% 면 emptyText 만 보입니다."
                            >
                                <CalloutPieChart
                                    maxLabelLines={LABEL_MAX_LINES}
                                    data={[]}
                                    ariaLabel="데이터가 없는 예시"
                                />
                            </Example>
                            <Example
                                title="한 분류 100% · 긴 이름"
                                description="원 전체가 한 조각이고 라벨은 3시 방향 오른쪽에 둡니다. 이름은 2줄까지 적고 말줄임합니다."
                            >
                                <CalloutPieChart
                                    maxLabelLines={LABEL_MAX_LINES}
                                    data={SINGLE_LONG_DATA}
                                    ariaLabel="한 분류 100% 긴 이름 예시"
                                />
                            </Example>
                            <Example
                                title="아주 작은 조각 (99 : 1)"
                                description="1% 조각도 지시선 라벨로 적습니다. 조각이 가늘어도 선은 조각 가운데에서 나갑니다."
                            >
                                <CalloutPieChart
                                    maxLabelLines={LABEL_MAX_LINES}
                                    data={TINY_SLICE_DATA}
                                    ariaLabel="아주 작은 조각 예시"
                                />
                            </Example>
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cpc-loading" className="flex flex-col gap-6">
                <SectionHeading id="cpc-loading" title="6. 불러오는 중 (CalloutPieChartSkeleton)">
                    차트와 같은 자리에 원 · 지시선 · 라벨 자리를 그립니다. 그림 범위가 같아 불러온 뒤 자리가 흔들리지
                    않습니다.
                </SectionHeading>
                <div className="grid gap-6 md:grid-cols-2">
                    <Example title="불러오는 중" description="회색 자리 · 깜빡임으로 불러오는 중임을 보입니다.">
                        <CalloutPieChartSkeleton label="기업 보유기술을 불러오는 중입니다." />
                    </Example>
                    <Example title="불러온 뒤" description="같은 자리에 차트가 그려집니다.">
                        <CalloutPieChart
                            maxLabelLines={LABEL_MAX_LINES}
                            data={STANDARD_DATA}
                            ariaLabel="불러온 뒤 예시"
                        />
                    </Example>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cpc-print" className="flex flex-col gap-6">
                <SectionHeading id="cpc-print" title="7. K-BIGx PDF 템플릿에서">
                    색을 값으로 받으므로 PDF 템플릿은 kbx 토큰을 넘깁니다. PDF 템플릿은 데이터를 받은 뒤 서버에서 바로
                    그려 스켈레톤 없이 나옵니다. 원형 그래프 라벨은 모두 원 밖 지시선 끝에 둡니다(현업 요청) —
                    진단브리핑 기업 보유기술과 신용/재무정보 차입금 현황의 신용/담보 비중(예전 InsideLabelPieChart)이 이
                    차트를 씁니다. 신용/담보 비중은 오른쪽 반 칸(556 × 330, <code>areaHeight</code> 330)에 두고 건수
                    없이 비중만 적습니다. 확인 화면:{' '}
                    <Link
                        href="/corp/k-bigx-report/innovation-growth-report/report-print?sections=briefing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        K-BIGx 보고서 PDF 템플릿 진단브리핑
                        <span className="sr-only"> (새 창)</span>
                    </Link>
                    {' · '}
                    <Link
                        href="/corp/k-bigx-report/innovation-growth-report/report-print?sections=credit-finance"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        K-BIGx 보고서 PDF 템플릿 신용/재무정보
                        <span className="sr-only"> (새 창)</span>
                    </Link>
                </SectionHeading>
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
                <h3 className="typo-title-m-bold text-foreground">칸 높이가 모자랄 때 — 원 크기 지키기</h3>
                <p className="typo-body-l-regular text-label-foreground">
                    <code>areaHeight</code> 와 <code>maxLabelLines</code> 를 함께 주면, 라벨이 칸보다 길어 그림 전체(원
                    포함)가 줄어들 상황에서 라벨부터 줄입니다. 이름 2줄 → 이름 1줄 → 이름 1줄 + 비중 · 건수를 같은 줄에
                    순서로 바꿔 보고, 칸에 들어가는 첫 단계를 씁니다. 칸 높이의 1.07배까지는 들어간 것으로 봅니다(표준
                    8조각 · 목업은 이름 2줄 그대로 0.94배). 비중 · 건수를 이름 옆에 붙이는 단계에서도 이름이 세 글자도
                    안 남으면(&apos;…&apos; 만 남는 등) 옆에 붙이지 않고 다음 줄로 내립니다. 아래는 PDF 템플릿 칸(556 ×
                    387)과 같은 비율의 자리입니다.
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                    <Example
                        title="80% + 이름이 긴 작은 조각 7개"
                        description="이름 2줄이면 그림이 0.86배로 줄어 이름을 1줄로 줄입니다(0.95배)."
                    >
                        {/* 칸 비율 556 : 387 — PDF 템플릿 차트 칸과 같은 자리를 만든다. */}
                        <div className="aspect-[556/387] w-full">
                            <CalloutPieChart
                                maxLabelLines={LABEL_MAX_LINES}
                                areaHeight={387}
                                data={CROWDED_LONG_DATA}
                                ariaLabel="칸 높이에 맞춰 이름을 1줄로 줄인 예시"
                                className="h-full"
                            />
                        </div>
                    </Example>
                    <Example
                        title="90% + 이름이 긴 작은 조각 7개"
                        description="이름 1줄로도 넘쳐(0.86배) 비중 · 건수를 이름 옆에 붙입니다. 원은 줄지 않습니다."
                    >
                        <div className="aspect-[556/387] w-full">
                            <CalloutPieChart
                                maxLabelLines={LABEL_MAX_LINES}
                                areaHeight={387}
                                data={TAIL_LONG_DATA}
                                ariaLabel="칸 높이에 맞춰 비중 · 건수를 이름 옆에 붙인 예시"
                                className="h-full"
                            />
                        </div>
                    </Example>
                </div>
                <h3 className="typo-title-m-bold text-foreground">높이가 정해진 자리</h3>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        보통은 폭에 맞춰 그리고 높이는 라벨 수 · 줄 수만큼 늘어납니다. 부모가 높이를 정해 주면(
                        <code>min-h-0</code> 인 flex 자리) 그 높이에 맞춰 그림 전체가 같은 비율로 줄어듭니다. 라벨은
                        그대로 모두 보입니다.
                    </li>
                    <li>
                        PDF 템플릿 진단브리핑 1쪽은 위 줄(기업 보유기술 · 관련 기업 및 특허현황)을 템플릿 높이 450 으로
                        고정합니다(<code>h-kbx-450</code>). 이 높이가 차트의 최대 높이라, 조각 · 라벨이 많아져도 아래
                        R&amp;D 이슈 줄은 늘 같은 자리에 있고 차트만 그 안에서 줄어듭니다.
                    </li>
                    <li>
                        가운데 맞춤 — 원은 늘 가로 가운데입니다. PDF 템플릿은 <code>areaHeight</code> 로 칸 높이(387)를
                        넘겨 세로도 가운데에 맞춥니다. 라벨이 적으면(1 · 2 · 3개, 균형 등) 원이 칸 정중앙에 오고, 라벨이
                        위나 아래로 길어 칸에 여유가 없으면 라벨이 칸 밖으로 나가지 않는 만큼만 비켜 있습니다.
                    </li>
                    <li>
                        원 크기는 늘 반지름 112(지름 224)이고 칸을 채우려고 키우지 않습니다. 그림 높이가 칸(387)보다 길
                        때만 그림 전체가 같은 비율로 줄어듭니다. 표준 8조각(높이 401 → 0.97배) · 목업(412 → 0.94배) ·
                        편중(397 → 0.98배)은 템플릿 모양 그대로 조금 줄어들고, 그보다 길어지는 경우는 위 &apos;칸 높이가
                        모자랄 때&apos; 처럼 라벨을 줄여 원 크기를 지킵니다.
                    </li>
                    <li>
                        PDF 템플릿에서 넣어 본 데이터(모두 8개 이하): 표준 · 목업 · 1개(짧은 · 긴 이름) · 2개(50:50) ·
                        3개 · 편중 · 균형 · 긴 라벨 · 8조각 + 긴 이름 · 원 돌리기(90%) · 90% · 80% + 긴 이름 · 고른 8개
                        + 긴 이름 · 큰 값 · 띄어쓰기 없는 이름. 모두 문서 쪽 수(28쪽) · R&amp;D 줄 위치가 같고, 쪽 넘침
                        · 선 엇갈림 · 라벨 겹침 없이 소제목과 라벨 사이 32 이상이 남습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cpc-a11y" className="flex flex-col gap-6">
                <SectionHeading id="cpc-a11y" title="8. 접근성" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 분류마다 이름
                        · 비중 · 건수를 화면에 보이지 않는 목록으로도 읽어 줍니다(0% 항목 포함)[5.1.1].
                    </li>
                    <li>비중 · 건수를 글자로 적어 색만으로 정보를 전하지 않습니다[5.3.1].</li>
                    <li>
                        스켈레톤은 <code>role=&quot;status&quot;</code> 와 숨김 문구로 불러오는 중임을 알립니다.
                    </li>
                    <li>마우스 반응과 움직임이 없어 동작 줄이기 설정과 무관하게 같은 모양입니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cpc-props" className="flex flex-col gap-6">
                <SectionHeading id="cpc-props" title="9. Props API" />
                <PropsTable items={PROPS_ITEMS} caption="CalloutPieChart · CalloutPieChartSkeleton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default CalloutPieChartGuidePage
