// 특허 등급조회 화면의 문구 · 목업 — 조회 화면(corp-patent-evaluation-patent-grade-list)과
// 결과 화면(corp-patent-evaluation-patent-grade-list-patent-grade-result)이 함께 쓴다.
//
// [프론트엔드 연동] 목업은 파일 아래 '목업(API 연결 시 삭제)' 구역에 모여 있다 —
//   · MOCK_PATENT_GRADE_REPORT · MOCK_PATENT_RECORDS · findPatentGradeReport → 특허 등급 조회 API 로 바꾼다.
//   · MOCK_PATENT_SEARCH_DEFAULTS → 결과 화면만 쓰는 퍼블리싱용 기본 번호다. 결과 화면을 정리할 때 함께 지운다.
// 그 위의 상수(문구 · 검색 기준 · 번호 형식)는 화면 문구라 그대로 쓴다.

const PATENT_GRADE_INTRO = {
    eyebrow: 'KPAS (KIBO PATENT APPRAISAL SYSTEM)',
    title: '특허등급, 이제 쉽고 편리하게 확인하세요!',
    descriptions: [
        '온라인 특허평가시스템(K-PAS)은 쉽고 빠른 특허평가 서비스를 제공합니다.',
        '특허출원번호 또는 특허등록번호를 입력 후 찾고자 하는 특허결과를 검색합니다.',
    ],
} as const

// 검색 기준 — 셀렉트에서 고른다. placeholder · note 는 시안(검색 · 기준별)의 입력 안내와 버튼 줄 왼쪽 도움말 그대로다.
// pattern 은 그 번호의 형식이다(형식이 맞아야 조회한다). 하이픈은 있어도 없어도 된다.
//   특허등록번호: 13자리(10-1111111-0000) 또는 등록 7자리(1111111)
//   특허출원번호: 13자리(10-2026-1111111) 또는 9자리
// [프론트엔드 연동] 확정 형식을 받으면 pattern 만 바꾼다.
const PATENT_SEARCH_TYPES = [
    {
        value: 'registration',
        label: '특허등록번호',
        pattern: /^(\d{2}-?\d{7}-?\d{4}|\d{7})$/,
        placeholder: '(로그인후) 13자리 또는 7자리 등록·출원번호를 입력하세요',
        note: '※ 검색대상 : 2026-04-01이전 등록 및 공고된 특허정보',
    },
    {
        value: 'application',
        label: '특허출원번호',
        pattern: /^(\d{2}-?\d{4}-?\d{7}|\d{9})$/,
        placeholder: '13자리 또는 9자리 등록번호를 입력하세요',
        note: '※ 출원상태인 특허는 평가제외',
    },
] as const

type PatentSearchType = (typeof PATENT_SEARCH_TYPES)[number]['value']

// 번호를 비우고 [검색하기]를 누르면 보이는 안내.
const PATENT_SEARCH_EMPTY_ERROR = '특허등록번호 또는 특허출원번호를 입력해주세요.'

const PATENT_GRADE_REPORT_TITLE = '특허평가 결과 보고서'
const PATENT_GRADE_REPORT_DESCRIPTION = '조회한 특허등급의 기본정보를 확인합니다.'

const PATENT_SUMMARY_TITLE = '특허개요'
const PATENT_GRADE_TITLE = '특허 평가등급'
const PATENT_PEER_AVERAGE_TITLE = '동일 특허분야 평균(등급)'
const PATENT_PEER_AVERAGE_DESCRIPTION = '동일 특허분야 평균 : 평가대상 특허와 동일한 특허분야(IPC)에 속한 특허들의 평균'

// 평가 항목 — 평가등급 · 레이더 · 추이 차트가 모두 이 순서를 쓴다.
const PATENT_GRADE_METRICS = [
    {id: 'diversity', label: '기술다양성'},
    {id: 'market', label: '시장확장성'},
    {id: 'value', label: '가치창출가능성'},
] as const

// 등급 눈금 — 높은 등급부터 낮은 등급 순서다(추이 차트의 세로축).
const PATENT_GRADE_SCALE = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C'] as const

const PATENT_GRADE_LEGEND = {
    primary: '평가대상특허',
    comparison: '동일 특허분야 평균',
} as const

