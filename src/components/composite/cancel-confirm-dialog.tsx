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

// 작성 취소 모달 — 평가 진행을 중단할지 되묻는다
// (Figma "[신속표준모형 KTRS-FM] m_평가진행시_이탈 시 확인"의 첫 번째 모달).
//
// 물음 하나와 버튼뿐이라 닫기(X)를 두지 않는다 — SubmitConfirmDialog 와 같은 구성이다.
// 화면에 보이는 물음이 곧 이 대화상자의 이름이다(DialogTitle) — 대화상자에는 이름이 있어야 한다[8.2.1].
//
// CTA 는 [계속작성] + [저장하고 나가기] 두 개다. 시안에는 전체폭 [닫기] 한 개로 그려져 있으나 물음에 "예"로
// 답할 버튼이 없어 중단할 방법이 없었고, 두 개로 하는 것으로 정했다(같은 시안의 이어서 작성 안내 모달과
// 같은 짝). 화면을 떠나는 쪽이 주 동작이라 오른쪽에 둔다.

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
        {/* 설명 없이 제목(물음)과 버튼뿐이라 aria-describedby 를 비운다 — 넘기지 않으면 Radix 가 설명이
            빠졌다고 경고한다. */}
        <DialogContent showCloseButton={false} aria-describedby={undefined}>
            {/* 물음은 머리 구획(첫 행)에 둔다 — CTA 는 행을 지정하지 않고 자동 배치라(dialog.variants 참고),
                머리를 빼면 CTA 가 첫 행으로 올라와 버튼이 물음 위에 놓인다.
                여백은 시안의 물음 블록(위아래 32)에 맞춘다. */}
            <DialogHeader className="px-6 py-8 sm:px-10">
                {/* 시안의 물음은 20px Bold 가운데 정렬이다 — 안내 문장이 아니라 물음이라 본문색을 쓴다.
                    이 물음이 곧 모달의 제목이라 DialogTitle(h2)로 둔다 — 크기·굵기만 제목처럼인 문단으로
                    두면 "제목처럼 보이는데 제목이 아닌 글"이 되고(WAVE "Possible heading"), 모달 이름도
                    화면에 없는 다른 말이 된다[8.2.1]. pe-0 은 닫기(X) 자리를 비우는 기본 여백을 되돌린다
                    (이 모달은 X 를 두지 않아 그 여백만큼 가운데 정렬이 틀어진다). */}
                <DialogTitle className="typo-title-l-bold text-foreground pe-0 text-center">
                    {CANCEL_QUESTION}
                </DialogTitle>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="tertiary" size="xl">
                        계속작성
                    </Button>
                </DialogClose>
                {/* 저장·이동 흐름(작성 내용 저장 · 이동할 화면)은 아직 없다 — 붙일 때 onSaveAndExit 을 넘긴다. */}
                <Button size="xl" onClick={onSaveAndExit}>
                    저장하고 나가기
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {CancelConfirmDialog}
export type {CancelConfirmDialogProps}
