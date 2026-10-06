// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {PaginationBasicDemo, PaginationEllipsisDemo} from './pagination-demo'

export const metadata: Metadata = {title: '페이지네이션 (Pagination)'}

const SECTION_HEADER = 'flex max-w-4xl flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'

const USAGE_CODE = `'use client'
import {useState} from 'react'
import {Pagination} from '@/components/composite/pagination'

const [page, setPage] = useState(1)

<Pagination page={page} total={9} onPageChange={setPage} siblingCount={2} />`

const USAGE_ELLIPSIS = `<Pagination page={page} total={24} onPageChange={setPage} siblingCount={1} boundaryCount={1} maxVisibleItems={10} />`

const USAGE_COMPACT = `<Pagination page={page} total={9} onPageChange={setPage} compact />`

const COMPOSITION_COLUMNS = [
    {key: 'name', header: '요소', align: 'start', rowHeader: true},
    {key: 'desc', header: '설명', align: 'start', wrap: true},
] as const

const COMPOSITION_ROWS = [
    {
        key: 'prev',
        cells: ['이전', '아이콘과 "이전" 글자가 있는 높이 40 버튼입니다. 첫 페이지에서는 비활성입니다.'],
    },
    {
        key: 'page',
        cells: ['페이지 번호', '40×40 버튼입니다. 현재 페이지는 채운 면과 굵은 글자로 표시됩니다.'],
    },
    {
        key: 'ellipsis',
        cells: ['생략 (…)', '보이지 않는 페이지 구간을 대신합니다. 누를 수 없습니다.'],
    },
    {
        key: 'next',
        cells: ['다음', '"다음" 글자와 아이콘이 있는 높이 40 버튼입니다. 마지막 페이지에서는 비활성입니다.'],
    },
] as const

const PROPS_ITEMS = [
    ['Pagination', 'page', '현재 페이지입니다(1부터, 필수).', '-', 'number'],
    ['Pagination', 'total', '전체 페이지 수입니다(필수).', '-', 'number'],
    [
        'Pagination',
        'onPageChange',
        '이동할 페이지 번호를 받습니다(필수). 1~total 범위로 보정되며 현재 페이지와 같으면 호출되지 않습니다.',
        '-',
        '(page: number) => void',
    ],
    ['Pagination', 'siblingCount', '현재 페이지 양옆에 보일 페이지 수입니다.', '1', 'number'],
    ['Pagination', 'boundaryCount', '처음 · 끝에 항상 보일 페이지 수입니다.', '1', 'number'],
    [
        'Pagination',
        'maxVisibleItems',
        '페이지 번호와 말줄임표를 합친 최대 개수입니다. 이전 · 다음 버튼은 세지 않습니다.',
        '10',
        'number',
    ],
    ['Pagination', 'prevLabel · nextLabel', '이전 · 다음 버튼의 글자입니다.', "'이전' · '다음'", 'string'],
    [
        'Pagination',
        'compact',
        '페이지 번호와 이전 · 다음 버튼을 32×32 로, 간격을 8 에서 4 로 줄입니다.',
        'false',
        'boolean',
    ],
    ['Pagination', 'aria-label', '내비게이션의 이름입니다.', "'페이지 이동'", 'string'],
    ['Pagination', 'className', '바깥 nav 에 덧붙일 클래스입니다.', '-', 'string'],
] as const

const PaginationGuidePage = () => (
    <GuidePageShell
        title="페이지네이션 (Pagination)"
        description="목록의 페이지를 이동하는 내비게이션입니다. 현재 페이지는 상태로 관리하고 onPageChange 로 바꿉니다."
    >
        <BaseCard>
            <section aria-labelledby="pg-preview" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pg-preview" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>page</code> · <code>total</code> · <code>onPageChange</code> 를 넘깁니다. 페이지 이동은
                        URL 이 아니라 상태로 처리하므로 컨트롤은 <code>button</code> 입니다.
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-md border p-6">
                    <PaginationBasicDemo />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pg-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pg-variants" className="typo-h4-bold">
                        변형 · 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        페이지 수와 <code>compact</code> 에 따라 구성이 달라집니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">많은 페이지 (생략)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            전체 페이지 수가 <code>maxVisibleItems</code> 를 넘으면 처음 · 끝(
                            <code>boundaryCount</code>)과 현재 페이지 주변만 남기고 나머지는 …로 생략합니다. 번호와 …는
                            최대 10개, 이전 · 다음을 포함하면 최대 12개가 보입니다.
                        </p>
                        <div className="border-border overflow-x-auto rounded-md border p-6">
                            <PaginationEllipsisDemo />
                        </div>
                        <CodeBlock code={USAGE_ELLIPSIS} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">compact</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            좁은 영역에서 번호와 이전 · 다음 버튼을 32×32 로, 간격을 8 에서 4 로 줄입니다. 이전 · 다음은
                            글자 없이 아이콘만 남으며 <code>aria-label</code> 은 유지됩니다.
                        </p>
                        <CodeBlock code={USAGE_COMPACT} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pg-composition" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pg-composition" className="typo-h4-bold">
                        구성 요소
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        왼쪽부터 이전 · 페이지 번호 · 다음 순서로 놓입니다.
                    </p>
                </div>
                <Table
                    caption="페이지네이션 구성 요소 목록"
                    columns={COMPOSITION_COLUMNS}
                    rows={COMPOSITION_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pg-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pg-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        이름과 상태 속성은 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>nav</code> 로 렌더링되고 이름은 <code>aria-label</code>(기본 &quot;페이지 이동&quot;)
                        입니다. 한 화면에 둘 이상 두면 서로 다른 이름을 줍니다[6.4.2].
                    </li>
                    <li>
                        현재 페이지에 <code>aria-current=&quot;page&quot;</code> 가 붙고 채운 면 + 굵은 글자로도
                        구분합니다[5.3.1]. 번호 버튼은 &quot;N 페이지&quot;, 이전 · 다음 버튼은 &quot;이전 페이지&quot;
                        · &quot;다음 페이지&quot;로 읽힙니다[5.1.1].
                    </li>
                    <li>
                        모든 컨트롤이 <code>button</code> 이라 Tab · Enter · Space 로 조작하고, 포커스는 외곽선으로
                        표시됩니다[6.1.1][6.1.2].
                    </li>
                    <li>
                        첫 · 마지막 페이지에서 이전 · 다음은 <code>disabled</code> 입니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pg-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pg-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>page</code> · <code>total</code> · <code>onPageChange</code> 가 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Pagination Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PaginationGuidePage
