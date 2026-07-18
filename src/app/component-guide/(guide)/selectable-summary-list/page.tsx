import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {
    SelectableSummaryListDisabledDemo,
    SelectableSummaryListFormCardDemo,
    SelectableSummaryListUsageDemo,
} from './selectable-summary-list-demo'

export const metadata: Metadata = {title: '선택 가능한 요약 목록 (SelectableSummaryList)'}

const USAGE_CODE = `{/* 하나만 선택 — SelectableCard 와 같은 파란 테두리+연한 배경으로 강조된다. 강조는
    controlled value 로만 반영되므로 value/onValueChange 로 상태를 들고 있어야 한다 */}
<SelectableSummaryListGroup value={value} onValueChange={setValue}>
  <SelectableSummaryList value="promx">
    <SummaryListItem term="기업명">프롬엑스테크</SummaryListItem>
    <SummaryListItem term="법인번호">110111-1234567</SummaryListItem>
    <SummaryListItem term="특허수">12건</SummaryListItem>
  </SelectableSummaryList>
  <SelectableSummaryList value="neo-energy">
    <SummaryListItem term="기업명">네오에너지솔루션</SummaryListItem>
    <SummaryListItem term="법인번호">220222-9876543</SummaryListItem>
    <SummaryListItem term="특허수">7건</SummaryListItem>
  </SelectableSummaryList>
</SelectableSummaryListGroup>`

const DISABLED_CODE = `{/* disabled — 상호작용·포커스를 막고 카드를 흐리게 표시 */}
<SelectableSummaryListGroup value={value} onValueChange={setValue}>
  <SelectableSummaryList value="promx">
    <SummaryListItem term="기업명">프롬엑스테크</SummaryListItem>
    <SummaryListItem term="법인번호">110111-1234567</SummaryListItem>
  </SelectableSummaryList>
  <SelectableSummaryList value="neo-energy" disabled>
    <SummaryListItem term="기업명">네오에너지솔루션</SummaryListItem>
    <SummaryListItem term="법인번호">220222-9876543</SummaryListItem>
  </SelectableSummaryList>
</SelectableSummaryListGroup>`

const FORM_CARD_CODE = `{/* FormCard(헤더 내장 카드) 본문에 넣어 실제 화면처럼 배치 */}
<FormCard title="기업 선택">
  <SelectableSummaryListGroup value={value} onValueChange={setValue} aria-label="기업 선택">
    <SelectableSummaryList value="promx">{/* … */}</SelectableSummaryList>
    <SelectableSummaryList value="neo-energy">{/* … */}</SelectableSummaryList>
  </SelectableSummaryListGroup>
</FormCard>`

// 조합 API 설명 — [컴포넌트, 이름, 설명, 기본값, 타입]
const PROPS_ITEMS = [
    [
        'SelectableSummaryListGroup',
        'value · onValueChange',
        '선택값과 변경 함수를 전달합니다. 카드 강조까지 동기화하려면 제어 방식으로 사용합니다.',
        'undefined',
        'string · (value: string) => void',
    ],
    ['SelectableSummaryListGroup', 'children', 'SelectableSummaryList 카드 목록입니다.', '-', 'ReactNode'],
    [
        'SelectableSummaryListGroup',
        'aria-label',
        '화면에 그룹 제목이 없을 때 라디오 그룹의 접근 가능한 이름을 제공합니다.',
        'undefined',
        'string',
    ],
    [
        'SelectableSummaryListGroup',
        'className · RadioGroup props',
        '그룹 스타일과 ui RadioGroup 속성을 전달합니다.',
        'undefined',
        'ComponentProps<typeof RadioGroup>',
    ],
    ['SelectableSummaryList', 'value', '라디오 그룹에서 카드를 식별하는 필수 값입니다.', '-', 'string'],
    ['SelectableSummaryList', 'children', '카드 안에 표시할 SummaryListItem 목록입니다.', '-', 'ReactNode'],
    [
        'SelectableSummaryList',
        'disabled',
        '카드의 선택과 포커스를 막고 비활성 스타일을 적용합니다.',
        'false',
        'boolean',
    ],
    ['SelectableSummaryList', 'id', '내부 라디오 컨트롤에 전달할 식별자입니다.', 'undefined', 'string'],
    ['SelectableSummaryList', 'className', '개별 카드의 추가 스타일입니다.', 'undefined', 'string'],
] as const

