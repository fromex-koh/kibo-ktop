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
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '부문별 비교 (ComparisonRadarChart)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

// K-BIGx 기업혁신성장 보고서 "부문별 비교" 카드와 같은 항목 · 값이다.
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

// 범례는 카드 머리 줄(제목 오른쪽)에 따로 두고, 차트는 보고서 모양 묶음을 펼쳐 쓴다.
<Card
  title="부문별 비교"
  aside={
    <ComparisonRadarLegend
      primaryLabel="조회기업"
      comparisonLabel="업종평균"
      primaryColor={SECTOR_COMPARISON_RADAR_STYLE.primaryColor}
      comparisonColor={SECTOR_COMPARISON_RADAR_STYLE.comparisonColor}
      comparisonFillOpacity={SECTOR_COMPARISON_RADAR_STYLE.comparisonFillOpacity}
    />
  }
>
  <ComparisonRadarChart
    {...SECTOR_COMPARISON_RADAR_STYLE}
    data={data}
    primaryLabel="조회기업"
    comparisonLabel="업종평균"
    ariaLabel="부문별 비교 — 조회기업과 업종평균"
  />
</Card>`

const DATA_CODE = `// [프론트엔드 연동] API 의 부문별 점수(0~100)를 연결한다. 첫 항목이 맨 위, 다음부터 시계 방향이다.
// 100 을 넘거나 0 보다 작으면 끝(0 · 100)으로 맞춰 그린다.
const data: ComparisonRadarItem[] = sectorsFromApi.map((item) => ({
  id: item.code,
  label: item.name,
  primaryValue: item.companyScore,
  comparisonValue: item.industryAverage,
}))`

const SHAPE_RULES = [
    '차트 칸 높이 248 · 가운데 동심원 4고리(반지름 96 · gray.100)와 가운데서 뻗는 축 선입니다. 축은 첫 항목이 맨 위, 이후 시계 방향입니다.',
    '조회기업은 blue.500 실선(2.5) · 반투명 면(10%) · 속이 빈 점(지름 8)입니다. 업종평균은 blue.200 점선 · 반투명 면(50%)이고 점이 없습니다. 두 면이 모두 반투명이라 겹친 곳이 한 단계 진해집니다.',
    '축 이름은 14 Regular(gray.700)입니다. 범례(16 견본 + 14 Regular)는 카드 제목 줄 오른쪽에 둡니다.',
    '색만으로 읽히지 않게 실선 · 점선과 점 유무로 계열을 나누고, 전체 수치는 화면 낭독기용 표로 함께 둡니다.',
    '보고서 모양은 SECTOR_COMPARISON_RADAR_STYLE 묶음 하나에 모여 있습니다. 모양을 바꾸려면 이 묶음만 고칩니다.',
] as const

const PROPS_ITEMS = [
    [
        'ComparisonRadarChart',
        'data',
        '지표별 고유 id · 표시명과 두 계열의 0~100 값입니다.',
        '-',
        'ComparisonRadarItem[]',
    ],
    ['ComparisonRadarChart', 'primaryLabel', '주 계열 이름(범례 · 툴팁 · 숨김 표)입니다.', '-', 'string'],
    [
        'ComparisonRadarChart',
        'comparisonLabel',
        '비교 계열 이름입니다. 주지 않으면 주 계열만 그립니다.',
        'undefined',
        'string',
    ],
    [
        'ComparisonRadarChart',
        'gridType',
        "격자 고리 모양입니다. 'circle' 은 동심원(보고서), 'polygon' 은 다각형입니다. 로딩 스켈레톤도 따라 바뀝니다.",
        "'polygon'",
        "'polygon' | 'circle'",
    ],
    [
        'ComparisonRadarChart',
        'primaryFillOpacity · comparisonFillOpacity',
        "두 계열 면의 투명도(0~1)입니다. 모두 반투명이라 겹친 곳이 진해집니다. 비교 계열 면은 'filled' 일 때만 그립니다.",
        '0.16 · 0.25',
        'number',
    ],
    [
        'ComparisonRadarChart',
        'comparisonAppearance',
        "'dashed' 는 점선 테두리와 점, 'filled' 는 점선 테두리에 면을 채우고 점을 두지 않습니다.",
        "'dashed'",
        "'dashed' | 'filled'",
    ],
    [
        'ComparisonRadarChart',
        'primaryColor · comparisonColor',
        '주 계열 · 비교 계열의 색입니다(토큰 변수).',
        "'var(--ds-chart-1)' · 'var(--ds-chart-5)'",
        'string',
    ],
    [
        'ComparisonRadarChart',
        'dotAppearance · gridColor',
        "주 계열 꼭짓점 모양('filled' · 'hollow')과 격자 색입니다.",
        "'filled' · 'var(--ds-subtle-2)'",
        "'filled' | 'hollow' · string",
    ],
    [
        'ComparisonRadarChart',
        'outerRadius · centerY · margin',
        '반지름(숫자 px · 문자열 비율) · 중심 세로 위치 · 여백입니다.',
        "'72%' · 가운데 · {20, 48, 20, 48}",
        'number | string · object',
    ],
    [
        'ComparisonRadarChart',
        'tickFontSize · tickFontWeight · tickColor',
        '축 이름의 글자 크기 · 굵기 · 색입니다.',
        "12 · 600 · 'var(--ds-foreground)'",
        'number · string',
    ],
    ['ComparisonRadarChart', 'ringCount', '격자 눈금 수입니다(5 = 고리 4개).', '5', 'number'],
    [
        'ComparisonRadarChart',
        'showLegend · legendAppearance',
        "차트 위 범례와 그 모양('outline' · 'swatch')입니다. 범례를 카드 머리 줄에 따로 두면 끕니다.",
        "true · 'outline'",
        "boolean · 'outline' | 'swatch'",
    ],
    ['ComparisonRadarChart', 'showDots · showTooltip', '꼭짓점 점과 말풍선입니다.', 'true · true', 'boolean'],
    [
        'ComparisonRadarChart',
        'direction',
        "축 방향입니다. 'counterclockwise' 는 두 번째 축이 왼쪽에 옵니다.",
        "'clockwise'",
        "'clockwise' | 'counterclockwise'",
    ],
    [
        'ComparisonRadarChart',
        'chartClassName',
        "차트 칸 크기입니다. 기본은 정사각이며 보고서는 'aspect-auto h-62 min-h-0 …' 입니다.",
        '-',
        'string',
    ],
    [
        'ComparisonRadarChart',
        'animate',
        '처음 한 번 펼쳐지는 움직임입니다. 인쇄용 문서에서는 끕니다.',
        'true',
        'boolean',
    ],
    [
        'ComparisonRadarChart',
        'isLoading · loadingLabel',
        '불러오는 중이면 스켈레톤을 보입니다(하이드레이션 전에도 자동).',
        "false · '레이더 차트를 불러오는 중입니다.'",
        'boolean · string',
    ],
    ['ComparisonRadarChart', 'ariaLabel', '차트 이름입니다. 숨김 표의 캡션으로도 쓰입니다.', '-', 'string'],
    [
        'ComparisonRadarLegend',
        'primaryLabel · comparisonLabel · 색',
        '차트 밖(카드 머리 줄 등)에 두는 색 견본 범례입니다. 차트와 같은 색을 넘깁니다.',
        '-',
        'string',
    ],
] as const

const ComparisonRadarChartGuidePage = () => (
    <GuidePageShell
        title="부문별 비교 (ComparisonRadarChart)"
        description="조회기업과 업종평균의 부문별 점수(0~100)를 같은 방사형 축 위에 겹쳐 비교하는 레이더 차트입니다."
    >
        <BaseCard>
            <section aria-labelledby="crc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="crc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서의 부문별 비교 카드와 같은 구성입니다.
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
            <section aria-labelledby="crc-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="crc-shape" className="typo-h4-bold">
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
            <section aria-labelledby="crc-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="crc-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        축 수 · 값 범위 · 계열 수 · 폭이 달라 모양이 흔들릴 수 있는 경우입니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">범위 밖 값 (0 · 100 · 140 · -20)</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            0~100 으로 맞춰 그립니다 — 140 은 바깥 고리, -20 은 가운데에 닿습니다.
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
                        <h3 className="typo-body-xl-bold">비교 계열 없음</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            comparisonLabel 을 비우면 조회기업만 그립니다.
                        </p>
                        <ComparisonRadarChart
                            {...SECTOR_COMPARISON_RADAR_STYLE}
                            data={REPORT_DATA}
                            primaryLabel="조회기업"
                            ariaLabel="조회기업 부문별 점수"
                        />
                    </li>
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">축 6개</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            항목 수만큼 축이 고르게 나뉩니다. 고리와 반지름은 그대로입니다.
                        </p>
                        <ComparisonRadarChart
                            {...SECTOR_COMPARISON_RADAR_STYLE}
                            data={SIX_AXIS_DATA}
                            primaryLabel="조회기업"
                            comparisonLabel="업종평균"
                            ariaLabel="축 6개"
                        />
                    </li>
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">좁은 폭 (280)</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            반지름 96 은 유지되고 좌우 축 이름이 칸 밖 여백으로 조금 나갑니다(잘리지 않음). 이보다
                            좁아지면 축 이름이 잘리므로 반지름(outerRadius)을 줄입니다.
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
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">기본 모양 (다각형 격자)</h3>
                        <p className="typo-body-m-regular text-muted-foreground">
                            모양 묶음 없이 쓰면 다각형 격자 · 점선 비교 계열 · 위쪽 범례입니다.
                        </p>
                        <ComparisonRadarChart
                            data={SIX_AXIS_DATA}
                            primaryLabel="조회기업"
                            comparisonLabel="업종평균"
                            ariaLabel="기본 모양"
                        />
                    </li>
                </ul>
                <p className="typo-body-l-regular text-muted-foreground">
                    특허 등급조회의 세 축 레이더는 이 컴포넌트를 감싼{' '}
                    <Link
                        href="/component-guide/grade-radar-chart"
                        className="text-primary underline underline-offset-4"
                    >
                        GradeRadarChart
                    </Link>
                    로 제공합니다.
                </p>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="crc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="crc-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        isLoading 이거나 하이드레이션 전에는{' '}
                        <code className="font-mono">ChartSkeleton type=&quot;circle-radar&quot;</code>를 자동으로
                        보입니다. 칸 높이(248) · 고리 · 축 이름 자리가 같아 불러온 뒤 자리가 흔들리지 않습니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <ChartSkeleton type="circle-radar" label="부문별 비교를 불러오는 중입니다." />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <ComparisonRadarChart
                            {...SECTOR_COMPARISON_RADAR_STYLE}
                            data={REPORT_DATA}
                            primaryLabel="조회기업"
                            comparisonLabel="업종평균"
                            ariaLabel="부문별 비교 — 조회기업과 업종평균"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="crc-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="crc-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        API 의 부문별 점수를 ComparisonRadarItem 으로 바꿔 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="ComparisonRadarChart 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="crc-props" className="flex flex-col gap-4">
                <h2 id="crc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="ComparisonRadarChart 컴포넌트 Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ComparisonRadarChartGuidePage
