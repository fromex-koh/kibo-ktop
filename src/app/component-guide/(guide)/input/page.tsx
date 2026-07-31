import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {Lock, Search} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ClearableInput} from '@/components/composite/clearable-input'
import {PasswordInput} from '@/components/composite/password-input'
import {Field, FieldDescription, FieldError, FieldLabel} from '@/components/ui/field'
import {Input} from '@/components/ui/input'
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from '@/components/ui/input-group'
import InputFormDemo from './input-form-demo'

export const metadata: Metadata = {title: '인풋 (Input)'}

const USAGE_CODE = `{/* 기본 텍스트 입력 */}
<Field className="max-w-90">
  <FieldLabel htmlFor="name" className="gap-1 font-bold text-foreground">
    이름
    <span aria-hidden="true" className="text-error-500">*</span>
    <span className="sr-only"> (필수)</span>
  </FieldLabel>
  <Input id="name" required placeholder="내용을 입력하세요" />
</Field>

{/* 지우기 버튼이 필요하면 Input 대신 — props 는 그대로 쓴다 */}
<Field className="max-w-90">
  <FieldLabel htmlFor="keyword" className="font-bold text-foreground">검색어</FieldLabel>
  <ClearableInput id="keyword" name="keyword" placeholder="내용을 입력하세요" />
</Field>`

const STATE_CODE = `const [nameError, setNameError] = useState(false)

<Field data-invalid={nameError || undefined} className="max-w-90">
  <FieldLabel htmlFor="applicant-name" className="gap-1 font-bold text-foreground">
    신청자 이름
    <span aria-hidden="true" className="text-error-500">*</span>
    <span className="sr-only"> (필수)</span>
  </FieldLabel>
  <Input
    id="applicant-name"
    name="applicantName"
    required
    aria-invalid={nameError || undefined}
    aria-describedby={nameError ? 'applicant-name-error' : undefined}
    onChange={() => setNameError(false)}
  />
  {nameError ? <FieldError id="applicant-name-error">신청자 이름을 입력해 주세요.</FieldError> : null}
</Field>

{/* 지우기 버튼이 필요한 필드 — Input 대신 ClearableInput 을 쓴다 */}
<Field className="max-w-90">
  <FieldLabel htmlFor="keyword" className="font-bold text-foreground">검색어</FieldLabel>
  <ClearableInput id="keyword" name="keyword" defaultValue="홍길동" />
</Field>`

const ADDON_CODE = `<div className="max-w-90 flex w-full flex-col gap-4">
  {/* 검색 버튼 — InputGroup의 우측 동작 애드온 */}
  <InputGroup className="pr-0">
    <InputGroupInput placeholder="검색어를 입력하세요" aria-label="검색어" />
    <InputGroupAddon align="inline-end" className="h-full p-0">
      <InputGroupButton
        size="icon-sm"
        aria-label="검색"
        className="text-muted-foreground h-full w-12 rounded-l-none rounded-r-sm not-disabled:active:bg-accent not-disabled:active:not-aria-[haspopup]:translate-y-0"
      >
        <Search aria-hidden="true" className="size-5" />
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>

  {/* 비밀번호 표시·숨김 — 상태를 관리하는 PasswordInput composite */}
  <PasswordInput
    aria-label="비밀번호"
    defaultValue="Kibo-password-1234"
    autoComplete="current-password"
  />

  {/* 단위 접미사 — 입력 박스 밖 오른쪽에 형제로 배치(Figma) */}
  <div className="flex items-center gap-2">
    <Input type="number" placeholder="0" aria-label="인원" className="md:min-w-0 flex-1" />
    <span className="typo-body-xl-regular text-foreground shrink-0">명</span>
  </div>

  {/* 단위 + 지우기 — Input 자리에 ClearableInput 을 그대로 바꿔 끼운다 */}
  <div className="flex items-center gap-2">
    <ClearableInput type="number" defaultValue="3" aria-label="인원" className="md:min-w-0 flex-1" />
    <span className="typo-body-xl-regular text-foreground shrink-0">명</span>
  </div>

  {/* 검색 + 지우기 — 같은 구성에 endAddon 으로 검색 버튼을 넘긴다 */}
  <ClearableInput
    aria-label="검색어"
    defaultValue="기술평가"
    className="gap-2 pr-0"
    endAddon={
      <InputGroupButton
        size="icon-sm"
        aria-label="검색"
        className="text-muted-foreground h-full w-12 rounded-l-none rounded-r-sm not-disabled:active:bg-accent not-disabled:active:not-aria-[haspopup]:translate-y-0"
      >
        <Search aria-hidden="true" className="size-5" />
      </InputGroupButton>
    }
  />

  {/* 잠금(읽기전용) — InputGroup의 우측 상태 애드온 */}
  <InputGroup>
    <InputGroupInput readOnly defaultValue="11222-1234567" aria-label="법인번호(읽기전용)" />
    <InputGroupAddon align="inline-end" className="text-foreground">
      <Lock aria-hidden="true" className="size-5" />
    </InputGroupAddon>
  </InputGroup>
</div>`

