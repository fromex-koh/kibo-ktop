// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {GradeScaleGaugeSkeleton} from '@/components/composite/grade-scale-gauge-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {GradeScaleGauge, type GradeScaleGaugeProps, type GradeScaleItem} from '@/components/custom/grade-scale-gauge'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '등급 척도 게이지 (GradeScaleGauge)'}

const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}

// K-BIGx 보고서 "현금흐름등급" 카드와 같은 척도다(낮은 등급부터).
const CASH_FLOW_GRADES: readonly GradeScaleItem[] = [
    {label: 'CR-6', color: 'var(--raw-gray-700)'},
    {label: 'CR-5', color: 'var(--raw-gray-300)'},
    {label: 'CR-4', color: 'var(--raw-error-500)'},
    {label: 'CR-3', color: 'var(--raw-orange-500)', isLightColor: true},
    {label: 'CR-2', color: 'var(--raw-success-500)'},
    {label: 'CR-1', color: 'var(--raw-blue-500)'},
]
const SCALE_LABELS = {lowLabel: '미흡', highLabel: '양호', scaleLabel: '현금흐름 창출 능력'} as const

type CaseProps = Pick<GradeScaleGaugeProps, 'grades' | 'current' | 'lowLabel' | 'highLabel' | 'scaleLabel'>

const USAGE_CODE = `import {GradeScaleGauge} from '@/components/custom/grade-scale-gauge'

<GradeScaleGauge
  ariaLabel="현금흐름등급 CR-4"
  grades={CASH_FLOW_GRADES} // 낮은 등급부터: [{label: 'CR-6', color: 'var(--raw-gray-700)'}, …]
  current="CR-4"
  lowLabel="미흡"
  highLabel="양호"
  scaleLabel="현금흐름 창출 능력"
/>`

const DATA_CODE = `// [프론트엔드 연동] 척도(grades)는 화면이 고정으로 두고, 현재 등급 코드만 받는다.
<GradeScaleGauge
  ariaLabel={\`현금흐름등급 \${cashFlow.grade}\`}
  grades={CASH_FLOW_GRADES}
  current={cashFlow.grade} // 'CR-4'
  lowLabel="미흡"
  highLabel="양호"
  scaleLabel="현금흐름 창출 능력"
/>`

const SHAPE_RULES = [
    '원호는 지름 260 · 굵기 37 · 위 172 만 보입니다. 채움 길이는 (현재 등급 순번 ÷ 등급 수), 채움 색은 현재 등급 칸의 색입니다.',
    '가운데에 등급(40 Bold)과 설명(16 Bold, 기본 “현재 등급”)을 둡니다.',
    '원호 아래 16 에 등급 칸 줄(높이 32 · 모서리 8 · 간격 8 · 14 Bold)을 칸 수만큼 똑같이 나눠 둡니다. 밝은 칸은 isLightColor 로 짙은 글자를 씁니다.',
    '그 아래 8 에 척도 줄(높이 26 · 12 Regular) — 첫 칸 아래 낮은 쪽 이름, 가운데 칸들 아래 회색 띠(gray.50)에 척도 이름, 끝 칸 아래 높은 쪽 이름입니다.',
    '현재 등급은 role="img" 이름과 숨김 문단(전체 몇 단계 중 몇 번째)으로 읽어 줍니다 — 칸 색만으로 구분하지 않습니다.',
] as const

const PROPS_ITEMS = [
    ['GradeScaleGauge', 'grades', '낮은 등급부터 높은 등급 순서의 칸 목록입니다.', '-', 'GradeScaleItem[]'],
    ['GradeScaleGauge', 'current', '현재 등급(grades 의 label)입니다.', '-', 'string'],
    ['GradeScaleGauge', 'description', '가운데 등급 아래 설명입니다.', "'현재 등급'", 'string'],
    ['GradeScaleGauge', 'lowLabel · highLabel', '척도 줄의 낮은 쪽 · 높은 쪽 이름입니다.', '-', 'string'],
    ['GradeScaleGauge', 'scaleLabel', '척도 줄 가운데 띠의 이름입니다.', '-', 'string'],
    ['GradeScaleGauge', 'ariaLabel', '게이지 이름입니다.', '-', 'string'],
    ['GradeScaleItem', 'isLightColor', '밝은 칸 — 칸 글자를 짙은 색으로 적습니다.', 'false', 'boolean'],
    ['GradeScaleGaugeSkeleton', 'count', '자리 표시 칸 수입니다. grades 수와 같게 둡니다.', '6', 'number'],
] as const

