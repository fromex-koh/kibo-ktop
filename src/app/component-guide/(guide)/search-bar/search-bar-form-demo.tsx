'use client'

import {useState} from 'react'
import {SearchBar} from '@/components/composite/search-bar'
import {Button} from '@/components/ui/button'
import {Field, FieldError} from '@/components/ui/field'

const SearchBarFormDemo = () => {
    const [keyword, setKeyword] = useState('')
    const [keywordError, setKeywordError] = useState(false)
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')

    return (
        <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={(event) => {
                event.preventDefault()
                const nextError = keyword.trim() === ''
                setKeywordError(nextError)

                if (nextError) {
                    const input = event.currentTarget.elements.namedItem('keyword')
                    if (input instanceof HTMLInputElement) input.focus()
                    return
                }

                setSubmittedData(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))))
            }}
        >
            <Field data-invalid={keywordError || undefined} className="max-w-147">
                <SearchBar
                    id="form-search-keyword"
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
                    aria-describedby={keywordError ? 'form-search-keyword-error' : undefined}
                />
                {keywordError ? <FieldError id="form-search-keyword-error">검색어를 입력해 주세요.</FieldError> : null}
            </Field>

            <div className="flex flex-col gap-2">
                <Button type="submit" variant="default" size="md" className="w-fit">
                    검색 조건 확인
                </Button>
                <output
                    className="typo-body-l-regular bg-surface border-border text-muted-foreground min-h-10 rounded-md border px-3 py-2 break-all"
                    aria-live="polite"
                >
                    {submittedData}
                </output>
            </div>
        </form>
    )
}

export default SearchBarFormDemo
