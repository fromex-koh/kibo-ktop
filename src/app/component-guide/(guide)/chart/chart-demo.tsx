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

const SUPPLY_NODES: NetworkNode[] = [
    {id: 'it', label: '정보통신', kind: 'industry', status: 'interest', weight: 100, icon: '↻'},
    {id: 'science', label: '과학기술', kind: 'industry', status: 'interest', weight: 88, icon: '◆'},
    {id: 'rental', label: '사업임대', kind: 'industry', status: 'interest', weight: 76, icon: '□'},
    {id: 'food', label: '숙박음식', kind: 'industry', status: 'interest', weight: 66, icon: '●'},
    {id: 'supply-1', label: '○○기업(주)', kind: 'company', status: 'normal', weight: 42},
    {id: 'supply-2', label: '○○기업(주)', kind: 'company', status: 'normal', weight: 36},
    {id: 'supply-3', label: '○○기업(주)', kind: 'company', status: 'normal', weight: 28},
    {id: 'supply-4', label: '○○기업(주)', kind: 'company', status: 'normal', weight: 24},
    {id: 'supply-5', label: '○○기업(주)', kind: 'company', status: 'closed', weight: 21},
    {id: 'supply-6', label: '○○기업(주)', kind: 'company', status: 'normal', weight: 19},
    {id: 'supply-7', label: '○○기업(주)', kind: 'company', status: 'normal', weight: 17},
    {id: 'supply-8', label: '○○기업(주)', kind: 'company', status: 'danger', weight: 15},
]

const SUPPLY_LINKS: NetworkLink[] = [
    {id: 'industry-link-1', source: 'it', target: 'science', ratio: 60.13},
    {id: 'industry-link-2', source: 'science', target: 'rental', ratio: 11.61},
    {id: 'industry-link-3', source: 'science', target: 'food', ratio: 0.99},
    {id: 'supply-link-1', source: 'it', target: 'supply-1', ratio: 28.2},
    {id: 'supply-link-2', source: 'it', target: 'supply-2', ratio: 12.76},
    {id: 'supply-link-3', source: 'it', target: 'supply-3', ratio: 8.4},
    {id: 'supply-link-4', source: 'it', target: 'supply-4', ratio: 4.56},
    {id: 'supply-link-5', source: 'science', target: 'supply-5', ratio: 18.42},
    {id: 'supply-link-6', source: 'science', target: 'supply-6', ratio: 3.0},
    {id: 'supply-link-7', source: 'rental', target: 'supply-7', ratio: 2.37},
    {id: 'supply-link-8', source: 'food', target: 'supply-8', ratio: 1.63},
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

const NetworkLegend = () => (
    <ul className="typo-body-l-regular flex flex-wrap gap-x-5 gap-y-2" aria-label="기업 상태 범례">
        <li className="flex items-center gap-2">
            <span className="bg-chart-5 size-3 rounded-full" aria-hidden="true" />
            폐업
        </li>
        <li className="flex items-center gap-2">
            <span className="bg-error size-3 rounded-full" aria-hidden="true" />
            위험
        </li>
        <li className="flex items-center gap-2">
            <span className="bg-chart-3 size-3 rounded-full" aria-hidden="true" />
            관심
        </li>
        <li className="flex items-center gap-2">
            <span className="bg-chart-1 size-3 rounded-full" aria-hidden="true" />
            정상
        </li>
    </ul>
)

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
    const companyCount = visibleSectors.reduce((total, sector) => total + sector.companies.length, 0)
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
                    ariaLabel={`한국기업을 중심으로 ${visibleSectors.length}개 산업 섹터와 ${companyCount}개 연계기업의 관계 코드·EW등급을 나타낸 네트워크 그래프`}
                />
            </div>
        </div>
    )
}

const SupplyNetworkDemo = () => (
    <div className="flex flex-col gap-4">
        <NetworkLegend />
        <NetworkGraph
            nodes={SUPPLY_NODES}
            links={SUPPLY_LINKS}
            ariaLabel="정보통신·과학기술·사업임대·숙박음식 산업과 연계기업의 공급망 분포 그래프"
        />
    </div>
)

const IssueWordCloudDemo = () => (
    <WordCloud words={ISSUE_WORDS} ariaLabel="최근 연구개발 이슈 18개를 중요도순으로 나타낸 워드클라우드" />
)

export {CompanyNetworkDemo, IssueWordCloudDemo, SupplyNetworkDemo}
