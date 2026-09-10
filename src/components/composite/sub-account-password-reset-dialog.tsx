'use client'

import type {ReactNode} from 'react'
import {ConfirmDialog, ConfirmNoticeTarget, ConfirmTarget} from '@/components/composite/confirm-dialog'
import type {SubAccountItem} from '@/constants/sub-account'

// 하위계정 비밀번호 초기화 확인 — 공용 ConfirmDialog 에 이 화면의 문구만 얹은 조각.
// 목록과 모달 단독 화면이 같은 문구를 쓰므로 한곳에 둔다.
//
// 지우는 일이 아니라 되돌릴 수 있는 일이라 [확인] 은 기본(파랑)이다. 다만 누른 뒤에 임시 비밀번호가
// 어디로 가는지는 물음만으로 알 수 없어, 받을 이메일 주소를 덧붙임 줄에 그대로 드러낸다.

const SUB_ACCOUNT_PASSWORD_RESET_TITLE = '비밀번호 초기화'

type SubAccountPasswordResetDialogProps = {
    children?: ReactNode
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** 초기화할 계정. 없으면 물음을 만들 수 없어 모달을 그리지 않는다. */
    item?: SubAccountItem
    onConfirm?: () => void
}

const SubAccountPasswordResetDialog = ({
    children,
    defaultOpen,
    open,
    onOpenChange,
    item,
    onConfirm,
}: SubAccountPasswordResetDialogProps) => (
    <ConfirmDialog
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        title={SUB_ACCOUNT_PASSWORD_RESET_TITLE}
        onConfirm={onConfirm}
        question={
            item ? (
                <>
                    계정 <ConfirmTarget>{item.accountId}</ConfirmTarget>({item.managerName})의 비밀번호를
                    초기화하시겠습니까?
                </>
            ) : (
                '비밀번호를 초기화하시겠습니까?'
            )
        }
        notice={
            item ? (
                <>
                    초기화 후 임시 비밀번호가 등록된 이메일(<ConfirmNoticeTarget>{item.email}</ConfirmNoticeTarget>)로
                    발송됩니다.
                </>
            ) : undefined
        }
    >
        {children}
    </ConfirmDialog>
)

export {SubAccountPasswordResetDialog, SUB_ACCOUNT_PASSWORD_RESET_TITLE}
export type {SubAccountPasswordResetDialogProps}
