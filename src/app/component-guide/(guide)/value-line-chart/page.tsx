// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ValueLineChartSkeleton} from '@/components/composite/value-line-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {ValueLineChart, type ValueLineItem} from '@/components/custom/value-line-chart'

export const metadata: Metadata = {title: '값 꺾은선 (ValueLineChart)'}

const LINK_CLASS = 'text-primary underline underline-offset-4'
const LINE_COLOR = 'var(--ds-purple-600)'

// 기간 이름 + 값 → 차트 데이터.
const toData = (rows: readonly (readonly [string, number | undefined])[]): ValueLineItem[] =>
    rows.map(([label, value]) => ({id: label, label, value}))

const QUARTERS = [
    '23.03월',
    '23.06월',
    '23.09월',
    '23.12월',
    '24.03월',
    '24.06월',
    '24.09월',
    '24.12월',
    '25.03월',
    '25.06월',
    '25.09월',
] as const
const withQuarters = (values: readonly (number | undefined)[]) =>
    toData(values.map((value, index) => [QUARTERS[index % QUARTERS.length], value] as const))

// 템플릿 데이터(단위: 명).
const STANDARD_DATA = withQuarters([39, 37, 37, 35, 34, 34, 31, 33, 27, 28, 25])
// 3. 엣지 케이스.
const RISING_DATA = withQuarters([12, 14, 15, 18, 21, 24, 26, 31, 35, 41, 48])
const FLAT_DATA = withQuarters([30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30])
const LARGE_DATA = withQuarters([1250, 1320, 1410, 1380, 1520, 1610, 1580, 1720, 1810, 1790, 1930])
const MISSING_DATA = withQuarters([39, 37, undefined, 35, 34, 34, 31, undefined, 27, 28, 25])
const FEW_DATA = toData([
    ['24.12월', 33],
    ['25.06월', 28],
])
const SINGLE_DATA = toData([['25.09월', 25]])
// compact — 월별 차입금 변동률(단위: %).
const COMPACT_DATA = toData(
    [39, 37, 37, 35, 34, 34, 31, 33, 27, 28, 25, 25].map(
        (value, index) =>
            [`${index < 2 ? 24 : 25}.${String(((index + 10) % 12) + 1).padStart(2, '0')}월`, value] as const,
    ),
)
const MANY_DATA = toData(
    Array.from({length: 20}, (_, index) => {
        const year = 21 + Math.floor(index / 4)
        const month = ['03', '06', '09', '12'][index % 4]
        return [`${year}.${month}월`, 40 - Math.round(index * 0.8 + (index % 3))] as const
    }),
)

const EDGE_CASES = [
    {
        key: 'rising',
        title: '늘어날 때',
        description: '값 범위는 가장 작은 · 큰 값을 윗자리 단위로 내리고 올립니다(12 ~ 48 → 10 ~ 50).',
        data: RISING_DATA,
    },
    {
        key: 'flat',
        title: '값이 모두 같을 때',
        description: '범위를 한 단위 넓혀(20 ~ 40) 선을 가운데에 둡니다.',
        data: FLAT_DATA,
    },
    {
        key: 'large',
        title: '값이 클 때(천 단위)',
        description: '천 단위 쉼표로 적고, 범위도 윗자리(천) 단위로 잡습니다(1,250 ~ 1,930 → 1,000 ~ 2,000).',
        data: LARGE_DATA,
    },
    {
        key: 'missing',
        title: '값 없음',
        description:
            '값이 없는 분기에서 선 · 면을 끊고 점 · 값 글자를 그리지 않습니다. 기간 이름 · 점선은 그대로입니다.',
        data: MISSING_DATA,
    },
    {
        key: 'few',
        title: '점이 둘',
        description: '처음 · 마지막 점이 양 끝(x 60 · 1144)에 옵니다.',
        data: FEW_DATA,
    },
    {key: 'single', title: '점이 하나', description: '점을 가운데에 둡니다.', data: SINGLE_DATA},
    {
        key: 'many',
        title: '점이 많을 때(20개)',
        description:
            '기간 이름이 겹치면 몇 칸씩 건너뛰어 적습니다(처음 · 마지막은 늘 적음). 값 글자는 겹치면 줄입니다.',
        data: MANY_DATA,
    },
] as const

