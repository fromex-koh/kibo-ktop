'use client'

import {addDays, format, parseISO} from 'date-fns'
import {PaidServiceSuspendConfirmDialog} from '@/components/composite/paid-service-suspend-confirm-dialog'
import {createCurrentPassCase} from '@/content/service/paid-service-current-pass'
import {calculateSuspendResult, getBaseExpiry} from '@/lib/suspend-policy'
import {getServiceToday} from '@/lib/service-today'

// 확인 팝업 단독 화면용 목업 연결 — 신청은 결제정보 케이스 1, 변경은 케이스 2 의 이용권에 샘플 종료일을 골랐다고 보고
// 적용 결과를 계산해 보여 준다.
// [프론트엔드 연동] 입력 팝업에서 넘어오는 값으로 대체되므로 이 파일은 필요 없다.
const DATE_FORMAT = 'yyyy-MM-dd'
const SAMPLE_END_DAYS_AFTER_TODAY = {apply: 9, change: 2} as const

const SuspendConfirmPreview = ({mode}: {mode: 'apply' | 'change'}) => {
    const today = getServiceToday()
    const pass = createCurrentPassCase(mode === 'apply' ? '1' : '2', today)
    const endDate = addDays(today, SAMPLE_END_DAYS_AFTER_TODAY[mode])
    const result = calculateSuspendResult({
        baseExpiry: getBaseExpiry(
            parseISO(pass.endDate),
            pass.suspension && {
                startDate: parseISO(pass.suspension.startDate),
                endDate: parseISO(pass.suspension.endDate),
            },
        ),
        pauseStart: parseISO(pass.suspension?.startDate ?? format(today, DATE_FORMAT)),
        isChange: mode === 'change',
        period: {startDate: today, endDate},
        today,
    })

    return (
        <PaidServiceSuspendConfirmDialog
            mode={mode}
            summary={{
                startDate: format(today, DATE_FORMAT),
                endDate: format(endDate, DATE_FORMAT),
                days: result.days,
                resumeDate: format(result.resumeDate, DATE_FORMAT),
                expiresAt: format(result.expiresAt, DATE_FORMAT),
            }}
            defaultOpen
        />
    )
}

export default SuspendConfirmPreview
