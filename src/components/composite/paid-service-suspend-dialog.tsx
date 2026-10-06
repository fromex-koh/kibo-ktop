'use client'

import {useState, type ReactNode} from 'react'
import {format, parseISO} from 'date-fns'
import {Field} from '@/components/composite/form-fields'
import {useFormTabsSubmit} from '@/components/composite/form-tabs-submit'
import {PaidServiceSuspendConfirmDialog} from '@/components/composite/paid-service-suspend-confirm-dialog'
import {InfoRow, PeriodText} from '@/components/composite/paid-service-suspend-info'
import {DatePicker, FormValuesProvider, useFieldValue} from '@/components/composite/form-values'
import {ListMarker} from '@/components/custom/list-marker'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {dialogInfoBodyClassName} from '@/components/theme/dialog.variants'
import {calculateSuspendResult, getBaseExpiry, getSelectableEndRange} from '@/lib/suspend-policy'
import {getServiceToday} from '@/lib/service-today'
import {cn} from '@/lib/utils'
import {
    SUSPEND_APPLY_TITLE,
    SUSPEND_CHANGE_TITLE,
    SUSPEND_NOTICE,
    type PaidServiceSuspendOutcome,
    type PaidServiceSuspendPass,
    type PaidServiceSuspendSummary,
    type PaidServiceSuspension,
} from '@/content/service/paid-service-suspend'

// 이용중지 신청 · 변경 입력 팝업 — 같은 팝업이고 suspension(신청해 둔 기간)을 넘기면 변경, 없으면 신청이다.
//   · 시작일: 진입한 날(오늘) 자동 기입, 읽기 전용. 종료일: 처음엔 비어 있고 범위는 lib/suspend-policy.ts(getSelectableEndRange).
//   · 요약(총 일수 · 적용 후 이용기간)은 lib/suspend-policy.ts 로 계산한다.
//   · 검사 · 오류 문구 · 포커스 이동은 다른 폼과 같은 useFormTabsSubmit 이 맡는다.
//
// 흐름: [이용중지 | 변경] → 입력 팝업 닫힘 → 확인 팝업(PaidServiceSuspendConfirmDialog) → [확인] 에서 onSubmit.
//   확인 팝업의 [취소] · 닫기 · Esc 는 확인 팝업만 닫는다.
//
// [프론트엔드 연동]
//   · onSubmit(values, outcome) 에 신청·변경 API 를 연결한다. values = {suspendStartDate, suspendEndDate}(yyyy-MM-dd).
//   · outcome(apply | change | release)으로 완료 알림(SUSPEND_COMPLETE_MESSAGE)을 띄운다. 알림은 이 컴포넌트 밖에서 띄운다 —
//     요청 뒤 카드가 바뀌면 이 팝업을 쥔 버튼이 사라지기 때문이다(호출 예: custom/paid-service-history.tsx).
//   · 요청 실패 안내는 아직 없다.

const FORM_ID = 'suspend-form'
const START_FIELD_ID = 'suspend-start'
const END_FIELD_ID = 'suspend-end'
const START_FIELD_NAME = 'suspendStartDate'
const END_FIELD_NAME = 'suspendEndDate'
const NO_VALUE = '-'
const DATE_FORMAT = 'yyyy-MM-dd'

type SuspendResult = ReturnType<typeof calculateSuspendResult>

type SuspendFormProps = {
    pass: PaidServiceSuspendPass
    suspension?: PaidServiceSuspension
    submitLabel: string
    /** 검사를 모두 통과했을 때 모인 값(칸의 name 이 키)과 적용 결과. */
    onValid: (values: Record<string, string>, result: SuspendResult) => void
}

