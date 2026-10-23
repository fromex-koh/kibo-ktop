import {Award, ChevronRight, Lightbulb, type LucideIcon, Star} from 'lucide-react'
import type {ReactNode} from 'react'
import {ComboValueChart} from '@/components/custom/combo-value-chart'
import {DonutListChart, type DonutListChartProps} from '@/components/custom/donut-list-chart'
import {DualBarTable} from '@/components/custom/dual-bar-table'
import {RankBarList, rankBarScaleMax, type RankBarListProps} from '@/components/custom/rank-bar-list'
import {WordCloud} from '@/components/custom/word-cloud'
import {
    KBX_CATEGORY_COLORS,
    KBX_CHART_EMPTY_CLASS,
    KBX_CHART_EMPTY_TEXT,
    KbxBlock,
    kbxCategoryColor,
    KbxChapterNotice,
    KbxChartBox,
    KbxLegend,
    KbxNote,
    KbxStairTable,
    KbxSubBlock,
    KbxSubText,
    KbxTable,
    type KbxStairTableColumn,
    type KbxTableColumn,
    keepCorporatePrefix,
    getKbxIssueWords,
    KbxUnitBelow,
} from '@/components/custom/kbigx-print-parts'
import {
    INNOVATION_ISSUE_COLORS,
    toMarketScaleRows,
    type InnovationGrowthReport,
} from '@/content/service/k-bigx-innovation-report'
import {
    getKbigxExcellentPatentRows,
    getKbigxPatentRows,
    getKbigxRndProjectLayout,
    KBIGX_PRINT_LIST_LIMIT,
} from '@/content/service/k-bigx-print-report'
import {KbxClampArea, KbxClampText, KbxFitText} from '@/components/custom/kbigx-print-fit-value'
import {cn} from '@/lib/utils'
import {
    formatKbxNumber,
    isKbxNumber,
    KBX_EMPTY_VALUE,
    kbxFixed1Format,
    kbxNumberFormat,
    orKbxEmpty,
    sumKbxNumbers,
} from '@/components/custom/kbigx-print-format'

// K-BIGx 보고서 인쇄본 — 기술혁신정보 쪽(1~8). 쪽 하나가 export 하나다.
// 데이터는 화면 보고서와 같은 InnovationGrowthReport.techInnovation 을 그대로 읽는다(R&D 이슈만 report.innovation.issues).
// 쪽마다 '늘 한 쪽'에 들어가야 해서 긴 글자는 말줄임 · 글자 줄임으로 높이를 묶는다 — 규칙은 각 쪽 주석 참고.

// 기술 보유현황 도넛 + 목록 — 도넛 300 · 목록 폭 684 · 간격 64, 목록 줄 여백 10(마지막 5) · 구분선 1.
const DONUT_LIST_CLASSES = {
    className: 'gap-16',
    donutClassName: 'w-75',
    listClassName: 'kbx-text-20 text-kbx-foreground max-w-171',
    rowClassName: 'border-kbx-border-subtle kbx-border-b-thin py-2.5',
    lastRowClassName: 'py-kbx-5',
    highlightClassName: 'font-kbx-bold',
    // 분류 이름은 한 줄 — 넘치면 말줄임(줄이 늘지 않아 쪽을 넘기지 않는다).
    labelClassName: 'truncate',
    gapColor: 'var(--kbx-color-paper)',
} as const

// 목록 값 글자 — 비중 · 건수가 둘 다 숫자면 undefined(DonutListChart 기본 표기). 하나라도 값이 없으면 그 자리만 '-'.
// 0 은 값이다(0% · 0개).
const holdingValueText = (percentage: number, count: number | undefined) => {
    const hasPercentage = isKbxNumber(percentage)
    const hasCount = isKbxNumber(count)
    if (hasPercentage && hasCount) return undefined
    const percentageText = hasPercentage ? `${percentage}%` : KBX_EMPTY_VALUE
    const countText = hasCount ? `${kbxNumberFormat.format(count)}개` : `${KBX_EMPTY_VALUE}개`
    return `${percentageText} · ${countText}`
}

// 분류 기준 하나 — 제목(아래 짙은 선) → 도넛 + 목록.
const HoldingGroup = ({
    title,
    items,
}: {
    title: string
    items: InnovationGrowthReport['techInnovation']['holdings']['middleCategory']
}) => (
    <div className="flex flex-col gap-5">
        <h5 className="kbx-text-22 font-kbx-extrabold border-kbx-foreground kbx-border-b-regular pb-3">{title}</h5>
        <DonutListChart
            {...DONUT_LIST_CLASSES}
            emptyText={KBX_CHART_EMPTY_TEXT}
            emptyClassName={cn(KBX_CHART_EMPTY_CLASS, 'h-75')}
            ariaLabel={`${title} 보유기술 비중`}
            data={items.map((item, index) => ({
                id: item.id,
                label: item.label,
                percentage: item.percentage,
                count: item.count,
                valueText: holdingValueText(item.percentage, item.count),
                color: kbxCategoryColor(item.label, index),
            }))}
        />
    </div>
)

// 기술혁신정보 1 — 안내문 · 보유기술(기술 보유현황: 중분류 · 세부분야 기준 도넛을 위아래로).
// 분류 색은 이름으로 정한다(kbxCategoryColor) — 같은 분류는 두 도넛에서 같은 색.
const KbigxPrintInnovationHoldings = ({report}: {report: InnovationGrowthReport}) => {
    const {notice, holdings} = report.techInnovation

    return (
        <>
            <KbxChapterNotice>{notice}</KbxChapterNotice>
            {/* 안내문 → 보유기술 80(쪽 기본 간격) · 설명 → 중분류 기준 40(소블록 간격 16 + mt-6 24). */}
            <KbxBlock title="보유기술">
                <KbxSubBlock title="기술 보유현황">
                    <p className="kbx-text-21 leading-kbx-160 text-kbx-foreground-subtle break-keep">
                        {holdings.description}
                    </p>
                    <div className="mt-6 flex flex-col gap-14">
                        <HoldingGroup title="중분류 기준" items={holdings.middleCategory} />
                        <HoldingGroup title="세부분야 기준" items={holdings.smallCategory} />
                    </div>
                </KbxSubBlock>
            </KbxBlock>
        </>
    )
}

// 특허 보유현황 2행 열 — 들여쓰기 96 · 출원번호 250 · 출원일 220 · 출원인 나머지 · 기술분야 260(본문 폭 1168 기준 비율).
// [주의] 열 폭을 바꾸면 k-bigx-print-report.ts 의 PATENT_PAGE(holderWidth · fieldWidth)도 같이 고친다 —
// 행 높이 어림이 어긋나 10행이 쪽을 넘칠 수 있다.
const PATENT_COLUMNS: readonly KbxStairTableColumn[] = [
    {key: 'number', header: '출원번호 (등록번호)', className: 'w-3/14'},
    {key: 'date', header: '출원일 (등록일)', className: 'w-3/16'},
    {key: 'holder', header: '출원인 (권리자)'},
    {key: 'field', header: '기술분야', className: 'w-2/9'},
]

