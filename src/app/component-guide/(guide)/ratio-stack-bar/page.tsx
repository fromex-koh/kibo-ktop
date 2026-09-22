// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'
import {RatioStackBar, type RatioStackItem} from '@/components/custom/ratio-stack-bar'
import {Skeleton} from '@/components/ui/skeleton'

export const metadata: Metadata = {title: '비율 막대 (RatioStackBar)'}

const CREDIT_COLOR = 'var(--raw-blue-500)'
const COLLATERAL_COLOR = 'var(--raw-mint-700)'

const pair = (credit: number, collateral: number): RatioStackItem[] => [
    {id: 'credit', label: '신용', value: credit, color: CREDIT_COLOR},
    {id: 'collateral', label: '담보', value: collateral, color: COLLATERAL_COLOR},
]

// K-BIGx 보고서 "신용/담보 비중" 카드와 같은 값이다.
const REPORT_DATA = pair(43.8, 56.2)

const USAGE_CODE = `import {RatioStackBar} from '@/components/custom/ratio-stack-bar'

<RatioStackBar
  data={[
    {id: 'credit', label: '신용', value: 43.8, color: 'var(--raw-blue-500)'},
    {id: 'collateral', label: '담보', value: 56.2, color: 'var(--raw-mint-700)'},
  ]}
/>`

const DATA_CODE = `// [프론트엔드 연동] 비율(%) 또는 금액 어느 쪽이든 넘긴다 — 범례 비율은 합계 대비로 다시 계산해 적는다.
<RatioStackBar
  data={[
    {id: 'credit', label: '신용', value: current.creditRatio, color: 'var(--raw-blue-500)'},
    {id: 'collateral', label: '담보', value: current.collateralRatio, color: 'var(--raw-mint-700)'},
  ]}
/>`

const SHAPE_RULES = [
    '막대 높이 16 · 양 끝 둥글림(full) · 항목 사이 흰 틈 2 입니다. 항목 비율만큼 폭을 나눠 이어 칠합니다.',
    '아래 8 에 범례를 오른쪽 정렬로 둡니다 — 16 칩 · 간격 8 · 14 Regular 이름 + 14 Bold 비율, 항목 간격 16.',
    '막대는 장식이라 숨기고, 범례 글자가 비율을 읽어 줍니다 — 색에만 기대지 않습니다.',
] as const

const PROPS_ITEMS = [
    ['RatioStackBar', 'data', '항목별 id · 이름 · 값 · 색입니다. 값은 비율 또는 금액입니다.', '-', 'RatioStackItem[]'],
    ['RatioStackBar', 'fractionDigits', '범례 비율의 소수 자릿수입니다.', '1', 'number'],
] as const

const SPECIAL_CASES: readonly {title: string; description: string; data: RatioStackItem[]}[] = [
    {
        title: '합이 100 이 아닐 때',
        description: '합계로 나눠 비율을 다시 계산합니다 — 반올림 오차(99.9)나 금액을 넘겨도 막대는 끝까지 찹니다.',
        data: pair(2000, 3862),
    },
    {
        title: '한쪽이 0',
        description: '0 인 항목은 막대에서 빼고 범례에는 0.0% 로 남깁니다. 남은 항목이 막대를 모두 채웁니다.',
        data: pair(0, 56.2),
    },
    {
        title: '아주 작은 비율',
        description: '0 보다 크면 최소 4 는 칠해 보이게 합니다(0.1%).',
        data: pair(0.1, 99.9),
    },
    {
        title: '모두 0 (자료 없음)',
        description: '빈 회색 막대만 두고 범례는 모두 0.0% 로 적습니다.',
        data: pair(0, 0),
    },
    {
        title: '음수 (잘못된 자료)',
        description: '0 이하 · 숫자가 아닌 값은 0 으로 보고 막대에서 뺍니다.',
        data: pair(-12, 56.2),
    },
    {
        title: '항목이 많을 때 (5개)',
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
        description="전체를 100 으로 보고 항목별 비율을 한 줄 가로 막대에 이어 칠하고, 아래에 범례(이름 + 비율)를 둡니다."
    >
        <BaseCard>
            <section aria-labelledby="rsb-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="rsb-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서 신용/재무정보 탭 “신용/담보 비중” 카드 아래의 최근 비율 막대입니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex max-w-147 min-w-0 flex-col gap-6 rounded-sm border p-6">
                    <RatioStackBar data={REPORT_DATA} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rsb-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="rsb-shape" className="typo-h4-bold">
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
            <section aria-labelledby="rsb-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="rsb-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        막대가 끝까지 차지 않거나 항목이 사라질 수 있는 경우입니다. 모두 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 xl:grid-cols-2">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
                            <RatioStackBar data={item.data} />
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rsb-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="rsb-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        따로 스켈레톤 컴포넌트를 두지 않습니다. 막대와 같은 크기(높이 16 · 양 끝 둥글림)의{' '}
                        <code className="font-mono">Skeleton</code> 하나를 둡니다.
                    </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <Skeleton className="h-4 w-full rounded-full" />
                    </div>
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <RatioStackBar data={REPORT_DATA} />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rsb-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="rsb-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">비율 또는 금액을 그대로 넘깁니다.</p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="RatioStackBar 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rsb-props" className="flex flex-col gap-4">
                <h2 id="rsb-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="RatioStackBar 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RatioStackBarGuidePage
