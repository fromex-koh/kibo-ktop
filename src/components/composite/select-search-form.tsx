'use client'

import {useId, useState, type SubmitEvent} from 'react'
import {LoaderCircle, RotateCcw, Search} from 'lucide-react'
import {ClearableInput} from '@/components/composite/clearable-input'
import {SelectContent, SelectField, SelectItem} from '@/components/composite/select-field'
import {Button} from '@/components/ui/button'
import {SelectTrigger, SelectValue} from '@/components/ui/select'
import {cn} from '@/lib/utils'

// 기준 선택 검색 — 검색 기준(셀렉트)을 고르고 번호 · 검색어를 한 줄에 크게 입력해 조회하는 검색 카드다.
// 특허 등급조회의 '특허등록번호 / 특허출원번호' 검색이 이 형태다.
//
// 시안 규격(특허 등급조회 검색): 카드 흰 면 · 반경 24 · 그림자(shadow-1) · 여백 40 ·
// 입력 줄 높이 40 — 기준 셀렉트(20 Medium gray.900, 안쪽 여백 4, 글자와 아래 화살표(20) 사이 4)와
// 입력(24 Regular gray.700)이 24 떨어져 한 줄 · 입력 줄 아래 24 에 구분선(gray.100) ·
// 구분선 아래 24 에 오른쪽 정렬 [초기화](16 Regular 밑줄 + 새로고침 16) · 20 · [검색하기](최소 128 × 48 · 돋보기 20 ·
// 16 Medium · 아이콘과 글자 사이 4).
// 오류 상태: 입력 줄 아래 4 에 빨간 안내(16 Regular · field-error-foreground)가 입력과 같은 왼쪽 선에 선다.
// 구분선 색은 상태와 관계없이 바꾸지 않는다 — 포커스는 입력 칸의 포커스 링, 오류는 안내 문구로만 알린다.
// 좁은 화면(768 미만)은 기준 · 입력이 위아래로 쌓이고, 오류 안내는 왼쪽 끝에서 시작한다.

type SelectSearchOption = {
    value: string
    label: string
    /** 이 기준 값의 형식. 주면 형식이 맞아야 검색한다. */
    pattern?: RegExp
    /** 이 기준을 골랐을 때의 입력 칸 안내 문구. 없으면 placeholder(기준 이름)로 만든다. */
    placeholder?: string
    /** 이 기준을 골랐을 때 버튼 줄 왼쪽에 두는 도움말(※ 검색대상 등). */
    note?: string
}

type SelectSearchSubmit = {
    /** 고른 기준의 value. */
    type: string
    /** 앞뒤 공백을 걷어 낸 입력값. */
    value: string
}

type SelectSearchFormProps = {
    /** 검색 기준 목록 — 첫 항목이 처음 고른 기준이다. */
    options: readonly SelectSearchOption[]
    /** 형식 검사를 통과한 검색. */
    onSearch?: (search: SelectSearchSubmit) => void
    /** [초기화]를 눌렀을 때 — 사용처는 여기서 검색 결과도 처음 상태로 되돌린다. */
    onReset?: () => void
    /**
     * 조회 중. [검색하기]가 도는 표시와 searchingLabel 로 바뀌고 [초기화]와 함께 눌리지 않는다 — 결과가 오기 전에
     * 다시 누르거나 입력을 비워 결과와 입력이 어긋나지 않게 한다.
     */
    isSearching?: boolean
    /**
     * 기준별로 처음 넣어 둘 값. 기준을 바꾸면, 입력이 이전 기준의 기본값 그대로일 때만 새 기준의 기본값으로 바꾼다.
     * [초기화]를 누르면 이 값으로 돌아간다. 비우면 빈 칸으로 시작한다.
     */
    defaultValues?: Partial<Record<string, string>>
    /** 처음 고른 기준(options 의 value). 비우면 첫 항목이다. [초기화]도 이 기준으로 돌아간다. */
    defaultType?: string
    /** 입력을 비우고 검색했을 때의 안내. */
    emptyError?: string
    /** 형식이 맞지 않을 때의 안내. 기준 이름을 받아 문장을 만든다. */
    invalidError?: (label: string) => string
    /** 입력 칸 안내 문구. 기준 이름을 받아 문장을 만든다. */
    placeholder?: (label: string) => string
    /** 셀렉트의 접근성 이름(화면에는 보이지 않는다). */
    typeLabel?: string
    searchLabel?: string
    searchingLabel?: string
    resetLabel?: string
    className?: string
}

