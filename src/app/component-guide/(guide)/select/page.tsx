import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Field, FieldDescription, FieldError, FieldLabel} from '@/components/ui/field'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {SelectText} from '@/components/composite/select-text'
import SelectFormDemo from './select-form-demo'

const TEXT_VARIANT_CODE = `{/* 면 없는 텍스트형 — 목록은 시스템 드롭다운이 그린다 */}
<SelectText
  size="lg"
  aria-label="기간 선택"
  options={[
    {value: 'all', label: '전체 기간'},
    {value: 'year', label: '최근 1년'},
  ]}
  value={period}
  onChange={(event) => setPeriod(event.target.value)}
/>`

export const metadata: Metadata = {title: '셀렉트 (Select)'}

const PERIOD_OPTIONS = [
    {value: 'all', label: '전체 기간'},
    {value: 'year', label: '최근 1년'},
    {value: 'month', label: '최근 1개월'},
]

const USAGE_CODE = `<Field className="max-w-90">
  <FieldLabel htmlFor="fruit" className="gap-1 font-bold text-foreground">
    좋아하는 과일
    <span aria-hidden="true" className="text-error-500">*</span>
    <span className="sr-only"> (필수)</span>
  </FieldLabel>
  <Select required>
    <SelectTrigger id="fruit" className="w-full" aria-describedby="fruit-help">
      <SelectValue placeholder="선택해주세요" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">사과</SelectItem>
      <SelectItem value="banana">바나나</SelectItem>
      <SelectItem value="cherry">체리</SelectItem>
    </SelectContent>
  </Select>
  <FieldDescription id="fruit-help">한 가지 과일을 선택해 주세요.</FieldDescription>
</Field>`

const FORM_CODE = `const [applicationType, setApplicationType] = useState('')
const [applicationTypeError, setApplicationTypeError] = useState(false)

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const nextError = applicationType === ''
  setApplicationTypeError(nextError)
  if (nextError) {
    document.getElementById('application-type')?.focus()
    return
  }

  const formData = new FormData(event.currentTarget)
  console.log(Object.fromEntries(formData))
}

<form noValidate onSubmit={handleSubmit}>
  <Field data-invalid={applicationTypeError || undefined} className="max-w-90">
    <FieldLabel htmlFor="application-type" className="gap-1 font-bold text-foreground">
      신청 유형
      <span aria-hidden="true" className="text-error-500">*</span>
      <span className="sr-only"> (필수)</span>
    </FieldLabel>
    <Select
      name="applicationType"
      required
      value={applicationType}
      onValueChange={(value) => {
        setApplicationType(value)
        setApplicationTypeError(false)
      }}
    >
      <SelectTrigger
        id="application-type"
        aria-invalid={applicationTypeError || undefined}
        aria-describedby={applicationTypeError ? 'application-type-error' : undefined}
      >
        <SelectValue placeholder="신청 유형을 선택하세요" />
      </SelectTrigger>
      <SelectContent>{/* SelectItem */}</SelectContent>
    </Select>
    {applicationTypeError ? (
      <FieldError id="application-type-error">신청 유형을 선택해 주세요.</FieldError>
    ) : null}
  </Field>

  <Field className="max-w-90">
    <FieldLabel htmlFor="reception-channel" className="font-bold text-foreground">
      접수 경로
    </FieldLabel>
    <Select name="receptionChannel" defaultValue="online" readOnly>
      <SelectTrigger id="reception-channel" className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{/* SelectItem */}</SelectContent>
    </Select>
  </Field>

  <Button type="submit" variant="default" size="sm">선택 내용 확인</Button>
</form>`

// Figma selectbox 의 상태(default/focused/completed/error) 중 정적으로 보여줄 수 있는 것.
const FRUITS = [
    {value: 'apple', label: '사과'},
    {value: 'banana', label: '바나나'},
    {value: 'cherry', label: '체리'},
] as const

const FruitOptions = () =>
    FRUITS.map((f) => (
        <SelectItem key={f.value} value={f.value}>
            {f.label}
        </SelectItem>
    ))

