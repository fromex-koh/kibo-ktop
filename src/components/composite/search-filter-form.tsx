'use client'

import {createContext, useContext, useEffect, useId, useRef, useState, type ComponentProps, type ReactNode} from 'react'
import {BaseCard} from '@/components/composite/base-card'
import {ClearableInput} from '@/components/composite/clearable-input'
import {DatePicker} from '@/components/composite/date-picker'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: 목록 화면 상단의 조회(검색) 필터 폼. Figma "조회" 프레임을 옮긴 것으로,
// 왼쪽 라벨 + 오른쪽 컨트롤(SegmentedControl·DatePicker·Input·Select)을 회색 카드에 담고
// 우측 하단에 초기화·조회 액션을 둔다. type="reset" 초기화가 컨트롤 상태를 되돌릴 수 있도록
// 폼이 reset 신호를 내려주고, 각 필드는 이 신호에 맞춰 기본값으로 복귀한다.
// id 는 useId 로 만들어 같은 필드를 여러 번 배치해도 중복되지 않는다.

const ResetSignalContext = createContext(0)

// 라벨을 어디에 두는지 — 폼이 정해 모든 필드가 같은 배치를 따른다.
//   row   : 라벨이 왼쪽(md 이상). 넓은 화면 전용 조회 화면의 기본이다.
//   stack : 라벨이 늘 위. 사이드바 옆처럼 폭이 좁은 자리(마이페이지 792)에서 왼쪽 라벨을 두면
//           컨트롤에 남는 폭이 모자라 날짜 두 칸이 눌린다.
type SearchFilterLayout = 'row' | 'stack'

const LayoutContext = createContext<SearchFilterLayout>('row')

// 필드가 폼 초기화(type="reset")에 반응해 기본값으로 되돌아갈 때 쓰는 신호. 초기 마운트(0)에는 무시한다.
const useResetSignal = (reset: () => void) => {
    const signal = useContext(ResetSignalContext)
    const isFirst = useRef(true)
    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false
            return
        }
        reset()
        // reset 은 각 필드가 매 렌더 새로 만드는 콜백이라 signal 변화에만 반응하도록 의존성을 제한한다.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signal])
}

const filterLabelClassName = 'typo-body-xl-bold text-foreground'
// row 배치에서만 라벨이 왼쪽으로 간다 — 폭(100)과 첫 줄 컨트롤에 맞춘 위 여백을 함께 준다.
const filterRowLabelClassName = 'md:w-25 md:shrink-0 md:pt-3'

// 라벨 + 컨트롤 한 줄. 라벨 자리는 폼이 정한 배치를 따른다(위 SearchFilterLayout).
// 단일 컨트롤은 label htmlFor 로 연결하고, 컨트롤이 여러 개인 그룹은 label 대신 span + role="group"+aria-labelledby 로
// 묶는다(WAVE "Orphaned form label" 방지 — label 요소는 반드시 하나의 폼 컨트롤과 연결돼야 한다).
type FilterRowProps = {
    label: string
    labelId: string
    htmlFor?: string
    /** 라벨을 화면에서 감춘다 — 무엇을 고르는 줄인지 생김새로 알 수 있는 시안에서 쓴다.
        지우지 않고 감추는 이유는 스크린리더에는 그 이름이 남아야 하기 때문이다[7.4.1]. */
    labelHidden?: boolean
    children: ReactNode
}

