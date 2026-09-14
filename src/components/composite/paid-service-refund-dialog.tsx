'use client'

import {useEffect, useRef, useState, type ReactNode} from 'react'
import {PaidServiceRefundCompleteDialog} from '@/components/composite/paid-service-refund-complete-dialog'
import {ProcessingDialog} from '@/components/composite/processing-dialog'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

export type PaidServiceRefundDialogProps = {
    children?: ReactNode
    grade: string
    defaultOpen?: boolean
    onConfirm?: () => void | Promise<unknown>
    onCompleteConfirm?: () => void
    processingTitle?: string
    previewProcessingDuration?: number
}

const PaidServiceRefundDialog = ({
    children,
    grade,
    defaultOpen,
    onConfirm,
    onCompleteConfirm,
    processingTitle = '이용권 환불 진행중입니다.',
    previewProcessingDuration = 1200,
}: PaidServiceRefundDialogProps) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(
        () => () => {
            if (previewTimerRef.current) clearTimeout(previewTimerRef.current)
        },
        [],
    )

    const showComplete = () => {
        setIsProcessing(false)
        setIsComplete(true)
    }

    const confirmRefund = () => {
        setIsProcessing(true)
        const result = onConfirm?.()

        // 실제 API 함수가 Promise를 반환하면 요청 중에만 처리 모달을 유지한다.
        // 성공하면 완료 모달로 전환하고, 실패하면 완료로 오인하지 않도록 진행중 모달만 닫는다.
        if (result instanceof Promise) {
            void result.then(showComplete, () => setIsProcessing(false))

            return
        }

        // 목업 화면은 API가 없으므로 짧은 처리 시간을 재현해 연쇄 모달을 확인한다.
        previewTimerRef.current = setTimeout(showComplete, previewProcessingDuration)
    }

    return (
        <>
            <Dialog defaultOpen={defaultOpen}>
                {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
                <DialogContent showCloseButton={false} aria-describedby={undefined}>
                    <DialogHeader className="px-6 py-8 sm:px-10 sm:pt-18">
                        <DialogTitle className="typo-title-l-bold text-foreground pe-0 text-center">
                            {grade} 이용권을 환불하시겠습니까?
                        </DialogTitle>
                    </DialogHeader>
                    <DialogFooter className="pt-6">
                        <DialogClose asChild>
                            <Button type="button" variant="tertiary" size="xl">
                                취소
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="button" size="xl" onClick={confirmRefund}>
                                환불하기
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <ProcessingDialog title={processingTitle} open={isProcessing} onOpenChange={setIsProcessing} />
            <PaidServiceRefundCompleteDialog
                open={isComplete}
                onOpenChange={setIsComplete}
                onConfirm={onCompleteConfirm}
            />
        </>
    )
}

export {PaidServiceRefundDialog}
