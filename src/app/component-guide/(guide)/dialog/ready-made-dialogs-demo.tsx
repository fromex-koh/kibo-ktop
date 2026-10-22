'use client'

// [퍼블리싱 가이드 전용] 다이얼로그 가이드의 '완성된 모달' 데모 — 버튼을 눌러 실제 모달을 띄운다.

import {useEffect, useState} from 'react'
import {CancelConfirmDialog} from '@/components/composite/cancel-confirm-dialog'
import {ConfirmDialog, ConfirmTarget} from '@/components/composite/confirm-dialog'
import {DeleteConfirmDialog} from '@/components/composite/delete-confirm-dialog'
import {EditCancelConfirmDialog} from '@/components/composite/edit-cancel-confirm-dialog'
import {NoticeDialog} from '@/components/composite/notice-dialog'
import {ProcessingDialog} from '@/components/composite/processing-dialog'
import {SaveConfirmDialog} from '@/components/composite/save-confirm-dialog'
import {SubmitConfirmDialog} from '@/components/composite/submit-confirm-dialog'
import {Button} from '@/components/ui/button'

// 처리 중 모달은 닫기 수단이 없어(작업이 끝나야 닫힌다) 데모에서는 잠시 뒤 스스로 닫는다.
const PROCESSING_DEMO_MS = 2000

const ProcessingDemo = () => {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!isOpen) return
        const timer = window.setTimeout(() => setIsOpen(false), PROCESSING_DEMO_MS)
        return () => window.clearTimeout(timer)
    }, [isOpen])

    return (
        <>
            <Button type="button" size="md" variant="tertiary" onClick={() => setIsOpen(true)}>
                ProcessingDialog
            </Button>
            <ProcessingDialog title="환불을 처리하고 있습니다." open={isOpen} onOpenChange={setIsOpen} />
        </>
    )
}

const ReadyMadeDialogsDemo = () => (
    <div className="flex flex-wrap gap-3">
        <ConfirmDialog
            title="비밀번호 초기화"
            question={
                <>
                    <ConfirmTarget>kibo_user01</ConfirmTarget> 계정의 비밀번호를 초기화하시겠습니까?
                </>
            }
            notice="임시 비밀번호가 등록된 이메일로 발송됩니다."
        >
            <Button type="button" size="md" variant="tertiary">
                ConfirmDialog
            </Button>
        </ConfirmDialog>
        <DeleteConfirmDialog
            title="계정 삭제"
            question={
                <>
                    <ConfirmTarget>kibo_user01</ConfirmTarget> 계정을 삭제하시겠습니까?
                </>
            }
        >
            <Button type="button" size="md" variant="tertiary">
                DeleteConfirmDialog
            </Button>
        </DeleteConfirmDialog>
        <SaveConfirmDialog>
            <Button type="button" size="md" variant="tertiary">
                SaveConfirmDialog
            </Button>
        </SaveConfirmDialog>
        <EditCancelConfirmDialog>
            <Button type="button" size="md" variant="tertiary">
                EditCancelConfirmDialog
            </Button>
        </EditCancelConfirmDialog>
        <SubmitConfirmDialog>
            <Button type="button" size="md" variant="tertiary">
                SubmitConfirmDialog
            </Button>
        </SubmitConfirmDialog>
        <CancelConfirmDialog>
            <Button type="button" size="md" variant="tertiary">
                CancelConfirmDialog
            </Button>
        </CancelConfirmDialog>
        <NoticeDialog title="이용권 정지 완료" message="이용권 정지가 완료되었습니다.">
            <Button type="button" size="md" variant="tertiary">
                NoticeDialog
            </Button>
        </NoticeDialog>
        <ProcessingDemo />
    </div>
)

export {ReadyMadeDialogsDemo}
