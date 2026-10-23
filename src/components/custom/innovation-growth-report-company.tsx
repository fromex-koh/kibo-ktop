'use client'

import {
    Award,
    BriefcaseBusiness,
    Building2,
    FileBadge,
    FilePenLine,
    Palette,
    ScrollText,
    Trophy,
    type LucideIcon,
} from 'lucide-react'
import {EmptyState} from '@/components/composite/empty-state'
import {InfoTable} from '@/components/composite/info-table'
import {
    Card,
    REPORT_LINE_STYLES,
    ReportTable,
    type ReportTableColumn,
    type ReportTableRow,
    SectionTitle,
    StatBox,
    WithUnit,
} from '@/components/custom/innovation-growth-report-parts'
import {LineChart} from '@/components/custom/line-chart'
import {OverlayColumnChart} from '@/components/custom/overlay-column-chart'
import type {
    InnovationCertificationId,
    InnovationCompanyStatus,
    InnovationFinanceRow,
    InnovationIpId,
    InnovationTradePartner,
} from '@/content/service/k-bigx-innovation-report'

// K-BIGx 기업혁신성장 보고서 · 기업현황 탭 본문 — 개요 → 경영진 및 주주현황 → 관계기업 현황 → 특허 및 인증현황 → 재무현황 → 거래처현황.
// 보고서 머리 · 탭 줄 · 탭 제목 줄은 innovation-growth-report-document.tsx 가 그린다.
// 반응형 없음 — PC 화면만 그린다(문서 최소 폭 1200, 그보다 좁은 창에서만 가로 스크롤).
//
// [프론트엔드 연동] 모든 값은 status(report.companyStatus) 하나로 받는다 — 형태는 content/service/k-bigx-innovation-report.ts 의
// InnovationCompanyStatus. 재무 행의 values 는 finance.years 와 같은 순서 · 길이여야 표와 그래프가 맞는다.

const numberFormatter = new Intl.NumberFormat('ko-KR')
// 비율 · 비중은 소수 둘째 자리까지 늘 보인다(10 → 10.00).
const ratioFormatter = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
// 값이 없는 칸의 표시 — 신용등급이 없는 거래처 · 경영진 · 주주 표의 빈 줄.
const EMPTY_VALUE = '-'
// 금액 칸 — 값이 없으면(숫자 아님) '-', 0 은 0.
const formatAmount = (value: number) => (Number.isFinite(value) ? numberFormatter.format(value) : EMPTY_VALUE)
// [프론트엔드 연동] 관계기업 현황 표의 최대 줄 수(기획: 최대 10개 노출).
// 받은 순서대로 앞에서부터 10건만 그리고 11번째부터는 그리지 않는다 — API 는 목록을 자르지 않고 그대로 보낸다.
const COMPANY_LIST_LIMIT = 10
// [프론트엔드 연동] 경영진 현황 · 주주 현황 표의 줄 수 — 늘 5줄. 앞에서부터 5건만 그리고(6번째부터 안 보임),
// 5건보다 적으면 남는 줄을 '-' 로 채운다(두 표 높이가 같다). 한 건도 없으면 '-' 줄 대신 5줄 높이의 빈 상태(EmptyState).
// API 는 목록을 자르지 않고 그대로 보낸다.
const COMPANY_TABLE_ROWS = 5

// 표 줄 맞추기 — 앞에서부터 COMPANY_TABLE_ROWS 줄, 모자라면 빈 줄(blankCells — 칸마다 '-')로 채운다.
const toFixedRows = <T, C extends Record<string, string>>(
    items: readonly T[],
    blankCells: C,
    toRow: (item: T, index: number) => {id: string; cells: C},
) => {
    const rows = items.slice(0, COMPANY_TABLE_ROWS).map(toRow)
    const blanks = Array.from({length: COMPANY_TABLE_ROWS - rows.length}, (_, index) => ({
        id: `empty-${index}`,
        cells: blankCells,
    }))
    return [...rows, ...blanks]
}

