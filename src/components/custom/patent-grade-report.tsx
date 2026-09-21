import {GradeRadarChart} from '@/components/custom/grade-radar-chart'
import {GradeTrendChart} from '@/components/custom/grade-trend-chart'
import {
    PATENT_GRADE_LEGEND,
    PATENT_GRADE_METRICS,
    PATENT_GRADE_REPORT_DESCRIPTION,
    PATENT_GRADE_REPORT_TITLE,
    PATENT_GRADE_SCALE,
    PATENT_GRADE_TITLE,
    PATENT_PEER_AVERAGE_DESCRIPTION,
    PATENT_PEER_AVERAGE_TITLE,
    PATENT_SUMMARY_TEMPLATE,
    PATENT_SUMMARY_TITLE,
    type PatentGradeReport as PatentGradeReportData,
} from '@/content/service/patent-grade'
import {ListMarker} from '@/components/custom/list-marker'

// 특허평가 결과 보고서 — 특허개요 표 · 특허 평가등급(등급 행 + 레이더) · 동일 특허분야 평균(등급 추이 3장).
//
// 시안 규격: 카드 반경 16 · 좌우 여백 100 · 위 여백 40 · 제목(24 Bold)과 설명 8 ·
// 표 머리 셀 blue.50 · 표 위 굵은 선 gray.600 · 등급 행(반경 8 · 높이 78 · 사이 16) ·
// 등급 칩(navy.100 면 · navy.200 테두리 · navy.600 글자) · 추이 카드 3장(반경 16 · 테두리 · 사이 16).

const tableCellClassName = 'border-subtle-3 border px-4 py-3 align-top'
const tableHeadCellClassName = `${tableCellClassName} typo-body-l-bold text-foreground bg-blue-50 text-center`
const tableValueCellClassName = `${tableCellClassName} typo-body-l-regular text-label-foreground wrap-anywhere`

// 항목별 추이 차트의 선 색 — 시안의 파랑 · 초록 · 보라.
const TREND_COLOR: Record<string, string> = {
    diversity: 'var(--ds-chart-1)',
    market: 'var(--ds-mint-700)',
    value: 'var(--ds-purple-500)',
}

type PatentGradeReportProps = {
    /** 보고서 값. 불러오는 중(isLoading)에는 비워도 된다 — 값 자리가 스켈레톤으로 채워진다. */
    report?: PatentGradeReportData
    /**
     * 서버에서 등급 정보를 받는 중. 특허개요 값 · 등급 칩 · 레이더 · '동일 특허분야 평균(등급)' 세 장이 같은 크기의
     * 스켈레톤으로 바뀐다. 특허 등급조회 화면은 검색 중에 보고서 대신 '검색 중' 안내(LoadingState)를 보이므로 넘기지 않는다
     * — 보고서 자리를 그대로 두고 값만 다시 불러오는 화면(예: 결과 화면에서 새로고침)에서 쓴다.
     */
    isLoading?: boolean
}