// FormValuesProvider 안에서 쓴다. 본문과 CTA 는 Dialog 의 grid 행이라 감싸지 않고 조각 그대로 돌려준다.
const SuspendForm = ({pass, suspension, submitLabel, onValid}: SuspendFormProps) => {
    const {handleSubmit} = useFormTabsSubmit({defaultTab: FORM_ID})
    const today = getServiceToday()
    const startValue = useFieldValue(START_FIELD_NAME)?.value
    const endValue = useFieldValue(END_FIELD_NAME)?.value
    const startDate = startValue ? parseISO(startValue) : undefined
    const endDate = endValue ? parseISO(endValue) : undefined
    const current = suspension
        ? {startDate: parseISO(suspension.startDate), endDate: parseISO(suspension.endDate)}
        : undefined
    const baseExpiry = getBaseExpiry(parseISO(pass.endDate), current)
    const endRange = getSelectableEndRange(today, current)
    const result =
        startDate && endDate
            ? calculateSuspendResult({
                  baseExpiry,
                  pauseStart: current?.startDate ?? startDate,
                  isChange: Boolean(suspension),
                  period: {startDate, endDate},
                  today,
              })
            : undefined
    const extendedPeriod = result ? (
        <PeriodText
            startDate={format(result.resumeDate, DATE_FORMAT)}
            endDate={format(result.expiresAt, DATE_FORMAT)}
        />
    ) : (
        NO_VALUE
    )

    return (
        <>
            <div className={cn(dialogInfoBodyClassName, 'break-keep')}>
                {/* 오류는 브라우저 말풍선 대신 각 칸 밑에 보인다[7.4.2]. CTA 는 폼 밖에 있어 form 속성으로 잇는다. */}
                <form
                    id={FORM_ID}
                    noValidate
                    onSubmit={(event) => handleSubmit(event, (values) => result && onValid(values, result))}
                    className="flex flex-col gap-6"
                >
                    <section aria-labelledby="suspend-pass-title" className="flex flex-col gap-2">
                        <h3 id="suspend-pass-title" className="typo-title-m-bold text-foreground">
                            현재 이용권 정보
                        </h3>
                        <dl className="border-subtle-3 flex flex-col gap-3 rounded-md border p-6">
                            <InfoRow term="이용권명">{pass.name}</InfoRow>
                            <InfoRow term="현재 이용기간" isStacked>
                                <PeriodText startDate={pass.startDate} endDate={pass.endDate} />
                            </InfoRow>
                            <InfoRow term="잔여 조회횟수">
                                <span className="whitespace-nowrap">{pass.remainingCount}건</span>
                            </InfoRow>
                            <InfoRow term="잔여 일수">
                                <span className="whitespace-nowrap">{pass.remainingDays}일</span>
                            </InfoRow>
                        </dl>
                    </section>

                    <section aria-labelledby="suspend-setting-title" className="flex flex-col gap-4">
                        <h3 id="suspend-setting-title" className="typo-title-l-bold text-foreground">
                            이용중지 설정
                        </h3>
                        {/* 좁은 화면(sm 미만)은 필터(DateRangeField)의 모바일 구성과 같다 — 시작일 오른쪽에 ~, 종료일은 아래 전체 폭. */}
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-4 sm:flex sm:flex-row sm:gap-y-0">
                            <div className="min-w-0 sm:flex-1">
                                <Field id={START_FIELD_ID} label="이용중지 시작일">
                                    {/* 진입한 날(오늘)이 자동 기입되고 바꿀 수 없다(readOnly). 제출 값에는 담긴다. */}
                                    <DatePicker id={START_FIELD_ID} name={START_FIELD_NAME} readOnly />
                                </Field>
                            </div>
                            {/* 장식이라 읽지 않는다. mt-10 은 라벨 줄 높이만큼 내려 입력 칸에 맞춘다. */}
                            <span
                                aria-hidden="true"
                                className="typo-body-xl-regular text-foreground-subtle mt-10 flex h-12 shrink-0 items-center"
                            >
                                ~
                            </span>
                            <div className="col-span-2 min-w-0 sm:col-span-1 sm:flex-1">
                                <Field id={END_FIELD_ID} label="이용중지 종료일">
                                    <DatePicker
                                        id={END_FIELD_ID}
                                        name={END_FIELD_NAME}
                                        required
                                        minDate={endRange.min}
                                        maxDate={endRange.max}
                                    />
                                </Field>
                            </div>
                        </div>
                        <dl className="bg-primary-subtle border-navy-200 flex flex-col gap-2 rounded-md border p-6">
                            <InfoRow term="총 이용중지 일수">
                                <span className="whitespace-nowrap">{result ? `${result.days}일` : NO_VALUE}</span>
                            </InfoRow>
                            <InfoRow term="이용중지 적용 후 이용기간" isStacked>
                                {extendedPeriod}
                            </InfoRow>
                        </dl>
                    </section>

                    <section
                        aria-labelledby="suspend-notice-title"
                        className="bg-surface-subtle flex flex-col gap-2 rounded-sm p-5"
                    >
                        <h3 id="suspend-notice-title" className="typo-body-xl-bold text-foreground">
                            {SUSPEND_NOTICE.title}
                        </h3>
                        <ul className="typo-body-l-regular text-foreground-subtle flex list-none flex-col gap-2">
                            {SUSPEND_NOTICE.items.map((item) => (
                                <li key={item} className="flex">
                                    <ListMarker type="unordered-small" />
                                    <span className="min-w-0">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </form>
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="tertiary" size="xl">
                        취소
                    </Button>
                </DialogClose>
                <Button type="submit" form={FORM_ID} size="xl">
                    {submitLabel}
                </Button>
            </DialogFooter>
        </>
    )
}

type PaidServiceSuspendDialogProps = {
    pass: PaidServiceSuspendPass
    /** 신청해 둔 이용중지 기간. 있으면 변경, 없으면 신청이다. */
    suspension?: PaidServiceSuspension
    /** 팝업을 여는 버튼. */
    children?: ReactNode
    /** 트리거 없이 열어 둔다(팝업 단독 화면). */
    defaultOpen?: boolean
    /** 확인 팝업의 [확인]. 값: suspendStartDate · suspendEndDate(yyyy-MM-dd). 위 [프론트엔드 연동] 참고. */
    onSubmit?: (values: Record<string, string>, outcome: PaidServiceSuspendOutcome) => void
}

// 입력 팝업에서 검사를 통과해 확인 팝업을 기다리는 값과 적용 결과.
type PendingSuspend = {values: Record<string, string>; result: SuspendResult}

const toSummary = ({values, result}: PendingSuspend): PaidServiceSuspendSummary => ({
    startDate: values[START_FIELD_NAME] ?? '',
    endDate: values[END_FIELD_NAME] ?? '',
    days: result.days,
    resumeDate: format(result.resumeDate, DATE_FORMAT),
    expiresAt: format(result.expiresAt, DATE_FORMAT),
})

const PaidServiceSuspendDialog = ({
    pass,
    suspension,
    children,
    defaultOpen,
    onSubmit,
}: PaidServiceSuspendDialogProps) => {
    const [isOpen, setIsOpen] = useState(Boolean(defaultOpen))
    const [pending, setPending] = useState<PendingSuspend | null>(null)
    const today = getServiceToday()
    const isChange = Boolean(suspension)
    // 시작일 = 진입한 날(오늘, lib/service-today.ts).
    const startDate = format(today, DATE_FORMAT)

    // 입력 팝업은 닫고 확인 팝업을 연다.
    const handleValid = (values: Record<string, string>, result: SuspendResult) => {
        setIsOpen(false)
        setPending({values, result})
    }
    // 확인 팝업의 [확인] — 요청을 보낸다(변경에서 종료일을 오늘로 고르면 즉시 해제).
    const handleConfirm = () => {
        if (!pending) return

        const outcome = !isChange ? 'apply' : pending.result.isReleasedToday ? 'release' : 'change'
        onSubmit?.(pending.values, outcome)
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
                <DialogContent aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle>{isChange ? SUSPEND_CHANGE_TITLE : SUSPEND_APPLY_TITLE}</DialogTitle>
                    </DialogHeader>
                    {/* key 로 열 때마다 새로 채운다 — 닫기 전에 고른 날짜가 남지 않는다. */}
                    <FormValuesProvider key={`${isOpen}-${startDate}`} defaultValues={{[START_FIELD_NAME]: startDate}}>
                        <SuspendForm
                            pass={pass}
                            suspension={suspension}
                            submitLabel={isChange ? '변경' : '이용중지'}
                            onValid={handleValid}
                        />
                    </FormValuesProvider>
                </DialogContent>
            </Dialog>
            {pending ? (
                <PaidServiceSuspendConfirmDialog
                    mode={isChange ? 'change' : 'apply'}
                    summary={toSummary(pending)}
                    open
                    onOpenChange={(open) => {
                        if (!open) setPending(null)
                    }}
                    onConfirm={handleConfirm}
                />
            ) : null}
        </>
    )
}

export {PaidServiceSuspendDialog}
export type {PaidServiceSuspendDialogProps}
