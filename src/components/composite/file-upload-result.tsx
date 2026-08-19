import type {ReactNode} from 'react'
import {Check, Download, RotateCcw} from 'lucide-react'
import {Icon} from '@/components/custom/icon'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

// 업로드 성공·실패 결과 — 로컬 검사와 서버 검사가 함께 쓰는 결과 패널.
// Figma "[일괄평가] 2단계_ 대량정보 조회 신청_파일업로드case" 의 "데이터 입력 성공"·"데이터 입력 오류" 반영.
//
// FileUpload 는 파일 선택과 검사를 담당하고 결과 표현은 FileUploadSuccess·FileUploadError에 맡긴다.
// 서버가 돌려준 데이터 건수·검증 오류도 같은 두 컴포넌트에 전달한다. 표시 전용이라 상태를 갖지 않는다.
//
// 구조: [원형 표식 · 제목 · 설명] → [흰 카드: 파일명·용량 + 다운로드 / 상세] → [다시 업로드]
//   · success — 파란 면(file-upload-complete). 상세는 "데이터 건수 248건 · 업로드 일시 …" 처럼 한 줄에 놓인다.
//   · error   — 회색 면(surface-subtle). 상세는 "3행 / 올바르지 않은 데이터 형식입니다." 처럼 줄마다 쌓인다.
//
// 접근성: 결과는 화면 일부만 바뀌므로 알린다 — 성공은 role="status", 오류는 즉시 전달해야 하므로
// role="alert" 이다[7.4.2 · 8.2.1]. 원형 표식은 장식이라 뜻은 제목 문구가 전달한다[5.1.1 · 5.3.1].

type FileUploadResultStatus = 'success' | 'error'

// 파일 아래 한 줄로 붙는 항목. 성공은 "데이터 건수 / 248건", 오류는 "3행 / 올바르지 않은 데이터 형식입니다."
type FileUploadResultDetail = {
    label: ReactNode
    value: ReactNode
}

type FileUploadResultProps = {
    status: FileUploadResultStatus
    // 결과 제목·설명. 기본 문구는 시안을 따른다.
    title?: ReactNode
    description?: ReactNode
    // 검사한 파일. 용량은 이미 사람이 읽는 문자열로 넘긴다(예: "856.0KB").
    // 지목할 파일이 없으면(예: 여러 개를 한꺼번에 놓아 걸린 경우) 비워 두고 사유만 보여 준다.
    fileName?: string
    fileSize?: string
    // 파일 내려받기 경로. 없으면 다운로드 버튼을 두지 않는다.
    downloadHref?: string
    // 오류 목록·부가 정보. 오류에서 넘기지 않으면 아래 자리 표시자를 쓴다.
    details?: readonly FileUploadResultDetail[]
    // [다시 업로드] 동작. 없으면 버튼을 두지 않는다.
    onReupload?: () => void
    className?: string
}

const DEFAULT_TITLE: Record<FileUploadResultStatus, string> = {
    success: '파일이 정상적으로 업로드되었어요',
    error: '문제가 발견되었어요',
}
const DEFAULT_DESCRIPTION: Record<FileUploadResultStatus, string> = {
    success: '파일 내용을 검토한 후 [신청] 버튼을 눌러주세요.',
    error: '아래 오류를 수정한 후 다시 업로드해 주세요.',
}

// ⚠️ 문구 규칙 — 오류는 두 갈래이고 제목 아래 설명 자리에 들어갈 말이 서로 다르다.
//   · 첨부 정책 위반(파일 종류·용량·개수) — 목록 없이 설명 줄에 그 사유를 적는다.
//     예: 제목 "문제가 발견되었어요" · 설명 "XLSX, XLS, CSV 파일만 첨부할 수 있습니다."
//   · 표준 양식 포맷 위반(행·열 단위 검증 실패) — details 에 위치와 사유를 넘기고, 설명은 목록을 가리키는
//     기본 문구를 그대로 쓴다. 예: 제목 "2건의 문제가 발견되었어요" · 설명 "아래 오류를 수정한 후 다시
//     업로드해 주세요." · 목록 "3행 / 올바르지 않은 데이터 형식입니다."
//   두 갈래를 섞지 않는다 — 파일 종류가 틀린 파일에 행·열 오류를 함께 보여 주면 무엇을 고쳐야 할지 어긋난다.

