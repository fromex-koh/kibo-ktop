import {notFound} from 'next/navigation'
import {KbigxPrintDocument} from '@/components/custom/kbigx-print-document'
import {KbigxPrintPreparing} from '@/components/custom/kbigx-print-preparing'
import {ReportPrintShell} from '@/components/custom/report-print-shell'
import {REPORT_AUTO_PRINT_QUERY} from '@/lib/open-report-print-tab'
import {
    getInnovationGrowthReport,
    INNOVATION_REPORT_CASE_QUERY,
    INNOVATION_REPORT_ID_QUERY,
    withPreviewCase,
} from '@/content/service/k-bigx-innovation-report'
import {
    buildKbigxPrintPages,
    KBIGX_PRINT_REPORT_TITLE,
    KBIGX_PRINT_SECTIONS_QUERY,
    KBIGX_PRINT_TEMPLATE_NOTICE,
    parseKbigxPrintSections,
} from '@/content/service/k-bigx-print-report'

// ─────────────────────────────────────────────────────────────────────────────────────────────
// K-BIGx 기업혁신성장 보고서 인쇄본 페이지 본문 — 기업 · 기관 report-print/page.tsx 가 함께 쓴다.
// (/corp · /org 의 k-bigx-report/innovation-growth-report/report-print)
//
// 서비스 흐름: 웹 보고서 [보고서 출력] → 인쇄 출력물 선택 [출력하기] → 이 주소를 새 탭으로 연다(?print=1)
//   → 다 그려지면 인쇄 대화상자가 열리고, 인쇄가 끝나면 탭이 닫힌다(lib/open-report-print-tab.ts · report-print-shell.tsx).
// ?print=1 없이 열면 인쇄 템플릿을 눈으로 확인하는 화면이다(도구 막대 아래 안내 문구가 보인다).
// ?print=1 이면 차트가 그려지고 인쇄 대화상자가 뜰 때까지 준비 안내(KbigxPrintPreparing)가 화면을 덮는다.
// report-print 폴더에 loading.tsx 는 두지 않는다 — 두면 화면을 나눠 보내며(스트리밍) 문서 끝에 빈 숨김 표(<table hidden>)가 남아 접근성 검사에 걸린다.
//
// 보고서: ?reportId=<id> — 웹 보고서와 같은 보고서를 다시 조회해 그린다.
// 장 고르기: ?sections=briefing,company (인쇄 출력물 선택의 항목 id). 없으면 전체 장이다.
// 열람 케이스: ?case=partner-corp | partner-person (없으면 self) — 신용/재무정보 가림을 확인한다.
// 색 · 글자 크기 · 간격은 kbx 토큰(tokens.json kbigxPrint)이다 — .kbigx-print 안에서만 값이 있다.
// 화면 테마와 관계없이 라이트로 그린다(report-theme-scope.tsx 의 /report-print 예외).
//
// 목록 표는 늘 한 쪽(최대 10행)이고, 기업신용정보만 표가 많으면 '(계속)' 쪽이 붙는다 — 쪽 번호 · 목차는 저절로 따라 바뀐다.
//
// [프론트엔드 연동] 주소는 웹 보고서가 getKbigxPrintHref 로 만든다. 보고서는 getInnovationGrowthReport(reportId)
//   한 곳에서 받는다(지금은 목업).
// ─────────────────────────────────────────────────────────────────────────────────────────────

type KbigxPrintPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

const KbigxPrintPage = async ({searchParams}: KbigxPrintPageProps) => {
    const params = await searchParams
    const reportIdParam = params[INNOVATION_REPORT_ID_QUERY]
    const fetchedReport = await getInnovationGrowthReport(typeof reportIdParam === 'string' ? reportIdParam : undefined)
    if (!fetchedReport) notFound()
    // [퍼블리싱 확인용] ?case=<id> 로 열람 케이스(가림 범위)를 바꿔 본다 — 보고서 화면과 같다. 연동 후 지운다.
    const report = withPreviewCase(fetchedReport, params[INNOVATION_REPORT_CASE_QUERY])

    const pages = buildKbigxPrintPages(report, parseKbigxPrintSections(params[KBIGX_PRINT_SECTIONS_QUERY]))
    const isAutoPrint = params[REPORT_AUTO_PRINT_QUERY] === '1'

    return (
        <div className="kbigx-print">
            {/* 서비스 흐름(?print=1)에서는 템플릿 확인용 안내 줄을 뺀다. */}
            <ReportPrintShell
                title={KBIGX_PRINT_REPORT_TITLE}
                notice={isAutoPrint ? null : KBIGX_PRINT_TEMPLATE_NOTICE}
            >
                <KbigxPrintDocument report={report} pages={pages} />
            </ReportPrintShell>
            {/* 서비스 흐름(?print=1) — 차트가 그려지고 인쇄 대화상자가 뜰 때까지 준비 안내로 덮는다. */}
            {isAutoPrint ? <KbigxPrintPreparing /> : null}
        </div>
    )
}

export {KbigxPrintPage}
export type {KbigxPrintPageProps}
