'use client'

import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type ComponentProps,
    type SubmitEvent,
    type SyntheticEvent,
} from 'react'
import {useRouter} from 'next/navigation'
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
import {INQUIRY_TYPES} from '@/constants/inquiry'
import {cn} from '@/lib/utils'

// 문의 유형·제목·내용·첨부파일·동의 여부를 관리하는 Client Component.
// 서버 액션/API 연결에 필요한 form 속성과 취소 경로는 props로 전달한다.

const CONTENT_MAX_LENGTH = 500
const ATTACHMENT_EXTENSIONS = ['hwp', 'xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf', 'jpg', 'jpeg', 'gif', 'png']
const ATTACHMENT_ACCEPT = ATTACHMENT_EXTENSIONS.map((extension) => `.${extension}`).join(',')
const ATTACHMENT_MAX_SIZE = 30 * 1024 * 1024

const getAttachmentError = (files: File[]) => {
    if (files.length > 1) return '첨부파일은 1개만 업로드할 수 있습니다.'

    const [file] = files
    if (!file) return undefined

    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !ATTACHMENT_EXTENSIONS.includes(extension)) {
        return '첨부 가능한 파일 형식은 hwp, xls, xlsx, doc, docx, ppt, pptx, pdf, jpg, jpeg, gif, png입니다.'
    }

    if (file.size > ATTACHMENT_MAX_SIZE) return '파일 1개당 최대 30MB까지 첨부할 수 있습니다.'

    return undefined
}

// input name별 오류 메시지와 오류 발생 시 포커스할 컨트롤을 매핑한다.
const INVALID_FIELDS: Record<string, {message: string; focusId: string}> = {
    inquiryType: {message: '문의 유형을 선택해 주세요.', focusId: 'inquiry-type'},
    title: {message: '제목을 입력해 주세요.', focusId: 'inquiry-title'},
    content: {message: '문의 내용을 입력해 주세요.', focusId: 'inquiry-content'},
    consent: {message: '개인정보 수집 및 이용에 동의해 주세요.', focusId: 'inquiry-consent'},
}

// 별표는 시각적으로만 표시하고, 스크린 리더에는 필수 정보를 전달한다.
const RequiredMark = () => (
    <>
        <span aria-hidden="true" className="text-error-500">
            *
        </span>
        <span className="sr-only"> (필수)</span>
    </>
)

type InquiryFormProps = {
    // 취소 확인 후 이동할 경로.
    cancelHref: string
    // 개인정보 안내 화면에서 동의 모달을 처음부터 연다.
    consentDialogDefaultOpen?: boolean
    // action, method, encType, onSubmit 등 기본 form 속성을 전달한다.
} & Omit<ComponentProps<'form'>, 'children'>

type InquiryCancelDialogProps = {
    cancelHref: string
    defaultOpen?: boolean
    showTrigger?: boolean
    disabled?: boolean
}

