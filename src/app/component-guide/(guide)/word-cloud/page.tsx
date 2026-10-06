// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice} from '@/components/custom/license-notice'
import PropsTable from '@/components/custom/props-table'
import {WordCloud, type WordCloudItem} from '@/components/custom/word-cloud'
import {WordCloudCountDemo} from './word-cloud-demo'

export const metadata: Metadata = {title: '워드클라우드 (WordCloud)'}

const RANK_COLORS = [
    'var(--raw-blue-500)',
    'var(--raw-mint-700)',
    'var(--raw-orange-500)',
    'var(--raw-purple-500)',
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

// 높이는 className(h-*)으로 정합니다. 글자 크기는 이 높이에 맞춰 정해집니다.
// 단어는 중요도순으로 넘기고, colors 는 목록 순서대로 돌아가며 칠합니다.
<WordCloud
  ariaLabel="최근 연구개발 이슈 키워드"
  className="h-54"
  colors={['var(--raw-blue-500)', 'var(--raw-mint-700)', 'var(--raw-orange-500)']}
  words={[
    {text: '인공지능', weight: 40},
    {text: '이미지', weight: 30},
    // …
  ]}
/>`

const COLOR_CODE = `// colors 를 주지 않으면 차트 팔레트(--ds-chart-1~5)를 목록 순서대로 돌립니다.
<WordCloud ariaLabel="…" words={issueWords} />

// 순서 팔레트: 1번째 단어는 1번째 색, 6번째 단어는 다시 1번째 색입니다.
<WordCloud ariaLabel="…" words={issueWords} colors={RANK_COLORS} />

// 특정 단어만 바꿀 때는 그 단어에 color 를 줍니다(colors 보다 우선).
<WordCloud ariaLabel="…" words={[{text: '인공지능', weight: 40, color: 'var(--raw-blue-500)'}]} />`

const LOADING_CODE = `// 그리기 전에는 WordCloud 가 같은 높이의 스켈레톤을 스스로 보입니다.
// 데이터를 기다리는 화면(loading.tsx 등)에서는 같은 높이로 직접 둡니다.
<ChartSkeleton type="word-cloud" label="R&D 이슈를 불러오는 중입니다." className="h-54 sm:h-54" />`

const DATA_CODE = `import {
  WordCloud,
  type WordCloudItem,
} from '@/components/custom/word-cloud';

// 1. API에서 받은 키워드별 원시 빈도·중요도입니다.
const issueKeywordsFromApi = [
  { keyword: '인공지능', score: 248 },
  { keyword: '학습', score: 203 },
  { keyword: '기술', score: 174 },
  { keyword: '이미지', score: 159 },
];

// 2. 같은 키워드가 여러 번 오면 먼저 합산합니다.
const scoreByKeyword = new Map<string, number>();
issueKeywordsFromApi.forEach(({ keyword, score }) => {
  const text = keyword.trim();
  if (!text || score <= 0) return;
  scoreByKeyword.set(text, (scoreByKeyword.get(text) ?? 0) + score);
});

// 3. 가장 큰 score를 100으로 보고 weight를 1~100 범위로 정규화합니다.
const maximumScore = Math.max(
  ...scoreByKeyword.values(),
  1,
);

const issueWords: WordCloudItem[] = Array.from(scoreByKeyword)
  .map(([text, score]) => ({
    text,
    weight: Math.max(1, Math.round((score / maximumScore) * 100)),
  }))
  .sort((a, b) => b.weight - a.weight);

export default function ResearchIssueWordCloud() {
    return (
    <WordCloud
      words={issueWords}
      ariaLabel="최근 3개년 R&D 이슈를 중요도순으로 표시한 워드클라우드"
      className="w-full"
    />
  );
}`

const PROPS_ITEMS = [
    [
        'WordCloud',
        'words',
        '중복되지 않는 단어와 양수 가중치입니다. weight 가 클수록 글자가 크고, 중요도순으로 정렬해 전달합니다.',
        '-',
        'WordCloudItem[]',
    ],
    [
        'WordCloud',
        'ariaLabel',
        '캔버스의 대체 텍스트이자 로딩 안내 문구에 쓰입니다. 데이터 범위를 설명합니다.',
        '-',
        'string',
    ],
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
        '높이(h-*)와 바깥 여백을 정합니다. 캔버스와 로딩 스켈레톤이 이 높이를 그대로 채웁니다. 높이를 주지 않으면 h-96 입니다.',
        "'h-96'",
        "Omit<ComponentPropsWithoutRef<'div'>, 'children'>",
    ],
    ['WordCloudItem', 'text', '표시할 단어입니다.', '-', 'string'],
    ['WordCloudItem', 'weight', '중요도입니다. 글자 크기를 정합니다.', '-', 'number'],
    [
        'WordCloudItem',
        'color',
        '이 단어만 다른 색으로 칠할 때 줍니다(colors 보다 우선). CSS 색 값이나 토큰 변수(var(--raw-*))를 씁니다.',
        '-',
        'string',
    ],
] as const

const WordCloudGuidePage = () => (
    <GuidePageShell
        title="워드클라우드 (WordCloud)"
        description="키워드의 중요도를 글자 크기로 보여 주는 차트입니다. 영역 높이에 맞춰 글자 크기를 정하고 단어를 가로로 배치합니다."
    >
        <BaseCard>
            <section aria-labelledby="wc-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="wc-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>words</code> 의 <code>weight</code> 가 클수록 글자가 큽니다. 폭은 부모를 채우고 높이는{' '}
                        <code>className</code> 의 <code>h-*</code> 로 정합니다. 단어에 마우스를 올리면 중요도 툴팁이
                        나타납니다.
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
            <section aria-labelledby="wc-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="wc-variants" className="typo-h4-bold">
                        변형 · 상태 예시
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        색, 높이, 단어 수, 로딩 상태 예시입니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">색</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            단어는 목록 순서(중요도순)대로 <code>colors</code> 의 색을 돌아가며 씁니다. 주지 않으면 차트
                            팔레트를 씁니다.
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

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">높이</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            글자 크기는 높이에 비례합니다. 가장 무거운 단어가 높이의 38%, 가장 가벼운 단어가 10%(최소
                            12px)이고, 들어가지 않는 단어는 줄여 넣거나 건너뜁니다. 창 폭이 바뀌면 배치를 다시 계산하며
                            위치는 그릴 때마다 조금씩 달라질 수 있습니다. 높이를 주지 않으면 기본 h-96 입니다.
                        </p>
                        <WordCloud words={REPORT_WORDS} colors={RANK_COLORS} ariaLabel="기본 높이 워드클라우드" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">단어 수</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            단어 수가 달라도 같은 영역 안에서 배치를 다시 계산합니다.
                        </p>
                        <div className="bg-surface border-border overflow-hidden rounded-xl border p-4">
                            <WordCloudCountDemo />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">로딩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            단어를 그리기 전에는 컴포넌트가 <code>ChartSkeleton type=&quot;word-cloud&quot;</code> 를
                            컨테이너 높이만큼 스스로 보여, 그림으로 바뀔 때 자리가 흔들리지 않습니다.
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
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="wc-data" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="wc-data" className="typo-h4-bold">
                        데이터 연결
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        API 의 원본 점수를 가장 큰 값 100 기준의 1~100 <code>weight</code> 로 정규화해 넘깁니다. 같은
                        단어(<code>text</code>)가 둘 이상이면 색이 하나로 합쳐지고 접근성 목록도 중복되므로 먼저
                        합산합니다.
                    </p>
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
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="wc-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        캔버스 그림은 스크린리더가 읽지 못하므로 같은 내용을 텍스트로 함께 제공합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        캔버스에 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 이 붙습니다. 데이터 범위가
                        드러나게 작성합니다[5.1.1].
                    </li>
                    <li>
                        단어 목록(&quot;단어: 중요도 n&quot;)이 숨김 <code>ol</code> 로 함께 제공되어 그림의 대체 수단이
                        됩니다[5.1.1].
                    </li>
                    <li>단어 색은 의미를 전하지 않고 크기와 목록 순서가 중요도를 전합니다[5.3.1].</li>
                    <li>
                        마우스 호버 툴팁은 보조 정보이며 같은 정보를 숨김 목록에서 읽을 수 있습니다. 로딩 중에는
                        스켈레톤이 로딩 상태를 알립니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="wc-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="wc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>words</code> 와 <code>ariaLabel</code> 이 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="WordCloud Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default WordCloudGuidePage
