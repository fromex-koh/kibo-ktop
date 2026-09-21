'use client'

import {useState} from 'react'
import {SelectSearchForm, type SelectSearchSubmit} from '@/components/composite/select-search-form'

// 가이드 데모 — 특허 등급조회와 같은 기준 · 형식을 쓰고, 검색하면 0.8초 동안 '검색 중' 상태를 보인 뒤 결과를 적는다.
const DEMO_OPTIONS = [
    {
        value: 'registration',
        label: '특허등록번호',
        pattern: /^(\d{2}-?\d{7}-?\d{4}|\d{7})$/,
        placeholder: '(로그인후) 13자리 또는 7자리 등록·출원번호를 입력하세요',
        note: '※ 검색대상 : 2026-04-01이전 등록 및 공고된 특허정보',
    },
    {
        value: 'application',
        label: '특허출원번호',
        pattern: /^(\d{2}-?\d{4}-?\d{7}|\d{9})$/,
        placeholder: '13자리 또는 9자리 등록번호를 입력하세요',
        note: '※ 출원상태인 특허는 평가제외',
    },
] as const

const DEMO_DELAY_MS = 800

type SelectSearchFormDemoProps = {
    /** 기준별 기본값을 넣은 데모인지. */
    withDefaults?: boolean
}

const SelectSearchFormDemo = ({withDefaults = false}: SelectSearchFormDemoProps) => {
    const [isSearching, setIsSearching] = useState(false)
    const [lastSearch, setLastSearch] = useState<SelectSearchSubmit | null>(null)

    const handleSearch = (search: SelectSearchSubmit) => {
        setIsSearching(true)
        window.setTimeout(() => {
            setIsSearching(false)
            setLastSearch(search)
        }, DEMO_DELAY_MS)
    }

    return (
        <div className="bg-background flex flex-col gap-4 rounded-xl p-4 md:p-6">
            <SelectSearchForm
                options={DEMO_OPTIONS}
                defaultValues={
                    withDefaults ? {registration: '10-1111111-0000', application: '10-2026-1111111'} : undefined
                }
                emptyError="특허등록번호 또는 특허출원번호를 입력해주세요."
                onSearch={handleSearch}
                onReset={() => setLastSearch(null)}
                isSearching={isSearching}
            />
            <p className="typo-body-l-regular text-foreground-subtle" aria-live="polite">
                {lastSearch
                    ? `onSearch 호출 — type: ${lastSearch.type} · value: ${lastSearch.value}`
                    : '형식에 맞는 번호를 넣고 [검색하기]를 누르면 onSearch 로 넘어가는 값이 여기에 보입니다.'}
            </p>
        </div>
    )
}

export {SelectSearchFormDemo}