const PatentGradeReport = ({report, isLoading = false}: PatentGradeReportProps) => {
    // 값이 없으면(불러오는 중) 표 · 등급 칸은 항목 이름을 그대로 두고 값 자리만 스켈레톤으로 채운다 — 높이가 같아
    // 값이 들어올 때 자리가 흔들리지 않는다.
    const isBusy = isLoading || !report
    const summaryRows = report?.summary ?? PATENT_SUMMARY_TEMPLATE
    // 값 자리 스켈레톤은 글줄(<p> · <span>) 안에 들어가므로 인라인 칸(span)으로 그린다 — <div> 를 넣으면 마크업 오류다[8.1.1].
    const valueOrSkeleton = (value: string, widthClassName = 'w-24') =>
        isBusy ? (
            <span
                data-slot="skeleton"
                className={`bg-muted inline-block h-5 max-w-full animate-pulse rounded-md align-middle ${widthClassName}`}
            />
        ) : (
            value
        )
    const metrics = PATENT_GRADE_METRICS.map((metric) => {
        const value = report?.metrics.find((item) => item.id === metric.id)

        return {...metric, ...value}
    })

    return (
        <section
            aria-labelledby="patent-grade-report-title"
            className="bg-card flex min-w-0 flex-col gap-10 rounded-lg px-6 py-10 md:px-12 xl:px-25"
        >
            <div className="flex flex-col gap-2">
                <h2 id="patent-grade-report-title" className="typo-h4-bold text-foreground break-keep">
                    {PATENT_GRADE_REPORT_TITLE}
                </h2>
                <p className="typo-body-xl-regular text-foreground-subtle break-keep">
                    {PATENT_GRADE_REPORT_DESCRIPTION}
                </p>
            </div>

            {/* 특허개요 */}
            <section aria-labelledby="patent-summary-title" className="flex min-w-0 flex-col gap-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 id="patent-summary-title" className="typo-title-l-bold text-foreground">
                        {PATENT_SUMMARY_TITLE}
                    </h3>
                    <p className="typo-body-xl-medium text-label-foreground break-keep">
                        {valueOrSkeleton(report?.field ?? '', 'w-36')}
                    </p>
                    <p className="typo-body-l-regular text-foreground-subtle ms-auto break-keep">
                        보고서 생성일자 · {valueOrSkeleton(report?.createdAt ?? '', 'w-20')}
                    </p>
                </div>
                {/* 표 위 굵은 선은 시안의 표 머리 경계다. md 이상은 시안대로 한 줄에 두 항목(4칸)이다. */}
                <div className="border-t-foreground-subtle hidden min-w-0 border-t md:block">
                    <table className="w-full border-collapse">
                        <caption className="sr-only">{PATENT_SUMMARY_TITLE}</caption>
                        <tbody>
                            {summaryRows.map((row) => (
                                <tr key={row.label}>
                                    <th scope="row" className={`${tableHeadCellClassName} w-40`}>
                                        {row.label}
                                    </th>
                                    <td className={tableValueCellClassName} colSpan={row.fullWidth ? 3 : 1}>
                                        {valueOrSkeleton(row.value, row.fullWidth ? 'w-64' : 'w-24')}
                                    </td>
                                    {row.second ? (
                                        <>
                                            <th scope="row" className={`${tableHeadCellClassName} w-40`}>
                                                {row.second.label}
                                            </th>
                                            <td className={tableValueCellClassName}>
                                                {valueOrSkeleton(row.second.value)}
                                            </td>
                                        </>
                                    ) : null}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* 좁은 화면(768 미만)은 4칸 표를 옆으로 밀어 보게 두지 않고, 한 줄에 한 항목(항목 · 값 2칸)으로 쌓는다 —
                    값이 잘리거나 가로 스크롤 없이 모두 보인다. 순서는 넓은 표를 왼쪽 → 오른쪽으로 읽는 순서와 같다. */}
                <div className="border-t-foreground-subtle min-w-0 border-t md:hidden">
                    <table className="w-full border-collapse">
                        <caption className="sr-only">{PATENT_SUMMARY_TITLE}</caption>
                        <tbody>
                            {summaryRows
                                .flatMap((row) => (row.second ? [row, {...row.second, fullWidth: false}] : [row]))
                                .map((row) => (
                                    <tr key={row.label}>
                                        <th scope="row" className={`${tableHeadCellClassName} w-28`}>
                                            {row.label}
                                        </th>
                                        <td className={tableValueCellClassName}>
                                            {valueOrSkeleton(row.value, row.fullWidth ? 'w-40' : 'w-24')}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 특허 평가등급 — 왼쪽 등급 행, 오른쪽 레이더 */}
            <section aria-labelledby="patent-grade-title" className="flex flex-col gap-4">
                <h3 id="patent-grade-title" className="typo-title-l-bold text-foreground">
                    {PATENT_GRADE_TITLE}
                </h3>
                {/* 등급 행과 레이더를 나란히 두면 태블릿(768)에서 레이더 칸이 좁아 축 이름('가치창출가능성')이 잘린다 —
                    PC(1280 이상)부터 두 칸으로 두고, 그보다 좁으면 레이더를 등급 행 아래로 내린다. */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <ul className="flex list-none flex-col gap-4">
                        {metrics.map((metric) => (
                            <li
                                key={metric.id}
                                className="border-subtle-3 bg-card flex items-center justify-between gap-4 rounded-sm border px-6 py-4"
                            >
                                <span className="typo-body-xl-bold text-foreground min-w-0 break-keep">
                                    {metric.label}
                                </span>
                                {/* 등급 칩 — 색만으로 뜻을 전하지 않도록 등급 글자를 그대로 둔다[5.3.1]. */}
                                <span className="typo-h4-bold border-navy-200 bg-navy-100 text-navy-600 shrink-0 rounded-sm border px-3 py-1">
                                    {isBusy ? (
                                        <span
                                            data-slot="skeleton"
                                            className="bg-muted block h-9 w-10 animate-pulse rounded-md"
                                        />
                                    ) : (
                                        metric.grade
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <GradeRadarChart
                        ariaLabel={`${PATENT_GRADE_TITLE} — ${PATENT_GRADE_LEGEND.primary}와 ${PATENT_GRADE_LEGEND.comparison} 비교`}
                        targetLabel={PATENT_GRADE_LEGEND.primary}
                        peerLabel={PATENT_GRADE_LEGEND.comparison}
                        isLoading={isBusy}
                        loadingLabel="특허 평가등급을 불러오는 중입니다."
                        data={metrics.map((metric) => ({
                            id: metric.id,
                            label: metric.label,
                            targetScore: metric.score ?? 0,
                            peerScore: metric.peerScore,
                        }))}
                    />
                </div>
            </section>

            {/* 동일 특허분야 평균(등급) */}
            <section aria-labelledby="patent-peer-title" className="flex flex-col gap-4">
                <h3 id="patent-peer-title" className="typo-title-l-bold text-foreground">
                    {PATENT_PEER_AVERAGE_TITLE}
                </h3>
                <p className="typo-body-xl-regular text-foreground-subtle flex break-keep">
                    <ListMarker type="unordered-small" />
                    <span className="min-w-0">{PATENT_PEER_AVERAGE_DESCRIPTION}</span>
                </p>
                {/* 세 장을 나란히 두면 태블릿(768)에서 한 장이 150 남짓으로 좁아져 가로축 분기 이름이 붙고 이름표가
                    잘린다 — 시안 PC 폭(1280 이상)부터 세 칸으로 놓고, 그보다 좁으면 한 줄에 한 장씩 둔다. */}
                <ul className="grid list-none grid-cols-1 gap-4 xl:grid-cols-3">
                    {metrics.map((metric) => (
                        <li
                            key={metric.id}
                            className="border-subtle-3 flex min-w-0 flex-col gap-2 rounded-lg border px-4 py-4 md:px-6"
                        >
                            <h4 className="typo-body-xl-bold text-foreground text-center break-keep">{metric.label}</h4>
                            {/* 꺾은선은 동일 특허분야 평균, 채운 점은 이 특허(평가대상)의 등급이다. */}
                            <GradeTrendChart
                                isLoading={isBusy}
                                loadingLabel={`${metric.label} 등급 추이를 불러오는 중입니다.`}
                                ariaLabel={`${metric.label} — ${PATENT_GRADE_LEGEND.comparison}(등급) 추이와 평가대상 등급`}
                                seriesLabel={PATENT_GRADE_LEGEND.comparison}
                                data={[...(metric.peerTrend ?? [])]}
                                target={metric.targetGrade ? {grade: metric.targetGrade} : undefined}
                                scale={PATENT_GRADE_SCALE}
                                color={TREND_COLOR[metric.id]}
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    )
}

export {PatentGradeReport}
export type {PatentGradeReportProps}
