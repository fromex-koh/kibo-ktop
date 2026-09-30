import {ComparisonRadarChart, type ComparisonRadarItem} from '@/components/custom/comparison-radar-chart'
import {PeerColumnChart} from '@/components/custom/peer-column-chart'
import {PositioningScatterChart} from '@/components/custom/positioning-scatter-chart'
import {
    ReportDocument,
    ReportSection,
    cellShapeClassName,
    headCellShapeClassName,
    tableClassName,
} from '@/components/custom/report-document'
import {
    INVESTMENT_MODEL_DEEP_DOCUMENT_TITLE,
    type InvestmentModelDeepReport,
} from '@/content/service/investment-model-deep-report'
import type {TechIndexComparison} from '@/content/service/tech-index-deep-report'
import {cn} from '@/lib/utils'

// 투자모형 심층분석의 기술평가서 두 장(2·3쪽) — 1쪽 '투자용 평가결과' 뒤에 이어 붙는다.
//
// 2쪽: 성장·밸류업포지셔닝(산점도) · PEER GROUP(업종) 세부항목비교(레이더 둘) · 재무지표비교(막대)
// 3쪽: 투자용 기술평가등급 체계(TI1~TI14 표)
//
// [프론트엔드 연동] 이 파일은 받은 값을 그리기만 한다 — 값은 화면이 부르는 getInvestmentModelDeepScreen
// 에서 온다(content/service/investment-model-deep-report.ts).
//
// 인쇄 버튼은 첫 문서(1쪽)에만 둔다 — 한 번 누르면 세 장이 함께 나간다.

// 구획 제목 줄 오른쪽 범례 — 견본 16 정사각 · 글자 12(시안).
const Legend = ({
    items,
}: {
    items: readonly {label: string; color: string; shape?: 'square' | 'circle'; isDashed?: boolean}[]
}) => (
    <ul className="typo-caption-regular text-label-foreground flex gap-6">
        {items.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
                <span
                    aria-hidden="true"
                    className={cn(
                        'size-4 shrink-0',
                        item.shape === 'circle' && 'rounded-full',
                        item.isDashed && 'border-navy-300 border border-dashed',
                    )}
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

const InvestmentModelDeepReportDocuments = ({
    report,
    isLoading = false,
}: {
    report: InvestmentModelDeepReport
    /** 값을 불러오는 중. 차트 자리마다 같은 크기의 스켈레톤이 선다. */
    isLoading?: boolean
}) => (
    <>
        {/* 2쪽 — 포지셔닝과 피어 비교. 1쪽 뒤라 종이에서 새 장에서 시작한다. */}
        {/* 구획 사이는 24 다(시안). */}
        <ReportDocument label={report.label} title={INVESTMENT_MODEL_DEEP_DOCUMENT_TITLE} startsNewPage>
            <ReportSection
                title="성장·밸류업포지셔닝"
                aside={
                    <Legend
                        items={[
                            {label: '당사', color: 'var(--raw-purple-600)', shape: 'circle'},
                            {label: report.positioning.peerLegendLabel, color: 'var(--ds-navy-200)', shape: 'circle'},
                        ]}
                    />
                }
            >
                <PositioningScatterChart
                    ariaLabel="성장성과 밸류업 자리에서 본 당사와 표본 기업들"
                    points={report.positioning.points}
                    yAxisLabel="성장성"
                    xAxisLabel="밸류업"
                    isLoading={isLoading}
                />
            </ReportSection>

            <ReportSection
                title="PEER GROUP(업종) 세부항목비교"
                aside={
                    <Legend
                        items={[
                            {label: '신청기업', color: 'var(--ds-primary)'},
                            {
                                label: 'PEER 기업군',
                                color: 'color-mix(in srgb, var(--ds-navy-300) 25%, var(--ds-surface))',
                                isDashed: true,
                            },
                        ]}
                    />
                }
            >
                {/* 레이더 둘은 좌우로 나란히 선다(시안) — 왼쪽은 역량, 오른쪽은 사업 축이다. */}
                <div className="grid grid-cols-2 gap-4">
                    {report.detailRadars.map((radar) => (
                        <ComparisonRadarChart
                            key={radar.id}
                            animate={false}
                            ariaLabel={`PEER GROUP 세부항목비교 ${radar.id}`}
                            data={toRadarItems(radar.axes)}
                            primaryLabel="신청기업"
                            comparisonLabel="PEER 기업군"
                            comparisonAppearance="filled"
                            comparisonColor="var(--ds-navy-300)"
                            gridColor="var(--ds-subtle-3)"
                            gridType="circle"
                            outerRadius={70}
                            centerY={104}
                            ringCount={5}
                            tickFontSize={12}
                            tickFontWeight={400}
                            dotAppearance="hollow"
                            showLegend={false}
                            showTooltip={false}
                            isLoading={isLoading}
                            className="h-52 gap-0 [&_[data-slot=chart]]:h-52 [&_[data-slot=chart]]:min-h-0 [&_[data-slot=chart]]:max-w-none"
                        />
                    ))}
                </div>
            </ReportSection>

            <ReportSection
                title="PEER GROUP(업종) 재무지표비교"
                aside={
                    <Legend
                        items={[
                            {label: '당사', color: 'var(--ds-primary)'},
                            {label: '피어 평균', color: 'var(--ds-navy-200)'},
                        ]}
                    />
                }
            >
                <PeerColumnChart
                    ariaLabel="PEER GROUP 재무지표비교"
                    data={report.financialComparisons}
                    heightClassName="h-50"
                    isLoading={isLoading}
                />
            </ReportSection>
        </ReportDocument>

        {/* 3쪽 — 등급 체계 표 한 벌. */}
        <ReportDocument
            label={report.label}
            title={INVESTMENT_MODEL_DEEP_DOCUMENT_TITLE}
            spacing="compact"
            startsNewPage
        >
            <ReportSection title="투자용 기술평가등급 체계">
                <table className={tableClassName}>
                    <caption className="sr-only">투자용 기술평가등급 체계</caption>
                    <colgroup>
                        <col className="w-36" />
                        <col />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col" className={cn(headCellShapeClassName, 'typo-caption-bold text-center')}>
                                평가등급
                            </th>
                            <th scope="col" className={cn(headCellShapeClassName, 'typo-caption-bold text-center')}>
                                등급별정의
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.gradeDefinitions.map((item) => (
                            // 줄 하나가 쪽 경계에서 반으로 갈라지지 않게 한다.
                            <tr key={item.grade} className="break-inside-avoid">
                                <th
                                    scope="row"
                                    className={cn(cellShapeClassName, 'typo-caption-regular text-center align-middle')}
                                >
                                    {item.grade}
                                </th>
                                {/* 뜻에 적힌 줄바꿈(\n)은 그대로 살린다. */}
                                <td
                                    className={cn(
                                        cellShapeClassName,
                                        'typo-caption-regular text-label-foreground whitespace-pre-line',
                                    )}
                                >
                                    {item.definition}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ReportSection>
        </ReportDocument>
    </>
)

export {InvestmentModelDeepReportDocuments}
