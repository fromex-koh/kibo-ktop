// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {ScoreRing, type ScoreRingTone} from '@/components/custom/score-ring'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '점수 원형 게이지 (ScoreRing)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {ScoreRing} from '@/components/custom/score-ring'

<ScoreRing
  score={73.7}
  caption="Tech-Index Score"
  statusLabel="양호"
  tone="good"
  ariaLabel="Tech-Index 지수 73.7점 · 양호"
/>`

const DATA_CODE = `// 점수 하나만 넘기면 채움 길이가 따라갑니다.
// 등급 이름과 tone 은 점수가 드는 구간의 자리(낮은 구간 → 높은 구간)에서 찾습니다.
const BAND_TONES = ['weak', 'poor', 'normal', 'good', 'excellent']

const band = findTechIndexBand(report.score)
const bandIndex = band ? report.bands.indexOf(band) : -1

<ScoreRing
  score={report.score}
  caption="Tech-Index Score"
  statusLabel={band?.label ?? ''}
  tone={BAND_TONES[bandIndex] ?? 'weak'}
  ariaLabel={\`Tech-Index 지수 \${report.score}점 · \${band?.label}\`}
/>`

const LOADING_CODE = `<ScoreRing
  score={report.score}
  caption="Tech-Index Score"
  statusLabel={band?.label ?? ''}
  isLoading={isLoading}
  ariaLabel="Tech-Index 지수"
/>`

const TONE_CASES: readonly {tone: ScoreRingTone; score: number; label: string; color: string}[] = [
    {tone: 'excellent', score: 100, label: '우수', color: 'blue.500'},
    {tone: 'good', score: 73.7, label: '양호', color: 'mint.700'},
    {tone: 'normal', score: 58.3, label: '보통', color: 'orange.500'},
    {tone: 'poor', score: 35.7, label: '미흡', color: 'error.500'},
    {tone: 'weak', score: 17.9, label: '취약', color: 'gray.700'},
]

const EDGE_CASES: readonly {title: string; description: string; score: number; label: string; tone: ScoreRingTone}[] = [
    {title: '0점', description: '채움 없이 트랙만 보입니다.', score: 0, label: '취약', tone: 'weak'},
    {title: '100점', description: '한 바퀴를 다 채웁니다.', score: 100, label: '우수', tone: 'excellent'},
    {title: '범위 밖(120점)', description: '끝(100)으로 맞춰 그립니다.', score: 120, label: '우수', tone: 'excellent'},
]

const CHOICE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'shows', header: '보여 주는 값', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'score-ring',
        cells: [
            <code key="component">ScoreRing</code>,
            '0~100 점수 + 등급',
            '한 바퀴 원(지름 160)입니다. 가운데에 이름 · 점수 · 등급을 두고 로딩을 isLoading 으로 받습니다.',
        ],
    },
    {
        key: 'score-gauge',
        cells: [
            <Link key="component" href="/component-guide/score-gauge" className={LINK_CLASS}>
                ScoreGauge
            </Link>,
            '0~100 점수 + 상태',
            '위가 열린 큰 원호(320)입니다. 단위와 보조 문구를 둘 수 있고 색을 덮어쓸 수 있습니다.',
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
] as const

const PROPS_ITEMS = [
    [
        'ScoreRing',
        'score',
        '0~100 점수입니다. 범위를 벗어나면 끝으로 맞추고, 소수 첫째 자리까지 보입니다.',
        '-',
        'number',
    ],
    ['ScoreRing', 'caption', '원 안 맨 위의 이름입니다.', '-', 'string'],
    ['ScoreRing', 'statusLabel', '점수 아래 등급 이름입니다.', '-', 'string'],
    ['ScoreRing', 'ariaLabel', '그림 전체를 읽어 줄 이름입니다.', '-', 'string'],
    [
        'ScoreRing',
        'tone',
        '등급입니다. 채움 색을 정합니다.',
        "'good'",
        "'excellent' | 'good' | 'normal' | 'poor' | 'weak'",
    ],
    ['ScoreRing', 'isLoading', '같은 크기의 원 스켈레톤을 대신 보입니다.', 'false', 'boolean'],
    [
        'ScoreRing',
        'loadingLabel',
        '불러오는 중에 화면 낭독기가 읽을 말입니다.',
        "'지수 점수를 불러오는 중입니다.'",
        'string',
    ],
    ['ScoreRing', 'className · div props', '바깥 div 에 전달됩니다. children 은 받지 않습니다.', '-', 'HTMLAttributes'],
] as const

const ScoreRingGuidePage = () => (
    <GuidePageShell
        title="점수 원형 게이지 (ScoreRing)"
        description="0~100 점수를 한 바퀴 원으로 채우고, 가운데에 이름 · 점수 · 등급을 두는 게이지입니다."
    >
        <BaseCard>
            <section aria-labelledby="sr-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sr-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        12시에서 시작해 시계 방향으로 <code>score</code> 만큼 채웁니다. 고정 좌표 SVG 라 브라우저가
                        크기를 재지 않습니다.
                    </p>
                </div>
                <ScoreRing
                    score={73.7}
                    caption="Tech-Index Score"
                    statusLabel="양호"
                    ariaLabel="Tech-Index 지수 73.7점 · 양호"
                />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sr-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sr-variants" className="typo-h4-bold">
                        등급 색과 상태
                    </h2>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">등급 색 (tone)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            다섯 등급이 각각 다른 색으로 찹니다. 색은 <code>tone</code> 이 정하므로 점수와 함께 tone 도
                            넘깁니다.
                        </p>
                        <ul className="flex flex-wrap gap-6">
                            {TONE_CASES.map((item) => (
                                <li key={item.tone} className="flex min-w-0 flex-col items-center gap-2">
                                    <ScoreRing
                                        score={item.score}
                                        caption="Tech-Index Score"
                                        statusLabel={item.label}
                                        tone={item.tone}
                                        ariaLabel={`${item.label} 예시 ${item.score}점`}
                                    />
                                    <p className="typo-body-m-regular text-label-foreground">
                                        <code>{item.tone}</code> · {item.color}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">특이 케이스</h3>
                        <ul className="flex flex-wrap gap-6">
                            {EDGE_CASES.map((item) => (
                                <li key={item.title} className="flex min-w-0 flex-col gap-2">
                                    <p className="typo-body-xl-bold text-foreground">{item.title}</p>
                                    <p className="typo-body-m-regular text-label-foreground">{item.description}</p>
                                    <ScoreRing
                                        score={item.score}
                                        caption="Tech-Index Score"
                                        statusLabel={item.label}
                                        tone={item.tone}
                                        ariaLabel={`${item.title} 예시`}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">불러오는 중 (isLoading)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            같은 크기의 원 스켈레톤이 대신 서고 <code>loadingLabel</code> 이 낭독됩니다.
                        </p>
                        <ScoreRing score={0} caption="Tech-Index Score" statusLabel="" isLoading ariaLabel="예시" />
                        <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sr-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sr-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        원의 모양과 가운데에 둘 정보로 고릅니다.
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
            <section aria-labelledby="sr-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sr-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        원은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 읽히므로 점수와 등급을 한
                        문장으로 넘깁니다[5.1.1].
                    </li>
                    <li>
                        등급이 글자(<code>statusLabel</code>)로도 있어 색만으로 뜻을 전하지 않습니다[5.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sr-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sr-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ScoreRing Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ScoreRingGuidePage
