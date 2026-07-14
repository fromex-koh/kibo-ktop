import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {
    SelectableDescriptionListDisabledDemo,
    SelectableDescriptionListFormCardDemo,
    SelectableDescriptionListUsageDemo,
} from './selectable-description-list-demo'

export const metadata: Metadata = {title: '선택 가능한 설명 목록 (SelectableDescriptionList)'}

const USAGE_CODE = `{/* 하나만 선택 — SelectableCard 와 같은 파란 테두리+연한 배경으로 강조된다. 강조는
    controlled value 로만 반영되므로 value/onValueChange 로 상태를 들고 있어야 한다 */}
<SelectableDescriptionListGroup value={value} onValueChange={setValue}>
  <SelectableDescriptionList value="promx">
    <DescriptionListItem term="기업명">프롬엑스테크</DescriptionListItem>
    <DescriptionListItem term="법인번호">110111-1234567</DescriptionListItem>
    <DescriptionListItem term="특허수">12건</DescriptionListItem>
  </SelectableDescriptionList>
  <SelectableDescriptionList value="neo-energy">
    <DescriptionListItem term="기업명">네오에너지솔루션</DescriptionListItem>
    <DescriptionListItem term="법인번호">220222-9876543</DescriptionListItem>
    <DescriptionListItem term="특허수">7건</DescriptionListItem>
  </SelectableDescriptionList>
</SelectableDescriptionListGroup>`

const DISABLED_CODE = `{/* disabled — 상호작용·포커스를 막고 카드를 흐리게 표시 */}
<SelectableDescriptionListGroup value={value} onValueChange={setValue}>
  <SelectableDescriptionList value="promx">
    <DescriptionListItem term="기업명">프롬엑스테크</DescriptionListItem>
    <DescriptionListItem term="법인번호">110111-1234567</DescriptionListItem>
  </SelectableDescriptionList>
  <SelectableDescriptionList value="neo-energy" disabled>
    <DescriptionListItem term="기업명">네오에너지솔루션</DescriptionListItem>
    <DescriptionListItem term="법인번호">220222-9876543</DescriptionListItem>
  </SelectableDescriptionList>
</SelectableDescriptionListGroup>`

const FORM_CARD_CODE = `{/* FormCard(헤더 내장 카드) 본문에 넣어 실제 화면처럼 배치 */}
<FormCard title="기업 선택">
  <SelectableDescriptionListGroup value={value} onValueChange={setValue} aria-label="기업 선택">
    <SelectableDescriptionList value="promx">{/* … */}</SelectableDescriptionList>
    <SelectableDescriptionList value="neo-energy">{/* … */}</SelectableDescriptionList>
  </SelectableDescriptionListGroup>
</FormCard>`

// 조합 API 설명 — [이름, 설명]
const COMPOSITION = [
    [
        'SelectableDescriptionListGroup',
        '카드들을 감싸는 라디오 그룹(kit RadioGroup). value+onValueChange 로 제어한다(선택 강조가 controlled value 에만 반영되므로 defaultValue 단독으론 강조되지 않는다). 하나만 선택.',
    ],
    [
        'SelectableDescriptionList',
        '개별 선택 카드. value 로 식별. 안에 DescriptionListItem 을 넣는다. 선택되면 파란 테두리(2px)+연한 파란 배경으로 강조.',
    ],
    ['DescriptionListItem', 'DescriptionList 와 동일한 개별 행(라벨+값). 재사용된다.'],
] as const

// 선택 가능한 설명 목록 — 기존 SelectableCard(라디오 선택 강조) + DescriptionList(라벨·값 목록)를 조립한
// L2 composite. Figma "리스트"(기업 선택 카드) 반영.
const SelectableDescriptionListGuidePage = () => (
    <GuidePageShell
        title="선택 가능한 설명 목록 (SelectableDescriptionList)"
        description="여러 항목(기업 등) 중 하나를 라디오로 고르는 카드형 리스트입니다. 카드 위쪽에 라디오, 그 아래 라벨+값 목록(DescriptionList)이 오고, 선택되면 SelectableCard 와 같은 파란 테두리+연한 배경으로 강조됩니다. 기존 SelectableCard·DescriptionList 를 새로 만들지 않고 조립했습니다."
    >
        <section aria-labelledby="sdl-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="sdl-usage" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    카드 어디를 눌러도(<code className="font-mono">{'<label>'}</code>) 선택됩니다. 직접 눌러 다른
                    기업으로 바꿔 보세요 — 하나만 선택됩니다.
                </p>
            </div>
            <SelectableDescriptionListUsageDemo />
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="sdl-disabled" className="flex flex-col gap-4">
            <div>
                <h2 id="sdl-disabled" className="typo-h4-bold">
                    비활성 (disabled)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">disabled</code> 를 주면 해당 카드는 고를 수 없고 흐리게 표시됩니다(예:
                    이미 등록된 기업이라 재선택 불가).
                </p>
            </div>
            <SelectableDescriptionListDisabledDemo />
            <CodeBlock code={DISABLED_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="sdl-form-card" className="flex flex-col gap-4">
            <div>
                <h2 id="sdl-form-card" className="typo-h4-bold">
                    FormCard 안에서 사용
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    실제 화면처럼 <code className="font-mono">FormCard</code>(헤더 내장 카드) 본문에 넣어 &quot;기업
                    선택&quot; 같은 제목과 함께 배치합니다.
                </p>
            </div>
            <SelectableDescriptionListFormCardDemo />
            <CodeBlock code={FORM_CARD_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="sdl-composition" className="flex flex-col gap-4">
            <div>
                <h2 id="sdl-composition" className="typo-h4-bold">
                    구성
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">그룹과 개별 카드, 그리고 행으로 이뤄집니다.</p>
            </div>
            <dl className="flex flex-col gap-2">
                {COMPOSITION.map(([name, desc]) => (
                    <div key={name} className="flex flex-col gap-0.5">
                        <dt className="typo-body-l-medium text-primary font-mono">{name}</dt>
                        <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                    </div>
                ))}
            </dl>
        </section>
    </GuidePageShell>
)

export default SelectableDescriptionListGuidePage