// 경영진 · 주주 표 — 줄이 있으면 5줄 표, 없으면 머리글 아래에 5줄 높이(min-h-56 = 224, 한 줄 약 45)의 빈 상태.
const FixedRowsTable = ({
    caption,
    columns,
    rows,
    isEmpty,
    minWidthClassName,
}: {
    caption: string
    columns: ReportTableColumn[]
    rows: ReportTableRow[]
    isEmpty: boolean
    minWidthClassName?: string
}) =>
    isEmpty ? (
        <div className="flex flex-col">
            <ReportTable caption={caption} columns={columns} rows={[]} minWidthClassName={minWidthClassName} />
            <EmptyState className="border-subtle-3 min-h-56 border-b" />
        </div>
    ) : (
        <ReportTable caption={caption} columns={columns} rows={rows} minWidthClassName={minWidthClassName} />
    )

// 특허 · 인증 상자의 아이콘 — 데이터의 id 로 고른다.
const IP_ICONS: Record<InnovationIpId, LucideIcon> = {
    patent: Award,
    'utility-model': ScrollText,
    design: Palette,
    trademark: FilePenLine,
}
// 특허 및 인증현황 칸 — 4칸씩 고정(인쇄본 kbigx-print-company.tsx 와 같은 순서 · 이름).
const IP_ITEMS: readonly {id: InnovationIpId; label: string}[] = [
    {id: 'patent', label: '특허'},
    {id: 'utility-model', label: '실용신안'},
    {id: 'design', label: '디자인'},
    {id: 'trademark', label: '상표권'},
]
const CERTIFICATION_ITEMS: readonly {id: InnovationCertificationId; label: string}[] = [
    {id: 'venture', label: '벤처'},
    {id: 'innobiz', label: '이노비즈'},
    {id: 'mainbiz', label: '메인비즈'},
    {id: 'research-lab', label: '연구소'},
]
const CERTIFICATION_ICONS: Record<InnovationCertificationId, LucideIcon> = {
    venture: BriefcaseBusiness,
    innobiz: FileBadge,
    mainbiz: Trophy,
    'research-lab': Building2,
}
const CERTIFIED_LABEL = '인증'
const NOT_CERTIFIED_LABEL = '미인증'
const COUNT_UNIT = '건'

// 재무 그래프(겹친 막대) 색 — 기준 막대(첫 행: 총자산 · 매출액)는 구조색 muted, 앞 막대(나머지 행, 순서대로)는
// --ds-blue-400 · report-series-1. 모두 --ds-* 라 다크에서 함께 바뀐다.
const OVERLAY_BASE_COLOR = 'var(--ds-muted)'
const OVERLAY_SERIES_COLORS = ['var(--ds-blue-400)', 'var(--ds-report-series-1)'] as const

// 재무 행 → 표(구분 + 연도 열).
const financeTable = (
    years: readonly string[],
    rows: readonly InnovationFinanceRow[],
    format: (value: number) => string,
    /** 구분 열 폭 — 행 이름이 긴 표(현금흐름)에서 넓힌다. */
    labelWidthClassName?: string,
) => ({
    columns: [
        {key: 'label', label: '구분', widthClassName: labelWidthClassName},
        ...years.map((year) => ({key: year, label: year})),
    ],
    rows: rows.map((row) => ({
        id: row.key,
        cells: Object.fromEntries([
            ['label', row.label],
            // 값이 없으면(숫자 아님 · 칸 없음) '-', 0 은 0.
            ...years.map((year, index) => {
                const value = row.values[index]
                return [year, typeof value === 'number' && Number.isFinite(value) ? format(value) : EMPTY_VALUE]
            }),
        ]),
    })),
})

// 재무 행 → 그래프 항목(연도마다 행 key 별 값).
const financeChartData = (years: readonly string[], rows: readonly InnovationFinanceRow[]) =>
    years.map((year, index) => ({
        id: year,
        label: year,
        // 값이 없으면 NaN — 그래프가 막대 · 점 자리에 '-' 를 적는다(0 은 0).
        values: Object.fromEntries(rows.map((row) => [row.key, row.values[index] ?? Number.NaN])),
    }))

