// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {DivergingRankChartSkeleton} from '@/components/composite/diverging-rank-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {
    DivergingRankChart,
    type DivergingRankItem,
    type DivergingRankSide,
    type DivergingRankTone,
} from '@/components/custom/diverging-rank-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '양쪽 순위 막대 (DivergingRankChart)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const SECTION_HEAD = 'flex max-w-4xl flex-col gap-2'
const BLOCKS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'

type Row = readonly [name: string, value: number, tone?: DivergingRankTone, isHighlighted?: boolean]

const toSide = (title: string, rows: readonly Row[]): DivergingRankSide => ({
    title,
    items: rows.map(([name, value, tone, isHighlighted], index): DivergingRankItem => ({
        id: `${index}-${name}`,
        name,
        value,
        tone,
        isHighlighted,
    })),
})

const SMALL_TITLE = '100억원 이하'
const LARGE_TITLE = '100억원 초과'

const REPORT_LEFT = toSide(SMALL_TITLE, [
    ['(주)이음', 23.5, 'default', true],
    ['(주)새론', 21.5, 'default', true],
    ['(주)아라', 17.2],
    ['(주)누리', 16.8],
    ['(주)가나다', 15.2],
    ['(주)파랑', 14.2],
    ['(주)다솜', 9.8],
    ['(주)푸름', 7.9],
    ['(주)온누리', 7.5],
    ['(주)해오름', 6.8],
    ['평균', 4.5, 'average'],
    ['프롬엑스테크', 8.2, 'subject'],
])
const REPORT_RIGHT = toSide(LARGE_TITLE, [
    ['(주)비상', 18.8],
    ['(주)하늘', 17.6],
    ['(주)드림', 15.1],
    ['(주)온새미로', 12.8],
    ['(주)가나다', 10.9],
    ['(주)솔빛', 9.5],
    ['(주)바른', 8.2],
    ['(주)초롱', 6.1],
    ['(주)미래', 5.4],
    ['(주)별빛', 4.8],
    ['평균', 2.5, 'average'],
])

const SHORT_LEFT = toSide(SMALL_TITLE, [
    ['(주)이음', 23.5, 'default', true],
    ['(주)아라', 17.2],
    ['(주)누리', 9.8],
    ['평균', 4.5, 'average'],
    ['프롬엑스테크', 8.2, 'subject'],
])
const SHORT_RIGHT = toSide(LARGE_TITLE, [
    ['(주)비상', 18.8],
    ['(주)드림', 12.8],
    ['평균', 2.5, 'average'],
])

