import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import SearchFilterFormDemo from './search-filter-form-demo'
import {MinimalFilterCaseDemo, TwoColumnFilterCaseDemo} from './search-filter-form-cases-demo'

export const metadata: Metadata = {title: '조회 필터 폼 (SearchFilterForm)'}

// 조립 API — 사용자가 화면에서 그대로 쓰는 형태.
const USAGE_CODE = `import {Button} from '@/components/ui/button'
import {
  CompanyNameField,
  DateRangeField,
  PaymentTypeField,
  SearchFilterActions,
  SearchFilterFields,
  SearchFilterForm,
  SearchFilterRow,
  SearchTypeField,
} from '@/components/composite/search-filter-form'

<SearchFilterForm
  aria-label="목록 조회 필터"
  onSubmit={handleSubmit}
  onReset={() => setResult('')}
>
  <SearchFilterFields>
    <DateRangeField />
    <CompanyNameField label="기업명" placeholder="내용을 입력하세요" />
    {/* 짧은 Select 두 개는 SearchFilterRow 로 2열 배치, defaultValue="" 로 placeholder 노출 */}
    <SearchFilterRow>
      <SearchTypeField label="조회유형" defaultValue="" placeholder="선택해주세요" />
      <PaymentTypeField label="유/무료" defaultValue="" placeholder="선택해주세요" />
    </SearchFilterRow>
  </SearchFilterFields>

  <SearchFilterActions>
    <Button type="reset" variant="outline" size="lg">초기화</Button>
    <Button type="submit" variant="default" size="lg">조회</Button>
  </SearchFilterActions>
</SearchFilterForm>`

// 케이스 A — 최소 구성(조회기간 + 단일 Select).
const USAGE_MINIMAL = `{/* 화면에 필요한 필드만 골라 넣는다. 순서도 자유. */}
<SearchFilterForm onSubmit={handleSubmit}>
  <SearchFilterFields>
    <DateRangeField />
    <PaymentTypeField label="진행상태" />
  </SearchFilterFields>
  <SearchFilterActions>
    <Button type="submit" variant="default" size="lg">조회</Button>
  </SearchFilterActions>
</SearchFilterForm>`

// 케이스 B — 입력 + 한 줄 2열 Select(placeholder).
const USAGE_TWO_COLUMN = `{/* SearchFilterRow 로 두 필드를 md 이상에서 나란히 두고,
    defaultValue="" 로 "선택해주세요" placeholder 를 노출한다. */}
<SearchFilterForm onSubmit={handleSubmit}>
  <SearchFilterFields>
    <DateRangeField />
    <CompanyNameField label="기업명" placeholder="내용을 입력하세요" />
    <SearchFilterRow>
      <SearchTypeField label="조회유형" defaultValue="" placeholder="선택해주세요" />
      <PaymentTypeField label="유/무료" defaultValue="" placeholder="선택해주세요" />
    </SearchFilterRow>
  </SearchFilterFields>
  <SearchFilterActions>
    <Button type="reset" variant="outline" size="lg">초기화</Button>
    <Button type="submit" variant="default" size="lg">조회</Button>
  </SearchFilterActions>
</SearchFilterForm>`

// 케이스 — 레이아웃 래퍼 없이 인라인(한 화면에서만 쓸 때).
const USAGE_INLINE = `{/* SearchFilterFields·SearchFilterActions 는 얇은 레이아웃 래퍼일 뿐이다.
    한 화면에서만 쓴다면 아래처럼 직접 div 로 배치해도 된다. */}
<SearchFilterForm onSubmit={handleSubmit}>
  <div className="flex flex-col gap-6">
    <DateRangeField />
    <CompanyNameField />
  </div>
  <div className="flex justify-end gap-3">
    <Button type="reset" variant="outline" size="lg">초기화</Button>
    <Button type="submit" variant="default" size="lg">조회</Button>
  </div>
</SearchFilterForm>`

const COMPOSITION_COLUMNS = [
    {key: 'name', header: 'Name', align: 'start', rowHeader: true},
    {key: 'desc', header: 'Description', align: 'start', wrap: true},
] as const

const SUBMIT_COLUMNS = [
    {key: 'field', header: 'Field', align: 'start', rowHeader: true},
    {key: 'keys', header: 'FormData key', align: 'start'},
    {key: 'desc', header: '값', align: 'start', wrap: true},
] as const

