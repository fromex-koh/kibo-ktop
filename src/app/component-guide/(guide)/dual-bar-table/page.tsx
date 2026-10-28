// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {DualBarTableSkeleton} from '@/components/composite/dual-bar-table-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {DualBarTable, type DualBarTableItem} from '@/components/custom/dual-bar-table'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '두 값 막대 표 (DualBarTable)'}

const LINK_CLASS = 'text-primary underline underline-offset-4'

// 웹 화면 보고서와 같은 계열 색(다크에서도 보이는 보고서 계열 색).
const LEFT = {title: '기업수', color: 'var(--ds-report-series-3)'}
const RIGHT = {title: '특허수', color: 'var(--ds-report-series-2)'}

// 이름 · 기업수 · 특허수 → 표 데이터.
const toData = (rows: readonly (readonly [string, number, number])[]): DualBarTableItem[] =>
    rows.map(([label, left, right], index) => ({id: `${label}-${index}`, label, left, right}))

// 템플릿 데이터(매출 규모 5구간).
const STANDARD_DATA = toData([
    ['10억원 이하', 13547, 3547],
    ['30억원 이하', 5678, 8536],
    ['100억원 이하', 1532, 2987],
    ['300억원 이하', 2657, 6578],
    ['300억원 초과', 800, 3957],
])
// 3. 엣지 케이스.
const SINGLE_DATA = toData([['10억원 이하', 13547, 3547]])
const ZERO_DATA = toData([
    ['10억원 이하', 13547, 0],
    ['30억원 이하', 0, 8536],
    ['100억원 이하', 1532, 2987],
])
const ALL_ZERO_DATA = toData([
    ['10억원 이하', 0, 3547],
    ['30억원 이하', 0, 8536],
])
const SAME_DATA = toData([
    ['10억원 이하', 5000, 5000],
    ['30억원 이하', 5000, 5000],
])
const LARGE_DATA = toData([
    ['10억원 이하', 123456789, 3547],
    ['30억원 이하', 98765432, 8536],
    ['100억원 이하', 1, 2987],
])
const LONG_DATA = toData([
    ['매출 규모 10억원 이하 소기업', 13547, 3547],
    ['매출 규모 300억원 초과 중견기업', 800, 3957],
])

const EDGE_CASES = [
    {
        key: 'single',
        title: '항목 하나',
        description: '하나뿐이면 그 값이 가장 큰 값이라 두 막대 모두 78% 길이입니다.',
        data: SINGLE_DATA,
    },
    {
        key: 'zero',
        title: '0 값',
        description: '0 은 막대를 그리지 않고 숫자 0 만 적습니다.',
        data: ZERO_DATA,
    },
    {
        key: 'all-zero',
        title: '한 열이 모두 0',
        description: '그 열은 막대 없이 숫자만 적고, 다른 열은 그대로 그립니다.',
        data: ALL_ZERO_DATA,
    },
    {key: 'same', title: '값이 모두 같음', description: '모든 막대가 같은 78% 길이입니다.', data: SAME_DATA},
    {
        key: 'large',
        title: '값 차이가 클 때',
        description: '숫자는 천 단위 쉼표로 적고, 아주 작은 값의 막대는 거의 보이지 않습니다(숫자로 읽음).',
        data: LARGE_DATA,
    },
    {
        key: 'long',
        title: '이름이 길 때',
        description: '이름은 띄어쓰기 기준으로 줄을 바꾸고, 줄 높이만큼 행이 높아집니다.',
        data: LONG_DATA,
    },
] as const

const USAGE_CODE = `import {DualBarTable} from '@/components/custom/dual-bar-table'

<DualBarTable
  caption="매출 규모별 기업수(개) · 특허수(건)"
  categoryTitle="매출 규모"
  left={{title: '기업수', color: 'var(--ds-report-series-3)'}}
  right={{title: '특허수', color: 'var(--ds-report-series-2)'}}
  data={marketScale.rows.map((row) => ({
    id: row.id,
    label: row.label,
    left: row.companies,
    right: row.patents,
  }))}
/>`

const LOADING_CODE = `import {DualBarTableSkeleton} from '@/components/composite/dual-bar-table-skeleton'

// 줄 수 · 클래스를 실제 표와 같게 넘기면 자리가 흔들리지 않습니다.
{isLoading ? (
  <DualBarTableSkeleton rowCount={5} label="매출 규모별 현황을 불러오는 중입니다." />
) : (
  <DualBarTable {...tableProps} />
)}`

const PRINT_CODE = `// K-BIGx PDF 템플릿 — 21px · 머리 줄 위아래 10 · 값 줄 7 · 이름 열 170 · 막대 18 · 숫자 칸 90(kbigx-print-innovation.tsx).
<DualBarTable
  caption="매출 규모별 기업수(개) · 특허수(건)"
  categoryTitle="매출 규모"
  // 기업수 진남 · 특허수 파랑(범례 칩도 같은 토큰)
  left={{title: '기업수', color: 'var(--kbx-color-chart-series-1)'}}
  right={{title: '특허수', color: 'var(--kbx-color-chart-series-2)'}}
  data={rows}
  tableClassName="kbx-text-21 text-kbx-foreground border-kbx-primary kbx-border-t-strong"
  headClassName="bg-kbx-surface text-kbx-primary font-kbx-bold py-2.5"
  rowClassName="border-kbx-border kbx-border-b-hairline py-kbx-7"
  labelWidthClassName="w-42.5"
  labelClassName="pl-3.5 font-kbx-bold"
  barClassName="h-4.5"
  valueClassName="w-22.5"
/>`

