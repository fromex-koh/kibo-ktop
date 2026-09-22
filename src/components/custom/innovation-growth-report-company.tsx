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
import {InfoTable} from '@/components/composite/info-table'
import {
    Card,
    GradeBadge,
    ReportTable,
    SectionTitle,
    StatBox,
    SubBlock,
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
// 보고서 머리 · 탭 줄 · 탭 제목 줄은 innovation-growth-report-document.tsx 가 그리고, 이 컴포넌트는 탭 본문만 그린다.
//
// 반응형 없음 — 이 탭은 PC 폭(1280)만 그린다. 창이 그보다 좁으면 문서(main)가 폭을 지키고 가로 스크롤이 생긴다(document 의 min-w-320).
//
// [프론트엔드 연동] 모든 값은 status(report.companyStatus) 하나로 받는다 — 형태는 content/service/k-bigx-innovation-report.ts 의
// InnovationCompanyStatus. 재무 행의 values 는 finance.years 와 같은 순서 · 길이여야 표와 그래프가 맞는다.

const numberFormatter = new Intl.NumberFormat('ko-KR')
// 비율 · 비중은 소수 둘째 자리까지 늘 보인다(10 → 10.00).
const ratioFormatter = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
// 신용등급이 없는 거래처의 표시.
const EMPTY_VALUE = '-'

// 특허 · 인증 상자의 선 아이콘(16) — 데이터의 id 로 고른다.
const IP_ICONS: Record<InnovationIpId, LucideIcon> = {
    patent: Award,
    'utility-model': ScrollText,
    design: Palette,
    trademark: FilePenLine,
}
const CERTIFICATION_ICONS: Record<InnovationCertificationId, LucideIcon> = {
    venture: BriefcaseBusiness,
    innobiz: FileBadge,
    mainbiz: Trophy,
    'research-lab': Building2,
}
const CERTIFIED_LABEL = '인증'
const NOT_CERTIFIED_LABEL = '미인증'
const COUNT_UNIT = '건'

// 재무 그래프 색 — 겹친 막대: 기준(총자산 · 매출액) gray.100, 앞 막대 blue.500 · purple.500.
// 선 그래프: 행 순서대로 navy.500 · blue.500 · purple.500 · mint.700 · orange.500.
const OVERLAY_BASE_COLOR = 'var(--raw-gray-100)'
const OVERLAY_SERIES_COLORS = ['var(--raw-blue-500)', 'var(--raw-purple-500)'] as const
const LINE_COLORS = [
    'var(--raw-navy-500)',
    'var(--raw-blue-500)',
    'var(--raw-purple-500)',
    'var(--raw-mint-700)',
    'var(--raw-orange-500)',
] as const

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
            ...years.map((year, index) => [year, format(row.values[index] ?? 0)]),
        ]),
    })),
})

// 재무 행 → 그래프 항목(연도마다 행 key 별 값).
const financeChartData = (years: readonly string[], rows: readonly InnovationFinanceRow[]) =>
    years.map((year, index) => ({
        id: year,
        label: year,
        values: Object.fromEntries(rows.map((row) => [row.key, row.values[index] ?? 0])),
    }))