const SelectGuidePage = () => (
    <GuidePageShell
        title="셀렉트 (Select)"
        description="shadcn Select 프리미티브를 프로젝트 wrapper로 확장했습니다. Field와 조합해 라벨·설명·오류가 포함된 단일 선택 입력을 구성합니다."
    >
        <BaseCard>
            <section aria-labelledby="select-demo" className="flex flex-col gap-4">
                <div>
                    <h2 id="select-demo" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">Field</code> 안에 <code className="font-mono">FieldLabel</code>,{' '}
                        <code className="font-mono">Select</code>, <code className="font-mono">FieldDescription</code>을
                        조합합니다. 필수 입력은 라벨에 시각적 별표는 <code className="font-mono">aria-hidden</code>으로
                        숨기고 <code className="font-mono">sr-only</code> 텍스트로 필수 상태를 전달합니다. 라벨은{' '}
                        <code className="font-mono">htmlFor</code>↔<code className="font-mono">id</code>로 연결합니다.
                    </p>
                </div>
                <Field className="max-w-90">
                    <FieldLabel htmlFor="demo-fruit" className="text-foreground gap-1 font-bold">
                        좋아하는 과일
                        <span aria-hidden="true" className="text-error-500">
                            *
                        </span>
                        <span className="sr-only"> (필수)</span>
                    </FieldLabel>
                    <Select required>
                        <SelectTrigger id="demo-fruit" className="w-full" aria-describedby="demo-fruit-help">
                            <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                            <FruitOptions />
                        </SelectContent>
                    </Select>
                    <FieldDescription id="demo-fruit-help">한 가지 과일을 선택해 주세요.</FieldDescription>
                </Field>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="select-size" className="flex flex-col gap-4">
                <div>
                    <h2 id="select-size" className="typo-h4-bold">
                        사이즈 (Size)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        프로젝트에서 사용하는 두 사이즈입니다 — <code className="font-mono">lg</code>(기본, 48px)와{' '}
                        <code className="font-mono">md</code>(40px). <code className="font-mono">size</code> prop으로
                        정합니다.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Field className="max-w-90">
                        <FieldLabel htmlFor="sz-lg" className="text-foreground font-bold">
                            lg (default · 48px)
                        </FieldLabel>
                        <Select>
                            <SelectTrigger id="sz-lg" size="lg" className="w-full">
                                <SelectValue placeholder="선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <FruitOptions />
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field className="max-w-90">
                        <FieldLabel htmlFor="sz-md" className="text-foreground font-bold">
                            md (40px)
                        </FieldLabel>
                        <Select>
                            <SelectTrigger id="sz-md" size="md" className="w-full">
                                <SelectValue placeholder="선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <FruitOptions />
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="select-text" className="flex flex-col gap-4">
                <div>
                    <h2 id="select-text" className="typo-h4-bold">
                        텍스트형 (SelectText)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        면·테두리 없이 글자와 화살표만 두는 선택 컨트롤입니다. 제목 옆에서 기간·구분을 바꾸는 자리처럼
                        입력 필드가 아닌 곳에 씁니다. 목록을{' '}
                        <strong className="text-foreground font-medium">시스템 드롭다운</strong>이 그리므로 위 Select와
                        마크업·동작이 완전히 달라 <code className="font-mono">SelectText</code>로 분리했습니다 —
                        스타일만 같은 theme 파일에서 함께 관리합니다.
                    </p>
                    <p className="typo-body-l-regular text-muted-foreground">
                        상자 높이 대신 글자 줄 높이가 크기를 정합니다 — <code className="font-mono">lg</code>(24/36
                        Bold), <code className="font-mono">md</code>(20/30), <code className="font-mono">sm</code>
                        (16/24). hover와 pressed는 같은 회색 면(gray.50)입니다.
                    </p>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <strong className="text-foreground font-medium">열린 목록은 OS가 그립니다.</strong> 위 Select의
                        패널 스펙(트리거 아래 4px · 옵션 48px · hover blue.50)은 적용되지 않고 macOS·Windows·모바일에서
                        각각 다르게 보입니다. 목록 모양까지 시안에 맞춰야 하면 상자형 Select를 쓰세요. 대신 모바일
                        네이티브 UI와 키보드·스크린리더 대응을 브라우저 기본으로 얻습니다.
                    </p>
                </div>
                <div className="flex flex-wrap items-start gap-8">
                    <SelectText size="lg" options={PERIOD_OPTIONS} defaultValue="all" aria-label="기간 선택(lg)" />
                    <SelectText size="md" options={PERIOD_OPTIONS} defaultValue="all" aria-label="기간 선택(md)" />
                    <SelectText size="sm" options={PERIOD_OPTIONS} defaultValue="all" aria-label="기간 선택(sm)" />
                </div>
                <CodeBlock code={TEXT_VARIANT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="select-state" className="flex flex-col gap-4">
                <div>
                    <h2 id="select-state" className="typo-h4-bold">
                        상태 (State)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기본·값 선택됨·오류·읽기전용·비활성 상태입니다.{' '}
                        <span className="text-foreground font-medium">포커스</span>
                        (탭 이동·열림) 시 테두리가 <code className="font-mono">blue.500</code> 로 바뀝니다.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Field className="max-w-90">
                        <FieldLabel htmlFor="st-default" className="text-foreground font-bold">
                            기본 (default)
                        </FieldLabel>
                        <Select>
                            <SelectTrigger id="st-default" className="w-full">
                                <SelectValue placeholder="선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <FruitOptions />
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field className="max-w-90">
                        <FieldLabel htmlFor="st-completed" className="text-foreground font-bold">
                            값 선택됨 (completed)
                        </FieldLabel>
                        <Select defaultValue="apple">
                            <SelectTrigger id="st-completed" className="w-full">
                                <SelectValue placeholder="선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <FruitOptions />
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field data-invalid className="max-w-90">
                        <FieldLabel htmlFor="st-error" className="text-foreground font-bold">
                            오류 (error)
                        </FieldLabel>
                        <Select>
                            <SelectTrigger
                                id="st-error"
                                aria-invalid="true"
                                aria-describedby="st-error-msg"
                                className="w-full"
                            >
                                <SelectValue placeholder="선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <FruitOptions />
                            </SelectContent>
                        </Select>
                        <FieldError id="st-error-msg">필수 항목입니다.</FieldError>
                    </Field>
                    <Field className="max-w-90">
                        <FieldLabel htmlFor="st-readonly" className="text-foreground font-bold">
                            읽기전용 (readOnly)
                        </FieldLabel>
                        <Select defaultValue="apple" readOnly>
                            <SelectTrigger id="st-readonly" className="w-full">
                                <SelectValue placeholder="선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <FruitOptions />
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field className="max-w-90">
                        <FieldLabel htmlFor="st-disabled" className="text-foreground font-bold">
                            비활성 (disabled)
                        </FieldLabel>
                        <Select defaultValue="apple" disabled>
                            <SelectTrigger id="st-disabled" className="w-full">
                                <SelectValue placeholder="선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <FruitOptions />
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="select-form" className="flex flex-col gap-4">
                <div>
                    <h2 id="select-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Select에 <code className="font-mono">name</code>을 지정하면 선택값이 FormData로 제출됩니다.
                        예시는 <code className="font-mono">required</code> 값을 직접 검증하고 동일 Field 안에{' '}
                        <code className="font-mono">FieldError</code>를 노출합니다. 프로젝트의 readOnly Select는 값을
                        변경할 수 없지만 disabled와 달리 FormData에 포함됩니다.
                    </p>
                </div>
                <SelectFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="select-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="select-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Select 는 여러 하위 요소의 조합입니다. 자주 쓰는 속성입니다.
                    </p>
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
                            {[
                                {
                                    name: 'defaultValue / value',
                                    desc: 'Select — 초기(비제어)/현재(제어) 선택값. onValueChange 와 함께 씁니다.',
                                    def: '-',
                                    control: 'string',
                                },
                                {
                                    name: 'name / required / form',
                                    desc: 'Select — FormData 필드 이름, 필수 상태, 외부 form 요소 연결을 지정합니다.',
                                    def: '- / false / -',
                                    control: 'string / boolean / string',
                                },
                                {
                                    name: 'onValueChange',
                                    desc: 'Select — 선택값이 바뀔 때 호출됩니다. 제어 방식에서는 value와 함께 사용합니다.',
                                    def: '-',
                                    control: '(value: string) => void',
                                },
                                {
                                    name: 'open / defaultOpen / onOpenChange',
                                    desc: 'Select — 목록의 제어·비제어 열림 상태와 변경 콜백입니다. readOnly에서는 wrapper가 열림을 차단합니다.',
                                    def: '- / false / -',
                                    control: 'boolean / boolean / (open: boolean) => void',
                                },
                                {
                                    name: 'disabled',
                                    desc: 'Select — 전체 비활성화.',
                                    def: 'false',
                                    control: 'boolean',
                                },
                                {
                                    name: 'size',
                                    desc: 'SelectTrigger — 상자형은 높이(lg=48px · md=40px), 텍스트형은 글자 크기(lg=24px · md=20px · sm=16px). sm은 텍스트형에만 있습니다.',
                                    def: "'lg'",
                                    control: "'lg' | 'md' | 'sm'",
                                },
                                {
                                    name: 'variant',
                                    desc: 'SelectTrigger — 겉모습. box는 테두리 있는 입력 상자, text는 면 없이 글자와 화살표만 두는 형태입니다. 목록과 동작은 같습니다.',
                                    def: "'box'",
                                    control: "'box' | 'text'",
                                },
                                {
                                    name: 'aria-invalid',
                                    desc: 'SelectTrigger — 오류 상태. 테두리가 error 색으로 바뀝니다(오류 메시지는 aria-describedby 로 연결).',
                                    def: '-',
                                    control: 'boolean',
                                },
                                {
                                    name: 'readOnly',
                                    desc: 'Select — 읽기전용. 값은 유지하되 목록 열기와 값 변경을 막고 읽기전용 스타일을 표시합니다.',
                                    def: 'false',
                                    control: 'boolean',
                                },
                                {
                                    name: 'className',
                                    desc: '추가 클래스명으로 스타일 확장(폼에서는 SelectTrigger 에 w-full).',
                                    def: '""',
                                    control: 'string',
                                },
                            ].map((prop) => (
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

export default SelectGuidePage
