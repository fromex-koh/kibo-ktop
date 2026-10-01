import {getEvaluationReportLabel, type EvaluationReportKind} from '@/constants/evaluation-report'
import type {ReportTableRow} from '@/components/custom/report-document'

// Tech-Index 일반분석 리포트 — 새 창으로 여는 인쇄용 문서(A4 한 장)의 값과 문구.
//
// [프론트엔드 연동] 문서에 나오는 값과 문구는 모두 이 파일에 있다 — 화면 파일을 열지 않고 여기서 고친다.
// 바꾸는 자리: 아래 '목업(API 연결 시 교체)' 구역. 조회 API 를 붙일 때는 목업 대신 응답을 같은
// 모양(TechIndexReport)으로 맞춰 getTechIndexReport 가 돌려주게 하면 화면은 그대로 그린다.
// 제목 · 도넛 안 이름 · 지수 구간처럼 응답이 바뀌어도 그대로인 값도 이 파일 위쪽에 함께 둔다.

/** 지수 구간 한 줄 — '61-80 · 양호'. 받은 점수가 드는 구간은 화면이 스스로 찾아 강조한다. */
type TechIndexBand = {
    /** 구간 이름. 표 왼쪽 칸에 그대로 적힌다. */
    range: string
    /** 구간의 등급 이름(취약 · 미흡 · 보통 · 양호 · 우수). */
    label: string
    /** 구간의 아래·위 끝(점). 받은 점수가 이 사이에 들면 그 줄이 강조된다. */
    min: number
    max: number
}

/** 4대 혁신역량 점수 한 칸. */
type TechIndexCompetency = {
    id: string
    label: string
    score: number
}

type TechIndexReport = {
    /** 문서 제목 옆 꼬리표. 모형·평가 종류가 바뀌면 이 말도 바뀐다. */
    label: string
    /** 지수 구획의 제목. 모형마다 다르다('Tech-Index 지수정보' · '창업 Tech-Index 지수정보'). */
    scoreSectionTitle: string
    /** Tech-Index 지수(0~100). 도넛과 요약 문장이 같은 값을 쓴다. */
    score: number
    bands: readonly TechIndexBand[]
    /**
     * 도넛 아래 요약 문장. 별 두 개(**…**)로 감싼 부분이 굵게 선다.
     * [프론트엔드 연동] 기업명·점수가 들어가는 문장이라 조각내지 않고 한 덩어리로 받는다.
     * 두 줄까지는 A4 한 장에 들어간다 — 세 줄이 되면 다음 장이 생기므로 기업명이 길어질 때 확인한다.
     */
    summary: string
    competencies: readonly TechIndexCompetency[]
    /** 4대 혁신역량 상자 아래 각주 한 줄. 없으면 그 줄을 두지 않는다(창업용에만 있다). */
    competencyNote?: string
    company: readonly ReportTableRow[]
    indexDescriptions: readonly string[]
    /** 유의사항. 굵은 글자 없이 한 덩어리로 그린다. */
    disclaimer: string
}

const TECH_INDEX_DOCUMENT_TITLE = '혁신성장역량 평가결과'
const TECH_INDEX_SECTION_TITLE = 'Tech-Index 지수정보'
const TECH_INDEX_SCORE_CAPTION = 'Tech-Index Score'

// 지수 구간 — 응답이 바뀌어도 그대로인 값이라 목업과 따로 둔다.
const TECH_INDEX_BANDS: readonly TechIndexBand[] = [
    {range: '0-20', label: '취약', min: 0, max: 20},
    {range: '21-40', label: '미흡', min: 21, max: 40},
    {range: '41-60', label: '보통', min: 41, max: 60},
    {range: '61-80', label: '양호', min: 61, max: 80},
    {range: '81-100', label: '우수', min: 81, max: 100},
]

