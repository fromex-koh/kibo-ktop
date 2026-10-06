// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {
    ComparisonRadarChart,
    ComparisonRadarLegend,
    type ComparisonRadarItem,
} from '@/components/custom/comparison-radar-chart'
import {SECTOR_COMPARISON_RADAR_STYLE} from '@/components/custom/comparison-radar-style'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '부문별 비교 (ComparisonRadarChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

const REPORT_DATA: ComparisonRadarItem[] = [
    {id: 'sales-growth', label: '매출액증가율', primaryValue: 80, comparisonValue: 60},
    {id: 'operating-margin', label: '영업이익율', primaryValue: 65, comparisonValue: 55},
    {id: 'equity-ratio', label: '자기자본비율', primaryValue: 70, comparisonValue: 60},
    {id: 'asset-turnover', label: '총자본회전율', primaryValue: 55, comparisonValue: 50},
    {id: 'cash-flow', label: '현금흐름', primaryValue: 60, comparisonValue: 45},
]

const SIX_AXIS_DATA: ComparisonRadarItem[] = [
    {id: 'growth', label: '성장성', primaryValue: 52, comparisonValue: 60},
    {id: 'profitability', label: '수익성', primaryValue: 78, comparisonValue: 68},
    {id: 'stability', label: '안정성', primaryValue: 72, comparisonValue: 61},
    {id: 'activity', label: '활동성', primaryValue: 66, comparisonValue: 45},
    {id: 'liquidity', label: '유동성', primaryValue: 58, comparisonValue: 57},
    {id: 'cash-flow', label: '현금흐름', primaryValue: 38, comparisonValue: 55},
]

const EDGE_DATA: ComparisonRadarItem[] = [
    {id: 'max', label: '매출액증가율', primaryValue: 100, comparisonValue: 100},
    {id: 'zero', label: '영업이익율', primaryValue: 0, comparisonValue: 30},
    {id: 'over', label: '자기자본비율', primaryValue: 140, comparisonValue: 60},
    {id: 'minus', label: '총자본회전율', primaryValue: -20, comparisonValue: 50},
    {id: 'normal', label: '현금흐름', primaryValue: 60, comparisonValue: 45},
]

const USAGE_CODE = `import {ComparisonRadarChart, ComparisonRadarLegend} from '@/components/custom/comparison-radar-chart'
import {SECTOR_COMPARISON_RADAR_STYLE} from '@/components/custom/comparison-radar-style'

// 범례는 카드 머리 줄에 따로 두고(차트의 showLegend 는 묶음에서 꺼져 있다), 차트는 모양 묶음을 펼쳐 쓴다.
<ComparisonRadarLegend
  primaryLabel="조회기업"
  comparisonLabel="업종평균"
  primaryColor={SECTOR_COMPARISON_RADAR_STYLE.primaryColor}
  comparisonColor={SECTOR_COMPARISON_RADAR_STYLE.comparisonColor}
  comparisonFillOpacity={SECTOR_COMPARISON_RADAR_STYLE.comparisonFillOpacity}
/>

<ComparisonRadarChart
  {...SECTOR_COMPARISON_RADAR_STYLE}
  data={data}
  primaryLabel="조회기업"
  comparisonLabel="업종평균"
  ariaLabel="부문별 비교 — 조회기업과 업종평균"
/>`

const PLAIN_CODE = `// 묶음 없이 쓰면 다각형 격자 · 점선 비교 계열 · 차트 위 범례가 기본이다.
<ComparisonRadarChart data={data} primaryLabel="조회기업" comparisonLabel="업종평균" ariaLabel="부문별 비교" />`

