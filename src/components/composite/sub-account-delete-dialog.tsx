'use client'

import type {ReactNode} from 'react'
import {ConfirmTarget} from '@/components/composite/confirm-dialog'
import {DeleteConfirmDialog} from '@/components/composite/delete-confirm-dialog'
import type {SubAccountItem} from '@/constants/sub-account'

// 하위계정 삭제 확인 — 공용 DeleteConfirmDialog 에 이 화면의 문구만 얹은 조각.
// 목록과 모달 단독 화면이 같은 문구를 쓰므로 한곳에 둔다.
//
// 물음에는 계정 ID 를 굵게 드러내고 담당자 이름을 괄호로 덧붙인다 — 지점 이름은 여럿이 비슷할 수 있어
// 계정 ID 가 그 계정을 가리키는 값이다.

const SUB_ACCOUNT_DELETE_TITLE = '계정 삭제'
const SUB_ACCOUNT_DELETE_NOTICE = '삭제된 계정은 복구할 수 없습니다.'

type SubAccountDeleteDialogProps = {
    children?: ReactNode
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** 지울 계정. 없으면 물음을 만들 수 없어 모달을 그리지 않는다. */
    item?: SubAccountItem
    onConfirm?: () => void
}

const SubAccountDeleteDialog = ({
    children,
    defaultOpen,
    open,
    onOpenChange,
    item,
    onConfirm,
}: SubAccountDeleteDialogProps) => (
    <DeleteConfirmDialog
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        title={SUB_ACCOUNT_DELETE_TITLE}
        notice={SUB_ACCOUNT_DELETE_NOTICE}
        onConfirm={onConfirm}
        question={
            item ? (
                <>
                    계정 <ConfirmTarget>{item.accountId}</ConfirmTarget>({item.managerName})을(를) 삭제하시겠습니까?
                </>
            ) : (
                '삭제하시겠습니까?'
            )
        }
    >
        {children}
    </DeleteConfirmDialog>
)

export {SubAccountDeleteDialog, SUB_ACCOUNT_DELETE_TITLE, SUB_ACCOUNT_DELETE_NOTICE}
export type {SubAccountDeleteDialogProps}
