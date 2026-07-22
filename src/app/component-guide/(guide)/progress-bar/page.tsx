import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ProgressBar} from '@/components/custom/progress-bar'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '진행률 (ProgressBar)'}

const USAGE_CODE = `import {ProgressBar} from '@/components/custom/progress-bar';

export default function CompletionRate() {
  return (
    <ProgressBar
      label="사업계획 작성 진행률"
      value={42.5}
      valueFractionDigits={1}
      indicatorClassName="bg-info"
      className="max-w-sm"
    />
  );
}`

const PROPS_ITEMS = [
    [
        'ProgressBar',
        'label',
        '스크린리더가 진행 대상과 의미를 알 수 있도록 제공하는 접근 가능한 이름입니다.',
        '-',
        'string',
    ],
    ['ProgressBar', 'value', '현재 진행 값을 전달하며 0과 max 사이로 자동 보정합니다.', '-', 'number'],
    ['ProgressBar', 'max', '진행 완료를 나타내는 최댓값입니다.', '100', 'number'],
    [
        'ProgressBar',
        'indicatorClassName',
        'indicator에 적용할 semantic 배경 유틸리티 클래스를 전달합니다. 예: bg-info, bg-success',
        'bg-primary',
        'string',
    ],
    ['ProgressBar', 'showValue', '프로그레스바 위에 백분율 텍스트를 표시합니다.', 'true', 'boolean'],
    ['ProgressBar', 'valueFractionDigits', '표시하는 백분율의 소수점 자릿수를 지정합니다.', '1', 'number'],
    [
        'ProgressBar',
        'className · div props',
        '래퍼의 너비·배치 스타일과 네이티브 div 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
] as const

const ProgressBarGuidePage = () => (
    <GuidePageShell
        title="진행률 (ProgressBar)"
        description="현재 값을 백분율 텍스트와 막대로 함께 전달하는 진행률 컴포넌트입니다. Radix Progress primitive의 접근성 속성을 유지합니다."
    >
        <BaseCard>
            <section aria-labelledby="progress-bar-default" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="progress-bar-default" className="typo-h4-bold">
                        기본
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        value와 max를 전달하면 표시 비율을 자동 계산하며 화면 텍스트와 스크린리더 값이 함께 갱신됩니다.
                    </p>
                </div>
                <div className="bg-background border-border flex justify-center rounded-xl border p-6">
                    <ProgressBar
                        label="사업계획 작성 진행률"
                        value={42.5}
                        valueFractionDigits={1}
                        indicatorClassName="bg-info"
                        className="max-w-sm"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="progress-bar-props" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="progress-bar-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        진행 값과 접근 가능한 이름을 필수로 전달하고 나머지 표시 형식은 선택적으로 조정합니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ProgressBar Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ProgressBarGuidePage
