// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import TextTabsDemo from './text-tabs-demo'

export const metadata: Metadata = {title: '텍스트 탭 (TextTabs)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {TextTabs} from '@/components/composite/text-tabs'

const MODEL_TABS = [
  {value: 'ktrs-fm', label: 'KTRS-FM'},
  {value: 'tech-index', label: 'Tech-Index'},
] as const

const [model, setModel] = useState('ktrs-fm')
const panelId = useId()

<TextTabs items={MODEL_TABS} value={model} onValueChange={setModel} label="평가 모형" panelId={panelId} />

{/* 고른 탭에 따라 내용이 바뀌는 영역 — id 와 role 을 함께 둔다 */}
<div id={panelId} role="tabpanel">…</div>`

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'text-tabs',
        cells: [
            '고른 값으로 아래 영역 하나의 내용이 바뀜',
            <code key="component">TextTabs</code>,
            '조회 목록의 평가 모형 선택처럼 패널은 하나이고 값만 달라집니다. 선택값은 사용처가 state 로 관리합니다.',
        ],
    },
    {
        key: 'tabs-text',
        cells: [
            '탭마다 본문 패널이 따로 있음',
            <Link key="component" href="/component-guide/tabs" className={LINK_CLASS}>
                Tabs variant=&quot;text&quot;
            </Link>,
            '개인정보 처리방침 · 이용약관처럼 탭별 TabsContent 를 둡니다. 모양은 같고 선택값을 직접 관리하지 않아도 됩니다.',
        ],
    },
    {
        key: 'form-tabs',
        cells: [
            '긴 입력 폼을 섹션으로 나눔',
            <Link key="component" href="/component-guide/form-tabs" className={LINK_CLASS}>
                FormTabs
            </Link>,
            '섹션별 작성 상태를 보여 주고 화면 폭에 따라 모양이 바뀝니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['TextTabs', 'items', '탭 목록입니다.', '-', 'readonly TextTabItem[]'],
    ['TextTabs', 'value', '지금 고른 탭의 value 입니다.', '-', 'string'],
    ['TextTabs', 'onValueChange', '탭을 누르거나 방향키로 옮겼을 때 호출됩니다.', '-', '(value: string) => void'],
    ['TextTabs', 'label', '탭 묶음의 이름입니다. 스크린리더가 읽습니다.', '-', 'string'],
    ['TextTabs', 'panelId', '탭이 바꾸는 영역의 id 입니다. 그 영역에 role="tabpanel" 을 둡니다.', '-', 'string'],
    ['TextTabs', 'className', '탭 묶음에 덧붙일 클래스입니다.', 'undefined', 'string'],
    ['TextTabItem', 'value', '탭을 구분하는 값입니다.', '-', 'string'],
    ['TextTabItem', 'label', '화면에 보이는 글자입니다.', '-', 'string'],
] as const

const TextTabsGuidePage = () => (
    <GuidePageShell
        title="텍스트 탭 (TextTabs)"
        description="면이나 밑줄 없이 글자만으로 고르는 탭입니다. 고른 값으로 아래 영역 하나의 내용을 바꾸는 자리에 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="text-tabs-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="text-tabs-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        선택값은 사용처가 <code>value</code> · <code>onValueChange</code> 로 관리합니다. 탭이 바꾸는
                        영역에는 <code>panelId</code> 와 같은 <code>id</code> 와 <code>role=&quot;tabpanel&quot;</code>{' '}
                        을 줍니다. 고른 항목은 진한 글자, 나머지는 옅은 글자이며 글자는 20px Bold 로 고정되어 탭을
                        옮겨도 폭이 변하지 않습니다. 항목 간격은 24이고 한 줄에 들어가지 않으면 다음 줄로 넘어갑니다.
                    </p>
                </div>
                <TextTabsDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="text-tabs-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="text-tabs-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        Tabs 의 text 변형과 생김새가 같습니다. 본문 패널이 하나인지 여러 개인지로 고릅니다.
                    </p>
                </div>
                <Table
                    caption="TextTabs · Tabs · FormTabs 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="text-tabs-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="text-tabs-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        탭 역할과 키보드 조작은 컴포넌트가 처리합니다. 사용처는 <code>label</code> 과{' '}
                        <code>panelId</code> 만 넘기면 됩니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>role=&quot;tablist&quot;</code> · <code>tab</code>, 선택 여부(<code>aria-selected</code>
                        ), 패널 연결(<code>aria-controls</code>)이 붙습니다. 색만으로 선택을 전하지 않습니다[5.3.1].
                    </li>
                    <li>
                        <kbd>←</kbd> <kbd>→</kbd> 로 옆 탭을, <kbd>Home</kbd> <kbd>End</kbd> 로 처음·끝 탭을 고릅니다.
                        Tab 키로는 고른 탭에만 포커스가 들어갑니다.
                    </li>
                    <li>키보드 포커스는 외곽선으로 표시됩니다[6.1.2].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="text-tabs-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="text-tabs-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        className 을 제외한 모든 속성이 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="TextTabs Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default TextTabsGuidePage
