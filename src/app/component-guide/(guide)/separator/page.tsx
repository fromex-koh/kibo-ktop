// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {InlineSeparator} from '@/components/composite/inline-separator'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {BaseCard} from '@/components/composite/base-card'
import {Separator} from '@/components/ui/separator'

export const metadata: Metadata = {title: '구분선 (Separator)'}

const STYLE_COLUMNS = [
    {key: 'name', header: '구분', align: 'start', rowHeader: true},
    {key: 'desc', header: '설명', align: 'start', wrap: true},
] as const

const STYLE_ROWS = [
    {
        key: 'horizontal',
        cells: [<code key="name">horizontal</code>, '전체 폭의 1px 가로선입니다. 색상은 border-subtle-3 입니다.'],
    },
    {
        key: 'vertical',
        cells: [
            <code key="name">vertical</code>,
            '부모 높이만큼 늘어나는 1px 세로선입니다. 색상은 border-subtle-3 입니다.',
        ],
    },
]

const USAGE_CODE = `import {Separator} from '@/components/ui/separator'

<p>위 콘텐츠</p>
<Separator className="my-10" />
<p>아래 콘텐츠</p>`

const INLINE_CODE = `import {InlineSeparator} from '@/components/composite/inline-separator'

{/* 한 줄 안에서 값과 값을 가르는 세로선 */}
<div className="flex items-center">
  <span>2026-05-15 14:30:12</span>
  <InlineSeparator />
  <span className="text-primary-strong font-bold">평가완료</span>
  <InlineSeparator />
  <span className="text-foreground font-bold">AA</span>
</div>

{/* 제목(h3)처럼 글자만 담을 수 있는 자리에는 inline 을 켠다 — div 대신 span 으로 그린다 */}
<h3 className="typo-title-m-medium">
  평가<InlineSeparator inline />평가 신청 오류 문의
</h3>`

const PROPS_ITEMS = [
    ['Separator', 'orientation', '구분선 방향입니다.', "'horizontal'", "'horizontal' | 'vertical'"],
    ['Separator', 'decorative', 'true 이면 장식으로 처리해 스크린리더가 읽지 않습니다.', 'true', 'boolean'],
    ['Separator', 'className', '간격 등 추가할 클래스입니다.', '-', 'string'],
    [
        'InlineSeparator',
        'inline',
        'true 이면 div 대신 span 으로 렌더링해 글 흐름 안에 놓습니다. 좌우 여백이 12px 에서 16px 로 바뀝니다.',
        '-',
        'boolean',
    ],
    ['InlineSeparator', 'div 속성', 'className 등 div 속성을 전달합니다.', '-', "ComponentPropsWithoutRef<'div'>"],
] as const

const SeparatorGuidePage = () => (
    <GuidePageShell title="구분선 (Separator)" description="콘텐츠와 콘텐츠 사이를 가르는 1px 선입니다.">
        <BaseCard>
            <section aria-labelledby="dv-demo" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dv-demo" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        두께 1px 과 색상 <code>border-subtle-3</code>은 기본값입니다. 사용처는 위아래 간격만{' '}
                        <code>className</code>(예: <code>my-10</code> = 40px)으로 지정합니다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <p className="typo-body-l-regular text-foreground">위 콘텐츠</p>
                    <Separator className="my-10" />
                    <p className="typo-body-l-regular text-foreground">아래 콘텐츠</p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">방향별 스타일</h3>
                        <Table
                            caption="구분선 방향별 기본 스타일 목록"
                            columns={STYLE_COLUMNS}
                            rows={STYLE_ROWS}
                            size="md"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dv-inline" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dv-inline" className="typo-h4-bold">
                        인라인 구분선 (InlineSeparator)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        [일시│상태│등급], [분류│제목]처럼 한 줄 안에서 값과 값을 가르는 높이 12px 세로선입니다. 좌우
                        여백은 12px 입니다.
                    </p>
                </div>
                <div className="border-border flex flex-col gap-4 rounded-md border p-6">
                    <div className="typo-body-l-regular flex items-center">
                        <span className="text-foreground-subtle">2026-05-15 14:30:12</span>
                        <InlineSeparator />
                        <span className="text-primary-strong font-bold">평가완료</span>
                        <InlineSeparator />
                        <span className="text-foreground font-bold">AA</span>
                    </div>
                    <h3 className="typo-title-m-medium text-foreground">
                        <span className="typo-body-xl-regular text-label-foreground align-middle">평가</span>
                        <InlineSeparator inline />
                        평가 신청 오류 문의
                    </h3>
                </div>
                <CodeBlock code={INLINE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dv-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dv-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        구분선은 기본이 장식이라 스크린리더가 읽지 않습니다. 의미가 있는 구분은 제목과 목록 구조로
                        전달합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>decorative</code> 기본값이 <code>true</code>라 <code>role=&quot;none&quot;</code>이
                        됩니다. 구조적 구분이 필요하면 <code>decorative={'{false}'}</code>를 줍니다[8.2.1].
                    </li>
                    <li>
                        선 색 <code>border-subtle-3</code>는 영역 구분용이며 정보 전달에 쓰지 않습니다[5.3.5].
                    </li>
                    <li>
                        <code>InlineSeparator</code>는 <code>div</code>이므로 <code>flex items-center</code> 줄 안에
                        둡니다. 제목(<code>h3</code>) 안에서는 <code>inline</code>을 켜 <code>span</code>으로 그립니다
                        [8.1.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dv-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="dv-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>Separator</code>는 Radix Separator 의 props 를 그대로 받습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Separator · InlineSeparator Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SeparatorGuidePage
