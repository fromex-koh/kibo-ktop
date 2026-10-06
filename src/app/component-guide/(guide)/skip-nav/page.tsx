// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '스킵 내비게이션 (SkipNav)'}

const SECTION_HEADER = 'flex max-w-4xl flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'

const USAGE_CODE = `import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'

const SKIP_LINKS: readonly SkipLinkItem[] = [
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

const PROPS_ITEMS = [
    ['SkipNav', 'links', '바로가기 목록입니다(필수). 넘긴 순서대로 놓입니다.', '-', 'readonly SkipLinkItem[]'],
    ['SkipLinkItem', 'href', '이동할 대상의 id 입니다(필수). 예: #main', '-', 'string'],
    ['SkipLinkItem', 'label', '링크에 보이는 글자입니다(필수).', '-', 'string'],
    [
        'SkipLinkItem',
        'onSelect',
        '링크를 눌렀을 때 함께 부를 동작입니다. preventDefault() 를 부르지 않으면 대상으로도 이동합니다.',
        '-',
        '(event: MouseEvent<HTMLAnchorElement>) => void',
    ],
] as const

const SkipNavGuidePage = () => (
    <GuidePageShell
        title="스킵 내비게이션 (SkipNav)"
        description="키보드 사용자가 반복 영역을 건너뛰어 사이드 메뉴나 본문으로 바로 이동하게 하는 바로가기 링크입니다."
    >
        <BaseCard>
            <section aria-labelledby="skip-nav-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="skip-nav-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        페이지 맨 앞에 두고 <code>links</code> 로 바로가기 목록을 넘깁니다. 레이아웃(
                        <code>MainPageLayout</code> · <code>SubPageLayout</code> · <code>SidebarLayout</code>)에는 이미
                        들어 있으므로 이 레이아웃을 쓰는 화면에서는 다시 넣지 않습니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">동작</h3>
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                링크는 평소 화면 밖에 있다가 키보드 포커스를 받으면 왼쪽 위에 나타납니다. 모양은{' '}
                                <code>Button</code> default · md 입니다.
                            </li>
                            <li>
                                이동 대상에는 <code>href</code> 와 같은 <code>id</code> 와{' '}
                                <code>tabIndex={'{-1}'}</code> 을 함께 줍니다.
                            </li>
                        </ul>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">직접 확인</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            이 가이드 화면에도 들어 있습니다. 페이지를 새로 연 뒤 <kbd>Tab</kbd> 키를 누르면
                            &quot;사이드메뉴 바로가기&quot;, &quot;본문 바로가기&quot; 링크가 순서대로 나타납니다. macOS
                            Safari 에서는 설정 → 고급 → &quot;Tab 키를 눌러 웹 페이지의 각 항목 강조 표시&quot;를 켜야
                            Tab 으로 링크에 닿습니다.
                        </p>
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="skip-nav-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="skip-nav-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        컴포넌트가 처리하는 것과 사용처가 지킬 것을 나눠 적습니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        반복 영역 건너뛰기를 제공합니다[6.4.1]. 사용처는 <code>SkipNav</code> 를 헤더 · 메뉴보다 앞에
                        둡니다.
                    </li>
                    <li>
                        링크는 <code>nav</code>(이름 &quot;바로가기&quot;) 안에 놓이고 <code>label</code> 이 링크 이름이
                        됩니다. 목적지가 드러나는 글자를 씁니다[6.4.3].
                    </li>
                    <li>
                        포커스를 받으면 화면에 나타나며, 고대비 반전 색으로 표시됩니다[6.1.2][5.3.3]. 모션 감소
                        설정에서는 전환 효과가 꺼집니다[6.3.1].
                    </li>
                    <li>
                        사용처는 이동 대상에 <code>id</code> 와 <code>tabIndex={'{-1}'}</code> 을 줍니다. 그래야 이동 뒤
                        포커스가 대상에서 이어집니다[6.1.2].
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="skip-nav-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="skip-nav-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SkipNav Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SkipNavGuidePage
