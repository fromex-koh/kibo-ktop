import {ComparisonRadarChart, type ComparisonRadarItem} from '@/components/custom/comparison-radar-chart'
import {DistributionCurveChart} from '@/components/custom/distribution-curve-chart'
import {PeerColumnChart} from '@/components/custom/peer-column-chart'
import {cn} from '@/lib/utils'
import {ReportDocument, ReportSection} from '@/components/custom/report-document'
import {renderReportEmphasis} from '@/components/custom/report-emphasis'
import {
    TECH_INDEX_DEEP_DOCUMENT_TITLE,
    type TechIndexComparison,
    type TechIndexDeepReport,
} from '@/content/service/tech-index-deep-report'

// 심층분석 기술평가서 두 장(2·3쪽) — 1쪽 '혁신성장역량 평가결과' 뒤에 이어 붙는다.
// 두 화면이 이 컴포넌트를 함께 쓴다: Tech-Index 심층분석 · 창업용 Tech-Index 심층분석.
//
// 2쪽: 지수정보(분포 곡선 → 요약 문장) · 4대 혁신역량 비교 · 세부지표별 상대비교분석(레이더 둘)
// 3쪽: 기업 유형별 Tech-Index · 기업 유형별 4대 혁신역량(2×2) · 산업 구분별 · 지역별 Peer Group 비교
//
// [프론트엔드 연동] 이 파일은 받은 값을 그리기만 한다 — 값은 화면이 부르는 get*DeepScreen 함수에서 온다
// (content/service/tech-index-deep-report.ts · startup-tech-index-deep-report.ts).
//
// 인쇄 버튼은 첫 문서(1쪽)에만 둔다 — 한 번 누르면 세 장이 함께 나간다.
// Peer Group 비교 막대만 기존 차트로 나오지 않는 모양이라 전용 컴포넌트를 쓴다(custom/peer-column-chart.tsx).

// 신청기업은 진한 파랑, 견줄 집단은 옅은 파랑이다 — 비교 차트와 레이더가 같은 색 약속을 쓴다.
const COMPARISON_SERIES = [
    {label: '신청기업', color: 'var(--ds-primary)'},
    {label: '전체평균', color: 'var(--ds-navy-200)'},
] as const

// 레이더의 전체평균은 옅은 파랑 점선 다각형에 같은 색 면이다 — 그 구획의 범례 견본도 같게 둔다(시안).
// 막대 차트의 전체평균(채운 navy.200)과 달라 이 구획에서만 쓴다.
const RADAR_LEGEND_SERIES = [
    COMPARISON_SERIES[0],
    {label: '전체평균', color: 'color-mix(in srgb, var(--ds-navy-300) 25%, var(--ds-surface))', isDashed: true},
]

// 구획 제목 줄 오른쪽 범례 — 견본 16 정사각 · 글자 12(시안).
const ComparisonLegend = ({labels}: {labels: readonly {label: string; color: string; isDashed?: boolean}[]}) => (
    <ul className="typo-caption-regular text-label-foreground flex gap-6">
        {labels.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
                <span
                    aria-hidden="true"
                    className={cn('size-4 shrink-0', item.isDashed && 'border-navy-300 border border-dashed')}
                    style={{backgroundColor: item.color}}
                />
                {item.label}
            </li>
        ))}
    </ul>
)

const toRadarItems = (axes: readonly TechIndexComparison[]): ComparisonRadarItem[] =>
    axes.map((axis) => ({
        id: axis.label,
        label: axis.label,
        primaryValue: axis.applicant,
        comparisonValue: axis.average,
    }))

