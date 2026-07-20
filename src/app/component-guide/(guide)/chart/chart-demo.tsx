'use client'

import {useState} from 'react'
import {CompanyRelationshipGraph, type CompanySector} from '@/components/custom/company-relationship-graph'
import {NetworkGraph, type NetworkLink, type NetworkNode} from '@/components/custom/network-graph'
import {WordCloud, type WordCloudItem} from '@/components/custom/word-cloud'
import {Button} from '@/components/ui/button'

const COMPANY_SECTORS: CompanySector[] = [
    {
        id: 'construction',
        label: '건설',
        icon: 'construction',
        companies: [
            {
                id: 'korea-construction',
                label: '한국건설',
                businessNumber: '444-44-44444',
                relationCode: '24',
                relationLabel: '임원-임원',
                status: 'normal',
            },
            {
                id: 'korea-corporation',
                label: '한국공사',
                businessNumber: '222-22-22222',
                relationCode: '10',
                relationLabel: '법인주주',
                status: 'good',
            },
            {
                id: 'korea-development',
                label: '한국개발',
                businessNumber: '401-01-01010',
                relationCode: '20',
                relationLabel: '대표-대표',
                status: 'attention',
            },
            {
                id: 'korea-engineering',
                label: '한국엔지니어링',
                businessNumber: '402-02-02020',
                relationCode: '31',
                relationLabel: '동일주소(타업종)',
                status: 'normal',
            },
            {
                id: 'korea-infrastructure',
                label: '한국인프라건설',
                businessNumber: '403-03-03030',
                relationCode: '30',
                relationLabel: '동일주소(동업종)',
                status: 'good',
            },
        ],
    },
    {
        id: 'food',
        label: '숙식/음식',
        icon: 'food',
        companies: [
            {
                id: 'korea-industry',
                label: '한국실업',
                businessNumber: '111-11-11111',
                relationCode: '11',
                relationLabel: '법인특수관계',
                status: 'normal',
            },
            {
                id: 'korea-food-service',
                label: '한국푸드서비스',
                businessNumber: '411-01-01010',
                relationCode: '10',
                relationLabel: '법인주주',
                status: 'good',
            },
            {
                id: 'korea-hotel',
                label: '한국호텔',
                businessNumber: '412-02-02020',
                relationCode: '24',
                relationLabel: '임원-임원',
                status: 'attention',
            },
            {
                id: 'korea-dining',
                label: '한국외식산업',
                businessNumber: '413-03-03030',
                relationCode: '21',
                relationLabel: '대표-임원',
                status: 'alert',
            },
        ],
    },
    {
        id: 'education',
        label: '교육서비스',
        icon: 'education',
        companies: [
            {
                id: 'korea-business',
                label: '한국산업',
                businessNumber: '777-77-77777',
                relationCode: '31',
                relationLabel: '동일주소(타업종)',
                status: 'good',
            },
            {
                id: 'korea-education',
                label: '한국교육원',
                businessNumber: '421-01-01010',
                relationCode: '11',
                relationLabel: '법인특수관계',
                status: 'normal',
            },
            {
                id: 'korea-academy',
                label: '한국인재개발원',
                businessNumber: '422-02-02020',
                relationCode: '20',
                relationLabel: '대표-대표',
                status: 'attention',
            },
            {
                id: 'korea-learning',
                label: '한국평생교육서비스',
                businessNumber: '423-03-03030',
                relationCode: '40',
                relationLabel: '동일거주지',
                status: 'good',
            },
        ],
    },
    {
        id: 'manufacturing',
        label: '제조',
        icon: 'manufacturing',
        companies: [
            {
                id: 'korea-electric',
                label: '한국전기',
                businessNumber: '555-55-55555',
                relationCode: '11',
                relationLabel: '법인특수관계',
                status: 'normal',
            },
            {
                id: 'korea-electronics',
                label: '한국전력설비기술서비스주식회사',
                businessNumber: '888-88-88888',
                relationCode: '11',
                relationLabel: '법인특수관계',
                status: 'normal',
            },
            {
                id: 'korea-machinery',
                label: '한국기계',
                businessNumber: '201-01-01010',
                relationCode: '10',
                relationLabel: '법인주주',
                status: 'good',
            },
            {
                id: 'korea-materials',
                label: '한국소재',
                businessNumber: '202-02-02020',
                relationCode: '20',
                relationLabel: '대표-대표',
                status: 'attention',
            },
            {
                id: 'korea-parts',
                label: '한국부품',
                businessNumber: '203-03-03030',
                relationCode: '21',
                relationLabel: '대표-임원',
                status: 'alert',
            },
            {
                id: 'korea-precision',
                label: '한국정밀',
                businessNumber: '204-04-04040',
                relationCode: '23',
                relationLabel: '임원-대표',
                status: 'danger',
            },
            {
                id: 'korea-automation',
                label: '한국자동화',
                businessNumber: '205-05-05050',
                relationCode: '24',
                relationLabel: '임원-임원',
                status: 'high-risk',
            },
            {
                id: 'korea-factory',
                label: '한국팩토리',
                businessNumber: '206-06-06060',
                relationCode: '30',
                relationLabel: '동일주소(동업종)',
                status: 'poor',
            },
            {
                id: 'korea-production',
                label: '한국생산기술',
                businessNumber: '207-07-07070',
                relationCode: '31',
                relationLabel: '동일주소(타업종)',
                status: 'closed',
            },
        ],
    },
    {
        id: 'management',
        label: '관리/서비스',
        icon: 'management',
        companies: [
            {
                id: 'korea-paper',
                label: '한국제지',
                businessNumber: '901-01-01010',
                relationCode: '40',
                relationLabel: '동일거주지',
                status: 'normal',
            },
            {
                id: 'korea-management',
                label: '한국경영서비스',
                businessNumber: '431-01-01010',
                relationCode: '20',
                relationLabel: '대표-대표',
                status: 'good',
            },
            {
                id: 'korea-support',
                label: '한국기업지원',
                businessNumber: '432-02-02020',
                relationCode: '11',
                relationLabel: '법인특수관계',
                status: 'attention',
            },
            {
                id: 'korea-facility',
                label: '한국시설관리',
                businessNumber: '433-03-03030',
                relationCode: '30',
                relationLabel: '동일주소(동업종)',
                status: 'poor',
            },
        ],
    },
    {
        id: 'finance',
        label: '금융/보험',
        icon: 'finance',
        companies: [
            {
                id: 'korea-environment',
                label: '한국환경',
                businessNumber: '102-02-02020',
                relationCode: '30',
                relationLabel: '동일주소(동업종)',
                status: 'high-risk',
            },
            {
                id: 'korea-finance',
                label: '한국금융',
                businessNumber: '441-01-01010',
                relationCode: '10',
                relationLabel: '법인주주',
                status: 'normal',
            },
            {
                id: 'korea-insurance',
                label: '한국보험서비스',
                businessNumber: '442-02-02020',
                relationCode: '21',
                relationLabel: '대표-임원',
                status: 'good',
            },
            {
                id: 'korea-capital',
                label: '한국캐피탈',
                businessNumber: '443-03-03030',
                relationCode: '31',
                relationLabel: '동일주소(타업종)',
                status: 'alert',
            },
        ],
    },
    {
        id: 'retail',
        label: '도소매',
        icon: 'retail',
        companies: [
            {
                id: 'korea-trade',
                label: '한국무역',
                businessNumber: '333-33-33333',
                relationCode: '21',
                relationLabel: '대표-임원',
                status: 'attention',
            },
            {
                id: 'korea-distribution',
                label: '한국유통',
                businessNumber: '451-01-01010',
                relationCode: '11',
                relationLabel: '법인특수관계',
                status: 'normal',
            },
            {
                id: 'korea-market',
                label: '한국마켓',
                businessNumber: '452-02-02020',
                relationCode: '24',
                relationLabel: '임원-임원',
                status: 'good',
            },
            {
                id: 'korea-commerce',
                label: '한국커머스플랫폼',
                businessNumber: '453-03-03030',
                relationCode: '20',
                relationLabel: '대표-대표',
                status: 'attention',
            },
        ],
    },
    {
        id: 'information',
        label: '정보통신',
        icon: 'information',
        companies: [
            {
                id: 'korea-power',
                label: '한국산전',
                businessNumber: '666-66-66666',
                relationCode: '23',
                relationLabel: '임원-대표',
                status: 'attention',
            },
            {
                id: 'korea-telecom',
                label: '한국통신',
                businessNumber: '461-01-01010',
                relationCode: '10',
                relationLabel: '법인주주',
                status: 'normal',
            },
            {
                id: 'korea-data',
                label: '한국데이터서비스',
                businessNumber: '462-02-02020',
                relationCode: '23',
                relationLabel: '임원-대표',
                status: 'good',
            },
            {
                id: 'korea-software',
                label: '한국소프트웨어기술',
                businessNumber: '463-03-03030',
                relationCode: '31',
                relationLabel: '동일주소(타업종)',
                status: 'alert',
            },
        ],
    },
    {
        id: 'professional-science',
        label: '전문/과학',
        icon: 'education',
        companies: [
            {
                id: 'korea-research',
                label: '한국연구개발',
                businessNumber: '103-03-03030',
                relationCode: '20',
                relationLabel: '대표-대표',
                status: 'good',
            },
            {
                id: 'korea-science',
                label: '한국과학기술',
                businessNumber: '471-01-01010',
                relationCode: '11',
                relationLabel: '법인특수관계',
                status: 'normal',
            },
            {
                id: 'korea-consulting',
                label: '한국기술컨설팅',
                businessNumber: '472-02-02020',
                relationCode: '20',
                relationLabel: '대표-대표',
                status: 'attention',
            },
            {
                id: 'korea-laboratory',
                label: '한국산업연구소',
                businessNumber: '473-03-03030',
                relationCode: '24',
                relationLabel: '임원-임원',
                status: 'good',
            },
        ],
    },
    {
        id: 'transport-storage',
        label: '운수/창고',
        icon: 'retail',
        companies: [
            {
                id: 'korea-logistics',
                label: '한국물류',
                businessNumber: '104-04-04040',
                relationCode: '41',
                relationLabel: '동일대표(개인)',
                status: 'poor',
            },
            {
                id: 'korea-transport',
                label: '한국운송',
                businessNumber: '481-01-01010',
                relationCode: '10',
                relationLabel: '법인주주',
                status: 'normal',
            },
            {
                id: 'korea-storage',
                label: '한국물류창고',
                businessNumber: '482-02-02020',
                relationCode: '30',
                relationLabel: '동일주소(동업종)',
                status: 'good',
            },
            {
                id: 'korea-delivery',
                label: '한국종합배송서비스',
                businessNumber: '483-03-03030',
                relationCode: '41',
                relationLabel: '동일대표(개인)',
                status: 'attention',
            },
        ],
    },
]

