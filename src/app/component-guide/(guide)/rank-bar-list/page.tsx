// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {RankBarListSkeleton} from '@/components/composite/rank-bar-list-skeleton'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {RankBarList, rankBarScaleMax, type RankBarItem} from '@/components/custom/rank-bar-list'

export const metadata: Metadata = {title: '순위 막대 목록 (RankBarList)'}

const LINK_CLASS = 'text-primary underline underline-offset-4'

// 이름 · 값(· tone · 강조) → 목록 데이터.
type Row = readonly [string, number, RankBarItem['tone']?, boolean?]
const toItems = (rows: readonly Row[]): RankBarItem[] =>
    rows.map(([name, value, tone, isHighlighted], index) => ({
        id: `${name}-${index}`,
        name,
        value,
        tone,
        isHighlighted,
    }))

// 템플릿 데이터(매출 100억원 이하 · 초과).
const SMALL = toItems([
    ['(주)이음', 23.5, 'default', true],
    ['(주)새론', 21.5, 'default', true],
    ['(주)아라', 17.2],
    ['(주)누리', 16.8],
    ['(주)가나다', 15.2],
    ['(주)파랑', 14.2],
    ['(주)다솜', 9.8],
    ['(주)푸름', 7.9],
    ['(주)온누리', 7.5],
    ['(주)해오름', 6.8],
    ['평균', 4.5, 'average'],
    ['프롬엑스테크', 8.2, 'subject'],
])
const LARGE = toItems([
    ['(주)비상', 18.8],
    ['(주)하늘', 17.6],
    ['(주)드림', 15.1],
    ['(주)온새미로', 12.8],
    ['(주)가나다', 10.9],
    ['(주)솔빛', 9.5],
    ['(주)바른', 8.2],
    ['(주)초롱', 6.1],
    ['(주)미래', 5.4],
    ['(주)별빛', 4.8],
    ['평균', 2.5, 'average'],
])
const SHARED_MAX = rankBarScaleMax(SMALL, LARGE)
const SMALL_COLORS = {bar: 'var(--ds-navy-500)'}
const LARGE_COLORS = {bar: 'var(--ds-blue-500)'}
// 인쇄본 색 — kbigx-print-innovation.tsx 의 rankColors 와 같다(.kbigx-print 안에서만 kbx 값이 있다).
const printColors = (bar: string) => ({
    bar,
    averageBar: 'var(--kbx-color-chart-average-base)',
    averageLine: 'var(--kbx-color-chart-average-line)',
    subjectBar: 'var(--kbx-color-green)',
})

// 3. 엣지 케이스.
const EDGE_CASES = [
    {
        key: 'negative',
        title: '0 · 음수 값',
        description: '0 이하 값은 막대 없이 값만 적습니다(역성장 기업).',
        items: toItems([
            ['(주)이음', 12.4],
            ['(주)새론', 0],
            ['(주)아라', -3.5],
            ['평균', 2.1, 'average'],
        ]),
    },
    {
        key: 'long',
        title: '이름이 길 때',
        description: '이름 칸 안에서 줄을 바꾸고 그만큼 행이 높아집니다. 강조 별은 이름 뒤에 붙습니다.',
        items: toItems([
            ['(주)글로벌테크놀로지솔루션즈코리아', 19.2, 'default', true],
            ['스마트 모빌리티 시스템즈', 12.1],
            ['평균', 6.3, 'average'],
        ]),
    },
    {
        key: 'few',
        title: '항목이 적을 때',
        description: '받은 줄만 그립니다. 조회기업이 없으면 그 줄도 없습니다.',
        items: toItems([
            ['(주)이음', 8.4],
            ['평균', 4.5, 'average'],
        ]),
    },
    {
        key: 'large',
        title: '값이 클 때',
        description: '막대 끝 값은 가장 큰 값을 1 · 2 · 2.5 · 5 · 10 × 자릿수로 올립니다(318.5 → 500).',
        items: toItems([
            ['(주)이음', 318.5, 'default', true],
            ['(주)새론', 152.2],
            ['평균', 48.1, 'average'],
            ['프롬엑스테크', 96.4, 'subject'],
        ]),
    },
] as const

