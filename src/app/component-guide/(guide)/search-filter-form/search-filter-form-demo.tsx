'use client'

import {useState} from 'react'
import {FormSubmitResult, formatSubmitResult} from '@/components/custom/form-submit-result'
import {Button} from '@/components/ui/button'
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

// 조회 필터 폼 데모 — 조회 시 FormData 를 읽어 결과로 보여주고, 초기화로 각 필드를 기본값으로 되돌린다.
// showResult=false 면 결과 패널 없이 폼 구조만 보여준다(Preview 용).
const SearchFilterFormDemo = ({showResult = true}: {showResult?: boolean}) => {
    const [result, setResult] = useState<string | null>(null)

    return (
        <div className="flex flex-col gap-4">
            <SearchFilterForm
                aria-label="목록 조회 필터"
                onSubmit={(event) => {
                    event.preventDefault()
                    const formData = new FormData(event.currentTarget)
                    setResult(formatSubmitResult(Object.fromEntries(formData.entries())))
                }}
                onReset={() => setResult(null)}
            >
                <SearchFilterFields>
                    <DateRangeField />
                    <CompanyNameField label="기업명" placeholder="내용을 입력하세요" />
                    <SearchFilterRow>
                        <SearchTypeField label="조회유형" defaultValue="" placeholder="선택해 주세요" />
                        <PaymentTypeField label="유/무료" defaultValue="" placeholder="선택해 주세요" />
                    </SearchFilterRow>
                </SearchFilterFields>

                <SearchFilterActions>
                    <Button type="reset" variant="outline" size="md">
                        초기화
                    </Button>
                    <Button type="submit" variant="default" size="md">
                        조회
                    </Button>
                </SearchFilterActions>
            </SearchFilterForm>

            {showResult ? (
                <div className="flex flex-col gap-1">
                    <span className="typo-body-l-medium text-foreground">제출된 FormData</span>
                    <FormSubmitResult
                        data={result}
                        emptyMessage="아직 조회하지 않았습니다."
                        emptyHint="조회를 누르면 각 필드 값이 JSON 으로 표시됩니다."
                    />
                </div>
            ) : null}
        </div>
    )
}

export default SearchFilterFormDemo
