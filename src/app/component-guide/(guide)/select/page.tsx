import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {SelectText} from '@/components/composite/select-text'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {Field, FieldDescription, FieldError, FieldLabel} from '@/components/ui/field'
import SelectFormDemo from './select-form-demo'

export const metadata: Metadata = {title: '셀렉트 (Select)'}

const FRUITS = [
    {value: 'apple', label: '사과'},
    {value: 'banana', label: '바나나'},
    {value: 'cherry', label: '체리'},
] as const

const PERIOD_OPTIONS = [
    {value: 'all', label: '전체 기간'},
    {value: 'year', label: '최근 1년'},
    {value: 'month', label: '최근 1개월'},
]

const MONTH_OPTIONS = [
    {value: '07', label: '07월'},
    {value: '08', label: '08월'},
    {value: '09', label: '09월'},
]

const FruitOptions = () =>
    FRUITS.map((fruit) => (
        <SelectItem key={fruit.value} value={fruit.value}>
            {fruit.label}
        </SelectItem>
    ))

const BASIC_CODE = `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/composite/select-field'

<Field className="max-w-90">
  <FieldLabel htmlFor="fruit" className="font-bold text-foreground">
    좋아하는 과일
  </FieldLabel>
  <Select name="fruit">
    <SelectTrigger id="fruit" className="w-full">
      <SelectValue placeholder="선택해 주세요" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">사과</SelectItem>
      <SelectItem value="banana">바나나</SelectItem>
    </SelectContent>
  </Select>
</Field>`

const TEXT_CODE = `import {SelectText} from '@/components/composite/select-text'

<SelectText
  size="sm"
  aria-label="월 선택"
  options={[
    {value: '07', label: '07월'},
    {value: '08', label: '08월'},
  ]}
  value={month}
  onChange={(event) => setMonth(event.currentTarget.value)}
/>`

const SIZE_CODE = `{/* Select: 일반 폼 48px */}
<SelectTrigger size="lg" />

{/* Select: 밀도 높은 영역 40px */}
<SelectTrigger size="md" />

{/* SelectText: 글자 크기 기반 3단계 */}
<SelectText size="lg" options={options} />
<SelectText size="md" options={options} />
<SelectText size="sm" options={options} />`

const STATE_CODE = `{/* 오류 */}
<Field data-invalid>
  <Select>
    <SelectTrigger aria-invalid="true" aria-describedby="fruit-error">
      <SelectValue placeholder="선택해 주세요" />
    </SelectTrigger>
    <SelectContent>{/* SelectItem */}</SelectContent>
  </Select>
  <FieldError id="fruit-error">과일을 선택해 주세요.</FieldError>
</Field>

{/* 읽기전용: 값 제출 유지 */}
<Select name="channel" defaultValue="online" readOnly>{/* ... */}</Select>

{/* 비활성: 제출에서 제외 */}
<Select defaultValue="online" disabled>{/* ... */}</Select>`

const FORM_CODE = `const [applicationType, setApplicationType] = useState('')
const [error, setError] = useState(false)

<form noValidate onSubmit={handleSubmit}>
  <Field data-invalid={error || undefined}>
    <FieldLabel htmlFor="application-type">신청 유형</FieldLabel>
    <Select
      name="applicationType"
      value={applicationType}
      onValueChange={(value) => {
        setApplicationType(value)
        setError(false)
      }}
    >
      <SelectTrigger
        id="application-type"
        aria-invalid={error || undefined}
        aria-describedby={error ? 'application-type-error' : undefined}
      >
        <SelectValue placeholder="신청 유형을 선택하세요" />
      </SelectTrigger>
      <SelectContent>{/* SelectItem */}</SelectContent>
    </Select>
    {error ? (
      <FieldError id="application-type-error">
        신청 유형을 선택해 주세요.
      </FieldError>
    ) : null}
  </Field>

  <Button type="submit">선택 내용 확인</Button>
</form>`

const COMPONENT_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'implementation', header: '구현', align: 'start'},
    {key: 'use', header: '사용 기준', align: 'start', wrap: true},
    {key: 'menu', header: '열린 목록', align: 'start', wrap: true},
] as const

const COMPONENT_ROWS = [
    {
        key: 'select',
        cells: [
            <code key="component">Select</code>,
            'Radix UI',
            '라벨이 있는 일반 폼의 단일 선택 입력',
            '프로젝트 스타일의 커스텀 목록',
        ],
    },
    {
        key: 'select-text',
        cells: [
            <code key="component">SelectText</code>,
            'native select',
            '달력 월·연도, 제목 옆 필터처럼 면 없는 짧은 선택',
            '운영체제가 표시하는 시스템 목록',
        ],
    },
] as const

const SIZE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'size', header: 'Size', align: 'start'},
    {key: 'spec', header: '높이 / 타이포', align: 'start'},
    {key: 'use', header: '사용 기준', align: 'start', wrap: true},
] as const

