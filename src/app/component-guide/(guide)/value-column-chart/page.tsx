// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ValueColumnChartSkeleton} from '@/components/composite/value-column-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {ValueColumnChart, type ValueColumnItem} from '@/components/custom/value-column-chart'

export const metadata: Metadata = {title: '값 막대 (ValueColumnChart)'}

const LINK_CLASS = 'text-primary underline underline-offset-4'

// 이름 · 값(· 강조 · 색) → 차트 데이터.
type Row = readonly [string, number, boolean?, string?]
const toData = (rows: readonly Row[]): ValueColumnItem[] =>
    rows.map(([label, value, isHighlighted, color], index) => ({
        id: `${label}-${index}`,
        label,
        value,
        isHighlighted,
        color,
    }))

// 템플릿 데이터.
const TYPE_DATA = toData([
    ['신청기업', 73.7, true],
    ['전체기업', 50.5],
    ['창업', 46],
    ['비창업', 55.1],
    ['벤처', 52.2],
    ['이노비즈', 58.7],
])
const PAIR_COLORS = ['var(--ds-mint-700)', 'var(--ds-blue-500)', 'var(--ds-orange-500)', 'var(--ds-error-500)'] as const
const CAPABILITIES = [
    ['인프라', 63.7, 37.5],
    ['투입', 88.2, 55.6],
    ['활동', 53.4, 11.3],
    ['성과', 37.1, 13.5],
] as const
const pairData = (score: number, average: number, color: string) =>
    toData([
        ['신청기업', score, true, color],
        ['전체기업', average, false, 'var(--ds-gray-200)'],
    ])

// 3. 엣지 케이스.
const EDGE_CASES = [
    {
        key: 'zero',
        title: '0 값',
        description: '막대 없이 값 글자만 바닥선 위에 적습니다.',
        data: toData([
            ['신청기업', 0, true],
            ['전체기업', 50.5],
            ['창업', 46],
        ]),
    },
    {
        key: 'same',
        title: '값이 모두 같음',
        description: '모든 막대가 가장 큰 높이(260)로 섭니다.',
        data: toData([
            ['신청기업', 60, true],
            ['전체기업', 60],
            ['창업', 60],
        ]),
    },
    {
        key: 'few',
        title: '항목이 적을 때',
        description: '칸이 넓어지고 막대도 칸 폭을 다 씁니다(모든 막대 같은 폭).',
        data: toData([
            ['신청기업', 73.7, true],
            ['전체기업', 50.5],
        ]),
    },
    {
        key: 'long',
        title: '이름이 길 때',
        description: '띄어쓰기 자리에서 줄을 바꾸고, 그만큼 그림 높이가 늘어납니다.',
        data: toData([
            ['신청기업', 73.7, true],
            ['전체 기업 평균', 50.5],
            ['창업 3년 이내 기업', 46],
            ['비창업', 55.1],
        ]),
    },
] as const

const USAGE_CODE = `import {ValueColumnChart} from '@/components/custom/value-column-chart'

<ValueColumnChart
  ariaLabel="기업 유형별 Tech-Index 비교"
  data={companyTypes.map((item) => ({
    id: item.id,
    label: item.label,
    value: item.value,
    isHighlighted: item.isSubject, // 신청기업 — 강조 색 · 굵은 글자
  }))}
/>`

const COMPACT_CODE = `// 카드 안 작은 막대(compact) — 0~100 눈금, 칸 사이 점선, 막대마다 색.
<ValueColumnChart
  variant="compact"
  max={100}
  ariaLabel="인프라 — 신청기업과 전체기업 점수"
  data={[
    {id: 'subject', label: '신청기업', value: 63.7, color: 'var(--kbx-color-mint)', isHighlighted: true},
    {id: 'average', label: '전체기업', value: 37.5, color: 'var(--kbx-color-gray)'},
  ]}
/>`

const NARROW_CODE = `// 두 칸 중 좁은 칸(narrow, 360 × 440) — 진단브리핑 인당 매출액(kbigx-print-briefing.tsx).
<ValueColumnChart
  variant="narrow"
  ariaLabel="인당 매출액 연도별 비교"
  data={salesPerEmployee.map((item) => ({id: item.label, label: item.label, value: item.value}))}
  colors={{
    bar: 'var(--kbx-color-blue)',
    baseline: 'var(--kbx-color-border-muted)',
    divider: 'var(--kbx-color-border)',
    mutedValue: 'var(--kbx-color-label)',
    category: 'var(--kbx-color-foreground-subtle)',
  }}
/>`

