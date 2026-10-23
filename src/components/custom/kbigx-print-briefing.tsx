import type {ReactNode} from 'react'
import {CalloutPieChart} from '@/components/custom/callout-pie-chart'
import {ComparisonRadarChart} from '@/components/custom/comparison-radar-chart'
import {SECTOR_COMPARISON_RADAR_STYLE} from '@/components/custom/comparison-radar-style'
import {
    KBX_CASH_FLOW_TAG_CLASS,
    KBX_CREDIT_TAG_CLASS,
    kbxCategoryColor,
    KbxBlock,
    KbxChartBox,
    KbxGradeTag,
    KbxKeyValueList,
    KbxLabelValueGrid,
    KbxLegend,
    KbxNote,
    KbxStatCard,
    KbxSubBlock,
    KbxTable,
    KbxUnitBelow,
    getKbxIssueWords,
} from '@/components/custom/kbigx-print-parts'
import {ScoreScaleBar} from '@/components/custom/score-scale-bar'
import {ValueColumnChart} from '@/components/custom/value-column-chart'
import {ValueLineChart} from '@/components/custom/value-line-chart'
import {WordCloud} from '@/components/custom/word-cloud'
import {cashFlowLevel, findCashFlowGrade} from '@/content/service/cash-flow-grades'
import {getCriGradeBand, toCriRatingData} from '@/content/service/cri-grades'
import {
    getTechIndexGrade,
    INNOVATION_ISSUE_COLORS,
    INNOVATION_ISSUE_NOTE,
    type InnovationGrowthReport,
} from '@/content/service/k-bigx-innovation-report'
import {COMPANY_OVERVIEW_FIT_LABELS} from '@/content/service/k-bigx-print-report'
import {cn} from '@/lib/utils'
import {formatKbxNumber, isKbxNumber, KBX_EMPTY_VALUE, kbxFixed1Format} from '@/components/custom/kbigx-print-format'

// K-BIGx 보고서 인쇄본 — 진단브리핑 장(3쪽: briefing-1 · 2 · 3, kbigx-print-document.tsx 에서 쪽 id 로 연결).
// 데이터는 화면 보고서와 같은 InnovationGrowthReport 를 그대로 읽고, 차트도 화면과 같은 차트 컴포넌트를 쓴다.
// 공통 규칙: 숫자 값이 없으면(null · 숫자 아님) '-', 0 은 0 으로 적어 둘을 구분한다. 차트 데이터가 비면 빈 상태(KbxChartBox).

type PageProps = {report: InnovationGrowthReport}

// 정부 R&D 카드 — 늘 4칸 이상. 받은 부처가 4곳보다 적으면 빠진 부처명을 이 순서대로 채우고 건수는 '- 건'.
// 부처는 이름(label)으로 맞춘다 — API 부처명이 이 문구와 다르면 같은 부처가 두 번 나온다.
const RND_SLOT_COUNT = 4
const RND_MINISTRIES = ['중소벤처기업부', '과학기술정보통신부', '산업통상부', '보건복지부']
const RND_UNIT = '건'
// 기업 정보 이름 — 6개 고정. report.company.rows 에서 같은 label 로 찾고, 없거나 비면 값은 '-'(KbxLabelValueGrid).
const COMPANY_LABELS = ['기업명', '대표자', '기업유형/형태', '표준산업분류', '대표기술분야', '주요제품'] as const

// 재무비율진단 단계 — rating-matrix.tsx 의 RATING_LEVELS 와 같은 순서 · 이름(바꾸면 함께 고친다).
// 그 파일은 클라이언트 컴포넌트라 서버에서 그리는 인쇄본이 import 할 수 없어 따로 둔다.
const RATING_LEVELS = [
    {id: 'weak', label: '취약'},
    {id: 'poor', label: '미흡'},
    {id: 'normal', label: '보통'},
    {id: 'good', label: '양호'},
    {id: 'excellent', label: '우수'},
] as const

