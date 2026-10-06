// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import {GradeArcGauge} from '@/components/custom/grade-arc-gauge'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '등급 반원 게이지 (GradeArcGauge)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {GradeArcGauge} from '@/components/custom/grade-arc-gauge'

<GradeArcGauge grade="TI3" label="최종등급" stepIndex={2} totalSteps={14} size="lg" />
<GradeArcGauge grade="G3" label="성장등급" stepIndex={2} totalSteps={14} />`

const DATA_CODE = `// grades 는 좋은 등급부터 담고, stepIndex 는 받은 등급의 자리(0부터)입니다.
<GradeArcGauge
  grade={row.grades[row.stepIndex]}
  label={row.gaugeLabel}
  stepIndex={row.stepIndex}
  totalSteps={row.grades.length}
  size={row.id === 'final' ? 'lg' : 'md'}
/>`

const LOADING_CODE = `<GradeArcGauge grade="" label="최종등급" stepIndex={0} totalSteps={14} isLoading />`

const SIZE_CASES = [
    {size: 'lg', title: 'lg', description: '채움 색이 primary 입니다. 문서의 대표 등급(최종등급)에 씁니다.'},
    {
        size: 'md',
        title: 'md (기본)',
        description: '채움 색이 purple.500 입니다. 곁들이는 등급(성장 · 밸류업)에 씁니다.',
    },
] as const

const TOTAL_STEPS = 14
const STEP_CASES = Array.from({length: TOTAL_STEPS}, (unused, index) => ({
    grade: `TI${index + 1}`,
    stepIndex: index,
}))

const CHOICE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'shows', header: '보여 주는 값', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'grade-arc',
        cells: [
            <code key="component">GradeArcGauge</code>,
            '등급의 자리(stepIndex ÷ totalSteps)',
            '가운데 글자가 등급 이름입니다. 1등급이 가장 많이 채워집니다.',
        ],
    },
    {
        key: 'grade-scale',
        cells: [
            <Link key="component" href="/component-guide/grade-scale-gauge" className={LINK_CLASS}>
                GradeScaleGauge
            </Link>,
            '등급과 전체 등급 척도',
            '원호 아래에 모든 등급 칸을 늘어놓아 단계를 함께 보입니다.',
        ],
    },
    {
        key: 'semicircle-rating',
        cells: [
            <Link key="component" href="/component-guide/semicircle-rating-gauge" className={LINK_CLASS}>
                SemicircleRatingGauge
            </Link>,
            '등급 + 채움 비율 + 날짜 목록',
            '채움 비율(percentage)을 직접 넘기고 기준일 목록이 붙습니다.',
        ],
    },
    {
        key: 'score-gauge',
        cells: [
            <Link key="component" href="/component-guide/score-gauge" className={LINK_CLASS}>
                ScoreGauge
            </Link>,
            '0~100 점수',
            '등급이 아니라 점수를 채움으로 보입니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['GradeArcGauge', 'grade', '가운데에 크게 서는 등급입니다(예: TI3).', '-', 'string'],
    ['GradeArcGauge', 'label', '원호 아래 이름입니다(예: 최종등급).', '-', 'string'],
    [
        'GradeArcGauge',
        'stepIndex',
        '등급의 자리(0부터)입니다. 0 이 가장 좋은 등급이며 범위를 벗어나면 끝으로 맞춥니다.',
        '-',
        'number',
    ],
    ['GradeArcGauge', 'totalSteps', '등급 단계 수입니다. 1 보다 작으면 1 로 맞춥니다.', '-', 'number'],
    ['GradeArcGauge', 'size', '크기이자 채움 색을 정합니다.', "'md'", "'md' | 'lg'"],
    ['GradeArcGauge', 'isLoading', '같은 크기의 스켈레톤을 대신 보입니다.', 'false', 'boolean'],
    [
        'GradeArcGauge',
        'loadingLabel',
        '불러오는 중에 화면 낭독기가 읽을 말입니다.',
        "'등급을 불러오는 중입니다.'",
        'string',
    ],
    [
        'GradeArcGauge',
        'className · div props',
        '바깥 div 에 전달됩니다. children 은 받지 않습니다.',
        '-',
        'HTMLAttributes',
    ],
] as const

const GradeArcGaugeGuidePage = () => (
    <GuidePageShell
        title="등급 반원 게이지 (GradeArcGauge)"
        description="위가 열린 반원을 등급의 자리만큼 채우고, 가운데에 등급과 이름을 두는 게이지입니다."
    >
        <BaseCard>
            <section aria-labelledby="gag-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gag-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        등급 이름(<code>grade</code>)과 그 자리(<code>stepIndex</code> · <code>totalSteps</code>)만
                        넘깁니다. 채움 길이는 자리에서 계산되며, 1등급이 가장 많이 채워지고 마지막 등급은 한 칸만
                        채워집니다. 고정 좌표 SVG 라 브라우저가 크기를 재지 않습니다.
                    </p>
                </div>
                <div className="flex flex-wrap items-end gap-8">
                    <GradeArcGauge grade="G3" label="성장등급" stepIndex={2} totalSteps={14} />
                    <GradeArcGauge grade="TI3" label="최종등급" stepIndex={2} totalSteps={14} size="lg" />
                    <GradeArcGauge grade="V3" label="밸류업등급" stepIndex={2} totalSteps={14} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gag-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gag-variants" className="typo-h4-bold">
                        크기와 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        색은 <code>size</code> 가 정하므로 사용처에서 색을 넘기지 않습니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">크기 (size)</h3>
                        <ul className="flex flex-wrap items-end gap-8">
                            {SIZE_CASES.map((item) => (
                                <li key={item.size} className="flex max-w-60 min-w-0 flex-col items-center gap-2">
                                    <GradeArcGauge
                                        grade="TI3"
                                        label="최종등급"
                                        stepIndex={2}
                                        totalSteps={14}
                                        size={item.size}
                                    />
                                    <p className="typo-body-xl-bold text-foreground">{item.title}</p>
                                    <p className="typo-body-m-regular text-label-foreground text-center break-keep">
                                        {item.description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">등급 자리 (stepIndex)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            14단계를 모두 늘어놓았습니다. 한 단계 내려갈 때마다 채움이 같은 길이만큼 줄어듭니다.
                        </p>
                        <ul className="flex flex-wrap gap-6">
                            {STEP_CASES.map((item) => (
                                <li key={item.grade}>
                                    <GradeArcGauge
                                        grade={item.grade}
                                        label="최종등급"
                                        stepIndex={item.stepIndex}
                                        totalSteps={TOTAL_STEPS}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">불러오는 중 (isLoading)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            같은 크기의 스켈레톤이 대신 서고 <code>loadingLabel</code> 이 낭독됩니다. 화면이 붙기 전에도
                            같은 스켈레톤을 보입니다.
                        </p>
                        <div className="flex flex-wrap items-end gap-8">
                            <GradeArcGauge grade="" label="성장등급" stepIndex={0} totalSteps={14} isLoading />
                            <GradeArcGauge
                                grade=""
                                label="최종등급"
                                stepIndex={0}
                                totalSteps={14}
                                size="lg"
                                isLoading
                            />
                        </div>
                        <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gag-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gag-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">무엇을 채움으로 보이는지로 고릅니다.</p>
                </div>
                <Table caption="등급 · 점수 게이지 선택 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gag-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gag-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        원호는 <code>aria-hidden</code> 그림이고, 이름과 등급은 값 한 쌍(<code>dl</code>)으로 읽혀
                        &apos;최종등급 TI3&apos; 처럼 전달됩니다[5.1.1].
                    </li>
                    <li>등급이 글자로도 있어 색만으로 뜻을 전하지 않습니다[5.3.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gag-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="gag-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="GradeArcGauge Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default GradeArcGaugeGuidePage
