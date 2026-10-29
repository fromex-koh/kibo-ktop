// 플랫폼 소개 > 특허평가 화면의 문구 — 시안 "특허평가". 기업 · 기관 화면이 함께 쓴다.

const PLATFORM_PATENT_EVALUATION = {
    title: '특허평가',
    kpas: {
        title: 'KPAS (KIBO PATENT APPRAISAL SYSTEM)',
        summary: [
            'KPAS는 매매를 통한 가치 실현 가능성이 높은 특허를 변별하기 위해 특허 자체의 특성이 반영된 내재적 지표와 특허가 속한 기술환경의 특성이 반영된 외재적 지표를 활용하여 전문가 평가사례를 기반으로 특허를 평가하는 기술보증기금 고유의 특허등급산출 시스템입니다.',
            '특허화된 기술지식(IP: Intellectual Property)은 거래가 가능한 재산의 형태로서, 화폐적 가치를 지니고 있으며(OECD, 2006), 매매(기술거래)가 발생한 특허의 경우 해당 특허를 인수한 기업에 의해 연구개발, 사업화 등의 기업의 경제적 활동에 직접적으로 연관될 가능성이 높습니다.',
            '따라서, KPAS에서 정의한 ‘재산적 가치가 있는 지식재산’은 기술금융 및 IP금융 목적에 부합하도록 『매매를 통한 가치 실현 가능성이 높은 지식재산』으로 정의하고 특허평가를 수행하였습니다.',
        ],
    },
    /** 특허평가 구조도 — 세 관점(icon 은 그림 이름 · 설명은 줄마다 새 줄) → 결론(두 줄). */
    diagram: {
        title: '특허평가',
        aspects: [
            {
                icon: 'patented-knowledge',
                title: '특허화된 기술지식',
                descriptionLines: ['거래가 가능한', '화폐적 가치 보유'],
            },
            {icon: 'patent-trade', title: '특허 매매', descriptionLines: ['기술거래를 통한', '가치실현']},
            {icon: 'economic-use', title: '경제적 활용', descriptionLines: ['연구개발(R&D)', '또는 사업화']},
        ],
        conclusionLines: [
            '매매를 통한 가치 실현 가능성이 높은 지식재산을',
            '재산적 가치가 있는 지식재산으로 정의 및 평가',
        ],
    },
    procedure: {
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
    },
} as const

export {PLATFORM_PATENT_EVALUATION}
