import type {EvaluationGradeUnit, EvaluationModel, EvaluationResultAction} from '@/constants/evaluation-result'

// 기관 마이페이지 — 평가검증 신청 조회.
//
// 기업이 보낸 자가진단 한 건이 카드 한 장이고, 그 아래에 이 기관이 지금까지 검증한 이력이 접혀 있다.
// 카드의 생김새(값 배지·상세 줄·버튼)는 평가결과 조회와 같다 — components/custom/evaluation-card 참고.

/** 검증 이력 한 줄 — 어느 팀이 언제 검증했고 그 결과가 얼마였는지. */
export type VerificationHistoryItem = {
    id: string
    /** 검증한 기관·팀 이름(예: 부산은행 재무팀). */
    team: string
    /** 검증일(YYYY-MM-DD). */
    verifiedAt: string
    /** 검증 결과값 — 모형에 따라 등급(AA·B+)이거나 점수다. */
    grade: string
    actions: readonly EvaluationResultAction[]
}

/** 신청 한 건 = 카드 한 장. */
export type VerificationApplicationItem = {
    id: string
    model: EvaluationModel
    /** 자가진단 결과값 — 뒤에 붙는 단위는 모형 표(EVALUATION_MODEL_TABS)가 정한다. */
    grade: string
    /** 접수일(YYYY-MM-DD). */
    receivedAt: string
    companyName: string
    /** 기업 사업자번호 — 받은 표기를 그대로 보여 준다. */
    businessNumber: string
    /** [평가검증 하기] 가 여는 화면. */
    verifyHref: string
    actions: readonly EvaluationResultAction[]
    /** 이 신청에 달린 검증 이력. 비어 있으면 펼침 줄이 나오지 않는다. */
    history: readonly VerificationHistoryItem[]
}

/** 한 페이지에 보여 줄 카드 수 — 2건이라 목록이 짧아도 페이지 이동을 확인할 수 있다(평가결과 조회와 같다). */
export const VERIFICATION_APPLICATION_PAGE_SIZE = 2

/** 카드를 여는 줄의 문구 — 몇 건이 들어 있는지 함께 알린다[6.4.3]. */
export const verificationHistoryToggleLabel = (count: number, isOpen: boolean) =>
    isOpen ? `평가검증 이력 ${count}건 접기` : `평가검증 이력 ${count}건 펼쳐보기`

/** 결과값 단위를 찾지 못했을 때 쓰는 기본값. */
export const DEFAULT_VERIFICATION_GRADE_UNIT: EvaluationGradeUnit = '등급'
