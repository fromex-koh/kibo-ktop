'use client'

import type {ReactNode} from 'react'
import {Icon} from '@/components/custom/icon'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    PAYMENT_UNAVAILABLE_CONTACT,
    PAYMENT_UNAVAILABLE_GUIDE,
    PAYMENT_UNAVAILABLE_MESSAGE,
    PAYMENT_UNAVAILABLE_TITLE,
} from '@/content/service/pricing-payment'

// 결제 불가 안내 — 기관회원이 가격정책의 [구매하기]를 누르면 뜬다.
// 오류 아이콘 → 안내 문구 → 문의전화 → [확인]. 결제 완료 모달(PaymentCompleteDialog)과 같은 짜임이고,
// 닫기(X) 없이 [확인]으로만 닫는다.
// 좁은 화면(360)은 좌우 여백이 24 로 줄고 문구가 폭에 맞게 접힌다. 보이는 제목이 없어 대화상자 이름은 sr-only 제목이다[8.2.1].

export type PaymentUnavailableDialogProps = {
    /** 모달을 여는 버튼(예: 가격정책의 [구매하기]). 넘기지 않으면 defaultOpen · open 으로만 연다. */
    children?: ReactNode
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [확인]을 눌렀을 때. 넘기지 않으면 모달만 닫힌다. */
    onConfirm?: () => void
}

const PaymentUnavailableDialog = ({
    children,
    defaultOpen,
    open,
    onOpenChange,
    onConfirm,
}: PaymentUnavailableDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        <DialogContent showCloseButton={false} className="grid-rows-none">
            <DialogHeader className="items-center gap-0 px-6 pt-16 pb-0 sm:px-8 sm:pt-16">
                <Icon
                    variant="solid"
                    symbol="alert"
                    symbolClassName="typo-display-m-bold"
                    className="bg-icon-solid-error size-15"
                />
                <DialogTitle className="sr-only">{PAYMENT_UNAVAILABLE_TITLE}</DialogTitle>
                {/* 큰 Bold 글자를 <p> 로 두면 WAVE 가 "Possible heading" 으로 잡아 블록 span 으로 그린다(설명 연결은 그대로). */}
                <DialogDescription asChild>
                    <span className="typo-title-l-bold text-foreground mt-4 block text-center break-keep">
                        {PAYMENT_UNAVAILABLE_MESSAGE}
                        <br className="max-sm:hidden" /> {PAYMENT_UNAVAILABLE_GUIDE}
                    </span>
                </DialogDescription>
                <p className="typo-body-xl-medium text-foreground mt-2 text-center">{PAYMENT_UNAVAILABLE_CONTACT}</p>
            </DialogHeader>
            <DialogFooter className="px-6 pt-14 pb-6 sm:px-8">
                <DialogClose asChild>
                    <Button type="button" size="xl" className="w-full" onClick={onConfirm}>
                        확인
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {PaymentUnavailableDialog}
