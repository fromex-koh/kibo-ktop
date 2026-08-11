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

// 제출 전 최종 확인 모달 — 제출을 되돌릴 수 없으므로 한 번 더 묻는다
// (Figma "[신속표준모형 KTRS-FM] m_제출 전 최종 확인"). 4단계 최종 확인 화면의 [제출] 이 연다.
//
// 물음 하나와 버튼 둘뿐이라 보이는 제목과 닫기(X)를 두지 않는다 — 대표자 경력사항의 근무기간 알림,
// 로그인 안내 모달과 같은 구성이다. 제목은 화면에서 빼되 스크린리더에는 남긴다: 대화상자에는 이름이
// 있어야 한다[8.2.1].

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
        <DialogContent showCloseButton={false}>
            <DialogHeader className="p-0">
                <DialogTitle className="sr-only">제출 확인</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogBodyClassName, 'pt-0')}>
                {/* 시안의 물음은 20px Bold 가운데 정렬이다 — 안내 문장이 아니라 물음이라 본문색을 쓴다. */}
                <DialogDescription className="typo-title-l-bold text-foreground py-8 text-center">
                    {SUBMIT_QUESTION}
                </DialogDescription>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="tertiary" size="xl">
                        취소
                    </Button>
                </DialogClose>
                {/* 제출 흐름(저장 API · 완료 화면 이동)은 아직 없다 — 붙일 때 onSubmit 을 넘긴다. */}
                <Button size="xl" onClick={onSubmit}>
                    제출
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {SubmitConfirmDialog}
export type {SubmitConfirmDialogProps}
