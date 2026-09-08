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
        description="라이트·다크를 손으로 바꾸는 아이콘 버튼입니다. 이 가이드 앱바처럼 버튼 면이 있어야 하는 자리에서 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="theme-toggle-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="theme-toggle-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        넘기는 값이 없습니다. 상태와 라벨은 <code className="font-mono">useThemeToggle</code> 이
                        담당하고 이 컴포넌트는 생김새만 정합니다.
                    </p>
                </div>
                <div className="bg-card border-border flex items-center gap-4 rounded-lg border p-6">
                    <ThemeToggle />
                    <p className="typo-body-l-regular text-muted-foreground">눌러 보면 이 화면의 테마가 바뀝니다.</p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="theme-toggle-rule" className="flex flex-col gap-3">
                <h2 id="theme-toggle-rule" className="typo-h4-bold">
                    구현 기준
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        Button <code className="font-mono">variant=&quot;ghost&quot; size=&quot;icon&quot;</code> 을
                        감싼 도메인 컴포넌트입니다. 헤더는 시안대로 아이콘만 두므로 이 컴포넌트를 쓰지 않습니다.
                    </li>
                    <li>
                        아이콘은 현재 상태가 아니라 <strong className="text-foreground">전환될 모드</strong>를 보여
                        줍니다 — 라이트에서는 달, 다크에서는 해입니다.
                    </li>
                    <li>
                        마운트 전에는 같은 크기(44px)의 자리표시자로 그려 하이드레이션 불일치와 레이아웃 시프트를
                        막습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="theme-toggle-a11y" className="flex flex-col gap-3">
                <h2 id="theme-toggle-a11y" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        아이콘만 보이므로 <code className="font-mono">aria-label</code> 로 기능을 알리고 내부 아이콘은{' '}
                        <code className="font-mono">aria-hidden</code> 입니다[5.1.1].
                    </li>
                    <li>
                        같은 문구를 <code className="font-mono">title</code> 로도 두어 마우스 사용자에게도 보입니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ThemeToggleGuidePage
