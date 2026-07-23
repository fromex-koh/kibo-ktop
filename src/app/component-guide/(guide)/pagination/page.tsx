import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {PaginationBasicDemo, PaginationEllipsisDemo} from './pagination-demo'

export const metadata: Metadata = {title: '페이지네이션 (Pagination)'}

const USAGE_CODE = `'use client'
import {useState} from 'react'
import {Pagination} from '@/components/composite/pagination'

const [page, setPage] = useState(1)

{/* siblingCount=2 면 9페이지까지 생략 없이 모두 노출한다(시안 구성). */}
<Pagination page={page} total={9} onPageChange={setPage} siblingCount={2} />`

const USAGE_ELLIPSIS = `{/* 페이지가 많으면 경계(boundaryCount)와 현재 주변(siblingCount)만 남기고 생략한다. */}
<Pagination page={page} total={24} onPageChange={setPage} siblingCount={1} boundaryCount={1} />`

const COMPOSITION = [
    {
        name: '이전 (button)',
        desc: 'chevron + "이전" 텍스트. 첫 페이지에서는 disabled(흐린 색). aria-label="이전 페이지".',
    },
    {
        name: '페이지 번호 (button)',
        desc: '40×40 버튼. 현재 페이지는 aria-current="page"로 navy 면 + 흰 굵은 글자, 나머지는 회색.',
    },
    {name: '생략 (…)', desc: '경계와 현재 사이가 멀면 PaginationEllipsis(aria-hidden)로 대체한다.'},
    {name: '다음 (button)', desc: '"다음" 텍스트 + chevron. 마지막 페이지에서는 disabled. aria-label="다음 페이지".'},
] as const

const PROPS_ITEMS = [
    ['page', '현재 페이지(1-based).', '-', 'number'],
    ['total', '전체 페이지 수.', '-', 'number'],
    ['onPageChange', '페이지 변경 콜백. 클램프된 페이지 번호를 넘겨준다.', '-', '(page: number) => void'],
    ['siblingCount', '현재 페이지 양옆에 항상 노출할 페이지 수.', '1', 'number'],
    ['boundaryCount', '처음·끝에 항상 노출할 페이지 수.', '1', 'number'],
    ['prevLabel · nextLabel', '이전·다음 버튼 텍스트.', "'이전' · '다음'", 'string'],
    ['aria-label · className', '내비게이션 이름과 루트 클래스.', "'페이지 이동'", 'string'],
] as const

const PaginationGuidePage = () => (
    <GuidePageShell
        title="페이지네이션 (Pagination)"
        description="목록의 페이지를 이동하는 내비게이션입니다. shadcn ui/pagination 구조 위에 시안 스타일을 입히고, 페이지 이동은 상태(onPageChange)로 처리합니다."
    >
        <BaseCard>
            <section aria-labelledby="pg-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="pg-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        현재 페이지는 navy 면 + 흰 굵은 글자로 강조되고, 나머지는 회색 번호입니다. 첫·마지막
                        페이지에서는 <strong className="text-foreground">이전</strong>·
                        <strong className="text-foreground">다음</strong>이 비활성화됩니다.
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-md border p-6">
                    <PaginationBasicDemo />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pg-ellipsis" className="flex flex-col gap-4">
                <div>
                    <h2 id="pg-ellipsis" className="typo-h4-bold">
                        많은 페이지 (생략)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        페이지 수가 많으면 <code className="font-mono">boundaryCount</code>(처음·끝)와{' '}
                        <code className="font-mono">siblingCount</code>(현재 주변)만 남기고 나머지는{' '}
                        <strong className="text-foreground">…</strong>로 생략합니다.
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-md border p-6">
                    <PaginationEllipsisDemo />
                </div>
                <CodeBlock code={USAGE_ELLIPSIS} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pg-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="pg-composition" className="typo-h4-bold">
                        Composition
                    </h2>
                    <p className="text-foreground-muted text-sm">페이지네이션을 이루는 요소들입니다.</p>
                </div>
                <div className="bg-background border-border overflow-x-auto rounded-md border">
                    <table className="w-full text-left">
                        <caption className="sr-only">Composition 목록</caption>
                        <thead>
                            <tr className="border-border border-b bg-gray-100/25">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Name
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {COMPOSITION.map((row) => (
                                <tr key={row.name} className="border-border bg-background border-b last:border-b-0">
                                    <th
                                        scope="row"
                                        className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                    >
                                        {row.name}
                                    </th>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{row.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pg-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="pg-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">Pagination에 넘기는 속성입니다.</p>
                </div>
                <div className="border-border overflow-x-auto rounded-xl border">
                    <table className="w-full text-left">
                        <caption className="sr-only">Props 목록</caption>
                        <thead>
                            <tr className="border-border bg-card border-b">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Name
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Description
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Default
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Type
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {PROPS_ITEMS.map(([name, description, defaultValue, type]) => (
                                <tr key={name} className="border-border border-b last:border-b-0">
                                    <th
                                        scope="row"
                                        className="typo-body-l-medium text-primary-strong px-4 py-3 font-mono"
                                    >
                                        {name}
                                    </th>
                                    <td className="typo-body-l-regular text-foreground-subtle px-4 py-3">
                                        {description}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {defaultValue}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {type}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="pg-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="pg-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="text-foreground-muted text-sm">페이지네이션이 지키는 KWCAG 2.1 요건입니다.</p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        내비게이션은 <code className="font-mono">nav[aria-label]</code> 랜드마크(shadcn ui/pagination)로
                        렌더링됩니다. [6.4.2/8.2.1]
                    </li>
                    <li>
                        현재 페이지는 <code className="font-mono">aria-current=&quot;page&quot;</code>로 표시하고, 색만
                        아니라 굵기·면으로도 구분합니다. [5.3.1]
                    </li>
                    <li>
                        모든 컨트롤은 <code className="font-mono">button</code>이라 키보드로 조작할 수 있고, 각
                        번호·이전· 다음에 aria-label이 있습니다. [6.1.1/5.1.1]
                    </li>
                    <li>첫·마지막 페이지에서 이전·다음은 disabled 되어 포커스·클릭을 받지 않습니다.</li>
                    <li>
                        모든 컨트롤은 focus-visible 아웃라인을 가지며 40×40으로 44px에 근접한 터치 타깃을 확보합니다.
                        [6.1.2/6.1.3]
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PaginationGuidePage
