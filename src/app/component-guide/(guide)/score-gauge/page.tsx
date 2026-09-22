// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'
import {ScoreGauge} from '@/components/custom/score-gauge'

export const metadata: Metadata = {title: '점수 원호 게이지 (ScoreGauge)'}

const USAGE_CODE = `import {ScoreGauge} from '@/components/custom/score-gauge'

<ScoreGauge
  score={73.8}
  statusLabel="양호"
  caption="기준일자 · 2025-12-04"
  ariaLabel="혁신성장역량지수 73.8점, 양호"
/>`

const COLOR_CODE = `// 상태(tone)가 점수 구간 색을 정한다 — 우수 excellent · 양호 good · 보통 normal · 미흡 poor · 취약 weak.
<ScoreGauge score={55.1} statusLabel="보통" tone="normal" ariaLabel="…" />

// 범례에 없는 색이 필요할 때만 color(토큰 변수)로 덮는다.
<ScoreGauge score={55.1} statusLabel="보통" color="var(--raw-purple-500)" ariaLabel="…" />`

const SHAPE_RULES = [
    '원 지름 320 · 선 굵기 46 · 끝 둥글림의 원호입니다. 양 끝이 수평선에서 약 10° 아래까지 내려가 위쪽 208 만 보입니다.',
    '점수(0~100)만큼 왼쪽 아래 끝에서 시계 방향으로 채웁니다. 범위를 벗어나면 0 · 100 으로 맞춥니다.',
    '가운데 글자는 점수 40 Bold + 단위 24 Bold → 상태 20 Bold → 보조 14 Regular 순으로 아래에서부터 쌓습니다.',
    '점수는 0~100 으로 맞추고 소수 첫째 자리까지 보입니다 — 채움과 글자가 항상 같은 값입니다.',
    '폭이 320 보다 좁으면 원호와 글자가 같은 비율로 함께 줄어듭니다. 점수 · 상태는 ariaLabel 로 한 번에 읽어 줍니다.',
] as const

const TONES = [
    {title: '우수 (excellent · blue.500)', score: 92.5, statusLabel: '우수', tone: 'excellent'},
    {title: '양호 (good · mint.700)', score: 73.8, statusLabel: '양호', tone: 'good'},
    {title: '보통 (normal · orange.500)', score: 55.1, statusLabel: '보통', tone: 'normal'},
    {title: '미흡 (poor · error.500)', score: 38.4, statusLabel: '미흡', tone: 'poor'},
    {title: '취약 (weak · gray.700)', score: 21.6, statusLabel: '취약', tone: 'weak'},
] as const

// 자릿수 · 범위 · 문구 길이 · 폭이 달라 배치가 흔들릴 수 있는 경우. 모두 컴포넌트가 처리하므로 받은 값을 그대로 넣는다.
const SPECIAL_CASES = [
    {
        title: '100점 (세 자리)',
        description: '가장 넓은 숫자입니다. 원호 안쪽 폭(224) 안에 "100 점"이 들어갑니다.',
        score: 100,
        statusLabel: '우수',
        tone: 'excellent',
        caption: '기준일자 · 2025-12-04',
    },
    {
        title: '한 자리 점수',
        description: '숫자가 좁아도 가운데 정렬이 유지됩니다.',
        score: 7.5,
        statusLabel: '취약',
        tone: 'weak',
        caption: '기준일자 · 2025-12-04',
    },
    {
        title: '0점',
        description: '채움 없이 트랙만 보입니다.',
        score: 0,
        statusLabel: '취약',
        tone: 'weak',
        caption: '기준일자 · 2025-12-04',
    },
    {
        title: '범위를 벗어난 값 (120)',
        description: '0~100 으로 맞춰 채움과 글자가 같은 값(100)을 보입니다. 음수 · 숫자가 아닌 값은 0 이 됩니다.',
        score: 120,
        statusLabel: '우수',
        tone: 'excellent',
        caption: '기준일자 · 2025-12-04',
    },
    {
        title: '소수가 긴 값 (73.856)',
        description: '소수 첫째 자리까지 반올림해 보입니다(73.9).',
        score: 73.856,
        statusLabel: '양호',
        tone: 'good',
        caption: '기준일자 · 2025-12-04',
    },
    {
        title: '긴 상태 · 보조 문구',
        description: '원호 안쪽 폭 안에서 어절 단위로 접힙니다. 문구는 짧게 유지하길 권장합니다.',
        score: 48.2,
        statusLabel: '보통 (업종 평균 이하)',
        tone: 'normal',
        caption: '기준일자 · 2025-12-04 (기술신용평가 기준)',
    },
] as const

const NARROW_CASE_DESCRIPTION =
    '게이지 폭이 320 보다 좁으면 원호와 가운데 글자가 같은 비율로 함께 줄어듭니다(아래는 폭 240). 글자만 그대로면 "100 점"이 원호에 닿습니다.'

