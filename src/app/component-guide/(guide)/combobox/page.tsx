import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {ComboboxDemo, ComboboxStatesDemo} from './combobox-demo'

export const metadata: Metadata = {title: '콤보박스 (Combobox)'}

const USAGE_CODE = `const [value, setValue] = useState('')

<Label htmlFor="corp" className="text-foreground font-bold">기업형태</Label>
<Combobox
  id="corp"
  options={[{value: 'corp', label: '주식회사'}, /* … */]}
  value={value}
  onValueChange={setValue}
  placeholder="기업형태를 선택하세요"
  searchPlaceholder="기업형태 검색..."
/>`

// Props 설명 — [이름, 설명, 타입]
const PROPS_ITEMS = [
    ['options', '선택지 목록.', '{ value: string; label: string }[]'],
    ['value·onValueChange', '선택 값(controlled).', 'string · (v: string) => void'],
    ['placeholder', '값이 없을 때 트리거 문구.', "string (기본 '선택하세요')"],
    ['searchPlaceholder', '검색 입력 placeholder.', "string (기본 '검색...')"],
    ['emptyText', '검색 결과 없을 때 문구.', "string (기본 '결과가 없습니다.')"],
    ['disabled', '비활성화(공통 field-disabled 스타일 + 클릭 불가).', 'boolean'],
    ['readOnly', '읽기 전용(값은 유지하되 열리지 않음).', 'boolean'],
    ['id·name·aria-invalid 등', '트리거 button 에 전달(라벨 연결·검증).', 'button 속성'],
] as const

// 콤보박스 — kit Popover + Command(cmdk) 조합(composite/combobox). 트리거는 Input 스타일로 통일.
const ComboboxGuidePage = () => (
    <GuidePageShell
        title="콤보박스 (Combobox)"
        description="검색으로 걸러 하나를 고르는 선택 컨트롤입니다. 트리거는 Input 과 같은 스타일이고, 열면 검색 입력과 필터된 목록이 나옵니다."
    >
        <section aria-labelledby="cb-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="cb-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">Label</code> + <code className="font-mono">Combobox</code> 조합입니다.
                    트리거를 누르면 검색 입력이 뜨고, 타이핑으로 목록을 거른 뒤 선택합니다.
                </p>
            </div>
            <ComboboxDemo />
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="cb-state" className="flex flex-col gap-4">
            <div>
                <h2 id="cb-state" className="typo-h4-bold">
                    상태 (State)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    기본(placeholder)·값 선택됨·오류·읽기전용·비활성 상태입니다. 트리거 스타일은 Select 와 같은 토큰
                    체계를 씁니다.
                </p>
            </div>
            <ComboboxStatesDemo />
        </section>

        <section aria-labelledby="cb-props" className="flex flex-col gap-4">
            <div>
                <h2 id="cb-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">Combobox 에 넘기는 속성입니다.</p>
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

export default ComboboxGuidePage