const USAGE_CODE = `import {RankBarList, rankBarScaleMax} from '@/components/custom/rank-bar-list'

// 나란히 놓는 두 목록은 막대 끝 값을 같게 — 길이를 견줄 수 있다(23.5 → 25).
const max = rankBarScaleMax(small, large)

<div className="grid grid-cols-2 items-start gap-12">
  <RankBarList title="매출 100억원 이하" items={small} max={max} highlightLabel="고성장" />
  <RankBarList title="매출 100억원 초과" items={large} max={max} highlightLabel="고성장" colors={{bar: 'var(--ds-blue-500)'}} />
</div>`

const LOADING_CODE = `import {RankBarListSkeleton} from '@/components/composite/rank-bar-list-skeleton'

// 줄 수 · 클래스를 실제 목록과 같게 넘기면 자리가 흔들리지 않습니다.
{isLoading ? (
  <RankBarListSkeleton rowCount={12} label="성장률 우수기업을 불러오는 중입니다." />
) : (
  <RankBarList {...listProps} />
)}`

const PRINT_CODE = `// K-BIGx 인쇄본 — 20px · 줄 여백 8 · 이름 칸 170 · 막대 16 · 값 칸 72(kbigx-print-innovation.tsx).
<RankBarList
  title="매출 100억원 이하"
  items={small}
  max={rankBarScaleMax(small, large)}
  colors={{
    bar: 'var(--kbx-color-navy)',
    averageBar: 'var(--kbx-color-chart-average-base)',
    averageLine: 'var(--kbx-color-chart-average-line)', // 평균 = 옅은 바탕 + 사선 · 테두리
    subjectBar: 'var(--kbx-color-green)',
  }}
  listClassName="kbx-text-20 text-kbx-foreground border-kbx-primary kbx-border-t-strong"
  titleClassName="bg-kbx-surface text-kbx-primary kbx-text-21 font-kbx-extrabold px-3.5 py-2.5"
  rowClassName="border-kbx-border-subtle kbx-border-b-hairline py-2"
  averageRowClassName="border-t-kbx-foreground kbx-border-t-regular text-kbx-foreground-subtle font-kbx-bold"
  subjectRowClassName="bg-kbx-surface text-kbx-primary font-kbx-extrabold"
  nameClassName="w-42.5 pl-3.5"
  valueClassName="w-18"
  highlightValueClassName="font-kbx-bold"
  highlightIconClassName="size-kbx-22 text-kbx-star fill-current"
  highlightLabel="고성장"
/>`

