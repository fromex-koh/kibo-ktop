'use client'

import {Dialog, DialogContent, DialogTitle} from '@/components/ui/dialog'

export type ProcessingDialogProps = {
    title: string
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

// API 요청처럼 완료 시점을 예측할 수 없는 작업에 공통으로 사용한다.
// 호출하는 화면은 open만 처리 상태와 연결하고 title에 업무 대상을 포함한 문구를 전달한다.
const ProcessingDialog = ({title, defaultOpen, open, onOpenChange}: ProcessingDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        <DialogContent
            showCloseButton={false}
            aria-describedby={undefined}
            className="grid-rows-none"
            style={{maxWidth: 588}}
            onEscapeKeyDown={(event) => event.preventDefault()}
            onPointerDownOutside={(event) => event.preventDefault()}
        >
            <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center gap-4 px-6 pt-18 pb-14 sm:px-10"
            >
                <span
                    aria-hidden="true"
                    className="relative size-15 animate-spin rounded-full bg-[conic-gradient(var(--color-primary)_0_28%,var(--color-gray-100)_28%_100%)] p-1.5"
                >
                    <span className="bg-surface block size-full rounded-full" />
                </span>
                <DialogTitle className="typo-title-l-bold text-foreground pe-0 text-center">{title}</DialogTitle>
            </div>
        </DialogContent>
    </Dialog>
)

export {ProcessingDialog}