const SPECIAL_CASES: readonly {title: string; description: string; gauge: CaseProps}[] = [
    {
        title: '가장 낮은 등급',
        description: '원호는 한 칸 몫(1/6)만 채우고 첫 칸의 색을 씁니다.',
        gauge: {grades: CASH_FLOW_GRADES, current: 'CR-6', ...SCALE_LABELS},
    },
    {
        title: '가장 높은 등급',
        description: '원호를 끝까지 채우고 끝 칸의 색을 씁니다.',
        gauge: {grades: CASH_FLOW_GRADES, current: 'CR-1', ...SCALE_LABELS},
    },
    {
        title: '밝은 칸',
        description: '주황처럼 밝은 칸은 흰 글자가 잘 보이지 않아 짙은 글자로 적습니다(isLightColor).',
        gauge: {grades: CASH_FLOW_GRADES, current: 'CR-3', ...SCALE_LABELS},
    },
    {
        title: '척도에 없는 등급 (잘못된 자료)',
        description:
            '원호를 비우고 받은 등급을 그대로 적어 잘못된 자료가 드러나게 합니다. 숨김 문단은 “척도에 없는 등급”으로 읽습니다.',
        gauge: {grades: CASH_FLOW_GRADES, current: 'CR-9', ...SCALE_LABELS},
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
            lowLabel: '낮음',
            highLabel: '높음',
        },
    },
    {
        title: '척도 이름 없음',
        description: 'lowLabel · highLabel · scaleLabel 을 모두 비우면 척도 줄을 그리지 않습니다.',
        gauge: {grades: CASH_FLOW_GRADES, current: 'CR-2'},
    },
    {
        title: '긴 척도 이름',
        description: '가운데 띠보다 긴 이름은 말줄임표로 잘라 한 줄을 지킵니다.',
        gauge: {
            grades: CASH_FLOW_GRADES,
            current: 'CR-4',
            lowLabel: '매우 미흡',
            highLabel: '매우 양호',
            scaleLabel: '영업활동 현금흐름 기반의 현금흐름 창출 능력과 채무 상환 여력 종합',
        },
    },
]

const GradeScaleGaugeGuidePage = () => (
    <GuidePageShell
        title="등급 척도 게이지 (GradeScaleGauge)"
        description="현재 등급을 원호로 보이고, 전체 등급을 낮은 것부터 높은 것까지 색 칸으로 늘어놓아 어느 단계인지 함께 보입니다."
    >
        <BaseCard>
            <section aria-labelledby="gsg-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="gsg-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서 신용/재무정보 탭의 현금흐름등급 카드입니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card flex max-w-147 min-w-0 flex-col gap-6 rounded-sm border p-6">
                    <GradeScaleGauge
                        ariaLabel="현금흐름등급 CR-4"
                        grades={CASH_FLOW_GRADES}
                        current="CR-4"
                        {...SCALE_LABELS}
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gsg-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="gsg-shape" className="typo-h4-bold">
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
            <section aria-labelledby="gsg-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="gsg-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        칸 글자가 넘치거나 척도 줄이 어긋날 수 있는 경우입니다. 모두 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 xl:grid-cols-2">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
                            <GradeScaleGauge ariaLabel={`${item.title} ${item.gauge.current}`} {...item.gauge} />
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gsg-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="gsg-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은 <code className="font-mono">GradeScaleGaugeSkeleton</code>을 같은
                        자리에 둡니다. 원호 · 가운데 글자 · 등급 칸 줄 · 척도 줄의 짜임과 높이가 같습니다.
                    </p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <GradeScaleGaugeSkeleton label="현금흐름등급을 불러오는 중입니다." />
                    </div>
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <GradeScaleGauge
                            ariaLabel="현금흐름등급 CR-4"
                            grades={CASH_FLOW_GRADES}
                            current="CR-4"
                            {...SCALE_LABELS}
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gsg-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="gsg-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        척도는 화면이 고정으로 두고 현재 등급 코드만 받아 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="GradeScaleGauge 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gsg-props" className="flex flex-col gap-4">
                <h2 id="gsg-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="GradeScaleGauge 컴포넌트 Props 목록" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default GradeScaleGaugeGuidePage
