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

// 검색 기준 — 셀렉트에서 고른다. placeholder 는 입력 칸 안내, note 는 버튼 줄 왼쪽 도움말이다.
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

// ── 인쇄용 보고서의 고정 문구 ──
// [프론트엔드 연동] 인쇄용 보고서에 나오는 글은 값 · 문구 모두 이 파일에만 있다. 화면 파일을 열지 않고 여기서 고친다.
const PATENT_REPORT_EYEBROW = 'KPAS(Kibo Patent Appraisal System)'
const PATENT_REPORT_CREATED_AT_LABEL = '보고서 생성일자'
const PATENT_REPORT_INVENTION_TITLE = '발명의명칭(등록번호)'
const PATENT_INFLUENCE_TITLE = '영향요인 비교'
const PATENT_INFLUENCE_FOOTNOTE =
    '※ 등급평가는 영향요인의 값, 긍정/부정 요인의 개수 및 기여도 등 종합적으로 반영하여 산출되므로, 특정 영향요인의 단일 값만으로 평가되지 않습니다'
const PATENT_ANALYSIS_TITLE = '평가대상 특허분석'
const PATENT_ANALYSIS_FOOTNOTE =
    '※ 상위 40%의 영향요인 값 대비 평가대상 특허의 영향요인 값이 동일하거나 많더라도 다른 영향요인들의 값에 따라 결과가 상이하게 나올 수 있음을 유의하시기 바랍니다.'

// 영향요인 카드의 막대 셋 — 이름과 순서. key 는 PatentInfluenceFactor 의 값 이름과 같다.
const PATENT_INFLUENCE_BARS = [
    {key: 'ipcGroup', label: 'IPC 그룹'},
    {key: 'top40', label: '그룹 내\n상위40%'},
    {key: 'target', label: '평가대상\n특허'},
] as const

// 등급 분포 표의 줄 이름.
const PATENT_DISTRIBUTION_ROW_LABELS = {
    grade: '등급',
    percent: '백분율(%)',
    cumulative: '누적비율(%)',
} as const

// ── 인쇄용 보고서 마지막 쪽(참고자료) ──
// [프론트엔드 연동] 제도 설명이라 값이 바뀌지 않는다 — 문구만 고치면 된다. 흐름도 단계를 더하거나 빼면 원도 따라간다.
const PATENT_REFERENCE_TITLE = '특허평가 참고자료'
const PATENT_REFERENCE_SECTIONS = [
    {
        id: 'kpas',
        title: 'KPAS I (Kibo Patent Appraisal System)',
        // 점 목록으로 그린다.
        items: [
            'KPAS Ⅰ 은 재산적 가치가 높은 지식재산을 변별하기 위한 기술보증기금 고유의 특허등급산출 시스템입니다.',
            '본 시스템은 특허 자체의 특성이 반영된 내재적 지표와 특허가 속한 기술 환경의 특성이 반영된 외재적 지표를 활용하여 딥뉴럴네트워크(Deep Neural Network) 기술을 활용하여 특허 등급을 산출합니다',
        ],
    },
] as const

// 특허평가프로세스 — 설명 한 문단과 흐름도 한 줄이 짝을 이룬다.
const PATENT_PROCESS_TITLE = '특허평가프로세스'
const PATENT_PROCESS_FLOWS = [
    {
        id: 'model',
        description:
            'KPAS Ⅰ 은 국내 특허 DB의 특허 데이터를 활용하여 학습 데이터(Training set)와 검증 데이터(Validation set)을 구성한 뒤, 딥뉴럴네트워크(Deep Neural Network) 기술을 기반으로 특허평가 모형을 구축하였습니다.',
        steps: [
            {id: 'extract', label: '전체 국내특허\n평가지표추출'},
            {id: 'compose', label: '학습대상\n특허구성'},
            {id: 'train', label: '평가모형\n학습'},
            {id: 'validate', label: '평가모형\n검증'},
            {id: 'done', label: '특허평가모형\n완료'},
        ],
    },
    {
        id: 'grade',
        description:
            '평가대상 특허의 내재적 지표와 외재적 지표를 요인분석한 후 투입 변수를 산출하고 이를 특허평가 모형에 적용하여 최종 평가등급을 산출합니다',
        steps: [
            {id: 'extract', label: '평가대상특허\n평가지표추출'},
            {id: 'factor', label: '평가지표\n요인분석'},
            {id: 'preprocess', label: '투입변수\n전처리'},
            {id: 'apply', label: '투입변수를\n특허평가모형에\n적용'},
            {id: 'result', label: '평가등급\n산출'},
        ],
    },
] as const

