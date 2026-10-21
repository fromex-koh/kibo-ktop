import type {ReactNode} from 'react'
import {Check, Minus} from 'lucide-react'
import {
    KbxBlock,
    KbxChartBox,
    keepCorporatePrefix,
    KbxLabelValueGrid,
    KbxLegend,
    KbxStatCard,
    KbxSubBlock,
    KbxTable,
    KbxUnitBelow,
} from '@/components/custom/kbigx-print-parts'
import {MarkerLineChart, MarkerLineLegend} from '@/components/custom/marker-line-chart'
import {NestedColumnChart} from '@/components/custom/nested-column-chart'
import type {
    InnovationFinanceRow,
    InnovationGrowthReport,
    InnovationTradePartner,
} from '@/content/service/k-bigx-innovation-report'
import {
    COMPANY_OVERVIEW_FIT_LABELS,
    COMPANY_OVERVIEW_LABELS,
    getKbigxCompanyFirstPageLayout,
    KBIGX_PRINT_LIST_LIMIT,
    type KbigxCompanyFirstPageLayout,
} from '@/content/service/k-bigx-print-report'
import {cn} from '@/lib/utils'
import {
    formatKbxNumber,
    isKbxNumber,
    KBX_EMPTY_VALUE,
    kbxFixed2Format,
    kbxNumberFormat,
} from '@/components/custom/kbigx-print-format'

// K-BIGx 보고서 인쇄본 — 기업현황 장(쪽 id company-1 · company-2 · company-3, kbigx-print-document.tsx 에서 연결).
// 데이터는 화면 보고서와 같은 InnovationGrowthReport.companyStatus 를 그대로 읽는다.
// 표는 쪽마다 정해진 행 수만 그린다 — 데이터가 많으면 앞에서부터 자르고(나머지는 웹 화면), 모자라면 '-' 줄로 채운다.
// 첫 쪽 표 행 수는 k-bigx-print-report.ts 의 높이 어림(getKbigxCompanyFirstPageLayout)이 정하고, 거래처는 늘 10행이다.
const COUNT_UNIT = '건'
const CERTIFIED_LABEL = '인증'
const NOT_CERTIFIED_LABEL = '미인증'

// 표 행 만들기 — 앞에서부터 rowCount 건을 그리고, 모자라면 '-' 줄로 채운다. 행 key 는 순번이다.
const padRows = <T,>(
    rows: readonly T[],
    toCells: (row: T) => readonly ReactNode[],
    columnCount: number,
    rowCount: number,
) => {
    const cells = rows.slice(0, rowCount).map(toCells)
    const blankCount = Math.max(0, rowCount - cells.length)

    return [
        ...cells,
        ...Array.from({length: blankCount}, () => Array<ReactNode>(columnCount).fill(KBX_EMPTY_VALUE)),
    ].map((row, index) => ({key: String(index), cells: row}))
}

const EXECUTIVE_COLUMNS = [
    {key: 'role', header: '구분', isRowHeader: true},
    {key: 'name', header: '성명'},
    {key: 'birth', header: '생년월일'},
] as const

// 주주 현황은 단위를 머리글에 적는다 — 소유주식수(주) · 지분율(%).
const SHAREHOLDER_COLUMNS = [
    {key: 'name', header: '주주명', isRowHeader: true, className: 'w-30'},
    {key: 'shares', header: '소유주식수(주)'},
    {key: 'ratio', header: '지분율(%)', className: 'w-kbx-130'},
    {key: 'relation', header: '최대주주와의 관계', className: 'w-kbx-230'},
] as const

// 표 칸 글(구분 · 성명 · 주주명 · 관계 · 기업명 · 대표자 · 업종) — 한 줄, 넘치면 말줄임. 값이 비면 '-'.
// 행 높이가 늘 한 줄이어야 행 수 어림(k-bigx-print-report.ts 의 COMPANY_FIRST_PAGE.tableRow 43.5)이 맞는다.
const OneLine = ({text}: {text: string}) => <div className="truncate">{text || KBX_EMPTY_VALUE}</div>

