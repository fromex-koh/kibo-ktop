'use client'

import {useId, useState, type SubmitEvent} from 'react'
import {LoaderCircle, RotateCcw, Search} from 'lucide-react'
import {ClearableInput} from '@/components/composite/clearable-input'
import {SelectContent, SelectField, SelectItem} from '@/components/composite/select-field'
import {Button} from '@/components/ui/button'
import {SelectTrigger, SelectValue} from '@/components/ui/select'
import {cn} from '@/lib/utils'
// 테두리 글로우(hasGlow) — @property · 마스크가 필요해 유틸리티 대신 CSS 로 둔다.
import '@/styles/select-search-form.css'

// 기준 선택 검색 — 검색 기준(셀렉트)을 고르고 번호 · 검색어를 한 줄에 크게 입력해 조회하는 검색 카드.
// 사용처: 특허 등급조회(patent-grade-lookup) · K-BIGx 기업혁신성장 조회(innovation-growth-report-lookup).
//
// 규격
//   · 카드: bg-card · 반경 24 · shadow-1 · 여백 40(모바일 24)
//   · 입력 줄(높이 40): 기준 셀렉트(20 Medium) — 24 — 입력(24 Regular). 768 미만은 위아래로 쌓인다.
//   · 입력 줄 아래 24 에 구분선(subtle-3), 그 아래 24 에 [초기화] · [검색하기](오른쪽 정렬).
// 오류
//   · 입력 칸: 다른 입력칸의 오류 칸과 같다 — 테두리 destructive · 면 field-invalid(InputGroup theme 이 그린다).
//   · 안내: 입력 줄 아래 4 에 빨간 문구, 입력 글자와 같은 왼쪽 선. 색 + 문구로 함께 알린다[5.3.1].
//
// [프론트엔드 연동] 조회 API 는 onSearch 에서 호출하고, 응답이 올 때까지 isSearching 을 넘긴다.
// 빈 값 · 형식(pattern) 검사는 컴포넌트가 하므로 onSearch 에는 검사를 통과한 값만 온다.

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
     * 셀렉트에서 고른 기준이 바뀌었을 때(검색 전에도) — [초기화]로 처음 기준에 돌아갈 때도 부른다.
     * 고른 기준에 따라 폼 밖의 안내를 바꿀 때 쓴다.
     */
    onTypeChange?: (type: string) => void
    /** 기준을 바꾸면 직접 입력한 값도 비운다 — 기준마다 찾는 대상이 달라 이전 검색어를 다시 쓸 일이 없을 때 켠다. */
    isKeywordClearedOnTypeChange?: boolean
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
    /**
     * 테두리 글로우 — 테두리를 따라 도는 그라데이션 선과 바깥으로 번지는 빛(포커스 때 진해짐).
     * 카드 뒤 층에 깔리므로 감싼 화면 틀에 isolate 가 있어야 보인다(K-BIGx 는 KbigxReportFrame 이 준다).
     * 언제 켤지는 사용처가 정한다.
     */
    hasGlow?: boolean
    className?: string
}

const defaultInvalidError = (label: string) => `${label} 형식이 올바르지 않습니다.`
const defaultPlaceholder = (label: string) => `${label}를 입력하세요`

