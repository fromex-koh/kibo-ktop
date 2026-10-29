// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ComboValueChartSkeleton} from '@/components/composite/combo-value-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {ComboValueChart, type ComboValueItem} from '@/components/custom/combo-value-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '막대 + 선 값 차트 (ComboValueChart)'}

const LINK_CLASS = 'text-primary underline underline-offset-4'

// 이름 · 막대 값 · 선 값(· tone) → 차트 데이터.
type Row = readonly [string, number, number | null, ComboValueItem['tone']?]
const toData = (rows: readonly Row[]): ComboValueItem[] =>
    rows.map(([label, value, lineValue, tone], index) => ({id: `${label}-${index}`, label, value, lineValue, tone}))

// 템플릿 데이터(경쟁기업 10 · 조회기업 · 평균).
const STANDARD_DATA = toData([
    ['기업1', 32.8, 2.3],
    ['기업2', 32.7, -1.2],
    ['기업3', 32.6, 0.8],
    ['기업4', 32.5, 7.4],
    ['기업5', 32.4, 2.7],
    ['조회기업', 32.3, 5.2, 'subject'],
    ['기업6', 32.2, 0.5],
    ['기업7', 32.1, 3.6],
    ['기업8', 31.9, 3.1],
    ['기업9', 31.5, -2.3],
    ['기업10', 31.2, -0.2],
    ['평균', 32.2, 2.1, 'average'],
])
// 3. 엣지 케이스.
const WIDE_RANGE_DATA = toData([
    ['기업1', 12500, 4.2],
    ['기업2', 8200, 1.1],
    ['조회기업', 3100, 6.5, 'subject'],
    ['기업3', 950, -3.2],
    ['평균', 6200, 2.2, 'average'],
])
const NULL_LINE_DATA = toData([
    ['기업1', 32.8, 2.3],
    ['기업2', 32.7, null],
    ['기업3', 32.6, 0.8],
    ['기업4', 32.5, 3.4],
    ['조회기업', 32.3, null, 'subject'],
    ['평균', 32.2, 2.1, 'average'],
])
const SAME_DATA = toData([
    ['기업1', 500, 3],
    ['기업2', 500, 3],
    ['조회기업', 500, 3, 'subject'],
    ['평균', 500, 3, 'average'],
])
const FEW_DATA = toData([
    ['조회기업', 1820, 5.2, 'subject'],
    ['평균', 1640, 2.1, 'average'],
])
const LONG_DATA = toData([
    ['(주)글로벌테크놀로지솔루션즈', 32.8, 2.3],
    ['스마트 모빌리티 코리아', 32.1, 4.1],
    ['조회기업', 31.6, 5.2, 'subject'],
    ['평균', 32.2, 2.1, 'average'],
])
const MANY_DATA = toData(
    Array.from({length: 20}, (_, index): Row => [
        `기업${index + 1}`,
        1234567 - index * 25000,
        Math.round(Math.sin(index) * 50) / 10,
    ]),
)

const EDGE_CASES = [
    {
        key: 'wide',
        title: '값 차이가 클 때',
        description:
            '차이의 절반만큼 내린 값이 0 이하면 막대를 0 부터 그립니다(길이가 값의 비율). 짧은 막대(950)처럼 점 · 점 글자가 막대 값 글자를 가리면 막대 값 글자가 점 글자 위로 올라갑니다.',
        data: WIDE_RANGE_DATA,
    },
    {
        key: 'null',
        title: '선 값 없음(null)',
        description:
            "그 점 대신 '-'(막대 안이면 막대 세로 가운데)를 적고 선을 끊습니다. 혼자 남은 점은 선 없이 점만 찍습니다. 점이 막대 값 글자 자리에 오면(평균) 막대 값 글자를 위로 올립니다.",
        data: NULL_LINE_DATA,
    },
    {
        key: 'same',
        title: '값이 모두 같음',
        description: '막대는 0 부터 모두 가장 큰 높이로, 선은 띠 가운데에 가로로 놓입니다.',
        data: SAME_DATA,
    },
    {key: 'few', title: '항목이 적을 때', description: '칸이 넓어도 막대 폭은 60 그대로입니다.', data: FEW_DATA},
    {
        key: 'long',
        title: '이름이 길 때',
        description: '띄어쓰기 자리에서 줄을 바꾸고, 줄이 늘어난 만큼 그림 높이가 늘어납니다.',
        data: LONG_DATA,
    },
    {
        key: 'many',
        title: '항목이 많을 때(20개)',
        description: '막대 폭을 칸의 62% 로 줄이고, 값 글자가 칸보다 넓으면 글자를 줄입니다(최소 11px).',
        data: MANY_DATA,
    },
] as const

