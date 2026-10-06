// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import SearchFilterFormDemo from './search-filter-form-demo'
import {MinimalFilterCaseDemo, TwoColumnFilterCaseDemo} from './search-filter-form-cases-demo'

export const metadata: Metadata = {title: '조회 필터 폼 (SearchFilterForm)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

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
      <SearchTypeField label="조회유형" defaultValue="" placeholder="선택해 주세요" />
      <PaymentTypeField label="유/무료" defaultValue="" placeholder="선택해 주세요" />
    </SearchFilterRow>
  </SearchFilterFields>

  <SearchFilterActions>
    <Button type="reset" variant="outline" size="md">초기화</Button>
    <Button type="submit" variant="default" size="md">조회</Button>
  </SearchFilterActions>
</SearchFilterForm>`

const USAGE_MINIMAL = `{/* 필요한 필드만 골라 넣는다. 순서도 자유. */}
<SearchFilterForm onSubmit={handleSubmit}>
  <SearchFilterFields>
    <DateRangeField />
    <PaymentTypeField label="진행상태" />
  </SearchFilterFields>
  <SearchFilterActions>
    <Button type="submit" variant="default" size="md">조회</Button>
  </SearchFilterActions>
</SearchFilterForm>`

const USAGE_TWO_COLUMN = `{/* SearchFilterRow 로 두 필드를 md 이상에서 나란히 두고,
    defaultValue="" 로 "선택해 주세요" placeholder 를 노출한다. */}
<SearchFilterForm onSubmit={handleSubmit}>
  <SearchFilterFields>
    <DateRangeField />
    <CompanyNameField label="기업명" placeholder="내용을 입력하세요" />
    <SearchFilterRow>
      <SearchTypeField label="조회유형" defaultValue="" placeholder="선택해 주세요" />
      <PaymentTypeField label="유/무료" defaultValue="" placeholder="선택해 주세요" />
    </SearchFilterRow>
  </SearchFilterFields>
  <SearchFilterActions>
    <Button type="reset" variant="outline" size="md">초기화</Button>
    <Button type="submit" variant="default" size="md">조회</Button>
  </SearchFilterActions>
</SearchFilterForm>`

const USAGE_INLINE = `{/* SearchFilterFields·SearchFilterActions 대신 div 로 직접 배치해도 된다. */}
<SearchFilterForm onSubmit={handleSubmit}>
  <div className="flex flex-col gap-6">
    <DateRangeField />
    <CompanyNameField />
  </div>
  <div className="flex justify-end gap-3">
    <Button type="reset" variant="outline" size="md">초기화</Button>
    <Button type="submit" variant="default" size="md">조회</Button>
  </div>
</SearchFilterForm>`

const COMPOSITION_COLUMNS = [
    {key: 'name', header: '이름', align: 'start', rowHeader: true},
    {key: 'desc', header: '설명', align: 'start', wrap: true},
] as const

const SUBMIT_COLUMNS = [
    {key: 'field', header: '필드', align: 'start', rowHeader: true},
    {key: 'keys', header: 'FormData 키', align: 'start'},
    {key: 'desc', header: '값', align: 'start', wrap: true},
] as const

const COMPOSITION = [
    {name: 'SearchFilterForm', desc: 'form 컨테이너. 카드 면과 초기화 신호를 맡고, form 속성을 그대로 받습니다.'},
    {name: 'SearchFilterFields', desc: '필드를 세로로 묶습니다.'},
    {name: 'SearchFilterActions', desc: '초기화 · 조회 버튼을 오른쪽에 정렬합니다.'},
    {name: 'SearchFilterRow', desc: '필드 2개를 md 이상에서 2열로 나란히 둡니다.'},
    {name: 'DateRangeField', desc: '조회기간. 기간 칩(오늘 · 1개월 · 3개월 · 전체)과 시작 · 종료 날짜 칸입니다.'},
    {name: 'KeywordSearchField', desc: '검색 대상 셀렉트와 검색어 입력 한 쌍입니다.'},
    {name: 'CompanyNameField', desc: '회사명 텍스트 입력입니다(지우기 버튼 포함).'},
    {name: 'SelectFilterField', desc: '옵션을 직접 넘기는 셀렉트 필드입니다.'},
    {name: 'SearchTypeField', desc: '검색유형 셀렉트(전체 · 기술평가 · 특허평가 · K-BIGx 보고서)입니다.'},
    {name: 'PaymentTypeField', desc: '유/무료 셀렉트(전체 · 유료 · 무료)입니다.'},
] as const

const PROPS_ITEMS = [
    [
        'SearchFilterForm',
        'onSubmit',
        '조회 제출 핸들러입니다. FormData 로 필드 값을 읽습니다.',
        '-',
        'FormEventHandler',
    ],
    ['SearchFilterForm', 'onReset', '필드가 기본값으로 돌아갈 때 함께 호출됩니다.', '-', '() => void'],
    [
        'SearchFilterForm',
        'layout',
        '라벨 자리입니다. row 는 md 이상에서 라벨이 왼쪽, stack 은 늘 위입니다. 폭이 좁은 자리에는 stack 을 씁니다.',
        "'row'",
        "'row' | 'stack'",
    ],
    [
        'SearchFilterForm',
        'surface',
        '카드 면입니다. muted 는 회색, card 는 흰 면입니다.',
        "'muted'",
        "'muted' | 'card'",
    ],
    [
        'SearchFilterForm',
        'className · form 속성',
        'aria-label 등 네이티브 form 속성을 그대로 전달합니다. className 은 form(display: contents)에 붙어 카드 모양에는 영향이 없습니다.',
        '-',
        "ComponentProps<'form'>",
    ],
    [
        'SearchFilterFields / SearchFilterActions / SearchFilterRow',
        'children · className',
        '배치만 하는 div 입니다. div 속성을 그대로 받습니다.',
        '-',
        "ComponentProps<'div'>",
    ],
    ['DateRangeField', 'name', '제출 키의 접두사입니다(Preset · From · To 가 붙습니다).', "'dateRange'", 'string'],
    ['DateRangeField', 'label', '라벨 문구입니다.', "'조회기간'", 'string'],
    [
        'DateRangeField',
        'defaultPreset',
        '처음 고른 기간 칩입니다(today · 1month · 3months · all).',
        "'3months'",
        'string',
    ],
    ['DateRangeField', 'defaultFrom · defaultTo', '처음 채워 둘 시작 · 종료일입니다.', '-', 'Date'],
    [
        'DateRangeField',
        'action',
        '날짜 줄 오른쪽에 붙이는 버튼입니다. 액션 줄 대신 [조회]를 여기에 둘 때 씁니다.',
        '-',
        'ReactNode',
    ],
    ['DateRangeField', 'labelHidden', '라벨을 화면에서 감춥니다(스크린리더에는 남습니다).', '-', 'boolean'],
    ['DateRangeField', 'size', '날짜 칸 높이입니다. md 는 40, lg 는 48 입니다.', "'md'", "'lg' | 'md'"],
    [
        'KeywordSearchField',
        'options',
        '검색 대상 목록입니다(필수). 첫 항목이 기본값입니다.',
        '-',
        'readonly {value; label}[]',
    ],
    ['KeywordSearchField', 'name', '제출 키의 접두사입니다(Type · Keyword 가 붙습니다).', "'search'", 'string'],
    ['KeywordSearchField', 'label', '라벨 문구입니다. 검색어 입력의 접근성 이름으로도 쓰입니다.', "'검색어'", 'string'],
    ['KeywordSearchField', 'placeholder', '검색어 입력 안내입니다.', '`${고른 대상 이름} 입력`', 'string'],
    ['KeywordSearchField', 'labelHidden', '라벨을 화면에서 감춥니다(스크린리더에는 남습니다).', '-', 'boolean'],
    ['KeywordSearchField', 'size', '셀렉트 높이입니다. lg 는 48, md 는 40 입니다.', "'lg'", "'lg' | 'md'"],
    ['CompanyNameField', 'name', '제출 키입니다.', "'companyName'", 'string'],
    ['CompanyNameField', 'label', '라벨 문구입니다.', "'회사명'", 'string'],
    ['CompanyNameField', 'placeholder', '입력 안내입니다.', "'회사명을 입력하세요'", 'string'],
    ['CompanyNameField', 'labelHidden', '라벨을 화면에서 감춥니다(스크린리더에는 남습니다).', '-', 'boolean'],
    ['CompanyNameField', 'size', '칸 높이입니다. lg 는 48 이고, 생략하면 입력 기본 높이입니다.', '-', "'lg' | 'md'"],
    ['SelectFilterField', 'label · name', '라벨 문구와 제출 키입니다(필수).', '-', 'string'],
    ['SelectFilterField', 'options', '옵션 목록입니다(필수).', '-', 'readonly {value; label}[]'],
    ['SelectFilterField', 'defaultValue', '처음 고른 값입니다. 비우면 placeholder 가 보입니다.', "''", 'string'],
    ['SelectFilterField', 'placeholder', '고른 값이 없을 때의 안내입니다.', '-', 'string'],
    ['SelectFilterField', 'labelHidden', '라벨을 화면에서 감춥니다(스크린리더에는 남습니다).', '-', 'boolean'],
    [
        'SelectFilterField',
        'size',
        '칸 높이입니다. lg 는 48, md 는 40 이고, 생략하면 셀렉트 기본 높이입니다.',
        '-',
        "'lg' | 'md'",
    ],
    ['SearchTypeField', 'name · label', '제출 키와 라벨 문구입니다.', "'searchType' · '검색유형'", 'string'],
    [
        'SearchTypeField',
        'defaultValue · placeholder',
        '처음 고른 값과 미선택 안내입니다. defaultValue="" 면 placeholder 가 보입니다.',
        "'all' · '선택해 주세요'",
        'string',
    ],
    ['PaymentTypeField', 'name · label', '제출 키와 라벨 문구입니다.', "'paymentType' · '유/무료'", 'string'],
    [
        'PaymentTypeField',
        'defaultValue · placeholder',
        '처음 고른 값과 미선택 안내입니다. defaultValue="" 면 placeholder 가 보입니다.',
        "'all' · '선택해 주세요'",
        'string',
    ],
] as const

const SUBMIT_KEYS = [
    {
        field: 'DateRangeField',
        keys: 'dateRangePreset · dateRangeFrom · dateRangeTo',
        desc: '기간 칩 값과 시작 · 종료일(yyyy-MM-dd). 날짜를 비우면 빈 문자열입니다.',
    },
    {field: 'KeywordSearchField', keys: 'searchType · searchKeyword', desc: '고른 검색 대상 값과 입력한 검색어.'},
    {field: 'CompanyNameField', keys: 'companyName', desc: '입력한 문자열.'},
    {field: 'SelectFilterField', keys: 'name 으로 넘긴 값', desc: '고른 옵션의 value.'},
    {field: 'SearchTypeField', keys: 'searchType', desc: '고른 검색유형 값(all · tech · patent · k-bigx).'},
    {field: 'PaymentTypeField', keys: 'paymentType', desc: '고른 유/무료 값(all · paid · free).'},
] as const

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

const SearchFilterFormGuidePage = () => (
    <GuidePageShell
        title="조회 필터 폼 (SearchFilterForm)"
        description="목록 화면 상단의 조회(검색) 필터를 조립하는 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="sff-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sff-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>SearchFilterForm</code> 안에 필요한 필드와 초기화 · 조회 버튼을 넣습니다. 필드 값은 필드가
                        관리하므로 사용처는 <code>name</code> 과 기본값만 정합니다. 버튼은 프로젝트 <code>Button</code>{' '}
                        을 씁니다.
                    </p>
                </div>
                <SearchFilterFormDemo showResult={false} />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sff-composition" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sff-composition" className="typo-h4-bold">
                        구성 요소
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        모두 <code>@/components/composite/search-filter-form</code> 에서 가져옵니다.
                    </p>
                </div>
                <Table
                    caption="조회 필터 폼 구성 요소 목록"
                    columns={COMPOSITION_COLUMNS}
                    rows={COMPOSITION.map((row) => ({
                        key: row.name,
                        cells: [<code key="name">{row.name}</code>, row.desc],
                    }))}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sff-cases" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sff-cases" className="typo-h4-bold">
                        조합 예시
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        화면에 필요한 필드만 골라 원하는 순서로 넣습니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">최소 구성</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            조회기간과 셀렉트 하나만 둡니다. 버튼도 조회 하나만 둘 수 있습니다.
                        </p>
                        <MinimalFilterCaseDemo />
                        <CodeBlock code={USAGE_MINIMAL} language="tsx" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">입력 + 2열 셀렉트</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            짧은 셀렉트 두 개는 <code>SearchFilterRow</code> 로 묶어 md 이상에서 나란히 둡니다.{' '}
                            <code>defaultValue=&quot;&quot;</code> 면 placeholder 가 보이고, 값을 주면 그 옵션이 선택된
                            채 시작합니다.
                        </p>
                        <TwoColumnFilterCaseDemo />
                        <CodeBlock code={USAGE_TWO_COLUMN} language="tsx" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">레이아웃 래퍼 없이 배치</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>SearchFilterFields</code> · <code>SearchFilterActions</code> 는 배치만 하므로 한
                            화면에서만 쓰는 배치라면 <code>div</code> 로 직접 배치해도 됩니다.
                        </p>
                        <CodeBlock code={USAGE_INLINE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sff-submit" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sff-submit" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>onSubmit</code> 에서 <code>new FormData(event.currentTarget)</code> 로 값을 한 번에
                        읽습니다. <code>type=&quot;reset&quot;</code> 버튼은 모든 필드를 기본값으로 되돌리고{' '}
                        <code>onReset</code> 을 호출합니다.
                    </p>
                </div>
                <Table
                    caption="필드별 제출 키 목록"
                    columns={SUBMIT_COLUMNS}
                    rows={SUBMIT_KEYS.map((row) => ({
                        key: row.field,
                        cells: [<code key="field">{row.field}</code>, <code key="keys">{row.keys}</code>, row.desc],
                    }))}
                    size="md"
                />
                <p className="typo-body-l-regular text-label-foreground max-w-4xl">
                    <code>KeywordSearchField</code> 와 <code>SearchTypeField</code> 는 기본 제출 키가 둘 다{' '}
                    <code>searchType</code> 입니다. 한 폼에 함께 두면 한쪽의 <code>name</code> 을 바꿉니다.
                </p>
                <SearchFilterFormDemo />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sff-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sff-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">검색 조건의 수로 고릅니다.</p>
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
            <section aria-labelledby="sff-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sff-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        아래는 컴포넌트가 처리하므로 사용처에서 따로 넣지 않습니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        필드마다 라벨과 컨트롤이 연결되고 여러 컨트롤이 한 줄이면 <code>role=&quot;group&quot;</code>{' '}
                        으로 묶입니다. <code>labelHidden</code> 으로 감춘 라벨도 스크린리더에는 읽힙니다[7.4.1].
                    </li>
                    <li>필드의 id 는 자동으로 만들어져 같은 필드를 여러 번 넣어도 겹치지 않습니다[8.1.1].</li>
                    <li>
                        사용처는 폼에 <code>aria-label</code> 로 이름을 주고, 조회는 버튼으로만 실행합니다(값이 바뀔 때
                        바로 조회하지 않습니다)[7.2.1].
                    </li>
                    <li>
                        WAVE 가 셀렉트 필드에서 보고하는 <em>Missing form label</em> 은 Radix Select 의 숨은 select
                        때문에 생기는 예외 항목이므로 사용처에서 고치지 않습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sff-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sff-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="조회 필터 폼 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SearchFilterFormGuidePage
