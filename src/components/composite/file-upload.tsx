'use client'

import {useId, useRef, useState, type DragEvent, type ReactNode} from 'react'
import {Check, Upload, X} from 'lucide-react'
import {Icon} from '@/components/custom/icon'
import {Button} from '@/components/ui/button'
import {FieldError} from '@/components/ui/field'
import {cn} from '@/lib/utils'

// 파일 업로드(FileUpload) — 시안 "파일첨부" 영역. 두 상태를 한 컴포넌트가 들고 있다.
//  · 비어 있음: 점선 없는 테두리 상자 안에 안내 문구 + [파일선택] 버튼(끌어다 놓기도 받는다).
//  · 업로드 완료: 파란 톤 면으로 바뀌고 완료 아이콘·문구와 첨부된 파일 한 줄을 보여 준다.
//
// 파일을 실제로 서버에 올리는 일은 하지 않는다 — 선택된 파일을 form 에 담고 화면 상태만 바꾼다.
// 값은 숨은 <input type="file"> 이 그대로 들고 있으므로 폼 제출(FormData)에 name 으로 실린다.
//
// 첨부 정책(확장자·용량·개수)은 여기서 거른다. 걸린 파일은 값으로 남기지 않고 상자 아래에 이유를 띄운다 —
// 브라우저의 accept 는 파일 선택창의 필터일 뿐이라 끌어다 놓기나 "모든 파일"로 고른 경우를 막지 못한다.
//
// 접근성
//  · 끌어다 놓기는 마우스 전용 보조 수단이고, 같은 일을 [파일선택] 버튼으로 키보드만으로도 할 수 있다[6.1.1].
//  · input 은 sr-only 가 아니라 hidden 이다 — 버튼이 접근 이름을 갖고 input 은 값을 담는 그릇이라,
//    포커스가 두 번 서면 같은 동작이 중복으로 읽힌다.
//  · 업로드 결과는 화면 일부만 바뀌므로 role="status" 로 알린다[8.2.1].
//  · 삭제 버튼을 누르면 포커스가 사라지지 않도록 다시 나타난 [파일선택] 버튼으로 옮긴다.

// 시안 문구 — 사용처에서 바꿀 수 있게 기본값으로 둔다.
const DEFAULT_DESCRIPTION = '첨부할 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을 눌러 파일을 직접 선택해주세요.'
const DEFAULT_COMPLETE_TITLE = '파일이 정상적으로 업로드되었어요'
const DEFAULT_COMPLETE_DESCRIPTION = '파일 내용을 검토한 후 [신청] 버튼을 눌러주세요.'

const BYTES_PER_MB = 1024 * 1024

// accept 에 적힌 확장자(.pdf·.zip …)만 뽑는다 — 확장자 검사와 안내 문구를 같은 출처에서 만든다.
// zip·rar·7z 는 브라우저·OS 마다 MIME 이 제각각이라 <input accept> 만으로는 거를 수 없어 직접 본다.
const ACCEPT_EXTENSION_PATTERN = /\.[a-z0-9]+/gi

const parseExtensions = (accept?: string): string[] =>
    (accept?.match(ACCEPT_EXTENSION_PATTERN) ?? []).map((token) => token.slice(1).toLowerCase())

const getExtension = (fileName: string): string => fileName.split('.').pop()?.toLowerCase() ?? ''

type FileUploadProps = {
    // 폼에 담길 이름. 제출값은 선택된 File 이다.
    name: string
    // 받을 확장자·MIME(<input accept>). 아래 hint 는 사람이 읽는 안내라 따로 적는다.
    // 확장자(.pdf 형태)를 적어 두면 고른 파일의 확장자도 같은 목록으로 검사한다.
    accept?: string
    // 파일 한 개의 최대 용량(MB). 넘으면 첨부하지 않고 안내를 띄운다.
    maxSizeMb?: number
    required?: boolean
    // 비어 있을 때의 안내 문구와 그 아래 보조 문구("PDF 파일만 가능").
    description?: ReactNode
    hint?: ReactNode
    // 업로드 완료 상태의 제목·설명.
    completeTitle?: ReactNode
    completeDescription?: ReactNode
    // 선택·삭제 시점에 상위 화면이 알아야 할 때 쓴다(CTA 활성화 등).
    onFileChange?: (file: File | null) => void
    // 제출 검사에서 걸린 안내 문구. 주면 상자 아래에 띄우고 [파일선택] 버튼에 잇는다[7.4.2].
    // 첨부 정책(확장자·용량·개수)에 걸린 안내는 이 컴포넌트가 직접 만들며, 그쪽이 먼저 표시된다.
    error?: string
    className?: string
}

