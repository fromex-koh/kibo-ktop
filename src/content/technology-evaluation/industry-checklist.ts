import type {ChecklistData} from '@/components/composite/checklist-form'

// 업종코드로 갈리는 3단계 체크리스트의 목업 데이터 — 문항·보기·안내 문구가 모두 여기 있다.
// 투자모형과 KTRS-FM 이 같은 문항을 쓴다(두 모형의 3단계 화면이 같은 체크리스트다).
// 연동하면 이 상수를 API 응답으로 바꾸기만 하면 된다(화면은 이 모양 그대로 컴포넌트에 내려 준다).
//
// 문항 글은 Figma "투자모형_3단계_체크리스트 입력 (제조 선택시)" 와 "(서비스 선택시)" 를 그대로 옮겼다.
// 업종코드에 따라 제조용·서비스용 두 벌이 있는데, 두 시안이 다른 곳은 [자체생산] 갈래 다섯 문항뿐이라
// 나머지(공통 문항·외주생산 갈래)는 아래에서 한 벌만 두고 두 데이터가 함께 쓴다.
//
// 가운데 문항은 생산 방식(자체생산·외주생산)에 따라 갈리고, 그 앞뒤 문항은 두 갈래가 함께 쓴다.
//
// [원문 유지] 24번 "추친현황" 은 시안의 표기를 그대로 옮긴 것이다 — 고쳐야 할 오타로 보이면
// 시안과 함께 정정한다(화면에서 임의로 바꾸면 시안 대조가 어긋난다).

// 생산 방식 — 이 값에 따라 가운데 다섯 문항이 갈린다.
const IN_HOUSE = 'in-house'
const OUTSOURCED = 'outsourced'

// 두 갈래에 같은 문안이 각각 들어가는 문항 — 값 이름만 갈래별로 다르게 둔다.
const RAW_MATERIAL_TEXT = '거시경제요인, 국가간 분쟁, 기후환경 등에 의해 수급에 크게 영향을 받는 원자재가 없다.'
const AS_CHANNEL_TEXT = 'A/S 접수 채널이 있으며, 표준화된 A/S 처리 절차(프로세스)를 문서화하여 보유하고 있다.'

// 투자 유치 실적 문항에 딸린 칩 — 체크했을 때만 아래에 나온다(시안 주석: "초기 화면에서 하단 chip 비노출").
const INVESTMENT_AMOUNT_CHIPS = [
    {value: 'over-3b', label: '30억 이상'},
    {value: 'under-3b', label: '30억 미만'},
    {value: 'none', label: '해당없음'},
]

// 분기 앞 공통 문항 — 두 업종 갈래가 같다.
const LEAD_ITEMS: ChecklistData['lead'] = [
    {
        id: 'expert-license',
        type: 'check',
        name: 'q1',
        text: '경영진 중 회사계사, 변호사, 변리사 등 전문자격증을 보유한 자가 있다.',
    },
    {
        id: 'kpi',
        type: 'check',
        name: 'q2',
        text: 'KPI 등 성과목표가 문서화되어 관리되고 있으며, 성과평가 결과가 급여, 성과급에 연계되고 있다.',
    },
    {
        id: 'equity-reward',
        type: 'check',
        name: 'q3',
        text: '우리사주제도, 스톡옵션 등 지분형 보상 제도가 갖추어져 있고 보상 지급 실적이 있다.',
    },
    {
        id: 'no-key-resign',
        type: 'check',
        name: 'q4',
        text: '최근 1년이내 기술(디자인)담당 임원, 핵심기술인력의 퇴직사실이 없다.',
    },
    {
        id: 'unexpected-effect',
        type: 'check',
        name: 'q5',
        text: '평가대상기술은 업계에서 쉽게 떠올리기 어려운 원리가 적용되어 예상 밖의 효과를 내는 기술이다.',
    },
    {
        id: 'commercialized',
        type: 'check',
        name: 'q6',
        text: '평가대상기술은 상용화되어 매출이 발생하고 있는 기술이거나, 시제품에 대한 품질인증 또는 시험성적서를 보유하고 있는 기술이다.',
    },
    {
        id: 'government-rnd',
        type: 'check',
        name: 'q7',
        text: '평가대상기술은 정부 R&D과제를 수행한(중인) 기술이다.',
    },
    {
        id: 'expandable',
        type: 'check',
        name: 'q8',
        text: '평가대상기술은 타 분야의 제품/서비스/산업에 적용될 수 있는 기술이거나, 글로벌 시장으로의 수출 등 확장성이 구체적으로 존재한다.',
    },
    {
        id: 'competitive-tech',
        type: 'check',
        name: 'q9',
        text: '평가대상기술은 경쟁기술 대비 성능, 기능적(디자인) 우위, 품질 안정성 등을 바탕으로 명확한 기술경쟁력을 확보할 수 있는 기술이다.',
    },
    {
        id: 'market-leader',
        type: 'check',
        name: 'q10',
        text: '평가대상기술은 ‘시장 지배형 기업’이다.',
    },
]

