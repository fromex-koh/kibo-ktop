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

// 작성 종료 모달 — 체크리스트 · 기업정보 입력 화면에서 벗어나려 할 때 연다.
// 제목(24 Bold) + 닫기(X) → 24 → 물음(20 Bold) → 16 → 안내(16 · label-foreground) → 24 → [계속 작성] [저장 후 나가기].
// 간격 · 여백(위 · 좌우 40, 아래 24)은 모달 기본 틀(theme/dialog.variants)이 그대로 맞는다.
// 제출 전 최종 확인 모달(SubmitConfirmDialog)과 같은 짜임이다.

const EXIT_TITLE = '작성 종료'
const EXIT_QUESTION = '입력 화면을 나가시겠습니까?'
const EXIT_NOTICE =
    '현재까지 작성한 내용은 자동으로 저장되었습니다. 입력 화면을 나가도 나중에 이어서 작성할 수 있습니다.'

type CancelConfirmDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때. open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [저장 후 나가기] 를 눌렀을 때. 넘기지 않으면 아무 일도 하지 않는다(저장 · 이동 흐름 연동 전). */
    onSaveAndExit?: () => void
}

const CancelConfirmDialog = ({children, defaultOpen, open, onOpenChange, onSaveAndExit}: CancelConfirmDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{EXIT_TITLE}</DialogTitle>
            </DialogHeader>
            <div className={dialogBodyClassName}>
                <div className="flex flex-col gap-4 break-keep">
                    {/* 물음은 모달 설명(DialogDescription)이다 — 20 Bold 라 <p> 로 두면 WAVE 가 "Possible heading" 으로
                        잡아 블록 span 으로 그린다(설명 연결은 그대로). */}
                    <DialogDescription asChild>
                        <span className="block">{EXIT_QUESTION}</span>
                    </DialogDescription>
                    <p className="typo-body-xl-regular text-label-foreground">{EXIT_NOTICE}</p>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="tertiary" size="xl">
                        계속 작성
                    </Button>
                </DialogClose>
                {/* 저장 API · 이동할 화면은 아직 없다 — 붙일 때 onSaveAndExit 을 넘긴다. */}
                <Button type="button" size="xl" onClick={onSaveAndExit}>
                    저장 후 나가기
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {CancelConfirmDialog}
export type {CancelConfirmDialogProps}
