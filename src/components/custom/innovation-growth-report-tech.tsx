'use client'

import {Award, Lightbulb} from 'lucide-react'
import {ButterflyBarChart} from '@/components/custom/butterfly-bar-chart'
import {ComboBarLineChart} from '@/components/custom/combo-bar-line-chart'
import {DivergingRankChart, DivergingRankLegend, type DivergingRankItem} from '@/components/custom/diverging-rank-chart'
import {ListMarker} from '@/components/custom/list-marker'
import {PercentageDonutChart} from '@/components/custom/percentage-donut-chart'
import {WordCloud} from '@/components/custom/word-cloud'
import {
    Card,
    NoticeBox,
    ReportTable,
    SectionTitle,
    SubBlock,
    TableNote,
} from '@/components/custom/innovation-growth-report-parts'
import type {
    InnovationInstitute,
    InnovationRankItem,
    InnovationTechDetail,
} from '@/content/service/k-bigx-innovation-report'
import type {WordCloudItem} from '@/components/custom/word-cloud'
import type {ReactNode} from 'react'

// K-BIGx 기업혁신성장 보고서 · 기술혁신정보 탭 본문 — 안내 → 보유기술 → 특허기술 분석 → 맞춤형 기술정보(기업·특허 현황 · 경쟁기업 및
// 우수기업 · 우수기술 · R&D). 보고서 머리 · 탭 줄 · 탭 제목 줄은 innovation-growth-report-document.tsx 가 그린다.
// 반응형 없음 — PC 폭(1280)만 그린다(좁으면 문서가 가로로 넘친다).
//
// [프론트엔드 연동] 값은 detail(report.techInnovation)과 R&D 이슈 단어(issues, report.innovation.issues)로 받는다 — 형태는
// content/service/k-bigx-innovation-report.ts 의 InnovationTechDetail.

const numberFormatter = new Intl.NumberFormat('ko-KR')
// 특허 보유현황 · 우수특허 최대 노출 건수(기획).
const PATENT_HOLDINGS_LIMIT = 10
const EXCELLENT_PATENTS_LIMIT = 10
// R&D 전문기관 현황 — 쪽마다(정부출연연구소 · 산학협력단) 최대 노출 기관 수(기획). 넘으면 나머지를 '기타' 한 줄로 합친다.
const RND_INSTITUTES_LIMIT = 10
// 정부 R&D 사업 현황 — 접수중과제 · 접수기간 도래 과제 표마다 최대 노출 건수(기획).
const RND_PROJECTS_LIMIT = 10
const RND_INSTITUTES_OTHER_LABEL = '기타'

// 기관 목록 — 10곳까지 그대로, 넘으면 11번째 줄에 나머지를 '기타'로 합친다(특허보유수 · 비중을 더한다).
const groupInstitutes = (rows: readonly InnovationInstitute[]): InnovationInstitute[] => {
    if (rows.length <= RND_INSTITUTES_LIMIT) return [...rows]
    const rest = rows.slice(RND_INSTITUTES_LIMIT)
    return [
        ...rows.slice(0, RND_INSTITUTES_LIMIT),
        {
            name: RND_INSTITUTES_OTHER_LABEL,
            patentCount: rest.reduce((sum, row) => sum + row.patentCount, 0),
            ratio: rest.reduce((sum, row) => sum + row.ratio, 0),
        },
    ]
}
// 비중 · 증가율 · 지수는 소수 첫째 자리까지 늘 보인다(40 → 40.0).
const oneDecimalFormatter = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 1, maximumFractionDigits: 1})

// 출원번호(등록번호) · 출원일(등록일) · 출원인(권리자)처럼 한 칸에 두 줄로 적는 값.
const TwoLines = ({first, second}: {first: string; second: string}) => (
    <>
        {first}
        <br />({second})
    </>
)

