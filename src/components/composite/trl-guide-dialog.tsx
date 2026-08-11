'use client'

import {useState, type ReactNode} from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {TRL_BASIC_GROUPS, TRL_STANDARDS, type TrlStage} from '@/components/composite/trl-stages'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {dialogTableBodyClassName} from '@/components/theme/dialog.variants'
import {
    dialogTableCellClassName,
    dialogTableClassName,
    dialogTableHeaderCellClassName,
} from '@/components/theme/dialog-table.variants'
import {cn} from '@/lib/utils'

// TRL 확인 모달 — 기술성숙도(TRL) 단계를 표로 보여준다
// (Figma "[신속표준모형 KTRS-FM] m_TRL 확인" · "체크리스트_TRL 확인 팝업" 여섯 프레임).
// 3단계 체크리스트의 TRL 안내가 연다.
//
// 위 선택 상자로 기준을 고르면 그 기준의 표로 바뀐다. 기본정의만 단계가 연구·실험·시제품·실용화·양산으로
// 묶여 구분 칸이 있고, 유형별(①~⑤)은 묶음 없이 1~9단계가 이어진다. 표 내용은 trl-stages.ts 에 있다.

const TRL_STANDARD_FIELD = 'trl-standard'

const TRL_NOTE =
    '* 상단 메뉴를 클릭하여 ①시스템/②공법‧기법/③재료‧자재/④소프트웨어/⑤장비‧장치 유형을 참고하여 TRL 단계 선택'

// 열 제목 — 시안은 Bold, 구분 칸은 Medium 이다. 표 윗선만 진한 회색이다(시안 t-line).
const columnHeadClassName = cn(dialogTableHeaderCellClassName, 'typo-body-l-bold border-t-foreground-subtle')
const categoryCellClassName = cn(dialogTableHeaderCellClassName, 'typo-body-l-medium w-23')
// 단계 번호·이름 칸 — 글이 길어 위에서부터 읽도록 위 정렬한다. 줄바꿈은 시안 그대로 둔다.
const stepCellClassName = cn(dialogTableCellClassName, 'w-7 px-2 align-top')
const definitionCellClassName = cn(dialogTableCellClassName, 'w-45 align-top whitespace-pre-line')
const detailCellClassName = cn(dialogTableCellClassName, 'align-top')
// 표는 안내 문구와 24 떨어진다(시안). 이 간격을 표를 감싸는 상자에 주면 좁은 화면에서 본문의 오른쪽
// 여백이 사라진다 — 넘치는 아이가 표 상자(w-fit)가 아니라 그 바깥 상자(w-full)가 되기 때문이다.
const trlTableClassName = cn(dialogTableClassName, 'mt-4')

// 단계별 정의 — 여러 줄이면 한 줄씩 쌓고 앞에 · 를 붙인다(시안). 점은 장식이라 읽어 주지 않는다.
const StageDetails = ({details}: {details: readonly string[]}) => (
    <ul className="flex list-none flex-col">
        {details.map((detail) => (
            <li key={detail} className="flex gap-1">
                <span aria-hidden="true">·</span>
                <span className="min-w-0">{detail}</span>
            </li>
        ))}
    </ul>
)

// 유형별 표 — 묶음이 없어 단계가 한 줄씩 이어진다.
const TrlTypeTable = ({stages}: {stages: readonly TrlStage[]}) => (
    <Table className={trlTableClassName}>
        <caption className="sr-only">기술성숙도(TRL) 단계 정의와 단계별 정의 세부설명</caption>
        <TableHeader>
            <TableRow className="border-0 hover:bg-transparent">
                <TableHead scope="col" colSpan={2} className={columnHeadClassName}>
                    TRL 단계 정의
                </TableHead>
                <TableHead scope="col" className={columnHeadClassName}>
                    단계별 정의 세부설명
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {stages.map((stage) => (
                <TableRow key={stage.step} className="border-0 hover:bg-transparent">
                    <TableCell className={stepCellClassName}>{stage.step}</TableCell>
                    <TableCell className={definitionCellClassName}>{stage.definition}</TableCell>
                    <TableCell className={detailCellClassName}>
                        <StageDetails details={stage.details} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

// 기본정의 표 — 구분 칸이 그 묶음 전체의 제목이므로 th scope="rowgroup" 으로 주고 묶음마다 tbody 를 나눈다[7.3.2].
const TrlBasicTable = () => (
    <Table className={trlTableClassName}>
        <caption className="sr-only">기술성숙도(TRL) 구분별 단계와 단계별 정의</caption>
        <TableHeader>
            <TableRow className="border-0 hover:bg-transparent">
                <TableHead scope="col" className={columnHeadClassName}>
                    구분
                </TableHead>
                <TableHead scope="col" colSpan={3} className={columnHeadClassName}>
                    단계별 정의
                </TableHead>
            </TableRow>
        </TableHeader>
        {TRL_BASIC_GROUPS.map((group) => (
            <TableBody key={group.category}>
                {group.stages.map((stage, stageIndex) => (
                    <TableRow key={stage.step} className="border-0 hover:bg-transparent">
                        {stageIndex === 0 ? (
                            <TableHead scope="rowgroup" rowSpan={group.stages.length} className={categoryCellClassName}>
                                {group.category}
                            </TableHead>
                        ) : null}
                        <TableCell className={stepCellClassName}>{stage.step}</TableCell>
                        <TableCell className={definitionCellClassName}>{stage.definition}</TableCell>
                        <TableCell className={detailCellClassName}>
                            <StageDetails details={stage.details} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        ))}
    </Table>
)

type TrlGuideDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
}

const TrlGuideDialog = ({children, defaultOpen}: TrlGuideDialogProps) => {
    const [standardValue, setStandardValue] = useState(TRL_STANDARDS[0]?.value ?? '')
    const standard = TRL_STANDARDS.find((item) => item.value === standardValue) ?? TRL_STANDARDS[0]

    return (
        <Dialog defaultOpen={defaultOpen}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            {/* 선택 상자와 표가 본문 전체라 설명 문단이 없다 — radix 에 설명 없음을 알린다. */}
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>TRL 확인</DialogTitle>
                </DialogHeader>
                <div className={cn(dialogTableBodyClassName, 'gap-2')}>
                    {/* 선택 상자에는 보이는 라벨이 없어(시안) 무엇을 고르는 자리인지 이름으로 알린다[7.4.1]. */}
                    <Select value={standardValue} onValueChange={setStandardValue} name="trlStandard">
                        <SelectTrigger id={TRL_STANDARD_FIELD} aria-label="TRL 기준" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {TRL_STANDARDS.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="typo-body-m-regular text-foreground-subtle">{TRL_NOTE}</p>
                    {standard?.stages ? <TrlTypeTable stages={standard.stages} /> : <TrlBasicTable />}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export {TrlGuideDialog}
export type {TrlGuideDialogProps}
