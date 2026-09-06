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

// 제출 전 최종 확인 모달 — 최종 확인 화면의 [제출] 이 연다.

const SUBMIT_QUESTION = '제출하시겠습니까?'

type SubmitConfirmDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때(폼 검사를 통과한 뒤 등). open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [제출] 을 눌렀을 때. 넘기지 않으면 아무 일도 하지 않는다(제출 연동 전). */
    onSubmit?: () => void
}

const SubmitConfirmDialog = ({children, defaultOpen, open, onOpenChange, onSubmit}: SubmitConfirmDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 설명 없이 물음과 버튼뿐이라 aria-describedby 를 비운다 — 넘기지 않으면 Radix 가 경고한다. */}
        <DialogContent showCloseButton={false} aria-describedby={undefined}>
            <DialogHeader className="px-6 py-8 sm:px-10 sm:pt-18">
                {/* 이 물음이 곧 모달의 이름이라 DialogTitle 로 둔다 — 문단으로 바꾸면 대화상자에 이름이 없어진다. */}
                <DialogTitle className="typo-title-l-bold text-foreground pe-0 text-center">
                    {SUBMIT_QUESTION}
                </DialogTitle>
            </DialogHeader>
            <DialogFooter className="pt-6">
                <DialogClose asChild>
                    <Button variant="tertiary" size="xl">
                        취소
                    </Button>
                </DialogClose>
                {/* 제출 API·완료 화면 이동은 아직 없다 — 붙일 때 onSubmit 을 넘긴다. */}
                <Button size="xl" onClick={onSubmit}>
                    제출
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {SubmitConfirmDialog}
export type {SubmitConfirmDialogProps}
