// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import ThemeToggle from '@/components/composite/theme-toggle'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'

export const metadata: Metadata = {title: '테마 토글 (ThemeToggle)'}

const USAGE_CODE = `import ThemeToggle from '@/components/composite/theme-toggle'

<ThemeToggle />`

const ThemeToggleGuidePage = () => (
    <GuidePageShell
        title="테마 토글 (ThemeToggle)"
        description="라이트 · 다크를 수동으로 바꾸는 아이콘 버튼입니다. 가이드 앱바처럼 버튼 면이 필요한 자리에서 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="theme-toggle-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="theme-toggle-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        넘기는 props 가 없습니다. 상태와 라벨은 <code>useThemeToggle</code> 훅이 담당하고, 컴포넌트는{' '}
                        <code>Button variant=&quot;ghost&quot; size=&quot;icon&quot;</code> 으로 생김새만 정합니다.
                        헤더는 아이콘만 두므로 이 컴포넌트 대신 훅을 직접 씁니다.
                    </p>
                </div>
                <div className="bg-card border-border flex items-center gap-4 rounded-lg border p-6">
                    <ThemeToggle />
                    <p className="typo-body-l-regular text-label-foreground">눌러 보면 이 화면의 테마가 바뀝니다.</p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="theme-toggle-behavior" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="theme-toggle-behavior" className="typo-h4-bold">
                        동작
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        아이콘은 현재 상태가 아니라 전환될 모드를 보여 줍니다. 라이트에서는 달, 다크에서는 해입니다.
                    </li>
                    <li>
                        마운트 전에는 버튼과 같은 크기의 자리표시자를 그려 하이드레이션 불일치와 레이아웃 시프트를
                        막습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="theme-toggle-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="theme-toggle-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        아이콘만 보이므로 <code>aria-label</code> 로 전환 결과(&quot;다크 모드로 전환&quot;)를 알리고
                        내부 아이콘은 <code>aria-hidden=&quot;true&quot;</code> 입니다[5.1.1].
                    </li>
                    <li>
                        같은 문구를 <code>title</code> 로도 두어 마우스 사용자에게 보입니다.
                    </li>
                    <li>
                        <code>button</code> 이라 <kbd>Tab</kbd> 으로 포커스하고 <kbd>Enter</kbd> / <kbd>Space</kbd> 로
                        실행합니다[6.1.1].
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ThemeToggleGuidePage
