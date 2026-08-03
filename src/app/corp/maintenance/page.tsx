import type {Metadata} from 'next'
import FullPageMaintenance from '@/components/custom/full-page-maintenance'

export const metadata: Metadata = {title: '정기점검 화면'}

// 퍼블리싱 인덱스에서 직접 확인하는 정기점검 화면 미리보기.
// 실제 점검 전환 로직은 서비스 구현 시 별도로 연결한다.
const CorpMaintenancePreviewPage = () => <FullPageMaintenance />

export default CorpMaintenancePreviewPage
