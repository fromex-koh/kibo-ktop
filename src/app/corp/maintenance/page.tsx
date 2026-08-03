import type {Metadata} from 'next'
import FullPageMaintenance from '@/components/custom/full-page-maintenance'

export const metadata: Metadata = {title: '정기점검 화면'}

// 퍼블리싱 인덱스에서 직접 확인하는 정기점검 화면 미리보기.
// 실제 점검 전환 로직은 서비스 구현 시 별도로 연결한다.
// 기업·기관이 함께 쓰는 공통 화면이라 /corp와 /org 양쪽에 같은 화면을 둔다 — 화면정의서 본수를
// 경로별로 세기 위한 중복일 뿐 내용은 유형에 따라 갈리지 않는다. 이 화면은 Header 없이
// 전체 화면만 렌더링하므로 로그인 전/후 구분 자체가 없다.
const CorpMaintenancePreviewPage = () => <FullPageMaintenance />

export default CorpMaintenancePreviewPage
