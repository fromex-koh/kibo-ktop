// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {RatingTrendChartSkeleton} from '@/components/composite/rating-trend-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {RatingTrendChart, type RatingTrendItem} from '@/components/custom/rating-trend-chart'
import {criGradePercentage, findCriGrade} from '@/content/service/cri-grades'

export const metadata: Metadata = {title: '등급 이력 꺾은선 (RatingTrendChart)'}

const LINK_CLASS = 'text-primary underline underline-offset-4'

// 등급 높낮이 — CRI 등급표 순서(표에 없는 코드는 0).
const toRank = (grade: string) => {
    const item = findCriGrade(grade)
    return item ? criGradePercentage(item) : 0
}
// 시점 + 등급 → 차트 데이터.
const toData = (rows: readonly (readonly [string, string])[]): RatingTrendItem[] =>
    rows.map(([label, grade]) => ({id: label, label, grade, rank: toRank(grade)}))

// 템플릿 데이터.
const STANDARD_DATA = toData([
    ['23.09월', 'A-'],
    ['24.11월', 'BBB+'],
    ['25.10월', 'BBB0'],
])
// 엣지 케이스.
const RISING_DATA = toData([
    ['23.09월', 'BB0'],
    ['24.11월', 'BBB-'],
    ['25.10월', 'A0'],
])
const SAME_DATA = toData([
    ['23.09월', 'BBB0'],
    ['24.11월', 'BBB0'],
    ['25.10월', 'BBB0'],
])
const SINGLE_DATA = toData([['25.10월', 'BBB0']])
const MANY_DATA = toData([
    ['21.09월', 'A+'],
    ['22.03월', 'A0'],
    ['22.09월', 'A-'],
    ['23.09월', 'A-'],
    ['24.11월', 'BBB+'],
    ['25.10월', 'BBB0'],
])

const EDGE_CASES = [
    {
        key: 'rising',
        title: '등급이 오를 때',
        description: '높은 등급이 위 줄입니다 — 선이 오른쪽 위로 올라갑니다.',
        data: RISING_DATA,
    },
    {
        key: 'same',
        title: '등급이 모두 같을 때',
        description: '서로 다른 등급이 하나라 줄 하나(가운데 y 130)에 놓습니다.',
        data: SAME_DATA,
    },
    {
        key: 'single',
        title: '평가가 한 번',
        description: '점 하나를 가운데에 두고 선은 긋지 않습니다.',
        data: SINGLE_DATA,
    },
    {
        key: 'many',
        title: '평가가 많을 때(6번)',
        description: '점은 x 150 ~ 610 사이에 같은 간격으로 놓고, 같은 등급은 같은 줄입니다.',
        data: MANY_DATA,
    },
] as const

const USAGE_CODE = `import {RatingTrendChart} from '@/components/custom/rating-trend-chart'
import {criGradePercentage, findCriGrade} from '@/content/service/cri-grades'

// 시간순(오래된 것부터)으로 넘깁니다. rank 는 등급표 순서(클수록 위)입니다.
<RatingTrendChart
  ariaLabel="기업신용등급 이전평가이력"
  data={ratingHistory.map((item) => {
    const grade = findCriGrade(item.grade)
    return {
      id: item.date,
      label: item.chartLabel,
      grade: item.grade,
      rank: grade ? criGradePercentage(grade) : 0, // 표에 없는 코드는 맨 아래
    }
  })}
/>`

const LOADING_CODE = `import {RatingTrendChartSkeleton} from '@/components/composite/rating-trend-chart-skeleton'

{isLoading ? (
  <RatingTrendChartSkeleton pointCount={3} label="이전평가이력을 불러오는 중입니다." />
) : (
  <RatingTrendChart data={history} ariaLabel="기업신용등급 이전평가이력" />
)}`

const PRINT_CODE = `// K-BIGx PDF 템플릿 — 선 · 글자 색을 kbx 토큰으로 넘깁니다(kbigx-print-credit.tsx).
<RatingTrendChart
  data={history}
  ariaLabel="기업신용등급 이전평가이력"
  colors={{
    line: 'var(--kbx-color-blue)',
    grid: 'var(--kbx-color-border)',
    grade: 'var(--kbx-color-foreground)',
    current: 'var(--kbx-color-blue)',
    label: 'var(--kbx-color-foreground-subtle)',
    dotFill: 'var(--kbx-color-paper)',
  }}
/>`