const DIRECT_RELATIONSHIP_COMPANIES: CompanySector['companies'] = [
    {
        id: 'direct-partner',
        label: '한국직접연계기업',
        businessNumber: '491-01-01010',
        relationCode: '11',
        relationLabel: '법인특수관계',
        status: 'normal',
    },
    {
        id: 'direct-shareholder',
        label: '한국직접주주사',
        businessNumber: '492-02-02020',
        relationCode: '10',
        relationLabel: '법인주주',
        status: 'attention',
    },
]

type SupplyDenseCompany = {
    id: string
    industryId: string
    label: string
    ratio: number
    status: NetworkNode['status']
    weight: number
}

const SUPPLY_DENSE_COMPANIES: SupplyDenseCompany[] = [
    {id: 'it-cloud', industryId: 'it', label: '한국클라우드', ratio: 7.92, status: 'normal', weight: 25},
    {id: 'it-security', industryId: 'it', label: '한국정보보안', ratio: 6.18, status: 'interest', weight: 23},
    {id: 'science-lab', industryId: 'science', label: '한국첨단연구소', ratio: 4.82, status: 'normal', weight: 22},
    {id: 'science-analysis', industryId: 'science', label: '한국과학분석원', ratio: 3.74, status: 'normal', weight: 20},
    {id: 'rental-office', industryId: 'rental', label: '한국오피스임대', ratio: 5.16, status: 'normal', weight: 21},
    {id: 'rental-equipment', industryId: 'rental', label: '한국장비렌탈', ratio: 3.48, status: 'closed', weight: 18},
    {id: 'food-hotel', industryId: 'food', label: '한국호텔서비스', ratio: 6.23, status: 'normal', weight: 23},
    {id: 'food-catering', industryId: 'food', label: '한국급식산업', ratio: 4.11, status: 'interest', weight: 19},
    {
        id: 'manufacturing-parts',
        industryId: 'manufacturing-industry',
        label: '한국산업부품',
        ratio: 8.76,
        status: 'normal',
        weight: 24,
    },
    {
        id: 'manufacturing-precision',
        industryId: 'manufacturing-industry',
        label: '한국정밀제조',
        ratio: 6.54,
        status: 'danger',
        weight: 21,
    },
    {
        id: 'construction-engineering',
        industryId: 'construction-industry',
        label: '한국건설엔지니어링',
        ratio: 7.25,
        status: 'normal',
        weight: 23,
    },
    {
        id: 'construction-infra',
        industryId: 'construction-industry',
        label: '한국인프라개발',
        ratio: 5.63,
        status: 'interest',
        weight: 20,
    },
    {
        id: 'finance-capital',
        industryId: 'finance-industry',
        label: '한국산업금융',
        ratio: 6.91,
        status: 'normal',
        weight: 22,
    },
    {
        id: 'finance-insurance',
        industryId: 'finance-industry',
        label: '한국종합보험',
        ratio: 4.37,
        status: 'normal',
        weight: 19,
    },
    {
        id: 'retail-commerce',
        industryId: 'retail-industry',
        label: '한국온라인유통',
        ratio: 5.84,
        status: 'normal',
        weight: 21,
    },
    {
        id: 'retail-market',
        industryId: 'retail-industry',
        label: '한국종합상사',
        ratio: 3.92,
        status: 'interest',
        weight: 18,
    },
    {
        id: 'education-learning',
        industryId: 'education-industry',
        label: '한국평생교육원',
        ratio: 4.68,
        status: 'normal',
        weight: 20,
    },
    {
        id: 'education-training',
        industryId: 'education-industry',
        label: '한국기업연수원',
        ratio: 3.21,
        status: 'closed',
        weight: 17,
    },
    {
        id: 'transport-delivery',
        industryId: 'transport-industry',
        label: '한국배송서비스',
        ratio: 5.47,
        status: 'normal',
        weight: 21,
    },
    {
        id: 'transport-storage',
        industryId: 'transport-industry',
        label: '한국물류창고',
        ratio: 3.86,
        status: 'interest',
        weight: 18,
    },
]

