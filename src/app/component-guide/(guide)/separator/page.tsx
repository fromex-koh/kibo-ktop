import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {BaseCard} from '@/components/composite/base-card'
import {Separator} from '@/components/ui/separator'

export const metadata: Metadata = {title: '구분선 (Separator)'}

const DIVIDER_CLASS = 'my-10'

// 사용법 스니펫 — CopyChip 의 label 로 짧게 노출하고 클립보드엔 이 전체를 복사한다.
const USAGE_CODE = `<p>위 콘텐츠</p>
<Separator className="my-10" />
<p>아래 콘텐츠</p>`

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
                <div className="bg-background border-border overflow-x-auto rounded-md border">
                    <table className="w-full text-left">
                        <caption className="sr-only">클래스 레시피 목록</caption>
                        <thead>
                            <tr className="border-border bg-muted/50 border-b">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    클래스
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    역할
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                >
                                    기본 선 스타일
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                    ui Separator 기본값입니다. 수평은 border-top, 수직은 border-left로 1px 선을 그리고
                                    색상은 border-subtle-3을 사용합니다.
                                </td>
                            </tr>
                            <tr className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                >
                                    my-10
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                    위아래 40px 간격을 줍니다.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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
