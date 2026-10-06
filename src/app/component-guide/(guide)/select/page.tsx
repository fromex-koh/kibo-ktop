// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {SelectText} from '@/components/composite/select-text'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
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

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const BASIC_CODE = `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/composite/select-field'
import {Field, FieldDescription, FieldLabel} from '@/components/ui/field'

<Field className="max-w-90">
  <FieldLabel htmlFor="fruit">좋아하는 과일</FieldLabel>
  <Select name="fruit">
    <SelectTrigger id="fruit" className="w-full" aria-describedby="fruit-description">
      <SelectValue placeholder="선택해 주세요" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">사과</SelectItem>
      <SelectItem value="banana">바나나</SelectItem>
    </SelectContent>
  </Select>
  <FieldDescription id="fruit-description">한 가지 과일을 선택해 주세요.</FieldDescription>
</Field>`

const SIZE_CODE = `{/* lg 48px(기본) · md 40px — size 는 SelectTrigger 에 준다 */}
<SelectTrigger size="md" />`

const STATE_CODE = `{/* 오류 — Field 와 SelectTrigger 에 함께 */}
<Field data-invalid>
  <Select>
    <SelectTrigger aria-invalid="true" aria-describedby="fruit-error">…</SelectTrigger>
    <SelectContent>{/* SelectItem */}</SelectContent>
  </Select>
  <FieldError id="fruit-error">과일을 선택해 주세요.</FieldError>
</Field>

{/* 읽기전용: 목록은 열리지 않고 값은 제출됨 */}
<Select name="channel" defaultValue="online" readOnly>…</Select>

{/* 비활성: 포커스 불가, 제출 제외 */}
<Select defaultValue="online" disabled>…</Select>`

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

const FORM_CODE = `const [applicationType, setApplicationType] = useState('')
const [hasError, setHasError] = useState(false)

<form noValidate onSubmit={handleSubmit}>
  <Field data-invalid={hasError || undefined}>
    <FieldLabel htmlFor="application-type">신청 유형</FieldLabel>
    <Select
      name="applicationType"
      required
      value={applicationType}
      onValueChange={(value) => {
        setApplicationType(value)
        setHasError(false)
      }}
    >
      <SelectTrigger
        id="application-type"
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? 'application-type-error' : undefined}
      >
        <SelectValue placeholder="신청 유형을 선택하세요" />
      </SelectTrigger>
      <SelectContent>{/* SelectItem */}</SelectContent>
    </Select>
    {hasError ? <FieldError id="application-type-error">신청 유형을 선택해 주세요.</FieldError> : null}
  </Field>
  <Button type="submit">선택 내용 확인</Button>
</form>`

const CHOICE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'use', header: '사용 기준', align: 'start', wrap: true},
    {key: 'note', header: '특징', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'select',
        cells: [
            <code key="component">Select</code>,
            '라벨이 있는 폼의 단일 선택.',
            'Radix 기반. 프로젝트 스타일 목록이 트리거 아래에 열립니다.',
        ],
    },
    {
        key: 'select-text',
        cells: [
            <code key="component">SelectText</code>,
            '제목 옆 필터, 달력 월 · 연도처럼 상자 없는 짧은 선택',
            '네이티브 select. 열린 목록은 운영체제 모양입니다.',
        ],
    },
    {
        key: 'combobox',
        cells: [
            <Link key="component" href="/component-guide/combobox" className={LINK_CLASS}>
                Combobox
            </Link>,
            '선택지가 많아 입력으로 검색해야 할 때',
            '입력창 + 목록. 입력한 글자로 선택지를 거릅니다(단일 선택).',
        ],
    },
    {
        key: 'date-picker',
        cells: [
            <Link key="component" href="/component-guide/date-picker" className={LINK_CLASS}>
                DatePicker
            </Link>,
            '날짜 선택',
            '달력 팝오버. 월 · 연도 선택에 SelectText 를 씁니다.',
        ],
    },
] as const

const SIZE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'size', header: 'size', align: 'start'},
    {key: 'spec', header: '높이 / 글자', align: 'start'},
    {key: 'use', header: '사용 기준', align: 'start', wrap: true},
] as const

const SIZE_ROWS = [
    {key: 'select-lg', cells: ['Select', <code key="size">lg</code>, '48px', '일반 폼 (기본값)']},
    {key: 'select-md', cells: ['Select', <code key="size">md</code>, '40px', '표 · 필터처럼 촘촘한 영역']},
    {key: 'text-lg', cells: ['SelectText', <code key="size">lg</code>, '24px / 36px Bold', '큰 제목 옆 (기본값)']},
    {key: 'text-md', cells: ['SelectText', <code key="size">md</code>, '20px / 30px Medium', '중간 제목 옆']},
    {key: 'text-sm', cells: ['SelectText', <code key="size">sm</code>, '16px / 24px Medium', 'DatePicker 월 · 연도']},
] as const