// 재무비율진단 평가지표 — 5개 고정. creditFinance.ratios 에서 같은 label 로 찾고, 등급이 없거나 다섯 단계 밖 값이면
// 단계 칸마다 '-'. 같은 지표가 여럿이면 첫 줄을 쓴다.
const RATIO_INDICATORS = ['매출액증가율', '영업이익률', '자기자본비율', '총자본회전율', '현금흐름'] as const
// 최근 3개년 재무 현황 구분 — 6개 고정. creditFinance.statements 에서 같은 label 로 찾고, 없는 칸은 '-'.
const STATEMENT_ITEMS = ['총자산', '자본총계', '부채총계', '매출액', '영업이익', '순이익'] as const

// 재무비율진단 표의 등급 점 색.
const GRADE_TONE_CLASS = {
    weak: 'bg-kbx-grade-weak',
    poor: 'bg-kbx-grade-poor',
    normal: 'bg-kbx-grade-normal',
    good: 'bg-kbx-grade-good',
    excellent: 'bg-kbx-grade-excellent',
} as const

// 혁신성장역량지수 막대 채움 — 등급 색을 흰색과 45% 로 미리 섞은 불투명 색(tokens.json kbigxPrint grade-*-fill).
// 투명도(/45)로 겹치지 않는다 — 회색 띠가 비치고, Safari 는 PDF 로 만들 때 Chrome 과 다른 색을 칠한다.
const GAUGE_FILL_CLASS = {
    weak: 'bg-kbx-grade-weak-fill',
    poor: 'bg-kbx-grade-poor-fill',
    normal: 'bg-kbx-grade-normal-fill',
    good: 'bg-kbx-grade-good-fill',
    excellent: 'bg-kbx-grade-excellent-fill',
} as const

const PIE_TEXT_COLORS = {
    label: 'var(--kbx-color-foreground)',
    value: 'var(--kbx-color-primary)',
    count: 'var(--kbx-color-chart-label)',
    leader: 'var(--kbx-color-chart-line)',
    inside: 'var(--kbx-color-paper)',
    insideMuted: 'var(--kbx-color-border)',
}

// 부문별 비교 레이더 — 웹 보고서 모양(SECTOR_COMPARISON_RADAR_STYLE) 위에 인쇄용 치수 · kbx 색을 덮어쓴다.
// 칸 420 × 312 — fixedSize · chartClassName(h-78) · 빈 상태(h-78) · 감싼 칸(w-105)이 같은 값이라 함께 고친다.
const PRINT_RADAR_STYLE = {
    // 칸 크기를 재지 않고 고정한다 — 미리보기는 용지를 축소해 보여 줘서 재면 줄어든 크기가 잡힌다.
    fixedSize: {width: 420, height: 312},
    outerRadius: 110,
    centerY: 154,
    // 축 이름은 축 끝에서 14 — 값이 100 이어도 꼭짓점 점(반지름 6.5 + 테두리)과 겹치지 않는다.
    tickGap: 14,
    tickFontSize: 18,
    tickFontWeight: 600,
    tickColor: 'var(--kbx-color-label)',
    gridColor: 'var(--kbx-color-chart-grid)',
    primaryColor: 'var(--kbx-color-blue)',
    comparisonColor: 'var(--kbx-color-blue-light)',
    comparisonFillColor: 'var(--kbx-color-blue-faint)',
    primaryFillOpacity: 0.12,
    comparisonFillOpacity: 0.35,
    primaryStrokeWidth: 3.5,
    comparisonStrokeWidth: 2.5,
    comparisonDashArray: '6 5',
    dotRadius: 6.5,
    dotStrokeWidth: 3,
    dotFillColor: 'var(--kbx-color-paper)',
    chartClassName: 'aspect-auto h-78 min-h-0 [&_.recharts-surface]:overflow-visible',
} as const

// ── 진단브리핑 1(briefing-1) — 기업 정보 · 기술혁신정보 ──

