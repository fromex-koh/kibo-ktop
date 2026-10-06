// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import ComboboxFormDemo from './combobox-form-demo'
import {ComboboxDemo, ComboboxStatesDemo} from './combobox-demo'

export const metadata: Metadata = {title: '콤보박스 (Combobox)'}

const USAGE_CODE = `import {Combobox} from '@/components/composite/combobox'

const [value, setValue] = useState('')

<Field className="max-w-90">
  <FieldLabel htmlFor="corp">기업형태</FieldLabel>
  <Combobox
    id="corp"
    options={corpTypes}
    value={value}
    onValueChange={setValue}
    placeholder="기업형태를 선택하세요"
    aria-describedby="corp-help"
  />
  <FieldDescription id="corp-help">
    기업형태를 검색해 한 가지를 선택해 주세요.
  </FieldDescription>
</Field>`

const DROPDOWN_CODE = `<Combobox
  id="program"
  type="dropdown"
  options={programs}
  value={value}
  onValueChange={setValue}
  placeholder="지원 프로그램을 선택하세요"
  searchPlaceholder="지원 프로그램 검색"
/>`

const FORM_CODE = `<form onSubmit={handleSubmit}>
  <Field data-invalid={hasError || undefined}>
    <FieldLabel htmlFor="organization">신청 기관</FieldLabel>
    <Combobox
      id="organization"
      name="organization"
      required
      options={organizations}
      value={value}
      onValueChange={setValue}
      aria-invalid={hasError || undefined}
      aria-describedby={hasError ? 'organization-hasError' : undefined}
    />
    {hasError ? (
      <FieldError id="organization-hasError">
        신청 기관을 선택해 주세요.
      </FieldError>
    ) : null}
  </Field>
</form>`

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const TYPE_COLUMNS = [
    {key: 'type', header: 'type', align: 'start', rowHeader: true},
    {key: 'search', header: '검색 위치', align: 'start'},
    {key: 'use', header: '사용 기준', align: 'start', wrap: true},
] as const

const TYPE_ROWS = [
    {
        key: 'input',
        cells: [<code key="type">input</code>, '필드 입력창', '선택지가 많아 바로 검색을 시작해야 할 때 (기본값)'],
    },
    {
        key: 'dropdown',
        cells: [<code key="type">dropdown</code>, '열린 목록 내부', 'Select 처럼 값을 먼저 보고 필요할 때만 검색할 때'],
    },
] as const