const LONG_NAME_LEFT = toSide(SMALL_TITLE, [
    ['(주)이음', 23.5, 'default', true],
    ['(주)한국첨단소재기술연구개발', 18.4],
    ['(주)글로벌바이오헬스케어솔루션즈', 2.1],
    ['평균', 4.5, 'average'],
])
const LONG_NAME_RIGHT = toSide(LARGE_TITLE, [
    ['(주)대한스마트모빌리티인더스트리', 18.8],
    ['(주)하늘', 17.6],
    ['(주)미래에너지플랫폼테크놀로지', 1.4],
    ['평균', 2.5, 'average'],
])
const SHORT_BAR_LEFT = toSide(SMALL_TITLE, [
    ['(주)이음', 23.5, 'default', true],
    ['(주)아라', 3.1],
    ['(주)솔', 1.2],
    ['평균', 0.9, 'average'],
    ['프롬엑스테크', 1.5, 'subject'],
])
const SHORT_BAR_RIGHT = toSide(LARGE_TITLE, [
    ['(주)비상', 18.8],
    ['(주)드림', 2.4],
    ['(주)별', 0.6],
    ['평균', 0.8, 'average'],
])
const MAX_STAR_LEFT = toSide(SMALL_TITLE, [
    ['(주)이음', 100, 'default', true],
    ['(주)새론', 100, 'default', true],
    ['(주)아라', 64.2],
    ['평균', 31.5, 'average'],
])
const MAX_STAR_RIGHT = toSide(LARGE_TITLE, [
    ['(주)비상', 1234.5, 'default', true],
    ['(주)하늘', 987.6, 'default', true],
    ['(주)드림', 402.1],
    ['평균', 210.3, 'average'],
])
const NEGATIVE_LEFT = toSide(SMALL_TITLE, [
    ['(주)이음', 12.3, 'default', true],
    ['(주)아라', 0],
    ['(주)누리', -3.2],
    ['평균', -0.8, 'average'],
    ['프롬엑스테크', -12.5, 'subject'],
])
const NEGATIVE_RIGHT = toSide(LARGE_TITLE, [
    ['(주)비상', -1.2],
    ['(주)하늘', -4.8],
    ['평균', -2.5, 'average'],
])
const MANY_LEFT = toSide(
    SMALL_TITLE,
    Array.from({length: 15}, (_, index): Row => [`(주)기업${index + 1}`, 30 - index * 1.8, 'default', index < 3]),
)
const MANY_RIGHT = toSide(
    LARGE_TITLE,
    Array.from({length: 6}, (_, index): Row => [`(주)회사${index + 1}`, 20 - index * 3]),
)
const TIE_LEFT = toSide(SMALL_TITLE, [
    ['(주)이음', 15.2, 'default', true],
    ['(주)새론', 15.2, 'default', true],
    ['(주)아라', 15.2],
    ['평균', 15.2, 'average'],
])
const LONG_NUMBER_LEFT = toSide(SMALL_TITLE, [
    ['(주)이음', 12345.6, 'default', true],
    ['(주)새론', 9876.5],
    ['평균', 1234.5, 'average'],
])
const LONG_NUMBER_RIGHT = toSide(LARGE_TITLE, [
    ['(주)비상', 1234567.8],
    ['(주)하늘', 654321.1],
    ['평균', 98765.4, 'average'],
])
const EMPTY_SIDE = toSide(LARGE_TITLE, [])

const USAGE_CODE = `import {DivergingRankChart} from '@/components/custom/diverging-rank-chart'

<DivergingRankChart
  ariaLabel="성장률 우수기업 — 매출 100억원 이하 · 100억원 초과 기업의 성장률 순위"
  left={{
    title: '100억원 이하',
    items: [
      {id: 'c1', name: '(주)이음', value: 23.5, isHighlighted: true},
      {id: 'avg', name: '평균', value: 4.5, tone: 'average'},
      {id: 'me', name: '프롬엑스테크', value: 8.2, tone: 'subject'},
    ],
  }}
  right={{title: '100억원 초과', items: rightItems}}
/>`

const DATA_CODE = `// 행 순서는 받은 순서대로 그린다(정렬하지 않음).
// 평균 행은 tone: 'average', 조회 기업 행은 tone: 'subject', 고성장 기업은 isHighlighted: true.
const toSide = (group: GrowthRankGroup): DivergingRankSide => ({
  title: group.label,
  items: [
    ...group.companies.map((company) => ({
      id: company.companyId,
      name: company.companyName,
      value: company.growthRate,
      isHighlighted: company.isHighGrowth,
    })),
    {id: 'average', name: '평균', value: group.averageRate, tone: 'average'},
    ...(group.subject ? [{id: 'subject', name: group.subject.companyName, value: group.subject.growthRate, tone: 'subject'}] : []),
  ],
})`