const USAGE_CODE = `import {ComboValueChart} from '@/components/custom/combo-value-chart'

<ComboValueChart
  ariaLabel="경쟁기업 매출액(막대)과 영업이익률(선) 비교"
  barLabel="매출액"
  barUnit="백만원"
  lineLabel="영업이익률"
  lineUnit="%"
  data={competitors.map((item) => ({
    id: item.id,
    label: item.label,
    value: item.sales,
    lineValue: item.growthRate, // null 이면 점 대신 '-' 를 적고 선을 끊는다
    tone: item.tone,            // 'subject'(조회기업) · 'average'(평균)
  }))}
/>`

const LOADING_CODE = `import {ComboValueChartSkeleton} from '@/components/composite/combo-value-chart-skeleton'

// 항목 수를 실제 차트와 같게 넘기면 막대 자리가 맞습니다(그림 높이는 늘 같음).
{isLoading ? (
  <ComboValueChartSkeleton itemCount={12} label="경쟁기업 사업실적을 불러오는 중입니다." />
) : (
  <ComboValueChart {...chartProps} />
)}`

const PRINT_CODE = `// K-BIGx PDF 템플릿 — 색만 kbx 변수로 넘깁니다(kbigx-print-innovation.tsx).
<ComboValueChart
  {...chartProps}
  colors={{
    bar: 'var(--kbx-color-chart-general)',               // 경쟁기업 파랑
    subjectBar: 'var(--kbx-color-chart-subject)',        // 조회기업 진남
    averageBar: 'var(--kbx-color-chart-average-base)',   // 평균 바탕
    averageLine: 'var(--kbx-color-chart-average-line)',  // 평균 사선 · 테두리
    line: 'var(--kbx-color-chart-trend)',                // 선 — 흰 테두리(lineHalo) 없음
    marker: 'var(--kbx-color-paper)',
    baseline: 'var(--kbx-color-foreground-subtle)',
    divider: 'var(--kbx-color-chart-grid)',
    value: 'var(--kbx-color-label)',
    lineValue: 'var(--kbx-color-paper)',
    category: 'var(--kbx-color-foreground)',
    subject: 'var(--kbx-color-chart-subject-label)',     // 조회기업 글자 남색
  }}
/>`

// PDF 템플릿 색 — kbigx-print-innovation.tsx 의 COMPETITOR_CHART_COLORS 와 같다(.kbigx-print 안에서만 kbx 값이 있다).
const PRINT_COLORS = {
    bar: 'var(--kbx-color-chart-general)',
    subjectBar: 'var(--kbx-color-chart-subject)',
    averageBar: 'var(--kbx-color-chart-average-base)',
    averageLine: 'var(--kbx-color-chart-average-line)',
    line: 'var(--kbx-color-chart-trend)',
    marker: 'var(--kbx-color-paper)',
    baseline: 'var(--kbx-color-foreground-subtle)',
    divider: 'var(--kbx-color-chart-grid)',
    value: 'var(--kbx-color-label)',
    lineValue: 'var(--kbx-color-paper)',
    category: 'var(--kbx-color-foreground)',
    subject: 'var(--kbx-color-chart-subject-label)',
} as const

