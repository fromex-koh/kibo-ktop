'use client'

import {useEffect, useId, useRef, useState, type DragEvent, type ReactNode} from 'react'
import {Upload} from 'lucide-react'
import {
    FileUploadError,
    FileUploadSuccess,
    type FileUploadErrorProps,
    type FileUploadSuccessProps,
} from '@/components/composite/file-upload-result'
import {Button} from '@/components/ui/button'
import {FieldError} from '@/components/ui/field'
import {formatFileSize} from '@/lib/file'
import {cn} from '@/lib/utils'

// 파일 업로드 필드(FileUploadField) — 시안 "파일첨부" 묶음. [레이블 + 우측 보조 액션] 아래에 첨부 상자를 두고,
// 파일을 고르면 시안 "데이터 입력 성공"·"데이터 입력 오류" 결과 패널로 바뀐다.
//
// ⚠️ 공통 FileUpload(composite/file-upload.tsx)와는 별개 컴포넌트다. 결과 패널·다시 업로드·다운로드처럼
// 이 흐름에만 필요한 것들이 계속 늘어서, 공통 상자에 옵션을 얹는 대신 여기서 독립적으로 갖는다.
// 그래서 공통 FileUpload 를 쓰는 다른 화면(기관 고객정보활용동의 등)은 이 파일의 변경에 영향을 받지 않는다.
// 첨부 상자의 겉모습·문구·첨부 정책 검사 방식은 공통 FileUpload 와 같은 값을 쓴다(시안이 같은 컴포넌트다).
//
// 상태는 셋이다.
//   · 비어 있음 — 안내 문구 + [파일선택] 버튼(끌어다 놓기도 받는다)
//   · 성공 — 파일명·용량·[다운로드]·업로드 일시 + [다시 업로드]
//   · 오류 — 첨부 정책(확장자·용량·개수)에 걸렸거나, 화면이 넘긴 서버 검증 결과가 실패일 때
// 화면이 result 를 넘기면 그 값이 위 자동 상태보다 우선한다 — 서버 검증 결과를 그대로 보여 주는 자리다.
//
// 접근성
//  · 업로드가 한 화면에 둘 이상이라 [파일선택] 버튼 이름만으로는 자리를 구분할 수 없다. 묶음을 role="group"
//    으로 두고 레이블을 aria-labelledby 로 이어 "…업로드 (필수) 그룹 안의 파일선택 버튼"으로 읽히게 한다[7.4.1].
//    레이블을 <label htmlFor> 로 두지 않는 이유 — <input type="file"> 이 hidden 이라 포커스를 받지 않고,
//    실제 조작은 버튼이 한다. 숨은 컨트롤을 가리키는 label 은 아무 데도 닿지 않는다.
//  · 필수 표시(*)는 장식이라 aria-hidden 이고 보조기기에는 "(필수)" 문구를 준다[5.3.1].
//  · 끌어다 놓기는 마우스 전용 보조 수단이고, 같은 일을 [파일선택] 버튼으로 키보드만으로도 할 수 있다[6.1.1].
//  · [다시 업로드]를 누르면 포커스가 사라지지 않도록 다시 나타난 [파일선택] 버튼으로 옮긴다.

// 시안 문구 — 사용처에서 바꿀 수 있게 기본값으로 둔다.
const DEFAULT_DESCRIPTION = '첨부할 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을 눌러 파일을 직접 선택해주세요.'

const BYTES_PER_MB = 1024 * 1024

// accept 에 적힌 확장자(.xlsx·.zip …)만 뽑는다 — 확장자 검사와 안내 문구를 같은 출처에서 만든다.
// zip·rar·7z 는 브라우저·OS 마다 MIME 이 제각각이라 <input accept> 만으로는 거를 수 없어 직접 본다.
const ACCEPT_EXTENSION_PATTERN = /\.[a-z0-9]+/gi

const parseExtensions = (accept?: string): string[] =>
    (accept?.match(ACCEPT_EXTENSION_PATTERN) ?? []).map((token) => token.slice(1).toLowerCase())

