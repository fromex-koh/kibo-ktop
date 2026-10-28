// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {EmptyState} from '@/components/composite/empty-state'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice} from '@/components/custom/license-notice'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {WordCloud, type WordCloudItem} from '@/components/custom/word-cloud'
import {WordCloudCountDemo, WordCloudEdgeCaseDemo} from './word-cloud-demo'

export const metadata: Metadata = {title: '워드클라우드 (WordCloud)'}

const RANK_COLORS = [
    'var(--ds-report-series-2)',
    'var(--ds-report-series-4)',
    'var(--ds-report-series-5)',
    'var(--ds-report-series-3)',
    'var(--raw-blue-800)',
] as const

const REPORT_WORDS: WordCloudItem[] = [
    {text: '인공지능', weight: 40},
    {text: '이미지', weight: 30},
    {text: '기술', weight: 28},
    {text: '학습', weight: 28},
    {text: '신경망', weight: 22},
    {text: '모델', weight: 22},
    {text: '이공', weight: 20},
    {text: '인식', weight: 18},
    {text: '지능', weight: 18},
    {text: '예측', weight: 14},
    {text: '분류', weight: 12},
    {text: '분석', weight: 12},
    {text: '기반', weight: 12},
    {text: '서비스', weight: 10},
    {text: '활용', weight: 10},
    {text: '영상', weight: 9},
    {text: '성능', weight: 8},
    {text: '네트워크', weight: 8},
]

const USAGE_CODE = `import {WordCloud} from '@/components/custom/word-cloud'

// 높이만 정하면(className h-*) 글자 크기 · 배치는 컴포넌트가 정합니다.
<WordCloud
  ariaLabel="최근 3개년 R&D 이슈 키워드"
  className="h-54 w-full"
  colors={['var(--ds-report-series-2)', 'var(--ds-report-series-4)', 'var(--ds-report-series-5)']}
  words={[
    {text: '인공지능', weight: 40},
    {text: '이미지', weight: 30},
    // … 중요도순으로 전부
  ]}
/>`

const COLOR_CODE = `// colors 없음 → 차트 팔레트(--ds-chart-1~5)를 목록 순서대로 돌린다.
<WordCloud ariaLabel="…" words={issueWords} />

// 순서 팔레트 — 1번째 단어 = 1번째 색, 6번째 단어 = 다시 1번째 색.
<WordCloud ariaLabel="…" words={issueWords} colors={RANK_COLORS} />

// 한 단어만 다른 색 — 그 단어에 color(colors 보다 우선).
<WordCloud ariaLabel="…" words={[{text: '인공지능', weight: 40, color: 'var(--ds-report-series-2)'}]} />`

const LOADING_CODE = `// 그리는 동안은 WordCloud 가 같은 높이의 스켈레톤을 스스로 보인다.
// 데이터를 기다리는 화면(loading.tsx 등)에서는 같은 높이로 직접 둔다.
<ChartSkeleton type="word-cloud" label="R&D 이슈를 불러오는 중입니다." className="h-54 sm:h-54" />`

const DATA_CODE = `import {WordCloud, type WordCloudItem} from '@/components/custom/word-cloud'

// API 원본 점수 → weight(1~100, 가장 큰 값 = 100). 같은 키워드는 먼저 합친다(색 · 숨김 목록 중복 방지).
const toIssueWords = (keywords: readonly {keyword: string; score: number}[]): WordCloudItem[] => {
  const scoreByKeyword = keywords.reduce((scores, {keyword, score}) => {
    const text = keyword.trim()
    if (!text || score <= 0) return scores
    return scores.set(text, (scores.get(text) ?? 0) + score)
  }, new Map<string, number>())
  const maxScore = Math.max(...scoreByKeyword.values(), 1)
  return [...scoreByKeyword]
    .map(([text, score]) => ({text, weight: Math.max(1, Math.round((score / maxScore) * 100))}))
    .sort((a, b) => b.weight - a.weight) // 중요도순 — 색 순서 · 숨김 목록 순서가 된다
}

// 키워드는 자르지 말고 전부 넘긴다 — 컴포넌트가 모두 그린다.
<WordCloud words={toIssueWords(apiKeywords)} ariaLabel="최근 3개년 R&D 이슈 키워드" className="h-54 w-full" />`

// 크기 · 배치 규칙 — 줄글 대신 표로 한눈에.
const RULE_COLUMNS = [
    {key: 'item', header: '항목', align: 'start', rowHeader: true},
    {key: 'rule', header: '규칙', align: 'start', wrap: true},
] as const

