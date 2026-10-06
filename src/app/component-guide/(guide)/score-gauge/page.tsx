// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {ScoreGauge} from '@/components/custom/score-gauge'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '점수 원호 게이지 (ScoreGauge)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {ScoreGauge} from '@/components/custom/score-gauge'

<ScoreGauge
  score={73.8}
  statusLabel="양호"
  caption="기준일자 · 2025-12-04"
  ariaLabel="혁신성장역량지수 73.8점, 양호"
/>`

const DATA_CODE = `// 점수(0~100)만 받고, 상태 이름 · tone 은 점수 구간으로 정해 게이지 · 구간표 · 요약 문장이 어긋나지 않게 합니다.
const grade = getTechIndexGrade(techIndex.score) // {label: '양호', tone: 'good', …}

<ScoreGauge
  score={techIndex.score}
  statusLabel={grade.label}
  tone={grade.tone}
  caption={\`기준일자 · \${report.createdAt}\`}
  ariaLabel={\`Tech-Index \${techIndex.score}점, \${grade.label}\`}
/>`

const COLOR_CODE = `// 상태(tone)가 점수 구간 색을 정합니다.
<ScoreGauge score={55.1} statusLabel="보통" tone="normal" ariaLabel="…" />

// 상태 색에 없는 색이 필요할 때만 color(토큰 변수)로 덮습니다. tone 보다 우선합니다.
<ScoreGauge score={55.1} statusLabel="보통" color="var(--raw-purple-500)" ariaLabel="…" />`

const LOADING_CODE = `import {ChartSkeleton} from '@/components/composite/chart-skeleton'

<ChartSkeleton type="score-gauge" label="혁신성장역량지수를 불러오는 중입니다." />`

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

const NARROW_CASE_DESCRIPTION = '폭이 320 보다 좁으면 원호와 가운데 글자가 같은 비율로 함께 줄어듭니다(아래는 폭 240).'

const CHOICE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'shows', header: '보여 주는 값', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'score-gauge',
        cells: [
            <code key="component">ScoreGauge</code>,
            '0~100 점수 + 상태',
            '위가 열린 원호 가운데에 점수 · 상태 · 보조 문구를 둡니다.',
        ],
    },
    {
        key: 'score-ring',
        cells: [
            <Link key="component" href="/component-guide/score-ring" className={LINK_CLASS}>
                ScoreRing
            </Link>,
            '0~100 점수 + 등급',
            '한 바퀴 원(지름 160)입니다. 보조 문구와 단위가 없고 로딩을 isLoading 으로 받습니다.',
        ],
    },
    {
        key: 'segment-meter',
        cells: [
            <Link key="component" href="/component-guide/segment-meter" className={LINK_CLASS}>
                SegmentMeter
            </Link>,
            '도달 단계(정수)',
            '점수가 아니라 단계를 칸으로 보입니다.',
        ],
    },
    {
        key: 'semicircle-rating',
        cells: [
            <Link key="component" href="/component-guide/semicircle-rating-gauge" className={LINK_CLASS}>
                SemicircleRatingGauge
            </Link>,
            '등급 + 채움 비율',
            '같은 원호를 줄인 크기(md)이며 색은 파랑 하나입니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'ScoreGauge',
        'score',
        '0~100 점수입니다. 범위를 벗어나거나 숫자가 아니면 끝(0 · 100)으로 맞추고, 소수는 첫째 자리까지 보입니다.',
        '-',
        'number',
    ],
    ['ScoreGauge', 'statusLabel', '점수 아래 상태 이름입니다(예: 양호).', '-', 'string'],
    ['ScoreGauge', 'ariaLabel', '점수와 상태를 한 문장으로 읽어 줍니다.', '-', 'string'],
    ['ScoreGauge', 'unit', '점수 뒤 단위입니다.', "'점'", 'string'],
    ['ScoreGauge', 'caption', '맨 아래 보조 문구입니다(예: 기준일자).', 'undefined', 'string'],
    [
        'ScoreGauge',
        'tone',
        '상태입니다. 점수 구간 색을 정합니다.',
        "'good'",
        "'excellent' | 'good' | 'normal' | 'poor' | 'weak'",
    ],
    ['ScoreGauge', 'color', '상태 색 대신 쓸 색(토큰 변수)입니다. 주면 tone 보다 우선합니다.', 'undefined', 'string'],
    [
        'ScoreGauge',
        'className · div props',
        '바깥 div 에 전달됩니다. children 은 받지 않습니다.',
        '-',
        'HTMLAttributes',
    ],
] as const

