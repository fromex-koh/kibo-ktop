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
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {cn} from '@/lib/utils'

// 안내 모달 — 알려 주기만 하고 고를 것이 없는 모달이다(Figma 의 안내 팝업 한 벌).
//
// 안내 한 덩이와 [확인] 하나뿐이라 보이는 제목과 닫기(X)를 두지 않는다 — 이어서 작성 안내
// (resume-notice-dialog)와 같은 구성이다. 제목은 화면에서 빼되 스크린리더에는 남긴다:
// 대화상자에는 이름이 있어야 한다[8.2.1].
//
// 버튼이 하나면 CTA 구획이 그 하나로 폭을 채운다(dialog.variants 의 sm:*:flex-1).

type NoticeDialogProps = {
    /** 화면에 보이지 않는 대화상자 이름 — 무엇에 대한 안내인지 적는다[8.2.1]. */
    title: string
    /** 가운데 정렬 안내 문구. 줄바꿈은 상자 폭에 맡긴다(시안도 그렇게 접힌다). */
    message: ReactNode
    /** 모달을 여는 버튼. 여는 시점을 코드가 정할 때는 넘기지 않고 open 을 쓴다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때. open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** 확인 버튼 문구. 시안은 "확인" 이다. */
    confirmLabel?: string
    /** [확인] 을 눌렀을 때. 넘기지 않으면 창만 닫힌다. */
    onConfirm?: () => void
}

const NoticeDialog = ({
    title,
    message,
    children,
    defaultOpen,
    open,
    onOpenChange,
    confirmLabel = '확인',
    onConfirm,
}: NoticeDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        <DialogContent showCloseButton={false}>
            <DialogHeader className="p-0">
                <DialogTitle className="sr-only">{title}</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogBodyClassName, 'pt-0')}>
                {/* 글자(20px Bold)는 셸의 기본 모달 설명 스타일 그대로다 — 여기서는 자리만 잡는다. */}
                <DialogDescription className="py-8 text-center">{message}</DialogDescription>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button size="xl" onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {NoticeDialog}
export type {NoticeDialogProps}
