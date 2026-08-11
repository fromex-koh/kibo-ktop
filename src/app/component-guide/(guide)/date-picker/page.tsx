import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import DatePickerFormDemo from './date-picker-form-demo'
import DatePickerDemo, {DatePickerMonthDemo, DatePickerSizesDemo, DatePickerStatesDemo} from './date-picker-demo'

export const metadata: Metadata = {title: '데이트피커 (DatePicker)'}

const BASIC_CODE = `const [date, setDate] = useState<Date>()

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

const RESPONSIVE_CODE = `{/* 화면 폭에 따라 여는 방식이 바뀐다 — 쓰는 쪽 코드는 그대로다 */}
<DatePicker name="foundDate" />                    // md 이상: 트리거 옆 팝오버
<DatePicker name="startMonth" granularity="month" /> // md 미만: 모달(연월 선택)

{/* 모달 제목은 고르는 단위를 따라간다 — 날짜 선택 / 연월 선택 */}`

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
const [visitDateError, setVisitDateError] = useState(false)

<form onSubmit={handleSubmit}>
  <Field data-invalid={visitDateError || undefined} className="max-w-90">
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
      aria-invalid={visitDateError || undefined}
      aria-describedby={visitDateError ? 'visit-date-error' : undefined}
    />
    {visitDateError ? (
      <FieldError id="visit-date-error">
        방문 예정일을 선택해 주세요.
      </FieldError>
    ) : null}
  </Field>

  <Button type="submit">날짜 선택 확인</Button>
</form>`

const GRANULARITY_COLUMNS = [
    {key: 'granularity', header: 'granularity', align: 'start', rowHeader: true},
    {key: 'panel', header: '열리는 것', align: 'start'},
    {key: 'display', header: '표시·제출', align: 'start', wrap: true},
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
    {key: 'desktop', cells: ['md 이상 (768~)', '트리거 바로 아래에 붙는 팝오버 (Popover)']},
    {key: 'mobile', cells: ['md 미만 (~767)', '화면 가운데 모달 — 제목 + 달력 (Dialog)']},
]

const SIZE_COLUMNS = [
    {key: 'size', header: 'Size', align: 'start', rowHeader: true},
    {key: 'height', header: '높이', align: 'start'},
    {key: 'use', header: '사용 기준', align: 'start', wrap: true},
] as const

const SIZE_ROWS = [
    {
        key: 'lg',
        cells: [<code key="size">lg</code>, '48px', '일반적인 폼 입력 — 기본값'],
    },
    {
        key: 'md',
        cells: [<code key="size">md</code>, '40px', '표·필터 등 밀도 높은 영역'],
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
        key: 'readonly',
        cells: ['읽기전용', <code key="prop">readOnly</code>, '달력은 열리지 않지만 값과 폼 제출은 유지됩니다.'],
    },
    {
        key: 'disabled',
        cells: ['비활성', <code key="prop">disabled</code>, '포커스·달력 열기·폼 제출에서 제외됩니다.'],
    },
] as const