const PATENT_GRADE_NOTICE = {
    title: '주의사항',
    items: [
        '본자료는 평가용도 외로 사용할 수 없으며, 어떠한 경우에도 우리 기금의 서면동의없이 무단전재, 복사, 배포될 수 없습니다.',
        '본 자료에 수록된 내용은 우리 기금이 신뢰할 만한 자료 및 정보로부터 얻어진 것이나, 그 정확성이나 완전성을 보장할 수 없으므로 고객의 판단과 책임하에 최종 의사결정을 하시기 바랍니다. 따라서 어떠한 경우에도 본 자료는 고객의 의사결정에 대한 법적 책임소재의 증빙 자료로 사용될 수 없으며, 우리 기금은 본 자료를 기초로 한 행위결과에 대하여 어떠한 책임도 부담하지 아니합니다.',
        '본 자료는 신속하고 편리하게 특허의 기술다양성, 시장확장성, 가치창출가능성을 평가하기 위해 참고용으로 제공되는 것으로, 등급평가 과정에서 다양한 가정과 추정이 사용됩니다. 따라서 본 평가결과는 전문가의 실제 평가결과와 차이가 있을 수 있으며, 본 평가결과와 금융지원 여부는 무관하오니 참고하시기 바랍니다.',
    ],
} as const

type PatentSummaryRow = {
    label: string
    value: string
    /** 값이 한 줄을 다 쓰는 행(발명의 명칭 · IPC 코드). */
    fullWidth?: boolean
    /** 같은 줄 오른쪽 칸. fullWidth 행에는 없다. */
    second?: {label: string; value: string}
}

// 특허개요 표의 짜임 — PatentGradeReport 를 값 없이(isLoading) 그릴 때 항목 이름만 보이고 값 자리는 스켈레톤이 된다.
// 특허 등급조회 화면은 검색 중에 보고서 대신 '검색 중' 안내(LoadingState)를 보이므로 지금은 이 짜임을 쓰지 않는다.
const PATENT_SUMMARY_TEMPLATE: PatentSummaryRow[] = [
    {label: '등급부여일', value: '', second: {label: '열람일', value: ''}},
    {label: '발명의 명칭', value: '', fullWidth: true},
    {label: '출원번호', value: '', second: {label: '등록번호', value: ''}},
    {label: '출원일자', value: '', second: {label: '출원인', value: ''}},
    {label: '등록일자', value: '', second: {label: '등록 권리자', value: ''}},
    {label: 'IPC 코드', value: '', fullWidth: true},
]

// 결과 영역 안내 — 검색 전에는 결과 영역 자체가 없다.
// 검색 중 안내 — 스피너와 함께 결과 자리에 보인다.
const PATENT_GRADE_SEARCHING = '특허등급 정보를 검색 중입니다.'

// 결과 없음 — 검색한 기준 이름을 넣는다(예: '조회된 특허정보가 없습니다. 특허등록번호를 확인해 주세요.').
const getPatentGradeNotFoundMessage = (label: string) => `조회된 특허정보가 없습니다. ${label}를 확인해 주세요.`

type PatentGradeTrendPoint = {label: string; grade: string}

type PatentGradeReport = {
    /** 특허개요 제목 옆 분야명과 오른쪽 보고서 생성일자. */
    field: string
    createdAt: string
    summary: PatentSummaryRow[]
    /**
     * 항목별 값 — metric id 는 PATENT_GRADE_METRICS 와 같다(기술다양성 · 시장확장성 · 가치창출가능성).
     *
     * [프론트엔드 연동] 화면의 어느 자리에 들어가는 값인지:
     *   grade       — '특허 평가등급'의 등급 칩(BB · BBB · A)
     *   score       — 레이더의 평가대상특허 점수(0~100)
     *   peerScore   — 레이더의 동일 특허분야 평균 점수(0~100)
     *   peerTrend   — '동일 특허분야 평균(등급)' 카드의 꺾은선(분기별 평균 등급, 속이 빈 점)
     *   targetGrade — 같은 카드의 채운 점(평가대상 등급). 꺾은선과 별개 값이며 마지막 분기 자리에 선다
     */
    metrics: {
        id: (typeof PATENT_GRADE_METRICS)[number]['id']
        grade: string
        score: number
        peerScore: number
        peerTrend: PatentGradeTrendPoint[]
        targetGrade: string
    }[]
}

// ── 목업(API 연결 시 삭제) ──