const PROPS_ITEMS = [
    ['ComboValueChart', 'data', '항목 목록입니다. 화면에 그릴 순서로 넘깁니다.', '-', 'readonly ComboValueItem[]'],
    ['ComboValueChart', 'ariaLabel', '그림의 이름입니다.', '-', 'string'],
    [
        'ComboValueChart',
        'barLabel · lineLabel · barUnit · lineUnit',
        '숨김 목록이 읽는 막대 · 선 이름과 단위입니다.',
        "단위 ''",
        'string',
    ],
    [
        'ComboValueChart',
        'colors',
        '막대(기본 · 조회기업 · 평균) · 선 · 점 · 바닥선 · 점선 · 글자 색입니다. 넘기지 않은 항목은 웹 색입니다.',
        '웹 시맨틱 색',
        'Partial<ComboValueColors>',
    ],
    [
        'ComboValueColors',
        'averageLine',
        '평균 막대 사선 · 테두리 색입니다. 주면 평균 막대가 averageBar 바탕 + 45° 사선이 됩니다.',
        '없음(단색)',
        'string',
    ],
    ['ComboValueColors', 'lineHalo', '선 아래에 까는 바깥 테두리 색입니다.', '없음', 'string'],
    [
        'ComboValueChart',
        'formatValue · formatLineValue',
        '막대 · 선 값 글자 형식입니다.',
        '천 단위 쉼표',
        '(value: number) => string',
    ],
    [
        'ComboValueChart',
        'maxCategoryLines',
        '항목 이름 최대 줄 수입니다. 넘는 이름만 글자를 줄여(11px 까지) 그 줄 수에 맞춥니다 — 짧은 이름은 원래 크기.',
        '없음(줄 수 제한 없이 그림이 늘어남)',
        'number',
    ],
    [
        'ComboValueChart',
        'isCategoryTruncated',
        '항목 이름을 원래 크기 한 줄로 두고, 칸보다 길면 뒤를 말줄임(…)합니다(그림 높이 그대로). 화면에 보이지 않는 목록은 전체 이름을 읽어 줍니다. PDF 템플릿 경쟁기업 사업실적이 씁니다.',
        'false',
        'boolean',
    ],
    ['ComboValueItem', 'id · label', '항목 식별자 · 이름입니다.', '-', 'string'],
    [
        'ComboValueItem',
        'value · lineValue',
        "막대 값 · 선 값입니다. 선 값이 null · 숫자가 아니면 점 대신 '-' 를 적고 선을 끊습니다. 막대 값이 숫자가 아니면 막대 없이 값 글자만 적습니다(글자는 formatValue 로 — PDF 템플릿은 '-').",
        '-',
        'number · number | null',
    ],
    [
        'ComboValueItem',
        'tone',
        "'subject' 조회기업(막대 · 글자 강조) · 'average' 평균(막대 색).",
        "'default'",
        'ComboValueTone',
    ],
    ['ComboValueChartSkeleton', 'itemCount', '항목 수입니다.', '12', 'number'],
    [
        'ComboValueChartSkeleton',
        'label',
        '불러오는 중 문구(화면 낭독기용)입니다.',
        "'그래프를 불러오는 중입니다.'",
        'string',
    ],
] as const

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

const chartLabels = {barLabel: '매출액', barUnit: '백만원', lineLabel: '영업이익률', lineUnit: '%'} as const

