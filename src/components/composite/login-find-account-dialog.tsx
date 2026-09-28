'use client'

// 'use client' — Radix Dialog 가 열고 닫는 상태를 들고 있어 클라이언트에서 그린다.
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
import {FIND_ACCOUNT_MESSAGE, FIND_ACCOUNT_TITLE, LOGIN_DIALOG_CLOSE_LABEL} from '@/content/service/login'

// 아이디 · 비밀번호 찾기 — 기관회원 로그인에서 연다. 기관회원 계정은 담당자가 발급하므로 찾기 절차 대신
// 담당자 연락처만 알린다. 제목 아래 안내 한 줄과 풀폭 [닫기] 뿐이다.

type LoginFindAccountDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
}

const LoginFindAccountDialog = ({children, defaultOpen}: LoginFindAccountDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{FIND_ACCOUNT_TITLE}</DialogTitle>
                {/* 안내 한 줄은 모달의 설명 자리에 둔다 — 다른 확인 모달과 같은 글자(16 Regular)다.
                    굵은 20 한 줄로 두면 검사 도구가 제목으로 오인한다(WAVE '가능한 제목'). */}
                <DialogDescription className="typo-body-xl-regular text-foreground-subtle text-center break-keep">
                    {FIND_ACCOUNT_MESSAGE}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button size="xl" className="w-full">
                        {LOGIN_DIALOG_CLOSE_LABEL}
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {LoginFindAccountDialog}
export type {LoginFindAccountDialogProps}