// 값이 칸보다 긴 경우(narrow) — 값 글자를 같은 비율로 줄인다.
const NARROW_LARGE_DATA = [
    {id: '2022', label: '2022년', value: 123456.7},
    {id: '2023', label: '2023년', value: 98765.4},
    {id: '2024', label: '2024년', value: 1234567.8},
]

const NARROW_DATA = [
    {id: '2022', label: '2022년', value: 456.1},
    {id: '2023', label: '2023년', value: 452.9},
    {id: '2024', label: '2024년', value: 466.5},
]

const LOADING_CODE = `import {ValueColumnChartSkeleton} from '@/components/composite/value-column-chart-skeleton'

// 모양 · 항목 수를 실제 차트와 같게 넘기면 자리가 흔들리지 않습니다.
{isLoading ? (
  <ValueColumnChartSkeleton variant="wide" itemCount={6} label="기업 유형별 비교를 불러오는 중입니다." />
) : (
  <ValueColumnChart {...chartProps} />
)}`

const PRINT_CODE = `// K-BIGx 인쇄본 — 색만 kbx 변수로 넘깁니다(kbigx-print-tech-index.tsx).
<ValueColumnChart
  {...chartProps}
  colors={{
    bar: 'var(--kbx-color-chart-general)',
    highlight: 'var(--kbx-color-chart-subject)',            // 신청기업 막대 — 진남
    highlightLabel: 'var(--kbx-color-chart-subject-label)', // 신청기업 값 · 이름 — 남색
    baseline: 'var(--kbx-color-foreground)',
    value: 'var(--kbx-color-foreground)',
    category: 'var(--kbx-color-foreground)',
  }}
/>`

// 인쇄본 색 — kbigx-print-tech-index.tsx 와 같다(.kbigx-print 안에서만 kbx 값이 있다).
const PRINT_COLORS = {
    bar: 'var(--kbx-color-chart-general)',
    highlight: 'var(--kbx-color-chart-subject)',
    highlightLabel: 'var(--kbx-color-chart-subject-label)',
    baseline: 'var(--kbx-color-foreground)',
    value: 'var(--kbx-color-foreground)',
    category: 'var(--kbx-color-foreground)',
} as const

