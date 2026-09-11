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

// 확인 모달 — 되돌리기 어렵거나 남에게 영향이 가는 일을 하기 전에 한 번 더 묻는다.
// 삭제·비밀번호 초기화·상태 변경처럼 "물어보고 실행하는" 자리는 전부 이 하나를 쓴다.
//
// 생김새는 이미 프로젝트에 있던 확인 모달(EditCancelConfirmDialog · /corp/mypage/profile/cancel-confirm)에서
// 가져왔다 — 닫기(X) 없음 · 가운데 정렬 · 머리 여백(위 40 · 아래 32 · 좌우 24, sm 이상 40) · 줄 사이 8 ·
// 굵은 첫 줄(20) + 옅은 물음(16) + 같은 크기의 덧붙임(16) · [취소](tertiary)/[확인] 두 칸.
// 확인 모달끼리 같은 자리에서 같은 모양으로 떠야 사용자가 매번 새로 읽지 않는다.
//
// 첫 줄은 물음이 아니라 무슨 일인지를 말한다(예: "계정 삭제"·"비밀번호 초기화"). 물음은 그 아래 와서
// 대상(계정 ID 등)을 굵게 드러낸다 — 목록에서 여러 건을 다룰 때 엉뚱한 것을 고르지 않기 위해서다.
// 그 첫 줄이 곧 이 대화상자의 이름이다(DialogTitle) — 대화상자에는 이름이 있어야 한다[8.2.1].
//
// [확인] 은 지우는 일까지 포함해 늘 기본(파랑)이다 — 되돌릴 수 없다는 것은 색이 아니라 물음과 덧붙임이
// 말한다[5.3.1]. 확인 모달마다 버튼 색이 달라지면 같은 자리에 같은 모양으로 뜨는 이점이 사라진다.

type ConfirmDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때. open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** 모달 제목 — 무슨 일을 하는 자리인지 말한다(예: "계정 삭제"). */
    title: string
    /** 물음. 대상을 굵게 드러내려면 요소째 넘긴다. */
    question: ReactNode
    /** 물음 아래 덧붙임. 없으면 줄 자체가 생기지 않는다. */
    notice?: ReactNode
    /** [확인] 을 눌렀을 때 — 실제로 그 일을 하는 자리다. */
    onConfirm?: () => void
}

const ConfirmDialog = ({
    children,
    defaultOpen,
    open,
    onOpenChange,
    title,
    question,
    notice,
    onConfirm,
}: ConfirmDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        <DialogContent showCloseButton={false}>
            {/* 물음은 머리 구획(첫 행)에 둔다 — CTA 는 행을 지정하지 않고 자동 배치라, 머리를 빼면
                버튼이 물음 위로 올라온다. */}
            <DialogHeader className="gap-2 px-6 py-8 sm:px-10">
                {/* pe-0 은 닫기(X) 자리를 비우는 기본 여백을 되돌린다(이 모달은 X 를 두지 않는다). */}
                <DialogTitle className="typo-title-l-bold text-foreground pe-0 text-center">{title}</DialogTitle>
                <DialogDescription className="typo-body-xl-regular text-foreground-subtle text-center">
                    {question}
                </DialogDescription>
                {/* 그 일을 하면 무슨 일이 생기는지 — 물음만으로는 알 수 없는 것(되돌릴 수 없음·임시 비밀번호가
                    가는 곳 등)이 여기 온다. 물음과 같은 크기다 — 읽고 판단해야 하는 말이라 작게 두지 않는다. */}
                {notice ? <p className="typo-body-xl-regular text-foreground-subtle text-center">{notice}</p> : null}
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="tertiary" size="xl">
                        취소
                    </Button>
                </DialogClose>
                <Button type="button" size="xl" onClick={onConfirm}>
                    확인
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

/** 물음 안에서 무엇을 다루는지 굵게 드러내는 조각 — 확인 모달들이 같은 굵기·색을 쓴다. */
const ConfirmTarget = ({children}: {children: ReactNode}) => (
    <strong className="typo-body-xl-bold text-foreground">{children}</strong>
)

/** 덧붙임 줄 안에서 드러낼 값 — 물음의 강조와 같은 크기·굵기·색이다. */
const ConfirmNoticeTarget = ({children}: {children: ReactNode}) => (
    <strong className="typo-body-xl-bold text-foreground">{children}</strong>
)

export {ConfirmDialog, ConfirmTarget, ConfirmNoticeTarget}
export type {ConfirmDialogProps}
