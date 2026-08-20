import type {Metadata} from 'next'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {InlineSeparator} from '@/components/composite/inline-separator'
import {Table} from '@/components/custom/table'
import {BaseCard} from '@/components/composite/base-card'
import {Separator} from '@/components/ui/separator'

export const metadata: Metadata = {title: '구분선 (Separator)'}

const RECIPE_COLUMNS = [
    {key: 'class', header: '클래스', align: 'start', rowHeader: true},
    {key: 'role', header: '역할', align: 'start', wrap: true},
] as const

const RECIPE_ROWS = [
    {
        key: 'default',
        cells: [
            <span key="class" className="font-mono">
                기본 선 스타일
            </span>,
            'ui Separator 기본값입니다. 수평은 border-top, 수직은 border-left로 1px 선을 그리고 색상은 border-subtle-3을 사용합니다.',
        ],
    },
    {
        key: 'my-10',
        cells: [
            <span key="class" className="font-mono">
                my-10
            </span>,
            '위아래 40px 간격을 줍니다.',
        ],
    },
]

const DIVIDER_CLASS = 'my-10'

// 사용법 스니펫 — CopyChip 의 label 로 짧게 노출하고 클립보드엔 이 전체를 복사한다.
const USAGE_CODE = `<p>위 콘텐츠</p>
<Separator className="my-10" />
<p>아래 콘텐츠</p>`

const INLINE_CODE = `{/* 한 줄 안에서 값과 값을 가르는 세로선(시안 divider 1×12).
    세로 Separator 를 그대로 쓰면 셸의 self-stretch 때문에 줄 위쪽에 붙는데, 이 조각이 그 손질을 갖는다 */}
<div className="flex items-center">
  <span>2026-05-15 14:30:12</span>
  <InlineSeparator />
  <span className="text-primary-strong font-bold">평가완료</span>
  <InlineSeparator />
  <span className="text-purple-600 font-bold">AA</span>
</div>

{/* 제목(h3)처럼 글자만 담을 수 있는 자리에는 inline 을 켠다 — div 대신 span 으로 그린다 */}
<h3 className="typo-title-m-medium">
  평가<InlineSeparator inline />평가 신청 오류 문의
</h3>`

const PROPS_ITEMS = [
    ['orientation', '구분선 방향입니다.', "'horizontal'", "'horizontal' | 'vertical'"],
    ['decorative', '장식용이면 접근성 트리에서 제외합니다.', 'true', 'boolean'],
    ['className', '간격 등 루트에 추가할 클래스명입니다.', 'undefined', 'string'],
] as const

// 구분선 — ui Separator가 프로젝트 선 스타일을 기본으로 책임지고, 사용처는 필요한 간격만 더한다.
const SeparatorGuidePage = () => (
    <GuidePageShell
        title="구분선 (Separator)"
        description="ui Separator에 프로젝트 구분선 기본 스타일을 연결한 패턴입니다."
    >
        <BaseCard>
            <section aria-labelledby="dv-demo" className="flex flex-col gap-4">
                <div>
                    <h2 id="dv-demo" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        두께 1px, 색상 <code className="font-mono">border-subtle-3</code>는 기본값이고, 위아래 간격{' '}
                        <code className="font-mono">my-10</code>(40px)만 사용처에서 지정합니다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <p className="typo-body-l-regular text-foreground">위 콘텐츠</p>
                    <Separator className={DIVIDER_CLASS} />
                    <p className="typo-body-l-regular text-foreground">아래 콘텐츠</p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dv-recipe" className="flex flex-col gap-4">
                <div>
                    <h2 id="dv-recipe" className="typo-h4-bold">
                        클래스 레시피
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        ui Separator는 기본적으로 border-subtle-3 실제 border 선을 사용합니다. 사용처에서는 보통 간격만
                        더한다.
                    </p>
                </div>
                <Table caption="클래스 레시피 목록" columns={RECIPE_COLUMNS} rows={RECIPE_ROWS} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="dv-inline" className="flex flex-col gap-4">
                <div>
                    <h2 id="dv-inline" className="typo-h4-bold">
                        인라인 구분선 (InlineSeparator)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        [일시│상태│등급], [분류│제목]처럼 한 줄 안에서 값과 값을 가르는 세로선입니다. 세로{' '}
                        <code className="font-mono">Separator</code> 를 그대로 쓰면 셸이{' '}
                        <code className="font-mono">self-stretch</code> 를 걸어 두어 높이를 12 로 묶는 순간 줄 위쪽에
                        붙는데, 그 손질과 좌우 여백(12)을 이 조각이 갖습니다. 제목처럼 글자만 담을 수 있는 자리에는{' '}
                        <code className="font-mono">inline</code> 을 켜서 span 으로 그립니다.
                    </p>
                </div>
                <div className="border-border flex flex-col gap-4 rounded-md border p-6">
                    <div className="typo-body-l-regular flex items-center">
                        <span className="text-foreground-subtle">2026-05-15 14:30:12</span>
                        <InlineSeparator />
                        <span className="text-primary-strong font-bold">평가완료</span>
                        <InlineSeparator />
                        <span className="font-bold text-purple-600">AA</span>
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
            <section aria-labelledby="dv-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="dv-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Separator(Radix)의 props 를 그대로 받습니다.
                    </p>
                </div>
                <div className="bg-background border-border overflow-x-auto rounded-md border">
                    <table className="w-full text-left">
                        <caption className="sr-only">Props 목록</caption>
                        <thead>
                            <tr className="border-border bg-muted/50 border-b">
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
    </GuidePageShell>
)

export default SeparatorGuidePage
