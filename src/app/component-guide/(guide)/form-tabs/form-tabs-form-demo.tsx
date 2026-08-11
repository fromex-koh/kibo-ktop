'use client'

import {useState, type SubmitEvent} from 'react'
import {Button} from '@/components/ui/button'
import {FormTabs} from '@/components/composite/form-tabs'
import {useFormTabsSubmit} from '@/components/composite/form-tabs-submit'
import {FormValuesProvider, useFormValues} from '@/components/composite/form-values'
import {SELF_DIAGNOSIS_FORM_TABS} from '@/components/composite/self-diagnosis-form-tabs'
import {COMPANY_ETC_DEFAULT_VALUES} from '@/components/composite/company-etc-form'

// 실제 화면과 같은 탭 구성으로 값이 모이는지 확인하는 예시.
// 제출 전에도 값이 한 곳(FormValues)에 쌓이는 걸 볼 수 있고, 제출하면 먼저 검사한 뒤
// 모두 통과했을 때만 FormData 결과를 보여준다.

// 값이 비어 있지 않은 것만 — 채워 넣은 것만 세어야 "모이고 있다" 가 눈에 보인다.
const getFilledValues = (values: Record<string, string>) =>
    Object.fromEntries(Object.entries(values).filter(([, value]) => value !== ''))

const OUTPUT_CLASS_NAME =
    'typo-caption-regular bg-surface border-border text-foreground max-h-80 min-h-10 overflow-auto rounded-md border px-3 py-2 font-mono whitespace-pre'
const EMPTY_CLASS_NAME =
    'typo-body-l-regular bg-surface border-border text-muted-foreground min-h-10 rounded-md border px-3 py-2'

const ValueOutput = ({values, emptyMessage}: {values: Record<string, string> | null; emptyMessage: string}) => (
    <output className={values ? OUTPUT_CLASS_NAME : EMPTY_CLASS_NAME} aria-live="polite">
        {values ? JSON.stringify(values, null, 2) : emptyMessage}
    </output>
)

// 제출 전 상태 — 입력하는 즉시 여기 쌓인다.
const CollectedValues = () => {
    const {values} = useFormValues()
    const filled = getFilledValues(values)
    const count = Object.keys(filled).length

    return (
        <div className="flex flex-col gap-2">
            <p className="typo-body-l-medium text-foreground">
                모이는 중 — 지금까지 {count}개
                <span className="typo-body-l-regular text-muted-foreground">
                    {' '}
                    (탭을 옮기거나 창 크기를 바꿔도 그대로 남습니다)
                </span>
            </p>
            <ValueOutput
                values={count ? filled : null}
                emptyMessage="아직 입력한 값이 없습니다. 아무 탭에나 값을 넣어 보세요."
            />
        </div>
    )
}

const SubmitDemo = () => {
    // 검사·메시지·걸린 칸으로 이동은 공용 관문이 맡는다 — 이 화면은 통과한 값을 그려 보여주기만 한다.
    const {currentTab, setCurrentTab, handleSubmit} = useFormTabsSubmit({
        defaultTab: SELF_DIAGNOSIS_FORM_TABS[0]?.value ?? '',
    })
    const [submittedData, setSubmittedData] = useState<Record<string, string> | null>(null)

    const submit = (event: SubmitEvent<HTMLFormElement>) => {
        setSubmittedData(null)
        handleSubmit(event, setSubmittedData)
    }

    return (
        <form className="flex flex-col gap-6" autoComplete="off" noValidate onSubmit={submit}>
            {/* FormTabs 는 흰 카드가 곧 컴포넌트라, 실제 화면과 같은 페이지 배경 위에 올려 보여준다. */}
            <div className="bg-background border-subtle-3 rounded-md border p-6">
                <FormTabs items={SELF_DIAGNOSIS_FORM_TABS} value={currentTab} onValueChange={setCurrentTab} />
            </div>
            <CollectedValues />
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" variant="default" size="sm">
                        입력 내용 확인
                    </Button>
                    <span className="typo-body-l-regular text-muted-foreground">
                        먼저 검사하고, 모두 통과했을 때만 값을 보여줍니다. 걸린 칸에는 그 칸 밑에 메시지가 붙습니다.
                    </span>
                </div>
                <ValueOutput
                    values={submittedData}
                    emptyMessage="아직 제출하지 않았습니다. 검사를 모두 통과하면 여기에 값이 나옵니다."
                />
            </div>
        </form>
    )
}

const FormTabsFormDemo = () => (
    // 값은 FormTabs 바깥(FormValuesProvider)에 모인다 — 화면 폭이 바뀌어 FormTabs 안쪽이 다시 그려져도
    // 값이 상태에서 복원된다. 폼 자체는 평범한 <form> 이라 제출은 FormData 그대로다.
    <FormValuesProvider defaultValues={COMPANY_ETC_DEFAULT_VALUES}>
        <SubmitDemo />
    </FormValuesProvider>
)

export default FormTabsFormDemo