const FORM_CODE = `const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')
const [nameError, setNameError] = useState(false)
const [emailError, setEmailError] = useState(false)
const [applicantCountError, setApplicantCountError] = useState(false)
const nameRef = useRef<HTMLInputElement>(null)
const emailRef = useRef<HTMLInputElement>(null)
const applicantCountRef = useRef<HTMLInputElement>(null)

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)
  const nextNameError = String(formData.get('applicantName') ?? '').trim() === ''
  const nextEmailError = !(emailRef.current?.validity.valid ?? false)
  const nextApplicantCountError = !(applicantCountRef.current?.validity.valid ?? true)
  setNameError(nextNameError)
  setEmailError(nextEmailError)
  setApplicantCountError(nextApplicantCountError)

  if (nextNameError || nextEmailError || nextApplicantCountError) {
    if (nextNameError) nameRef.current?.focus()
    else if (nextEmailError) emailRef.current?.focus()
    else applicantCountRef.current?.focus()
    return
  }

  const result = {
    applicantName: formData.get('applicantName'),
    email: formData.get('email'),
    applicantCount: formData.get('applicantCount'),
    corporateNumber: formData.get('corporateNumber'),
  }
  setSubmittedData(JSON.stringify(result))
}

<form noValidate onSubmit={handleSubmit}>
  {/* 1depth: 라벨 + 입력 + 유효성 검사 */}
  <Field data-invalid={nameError || undefined} className="max-w-90">
    <FieldLabel htmlFor="applicant-name" className="gap-1 font-bold text-foreground">
      신청자 이름
      <span aria-hidden="true" className="text-error-500">*</span>
      <span className="sr-only"> (필수)</span>
    </FieldLabel>
    <ClearableInput
      ref={nameRef}
      id="applicant-name"
      name="applicantName"
      required
      aria-invalid={nameError || undefined}
      aria-describedby={nameError ? 'applicant-name-error' : undefined}
      onChange={() => setNameError(false)}
    />
    {nameError ? <FieldError id="applicant-name-error">신청자 이름을 입력해 주세요.</FieldError> : null}
  </Field>

  {/* 이메일 형식 유효성 검사 */}
  <Field data-invalid={emailError || undefined} className="max-w-90">
    <FieldLabel htmlFor="email" className="gap-1 font-bold text-foreground">
      이메일
      <span aria-hidden="true" className="text-error-500">*</span>
      <span className="sr-only"> (필수)</span>
    </FieldLabel>
    <ClearableInput
      ref={emailRef}
      id="email"
      name="email"
      type="email"
      required
      aria-invalid={emailError || undefined}
      aria-describedby={emailError ? 'email-error' : undefined}
      onChange={() => setEmailError(false)}
    />
    {emailError ? <FieldError id="email-error">올바른 이메일 주소를 입력해 주세요.</FieldError> : null}
  </Field>

  <Field data-invalid={applicantCountError || undefined} className="max-w-90">
    <FieldLabel htmlFor="applicant-count" className="font-bold text-foreground">신청 인원</FieldLabel>
    <div className="flex items-center gap-2">
      <ClearableInput
        ref={applicantCountRef}
        id="applicant-count"
        name="applicantCount"
        type="number"
        min="1"
        defaultValue="3"
        aria-invalid={applicantCountError || undefined}
        aria-describedby={applicantCountError ? 'applicant-count-error' : undefined}
        onChange={() => setApplicantCountError(false)}
        className="flex-1 md:min-w-0"
      />
      <span className="typo-body-xl-regular text-foreground shrink-0">명</span>
    </div>
    {applicantCountError ? (
      <FieldError id="applicant-count-error">신청 인원은 1명 이상 입력해 주세요.</FieldError>
    ) : null}
  </Field>

  <Field className="max-w-90">
    <FieldLabel htmlFor="corporate-number" className="font-bold text-foreground">법인번호</FieldLabel>
    <InputGroup>
      <InputGroupInput
        id="corporate-number"
        name="corporateNumber"
        readOnly
        defaultValue="11222-1234567"
      />
      <InputGroupAddon align="inline-end" className="text-foreground">
        <Lock aria-hidden="true" className="size-5" />
      </InputGroupAddon>
    </InputGroup>
  </Field>

  <Button type="submit" variant="default" size="sm">입력 내용 확인</Button>
  <output aria-live="polite">{submittedData}</output>
</form>`

