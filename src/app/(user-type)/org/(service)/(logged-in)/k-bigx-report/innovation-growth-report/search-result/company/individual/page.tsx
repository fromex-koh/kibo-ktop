import type {Metadata} from 'next'
import {OrgKbigxReportScreen} from '@/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/org-kbigx-report-screen'

export const metadata: Metadata = {title: '기업혁신성장 · [타사조회 · 차감 없음] 개인기업 · 특허 없음 · 재무정보 있음'}

// 기업혁신성장보고서 조회 결과 — [타사조회 · 차감 없음] 개인기업 · 특허 없음 · 재무정보 있음 (org-k-bigx-report-innovation-growth-report-search-result-company-individual).
// [퍼블리싱 확인용] 개인기업(법인번호 없음 → 사업자번호 표시, 개인사업자는 특허 정보 미제공)을 고른 상태를 처음부터 보여 준다(목업).
// 케이스 목록은 InnovationGrowthReportScreen, 탭 화면은 OrgKbigxReportScreen 머리 주석을 본다.
const OrgInnovationGrowthReportCompanyIndividualPage = () => (
    <OrgKbigxReportScreen innovationPreview="company-individual" />
)

export default OrgInnovationGrowthReportCompanyIndividualPage
