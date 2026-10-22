import type {Metadata} from 'next'
import {OrgKbigxReportScreen} from '@/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/org-kbigx-report-screen'

export const metadata: Metadata = {title: '기업혁신성장 · 기업 선택(특허 있음)'}

// 기업혁신성장보고서 조회 결과 — 기업 선택(특허 있음) (org-k-bigx-report-innovation-growth-report-search-result-company-selected).
// [퍼블리싱 확인용] 조회 화면과 같은 화면의 '기업 선택(특허 있음)' 상태를 처음부터 보여 준다(목업).
// 케이스 목록은 InnovationGrowthReportScreen, 탭 화면은 OrgKbigxReportScreen 머리 주석을 본다.
const OrgInnovationGrowthReportCompanySelectedPage = () => <OrgKbigxReportScreen innovationPreview="company-selected" />

export default OrgInnovationGrowthReportCompanySelectedPage
