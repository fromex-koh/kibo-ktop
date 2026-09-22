// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ButterflyBarChartSkeleton} from '@/components/composite/butterfly-bar-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import {ButterflyBarChart, type ButterflyBarItem, type ButterflyBarSide} from '@/components/custom/butterfly-bar-chart'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '나비 막대 (ButterflyBarChart)'}

const COMPANY_SIDE: ButterflyBarSide = {title: '기업수(개)', color: 'var(--raw-purple-500)'}
const PATENT_SIDE: ButterflyBarSide = {title: '특허수(건)', color: 'var(--raw-blue-500)'}

const toItems = (rows: readonly (readonly [string, number, number])[]): ButterflyBarItem[] =>
    rows.map(([label, left, right]) => ({id: label, label, left, right}))

// K-BIGx 보고서 "매출 규모별 기업 및 특허 현황" 카드와 같은 값이다.
const SALES_SCALE_DATA = toItems([
    ['10억원 이하', 13547, 3547],
    ['30억원 이하', 5678, 8536],
    ['100억원 이하', 1532, 2987],
    ['300억원 이하', 2657, 6578],
    ['300억원 초과', 800, 3957],
])

// 특이 케이스 — 가장 큰 값 · 0 · 아주 작은 값 · 한 쪽 모두 0 · 긴 숫자 · 긴 항목 이름 · 항목이 많을 때 · 항목 하나 · 음수.
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
  data={data} // [{id: 'under-1b', label: '10억원 이하', left: 13547, right: 3547}, …]
  left={{title: '기업수(개)', color: 'var(--raw-purple-500)'}}
  right={{title: '특허수(건)', color: 'var(--raw-blue-500)'}}
