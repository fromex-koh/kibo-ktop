'use client'

import {Check} from 'lucide-react'
import {InlineSeparator} from '@/components/composite/inline-separator'
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
import type {PricingPlan} from '@/content/service/pricing'
import {PAYMENT_COMPLETE_TITLE, USAGE_PERIOD} from '@/content/service/pricing-payment'

// 결제 완료 — 시안 "SB-FOTA-CM4-0001_가격 정책_결제하기_결제완료"(40007578:166348).
// 결제하기의 [결제하기]가 끝나면 뜬다. 완료 아이콘 → "결제가 완료되었습니다" → 이용권 · 이용 기간 → [확인].
// 짜임은 이용권 환불 완료 모달(PaidServiceRefundCompleteDialog)과 같다 — 닫기(X) 없이 [확인]으로만 닫는다.
//
// 시안 규격: 폭 588 · 반경 24 · 위 64 · 좌우 32 · 아이콘 60 · 아이콘과 제목 16 · 제목(20 Bold)과 결과 줄 8 ·
// 결과 줄과 [확인] 56 · 아래 24. 결과 줄은 이용권(프리미엄 500건) | 기간이며 16 Medium 이다.
// 시안에서 숨긴 "상품" · "기간" 이름은 화면에 보이지 않게 두고 읽기에만 남긴다.

export type PaymentCompleteDialogProps = {
    plan: PricingPlan
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [확인]을 눌렀을 때. [프론트엔드 연동] 결제 후 이동할 화면(예: 유료 서비스 관리)을 연결한다. */
    onConfirm?: () => void
}

const PaymentCompleteDialog = ({plan, defaultOpen, open, onOpenChange, onConfirm}: PaymentCompleteDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false} className="grid-rows-none">
            <DialogHeader className="items-center gap-0 px-6 pt-16 pb-0 sm:px-8 sm:pt-16">
                {/* 완료 아이콘(시안 icon-60/완료) — 파란 원(60) 안에 흰 체크. 제목이 같은 뜻을 전하므로 꾸밈이다. */}
                <span
                    aria-hidden="true"
                    className="bg-primary text-primary-foreground flex size-15 shrink-0 items-center justify-center rounded-full"
                >
                    <Check className="size-8" strokeWidth={3} />
                </span>
                <DialogTitle className="typo-title-l-bold text-foreground mt-4 pe-0 text-center">
                    {PAYMENT_COMPLETE_TITLE}
                </DialogTitle>
                <DialogDescription asChild>
                    <p className="typo-body-xl-medium text-foreground mt-2 flex flex-wrap items-center justify-center">
                        <span>
                            <span className="sr-only">상품 </span>
                            {`${plan.name} ${plan.quota}건`}
                        </span>
                        <InlineSeparator inline className="data-vertical:self-center" />
                        <span>
                            <span className="sr-only">기간 </span>
                            {USAGE_PERIOD}
                        </span>
                    </p>
                </DialogDescription>
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

export {PaymentCompleteDialog}