const SIZE_ROWS = [
    {key: 'select-lg', cells: ['Select', <code key="size">lg</code>, '48px', '일반 폼 — 기본값']},
    {key: 'select-md', cells: ['Select', <code key="size">md</code>, '40px', '표·필터 등 밀도 높은 영역']},
    {key: 'text-lg', cells: ['SelectText', <code key="size">lg</code>, '24px / 36px', '큰 제목과 함께 쓰는 선택']},
    {key: 'text-md', cells: ['SelectText', <code key="size">md</code>, '20px / 30px', '중간 제목과 함께 쓰는 선택']},
    {key: 'text-sm', cells: ['SelectText', <code key="size">sm</code>, '16px / 24px', 'DatePicker 월·연도 선택']},
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
        key: 'readonly',
        cells: ['읽기전용', <code key="prop">readOnly</code>, '목록은 열리지 않지만 선택값과 폼 제출은 유지됩니다.'],
    },
    {
        key: 'disabled',
        cells: ['비활성', <code key="prop">disabled</code>, '포커스·목록 열기·폼 제출에서 제외됩니다.'],
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
        key: 'select-value',
        cells: [
            'Select',
            <code key="prop">value / defaultValue / onValueChange</code>,
            <code key="type">Radix Select props</code>,
            '제어 또는 비제어 선택값을 관리합니다.',
        ],
    },
    {
        key: 'select-form',
        cells: [
            'Select',
            <code key="prop">name / required / disabled</code>,
            <code key="type">string / boolean</code>,
            '폼 필드 이름, 필수 조건, 비활성 상태를 지정합니다.',
        ],
    },
    {
        key: 'select-readonly',
        cells: [
            'Select',
            <code key="prop">readOnly</code>,
            <code key="type">boolean</code>,
            '프로젝트 확장 속성으로 목록 열기와 값 변경을 막습니다.',
        ],
    },
    {
        key: 'trigger-size',
        cells: [
            'SelectTrigger',
            <code key="prop">size</code>,
            <code key="type">lg | md</code>,
            '상자형 트리거 높이를 선택합니다.',
        ],
    },
    {
        key: 'trigger-a11y',
        cells: [
            'SelectTrigger',
            <code key="prop">id / aria-invalid / aria-describedby</code>,
            <code key="type">HTML attributes</code>,
            'FieldLabel과 오류 또는 설명 메시지를 연결합니다.',
        ],
    },
    {
        key: 'text-options',
        cells: [
            'SelectText',
            <code key="prop">options</code>,
            <code key="type">&#123;value, label, disabled?&#125;[]</code>,
            '네이티브 option 목록입니다.',
        ],
    },
    {
        key: 'text-size',
        cells: [
            'SelectText',
            <code key="prop">size</code>,
            <code key="type">lg | md | sm</code>,
            '텍스트와 화살표 크기를 선택합니다.',
        ],
    },
    {
        key: 'text-native',
        cells: [
            'SelectText',
            <code key="prop">value / defaultValue / onChange / name</code>,
            <code key="type">native select attributes</code>,
            '네이티브 select 방식으로 값과 폼 제출을 관리합니다.',
        ],
    },
] as const

