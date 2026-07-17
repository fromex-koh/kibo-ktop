import type {Metadata} from 'next'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldContent, FieldDescription, FieldLabel} from '@/components/ui/field'
import CheckboxFormDemo from './checkbox-form-demo'
import CheckboxIndeterminateDemo from './checkbox-indeterminate-demo'

export const metadata: Metadata = {title: '체크박스 (Checkbox)'}

const USAGE_CODE = `<Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
  <Checkbox id="terms" defaultChecked aria-labelledby="terms-label" />
  <FieldLabel id="terms-label" htmlFor="terms">이용약관에 동의합니다</FieldLabel>
</Field>`

const DEPTH1_CODE = `<Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
  <Checkbox id="agree-1" aria-labelledby="agree-1-label" />
  <FieldLabel id="agree-1-label" htmlFor="agree-1">체크박스</FieldLabel>
</Field>`

const DEPTH2_CODE = `<Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
  <Checkbox id="agree-2" aria-labelledby="agree-2-label" aria-describedby="agree-2-desc" />
  <FieldContent>
    <FieldLabel id="agree-2-label" htmlFor="agree-2" className="font-bold text-foreground">체크박스</FieldLabel>
    <FieldDescription id="agree-2-desc" className="typo-body-xl-regular text-label-foreground">
      2depth 스타일의 부가적인 설명이 들어갈 경우 해당 예시처럼 사용됩니다.
    </FieldDescription>
  </FieldContent>
</Field>`

const INDETERMINATE_CODE = `const [selected, setSelected] = useState(() => new Set(['email']))
const options = ['email', 'message', 'push']
const checked: ComponentProps<typeof Checkbox>['checked'] =
  selected.size === options.length ? true : selected.size === 0 ? false : 'indeterminate'

<Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
  <Checkbox
    id="notification-all"
    aria-labelledby="notification-all-label"
    checked={checked}
    onCheckedChange={(nextChecked) =>
      setSelected(nextChecked === true ? new Set(options) : new Set())
    }
  />
  <FieldLabel id="notification-all-label" htmlFor="notification-all">알림 전체 선택</FieldLabel>
</Field>

{options.map((option) => (
  <Field key={option} orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
    <Checkbox id={\`notification-\${option}\`} checked={selected.has(option)} />
    <FieldLabel htmlFor={\`notification-\${option}\`}>{option}</FieldLabel>
  </Field>
))}`

