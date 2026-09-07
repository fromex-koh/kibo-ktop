'use client'

import {useRef, useState, type ReactNode, type SubmitEvent} from 'react'
import {Field} from '@/components/composite/form-fields'
import {SummaryList, SummaryListItem} from '@/components/composite/summary-list'
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
import {Input} from '@/components/ui/input'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {cn} from '@/lib/utils'

// 본인 확인 모달 — 마이페이지 내 정보에 들어갈 때 비밀번호로 한 번 더 확인한다.
// 가입 정보(기업명·아이디)는 읽기만 하는 값이라 SummaryList 로 두고, 입력은 비밀번호 한 칸이다.
//
// [프론트엔드 연동] 아래 검사(비밀번호 입력 여부)는 그대로 두고 onSubmit 에 인증 API 를 붙이면 된다.
// 서버가 "비밀번호가 일치하지 않습니다" 같은 답을 주면 error 상태에 넣어 같은 자리에 띄우면 된다.

const PASSWORD_FIELD = 'identity-verification-password'
const PASSWORD_ERROR_ID = `${PASSWORD_FIELD}-error`
// 화면 하단 [확인] 은 폼 바깥(CTA 구획)에 있어 form 속성으로 잇는다 — Enter 로도 같은 검사를 거친다.
const FORM_ID = 'identity-verification-form'
const EMPTY_PASSWORD_MESSAGE = '비밀번호를 입력해 주세요.'

type IdentityVerificationItem = {
    /** 왼쪽 이름. 기업은 "기업명", 기관은 "기관명" 처럼 화면이 정한다. */
    term: string
    value: ReactNode
}

type IdentityVerificationDialogProps = {
    /** 확인용으로 보여 줄 가입 정보(기업명·아이디 등). */
    items: readonly IdentityVerificationItem[]
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때. open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** 검사를 통과했을 때. 넘기지 않으면 아무 일도 하지 않는다(인증 연동 전). */
    onSubmit?: (password: string) => void
}

const IdentityVerificationDialog = ({
    items,
    children,
    defaultOpen,
    open,
    onOpenChange,
    onSubmit,
}: IdentityVerificationDialogProps) => {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!password.trim()) {
            // 못 누르는 버튼 대신 눌러 보고 알려 준다 — 왜 안 되는지 메시지로 남고 그 칸으로 옮겨 준다[7.4.2].
            setError(EMPTY_PASSWORD_MESSAGE)
            inputRef.current?.focus()

            return
        }
        setError('')
        onSubmit?.(password)
    }

    return (
        <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>본인 확인</DialogTitle>
                </DialogHeader>
                <form id={FORM_ID} onSubmit={handleSubmit} className={cn(dialogBodyClassName, 'gap-6')} noValidate>
                    <DialogDescription asChild>
                        <span className="block">본인인증을 위하여 비밀번호를 입력해 주시기 바랍니다.</span>
                    </DialogDescription>
                    <SummaryList>
                        {items.map((item) => (
                            <SummaryListItem
                                key={item.term}
                                term={item.term}
                                // 좁은 화면에서는 이름과 값을 위아래로 둔다 — 한 줄에 두면 값이 긴 기업명은
                                // 이름 칸까지 밀어 "기업 / 명" 처럼 낱말이 갈라진다.
                                className="max-sm:flex-col max-sm:items-start max-sm:gap-1 max-sm:[&>dd]:text-left"
                            >
                                {item.value}
                            </SummaryListItem>
                        ))}
                    </SummaryList>
                    {/* 라벨·간격·오류 메시지는 다른 입력 화면과 같은 Field 가 그린다 — 메시지 자리와 색,
                        입력 아래 간격이 그 화면들과 똑같아진다. */}
                    <Field id={PASSWORD_FIELD} label="비밀번호" required error={error || undefined}>
                        {/* 이미 쓰고 있는 비밀번호를 다시 확인받는 자리라 autoComplete 는 current-password 다. */}
                        <Input
                            ref={inputRef}
                            id={PASSWORD_FIELD}
                            name={PASSWORD_FIELD}
                            type="password"
                            autoComplete="current-password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value)
                                setError('')
                            }}
                            aria-invalid={error ? true : undefined}
                            aria-describedby={error ? PASSWORD_ERROR_ID : undefined}
                        />
                    </Field>
                </form>
                <DialogFooter>
                    <Button type="submit" form={FORM_ID} size="xl">
                        확인
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {IdentityVerificationDialog}
export type {IdentityVerificationDialogProps, IdentityVerificationItem}
