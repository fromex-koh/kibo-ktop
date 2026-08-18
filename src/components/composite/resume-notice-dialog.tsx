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

// 이어서 작성 안내 모달 — 자동 저장된 내용을 불러올지 묻는다
// (Figma "[신속표준모형 KTRS-FM] m_이어서 작성 안내"의 두 번째 모달).
// 앞선 첫 번째 모달("작성 중인 평가가 있습니다.")은 NoticeDialog 로 띄우고, 그 모달을 닫으면 이 모달이 이어진다.
//
// 안내 한 덩이와 버튼 둘뿐이라 보이는 제목과 닫기(X)를 두지 않는다 — SubmitConfirmDialog 와 같은 구성이다.
// 제목은 화면에서 빼되 스크린리더에는 남긴다: 대화상자에는 이름이 있어야 한다[8.2.1].

// 시안은 두 문장을 각자 한 줄에 둔다 — 한 문자열로 두면 폭에 따라 문장 중간에서 접힌다.
const RESUME_NOTICE = ['이전에 작성한 내용이 자동 저장되어 있습니다.', '저장된 내용을 불러와 이어서 진행하시겠습니까?']

type ResumeNoticeDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때(화면을 벗어나려는 순간 등). open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [새로 작성] 을 눌렀을 때. 넘기지 않으면 창만 닫힌다(저장 내용 비우기 연동 전). */
    onNew?: () => void
    /** [이어서 작성] 을 눌렀을 때. 넘기지 않으면 아무 일도 하지 않는다(저장 내용 불러오기 연동 전). */
    onResume?: () => void
}

const ResumeNoticeDialog = ({children, defaultOpen, open, onOpenChange, onNew, onResume}: ResumeNoticeDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        <DialogContent showCloseButton={false}>
            <DialogHeader className="p-0">
                <DialogTitle className="sr-only">이어서 작성 안내</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogBodyClassName, 'pt-0')}>
                {/* 시안의 안내는 20px Bold 가운데 정렬이다(두 줄). */}
                <DialogDescription className="typo-title-l-bold text-foreground py-8 text-center">
                    {RESUME_NOTICE[0]}
                    <br />
                    {RESUME_NOTICE[1]}
                </DialogDescription>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="tertiary" size="xl" onClick={onNew}>
                        새로 작성
                    </Button>
                </DialogClose>
                {/* 저장 내용 불러오기는 아직 없다 — 붙일 때 onResume 을 넘긴다. */}
                <Button size="xl" onClick={onResume}>
                    이어서 작성
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {ResumeNoticeDialog}
export type {ResumeNoticeDialogProps}