// 출원번호 · 출원일 칸 — 첫 줄 값 + 둘째 줄 괄호 값(등록번호 · 등록일).
// 값 하나가 2줄을 넘으면 글자를 줄여 2줄 높이에 맞춘다(KbxFitText 기본 maxLines 2) — 칸 높이가 늘지 않게.
const TwoLines = ({first, second}: {first: string; second: string}) => (
    <>
        <KbxFitText as="div">{first}</KbxFitText>
        <KbxSubText>
            <KbxFitText as="div">({second})</KbxFitText>
        </KbxSubText>
    </>
)

// 특허 보유현황 · 우수특허의 줄 수 상한 — 특허명 · 출원인 · 권리자 1줄, 기술분야 2줄에서 말줄임.
// k-bigx-print-report.ts 의 HOLDING_PATENT_LINE_CAPS 와 같은 값이다 — 한쪽을 바꾸면 다른 쪽도 같이 고친다.

// 출원인 · 권리자 칸 — 각각 한 줄, 넘치면 말줄임(권리자는 이름만 줄이고 괄호는 남긴다).
const TruncatedHolder = ({applicant, rightHolder}: {applicant: string; rightHolder: string}) => (
    <>
        <div className="truncate">{orKbxEmpty(applicant)}</div>
        <KbxSubText className="flex justify-center">
            <span className="shrink-0">(</span>
            <span className="truncate">{orKbxEmpty(rightHolder)}</span>
            <span className="shrink-0">)</span>
        </KbxSubText>
    </>
)

// 기술혁신정보 2 — 특허 보유현황(보유기술 이어짐). 특허명 1행 · 세부 2행의 계단식 표.
// [프론트엔드 연동] 출원일 최근순으로 받는다(화면이 정렬하지 않는다). 늘 한 쪽 · 10행 — 앞 10건을 그리고 모자라면 '-' 줄.
// 값이 길어 10행이 쪽 높이를 넘으면 들어가는 행까지만 그린다(getKbigxPatentRows). 못 그린 특허는 웹 화면에서 본다.
const KbigxPrintInnovationPatents = ({report}: {report: InnovationGrowthReport}) => {
    const {patents} = report.techInnovation.holdings
    const {patentRows, emptyRows} = getKbigxPatentRows(patents)

    return (
        <KbxSubBlock title="특허 보유현황" unit="최대 10개 · 출원일 최근순">
            <KbxStairTable
                caption="특허 보유현황(최대 10개, 출원일 최근순)"
                titleHeader="특허명"
                columns={PATENT_COLUMNS}
                rows={[
                    ...patents.slice(0, patentRows).map((patent) => ({
                        key: patent.applicationNumber,
                        // 특허명은 한 줄 — 넘치면 말줄임.
                        title: <div className="truncate">{orKbxEmpty(patent.title)}</div>,
                        cells: [
                            <TwoLines
                                key="number"
                                first={patent.applicationNumber}
                                second={patent.registrationNumber}
                            />,
                            <TwoLines key="date" first={patent.applicationDate} second={patent.registrationDate} />,
                            <TruncatedHolder
                                key="holder"
                                applicant={patent.applicant}
                                rightHolder={patent.rightHolder}
                            />,
                            // 기술분야는 2줄까지 — 넘치면 둘째 줄 끝에서 말줄임(출원번호 두 줄 높이 안).
                            <div key="field" className="line-clamp-2">
                                {orKbxEmpty(patent.field)}
                            </div>,
                        ],
                    })),
                    ...Array.from({length: emptyRows}, (_, index) => ({
                        key: `empty-${index}`,
                        title: KBX_EMPTY_VALUE,
                        cells: PATENT_COLUMNS.map(() => KBX_EMPTY_VALUE),
                    })),
                ]}
            />
        </KbxSubBlock>
    )
}

// ── 특허기술 분석 ──

// 아이콘 이름 줄 — 왼쪽 아이콘 + 이름(140), 오른쪽 글. 아래 옅은 선.
// 이름 칸 높이는 글 한 줄 높이(h-lh)라 글이 여러 줄이어도 이름은 첫 줄에 붙는다.
const LabeledRow = ({icon: Icon, label, children}: {icon: LucideIcon; label: string; children: ReactNode}) => (
    <div className="border-kbx-border kbx-border-b-regular flex gap-6 py-3.5">
        <h5 className="font-kbx-extrabold flex h-lh w-35 shrink-0 items-center gap-2 whitespace-nowrap">
            <Icon aria-hidden="true" className="size-kbx-26 shrink-0" />
            {label}
        </h5>
        <div className="text-kbx-label flex min-w-0 flex-1 flex-col gap-2 break-keep">{children}</div>
    </div>
)

// 문단 목록 — 배열 항목 하나가 문단 하나. 같은 문장이 두 번 와도 키가 겹치지 않게 순서를 붙인다.
const Paragraphs = ({items}: {items: readonly string[]}) =>
    items.map((item, index) => <p key={`${index}-${item}`}>{item}</p>)

// 기술분야 경로 '(기술분야) 대분류 – 중분류 – 소분류' → 단계 목록. 앞의 괄호 머리말은 뺀다.
// [프론트엔드 연동] 화면 보고서와 같은 path 문자열을 '–'(또는 '>')로 나눈다. 단계를 배열로 받게 되면 이 함수만 바꾼다.
const FIELD_PATH_PREFIX = /^\([^)]*\)\s*/
const FIELD_PATH_SEPARATOR = /\s*[–>]\s*/
const fieldLevels = (path: string) => path.replace(FIELD_PATH_PREFIX, '').split(FIELD_PATH_SEPARATOR).filter(Boolean)

// 단계 구분 아이콘(>) 선 두께 — 옆 글자 굵기와 비슷하게.
const PATH_SEPARATOR_STROKE = 2.5

// 단계별 글자 — 대분류(옅게) → 중분류 → 소분류(남색 알약, 가장 크게).
const FIELD_LEVEL_CLASS = {
    first: {size: 'kbx-text-21', style: 'font-kbx-medium text-kbx-foreground-subtle'},
    middle: {size: 'kbx-text-23', style: 'font-kbx-bold text-kbx-label'},
    last: {
        size: 'kbx-text-26',
        style: 'font-kbx-extrabold bg-kbx-primary text-kbx-paper leading-kbx-130 rounded-kbx-8 px-4 py-1',
    },
} as const

const fieldLevelClass = (index: number, count: number) => {
    if (index === count - 1) return FIELD_LEVEL_CLASS.last
    return index ? FIELD_LEVEL_CLASS.middle : FIELD_LEVEL_CLASS.first
}

// 회색 면 상자 — 작은 이름(20px · 옅게) 아래 내용.
const SurfaceBox = ({label, className, children}: {label: string; className?: string; children: ReactNode}) => (
    <div className={cn('bg-kbx-surface flex flex-col px-7', className)}>
        <div className="kbx-text-20 font-kbx-bold text-kbx-foreground-subtle">{label}</div>
        {children}
    </div>
)

// ── 맞춤형 기술정보 · 기업·특허 현황 ──

