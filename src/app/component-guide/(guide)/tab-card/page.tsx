import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import TabCardDemo from './tab-card-demo'

export const metadata: Metadata = {title: '탭 카드 (TabCard)'}

const USAGE_CODE = `const [active, setActive] = useState('corp')

<TabCardList aria-label="입력 대상 섹션">
  {SECTIONS.map((section) => (
    <TabCard
      key={section.id}
      title={section.title}
      status={section.status}
      active={active === section.id}
      id={\`tabcard-\${section.id}\`}
      aria-controls="tabcard-panel"
      onClick={() => setActive(section.id)}
    />
  ))}
</TabCardList>

<div
  id="tabcard-panel"
  role="tabpanel"
  aria-labelledby={\`tabcard-\${active}\`}
>
  {/* 선택된 섹션 콘텐츠 */}
</div>`

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

const TabCardGuidePage = () => (
    <GuidePageShell
        title="탭 카드 (TabCard)"
        description="작성 상태를 함께 보여주는 프로젝트 카드형 탭입니다. 여러 폼 섹션 사이를 전환할 때 사용합니다."
    >
        <BaseCard>
            <section aria-labelledby="tab-card-demo" className="flex flex-col gap-4">
                <div>
                    <h2 id="tab-card-demo" className="typo-h4-bold">
                        상태가 있는 폼 섹션 전환
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        작성중은 info, 작성완료는 secondary-grape outline, 미작성은 neutral Badge로 표시합니다. 활성
                        탭은 테두리와 굵은 제목으로 구분하며, 좌우 화살표·Home·End는 탭 포커스를 이동합니다. Enter 또는
                        Space로 선택합니다.
                    </p>
                </div>
                <TabCardDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tab-card-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="tab-card-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">TabCardList</code>는 탭 목록 역할과 가로 배치를,{' '}
                        <code className="font-mono">TabCard</code>는 상태 표시와 키보드 이동을 담당합니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="TabCard와 TabCardList Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default TabCardGuidePage
