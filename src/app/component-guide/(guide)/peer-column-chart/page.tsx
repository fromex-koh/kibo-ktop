// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import {PeerColumnChart, type PeerColumnItem} from '@/components/custom/peer-column-chart'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '피어 비교 막대 (PeerColumnChart)'}

const USAGE_CODE = `import {PeerColumnChart} from '@/components/custom/peer-column-chart'

<PeerColumnChart
  ariaLabel="기업 유형별 Tech-Index 비교"
  data={[
    {id: 'applicant', label: '신청기업', value: 63.7, isApplicant: true},
    {id: 'all', label: '전체기업', value: 37.5},
    {id: 'startup', label: '창업', value: 37.5},
  ]}
/>`

const DATA_CODE = `// [프론트엔드 연동] 신청기업 막대에만 isApplicant 를 줍니다 — 막대 색과 이름 색이 함께 바뀝니다.
// 항목마다 두 값을 견주려면 comparisonValue 를 함께 넘깁니다(4대 혁신역량 비교).
// 이름에 줄바꿈(\\n)을 넣으면 두 줄로 섭니다(예: '신청기업\\n(지역명)').
<PeerColumnChart
  ariaLabel="지역별 Peer Group 비교"
  data={report.regionPeers}
  scaleMax={100}
  yAxisStep={20}
/>`

const SHAPE_RULES = [
    '왼쪽 눈금(기본 0~100, 20 간격) · 칸 좌우 끝의 세로 실선 · 바닥 실선 · 항목 사이 세로 점선으로 칸을 나눕니다. 가로 눈금선은 없습니다.',
    'showEndLine 을 끄면 오른쪽 끝 실선이 사라집니다 — 여러 차트를 나란히 놓는 자리(기업 유형별 4대 혁신역량 비교)에서 씁니다.',
    '막대 두께는 24 이고, 칸이 좁아지면 칸 폭에 맞춰(단일 1/2 · 두 개 1/4) 함께 얇아집니다.',
    '눈금 최댓값이 칸 높이의 97% 에 닿습니다 — 값 글자는 막대 위에 붙어 함께 오르내립니다.',
    'comparisonValue 를 주면 칸마다 막대가 둘 섭니다 — 앞이 진한 색(신청기업), 뒤가 옅은 색(비교 대상)이고 두 막대 사이는 12 입니다.',
    'heightClassName 으로 칸 높이를 정합니다. 기본은 h-28(112)이고 4대 혁신역량 비교는 h-40(160)입니다.',
    '값은 막대 위에 글자로 적습니다. 눈금을 넘는 값은 칸 높이까지만 찹니다.',
    '신청기업 막대만 primary 색입니다. 이름이 파란 글자가 되는 것은 막대가 하나뿐인 Peer Group 비교에서이고, 견줄 막대가 함께 선 칸에서는 이름이 기본색입니다.',
    '차트 라이브러리를 쓰지 않아 인쇄물에도 화면과 같은 자리에 찍힙니다.',
    '이름은 값과 한 덩어리로 읽어 줍니다 — 아래 이름 줄은 자리를 맞추려고 둔 것이라 읽지 않습니다.',
] as const

const COMPANY_TYPE_ITEMS: readonly PeerColumnItem[] = [
    {id: 'applicant', label: '신청기업', value: 63.7, isApplicant: true},
    {id: 'all', label: '전체기업', value: 37.5},
    {id: 'startup', label: '창업', value: 37.5},
    {id: 'non-startup', label: '비창업', value: 37.5},
    {id: 'venture', label: '벤처', value: 37.5},
    {id: 'innobiz', label: '이노비즈', value: 37.5},
]

const REGION_ITEMS: readonly PeerColumnItem[] = [
    {id: 'applicant', label: '신청기업\n(지역명)', value: 63.7, isApplicant: true},
    ...['서울', '경기', '충남', '대전', '인천', '부산', '경남', '강원', '대구', '충북'].map((label) => ({
        id: label,
        label,
        value: 37.5,
    })),
]

const COMPETENCY_ITEMS: readonly PeerColumnItem[] = [
    {id: 'infra', label: '인프라', value: 63.7, comparisonValue: 37.5, isApplicant: true},
    {id: 'input', label: '투입', value: 63.7, comparisonValue: 37.5, isApplicant: true},
    {id: 'activity', label: '활동', value: 63.7, comparisonValue: 37.5, isApplicant: true},
    {id: 'outcome', label: '성과', value: 63.7, comparisonValue: 37.5, isApplicant: true},
]