const COMPOSITION = [
    {
        name: 'SearchFilterForm',
        desc: 'form 컨테이너. 회색 카드(bg-background·rounded-md·p-10)와 reset 신호를 제공한다. onSubmit·onReset·기타 form 속성을 그대로 받는다.',
    },
    {
        name: 'SearchFilterFields',
        desc: '필드 세로 묶음(gap-6) 레이아웃 래퍼. 한 화면에서만 쓰면 생략하고 div 로 대체할 수 있다.',
    },
    {
        name: 'SearchFilterActions',
        desc: '액션(초기화·조회) 우측 하단 정렬 래퍼. 마찬가지로 생략 가능하다.',
    },
    {
        name: 'SearchFilterRow',
        desc: '필드 2개를 md 이상에서 나란히(2열) 두는 레이아웃. 조회유형·유/무료처럼 짧은 필드에 쓴다.',
    },
    {name: 'DateRangeField', desc: '조회기간 — 빠른 기간 SegmentedControl(solid) + 시작·종료 DatePicker 범위.'},
    {name: 'CompanyNameField', desc: '회사명 — 텍스트 Input.'},
    {name: 'SearchTypeField', desc: '검색유형 — Select 드롭다운(전체·기술평가·특허평가·K-BIGx 보고서).'},
    {name: 'PaymentTypeField', desc: '유/무료 — Select 드롭다운(전체·유료·무료).'},
    {name: 'Button (reset/submit)', desc: '프로젝트 Button 컴포넌트. type="reset"이 필드를 기본값으로 되돌린다.'},
] as const

// Props — [컴포넌트, 이름, 설명, 기본값, 타입]
const PROPS_ITEMS = [
    ['SearchFilterForm', 'onSubmit', '조회 제출 핸들러. FormData 로 필드 값을 읽는다.', '-', 'FormEventHandler'],
    ['SearchFilterForm', 'onReset', '초기화 콜백. 각 필드는 자동으로 기본값 복귀한다.', 'undefined', '() => void'],
    [
        'SearchFilterForm',
        'className · form props',
        '카드 클래스와 네이티브 form 속성을 전달한다.',
        'undefined',
        "ComponentProps<'form'>",
    ],
    [
        'DateRangeField',
        'name',
        '제출 시 프리셋(`${name}Preset`)·시작(`${name}From`)·종료(`${name}To`) 키의 접두사.',
        "'dateRange'",
        'string',
    ],
    [
        'DateRangeField',
        'label · defaultPreset',
        '라벨과 기본 프리셋(today·1month·3months·all).',
        "'조회기간' · '3months'",
        'string',
    ],
    [
        'CompanyNameField',
        'name · label · placeholder',
        '제출 키·라벨·입력 placeholder.',
        "'companyName' · '회사명'",
        'string',
    ],
    [
        'SearchTypeField / PaymentTypeField',
        'name · label · defaultValue · placeholder',
        '제출 키·라벨·기본 선택값·미선택 placeholder. defaultValue=""면 placeholder 노출.',
        "'all' · '선택해주세요'",
        'string',
    ],
    ['SearchFilterRow', 'children · className', '필드 2개를 md 이상 2열로 나란히 배치.', '-', "ComponentProps<'div'>"],
] as const

// 폼 제출 — 각 필드가 name 으로 FormData 에 담는 키(기본 name 기준).
const SUBMIT_KEYS = [
    {
        field: 'DateRangeField',
        keys: 'dateRangePreset · dateRangeFrom · dateRangeTo',
        desc: '프리셋 값과 시작·종료일(YYYY-MM-DD).',
    },
    {field: 'CompanyNameField', keys: 'companyName', desc: '입력한 회사명 문자열.'},
    {field: 'SearchTypeField', keys: 'searchType', desc: '선택한 검색유형 값.'},
    {field: 'PaymentTypeField', keys: 'paymentType', desc: '선택한 유/무료 값.'},
] as const

