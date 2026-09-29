import type {Metadata} from 'next'
import {PatentReportDocument} from '@/components/custom/patent-report-document'
import {PatentReportMetricPage} from '@/components/custom/patent-report-metric-page'
import {PatentReportReferencePage} from '@/components/custom/patent-report-reference-page'
import {ReportPrintShell, ReportSheet} from '@/components/custom/report-print-shell'
import {
    findPatentGradeReport,
    MOCK_PATENT_SEARCH_DEFAULTS,
    PATENT_GRADE_REPORT_TITLE,
} from '@/content/service/patent-grade'

export const metadata: Metadata = {title: PATENT_GRADE_REPORT_TITLE}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// 특허평가 결과 보고서 — 인쇄용 문서(corp-patent-evaluation-patent-grade-list-patent-grade-result-report ·
// /corp/patent-evaluation/patent-grade-list/patent-grade-result/report)
//
// 특허 등급조회 결과의 [결과 보고서 출력]이 이 주소를 새 탭으로 연다. 헤더 · 푸터가 없는 (report) 레이아웃에 둔다.
// 위 도구 막대의 [인쇄하기]를 누르면 브라우저 인쇄 대화상자가 열리고, 문서는 A4 한 장에 맞춰 나간다.
//
// [프론트엔드 연동] 지금은 목업 보고서를 그린다 — 주소의 조회 조건(기준 · 번호)이나 보고서 id 로 받은 값을
// PatentReportDocument 의 report 에 넘기면 된다(화면 보고서와 같은 타입이다).
// ─────────────────────────────────────────────────────────────────────────────────────────────

const MOCK_REPORT = findPatentGradeReport({
    type: 'registration',
    number: MOCK_PATENT_SEARCH_DEFAULTS.registration,
})

// 쪽 머리의 발명의명칭(등록번호) — 특허개요의 '발명의 명칭'과 '등록번호'를 이어 만든다.
const findSummaryValue = (label: string) =>
    MOCK_REPORT?.summary.find((row) => row.label === label)?.value ??
    MOCK_REPORT?.summary.find((row) => row.second?.label === label)?.second?.value ??
    ''
const inventionTitle = `${findSummaryValue('발명의 명칭')}(${findSummaryValue('등록번호')})`

// 쪽 차례 — 첫 쪽 → 항목별 쪽(details 수만큼) → 참고자료 쪽.
// 이 목록의 순서가 쪽 번호이고 길이가 전체 쪽수다 — details 가 늘면 '1 / 6' 처럼 저절로 따라간다.
// 한 항목이 한 쪽이다. 내용이 A4 한 장(1924)을 넘으면 다음 장으로 넘어가지 않고 잘리므로,
// 카드 수나 문단이 크게 늘면 그 쪽을 둘로 나누는 작업이 필요하다.
const REPORT_PAGES = MOCK_REPORT
    ? [
          {key: 'summary', content: <PatentReportDocument report={MOCK_REPORT} />},
          // 항목별 쪽 — 보고서 값의 details 에 넣은 수만큼 늘어난다.
          ...(MOCK_REPORT.details ?? []).map((detail) => ({
              key: detail.id,
              content: <PatentReportMetricPage detail={detail} inventionTitle={inventionTitle} />,
          })),
          // 마지막 쪽 — 제도 설명(참고자료)이라 보고서 값과 무관하게 늘 같다.
          {key: 'reference', content: <PatentReportReferencePage />},
      ]
    : []

const CorpPatentGradeReportPrintPage = () => (
    <ReportPrintShell title={PATENT_GRADE_REPORT_TITLE}>
        {REPORT_PAGES.map((page, index) => (
            <ReportSheet key={page.key} page={index + 1} total={REPORT_PAGES.length}>
                {page.content}
            </ReportSheet>
        ))}
    </ReportPrintShell>
)

export default CorpPatentGradeReportPrintPage