const PATENT_INFLUENCE_GUIDE_TITLE = '주요 영향요인'
const PATENT_INFLUENCE_GUIDE_TEXT =
    'KPAS Ⅰ 에서 활용하고 있는 딥뉴럴네트워크는 특성상 블랙박스 모델링(Black-box modeling) 기법으로, 결과를 도출하는 프로세스를 수학적, 구조적으로 정의하여 어려운 특징이 있습니다. 따라서 KPAS Ⅰ 에서는 최종적인 결과 해석에 대한 사용자의 이해를 돕기 위해 평가 결과에 영향을 주는 주요 영향요인들을 제공하고 있습니다'

const PATENT_REPORT_COPYRIGHT = 'COPYRIGHT ⓒ 기술보증기금 KPAS 특허평가시스템 All RIGHTS RESERVED.'

// ── 인쇄용 보고서 2쪽 이후(항목별 상세) ──
// 항목(기술다양성 · 시장확장성 · 가치창출가능성)마다 한 쪽이다. details 에 넣은 항목 수만큼 쪽이 늘어난다.

/** 등급 분포 한 칸 — 등급 아홉 개(PATENT_GRADE_SCALE)와 같은 순서로 넣는다. */
type PatentGradeDistributionPoint = {
    grade: (typeof PATENT_GRADE_SCALE)[number]
    /** 그 등급에 속한 비율(%). 곡선의 높이가 된다. */
    percent: number
    /** 그 등급까지의 누적 비율(%). */
    cumulative: number
}

/** 영향요인 카드 한 장 — 막대 셋을 견준다. */
type PatentInfluenceFactor = {
    id: string
    label: string
    /** 막대 값 — IPC 그룹 · 그룹 내 상위 40% · 평가대상 특허 순으로 그린다. */
    ipcGroup: number
    top40: number
    target: number
}

/**
 * 항목 한 개의 상세 — 인쇄용 보고서 한 쪽을 채운다.
 *
 * [프론트엔드 연동] 글 안에서 굵게 보일 부분은 **별 두 개**로 감싼다(예: '등급이 **BB** 로').
 * summaryLines · influenceLines · analysis 모두 같은 규칙을 쓴다.
 */
