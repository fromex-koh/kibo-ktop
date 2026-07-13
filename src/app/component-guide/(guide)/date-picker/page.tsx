import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import DatePickerDemo, {DatePickerStatesDemo} from './date-picker-demo'

export const metadata: Metadata = {title: '데이트피커 (DatePicker)'}

const USAGE_CODE = `const [date, setDate] = useState<Date>()

<DatePicker id="date" value={date} onChange={setDate} />`

// Props 설명 — [이름, 설명, 타입]
const PROPS_ITEMS = [
    ['value', '선택된 날짜(controlled). 없으면 placeholder 표시.', 'Date | undefined'],
    ['onChange', '날짜 선택/해제 시 호출.', '(date?: Date) => void'],
    ['placeholder', '값이 없을 때 표시할 안내 문구.', "string (기본 '연도-월-일')"],
    ['disabled', '비활성화. bg-muted + 흐림, 클릭·포커스 불가.', 'boolean'],
    ['readOnly', '읽기 전용. 값은 보이지만 달력이 열리지 않는다(비활성과 달리 흐려지지 않음).', 'boolean'],
    ['id·name·aria-invalid 등', '트리거 button 에 전달된다(라벨 연결·검증).', 'button 속성'],
] as const

// 데이트피커 — kit Input 스타일 트리거 + kit Popover·Calendar 조합(composite/date-picker).
// 화면·도메인 코드는 이 composite 를 쓴다.
const DatePickerGuidePage = () => (
    <GuidePageShell
        title="데이트피커 (DatePicker)"
        description="Input 스타일 트리거를 클릭하면 달력이 열리는 날짜 선택 컴포넌트입니다."
    >
        <section aria-labelledby="date-picker-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="date-picker-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    트리거는 <code className="font-mono">Input</code> 과 같은 스타일(높이·테두리·배경·포커스)이고 우측에
                    달력 아이콘이 붙습니다. 클릭하면 달력이 열리고, 날짜를 고르면{' '}
                    <code className="font-mono">yyyy-MM-dd</code> 로 표시됩니다.
                </p>
            </div>
            <DatePickerDemo />
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="date-picker-state" className="flex flex-col gap-4">
            <div>
                <h2 id="date-picker-state" className="typo-h4-bold">
                    상태 (State)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    기본(placeholder)·값 입력됨·읽기전용·비활성 상태입니다. <code className="font-mono">readOnly</code>{' '}
                    는 값은 그대로 보이되 달력이 열리지 않고, <code className="font-mono">disabled</code> 는 흐려지며
                    클릭·포커스가 막힙니다.
                </p>
            </div>
            <DatePickerStatesDemo />
        </section>

        <section aria-labelledby="date-picker-props" className="flex flex-col gap-4">
            <div>
                <h2 id="date-picker-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">DatePicker 에 넘기는 속성입니다.</p>
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

export default DatePickerGuidePage
