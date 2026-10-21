import {KbxBlock, KbxSubBlock, KbxTable} from '@/components/custom/kbigx-print-parts'
import {CASH_FLOW_GRADES} from '@/content/service/cash-flow-grades'
import {CRI_GRADES} from '@/content/service/cri-grades'

// K-BIGx 보고서 인쇄본 — 참고자료(등급 정의). API 연동 대상이 아니다 — 등급표 상수(CRI_GRADES · CASH_FLOW_GRADES)를
// 그대로 그린다. 신용등급 24행 + 현금흐름등급 6행이 한 쪽에 들어가도록 칸 여백을 줄인다(density="compact").
// 등급표에 행을 더하면 한 쪽을 넘칠 수 있으니 인쇄본에서 넘침 표시를 확인한다.

const CREDIT_GRADE_COLUMNS = [
    {key: 'grade', header: '등급', isRowHeader: true, className: 'w-kbx-150'},
    {key: 'definition', header: '신용등급의 정의', align: 'start'},
] as const

const CASH_FLOW_GRADE_COLUMNS = [
    {key: 'grade', header: '등급', isRowHeader: true, className: 'w-kbx-150'},
    {key: 'name', header: '등급내용', className: 'w-kbx-150'},
    {key: 'definition', header: '현금등급의 정의', align: 'start'},
] as const

const KbigxPrintReference = () => (
    <KbxBlock title="등급 정의">
        <KbxSubBlock title="신용등급">
            <KbxTable
                caption="신용등급 정의"
                density="compact"
                columns={CREDIT_GRADE_COLUMNS}
                rows={CRI_GRADES.map((item) => ({key: item.grade, cells: [item.grade, item.definition]}))}
            />
        </KbxSubBlock>
        <KbxSubBlock title="현금흐름등급">
            <KbxTable
                caption="현금흐름등급 정의"
                density="compact"
                columns={CASH_FLOW_GRADE_COLUMNS}
                rows={CASH_FLOW_GRADES.map((item) => ({
                    key: item.grade,
                    cells: [item.grade, item.name, item.definition],
                }))}
            />
        </KbxSubBlock>
    </KbxBlock>
)

export {KbigxPrintReference}
