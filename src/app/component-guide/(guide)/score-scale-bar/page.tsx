// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import type {ReactNode} from 'react'
import {BaseCard} from '@/components/composite/base-card'
import {ScoreScaleBarSkeleton} from '@/components/composite/score-scale-bar-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {SCORE_SCALE_BAR_TONE_CLASS, ScoreScaleBar} from '@/components/custom/score-scale-bar'
import {getTechIndexGrade} from '@/content/service/k-bigx-innovation-report'

export const metadata: Metadata = {title: '점수 눈금 막대 (ScoreScaleBar)'}

const LINK_CLASS = 'text-primary underline underline-offset-4'
const DEMO_FRAME = 'bg-background border-border flex flex-col gap-8 rounded-xl border p-6'

const USAGE_CODE = `import {SCORE_SCALE_BAR_TONE_CLASS, ScoreScaleBar} from '@/components/custom/score-scale-bar'
import {getTechIndexGrade} from '@/content/service/k-bigx-innovation-report'

const grade = getTechIndexGrade(score) // 73.8 → {label: '양호', tone: 'good', …}

<ScoreScaleBar
  score={score}
  ariaLabel="혁신성장역량지수"
  valueText={\`\${score}점, \${grade.label}\`}
  fillClassName={SCORE_SCALE_BAR_TONE_CLASS[grade.tone]}
/>`

const PRINT_CODE = `// K-BIGx 인쇄본 — 색 · 크기를 kbx 클래스로 넘깁니다(.kbigx-print 안). kbigx-print-briefing.tsx
<ScoreScaleBar
  score={techIndex.score}
  ariaLabel="혁신성장역량지수"
  valueText={\`\${scoreText}점, \${grade.label}\`}
  tickPosition="top"                                    // 눈금 숫자를 막대 위에
  className="gap-2.5"
  trackClassName="bg-kbx-divider h-10"                  // 막대 높이 40
  // 등급 색을 흰색과 45% 로 미리 섞은 불투명 색 — 'bg-kbx-grade-<등급>-fill'
  // (투명도로 겹치면 Safari PDF 색이 Chrome 과 달라진다)
  fillClassName={GAUGE_FILL_CLASS[grade.tone]}
  markerClassName="bg-kbx-foreground w-kbx-3 -top-1.5 -bottom-1.5"
  tickClassName="kbx-text-22 font-kbx-semibold text-kbx-foreground-subtle"
/>
<KbxGradeTag tone={grade.tone}>{grade.label}</KbxGradeTag>  // 등급 색 바탕 + 흰 글자`

const SCALE_CODE = `{/* 최댓값 · 눈금 바꾸기 — 5점 만점 */}
<ScoreScaleBar score={3.6} max={5} ticks={[0, 1, 2, 3, 4, 5]} ariaLabel="만족도" />

{/* 눈금 숫자 없이 */}
<ScoreScaleBar score={42} ticks={[]} ariaLabel="달성률" />`

// 2. 등급별 — Tech-Index 점수 구간(TECH_INDEX_GRADES). max 이하이면 그 구간이다(20.5 는 미흡).
const GRADE_SAMPLES = [10, 30, 55, 73.8, 100] as const
const GRADE_ROWS = [
    {key: 'weak', cells: ['0 ~ 20', '취약', 'gray.700 (다크는 밝은 회색)', 'gray.700 (12.2:1)']},
    {key: 'poor', cells: ['20 초과 ~ 40', '미흡', 'error.500', 'error.500 (4.6:1)']},
    {key: 'normal', cells: ['40 초과 ~ 60', '보통', 'orange.500', 'orange.700 (4.5:1)']},
    {key: 'good', cells: ['60 초과 ~ 80', '양호', 'mint.700', 'mint.700 (3.4:1)']},
    {key: 'excellent', cells: ['80 초과 ~ 100', '우수', 'blue.500', 'blue.500 (4.5:1)']},
] as const

// 3. 엣지 케이스 — 끝값 · 범위 밖 · 숫자가 아닌 값 · 구간 경계.
const EDGE_CASES = [
    {key: 'zero', title: '0점', note: '채움 없이 표시선만 띠 왼쪽 끝 안에 섭니다.', score: 0},
    {
        key: 'full',
        title: '100점',
        note: '띠를 끝까지 채우고, 표시선은 자기 폭만큼 안쪽으로 당겨 띠 오른쪽 끝 안에 섭니다.',
        score: 100,
    },
    {
        key: 'boundary',
        title: '구간 경계 20 · 20.5',
        note: '20 은 취약, 20.5 는 미흡입니다(구간 끝값 이하).',
        score: 20.5,
    },
    {key: 'over', title: '범위 밖 120 · -5', note: '최댓값 · 0 으로 맞춰 그립니다(120 → 100, -5 → 0).', score: 120},
    {
        key: 'nan',
        title: '숫자가 아닌 값',
        note: 'NaN 은 0 으로 그립니다. 점수 글자는 사용처가 따로 처리합니다.',
        score: Number.NaN,
    },
] as const

