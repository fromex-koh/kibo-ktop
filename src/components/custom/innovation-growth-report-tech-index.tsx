'use client'

import {EmptyState} from '@/components/composite/empty-state'
import {TruncatedText} from '@/components/composite/truncated-text'
import {ChartReveal} from '@/components/custom/chart-reveal'
import {ColumnChart} from '@/components/custom/column-chart'
import {ComparisonRadarChart, ComparisonRadarLegend} from '@/components/custom/comparison-radar-chart'
import {DistributionCurveChart} from '@/components/custom/distribution-curve-chart'
import {Card, NoticeBox, SectionTitle, SubSectionTitle} from '@/components/custom/innovation-growth-report-parts'
import {ListMarker} from '@/components/custom/list-marker'
import {ScoreGauge} from '@/components/custom/score-gauge'
import {TECH_INDEX_RADAR_STYLE} from '@/components/custom/tech-index-radar-style'
import {
    getTechIndexGrade,
    TECH_INDEX_CAPABILITIES,
    TECH_INDEX_FALLBACK_STANDARD,
    TECH_INDEX_INDICATOR_TITLES,
    type InnovationTechIndexCapability,
    type InnovationTechIndexDetail,
    type InnovationTechIndexScoreItem,
    INNOVATION_REPORT_SCORE_MAX,
} from '@/content/service/k-bigx-innovation-report'

// K-BIGx 기업혁신성장 보고서 · Tech-Index 탭 본문 — 지수설명 → 혁신성장역량지수(점수 게이지 · 표준분포 비교) →
// 혁신성장역량지수 부문별 지표 비교 → 혁신성장역량지수 비교(기업 유형별 Tech-Index 비교 · 4대 혁신역량 부분별 비교 ·
// 기업 유형별 4대 혁신역량 비교).
// 순서는 PDF 템플릿(kbigx-print-tech-index.tsx)과 같다.
// 보고서 머리 · 탭 줄 · 탭 제목 띠는 innovation-growth-report-document.tsx 가 그린다.
// 반응형 없음 — PC 화면만 그린다(문서 최소 폭 1200, 그보다 좁은 창에서만 가로 스크롤).
//
// [프론트엔드 연동] 값은 detail(report.techIndexDetail)과 점수(score, report.techIndex.score) · 평가일자(evaluationDate) ·
// 기업명(companyName)으로 받는다 — 형태는 content/service/k-bigx-innovation-report.ts 의 InnovationTechIndexDetail.

// 점수가 없을 때 요약 문장.
const NO_SCORE_TEXT = '평가 점수가 없습니다.'
// Tech-Index 표준정보 비교 — 점수 · 비교 문장이 없을 때 요약 상자 문구.
const NO_STANDARD_TEXT = '표준정보 비교 결과가 없습니다.'
const EMPTY_VALUE = '-'

// 막대 색 — 신청기업(isSubject) · 비교 유형 · 4대 역량 카드의 전체기업 막대. 계열은 report-series-*, 전체기업은 구조색 muted.
const SUBJECT_BAR_COLOR = 'var(--ds-report-series-3)'
const TYPE_BAR_COLOR = 'var(--ds-report-series-2)'
const AVERAGE_BAR_COLOR = 'var(--ds-muted)'
// 4대 혁신역량 부분별 비교 카드의 신청기업 막대 색 — 역량마다 고정(점수 상태와는 무관하다). [프론트엔드 연동] 역량 id 는 infra · input · activity · output 으로 보낸다 — 다른 id 면 TYPE_BAR_COLOR(report-series-2).
const CAPABILITY_BAR_COLORS: Record<string, string> = {
    infra: 'var(--ds-report-series-4)',
    input: 'var(--ds-report-series-2)',
    activity: 'var(--ds-report-series-5)',
    output: 'var(--ds-report-series-6)',
}

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

