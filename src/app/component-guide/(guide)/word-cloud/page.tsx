// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice} from '@/components/custom/license-notice'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'
import {WordCloud, type WordCloudItem} from '@/components/custom/word-cloud'
import {WordCloudCountDemo} from './word-cloud-demo'

export const metadata: Metadata = {title: '워드클라우드 (WordCloud)'}

// K-BIGx 기업혁신성장 보고서 "R&D 이슈" 카드와 같은 단어(중요도순)와 순서 팔레트(범례 1st~5th)다.
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

// 높이는 className(h-*)으로 정한다 — 캔버스가 그 영역을 채우고 글자 크기가 높이에 맞춰 커진다.
// 단어는 중요도순으로 넘기고, colors 순서대로 1번째 단어 → 1번째 색 … 6번째 단어 → 다시 1번째 색으로 칠한다.
<WordCloud
  ariaLabel="최근 연구개발 이슈 키워드"
  className="h-54"
  colors={['var(--raw-blue-500)', 'var(--raw-mint-700)', 'var(--raw-orange-500)', 'var(--raw-purple-500)', 'var(--raw-blue-800)']}
  words={[
    {text: '인공지능', weight: 40},
    {text: '이미지', weight: 30},
    {text: '기술', weight: 28},
    // …
  ]}
/>`

const COLOR_CODE = `// colors 를 주지 않으면 차트 팔레트(--ds-chart-1~5)를 목록 순서대로 돌린다.
<WordCloud ariaLabel="…" words={issueWords} />

// 순서 팔레트 — 목록 순서대로 이 색들에 돌아가며 칠한다(범례 1st~5th).
<WordCloud ariaLabel="…" words={issueWords} colors={RANK_COLORS} />