const CHOICE_COLUMNS = [
    {key: 'case', header: '비교할 값', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'diverging',
        cells: [
            '서로 다른 두 순위 목록을 좌우로 펼침',
            <code key="c">DivergingRankChart</code>,
            '행 수 · 순서 · 최댓값이 목록마다 따로입니다. 같은 줄의 양쪽 행은 짝이 아닙니다.',
        ],
    },
    {
        key: 'butterfly',
        cells: [
            '같은 항목의 두 값을 마주 놓음',
            <Link key="c" href="/component-guide/butterfly-bar-chart" className={LINK_CLASS}>
                ButterflyBarChart
            </Link>,
            '가운데 항목 이름을 공유하고 한 줄이 한 항목의 두 값입니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['DivergingRankChart', 'left', '가운데에서 왼쪽으로 자라는 목록입니다.', '-', 'DivergingRankSide'],
    ['DivergingRankChart', 'right', '가운데에서 오른쪽으로 자라는 목록입니다.', '-', 'DivergingRankSide'],
    ['DivergingRankChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
    ['DivergingRankChart', 'valueSuffix', '값 뒤에 붙는 단위 글자입니다.', "'%'", 'string'],
    [
        'DivergingRankChart',
        'valueFractionDigits',
        '값 글자 · 숨김 표의 소수 자릿수입니다. 0~6 으로 맞춥니다.',
        '1',
        'number',
    ],
    [
        'DivergingRankChart',
        'highlightLabel',
        '별 범례 · 숨김 표 열 이름입니다. 별 행이 하나도 없으면 범례를 그리지 않습니다.',
        "'고성장 기업'",
        'string',
    ],
    [
        'DivergingRankChart',
        'showLegend',
        '차트 위 별 범례입니다. 카드 제목 줄에 범례를 따로 둘 때 끕니다.',
        'true',
        'boolean',
    ],
    ['DivergingRankChart', 'emptyText', '목록이 비었을 때 칸에 적는 글자입니다.', "'자료가 없습니다.'", 'string'],
    ['DivergingRankChart', 'className', '바깥 div 에 덧붙일 클래스입니다. 그 밖의 div 속성도 받습니다.', '-', 'string'],
    ['DivergingRankLegend', 'label', '범례 글자입니다.', "'고성장 기업'", 'string'],
    ['DivergingRankLegend', 'className', '범례에 덧붙일 클래스입니다.', '-', 'string'],
    ['DivergingRankSide', 'title', '목록 제목입니다.', '-', 'string'],
    ['DivergingRankSide', 'items', '행 목록입니다. 받은 순서대로 위에서부터 그립니다.', '-', 'DivergingRankItem[]'],
    ['DivergingRankItem', 'id', '행을 구분하는 고유 값입니다.', '-', 'string'],
    ['DivergingRankItem', 'name', '기업 이름입니다.', '-', 'string'],
    ['DivergingRankItem', 'value', '값입니다.', '-', 'number'],
    [
        'DivergingRankItem',
        'tone',
        '막대 색입니다. average 는 평균, subject 는 조회 기업, default 는 목록 색입니다.',
        "'default'",
        "'default' | 'average' | 'subject'",
    ],
    ['DivergingRankItem', 'isHighlighted', '값 바깥에 별을 붙입니다.', '-', 'boolean'],
    [
        'DivergingRankChartSkeleton',
        'label',
        '불러오는 중에 화면 낭독기가 읽을 말입니다.',
        "'차트 데이터를 불러오는 중입니다.'",
        'string',
    ],
] as const

const SPECIAL_CASES = [
    {
        title: '막대가 끝까지 찼을 때',
        description:
            '가장 큰 막대도 값 · 별 자리를 뺀 폭까지만 자라 차트 밖으로 나가거나 잘리지 않습니다. 같은 최댓값이 여럿이면 모두 같은 길이입니다.',
        left: MAX_STAR_LEFT,
        right: MAX_STAR_RIGHT,
    },
    {
        title: '막대가 이름보다 짧을 때',
        description:
            '막대 안 이름은 흰 글자라 막대보다 길면 보이지 않습니다. 이름이 들어가지 않는 줄은 이름을 막대 밖으로 옮깁니다.',
        left: SHORT_BAR_LEFT,
        right: SHORT_BAR_RIGHT,
    },
    {
        title: '이름이 막대보다 길 때',
        description:
            '막대 밖에서도 자리가 모자라면 말줄임(…)하고 전체 이름은 title · 숨김 표에 둡니다. 폭은 그릴 때 · 크기가 바뀔 때마다 다시 잽니다.',
        left: LONG_NAME_LEFT,
        right: LONG_NAME_RIGHT,
    },
    {
        title: '0 · 음수 성장률',
        description: '막대를 그리지 않고 값만 “-3.2%”처럼 적습니다. 반대쪽으로 뻗으면 옆 목록을 침범하기 때문입니다.',
        left: NEGATIVE_LEFT,
        right: NEGATIVE_RIGHT,
    },
    {
        title: '행 수가 다를 때',
        description: '행 수는 목록마다 따로라 짧은 쪽 아래는 비어 있습니다.',
        left: MANY_LEFT,
        right: MANY_RIGHT,
    },
    {
        title: '한쪽 목록이 비었을 때',
        description: '빈 칸에 emptyText 를 적고 숨김 표에도 같은 글자를 둡니다.',
        left: SHORT_LEFT,
        right: EMPTY_SIDE,
    },
    {
        title: '같은 값',
        description: '같은 값은 같은 길이로 그리고 받은 순서를 지킵니다.',
        left: TIE_LEFT,
        right: SHORT_RIGHT,
    },
    {
        title: '긴 숫자',
        description: '값 글자가 길면 막대가 그만큼 줄어 값 글자가 칸 밖으로 나가지 않습니다. 천 단위 쉼표를 넣습니다.',
        left: LONG_NUMBER_LEFT,
        right: LONG_NUMBER_RIGHT,
    },
] as const

const DivergingRankChartGuidePage = () => (
    <GuidePageShell
        title="양쪽 순위 막대 (DivergingRankChart)"
        description="가운데 선을 두고 서로 다른 두 순위 목록을 좌우로 펼치는 막대 그래프입니다. 평균 · 조회 기업 행은 색으로, 고성장 기업은 별로 구분합니다."
    >
        <BaseCard>
            <section aria-labelledby="drc-basic" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="drc-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>left</code> · <code>right</code> 에 제목과 행 목록을 넘깁니다. 행 순서는 받은 그대로
                        그리며 정렬하지 않습니다. 막대 길이는 그 목록의 최댓값 기준이라 두 목록은 서로 독립입니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex min-w-0 flex-col gap-4 rounded-sm border p-6">
                    <h3 className="typo-title-m-bold text-foreground">성장률 우수기업</h3>
                    <DivergingRankChart
                        ariaLabel="성장률 우수기업 — 매출 100억원 이하 · 100억원 초과 기업의 성장률 순위"
                        left={REPORT_LEFT}
                        right={REPORT_RIGHT}
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="drc-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="drc-variants" className="typo-h4-bold">
                        상태 예시
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        이름이 가려지거나 값 글자가 칸을 넘을 수 있는 경우는 컴포넌트가 처리합니다.
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
                                    <DivergingRankChart ariaLabel={item.title} left={item.left} right={item.right} />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            이 컴포넌트에는 <code>isLoading</code> 이 없습니다. 값을 기다리는 동안 같은 자리에{' '}
                            <code>DivergingRankChartSkeleton</code> 을 둡니다.
                        </p>
                        <div className="grid gap-6 xl:grid-cols-2">
                            <DivergingRankChartSkeleton label="성장률 우수기업을 불러오는 중입니다." />
                            <DivergingRankChart ariaLabel="성장률 우수기업" left={SHORT_LEFT} right={SHORT_RIGHT} />
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="drc-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="drc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">비교할 값의 짜임으로 고릅니다.</p>
                </div>
                <Table caption="좌우 막대 차트 선택 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="drc-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="drc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 목록마다 숨김
                        표(<code>caption</code> · <code>th scope</code>)가 있어 화면 낭독기가 표로 읽습니다[5.1.1].
                    </li>
                    <li>
                        평균 · 조회 기업은 색과 함께 숨김 표 이름 뒤에 “(평균)” · “(조회 기업)”이 붙고, 별은{' '}
                        <code>highlightLabel</code> 열로 읽힙니다. 색만으로 전하지 않습니다[5.3.1].
                    </li>
                    <li>왼쪽 목록은 DOM 에서도 가운데 → 바깥 순서를 맞춰 화면 순서와 읽기 순서가 같습니다[7.3.1].</li>
                    <li>막대 안 흰 글자는 본문 대비 4.5:1 을 넘는 색 위에만 놓입니다[5.3.3].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="drc-props" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="drc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>left</code> · <code>right</code> · <code>ariaLabel</code> 이 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="DivergingRankChart Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default DivergingRankChartGuidePage
