'use client'

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

// 작성 취소 모달 — 평가 진행을 중단할지 되묻는다. 체크리스트·기업정보 작성 화면에서 벗어날 때 연다.
//
// CTA 는 [계속작성] + [저장하고 나가기] 두 개다. 시안에는 전체폭 [닫기] 한 개로 그려져 있으나 물음에 "예"로
// 답할 버튼이 없어 중단할 방법이 없어서 두 개로 정했다 — 시안대로 되돌리지 않는다.

const CANCEL_QUESTION = '평가 진행을 중단하시겠습니까?'

type CancelConfirmDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때. open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [저장하고 나가기] 를 눌렀을 때. 넘기지 않으면 아무 일도 하지 않는다(저장·이동 흐름 연동 전). */
    onSaveAndExit?: () => void
}

const CancelConfirmDialog = ({children, defaultOpen, open, onOpenChange, onSaveAndExit}: CancelConfirmDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 설명 없이 물음과 버튼뿐이라 aria-describedby 를 비운다 — 넘기지 않으면 Radix 가 경고한다. */}
        <DialogContent showCloseButton={false} aria-describedby={undefined}>
            <DialogHeader className="px-6 py-8 sm:px-10 sm:pt-18">
                {/* 이 물음이 곧 모달의 이름이라 DialogTitle 로 둔다 — 문단으로 바꾸면 대화상자에 이름이 없어진다. */}
                <DialogTitle className="typo-title-l-bold text-foreground pe-0 text-center">
                    {CANCEL_QUESTION}
                </DialogTitle>
            </DialogHeader>
            <DialogFooter className="pt-6">
                <DialogClose asChild>
                    <Button variant="tertiary" size="xl">
                        계속작성
                    </Button>
                </DialogClose>
                {/* 저장 API·이동할 화면은 아직 없다 — 붙일 때 onSaveAndExit 을 넘긴다. */}
                <Button size="xl" onClick={onSaveAndExit}>
                    저장하고 나가기
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {CancelConfirmDialog}
export type {CancelConfirmDialogProps}