const getExtension = (fileName: string): string => fileName.split('.').pop()?.toLowerCase() ?? ''

// 업로드 일시 표기(시안 "2026-08-11 11:32") — 서버 응답이 붙기 전까지는 파일을 고른 시각을 쓴다.
const formatUploadedAt = (date: Date) => {
    const pad = (value: number) => String(value).padStart(2, '0')

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

// [프론트엔드 연동] 표준 양식 포맷 위반(행·열 단위 검증 실패) 예시 — 어떤 규칙으로 검사하는지가 아직
// 정해지지 않아 시안 문구를 그대로 둔 자리 표시자다. 검증 API 가 붙으면 그 결과를 result 로 넘기면 되고,
// 그때는 이 값이 쓰이지 않는다.
const FORMAT_ERROR_DETAILS = [
    {label: '3행', value: '올바르지 않은 데이터 형식입니다.'},
    {label: '5행 F9열', value: '데이터가 입력되지 않았습니다.'},
] as const

// 화면이 들고 있는 첨부 상태 — 고른 파일은 성공, 정책에 걸린 파일은 오류로 보여 준다.
// 두 경우 모두 파일을 다시 열어 볼 수 있게 임시 주소를 만든다(지목할 파일이 없으면 주소도 없다).
type AttachedFile = {
    file: File | null
    uploadedAt: string
    downloadHref?: string
    rejection?: string
}

type FileUploadFieldProps = {
    // 업로드 자리의 이름. 예: "평가내역조회용 표준엑셀 업로드"
    label: ReactNode
    // 레이블 오른쪽 보조 액션. 예: 양식 다운로드 버튼. 생략하면 레이블만 놓인다.
    action?: ReactNode
    // 폼에 담길 이름. 제출값은 선택된 File 이다.
    name: string
    // 받을 확장자·MIME(<input accept>). 아래 hint 는 사람이 읽는 안내라 따로 적는다.
    accept?: string
    // 파일 한 개의 최대 용량(MB). 넘으면 첨부하지 않고 오류 결과로 알린다.
    maxSizeMb?: number
    required?: boolean
    // 비어 있을 때의 안내 문구와 그 아래 보조 문구("지원 형식: …").
    description?: ReactNode
    hint?: ReactNode
    // 성공 결과의 설명 문구. 화면마다 CTA 이름이 달라 바꿀 수 있게 둔다.
    completeDescription?: ReactNode
    // 성공 결과에서 파일 줄 아래에 함께 보여 줄 항목(데이터 건수 등). 업로드 일시는 이 컴포넌트가 붙인다.
    completeDetails?: FileUploadSuccessProps['details']
    // 선택·삭제 시점에 상위 화면이 알아야 할 때 쓴다(CTA 활성화·제출 검사 등).
    onFileChange?: (file: File | null) => void
    // 표준 양식 포맷 위반 여부. 파일 종류·용량 같은 첨부 정책과 별개 케이스다 —
    // true 면 고른 파일을 행·열 오류 목록이 있는 오류 결과로 보여 준다.
    // [프론트엔드 연동] 지금은 화면에서 케이스를 확인하기 위한 스위치다. 검증 API 가 붙으면 이 값 대신
    // 실제 검증 결과를 result 로 넘긴다.
    hasFormatError?: boolean
    // 서버 검증 결과. 넘기면 위 자동 상태 대신 이 값을 보여 준다.
    result?:
        | ({status: 'success'} & Omit<FileUploadSuccessProps, 'className'>)
        | ({status: 'error'} & Omit<FileUploadErrorProps, 'className'>)
    // 제출 검사에서 걸린 안내 문구. 주면 상자 아래에 띄우고 [파일선택] 버튼에 잇는다[7.4.2].
    error?: string
    className?: string
}

const FileUploadField = ({
    label,
    action,
    name,
    accept,
    maxSizeMb,
    required,
    description = DEFAULT_DESCRIPTION,
    hint,
    completeDescription,
    completeDetails,
    hasFormatError,
    onFileChange,
    result,
    error,
    className,
}: FileUploadFieldProps) => {
    const labelId = useId()
    const descriptionId = useId()
    const errorId = useId()
    const inputRef = useRef<HTMLInputElement>(null)
    const selectRef = useRef<HTMLButtonElement>(null)

    const [attached, setAttached] = useState<AttachedFile>()
    const [isDragging, setIsDragging] = useState(false)

    // 임시 주소 반납 — 파일이 바뀌면 직전 주소를, 화면을 떠나면 마지막 주소를 되돌린다.
    // 반납하지 않으면 그 파일이 탭이 닫힐 때까지 메모리에 남는다.
    useEffect(() => {
        const href = attached?.downloadHref
        if (!href) return

        return () => URL.revokeObjectURL(href)
    }, [attached])

    const extensions = parseExtensions(accept)

    // 정책에 맞지 않으면 안내 문구를, 맞으면 빈 문자열을 돌려준다.
    const findRejection = (file: File): string => {
        if (extensions.length && !extensions.includes(getExtension(file.name))) {
            return `${extensions.map((extension) => extension.toUpperCase()).join(', ')} 파일만 첨부할 수 있습니다.`
        }
        if (maxSizeMb && file.size > maxSizeMb * BYTES_PER_MB) {
            return `파일 용량은 ${maxSizeMb}MB 이하만 첨부할 수 있습니다.`
        }
        return ''
    }

    const clearInput = () => {
        if (inputRef.current) inputRef.current.value = ''
    }

    const attach = (file: File | null, forcedRejection?: string) => {
        if (!file && !forcedRejection) {
            clearInput()
            setAttached(undefined)
            onFileChange?.(null)
            return
        }

        const rejection = forcedRejection || (file ? findRejection(file) : '')
        // 걸린 파일은 값으로 남기지 않는다 — 폼 제출에 실리면 안 된다.
        if (rejection) clearInput()

        setAttached({
            file,
            uploadedAt: formatUploadedAt(new Date()),
            downloadHref: file ? URL.createObjectURL(file) : undefined,
            rejection: rejection || undefined,
        })
        onFileChange?.(rejection ? null : file)
    }

    // 끌어다 놓은 파일도 input 의 값으로 넣어 둔다 — 그래야 폼 제출에 함께 실린다.
    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(false)

        const dropped = event.dataTransfer.files
        if (!dropped.length || !inputRef.current) return

        // 한 개만 받는다 — 여러 개를 놓으면 무엇이 첨부됐는지 알 수 없으므로 첨부하지 않고 알린다.
        if (dropped.length > 1) {
            attach(null, '파일은 1개만 첨부할 수 있습니다.')
            return
        }

        inputRef.current.files = dropped
        attach(dropped[0])
    }

    const handleReupload = () => {
        attach(null)
        // 상태가 바뀌며 [파일선택] 버튼이 다시 그려진 뒤에 포커스를 옮긴다.
        requestAnimationFrame(() => selectRef.current?.focus())
    }

    // 화면이 넘긴 서버 검증 결과가 있으면 그쪽이 우선한다.
    // 없으면 첨부 상태로 정한다 — 오류는 두 갈래이고 설명 자리에 들어갈 말이 서로 다르다.
    //   · 첨부 정책 위반(종류·용량·개수) — 목록 없이 그 사유를 설명 줄에 적는다.
    //   · 표준 양식 포맷 위반 — 행·열 목록을 넘기고 설명은 목록을 가리키는 기본 문구를 쓴다.
    const fileSummary = attached
        ? {
              fileName: attached.file?.name,
              fileSize: attached.file ? formatFileSize(attached.file.size) : undefined,
              downloadHref: attached.downloadHref,
              // 스스로 만든 상태에는 되돌리기 동작이 없다 — 아래에서 이 컴포넌트의 기본 동작을 잇는다.
              onReupload: undefined,
          }
        : undefined

    const shownResult =
        result ??
        (attached && fileSummary
            ? attached.rejection
                ? ({...fileSummary, status: 'error', description: attached.rejection} as const)
                : hasFormatError
                  ? ({
                        ...fileSummary,
                        status: 'error',
                        title: (
                            <>
                                <span className="text-error-500">{FORMAT_ERROR_DETAILS.length}건</span>의 문제가
                                발견되었어요
                            </>
                        ),
                        details: FORMAT_ERROR_DETAILS,
                    } as const)
                  : ({
                        ...fileSummary,
                        status: 'success',
                        description: completeDescription,
                        details: [...(completeDetails ?? []), {label: '업로드 일시', value: attached.uploadedAt}],
                    } as const)
            : undefined)

    return (
        <div
            role="group"
            aria-labelledby={labelId}
            data-slot="file-upload-field"
            // 간격은 공통 Field 와 같다 — 레이블 줄 아래 16, 상자 아래 메시지 8(gap-2 + 레이블 mb-2).
            className={cn('flex flex-col gap-2', className)}
        >
            {/* 레이블과 액션은 한 줄에 놓이고, 좁은 화면에서는 액션이 아래로 접힌다. */}
            <div
                data-slot="file-upload-field-header"
                className="mb-2 flex flex-wrap items-center justify-between gap-2"
            >
                <span id={labelId} className="typo-body-xl-bold text-foreground flex items-center gap-1">
                    {label}
                    {required ? (
                        <>
                            <span aria-hidden="true" className="text-error-500">
                                *
                            </span>
                            <span className="sr-only"> (필수)</span>
                        </>
                    ) : null}
                </span>
                {action ? <div data-slot="file-upload-field-action">{action}</div> : null}
            </div>

            <input
                ref={inputRef}
                type="file"
                hidden
                name={name}
                accept={accept}
                required={required}
                onChange={(event) => attach(event.target.files?.[0] ?? null)}
            />

            {/* 화면이 result 에 onReupload 를 함께 넘겼으면 그쪽을 쓴다 — 서버에 올린 것까지 되돌려야 하는
                경우가 있어 이 컴포넌트의 기본 동작(첨부 상자로 되돌리기)을 덮을 수 있어야 한다. */}
            {shownResult?.status === 'success' ? (
                <FileUploadSuccess {...shownResult} onReupload={shownResult.onReupload ?? handleReupload} />
            ) : shownResult?.status === 'error' ? (
                <FileUploadError {...shownResult} onReupload={shownResult.onReupload ?? handleReupload} />
            ) : (
                <div
                    // 끌어다 놓기는 마우스 보조 수단이라 이 상자 자체는 포커스를 받지 않는다(같은 일을 버튼이 한다).
                    onDragOver={(event) => {
                        event.preventDefault()
                        setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={cn(
                        'bg-surface flex flex-col items-center gap-6 rounded-sm border p-10',
                        isDragging ? 'border-primary bg-file-upload-complete' : 'border-control',
                        error && !isDragging && 'border-destructive',
                    )}
                >
                    <div className="flex flex-col items-center gap-1 text-center">
                        <p id={descriptionId} className="typo-body-xl-regular text-label-foreground">
                            {description}
                        </p>
                        {hint ? <p className="typo-body-l-regular text-foreground-subtle">{hint}</p> : null}
                    </div>
                    <Button
                        ref={selectRef}
                        type="button"
                        variant="tertiary"
                        size="sm"
                        aria-invalid={error ? true : undefined}
                        aria-describedby={cn(descriptionId, error && errorId)}
                        onClick={() => inputRef.current?.click()}
                    >
                        <Upload aria-hidden="true" />
                        파일선택
                    </Button>
                </div>
            )}

            {error ? <FieldError id={errorId}>{error}</FieldError> : null}
        </div>
    )
}

export {FileUploadField}
export type {FileUploadFieldProps}
