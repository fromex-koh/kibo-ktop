// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {SegmentMeterSkeleton} from '@/components/composite/segment-meter-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'
import {SegmentMeter, type SegmentMeterProps} from '@/components/custom/segment-meter'

export const metadata: Metadata = {title: '단계 칸 막대 (SegmentMeter)'}

type CaseProps = Pick<SegmentMeterProps, 'value' | 'total' | 'color'>

// 상태별 색 — 보고서 4대 혁신역량 점수 카드와 같다(우수 · 양호 · 보통 · 미흡 · 취약).
const TONES = [
    {label: '우수', color: 'var(--raw-blue-500)', value: 9},
    {label: '양호', color: 'var(--raw-mint-700)', value: 7},
    {label: '보통', color: 'var(--raw-orange-500)', value: 5},
    {label: '미흡', color: 'var(--raw-error-500)', value: 3},
    {label: '취약', color: 'var(--raw-gray-700)', value: 1},
] as const

const USAGE_CODE = `import {SegmentMeter} from '@/components/custom/segment-meter'

<SegmentMeter value={7} total={10} color="var(--raw-mint-700)" ariaLabel="인프라 10단계 중 7단계" />`

const DATA_CODE = `// [프론트엔드 연동] value 는 도달 단계(정수)다 — 점수(63.7)를 넘기지 않는다.
// 점수 → 단계 환산은 백엔드 값(level)을 그대로 쓴다. 색은 상태(tone)에 맞춰 고른다.
<SegmentMeter
  value={capability.level}
  total={10}
  color={ARC_GAUGE_TONE_COLORS[capability.tone]}
  ariaLabel={\`\${capability.label} 10단계 중 \${capability.level}단계\`}
/>`

const SHAPE_RULES = [
    '칸 12×16 · 간격 4 · 모서리 2(rounded-3xs)로 한 줄에 늘어놓습니다.',
    '도달 단계까지는 color 로 채우고, 나머지 칸은 흰 면(surface)에 테두리 gray.100 으로 비워 둡니다.',
    '칸은 장식이라 숨기고 role="img" 이름(예: 10단계 중 7단계)으로 읽어 줍니다 — 색에만 기대지 않습니다.',
] as const

const PROPS_ITEMS = [
    ['SegmentMeter', 'value', '도달 단계입니다. 소수는 반올림하고 범위를 벗어나면 끝으로 맞춥니다.', '-', 'number'],
    ['SegmentMeter', 'total', '전체 단계 수입니다. 1~20 으로 맞춥니다.', '10', 'number'],
    ['SegmentMeter', 'color', '채운 칸 색(토큰 변수)입니다.', '-', 'string'],
    ['SegmentMeter', 'ariaLabel', '화면 낭독기 이름입니다. 없으면 “10단계 중 7단계”처럼 만듭니다.', '-', 'string'],
    ['SegmentMeterSkeleton', 'total', '자리 표시 칸 수입니다. SegmentMeter 의 total 과 같게 둡니다.', '10', 'number'],
] as const

const SPECIAL_CASES: readonly {title: string; description: string; meter: CaseProps}[] = [
    {title: '0단계', description: '모든 칸을 비웁니다.', meter: {value: 0, color: 'var(--raw-blue-500)'}},
    {title: '가득 참', description: '모든 칸을 채웁니다.', meter: {value: 10, color: 'var(--raw-blue-500)'}},
    {
        title: '소수 단계',
        description: '반올림합니다(6.5 → 7). 칸을 반만 채우지 않습니다.',
        meter: {value: 6.5, color: 'var(--raw-mint-700)'},
    },
    {
        title: '범위를 벗어난 값 (잘못된 자료)',
        description: '0 보다 작으면 0, 전체보다 크면 가득 참으로 맞춥니다(value 12 → 10).',
        meter: {value: 12, color: 'var(--raw-error-500)'},
    },
    {
        title: '점수를 잘못 넘겼을 때',
        description: '점수(63.7)를 넘기면 가득 참으로 보입니다 — 단계(정수)를 넘겨야 합니다.',
        meter: {value: 63.7, color: 'var(--raw-orange-500)'},
    },
    {
        title: '단계 수가 다를 때',
        description: '전체 단계 수만큼 칸을 그립니다(5단계 중 3단계).',
        meter: {value: 3, total: 5, color: 'var(--raw-blue-500)'},
    },
    {
        title: '단계 수가 너무 많을 때 (잘못된 자료)',
        description: '칸은 20 개까지만 그립니다 — 카드를 넘도록 늘어나지 않습니다(total 100 → 20).',
        meter: {value: 70, total: 100, color: 'var(--raw-blue-500)'},
    },
] as const

const SegmentMeterGuidePage = () => (
    <GuidePageShell
        title="단계 칸 막대 (SegmentMeter)"
        description="전체 단계 수만큼 작은 칸을 늘어놓고 도달한 단계까지 색으로 채웁니다."
    >
        <BaseCard>
            <section aria-labelledby="sm-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="sm-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서 Tech-Index 탭 “4대 혁신역량 점수” 카드의 단계 표시입니다. 색은
                        상태(우수 · 양호 · 보통 · 미흡 · 취약)를 따릅니다.
                    </p>
                </div>
                <ul className="flex list-none flex-wrap gap-6">
                    {TONES.map((tone) => (
                        <li
                            key={tone.label}
                            className="border-subtle-3 bg-card flex flex-col items-center gap-2 rounded-sm border p-6"
                        >
                            <span className="typo-body-xl-bold">{tone.label}</span>
                            <SegmentMeter
                                value={tone.value}
                                color={tone.color}
                                ariaLabel={`${tone.label} 10단계 중 ${tone.value}단계`}
                            />
                        </li>
                    ))}
                </ul>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sm-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="sm-shape" className="typo-h4-bold">
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
            <section aria-labelledby="sm-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="sm-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        칸 수가 어긋나거나 카드를 넘을 수 있는 경우입니다. 모두 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
                            <SegmentMeter {...item.meter} />
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sm-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="sm-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은 <code className="font-mono">SegmentMeterSkeleton</code>을 같은 자리에
                        둡니다. 칸 크기 · 간격 · 모서리 · 칸 수가 같고, 채움 여부를 모르므로 모든 칸을 같은 회색으로
                        칠합니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <SegmentMeterSkeleton />
                    </div>
                    <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <SegmentMeter value={7} color="var(--raw-mint-700)" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sm-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="sm-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        백엔드가 준 도달 단계를 그대로 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="SegmentMeter 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sm-props" className="flex flex-col gap-4">
                <h2 id="sm-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="SegmentMeter 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SegmentMeterGuidePage