// 문장 속 기업명 — 기업명만 한 줄로 말줄임(…)하고 뒤 글자(예: '의')는 붙여 남긴다. 잘렸을 때만 마우스 올리기 · 탭으로 전체 이름을
// 툴팁으로 본다(PDF 템플릿 WithTruncatedName 과 같은 모양). 기업명이 길어도 문장이 이상하게 접히지 않는다.
const CompanyNameInline = ({name, suffix}: {name: string; suffix: string}) => (
    <span className="inline-flex max-w-full align-bottom">
        <TruncatedText lines={1} className="min-w-0">
            {name}
        </TruncatedText>
        <span className="shrink-0 whitespace-pre">{suffix}</span>
    </span>
)
// 조각 글 — 기업명이 들어 있으면 그 앞 · 기업명(말줄임) + 바로 뒤 조사(예: '는') · 나머지 문장으로 나눈다.
// 조사만 기업명에 붙여 두고 나머지 문장은 자연스럽게 줄을 바꾼다(문장 전체를 한 줄로 묶으면 좁은 화면에서 넘친다).
const LEADING_WORD = /^\S*/
const WithCompanyName = ({text, companyName}: {text: string; companyName: string}) => {
    const index = companyName ? text.indexOf(companyName) : -1
    if (index < 0) return <span>{text}</span>
    const after = text.slice(index + companyName.length)
    const particle = LEADING_WORD.exec(after)?.[0] ?? ''
    return (
        <>
            {text.slice(0, index)}
            <CompanyNameInline name={companyName} suffix={particle} />
            {after.slice(particle.length)}
        </>
    )
}

// 요약 문장 — 굵게(isStrong) · 줄바꿈(isLineBreak) 조각을 이어 붙인다. 기업명은 한 줄 말줄임(WithCompanyName).
const SummaryText = ({
    parts,
    companyName,
}: {
    parts: readonly {text: string; isStrong?: boolean; isLineBreak?: boolean}[]
    companyName: string
}) => (
    <>
        {parts.map((part, index) =>
            part.isLineBreak ? (
                <br key={index} />
            ) : part.isStrong ? (
                <strong key={index} className="typo-body-xl-bold">
                    {part.text}
                </strong>
            ) : (
                <WithCompanyName key={index} text={part.text} companyName={companyName} />
            ),
        )}
    </>
)

// 4대 혁신역량 부분별 비교 카드 — 신청기업(역량 색) · 전체기업 막대 아래에 역량 이름. 이름(h5 — 소구획 제목 h4 아래)이 카드 section 의 이름이 된다.
// 차트 등장 묶음(chart-reveal.tsx) — 같은 줄의 카드는 차례 없이 동시에 움직인다. 2열 그리드는 줄 번호로 묶는다.
const CAPABILITY_REVEAL_GROUP = 'tech-index-capability'
const GRID_COLUMNS = 2
const rowRevealGroup = (prefix: string, index: number) => `${prefix}-row-${Math.floor(index / GRID_COLUMNS)}`

