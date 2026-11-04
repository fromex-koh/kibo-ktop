import type {Metadata} from 'next'
import {InnovationGrowthReportScreen} from '@/components/custom/innovation-growth-report-screen'

export const metadata: Metadata = {title: '기업혁신성장 · [타사조회 · 생성불가] 특허 없음 · 재무정보 없음'}

// 기업혁신성장보고서 조회 결과 — [타사조회 · 생성불가] 특허 없음 · 재무정보 없음 (corp-k-bigx-report-innovation-growth-report-search-result-company-blocked).
// [퍼블리싱 확인용] 조회 화면과 같은 화면의 이 케이스를 처음부터 보여 준다(목업).
// 케이스 목록과 연동 안내는 InnovationGrowthReportScreen 머리 주석을 본다.
const CorpInnovationGrowthReportCompanyBlockedPage = () => (
    <InnovationGrowthReportScreen userType="corp" preview="company-blocked" />
)

export default CorpInnovationGrowthReportCompanyBlockedPage