const ComboValueChartGuidePage = () => (
    <GuidePageShell
        title="막대 + 선 값 차트 (ComboValueChart)"
        description="항목마다 막대 하나와 선 위의 점을 함께 그리고, 값을 막대 위 · 점 위에 바로 적는 차트입니다. K-BIGx 보고서 PDF 템플릿 기술혁신정보의 경쟁기업 사업실적(매출액, 영업이익률) 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="cvc-basic" className="flex flex-col gap-6">
                <SectionHeading id="cvc-basic" title="1. 기본 사용">
                    서버에서 바로 그리는 SVG 차트입니다. 세로축 · 툴팁이 있는 웹 화면용은{' '}
                    <Link href="/component-guide/combo-bar-line-chart" className={LINK_CLASS}>
                        ComboBarLineChart
                    </Link>
                    입니다.
                </SectionHeading>
                <Example
                    title="템플릿 데이터"
                    description="웹 기본 색 — 조회기업은 민트 막대 · 굵은 남색 글자, 평균은 보라 막대(PDF 템플릿 색은 5절). 막대는 30 부터 섭니다(값 차이가 작음)."
                >
                    <ComboValueChart {...chartLabels} data={STANDARD_DATA} ariaLabel="경쟁기업 사업실적 예시" />
                </Example>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cvc-rule" className="flex flex-col gap-6">
                <SectionHeading id="cvc-rule" title="2. 짜임 규칙" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림 1168 × 480. 항목 칸은 폭을 항목 수로 나누고 칸 사이에 세로 점선, 아래에 바닥선(y 438)을
                        긋습니다.
                    </li>
                    <li>
                        막대는 폭 60 · 위 모서리 둥글림 8 이고, 가장 큰 값이 y 66.5 까지 섭니다. 값 글자는 막대 끝 9
                        위에 적습니다.
                    </li>
                    <li>
                        막대 바닥 — 값 차이가 작으면 가장 작은 값에서 차이의 절반만큼 아래를 차이의 자릿수로 내린 값부터
                        그립니다(31.2 − 0.8 → 30). 0 이하면 0 부터. 바닥이 0 이 아니면 막대 길이는 값의 비율이 아니라 값
                        글자로 읽습니다.
                    </li>
                    <li>
                        선은 막대와 따로 된 눈금입니다 — 가장 큰 값 y 220, 가장 작은 값 y 383.4 사이에서 오르내리고, 점
                        위 15 에 흰 글자를 얹습니다. 점 글자가 막대 밖으로 나가면 값 글자 색으로 바꿉니다.
                    </li>
                    <li>
                        범례 · 단위는 그리지 않습니다 — 제목 줄 오른쪽에 둡니다(PDF 템플릿 &apos;단위: 백만원, %&apos;).
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cvc-edge" className="flex flex-col gap-6">
                <SectionHeading id="cvc-edge" title="3. 엣지 케이스">
                    값 범위 · 빈 선 값 · 항목 수 · 이름 길이에 따라 모양을 맞춥니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    {EDGE_CASES.map((item) => (
                        <Example key={item.key} title={item.title} description={item.description}>
                            <ComboValueChart {...chartLabels} data={item.data} ariaLabel={`${item.title} 예시`} />
                        </Example>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cvc-loading" className="flex flex-col gap-6">
                <SectionHeading id="cvc-loading" title="4. 불러오는 중 (ComboValueChartSkeleton)">
                    같은 그림 범위(1168 × 480)에 막대 · 값 글자 · 이름 자리를 그립니다. PDF 템플릿은 데이터를 받은 뒤
                    서버에서 바로 그려 스켈레톤 없이 나옵니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    <Example title="불러오는 중" description="회색 자리 · 깜빡임으로 불러오는 중임을 보입니다.">
                        <ComboValueChartSkeleton label="경쟁기업 사업실적을 불러오는 중입니다." />
                    </Example>
                    <Example title="불러온 뒤" description="같은 자리에 차트가 그려집니다.">
                        <ComboValueChart {...chartLabels} data={STANDARD_DATA} ariaLabel="불러온 뒤 예시" />
                    </Example>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cvc-print" className="flex flex-col gap-6">
                <SectionHeading id="cvc-print" title="5. K-BIGx PDF 템플릿에서">
                    기술혁신정보 4쪽 — 소제목 오른쪽에 &apos;단위: 백만원, %&apos;, 그 아래 16 간격에 차트를 둡니다.
                    확인 화면:{' '}
                    <Link
                        href="/corp/k-bigx-report/innovation-growth-report/report-print?sections=innovation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        K-BIGx 보고서 PDF 템플릿 기술혁신정보
                        <span className="sr-only"> (새 창)</span>
                    </Link>
                </SectionHeading>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        흑백 인쇄에서도 갈리게 색이 아니라 명도 3단계로 나눕니다 — 조회기업 진남(가장 진함) · 경쟁기업
                        파랑 · 평균 옅은 바탕 + 파랑 사선 · 테두리(가장 밝음, <code>averageLine</code>).
                    </li>
                    <li>
                        선(영업이익률)은 진남 한 줄이고 흰 바깥 테두리(<code>lineHalo</code>)는 두지 않습니다(PDF
                        템플릿). 사선 평균 막대 위 점 글자는 흰 글자 대신 진한 글자 + 흰 테두리(marker 색)입니다.
                    </li>
                    <li>
                        조회기업 값 · 이름 글자는 남색(chart-subject-label) 굵게 — 막대 색을 글자에 그대로 쓰지
                        않습니다.
                    </li>
                </ul>
                <Example
                    title="PDF 템플릿 색"
                    description="kbx 색을 넘긴 모습입니다(.kbigx-print 안 · 다크에서도 흰 바탕)."
                >
                    <div className="kbigx-print bg-kbx-paper rounded-sm p-4">
                        <ComboValueChart
                            {...chartLabels}
                            data={STANDARD_DATA}
                            colors={PRINT_COLORS}
                            ariaLabel="경쟁기업 사업실적 PDF 템플릿 색 예시"
                        />
                    </div>
                </Example>
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cvc-a11y" className="flex flex-col gap-6">
                <SectionHeading id="cvc-a11y" title="6. 접근성" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 항목마다 막대
                        · 선 값을 숨김 목록으로 읽어 줍니다[5.1.1].
                    </li>
                    <li>값을 글자로 함께 적어 막대 길이 · 색만으로 정보를 전하지 않습니다[5.3.1].</li>
                    <li>
                        스켈레톤은 <code>role=&quot;status&quot;</code> 와 숨김 문구로 불러오는 중임을 알립니다.
                    </li>
                    <li>마우스 반응과 움직임이 없습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cvc-props" className="flex flex-col gap-6">
                <SectionHeading id="cvc-props" title="7. Props API">
                    <code>data</code> · <code>ariaLabel</code> · <code>barLabel</code> · <code>lineLabel</code> 이
                    필수입니다.
                </SectionHeading>
                <PropsTable items={PROPS_ITEMS} caption="ComboValueChart · ComboValueChartSkeleton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ComboValueChartGuidePage
