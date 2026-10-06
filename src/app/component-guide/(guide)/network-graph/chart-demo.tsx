'use client'

// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import {useMemo, useState} from 'react'
import {ChartSkeleton} from '@/components/composite/chart-skeleton'
import {
    CompanyRelationshipGraph,
    type CompanyRiskStatus,
    type CompanySector,
    type RelatedCompany,
    type SectorIcon,
} from '@/components/custom/company-relationship-graph'
import {
    NetworkGraph,
    type NetworkLink,
    type NetworkNode,
    type NetworkNodeStatus,
} from '@/components/custom/network-graph'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'

// 데모 데이터는 한 줄에 한 기업인 표로 적고 아래 변환 함수로 컴포넌트 입력 모양을 만든다.
type CompanyRow = readonly [
    id: string,
    label: string,
    businessNumber: string,
    relationCode: string,
    relationLabel: string,
    status: CompanyRiskStatus,
]

const toCompany = ([id, label, businessNumber, relationCode, relationLabel, status]: CompanyRow): RelatedCompany => ({
    id,
    label,
    businessNumber,
    relationCode,
    relationLabel,
    status,
})

const SECTOR_ROWS: readonly {id: string; label: string; icon: SectorIcon; companies: CompanyRow[]}[] = [
    {
        id: 'construction',
        label: '건설',
        icon: 'construction',
        companies: [
            ['korea-construction', '한국건설', '444-44-44444', '24', '임원-임원', 'normal'],
            ['korea-corporation', '한국공사', '222-22-22222', '10', '법인주주', 'good'],
            ['korea-development', '한국개발', '401-01-01010', '20', '대표-대표', 'attention'],
            ['korea-engineering', '한국엔지니어링', '402-02-02020', '31', '동일주소(타업종)', 'normal'],
            ['korea-infrastructure', '한국인프라건설', '403-03-03030', '30', '동일주소(동업종)', 'good'],
        ],
    },
    {
        id: 'food',
        label: '숙식/음식',
        icon: 'food',
        companies: [
            ['korea-industry', '한국실업', '111-11-11111', '11', '법인특수관계', 'normal'],
            ['korea-food-service', '한국푸드서비스', '411-01-01010', '10', '법인주주', 'good'],
            ['korea-hotel', '한국호텔', '412-02-02020', '24', '임원-임원', 'attention'],
            ['korea-dining', '한국외식산업', '413-03-03030', '21', '대표-임원', 'alert'],
            ['korea-resort', '한국리조트서비스', '414-04-04040', '30', '동일주소(동업종)', 'normal'],
            ['korea-catering', '한국케이터링', '415-05-05050', '23', '임원-대표', 'good'],
        ],
    },
    {
        id: 'education',
        label: '교육서비스',
        icon: 'education',
        companies: [
            ['korea-business', '한국산업', '777-77-77777', '31', '동일주소(타업종)', 'good'],
            ['korea-education', '한국교육원', '421-01-01010', '11', '법인특수관계', 'normal'],
            ['korea-academy', '한국인재개발원', '422-02-02020', '20', '대표-대표', 'attention'],
            ['korea-learning', '한국평생교육서비스', '423-03-03030', '40', '동일거주지', 'good'],
            ['korea-digital-education', '한국디지털교육원', '424-04-04040', '11', '법인특수관계', 'normal'],
            ['korea-vocational-training', '한국직업교육원', '425-05-05050', '24', '임원-임원', 'good'],
            ['korea-online-learning', '한국온라인학습서비스', '426-06-06060', '20', '대표-대표', 'attention'],
            ['korea-education-contents', '한국교육콘텐츠연구소', '427-07-07070', '31', '동일주소(타업종)', 'normal'],
            ['korea-industrial-academy', '한국산업아카데미', '428-08-08080', '21', '대표-임원', 'alert'],
        ],
    },
    {
        id: 'manufacturing',
        label: '제조',
        icon: 'manufacturing',
        companies: [
            ['korea-electric', '한국전기', '555-55-55555', '11', '법인특수관계', 'normal'],
            ['korea-electronics', '한국전력설비기술서비스주식회사', '888-88-88888', '11', '법인특수관계', 'normal'],
            ['korea-machinery', '한국기계', '201-01-01010', '10', '법인주주', 'good'],
            ['korea-materials', '한국소재', '202-02-02020', '20', '대표-대표', 'attention'],
            ['korea-parts', '한국부품', '203-03-03030', '21', '대표-임원', 'alert'],
            ['korea-precision', '한국정밀', '204-04-04040', '23', '임원-대표', 'danger'],
            ['korea-automation', '한국자동화', '205-05-05050', '24', '임원-임원', 'high-risk'],
            ['korea-factory', '한국팩토리', '206-06-06060', '30', '동일주소(동업종)', 'poor'],
            ['korea-production', '한국생산기술', '207-07-07070', '31', '동일주소(타업종)', 'closed'],
        ],
    },
    {
        id: 'management',
        label: '관리/서비스',
        icon: 'management',
        companies: [
            ['korea-paper', '한국제지', '901-01-01010', '40', '동일거주지', 'normal'],
            ['korea-management', '한국경영서비스', '431-01-01010', '20', '대표-대표', 'good'],
            ['korea-support', '한국기업지원', '432-02-02020', '11', '법인특수관계', 'attention'],
            ['korea-facility', '한국시설관리', '433-03-03030', '30', '동일주소(동업종)', 'poor'],
            ['korea-office-service', '한국오피스서비스', '434-04-04040', '10', '법인주주', 'normal'],
            ['korea-business-support', '한국비즈니스지원센터', '435-05-05050', '11', '법인특수관계', 'good'],
        ],
    },
    {
        id: 'finance',
        label: '금융/보험',
        icon: 'finance',
        companies: [
            ['korea-environment', '한국환경', '102-02-02020', '30', '동일주소(동업종)', 'high-risk'],
            ['korea-finance', '한국금융', '441-01-01010', '10', '법인주주', 'normal'],
            ['korea-insurance', '한국보험서비스', '442-02-02020', '21', '대표-임원', 'good'],
            ['korea-capital', '한국캐피탈', '443-03-03030', '31', '동일주소(타업종)', 'alert'],
            ['korea-investment', '한국투자금융', '444-04-04040', '20', '대표-대표', 'normal'],
            ['korea-fintech', '한국핀테크서비스', '445-05-05050', '23', '임원-대표', 'attention'],
        ],
    },
    {
        id: 'retail',
        label: '도소매',
        icon: 'retail',
        companies: [
            ['korea-trade', '한국무역', '333-33-33333', '21', '대표-임원', 'attention'],
            ['korea-distribution', '한국유통', '451-01-01010', '11', '법인특수관계', 'normal'],
            ['korea-market', '한국마켓', '452-02-02020', '24', '임원-임원', 'good'],
            ['korea-commerce', '한국커머스플랫폼', '453-03-03030', '20', '대표-대표', 'attention'],
            ['korea-wholesale', '한국종합도매', '454-04-04040', '30', '동일주소(동업종)', 'normal'],
            ['korea-retail-platform', '한국리테일플랫폼', '455-05-05050', '11', '법인특수관계', 'good'],
        ],
    },
    {
        id: 'information',
        label: '정보통신',
        icon: 'information',
        companies: [
            ['korea-power', '한국산전', '666-66-66666', '23', '임원-대표', 'attention'],
            ['korea-telecom', '한국통신', '461-01-01010', '10', '법인주주', 'normal'],
            ['korea-data', '한국데이터서비스', '462-02-02020', '23', '임원-대표', 'good'],
            ['korea-software', '한국소프트웨어기술', '463-03-03030', '31', '동일주소(타업종)', 'alert'],
            ['korea-cloud-platform', '한국클라우드플랫폼', '464-04-04040', '10', '법인주주', 'normal'],
            ['korea-security-service', '한국정보보안서비스', '465-05-05050', '24', '임원-임원', 'poor'],
        ],
    },
    {
        id: 'professional-science',
        label: '전문/과학',
        icon: 'education',
        companies: [
            ['korea-research', '한국연구개발', '103-03-03030', '20', '대표-대표', 'good'],
            ['korea-science', '한국과학기술', '471-01-01010', '11', '법인특수관계', 'normal'],
            ['korea-consulting', '한국기술컨설팅', '472-02-02020', '20', '대표-대표', 'attention'],
            ['korea-laboratory', '한국산업연구소', '473-03-03030', '24', '임원-임원', 'good'],
        ],
    },
    {
        id: 'transport-storage',
        label: '운수/창고',
        icon: 'retail',
        companies: [
            ['korea-logistics', '한국물류', '104-04-04040', '41', '동일대표(개인)', 'poor'],
            ['korea-transport', '한국운송', '481-01-01010', '10', '법인주주', 'normal'],
            ['korea-storage', '한국물류창고', '482-02-02020', '30', '동일주소(동업종)', 'good'],
            ['korea-delivery', '한국종합배송서비스', '483-03-03030', '41', '동일대표(개인)', 'attention'],
        ],
    },
]

