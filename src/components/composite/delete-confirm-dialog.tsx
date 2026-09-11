'use client'

import type {ReactNode} from 'react'
import {ConfirmDialog} from '@/components/composite/confirm-dialog'

// 삭제 확인 모달 — 공용 ConfirmDialog 에 "지우는 일" 의 기본값(되돌릴 수 없다는 덧붙임)만 얹은 조각이다.
// 생김새·여백·글자 크기·버튼 색은 다른 확인 모달과 같다 — 그 기준은 ConfirmDialog 에 적어 두었다.
// 되돌릴 수 없다는 것은 색이 아니라 물음과 덧붙임이 말한다[5.3.1].

const DELETE_NOTICE = '삭제한 내용은 되돌릴 수 없습니다.'

type DeleteConfirmDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때. open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** 모달 제목 — 무엇을 지우는 자리인지 말한다(예: "계정 삭제"). */
    title: string
    /** 물음. 지울 대상을 굵게 드러내려면 요소째 넘긴다. */
    question: ReactNode
    /** 물음 아래 덧붙임. 기본은 되돌릴 수 없다는 알림이다. */
    notice?: ReactNode
    /** [확인] 을 눌렀을 때 — 실제로 지우는 자리다. */
    onConfirm?: () => void
}

const DeleteConfirmDialog = ({
    children,
    defaultOpen,
    open,
    onOpenChange,
    title,
    question,
    notice = DELETE_NOTICE,
    onConfirm,
}: DeleteConfirmDialogProps) => (
    <ConfirmDialog
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        question={question}
        notice={notice}
        onConfirm={onConfirm}
    >
        {children}
    </ConfirmDialog>
)

export {DeleteConfirmDialog, DELETE_NOTICE}
export type {DeleteConfirmDialogProps}
