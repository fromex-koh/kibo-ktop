import type {Metadata} from 'next'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Field, FieldContent, FieldDescription, FieldLabel} from '@/components/ui/field'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import RadioFormDemo from './radio-form-demo'

export const metadata: Metadata = {title: '라디오 (Radio)'}

const USAGE_CODE = `<RadioGroup defaultValue="card" aria-label="결제 수단">
  <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
    <RadioGroupItem value="card" id="pay-card" aria-labelledby="pay-card-label" />
    <FieldLabel id="pay-card-label" htmlFor="pay-card">신용카드</FieldLabel>
  </Field>
  <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
    <RadioGroupItem value="transfer" id="pay-transfer" aria-labelledby="pay-transfer-label" />
    <FieldLabel id="pay-transfer-label" htmlFor="pay-transfer">계좌이체</FieldLabel>
  </Field>
</RadioGroup>`

const DEPTH1_CODE = `<Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
  <RadioGroupItem value="r1" id="r-1" aria-labelledby="r-1-label" />
  <FieldLabel id="r-1-label" htmlFor="r-1">라디오버튼</FieldLabel>
</Field>`

const DEPTH2_CODE = `<Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
  <RadioGroupItem value="r2" id="r-2" aria-labelledby="r-2-label" aria-describedby="r-2-desc" />
  <FieldContent>
    <FieldLabel id="r-2-label" htmlFor="r-2" className="font-bold text-foreground">라디오버튼</FieldLabel>
    <FieldDescription id="r-2-desc" className="typo-body-xl-regular text-label-foreground">
      2depth 스타일의 부가적인 설명이 들어갈 경우 해당 예시처럼 사용됩니다.
    </FieldDescription>
  </FieldContent>
</Field>`

const FORM_CODE = `const [paymentMethod, setPaymentMethod] = useState('')
const [paymentError, setPaymentError] = useState(false)
const paymentRef = useRef<HTMLButtonElement>(null)

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const nextPaymentError = paymentMethod === ''
  setPaymentError(nextPaymentError)

  if (nextPaymentError) {
    paymentRef.current?.focus()
    return
  }

  const formData = new FormData(event.currentTarget)
  formData.get('paymentMethod') // "card" 또는 "transfer"
}

<form noValidate onSubmit={handleSubmit}>
  <FieldSet data-invalid={paymentError || undefined}>
    <FieldLegend id="payment-method-label">결제 수단 (필수)</FieldLegend>
    <RadioGroup
      name="paymentMethod"
      value={paymentMethod}
      onValueChange={(value) => {
        setPaymentMethod(value)
        setPaymentError(false)
      }}
      required
      aria-labelledby="payment-method-label"
      aria-invalid={paymentError || undefined}
      aria-describedby={paymentError ? 'payment-method-error' : undefined}
    >
      <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
        <RadioGroupItem ref={paymentRef} id="payment-card" value="card" />
        <FieldLabel htmlFor="payment-card">신용카드</FieldLabel>
      </Field>
      <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
        <RadioGroupItem id="payment-transfer" value="transfer" />
        <FieldLabel htmlFor="payment-transfer">계좌이체</FieldLabel>
      </Field>
    </RadioGroup>
    {paymentError ? <FieldError id="payment-method-error">결제 수단을 선택해 주세요.</FieldError> : null}
  </FieldSet>

  <Button type="submit" variant="default" size="md">선택 내용 확인</Button>
</form>`

// Figma radio 의 두 축 — check(off/on) × state(default/disabled).
const CHECK_ROWS = [
    {key: 'off', label: 'Off (미선택)', checked: false},
    {key: 'on', label: 'On (선택)', checked: true},
] as const

const STATE_COLS = [
    {key: 'default', label: 'Default', disabled: false},
    {key: 'disabled', label: 'Disabled', disabled: true},
] as const