const AFFILIATE_COLUMNS = [
    {key: 'name', header: '기업명', isRowHeader: true, className: 'w-60'},
    {key: 'ceo', header: '대표자', className: 'w-30'},
    {key: 'industry', header: '업종'},
    {key: 'year', header: '결산년도', className: 'w-30'},
    {key: 'assets', header: '총자산', className: 'w-kbx-150'},
    {key: 'sales', header: '매출액', className: 'w-kbx-130'},
] as const

// 인증 카드 — 높이 80(h-20). 테두리 색은 인증 여부에 따라 사용처에서 붙인다.
const CERT_BOX_CLASS = 'kbx-border-regular flex h-20 items-center justify-between px-6'

// 관계기업 현황 · 특허 및 인증현황 — 기업현황 첫 쪽(company-1) 아래 두 블록.
const CompanyAffiliateBlocks = ({
    status,
    affiliateRows,
}: {
    status: InnovationGrowthReport['companyStatus']
    affiliateRows: KbigxCompanyFirstPageLayout['affiliateRows']
}) => (
    <>
        <KbxBlock title="관계기업 현황" unit="단위: 백만원" unitPosition="below">
            <KbxTable
                caption="관계기업 현황"
                density="dense"
                columns={AFFILIATE_COLUMNS}
                rows={padRows(
                    status.affiliates,
                    (affiliate) => [
                        <OneLine key="name" text={affiliate.name} />,
                        <OneLine key="ceo" text={affiliate.ceo} />,
                        <OneLine key="industry" text={affiliate.industry} />,
                        affiliate.fiscalYear || KBX_EMPTY_VALUE,
                        formatKbxNumber(affiliate.totalAssets),
                        formatKbxNumber(affiliate.sales),
                    ],
                    AFFILIATE_COLUMNS.length,
                    affiliateRows,
                )}
            />
        </KbxBlock>
        <KbxBlock title="특허 및 인증현황">
            {/* 건수 카드 · 인증 카드 각 4칸. 카드 높이(80)는 첫 쪽 높이 어림(COMPANY_FIRST_PAGE.baseBottom)에 포함돼 있다. */}
            <div className="flex flex-col gap-4">
                <div className="gap-kbx-14 grid grid-cols-4">
                    {status.intellectualProperty.map((item) => (
                        <KbxStatCard
                            key={item.id}
                            size="xl"
                            label={item.label}
                            value={formatKbxNumber(item.count)}
                            unit={COUNT_UNIT}
                        />
                    ))}
                </div>
                {/* 인증은 남색 실선 · 미인증은 옅은 점선 — 색과 함께 글자(인증 · 미인증)와 아이콘으로도 구분한다[5.3.1]. */}
                <ul className="gap-kbx-14 grid grid-cols-4">
                    {status.certifications.map((item) => (
                        <li
                            key={item.id}
                            className={cn(
                                CERT_BOX_CLASS,
                                item.isCertified ? 'border-kbx-primary' : 'border-kbx-border-muted border-dashed',
                            )}
                        >
                            <span
                                className={cn(
                                    'kbx-text-26 font-kbx-bold',
                                    !item.isCertified && 'text-kbx-foreground-subtle',
                                )}
                            >
                                {item.label}
                            </span>
                            {item.isCertified ? (
                                <span className="text-kbx-primary kbx-text-34 font-kbx-extrabold flex items-center gap-2 whitespace-nowrap">
                                    <Check aria-hidden="true" strokeWidth={3} className="size-7.5" />
                                    {CERTIFIED_LABEL}
                                </span>
                            ) : (
                                <span className="text-kbx-foreground-subtle kbx-text-34 font-kbx-bold flex items-center gap-2 whitespace-nowrap">
                                    <Minus aria-hidden="true" strokeWidth={3} className="size-6.5" />
                                    {NOT_CERTIFIED_LABEL}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </KbxBlock>
    </>
)

// ── 기업현황 1(company-1) — 개요 · 경영진 및 주주현황 · 관계기업 현황 · 특허 및 인증현황 ──
// 네 블록이 늘 한 쪽에 들어가도록 이 쪽만 블록 사이가 40(다른 쪽은 80)이다. 표 행 수는 개요 길이에 따라
// getKbigxCompanyFirstPageLayout 이 늘리거나 줄인다(표마다 1~10행).
const KbigxPrintCompanyOverview = ({report}: {report: InnovationGrowthReport}) => {
    const status = report.companyStatus
    const layout = getKbigxCompanyFirstPageLayout(report)

    return (
        <div className="flex flex-col gap-10">
            <KbxBlock title="개요">
                {/* 이름 12개는 COMPANY_OVERVIEW_LABELS 고정, overview 에서 같은 label 로 찾는다(없거나 비면 '-').
                    COMPANY_OVERVIEW_FIT_LABELS(기업명 · 대표자 · 주소 · 대표기술분야 · 주요제품)는 2줄을 넘으면 글자를
                    줄이고 그래도 넘치면 2줄 말줄임, 나머지는 한 줄 말줄임. 이 규칙은 쪽 높이 어림과 맞물려 있다. */}
                <KbxLabelValueGrid
                    fitLabels={COMPANY_OVERVIEW_FIT_LABELS}
                    items={COMPANY_OVERVIEW_LABELS.map((label) => ({
                        label,
                        value: status.overview.find((item) => item.label === label)?.value ?? '',
                    }))}
                />
            </KbxBlock>
            <KbxBlock title="경영진 및 주주현황">
                {/* 경영진 · 주주 두 표를 2 : 3 폭으로 나란히 — 두 표는 늘 같은 행 수라 아랫선이 맞는다. */}
                <div className="flex gap-x-14">
                    <KbxSubBlock title="경영진 현황" className="grow-2 basis-0">
                        <KbxTable
                            caption="경영진 현황"
                            density="dense"
                            className="flex-1"
                            columns={EXECUTIVE_COLUMNS}
                            rows={padRows(
                                status.executives,
                                (executive) => [
                                    <OneLine key="role" text={executive.role} />,
                                    <OneLine key="name" text={executive.name} />,
                                    executive.birthDate || KBX_EMPTY_VALUE,
                                ],
                                EXECUTIVE_COLUMNS.length,
                                layout.tableRows,
                            )}
                        />
                    </KbxSubBlock>
                    <KbxSubBlock title="주주 현황" className="grow-3 basis-0">
                        <KbxTable
                            caption="주주 현황"
                            density="dense"
                            className="flex-1"
                            columns={SHAREHOLDER_COLUMNS}
                            rows={padRows(
                                status.shareholders,
                                (shareholder) => [
                                    <OneLine key="name" text={shareholder.name} />,
                                    formatKbxNumber(shareholder.shares),
                                    formatKbxNumber(shareholder.ratio, kbxFixed2Format),
                                    <OneLine key="relation" text={shareholder.relation} />,
                                ],
                                SHAREHOLDER_COLUMNS.length,
                                layout.tableRows,
                            )}
                        />
                    </KbxSubBlock>
                </div>
            </KbxBlock>
            <CompanyAffiliateBlocks status={status} affiliateRows={layout.affiliateRows} />
        </div>
    )
}

// ── 기업현황 2(company-2) — 재무현황(재무상태 · 손익 · 주요재무비율 · 현금흐름) ──
// 2 × 2 칸. 칸 안은 소제목 → 표 → 그래프(겹친 막대는 범례가 위, 꺾은선은 범례가 아래).

// 재무 표의 구분 — 행 이름 · 순서 고정. 값은 finance.<표>[].key 로 찾고, 없는 구분 · 연도 칸은 '-'(0 은 0).
// [프론트엔드 연동] API 행 key 를 이 key 와 맞춘다. 그래프는 이 목록이 아니라 받은 행 순서 · label 을 그대로 쓴다.
const FINANCE_ROW_LABELS = {
    balance: [
        {key: 'total-assets', label: '총자산'},
        {key: 'liabilities', label: '부채총계'},
        {key: 'equity', label: '자본총계'},
    ],
    income: [
        {key: 'sales', label: '매출액'},
        {key: 'operating-profit', label: '영업이익'},
        {key: 'net-income', label: '당기순이익'},
    ],
    ratios: [
        {key: 'operating-margin', label: '영업이익률'},
        {key: 'debt-ratio', label: '부채비율'},
        {key: 'receivables-turnover', label: '매출채권회전율'},
        {key: 'sales-growth', label: '매출액증가율'},
        {key: 'asset-growth', label: '총자산증가율'},
    ],
    cashFlows: [
        {key: 'operating', label: '영업활동후 현금흐름'},
        {key: 'financing', label: '재무활동후 현금흐름'},
        {key: 'investing', label: '투자활동후 현금흐름'},
        {key: 'net-change', label: '순현금변화'},
        {key: 'cash-vs-income', label: '영업활동 현금흐름과 순이익 차이'},
    ],
} as const
type FinanceRowLabels = (typeof FINANCE_ROW_LABELS)[keyof typeof FINANCE_ROW_LABELS]

// 재무 표 props(구분 + 연도 열). values[i] 가 years[i] 의 값. 구분 열 폭은 행 이름 길이에 맞춰 사용처가 정한다.
const financeTableProps = (
    years: readonly string[],
    labels: FinanceRowLabels,
    rows: readonly InnovationFinanceRow[],
    format: (value: number) => string,
    labelClassName: string,
) => ({
    density: 'snug' as const,
    columns: [
        {key: 'label', header: '구분', isRowHeader: true, className: labelClassName},
        ...years.map((year) => ({key: year, header: year})),
    ],
    rows: labels.map((item) => {
        const values = rows.find((row) => row.key === item.key)?.values
        return {
            key: item.key,
            cells: [
                item.label,
                ...years.map((_, index) => {
                    const value = values?.[index]
                    return isKbxNumber(value) ? format(value) : KBX_EMPTY_VALUE
                }),
            ],
        }
    }),
})

// 재무 행 → 그래프 데이터(연도마다 {행 key: 값}). 값이 없으면 NaN — 그 막대 · 점을 그리지 않는다(0 은 그린다).
const financeChartData = (years: readonly string[], rows: readonly InnovationFinanceRow[]) =>
    years.map((year, index) => ({
        id: year,
        label: year,
        values: Object.fromEntries(rows.map((row) => [row.key, row.values[index] ?? Number.NaN])),
    }))

// 그릴 값이 하나도 없으면 그래프 대신 빈 상태(KbxChartBox)를 둔다.
const hasFinanceValues = (rows: readonly InnovationFinanceRow[]) => rows.some((row) => row.values.some(isKbxNumber))

// 겹친 막대(재무상태 · 손익) — 첫 행이 기준 막대(회색), 나머지 행이 그 안의 구성 막대(밝은 파랑 · 남색 순).
// value 는 그래프 색, swatch 는 범례 색 칸 클래스 — 같은 색이라 함께 고친다.
const NESTED_BASE_COLOR = {value: 'var(--kbx-color-chart-neutral)', swatch: 'bg-kbx-chart-neutral'}
const NESTED_SERIES_COLORS = [
    {value: 'var(--kbx-color-blue-light)', swatch: 'bg-kbx-blue-light'},
    {value: 'var(--kbx-color-navy)', swatch: 'bg-kbx-navy'},
] as const
const NESTED_CHART_COLORS = {
    baseline: 'var(--kbx-color-foreground-subtle)',
    divider: 'var(--kbx-color-border)',
    value: 'var(--kbx-color-label)',
    category: 'var(--kbx-color-foreground)',
}
// 꺾은선(주요재무비율 · 현금흐름) — 계열 색은 행 순서대로(선 · 점 모양은 marker-line-chart 의 MARKER_LINE_STYLES).
const MARKER_SERIES_COLORS = [
    'var(--kbx-color-navy)',
    'var(--kbx-color-blue)',
    'var(--kbx-color-purple)',
    'var(--kbx-color-mint)',
    'var(--kbx-color-orange)',
] as const
const MARKER_CHART_COLORS = {
    baseline: 'var(--kbx-color-foreground-subtle)',
    divider: 'var(--kbx-color-border)',
    category: 'var(--kbx-color-foreground)',
    dotFill: 'var(--kbx-color-paper)',
}

// 겹친 막대 칸 — 표 → 범례 → 그래프. rows 의 첫 행이 기준 막대(재무상태 = 총자산 · 손익 = 매출액)여야 한다.
const NestedFinance = ({
    title,
    years,
    labels,
    rows,
    ariaLabel,
}: {
    title: string
    years: readonly string[]
    labels: FinanceRowLabels
    rows: readonly InnovationFinanceRow[]
    ariaLabel: string
}) => {
    const [base, ...series] = rows
    return (
        <KbxSubBlock title={title}>
            <KbxUnitBelow unit="단위: 백만원">
                <KbxTable caption={title} {...financeTableProps(years, labels, rows, formatKbxNumber, 'w-1/4')} />
            </KbxUnitBelow>
            {base ? (
                <>
                    <KbxLegend
                        density="compact"
                        items={[
                            {label: base.label, swatchClassName: NESTED_BASE_COLOR.swatch},
                            ...series.map((row, index) => ({
                                label: row.label,
                                swatchClassName: NESTED_SERIES_COLORS[index % NESTED_SERIES_COLORS.length].swatch,
                            })),
                        ]}
                    />
                    <KbxChartBox isEmpty={!hasFinanceValues(rows)} emptyClassName="h-88">
                        <NestedColumnChart
                            ariaLabel={ariaLabel}
                            data={financeChartData(years, rows)}
                            base={{key: base.key, label: base.label, color: NESTED_BASE_COLOR.value}}
                            series={series.map((row, index) => ({
                                key: row.key,
                                label: row.label,
                                color: NESTED_SERIES_COLORS[index % NESTED_SERIES_COLORS.length].value,
                            }))}
                            colors={NESTED_CHART_COLORS}
                        />
                    </KbxChartBox>
                </>
            ) : null}
        </KbxSubBlock>
    )
}

// 꺾은선 칸 — 표 → 그래프 → 범례.
const MarkerFinance = ({
    title,
    unit,
    years,
    labels,
    rows,
    format,
    labelClassName,
    ariaLabel,
}: {
    title: string
    unit: string
    years: readonly string[]
    labels: FinanceRowLabels
    rows: readonly InnovationFinanceRow[]
    format: (value: number) => string
    labelClassName: string
    ariaLabel: string
}) => {
    const series = rows.map((row, index) => ({
        key: row.key,
        label: row.label,
        color: MARKER_SERIES_COLORS[index % MARKER_SERIES_COLORS.length],
    }))

    return (
        <KbxSubBlock title={title}>
            <KbxUnitBelow unit={unit}>
                <KbxTable caption={title} {...financeTableProps(years, labels, rows, format, labelClassName)} />
            </KbxUnitBelow>
            <KbxChartBox isEmpty={!hasFinanceValues(rows)} emptyClassName="h-75">
                <MarkerLineChart
                    ariaLabel={ariaLabel}
                    data={financeChartData(years, rows)}
                    series={series}
                    colors={MARKER_CHART_COLORS}
                    formatValue={format}
                />
            </KbxChartBox>
            <MarkerLineLegend
                series={series}
                dotFill={MARKER_CHART_COLORS.dotFill}
                className="kbx-text-16 text-kbx-foreground-subtle"
            />
        </KbxSubBlock>
    )
}

const KbigxPrintCompanyFinance = ({report}: {report: InnovationGrowthReport}) => {
    const {finance} = report.companyStatus

    return (
        <KbxBlock title="재무현황">
            <div className="grid grid-cols-2 items-start gap-x-14 gap-y-10">
                <NestedFinance
                    title="재무상태"
                    years={finance.years}
                    labels={FINANCE_ROW_LABELS.balance}
                    rows={finance.balance}
                    ariaLabel="연도별 재무상태 — 총자산 안의 부채총계 · 자본총계"
                />
                <NestedFinance
                    title="손익현황"
                    years={finance.years}
                    labels={FINANCE_ROW_LABELS.income}
                    rows={finance.income}
                    ariaLabel="연도별 손익현황 — 매출액 안의 영업이익 · 당기순이익"
                />
                <MarkerFinance
                    title="주요재무비율"
                    unit="단위: %"
                    years={finance.years}
                    labels={FINANCE_ROW_LABELS.ratios}
                    rows={finance.ratios}
                    format={(value) => kbxFixed2Format.format(value)}
                    labelClassName="w-2/5"
                    ariaLabel="연도별 주요재무비율 추이"
                />
                <MarkerFinance
                    title="현금흐름"
                    unit="단위: 백만원"
                    years={finance.years}
                    labels={FINANCE_ROW_LABELS.cashFlows}
                    rows={finance.cashFlows}
                    format={(value) => kbxNumberFormat.format(value)}
                    labelClassName="w-1/2"
                    ariaLabel="연도별 현금흐름 추이"
                />
            </div>
        </KbxBlock>
    )
}

// ── 기업현황 3(company-3) — 거래처현황(매출처 · 매입처) ──
// 늘 한 쪽 — 매출처 · 매입처가 본문을 반씩 나눈다(사이 40, 바닥글 선과 40). 표마다 10행(최대 10건, 모자라면 '-' 줄).
// 기업명은 한 줄 말줄임이라 행 높이(49)가 늘 같아 10행 × 2 가 한 쪽에 들어간다.
// [주의] 행 여백(KbxTable density="list") · 머리 · 소제목을 키우면 넘칠 수 있다 — 넘침 표시(빨간 점선)로 확인한다.

const tradeTableProps = (
    years: readonly string[],
    partners: readonly InnovationTradePartner[],
    shareGroupLabel: string,
    rowCount: number,
) => {
    const columns = [
        {key: 'name', header: '기업명', isRowHeader: true, className: 'w-kbx-250'},
        ...years.map((year) => ({key: `share-${year}`, header: year, group: shareGroupLabel})),
        {key: 'grade', header: '신용등급', className: 'w-40'},
        {key: 'evaluationDate', header: '평가일자', className: 'w-kbx-190'},
    ]
    return {
        columns,
        rows: padRows(
            partners,
            (partner) => [
                // 기업명은 한 줄 말줄임(행 높이 고정 → 10행씩 한 쪽). 비면 '-'.
                <div key="name" className="truncate">
                    {partner.name.trim() ? keepCorporatePrefix(partner.name) : KBX_EMPTY_VALUE}
                </div>,
                // 비중이 없으면 '-', 0 은 0.00.
                ...years.map((_, yearIndex) => {
                    const share = partner.shares[yearIndex]
                    return formatKbxNumber(share, kbxFixed2Format)
                }),
                partner.grade || KBX_EMPTY_VALUE,
                partner.evaluationDate || KBX_EMPTY_VALUE,
            ],
            columns.length,
            rowCount,
        ),
    }
}

const KbigxPrintCompanyTrade = ({report}: {report: InnovationGrowthReport}) => {
    const {finance, customers, suppliers} = report.companyStatus

    return (
        <KbxBlock title="거래처현황" className="flex-1 pb-10">
            <div className="flex min-h-0 flex-1 flex-col gap-y-10">
                <div className="flex min-h-0 flex-1 flex-col">
                    <KbxSubBlock title="매출처" className="min-h-0 flex-1">
                        <KbxUnitBelow unit="단위: %" className="min-h-0 flex-1">
                            <KbxTable
                                caption="매출처"
                                density="list"
                                className="flex-1"
                                {...tradeTableProps(finance.years, customers, '매출비중', KBIGX_PRINT_LIST_LIMIT)}
                            />
                        </KbxUnitBelow>
                    </KbxSubBlock>
                </div>
                <div className="flex min-h-0 flex-1 flex-col">
                    <KbxSubBlock title="매입처" className="min-h-0 flex-1">
                        <KbxUnitBelow unit="단위: %" className="min-h-0 flex-1">
                            <KbxTable
                                caption="매입처"
                                density="list"
                                className="flex-1"
                                {...tradeTableProps(finance.years, suppliers, '매입비중', KBIGX_PRINT_LIST_LIMIT)}
                            />
                        </KbxUnitBelow>
                    </KbxSubBlock>
                </div>
            </div>
        </KbxBlock>
    )
}

export {KbigxPrintCompanyFinance, KbigxPrintCompanyOverview, KbigxPrintCompanyTrade}
