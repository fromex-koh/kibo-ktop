'use client'

import {useState, type ComponentPropsWithoutRef} from 'react'
import {Eye, EyeOff} from 'lucide-react'
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from '@/components/ui/input-group'
import {
    passwordInputAddonClassName,
    passwordInputGroupClassName,
    passwordInputIconClassName,
    passwordInputToggleClassName,
} from '@/components/theme/password-input.variants'
import {cn} from '@/lib/utils'

type PasswordInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
    showPasswordLabel?: string
    hidePasswordLabel?: string
    inputClassName?: string
}

// PROJECT-COMPOSITE: shadcn InputGroup과 Button을 조합한 비밀번호 입력입니다.
// PROJECT-STYLE: PasswordInput 전용 레이아웃은 theme/password-input.variants.ts에서 관리합니다.
const PasswordInput = ({
    className,
    inputClassName,
    showPasswordLabel = '비밀번호 표시',
    hidePasswordLabel = '비밀번호 숨기기',
    disabled,
    ...props
}: PasswordInputProps) => {
    const [visible, setVisible] = useState(false)

    return (
        <InputGroup className={cn(passwordInputGroupClassName, className)}>
            <InputGroupInput
                {...props}
                type={visible ? 'text' : 'password'}
                disabled={disabled}
                className={inputClassName}
            />
            <InputGroupAddon align="inline-end" className={passwordInputAddonClassName}>
                <InputGroupButton
                    size="icon-sm"
                    aria-label={visible ? hidePasswordLabel : showPasswordLabel}
                    aria-pressed={visible}
                    disabled={disabled}
                    className={passwordInputToggleClassName}
                    onClick={() => setVisible((current) => !current)}
                >
                    {visible ? (
                        <EyeOff aria-hidden="true" className={passwordInputIconClassName} />
                    ) : (
                        <Eye aria-hidden="true" className={passwordInputIconClassName} />
                    )}
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    )
}

export {PasswordInput}
export type {PasswordInputProps}
