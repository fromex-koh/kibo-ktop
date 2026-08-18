'use client'

import {useId, useRef, useState, type ReactNode} from 'react'
import {Upload, X} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {FieldDescription, FieldError} from '@/components/ui/field'
import {cn} from '@/lib/utils'

// 첨부 필드(AttachField) — 시안 "평가 신청하기"의 한 줄짜리 파일 첨부 칸.
// [레이블] 아래 상자 한 줄에 [선택된 파일 없음(또는 파일명 + 삭제)]과 [파일선택] 버튼이 놓인다.
// 끌어다 놓는 큰 첨부 상자(FileUpload)와 달리, 서류 여러 개를 나란히 받는 화면에서 낮게 쌓는 용도다.
//
// 파일을 실제로 서버에 올리는 일은 하지 않는다 — 선택된 파일을 form 에 담고 화면 상태만 바꾼다.
// 값은 숨은 <input type="file"> 이 그대로 들고 있으므로 폼 제출(FormData)에 name 으로 실린다.
//
// 첨부 정책(확장자·용량)은 여기서 거른다. 걸린 파일은 값으로 남기지 않고 상자 아래에 이유를 띄운다 —
// 브라우저의 accept 는 파일 선택창의 필터일 뿐이라 "모든 파일"로 고른 경우를 막지 못한다(FileUpload 와 동일).
//
// 접근성
//  · 한 화면에 첨부 칸이 여럿이라 [파일선택] 버튼 이름만으로는 자리를 구분할 수 없다. 묶음을 role="group"
//    으로 두고 레이블을 aria-labelledby 로 이어 "…확인서 (필수) 그룹 안의 파일선택 버튼"으로 읽히게 한다[7.4.1].
//    레이블을 <label htmlFor> 로 두지 않는 이유 — <input type="file"> 이 hidden 이라 포커스를 받지 않고,
//    실제 조작은 버튼이 한다.
//  · 필수 표시(*)는 장식이라 aria-hidden 이고 보조기기에는 "(필수)" 문구를 준다[5.3.1].
//  · 첨부 결과는 화면 일부만 바뀌므로 role="status" 로 알린다[8.2.1].
//  · 삭제 버튼을 누르면 포커스가 사라지지 않도록 [파일선택] 버튼으로 옮긴다.

const BYTES_PER_MB = 1024 * 1024

// accept 에 적힌 확장자(.pdf·.zip …)만 뽑는다 — 확장자 검사와 안내 문구를 같은 출처에서 만든다.
// zip·rar·7z 는 브라우저·OS 마다 MIME 이 제각각이라 <input accept> 만으로는 거를 수 없어 직접 본다.
const ACCEPT_EXTENSION_PATTERN = /\.[a-z0-9]+/gi

const parseExtensions = (accept?: string): string[] =>
    (accept?.match(ACCEPT_EXTENSION_PATTERN) ?? []).map((token) => token.slice(1).toLowerCase())

const getExtension = (fileName: string): string => fileName.split('.').pop()?.toLowerCase() ?? ''

type AttachFieldProps = {
    // 첨부 자리의 이름. 예: "대표자 건강보험 자격 득실 확인서"
    label: ReactNode
    // 폼에 담길 이름. 제출값은 선택된 File 이다.
    name: string
    // 받을 확장자·MIME(<input accept>). 확장자(.pdf 형태)로 적으면 고른 파일의 확장자도 같은 목록으로 검사한다.
    accept?: string
    // 파일 한 개의 최대 용량(MB). 넘으면 첨부하지 않고 안내를 띄운다.
    maxSizeMb?: number
    required?: boolean
    // 상자 아래 보조 안내. 예: "※ 다수 특허의 경우 압축하여 업로드해 주세요."
    helper?: ReactNode
    // 선택·삭제 시점에 상위 화면이 알아야 할 때 쓴다(제출 검사 등).
    onFileChange?: (file: File | null) => void
    // 제출 검사에서 걸린 안내 문구. 주면 상자 아래에 띄우고 [파일선택] 버튼에 잇는다[7.4.2].
    error?: string
    className?: string
}

