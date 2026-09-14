'use client'

import {Button} from '@/components/ui/button'
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'

export type PaidServiceRefundCompleteDialogProps = {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onConfirm?: () => void
}

const PaidServiceRefundCompleteDialog = ({
    defaultOpen,
    open,
    onOpenChange,
    onConfirm,
}: PaidServiceRefundCompleteDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        <DialogContent
            showCloseButton={false}
            aria-describedby={undefined}
            className="grid-rows-none"
            style={{maxWidth: 588}}
        >
            <DialogHeader className="items-center px-6 pt-18 pb-8 sm:px-10">
                <DialogTitle className="typo-title-l-bold text-foreground pe-0 text-center">
                    이용권 환불 처리가 완료되었습니다.
                    <br aria-hidden="true" />
                    화면을 새로고침하여 주세요.
                </DialogTitle>
            </DialogHeader>
            <DialogFooter className="px-6 pt-6 pb-6 sm:px-10">
                <DialogClose asChild>
                    <Button type="button" size="xl" className="w-full" onClick={onConfirm}>
                        확인
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {PaidServiceRefundCompleteDialog}