// 기업 보유기술 차트 칸 높이 = 위 줄 450(h-kbx-450) − 소제목 31 − 간격 16 − 차트 위 여백 16(pt-4).
// 위 줄 높이 · 소제목 크기를 바꾸면 함께 고친다. 원 중심을 이 칸 세로 가운데에 맞추는 데 쓴다.
const PIE_AREA_HEIGHT = 387
const PIE_LABEL_MAX_LINES = 2

const KbigxPrintBriefingOverview = ({report}: PageProps) => {
    const averages = report.innovation.averages
    const issueWords = getKbxIssueWords(report.innovation.issues)

    return (
        <>
            <KbxBlock title="기업 정보">
                {/* 기업명 · 대표자 · 대표기술분야 · 주요제품: 2줄을 넘으면 글자를 줄이고 그래도 넘치면 2줄 말줄임.
                    기업유형/형태 · 표준산업분류: 한 줄 말줄임. 규칙은 기업현황 개요와 같다(COMPANY_OVERVIEW_FIT_LABELS). */}
                <KbxLabelValueGrid
                    fitLabels={COMPANY_OVERVIEW_FIT_LABELS}
                    items={COMPANY_LABELS.map((label) => ({
                        label,
                        value: report.company.rows.find((row) => row.label === label)?.value ?? '',
                    }))}
                    density="compact"
                />
            </KbxBlock>
            {/* 기술혁신정보 — 앞 블록과 119(블록 간격 80 + 39), 쪽 끝까지 늘어난다(flex-1).
                위 줄 높이는 450 고정 — 원형 차트는 조각 · 라벨이 많아도 이 안에서 줄어들어, 아래 줄(R&D) 위치가 늘 같다.
                위 줄 → 아래 줄 160(블록 안 간격 32 × 2 + 여백 h-24). 기업 정보 값이 모두 2줄이어도 한 쪽에 들어가며,
                쪽이 모자라면 이 여백만 최소 16(min-h-4)까지 줄어든다. */}
            <KbxBlock title="기술혁신정보" tag={report.subCategoryName} className="mt-kbx-39 min-h-0 flex-1">
                <div className="h-kbx-450 flex shrink-0 gap-x-14">
                    {/* 차트는 남는 높이의 세로 가운데(my-auto). pt-4 로 소제목과 늘 32(gap-4 + pt-4) 이상 띄운다. */}
                    <KbxSubBlock title="기업 보유기술" unit="세부분야 기준" className="min-h-0 grow basis-0">
                        <KbxChartBox
                            isEmpty={!report.innovation.technologies.length}
                            emptyClassName="mt-4 min-h-0 flex-1"
                        >
                            <CalloutPieChart
                                data={report.innovation.technologies.map((item, index) => ({
                                    id: item.id,
                                    label: item.label,
                                    // 비중이 없으면 조각 없음(0), 건수가 없으면 건수 글자 없이 비중만.
                                    percentage: isKbxNumber(item.percentage) ? item.percentage : 0,
                                    count: isKbxNumber(item.count) ? item.count : undefined,
                                    // 데이터 순서대로 진한 남색 → 옅은 파랑('기타'는 회색) — 비중 큰 순으로 받아야 색 순서가 맞다.
                                    color: kbxCategoryColor(item.label, index),
                                }))}
                                colors={PIE_TEXT_COLORS}
                                ariaLabel="기업 보유기술 세부분야별 비중과 건수"
                                areaHeight={PIE_AREA_HEIGHT}
                                // 라벨은 비중 · 건수 포함 2줄까지 — 넘치는 분야명은 말줄임.
                                maxLabelLines={PIE_LABEL_MAX_LINES}
                                className="my-auto min-h-0 pt-4"
                            />
                        </KbxChartBox>
                    </KbxSubBlock>
                    <KbxSubBlock title="관련 기업 및 특허현황" className="grow basis-0">
                        <div className="gap-kbx-14 grid grid-cols-2">
                            {report.innovation.stats.map((stat) => (
                                <KbxStatCard
                                    key={stat.id}
                                    label={stat.label}
                                    value={formatKbxNumber(stat.value)}
                                    unit={stat.unit}
                                />
                            ))}
                        </div>
                        <KbxKeyValueList
                            rows={averages.map((row) => ({
                                key: row.label,
                                label: row.label,
                                // 값은 API 가 포맷한 문자열 — 비면 '-건', '0' · '0.0' 은 그대로.
                                value: `${row.value?.trim() || KBX_EMPTY_VALUE}${row.unit}`,
                            }))}
                        />
                    </KbxSubBlock>
                </div>
                <div aria-hidden="true" className="h-24 min-h-4" />
                {/* R&D 이슈 · 정부 R&D사업 접수현황은 소제목 · 본문 · 각주 세 행을 함께 쓴다(subgrid) — 두 칸의 본문
                    아랫선과 각주 시작 높이가 맞는다. */}
                <div className="grid shrink-0 grid-cols-2 grid-rows-[auto_1fr_auto] gap-x-14 gap-y-4">
                    <KbxSubBlock title="R&D 이슈" className="row-span-3 grid grid-rows-subgrid">
                        {/* 키워드가 없으면 WordCloud 를 그리지 않는다 — 빈 목록이면 스켈레톤이 남아 인쇄가 제한 시간까지
                            기다리고 회색 상자가 찍힌다. */}
                        <KbxChartBox isEmpty={!issueWords.length} emptyClassName="min-h-kbx-214">
                            <div className="bg-kbx-surface-subtle min-h-kbx-214 flex items-center justify-center px-6 py-4">
                                <WordCloud
                                    words={issueWords}
                                    colors={INNOVATION_ISSUE_COLORS}
                                    ariaLabel="최근 연구개발 이슈 키워드"
                                    className="h-full w-full"
                                />
                            </div>
                        </KbxChartBox>
                        <KbxNote>{INNOVATION_ISSUE_NOTE}</KbxNote>
                    </KbxSubBlock>
                    <KbxSubBlock
                        title="정부 R&D사업 접수현황"
                        unit={`기준일자 · ${report.createdAt || KBX_EMPTY_VALUE}`}
                        // 기준일자는 소제목과 세로 가운데 정렬(기본은 아래 맞춤).
                        headerClassName="items-center"
                        className="row-span-3 grid grid-rows-subgrid"
                    >
                        {/* 받은 부처 + 빠진 고정 부처(RND_MINISTRIES)를 이어 최소 4칸. 받은 부처가 4곳을 넘으면 모두 그린다. */}
                        <div className="gap-kbx-14 grid grid-cols-2">
                            {[
                                ...report.innovation.rnd,
                                ...RND_MINISTRIES.filter(
                                    (label) => !report.innovation.rnd.some((item) => item.label === label),
                                ).map((label) => ({label, value: null, unit: RND_UNIT})),
                            ]
                                .slice(0, Math.max(RND_SLOT_COUNT, report.innovation.rnd.length))
                                .map((item, index) => (
                                    <KbxStatCard
                                        key={`${item.label}-${index}`}
                                        label={item.label}
                                        value={formatKbxNumber(item.value)}
                                        unit={item.unit}
                                    />
                                ))}
                        </div>
                        <KbxNote>{report.innovation.rndNote}</KbxNote>
                    </KbxSubBlock>
                </div>
            </KbxBlock>
        </>
    )
}

