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
    WithUnit,
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
// 반응형 없음 — PC 화면만 그린다(문서 최소 폭 1200, 그보다 좁은 창에서만 가로 스크롤).
//
// [프론트엔드 연동] 값은 detail(report.techInnovation)과 R&D 이슈 단어(issues, report.innovation.issues)로 받는다 — 형태는
// content/service/k-bigx-innovation-report.ts 의 InnovationTechDetail.

const numberFormatter = new Intl.NumberFormat('ko-KR')

// [프론트엔드 연동 · 표 노출 건수 규칙] 기획: 목록은 최대 10개 노출(표에 따라 넘치면 '기타' 1줄로 묶음). API 는 목록을 자르지 말고
// 그대로 보낸다(이머징 기술만 예외 — API 가 기타 줄까지 만든다).
//   표                    | 최대 줄 수        | 넘치면                         | 처리
//   특허 보유현황          | 10               | 11번째부터 안 보임              | 화면(출원일 최근순으로 받는다)
//   우수특허               | 11 (10 + 기타 1) | 11번째 줄 '기타'                | 화면(피인용 지수순 정렬 → 자름 → 합침)
//   이머징 기술            | 11 (10 + 기타 1) | 11번째 줄 '기타'                | API 가 기타 줄까지 만들어 보낸다
//   R&D 전문기관 현황      | 11 (10 + 기타 1) | 11번째 줄 '기타 …'(쪽마다)       | 화면(groupInstitutes)
//   접수중과제 · 도래 과제  | 10 (표마다)       | 11번째부터 안 보임              | 화면
const PATENT_HOLDINGS_LIMIT = 10
const EXCELLENT_PATENTS_LIMIT = 10
const RND_INSTITUTES_LIMIT = 10
const RND_PROJECTS_LIMIT = 10
// '기타' 줄 — 우수특허는 이름 '기타', 합칠 수 없는 칸(출원번호 · 출원일 · 출원인 · 피인용 지수)은 '-'.
// R&D 전문기관은 쪽마다 이름이 다르다.
const OTHER_ROW_LABEL = '기타'
const EMPTY_CELL = '-'
const RND_INSTITUTES_OTHER_LABELS = {government: '기타 연구소', academia: '기타 산학협력단'} as const

// R&D 전문기관 한 쪽 — 10곳까지 그대로, 넘으면 11번째 줄에 나머지를 '기타 …'로 합친다(특허보유수 · 비중을 더한다).
const groupInstitutes = (rows: readonly InnovationInstitute[], otherLabel: string): InnovationInstitute[] => {
    if (rows.length <= RND_INSTITUTES_LIMIT) return [...rows]
    const rest = rows.slice(RND_INSTITUTES_LIMIT)
    return [
        ...rows.slice(0, RND_INSTITUTES_LIMIT),
        {
            name: otherLabel,
            patentCount: rest.reduce((sum, row) => sum + row.patentCount, 0),
            ratio: rest.reduce((sum, row) => sum + row.ratio, 0),
        },
    ]
}
// 비중 · 증가율 · 지수는 소수 첫째 자리까지 늘 보인다(40 → 40.0).
const oneDecimalFormatter = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 1, maximumFractionDigits: 1})

// 출원번호(등록번호) · 출원일(등록일) · 출원인(권리자)처럼 한 칸에 두 줄로 적는 값. 머리 칸도 같은 모양으로 두 줄이다.
const TwoLines = ({first, second}: {first: string; second: string}) => (
    <>
        {first}
        <br />({second})
    </>
)
// 특허명 — 두 줄까지만 보이고 넘치면 말줄임(기획). 글자는 DOM 에 전부 남아 스크린리더는 끝까지 읽는다.
// title 속성은 두지 않는다 — 글자와 같은 title 은 접근성 검사기(WAVE)가 중복으로 잡는다.
const PatentTitle = ({children}: {children: string}) => <span className="line-clamp-2 break-keep">{children}</span>
// 특허 표 공통 머리 — 특허명 열 폭은 표마다 다르다.
const patentColumns = (titleWidthClassName: string) => [
    {key: 'no', label: 'No', widthClassName: 'w-15'},
    {key: 'title', label: '특허명', widthClassName: titleWidthClassName, align: 'start' as const},
    {key: 'number', label: <TwoLines first="출원번호" second="등록번호" />},
    {key: 'date', label: <TwoLines first="출원일" second="등록일" />},
    {key: 'holder', label: <TwoLines first="출원인" second="권리자" />},
]