const SelectSearchForm = ({
    options,
    onSearch,
    onReset,
    onTypeChange,
    isKeywordClearedOnTypeChange = false,
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
    hasGlow = false,
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
        onTypeChange?.(initialType)
        onReset?.()
    }

    // 기준을 바꾸면, 입력이 이전 기준의 기본값 그대로일 때만 새 기준의 기본값으로 바꾼다 — 직접 입력한 값은 덮어쓰지 않는다
    // (isKeywordClearedOnTypeChange 면 입력한 값도 비우고 새 기준의 기본값으로 시작한다).
    const handleTypeChange = (nextType: string) => {
        if (isKeywordClearedOnTypeChange || keyword === (defaultValues?.[searchType] ?? ''))
            setKeyword(defaultValues?.[nextType] ?? '')
        setSearchType(nextType)
        setError('')
        onTypeChange?.(nextType)
    }

    // 값이 비었거나 형식이 맞지 않으면 입력 아래에 안내를 보이고 입력으로 포커스를 옮긴다[7.4.2].
    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        // 조회 중에는 다시 제출하지 않는다 — 버튼을 disabled 로 막지 않으므로(아래 [검색하기] 주석) 여기서 막는다.
        if (isSearching) return

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
            className={cn(
                'bg-card shadow-1 flex flex-col gap-6 rounded-2xl p-6 md:p-10',
                hasGlow && 'select-search-form-glow',
                className,
            )}
        >
            <div className="flex flex-col">
                <div className="flex flex-col gap-3 md:h-10 md:flex-row md:items-center md:gap-6">
                    {/* 검색 기준 — 무엇을 입력하는 칸인지 알려 주므로 입력의 이름 앞에 온다[7.4.1]. */}
                    <label htmlFor={selectId} className="sr-only">
                        {typeLabel}
                    </label>
                    {/* 목록은 공통 드롭다운(SelectField)과 같고, 트리거만 테두리 · 바탕 없는 글자형이다.
                        md 이상 최소 폭 136 — 기준 이름 길이와 상관없이 입력 글자 · 오류 문구가 같은 선(160)에서 시작한다.
                        바탕 투명은 data-[slot=select-trigger]: 로 우선순위를 올려 theme · 다크 규칙을 이긴다[PB-06]. */}
                    <SelectField name="searchType" value={searchType} onValueChange={handleTypeChange}>
                        <SelectTrigger
                            id={selectId}
                            className="typo-title-l-medium text-foreground [&_svg]:text-foreground h-auto w-fit shrink-0 justify-start gap-1 border-0 px-1 shadow-none data-[slot=select-trigger]:bg-transparent data-[slot=select-trigger]:hover:bg-transparent md:min-w-34 [&_svg]:size-5 [&_svg]:opacity-100"
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
                    {/* 입력 상자(ClearableInput — 값 + 포커스일 때 지우기(X) 버튼)
                        · 평소: 테두리 · 바탕 투명. 테두리는 자리만 잡아 두어 오류 때 생겨도 크기가 그대로다.
                        · 오류(aria-invalid): InputGroup theme 이 테두리 · 면을 그린다 — 위 투명 값보다 우선한다.
                        · -ms-4: 상자 안쪽 여백(16)만큼 당겨 글자를 셀렉트에서 24 떨어진 자리에 맞춘다.
                          768 미만은 -me-4 도 줘서 상자를 카드 폭에 꽉 채운다. */}
                    {/* autoComplete="off" — 자동완성 목록 · 파란 자동완성 면을 끈다(테두리 없는 칸에 박스처럼 떠 보인다). */}
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
                        className="-ms-4 h-auto min-w-0 flex-1 border-transparent bg-transparent shadow-none max-md:-me-4 max-md:w-auto"
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
            {/* 버튼 줄 — 왼쪽 도움말(고른 기준의 note) · 오른쪽 [초기화] · [검색하기]. 768 미만은 도움말이 위, 버튼이 아래.
                도움말은 aria-describedby 로 입력에 연결된다. */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
                {selected?.note ? (
                    <p id={noteId} className="typo-body-l-regular text-foreground-subtle min-w-0 flex-1 break-keep">
                        {selected.note}
                    </p>
                ) : (
                    <span className="hidden flex-1 md:block" aria-hidden="true" />
                )}
                <div className="flex items-center justify-end gap-5">
                    {/* [초기화] — 기준 · 입력을 처음 상태로 되돌린다(handleReset). 조회 중에는 disabled
                    (포커스는 [검색하기]에 있어 꺼져도 잃지 않는다). */}
                    <Button type="reset" variant="text-underline" size="md" disabled={isSearching}>
                        <RotateCcw aria-hidden="true" />
                        {resetLabel}
                    </Button>
                    {/* [검색하기] — 기본 md 에서 굵기만 Medium, 아이콘 간격 4. 최소 폭 128 로 글자가 바뀌어도 흔들리지 않는다.
                    조회 중(isSearching): 돋보기 → 도는 표시(장식, 동작 줄이기면 멈춤[6.3.1]) · 글자 → searchingLabel · aria-busy[8.2.1].
                    disabled 는 쓰지 않는다 — 포커스가 빠져 다음 Tab 이 화면 맨 위로 간다[6.1.2].
                    aria-disabled 로 알리고 다시 제출은 handleSubmit 이 막는다. 흐리게도 하지 않는다(포커스 표시가 약해진다). */}
                    <Button
                        type="submit"
                        size="md"
                        className="min-w-32 gap-1 font-medium"
                        aria-disabled={isSearching || undefined}
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