const FIELD_DEMO_CLASS = 'max-w-90 flex w-full flex-col gap-2'
const FIELD_GROUP_DEMO_CLASS = 'max-w-90 flex w-full flex-col gap-4'

// 애드온 조합을 왼쪽(기본 Input)·오른쪽(지우기 포함)으로 나란히 보여준다.
// 오른쪽에 대응 컴포넌트가 없는 조합은 예시 대신 이유를 적는다 — 조합이 불가능한 게 아니라
// 그 자리를 이미 다른 요소가 쓰고 있거나(비밀번호 토글) 값을 지울 수 없는(읽기전용) 경우다.
const AddonRow = ({
    label,
    base,
    clearable,
    clearNote,
}: {
    label: string
    base: ReactNode
    clearable?: ReactNode
    clearNote: string
}) => (
    <div className="flex flex-col gap-3">
        <h3 className="typo-body-l-bold text-foreground">{label}</h3>
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
            <div className="flex flex-col gap-2">
                <div className={FIELD_GROUP_DEMO_CLASS}>{base}</div>
                <p className="typo-caption-regular text-muted-foreground">
                    <code className="font-mono">Input</code> 기반
                </p>
            </div>
            <div className="flex flex-col gap-2">
                {clearable ? (
                    <div className={FIELD_GROUP_DEMO_CLASS}>{clearable}</div>
                ) : (
                    <p className="typo-body-l-regular text-muted-foreground">해당 없음</p>
                )}
                <p className="typo-caption-regular text-muted-foreground">{clearNote}</p>
            </div>
        </div>
    </div>
)