const ScoreGaugeGuidePage = () => (
    <GuidePageShell
        title="점수 원호 게이지 (ScoreGauge)"
        description="0~100 점수를 위가 열린 굵은 원호로 보여 주고, 가운데에 점수 · 상태 · 보조 문구를 두는 게이지입니다."
    >
        <BaseCard>
            <section aria-labelledby="sg-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sg-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>score</code> 만큼 원호를 채우고 가운데에 점수 · 상태 · 보조 문구를 아래에서부터 쌓습니다.
                        폭이 320 보다 좁으면 원호와 글자가 같은 비율로 함께 줄어듭니다.
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
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sg-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sg-variants" className="typo-h4-bold">
                        상태 색과 특이 케이스
                    </h2>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">상태 색 (tone)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            다섯 상태가 각각 다른 색으로 찹니다. 트랙은 항상 같은 옅은 회색입니다.
                        </p>
                        <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {TONES.map((tone) => (
                                <li key={tone.title} className="flex flex-col gap-2">
                                    <p className="typo-body-xl-bold text-foreground">{tone.title}</p>
                                    <ScoreGauge
                                        score={tone.score}
                                        statusLabel={tone.statusLabel}
                                        tone={tone.tone}
                                        ariaLabel={`${tone.score}점, ${tone.statusLabel}`}
                                    />
                                </li>
                            ))}
                        </ul>
                        <CodeBlock code={COLOR_CODE} language="tsx" copyLabel="색 코드 복사" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">특이 케이스</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            자릿수 · 범위 · 문구 길이 · 폭이 달라도 컴포넌트가 처리하므로 받은 값을 그대로 넣습니다.
                        </p>
                        <ul className="grid list-none gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {SPECIAL_CASES.map((item) => (
                                <li key={item.title} className="flex flex-col gap-2">
                                    <p className="typo-body-xl-bold text-foreground">{item.title}</p>
                                    <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
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
                                <p className="typo-body-xl-bold text-foreground">좁은 폭 (240)</p>
                                <p className="typo-body-m-regular text-label-foreground">{NARROW_CASE_DESCRIPTION}</p>
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
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">불러오는 중 (ChartSkeleton)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>ScoreGauge</code> 는 로딩 prop 이 없어 같은 자리에 스켈레톤을 둡니다. 원호와 가운데
                            줄의 짜임이 같아 불러온 뒤 자리가 흔들리지 않습니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">불러오는 중</p>
                                <ChartSkeleton type="score-gauge" label="혁신성장역량지수를 불러오는 중입니다." />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-xl-bold text-foreground">불러온 뒤</p>
                                <ScoreGauge
                                    score={73.8}
                                    statusLabel="양호"
                                    caption="기준일자 · 2025-12-04"
                                    ariaLabel="혁신성장역량지수 73.8점, 양호"
                                />
                            </div>
                        </div>
                        <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sg-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sg-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        점수인지 단계인지, 어떤 모양으로 보일지로 고릅니다.
                    </p>
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
            <section aria-labelledby="sg-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sg-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        원호는 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 읽히므로 점수와 상태를 한
                        문장으로 넘깁니다[5.1.1].
                    </li>
                    <li>
                        상태가 글자(<code>statusLabel</code>)로도 있어 색만으로 뜻을 전하지 않습니다[5.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sg-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sg-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ScoreGauge Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ScoreGaugeGuidePage
