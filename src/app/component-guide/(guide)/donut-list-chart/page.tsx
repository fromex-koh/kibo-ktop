// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {DonutListChartSkeleton} from '@/components/composite/donut-list-chart-skeleton'
import CodeBlock from '@/components/custom/code-block'
import {DonutListChart, type DonutListItem} from '@/components/custom/donut-list-chart'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '도넛 + 목록 (DonutListChart)'}

const LINK_CLASS = 'text-primary underline underline-offset-4'

// 큰 분류부터 진한 남색 → 옅은 파랑, '기타'는 회색(웹 단계 색 — 다크에서 반사된다).
const COLORS = [
    'var(--ds-navy-800)',
    'var(--ds-navy-500)',
    'var(--ds-blue-700)',
    'var(--ds-blue-500)',
    'var(--ds-blue-400)',
    'var(--ds-blue-300)',
    'var(--ds-blue-200)',
] as const
const OTHERS_COLOR = 'var(--ds-gray-200)'

// 이름 · 비중 · 건수 → 차트 데이터('기타'는 회색).
const toData = (rows: readonly (readonly [string, number, number?])[]): DonutListItem[] =>
    rows.map(([label, percentage, count], index) => ({
        id: `${label}-${index}`,
        label,
        percentage,
        count,
        color: label === '기타' ? OTHERS_COLOR : COLORS[index % COLORS.length],
    }))

// 템플릿 데이터(중분류 기준).
const STANDARD_DATA = toData([
    ['무선 통신·네트워크', 55, 24],
    ['정보 보호', 12, 5],
    ['컴퓨팅 시스템', 9, 4],
    ['소프트웨어', 7, 3],
    ['반도체 소자', 6, 3],
    ['전자 부품', 5, 2],
    ['광 · 전파', 4, 2],
    ['기타', 2, 1],
])
// 3. 엣지 케이스.
const SINGLE_DATA = toData([['무선 통신·네트워크', 100, 24]])
const TWO_DATA = toData([
    ['무선 통신·네트워크', 70, 21],
    ['정보 보호', 30, 9],
])
const ZERO_DATA = toData([
    ['무선 통신·네트워크', 60, 18],
    ['정보 보호', 25, 8],
    ['컴퓨팅 시스템', 15, 4],
    ['소프트웨어', 0, 0],
])
const ROUNDED_DATA = toData([
    ['무선 통신·네트워크', 33, 10],
    ['정보 보호', 33, 10],
    ['컴퓨팅 시스템', 33, 10],
])
const LONG_DATA = toData([
    ['차세대 이동통신 기반 초고속 전송 및 접속 기술(무선 · 이동통신 서비스 세부분야)', 48, 22],
    ['사물인터넷 응용서비스 플랫폼 운영 기술', 22, 10],
    ['정보보호 및 네트워크 보안 관제 기술', 18, 8],
    ['기타', 12, 5],
])
const LARGE_DATA = toData([
    ['무선 통신·네트워크', 48.6, 12345],
    ['정보 보호', 21.35, 5432],
    ['컴퓨팅 시스템', 17.05, 4321],
    ['기타', 13, 3210],
])
const NO_COUNT_DATA = toData([
    ['무선 통신·네트워크', 55],
    ['정보 보호', 30],
    ['기타', 15],
])

const EDGE_CASES = [
    {
        key: 'single',
        title: '항목 하나',
        description: '원 전체가 한 조각이고 조각 사이 선을 그리지 않습니다.',
        data: SINGLE_DATA,
    },
    {key: 'two', title: '항목 둘', description: '목록이 짧아도 도넛 옆 세로 가운데에 놓입니다.', data: TWO_DATA},
    {
        key: 'zero',
        title: '0% 항목',
        description: '0% 는 도넛에 그리지 않고 목록에만 남깁니다(0% · 0개).',
        data: ZERO_DATA,
    },
    {
        key: 'rounded',
        title: '비중 합이 99',
        description: '합 기준으로 원을 채우고, 글자는 받은 비중(33%)을 그대로 적습니다.',
        data: ROUNDED_DATA,
    },
    {
        key: 'long',
        title: '이름이 길 때',
        description:
            '이름은 줄을 바꾸고(띄어쓰기 기준), 값은 오른쪽에 한 줄로 둡니다. 줄이 높아진 만큼 목록이 길어집니다.',
        data: LONG_DATA,
    },
    {
        key: 'large',
        title: '값이 클 때',
        description: '건수는 천 단위 쉼표, 비중은 받은 소수 자리 그대로 적습니다.',
        data: LARGE_DATA,
    },
    {key: 'no-count', title: '건수 없음', description: '건수를 넘기지 않으면 비중만 적습니다.', data: NO_COUNT_DATA},
] as const