// 거래처 표 — 기업명 · 연도별 비중(두 단 머리) · 신용등급(CRI 코드, 없으면 '-') · 평가일자.
const tradeTable = (
    years: readonly string[],
    partners: readonly InnovationTradePartner[],
    shareGroupLabel: string,
) => ({
    columns: [
        {key: 'name', label: '기업명'},
        ...years.map((year) => ({key: `share-${year}`, label: year, group: shareGroupLabel})),
        {key: 'grade', label: '신용등급'},
        {key: 'evaluationDate', label: '평가일자'},
    ],
    rows: partners.map((partner, rowIndex) => ({
        id: `${partner.name}-${rowIndex}`,
        cells: {
            name: partner.name || EMPTY_VALUE,
            ...Object.fromEntries(
                years.map((year, index) => {
                    const share = partner.shares[index]
                    return [
                        `share-${year}`,
                        typeof share === 'number' && Number.isFinite(share)
                            ? ratioFormatter.format(share)
                            : EMPTY_VALUE,
                    ]
                }),
            ),
            // 등급 칸 높이를 고정해 등급이 없는('-') 줄도 다른 줄과 높이가 같다.
            grade: (
                <span className="typo-body-m-bold text-navy-600 inline-flex h-7 items-center">
                    {partner.grade || EMPTY_VALUE}
                </span>
            ),
            evaluationDate: partner.evaluationDate || EMPTY_VALUE,
        },
    })),
})

type InnovationGrowthReportCompanyProps = {
    status: InnovationCompanyStatus
}

