'use client'

import {createContext, useContext, useEffect, useId, useRef, useState, type ComponentProps, type ReactNode} from 'react'
import {Input} from '@/components/ui/input'
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

const filterLabelClassName = 'typo-body-xl-bold text-foreground md:w-25 md:shrink-0 md:pt-3'

// 라벨(왼쪽)+컨트롤(오른쪽) 한 줄. md 미만에서는 세로로 쌓인다.
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
    return (
        <div
            {...(isGroup ? {role: 'group', 'aria-labelledby': labelId} : {})}
            className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6"
        >
            {isGroup ? (
                <span id={labelId} className={filterLabelClassName}>
                    {label}
                </span>
            ) : (
                <label id={labelId} htmlFor={htmlFor} className={filterLabelClassName}>
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

type DateRangeFieldProps = {name?: string; label?: string; defaultPreset?: string}

// 조회기간 — 빠른 기간 선택(SegmentedControl solid) + 시작·종료 DatePicker 범위(컨트롤 그룹).
const DateRangeField = ({name = 'dateRange', label = '조회기간', defaultPreset = '3months'}: DateRangeFieldProps) => {
    const labelId = useId()
    const [preset, setPreset] = useState(defaultPreset)
    const [from, setFrom] = useState<Date | undefined>(undefined)
    const [to, setTo] = useState<Date | undefined>(undefined)

    useResetSignal(() => {
        setPreset(defaultPreset)
        setFrom(undefined)
        setTo(undefined)
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
            <div className="flex items-center gap-2">
                <DatePicker
                    value={from}
                    onChange={setFrom}
                    name={`${name}From`}
                    aria-label="조회 시작일"
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
                    className="flex-1"
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
            <Input
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

// 라벨·옵션·placeholder 를 받는 공통 Select 필드. 기본값을 비우면 placeholder(선택해주세요)가 보인다.
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
    placeholder = '선택해주세요',
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
    placeholder = '선택해주세요',
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

type SearchFilterFormProps = Omit<ComponentProps<'form'>, 'onReset'> & {onReset?: () => void}

// 조회 필터 폼 컨테이너. 회색 카드 + reset 신호 제공.
const SearchFilterForm = ({children, className, onReset, ...props}: SearchFilterFormProps) => {
    const [resetSignal, setResetSignal] = useState(0)

    return (
        <ResetSignalContext.Provider value={resetSignal}>
            <form
                {...props}
                onReset={(event) => {
                    setResetSignal((current) => current + 1)
                    onReset?.()
                    event.preventDefault()
                }}
                className={cn('bg-background flex flex-col gap-8 rounded-md p-6 md:p-10', className)}
            >
                {children}
            </form>
        </ResetSignalContext.Provider>
    )
}

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
