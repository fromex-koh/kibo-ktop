// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {PeerColumnChart, type PeerColumnItem} from '@/components/custom/peer-column-chart'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '피어 비교 막대 (PeerColumnChart)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const SECTION_HEAD = 'flex max-w-4xl flex-col gap-2'
const BLOCKS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'

const USAGE_CODE = `import {PeerColumnChart} from '@/components/custom/peer-column-chart'

<PeerColumnChart
  ariaLabel="기업 유형별 Tech-Index 비교"
  data={[
    {id: 'applicant', label: '신청기업', value: 63.7, isApplicant: true},
    {id: 'all', label: '전체기업', value: 37.5},
    {id: 'startup', label: '창업', value: 37.5},
  ]}
/>`

const COMPARISON_CODE = `// comparisonValue 를 주면 칸마다 막대가 둘 선다(앞: 진한 색, 뒤: 옅은 색).
<PeerColumnChart
  ariaLabel="4대 혁신역량 비교"
  data={[{id: 'infra', label: '인프라', value: 63.7, comparisonValue: 37.5}]}
  heightClassName="h-40"
/>`

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

const CHOICE_COLUMNS = [
    {key: 'case', header: '비교할 값', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'peer',
        cells: [
            '신청기업과 동종 집단을 점수 눈금(0~100)에 견줌',
            <code key="c">PeerColumnChart</code>,
            '왼쪽 눈금과 칸 구획이 있고 차트 라이브러리를 쓰지 않아 인쇄에도 같은 자리에 찍힙니다.',
        ],
    },
    {
        key: 'column',
        cells: [
            '항목마다 값 하나',
            <Link key="c" href="/component-guide/column-chart" className={LINK_CLASS}>
                ColumnChart
            </Link>,
            '값의 크기에 따라 눈금이 자동으로 정해지는 일반 막대입니다.',
        ],
    },
    {
        key: 'grouped',
        cells: [
            '항목마다 여러 계열',
            <Link key="c" href="/component-guide/grouped-column-chart" className={LINK_CLASS}>
                GroupedColumnChart
            </Link>,
            '계열 수가 3개 이상이거나 범례가 필요할 때 씁니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['PeerColumnChart', 'data', '막대 항목 목록입니다.', '-', 'readonly PeerColumnItem[]'],
    ['PeerColumnChart', 'ariaLabel', '차트 이름입니다. 숨김 캡션으로 읽힙니다.', '-', 'string'],
    ['PeerColumnChart', 'scaleMax', '눈금 최댓값입니다. 값이 이를 넘으면 칸 높이까지만 찹니다.', '100', 'number'],
    ['PeerColumnChart', 'yAxisStep', '눈금 간격입니다.', '20', 'number'],
    ['PeerColumnChart', 'valueFractionDigits', '막대 위 값의 소수 자릿수입니다.', '1', 'number'],
    [
        'PeerColumnChart',
        'heightClassName',
        '칸 높이 유틸리티입니다. 이름 줄은 그 아래에 따로 섭니다.',
        "'h-28'",
        'string',
    ],
    [
        'PeerColumnChart',
        'showEndLine',
        '칸 오른쪽 끝 세로 실선입니다. 차트를 나란히 놓을 때 끕니다.',
        'true',
        'boolean',
    ],
    ['PeerColumnChart', 'isLoading', '불러오는 중입니다. 같은 높이의 스켈레톤을 대신 보입니다.', 'false', 'boolean'],
    [
        'PeerColumnChart',
        'loadingLabel',
        '불러오는 중에 화면 낭독기가 읽을 말입니다.',
        "'비교 막대를 불러오는 중입니다.'",
        'string',
    ],
    ['PeerColumnChart', 'className', '바깥 figure 에 덧붙일 클래스입니다. 그 밖의 div 속성도 받습니다.', '-', 'string'],
    ['PeerColumnItem', 'id', '항목을 구분하는 고유 값입니다.', '-', 'string'],
    ['PeerColumnItem', 'label', '막대 아래 이름입니다. 줄바꿈(\\n)은 두 줄로 섭니다.', '-', 'string'],
    ['PeerColumnItem', 'value', '값입니다.', '-', 'number'],
    [
        'PeerColumnItem',
        'isApplicant',
        '신청기업 막대입니다. 진한 색을 받고, 막대가 하나뿐인 칸에서는 이름도 primary 색입니다.',
        '-',
        'boolean',
    ],
    [
        'PeerColumnItem',
        'comparisonValue',
        '견줄 값입니다. 주면 칸마다 막대가 둘 서고 앞이 진한 색, 뒤가 옅은 색입니다.',
        '-',
        'number',
    ],
] as const

const PeerColumnChartGuidePage = () => (
    <GuidePageShell
        title="피어 비교 막대 (PeerColumnChart)"
        description="신청기업 하나와 견줄 집단 여럿을 같은 점수 눈금 위에 세우는 막대 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="pcc-basic" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="pcc-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> 와 <code>ariaLabel</code> 을 넘기고, 신청기업 막대에만{' '}
                        <code>isApplicant</code> 를 줍니다. 눈금은 점수 100 · 간격 20 이 기본이며, 이름에 줄바꿈(
                        <code>\n</code>)을 넣으면 두 줄로 섭니다.
                    </p>
                </div>
                <PeerColumnChart ariaLabel="기업 유형별 Tech-Index 비교" data={COMPANY_TYPE_ITEMS} />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pcc-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="pcc-variants" className="typo-h4-bold">
                        변형과 상태
                    </h2>
                </div>
                <div className={BLOCKS}>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">두 값 견주기</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            항목마다 <code>comparisonValue</code> 를 주면 칸마다 막대가 둘 섭니다. 범례는 포함되지 않아
                            구획 제목 줄에 따로 둡니다.
                        </p>
                        <PeerColumnChart ariaLabel="4대 혁신역량 비교" data={COMPETENCY_ITEMS} heightClassName="h-40" />
                        <CodeBlock code={COMPARISON_CODE} language="tsx" copyLabel="두 값 견주기 코드 복사" />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">항목이 많을 때</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            칸이 좁아지면 막대도 칸 폭에 맞춰 얇아집니다. 이름은 적힌 줄바꿈에서만 접힙니다.
                        </p>
                        <PeerColumnChart ariaLabel="지역별 Peer Group 비교" data={REGION_ITEMS} />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>isLoading</code> 을 켜면 같은 높이의 스켈레톤이 서고, 서버 렌더링 동안에도 보입니다.
                        </p>
                        <PeerColumnChart ariaLabel="기업 유형별 Tech-Index 비교" data={COMPANY_TYPE_ITEMS} isLoading />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pcc-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="pcc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">비교할 값의 짜임으로 고릅니다.</p>
                </div>
                <Table caption="막대 차트 선택 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pcc-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="pcc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        차트는 <code>figure</code> 와 숨김 <code>figcaption</code>(<code>ariaLabel</code>)을 씁니다.
                        항목 이름은 막대 위 값과 한 덩어리로 읽히고, 아래 이름 줄은 읽지 않습니다[5.1.1].
                    </li>
                    <li>값은 막대 위 글자로 항상 적혀 있습니다. 신청기업은 색과 함께 이름으로도 구분합니다[5.3.1].</li>
                    <li>숨김 표와 말풍선은 없습니다. 값 전체가 글자로 노출되기 때문입니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pcc-props" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="pcc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> 와 <code>ariaLabel</code> 만 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="PeerColumnChart Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PeerColumnChartGuidePage
