import Image from 'next/image'
import kiboLogo from '@public/images/logo-kibo-on-dark.webp'
import {ListMarker} from '@/components/custom/list-marker'
import {GradeRadarChart} from '@/components/custom/grade-radar-chart'
import {GradeTrendChart} from '@/components/custom/grade-trend-chart'
import {PATENT_TREND_COLOR} from '@/components/custom/patent-grade-report'
import {
    PATENT_GRADE_LEGEND,
    PATENT_GRADE_METRICS,
    PATENT_GRADE_NOTICE,
    PATENT_GRADE_REPORT_TITLE,
    PATENT_GRADE_SCALE,
    PATENT_GRADE_TITLE,
    PATENT_PEER_AVERAGE_DESCRIPTION,
    PATENT_PEER_AVERAGE_TITLE,
    PATENT_REPORT_CREATED_AT_LABEL,
    PATENT_REPORT_EYEBROW,
    PATENT_SUMMARY_TITLE,
    type PatentGradeReport,
} from '@/content/service/patent-grade'

// 특허평가 결과 보고서 — 인쇄용 문서의 첫 쪽(특허개요). 화면 보고서(patent-grade-report.tsx)와 같은 값을 쓰고
// 같은 차트 조각(GradeRadarChart · GradeTrendChart)을 그대로 가져다 쓴다. 다른 것은 짜임뿐이다:
// 인쇄물은 폭이 1360 으로 고정이라 반응형 분기가 없고, 남색 머리글과 주의사항이 문서 안에 들어간다.
//
// 용지 규격(A4 비율 · 배율 · 쪽 나눔)은 app/globals.css 가 갖는다 — 이 파일은 한 장의 내용만 그린다.
// 쪽 차례는 page.tsx 의 REPORT_PAGES 가 정한다(첫 쪽 → 항목별 쪽 → 참고자료 쪽).
//
// [프론트엔드 연동]
//   · 값은 report(PatentGradeReport) 하나로 받는다 — 화면 보고서와 같은 타입이라 조회 결과를 그대로 넘기면 된다.
//   · 쪽을 더하려면 쪽 컴포넌트를 하나 만들어 page.tsx 의 REPORT_PAGES 에 넣는다 — 쪽수(1 / 5)는 그 목록이 센다.

// 표 — 이름 칸 160 · 값 칸 440(값이 한 줄을 다 쓰면 1040). 위 굵은 선은 표 머리 경계다.
const summaryHeadCellClassName =
    'border-subtle-3 bg-blue-50 typo-body-l-bold text-foreground border px-4 py-3 text-left'
const summaryValueCellClassName = 'border-subtle-3 typo-body-l-regular text-label-foreground border px-4 py-3'

// 남색 머리글 — 쪽마다 같은 모양으로 들어간다. 문서 이름은 첫 쪽이 h1, 뒤쪽은 그 쪽의 제목(h2)이다[6.4.2].
// 크고 굵은 글자를 제목이 아닌 문단으로 두면 검사 도구가 '제목일 수 있음' 으로 잡는다 — 실제 제목으로 둔다.
const PatentReportHeader = ({
    isFirstPage = false,
    title = PATENT_GRADE_REPORT_TITLE,
}: {
    isFirstPage?: boolean
    /** 쪽 머리의 제목. 참고자료 쪽만 다른 제목을 쓴다. */
    title?: string
}) => (
    <header className="bg-navy-500 flex items-center justify-between gap-10 px-20 py-10">
        <div className="flex min-w-0 flex-col gap-1">
            <p className="typo-body-l-regular text-white">{PATENT_REPORT_EYEBROW}</p>
            {isFirstPage ? (
                <h1 className="typo-display-m-bold text-white">{title}</h1>
            ) : (
                <h2 className="typo-display-m-bold text-white">{title}</h2>
            )}
        </div>
        {/* 쪽마다 되풀이되는 로고라 늦게 불러오지 않는다 — 인쇄 때 비어 나갈 여지를 없앤다. */}
        <Image src={kiboLogo} alt="기술보증기금" priority className="h-8 w-auto shrink-0" />
    </header>
)

type PatentReportDocumentProps = {
    report: PatentGradeReport
}

