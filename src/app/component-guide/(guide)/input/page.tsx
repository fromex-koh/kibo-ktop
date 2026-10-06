// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {Lock} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {ClearableInput} from '@/components/composite/clearable-input'
import {PasswordInput} from '@/components/composite/password-input'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {Field, FieldDescription, FieldError, FieldLabel} from '@/components/ui/field'
import {Input} from '@/components/ui/input'
import {InputGroup, InputGroupAddon, InputGroupInput} from '@/components/ui/input-group'
import InputFormDemo from './input-form-demo'

export const metadata: Metadata = {title: '인풋 (Input)'}

const BASIC_CODE = `<Field className="max-w-90">
  <FieldLabel htmlFor="email" className="gap-1 font-bold text-foreground">
    이메일
    <span aria-hidden="true" className="text-error-500">*</span>
    <span className="sr-only"> (필수)</span>
  </FieldLabel>
  <Input
    id="email"
    name="email"
    type="email"
    required
    autoComplete="email"
    placeholder="이메일을 입력하세요"
    aria-describedby="email-description"
  />
  <FieldDescription id="email-description">
    업무용 이메일을 입력해 주세요.
  </FieldDescription>
</Field>`

const STATE_CODE = `{/* 기본 */}
<Field className="max-w-90">
  <FieldLabel htmlFor="company-name" className="font-bold text-foreground">
    기업명
  </FieldLabel>
  <Input id="company-name" name="companyName" placeholder="기업명을 입력하세요" />
</Field>

{/* 값 입력됨 */}
<Field className="max-w-90">
  <FieldLabel htmlFor="manager-name" className="font-bold text-foreground">
    담당자명
  </FieldLabel>
  <Input id="manager-name" name="managerName" defaultValue="홍길동" />
</Field>

{/* 오류 */}
<Field data-invalid className="max-w-90">
  <FieldLabel htmlFor="applicant-name" className="font-bold text-foreground">
    신청자 이름
  </FieldLabel>
  <Input
    id="applicant-name"
    name="applicantName"
    placeholder="이름을 입력하세요"
    aria-invalid="true"
    aria-describedby="applicant-name-error"
  />
  <FieldError id="applicant-name-error">
    신청자 이름을 입력해 주세요.
  </FieldError>
</Field>

{/* 비활성 */}
<Field data-disabled="true" className="max-w-90">
  <FieldLabel htmlFor="disabled-company" className="font-bold text-foreground">
    기업명
  </FieldLabel>
  <Input id="disabled-company" value="기술보증기금" disabled readOnly />
</Field>

{/* 읽기전용 */}
<Field className="max-w-90">
  <FieldLabel htmlFor="corporate-number" className="font-bold text-foreground">
    법인번호
  </FieldLabel>
  <Input id="corporate-number" name="corporateNumber" value="110111-1234567" readOnly />
</Field>`

const COMPOSITE_CODE = `{/* 일반 입력: end action 없음 */}
<Input name="companyName" placeholder="기업명을 입력하세요" />

{/* 일반 입력값을 직접 지워야 할 때 */}
<ClearableInput name="keyword" placeholder="키워드를 입력하세요" />

{/* 비밀번호: 삭제 대신 표시·숨김 */}
<PasswordInput
  name="password"
  placeholder="비밀번호를 입력하세요"
  autoComplete="current-password"
/>

{/* 검색 실행 + 입력값 삭제는 SearchBar 사용 */}
<SearchBar
  name="keyword"
  label="통합 검색"
  placeholder="검색어를 입력하세요"
/>`

const ADDON_CODE = `{/* 읽기전용 상태 아이콘 */}
<InputGroup>
  <InputGroupInput
    name="corporateNumber"
    value="110111-1234567"
    readOnly
    aria-label="법인번호"
  />
  <InputGroupAddon align="inline-end">
    <Lock aria-hidden="true" />
  </InputGroupAddon>
</InputGroup>

{/* 단위는 상자 안 오른쪽, 값은 오른쪽 정렬 */}
<InputGroup>
  <InputGroupInput
    name="applicantCount"
    type="number"
    placeholder="0"
    aria-label="신청 인원"
    className="text-right"
  />
  <InputGroupAddon align="inline-end" className="text-foreground">
    명
  </InputGroupAddon>
</InputGroup>`