const RULE_ROWS = [
    {
        key: 'height',
        cells: ['영역', '폭은 부모를 채우고 높이는 사용처 className(h-*)으로 정합니다. 높이를 주지 않으면 h-96.'],
    },
    {
        key: 'all',
        cells: ['모든 단어 노출', '받은 단어를 하나도 빼지 않습니다. 들어가지 않으면 전체 글자를 줄여 다시 그립니다.'],
    },
    {
        key: 'fill',
        cells: [
            '영역 채움',
            '단어 수와 상관없이 글자 묶음이 영역의 약 94% 에 닿을 때까지 키웁니다(세로가 먼저 차면 옆으로 퍼뜨림).',
        ],
    },
    {
        key: 'ratio',
        cells: ['크기 차이', '중요도 비율만큼(최대 4.5배). 가로가 남으면 1.15배까지 좁혀 작은 단어를 키웁니다.'],
    },
    {key: 'size', cells: ['글자 크기 범위', '가장 큰 글자 = 영역 높이까지, 가장 작은 글자 = 12px.']},
    {
        key: 'long',
        cells: [
            '긴 단어',
            '한 단어가 영역 폭의 92% 를 넘지 않게 그 단어만 줄이고, 12px 로도 넘치면 말줄임(…). 전체 단어는 툴팁 · 숨김 목록에서 봅니다.',
        ],
    },
    {
        key: 'two',
        cells: [
            '단어 둘',
            '두 단어 묶음을 가운데에 맞춥니다. 글자 모양을 지키므로 짧은 단어 한두 개는 좌우가 조금 남습니다.',
        ],
    },
    {
        key: 'redraw',
        cells: [
            '다시 그리기',
            '창 폭이 바뀌면 다시 맞춥니다. 위치는 그릴 때마다 조금씩 달라질 수 있고, 맞추는 동안은 스켈레톤이 덮습니다.',
        ],
    },
    {
        key: 'qa',
        cells: ['QA 확인', '캔버스의 data-drawn-words 가 그려진 단어 수입니다(예: 18/18). 받은 수와 같아야 합니다.'],
    },
] as const

const EMPTY_CODE = `import {EmptyState} from '@/components/composite/empty-state'

// 키워드가 없으면 WordCloud 를 그리지 않고 같은 높이의 빈 상태를 둡니다(빈 목록을 넘기면 스켈레톤이 계속 남습니다).
{issues.length ? (
  <WordCloud words={issues} ariaLabel="최근 3년 등록특허의 R&D 이슈 키워드" className="h-54 w-full" />
) : (
  <EmptyState className="min-h-54" />
)}`

const PROPS_ITEMS = [
    [
        'WordCloud',
        'words',
        '단어와 중요도(양수)입니다. 중요도순으로 정렬해 전부 넘깁니다. 같은 text 는 미리 합칩니다. 빈 목록은 넘기지 않습니다(3-5).',
        '-',
        'WordCloudItem[]',
    ],
    ['WordCloud', 'ariaLabel', '캔버스의 대체 텍스트 · 로딩 안내 문구입니다. 데이터 범위를 적습니다.', '-', 'string'],
    [
        'WordCloud',
        'colors',
        '순서 팔레트입니다. 단어를 목록 순서대로 이 색들에 돌아가며 칠합니다.',
        '차트 팔레트(--ds-chart-1~5)',
        'readonly string[]',
    ],
    [
        'WordCloud',
        'className · div props',
        '높이(h-*)와 바깥 여백입니다. 캔버스 · 스켈레톤이 이 높이를 채웁니다.',
        "'h-96'",
        "Omit<ComponentPropsWithoutRef<'div'>, 'children'>",
    ],
    ['WordCloudItem', 'text', '표시할 단어입니다.', '-', 'string'],
    ['WordCloudItem', 'weight', '중요도입니다. 글자 크기를 정합니다.', '-', 'number'],
    [
        'WordCloudItem',
        'color',
        '이 단어만 다른 색(colors 보다 우선). 토큰 변수입니다. K-BIGx 보고서는 var(--ds-report-series-N), 그 밖은 var(--ds-<색>-<단계>)를 쓰며 다크에서 밝은 단계로 바뀝니다.',
        '-',
        'string',
    ],
] as const

const SECTION_HEAD = 'flex flex-col gap-2'
const SUB_BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const DEMO_FRAME = 'bg-surface border-border overflow-hidden rounded-xl border p-4'

