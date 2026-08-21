import type {ChecklistData, ChecklistOption} from '@/components/composite/checklist-form'

// 신속표준모형 3단계 체크리스트의 목업 데이터 — 문항·보기·안내 문구가 모두 여기 있다.
// 연동하면 이 상수를 API 응답으로 바꾸기만 하면 된다(화면은 이 모양 그대로 컴포넌트에 내려 준다).
//
// 가운데 문항은 기술 구분(전문기술·숙련기술)에 따라 갈리고, 수익창출역량(택1) 보기도 갈래별로 다르다.
// 문항 글은 Figma "[신속표준모형 KTRS-FM] 3단계_체크리스트 입력" 과 현행 서비스 마크업을 따른다.

const TRL_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((level) => ({
    value: level,
    label: `${level}단계`,
    token: level,
}))

// 기술 수명주기 — 현행 서비스 select(기술 수명주기 단계)의 값과 문구를 그대로 쓴다.
const TECHNOLOGY_LIFECYCLE_OPTIONS = [
    {value: 'intro', label: '도입기'},
    {value: 'early', label: '성장초기'},
    {value: 'growth', label: '성장기'},
    {value: 'mature', label: '성숙기'},
    {value: 'decline', label: '쇠퇴기'},
]

// 수익창출역량(택1) — 현행 서비스 select 의 보기. 숙련기술은 ②③⑤만 노출된다.
const REVENUE_OPTION = {
    competitive:
        '① 신청기술은 경쟁사가 기술적 차별화 또는 기술격차로 인해 안정적인 거래처를 확보할 수 있고 영업적 리스크가 낮다.',
    steady: '② 신청기술에 의한 제품(서비스)은 유사 제품(서비스)과의 경쟁이 요구되나, 시장의 수요가 꾸준히 발생하여 일정 수준의 수요 창출이 가능하다.',
    marketing:
        '③ 신청기술에 의한 제품(서비스)은 경쟁사간 기술적 차별성이 유사한 편으로 영업 기반 위한 마케팅이 상당히 중요한 사업분야이다.',
    unproven: '④ 신청기술에 의한 제품(서비스)은 아직 시장에서 검증받지 못한 분야로 새로운 시장 형성할 수 있다.',
    none: '⑤ 해당 없음',
}

// 업종코드로 갈리는 두 문항 — 시안이 제조용·서비스용으로 문장과 값 이름만 다르다.
// 화면에는 2단계에서 고른 업종의 줄만 남는다(예전처럼 두 줄을 함께 두고 배지로 구분하지 않는다).
const MANUFACTURING = 'manufacturing'
const SERVICE = 'service'

type IndustrySector = typeof MANUFACTURING | typeof SERVICE

// 생산·제작 과정 — 문장 안에 칩 두 개를 끼워 고른다.
const PRODUCTION_PROCESS_ROWS: Record<
    IndustrySector,
    {name: string; before: string; between: string; after: string; chips: ChecklistOption[]}
> = {
    [MANUFACTURING]: {
        name: 'q17-manufacturing',
        before: '신청기술이 적용된 제품 생산 시, 생산과정이',
        between: '또는',
        after: '을 통해 이루어진다.',
        chips: [
            {value: 'outsourced', label: '외주가공'},
            {value: 'inhouse', label: '자체제작'},
        ],
    },
    [SERVICE]: {
        name: 'q17-service',
        before: '신청기술이 적용된 제품/서비스 제작 시, 제작과정이',
        between: '또는',
        after: '을 통해 이루어진다.',
        chips: [
            {value: 'outsourced', label: '외주인력'},
            {value: 'inhouse', label: '자체인력'},
        ],
    },
}

// 원자재 수급 — 체크 한 줄.
const MATERIAL_SUPPLY_OPTIONS: Record<IndustrySector, {name: string; text: string}> = {
    [MANUFACTURING]: {
        name: 'q18-manufacturing',
        text: '원자재에 석유·화학 원료(가격 변동성), 금속/광물 원자재(희토류 포함 중금속 등), 농산물(기후조건 등에 의한 생산량 변동) 등 수급에 크게 영향을 받는 비품/품목이 있다.',
    },
    [SERVICE]: {
        name: 'q18-service',
        text: '원자재에 미디어 콘텐츠, 소프트웨어 제품, IT서비스 등 가격·수량 측면에서 수급에 크게 영향을 받는 비품/품목이 있다.',
    },
}

