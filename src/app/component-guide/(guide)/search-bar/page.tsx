// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {SearchBar} from '@/components/composite/search-bar'
import {Field, FieldError} from '@/components/ui/field'
import SearchBarFormDemo from './search-bar-form-demo'
import {SearchBarUsageDemo} from './search-bar-demo'

export const metadata: Metadata = {title: '검색 바 (SearchBar)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {SearchBar} from '@/components/composite/search-bar'

<form onSubmit={(event) => {
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

  <Button type="submit" variant="default" size="sm" className="w-fit">검색 조건 확인</Button>
</form>`

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'search-bar',
        cells: [
            '검색어 하나를 입력해 바로 검색',
            <Link key="component" href="/component-guide/search-bar" className={LINK_CLASS}>
                SearchBar
            </Link>,
            '입력 · 지우기 · 검색 버튼이 한 상자입니다. 통합 검색처럼 조건이 검색어뿐인 자리에 씁니다.',
        ],
    },
    {
        key: 'search-filter-form',
        cells: [
            '목록 화면 상단에서 조회 조건 여러 개를 조합',
            <Link key="component" href="/component-guide/search-filter-form" className={LINK_CLASS}>
                SearchFilterForm
            </Link>,
            '기간 · 기업명 · 셀렉트 같은 필드를 골라 조립하고 [초기화] · [조회]로 제출합니다.',
        ],
    },
    {
        key: 'select-search-form',
        cells: [
            '검색 기준을 고르고 번호 하나를 입력해 조회',
            <Link key="component" href="/component-guide/select-search-form" className={LINK_CLASS}>
                SelectSearchForm
            </Link>,
            '특허등록번호 · 특허출원번호처럼 기준마다 형식이 다른 값을 검사한 뒤 onSearch 로 넘깁니다.',
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
        key: 'filled',
        cells: ['값 입력됨', '-', '검색 버튼 앞에 지우기 버튼이 나타납니다.'],
    },
    {
        key: 'invalid',
        cells: [
            '오류',
            <code key="prop">aria-invalid</code>,
            'Field 에 data-invalid 를 함께 주고, FieldError 를 aria-describedby 로 연결합니다.',
        ],
    },
    {
        key: 'disabled',
        cells: [
            '비활성',
            <code key="prop">disabled</code>,
            '입력 · 검색 버튼이 비활성화되고 지우기 버튼은 숨겨집니다. 폼 제출에서 빠집니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['SearchBar', 'label', '필수. 입력의 이름입니다. 화면에는 보이지 않습니다.', '-', 'string'],
    ['SearchBar', 'searchLabel', '검색 버튼의 이름입니다.', "'검색'", 'string'],
    ['SearchBar', 'clearLabel', '지우기 버튼의 이름입니다.', "'입력 지우기'", 'string'],
    ['SearchBar', 'name', '폼 제출 때 쓰이는 필드 이름입니다.', '-', 'string'],
    ['SearchBar', 'form', '바깥에 있는 form 의 id 입니다. 입력과 검색 버튼에 함께 연결됩니다.', '-', 'string'],
    [
        'SearchBar',
        'value / defaultValue / onChange',
        '입력값을 제어 · 비제어 방식으로 다룹니다. 값이 있으면 지우기 버튼이 나타납니다.',
        '-',
        'InputHTMLAttributes',
    ],
    ['SearchBar', 'placeholder / required', '네이티브 input 속성을 그대로 받습니다.', '-', 'InputHTMLAttributes'],
    ['SearchBar', 'disabled', '입력과 버튼을 비활성화합니다.', 'false', 'boolean'],
    ['SearchBar', 'id', '입력의 id. 생략하면 자동 생성됩니다.', '자동 생성', 'string'],
    ['SearchBar', 'aria-invalid / aria-describedby', '오류 상태와 오류 메시지 연결입니다.', '-', 'boolean / string'],
    ['SearchBar', 'className', '바깥 상자에 덧붙일 클래스입니다.', 'undefined', 'string'],
    ['SearchBar', 'inputClassName', '안쪽 input 에 덧붙일 클래스입니다.', 'undefined', 'string'],
] as const

const SearchBarGuidePage = () => (
    <GuidePageShell
        title="검색 바 (SearchBar)"
        description="검색어 입력, 입력값 지우기, 검색 실행을 한 상자로 묶은 입력입니다."
    >
        <BaseCard>
            <section aria-labelledby="sb-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sb-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>form</code> 안에 두고 <code>label</code> 과 <code>name</code> 을 넘깁니다. 검색 버튼이나
                        입력창의 <code>Enter</code> 가 form 의 <code>onSubmit</code> 을 실행합니다. 최대 폭은{' '}
                        <code>max-w-147</code>(588px)입니다.
                    </p>
                </div>
                <SearchBarUsageDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sb-state" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sb-state" className="typo-h4-bold">
                        상태와 오류
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        값 입력 · 오류 · 비활성 상태를 지원합니다. <code>size</code> · <code>readOnly</code> 는 받지
                        않습니다.
                    </p>
                </div>
                <Table caption="SearchBar 상태 처리 기준" columns={STATE_COLUMNS} rows={STATE_ROWS} size="md" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">상태별 미리보기</h3>
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
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sb-form" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sb-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        입력값은 <code>name</code> 으로 제출됩니다. 오류가 있으면 <code>FieldError</code> 를 연결하고
                        입력으로 포커스를 옮깁니다.
                    </p>
                </div>
                <SearchBarFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sb-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sb-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        검색 대상과 조건의 수로 고릅니다. 일반 텍스트 입력은 Input 을 씁니다.
                    </p>
                </div>
                <Table
                    caption="SearchBar · SearchFilterForm · SelectSearchForm 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sb-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sb-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        아래는 컴포넌트가 처리합니다. 한 화면에 검색 바가 여럿이면 <code>label</code> 을 서로 다르게
                        줍니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>label</code> 은 화면에 보이지 않는 label 요소로 입력과 연결됩니다[7.4.1].
                    </li>
                    <li>
                        검색 · 지우기 버튼에는 기본 이름(&quot;검색&quot; · &quot;입력 지우기&quot;)이 붙고 아이콘은
                        숨겨집니다[5.1.1].
                    </li>
                    <li>지우기 버튼을 누르면 포커스가 입력으로 돌아갑니다[6.1.2].</li>
                    <li>
                        오류는 사용처가 <code>aria-invalid</code> · <code>aria-describedby</code> 로 연결합니다[7.4.2].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sb-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sb-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>size</code> · <code>readOnly</code> 를 뺀 네이티브 input 속성을 그대로 받습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SearchBar Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SearchBarGuidePage
