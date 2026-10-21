'use client'

import {ChartReveal} from '@/components/custom/chart-reveal'
import {ColumnChart} from '@/components/custom/column-chart'
import {ComparisonRadarChart, ComparisonRadarLegend} from '@/components/custom/comparison-radar-chart'
import {DistributionCurveChart} from '@/components/custom/distribution-curve-chart'
import {Card, NoticeBox, SectionTitle} from '@/components/custom/innovation-growth-report-parts'
import {ListMarker} from '@/components/custom/list-marker'
import {ScoreGauge} from '@/components/custom/score-gauge'
import {TECH_INDEX_RADAR_STYLE} from '@/components/custom/tech-index-radar-style'
import {
    getTechIndexGrade,
    type InnovationTechIndexCapability,
    type InnovationTechIndexDetail,
    type InnovationTechIndexScoreItem,
} from '@/content/service/k-bigx-innovation-report'

// K-BIGx 기업혁신성장 보고서 · Tech-Index 탭 본문 — 지수설명 → 혁신성장역량지수(점수 게이지 · 표준분포 비교 · 기업 유형별 비교) →
// 4대 혁신역량 점수 → 기업 유형별 4대 혁신역량 비교 → 세부지표별 상대비교분석.
// 보고서 머리 · 탭 줄 · 탭 제목 띠는 innovation-growth-report-document.tsx 가 그린다.
// 반응형 없음 — PC 화면만 그린다(문서 최소 폭 1200, 그보다 좁은 창에서만 가로 스크롤).
//
// [프론트엔드 연동] 값은 detail(report.techIndexDetail)과 점수(score, report.techIndex.score) · 평가일자(evaluationDate) ·
// 기업명(companyName)으로 받는다 — 형태는 content/service/k-bigx-innovation-report.ts 의 InnovationTechIndexDetail.

// 점수가 없을 때 요약 문장.
const NO_SCORE_TEXT = '평가 점수가 없습니다.'

// 막대 색 — 신청기업(isSubject) · 비교 유형 · 4대 역량 카드의 전체기업 막대. 계열은 report-series-*, 전체기업은 구조색 muted.
const SUBJECT_BAR_COLOR = 'var(--ds-report-series-3)'
const TYPE_BAR_COLOR = 'var(--ds-report-series-2)'
const AVERAGE_BAR_COLOR = 'var(--ds-muted)'
// 4대 혁신역량 점수 카드의 신청기업 막대 색 — 역량마다 고정(점수 상태와는 무관하다). [프론트엔드 연동] 역량 id 는 infra · input · activity · output 으로 보낸다 — 다른 id 면 TYPE_BAR_COLOR(report-series-2).
const CAPABILITY_BAR_COLORS: Record<string, string> = {
    infra: 'var(--ds-report-series-4)',
    input: 'var(--ds-report-series-2)',
    activity: 'var(--ds-report-series-5)',
    output: 'var(--ds-report-series-6)',
}

// 점수 만점 — 이 탭의 점수 막대(기업 유형별 비교 · 4대 혁신역량 점수 · 기업 유형별 4대 혁신역량 비교) 공통 눈금.
const SCORE_MAX = 100
// 만점 막대가 닿는 칸 높이 비율 — 값 글자가 한 줄뿐이라 ColumnChart 기본 비율보다 높인다.
const SCORE_MAX_VALUE_RATIO = 0.9
const PRIMARY_LABEL = '신청기업'
const COMPARISON_LABEL = '전체평균'

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

// 4대 혁신역량 점수 카드 — 신청기업(역량 색) · 전체기업 막대 아래에 역량 이름. 이름(h4)이 카드 section 의 이름이 된다.
// 차트 등장 묶음(chart-reveal.tsx) — 같은 줄의 카드는 차례 없이 동시에 움직인다. 2열 그리드는 줄 번호로 묶는다.
const CAPABILITY_REVEAL_GROUP = 'tech-index-capability'
const GRID_COLUMNS = 2
const rowRevealGroup = (prefix: string, index: number) => `${prefix}-row-${Math.floor(index / GRID_COLUMNS)}`