const USAGE_CODE = `import {ValueLineChart} from '@/components/custom/value-line-chart'

<ValueLineChart
  ariaLabel="분기별 종업원수 추이"
  color="var(--ds-purple-600)"
  data={[
    {id: '23.03', label: '23.03월', value: 39},
    {id: '23.06', label: '23.06월', value: 37},
    // … 시간 순서대로
  ]}
/>`

const LOADING_CODE = `import {ValueLineChartSkeleton} from '@/components/composite/value-line-chart-skeleton'

// 점 수를 실제 차트와 같게 두면 점 자리가 맞습니다.
{isLoading ? (
  <ValueLineChartSkeleton pointCount={11} label="분기별 종업원수를 불러오는 중입니다." />
) : (
  <ValueLineChart data={employees} ariaLabel="분기별 종업원수 추이" />
)}`

const COMPACT_CODE = `// 높이 290 — 신용/재무정보 차입금 변동률(kbigx-print-credit.tsx).
<ValueLineChart variant="compact" data={borrowingTrend} ariaLabel="월별 차입금 변동률" />

// 불러오는 중에도 같은 변형을 넘깁니다.
<ValueLineChartSkeleton variant="compact" pointCount={12} />`

const PRINT_CODE = `// K-BIGx 인쇄본 — 선 색 · 선 · 글자 색을 kbx 토큰으로 넘깁니다(kbigx-print-briefing.tsx).
<ValueLineChart
  data={employees.map((item) => ({id: item.label, label: item.label, value: item.value}))}
  color="var(--kbx-color-purple-strong)"
  colors={{
    grid: 'var(--kbx-color-border)',
    baseline: 'var(--kbx-color-border-muted)',
    value: 'var(--kbx-color-foreground)',
    label: 'var(--kbx-color-foreground-subtle)',
    dotFill: 'var(--kbx-color-paper)',
  }}
  ariaLabel="분기별 종업원수 추이"
/>`