const FORM_CODE = `const [privacyChecked, setPrivacyChecked] = useState(false)
const [privacyError, setPrivacyError] = useState(false)
const [termsChecked, setTermsChecked] = useState(false)
const [termsError, setTermsError] = useState(false)
const privacyRef = useRef<HTMLButtonElement>(null)
const termsRef = useRef<HTMLButtonElement>(null)

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()

  const nextPrivacyError = !privacyChecked
  const nextTermsError = !termsChecked
  setPrivacyError(nextPrivacyError)
  setTermsError(nextTermsError)

  if (nextPrivacyError || nextTermsError) {
    if (nextPrivacyError) privacyRef.current?.focus()
    else termsRef.current?.focus()
    return
  }

  const formData = new FormData(event.currentTarget)
}

<form noValidate onSubmit={handleSubmit}>
  <FieldSet>
    <FieldLegend>관심 분야</FieldLegend>
    <FieldDescription>관심 있는 분야를 모두 선택해 주세요.</FieldDescription>
    <FieldGroup>
      <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
        <Checkbox id="interest-ai" name="interest" value="ai" />
        <FieldLabel htmlFor="interest-ai">AI</FieldLabel>
      </Field>
      <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
        <Checkbox id="interest-cloud" name="interest" value="cloud" />
        <FieldLabel htmlFor="interest-cloud">클라우드</FieldLabel>
      </Field>
    </FieldGroup>
  </FieldSet>

  {/* 1depth: 라벨 + 유효성 검사 */}
  <Field
    orientation="horizontal"
    data-invalid={privacyError || undefined}
    className={cn('w-fit', FIELD_FOCUS_RING)}
  >
    <Checkbox
      ref={privacyRef}
      id="privacy"
      name="privacy"
      value="confirmed"
      checked={privacyChecked}
      onCheckedChange={(checked) => {
        const nextChecked = checked === true
        setPrivacyChecked(nextChecked)
        if (nextChecked) setPrivacyError(false)
      }}
      required
      aria-invalid={privacyError || undefined}
      aria-describedby={privacyError ? 'privacy-error' : undefined}
    />
    <FieldContent className={privacyError ? undefined : 'min-h-6 justify-center'}>
      <FieldLabel htmlFor="privacy">개인정보 처리방침을 확인했습니다. (필수)</FieldLabel>
      {privacyError ? <FieldError id="privacy-error">개인정보 처리방침을 확인해 주세요.</FieldError> : null}
    </FieldContent>
  </Field>

  {/* 2depth: 라벨 + 설명 + 유효성 검사 */}
  <Field
    orientation="horizontal"
    data-invalid={termsError || undefined}
    className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}
  >
    <Checkbox
      ref={termsRef}
      id="terms"
      name="terms"
      value="agreed"
      checked={termsChecked}
      onCheckedChange={(checked) => {
        const nextChecked = checked === true
        setTermsChecked(nextChecked)
        if (nextChecked) setTermsError(false)
      }}
      required
      aria-invalid={termsError || undefined}
      aria-describedby={termsError ? 'terms-description terms-error' : 'terms-description'}
    />
    <FieldContent>
      <div className="flex flex-col gap-0.5">
        <FieldLabel htmlFor="terms" className="font-bold text-foreground">
          이용약관에 동의합니다. (필수)
        </FieldLabel>
        <FieldDescription id="terms-description" className="typo-body-xl-regular text-label-foreground">
          서비스 이용을 위해 이용약관 동의가 필요합니다.
        </FieldDescription>
      </div>
      {termsError ? <FieldError id="terms-error">이용약관에 동의해 주세요.</FieldError> : null}
    </FieldContent>
  </Field>
  <Button type="submit" variant="default" size="md">선택 내용 확인</Button>
</form>

const formData = new FormData(form)
formData.getAll('interest') // 선택된 값 배열: ["ai", "cloud"]
formData.get('privacy') // 체크됨: "confirmed", 미체크: null
formData.get('terms') // 체크됨: "agreed", 미체크: null`

// Checkbox 선택 상태(off/on/indeterminate) × 상호작용 상태(default/disabled)를 비교한다.
const CHECK_ROWS = [
    {key: 'off', label: 'Off (미체크)', checked: false},
    {key: 'on', label: 'On (체크)', checked: true},
    {key: 'indeterminate', label: 'Indeterminate (부분 선택)', checked: 'indeterminate'},
] as const

const STATE_COLS = [
    {key: 'default', label: 'Default', disabled: false},
    {key: 'disabled', label: 'Disabled', disabled: true},
] as const