const LOADING_CODE = `import {ScoreScaleBarSkeleton} from '@/components/composite/score-scale-bar-skeleton'

// 띠 높이 · 눈금 글자를 실제 막대와 같게 넘기면 자리가 흔들리지 않습니다.
{isLoading ? (
  <ScoreScaleBarSkeleton label="혁신성장역량지수를 불러오는 중입니다." />
) : (
  <ScoreScaleBar score={score} ariaLabel="혁신성장역량지수" fillClassName={SCORE_SCALE_BAR_TONE_CLASS[tone]} />
)}`

const PROPS_ITEMS = [
    ['ScoreScaleBar', 'score', '점수입니다. 0 ~ max 로 맞춰 그리고, 숫자가 아니면 0 입니다.', '-', 'number'],
    ['ScoreScaleBar', 'max', '최댓값입니다. 0 이하이면 100 으로 봅니다.', '100', 'number'],
    [
        'ScoreScaleBar',
        'ticks',
        '눈금 숫자입니다. 숫자는 값 자리에 가운데를 맞추고(25 → 띠의 25%), 양 끝(0 · 최댓값)은 띠 끝에 맞춥니다. 빈 배열이면 눈금을 그리지 않습니다.',
        '[0, 25, 50, 75, 100]',
        'readonly number[]',
    ],
    [
        'ScoreScaleBar',
        'tickPosition',
        "눈금 숫자 자리입니다. 'bottom' 은 막대 아래, 'top' 은 막대 위(K-BIGx 인쇄본 혁신성장역량지수)입니다.",
        "'bottom'",
        "'top' | 'bottom'",
    ],
    ['ScoreScaleBar', 'ariaLabel', '화면 낭독기가 읽을 이름입니다.', '-', 'string'],
    ['ScoreScaleBar', 'valueText', "낭독기가 읽을 값 문구입니다(예: '73.8점, 양호').", 'undefined', 'string'],
    [
        'ScoreScaleBar',
        'fillClassName',
        '채움 색입니다. 웹은 SCORE_SCALE_BAR_TONE_CLASS[tone] 을 씁니다.',
        "'bg-primary'",
        'string',
    ],
    ['ScoreScaleBar', 'trackClassName', '배경 띠의 높이 · 색입니다.', "'bg-muted h-4'", 'string'],
    [
        'ScoreScaleBar',
        'markerClassName',
        '세로 표시선의 폭 · 위아래로 나온 길이 · 색입니다.',
        "'bg-foreground w-0.5 -top-2 -bottom-2'",
        'string',
    ],
    [
        'ScoreScaleBar',
        'tickClassName',
        '눈금 숫자의 글자 · 색입니다.',
        "'typo-body-m-medium text-foreground-subtle'",
        'string',
    ],
    ['ScoreScaleBar', 'className', '바깥 상자(막대 ↔ 눈금 간격 등)에 덧붙일 클래스입니다.', 'undefined', 'string'],
    [
        'ScoreScaleBar',
        '...props',
        '나머지 div 속성을 전달합니다.',
        '-',
        "Omit<ComponentPropsWithoutRef<'div'>, 'children'>",
    ],
    [
        'ScoreScaleBarSkeleton',
        'label',
        '불러오는 중 문구(화면 낭독기용)입니다.',
        "'점수를 불러오는 중입니다.'",
        'string',
    ],
    ['ScoreScaleBarSkeleton', 'tickCount', '눈금 숫자 수입니다. 0 이면 눈금 줄을 그리지 않습니다.', '5', 'number'],
    [
        'ScoreScaleBarSkeleton',
        'trackClassName · tickClassName',
        '띠 높이 · 눈금 글자(줄 높이)입니다 — 실제 막대에 넘긴 것과 같게 넘기면 높이가 같습니다.',
        "'h-4' · 'typo-body-m-medium'",
        'string',
    ],
] as const