const defaultInvalidError = (label: string) => `${label} 형식이 올바르지 않습니다.`
const defaultPlaceholder = (label: string) => `${label}를 입력하세요`

const SelectSearchForm = ({
    options,
    onSearch,
    onReset,
    isSearching = false,
    defaultValues,
    defaultType,
    emptyError = '검색어를 입력해주세요.',
    invalidError = defaultInvalidError,
    placeholder = defaultPlaceholder,
    typeLabel = '검색 기준',
    searchLabel = '검색하기',
    searchingLabel = '검색 중',
    resetLabel = '초기화',
    className,
}: SelectSearchFormProps) => {
    const inputId = useId()
    const selectId = useId()
    const errorId = useId()
    const noteId = useId()
    const initialType = options.some((option) => option.value === defaultType)
        ? (defaultType ?? '')
        : (options[0]?.value ?? '')
    const [searchType, setSearchType] = useState(initialType)
    const [keyword, setKeyword] = useState(defaultValues?.[initialType] ?? '')
    const [error, setError] = useState('')

    const selected = options.find((option) => option.value === searchType) ?? options[0]
    const selectedLabel = selected?.label ?? ''

    // [초기화] — 처음 상태(처음 고른 기준 · 그 기준의 기본값)로 돌아간다.
    const handleReset = () => {
        setSearchType(initialType)
        setKeyword(defaultValues?.[initialType] ?? '')
        setError('')
        onReset?.()
    }

    // 기준을 바꾸면, 입력이 이전 기준의 기본값 그대로일 때만 새 기준의 기본값으로 바꾼다 — 직접 입력한 값은 덮어쓰지 않는다.
    const handleTypeChange = (nextType: string) => {
        if (keyword === (defaultValues?.[searchType] ?? '')) setKeyword(defaultValues?.[nextType] ?? '')
        setSearchType(nextType)
        setError('')
    }

    // 값이 비었거나 형식이 맞지 않으면 입력 아래에 안내를 보이고 입력으로 포커스를 옮긴다[7.4.2].
    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const value = keyword.trim()
        const getError = () => {
            if (!value) return emptyError
            if (selected?.pattern && !selected.pattern.test(value)) return invalidError(selectedLabel)
            return ''
        }
        const nextError = getError()
        setError(nextError)

        if (nextError) {
            document.getElementById(inputId)?.focus()
            return
        }
        onSearch?.({type: searchType, value})
    }

    return (
        <form
            noValidate
            onSubmit={handleSubmit}
            onReset={handleReset}
            className={cn('bg-card shadow-1 flex flex-col gap-6 rounded-2xl p-6 md:p-10', className)}
        >
            <div className="flex flex-col">
                <div className="flex flex-col gap-3 md:h-10 md:flex-row md:items-center md:gap-6">
                    {/* 검색 기준 — 무엇을 입력하는 칸인지 알려 주므로 입력의 이름 앞에 온다[7.4.1]. */}
                    <label htmlFor={selectId} className="sr-only">
                        {typeLabel}
                    </label>
                    {/* 목록은 프로젝트 공통 드롭다운(SelectField)과 같다 — 트리거 아래 4 에 열리고, 항목 높이 · hover 면 ·
                        선택 표시가 다른 셀렉트와 같다. 트리거만 시안대로 테두리 없는 글자형(20 Medium + 화살표 20)이다.
                        md 이상에서 트리거 자리는 최소 136(시안 select_text) — 기준 이름이 짧아도('기업 검색') 입력 글자와
                        오류 문구가 같은 160 선에서 시작한다. 화살표는 글자 바로 뒤에 붙는다(justify-start). */}
                    <SelectField name="searchType" value={searchType} onValueChange={handleTypeChange}>
                        <SelectTrigger
                            id={selectId}
                            className="typo-title-l-medium text-foreground [&_svg]:text-foreground h-auto w-fit shrink-0 justify-start gap-1 border-0 px-1 shadow-none md:min-w-34 [&_svg]:size-5 [&_svg]:opacity-100"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="min-w-50">
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </SelectField>
                    <label htmlFor={inputId} className="sr-only">
                        {selectedLabel}
                    </label>
                    {/* 값이 있고 칸에 포커스가 있으면 오른쪽에 지우기(X) 버튼이 뜬다 — 프로젝트 ClearableInput 과 같다.
                        바깥 상자는 시안대로 테두리 없이 두고, 포커스 링은 입력 칸의 기본 포커스 링을 쓴다.
                        상자의 안쪽 여백(16)만큼 왼쪽으로 당겨(-ms-4) 글자가 시안 자리(셀렉트에서 24)에 오게 하고,
                        포커스 링은 글자 둘레에 여유를 두고 그려지게 한다. 좁은 화면(768 미만)은 입력이 한 줄을 다 쓰므로
                        오른쪽도 같은 만큼 늘려(-me-4) 상자가 카드 폭에 꽉 차게 한다. */}
                    {/* autoComplete="off" — 브라우저 자동완성 목록과 자동완성 배경색(파란 면)을 끈다. 검색어는 매번 새로
                        입력하는 값이고, 자동완성 면이 테두리 없는 시안 입력에 박스처럼 떠 보이기 때문이다. */}
                    <ClearableInput
                        id={inputId}
                        name="keyword"
                        autoComplete="off"
                        value={keyword}
                        onChange={(event) => {
                            setKeyword(event.currentTarget.value)
                            setError('')
                        }}
                        placeholder={selected?.placeholder ?? placeholder(selectedLabel)}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={
                            [error ? errorId : '', selected?.note ? noteId : ''].filter(Boolean).join(' ') || undefined
                        }
                        className="-ms-4 h-auto min-w-0 flex-1 border-0 bg-transparent shadow-none max-md:-me-4 max-md:w-auto"
                        inputClassName="typo-h4-regular text-label-foreground h-auto px-0"
                    />
                </div>
                {/* 오류 안내 — 입력 줄 바로 아래 4 에, 입력과 같은 왼쪽 선(셀렉트 폭 136 + 24 = 160)에 선다. */}
                {error ? (
                    <p
                        id={errorId}
                        role="alert"
                        className="typo-body-xl-regular text-field-error-foreground mt-1 break-keep md:ps-40"
                    >
                        {error}
                    </p>
                ) : null}
                <hr className="border-subtle-3 mt-6" />
            </div>
            {/* 버튼 줄 — 왼쪽에 고른 기준의 도움말(14 Regular gray.600), 오른쪽에 [초기화] · [검색하기].
                좁은 화면에서는 도움말이 위 줄, 버튼이 아래 줄 오른쪽으로 내려간다. 도움말은 입력의 설명으로도 잇는다. */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
                {selected?.note ? (
                    <p id={noteId} className="typo-body-l-regular text-foreground-subtle min-w-0 flex-1 break-keep">
                        {selected.note}
                    </p>
                ) : (
                    <span className="hidden flex-1 md:block" aria-hidden="true" />
                )}
                <div className="flex items-center justify-end gap-5">
                    {/* [초기화]는 글자 버튼이다 — 누르면 기준과 입력이 처음 상태로 돌아간다. */}
                    <Button type="reset" variant="text-underline" size="md" disabled={isSearching}>
                        {resetLabel}
                        <RotateCcw aria-hidden="true" />
                    </Button>
                    {/* [검색하기] — md 크기에 기본(primary) md 의 굵게 대신 Medium, 간격 8 대신 4 를 둔다.
                    조회 중에는 돋보기 자리에 도는 표시를 두고 글자를 searchingLabel 로 바꾼다 — 최소 폭 128 을 잡아 두어
                    글자가 짧아져도 버튼이 흔들리지 않는다. 표시는 장식이라 읽히지 않게 하고, 진행 중이라는 사실은
                    aria-busy 가 전한다[8.2.1]. 동작 줄이기 설정에서는 돌지 않는다[6.3.1]. */}
                    <Button
                        type="submit"
                        size="md"
                        className="min-w-32 gap-1 font-medium"
                        disabled={isSearching}
                        aria-busy={isSearching}
                    >
                        {isSearching ? (
                            <LoaderCircle aria-hidden="true" className="motion-safe:animate-spin" />
                        ) : (
                            <Search aria-hidden="true" />
                        )}
                        {isSearching ? searchingLabel : searchLabel}
                    </Button>
                </div>
            </div>
        </form>
    )
}

export {SelectSearchForm}
export type {SelectSearchFormProps, SelectSearchOption, SelectSearchSubmit}
