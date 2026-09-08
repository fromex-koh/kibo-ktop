import {
    GUARANTEE_RECOMMENDATION_FIELD,
    type EvaluationModel,
    type EvaluationResultAction,
    type OrgEvaluationHistoryItem,
} from '@/constants/evaluation-result'

// 기관 평가결과 조회 데이터.
//
// [프론트엔드 연동] 화면(page.tsx)은 getOrgEvaluationHistory() 하나만 부른다 — 목업을 실제 조회 API 로
// 바꿀 때 고칠 파일은 여기뿐이고 화면·목록 컴포넌트는 건드리지 않는다.
//   1) MOCK_ORG_EVALUATION_HISTORY 를 지우고
//   2) getOrgEvaluationHistory 안에서 조회 API 를 부른 뒤
//   3) 응답을 OrgEvaluationHistoryItem(= 카드 한 장) 모양으로 맞춰 돌려준다.
// 응답이 빈 배열이면 목록 자리에 "검색내역이 없습니다." 안내가 나온다.
//
// 조회 조건(모형·평가 방식·조회기간·검색어)은 지금 목록 컴포넌트가 화면 안에서 거른다. 서버 조회로
// 넘길 때는 이 함수에 조건을 받는 인자를 열고 목록의 [프론트엔드 연동] 주석 자리에서 부른다.

// 카드 버튼이 여는 화면 — 보증추천은 아직 화면이 없어 자리를 비워 둔다.
// [개별평가 일반 결과]·[개별평가 심층 결과]는 같은 창이 아니라 시안 폭에 맞춘 새 창(인쇄용 리포트)으로 연다.
const NOT_READY_PATH = '#'
const GENERAL_ANALYSIS_PATH = '/org/mypage/evaluation-history/general-analysis'
const DEEP_ANALYSIS_PATH = '/org/mypage/evaluation-history/deep-analysis'

// 결과 리포트는 모형마다 화면이 따로 있다 — 카드의 모형을 그대로 주소에 쓴다.
// 일반 결과는 자가진단 평가결과 한 벌이고, 심층 결과는 거기에 기술평가서와 세부내역이 더 붙는다.
const generalResult = (model: EvaluationModel): EvaluationResultAction => ({
    label: '개별평가 일반 결과',
    href: `${GENERAL_ANALYSIS_PATH}/${model}`,
    newWindow: true,
})

const deepResult = (model: EvaluationModel): EvaluationResultAction => ({
    label: '개별평가 심층 결과',
    href: `${DEEP_ANALYSIS_PATH}/${model}`,
    newWindow: true,
})
// 보증추천은 입력을 마치면 버튼 이름이 [보증이력]으로 바뀐다(시안 주석) — 어느 이름을 보일지는
// 응답이 정하므로 화면이 아니라 이 데이터가 들고 있다.
// [보증추천]은 화면 이동이 아니라 모달을 연다(opens).
const GUARANTEE_RECOMMEND = {label: '보증추천', href: NOT_READY_PATH, opens: 'guarantee-recommendation'} as const
const GUARANTEE_HISTORY = {label: '보증이력', href: NOT_READY_PATH, opens: 'guarantee-history'} as const