const AttachField = ({
    label,
    name,
    accept,
    maxSizeMb,
    required,
    helper,
    onFileChange,
    error,
    className,
}: AttachFieldProps) => {
    const labelId = useId()
    const errorId = useId()
    const inputRef = useRef<HTMLInputElement>(null)
    const selectRef = useRef<HTMLButtonElement>(null)

    const [fileName, setFileName] = useState('')
    const [rejection, setRejection] = useState('')

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

    const applyFile = (file: File | null) => {
        if (!file) {
            if (inputRef.current) inputRef.current.value = ''
            setFileName('')
            setRejection('')
            onFileChange?.(null)
            return
        }

        const message = findRejection(file)
        if (message) {
            // 걸린 파일은 값으로 남기지 않는다 — 폼 제출에 실리면 안 된다.
            if (inputRef.current) inputRef.current.value = ''
            setFileName('')
            setRejection(message)
            onFileChange?.(null)
            return
        }

        setFileName(file.name)
        setRejection('')
        onFileChange?.(file)
    }

    const handleRemove = () => {
        applyFile(null)
        selectRef.current?.focus()
    }

    // 방금 걸린 파일 안내가 제출 검사 안내보다 급하다 — 사용자가 마지막으로 한 행동의 결과다.
    const message = rejection || error

    return (
        <div
            role="group"
            aria-labelledby={labelId}
            data-slot="attach-field"
            // 간격은 공통 Field 와 같다 — 라벨 아래 16, 상자 아래 메시지·안내 8(gap-2 + 라벨 mb-2).
            className={cn('flex flex-col gap-2', className)}
        >
            <span id={labelId} className="typo-body-xl-bold text-foreground mb-2 flex items-center gap-1">
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

            <input
                ref={inputRef}
                type="file"
                hidden
                name={name}
                accept={accept}
                required={required}
                onChange={(event) => applyFile(event.target.files?.[0] ?? null)}
            />

            {/* 상자 한 줄 — 왼쪽은 상태(파일명·자리 문구), 오른쪽은 [파일선택]. */}
            <div
                data-slot="attach-field-box"
                className={cn(
                    'border-control bg-surface min-h-control-h-xl flex items-center justify-between gap-4 rounded-sm border px-4',
                    message && 'border-destructive',
                )}
            >
                {fileName ? (
                    <span role="status" className="flex min-w-0 items-center gap-2">
                        <span className="typo-body-xl-regular text-label-foreground min-w-0 truncate">{fileName}</span>
                        {/* PROJECT-STYLE: 시안의 삭제 버튼은 24 정사각 + subtle-3 테두리 + radius 4 상자에
                            16 아이콘이 담긴다 — plain 의 아이콘-만 상자(16)를 시안 상자로 덮는다. */}
                        <Button
                            type="button"
                            variant="plain"
                            size="icon-xs"
                            aria-label={`첨부파일 ${fileName} 삭제`}
                            onClick={handleRemove}
                            className="border-subtle-3 bg-surface rounded-2xs size-6 border"
                        >
                            <X aria-hidden="true" />
                        </Button>
                    </span>
                ) : (
                    <span className="typo-body-xl-regular text-foreground-subtle truncate">선택된 파일 없음</span>
                )}
                <Button
                    ref={selectRef}
                    type="button"
                    variant="text"
                    size="md"
                    aria-invalid={message ? true : undefined}
                    aria-describedby={message ? errorId : undefined}
                    onClick={() => inputRef.current?.click()}
                    className="shrink-0"
                >
                    파일선택
                    <Upload aria-hidden="true" />
                </Button>
            </div>

            {message ? <FieldError id={errorId}>{message}</FieldError> : null}
            {/* 안내 메시지는 공통 Field 의 도움말(FieldDescription)과 같은 자리·타이포다. */}
            {helper ? <FieldDescription>{helper}</FieldDescription> : null}
        </div>
    )
}

export {AttachField}
export type {AttachFieldProps}
