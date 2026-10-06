// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {
    SelectableSummaryListDisabledDemo,
    SelectableSummaryListFormCardDemo,
    SelectableSummaryListUsageDemo,
} from './selectable-summary-list-demo'

export const metadata: Metadata = {title: '선택 가능한 요약 목록 (SelectableSummaryList)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {SummaryListItem} from '@/components/composite/summary-list'
import {SelectableSummaryList, SelectableSummaryListGroup} from '@/components/composite/selectable-summary-list'

const [value, setValue] = useState('promx')

<SelectableSummaryListGroup value={value} onValueChange={setValue} aria-label="기업 선택">
  <SelectableSummaryList value="promx">
    <SummaryListItem term="기업명">프롬엑스테크</SummaryListItem>
    <SummaryListItem term="법인번호">110111-1234567</SummaryListItem>
  </SelectableSummaryList>
  <SelectableSummaryList value="neo-energy">
    <SummaryListItem term="기업명">네오에너지솔루션</SummaryListItem>
    <SummaryListItem term="법인번호">220222-9876543</SummaryListItem>
  </SelectableSummaryList>
</SelectableSummaryListGroup>`

const DISABLED_CODE = `<SelectableSummaryListGroup value={value} onValueChange={setValue}>
  <SelectableSummaryList value="promx">
    <SummaryListItem term="기업명">프롬엑스테크</SummaryListItem>
    <SummaryListItem term="법인번호">110111-1234567</SummaryListItem>
  </SelectableSummaryList>
  <SelectableSummaryList value="neo-energy" disabled>
    <SummaryListItem term="기업명">네오에너지솔루션</SummaryListItem>
    <SummaryListItem term="법인번호">220222-9876543</SummaryListItem>
  </SelectableSummaryList>
</SelectableSummaryListGroup>`

const FORM_CARD_CODE = `<FormCard title="기업 선택">
  <SelectableSummaryListGroup value={value} onValueChange={setValue} aria-label="기업 선택">
    <SelectableSummaryList value="promx">{/* … */}</SelectableSummaryList>
    <SelectableSummaryList value="neo-energy">{/* … */}</SelectableSummaryList>
  </SelectableSummaryListGroup>
</FormCard>`

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'selectable-summary-list',
        cells: [
            '라벨·값 요약을 보고 여럿 중 하나를 고름',
            <code key="component">SelectableSummaryList</code>,
            '라디오 한 개와 라벨·값 목록이 한 카드에 담깁니다. 카드 전체가 라벨이라 어디를 눌러도 선택됩니다.',
        ],
    },
    {
        key: 'summary-list',
        cells: [
            '선택 없이 요약 정보만 보여 줌',
            <Link key="component" href="/component-guide/summary-list" className={LINK_CLASS}>
                SummaryList
            </Link>,
            '읽기 전용 <dl> 입니다. 이 컴포넌트의 카드 박스 스타일이 여기서 왔습니다.',
        ],
    },
    {
        key: 'selectable-card',
        cells: [
            '제목·설명이 있는 카드 중 하나를 고름',
            <Link key="component" href="/component-guide/selectable-card" className={LINK_CLASS}>
                SelectableCard
            </Link>,
            '선택 강조는 같고, 카드 안 내용이 라벨·값 목록이 아닐 때 씁니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'SelectableSummaryListGroup',
        'value',
        '선택된 항목의 value 입니다. 카드 강조가 이 값을 따르므로 제어 방식으로 씁니다.',
        'undefined',
        'string',
    ],
    [
        'SelectableSummaryListGroup',
        'onValueChange',
        '선택이 바뀔 때 호출됩니다.',
        'undefined',
        '(value: string) => void',
    ],
    [
        'SelectableSummaryListGroup',
        'aria-label',
        '화면에 그룹 제목이 없을 때 라디오 그룹의 이름입니다.',
        'undefined',
        'string',
    ],
    [
        'SelectableSummaryListGroup',
        'className · 나머지',
        'ui RadioGroup 의 속성을 그대로 받습니다. 기본은 한 열, md 부터 두 열 격자입니다.',
        'undefined',
        'ComponentProps<typeof RadioGroup>',
    ],
    ['SelectableSummaryList', 'value', '그룹 안에서 카드를 구분하는 값입니다.', '-', 'string'],
    ['SelectableSummaryList', 'children', '카드 안에 놓을 SummaryListItem 들입니다.', '-', 'ReactNode'],
    ['SelectableSummaryList', 'disabled', '선택과 포커스를 막고 비활성 스타일로 그립니다.', 'false', 'boolean'],
    ['SelectableSummaryList', 'id', '내부 라디오에 줄 id 입니다.', 'undefined', 'string'],
    ['SelectableSummaryList', 'className', '카드에 덧붙일 클래스입니다.', 'undefined', 'string'],
] as const

const SUB_BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const SUB_LIST = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'

const SelectableSummaryListGuidePage = () => (
    <GuidePageShell
        title="선택 가능한 요약 목록 (SelectableSummaryList)"
        description="라벨·값 요약 카드 여럿 중 하나를 라디오로 고르는 목록입니다. 선택된 카드는 파란 테두리와 연한 배경으로 강조됩니다."
    >
        <BaseCard>
            <section aria-labelledby="ssl-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ssl-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>SelectableSummaryListGroup</code> 에 <code>value</code> · <code>onValueChange</code> 를
                        넘겨 선택값을 관리하고, 카드마다 <code>SelectableSummaryList</code> 와{' '}
                        <code>SummaryListItem</code> 을 둡니다. 카드 어디를 눌러도 선택되며 하나만 선택됩니다.
                    </p>
                </div>
                <SelectableSummaryListUsageDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssl-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ssl-variants" className="typo-h4-bold">
                        상태·배치 예시
                    </h2>
                </div>
                <div className={SUB_LIST}>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">비활성 (disabled)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>disabled</code> 카드는 고를 수 없고 포커스되지 않으며 흐리게 표시됩니다.
                        </p>
                        <SelectableSummaryListDisabledDemo />
                        <CodeBlock code={DISABLED_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">FormCard 안에서 사용</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            제목이 있는 <code>FormCard</code> 본문에 넣어 쓰는 실제 화면 배치입니다.
                        </p>
                        <SelectableSummaryListFormCardDemo />
                        <CodeBlock code={FORM_CARD_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssl-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ssl-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">카드 안 내용과 선택 여부로 고릅니다.</p>
                </div>
                <Table
                    caption="SelectableSummaryList · SummaryList · SelectableCard 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssl-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ssl-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        ui <code>RadioGroup</code> · <code>RadioGroupItem</code> 을 쓰므로 방향키 이동과 라디오 역할이
                        제공됩니다[6.1.1][8.2.1]. 그룹 제목이 화면에 없으면 <code>aria-label</code> 을 줍니다.
                    </li>
                    <li>
                        카드가 <code>label</code> 이라 카드 전체가 눌립니다. 라디오는 <code>dl</code> 의 직계 자식이 될
                        수 없어 <code>label</code> 안에 <code>dl</code> 과 형제로 둡니다[8.1.1].
                    </li>
                    <li>
                        선택은 테두리 두께(1px → 2px)와 배경으로도 구분되고 라디오 표시가 함께 바뀌어 색에만 의존하지
                        않습니다[5.3.1].
                    </li>
                    <li>키보드 포커스는 카드 외곽선으로 표시됩니다[6.1.2].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssl-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ssl-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SelectableSummaryList Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SelectableSummaryListGuidePage