const PROPS_ITEMS = [
    ['RankBarList', 'title', '제목 줄 글자입니다.', '-', 'string'],
    ['RankBarList', 'titleAs', '제목 태그입니다 — 문서의 제목 단계에 맞춥니다.', "'h5'", "'h3' | 'h4' | 'h5' | 'h6'"],
    [
        'RankBarList',
        'items',
        '항목 목록입니다. 순위 순 → 평균 · 조회기업 순으로 넘깁니다.',
        '-',
        'readonly RankBarItem[]',
    ],
    ['RankBarList', 'max', '막대 끝 값입니다. 나란히 놓는 목록과 같게 넘깁니다.', 'rankBarScaleMax(items)', 'number'],
    [
        'RankBarList',
        'colors',
        '막대 색(기본 · 평균 · 조회기업)과 막대 바탕(track — 주면 막대 칸 전체에 옅은 면, Tech-Index 기업 유형별 4대 혁신역량 비교)입니다.',
        '웹 단계 색 · 바탕 없음',
        'Partial<RankBarColors>',
    ],
    [
        'RankBarColors',
        'averageLine',
        '평균 막대 사선 · 테두리 색입니다. 주면 평균 막대가 averageBar 바탕 + 45° 사선이 됩니다.',
        '없음(단색)',
        'string',
    ],
    ['RankBarList', 'formatValue', '값 글자 형식입니다.', "'23.5%'", '(value: number) => string'],
    ['RankBarList', 'highlightLabel', '강조 별의 이름(화면 낭독기용)입니다.', "'강조'", 'string'],
    ['RankBarList', 'emptyText', '항목이 없을 때 문구입니다.', "'표시할 데이터가 없습니다.'", 'string'],
    [
        'RankBarList',
        'listClassName · titleClassName · rowClassName · averageRowClassName · subjectRowClassName',
        '위 선 · 글자, 제목 줄, 값 줄, 평균 줄 · 조회기업 줄입니다. 주면 기본값을 대신합니다(섞지 않음).',
        '웹 시맨틱 클래스',
        'string',
    ],
    [
        'RankBarList',
        'nameClassName · barClassName · valueClassName · highlightValueClassName · highlightIconClassName',
        '이름 칸 폭 · 여백, 막대 높이, 값 칸 폭, 강조 값 굵기, 강조 별 크기 · 색입니다.',
        "'w-40 pl-3.5' · 'h-4' · 'w-18' · …",
        'string',
    ],
    [
        'RankBarList',
        'renderName',
        '이름 글자 그리기입니다. 인쇄본 성장률 우수기업은 이름을 한 줄로 두고 칸보다 길면 말줄임(…)합니다. 없으면 띄어쓰기 없는 긴 이름도 이름 칸 안에서 줄을 바꿉니다.',
        '이름 그대로',
        '(name: string) => ReactNode',
    ],
    ['RankBarItem', 'id · name · value', '항목 식별자 · 이름 · 값입니다.', '-', 'string · number'],
    ['RankBarItem', 'tone', "'average' 평균 줄 · 'subject' 조회기업 줄입니다.", "'default'", 'RankBarTone'],
    ['RankBarItem', 'isHighlighted', '강조 항목(이름 뒤 별 · 값 굵게)입니다 — 예: 고성장 기업.', 'false', 'boolean'],
    [
        'rankBarScaleMax',
        '...lists',
        '여러 목록의 가장 큰 값을 1 · 2 · 2.5 · 5 · 10 × 자릿수로 올린 막대 끝 값입니다.',
        '-',
        'number',
    ],
    ['RankBarListSkeleton', 'rowCount', '값 줄 수입니다.', '12', 'number'],
    [
        'RankBarListSkeleton',
        'averageRowIndex',
        '평균 줄 자리(0 부터)입니다 — 위 선만큼 높아 높이를 맞춥니다. 조회기업이 없으면 rowCount − 1.',
        'rowCount − 2',
        'number',
    ],
    [
        'RankBarListSkeleton',
        'label · listClassName · titleClassName · rowClassName · averageRowClassName · nameClassName · barClassName · valueClassName',
        '불러오는 중 문구와 실제 목록에 넘긴 것과 같은 클래스입니다 — 같게 넘기면 높이가 같습니다.',
        "'목록을 불러오는 중입니다.'",
        'string',
    ],
    [
        'RankBarList',
        'emptyClassName',
        '빈 상태 모양(여백 · 바탕 · 글자)입니다. K-BIGx 인쇄본은 차트 빈 상태(KbxChartEmpty)와 같은 모양으로 넘깁니다.',
        "'text-foreground-subtle py-10 text-center'",
        'string',
    ],
] as const

const Example = ({title, description, children}: {title: string; description: string; children: ReactNode}) => (
    <div className="flex flex-col gap-2">
        <p className="typo-body-xl-bold text-foreground">{title}</p>
        <p className="typo-body-m-regular text-foreground-subtle break-keep">{description}</p>
        <div className="border-subtle-3 bg-card rounded-sm border p-6">{children}</div>
    </div>
)