const SearchFilterFormGuidePage = () => (
    <GuidePageShell
        title="조회 필터 폼 (SearchFilterForm)"
        description="목록 화면 상단의 조회(검색) 필터를 조립하는 합성 컴포넌트입니다. 왼쪽 라벨 + 오른쪽 컨트롤을 회색 카드에 담고, 우측 하단에 초기화·조회 액션을 둡니다."
    >
        <BaseCard>
            <section aria-labelledby="sff-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="sff-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        조회기간(빠른 기간 토글 + 기간 선택)·기업명 입력과, 짧은 Select 두 개(조회유형·유/무료)를{' '}
                        <code className="font-mono">SearchFilterRow</code>로 md 이상 2열 배치한 대표 예시입니다.
                        Select은 <code className="font-mono">defaultValue=&quot;&quot;</code>로{' '}
                        <strong className="text-foreground">선택해주세요</strong> placeholder를 노출합니다.{' '}
                        <strong className="text-foreground">조회</strong>를 누르면 각 필드 값이 name에 맞춰 FormData로
                        제출되고, <strong className="text-foreground">초기화</strong>는 모든 필드를 기본값으로
                        되돌립니다. md 미만에서는 라벨이 컨트롤 위로 쌓입니다.
                    </p>
                </div>
                <SearchFilterFormDemo showResult={false} />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sff-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="sff-composition" className="typo-h4-bold">
                        Composition
                    </h2>
                    <p className="text-foreground-muted text-sm">폼이 조립하는 요소들입니다.</p>
                </div>
                <Table
                    caption="Composition 목록"
                    columns={COMPOSITION_COLUMNS}
                    rows={COMPOSITION.map((row) => ({
                        key: row.name,
                        cells: [
                            <span key="name" className="font-mono">
                                {row.name}
                            </span>,
                            row.desc,
                        ],
                    }))}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sff-cases" className="flex flex-col gap-6">
                <div>
                    <h2 id="sff-cases" className="typo-h4-bold">
                        케이스
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        같은 컴포넌트로 화면마다 다른 조합을 만듭니다. 아래는 Figma 시안의 조회 폼 변형들입니다.
                    </p>
                </div>

                <section aria-labelledby="sff-case-minimal" className="flex flex-col gap-3">
                    <h3 id="sff-case-minimal" className="typo-title-l-bold">
                        최소 구성
                    </h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        조회기간과 단일 Select만 두는 간단한 필터입니다. 필요한 필드만 골라 순서대로 배치하고, 액션도
                        조회 하나만 둘 수 있습니다.
                    </p>
                    <MinimalFilterCaseDemo />
                    <CodeBlock code={USAGE_MINIMAL} language="tsx" copyLabel="복사" />
                </section>

                <section aria-labelledby="sff-case-two-column" className="flex flex-col gap-3">
                    <h3 id="sff-case-two-column" className="typo-title-l-bold">
                        입력 + 한 줄 2열 Select (placeholder)
                    </h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기업명 입력과 함께 짧은 Select 두 개를 <code className="font-mono">SearchFilterRow</code>로 md
                        이상 나란히 둡니다. <code className="font-mono">defaultValue=&quot;&quot;</code>로 기본값을
                        비우면 <strong className="text-foreground">선택해주세요</strong> placeholder가
                        노출됩니다(기본값을 주면 해당 옵션이 선택된 상태로 시작).
                    </p>
                    <TwoColumnFilterCaseDemo />
                    <CodeBlock code={USAGE_TWO_COLUMN} language="tsx" copyLabel="복사" />
                </section>

                <section aria-labelledby="sff-case-inline" className="flex flex-col gap-3">
                    <h3 id="sff-case-inline" className="typo-title-l-bold">
                        레이아웃 래퍼 분리 기준
                    </h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">SearchFilterFields</code>·
                        <code className="font-mono">SearchFilterActions</code>는 세로 묶음·우측 정렬만 하는 얇은
                        레이아웃 래퍼입니다.{' '}
                        <strong className="text-foreground">여러 화면에서 같은 레이아웃을 반복</strong>할 때 쓰고, 한
                        화면에서만 쓴다면 아래처럼 <code className="font-mono">div</code>로 직접 배치하는 편이
                        단순합니다.
                    </p>
                    <CodeBlock code={USAGE_INLINE} language="tsx" copyLabel="복사" />
                </section>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sff-submit" className="flex flex-col gap-4">
                <div>
                    <h2 id="sff-submit" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <strong className="text-foreground">조회</strong>를 누르면 각 필드가 자신의{' '}
                        <code className="font-mono">name</code>으로 FormData에 값을 담습니다. 값 상태는 필드가 자체
                        관리하므로 폼 쪽에서 <code className="font-mono">new FormData(event.currentTarget)</code>로 한
                        번에 읽으면 됩니다. 실제 결과는 위 Preview에서 확인할 수 있고,{' '}
                        <strong className="text-foreground">초기화</strong>(type=&quot;reset&quot;)는 모든 필드를
                        기본값으로 되돌린 뒤 <code className="font-mono">onReset</code> 콜백을 호출합니다.
                    </p>
                </div>
                <SearchFilterFormDemo />
                <Table
                    caption="필드별 제출 키 목록"
                    columns={SUBMIT_COLUMNS}
                    rows={SUBMIT_KEYS.map((row) => ({
                        key: row.field,
                        cells: [
                            <span key="field" className="font-mono">
                                {row.field}
                            </span>,
                            <span key="keys" className="font-mono">
                                {row.keys}
                            </span>,
                            row.desc,
                        ],
                    }))}
                />
                <div className="bg-surface border-border flex flex-col gap-2 rounded-md border p-4">
                    <h3 className="typo-body-l-medium text-foreground">WAVE 검사 예외 — Missing form label (Select)</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        shadcn/Radix Select은 폼 안에 놓이면 값 전달용 hidden native{' '}
                        <code className="font-mono">&lt;select aria-hidden tabindex=&quot;-1&quot;&gt;</code>를 내부에서
                        자동 생성합니다. 이 요소는 라벨을 붙일 방법이 없어(트리거 버튼에만 라벨을 연결할 수 있음) WAVE가{' '}
                        <em>Missing form label</em>로 잡습니다.
                    </p>
                    <p className="typo-body-l-regular text-muted-foreground">
                        이 hidden select은 <strong className="text-foreground">Radix 프리미티브가 만드는 구조</strong>라
                        프로젝트에서 고칠 수 없습니다 — 라벨을 달려면 <code className="font-mono">ui/select</code> 셸의
                        내부 동작을 수정해야 하는데, 셸의 구조·동작 수정은 금지되어 있습니다(
                        <code className="font-mono">SHADCN.md · SC-02</code>). 실제로는{' '}
                        <code className="font-mono">aria-hidden</code>·
                        <code className="font-mono">tabindex=&quot;-1&quot;</code>로 접근성 트리·키보드 탐색에서
                        제외되고, 조작 요소인 트리거 버튼이 라벨과 연결돼 있어 실사용 접근성에는 영향이 없는{' '}
                        <strong className="text-foreground">구조적 오탐</strong>이므로 예외로 둡니다.
                        (SegmentedControl의 RadioGroup도 같은 이유로 hidden radio input을 만듭니다.)
                    </p>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sff-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="sff-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        각 컴포넌트에 넘기는 속성입니다. 필드는 name·기본값만 조정하면 되고, 값 상태는 필드가 자체
                        관리합니다.
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-xl border">
                    <table className="w-full text-left">
                        <caption className="sr-only">Props 목록</caption>
                        <thead>
                            <tr className="border-border bg-card border-b">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Component
                                </th>
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
                                    Type
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {PROPS_ITEMS.map(([component, name, description, defaultValue, type]) => (
                                <tr key={`${component}-${name}`} className="border-border border-b last:border-b-0">
                                    <td className="typo-body-l-regular text-foreground px-4 py-3 font-mono">
                                        {component}
                                    </td>
                                    <th
                                        scope="row"
                                        className="typo-body-l-medium text-primary-strong px-4 py-3 font-mono"
                                    >
                                        {name}
                                    </th>
                                    <td className="typo-body-l-regular text-foreground-subtle px-4 py-3">
                                        {description}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {defaultValue}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {type}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sff-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="sff-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="text-foreground-muted text-sm">조회 필터 폼이 지키는 KWCAG 2.1 요건입니다.</p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        각 필드는 라벨과 컨트롤을 연결합니다 — 단일 컨트롤은 label htmlFor↔id, 컨트롤이 여러 개인
                        조회기간은 role=&quot;group&quot;+aria-labelledby로 묶습니다. [7.4.1/8.2.1]
                    </li>
                    <li>
                        SegmentedControl·DatePicker·Select·Input 은 각 컴포넌트의 키보드·포커스 동작을 그대로 씁니다.
                        [6.1.1/6.1.2]
                    </li>
                    <li>
                        제출은 명시적인 조회 버튼으로만 일어나고, onChange가 곧바로 조회를 실행하지 않습니다. [7.2.1]
                    </li>
                    <li>초기화(type=&quot;reset&quot;)는 값 상태와 결과 표시를 모두 기본값으로 되돌립니다.</li>
                    <li>md 미만에서 라벨이 컨트롤 위로 쌓여도 DOM 순서(라벨→컨트롤)는 유지됩니다. [7.3.1]</li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SearchFilterFormGuidePage