// 시안 "평가결과 조회 case"(40007389:132689)의 카드 17장을 그대로 옮긴 것이다 — 시트에 없는 건은 두지
// 않는다. 값(기업명·사업자번호·조회 기관·신청일·처리일·사업/과제명·기업 수)도 시트에 적힌 그대로다.
//
//   탭 · 2depth              카드
//   ─────────────────────────────────────────────────────────────────────────────
//   KTRS-FM                  개별평가 2장 — [보증추천] · [보증이력]
//   Tech-Index 개별평가       1장 (86.6 점)
//   Tech-Index 일괄평가       반려 · 승인대기중 · 승인완료
//   Tech-Index 대량정보조회    반려 · 승인대기중 · 승인완료
//   창업용 개별평가            1장 (78.6 점)
//   창업용 일괄평가            반려 · 승인대기중 · 승인완료
//   창업용 대량정보조회        반려 · 승인대기중 · 승인완료
//   투자모형                  1장 (B+ 등급)
//
// [접수취소]가 열려 있는지는 상태만으로 정해지지 않는다(canCancel) — 시트에 네 경우가 모두 나온다.
//   반려 + 취소 가능    Tech-Index 일괄평가
//   반려 + 취소 잠김    Tech-Index 대량정보조회 · 창업용 일괄평가 · 창업용 대량정보조회
//   승인완료 + 취소 가능 Tech-Index·창업용 대량정보조회
//   승인완료 + 취소 잠김 Tech-Index·창업용 일괄평가
//
// 처리일은 승인·반려된 뒤 생기므로 승인대기중 카드에는 없다 — 시트의 창업용 일괄평가(승인대기중) 한 장만
// 예외로 처리일이 있어 그대로 옮겼다.
// 결과가 없을 때의 빈 상태는 이 배열을 비우면 그대로 확인할 수 있다.
const MOCK_ORG_EVALUATION_HISTORY: readonly OrgEvaluationHistoryItem[] = [
    // ── KTRS-FM · 개별평가 (시안 2장)
    {
        id: 'org-evaluation-001',
        model: 'ktrs-fm',
        evaluationType: 'individual',
        grade: 'AA',
        evaluatedAt: '2026-05-15',
        companyName: '(주)테크놀로지',
        businessNumber: '683-68-00428',
        requestedBy: '부산은행 울산지점',
        actions: [generalResult('ktrs-fm'), deepResult('ktrs-fm'), GUARANTEE_RECOMMEND],
    },
    {
        // 보증추천 입력을 마친 건 — 마지막 버튼이 [보증이력]으로 바뀐다
        id: 'org-evaluation-002',
        model: 'ktrs-fm',
        evaluationType: 'individual',
        grade: 'AA',
        evaluatedAt: '2026-05-15',
        companyName: '(주)테크놀로지',
        businessNumber: '683-68-00428',
        requestedBy: '부산은행 울산지점',
        actions: [generalResult('ktrs-fm'), deepResult('ktrs-fm'), GUARANTEE_HISTORY],
    },

    // ── Tech-Index · 개별평가 (시안 1장)
    {
        id: 'org-evaluation-101',
        model: 'tech-index',
        evaluationType: 'individual',
        grade: '86.6',
        evaluatedAt: '2026-05-15',
        companyName: '(주)테크놀로지',
        businessNumber: '683-68-00428',
        requestedBy: '부산은행 울산지점',
        actions: [generalResult('tech-index'), deepResult('tech-index')],
    },

    // ── Tech-Index · 일괄평가 (시안 3장 — 반려 · 승인대기중 · 승인완료)
    {
        // 반려지만 접수취소가 열려 있는 건
        id: 'org-evaluation-111',
        model: 'tech-index',
        evaluationType: 'batch',
        status: 'rejected',
        canCancel: true,
        companyCount: 25,
        requestedAt: '2026-05-15',
        processedAt: '2026-05-17',
        projectName: '2026년 5월 1차 일괄평가',
        requestedBy: '부산은행 울산지점',
    },
    {
        // 처리 전이라 처리일이 없다
        id: 'org-evaluation-112',
        model: 'tech-index',
        evaluationType: 'batch',
        status: 'pending',
        canCancel: true,
        companyCount: 25,
        requestedAt: '2026-05-15',
        projectName: '2026년 5월 1차 일괄평가',
        requestedBy: '부산은행 울산지점',
    },
    {
        id: 'org-evaluation-113',
        model: 'tech-index',
        evaluationType: 'batch',
        status: 'approved',
        canCancel: false,
        companyCount: 25,
        requestedAt: '2026-05-15',
        processedAt: '2026-05-17',
        projectName: '2026년 5월 1차 일괄평가',
        requestedBy: '부산은행 울산지점',
    },

    // ── Tech-Index · 대량정보조회 (시안 3장)
    {
        id: 'org-evaluation-121',
        model: 'tech-index',
        evaluationType: 'bulk-info',
        status: 'rejected',
        canCancel: false,
        companyCount: 25,
        requestedAt: '2026-05-15',
        processedAt: '2026-05-17',
        projectName: '2026년 5월 1차 일괄평가',
        requestedBy: '부산은행 울산지점',
    },
    {
        id: 'org-evaluation-122',
        model: 'tech-index',
        evaluationType: 'bulk-info',
        status: 'pending',
        canCancel: true,
        companyCount: 25,
        requestedAt: '2026-05-15',
        projectName: '2026년 5월 1차 일괄평가',
        requestedBy: '부산은행 울산지점',
    },
    {
        // 승인 뒤에도 접수취소가 열려 있는 건
        id: 'org-evaluation-123',
        model: 'tech-index',
        evaluationType: 'bulk-info',
        status: 'approved',
        canCancel: true,
        companyCount: 25,
        requestedAt: '2026-05-15',
        processedAt: '2026-05-17',
        projectName: '2026년 5월 1차 일괄평가',
        requestedBy: '부산은행 울산지점',
    },

    // ── 창업용 Tech-Index · 개별평가 (시안 1장)
    {
        id: 'org-evaluation-201',
        model: 'startup-tech-index',
        evaluationType: 'individual',
        grade: '78.6',
        evaluatedAt: '2026-05-15',
        companyName: '(주)테크놀로지',
        businessNumber: '683-68-00428',
        requestedBy: '부산은행 울산지점',
        actions: [generalResult('startup-tech-index'), deepResult('startup-tech-index')],
    },

    // ── 창업용 Tech-Index · 일괄평가 (시안 3장)
    {
        id: 'org-evaluation-211',
        model: 'startup-tech-index',
        evaluationType: 'batch',
        status: 'rejected',
        canCancel: false,
        companyCount: 25,
        requestedAt: '2026-05-15',
        processedAt: '2026-05-17',
        projectName: '2026년 5월 1차 일괄평가',
        requestedBy: '부산은행 울산지점',
    },
    {
        // 시안에는 이 승인대기중 건에만 처리일이 있다 — 시트를 그대로 옮겼다
        id: 'org-evaluation-212',
        model: 'startup-tech-index',
        evaluationType: 'batch',
        status: 'pending',
        canCancel: true,
        companyCount: 25,
        requestedAt: '2026-05-15',
        processedAt: '2026-05-17',
        projectName: '2026년 5월 1차 일괄평가',
        requestedBy: '부산은행 울산지점',
    },
    {
        id: 'org-evaluation-213',
        model: 'startup-tech-index',
        evaluationType: 'batch',
        status: 'approved',
        canCancel: false,
        companyCount: 25,
        requestedAt: '2026-05-15',
        processedAt: '2026-05-17',
        projectName: '2026년 5월 1차 일괄평가',
        requestedBy: '부산은행 울산지점',
    },

    // ── 창업용 Tech-Index · 대량정보조회 (시안 3장)
    {
        id: 'org-evaluation-221',
        model: 'startup-tech-index',
        evaluationType: 'bulk-info',
        status: 'rejected',
        canCancel: false,
        companyCount: 25,
        requestedAt: '2026-05-15',
        processedAt: '2026-05-17',
        projectName: '2026년 5월 1차 일괄평가',
        requestedBy: '부산은행 울산지점',
    },
    {
        id: 'org-evaluation-222',
        model: 'startup-tech-index',
        evaluationType: 'bulk-info',
        status: 'pending',
        canCancel: true,
        companyCount: 25,
        requestedAt: '2026-05-15',
        projectName: '2026년 5월 1차 일괄평가',
        requestedBy: '부산은행 울산지점',
    },
    {
        id: 'org-evaluation-223',
        model: 'startup-tech-index',
        evaluationType: 'bulk-info',
        status: 'approved',
        canCancel: true,
        companyCount: 25,
        requestedAt: '2026-05-15',
        processedAt: '2026-05-17',
        projectName: '2026년 5월 1차 일괄평가',
        requestedBy: '부산은행 울산지점',
    },

    // ── 투자모형 · 개별평가 (시안 1장)
    {
        id: 'org-evaluation-301',
        model: 'investment-model',
        evaluationType: 'individual',
        grade: 'B+',
        evaluatedAt: '2026-05-15',
        companyName: '(주)테크놀로지',
        businessNumber: '683-68-00428',
        requestedBy: '부산은행 울산지점',
        actions: [generalResult('investment-model'), deepResult('investment-model')],
    },
]