const API_COLUMNS = [
    {key: 'prop', header: 'Prop', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start', wrap: true},
    {key: 'default', header: '기본값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const API_ROWS = [
    {
        key: 'value',
        cells: [
            <code key="prop">value / defaultValue</code>,
            <code key="type">Date | undefined</code>,
            '-',
            'value는 제어 방식, defaultValue는 비제어 방식의 초기 날짜입니다.',
        ],
    },
    {
        key: 'onChange',
        cells: [
            <code key="prop">onChange</code>,
            <code key="type">(date?: Date) =&gt; void</code>,
            '-',
            '날짜를 선택하거나 해제할 때 호출됩니다.',
        ],
    },
    {
        key: 'granularity',
        cells: [
            <code key="prop">granularity</code>,
            <code key="type">day | month</code>,
            <code key="default">day</code>,
            'month면 날짜 달력 대신 12개월 격자가 열리고, 값·표시·제출을 연월까지만 다룹니다.',
        ],
    },
    {
        key: 'size',
        cells: [
            <code key="prop">size</code>,
            <code key="type">lg | md</code>,
            <code key="default">lg</code>,
            '트리거 높이를 선택합니다.',
        ],
    },
    {
        key: 'form',
        cells: [
            <code key="prop">name / form / required</code>,
            <code key="type">string / string / boolean</code>,
            '- / - / false',
            '날짜를 yyyy-MM-dd(연-월 단위는 yyyy-MM) 형식으로 FormData에 제출하고 필수 조건을 지정합니다.',
        ],
    },
    {
        key: 'invalid',
        cells: [
            <code key="prop">onInvalid</code>,
            <code key="type">FormEventHandler&lt;HTMLInputElement&gt;</code>,
            '-',
            'required 검증 실패 시 오류 상태를 갱신합니다. 포커스는 실제 트리거로 이동합니다.',
        ],
    },
    {
        key: 'placeholder',
        cells: [
            <code key="prop">placeholder</code>,
            <code key="type">string</code>,
            '연도-월-일 (month: 연도-월)',
            '값이 없을 때 표시하며 FieldLabel을 대신할 수 없습니다.',
        ],
    },
    {
        key: 'range',
        cells: [
            <code key="prop">minDate / maxDate</code>,
            <code key="type">Date</code>,
            '-',
            '고를 수 있는 범위입니다. 범위 밖은 달력에서 눌리지 않고 월·연도 목록에서도 빠지며, 폼 전달 입력의 min·max로도 걸립니다.',
        ],
    },
    {
        key: 'validationMessage',
        cells: [
            <code key="prop">validationMessage</code>,
            <code key="type">string</code>,
            '-',
            '고를 수는 있지만 제출은 막아야 하는 사유입니다. 값을 주면 그 문구가 브라우저 검사 메시지가 됩니다(setCustomValidity).',
        ],
    },
    {
        key: 'state',
        cells: [
            <code key="prop">disabled / readOnly</code>,
            <code key="type">boolean</code>,
            'false',
            '비활성 또는 읽기전용 상태를 지정합니다.',
        ],
    },
    {
        key: 'a11y',
        cells: [
            <code key="prop">id / aria-invalid / aria-describedby</code>,
            <code key="type">string / boolean / string</code>,
            '-',
            'FieldLabel과 오류 또는 설명 메시지를 트리거에 연결합니다.',
        ],
    },
] as const

const DatePickerGuidePage = () => (
    <GuidePageShell
        title="데이트피커 (DatePicker)"
        description='달력에서 단일 날짜를 선택하고 yyyy-MM-dd 형식으로 표시·제출하는 날짜 입력 컴포넌트입니다. 연-월만 고르는 단위(granularity="month")도 같은 컴포넌트로 씁니다.'
    >
        <BaseCard variant="outlined">
            <section aria-labelledby="date-picker-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-picker-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code>FieldLabel</code>의 <code>htmlFor</code>와 DatePicker의 <code>id</code>를 연결합니다.{' '}
                        <code>value + onChange</code>는 제어 방식, <code>defaultValue</code>는 비제어 방식입니다.
                    </p>
                </div>
                <DatePickerDemo />
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-picker-granularity" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-picker-granularity" className="typo-h4-bold">
                        연-월 단위
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        라벨이 &ldquo;년월&rdquo;인 칸(근무 시작·종료 연월 등)은 일까지 고를 이유가 없습니다.{' '}
                        <code>granularity=&quot;month&quot;</code>를 주면 같은 입력 상자와 여는 방식(팝오버 · 모바일은
                        모달)을 그대로 쓰면서 안의 달력만 12개월 격자로 바뀝니다. 연도는 이전·다음 버튼과 목록에서
                        고릅니다 — 20년 전 일을 적는 칸도 있기 때문입니다.
                    </p>
                </div>
                <Table size="md" caption="고르는 단위별 차이" columns={GRANULARITY_COLUMNS} rows={GRANULARITY_ROWS} />
                <DatePickerMonthDemo />
                <CodeBlock code={MONTH_CODE} language="tsx" copyLabel="복사" />
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-1 pl-5">
                    <li>
                        값은 두 단위 모두 <code>Date</code>로 다룹니다. 연-월 단위는 그 달의 1일로 담기므로 기간 계산에
                        그대로 쓸 수 있습니다.
                    </li>
                    <li>
                        범위 밖의 달은 <strong>그 달이 통째로 벗어날 때만</strong> 잠깁니다 — 오늘이 낀 이번 달은 상한이
                        오늘이어도 고를 수 있습니다.
                    </li>
                    <li>
                        고를 수는 있게 두고 제출만 막아야 하는 규칙(두 칸의 앞뒤 순서 등)은{' '}
                        <code>validationMessage</code>로 겁니다. 달력에서 아예 막으면 사용자는 왜 안 눌리는지 모른 채
                        고장으로 읽습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-picker-responsive" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-picker-responsive" className="typo-h4-bold">
                        반응형 — 모바일은 모달
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        md(768) 이상은 트리거 옆 팝오버로, 그 아래에서는 화면 가운데 모달로 엽니다. 좁은 화면에서
                        팝오버는 화면 밖으로 밀리거나 뒤 내용을 가린 채 어디를 누르는지 알기 어렵기 때문입니다. 담기는
                        내용(달력 · 12개월 격자)과 고르면 바로 닫히는 동작은 두 형태가 같아, 쓰는 쪽 코드는 달라지지
                        않습니다.
                    </p>
                </div>
                <Table
                    caption="화면 폭에 따른 DatePicker 형태"
                    columns={RESPONSIVE_COLUMNS}
                    rows={RESPONSIVE_ROWS}
                    size="md"
                />
                <CodeBlock code={RESPONSIVE_CODE} language="tsx" copyLabel="복사" />
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        모달에는 이름이 필요해 고르는 단위에 따라 제목이 붙습니다 — 날짜는{' '}
                        <strong className="text-foreground font-medium">날짜 선택</strong>, 연월은{' '}
                        <strong className="text-foreground font-medium">연월 선택</strong>. 확인 버튼은 없습니다(고르면
                        닫힙니다).
                    </li>
                    <li>
                        포커스 트랩 · Esc · 바깥 클릭 · 포커스 복귀 · 배경 스크롤 잠금은 radix Dialog 가 맡습니다
                        [8.2.1].
                    </li>
                    <li>
                        모달 안에서는 달력이 카드 폭에 맞춰 줄어듭니다 — 7칸 × 44 는 360 화면에 들어가지 않아 날짜
                        버튼의 최소 폭을 풀었습니다. 셀 높이(40)는 그대로입니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-picker-size" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-picker-size" className="typo-h4-bold">
                        Size 선택
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Select와 같은 높이 축을 사용합니다. 같은 폼 행에서는 인접한 컨트롤과 동일한 size를 선택합니다.
                    </p>
                </div>
                <Table caption="DatePicker size 사용 기준" columns={SIZE_COLUMNS} rows={SIZE_ROWS} size="md" />
                <DatePickerSizesDemo />
                <CodeBlock code={SIZE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-picker-state" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-picker-state" className="typo-h4-bold">
                        상태와 오류
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기본·값 입력됨·오류·읽기전용·비활성 상태를 비교합니다. 포커스링은 라벨을 제외한 트리거에만
                        표시됩니다.
                    </p>
                </div>
                <Table caption="DatePicker 상태 처리 기준" columns={STATE_COLUMNS} rows={STATE_ROWS} size="md" />
                <DatePickerStatesDemo />
                <CodeBlock code={STATE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-picker-form" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-picker-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code>name</code>이 있으면 날짜가 <code>yyyy-MM-dd</code>로 제출됩니다. <code>required</code>{' '}
                        검증 실패는 <code>onInvalid</code>로 처리하며, 읽기전용 값은 제출되고 비활성 값은 제외됩니다.
                    </p>
                </div>
                <DatePickerFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-picker-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-picker-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        날짜 선택, 폼 제출, 상태와 접근성 연결에 필요한 속성입니다.
                    </p>
                </div>
                <Table caption="DatePicker Props API" columns={API_COLUMNS} rows={API_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default DatePickerGuidePage
