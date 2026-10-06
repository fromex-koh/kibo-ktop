import type {Metadata} from 'next'
import {createCurrentPassCase} from '@/content/service/paid-service-current-pass'
import {getServiceToday} from '@/lib/service-today'
import {CorpPaidServicePaymentHistoryPageContent} from '../page'

export const metadata: Metadata = {title: '유료 서비스 관리(이용중지 이력 있음)'}

// 미리보기 전용 — 결제정보 ?case=3(이용중지 이력 있음). 연동 시 필요 없다.
const CorpPaidServiceSuspensionHistoryPage = () => (
    <CorpPaidServicePaymentHistoryPageContent currentPass={createCurrentPassCase('3', getServiceToday())} />
)

export default CorpPaidServiceSuspensionHistoryPage
