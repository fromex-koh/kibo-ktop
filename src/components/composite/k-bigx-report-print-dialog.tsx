'use client'

import {useId, useState, type ReactNode} from 'react'
import {Printer} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {Separator} from '@/components/ui/separator'
import {dialogInfoBodyClassName} from '@/components/theme/dialog.variants'
import {
    REPORT_PRINT_ALL,
    REPORT_PRINT_SECTIONS,
    REPORT_PRINT_TITLE,
    type ReportPrintSectionId,
} from '@/content/service/k-bigx-report-print'
import {cn} from '@/lib/utils'

// 보고서 출력 — 시안 "K-BIGx 보고서_보고서 출력"(40007590:12084).
// 출력 대상 요약(기업명 · 조회기준일) → 출력 항목 고르기[전체선택 / 구분선 / 항목 6개] → [출력하기].
// 전체선택은 항목을 모두 켜고 끄며, 일부만 골라지면 '일부'(indeterminate) 상태가 된다.
// 아무 항목도 고르지 않으면 [출력하기]는 눌리지 않는다.
//
// 시안 규격: 폭 588 · 반경 24 · 좌우·위 여백 32(판매자 정보 모달과 같다) · 제목과 요약 24 · 요약과 항목 상자 24 ·
// 요약 상자(테두리 gray.100 · 반경 12 · 여백 24 · 줄 사이 12) · 항목 상자(테두리 gray.100 · 반경 16 · 여백 24) ·
// 전체선택과 구분선 16 · 구분선과 항목 16 · 항목 사이 16 · [출력하기] 전체 폭.
// 좁은 화면(sm 미만)은 모든 모달이 쓰는 24 여백을 그대로 둔다.

type KbigxReportPrintDialogProps = {
    /** 출력 대상 요약 — 기업명 · 조회기준일 등(항목명 · 값). */
    summary: readonly {label: string; value: string}[]
    /** 처음에 골라 둘 항목. */
    defaultSelected?: readonly ReportPrintSectionId[]
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** [출력하기]를 눌렀을 때. [프론트엔드 연동] 고른 항목으로 보고서 출력(인쇄 미리보기)을 연결한다. */
    onPrint?: (selected: ReportPrintSectionId[]) => void
}

const KbigxReportPrintDialog = ({
    summary,
    defaultSelected = [],
    children,
    defaultOpen,
    onPrint,
}: KbigxReportPrintDialogProps) => {
    const [selected, setSelected] = useState<ReportPrintSectionId[]>([...defaultSelected])
    const idPrefix = useId()
    const isAllSelected = selected.length === REPORT_PRINT_SECTIONS.length
    const isSomeSelected = selected.length > 0

    const toggleAll = (checked: boolean) =>
        setSelected(checked ? REPORT_PRINT_SECTIONS.map((section) => section.id) : [])
    const toggleSection = (id: ReportPrintSectionId, checked: boolean) =>
        setSelected((current) => (checked ? [...current, id] : current.filter((selectedId) => selectedId !== id)))

    return (
        <Dialog defaultOpen={defaultOpen}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            {/* 닫기(X)는 셸이 다른 모달의 여백(40)에 맞춰 둔다 — 이 모달은 여백이 32 라 X 도 같은 값으로 옮겨
                제목 줄과 맞춘다(오른쪽·위 32). */}
            <DialogContent
                aria-describedby={undefined}
                className="sm:[&>[data-slot=dialog-close]]:me-8 sm:[&>[data-slot=dialog-close]]:mt-8"
            >
                <DialogHeader className="sm:px-8 sm:pt-8">
                    <DialogTitle className="break-keep">{REPORT_PRINT_TITLE}</DialogTitle>
                </DialogHeader>
                <div className={cn(dialogInfoBodyClassName, 'gap-6 break-keep sm:px-8')}>
                    <dl className="border-subtle-3 flex flex-col gap-3 rounded-md border p-6">
                        {summary.map((row) => (
                            <div key={row.label} className="flex items-start justify-between gap-4">
                                <dt className="typo-body-xl-regular text-foreground-subtle shrink-0">{row.label}</dt>
                                {/* 긴 기업·기관명도 말줄임 없이 오른쪽 칸 안에서 여러 줄로 접힌다. 이름은 띄어쓰기 없이 길어지므로
                                    낱말 단위 줄바꿈(break-keep)을 풀어 "(주)" 만 한 줄에 떨어지지 않게 하고, 넘칠 때는 끊는다. */}
                                <dd className="typo-body-xl-medium text-label-foreground m-0 min-w-0 text-right break-normal wrap-anywhere">
                                    {row.value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    {/* 체크박스는 radix 가 <button> 으로 그린다 — <label for> 만으로는 WAVE 가 이름 없는 버튼으로
                        보므로 aria-labelledby 로 글자를 이름에 직접 잇는다[5.1.1]. */}
                    <fieldset className="border-subtle-3 m-0 flex min-w-0 flex-col gap-4 rounded-lg border p-6">
                        <legend className="sr-only">출력할 항목</legend>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id={`${idPrefix}-all`}
                                checked={isAllSelected ? true : isSomeSelected ? 'indeterminate' : false}
                                onCheckedChange={(checked) => toggleAll(checked === true)}
                                aria-labelledby={`${idPrefix}-all-label`}
                            />
                            <label
                                id={`${idPrefix}-all-label`}
                                htmlFor={`${idPrefix}-all`}
                                className="typo-body-xl-bold text-label-foreground"
                            >
                                {REPORT_PRINT_ALL}
                            </label>
                        </div>
                        <Separator />
                        <ul className="flex list-none flex-col gap-4">
                            {REPORT_PRINT_SECTIONS.map((section) => {
                                const checkboxId = `${idPrefix}-${section.id}`

                                return (
                                    <li key={section.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={checkboxId}
                                            checked={selected.includes(section.id)}
                                            onCheckedChange={(checked) => toggleSection(section.id, checked === true)}
                                            aria-labelledby={`${checkboxId}-label`}
                                        />
                                        <label
                                            id={`${checkboxId}-label`}
                                            htmlFor={checkboxId}
                                            className="typo-body-xl-regular text-label-foreground"
                                        >
                                            {section.label}
                                        </label>
                                    </li>
                                )
                            })}
                        </ul>
                    </fieldset>
                </div>
                <DialogFooter className="sm:px-8">
                    <Button type="button" size="xl" disabled={!isSomeSelected} onClick={() => onPrint?.(selected)}>
                        <Printer aria-hidden="true" />
                        출력하기
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {KbigxReportPrintDialog}
export type {KbigxReportPrintDialogProps}
