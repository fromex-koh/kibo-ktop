// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import DatePickerFormDemo from './date-picker-form-demo'
import DatePickerDemo, {DatePickerMonthDemo, DatePickerSizesDemo, DatePickerStatesDemo} from './date-picker-demo'

export const metadata: Metadata = {title: '데이트피커 (DatePicker)'}

const BASIC_CODE = `import {DatePicker} from '@/components/composite/date-picker'

const [date, setDate] = useState<Date>()

<Field className="max-w-90">
  <FieldLabel htmlFor="visit-date" className="font-bold text-foreground">
    방문 예정일
  </FieldLabel>
  <DatePicker
    id="visit-date"
    name="visitDate"
    value={date}
    onChange={setDate}
    aria-describedby="visit-date-description"
  />
  <FieldDescription id="visit-date-description">
    달력에서 날짜를 선택해 주세요.
  </FieldDescription>
</Field>`

const MONTH_CODE = `{/* 연-월만 고르는 칸 — 달력 자리에 12개월 격자가 열린다 */}
<DatePicker granularity="month" name="startMonth" />

{/* 값은 그 달의 1일(Date)로 다루고, 표시·제출은 연월까지만 한다
    화면 2026-05 · 제출 "2026-05" · 폼 전달 입력은 type="month" */}

{/* 두 칸을 짝지어 기간으로 쓸 때 — 서로의 경계가 된다 */}
<DatePicker granularity="month" value={start} onChange={setStart} maxDate={end} />
<DatePicker granularity="month" value={end} onChange={setEnd} minDate={start} />`

const RESPONSIVE_CODE = `<DatePicker name="foundDate" />                    // md 이상: 트리거 옆 팝오버
<DatePicker name="startMonth" granularity="month" /> // md 미만: 모달(연월 선택)`

const SIZE_CODE = `{/* 일반 폼: 48px */}
<DatePicker size="lg" />

{/* 표·필터 등 밀도 높은 영역: 40px */}
<DatePicker size="md" />`

const STATE_CODE = `{/* 기본 */}
<DatePicker placeholder="연도-월-일" />

{/* 값 입력됨 */}
<DatePicker defaultValue={new Date(2026, 6, 13)} />

{/* 오류 */}
<DatePicker
  aria-invalid="true"
  aria-describedby="visit-date-error"
/>

{/* 읽기전용: 제출값 유지 */}
<DatePicker name="applicationDate" value={applicationDate} readOnly />

{/* 비활성: 제출에서 제외 */}
<DatePicker value={applicationDate} disabled />`

const FORM_CODE = `const [visitDate, setVisitDate] = useState<Date>()
const [hasVisitDateError, setVisitDateError] = useState(false)

<form onSubmit={handleSubmit}>
  <Field data-invalid={hasVisitDateError || undefined} className="max-w-90">
    <FieldLabel htmlFor="visit-date">방문 예정일</FieldLabel>
    <DatePicker
      id="visit-date"
      name="visitDate"
      required
      value={visitDate}
      onChange={(date) => {
        setVisitDate(date)
        setVisitDateError(false)
      }}
      onInvalid={() => setVisitDateError(true)}
      aria-invalid={hasVisitDateError || undefined}
      aria-describedby={hasVisitDateError ? 'visit-date-error' : undefined}
    />
    {hasVisitDateError ? (
      <FieldError id="visit-date-error">
        방문 예정일을 선택해 주세요.
      </FieldError>
    ) : null}
  </Field>

  <Button type="submit">날짜 선택 확인</Button>
</form>`

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const GRANULARITY_COLUMNS = [
    {key: 'granularity', header: 'granularity', align: 'start', rowHeader: true},
    {key: 'panel', header: '열리는 것', align: 'start'},
    {key: 'display', header: '표시 · 제출', align: 'start', wrap: true},
] as const

const GRANULARITY_ROWS = [
    {
        key: 'day',
        cells: [
            <code key="g">day</code>,
            '날짜 달력',
            <span key="d">
                2026-05-13 · 폼 전달 입력 <code>type=&quot;date&quot;</code>
            </span>,
        ],
    },
    {
        key: 'month',
        cells: [
            <code key="g">month</code>,
            '12개월 격자',
            <span key="d">
                2026-05 · 폼 전달 입력 <code>type=&quot;month&quot;</code>
            </span>,
        ],
    },
] as const

const RESPONSIVE_COLUMNS = [
    {key: 'width', header: '화면 폭', align: 'start', rowHeader: true},
    {key: 'shape', header: '여는 방식', align: 'start', wrap: true},
] as const

