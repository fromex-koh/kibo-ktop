'use client'

import {useId, useRef, useState, type SubmitEvent} from 'react'
import {useRouter} from 'next/navigation'
import {FileUpload} from '@/components/composite/file-upload'
import {FormCard} from '@/components/composite/form-card'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {FIELD_FOCUS_RING} from '@/constants/form'
import {cn} from '@/lib/utils'

// 기관 개별평가 KTRS-FM 1단계 입력 묶음 — Figma "1단계_고객정보활용동의".
// 카드 두 장이 한 폼이고, 화면 하단의 [다음]이 form 속성으로 이 폼을 제출한다.
//
// 기업 화면(corp)의 같은 단계는 약관 동의서를 화면에서 직접 받지만, 기관은 업체에서 이미 받은
// 정보이용동의서를 PDF 로 올린다 — 그래서 동의 여부 확인 + 파일 업로드 두 카드로 끝난다.
//
// [프론트엔드 연동] 아래 console.log 자리만 저장 API 호출로 바꾸면 된다. 검사(동의 여부·첨부 여부)와
// 다음 화면 이동은 그대로 두면 되고, 화면(JSX)은 손댈 것이 없다.

const CONSENT_OPTIONS = [
    {value: 'yes', label: '예'},
    {value: 'no', label: '아니요'},
] as const

const CONSENT_NAME = 'informationConsentReceived'
const CONSENT_FILE_NAME = 'informationConsentFile'
// 첨부 정책 — PDF·ZIP·RAR·7Z 4종, 1개, 1개당 최대 50MB.
// 확장자로 적는 이유: zip·rar·7z 의 MIME 은 브라우저·OS 마다 달라 MIME 만으로는 거를 수 없다.
const CONSENT_FILE_ACCEPT = '.pdf,.zip,.rar,.7z'
const CONSENT_FILE_MAX_SIZE_MB = 50

type OrgCustomerConsentFormProps = {
    // 화면 하단 [다음] 버튼이 form 속성으로 가리키는 이름.
    formId: string
    // 제출을 통과하면 이동할 다음 단계.
    nextHref: string
}

const OrgCustomerConsentForm = ({formId, nextHref}: OrgCustomerConsentFormProps) => {
    const router = useRouter()
    const questionId = useId()
    const consentErrorId = useId()
    const firstOptionRef = useRef<HTMLButtonElement>(null)

    const [consent, setConsent] = useState('')
    const [fileName, setFileName] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    // 제출을 눌러 본 뒤에만 안내를 띄운다 — 입력 전부터 빨간 문구가 깔리지 않게 한다[7.4.2].
    const consentError = isSubmitted && !consent
    const fileError = isSubmitted && !fileName

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitted(true)

        if (!consent) {
            firstOptionRef.current?.focus()
            return
        }
        if (!fileName) return

        const formData = new FormData(event.currentTarget)
        // 첨부 파일은 File 그대로 둔다 — 콘솔에서 이름·용량·형식을 펼쳐 볼 수 있다.
        console.log('[기관 개별평가 KTRS-FM] 1단계 고객정보활용동의 제출 데이터', Object.fromEntries(formData))
        router.push(nextHref)
    }

    return (
        <form id={formId} noValidate onSubmit={handleSubmit} className="flex flex-col gap-10">
            <FormCard>
                {/* 질문과 보기가 한 줄에 놓인다(시안). 좁은 화면에서는 보기를 아래로 내린다. */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* 이 카드에는 FormCard title 이 없고 이 물음이 카드의 제목 노릇을 한다 — 크기·굵기도
                        옆 카드 제목(정보이용동의서 업로드, SectionHeaderTitle=h2)과 같다. p 로 두면 "제목처럼
                        보이는데 제목이 아닌 글"이 되어(WAVE "Possible heading") 제목 이동에서 빠지므로 h2 로
                        둔다[6.4.2]. 화면 제목(h1) 아래 단계라 단계를 건너뛰지 않는다. */}
                    <h2 id={questionId} className="typo-h4-bold text-foreground md:shrink-0">
                        정보제공 동의를 받으셨습니까?
                    </h2>
                    {/* legend 는 fieldset 안에서 캡션 자리에 고정돼 질문을 보기 왼쪽에 둘 수 없다.
                        radix RadioGroup 이 role="radiogroup" 을 내므로 질문 문장을 이름으로 잇는다[7.4.1]. */}
                    <RadioGroup
                        name={CONSENT_NAME}
                        value={consent}
                        onValueChange={setConsent}
                        required
                        aria-labelledby={questionId}
                        aria-invalid={consentError || undefined}
                        aria-describedby={consentError ? consentErrorId : undefined}
                        // 보기 두 개가 한 줄에 40 간격으로 놓인다(시안) — 기본 세로 배치를 가로로 바꾼다.
                        className="flex w-auto items-center gap-10"
                    >
                        {CONSENT_OPTIONS.map((option, index) => (
                            <Field
                                key={option.value}
                                orientation="horizontal"
                                className={cn('w-fit', FIELD_FOCUS_RING)}
                            >
                                <RadioGroupItem
                                    ref={index === 0 ? firstOptionRef : undefined}
                                    id={`${questionId}-${option.value}`}
                                    value={option.value}
                                />
                                <FieldLabel htmlFor={`${questionId}-${option.value}`}>{option.label}</FieldLabel>
                            </Field>
                        ))}
                    </RadioGroup>
                </div>
                {consentError ? (
                    <FieldError id={consentErrorId} className="mt-2">
                        정보제공 동의 여부를 선택해 주세요.
                    </FieldError>
                ) : null}
            </FormCard>

            <FormCard title="정보이용동의서 업로드">
                <FileUpload
                    name={CONSENT_FILE_NAME}
                    accept={CONSENT_FILE_ACCEPT}
                    maxSizeMb={CONSENT_FILE_MAX_SIZE_MB}
                    hint="PDF, ZIP, RAR, 7Z 파일 1개 첨부 가능 (파일당 최대 50MB)"
                    // 이 화면의 CTA 는 [다음]이다 — 시안 문구의 [신청]은 다른 화면에서 옮겨온 표기라 맞춘다.
                    completeDescription="파일 내용을 검토한 후 [다음] 버튼을 눌러주세요."
                    onFileChange={(file) => setFileName(file?.name ?? '')}
                    error={fileError ? '정보이용동의서 파일을 첨부해 주세요.' : undefined}
                />
            </FormCard>
        </form>
    )
}

export {OrgCustomerConsentForm}
export type {OrgCustomerConsentFormProps}