// 역량(capability)을 받지 못했거나 두 점수가 모두 없으면 막대 자리에 빈 상태, 한쪽만 없으면 그 막대 자리에 '-'.
const CapabilityScoreCard = ({
    id,
    label,
    capability,
}: {
    id: string
    label: string
    capability?: InnovationTechIndexCapability
}) => (
    <section
        aria-labelledby={`ig-tech-index-capability-${id}`}
        className="border-subtle-3 bg-card flex min-w-0 flex-col gap-4 rounded-sm border p-6"
    >
        {/* 네 카드는 한 줄이라 차례 없이 동시에 움직인다(같은 group). */}
        <ChartReveal group={CAPABILITY_REVEAL_GROUP}>
            {capability && (Number.isFinite(capability.score) || Number.isFinite(capability.average)) ? (
                <ColumnChart
                    data={[
                        {
                            id: 'subject',
                            label: PRIMARY_LABEL,
                            value: capability.score,
                            color: CAPABILITY_BAR_COLORS[id] ?? TYPE_BAR_COLOR,
                        },
                        {id: 'average', label: '전체기업', value: capability.average, color: AVERAGE_BAR_COLOR},
                    ]}
                    valueFractionDigits={1}
                    barWidth={48}
                    variant="cells"
                    showTooltip={false}
                    // 네 카드가 같은 눈금(0~100점)으로 그려져 역량끼리 막대 높이를 견줄 수 있다.
                    scaleMax={INNOVATION_REPORT_SCORE_MAX}
                    maxValueRatio={SCORE_MAX_VALUE_RATIO}
                    missingValueText={EMPTY_VALUE}
                    ariaLabel={`${label} — 신청기업과 전체기업 점수`}
                />
            ) : (
                <EmptyState className="min-h-56.5" />
            )}
            <h5 id={`ig-tech-index-capability-${id}`} className="typo-body-xl-bold text-foreground text-center">
                {label}
            </h5>
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
    // 값이 숫자일 때만 '있음' — 점수가 없으면 위치 점 · 비교 문장을 빼고, 분포 값이 없으면 평균을 '-'로 적는다.
    const hasScore = Number.isFinite(score)
    const hasStandard = Number.isFinite(standard.mean) && Number.isFinite(standard.standardDeviation)

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
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {/* 제목 없는 카드 — 게이지 · 평가일자 · 요약 상자를 옆 카드와 같은 높이의 세로 가운데에 둔다. */}
                    <Card className="justify-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <ScoreGauge
                                score={score}
                                statusLabel={grade.label}
                                tone={grade.tone}
                                ariaLabel={
                                    hasScore ? `Tech-Index ${scoreText}, ${grade.label}` : `Tech-Index ${NO_SCORE_TEXT}`
                                }
                                className="w-80"
                            />
                            <dl className="flex flex-wrap items-center justify-center gap-x-2">
                                <dt className="typo-body-xl-regular text-foreground-subtle">평가일자</dt>
                                <dd className="typo-body-xl-medium text-label-foreground m-0 tabular-nums">
                                    {evaluationDate || EMPTY_VALUE}
                                </dd>
                            </dl>
                        </div>
                        {/* 점수가 없으면(숫자가 아니면) 문장 대신 '평가 점수가 없습니다.' */}
                        <NoticeBox className="text-center">
                            {hasScore ? (
                                <>
                                    <CompanyNameInline name={companyName} suffix="의" /> Tech-Index는{' '}
                                    <strong className="typo-body-xl-bold">{scoreText}</strong>으로 평가되었습니다.
                                </>
                            ) : (
                                NO_SCORE_TEXT
                            )}
                        </NoticeBox>
                    </Card>
                    {/* 데이터가 없을 때 — 평균이 없으면 '전체 평균 -점', 곡선은 모양용 값으로 그대로 그린다.
                        점수가 없으면 위치 점(상위 nn%)을 빼고, 요약 상자는 '표준정보 비교 결과가 없습니다.' */}
                    <Card
                        title="Tech-Index 표준정보 비교"
                        aside={`전체 평균 ${hasStandard ? scoreFormatter.format(standard.mean) : EMPTY_VALUE}점`}
                        className="gap-4"
                    >
                        <DistributionCurveChart
                            mean={hasStandard ? standard.mean : TECH_INDEX_FALLBACK_STANDARD.mean}
                            standardDeviation={
                                hasStandard
                                    ? standard.standardDeviation
                                    : TECH_INDEX_FALLBACK_STANDARD.standardDeviation
                            }
                            value={hasScore ? score : undefined}
                            markerLabel={hasScore ? standard.percentileLabel : undefined}
                            // 점 글자는 곡선과 겹쳐도 늘 점 아래.
                            markerLabelBelow
                            ariaLabel={
                                hasScore
                                    ? `Tech-Index 표준분포와 신청기업 위치 — ${standard.percentileLabel}`
                                    : `Tech-Index 표준분포 — ${NO_SCORE_TEXT}`
                            }
                        />
                        <NoticeBox className="text-center">
                            {hasScore && standard.summary.length ? (
                                <SummaryText parts={standard.summary} companyName={companyName} />
                            ) : (
                                NO_STANDARD_TEXT
                            )}
                        </NoticeBox>
                    </Card>
                </div>
            </section>

            {/* 혁신성장역량지수 부문별 지표 비교 — 범례는 구획 제목 줄 오른쪽에 한 번만 둔다(두 카드가 같은 범례). */}
            <section aria-labelledby="ig-tech-index-indicators" className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <SectionTitle id="ig-tech-index-indicators" title="혁신성장역량지수 부문별 지표 비교" />
                    <ComparisonRadarLegend
                        primaryLabel={PRIMARY_LABEL}
                        comparisonLabel={COMPARISON_LABEL}
                        primaryColor={TECH_INDEX_RADAR_STYLE.primaryColor}
                        comparisonColor={TECH_INDEX_RADAR_STYLE.comparisonColor}
                        comparisonFillOpacity={TECH_INDEX_RADAR_STYLE.comparisonFillOpacity}
                        className="shrink-0"
                    />
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {/* 카드 두 장은 늘 그린다 — 받은 지표 묶음이 없거나 비면 그래프 대신 빈 상태(그래프 칸 높이 h-54 = 216). */}
                    {TECH_INDEX_INDICATOR_TITLES.map((title, index) => {
                        const items = detail.indicators.find((indicator) => indicator.title === title)?.items ?? []
                        return (
                            <Card
                                key={title}
                                title={title}
                                className="gap-4"
                                revealGroup={rowRevealGroup('tech-index-indicators', index)}
                            >
                                {items.length ? (
                                    <ComparisonRadarChart
                                        // 점수가 없는 지표는 꼭짓점을 0 에 두고 값 글자는 '-'(PDF 템플릿과 같다).
                                        data={items.map((item) => ({
                                            id: item.label,
                                            label: item.label,
                                            primaryValue: Number.isFinite(item.company) ? item.company : 0,
                                            primaryValueText: Number.isFinite(item.company) ? undefined : EMPTY_VALUE,
                                            comparisonValue: Number.isFinite(item.average) ? item.average : 0,
                                        }))}
                                        {...TECH_INDEX_RADAR_STYLE}
                                        primaryLabel={PRIMARY_LABEL}
                                        comparisonLabel={COMPARISON_LABEL}
                                        ariaLabel={`${title} — 신청기업과 전체평균`}
                                    />
                                ) : (
                                    <EmptyState className="min-h-54" />
                                )}
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* 혁신성장역량지수 비교 — PDF 템플릿과 같은 위계: 구획 제목(h3) 아래
                기업 유형별 Tech-Index 비교 카드(h4) · 4대 혁신역량 부분별 비교(h4) · 기업 유형별 4대 혁신역량 비교(h4). 묶음 안 카드 제목은 h5. */}
            <section aria-labelledby="ig-tech-index-comparison" className="flex flex-col gap-4">
                <SectionTitle id="ig-tech-index-comparison" title="혁신성장역량지수 비교" />
                <div className="flex flex-col gap-8">
                    <Card title="기업 유형별 Tech-Index 비교" className="gap-4">
                        {/* 점수가 하나도 없으면 그래프 대신 빈 상태(그래프 높이 226 = min-h-56.5), 일부 유형만 없으면 그 막대 자리에 '-'. */}
                        {detail.companyTypes.some((item) => Number.isFinite(item.value)) ? (
                            <ColumnChart
                                data={toColumnData(detail.companyTypes)}
                                valueFractionDigits={1}
                                barWidth={48}
                                variant="cells"
                                showTooltip={false}
                                scaleMax={INNOVATION_REPORT_SCORE_MAX}
                                maxValueRatio={SCORE_MAX_VALUE_RATIO}
                                missingValueText={EMPTY_VALUE}
                                ariaLabel="기업 유형별 Tech-Index 점수"
                            />
                        ) : (
                            <EmptyState className="min-h-56.5" />
                        )}
                    </Card>

                    {/* 4대 혁신역량 부분별 비교 */}
                    <section aria-labelledby="ig-tech-index-capability" className="flex flex-col gap-4">
                        <SubSectionTitle id="ig-tech-index-capability" title="4대 혁신역량 부분별 비교" />
                        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                            {TECH_INDEX_CAPABILITIES.map(({id, label}) => (
                                <CapabilityScoreCard
                                    key={id}
                                    id={id}
                                    label={label}
                                    capability={detail.capabilities.find((capability) => capability.id === id)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* 기업 유형별 4대 혁신역량 비교 */}
                    <section aria-labelledby="ig-tech-index-by-type" className="flex flex-col gap-4">
                        <SubSectionTitle id="ig-tech-index-by-type" title="기업 유형별 4대 혁신역량 비교" />
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            {/* 카드 네 장(인프라 · 투입 · 활동 · 성과)은 늘 그린다 — 역량을 받지 못했거나 점수가 하나도 없으면
                                그래프 대신 빈 상태(그래프 높이 226 = min-h-56.5), 일부 유형만 없으면 그 막대 자리에 '-'. */}
                            {TECH_INDEX_CAPABILITIES.map(({id, label}, index) => {
                                const items =
                                    detail.capabilityByType.find((capability) => capability.id === id)?.items ?? []
                                return (
                                    <Card
                                        key={id}
                                        title={label}
                                        titleAs="h5"
                                        className="gap-4"
                                        revealGroup={rowRevealGroup('tech-index-by-type', index)}
                                    >
                                        {items.some((item) => Number.isFinite(item.value)) ? (
                                            <ColumnChart
                                                data={toColumnData(items)}
                                                valueFractionDigits={1}
                                                barWidth={48}
                                                variant="cells"
                                                showTooltip={false}
                                                // 모든 카드가 같은 눈금(0~100점)이라 역량끼리 막대 높이를 견줄 수 있다.
                                                scaleMax={INNOVATION_REPORT_SCORE_MAX}
                                                maxValueRatio={SCORE_MAX_VALUE_RATIO}
                                                missingValueText={EMPTY_VALUE}
                                                ariaLabel={`기업 유형별 ${label} 점수`}
                                            />
                                        ) : (
                                            <EmptyState className="min-h-56.5" />
                                        )}
                                    </Card>
                                )
                            })}
                        </div>
                    </section>
                </div>
            </section>
        </>
    )
}

export {InnovationGrowthReportTechIndex}
export type {InnovationGrowthReportTechIndexProps}
