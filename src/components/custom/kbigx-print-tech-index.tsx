import {ComparisonRadarChart} from '@/components/custom/comparison-radar-chart'
import {DistributionValueChart} from '@/components/custom/distribution-value-chart'
import {
    KBX_CHART_EMPTY_CLASS,
    KBX_CHART_EMPTY_TEXT,
    KbxBlock,
    KbxChartBox,
    KbxGradeTag,
    keepCorporatePrefix,
    KbxLegend,
    KbxSubBlock,
} from '@/components/custom/kbigx-print-parts'
import {RankBarList, type RankBarListProps} from '@/components/custom/rank-bar-list'
import {TECH_INDEX_RADAR_STYLE} from '@/components/custom/tech-index-radar-style'
import {ValueColumnChart} from '@/components/custom/value-column-chart'
import {getTechIndexGrade, type InnovationGrowthReport} from '@/content/service/k-bigx-innovation-report'
import {cn} from '@/lib/utils'
import {isKbxNumber, KBX_EMPTY_VALUE, kbxFixed1Format} from '@/components/custom/kbigx-print-format'

// K-BIGx 보고서 인쇄본 — Tech-Index 장(2쪽: tech-index-1 · 2, kbigx-print-document.tsx 에서 쪽 id 로 연결).
// 데이터는 화면 보고서 Tech-Index 탭과 같은 report.techIndexDetail · report.techIndex(점수 · 평가일자)를 읽는다.

type PageProps = {report: InnovationGrowthReport}

const PRIMARY_LABEL = '신청기업'
const COMPARISON_LABEL = '전체평균'
const AVERAGE_COMPANY_LABEL = '전체기업'
// 점수 만점 — 4대 혁신역량 점수 카드 · 유형별 4대 혁신역량 막대 공통 눈금.
const SCORE_MAX = 100
// 값이 없을 때 적는 글자 · 점수가 없을 때 요약 문장.
const NO_SCORE_TEXT = '평가 점수가 없습니다.'
const NO_STANDARD_TEXT = '표준정보 비교 결과가 없습니다.'
// 장 안내문(descriptions)에서 굵게 적는 말 — 문장에 없으면 그대로 적는다.
const DESCRIPTION_STRONG_PHRASE = 'AI평가모형 기반의 복합지수'

// 점수가 NaN 등 숫자가 아니면 값 없음 — 그래프는 0 위치에 그리고(toChartScore) 값 글자는 '-'(missingText).
const formatScore = (value: number) => (isKbxNumber(value) ? kbxFixed1Format.format(value) : KBX_EMPTY_VALUE)
const toChartScore = (value: number) => (isKbxNumber(value) ? value : 0)
const missingText = (value: number) => (isKbxNumber(value) ? undefined : KBX_EMPTY_VALUE)

// 막대 색 — 신청기업 보라 · 유형 파랑. 4대 혁신역량 카드의 신청기업 막대는 역량마다 고정 색, 전체기업은 회색.
// [프론트엔드 연동] capabilities[].id 는 infra · input · activity · output(화면 보고서와 같다) — 다른 id 면 파랑.
const SUBJECT_COLOR = 'var(--kbx-color-purple)'
const TYPE_COLOR = 'var(--kbx-color-blue)'
const AVERAGE_COLOR = 'var(--kbx-color-gray)'
const CAPABILITY_COLORS: Record<string, string> = {
    infra: 'var(--kbx-color-mint)',
    input: 'var(--kbx-color-blue)',
    activity: 'var(--kbx-color-orange)',
    output: 'var(--kbx-color-red)',
}

