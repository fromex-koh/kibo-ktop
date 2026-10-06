'use client'

import {useState} from 'react'
import {FormSubmitResult, formatSubmitResult} from '@/components/custom/form-submit-result'
import {SelectSearchForm, type SelectSearchSubmit} from '@/components/composite/select-search-form'

// 가이드 데모 — 검색하면 0.8초 동안 '검색 중' 상태를 보인 뒤 onSearch 로 넘어온 값을 보여 준다.
// 초기화 버튼은 폼에 이미 있어 따로 두지 않는다 — onReset 에서 결과를 비운다.
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

// DEMO_OPTIONS 의 pattern 을 통과하는 값 — 하이픈은 있어도 없어도 된다.
const DEMO_EXAMPLES = [
    {label: '특허등록번호', values: '10-1234567-0000 · 1234567'},
    {label: '특허출원번호', values: '10-2026-1234567 · 123456789'},
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
        <div className="flex flex-col gap-4">
            {/* 형식을 모르면 검사에 계속 걸린다 — 통과하는 예시 값을 기준별로 먼저 보여 준다. */}
            <dl className="border-foreground-subtle/30 bg-pastel-neutral/40 text-label-foreground typo-body-l-regular grid gap-x-4 gap-y-1 rounded-sm border p-5 sm:grid-cols-[max-content_minmax(0,1fr)]">
                <dt className="typo-body-l-bold text-foreground sm:col-span-2">테스트용 예시 값</dt>
                {DEMO_EXAMPLES.map((example) => (
                    <div key={example.label} className="contents">
                        <dt>{example.label}</dt>
                        <dd>
                            <code className="text-foreground font-mono">{example.values}</code>
                        </dd>
                    </div>
                ))}
            </dl>
            <div className="bg-background rounded-xl p-4 md:p-6">
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
            </div>
            <FormSubmitResult
                data={lastSearch ? formatSubmitResult(lastSearch) : null}
                emptyMessage="아직 검색하지 않았습니다."
                emptyHint="형식에 맞는 번호를 넣고 [검색하기]를 누르면 onSearch 로 넘어온 값이 표시됩니다."
            />
        </div>
    )
}

export {SelectSearchFormDemo}