// ── 진단브리핑 2(briefing-2) — 혁신성장역량지수 · 신용/재무 현황 ──

// 등급 박스 — 큰 등급 코드 + 등급 알약, 아래에 details 목록(기업신용등급: 평가일자 · 결산일자, 현금흐름등급: 결산일자. 값이 비면 '-').
// 옆 박스와 높이를 맞춰 늘어난다(flex-1).
const KbxGradeBox = ({
    code,
    tag,
    details,
}: {
    code: string
    tag: ReactNode
    details: readonly {label: string; value: string}[]
}) => (
    <div className="bg-kbx-surface pb-kbx-30 flex flex-1 flex-col px-9 pt-7">
        {/* 코드 · 알약이 모두 길면(등급표에 없는 코드 + '등급 코드 확인 필요') 알약이 다음 줄로 내려간다. */}
        <div className="text-kbx-primary gap-x-kbx-22 flex flex-wrap items-baseline gap-y-2">
            <span className="kbx-text-116 font-kbx-black leading-kbx-90 tracking-kbx-tight whitespace-nowrap">
                {code}
            </span>
            {tag}
        </div>
        <dl className="kbx-text-20 text-kbx-foreground-subtle gap-kbx-6 mt-kbx-18 flex flex-col whitespace-nowrap">
            {details.map((detail) => (
                <div key={detail.label} className="flex gap-1">
                    <dt>{detail.label}</dt>
                    <dd className="text-kbx-foreground font-kbx-bold m-0">{detail.value || KBX_EMPTY_VALUE}</dd>
                </div>
            ))}
        </dl>
    </div>
)

