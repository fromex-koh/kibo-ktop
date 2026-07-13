import type {Metadata} from 'next'
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

// Props 설명 — [이름, 설명, 타입]
const PROPS_ITEMS = [
    ['title', '탭 제목 (필수).', 'ReactNode'],
    ['status', '진행 상태 배지(선택). 상태별 색이 자동 매핑된다.', "'작성중' | '작성완료' | '미작성'"],
    ['active', '선택(활성) 여부 — 파란 테두리 + 제목 bold.', 'boolean'],
    ['onClick 등', '나머지 button 속성은 그대로 전달된다.', 'button props'],
] as const

// 탭 카드 — kit Card·Badge 를 조합한 카드형 탭(composite/tab-card). Figma "입력타겟" 반영:
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

        <section aria-labelledby="tab-card-props" className="flex flex-col gap-4">
            <div>
                <h2 id="tab-card-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    TabCard 에 넘기는 속성입니다. 묶는 <code className="font-mono">TabCardList</code> 는 role=tablist 로
                    가로 배치·키보드 이동을 담당합니다.
                </p>
            </div>
            <dl className="flex flex-col gap-2">
                {PROPS_ITEMS.map(([name, desc, type]) => (
                    <div key={name} className="flex flex-col gap-0.5">
                        <dt className="typo-body-l-medium text-primary font-mono">
                            {name}
                            <span className="text-muted-foreground ml-2 font-normal">{type}</span>
                        </dt>
                        <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                    </div>
                ))}
            </dl>
        </section>
    </GuidePageShell>
)

export default TabCardGuidePage
