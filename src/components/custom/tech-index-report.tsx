import type {ReactNode} from 'react'
import {PrintButton} from '@/components/composite/print-button'
import {ListMarker} from '@/components/custom/list-marker'
import {
    LabelValueTable,
    ReportDocument,
    ReportPageStyle,
    ReportSection,
    tableClassName,
} from '@/components/custom/report-document'
import {renderReportEmphasis} from '@/components/custom/report-emphasis'
import {ScoreRing, type ScoreRingTone} from '@/components/custom/score-ring'
import {
    findTechIndexBand,
    TECH_INDEX_DOCUMENT_TITLE,
    TECH_INDEX_SCORE_CAPTION,
    type TechIndexBand,
    type TechIndexReport,
} from '@/content/service/tech-index-report'
import {cn} from '@/lib/utils'

// Tech-Index 일반분석 리포트 — 새 창으로 여는 인쇄용 문서(A4 한 장).
// 짜임(위에서 아래로): 지수정보(도넛 + 구간 표 → 요약 문장) → 4대 혁신역량 점수 → 평가기업 →
// 지수설명 → 유의사항.
//
// 문서 머리 · 구획 제목 · 이름값 표는 다른 리포트와 같은 뼈대를 쓴다(custom/report-document.tsx).
//
// [프론트엔드 연동] 값과 문구는 content/service/tech-index-report.ts 하나에 있다 — 이 파일은
// 받아서 그리기만 하므로 연동할 때 고치지 않아도 된다.

// 구간 자리 → 도넛 채움 색. 낮은 구간부터 차례로 취약 · 미흡 · 보통 · 양호 · 우수다.
// 이름이 아니라 자리로 맞춰, 구간의 점수 범위나 이름이 바뀌어도 색이 따라간다.
// 자리를 찾지 못하면(구간 밖) 색을 정할 수 없으므로 가장 낮은 색을 쓴다.
const BAND_TONES: readonly ScoreRingTone[] = ['weak', 'poor', 'normal', 'good', 'excellent']

// 지수 구간 표 — 폭 160 의 작은 표다. 받은 점수가 드는 줄만 옅은 파란 면에 파란 굵은 글자로 선다.
// 색만으로 알리지 않도록 굵기도 함께 바꾸고, 그 줄에 읽어 줄 말을 둔다[5.3.1].
//
// 다른 표와 마찬가지로 바깥 좌우에는 선을 두지 않는다 — 가로 구분선과 두 칸 사이의 선만 긋는다.
// 글자 크기·굵기는 칸마다 한 번만 준다 — typo-* 를 겹쳐 주면 어느 쪽이 이길지 CSS 순서에 맡기게 된다[PB-08].
const bandCellClassName = 'border-subtle-3 border-b px-2 py-0.5 text-center'
const bandCellTextClassName = 'typo-micro-regular text-label-foreground'
const bandCellActiveClassName = 'bg-primary-subtle typo-micro-bold text-primary-strong'

const TechIndexBandTable = ({bands, activeRange}: {bands: readonly TechIndexBand[]; activeRange?: string}) => (
    <table className={cn(tableClassName, 'w-40')}>
        <caption className="sr-only">Tech-Index 지수 구간</caption>
        <colgroup>
            <col className="w-20" />
            <col />
        </colgroup>
        <thead>
            <tr>
                <th
                    scope="colgroup"
                    colSpan={2}
                    className="bg-primary-subtle border-subtle-3 typo-micro-bold text-foreground border-b px-2 py-1 text-center"
                >
                    구분
                </th>
            </tr>
        </thead>
        <tbody>
            {bands.map((band) => {
                const isActive = band.range === activeRange

                return (
                    <tr key={band.range}>
                        <td
                            className={cn(
                                bandCellClassName,
                                'border-subtle-3 border-r',
                                isActive ? bandCellActiveClassName : bandCellTextClassName,
                            )}
                        >
                            {band.range}
                            {isActive ? <span className="sr-only"> (해당 구간)</span> : null}
                        </td>
                        <td
                            className={cn(
                                bandCellClassName,
                                isActive ? bandCellActiveClassName : bandCellTextClassName,
                            )}
                        >
                            {band.label}
                        </td>
                    </tr>
                )
            })}
        </tbody>
    </table>
)

// 4대 혁신역량 점수 — 한 상자 안에 네 칸이 고르게 서고 칸 사이에 짧은 세로 선이 선다.
const CompetencyScores = ({competencies}: {competencies: TechIndexReport['competencies']}) => (
    <ul className="border-subtle-3 flex items-center rounded-sm border py-4">
        {competencies.map((competency, index) => (
            <li key={competency.id} className="flex flex-1 items-center">
                {index > 0 ? <span aria-hidden="true" className="bg-subtle-3 h-8 w-px shrink-0" /> : null}
                <div className="flex min-w-0 flex-col px-6">
                    <span className="typo-caption-regular text-label-foreground">{competency.label}</span>
                    <span className="flex items-baseline gap-1">
                        <span className="typo-body-xl-bold text-foreground">{competency.score}</span>
                        <span className="typo-body-m-regular text-label-foreground">점</span>
                    </span>
                </div>
            </li>
        ))}
    </ul>
)

