import type {EvaluationModel, EvaluationResultAction, EvaluationResultItem} from '@/constants/evaluation-result'

// 평가결과 조회 데이터.
//
// [프론트엔드 연동] 화면(page.tsx)은 getEvaluationResults() 하나만 부른다 — 목업을 실제 조회 API 로
// 바꿀 때 고칠 파일은 여기뿐이고 화면·목록 컴포넌트는 건드리지 않는다.
//   1) MOCK_EVALUATION_RESULTS 를 지우고
//   2) getEvaluationResults 안에서 조회 API 를 부른 뒤
//   3) 응답을 EvaluationResultItem(= 카드 한 장) 모양으로 맞춰 돌려준다.
// 응답이 빈 배열이면 목록 자리에 "검색내역이 없습니다." 안내가 나온다(시안 "내역없음").
//
// 조회 조건(모형 탭·조회기간)은 지금 목록 컴포넌트가 화면 안에서 거른다. 서버 조회로 넘길 때는
// getEvaluationResults 에 조건을 받는 인자를 열고 목록의 [프론트엔드 연동] 주석 자리에서 부른다.

// 카드 버튼이 여는 화면. [자가진단 결과]는 같은 창이 아니라 시안 폭에 맞춘 새 창(인쇄용 리포트)으로 열고,
// 리포트 화면은 모형마다 따로 있다 — 카드의 모형을 그대로 주소에 쓴다.
const GENERAL_ANALYSIS_PATH = '/corp/mypage/evaluation-results/general-analysis'
const BANK_TRANSFER_PATH = '/corp/mypage/evaluation-results/bank-transfer'
const GUARANTEE_PATH = '/corp/mypage/evaluation-results/guarantee-application'

const selfDiagnosisResult = (model: EvaluationModel): EvaluationResultAction => ({
    label: '자가진단 결과',
    href: `${GENERAL_ANALYSIS_PATH}/${model}`,
    newWindow: true,
})