const PROPS_ITEMS = [
    ['ValueColumnChart', 'data', '항목 목록입니다. 화면에 그릴 순서로 넘깁니다.', '-', 'readonly ValueColumnItem[]'],
    ['ValueColumnChart', 'ariaLabel', '그림의 이름입니다.', '-', 'string'],
    [
        'ValueColumnChart',
        'variant',
        "'wide' 쪽 폭 막대(1168 × 338 · 막대 폭 64) · 'compact' 카드 안 작은 막대(230 × 290) · 'narrow' 두 칸 중 좁은 칸 막대(360 × 440 — 진단브리핑 인당 매출액)입니다.",
        "'wide'",
        "'wide' | 'compact' | 'narrow'",
    ],
    ['ValueColumnChart', 'max', '높이 끝 값입니다.', 'wide · narrow 가장 큰 값 · compact 100', 'number'],
    [
        'ValueColumnChart',
        'colors',
        '막대 · 강조 · 바닥선 · 점선 · 값 글자(진하게 · 옅게) · 이름 색입니다. 넘기지 않은 항목은 웹 색입니다.',
        '웹 시맨틱 색',
        'Partial<ValueColumnColors>',
    ],
    [
        'ValueColumnColors',
        'highlightLabel',
        'wide 의 강조 글자(값 · 이름) 색입니다.',
        'highlight(막대와 같은 색)',
        'string',
    ],
    ['ValueColumnChart', 'formatValue', '값 글자 형식입니다.', '소수 첫째 자리(46.0)', '(value: number) => string'],
    ['ValueColumnItem', 'id · label · value', '항목 식별자 · 이름 · 값입니다.', '-', 'string · number'],
    ['ValueColumnItem', 'color', '막대 색입니다. 없으면 colors.bar(강조는 colors.highlight).', '-', 'string'],
    ['ValueColumnItem', 'isHighlighted', '강조 항목 — 예: 신청기업.', 'false', 'boolean'],
    [
        'ValueColumnItem',
        'valueText',
        "값 글자입니다. 주면 formatValue(value) 대신 적습니다(값이 없는 고정 항목의 '-' 등).",
        '-',
        'string',
    ],
    [
        'ValueColumnChartSkeleton',
        'variant · itemCount',
        '실제 차트와 같은 모양 · 항목 수입니다.',
        "'wide' · 6(narrow 3)",
        "'wide' | 'compact' | 'narrow' · number",
    ],
    [
        'ValueColumnChartSkeleton',
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

const ValueColumnChartGuidePage = () => (
    <GuidePageShell
        title="값 막대 (ValueColumnChart)"
        description="항목마다 막대 하나를 세우고 막대 위에 값, 바닥선 아래에 이름을 적는 차트입니다. K-BIGx 보고서 인쇄본 Tech-Index 의 기업 유형별 Tech-Index 비교(wide) · 4대 혁신역량 점수 카드(compact) · 진단브리핑 인당 매출액(narrow)입니다."
    >
        <BaseCard>
            <section aria-labelledby="vcc-basic" className="flex flex-col gap-6">
                <SectionHeading id="vcc-basic" title="1. 기본 사용 (wide)">
                    서버에서 바로 그리는 SVG 막대입니다. 세로축 · 툴팁이 있는 웹 화면용은{' '}
                    <Link href="/component-guide/column-chart" className={LINK_CLASS}>
                        ColumnChart
                    </Link>
                    입니다.
                </SectionHeading>
                <Example
                    title="템플릿 데이터"
                    description="막대는 모두 같은 폭(64)이고 가장 큰 값(인쇄본은 max 100)이 높이 260 입니다. 웹 기본 색 — 신청기업(강조)은 보라 막대 · 굵은 보라 글자(인쇄본 색은 5절)."
                >
                    <ValueColumnChart data={TYPE_DATA} ariaLabel="기업 유형별 Tech-Index 비교 예시" />
                </Example>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="vcc-compact" className="flex flex-col gap-6">
                <SectionHeading id="vcc-compact" title="2. 카드 안 작은 막대 (compact · narrow)">
                    0~100 눈금 · 칸 사이 점선 · 막대마다 색. 강조 항목 값은 진하게, 나머지는 옅게 적습니다.
                </SectionHeading>
                <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
                    {CAPABILITIES.map(([label, score, average], index) => (
                        <div key={label} className="border-subtle-3 bg-card flex flex-col gap-3 rounded-sm border p-5">
                            <ValueColumnChart
                                variant="compact"
                                max={100}
                                data={pairData(score, average, PAIR_COLORS[index])}
                                ariaLabel={`${label} — 신청기업과 전체기업 점수 예시`}
                            />
                            <p className="typo-body-xl-bold text-foreground text-center">{label}</p>
                        </div>
                    ))}
                </div>
                <CodeBlock code={COMPACT_CODE} language="tsx" copyLabel="복사" />
                <p className="typo-body-l-regular text-label-foreground">
                    <code>variant=&quot;narrow&quot;</code> 는 두 칸 중 좁은 칸(360 × 440) 막대입니다 — 칸마다 폭 64
                    막대 · 칸 사이 점선 · 바닥선 y 370 · 가장 큰 값 높이 308 · 값 19px 굵게 · 이름 17px(진단브리핑 인당
                    매출액).
                </p>
                <div className="border-subtle-3 bg-card w-full max-w-90 rounded-sm border p-5">
                    <ValueColumnChart variant="narrow" data={NARROW_DATA} ariaLabel="인당 매출액 narrow 예시" />
                </div>
                <CodeBlock code={NARROW_CODE} language="tsx" copyLabel="narrow 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="vcc-edge" className="flex flex-col gap-6">
                <SectionHeading id="vcc-edge" title="3. 엣지 케이스">
                    0 값 · 같은 값 · 항목 수 · 이름 길이 · 값 글자 길이에 따라 모양을 맞춥니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    {EDGE_CASES.map((item) => (
                        <Example key={item.key} title={item.title} description={item.description}>
                            <ValueColumnChart data={item.data} ariaLabel={`${item.title} 예시`} />
                        </Example>
                    ))}
                    <Example
                        title="값 글자가 칸보다 김 (narrow)"
                        description="값 글자가 칸(막대 칸 + 칸 사이 − 8)보다 길면 모든 값 글자를 같은 비율로 줄입니다(최소 12px). 들어가면 그대로입니다."
                    >
                        <div className="max-w-90">
                            <ValueColumnChart variant="narrow" data={NARROW_LARGE_DATA} ariaLabel="큰 값 narrow 예시" />
                        </div>
                    </Example>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="vcc-loading" className="flex flex-col gap-6">
                <SectionHeading id="vcc-loading" title="4. 불러오는 중 (ValueColumnChartSkeleton)">
                    같은 그림 범위에 막대 · 값 글자 · 이름 자리를 그립니다. 인쇄본은 데이터를 받은 뒤 서버에서 바로 그려
                    스켈레톤 없이 나옵니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    <Example title="불러오는 중 (wide)" description="회색 자리 · 깜빡임으로 불러오는 중임을 보입니다.">
                        <ValueColumnChartSkeleton label="기업 유형별 비교를 불러오는 중입니다." />
                    </Example>
                    <Example title="불러온 뒤 (wide)" description="같은 자리에 차트가 그려집니다.">
                        <ValueColumnChart data={TYPE_DATA} ariaLabel="불러온 뒤 예시" />
                    </Example>
                    <Example title="불러오는 중 (compact)" description="카드 안 작은 막대 자리입니다.">
                        <div className="max-w-60">
                            <ValueColumnChartSkeleton variant="compact" label="역량 점수를 불러오는 중입니다." />
                        </div>
                    </Example>
                    <Example title="불러온 뒤 (compact)" description="같은 자리에 차트가 그려집니다.">
                        <div className="max-w-60">
                            <ValueColumnChart
                                variant="compact"
                                max={100}
                                data={pairData(63.7, 37.5, PAIR_COLORS[0])}
                                ariaLabel="불러온 뒤 compact 예시"
                            />
                        </div>
                    </Example>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="vcc-print" className="flex flex-col gap-6">
                <SectionHeading id="vcc-print" title="5. K-BIGx 인쇄본에서">
                    Tech-Index 2쪽 — 기업 유형별 Tech-Index 비교(wide)와 4대 혁신역량 부분별 비교 카드 넷(compact). 확인
                    화면:{' '}
                    <Link
                        href="/corp/k-bigx-report/innovation-growth-report/report-print?sections=tech-index"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        K-BIGx 보고서 인쇄본 Tech-Index
                        <span className="sr-only"> (새 창)</span>
                    </Link>
                </SectionHeading>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        신청기업 막대는 진남(chart-subject), 나머지 유형은 파랑(chart-general) — 명도 차가 커서 흑백
                        인쇄에서도 강조가 남습니다.
                    </li>
                    <li>
                        신청기업 값 · 이름 글자는 막대와 다른 남색(<code>highlightLabel</code> =
                        chart-subject-label)입니다.
                    </li>
                    <li>4대 혁신역량 부분별 비교 카드(compact)는 역량마다 등급 색 · 전체기업 회색 그대로입니다.</li>
                </ul>
                <Example
                    title="인쇄본 색"
                    description="kbx 색을 넘긴 모습입니다(.kbigx-print 안 · 다크에서도 흰 바탕)."
                >
                    <div className="kbigx-print bg-kbx-paper rounded-sm p-4">
                        <ValueColumnChart
                            data={TYPE_DATA}
                            max={100}
                            colors={PRINT_COLORS}
                            ariaLabel="기업 유형별 Tech-Index 비교 인쇄본 색 예시"
                        />
                    </div>
                </Example>
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="vcc-a11y" className="flex flex-col gap-6">
                <SectionHeading id="vcc-a11y" title="6. 접근성" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 항목마다 값을
                        숨김 목록으로 읽어 줍니다[5.1.1].
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
            <section aria-labelledby="vcc-props" className="flex flex-col gap-6">
                <SectionHeading id="vcc-props" title="7. Props API">
                    <code>data</code> · <code>ariaLabel</code> 이 필수입니다.
                </SectionHeading>
                <PropsTable items={PROPS_ITEMS} caption="ValueColumnChart · ValueColumnChartSkeleton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ValueColumnChartGuidePage