// 문의 취소 확인 모달. 폼에서는 취소 버튼으로 열고, 인덱스 화면에서는 defaultOpen으로 확인한다.
const InquiryCancelDialog = ({
    cancelHref,
    defaultOpen = false,
    showTrigger = true,
    disabled = false,
}: InquiryCancelDialogProps) => {
    const router = useRouter()

    return (
        <Dialog defaultOpen={defaultOpen}>
            {showTrigger ? (
                <DialogTrigger asChild>
                    <Button type="button" variant="tertiary" size="xl" className="w-full md:w-auto" disabled={disabled}>
                        취소
                    </Button>
                </DialogTrigger>
            ) : null}
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
                    <Button type="button" size="xl" onClick={() => router.replace(cancelHref)}>
                        나가기
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// useFormStatus는 form 내부 자식에서만 사용할 수 있어 제출 액션을 분리한다.
const InquiryFormActions = ({cancelHref}: {cancelHref: string}) => {
    const {pending} = useFormStatus()

    return (
        <ActionBar>
            <ActionBarCenter className="col-span-3 col-start-1 w-full flex-col gap-4 md:col-span-1 md:col-start-2 md:w-auto md:flex-row">
                <InquiryCancelDialog cancelHref={cancelHref} disabled={pending} />
                <Button type="submit" size="xl" className="w-full md:w-auto" disabled={pending} aria-busy={pending}>
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

// 폼 상태는 Client Component인 InquiryForm에서 관리한다.
const InquiryForm = ({cancelHref, consentDialogDefaultOpen, className, onSubmit, ...formProps}: InquiryFormProps) => {
    const formRef = useRef<HTMLFormElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [attachmentName, setAttachmentName] = useState<string>()
    const [isConsentChecked, setIsConsentChecked] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // 브라우저의 required 검증을 FieldError로 대체하고 첫 오류 컨트롤에 포커스한다.
    // invalid 이벤트는 버블링하지 않으므로 캡처 단계에서 처리한다.
    useEffect(() => {
        const form = formRef.current
        if (!form) return

        // 여러 invalid 이벤트가 발생해도 첫 오류에만 포커스를 이동한다.
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

    // 값이 변경된 필드의 오류만 지운다.
    const clearError = (name: string) =>
        setErrors((previous) => {
            if (!previous[name]) return previous
            const next = {...previous}
            delete next[name]
            return next
        })

    const handleFormChange = (event: SyntheticEvent<HTMLFormElement>) => {
        const control = event.target
        if (control instanceof HTMLElement) {
            const name = control.getAttribute('name') ?? ''
            if (name !== 'attachment') clearError(name)
        }
    }

    const describedBy = (name: string) => (errors[name] ? `inquiry-${name}-error` : undefined)

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.currentTarget
        const files = Array.from(input.files ?? [])
        const errorMessage = getAttachmentError(files)

        if (errorMessage) {
            setAttachmentName(undefined)
            setErrors((previous) => ({...previous, attachment: errorMessage}))
            input.value = ''
            return
        }

        setAttachmentName(files[0]?.name)
        clearError('attachment')
    }

    // [폼 제출 진입점]
    // 현재는 action 미설정 시 제출을 막고 FormData를 로그한다. 실제 연동 시 API 요청 또는 form action을 연결한다.
    const handleFormSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget)
        const attachment = formData.get('attachment')
        const attachmentError =
            attachment instanceof File && attachment.name ? getAttachmentError([attachment]) : undefined

        if (attachmentError) {
            event.preventDefault()
            setErrors((previous) => ({...previous, attachment: attachmentError}))
            return
        }

        if (!formProps.action) event.preventDefault()

        const values = Object.fromEntries(
            Array.from(formData.entries()).map(([name, value]) => [
                name,
                value instanceof File ? {name: value.name, type: value.type, size: value.size} : value,
            ]),
        )

        if (process.env.NODE_ENV === 'development') {
            console.log('[InquiryForm] 제출 데이터', values)
        }

        onSubmit?.(event)
    }

    const clearAttachment = () => {
        setAttachmentName(undefined)
        // 같은 파일을 다시 선택해도 change 이벤트가 발생하도록 input을 초기화한다.
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <form
            ref={formRef}
            onChange={handleFormChange}
            {...formProps}
            onSubmit={handleFormSubmit}
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
                            {/* 오류 메시지를 글자 수 카운터와 같은 footer에 표시한다. */}
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

                        {/* 파일 input은 숨기고 버튼으로 열어 선택한 파일명과 제거 버튼을 표시한다. */}
                        <Field data-invalid={errors.attachment ? true : undefined}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="inquiry-attachment"
                                name="attachment"
                                accept={ATTACHMENT_ACCEPT}
                                tabIndex={-1}
                                aria-hidden="true"
                                aria-invalid={errors.attachment ? true : undefined}
                                aria-describedby={describedBy('attachment')}
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
                            <FieldError id="inquiry-attachment-error">{errors.attachment}</FieldError>
                        </Field>
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
                    {/* 약관 동의 결과를 체크박스 상태에 반영한다. */}
                    <Dialog defaultOpen={consentDialogDefaultOpen}>
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

export {InquiryCancelDialog, InquiryForm}
export type {InquiryCancelDialogProps, InquiryFormProps}
