import type {Metadata} from 'next'
import {cn} from '@/lib/utils'
import {BaseCard} from '@/components/composite/base-card'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {TextareaCounter} from '@/components/composite/textarea-counter'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'
import TextareaCounterDemo from './textarea-counter-demo'
import TextareaFormDemo from './textarea-form-demo'

export const metadata: Metadata = {title: '텍스트에어리어 (Textarea)'}

const USAGE_CODE = `const [message, setMessage] = useState('')

<Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
  <FieldLabel htmlFor="message" className="gap-1 font-bold text-foreground">
    문의 내용
    <span aria-hidden="true" className="text-error-500">*</span>
    <span className="sr-only"> (필수)</span>
  </FieldLabel>
  <TextareaCounter
    id="message"
    required
    maxLength={100}
    value={message}
    onChange={(event) => setMessage(event.currentTarget.value)}
    placeholder="내용을 입력하세요"
    aria-describedby="message-help"
    footer={
      <FieldDescription id="message-help">
        문의 내용을 100자 이내로 입력해 주세요.
      </FieldDescription>
    }
  />
</Field>`

const FORM_CODE = `const [inquiry, setInquiry] = useState('')
const [inquiryError, setInquiryError] = useState(false)
const inquiryRef = useRef<HTMLTextAreaElement>(null)

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const nextError = inquiry.trim() === ''
  setInquiryError(nextError)
  if (nextError) {
    inquiryRef.current?.focus()
    return
  }

  const formData = new FormData(event.currentTarget)
  console.log(Object.fromEntries(formData))
}

<form noValidate onSubmit={handleSubmit}>
  <Field data-invalid={inquiryError || undefined} className={cn('max-w-90', FIELD_FOCUS_RING)}>
    <FieldLabel htmlFor="inquiry" className="gap-1 font-bold text-foreground">
      문의 내용
      <span aria-hidden="true" className="text-error-500">*</span>
      <span className="sr-only"> (필수)</span>
    </FieldLabel>
    <TextareaCounter
      ref={inquiryRef}
      id="inquiry"
      name="inquiry"
      required
      maxLength={100}
      value={inquiry}
      onChange={(event) => {
        setInquiry(event.currentTarget.value)
        setInquiryError(false)
      }}
      aria-invalid={inquiryError || undefined}
      aria-describedby={inquiryError ? 'inquiry-error' : undefined}
      footer={inquiryError ? <FieldError id="inquiry-error">문의 내용을 입력해 주세요.</FieldError> : null}
    />
  </Field>

  <Button type="submit" variant="default" size="md">입력 내용 확인</Button>
</form>`

const PROPS_ITEMS = [
    {
        name: 'name / value / defaultValue',
        desc: '폼 필드 이름과 제어·비제어 입력값입니다.',
        def: '-',
        control: 'string',
    },
    {
        name: 'onChange',
        desc: '입력값이 변경될 때 호출됩니다.',
        def: '-',
        control: 'ChangeEventHandler<HTMLTextAreaElement>',
    },
    {
        name: 'placeholder',
        desc: '비어 있을 때 표시되는 안내 문구입니다. 라벨을 대체하지 않습니다.',
        def: '-',
        control: 'string',
    },
    {
        name: 'maxLength',
        desc: '최대 입력 글자 수입니다. TextareaCounter에서는 카운터의 최댓값으로도 사용합니다.',
        def: '-',
        control: 'number',
    },
    {
        name: 'required / form',
        desc: '필수 상태를 지정하고 외부 form 요소와 연결합니다.',
        def: 'false / -',
        control: 'boolean / string',
    },
    {name: 'disabled', desc: '비활성. 입력할 수 없고 폼 제출에서도 제외됩니다.', def: 'false', control: 'boolean'},
    {name: 'readOnly', desc: '읽기전용. 수정할 수 없지만 값은 폼 제출에 포함됩니다.', def: 'false', control: 'boolean'},
    {
        name: 'aria-invalid / aria-describedby',
        desc: '오류 상태와 도움말·오류 메시지를 연결합니다.',
        def: '-',
        control: 'boolean / string',
    },
    {
        name: 'className',
        desc: 'Textarea 또는 TextareaCounter 입력 영역의 스타일을 확장합니다.',
        def: '""',
        control: 'string',
    },
    {
        name: 'containerClassName',
        desc: 'TextareaCounter의 Textarea와 외부 카운터를 감싸는 컨테이너 레이아웃을 확장합니다.',
        def: '""',
        control: 'string',
    },
    {
        name: 'footer',
        desc: '카운터 왼쪽에 표시할 FieldDescription 또는 FieldError입니다. 긴 문구는 카운터 앞에서 줄바꿈됩니다.',
        def: '-',
        control: 'ReactNode',
    },
] as const