// PDF 템플릿 색 — kbigx-print-innovation.tsx 의 MARKET_SCALE_BARS 와 같다(.kbigx-print 안에서만 kbx 값이 있다).
const PRINT_LEFT = {title: '기업수', color: 'var(--kbx-color-chart-series-1)'}
const PRINT_RIGHT = {title: '특허수', color: 'var(--kbx-color-chart-series-2)'}

const PROPS_ITEMS = [
    ['DualBarTable', 'caption', '표 이름입니다(화면에 보이지 않는 caption).', '-', 'string'],
    ['DualBarTable', 'categoryTitle', '첫 열 머리 이름입니다(예: 매출 규모).', '-', 'string'],
    ['DualBarTable', 'left · right', '두 값 열의 머리 이름 · 막대 색입니다.', '-', '{title: string; color: string}'],
    ['DualBarTable', 'data', '항목 목록입니다. 화면에 그릴 순서로 넘깁니다.', '-', 'readonly DualBarTableItem[]'],
    ['DualBarTable', 'emptyText', '항목이 없을 때 문구입니다.', "'표시할 데이터가 없습니다.'", 'string'],
    [
        'DualBarTable',
        'tableClassName · headClassName · rowClassName',
        '표 글자 · 위 선, 머리 줄 바탕 · 여백, 값 줄 여백 · 아래 선입니다. 주면 기본값을 대신합니다(섞지 않음).',
        '웹 시맨틱 클래스',
        'string',
    ],
    [
        'DualBarTable',
        'labelWidthClassName · labelClassName',
        '이름 열 폭(w-*), 이름 칸 왼쪽 여백 · 굵기입니다.',
        "'w-40' · 'pl-3.5 font-bold'",
        'string',
    ],
    [
        'DualBarTable',
        'barClassName · valueClassName',
        '막대 높이(h-*) · 숫자 칸 폭(w-*)입니다.',
        "'h-4' · 'w-20'",
        'string',
    ],
    ['DualBarTableItem', 'id · label', '항목 식별자 · 이름입니다.', '-', 'string · ReactNode'],
    [
        'DualBarTableItem',
        'left · right',
        "두 열의 값입니다. 0 이하는 막대를 그리지 않습니다. 숫자가 아니면(NaN) 값 없음 — 막대 없이 '-'(0 은 '0'). K-BIGx 매출 규모 표는 5행 고정(toMarketScaleRows)이라 데이터가 없어도 5행 모두 '-'.",
        '-',
        'number',
    ],
    ['DualBarTableSkeleton', 'rowCount', '값 줄 수입니다.', '5', 'number'],
    [
        'DualBarTableSkeleton',
        'label · tableClassName · headClassName · rowClassName · labelWidthClassName · barClassName · valueClassName',
        '불러오는 중 문구와 실제 표에 넘긴 것과 같은 클래스입니다 — 같게 넘기면 높이가 같습니다.',
        "'표를 불러오는 중입니다.'",
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

const DualBarTableGuidePage = () => (
    <GuidePageShell
        title="두 값 막대 표 (DualBarTable)"
        description="항목마다 두 값(예: 기업수 · 특허수)을 가로 막대와 숫자로 나란히 적는 표입니다. K-BIGx 보고서 PDF 템플릿 기술혁신정보의 매출 규모별 기업 및 특허 현황입니다."
    >
        <BaseCard>
            <section aria-labelledby="dbt-basic" className="flex flex-col gap-6">
                <SectionHeading id="dbt-basic" title="1. 기본 사용">
                    서버에서 바로 그리는 표입니다. 가운데 축에서 좌우로 뻗는 웹 화면용 막대는{' '}
                    <Link href="/component-guide/butterfly-bar-chart" className={LINK_CLASS}>
                        ButterflyBarChart
                    </Link>
                    입니다.
                </SectionHeading>
                <Example
                    title="템플릿 데이터"
                    description="매출 규모 5구간 — 열마다 가장 큰 값이 막대 칸의 78% 입니다."
                >
                    <DualBarTable
                        caption="매출 규모별 기업수 · 특허수 예시"
                        categoryTitle="매출 규모"
                        left={LEFT}
                        right={RIGHT}
                        data={STANDARD_DATA}
                    />
                </Example>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dbt-rule" className="flex flex-col gap-6">
                <SectionHeading id="dbt-rule" title="2. 짜임 규칙" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>표 위에 굵은 선, 머리 줄은 옅은 면, 값 줄마다 아래 옅은 선을 둡니다.</li>
                    <li>첫 칸은 항목 이름(굵게), 다음 두 칸은 [막대 | 숫자(오른쪽 정렬)] 이고 열 사이는 32 입니다.</li>
                    <li>
                        막대는 열마다 따로 견줍니다 — 그 열의 가장 큰 값이 막대 칸의 78%, 나머지는 값에 비례합니다.
                        숫자와 막대 끝 사이에 여백이 남습니다.
                    </li>
                    <li>크기 · 글자 · 선 모양은 className 들로 바꿉니다 — PDF 템플릿은 kbx 클래스를 넘깁니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dbt-edge" className="flex flex-col gap-6">
                <SectionHeading id="dbt-edge" title="3. 엣지 케이스">
                    항목 수 · 0 값 · 값 차이 · 이름 길이에 따라 모양을 맞춥니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    {EDGE_CASES.map((item) => (
                        <Example key={item.key} title={item.title} description={item.description}>
                            <DualBarTable
                                caption={`${item.title} 예시`}
                                categoryTitle="매출 규모"
                                left={LEFT}
                                right={RIGHT}
                                data={item.data}
                            />
                        </Example>
                    ))}
                    <Example title="항목 없음" description="항목이 없으면 머리 줄 아래 emptyText 한 줄만 보입니다.">
                        <DualBarTable
                            caption="항목 없음 예시"
                            categoryTitle="매출 규모"
                            left={LEFT}
                            right={RIGHT}
                            data={[]}
                        />
                    </Example>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dbt-loading" className="flex flex-col gap-6">
                <SectionHeading id="dbt-loading" title="4. 불러오는 중 (DualBarTableSkeleton)">
                    같은 표 짜임에 이름 · 막대 · 숫자 자리를 회색으로 그립니다. PDF 템플릿은 데이터를 받은 뒤 서버에서
                    바로 그려 스켈레톤 없이 나옵니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    <Example title="불러오는 중" description="회색 자리 · 깜빡임으로 불러오는 중임을 보입니다.">
                        <DualBarTableSkeleton label="매출 규모별 현황을 불러오는 중입니다." />
                    </Example>
                    <Example title="불러온 뒤" description="같은 자리에 표가 그려집니다.">
                        <DualBarTable
                            caption="불러온 뒤 예시"
                            categoryTitle="매출 규모"
                            left={LEFT}
                            right={RIGHT}
                            data={STANDARD_DATA}
                        />
                    </Example>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dbt-print" className="flex flex-col gap-6">
                <SectionHeading id="dbt-print" title="5. K-BIGx PDF 템플릿에서">
                    기술혁신정보 3쪽 — 소제목 오른쪽에 기업수 · 특허수 범례(KbxLegend density=&quot;unit&quot;), 표 아래
                    28 간격에 기업수 · 특허수 비중 도넛(DonutListChart)을 나란히 둡니다. 확인 화면:{' '}
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
                        기업수는 진남(chart-series-1), 특허수는 파랑(chart-series-2) — 범례 순서와 명도 순서(진함 →
                        중간)가 같아 흑백 인쇄에서도 두 계열이 갈립니다. 범례 칩(bg-kbx-chart-series-1 · 2)도 같은
                        토큰입니다.
                    </li>
                </ul>
                <Example
                    title="PDF 템플릿 색"
                    description="kbx 색을 넘긴 모습입니다(.kbigx-print 안 · 다크에서도 흰 바탕)."
                >
                    <div className="kbigx-print bg-kbx-paper rounded-sm p-4">
                        <DualBarTable
                            caption="매출 규모별 기업수 · 특허수 PDF 템플릿 색 예시"
                            categoryTitle="매출 규모"
                            left={PRINT_LEFT}
                            right={PRINT_RIGHT}
                            data={STANDARD_DATA}
                        />
                    </div>
                </Example>
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dbt-a11y" className="flex flex-col gap-6">
                <SectionHeading id="dbt-a11y" title="6. 접근성" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        실제 표(table)라 <code>caption</code> · 열 머리(<code>scope=&quot;col&quot;</code>) · 행 머리(
                        <code>scope=&quot;row&quot;</code>)로 값을 읽어 줍니다[7.3.2].
                    </li>
                    <li>
                        값을 숫자로 함께 적어 막대 길이 · 색만으로 정보를 전하지 않습니다[5.3.1]. 막대는 꾸밈이라
                        낭독하지 않습니다.
                    </li>
                    <li>
                        스켈레톤은 <code>role=&quot;status&quot;</code> 와 숨김 문구로 불러오는 중임을 알립니다.
                    </li>
                    <li>마우스 반응과 움직임이 없습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dbt-props" className="flex flex-col gap-6">
                <SectionHeading id="dbt-props" title="7. Props API">
                    <code>caption</code> · <code>categoryTitle</code> · <code>left</code> · <code>right</code> ·{' '}
                    <code>data</code> 가 필수입니다.
                </SectionHeading>
                <PropsTable items={PROPS_ITEMS} caption="DualBarTable · DualBarTableSkeleton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default DualBarTableGuidePage
