// 기관 Tech-Index 의 모형(일반/창업) 메타 — 갈래별 라우트가 공유 화면 셸에 넘기는 값.
// 기업처럼 라우트가 /general/ 과 /startup/ 으로 나뉘므로 URL 이 곧 모형이다.

type TechIndexModel = 'general' | 'startup'

const TECH_INDEX_MODEL_META = {
    general: {
        title: '혁신성장지수 (일반)',
        completeMessage: '개별평가 - 일반용 Tech-Index가 완료되었습니다.',
        base: '/org/individual-evaluation/tech-index/general',
    },
    startup: {
        title: '혁신성장지수 (창업)',
        completeMessage: '개별평가 - 창업용 Tech-Index가 완료되었습니다.',
        base: '/org/individual-evaluation/tech-index/startup',
    },
} as const satisfies Record<TechIndexModel, {title: string; completeMessage: string; base: string}>

// 앞 화면 — (1) 평가모형 선택(두 갈래 공통).
const TECH_INDEX_SELECTION_PATH = '/org/individual-evaluation/tech-index/selection'

export {TECH_INDEX_MODEL_META, TECH_INDEX_SELECTION_PATH}
export type {TechIndexModel}
