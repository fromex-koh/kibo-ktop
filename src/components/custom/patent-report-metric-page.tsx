import Image from 'next/image'
import aGrade from '@public/images/grade-medal/a.webp'
import aaGrade from '@public/images/grade-medal/aa.webp'
import aaaGrade from '@public/images/grade-medal/aaa.webp'
import bGrade from '@public/images/grade-medal/b.webp'
import bbGrade from '@public/images/grade-medal/bb.webp'
import bbbGrade from '@public/images/grade-medal/bbb.webp'
import cGrade from '@public/images/grade-medal/c.webp'
import ccGrade from '@public/images/grade-medal/cc.webp'
import cccGrade from '@public/images/grade-medal/ccc.webp'
import {ColumnChart} from '@/components/custom/column-chart'
import {PatentReportHeader} from '@/components/custom/patent-report-document'
import {GradeDistributionChart} from '@/components/custom/grade-distribution-chart'
import {ListMarker} from '@/components/custom/list-marker'
import {
    PATENT_ANALYSIS_FOOTNOTE,
    PATENT_ANALYSIS_TITLE,
    PATENT_DISTRIBUTION_ROW_LABELS,
    PATENT_GRADE_METRICS,
    PATENT_INFLUENCE_BARS,
    PATENT_INFLUENCE_FOOTNOTE,
    PATENT_INFLUENCE_TITLE,
    PATENT_REPORT_INVENTION_TITLE,
    type PatentMetricDetail,
} from '@/content/service/patent-grade'

// 특허평가 결과 보고서(인쇄용)의 항목별 쪽 — 기술다양성 · 시장확장성 · 가치창출가능성이 같은 짜임을 쓴다.
// 짜임(위에서 아래로): 항목 제목 + 설명 줄 → 등급 메달 + 등급 분포 곡선/표 → 영향요인 비교 카드 다섯 →
// 평가대상 특허분석 상자.
//
// [프론트엔드 연동] 한 쪽은 상세 값 하나(PatentMetricDetail)로 완성된다 — 값만 바꾸면 글·메달·곡선·막대가 모두 따라간다.
// 항목을 더하려면 보고서 데이터의 details 에 같은 모양으로 넣으면 쪽이 그만큼 늘어난다.

// 등급 메달 그림 — 등급 아홉 개에 한 장씩. 등급 글자가 그림 안에 있어 alt 는 비우고 옆 글자가 읽어 준다[5.1.1].
const GRADE_MEDALS: Record<string, typeof aaaGrade> = {
    AAA: aaaGrade,
    AA: aaGrade,
    A: aGrade,
    BBB: bbbGrade,
    BB: bbGrade,
    B: bGrade,
    CCC: cccGrade,
    CC: ccGrade,
    C: cGrade,
}

// 막대 색 — 이름 · 순서는 콘텐츠(PATENT_INFLUENCE_BARS)가 갖고, 색만 화면이 갖는다.
const INFLUENCE_BAR_COLOR: Record<(typeof PATENT_INFLUENCE_BARS)[number]['key'], string> = {
    ipcGroup: 'var(--raw-navy-500)',
    top40: 'var(--raw-blue-500)',
    target: 'var(--raw-purple-500)',
}

// 글 안의 **강조** 를 굵은 글자로 바꾼다 — 값이 섞인 문장이라 조각내지 않고 한 문장으로 받는다.
const EMPHASIS_PATTERN = /\*\*(.+?)\*\*/g
const renderEmphasis = (text: string) =>
    text.split(EMPHASIS_PATTERN).map((part, index) =>
        // split 의 홀수 자리가 괄호로 묶인 강조 부분이다.
        index % 2 === 1 ? (
            <strong key={index} className="font-bold">
                {part}
            </strong>
        ) : (
            part
        ),
    )

// 설명 줄 — 점 하나에 글 한 줄.
const DetailLines = ({items}: {items: readonly string[]}) => (
    <ul className="typo-body-xl-regular text-foreground-subtle flex list-none flex-col gap-1">
        {items.map((item) => (
            <li key={item} className="flex">
                <ListMarker type="unordered-small" />
                <span className="min-w-0 break-keep">{renderEmphasis(item)}</span>
            </li>
        ))}
    </ul>
)

type PatentReportMetricPageProps = {
    detail: PatentMetricDetail
    /** 쪽 머리의 발명의명칭(등록번호) 줄 — 보고서의 특허개요 값에서 만든다. */
    inventionTitle: string
}

