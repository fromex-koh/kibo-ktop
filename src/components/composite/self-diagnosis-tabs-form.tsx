'use client'

import type {ReactNode, SubmitEvent} from 'react'
import {useRouter} from 'next/navigation'
import {COMPANY_ETC_DEFAULT_VALUES} from '@/components/composite/company-etc-form'
import {FormTabs} from '@/components/composite/form-tabs'
import {useFormTabsSubmit} from '@/components/composite/form-tabs-submit'
import {FormValuesProvider} from '@/components/composite/form-values'
import {SELF_DIAGNOSIS_FORM_TABS} from '@/components/composite/self-diagnosis-form-tabs'
import type {FormTabItem} from '@/components/composite/form-tabs'

// 자가진단 입력 폼. 하단 CTA는 formId로 이 폼과 연결된다.
// 모든 탭의 검사를 통과하면 값을 콘솔에 찍고 nextHref 로 이동한다 — 저장 API 는 그 console.log 자리에 붙인다.
type SelfDiagnosisTabsFormProps = {
    formId: string
    // 모바일에서 섹션 줄과 함께 고정되는 내용(단계·제목). 그 폭에서는 화면이 제목을 따로 두지 않는다.
    stickyHeader?: ReactNode
    // 검사를 통과했을 때 갈 다음 단계. 넘기지 않으면 이동하지 않는다.
    nextHref?: string
    // 탭 구성. 기본은 기업 자가진단이고, 기관 개별평가는 기업정보 탭만 다른 한 벌을 넘긴다.
    tabs?: readonly FormTabItem[]
    // 화면을 열 때 이미 들어 있는 값(수량 칸의 0 등). 탭 구성과 짝이라 그 한 벌과 함께 넘긴다.
    // 넘기지 않으면 기업 자가진단의 기본값(기업 기타 정보의 0)을 쓴다.
    defaultValues?: Record<string, string>
}

const SelfDiagnosisTabsFormFields = ({
    formId,
    stickyHeader,
    nextHref,
    tabs = SELF_DIAGNOSIS_FORM_TABS,
}: SelfDiagnosisTabsFormProps) => {
    const router = useRouter()
    const {currentTab, setCurrentTab, handleSubmit} = useFormTabsSubmit({
        defaultTab: tabs[0]?.value ?? '',
    })

    const submit = (event: SubmitEvent<HTMLFormElement>) => {
        handleSubmit(event, (values) => {
            // [프론트엔드 연동] 이 줄을 저장 API 호출로 바꾼다 — 성공한 뒤에 다음 단계로 보낸다.
            console.log('[기업·기술정보 입력] 제출 데이터', values)
            if (nextHref) router.push(nextHref)
        })
    }

    return (
        <form id={formId} autoComplete="off" noValidate onSubmit={submit}>
            {/* 탭과 스텝 헤더 사이는 60px(시안) — 바깥 gap-y-10(40) 에 20 을 더한다.
                모바일에는 그 헤더가 없고 고정 줄이 화면 위쪽에 붙으므로 간격을 두지 않는다. */}
            <FormTabs
                items={tabs}
                value={currentTab}
                onValueChange={setCurrentTab}
                stickyHeader={stickyHeader}
                className="md:mt-5"
            />
        </form>
    )
}

// 탭을 이동해도 입력값이 유지되도록 공용 폼 상태를 연결한다.
const SelfDiagnosisTabsForm = ({
    formId,
    stickyHeader,
    nextHref,
    tabs,
    defaultValues = COMPANY_ETC_DEFAULT_VALUES,
}: SelfDiagnosisTabsFormProps) => (
    <FormValuesProvider defaultValues={defaultValues}>
        <SelfDiagnosisTabsFormFields formId={formId} stickyHeader={stickyHeader} nextHref={nextHref} tabs={tabs} />
    </FormValuesProvider>
)

export {SelfDiagnosisTabsForm}
export type {SelfDiagnosisTabsFormProps}
