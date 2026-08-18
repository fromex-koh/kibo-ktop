'use client'

import {useId, useState, type SubmitEvent} from 'react'
import {useRouter} from 'next/navigation'
import {FileUploadField} from '@/components/composite/file-upload-field'
import {SubmitConfirmDialog} from '@/components/composite/submit-confirm-dialog'
import {FormCard} from '@/components/composite/form-card'
import {Field} from '@/components/composite/form-fields'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {TextareaCounter} from '@/components/composite/textarea-counter'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'

// 기관 일괄평가 2단계 일괄평가 진행 신청 입력 묶음 — Figma "[일괄평가] 2단계_일괄평가 진행 신청".
// 대량정보 조회 신청(bulk-data-request)과 같은 뼈대이고 문구·이동할 완료 화면만 다르다.
// 카드 두 장이 한 폼이고, 화면 하단의 [신청]이 form 속성으로 이 폼을 제출한다.
//
// [프론트엔드 연동] 아래 console.log 자리만 신청 API 호출로 바꾸면 된다. 검사를 모두 통과하면
// (4) 일괄평가 신청 완료 화면으로 넘어간다 — API 가 붙으면 성공 응답 뒤로 이동을 옮긴다.
//
// 파일을 고르면 시안대로 결과 패널(FileUploadResult)로 바뀐다. 지금은 브라우저가 아는 값(파일명·용량·
// 업로드 일시)만 채우고, 서버만 아는 값(데이터 건수·검증 오류 목록)은 비워 둔다 —
// 검사 API 가 붙으면 그 응답을 status·details 에 그대로 넣으면 오류 케이스까지 같은 컴포넌트로 표시된다.

const PURPOSE_FIELD = 'businessTask'
const DIRECT_PURPOSE_FIELD = 'businessTaskName'
const DIRECT_PURPOSE = 'etc'
const BATCH_EVALUATION_PURPOSE_FIELD = 'batchEvaluationPurpose'
const BATCH_EVALUATION_PURPOSE_MAX_LENGTH = 500
const EXCEL_FILE_NAME = 'batchEvaluationStandardExcel'
const CONSENT_FILE_NAME = 'informationConsentArchive'

// 표준엑셀 — 스프레드시트 3종, 1개, 50MB(시안 "지원 형식: XLSX, XLS, CSV (최대 50MB)").
const EXCEL_ACCEPT = '.xlsx,.xls,.csv'
const EXCEL_MAX_SIZE_MB = 50
// 동의서 압축파일 — 압축 3종, 1개, 1GB(시안 "지원 형식: ZIP, PAR, 7Z (최대 1GB)").
// 시안의 'PAR' 는 RAR 오타로 보고 RAR 로 둔다 — 기관 개별평가 동의서 업로드도 PDF·ZIP·RAR·7Z 를 받는다.
const CONSENT_ACCEPT = '.zip,.rar,.7z'
const CONSENT_MAX_SIZE_MB = 1024

// [프론트엔드 연동] 실제 목록은 사업/과제 조회 API 로 받는다 — 아래는 화면 확인용 예시다.
const BUSINESS_TASK_OPTIONS = [
    {value: DIRECT_PURPOSE, label: '기타 (직접입력)'},
    {value: '기술보증 지원사업', label: '기술보증 지원사업'},
    {value: 'IP 담보 보증', label: 'IP 담보 보증'},
    {value: '혁신성장 기술보증', label: '혁신성장 기술보증'},
    {value: '신용보증 지원사업', label: '신용보증 지원사업'},
    {value: '청년 창업기업 보증', label: '청년 창업기업 보증'},
    {value: '혁신성장 보증', label: '혁신성장 보증'},
    {value: '스마트공장 구축 지원', label: '스마트공장 구축 지원'},
    {value: '수출 바우처 지원', label: '수출 바우처 지원'},
    {value: '중소기업 R&D 지원', label: '중소기업 R&D 지원'},
] as const

// [프론트엔드 연동] 표준 양식 포맷 위반 케이스를 화면에서 확인하기 위한 스위치 —
// true 로 바꾸면 파일을 고른 뒤 행·열 오류 목록이 있는 오류 결과가 나온다.
// 파일 종류·용량 같은 첨부 정책 위반과는 다른 케이스이고, 그쪽은 지금도 실제로 재현된다.
// 검증 API 가 붙으면 이 스위치 대신 그 응답을 FileUploadField 의 result 로 넘긴다.
const HAS_FORMAT_ERROR = false

// [프론트엔드 연동] 현재 데이터 건수는 화면 확인용 고정값이다 — 신청 API 가 파일 검증 후 돌려주는
// 유효 데이터 행 개수(제목·빈 행 제외)로 교체한다. 업로드 일시는 FileUploadField 가 붙인다.
const SAMPLE_DATA_COUNT = [{label: '데이터 건수', value: '248건'}] as const