// 소제목 + 아이콘(특허 개요 · 판단 근거)과 목록 — 제목 16 Bold(아이콘 20, 간격 4), 목록과 간격 8, 목록은 16 Regular(gray.500).
const IconBulletBlock = ({icon, title, items}: {icon: ReactNode; title: string; items: readonly string[]}) => (
    <div className="flex flex-col gap-2">
        <h5 className="typo-body-xl-bold text-foreground flex items-center gap-1">
            {icon}
            {title}
        </h5>
        <ul className="typo-body-xl-regular text-foreground-subtle flex flex-col gap-1">
            {items.map((item) => (
                <li key={item} className="flex">
                    <ListMarker type="unordered" />
                    <span className="min-w-0 break-keep">{item}</span>
                </li>
            ))}
        </ul>
    </div>
)

// 성장률 목록 항목 → 차트 항목(고성장 기업 표시 · 평균/조회기업 강조).
const toRankItem = (item: InnovationRankItem): DivergingRankItem => ({
    id: item.id,
    name: item.name,
    value: item.value,
    tone: item.tone ?? 'default',
    isHighlighted: item.isHighGrowth,
})

type InnovationGrowthReportTechProps = {
    detail: InnovationTechDetail
    issues: readonly WordCloudItem[]
    issueColors: readonly string[]
}

