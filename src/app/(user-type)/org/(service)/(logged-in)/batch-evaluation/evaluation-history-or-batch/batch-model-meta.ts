// 기관 일괄평가의 모형(일반/창업) 메타 — 갈래별 라우트가 공유 화면 셸에 넘기는 값.
// 1단계 선택 이후 라우트가 /general/ 과 /startup/ 으로 나뉘므로 URL 이 곧 모형이다.

type BatchEvaluationModel = 'general' | 'startup'

const BATCH_MODEL_META = {
    general: {
        title: '혁신성장지수 평가 (일반) Tech-Index',
        base: '/org/batch-evaluation/evaluation-history-or-batch/general',
    },
    startup: {
        title: '혁신성장지수 평가 (창업) Tech-Index',
        base: '/org/batch-evaluation/evaluation-history-or-batch/startup',
    },
} as const satisfies Record<BatchEvaluationModel, {title: string; base: string}>

// 앞 화면 — 1단계 평가모형·진행할 업무 선택(두 갈래 공통).
const BATCH_SELECTION_PATH = '/org/batch-evaluation/evaluation-history-or-batch'

export {BATCH_MODEL_META, BATCH_SELECTION_PATH}
export type {BatchEvaluationModel}
