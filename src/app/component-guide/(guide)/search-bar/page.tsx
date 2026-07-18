import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {SearchBar} from '@/components/composite/search-bar'
import {Field, FieldError} from '@/components/ui/field'
import SearchBarFormDemo from './search-bar-form-demo'
import {SearchBarUsageDemo} from './search-bar-demo'

export const metadata: Metadata = {title: '검색 바 (SearchBar)'}

const USAGE_CODE = `<form onSubmit={(event) => {
  event.preventDefault()
  console.log(Object.fromEntries(new FormData(event.currentTarget)))
}}>
  <SearchBar
    name="keyword"
    label="사업자번호 검색"
    placeholder="사업자번호 또는 법인등록번호를 입력하세요"
  />
</form>`

const FORM_CODE = `const [keyword, setKeyword] = useState('')
const [keywordError, setKeywordError] = useState(false)

<form noValidate onSubmit={(event) => {
  event.preventDefault()
  const nextError = keyword.trim() === ''
  setKeywordError(nextError)
  if (nextError) {
    const input = event.currentTarget.elements.namedItem('keyword')
    if (input instanceof HTMLInputElement) input.focus()
    return
  }

  console.log(Object.fromEntries(new FormData(event.currentTarget)))
}}>
  <Field data-invalid={keywordError || undefined} className="max-w-147">
    <SearchBar
      id="keyword"
      name="keyword"
      label="통합 검색어"
      required
      value={keyword}
      onChange={(event) => {
        setKeyword(event.currentTarget.value)
        setKeywordError(false)
      }}
      placeholder="검색어를 입력하세요"
      aria-invalid={keywordError || undefined}
      aria-describedby={keywordError ? 'keyword-error' : undefined}
    />
    {keywordError ? <FieldError id="keyword-error">검색어를 입력해 주세요.</FieldError> : null}
  </Field>

  <Button type="submit" variant="default" size="md" className="w-fit">검색 조건 확인</Button>
</form>`

const PROPS_ITEMS = [
    {
        name: 'label',
        desc: '필수 접근성 이름입니다. 실제 label 요소로 렌더링되며 화면에서는 숨겨집니다.',
        def: '-',
        control: 'string',
    },
    {
        name: 'searchLabel / clearLabel',
        desc: '검색·지우기 아이콘 버튼의 접근성 이름입니다.',
        def: "'검색' / '입력 지우기'",
        control: 'string / string',
    },
    {
        name: 'name / form / required',
        desc: '네이티브 input의 FormData 필드 이름, 외부 form 연결, 필수 상태를 지정합니다.',
        def: '- / - / false',
        control: 'string / string / boolean',
    },
    {
        name: 'value / defaultValue / onChange',
        desc: '제어·비제어 입력값과 변경 이벤트를 지원합니다.',
        def: '- / - / -',
        control: 'InputHTMLAttributes',
    },
    {
        name: 'disabled',
        desc: '입력과 버튼을 비활성화하며 FormData 제출에서도 제외됩니다.',
        def: 'false',
        control: 'boolean',
    },
    {
        name: 'id / aria-invalid / aria-describedby',
        desc: 'label 연결, 오류 상태 및 도움말·오류 메시지 연결에 사용합니다.',
        def: '자동 생성 / - / -',
        control: 'string / boolean / string',
    },
    {
        name: 'className / inputClassName',
        desc: 'InputGroup 루트와 내부 Input 스타일을 각각 확장합니다.',
        def: '"" / ""',
        control: 'string / string',
    },
] as const

const SearchBarGuidePage = () => (
    <GuidePageShell
        title="검색 바 (SearchBar)"
        description="shadcn InputGroup과 Button을 조합한 프로젝트 composite입니다. 검색 입력, 지우기, 검색 실행을 하나의 컨트롤로 제공합니다."
    >
        <BaseCard>
            <section aria-labelledby="sb-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="sb-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        검색 버튼은 네이티브 submit 버튼입니다. 버튼을 누르거나 입력창에서{' '}
                        <code className="font-mono">Enter</code>를 입력하면 동일한 상위 form의{' '}
                        <code className="font-mono">onSubmit</code> 한 경로로 처리됩니다. 입력값이 있으면 키보드로 접근
                        가능한 지우기 버튼이 표시됩니다.
                    </p>
                </div>
                <SearchBarUsageDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sb-state" className="flex flex-col gap-4">
                <div>
                    <h2 id="sb-state" className="typo-h4-bold">
                        상태 (State)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기본·값 입력됨·오류·비활성 상태입니다. 별도의 size prop 없이 프로젝트 검색창 규격 하나를
                        사용하며, SearchBar에서는 readOnly 상태를 제공하지 않습니다.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <SearchBar label="기본 검색" placeholder="검색어를 입력하세요" />
                    <SearchBar label="값이 입력된 검색" defaultValue="기술보증기금" />
                    <Field data-invalid className="max-w-147">
                        <SearchBar
                            label="오류가 있는 검색"
                            placeholder="검색어를 입력하세요"
                            aria-invalid
                            aria-describedby="search-state-error"
                        />
                        <FieldError id="search-state-error">검색어를 입력해 주세요.</FieldError>
                    </Field>
                    <SearchBar label="비활성 검색" defaultValue="기술보증기금" disabled />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sb-form" className="flex flex-col gap-4">
                <div>
                    <h2 id="sb-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">name</code>을 지정하면 네이티브 input 값이 FormData에 포함됩니다.
                        예시는 필수값을 검증해 <code className="font-mono">FieldError</code>를 연결하고 첫 오류 입력으로
                        포커스를 이동합니다.
                    </p>
                </div>
                <SearchBarFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sb-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="sb-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        SearchBar 전용 속성과 size·readOnly를 제외한 네이티브 input 속성을 지원합니다.
                    </p>
                </div>
                <div className="bg-background border-border overflow-x-auto rounded-md border">
                    <table className="w-full text-left">
                        <caption className="sr-only">SearchBar Props 목록</caption>
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
                            {PROPS_ITEMS.map((prop) => (
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

export default SearchBarGuidePage