// RadioGroupItem은 Field/FieldLabel과 조합하고, 2depth 설명은 FieldContent/FieldDescription으로 연결한다.
// 상태 매트릭스의 각 셀은 독립적인 RadioGroup으로 감싸 선택·비활성 상태를 시연한다.
const RadioGuidePage = () => (
    <GuidePageShell
        title="라디오 (Radio)"
        description="shadcn RadioGroup 프리미티브입니다. Field와 조합해 라벨·설명이 포함된 단일 선택 항목을 구성합니다."
    >
        <section aria-labelledby="radio-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="radio-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">RadioGroup</code> 안에 <code className="font-mono">RadioGroupItem</code>{' '}
                    을 넣어 단일 선택을 만듭니다. shadcn <code className="font-mono">Field</code> 안에서{' '}
                    <code className="font-mono">FieldLabel</code>의 <code className="font-mono">htmlFor</code>와{' '}
                    <code className="font-mono">RadioGroupItem</code>의 <code className="font-mono">id</code>를
                    연결합니다. 프로젝트 Radio 크기는 24px로 고정되어 별도의 <code className="font-mono">size</code>{' '}
                    prop을 제공하지 않습니다.
                </p>
            </div>
            <RadioGroup defaultValue="card" aria-label="결제 수단" className="flex flex-col gap-3">
                <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                    <RadioGroupItem value="card" id="pay-card" aria-labelledby="pay-card-label" />
                    <FieldLabel id="pay-card-label" htmlFor="pay-card">
                        신용카드
                    </FieldLabel>
                </Field>
                <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                    <RadioGroupItem value="transfer" id="pay-transfer" aria-labelledby="pay-transfer-label" />
                    <FieldLabel id="pay-transfer-label" htmlFor="pay-transfer">
                        계좌이체
                    </FieldLabel>
                </Field>
            </RadioGroup>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="radio-state" className="flex flex-col gap-4">
            <div>
                <h2 id="radio-state" className="typo-h4-bold">
                    상태 (State)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    선택(off/on) × 상태(default/disabled) 조합입니다. 선택됨은{' '}
                    <code className="font-mono">blue.500</code> 원에 흰 점, 비활성은 회색 원(
                    <code className="font-mono">gray.100</code>)으로 표현됩니다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">라디오 선택·상태 조합 미리보기</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                선택
                            </th>
                            {STATE_COLS.map((col) => (
                                <th key={col.key} scope="col" className="typo-body-l-medium px-4 py-3">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {CHECK_ROWS.map((row) => (
                            <tr key={row.key} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-middle font-mono font-normal whitespace-nowrap"
                                >
                                    {row.label}
                                </th>
                                {STATE_COLS.map((col) => (
                                    <td key={col.key} className="px-4 py-3 align-middle">
                                        <div className="flex flex-col items-start gap-2">
                                            <RadioGroup
                                                defaultValue={row.checked ? 'on' : 'off'}
                                                disabled={col.disabled}
                                                aria-label={`${row.label} ${col.label}`}
                                                className="w-auto"
                                            >
                                                <Field
                                                    orientation="horizontal"
                                                    className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}
                                                >
                                                    <RadioGroupItem
                                                        value="on"
                                                        id={`radio-${row.key}-${col.key}`}
                                                        aria-labelledby={`radio-${row.key}-${col.key}-label`}
                                                    />
                                                    <FieldLabel
                                                        id={`radio-${row.key}-${col.key}-label`}
                                                        htmlFor={`radio-${row.key}-${col.key}`}
                                                    >
                                                        라디오버튼
                                                    </FieldLabel>
                                                </Field>
                                            </RadioGroup>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="radio-depth" className="flex flex-col gap-4">
            <div>
                <h2 id="radio-depth" className="typo-h4-bold">
                    라벨 구성 (Depth)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    별도 컴포넌트가 아니라 <code className="font-mono">RadioGroupItem</code> +{' '}
                    <code className="font-mono">FieldLabel</code> (+ <code className="font-mono">FieldDescription</code>
                    ) 조합으로 두 형태를 만듭니다.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <RadioGroup defaultValue="r1" aria-label="1depth 라디오 예시" className="flex flex-col gap-2">
                    <h3 className="typo-body-l-medium text-foreground">1depth — 라벨만</h3>
                    <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                        <RadioGroupItem value="r1" id="depth-r1" aria-labelledby="depth-r1-label" />
                        <FieldLabel id="depth-r1-label" htmlFor="depth-r1">
                            라디오버튼
                        </FieldLabel>
                    </Field>
                    <CodeBlock code={DEPTH1_CODE} language="tsx" copyLabel="복사" />
                </RadioGroup>

                <RadioGroup defaultValue="r2" aria-label="2depth 라디오 예시" className="flex flex-col gap-2">
                    <h3 className="typo-body-l-medium text-foreground">2depth — 제목 + 설명</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        제목은 <code className="font-mono">FieldLabel</code>(볼드), 설명은{' '}
                        <code className="font-mono">FieldDescription</code>으로 두고{' '}
                        <code className="font-mono">aria-describedby</code>로 연결합니다.{' '}
                        <code className="font-mono">FieldContent</code>가 제목과 설명을 세로로 정렬하며{' '}
                        <code className="font-mono">max-w-90</code> 폭에서 줄바꿈됩니다.
                    </p>
                    <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                        <RadioGroupItem
                            value="r2"
                            id="depth-r2"
                            aria-labelledby="depth-r2-label"
                            aria-describedby="depth-r2-desc"
                        />
                        <FieldContent>
                            <FieldLabel id="depth-r2-label" htmlFor="depth-r2" className="text-foreground font-bold">
                                라디오버튼
                            </FieldLabel>
                            <FieldDescription id="depth-r2-desc" className="typo-body-xl-regular text-label-foreground">
                                2depth 스타일의 부가적인 설명이 들어갈 경우 해당 예시처럼 사용됩니다.
                            </FieldDescription>
                        </FieldContent>
                    </Field>
                    <CodeBlock code={DEPTH2_CODE} language="tsx" copyLabel="복사" />
                </RadioGroup>
            </div>
        </section>

        <section aria-labelledby="radio-form" className="flex flex-col gap-4">
            <div>
                <h2 id="radio-form" className="typo-h4-bold">
                    폼 제출
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    실제 <code className="font-mono">form</code> 안에서 <code className="font-mono">RadioGroup</code>에{' '}
                    <code className="font-mono">name</code>, 각 <code className="font-mono">RadioGroupItem</code>에
                    고유한 <code className="font-mono">value</code>를 지정하면 선택값 하나가 제출됩니다.{' '}
                    <code className="font-mono">required</code>는 그룹의 필수 선택을 검증하고,{' '}
                    <code className="font-mono">form</code>은 외부 form 요소와 연결할 때 사용합니다.{' '}
                    <code className="font-mono">disabled</code> 항목은 제출에서 제외됩니다. 제출 시 선택하지 않은 첫
                    번째 필수 그룹으로 포커스를 이동하며, 1depth는 선택지 아래에, 2depth는 설명이 포함된 선택지 아래에{' '}
                    <code className="font-mono">FieldError</code>를{' '}
                    <code className="font-mono">role=&quot;alert&quot;</code>로 노출합니다.
                </p>
                <div className="bg-surface border-border mt-3 flex flex-col gap-1 rounded-md border p-4">
                    <h3 className="typo-body-l-medium text-foreground">WAVE 검사 예외 — Missing form label</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <a
                            href="https://www.radix-ui.com/primitives/docs/components/radio-group"
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline underline-offset-4"
                        >
                            Radix Radio Group
                        </a>
                        이 폼 데이터와 이벤트를 전달하기 위해 자동 생성하는 보조{' '}
                        <code className="font-mono">input</code>에는 Label이 연결되지 않아 WAVE가{' '}
                        <em>Missing form label</em>로 탐지할 수 있습니다. 해당 input은{' '}
                        <code className="font-mono">aria-hidden=&quot;true&quot;</code>와{' '}
                        <code className="font-mono">tabindex=&quot;-1&quot;</code>로 접근성 트리와 키보드 탐색에서
                        제외됩니다. 실제 조작 요소인 <code className="font-mono">button[role=&quot;radio&quot;]</code>는
                        연결된 Label을 통해 접근 가능한 이름을 제공하므로 실제 사용자 접근성에 영향을 주지 않는 자동
                        검사 오탐으로 판단하여 예외 처리합니다.
                    </p>
                </div>
            </div>
            <RadioFormDemo />
            <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="radio-props" className="flex flex-col gap-4">
            <div>
                <h2 id="radio-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    RadioGroup(그룹)·RadioGroupItem(개별 원)에서 자주 쓰는 속성입니다.
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
                                name: 'defaultValue',
                                desc: 'RadioGroup — 비제어 그룹의 초기 선택값(RadioGroupItem 의 value).',
                                def: '-',
                                control: 'string',
                            },
                            {
                                name: 'value',
                                desc: 'RadioGroupItem 은 고유 value 를, RadioGroup 은 제어 시 현재 선택값을 받습니다.',
                                def: '-',
                                control: 'string',
                            },
                            {
                                name: 'onValueChange',
                                desc: 'RadioGroup — 선택이 바뀔 때 호출되는 콜백입니다.',
                                def: '-',
                                control: '(value: string) => void',
                            },
                            {
                                name: 'name',
                                desc: 'RadioGroup — 폼 제출 시 사용할 필드 이름입니다.',
                                def: '-',
                                control: 'string',
                            },
                            {
                                name: 'required / form',
                                desc: 'RadioGroup — 필수 상태를 표시하고 외부 form 요소와 연결합니다. 가이드 예시는 FieldError를 위한 커스텀 검증을 사용합니다.',
                                def: 'false / -',
                                control: 'boolean / string',
                            },
                            {
                                name: 'disabled',
                                desc: 'RadioGroup(전체) 또는 RadioGroupItem(개별)을 비활성화합니다.',
                                def: 'false',
                                control: 'boolean',
                            },
                            {
                                name: 'id / aria-describedby / aria-invalid',
                                desc: 'Label, 부가 설명, 유효성 검사 상태를 RadioGroup 또는 RadioGroupItem과 연결합니다.',
                                def: '-',
                                control: 'string / string / boolean',
                            },
                            {
                                name: 'className',
                                desc: '추가 클래스명으로 스타일 확장',
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
    </GuidePageShell>
)

export default RadioGuidePage
