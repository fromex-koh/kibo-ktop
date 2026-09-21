// K-BIGx 보고서 · 대량정보조회(org-k-bigx-report-bulk-data-search)의 문구 · 목업.
// [프론트엔드 연동] 목업(MOCK_*)은 조회 실행 API 응답으로 바꾼다.

type BulkDataSearchStatus = 'idle' | 'uploaded' | 'processing' | 'complete' | 'error'

const BULK_DATA_SEARCH_STATUSES: readonly BulkDataSearchStatus[] = [
    'idle',
    'uploaded',
    'processing',
    'complete',
    'error',
]

const isBulkDataSearchStatus = (value: unknown): value is BulkDataSearchStatus =>
    BULK_DATA_SEARCH_STATUSES.some((status) => status === value)

const BULK_DATA_SEARCH_TITLE = '대량정보조회'

const BULK_DATA_SEARCH_NOTES = [
    '표준 양식을 다운로드하여 조회 대상 기업정보를 입력해 주세요.',
    '작성한 양식을 업로드하면 대량 조회가 일괄 처리됩니다.',
    '처리 완료 후 결과 파일을 다운로드할 수 있습니다.',
] as const

const BULK_DATA_SEARCH_PROCESSING = {
    title: '대량 조회 처리 중입니다.',
    description: '파일을 분석하여 평가 데이터를 조회하고 있습니다.',
} as const

// ── 목업(API 연결 시 삭제) ──
const MOCK_BULK_DATA_SEARCH_COMPLETE = {
    title: '대량정보조회가 완료되었습니다.',
    description: '결과 파일을 다운로드해 주세요.',
    details: [
        {label: '총 건수', value: '248건'},
        {label: '성공', value: '12건'},
        {label: '실패', value: '0건'},
    ],
} as const

const MOCK_BULK_DATA_SEARCH_ERROR = {
    fileName: '대량정보조회_표준양식_대상기업목록.xlsx',
    fileSize: '856.0KB',
    details: [
        {label: '3행', value: '올바르지 않은 데이터 형식입니다.'},
        {label: '5행 F9열', value: '데이터가 입력되지 않았습니다.'},
    ],
} as const
// ── 목업 끝 ──

export {
    BULK_DATA_SEARCH_NOTES,
    BULK_DATA_SEARCH_PROCESSING,
    BULK_DATA_SEARCH_TITLE,
    isBulkDataSearchStatus,
    MOCK_BULK_DATA_SEARCH_COMPLETE,
    MOCK_BULK_DATA_SEARCH_ERROR,
}
export type {BulkDataSearchStatus}
