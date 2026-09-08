import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import TextTabsDemo from './text-tabs-demo'

export const metadata: Metadata = {title: '텍스트 탭 (TextTabs)'}

const USAGE_CODE = `const [model, setModel] = useState('ktrs-fm')
const panelId = useId()

<TextTabs
  items={MODEL_TABS}
  value={model}
  onValueChange={setModel}
  label="평가 모형"
  panelId={panelId}
/>

<div id={panelId} role="tabpanel">
  {/* 고른 탭에 따라 바뀌는 영역 */}
</div>`

const PROPS_ITEMS = [
    ['TextTabs', 'items', '탭 목록입니다. 각 항목은 value 와 label 을 갖습니다.', '-', 'readonly TextTabItem[]'],
    ['TextTabs', 'value', '지금 고른 탭의 value 입니다.', '-', 'string'],
    ['TextTabs', 'onValueChange', '탭을 고르거나 화살표로 옮겼을 때 부릅니다.', '-', '(value: string) => void'],
    ['TextTabs', 'label', '이 탭 묶음이 무엇을 고르는지 — 스크린리더가 읽을 이름입니다.', '-', 'string'],
    ['TextTabs', 'panelId', '탭이 바꾸는 영역의 id 입니다. 그 영역에는 role="tabpanel" 을 둡니다.', '-', 'string'],
    ['TextTabs', 'className', '자리에서 정할 배치 조정입니다.', 'undefined', 'string'],
    ['TextTabItem', 'value', '탭을 구분하는 값입니다.', '-', 'string'],
    ['TextTabItem', 'label', '화면에 보이는 글자입니다.', '-', 'string'],
] as const

const TextTabsGuidePage = () => (
    <GuidePageShell
        title="텍스트 탭 (TextTabs)"
        description="면이나 밑줄 없이 글자만으로 고르는 탭입니다. 고를 것이 서너 개뿐이라 펼치지 않고 바로 늘어놓는 자리에 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="text-tabs-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="text-tabs-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        고른 항목은 진한 글자, 나머지는 옅은 글자입니다. 좌우 화살표로 옮길 수 있고 탭 묶음에는 포커스가
                        한 번만 들어갑니다.
                    </p>
                </div>
                <TextTabsDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="text-tabs-a11y" className="flex flex-col gap-3">
                <h2 id="text-tabs-a11y" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        색만으로는 무엇이 골라졌는지 전해지지 않으므로 <code className="font-mono">aria-selected</code>{' '}
                        로 함께 알립니다[5.3.1 · 8.2.1].
                    </li>
                    <li>
                        <kbd>←</kbd> <kbd>→</kbd> 로 탭을 옮기고 <kbd>Home</kbd> <kbd>End</kbd> 로 처음·끝으로 갑니다.
                        탭 묶음에는 포커스가 한 번만 들어갑니다(roving tabindex).
                    </li>
                    <li>
                        고른 값이 무엇을 바꾸는지는 <code className="font-mono">aria-controls</code> 로 잇습니다 —
                        바뀌는 영역에 <code className="font-mono">role=&quot;tabpanel&quot;</code> 과 그 id 를 둡니다.
                    </li>
                    <li>
                        포커스는 <code className="font-mono">focus-visible</code> 외곽선으로 표시합니다 — 글자만 있는
                        탭이라 외곽선이 없으면 어디에 있는지 알 수 없습니다[6.1.2].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="text-tabs-props" className="flex flex-col gap-4">
                <h2 id="text-tabs-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="TextTabs Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default TextTabsGuidePage
