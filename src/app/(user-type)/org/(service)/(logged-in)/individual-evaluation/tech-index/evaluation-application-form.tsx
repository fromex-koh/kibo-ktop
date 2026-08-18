'use client'

import {useState, type SubmitEvent} from 'react'
import {useRouter} from 'next/navigation'
import {AttachField} from '@/components/composite/attach-field'
import {FormCard} from '@/components/composite/form-card'
import {SubmitConfirmDialog} from '@/components/composite/submit-confirm-dialog'

// 기관 개별평가 Tech-Index 3단계 평가 신청하기 입력 묶음 — Figma "4단계_평가 신청하기".
// 첨부 서류 세 개가 한 폼이고, 화면 하단의 [제출]이 form 속성으로 이 폼을 제출한다.
//
// 검사를 모두 통과하면 이 화면 위에 제출 전 확인 모달("제출하시겠습니까?")을 띄우고,
// 모달의 [제출]이 (5) 완료 화면으로 넘어간다 — 별도 화면으로 이동하지 않는다.
// 완료 화면 경로는 갈래(일반/창업)마다 달라 completePath 로 받는다.
// [프론트엔드 연동] 아래 두 console.log 자리만 신청·제출 API 호출로 바꾸면 된다.

// 첨부 서류 — 이름·필수 여부는 시안 그대로다. 정책(확장자·용량)은 시안에 없어 정보이용동의서와 같은
// 문서 4종·50MB 로 두었다. [프론트엔드 연동] 실제 정책이 정해지면 accept·maxSizeMb 만 바꾼다.
const ATTACHMENT_ACCEPT = '.pdf,.zip,.rar,.7z'
const ATTACHMENT_MAX_SIZE_MB = 50

const ATTACHMENTS = [
    {name: 'ceoHealthInsuranceCertificate', label: '대표자 건강보험 자격 득실 확인서'},
    {name: 'socialInsuranceMemberList', label: '4대 사회보험 사업장 가입자 명부'},
    {
        name: 'patentCertificate',
        label: '특허등록증',
        helper: '※ 다수 특허의 경우 압축하여 업로드해 주세요.',
    },
] as const

type EvaluationApplicationFormProps = {
    // 화면 하단 [제출] 버튼이 form 속성으로 가리키는 이름.
    formId: string
    // 모달의 [제출]을 통과하면 넘어갈 (5) 완료 화면.
    completePath: string
}

const EvaluationApplicationForm = ({formId, completePath}: EvaluationApplicationFormProps) => {
    const router = useRouter()
    const [files, setFiles] = useState<Record<string, File | null>>({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const setFile = (name: string) => (file: File | null) => setFiles((prev) => ({...prev, [name]: file}))

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitted(true)

        if (ATTACHMENTS.some((attachment) => !files[attachment.name])) return

        // [프론트엔드 연동][신청] 평가 신청 API 는 이 자리에서 호출한다 — 콘솔의 같은 문구로 검색하면
        // 제출 버튼부터 서버 신청까지 연결할 위치를 바로 찾을 수 있다. 첨부는 File 그대로 넘긴다.
        console.log(
            '[프론트엔드 연동][신청] 기관 개별평가 Tech-Index 평가 신청 첨부파일',
            Object.fromEntries(ATTACHMENTS.map((attachment) => [attachment.name, files[attachment.name]])),
        )
        setIsConfirmOpen(true)
    }

    // 모달의 [제출] — 제출 API 를 부르고 완료 화면으로 넘어가는 자리다.
    const handleConfirmSubmit = () => {
        console.log('[프론트엔드 연동][제출] 기관 개별평가 Tech-Index 최종 제출 — 이 자리에서 제출 API 를 호출한다')
        router.push(completePath)
    }

    return (
        <form id={formId} noValidate onSubmit={handleSubmit}>
            <FormCard title="첨부파일" subtitle="평가 신청에 필요한 서류를 첨부해 주세요.">
                {/* 첨부 칸 사이 간격은 시안 40이다. */}
                <div className="flex flex-col gap-10">
                    {ATTACHMENTS.map((attachment) => (
                        <AttachField
                            key={attachment.name}
                            label={attachment.label}
                            name={attachment.name}
                            required
                            accept={ATTACHMENT_ACCEPT}
                            maxSizeMb={ATTACHMENT_MAX_SIZE_MB}
                            helper={'helper' in attachment ? attachment.helper : undefined}
                            onFileChange={setFile(attachment.name)}
                            error={
                                isSubmitted && !files[attachment.name]
                                    ? `${attachment.label} 파일을 첨부해 주세요.`
                                    : undefined
                            }
                        />
                    ))}
                </div>
            </FormCard>

            {/* 제출 전 최종 확인 — 검사를 통과한 제출이 이 모달을 연다. [취소]는 닫고 화면에 남는다. */}
            <SubmitConfirmDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen} onSubmit={handleConfirmSubmit} />
        </form>
    )
}

export {EvaluationApplicationForm}
export type {EvaluationApplicationFormProps}