// 소제목 + 아이콘(특허 개요 · 판단 근거)과 목록 — items 한 줄이 목록 한 항목이다.
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
    const governmentInstitutes = groupInstitutes(rndInstitutes.government.rows, RND_INSTITUTES_OTHER_LABELS.government)
    const academiaInstitutes = groupInstitutes(rndInstitutes.academia.rows, RND_INSTITUTES_OTHER_LABELS.academia)
    // [프론트엔드 연동 · 정렬] 우수특허 — 기획: 피인용 지수 높은 순. 받은 순서와 무관하게 화면이 정렬한 뒤 10건,
    // 나머지(rest)는 11번째 '기타' 줄에 피인용 횟수 합으로 넣는다.
    const excellentPatentsSorted = [...detail.excellentPatents].sort((a, b) => b.citationIndex - a.citationIndex)
    const excellentPatents = excellentPatentsSorted.slice(0, EXCELLENT_PATENTS_LIMIT)
    const excellentPatentsRest = excellentPatentsSorted.slice(EXCELLENT_PATENTS_LIMIT)
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
            {/* 안내 — 탭 제목 띠에 붙여 둔다(-mt-4 로 문서 간격을 줄인다). */}
            <p className="border-subtle-3 bg-card typo-body-xl-regular text-foreground-subtle -mt-4 rounded-lg border px-10 py-8 break-keep">
                {detail.notice}
            </p>

            {/* 보유기술 */}
            <section aria-labelledby="ig-tech-holdings" className="flex flex-col gap-4">
                <SectionTitle id="ig-tech-holdings" title="보유기술" />
                <div className="flex flex-col gap-6">
                    {/* 도넛은 조각에 올리면 말풍선으로 비중 · 건수를 보인다. */}
                    <Card title="기술 보유현황" description={holdings.description} className="gap-4">
                        <div className="grid grid-cols-2 gap-12">
                            <PercentageDonutChart
                                data={[...holdings.middleCategory]}
                                caption="중분류 기준"
                                ariaLabel="중분류 기준 보유기술 비중과 건수"
                            />
                            <PercentageDonutChart
                                data={[...holdings.smallCategory]}
                                caption="세부분야 기준"
                                ariaLabel="세부분야 기준 보유기술 비중과 건수"
                            />
                        </div>
                    </Card>
                    {/* [프론트엔드 연동 · 정렬] 출원일 최근순으로 받아 그 순서대로 그린다. 최대 10건 — 규칙은 파일 위 [표 노출 건수 규칙]. */}
                    <Card title="특허 보유현황" className="gap-0">
                        <WithUnit unit="최대 10개 · 출원일 최근순">
                            <ReportTable
                                caption="특허 보유현황(최대 10개, 출원일 최근순)"
                                columns={[
                                    ...patentColumns('w-82.5'),
                                    {key: 'field', label: '기술분야', widthClassName: 'w-55'},
                                ]}
                                rows={holdings.patents.slice(0, PATENT_HOLDINGS_LIMIT).map((patent, index) => ({
                                    id: patent.applicationNumber,
                                    cells: {
                                        no: index + 1,
                                        title: <PatentTitle>{patent.title}</PatentTitle>,
                                        number: (
                                            <TwoLines
                                                first={patent.applicationNumber}
                                                second={patent.registrationNumber}
                                            />
                                        ),
                                        date: (
                                            <TwoLines first={patent.applicationDate} second={patent.registrationDate} />
                                        ),
                                        holder: <TwoLines first={patent.applicant} second={patent.rightHolder} />,
                                        field: patent.field,
                                    },
                                }))}
                            />
                        </WithUnit>
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
                <Card title="매출 규모별 기업 및 특허 현황" className="gap-4">
                    <ButterflyBarChart
                        ariaLabel="매출 규모별 기업수와 특허수"
                        categoryTitle="매출 규모"
                        data={marketScale.rows.map((row) => ({
                            id: row.id,
                            label: row.label,
                            left: row.companies,
                            right: row.patents,
                        }))}
                        left={{title: '기업수(개)', color: 'var(--ds-report-series-3)'}}
                        right={{title: '특허수(건)', color: 'var(--ds-report-series-2)'}}
                    />
                    <div className="grid grid-cols-2 gap-12">
                        {/* [프론트엔드 연동 · 정렬] 조각 순서는 비중순이 아니라 매출 규모 순(10억원 이하 → 300억원 초과) — 데이터가 그 순서로 온다. */}
                        <PercentageDonutChart
                            data={[...marketScale.companyShare]}
                            caption="기업수 비중"
                            ariaLabel="매출 규모별 기업수 비중"
                        />
                        <PercentageDonutChart
                            data={[...marketScale.patentShare]}
                            caption="특허수 비중"
                            ariaLabel="매출 규모별 특허수 비중"
                        />
                    </div>
                </Card>
            </section>

            {/* 맞춤형 기술정보-경쟁기업 및 우수기업 */}
            <section aria-labelledby="ig-tech-competitors" className="flex flex-col gap-4">
                <SectionTitle id="ig-tech-competitors" title="맞춤형 기술정보-경쟁기업 및 우수기업" />
                <div className="flex flex-col gap-6">
                    <Card title="경쟁기업 사업실적 (매출액, 영업이익률)" className="gap-0">
                        {/* 막대 = 매출액(조회기업 · 평균 강조), 선 = 영업이익률(데이터 필드명은 growthRate · 막대와 따로 된 눈금). 받은 순서대로 그린다. */}
                        <WithUnit unit="단위: 백만원, %">
                            <ComboBarLineChart
                                ariaLabel="경쟁기업 사업실적 — 매출액과 영업이익률"
                                barLabel="매출액"
                                barUnit="백만원"
                                lineLabel="영업이익률"
                                lineUnit="%"
                                data={detail.competitors.map((item) => ({
                                    id: item.id,
                                    label: item.label,
                                    value: item.sales,
                                    lineValue: item.growthRate,
                                    tone: item.tone === 'subject' ? 'highlight' : (item.tone ?? 'default'),
                                }))}
                            />
                        </WithUnit>
                    </Card>
                    {/* '★ 고성장 기업' 범례는 카드 제목 줄 오른쪽에 둔다(차트 위 범례 줄은 끈다).
                        차트는 정렬하지 않고 받은 순서대로 그린다 — 성장률 높은 순, 평균 · 조회기업 줄은 끝에 보낸다(목업 순서). */}
                    <Card
                        title="성장률 우수기업 (최근3개년 매출액 연평균 성장률)"
                        aside={<DivergingRankLegend />}
                        className="gap-4"
                    >
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
                    {/* 최대 11줄(10건 + '기타' 1줄) — 화면이 정렬 · 자르기 · 합치기를 모두 한다. 규칙은 파일 위 [표 노출 건수 규칙]. */}
                    <Card title="우수특허" className="gap-4">
                        <ReportTable
                            caption="우수특허(피인용 횟수 · 피인용 지수)"
                            columns={[
                                ...patentColumns('w-90'),
                                {key: 'citations', label: '피인용 횟수', widthClassName: 'w-30'},
                                {key: 'citationIndex', label: '피인용 지수*', widthClassName: 'w-30'},
                            ]}
                            rows={[
                                ...excellentPatents.map((patent, index) => ({
                                    id: patent.applicationNumber,
                                    cells: {
                                        no: index + 1,
                                        title: <PatentTitle>{patent.title}</PatentTitle>,
                                        number: (
                                            <TwoLines
                                                first={patent.applicationNumber}
                                                second={patent.registrationNumber}
                                            />
                                        ),
                                        date: (
                                            <TwoLines first={patent.applicationDate} second={patent.registrationDate} />
                                        ),
                                        holder: <TwoLines first={patent.applicant} second={patent.rightHolder} />,
                                        citations: numberFormatter.format(patent.citations),
                                        citationIndex: oneDecimalFormatter.format(patent.citationIndex),
                                    },
                                })),
                                ...(excellentPatentsRest.length
                                    ? [
                                          {
                                              id: 'other',
                                              cells: {
                                                  no: excellentPatents.length + 1,
                                                  title: OTHER_ROW_LABEL,
                                                  number: EMPTY_CELL,
                                                  date: EMPTY_CELL,
                                                  holder: EMPTY_CELL,
                                                  citations: numberFormatter.format(
                                                      excellentPatentsRest.reduce(
                                                          (sum, patent) => sum + patent.citations,
                                                          0,
                                                      ),
                                                  ),
                                                  citationIndex: EMPTY_CELL,
                                              },
                                          },
                                      ]
                                    : []),
                            ]}
                        />
                        <TableNote>
                            * 피인용 지수는 특허의 피인용 횟수를 경과연도로 나누어 정규화한 값임(Age-Normalized Citation
                            Index, ANCI)
                        </TableNote>
                    </Card>
                    {/* 최대 11줄(10건 + '기타' 1줄) — API 가 만들어 보내고 화면은 자르지 않고 받은 줄을 그대로 그린다
                        (기타 줄 값 규칙은 InnovationTechDetail.emergingTech 타입 주석). 규칙은 파일 위 [표 노출 건수 규칙]. */}
                    <Card
                        title="이머징 기술"
                        description="귀사의 기술과 유사한 기술분야(세부분야)에 대한 최근 10년간 등록특허 증가율을 확인하여 각 기술분야의 발전정도를 확인할 수 있는 정보입니다."
                        className="gap-4"
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
                    </Card>
                </div>
            </section>

            {/* 맞춤형 기술정보-R&D */}
            <section aria-labelledby="ig-tech-rnd" className="flex flex-col gap-4">
                <SectionTitle id="ig-tech-rnd" title="맞춤형 기술정보-R&D" />
                <div className="flex flex-col gap-6">
                    <Card
                        title="R&D 이슈"
                        description="R&D 이슈는 귀사의 기술이 속한 기술분야(세부분야)를 기준으로, 최근 3년 이내에 등록된 특허를 분석하여 제공되는 정보입니다."
                    >
                        <WordCloud
                            words={[...issues]}
                            colors={issueColors}
                            ariaLabel="최근 3년 등록특허의 R&D 이슈 키워드"
                            className="h-54 w-full"
                        />
                    </Card>
                    {/* 쪽마다 최대 11줄(10건 + '기타' 1줄) — 화면이 합친다(groupInstitutes). 받은 순서대로 앞 10건을 두므로 정렬은
                        API 순서를 따른다. 두 쪽 길이가 달라도 긴 쪽까지 줄을 만들고 짧은 쪽 칸은 비운다. 합계 줄은 받은 total 그대로.
                        규칙은 파일 위 [표 노출 건수 규칙]. */}
                    <Card title="R&D 전문기관 현황" className="gap-4">
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
                        <TableNote>
                            * 세부분야 전체 특허건수 기준 정부출연연구소와 산학협력단의 특허건수 비중임
                        </TableNote>
                    </Card>
                    {/* 정부 R&D 사업 현황 카드 — 기준일자는 첫 소제목(접수중과제) 줄 오른쪽에 둔다. */}
                    <Card title="정부 R&D 사업 현황" className="gap-4">
                        <div className="flex flex-col gap-4">
                            {/* 표마다 최대 10건 — 받은 순서대로 앞에서부터 그린다. 규칙은 파일 위 [표 노출 건수 규칙]. */}
                            <SubBlock
                                title="접수중과제"
                                titleClassName="typo-body-l-medium"
                                aside={`기준일자 · ${governmentRnd.baseDate}`}
                            >
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
                    </Card>
                </div>
            </section>
        </>
    )
}

export {InnovationGrowthReportTech}
export type {InnovationGrowthReportTechProps}
