'use client'

import type {ReactNode} from 'react'
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

// 수정 취소 확인 모달 — 고치던 내용을 처음 값으로 되돌리기 전에 한 번 더 묻는다.
// 되돌리면 사용자가 방금 입력한 것이 사라지고 되살릴 방법이 없어, 실수로 눌렀을 때를 막는다.
//
// 평가 흐름의 [작성 취소](cancel-confirm-dialog)와는 다른 물음이다 — 그쪽은 화면을 떠날지 묻고,
// 이쪽은 화면에 남은 채 입력만 되돌릴지 묻는다.
//
// 구성은 SubmitConfirmDialog 와 같다 — 물음(제목)과 버튼뿐이라 닫기(X)를 두지 않는다.
// 화면에 보이는 물음이 곧 이 대화상자의 이름이다(DialogTitle) — 대화상자에는 이름이 있어야 한다[8.2.1].

const EDIT_CANCEL_QUESTION = '수정을 취소하시겠습니까?'
const EDIT_CANCEL_NOTICE = '변경한 내용은 저장되지 않습니다.'

type EditCancelConfirmDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때. open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [확인] 을 눌렀을 때 — 입력을 처음 값으로 되돌리는 자리다. */
    onConfirm?: () => void
}

const EditCancelConfirmDialog = ({
    children,
    defaultOpen,
    open,
    onOpenChange,
    onConfirm,
}: EditCancelConfirmDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        <DialogContent showCloseButton={false}>
            {/* 물음은 머리 구획(첫 행)에 둔다 — CTA 는 행을 지정하지 않고 자동 배치라, 머리를 빼면
                버튼이 물음 위로 올라온다. 여백은 다른 확인 모달과 같은 값이다. */}
            <DialogHeader className="gap-2 px-6 py-8 sm:px-10">
                {/* pe-0 은 닫기(X) 자리를 비우는 기본 여백을 되돌린다(이 모달은 X 를 두지 않는다). */}
                <DialogTitle className="typo-title-l-bold text-foreground pe-0 text-center">
                    {EDIT_CANCEL_QUESTION}
                </DialogTitle>
                {/* 되돌리면 무슨 일이 생기는지 — 물음만으로는 저장 여부를 알 수 없다. */}
                <DialogDescription className="typo-body-xl-regular text-foreground-subtle text-center">
                    {EDIT_CANCEL_NOTICE}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="tertiary" size="xl">
                        취소
                    </Button>
                </DialogClose>
                <Button size="xl" onClick={onConfirm}>
                    확인
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {EditCancelConfirmDialog}
export type {EditCancelConfirmDialogProps}
