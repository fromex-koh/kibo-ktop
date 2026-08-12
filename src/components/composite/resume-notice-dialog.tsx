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

// 이어서 작성 안내 모달 — 평가 진행 중에 화면을 벗어나려 할 때 "지금 나가도 이어서 쓸 수 있다"를 알린다
// (Figma "[신속표준모형 KTRS-FM] m_평가진행시_이탈 시 확인"의 두 번째 모달).
//
// 안내 한 문장과 버튼 둘뿐이라 보이는 제목과 닫기(X)를 두지 않는다 — SubmitConfirmDialog 와 같은 구성이다.
// 제목은 화면에서 빼되 스크린리더에는 남긴다: 대화상자에는 이름이 있어야 한다[8.2.1].

const RESUME_NOTICE = '작성한 내용은 자동 저장되며, 해당 평가모형을 다시 진행할 경우 저장된 내용이 표시됩니다.'

type ResumeNoticeDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때(화면을 벗어나려는 순간 등). open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [저장하고 나가기] 를 눌렀을 때. 넘기지 않으면 아무 일도 하지 않는다(저장·이동 연동 전). */
    onLeave?: () => void
}

const ResumeNoticeDialog = ({children, defaultOpen, open, onOpenChange, onLeave}: ResumeNoticeDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        <DialogContent showCloseButton={false}>
            <DialogHeader className="p-0">
                <DialogTitle className="sr-only">이어서 작성 안내</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogBodyClassName, 'pt-0')}>
                {/* 시안의 안내는 20px Bold 가운데 정렬이다(두 줄). */}
                <DialogDescription className="typo-title-l-bold text-foreground py-8 text-center">
                    {RESUME_NOTICE}
                </DialogDescription>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="tertiary" size="xl">
                        계속작성
                    </Button>
                </DialogClose>
                {/* 저장·이동 흐름은 아직 없다 — 붙일 때 onLeave 를 넘긴다. */}
                <Button size="xl" onClick={onLeave}>
                    저장하고 나가기
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {ResumeNoticeDialog}
export type {ResumeNoticeDialogProps}