const FORM_CODE = `const nameRef = useRef<HTMLInputElement>(null)
const [nameError, setNameError] = useState(false)
const [submittedData, setSubmittedData] = useState('')

const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)
  const nextNameError = String(formData.get('applicantName') ?? '').trim() === ''

  setNameError(nextNameError)
  if (nextNameError) {
    nameRef.current?.focus()
    return
  }

  setSubmittedData(JSON.stringify(Object.fromEntries(formData)))
}

<form noValidate onSubmit={handleSubmit}>
  <Field data-invalid={nameError || undefined}>
    <FieldLabel htmlFor="applicant-name">신청자 이름</FieldLabel>
    <ClearableInput
      ref={nameRef}
      id="applicant-name"
      name="applicantName"
      placeholder="이름을 입력하세요"
      required
      aria-invalid={nameError || undefined}
      aria-describedby={nameError ? 'applicant-name-error' : undefined}
    />
    {nameError ? (
      <FieldError id="applicant-name-error">
        신청자 이름을 입력해 주세요.
      </FieldError>
    ) : null}
  </Field>

  <Button type="submit">입력 내용 확인</Button>
  <output aria-live="polite">{submittedData}</output>
</form>`

const COMPONENT_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'use', header: '사용 상황', align: 'start', wrap: true},
    {key: 'end', header: '끝 영역', align: 'start', wrap: true},
] as const

const COMPONENT_ROWS = [
    {
        key: 'input',
        cells: [<code key="component">Input</code>, '텍스트 · 이메일 · 숫자 입력', '없음'],
    },
    {
        key: 'clearable',
        cells: [<code key="component">ClearableInput</code>, '입력값을 한 번에 지워야 할 때', '입력값 삭제'],
    },
    {
        key: 'password',
        cells: [
            <code key="component">PasswordInput</code>,
            '비밀번호 입력',
            '표시 · 숨김 (삭제 버튼과 함께 쓰지 않음)',
        ],
    },
    {
        key: 'search',
        cells: [<code key="component">SearchBar</code>, '검색 실행이 있는 입력', '입력값 삭제 · 검색 실행'],
    },
    {
        key: 'group',
        cells: [
            <code key="component">InputGroup</code>,
            '상태 아이콘이나 다른 동작을 붙일 때',
            'InputGroupAddon 또는 InputGroupButton',
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
            'Field 에 data-invalid 를 함께 주고, 메시지를 aria-describedby 로 연결합니다.',
        ],
    },
    {
        key: 'disabled',
        cells: ['비활성', <code key="prop">disabled</code>, '수정 · 포커스 · 폼 제출에서 빠집니다.'],
    },
    {
        key: 'readonly',
        cells: ['읽기전용', <code key="prop">readOnly</code>, '수정은 안 되고 포커스 · 폼 제출은 됩니다.'],
    },
] as const