const TechIndexDeepReportDocuments = ({
    report,
    isLoading = false,
}: {
    report: TechIndexDeepReport
    /** 값을 불러오는 중. 차트 자리마다 같은 크기의 스켈레톤이 선다. */
    isLoading?: boolean
}) => (
    <>
        {/* 2쪽 — 분포와 역량 비교. 1쪽 뒤라 종이에서 새 장에서 시작한다. */}
        <ReportDocument label={report.label} title={TECH_INDEX_DEEP_DOCUMENT_TITLE} spacing="compact" startsNewPage>
            <ReportSection title="Tech-Index 지수정보">
                <DistributionCurveChart
                    animate={false}
                    ariaLabel="전체 중소기업 Tech-Index 분포와 신청기업의 자리"
                    mean={report.distribution.mean}
                    standardDeviation={report.distribution.standardDeviation}
                    value={report.distribution.value}
                    markerLabel={report.distribution.markerLabel}
                    yTicks={report.distribution.yTicks}
                    // 눈금 한 칸은 30 이다(시안) — 축은 0~4.5 아홉 칸이라 칸 높이 270 에 가로 눈금
                    // 글자 자리 30 을 더해 300(h-75)이다. 곡선은 그 안에서 0.16~3.7 만큼 자란다.
                    peakValue={3.7}
                    heightClassName="h-75"
                    variant="plain"
                    yAxisLabel="상대빈도수"
                    xAxisLabel="Tech-Index"
                    legendLabel={report.distribution.legendLabel}
                    isLoading={isLoading}
                />
                <p className="typo-body-m-regular border-navy-200 bg-navy-100 text-navy-600 rounded-sm border px-5 py-3 text-center whitespace-pre-line">
                    {renderReportEmphasis(report.distributionSummary)}
                </p>
            </ReportSection>

            <ReportSection title="4대 혁신역량 비교" aside={<ComparisonLegend labels={COMPARISON_SERIES} />}>
                <PeerColumnChart
                    ariaLabel="4대 혁신역량 비교"
                    data={report.competencyComparisons.map((item) => ({
                        id: item.label,
                        label: item.label,
                        value: item.applicant,
                        comparisonValue: item.average,
                        isApplicant: true,
                    }))}
                    // 시안 칸 높이는 160 이다 — Peer Group 비교(112)보다 크다.
                    heightClassName="h-40"
                    isLoading={isLoading}
                />
            </ReportSection>

            <ReportSection title="세부지표별 상대비교분석" aside={<ComparisonLegend labels={RADAR_LEGEND_SERIES} />}>
                {/* 레이더 둘은 좌우로 나란히 선다(시안) — 왼쪽은 자산·역량 여섯 축, 오른쪽은 특허·기술 여덟 축이다. */}
                <div className="grid grid-cols-2 gap-4">
                    {report.detailRadars.map((radar) => (
                        <ComparisonRadarChart
                            key={radar.id}
                            animate={false}
                            ariaLabel={`세부지표별 상대비교분석 ${radar.id}`}
                            data={toRadarItems(radar.axes)}
                            primaryLabel="신청기업"
                            comparisonLabel="전체평균"
                            comparisonAppearance="filled"
                            // 전체평균은 회색이 아니라 옅은 파랑이다(시안 점선 #a5bfdf · 면은 그 색 25%).
                            comparisonColor="var(--ds-navy-300)"
                            // 격자(고리 · 축 선)는 시안 #e6e8ea 다.
                            gridColor="var(--ds-subtle-3)"
                            gridType="circle"
                            // 시안: 바깥 원 반지름 70(격자 상자 140) · 고리 4개 · 축 이름 12 ·
                            // 꼭짓점은 지름 8 의 흰 속에 파란 테두리.
                            // ringCount 는 눈금 수라 가운데(0)까지 세므로 고리 4개는 5 다.
                            outerRadius={70}
                            // 중심 높이를 값으로 못박는다 — 종이에서는 칸 폭이 달라지면서 차트가 제 높이를
                            // 다시 재는데, 중심을 비율로 두면 그때 레이더가 위로 딸려 올라간다(화면만 멀쩡).
                            centerY={104}
                            ringCount={5}
                            tickFontSize={12}
                            dotAppearance="hollow"
                            tickFontWeight={400}
                            showLegend={false}
                            showTooltip={false}
                            isLoading={isLoading}
                            className="h-52 gap-0 [&_[data-slot=chart]]:h-52 [&_[data-slot=chart]]:min-h-0 [&_[data-slot=chart]]:max-w-none"
                        />
                    ))}
                </div>
            </ReportSection>
        </ReportDocument>

        {/* 3쪽 — 집단별 비교 막대 넷. */}
        {/* 구획 사이는 24 다(시안) — 2쪽(16)보다 넓다. */}
        <ReportDocument label={report.label} title={TECH_INDEX_DEEP_DOCUMENT_TITLE} startsNewPage>
            <ReportSection title="기업 유형별 Tech-Index 비교">
                <PeerColumnChart
                    ariaLabel="기업 유형별 Tech-Index 비교"
                    data={report.companyTypeScores}
                    // 시안 그래프 141 = 칸 119 + 이름 한 줄 18 + 간격 4.
                    heightClassName="h-30"
                    isLoading={isLoading}
                />
            </ReportSection>

            <ReportSection title="기업 유형별 4대 혁신역량 비교">
                {/* 역량 넷을 2×2 로 놓는다(시안) — 각 차트 위에 역량 이름이 선다. */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {report.competencyTypeCharts.map((chart) => (
                        <div key={chart.id} className="flex flex-col gap-2">
                            <p className="typo-caption-bold text-foreground">{chart.title}</p>
                            <PeerColumnChart
                                ariaLabel={`기업 유형별 ${chart.title} 비교`}
                                data={chart.items}
                                heightClassName="h-32"
                                showEndLine={false}
                                isLoading={isLoading}
                            />
                        </div>
                    ))}
                </div>
            </ReportSection>

            <ReportSection title="산업 구분별 Peer Group 비교">
                <PeerColumnChart
                    ariaLabel="산업 구분별 Peer Group 비교"
                    data={report.industryPeers}
                    // 시안 그래프 138 — 이름이 두 줄(신청기업 · 구분)이라 칸이 그만큼 낮다(98).
                    heightClassName="h-24.5"
                    isLoading={isLoading}
                />
            </ReportSection>

            <ReportSection title="지역별 Peer Group 비교">
                <PeerColumnChart
                    ariaLabel="지역별 Peer Group 비교"
                    data={report.regionPeers}
                    // 시안 그래프 138 — 이름이 두 줄(신청기업 · 지역명)이라 칸이 그만큼 낮다(98).
                    heightClassName="h-24.5"
                    isLoading={isLoading}
                />
            </ReportSection>
        </ReportDocument>
    </>
)

export {TechIndexDeepReportDocuments}