const PatentReportMetricPage = ({detail, inventionTitle}: PatentReportMetricPageProps) => {
    const metricLabel = PATENT_GRADE_METRICS.find((metric) => metric.id === detail.id)?.label ?? ''
    const medal = GRADE_MEDALS[detail.grade]

    return (
        <article className="flex h-full flex-col">
            <PatentReportHeader />
            <div className="flex flex-col gap-10 px-20 pt-15">
                <section aria-labelledby={`patent-report-${detail.id}-invention`} className="flex flex-col gap-2">
                    <h2 id={`patent-report-${detail.id}-invention`} className="typo-h4-bold text-foreground">
                        {PATENT_REPORT_INVENTION_TITLE}
                    </h2>
                    <p className="typo-body-xl-regular text-foreground-subtle break-keep">{inventionTitle}</p>
                </section>
                {/* 항목 등급 — 메달과 등급 분포. */}
                <section aria-labelledby={`patent-report-${detail.id}`} className="flex flex-col gap-1">
                    <h2 id={`patent-report-${detail.id}`} className="typo-title-l-bold text-foreground">
                        {metricLabel}
                    </h2>
                    <DetailLines items={detail.summaryLines} />
                    <div className="mt-5 flex items-center gap-6">
                        <div className="flex w-55 shrink-0 flex-col items-center">
                            {medal ? <Image src={medal} alt="" priority className="h-69 w-auto" /> : null}
                            <span className="sr-only">{`${metricLabel} ${detail.grade} 등급`}</span>
                        </div>
                        <GradeDistributionChart
                            className="flex-1"
                            ariaLabel={`${metricLabel} 등급 분포 — 평가대상 등급 ${detail.grade}`}
                            data={detail.distribution}
                            activeGrade={detail.grade}
                            gradeRowLabel={PATENT_DISTRIBUTION_ROW_LABELS.grade}
                            percentRowLabel={PATENT_DISTRIBUTION_ROW_LABELS.percent}
                            cumulativeRowLabel={PATENT_DISTRIBUTION_ROW_LABELS.cumulative}
                        />
                    </div>
                </section>

                {/* 영향요인 비교 — 카드 다섯 장, 카드마다 막대 셋. */}
                <section aria-labelledby={`patent-report-${detail.id}-influence`} className="flex flex-col gap-1">
                    <h2 id={`patent-report-${detail.id}-influence`} className="typo-title-l-bold text-foreground">
                        {PATENT_INFLUENCE_TITLE}
                    </h2>
                    <DetailLines items={detail.influenceLines} />
                    <ul className="mt-4 grid list-none grid-cols-5 gap-4">
                        {detail.influenceFactors.map((factor) => (
                            <li
                                key={factor.id}
                                className="border-subtle-3 flex min-w-0 flex-col gap-4 rounded-lg border px-6 pt-6 pb-4"
                            >
                                <h3 className="typo-body-xl-bold text-foreground break-keep">{factor.label}</h3>
                                {/* 값은 표로 따로 보여 주지 않으므로 막대 위에 적지 않는다 — 셋의 높이를 견주는 그림이다. */}
                                <ColumnChart
                                    ariaLabel={`${factor.label} — ${PATENT_INFLUENCE_BARS.map((bar) => bar.label.replace('\n', ' ')).join(' · ')} 비교`}
                                    animate={false}
                                    showTooltip={false}
                                    showValueLabels={false}
                                    variant="plain"
                                    barWidth={24}
                                    data={PATENT_INFLUENCE_BARS.map((bar) => ({
                                        id: bar.key,
                                        label: bar.label,
                                        value: factor[bar.key],
                                        color: INFLUENCE_BAR_COLOR[bar.key],
                                    }))}
                                />
                            </li>
                        ))}
                    </ul>
                    <p className="typo-body-l-regular text-foreground-subtle mt-1 break-keep">
                        {PATENT_INFLUENCE_FOOTNOTE}
                    </p>
                </section>

                {/* 평가대상 특허분석 — 옅은 남색 상자. */}
                <div className="flex flex-col gap-2">
                    <section
                        aria-labelledby={`patent-report-${detail.id}-analysis`}
                        className="bg-navy-100 flex flex-col gap-4 rounded-lg px-10 py-8"
                    >
                        <h2
                            id={`patent-report-${detail.id}-analysis`}
                            className="typo-title-l-bold text-navy-600"
                        >{`${PATENT_ANALYSIS_TITLE} (${metricLabel})`}</h2>
                        <p className="typo-body-xl-regular text-navy-600 break-keep">
                            {renderEmphasis(detail.analysis)}
                        </p>
                    </section>
                    <p className="typo-body-l-regular text-foreground-subtle break-keep">{PATENT_ANALYSIS_FOOTNOTE}</p>
                </div>
            </div>
        </article>
    )
}

export {PatentReportMetricPage}
export type {PatentReportMetricPageProps}