const PROPS_ITEMS = [
    ['ValueLineChart', 'data', '점 목록입니다. 시간 순서대로 넘깁니다.', '-', 'readonly ValueLineItem[]'],
    ['ValueLineChart', 'ariaLabel', '차트 전체의 이름입니다.', '-', 'string'],
    ['ValueLineChart', 'color', '선 · 면 · 점 테두리 색(CSS 색 값)입니다.', "'var(--ds-chart-1)'", 'string'],
    [
        'ValueLineChart',
        'colors',
        '선 · 글자 색(grid · baseline · value · label · dotFill)입니다. 넘기지 않으면 웹 시맨틱 색입니다.',
        '웹 시맨틱 색',
        'Partial<ValueLineColors>',
    ],
    ['ValueLineChart', 'formatValue', '값 글자 형식입니다.', '천 단위 쉼표', '(value: number) => string'],
    [
        'ValueLineChart',
        'variant',
        "크기입니다. 'medium' 은 높이 340(활동성정보 분기별 종업원수), 'compact' 는 높이 290(차입금 변동률) — 둘 다 점 · 글자가 조금 작습니다. 'narrow' 는 폭 752(진단브리핑 분기별 종업원수 — 인당 매출액과 두 칸)입니다.",
        "'default'",
        "'default' | 'medium' | 'compact' | 'narrow'",
    ],
    ['ValueLineItem', 'id · label', '점 식별자와 기간 이름(아래 글자)입니다.', '-', 'string'],
    ['ValueLineItem', 'value', '값입니다. 없으면(undefined) 그 자리에서 선을 끊습니다.', '-', 'number | undefined'],
    [
        'ValueLineChartSkeleton',
        'label',
        '불러오는 중 문구(화면 낭독기용)입니다.',
        "'그래프를 불러오는 중입니다.'",
        'string',
    ],
    ['ValueLineChartSkeleton', 'pointCount', '점 수입니다.', '11', 'number'],
    [
        'ValueLineChartSkeleton',
        'variant',
        '실제 차트와 같은 크기 변형입니다.',
        "'default'",
        "'default' | 'medium' | 'compact' | 'narrow'",
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

const ValueLineChartGuidePage = () => (
    <GuidePageShell
        title="값 꺾은선 (ValueLineChart)"
        description="한 계열의 추이를 면 + 꺾은선 + 점으로 그리고 점마다 값을 바로 적는 차트입니다. 세로축 없이 값 글자로 읽습니다. K-BIGx 보고서 인쇄본 진단브리핑의 분기별 종업원수(narrow) · 활동성정보의 분기별 종업원수(medium) · 신용/재무정보의 차입금 변동률(compact) 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="vlc-basic" className="flex flex-col gap-6">
                <SectionHeading id="vlc-basic" title="1. 기본 사용">
                    그림 폭 1168 기준으로 그리고, 칸 폭에 맞춰 같은 비율로 줄어듭니다. 세로축 · 툴팁 · 여러 계열이 있는
                    웹 화면용 선 그래프는{' '}
                    <Link href="/component-guide/line-chart" className={LINK_CLASS}>
                        LineChart
                    </Link>
                    입니다.
                </SectionHeading>
                <Example
                    title="템플릿 데이터"
                    description="점마다 세로 점선, 선 굵기 4, 흰 점(반지름 7), 점 위 값 21px 굵게, 아래 기간 이름 19px."
                >
                    <ValueLineChart data={STANDARD_DATA} color={LINE_COLOR} ariaLabel="분기별 종업원수 예시" />
                </Example>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="vlc-rule" className="flex flex-col gap-6">
                <SectionHeading id="vlc-rule" title="2. 짜임 · 크기 규칙" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>점은 x 60 ~ 1144 사이에 같은 간격으로 놓고, 점마다 세로 점선(y 20 ~ 370)을 긋습니다.</li>
                    <li>
                        값 범위는 가장 작은 · 큰 값을 윗자리 단위로 내리고 올린 값입니다(25 ~ 39 → 20 ~ 40). 큰 끝이 y
                        40, 작은 끝이 바닥선(y 370)입니다.
                    </li>
                    <li>면은 선 아래를 바닥선까지 8% 로 채웁니다. 값 글자는 점 18.5 위, 기간 이름은 y 408 입니다.</li>
                    <li>기간 이름이 그림 끝을 넘으면 안쪽으로 당깁니다(마지막 25.09월 x 1144 → 1136).</li>
                    <li>
                        값 글자 뒤에 점 안쪽 색(colors.dotFill) 테두리를 깔아, 값이 크게 오르내려 선이 글자를 지나가도
                        읽힙니다.
                    </li>
                    <li>
                        <code>variant=&quot;compact&quot;</code> 는 높이 290 입니다 — 세로 점선 y 14 ~ 250, 큰 끝 y 30,
                        바닥선 y 250, 점 반지름 6, 값 글자 점 17 위(20px), 기간 이름 y 278(18px). 폭 · 점 간격 · 값 범위
                        규칙은 같습니다.
                    </li>
                    <li>
                        <code>variant=&quot;medium&quot;</code> 은 높이 340 입니다 — 바닥선 y 290, 기간 이름 y 320 이고
                        나머지는 compact 와 같습니다(활동성정보 분기별 종업원수).
                    </li>
                    <li>
                        <code>variant=&quot;narrow&quot;</code> 는 폭 752 입니다 — 점 x 40 ~ 712, 바닥선 x 0 ~ 752, 기간
                        이름 17px 이고 높이 · 세로 위치 · 점 · 값 글자는 기본과 같습니다(진단브리핑 분기별 종업원수 —
                        오른쪽 360 칸에 인당 매출액).
                    </li>
                </ul>
                <Example
                    title="compact (높이 290)"
                    description="신용/재무정보 차입금 변동률. 값 범위 25 ~ 39 → 20 ~ 40."
                >
                    <ValueLineChart
                        variant="compact"
                        data={COMPACT_DATA}
                        color={LINE_COLOR}
                        ariaLabel="월별 차입금 변동률 예시"
                    />
                </Example>
                <Example title="medium (높이 340)" description="활동성정보 분기별 종업원수. 값 범위 25 ~ 39 → 20 ~ 40.">
                    <ValueLineChart
                        variant="medium"
                        data={STANDARD_DATA}
                        color={LINE_COLOR}
                        ariaLabel="분기별 종업원수(medium) 예시"
                    />
                </Example>
                <Example title="narrow (폭 752)" description="진단브리핑 분기별 종업원수. 두 칸 중 넓은 칸에 그립니다.">
                    <div className="max-w-188">
                        <ValueLineChart
                            variant="narrow"
                            data={STANDARD_DATA}
                            color={LINE_COLOR}
                            ariaLabel="분기별 종업원수(narrow) 예시"
                        />
                    </div>
                </Example>
                <CodeBlock code={COMPACT_CODE} language="tsx" copyLabel="compact 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="vlc-edge" className="flex flex-col gap-6">
                <SectionHeading id="vlc-edge" title="3. 엣지 케이스">
                    데이터에 따라 선 · 글자가 그림 밖으로 나가거나 서로 겹치지 않도록 자동으로 맞춥니다.
                </SectionHeading>
                <div className="flex flex-col gap-8">
                    {EDGE_CASES.map((item) => (
                        <Example key={item.key} title={item.title} description={item.description}>
                            <ValueLineChart data={item.data} color={LINE_COLOR} ariaLabel={`${item.title} 예시`} />
                        </Example>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="vlc-loading" className="flex flex-col gap-6">
                <SectionHeading id="vlc-loading" title="4. 불러오는 중 (ValueLineChartSkeleton)">
                    차트와 같은 그림 범위(1168 × 440)에 바닥선 · 선 · 점 · 값 글자 · 기간 이름 자리를 그립니다. 불러온
                    뒤 자리 · 높이가 흔들리지 않습니다. 인쇄본은 데이터를 받은 뒤 서버에서 바로 그려 스켈레톤 없이
                    나옵니다.
                </SectionHeading>
                <Example title="불러오는 중" description="회색 자리 · 깜빡임으로 불러오는 중임을 보입니다.">
                    <ValueLineChartSkeleton label="분기별 종업원수를 불러오는 중입니다." />
                </Example>
                <Example title="불러온 뒤" description="같은 자리에 차트가 그려집니다.">
                    <ValueLineChart data={STANDARD_DATA} color={LINE_COLOR} ariaLabel="불러온 뒤 예시" />
                </Example>
                <Example title="불러오는 중 · compact" description="variant 를 같게 넘기면 높이 290 자리를 잡습니다.">
                    <ValueLineChartSkeleton
                        variant="compact"
                        pointCount={12}
                        label="차입금 변동률을 불러오는 중입니다."
                    />
                </Example>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="vlc-print" className="flex flex-col gap-6">
                <SectionHeading id="vlc-print" title="5. K-BIGx 인쇄본에서">
                    진단브리핑은 소제목 아래 16 에 두고, 다음 소블록(인당 매출액)과는 168 띄웁니다. 신용/재무정보 차입금
                    분석은 compact 로 두고 선 색은 kbx 보라, 세로 점선은 chart-grid, 바닥선은 chart-line-subtle 입니다.
                    확인 화면:{' '}
                    <Link
                        href="/corp/k-bigx-report/innovation-growth-report/report-print?sections=briefing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        K-BIGx 보고서 인쇄본 진단브리핑
                        <span className="sr-only"> (새 창)</span>
                    </Link>
                </SectionHeading>
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="vlc-a11y" className="flex flex-col gap-6">
                <SectionHeading id="vlc-a11y" title="6. 접근성" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 기간마다 값을
                        화면에 보이지 않는 목록으로도 읽어 줍니다(값 없음 · 건너뛴 기간 이름 포함)[5.1.1].
                    </li>
                    <li>값을 글자로 적어 색만으로 정보를 전하지 않습니다[5.3.1].</li>
                    <li>
                        스켈레톤은 <code>role=&quot;status&quot;</code> 와 숨김 문구로 불러오는 중임을 알립니다.
                    </li>
                    <li>마우스 반응과 움직임이 없습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="vlc-props" className="flex flex-col gap-6">
                <SectionHeading id="vlc-props" title="7. Props API">
                    <code>data</code> · <code>ariaLabel</code> 이 필수입니다.
                </SectionHeading>
                <PropsTable items={PROPS_ITEMS} caption="ValueLineChart · ValueLineChartSkeleton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ValueLineChartGuidePage