const CapabilityScoreCard = ({capability}: {capability: InnovationTechIndexCapability}) => (
    <section
        aria-labelledby={`ig-tech-index-capability-${capability.id}`}
        className="border-subtle-3 bg-card flex min-w-0 flex-col gap-4 rounded-sm border p-6"
    >
        {/* 네 카드는 한 줄이라 차례 없이 동시에 움직인다(같은 group). */}
        <ChartReveal group={CAPABILITY_REVEAL_GROUP}>
            <ColumnChart
                data={[
                    {
                        id: 'subject',
                        label: PRIMARY_LABEL,
                        value: capability.score,
                        color: CAPABILITY_BAR_COLORS[capability.id] ?? TYPE_BAR_COLOR,
                    },
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
            <h4
                id={`ig-tech-index-capability-${capability.id}`}
                className="typo-body-xl-bold text-foreground text-center"
            >
                {capability.label}
            </h4>
        </ChartReveal>
    </section>
)

type InnovationGrowthReportTechIndexProps = {
    detail: InnovationTechIndexDetail
    score: number
    companyName: string
    /** 게이지 아래 평가일자. */
    evaluationDate: string
}

const InnovationGrowthReportTechIndex = ({
    detail,
    score,
    companyName,
    evaluationDate,
}: InnovationGrowthReportTechIndexProps) => {
    const {standard} = detail
    // 게이지 색 · 상태 이름 · 요약 문장 점수는 모두 점수 하나로 정한다 — 서로 어긋나지 않게.
    const grade = getTechIndexGrade(score)
    const scoreText = `${scoreFormatter.format(score)}점`

    return (
        <>
            {/* 지수설명 — 탭 제목 띠에 붙여 둔다(-mt-4 로 문서 간격을 줄인다). 설명은 줄마다 목록 한 항목. */}
            <section
                aria-labelledby="ig-tech-index-description"
                className="border-subtle-3 bg-card -mt-4 flex flex-col gap-4 rounded-lg border px-10 py-8"
            >
                <h3 id="ig-tech-index-description" className="typo-h4-bold text-foreground">
                    지수설명
                </h3>
                <ul className="typo-body-xl-regular text-foreground-subtle flex flex-col gap-2">
                    {detail.descriptions.map((description) => (
                        <li key={description} className="flex">
                            <ListMarker type="unordered" />
                            <span className="min-w-0 break-keep">{description}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* 혁신성장역량지수 — 구획 제목 없이 카드만 둔다(제목은 낭독기용). */}
            <section aria-labelledby="ig-tech-index-score" className="flex flex-col gap-6">
                <h3 id="ig-tech-index-score" className="sr-only">
                    혁신성장역량지수
                </h3>
                <div className="grid grid-cols-2 gap-6">
                    {/* 제목 없는 카드 — 게이지 · 평가일자 · 요약 상자를 옆 카드와 같은 높이의 세로 가운데에 둔다. */}
                    <Card className="justify-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <ScoreGauge
                                score={score}
                                statusLabel={grade.label}
                                tone={grade.tone}
                                ariaLabel={`Tech-Index ${scoreText}, ${grade.label}`}
                                className="w-80"
                            />
                            <dl className="flex flex-wrap items-center justify-center gap-x-2">
                                <dt className="typo-body-xl-regular text-foreground-subtle">평가일자</dt>
                                <dd className="typo-body-xl-medium text-label-foreground m-0 tabular-nums">
                                    {evaluationDate}
                                </dd>
                            </dl>
                        </div>
                        {/* 점수가 없으면(숫자가 아니면) 문장 대신 '평가 점수가 없습니다.' */}
                        <NoticeBox className="text-center">
                            {Number.isFinite(score) ? (
                                <>
                                    {companyName}의 Tech-Index는{' '}
                                    <strong className="typo-body-xl-bold">{scoreText}</strong>으로 평가되었습니다.
                                </>
                            ) : (
                                NO_SCORE_TEXT
                            )}
                        </NoticeBox>
                    </Card>
                    <Card
                        title="Tech-Index 표준정보 비교"
                        aside={`전체 평균 ${scoreFormatter.format(standard.mean)}점`}
                        className="gap-4"
                    >
                        <DistributionCurveChart
                            mean={standard.mean}
                            standardDeviation={standard.standardDeviation}
                            value={score}
                            markerLabel={standard.percentileLabel}
                            // 점 글자는 곡선과 겹쳐도 늘 점 아래.
                            markerLabelBelow
                            ariaLabel={`Tech-Index 표준분포와 신청기업 위치 — ${standard.percentileLabel}`}
                        />
                        <NoticeBox className="text-center">
                            <SummaryText parts={standard.summary} />
                        </NoticeBox>
                    </Card>
                </div>
                <Card title="기업 유형별 Tech-Index 비교" className="gap-4">
                    <ColumnChart
                        data={toColumnData(detail.companyTypes)}
                        valueFractionDigits={1}
                        barWidth={48}
                        variant="cells"
                        showTooltip={false}
                        scaleMax={SCORE_MAX}
                        maxValueRatio={SCORE_MAX_VALUE_RATIO}
                        ariaLabel="기업 유형별 Tech-Index 점수"
                    />
                </Card>
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
                    {detail.capabilityByType.map((capability, index) => (
                        <Card
                            key={capability.id}
                            title={capability.label}
                            className="gap-4"
                            revealGroup={rowRevealGroup('tech-index-by-type', index)}
                        >
                            <ColumnChart
                                data={toColumnData(capability.items)}
                                valueFractionDigits={1}
                                barWidth={48}
                                variant="cells"
                                showTooltip={false}
                                // 모든 카드가 같은 눈금(0~100점)이라 역량끼리 막대 높이를 견줄 수 있다.
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
                    {detail.indicators.map((indicator, index) => (
                        <Card
                            key={indicator.id}
                            title={indicator.title}
                            className="gap-4"
                            revealGroup={rowRevealGroup('tech-index-indicators', index)}
                        >
                            <ComparisonRadarChart
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