const PROPS_ITEMS = [
    ['PeerColumnChart', 'ariaLabel', '화면 낭독기가 읽을 차트 이름입니다.', '-', 'string'],
    [
        'PeerColumnChart',
        'data',
        '막대 항목 목록입니다(id · label · value · comparisonValue · isApplicant).',
        '-',
        'PeerColumnItem[]',
    ],
    ['PeerColumnChart', 'scaleMax', '눈금 최댓값입니다.', '100', 'number'],
    ['PeerColumnChart', 'showEndLine', '칸 오른쪽 끝의 세로 실선을 그릴지 정합니다.', 'true', 'boolean'],
    [
        'PeerColumnChart',
        'heightClassName',
        '칸 높이 유틸리티입니다(이름 줄은 그 아래에 따로 섭니다).',
        "'h-28'",
        'string',
    ],
    ['PeerColumnChart', 'yAxisStep', '눈금 간격입니다.', '20', 'number'],
    ['PeerColumnChart', 'valueFractionDigits', '값의 소수점 자리수입니다.', '1', 'number'],
    ['PeerColumnChart', 'isLoading', '불러오는 중이면 같은 높이의 스켈레톤을 보입니다.', 'false', 'boolean'],
    [
        'PeerColumnChart',
        'loadingLabel',
        '불러오는 중에 화면 낭독기가 읽을 말입니다.',
        "'비교 막대를 불러오는 중입니다.'",
        'string',
    ],
] as const

const PeerColumnChartGuidePage = () => (
    <GuidePageShell
        title="피어 비교 막대 (PeerColumnChart)"
        description="신청기업 하나와 견줄 집단 여럿을 같은 눈금 위에 세웁니다. Tech-Index 심층분석 리포트의 Peer Group 비교에서 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="pcc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="pcc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">기업 유형별 Tech-Index 비교입니다.</p>
                </div>
                <PeerColumnChart ariaLabel="기업 유형별 Tech-Index 비교" data={COMPANY_TYPE_ITEMS} />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pcc-shape" className="flex flex-col gap-4">
                <h2 id="pcc-shape" className="typo-h4-bold">
                    모양 (Shape)
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex flex-col gap-1">
                    {SHAPE_RULES.map((rule) => (
                        <li key={rule} className="flex">
                            <ListMarker type="unordered" />
                            <span className="min-w-0">{rule}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pcc-pair" className="flex flex-col gap-4">
                <div>
                    <h2 id="pcc-pair" className="typo-h4-bold">
                        두 값 견주기 (Comparison)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Tech-Index 심층분석의 4대 혁신역량 비교입니다. comparisonValue 를 주면 칸마다 막대가 둘 섭니다 —
                        범례는 구획 제목 줄에 따로 둡니다.
                    </p>
                </div>
                <PeerColumnChart ariaLabel="4대 혁신역량 비교" data={COMPETENCY_ITEMS} heightClassName="h-40" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pcc-many" className="flex flex-col gap-4">
                <div>
                    <h2 id="pcc-many" className="typo-h4-bold">
                        항목이 많을 때 (Dense)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        지역별 비교처럼 항목이 많으면 칸이 좁아지고 막대도 함께 얇아집니다. 신청기업 이름은 두 줄로 둘
                        수 있습니다.
                    </p>
                </div>
                <PeerColumnChart ariaLabel="지역별 Peer Group 비교" data={REGION_ITEMS} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pcc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="pcc-loading" className="typo-h4-bold">
                        불러오는 중 (Loading)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        isLoading 을 주면 같은 높이의 막대 스켈레톤이 대신 섭니다.
                    </p>
                </div>
                <PeerColumnChart ariaLabel="기업 유형별 Tech-Index 비교" data={COMPANY_TYPE_ITEMS} isLoading />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pcc-data" className="flex flex-col gap-4">
                <h2 id="pcc-data" className="typo-h4-bold">
                    데이터 연결 (Data)
                </h2>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="PeerColumnChart 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pcc-props" className="flex flex-col gap-4">
                <h2 id="pcc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="PeerColumnChart 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PeerColumnChartGuidePage
