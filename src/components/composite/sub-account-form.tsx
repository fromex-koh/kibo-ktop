'use client'

import {useEffect, useRef, useState, type ReactNode, type SubmitEvent} from 'react'
import {Field, LookupField} from '@/components/composite/form-fields'
import {useFormTabsSubmit} from '@/components/composite/form-tabs-submit'
import {
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
import {DialogClose, DialogFooter} from '@/components/ui/dialog'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {SUB_ACCOUNT_STATUS_FILTERS} from '@/constants/sub-account'
import {cn} from '@/lib/utils'

// 하위 계정 등록·수정 모달이 함께 쓰는 본문 + CTA — Figma "마이페이지_하위계정 현황_하위계정 등록"·"…_하위계정 수정".
// 두 모달은 계정 ID·담당자 이름·구분/소속·상태·메모를 같은 순서, 같은 규칙으로 받는다. 다른 곳은 셋이다.
//   · 등록 — 계정 ID 를 새로 정하므로 [중복확인] 이 붙고, 그 아래에 비밀번호 칸이 온다(afterAccountId).
//   · 수정 — 계정 ID 는 바꿀 수 없어 잠근 칸으로 보여 주고(isAccountIdReadOnly) 중복확인도 없다.
//            메모 아래에 서비스별 배분 이용건수 구획이 붙는다(children).
//
// 입력 칸은 시안 순서 그대로 위에서 아래로 한 칸씩 쌓인다(칸 사이 16). 등록의 계정 ID 만 오른쪽에 [중복확인] 이
// 붙어 한 줄을 나눠 쓴다 — 그 짜임은 공용 LookupField 가 들고 있다.
//
// 검사·메시지 표시·걸린 칸으로 이동은 다른 폼 화면과 같은 관문(useFormTabsSubmit)이 맡는다 — 오류 문구의
// 말투가 화면마다 달라지지 않는다("담당자 이름을 입력해 주세요."). 기준은 화면에 적어 둔 required·pattern 이다.
// 계정 ID 의 중복확인만 화면 밖(서버)에서 판가름나는 조건이라 이 조각이 따로 본다.
//
// 시안의 메모 라벨에는 필수 표시(*)가 남아 있지만 안내 글이 "메모 입력 (선택)" 이라 선택 입력으로 둔다 —
// 컴포넌트 기본값이 지워지지 않은 것으로 본다. 실제 정책이 필수라면 required 만 켜면 된다.

// 계정 ID 규칙 — 로그인에 쓰는 값이라 영문으로 시작하고 숫자·밑줄만 섞을 수 있다(4~20자).
// 형식은 pattern 이 막고(칸을 벗어날 때·제출할 때), 그때 띄울 문구는 data-pattern-message 로 함께 준다.
const ACCOUNT_ID_PATTERN = '[A-Za-z][A-Za-z0-9_]{3,19}'
const ACCOUNT_ID_MESSAGE = '영문으로 시작하는 4~20자, 숫자·_ 허용'

// 공백만 채운 값은 빈 칸과 같다 — required 는 띄어쓰기도 값으로 쳐서 통과시키므로 형식으로 한 번 더 막는다.
// 수정 모달은 지금 값이 채워진 채 열려, 지우고 띄어쓰기만 남긴 채 저장하는 일이 생길 수 있다.
// 걸렸을 때의 문구는 빈 칸일 때와 같게 둔다 — 사용자에게는 둘 다 "안 적은 것" 이다.
const NOT_BLANK_PATTERN = '.*\\S.*'
const MANAGER_NAME_MESSAGE = '담당자 이름을 입력해 주세요.'
const ORGANIZATION_MESSAGE = '구분 / 소속을 입력해 주세요.'

// 중복확인은 서버가 판가름하는 조건이라 required 로는 막을 수 없다 — 확인 전에는 제출을 세운다.
const DUPLICATE_CHECK_MESSAGE = '계정 ID 중복확인을 해 주세요.'
const DUPLICATE_CHECK_OK_MESSAGE = '사용할 수 있는 계정 ID 입니다.'
const DUPLICATE_CHECK_PENDING_LABEL = '확인 중'
// 목업이 서버를 흉내 내는 시간 — 실제 API 를 붙이면 이 지연은 사라진다.
const DUPLICATE_CHECK_MOCK_DELAY = 800

// 폼·칸 id — 모달마다 앞머리를 달리 붙여 한 화면에 두 모달이 함께 있어도 id 가 겹치지 않게 한다[8.1.1].
const subAccountFieldIds = (idPrefix: string) => ({
    form: `${idPrefix}-form`,
    accountId: `${idPrefix}-account-id`,
    managerName: `${idPrefix}-manager`,
    organization: `${idPrefix}-organization`,
    status: `${idPrefix}-status`,
    memo: `${idPrefix}-memo`,
})

type SubAccountFormProps = {
    /** 폼·칸 id 의 앞머리. 탭이 없는 폼이라 공통 관문이 요구하는 이름으로도 쓴다. */
    idPrefix: string
    /** 계정 ID 를 바꿀 수 없게 잠근다(수정). 잠근 칸에는 [중복확인] 이 없고 제출할 때도 확인을 요구하지 않는다. */
    isAccountIdReadOnly?: boolean
    /** 계정 ID 바로 아래에 오는 칸(등록의 비밀번호). */
    afterAccountId?: ReactNode
    /** 메모 아래에 붙는 구획(수정의 서비스별 배분 이용건수). 폼 안에 두어 함께 검사·제출된다. */
    children?: ReactNode
    /** [저장하기] 가 검사를 모두 통과했을 때 모인 값(칸의 name 이 키다). */
    onValid: (values: Record<string, string>) => void
}

// 검사 관문과 값 보관소를 쓰므로 FormValuesProvider 안에 둔다.
// 조각(본문·CTA)은 Dialog 셸의 grid 행이라 여기서 감싸지 않고 조각 그대로 돌려준다.
const SubAccountForm = ({idPrefix, isAccountIdReadOnly, afterAccountId, children, onValid}: SubAccountFormProps) => {
    const fieldIds = subAccountFieldIds(idPrefix)
    const {handleSubmit} = useFormTabsSubmit({defaultTab: idPrefix})
    const {setFieldError, clearFieldError} = useFormValues()
    // 지금 칸에 적힌 계정 ID — 중복확인을 마친 값과 견줘, 확인한 뒤에 ID 를 고치면 다시 확인하게 한다.
    const accountId = useFieldValue('accountId')?.value ?? ''
    // [중복확인] 을 통과한 계정 ID. 아직 확인하지 않았으면 비어 있다.
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
        const control = document.getElementById(fieldIds.accountId)
        if (!accountId) {
            setFieldError(fieldIds.accountId, '계정 ID를 입력해 주세요.')
            control?.focus()

            return
        }
        if (control instanceof HTMLInputElement && !control.validity.valid) {
            setFieldError(fieldIds.accountId, ACCOUNT_ID_MESSAGE)
            control.focus()

            return
        }

        console.log('[하위 계정] 계정 ID 중복확인', accountId)
        clearFieldError(fieldIds.accountId)
        setIsChecking(true)
        checkTimerRef.current = setTimeout(() => {
            setIsChecking(false)
            setCheckedAccountId(accountId)
        }, DUPLICATE_CHECK_MOCK_DELAY)
    }

    // required·pattern 검사를 먼저 돌리고, 통과했더라도 중복확인 전이면 그 칸에 메시지를 남긴다.
    // 관문이 메시지를 통째로 갈아끼운 뒤에 더해야 지워지지 않는다. 계정 ID 를 잠근 폼(수정)은 확인할 것이 없다.
    const handleFormSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        const isReady = isAccountIdReadOnly || (isAccountIdChecked && !isChecking)
        const passed = handleSubmit(event, isReady ? onValid : () => undefined)
        if (isReady) return

        // 계정 ID 자체가 비었거나 형식이 어긋났으면 그 문구가 먼저다 — 고칠 것이 남았는데 중복확인부터
        // 하라고 하면 눌러도 같은 자리에 머문다.
        const control = document.getElementById(fieldIds.accountId)
        if (control instanceof HTMLInputElement && !control.validity.valid) return

        setFieldError(fieldIds.accountId, DUPLICATE_CHECK_MESSAGE)
        // 다른 칸이 걸렸으면 관문이 이미 그 칸으로 옮겨 놓았다 — 남은 문제가 이것뿐일 때만 여기로 부른다.
        if (passed) control?.focus()
    }

    return (
        <>
            <div className={cn(dialogBodyClassName, 'gap-4')}>
                {/* 브라우저 기본 말풍선 대신 각 칸 밑에 문구를 띄운다 — 어느 칸을 어떻게 고칠지가
                    화면에 남는다[7.4.2]. CTA 는 폼 바깥(CTA 구획)에 있어 form 속성으로 잇는다. */}
                <form id={fieldIds.form} noValidate onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                    {/* 입력 칸 묶음(칸 사이 16) — 아래에 붙는 구획(수정의 이용건수)과는 24 떨어진다(시안). */}
                    <div className="flex flex-col gap-4">
                        {isAccountIdReadOnly ? (
                            // 잠근 칸 — 고칠 수 없으니 필수 표시도 두지 않는다(시안). 잠긴 배경은 입력의
                            // read-only 스타일이 맡고, 값은 그대로 제출에 담긴다.
                            <Field id={fieldIds.accountId} label="계정 ID">
                                <Input id={fieldIds.accountId} name="accountId" readOnly autoComplete="off" />
                            </Field>
                        ) : (
                            <LookupField
                                id={fieldIds.accountId}
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
                        )}
                        {afterAccountId}
                        <Field id={fieldIds.managerName} label="담당자 이름" required>
                            <Input
                                id={fieldIds.managerName}
                                name="managerName"
                                required
                                autoComplete="off"
                                placeholder="담당자 이름 입력"
                                pattern={NOT_BLANK_PATTERN}
                                data-pattern-message={MANAGER_NAME_MESSAGE}
                            />
                        </Field>
                        <Field id={fieldIds.organization} label="구분 / 소속" required>
                            <Input
                                id={fieldIds.organization}
                                name="organization"
                                required
                                autoComplete="off"
                                placeholder="소속 부서 또는 지점명"
                                pattern={NOT_BLANK_PATTERN}
                                data-pattern-message={ORGANIZATION_MESSAGE}
                            />
                        </Field>
                        <Field id={fieldIds.status} label="상태" required>
                            {/* 고를 수 있는 값은 목록 필터와 같다(사용·사용정지) — 한 곳에서 관리한다. */}
                            <Select name="status" required>
                                <SelectTrigger id={fieldIds.status} className="w-full">
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
                        <Field id={fieldIds.memo} label="메모">
                            <Textarea id={fieldIds.memo} name="memo" placeholder="메모 입력 (선택)" />
                        </Field>
                    </div>
                    {children}
                </form>
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="tertiary" size="xl">
                        취소
                    </Button>
                </DialogClose>
                <Button type="submit" form={fieldIds.form} size="xl">
                    저장하기
                </Button>
            </DialogFooter>
        </>
    )
}

export {SubAccountForm}
export type {SubAccountFormProps}
