import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'
import {Textarea} from '@/components/ui/textarea'
import TextareaCounterDemo from './textarea-counter-demo'
import TextareaFormDemo from './textarea-form-demo'

export const metadata: Metadata = {title: '텍스트에어리어 (Textarea)'}

const BASIC_CODE = `{/* 글자 수 제한이 없는 기본 여러 줄 입력 */}
<Field className="max-w-90">
  <FieldLabel htmlFor="summary" className="font-bold text-foreground">
    요약
  </FieldLabel>
  <Textarea
    id="summary"
    name="summary"
    placeholder="내용을 입력하세요"
  />
</Field>

{/* 글자 수 제한과 카운터가 필요한 입력 */}
<Field className="max-w-90">
  <FieldLabel htmlFor="inquiry" className="font-bold text-foreground">
    문의 내용
  </FieldLabel>
  <TextareaCounter
    id="inquiry"
    name="inquiry"
    maxLength={100}
    placeholder="내용을 입력하세요"
  />
</Field>`

const STATE_CODE = `{/* 기본 */}
<Textarea name="summary" placeholder="내용을 입력하세요" />

{/* 값 입력됨 */}
<Textarea name="summary" defaultValue="입력된 내용입니다." />

{/* 오류 */}
<Textarea
  name="summary"
  aria-invalid="true"
  aria-describedby="summary-error"
/>

{/* 비활성 */}
<Textarea value="비활성 내용입니다." disabled readOnly />

{/* 읽기전용 */}
<Textarea name="summary" value="수정할 수 없는 내용입니다." readOnly />`

const FORM_CODE = `const inquiryRef = useRef<HTMLTextAreaElement>(null)
const [inquiry, setInquiry] = useState('')
const [inquiryError, setInquiryError] = useState(false)

const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
  event.preventDefault()
  const nextError = inquiry.trim() === ''
  setInquiryError(nextError)

  if (nextError) {
    inquiryRef.current?.focus()
    return
  }

  console.log(Object.fromEntries(new FormData(event.currentTarget)))
}

<form noValidate onSubmit={handleSubmit}>
  <Field data-invalid={inquiryError || undefined}>
    <FieldLabel htmlFor="inquiry">문의 내용</FieldLabel>
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
      placeholder="내용을 입력하세요"
      aria-invalid={inquiryError || undefined}
      aria-describedby={inquiryError ? 'inquiry-error' : undefined}
      footer={
        inquiryError
          ? <FieldError id="inquiry-error">문의 내용을 입력해 주세요.</FieldError>
          : null
      }
    />
  </Field>

  <Button type="submit">입력 내용 확인</Button>
</form>`

const TYPE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'use', header: '사용 기준', align: 'start', wrap: true},
    {key: 'behavior', header: '동작', align: 'start', wrap: true},
] as const

const TYPE_ROWS = [
    {
        key: 'textarea',
        cells: [
            <code key="component">Textarea</code>,
            '글자 수 제한을 화면에 표시할 필요가 없는 여러 줄 입력',
            '최소 높이 120px, 크기 조절 없음, 내용이 넘치면 내부 스크롤',
        ],
    },
    {
        key: 'counter',
        cells: [
            <code key="component">TextareaCounter</code>,
            '최대 글자 수와 현재 글자 수를 사용자에게 보여줘야 하는 입력',
            'Textarea 아래에 현재 글자 수와 maxLength를 자동 표시',
        ],
    },
] as const

const STATE_COLUMNS = [
    {key: 'state', header: '상태', align: 'start', rowHeader: true},
    {key: 'prop', header: '지정 방법', align: 'start'},
    {key: 'behavior', header: '동작', align: 'start', wrap: true},
] as const

const STATE_ROWS = [
    {
        key: 'invalid',
        cells: [
            '오류',
            <code key="prop">aria-invalid</code>,
            'Field에도 data-invalid를 지정하고 메시지를 aria-describedby로 연결합니다.',
        ],
    },
    {
        key: 'disabled',
        cells: ['비활성', <code key="prop">disabled</code>, '수정·포커스·폼 제출에서 제외됩니다.'],
    },
    {
        key: 'readonly',
        cells: ['읽기전용', <code key="prop">readOnly</code>, '수정할 수 없지만 포커스와 폼 제출은 유지됩니다.'],
    },
] as const

