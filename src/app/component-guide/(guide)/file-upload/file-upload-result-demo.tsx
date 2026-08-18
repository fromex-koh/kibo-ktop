'use client'

import {useState} from 'react'
import {FileUploadField} from '@/components/composite/file-upload-field'
import type {FileUploadErrorProps, FileUploadSuccessProps} from '@/components/composite/file-upload-result'
import {Button} from '@/components/ui/button'

// 가이드 전용 데모 — 대량정보 조회 신청 전용 업로드가 성공·실패 결과 패널을 쓰는 모습을 보여 준다.
// 실제 화면에서는 로컬 검사와 서버 검사가 같은 두 결과 컴포넌트를 사용한다. 건수·오류 목록은 서버 응답
// 예시 값으로 고정하며, 공통 FileUpload의 기본 상태에는 영향을 주지 않는다.

type ResultCase = {
    label: string
    action: string
    name: string
    accept: string
    hint: string
    result:
        | ({status: 'success'} & Omit<FileUploadSuccessProps, 'onReupload'>)
        | ({status: 'error'} & Omit<FileUploadErrorProps, 'onReupload'>)
}

const RESULT_CASES: readonly ResultCase[] = [
    {
        label: '평가내역조회용 표준엑셀 업로드',
        action: '표준양식 다운로드',
        name: 'guideResultSuccessExcel',
        accept: '.xlsx,.xls,.csv',
        hint: '지원 형식: XLSX, XLS, CSV (최대 50MB)',
        result: {
            status: 'success',
            fileName: '대량정보조회_표준양식_대상기업목록.xlsx',
            fileSize: '856.0KB',
            details: [
                {label: '데이터 건수', value: '248건'},
                {label: '업로드 일시', value: '2026-08-11 11:32'},
            ],
        },
    },
    {
        label: '평가내역조회용 표준엑셀 업로드',
        action: '표준양식 다운로드',
        name: 'guideResultErrorExcel',
        accept: '.xlsx,.xls,.csv',
        hint: '지원 형식: XLSX, XLS, CSV (최대 50MB)',
        result: {
            status: 'error',
            title: '2건의 문제가 발견되었어요',
            fileName: '대량정보조회_표준양식_대상기업목록.xlsx',
            fileSize: '856.0KB',
            details: [
                {label: '3행', value: '올바르지 않은 데이터 형식입니다.'},
                {label: '5행 F9열', value: '데이터가 입력되지 않았습니다.'},
            ],
        },
    },
    {
        label: '정보 제공 동의서 압축파일 업로드',
        action: '동의서 양식 다운로드',
        name: 'guideResultConsentArchive',
        accept: '.zip,.rar,.7z',
        hint: '지원 형식: ZIP, RAR, 7Z (최대 1GB)',
        result: {
            status: 'success',
            fileName: '정보제공동의서_모음.zip',
            fileSize: '128.4MB',
            details: [{label: '업로드 일시', value: '2026-08-11 11:32'}],
        },
    },
]

// [다운로드]를 실제로 눌러 볼 수 있게 붙이는 예시 파일. 서버 없이 동작하도록 data 주소로 둔다 —
// 실제 화면에서는 서버가 준 파일 경로를 downloadHref 로 넘긴다.
const SAMPLE_DOWNLOAD_HREF = `data:text/plain;charset=utf-8,${encodeURIComponent('컴포넌트 가이드 예시 파일입니다.')}`

const FileUploadResultDemo = () => {
    // 결과를 보여 줄 case 이름들 — [다시 업로드]로 빠지고, 파일을 다시 고르면 돌아온다.
    const [shownCases, setShownCases] = useState(() => RESULT_CASES.map((resultCase) => resultCase.name))

    const showResult = (name: string) => setShownCases((names) => (names.includes(name) ? names : [...names, name]))
    const hideResult = (name: string) => setShownCases((names) => names.filter((shown) => shown !== name))

    return (
        <div className="flex flex-col gap-10">
            {RESULT_CASES.map((resultCase) => (
                <FileUploadField
                    key={resultCase.name}
                    label={resultCase.label}
                    required
                    action={
                        <Button type="button" variant="secondary" size="xs">
                            {resultCase.action}
                        </Button>
                    }
                    name={resultCase.name}
                    accept={resultCase.accept}
                    hint={resultCase.hint}
                    onFileChange={(file) => {
                        if (file) showResult(resultCase.name)
                    }}
                    result={
                        shownCases.includes(resultCase.name)
                            ? {
                                  ...resultCase.result,
                                  downloadHref: SAMPLE_DOWNLOAD_HREF,
                                  onReupload: () => hideResult(resultCase.name),
                              }
                            : undefined
                    }
                />
            ))}
        </div>
    )
}

export {FileUploadResultDemo}