const USAGE_CODE = `import {DonutListChart} from '@/components/custom/donut-list-chart'

<DonutListChart
  ariaLabel="중분류 기준 보유기술 비중"
  data={[
    {id: 'm1', label: '무선 통신·네트워크', percentage: 55, count: 24, color: 'var(--ds-navy-800)'},
    {id: 'm2', label: '정보 보호', percentage: 12, count: 5, color: 'var(--ds-navy-500)'},
    // … 비중 내림차순, '기타'는 마지막
  ]}
/>`

const LOADING_CODE = `import {DonutListChartSkeleton} from '@/components/composite/donut-list-chart-skeleton'

// 도넛 크기 · 목록 폭을 실제 차트와 같게 넘기면 자리가 흔들리지 않습니다.
{isLoading ? (
  <DonutListChartSkeleton rowCount={8} label="보유기술 비중을 불러오는 중입니다." />
) : (
  <DonutListChart data={middleCategory} ariaLabel="중분류 기준 보유기술 비중" />
)}`

const PRINT_CODE = `// K-BIGx PDF 템플릿 — 도넛 300 · 목록 폭 684 · 간격 64 · 줄 여백 10(마지막 5) · 구분선 1(kbigx-print-innovation.tsx).
<DonutListChart
  className="gap-16"
  donutClassName="w-75"
  listClassName="kbx-text-20 text-kbx-foreground max-w-171"
  rowClassName="border-kbx-border-subtle kbx-border-b-thin py-2.5"
  lastRowClassName="py-kbx-5"
  highlightClassName="font-kbx-bold"
  gapColor="var(--kbx-color-paper)"
  ariaLabel="중분류 기준 보유기술 비중"
  data={items.map((item, index) => ({...item, color: kbxCategoryColor(item.label, index)}))}
/>`

const SHARE_PRINT_CODE = `// K-BIGx PDF 템플릿 기업 · 특허 현황 비중 — 도넛 172(가는 고리) · 줄 사이 15 · 색 칸 16(옅은 테두리) · 비중 굵게 + 건수 옅게.
<DonutListChart
  className="gap-7"
  donutClassName="w-43"
  listClassName="kbx-text-19 text-kbx-foreground gap-kbx-15"
  rowClassName=""            // 구분선 · 줄 여백 없음
  lastRowClassName=""
  highlightClassName=""      // 첫 줄도 굵게 하지 않음
  labelClassName="text-kbx-label"
  valueClassName="font-kbx-bold"
  countClassName="font-kbx-medium text-kbx-foreground-subtle"
  swatchClassName="size-4"
  swatchStroke="color-mix(in srgb, var(--kbx-color-foreground) 25%, transparent)"
  ring={{outer: 146.5, inner: 76.2, gap: 4.36}}   // 172px 도넛에서 바깥 84 · 안쪽 43.68 · 선 2.5
  gapColor="var(--kbx-color-paper)"
  countUnit="개"
  ariaLabel="매출 규모별 기업수 비중"
  data={companyShare.map((item, index) => ({...item, color: marketScaleColor(index)}))}
/>`