const InnovationGrowthReportCompany = ({status}: InnovationGrowthReportCompanyProps) => {
    const {finance} = status
    const [balanceBase, ...balanceSeries] = finance.balance
    const [incomeBase, ...incomeSeries] = finance.income
    const balanceTable = financeTable(finance.years, finance.balance, (value) => numberFormatter.format(value))
    const incomeTable = financeTable(finance.years, finance.income, (value) => numberFormatter.format(value))
    const ratioTable = financeTable(finance.years, finance.ratios, (value) => ratioFormatter.format(value))
    const cashFlowTable = financeTable(
        finance.years,
        finance.cashFlows,
        (value) => numberFormatter.format(value),
        'w-55',
    )
    const customerTable = tradeTable(finance.years, status.customers, '매출비중')
    const supplierTable = tradeTable(finance.years, status.suppliers, '매입비중')
    // 재무현황 — 카드마다 값이 하나도 없으면(연도 없음 · 행 없음 · 모두 숫자 아님) 표 머리글 아래 빈 상태, 그래프는 두지 않는다.
    const hasFinanceRows = (rows: readonly InnovationFinanceRow[]) =>
        finance.years.length > 0 && rows.some((row) => row.values.some((value) => Number.isFinite(value)))
    const hasFinance = {
        balance: hasFinanceRows(finance.balance),
        income: hasFinanceRows(finance.income),
        ratios: hasFinanceRows(finance.ratios),
        cashFlows: hasFinanceRows(finance.cashFlows),
    }
    // 개요 — 값이 비면(빈 글자 · 공백) '-'. 모든 값이 비면 표 대신 같은 높이의 빈 상태(진단브리핑 기업 정보와 같다).
    const overviewRows = status.overview.map((row) => ({
        key: row.label,
        label: row.label,
        value: row.value?.trim() || EMPTY_VALUE,
    }))
    const hasOverview = overviewRows.some((row) => row.value !== EMPTY_VALUE)

    return (
        <>
            {/* 개요 */}
            <section aria-labelledby="ig-company-overview" className="flex flex-col gap-4">
                <SectionTitle id="ig-company-overview" title="개요" />
                <Card>
                    {hasOverview ? (
                        <InfoTable layout="pairs" aria-label="기업 개요" items={overviewRows} />
                    ) : (
                        // 값이 하나도 없을 때 — 진단브리핑 기업 정보와 같은 방식. '-' 로 채운 표를 보이지 않게 깔아 두고(같은 칸에 겹침)
                        // 그 위에 빈 상태를 둬 표와 같은 높이를 지킨다. 줄 자체가 없어도 최소 높이(min-h-34 = 136)는 지킨다.
                        <div className="grid">
                            <div aria-hidden="true" inert className="invisible col-start-1 row-start-1">
                                <InfoTable layout="pairs" items={overviewRows} />
                            </div>
                            <EmptyState className="col-start-1 row-start-1 min-h-34" />
                        </div>
                    )}
                </Card>
            </section>

            {/* 경영진 및 주주현황 */}
            <section aria-labelledby="ig-company-management" className="flex flex-col gap-4">
                <SectionTitle id="ig-company-management" title="경영진 및 주주현황" />
                <div className="grid grid-cols-2 gap-6">
                    <Card title="경영진 현황" className="gap-4">
                        <FixedRowsTable
                            caption="경영진 현황"
                            isEmpty={!status.executives.length}
                            minWidthClassName="min-w-90"
                            columns={[
                                {key: 'role', label: '구분'},
                                {key: 'name', label: '성명'},
                                {key: 'birthDate', label: '생년월일'},
                            ]}
                            rows={toFixedRows(
                                status.executives,
                                {role: EMPTY_VALUE, name: EMPTY_VALUE, birthDate: EMPTY_VALUE},
                                (executive, index) => ({
                                    id: `${executive.role}-${index}`,
                                    cells: {role: executive.role, name: executive.name, birthDate: executive.birthDate},
                                }),
                            )}
                        />
                    </Card>
                    {/* 단위는 표 위 단위 줄 대신 머리글에 적는다 — 소유주식수(주) · 지분율(%). */}
                    <Card title="주주 현황" className="gap-4">
                        <FixedRowsTable
                            caption="주주 현황"
                            isEmpty={!status.shareholders.length}
                            columns={[
                                {key: 'name', label: '주주명'},
                                {key: 'shares', label: '소유주식수(주)'},
                                {key: 'ratio', label: '지분율(%)'},
                                {key: 'relation', label: '최대주주와의 관계'},
                            ]}
                            rows={toFixedRows(
                                status.shareholders,
                                {name: EMPTY_VALUE, shares: EMPTY_VALUE, ratio: EMPTY_VALUE, relation: EMPTY_VALUE},
                                (shareholder, index) => ({
                                    id: `${shareholder.name}-${index}`,
                                    cells: {
                                        name: shareholder.name,
                                        shares: numberFormatter.format(shareholder.shares),
                                        ratio: ratioFormatter.format(shareholder.ratio),
                                        relation: shareholder.relation,
                                    },
                                }),
                            )}
                        />
                    </Card>
                </div>
            </section>

            {/* 관계기업 현황 — 제목 없는 카드 안에 단위 줄 + 표. */}
            <section aria-labelledby="ig-company-affiliates" className="flex flex-col gap-4">
                <SectionTitle id="ig-company-affiliates" title="관계기업 현황" />
                <Card>
                    <WithUnit unit="단위: 백만원">
                        {/* 관계기업이 없으면 머리글 아래 빈 상태(경영진 · 주주 표와 같은 방식, 높이 min-h-56 = 224).
                            값이 빈 칸은 '-', 0 은 0. */}
                        <div className="flex flex-col">
                            <ReportTable
                                caption="관계기업 현황(단위: 백만원)"
                                minWidthClassName="min-w-160"
                                columns={[
                                    {key: 'name', label: '기업명'},
                                    {key: 'ceo', label: '대표자'},
                                    {key: 'industry', label: '업종'},
                                    {key: 'fiscalYear', label: '결산년도'},
                                    {key: 'totalAssets', label: '총자산'},
                                    {key: 'sales', label: '매출액'},
                                ]}
                                rows={status.affiliates.slice(0, COMPANY_LIST_LIMIT).map((affiliate, index) => ({
                                    id: `${affiliate.name}-${index}`,
                                    cells: {
                                        name: affiliate.name || EMPTY_VALUE,
                                        ceo: affiliate.ceo || EMPTY_VALUE,
                                        industry: affiliate.industry || EMPTY_VALUE,
                                        fiscalYear: affiliate.fiscalYear || EMPTY_VALUE,
                                        totalAssets: formatAmount(affiliate.totalAssets),
                                        sales: formatAmount(affiliate.sales),
                                    },
                                }))}
                            />
                            {status.affiliates.length ? null : (
                                <EmptyState className="border-subtle-3 min-h-56 border-b" />
                            )}
                        </div>
                    </WithUnit>
                </Card>
            </section>

            {/* 특허 및 인증현황 — 지식재산 건수 상자(intellectualProperty) 뒤에 인증 여부 상자(certifications)를 4열로 잇는다. */}
            <section aria-labelledby="ig-company-ip" className="flex flex-col gap-4">
                <SectionTitle id="ig-company-ip" title="특허 및 인증현황" />
                <Card>
                    <div className="grid grid-cols-4 gap-6">
                        {/* 건수 4칸 · 인증 4칸 고정(인쇄본과 같다) — 받은 목록에서 같은 id 로 찾고, 없거나 값이 없으면
                            라벨 아래 값만 '-'(건수는 단위 없이). */}
                        {IP_ITEMS.map(({id, label}) => {
                            const Icon = IP_ICONS[id]
                            const count = status.intellectualProperty.find((item) => item.id === id)?.count
                            const hasCount = typeof count === 'number' && Number.isFinite(count)
                            return (
                                <StatBox
                                    key={id}
                                    label={label}
                                    value={hasCount ? numberFormatter.format(count) : EMPTY_VALUE}
                                    unit={hasCount ? COUNT_UNIT : undefined}
                                    icon={<Icon aria-hidden="true" className="size-icon-sm shrink-0" />}
                                    className="border-subtle-3 border"
                                />
                            )
                        })}
                        {CERTIFICATION_ITEMS.map(({id, label}) => {
                            const Icon = CERTIFICATION_ICONS[id]
                            const isCertified = status.certifications.find((item) => item.id === id)?.isCertified
                            return (
                                <StatBox
                                    key={id}
                                    label={label}
                                    value={
                                        isCertified === undefined
                                            ? EMPTY_VALUE
                                            : isCertified
                                              ? CERTIFIED_LABEL
                                              : NOT_CERTIFIED_LABEL
                                    }
                                    icon={<Icon aria-hidden="true" className="size-icon-sm shrink-0" />}
                                    // 미인증은 흐린 글자로 — 글자(미인증)가 뜻을 전하므로 색에만 기대지 않는다[5.3.1].
                                    valueClassName={isCertified ? 'text-foreground' : 'text-foreground-subtle'}
                                    className="border-subtle-3 border"
                                />
                            )
                        })}
                    </div>
                </Card>
            </section>

            {/* 재무현황 — 카드마다 표(위) + 그래프(아래). 재무상태 · 손익은 겹친 막대, 비율 · 현금흐름은 여러 선.
                단위는 WithUnit 규칙, 표 → 그래프 간격 24. */}
            <section aria-labelledby="ig-company-finance" className="flex flex-col gap-4">
                <SectionTitle id="ig-company-finance" title="재무현황" />
                <div className="grid grid-cols-2 gap-6">
                    <Card title="재무상태" className="gap-0">
                        <div className="flex min-w-0 flex-col gap-6">
                            <WithUnit unit="단위: 백만원">
                                <ReportTable
                                    caption="재무상태(단위: 백만원)"
                                    minWidthClassName="min-w-90"
                                    {...balanceTable}
                                />
                                {hasFinance.balance ? null : (
                                    <EmptyState className="border-subtle-3 min-h-56 border-b" />
                                )}
                            </WithUnit>
                            {hasFinance.balance ? (
                                <>
                                    {balanceBase ? (
                                        <OverlayColumnChart
                                            ariaLabel="연도별 재무상태 — 총자산 대비 부채총계 · 자본총계"
                                            unit="백만원"
                                            data={financeChartData(finance.years, finance.balance)}
                                            base={{
                                                key: balanceBase.key,
                                                label: balanceBase.label,
                                                color: OVERLAY_BASE_COLOR,
                                            }}
                                            series={balanceSeries.map((row, index) => ({
                                                key: row.key,
                                                label: row.label,
                                                color: OVERLAY_SERIES_COLORS[index % OVERLAY_SERIES_COLORS.length],
                                            }))}
                                        />
                                    ) : null}
                                </>
                            ) : null}
                        </div>
                    </Card>
                    <Card title="손익현황" className="gap-0">
                        <div className="flex min-w-0 flex-col gap-6">
                            <WithUnit unit="단위: 백만원">
                                <ReportTable
                                    caption="손익현황(단위: 백만원)"
                                    minWidthClassName="min-w-90"
                                    {...incomeTable}
                                />
                                {hasFinance.income ? null : (
                                    <EmptyState className="border-subtle-3 min-h-56 border-b" />
                                )}
                            </WithUnit>
                            {hasFinance.income ? (
                                <>
                                    {incomeBase ? (
                                        <OverlayColumnChart
                                            ariaLabel="연도별 손익현황 — 매출액 대비 영업이익 · 당기순이익"
                                            unit="백만원"
                                            data={financeChartData(finance.years, finance.income)}
                                            base={{
                                                key: incomeBase.key,
                                                label: incomeBase.label,
                                                color: OVERLAY_BASE_COLOR,
                                            }}
                                            series={incomeSeries.map((row, index) => ({
                                                key: row.key,
                                                label: row.label,
                                                color: OVERLAY_SERIES_COLORS[index % OVERLAY_SERIES_COLORS.length],
                                            }))}
                                        />
                                    ) : null}
                                </>
                            ) : null}
                        </div>
                    </Card>
                    <Card title="주요재무비율" className="gap-0">
                        <div className="flex min-w-0 flex-col gap-6">
                            <WithUnit unit="단위: %">
                                <ReportTable
                                    caption="주요재무비율(단위: %)"
                                    minWidthClassName="min-w-90"
                                    {...ratioTable}
                                />
                                {hasFinance.ratios ? null : (
                                    <EmptyState className="border-subtle-3 min-h-56 border-b" />
                                )}
                            </WithUnit>
                            {hasFinance.ratios ? (
                                <>
                                    <LineChart
                                        appearance="columns"
                                        showTooltip={false}
                                        ariaLabel="연도별 주요재무비율"
                                        unit="%"
                                        valueFractionDigits={2}
                                        data={financeChartData(finance.years, finance.ratios)}
                                        series={finance.ratios.map((row, index) => ({
                                            key: row.key,
                                            label: row.label,
                                            ...REPORT_LINE_STYLES[index % REPORT_LINE_STYLES.length],
                                        }))}
                                    />
                                </>
                            ) : null}
                        </div>
                    </Card>
                    <Card title="현금흐름" className="gap-0">
                        <div className="flex min-w-0 flex-col gap-6">
                            <WithUnit unit="단위: 백만원">
                                <ReportTable
                                    caption="현금흐름(단위: 백만원)"
                                    minWidthClassName="min-w-100"
                                    {...cashFlowTable}
                                />
                                {hasFinance.cashFlows ? null : (
                                    <EmptyState className="border-subtle-3 min-h-56 border-b" />
                                )}
                            </WithUnit>
                            {hasFinance.cashFlows ? (
                                <>
                                    <LineChart
                                        appearance="columns"
                                        showTooltip={false}
                                        ariaLabel="연도별 현금흐름"
                                        unit="백만원"
                                        data={financeChartData(finance.years, finance.cashFlows)}
                                        series={finance.cashFlows.map((row, index) => ({
                                            key: row.key,
                                            label: row.label,
                                            ...REPORT_LINE_STYLES[index % REPORT_LINE_STYLES.length],
                                        }))}
                                    />
                                </>
                            ) : null}
                        </div>
                    </Card>
                </div>
            </section>

            {/* 거래처현황 — 매출처 · 매입처 카드. 비중 열은 finance.years 를 쓴다(shares 도 같은 순서). */}
            <section aria-labelledby="ig-company-trade" className="flex flex-col gap-4">
                <SectionTitle id="ig-company-trade" title="거래처현황" />
                <div className="flex flex-col gap-6">
                    <Card title="매출처" className="gap-0">
                        <WithUnit unit="단위: %">
                            <ReportTable caption="매출처(단위: %)" minWidthClassName="min-w-160" {...customerTable} />
                            {status.customers.length ? null : (
                                <EmptyState className="border-subtle-3 min-h-56 border-b" />
                            )}
                        </WithUnit>
                    </Card>
                    <Card title="매입처" className="gap-0">
                        <WithUnit unit="단위: %">
                            <ReportTable caption="매입처(단위: %)" minWidthClassName="min-w-160" {...supplierTable} />
                            {status.suppliers.length ? null : (
                                <EmptyState className="border-subtle-3 min-h-56 border-b" />
                            )}
                        </WithUnit>
                    </Card>
                </div>
            </section>
        </>
    )
}

export {InnovationGrowthReportCompany}
export type {InnovationGrowthReportCompanyProps}