// 보증추천 모달이 미리 채워 두는 값 — 그 평가 건에서 이미 아는 기업 정보다.
// [프론트엔드 연동] 실제로는 카드가 들고 있는 건의 값을 넣는다(지금은 시안 카드의 값 그대로).
const GUARANTEE_RECOMMENDATION_DEFAULTS: Record<string, string> = {
    [GUARANTEE_RECOMMENDATION_FIELD.companyName]: '(주)테크놀로지',
    [GUARANTEE_RECOMMENDATION_FIELD.businessNumber]: '683-68-00428',
}

/** 한 페이지에 보여 줄 건수 — 2건이라 어느 탭에서든 페이지 이동을 확인할 수 있다. */
const ORG_EVALUATION_HISTORY_PAGE_SIZE = 2

/** 기관 평가결과 조회 — 지금은 목업을 그대로 돌려주고, 연동 후에는 조회 API 응답을 돌려준다. */
const getOrgEvaluationHistory = (): Promise<readonly OrgEvaluationHistoryItem[]> =>
    Promise.resolve(MOCK_ORG_EVALUATION_HISTORY)

export {getOrgEvaluationHistory, GUARANTEE_RECOMMENDATION_DEFAULTS, ORG_EVALUATION_HISTORY_PAGE_SIZE}