// 기업 유형별 4대 혁신역량 막대 목록 공통 props — 0~100 눈금, 신청기업 행(tone: 'subject')은 보라 · 가장 굵게.
const CAPABILITY_LIST_PROPS = {
    titleAs: 'h4',
    max: SCORE_MAX,
    formatValue: formatScore,
    colors: {bar: TYPE_COLOR, subjectBar: SUBJECT_COLOR, track: 'var(--kbx-color-surface)'},
    listClassName: 'kbx-text-20 text-kbx-foreground border-kbx-foreground kbx-border-t-regular',
    titleClassName: 'kbx-text-22 font-kbx-bold pt-kbx-14 pb-1.5',
    rowClassName: 'gap-3 py-1.5',
    subjectRowClassName: 'text-kbx-purple font-kbx-extrabold',
    nameClassName: 'w-24',
    barClassName: 'h-5',
    valueClassName: 'w-14',
} as const satisfies Partial<RankBarListProps>

// 투입지표별 방사형 — 화면 모양(TECH_INDEX_RADAR_STYLE) 위에 인쇄용 치수 · kbx 색을 덮어쓴다. 축 이름 아래에 신청기업 값.
// 칸 높이 283 은 아래 축 이름까지만 잡아 바닥글 선과 40 을 남긴다 — fixedSize · h-70.75 · 빈 상태 h-70.75 를 함께 고친다.
const PRINT_TECH_RADAR_STYLE = {
    ...TECH_INDEX_RADAR_STYLE,
    // 칸 크기를 재지 않고 고정한다(폭 509 = 카드 556 − 테두리 3 − 좌우 여백 44) — 미리보기는 용지를 축소해 보여 줘서
    // 재면 줄어든 크기가 잡힌다.
    fixedSize: {width: 509, height: 283},
    outerRadius: 101,
    centerY: 128,
    tickFontSize: 13,
    tickFontWeight: 400,
    tickColor: 'var(--kbx-color-label)',
    tickValueColor: 'var(--kbx-color-blue)',
    gridColor: 'var(--kbx-color-chart-grid)',
    primaryColor: 'var(--kbx-color-blue)',
    comparisonColor: 'var(--kbx-color-blue-faint)',
    chartClassName: 'aspect-auto h-70.75 min-h-0 max-h-none [&_.recharts-surface]:overflow-visible',
} as const

const LEGEND = (
    <KbxLegend
        density="unit"
        items={[
            {label: PRIMARY_LABEL, swatchClassName: 'bg-kbx-blue'},
            // 전체평균 — 차트 면과 같은 모양(같은 색 점선 테두리 + 50% 면).
            {
                label: COMPARISON_LABEL,
                swatchClassName: 'border border-dashed border-kbx-blue-faint bg-kbx-blue-faint/50',
            },
        ]}
    />
)

// ── Tech-Index 1(tech-index-1) — 장 안내문 · 혁신성장역량지수(점수 · 표준정보 비교) · 투입지표별 비교 ──

// 굵게 적을 말을 찾아 나눈다 — 없으면 그대로.
const withStrongPhrase = (text: string) => {
    const index = text.indexOf(DESCRIPTION_STRONG_PHRASE)
    if (index < 0) return text
    return (
        <>
            {text.slice(0, index)}
            <b className="text-kbx-foreground font-kbx-bold">{DESCRIPTION_STRONG_PHRASE}</b>
            {text.slice(index + DESCRIPTION_STRONG_PHRASE.length)}
        </>
    )
}

// 기업명이 든 요약 조각 — 기업명이 길면 기업명만 말줄임하고 나머지 글은 같은 줄에 남긴다(조각은 한 줄).
const WithTruncatedName = ({text, companyName}: {text: string; companyName: string}) => {
    const index = companyName ? text.indexOf(companyName) : -1
    if (index < 0) return <span>{text}</span>
    return (
        <span className="inline-flex max-w-full align-bottom">
            {text.slice(0, index)}
            <span className="truncate">{keepCorporatePrefix(companyName)}</span>
            <span className="shrink-0 whitespace-pre">{text.slice(index + companyName.length)}</span>
        </span>
    )
}

