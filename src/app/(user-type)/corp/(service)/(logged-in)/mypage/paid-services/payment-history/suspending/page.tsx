import type {Metadata} from 'next'
import {createCurrentPassCase} from '@/content/service/paid-service-current-pass'
import {getServiceToday} from '@/lib/service-today'
import {CorpPaidServicePaymentHistoryPageContent} from '../page'

export const metadata: Metadata = {title: '유료 서비스 관리(이용중지 중)'}

// 미리보기 전용 — 결제정보 ?case=2(이용중지 중). 연동 시 필요 없다.
const CorpPaidServiceSuspendingPage = () => (
    <CorpPaidServicePaymentHistoryPageContent currentPass={createCurrentPassCase('2', getServiceToday())} />
)

export default CorpPaidServiceSuspendingPage
