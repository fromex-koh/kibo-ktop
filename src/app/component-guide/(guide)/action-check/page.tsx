// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import ActionCheckDemo from './action-check-demo'

export const metadata: Metadata = {title: '완료 애니메이션 (ActionCheck)'}

const USAGE_CODE = `import {ActionCheck} from '@/components/custom/action-check'

<ActionCheck aria-label="제출이 완료되었습니다" />`

const DECORATIVE_CODE = `{/* 같은 의미의 완료 문구가 바로 옆에 있으면 장식용으로 처리 */}
<ActionCheck decorative size={96} />`

const PROPS_ITEMS = [
    [
        'ActionCheck',
        'size',
        '정사각형 애니메이션의 한 변을 px 숫자로 지정합니다. 생략하면 size.action-check 토큰(150px)을 쓰고, ViewportFitLayout 안에서는 화면 높이에 맞춰 줄어듭니다.',
        'size.action-check (150px)',
        'number',
    ],
    [
        'ActionCheck',
        'aria-label',
        '애니메이션의 접근 가능한 이름입니다(role="img"). decorative 가 true 이면 무시됩니다.',
        "'작업이 완료되었습니다'",
        'string',
    ],
    [
        'ActionCheck',
        'decorative',
        '옆 문구가 같은 완료 의미를 전달할 때 접근성 트리에서 제외합니다(aria-hidden).',
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
        '래퍼 div 에 전달합니다. children 과 role 은 받지 않습니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
] as const

const ActionCheckGuidePage = () => (
    <GuidePageShell
        title="완료 애니메이션 (ActionCheck)"
        description="화면에 들어오면 한 번 재생하고 체크가 완성된 마지막 프레임에서 멈추는 Lottie 완료 애니메이션입니다."
    >
        <BaseCard>
            <section aria-labelledby="action-check-default" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="action-check-default" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        마운트되면 자동으로 한 번 재생합니다. 색은 현재 테마의 시맨틱 토큰을 읽어 적용하며 테마가 바뀌면
                        다시 그립니다. 재생이 끝나면 <code>onAnimationComplete</code> 가 호출됩니다.
                    </p>
                </div>
                <div className="bg-background border-border flex min-h-64 items-center justify-center rounded-xl border p-6">
                    <ActionCheckDemo />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="ActionCheck 기본 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="action-check-accessibility" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="action-check-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        완료 상태를 애니메이션만으로 전달하지 않고 제목이나 안내 문구와 함께 씁니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        단독으로 완료를 전달하면 <code>aria-label</code> 을 줍니다[5.1.1].
                    </li>
                    <li>
                        바로 옆 문구와 의미가 겹치면 <code>decorative</code> 로 스크린리더의 중복 안내를 막습니다.
                    </li>
                    <li>
                        <code>prefers-reduced-motion: reduce</code> 에서는 움직임 없이 마지막 프레임을 바로 보여
                        줍니다[6.3.1].
                    </li>
                </ul>
                <CodeBlock code={DECORATIVE_CODE} language="tsx" copyLabel="ActionCheck 장식용 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="action-check-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="action-check-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ActionCheck 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ActionCheckGuidePage
