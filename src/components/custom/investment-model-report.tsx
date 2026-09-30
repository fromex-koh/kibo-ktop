import type {ReactNode} from 'react'
import {PrintButton} from '@/components/composite/print-button'
import {GradeArcGauge} from '@/components/custom/grade-arc-gauge'
import {ListMarker} from '@/components/custom/list-marker'
import {
    LabelValueTable,
    ReportDocument,
    ReportPageStyle,
    ReportSection,
    tableClassName,
} from '@/components/custom/report-document'
import {
    INVESTMENT_MODEL_DOCUMENT_TITLE,
    INVESTMENT_MODEL_SECTION_TITLE,
    type InvestmentModelReport,
} from '@/content/service/investment-model-report'
import {cn} from '@/lib/utils'

// 투자모형 일반분석 리포트 — 새 창으로 여는 인쇄용 문서(A4 한 장).
// 짜임(위에서 아래로): 투자용 평가결과(반원 게이지 셋 → 요약 문장 → 등급 표) → 평가기업 →
// 등급설명 → 유의사항.
//
// 문서 머리 · 구획 제목 · 이름값 표는 다른 리포트와 같은 뼈대를 쓴다(custom/report-document.tsx).
//
// [프론트엔드 연동] 값과 문구는 content/service/investment-model-report.ts 하나에 있다 — 이 파일은
// 받아서 그리기만 하므로 연동할 때 고치지 않아도 된다.
// 등급 줄(rows) 하나가 게이지와 표를 함께 만든다: 표는 넣은 차례대로, 게이지는 isPrimary 인 줄이
// 가운데에 크게 선다. 줄을 더하거나 빼면 둘 다 따라간다.

// 요약 문장의 **강조** 를 굵은 글자로 바꾼다 — 기업명·등급이 섞인 한 문장이라 조각내지 않고 받는다.
const EMPHASIS_PATTERN = /\*\*(.+?)\*\*/g

const renderEmphasis = (text: string): ReactNode[] =>
    text.split(EMPHASIS_PATTERN).map((part, index) =>
        // split 의 홀수 자리가 별표로 묶인 강조 부분이다.
        index % 2 === 1 ? (
            <strong key={`${part}-${index}`} className="font-bold">
                {part}
            </strong>
        ) : (
            <span key={`${part}-${index}`}>{part}</span>
        ),
    )

// 게이지 차례 — 강조한 줄(isPrimary)을 가운데 크게 두고 나머지를 양옆에 둔다.
// 줄 이름이나 id 가 아니라 값으로 정하므로, 데이터의 이름이 바뀌어도 배치가 따라간다.
const orderGauges = (rows: InvestmentModelReport['rows']): InvestmentModelReport['rows'] => {
    const primary = rows.find((row) => row.isPrimary)
    if (!primary) return rows

    const others = rows.filter((row) => row !== primary)

    return [...others.slice(0, 1), primary, ...others.slice(1)]
}

const GradeGauges = ({rows, isLoading}: {rows: InvestmentModelReport['rows']; isLoading: boolean}) => (
    // 위 14 · 아래 20 은 게이지 둘레의 여백이다(원호가 상자 끝에 붙지 않게).
    <ul className="grid auto-cols-fr grid-flow-col items-end pt-3.5 pb-5">
        {orderGauges(rows).map((row) => (
            <li key={row.id} className="flex justify-center">
                <GradeArcGauge
                    grade={row.grades[row.stepIndex] ?? ''}
                    label={row.gaugeLabel}
                    stepIndex={row.stepIndex}
                    totalSteps={row.grades.length}
                    size={row.isPrimary ? 'lg' : 'md'}
                    isLoading={isLoading}
                />
            </li>
        ))}
    </ul>
)

// 등급 표 — 머리에 구간 묶음(우수 · 양호 …), 아래 세 줄에 등급 열넷이 같은 열로 선다.
// 받은 등급 칸만 옅은 파란 면에 파란 굵은 글자로 세운다. 색만으로 알리지 않도록 굵기도 함께 바꾸고
// 그 칸에 읽어 줄 말을 둔다[5.3.1].
// 칸 사이에는 세로선을 긋고 표의 바깥 좌우에는 두지 않는다(맨 오른쪽 칸만 오른쪽 선을 뺀다).
// 글자 크기·굵기는 칸마다 한 번만 준다 — typo-* 를 겹쳐 주면 어느 쪽이 이길지 CSS 순서에 맡기게 된다[PB-08].
const gradeCellClassName = 'border-subtle-3 border-r border-b px-1 py-2 text-center last:border-r-0'
const gradeHeadCellClassName =
    'bg-primary-subtle border-subtle-3 typo-caption-bold text-foreground border-r border-b px-1 py-2 last:border-r-0'

