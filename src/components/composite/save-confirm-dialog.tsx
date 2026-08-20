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

// 저장 전 최종 확인 모달 — 고친 내용을 저장할지 한 번 더 묻는다.
// 검사를 모두 통과한 뒤에만 열린다 — 걸린 칸이 있는데 이 물음을 띄우면 무엇을 저장하는지 알 수 없다.
//
// 평가 흐름의 [제출 전 최종 확인](submit-confirm-dialog)과 물음이 다르다 — 그쪽은 되돌릴 수 없는
// 제출을 묻고, 이쪽은 회원정보 덮어쓰기를 묻는다.
//
// 물음 하나와 버튼 둘뿐이라 닫기(X)를 두지 않는다. 화면에 보이는 물음이 곧 이 대화상자의 이름이다
// (DialogTitle) — 대화상자에는 이름이 있어야 한다[8.2.1].

const SAVE_QUESTION = '저장하시겠습니까?'

type SaveConfirmDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때(검사를 통과한 뒤 등). open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [저장] 을 눌렀을 때 — 저장 API 를 부르는 자리다. */
    onSave?: () => void
}

const SaveConfirmDialog = ({children, defaultOpen, open, onOpenChange, onSave}: SaveConfirmDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 설명 없이 제목(물음)과 버튼뿐이라 aria-describedby 를 비운다 — 넘기지 않으면 Radix 가 설명이
            빠졌다고 경고한다. */}
        <DialogContent showCloseButton={false} aria-describedby={undefined}>
            {/* 물음은 머리 구획(첫 행)에 둔다 — CTA 는 행을 지정하지 않고 자동 배치라, 머리를 빼면
                버튼이 물음 위로 올라온다. pe-0 은 닫기(X) 자리를 비우는 기본 여백을 되돌린다. */}
            <DialogHeader className="px-6 py-8 sm:px-10">
                <DialogTitle className="typo-title-l-bold text-foreground pe-0 text-center">
                    {SAVE_QUESTION}
                </DialogTitle>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="tertiary" size="xl">
                        취소
                    </Button>
                </DialogClose>
                <Button size="xl" onClick={onSave}>
                    저장
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {SaveConfirmDialog}
export type {SaveConfirmDialogProps}