const PropsTable = ({
    items,
    caption,
}: {
    items: readonly (readonly [string, string, string, string, string])[]
    caption: string
}) => (
    <div className="border-border overflow-x-auto rounded-xl border">
        <table className="w-full text-left">
            <caption className="sr-only">{caption}</caption>
            <thead>
                <tr className="border-border bg-card border-b">
                    <th scope="col" className="typo-body-l-medium px-4 py-3">
                        Component
                    </th>
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
                {items.map(([component, name, description, defaultValue, type]) => (
                    <tr key={`${component}-${name}`} className="border-border border-b last:border-b-0">
                        <td className="typo-body-l-regular text-foreground px-4 py-3 font-mono">{component}</td>
                        <th scope="row" className="typo-body-l-medium text-primary-strong px-4 py-3 font-mono">
                            {name}
                        </th>
                        <td className="typo-body-l-regular text-foreground-subtle px-4 py-3">{description}</td>
                        <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                            {defaultValue}
                        </td>
                        <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">{type}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)

// 선택 가능한 요약 목록 — 기존 SelectableCard(라디오 선택 강조) + SummaryList(라벨·값 목록)를 조립한
// L2 composite. Figma "리스트"(기업 선택 카드) 반영.
const SelectableSummaryListGuidePage = () => (
    <GuidePageShell
        title="선택 가능한 요약 목록 (SelectableSummaryList)"
        description="여러 항목(기업 등) 중 하나를 라디오로 고르는 카드형 리스트입니다. 카드 위쪽에 라디오, 그 아래 라벨+값 목록(SummaryList)이 오고, 선택되면 SelectableCard 와 같은 파란 테두리+연한 배경으로 강조됩니다. 기존 SelectableCard·SummaryList 를 새로 만들지 않고 조립했습니다."
    >
        <section aria-labelledby="ssl-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="ssl-usage" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    카드 어디를 눌러도(<code className="font-mono">{'<label>'}</code>) 선택됩니다. 직접 눌러 다른
                    기업으로 바꿔 보세요 — 하나만 선택됩니다.
                </p>
            </div>
            <SelectableSummaryListUsageDemo />
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="ssl-disabled" className="flex flex-col gap-4">
            <div>
                <h2 id="ssl-disabled" className="typo-h4-bold">
                    비활성 (disabled)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">disabled</code> 를 주면 해당 카드는 고를 수 없고 흐리게 표시됩니다(예:
                    이미 등록된 기업이라 재선택 불가).
                </p>
            </div>
            <SelectableSummaryListDisabledDemo />
            <CodeBlock code={DISABLED_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="ssl-form-card" className="flex flex-col gap-4">
            <div>
                <h2 id="ssl-form-card" className="typo-h4-bold">
                    FormCard 안에서 사용
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    실제 화면처럼 <code className="font-mono">FormCard</code>(헤더 내장 카드) 본문에 넣어 &quot;기업
                    선택&quot; 같은 제목과 함께 배치합니다.
                </p>
            </div>
            <SelectableSummaryListFormCardDemo />
            <CodeBlock code={FORM_CARD_CODE} language="tsx" copyLabel="복사" />
        </section>

        <BaseCard>
            <section aria-labelledby="ssl-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="ssl-composition" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        그룹은 ui RadioGroup의 제어 속성을 전달하고, 개별 카드는 선택값과 표시할 요약 행을 받습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SelectableSummaryList 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SelectableSummaryListGuidePage
