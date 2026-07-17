import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'

export const metadata: Metadata = {title: '스킵 내비게이션 (SkipNav)'}

const USAGE_CODE = `const SKIP_LINKS = [
  {href: '#sidebar-navigation', label: '사이드메뉴 바로가기'},
  {href: '#main', label: '본문 바로가기'},
]

<SkipNav links={SKIP_LINKS} />

<Sidebar id="sidebar-navigation" tabIndex={-1} aria-label="컴포넌트 가이드 메뉴">
  ...
</Sidebar>

<main id="main" tabIndex={-1}>
  ...
</main>`

const STYLE_CODE = `className={cn(
  buttonVariants({variant: 'default', size: 'lg'}),
  'z-skiplink border-foreground bg-foreground text-background hover:bg-foreground active:bg-foreground fixed top-3 left-3 -translate-y-20 transition-transform duration-200 ease-out focus:translate-y-0 motion-reduce:transition-none',
)}`

const PROPS_ITEMS = [
    {
        component: 'SkipNav',
        name: 'links',
        type: 'readonly SkipLinkItem[]',
        defaultValue: '-',
        required: true,
        description: '렌더링 순서대로 표시할 페이지 내부 바로가기 목록입니다.',
    },
    {
        component: 'SkipLinkItem',
        rowSpan: 3,
        name: 'href',
        type: 'string',
        defaultValue: '-',
        required: true,
        description: '이동할 페이지 내부 fragment id입니다. 예: #main, #sidebar-navigation.',
    },
    {
        component: 'SkipLinkItem',
        name: 'label',
        type: 'string',
        defaultValue: '-',
        required: true,
        description: '스킵 링크에 표시되고 접근 가능한 이름으로 사용되는 텍스트입니다.',
    },
    {
        component: 'SkipLinkItem',
        name: 'onSelect',
        type: '(event: MouseEvent<HTMLAnchorElement>) => void',
        defaultValue: '-',
        required: false,
        description: 'anchor의 기본 fragment 이동과 함께 실행할 선택 콜백입니다.',
    },
] as const

const SkipNavGuidePage = () => (
    <GuidePageShell
        title="스킵 내비게이션 (SkipNav)"
        description="키보드 사용자가 반복 영역을 건너뛰어 사이드 메뉴나 본문으로 바로 이동할 수 있게 하는 접근성 컴포넌트입니다."
    >
        <section aria-labelledby="skip-nav-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="skip-nav-usage" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    이 컴포넌트 가이드 셸에는 이미 <code className="font-mono">SkipNav</code>가 마운트되어 있습니다.
                    페이지를 새로 연 뒤 <kbd className="font-mono">Tab</kbd> 키를 누르면 화면 상단에 &quot;사이드메뉴
                    바로가기&quot;, &quot;본문 바로가기&quot; 링크가 순서대로 나타납니다.
                </p>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="skip-nav-structure" className="flex flex-col gap-4">
            <div>
                <h2 id="skip-nav-structure" className="typo-h4-bold">
                    구현 기준
                </h2>
            </div>
            <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                <li>
                    버튼 액션이 아니라 페이지 내부 이동이므로{' '}
                    <code className="font-mono">&lt;a href=&quot;#...&quot;&gt;</code>를 사용합니다.
                </li>
                <li>
                    이동 대상은 <code className="font-mono">id</code>와 <code className="font-mono">tabIndex=-1</code>을
                    함께 가져야 키보드 포커스 대상이 됩니다.
                </li>
                <li>
                    평소에는 화면 위로 숨겨져 있고, 키보드 포커스가 들어왔을 때만{' '}
                    <code className="font-mono">focus:translate-y-0</code>으로 나타납니다.
                </li>
                <li>
                    시각 스타일은 Button <code className="font-mono">default/lg</code>를 재사용하되, SkipNav 전용 고대비
                    색은 <code className="font-mono">bg-foreground text-background</code> 표준 슬롯으로 반전합니다.
                </li>
            </ul>
        </section>

        <section aria-labelledby="skip-nav-style" className="flex flex-col gap-4">
            <div>
                <h2 id="skip-nav-style" className="typo-h4-bold">
                    스타일
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Button variant를 상속해 크기·포커스 링·타이포그래피를 맞추고, 위치·표시 전환·고대비 색상만
                    추가합니다.
                </p>
            </div>
            <CodeBlock code={STYLE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="skip-nav-accessibility" className="flex flex-col gap-4">
            <div>
                <h2 id="skip-nav-accessibility" className="typo-h4-bold">
                    접근성
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    반복되는 내비게이션보다 먼저 키보드 포커스를 받아 주요 영역으로 이동할 수 있게 합니다.
                </p>
            </div>
            <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                <li>
                    링크들은 <code>nav[aria-label=&quot;바로가기&quot;]</code> 안에 전달된 배열 순서대로 렌더링됩니다.
                </li>
                <li>
                    실제 사용처는 <code>#sidebar-navigation</code>과 <code>#main</code>을 제공하며 두 대상 모두{' '}
                    <code>tabIndex=-1</code>로 프로그램적 포커스를 받을 수 있습니다.
                </li>
                <li>링크는 실제 텍스트를 포함하므로 별도의 aria-label 없이도 접근 가능한 이름을 가집니다.</li>
                <li>
                    <code>motion-reduce:transition-none</code>으로 모션 감소 설정에서는 위치 전환 애니메이션을
                    제거합니다.
                </li>
                <li>
                    <code>onSelect</code>에서 <code>preventDefault()</code>를 호출하지 않으면 기본 fragment 이동도 함께
                    실행됩니다.
                </li>
            </ul>
        </section>

        <section aria-labelledby="skip-nav-props" className="flex flex-col gap-4">
            <div>
                <h2 id="skip-nav-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">SkipNav 에 넘기는 속성입니다.</p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Props 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Component
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Name
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Type
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Default
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {PROPS_ITEMS.map(({component, name, type, defaultValue, required, description, ...item}) => (
                            <tr
                                key={`${component}-${name}`}
                                className="border-border bg-background border-b last:border-b-0"
                            >
                                {'rowSpan' in item || component === 'SkipNav' ? (
                                    <th
                                        scope="rowgroup"
                                        rowSpan={'rowSpan' in item ? item.rowSpan : undefined}
                                        className="typo-body-l-medium border-border text-primary border-r px-4 py-3 text-left align-top font-mono"
                                    >
                                        {component}
                                    </th>
                                ) : null}
                                <th
                                    scope="row"
                                    className="typo-body-l-regular px-4 py-3 text-left font-mono font-normal whitespace-nowrap"
                                >
                                    {name}
                                    {required ? (
                                        <>
                                            <span aria-hidden="true" className="text-destructive">
                                                *
                                            </span>
                                            <span className="sr-only"> (필수)</span>
                                        </>
                                    ) : null}
                                </th>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono whitespace-nowrap">
                                    {type}
                                </td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    {defaultValue}
                                </td>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </GuidePageShell>
)

export default SkipNavGuidePage