const SectionHeading = ({id, title, children}: {id: string; title: string; children?: ReactNode}) => (
    <div className="flex flex-col gap-2">
        <h2 id={id} className="typo-h4-bold">
            {title}
        </h2>
        {children ? <p className="typo-body-l-regular text-label-foreground">{children}</p> : null}
    </div>
)

const scoreFormat = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 1, maximumFractionDigits: 1})

// 등급 색을 붙인 예시 하나 — 점수 · 등급을 글자로도 적는다.
const GradeSample = ({score}: {score: number}) => {
    const grade = getTechIndexGrade(score)
    const scoreText = Number.isFinite(score) ? `${scoreFormat.format(score)}점` : '점수 없음'

    return (
        <div className="flex flex-col gap-3">
            <p className="typo-body-l-bold text-foreground">
                {scoreText} · {grade.label}
            </p>
            <ScoreScaleBar
                score={score}
                ariaLabel="혁신성장역량지수"
                valueText={`${scoreText}, ${grade.label}`}
                fillClassName={SCORE_SCALE_BAR_TONE_CLASS[grade.tone]}
            />
        </div>
    )
}

const ScoreScaleBarGuidePage = () => (
    <GuidePageShell
        title="점수 눈금 막대 (ScoreScaleBar)"
        description="0 ~ 최댓값 눈금 위에 점수만큼 채우고 점수 자리에 세로 표시선을 세우는 막대입니다. K-BIGx 보고서 인쇄본 진단브리핑의 혁신성장역량지수 막대입니다."
    >
        <BaseCard>
            <section aria-labelledby="ssb-basic" className="flex flex-col gap-6">
                <SectionHeading id="ssb-basic" title="1. 기본 사용">
                    채움 색은 점수 구간(등급)에 맞춰 사용처가 넘깁니다. 웹 화면은{' '}
                    <code>SCORE_SCALE_BAR_TONE_CLASS</code> 로 점수 원호 게이지(ScoreGauge)와 같은 등급 색을 씁니다.
                    백분율 글자가 위에 붙는 일반 진행률은{' '}
                    <Link href="/component-guide/progress-bar" className={LINK_CLASS}>
                        ProgressBar
                    </Link>
                    입니다.
                </SectionHeading>
                <div className={DEMO_FRAME}>
                    <GradeSample score={73.8} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssb-grade" className="flex flex-col gap-6">
                <SectionHeading id="ssb-grade" title="2. 등급별 색">
                    Tech-Index 점수 구간(<code>TECH_INDEX_GRADES</code>)마다 막대 채움과 등급 뱃지 색이 바뀝니다. 구간
                    끝값 이하이면 그 구간입니다. 인쇄본 뱃지는 등급 색 바탕에 흰 글자라, 흰 글자가 읽히지 않는
                    보통(주황)만 한 단계 진한 색을 씁니다(괄호는 흰 글자 대비, 22px 굵은 글씨 기준 3:1 이상).
                </SectionHeading>
                <div className="overflow-x-auto">
                    <table className="typo-body-m-regular text-foreground w-full">
                        <caption className="sr-only">Tech-Index 점수 구간별 막대 · 뱃지 색</caption>
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-start">
                                    점수
                                </th>
                                <th scope="col" className="px-4 py-3 text-start">
                                    등급
                                </th>
                                <th scope="col" className="px-4 py-3 text-start">
                                    막대 채움
                                </th>
                                <th scope="col" className="px-4 py-3 text-start">
                                    인쇄본 뱃지 바탕
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {GRADE_ROWS.map((row) => (
                                <tr key={row.key} className="border-border border-b">
                                    <th scope="row" className="px-4 py-3 text-start font-normal">
                                        {row.cells[0]}
                                    </th>
                                    {row.cells.slice(1).map((cell) => (
                                        <td key={cell} className="px-4 py-3">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={DEMO_FRAME}>
                    {GRADE_SAMPLES.map((score) => (
                        <GradeSample key={score} score={score} />
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssb-edge" className="flex flex-col gap-6">
                <SectionHeading id="ssb-edge" title="3. 엣지 케이스">
                    끝값 · 구간 경계 · 범위 밖 값에서도 채움과 표시선이 띠 밖으로 나가지 않습니다.
                </SectionHeading>
                <div className={DEMO_FRAME}>
                    {EDGE_CASES.map((item) => (
                        <div key={item.key} className="flex flex-col gap-2">
                            <p className="typo-body-l-regular text-label-foreground">
                                <strong className="typo-body-l-bold text-foreground">{item.title}</strong> · {item.note}
                            </p>
                            <GradeSample score={item.score} />
                        </div>
                    ))}
                </div>
                <div className={DEMO_FRAME}>
                    <div className="flex flex-col gap-2">
                        <p className="typo-body-l-bold text-foreground">5점 만점 · 눈금 바꾸기</p>
                        <ScoreScaleBar score={3.6} max={5} ticks={[0, 1, 2, 3, 4, 5]} ariaLabel="만족도" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="typo-body-l-bold text-foreground">눈금 없이</p>
                        <ScoreScaleBar score={42} ticks={[]} ariaLabel="달성률" />
                    </div>
                </div>
                <CodeBlock code={SCALE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssb-loading" className="flex flex-col gap-6">
                <SectionHeading id="ssb-loading" title="4. 불러오는 중 (ScoreScaleBarSkeleton)">
                    띠 자리와 눈금 숫자 자리를 같은 배치로 그립니다. 인쇄본은 데이터를 받은 뒤 서버에서 바로 그려
                    스켈레톤 없이 나옵니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        <p className="typo-body-l-bold text-foreground">불러오는 중</p>
                        <ScoreScaleBarSkeleton label="혁신성장역량지수를 불러오는 중입니다." />
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="typo-body-l-bold text-foreground">불러온 뒤</p>
                        <ScoreScaleBar
                            score={73.8}
                            ariaLabel="혁신성장역량지수"
                            valueText="73.8점, 양호"
                            fillClassName={SCORE_SCALE_BAR_TONE_CLASS[getTechIndexGrade(73.8).tone]}
                        />
                    </div>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssb-print" className="flex flex-col gap-6">
                <SectionHeading id="ssb-print" title="5. K-BIGx 인쇄본에서">
                    인쇄본은 kbx 클래스로 템플릿 치수(띠 높이 26 · 표시선 폭 3 · 위아래 10 · 눈금 20px)를 넘깁니다.
                </SectionHeading>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        점수는 늘 소수 첫째 자리까지 적습니다(73.8 · 60.0 · 100.0). 점수 칸은 템플릿 폭 420 이 기본이고,
                        100.0 처럼 길면 뱃지까지 들어가도록 넓어지며 그만큼 막대가 짧아집니다(692 → 630).
                    </li>
                    <li>
                        등급 뱃지(<code>KbxGradeTag tone</code>)와 막대 채움이 같은 등급 색을 따릅니다. 요약 문장
                        끝말(취약함 · 미흡함 · 보통 · 양호함 · 우수함)도 같은 구간에서 옵니다.
                    </li>
                    <li>
                        인쇄본에서 넣어 본 점수: 0 · 10 · 20 · 20.5 · 21 · 40 · 55 · 60 · 73.8 · 80 · 81 · 99.9 · 100.0.
                        모두 쪽 넘침 없이 블록 높이가 같고, 표시선이 띠 안에 섭니다.
                    </li>
                </ul>
                <p className="typo-body-l-regular text-label-foreground">
                    확인 화면:{' '}
                    <Link
                        href="/corp/k-bigx-report/innovation-growth-report/report-print?sections=briefing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        K-BIGx 보고서 인쇄본 진단브리핑
                        <span className="sr-only"> (새 창)</span>
                    </Link>
                </p>
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssb-a11y" className="flex flex-col gap-6">
                <SectionHeading id="ssb-a11y" title="6. 접근성" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        띠는 <code>role=&quot;meter&quot;</code> 이고 <code>ariaLabel</code> 이 이름,{' '}
                        <code>aria-valuenow</code> · <code>valueText</code> 가 값입니다[8.2.1].
                    </li>
                    <li>표시선 · 눈금 숫자는 꾸밈이라 낭독하지 않습니다(aria-hidden).</li>
                    <li>점수와 등급은 막대 옆에 글자로도 적어 색만으로 정보를 전하지 않습니다[5.3.1].</li>
                    <li>
                        스켈레톤은 <code>role=&quot;status&quot;</code> 와 숨김 문구로 불러오는 중임을 알립니다.
                    </li>
                    <li>마우스 반응과 움직임이 없습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssb-props" className="flex flex-col gap-6">
                <SectionHeading id="ssb-props" title="7. Props API">
                    <code>score</code> 와 <code>ariaLabel</code> 이 필수입니다.
                </SectionHeading>
                <PropsTable items={PROPS_ITEMS} caption="ScoreScaleBar · ScoreScaleBarSkeleton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ScoreScaleBarGuidePage
