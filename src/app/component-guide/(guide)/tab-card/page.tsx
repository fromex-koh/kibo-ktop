import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import TabCardDemo from './tab-card-demo'

export const metadata: Metadata = {title: '탭 카드 (TabCard)'}

const USAGE_CODE = `const [active, setActive] = useState('corp')

<TabCardList aria-label="입력 대상 섹션">
  {SECTIONS.map((section) => (
    <TabCard
      key={section.id}
      title={section.title}
      status={section.status}          // '작성중' | '작성완료' | '미작성'
      active={active === section.id}
      onClick={() => setActive(section.id)}
    />
  ))}
</TabCardList>`

// Props 설명 — [컴포넌트, 이름, 설명, 기본값, 타입]
const PROPS_ITEMS = [
    ['TabCard', 'title', '탭 제목입니다.', '-', 'ReactNode'],
    [
        'TabCard',
        'status',
        '작성 상태를 Badge 색상과 variant로 표시합니다.',
        'undefined',
        "'작성중' | '작성완료' | '미작성'",
    ],
    ['TabCard', 'active', '활성 여부입니다. aria-selected와 tabIndex, 강조 스타일에 반영됩니다.', 'false', 'boolean'],
    ['TabCard', 'onClick · onKeyDown 등', '네이티브 button 속성을 전달합니다.', 'undefined', 'ButtonHTMLAttributes'],
    ['TabCardList', 'children', '가로로 배치할 TabCard 목록입니다.', '-', 'ReactNode'],
    ['TabCardList', 'aria-label', '탭 목록의 접근 가능한 이름입니다.', 'undefined', 'string'],
    ['TabCardList', 'className', '그리드 열·간격 등 목록 스타일을 확장합니다.', 'undefined', 'string'],
] as const

// 탭 카드 — button·Badge를 조합한 카드형 탭(composite/tab-card). Figma "입력타겟" 반영:
// 제목 + 작성 상태 배지의 카드가 가로로 나열되고, 선택된 탭만 파란 테두리 + 제목 bold 로 강조된다.
const TabCardGuidePage = () => (
    <GuidePageShell
        title="탭 카드 (TabCard)"
        description="제목 + 진행 상태 배지를 가진 카드형 탭입니다. 폼 섹션 전환처럼 탭 내비게이션에 씁니다."
    >
        <section aria-labelledby="tab-card-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="tab-card-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    각 탭은 제목과 작성 상태(작성중·작성완료·미작성) 배지를 가집니다. 클릭하면 활성 탭이 파란 테두리로
                    강조되고, 좌우 화살표·Home/End 로도 이동합니다.
                </p>
            </div>
            <TabCardDemo />
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <BaseCard>
            <section aria-labelledby="tab-card-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="tab-card-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        TabCard 에 넘기는 속성입니다. 묶는 <code className="font-mono">TabCardList</code> 는
                        role=tablist 로 가로 배치·키보드 이동을 담당합니다.
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-xl border">
                    <table className="w-full text-left">
                        <caption className="sr-only">TabCard와 TabCardList Props 목록</caption>
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
                            {PROPS_ITEMS.map(([component, name, description, defaultValue, type]) => (
                                <tr key={`${component}-${name}`} className="border-border border-b last:border-b-0">
                                    <td className="typo-body-l-regular text-foreground px-4 py-3 font-mono">
                                        {component}
                                    </td>
                                    <th
                                        scope="row"
                                        className="typo-body-l-medium text-primary-strong px-4 py-3 font-mono"
                                    >
                                        {name}
                                    </th>
                                    <td className="typo-body-l-regular text-foreground-subtle px-4 py-3">
                                        {description}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {defaultValue}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {type}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default TabCardGuidePage
