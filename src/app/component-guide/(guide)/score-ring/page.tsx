// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'
import {ARC_GAUGE_TONE_COLORS} from '@/components/custom/arc-gauge-shape'
import {ScoreRing, type ScoreRingTone} from '@/components/custom/score-ring'

export const metadata: Metadata = {title: '점수 원형 게이지 (ScoreRing)'}

const USAGE_CODE = `import {ScoreRing} from '@/components/custom/score-ring'

<ScoreRing
  score={73.7}
  caption="Tech-Index Score"
  statusLabel="양호"
  tone="good"
  ariaLabel="Tech-Index 지수 73.7점 · 양호"
/>`

const DATA_CODE = `// [프론트엔드 연동] 점수 하나만 넘기면 채움 길이가 따라갑니다.
// 등급 이름과 색은 점수가 드는 구간에서 찾습니다 — 색은 구간의 자리(낮은 구간 → 높은 구간)가 정하므로
// 구간의 점수 범위나 이름이 바뀌어도 따라갑니다.
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

const SHAPE_RULES = [
    '지름 160 · 선 굵기 20 이고 끝은 둥급니다. 12시에서 시작해 시계 방향으로 점수만큼 찹니다.',
    '트랙은 gray.50 이고 채움은 등급 색입니다 — 반원 게이지(ScoreGauge)와 같은 색을 씁니다.',
    '가운데는 위에서부터 이름(11 Regular) · 점수(28 Bold) · 등급(12 Bold)입니다.',
    '0~100 밖의 값은 끝으로 맞추고, 점수는 소수 첫째 자리까지 보입니다.',
    '브라우저가 크기를 재지 않고 고정 좌표로 그려, 인쇄물에도 화면과 같은 모양으로 나갑니다.',
    '수치는 그림 이름(ariaLabel)으로 읽어 줍니다 — 색만으로 등급을 전하지 않도록 등급 이름을 함께 둡니다[5.3.1].',
] as const

// 등급 다섯과 그 색 — 점수 구간의 자리(낮은 구간 → 높은 구간)가 색을 정한다.
const TONE_CASES: readonly {tone: ScoreRingTone; score: number; label: string; color: string}[] = [
    {tone: 'excellent', score: 100, label: '우수', color: 'blue.500'},
    {tone: 'good', score: 73.7, label: '양호', color: 'mint.700'},
    {tone: 'normal', score: 58.3, label: '보통', color: 'orange.500'},
    {tone: 'poor', score: 35.7, label: '미흡', color: 'error.500'},
    {tone: 'weak', score: 17.9, label: '취약', color: 'gray.700'},
]

const EDGE_CASES: readonly {title: string; description: string; score: number; label: string; tone: ScoreRingTone}[] = [
    {title: '0점', description: '채움이 없고 트랙만 보입니다.', score: 0, label: '취약', tone: 'weak'},
    {title: '100점', description: '한 바퀴를 다 채웁니다.', score: 100, label: '우수', tone: 'excellent'},
    {title: '범위 밖(120점)', description: '끝(100)으로 맞춰 그립니다.', score: 120, label: '우수', tone: 'excellent'},
]

const PROPS_ITEMS = [
    ['ScoreRing', 'score', '0~100 점수입니다. 채움 길이와 가운데 숫자가 이 값을 따릅니다.', '-', 'number'],
    ['ScoreRing', 'caption', '원 안 맨 위의 이름입니다.', '-', 'string'],
    ['ScoreRing', 'statusLabel', '점수 아래 등급 이름입니다.', '-', 'string'],
    ['ScoreRing', 'tone', '채움 색을 정하는 등급입니다.', 'good', "'excellent' | 'good' | 'normal' | 'poor' | 'weak'"],
    ['ScoreRing', 'isLoading', '불러오는 중이면 같은 크기의 원 스켈레톤을 대신 보입니다.', 'false', 'boolean'],
    [
        'ScoreRing',
        'loadingLabel',
        '불러오는 중에 화면 낭독기가 읽을 말입니다.',
        "'지수 점수를 불러오는 중입니다.'",
        'string',
    ],
    ['ScoreRing', 'ariaLabel', '그림 전체를 읽어 줄 말입니다.', '-', 'string'],
] as const

const ScoreRingGuidePage = () => (
    <GuidePageShell
        title="점수 원형 게이지 (ScoreRing)"
        description="0~100 점수를 한 바퀴 원으로 채우고 가운데에 이름·점수·등급을 둡니다. 인쇄용 리포트에서 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="sr-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="sr-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Tech-Index 일반분석 리포트의 지수정보입니다.
                    </p>
                </div>
                <ScoreRing
                    score={73.7}
                    caption="Tech-Index Score"
                    statusLabel="양호"
                    ariaLabel="Tech-Index 지수 73.7점 · 양호"
                />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sr-shape" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="sr-shape" className="typo-h4-bold">
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
            <section aria-labelledby="sr-tone" className="flex flex-col gap-4">
                <div>
                    <h2 id="sr-tone" className="typo-h4-bold">
                        등급 색 (Tone)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        다섯 등급이 각각 다른 색으로 찹니다. 색은 점수가 드는 구간이 정하므로, 점수만 바꾸면 등급 이름과
                        색이 함께 따라갑니다.
                    </p>
                </div>
                <ul className="flex flex-wrap gap-6">
                    {TONE_CASES.map((item) => (
                        <li key={item.tone}>
                            <ScoreRing
                                score={item.score}
                                caption="Tech-Index Score"
                                statusLabel={item.label}
                                tone={item.tone}
                                ariaLabel={`${item.label} 예시 ${item.score}점`}
                            />
                        </li>
                    ))}
                </ul>
                {/* 색 이름만으로는 어느 색인지 알 수 없어 칩으로 함께 보인다(가이드 화면이라 토큰 변수를
                    인라인으로 쓴다[PB-12]). */}
                <ul className="flex flex-col gap-2">
                    {TONE_CASES.map((item) => (
                        <li key={item.tone} className="typo-body-l-regular text-foreground flex items-center gap-2">
                            <span
                                aria-hidden="true"
                                className="rounded-2xs size-icon-sm shrink-0"
                                style={{background: ARC_GAUGE_TONE_COLORS[item.tone]}}
                            />
                            <span className="min-w-0">
                                {item.label} — <code className="font-mono">{item.tone}</code> · {item.color}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sr-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="sr-loading" className="typo-h4-bold">
                        불러오는 중 (Loading)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        isLoading 을 주면 같은 크기의 원 스켈레톤이 대신 섭니다. 채움은 값이 정해져야 그릴 수 있어
                        트랙만 두고, 가운데 글자 세 줄의 자리만 잡습니다.
                    </p>
                </div>
                <ScoreRing score={0} caption="Tech-Index Score" statusLabel="" isLoading ariaLabel="예시" />
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="ScoreRing 로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sr-edge" className="flex flex-col gap-4">
                <div>
                    <h2 id="sr-edge" className="typo-h4-bold">
                        특이 케이스 (Special cases)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">점수가 끝이거나 범위를 벗어날 때입니다.</p>
                </div>
                <ul className="flex flex-wrap gap-6">
                    {EDGE_CASES.map((item) => (
                        <li key={item.title} className="flex min-w-0 flex-col gap-2">
                            <h3 className="typo-body-xl-bold">{item.title}</h3>
                            <p className="typo-body-m-regular text-muted-foreground">{item.description}</p>
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sr-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="sr-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">점수 하나로 채움이 정해집니다.</p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="ScoreRing 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sr-props" className="flex flex-col gap-4">
                <h2 id="sr-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="ScoreRing 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ScoreRingGuidePage