const MOCK_PATENT_GRADE_REPORT: PatentGradeReport = {
    field: '무선 · 이동통신 서비스',
    createdAt: '2025.12.04',
    summary: [
        {label: '등급부여일', value: '2026-05-05', second: {label: '열람일', value: '2026-05-05'}},
        {label: '발명의 명칭', value: 'IP 평가모형을 이용한 IP 평가방법 및 그 장치', fullWidth: true},
        {label: '출원번호', value: '10-2026-1111111', second: {label: '등록번호', value: '10-1111111-0000'}},
        {label: '출원일자', value: '2026-05-05', second: {label: '출원인', value: '기술보증기금'}},
        {label: '등록일자', value: '2026-05-05', second: {label: '등록 권리자', value: '기술보증기금'}},
        {
            label: 'IPC 코드',
            value: 'G01N 15/02, G01N 21/64, G01N 33/34, D21H 21/02',
            fullWidth: true,
        },
    ],
    metrics: [
        {
            id: 'diversity',
            grade: 'BB',
            score: 58,
            peerScore: 72,
            // 꺾은선(동일 특허분야 평균) — 분기별 등급.
            peerTrend: [
                {label: '’25년\n3분기', grade: 'BB'},
                {label: '’25년\n4분기', grade: 'BB'},
                {label: '’26년\n1분기', grade: 'BBB'},
                {label: '’26년\n2분기', grade: 'BBB'},
            ],
            // 채운 점(평가대상) — 꺾은선과 별개 값.
            targetGrade: 'BB',
        },
        {
            id: 'market',
            grade: 'BBB',
            score: 66,
            peerScore: 78,
            // 꺾은선(동일 특허분야 평균) — 분기별 등급.
            peerTrend: [
                {label: '’25년\n3분기', grade: 'BBB'},
                {label: '’25년\n4분기', grade: 'A'},
                {label: '’26년\n1분기', grade: 'BBB'},
                {label: '’26년\n2분기', grade: 'A'},
            ],
            // 채운 점(평가대상) — 꺾은선과 별개 값.
            targetGrade: 'A',
        },
        {
            id: 'value',
            grade: 'A',
            score: 74,
            peerScore: 70,
            // 꺾은선(동일 특허분야 평균) — 분기별 등급.
            peerTrend: [
                {label: '’25년\n3분기', grade: 'CCC'},
                {label: '’25년\n4분기', grade: 'CCC'},
                {label: '’26년\n1분기', grade: 'CCC'},
                {label: '’26년\n2분기', grade: 'CCC'},
            ],
            // 채운 점(평가대상) — 꺾은선과 별개 값.
            targetGrade: 'BBB',
        },
    ],
}
// 목업 특허 — 보고서가 있는 특허의 등록번호 · 출원번호. 목업 보고서의 특허개요(등록번호 · 출원번호)와 같은 값이다.
const MOCK_PATENT_RECORDS: {registration: string; application: string; report: PatentGradeReport}[] = [
    {registration: '10-1111111-0000', application: '10-2026-1111111', report: MOCK_PATENT_GRADE_REPORT},
]

// 목업 조회 — 고른 기준의 번호가 목업 특허와 정확히 같을 때만(하이픈 무시) 보고서를 돌려주고, 아니면 결과 없음(null)이다.
// 7자리 · 9자리로 줄여 쓴 번호는 형식 검사는 통과하지만 목업에서는 결과 없음이다.
// [프론트엔드 연동] 특허 등급 조회 API 로 바꾼다(검색 기준 type · 번호 number).
// 하이픈은 빼고 숫자만 견준다 — 10-1111111-0000 과 1011111110000 은 같은 번호다.
const toDigits = (value: string) => value.replace(/-/g, '')
const findPatentGradeReport = ({type, number}: {type: PatentSearchType; number: string}): PatentGradeReport | null =>
    MOCK_PATENT_RECORDS.find((record) => toDigits(record[type]) === toDigits(number))?.report ?? null

// ─────────────────────────────────────────────────────────────────────────────────────────────
// [퍼블리싱 확인용 기본값] 결과 화면(patent-grade-result)이 검색 칸에 넣어 두는 번호 — 목업 보고서의 특허등록번호 · 특허출원번호다.
// 조회 화면은 이 값을 쓰지 않고 빈 칸으로 시작한다. 실제 서비스 값이 아니다.
// [프론트엔드 연동] 결과 화면을 지우거나 실제 조회로 바꾸면 이 상수도 지운다.
const MOCK_PATENT_SEARCH_DEFAULTS: Record<PatentSearchType, string> = {
    registration: MOCK_PATENT_RECORDS[0].registration,
    application: MOCK_PATENT_RECORDS[0].application,
}
// ─────────────────────────────────────────────────────────────────────────────────────────────
// ── 목업 끝 ──

export {
    MOCK_PATENT_SEARCH_DEFAULTS,
    findPatentGradeReport,
    getPatentGradeNotFoundMessage,
    PATENT_GRADE_SEARCHING,
    PATENT_SUMMARY_TEMPLATE,
    MOCK_PATENT_GRADE_REPORT,
    PATENT_GRADE_INTRO,
    PATENT_GRADE_LEGEND,
    PATENT_GRADE_METRICS,
    PATENT_GRADE_NOTICE,
    PATENT_GRADE_REPORT_DESCRIPTION,
    PATENT_GRADE_REPORT_TITLE,
    PATENT_GRADE_SCALE,
    PATENT_GRADE_TITLE,
    PATENT_SEARCH_EMPTY_ERROR,
    PATENT_PEER_AVERAGE_DESCRIPTION,
    PATENT_PEER_AVERAGE_TITLE,
    PATENT_SEARCH_TYPES,
    PATENT_SUMMARY_TITLE,
}
export type {PatentSearchType, PatentGradeReport, PatentGradeTrendPoint, PatentSummaryRow}