const SelectGuidePage = () => (
    <GuidePageShell
        title="셀렉트 (Select)"
        description="상자형 Select와 텍스트형 SelectText는 목적과 구현이 다른 별도 컴포넌트입니다."
    >
        <BaseCard variant="outlined">
            <section aria-labelledby="select-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="select-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code>Select</code>는 Radix 기반의 일반 폼 입력이고, <code>SelectText</code>는 네이티브 select를
                        사용하는 면 없는 선택입니다. 서로 variant 관계가 아니므로 각각 import합니다.
                    </p>
                </div>
                <Table
                    caption="Select와 SelectText 선택 기준"
                    columns={COMPONENT_COLUMNS}
                    rows={COMPONENT_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="select-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="select-basic" className="typo-h4-bold">
                        Select 기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Field 안에서 Trigger의 <code>id</code>를 FieldLabel의 <code>htmlFor</code>와 연결합니다. 목록의
                        모양과 키보드 탐색은 프로젝트 Radix Select가 담당합니다.
                    </p>
                </div>
                <Field className="max-w-90">
                    <FieldLabel htmlFor="select-basic-fruit" className="text-foreground font-bold">
                        좋아하는 과일
                    </FieldLabel>
                    <Select name="favoriteFruit">
                        <SelectTrigger
                            id="select-basic-fruit"
                            className="w-full"
                            aria-describedby="select-basic-description"
                        >
                            <SelectValue placeholder="선택해 주세요" />
                        </SelectTrigger>
                        <SelectContent>
                            <FruitOptions />
                        </SelectContent>
                    </Select>
                    <FieldDescription id="select-basic-description">한 가지 과일을 선택해 주세요.</FieldDescription>
                </Field>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="select-text" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="select-text" className="typo-h4-bold">
                        SelectText 사용
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        짧은 값 전환에 사용하는 별도 네이티브 컴포넌트입니다. DatePicker 달력의 월·연도 선택은{' '}
                        <code>SelectText size=&quot;sm&quot;</code>을 사용합니다. 열린 목록은 운영체제에 따라 다르게
                        보입니다.
                    </p>
                </div>
                <SelectText size="sm" options={MONTH_OPTIONS} defaultValue="07" aria-label="월 선택" />
                <CodeBlock code={TEXT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="select-size" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="select-size" className="typo-h4-bold">
                        Size 선택
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code>Select</code>의 size는 <code>SelectTrigger</code>에 지정하며 기본값은 <code>lg</code>
                        입니다. <code>SelectText</code>는 별도 컴포넌트로 글자 크기와 행간이 함께 바뀝니다.
                    </p>
                </div>
                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="flex max-w-90 flex-col gap-5">
                        <h3 className="typo-body-xl-bold">Select 크기</h3>
                        <Field>
                            <FieldLabel htmlFor="select-size-lg" className="text-foreground font-bold">
                                lg · 48px · 기본값
                            </FieldLabel>
                            <Select>
                                <SelectTrigger id="select-size-lg" size="lg" className="w-full">
                                    <SelectValue placeholder="선택해 주세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    <FruitOptions />
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="select-size-md" className="text-foreground font-bold">
                                md · 40px
                            </FieldLabel>
                            <Select>
                                <SelectTrigger id="select-size-md" size="md" className="w-full">
                                    <SelectValue placeholder="선택해 주세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    <FruitOptions />
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                    <div className="flex flex-col gap-5">
                        <h3 className="typo-body-xl-bold">SelectText 크기</h3>
                        <div className="flex flex-wrap items-start gap-8">
                            <SelectText
                                size="lg"
                                options={PERIOD_OPTIONS}
                                defaultValue="all"
                                aria-label="기간 선택 lg"
                            />
                            <SelectText
                                size="md"
                                options={PERIOD_OPTIONS}
                                defaultValue="all"
                                aria-label="기간 선택 md"
                            />
                            <SelectText
                                size="sm"
                                options={PERIOD_OPTIONS}
                                defaultValue="all"
                                aria-label="기간 선택 sm"
                            />
                        </div>
                    </div>
                </div>
                <Table caption="Select 계열 size 사용 기준" columns={SIZE_COLUMNS} rows={SIZE_ROWS} size="md" />
                <CodeBlock code={SIZE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="select-state" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="select-state" className="typo-h4-bold">
                        Select 상태와 오류
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기본·값 선택됨·오류·읽기전용·비활성 상태를 비교합니다. 포커스링은 라벨을 제외한 Trigger에만
                        표시됩니다.
                    </p>
                </div>
                <Table caption="Select 상태 처리 기준" columns={STATE_COLUMNS} rows={STATE_ROWS} size="md" />
                <div className="grid gap-6 lg:grid-cols-2">
                    <Field className="max-w-90">
                        <FieldLabel htmlFor="select-state-default" className="text-foreground font-bold">
                            기본
                        </FieldLabel>
                        <Select>
                            <SelectTrigger id="select-state-default" className="w-full">
                                <SelectValue placeholder="선택해 주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <FruitOptions />
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field className="max-w-90">
                        <FieldLabel htmlFor="select-state-filled" className="text-foreground font-bold">
                            값 선택됨
                        </FieldLabel>
                        <Select defaultValue="apple">
                            <SelectTrigger id="select-state-filled" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <FruitOptions />
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field data-invalid className="max-w-90">
                        <FieldLabel htmlFor="select-state-error" className="text-foreground font-bold">
                            오류
                        </FieldLabel>
                        <Select>
                            <SelectTrigger
                                id="select-state-error"
                                className="w-full"
                                aria-invalid="true"
                                aria-describedby="select-state-error-message"
                            >
                                <SelectValue placeholder="선택해 주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <FruitOptions />
                            </SelectContent>
                        </Select>
                        <FieldError id="select-state-error-message">과일을 선택해 주세요.</FieldError>
                    </Field>
                    <Field className="max-w-90">
                        <FieldLabel htmlFor="select-state-readonly" className="text-foreground font-bold">
                            읽기전용
                        </FieldLabel>
                        <Select defaultValue="apple" readOnly>
                            <SelectTrigger id="select-state-readonly" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <FruitOptions />
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field data-disabled="true" className="max-w-90">
                        <FieldLabel htmlFor="select-state-disabled" className="text-foreground font-bold">
                            비활성
                        </FieldLabel>
                        <Select defaultValue="apple" disabled>
                            <SelectTrigger id="select-state-disabled" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <FruitOptions />
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
                <CodeBlock code={STATE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="select-form" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="select-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code>name</code>을 지정하면 선택값이 FormData에 포함됩니다. 읽기전용 값은 제출되고 비활성 값은
                        제외됩니다.
                    </p>
                </div>
                <SelectFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="select-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="select-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        대상 컬럼에서 Select·SelectTrigger·SelectText의 서로 다른 API를 구분합니다.
                    </p>
                </div>
                <Table caption="Select와 SelectText Props API" columns={API_COLUMNS} rows={API_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SelectGuidePage
