// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {EmptyState} from '@/components/composite/empty-state'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '빈 상태 (EmptyState)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {EmptyState} from '@/components/composite/empty-state'

{items.length > 0 ? (
  <ul>…</ul>
) : (
  <EmptyState title="검색내역이 없습니다." className="bg-card min-h-52 rounded-lg" />
)}`

const OPTION_CODE = `<EmptyState
  title="등록된 문의가 없습니다."
  description="궁금한 점이 있으면 1:1 문의를 남겨 주세요."
  action={<Button size="md">문의 등록</Button>}
/>`

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'empty-state',
        cells: ['결과가 없음', <code key="component">EmptyState</code>, '안내 문구 · 아이콘 · 선택 액션을 보입니다.'],
    },
    {
        key: 'loading-state',
        cells: [
            '불러오는 중',
            <Link key="component" href="/component-guide/loading-state" className={LINK_CLASS}>
                LoadingState
            </Link>,
            '같은 자리·모양이라 로딩이 끝난 뒤 바꿔 끼워도 레이아웃이 흔들리지 않습니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['EmptyState', 'title', '안내 문구입니다.', "'조회된 데이터가 없습니다.'", 'ReactNode'],
    ['EmptyState', 'description', '문구 아래 설명입니다. 넘길 때만 나옵니다.', 'undefined', 'ReactNode'],
    [
        'EmptyState',
        'icon',
        '문구 위 아이콘입니다. null 을 주면 아이콘을 두지 않습니다.',
        '<CircleAlert />',
        'ReactNode',
    ],
    ['EmptyState', 'action', '설명 아래 버튼 자리입니다. 넘길 때만 나옵니다.', 'undefined', 'ReactNode'],
    ['EmptyState', 'className', '카드 면·모서리·높이처럼 자리에서 정할 클래스입니다.', 'undefined', 'string'],
    ['EmptyState', '...props', '나머지 div 속성을 전달합니다.', '-', "Omit<ComponentPropsWithoutRef<'div'>, 'title'>"],
] as const

const EmptyStateGuidePage = () => (
    <GuidePageShell
        title="빈 상태 (EmptyState)"
        description="목록이나 검색 결과에 보여 줄 데이터가 없을 때 그 자리를 대신하는 안내 영역입니다."
    >
        <BaseCard>
            <section aria-labelledby="empty-state-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="empty-state-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        최소 높이는 <code>min-h-90</code> 입니다. 카드 면·모서리는 컴포넌트가 갖지 않고 사용처가{' '}
                        <code>className</code> 으로 줍니다.
                    </p>
                </div>
                <EmptyState title="검색내역이 없습니다." className="bg-card min-h-52 rounded-lg" />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="empty-state-variants" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="empty-state-variants" className="typo-h4-bold">
                        설명과 액션
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>description</code> 과 <code>action</code> 은 넘길 때만 렌더됩니다.
                    </p>
                </div>
                <EmptyState
                    title="등록된 문의가 없습니다."
                    description="궁금한 점이 있으면 1:1 문의를 남겨 주세요."
                    action={
                        <Button type="button" size="md">
                            문의 등록
                        </Button>
                    }
                    className="bg-card rounded-lg"
                />
                <CodeBlock code={OPTION_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="empty-state-report" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="empty-state-report" className="typo-h4-bold">
                        차트 · 표 자리에 쓸 때 (K-BIGx 웹 보고서)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        데이터가 없으면 차트 · 표 대신 같은 높이로 둡니다 — 카드 높이와 옆 카드와의 줄이 흔들리지
                        않습니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <Link href="/component-guide/percentage-donut-chart" className={LINK_CLASS}>
                            PercentageDonutChart
                        </Link>{' '}
                        — 컴포넌트가 스스로 빈 상태를 둡니다(사용처 분기 없음).
                    </li>
                    <li>
                        <Link href="/component-guide/word-cloud" className={LINK_CLASS}>
                            WordCloud
                        </Link>{' '}
                        — 사용처에서 분기합니다. 키워드가 0개면 WordCloud 대신 <code>EmptyState</code>(같은{' '}
                        <code>min-h-*</code>).
                    </li>
                    <li>
                        고정 줄 수 표(경영진 · 주주 현황 5줄) — 0건이면 5줄 높이(<code>min-h-56</code>)의 빈 상태, 1건
                        이상이면 남는 줄을 &apos;-&apos; 로 채웁니다.
                    </li>
                    <li>
                        수치 칸(관련 기업 및 특허현황 · 정부 R&amp;D사업 접수현황)은 빈 상태를 쓰지 않습니다 — 칸은 두고
                        값만 &apos;-&apos;(단위 없음). 실제 0 은 &apos;0건&apos; 으로 구분됩니다.
                    </li>
                    <li>
                        <Link href="/component-guide/score-gauge" className={LINK_CLASS}>
                            ScoreGauge
                        </Link>{' '}
                        ·{' '}
                        <Link href="/component-guide/rank-pyramid-chart" className={LINK_CLASS}>
                            RankPyramidChart
                        </Link>{' '}
                        — 점수 · 순위가 숫자가 아니면 컴포넌트가 &apos;-&apos; 로 그립니다(빈 상태 없이 모양 유지). 요약
                        문장은 사용처에서 &apos;평가 점수가 없습니다.&apos; 로 바꿉니다.
                    </li>
                    <li>
                        신용/재무 현황 — 기업신용등급 · 부문별 비교 · 최근 3개년 재무 현황은 모두 비면 빈 상태, 일부만
                        비면 그 칸만 &apos;-&apos;.{' '}
                        <Link href="/component-guide/rating-matrix" className={LINK_CLASS}>
                            재무비율진단
                        </Link>
                        은 5줄을 늘 두고 없는 줄은 &apos;-&apos;, 5줄 모두 &apos;-&apos; 면 빈 상태입니다(PDF 템플릿도
                        같은 규칙 · PDF 템플릿 빈 상태 모양).
                    </li>
                    <li>
                        Tech-Index — 표준정보 비교는 분포 곡선을 두고 점만 숨기며 전체 평균은 &apos;-&apos;, 요약 상자는
                        &apos;표준정보 비교 결과가 없습니다.&apos;. 부문별 지표 비교(2장) · 4대 혁신역량(4장) 카드는
                        제목을 늘 두고, 값이 없는 카드만 그래프 대신 빈 상태(그래프 높이 그대로). 막대 일부만 비면 그
                        자리 &apos;-&apos;.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="empty-state-choice" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="empty-state-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                </div>
                <Table
                    caption="EmptyState · LoadingState 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="empty-state-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="empty-state-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>role=&quot;status&quot;</code> · <code>aria-live=&quot;polite&quot;</code> 로 조회 결과가
                        없음을 알립니다[8.2.1].
                    </li>
                    <li>
                        아이콘은 장식이라 <code>aria-hidden</code> 입니다. 뜻은 문구가 전합니다[5.1.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="empty-state-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="empty-state-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">모든 속성이 선택입니다.</p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="EmptyState Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default EmptyStateGuidePage