const PROPS_ITEMS = [
    ['ScoreGauge', 'score', '0~100 점수입니다. 범위를 벗어나면 끝으로 맞춥니다.', '-', 'number'],
    ['ScoreGauge', 'unit', '점수 뒤 단위입니다.', "'점'", 'string'],
    ['ScoreGauge', 'statusLabel', '점수 아래 상태 이름입니다(예: 양호).', '-', 'string'],
    ['ScoreGauge', 'caption', '맨 아래 보조 문구입니다(예: 기준일자).', 'undefined', 'string'],
    [
        'ScoreGauge',
        'tone',
        '상태입니다. 점수 구간 색을 정합니다(우수 excellent · 양호 good · 보통 normal · 미흡 poor · 취약 weak).',
        "'good'",
        "'excellent' | 'good' | 'normal' | 'poor' | 'weak'",
    ],
    ['ScoreGauge', 'color', '상태 색 대신 쓸 색입니다(토큰 변수). 주면 tone 보다 우선합니다.', 'undefined', 'string'],
    ['ScoreGauge', 'ariaLabel', '점수와 상태를 한 문장으로 읽어 줍니다.', '-', 'string'],
    [
        'ScoreGauge',
        'className · div props',
        '바깥 여백 등 네이티브 div 속성을 전달합니다.',
        'undefined',
        'HTMLAttributes',
    ],
] as const

const DATA_CODE = `// [프론트엔드 연동] 점수(0~100)만 받는다. 상태 이름 · 색(tone)은 점수 구간으로 정해 게이지 · 구간표 · 요약 문장이 어긋나지 않게 한다
// (K-BIGx 보고서: content/service/k-bigx-innovation-report.ts 의 getTechIndexGrade).
const grade = getTechIndexGrade(techIndex.score) // {label: '양호', tone: 'good', …}

<ScoreGauge
  score={techIndex.score}
  statusLabel={grade.label}
  tone={grade.tone}
  caption={\`기준일자 · \${report.createdAt}\`}
  ariaLabel={\`Tech-Index \${techIndex.score}점, \${grade.label}\`}
/>`

const ScoreGaugeGuidePage = () => (
    <GuidePageShell
        title="점수 원호 게이지 (ScoreGauge)"
        description="0~100 점수를 위가 열린 굵은 원호로 보여 주고, 가운데에 점수 · 상태 · 보조 문구를 두는 게이지입니다."
    >
        <BaseCard>
            <section aria-labelledby="sg-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="sg-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서의 혁신성장역량지수 점수 카드와 같은 구성입니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card max-w-147 rounded-sm border p-6">
                    <ScoreGauge
                        score={73.8}
                        statusLabel="양호"
                        caption="기준일자 · 2025-12-04"
                        ariaLabel="혁신성장역량지수 73.8점, 양호"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sg-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="sg-shape" className="typo-h4-bold">
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
            <section aria-labelledby="sg-color" className="flex flex-col gap-4">
                <div>
                    <h2 id="sg-color" className="typo-h4-bold">
                        색 (Color)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        상태(<code className="font-mono">tone</code>)가 점수 구간 색을 정합니다 — 범례의 우수 · 양호 ·
                        보통 · 미흡 · 취약 다섯 색입니다. 트랙은 항상 gray.50 입니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {TONES.map((tone) => (
                        <li key={tone.title} className="flex flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{tone.title}</h3>
                            <ScoreGauge
                                score={tone.score}
                                statusLabel={tone.statusLabel}
                                tone={tone.tone}
                                ariaLabel={`${tone.score}점, ${tone.statusLabel}`}
                            />
                        </li>
                    ))}
                </ul>
                <CodeBlock code={COLOR_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sg-special" className="flex flex-col gap-4">
                <div>
                    <h2 id="sg-special" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        자릿수 · 범위 · 문구 길이 · 폭이 달라 배치가 흔들릴 수 있는 경우입니다. 모두 컴포넌트가
                        처리하므로 받은 값을 그대로 넣으면 됩니다.
                    </p>
                </div>
                <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {SPECIAL_CASES.map((item) => (
                        <li key={item.title} className="flex flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
                            <ScoreGauge
                                score={item.score}
                                statusLabel={item.statusLabel}
                                tone={item.tone}
                                caption={item.caption}
                                ariaLabel={`${item.score}점, ${item.statusLabel}`}
                            />
                        </li>
                    ))}
                    <li className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">좁은 폭 (240)</h3>
                        <p className="typo-body-m-regular text-muted-foreground">{NARROW_CASE_DESCRIPTION}</p>
                        <ScoreGauge
                            score={100}
                            statusLabel="우수"
                            tone="excellent"
                            caption="기준일자 · 2025-12-04"
                            ariaLabel="100점, 우수"
                            className="max-w-60"
                        />
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sg-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="sg-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터를 기다리는 동안은{' '}
                        <code className="font-mono">ChartSkeleton type=&quot;score-gauge&quot;</code>를 같은 자리에
                        둡니다. 원호 · 가운데 줄의 짜임이 같아 불러온 뒤 자리가 흔들리지 않습니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <ChartSkeleton type="score-gauge" label="혁신성장역량지수를 불러오는 중입니다." />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <ScoreGauge
                            score={73.8}
                            statusLabel="양호"
                            caption="기준일자 · 2025-12-04"
                            ariaLabel="혁신성장역량지수 73.8점, 양호"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sg-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="sg-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        점수(0~100)만 받아 넘기고, 상태 이름 · 색(tone)은 점수 구간으로 정합니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="ScoreGauge 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sg-props" className="flex flex-col gap-4">
                <h2 id="sg-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="ScoreGauge 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ScoreGaugeGuidePage
