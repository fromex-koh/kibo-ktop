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
    children: ReactNode
}

const FilterRow = ({label, labelId, htmlFor, children}: FilterRowProps) => {
    const isGroup = htmlFor === undefined
    const layout = useContext(LayoutContext)
    const isRow = layout === 'row'
    const labelClassName = cn(filterLabelClassName, isRow && filterRowLabelClassName)

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
}

// 조회기간 — 빠른 기간 선택(SegmentedControl solid) + 시작·종료 DatePicker 범위(컨트롤 그룹).
const DateRangeField = ({
    name = 'dateRange',
    label = '조회기간',
    defaultPreset = '3months',
    defaultFrom,
    defaultTo,
    action,
}: DateRangeFieldProps) => {
    const labelId = useId()
    const [preset, setPreset] = useState(defaultPreset)
    const [from, setFrom] = useState<Date | undefined>(defaultFrom)
    const [to, setTo] = useState<Date | undefined>(defaultTo)

    useResetSignal(() => {
        setPreset(defaultPreset)
        setFrom(defaultFrom)
        setTo(defaultTo)
    })

    return (
        <FilterRow label={label} labelId={labelId}>
            <SegmentedControl
                type="radio"
                variant="solid"
                size="md"
                name={`${name}Preset`}
                value={preset}
                onValueChange={setPreset}
                aria-labelledby={labelId}
            >
                {DATE_RANGE_PRESETS.map((option) => (
                    <SegmentedControlItem key={option.value} value={option.value}>
                        {option.label}
                    </SegmentedControlItem>
                ))}
            </SegmentedControl>
            <div className="flex flex-wrap items-center gap-2">
                {/* 같은 줄의 기간 칩·[조회] 버튼과 같은 컨트롤 높이(40)를 쓴다 — 한 줄에 선 컨트롤의
                    높이가 다르면 줄이 어긋나 보인다. */}
                <DatePicker
                    value={from}
                    onChange={setFrom}
                    name={`${name}From`}
                    aria-label="조회 시작일"
                    size="md"
                    className="flex-1"
                />
                <span aria-hidden="true" className="text-foreground shrink-0">
                    ~
                </span>
                <DatePicker
                    value={to}
                    onChange={setTo}
                    name={`${name}To`}
                    aria-label="조회 종료일"
                    size="md"
                    className="flex-1"
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

type SelectOption = {value: string; label: string}

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
                            // stack 배치는 라벨·컨트롤이 한 덩어리로 쌓여 세로가 짧다 — 위아래 여백을 24 로
                            // 두어 카드가 필요 이상으로 높아지지 않게 한다(시안).
                            layout === 'row' ? 'md:py-10' : undefined,
                        )}
                    >
                        <div className={cn('flex flex-col', layout === 'row' ? 'gap-8' : 'gap-6')}>{children}</div>
                    </BaseCard>
                </form>
            </ResetSignalContext.Provider>
        </LayoutContext.Provider>
    )
}

export type {SearchFilterLayout, SearchFilterFormProps, DateRangeFieldProps}
export {
    SearchFilterForm,
    SearchFilterFields,
    SearchFilterActions,
    SearchFilterRow,
    DateRangeField,
    CompanyNameField,
    SearchTypeField,
    PaymentTypeField,
}
