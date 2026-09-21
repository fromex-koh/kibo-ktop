'use client'

// 'use client' — 서버 컴포넌트로 두면 DialogContent 에 넘긴 aria-describedby={undefined} 가 서버→클라이언트
// 전달 중에 빠져 Radix 가 없는 설명 id 를 붙인다(WAVE "Broken ARIA reference"). 클라이언트에서 그려 값을 지킨다.
import type {ReactNode} from 'react'
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
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {SELLER_INFO} from '@/content/service/pricing-payment'
import {cn} from '@/lib/utils'

// 판매자 정보 — 시안 "SB-FOTA-CM4-0001_가격 정책_결제하기_판매자정보"(40007578:166316).
// 결제하기의 [판매자 정보]가 연다. 테두리 상자 안에 항목명(왼쪽)·값(오른쪽)이 줄지어 서고, 아래에 [닫기].
//
// 시안 규격: 폭 588(max-w-modal) · 반경 24 · 좌우·위 여백 32(다른 모달의 40 보다 좁다) · 제목과 상자 24 ·
// 상자(테두리 gray.100 · 반경 12 · 여백 24 · 줄 사이 12) · 상자와 [닫기] 24 · 아래 여백 24.
// 좁은 화면(sm 미만)은 모든 모달이 쓰는 24 여백을 그대로 둔다.

type SellerInfoDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
}

const SellerInfoDialog = ({children, defaultOpen}: SellerInfoDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 닫기(X)는 셸이 다른 모달의 여백(40)에 맞춰 둔다 — 이 모달은 여백이 32 라 X 도 같은 값으로 옮겨
            제목 줄과 맞춘다(오른쪽·위 32). */}
        <DialogContent
            aria-describedby={undefined}
            className="sm:[&>[data-slot=dialog-close]]:me-8 sm:[&>[data-slot=dialog-close]]:mt-8"
        >
            <DialogHeader className="sm:px-8 sm:pt-8">
                <DialogTitle>판매자 정보</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogBodyClassName, 'sm:px-8')}>
                <dl className="border-subtle-3 flex flex-col gap-3 rounded-md border p-6">
                    {SELLER_INFO.map((row) => (
                        <div key={row.label} className="flex items-start justify-between gap-4">
                            <dt className="typo-body-xl-regular text-foreground-subtle shrink-0 break-keep">
                                {row.label}
                            </dt>
                            <dd className="typo-body-xl-medium text-label-foreground m-0 min-w-0 text-right break-keep">
                                {row.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
            <DialogFooter className="sm:px-8">
                <DialogClose asChild>
                    <Button type="button" variant="tertiary" size="xl">
                        닫기
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {SellerInfoDialog}
export type {SellerInfoDialogProps}
