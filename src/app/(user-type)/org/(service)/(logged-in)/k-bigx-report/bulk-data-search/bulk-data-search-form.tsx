'use client'

import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/navigation'
import {FileUploadField} from '@/components/composite/file-upload-field'
import {FileUploadError, FileUploadSuccess} from '@/components/composite/file-upload-result'
import {FormCard} from '@/components/composite/form-card'
import {LoadingState} from '@/components/composite/loading-state'
import {ListMarker} from '@/components/custom/list-marker'
import {Button} from '@/components/ui/button'
import {
    BULK_DATA_SEARCH_NOTES,
    BULK_DATA_SEARCH_PROCESSING,
    BULK_DATA_SEARCH_TITLE,
    MOCK_BULK_DATA_SEARCH_COMPLETE,
    MOCK_BULK_DATA_SEARCH_ERROR,
    type BulkDataSearchStatus,
} from '@/content/service/bulk-data-search'

// K-BIGx 보고서 · 대량정보조회 본문 — 카드 한 장과 그 아래 버튼. 상태는 다섯이다(시안 케이스).
//   ① 업로드 전(idle)      — 안내 · 표준양식 업로드 상자 · [조회 실행](꺼짐)
//   ② 업로드 후(uploaded)  — 상자가 고른 파일 한 줄(파일명 + 삭제 X)로 바뀜 · [조회 실행](켜짐)
//   ③ 처리 중(processing)  — 카드가 '대량 조회 처리 중입니다.' 안내(스피너)로 바뀜 · 버튼 없음
//   ④ 완료(complete)       — 대량정보조회 완료 화면(bulk-data-search/complete)으로 넘어간다.
//                            안내 아래 완료 패널(총 건수 · 성공 · 실패 + [새 조회]) · [결과 파일 다운로드]
//   ⑤ 오류(error)          — 대량정보조회 실패 화면(bulk-data-search/failure)으로 넘어간다.
//                            안내 아래 오류 패널(파일 · 행/열 오류 목록 + [다시 업로드]) · [조회 실행](꺼짐)
//                            결과 파일이 없으므로 다운로드 대신 [조회 실행]을 꺼 둔다 — [다시 업로드]로 고쳐 올리면 ② 로 켜진다.
// [다시 업로드]는 ① 업로드 전으로, 완료 화면의 [새 조회]는 대량정보조회 화면(①)으로 돌아간다.
//
// [프론트엔드 연동] handleRun 의 목업(MOCK_*)을 조회 실행 API 로 바꾼다 — 응답이 오기 전까지 ③, 성공이면 ④,
// 표준양식 검증 실패면 ⑤ 에 응답 값(건수 · 오류 목록)을 넣는다. [표준양식 다운로드] · [결과 파일 다운로드]에는
// 실제 파일 경로를 건다.

const EXCEL_FILE_NAME = 'bulkDataStandardExcel'
// 표준양식 — 스프레드시트 3종, 1개, 50MB(시안 "지원 형식: XLSX, XLS, CSV (최대 50MB)").
const EXCEL_ACCEPT = '.xlsx,.xls,.csv'
const EXCEL_MAX_SIZE_MB = 50
// 목업 처리 시간 — 처리 중 상태를 확인할 수 있게 둔다. API 연결 시 지운다.
const MOCK_PROCESSING_MS = 1500
// 결과 화면 도착 후 결과 패널로 내려가기 전 기다리는 시간.
const RESULT_SCROLL_DELAY_MS = 150
const BULK_DATA_SEARCH_PATH = '/org/k-bigx-report/bulk-data-search'
const BULK_DATA_SEARCH_COMPLETE_PATH = `${BULK_DATA_SEARCH_PATH}/complete`
const BULK_DATA_SEARCH_FAILURE_PATH = `${BULK_DATA_SEARCH_PATH}/failure`
// 목업 판정 — 파일 이름에 '오류' 나 'error' 가 들어 있으면 실패로 본다. 두 케이스를 [조회 실행]으로 직접 확인하는 용도다.
const MOCK_FAILURE_FILE_NAME_PATTERN = /오류|error/i

