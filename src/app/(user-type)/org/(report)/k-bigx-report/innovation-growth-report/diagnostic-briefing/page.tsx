import type {Metadata, Viewport} from 'next'
import {
    InnovationGrowthReportPage,
    type InnovationReportSearchParams,
} from '@/components/custom/innovation-growth-report-page'
import {getInnovationReportViewport} from '@/content/service/k-bigx-innovation-report'

export const metadata: Metadata = {title: 'K-BIGx 기업혁신성장 보고서'}

// K-BIGx 보고서 · 보고서 결과(웹뷰) (org-k-bigx-report-innovation-growth-report-diagnostic-briefing) — 보고서 문서 한 페이지. 진단브리핑부터 활동성정보까지 탭은 ?tab= 으로 바뀐다.
// 쿼리 · 새 창 · 스켈레톤 규칙은 components/custom/innovation-growth-report-page.tsx 참고.

type OrgDiagnosticBriefingPageProps = {searchParams: InnovationReportSearchParams}

export const generateViewport = ({searchParams}: OrgDiagnosticBriefingPageProps): Promise<Viewport> =>
    getInnovationReportViewport(searchParams)

const OrgDiagnosticBriefingPage = ({searchParams}: OrgDiagnosticBriefingPageProps) => (
    <InnovationGrowthReportPage searchParams={searchParams} />
)

export default OrgDiagnosticBriefingPage