const WordCloudGuidePage = () => (
    <GuidePageShell
        title="워드클라우드 (WordCloud)"
        description="키워드의 중요도를 글자 크기로 보여 주는 차트입니다. 높이만 정하면 받은 키워드를 모두 그리면서 영역을 꽉 채웁니다."
    >
        <BaseCard>
            <section aria-labelledby="wc-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="wc-usage" className="typo-h4-bold">
                        1. 기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>words</code>(중요도순) · <code>ariaLabel</code> · 높이(<code>h-*</code>)만 주면 됩니다.
                        단어에 마우스를 올리면 중요도 툴팁이 나타납니다.
                    </p>
                </div>
                <div className="border-subtle-3 bg-card max-w-147 rounded-sm border p-6">
                    <WordCloud
                        words={REPORT_WORDS}
                        colors={RANK_COLORS}
                        ariaLabel="최근 연구개발 이슈 키워드"
                        className="h-54"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="wc-rules" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="wc-rules" className="typo-h4-bold">
                        2. 크기 · 배치 규칙
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        글자 크기와 배치는 컴포넌트가 정합니다. 사용처가 조정할 것은 높이뿐입니다.
                    </p>
                </div>
                <Table caption="워드클라우드 크기 · 배치 규칙" columns={RULE_COLUMNS} rows={RULE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="wc-examples" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="wc-examples" className="typo-h4-bold">
                        3. 예시
                    </h2>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">3-1. 색</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            목록 순서대로 <code>colors</code> 를 돌아가며 칠합니다. 주지 않으면 차트 팔레트입니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-m-bold text-foreground">순서 팔레트(colors)</p>
                                <WordCloud
                                    words={REPORT_WORDS}
                                    colors={RANK_COLORS}
                                    ariaLabel="순서 팔레트를 준 워드클라우드"
                                    className="h-54"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-m-bold text-foreground">차트 팔레트(기본)</p>
                                <WordCloud
                                    words={REPORT_WORDS}
                                    ariaLabel="차트 팔레트를 쓴 워드클라우드"
                                    className="h-54"
                                />
                            </div>
                        </div>
                        <CodeBlock code={COLOR_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">3-2. 단어 수</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            같은 틀(높이 216)에 단어 수만 다르게 했습니다. 적으면 크게, 많으면 작게 그려 늘 틀을
                            채웁니다.
                        </p>
                        <div className={DEMO_FRAME}>
                            <WordCloudCountDemo />
                        </div>
                    </div>

                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">3-3. 엣지 케이스</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            긴 키워드 · 좁은 폭 · 아주 많은 키워드 · 키워드 1~3개. 어떤 경우도 키워드를 빼지 않습니다.
                        </p>
                        <div className={DEMO_FRAME}>
                            <WordCloudEdgeCaseDemo />
                        </div>
                    </div>

                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">3-4. 로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            그리는 동안은 컨테이너 높이만큼 <code>ChartSkeleton type=&quot;word-cloud&quot;</code> 를
                            스스로 보여 자리가 흔들리지 않습니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-m-bold text-foreground">불러오는 중</p>
                                <ChartSkeleton
                                    type="word-cloud"
                                    label="R&D 이슈를 불러오는 중입니다."
                                    className="h-54 sm:h-54"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-m-bold text-foreground">불러온 뒤</p>
                                <WordCloud
                                    words={REPORT_WORDS}
                                    colors={RANK_COLORS}
                                    ariaLabel="최근 연구개발 이슈 키워드"
                                    className="h-54"
                                />
                            </div>
                        </div>
                        <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">3-5. 키워드가 없을 때</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            빈 목록을 넘기면 그릴 단어가 없어 스켈레톤이 계속 남습니다. 사용처에서 키워드가 없으면{' '}
                            <code>WordCloud</code> 대신 같은 높이의 <code>EmptyState</code> 를 둡니다 — 웹 보고서
                            진단브리핑 · 기술혁신정보 탭과 PDF 템플릿이 모두 이렇게 합니다.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <p className="typo-body-m-bold text-foreground">키워드 없음</p>
                                <EmptyState className="border-subtle-3 min-h-54 rounded-sm border" />
                            </div>
                        </div>
                        <CodeBlock code={EMPTY_CODE} language="tsx" copyLabel="빈 상태 코드 복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="wc-data" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="wc-data" className="typo-h4-bold">
                        4. 데이터 연결
                    </h2>
                    <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-1 pl-5">
                        <li>
                            API 점수를 <code>weight</code>(1~100, 가장 큰 값 = 100)로 바꾸고 중요도순으로 정렬합니다.
                        </li>
                        <li>같은 키워드는 먼저 합쳐 색 · 숨김 목록이 중복되지 않게 합니다.</li>
                        <li>키워드는 자르지 말고 전부 넘깁니다. 컴포넌트가 모두 그립니다.</li>
                        <li>키워드가 0개면 WordCloud 를 그리지 않고 빈 상태를 둡니다(3-5).</li>
                    </ul>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="복사" />
                <LicenseNotice
                    libraries={[
                        {
                            name: 'WordCloud2.js',
                            href: 'https://github.com/timdream/wordcloud2.js/blob/gh-pages/LICENSE',
                        },
                    ]}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="wc-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="wc-a11y" className="typo-h4-bold">
                        5. 접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        캔버스는 <code>role=&quot;img&quot;</code> + <code>ariaLabel</code>, 숨김 목록(&quot;단어:
                        중요도 n&quot;)이 모든 단어를 읽습니다. 말줄임한 단어도 전체 이름으로 읽습니다[5.1.1].
                    </li>
                    <li>색은 뜻을 전하지 않고, 크기와 목록 순서가 중요도를 전합니다[5.3.1].</li>
                    <li>툴팁은 보조 정보입니다. 같은 내용을 숨김 목록에서 읽습니다.</li>
                    <li>
                        보고서(<code>ChartRevealProvider</code>)에서는 차트가 화면에 절반 이상 보일 때 아래에서
                        떠오르고(0.6초), 동작 줄이기 설정이면 움직이지 않습니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="wc-props" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="wc-props" className="typo-h4-bold">
                        6. Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>words</code> · <code>ariaLabel</code> 이 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="WordCloud Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default WordCloudGuidePage
