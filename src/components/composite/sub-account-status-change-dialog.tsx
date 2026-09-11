'use client'

import type {ReactNode} from 'react'
import {ConfirmDialog, ConfirmTarget} from '@/components/composite/confirm-dialog'
import {
    SUB_ACCOUNT_STATUS,
    SUB_ACCOUNT_STATUS_PARTICLE,
    nextSubAccountStatus,
    type SubAccountItem,
} from '@/constants/sub-account'

// 하위계정 상태 변경 확인 — 공용 ConfirmDialog 에 이 화면의 문구만 얹은 조각.
// [⋮] > [사용정지로 변경](또는 [사용으로 변경])이 여는 모달이라, 물음에도 바뀔 상태를 굵게 드러낸다.
// 조사는 상태 이름의 받침에 맞춰 붙인다("사용으로"·"사용정지로") — "(으)로" 처럼 두 벌을 함께 적지 않는다.
// 되돌릴 수 있는 일이라 [확인] 은 기본(파랑)이고 덧붙임 줄은 두지 않는다(시안).

const SUB_ACCOUNT_STATUS_CHANGE_TITLE = '상태 변경'

type SubAccountStatusChangeDialogProps = {
    children?: ReactNode
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** 상태를 바꿀 계정. 없으면 물음을 만들 수 없어 모달을 그리지 않는다. */
    item?: SubAccountItem
    onConfirm?: () => void
}

const SubAccountStatusChangeDialog = ({
    children,
    defaultOpen,
    open,
    onOpenChange,
    item,
    onConfirm,
}: SubAccountStatusChangeDialogProps) => (
    <ConfirmDialog
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        title={SUB_ACCOUNT_STATUS_CHANGE_TITLE}
        onConfirm={onConfirm}
        question={
            item ? (
                <>
                    계정 <ConfirmTarget>{item.accountId}</ConfirmTarget>({item.managerName})의 상태를{' '}
                    <ConfirmTarget>{SUB_ACCOUNT_STATUS[nextSubAccountStatus(item.status)].label}</ConfirmTarget>
                    {SUB_ACCOUNT_STATUS_PARTICLE[nextSubAccountStatus(item.status)]} 변경하시겠습니까?
                </>
            ) : (
                '상태를 변경하시겠습니까?'
            )
        }
    >
        {children}
    </ConfirmDialog>
)

export {SubAccountStatusChangeDialog, SUB_ACCOUNT_STATUS_CHANGE_TITLE}
export type {SubAccountStatusChangeDialogProps}
