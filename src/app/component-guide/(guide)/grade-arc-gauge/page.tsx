// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import {GradeArcGauge} from '@/components/custom/grade-arc-gauge'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '등급 반원 게이지 (GradeArcGauge)'}

const USAGE_CODE = `import {GradeArcGauge} from '@/components/custom/grade-arc-gauge'

<GradeArcGauge grade="TI3" label="최종등급" stepIndex={2} totalSteps={14} size="lg" />
<GradeArcGauge grade="G3" label="성장등급" stepIndex={2} totalSteps={14} />`

const DATA_CODE = `// [프론트엔드 연동] 등급 이름과 그 자리(stepIndex)만 넘기면 채움 길이가 따라갑니다.
// grades 는 좋은 등급부터 차례로 담고, stepIndex 는 그중 받은 등급의 자리(0부터)입니다.
<GradeArcGauge
  grade={row.grades[row.stepIndex]}
  label={row.gaugeLabel}
  stepIndex={row.stepIndex}
  totalSteps={row.grades.length}
  size={row.id === 'final' ? 'lg' : 'md'}
/>`

const SHAPE_RULES = [
    '위가 열린 반원입니다. 왼쪽 끝에서 시작해 오른쪽으로 차고, 끝은 둥급니다.',
    '지름은 lg 194 · md 154 이고 선 굵기는 지름의 14% 입니다.',
    '가운데 등급은 lg 32 · md 24 Bold, 반원 아래 이름은 12 Bold 입니다.',
    '색은 lg 가 primary, md 가 purple.500 입니다 — 가운데 게이지를 눈에 띄게 하려는 구분입니다.',
    '1등급이 가득 차고 마지막 등급이 한 칸만 찹니다 — 좋은 등급일수록 많이 찹니다.',
    '브라우저가 크기를 재지 않고 고정 좌표로 그려, 인쇄물에도 화면과 같은 모양으로 나갑니다.',
    '등급과 이름은 글자로도 있어 색만으로 뜻을 전하지 않습니다[5.3.1].',
    "이름과 등급은 값 한 쌍(dl)으로 묶어 '최종등급 TI3' 으로 읽힙니다 — 큰 글자를 그냥 문단으로 두면 검사 도구가 제목으로 오인합니다. 원호는 그림이라 읽지 않습니다.",
] as const

// 크기마다 색이 정해져 있다 — 사용처에서 색을 고르지 않는다.
const SIZE_CASES = [
    {
        size: 'lg' as const,
        title: 'lg — 가운데 게이지',
        description: '지름 194 · 등급 32 Bold. 문서에서 가장 중요한 등급(최종등급)에 씁니다.',
        color: 'primary (blue.500)',
        swatch: 'var(--ds-primary)',
    },
    {
        size: 'md' as const,
        title: 'md — 양옆 게이지',
        description: '지름 154 · 등급 24 Bold. 곁들이는 등급(성장 · 밸류업)에 씁니다.',
        color: 'purple.500',
        swatch: 'var(--raw-purple-500)',
    },
]

// 14단계를 모두 보여 준다 — 등급이 한 칸씩 내려갈 때 채움이 얼마나 줄어드는지 한눈에 보게 한다.
const TOTAL_STEPS = 14
const STEP_CASES = Array.from({length: TOTAL_STEPS}, (unused, index) => ({
    grade: `TI${index + 1}`,
    stepIndex: index,
}))

const PROPS_ITEMS = [
    ['GradeArcGauge', 'grade', '가운데에 크게 서는 등급입니다.', '-', 'string'],
    ['GradeArcGauge', 'label', '반원 아래 이름입니다.', '-', 'string'],
    ['GradeArcGauge', 'stepIndex', '등급이 몇 번째인지(0부터). 0 이 가장 좋은 등급입니다.', '-', 'number'],
    ['GradeArcGauge', 'totalSteps', '등급 단계 수입니다(예: 14).', '-', 'number'],
    ['GradeArcGauge', 'size', '게이지 크기입니다.', "'md'", "'md' | 'lg'"],
    ['GradeArcGauge', 'isLoading', '불러오는 중이면 같은 크기의 반원 스켈레톤을 보입니다.', 'false', 'boolean'],
    [
        'GradeArcGauge',
        'loadingLabel',
        '불러오는 중에 화면 낭독기가 읽을 말입니다.',
        "'등급을 불러오는 중입니다.'",
        'string',
    ],
] as const