const SectionHeading = ({id, title, children}: {id: string; title: string; children?: ReactNode}) => (
    <div className="flex flex-col gap-2">
        <h2 id={id} className="typo-h4-bold">
            {title}
        </h2>
        {children ? <p className="typo-body-l-regular text-label-foreground">{children}</p> : null}
    </div>
)

const RankBarListGuidePage = () => (
    <GuidePageShell
        title="순위 막대 목록 (RankBarList)"
        description="제목 아래 항목마다 이름 · 가로 막대 · 값을 한 줄씩 적고, 끝에 평균 · 조회기업 줄을 두는 목록입니다. K-BIGx 보고서 인쇄본 기술혁신정보의 성장률 우수기업입니다."
    >
        <BaseCard>
            <section aria-labelledby="rbl-basic" className="flex flex-col gap-6">
                <SectionHeading id="rbl-basic" title="1. 기본 사용">
                    서버에서 바로 그리는 목록입니다. 두 목록을 가운데 축에서 좌우로 펼치는 웹 화면용은{' '}
                    <Link href="/component-guide/diverging-rank-chart" className={LINK_CLASS}>
                        DivergingRankChart
                    </Link>
                    입니다.
                </SectionHeading>
                <Example
                    title="템플릿 데이터"
                    description="두 목록이 같은 막대 끝 값(25)을 씁니다. 고성장 기업은 별 · 굵은 값, 평균은 위 짙은 선, 조회기업은 옅은 면."
                >
                    <div className="grid items-start gap-12 xl:grid-cols-2">
                        <RankBarList
                            titleAs="h3"
                            title="매출 100억원 이하"
                            items={SMALL}
                            max={SHARED_MAX}
                            colors={SMALL_COLORS}
                            highlightLabel="고성장"
                        />
                        <RankBarList
                            titleAs="h3"
                            title="매출 100억원 초과"
                            items={LARGE}
                            max={SHARED_MAX}
                            colors={LARGE_COLORS}
                            highlightLabel="고성장"
                        />
                    </div>
                </Example>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rbl-rule" className="flex flex-col gap-6">
                <SectionHeading id="rbl-rule" title="2. 짜임 규칙" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>위 굵은 선 → 제목 줄(옅은 면) → 값 줄 [이름 | 막대 | 값], 줄마다 아래 옅은 선입니다.</li>
                    <li>
                        막대 길이 = 값 ÷ max 입니다. 나란히 놓는 목록은 <code>rankBarScaleMax</code> 로 같은 max 를 넘겨
                        길이를 견줄 수 있게 합니다.
                    </li>
                    <li>
                        평균 줄은 위 짙은 선 · 옅은 굵은 글자 · 평균 막대 색(<code>averageLine</code> 을 주면 사선 ·
                        테두리), 조회기업 줄은 옅은 면 · 남색 굵은 글자입니다.
                    </li>
                    <li>받은 순서대로 그립니다 — 화면이 정렬하지 않습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rbl-edge" className="flex flex-col gap-6">
                <SectionHeading id="rbl-edge" title="3. 엣지 케이스">
                    값 범위 · 이름 길이 · 항목 수에 따라 모양을 맞춥니다.
                </SectionHeading>
                <div className="grid items-start gap-6 xl:grid-cols-2">
                    {EDGE_CASES.map((item) => (
                        <Example key={item.key} title={item.title} description={item.description}>
                            <RankBarList
                                titleAs="h3"
                                title="매출 100억원 이하"
                                items={item.items}
                                highlightLabel="고성장"
                            />
                        </Example>
                    ))}
                    <Example title="항목 없음" description="제목 아래 emptyText 한 줄만 보입니다.">
                        <RankBarList titleAs="h3" title="매출 100억원 초과" items={[]} />
                    </Example>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rbl-loading" className="flex flex-col gap-6">
                <SectionHeading id="rbl-loading" title="4. 불러오는 중 (RankBarListSkeleton)">
                    제목 줄과 값 줄(이름 · 막대 · 값 자리)을 같은 배치로 그립니다. 인쇄본은 데이터를 받은 뒤 서버에서
                    바로 그려 스켈레톤 없이 나옵니다.
                </SectionHeading>
                <div className="grid items-start gap-6 xl:grid-cols-2">
                    <Example title="불러오는 중" description="회색 자리 · 깜빡임으로 불러오는 중임을 보입니다.">
                        <RankBarListSkeleton label="성장률 우수기업을 불러오는 중입니다." />
                    </Example>
                    <Example title="불러온 뒤" description="같은 자리에 목록이 그려집니다.">
                        <RankBarList
                            titleAs="h3"
                            title="매출 100억원 이하"
                            items={SMALL}
                            max={SHARED_MAX}
                            colors={SMALL_COLORS}
                            highlightLabel="고성장"
                        />
                    </Example>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rbl-print" className="flex flex-col gap-6">
                <SectionHeading id="rbl-print" title="5. K-BIGx 인쇄본에서">
                    기술혁신정보 4쪽 — 소제목 오른쪽에 &apos;★ 고성장 기업&apos; 범례, 그 아래 두 목록을 48 간격으로
                    나란히 둡니다. 확인 화면:{' '}
                    <Link
                        href="/corp/k-bigx-report/innovation-growth-report/report-print?sections=innovation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        K-BIGx 보고서 인쇄본 기술혁신정보
                        <span className="sr-only"> (새 창)</span>
                    </Link>
                </SectionHeading>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        평균 막대는 옅은 바탕 + 파랑 사선 · 테두리(<code>averageLine</code>)입니다 — 같은 쪽 경쟁기업
                        사업실적 그래프의 평균과 같은 표현이고, 색을 빼도(흑백 인쇄) 사선 막대 = 평균으로 읽힙니다.
                    </li>
                    <li>조회기업 막대는 초록 — 100억원 이하 목록의 막대(남색)와 구분됩니다.</li>
                </ul>
                <Example
                    title="인쇄본 색"
                    description="kbx 색을 넘긴 모습입니다(.kbigx-print 안 · 다크에서도 흰 바탕)."
                >
                    <div className="kbigx-print bg-kbx-paper grid items-start gap-12 rounded-sm p-4 xl:grid-cols-2">
                        <RankBarList
                            titleAs="h3"
                            title="매출 100억원 이하"
                            items={SMALL}
                            max={SHARED_MAX}
                            colors={printColors('var(--kbx-color-navy)')}
                            highlightLabel="고성장"
                        />
                        <RankBarList
                            titleAs="h3"
                            title="매출 100억원 초과"
                            items={LARGE}
                            max={SHARED_MAX}
                            colors={printColors('var(--kbx-color-blue)')}
                            highlightLabel="고성장"
                        />
                    </div>
                </Example>
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rbl-a11y" className="flex flex-col gap-6">
                <SectionHeading id="rbl-a11y" title="6. 접근성" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        순위 목록(ol)이라 항목 순서 · 이름 · 값을 글자로 읽습니다. 막대는 꾸밈이라 낭독하지 않습니다.
                    </li>
                    <li>
                        강조 별은 숨기고 <code>highlightLabel</code> 을 숨김 글자로 읽어 색 · 모양만으로 정보를 전하지
                        않습니다[5.3.1].
                    </li>
                    <li>
                        스켈레톤은 <code>role=&quot;status&quot;</code> 와 숨김 문구로 불러오는 중임을 알립니다.
                    </li>
                    <li>마우스 반응과 움직임이 없습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="rbl-props" className="flex flex-col gap-6">
                <SectionHeading id="rbl-props" title="7. Props API">
                    <code>title</code> · <code>items</code> 가 필수입니다.
                </SectionHeading>
                <PropsTable items={PROPS_ITEMS} caption="RankBarList · RankBarListSkeleton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RankBarListGuidePage