// 특정 단어만 다른 색으로 칠할 때는 그 단어에 color 를 준다(순서 팔레트보다 우선).
<WordCloud ariaLabel="…" words={[{text: '인공지능', weight: 40, color: 'var(--raw-blue-500)'}, …]} />`

const WORD_CLOUD_CODE = `import {
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
  // 4. 정규화한 배열을 전달하면 글자 크기와 배치는 자동 계산됩니다.
  return (
    <WordCloud
      words={issueWords}
      ariaLabel="최근 3개년 R&D 이슈를 중요도순으로 표시한 워드클라우드"
      className="w-full"
    />
  );
}`

const SIZE_RULES = [
    '높이는 사용처가 className(h-*)으로 정합니다. 주지 않으면 384(h-96)입니다. 폭은 부모를 채웁니다.',
    '글자 크기는 높이에 비례합니다 — 가장 무거운 단어가 높이의 38%, 가장 가벼운 단어가 10%(최소 12)이고 사이는 중요도에 따라 나눕니다.',
    '단어는 영역의 가로세로 비율대로 퍼지고, 들어가지 않는 단어는 자동으로 줄여 넣습니다.',
    '창 폭이 바뀌면 배치를 다시 계산합니다. 같은 데이터라도 배치 위치는 그릴 때마다 조금씩 달라질 수 있습니다.',
] as const

const PROPS_ITEMS = [
    [
        'WordCloud',
        'words',
        '중복되지 않는 단어와 양수 가중치입니다. weight 가 클수록 글자가 크고, 중요도순으로 정렬해 전달합니다.',
        '-',
        'WordCloudItem[]',
    ],
    ['WordCloud', 'ariaLabel', '워드클라우드가 나타내는 데이터 범위를 설명합니다.', '-', 'string'],
    [
        'WordCloud',
        'colors',
        '순서 팔레트입니다. 단어를 목록 순서대로 이 색들에 돌아가며 칠합니다.',
        '차트 팔레트(--ds-chart-1~5)',
        'readonly string[]',
    ],
    [
        'WordCloud',
        'className',
        '높이(h-*)와 바깥 여백을 정합니다. 캔버스와 로딩 스켈레톤이 이 높이를 그대로 채웁니다.',
        "'h-96'",
        'string',
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
        description="키워드의 중요도를 글자 크기로 보여 주는 차트입니다. 영역 높이에 맞춰 글자 크기를 정하고, 단어가 겹치지 않게 가로로 배치합니다."
    >
        <BaseCard>
            <section aria-labelledby="wc-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="wc-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        K-BIGx 기업혁신성장 보고서의 R&amp;D 이슈 카드와 같은 구성입니다(높이 216 · 단어별 색 다섯
                        가지). 단어에 마우스를 올리면 중요도를 툴팁으로 보여 주고, 단어 목록은 화면 낭독기용 숨김
                        목록으로도 제공됩니다.
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
            <section aria-labelledby="wc-color" className="flex flex-col gap-4">
                <div>
                    <h2 id="wc-color" className="typo-h4-bold">
                        색 (Color)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        단어는 목록 순서(중요도순)대로 <code className="font-mono">colors</code>의 색에 돌아가며
                        칠해집니다 — 1번째 단어는 1번째 색, 6번째 단어는 다시 1번째 색입니다. 주지 않으면 차트
                        팔레트(--ds-chart-1~5)를 씁니다. 특정 단어만 바꿀 때는 그 단어에{' '}
                        <code className="font-mono">color</code>를 줍니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">순서 팔레트(colors)</h3>
                        <WordCloud
                            words={REPORT_WORDS}
                            colors={RANK_COLORS}
                            ariaLabel="순서 팔레트를 준 워드클라우드"
                            className="h-54"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">차트 팔레트(기본)</h3>
                        <WordCloud words={REPORT_WORDS} ariaLabel="차트 팔레트를 쓴 워드클라우드" className="h-54" />
                    </div>
                </div>
                <CodeBlock code={COLOR_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="wc-size" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="wc-size" className="typo-h4-bold">
                        크기 (Size)
                    </h2>
                    <ul className="typo-body-l-regular text-muted-foreground flex flex-col gap-1">
                        {SIZE_RULES.map((rule) => (
                            <li key={rule} className="flex">
                                <ListMarker type="unordered" />
                                <span className="min-w-0">{rule}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="typo-body-xl-bold">기본 높이(384)</h3>
                    <WordCloud words={REPORT_WORDS} colors={RANK_COLORS} ariaLabel="기본 높이 워드클라우드" />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="wc-count" className="flex flex-col gap-4">
                <div>
                    <h2 id="wc-count" className="typo-h4-bold">
                        단어 수 (Count)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        단어 수가 달라도 같은 영역 안에서 배치를 다시 계산합니다. 버튼으로 키워드 수를 바꿔 봅니다.
                    </p>
                </div>
                <div className="bg-surface border-border overflow-hidden rounded-xl border p-4">
                    <WordCloudCountDemo />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="wc-loading" className="flex flex-col gap-4">
                <div>
                    <h2 id="wc-loading" className="typo-h4-bold">
                        로딩 (Skeleton)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        단어를 그리기 전(새로고침 직후 · 창 폭 변경 직후)에는 컴포넌트가 같은 높이의 스켈레톤을 스스로
                        보입니다. 스켈레톤은{' '}
                        <code className="font-mono">ChartSkeleton type=&quot;word-cloud&quot;</code>
                        이고 항상 컨테이너 높이만큼만 덮어, 그림으로 바뀔 때 자리가 흔들리지 않습니다. 데이터를 기다리는
                        화면(라우트의 loading.tsx 등)에서는 같은 스켈레톤을 같은 높이로 둡니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러오는 중</h3>
                        <ChartSkeleton
                            type="word-cloud"
                            label="R&D 이슈를 불러오는 중입니다."
                            className="h-54 sm:h-54"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="typo-body-xl-bold">불러온 뒤</h3>
                        <WordCloud
                            words={REPORT_WORDS}
                            colors={RANK_COLORS}
                            ariaLabel="최근 연구개발 이슈 키워드"
                            className="h-54"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="wc-data" className="flex flex-col gap-4">
                <div>
                    <h2 id="wc-data" className="typo-h4-bold">
                        데이터 연결 (Data)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        API 의 원본 점수(score)를 가장 큰 값을 100 으로 두고 1~100 의 weight 로 정규화해 넘깁니다.
                        점수의 단위나 범위가 달라도 상대적 중요도가 유지됩니다.
                    </p>
                </div>
                <CodeBlock code={WORD_CLOUD_CODE} language="tsx" copyLabel="WordCloud 데이터 연결 코드 복사" />
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
            <section aria-labelledby="wc-props" className="flex flex-col gap-4">
                <h2 id="wc-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="WordCloud 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default WordCloudGuidePage
