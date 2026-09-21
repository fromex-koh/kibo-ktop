// 평가모형 선택 화면(EvaluationModelSelection)의 문구 · 모형 목록 — 시안 "SB-FOTA-CM5-0001_메인_평가모형 선택"
// (40007595:14880) 그대로다.
//
// 모형 카드의 일러스트(image)가 비어 있으면 같은 크기의 빈 자리로 둔다.

type EvaluationModelTone = 'blue' | 'mint' | 'orange'

type EvaluationModel = {
    id: 'ktrs-fm' | 'tech-index' | 'investment-model'
    /** 모형 약칭(카드 위 작은 글자) — 시안에서 투자모형은 없다. */
    label?: string
    title: string
    description: string
    /** 카드 면 · 약칭 색. */
    tone: EvaluationModelTone
    /** 카드를 눌렀을 때 들어갈 평가 신청 첫 화면(기업 기준 경로의 뒷부분 — 사용처가 /corp · /org 를 붙인다). */
    path: string
    /** 일러스트 경로와 시안의 표시 크기(원본과 비율이 같다). */
    image?: {src: string; width: number; height: number}
}

const EVALUATION_MODEL_SELECTION = {
    title: '평가모형 선택',
    description: '진행할 평가모형을 선택해 주세요.',
} as const

const EVALUATION_MODELS: readonly EvaluationModel[] = [
    {
        id: 'ktrs-fm',
        label: 'KTRS-FM',
        title: '신속표준모형',
        description:
            '기술사업화 역량 및 재무적 안정성을 종합적으로 평가하는 표준 기술금융 모형입니다. 기업의 기술력, 사업성, 경영능력을 정량·정성 지표로 분석합니다.',
        tone: 'blue',
        path: '/technology-evaluation/ktrs-fm/customer-consent',
        image: {src: '/images/option-card/speed-gauge.webp', width: 225, height: 150},
    },
    {
        id: 'tech-index',
        label: 'Tech-Index',
        title: '혁신성장역량지수',
        description:
            '혁신성장기업의 미래 성장 가능성을 측정하는 지수형 평가 모형입니다. 시작하기를 누르면 일반 · 창업 중 평가모형을 선택합니다.',
        tone: 'mint',
        path: '/technology-evaluation/tech-index/selection',
        image: {src: '/images/option-card/rocket-growth.webp', width: 147, height: 142},
    },
    {
        id: 'investment-model',
        title: '투자모형',
        description:
            '투자 적합성 및 사업화 가능성을 중점으로 분석하는 투자 특화 평가 모형입니다. 스타트업 및 초기 기업의 투자 가치를 종합적으로 검토합니다.',
        tone: 'orange',
        path: '/technology-evaluation/investment-model/customer-consent',
        image: {src: '/images/option-card/building-coins.webp', width: 206, height: 188},
    },
]

const EVALUATION_MODEL_NOTICE = {
    title: '알려드려요',
    items: [
        '진행할 평가모형(KTRS-FM · Tech-Index · 투자모형)을 선택한 뒤[시작하기]를 누르면 해당 모형의 평가 신청 절차로 이동합니다.',
        '평가 신청 시 입력하는 기업·기술 정보와 체크리스트는사실에 기반하여 작성해 주셔야 정확한 평가가 가능합니다.',
        '각 평가모형의 자세한 소개는 상단 메뉴 플랫폼 소개 > 기술평가에서 확인하실 수 있습니다.',
    ],
} as const

export {EVALUATION_MODEL_NOTICE, EVALUATION_MODEL_SELECTION, EVALUATION_MODELS}
export type {EvaluationModel, EvaluationModelTone}