const GradeArcGaugeGuidePage = () => (
    <GuidePageShell
        title="등급 반원 게이지 (GradeArcGauge)"
        description="위가 열린 반원을 등급 자리만큼 채우고 그 안에 등급과 이름을 둡니다. 인쇄용 리포트에서 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="gag-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="gag-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        투자모형 일반분석 리포트의 최종 · 성장 · 밸류업 등급입니다.
                    </p>
                </div>
                <div className="flex flex-wrap items-end gap-8">
                    <GradeArcGauge grade="G3" label="성장등급" stepIndex={2} totalSteps={14} />
                    <GradeArcGauge grade="TI3" label="최종등급" stepIndex={2} totalSteps={14} size="lg" />
                    <GradeArcGauge grade="V3" label="밸류업등급" stepIndex={2} totalSteps={14} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gag-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="gag-shape" className="typo-h4-bold">
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
            <section aria-labelledby="gag-size" className="flex flex-col gap-4">
                <div>
                    <h2 id="gag-size" className="typo-h4-bold">
                        크기와 색 (Size)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        색은 크기가 정합니다 — size 를 고르면 색이 함께 따라오므로 사용처에서 색을 넘기지 않습니다.
                        가운데 게이지를 눈에 띄게 하려는 구분입니다.
                    </p>
                </div>
                <ul className="flex flex-wrap items-end gap-8">
                    {SIZE_CASES.map((item) => (
                        <li key={item.size} className="flex min-w-0 flex-col items-center gap-2">
                            <GradeArcGauge
                                grade="TI3"
                                label="최종등급"
                                stepIndex={2}
                                totalSteps={14}
                                size={item.size}
                            />
                            <p className="typo-body-xl-bold text-foreground">{item.title}</p>
                            <p className="typo-body-m-regular text-muted-foreground break-keep">{item.description}</p>
                            {/* 색 이름만으로는 어느 색인지 알 수 없어 칩으로 함께 보인다(가이드 화면이라 토큰
                                변수를 인라인으로 쓴다[PB-12]). */}
                            <p className="typo-body-m-regular text-foreground flex items-center gap-2">
                                <span
                                    aria-hidden="true"
                                    className="rounded-2xs size-icon-sm shrink-0"
                                    style={{background: item.swatch}}
                                />
                                <span className="min-w-0">{item.color}</span>
                            </p>
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gag-step" className="flex flex-col gap-4">
                <div>
                    <h2 id="gag-step" className="typo-h4-bold">
                        등급 자리 (Step)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        등급이 몇 번째인지에 따라 채움이 달라집니다. 14단계를 모두 늘어놓은 모습입니다 — 1등급이 가득
                        차고 14등급이 한 칸만 찹니다.
                    </p>
                </div>
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gag-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="gag-loading" className="typo-h4-bold">
                        불러오는 중 (Loading)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        isLoading 을 주면 같은 크기의 반원 스켈레톤이 대신 섭니다. 채움은 등급이 정해져야 그릴 수 있어
                        트랙만 두고 이름 자리만 잡습니다.
                    </p>
                </div>
                <div className="flex flex-wrap items-end gap-8">
                    <GradeArcGauge grade="" label="성장등급" stepIndex={0} totalSteps={14} isLoading />
                    <GradeArcGauge grade="" label="최종등급" stepIndex={0} totalSteps={14} size="lg" isLoading />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gag-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="gag-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        등급 목록과 그 자리로 채움이 정해집니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="GradeArcGauge 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="gag-props" className="flex flex-col gap-4">
                <h2 id="gag-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="GradeArcGauge 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default GradeArcGaugeGuidePage