const PROPS_ITEMS = [
    [
        'RatingTrendChart',
        'data',
        '평가 목록입니다. 시간순(오래된 것부터)으로 넘깁니다.',
        '-',
        'readonly RatingTrendItem[]',
    ],
    ['RatingTrendChart', 'ariaLabel', '차트 전체의 이름입니다.', '-', 'string'],
    [
        'RatingTrendChart',
        'colors',
        '선 · 글자 색(line · grid · grade · current · label · dotFill)입니다. 넘기지 않으면 웹 시맨틱 색입니다.',
        '웹 시맨틱 색',
        'Partial<RatingTrendColors>',
    ],
    ['RatingTrendItem', 'id · label', '점 식별자와 시점(아래 글자)입니다.', '-', 'string'],
    ['RatingTrendItem', 'grade', '등급 글자(점 위)입니다.', '-', 'string'],
    ['RatingTrendItem', 'rank', '등급 높낮이입니다. 클수록 위 줄, 같으면 같은 줄입니다.', '-', 'number'],
    [
        'RatingTrendChartSkeleton',
        'label',
        '불러오는 중 문구(화면 낭독기용)입니다.',
        "'등급 이력을 불러오는 중입니다.'",
        'string',
    ],
    ['RatingTrendChartSkeleton', 'pointCount', '점 수입니다.', '3', 'number'],
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

const RatingTrendChartGuidePage = () => (
    <GuidePageShell
        title="등급 이력 꺾은선 (RatingTrendChart)"
        description="시점마다 받은 등급을 등급 높낮이 줄 위에 점으로 찍고 선으로 잇는 차트입니다. 세로축 없이 점 위 등급 글자로 읽고, 가장 최근 점은 채운 점 · 강조 색입니다. K-BIGx 보고서 PDF 템플릿 신용/재무정보의 기업신용등급 이전평가이력 · 현금흐름등급 평가이력 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="rtc-basic" className="flex flex-col gap-6">
                <SectionHeading id="rtc-basic" title="1. 기본 사용">
                    그림 680 × 280 기준으로 그리고 칸 폭에 맞춰 같은 비율로 줄어듭니다. 원호 · 툴팁이 있는 웹 화면용은{' '}
                    <Link href="/component-guide/grade-history-chart" className={LINK_CLASS}>
                        GradeHistoryChart
                    </Link>
                    , 등급 눈금 격자 위 비교 기준선은{' '}
                    <Link href="/component-guide/grade-trend-chart" className={LINK_CLASS}>
                        GradeTrendChart
                    </Link>
                    입니다.
                </SectionHeading>
                <Example
                    title="템플릿 데이터"
                    description="A- → BBB+ → BBB0. 마지막(현재) 점은 채운 점 · 강조 색 글자."
                >
                    <RatingTrendChart data={STANDARD_DATA} ariaLabel="이전평가이력 예시" className="max-w-170" />
                </Example>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rtc-rule" className="flex flex-col gap-6">
                <SectionHeading id="rtc-rule" title="2. 짜임 규칙" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        받은 등급 가운데 서로 다른 등급마다 가로줄(x 90 ~ 680)을 긋습니다 — 높은 등급이 위(y 50), 낮은
                        등급이 아래(y 210), 그 사이는 같은 간격입니다.
                    </li>
                    <li>점은 x 150 ~ 610 사이에 같은 간격으로 놓습니다(하나면 가운데).</li>
                    <li>
                        점 = 흰 면 + 테두리 4 · 반지름 10(마지막은 채운 점 · 반지름 12), 등급 글자 = 점 20 위(22px 가장
                        굵게), 시점 = y 266(20px).
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rtc-edge" className="flex flex-col gap-6">
                <SectionHeading id="rtc-edge" title="3. 엣지 케이스" />
                <div className="grid gap-6 xl:grid-cols-2">
                    {EDGE_CASES.map((item) => (
                        <Example key={item.key} title={item.title} description={item.description}>
                            <RatingTrendChart data={item.data} ariaLabel={`${item.title} 예시`} />
                        </Example>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rtc-loading" className="flex flex-col gap-6">
                <SectionHeading id="rtc-loading" title="4. 불러오는 중 (RatingTrendChartSkeleton)">
                    차트와 같은 그림 범위(680 × 280)에 등급 줄 · 선 · 점 · 등급 글자 · 시점 자리를 그립니다. PDF
                    템플릿은 데이터를 받은 뒤 서버에서 바로 그려 스켈레톤 없이 나옵니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    <Example title="불러오는 중" description="회색 자리 · 깜빡임으로 불러오는 중임을 보입니다.">
                        <RatingTrendChartSkeleton label="이전평가이력을 불러오는 중입니다." />
                    </Example>
                    <Example title="불러온 뒤" description="같은 자리에 차트가 그려집니다.">
                        <RatingTrendChart data={STANDARD_DATA} ariaLabel="불러온 뒤 예시" />
                    </Example>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rtc-print" className="flex flex-col gap-6">
                <SectionHeading id="rtc-print" title="5. K-BIGx PDF 템플릿에서">
                    이전평가이력 · 평가이력 소제목 아래 16 에 그래프(3) · 표(2)를 48 간격으로 나란히 둡니다.
                    기업신용등급 표는 최근 것부터 지금 등급을 뺀 지난 평가만, 현금흐름등급 표는 평가이력 전체를 최근
                    것부터 적습니다. 현금흐름등급 높낮이(rank)는 CF1 이 위가 되도록 7 − 단계 숫자(cashFlowLevel)입니다.
                    확인 화면:{' '}
                    <Link
                        href="/corp/k-bigx-report/innovation-growth-report/report-print?sections=credit-finance"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        K-BIGx 보고서 PDF 템플릿 신용/재무정보
                        <span className="sr-only"> (새 창)</span>
                    </Link>
                </SectionHeading>
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rtc-a11y" className="flex flex-col gap-6">
                <SectionHeading id="rtc-a11y" title="6. 접근성" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그림은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 시점마다
                        등급을 화면에 보이지 않는 목록으로도 읽어 줍니다[5.1.1].
                    </li>
                    <li>등급을 글자로 적어 색 · 점 모양만으로 정보를 전하지 않습니다[5.3.1].</li>
                    <li>
                        스켈레톤은 <code>role=&quot;status&quot;</code> 와 숨김 문구로 불러오는 중임을 알립니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rtc-props" className="flex flex-col gap-6">
                <SectionHeading id="rtc-props" title="7. Props API">
                    <code>data</code> · <code>ariaLabel</code> 이 필수입니다.
                </SectionHeading>
                <PropsTable items={PROPS_ITEMS} caption="RatingTrendChart · RatingTrendChartSkeleton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RatingTrendChartGuidePage
