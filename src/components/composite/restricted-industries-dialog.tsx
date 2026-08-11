'use client'

import type {ReactNode} from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {dialogTableBodyClassName} from '@/components/theme/dialog.variants'
import {
    dialogTableCellClassName,
    dialogTableClassName,
    dialogTableHeaderCellClassName,
} from '@/components/theme/dialog-table.variants'
import {cn} from '@/lib/utils'

// 보증제한 업종 모달 — 보증이 제한되는 업종을 분류별로 보여준다
// (Figma "[신속표준모형 KTRS-FM] m_보증제한 업종"). 3단계 체크리스트의 보증제한 업종 안내가 연다.
//
// 열 제목과 분류가 함께 있는 데이터 표라 <table> 로 마크업한다 — 열 제목은 th scope="col",
// 분류 칸은 그 묶음 전체의 제목이므로 th scope="rowgroup" 으로 준다[7.3.2]. 묶음마다 tbody 를 나눠
// 어느 행까지가 한 분류인지 구조로 드러낸다.

// 분류 한 묶음 — [세부업종, 한국표준산업분류] 한 줄이 표의 한 행이다.
type IndustryGroup = {
    category: string
    rows: readonly (readonly [string, string])[]
}

// 시안의 표 그대로다. 코드가 둘이면 시안과 같이 쉼표로 잇는다.
const INDUSTRY_GROUPS: readonly IndustryGroup[] = [
    {
        category: '도박게임 관련',
        rows: [
            ['도박게임장비 등 불건전오락기구 제조업', '3340'],
            ['사행성 오락게임용품 도소매업', '46463, 47640'],
            ['도박기계 임대업', '69390'],
            ['경품용 상품권 발행업', '75999'],
            ['경주장 및 동물 경기장 운영업', '91113'],
            ['기타 사행시설 관리 및 운영업', '91249'],
        ],
    },
    {
        category: '사치향락 관련',
        rows: [
            ['주류 중개업', '46102'],
            ['귀금속 중개업', '46109'],
            ['주류 도소매업', '46331, 47221'],
            ['귀금속 도소매업', '46492, 47830'],
            ['주점업', '5621'],
            ['노래연습장 운영업', '91223'],
            ['무도장 운영업', '91291'],
            ['마사지업', '96122'],
        ],
    },
    {
        category: '부동산 관련',
        rows: [
            ['주거용 건물 임대업', '68111'],
            ['주거용 건물 개발 및 공급업', '68121'],
            ['부동산 중개 및 대리업, 부동산 투자 자문업', '68221, 68222'],
        ],
    },
    {
        category: '기타',
        rows: [
            ['비디오물 감상실 운영업', '59142'],
            ['전화방', '91229'],
            ['복권 발행 및 판매업', '91241'],
            ['점술업 및 유사 서비스업', '96992'],
        ],
    },
]

// 열 제목 — 시안은 Bold, 분류 칸은 Medium 이다.
const columnHeadClassName = cn(dialogTableHeaderCellClassName, 'typo-body-l-bold')
const categoryCellClassName = cn(dialogTableHeaderCellClassName, 'typo-body-l-medium w-28')

type RestrictedIndustriesDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
}

const RestrictedIndustriesDialog = ({children, defaultOpen}: RestrictedIndustriesDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 표가 본문 전체라 설명 문단이 없다 — radix 에 설명 없음을 알린다. */}
        <DialogContent aria-describedby={undefined}>
            <DialogHeader>
                <DialogTitle>보증제한 업종</DialogTitle>
            </DialogHeader>
            <div className={dialogTableBodyClassName}>
                {/* 테두리는 셀이 갖는다 — 표 기본값(border-collapse)이라 맞닿은 선이 하나로 합쳐진다.
                    셸이 행에 주는 아래 테두리·hover 면은 이 표에 없는 규칙이라 끈다. */}
                <Table className={dialogTableClassName}>
                    <caption className="sr-only">보증이 제한되는 업종과 한국표준산업분류</caption>
                    <TableHeader>
                        <TableRow className="border-0 hover:bg-transparent">
                            <TableHead scope="col" className={columnHeadClassName}>
                                구분
                            </TableHead>
                            <TableHead scope="col" className={columnHeadClassName}>
                                세부업종
                            </TableHead>
                            <TableHead scope="col" className={cn(columnHeadClassName, 'w-35')}>
                                한국표준산업분류
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    {INDUSTRY_GROUPS.map((group) => (
                        <TableBody key={group.category}>
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
                                    <TableCell className={dialogTableCellClassName}>{row[0]}</TableCell>
                                    {/* 분류 코드는 자릿수를 견주어 보는 값이라 가운데 정렬에 폭을 고정한다(시안). */}
                                    <TableCell className={cn(dialogTableCellClassName, 'text-center tabular-nums')}>
                                        {row[1]}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ))}
                </Table>
            </div>
        </DialogContent>
    </Dialog>
)

export {RestrictedIndustriesDialog}
export type {RestrictedIndustriesDialogProps}