const PatentReportDocument = ({report}: PatentReportDocumentProps) => {
    // 항목 순서(기술다양성 · 시장확장성 · 가치창출가능성)는 이름 목록이 정한다 — 등급 · 레이더 · 추이가 같은 순서를 쓴다.
    const metrics = PATENT_GRADE_METRICS.map((metric) => ({
        ...metric,
        ...report.metrics.find((item) => item.id === metric.id),
    }))

    return (
        <article className="flex h-full flex-col">
            <PatentReportHeader isFirstPage />

            <div className="flex flex-col gap-10 px-20 pt-15">
                {/* 특허개요 */}
                <section aria-labelledby="patent-report-summary" className="flex flex-col gap-4">
                    <div className="flex items-baseline gap-3">
                        <h2 id="patent-report-summary" className="typo-title-l-bold text-foreground">
                            {PATENT_SUMMARY_TITLE}
                        </h2>
                        <p className="typo-body-xl-medium text-label-foreground">{report.field}</p>
                        <p className="typo-body-l-regular text-foreground-subtle ms-auto">
                            {PATENT_REPORT_CREATED_AT_LABEL} · {report.createdAt}
                        </p>
                    </div>
                    <div className="border-t-foreground-subtle border-t">
                        <table className="w-full table-fixed border-collapse">
                            <caption className="sr-only">{PATENT_SUMMARY_TITLE}</caption>
                            <colgroup>
                                <col className="w-40" />
                                <col />
                                <col className="w-40" />
                                <col />
                            </colgroup>
                            <tbody>
                                {report.summary.map((row) => (
                                    <tr key={row.label}>
                                        <th scope="row" className={summaryHeadCellClassName}>
                                            {row.label}
                                        </th>
                                        <td className={summaryValueCellClassName} colSpan={row.fullWidth ? 3 : 1}>
                                            {row.value}
                                        </td>
                                        {row.second ? (
                                            <>
                                                <th scope="row" className={summaryHeadCellClassName}>
                                                    {row.second.label}
                                                </th>
                                                <td className={summaryValueCellClassName}>{row.second.value}</td>
                                            </>
                                        ) : null}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 특허 평가등급 — 왼쪽 등급 행, 오른쪽 레이더. */}
                <section aria-labelledby="patent-report-grade" className="flex flex-col gap-4">
                    <h2 id="patent-report-grade" className="typo-title-l-bold text-foreground">
                        {PATENT_GRADE_TITLE}
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                        <ul className="flex list-none flex-col gap-4">
                            {metrics.map((metric) => (
                                <li
                                    key={metric.id}
                                    className="border-subtle-3 flex items-center justify-between gap-4 rounded-sm border px-6 py-4"
                                >
                                    <span className="typo-body-xl-bold text-foreground">{metric.label}</span>
                                    {/* 등급 칩 — 색만으로 뜻을 전하지 않도록 등급 글자를 그대로 둔다[5.3.1]. */}
                                    <span className="typo-h4-bold border-navy-200 bg-navy-100 text-navy-600 shrink-0 rounded-sm border px-3 py-1">
                                        {metric.grade}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <GradeRadarChart
                            // 인쇄용 문서라 손이 닿지 않는다 — 말풍선과 펼치는 움직임을 끈다.
                            showTooltip={false}
                            animate={false}
                            ariaLabel={`${PATENT_GRADE_TITLE} — ${PATENT_GRADE_LEGEND.primary}와 ${PATENT_GRADE_LEGEND.comparison} 비교`}
                            targetLabel={PATENT_GRADE_LEGEND.primary}
                            peerLabel={PATENT_GRADE_LEGEND.comparison}
                            data={metrics.map((metric) => ({
                                id: metric.id,
                                label: metric.label,
                                targetScore: metric.score ?? 0,
                                peerScore: metric.peerScore,
                            }))}
                        />
                    </div>
                </section>

                {/* 동일 특허분야 평균(등급) — 항목별 추이 세 장. */}
                <section aria-labelledby="patent-report-peer" className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 id="patent-report-peer" className="typo-title-l-bold text-foreground">
                            {PATENT_PEER_AVERAGE_TITLE}
                        </h2>
                        <p className="typo-body-xl-regular text-foreground-subtle flex">
                            <ListMarker type="unordered-small" />
                            <span className="min-w-0">{PATENT_PEER_AVERAGE_DESCRIPTION}</span>
                        </p>
                    </div>
                    <ul className="grid list-none grid-cols-3 gap-4">
                        {metrics.map((metric) => (
                            <li
                                key={metric.id}
                                className="border-subtle-3 flex min-w-0 flex-col gap-2 rounded-lg border px-6 py-4"
                            >
                                <h3 className="typo-body-xl-bold text-foreground text-center">{metric.label}</h3>
                                {/* 꺾은선은 동일 특허분야 평균, 채운 점은 이 특허(평가대상)의 등급이다. */}
                                <GradeTrendChart
                                    ariaLabel={`${metric.label} — ${PATENT_GRADE_LEGEND.comparison}(등급) 추이와 평가대상 등급`}
                                    seriesLabel={PATENT_GRADE_LEGEND.comparison}
                                    data={[...(metric.peerTrend ?? [])]}
                                    target={metric.targetGrade ? {grade: metric.targetGrade} : undefined}
                                    scale={PATENT_GRADE_SCALE}
                                    color={PATENT_TREND_COLOR[metric.id]}
                                />
                            </li>
                        ))}
                    </ul>
                </section>

                {/* 주의사항 */}
                <section
                    aria-labelledby="patent-report-notice"
                    className="border-subtle-3 flex flex-col gap-4 rounded-lg border p-10"
                >
                    <h2 id="patent-report-notice" className="typo-title-l-bold text-foreground">
                        {PATENT_GRADE_NOTICE.title}
                    </h2>
                    <ol className="typo-body-xl-regular text-foreground-subtle flex list-none flex-col gap-2">
                        {PATENT_GRADE_NOTICE.items.map((item, index) => (
                            <li key={item} className="flex">
                                <ListMarker type="ordered" index={index + 1} />
                                <span className="min-w-0 break-keep">{item}</span>
                            </li>
                        ))}
                    </ol>
                </section>
            </div>
        </article>
    )
}

export {PatentReportDocument, PatentReportHeader}
export type {PatentReportDocumentProps}
