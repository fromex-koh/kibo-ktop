'use client'

import {NoticeDialog} from '@/components/composite/notice-dialog'
import {PaidServiceSuspendDialog} from '@/components/composite/paid-service-suspend-dialog'
import {Button} from '@/components/ui/button'
import {
    SUSPEND_UNAVAILABLE_MESSAGE,
    toSuspendPass,
    type PaidServiceSuspendOutcome,
    type PaidServiceSuspension,
} from '@/content/service/paid-service-suspend'

// 현재 이용권 카드의 [이용중지] · [이용중지 변경] 버튼 — 이용권 상태에 맞는 팝업을 연결한다. 위에서부터 먼저 맞는 것이 적용된다.
//   1. 무료 지급                    → [이용중지] → 불가 안내
//   2. 이용중지 중(suspension 있음)   → [이용중지 변경] → 변경 팝업
//   3. 이용중지 이력 있음(재개 뒤)     → 버튼 없음(이용중지는 이용권당 1회)
//   4. 잔여 이용기간 1일 이하         → [이용중지] → 불가 안내
//   5. 그 밖의 이용중                → [이용중지] → 신청 팝업
// 판정은 이용권이 들고 온 값만 쓴다(오늘을 다시 계산하지 않는다).
// [프론트엔드 연동] 1 · 4 의 불가 판정은 서버 값으로 바꿔도 된다. 제출은 onSubmit 으로 받는다.

const UNAVAILABLE_TITLE = '이용중지 불가 안내'

type PaidServiceSuspendActionPass = {
    id: string
    grade: string
    startDate: string
    endDate: string
    remaining: number
    remainingDays: number
    isFree?: boolean
    suspension?: PaidServiceSuspension
    hasSuspendedBefore?: boolean
}

type PaidServiceSuspendActionProps = {
    pass: PaidServiceSuspendActionPass
    /** 확인 팝업에서 [확인] 을 눌렀을 때(값의 키: suspendStartDate · suspendEndDate). */
    onSubmit?: (id: string, values: Record<string, string>, outcome: PaidServiceSuspendOutcome) => void
}

const PaidServiceSuspendAction = ({pass, onSubmit}: PaidServiceSuspendActionProps) => {
    const suspendPass = toSuspendPass(pass)
    const handleSubmit = (values: Record<string, string>, outcome: PaidServiceSuspendOutcome) =>
        onSubmit?.(pass.id, values, outcome)

    if (pass.isFree) {
        return (
            <NoticeDialog title={UNAVAILABLE_TITLE} message={SUSPEND_UNAVAILABLE_MESSAGE.freePass}>
                <Button type="button" variant="tertiary" size="sm">
                    이용중지
                </Button>
            </NoticeDialog>
        )
    }

    if (pass.suspension) {
        return (
            <PaidServiceSuspendDialog pass={suspendPass} suspension={pass.suspension} onSubmit={handleSubmit}>
                <Button type="button" variant="tertiary" size="sm">
                    이용중지 변경
                </Button>
            </PaidServiceSuspendDialog>
        )
    }

    if (pass.hasSuspendedBefore) return null

    if (pass.remainingDays <= 1) {
        return (
            <NoticeDialog title={UNAVAILABLE_TITLE} message={SUSPEND_UNAVAILABLE_MESSAGE.remainingDay}>
                <Button type="button" variant="tertiary" size="sm">
                    이용중지
                </Button>
            </NoticeDialog>
        )
    }

    return (
        <PaidServiceSuspendDialog pass={suspendPass} onSubmit={handleSubmit}>
            <Button type="button" variant="tertiary" size="sm">
                이용중지
            </Button>
        </PaidServiceSuspendDialog>
    )
}

export {PaidServiceSuspendAction}
export type {PaidServiceSuspendActionPass, PaidServiceSuspendActionProps}