const SUPPLY_NODES: NetworkNode[] = [
    {id: 'supply-analysis', label: '한국기업(주)', kind: 'analysis', status: 'interest', weight: 100},
    {id: 'it', label: '정보통신', kind: 'industry', status: 'interest', weight: 100, icon: 'information'},
    {id: 'science', label: '과학기술', kind: 'industry', status: 'interest', weight: 88, icon: 'science'},
    {id: 'rental', label: '사업임대', kind: 'industry', status: 'interest', weight: 76, icon: 'rental'},
    {id: 'food', label: '숙박음식', kind: 'industry', status: 'interest', weight: 66, icon: 'food'},
    {
        id: 'manufacturing-industry',
        label: '제조',
        kind: 'industry',
        status: 'interest',
        weight: 72,
        icon: 'manufacturing',
    },
    {
        id: 'construction-industry',
        label: '건설',
        kind: 'industry',
        status: 'interest',
        weight: 68,
        icon: 'construction',
    },
    {id: 'finance-industry', label: '금융보험', kind: 'industry', status: 'interest', weight: 64, icon: 'finance'},
    {id: 'retail-industry', label: '도소매', kind: 'industry', status: 'interest', weight: 60, icon: 'retail'},
    {
        id: 'education-industry',
        label: '교육서비스',
        kind: 'industry',
        status: 'interest',
        weight: 56,
        icon: 'education',
    },
    {id: 'transport-industry', label: '운수창고', kind: 'industry', status: 'interest', weight: 52, icon: 'transport'},
    {id: 'supply-1', label: '한국정보기술', kind: 'company', status: 'normal', weight: 42},
    {id: 'supply-2', label: '한국데이터', kind: 'company', status: 'normal', weight: 36},
    {id: 'supply-3', label: '한국네트워크', kind: 'company', status: 'normal', weight: 28},
    {id: 'supply-4', label: '한국소프트웨어', kind: 'company', status: 'normal', weight: 24},
    {id: 'supply-5', label: '한국과학연구원', kind: 'company', status: 'closed', weight: 21},
    {id: 'supply-6', label: '한국기술개발', kind: 'company', status: 'normal', weight: 19},
    {id: 'supply-7', label: '한국임대서비스', kind: 'company', status: 'normal', weight: 17},
    {id: 'supply-8', label: '한국외식산업', kind: 'company', status: 'danger', weight: 15},
    {id: 'direct-supply-1', label: '한국직접거래', kind: 'company', status: 'normal', weight: 34},
    {id: 'direct-supply-2', label: '한국직접유통', kind: 'company', status: 'interest', weight: 26},
    {id: 'manufacturing-company', label: '한국제조산업', kind: 'company', status: 'normal', weight: 32},
    {id: 'construction-company', label: '한국종합건설', kind: 'company', status: 'normal', weight: 30},
    {id: 'finance-company', label: '한국금융서비스', kind: 'company', status: 'closed', weight: 28},
    {id: 'retail-company', label: '한국유통상사', kind: 'company', status: 'normal', weight: 26},
    {id: 'education-company', label: '한국교육연구원', kind: 'company', status: 'normal', weight: 24},
    {id: 'transport-company', label: '한국종합물류', kind: 'company', status: 'danger', weight: 22},
    ...SUPPLY_DENSE_COMPANIES.map<NetworkNode>(({id, label, status, weight}) => ({
        id,
        label,
        kind: 'company',
        status,
        weight,
    })),
]