// 시안 "평가결과 조회 case" 의 모형별 케이스를 그대로 담았다 — 탭을 눌러 넷을 각각 확인할 수 있다.
//   · KTRS-FM        : 등급(AA 등) · [자가진단 결과·은행 전송·보증신청] 셋
//   · Tech-Index     : 점수(6.6 점) · [자가진단 결과] 하나
//   · 창업용 Tech-Index : 점수(8.4 점) · [자가진단 결과] 하나
//   · 투자모형        : 등급(B+)    · [자가진단 결과] 하나
// 은행전송·보증신청을 이미 마친 건(done)은 그 두 버튼이 잠긴다 — KTRS-FM 목록에 섞어 두었다.
// KTRS-FM 은 한 페이지(5건)를 넘는 12건이라 페이지 이동까지 확인할 수 있다.
// 결과가 없을 때의 빈 상태("검색내역이 없습니다.")는 이 배열을 비우면 그대로 확인할 수 있다.
const MOCK_EVALUATION_RESULTS: readonly EvaluationResultItem[] = [
    {
        id: 'corp-evaluation-001',
        model: 'ktrs-fm',
        grade: 'AA',
        evaluatedAt: '2026-05-15',
        actions: [
            selfDiagnosisResult('ktrs-fm'),
            {label: '은행 전송', href: BANK_TRANSFER_PATH},
            {label: '보증신청', href: GUARANTEE_PATH},
        ],
    },
    {
        id: 'corp-evaluation-002',
        model: 'ktrs-fm',
        grade: 'A',
        evaluatedAt: '2026-04-28',
        actions: [
            selfDiagnosisResult('ktrs-fm'),
            {label: '은행 전송', href: BANK_TRANSFER_PATH, done: true},
            {label: '보증신청', href: GUARANTEE_PATH, done: true},
        ],
    },
    {
        id: 'corp-evaluation-003',
        model: 'ktrs-fm',
        grade: 'AAA',
        evaluatedAt: '2026-04-10',
        actions: [
            selfDiagnosisResult('ktrs-fm'),
            {label: '은행 전송', href: BANK_TRANSFER_PATH},
            {label: '보증신청', href: GUARANTEE_PATH},
        ],
    },
    {
        id: 'corp-evaluation-004',
        model: 'ktrs-fm',
        grade: 'BBB',
        evaluatedAt: '2026-03-27',
        actions: [
            selfDiagnosisResult('ktrs-fm'),
            {label: '은행 전송', href: BANK_TRANSFER_PATH, done: true},
            {label: '보증신청', href: GUARANTEE_PATH, done: true},
        ],
    },
    {
        id: 'corp-evaluation-005',
        model: 'ktrs-fm',
        grade: 'A',
        evaluatedAt: '2026-03-05',
        actions: [
            selfDiagnosisResult('ktrs-fm'),
            {label: '은행 전송', href: BANK_TRANSFER_PATH},
            {label: '보증신청', href: GUARANTEE_PATH},
        ],
    },
    {
        id: 'corp-evaluation-006',
        model: 'ktrs-fm',
        grade: 'AA',
        evaluatedAt: '2026-02-19',
        actions: [
            selfDiagnosisResult('ktrs-fm'),
            {label: '은행 전송', href: BANK_TRANSFER_PATH, done: true},
            {label: '보증신청', href: GUARANTEE_PATH, done: true},
        ],
    },
    {
        id: 'corp-evaluation-007',
        model: 'ktrs-fm',
        grade: 'BB',
        evaluatedAt: '2026-01-30',
        actions: [
            selfDiagnosisResult('ktrs-fm'),
            {label: '은행 전송', href: BANK_TRANSFER_PATH},
            {label: '보증신청', href: GUARANTEE_PATH},
        ],
    },
    {
        id: 'corp-evaluation-008',
        model: 'ktrs-fm',
        grade: 'A',
        evaluatedAt: '2026-01-12',
        actions: [
            selfDiagnosisResult('ktrs-fm'),
            {label: '은행 전송', href: BANK_TRANSFER_PATH},
            {label: '보증신청', href: GUARANTEE_PATH},
        ],
    },
    {
        id: 'corp-evaluation-009',
        model: 'ktrs-fm',
        grade: 'BBB',
        evaluatedAt: '2025-12-22',
        actions: [
            selfDiagnosisResult('ktrs-fm'),
            {label: '은행 전송', href: BANK_TRANSFER_PATH, done: true},
            {label: '보증신청', href: GUARANTEE_PATH, done: true},
        ],
    },
    {
        id: 'corp-evaluation-010',
        model: 'ktrs-fm',
        grade: 'AA',
        evaluatedAt: '2025-11-28',
        actions: [
            selfDiagnosisResult('ktrs-fm'),
            {label: '은행 전송', href: BANK_TRANSFER_PATH},
            {label: '보증신청', href: GUARANTEE_PATH},
        ],
    },
    {
        id: 'corp-evaluation-011',
        model: 'ktrs-fm',
        grade: 'B',
        evaluatedAt: '2025-11-06',
        actions: [
            selfDiagnosisResult('ktrs-fm'),
            {label: '은행 전송', href: BANK_TRANSFER_PATH},
            {label: '보증신청', href: GUARANTEE_PATH},
        ],
    },
    {
        id: 'corp-evaluation-012',
        model: 'ktrs-fm',
        grade: 'A',
        evaluatedAt: '2025-10-15',
        actions: [
            selfDiagnosisResult('ktrs-fm'),
            {label: '은행 전송', href: BANK_TRANSFER_PATH, done: true},
            {label: '보증신청', href: GUARANTEE_PATH, done: true},
        ],
    },
    {
        id: 'corp-evaluation-101',
        model: 'tech-index',
        grade: '6.6',
        evaluatedAt: '2026-05-15',
        actions: [selfDiagnosisResult('tech-index')],
    },
    {
        id: 'corp-evaluation-102',
        model: 'tech-index',
        grade: '7.1',
        evaluatedAt: '2026-03-18',
        actions: [selfDiagnosisResult('tech-index')],
    },
    {
        id: 'corp-evaluation-201',
        model: 'startup-tech-index',
        grade: '8.4',
        evaluatedAt: '2026-05-15',
        actions: [selfDiagnosisResult('startup-tech-index')],
    },
    {
        id: 'corp-evaluation-301',
        model: 'investment-model',
        grade: 'B+',
        evaluatedAt: '2026-05-15',
        actions: [selfDiagnosisResult('investment-model')],
    },
]

/** 한 페이지에 보여 줄 건수. */
const EVALUATION_RESULT_PAGE_SIZE = 5

/** 평가결과 조회 — 지금은 목업을 그대로 돌려주고, 연동 후에는 조회 API 응답을 돌려준다. */
const getEvaluationResults = (): Promise<readonly EvaluationResultItem[]> => Promise.resolve(MOCK_EVALUATION_RESULTS)

export {getEvaluationResults, EVALUATION_RESULT_PAGE_SIZE}
