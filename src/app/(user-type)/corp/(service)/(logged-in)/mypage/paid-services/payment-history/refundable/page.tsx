import type {Metadata} from 'next'
import {createCurrentPassCase} from '@/content/service/paid-service-current-pass'
import {getServiceToday} from '@/lib/service-today'
import {CorpPaidServicePaymentHistoryPageContent} from '../page'

export const metadata: Metadata = {title: '유료 서비스 관리(환불 가능)'}

// 미리보기 전용 — 결제정보 ?case=6(환불 가능). 연동 시 필요 없다.
const CorpPaidServiceRefundablePage = () => (
    <CorpPaidServicePaymentHistoryPageContent currentPass={createCurrentPassCase('6', getServiceToday())} />
)

export default CorpPaidServiceRefundablePage
