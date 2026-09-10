'use client'

import {useEffect, useRef, useState, type ReactNode, type SubmitEvent} from 'react'
import {Field, LookupField} from '@/components/composite/form-fields'
import {useFormTabsSubmit} from '@/components/composite/form-tabs-submit'
import {
    FormValuesProvider,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
    useFieldValue,
    useFormValues,
} from '@/components/composite/form-values'
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
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {SUB_ACCOUNT_STATUS_FILTERS} from '@/constants/sub-account'
import {cn} from '@/lib/utils'

// 하위 계정 등록 — Figma "마이페이지_하위계정 현황_하위계정 등록".
// 목록 위의 [하위계정 등록] 이 여는 모달이고, 계정 ID·비밀번호·담당자 이름·구분/소속·상태·메모를 받는다.
//
// 입력 칸은 시안 순서 그대로 위에서 아래로 한 칸씩 쌓인다(칸 사이 16). 계정 ID 만 오른쪽에 [중복확인] 이
// 붙어 한 줄을 나눠 쓴다 — 그 짜임은 공용 LookupField 가 들고 있다.
//
// 검사·메시지 표시·걸린 칸으로 이동은 다른 폼 화면과 같은 관문(useFormTabsSubmit)이 맡는다 — 오류 문구의
// 말투가 화면마다 달라지지 않는다("담당자 이름을 입력해 주세요."). 기준은 화면에 적어 둔 required·pattern 이다.
// 계정 ID 의 중복확인만 화면 밖(서버)에서 판가름나는 조건이라 이 컴포넌트가 따로 본다.
//
// 시안의 메모 라벨에는 필수 표시(*)가 남아 있지만 안내 글이 "메모 입력 (선택)" 이라 선택 입력으로 둔다 —
// 컴포넌트 기본값이 지워지지 않은 것으로 본다. 실제 정책이 필수라면 required 만 켜면 된다.

const FORM_ID = 'sub-account-create-form'
// 이 모달은 탭이 없다 — 공통 관문이 요구하는 이름만 채운다.
const FORM_SECTION = 'sub-account-create'

const FIELD = {
    accountId: 'sub-account-create-account-id',
    password: 'sub-account-create-password',
    managerName: 'sub-account-create-manager',
    organization: 'sub-account-create-organization',
    status: 'sub-account-create-status',
    memo: 'sub-account-create-memo',
} as const

// 상태 칸의 처음 값 — 새로 만드는 계정은 바로 쓰는 계정이라 "사용" 이다(시안).
const DEFAULT_STATUS = 'active'

// 비밀번호 규칙은 시안의 안내 글("8자 이상 입력")이 곧 기준이다. 자릿수가 덜 채워진 채 제출되는 것은
// pattern 이 막고, 그때 띄울 문구는 data-pattern-message 로 함께 준다 — 브라우저 기본 문구는
// "요청한 형식과 일치시키세요" 라 무엇을 고쳐야 하는지 알 수 없다[7.4.2].
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_PATTERN = `.{${PASSWORD_MIN_LENGTH},}`
const PASSWORD_MESSAGE = `비밀번호를 ${PASSWORD_MIN_LENGTH}자 이상 입력해 주세요.`

// 계정 ID 규칙 — 로그인에 쓰는 값이라 영문으로 시작하고 숫자·밑줄만 섞을 수 있다(4~20자).
// 형식은 pattern 이 막고(칸을 벗어날 때·제출할 때), 그때 띄울 문구는 data-pattern-message 로 함께 준다.
const ACCOUNT_ID_PATTERN = '[A-Za-z][A-Za-z0-9_]{3,19}'
const ACCOUNT_ID_MESSAGE = '영문으로 시작하는 4~20자, 숫자·_ 허용'

// 중복확인은 서버가 판가름하는 조건이라 required 로는 막을 수 없다 — 확인 전에는 제출을 세운다.
const DUPLICATE_CHECK_MESSAGE = '계정 ID 중복확인을 해 주세요.'
const DUPLICATE_CHECK_OK_MESSAGE = '사용할 수 있는 계정 ID 입니다.'
const DUPLICATE_CHECK_PENDING_LABEL = '확인 중'
// 목업이 서버를 흉내 내는 시간 — 실제 API 를 붙이면 이 지연은 사라진다.
const DUPLICATE_CHECK_MOCK_DELAY = 800

type SubAccountCreateDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** [저장하기] 가 검사를 모두 통과했을 때 — 등록 API 를 붙이는 자리다. */
    onSubmit?: (values: Record<string, string>) => void
}

// 본문 + CTA — 검사 관문과 값 보관소는 FormValuesProvider 안에서만 쓸 수 있어 따로 둔다.
// 조각(본문·CTA)은 Dialog 셸의 grid 행이라 여기서 감싸지 않고 조각 그대로 돌려준다.
const SubAccountCreateBody = ({onValid}: {onValid: (values: Record<string, string>) => void}) => {
    const {handleSubmit} = useFormTabsSubmit({defaultTab: FORM_SECTION})
    const {setFieldError, clearFieldError} = useFormValues()
    // 지금 칸에 적힌 계정 ID — 중복확인을 마친 값과 견줘, 확인한 뒤에 ID 를 고치면 다시 확인하게 한다.
    const accountId = useFieldValue('accountId')?.value ?? ''
    // 중복확인을 통과한 계정 ID. 아직 확인하지 않았으면 비어 있다.
    const [checkedAccountId, setCheckedAccountId] = useState('')
    // 서버에 물어보는 중 — 버튼이 돌아가는 표시로 바뀐다.
    const [isChecking, setIsChecking] = useState(false)
    const isAccountIdChecked = Boolean(accountId) && accountId === checkedAccountId

    // 답을 기다리는 동안 모달이 닫힐 수 있어, 남은 기다림은 사라질 때 거둔다.
    const checkTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
    useEffect(() => () => clearTimeout(checkTimerRef.current), [])

    // [중복확인] — 빈 칸이거나 형식이 어긋나면 무엇부터 고쳐야 하는지 그 칸에 알리고, 값이 성하면 서버에 묻는다.
    // [프론트엔드 연동] 아래 setTimeout 자리를 계정 ID 중복 확인 API 로 바꾸고, 이미 있는 ID 면
    // setFieldError 로 알린다(성공했을 때만 setCheckedAccountId).
    const handleDuplicateCheck = () => {
        const control = document.getElementById(FIELD.accountId)
        if (!accountId) {
            setFieldError(FIELD.accountId, '계정 ID를 입력해 주세요.')
            control?.focus()

            return
        }
        if (control instanceof HTMLInputElement && !control.validity.valid) {
            setFieldError(FIELD.accountId, ACCOUNT_ID_MESSAGE)
            control.focus()

            return
        }

        console.log('[하위 계정 등록] 계정 ID 중복확인', accountId)
        clearFieldError(FIELD.accountId)
        setIsChecking(true)
        checkTimerRef.current = setTimeout(() => {
            setIsChecking(false)
            setCheckedAccountId(accountId)
        }, DUPLICATE_CHECK_MOCK_DELAY)
    }

    // required·pattern 검사를 먼저 돌리고, 통과했더라도 중복확인 전이면 그 칸에 메시지를 남긴다.
    // 관문이 메시지를 통째로 갈아끼운 뒤에 더해야 지워지지 않는다.
    const handleFormSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        const isReady = isAccountIdChecked && !isChecking
        const passed = handleSubmit(event, isReady ? onValid : () => undefined)
        if (isReady) return

        // 계정 ID 자체가 비었거나 형식이 어긋났으면 그 문구가 먼저다 — 고칠 것이 남았는데 중복확인부터
        // 하라고 하면 눌러도 같은 자리에 머문다.
        const control = document.getElementById(FIELD.accountId)
        if (control instanceof HTMLInputElement && !control.validity.valid) return

        setFieldError(FIELD.accountId, DUPLICATE_CHECK_MESSAGE)
        // 다른 칸이 걸렸으면 관문이 이미 그 칸으로 옮겨 놓았다 — 남은 문제가 이것뿐일 때만 여기로 부른다.
        if (passed) control?.focus()
    }

    return (
        <>
            <div className={cn(dialogBodyClassName, 'gap-4')}>
                {/* 브라우저 기본 말풍선 대신 각 칸 밑에 문구를 띄운다 — 어느 칸을 어떻게 고칠지가
                    화면에 남는다[7.4.2]. CTA 는 폼 바깥(CTA 구획)에 있어 form 속성으로 잇는다. */}
                <form id={FORM_ID} noValidate onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                    <LookupField
                        id={FIELD.accountId}
                        name="accountId"
                        label="계정 ID"
                        placeholder="계정 ID 입력"
                        action="중복확인"
                        onAction={handleDuplicateCheck}
                        actionPending={isChecking}
                        actionPendingLabel={DUPLICATE_CHECK_PENDING_LABEL}
                        pattern={ACCOUNT_ID_PATTERN}
                        patternMessage={ACCOUNT_ID_MESSAGE}
                        helper={isAccountIdChecked ? DUPLICATE_CHECK_OK_MESSAGE : undefined}
                        required
                    />
                    <Field id={FIELD.password} label="비밀번호" required>
                        <Input
                            id={FIELD.password}
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            placeholder={`${PASSWORD_MIN_LENGTH}자 이상 입력`}
                            pattern={PASSWORD_PATTERN}
                            data-pattern-message={PASSWORD_MESSAGE}
                        />
                    </Field>
                    <Field id={FIELD.managerName} label="담당자 이름" required>
                        <Input
                            id={FIELD.managerName}
                            name="managerName"
                            required
                            autoComplete="off"
                            placeholder="담당자 이름 입력"
                        />
                    </Field>
                    <Field id={FIELD.organization} label="구분 / 소속" required>
                        <Input
                            id={FIELD.organization}
                            name="organization"
                            required
                            autoComplete="off"
                            placeholder="소속 부서 또는 지점명"
                        />
                    </Field>
                    <Field id={FIELD.status} label="상태" required>
                        {/* 고를 수 있는 값은 목록 필터와 같다(사용·사용정지) — 한 곳에서 관리한다. */}
                        <Select name="status" required>
                            <SelectTrigger id={FIELD.status} className="w-full">
                                <SelectValue placeholder="상태 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {SUB_ACCOUNT_STATUS_FILTERS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field id={FIELD.memo} label="메모">
                        <Textarea id={FIELD.memo} name="memo" placeholder="메모 입력 (선택)" />
                    </Field>
                </form>
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="tertiary" size="xl">
                        취소
                    </Button>
                </DialogClose>
                <Button type="submit" form={FORM_ID} size="xl">
                    저장하기
                </Button>
            </DialogFooter>
        </>
    )
}

const SubAccountCreateDialog = ({children, defaultOpen, onSubmit}: SubAccountCreateDialogProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen ?? false)

    // [프론트엔드 연동] 검사를 통과한 값이 온다 — 이 자리를 등록 API 호출로 바꾸고, 성공했을 때만
    // 모달을 닫은 뒤 목록을 다시 받아 온다(이어서 등록 완료 토스트).
    const handleValid = (values: Record<string, string>) => {
        console.log('[하위 계정 등록] 제출 데이터', values)
        onSubmit?.(values)
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            {/* 본문이 폼 칸의 나열이라 따로 설명 문단을 두지 않는다 — radix 에 설명 없음을 알린다. */}
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>하위 계정 등록</DialogTitle>
                </DialogHeader>
                {/* 다시 열면 빈 칸에서 시작하도록 열려 있는 동안만 보관소를 둔다(key 로 새로 만든다). */}
                <FormValuesProvider key={String(isOpen)} defaultValues={{status: DEFAULT_STATUS}}>
                    <SubAccountCreateBody onValid={handleValid} />
                </FormValuesProvider>
            </DialogContent>
        </Dialog>
    )
}

export {SubAccountCreateDialog}
export type {SubAccountCreateDialogProps}
