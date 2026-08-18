import type {Metadata} from 'next'
import {BulkDataRequestScreen} from '../../bulk-data-request-screen'

export const metadata: Metadata = {title: '대량정보 조회 신청'}

// 기관 일괄평가 창업용 (3) 대량정보 조회 신청 — 화면 구성은 공유 셸이 갖는다.
const OrgBatchStartupBulkDataRequestPage = () => <BulkDataRequestScreen model="startup" />

export default OrgBatchStartupBulkDataRequestPage
