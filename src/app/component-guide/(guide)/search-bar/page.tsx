import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {FormCard} from '@/components/composite/form-card'
import {SearchBar} from '@/components/composite/search-bar'
import {SearchBarUsageDemo} from './search-bar-demo'

export const metadata: Metadata = {title: '검색 바 (SearchBar)'}

const USAGE_CODE = `{/* 검색 버튼 클릭 또는 입력창에서 Enter — 둘 다 onSearch 를 호출한다 */}
<SearchBar
  label="사업자번호 검색"
  placeholder="사업자번호 또는 법인등록번호를 입력하세요"
  onSearch={(value) => console.log(value)}
/>`

const DISABLED_CODE = `<SearchBar label="사업자번호 검색" placeholder="검색어를 입력하세요" disabled />`

const FORM_CARD_CODE = `{/* FormCard(헤더 내장 카드) 본문에 넣어 실제 화면처럼 배치 */}
<FormCard title="기업 검색">
  <SearchBar
    label="사업자번호 검색"
    placeholder="사업자번호 또는 법인등록번호를 입력하세요"
    onSearch={handleSearch}
  />
</FormCard>`

// 조합 API 설명 — [이름, 설명, 타입]
const PROPS_ITEMS = [
    [
        'label',
        '필수. 스크린리더용 필드 이름 — 시각적으로는 sr-only 로 숨겨진 <label> 로 렌더링된다. placeholder 는 레이블을 대체하지 못하므로([7.4.1]) 항상 넘겨야 한다(생략하면 타입 에러).',
        'string',
    ],
    [
        'onSearch',
        '검색 버튼 클릭 또는 입력창 Enter 시 호출된다. 현재 입력값을 인자로 받는다.',
        '(value: string) => void',
    ],
    ['searchLabel', '검색 버튼의 접근성 라벨(아이콘 전용 버튼). 기본값 "검색".', 'string'],
    ['clearLabel', '지우기 버튼의 접근성 라벨(아이콘 전용 버튼). 기본값 "입력 지우기".', 'string'],
    [
        '그 외',
        'placeholder·disabled·value·onChange·id 등 표준 input 속성을 그대로 받는다. id 를 안 주면 useId() 로 자동 생성해 label 과 연결한다([6.1.1] "id 또는 name" 경고 방지).',
        "ComponentPropsWithoutRef<'input'>",
    ],
] as const

// 검색 바 — Figma "text_input"(검색창) 반영. shadcn 프리미티브 InputGroup 을 kit 로 승격해 그 위에 조립한 L2 composite.
const SearchBarGuidePage = () => (
    <GuidePageShell
        title="검색 바 (SearchBar)"
        description="텍스트 입력 + 원형 검색 버튼을 한 덩어리로 쓰는 검색창입니다. shadcn 에 인풋+addon(아이콘·버튼) 조합을 위한 InputGroup 프리미티브가 있어, 새로 만들지 않고 kit/InputGroup(승격) 위에 조립했습니다."
    >
        <section aria-labelledby="sb-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="sb-usage" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    검색어를 입력하고 원형 버튼을 누르거나 <code className="font-mono">Enter</code> 를 쳐 보세요 —
                    아래에 결과가 표시됩니다.
                </p>
            </div>
            <SearchBarUsageDemo />
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="sb-disabled" className="flex flex-col gap-4">
            <div>
                <h2 id="sb-disabled" className="typo-h4-bold">
                    비활성 (disabled)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">disabled</code> 를 주면 입력·버튼 모두 상호작용이 막히고 흐리게
                    표시됩니다.
                </p>
            </div>
            <SearchBar label="사업자번호 검색" placeholder="검색어를 입력하세요" disabled />
            <CodeBlock code={DISABLED_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="sb-form-card" className="flex flex-col gap-4">
            <div>
                <h2 id="sb-form-card" className="typo-h4-bold">
                    FormCard 안에서 사용
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    실제 화면처럼 <code className="font-mono">FormCard</code>(헤더 내장 카드) 본문에 넣어 &quot;기업
                    검색&quot; 같은 제목과 함께 배치합니다.
                </p>
            </div>
            <FormCard title="기업 검색">
                <SearchBar label="사업자번호 검색" placeholder="사업자번호 또는 법인등록번호를 입력하세요" />
            </FormCard>
            <CodeBlock code={FORM_CARD_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="sb-props" className="flex flex-col gap-4">
            <div>
                <h2 id="sb-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">SearchBar 에 넘기는 속성입니다.</p>
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

export default SearchBarGuidePage
