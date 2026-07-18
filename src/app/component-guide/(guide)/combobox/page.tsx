import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import ComboboxFormDemo from './combobox-form-demo'
import {ComboboxDemo, ComboboxStatesDemo} from './combobox-demo'

export const metadata: Metadata = {title: '콤보박스 (Combobox)'}

const USAGE_CODE = `const [value, setValue] = useState('')

<Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
  <FieldLabel htmlFor="corp" className="font-bold text-foreground">기업형태</FieldLabel>
  <Combobox
    id="corp"
    options={[{value: 'corp', label: '주식회사'}, /* … */]}
    value={value}
    onValueChange={setValue}
    placeholder="기업형태를 선택하세요"
    aria-describedby="corp-help"
  />
  <FieldDescription id="corp-help">기업형태를 검색해 한 가지를 선택해 주세요.</FieldDescription>
</Field>`

const DROPDOWN_CODE = `<Combobox
  id="corp-dropdown"
  type="dropdown"
  options={corpTypes}
  value={value}
  onValueChange={setValue}
  placeholder="기업형태를 선택하세요"
  searchPlaceholder="기업형태 검색"
/>`

const FORM_CODE = `const [organization, setOrganization] = useState('')
const [supportProgram, setSupportProgram] = useState('')
const [organizationError, setOrganizationError] = useState(false)
const [supportProgramError, setSupportProgramError] = useState(false)

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const nextError = organization === ''
  const nextSupportProgramError = supportProgram === ''
  setOrganizationError(nextError)
  setSupportProgramError(nextSupportProgramError)
  if (nextError) {
    document.getElementById('organization')?.focus()
    return
  }
  if (nextSupportProgramError) {
    document.getElementById('support-program')?.focus()
    return
  }

  const formData = new FormData(event.currentTarget)
  console.log(Object.fromEntries(formData))
}

<form noValidate onSubmit={handleSubmit}>
  <Field data-invalid={organizationError || undefined} className={cn('max-w-90', FIELD_FOCUS_RING)}>
    <FieldLabel htmlFor="organization" className="gap-1 font-bold text-foreground">
      신청 기관
      <span aria-hidden="true" className="text-error-500">*</span>
      <span className="sr-only"> (필수)</span>
    </FieldLabel>
    <Combobox
      id="organization"
      name="organization"
      required
      options={organizations}
      value={organization}
      onValueChange={(value) => {
        setOrganization(value)
        setOrganizationError(false)
      }}
      aria-invalid={organizationError || undefined}
      aria-describedby={organizationError ? 'organization-error' : undefined}
    />
    {organizationError ? <FieldError id="organization-error">신청 기관을 선택해 주세요.</FieldError> : null}
  </Field>

  <Field data-invalid={supportProgramError || undefined} className={cn('max-w-90', FIELD_FOCUS_RING)}>
    <FieldLabel htmlFor="support-program" className="gap-1 font-bold text-foreground">
      지원 프로그램
      <span aria-hidden="true" className="text-error-500">*</span>
      <span className="sr-only"> (필수)</span>
    </FieldLabel>
    <Combobox
      id="support-program"
      type="dropdown"
      name="supportProgram"
      required
      options={supportPrograms}
      value={supportProgram}
      onValueChange={(value) => {
        setSupportProgram(value)
        setSupportProgramError(false)
      }}
      placeholder="지원 프로그램을 선택하세요"
      searchPlaceholder="지원 프로그램 검색"
      aria-invalid={supportProgramError || undefined}
      aria-describedby={supportProgramError ? 'support-program-error' : undefined}
    />
    {supportProgramError ? <FieldError id="support-program-error">지원 프로그램을 선택해 주세요.</FieldError> : null}
  </Field>

  <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
    <FieldLabel htmlFor="reception-office" className="font-bold text-foreground">접수 지점</FieldLabel>
    <Combobox
      id="reception-office"
      name="receptionOffice"
      options={[{value: 'head-office', label: '본점'}]}
      value="head-office"
      readOnly
    />
  </Field>

  <Button type="submit" variant="default" size="md">선택 내용 확인</Button>
</form>`

