'use client'

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

// 케이스 A — 최소 구성: 조회기간 + 단일 Select(전체 폭) + 조회. (Figma 첫 번째 프레임)
export const MinimalFilterCaseDemo = () => (
    <SearchFilterForm aria-label="간단 조회 필터" onSubmit={(event) => event.preventDefault()}>
        <SearchFilterFields>
            <DateRangeField />
            <PaymentTypeField label="진행상태" defaultValue="all" />
        </SearchFilterFields>
        <SearchFilterActions>
            <Button type="submit" variant="default" size="lg">
                조회
            </Button>
        </SearchFilterActions>
    </SearchFilterForm>
)

// 케이스 B — 입력 + 한 줄 2열 Select(placeholder). (Figma 두·세 번째 프레임)
// SearchFilterRow 로 조회유형·유/무료를 md 이상에서 나란히 두고, 기본값을 비워 "선택해주세요"를 노출한다.
export const TwoColumnFilterCaseDemo = () => (
    <SearchFilterForm aria-label="상세 조회 필터" onSubmit={(event) => event.preventDefault()} onReset={() => {}}>
        <SearchFilterFields>
            <DateRangeField />
            <CompanyNameField label="기업명" placeholder="내용을 입력하세요" />
            <SearchFilterRow>
                <SearchTypeField label="조회유형" defaultValue="" placeholder="선택해주세요" />
                <PaymentTypeField label="유/무료" defaultValue="" placeholder="선택해주세요" />
            </SearchFilterRow>
        </SearchFilterFields>
        <SearchFilterActions>
            <Button type="reset" variant="outline" size="lg">
                초기화
            </Button>
            <Button type="submit" variant="default" size="lg">
                조회
            </Button>
        </SearchFilterActions>
    </SearchFilterForm>
)
