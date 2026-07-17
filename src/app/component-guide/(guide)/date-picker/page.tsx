import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import DatePickerFormDemo from './date-picker-form-demo'
import DatePickerDemo, {DatePickerStatesDemo} from './date-picker-demo'

export const metadata: Metadata = {title: '데이트피커 (DatePicker)'}

const USAGE_CODE = `const [date, setDate] = useState<Date>()

<Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
  <FieldLabel htmlFor="date" className="font-bold text-foreground">날짜 선택</FieldLabel>
  <DatePicker id="date" value={date} onChange={setDate} aria-describedby="date-help" />
  <FieldDescription id="date-help">달력에서 날짜를 선택해 주세요.</FieldDescription>
</Field>`

const PROPS_ITEMS = [
    {name: 'value', desc: '선택된 날짜. 값이 없으면 placeholder를 표시합니다.', def: '-', control: 'Date'},
    {name: 'onChange', desc: '날짜를 선택하거나 해제할 때 호출됩니다.', def: '-', control: '(date?: Date) => void'},
    {
        name: 'placeholder',
        desc: '값이 없을 때 표시되는 안내 문구입니다. 라벨을 대체하지 않습니다.',
        def: "'연도-월-일'",
        control: 'string',
    },
    {
        name: 'name / form / required',
        desc: 'FormData 필드 이름, 외부 form 연결, 필수 상태를 지정합니다. 날짜는 yyyy-MM-dd 형식으로 제출됩니다.',
        def: '- / - / false',
        control: 'string / string / boolean',
    },
    {
        name: 'disabled',
        desc: '비활성. 달력을 열 수 없고 FormData 제출에서도 제외됩니다.',
        def: 'false',
        control: 'boolean',
    },
    {
        name: 'readOnly',
        desc: '읽기전용. 달력을 열거나 값을 바꿀 수 없지만 값은 FormData에 포함됩니다.',
        def: 'false',
        control: 'boolean',
    },
    {
        name: 'id / aria-invalid / aria-describedby',
        desc: 'FieldLabel과 오류 메시지를 트리거에 연결하고 오류 상태를 전달합니다.',
        def: '-',
        control: 'string / boolean / string',
    },
    {
        name: 'className',
        desc: 'InputGroup 기반 루트 컨테이너의 레이아웃을 확장합니다.',
        def: '""',
        control: 'string',
    },
] as const

const FORM_CODE = `const [visitDate, setVisitDate] = useState<Date>()
const [visitDateError, setVisitDateError] = useState(false)

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const nextError = visitDate === undefined
  setVisitDateError(nextError)
  if (nextError) {
    document.getElementById('visit-date')?.focus()
    return
  }

  const formData = new FormData(event.currentTarget)
  console.log(Object.fromEntries(formData))
}

<form noValidate onSubmit={handleSubmit}>
  <Field data-invalid={visitDateError || undefined} className={cn('max-w-90', FIELD_FOCUS_RING)}>
    <FieldLabel htmlFor="visit-date" className="gap-1 font-bold text-foreground">
      방문 예정일
      <span aria-hidden="true" className="text-error-500">*</span>
      <span className="sr-only"> (필수)</span>
    </FieldLabel>
    <DatePicker
      id="visit-date"
      name="visitDate"
      required
      value={visitDate}
      onChange={(date) => {
        setVisitDate(date)
        setVisitDateError(false)
      }}
      aria-invalid={visitDateError || undefined}
      aria-describedby={visitDateError ? 'visit-date-error' : undefined}
    />
    {visitDateError ? <FieldError id="visit-date-error">방문 예정일을 선택해 주세요.</FieldError> : null}
  </Field>

  <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
    <FieldLabel htmlFor="application-date" className="font-bold text-foreground">신청일</FieldLabel>
    <DatePicker id="application-date" name="applicationDate" value={applicationDate} readOnly />
  </Field>

  <Button type="submit" variant="default" size="md">날짜 선택 확인</Button>
</form>`

const DatePickerGuidePage = () => (
    <GuidePageShell
        title="데이트피커 (DatePicker)"
        description="InputGroup, Popover, Calendar를 조합한 프로젝트 composite입니다. Field와 조합해 라벨·설명·오류가 포함된 날짜 입력을 구성합니다."
    >
        <section aria-labelledby="date-picker-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="date-picker-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">Field</code> 안에 <code className="font-mono">FieldLabel</code>,{' '}
                    <code className="font-mono">DatePicker</code>, <code className="font-mono">FieldDescription</code>을
                    조합합니다. 트리거는 <code className="font-mono">InputGroup</code>을 사용해 Input과 동일한
                    높이·테두리·배경·포커스를 공유하며, 날짜는 <code className="font-mono">yyyy-MM-dd</code>로
                    표시됩니다.
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
                    기본·값 입력됨·오류·읽기전용·비활성 상태입니다. 오류가 있으면 동일 Field 안에{' '}
                    <code className="font-mono">FieldError</code>를 추가합니다.{' '}
                    <code className="font-mono">readOnly</code>는 값은 그대로 보이되 달력이 열리지 않고,{' '}
                    <code className="font-mono">disabled</code>는 클릭과 포커스가 막힙니다. 프로젝트 DatePicker는
                    Input과 같은 48px 높이로 고정되어 별도의 size prop을 제공하지 않습니다.
                </p>
            </div>
            <DatePickerStatesDemo />
        </section>

        <section aria-labelledby="date-picker-form" className="flex flex-col gap-4">
            <div>
                <h2 id="date-picker-form" className="typo-h4-bold">
                    폼 제출
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">name</code>을 지정하면 선택 날짜가{' '}
                    <code className="font-mono">yyyy-MM-dd</code> 문자열로 FormData에 포함됩니다. 예시는 필수 날짜를
                    직접 검증해 <code className="font-mono">FieldError</code>를 노출하고 첫 오류 트리거로 포커스를
                    이동합니다. readOnly 날짜는 제출되지만 disabled 날짜는 제출되지 않습니다.
                </p>
            </div>
            <DatePickerFormDemo />
            <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="date-picker-props" className="flex flex-col gap-4">
            <div>
                <h2 id="date-picker-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">DatePicker 에 넘기는 속성입니다.</p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Props 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
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
                                Control
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {PROPS_ITEMS.map((prop) => (
                            <tr key={prop.name} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal whitespace-nowrap"
                                >
                                    {prop.name}
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{prop.desc}</td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    {prop.def}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        {prop.control}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </GuidePageShell>
)

export default DatePickerGuidePage