type BulkDataSearchFormProps = {
    /** [퍼블리싱 확인용] 처음 보여 줄 상태(주소의 ?state=). 비우면 업로드 전이다. */
    initialStatus?: BulkDataSearchStatus
    /** [퍼블리싱 확인용] 조회 실행 결과를 항상 실패로 돌릴지(?error=1) — 파일 이름과 관계없이 실패 화면으로 간다. */
    isErrorPreview?: boolean
    /** [조회 실행] 뒤 결과 화면에 도착했을 때 켠다 — 결과 패널이 보이도록 내려간다(주소의 ?from=run). */
    shouldScrollToResult?: boolean
}

const BulkDataSearchForm = ({
    initialStatus = 'idle',
    isErrorPreview = false,
    shouldScrollToResult = false,
}: BulkDataSearchFormProps) => {
    const router = useRouter()
    const [status, setStatus] = useState<BulkDataSearchStatus>(initialStatus)
    const [excelFile, setExcelFile] = useState<File | null>(null)
    const actionRef = useRef<HTMLDivElement>(null)
    const resultRef = useRef<HTMLDivElement>(null)

    // [조회 실행] 뒤 도착한 결과 화면 — 결과 패널(완료 · 오류)과 아래 버튼이 보이도록 내려간다(모바일 · 태블릿 · PC 공통).
    // 화면에 처음 그려질 때 한 번만 한다(바깥 DOM 을 움직이는 일이라 상태는 바꾸지 않는다).
    useEffect(() => {
        if (!shouldScrollToResult) return
        // 화면 전환이 스크롤 위치를 맞추는 일(맨 위로 · 복원)이 끝난 뒤에 옮기도록 잠깐 미룬다 —
        // 바로 옮기면 그 일에 덮여 맨 위에 남는다.
        const timer = window.setTimeout(
            () => resultRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'}),
            RESULT_SCROLL_DELAY_MS,
        )
        return () => window.clearTimeout(timer)
    }, [shouldScrollToResult])

    // [프론트엔드 연동][파일 업로드] 표준양식을 고르거나 지웠을 때다.
    const handleExcelFileChange = (file: File | null) => {
        console.log('[프론트엔드 연동][파일 업로드] 대량정보조회 표준양식', file)
        setExcelFile(file)
        setStatus(file ? 'uploaded' : 'idle')
        // 파일을 올리면 켜진 [조회 실행]이 화면 가운데 오도록 내려간다(모바일 · 태블릿 · PC 공통).
        if (file) {
            window.requestAnimationFrame(() => actionRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'}))
        }
    }

    // [프론트엔드 연동][조회 실행] 대량정보조회 실행 API 를 부르는 자리다.
    const handleRun = () => {
        console.log('[프론트엔드 연동][조회 실행] 대량정보조회 실행', excelFile)
        setStatus('processing')
        // 처리 중 안내가 보이도록 내려간다 — 카드가 안내로 바뀐 다음 프레임에 옮긴다.
        window.requestAnimationFrame(() => resultRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'}))
        // 결과는 둘 중 하나다.
        //   · 성공 → 완료 화면: 완료 패널의 [새 조회] + 아래 [결과 파일 다운로드]
        //   · 실패 → 실패 화면: 오류 패널의 [다시 업로드] + 아래 [조회 실행](꺼짐) — [새 조회] · [결과 파일 다운로드] 없음
        // [프론트엔드 연동] 아래 목업 판정 대신 API 응답의 성공 여부로 가른다.
        const isFailure = isErrorPreview || MOCK_FAILURE_FILE_NAME_PATTERN.test(excelFile?.name ?? '')
        window.setTimeout(
            // ?from=run — 결과 화면이 도착하자마자 결과 패널로 내려가게 한다.
            // scroll: false — 화면 전환이 맨 위로 올리지 않게 하고, 도착한 화면이 결과 패널로 내려간다.
            () =>
                router.push(`${isFailure ? BULK_DATA_SEARCH_FAILURE_PATH : BULK_DATA_SEARCH_COMPLETE_PATH}?from=run`, {
                    scroll: false,
                }),
            MOCK_PROCESSING_MS,
        )
    }

    const handleRestart = () => {
        setExcelFile(null)
        setStatus('idle')
    }

    // 완료 화면의 [새 조회] — 대량정보조회 화면으로 돌아가 처음부터 올린다.
    const handleNewSearch = () => router.push(BULK_DATA_SEARCH_PATH)

    // ③ 처리 중 — 카드 전체가 안내로 바뀐다(높이 360).
    if (status === 'processing') {
        return (
            <div ref={resultRef}>
                <LoadingState
                    title={BULK_DATA_SEARCH_PROCESSING.title}
                    description={BULK_DATA_SEARCH_PROCESSING.description}
                    className="bg-card rounded-lg"
                />
            </div>
        )
    }

    const isFinished = status === 'complete' || status === 'error'

    return (
        <>
            <FormCard
                title={BULK_DATA_SEARCH_TITLE}
                subtitleAsChild
                descriptionFullWidth
                subtitle={
                    <ul className="flex list-none flex-col">
                        {BULK_DATA_SEARCH_NOTES.map((note) => (
                            <li key={note} className="flex">
                                <ListMarker type="unordered-small" />
                                <span className="min-w-0">{note}</span>
                            </li>
                        ))}
                    </ul>
                }
            >
                {/* 결과 패널 — [조회 실행] 뒤 도착하면 여기로 내려간다(헤더 높이만큼 띄움). */}
                <div ref={resultRef} className="scroll-mt-18 empty:hidden md:scroll-mt-28 xl:scroll-mt-32">
                    {status === 'complete' ? (
                        <FileUploadSuccess
                            title={MOCK_BULK_DATA_SEARCH_COMPLETE.title}
                            description={MOCK_BULK_DATA_SEARCH_COMPLETE.description}
                            details={MOCK_BULK_DATA_SEARCH_COMPLETE.details}
                            reuploadLabel="새 조회"
                            isDetailsCentered
                            onReupload={handleNewSearch}
                        />
                    ) : null}
                    {status === 'error' ? (
                        <FileUploadError
                            title={
                                <>
                                    <span className="text-error-500">
                                        {MOCK_BULK_DATA_SEARCH_ERROR.details.length}건
                                    </span>
                                    의 문제가 발견되었어요
                                </>
                            }
                            fileName={excelFile?.name ?? MOCK_BULK_DATA_SEARCH_ERROR.fileName}
                            fileSize={MOCK_BULK_DATA_SEARCH_ERROR.fileSize}
                            details={MOCK_BULK_DATA_SEARCH_ERROR.details}
                            onReupload={handleRestart}
                        />
                    ) : null}
                </div>
                {!isFinished ? (
                    <FileUploadField
                        label="대량정보조회 표준양식 업로드"
                        required
                        action={
                            <Button type="button" variant="secondary" size="xs">
                                표준양식 다운로드
                            </Button>
                        }
                        name={EXCEL_FILE_NAME}
                        accept={EXCEL_ACCEPT}
                        maxSizeMb={EXCEL_MAX_SIZE_MB}
                        hint="지원 형식: XLSX, XLS, CSV (최대 50MB)"
                        attachedView="file"
                        onFileChange={handleExcelFileChange}
                    />
                ) : null}
            </FormCard>

            {/* [조회 실행] — ① 업로드 전 · ⑤ 오류는 꺼짐, ② 업로드 후만 켜짐. ④ 완료만 [결과 파일 다운로드]. */}
            <div ref={actionRef} className="flex justify-center">
                {status === 'complete' ? (
                    <Button type="button" size="xl">
                        결과 파일 다운로드
                    </Button>
                ) : (
                    <Button type="button" size="xl" disabled={status !== 'uploaded'} onClick={handleRun}>
                        조회 실행
                    </Button>
                )}
            </div>
        </>
    )
}

export {BulkDataSearchForm}
export type {BulkDataSearchFormProps}