const RESPONSIVE_ROWS = [
    {key: 'desktop', cells: ['md 이상', '입력 상자 바로 아래 팝오버']},
    {key: 'mobile', cells: ['md 미만', '화면 가운데 모달 (제목 + 달력)']},
] as const

const CHOICE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'use', header: '사용 기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'date-picker',
        cells: [<code key="component">DatePicker</code>, '날짜(yyyy-MM-dd) 또는 연월(yyyy-MM) 하나를 달력에서 고를 때'],
    },
    {
        key: 'select',
        cells: [
            <Link key="component" href="/component-guide/select" className={LINK_CLASS}>
                Select
            </Link>,
            '정해진 몇 가지 값 중 하나를 고를 때. 월 · 연도만 짧게 고르는 SelectText 도 여기 있습니다.',
        ],
    },
    {
        key: 'combobox',
        cells: [
            <Link key="component" href="/component-guide/combobox" className={LINK_CLASS}>
                Combobox
            </Link>,
            '선택지가 많아 검색해야 할 때',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['DatePicker', 'value', '선택된 날짜입니다. 제어 방식에 씁니다.', 'undefined', 'Date'],
    ['DatePicker', 'defaultValue', '비제어 초기값입니다.', 'undefined', 'Date'],
    [
        'DatePicker',
        'controlled',
        '값이 undefined 여도 제어 값으로 다룹니다. 폼 상태와 연결할 때 켭니다.',
        'value !== undefined',
        'boolean',
    ],
    ['DatePicker', 'onChange', '날짜를 고를 때 호출됩니다.', 'undefined', '(date?: Date) => void'],
    [
        'DatePicker',
        'granularity',
        'month 면 12개월 격자가 열리고 표시 · 제출이 연월까지입니다.',
        "'day'",
        "'day' | 'month'",
    ],
    ['DatePicker', 'size', '입력 상자 높이입니다. lg 48px, md 40px.', "'lg'", "'lg' | 'md'"],
    [
        'DatePicker',
        'minDate / maxDate',
        '고를 수 있는 범위입니다. 범위 밖은 눌리지 않고 제출 검사에도 걸립니다.',
        'undefined',
        'Date',
    ],
    [
        'DatePicker',
        'validationMessage',
        '값을 주면 제출이 막히고 그 문구가 브라우저 검사 메시지가 됩니다.',
        'undefined',
        'string',
    ],
    [
        'DatePicker',
        'name / form / required',
        '폼 필드 이름, 연결할 form, 필수 여부입니다. name 이 있어야 값이 제출됩니다.',
        'undefined',
        'string / string / boolean',
    ],
    [
        'DatePicker',
        'onInvalid',
        'required 검사에 걸릴 때 호출됩니다. 포커스는 입력 상자로 갑니다.',
        'undefined',
        'FormEventHandler<HTMLInputElement>',
    ],
    ['DatePicker', 'placeholder', '값이 없을 때 보이는 문구입니다.', "'연도-월-일' (month: '연도-월')", 'string'],
    ['DatePicker', 'disabled', '포커스 · 달력 열기가 막히고 폼 제출에서 빠집니다.', 'undefined', 'boolean'],
    ['DatePicker', 'readOnly', '달력은 열리지 않고 값 · 폼 제출은 유지됩니다.', 'undefined', 'boolean'],
    [
        'DatePicker',
        'id / aria-invalid / aria-describedby',
        'FieldLabel, 설명 · 오류 메시지와 연결합니다.',
        'undefined',
        'string / boolean / string',
    ],
    ['DatePicker', 'className', '입력 상자에 덧붙일 클래스입니다.', 'undefined', 'string'],
] as const

const DatePickerGuidePage = () => (
    <GuidePageShell
        title="데이트피커 (DatePicker)"
        description="달력에서 날짜 하나를 고르는 입력입니다. 연-월만 고르는 단위도 지원합니다."
    >
        <BaseCard>
            <section aria-labelledby="date-picker-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-picker-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>FieldLabel</code> 의 <code>htmlFor</code> 와 <code>id</code> 를 연결합니다. 값은{' '}
                        <code>Date</code> 로 다루고 화면과 제출은 <code>yyyy-MM-dd</code> 형식입니다. 고르면 바로 닫히며
                        확인 버튼은 없습니다.
                    </p>
                </div>
                <DatePickerDemo />
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-picker-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-picker-variants" className="typo-h4-bold">
                        변형과 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        단위, 크기, 상태는 props 로 지정하고 오류와 필수는 <code>Field</code> 와 함께 처리합니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">연-월 단위</h3>
                        <p className="typo-body-l-regular text-label-foreground max-w-4xl">
                            일까지 고를 필요가 없는 칸은 <code>granularity=&quot;month&quot;</code> 를 줍니다. 값은 그
                            달의 1일 <code>Date</code> 로 담깁니다.
                        </p>
                        <Table
                            size="md"
                            caption="고르는 단위별 차이"
                            columns={GRANULARITY_COLUMNS}
                            rows={GRANULARITY_ROWS}
                        />
                        <DatePickerMonthDemo />
                        <CodeBlock code={MONTH_CODE} language="tsx" copyLabel="복사" />
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                <code>minDate</code> · <code>maxDate</code> 밖의 달은 그 달이 통째로 벗어날 때만
                                잠깁니다.
                            </li>
                            <li>
                                고를 수는 있게 두고 제출만 막을 규칙(두 칸의 앞뒤 순서 등)은{' '}
                                <code>validationMessage</code> 로 겁니다.
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">크기</h3>
                        <p className="typo-body-l-regular text-label-foreground max-w-4xl">
                            <code>lg</code>(48px, 기본)와 <code>md</code>(40px) 중 같은 줄의 Select 와 맞춥니다.
                        </p>
                        <DatePickerSizesDemo />
                        <CodeBlock code={SIZE_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">상태</h3>
                        <DatePickerStatesDemo />
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                오류: <code>aria-invalid</code> 와 <code>Field</code> 의 <code>data-invalid</code>,
                                메시지는 <code>aria-describedby</code> 로 연결합니다.
                            </li>
                            <li>읽기전용: 달력이 열리지 않고 값은 제출됩니다.</li>
                            <li>비활성: 포커스와 달력 열기가 막히고 제출에서 빠집니다.</li>
                        </ul>
                        <CodeBlock code={STATE_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">폼 제출</h3>
                        <p className="typo-body-l-regular text-label-foreground max-w-4xl">
                            <code>name</code> 을 주면 <code>yyyy-MM-dd</code>(연-월 단위는 <code>yyyy-MM</code>)로
                            제출됩니다. <code>required</code> 검사에 걸리면 <code>onInvalid</code> 가 호출되고 포커스가
                            입력 상자로 갑니다.
                        </p>
                        <DatePickerFormDemo />
                        <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">반응형</h3>
                        <p className="typo-body-l-regular text-label-foreground max-w-4xl">
                            화면 폭에 따라 여는 방식만 바뀌고 사용 코드는 같습니다. 모달 제목은 단위에 따라{' '}
                            <q>날짜 선택</q> 또는 <q>연월 선택</q> 으로 붙습니다.
                        </p>
                        <Table
                            caption="화면 폭에 따른 DatePicker 형태"
                            columns={RESPONSIVE_COLUMNS}
                            rows={RESPONSIVE_ROWS}
                            size="md"
                        />
                        <CodeBlock code={RESPONSIVE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-picker-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-picker-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        날짜는 DatePicker, 그 외 값은 선택지 수로 구분합니다.
                    </p>
                </div>
                <Table
                    caption="DatePicker · Select · Combobox 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-picker-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-picker-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        입력 상자는 버튼이라 날짜를 직접 타이핑하지 않고 달력에서 고릅니다. 모달은 Radix Dialog 가
                        포커스 트랩과 복귀를 맡습니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>FieldLabel htmlFor</code> 와 <code>id</code> 를 연결합니다[7.4.1].{' '}
                        <code>placeholder</code> 는 라벨을 대신하지 못합니다.
                    </li>
                    <li>
                        오류는 <code>aria-invalid</code> + <code>aria-describedby</code> + <code>FieldError</code> 로
                        알립니다[7.4.2]. 색만으로 오류를 전하지 않도록 메시지를 함께 둡니다[5.3.1].
                    </li>
                    <li>
                        <kbd>Enter</kbd> · <kbd>Space</kbd> 로 달력을 열고, 방향키로 날짜를 옮기고 <kbd>Enter</kbd> 로
                        고르며 <kbd>Esc</kbd> 로 닫습니다[6.1.1]. 월 · 연도 선택은 네이티브 select 입니다.
                    </li>
                    <li>
                        달력 안 월 · 연도 선택과 이전 · 다음 버튼은 고른 뒤에도 같은 컨트롤로 포커스를
                        복원합니다[6.1.2]. 월 · 연도 선택 이름은 한국어로 제공됩니다[5.1.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-picker-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-picker-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        값은 모두 <code>Date</code> 로 주고받습니다. 모든 속성이 선택입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="DatePicker Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default DatePickerGuidePage