const SUPPLY_LINKS: NetworkLink[] = [
    {id: 'industry-link-1', source: 'supply-analysis', target: 'it', ratio: 60.13},
    {id: 'industry-link-2', source: 'supply-analysis', target: 'science', ratio: 18.42},
    {id: 'industry-link-3', source: 'supply-analysis', target: 'rental', ratio: 11.61},
    {id: 'industry-link-4', source: 'supply-analysis', target: 'food', ratio: 0.99},
    {id: 'industry-link-5', source: 'supply-analysis', target: 'manufacturing-industry', ratio: 9.84},
    {id: 'industry-link-6', source: 'supply-analysis', target: 'construction-industry', ratio: 7.62},
    {id: 'industry-link-7', source: 'supply-analysis', target: 'finance-industry', ratio: 6.45},
    {id: 'industry-link-8', source: 'supply-analysis', target: 'retail-industry', ratio: 5.38},
    {id: 'industry-link-9', source: 'supply-analysis', target: 'education-industry', ratio: 4.27},
    {id: 'industry-link-10', source: 'supply-analysis', target: 'transport-industry', ratio: 3.16},
    {id: 'supply-link-1', source: 'it', target: 'supply-1', ratio: 28.2},
    {id: 'supply-link-2', source: 'it', target: 'supply-2', ratio: 12.76},
    {id: 'supply-link-3', source: 'it', target: 'supply-3', ratio: 8.4},
    {id: 'supply-link-4', source: 'it', target: 'supply-4', ratio: 4.56},
    {id: 'supply-link-5', source: 'science', target: 'supply-5', ratio: 54.24},
    {id: 'supply-link-6', source: 'science', target: 'supply-6', ratio: 3.0},
    {id: 'supply-link-7', source: 'rental', target: 'supply-7', ratio: 2.37},
    {id: 'supply-link-8', source: 'food', target: 'supply-8', ratio: 100},
    {id: 'direct-link-1', source: 'supply-analysis', target: 'direct-supply-1', ratio: 2.21},
    {id: 'direct-link-2', source: 'supply-analysis', target: 'direct-supply-2', ratio: 1.63},
    {id: 'supply-link-9', source: 'manufacturing-industry', target: 'manufacturing-company', ratio: 32.18},
    {id: 'supply-link-10', source: 'construction-industry', target: 'construction-company', ratio: 27.64},
    {id: 'supply-link-11', source: 'finance-industry', target: 'finance-company', ratio: 21.35},
    {id: 'supply-link-12', source: 'retail-industry', target: 'retail-company', ratio: 17.82},
    {id: 'supply-link-13', source: 'education-industry', target: 'education-company', ratio: 13.49},
    {id: 'supply-link-14', source: 'transport-industry', target: 'transport-company', ratio: 10.27},
    ...SUPPLY_DENSE_COMPANIES.map(({id, industryId, ratio}) => ({
        id: `dense-link-${id}`,
        source: industryId,
        target: id,
        ratio,
    })),
]