const PROPS_ITEMS = [
    [
        'Select',
        'value / defaultValue / onValueChange',
        '선택값입니다. 제어 · 비제어 모두 지원합니다.',
        '-',
        'string / (value: string) => void',
    ],
    ['Select', 'name / required / disabled', '폼 필드 이름, 필수, 비활성입니다.', 'undefined', 'string / boolean'],
    ['Select', 'readOnly', '목록 열기와 값 변경을 막습니다. 값은 계속 제출됩니다.', 'false', 'boolean'],
    ['SelectTrigger', 'size', '트리거 높이입니다. lg 48px, md 40px.', "'lg'", "'lg' | 'md'"],
    [
        'SelectTrigger',
        'id / aria-invalid / aria-describedby',
        'FieldLabel, 설명 · 오류 메시지와 연결합니다.',
        'undefined',
        'HTML attributes',
    ],
    [
        'SelectContent',
        'position',
        '목록 위치 방식입니다. 트리거 아래에 같은 폭으로 열립니다.',
        "'popper'",
        "'popper' | 'item-aligned'",
    ],
    ['SelectText', 'options', '선택지 목록입니다.', '-', '{value: string; label: string; disabled?: boolean}[]'],
    ['SelectText', 'size', '글자와 화살표 크기입니다.', "'lg'", "'lg' | 'md' | 'sm'"],
    [
        'SelectText',
        'placeholder',
        '값이 없을 때 첫 항목으로 보이는 안내 문구입니다. 다시 선택할 수 없습니다.',
        'undefined',
        'string',
    ],
    [
        'SelectText',
        'className / selectClassName',
        '바깥 상자 / select 요소에 덧붙일 클래스입니다.',
        'undefined',
        'string',
    ],
    [
        'SelectText',
        'value / defaultValue / onChange / name / disabled',
        '네이티브 select 속성 그대로입니다. 라벨이 없으므로 aria-label 을 줍니다.',
        '-',
        'select attributes',
    ],
] as const

const SelectGuidePage = () => (
    <GuidePageShell
        title="셀렉트 (Select)"
        description="목록에서 값 하나를 고르는 컴포넌트입니다. 상자형 Select 와 글자형 SelectText 가 있습니다."
    >
        <BaseCard>
            <section aria-labelledby="select-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="select-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>SelectTrigger</code> 의 <code>id</code> 를 <code>FieldLabel</code> 의 <code>htmlFor</code>{' '}
                        와 연결합니다. <code>Select</code> 는 <code>SelectField</code> 의 별칭입니다.
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
            <section aria-labelledby="select-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="select-variants" className="typo-h4-bold">
                        크기와 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        크기는 <code>SelectTrigger</code> 의 <code>size</code>, 상태는 <code>Select</code> ·{' '}
                        <code>SelectTrigger</code> 속성과 <code>Field</code> 로 지정합니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">크기</h3>
                        <div className="grid max-w-3xl gap-5 md:grid-cols-2">
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
                        <CodeBlock code={SIZE_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">상태</h3>
                        <div className="grid max-w-3xl gap-6 md:grid-cols-2">
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
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                오류: <code>SelectTrigger</code> 에 <code>aria-invalid</code>, <code>Field</code> 에{' '}
                                <code>data-invalid</code>, 메시지는 <code>aria-describedby</code> 로 연결합니다.
                            </li>
                            <li>읽기전용: 목록이 열리지 않고 값은 폼 제출에 포함됩니다.</li>
                            <li>비활성: 포커스와 목록 열기가 막히고 폼 제출에서 빠집니다.</li>
                        </ul>
                        <CodeBlock code={STATE_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">SelectText</h3>
                        <p className="typo-body-l-regular text-label-foreground max-w-4xl">
                            면과 테두리 없이 글자와 화살표만 둡니다. 네이티브 select 라 열린 목록은 운영체제 모양으로
                            나오고, 라벨이 없으므로 <code>aria-label</code> 을 줍니다.
                        </p>
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
                            <SelectText size="sm" options={MONTH_OPTIONS} defaultValue="07" aria-label="월 선택 sm" />
                        </div>
                        <Table caption="Select 계열 size 기준" columns={SIZE_COLUMNS} rows={SIZE_ROWS} size="md" />
                        <CodeBlock code={TEXT_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">폼 제출</h3>
                        <p className="typo-body-l-regular text-label-foreground max-w-4xl">
                            <code>name</code> 을 주면 선택값이 제출됩니다. 읽기전용 값은 제출되고 비활성 값은
                            제외됩니다. 값은 <code>value</code> · <code>onValueChange</code> 로 제어하거나{' '}
                            <code>defaultValue</code> 로 비제어로 씁니다.
                        </p>
                        <SelectFormDemo />
                        <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="select-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="select-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        값을 고르는 컴포넌트는 선택지 수와 입력 방식으로 구분합니다.
                    </p>
                </div>
                <Table
                    caption="Select · SelectText · Combobox · DatePicker 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="select-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="select-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        목록의 역할과 키보드 조작은 Radix 가 처리합니다. 사용처는 라벨과 오류 연결을 책임집니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>FieldLabel htmlFor</code> 와 <code>SelectTrigger id</code> 를 연결합니다[7.4.1]. 라벨을 둘
                        수 없는 <code>SelectText</code> 는 <code>aria-label</code> 을 줍니다.
                    </li>
                    <li>
                        오류는 <code>aria-invalid</code> + <code>aria-describedby</code> + <code>FieldError</code> 로
                        알립니다. 색만으로 오류를 전하지 않도록 메시지를 함께 둡니다[7.4.2][5.3.1].
                    </li>
                    <li>
                        <kbd>Enter</kbd> · <kbd>Space</kbd> · <kbd>↓</kbd> 로 목록을 열고, 방향키로 항목을 옮기고{' '}
                        <kbd>Enter</kbd> 로 고르며 <kbd>Esc</kbd> 로 닫습니다[6.1.1].
                    </li>
                    <li>
                        포커스는 외곽선으로 표시됩니다. 오류 칸은 마우스로 제출한 뒤 포커스가 옮겨져도
                        표시됩니다[6.1.2].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="select-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="select-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        그 외 속성은 Radix Select · 네이티브 select 와 같습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Select 계열 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SelectGuidePage
