'use client'

import {useEffect, useRef, useState, type ChangeEvent, type ComponentProps, type FormEvent} from 'react'
import {useFormStatus} from 'react-dom'
import {LoaderCircle, Paperclip, X} from 'lucide-react'
import {ActionBar, ActionBarCenter} from '@/components/composite/action-bar'
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
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {BaseCard} from '@/components/composite/base-card'
import {ConsentTermsDialogContent} from '@/components/composite/consent-terms-dialog'
import {SelectField, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {
    SubSectionHeader,
    SubSectionHeaderDescription,
    SubSectionHeaderTitle,
} from '@/components/composite/sub-section-header'
import {TextareaCounter} from '@/components/composite/textarea-counter'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'
import {Input} from '@/components/ui/input'
import {cn} from '@/lib/utils'

// 1:1 문의 등록 폼. 첨부파일·동의·필수값 검증 상태를 관리하므로 Client Component로 둔다.
// 화면에서는 action(서버 액션 또는 API 경로)과 cancelHref를 전달한다.
// 제출 데이터: inquiryType · title · content · attachment · consent.
// 일반 POST로 연결할 때는 method="post"와 encType="multipart/form-data"를 함께 전달한다.
// 필수값은 브라우저 검증과 INVALID_FIELDS 메시지로 처리하고, 제출 중 상태는 useFormStatus가 관리한다.

const INQUIRY_TYPES = [
    {value: 'service', label: '서비스 이용'},
    {value: 'evaluation', label: '기술평가 신청'},
    {value: 'report', label: 'K-BIGx 보고서'},
    {value: 'account', label: '회원·계정'},
    {value: 'etc', label: '기타'},
] as const

const CONTENT_MAX_LENGTH = 500

// 필수값 오류 메시지와 포커스 대상. 키는 전송되는 input name이며, focusId는 화면에 보이는 컨트롤의 id다.
// Select·Checkbox처럼 실제 입력이 숨겨진 컨트롤도 사용자가 오류 위치를 바로 확인할 수 있게 한다. [KWCAG 7.4.2]
const INVALID_FIELDS: Record<string, {message: string; focusId: string}> = {
    inquiryType: {message: '문의 유형을 선택해 주세요.', focusId: 'inquiry-type'},
    title: {message: '제목을 입력해 주세요.', focusId: 'inquiry-title'},
    content: {message: '문의 내용을 입력해 주세요.', focusId: 'inquiry-content'},
    consent: {message: '개인정보 수집 및 이용에 동의해 주세요.', focusId: 'inquiry-consent'},
}

// 필수 표시. 별표는 숨기고 보조기기에는 "(필수)"로 전달한다. [KWCAG 7.4.1]
const RequiredMark = () => (
    <>
        <span aria-hidden="true" className="text-error-500">
            *
        </span>
        <span className="sr-only"> (필수)</span>
    </>
)

type InquiryFormProps = {
    // 작성 취소 확인 후 이동할 경로.
    cancelHref: string
    // action·method·encType·onSubmit 등 기본 form 속성은 그대로 전달된다.
} & Omit<ComponentProps<'form'>, 'children'>

// useFormStatus는 form의 자식 컴포넌트에서만 동작하므로 제출 액션을 별도 컴포넌트로 분리한다.
// pending일 때 등록·취소 버튼을 비활성화하고 등록 중 상태를 표시한다.
const InquiryFormActions = ({cancelHref}: {cancelHref: string}) => {
    const {pending} = useFormStatus()

    return (
        <ActionBar>
            <ActionBarCenter className="gap-4">
                {/* 작성 중인 내용이 사라지므로 취소 전에 확인하고, 확인하면 cancelHref로 이동한다. */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button type="button" variant="tertiary" size="xl" disabled={pending}>
                            취소
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>작성 취소</DialogTitle>
                        </DialogHeader>
                        <div className={cn(dialogBodyClassName, 'gap-4')}>
                            <DialogDescription>문의 작성을 취소하시겠습니까?</DialogDescription>
                            <p className="typo-body-xl-regular text-label-foreground">
                                지금까지 작성한 내용과 첨부파일은 저장되지 않습니다.
                                <br />
                                화면을 나가면 다시 작성해야 합니다.
                            </p>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="tertiary" size="xl">
                                    계속 작성
                                </Button>
                            </DialogClose>
                            <Button asChild size="xl">
                                <a href={cancelHref}>나가기</a>
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button type="submit" size="xl" disabled={pending} aria-busy={pending}>
                    {pending ? (
                        <>
                            <LoaderCircle aria-hidden="true" className="animate-spin" />
                            등록 중
                        </>
                    ) : (
                        '등록하기'
                    )}
                </Button>
            </ActionBarCenter>
        </ActionBar>
    )
}

const InquiryForm = ({cancelHref, className, ...formProps}: InquiryFormProps) => {
    const formRef = useRef<HTMLFormElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [attachmentName, setAttachmentName] = useState<string>()
    const [isConsentChecked, setIsConsentChecked] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // required 검증을 가로채 기본 말풍선 대신 FieldError를 표시하고 첫 오류 컨트롤에 포커스를 둔다.
    // invalid 이벤트는 버블링하지 않으므로 캡처 단계에서 처리한다.
    useEffect(() => {
        const form = formRef.current
        if (!form) return

        // 한 번의 제출에서는 첫 오류 항목으로만 포커스를 이동한다.
        let hasMovedFocus = false

        const handleInvalid = (event: Event) => {
            const control = event.target
            if (!(control instanceof HTMLElement)) return

            const name = control.getAttribute('name')
            const field = name ? INVALID_FIELDS[name] : undefined
            if (!name || !field) return

            event.preventDefault()
            setErrors((previous) => ({...previous, [name]: field.message}))

            if (hasMovedFocus) return
            hasMovedFocus = true
            document.getElementById(field.focusId)?.focus()
            setTimeout(() => {
                hasMovedFocus = false
            }, 0)
        }

        form.addEventListener('invalid', handleInvalid, true)
        return () => form.removeEventListener('invalid', handleInvalid, true)
    }, [])

    // 입력이 변경되면 해당 필드의 오류만 지운다.
    const clearError = (name: string) =>
        setErrors((previous) => {
            if (!previous[name]) return previous
            const {[name]: _removed, ...rest} = previous
            return rest
        })

    const handleFormChange = (event: FormEvent<HTMLFormElement>) => {
        const control = event.target
        if (control instanceof HTMLElement) clearError(control.getAttribute('name') ?? '')
    }

    const describedBy = (name: string) => (errors[name] ? `inquiry-${name}-error` : undefined)

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAttachmentName(event.currentTarget.files?.[0]?.name)
    }

    const clearAttachment = () => {
        setAttachmentName(undefined)
        // 같은 파일을 다시 선택해도 change 이벤트가 발생하도록 input 값을 비운다.
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <form
            ref={formRef}
            onChange={handleFormChange}
            {...formProps}
            className={cn('flex flex-col gap-10', className)}
        >
            <div className="flex flex-col gap-4">
                <BaseCard className="[--card-spacing:--spacing(10)]">
                    <div className="flex flex-col gap-6">
                        <SubSectionHeader>
                            <SubSectionHeaderTitle>문의내용</SubSectionHeaderTitle>
                            <SubSectionHeaderDescription>
                                * 표시 항목은 필수 입력 항목입니다.
                            </SubSectionHeaderDescription>
                        </SubSectionHeader>

                        <Field data-invalid={errors.inquiryType ? true : undefined}>
                            <FieldLabel htmlFor="inquiry-type" className="text-foreground gap-1 font-bold">
                                유형 선택
                                <RequiredMark />
                            </FieldLabel>
                            <SelectField name="inquiryType" required onValueChange={() => clearError('inquiryType')}>
                                <SelectTrigger
                                    id="inquiry-type"
                                    aria-invalid={errors.inquiryType ? true : undefined}
                                    aria-describedby={describedBy('inquiryType')}
                                >
                                    <SelectValue placeholder="문의 유형을 선택해 주세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    {INQUIRY_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </SelectField>
                            <FieldError id="inquiry-inquiryType-error">{errors.inquiryType}</FieldError>
                        </Field>

                        <Field data-invalid={errors.title ? true : undefined}>
                            <FieldLabel htmlFor="inquiry-title" className="text-foreground gap-1 font-bold">
                                제목
                                <RequiredMark />
                            </FieldLabel>
                            <Input
                                id="inquiry-title"
                                name="title"
                                required
                                placeholder="문의하실 제목명을 적어주세요"
                                aria-invalid={errors.title ? true : undefined}
                                aria-describedby={describedBy('title')}
                            />
                            <FieldError id="inquiry-title-error">{errors.title}</FieldError>
                        </Field>

                        <Field data-invalid={errors.content ? true : undefined}>
                            <FieldLabel htmlFor="inquiry-content" className="text-foreground gap-1 font-bold">
                                문의 내용
                                <RequiredMark />
                            </FieldLabel>
                            {/* 입력 오류는 글자 수 카운터와 같은 footer 영역에 표시한다. */}
                            <TextareaCounter
                                id="inquiry-content"
                                name="content"
                                required
                                maxLength={CONTENT_MAX_LENGTH}
                                placeholder="문의하실 내용을 적어주세요"
                                aria-invalid={errors.content ? true : undefined}
                                aria-describedby={describedBy('content')}
                                footer={<FieldError id="inquiry-content-error">{errors.content}</FieldError>}
                            />
                        </Field>

                        {/* 파일 input은 숨기고 별도 버튼으로 열며, 선택 후 파일명과 제거 버튼을 표시한다. */}
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="inquiry-attachment"
                                name="attachment"
                                tabIndex={-1}
                                aria-hidden="true"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            {attachmentName ? (
                                <div className="bg-surface-subtle text-label-foreground flex h-14 items-center gap-2 rounded-sm px-6">
                                    <Paperclip aria-hidden="true" className="size-icon-sm shrink-0" />
                                    <span className="typo-body-xl-regular min-w-0 flex-1 truncate">
                                        {attachmentName}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="plain"
                                        size="icon-sm"
                                        aria-label={`${attachmentName} 첨부 취소`}
                                        onClick={clearAttachment}
                                    >
                                        <X aria-hidden="true" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="tertiary"
                                        size="xs"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Paperclip aria-hidden="true" />
                                        첨부파일
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </BaseCard>

                <p className="typo-body-l-regular text-foreground-subtle break-keep">
                    ※ 문의 내용이 K-TOP 서비스와 관련이 없는 경우 별도의 답변을 드리지 않습니다
                </p>
            </div>

            <BaseCard className="py-6 [--card-spacing:--spacing(10)]">
                <div className="flex items-start gap-8">
                    <Field orientation="horizontal" className="items-start">
                        <Checkbox
                            id="inquiry-consent"
                            name="consent"
                            required
                            checked={isConsentChecked}
                            onCheckedChange={(checked) => {
                                setIsConsentChecked(checked === true)
                                if (checked === true) clearError('consent')
                            }}
                            aria-invalid={errors.consent ? true : undefined}
                            aria-describedby={describedBy('consent')}
                            className="mt-0.5"
                        />
                        <FieldLabel htmlFor="inquiry-consent" className="flex-col items-start gap-1">
                            <span className="typo-body-xl-bold text-foreground">[필수] 개인정보 수집 및 이용동의</span>
                            <span className="typo-body-xl-regular text-label-foreground break-keep">
                                고객님에게는 동의를 거부할 권리가 있으나, 개인정보 수집 및 이용에 동의하셔야 상담
                                서비스를 이용할 수 있습니다
                            </span>
                            <FieldError id="inquiry-consent-error">{errors.consent}</FieldError>
                        </FieldLabel>
                    </Field>
                    {/* 약관 모달에서 동의하면 이 화면의 체크박스도 선택 상태로 동기화한다. */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button type="button" variant="text-underline" size="md" className="shrink-0 font-normal">
                                내용보기
                            </Button>
                        </DialogTrigger>
                        <ConsentTermsDialogContent
                            onAgree={() => {
                                setIsConsentChecked(true)
                                clearError('consent')
                            }}
                        />
                    </Dialog>
                </div>
            </BaseCard>

            <InquiryFormActions cancelHref={cancelHref} />
        </form>
    )
}

export {InquiryForm}
export type {InquiryFormProps}