// 거래처 표 — 기업명 · 연도별 비중(두 단 머리) · 신용등급 뱃지 · 기준일.
const tradeTable = (
    years: readonly string[],
    partners: readonly InnovationTradePartner[],
    shareGroupLabel: string,
) => ({
    columns: [
        {key: 'name', label: '기업명'},
        ...years.map((year) => ({key: `share-${year}`, label: year, group: shareGroupLabel})),
        {key: 'grade', label: '신용등급'},
        {key: 'baseYear', label: '기준일'},
    ],
    rows: partners.map((partner, rowIndex) => ({
        id: `${partner.name}-${rowIndex}`,
        cells: {
            name: partner.name,
            ...Object.fromEntries(
                years.map((year, index) => [`share-${year}`, ratioFormatter.format(partner.shares[index] ?? 0)]),
            ),
            // 등급이 없는 줄도 뱃지(28) 높이를 지켜 줄 높이(52)가 다른 줄과 같다.
            grade: partner.grade ? (
                <GradeBadge grade={partner.grade} />
            ) : (
                <span className="inline-flex h-7 items-center">{EMPTY_VALUE}</span>
            ),
            baseYear: partner.baseYear,
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

    return (
        <>
            {/* 개요 */}
            <section aria-labelledby="ig-company-overview" className="flex flex-col gap-4">
                <SectionTitle id="ig-company-overview" title="개요" />
                <InfoTable
                    layout="pairs"
                    aria-label="기업 개요"
                    items={status.overview.map((row) => ({key: row.label, ...row}))}
                />
            </section>

            {/* 경영진 및 주주현황 */}
            <section aria-labelledby="ig-company-management" className="flex flex-col gap-4">
                <SectionTitle id="ig-company-management" title="경영진 및 주주현황" />
                <div className="grid grid-cols-2 gap-6">
                    <SubBlock title="경영진 현황">
                        <ReportTable
                            caption="경영진 현황"
                            minWidthClassName="min-w-90"
                            columns={[
                                {key: 'role', label: '구분'},
                                {key: 'name', label: '성명'},
                                {key: 'birthDate', label: '생년월일'},
                            ]}
                            rows={status.executives.map((executive, index) => ({
                                id: `${executive.role}-${index}`,
                                cells: {role: executive.role, name: executive.name, birthDate: executive.birthDate},
                            }))}
                        />
                    </SubBlock>
                    <SubBlock title="주주 현황" aside="단위 : 주, %">
                        <ReportTable
                            caption="주주 현황(단위: 주, %)"
                            columns={[
                                {key: 'name', label: '주주명'},
                                {key: 'shares', label: '소유주식수'},
                                {key: 'ratio', label: '지분율'},
                                {key: 'relation', label: '최대주주와의 관계'},
                            ]}
                            rows={status.shareholders.map((shareholder, index) => ({
                                id: `${shareholder.name}-${index}`,
                                cells: {
                                    name: shareholder.name,
                                    shares: numberFormatter.format(shareholder.shares),
                                    ratio: ratioFormatter.format(shareholder.ratio),
                                    relation: shareholder.relation,
                                },
                            }))}
                        />
                    </SubBlock>
                </div>
            </section>

            {/* 관계기업 현황 */}
            <section aria-labelledby="ig-company-affiliates" className="flex flex-col gap-4">
                <SectionTitle id="ig-company-affiliates" title="관계기업 현황" date="단위 : 백만원" />
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
                    rows={status.affiliates.map((affiliate, index) => ({
                        id: `${affiliate.name}-${index}`,
                        cells: {
                            name: affiliate.name,
                            ceo: affiliate.ceo,
                            industry: affiliate.industry,
                            fiscalYear: affiliate.fiscalYear,
                            totalAssets: numberFormatter.format(affiliate.totalAssets),
                            sales: numberFormatter.format(affiliate.sales),
                        },
                    }))}
                />
            </section>

            {/* 특허 및 인증현황 — 카드 없이 문서 바탕에 흰 상자로 놓인다. 윗줄 건수 · 아랫줄 인증 여부. */}
            <section aria-labelledby="ig-company-ip" className="flex flex-col gap-4">
                <SectionTitle id="ig-company-ip" title="특허 및 인증현황" />
                <div className="grid grid-cols-4 gap-6">
                    {status.intellectualProperty.map((item) => {
                        const Icon = IP_ICONS[item.id]
                        return (
                            <StatBox
                                key={item.id}
                                label={item.label}
                                value={numberFormatter.format(item.count)}
                                unit={COUNT_UNIT}
                                icon={<Icon aria-hidden="true" className="size-icon-sm shrink-0" />}
                                className="bg-card"
                            />
                        )
                    })}
                    {status.certifications.map((item) => {
                        const Icon = CERTIFICATION_ICONS[item.id]
                        return (
                            <StatBox
                                key={item.id}
                                label={item.label}
                                value={item.isCertified ? CERTIFIED_LABEL : NOT_CERTIFIED_LABEL}
                                icon={<Icon aria-hidden="true" className="size-icon-sm shrink-0" />}
                                // 미인증은 흐린 글자로 — 글자(미인증)가 뜻을 전하므로 색에만 기대지 않는다[5.3.1].
                                valueClassName={item.isCertified ? 'text-foreground' : 'text-foreground-subtle'}
                                className="bg-card"
                            />
                        )
                    })}
                </div>
            </section>

            {/* 재무현황 — 카드마다 표(위) + 그래프(아래). 재무상태 · 손익은 겹친 막대, 비율 · 현금흐름은 여러 선. */}
            <section aria-labelledby="ig-company-finance" className="flex flex-col gap-4">
                <SectionTitle id="ig-company-finance" title="재무현황" />
                <div className="grid grid-cols-2 gap-6">
                    <Card title="재무상태" aside="단위 : 백만원">
                        <ReportTable caption="재무상태(단위: 백만원)" minWidthClassName="min-w-90" {...balanceTable} />
                        {balanceBase ? (
                            <OverlayColumnChart
                                animate={false}
                                ariaLabel="연도별 재무상태 — 총자산 대비 부채총계 · 자본총계"
                                unit="백만원"
                                data={financeChartData(finance.years, finance.balance)}
                                base={{key: balanceBase.key, label: balanceBase.label, color: OVERLAY_BASE_COLOR}}
                                series={balanceSeries.map((row, index) => ({
                                    key: row.key,
                                    label: row.label,
                                    color: OVERLAY_SERIES_COLORS[index % OVERLAY_SERIES_COLORS.length],
                                }))}
                            />
                        ) : null}
                    </Card>
                    <Card title="손익현황" aside="단위 : 백만원">
                        <ReportTable caption="손익현황(단위: 백만원)" minWidthClassName="min-w-90" {...incomeTable} />
                        {incomeBase ? (
                            <OverlayColumnChart
                                animate={false}
                                ariaLabel="연도별 손익현황 — 매출액 대비 영업이익 · 당기순이익"
                                unit="백만원"
                                data={financeChartData(finance.years, finance.income)}
                                base={{key: incomeBase.key, label: incomeBase.label, color: OVERLAY_BASE_COLOR}}
                                series={incomeSeries.map((row, index) => ({
                                    key: row.key,
                                    label: row.label,
                                    color: OVERLAY_SERIES_COLORS[index % OVERLAY_SERIES_COLORS.length],
                                }))}
                            />
                        ) : null}
                    </Card>
                    <Card title="주요재무비율" aside="단위 : %">
                        <ReportTable caption="주요재무비율(단위: %)" minWidthClassName="min-w-90" {...ratioTable} />
                        <LineChart
                            animate={false}
                            appearance="columns"
                            showTooltip={false}
                            ariaLabel="연도별 주요재무비율"
                            unit="%"
                            valueFractionDigits={2}
                            data={financeChartData(finance.years, finance.ratios)}
                            series={finance.ratios.map((row, index) => ({
                                key: row.key,
                                label: row.label,
                                color: LINE_COLORS[index % LINE_COLORS.length],
                            }))}
                        />
                    </Card>
                    <Card title="현금흐름" aside="단위 : 백만원">
                        <ReportTable
                            caption="현금흐름(단위: 백만원)"
                            minWidthClassName="min-w-100"
                            {...cashFlowTable}
                        />
                        <LineChart
                            animate={false}
                            appearance="columns"
                            showTooltip={false}
                            ariaLabel="연도별 현금흐름"
                            unit="백만원"
                            data={financeChartData(finance.years, finance.cashFlows)}
                            series={finance.cashFlows.map((row, index) => ({
                                key: row.key,
                                label: row.label,
                                color: LINE_COLORS[index % LINE_COLORS.length],
                            }))}
                        />
                    </Card>
                </div>
            </section>

            {/* 거래처현황 — 매출처 · 매입처. 비중은 연도별 두 단 머리, 신용등급은 뱃지(CRI 코드). */}
            <section aria-labelledby="ig-company-trade" className="flex flex-col gap-4">
                <SectionTitle id="ig-company-trade" title="거래처현황" />
                <div className="flex flex-col gap-6">
                    <SubBlock title="매출처" aside="단위 : %, 백만원">
                        <ReportTable caption="매출처(단위: %)" minWidthClassName="min-w-160" {...customerTable} />
                    </SubBlock>
                    <SubBlock title="매입처" aside="단위 : %, 백만원">
                        <ReportTable caption="매입처(단위: %)" minWidthClassName="min-w-160" {...supplierTable} />
                    </SubBlock>
                </div>
            </section>
        </>
    )
}

export {InnovationGrowthReportCompany}
export type {InnovationGrowthReportCompanyProps}