// 체크박스는 shadcn Field + Checkbox + FieldLabel 조합으로 쓴다. 라벨은 htmlFor↔id 로 연결하고,
// 2depth 부가설명은 FieldContent/FieldDescription과 aria-describedby로 연결한다.
const CheckboxGuidePage = () => (
    <GuidePageShell
        title="체크박스 (Checkbox)"
        description="shadcn Checkbox 프리미티브입니다. Field와 조합해 라벨·설명이 포함된 선택 항목을 구성합니다."
    >
        <section aria-labelledby="checkbox-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="checkbox-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">Checkbox</code>는 박스만 담당하고, shadcn{' '}
                    <code className="font-mono">Field</code> 안에서 <code className="font-mono">FieldLabel</code>의{' '}
                    <code className="font-mono">htmlFor</code>와 Checkbox의 <code className="font-mono">id</code>를
                    연결합니다. 라벨을 클릭해도 토글됩니다. 프로젝트 Checkbox 크기는 24px로 고정되어 별도의{' '}
                    <code className="font-mono">size</code> prop을 제공하지 않습니다.
                </p>
            </div>
            <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                <Checkbox id="terms" defaultChecked aria-labelledby="terms-label" />
                <FieldLabel id="terms-label" htmlFor="terms">
                    이용약관에 동의합니다
                </FieldLabel>
            </Field>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="checkbox-state" className="flex flex-col gap-4">
            <div>
                <h2 id="checkbox-state" className="typo-h4-bold">
                    상태 (State)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    선택(off/on/indeterminate) × 상태(default/disabled) 조합입니다. Indeterminate는 하위 항목이 일부만
                    선택된 상태를 나타냅니다. 체크됨은 <code className="font-mono">blue.500</code>, 비활성은 회색 박스(
                    <code className="font-mono">gray.100</code>)로 표현됩니다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">체크박스 선택·상태 조합 미리보기</caption>
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
                                            <Checkbox
                                                id={`cb-${row.key}-${col.key}`}
                                                defaultChecked={row.checked}
                                                disabled={col.disabled}
                                                aria-label={`${row.label} ${col.label}`}
                                            />
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col gap-3">
                <div>
                    <h3 className="typo-body-l-medium text-foreground">Indeterminate 사용 예시</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        하위 항목이 일부만 선택되면 전체 선택 Checkbox가 부분 선택 상태가 됩니다. 전체 선택을 누르면
                        모든 항목이 선택되고, 다시 누르면 모두 해제됩니다.
                    </p>
                </div>
                <div className="border-border rounded-md border p-6">
                    <CheckboxIndeterminateDemo />
                </div>
                <CodeBlock code={INDETERMINATE_CODE} language="tsx" copyLabel="복사" />
            </div>
        </section>

        <section aria-labelledby="checkbox-depth" className="flex flex-col gap-4">
            <div>
                <h2 id="checkbox-depth" className="typo-h4-bold">
                    라벨 구성 (Depth)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">Field</code> 안에서 <code className="font-mono">Checkbox</code> +{' '}
                    <code className="font-mono">FieldLabel</code> (+ <code className="font-mono">FieldDescription</code>
                    ) 조합으로 두 형태를 만듭니다.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">1depth — 라벨만</h3>
                <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                    <Checkbox id="depth-1" aria-labelledby="depth-1-label" />
                    <FieldLabel id="depth-1-label" htmlFor="depth-1">
                        체크박스
                    </FieldLabel>
                </Field>
                <CodeBlock code={DEPTH1_CODE} language="tsx" copyLabel="복사" />
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">2depth — 제목 + 설명</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    제목은 <code className="font-mono">FieldLabel</code>(볼드), 설명은{' '}
                    <code className="font-mono">FieldDescription</code>으로 두고{' '}
                    <code className="font-mono">aria-describedby</code>로 연결합니다.{' '}
                    <code className="font-mono">FieldContent</code>가 제목과 설명을 세로로 정렬하며{' '}
                    <code className="font-mono">max-w-90</code> 폭에서 줄바꿈됩니다.
                </p>
                <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                    <Checkbox id="depth-2" aria-labelledby="depth-2-label" aria-describedby="depth-2-desc" />
                    <FieldContent>
                        <FieldLabel id="depth-2-label" htmlFor="depth-2" className="text-foreground font-bold">
                            체크박스
                        </FieldLabel>
                        <FieldDescription id="depth-2-desc" className="typo-body-xl-regular text-label-foreground">
                            2depth 스타일의 부가적인 설명이 들어갈 경우 해당 예시처럼 사용됩니다.
                        </FieldDescription>
                    </FieldContent>
                </Field>
                <CodeBlock code={DEPTH2_CODE} language="tsx" copyLabel="복사" />
            </div>
        </section>

        <section aria-labelledby="checkbox-form" className="flex flex-col gap-4">
            <div>
                <h2 id="checkbox-form" className="typo-h4-bold">
                    폼 제출
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    실제 <code className="font-mono">form</code> 안에서 Checkbox에{' '}
                    <code className="font-mono">name</code>과 <code className="font-mono">value</code>를 지정하면 체크된
                    값만 제출됩니다. 같은 <code className="font-mono">name</code>을 사용하는 복수 값은{' '}
                    <code className="font-mono">FormData.getAll()</code>로 읽습니다.{' '}
                    <code className="font-mono">required</code>는 개별 Checkbox의 필수 체크를 검증하고,{' '}
                    <code className="font-mono">form</code>은 외부 form 요소와 연결할 때 사용합니다.{' '}
                    <code className="font-mono">disabled</code> 항목은 제출에서 제외됩니다. 필수 약관을 선택하지 않고
                    제출하면 첫 번째 오류 Checkbox로 포커스를 이동합니다. 1depth는 라벨 아래에, 2depth는 설명 아래에{' '}
                    <code className="font-mono">FieldError</code>를{' '}
                    <code className="font-mono">role=&quot;alert&quot;</code>로 노출합니다.
                </p>
                <div className="bg-surface border-border mt-3 flex flex-col gap-1 rounded-md border p-4">
                    <h3 className="typo-body-l-medium text-foreground">WAVE 검사 예외 — Missing form label</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <a
                            href="https://www.radix-ui.com/primitives/docs/components/checkbox"
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline underline-offset-4"
                        >
                            Radix Checkbox
                        </a>
                        가 폼 데이터와 이벤트를 전달하기 위해 자동 생성하는 보조{' '}
                        <code className="font-mono">input</code>에는 Label이 연결되지 않아 WAVE가{' '}
                        <em>Missing form label</em>로 탐지할 수 있습니다. 해당 input은{' '}
                        <code className="font-mono">aria-hidden=&quot;true&quot;</code>와{' '}
                        <code className="font-mono">tabindex=&quot;-1&quot;</code>로 접근성 트리와 키보드 탐색에서
                        제외됩니다. 실제 조작 요소인{' '}
                        <code className="font-mono">button[role=&quot;checkbox&quot;]</code>은 연결된 Label을 통해 접근
                        가능한 이름을 제공하므로 실제 사용자 접근성에 영향을 주지 않는 자동 검사 오탐으로 판단하여 예외
                        처리합니다.
                    </p>
                </div>
            </div>
            <CheckboxFormDemo />
            <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="checkbox-props" className="flex flex-col gap-4">
            <div>
                <h2 id="checkbox-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Checkbox(Radix 기반)에서 자주 쓰는 속성입니다.
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
                                name: 'checked',
                                desc: '제어 컴포넌트로 쓸 때 선택 여부. onCheckedChange 와 함께 사용합니다.',
                                def: '-',
                                control: 'boolean | "indeterminate"',
                            },
                            {
                                name: 'defaultChecked',
                                desc: '비제어 컴포넌트의 초기 선택 여부입니다.',
                                def: 'false',
                                control: 'boolean | "indeterminate"',
                            },
                            {
                                name: 'onCheckedChange',
                                desc: '선택 상태가 바뀔 때 호출되는 콜백입니다.',
                                def: '-',
                                control: '(boolean | "indeterminate") => void',
                            },
                            {
                                name: 'name / value',
                                desc: '체크된 값을 폼으로 제출할 때 사용할 필드 이름과 값입니다.',
                                def: 'value="on"',
                                control: 'string',
                            },
                            {
                                name: 'required / form',
                                desc: '필수 상태를 표시하고 외부 form 요소와 연결합니다. 가이드 예시는 FieldError를 위한 커스텀 검증을 사용합니다.',
                                def: 'false / -',
                                control: 'boolean / string',
                            },
                            {
                                name: 'disabled',
                                desc: '비활성 상태. 회색 박스로 표시되고 상호작용이 막힙니다.',
                                def: 'false',
                                control: 'boolean',
                            },
                            {
                                name: 'id / aria-describedby / aria-invalid',
                                desc: 'Label, 부가 설명, 유효성 검사 상태를 Checkbox와 연결합니다.',
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

export default CheckboxGuidePage
