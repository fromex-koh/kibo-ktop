// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ProgressBar} from '@/components/custom/progress-bar'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '진행률 (ProgressBar)'}

const USAGE_CODE = `import {ProgressBar} from '@/components/custom/progress-bar'

<ProgressBar label="사업계획 작성 진행률" value={42.5} indicatorClassName="bg-info" className="max-w-sm" />`

const OPTION_CODE = `{/* 값 텍스트 숨김 · 소수점 없이 표시 */}
<ProgressBar label="업로드 진행률" value={30} max={60} showValue={false} />
<ProgressBar label="작성 진행률" value={42.5} valueFractionDigits={0} />`

const PROPS_ITEMS = [
    ['ProgressBar', 'label', '진행 대상을 알리는 접근 가능한 이름입니다.', '-', 'string'],
    ['ProgressBar', 'value', '현재 값입니다. 0 ~ max 범위로 보정됩니다.', '-', 'number'],
    ['ProgressBar', 'max', '완료를 뜻하는 최댓값입니다. 1 미만이면 1 로 보정됩니다.', '100', 'number'],
    ['ProgressBar', 'showValue', '막대 위에 백분율 텍스트를 보입니다.', 'true', 'boolean'],
    ['ProgressBar', 'valueFractionDigits', '백분율 소수점 자릿수입니다. 0 ~ 6 범위로 보정됩니다.', '1', 'number'],
    ['ProgressBar', 'indicatorClassName', '채워지는 막대에 덧붙일 클래스입니다. 예: bg-info', 'undefined', 'string'],
    ['ProgressBar', 'trackClassName', '배경 띠의 굵기·색을 바꿀 클래스입니다.', 'undefined', 'string'],
    ['ProgressBar', 'className', '래퍼에 덧붙일 클래스입니다.', 'undefined', 'string'],
    [
        'ProgressBar',
        '...props',
        '나머지 div 속성을 전달합니다.',
        '-',
        "Omit<ComponentPropsWithoutRef<'div'>, 'children'>",
    ],
] as const

const ProgressBarGuidePage = () => (
    <GuidePageShell
        title="진행률 (ProgressBar)"
        description="현재 값을 백분율 텍스트와 막대로 함께 보여 주는 진행률 표시입니다."
    >
        <BaseCard>
            <section aria-labelledby="progress-bar-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="progress-bar-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>value</code> 와 <code>max</code> 로 비율을 계산해 텍스트와 스크린리더 값을 함께
                        갱신합니다. 막대는 기본 <code>bg-primary</code> 이고 <code>indicatorClassName</code> 으로 시맨틱
                        배경색을 바꿉니다.
                    </p>
                </div>
                <div className="bg-background border-border flex justify-center rounded-xl border p-6">
                    <ProgressBar
                        label="사업계획 작성 진행률"
                        value={42.5}
                        indicatorClassName="bg-info"
                        className="max-w-sm"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="progress-bar-options" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="progress-bar-options" className="typo-h4-bold">
                        표시 옵션
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        백분율 텍스트를 숨기거나 소수점 자릿수를 바꿀 수 있습니다.
                    </p>
                </div>
                <div className="bg-background border-border flex flex-col gap-6 rounded-xl border p-6">
                    <ProgressBar label="업로드 진행률" value={30} max={60} showValue={false} className="max-w-sm" />
                    <ProgressBar label="작성 진행률" value={42.5} valueFractionDigits={0} className="max-w-sm" />
                </div>
                <CodeBlock code={OPTION_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="progress-bar-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="progress-bar-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        Radix Progress 의 <code>role=&quot;progressbar&quot;</code> 에 <code>label</code> 이{' '}
                        <code>aria-label</code>, 백분율이 <code>aria-valuetext</code> 로 연결됩니다[8.2.1].
                    </li>
                    <li>
                        화면의 백분율 텍스트는 중복 낭독을 막으려 <code>aria-hidden</code> 입니다.
                    </li>
                    <li>
                        값은 숫자로도 표시되므로 색만으로 진행 정도를 전하지 않습니다[5.3.1]. 숨기려면 주변에 값을
                        텍스트로 제공합니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="progress-bar-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="progress-bar-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>label</code> 과 <code>value</code> 가 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ProgressBar Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ProgressBarGuidePage
