// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {SelectSearchFormDemo} from './select-search-form-demo'

export const metadata: Metadata = {title: '기준 선택 검색 (SelectSearchForm)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {SelectSearchForm} from '@/components/composite/select-search-form'

// 하이픈은 있어도 없어도 된다(10-1111111-0000 · 1011111110000).
const OPTIONS = [
  {
    value: 'registration',
    label: '특허등록번호',
    pattern: /^(\\d{2}-?\\d{7}-?\\d{4}|\\d{7})$/,
    placeholder: '(로그인후) 13자리 또는 7자리 등록·출원번호를 입력하세요',
    note: '※ 검색대상 : 2026-04-01이전 등록 및 공고된 특허정보',
  },
  {
    value: 'application',
    label: '특허출원번호',
    pattern: /^(\\d{2}-?\\d{4}-?\\d{7}|\\d{9})$/,
    placeholder: '13자리 또는 9자리 등록번호를 입력하세요',
    note: '※ 출원상태인 특허는 평가제외',
  },
]

const [isSearching, setIsSearching] = useState(false)

<SelectSearchForm
  options={OPTIONS}
  emptyError="특허등록번호 또는 특허출원번호를 입력해주세요."
  isSearching={isSearching}
  onSearch={async ({type, value}) => {
    setIsSearching(true)
    setResult(await searchPatentGrade({type, number: value}))
    setIsSearching(false)
  }}
  // [초기화] — 검색 칸과 함께 결과도 처음 상태로 되돌린다.
  onReset={() => setResult(null)}
/>`

const DEFAULTS_CODE = `// defaultValues 를 지우면 빈 칸으로 시작한다.
<SelectSearchForm
  options={OPTIONS}
  defaultValues={{registration: '10-1111111-0000', application: '10-2026-1111111'}}
  onSearch={handleSearch}
/>`

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
    {key: 'when', header: '조건', align: 'start', wrap: true},
    {key: 'behavior', header: '동작', align: 'start', wrap: true},
] as const

const STATE_ROWS = [
    {
        key: 'empty',
        cells: [
            '빈 값 오류',
            '입력을 비우고 검색',
            <span key="behavior">
                <code>emptyError</code> 문구가 입력 아래에 뜨고 포커스가 입력으로 옮겨집니다. <code>onSearch</code>는
                호출되지 않습니다.
            </span>,
        ],
    },
    {
        key: 'invalid',
        cells: [
            '형식 오류',
            <span key="when">
                값이 고른 기준의 <code>pattern</code>과 다름
            </span>,
            <span key="behavior">
                <code>invalidError</code> 문구가 같은 자리에 뜹니다. 입력하거나 기준을 바꾸면 사라집니다.
            </span>,
        ],
    },
    {
        key: 'searching',
        cells: [
            '검색 중',
            <code key="when">isSearching</code>,
            <span key="behavior">
                [검색하기]가 <code>searchingLabel</code>로 바뀌고 [검색하기] · [초기화]가 눌리지 않습니다.
            </span>,
        ],
    },
    {
        key: 'option',
        cells: [
            '기준별 안내',
            '기준을 바꿈',
            <span key="behavior">
                입력 안내가 그 기준의 <code>placeholder</code>로, 버튼 줄 왼쪽 도움말이 <code>note</code>로 바뀝니다.
            </span>,
        ],
    },
] as const

const DEFAULT_COLUMNS = [
    {key: 'when', header: '시점', align: 'start', rowHeader: true},
    {key: 'behavior', header: '동작', align: 'start', wrap: true},
] as const

const DEFAULT_ROWS = [
    {
        key: 'initial',
        cells: [
            '처음',
            <span key="behavior">
                <code>defaultType</code>(없으면 첫 옵션)이 고른 기준이고, 입력은 그 기준의 <code>defaultValues</code>{' '}
                값으로 시작합니다.
            </span>,
        ],
    },
    {
        key: 'change',
        cells: [
            '기준 변경',
            '입력이 이전 기준의 기본값 그대로일 때만 새 기준의 기본값으로 바뀝니다. 직접 입력한 값은 유지됩니다.',
        ],
    },
    {
        key: 'reset',
        cells: [
            '[초기화]',
            <span key="behavior">
                처음 기준과 그 기본값으로 돌아간 뒤 <code>onReset</code>이 호출됩니다. 사용처는 여기서 검색 결과를
                비웁니다.
            </span>,
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'SelectSearchForm',
        'options',
        '검색 기준 목록입니다(필수). pattern 을 주면 형식이 맞아야 검색하고, placeholder 는 그 기준의 입력 안내, note 는 버튼 줄 왼쪽 도움말입니다.',
        '-',
        'readonly {value; label; pattern?; placeholder?; note?}[]',
    ],
    [
        'SelectSearchForm',
        'onSearch',
        '검사를 통과한 검색입니다. 고른 기준(type)과 앞뒤 공백을 걷은 값(value)을 넘깁니다.',
        '-',
        '({type, value}) => void',
    ],
    ['SelectSearchForm', 'onReset', '[초기화]를 눌렀을 때 호출됩니다. 여기서 검색 결과를 비웁니다.', '-', '() => void'],
    ['SelectSearchForm', 'isSearching', '조회 중입니다. [검색하기] · [초기화]가 눌리지 않습니다.', 'false', 'boolean'],
    [
        'SelectSearchForm',
        'defaultType',
        '처음 고른 기준(options 의 value)입니다. [초기화]도 이 기준으로 돌아갑니다.',
        '첫 옵션',
        'string',
    ],
    [
        'SelectSearchForm',
        'defaultValues',
        '기준별로 처음 넣어 둘 값입니다. 비우면 빈 칸으로 시작합니다.',
        '-',
        'Partial<Record<string, string>>',
    ],
    ['SelectSearchForm', 'emptyError', '입력을 비우고 검색했을 때의 안내입니다.', "'검색어를 입력해주세요.'", 'string'],
    [
        'SelectSearchForm',
        'invalidError',
        '형식이 맞지 않을 때의 안내입니다. 기준 이름을 받아 문장을 만듭니다.',
        'label => `${label} 형식이 올바르지 않습니다.`',
        '(label) => string',
    ],
    [
        'SelectSearchForm',
        'placeholder',
        '기준에 placeholder 가 없을 때 쓰는 입력 안내입니다. 기준 이름을 받아 문장을 만듭니다.',
        'label => `${label}를 입력하세요`',
        '(label) => string',
    ],
    [
        'SelectSearchForm',
        'typeLabel · searchLabel · searchingLabel · resetLabel',
        '셀렉트 접근성 이름과 버튼 글자입니다.',
        "'검색 기준' · '검색하기' · '검색 중' · '초기화'",
        'string',
    ],
    ['SelectSearchForm', 'className', '카드(form)에 덧붙일 클래스입니다.', '-', 'string'],
] as const

const SelectSearchFormGuidePage = () => (
    <GuidePageShell
        title="기준 선택 검색 (SelectSearchForm)"
        description="검색 기준(셀렉트)을 고르고 번호 · 검색어를 한 줄에 입력해 조회하는 검색 카드입니다."
    >
        <BaseCard>
            <section aria-labelledby="ssf-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ssf-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>options</code> 로 검색 기준을 넘기고 <code>onSearch</code> 에서 조회합니다. 조회하는 동안{' '}
                        <code>isSearching</code> 을 켜고, <code>onReset</code> 에서 검색 결과를 비웁니다.
                    </p>
                </div>
                <SelectSearchFormDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssf-state" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ssf-state" className="typo-h4-bold">
                        상태와 기본값
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        빈 값 · 형식 검사는 컴포넌트가 하고, 통과한 검색만 <code>onSearch</code> 로 넘어옵니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">상태와 오류</h3>
                        <Table
                            caption="SelectSearchForm 상태 목록"
                            columns={STATE_COLUMNS}
                            rows={STATE_ROWS}
                            size="md"
                        />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">기본값</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>defaultValues</code> 로 기준별 값을 미리 넣어 둡니다.
                        </p>
                        <Table caption="기본값이 쓰이는 시점" columns={DEFAULT_COLUMNS} rows={DEFAULT_ROWS} size="md" />
                        <SelectSearchFormDemo withDefaults />
                        <CodeBlock code={DEFAULTS_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssf-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ssf-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">검색 조건의 수와 입력 형태로 고릅니다.</p>
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
            <section aria-labelledby="ssf-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ssf-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        아래는 컴포넌트가 처리하므로 사용처에서 따로 넣지 않습니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        셀렉트와 입력에는 화면에 보이지 않는 레이블이 있습니다. 입력의 이름은 고른 기준의{' '}
                        <code>label</code> 입니다[7.4.1].
                    </li>
                    <li>
                        오류 문구는 <code>role=&quot;alert&quot;</code> 로 알리고 입력의 <code>aria-invalid</code> ·{' '}
                        <code>aria-describedby</code> 로 이어집니다. 도움말(<code>note</code>)도 입력의 설명으로
                        이어집니다[7.4.2].
                    </li>
                    <li>
                        오류가 나면 포커스가 입력으로 옮겨집니다[7.4.2]. 검색 중에는 [검색하기]에 <code>aria-busy</code>{' '}
                        가 켜지고 도는 아이콘은 동작 줄이기 설정에서 멈춥니다[8.2.1][6.3.1].
                    </li>
                    <li>
                        검색은 [검색하기] 버튼 또는 입력창의 Enter 로만 실행됩니다. 기준을 바꿔도 바로 조회하지
                        않습니다[7.2.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ssf-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ssf-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SelectSearchForm Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SelectSearchFormGuidePage