type SupplyScenarioId = 'large' | 'medium' | 'small'

const SUPPLY_SCENARIOS: {id: SupplyScenarioId; label: string; nodeIds: string[]}[] = [
    {
        id: 'small',
        label: '적음 6개',
        nodeIds: ['supply-analysis', 'it', 'science', 'supply-1', 'supply-5', 'direct-supply-1'],
    },
    {
        id: 'medium',
        label: '중간 14개',
        nodeIds: [
            'supply-analysis',
            'it',
            'science',
            'rental',
            'food',
            'supply-1',
            'supply-5',
            'supply-6',
            'science-lab',
            'supply-7',
            'rental-office',
            'rental-equipment',
            'supply-8',
            'direct-supply-1',
        ],
    },
    {id: 'large', label: `많음 ${SUPPLY_NODES.length}개`, nodeIds: SUPPLY_NODES.map(({id}) => id)},
]

const ISSUE_WORDS: WordCloudItem[] = [
    {text: '인공지능', weight: 100},
    {text: '학습', weight: 82},
    {text: '기술', weight: 70},
    {text: '이미지', weight: 64},
    {text: '이공', weight: 61},
    {text: '모델', weight: 56},
    {text: '신경망', weight: 51},
    {text: '지능', weight: 47},
    {text: '인식', weight: 42},
    {text: '기반', weight: 38},
    {text: '분석', weight: 34},
    {text: '분류', weight: 31},
    {text: '예측', weight: 29},
    {text: '서비스', weight: 27},
    {text: '영상', weight: 25},
    {text: '활용', weight: 23},
    {text: '네트워크', weight: 21},
    {text: '성능', weight: 19},
]