const KbigxPrintBriefingFinance = ({report}: PageProps) => {
    const {techIndex, creditFinance} = report
    // 재무비율진단 — 5줄이 모두 '-'(등급 없음 · 다섯 단계 밖 값)이면 표 대신 빈 상태.
    const hasRatios = RATIO_INDICATORS.some((label) =>
        RATING_LEVELS.some((level) => level.id === creditFinance.ratios.find((row) => row.label === label)?.rating),
    )
    // 부문별 비교 — 재무비율진단 5지표 축 고정(같은 label 로 찾는다). 값이 하나도 없으면 빈 상태.
    const comparisonRows = RATIO_INDICATORS.map((label) => {
        const item = creditFinance.comparison.find((row) => row.label === label)
        return {label, company: item?.company, industry: item?.industry}
    })
    const hasComparison = comparisonRows.some((row) => isKbxNumber(row.company) || isKbxNumber(row.industry))
    // 최근 3개년 재무 현황 — 연도가 없거나 6항목 값이 하나도 없으면 빈 상태.
    const hasStatements =
        creditFinance.years.length > 0 &&
        STATEMENT_ITEMS.some((label) =>
            creditFinance.statements.find((row) => row.label === label)?.values.some((value) => isKbxNumber(value)),
        )
    const grade = getTechIndexGrade(techIndex.score)
    // 점수가 없으면 '-' 이고 등급 알약을 빼며, 0점은 '0.0점 · 취약'.
    const hasScore = isKbxNumber(techIndex.score)
    const scoreText = hasScore ? kbxFixed1Format.format(techIndex.score) : KBX_EMPTY_VALUE
    // 기업신용등급 — CRI 등급표(cri-grades.ts)로 코드를 등급명으로, 등급 단계(getCriGradeBand — 웹 게이지와 같은 9단계)로
    // 알약 색(KBX_CREDIT_TAG_CLASS)을 정한다. 등급표에 없는 코드는 '등급 코드 확인 필요' + 남색 테두리 알약.
    const creditRating = toCriRatingData(creditFinance.rating.grade)
    const creditBand = getCriGradeBand(creditFinance.rating.grade)
    // 현금흐름등급 — cash-flow-grades.ts 등급표 · KBX_CASH_FLOW_TAG_CLASS 색(신용/재무정보 장과 같다).
    const {cashFlow} = report.creditDetail
    const cashFlowGrade = findCashFlowGrade(cashFlow.grade)

    return (
        <>
            <KbxBlock title="혁신성장역량지수" unit={techIndex.scoreNote}>
                <div className="flex items-stretch gap-x-14">
                    {/* 점수 칸은 최소 420 — 100.0 처럼 길면 알약까지 들어가도록 넓어지고 오른쪽 막대가 그만큼 짧아진다. */}
                    <div className="gap-kbx-14 flex min-w-105 shrink-0 flex-col justify-center">
                        <div className="kbx-text-22 font-kbx-bold text-kbx-foreground-subtle" lang="en">
                            Tech-Index
                        </div>
                        <div className="gap-kbx-10 text-kbx-primary flex items-baseline whitespace-nowrap">
                            <span className="kbx-text-116 font-kbx-black leading-kbx-90 tracking-kbx-tight">
                                {scoreText}
                            </span>
                            <span className="kbx-text-36 font-kbx-extrabold">점</span>
                            {hasScore ? <KbxGradeTag tone={grade.tone}>{grade.label}</KbxGradeTag> : null}
                        </div>
                        <div className="kbx-text-21 text-kbx-foreground-subtle mt-kbx-10">
                            평가일자{' '}
                            <b className="text-kbx-foreground font-kbx-bold">
                                {techIndex.evaluationDate || KBX_EMPTY_VALUE}
                            </b>
                        </div>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-9">
                        {/* 눈금은 막대 위, 막대 높이 40, 점수 표시선은 막대 위아래로 6 씩 나온다. */}
                        <ScoreScaleBar
                            score={techIndex.score}
                            ariaLabel="혁신성장역량지수"
                            valueText={hasScore ? `${scoreText}점, ${grade.label}` : '점수 없음'}
                            tickPosition="top"
                            className="gap-2.5"
                            trackClassName="bg-kbx-divider h-10"
                            fillClassName={GAUGE_FILL_CLASS[grade.tone]}
                            markerClassName="bg-kbx-foreground w-kbx-3 -top-1.5 -bottom-1.5"
                            tickClassName="kbx-text-22 font-kbx-semibold text-kbx-foreground-subtle"
                        />
                        <div className="bg-kbx-surface gap-kbx-6 flex flex-col px-6 py-5">
                            <div className="kbx-text-28 font-kbx-extrabold leading-kbx-130 text-kbx-foreground">
                                동일업종 기준{' '}
                                <span className="text-kbx-primary ml-2.5">
                                    {/* 순위가 없으면 '상위 - %', 0 이면 '상위 0%'. */}
                                    상위{' '}
                                    {isKbxNumber(techIndex.industryPercentile)
                                        ? `${techIndex.industryPercentile}%`
                                        : `${KBX_EMPTY_VALUE} %`}
                                </span>
                            </div>
                            <div className="kbx-text-21 text-kbx-foreground-subtle">
                                {techIndex.industryLabel || KBX_EMPTY_VALUE}
                            </div>
                        </div>
                    </div>
                </div>
            </KbxBlock>

            <KbxBlock title="신용/재무 현황">
                <div className="grid grid-cols-2 gap-x-14">
                    <KbxSubBlock title="기업신용등급">
                        {/* 등급 코드가 비면 '-' 만(알약 없음). */}
                        <KbxGradeBox
                            code={creditFinance.rating.grade ? creditRating.label : KBX_EMPTY_VALUE}
                            tag={
                                creditFinance.rating.grade ? (
                                    <KbxGradeTag
                                        className={cn('shrink-0', creditBand && KBX_CREDIT_TAG_CLASS[creditBand])}
                                    >
                                        {creditRating.description}
                                    </KbxGradeTag>
                                ) : null
                            }
                            details={creditFinance.rating.details}
                        />
                    </KbxSubBlock>
                    <KbxSubBlock title="현금흐름등급">
                        {/* 등급표에 없는 코드면 알약 없이 코드만. */}
                        <KbxGradeBox
                            code={cashFlow.grade || KBX_EMPTY_VALUE}
                            tag={
                                cashFlowGrade ? (
                                    <KbxGradeTag
                                        className={cn(
                                            'shrink-0',
                                            KBX_CASH_FLOW_TAG_CLASS[cashFlowLevel(cashFlow.grade)],
                                        )}
                                    >
                                        {cashFlowGrade.name}
                                    </KbxGradeTag>
                                ) : null
                            }
                            details={cashFlow.details}
                        />
                    </KbxSubBlock>
                </div>
                {/* 재무비율진단 — 표 + 부문별 비교 레이더(폭 420). 범례는 소제목 줄 오른쪽. */}
                <KbxSubBlock
                    title="재무비율진단"
                    unit={
                        <KbxLegend
                            className="gap-4"
                            items={[
                                {label: '조회기업', swatchClassName: 'bg-kbx-blue'},
                                {
                                    label: '업종평균',
                                    swatchClassName:
                                        'bg-kbx-blue-faint border-kbx-blue-light kbx-border-hairline border-dashed',
                                },
                            ]}
                        />
                    }
                    className="mt-2"
                >
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-14">
                        {/* 표 높이 298(h-74.5) — 빈 상태도 같은 높이. */}
                        <KbxChartBox isEmpty={!hasRatios} emptyClassName="h-74.5">
                            <KbxTable
                                caption="재무비율진단 항목별 수준"
                                density="narrow"
                                columns={[
                                    {
                                        key: 'label',
                                        header: '평가지표',
                                        isRowHeader: true,
                                        className: 'w-29',
                                        headerClassName: 'whitespace-nowrap tracking-kbx-score',
                                    },
                                    ...RATING_LEVELS.map((level) => ({
                                        key: level.id,
                                        header: level.label,
                                        headerClassName: 'kbx-text-18 whitespace-nowrap tracking-kbx-score',
                                    })),
                                ]}
                                rows={RATIO_INDICATORS.map((label) => {
                                    // 받은 등급이 다섯 단계 중 하나가 아니면(없음 · 정의 밖 값) 값 없음으로 보고 칸마다 '-'.
                                    const received = creditFinance.ratios.find((row) => row.label === label)?.rating
                                    const rating = RATING_LEVELS.find((level) => level.id === received)?.id
                                    return {
                                        key: label,
                                        cells: [
                                            <span key="label" className="whitespace-nowrap">
                                                {label}
                                            </span>,
                                            ...RATING_LEVELS.map((level) =>
                                                !rating ? (
                                                    KBX_EMPTY_VALUE
                                                ) : rating === level.id ? (
                                                    <span
                                                        key={level.id}
                                                        role="img"
                                                        aria-label={level.label}
                                                        className={cn(
                                                            'size-kbx-22 inline-block rounded-full align-middle',
                                                            GRADE_TONE_CLASS[level.id],
                                                        )}
                                                    />
                                                ) : null,
                                            ),
                                        ],
                                    }
                                })}
                            />
                        </KbxChartBox>
                        <div className="w-105">
                            {/* 축은 재무비율진단 5지표 고정(웹 보고서와 같다). 값이 하나도 없으면 빈 상태, 일부만 없으면 0 으로 그린다
                                (레이더는 꼭짓점을 비울 수 없다). */}
                            <KbxChartBox isEmpty={!hasComparison} emptyClassName="h-78">
                                <ComparisonRadarChart
                                    data={comparisonRows.map((item) => ({
                                        id: item.label,
                                        label: item.label,
                                        primaryValue: isKbxNumber(item.company) ? item.company : 0,
                                        comparisonValue: isKbxNumber(item.industry) ? item.industry : 0,
                                    }))}
                                    {...SECTOR_COMPARISON_RADAR_STYLE}
                                    {...PRINT_RADAR_STYLE}
                                    primaryLabel="조회기업"
                                    comparisonLabel="업종평균"
                                    ariaLabel="부문별 비교 — 조회기업과 업종평균"
                                    showTooltip={false}
                                />
                            </KbxChartBox>
                        </div>
                    </div>
                </KbxSubBlock>
                {/* 최근 3개년 재무 현황 — 열은 creditFinance.years 순서, values[i] 가 years[i] 의 값. */}
                <KbxSubBlock title="최근 3개년 재무 현황" className="mt-2">
                    <KbxUnitBelow unit="단위: 백만원">
                        {/* 연도가 없거나 값이 하나도 없으면 빈 상태(표 높이 308 = h-77), 일부만 없으면 그 칸만 '-'. */}
                        <KbxChartBox isEmpty={!hasStatements} emptyClassName="h-77">
                            <KbxTable
                                caption="최근 3개년 재무 현황"
                                density="dense"
                                columns={[
                                    {key: 'label', header: '구분', isRowHeader: true, className: 'w-70'},
                                    ...creditFinance.years.map((year) => ({key: year, header: year})),
                                ]}
                                rows={STATEMENT_ITEMS.map((label) => {
                                    const values = creditFinance.statements.find((row) => row.label === label)?.values
                                    return {
                                        key: label,
                                        cells: [
                                            label,
                                            ...creditFinance.years.map((_, index) => formatKbxNumber(values?.[index])),
                                        ],
                                    }
                                })}
                            />
                        </KbxChartBox>
                    </KbxUnitBelow>
                </KbxSubBlock>
            </KbxBlock>
        </>
    )
}

