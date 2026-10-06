// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ButterflyBarChartSkeleton} from '@/components/composite/butterfly-bar-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ButterflyBarChart, type ButterflyBarItem, type ButterflyBarSide} from '@/components/custom/butterfly-bar-chart'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '나비 막대 (ButterflyBarChart)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const SECTION_HEAD = 'flex max-w-4xl flex-col gap-2'
const BLOCKS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'

const COMPANY_SIDE: ButterflyBarSide = {title: '기업수(개)', color: 'var(--raw-purple-500)'}
const PATENT_SIDE: ButterflyBarSide = {title: '특허수(건)', color: 'var(--raw-blue-500)'}

const toItems = (rows: readonly (readonly [string, number, number])[]): ButterflyBarItem[] =>
    rows.map(([label, left, right]) => ({id: label, label, left, right}))

const SALES_SCALE_DATA = toItems([
    ['10억원 이하', 13547, 3547],
    ['30억원 이하', 5678, 8536],
    ['100억원 이하', 1532, 2987],
    ['300억원 이하', 2657, 6578],
    ['300억원 초과', 800, 3957],
])

const MAX_EDGE_DATA = toItems([
    ['10억원 이하', 99999, 99999],
    ['30억원 이하', 99999, 50000],
    ['100억원 이하', 20000, 99999],
])
const ZERO_DATA = toItems([
    ['10억원 이하', 0, 3547],
    ['30억원 이하', 5678, 0],
    ['100억원 이하', 0, 0],
])
const TINY_DATA = toItems([
    ['10억원 이하', 13547, 8536],
    ['30억원 이하', 3, 1],
    ['100억원 이하', 1, 12],
])
const ONE_SIDE_ZERO_DATA = toItems([
    ['10억원 이하', 13547, 0],
    ['30억원 이하', 5678, 0],
    ['100억원 이하', 1532, 0],
])
const LONG_NUMBER_DATA = toItems([
    ['10억원 이하', 1234567, 987654],
    ['30억원 이하', 523456, 1876543],
    ['100억원 이하', 98765, 123456],
])
const LONG_LABEL_DATA = toItems([
    ['10억원 이하 (창업 3년 미만 기업 포함)', 13547, 3547],
    ['30억원 이하', 5678, 8536],
    ['100억원 초과 300억원 이하 중견 후보 기업', 1532, 2987],
])
const MANY_ITEMS_DATA = toItems(
    Array.from({length: 10}, (_, index) => [`구간 ${index + 1}`, 1200 + index * 1300, 9800 - index * 900] as const),
)
const SINGLE_DATA = toItems([['10억원 이하', 13547, 3547]])
const NEGATIVE_DATA = toItems([
    ['10억원 이하', 13547, 3547],
    ['30억원 이하', -120, 8536],
    ['100억원 이하', 1532, -5],
])

const USAGE_CODE = `import {ButterflyBarChart} from '@/components/custom/butterfly-bar-chart'

<ButterflyBarChart
  ariaLabel="매출 규모별 기업 및 특허 현황"
  categoryTitle="매출 규모"
  data={data}
  left={{title: '기업수(개)', color: 'var(--raw-purple-500)'}}
  right={{title: '특허수(건)', color: 'var(--raw-blue-500)'}}
/>`

const DATA_CODE = `// 값은 원래 개수를 넘긴다. 막대 길이와 줄임 표기('1.2만')는 컴포넌트가 계산한다.
const data = salesScales.map((scale) => ({
  id: scale.code,
  label: scale.name,
  left: scale.companyCount ?? 0,
  right: scale.patentCount ?? 0,
}))`

