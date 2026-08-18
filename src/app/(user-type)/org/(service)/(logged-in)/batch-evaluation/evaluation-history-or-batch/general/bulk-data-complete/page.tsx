import type {Metadata} from 'next'
import {BulkDataCompleteScreen} from '../../bulk-data-complete-screen'

export const metadata: Metadata = {title: '대량정보 조회 신청 완료'}

// 기관 일괄평가 일반용 (4) 대량정보 조회 신청 완료 — 화면 구성은 공유 셸이 갖는다.
const OrgBatchGeneralBulkDataCompletePage = () => <BulkDataCompleteScreen model="general" />

export default OrgBatchGeneralBulkDataCompletePage
