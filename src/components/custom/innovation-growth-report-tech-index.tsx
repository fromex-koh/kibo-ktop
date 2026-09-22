'use client'

import {Badge} from '@/components/ui/badge'
import {ARC_GAUGE_TONE_COLORS} from '@/components/custom/arc-gauge-shape'
import {ColumnChart} from '@/components/custom/column-chart'
import {ComparisonRadarChart, ComparisonRadarLegend} from '@/components/custom/comparison-radar-chart'
import {DistributionCurveChart} from '@/components/custom/distribution-curve-chart'
import {Card, NoticeBox, SectionTitle} from '@/components/custom/innovation-growth-report-parts'
import {ListMarker} from '@/components/custom/list-marker'
import {ScoreGauge, type ScoreGaugeTone} from '@/components/custom/score-gauge'
import {SegmentMeter} from '@/components/custom/segment-meter'
import {TECH_INDEX_RADAR_STYLE} from '@/components/custom/tech-index-radar-style'
import {cn} from '@/lib/utils'
import {
    getTechIndexGrade,
    getTechIndexLevel,
    TECH_INDEX_GRADES,
    TECH_INDEX_LEVEL_COUNT,
    type InnovationTechIndexCapability,
    type InnovationTechIndexDetail,
    type InnovationTechIndexScoreItem,
} from '@/content/service/k-bigx-innovation-report'

// K-BIGx 기업혁신성장 보고서 · Tech-Index 탭 본문 — 혁신성장역량지수(점수 · 표준분포 · 기업 유형별 비교 · 지수설명) →
// 4대 혁신역량 점수 → 기업 유형별 4대 혁신역량 비교 → 세부지표별 상대비교분석.
// 보고서 머리 · 탭 줄 · 탭 제목 줄은 innovation-growth-report-document.tsx 가 그린다.
// 반응형 없음 — PC 폭(1280)만 그린다(좁으면 문서가 가로로 넘친다).
//
// [프론트엔드 연동] 값은 detail(report.techIndexDetail)과 점수(score, report.techIndex) · 기업명(companyName)으로
// 받는다 — 형태는 content/service/k-bigx-innovation-report.ts 의 InnovationTechIndexDetail.

// 막대 색 — 신청기업은 purple.500, 비교 유형은 blue.500. 4대 역량 카드의 전체기업 막대는 gray.100.
const SUBJECT_BAR_COLOR = 'var(--raw-purple-500)'
const TYPE_BAR_COLOR = 'var(--raw-blue-500)'
const AVERAGE_BAR_COLOR = 'var(--raw-gray-100)'

// 점수 만점 — 이 탭의 점수 막대(기업 유형별 비교 · 4대 혁신역량 점수 · 기업 유형별 4대 혁신역량 비교) 공통 눈금.
const SCORE_MAX = 100
// 만점 막대가 닿는 칸 높이 비율 — 값 글자가 한 줄뿐이라 공통 비율(78%)보다 높인다(100점 = 180px).
const SCORE_MAX_VALUE_RATIO = 0.9
const PRIMARY_LABEL = '신청기업'
const COMPARISON_LABEL = '전체평균'

// 상태 뱃지 색 — 우수 info · 양호 success · 보통 orange · 미흡 error · 취약 neutral.
const TONE_BADGE_COLORS = {
    excellent: 'info',
    good: 'success',
    normal: 'secondary-orange',
    poor: 'error',
    weak: 'neutral',
} as const satisfies Record<ScoreGaugeTone, string>

// 점수 — 게이지와 같이 소수 첫째 자리까지(73.8).
const scoreFormatter = new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 1})

const toColumnData = (items: readonly InnovationTechIndexScoreItem[]) =>
    items.map((item) => ({
        id: item.id,
        label: item.label,
        value: item.value,
        color: item.isSubject ? SUBJECT_BAR_COLOR : TYPE_BAR_COLOR,
    }))

// 요약 문장 — 굵게(isStrong) · 줄바꿈(isLineBreak) 조각을 이어 붙인다.
const SummaryText = ({parts}: {parts: readonly {text: string; isStrong?: boolean; isLineBreak?: boolean}[]}) => (
    <>
        {parts.map((part, index) =>
            part.isLineBreak ? (
                <br key={index} />
            ) : part.isStrong ? (
                <strong key={index} className="typo-body-xl-bold">
                    {part.text}
                </strong>
            ) : (
                <span key={index}>{part.text}</span>
            ),
        )}
    </>
)

