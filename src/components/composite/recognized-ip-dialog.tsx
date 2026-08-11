'use client'

import type {ReactNode} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {Table, TableBody, TableCell, TableHead, TableRow} from '@/components/ui/table'
import {dialogTableBodyClassName} from '@/components/theme/dialog.variants'
import {
    dialogTableCellClassName,
    dialogTableClassName,
    dialogTableHeaderCellClassName,
} from '@/components/theme/dialog-table.variants'
import {cn} from '@/lib/utils'

// 실적인정 지식재산 모달 — 실적으로 인정하는 지식재산의 종류를 분류표로 보여준다
// (Figma "[신속표준모형 KTRS-FM] m_실적인정 지식재산"). 기업 기타 정보의 [실적인정 지식재산] 버튼이 연다.
//
// 분류(왼쪽)와 그에 속하는 권리(오른쪽)를 잇는 데이터 표라 <table> 로 마크업한다 — 표 이름은 caption 으로,
// 분류 칸은 그 묶음 전체의 제목이므로 th scope="rowgroup" 으로 준다[7.3.2]. 묶음마다 tbody 를 나눠
// 어느 행까지가 한 분류인지 구조로 드러낸다.

// 분류 한 묶음 — rights 한 줄이 표의 한 행이다. 오른쪽이 둘로 갈리는 묶음은 [소분류, 내용] 두 칸을 준다.
type IpGroup = {
    category: string
    rows: readonly (readonly [string] | readonly [string, string])[]
}

// 시안의 표 그대로다. 위첨자 1)·2) 는 표 아래 각주를 가리킨다.
const IP_GROUPS: readonly IpGroup[] = [
    {
        category: '산업재산권',
        rows: [['등록특허권, 출원된 특허'], ['실용신안권¹⁾, 실용신안출원, 디자인권²⁾, 상표권']],
    },
    {category: '저작권', rows: [['저작권'], ['저작인접권']]},
    {
        category: '산업재산권',
        rows: [
            ['산업저작권', '저작권(컴퓨터프로그램)'],
            ['첨단산업재산권', '반도체배치설계권'],
            ['정보재산권', '데이터베이스제작자권리, 영업비밀'],
            ['기타재산권', '품종보호권'],
        ],
    },
]

const IP_NOTES: readonly string[] = [
    '1) 무심사 방식으로 선등록된 실용신안권은 기술평가를 통해 등록유지 결정된 건에 한함',
    '2) 무심사 방식으로 등록된 디자인권은 제 3자 이의신청 기간 후 등록유지 결정된 건에 한함',
]

// 분류 칸 — 시안은 이 표에서만 굵은 글씨다(보증제한 업종 표는 Medium).
const categoryCellClassName = cn(dialogTableHeaderCellClassName, 'typo-body-l-bold w-30')

type RecognizedIpDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
}

const RecognizedIpDialog = ({children, defaultOpen}: RecognizedIpDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 표가 본문 전체라 설명 문단이 없다 — radix 에 설명 없음을 알린다. */}
        <DialogContent aria-describedby={undefined}>
            <DialogHeader>
                <DialogTitle>실적인정 지식재산</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogTableBodyClassName, 'gap-2')}>
                {/* 테두리는 셀이 갖는다 — 표 기본값(border-collapse)이라 맞닿은 선이 하나로 합쳐진다.
                    셸이 행에 주는 아래 테두리·hover 면은 이 표에 없는 규칙이라 끈다. */}
                <Table className={dialogTableClassName}>
                    <caption className="sr-only">실적으로 인정하는 지식재산 종류</caption>
                    {IP_GROUPS.map((group, groupIndex) => (
                        <TableBody key={`${group.category}-${groupIndex}`}>
                            {group.rows.map((row, rowIndex) => (
                                <TableRow key={row[0]} className="border-0 hover:bg-transparent">
                                    {rowIndex === 0 ? (
                                        <TableHead
                                            scope="rowgroup"
                                            rowSpan={group.rows.length}
                                            className={categoryCellClassName}
                                        >
                                            {group.category}
                                        </TableHead>
                                    ) : null}
                                    {row.length === 1 ? (
                                        <TableCell colSpan={2} className={dialogTableCellClassName}>
                                            {row[0]}
                                        </TableCell>
                                    ) : (
                                        <>
                                            <TableCell className={cn(dialogTableCellClassName, 'w-30')}>
                                                {row[0]}
                                            </TableCell>
                                            <TableCell className={dialogTableCellClassName}>{row[1]}</TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    ))}
                </Table>
                <ul className="flex list-none flex-col gap-1">
                    {IP_NOTES.map((note) => (
                        <li key={note} className="typo-body-m-regular text-foreground-subtle">
                            {note}
                        </li>
                    ))}
                </ul>
            </div>
        </DialogContent>
    </Dialog>
)

export {RecognizedIpDialog}
export type {RecognizedIpDialogProps}
