import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
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
  <Field data-invalid={error || undefined}>
    <FieldLabel htmlFor="organization">신청 기관</FieldLabel>
    <Combobox
      id="organization"
      name="organization"
      required
      options={organizations}
      value={value}
      onValueChange={setValue}
      aria-invalid={error || undefined}
      aria-describedby={error ? 'organization-error' : undefined}
    />
    {error ? (
      <FieldError id="organization-error">
        신청 기관을 선택해 주세요.
      </FieldError>
    ) : null}
  </Field>
</form>`

const TYPE_COLUMNS = [
    {key: 'type', header: 'Type', align: 'start', rowHeader: true},
    {key: 'search', header: '검색 위치', align: 'start'},
    {key: 'use', header: '사용 기준', align: 'start', wrap: true},
] as const

const TYPE_ROWS = [
    {
        key: 'input',
        cells: [<code key="type">input</code>, '필드 입력창', '옵션이 많고 입력과 검색을 바로 시작해야 할 때 — 기본값'],
    },
    {
        key: 'dropdown',
        cells: [
            <code key="type">dropdown</code>,
            '열린 목록 내부',
            'Select처럼 값을 먼저 확인하고 필요할 때 검색할 때',
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
        key: 'error',
        cells: [
            '오류',
            <code key="prop">aria-invalid</code>,
            'Field에 data-invalid를 지정하고 FieldError를 aria-describedby로 연결합니다.',
        ],
    },
    {
        key: 'readonly',
        cells: ['읽기전용', <code key="prop">readOnly</code>, '검색과 값 변경을 막고 제출값은 유지합니다.'],
    },
    {
        key: 'disabled',
        cells: ['비활성', <code key="prop">disabled</code>, '포커스·검색·선택·폼 제출에서 제외합니다.'],
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
        key: 'options',
        cells: [<code key="prop">options</code>, <code key="type">ComboboxOption[]</code>, '—', '검색·선택할 항목'],
    },
    {
        key: 'type',
        cells: [
            <code key="prop">type</code>,
            <code key="type">input | dropdown</code>,
            <code key="default">input</code>,
            '검색 UI 유형',
        ],
    },
    {
        key: 'value',
        cells: [
            <code key="prop">value / onValueChange</code>,
            <code key="type">string / (value) =&gt; void</code>,
            '—',
            '제어 선택값',
        ],
    },
    {
        key: 'placeholder',
        cells: [
            <code key="prop">placeholder / searchPlaceholder / emptyText</code>,
            <code key="type">string</code>,
            '컴포넌트 기본 문구',
            '트리거·검색창·빈 결과 문구',
        ],
    },
    {
        key: 'form',
        cells: [
            <code key="prop">name / form / required</code>,
            <code key="type">string / string / boolean</code>,
            '—',
            '폼 제출 설정',
        ],
    },
    {
        key: 'state',
        cells: [
            <code key="prop">disabled / readOnly</code>,
            <code key="type">boolean</code>,
            <code key="default">false</code>,
            '상호작용 상태',
        ],
    },
    {
        key: 'a11y',
        cells: [
            <code key="prop">id / aria-invalid / aria-describedby</code>,
            <code key="type">HTML attributes</code>,
            '—',
            '라벨·설명·오류 연결',
        ],
    },
] as const

const ComboboxGuidePage = () => (
    <GuidePageShell
        title="콤보박스 (Combobox)"
        description="검색 가능한 단일 선택 입력입니다. 검색 위치에 따라 input과 dropdown 타입을 선택합니다."
    >
        <BaseCard variant="outlined">
            <section aria-labelledby="combobox-type" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="combobox-type" className="typo-h4-bold">
                        Type 선택
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        두 타입은 같은 단일 선택 API를 사용하며 검색창의 위치만 다릅니다. 컨트롤 높이는 48px로 고정되어
                        size prop을 제공하지 않습니다.
                    </p>
                </div>
                <Table caption="Combobox type 사용 기준" columns={TYPE_COLUMNS} rows={TYPE_ROWS} size="md" />
                <ComboboxDemo />
                <div className="grid gap-6 xl:grid-cols-2">
                    <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="입력형 복사" />
                    <CodeBlock code={DROPDOWN_CODE} language="tsx" copyLabel="드롭다운형 복사" />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="combobox-state" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="combobox-state" className="typo-h4-bold">
                        상태와 오류
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        포커스링은 라벨을 제외한 필드에만 표시됩니다. 드롭다운 옵션은 클릭 가능한 포인터 커서를 사용하고
                        비활성 옵션은 금지 커서를 사용합니다.
                    </p>
                </div>
                <Table caption="Combobox 상태 처리 기준" columns={STATE_COLUMNS} rows={STATE_ROWS} size="md" />
                <ComboboxStatesDemo />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="combobox-form" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="combobox-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        name을 지정하면 선택값이 FormData에 포함됩니다. readOnly 값은 제출되고 disabled 값은 제외됩니다.
                    </p>
                </div>
                <ComboboxFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="combobox-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="combobox-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        프로젝트 Combobox wrapper에서 사용하는 주요 속성입니다.
                    </p>
                </div>
                <Table caption="Combobox Props API" columns={API_COLUMNS} rows={API_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ComboboxGuidePage