const PROPS_ITEMS = [
    {name: 'options', desc: '검색하고 선택할 항목 목록입니다.', def: '-', control: 'ComboboxOption[]'},
    {
        name: 'type',
        desc: '외부 입력창에서 검색하는 형태와 드롭다운 내부에 검색창을 두는 형태를 선택합니다.',
        def: "'input'",
        control: "'input' | 'dropdown'",
    },
    {
        name: 'value / onValueChange',
        desc: '현재 선택값과 값이 바뀔 때 호출되는 콜백입니다.',
        def: '- / -',
        control: 'string / (value: string) => void',
    },
    {name: 'placeholder', desc: '값이 없을 때 트리거에 표시됩니다.', def: "'선택하세요'", control: 'string'},
    {
        name: 'searchPlaceholder',
        desc: 'dropdown 타입의 목록 내부 검색창에 표시됩니다.',
        def: "'검색어를 입력하세요'",
        control: 'string',
    },
    {
        name: 'emptyText',
        desc: '검색 결과가 없을 때 표시됩니다.',
        def: "'결과가 없습니다.'",
        control: 'string',
    },
    {
        name: 'name / form / required',
        desc: 'Base UI Combobox의 FormData 필드 이름, 외부 form 연결, 네이티브 필수 상태를 지정합니다.',
        def: '- / - / false',
        control: 'string / string / boolean',
    },
    {
        name: 'disabled',
        desc: '비활성. 목록을 열 수 없고 FormData 제출에서도 제외됩니다.',
        def: 'false',
        control: 'boolean',
    },
    {
        name: 'readOnly',
        desc: '읽기전용. 목록을 열거나 값을 바꿀 수 없지만 값은 FormData에 포함됩니다.',
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
        desc: '입력형의 InputGroup 또는 드롭다운형의 Trigger 레이아웃과 스타일을 확장합니다.',
        def: '""',
        control: 'string',
    },
] as const

const ComboboxGuidePage = () => (
    <GuidePageShell
        title="콤보박스 (Combobox)"
        description="Base UI 기반 shadcn Combobox primitive를 프로젝트 단일 선택 API로 제공하는 wrapper입니다. Field와 조합해 검색 가능한 입력을 구성합니다."
    >
        <BaseCard>
            <section aria-labelledby="cb-demo" className="flex flex-col gap-4">
                <div>
                    <h2 id="cb-demo" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">Field</code> 안에 <code className="font-mono">FieldLabel</code>,{' '}
                        <code className="font-mono">Combobox</code>, <code className="font-mono">FieldDescription</code>
                        을 조합합니다. shadcn ComboboxInput은 InputGroup을 사용해 Input과 외관·상태를 공유하며, 입력과
                        목록 탐색을 하나의 Base UI Combobox 상태로 처리합니다.
                    </p>
                </div>
                <ComboboxDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={DROPDOWN_CODE} language="tsx" copyLabel="드롭다운 검색형 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cb-state" className="flex flex-col gap-4">
                <div>
                    <h2 id="cb-state" className="typo-h4-bold">
                        상태 (State)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기본·값 선택됨·오류·읽기전용·비활성 상태입니다. 오류가 있으면 동일 Field 안에{' '}
                        <code className="font-mono">FieldError</code>를 추가합니다. readOnly는 값이 유지되지만 목록이
                        열리지 않고, disabled는 클릭과 포커스가 막힙니다. Input과 같은 48px 높이로 고정되어 별도의 size
                        prop을 제공하지 않습니다.
                    </p>
                </div>
                <ComboboxStatesDemo />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cb-form" className="flex flex-col gap-4">
                <div>
                    <h2 id="cb-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">name</code>을 지정하면 Base UI Combobox가 선택값을 FormData에
                        포함합니다. 예시는 필수값을 직접 검증해 <code className="font-mono">FieldError</code>를 표시하고
                        첫 오류 입력으로 포커스를 이동합니다. 입력형과 드롭다운 검색형 모두 제출값을 확인할 수 있으며,
                        readOnly 값은 제출되지만 disabled 값은 제출되지 않습니다.
                    </p>
                </div>
                <ComboboxFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cb-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="cb-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">Combobox에서 자주 쓰는 속성입니다.</p>
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
        </BaseCard>
    </GuidePageShell>
)

export default ComboboxGuidePage