/>`

const DATA_CODE = `// [프론트엔드 연동] 매출 규모 구간마다 기업수(left) · 특허수(right) 한 행으로 바꾼다.
// 값은 원래 개수를 넘긴다 — 막대 길이 · 줄임 표기('1.2만')는 컴포넌트가 계산한다.
const data = salesScales.map((scale) => ({
  id: scale.code,
  label: scale.name,
  left: scale.companyCount ?? 0,
  right: scale.patentCount ?? 0,
}))`

const SHAPE_RULES = [
    '가운데 폭 120 칸에 항목 이름(12 Regular, 글자 자리 80)을 두고, 왼쪽 막대는 왼쪽으로 · 오른쪽 막대는 오른쪽으로 자랍니다.',
    '머리 줄의 양쪽 제목(14 Bold)은 가운데 칸 쪽에 붙고, 아래 16 에 높이 24 막대 줄이 16 간격으로 이어집니다.',
    '값 글자(11 Regular)는 막대 바깥 끝에서 4 에 붙습니다. 쪽마다 바깥 48 을 값 글자 자리로 남깁니다.',
    '막대 길이는 쪽마다 따로 잽니다 — 그 쪽 가장 큰 값이 값 글자 자리를 뺀 폭을 다 채웁니다. 두 쪽은 서로 견주지 않습니다.',
    '값이 늘 적혀 있어 풍선 도움말은 없습니다. 그림은 감추고 화면 낭독기는 숨김 표를 읽습니다.',
] as const

const PROPS_ITEMS = [
    ['ButterflyBarChart', 'data', '항목별 id · 이름 · 왼쪽 값 · 오른쪽 값입니다.', '-', 'ButterflyBarItem[]'],
    ['ButterflyBarChart', 'left', '왼쪽 값의 제목 · 막대 색입니다.', '-', 'ButterflyBarSide'],
    ['ButterflyBarChart', 'right', '오른쪽 값의 제목 · 막대 색입니다.', '-', 'ButterflyBarSide'],
    ['ButterflyBarChart', 'valueFractionDigits', '값 글자 · 숨김 표의 소수 자릿수입니다.', '0', 'number'],
    ['ButterflyBarChart', 'categoryTitle', '숨김 표 머리의 항목 칸 이름입니다.', "'항목'", 'string'],
    ['ButterflyBarChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로 쓰입니다.', '-', 'string'],
    ['ButterflyBarChartSkeleton', 'label', '불러오는 중 안내 문구(화면 낭독기용)입니다.', "'그래프를 …'", 'string'],
    ['ButterflyBarChartSkeleton', 'rows', '자리 표시 막대 줄 수입니다.', '5', 'number'],
] as const

const SPECIAL_CASES = [
    {
        title: '가장 큰 값 (양쪽 끝)',
        description:
            '가장 큰 값 막대는 값 글자 자리(48)를 뺀 폭까지만 자라, 값 글자가 막대 밖 바깥 끝에 그대로 붙어도 카드 밖으로 나가지 않습니다.',
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
        description: '그 쪽은 막대 없이 0 만 줄마다 적고, 다른 쪽은 그대로 제 가장 큰 값 기준으로 그립니다.',
        data: ONE_SIDE_ZERO_DATA,
    },
    {
        title: '긴 숫자',
        description:
            '7자 이상 값은 “123.5만”처럼 줄여 값 글자 자리 안에 들게 합니다. 화면 낭독기는 숨김 표의 원래 값을 읽습니다.',
        data: LONG_NUMBER_DATA,
    },
    {
        title: '긴 항목 이름',
        description:
            '가운데 칸(글자 자리 80) 안에서 낱말 단위로 줄을 바꿉니다. 그 줄만 높아지고 막대는 세로 가운데에 서서 줄이 어긋나지 않습니다.',
        data: LONG_LABEL_DATA,
    },
    {
        title: '항목이 많을 때 (10개)',
        description: '줄 높이 24 · 간격 16 을 그대로 두고 아래로 이어집니다. 카드 높이는 줄 수만큼 늘어납니다.',
        data: MANY_ITEMS_DATA,
    },
    {
        title: '항목 하나',
        description: '한 줄뿐이면 양쪽 막대가 모두 가장 큰 값이라 값 글자 자리를 뺀 폭을 다 채웁니다.',
        data: SINGLE_DATA,
    },
    {
        title: '음수 (잘못된 자료)',
        description:
            '개수 자료라 음수는 오지 않는다고 보고 막대는 0 으로 막습니다. 값 글자 · 숨김 표는 받은 값을 그대로 적어 잘못된 자료가 드러나게 둡니다.',
        data: NEGATIVE_DATA,
    },
] as const

const ButterflyBarChartGuidePage = () => (
    <GuidePageShell
        title="나비 막대 (ButterflyBarChart)"
        description="가운데 항목 이름을 두고 두 값(예: 기업수 · 특허수)을 왼쪽 · 오른쪽으로 자라는 가로 막대로 마주 놓습니다."
    >
        <BaseCard>
            <section aria-labelledby="bbc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="bbc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서의 매출 규모별 기업 및 특허 현황 카드 그래프입니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex min-w-0 flex-col gap-3 rounded-sm border p-6">
                    <h3 className="typo-body-xl-bold">매출 규모별 기업 및 특허 현황</h3>
                    <ButterflyBarChart
                        ariaLabel="매출 규모별 기업 및 특허 현황"
                        categoryTitle="매출 규모"
                        data={SALES_SCALE_DATA}
                        left={COMPANY_SIDE}
                        right={PATENT_SIDE}
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bbc-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="bbc-shape" className="typo-h4-bold">
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
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bbc-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="bbc-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        값 글자가 카드를 넘거나 줄이 어긋나 모양이 깨질 수 있는 경우입니다. 모두 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 xl:grid-cols-2">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
                            <ButterflyBarChart
                                ariaLabel={item.title}
                                data={[...item.data]}
                                left={COMPANY_SIDE}
                                right={PATENT_SIDE}
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bbc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="bbc-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은 <code className="font-mono">ButterflyBarChartSkeleton</code>을 같은
                        자리에 둡니다. 머리 줄 · 가운데 칸 · 양쪽 막대 · 값 글자 자리의 짜임이 같습니다.
                    </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <ButterflyBarChartSkeleton label="매출 규모별 기업 및 특허 현황을 불러오는 중입니다." />
                    </div>
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <ButterflyBarChart
                            ariaLabel="매출 규모별 기업 및 특허 현황"
                            data={SALES_SCALE_DATA}
                            left={COMPANY_SIDE}
                            right={PATENT_SIDE}
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bbc-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="bbc-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        매출 규모 구간마다 기업수 · 특허수를 한 행으로 바꿔 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="ButterflyBarChart 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="bbc-props" className="flex flex-col gap-4">
                <h2 id="bbc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="ButterflyBarChart 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ButterflyBarChartGuidePage