// 생산 방식 묶음의 안내 — 두 갈래가 같다.
const BRANCH_HEADER = {
    title: '생산 방식을 선택해 주세요.',
    description: '선택에 따라 아래 문항이 분기 노출됩니다',
}

const BRANCH_OPTIONS = [
    {value: IN_HOUSE, label: '자체생산 (자사 인력·설비로 생산 또는 서비스를 제공)'},
    {value: OUTSOURCED, label: '외주생산 (외주업체를 통해 생산)'},
]

// [자체생산] 갈래 — 두 시안이 갈리는 유일한 곳이다(제조는 생산설비, 서비스는 인력·처리용량 기준).
const MANUFACTURING_IN_HOUSE_ITEMS: ChecklistData['common'] = [
    {
        id: 'capacity-plan',
        type: 'check',
        name: 'q11',
        text: '자사의 최대 생산능력에 대한 수치화된 자료와 설비 가동률을 감안한 수요 급증 시 대응 계획(증설, 외주 전환, 인력 충원 등)이 마련되어 있다.',
    },
    {id: 'raw-material-in-house', type: 'check', name: 'q12', text: RAW_MATERIAL_TEXT},
    {
        id: 'certification',
        type: 'check',
        name: 'q13',
        text: 'HACCP, ISO, KC인증, KS인증, Q마크 등 공인규격 또는 품질/기술인증 실적을 보유하고 있다.',
    },
    {id: 'as-channel-in-house', type: 'check', name: 'q14', text: AS_CHANNEL_TEXT},
    {
        id: 'ai-adoption',
        type: 'check',
        name: 'q15',
        text: '생산·관리 과정에 AI 기술을 도입하여 생산성, 품질 등을 개선한 실적이 있다.',
    },
]

// 서비스 시안의 [자체생산] — 같은 자리에 들어가지만 문항이 전부 다르다.
const SERVICE_IN_HOUSE_ITEMS: ChecklistData['common'] = [
    {
        id: 'service-capability',
        type: 'check',
        name: 'q11',
        text: '자체 인력과 인프라로 신규 서비스 개발 및 제공이 가능하다.',
    },
    {id: 'service-as-channel', type: 'check', name: 'q12', text: AS_CHANNEL_TEXT},
    {
        id: 'service-capacity-plan',
        type: 'check',
        name: 'q13',
        text: '서비스 처리용량(월간 최대 처리 건수)을 수치화된 자료로 파악하고 있으며, 수요 급증 시 대응 계획(인력 충원, 시스템증설, 외주전환 등)이 마련되어 있다.',
    },
    {
        id: 'service-certification',
        type: 'check',
        name: 'q14',
        text: 'ISO, GS인증, SP인증, KC인증, KS인증, Q마크 등 공인규격 또는 품질/기술인증 실적을 보유하고 있다.',
    },
    {
        id: 'service-ai-adoption',
        type: 'check',
        name: 'q15',
        text: '서비스 개발 과정에 AI 기술을 도입하여 개발 프로세스, 서비스 품질 등을 개선한 실적이 있다.',
    },
]