const FilterRow = ({label, labelId, htmlFor, labelHidden, children}: FilterRowProps) => {
    const isGroup = htmlFor === undefined
    const layout = useContext(LayoutContext)
    const isRow = layout === 'row'
    const labelClassName = cn(filterLabelClassName, isRow && filterRowLabelClassName, labelHidden && 'sr-only')

    return (
        <div
            {...(isGroup ? {role: 'group', 'aria-labelledby': labelId} : {})}
            className={cn('flex flex-col', isRow ? 'gap-2 md:flex-row md:items-start md:gap-6' : 'gap-4')}
        >
            {isGroup ? (
                <span id={labelId} className={labelClassName}>
                    {label}
                </span>
            ) : (
                <label id={labelId} htmlFor={htmlFor} className={labelClassName}>
                    {label}
                </label>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-2">{children}</div>
        </div>
    )
}

type SelectOption = {value: string; label: string}

const DATE_RANGE_PRESETS = [
    {value: 'today', label: '오늘'},
    {value: '1month', label: '1개월'},
    {value: '3months', label: '3개월'},
    {value: 'all', label: '전체'},
] as const

type DateRangeFieldProps = {
    name?: string
    label?: string
    defaultPreset?: string
    /** 처음 채워 둘 시작·종료일. 조회 결과가 이미 있는 화면은 그 조회 조건을 그대로 보여 준다. */
    defaultFrom?: Date
    defaultTo?: Date
    /**
     * 날짜 줄 오른쪽에 붙는 버튼([조회]). 폼 아래 액션 줄(SearchFilterActions) 대신 이 자리에 둘 때 쓴다 —
     * 조회기간 하나만 묻는 필터는 버튼을 따로 한 줄 내리면 카드가 이유 없이 높아진다.
     * 버튼의 크기는 Button 의 size 축을 그대로 쓴다(같은 줄의 컨트롤과 높이를 맞추려면 sm) — 다만
     * 이 자리에서는 글자 폭만큼만 차지한다(아래 *:min-w-0).
     */
    action?: ReactNode
    /** 라벨을 화면에서 감춘다(스크린리더에는 남는다). */
    labelHidden?: boolean
    /** 날짜 칸 높이 — 기본은 40(md)이고, 시안이 48 인 화면은 lg 를 준다. */
    size?: 'lg' | 'md'
}

// 조회기간 — 빠른 기간 선택(SegmentedControl solid) + 시작·종료 DatePicker 범위(컨트롤 그룹).
const DateRangeField = ({
    name = 'dateRange',
    label = '조회기간',
    defaultPreset = '3months',
    defaultFrom,
    defaultTo,
    action,
    labelHidden,
    size = 'md',
}: DateRangeFieldProps) => {
    const labelId = useId()
    // 폼 안의 컨트롤은 모두 id 나 name 을 가져야 한다(HTML 검사기 "A form field element should have an id or
    // name attribute") — 기간 칩과 날짜 칸의 실제 조작 요소는 button 이라 name 이 붙지 않으므로 id 를 준다.
    const controlId = useId()
    const [preset, setPreset] = useState(defaultPreset)
    // 두 날짜 칸은 빈 값도 이 폼이 쥐고 있어야 한다(controlled) — 값을 비웠을 때 DatePicker 가 비제어로
    // 돌아가면 직전에 고른 날짜가 내부 상태에서 되살아나 [초기화]가 듣지 않는다.
    const [from, setFrom] = useState<Date | undefined>(defaultFrom)
    const [to, setTo] = useState<Date | undefined>(defaultTo)

    useResetSignal(() => {
        setPreset(defaultPreset)
        setFrom(defaultFrom)
        setTo(defaultTo)
    })

    return (
        <FilterRow label={label} labelId={labelId} labelHidden={labelHidden}>
            {/* 기간 칩은 폭이 고정(72)이라 넷을 나란히 두면 360 폭 카드를 넘어선다 — 좁은 화면에서는
                한 줄을 고르게 나눠 갖게 한다(칩 하나하나가 카드 안에 들어온다). */}
            <SegmentedControl
                type="radio"
                variant="solid"
                size="md"
                name={`${name}Preset`}
                value={preset}
                onValueChange={setPreset}
                aria-labelledby={labelId}
                className="max-sm:w-full max-sm:*:w-auto max-sm:*:flex-1"
            >
                {DATE_RANGE_PRESETS.map((option) => (
                    <SegmentedControlItem key={option.value} id={`${controlId}-${option.value}`} value={option.value}>
                        {option.label}
                    </SegmentedControlItem>
                ))}
            </SegmentedControl>
            {/* 좁은 화면(sm 미만)에서는 날짜 두 칸을 위아래로 쌓는다 — 360 폭에서 한 줄에 두 칸을 두면
                한 칸이 120 남짓이라 "연도-월-일" 자리가 모자라 글자가 두 줄로 접힌다.
                쌓인 뒤에도 사이의 ~ 는 그대로 두 칸 사이 가운데에 둔다(시작~종료 한 쌍임을 보여 준다). */}
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                {/* 같은 줄의 기간 칩·[조회] 버튼과 같은 컨트롤 높이(40)를 쓴다 — 한 줄에 선 컨트롤의
                    높이가 다르면 줄이 어긋나 보인다. */}
                {/* flex-1 은 가로로 나눌 때만 준다 — 세로로 쌓인 상태에서는 flex-basis 가 높이를 0 으로
                    잡아 칸이 눌린다. 쌓였을 때는 카드 폭을 그대로 쓴다. */}
                <DatePicker
                    id={`${controlId}-from`}
                    value={from}
                    controlled
                    onChange={setFrom}
                    name={`${name}From`}
                    aria-label="조회 시작일"
                    size={size}
                    className="w-full sm:flex-1"
                />
                <span aria-hidden="true" className="text-foreground shrink-0 max-sm:self-center">
                    ~
                </span>
                <DatePicker
                    id={`${controlId}-to`}
                    value={to}
                    controlled
                    onChange={setTo}
                    name={`${name}To`}
                    aria-label="조회 종료일"
                    size={size}
                    className="w-full sm:flex-1"
                />
                {/* 인라인 액션은 글자 폭만큼만 차지한다. Button 의 size 축에는 홀로 서는 CTA 가 너무
                    좁아지지 않도록 최소 폭(sm 90)이 들어 있는데, 입력 옆에 붙는 버튼에서는 그 여백이
                    그대로 남아 넓어 보인다(시안 73). 자리에서 오는 제약이라 사용처마다 풀지 않고
                    이 슬롯이 한 번 푼다. */}
                {action ? <div className="flex shrink-0 items-center gap-2 *:min-w-0">{action}</div> : null}
            </div>
        </FilterRow>
    )
}

// 검색 대상(Select) + 검색어(Input) 한 줄 — 무엇으로 찾을지 고르고 그 값을 적는다(시안 "조회").
// 두 칸이 한 쌍이라 한 줄(FilterRow)에 함께 두고, 이름은 <name>Type · <name>Keyword 로 제출한다.
// 좁은 화면에서는 위아래로 쌓인다 — 한 줄에 두 칸을 두면 고른 대상도 적은 값도 읽기 어려워진다.
type KeywordSearchFieldProps = {
    name?: string
    label?: string
    /** 검색 대상 목록. 첫 항목이 기본값이다. */
    options: readonly SelectOption[]
    placeholder?: string
    /** 라벨을 화면에서 감춘다(스크린리더에는 남는다). */
    labelHidden?: boolean
    /** 칸 높이 — 기본은 48(lg). */
    size?: 'lg' | 'md'
}

const KeywordSearchField = ({
    name = 'search',
    label = '검색어',
    options,
    placeholder,
    labelHidden,
    size = 'lg',
}: KeywordSearchFieldProps) => {
    const id = useId()
    const labelId = `${id}-label`
    const targetId = `${id}-target`
    const keywordId = `${id}-keyword`
    const [target, setTarget] = useState(options[0].value)
    const [keyword, setKeyword] = useState('')

    useResetSignal(() => {
        setTarget(options[0].value)
        setKeyword('')
    })

    const targetLabel = options.find((option) => option.value === target)?.label ?? label

    return (
        <FilterRow label={label} labelId={labelId} labelHidden={labelHidden}>
            <div className="grid gap-2 sm:grid-cols-2">
                {/* 두 칸은 각자 무엇을 고르고 적는 자리인지 이름을 갖는다 — 라벨을 감춘 줄이라
                    보이는 글자만으로는 전해지지 않는다[7.4.1]. */}
                <Select name={`${name}Type`} value={target} onValueChange={setTarget}>
                    <SelectTrigger id={targetId} size={size} aria-label={`${label} 대상`} className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <ClearableInput
                    id={keywordId}
                    name={`${name}Keyword`}
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    aria-label={label}
                    placeholder={placeholder ?? `${targetLabel} 입력`}
                />
            </div>
        </FilterRow>
    )
}

type CompanyNameFieldProps = {name?: string; label?: string; placeholder?: string}

// 회사(기업)명 — 텍스트 입력.
const CompanyNameField = ({
    name = 'companyName',
    label = '회사명',
    placeholder = '회사명을 입력하세요',
}: CompanyNameFieldProps) => {
    const id = useId()
    const labelId = `${id}-label`
    const [value, setValue] = useState('')
    useResetSignal(() => setValue(''))

    return (
        <FilterRow label={label} labelId={labelId} htmlFor={id}>
            <ClearableInput
                id={id}
                name={name}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={placeholder}
            />
        </FilterRow>
    )
}

// 라벨·옵션·placeholder 를 받는 공통 Select 필드. 기본값을 비우면 placeholder(선택해 주세요)가 보인다.
type SelectFilterFieldProps = {
    label: string
    name: string
    options: readonly SelectOption[]
    defaultValue?: string
    placeholder?: string
}

const SelectFilterField = ({label, name, options, defaultValue = '', placeholder}: SelectFilterFieldProps) => {
    const id = useId()
    const labelId = `${id}-label`
    const [value, setValue] = useState(defaultValue)
    useResetSignal(() => setValue(defaultValue))

    // 조작 요소인 트리거(button)는 label htmlFor 로 연결된다. Radix Select 가 폼 제출용으로 자동 생성하는
    // hidden native <select>(aria-hidden)에는 라벨을 붙일 방법이 없어 WAVE "Missing form label"이 남는데,
    // 이는 shadcn/Radix 구조에서 비롯된 오탐이라 컴포넌트 가이드의 "WAVE 예외"에 사유를 문서화한다.
    return (
        <FilterRow label={label} labelId={labelId} htmlFor={id}>
            <Select name={name} value={value} onValueChange={setValue}>
                <SelectTrigger id={id} className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </FilterRow>
    )
}

const SEARCH_TYPES: readonly SelectOption[] = [
    {value: 'all', label: '전체'},
    {value: 'tech', label: '기술평가'},
    {value: 'patent', label: '특허평가'},
    {value: 'k-bigx', label: 'K-BIGx 보고서'},
]

type SelectFieldProps = {name?: string; label?: string; defaultValue?: string; placeholder?: string}

// 검색(조회)유형 — Select 드롭다운.
const SearchTypeField = ({
    name = 'searchType',
    label = '검색유형',
    defaultValue = 'all',
    placeholder = '선택해 주세요',
}: SelectFieldProps) => (
    <SelectFilterField
        label={label}
        name={name}
        options={SEARCH_TYPES}
        defaultValue={defaultValue}
        placeholder={placeholder}
    />
)

const PAYMENT_TYPES: readonly SelectOption[] = [
    {value: 'all', label: '전체'},
    {value: 'paid', label: '유료'},
    {value: 'free', label: '무료'},
]

// 유/무료 — Select 드롭다운.
const PaymentTypeField = ({
    name = 'paymentType',
    label = '유/무료',
    defaultValue = 'all',
    placeholder = '선택해 주세요',
}: SelectFieldProps) => (
    <SelectFilterField
        label={label}
        name={name}
        options={PAYMENT_TYPES}
        defaultValue={defaultValue}
        placeholder={placeholder}
    />
)

// 한 줄에 필드 2개를 나란히 두는 레이아웃(md 이상 2열). Figma 조회유형·유/무료 같은 짧은 필드에 쓴다.
const SearchFilterRow = ({className, ...props}: ComponentProps<'div'>) => (
    <div className={cn('grid grid-cols-1 gap-6 md:grid-cols-2', className)} {...props} />
)

// 필드 묶음 레이아웃. 한 화면에서만 쓴다면 SearchFilterForm 안에 인라인해도 되지만,
// 문서화된 조립 API 를 그대로 쓸 수 있도록 얇은 래퍼로 제공한다.
const SearchFilterFields = ({className, ...props}: ComponentProps<'div'>) => (
    <div className={cn('flex flex-col gap-6', className)} {...props} />
)

// 액션(초기화·조회) 묶음. 우측 하단 정렬.
const SearchFilterActions = ({className, ...props}: ComponentProps<'div'>) => (
    <div className={cn('flex flex-wrap items-center justify-end gap-3', className)} {...props} />
)

type SearchFilterFormProps = Omit<ComponentProps<'form'>, 'onReset'> & {
    onReset?: () => void
    /** 라벨 자리(위 SearchFilterLayout). 폭이 좁은 자리에서는 stack 을 쓴다. */
    layout?: SearchFilterLayout
    /**
     * 카드 면. 회색 배경 위에 놓이는 화면은 muted(기본), 흰 카드가 이어지는 화면은 card 를 쓴다 —
     * 같은 화면의 두 덩어리가 서로 다른 면이면 한쪽이 꺼진 영역처럼 읽힌다.
     */
    surface?: 'muted' | 'card'
}

const SEARCH_FILTER_SURFACE = {muted: 'bg-background', card: 'bg-card'} as const

// 조회 필터 폼 컨테이너. 카드 면 + 배치 신호 + reset 신호 제공.
//
// 보이는 카드는 공통 BaseCard 가 그린다 — form 요소는 제출을 받는 껍데기라 면·라운드·여백을 직접 갖지
// 않는다. 카드 면·모서리·안쪽 여백이 다른 카드들과 한 곳(BaseCard)에서 관리된다.
// 회색 면(muted)은 흰 카드 위에 회색 필터를 얹는 화면이 쓰던 것이라 그대로 남긴다.
const SearchFilterForm = ({
    children,
    className,
    onReset,
    layout = 'row',
    surface = 'muted',
    ...props
}: SearchFilterFormProps) => {
    const [resetSignal, setResetSignal] = useState(0)

    return (
        <LayoutContext.Provider value={layout}>
            <ResetSignalContext.Provider value={resetSignal}>
                <form
                    {...props}
                    data-layout={layout}
                    onReset={(event) => {
                        setResetSignal((current) => current + 1)
                        onReset?.()
                        event.preventDefault()
                    }}
                    className={cn('contents', className)}
                >
                    <BaseCard
                        className={cn(
                            SEARCH_FILTER_SURFACE[surface],
                            // 좌우 여백 40 은 폼 카드의 값이다(BaseCard 기본 24 보다 넓다 — 시안).
                            'md:[&_[data-slot=card-content]]:px-10',
                            // 위아래 여백은 배치마다 다르다(시안) — row 는 40, stack 은 32.
                            layout === 'row' ? 'md:py-10' : 'md:py-8',
                        )}
                    >
                        {/* stack 배치의 세로 간격 16 은 시안(평가결과 조회 조회 카드)의 값이다 —
                            날짜 줄과 [초기화·조회] 줄이 한 덩어리로 붙는다. */}
                        <div className={cn('flex flex-col', layout === 'row' ? 'gap-8' : 'gap-4')}>{children}</div>
                    </BaseCard>
                </form>
            </ResetSignalContext.Provider>
        </LayoutContext.Provider>
    )
}

export type {SearchFilterLayout, SearchFilterFormProps, DateRangeFieldProps, KeywordSearchFieldProps}
export {
    SearchFilterForm,
    SearchFilterFields,
    SearchFilterActions,
    SearchFilterRow,
    DateRangeField,
    KeywordSearchField,
    CompanyNameField,
    SearchTypeField,
    PaymentTypeField,
}
