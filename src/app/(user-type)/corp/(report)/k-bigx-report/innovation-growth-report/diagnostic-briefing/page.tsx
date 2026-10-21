import type {Metadata, Viewport} from 'next'
import {
    InnovationGrowthReportPage,
    type InnovationReportSearchParams,
} from '@/components/custom/innovation-growth-report-page'
import {getInnovationReportViewport} from '@/content/service/k-bigx-innovation-report'
import {KBIGX_PRINT_CORP_PATH} from '@/content/service/k-bigx-print-report'

export const metadata: Metadata = {title: 'K-BIGx 기업혁신성장 보고서'}

// K-BIGx 보고서 · 보고서 결과(웹뷰) (corp-k-bigx-report-innovation-growth-report-diagnostic-briefing) — 보고서 문서 한 페이지. 진단브리핑부터 활동성정보까지 탭은 ?tab= 으로 바뀐다.
// 쿼리 · 새 창 · 스켈레톤 규칙은 components/custom/innovation-growth-report-page.tsx 참고.
// [보고서 출력] → 인쇄 출력물 선택 → 고른 장만 인쇄본(report-print)을 새 탭에서 인쇄한다(printPath).

type CorpDiagnosticBriefingPageProps = {searchParams: InnovationReportSearchParams}

export const generateViewport = ({searchParams}: CorpDiagnosticBriefingPageProps): Promise<Viewport> =>
    getInnovationReportViewport(searchParams)

const CorpDiagnosticBriefingPage = ({searchParams}: CorpDiagnosticBriefingPageProps) => (
    <InnovationGrowthReportPage searchParams={searchParams} printPath={KBIGX_PRINT_CORP_PATH} />
)

export default CorpDiagnosticBriefingPage
