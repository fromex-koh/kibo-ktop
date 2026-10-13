'use client'

import type {ReactNode} from 'react'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'

// 제출 전 최종 확인 모달 — 최종 확인 화면의 [제출] 이 연다.
// 제목(24 Bold) + 닫기(X) → 24 → 물음(20 Bold) → 16 → 안내(16 · label-foreground) → 24 → [제출하기](폭 전체).
// 간격 · 여백(위 · 좌우 40, 아래 24)은 모달 기본 틀(theme/dialog.variants)이 그대로 맞는다.
// 취소는 닫기(X) · Esc · 바깥 누르기로 한다 — CTA 는 [제출하기] 하나다.

const SUBMIT_TITLE = '제출 전 최종 확인'
const SUBMIT_QUESTION = '최종 제출하시겠습니까?'
const SUBMIT_NOTICE =
    '입력한 내용을 최종 제출합니다. 제출 전 입력한 정보가 정확한지 다시 한번 확인해 주세요. 제출 후에는 수정이 불가합니다.'
const SUBMIT_LABEL = '제출하기'

type SubmitConfirmDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때(폼 검사를 통과한 뒤 등). open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** [제출하기] 를 눌렀을 때. 넘기지 않으면 아무 일도 하지 않는다(제출 연동 전). */
    onSubmit?: () => void
}

const SubmitConfirmDialog = ({children, defaultOpen, open, onOpenChange, onSubmit}: SubmitConfirmDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{SUBMIT_TITLE}</DialogTitle>
            </DialogHeader>
            <div className={dialogBodyClassName}>
                <div className="flex flex-col gap-4 break-keep">
                    {/* 물음은 모달 설명(DialogDescription)이다 — 20 Bold 라 <p> 로 두면 WAVE 가 "Possible heading" 으로
                        잡아 블록 span 으로 그린다(설명 연결은 그대로). */}
                    <DialogDescription asChild>
                        <span className="block">{SUBMIT_QUESTION}</span>
                    </DialogDescription>
                    <p className="typo-body-xl-regular text-label-foreground">{SUBMIT_NOTICE}</p>
                </div>
            </div>
            <DialogFooter>
                {/* 제출 API · 완료 화면 이동은 아직 없다 — 붙일 때 onSubmit 을 넘긴다. */}
                <Button type="button" size="xl" onClick={onSubmit}>
                    {SUBMIT_LABEL}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {SubmitConfirmDialog}
export type {SubmitConfirmDialogProps}
