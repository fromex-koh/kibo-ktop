'use client'

import {PaidServiceSuspendDialog} from '@/components/composite/paid-service-suspend-dialog'
import {createCurrentPassCase} from '@/content/service/paid-service-current-pass'
import {toSuspendPass} from '@/content/service/paid-service-suspend'
import {getServiceToday} from '@/lib/service-today'

// 신청 팝업 단독 화면용 목업 연결 — 결제정보 케이스 1 의 이용권을 쓴다.
// [프론트엔드 연동] 현재 이용권 조회 응답으로 바꾸면 이 파일은 필요 없다.
const SuspendPreview = () => {
    const today = getServiceToday()
    return <PaidServiceSuspendDialog pass={toSuspendPass(createCurrentPassCase('1', today))} defaultOpen />
}

export default SuspendPreview