const API_COLUMNS = [
    {key: 'scope', header: '대상', align: 'start', rowHeader: true},
    {key: 'prop', header: 'Prop', align: 'start'},
    {key: 'type', header: '값', align: 'start', wrap: true},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const API_ROWS = [
    {
        key: 'value',
        cells: [
            '공통',
            <code key="prop">name / value / defaultValue / onChange</code>,
            <code key="type">TextareaHTMLAttributes</code>,
            '폼 필드 이름과 제어·비제어 입력값을 관리합니다.',
        ],
    },
    {
        key: 'placeholder',
        cells: [
            '공통',
            <code key="prop">placeholder</code>,
            <code key="type">string</code>,
            '입력 예시나 형식을 안내하며 Label을 대신할 수 없습니다.',
        ],
    },
    {
        key: 'validation',
        cells: [
            '공통',
            <code key="prop">required / minLength / maxLength</code>,
            <code key="type">native attributes</code>,
            '입력 길이와 필수 조건을 정의합니다.',
        ],
    },
    {
        key: 'state',
        cells: [
            '공통',
            <code key="prop">disabled / readOnly / aria-invalid</code>,
            <code key="type">boolean</code>,
            '비활성·읽기전용·오류 상태를 전달합니다.',
        ],
    },
    {
        key: 'describedby',
        cells: [
            '공통',
            <code key="prop">id / aria-describedby</code>,
            <code key="type">string</code>,
            'FieldLabel과 설명 또는 오류 메시지를 연결합니다.',
        ],
    },
    {
        key: 'counter-max',
        cells: [
            'TextareaCounter',
            <code key="prop">maxLength</code>,
            <code key="type">number</code>,
            '필수값이며 입력 제한과 카운터 최댓값에 함께 사용됩니다.',
        ],
    },
    {
        key: 'counter-footer',
        cells: [
            'TextareaCounter',
            <code key="prop">footer</code>,
            <code key="type">ReactNode</code>,
            '카운터 왼쪽에 FieldDescription 또는 FieldError를 표시합니다.',
        ],
    },
    {
        key: 'counter-class',
        cells: [
            'TextareaCounter',
            <code key="prop">containerClassName</code>,
            <code key="type">string</code>,
            'Textarea와 카운터를 감싸는 컨테이너 레이아웃을 확장합니다.',
        ],
    },
] as const

const FIELD_CLASS = 'max-w-90'

const TextareaGuidePage = () => (
    <GuidePageShell
        title="텍스트에어리어 (Textarea)"
        description="여러 줄 텍스트를 입력하는 Textarea와 글자 수를 함께 제공하는 TextareaCounter의 사용 기준입니다."
    >
        <BaseCard variant="outlined">
            <section aria-labelledby="textarea-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="textarea-basic" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        글자 수 안내가 필요 없으면 <code>Textarea</code>, 최대 글자 수를 보여줘야 하면{' '}
                        <code>TextareaCounter</code>를 사용합니다. 포커스링은 라벨을 제외한 입력 영역에만 표시됩니다.
                    </p>
                </div>
                <Table
                    caption="Textarea와 TextareaCounter 선택 기준"
                    columns={TYPE_COLUMNS}
                    rows={TYPE_ROWS}
                    size="md"
                />
                <div className="grid gap-6 lg:grid-cols-2">
                    <Field className={FIELD_CLASS}>
                        <FieldLabel htmlFor="textarea-basic-default" className="text-foreground font-bold">
                            요약
                        </FieldLabel>
                        <Textarea id="textarea-basic-default" name="summary" placeholder="내용을 입력하세요" />
                    </Field>
                    <TextareaCounterDemo />
                </div>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="textarea-state" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="textarea-state" className="typo-h4-bold">
                        상태와 오류
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Field와 Textarea의 상태를 함께 지정해 라벨, 입력 영역, 메시지의 의미를 일치시킵니다.
                    </p>
                </div>
                <Table caption="Textarea 상태 처리 기준" columns={STATE_COLUMNS} rows={STATE_ROWS} size="md" />
                <div className="grid gap-6 lg:grid-cols-2">
                    <Field className={FIELD_CLASS}>
                        <FieldLabel htmlFor="textarea-state-default" className="text-foreground font-bold">
                            기본
                        </FieldLabel>
                        <Textarea id="textarea-state-default" name="defaultNote" placeholder="내용을 입력하세요" />
                    </Field>
                    <Field className={FIELD_CLASS}>
                        <FieldLabel htmlFor="textarea-state-filled" className="text-foreground font-bold">
                            값 입력됨
                        </FieldLabel>
                        <Textarea id="textarea-state-filled" name="filledNote" defaultValue="입력된 내용입니다." />
                    </Field>
                    <Field data-invalid className={FIELD_CLASS}>
                        <FieldLabel htmlFor="textarea-state-error" className="text-foreground font-bold">
                            오류
                        </FieldLabel>
                        <Textarea
                            id="textarea-state-error"
                            name="errorNote"
                            placeholder="내용을 입력하세요"
                            aria-invalid="true"
                            aria-describedby="textarea-state-error-message"
                        />
                        <FieldError id="textarea-state-error-message">내용을 입력해 주세요.</FieldError>
                    </Field>
                    <Field data-disabled="true" className={FIELD_CLASS}>
                        <FieldLabel htmlFor="textarea-state-disabled" className="text-foreground font-bold">
                            비활성
                        </FieldLabel>
                        <Textarea id="textarea-state-disabled" value="비활성 내용입니다." disabled readOnly />
                    </Field>
                    <Field className={FIELD_CLASS}>
                        <FieldLabel htmlFor="textarea-state-readonly" className="text-foreground font-bold">
                            읽기전용
                        </FieldLabel>
                        <Textarea
                            id="textarea-state-readonly"
                            name="readonlyNote"
                            value="수정할 수 없는 내용입니다."
                            readOnly
                        />
                    </Field>
                </div>
                <CodeBlock code={STATE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="textarea-form" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="textarea-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        필수값을 검증하고 오류 메시지를 연결한 뒤 첫 오류 입력으로 포커스를 이동합니다.{' '}
                        <code>readOnly</code> 값은 제출되지만 <code>disabled</code> 값은 FormData에서 제외됩니다.
                    </p>
                </div>
                <TextareaFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="textarea-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="textarea-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Textarea는 네이티브 textarea 속성을 지원하며 TextareaCounter는 카운터용 속성을 추가합니다.
                    </p>
                </div>
                <Table caption="Textarea Props API" columns={API_COLUMNS} rows={API_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default TextareaGuidePage