// 기업수 · 특허수 막대 색(범례와 같다).
const MARKET_SCALE_BARS = {
    left: {
        title: '기업수',
        color: 'var(--kbx-color-chart-series-1)',
        swatchClassName: 'bg-kbx-chart-series-1',
        unit: '기업수(개)',
    },
    right: {
        title: '특허수',
        color: 'var(--kbx-color-chart-series-2)',
        swatchClassName: 'bg-kbx-chart-series-2',
        unit: '특허수(건)',
    },
} as const

// 매출 규모 구간 색 — 작은 구간부터 남색 → 옅은 파랑 5단계(분류 색 첫 단계를 뺀 것). 구간이 더 많으면 마지막 색을 이어 쓴다.
const MARKET_SCALE_COLORS = KBX_CATEGORY_COLORS.slice(1)
const marketScaleColor = (index: number) => MARKET_SCALE_COLORS[index] ?? MARKET_SCALE_COLORS.at(-1)

// 비중 도넛 — 도넛 172 · 목록과 간격 28, 줄 사이 15 · 색 칸 16(옅은 테두리) · 비중 굵게 + 건수 옅게.
// ring — 고리 바깥 84 · 안쪽 43.68 · 조각 사이 2.5(도넛 172 기준)를 viewBox 300 으로 환산한 값(× 300/172).
const SHARE_DONUT_PROPS = {
    className: 'gap-7',
    donutClassName: 'w-43',
    listClassName: 'kbx-text-19 text-kbx-foreground gap-kbx-15',
    rowClassName: '',
    lastRowClassName: '',
    highlightClassName: '',
    labelClassName: 'text-kbx-label',
    valueClassName: 'font-kbx-bold',
    countClassName: 'font-kbx-medium text-kbx-foreground-subtle',
    swatchClassName: 'size-4',
    swatchStroke: 'color-mix(in srgb, var(--kbx-color-foreground) 25%, transparent)',
    gapColor: 'var(--kbx-color-paper)',
    ring: {outer: 146.5, inner: 76.2, gap: 4.36},
} as const satisfies Partial<DonutListChartProps>

// 비중 도넛 하나 — 제목(아래 짙은 선) → 도넛 + 목록.
const ShareDonut = ({
    title,
    countUnit,
    items,
}: {
    title: string
    countUnit: string
    items: InnovationGrowthReport['techInnovation']['marketScale']['companyShare']
}) => (
    <div className="flex min-w-0 flex-col gap-3.5">
        <h5 className="kbx-text-21 font-kbx-extrabold border-kbx-foreground kbx-border-b-regular pb-2.5">{title}</h5>
        <DonutListChart
            {...SHARE_DONUT_PROPS}
            emptyText={KBX_CHART_EMPTY_TEXT}
            emptyClassName={cn(KBX_CHART_EMPTY_CLASS, 'h-43')}
            countUnit={countUnit}
            ariaLabel={`매출 규모별 ${title}`}
            data={items.map((item, index) => ({
                id: item.id,
                label: item.label,
                percentage: item.percentage,
                count: item.count,
                color: marketScaleColor(index),
            }))}
        />
    </div>
)

// 맞춤형 기술정보 · 기업·특허 현황 — 매출 규모별 기업수 · 특허수 막대 표 → 기업수 · 특허수 비중 도넛.
// [프론트엔드 연동 · 정렬] 표와 도넛 모두 매출 규모 순(10억원 이하 → 300억원 초과)으로 받는다 — 비중순이 아니다.
const MarketScaleBlock = ({
    marketScale,
    className,
}: {
    marketScale: InnovationGrowthReport['techInnovation']['marketScale']
    className?: string
}) => (
    <KbxBlock title="맞춤형 기술정보 - 기업·특허 현황" className={className}>
        <KbxSubBlock
            title="매출 규모별 기업 및 특허 현황"
            unit={
                <KbxLegend
                    density="unit"
                    items={[
                        {label: MARKET_SCALE_BARS.left.unit, swatchClassName: MARKET_SCALE_BARS.left.swatchClassName},
                        {label: MARKET_SCALE_BARS.right.unit, swatchClassName: MARKET_SCALE_BARS.right.swatchClassName},
                    ]}
                />
            }
        >
            <DualBarTable
                caption="매출 규모별 기업수(개) · 특허수(건)"
                categoryTitle="매출 규모"
                left={MARKET_SCALE_BARS.left}
                right={MARKET_SCALE_BARS.right}
                // 5행 고정 — 값이 없으면 막대 없이 '-'(toMarketScaleRows).
                data={toMarketScaleRows(marketScale.rows).map((row) => ({
                    id: row.id,
                    label: row.label,
                    left: row.companies,
                    right: row.patents,
                }))}
                tableClassName="kbx-text-21 text-kbx-foreground border-kbx-primary kbx-border-t-strong"
                headClassName="bg-kbx-surface text-kbx-primary font-kbx-bold py-2.5"
                rowClassName="border-kbx-border kbx-border-b-hairline py-kbx-7"
                labelWidthClassName="w-42.5"
                labelClassName="pl-3.5 font-kbx-bold"
                barClassName="h-4.5"
                valueClassName="w-22.5"
            />
            {/* 표 → 비중 도넛 제목 40(소블록 간격 16 + mt-6 24). */}
            <div className="mt-6 grid grid-cols-2 gap-14">
                <ShareDonut title="기업수 비중" countUnit="개" items={marketScale.companyShare} />
                <ShareDonut title="특허수 비중" countUnit="건" items={marketScale.patentShare} />
            </div>
        </KbxSubBlock>
    </KbxBlock>
)

// 기술혁신정보 3 — 특허기술 분석(분석특허 · 맞춤형 기술분야) · 맞춤형 기술정보 · 기업·특허 현황.
const KbigxPrintInnovationAnalysis = ({report}: {report: InnovationGrowthReport}) => (
    <>
        {/* 맞춤형 기술정보는 줄지 않고(shrink-0) 바닥글 선과 40 을 띄운다(pb-10). 특허기술 분석은 남은 높이를 넘길 때만
            줄 수가 많은 글부터 한 줄씩 말줄임하고(KbxClampArea), 그래도 넘치면 아래쪽이 잘린다 — 맞춤형 기술정보는 늘 온전하다. */}
        <KbxClampArea>
            <PatentAnalysisBlock analysis={report.techInnovation.analysis} />
        </KbxClampArea>
        <MarketScaleBlock marketScale={report.techInnovation.marketScale} className="shrink-0 pb-10" />
    </>
)

