import type {PlatformIntroUserType} from '@/content/service/platform-intro'

// 플랫폼 소개 > 특허평가 화면 원고 — 기업 · 기관 /platform/patent-evaluation 이 함께 쓴다(components/custom/platform-patent-evaluation.tsx).
// 문구를 고칠 때는 이 파일만 바꾼다. 화면 구성(위 → 아래):
//   화면 제목 → 히어로(글 | 특허 평가등급 카드) → 섹션 이동 탭 → 핵심 가치(카드 3 + KPAS 공식 소개 전문 펼치기)
//   → 평가 원리(흐름 도식 + 재산적 가치 정의) → 평가 결과(보고서 미리보기 + 확인 정보 + 주요평가요인 + 조회 안내)
//   → 평가절차(4단계) → 마무리 배너.
// 강조 낱말은 {text, isBold} 조각 배열로 둔다(화면이 <b> 로 그린다).

type RichText = readonly {text: string; isBold?: boolean}[]

const PLATFORM_PATENT_TITLE = '특허평가'

const PLATFORM_PATENT_HERO = {
    eyebrow: 'KPAS (KIBO PATENT APPRAISAL SYSTEM)',
    title: '특허의 가치 실현 가능성을 확인하는',
    titleEmphasis: 'KPAS',
    lead: 'KPAS는 매매를 통해 경제적 가치를 실현할 가능성이 높은 특허를 선별하는 기술보증기금 고유의 특허등급 산출 시스템입니다. 전문가 평가사례를 기반으로, 특허 자체의 특성과 해당 특허가 속한 기술환경을 반영한 지표를 활용하여 특허를 평가합니다.',
    principleActionLabel: 'KPAS 알아보기',
    startActionLabel: '특허평가 이용하기',
    loginNote: '로그인 후 이용할 수 있습니다.',
    /** 오른쪽 특허 평가등급 카드(PC 1024↑). */
    gradeCard: {
        title: '특허 평가등급',
        grades: [
            {label: '기술다양성', grade: 'BB'},
            {label: '시장확장성', grade: 'BBB'},
            {label: '가치창출가능성', grade: 'A'},
        ],
        label: 'KPAS 특허 평가등급 그래픽: 기술다양성 BB, 시장확장성 BBB, 가치창출가능성 A와 방사형 차트',
    },
} as const

// 섹션 이동 탭 — id 는 각 section 의 id 와 같다.
const PLATFORM_PATENT_SECTIONS = [
    {id: 'value', label: '핵심 가치'},
    {id: 'principle', label: '평가 원리'},
    {id: 'result', label: '평가 결과'},
    {id: 'process', label: '이용 절차'},
] as const

const PLATFORM_PATENT_VALUE = {
    title: '특허의 다양한 특성을 분석하여 평가합니다',
    items: [
        {
            id: 'intrinsic',
            title: '특허 특성 분석',
            description: [
                {text: '특허 자체의 특성이 반영된 '},
                {text: '내재적 지표', isBold: true},
                {text: '를 활용하여 특허를 분석합니다.'},
            ],
        },
        {
            id: 'environment',
            title: '기술환경 분석',
            description: [
                {text: '특허가 속한 기술환경의 특성이 반영된 '},
                {text: '외재적 지표', isBold: true},
                {text: '를 함께 활용합니다.'},
            ],
        },
        {
            id: 'grade',
            title: '평가등급 산출',
            description: [
                {text: '전문가 평가사례', isBold: true},
                {text: '를 기반으로 매매를 통한 가치 실현 가능성이 높은 특허를 변별하여 등급으로 제공합니다.'},
            ],
        },
    ],
    /** 카드 아래 펼치기 — KPAS 공식 소개 전문. */
    fullText: {
        title: 'KPAS 공식 소개 전문 보기',
        items: [
            'KPAS는 매매를 통한 가치 실현 가능성이 높은 특허를 변별하기 위해 특허 자체의 특성이 반영된 내재적 지표와 특허가 속한 기술환경의 특성이 반영된 외재적 지표를 활용하여 전문가 평가사례를 기반으로 특허를 평가하는 기술보증기금 고유의 특허등급산출 시스템입니다.',
            '특허화된 기술지식(IP: Intellectual Property)은 거래가 가능한 재산의 형태로서, 화폐적 가치를 지니고 있으며(OECD, 2006), 매매(기술거래)가 발생한 특허의 경우 해당 특허를 인수한 기업에 의해 연구개발, 사업화 등의 기업의 경제적 활동에 직접적으로 연관될 가능성이 높습니다.',
            '따라서, KPAS에서 정의한 ‘재산적 가치가 있는 지식재산’은 기술금융 및 IP금융 목적에 부합하도록 『매매를 통한 가치 실현 가능성이 높은 지식재산』으로 정의하고 특허평가를 수행하였습니다.',
        ],
    },
} as const

