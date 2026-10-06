// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {SegmentMeterSkeleton} from '@/components/composite/segment-meter-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {SegmentMeter, type SegmentMeterProps} from '@/components/custom/segment-meter'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '단계 칸 막대 (SegmentMeter)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

type CaseProps = Pick<SegmentMeterProps, 'value' | 'total' | 'color'>

const TONES = [
    {label: '우수', color: 'var(--raw-blue-500)', value: 9},
    {label: '양호', color: 'var(--raw-mint-700)', value: 7},
    {label: '보통', color: 'var(--raw-orange-500)', value: 5},
    {label: '미흡', color: 'var(--raw-error-500)', value: 3},
    {label: '취약', color: 'var(--raw-gray-700)', value: 1},
] as const

const USAGE_CODE = `import {SegmentMeter} from '@/components/custom/segment-meter'

<SegmentMeter value={7} total={10} color="var(--raw-mint-700)" ariaLabel="인프라 10단계 중 7단계" />`

const DATA_CODE = `// value 는 도달 단계(정수)입니다. 점수(63.7)가 아니라 백엔드가 준 단계(level)를 그대로 넘깁니다.
<SegmentMeter
  value={capability.level}
  total={10}
  color={ARC_GAUGE_TONE_COLORS[capability.tone]}
  ariaLabel={\`\${capability.label} 10단계 중 \${capability.level}단계\`}
/>`

const LOADING_CODE = `import {SegmentMeterSkeleton} from '@/components/composite/segment-meter-skeleton'

<SegmentMeterSkeleton total={10} />`

const SPECIAL_CASES: readonly {title: string; description: string; meter: CaseProps}[] = [
    {title: '0단계', description: '모든 칸을 비웁니다.', meter: {value: 0, color: 'var(--raw-blue-500)'}},
    {title: '가득 참', description: '모든 칸을 채웁니다.', meter: {value: 10, color: 'var(--raw-blue-500)'}},
    {
        title: '소수 단계',
        description: '반올림합니다(6.5 → 7). 칸을 반만 채우지 않습니다.',
        meter: {value: 6.5, color: 'var(--raw-mint-700)'},
    },
    {
        title: '범위를 벗어난 값',
        description: '0 보다 작으면 0, 전체보다 크면 가득 찬 칸으로 맞춥니다(12 → 10).',
        meter: {value: 12, color: 'var(--raw-error-500)'},
    },
    {
        title: '점수를 잘못 넘겼을 때',
        description: '점수(63.7)를 넘기면 가득 찬 칸으로 보입니다. 단계(정수)를 넘겨야 합니다.',
        meter: {value: 63.7, color: 'var(--raw-orange-500)'},
    },
    {
        title: '단계 수가 다를 때',
        description: '전체 단계 수만큼 칸을 그립니다(5단계 중 3단계).',
        meter: {value: 3, total: 5, color: 'var(--raw-blue-500)'},
    },
    {
        title: '단계 수가 너무 많을 때',
        description: '칸은 20 개까지만 그립니다(total 100 → 20).',
        meter: {value: 70, total: 100, color: 'var(--raw-blue-500)'},
    },
] as const

