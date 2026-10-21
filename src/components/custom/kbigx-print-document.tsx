import type {ComponentType} from 'react'
import {ChartRevealProvider} from '@/components/custom/chart-reveal'
import {
    KbigxPrintBriefingActivity,
    KbigxPrintBriefingFinance,
    KbigxPrintBriefingOverview,
} from '@/components/custom/kbigx-print-briefing'
import {
    KbigxPrintCompanyFinance,
    KbigxPrintCompanyOverview,
    KbigxPrintCompanyTrade,
} from '@/components/custom/kbigx-print-company'
import {
    KbigxPrintInnovationAnalysis,
    KbigxPrintInnovationCompetitors,
    KbigxPrintInnovationEmerging,
    KbigxPrintInnovationExcellent,
    KbigxPrintInnovationHoldings,
    KbigxPrintInnovationInstitutes,
    KbigxPrintInnovationRnd,
    KbigxPrintInnovationPatents,
} from '@/components/custom/kbigx-print-innovation'
import {KbigxPrintActivityEnergy, KbigxPrintActivityHumanResources} from '@/components/custom/kbigx-print-activity'
import {
    KbigxPrintCreditBorrowing,
    KbigxPrintCreditBorrowingStatus,
    KbigxPrintCreditInfo,
    KbigxPrintCreditRating,
    KbigxPrintCreditRatiosFirst,
    KbigxPrintCreditRatiosSecond,
} from '@/components/custom/kbigx-print-credit'
import {KbigxPrintBackCover, KbigxPrintCover, KbigxPrintToc} from '@/components/custom/kbigx-print-cover'
import {KbigxPrintPagePlaceholder} from '@/components/custom/kbigx-print-page-placeholder'
import {KbxPage} from '@/components/custom/kbigx-print-parts'
import {KbigxPrintTechIndexComparison, KbigxPrintTechIndexOverview} from '@/components/custom/kbigx-print-tech-index'
import {KbigxPrintReference} from '@/components/custom/kbigx-print-reference'
import {ReportSheet} from '@/components/custom/report-print-shell'
import type {InnovationGrowthReport} from '@/content/service/k-bigx-innovation-report'
import {
    isKbigxPrintFrameless,
    type KbigxPrintPage,
    type KbigxPrintPageKind,
} from '@/content/service/k-bigx-print-report'

// K-BIGx 보고서 인쇄본 — 쪽 목록을 용지로 그린다.
// 쪽 목록 · 번호는 k-bigx-print-report.ts 의 buildKbigxPrintPages 가 만들고, 이 파일은 쪽 종류(kind)마다 본문만 고른다.
//   · 표지 · 목차 · 뒷표지는 쪽 틀 없이 본문이 한 장 전체를 그린다.
//   · 나머지는 쪽 틀(KbxPage — 장 제목 박스/머리말 · 바닥글) 안에 본문이 들어간다.
// [프론트엔드 연동] report 는 getInnovationGrowthReport 결과(지금은 목업)다. 쪽 본문은 report · page 만 읽는다.

type PageContentProps = {
    report: InnovationGrowthReport
    page: KbigxPrintPage
    /** 인쇄되는 쪽 전체 — 목차가 장 시작 번호를 계산할 때 쓴다. */
    pages: readonly KbigxPrintPage[]
}

// 쪽 종류 → 본문. 여기 없는 종류는 자리 표시(KbigxPrintPagePlaceholder)로 그린다.
// 새 쪽은 k-bigx-print-report.ts 의 KBIGX_PRINT_PAGE_KINDS · SECTION_PAGES 에 먼저 더한 뒤 여기에 연결한다.
const PAGE_CONTENT: Partial<Record<KbigxPrintPageKind, ComponentType<PageContentProps>>> = {
    cover: KbigxPrintCover,
    toc: KbigxPrintToc,
    'briefing-1': KbigxPrintBriefingOverview,
    'briefing-2': KbigxPrintBriefingFinance,
    'briefing-3': KbigxPrintBriefingActivity,
    'company-1': KbigxPrintCompanyOverview,
    'company-2': KbigxPrintCompanyFinance,
    'company-3': KbigxPrintCompanyTrade,
    'innovation-1': KbigxPrintInnovationHoldings,
    'innovation-2': KbigxPrintInnovationPatents,
    'innovation-3': KbigxPrintInnovationAnalysis,
    'innovation-4': KbigxPrintInnovationCompetitors,
    'innovation-5': KbigxPrintInnovationExcellent,
    'innovation-6': KbigxPrintInnovationEmerging,
    'innovation-7': KbigxPrintInnovationInstitutes,
    'innovation-8': KbigxPrintInnovationRnd,
    'tech-index-1': KbigxPrintTechIndexOverview,
    'tech-index-2': KbigxPrintTechIndexComparison,
    'credit-finance-1': KbigxPrintCreditRating,
    'credit-finance-2': KbigxPrintCreditInfo,
    'credit-finance-3': KbigxPrintCreditRatiosFirst,
    'credit-finance-4': KbigxPrintCreditRatiosSecond,
    'credit-finance-5': KbigxPrintCreditBorrowing,
    'credit-finance-6': KbigxPrintCreditBorrowingStatus,
    'activity-1': KbigxPrintActivityHumanResources,
    'activity-2': KbigxPrintActivityEnergy,
    'reference-1': KbigxPrintReference,
    'back-cover': KbigxPrintBackCover,
}

type KbigxPrintDocumentProps = {
    report: InnovationGrowthReport
    pages: readonly KbigxPrintPage[]
}

// 인쇄본은 차트를 등장 효과 없이 바로 그린다(mode="off") — 자동 인쇄(?print=1)가 차트를 기다리는 기준과도 맞는다.
// 용지 안은 마우스에 반응하지 않는다(pointer-events-none) — 읽기 전용이라 누를 것이 없고, 툴팁 끄는 옵션이 없는
// 차트도 hover 툴팁이 뜨지 않게. 옵션이 있는 차트는 showTooltip={false} 도 넘긴다.
const KbigxPrintDocument = ({report, pages}: KbigxPrintDocumentProps) => (
    <ChartRevealProvider mode="off">
        {pages.map((page) => {
            const Content = PAGE_CONTENT[page.kind]
            const content = Content ? <Content report={report} page={page} pages={pages} /> : null

            return (
                // 쪽 번호는 쪽 안의 바닥글이 찍는다 — 용지 아래 '3 / 31'(page · total)은 넘기지 않는다.
                <ReportSheet key={page.id}>
                    <div className="pointer-events-none h-full">
                        {isKbigxPrintFrameless(page.kind) ? (
                            content
                        ) : (
                            <KbxPage page={page} companyName={report.companyName}>
                                {content ?? <KbigxPrintPagePlaceholder page={page} />}
                            </KbxPage>
                        )}
                    </div>
                </ReportSheet>
            )
        })}
    </ChartRevealProvider>
)

export {KbigxPrintDocument}