const InputGuidePage = () => (
    <GuidePageShell
        title="인풋 (Input)"
        description="shadcn Input 프리미티브입니다. Field와 조합해 라벨·설명·오류가 포함된 텍스트 입력을 구성합니다."
    >
        <BaseCard>
            <section aria-labelledby="input-demo" className="flex flex-col gap-4">
                <div>
                    <h2 id="input-demo" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">Field</code> 안에 <code className="font-mono">FieldLabel</code>과{' '}
                        <code className="font-mono">Input</code>을 조합합니다. 필수 입력은 라벨의 별표와 화면 낭독기용
                        텍스트로 전달합니다.
                    </p>
                    <p className="typo-body-l-regular text-muted-foreground">
                        텍스트 입력은 두 가지입니다. 기본은 <code className="font-mono">Input</code>이고, 입력한 값을 한
                        번에 지우는 버튼이 필요하면{' '}
                        <strong className="text-foreground font-medium">
                            <code className="font-mono">ClearableInput</code>
                        </strong>
                        을 대신 씁니다. 겉모습·크기·상태는 완전히 같고 지우기 버튼만 더해집니다 — 안쪽에서 같은{' '}
                        <code className="font-mono">Input</code>을 쓰기 때문입니다. 지우기 버튼은 값이 있고 필드에
                        포커스가 있는 동안에만 나타납니다(시안 text_input의 focused 상태).
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <Field className={FIELD_DEMO_CLASS}>
                        <FieldLabel htmlFor="demo-name" className="text-foreground gap-1 font-bold">
                            이름
                            <span aria-hidden="true" className="text-error-500">
                                *
                            </span>
                            <span className="sr-only"> (필수)</span>
                        </FieldLabel>
                        <Input id="demo-name" required placeholder="내용을 입력하세요" />
                        <FieldDescription>
                            <code className="font-mono">Input</code> — 기본 텍스트 입력
                        </FieldDescription>
                    </Field>
                    <Field className={FIELD_DEMO_CLASS}>
                        <FieldLabel htmlFor="demo-name-clearable" className="text-foreground gap-1 font-bold">
                            이름
                            <span aria-hidden="true" className="text-error-500">
                                *
                            </span>
                            <span className="sr-only"> (필수)</span>
                        </FieldLabel>
                        <ClearableInput
                            id="demo-name-clearable"
                            placeholder="내용을 입력하세요"
                            required
                            defaultValue="홍길동"
                        />
                        <FieldDescription>
                            <code className="font-mono">ClearableInput</code> — 지우기 버튼 포함(클릭해 보세요)
                        </FieldDescription>
                    </Field>
                </div>
                <p className="typo-caption-regular text-muted-foreground">
                    label+input 을 감싸는 필드 wrapper 를 <code className="font-mono">max-w-90</code>(360px 상한)으로
                    두고, Input 은 <code className="font-mono">w-full</code> 로 그 폭을 채웁니다.
                </p>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="input-state" className="flex flex-col gap-4">
                <div>
                    <h2 id="input-state" className="typo-h4-bold">
                        상태 (State)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기본·값 입력됨·오류·비활성·읽기전용 상태입니다.{' '}
                        <span className="text-foreground font-medium">포커스</span> 시 테두리가{' '}
                        <code className="font-mono">blue.500</code> 로 바뀝니다. 시안의 focused 상태에는 오른쪽에 지우기
                        버튼이 있는데, DOM과 상태가 필요해 Input 셸이 아니라{' '}
                        <code className="font-mono">ClearableInput</code> composite 이 담당합니다 — 값이 있고 필드에
                        포커스가 있는 동안에만 나타납니다(시안의 completed 상태에는 없음). 기본 Input도 항상{' '}
                        <code className="font-mono">Field</code>로 감싸고, 오류가 있으면 동일 구조 안에{' '}
                        <code className="font-mono">FieldError</code>만 조건부로 추가합니다. 프로젝트 Input은 48px
                        높이로 고정되어 별도의 <code className="font-mono">size</code> prop을 제공하지 않습니다.
                    </p>
                </div>
                {/* 각 필드 wrapper 는 max-w-90(360 상한)이고 인풋은 w-full+min-w-0 이라 좁은 열에서도 줄어든다.
                2열은 각 열이 360 을 담는 xl(≥1280px)에서 편다. */}
                <div className="grid grid-cols-1 justify-items-start gap-6 xl:grid-cols-2">
                    <Field className={FIELD_DEMO_CLASS}>
                        <FieldLabel htmlFor="st-default" className="text-foreground font-bold">
                            기본 (default)
                        </FieldLabel>
                        <Input id="st-default" placeholder="내용을 입력하세요" />
                    </Field>
                    <Field className={FIELD_DEMO_CLASS}>
                        <FieldLabel htmlFor="st-completed" className="text-foreground font-bold">
                            값 입력됨 (completed)
                        </FieldLabel>
                        <Input id="st-completed" placeholder="내용을 입력하세요" defaultValue="홍길동" />
                    </Field>
                    <Field data-invalid className={FIELD_DEMO_CLASS}>
                        <FieldLabel htmlFor="st-error" className="text-foreground font-bold">
                            오류 (error)
                        </FieldLabel>
                        <Input
                            id="st-error"
                            placeholder="내용을 입력하세요"
                            aria-invalid="true"
                            aria-describedby="st-error-msg"
                        />
                        <FieldError id="st-error-msg">에러메시지가 노출됩니다.</FieldError>
                    </Field>
                    <Field className={FIELD_DEMO_CLASS}>
                        <FieldLabel htmlFor="st-disabled" className="text-foreground font-bold">
                            비활성 (disabled)
                        </FieldLabel>
                        <Input id="st-disabled" placeholder="내용을 입력하세요" defaultValue="비활성 입력값" disabled />
                    </Field>
                    <Field className={FIELD_DEMO_CLASS}>
                        <FieldLabel htmlFor="st-view" className="text-foreground font-bold">
                            읽기전용 (view)
                        </FieldLabel>
                        <Input id="st-view" placeholder="내용을 입력하세요" defaultValue="수정 불가한 값" readOnly />
                    </Field>
                    <Field className={FIELD_DEMO_CLASS}>
                        <FieldLabel htmlFor="st-focused" className="text-foreground font-bold">
                            포커스 + 지우기 (focused)
                        </FieldLabel>
                        <ClearableInput id="st-focused" placeholder="내용을 입력하세요" defaultValue="홍길동" />
                    </Field>
                </div>
                <CodeBlock code={STATE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="input-addon" className="flex flex-col gap-4">
                <div>
                    <h2 id="input-addon" className="typo-h4-bold">
                        애드온 (아이콘·단위)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        검색처럼 <span className="text-foreground font-medium">동작</span>이 있는 우측 요소는 아이콘이
                        아니라 <code className="font-mono">InputGroupButton</code>으로 두고, 잠금 같은{' '}
                        <span className="text-foreground font-medium">상태 표시</span>는{' '}
                        <code className="font-mono">InputGroupAddon</code> 안의 아이콘으로 둡니다. InputGroup이 컨트롤과
                        애드온의 테두리·포커스·비활성·읽기전용 상태를 함께 관리합니다. 비밀번호 표시·숨김은 이 구조를
                        조합한 <code className="font-mono">PasswordInput</code> composite를 사용합니다. 단위(명·건 등)는
                        Figma처럼 입력 박스 <span className="text-foreground font-medium">밖</span> 오른쪽에 형제로
                        나란히 둡니다(
                        <code className="font-mono">flex</code>).
                    </p>
                    <p className="typo-body-l-regular text-muted-foreground">
                        오른쪽 열은 같은 조합에 지우기 버튼을 더한 모습입니다. 단위처럼 애드온이 입력 박스 밖에 있으면{' '}
                        <code className="font-mono">Input</code>을 <code className="font-mono">ClearableInput</code>으로
                        바꿔 끼우기만 하면 되고, 검색처럼 박스 안 오른쪽을 쓰는 애드온은{' '}
                        <code className="font-mono">endAddon</code>으로 넘겨 지우기 버튼 옆에 나란히 둡니다. 지우기는
                        포커스 중에만 나타나지만 <code className="font-mono">endAddon</code>은 항상 보입니다. 나머지
                        둘은 오른쪽 자리를 다른 요소가 쓰거나 값을 지울 수 없어 조합하지 않습니다.
                    </p>
                </div>
                <div className="flex flex-col gap-6">
                    {/* 검색 버튼 — 클릭 가능한 우측 애드온 */}
                    <AddonRow
                        label="검색 버튼"
                        clearNote="같은 구성에 endAddon 으로 검색 버튼을 넘겨 지우기와 나란히 둡니다."
                        base={
                            <InputGroup className="pr-0">
                                <InputGroupInput placeholder="검색어를 입력하세요" aria-label="검색어" />
                                <InputGroupAddon align="inline-end" className="h-full p-0">
                                    <InputGroupButton
                                        size="icon-sm"
                                        aria-label="검색"
                                        className="text-muted-foreground not-disabled:active:bg-accent h-full w-12 rounded-l-none rounded-r-sm not-disabled:active:not-aria-[haspopup]:translate-y-0"
                                    >
                                        <Search aria-hidden="true" className="size-5" />
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        }
                        clearable={
                            <ClearableInput
                                aria-label="검색어(지우기 포함)"
                                placeholder="검색어를 입력하세요"
                                defaultValue="기술평가"
                                className="gap-2 pr-0"
                                endAddon={
                                    <InputGroupButton
                                        size="icon-sm"
                                        aria-label="검색"
                                        className="text-muted-foreground not-disabled:active:bg-accent h-full w-12 rounded-l-none rounded-r-sm not-disabled:active:not-aria-[haspopup]:translate-y-0"
                                    >
                                        <Search aria-hidden="true" className="size-5" />
                                    </InputGroupButton>
                                }
                            />
                        }
                    />
                    {/* 비밀번호 표시·숨김 — InputGroup을 조합한 composite */}
                    <AddonRow
                        label="비밀번호 표시·숨김"
                        base={
                            <PasswordInput
                                aria-label="비밀번호"
                                placeholder="비밀번호를 입력하세요"
                                defaultValue="Kibo-password-1234"
                                autoComplete="current-password"
                            />
                        }
                        clearNote="표시·숨김 토글이 오른쪽 자리를 쓰고 있어 지우기를 함께 두지 않습니다."
                    />
                    {/* 단위 접미사 — 입력 박스 밖 오른쪽에 형제로 배치 */}
                    <AddonRow
                        label="단위 접미사"
                        clearNote="단위가 입력 박스 밖에 있어 자리가 겹치지 않습니다 — Input 을 그대로 바꿔 끼우면 됩니다."
                        base={
                            <div className="flex items-center gap-2">
                                <Input type="number" placeholder="0" aria-label="인원" className="flex-1 md:min-w-0" />
                                <span className="typo-body-xl-regular text-foreground shrink-0">명</span>
                            </div>
                        }
                        clearable={
                            <div className="flex items-center gap-2">
                                <ClearableInput
                                    type="number"
                                    defaultValue="3"
                                    aria-label="인원(지우기 포함)"
                                    placeholder="0"
                                    className="flex-1 md:min-w-0"
                                />
                                <span className="typo-body-xl-regular text-foreground shrink-0">명</span>
                            </div>
                        }
                    />
                    {/* 잠금(읽기전용) — 상태 표시 우측 애드온 */}
                    <AddonRow
                        label="잠금 (읽기전용)"
                        base={
                            <InputGroup>
                                <InputGroupInput
                                    readOnly
                                    defaultValue="11222-1234567"
                                    aria-label="법인번호(읽기전용)"
                                    placeholder="법인번호"
                                />
                                <InputGroupAddon align="inline-end" className="text-foreground">
                                    <Lock aria-hidden="true" className="size-5" />
                                </InputGroupAddon>
                            </InputGroup>
                        }
                        clearNote="읽기전용은 값을 지울 수 없어 지우기 버튼이 붙지 않습니다."
                    />
                </div>
                <CodeBlock code={ADDON_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="input-form" className="flex flex-col gap-4">
                <div>
                    <h2 id="input-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        네이티브 Input에 <code className="font-mono">name</code>을 지정하면 입력값이 FormData로
                        제출됩니다. 예시는 <code className="font-mono">required</code> 필드를 직접 검증하고 각 Input
                        아래에 <code className="font-mono">FieldError</code>를{' '}
                        <code className="font-mono">role=&quot;alert&quot;</code>로 노출합니다. 여러 필드가 유효하지
                        않으면 첫 번째 오류 Input으로 포커스를 이동합니다. 단위가 있는 number Input과 잠금 아이콘이 있는
                        readOnly Input도 함께 제출하며, readOnly 값은 수정할 수 없지만 disabled와 달리 FormData에
                        포함됩니다.
                    </p>
                    <p className="typo-body-l-regular text-muted-foreground">
                        입력 필드는 <code className="font-mono">ClearableInput</code>으로 바꿔 넣었습니다.{' '}
                        <code className="font-mono">name</code>·<code className="font-mono">required</code>·
                        <code className="font-mono">aria-invalid</code>는 물론 <code className="font-mono">ref</code>도
                        그대로 통해서, 제출 시 유효성 검사와 첫 오류 필드로의 포커스 이동이{' '}
                        <code className="font-mono">Input</code>일 때와 똑같이 동작합니다. 지우기 버튼으로 값을 비우면{' '}
                        <code className="font-mono">onChange</code>도 정상적으로 발생해 오류 표시가 함께 갱신됩니다.
                        읽기전용 법인번호만 지울 수 없어 그대로 둡니다.
                    </p>
                </div>
                <InputFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="input-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="input-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Input(네이티브 input)에서 자주 쓰는 속성입니다.
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
                                    name: 'type',
                                    desc: '입력 종류(text/email/number/password 등).',
                                    def: "'text'",
                                    control: 'string',
                                },
                                {
                                    name: 'placeholder',
                                    desc: '비어 있을 때 표시되는 안내 문구(레이블을 대체하지 않음).',
                                    def: '-',
                                    control: 'string',
                                },
                                {
                                    name: 'name / value / defaultValue',
                                    desc: '폼 필드 이름과 제어·비제어 입력값을 지정합니다.',
                                    def: '- / - / -',
                                    control: 'string',
                                },
                                {
                                    name: 'required / form',
                                    desc: '필수 상태를 표시하고 외부 form 요소와 연결합니다. 가이드 예시는 FieldError를 위한 커스텀 검증을 사용합니다.',
                                    def: 'false / -',
                                    control: 'boolean / string',
                                },
                                {
                                    name: 'onChange',
                                    desc: '입력값이 변경될 때 호출되는 네이티브 change 이벤트 핸들러입니다.',
                                    def: '-',
                                    control: 'ChangeEventHandler<HTMLInputElement>',
                                },
                                {
                                    name: 'disabled',
                                    desc: '비활성. 회색 배경으로 표시되고 상호작용과 폼 제출에서 제외됩니다.',
                                    def: 'false',
                                    control: 'boolean',
                                },
                                {
                                    name: 'readOnly',
                                    desc: '읽기전용(view). 값을 수정할 수 없지만 폼 제출에는 포함됩니다.',
                                    def: 'false',
                                    control: 'boolean',
                                },
                                {
                                    name: 'aria-invalid',
                                    desc: '오류 상태. 테두리가 error 색으로 바뀝니다(메시지는 aria-describedby 로 연결).',
                                    def: '-',
                                    control: 'boolean',
                                },
                                {
                                    name: 'id / aria-describedby',
                                    desc: 'FieldLabel과 도움말·오류 메시지를 Input에 연결합니다.',
                                    def: '-',
                                    control: 'string',
                                },
                                {
                                    name: 'className',
                                    desc: '추가 클래스명으로 레이아웃 또는 화면별 스타일을 확장합니다. 내부 애드온은 InputGroup을 사용합니다.',
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

export default InputGuidePage