const CHOICE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'shows', header: '보여 주는 값', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'segment-meter',
        cells: [
            <code key="component">SegmentMeter</code>,
            '도달 단계(정수)',
            '단계 수만큼 작은 칸을 한 줄로 둡니다. 제목 줄 옆처럼 좁은 자리에도 들어갑니다.',
        ],
    },
    {
        key: 'score-ring',
        cells: [
            <Link key="component" href="/component-guide/score-ring" className={LINK_CLASS}>
                ScoreRing
            </Link>,
            '0~100 점수 + 등급',
            '점수를 한 바퀴 원으로 보입니다.',
        ],
    },
    {
        key: 'score-gauge',
        cells: [
            <Link key="component" href="/component-guide/score-gauge" className={LINK_CLASS}>
                ScoreGauge
            </Link>,
            '0~100 점수 + 상태',
            '점수를 위가 열린 원호로 보이고 가운데에 점수 · 상태를 둡니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['SegmentMeter', 'value', '도달 단계입니다. 소수는 반올림하고 0 ~ total 로 맞춥니다.', '-', 'number'],
    ['SegmentMeter', 'color', '채운 칸 색(토큰 변수)입니다. 빈 칸은 흰 면과 테두리입니다.', '-', 'string'],
    ['SegmentMeter', 'total', '전체 단계 수입니다. 1~20 으로 맞춥니다.', '10', 'number'],
    ['SegmentMeter', 'ariaLabel', '그림의 이름입니다. 없으면 “10단계 중 7단계”처럼 만듭니다.', 'undefined', 'string'],
    [
        'SegmentMeter',
        'className · span props',
        '바깥 span 에 전달됩니다. children 은 받지 않습니다.',
        '-',
        'HTMLAttributes',
    ],
    ['SegmentMeterSkeleton', 'total', '칸 수입니다. SegmentMeter 의 total 과 같게 둡니다.', '10', 'number'],
] as const

const SegmentMeterGuidePage = () => (
    <GuidePageShell
        title="단계 칸 막대 (SegmentMeter)"
        description="전체 단계 수만큼 작은 칸을 한 줄로 늘어놓고, 도달한 단계까지 색으로 채우는 막대입니다."
    >
        <BaseCard>
            <section aria-labelledby="sm-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sm-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>value</code> 는 점수가 아니라 도달 단계(정수)입니다. 단계 환산은 백엔드 값을 그대로
                        씁니다. 상태 색은 <code>color</code> 로 넘깁니다.
                    </p>
                </div>
                <ul className="flex list-none flex-wrap gap-6">
                    {TONES.map((tone) => (
                        <li
                            key={tone.label}
                            className="border-subtle-3 bg-card flex flex-col items-center gap-2 rounded-sm border p-6"
                        >
                            <span className="typo-body-xl-bold text-foreground">{tone.label}</span>
                            <SegmentMeter
                                value={tone.value}
                                color={tone.color}
                                ariaLabel={`${tone.label} 10단계 중 ${tone.value}단계`}
                            />
                        </li>
                    ))}
                </ul>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sm-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sm-variants" className="typo-h4-bold">
                        상태 예시
                    </h2>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">특이 케이스</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            칸 수가 어긋나거나 카드를 넘을 수 있는 값도 컴포넌트가 맞춰 그립니다.
                        </p>
                        <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {SPECIAL_CASES.map((item) => (
                                <li key={item.title} className="flex min-w-0 flex-col gap-2">
                                    <p className="typo-body-xl-bold text-foreground">{item.title}</p>
                                    <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
                                    <SegmentMeter {...item.meter} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">불러오는 중 (SegmentMeterSkeleton)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            칸 크기 · 간격 · 칸 수가 같고, 채움 여부를 모르므로 모든 칸을 같은 회색으로 칠합니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex min-w-0 flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">불러오는 중</p>
                                <SegmentMeterSkeleton />
                            </div>
                            <div className="flex min-w-0 flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">불러온 뒤</p>
                                <SegmentMeter value={7} color="var(--raw-mint-700)" />
                            </div>
                        </div>
                        <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sm-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sm-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">값이 점수인지 단계인지로 고릅니다.</p>
                </div>
                <Table
                    caption="점수 · 단계 표시 컴포넌트 선택 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sm-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sm-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        칸은 <code>aria-hidden</code> 이고 막대 전체가 <code>role=&quot;img&quot;</code> 로 단계를 읽어
                        줍니다[5.1.1]. 이름은 맥락(예: 인프라)을 담아 <code>ariaLabel</code> 로 넘깁니다.
                    </li>
                    <li>단계가 이름으로 전달되므로 색에만 기대지 않습니다[5.3.1].</li>
                    <li>
                        <code>SegmentMeterSkeleton</code> 은 <code>aria-hidden</code> 이라 불러오는 중 안내는 감싸는
                        쪽에서 둡니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sm-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sm-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SegmentMeter Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SegmentMeterGuidePage