const FIELD_CLASS = 'max-w-90'

const TextareaGuidePage = () => (
    <GuidePageShell
        title="텍스트에어리어 (Textarea)"
        description="shadcn Textarea primitive와 외부 글자 수 영역을 제공하는 TextareaCounter composite입니다. Field와 조합해 여러 줄 입력을 구성합니다."
    >
        <BaseCard>
            <section aria-labelledby="textarea-demo" className="flex flex-col gap-4">
                <div>
                    <h2 id="textarea-demo" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        글자 수가 필요한 경우 <code className="font-mono">TextareaCounter</code>를 사용합니다. 원래
                        디자인에 맞춰 Textarea와 카운터를 형제로 배치하고 카운터는 입력 테두리 밖 오른쪽에 표시합니다.
                        현재 글자 수는 입력할 때 자동으로 갱신되며 Field 포커스링은 라벨·Textarea·카운터 전체를
                        감쌉니다.
                    </p>
                </div>
                <TextareaCounterDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="textarea-state" className="flex flex-col gap-4">
                <div>
                    <h2 id="textarea-state" className="typo-h4-bold">
                        상태 (State)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기본·값 입력됨·오류·비활성·읽기전용 상태입니다. 포커스링은 Button과 같은 solid outline이며
                        Field로 감싼 경우 라벨과 입력 영역 전체를 표시합니다. 프로젝트 Textarea는 최소 높이 120px이고
                        크기 조절을 막아 내용이 넘치면 내부 스크롤을 사용합니다.
                    </p>
                </div>
                <div className="grid grid-cols-1 justify-items-start gap-6 xl:grid-cols-2">
                    <Field className={cn(FIELD_CLASS, FIELD_FOCUS_RING)}>
                        <FieldLabel htmlFor="st-default" className="text-foreground font-bold">
                            기본 (default)
                        </FieldLabel>
                        <TextareaCounter id="st-default" maxLength={100} placeholder="내용을 입력하세요" />
                    </Field>
                    <Field className={cn(FIELD_CLASS, FIELD_FOCUS_RING)}>
                        <FieldLabel htmlFor="st-completed" className="text-foreground font-bold">
                            값 입력됨 (completed)
                        </FieldLabel>
                        <TextareaCounter id="st-completed" maxLength={100} defaultValue="입력된 내용입니다." />
                    </Field>
                    <Field data-invalid className={cn(FIELD_CLASS, FIELD_FOCUS_RING)}>
                        <FieldLabel htmlFor="st-error" className="text-foreground font-bold">
                            오류 (error)
                        </FieldLabel>
                        <TextareaCounter
                            id="st-error"
                            maxLength={100}
                            placeholder="내용을 입력하세요"
                            aria-invalid
                            aria-describedby="st-error-msg"
                            footer={<FieldError id="st-error-msg">필수 항목입니다.</FieldError>}
                        />
                    </Field>
                    <Field className={cn(FIELD_CLASS, FIELD_FOCUS_RING)}>
                        <FieldLabel htmlFor="st-disabled" className="text-foreground font-bold">
                            비활성 (disabled)
                        </FieldLabel>
                        <TextareaCounter
                            id="st-disabled"
                            maxLength={100}
                            defaultValue="비활성 입력 내용입니다."
                            disabled
                        />
                    </Field>
                    <Field className={cn(FIELD_CLASS, FIELD_FOCUS_RING)}>
                        <FieldLabel htmlFor="st-view" className="text-foreground font-bold">
                            읽기전용 (readOnly)
                        </FieldLabel>
                        <TextareaCounter id="st-view" maxLength={100} defaultValue="수정 불가한 내용입니다." readOnly />
                    </Field>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="textarea-form" className="flex flex-col gap-4">
                <div>
                    <h2 id="textarea-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        네이티브 Textarea에 <code className="font-mono">name</code>을 지정하면 값이 FormData로
                        제출됩니다. 예시는 필수값을 직접 검증해 <code className="font-mono">FieldError</code>를 표시하고
                        첫 오류 입력으로 포커스를 이동합니다. TextareaCounter도 동일한 네이티브 textarea를 사용하며
                        readOnly 값은 제출되지만 disabled 값은 제출되지 않습니다.
                    </p>
                </div>
                <TextareaFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="textarea-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="textarea-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Textarea는 네이티브 textarea 속성을, TextareaCounter는 동일 속성과 카운터 구성을 지원합니다.
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

export default TextareaGuidePage
