// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {RatioStackBar, type RatioStackItem} from '@/components/custom/ratio-stack-bar'
import {Skeleton} from '@/components/ui/skeleton'

export const metadata: Metadata = {title: '비율 막대 (RatioStackBar)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const SECTION_HEAD = 'flex max-w-4xl flex-col gap-2'
const BLOCKS = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'

const CREDIT_COLOR = 'var(--raw-blue-500)'
const COLLATERAL_COLOR = 'var(--raw-mint-700)'

const pair = (credit: number, collateral: number): RatioStackItem[] => [
    {id: 'credit', label: '신용', value: credit, color: CREDIT_COLOR},
    {id: 'collateral', label: '담보', value: collateral, color: COLLATERAL_COLOR},
]

const REPORT_DATA = pair(43.8, 56.2)

const USAGE_CODE = `import {RatioStackBar} from '@/components/custom/ratio-stack-bar'

<RatioStackBar
  data={[
    {id: 'credit', label: '신용', value: 43.8, color: 'var(--raw-blue-500)'},
    {id: 'collateral', label: '담보', value: 56.2, color: 'var(--raw-mint-700)'},
  ]}
/>`

const DATA_CODE = `// 비율(%)이든 금액이든 넘긴다. 범례 비율은 합계 대비로 다시 계산한다.
<RatioStackBar
  data={[
    {id: 'credit', label: '신용', value: current.creditRatio, color: 'var(--raw-blue-500)'},
    {id: 'collateral', label: '담보', value: current.collateralRatio, color: 'var(--raw-mint-700)'},
  ]}
/>`

const CHOICE_COLUMNS = [
    {key: 'case', header: '표현할 값', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
] as const

const CHOICE_ROWS = [
    {key: 'stack', cells: ['전체 대비 항목 비율을 한 줄 막대와 범례로', <code key="c">RatioStackBar</code>]},
    {
        key: 'donut',
        cells: [
            '한 값의 비율을 원형으로',
            <Link key="c" href="/component-guide/percentage-donut-chart" className={LINK_CLASS}>
                PercentageDonutChart
            </Link>,
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'RatioStackBar',
        'data',
        '항목 목록입니다. 비율이든 금액이든 넘기면 합계 대비로 계산합니다.',
        '-',
        'readonly RatioStackItem[]',
    ],
    ['RatioStackBar', 'fractionDigits', '범례 비율의 소수 자릿수입니다. 0~4 로 맞춥니다.', '1', 'number'],
    ['RatioStackBar', 'className', '바깥 div 에 덧붙일 클래스입니다. 그 밖의 div 속성도 받습니다.', '-', 'string'],
    ['RatioStackItem', 'id', '항목을 구분하는 고유 값입니다.', '-', 'string'],
    ['RatioStackItem', 'label', '범례 이름입니다.', '-', 'string'],
    ['RatioStackItem', 'value', '값입니다. 0 이하 · 숫자가 아닌 값은 막대에서 뺍니다.', '-', 'number'],
    ['RatioStackItem', 'color', '막대 · 칩 색(토큰 변수)입니다.', '-', 'string'],
] as const

const SPECIAL_CASES: readonly {title: string; description: string; data: RatioStackItem[]}[] = [
    {
        title: '합이 100 이 아닐 때',
        description: '합계로 나눠 비율을 다시 계산하므로 반올림 오차나 금액을 넘겨도 막대가 끝까지 찹니다.',
        data: pair(2000, 3862),
    },
    {
        title: '한쪽이 0',
        description: '0 인 항목은 막대에서 빼고 범례에는 0.0% 로 남깁니다.',
        data: pair(0, 56.2),
    },
    {
        title: '아주 작은 비율',
        description: '0 보다 크면 최소 폭(4)은 칠해 보이게 합니다.',
        data: pair(0.1, 99.9),
    },
    {
        title: '모두 0 (자료 없음)',
        description: '빈 회색 막대만 두고 범례는 모두 0.0% 로 적습니다.',
        data: pair(0, 0),
    },
    {
        title: '음수',
        description: '0 이하 · 숫자가 아닌 값은 0 으로 보고 막대에서 뺍니다.',
        data: pair(-12, 56.2),
    },
    {
        title: '항목이 많을 때',
        description: '범례가 한 줄을 넘으면 오른쪽 정렬을 지키며 다음 줄로 접힙니다.',
        data: [
            {id: 'a', label: '은행업권', value: 50.5, color: 'var(--raw-navy-500)'},
            {id: 'b', label: '상호금융업권', value: 9.3, color: 'var(--raw-blue-500)'},
            {id: 'c', label: '저축은행업권', value: 10, color: 'var(--raw-blue-300)'},
            {id: 'd', label: '카드/캐피탈업권', value: 20, color: 'var(--raw-purple-500)'},
            {id: 'e', label: '대부업권', value: 10.2, color: 'var(--raw-mint-700)'},
        ],
    },
]

const RatioStackBarGuidePage = () => (
    <GuidePageShell
        title="비율 막대 (RatioStackBar)"
        description="항목별 비율을 한 줄 가로 막대에 이어 칠하고, 아래 오른쪽에 범례(이름 + 비율)를 두는 막대입니다."
    >
        <BaseCard>
            <section aria-labelledby="rsb-basic" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="rsb-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> 만 넘깁니다. 비율은 값 합계로 나눠 계산하므로 합이 100 이 아니어도 막대가
                        끝까지 찹니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex max-w-147 min-w-0 flex-col gap-6 rounded-sm border p-6">
                    <RatioStackBar data={REPORT_DATA} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rsb-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="rsb-variants" className="typo-h4-bold">
                        상태 예시
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        막대가 끝까지 차지 않거나 항목이 사라질 수 있는 경우는 컴포넌트가 처리합니다.
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
                                    <RatioStackBar data={item.data} />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            전용 스켈레톤은 없습니다. 막대와 같은 크기(높이 16 · 양 끝 둥글림)의 <code>Skeleton</code>{' '}
                            을 같은 자리에 둡니다.
                        </p>
                        <div className="grid gap-6 xl:grid-cols-2">
                            <Skeleton className="h-4 w-full rounded-full" />
                            <RatioStackBar data={REPORT_DATA} />
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rsb-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="rsb-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">표현할 값의 짜임으로 고릅니다.</p>
                </div>
                <Table caption="비율 차트 선택 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rsb-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="rsb-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        막대는 <code>aria-hidden</code> 장식이고, 범례 글자(이름 + 비율)가 값을 전합니다. 숨김 표나{' '}
                        <code>ariaLabel</code> 은 없으므로 앞뒤 제목으로 맥락을 줍니다[5.1.1].
                    </li>
                    <li>항목은 색 칩과 함께 이름과 비율 글자로 구분합니다. 색만으로 전하지 않습니다[5.3.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rsb-props" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="rsb-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>data</code> 만 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="RatioStackBar Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RatioStackBarGuidePage