const API_COLUMNS = [
    {key: 'prop', header: 'Prop', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start', wrap: true},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const API_ROWS = [
    {
        key: 'type',
        cells: [
            <code key="prop">type</code>,
            <code key="type">text | email | number | tel | url …</code>,
            '데이터에 맞는 타입을 씁니다. 비밀번호는 PasswordInput 을 씁니다.',
        ],
    },
    {
        key: 'name',
        cells: [<code key="prop">name</code>, <code key="type">string</code>, '폼 제출 때 쓰이는 필드 이름입니다.'],
    },
    {
        key: 'value',
        cells: [
            <code key="prop">value / defaultValue / onChange</code>,
            <code key="type">InputHTMLAttributes</code>,
            '입력값을 제어 · 비제어 방식으로 다룹니다.',
        ],
    },
    {
        key: 'placeholder',
        cells: [
            <code key="prop">placeholder</code>,
            <code key="type">string</code>,
            '입력 예시 · 형식 안내입니다. 라벨을 대신하지 못합니다.',
        ],
    },
    {
        key: 'validation',
        cells: [
            <code key="prop">required / min / max / pattern</code>,
            <code key="type">native attributes</code>,
            '입력 조건을 네이티브 속성으로 정합니다.',
        ],
    },
    {
        key: 'a11y',
        cells: [
            <code key="prop">id / aria-describedby</code>,
            <code key="type">string</code>,
            'FieldLabel, 설명 · 오류 메시지와 연결합니다.',
        ],
    },
] as const

const COMPOSITE_API_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'prop', header: 'Prop', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const COMPOSITE_API_ROWS = [
    {
        key: 'clearable',
        cells: [
            <code key="component">ClearableInput</code>,
            <code key="prop">clearLabel · inputClassName · endAddon · clearableWhenReadOnly</code>,
            '지우기 버튼의 aria-label(기본 "입력 지우기"), 입력 요소 전용 클래스, 지우기 오른쪽에 항상 보이는 애드온, 읽기전용에서도 값이 있으면 지우기를 둘지 여부입니다. 지우기 버튼은 값이 있고 포커스가 있을 때만 보입니다.',
        ],
    },
    {
        key: 'password',
        cells: [
            <code key="component">PasswordInput</code>,
            <code key="prop">showPasswordLabel · hidePasswordLabel · inputClassName</code>,
            '표시·숨김 토글의 aria-label 입니다. type 은 내부에서 정하므로 넘기지 않습니다.',
        ],
    },
    {
        key: 'search',
        cells: [
            <code key="component">SearchBar</code>,
            <code key="prop">label · searchLabel · clearLabel · inputClassName</code>,
            'label 은 필수이며 화면에 보이는 라벨입니다. readOnly 는 받지 않습니다.',
        ],
    },
] as const

const InputGuidePage = () => (
    <GuidePageShell title="인풋 (Input)" description="한 줄 값을 입력받는 Input 과 목적별 입력 컴포넌트입니다.">
        <BaseCard>
            <section aria-labelledby="input-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="input-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>FieldLabel</code> 의 <code>htmlFor</code> 와 <code>id</code> 를 연결하고, 데이터에 맞는{' '}
                        <code>type</code> · <code>name</code> · <code>autoComplete</code> 를 지정합니다. 일반 폼 필드는{' '}
                        <Link href="/component-guide/form-fields" className="text-primary-strong underline">
                            Field (form-fields)
                        </Link>
                        로 먼저 표현합니다.
                    </p>
                </div>
                <Field className="max-w-90">
                    <FieldLabel htmlFor="input-email" className="text-foreground gap-1 font-bold">
                        이메일
                        <span aria-hidden="true" className="text-error-500">
                            *
                        </span>
                        <span className="sr-only"> (필수)</span>
                    </FieldLabel>
                    <Input
                        id="input-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="이메일을 입력하세요"
                        aria-describedby="input-email-description"
                    />
                    <FieldDescription id="input-email-description">업무용 이메일을 입력해 주세요.</FieldDescription>
                </Field>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="input-component" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="input-component" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        입력 상자 끝에 필요한 동작으로 고릅니다.
                    </p>
                </div>
                <Table
                    caption="입력 목적별 컴포넌트 선택 기준"
                    columns={COMPONENT_COLUMNS}
                    rows={COMPONENT_ROWS}
                    size="md"
                />
                <div className="border-subtle-3 flex flex-col gap-4 border-t pt-8">
                    <h3 className="typo-title-m-bold text-foreground">미리보기</h3>
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Field className="max-w-90">
                            <FieldLabel htmlFor="input-default" className="text-foreground font-bold">
                                일반 입력
                            </FieldLabel>
                            <Input id="input-default" name="companyName" placeholder="기업명을 입력하세요" />
                        </Field>
                        <Field className="max-w-90">
                            <FieldLabel htmlFor="input-clearable" className="text-foreground font-bold">
                                삭제 가능한 입력
                            </FieldLabel>
                            <ClearableInput
                                id="input-clearable"
                                name="keyword"
                                defaultValue="기술평가"
                                placeholder="키워드를 입력하세요"
                            />
                        </Field>
                        <Field className="max-w-90">
                            <FieldLabel htmlFor="input-password" className="text-foreground font-bold">
                                비밀번호
                            </FieldLabel>
                            <PasswordInput
                                id="input-password"
                                name="password"
                                placeholder="비밀번호를 입력하세요"
                                autoComplete="current-password"
                            />
                        </Field>
                    </div>
                </div>
                <CodeBlock code={COMPOSITE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="input-state" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="input-state" className="typo-h4-bold">
                        상태와 오류
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        상태는 Field 와 Input 에 함께 지정합니다. 비활성·읽기전용 배경은 <code>bg-field-disabled</code>{' '}
                        로 같습니다.
                    </p>
                </div>
                <Table caption="Input 상태 처리 기준" columns={STATE_COLUMNS} rows={STATE_ROWS} size="md" />
                <div className="border-subtle-3 flex flex-col gap-4 border-t pt-8">
                    <h3 className="typo-title-m-bold text-foreground">미리보기</h3>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Field className="max-w-90">
                            <FieldLabel htmlFor="input-state-default" className="text-foreground font-bold">
                                기본
                            </FieldLabel>
                            <Input id="input-state-default" name="companyName" placeholder="기업명을 입력하세요" />
                        </Field>
                        <Field className="max-w-90">
                            <FieldLabel htmlFor="input-state-filled" className="text-foreground font-bold">
                                값 입력됨
                            </FieldLabel>
                            <Input
                                id="input-state-filled"
                                name="managerName"
                                defaultValue="홍길동"
                                placeholder="이름을 입력하세요"
                            />
                        </Field>
                        <Field data-invalid className="max-w-90">
                            <FieldLabel htmlFor="input-state-error" className="text-foreground font-bold">
                                오류
                            </FieldLabel>
                            <Input
                                id="input-state-error"
                                name="applicantName"
                                placeholder="이름을 입력하세요"
                                aria-invalid="true"
                                aria-describedby="input-state-error-message"
                            />
                            <FieldError id="input-state-error-message">신청자 이름을 입력해 주세요.</FieldError>
                        </Field>
                        <Field data-disabled="true" className="max-w-90">
                            <FieldLabel htmlFor="input-state-disabled" className="text-foreground font-bold">
                                비활성
                            </FieldLabel>
                            <Input id="input-state-disabled" value="기술보증기금" disabled readOnly />
                        </Field>
                        <Field className="max-w-90">
                            <FieldLabel htmlFor="input-state-readonly" className="text-foreground font-bold">
                                읽기전용
                            </FieldLabel>
                            <Input id="input-state-readonly" name="corporateNumber" value="110111-1234567" readOnly />
                        </Field>
                    </div>
                </div>
                <CodeBlock code={STATE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="input-addon" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="input-addon" className="typo-h4-bold">
                        아이콘과 단위
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        상자 안 아이콘은 <code>InputGroupAddon</code>, 클릭 동작은 <code>InputGroupButton</code>을
                        씁니다. 명 · 건 같은 단위도 <code>InputGroupAddon</code>으로 상자 안 오른쪽에 두고 값은 오른쪽
                        정렬합니다.
                    </p>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                    <Field className="max-w-90">
                        <FieldLabel htmlFor="input-corporate-number" className="text-foreground font-bold">
                            법인번호
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="input-corporate-number"
                                name="corporateNumber"
                                value="110111-1234567"
                                readOnly
                                aria-label="법인번호"
                            />
                            <InputGroupAddon align="inline-end">
                                <Lock aria-hidden="true" className="size-5" />
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>
                    <Field className="max-w-90">
                        <FieldLabel htmlFor="input-count" className="text-foreground font-bold">
                            신청 인원
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="input-count"
                                name="applicantCount"
                                type="number"
                                placeholder="0"
                                className="text-right"
                            />
                            <InputGroupAddon align="inline-end" className="text-foreground">
                                명
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>
                </div>
                <CodeBlock code={ADDON_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="input-form" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="input-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        오류가 있으면 메시지를 연결하고 첫 오류 입력으로 포커스를 옮깁니다. <code>readOnly</code> 값은
                        제출되고 <code>disabled</code> 값은 제외됩니다.
                    </p>
                </div>
                <InputFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="input-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="input-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>FieldLabel</code> 의 <code>htmlFor</code> 와 <code>id</code> 로 라벨을 연결합니다.{' '}
                        <code>placeholder</code> 는 라벨을 대신하지 못합니다[7.4.1].
                    </li>
                    <li>
                        오류는 <code>aria-invalid</code> + <code>aria-describedby</code> 로 <code>FieldError</code>(
                        <code>role=&quot;alert&quot;</code>)와 잇습니다[7.4.2].
                    </li>
                    <li>
                        오류가 난 칸은 마우스로 제출한 뒤에도 <code>focus</code> 만으로 포커스 외곽선을
                        표시합니다[6.1.2].
                    </li>
                    <li>
                        아이콘 버튼(지우기 · 표시/숨김 · 검색)은 <code>aria-label</code> 을 가집니다[5.1.1]. 오류와
                        읽기전용은 색 외에 메시지·아이콘으로 구분합니다[5.3.1].
                    </li>
                    <li>
                        <code>onChange</code> 에서 곧바로 제출·이동하지 않고 명시적 버튼으로 실행합니다[7.2.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="input-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="input-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>size</code> prop 은 없고 높이는 48px(<code>h-control-h-md</code>) 고정입니다. 네이티브
                        input 속성을 그대로 받습니다.
                    </p>
                </div>
                <Table caption="Input Props API" columns={API_COLUMNS} rows={API_ROWS} size="md" />
                <Table
                    caption="Input 조합 컴포넌트 추가 Props"
                    columns={COMPOSITE_API_COLUMNS}
                    rows={COMPOSITE_API_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default InputGuidePage
