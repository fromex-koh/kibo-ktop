import {notFound} from 'next/navigation'
import {InnovationGrowthReportDocument} from '@/components/custom/innovation-growth-report-document'
import {
    getInnovationGrowthReport,
    INNOVATION_REPORT_CREATED_QUERY,
    INNOVATION_REPORT_CREATED_QUERY_VALUE,
    INNOVATION_REPORT_ID_QUERY,
    INNOVATION_REPORT_CASE_QUERY,
    withPreviewCase,
} from '@/content/service/k-bigx-innovation-report'

// K-BIGx 기업혁신성장 보고서 페이지 본문 — 한 페이지에 탭(진단브리핑 · 기업현황 · 기술혁신정보 · Tech-Index · 신용/재무정보 ·
// 활동성정보)이 여럿이고, 탭은 주소 쿼리(?tab=)로만 바뀐다. 페이지 주소는 진단브리핑(…/diagnostic-briefing) 하나다.
// 조회의 [이용권 사용]을 거치면 진단브리핑 화면이 새 창으로 열린다(composite/new-window-link.tsx). 헤더 · 푸터가 없는 (report)
// 레이아웃에 둔다 — 새 창은 문서 한 장만 보여 주는 자리다. 주소를 곧바로 열어도 같은 문서가 나온다.
//
// 쿼리
//   ?reportId=<id> — 열 보고서. 조회 결과가 없으면 404(notFound).
//   ?from=use      — [이용권 사용]을 거쳐 열렸다는 표시. 그때만 '이용권이 차감되어 보고서를 생성하였습니다.' 알림을 띄운다.
//   ?view=pc       — PC 화면으로 보기(모바일 [더보기]가 여는 새 창). 뷰포트를 PC 폭(1280)으로 고정한다 — generateViewport.
//   ?tab=<id>      — 열 탭(company · innovation · tech-index · credit-finance · activity). 없으면 진단브리핑.
//   ?case=<id>     — [퍼블리싱 확인용] 열람 케이스(report.viewerCase)를 덮어쓴다(self · partner-corp · partner-person).
// 받는 동안은 loading.tsx 가 ?tab= 에 맞는 탭 모양의 스켈레톤을 보여 준다.
// [프론트엔드 연동] 이 화면은 보고서를 받아 그리기만 한다 — 목업 · API 의 교체 지점은 content/service/k-bigx-innovation-report.ts 다.
//   지금 getInnovationGrowthReport 는 어느 reportId 로 열어도 같은 목업을 돌려준다(빈 id 만 404).

type InnovationReportSearchParams = Promise<Record<string, string | string[] | undefined>>

type InnovationGrowthReportPageProps = {
    searchParams: InnovationReportSearchParams
}

const InnovationGrowthReportPage = async ({searchParams}: InnovationGrowthReportPageProps) => {
    const params = await searchParams
    const reportIdParam = params[INNOVATION_REPORT_ID_QUERY]
    const reportId = typeof reportIdParam === 'string' ? reportIdParam : undefined
    const fetchedReport = await getInnovationGrowthReport(reportId)
    if (!fetchedReport) notFound()
    // [퍼블리싱 확인용] ?case= 로 열람 케이스를 바꿔 본다 — 연동 후 fetchedReport 를 그대로 쓴다.
    const report = withPreviewCase(fetchedReport, params[INNOVATION_REPORT_CASE_QUERY])

    return (
        <InnovationGrowthReportDocument
            report={report}
            isJustCreated={params[INNOVATION_REPORT_CREATED_QUERY] === INNOVATION_REPORT_CREATED_QUERY_VALUE}
        />
    )
}

export {InnovationGrowthReportPage}
export type {InnovationGrowthReportPageProps, InnovationReportSearchParams}