const COMPANY_SECTORS: CompanySector[] = SECTOR_ROWS.map((sector) => ({
    ...sector,
    companies: sector.companies.map(toCompany),
}))

const DIRECT_RELATIONSHIP_COMPANIES: RelatedCompany[] = (
    [
        ['direct-partner', '한국직접연계기업', '491-01-01010', '11', '법인특수관계', 'normal'],
        ['direct-shareholder', '한국직접주주사', '492-02-02020', '10', '법인주주', 'attention'],
    ] satisfies CompanyRow[]
).map(toCompany)

type SupplyDenseRow = readonly [
    id: string,
    industryId: string,
    label: string,
    ratio: number,
    status: NetworkNodeStatus,
    weight: number,
]

const SUPPLY_DENSE_ROWS: SupplyDenseRow[] = [
    ['it-cloud', 'it', '한국클라우드', 7.92, 'normal', 25],
    ['it-security', 'it', '한국정보보안', 6.18, 'interest', 23],
    ['science-lab', 'science', '한국첨단연구소', 4.82, 'normal', 22],
    ['science-analysis', 'science', '한국과학분석원', 3.74, 'normal', 20],
    ['rental-office', 'rental', '한국오피스임대', 5.16, 'normal', 21],
    ['rental-equipment', 'rental', '한국장비렌탈', 3.48, 'closed', 18],
    ['food-hotel', 'food', '한국호텔서비스', 6.23, 'normal', 23],
    ['food-catering', 'food', '한국급식산업', 4.11, 'interest', 19],
    ['manufacturing-parts', 'manufacturing-industry', '한국산업부품', 8.76, 'normal', 24],
    ['manufacturing-precision', 'manufacturing-industry', '한국정밀제조', 6.54, 'danger', 21],
    ['construction-engineering', 'construction-industry', '한국건설엔지니어링', 7.25, 'normal', 23],
    ['construction-infra', 'construction-industry', '한국인프라개발', 5.63, 'interest', 20],
    ['finance-capital', 'finance-industry', '한국산업금융', 6.91, 'normal', 22],
    ['finance-insurance', 'finance-industry', '한국종합보험', 4.37, 'normal', 19],
    ['retail-commerce', 'retail-industry', '한국온라인유통', 5.84, 'normal', 21],
    ['retail-market', 'retail-industry', '한국종합상사', 3.92, 'interest', 18],
    ['retail-wholesale', 'retail-industry', '한국종합도매', 3.46, 'normal', 18],
    ['retail-mart', 'retail-industry', '한국생활마트', 2.91, 'normal', 17],
    ['retail-commerce-platform', 'retail-industry', '한국커머스플랫폼', 2.38, 'interest', 16],
    ['retail-distribution', 'retail-industry', '한국유통네트워크', 1.94, 'normal', 15],
    ['retail-franchise', 'retail-industry', '한국프랜차이즈유통', 1.52, 'danger', 14],
    ['retail-global', 'retail-industry', '한국글로벌트레이딩', 1.17, 'closed', 13],
    ['education-learning', 'education-industry', '한국평생교육원', 4.68, 'normal', 20],
    ['education-training', 'education-industry', '한국기업연수원', 3.21, 'closed', 17],
    ['education-digital', 'education-industry', '한국디지털교육원', 7.82, 'normal', 22],
    ['education-vocational', 'education-industry', '한국직업교육원', 6.47, 'normal', 21],
    ['education-online', 'education-industry', '한국온라인학습', 5.34, 'interest', 20],
    ['education-contents', 'education-industry', '한국교육콘텐츠', 4.26, 'normal', 19],
    ['education-academy', 'education-industry', '한국산업아카데미', 2.89, 'danger', 18],
    ['transport-delivery', 'transport-industry', '한국배송서비스', 5.47, 'normal', 21],
    ['transport-storage', 'transport-industry', '한국물류창고', 3.86, 'interest', 18],
    ['transport-air', 'transport-industry', '한국항공운송', 9.42, 'normal', 24],
    ['transport-marine', 'transport-industry', '한국해상운송', 8.76, 'normal', 23],
    ['transport-rail', 'transport-industry', '한국철도물류', 7.91, 'interest', 22],
    ['transport-cold', 'transport-industry', '한국저온물류', 6.84, 'normal', 21],
    ['transport-port', 'transport-industry', '한국항만서비스', 5.73, 'closed', 20],
    ['transport-express', 'transport-industry', '한국특송물류', 4.89, 'normal', 19],
    ['transport-terminal', 'transport-industry', '한국물류터미널', 4.12, 'interest', 18],
    ['transport-smart', 'transport-industry', '한국스마트물류', 3.58, 'normal', 17],
    ['transport-global', 'transport-industry', '한국글로벌운송', 2.94, 'danger', 16],
    ['transport-warehouse', 'transport-industry', '한국스마트통합물류창고운영주식회사', 2.31, 'normal', 15],
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
        label: '교육서비스·인적자원개발업',
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
    ...SUPPLY_DENSE_ROWS.map<NetworkNode>(([id, , label, , status, weight]) => ({
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
    ...SUPPLY_DENSE_ROWS.map(([id, industryId, , ratio]) => ({
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
        label: '적음',
        nodeIds: 'supply-analysis it science supply-1 supply-2 supply-3 supply-5 direct-supply-1'.split(' '),
    },
    {
        id: 'medium',
        label: '중간',
        nodeIds:
            'supply-analysis it science rental manufacturing-industry retail-industry education-industry supply-1 supply-2 supply-3 supply-4 it-cloud supply-5 supply-7 rental-office manufacturing-company manufacturing-parts manufacturing-precision retail-company education-company education-learning direct-supply-1'.split(
                ' ',
            ),
    },
    {
        id: 'large',
        label: '많음',
        nodeIds:
            'supply-analysis it science rental food manufacturing-industry retail-industry education-industry transport-industry supply-1 supply-2 supply-3 supply-4 it-cloud it-security supply-5 science-lab supply-7 supply-8 manufacturing-company manufacturing-parts manufacturing-precision retail-company retail-commerce retail-market retail-wholesale retail-mart retail-commerce-platform retail-distribution retail-franchise retail-global education-company education-learning education-training education-digital transport-company transport-delivery transport-storage transport-air transport-marine transport-rail transport-cold transport-port transport-express transport-terminal transport-smart transport-global transport-warehouse direct-supply-1 direct-supply-2'.split(
                ' ',
            ),
    },
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
                <h4 className="typo-body-l-bold">상태 범례</h4>
                <ul className="typo-body-l-regular text-foreground-subtle flex flex-col gap-3">
                    {statuses.map(({status, label, color}) => (
                        <li key={status} className="flex items-center gap-3">
                            <span className={`${color} size-3 rounded-full`} aria-hidden="true" />
                            <span className="min-w-0 flex-1">{label}</span>
                            <span className="shrink-0 tabular-nums">
                                {companyNodes.filter((node) => node.status === status).length}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-border bg-background flex flex-wrap gap-x-6 gap-y-3 rounded-md border border-dashed p-3">
                <span className="flex items-center gap-2">
                    <span className="border-foreground-subtle w-5 border-t border-dashed" aria-hidden="true" />
                    분석기업-업종
                </span>
                <span className="flex items-center gap-2">
                    <span className="bg-border h-px w-5" aria-hidden="true" />
                    업종-거래기업
                </span>
            </div>
            <div className="bg-muted rounded-xl p-4">
                <h4 className="typo-body-m-bold">읽는 방법</h4>
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
            <h4 className="typo-body-l-bold">연계유형</h4>
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
            <h4 className="typo-body-l-bold">EW등급</h4>
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
                <span className="bg-border h-px w-5" aria-hidden="true" />
                기업 간 관계 (연계유형)
            </span>
            <span className="flex items-center gap-2">
                <span className="border-foreground-subtle w-5 border-t border-dashed" aria-hidden="true" />
                거래관계 (부가세)
            </span>
        </div>
    </div>
)

type CompanyScenarioId = 'large' | 'medium' | 'small'

type CompanyScenario = {
    id: CompanyScenarioId
    label: string
    companyCounts: Record<string, number>
    directCompanyCount: number
}

const COMPANY_SCENARIOS: CompanyScenario[] = [
    {
        id: 'small',
        label: '적음',
        companyCounts: {construction: 1, food: 3, manufacturing: 1},
        directCompanyCount: 1,
    },
    {
        id: 'medium',
        label: '중간',
        companyCounts: {
            construction: 2,
            food: 1,
            education: 2,
            manufacturing: 7,
            management: 1,
            information: 4,
        },
        directCompanyCount: 1,
    },
    {
        id: 'large',
        label: '많음',
        companyCounts: {
            construction: 3,
            food: 2,
            education: 7,
            manufacturing: 9,
            management: 2,
            finance: 1,
            retail: 3,
            information: 5,
            'transport-storage': 3,
        },
        directCompanyCount: 2,
    },
]

const CompanyNetworkDemo = () => {
    const [scenarioId, setScenarioId] = useState<CompanyScenarioId>('large')
    const [isGraphLoading, setIsGraphLoading] = useState(true)
    const scenario = COMPANY_SCENARIOS.find(({id}) => id === scenarioId) ?? COMPANY_SCENARIOS[2]
    const visibleSectors = useMemo(
        () =>
            COMPANY_SECTORS.filter((sector) => sector.id in scenario.companyCounts).map((sector) => ({
                ...sector,
                companies: sector.companies.slice(0, scenario.companyCounts[sector.id]),
            })),
        [scenario],
    )
    const visibleDirectCompanies = useMemo(
        () => DIRECT_RELATIONSHIP_COMPANIES.slice(0, scenario.directCompanyCount),
        [scenario],
    )
    const companyCount =
        visibleSectors.reduce((total, sector) => total + sector.companies.length, 0) + visibleDirectCompanies.length

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-end gap-3">
                <div className="flex gap-2" role="group" aria-label="연계기업 섹터 수 선택">
                    {COMPANY_SCENARIOS.map(({id, label}) => (
                        <Button
                            key={id}
                            type="button"
                            size="xs"
                            variant={scenarioId === id ? 'default' : 'outline'}
                            aria-pressed={scenarioId === id}
                            onClick={() => {
                                setIsGraphLoading(true)
                                setScenarioId(id)
                            }}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="relative">
                {isGraphLoading ? (
                    <ChartSkeleton
                        type="network"
                        legend="company-relationship"
                        label="연계기업 범례와 네트워크 그래프를 불러오는 중입니다."
                        className="relative z-10 h-auto xl:absolute xl:inset-0 xl:h-full"
                    />
                ) : null}
                <div
                    className={cn(
                        'grid items-start gap-6 xl:grid-cols-3',
                        isGraphLoading && 'invisible absolute inset-0 xl:static',
                    )}
                    aria-hidden={isGraphLoading}
                >
                    <CompanyRelationshipLegend />
                    <div className="min-w-0 xl:col-span-2">
                        <CompanyRelationshipGraph
                            companyName="주식회사 한국첨단산업기술연구원"
                            sectors={visibleSectors}
                            directCompanies={visibleDirectCompanies}
                            ariaLabel={`한국기업을 중심으로 ${visibleSectors.length}개 산업 섹터와 ${companyCount}개 연계기업의 관계 코드·EW등급을 나타낸 네트워크 그래프`}
                            onLoadingChange={setIsGraphLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const SupplyNetworkDemo = () => {
    const [scenarioId, setScenarioId] = useState<SupplyScenarioId>('large')
    const [isGraphLoading, setIsGraphLoading] = useState(true)
    const scenario = SUPPLY_SCENARIOS.find(({id}) => id === scenarioId) ?? SUPPLY_SCENARIOS[2]
    const {visibleNodes, visibleLinks} = useMemo(() => {
        const visibleNodeIds = new Set(scenario.nodeIds)
        return {
            visibleNodes: SUPPLY_NODES.filter(({id}) => visibleNodeIds.has(id)),
            visibleLinks: SUPPLY_LINKS.filter(
                ({source, target}) => visibleNodeIds.has(source) && visibleNodeIds.has(target),
            ),
        }
    }, [scenario])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-end gap-3">
                <div className="flex gap-2" role="group" aria-label="공급망 노드 수 선택">
                    {SUPPLY_SCENARIOS.map(({id, label}) => (
                        <Button
                            key={id}
                            type="button"
                            size="xs"
                            variant={scenarioId === id ? 'default' : 'outline'}
                            aria-pressed={scenarioId === id}
                            onClick={() => {
                                setIsGraphLoading(true)
                                setScenarioId(id)
                            }}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="relative">
                {isGraphLoading ? (
                    <ChartSkeleton
                        type="network"
                        legend="supply-network"
                        label="공급망 범례와 네트워크 그래프를 불러오는 중입니다."
                        className="relative z-10 h-auto xl:absolute xl:inset-0 xl:h-full"
                    />
                ) : null}
                <div
                    className={cn(
                        'grid items-start gap-6 xl:grid-cols-3',
                        isGraphLoading && 'invisible absolute inset-0 xl:static',
                    )}
                    aria-hidden={isGraphLoading}
                >
                    <NetworkLegend nodes={visibleNodes} />
                    <div className="min-w-0 xl:col-span-2">
                        <NetworkGraph
                            nodes={visibleNodes}
                            links={visibleLinks}
                            ariaLabel={`한국기업을 중심으로 ${visibleNodes.length - 1}개 업종·기업 노드의 공급망 비중을 나타낸 그래프`}
                            onLoadingChange={setIsGraphLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export {CompanyNetworkDemo, SupplyNetworkDemo}