// 표준정보 요약 문장 — standard.summary 조각을 이어 붙인다(isStrong = 굵게, isLineBreak = 줄바꿈).
const SummaryText = ({
    parts,
    companyName,
}: {
    parts: InnovationGrowthReport['techIndexDetail']['standard']['summary']
    companyName: string
}) =>
    parts.map((part, index) =>
        part.isLineBreak ? (
            <br key={`${index}-break`} />
        ) : part.isStrong ? (
            <b key={`${index}-${part.text}`} className="text-kbx-primary font-kbx-extrabold">
                {part.text}
            </b>
        ) : (
            <WithTruncatedName key={`${index}-${part.text}`} text={part.text} companyName={companyName} />
        ),
    )

const KbigxPrintTechIndexOverview = ({report}: PageProps) => {
    const {standard, descriptions, indicators} = report.techIndexDetail
    const {score, evaluationDate} = report.techIndex
    const grade = getTechIndexGrade(score)
    // 점수가 없으면 '-' 로 적고 등급 알약 · 점수 문장 · 표준정보 요약을 뺀다.
    const hasScore = isKbxNumber(score)
    const scoreLabel = formatScore(score)
    const meanLabel = formatScore(standard.mean)
    // 표준정보 분포 — 평균이 없으면 그래프 대신 빈 상태, 점수나 요약 조각이 없으면 안내 문구(NO_STANDARD_TEXT).
    const hasStandard = isKbxNumber(standard.mean)
    const hasSummary = hasScore && standard.summary.length > 0

    return (
        <>
            {/* 장 안내문 — 제목 없이 위아래 선 사이에 문단 목록. */}
            <ul className="border-kbx-border kbx-border-t-regular kbx-border-b-regular kbx-text-22 leading-kbx-160 text-kbx-label flex flex-col gap-2.5 py-5">
                {descriptions.map((description) => (
                    <li key={description} className="break-keep">
                        {withStrongPhrase(description)}
                    </li>
                ))}
            </ul>
            <KbxBlock title="혁신성장역량지수">
                {/* 점수 칸은 최소 440 — 100.0 처럼 길면 알약까지 들어가도록 넓어지고 그만큼 요약 문장이 좁아진다. */}
                <div className="flex items-center gap-14">
                    <div className="flex min-w-110 shrink-0 flex-col gap-3.5">
                        <div className="text-kbx-primary flex items-baseline gap-2.5">
                            <span className="kbx-text-116 font-kbx-black leading-kbx-90 tracking-kbx-score tabular-nums">
                                {scoreLabel}
                            </span>
                            <span className="kbx-text-38 font-kbx-extrabold">점</span>
                            {hasScore ? (
                                <KbxGradeTag tone={grade.tone} className="ml-2 shrink-0 whitespace-nowrap">
                                    {grade.label}
                                </KbxGradeTag>
                            ) : null}
                        </div>
                        <div className="kbx-text-21 text-kbx-foreground-subtle mt-4">
                            평가일자{' '}
                            <b className="text-kbx-foreground font-kbx-bold">{evaluationDate || KBX_EMPTY_VALUE}</b>
                        </div>
                    </div>
                    <div className="bg-kbx-surface border-kbx-primary kbx-border-l-heavy kbx-text-28 font-kbx-bold leading-kbx-145 min-w-0 flex-1 px-6.5 py-5 wrap-anywhere break-keep">
                        {hasScore ? (
                            <>
                                {/* 기업명 + '의' 는 한 줄까지만 — 넘치면 기업명만 말줄임하고 나머지 문장은 다음 줄로 잇는다. */}
                                <span className="inline-flex max-w-full align-bottom">
                                    <span className="truncate">{keepCorporatePrefix(report.companyName)}</span>
                                    <span className="shrink-0">의</span>
                                </span>{' '}
                                Tech-Index는 <span className="text-kbx-primary font-kbx-black">{scoreLabel}점</span>으로
                                평가되었습니다.
                            </>
                        ) : (
                            NO_SCORE_TEXT
                        )}
                    </div>
                </div>
                {/* 점수 → 표준정보 소제목 40(블록 안 간격 32 + mt-2). */}
                <KbxSubBlock title="Tech-Index 표준정보 비교" unit={`전체 평균 ${meanLabel}점`} className="mt-2">
                    {/* 분포 그래프 — 본문 폭의 16/25, 가운데. 빈 상태 높이(h-53.75 = 215)는 그래프 높이와 같게 둔다. */}
                    <KbxChartBox isEmpty={!hasStandard} emptyClassName="h-53.75 w-16/25 self-center">
                        <DistributionValueChart
                            className="w-16/25 self-center"
                            ariaLabel={`Tech-Index 표준정보 분포 — 전체 평균 ${meanLabel}점, 조회기업 ${scoreLabel}점, ${standard.percentileLabel}`}
                            mean={standard.mean}
                            standardDeviation={standard.standardDeviation}
                            value={score}
                            markerLabel={standard.percentileLabel}
                            colors={{
                                curve: 'var(--kbx-color-blue)',
                                grid: 'var(--kbx-color-border)',
                                baseline: 'var(--kbx-color-chart-line-subtle)',
                                tick: 'var(--kbx-color-label)',
                                label: 'var(--kbx-color-chart-marker-label)',
                                markerStroke: 'var(--kbx-color-paper)',
                                surface: 'var(--kbx-color-paper)',
                            }}
                        />
                    </KbxChartBox>
                    <p className="bg-kbx-surface border-kbx-border kbx-border-hairline rounded-kbx-12 kbx-text-23 leading-kbx-160 py-kbx-22 px-7 text-center break-keep">
                        {hasSummary ? (
                            <SummaryText parts={standard.summary} companyName={report.companyName} />
                        ) : (
                            NO_STANDARD_TEXT
                        )}
                    </p>
                </KbxSubBlock>
            </KbxBlock>
            <KbxBlock title="Tech-Index 투입지표별 비교" unit={LEGEND}>
                <div className="grid grid-cols-2 gap-14">
                    {indicators.map((indicator) => (
                        <KbxSubBlock
                            key={indicator.id}
                            title={indicator.title}
                            className="border-kbx-border kbx-border-hairline rounded-kbx-14 px-kbx-22 pt-kbx-22 gap-3 pb-5"
                        >
                            <KbxChartBox isEmpty={!indicator.items.length} emptyClassName="h-70.75">
                                <ComparisonRadarChart
                                    {...PRINT_TECH_RADAR_STYLE}
                                    data={indicator.items.map((item) => ({
                                        id: item.label,
                                        label: item.label,
                                        primaryValue: toChartScore(item.company),
                                        primaryValueText: missingText(item.company),
                                        comparisonValue: toChartScore(item.average),
                                    }))}
                                    primaryLabel={PRIMARY_LABEL}
                                    comparisonLabel={COMPARISON_LABEL}
                                    ariaLabel={`${indicator.title} — 신청기업과 전체평균`}
                                />
                            </KbxChartBox>
                        </KbxSubBlock>
                    ))}
                </div>
            </KbxBlock>
        </>
    )
}

