// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {InsideLabelPieChartSkeleton} from '@/components/composite/inside-label-pie-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {InsideLabelPieChart, type InsideLabelPieItem} from '@/components/custom/inside-label-pie-chart'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '조각 안 라벨 원형 (InsideLabelPieChart)'}

const LINK_CLASS = 'text-primary underline underline-offset-4'
const PIE_CLASS = 'max-w-82.5'

// 템플릿 데이터 — 신용 · 담보(단위: %).
const STANDARD_DATA: InsideLabelPieItem[] = [
    {id: 'credit', label: '신용', percentage: 43.8, color: 'var(--ds-report-series-1)'},
    {id: 'collateral', label: '담보', percentage: 56.2, color: 'var(--ds-report-series-4)'},
]

const EDGE_CASES = [
    {
        key: 'three',
        title: '분류가 셋',
        description: '받은 순서대로 12시에서 시계 방향으로 이어집니다.',
        data: [
            {id: 'a', label: '신용', percentage: 40, color: 'var(--ds-report-series-1)'},
            {id: 'b', label: '담보', percentage: 35, color: 'var(--ds-report-series-4)'},
            {id: 'c', label: '보증', percentage: 25, color: 'var(--ds-report-series-2)'},
        ],
    },
    {
        key: 'small',
        title: '아주 작은 조각(8%)',
        description: '12% 보다 작은 조각은 글자가 넘치므로 조각 안 라벨을 생략합니다. 값은 숨김 목록이 읽습니다.',
        data: [
            {id: 'a', label: '신용', percentage: 92, color: 'var(--ds-report-series-1)'},
            {id: 'b', label: '담보', percentage: 8, color: 'var(--ds-report-series-4)'},
        ],
    },
    {
        key: 'single',
        title: '한 분류가 100%',
        description: '원 전체가 한 조각이고 라벨은 원 가운데에 둡니다.',
        data: [{id: 'a', label: '신용', percentage: 100, color: 'var(--ds-report-series-1)'}],
    },
    {
        key: 'empty',
        title: '모두 0',
        description: '그릴 조각이 없으면 emptyText 만 보입니다.',
        data: [
            {id: 'a', label: '신용', percentage: 0, color: 'var(--ds-report-series-1)'},
            {id: 'b', label: '담보', percentage: 0, color: 'var(--ds-report-series-4)'},
        ],
    },
] as const

const USAGE_CODE = `import {InsideLabelPieChart} from '@/components/custom/inside-label-pie-chart'

<InsideLabelPieChart
  ariaLabel="최근 신용/담보 비중"
  data={[
    {id: 'credit', label: '신용', percentage: 43.8, color: 'var(--ds-report-series-1)'},
    {id: 'collateral', label: '담보', percentage: 56.2, color: 'var(--ds-report-series-4)'},
  ]}
  className="max-w-82.5"
/>`

const LOADING_CODE = `import {InsideLabelPieChartSkeleton} from '@/components/composite/inside-label-pie-chart-skeleton'

// 실제 차트와 같은 크기 클래스를 넘기면 자리가 흔들리지 않습니다.
{isLoading ? (
  <InsideLabelPieChartSkeleton className="max-w-82.5" label="신용/담보 비중을 불러오는 중입니다." />
) : (
  <InsideLabelPieChart data={shares} ariaLabel="최근 신용/담보 비중" className="max-w-82.5" />
)}`

const PRINT_CODE = `// K-BIGx 인쇄본 — 조각 · 글자 · 사이 선을 kbx 색으로 넘깁니다(kbigx-print-credit.tsx).
<InsideLabelPieChart
  ariaLabel="최근 신용/담보 비중"
  data={[
    {id: 'credit', label: '신용', percentage: 43.8, color: 'var(--kbx-color-navy)'},
    {id: 'collateral', label: '담보', percentage: 56.2, color: 'var(--kbx-color-mint)'},
  ]}
  gapColor="var(--kbx-color-paper)"
  labelColor="var(--kbx-color-paper)"
  className="w-82.5 justify-self-center"
/>`