const UploadResultPanel = ({
    status,
    title,
    description,
    fileName,
    fileSize,
    downloadHref,
    details,
    onReupload,
    className,
}: FileUploadResultProps) => {
    const isError = status === 'error'

    return (
        <div
            data-slot="file-upload-result"
            data-status={status}
            className={cn(
                'flex flex-col gap-6 rounded-sm border p-10',
                isError
                    ? 'bg-surface-subtle border-subtle-3'
                    : 'bg-file-upload-complete border-file-upload-complete-border',
                className,
            )}
        >
            <div className="flex flex-col items-center gap-4" role={isError ? 'alert' : 'status'}>
                {isError ? (
                    <Icon variant="solid" symbol="alert" className="bg-icon-solid-error size-15" />
                ) : (
                    <Icon variant="solid" icon={Check} className="bg-primary text-primary-foreground size-15" />
                )}
                <div className="flex flex-col items-center gap-1 text-center">
                    <p className="typo-body-xl-bold text-label-foreground">{title ?? DEFAULT_TITLE[status]}</p>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        {description ?? DEFAULT_DESCRIPTION[status]}
                    </p>
                </div>
            </div>

            {/* 파일 카드 — 성공은 파일 줄과 상세가 붙어 있고(8), 오류는 구분선을 사이에 두고 떨어진다(16). */}
            <div className={cn('bg-card flex flex-col rounded-sm p-6', isError ? 'gap-4' : 'gap-2')}>
                {/* 좁은 폭에서는 [다운로드]를 아랫줄로 내린다 — 한 줄에 함께 두면 이름 칸이 몇 글자까지 줄어
                    읽을 수 없다. 세로로 쌓을 때 이름 줄은 폭을 다 써야 말줄임이 걸리므로 items-* 로 줄이지 않고,
                    버튼만 self-start 로 내용 폭에 맞춘다. */}
                {fileName ? (
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
                        {/* 좁은 폭에서는 파일 이름만 말줄임한다 — 용량은 잘리면 뜻이 달라지므로(51.0MB → 51.0M)
                            줄이지 않고 끝까지 남긴다. 이름 칸에 min-w-0 이 있어야 flex 안에서 줄어들 수 있다. */}
                        <p className="typo-body-xl-regular text-label-foreground flex min-w-0 items-baseline gap-1">
                            <span className="min-w-0 truncate">{fileName}</span>
                            {fileSize ? <span className="text-foreground-subtle shrink-0">{fileSize}</span> : null}
                        </p>
                        {/* PROJECT-STYLE: 시안 button_text 인스턴스는 밑줄 사각형이 꺼져 있다 — 밑줄 없는
                            text variant 를 쓴다(글자 16px·아이콘 16·간격 4 는 text-underline 과 같다). */}
                        {downloadHref ? (
                            <Button asChild variant="text" size="md" className="shrink-0 self-start md:self-auto">
                                <a href={downloadHref} download={fileName}>
                                    다운로드
                                    <Download aria-hidden="true" />
                                </a>
                            </Button>
                        ) : null}
                    </div>
                ) : null}

                {details?.length ? (
                    // 오류 목록은 파일 줄과 구분선으로 나뉜다(시안). 성공 상세는 같은 줄에 이어 붙는다.
                    <dl
                        className={cn(
                            'typo-body-l-regular',
                            isError
                                ? 'border-subtle-3 flex flex-col gap-2 border-t pt-4'
                                : 'flex flex-wrap items-center gap-x-4 gap-y-2',
                        )}
                    >
                        {details.map((detail, index) => (
                            <div
                                key={`${index}-${detail.label}`}
                                className={cn('flex items-center gap-2', isError ? 'items-start' : 'shrink-0')}
                            >
                                {/* 성공 상세는 항목 사이에 세로 구분선을 둔다 — 첫 항목 앞에는 두지 않는다. */}
                                {!isError && index > 0 ? (
                                    <span aria-hidden="true" className="bg-subtle-2 -ml-2 h-3 w-px" />
                                ) : null}
                                <dt className={cn('text-foreground-subtle', isError && 'w-20 shrink-0')}>
                                    {detail.label}
                                </dt>
                                <dd className="text-foreground min-w-0">{detail.value}</dd>
                            </div>
                        ))}
                    </dl>
                ) : null}
            </div>

            {onReupload ? (
                <Button type="button" variant="tertiary" size="sm" onClick={onReupload} className="self-center">
                    <RotateCcw aria-hidden="true" />
                    다시 업로드
                </Button>
            ) : null}
        </div>
    )
}

type FileUploadSuccessProps = Omit<FileUploadResultProps, 'status'>
type FileUploadErrorProps = Omit<FileUploadResultProps, 'status'>

// 파일을 어디에서 검사했는지와 무관하게 결과 표현은 성공·실패 두 개만 사용한다.
// 로컬 확장자/용량 검사와 신청 후 서버 검증이 같은 컴포넌트를 공유하므로 화면 상태가 중복되지 않는다.
const FileUploadSuccess = (props: FileUploadSuccessProps) => <UploadResultPanel status="success" {...props} />
const FileUploadError = (props: FileUploadErrorProps) => <UploadResultPanel status="error" {...props} />

export {FileUploadError, FileUploadSuccess}
export type {FileUploadErrorProps, FileUploadResultDetail, FileUploadSuccessProps}
