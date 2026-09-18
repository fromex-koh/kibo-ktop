'use client'

// 'use client' — 다른 K-BIGx 모달과 같이 클라이언트에서 그린다(서버에서 넘긴 undefined 속성이 빠지는 문제를 피한다).

import type {ReactNode} from 'react'
import Link from 'next/link'
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
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {
    PASS_PURCHASE_GUIDE_DETAIL,
    PASS_PURCHASE_GUIDE_MESSAGE,
    PASS_PURCHASE_GUIDE_TITLE,
} from '@/content/service/k-bigx-pass-purchase-guide'
import {cn} from '@/lib/utils'

// 이용권 구매 안내 — 시안 "이용권 구매 안내"(40007590:14023).
// 보유 이용권 없이 다른 기업을 조회하려 할 때 뜬다. 안내(20 Bold) → 설명(16) → [취소] [이용권 구매하기].
//
// 시안 규격: 폭 588 · 반경 24 · 좌우·위 여백 32(판매자 정보 모달과 같다) · 제목과 안내 24 · 안내와 설명 16 ·
// 설명과 버튼 8 · 두 버튼 사이 16 · 아래 24. 좁은 화면(sm 미만)은 모든 모달이 쓰는 24 여백을 그대로 둔다.

type KbigxPassPurchaseGuideDialogProps = {
    /** [이용권 구매하기]가 향할 이용권 구매(가격정책) 화면. */
    purchaseHref: string
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
}

const KbigxPassPurchaseGuideDialog = ({purchaseHref, children, defaultOpen}: KbigxPassPurchaseGuideDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 닫기(X)는 셸이 다른 모달의 여백(40)에 맞춰 둔다 — 이 모달은 여백이 32 라 X 도 같은 값으로 옮겨
            제목 줄과 맞춘다(오른쪽·위 32). */}
        <DialogContent className="sm:[&>[data-slot=dialog-close]]:me-8 sm:[&>[data-slot=dialog-close]]:mt-8">
            <DialogHeader className="sm:px-8 sm:pt-8">
                <DialogTitle className="break-keep">{PASS_PURCHASE_GUIDE_TITLE}</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogBodyClassName, 'gap-4 break-keep sm:px-8')}>
                {/* 안내 문장은 모달 설명(DialogDescription)이다 — 20 Bold 라 <p> 로 두면 WAVE 가 "Possible heading" 으로
                    잡는다. 설명으로 이어 두면 모달이 열릴 때 제목 다음에 읽히고, 블록 span 이라 제목으로 오인되지 않는다. */}
                <DialogDescription asChild>
                    <span className="typo-title-l-bold text-foreground block">{PASS_PURCHASE_GUIDE_MESSAGE}</span>
                </DialogDescription>
                <p className="typo-body-xl-regular text-label-foreground">{PASS_PURCHASE_GUIDE_DETAIL}</p>
            </div>
            {/* 설명과 버튼 사이는 시안 8 이다(본문 아래 여백 4 + 여기 4). */}
            <DialogFooter className="pt-1 sm:px-8">
                <DialogClose asChild>
                    <Button type="button" variant="tertiary" size="xl">
                        취소
                    </Button>
                </DialogClose>
                <Button asChild size="xl">
                    <Link href={purchaseHref}>이용권 구매하기</Link>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {KbigxPassPurchaseGuideDialog}
export type {KbigxPassPurchaseGuideDialogProps}
