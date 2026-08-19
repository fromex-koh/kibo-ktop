'use client'

import type {ReactNode} from 'react'
import {SelfDiagnosisTabsForm} from '@/components/composite/self-diagnosis-tabs-form'
import {
    INVESTMENT_MODEL_DEFAULT_VALUES,
    INVESTMENT_MODEL_FORM_TABS,
} from '@/components/composite/self-diagnosis-form-tabs'
import {SELECTED_INDUSTRY_CODE_FIELD, isManufacturingIndustryCode} from '@/constants/technology-evaluation'

// 투자모형 2단계의 입력 폼 — 화면(page)은 서버 모듈이라 "값에 따라 갈 곳을 정하는" 함수를 폼에 바로
// 넘길 수 없다(서버에서 클라이언트로 함수를 넘기지 못한다). 그 판단만 이 얇은 클라이언트 조각이 맡는다.
//
// 체크리스트는 [기업정보] 탭에서 고른 업종코드에 따라 갈린다 — 제조(KSIC 중분류 10~34)면 제조용,
// 그 밖이면 서비스용 화면으로 간다. 아직 고르지 않았다면 서비스 쪽으로 두는데, 업종코드는 필수라
// 실제로는 검사에서 먼저 걸리고 여기까지 오는 것은 값이 있는 경우다.
const CHECKLIST_MANUFACTURING_PATH = '/corp/technology-evaluation/investment-model/checklist/manufacturing'
const CHECKLIST_SERVICE_PATH = '/corp/technology-evaluation/investment-model/checklist/service'

const resolveChecklistPath = (values: Record<string, string>) =>
    isManufacturingIndustryCode(values[SELECTED_INDUSTRY_CODE_FIELD] ?? '')
        ? CHECKLIST_MANUFACTURING_PATH
        : CHECKLIST_SERVICE_PATH

const ChecklistStepForm = ({formId, stickyHeader}: {formId: string; stickyHeader: ReactNode}) => (
    <SelfDiagnosisTabsForm
        formId={formId}
        stickyHeader={stickyHeader}
        nextHref={resolveChecklistPath}
        tabs={INVESTMENT_MODEL_FORM_TABS}
        defaultValues={INVESTMENT_MODEL_DEFAULT_VALUES}
    />
)

export default ChecklistStepForm
