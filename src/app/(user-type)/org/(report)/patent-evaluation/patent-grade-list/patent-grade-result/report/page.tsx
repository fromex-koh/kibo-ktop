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
// 용지 규격과 인쇄 설정(@page) — 이 화면에서만 쓰므로 전역이 아니라 여기서 부른다.
import '@/styles/report-print.css'

export const metadata: Metadata = {title: PATENT_GRADE_REPORT_TITLE}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// 특허평가 결과 보고서 — 인쇄용 문서(org-patent-evaluation-patent-grade-list-patent-grade-result-report ·
// /org/patent-evaluation/patent-grade-list/patent-grade-result/report)
//
// 헤더 · 푸터가 없는 (report) 레이아웃에 둔다. 주소를 그대로 열면 문서가 화면에 보이고, 위 도구 막대의
// [인쇄하기]를 누르면 인쇄 대화상자가 열린다.
//
// 특허 등급조회 결과의 [결과 보고서 출력]도 결국 이 주소를 연다 — 다만 화면 밖에서 열고(?print=1),
// 다 그려지면 그 문서가 스스로 대화상자를 연다. 그래서 인쇄물은 이 화면을 직접 열어 인쇄한 것과 같다.
//
// [프론트엔드 연동] 인쇄할 보고서는 이 화면이 스스로 조회한다 — 버튼은 주소만 넘기고 값을 들고 오지 않는다.
// 흐름: 버튼이 조회 조건을 붙인 주소를 연다 → 이 파일이 searchParams 로 그 조건을 읽는다 → 조회한 보고서로
//       REPORT_PAGES 를 만든다 → 다 그려지면 인쇄 대화상자가 열린다.
// 지금은 조건 없이 목업을 그리므로, 아래 MOCK_REPORT 자리를 주소로 받은 조건의 조회 결과로 바꾸면 된다.
//   const {id} = await searchParams            // 이 프로젝트의 Next 버전은 searchParams 를 await 한다
//   const report = await fetchPatentGradeReport({id})
// 보고서 타입은 화면 보고서(PatentGradeReport)와 같아 조회 결과를 그대로 넘기면 된다.
// 조건을 붙이는 쪽은 src/components/custom/patent-grade-lookup.tsx 의 [결과 보고서 출력]이다.
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

const OrgPatentGradeReportPrintPage = () => (
    <ReportPrintShell title={PATENT_GRADE_REPORT_TITLE}>
        {REPORT_PAGES.map((page, index) => (
            <ReportSheet key={page.key} page={index + 1} total={REPORT_PAGES.length}>
                {page.content}
            </ReportSheet>
        ))}
    </ReportPrintShell>
)

export default OrgPatentGradeReportPrintPage
