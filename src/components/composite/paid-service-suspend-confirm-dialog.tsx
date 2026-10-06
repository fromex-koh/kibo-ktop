'use client'

import {InfoRow, PeriodText} from '@/components/composite/paid-service-suspend-info'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {dialogInfoBodyClassName} from '@/components/theme/dialog.variants'
import {
    SUSPEND_APPLY_TITLE,
    SUSPEND_CHANGE_TITLE,
    SUSPEND_CONFIRM,
    type PaidServiceSuspendSummary,
} from '@/content/service/paid-service-suspend'
import {cn} from '@/lib/utils'

// 이용중지 신청·변경 확인 팝업 — 흐름은 PaidServiceSuspendDialog 주석 참고. 신청 · 변경은 mode 로 제목 · 문구만 다르다.
// 적용 결과(기간 · 재개일 · 변경된 이용기간)를 보여 주고, [확인] 은 onConfirm 을 부른다.

type PaidServiceSuspendConfirmDialogProps = {
    mode: 'apply' | 'change'
    summary: PaidServiceSuspendSummary
    /** 트리거 없이 열어 둔다(팝업 단독 화면). */
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [확인] 을 눌렀을 때. [프론트엔드 연동] 이용중지 신청·변경 요청을 연결한다. */
    onConfirm?: () => void
}

const PaidServiceSuspendConfirmDialog = ({
    mode,
    summary,
    defaultOpen,
    open,
    onOpenChange,
    onConfirm,
}: PaidServiceSuspendConfirmDialogProps) => {
    const confirm = SUSPEND_CONFIRM[mode]

    return (
        <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === 'apply' ? SUSPEND_APPLY_TITLE : SUSPEND_CHANGE_TITLE}</DialogTitle>
                </DialogHeader>
                <div className={cn(dialogInfoBodyClassName, 'gap-6 break-keep')}>
                    <div className="flex flex-col gap-4">
                        {/* 20px Bold 질문은 모달 설명이다 — <p> 로 두면 WAVE 가 "Possible heading" 으로 잡는다. */}
                        <DialogDescription asChild>
                            <span className="block">{confirm.question}</span>
                        </DialogDescription>
                        <div className="typo-body-xl-regular text-label-foreground flex flex-col">
                            {confirm.lines.map((line) => (
                                <p key={line}>{line}</p>
                            ))}
                        </div>
                    </div>
                    <dl className="border-subtle-3 flex flex-col gap-3 rounded-md border p-6">
                        {/* 좁은 화면에서는 세 행 모두 항목명 아래로 쌓는다 — 한 행만 옆에 두면 줄이 들쭉날쭉해 보인다. */}
                        <InfoRow term="이용중지 기간" isStacked>
                            <PeriodText
                                startDate={summary.startDate}
                                endDate={summary.endDate}
                                suffix={`(${summary.days}일)`}
                            />
                        </InfoRow>
                        <InfoRow term="이용 재개일" isStacked>
                            <span className="whitespace-nowrap">{summary.resumeDate}</span>
                        </InfoRow>
                        <InfoRow term="변경된 이용기간" isStacked>
                            <PeriodText startDate={summary.resumeDate} endDate={summary.expiresAt} />
                        </InfoRow>
                    </dl>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="tertiary" size="xl">
                            취소
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button" size="xl" onClick={onConfirm}>
                            확인
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {PaidServiceSuspendConfirmDialog}
export type {PaidServiceSuspendConfirmDialogProps}
