import {useId} from 'react'
import {Card, ReportTable, SectionTitle} from '@/components/custom/innovation-growth-report-parts'
import {CASH_FLOW_GRADES} from '@/content/service/cash-flow-grades'
import {CRI_GRADES} from '@/content/service/cri-grades'

// K-BIGx 기업혁신성장 보고서 · 참고자료 탭 본문 — 등급정의(신용등급 · 현금흐름등급 표).
// PDF 템플릿 참고자료(kbigx-print-reference.tsx)와 같은 표를 웹 보고서 표(ReportTable) 모양으로 그린다.
// 보고서 머리 · 탭 줄 · 탭 제목 줄은 innovation-growth-report-document.tsx 가 그린다.
//
// [프론트엔드 연동] API 연동 대상이 아니다 — 등급표 상수(CRI_GRADES · CASH_FLOW_GRADES)를 그대로 그린다.
// 정의 문구를 고치려면 content/service/cri-grades.ts · cash-flow-grades.ts 를 고친다(PDF 템플릿 · 게이지도 함께 바뀐다).
// 불러오는 중 화면(스켈레톤)도 이 본문을 그대로 그린다 — 받을 데이터가 없기 때문. 제목 id 는 useId 라 두 벌이 겹쳐도 중복되지 않는다.

const CREDIT_GRADE_COLUMNS = [
    {key: 'grade', label: '등급', widthClassName: 'w-30'},
    {key: 'definition', label: '신용등급의 정의', align: 'start'},
] as const

const CASH_FLOW_GRADE_COLUMNS = [
    {key: 'grade', label: '등급', widthClassName: 'w-30'},
    {key: 'name', label: '등급내용', widthClassName: 'w-30'},
    {key: 'definition', label: '현금등급의 정의', align: 'start'},
] as const

const InnovationGrowthReportReference = () => {
    const headingId = useId()

    return (
        <section aria-labelledby={headingId} className="flex flex-col gap-4">
            <SectionTitle id={headingId} title="등급정의" />
            <div className="flex flex-col gap-6">
                <Card title="신용등급" className="gap-2">
                    <ReportTable
                        caption="신용등급 정의"
                        columns={[...CREDIT_GRADE_COLUMNS]}
                        rows={CRI_GRADES.map((item) => ({
                            id: item.grade,
                            cells: {grade: item.grade, definition: item.definition},
                        }))}
                    />
                </Card>
                <Card title="현금흐름등급" className="gap-2">
                    <ReportTable
                        caption="현금흐름등급 정의"
                        columns={[...CASH_FLOW_GRADE_COLUMNS]}
                        rows={CASH_FLOW_GRADES.map((item) => ({
                            id: item.grade,
                            cells: {grade: item.grade, name: item.name, definition: item.definition},
                        }))}
                    />
                </Card>
            </div>
        </section>
    )
}

export {InnovationGrowthReportReference}
