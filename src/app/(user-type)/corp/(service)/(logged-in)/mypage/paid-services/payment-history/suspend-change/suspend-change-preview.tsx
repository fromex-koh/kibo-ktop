'use client'

import {PaidServiceSuspendDialog} from '@/components/composite/paid-service-suspend-dialog'
import {createCurrentPassCase} from '@/content/service/paid-service-current-pass'
import {toSuspendPass} from '@/content/service/paid-service-suspend'
import {getServiceToday} from '@/lib/service-today'

// 변경 팝업 단독 화면용 목업 연결 — 결제정보 케이스 2(이용중지 중)의 이용권과 이용중지 기간을 쓴다.
//
// [프론트엔드 연동] 현재 이용권 조회 응답의 이용권 · 이용중지 기간으로 바꾸면 이 파일은 필요 없다.
const SuspendChangePreview = () => {
    const today = getServiceToday()
    const pass = createCurrentPassCase('2', today)

    return <PaidServiceSuspendDialog pass={toSuspendPass(pass)} suspension={pass.suspension} defaultOpen />
}

export default SuspendChangePreview