// [외주생산] 갈래 — 두 시안이 같다.
const OUTSOURCED_ITEMS: ChecklistData['common'] = [
    {
        id: 'partner-listed',
        type: 'check',
        name: 'q16',
        text: '외주업체가 상장기업이거나 외감기업이다.',
    },
    {id: 'raw-material-outsourced', type: 'check', name: 'q17', text: RAW_MATERIAL_TEXT},
    {
        id: 'production-manager',
        type: 'check',
        name: 'q18',
        text: '생산계획 수립, 원자재 조달, 생산 진행 상황 모니터링 등 생산관리만을 전담하는 조직이나 인력이 있다.',
    },
    {
        id: 'multi-partner',
        type: 'check',
        name: 'q19',
        text: '특정 업체 의존 없이 복수의 외주업체를 통한 생산 방식을 구축하고 있다.',
    },
    {id: 'as-channel-outsourced', type: 'check', name: 'q20', text: AS_CHANNEL_TEXT},
]

// 분기 뒤 공통 문항 — 두 업종 갈래가 같다.
const COMMON_ITEMS: ChecklistData['common'] = [
    {
        id: 'org-structure',
        type: 'check',
        name: 'q21',
        text: '제품(서비스)을 사업화하고 관리할 수 있는 적절한 조직구조(연구개발, 영업관리, 품질관리, 고객관리, 경영지원 등)가 조직도를 통해 확인 가능하다.',
    },
    {
        id: 'dev-plan',
        type: 'check',
        name: 'q22',
        text: '제품(서비스) 개발 단계별 일정 및 소요예산에 대한 문서화된 계획을 수립, 관리하고 있다.',
    },
    {
        id: 'market-research',
        type: 'check',
        name: 'q23',
        text: '시장규모, 경쟁사 제품·가격, 기술트렌드 등의 시장조사를 연 1회 이상 수행하고 있다.',
    },
    {
        id: 'progress-doc',
        type: 'check',
        name: 'q24',
        text: '제품(서비스) 개발 단계별 사업화 추친현황 및 계획을 내부 관리문서를 통해 확인할 수 있다.',
    },
    {
        id: 'external-partnership',
        type: 'check',
        name: 'q25',
        text: '외부 기관 전문가와 협력적 파트너쉽을 구축하여 자문을 받고 이를 사업전략 수립 등에 반영하고 있다.',
    },
    {
        id: 'profit-structure',
        type: 'check',
        name: 'q26',
        text: '수익구조(매출발생원별 구체적 수익모델), 원가구조(고정비/변동비, 매출원가, 판관비 등), 수익 전망이 포함된 분석 자료를 보유하고 있다.',
    },
    {
        id: 'pain-point',
        type: 'check',
        name: 'q27',
        text: '고객의 불편사항(Pain Point)을 명확하게 파악하고 있으며, 이를 해결하기 위한 제품/서비스를 사업화하고 있다.',
    },
    {
        id: 'recurring-revenue',
        type: 'check',
        name: 'q28',
        text: '구독형 서비스 제공, 플랫폼 기반의 반복거래 구조 형성, 네트워크 효과 기반의 고객 이탈 방지 등을 통해 지속적인 매출을 확보할 수 있다.',
    },
    {
        id: 'scalable-margin',
        type: 'check',
        name: 'q29',
        text: '매출 증가에 따른 추가 비용이 거의 없어서 사업이 성장할수록 이익률이 높아지는 구조다.',
    },
    {
        id: 'no-legal-risk',
        type: 'check',
        name: 'q30',
        text: '소송 진행, 특허 분쟁 등의 법적분쟁 리스크가 존재하지 않는다.',
    },
    {
        id: 'no-regulation-risk',
        type: 'check',
        name: 'q31',
        text: '기업의 제품/서비스에 대한 제도적 규제(인허가, 환경규제, 선행 지재권 등) 등으로 인해 시장 진입이 제약되지 않는다.',
    },
    {
        id: 'financial-stability',
        type: 'check',
        name: 'q32',
        text: '영업 현금흐름, 부채비율, 자금조달 계획 등 장단기 지급능력 등을 종합할 때, 단기 유동성 위기나 장기 재무 불안정성의 위험이 낮다.',
    },
    {
        id: 'no-reputation-risk',
        type: 'check',
        name: 'q33',
        text: '부정적 언론보도나 제품 결함, 서비스 지연, 장애 등 제품/서비스 품질로 인해 대중의 신뢰가 하락한 사례가 없다.',
    },
    {
        id: 'low-dilution-risk',
        type: 'check',
        name: 'q34',
        text: '후속 투자 유치로 인해 발생할 수 있는 지분희석의 위험이 낮다.',
    },
    {
        // 체크하면 아래에 투자 규모 칩이 나온다(시안 주석: 초기 화면에서 하단 chip 비노출).
        id: 'institutional-investment',
        type: 'check-chips',
        name: 'q35',
        text: '평가대상기업이 기관투자자로부터 최근 2년 내 투자를 유치한 실적이 있다.',
        chipName: 'q35Amount',
        chipLabel: '투자 유치 규모',
        chips: INVESTMENT_AMOUNT_CHIPS,
    },
    {
        id: 'accelerator',
        type: 'check',
        name: 'q36',
        text: '평가대상기업이 기관투자자 외 엑셀러레이터나 엔젤투자자로부터 자금지원 및 멘토링을 받은 실적이 있다.',
    },
    {
        id: 'founder-exit',
        type: 'check',
        name: 'q37',
        text: '경영주 또는 경영진 중에서 과거 기업을 창업하여 IPO, M&A, 지분매각 등을 통해 자본이득을 실현한 경험을 가진 자가 있다.',
    },
    {
        id: 'policy-fund',
        type: 'check',
        name: 'q38',
        text: '평가대상기업은 최근 1년 이내 정부, 지자체, 공공기관 등의 정책지원금(출연/보조)을 지원받은 실적이 있다.',
    },
    {
        id: 'new-demand',
        type: 'check',
        name: 'q39',
        text: '제품/서비스가 기존 시장에서 충족되지 않았던 니즈를 충족시켜 새로운 수요를 창출할 수 있다.',
    },
    {
        id: 'loi',
        type: 'check',
        name: 'q40',
        text: '거래 상대방의 직인이 날인된 구매의향서(LOI) 또는 확정된 수주계약서를 확보하고 있다.',
    },
    {
        id: 'market-position',
        type: 'check',
        name: 'q41',
        text: '독점기술, 비용우위, 브랜드파워 등에서의 경쟁 우위 기반으로 시장에서 강력한 입지를 구축(유지)할 수 있다.',
    },
    {
        id: 'payback',
        type: 'check',
        name: 'q42',
        text: '향후 1년 이내에 평가대상기업이 사업화에 투입한 비용을 모두 회수할 정도의 수익증가가 예상된다.',
    },
]

// 업종 갈래별 한 벌 — 다른 것은 [자체생산] 문항뿐이다.
const buildChecklist = (inHouseItems: ChecklistData['common']): ChecklistData => ({
    lead: LEAD_ITEMS,
    branch: {
        header: BRANCH_HEADER,
        name: 'productionType',
        label: '생산 방식',
        defaultValue: IN_HOUSE,
        options: BRANCH_OPTIONS,
        requiredMessage: '생산 방식을 선택해 주세요.',
        items: {
            [IN_HOUSE]: inHouseItems,
            [OUTSOURCED]: OUTSOURCED_ITEMS,
        },
    },
    common: COMMON_ITEMS,
})

const MANUFACTURING_CHECKLIST = buildChecklist(MANUFACTURING_IN_HOUSE_ITEMS)
const SERVICE_CHECKLIST = buildChecklist(SERVICE_IN_HOUSE_ITEMS)

export {MANUFACTURING_CHECKLIST, SERVICE_CHECKLIST}