const PROPS_ITEMS = [
    ['DonutListChart', 'data', '분류 목록입니다. 비중 내림차순으로 넘깁니다.', '-', 'readonly DonutListItem[]'],
    ['DonutListChart', 'ariaLabel', '도넛 그림의 이름입니다(목록은 그대로 읽힘).', '-', 'string'],
    ['DonutListChart', 'countUnit', '건수 단위입니다.', "'개'", 'string'],
    ['DonutListChart', 'gapColor', '조각 사이 선 색(바탕색과 같게)입니다.', "'var(--ds-card)'", 'string'],
    ['DonutListChart', 'emptyText', '항목이 없을 때 문구입니다.', "'표시할 데이터가 없습니다.'", 'string'],
    ['DonutListChart', 'donutClassName', '도넛 크기(w-*)입니다.', "'w-60'", 'string'],
    [
        'DonutListChart',
        'listClassName · rowClassName · lastRowClassName · highlightClassName',
        '목록 글자 · 줄 여백 · 구분선 · 첫 줄 굵기입니다. 주면 기본값을 대신합니다(섞지 않음).',
        '웹 시맨틱 클래스',
        'string',
    ],
    [
        'DonutListChart',
        'labelClassName · valueClassName · countClassName',
        "이름 글자, 값('비중% · 건수') 글자, 건수 부분만의 글자입니다. 없으면 목록 글자를 따릅니다.",
        '-',
        'string',
    ],
    [
        'DonutListChart',
        'swatchClassName · swatchStroke',
        '색 칸 크기(size-*) · 테두리 색입니다.',
        "'size-3' · 없음",
        'string',
    ],
    [
        'DonutListChart',
        'ring',
        '고리 치수(viewBox 300 기준) — 바깥 · 안쪽 반지름, 조각 사이 선 두께입니다. 작은 도넛은 선을 키웁니다.',
        '{outer: 150, inner: 83.3, gap: 3}',
        '{outer: number; inner: number; gap: number}',
    ],
    [
        'DonutListChart',
        'donutCaption',
        '도넛 바로 아래 가운데 짧은 글입니다(예: 2024년 기준 — PDF 템플릿 담보 현황). 없으면 도넛만 그립니다.',
        '-',
        'ReactNode',
    ],
    [
        'DonutListChart',
        'donutBoxClassName · captionClassName',
        '도넛 · 아래 글 묶음의 폭 · 정렬과 아래 글 크기 · 색입니다(donutCaption 이 있을 때만).',
        "- · 'typo-body-m-regular text-foreground-subtle'",
        'string',
    ],
    [
        'DonutListChart',
        'listHeader',
        '목록 바로 위 글(예: 단위)입니다. 목록과 한 묶음이라 className 의 items-* 로 묶음째 세로 정렬합니다(PDF 템플릿 담보 현황 — 도넛 칸의 세로 가운데).',
        '없음',
        'ReactNode',
    ],
    ['DonutListItem', 'id · label · color', '분류 식별자 · 이름 · 조각 색입니다.', '-', 'string'],
    ['DonutListItem', 'percentage · count', '비중(%) · 건수입니다. 건수가 없으면 비중만 적습니다.', '-', 'number'],
    [
        'DonutListItem',
        'valueText',
        "값 칸 글자입니다. 주면 '비중% · 건수' 대신 적습니다(값이 없는 고정 항목의 '-' 등).",
        '-',
        'string',
    ],
    ['DonutListChartSkeleton', 'rowCount', '목록 줄 수입니다.', '8', 'number'],
    [
        'DonutListChartSkeleton',
        'hasDonutCaption · donutBoxClassName',
        '도넛 아래 글 자리와 도넛 묶음 폭입니다 — 실제 차트에 donutCaption 을 줄 때 같게 켭니다.',
        'false · -',
        'boolean · string',
    ],
    [
        'DonutListChartSkeleton',
        'label · donutClassName · listClassName · rowClassName · lastRowClassName',
        '불러오는 중 문구와 도넛 크기 · 목록 글자(줄 높이) · 줄 여백 · 구분선 두께입니다 — 실제 차트에 넘긴 것과 같게 넘기면 높이가 같습니다.',
        "'그래프를 불러오는 중입니다.'",
        'string',
    ],
    [
        'DonutListChart',
        'emptyClassName',
        '빈 상태 모양(여백 · 바탕 · 글자)입니다. K-BIGx PDF 템플릿은 차트 빈 상태(KbxChartEmpty)와 같은 모양으로 넘깁니다.',
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

const DonutListChartGuidePage = () => (
    <GuidePageShell
        title="도넛 + 목록 (DonutListChart)"
        description="분류별 비중을 도넛으로 그리고, 옆에 색 칸 · 이름 · 비중 · 건수 줄 목록을 두는 차트입니다. K-BIGx 보고서 PDF 템플릿 기술혁신정보의 기술 보유현황(중분류 · 세부분야 기준) · 매출 규모별 기업수 · 특허수 비중 그래프입니다."
    >
        <BaseCard>
            <section aria-labelledby="dlc-basic" className="flex flex-col gap-6">
                <SectionHeading id="dlc-basic" title="1. 기본 사용">
                    서버에서 바로 그리는 SVG 도넛과 줄 목록입니다. 화면 폭에 따라 범례가 아래로 내려가는 웹 화면용
                    도넛은{' '}
                    <Link href="/component-guide/percentage-donut-chart" className={LINK_CLASS}>
                        PercentageDonutChart
                    </Link>
                    , 지시선 라벨 원형은{' '}
                    <Link href="/component-guide/callout-pie-chart" className={LINK_CLASS}>
                        CalloutPieChart
                    </Link>
                    입니다.
                </SectionHeading>
                <Example
                    title="템플릿 데이터"
                    description="첫 줄(가장 큰 분류) 이름은 굵게, 마지막 줄(기타)은 구분선 없이."
                >
                    <DonutListChart data={STANDARD_DATA} ariaLabel="중분류 기준 보유기술 비중 예시" />
                </Example>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dlc-rule" className="flex flex-col gap-6">
                <SectionHeading id="dlc-rule" title="2. 짜임 규칙" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>도넛은 바깥 반지름 150 · 안쪽 83.3(viewBox 300), 12시에서 시계 방향, 조각 사이 선 3 입니다.</li>
                    <li>
                        목록은 도넛 옆 세로 가운데에 놓고, 줄마다 색 칸(12) · 이름 · 값(오른쪽)과 아래 구분선을 둡니다.
                    </li>
                    <li>
                        값은 &apos;비중% · 건수개&apos; 로 적습니다. 목록이 곧 값이라 숨김 목록을 따로 두지 않습니다.
                    </li>
                    <li>크기 · 글자 · 선 모양은 className 들로 바꿉니다 — PDF 템플릿은 kbx 클래스를 넘깁니다.</li>
                    <li>
                        고리 두께 · 조각 사이 선은 <code>ring</code> 으로 바꿉니다. 비중은 굵게 · 건수는 옅게처럼 값을
                        나눠 꾸밀 때는 <code>valueClassName</code> · <code>countClassName</code> 을 씁니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dlc-edge" className="flex flex-col gap-6">
                <SectionHeading id="dlc-edge" title="3. 엣지 케이스">
                    항목 수 · 0% · 비중 합 · 이름 길이 · 값 크기에 따라 모양을 맞춥니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    {EDGE_CASES.map((item) => (
                        <Example key={item.key} title={item.title} description={item.description}>
                            <DonutListChart data={item.data} ariaLabel={`${item.title} 예시`} />
                        </Example>
                    ))}
                    <Example title="항목 없음" description="그릴 항목이 없으면 emptyText 만 보입니다.">
                        <DonutListChart data={[]} ariaLabel="항목 없음 예시" />
                    </Example>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dlc-loading" className="flex flex-col gap-6">
                <SectionHeading id="dlc-loading" title="4. 불러오는 중 (DonutListChartSkeleton)">
                    도넛 고리와 목록 줄 자리를 같은 배치로 그립니다. PDF 템플릿은 데이터를 받은 뒤 서버에서 바로 그려
                    스켈레톤 없이 나옵니다.
                </SectionHeading>
                <div className="grid gap-6 xl:grid-cols-2">
                    <Example
                        title="도넛 아래 글 (donutCaption)"
                        description="도넛 바로 아래 가운데에 기준 연도 같은 짧은 글을 둡니다(PDF 템플릿 담보 현황 — 2024년 기준)."
                    >
                        <DonutListChart
                            data={STANDARD_DATA.slice(0, 3)}
                            ariaLabel="도넛 아래 글 예시"
                            donutCaption="2024년 기준"
                        />
                    </Example>
                    <Example
                        title="불러오는 중 · 아래 글"
                        description="hasDonutCaption 을 켜면 아래 글 자리도 함께 잡습니다."
                    >
                        <DonutListChartSkeleton rowCount={3} hasDonutCaption label="담보 현황을 불러오는 중입니다." />
                    </Example>
                    <Example title="불러오는 중" description="회색 자리 · 깜빡임으로 불러오는 중임을 보입니다.">
                        <DonutListChartSkeleton label="보유기술 비중을 불러오는 중입니다." />
                    </Example>
                    <Example title="불러온 뒤" description="같은 자리에 차트가 그려집니다.">
                        <DonutListChart data={STANDARD_DATA} ariaLabel="불러온 뒤 예시" />
                    </Example>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="로딩 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dlc-print" className="flex flex-col gap-6">
                <SectionHeading id="dlc-print" title="5. K-BIGx PDF 템플릿에서">
                    기술혁신정보 1쪽 — 분류 기준 제목(아래 짙은 선) → 도넛 + 목록, 중분류 · 세부분야 기준을 위아래로 56
                    간격에 둡니다. 확인 화면:{' '}
                    <Link
                        href="/corp/k-bigx-report/innovation-growth-report/report-print?sections=innovation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        K-BIGx 보고서 PDF 템플릿 기술혁신정보
                        <span className="sr-only"> (새 창)</span>
                    </Link>
                </SectionHeading>
                <CodeBlock code={PRINT_CODE} language="tsx" copyLabel="복사" />
                <p className="typo-body-l-regular text-label-foreground">
                    기술혁신정보 3쪽 — 매출 규모별 기업수 · 특허수 비중은 가는 고리 · 구분선 없는 목록 · 비중 굵게 +
                    건수 옅게로 씁니다(막대 표는{' '}
                    <Link href="/component-guide/dual-bar-table" className={LINK_CLASS}>
                        DualBarTable
                    </Link>
                    ).
                </p>
                <Example title="기업 · 특허 현황 비중 모양" description="웹 색으로 같은 모양을 그린 예시입니다.">
                    <div className="max-w-xl">
                        <DonutListChart
                            data={toData([
                                ['10억원 이하', 56, 13547],
                                ['30억원 이하', 24, 5678],
                                ['100억원 이하', 6, 1532],
                                ['300억원 이하', 11, 2657],
                                ['300억원 초과', 3, 800],
                            ]).map((item, index) => ({...item, color: COLORS[index + 1] ?? OTHERS_COLOR}))}
                            ariaLabel="매출 규모별 기업수 비중 예시"
                            className="gap-7"
                            donutClassName="w-43"
                            listClassName="typo-body-m-regular text-foreground gap-4"
                            rowClassName=""
                            lastRowClassName=""
                            highlightClassName=""
                            valueClassName="font-bold"
                            countClassName="font-medium text-foreground-subtle"
                            swatchClassName="size-4"
                            ring={{outer: 146.5, inner: 76.2, gap: 4.36}}
                        />
                    </div>
                </Example>
                <CodeBlock code={SHARE_PRINT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dlc-a11y" className="flex flex-col gap-6">
                <SectionHeading id="dlc-a11y" title="6. 접근성" />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        도넛은 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 로 이름을 갖고, 값은 옆
                        목록(ul)이 글자로 읽어 줍니다[5.1.1].
                    </li>
                    <li>
                        비중 · 건수를 글자로 적어 색만으로 정보를 전하지 않습니다[5.3.1]. 색 칸은 꾸밈이라 낭독하지
                        않습니다.
                    </li>
                    <li>
                        스켈레톤은 <code>role=&quot;status&quot;</code> 와 숨김 문구로 불러오는 중임을 알립니다.
                    </li>
                    <li>마우스 반응과 움직임이 없습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dlc-props" className="flex flex-col gap-6">
                <SectionHeading id="dlc-props" title="7. Props API">
                    <code>data</code> · <code>ariaLabel</code> 이 필수입니다.
                </SectionHeading>
                <PropsTable items={PROPS_ITEMS} caption="DonutListChart · DonutListChartSkeleton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default DonutListChartGuidePage