// ── Tech-Index 2(tech-index-2) — 기업 유형별 Tech-Index 비교 · 4대 혁신역량 점수 · 기업 유형별 4대 혁신역량 비교 ──

const KbigxPrintTechIndexComparison = ({report}: PageProps) => {
    const {companyTypes, capabilities, capabilityByType} = report.techIndexDetail

    return (
        <>
            <KbxBlock title="혁신성장역량지수">
                <KbxSubBlock title="기업 유형별 Tech-Index 비교">
                    {/* 0~100 눈금, isSubject 인 유형(신청기업)은 보라. 빈 상태 높이(h-84)는 그래프 높이와 같게 둔다. */}
                    <KbxChartBox isEmpty={!companyTypes.length} emptyClassName="h-84">
                        <ValueColumnChart
                            ariaLabel="기업 유형별 Tech-Index 비교"
                            max={SCORE_MAX}
                            data={companyTypes.map((item) => ({
                                id: item.id,
                                label: item.label,
                                value: toChartScore(item.value),
                                valueText: missingText(item.value),
                                isHighlighted: item.isSubject,
                            }))}
                            colors={{
                                bar: TYPE_COLOR,
                                highlight: SUBJECT_COLOR,
                                baseline: 'var(--kbx-color-foreground)',
                                value: 'var(--kbx-color-foreground)',
                                category: 'var(--kbx-color-foreground)',
                            }}
                        />
                    </KbxChartBox>
                </KbxSubBlock>
                {/* 그래프 → 4대 혁신역량 소제목 40(블록 안 간격 32 + mt-2). */}
                <KbxSubBlock title="4대 혁신역량 점수" className="mt-2">
                    {/* 역량마다 카드 하나(4열). 역량이 없으면 카드 높이(373 = h-93.25)의 빈 상태. */}
                    <KbxChartBox isEmpty={!capabilities.length} emptyClassName="h-93.25">
                        <div className="grid grid-cols-4 gap-5">
                            {capabilities.map((capability) => (
                                <section
                                    key={capability.id}
                                    aria-label={`${capability.label} 점수`}
                                    className="border-kbx-border kbx-border-hairline rounded-kbx-14 px-kbx-22 pt-kbx-22 flex flex-col gap-3 pb-5"
                                >
                                    <ValueColumnChart
                                        variant="compact"
                                        max={SCORE_MAX}
                                        ariaLabel={`${capability.label} — 신청기업과 전체기업 점수`}
                                        data={[
                                            {
                                                id: 'subject',
                                                label: PRIMARY_LABEL,
                                                value: toChartScore(capability.score),
                                                valueText: missingText(capability.score),
                                                color: CAPABILITY_COLORS[capability.id] ?? TYPE_COLOR,
                                                isHighlighted: true,
                                            },
                                            {
                                                id: 'average',
                                                label: AVERAGE_COMPANY_LABEL,
                                                value: toChartScore(capability.average),
                                                valueText: missingText(capability.average),
                                                color: AVERAGE_COLOR,
                                            },
                                        ]}
                                        colors={{
                                            baseline: 'var(--kbx-color-chart-line-subtle)',
                                            divider: 'var(--kbx-color-chart-grid)',
                                            value: 'var(--kbx-color-foreground)',
                                            mutedValue: 'var(--kbx-color-foreground-subtle)',
                                            category: 'var(--kbx-color-label)',
                                        }}
                                    />
                                    <h5 className="kbx-text-22 font-kbx-bold text-center">{capability.label}</h5>
                                </section>
                            ))}
                        </div>
                    </KbxChartBox>
                </KbxSubBlock>
            </KbxBlock>
            <KbxBlock title="기업 유형별 4대 혁신역량 비교">
                <div className="grid grid-cols-2 items-start gap-x-12 gap-y-6">
                    {capabilityByType.map((capability) => (
                        <RankBarList
                            key={capability.id}
                            {...CAPABILITY_LIST_PROPS}
                            emptyText={KBX_CHART_EMPTY_TEXT}
                            emptyClassName={cn(KBX_CHART_EMPTY_CLASS, 'h-45')}
                            title={capability.label}
                            items={capability.items.map((item) => ({
                                id: item.id,
                                name: item.label,
                                value: item.value,
                                tone: item.isSubject ? 'subject' : 'default',
                            }))}
                        />
                    ))}
                </div>
            </KbxBlock>
        </>
    )
}

export {KbigxPrintTechIndexComparison, KbigxPrintTechIndexOverview}
