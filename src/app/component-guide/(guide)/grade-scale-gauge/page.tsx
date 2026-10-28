// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {GradeScaleGaugeSkeleton} from '@/components/composite/grade-scale-gauge-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {GradeScaleGauge, type GradeScaleGaugeProps, type GradeScaleItem} from '@/components/custom/grade-scale-gauge'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {CASH_FLOW_GRADES_LOW_FIRST, cashFlowLevel} from '@/content/service/cash-flow-grades'

export const metadata: Metadata = {title: '등급 척도 게이지 (GradeScaleGauge)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

// 현금흐름등급 척도(낮은 등급부터 CF6 → CF1) — 보고서와 같은 현금흐름등급표(cash-flow-grades.ts)와
// cash-flow-cf-<n> 토큰(칸 색 · 칸 글자 색, 다크에서 함께 바뀜) · cash-flow-gauge-cf-<n> 토큰(원호 — 라이트 그라데이션 · 다크 단색).
const CASH_FLOW_GRADES: readonly GradeScaleItem[] = CASH_FLOW_GRADES_LOW_FIRST.map((item) => ({
    label: item.grade,
    color: `var(--ds-cash-flow-cf-${cashFlowLevel(item.grade)})`,
    foreground: `var(--ds-cash-flow-cf-${cashFlowLevel(item.grade)}-foreground)`,
    arcColor: `var(--ds-cash-flow-gauge-cf-${cashFlowLevel(item.grade)}-from)`,
    arcGradientTo: `var(--ds-cash-flow-gauge-cf-${cashFlowLevel(item.grade)}-to)`,
}))
// 보고서(신용/재무정보 현금흐름등급)와 같은 모양 — 원호 안에는 등급만 둔다(description="").
// 양 끝 이름은 등급표의 가장 낮은 · 높은 등급내용(CF6 부실 · CF1 우수)이다.
const SCALE_LABELS = {
    description: '',
    lowLabel: CASH_FLOW_GRADES_LOW_FIRST[0].name,
    highLabel: CASH_FLOW_GRADES_LOW_FIRST[CASH_FLOW_GRADES_LOW_FIRST.length - 1].name,
    scaleLabel: '현금흐름 창출 능력',
} as const

type CaseProps = Pick<
    GradeScaleGaugeProps,
    'grades' | 'current' | 'description' | 'lowLabel' | 'highLabel' | 'scaleLabel'
>

const USAGE_CODE = `import {GradeScaleGauge, type GradeScaleItem} from '@/components/custom/grade-scale-gauge'

import {CASH_FLOW_GRADES_LOW_FIRST, cashFlowLevel} from '@/content/service/cash-flow-grades'

// 낮은 등급부터 높은 등급 순서입니다(CF6 → CF1 — 현금흐름등급표 = 참고자료 등급 정의).
// 칸 색 · 칸 글자 색은 데이터가 넘깁니다(토큰 — 다크에서 함께 바뀜).
const CASH_FLOW_SCALE: readonly GradeScaleItem[] = CASH_FLOW_GRADES_LOW_FIRST.map((item) => ({
  label: item.grade,
  color: \`var(--ds-cash-flow-cf-\${cashFlowLevel(item.grade)})\`,
  foreground: \`var(--ds-cash-flow-cf-\${cashFlowLevel(item.grade)}-foreground)\`,
  // 원호만 따로 — 라이트는 2색 그라데이션(혁신성장역량지수 게이지와 같은 색), 다크는 칸 색과 같은 단색.
  arcColor: \`var(--ds-cash-flow-gauge-cf-\${cashFlowLevel(item.grade)}-from)\`,
  arcGradientTo: \`var(--ds-cash-flow-gauge-cf-\${cashFlowLevel(item.grade)}-to)\`,
}))

<GradeScaleGauge
  ariaLabel="현금흐름등급 CF4(열위)"
  grades={CASH_FLOW_SCALE}
  current="CF4"
  description=""   // 원호 안에는 등급만(기본은 '현재 등급' 설명을 함께 적는다)
  lowLabel="부실"  // 등급표 CF6 등급내용
  highLabel="우수" // 등급표 CF1 등급내용
  scaleLabel="현금흐름 창출 능력"
/>`

const DATA_CODE = `// 척도(grades) · 양 끝 이름은 등급표에서 만들고, 현재 등급 코드(CF1 ~ CF6)만 받습니다.
// 등급 정의(아래 설명 상자)도 같은 표에서 찾습니다 — findCashFlowGrade(cashFlow.grade)?.definition.
<GradeScaleGauge
  ariaLabel={\`현금흐름등급 \${cashFlow.grade}\`}
  grades={CASH_FLOW_SCALE}
  current={cashFlow.grade}
  description=""
  lowLabel={CASH_FLOW_GRADES_LOW_FIRST[0].name}
  highLabel={CASH_FLOW_GRADES_LOW_FIRST.at(-1)?.name}
  scaleLabel="현금흐름 창출 능력"
/>`

const LOADING_CODE = `import {GradeScaleGaugeSkeleton} from '@/components/composite/grade-scale-gauge-skeleton'

// 원호 안 설명을 뺀 게이지(description="")는 스켈레톤도 설명 자리를 뺀다.
<GradeScaleGaugeSkeleton label="현금흐름등급을 불러오는 중입니다." count={6} hasDescription={false} />`

const CHOICE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'shows', header: '보여 주는 값', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'grade-scale',
        cells: [
            <code key="component">GradeScaleGauge</code>,
            '현재 등급 + 전체 등급 척도',
            '원호 아래에 모든 등급 칸을 늘어놓아 어느 단계인지 함께 보입니다. 채움은 (현재 순번 ÷ 등급 수)입니다.',
        ],
    },
    {
        key: 'grade-arc',
        cells: [
            <Link key="component" href="/component-guide/grade-arc-gauge" className={LINK_CLASS}>
                GradeArcGauge
            </Link>,
            '등급의 자리',
            '척도 칸 없이 등급 이름과 원호만 둡니다.',
        ],
    },
    {
        key: 'semicircle-rating',
        cells: [
            <Link key="component" href="/component-guide/semicircle-rating-gauge" className={LINK_CLASS}>
                SemicircleRatingGauge
            </Link>,
            '등급 + 채움 비율 + 날짜 목록',
            '채움 비율을 직접 넘기고 원호 색은 파랑 하나입니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['GradeScaleGauge', 'grades', '낮은 등급부터 높은 등급 순서의 칸 목록입니다.', '-', 'readonly GradeScaleItem[]'],
    [
        'GradeScaleGauge',
        'current',
        '현재 등급(grades 의 label)입니다. 목록에 없으면 원호를 비우고 받은 글자만 보입니다.',
        '-',
        'string',
    ],
    ['GradeScaleGauge', 'ariaLabel', '그림 전체를 읽어 줄 이름입니다.', '-', 'string'],
    [
        'GradeScaleGauge',
        'description',
        "가운데 등급 아래 설명입니다. 빈 문자열('')이면 등급만 보이고 등급 글자는 설명이 있을 때와 같은 높이에 남습니다. 보고서 현금흐름등급은 '' 입니다.",
        "'현재 등급'",
        'string',
    ],
    ['GradeScaleGauge', 'lowLabel', '척도 줄의 낮은 쪽(첫 칸 아래) 이름입니다.', 'undefined', 'string'],
    ['GradeScaleGauge', 'highLabel', '척도 줄의 높은 쪽(끝 칸 아래) 이름입니다.', 'undefined', 'string'],
    [
        'GradeScaleGauge',
        'scaleLabel',
        '척도 줄 가운데 띠의 이름입니다. 칸이 둘 이하이면 띠를 그리지 않습니다.',
        'undefined',
        'string',
    ],
    [
        'GradeScaleGauge',
        'className · div props',
        '바깥 div 에 전달됩니다. children 은 받지 않습니다.',
        '-',
        'HTMLAttributes',
    ],
    ['GradeScaleItem', 'label', '등급 이름입니다(예: CF4).', '-', 'string'],
    ['GradeScaleItem', 'color', '칸과 원호 채움에 쓰는 색(토큰 변수)입니다.', '-', 'string'],
    [
        'GradeScaleItem',
        'foreground',
        '칸 글자 색(토큰 변수)입니다. 테마마다 칸 색이 바뀌면 글자 색도 함께 넘깁니다(예: var(--ds-cash-flow-cf-4-foreground)). isLightColor 보다 우선합니다.',
        '-',
        'string',
    ],
    [
        'GradeScaleItem',
        'isLightColor',
        'foreground 가 없을 때 — 밝은 칸이면 흰 글자 대신 짙은 글자(grade-scale-chip-foreground)를 씁니다.',
        'false',
        'boolean',
    ],
    [
        'GradeScaleItem',
        'arcColor',
        '원호 색(토큰 변수)입니다. 주면 칸 색(color) 대신 원호에만 쓰고, arcGradientTo 와 짝이면 그라데이션의 시작 색입니다.',
        'color',
        'string',
    ],
    [
        'GradeScaleItem',
        'arcGradientTo',
        '원호 그라데이션 끝 색(왼쪽 아래)입니다. 주지 않으면 단색 원호입니다(예: var(--ds-cash-flow-gauge-cf-1-to)).',
        '-',
        'string',
    ],
    [
        'GradeScaleGaugeSkeleton',
        'label',
        '불러오는 중에 화면 낭독기가 읽을 말입니다.',
        "'등급을 불러오는 중입니다.'",
        'string',
    ],
    ['GradeScaleGaugeSkeleton', 'count', '자리 표시 칸 수입니다. grades 수와 같게 둡니다.', '6', 'number'],
    [
        'GradeScaleGaugeSkeleton',
        'hasDescription',
        '원호 안 설명 자리입니다. 게이지에 description="" 을 주면 false 로 둡니다.',
        'true',
        'boolean',
    ],
] as const

const SPECIAL_CASES: readonly {title: string; description: string; gauge: CaseProps}[] = [
    {
        title: '설명 글자 함께 (description)',
        description:
            "description 을 주지 않으면 등급 아래에 '현재 등급'을 적습니다. 다른 글자를 주면 그 글자를 적습니다. 등급 글자 높이는 같습니다.",
        gauge: {grades: CASH_FLOW_GRADES, current: 'CF4', ...SCALE_LABELS, description: '현재 등급'},
    },
    {
        title: '가장 낮은 등급',
        description: '원호는 한 칸 몫(1/6)만 채우고 첫 칸의 색을 씁니다.',
        gauge: {grades: CASH_FLOW_GRADES, current: 'CF6', ...SCALE_LABELS},
    },
    {
        title: '가장 높은 등급',
        description: '원호를 끝까지 채우고 끝 칸의 색을 씁니다.',
        gauge: {grades: CASH_FLOW_GRADES, current: 'CF1', ...SCALE_LABELS},
    },
    {
        title: '밝은 칸',
        description:
            '주황(CF3) · 회색(CF5)처럼 밝은 칸은 흰 글자로 본문 대비 4.5:1 에 못 미쳐 짙은 글자로 적습니다. 다크에서는 칸이 밝은 단계로 바뀌어 대부분 짙은 글자, 어두워지는 CF5 만 밝은 글자입니다(foreground 토큰).',
        gauge: {grades: CASH_FLOW_GRADES, current: 'CF3', ...SCALE_LABELS},
    },
    {
        title: '척도에 없는 등급 (잘못된 자료)',
        description:
            '원호를 비우고 받은 등급을 그대로 적어 잘못된 자료가 드러나게 합니다. 숨김 문단은 “척도에 없는 등급”으로 읽습니다.',
        gauge: {grades: CASH_FLOW_GRADES, current: 'CF9', ...SCALE_LABELS},
    },
    {
        title: '등급이 많을 때 (10단계)',
        description:
            '칸 폭을 똑같이 나눠 줄이고, 칸보다 긴 이름은 말줄임표로 자릅니다. 척도 줄도 같은 칸 나눔을 따릅니다.',
        gauge: {
            grades: Array.from({length: 10}, (_, index) => ({
                label: `G-${10 - index}`,
                color: index < 5 ? 'var(--raw-gray-500)' : 'var(--raw-blue-500)',
            })),
            current: 'G-3',
            ...SCALE_LABELS,
        },
    },
    {
        title: '등급이 둘일 때',
        description: '가운데 띠 없이 양 끝 이름만 둡니다.',
        gauge: {
            grades: [
                {label: '미흡', color: 'var(--raw-error-500)'},
                {label: '양호', color: 'var(--raw-blue-500)'},
            ],
            current: '양호',
            description: '',
            lowLabel: '낮음',
            highLabel: '높음',
        },
    },
    {
        title: '척도 이름 없음',
        description: 'lowLabel · highLabel · scaleLabel 을 모두 비우면 척도 줄을 그리지 않습니다.',
        gauge: {grades: CASH_FLOW_GRADES, current: 'CF2', description: ''},
    },
    {
        title: '긴 척도 이름',
        description: '가운데 띠보다 긴 이름은 말줄임표로 잘라 한 줄을 지킵니다.',
        gauge: {
            grades: CASH_FLOW_GRADES,
            current: 'CF4',
            description: '',
            lowLabel: '매우 미흡',
            highLabel: '매우 양호',
            scaleLabel: '영업활동 현금흐름 기반의 현금흐름 창출 능력과 채무 상환 여력 종합',
        },
    },
]

const GradeScaleGaugeGuidePage = () => (
    <GuidePageShell
        title="등급 척도 게이지 (GradeScaleGauge)"
        description="현재 등급을 원호로 보이고, 전체 등급을 낮은 것부터 높은 것까지 색 칸으로 늘어놓아 단계를 함께 보이는 게이지입니다."
    >
        <BaseCard>
            <section aria-labelledby="gsg-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="gsg-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>grades</code> 는 낮은 등급부터 순서대로 넘기고 <code>current</code> 에 그중 하나의{' '}
                        <code>label</code> 을 줍니다. 원호의 채움 색은 현재 등급 칸의 색이며, 칸 폭은 등급 수만큼 똑같이
                        나뉩니다. 보고서 현금흐름등급처럼 원호 안에 등급만 둘 때는 <code>description=&quot;&quot;</code>{' '}
                        를 줍니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex max-w-147 min-w-0 flex-col gap-6 rounded-sm border p-6">
                    <GradeScaleGauge
                        ariaLabel="현금흐름등급 CF4"
                        grades={CASH_FLOW_GRADES}
                        current="CF4"
                        {...SCALE_LABELS}
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gsg-variants" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="gsg-variants" className="typo-h4-bold">
                        등급과 상태 예시
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        받은 값은 그대로 넘기면 되고 아래 경우는 컴포넌트가 처리합니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">등급별 (current)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            여섯 단계를 차례로 현재 등급으로 둔 모습입니다. 채움 길이와 색이 함께 바뀝니다.
                        </p>
                        <ul className="grid list-none gap-6 xl:grid-cols-2">
                            {CASH_FLOW_GRADES.map((grade) => (
                                <li key={grade.label} className="flex min-w-0 flex-col gap-2">
                                    <p className="typo-body-xl-bold text-foreground">{grade.label}</p>
                                    <GradeScaleGauge
                                        ariaLabel={`현금흐름등급 ${grade.label}`}
                                        grades={CASH_FLOW_GRADES}
                                        current={grade.label}
                                        {...SCALE_LABELS}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">특이 케이스</h3>
                        <ul className="grid list-none gap-6 xl:grid-cols-2">
                            {SPECIAL_CASES.map((item) => (
                                <li key={item.title} className="flex min-w-0 flex-col gap-2">
                                    <p className="typo-body-xl-bold text-foreground">{item.title}</p>
                                    <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
                                    <GradeScaleGauge
                                        ariaLabel={`${item.title} ${item.gauge.current}`}
                                        {...item.gauge}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">불러오는 중 (GradeScaleGaugeSkeleton)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            원호 · 가운데 글자 · 칸 줄 · 척도 줄의 짜임과 높이가 같아 불러온 뒤 자리가 흔들리지
                            않습니다.
                        </p>
                        <div className="grid gap-6 xl:grid-cols-2">
                            <div className="flex min-w-0 flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">불러오는 중</p>
                                <GradeScaleGaugeSkeleton
                                    label="현금흐름등급을 불러오는 중입니다."
                                    hasDescription={false}
                                />
                            </div>
                            <div className="flex min-w-0 flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">불러온 뒤</p>
                                <GradeScaleGauge
                                    ariaLabel="현금흐름등급 CF4"
                                    grades={CASH_FLOW_GRADES}
                                    current="CF4"
                                    {...SCALE_LABELS}
                                />
                            </div>
                        </div>
                        <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gsg-choice" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="gsg-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        등급 척도(전체 단계)를 함께 보여야 하는지로 고릅니다.
                    </p>
                </div>
                <Table caption="등급 게이지 선택 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gsg-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="gsg-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        원호는 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 읽히고, 칸 줄과 척도 줄은
                        그림이라 읽지 않습니다[5.1.1].
                    </li>
                    <li>
                        숨김 문단이 &apos;전체 N단계 중 낮은 쪽부터 M번째 등급&apos;을 읽어 주므로 칸 색만으로 단계를
                        구분하지 않습니다[5.3.1].
                    </li>
                    <li>
                        칸 글자 색은 칸 색과 짝인 <code>foreground</code> 토큰으로 넘겨 라이트 · 다크 모두 본문 대비
                        4.5:1 을 지킵니다[5.3.3]. 원호 트랙은 <code>grade-scale-track</code> 이라 다크에서 어두운 칸
                        색도 묻히지 않습니다.
                    </li>
                    <li>
                        K-BIGx 보고서처럼 <code>ChartRevealProvider</code> 안에서는 차트가 화면에 절반 이상 보일 때 단계
                        칩이 차례로 커지며 나타납니다(<code>--animate-chart-*</code> · 0.6초). <code>motion-safe</code>{' '}
                        라 동작 줄이기 설정이면 움직이지 않습니다[6.3.1]. 그 밖에서는 그려질 때 바로 움직입니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gsg-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="gsg-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="GradeScaleGauge Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default GradeScaleGaugeGuidePage