const buildChecklist = (sector: IndustrySector): ChecklistData => ({
    lead: [
        {
            id: 'patent',
            type: 'check',
            name: 'q1',
            text: '경영주는 출원인 또는 발명자로 등록한 특허/실용신안이 있다. (KIPRIS에서 확인 가능한 경우만 해당함)',
        },
        {
            id: 'expert-license',
            type: 'check',
            name: 'q2',
            text: '경영주는 최근 5년 이내 전문기술인력(박사/기능장/기술사) 자격을 취득하였다.',
        },
        {
            id: 'founding-career',
            type: 'check-list',
            options: [
                {
                    name: 'q3-1',
                    text: '(1) 경영주는 과거 사업자 대표자로 창업한 경력 또는 업력 1년 미만 창업기업의 임직원으로 근무한 경력이 있고,',
                    guide: 'restricted-industries',
                },
                {name: 'q3-2', text: '(2) 해당 경력 중 매출을 시현한 경험이 있다.'},
            ],
        },
        {
            id: 'management',
            type: 'check',
            name: 'q4',
            text: '동사는 기술개발, 마케팅, 재무 영역을 전문적으로 담당하는 경영진을 한 명 이상 보유하고 있다.',
        },
        {
            id: 'investment',
            type: 'check',
            name: 'q5',
            text: '경영주는 기관 투자를 유치한 실적이 있다. (엔젤투자 포함)',
        },
        {
            id: 'improvement',
            type: 'check',
            name: 'q6',
            text: '신제품(서비스)이 아니더라도 기술개발을 통해 명확한 기존 제품(서비스)의 새로운 기능 추가 또는 성능 향상 실적이 있다.',
        },
        {
            id: 'citation',
            type: 'check',
            name: 'q7',
            text: '보유 특허 중 피인용 횟수가 2회 이상인 특허가 존재한다.',
            guide: 'citation-manual',
        },
    ],
    branch: {
        header: {
            title: '신청기술의 기술 구분을 선택해 주세요.',
            description: '선택에 따라 아래 기술의 차별성 문항이 분기 노출됩니다',
        },
        name: 'technologyCategory',
        label: '신청기술 기술 구분',
        defaultValue: 'expert',
        options: [
            {value: 'expert', label: '전문기술 (R&D·지식재산권·기술성숙도(TRL) 기반)'},
            {value: 'skilled', label: '숙련기술 (생산·품질 등 숙련 노하우 기반)'},
        ],
        requiredMessage: '신청기술의 기술 구분을 선택해 주세요.',
        items: {
            expert: [
                {
                    id: 'trl',
                    type: 'sentence-select',
                    name: 'trl',
                    label: '기술성숙도(TRL) 단계',
                    before: '신청기술의 기술성숙도(TRL)는',
                    after: '단계에 해당한다',
                    options: TRL_OPTIONS,
                    guide: 'trl',
                    requiredMessage: '기술성숙도(TRL) 단계를 선택해 주세요.',
                },
                {
                    id: 'ip-or-rnd',
                    type: 'check-list',
                    options: [
                        {name: 'q9-1', text: '(1) 신청기술은 동사가 지식재산권을 등록한 기술'},
                        {name: 'q9-2', text: '(2) 또는 정부 R&D 과제를 수행한(중인) 기술에 해당한다.'},
                    ],
                },
                {
                    id: 'differentiation',
                    type: 'check',
                    name: 'q10',
                    text: '신청기술은 기존 제품(서비스) 대비 더 나은 기능/성능/사양 등을 구현할 수 있는 기술이거나, 시장수요에 적합한 디자인/비용 효율성/서비스 경쟁력을 갖춘 기술로, 명확하게 제시 가능한 기술의 차별성이 존재한다.',
                },
                {
                    id: 'technology-lifecycle',
                    type: 'sentence-select',
                    name: 'technologyLifecycle',
                    label: '기술 수명주기 단계',
                    before: '신청기술은',
                    after: '기술이다.',
                    options: TECHNOLOGY_LIFECYCLE_OPTIONS,
                    requiredMessage: '기술 수명주기 단계를 선택해 주세요.',
                },
            ],
            skilled: [
                {
                    id: 'skilled-knowhow',
                    type: 'check',
                    name: 'q8-skilled',
                    text: '신청기술은 경영, 영업 등의 노하우와 확실히 구분되는 생산, 품질 등에 관한 기술적 노하우를 가지고 있다.',
                },
                {
                    id: 'skilled-differentiation',
                    type: 'check',
                    name: 'q9-skilled',
                    text: '신청기술은 숙련기술을 바탕으로 기존/경쟁 제품(서비스) 대비 차별화된 기능, 성능, 사양, 디자인 등을 구현할 수 있다.',
                },
                {
                    id: 'skilled-imitation',
                    type: 'check',
                    name: 'q10-skilled',
                    text: '신청기술은 공개시 쉽게 모방 가능하다.',
                },
                {
                    id: 'skilled-award',
                    type: 'check',
                    name: 'q11-skilled',
                    text: '동사 경영주 또는 기술인력 중 ‘전국 또는 지방 기능경기대회’/‘국제기능올림픽대회’에서 입상한 경험이 있다.',
                },
            ],
        },
    },
    common: [
        {
            id: 'scalability',
            type: 'check',
            name: 'q12',
            text: '신청기술은 확장성이 구체적으로 존재한다.',
            mark: {before: '신청기술은 확장성', after: '이 구체적으로 존재한다.'},
            note: '‘타 분야의 제품/서비스/산업에 적용’ 또는 ‘글로벌 시장으로의 확장(수출)’',
        },
        {
            id: 'cash-report',
            type: 'check',
            name: 'q13',
            text: '동사의 매출·매입채권 및 현금수지를 한눈에 파악할 수 있는 자금일보를 체계적으로 관리하고 있다.',
        },
        {
            id: 'own-site',
            type: 'check',
            name: 'q14',
            text: '동사는 자가사업장 또는 동사 소유의 등록된 특허권(KPAS1 평가등급 BB등급 이상)을 보유하고 있다.',
        },
        {
            id: 'policy-fund',
            type: 'check',
            name: 'q15',
            text: '동사는 최근 1년 이내 정부, 지자체, 공공기관 등의 정책자금(출연/보조/융자/보증)을 지원받은 실적이 있다.',
        },
        {
            id: 'crowd-funding',
            type: 'check',
            name: 'q16',
            text: '동사는 크라우드 펀딩 또는 기관 투자를 유치한 실적이 있다. (엔젤투자 제외)',
        },
        {
            id: 'production-process',
            type: 'chip-rows',
            rows: [PRODUCTION_PROCESS_ROWS[sector]],
        },
        {
            id: 'material-supply',
            type: 'check-list',
            options: [MATERIAL_SUPPLY_OPTIONS[sector]],
        },
        {
            id: 'quality-manual',
            type: 'check',
            name: 'q19',
            text: '품질관리 매뉴얼이 기록·관리 되어오고 있으며, 매뉴얼의 제시가 가능하다.',
        },
        {
            id: 'after-service',
            type: 'check',
            name: 'q20',
            text: 'A/S 등 제품 판매 후 관리 시스템이 구축되어 있고, 고객과의 사후관리 사례 제시가 가능하다.',
        },
        {
            id: 'certification',
            type: 'check',
            name: 'q21',
            text: 'HACCP, ISO, KC 인증 등 공인규격 또는 품질/기술인증 실적을 보유하고 있다.',
        },
        {
            id: 'distribution',
            type: 'check',
            name: 'q22',
            text: '온라인과 오프라인 분야 모두 자체 유통 채널을 보유하고 있다.',
        },
        {
            id: 'revenue-capability',
            type: 'select',
            header: {
                title: '아래 중 동사에 해당하는 항목을 선택해 주세요. (택1)',
                description: '기술구분(전문/숙련)·[10]·[11] 응답에 따라 위 보기가 자동으로 달라집니다.',
            },
            name: 'revenueCapability',
            label: '수익창출역량 선택',
            placeholder: '선택해 주세요',
            optionsByBranch: {
                expert: [
                    {value: '1', label: REVENUE_OPTION.competitive},
                    {value: '2', label: REVENUE_OPTION.steady},
                    {value: '3', label: REVENUE_OPTION.marketing},
                    {value: '4', label: REVENUE_OPTION.unproven},
                    {value: '5', label: REVENUE_OPTION.none},
                ],
                skilled: [
                    {value: '2', label: REVENUE_OPTION.steady},
                    {value: '3', label: REVENUE_OPTION.marketing},
                    {value: '5', label: REVENUE_OPTION.none},
                ],
            },
            requiredMessage: '해당하는 항목을 선택해 주세요.',
        },
        {
            id: 'business-model',
            type: 'check',
            name: 'q24',
            text: '신청기술의 사업화 모델은 매출시현을 위한 초기 자본적 투자(인력, 설비 등)가 동사의 자금조달능력으로 가능하고, 매출증가에 따른 추가 투자가 적은 편이다.',
        },
        {
            id: 'cost-saving',
            type: 'check',
            name: 'q25',
            text: '재료비, 노무비, 제조경비, 판매 및 일반관리비 등 판매단가 절감 방법(기술전략, 비용관리, 파트너쉽 체결, 디지털 적용 등)을 보유하고 있으며, 객관적인 자료의 제시가 가능하다.',
        },
        {
            id: 'repeat-sales',
            type: 'check',
            name: 'q26',
            text: '전년도 및 평가기준일이 속한 연도에 걸쳐 2년 연속 매출을 시현하고 있는 매출처가 있다.',
        },
    ],
})

const KTRS_FM_MANUFACTURING_CHECKLIST = buildChecklist(MANUFACTURING)
const KTRS_FM_SERVICE_CHECKLIST = buildChecklist(SERVICE)

export {KTRS_FM_MANUFACTURING_CHECKLIST, KTRS_FM_SERVICE_CHECKLIST}