type TechIndexReportViewProps = {
    /** 이 문서 뒤에 이어 붙일 문서(심층분석의 기술평가서 두 장). 일반분석에서는 비운다. */
    children?: ReactNode
    report: TechIndexReport
    /** 값을 불러오는 중. 도넛 자리에 같은 크기의 스켈레톤이 선다(다른 구획은 값이 이미 들어 있다). */
    isLoading?: boolean
}

const TechIndexReportView = ({children, report, isLoading = false}: TechIndexReportViewProps) => {
    const band = findTechIndexBand(report.score)
    const statusLabel = band?.label ?? ''
    const bandIndex = band ? report.bands.indexOf(band) : -1

    return (
        // 문서가 여럿이면(심층분석) 화면에서는 48 씩 띄워 장이 나뉘어 보이게 한다 — 붙여 두면 앞 문서의
        // 마지막 구획이 다음 문서 머리에 닿는다. 종이에서는 장이 갈리므로 그 간격이 필요 없다.
        // print:pb-0 — 종이에서는 문서 끝 여백이 필요 없다. 그 여백까지 세면 A4 한 장을 넘겨 빈 장이 붙는다.
        <div className="bg-surface w-report print-exact mx-auto flex shrink-0 flex-col gap-12 pb-9 print:block print:gap-0 print:pb-0">
            <ReportDocument
                label={report.label}
                title={TECH_INDEX_DOCUMENT_TITLE}
                action={<PrintButton />}
                // 각주가 한 줄 더 있는 창업용은 구획 간격을 한 단계 더 좁힌다 —
                // 그래야 요약 문장이 두 줄이 되어도 A4 한 장에 들어간다.
                spacing={report.competencyNote ? 'tight' : 'compact'}
            >
                <ReportSection title={report.scoreSectionTitle}>
                    {/* 도넛은 문서 가운데, 구간 표는 오른쪽에 둔다 — 양옆 칸을 같은 폭으로 두어
                        표가 있어도 도넛이 가운데를 지킨다. */}
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                        <ScoreRing
                            score={report.score}
                            caption={TECH_INDEX_SCORE_CAPTION}
                            statusLabel={statusLabel}
                            tone={BAND_TONES[bandIndex] ?? 'weak'}
                            ariaLabel={`Tech-Index 지수 ${report.score}점 · ${statusLabel}`}
                            isLoading={isLoading}
                            className="col-start-2"
                        />
                        <div className="col-start-3 justify-self-end pe-15">
                            <TechIndexBandTable bands={report.bands} activeRange={band?.range} />
                        </div>
                    </div>

                    <p className="typo-body-m-regular border-navy-200 bg-navy-100 text-navy-600 rounded-sm border px-5 py-2 text-center">
                        {renderReportEmphasis(report.summary)}
                    </p>
                </ReportSection>

                <ReportSection title="4대 혁신역량 점수">
                    <CompetencyScores competencies={report.competencies} />
                    {/* 각주 — 세부 점수를 한 줄로 덧붙인다(창업용에만 있다). */}
                    {report.competencyNote ? (
                        <p className="typo-caption-regular text-foreground-subtle">{report.competencyNote}</p>
                    ) : null}
                </ReportSection>

                <ReportSection title="평가기업">
                    <LabelValueTable caption="평가기업 정보" rows={report.company} />
                </ReportSection>

                <ReportSection title="지수설명">
                    <ul className="border-subtle-3 flex list-none flex-col gap-2 rounded-sm border px-4 py-3">
                        {report.indexDescriptions.map((description) => (
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
}

// 화면 — 문서 위에 보이지 않는 제목만 두고 본문은 문서가 채운다[6.4.2].
const TechIndexReportScreen = ({
    children,
    title,
    report,
    isLoading = false,
}: {
    children?: ReactNode
    title: string
    report: TechIndexReport
    isLoading?: boolean
}) => (
    <main id="main" tabIndex={-1} className="bg-background min-h-dvh w-fit min-w-full">
        <ReportPageStyle />
        <h1 className="sr-only">{title}</h1>
        <TechIndexReportView report={report} isLoading={isLoading}>
            {children}
        </TechIndexReportView>
    </main>
)

export {TechIndexReportScreen, TechIndexReportView}
export type {TechIndexReportViewProps}
