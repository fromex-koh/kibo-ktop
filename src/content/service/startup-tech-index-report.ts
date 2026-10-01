import {getEvaluationReportLabel, type EvaluationReportKind} from '@/constants/evaluation-report'
import {TECH_INDEX_BANDS, type TechIndexReport} from '@/content/service/tech-index-report'

// 창업용 Tech-Index 일반분석 리포트 — 새 창으로 여는 인쇄용 문서(A4 한 장)의 값과 문구.
//
// 문서 짜임은 Tech-Index 일반분석과 같고(components/custom/tech-index-report.tsx 를 함께 쓴다),
// 다른 것은 이 파일의 값뿐이다:
//   · 꼬리표   [Tech-Index(창업용) · 기술평가(기업) · 개별평가(기관) · 일반분석]
//   · 구획 제목 '창업 Tech-Index 지수정보'
//   · 4대 혁신역량 상자 아래 각주 한 줄(competencyNote)
//
// [프론트엔드 연동] 문서에 나오는 값과 문구는 모두 이 파일에 있다 — 화면 파일을 열지 않고 여기서 고친다.
// 바꾸는 자리: 아래 '목업(API 연결 시 교체)' 구역. 조회 API 를 붙일 때는 목업 대신 응답을 같은
// 모양(TechIndexReport)으로 맞춰 getStartupTechIndexReport 가 돌려주게 하면 화면은 그대로 그린다.

const STARTUP_TECH_INDEX_SECTION_TITLE = '창업 Tech-Index 지수정보'

// ── 목업(API 연결 시 교체) ────────────────────────────────────────────────────────

const MOCK_STARTUP_TECH_INDEX_REPORT: Omit<TechIndexReport, 'label'> = {
    scoreSectionTitle: STARTUP_TECH_INDEX_SECTION_TITLE,
    score: 73.7,
    bands: TECH_INDEX_BANDS,
    summary:
        '신청기업 **스타트업A**에 대하여 혁신성장역량 평가를 수행한 결과, **Tech-Index 지수는 73.7점**으로 평가되었습니다.',
    competencies: [
        {id: 'infra', label: '인프라', score: 63.7},
        {id: 'input', label: '투입', score: 88.2},
        {id: 'activity', label: '활동', score: 53.4},
        {id: 'outcome', label: '성과', score: 37.1},
    ],
    competencyNote:
        '* 세부 4대 혁신역량 점수는 인프라 90.1점, 투입 79.5점, 활동 71.9점, 성과 79.5점으로 산출되었습니다.',
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

// [프론트엔드 연동] 창업용 Tech-Index 리포트 조회 API 로 바꾼다 — 화면(page.tsx)은 이 함수만 부른다.
// 문서 꼬리표도 여기서 만든다 — 기업과 기관이 같은 문서를 다른 메뉴에서 열어 앞말만 갈린다:
//   기업 'tech-general' → [Tech-Index(창업용) · 기술평가 · 일반분석]
//   기관 'general'      → [Tech-Index(창업용) · 개별평가 · 일반분석]
const getStartupTechIndexReport = async (kind: EvaluationReportKind = 'tech-general'): Promise<TechIndexReport> => ({
    ...MOCK_STARTUP_TECH_INDEX_REPORT,
    label: getEvaluationReportLabel('startup-tech-index', kind),
})

export {getStartupTechIndexReport, STARTUP_TECH_INDEX_SECTION_TITLE}