type PatentMetricDetail = {
    id: (typeof PATENT_GRADE_METRICS)[number]['id']
    /** 메달 그림과 표에서 강조할 등급. PATENT_GRADE_SCALE 의 값이어야 한다. */
    grade: (typeof PATENT_GRADE_SCALE)[number]
    /** 항목 제목 아래 설명 줄 — 문장을 그대로 넣는다(값이 섞인 문장이라 조각내지 않는다). */
    summaryLines: string[]
    distribution: PatentGradeDistributionPoint[]
    /** 영향요인 비교 설명 줄. */
    influenceLines: string[]
    influenceFactors: PatentInfluenceFactor[]
    /** 평가대상 특허분석 상자의 문단. */
    analysis: string
}

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
    /**
     * 인쇄용 보고서의 항목별 상세(2쪽 이후). 넣은 항목 수만큼 쪽이 늘어나고, 비워 두면 1쪽만 나온다.
     * 화면 보고서는 쓰지 않는다.
     */
    details?: PatentMetricDetail[]
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
    // 인쇄용 보고서 2쪽 — 항목마다 한 쪽이다. 지금은 기술다양성 한 쪽만 둔다.
    // [프론트엔드 연동] 시장확장성 · 가치창출가능성도 같은 모양으로 더하면 3 · 4쪽이 그대로 늘어난다.
    details: [
        {
            id: 'diversity',
            grade: 'AA',
            summaryLines: [
                '평가기준일(2026-05-05) 현재 특허등급산출 결과, 전체대비 46.63% 수준에 해당되어 **BB** 등급으로 평가하였습니다.',
                '평가대상 특허가 속한 IPC 그룹은 (G06Q) 이며, 해당 그룹에 속한 특허의 수는 총 48,282 건에 해당합니다.',
                '(G06Q) 그룹에 긍정적으로 영향을 준 평가지표의 수는 13 개이고, 부정적으로 영향을 준 평가지표의 수는 3 개입니다.',
            ],
            // 등급 아홉 개의 분포 — percent 가 곡선의 높이, cumulative 가 표의 누적비율이다.
            distribution: [
                {grade: 'AAA', percent: 4, cumulative: 4},
                {grade: 'AA', percent: 7, cumulative: 11},
                {grade: 'A', percent: 12, cumulative: 23},
                {grade: 'BBB', percent: 17, cumulative: 40},
                {grade: 'BB', percent: 20, cumulative: 60},
                {grade: 'B', percent: 17, cumulative: 77},
                {grade: 'CCC', percent: 12, cumulative: 89},
                {grade: 'CC', percent: 7, cumulative: 96},
                {grade: 'C', percent: 4, cumulative: 100},
            ],
            influenceLines: [
                '[(G06Q) IPC 그룹] 긍정적 영향요인 (상위5개만표기) : 출원인수, 패밀리특허수, 도면수, IPC활동성(등록), IPC활동성평균(등록)',
                '[(G06Q) 그룹내상위40%] 긍정적 영향요인 (상위5개만표기) : 출원인수, 패밀리특허수, 도면수, IPC활동성(등록), IPC활동성평균(등록)',
            ],
            influenceFactors: [
                {id: 'competition', label: 'IPC경쟁정도(평가)', ipcGroup: 456.1, top40: 452.9, target: 466.5},
                {id: 'citation', label: '인용특허수', ipcGroup: 456.1, top40: 452.9, target: 466.5},
                {id: 'expiration', label: '평가만료일까지기간', ipcGroup: 456.1, top40: 452.9, target: 466.5},
                {id: 'claim', label: '특허청구항지수', ipcGroup: 456.1, top40: 452.9, target: 466.5},
                {id: 'activity', label: 'IPC활동성평균(등록)', ipcGroup: 456.1, top40: 452.9, target: 466.5},
            ],
            analysis:
                '평가대상 특허의 평가 시점에 경쟁 정도가 적절하여 시장 진입 및 성장에 유리한 환경을 가지고 있는 것으로 평가되었고, 선행 기술 인용을 통해 다양한 기술을 토대로 발명되었다고 평가되었습니다. 또한, 특허의 잔여 권리 유지 기간이 길어 앞으로 오랫동안 독점적 권리를 행사할 수 있어 장기적인 사업적 안정성을 보유하고 있는 것으로 평가되었습니다. 종합적으로 부정적인 영향요인 3 개 대비 긍정적인 영향요인 13 개의 기여도가 높아 **기술 다양성** 등급이 **BB** 로 산출된 것으로 평가하였습니다.',
        },
        {
            id: 'market',
            grade: 'BBB',
            summaryLines: [
                '평가기준일(2026-05-05) 현재 특허등급산출 결과, 전체 대비 46.63% 수준에 해당되어 **BBB** 등급으로 평가하였습니다.',
                '평가대상 특허가 속한 IPC 그룹은 (G06Q)이며, 해당 그룹에 속한 특허의 수는 총 48,282 건에 해당합니다.',
                '(G06Q) 그룹에 긍정적으로 영향을 준 평가 지표의 수는 10 개고, 부정적으로 영향을 준 평가 지표의 수는 6 개입니다.',
            ],
            distribution: [
                {grade: 'AAA', percent: 4, cumulative: 4},
                {grade: 'AA', percent: 7, cumulative: 11},
                {grade: 'A', percent: 12, cumulative: 23},
                {grade: 'BBB', percent: 17, cumulative: 40},
                {grade: 'BB', percent: 20, cumulative: 60},
                {grade: 'B', percent: 17, cumulative: 77},
                {grade: 'CCC', percent: 12, cumulative: 89},
                {grade: 'CC', percent: 7, cumulative: 96},
                {grade: 'C', percent: 4, cumulative: 100},
            ],
            influenceLines: [
                '[(G06Q) IPC 그룹] 긍정적 영향요인 (상위 5개만 표기) : (독립 청구항 수), (권리이전 횟수), (IPC 활동성(등록)), (IPC 활동성 평균(등록)), (IPC 크기(평가))',
                '[(G06Q) 그룹 내 상위 40%] 긍정적 영향요인 (상위 5개만 표기) : (독립 청구항 수), (권리이전 횟수), (IPC 활동성(등록)), (IPC 활동성 평균(등록)), (IPC 크기(평가))',
            ],
            influenceFactors: [
                {id: 'competition', label: 'IPC경쟁정도(평가)', ipcGroup: 456.1, top40: 452.9, target: 466.5},
                {id: 'citation', label: '인용특허수', ipcGroup: 456.1, top40: 452.9, target: 466.5},
                {id: 'expiration', label: '평가만료일까지기간', ipcGroup: 456.1, top40: 452.9, target: 466.5},
                {id: 'claim', label: '특허청구항지수', ipcGroup: 456.1, top40: 452.9, target: 466.5},
                {id: 'activity', label: 'IPC활동성평균(등록)', ipcGroup: 456.1, top40: 452.9, target: 466.5},
            ],
            analysis:
                '평가대상 특허의 전문(명세서)에 포함된 단어 수가 많아 기술 배경 및 발명의 설명이 충분하여 기술 구현의 완성도가 우수한 것으로 평가되었고, 도면의 수가 적정하여 발명의 기술적 구성과 작동원리가 상세하고 시각적으로 명확하여 기술 이해의 용이성이 우수한 것으로 평가되었습니다. 또한, 독립 청구 항의 권리 내에서 다양한 세부 기술과 실시 형태까지 보호받고 있는 것으로 평가되었습니다. 종합적으로 부정적인 영향요인 6 개 대비 긍정적인 영향요인 10 개의 기여도가 높아 **시장 확장성** 등급이 **BBB** 로 산출된 것으로 평가하였습니다.',
        },
        {
            id: 'value',
            grade: 'BBB',
            summaryLines: [
                '평가 기준일 2026-05-05 현재 특허 등급 산출 결과, 전체 대비 25.39% 수준에 해당되어 최종 **BBB** 등급으로 평가하였습니다.',
                '평가대상 특허가 속한 IPC 그룹은 (G06Q)이며, 해당 그룹에 속한 특허의 수는 총 48,282 건에 해당합니다.',
                '(G06Q) 그룹에 긍정적으로 영향을 준 평가 지표의 수는 2 개고, 부정적으로 영향을 준 평가 지표의 수는 13 개입니다.',
            ],
            distribution: [
                {grade: 'AAA', percent: 4, cumulative: 4},
                {grade: 'AA', percent: 7, cumulative: 11},
                {grade: 'A', percent: 12, cumulative: 23},
                {grade: 'BBB', percent: 17, cumulative: 40},
                {grade: 'BB', percent: 20, cumulative: 60},
                {grade: 'B', percent: 17, cumulative: 77},
                {grade: 'CCC', percent: 12, cumulative: 89},
                {grade: 'CC', percent: 7, cumulative: 96},
                {grade: 'C', percent: 4, cumulative: 100},
            ],
            influenceLines: [
                '[(G06Q) IPC 그룹] 긍정적 영향요인 (상위 5개만 표기) : (IPC 크기(평가)), (IPC 경쟁 정도(평가))',
                '[(G06Q) 그룹 내 상위 40%] 긍정적 영향요인 (상위 5개만 표기) : (IPC 크기(평가)), (IPC 경쟁 정도(평가))',
            ],
            influenceFactors: [
                {id: 'competition', label: 'IPC경쟁정도(평가)', ipcGroup: 456.1, top40: 452.9, target: 466.5},
                {id: 'citation', label: '인용특허수', ipcGroup: 456.1, top40: 452.9, target: 466.5},
                {id: 'expiration', label: '평가만료일까지기간', ipcGroup: 456.1, top40: 452.9, target: 466.5},
                {id: 'claim', label: '특허청구항지수', ipcGroup: 456.1, top40: 452.9, target: 466.5},
                {id: 'activity', label: 'IPC활동성평균(등록)', ipcGroup: 456.1, top40: 452.9, target: 466.5},
            ],
            analysis:
                '평가대상 특허의 평가 시점에 경쟁 정도가 적절하여 시장 진입 및 성장에 유리한 환경을 가지고 있고, 평가 시점에 해당 IPC 분야의 시장 잠재력이 매우 커서 미래 성장 가능성이 높게 평가되었습니다. 또한, 특허가 등록되기까지 심사과정에서 취해진 조치의 수가 적절했고, 심사관의 기술적 이견 없이 발명의 신규성 및 진보성이 높은 것으로 평가되었습니다. 종합적으로 부정적인 영향요인 13 개 대비 긍정적인 영향요인 2 개의 기여도가 높아 **가치창출가능성** 등급이 **BBB** 로 산출된 것으로 평가하였습니다.',
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
    PATENT_ANALYSIS_FOOTNOTE,
    PATENT_INFLUENCE_GUIDE_TEXT,
    PATENT_INFLUENCE_GUIDE_TITLE,
    PATENT_PROCESS_FLOWS,
    PATENT_PROCESS_TITLE,
    PATENT_REFERENCE_SECTIONS,
    PATENT_REFERENCE_TITLE,
    PATENT_REPORT_COPYRIGHT,
    PATENT_ANALYSIS_TITLE,
    PATENT_DISTRIBUTION_ROW_LABELS,
    PATENT_INFLUENCE_BARS,
    PATENT_INFLUENCE_FOOTNOTE,
    PATENT_INFLUENCE_TITLE,
    PATENT_REPORT_CREATED_AT_LABEL,
    PATENT_REPORT_EYEBROW,
    PATENT_REPORT_INVENTION_TITLE,
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
export type {
    PatentGradeDistributionPoint,
    PatentGradeReport,
    PatentGradeTrendPoint,
    PatentInfluenceFactor,
    PatentMetricDetail,
    PatentSearchType,
    PatentSummaryRow,
}
