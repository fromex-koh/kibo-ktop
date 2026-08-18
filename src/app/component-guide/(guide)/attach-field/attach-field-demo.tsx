'use client'

import {useState} from 'react'
import {AttachField} from '@/components/composite/attach-field'
import {FormCard} from '@/components/composite/form-card'
import {Button} from '@/components/ui/button'

// 가이드 데모 — 실제로 파일을 골라 보며 첨부·삭제·제출 검사를 확인하는 자리다.

const DEMO_ATTACHMENTS = [
    {name: 'guideCeoHealthInsurance', label: '대표자 건강보험 자격 득실 확인서'},
    {name: 'guideSocialInsurance', label: '4대 사회보험 사업장 가입자 명부'},
    {name: 'guidePatentCertificate', label: '특허등록증', helper: '※ 다수 특허의 경우 압축하여 업로드해 주세요.'},
] as const

const AttachFieldDemo = () => {
    const [files, setFiles] = useState<Record<string, File | null>>({})
    const [isSubmitted, setIsSubmitted] = useState(false)

    return (
        <form
            noValidate
            onSubmit={(event) => {
                event.preventDefault()
                setIsSubmitted(true)
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
            <Button type="submit" size="md" className="self-center">
                제출 검사
            </Button>
        </form>
    )
}

export {AttachFieldDemo}
