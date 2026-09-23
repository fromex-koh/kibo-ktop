// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
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
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '양쪽 순위 막대 (DivergingRankChart)'}

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

// K-BIGx 보고서 "성장률 우수기업" 카드와 같은 값이다.
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

// 특이 케이스
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
// 이름은 짧아도 값이 작아 막대가 이름보다 짧은 경우 — 흰 이름을 막대 안에 두면 막대가 덮지 못한 부분이 흰 카드 바탕 위에 놓여 보이지 않는다.
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
// 최댓값 막대에 값 · 별이 함께 붙는 경우 — 같은 최댓값 여럿 · 긴 값(100.0% · 1,234.5%) · 별 표시.
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
      // …
      {id: 'avg', name: '평균', value: 4.5, tone: 'average'},
      {id: 'me', name: '프롬엑스테크', value: 8.2, tone: 'subject'},
    ],
  }}
  right={{title: '100억원 초과', items: [/* … */]}}
/>`

const DATA_CODE = `// [프론트엔드 연동] 구간별 순위 목록을 그대로 넘긴다 — 행 순서는 받은 순서대로 그린다(정렬하지 않음).
// 평균 행은 tone: 'average', 조회 기업 행은 tone: 'subject', 고성장 기업은 isHighlighted: true.
const toSide = (group: GrowthRankGroup): DivergingRankSide => ({
  title: group.label, // '100억원 이하'
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

const SHAPE_RULES = [
    '오른쪽 위 별 범례(★ 고성장 기업, 14 Regular · gray.500) 아래 16 에 두 목록 제목(14 Bold · gray.700)이 옵니다. 왼쪽 제목은 가운데 쪽으로 붙습니다.',
    '행은 높이 24 · 사이 16, 두 목록 사이 24 입니다. 막대는 가운데에서 바깥으로 자랍니다 — 왼쪽 navy.500 · 오른쪽 blue.500 · 평균 purple.600 · 조회 기업 success.500(막대 안 이름이 흰 11px 이라 본문 대비 4.5:1 을 넘는 색입니다).',
    '기업 이름은 막대 안 가운데 쪽 끝에서 8(11 Medium · 흰색), 값은 막대 바깥 끝에서 4(11 Regular · gray.500)입니다. 고성장 기업은 값 바깥에 16 별(warning.300)이 붙습니다.',
    '막대 길이는 그 목록의 최댓값 기준입니다(두 목록은 서로 독립). 칸 끝에 값 자리 60 을 늘 남겨 가장 긴 막대의 값도 칸 안에 들어옵니다.',
    '두 목록의 행 수 · 순서는 따로입니다 — 같은 줄의 왼쪽 · 오른쪽 기업은 서로 관계가 없습니다.',
] as const

const PROPS_ITEMS = [
    ['DivergingRankChart', 'left', '가운데에서 왼쪽으로 자라는 목록(제목 · 행)입니다.', '-', 'DivergingRankSide'],
    ['DivergingRankChart', 'right', '가운데에서 오른쪽으로 자라는 목록(제목 · 행)입니다.', '-', 'DivergingRankSide'],
    ['DivergingRankChart', 'valueSuffix', '값 뒤에 붙는 단위 글자입니다.', "'%'", 'string'],
    ['DivergingRankChart', 'valueFractionDigits', '값 글자 · 숨김 표의 소수 자릿수입니다.', '1', 'number'],
    [
        'DivergingRankChart',
        'highlightLabel',
        '별 범례 · 숨김 표 열 이름입니다. 별 행이 없으면 범례를 그리지 않습니다.',
        "'고성장 기업'",
        'string',
    ],
    [
        'DivergingRankChart',
        'showLegend',
        '차트 위 별 범례입니다. 카드 제목 줄에 범례를 두는 화면(보고서)에서는 끄고 DivergingRankLegend 를 그 자리에 둡니다.',
        'true',
        'boolean',
    ],
    ['DivergingRankChart', 'emptyText', '목록이 비었을 때 칸에 적는 글자입니다.', "'자료가 없습니다.'", 'string'],
    [
        'DivergingRankLegend',
        'label · className',
        '차트 밖(카드 제목 줄 등)에 두는 별 범례입니다.',
        "'고성장 기업'",
        'string',
    ],
    ['DivergingRankChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
    ['DivergingRankSide', 'title', '목록 제목입니다(예: 100억원 이하).', '-', 'string'],
    ['DivergingRankSide', 'items', '행 목록 — 받은 순서대로 위에서부터 그립니다.', '-', 'DivergingRankItem[]'],
    ['DivergingRankItem', 'id · name · value', '행 식별자 · 기업 이름 · 값입니다.', '-', 'string · string · number'],
    [
        'DivergingRankItem',
        'tone',
        '막대 색 — 기본(목록 색) · 평균(보라) · 조회 기업(초록)입니다.',
        "'default'",
        "'default' | 'average' | 'subject'",
    ],
    ['DivergingRankItem', 'isHighlighted', '고성장 기업 별 표시입니다.', 'false', 'boolean'],
    ['DivergingRankChartSkeleton', 'label', '불러오는 중 상태의 숨김 안내 글자입니다.', "'차트 데이터를 …'", 'string'],
] as const

const SPECIAL_CASES = [
    {
        title: '막대가 끝까지 찼을 때 (값 · 별)',
        description:
            '가장 큰 값의 막대는 목록 폭에서 바깥쪽 60 을 뺀 만큼까지만 자랍니다. 비워 둔 60 에 값(11 Regular)과 고성장 기업 별(16)이 간격 4 로 붙어, 막대가 끝까지 차도 값 · 별이 차트 밖으로 나가거나 잘리지 않습니다. 값이 길어 60 을 넘으면(1,234.5% + 별) 글자를 밀어내지 않고 막대가 그만큼 줄어듭니다. 같은 최댓값이 여럿이면 모두 같은 길이로 끝까지 찹니다.',
        left: MAX_STAR_LEFT,
        right: MAX_STAR_RIGHT,
    },
    {
        title: '막대가 이름보다 짧을 때 (흰 글자 대비)',
        description:
            '막대 안 이름은 흰 글자라, 막대가 이름보다 짧으면 넘친 글자가 흰 카드 바탕 위에 놓여 보이지 않습니다. 그래서 그릴 때마다 이름 폭(글자 폭 + 좌우 여백)과 막대 폭을 재서, 이름이 다 들어가지 않는 줄은 이름을 막대 밖(막대와 값 사이)에 진한 글자(gray.700)로 옮깁니다. 이름이 짧아도 값이 작으면(평균 0.9% · 프롬엑스테크 1.5%) 같은 규칙이 적용되고, 강조 줄(평균 · 조회기업)도 똑같습니다. 창 폭이 바뀌어 막대가 줄어들면 다시 재서 바꿉니다.',
        left: SHORT_BAR_LEFT,
        right: SHORT_BAR_RIGHT,
    },
    {
        title: '이름이 막대보다 길 때',
        description:
            '막대 안에 이름이 다 들어가지 않으면 이름을 막대 밖(막대와 값 사이, gray.700)으로 뺍니다. 막대 폭은 화면 폭에 따라 달라 그릴 때 · 크기가 바뀔 때마다 다시 잽니다. 밖에서도 자리가 모자라면 말줄임(…)하고 전체 이름은 title · 숨김 표에 둡니다.',
        left: LONG_NAME_LEFT,
        right: LONG_NAME_RIGHT,
    },
    {
        title: '0 · 음수 성장률',
        description:
            '0 · 음수는 막대를 그리지 않고 값만 “-3.2%”처럼 적습니다(막대를 반대로 뻗으면 옆 목록을 침범합니다). 이름은 막대 밖으로 나갑니다. 목록이 모두 음수면 막대 없이 이름과 값만 남습니다.',
        left: NEGATIVE_LEFT,
        right: NEGATIVE_RIGHT,
    },
    {
        title: '목록이 길 때 · 행 수가 다를 때 (15 · 6)',
        description:
            '행 수는 목록마다 따로라 짧은 쪽 아래는 비어 있습니다. 행이 많으면 카드가 아래로 길어집니다(스크롤 없이 모두 그림).',
        left: MANY_LEFT,
        right: MANY_RIGHT,
    },
    {
        title: '한쪽 목록이 비었을 때',
        description: '빈 목록 칸에는 “자료가 없습니다.”를 적고, 숨김 표에도 같은 글자를 둡니다.',
        left: SHORT_LEFT,
        right: EMPTY_SIDE,
    },
    {
        title: '같은 값 (동률)',
        description: '같은 값은 같은 길이로 그리고 받은 순서를 지킵니다 — 동률 순위 표시는 API 순서를 따릅니다.',
        left: TIE_LEFT,
        right: SHORT_RIGHT,
    },
    {
        title: '긴 숫자',
        description:
            '값 글자가 값 자리 60 보다 길면 막대가 그만큼 줄어들어 값 글자는 칸 밖으로 나가지 않습니다. 천 단위 쉼표를 넣습니다.',
        left: LONG_NUMBER_LEFT,
        right: LONG_NUMBER_RIGHT,
    },
] as const

const DivergingRankChartGuidePage = () => (
    <GuidePageShell
        title="양쪽 순위 막대 (DivergingRankChart)"
        description="가운데 선을 두고 서로 다른 두 순위 목록을 좌우로 펼쳐 그립니다. 평균 · 조회 기업 행은 색으로 구분하고 고성장 기업에 별을 붙입니다."
    >
        <BaseCard>
            <section aria-labelledby="drc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="drc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서의 성장률 우수기업 카드 그래프입니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex min-w-0 flex-col gap-3 rounded-sm border p-6">
                    <h3 className="typo-body-xl-bold">성장률 우수기업</h3>
                    <DivergingRankChart
                        ariaLabel="성장률 우수기업 — 매출 100억원 이하 · 100억원 초과 기업의 성장률 순위"
                        left={REPORT_LEFT}
                        right={REPORT_RIGHT}
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="drc-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="drc-shape" className="typo-h4-bold">
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
            <section aria-labelledby="drc-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="drc-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        이름이 가려지거나 값 글자가 칸을 넘어 모양이 깨질 수 있는 경우입니다. 모두 컴포넌트가
                        처리합니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 xl:grid-cols-2">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
                            <DivergingRankChart ariaLabel={item.title} left={item.left} right={item.right} />
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="drc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="drc-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은 <code className="font-mono">DivergingRankChartSkeleton</code>을 같은
                        자리에 둡니다. 범례 · 두 목록 제목 · 가운데에서 바깥으로 줄어드는 막대 · 값 자리의 짜임이
                        같습니다.
                    </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <DivergingRankChartSkeleton label="성장률 우수기업을 불러오는 중입니다." />
                    </div>
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <DivergingRankChart ariaLabel="성장률 우수기업" left={SHORT_LEFT} right={SHORT_RIGHT} />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="drc-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="drc-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        매출 구간별 순위 목록을 목록(제목 · 행)으로 바꿔 왼쪽 · 오른쪽에 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="DivergingRankChart 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="drc-props" className="flex flex-col gap-4">
                <h2 id="drc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="DivergingRankChart 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default DivergingRankChartGuidePage
