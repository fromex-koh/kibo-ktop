'use client'

import {useState} from 'react'
import {AttachField} from '@/components/composite/attach-field'
import {FormCard} from '@/components/composite/form-card'
import {
    FormResetButton,
    FormSubmitResult,
    formatSubmitResult,
    withFormReset,
    type FormResetProps,
} from '@/components/custom/form-submit-result'
import {Button} from '@/components/ui/button'

// 가이드의 폼 제출 데모 — 파일을 골라 첨부 · 삭제 · 제출 검사와 제출 결과를 확인한다.
// 파일 자체는 JSON 으로 보일 수 없어 칸마다 파일 이름만 적는다.

const DEMO_ATTACHMENTS = [
    {name: 'guideCeoHealthInsurance', label: '대표자 건강보험 자격 득실 확인서'},
    {name: 'guideSocialInsurance', label: '4대 사회보험 사업장 가입자 명부'},
    {name: 'guidePatentCertificate', label: '특허등록증', helper: '※ 다수 특허의 경우 압축하여 업로드해 주세요.'},
] as const

const AttachFieldDemoBody = ({onReset}: FormResetProps) => {
    const [files, setFiles] = useState<Record<string, File | null>>({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submittedData, setSubmittedData] = useState<string | null>(null)

    return (
        <form
            noValidate
            onReset={onReset}
            onSubmit={(event) => {
                event.preventDefault()
                setIsSubmitted(true)

                const hasAllFiles = DEMO_ATTACHMENTS.every((attachment) => files[attachment.name])
                setSubmittedData(
                    hasAllFiles
                        ? formatSubmitResult(
                              Object.fromEntries(
                                  DEMO_ATTACHMENTS.map((attachment) => [
                                      attachment.name,
                                      files[attachment.name]?.name ?? '',
                                  ]),
                              ),
                          )
                        : null,
                )
            }}
            className="flex flex-col gap-6"
        >
            <FormCard title="첨부파일" subtitle="평가 신청에 필요한 서류를 첨부해 주세요.">
                <div className="flex flex-col gap-10">
                    {DEMO_ATTACHMENTS.map((attachment) => (
                        <AttachField
                            key={attachment.name}
                            label={attachment.label}
                            name={attachment.name}
                            required
                            accept=".pdf,.zip,.rar,.7z"
                            maxSizeMb={50}
                            helper={'helper' in attachment ? attachment.helper : undefined}
                            onFileChange={(file) => setFiles((prev) => ({...prev, [attachment.name]: file}))}
                            error={
                                isSubmitted && !files[attachment.name]
                                    ? `${attachment.label} 파일을 첨부해 주세요.`
                                    : undefined
                            }
                        />
                    ))}
                </div>
            </FormCard>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit" variant="default" size="sm">
                        입력 내용 확인
                    </Button>
                    <FormResetButton />
                </div>
                <FormSubmitResult data={submittedData} />
            </div>
        </form>
    )
}

const AttachFieldDemo = withFormReset(AttachFieldDemoBody)

export {AttachFieldDemo}