const CHOICE_COLUMNS = [
    {key: 'case', header: '비교할 값', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'butterfly',
        cells: [
            '항목마다 단위가 다른 두 값을 마주 놓음',
            <code key="c">ButterflyBarChart</code>,
            '항목 구간이 같고 값 두 개가 짝입니다. 두 쪽의 막대 길이는 서로 견주지 않습니다.',
        ],
    },
    {
        key: 'diverging',
        cells: [
            '서로 다른 두 순위 목록을 좌우로 펼침',
            <Link key="c" href="/component-guide/diverging-rank-chart" className={LINK_CLASS}>
                DivergingRankChart
            </Link>,
            '두 목록의 행 수 · 순서가 달라 같은 줄이 짝이 아닙니다.',
        ],
    },
    {
        key: 'pyramid',
        cells: [
            '집단 안에서의 상위 % 를 피라미드로',
            <Link key="c" href="/component-guide/rank-pyramid-chart" className={LINK_CLASS}>
                RankPyramidChart
            </Link>,
            '값 한 개의 위치를 보여 주는 차트라 항목별 두 값 비교에는 쓰지 않습니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'ButterflyBarChart',
        'data',
        '항목 목록입니다. 항목마다 고유한 id · 이름 · 왼쪽 값 · 오른쪽 값이 필요합니다.',
        '-',
        'ButterflyBarItem[]',
    ],
    ['ButterflyBarChart', 'left', '왼쪽으로 자라는 값의 제목 · 막대 색입니다.', '-', 'ButterflyBarSide'],
    ['ButterflyBarChart', 'right', '오른쪽으로 자라는 값의 제목 · 막대 색입니다.', '-', 'ButterflyBarSide'],
    ['ButterflyBarChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로 쓰입니다.', '-', 'string'],
    ['ButterflyBarChart', 'categoryTitle', '숨김 표 머리의 항목 칸 이름입니다.', "'항목'", 'string'],
    [
        'ButterflyBarChart',
        'valueFractionDigits',
        '값 글자 · 숨김 표의 소수 자릿수입니다. 0~6 으로 맞춥니다.',
        '0',
        'number',
    ],
    ['ButterflyBarChart', 'className', '바깥 div 에 덧붙일 클래스입니다. 그 밖의 div 속성도 받습니다.', '-', 'string'],
    ['ButterflyBarSide', 'title', '머리 줄에 쓰는 제목입니다.', '-', 'string'],
    ['ButterflyBarSide', 'color', '막대 색입니다.', '-', 'string'],
    ['ButterflyBarItem', 'id', '항목을 구분하는 고유 값입니다.', '-', 'string'],
    ['ButterflyBarItem', 'label', '가운데 칸에 쓰는 항목 이름입니다.', '-', 'string'],
    ['ButterflyBarItem', 'left', '왼쪽 값입니다.', '-', 'number'],
    ['ButterflyBarItem', 'right', '오른쪽 값입니다.', '-', 'number'],
    [
        'ButterflyBarChartSkeleton',
        'label',
        '불러오는 중에 화면 낭독기가 읽을 말입니다.',
        "'그래프를 불러오는 중입니다.'",
        'string',
    ],
    ['ButterflyBarChartSkeleton', 'rows', '자리 표시 막대 줄 수입니다.', '5', 'number'],
] as const

const SPECIAL_CASES = [
    {
        title: '가장 큰 값',
        description: '가장 큰 막대도 값 글자 자리를 뺀 폭까지만 자라 값 글자가 카드 밖으로 나가지 않습니다.',
        data: MAX_EDGE_DATA,
    },
    {
        title: '0',
        description: '0 은 막대 없이 값 글자만 가운데 칸 옆에 적습니다.',
        data: ZERO_DATA,
    },
    {
        title: '아주 작은 값',
        description: '0 보다 크면 막대를 최소 2 로 그려 0 과 구분합니다.',
        data: TINY_DATA,
    },
    {
        title: '한 쪽이 모두 0',
        description: '그 쪽은 막대 없이 0 만 적고, 다른 쪽은 제 가장 큰 값 기준으로 그립니다.',
        data: ONE_SIDE_ZERO_DATA,
    },
    {
        title: '긴 숫자',
        description: '7자 이상 값은 “123.5만”처럼 줄여 값 글자 자리 안에 들게 합니다.',
        data: LONG_NUMBER_DATA,
    },
    {
        title: '긴 항목 이름',
        description: '가운데 칸 안에서 낱말 단위로 줄을 바꾸고, 그 줄만 높아집니다. 막대는 세로 가운데에 섭니다.',
        data: LONG_LABEL_DATA,
    },
    {
        title: '항목이 많을 때',
        description: '줄 높이는 그대로 두고 아래로 이어집니다.',
        data: MANY_ITEMS_DATA,
    },
    {
        title: '항목 하나',
        description: '양쪽 막대가 모두 그 쪽의 가장 큰 값이라 폭을 다 채웁니다.',
        data: SINGLE_DATA,
    },
    {
        title: '음수',
        description: '막대는 0 으로 막고, 값 글자와 숨김 표는 받은 값을 그대로 적어 잘못된 자료가 드러나게 둡니다.',
        data: NEGATIVE_DATA,
    },
] as const

const ButterflyBarChartGuidePage = () => (
    <GuidePageShell
        title="나비 막대 (ButterflyBarChart)"
        description="가운데 항목 이름을 두고 두 값(예: 기업수 · 특허수)을 왼쪽 · 오른쪽으로 자라는 가로 막대로 마주 놓습니다."
    >
        <BaseCard>
            <section aria-labelledby="bbc-basic" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="bbc-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        항목마다 <code>left</code> · <code>right</code> 값을 한 행으로 넘깁니다. 막대 길이는 쪽마다 그
                        쪽의 가장 큰 값을 기준으로 따로 재므로 두 쪽은 서로 견주지 않습니다. 값은 늘 글자로 적혀
                        말풍선이 없습니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex min-w-0 flex-col gap-4 rounded-sm border p-6">
                    <h3 className="typo-title-m-bold text-foreground">매출 규모별 기업 및 특허 현황</h3>
                    <ButterflyBarChart
                        ariaLabel="매출 규모별 기업 및 특허 현황"
                        categoryTitle="매출 규모"
                        data={SALES_SCALE_DATA}
                        left={COMPANY_SIDE}
                        right={PATENT_SIDE}
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bbc-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="bbc-variants" className="typo-h4-bold">
                        상태 예시
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        값 글자가 카드를 넘거나 줄이 어긋날 수 있는 경우는 컴포넌트가 처리합니다.
                    </p>
                </div>
                <div className={BLOCKS}>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">특이 값</h3>
                        <ul className="grid list-none gap-6 xl:grid-cols-2">
                            {SPECIAL_CASES.map((item) => (
                                <li key={item.title} className="flex min-w-0 flex-col gap-2">
                                    <h4 className="typo-body-l-bold text-foreground">{item.title}</h4>
                                    <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
                                    <ButterflyBarChart
                                        ariaLabel={item.title}
                                        data={[...item.data]}
                                        left={COMPANY_SIDE}
                                        right={PATENT_SIDE}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            이 컴포넌트에는 <code>isLoading</code> 이 없습니다. 값을 기다리는 동안 같은 자리에{' '}
                            <code>ButterflyBarChartSkeleton</code> 을 둡니다.
                        </p>
                        <div className="grid gap-6 xl:grid-cols-2">
                            <ButterflyBarChartSkeleton label="매출 규모별 기업 및 특허 현황을 불러오는 중입니다." />
                            <ButterflyBarChart
                                ariaLabel="매출 규모별 기업 및 특허 현황"
                                data={SALES_SCALE_DATA}
                                left={COMPANY_SIDE}
                                right={PATENT_SIDE}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bbc-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="bbc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">비교할 값의 짜임으로 고릅니다.</p>
                </div>
                <Table caption="좌우 막대 차트 선택 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bbc-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="bbc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>aria-hidden</code> 으로 감추고, 같은 값이 숨김 표(<code>caption</code> ·{' '}
                        <code>th scope</code>)로 들어 있어 화면 낭독기가 표로 읽습니다. 표의 항목 칸 머리는{' '}
                        <code>categoryTitle</code> 입니다[5.1.1].
                    </li>
                    <li>
                        값이 막대 옆에 글자로 적혀 있고 양쪽은 제목으로 구분합니다. 색만으로 전하지 않습니다[5.3.1].
                    </li>
                    <li>긴 숫자를 줄여 적어도 숨김 표에는 원래 값이 있습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bbc-props" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="bbc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> · <code>left</code> · <code>right</code> · <code>ariaLabel</code> 이
                        필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ButterflyBarChart Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ButterflyBarChartGuidePage