const GradeTable = ({rows, bands}: {rows: InvestmentModelReport['rows']; bands: InvestmentModelReport['bands']}) => (
    <table className={tableClassName}>
        <caption className="sr-only">투자용 평가등급</caption>
        {/* 이름 칸만 폭을 정하고 등급 열넷은 남는 폭을 고르게 나눈다.
            col 은 실제 열 수(이름 1 + 등급 14)만큼 둔다 — 모자라면 마크업 오류다[8.1.1]. */}
        <colgroup>
            <col className="w-10" />
            {rows[0]?.grades.map((grade) => (
                <col key={grade} />
            ))}
        </colgroup>
        <thead>
            <tr>
                <th scope="col" className={gradeHeadCellClassName}>
                    <span className="sr-only">등급 종류</span>
                </th>
                {bands.map((band) => (
                    <th key={band.label} scope="colgroup" colSpan={band.span} className={gradeHeadCellClassName}>
                        {band.label}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {rows.map((row) => (
                <tr key={row.id}>
                    <th scope="row" className={cn(gradeHeadCellClassName, 'text-center align-middle')}>
                        {row.label}
                    </th>
                    {row.grades.map((grade, index) => {
                        const isActive = index === row.stepIndex

                        return (
                            <td
                                key={grade}
                                className={cn(
                                    gradeCellClassName,
                                    isActive
                                        ? 'bg-primary-subtle typo-caption-bold text-primary-strong'
                                        : 'typo-caption-regular text-label-foreground',
                                )}
                            >
                                {grade}
                                {isActive ? <span className="sr-only"> (해당 등급)</span> : null}
                            </td>
                        )
                    })}
                </tr>
            ))}
        </tbody>
    </table>
)

type InvestmentModelReportViewProps = {
    /** 이 문서 뒤에 이어 붙일 문서(심층분석의 기술평가서 두 장). 일반분석에서는 비운다. */
    children?: ReactNode
    report: InvestmentModelReport
    /** 값을 불러오는 중. 게이지 자리에 같은 크기의 스켈레톤이 선다. */
    isLoading?: boolean
}

const InvestmentModelReportView = ({children, report, isLoading = false}: InvestmentModelReportViewProps) => (
    // 문서가 여럿이면(심층분석) 화면에서 48 씩 띄워 장이 나뉘어 보이게 한다. 종이에서는 장이 갈리므로 끈다.
    // print:pb-0 — 종이에서는 문서 끝 여백이 필요 없다. 그 여백까지 세면 A4 한 장을 넘겨 빈 장이 붙는다.
    <div className="bg-surface w-report print-exact mx-auto flex shrink-0 flex-col gap-12 pb-9 print:block print:gap-0 print:pb-0">
        {/* 구획 간격은 16 이다(디자인 24) — 요약 문장이 두 줄이 되어도 A4 한 장에 들어가도록 좁혀 둔 값이다. */}
        <ReportDocument
            label={report.label}
            title={INVESTMENT_MODEL_DOCUMENT_TITLE}
            action={<PrintButton />}
            spacing="compact"
        >
            <ReportSection title={INVESTMENT_MODEL_SECTION_TITLE}>
                <GradeGauges rows={report.rows} isLoading={isLoading} />

                <p className="typo-body-m-regular border-navy-200 bg-navy-100 text-navy-600 rounded-sm border px-5 py-2 text-center">
                    {renderEmphasis(report.summary)}
                </p>

                <GradeTable rows={report.rows} bands={report.bands} />
            </ReportSection>

            <ReportSection title="평가기업">
                <LabelValueTable caption="평가기업 정보" rows={report.company} />
            </ReportSection>

            <ReportSection title="등급설명">
                <ul className="border-subtle-3 flex list-none flex-col gap-2 rounded-sm border px-4 py-3">
                    {report.gradeDescriptions.map((description) => (
                        <li key={description} className="typo-body-l-regular text-label-foreground flex">
                            <ListMarker type="unordered-small" />
                            <span className="min-w-0">{description}</span>
                        </li>
                    ))}
                </ul>
            </ReportSection>

            <ReportSection title="유의사항">
                <p className="typo-body-m-regular text-label-foreground border-subtle-3 rounded-sm border px-4 py-3">
                    {report.disclaimer}
                </p>
            </ReportSection>
        </ReportDocument>
        {children}
    </div>
)

// 화면 — 문서 위에 보이지 않는 제목만 두고 본문은 문서가 채운다[6.4.2].
const InvestmentModelReportScreen = ({
    children,
    title,
    report,
    isLoading = false,
}: {
    children?: ReactNode
    title: string
    report: InvestmentModelReport
    isLoading?: boolean
}) => (
    <main id="main" tabIndex={-1} className="bg-background min-h-dvh w-fit min-w-full">
        <ReportPageStyle />
        <h1 className="sr-only">{title}</h1>
        <InvestmentModelReportView report={report} isLoading={isLoading}>
            {children}
        </InvestmentModelReportView>
    </main>
)

export {InvestmentModelReportScreen, InvestmentModelReportView}
export type {InvestmentModelReportViewProps}
