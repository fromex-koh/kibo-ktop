'use client'

import {useState} from 'react'
import {FileUpload} from '@/components/composite/file-upload'
import {
    FormResetButton,
    FormSubmitResult,
    formatSubmitResult,
    withFormReset,
    type FormResetProps,
} from '@/components/custom/form-submit-result'
import {Button} from '@/components/ui/button'

const BYTES_PER_KB = 1024

// 파일 업로드의 폼 제출 예시 — 고른 파일이 name 으로 FormData 에 실리는 것과, 비어 있을 때의 오류 안내를 보여 준다.
// 파일 자체는 JSON 으로 보일 수 없어 이름 · 용량 · 형식만 풀어 적는다.
const FileUploadFormDemoBody = ({onReset}: FormResetProps) => {
    const [hasFile, setHasFile] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submittedData, setSubmittedData] = useState<string | null>(null)

    return (
        <form
            className="flex flex-col gap-4"
            noValidate
            onReset={onReset}
            onSubmit={(event) => {
                event.preventDefault()
                setIsSubmitted(true)

                const file = new FormData(event.currentTarget).get('consentFile')
                if (!(file instanceof File) || !file.name) {
                    setSubmittedData(null)
                    return
                }

                setSubmittedData(
                    formatSubmitResult({
                        consentFile: {
                            name: file.name,
                            sizeKb: Math.ceil(file.size / BYTES_PER_KB),
                            type: file.type,
                        },
                    }),
                )
            }}
        >
            <FileUpload
                name="consentFile"
                accept=".pdf,.zip,.rar,.7z"
                maxSizeMb={50}
                hint="PDF, ZIP, RAR, 7Z 파일 1개 첨부 가능 (파일당 최대 50MB)"
                onFileChange={(file) => setHasFile(file !== null)}
                error={isSubmitted && !hasFile ? '파일을 첨부해 주세요.' : undefined}
            />
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

const FileUploadFormDemo = withFormReset(FileUploadFormDemoBody)

export default FileUploadFormDemo