// 특허기술 분석 — 분석특허 · 맞춤형 기술분야. 값이 비면 '-'.
// 글자 줄임 규칙: 특허명 · 기술분야 단계는 한 줄, 기술분야 설명은 2줄에서 말줄임.
// 특허 개요 · 판단 근거(KbxClampText)는 양쪽 정렬이다. 다 보이다가 쪽이 모자랄 때만 둘 중 줄 수가 많은 쪽부터 한 줄씩 말줄임한다
// (문단이 여럿이면 이어서 센다). 높이 기준은 KbigxPrintInnovationAnalysis 의 KbxClampArea.
const PatentAnalysisBlock = ({
    analysis,
    className,
}: {
    analysis: InnovationGrowthReport['techInnovation']['analysis']
    className?: string
}) => {
    const levels = fieldLevels(analysis.field.path)

    return (
        <KbxBlock title="특허기술 분석" className={className}>
            <KbxSubBlock title="분석특허">
                <SurfaceBox label="특허명" className="py-kbx-18 gap-2">
                    {/* 특허명은 한 줄 — 넘치면 말줄임, 특허번호는 같은 줄 오른쪽(줄지 않음). */}
                    <div className="flex items-baseline justify-between gap-x-6">
                        <div className="kbx-text-24 font-kbx-bold leading-kbx-145 text-kbx-foreground min-w-0 flex-1 truncate">
                            {analysis.patentTitle || KBX_EMPTY_VALUE}
                        </div>
                        <div className="kbx-text-22 font-kbx-bold text-kbx-primary shrink-0">
                            {analysis.patentNumber}
                        </div>
                    </div>
                </SurfaceBox>
                <div className="kbx-text-22 leading-kbx-155">
                    <LabeledRow icon={Award} label="특허 개요">
                        <KbxClampText id="summary" className="space-y-2 text-justify">
                            <Paragraphs items={analysis.summary.length ? analysis.summary : [KBX_EMPTY_VALUE]} />
                        </KbxClampText>
                    </LabeledRow>
                </div>
            </KbxSubBlock>
            {/* 분석특허 → 맞춤형 기술분야 소제목 40(소제목 블록 사이) — 블록 안 간격 32 + mt-2. */}
            <KbxSubBlock title="맞춤형 기술분야" className="mt-2">
                <div className="kbx-text-22 leading-kbx-155 flex flex-col gap-3.5">
                    <SurfaceBox label="기술분야" className="pt-kbx-18 gap-2.5 pb-5">
                        {/* 단계는 한 줄 — 폭이 모자라면 줄바꿈 없이 단계마다 말줄임(긴 단계일수록 더 줄어든다).
                            단계가 없으면 '-'. */}
                        {levels.length ? (
                            <ol className="leading-kbx-140 flex items-baseline gap-x-3.5">
                                {levels.map((level, index) => (
                                    <li key={`${index}-${level}`} className="flex min-w-0 items-baseline gap-x-3.5">
                                        {index ? (
                                            // 단계 구분 '>' — 꾸밈 아이콘이라 낭독에서 숨긴다(글자 명도 대비 대상 아님).
                                            <ChevronRight
                                                aria-hidden="true"
                                                strokeWidth={PATH_SEPARATOR_STROKE}
                                                className="size-kbx-18 text-kbx-path-separator shrink-0 self-center"
                                            />
                                        ) : null}
                                        <span
                                            className={cn(
                                                'truncate',
                                                fieldLevelClass(index, levels.length).style,
                                                fieldLevelClass(index, levels.length).size,
                                            )}
                                        >
                                            {level}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <p className="leading-kbx-140">{KBX_EMPTY_VALUE}</p>
                        )}
                        <div className="border-kbx-border kbx-border-t-hairline text-kbx-label mt-1 pt-3 break-keep">
                            {/* 기술분야 설명은 2줄까지 — 넘치면 말줄임. */}
                            <p className="line-clamp-2">{analysis.field.description || KBX_EMPTY_VALUE}</p>
                        </div>
                    </SurfaceBox>
                    <div className="border-kbx-border kbx-border-t-regular">
                        <LabeledRow icon={Lightbulb} label="판단 근거">
                            <KbxClampText id="reasons" className="space-y-2 text-justify">
                                <Paragraphs items={analysis.reasons.length ? analysis.reasons : [KBX_EMPTY_VALUE]} />
                            </KbxClampText>
                        </LabeledRow>
                    </div>
                </div>
            </KbxSubBlock>
        </KbxBlock>
    )
}

// ── 맞춤형 기술정보 · 경쟁기업 및 우수기업 ──

// 경쟁기업 사업실적 — 흑백 인쇄에서도 갈리게 명도 3단계: 조회기업 진남(가장 진함) · 경쟁기업 파랑 · 평균 옅은 바탕 + 파랑 사선 · 테두리.
// 선(영업이익률)은 진남 + 흰 바깥 테두리 — 진남 막대 위에서도 끊겨 보이지 않게.
const COMPETITOR_CHART_COLORS = {
    bar: 'var(--kbx-color-chart-general)',
    subjectBar: 'var(--kbx-color-chart-subject)',
    averageBar: 'var(--kbx-color-chart-average-base)',
    averageLine: 'var(--kbx-color-chart-average-line)',
    line: 'var(--kbx-color-chart-trend)',
    lineHalo: 'var(--kbx-color-chart-trend-halo)',
    marker: 'var(--kbx-color-paper)',
    baseline: 'var(--kbx-color-foreground-subtle)',
    divider: 'var(--kbx-color-chart-grid)',
    value: 'var(--kbx-color-label)',
    lineValue: 'var(--kbx-color-paper)',
    category: 'var(--kbx-color-foreground)',
    subject: 'var(--kbx-color-chart-subject-label)',
} as const

// 경쟁기업 그래프 · 성장률 우수기업 목록의 회사 이름은 한 줄 — 칸보다 길면 말줄임(…).
// 값이 숫자가 아니면(값 없음) '-', 0 은 0. 그래프 값은 받은 소수 자리 그대로 천 단위 쉼표, 목록은 '%' 를 붙인다.
const competitorValueFormat = new Intl.NumberFormat('ko-KR', {maximumFractionDigits: 20})
const formatCompetitorValue = (value: number) =>
    isKbxNumber(value) ? competitorValueFormat.format(value) : KBX_EMPTY_VALUE
const formatGrowthRate = (value: number) => (isKbxNumber(value) ? `${value}%` : KBX_EMPTY_VALUE)

// 성장률 우수기업 목록 — 20px · 줄 여백 8 · 이름 칸 170 · 막대 16 · 값 칸 72.
const RANK_LIST_PROPS = {
    listClassName: 'kbx-text-20 text-kbx-foreground border-kbx-primary kbx-border-t-strong',
    titleClassName: 'bg-kbx-surface text-kbx-primary kbx-text-21 font-kbx-extrabold px-3.5 py-2.5',
    rowClassName: 'border-kbx-border-subtle kbx-border-b-hairline py-2',
    averageRowClassName: 'border-t-kbx-foreground kbx-border-t-regular text-kbx-foreground-subtle font-kbx-bold',
    subjectRowClassName: 'bg-kbx-surface text-kbx-primary font-kbx-extrabold',
    nameClassName: 'w-42.5 pl-3.5',
    barClassName: 'h-4',
    valueClassName: 'w-18',
    highlightValueClassName: 'font-kbx-bold',
    highlightIconClassName: 'size-kbx-22 text-kbx-star fill-current',
    highlightLabel: '고성장',
    // 이름은 한 줄 — 칸보다 길면 말줄임(…). 보이는 것만 잘리고 글자는 남아 화면 낭독기는 전체를 읽는다.
    renderName: (name: string) => <span className="block truncate">{name}</span>,
    // 값이 없으면 막대 없이 '-'.
    formatValue: formatGrowthRate,
} as const satisfies Partial<RankBarListProps>

// 순위 막대 색 — 100억원 이하는 남색 · 초과는 파랑(인자 bar). 평균(옅은 바탕 + 사선 · 테두리 — 같은 쪽 경쟁기업 그래프와
// 같은 표현) · 조회기업(초록)은 두 목록이 같다. 조회기업을 진남으로 두면 100억원 이하 막대(남색)와 겹쳐 초록을 유지한다.
const rankColors = (bar: string) => ({
    bar,
    averageBar: 'var(--kbx-color-chart-average-base)',
    averageLine: 'var(--kbx-color-chart-average-line)',
    subjectBar: 'var(--kbx-color-green)',
})

// 데이터 → RankBarList 항목. keepCorporatePrefix — '(주)' 같은 법인 표기 뒤에서 줄이 갈리지 않게 붙인다(보이는 글자는 같다).
type GrowthLeaderItems = InnovationGrowthReport['techInnovation']['growthLeaders']['small']['items']
const toRankItems = (items: GrowthLeaderItems) =>
    items.map((item) => ({
        id: item.id,
        name: keepCorporatePrefix(item.name),
        value: item.value,
        tone: item.tone,
        isHighlighted: item.isHighGrowth,
    }))

// 기술혁신정보 4 — 경쟁기업 사업실적(막대 + 선) · 성장률 우수기업(100억원 이하 · 초과 순위 막대).
const KbigxPrintInnovationCompetitors = ({report}: {report: InnovationGrowthReport}) => {
    const {competitors, growthLeaders} = report.techInnovation
    const small = toRankItems(growthLeaders.small.items)
    const large = toRankItems(growthLeaders.large.items)
    // 두 목록의 막대 길이를 견줄 수 있게 같은 끝 값을 쓴다(최댓값을 보기 좋은 값으로 올림, 예: 23.5 → 25).
    // 값이 없는 줄은 끝 값 계산에서 뺀다.
    const rankMax = rankBarScaleMax(...[small, large].map((items) => items.filter((item) => isKbxNumber(item.value))))

    return (
        <KbxBlock title="맞춤형 기술정보 · 경쟁기업 및 우수기업">
            {/* [프론트엔드 연동] 받은 순서대로 그린다 — 조회기업 · 평균 자리도 데이터 순서를 따른다(tone 으로 색 구분).
                단위는 소제목 아래 오른쪽 끝. */}
            <KbxSubBlock title="경쟁기업 사업실적 (매출액·영업이익률)">
                <KbxUnitBelow unit="단위: 백만원, %">
                    <KbxChartBox isEmpty={!competitors.length} emptyClassName="h-120">
                        <ComboValueChart
                            ariaLabel="경쟁기업 매출액(막대)과 영업이익률(선) 비교"
                            barLabel="매출액"
                            barUnit="백만원"
                            lineLabel="영업이익률"
                            lineUnit="%"
                            colors={COMPETITOR_CHART_COLORS}
                            isCategoryTruncated
                            formatValue={formatCompetitorValue}
                            data={competitors.map((item) => ({
                                id: item.id,
                                label: keepCorporatePrefix(item.label),
                                value: item.sales,
                                lineValue: item.growthRate,
                                tone: item.tone,
                            }))}
                        />
                    </KbxChartBox>
                </KbxUnitBelow>
            </KbxSubBlock>
            {/* 그래프 → 성장률 우수기업 소제목 40(소제목 블록 사이) — 블록 안 간격 32 + mt-2. */}
            <KbxSubBlock
                title="성장률 우수기업 (최근3개년 매출액 연평균 성장률)"
                className="mt-2"
                unit={
                    <span className="flex items-center gap-2">
                        <Star aria-hidden="true" className="size-kbx-22 text-kbx-star shrink-0 fill-current" />
                        고성장 기업
                    </span>
                }
            >
                {/* [프론트엔드 연동] 성장률 높은 순 → 평균 · 조회기업 순으로 받는다(화면이 정렬하지 않는다). */}
                <div className="grid grid-cols-2 items-start gap-12">
                    <RankBarList
                        {...RANK_LIST_PROPS}
                        emptyText={KBX_CHART_EMPTY_TEXT}
                        emptyClassName={cn(KBX_CHART_EMPTY_CLASS, 'h-75')}
                        title={`매출 ${growthLeaders.small.title}`}
                        items={small}
                        max={rankMax}
                        colors={rankColors('var(--kbx-color-navy)')}
                    />
                    <RankBarList
                        {...RANK_LIST_PROPS}
                        emptyText={KBX_CHART_EMPTY_TEXT}
                        emptyClassName={cn(KBX_CHART_EMPTY_CLASS, 'h-75')}
                        title={`매출 ${growthLeaders.large.title}`}
                        items={large}
                        max={rankMax}
                        colors={rankColors('var(--kbx-color-blue)')}
                    />
                </div>
            </KbxSubBlock>
        </KbxBlock>
    )
}

// ── 맞춤형 기술정보 · 우수기술 ──

// 우수특허 2행 열 — 들여쓰기 96 · 출원번호 240 · 출원일 210 · 출원인 나머지 · 피인용 횟수 140 · 피인용 지수 140
// (본문 폭 1168 기준 비율).
// [주의] 열 폭을 바꾸면 k-bigx-print-report.ts 의 EXCELLENT_PATENT_PAGE.holderWidth 도 같이 고친다.
const EXCELLENT_PATENT_COLUMNS: readonly KbxStairTableColumn[] = [
    {key: 'number', header: '출원번호 (등록번호)', className: 'w-5/24'},
    {key: 'date', header: '출원일 (등록일)', className: 'w-2/11'},
    {key: 'holder', header: '출원인 (권리자)'},
    {key: 'citations', header: '피인용 횟수', className: 'w-3/25'},
    {key: 'index', header: '피인용 지수*', className: 'w-3/25'},
]
const EXCELLENT_OTHER_LABEL = '기타'
const EXCELLENT_PATENT_NOTE =
    '* 피인용 지수는 특허의 피인용 횟수를 경과연도로 나누어 정규화한 값임(Age-Normalized Citation Index, ANCI)'

// 기술혁신정보 5 — 우수특허. 피인용 지수 높은 순 10건 + 11건 이상이면 '기타' 줄(나머지 피인용 횟수 합).
// 정렬 · 기타 합은 getKbigxExcellentPatentRows(k-bigx-print-report.ts)가 한다 — 화면 보고서와 같은 규칙.
// 늘 한 쪽 · 10행 — 모자라면 '-' 줄, 값이 길어 쪽을 넘으면 들어가는 행까지만. 줄 수 상한은 특허 보유현황과 같다.
const KbigxPrintInnovationExcellent = ({report}: {report: InnovationGrowthReport}) => {
    const {patents, otherCitations, emptyRows} = getKbigxExcellentPatentRows(report)
    const rows = [
        ...patents.map((patent) => ({
            key: patent.applicationNumber,
            // 특허명은 한 줄 — 넘치면 말줄임.
            title: <div className="truncate">{orKbxEmpty(patent.title)}</div>,
            cells: [
                <TwoLines key="number" first={patent.applicationNumber} second={patent.registrationNumber} />,
                <TwoLines key="date" first={patent.applicationDate} second={patent.registrationDate} />,
                <TruncatedHolder key="holder" applicant={patent.applicant} rightHolder={patent.rightHolder} />,
                formatKbxNumber(patent.citations),
                <span key="index" className="text-kbx-primary">
                    {formatKbxNumber(patent.citationIndex, kbxFixed1Format)}
                </span>,
            ],
        })),
        ...Array.from({length: emptyRows}, (_, index) => ({
            key: `empty-${index}`,
            title: KBX_EMPTY_VALUE,
            cells: EXCELLENT_PATENT_COLUMNS.map(() => KBX_EMPTY_VALUE),
        })),
        ...(otherCitations === null
            ? []
            : [
                  {
                      key: 'other',
                      title: EXCELLENT_OTHER_LABEL,
                      titleClassName: 'text-kbx-foreground-subtle',
                      cells: [
                          KBX_EMPTY_VALUE,
                          KBX_EMPTY_VALUE,
                          KBX_EMPTY_VALUE,
                          formatKbxNumber(otherCitations),
                          KBX_EMPTY_VALUE,
                      ],
                  },
              ]),
    ]

    return (
        <KbxBlock title="맞춤형 기술정보 · 우수기술">
            <KbxSubBlock title="우수특허">
                <KbxStairTable
                    caption="우수특허(피인용 지수 높은 순 10건, 나머지는 기타)"
                    titleHeader="특허명"
                    columns={EXCELLENT_PATENT_COLUMNS}
                    emptyText="우수특허가 없습니다."
                    rows={rows}
                />
                <KbxNote>{EXCELLENT_PATENT_NOTE}</KbxNote>
            </KbxSubBlock>
        </KbxBlock>
    )
}

// ── 맞춤형 기술정보 · 우수기술(이머징 기술) · R&D(R&D 이슈) ──

const EMERGING_DESCRIPTION =
    '귀사의 기술과 유사한 기술분야(세부분야)에 대한 최근 10년간 등록특허 증가율을 확인하여 각 기술분야의 발전정도를 확인할 수 있는 정보입니다.'
const RND_ISSUE_DESCRIPTION =
    'R&D 이슈는 귀사의 기술이 속한 기술분야(세부분야)를 기준으로, 최근 3년 이내에 등록된 특허를 분석하여 제공되는 정보입니다.'
const EMERGING_COUNT_GROUP = '특허 등록건수'
const TOTAL_LABEL = '합계'

// 소제목 아래 안내문.
const Description = ({children}: {children: ReactNode}) => (
    <p className="kbx-text-21 leading-kbx-155 text-kbx-foreground-subtle break-keep">{children}</p>
)

// 기술혁신정보 6 — 이머징 기술(기술분야별 기간 등록건수 · 합계 · 증가율 · 비중 + 합계 줄) · R&D 이슈(워드클라우드).
// [프론트엔드 연동] 이머징 기술은 API 가 10건 + '기타' 줄까지 만들어 보낸다 — 받은 줄을 그대로 그린다.
//   계산은 화면이 한다: 줄별 합계(기간 값의 합) · 맨 아래 합계 줄(기간별 합). 증가율 · 비중은 받은 값 그대로.
// 숫자가 아닌 값은 '-', 0 은 0 · 0.0. 합계는 숫자인 값만 더하고 하나도 없으면 '-'.
// 늘 한 쪽 — 표 최대 12줄(10건 + 기타 + 합계) + R&D 이슈 상자 410 이 들어가고 바닥글 선과 40 이상 띄운다.
// 그래서 기술분야 이름은 한 줄에서 말줄임한다(줄이 늘면 쪽을 넘는다).
const KbigxPrintInnovationEmerging = ({report}: {report: InnovationGrowthReport}) => {
    const {periods, rows} = report.techInnovation.emergingTech
    const issueWords = getKbxIssueWords(report.innovation.issues)
    // 열 — 기술분야 256 · 기간 칸(나머지를 똑같이 나눔) · 합계 80 · 증가율 80 · 비중 72.
    const columns: readonly KbxTableColumn[] = [
        {key: 'field', header: '기술분야', isRowHeader: true, className: 'w-64'},
        // 기간 · 합계 칸은 좁아 좌우 여백 4(isNarrow) · 기간 머리는 한 줄. 머리 숫자만 고정폭을 끈다(normal-nums) —
        // 고정폭이면 글자가 넓어져 이웃 기간 머리와 붙는다.
        ...periods.map((period) => ({
            key: period,
            header: period,
            group: EMERGING_COUNT_GROUP,
            isNarrow: true,
            headerClassName: 'whitespace-nowrap normal-nums',
        })),
        {key: 'total', header: TOTAL_LABEL, group: EMERGING_COUNT_GROUP, className: 'w-20', isNarrow: true},
        {
            key: 'growth',
            header: (
                <>
                    증가율
                    <br />
                    (%)
                </>
            ),
            className: 'w-20',
        },
        {key: 'share', header: '비중(%)', className: 'w-18'},
    ]
    const periodTotals = periods.map((_, index) => sumKbxNumbers(rows.map((row) => row.counts[index])))

    return (
        <>
            <KbxBlock title="맞춤형 기술정보 · 우수기술">
                <KbxSubBlock title="이머징 기술">
                    <Description>{EMERGING_DESCRIPTION}</Description>
                    <KbxTable
                        caption="이머징 기술 — 기술분야별 특허 등록건수 · 증가율 · 비중"
                        columns={columns}
                        rows={[
                            ...rows.map((row) => ({
                                key: row.field,
                                cells: [
                                    // 기술분야는 한 줄 — 넘치면 말줄임.
                                    <div key="field" className="truncate">
                                        {row.field.trim() || KBX_EMPTY_VALUE}
                                    </div>,
                                    ...periods.map((period, index) => formatKbxNumber(row.counts[index])),
                                    formatKbxNumber(sumKbxNumbers(row.counts.slice(0, periods.length))),
                                    formatKbxNumber(row.growthRate, kbxFixed1Format),
                                    formatKbxNumber(row.share, kbxFixed1Format),
                                ],
                            })),
                            {
                                key: 'total',
                                isTotal: true,
                                cells: [
                                    TOTAL_LABEL,
                                    ...periodTotals.map((total) => formatKbxNumber(total)),
                                    formatKbxNumber(sumKbxNumbers(periodTotals)),
                                    KBX_EMPTY_VALUE,
                                    KBX_EMPTY_VALUE,
                                ],
                            },
                        ]}
                    />
                </KbxSubBlock>
            </KbxBlock>
            {/* 표 → 다음 중제목 80(쪽 기본 간격). */}
            <KbxBlock title="맞춤형 기술정보 · R&D">
                <KbxSubBlock title="R&D 이슈">
                    <Description>{RND_ISSUE_DESCRIPTION}</Description>
                    {/* 키워드가 없으면 WordCloud 대신 안내 문구 — 빈 목록을 넘기면 WordCloud 가 스켈레톤을 계속 보여
                        인쇄가 제한 시간까지 기다린다. 상자는 본문 폭의 18/25(842) × 410, 가운데 —
                        높이를 늘리면 표 12줄과 한 쪽에 안 들어갈 수 있다. */}
                    <KbxChartBox isEmpty={!issueWords.length} emptyClassName="mt-4 h-102.5 w-18/25 self-center">
                        <div className="bg-kbx-surface-subtle mt-4 flex h-102.5 w-18/25 items-center justify-center self-center px-10 py-4">
                            <WordCloud
                                words={issueWords}
                                colors={INNOVATION_ISSUE_COLORS}
                                ariaLabel="최근 3년 등록특허의 R&D 이슈 키워드"
                                className="h-full w-full"
                            />
                        </div>
                    </KbxChartBox>
                </KbxSubBlock>
            </KbxBlock>
        </>
    )
}

// ── 맞춤형 기술정보 · R&D(R&D 전문기관 현황) ──

type RndInstituteSide = 'government' | 'academia'
const RND_INSTITUTE_SIDES: readonly RndInstituteSide[] = ['government', 'academia']
const RND_INSTITUTE_LABELS = {government: '정부출연연구소', academia: '산학협력단'} as const
const RND_INSTITUTE_OTHER_LABELS = {government: '기타 연구소', academia: '기타 산학협력단'} as const
const RND_INSTITUTE_NOTE = '* 세부분야 전체 특허건수 기준 정부출연연구소와 산학협력단의 특허건수 비중임'
type RndInstitute = InnovationGrowthReport['techInnovation']['rndInstitutes']['government']['rows'][number]

// 화면 보고서와 같이 10곳까지 그대로, 넘으면 11번째 줄에 나머지를 '기타 …' 한 줄로 합친다(특허보유수 · 비중을 더한다).
const groupInstitutes = (rows: readonly RndInstitute[], otherLabel: string): RndInstitute[] => {
    if (rows.length <= KBIGX_PRINT_LIST_LIMIT) return [...rows]
    const rest = rows.slice(KBIGX_PRINT_LIST_LIMIT)
    return [
        ...rows.slice(0, KBIGX_PRINT_LIST_LIMIT),
        {
            name: otherLabel,
            patentCount: sumKbxNumbers(rest.map((row) => row.patentCount)),
            ratio: sumKbxNumbers(rest.map((row) => row.ratio)),
        },
    ]
}

// 기술혁신정보 7 — R&D 전문기관 현황. 정부출연연구소 · 산학협력단을 한 표에 나란히(묶음 머리에 비중 %).
// [프론트엔드 연동] 받은 순서대로 앞 10곳 + 나머지는 '기타 …' 한 줄(groupInstitutes). 합계 줄 · 묶음 머리 비중은 받은
//   total · share 를 그대로 쓴다(화면이 계산하지 않는다).
// 표는 늘 10줄 이상 — 두 기관 쪽 중 긴 쪽까지 줄을 만들고 빈 칸은 '-'. 기관이 하나도 없는 쪽은 비중 · 합계도 '-'.
// 숫자가 아닌 값은 '-'(0 은 0 · 0.0), 기관명은 2줄에서 말줄임.
const KbigxPrintInnovationInstitutes = ({report}: {report: InnovationGrowthReport}) => {
    const {rndInstitutes} = report.techInnovation
    const sides = RND_INSTITUTE_SIDES.map((side) => ({
        side,
        rows: groupInstitutes(rndInstitutes[side].rows, RND_INSTITUTE_OTHER_LABELS[side]),
    }))
    // 늘 10줄 — 모자라면 '-' 줄, 기타가 붙으면 11줄.
    const rowCount = Math.max(KBIGX_PRINT_LIST_LIMIT, ...sides.map(({rows}) => rows.length))
    // 열 — 기관 쪽마다 기관명(나머지) · 특허보유수 150 · 비중 130. 정부출연연구소 기관명만 행 머리(th · 굵게)다.
    const columns: readonly KbxTableColumn[] = RND_INSTITUTE_SIDES.flatMap((side, index) => {
        // 기관이 없는 쪽은 비중 · 합계를 '-' 로(받은 값이 0 이어도).
        const hasRows = rndInstitutes[side].rows.length > 0
        const group = `${RND_INSTITUTE_LABELS[side]} (${hasRows ? formatKbxNumber(rndInstitutes[side].share, kbxFixed1Format) : KBX_EMPTY_VALUE}%)*`
        return [
            {key: `${side}-name`, header: '기관명', group, isRowHeader: !index, hasHeaderDivider: index > 0},
            {key: `${side}-count`, header: '특허보유수', group, className: 'w-37.5'},
            {key: `${side}-ratio`, header: '비중(%)', group, className: 'w-32.5'},
        ]
    })

    return (
        <KbxBlock title="맞춤형 기술정보 · R&D">
            <KbxSubBlock title="R&D 전문기관 현황">
                <KbxTable
                    caption="R&D 전문기관 현황 — 정부출연연구소 · 산학협력단별 특허보유수와 비중"
                    columns={columns}
                    rows={[
                        ...Array.from({length: rowCount}, (_, index) => ({
                            key: `row-${index}`,
                            cells: sides.flatMap(({rows}) => {
                                const row = rows[index]
                                // 기관명은 2줄까지 — 넘치면 말줄임. 짧은 쪽의 빈 줄은 '-'.
                                return row
                                    ? [
                                          <div key="name" className="line-clamp-2">
                                              {row.name.trim() || KBX_EMPTY_VALUE}
                                          </div>,
                                          formatKbxNumber(row.patentCount),
                                          formatKbxNumber(row.ratio, kbxFixed1Format),
                                      ]
                                    : [KBX_EMPTY_VALUE, KBX_EMPTY_VALUE, KBX_EMPTY_VALUE]
                            }),
                        })),
                        {
                            key: 'total',
                            isTotal: true,
                            cells: RND_INSTITUTE_SIDES.flatMap((side) =>
                                rndInstitutes[side].rows.length
                                    ? [
                                          TOTAL_LABEL,
                                          formatKbxNumber(rndInstitutes[side].total.patentCount),
                                          formatKbxNumber(rndInstitutes[side].total.ratio, kbxFixed1Format),
                                      ]
                                    : [TOTAL_LABEL, KBX_EMPTY_VALUE, KBX_EMPTY_VALUE],
                            ),
                        },
                    ]}
                />
                {/* 표 → 각주 간격 8 — 소블록 간격 16 에서 8 을 당긴다. */}
                <p className="kbx-text-20 text-kbx-foreground-subtle -mt-2 break-keep">{RND_INSTITUTE_NOTE}</p>
            </KbxSubBlock>
        </KbxBlock>
    )
}

// ── 정부 R&D 사업 현황(접수중과제 · 접수기간 도래 과제) ──

const RND_PROJECT_UPCOMING_NOTE =
    '* 접수기간 도래 과제는 사업실시가 확정되지 않은 과제로, 보고서 조회시점 기준 전년 동기에 접수 중(예정 포함)인 과제임'
// 열 — 부처명(전문기관) 300 · 공고명 나머지 · 접수기간 160 · 담당자 175. 부처명이 행 머리(th · 굵게)다.
// [주의] 열 폭 · 줄 수 상한을 바꾸면 k-bigx-print-report.ts 의 RND_PROJECT_AREA(행 높이 80)도 같이 확인한다.
const RND_PROJECT_COLUMNS: readonly KbxTableColumn[] = [
    {key: 'ministry', header: '부처명 (전문기관)', isRowHeader: true, className: 'w-75'},
    {key: 'title', header: '공고명'},
    {key: 'period', header: '접수기간', className: 'w-40'},
    {key: 'manager', header: '담당자', className: 'w-43.75'},
]
// 접수기간 · 담당자 문자열을 첫 줄 + 둘째 줄로 나눈다 — 화면 보고서와 같은 문자열을 받는다.
// [프론트엔드 연동] 접수기간 'YYYY-MM-DD ~ YYYY-MM-DD' → 시작일 / '~ 종료일', 담당자 '이름 (연락처)' → 이름 / '(연락처)'.
//   나눌 자리가 없으면 한 줄로 그대로 적는다. 값을 나눠 받게 되면 splitPeriod · splitManager 만 바꾼다.
const PERIOD_SEPARATOR = ' ~ '
const MANAGER_PATTERN = /^(.*?)\s*(\([^)]*\))$/
const splitPeriod = (period: string) => {
    const [start, end] = period.split(PERIOD_SEPARATOR)
    return end ? {first: start, second: `~ ${end}`} : {first: period, second: null}
}
const splitManager = (manager: string) => {
    const match = manager.match(MANAGER_PATTERN)
    return match ? {first: match[1], second: match[2]} : {first: manager, second: null}
}
// 담당자 칸 — 이름 · 연락처(옅게) 각각 한 줄. 넘치면 그 줄만 글자를 줄여 다 보이게 한다(행 높이가 늘지 않게).
const MANAGER_MAX_LINES = 1
const StackedCell = ({first, second}: {first: string; second: string | null}) => (
    <>
        <KbxFitText as="div" maxLines={MANAGER_MAX_LINES}>
            {first}
        </KbxFitText>
        {second ? (
            <KbxSubText>
                <KbxFitText as="div" maxLines={MANAGER_MAX_LINES}>
                    {second}
                </KbxFitText>
            </KbxSubText>
        ) : null}
    </>
)
// 접수기간 칸 — 시작일 / '~ 종료일' 두 줄을 같은 글자 크기 · 색으로(담당자와 달리 둘째 줄을 옅게 하지 않는다).
const PeriodCell = ({first, second}: {first: string; second: string | null}) => (
    <>
        {first}
        {second ? <div>{second}</div> : null}
    </>
)

type RndProjects = InnovationGrowthReport['techInnovation']['governmentRnd']['open']

// 과제 표 행 — 앞에서부터 rowCount 건, 모자라면 '-' 줄로 채운다.
const rndProjectRows = (projects: RndProjects, rowCount: number) =>
    Array.from({length: rowCount}, (_, index) => {
        const project = projects[index]
        return project
            ? {
                  key: `${project.title}-${index}`,
                  cells: [
                      // 부처명 · 전문기관은 각각 한 줄 — 넘치면 말줄임.
                      <>
                          <div className="truncate">{orKbxEmpty(project.ministry)}</div>
                          {/* 전문기관 — 둘째 줄, 부처명보다 가늘게. 값이 없으면 줄째 뺀다. */}
                          {project.agency.trim() ? (
                              <KbxSubText className="font-kbx-medium mt-0.5 flex justify-center">
                                  {/* 괄호는 늘 보이고 전문기관 이름만 말줄임. */}
                                  <span className="shrink-0">(</span>
                                  <span className="truncate">{project.agency}</span>
                                  <span className="shrink-0">)</span>
                              </KbxSubText>
                          ) : null}
                      </>,
                      // 공고명은 2줄까지 — 넘치면 둘째 줄 끝에서 말줄임.
                      <div key="title" className="line-clamp-2">
                          {orKbxEmpty(project.title)}
                      </div>,
                      <PeriodCell key="period" {...splitPeriod(orKbxEmpty(project.period))} />,
                      <StackedCell key="manager" {...splitManager(orKbxEmpty(project.manager))} />,
                  ],
              }
            : {key: `empty-${index}`, cells: RND_PROJECT_COLUMNS.map(() => KBX_EMPTY_VALUE)}
    })

// 기술혁신정보 8 — 정부 R&D 사업 현황(접수중과제 · 접수기간 도래 과제(미확정) + 각주). 늘 한 쪽이다.
// 행 수는 getKbigxRndProjectLayout(k-bigx-print-report.ts)이 정한다 — 접수중과제는 늘 10행(모자라면 '-' 줄),
// 도래 과제는 남은 높이에 들어가는 만큼(최대 10행, 남는 자리는 '-' 줄). 못 그린 과제는 웹 화면에서 본다.
// 행 높이를 고정하려고 공고명 2줄 · 부처명 · 전문기관 각 1줄에서 말줄임, 담당자는 줄마다 1줄에 맞춰 글자를 줄인다.
// 남는 높이는 두 칸 몫(openSlots : upcomingSlots = 10 : 6) 비율로 나눈다 — flex-grow 값이 런타임 숫자라 인라인 스타일.
// 바닥글 선과 40 을 띄운다(pb-10).
const KbigxPrintInnovationRnd = ({report}: {report: InnovationGrowthReport}) => {
    const {open, upcoming, baseDate} = report.techInnovation.governmentRnd
    const {openRows, upcomingRows, openSlots, upcomingSlots} = getKbigxRndProjectLayout(upcoming)

    return (
        <KbxBlock
            title="정부 R&D 사업 현황"
            unit={`기준일자 · ${baseDate || KBX_EMPTY_VALUE}`}
            className="flex-1 pb-10"
        >
            <div className="flex min-h-0 flex-1 flex-col gap-y-10">
                <div className="flex min-h-0 flex-col" style={{flexGrow: openSlots}}>
                    <KbxSubBlock title="접수중과제" className="min-h-0 flex-1">
                        <KbxTable
                            caption="정부 R&D 접수중과제"
                            density="stacked"
                            className="flex-1"
                            columns={RND_PROJECT_COLUMNS}
                            rows={rndProjectRows(open, openRows)}
                        />
                    </KbxSubBlock>
                </div>
                <div className="flex min-h-0 flex-col" style={{flexGrow: upcomingSlots}}>
                    <KbxSubBlock title="접수기간 도래 과제(미확정)*" className="min-h-0 flex-1">
                        <KbxTable
                            caption="정부 R&D 접수기간 도래 과제(미확정)"
                            density="stacked"
                            className="flex-1"
                            columns={RND_PROJECT_COLUMNS}
                            rows={rndProjectRows(upcoming, upcomingRows)}
                        />
                        <KbxNote>{RND_PROJECT_UPCOMING_NOTE}</KbxNote>
                    </KbxSubBlock>
                </div>
            </div>
        </KbxBlock>
    )
}

export {
    KbigxPrintInnovationRnd,
    KbigxPrintInnovationInstitutes,
    KbigxPrintInnovationEmerging,
    KbigxPrintInnovationExcellent,
    KbigxPrintInnovationCompetitors,
    KbigxPrintInnovationAnalysis,
    KbigxPrintInnovationHoldings,
    KbigxPrintInnovationPatents,
}
