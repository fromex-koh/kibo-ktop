'use client'

import type {ReactNode} from 'react'
import {Button} from '@/components/ui/button'
import {Field as BaseField, FieldDescription, FieldError, FieldLabel as BaseFieldLabel} from '@/components/ui/field'
import {InputGroup, InputGroupInput} from '@/components/ui/input-group'
import {Input, useFieldError} from '@/components/composite/form-values'

// 자가진단 입력 화면들이 함께 쓰는 필드 조각 — 라벨·그리드·자동입력 필드처럼 화면마다 반복되는 구성이다.
// 입력 자체는 form-values 의 래퍼를 쓰므로 name 만 주면 값이 한 곳에 모인다.

// 필수 표시 라벨 — 별표는 장식이라 aria-hidden, 스크린리더에는 "(필수)" 문구를 준다[5.3.1 · 7.4.1].
// 생김새·간격은 공통 FieldLabel 을 그대로 쓴다(컴포넌트 가이드의 "필드 라벨" 예시와 같은 마크업).
const FieldLabel = ({htmlFor, children, required}: {htmlFor: string; children: string; required?: boolean}) => (
    <BaseFieldLabel htmlFor={htmlFor} className="text-foreground gap-1 font-bold">
        {children}
        {required ? (
            <>
                <span aria-hidden="true" className="text-error-500">
                    *
                </span>
                <span className="sr-only"> (필수)</span>
            </>
        ) : null}
    </BaseFieldLabel>
)

// 라벨 + 입력 한 칸 — 공통 Field 로 감싼다. 간격(라벨 아래 16 · 입력 아래 8)과 메시지 타이포는
// theme/field.variants 가 시안 값으로 들고 있으므로 여기서 다시 정하지 않는다.
//
// 오류가 있으면 Field 에 data-invalid, 컨트롤에 aria-invalid, 메시지는 aria-describedby 로 잇는다 —
// 컴포넌트 가이드의 "오류와 비활성"과 같은 구조다[7.4.2]. 컨트롤 쪽 두 속성은 form-values 의 입력 래퍼가
// 같은 id 로 알아서 건다.
//
// 메시지는 두 갈래로 들어온다. error 를 직접 넘기면 그쪽이 우선하고(설립일의 미래 날짜처럼 입력 즉시 아는 오류),
// 없으면 제출할 때 담긴 메시지(FormValues)를 이 칸의 id 로 찾아 쓴다.
const Field = ({
    id,
    label,
    required,
    helper,
    error,
    className,
    children,
}: {
    id: string
    label: string
    required?: boolean
    helper?: string
    error?: string
    className?: string
    children: ReactNode
}) => {
    const submitError = useFieldError(id)
    const message = error ?? submitError

    return (
        <BaseField data-invalid={message ? true : undefined} className={className}>
            <FieldLabel htmlFor={id} required={required}>
                {label}
            </FieldLabel>
            {children}
            {message ? <FieldError id={`${id}-error`}>{message}</FieldError> : null}
            {helper ? <FieldDescription id={`${id}-helper`}>{helper}</FieldDescription> : null}
        </BaseField>
    )
}

// 회원정보에서 자동 입력되는 값 — readOnly 로 두고 잠긴 배경으로만 구분한다(FormData 에는 그대로 포함된다).
// 시안에 자물쇠 같은 표식이 없어 아이콘은 두지 않는다 — 수정 불가는 배경과 안내 문구로 이미 전달된다.
const LockedField = ({
    id,
    label,
    value,
    required,
    autoComplete = 'off',
}: {
    id: string
    label: string
    value: string
    required?: boolean
    autoComplete?: string
}) => (
    <Field id={id} label={label} required={required}>
        <InputGroup>
            <InputGroupInput
                id={id}
                name={id}
                readOnly
                required={required}
                defaultValue={value}
                autoComplete={autoComplete}
            />
        </InputGroup>
    </Field>
)

// 조회·검색 버튼이 붙는 입력.
const LookupField = ({
    id,
    name,
    label,
    placeholder,
    action,
    required,
    readOnly,
    className,
    helper,
    wrapAction,
}: {
    id: string
    name?: string
    label: string
    placeholder: string
    action: string
    required?: boolean
    readOnly?: boolean
    className?: string
    helper?: string
    /** 버튼을 감싸 모달 트리거로 만들 때 쓴다 — 감싼 결과를 돌려준다(업종코드 조회 모달 등).
        버튼을 사용처에서 통째로 만들지 않는 이유는, 버튼 글자·모양을 이 조각 한 곳에 두기 위해서다. */
    wrapAction?: (button: ReactNode) => ReactNode
}) => {
    const actionButton = (
        <Button type="button" variant="tertiary" size="md" className="shrink-0">
            {action}
        </Button>
    )

    return (
        <Field id={id} label={label} required={required} className={className} helper={helper}>
            <div className="flex items-start gap-2">
                <Input
                    id={id}
                    name={name ?? id}
                    readOnly={readOnly}
                    required={required}
                    autoComplete="off"
                    placeholder={placeholder}
                    aria-describedby={helper ? `${id}-helper` : undefined}
                    className="min-w-0 flex-1"
                />
                {wrapAction ? wrapAction(actionButton) : actionButton}
            </div>
        </Field>
    )
}

// 2열 필드 그리드 — 시안의 리스트 영역(두 칸 + 24 거터, 줄 간격도 24).
const FieldGrid = ({children}: {children: ReactNode}) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{children}</div>
)

// 3열 필드 행 — 시안의 [동업종 여부 · 담당업무 · 최종직급] 처럼 한 줄에 세 칸이 오는 구성.
const FieldRow3 = ({children}: {children: ReactNode}) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">{children}</div>
)

export {Field, FieldGrid, FieldLabel, FieldRow3, LockedField, LookupField}