const PLATFORM_PATENT_PRINCIPLE = {
    title: 'KPAS는 어떤 정보를 활용해 평가하나요?',
    flowLabel: 'KPAS 평가 개념도',
    columns: [
        {
            id: 'source',
            title: '활용 정보',
            items: [
                {id: 'intrinsic', title: '내재적 지표', description: '특허 자체의 특성'},
                {id: 'extrinsic', title: '외재적 지표', description: '특허가 속한 기술환경의 특성'},
            ],
        },
        {
            id: 'basis',
            title: '분석 기준',
            items: [
                {
                    id: 'expert',
                    title: '전문가 평가사례 기반 분석',
                    description: '기술보증기금 고유의 특허등급산출 시스템',
                },
            ],
        },
    ],
    result: {title: '특허평가등급', description: '매매를 통한 가치 실현 가능성이 높은 지식재산 여부를 등급으로 제공'},
    note: '이 도식은 KPAS의 평가 개념을 설명하기 위한 것으로, 공식 산출식이나 실제 알고리즘의 계산 순서를 나타내지 않습니다.',
    definition: {
        title: 'KPAS가 정의한 ‘재산적 가치가 있는 지식재산’',
        items: [
            {id: 'patented-knowledge', title: '특허화된 기술지식', description: '거래가 가능한 화폐적 가치 보유'},
            {id: 'patent-trade', title: '특허 매매', description: '기술거래를 통한 가치실현'},
            {id: 'economic-use', title: '경제적 활용', description: '연구개발(R&D) 또는 사업화'},
        ],
        conclusion: [
            {text: '매매를 통한 가치 실현 가능성이 높은 지식재산을 '},
            {text: '재산적 가치가 있는 지식재산', isBold: true},
            {text: '으로 정의 및 평가'},
        ] satisfies RichText,
    },
} as const

const PLATFORM_PATENT_RESULT = {
    title: '특허평가 결과를 확인할 수 있습니다',
    report: {
        label: '특허평가 결과 보고서',
        /** 대체 텍스트 — 짧게(WAVE Long alternative text). 쪽마다의 내용은 description(낭독기 전용 설명). */
        alt: 'KPAS 특허평가 결과 보고서 화면 예시(5쪽) — 번호·날짜는 예시 데이터입니다.',
        description:
            '1쪽 특허개요 · 특허 평가등급(기술다양성 · 시장확장성 · 가치창출가능성) · 동일 특허분야 평균 · 주의사항, 2~4쪽 평가항목별 영향요인 비교와 평가대상 특허분석, 5쪽 특허평가 참고자료(KPAS · 특허평가프로세스 · 주요 영향요인).',
        sampleBadge: '샘플 화면',
        scrollCaption: '스크롤하여 전체 보기',
    },
    itemsTitle: '조회 결과로 확인하는 정보',
    items: [
        {title: '특허 기본정보', description: '등록·출원번호, 발명의 명칭, 출원인·등록권리자, IPC코드 등'},
        {title: '특허평가등급', description: 'AAA~C 9개 등급 중 해당 등급과 등급별 분포'},
        {title: '결과보고서', description: '기술다양성·시장확장성·가치창출가능성 평가 및 참고자료 포함'},
        {title: '보고서 출력', description: '조회된 결과 보고서 인쇄·출력'},
    ],
    keyFactors: {
        title: '주요평가요인',
        items: ['기술다양성', '시장확장성', '가치창출가능성'],
        note: '항목별 세부 평가요인은 현업 확인 후 반영 예정',
    },
    notices: [
        [{text: '특허번호 조회는 '}, {text: '로그인 후', isBold: true}, {text: ' 이용할 수 있습니다.'}],
        [{text: '검색 대상: 2026-04-01 이전 등록 및 공고된 특허정보 (출원상태인 특허는 평가 제외)'}],
        [{text: '13자리 또는 7자리 등록·출원번호를 입력합니다.'}],
    ] satisfies readonly RichText[],
} as const

const PLATFORM_PATENT_PROCESS = {
    title: '평가절차 안내',
    steps: [
        {
            title: '등급평가검색',
            description: '특허출원번호 또는 특허등록번호를 입력 후 찾고자 하는 특허결과를 검색합니다.',
        },
        {title: '결과확인', description: '조회한 특허등급의 기본정보를 확인합니다.'},
        {title: '결과보고서', description: '조회된 특허등급의 상세한 결과 보고서를 확인합니다.'},
        {title: '출력', description: '조회된 결과 보고서를 출력합니다.'},
    ],
} as const

const PLATFORM_PATENT_CTA = {
    title: '특허평가 서비스를 이용해 보세요',
    description: '특허번호 입력으로 KPAS 특허평가등급을 확인할 수 있습니다. (로그인 필요)',
    actionLabel: '특허평가 이용하기',
} as const

// 이동 주소 — 특허평가 등급 조회.
const PLATFORM_PATENT_ROUTES: Record<PlatformIntroUserType, string> = {
    corp: '/corp/patent-evaluation/patent-grade-list',
    org: '/org/patent-evaluation/patent-grade-list',
}

export {
    PLATFORM_PATENT_CTA,
    PLATFORM_PATENT_HERO,
    PLATFORM_PATENT_PRINCIPLE,
    PLATFORM_PATENT_PROCESS,
    PLATFORM_PATENT_RESULT,
    PLATFORM_PATENT_ROUTES,
    PLATFORM_PATENT_SECTIONS,
    PLATFORM_PATENT_TITLE,
    PLATFORM_PATENT_VALUE,
}
export type {RichText}
