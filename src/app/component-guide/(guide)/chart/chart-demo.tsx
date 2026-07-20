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
    const visibleSectors = COMPANY_SECTORS.slice(0, sectorCount)

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="typo-body-l-medium">데이터 수에 따른 자동 재배치</p>
                <div className="flex gap-2" role="group" aria-label="연계기업 데이터 수 선택">
                    {[6, COMPANY_SECTORS.length].map((count) => (
                        <Button
                            key={count}
                            type="button"
                            size="xs"
                            variant={sectorCount === count ? 'default' : 'outline'}
                            aria-pressed={sectorCount === count}
                            onClick={() => setSectorCount(count)}
                        >
                            {count}개
                        </Button>
                    ))}
                </div>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
                <CompanyRelationshipLegend />
                <CompanyRelationshipGraph
                    companyName="주식회사 한국첨단산업기술연구원"
                    sectors={visibleSectors}
                    ariaLabel={`한국기업을 중심으로 ${visibleSectors.length}개 산업 섹터와 섹터별 연계기업의 관계 코드·EW등급을 나타낸 네트워크 그래프`}
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