const DATA_CODE = `// API 의 부문별 점수(0~100)를 연결한다. 첫 항목이 맨 위, 다음부터 시계 방향이다.
// 0 미만 · 100 초과 값은 0 · 100 으로 맞춰 그린다.
const data: ComparisonRadarItem[] = sectorsFromApi.map((item) => ({
  id: item.code,
  label: item.name,
  primaryValue: item.companyScore,
  comparisonValue: item.industryAverage,
}))`

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'comparison',
        cells: [
            '축 수가 정해지지 않은 두 계열 비교',
            <code key="component">ComparisonRadarChart</code>,
            '항목 수만큼 축이 나뉩니다. 격자 · 색 · 크기를 props 로 바꿀 수 있습니다.',
        ],
    },
    {
        key: 'grade',
        cells: [
            '세 축 등급 점수(평가대상 · 비교 기준)',
            <Link key="component" href="/component-guide/grade-radar-chart" className={LINK_CLASS}>
                GradeRadarChart
            </Link>,
            '이 컴포넌트에 삼각형 모양 설정을 입혀 둔 것이라 점수만 넘기면 됩니다.',
        ],
    },
] as const

const STYLE_COLUMNS = [
    {key: 'name', header: '모양 묶음', align: 'start', rowHeader: true},
    {key: 'file', header: '위치', align: 'start'},
    {key: 'note', header: '용도', align: 'start', wrap: true},
] as const

const STYLE_ROWS = [
    {
        key: 'sector',
        cells: [
            <code key="name">SECTOR_COMPARISON_RADAR_STYLE</code>,
            <code key="file">comparison-radar-style.ts</code>,
            '동심원 4고리 · 반지름 96 · 축 이름 14 · 면 반투명 · 속 빈 점. 부문별 비교 카드용입니다.',
        ],
    },
    {
        key: 'tech-index',
        cells: [
            <code key="name">TECH_INDEX_RADAR_STYLE</code>,
            <code key="file">tech-index-radar-style.ts</code>,
            '같은 구조에 반지름 70 · 축 이름 12 · 말풍선 없음. 세부지표별 상대비교 카드용입니다.',
        ],
    },
] as const