const NetworkLegend = ({nodes}: {nodes: NetworkNode[]}) => {
    const companyNodes = nodes.filter(({kind}) => kind === 'company')
    const statuses = [
        {status: 'closed', label: '폐업', color: 'bg-chart-5'},
        {status: 'danger', label: '위험', color: 'bg-error'},
        {status: 'interest', label: '관심', color: 'bg-chart-3'},
        {status: 'normal', label: '정상', color: 'bg-chart-1'},
    ]

    return (
        <aside className="flex flex-col gap-6" aria-label="기업 상태 범례">
            <div className="flex flex-col gap-3">
                <h3 className="typo-body-l-bold">상태 범례</h3>
                <ul className="typo-body-l-regular text-foreground-subtle flex flex-col gap-3">
                    {statuses.map(({status, label, color}) => (
                        <li key={status} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                            <span className={`${color} size-3 rounded-full`} aria-hidden="true" />
                            <span>{label}</span>
                            <span className="tabular-nums">
                                {companyNodes.filter((node) => node.status === status).length}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-muted rounded-xl p-4">
                <h3 className="typo-body-m-bold">읽는 방법</h3>
                <p className="typo-body-m-regular text-foreground-subtle mt-2">
                    분석기업에서 업종과 거래기업으로 이어지는 선의 비중(%)을 따라가면 됩니다.
                </p>
            </div>
        </aside>
    )
}

const CompanyRelationshipLegend = () => (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div className="flex flex-col gap-3">
            <h3 className="typo-body-l-bold">연계유형</h3>
            <ul className="typo-body-l-regular text-foreground-subtle flex flex-col gap-2">
                {[
                    ['10', '법인주주'],
                    ['11', '법인특수관계'],
                    ['20', '대표-대표'],
                    ['21', '대표-임원'],
                    ['23', '임원-대표'],
                    ['24', '임원-임원'],
                    ['30', '동일주소(동업종)'],
                    ['31', '동일주소(타업종)'],
                    ['40', '동일거주지'],
                    ['41', '동일대표(개인)'],
                ].map(([code, label]) => (
                    <li key={code} className="flex items-start gap-2">
                        <span className="bg-chart-5 text-background mt-0.5 rounded-sm px-1.5 py-0.5 text-xs font-bold">
                            {code}
                        </span>
                        {label}
                    </li>
                ))}
            </ul>
        </div>
        <div className="flex flex-col gap-3">
            <h3 className="typo-body-l-bold">EW등급</h3>
            <ul className="typo-body-l-regular text-foreground-subtle flex flex-col gap-2">
                {[
                    ['bg-chart-2', '정상'],
                    ['bg-success', '유보'],
                    ['bg-chart-3', '관심'],
                    ['bg-warning', '경보'],
                    ['bg-error', '위험'],
                    ['bg-destructive', '고위험'],
                    ['bg-chart-1', '부도'],
                    ['bg-chart-5', '휴업/폐업/청산'],
                ].map(([color, label]) => (
                    <li key={label} className="flex items-center gap-2">
                        <span className={`${color} size-3 rounded-full`} aria-hidden="true" />
                        {label}
                    </li>
                ))}
            </ul>
        </div>
        <div className="border-border bg-background flex gap-6 rounded-md border border-dashed p-3 sm:col-span-2 lg:col-span-1 xl:col-span-2">
            <span className="flex items-center gap-2">
                <span className="border-foreground-subtle w-5 border-t border-dashed" aria-hidden="true" />
                분석기업-섹터
            </span>
            <span className="flex items-center gap-2">
                <span className="bg-border h-px w-5" aria-hidden="true" />
                섹터-연계기업
            </span>
        </div>
    </div>
)

const CompanyNetworkDemo = () => {
    const [sectorCount, setSectorCount] = useState(COMPANY_SECTORS.length)
    const visibleSectors = COMPANY_SECTORS.slice(0, sectorCount).map((sector) => ({
        ...sector,
        companies:
            sectorCount === COMPANY_SECTORS.length
                ? sector.companies
                : sector.companies.slice(0, sectorCount === 6 && sector.id === 'manufacturing' ? 7 : 2),
    }))
    const companyCount =
        visibleSectors.reduce((total, sector) => total + sector.companies.length, 0) +
        DIRECT_RELATIONSHIP_COMPANIES.length
    const scenarios = [
        {count: 3, label: '적음 3개'},
        {count: 6, label: '중간 6개'},
        {count: COMPANY_SECTORS.length, label: `많음 ${COMPANY_SECTORS.length}개`},
    ]

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="typo-body-l-medium">섹터·기업 수에 따른 반경·각도 자동 재계산</p>
                <div className="flex gap-2" role="group" aria-label="연계기업 섹터 수 선택">
                    {scenarios.map(({count, label}) => (
                        <Button
                            key={count}
                            type="button"
                            size="xs"
                            variant={sectorCount === count ? 'default' : 'outline'}
                            aria-pressed={sectorCount === count}
                            onClick={() => setSectorCount(count)}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
                <CompanyRelationshipLegend />
                <CompanyRelationshipGraph
                    companyName="주식회사 한국첨단산업기술연구원"
                    sectors={visibleSectors}
                    directCompanies={DIRECT_RELATIONSHIP_COMPANIES}
                    ariaLabel={`한국기업을 중심으로 ${visibleSectors.length}개 산업 섹터와 ${companyCount}개 연계기업의 관계 코드·EW등급을 나타낸 네트워크 그래프`}
                />
            </div>
        </div>
    )
}

const SupplyNetworkDemo = () => {
    const [scenarioId, setScenarioId] = useState<SupplyScenarioId>('large')
    const scenario = SUPPLY_SCENARIOS.find(({id}) => id === scenarioId) ?? SUPPLY_SCENARIOS[2]
    const visibleNodeIds = new Set(scenario.nodeIds)
    const visibleNodes = SUPPLY_NODES.filter(({id}) => visibleNodeIds.has(id))
    const visibleLinks = SUPPLY_LINKS.filter(
        ({source, target}) => visibleNodeIds.has(source) && visibleNodeIds.has(target),
    )

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="typo-body-l-medium">업종·기업 수에 따른 반경·각도 자동 재계산</p>
                <div className="flex gap-2" role="group" aria-label="공급망 노드 수 선택">
                    {SUPPLY_SCENARIOS.map(({id, label}) => (
                        <Button
                            key={id}
                            type="button"
                            size="xs"
                            variant={scenarioId === id ? 'default' : 'outline'}
                            aria-pressed={scenarioId === id}
                            onClick={() => setScenarioId(id)}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
                <NetworkLegend nodes={visibleNodes} />
                <NetworkGraph
                    nodes={visibleNodes}
                    links={visibleLinks}
                    ariaLabel={`한국기업을 중심으로 ${visibleNodes.length - 1}개 업종·기업 노드의 공급망 비중을 나타낸 그래프`}
                />
            </div>
        </div>
    )
}

const IssueWordCloudDemo = () => (
    <WordCloud words={ISSUE_WORDS} ariaLabel="최근 연구개발 이슈 18개를 중요도순으로 나타낸 워드클라우드" />
)

export {CompanyNetworkDemo, IssueWordCloudDemo, SupplyNetworkDemo}