const InnovationGrowthReportTech = ({detail, issues, issueColors}: InnovationGrowthReportTechProps) => {
    const {holdings, analysis, marketScale, emergingTech, rndInstitutes, governmentRnd} = detail
    const governmentInstitutes = groupInstitutes(rndInstitutes.government.rows)
    const academiaInstitutes = groupInstitutes(rndInstitutes.academia.rows)
    // 정부 R&D 표 — 접수중 · 접수기간 도래 두 표가 같은 열을 쓴다.
    const rndProjectColumns = [
        {key: 'no', label: 'No', widthClassName: 'w-15'},
        {key: 'ministry', label: '부처명'},
        {key: 'title', label: '공고명', widthClassName: 'w-90', align: 'start' as const, isNoWrap: true},
        {key: 'period', label: '접수기간', isNoWrap: true},
        {key: 'agency', label: '전문기관', isNoWrap: true},
        {key: 'manager', label: '담당자', isNoWrap: true},
    ]
    const rndProjectRows = (projects: InnovationTechDetail['governmentRnd']['open']) =>
        projects.map((project, index) => ({
            id: `${project.title}-${index}`,
            cells: {no: index + 1, ...project},
        }))

    return (
        <>
            {/* 안내 — 탭 제목 줄 바로 아래(간격 16)라 문서 간격(40)에서 24 를 당긴다. */}
            <NoticeBox className="-mt-6">{detail.notice}</NoticeBox>

            {/* 보유기술 */}
            <section aria-labelledby="ig-tech-holdings" className="flex flex-col gap-4">
                <SectionTitle id="ig-tech-holdings" title="보유기술" />
                <div className="flex flex-col gap-6">
                    <Card title="기술 보유현황" description={holdings.description}>
                        <div className="grid grid-cols-2 gap-12">
                            <PercentageDonutChart
                                animate={false}
                                data={[...holdings.middleCategory]}
                                caption="중분류 기준"
                                showTooltip={false}
                                ariaLabel="중분류 기준 보유기술 비중과 건수"
                            />
                            <PercentageDonutChart
                                animate={false}
                                data={[...holdings.smallCategory]}
                                caption="소분류 기준"
                                showTooltip={false}
                                ariaLabel="소분류 기준 보유기술 비중과 건수"
                            />
                        </div>
                    </Card>
                    {/* [프론트엔드 연동 · 최대 10건] 기획: 특허 보유현황 표는 최대 10건만 노출한다.
                    화면은 받은 순서대로 앞에서부터 10건(PATENT_HOLDINGS_LIMIT)만 그린다 — 11번째부터는 표에 나오지 않는다.
                    정렬 기준(출원일 최근순)이 바뀌면 자르기 전에 정렬을 맞춘다. */}
                    <Card title="특허 보유현황" aside="최대 10개 · 출원일 최근순">
                        <ReportTable
                            caption="특허 보유현황(최대 10개, 출원일 최근순)"
                            columns={[
                                {key: 'no', label: 'No', widthClassName: 'w-15'},
                                {key: 'title', label: '특허명', widthClassName: 'w-82.5', align: 'start'},
                                {key: 'number', label: '출원번호 (등록번호)'},
                                {key: 'date', label: '출원일 (등록일)'},
                                {key: 'holder', label: '출원인 (권리자)'},
                                {key: 'field', label: '기술분야', widthClassName: 'w-55'},
                            ]}
                            rows={holdings.patents.slice(0, PATENT_HOLDINGS_LIMIT).map((patent, index) => ({
                                id: patent.applicationNumber,
                                cells: {
                                    no: index + 1,
                                    title: patent.title,
                                    number: (
                                        <TwoLines first={patent.applicationNumber} second={patent.registrationNumber} />
                                    ),
                                    date: <TwoLines first={patent.applicationDate} second={patent.registrationDate} />,
                                    holder: <TwoLines first={patent.applicant} second={patent.rightHolder} />,
                                    field: patent.field,
                                },
                            }))}
                        />
                    </Card>
                </div>
            </section>

            {/* 특허기술 분석 */}
            <section aria-labelledby="ig-tech-analysis" className="flex flex-col gap-4">
                <SectionTitle id="ig-tech-analysis" title="특허기술 분석" />
                <div className="flex flex-col gap-6">
                    <Card title="분석특허">
                        <NoticeBox className="text-center">
                            특허명 : {analysis.patentTitle}({analysis.patentNumber})
                        </NoticeBox>
                        <IconBulletBlock
                            icon={<Award aria-hidden="true" className="size-icon-md shrink-0" />}
                            title="특허 개요"
                            items={analysis.summary}
                        />
                    </Card>
                    <Card title="맞춤형 기술분야">
                        <NoticeBox className="flex flex-col items-center gap-2 text-center">
                            <p className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
                                {/* 기술분야 이름 뱃지 — 파란 면 · 흰 14 Medium · 반경 8 · 높이 28. */}
                                <span className="bg-primary text-primary-foreground typo-body-l-medium inline-flex h-7 items-center rounded-sm px-3">
                                    {analysis.field.name}
                                </span>
                                <span className="typo-body-l-regular">{analysis.field.path}</span>
                            </p>
                            <p>{analysis.field.description}</p>
                        </NoticeBox>
                        <IconBulletBlock
                            icon={<Lightbulb aria-hidden="true" className="size-icon-md shrink-0" />}
                            title="판단 근거"
                            items={analysis.reasons}
                        />
                    </Card>
                </div>
            </section>

            {/* 맞춤형 기술정보-기업·특허 현황 */}
            <section aria-labelledby="ig-tech-market" className="flex flex-col gap-4">
                <SectionTitle id="ig-tech-market" title="맞춤형 기술정보-기업·특허 현황" />
                <Card title="매출 규모별 기업 및 특허 현황">
                    <ButterflyBarChart
                        ariaLabel="매출 규모별 기업수와 특허수"
                        categoryTitle="매출 규모"
                        data={marketScale.rows.map((row) => ({
                            id: row.id,
                            label: row.label,
                            left: row.companies,
                            right: row.patents,
                        }))}
                        left={{title: '기업수(개)', color: 'var(--raw-purple-500)'}}
                        right={{title: '특허수(건)', color: 'var(--raw-blue-500)'}}
                    />
                    <div className="grid grid-cols-2 gap-12">
                        <PercentageDonutChart
                            animate={false}
                            data={[...marketScale.companyShare]}
                            caption="기업수 비중"
                            showTooltip={false}
                            ariaLabel="매출 규모별 기업수 비중"
                        />
                        <PercentageDonutChart
                            animate={false}
                            data={[...marketScale.patentShare]}
                            caption="특허수 비중"
                            showTooltip={false}
                            ariaLabel="매출 규모별 특허수 비중"
                        />
                    </div>
                </Card>
            </section>

            {/* 맞춤형 기술정보-경쟁기업 및 우수기업 */}
            <section aria-labelledby="ig-tech-competitors" className="flex flex-col gap-4">
                <SectionTitle id="ig-tech-competitors" title="맞춤형 기술정보-경쟁기업 및 우수기업" />
                <div className="flex flex-col gap-6">
                    <Card title="경쟁기업 사업실적">
                        {/* 막대 = 매출액(조회기업 · 평균 강조), 선 = 증가율(막대와 따로 된 눈금). */}
                        <ComboBarLineChart
                            animate={false}
                            ariaLabel="경쟁기업 사업실적 — 매출액과 증가율"
                            barLabel="매출액"
                            barUnit="백만원"
                            lineLabel="증가율"
                            lineUnit="%"
                            data={detail.competitors.map((item) => ({
                                id: item.id,
                                label: item.label,
                                value: item.sales,
                                lineValue: item.growthRate,
                                tone: item.tone === 'subject' ? 'highlight' : (item.tone ?? 'default'),
                            }))}
                        />
                    </Card>
                    {/* '★ 고성장 기업' 범례는 카드 제목 줄 오른쪽에 둔다(차트 위 범례 줄은 끈다). */}
                    <Card title="성장률 우수기업" aside={<DivergingRankLegend />}>
                        <DivergingRankChart
                            showLegend={false}
                            ariaLabel="성장률 우수기업 — 매출 100억원 이하 · 100억원 초과 기업의 성장률 순위"
                            left={{
                                title: detail.growthLeaders.small.title,
                                items: detail.growthLeaders.small.items.map(toRankItem),
                            }}
                            right={{
                                title: detail.growthLeaders.large.title,
                                items: detail.growthLeaders.large.items.map(toRankItem),
                            }}
                        />
                    </Card>
                </div>
            </section>

            {/* 맞춤형 기술정보-우수기술 */}
            <section aria-labelledby="ig-tech-excellent" className="flex flex-col gap-4">
                <SectionTitle id="ig-tech-excellent" title="맞춤형 기술정보-우수기술" />
                <div className="flex flex-col gap-6">
                    {/* [프론트엔드 연동 · 최대 10건] 기획: 우수특허 표는 최대 10건만 노출한다.
                    화면은 받은 순서대로 앞에서부터 10건(EXCELLENT_PATENTS_LIMIT)만 그린다 — 11번째부터는 표에 나오지 않는다. */}
                    <SubBlock title="우수특허">
                        <ReportTable
                            caption="우수특허(피인용 횟수 · 피인용 지수)"
                            columns={[
                                {key: 'no', label: 'No', widthClassName: 'w-15'},
                                {key: 'title', label: '특허명', widthClassName: 'w-90', align: 'start'},
                                {key: 'number', label: '출원번호 (등록번호)'},
                                {key: 'date', label: '출원일 (등록일)'},
                                {key: 'holder', label: '출원인 (권리자)'},
                                {key: 'citations', label: '피인용 횟수', widthClassName: 'w-30'},
                                {key: 'citationIndex', label: '피인용 지수*', widthClassName: 'w-30'},
                            ]}
                            rows={detail.excellentPatents.slice(0, EXCELLENT_PATENTS_LIMIT).map((patent, index) => ({
                                id: patent.applicationNumber,
                                cells: {
                                    no: index + 1,
                                    title: patent.title,
                                    number: (
                                        <TwoLines first={patent.applicationNumber} second={patent.registrationNumber} />
                                    ),
                                    date: <TwoLines first={patent.applicationDate} second={patent.registrationDate} />,
                                    holder: <TwoLines first={patent.applicant} second={patent.rightHolder} />,
                                    citations: numberFormatter.format(patent.citations),
                                    citationIndex: oneDecimalFormatter.format(patent.citationIndex),
                                },
                            }))}
                        />
                        <TableNote>
                            * 피인용 지수는 특허의 피인용 횟수를 경과연도로 나누어 정규화한 값임(Age-Normalized Citation
                            Index, ANCI)
                        </TableNote>
                    </SubBlock>
                    {/* [프론트엔드 연동 · 최대 10건 + 기타] 기획: 이머징 기술 표는 최대 10건까지 노출하고, 넘으면 나머지를 11번째 줄
                    '기타' 하나로 묶는다(총 11줄). 연동 시 처리한다(현재 화면은 받은 줄을 그대로 그림).
                    기타 줄 = 나머지 분야의 기간별 등록건수 · 합계 · 비중 합. 증가율은 합친 등록건수로 다시 계산한 값을 백엔드에서 받는다
                    (분야별 증가율을 더하거나 평균 내지 않는다). */}
                    <SubBlock
                        title="이머징 기술"
                        description="귀사의 기술과 유사한 기술분야(소분류)에 대한 최근 10년간 등록특허 증가율을 확인하여 각 기술분야의 발전정도를 확인할 수 있는 정보입니다."
                    >
                        <ReportTable
                            caption="이머징 기술 — 기술분야별 특허 등록건수 · 증가율 · 비중"
                            columns={[
                                {key: 'no', label: 'No', widthClassName: 'w-15'},
                                {key: 'field', label: '기술분야', widthClassName: 'w-53.5', align: 'start'},
                                ...emergingTech.periods.map((period) => ({
                                    key: period,
                                    label: period,
                                    group: '특허 등록건수',
                                })),
                                {key: 'total', label: '합계', group: '특허 등록건수'},
                                {key: 'growthRate', label: '증가율(%)', widthClassName: 'w-25'},
                                {key: 'share', label: '비중(%)', widthClassName: 'w-25'},
                            ]}
                            rows={emergingTech.rows.map((row, index) => ({
                                id: row.field,
                                cells: {
                                    no: index + 1,
                                    field: row.field,
                                    ...Object.fromEntries(
                                        emergingTech.periods.map((period, periodIndex) => [
                                            period,
                                            numberFormatter.format(row.counts[periodIndex] ?? 0),
                                        ]),
                                    ),
                                    total: numberFormatter.format(row.counts.reduce((sum, count) => sum + count, 0)),
                                    growthRate: oneDecimalFormatter.format(row.growthRate),
                                    share: oneDecimalFormatter.format(row.share),
                                },
                            }))}
                        />
                    </SubBlock>
                </div>
            </section>

            {/* 맞춤형 기술정보-R&D */}
            <section aria-labelledby="ig-tech-rnd" className="flex flex-col gap-4">
                <SectionTitle id="ig-tech-rnd" title="맞춤형 기술정보-R&D" />
                <div className="flex flex-col gap-6">
                    <Card
                        title="R&D 이슈"
                        description="R&D 이슈는 귀사의 기술이 속한 기술분야(소분류)를 기준으로, 최근 3년 이내에 등록된 특허를 분석하여 제공되는 정보입니다."
                    >
                        <WordCloud
                            words={[...issues]}
                            colors={issueColors}
                            ariaLabel="최근 3년 등록특허의 R&D 이슈 키워드"
                            className="mx-auto h-54 w-full max-w-135"
                        />
                    </Card>
                    {/* [프론트엔드 연동 · 최대 10건 + 기타] 기획: R&D 전문기관 현황 표는 최대 10건까지 노출하고, 넘으면 나머지를 11번째 줄
                    '기타' 하나로 묶는다(총 11줄). 정부출연연구소 · 산학협력단 쪽마다 따로 적용한다.
                    화면이 처리한다(groupInstitutes — 기타 줄 = 나머지 기관의 특허보유수 · 비중 합). 두 쪽 목록 길이가 달라도 긴 쪽까지
                    줄을 만들고 짧은 쪽 칸은 비운다. 합계 줄은 받은 total 그대로다. */}
                    <SubBlock title="R&D 전문기관 현황">
                        <ReportTable
                            caption="R&D 전문기관 현황 — 정부출연연구소 · 산학협력단별 특허보유수와 비중"
                            columns={[
                                {key: 'no', label: 'No', widthClassName: 'w-15'},
                                ...(['government', 'academia'] as const).flatMap((side) => {
                                    const group = `${side === 'government' ? '정부출연연구소' : '산학협력단'} (${oneDecimalFormatter.format(rndInstitutes[side].share)}%)*`
                                    return [
                                        {key: `${side}-name`, label: '기관명', group, widthClassName: 'w-80'},
                                        {key: `${side}-count`, label: '특허보유수', group},
                                        {key: `${side}-ratio`, label: '비중(%)', group},
                                    ]
                                }),
                            ]}
                            rows={Array.from(
                                {length: Math.max(governmentInstitutes.length, academiaInstitutes.length)},
                                (_, index) => {
                                    const government = governmentInstitutes[index]
                                    const academia = academiaInstitutes[index]
                                    return {
                                        id: `institute-${index}`,
                                        cells: {
                                            no: index + 1,
                                            'government-name': government?.name ?? '',
                                            'government-count': government
                                                ? numberFormatter.format(government.patentCount)
                                                : '',
                                            'government-ratio': government
                                                ? oneDecimalFormatter.format(government.ratio)
                                                : '',
                                            'academia-name': academia?.name ?? '',
                                            'academia-count': academia
                                                ? numberFormatter.format(academia.patentCount)
                                                : '',
                                            'academia-ratio': academia
                                                ? oneDecimalFormatter.format(academia.ratio)
                                                : '',
                                        },
                                    }
                                },
                            )}
                            footerCells={[
                                {key: 'government-label', content: '합계', colSpan: 2},
                                {
                                    key: 'government-count',
                                    content: numberFormatter.format(rndInstitutes.government.total.patentCount),
                                },
                                {
                                    key: 'government-ratio',
                                    content: oneDecimalFormatter.format(rndInstitutes.government.total.ratio),
                                },
                                {key: 'academia-label', content: '합계'},
                                {
                                    key: 'academia-count',
                                    content: numberFormatter.format(rndInstitutes.academia.total.patentCount),
                                },
                                {
                                    key: 'academia-ratio',
                                    content: oneDecimalFormatter.format(rndInstitutes.academia.total.ratio),
                                },
                            ]}
                        />
                        <TableNote>* 소분류 전체 특허건수 기준 정부출연연구소와 산학협력단의 특허건수 비중임</TableNote>
                    </SubBlock>
                    <SubBlock title="정부 R&D 사업 현황" aside={`기준일자 · ${governmentRnd.baseDate}`}>
                        {/* 제목 줄과 첫 소제목 사이는 16 — SubBlock 간격(8)에 8(pt-2)을 더한다. */}
                        <div className="flex flex-col gap-4 pt-2">
                            {/* [프론트엔드 연동 · 최대 10건] 기획: 정부 R&D 접수중과제 · 접수기간 도래 과제(미확정) 두 표는 표마다 최대 10건만 노출한다.
                    화면은 받은 순서대로 앞에서부터 10건(RND_PROJECTS_LIMIT)만 그린다 — 11번째부터는 표에 나오지 않는다. */}
                            <SubBlock title="접수중과제" titleClassName="typo-body-l-medium">
                                <ReportTable
                                    caption="정부 R&D 접수중과제"
                                    columns={rndProjectColumns}
                                    rows={rndProjectRows(governmentRnd.open.slice(0, RND_PROJECTS_LIMIT))}
                                />
                            </SubBlock>
                            <SubBlock title="접수기간 도래 과제(미확정)*" titleClassName="typo-body-l-medium">
                                <ReportTable
                                    caption="정부 R&D 접수기간 도래 과제(미확정)"
                                    columns={rndProjectColumns}
                                    rows={rndProjectRows(governmentRnd.upcoming.slice(0, RND_PROJECTS_LIMIT))}
                                />
                                <TableNote>
                                    * 접수기간 도래 과제는 사업실시가 확정되지 않은 과제로, 보고서 조회시점 기준 전년
                                    동기에 접수 중(예정 포함)인 과제임
                                </TableNote>
                            </SubBlock>
                        </div>
                    </SubBlock>
                </div>
            </section>
        </>
    )
}

export {InnovationGrowthReportTech}
export type {InnovationGrowthReportTechProps}