const PROPS_COLUMNS = [
    {key: 'prop', header: 'Prop', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start'},
    {key: 'default', header: '기본값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

type PropRow = readonly [name: string, note: string, defaultValue: string, type: string]

const toRows = (items: readonly PropRow[]) =>
    items.map(([name, note, defaultValue, type]) => ({
        key: name,
        cells: [
            <code key="prop">{name}</code>,
            <code key="type">{type}</code>,
            <code key="default">{defaultValue}</code>,
            note,
        ],
    }))

const DATA_ROWS = toRows([
    ['data', '지표별 고유 id · 표시명과 두 계열의 0~100 값입니다.', '-', 'ComparisonRadarItem[]'],
    ['primaryLabel', '주 계열 이름입니다. 범례 · 툴팁 · 숨김 표에 쓰입니다.', '-', 'string'],
    ['comparisonLabel', '비교 계열 이름입니다. 주지 않으면 주 계열만 그립니다.', 'undefined', 'string'],
    ['ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
])

const STYLE_PROP_ROWS = toRows([
    [
        'primaryColor · comparisonColor',
        '두 계열의 색입니다. 토큰 변수를 씁니다.',
        "'var(--ds-chart-1)' · 'var(--ds-chart-5)'",
        'string',
    ],
    [
        'primaryFillOpacity · comparisonFillOpacity',
        '두 계열 면의 투명도(0~1)입니다. 겹친 곳이 진해집니다.',
        '0.16 · 0.25',
        'number',
    ],
    [
        'comparisonAppearance',
        "'dashed' 는 점선 테두리와 점, 'filled' 는 점선 테두리에 면을 채우고 점을 두지 않습니다.",
        "'dashed'",
        "'dashed' | 'filled'",
    ],
    [
        'dotAppearance',
        "주 계열 꼭짓점 모양입니다. 'hollow' 는 흰 면에 계열 색 테두리입니다.",
        "'filled'",
        "'filled' | 'hollow'",
    ],
    ['showDots', '꼭짓점 점 표시 여부입니다.', 'true', 'boolean'],
    [
        'gridType',
        "격자 고리 모양입니다. 'circle' 은 동심원입니다. 로딩 스켈레톤 모양도 따라갑니다.",
        "'polygon'",
        "'polygon' | 'circle'",
    ],
    ['gridColor', '격자 색입니다.', "'var(--ds-subtle-2)'", 'string'],
    ['ringCount', '격자 눈금 수입니다. 5 이면 고리 4개입니다.', '5', 'number'],
    [
        'direction',
        "축 방향입니다. 첫 축은 늘 맨 위이고 'counterclockwise' 는 두 번째 축이 왼쪽에 옵니다.",
        "'clockwise'",
        "'clockwise' | 'counterclockwise'",
    ],
    [
        'tickFontSize · tickFontWeight · tickColor',
        '축 이름의 글자 크기 · 굵기 · 색입니다.',
        "12 · 600 · 'var(--ds-foreground)'",
        'number · number · string',
    ],
    ['outerRadius', '반지름입니다. 숫자는 px, 문자열은 그릴 자리 대비 비율입니다.', "'72%'", 'number | string'],
    ['centerY', '중심 세로 위치입니다. 숫자는 px, 문자열은 비율입니다.', '가운데', 'number | string'],
    ['margin', '차트 여백입니다.', '{top: 20, right: 48, bottom: 20, left: 48}', '{top?; right?; bottom?; left?}'],
    [
        'chartClassName',
        '차트 칸 크기 클래스입니다. 축이 적어 위아래가 남는 모양은 높이를 직접 정합니다.',
        '정사각(aspect-square)',
        'string',
    ],
])

const BEHAVIOR_PROP_ROWS = toRows([
    ['showLegend', '차트 위 범례 표시 여부입니다. 범례를 다른 자리에 두면 끕니다.', 'true', 'boolean'],
    [
        'legendAppearance',
        "범례 모양입니다. 'swatch' 는 색으로 채운 16px 견본입니다.",
        "'outline'",
        "'outline' | 'swatch'",
    ],
    ['showTooltip', '값 위에 올렸을 때의 말풍선과 강조 점입니다.', 'true', 'boolean'],
    ['animate', '처음 한 번 펼쳐지는 움직임입니다. 인쇄용 문서에서는 끕니다.', 'true', 'boolean'],
    ['isLoading', '스켈레톤을 대신 보입니다. 하이드레이션 전에는 자동으로 보입니다.', 'false', 'boolean'],
    ['loadingLabel', '불러오는 중에 화면 낭독기가 읽을 문구입니다.', "'레이더 차트를 불러오는 중입니다.'", 'string'],
    [
        'skeletonType',
        '스켈레톤 모양입니다. 기본은 gridType 과 축 수로 고릅니다.',
        'circle-radar · triangle-radar · radar',
        "'radar' | 'circle-radar' | 'triangle-radar' | 'pentagon-radar'",
    ],
])

const LEGEND_ROWS = toRows([
    [
        'primaryLabel · comparisonLabel',
        '범례 문구입니다. comparisonLabel 이 없으면 주 계열만 보입니다.',
        '- · undefined',
        'string',
    ],
    [
        'primaryColor · comparisonColor',
        '차트와 같은 색을 넘깁니다.',
        "'var(--ds-chart-1)' · 'var(--ds-chart-5)'",
        'string',
    ],
    ['comparisonFillOpacity', '비교 견본의 면 투명도입니다. 차트와 같은 값을 넘깁니다.', '0.25', 'number'],
])

const BLOCK_CLASS = 'flex flex-col gap-4 py-8 last:pb-0'
const BLOCKS_CLASS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const CASE_NAME_CLASS = 'typo-body-l-bold text-foreground'
const CASE_NOTE_CLASS = 'typo-body-m-regular text-label-foreground'

const ComparisonRadarChartGuidePage = () => (
    <GuidePageShell
        title="부문별 비교 (ComparisonRadarChart)"
        description="두 대상의 항목별 점수(0~100)를 같은 방사형 축 위에 겹쳐 비교하는 레이더 차트입니다."
    >
        <BaseCard>
            <section aria-labelledby="crc-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="crc-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        첫 항목이 맨 위, 이후 시계 방향으로 축이 놓입니다. 모양 묶음{' '}
                        <code>SECTOR_COMPARISON_RADAR_STYLE</code> 을 펼쳐 쓰고 범례는{' '}
                        <code>ComparisonRadarLegend</code> 로 따로 둡니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex max-w-96 flex-col gap-6 rounded-sm border p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="typo-body-xl-bold text-foreground">부문별 비교</h3>
                        <ComparisonRadarLegend
                            primaryLabel="조회기업"
                            comparisonLabel="업종평균"
                            primaryColor={SECTOR_COMPARISON_RADAR_STYLE.primaryColor}
                            comparisonColor={SECTOR_COMPARISON_RADAR_STYLE.comparisonColor}
                            comparisonFillOpacity={SECTOR_COMPARISON_RADAR_STYLE.comparisonFillOpacity}
                            className="ms-auto justify-end"
                        />
                    </div>
                    <ComparisonRadarChart
                        {...SECTOR_COMPARISON_RADAR_STYLE}
                        data={REPORT_DATA}
                        primaryLabel="조회기업"
                        comparisonLabel="업종평균"
                        ariaLabel="부문별 비교 — 조회기업과 업종평균"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="crc-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="crc-variants" className="typo-h4-bold">
                        모양 묶음과 기본 모양
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        반복해서 쓰는 모양은 묶음 파일에 모아 두고 펼쳐 씁니다. 모양을 바꾸려면 묶음만 고칩니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">제공되는 묶음</h3>
                        <Table caption="레이더 차트 모양 묶음" columns={STYLE_COLUMNS} rows={STYLE_ROWS} size="md" />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">묶음 없이 쓸 때</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            다각형 격자, 점선 비교 계열, 차트 위 범례가 기본입니다.
                        </p>
                        <div className="max-w-120">
                            <ComparisonRadarChart
                                data={SIX_AXIS_DATA}
                                primaryLabel="조회기업"
                                comparisonLabel="업종평균"
                                ariaLabel="기본 모양"
                            />
                        </div>
                        <CodeBlock code={PLAIN_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="crc-states" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="crc-states" className="typo-h4-bold">
                        상태와 특이한 값
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        받은 값을 그대로 넘기면 컴포넌트가 처리합니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>isLoading</code> 이거나 하이드레이션 전이면 스켈레톤을 자동으로 보입니다.{' '}
                            <code>gridType=&quot;circle&quot;</code> 는 <code>circle-radar</code>, 축이 셋이면{' '}
                            <code>triangle-radar</code>, 그 밖에는 <code>radar</code> 입니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <ChartSkeleton type="circle-radar" label="부문별 비교를 불러오는 중입니다." />
                            <ComparisonRadarChart
                                {...SECTOR_COMPARISON_RADAR_STYLE}
                                data={REPORT_DATA}
                                primaryLabel="조회기업"
                                comparisonLabel="업종평균"
                                ariaLabel="부문별 비교 — 조회기업과 업종평균"
                            />
                        </div>
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">특이한 값</h3>
                        <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-3">
                            <li className="flex flex-col gap-2">
                                <h4 className={CASE_NAME_CLASS}>범위 밖 값</h4>
                                <p className={CASE_NOTE_CLASS}>
                                    0 미만 · 100 초과 값은 0 · 100 으로 맞춰 그립니다. 140 은 바깥 고리, -20 은 가운데에
                                    닿습니다.
                                </p>
                                <ComparisonRadarChart
                                    {...SECTOR_COMPARISON_RADAR_STYLE}
                                    data={EDGE_DATA}
                                    primaryLabel="조회기업"
                                    comparisonLabel="업종평균"
                                    ariaLabel="범위 밖 값"
                                />
                            </li>
                            <li className="flex flex-col gap-2">
                                <h4 className={CASE_NAME_CLASS}>비교 계열 없음</h4>
                                <p className={CASE_NOTE_CLASS}>
                                    <code>comparisonLabel</code> 을 비우면 주 계열만 그립니다.
                                </p>
                                <ComparisonRadarChart
                                    {...SECTOR_COMPARISON_RADAR_STYLE}
                                    data={REPORT_DATA}
                                    primaryLabel="조회기업"
                                    ariaLabel="조회기업 부문별 점수"
                                />
                            </li>
                            <li className="flex flex-col gap-2">
                                <h4 className={CASE_NAME_CLASS}>축 6개</h4>
                                <p className={CASE_NOTE_CLASS}>항목 수만큼 축이 고르게 나뉩니다.</p>
                                <ComparisonRadarChart
                                    {...SECTOR_COMPARISON_RADAR_STYLE}
                                    data={SIX_AXIS_DATA}
                                    primaryLabel="조회기업"
                                    comparisonLabel="업종평균"
                                    ariaLabel="축 6개"
                                />
                            </li>
                            <li className="flex flex-col gap-2">
                                <h4 className={CASE_NAME_CLASS}>좁은 폭 (280px)</h4>
                                <p className={CASE_NOTE_CLASS}>
                                    묶음의 반지름은 고정이라 좌우 축 이름이 칸 밖 여백으로 조금 나갑니다. 이보다 좁으면
                                    <code> outerRadius</code> 를 줄입니다.
                                </p>
                                <ComparisonRadarChart
                                    {...SECTOR_COMPARISON_RADAR_STYLE}
                                    data={REPORT_DATA}
                                    primaryLabel="조회기업"
                                    comparisonLabel="업종평균"
                                    ariaLabel="좁은 폭"
                                    className="max-w-70"
                                />
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="crc-data" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="crc-data" className="typo-h4-bold">
                        데이터 연결
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        API 의 부문별 점수를 <code>ComparisonRadarItem</code> 으로 바꿔 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="crc-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="crc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        축 수와 모양을 직접 정해야 하는지로 고릅니다.
                    </p>
                </div>
                <Table
                    caption="ComparisonRadarChart · GradeRadarChart 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="crc-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="crc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        사용처는 의미 있는 <code>ariaLabel</code> 과 계열 이름만 넘기면 됩니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 붙입니다[5.1.1].
                    </li>
                    <li>
                        지표별 값을 담은 숨김 표(<code>caption</code> · <code>th scope</code>)가 함께 렌더링되어 화면
                        낭독기가 전체 수치를 읽습니다[7.3.2].
                    </li>
                    <li>두 계열은 색뿐 아니라 실선과 점선, 점 유무로도 구분하고 범례 텍스트를 함께 둡니다[5.3.1].</li>
                    <li>
                        <code>animate</code> 로 움직임을 끌 수 있습니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="crc-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="crc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> · <code>primaryLabel</code> · <code>ariaLabel</code> 이 필수입니다. 나머지{' '}
                        <code>div</code> 속성은 루트 요소에 전달됩니다.
                    </p>
                </div>
                <div className={BLOCKS_CLASS}>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">데이터</h3>
                        <Table
                            caption="ComparisonRadarChart 데이터 Props"
                            columns={PROPS_COLUMNS}
                            rows={DATA_ROWS}
                            size="md"
                        />
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>ComparisonRadarItem</code>:{' '}
                            <code>{'{id: string; label: string; primaryValue: number; comparisonValue?: number}'}</code>
                        </p>
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">모양</h3>
                        <Table
                            caption="ComparisonRadarChart 모양 Props"
                            columns={PROPS_COLUMNS}
                            rows={STYLE_PROP_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">동작과 상태</h3>
                        <Table
                            caption="ComparisonRadarChart 동작 Props"
                            columns={PROPS_COLUMNS}
                            rows={BEHAVIOR_PROP_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className="typo-title-m-bold text-foreground">ComparisonRadarLegend</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            차트 밖에 두는 색 견본 범례입니다. <code>div</code> 속성을 받습니다.
                        </p>
                        <Table
                            caption="ComparisonRadarLegend Props"
                            columns={PROPS_COLUMNS}
                            rows={LEGEND_ROWS}
                            size="md"
                        />
                    </div>
                </div>
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ComparisonRadarChartGuidePage