// 점수 구간표 — 머리 '구분'(두 칸 합침) · 구간 · 상태. 현재 상태 줄은 옅은 파랑 면 + blue.600 Bold 로 강조하고,
// 화면 낭독기에는 '(현재)'를 덧붙여 색에만 기대지 않는다[5.3.1].
const GradeTable = ({currentTone}: {currentTone: ScoreGaugeTone}) => (
    <table className="border-t-foreground-subtle typo-caption-regular text-label-foreground w-full table-fixed border-collapse border-t">
        <caption className="sr-only">Tech-Index 점수 구간</caption>
        <thead>
            <tr>
                <th
                    scope="colgroup"
                    colSpan={2}
                    className="border-subtle-3 bg-primary-subtle typo-caption-bold text-foreground border-b px-4 py-2"
                >
                    구분
                </th>
            </tr>
        </thead>
        <tbody>
            {TECH_INDEX_GRADES.map((grade) => {
                const isCurrent = grade.tone === currentTone
                const cellClassName = cn(
                    'border-subtle-3 border-b px-4 py-2 text-center',
                    isCurrent && 'bg-primary-subtle typo-caption-bold text-blue-600',
                )
                return (
                    <tr key={grade.range}>
                        <td className={cn(cellClassName, 'border-r')}>{grade.range}</td>
                        <td className={cellClassName}>
                            {grade.label}
                            {isCurrent ? <span className="sr-only"> (현재)</span> : null}
                        </td>
                    </tr>
                )
            })}
        </tbody>
    </table>
)

// 4대 혁신역량 점수 카드 — 신청기업 · 전체기업 막대(칸형) → 16 → 역량 이름 16 Bold + 상태 뱃지 → 8 → 10단계 칸 막대.
// 상태(우수 · 양호 · 보통 · 미흡 · 취약)와 칸 수는 신청기업 점수로 정한다 — 점수 구간표(TECH_INDEX_GRADES)와 같은 기준이다.
const CapabilityScoreCard = ({capability}: {capability: InnovationTechIndexCapability}) => {
    const grade = getTechIndexGrade(capability.score)
    const level = getTechIndexLevel(capability.score)
    const color = ARC_GAUGE_TONE_COLORS[grade.tone]
    return (
        <section
            aria-labelledby={`ig-tech-index-capability-${capability.id}`}
            className="border-subtle-3 bg-card flex min-w-0 flex-col gap-4 rounded-sm border p-6"
        >
            <ColumnChart
                animate={false}
                data={[
                    {id: 'subject', label: PRIMARY_LABEL, value: capability.score, color},
                    {id: 'average', label: '전체기업', value: capability.average, color: AVERAGE_BAR_COLOR},
                ]}
                valueFractionDigits={1}
                barWidth={48}
                variant="cells"
                showTooltip={false}
                // 네 카드가 같은 눈금(0~100점)으로 그려져 역량끼리 막대 높이를 견줄 수 있다.
                scaleMax={SCORE_MAX}
                maxValueRatio={SCORE_MAX_VALUE_RATIO}
                ariaLabel={`${capability.label} — 신청기업과 전체기업 점수`}
            />
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                    <h4 id={`ig-tech-index-capability-${capability.id}`} className="typo-body-xl-bold text-foreground">
                        {capability.label}
                    </h4>
                    <Badge size="xs" shape="round" color={TONE_BADGE_COLORS[grade.tone]}>
                        {grade.label}
                    </Badge>
                </div>
                <SegmentMeter
                    value={level}
                    total={TECH_INDEX_LEVEL_COUNT}
                    color={color}
                    ariaLabel={`${capability.label} ${TECH_INDEX_LEVEL_COUNT}단계 중 ${level}단계`}
                />
            </div>
        </section>
    )
}

type InnovationGrowthReportTechIndexProps = {
    detail: InnovationTechIndexDetail
    score: number
    companyName: string
    /** 게이지 아래 기준일자. */
    baseDate: string
}