const PROPS_ITEMS = [
    [
        'InsideLabelPieChart',
        'data',
        '조각 목록입니다. 그릴 순서대로 넘깁니다(2 ~ 4개).',
        '-',
        'readonly InsideLabelPieItem[]',
    ],
    ['InsideLabelPieChart', 'ariaLabel', '차트 전체의 이름입니다.', '-', 'string'],
    ['InsideLabelPieChart', 'gapColor', '조각 사이 선 색입니다. 바탕색과 같게 둡니다.', "'var(--ds-card)'", 'string'],
    ['InsideLabelPieChart', 'labelColor', '조각 안 글자 색입니다.', "'var(--ds-primary-foreground)'", 'string'],
    [
        'InsideLabelPieChart',
        'formatPercentage',
        '비중 글자 형식입니다.',
        '소수 첫째 자리까지(43.8 · 50)',
        '(value: number) => string',
    ],
    ['InsideLabelPieChart', 'emptyText', '그릴 조각이 없을 때 문구입니다.', "'표시할 데이터가 없습니다.'", 'string'],
    ['InsideLabelPieItem', 'id · label', '조각 식별자와 이름(조각 안 윗줄)입니다.', '-', 'string'],
    ['InsideLabelPieItem', 'percentage', '비중(%)입니다. 적힌 그대로 보입니다.', '-', 'number'],
    [
        'InsideLabelPieItem',
        'color',
        '조각 색(CSS 색 값)입니다. 흰 글자와 4.5:1 이상인 짙은 색을 씁니다.',
        '-',
        'string',
    ],
    [
        'InsideLabelPieChartSkeleton',
        'label',
        '불러오는 중 문구(화면 낭독기용)입니다.',
        "'그래프를 불러오는 중입니다.'",
        'string',
    ],
    [
        'InsideLabelPieChart',
        'emptyClassName',
        '빈 상태 모양(여백 · 바탕 · 글자)입니다. K-BIGx 인쇄본은 차트 빈 상태(KbxChartEmpty)와 같은 모양으로 넘깁니다.',
        "'text-foreground-subtle py-10 text-center'",
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

const InsideLabelPieChartGuidePage = () => (
    <GuidePageShell
        title="조각 안 라벨 원형 (InsideLabelPieChart)"
        description="몇 안 되는 분류(2 ~ 4개)의 비중을 꽉 찬 원으로 그리고, 조각마다 안쪽에 이름 · 비중을 흰 글자로 바로 적는 차트입니다. 범례 · 지시선이 없습니다. K-BIGx 보고서 인쇄본 신용/재무정보 차입금 현황의 신용/담보 비중 원형입니다."
    >
        <BaseCard>
            <section aria-labelledby="ilp-basic" className="flex flex-col gap-6">
                <SectionHeading id="ilp-basic" title="1. 기본 사용">
                    그림 230 × 230 기준으로 그리고, 크기는 사용처 className(w-* · max-w-*)으로 정합니다. 분류가 많아
                    지시선 라벨이 필요하면{' '}
                    <Link href="/component-guide/callout-pie-chart" className={LINK_CLASS}>
                        CalloutPieChart
                    </Link>
                    , 가운데가 빈 도넛 + 목록은{' '}
                    <Link href="/component-guide/donut-list-chart" className={LINK_CLASS}>
                        DonutListChart
                    </Link>
                    입니다.
                </SectionHeading>
                <Example
                    title="템플릿 데이터"
                    description="신용 43.8% · 담보 56.2%. 조각 안 윗줄 이름(19px) · 아랫줄 비중(22px)."
                >
                    <InsideLabelPieChart data={STANDARD_DATA} ariaLabel="신용/담보 비중 예시" className={PIE_CLASS} />
                </Example>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ilp-rule" className="flex flex-col gap-6">
                <SectionHeading id="ilp-rule" title="2. 짜임 규칙" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>원 = 반지름 100 · 조각 사이 흰 선 2.5. 12시에서 시계 방향으로 받은 순서대로 이어집니다.</li>
                    <li>라벨 = 조각 가운데 각도의 반지름 55 지점 — 이름 위 · 비중 아래, 두 줄 사이 26.</li>
                    <li>비중 합이 100 이 아니어도 합 기준으로 원을 채우고, 글자는 받은 비중을 그대로 적습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ilp-edge" className="flex flex-col gap-6">
                <SectionHeading id="ilp-edge" title="3. 엣지 케이스" />
                <div className="grid gap-6 xl:grid-cols-2">
                    {EDGE_CASES.map((item) => (
                        <Example key={item.key} title={item.title} description={item.description}>
                            <InsideLabelPieChart
                                data={item.data}
                                ariaLabel={`${item.title} 예시`}
                                className={PIE_CLASS}
                            />
                        </Example>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ilp-loading" className="flex flex-col gap-6">
                <SectionHeading id="ilp-loading" title="4. 불러오는 중 (InsideLabelPieChartSkeleton)">
                    같은 그림 범위(230 × 230)에 원 자리를 그립니다. 인쇄본은 서버에서 바로 그려 스켈레톤 없이 나옵니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    <Example title="불러오는 중" description="회색 자리 · 깜빡임으로 불러오는 중임을 보입니다.">
                        <InsideLabelPieChartSkeleton
                            className={PIE_CLASS}
                            label="신용/담보 비중을 불러오는 중입니다."
                        />
                    </Example>
                    <Example title="불러온 뒤" description="같은 자리에 차트가 그려집니다.">
                        <InsideLabelPieChart data={STANDARD_DATA} ariaLabel="불러온 뒤 예시" className={PIE_CLASS} />
                    </Example>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ilp-print" className="flex flex-col gap-6">
                <SectionHeading id="ilp-print" title="5. K-BIGx 인쇄본에서">
                    신용/담보 비중 소블록의 오른쪽 반에 330 크기로 가운데 둡니다(왼쪽 반은 DualLineChart 꺾은선). 확인
                    화면:{' '}
                    <Link
                        href="/corp/k-bigx-report/innovation-growth-report/report-print?sections=credit-finance"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        K-BIGx 보고서 인쇄본 신용/재무정보
                        <span className="sr-only"> (새 창)</span>
                    </Link>
                </SectionHeading>
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ilp-a11y" className="flex flex-col gap-6">
                <SectionHeading id="ilp-a11y" title="6. 접근성" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 분류마다
                        비중을 화면에 보이지 않는 목록으로도 읽어 줍니다(라벨을 생략한 작은 조각 포함)[5.1.1].
                    </li>
                    <li>조각마다 이름 · 비중을 글자로 적어 색만으로 정보를 전하지 않습니다[5.3.1].</li>
                    <li>조각 색은 흰 글자와 4.5:1 이상인 짙은 색을 씁니다[5.3.3].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ilp-props" className="flex flex-col gap-6">
                <SectionHeading id="ilp-props" title="7. Props API">
                    <code>data</code> · <code>ariaLabel</code> 이 필수입니다.
                </SectionHeading>
                <PropsTable
                    items={PROPS_ITEMS}
                    caption="InsideLabelPieChart · InsideLabelPieChartSkeleton Props 목록"
                />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default InsideLabelPieChartGuidePage
