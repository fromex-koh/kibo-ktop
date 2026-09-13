'use client'

import {useState, type ReactNode} from 'react'
import {Field} from '@/components/composite/form-fields'
import {FormValuesProvider, Input} from '@/components/composite/form-values'
import {SubAccountForm} from '@/components/composite/sub-account-form'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'

// 하위 계정 등록 — Figma "마이페이지_하위계정 현황_하위계정 등록".
// 목록 위의 [하위계정 등록] 이 여는 모달이고, 계정 ID·비밀번호·담당자 이름·구분/소속·상태·메모를 받는다.
//
// 칸과 검사 규칙은 수정 모달과 한 조각(SubAccountForm)을 쓴다. 이 모달만의 것은 계정 ID 아래의 비밀번호 칸이다.

const ID_PREFIX = 'sub-account-create'
const PASSWORD_FIELD_ID = `${ID_PREFIX}-password`

// 상태 칸의 처음 값 — 새로 만드는 계정은 바로 쓰는 계정이라 "사용" 이다(시안).
const DEFAULT_STATUS = 'active'

// 비밀번호 규칙은 시안의 안내 글("8자 이상 입력")이 기준이고, 띄어쓰기는 받지 않는다 — 띄어쓰기만 여덟 칸을
// 채워도 통과되던 것을 막고, 앞뒤에 실수로 들어간 띄어쓰기가 비밀번호에 섞이지 않게 한다.
// 어긋나면 pattern 이 막고, 그때 띄울 문구는 data-pattern-message 로 함께 준다 — 브라우저 기본 문구는
// "요청한 형식과 일치시키세요" 라 무엇을 고쳐야 하는지 알 수 없다[7.4.2].
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_PATTERN = `\\S{${PASSWORD_MIN_LENGTH},}`
const PASSWORD_MESSAGE = `비밀번호는 띄어쓰기 없이 ${PASSWORD_MIN_LENGTH}자 이상 입력해 주세요.`

type SubAccountCreateDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** [저장하기] 가 검사를 모두 통과했을 때 — 등록 API 를 붙이는 자리다. */
    onSubmit?: (values: Record<string, string>) => void
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
                    <SubAccountForm
                        idPrefix={ID_PREFIX}
                        onValid={handleValid}
                        afterAccountId={
                            <Field id={PASSWORD_FIELD_ID} label="비밀번호" required>
                                <Input
                                    id={PASSWORD_FIELD_ID}
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    placeholder={`${PASSWORD_MIN_LENGTH}자 이상 입력`}
                                    pattern={PASSWORD_PATTERN}
                                    data-pattern-message={PASSWORD_MESSAGE}
                                />
                            </Field>
                        }
                    />
                </FormValuesProvider>
            </DialogContent>
        </Dialog>
    )
}

export {SubAccountCreateDialog}
export type {SubAccountCreateDialogProps}
