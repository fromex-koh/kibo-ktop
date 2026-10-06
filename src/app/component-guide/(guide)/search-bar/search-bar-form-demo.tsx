'use client'

import {
    FormResetButton,
    FormSubmitResult,
    formatSubmitResult,
    withFormReset,
    type FormResetProps,
} from '@/components/custom/form-submit-result'
import {useState} from 'react'
import {SearchBar} from '@/components/composite/search-bar'
import {Button} from '@/components/ui/button'
import {Field, FieldError} from '@/components/ui/field'

const SearchBarFormDemoBody = ({onReset}: FormResetProps) => {
    const [keyword, setKeyword] = useState('')
    const [keywordError, setKeywordError] = useState(false)
    const [submittedData, setSubmittedData] = useState<string | null>(null)

    return (
        <form
            onReset={onReset}
            className="flex flex-col gap-4"
            autoComplete="off"
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

                setSubmittedData(formatSubmitResult(Object.fromEntries(new FormData(event.currentTarget))))
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
                <div className="flex items-center gap-3">
                    <Button type="submit" variant="default" size="sm" className="w-fit">
                        검색 조건 확인
                    </Button>
                    <FormResetButton />
                </div>
                <FormSubmitResult data={submittedData} />
            </div>
        </form>
    )
}

const SearchBarFormDemo = withFormReset(SearchBarFormDemoBody)

export default SearchBarFormDemo