const CHOICE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'use', header: '사용 기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'combobox',
        cells: [
            <code key="component">Combobox</code>,
            '선택지가 많아 검색해서 하나를 고를 때. 값은 사용처가 제어합니다.',
        ],
    },
    {
        key: 'select',
        cells: [
            <Link key="component" href="/component-guide/select" className={LINK_CLASS}>
                Select
            </Link>,
            '검색 없이 목록에서 고르면 충분할 때. 비제어(defaultValue)도 가능합니다.',
        ],
    },
    {
        key: 'date-picker',
        cells: [
            <Link key="component" href="/component-guide/date-picker" className={LINK_CLASS}>
                DatePicker
            </Link>,
            '날짜를 고를 때',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['Combobox', 'options', '선택지 목록입니다.', '-', '{value: string; label: string}[]'],
    [
        'Combobox',
        'type',
        '검색창 위치입니다. 높이는 48px 고정이라 size 는 없습니다.',
        "'input'",
        "'input' | 'dropdown'",
    ],
    ['Combobox', 'value', '선택된 option 의 value 입니다. 제어 방식으로만 씁니다.', 'undefined', 'string'],
    [
        'Combobox',
        'onValueChange',
        '선택이 바뀔 때 호출됩니다. 비우면 빈 문자열이 옵니다.',
        'undefined',
        '(value: string) => void',
    ],
    ['Combobox', 'placeholder', '값이 없을 때 필드에 보이는 문구입니다.', "'선택하세요'", 'string'],
    ['Combobox', 'searchPlaceholder', 'dropdown 타입의 검색창 문구입니다.', "'검색어를 입력하세요'", 'string'],
    ['Combobox', 'emptyText', '검색 결과가 없을 때 문구입니다.', "'결과가 없습니다.'", 'string'],
    [
        'Combobox',
        'name / form / required',
        '폼 필드 이름, 연결할 form, 필수 여부입니다.',
        'undefined',
        'string / string / boolean',
    ],
    ['Combobox', 'disabled', '포커스 · 검색 · 선택이 막히고 폼 제출에서 빠집니다.', 'undefined', 'boolean'],
    ['Combobox', 'readOnly', '검색 · 값 변경이 막히고 폼 제출은 유지됩니다.', 'undefined', 'boolean'],
    [
        'Combobox',
        'id / aria-invalid / aria-describedby',
        'FieldLabel, 설명 · 오류 메시지와 연결합니다.',
        'undefined',
        'HTML attributes',
    ],
    ['Combobox', 'className', '필드에 덧붙일 클래스입니다.', 'undefined', 'string'],
] as const

const ComboboxGuidePage = () => (
    <GuidePageShell
        title="콤보박스 (Combobox)"
        description="검색해서 하나를 고르는 입력입니다. 검색창 위치에 따라 input · dropdown 두 타입이 있습니다."
    >
        <BaseCard>
            <section aria-labelledby="combobox-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="combobox-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>id</code> 를 <code>FieldLabel</code> 의 <code>htmlFor</code> 와 연결하고,{' '}
                        <code>value</code> · <code>onValueChange</code> 로 선택값을 관리합니다.
                    </p>
                </div>
                <ComboboxDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="combobox-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="combobox-variants" className="typo-h4-bold">
                        타입과 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        두 타입은 props 가 같고 검색창 위치만 다릅니다. 상태는 <code>Field</code> 와{' '}
                        <code>Combobox</code> 에 함께 지정합니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">type</h3>
                        <Table caption="Combobox type 사용 기준" columns={TYPE_COLUMNS} rows={TYPE_ROWS} size="md" />
                        <CodeBlock code={DROPDOWN_CODE} language="tsx" copyLabel="dropdown 복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">상태</h3>
                        <ComboboxStatesDemo />
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                오류: <code>aria-invalid</code> 와 <code>Field</code> 의 <code>data-invalid</code>,
                                메시지는 <code>aria-describedby</code> 로 연결합니다.
                            </li>
                            <li>읽기전용: 검색과 값 변경은 막히고 폼 제출은 유지됩니다.</li>
                            <li>비활성: 포커스 · 검색 · 선택이 막히고 폼 제출에서 빠집니다.</li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">폼 제출</h3>
                        <p className="typo-body-l-regular text-label-foreground max-w-4xl">
                            <code>name</code> 을 주면 선택값이 제출됩니다. 필수 검증과 오류 연결은 사용처가 합니다.
                        </p>
                        <ComboboxFormDemo />
                        <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="combobox-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="combobox-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">검색이 필요한지, 날짜인지로 고릅니다.</p>
                </div>
                <Table
                    caption="Combobox · Select · DatePicker 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="combobox-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="combobox-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        콤보박스 역할과 키보드 조작은 Base UI 가 처리합니다. 사용처는 라벨과 오류 연결을 책임집니다.
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
                        <kbd>↑</kbd> <kbd>↓</kbd> 로 항목을 옮기고 <kbd>Enter</kbd> 로 고르며 <kbd>Esc</kbd> 로
                        닫습니다. 마우스 없이 검색부터 선택까지 가능합니다[6.1.1].
                    </li>
                    <li>키보드 포커스는 외곽선으로 표시됩니다[6.1.2].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="combobox-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="combobox-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>options</code> 만 필수입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Combobox Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ComboboxGuidePage