// 점수가 드는 구간 — 없으면(범위 밖) 아무 줄도 강조하지 않는다.
const findTechIndexBand = (score: number): TechIndexBand | undefined =>
    TECH_INDEX_BANDS.find((band) => score >= band.min && score <= band.max)

// ── 목업(API 연결 시 교체) ────────────────────────────────────────────────────────

const MOCK_TECH_INDEX_REPORT: Omit<TechIndexReport, 'label'> = {
    scoreSectionTitle: TECH_INDEX_SECTION_TITLE,
    score: 73.7,
    bands: TECH_INDEX_BANDS,
    summary:
        '신청기업 **(주)테크놀로지**에 대하여 전문가검증 혁신성장역량 평가를 수행한 결과, **Tech-Index 지수는 73.7점**으로 평가되었습니다.',
    competencies: [
        {id: 'infra', label: '인프라', score: 63.7},
        {id: 'input', label: '투입', score: 88.2},
        {id: 'activity', label: '활동', score: 53.4},
        {id: 'outcome', label: '성과', score: 37.1},
    ],
    company: [
        {label: '회사명', value: '㈜테크놀로지'},
        {label: '대표자', value: '홍길동'},
        {label: '사업자번호', value: '123-45-67890'},
        {label: '설립일자', value: '2020-04-27'},
        {label: '주소', value: '(08500) 서울특별시 금천구 가산디지털1로 168'},
    ],
    indexDescriptions: [
        'Tech-Index는 현재의 기술역량과 미래성장의 잠재력 수준을 측정하는 AI평가모형 기반의 복합지수입니다.',
        'Tech-Index는 현재 기업의 내재적 기술혁신역량을 나타내는 지수(Index)이면서 동시에 미래성장성을 예측해 볼 수 있는 확률적인 점수를 의미합니다.',
        'Tech-Index는 ‘기업성장의 선순환 구조’ 이론에 착안하여 기업성장과 관련한 인프라, 투입, 활동, 성과의 4대 혁신역량으로 구성되어 있으며, 혁신역량은 이를 대표하는 14개 투입지표로 구성되어 있습니다.',
        '사업의 선순환 구조는 기술사업화를 위해 「인프라 확대→투입(역량투자)→활동(개발 등)→성과창출」을 하여 고성장을 이루고, 이익의 재투자로 지속적으로 선순환하며 지속가능성장을 이루는 구조',
    ],
    disclaimer:
        '본 자료는 어떠한 경우에도 당 기금의 서면동의 없이 무단전재, 복사, 배포될 수 없습니다. 또한 본 자료에 수록된 내용은 당 기금이 신뢰할 만한 자료 및 정보로부터 얻어진 것이나 그 정확성이나 완전성을 보장할 수 없으므로 고객의 판단과 책임하에 최종 의사결정을 하시기 바랍니다. 따라서 어떠한 경우에도 본 자료는 고객의 의사 결정에 대한 법적 책임소재의 증빙자료로 사용될 수 없습니다.',
}

// [프론트엔드 연동] Tech-Index 리포트 조회 API 로 바꾼다 — 화면(page.tsx)은 이 함수만 부른다.
// 문서 꼬리표도 여기서 만든다 — 기업과 기관이 같은 문서를 다른 메뉴에서 열어 앞말만 갈린다:
//   기업 'tech-general' → [Tech-Index · 기술평가 · 일반분석]
//   기관 'general'      → [Tech-Index · 개별평가 · 일반분석]
const getTechIndexReport = async (kind: EvaluationReportKind = 'tech-general'): Promise<TechIndexReport> => ({
    ...MOCK_TECH_INDEX_REPORT,
    label: getEvaluationReportLabel('tech-index', kind),
})

export {
    findTechIndexBand,
    getTechIndexReport,
    TECH_INDEX_BANDS,
    TECH_INDEX_DOCUMENT_TITLE,
    TECH_INDEX_SCORE_CAPTION,
    TECH_INDEX_SECTION_TITLE,
}
export type {TechIndexBand, TechIndexCompetency, TechIndexReport}
