import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import PropsTable from '@/components/guide/props-table'
import ActionCheckDemo from './action-check-demo'

export const metadata: Metadata = {title: '완료 애니메이션 (ActionCheck)'}

const USAGE_CODE = `import { ActionCheck } from '@/components/custom/action-check';

<ActionCheck aria-label="제출이 완료되었습니다" />`

const DECORATIVE_CODE = `{/* 같은 의미의 완료 문구가 바로 옆에 있으면 장식용으로 처리 */}
<ActionCheck decorative size={96} />`

const PROPS_ITEMS = [
    ['ActionCheck', 'size', '정사각형 애니메이션의 가로·세로 크기를 px 단위로 지정합니다.', '150', 'number'],
    [
        'ActionCheck',
        'aria-label',
        '정보성 애니메이션의 접근 가능한 이름입니다. decorative가 true이면 사용하지 않습니다.',
        "'작업이 완료되었습니다'",
        'string',
    ],
    [
        'ActionCheck',
        'decorative',
        '주변 문구가 같은 완료 의미를 전달할 때 접근성 트리에서 애니메이션을 제외합니다.',
        'false',
        'boolean',
    ],
    [
        'ActionCheck',
        'onAnimationComplete',
        '재생이 끝나 마지막 프레임에 고정됐을 때 호출합니다. 모션 감소 상태에서도 호출됩니다.',
        'undefined',
        '() => void',
    ],
    [
        'ActionCheck',
        'className · div props',
        '래퍼 div에 스타일과 네이티브 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
] as const

const ActionCheckGuidePage = () => (
    <GuidePageShell
        title="완료 애니메이션 (ActionCheck)"
        description="화면 진입 시 한 번 재생하고 체크가 완성된 마지막 프레임에서 멈추는 Lottie 완료 애니메이션입니다."
    >
        <BaseCard>
            <section aria-labelledby="action-check-default" className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h2 id="action-check-default" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        화면에 마운트되면 자동으로 한 번 재생합니다. 완료 후에는 마지막 체크 상태를 유지하며, 버튼으로
                        화면 진입 상황을 다시 확인할 수 있습니다.
                    </p>
                </div>
                <div className="bg-background border-border flex min-h-64 items-center justify-center rounded-xl border p-6">
                    <ActionCheckDemo />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="ActionCheck 기본 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="action-check-accessibility" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="action-check-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        완료 상태를 애니메이션만으로 전달하지 않고 화면의 제목이나 안내 문구와 함께 사용합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-foreground-subtle flex list-disc flex-col gap-2 pl-5">
                    <li>
                        독립적으로 완료 의미를 전달하면 <code className="font-mono">aria-label</code>을 제공합니다.
                    </li>
                    <li>
                        바로 옆 완료 문구와 의미가 중복되면 <code className="font-mono">decorative</code>로 스크린리더의
                        중복 안내를 방지합니다.
                    </li>
                    <li>
                        <code className="font-mono">prefers-reduced-motion: reduce</code>에서는 움직이지 않고 마지막
                        완료 프레임을 즉시 표시합니다.
                    </li>
                </ul>
                <CodeBlock code={DECORATIVE_CODE} language="tsx" copyLabel="ActionCheck 장식용 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="action-check-props" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="action-check-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        재생 방식은 컴포넌트 내부에서 고정하고 화면에서는 크기와 접근성 의미만 지정합니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ActionCheck 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ActionCheckGuidePage