// ── 진단브리핑 3(briefing-3) — 활동성 정보 ──

// 분기별 종업원수 그래프의 선 · 글자 색.
const EMPLOYEE_CHART_COLORS = {
    grid: 'var(--kbx-color-border)',
    baseline: 'var(--kbx-color-border-muted)',
    value: 'var(--kbx-color-foreground)',
    label: 'var(--kbx-color-foreground-subtle)',
    dotFill: 'var(--kbx-color-paper)',
}

// 인당 매출액 막대 · 글자 색.
const SALES_CHART_COLORS = {
    bar: 'var(--kbx-color-blue)',
    baseline: 'var(--kbx-color-border-muted)',
    divider: 'var(--kbx-color-border)',
    mutedValue: 'var(--kbx-color-label)',
    category: 'var(--kbx-color-foreground-subtle)',
}

const KbigxPrintBriefingActivity = ({report}: PageProps) => {
    const {employees, salesPerEmployee} = report.activity
    // 그릴 값이 하나도 없으면(빈 목록 · 모두 값 없음) 그래프 대신 높이 440(h-110)의 빈 상태.
    const hasEmployees = employees.some((item) => isKbxNumber(item.value))
    const hasSales = salesPerEmployee.some((item) => isKbxNumber(item.value))

    return (
        <KbxBlock title="활동성 정보">
            {/* 분기별 종업원수(남는 폭) · 인당 매출액(폭 360) — 아래 맞춤. */}
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-14">
                <KbxSubBlock title="분기별 종업원수">
                    <KbxUnitBelow unit="단위: 명">
                        {/* 값이 없는 분기는 점을 비우고 선을 끊는다(0 은 0 으로 그린다). */}
                        <KbxChartBox isEmpty={!hasEmployees} emptyClassName="h-110">
                            <ValueLineChart
                                data={employees.map((item) => ({
                                    id: item.label,
                                    label: item.label,
                                    value: item.value,
                                }))}
                                variant="narrow"
                                color="var(--kbx-color-purple-strong)"
                                colors={EMPLOYEE_CHART_COLORS}
                                ariaLabel="분기별 종업원수 추이"
                            />
                        </KbxChartBox>
                    </KbxUnitBelow>
                </KbxSubBlock>
                <KbxSubBlock title="인당 매출액" className="w-90">
                    <KbxUnitBelow unit="단위: 천원">
                        <KbxChartBox isEmpty={!hasSales} emptyClassName="h-110">
                            <ValueColumnChart
                                // 값이 없는 연도는 막대 없이 '-', 0 은 0.
                                data={salesPerEmployee.map((item) => ({
                                    id: item.label,
                                    label: item.label,
                                    value: isKbxNumber(item.value) ? item.value : 0,
                                    valueText: isKbxNumber(item.value) ? undefined : KBX_EMPTY_VALUE,
                                }))}
                                variant="narrow"
                                colors={SALES_CHART_COLORS}
                                ariaLabel="인당 매출액 연도별 비교"
                            />
                        </KbxChartBox>
                    </KbxUnitBelow>
                </KbxSubBlock>
            </div>
        </KbxBlock>
    )
}

export {KbigxPrintBriefingActivity, KbigxPrintBriefingFinance, KbigxPrintBriefingOverview}
