// [퍼블리싱 가이드 전용] 정보 표 유형 데모. 서비스 화면과 무관하며 이식하지 않아도 된다.

import {
    infoTableCellClassName,
    infoTableClassName,
    infoTableHeadClassName,
    infoTableRowClassName,
    infoTableRowHeadClassName,
    infoTableSplitCellClassName,
} from '@/components/theme/info-table.variants'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'

const PAYMENT_COLUMNS = ['결제일', '상품명', '결제금액'] as const

const PAYMENT_ROWS = [
    {key: 'p1', cells: ['2026-09-17', '프리미엄', '1,100,000원']},
    {key: 'p2', cells: ['2026-06-02', '스탠다드', '550,000원']},
    {key: 'p3', cells: ['2026-03-11', '베이직', '220,000원']},
] as const

const HorizontalTypeDemo = () => (
    <Table className={infoTableClassName}>
        <caption className="sr-only">결제 내역</caption>
        <TableHeader>
            <TableRow className={infoTableRowClassName}>
                {PAYMENT_COLUMNS.map((column) => (
                    <TableHead key={column} scope="col" className={infoTableHeadClassName}>
                        {column}
                    </TableHead>
                ))}
            </TableRow>
        </TableHeader>
        <TableBody>
            {PAYMENT_ROWS.map((row) => (
                <TableRow key={row.key} className={infoTableRowClassName}>
                    {row.cells.map((cell) => (
                        <TableCell key={cell} className={infoTableCellClassName}>
                            {cell}
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

const COMPANY_ROWS = [
    {label: '기업명', value: '프롬엑스테크'},
    {label: '대표자', value: '홍길동'},
    {label: '사업자등록번호', value: '123-45-67890'},
    {label: '설립일', value: '2015-04-01'},
] as const

const VerticalTypeDemo = () => (
    <Table className={infoTableClassName}>
        <caption className="sr-only">기업 기본 정보</caption>
        <TableBody>
            {COMPANY_ROWS.map((row) => (
                <TableRow key={row.label} className={infoTableRowClassName}>
                    <TableHead scope="row" className={infoTableHeadClassName}>
                        {row.label}
                    </TableHead>
                    <TableCell className={infoTableCellClassName}>{row.value}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

const FINANCE_COLUMNS = ['구분', '2024년', '2025년'] as const

const FINANCE_ROWS = [
    {label: '매출액', values: ['120억', '148억']},
    {label: '영업이익', values: ['12억', '17억']},
    {label: '당기순이익', values: ['8억', '11억']},
] as const

const BothHeadTypeDemo = () => (
    <Table className={infoTableClassName}>
        <caption className="sr-only">연도별 재무 현황</caption>
        <TableHeader>
            <TableRow className={infoTableRowClassName}>
                {FINANCE_COLUMNS.map((column) => (
                    <TableHead key={column} scope="col" className={infoTableHeadClassName}>
                        {column}
                    </TableHead>
                ))}
            </TableRow>
        </TableHeader>
        <TableBody>
            {FINANCE_ROWS.map((row) => (
                <TableRow key={row.label} className={infoTableRowClassName}>
                    <TableHead scope="row" className={infoTableRowHeadClassName}>
                        {row.label}
                    </TableHead>
                    {row.values.map((value, index) => (
                        <TableCell key={FINANCE_COLUMNS[index + 1]} className={infoTableCellClassName}>
                            {value}
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

// 머리 한 칸 아래 값이 두 칸씩 두 줄 — 앞의 줄들은 값 칸을 두 칸 폭으로 합친다(colSpan).
const VALUE_COLUMN_SPAN = 2

const CONTACTS = [
    {name: '김담당', phone: '02-1234-5678'},
    {name: '이영업', phone: '02-2345-6789'},
] as const

const SplitValueTypeDemo = () => (
    <Table className={infoTableClassName}>
        <caption className="sr-only">기업 담당자 정보</caption>
        <TableBody>
            <TableRow className={infoTableRowClassName}>
                <TableHead scope="row" className={infoTableHeadClassName}>
                    기업명
                </TableHead>
                <TableCell colSpan={VALUE_COLUMN_SPAN} className={infoTableCellClassName}>
                    프롬엑스테크
                </TableCell>
            </TableRow>
            <TableRow className={infoTableRowClassName}>
                <TableHead scope="row" className={infoTableHeadClassName}>
                    대표자
                </TableHead>
                <TableCell colSpan={VALUE_COLUMN_SPAN} className={infoTableCellClassName}>
                    홍길동
                </TableCell>
            </TableRow>
            {CONTACTS.map((contact, index) => (
                <TableRow key={contact.name} className={infoTableRowClassName}>
                    {index === 0 ? (
                        <TableHead scope="row" rowSpan={CONTACTS.length} className={infoTableHeadClassName}>
                            담당자
                        </TableHead>
                    ) : null}
                    <TableCell className={infoTableSplitCellClassName}>{contact.name}</TableCell>
                    <TableCell className={infoTableCellClassName}>{contact.phone}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

export {BothHeadTypeDemo, HorizontalTypeDemo, SplitValueTypeDemo, VerticalTypeDemo}