const FileUpload = ({
    name,
    accept,
    maxSizeMb,
    required,
    description = DEFAULT_DESCRIPTION,
    hint,
    completeTitle = DEFAULT_COMPLETE_TITLE,
    completeDescription = DEFAULT_COMPLETE_DESCRIPTION,
    onFileChange,
    error,
    className,
}: FileUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const selectRef = useRef<HTMLButtonElement>(null)
    const [fileName, setFileName] = useState('')
    const [rejection, setRejection] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    const descriptionId = useId()
    const errorId = useId()

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

    const applyFile = (file: File | null) => {
        if (!file) {
            setFileName('')
            setRejection('')
            onFileChange?.(null)
            return
        }

        const message = findRejection(file)
        if (message) {
            // 걸린 파일은 값으로 남기지 않는다 — 폼 제출에 실리면 안 된다.
            clearInput()
            setFileName('')
            setRejection(message)
            onFileChange?.(null)
            return
        }

        setFileName(file.name)
        setRejection('')
        onFileChange?.(file)
    }

    // 끌어다 놓은 파일도 input 의 값으로 넣어 둔다 — 그래야 폼 제출에 함께 실린다.
    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(false)

        const dropped = event.dataTransfer.files
        if (!dropped.length || !inputRef.current) return

        // 한 개만 받는다 — 여러 개를 놓으면 무엇이 첨부됐는지 알 수 없으므로 첨부하지 않고 알린다.
        if (dropped.length > 1) {
            clearInput()
            setFileName('')
            setRejection('파일은 1개만 첨부할 수 있습니다.')
            onFileChange?.(null)
            return
        }

        inputRef.current.files = dropped
        applyFile(dropped[0])
    }

    const handleRemove = () => {
        clearInput()
        applyFile(null)
        // 상태가 바뀌며 [파일선택] 버튼이 다시 그려진 뒤에 포커스를 옮긴다.
        requestAnimationFrame(() => selectRef.current?.focus())
    }

    // 방금 걸린 파일 안내가 제출 검사 안내보다 급하다 — 사용자가 마지막으로 한 행동의 결과다.
    const message = rejection || error

    return (
        <div className={className}>
            <input
                ref={inputRef}
                type="file"
                hidden
                name={name}
                accept={accept}
                required={required}
                onChange={(event) => applyFile(event.target.files?.[0] ?? null)}
            />

            {fileName ? (
                <div className="bg-file-upload-complete border-file-upload-complete-border flex flex-col gap-6 rounded-sm border p-10">
                    <div className="flex flex-col items-center gap-4" role="status">
                        {/* 완료 표식은 장식이다 — 뜻은 아래 문구가 전달한다[5.1.1]. */}
                        <Icon variant="solid" icon={Check} className="bg-primary text-primary-foreground size-15" />
                        <div className="flex flex-col items-center gap-1 text-center">
                            <p className="typo-body-xl-bold text-label-foreground">{completeTitle}</p>
                            {completeDescription ? (
                                <p className="typo-body-l-regular text-foreground-subtle">{completeDescription}</p>
                            ) : null}
                        </div>
                    </div>

                    <div className="bg-card flex items-center justify-between gap-4 rounded-sm px-6 py-6">
                        <p className="typo-body-xl-regular text-label-foreground min-w-0 truncate">{fileName}</p>
                        <Button
                            type="button"
                            variant="plain"
                            size="icon-sm"
                            aria-label={`첨부파일 ${fileName} 삭제`}
                            onClick={handleRemove}
                        >
                            <X aria-hidden="true" />
                        </Button>
                    </div>
                </div>
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
                        message && !isDragging && 'border-destructive',
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
                        aria-invalid={message ? true : undefined}
                        aria-describedby={cn(descriptionId, message && errorId)}
                        onClick={() => inputRef.current?.click()}
                    >
                        <Upload aria-hidden="true" />
                        파일선택
                    </Button>
                </div>
            )}

            {message ? (
                <FieldError id={errorId} className="mt-2">
                    {message}
                </FieldError>
            ) : null}
        </div>
    )
}

export {FileUpload}
export type {FileUploadProps}
