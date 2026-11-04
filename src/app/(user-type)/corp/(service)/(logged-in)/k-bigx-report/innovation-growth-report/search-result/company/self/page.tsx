import type {Metadata} from 'next'
import {InnovationGrowthReportScreen} from '@/components/custom/innovation-growth-report-screen'

export const metadata: Metadata = {title: '기업혁신성장 · [자사조회 · 차감 없음] 특허 · 재무정보 유무 무관'}

// 기업혁신성장보고서 조회 결과 — [자사조회 · 차감 없음] 특허 · 재무정보 유무 무관 (corp-k-bigx-report-innovation-growth-report-search-result-company-self).
// [퍼블리싱 확인용] 조회 화면과 같은 화면의 이 케이스를 처음부터 보여 준다(목업).
// 케이스 목록과 연동 안내는 InnovationGrowthReportScreen 머리 주석을 본다.
const CorpInnovationGrowthReportCompanySelfPage = () => (
    <InnovationGrowthReportScreen userType="corp" preview="company-self" />
)

export default CorpInnovationGrowthReportCompanySelfPage