const InnovationGrowthReportTechIndex = ({
    detail,
    score,
    companyName,
    baseDate,
}: InnovationGrowthReportTechIndexProps) => {
    const {standard} = detail
    // 게이지 색 · 상태 이름 · 구간표 강조 줄 · 요약 문장 점수는 모두 점수 하나로 정한다 — 서로 어긋나지 않게.
    const grade = getTechIndexGrade(score)
    const scoreText = `${scoreFormatter.format(score)}점`

    return (
        <>
            {/* 혁신성장역량지수 */}
            <section aria-labelledby="ig-tech-index-score" className="flex flex-col gap-4">
                <SectionTitle id="ig-tech-index-score" title="혁신성장역량지수" />
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* 제목 없는 카드 — 게이지 · 구간표 · 요약 묶음을 카드 높이(옆 카드와 같음)의 세로 가운데에 둔다. */}
                        <Card className="justify-center">
                            <div className="flex items-center gap-6">
                                <ScoreGauge
                                    score={score}
                                    statusLabel={grade.label}
                                    tone={grade.tone}
                                    caption={`기준일자 · ${baseDate}`}
                                    ariaLabel={`Tech-Index ${scoreText}, ${grade.label}`}
                                    className="w-80 shrink-0"
                                />
                                <GradeTable currentTone={grade.tone} />
                            </div>
                            <NoticeBox className="text-center">
                                {companyName}의 Tech-Index는 <strong className="typo-body-xl-bold">{scoreText}</strong>
                                으로 평가되었습니다.
                            </NoticeBox>
                        </Card>
                        <Card
                            title="Tech-Index 표준정보 비교"
                            aside={`전체 평균 ${new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 1}).format(standard.mean)}점`}
                        >
                            <DistributionCurveChart
                                animate={false}
                                mean={standard.mean}
                                standardDeviation={standard.standardDeviation}
                                value={score}
                                markerLabel={standard.percentileLabel}
                                ariaLabel={`Tech-Index 표준분포와 신청기업 위치 — ${standard.percentileLabel}`}
                            />
                            <NoticeBox className="text-center">
                                <SummaryText parts={standard.summary} />
                            </NoticeBox>
                        </Card>
                    </div>
                    <Card title="기업 유형별 Tech-Index 비교">
                        <ColumnChart
                            animate={false}
                            data={toColumnData(detail.companyTypes)}
                            valueFractionDigits={1}
                            barWidth={48}
                            variant="cells"
                            showTooltip={false}
                            scaleMax={SCORE_MAX}
                            maxValueRatio={SCORE_MAX_VALUE_RATIO}
                            ariaLabel="기업 유형별 Tech-Index 점수"
                        />
                        <div className="flex flex-col gap-2">
                            <h5 className="typo-body-xl-bold text-foreground">지수설명</h5>
                            <ul className="typo-body-xl-regular text-foreground-subtle flex flex-col gap-1">
                                {detail.descriptions.map((description) => (
                                    <li key={description} className="flex">
                                        <ListMarker type="unordered" />
                                        <span className="min-w-0 break-keep">{description}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                </div>
            </section>

            {/* 4대 혁신역량 점수 */}
            <section aria-labelledby="ig-tech-index-capability" className="flex flex-col gap-4">
                <SectionTitle id="ig-tech-index-capability" title="4대 혁신역량 점수" />
                <div className="grid grid-cols-4 gap-6">
                    {detail.capabilities.map((capability) => (
                        <CapabilityScoreCard key={capability.id} capability={capability} />
                    ))}
                </div>
            </section>

            {/* 기업 유형별 4대 혁신역량 비교 */}
            <section aria-labelledby="ig-tech-index-by-type" className="flex flex-col gap-4">
                <SectionTitle id="ig-tech-index-by-type" title="기업 유형별 4대 혁신역량 비교" />
                <div className="grid grid-cols-2 gap-6">
                    {detail.capabilityByType.map((capability) => (
                        <Card key={capability.id} title={capability.label}>
                            <ColumnChart
                                animate={false}
                                data={toColumnData(capability.items)}
                                valueFractionDigits={1}
                                barWidth={48}
                                variant="cells"
                                showTooltip={false}
                                // 네 카드가 같은 눈금(0~100점)이라 역량끼리 막대 높이를 견줄 수 있다.
                                scaleMax={SCORE_MAX}
                                maxValueRatio={SCORE_MAX_VALUE_RATIO}
                                ariaLabel={`기업 유형별 ${capability.label} 점수`}
                            />
                        </Card>
                    ))}
                </div>
            </section>

            {/* 세부지표별 상대비교분석 — 범례는 구획 제목 줄 오른쪽에 한 번만 둔다(두 카드가 같은 범례). */}
            <section aria-labelledby="ig-tech-index-indicators" className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <SectionTitle id="ig-tech-index-indicators" title="세부지표별 상대비교분석" />
                    <ComparisonRadarLegend
                        primaryLabel={PRIMARY_LABEL}
                        comparisonLabel={COMPARISON_LABEL}
                        primaryColor={TECH_INDEX_RADAR_STYLE.primaryColor}
                        comparisonColor={TECH_INDEX_RADAR_STYLE.comparisonColor}
                        comparisonFillOpacity={TECH_INDEX_RADAR_STYLE.comparisonFillOpacity}
                        className="shrink-0"
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {detail.indicators.map((indicator) => (
                        <Card key={indicator.id} title={indicator.title}>
                            <ComparisonRadarChart
                                animate={false}
                                data={indicator.items.map((item) => ({
                                    id: item.label,
                                    label: item.label,
                                    primaryValue: item.company,
                                    comparisonValue: item.average,
                                }))}
                                {...TECH_INDEX_RADAR_STYLE}
                                primaryLabel={PRIMARY_LABEL}
                                comparisonLabel={COMPARISON_LABEL}
                                ariaLabel={`${indicator.title} — 신청기업과 전체평균`}
                            />
                        </Card>
                    ))}
                </div>
            </section>
        </>
    )
}

export {InnovationGrowthReportTechIndex}
export type {InnovationGrowthReportTechIndexProps}