type BatchEvaluationRequestFormProps = {
    // 화면 하단 [신청] 버튼이 form 속성으로 가리키는 이름.
    formId: string
    // 모달의 [제출]을 통과하면 넘어갈 (4) 일괄평가 신청 완료 화면 — 갈래(일반/창업)마다 경로가 다르다.
    completePath: string
}

const BatchEvaluationRequestForm = ({formId, completePath}: BatchEvaluationRequestFormProps) => {
    const router = useRouter()
    const purposeFieldId = useId()
    const directPurposeFieldId = useId()
    const batchEvaluationPurposeFieldId = useId()

    const [businessTask, setBusinessTask] = useState('')
    const [directBusinessTask, setDirectBusinessTask] = useState('')
    const [batchEvaluationPurpose, setBatchEvaluationPurpose] = useState('')
    const [excelFile, setExcelFile] = useState<File | null>(null)
    const [consentFile, setConsentFile] = useState<File | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    // 제출을 눌러 본 뒤에만 안내를 띄운다 — 입력 전부터 빨간 문구가 깔리지 않게 한다[7.4.2].
    const isDirectPurpose = businessTask === DIRECT_PURPOSE
    const purposeError = isSubmitted && !businessTask
    const directPurposeError = isSubmitted && isDirectPurpose && !directBusinessTask.trim()
    const batchEvaluationPurposeError = isSubmitted && isDirectPurpose && !batchEvaluationPurpose.trim()
    const excelError = isSubmitted && !excelFile
    const consentError = isSubmitted && !consentFile

    // [프론트엔드 연동][파일 업로드] 표준엑셀 업로드 API는 이 함수에서 호출한다.
    // 콘솔의 같은 문구로 검색하면 파일 선택부터 서버 업로드까지 연결할 위치를 바로 찾을 수 있다.
    const handleExcelFileChange = (file: File | null) => {
        console.log('[프론트엔드 연동][파일 업로드] 일괄평가 표준엑셀', file)
        setExcelFile(file)
    }

    // [프론트엔드 연동][파일 업로드] 정보 제공 동의서 업로드 API는 이 함수에서 호출한다.
    const handleConsentFileChange = (file: File | null) => {
        console.log('[프론트엔드 연동][파일 업로드] 정보 제공 동의서 압축파일', file)
        setConsentFile(file)
    }

    const handleBusinessTaskChange = (value: string) => {
        setBusinessTask(value)
        if (value !== DIRECT_PURPOSE) {
            setDirectBusinessTask('')
            setBatchEvaluationPurpose('')
        }
    }

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitted(true)

        if (
            !businessTask ||
            (isDirectPurpose && (!directBusinessTask.trim() || !batchEvaluationPurpose.trim())) ||
            !excelFile ||
            !consentFile
        )
            return

        // 결과 패널로 바뀐 자리에는 <input type="file"> 이 없다(실제 흐름에서는 이미 서버에 올라간 파일이다).
        // 그래서 첨부는 폼 값이 아니라 이 화면이 들고 있는 File 을 그대로 넘긴다.
        console.log('[기관 일괄평가] 2단계 일괄평가 진행 신청 데이터', {
            [PURPOSE_FIELD]: businessTask,
            ...(isDirectPurpose
                ? {
                      [DIRECT_PURPOSE_FIELD]: directBusinessTask.trim(),
                      [BATCH_EVALUATION_PURPOSE_FIELD]: batchEvaluationPurpose.trim(),
                  }
                : {}),
            [EXCEL_FILE_NAME]: excelFile,
            [CONSENT_FILE_NAME]: consentFile,
        })
        setIsConfirmOpen(true)
    }

    // 모달의 [제출] — 제출 API 를 부르고 완료 화면으로 넘어가는 자리다.
    const handleConfirmSubmit = () => {
        console.log('[프론트엔드 연동][제출] 기관 일괄평가 진행 신청 최종 제출 — 이 자리에서 제출 API 를 호출한다')
        router.push(completePath)
    }

    return (
        <form id={formId} noValidate onSubmit={handleSubmit} className="flex flex-col gap-10">
            <FormCard title="일괄 기술사업 평가 목적">
                <div className="flex flex-col gap-6">
                    <Field
                        id={purposeFieldId}
                        label="사업/과제 선택"
                        required
                        error={purposeError ? '신청 목적이 되는 사업/과제를 선택해 주세요.' : undefined}
                    >
                        <Select
                            name={PURPOSE_FIELD}
                            required
                            value={businessTask}
                            onValueChange={handleBusinessTaskChange}
                        >
                            {/* 오류 상태를 컨트롤에도 건다 — Field 가 그린 메시지를 같은 id 로 잇는다[7.4.2]. */}
                            <SelectTrigger
                                id={purposeFieldId}
                                aria-invalid={purposeError || undefined}
                                aria-describedby={purposeError ? `${purposeFieldId}-error` : undefined}
                                className="w-full"
                            >
                                <SelectValue placeholder="선택해 주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                {BUSINESS_TASK_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    {isDirectPurpose ? (
                        <>
                            <Field
                                id={directPurposeFieldId}
                                label="사업/과제명 직접입력"
                                required
                                error={directPurposeError ? '사업명 또는 과제명을 입력해 주세요.' : undefined}
                            >
                                <Input
                                    id={directPurposeFieldId}
                                    name={DIRECT_PURPOSE_FIELD}
                                    required
                                    value={directBusinessTask}
                                    onChange={(event) => setDirectBusinessTask(event.currentTarget.value)}
                                    placeholder="사업명 또는 과제명을 입력해 주세요."
                                    autoComplete="off"
                                    aria-invalid={directPurposeError || undefined}
                                    aria-describedby={directPurposeError ? `${directPurposeFieldId}-error` : undefined}
                                />
                            </Field>

                            <Field
                                id={batchEvaluationPurposeFieldId}
                                label="일괄평가 목적"
                                required
                                error={
                                    batchEvaluationPurposeError
                                        ? '일괄평가의 목적을 구체적으로 작성해 주세요.'
                                        : undefined
                                }
                            >
                                <TextareaCounter
                                    id={batchEvaluationPurposeFieldId}
                                    name={BATCH_EVALUATION_PURPOSE_FIELD}
                                    required
                                    maxLength={BATCH_EVALUATION_PURPOSE_MAX_LENGTH}
                                    value={batchEvaluationPurpose}
                                    onChange={(event) => setBatchEvaluationPurpose(event.currentTarget.value)}
                                    placeholder="일괄평가의 목적을 구체적으로 작성해 주세요."
                                    autoComplete="off"
                                    aria-invalid={batchEvaluationPurposeError || undefined}
                                    aria-describedby={
                                        batchEvaluationPurposeError
                                            ? `${batchEvaluationPurposeFieldId}-error`
                                            : undefined
                                    }
                                    className="min-h-30"
                                />
                            </Field>
                        </>
                    ) : null}
                </div>
            </FormCard>

            <FormCard title="일괄평가 필수 양식">
                {/* 업로드 두 자리 사이 간격은 시안 40이다. */}
                <div className="flex flex-col gap-10">
                    <FileUploadField
                        label="일괄평가 조회용 표준엑셀 업로드"
                        required
                        // [프론트엔드 연동] 실제 양식 파일 경로를 연결한다.
                        action={
                            <Button type="button" variant="secondary" size="xs">
                                표준양식 다운로드
                            </Button>
                        }
                        name={EXCEL_FILE_NAME}
                        accept={EXCEL_ACCEPT}
                        maxSizeMb={EXCEL_MAX_SIZE_MB}
                        hint="지원 형식: XLSX, XLS, CSV (최대 50MB)"
                        onFileChange={handleExcelFileChange}
                        completeDetails={SAMPLE_DATA_COUNT}
                        hasFormatError={HAS_FORMAT_ERROR}
                        error={excelError ? '일괄평가 조회용 표준엑셀 파일을 첨부해 주세요.' : undefined}
                    />
                    <FileUploadField
                        label="정보 제공 동의서 압축파일 업로드"
                        required
                        action={
                            <Button type="button" variant="secondary" size="xs">
                                동의서 양식 다운로드
                            </Button>
                        }
                        name={CONSENT_FILE_NAME}
                        accept={CONSENT_ACCEPT}
                        maxSizeMb={CONSENT_MAX_SIZE_MB}
                        hint="지원 형식: ZIP, RAR, 7Z (최대 1GB)"
                        onFileChange={handleConsentFileChange}
                        completeDetails={SAMPLE_DATA_COUNT}
                        hasFormatError={HAS_FORMAT_ERROR}
                        error={consentError ? '정보 제공 동의서 압축파일을 첨부해 주세요.' : undefined}
                    />
                </div>
            </FormCard>

            {/* 제출 전 최종 확인 — 검사를 통과한 제출이 이 모달을 연다. [취소]는 닫고 화면에 남는다. */}
            <SubmitConfirmDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen} onSubmit={handleConfirmSubmit} />
        </form>
    )
}

export {BatchEvaluationRequestForm}
export type {BatchEvaluationRequestFormProps}
