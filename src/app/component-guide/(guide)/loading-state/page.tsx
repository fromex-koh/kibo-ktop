// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {LoadingState} from '@/components/composite/loading-state'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '로딩 상태 (LoadingState)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {LoadingState} from '@/components/composite/loading-state'

{isLoading ? (
  <LoadingState className="bg-card rounded-lg" />
) : items.length > 0 ? (
  <ul>…</ul>
) : (
  <EmptyState className="bg-card rounded-lg" />
)}`

const VARIANT_CODE = `{/* 제목만 바꾸기, 좁은 자리 */}
<LoadingState title="검색 결과를 불러오는 중입니다." className="min-h-0 py-10" />

{/* 제목 + 설명 — 오래 걸리는 처리 */}
<LoadingState title="대량 조회 처리 중입니다." description="파일을 분석하여 평가 데이터를 조회하고 있습니다." />`

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'loading-state',
        cells: [
            '불러오는 동안 자리를 대신함',
            <code key="component">LoadingState</code>,
            '도는 아이콘과 안내 문구를 보입니다.',
        ],
    },
    {
        key: 'empty-state',
        cells: [
            '결과가 없음',
            <Link key="component" href="/component-guide/empty-state" className={LINK_CLASS}>
                EmptyState
            </Link>,
            '같은 자리·모양이라 로딩이 끝난 뒤 바꿔 끼워도 레이아웃이 흔들리지 않습니다.',
        ],
    },
    {
        key: 'skeleton',
        cells: [
            '들어올 내용의 모양을 미리 보임',
            <Link key="component" href="/component-guide/skeleton" className={LINK_CLASS}>
                Skeleton
            </Link>,
            '내용 구조를 흉내 낸 자리 표시입니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['LoadingState', 'title', '안내 문구입니다.', "'불러오는 중입니다.'", 'ReactNode'],
    [
        'LoadingState',
        'description',
        '제목 아래 보조 설명입니다. 주면 제목이 굵은 본문 색으로 바뀝니다.',
        'undefined',
        'ReactNode',
    ],
    ['LoadingState', 'className', '카드 면·모서리·높이처럼 자리에서 정할 클래스입니다.', 'undefined', 'string'],
    [
        'LoadingState',
        '...props',
        '나머지 div 속성을 전달합니다.',
        '-',
        "Omit<ComponentPropsWithoutRef<'div'>, 'title'>",
    ],
] as const

const LoadingStateGuidePage = () => (
    <GuidePageShell
        title="로딩 상태 (LoadingState)"
        description="목록이나 검색 결과를 불러오는 동안 그 자리를 대신하는 안내 영역입니다."
    >
        <BaseCard>
            <section aria-labelledby="loading-state-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="loading-state-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        최소 높이는 <code>min-h-90</code> 이고 카드 면·모서리는 사용처가 <code>className</code> 으로
                        줍니다. 로딩이 끝나면 이 영역을 결과나 <code>EmptyState</code> 로 바꿉니다.
                    </p>
                </div>
                <LoadingState className="bg-card min-h-52 rounded-lg" />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="loading-state-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="loading-state-variants" className="typo-h4-bold">
                        변형 예시
                    </h2>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">제목 바꾸기 · 좁은 자리</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            모달처럼 좁은 자리는 <code>min-h-0 py-10</code> 으로 높이를 줄입니다.
                        </p>
                        <LoadingState
                            title="검색 결과를 불러오는 중입니다."
                            className="bg-card min-h-0 rounded-lg py-10"
                        />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">제목 + 설명</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            오래 걸리는 처리를 안내할 때 <code>description</code> 을 줍니다.
                        </p>
                        <LoadingState
                            title="대량 조회 처리 중입니다."
                            description="파일을 분석하여 평가 데이터를 조회하고 있습니다."
                            className="bg-card rounded-lg"
                        />
                        <CodeBlock code={VARIANT_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="loading-state-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="loading-state-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                </div>
                <Table
                    caption="LoadingState · EmptyState · Skeleton 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="loading-state-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="loading-state-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>role=&quot;status&quot;</code> · <code>aria-live=&quot;polite&quot;</code> 로 불러오는
                        중임을 알립니다[8.2.1].
                    </li>
                    <li>
                        도는 아이콘은 장식이라 <code>aria-hidden</code> 이며, 동작 줄이기 설정에서는 돌지
                        않습니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="loading-state-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="loading-state-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">모든 속성이 선택입니다.</p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="LoadingState Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default LoadingStateGuidePage
