'use client'

import Image from 'next/image'
import {useEffect, useMemo, useRef, useState} from 'react'
import {ArrowDown, ArrowUp} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {EmptyState} from '@/components/composite/empty-state'
import {
    PaidServiceUsageHistoryDialog,
    type PaidServiceUsageHistoryItem,
} from '@/components/composite/paid-service-usage-history-dialog'
import {PaidServiceRefundDialog} from '@/components/composite/paid-service-refund-dialog'
import {Pagination} from '@/components/composite/pagination'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import {useIsMobile} from '@/hooks/use-mobile'

export type PassStatus = 'waiting' | 'expired' | 'refunded'
export type PassFilter = 'all' | PassStatus
export const PASS_SORT_ORDERS = ['desc', 'asc'] as const
export type PassSortOrder = (typeof PASS_SORT_ORDERS)[number]

const PASS_SORT_ORDER_LABEL = {
    asc: '오래된순',
    desc: '최신순',
} as const satisfies Record<PassSortOrder, string>

const nextPassSortOrder = (order: PassSortOrder): PassSortOrder =>
    PASS_SORT_ORDERS[(PASS_SORT_ORDERS.indexOf(order) + 1) % PASS_SORT_ORDERS.length]

export type CurrentPaidServicePass = {
    id: string
    grade: string
    remaining: number
    used: number
    total: number
    period: string
    periodAccent: string
    purchasedAt: string
    composition: string
    price: string
    gradeImage: string
    usageHistory?: readonly PaidServiceUsageHistoryItem[]
    usageHistoryTotalPages?: number
}

export type PaidServicePass = {
    id: string
    grade: string
    remaining: number
    period: string
    periodAccent: string
    purchasedLabel: '구매일' | '지급일'
    acquiredAt: string
    composition: string
    price: string
    status: PassStatus
    gradeImage?: string
    refundable: boolean
    refundNotice?: string
    refundAmount?: string
    refundedAt?: string
    usageHistory?: readonly PaidServiceUsageHistoryItem[]
    usageHistoryTotalPages?: number
}

const USAGE_HISTORY_COMPANIES = [
    {companyName: '㈜테크놀로지', patentName: '인공지능 기반 데이터 분석 시스템'},
    {companyName: '스마트산업㈜', patentName: '사물인터넷 연동 제어 장치'},
    {companyName: '㈜바이오랩', patentName: '바이오 센서를 활용한 진단 키트'},
    {companyName: '딥마인드테크', patentName: '딥러닝 기반 이미지 분류 시스템'},
    {companyName: '나노헬스㈜', patentName: '나노입자 기반 약물전달 시스템'},
    {companyName: '케이에이아이㈜', patentName: '자연어처리 기반 문서 분류 시스템'},
    {companyName: '스페이스테크', patentName: '위성 데이터 분석 플랫폼'},
    {companyName: '㈜디지털팜', patentName: '스마트팜 통합 관제 솔루션'},
] as const

// 참고 시안과 같은 규칙으로 재현 가능한 목업을 만든다. API 연동 시에는 이 함수 대신
// 각 이용권의 usageHistory와 usageHistoryTotalPages에 조회 응답을 넣으면 된다.
const createUsageHistory = ({
    count,
    endDate,
    seed,
    stepMod = 2,
    remaining,
}: {
    count: number
    endDate: string
    seed: number
    stepMod?: number
    remaining: number
}): PaidServiceUsageHistoryItem[] => {
    const endTime = new Date(`${endDate}T00:00:00Z`).getTime()
    let daysBack = 0
    let runningRemaining = remaining

    return Array.from({length: count}, (_, index) => {
        const key = seed + index
        const company = USAGE_HISTORY_COMPANIES[key % USAGE_HISTORY_COMPANIES.length]
        const isSelfInquiry = key % 5 === 2
        const hasNoPatent = !isSelfInquiry && key % 7 === 4
        const isDeducted = !isSelfInquiry && !hasNoPatent
        const item: PaidServiceUsageHistoryItem = {
            id: `${seed}-${index}`,
            usedAt: new Date(endTime - daysBack * 86_400_000).toISOString().slice(0, 10),
            companyName: isSelfInquiry ? '㈜케이탑테크놀로지' : company.companyName,
            patentName: hasNoPatent ? '-' : company.patentName,
            reportType: '기업혁신성장',
            inquiryType: isSelfInquiry ? '자사조회' : '타사조회',
            deduction: isDeducted ? -1 : 0,
            remaining: runningRemaining,
        }

        if (isDeducted) runningRemaining += 1
        if (key % stepMod === 0) daysBack += 1

        return item
    })
}

const CURRENT_PASS: CurrentPaidServicePass = {
    id: 'standard-current',
    grade: '스탠다드',
    remaining: 61,
    used: 89,
    total: 150,
    period: '2026-08-15 ~ 2026-09-13',
    periodAccent: '0일 남음',
    purchasedAt: '2026-08-12',
    composition: '150건 / 30일',
    price: '1,000,000원',
    gradeImage: '/images/ticket-grade/ticket-grade-standard.webp',
    usageHistory: createUsageHistory({count: 130, endDate: '2026-09-06', seed: 10, stepMod: 6, remaining: 61}),
}

const PaidServiceUsageHistoryPreview = () => (
    <PaidServiceUsageHistoryDialog
        defaultOpen
        pass={{grade: CURRENT_PASS.grade, remaining: CURRENT_PASS.remaining}}
        items={CURRENT_PASS.usageHistory}
    />
)

// [프론트엔드 연동] 구매 이용권 조회 응답으로 교체합니다. status는 대기중·만료 필터에 사용합니다.
const PURCHASED_PASSES: readonly PaidServicePass[] = [
    {
        id: 'premium-20260908',
        grade: '프리미엄',
        remaining: 500,
        period: '사용 시작 시 자동 부여',
        periodAccent: '사용 시작 후 100일',
        purchasedLabel: '구매일',
        acquiredAt: '2026-09-08',
        composition: '500건 / 100일',
        price: '2,500,000원',
        status: 'waiting',
        gradeImage: '/images/ticket-grade/ticket-grade-premium.webp',
        refundable: true,
        usageHistory: [],
    },
    {
        id: 'standard-20260907',
        grade: '스탠다드',
        remaining: 150,
        period: '사용 시작 시 자동 부여',
        periodAccent: '사용 시작 후 30일',
        purchasedLabel: '구매일',
        acquiredAt: '2026-09-07',
        composition: '150건 / 30일',
        price: '1,000,000원',
        status: 'waiting',
        gradeImage: '/images/ticket-grade/ticket-grade-standard.webp',
        refundable: true,
        usageHistory: [],
    },
    {
        id: 'basic-20260906',
        grade: '베이직',
        remaining: 60,
        period: '사용 시작 시 자동 부여',
        periodAccent: '사용 시작 후 30일',
        purchasedLabel: '구매일',
        acquiredAt: '2026-09-06',
        composition: '60건 / 30일',
        price: '500,000원',
        status: 'waiting',
        gradeImage: '/images/ticket-grade/ticket-grade-basic.webp',
        refundable: true,
        usageHistory: [],
    },
    {
        id: 'event-20260905',
        grade: 'K-BIGx 오픈 기념 이벤트',
        remaining: 5,
        period: '사용 시작 시 자동 부여',
        periodAccent: '사용 시작 후 14일',
        purchasedLabel: '지급일',
        acquiredAt: '2026-09-05',
        composition: '5건 / 14일',
        price: '무료 지급',
        status: 'waiting',
        refundable: false,
        refundNotice: '무료 지급 이용권은 환불할 수 없습니다.',
        usageHistory: [],
    },
    {
        id: 'minimum-20260904',
        grade: '미니멈',
        remaining: 2,
        period: '사용 시작 시 자동 부여',
        periodAccent: '사용 시작 후 30일',
        purchasedLabel: '구매일',
        acquiredAt: '2026-09-04',
        composition: '2건 / 30일',
        price: '10,000원',
        status: 'waiting',
        gradeImage: '/images/ticket-grade/ticket-grade-minimum.webp',
        refundable: true,
        usageHistory: [],
    },
    {
        id: 'basic-refunded-20260905',
        grade: '베이직',
        remaining: 0,
        period: '-',
        periodAccent: '',
        purchasedLabel: '구매일',
        acquiredAt: '2026-09-05',
        composition: '5건 / 14일',
        price: '500,000원',
        status: 'refunded',
        gradeImage: '/images/ticket-grade/ticket-grade-basic.webp',
        refundable: false,
        refundAmount: '500,000',
        refundedAt: '2026-09-05',
        usageHistory: [],
    },
    {
        id: 'basic-20260707',
        grade: '베이직',
        remaining: 58,
        period: '2026-07-10 ~ 2026-08-08',
        periodAccent: '0일 남음',
        purchasedLabel: '구매일',
        acquiredAt: '2026-07-07',
        composition: '60건 / 30일',
        price: '500,000원',
        status: 'expired',
        gradeImage: '/images/ticket-grade/ticket-grade-basic.webp',
        refundable: false,
        usageHistory: createUsageHistory({count: 4, endDate: '2026-08-05', seed: 9, remaining: 58}),
    },
    {
        id: 'standard-20260602',
        grade: '스탠다드',
        remaining: 144,
        period: '2026-06-05 ~ 2026-07-04',
        periodAccent: '0일 남음',
        purchasedLabel: '구매일',
        acquiredAt: '2026-06-02',
        composition: '150건 / 30일',
        price: '1,000,000원',
        status: 'expired',
        gradeImage: '/images/ticket-grade/ticket-grade-standard.webp',
        refundable: false,
        usageHistory: createUsageHistory({count: 8, endDate: '2026-07-02', seed: 8, remaining: 144}),
    },
    {
        id: 'minimum-20260517',
        grade: '미니멈',
        remaining: 0,
        period: '2026-05-20 ~ 2026-06-18',
        periodAccent: '0일 남음',
        purchasedLabel: '구매일',
        acquiredAt: '2026-05-17',
        composition: '2건 / 30일',
        price: '10,000원',
        status: 'expired',
        gradeImage: '/images/ticket-grade/ticket-grade-minimum.webp',
        refundable: false,
        usageHistory: createUsageHistory({count: 3, endDate: '2026-06-10', seed: 7, remaining: 0}),
    },
    {
        id: 'basic-20260409',
        grade: '베이직',
        remaining: 56,
        period: '2026-04-12 ~ 2026-05-11',
        periodAccent: '0일 남음',
        purchasedLabel: '구매일',
        acquiredAt: '2026-04-09',
        composition: '60건 / 30일',
        price: '500,000원',
        status: 'expired',
        gradeImage: '/images/ticket-grade/ticket-grade-basic.webp',
        refundable: false,
        usageHistory: createUsageHistory({count: 7, endDate: '2026-05-09', seed: 6, remaining: 56}),
    },
    {
        id: 'standard-20260227',
        grade: '스탠다드',
        remaining: 145,
        period: '2026-03-02 ~ 2026-03-31',
        periodAccent: '0일 남음',
        purchasedLabel: '구매일',
        acquiredAt: '2026-02-27',
        composition: '150건 / 30일',
        price: '1,000,000원',
        status: 'expired',
        gradeImage: '/images/ticket-grade/ticket-grade-standard.webp',
        refundable: false,
        usageHistory: createUsageHistory({count: 6, endDate: '2026-03-29', seed: 5, remaining: 145}),
    },
    {
        id: 'minimum-20260211',
        grade: '미니멈',
        remaining: 2,
        period: '2026-02-14 ~ 2026-03-15',
        periodAccent: '0일 남음',
        purchasedLabel: '구매일',
        acquiredAt: '2026-02-11',
        composition: '2건 / 30일',
        price: '10,000원',
        status: 'expired',
        gradeImage: '/images/ticket-grade/ticket-grade-minimum.webp',
        refundable: false,
        usageHistory: createUsageHistory({count: 1, endDate: '2026-03-02', seed: 4, remaining: 2}),
    },
    {
        id: 'basic-20260105',
        grade: '베이직',
        remaining: 57,
        period: '2026-01-08 ~ 2026-02-06',
        periodAccent: '0일 남음',
        purchasedLabel: '구매일',
        acquiredAt: '2026-01-05',
        composition: '60건 / 30일',
        price: '500,000원',
        status: 'expired',
        gradeImage: '/images/ticket-grade/ticket-grade-basic.webp',
        refundable: false,
        usageHistory: createUsageHistory({count: 5, endDate: '2026-02-04', seed: 3, remaining: 57}),
    },
    {
        id: 'minimum-20251128',
        grade: '미니멈',
        remaining: 0,
        period: '2025-12-01 ~ 2025-12-30',
        periodAccent: '0일 남음',
        purchasedLabel: '구매일',
        acquiredAt: '2025-11-28',
        composition: '2건 / 30일',
        price: '10,000원',
        status: 'expired',
        gradeImage: '/images/ticket-grade/ticket-grade-minimum.webp',
        refundable: false,
        usageHistory: createUsageHistory({count: 4, endDate: '2025-12-20', seed: 2, remaining: 0}),
    },
    {
        id: 'basic-20251030',
        grade: '베이직',
        remaining: 56,
        period: '2025-11-01 ~ 2025-11-30',
        periodAccent: '0일 남음',
        purchasedLabel: '구매일',
        acquiredAt: '2025-10-30',
        composition: '60건 / 30일',
        price: '500,000원',
        status: 'expired',
        gradeImage: '/images/ticket-grade/ticket-grade-basic.webp',
        refundable: false,
        usageHistory: createUsageHistory({count: 6, endDate: '2025-11-27', seed: 1, remaining: 56}),
    },
] as const

const PaidServiceRefundPreview = () => <PaidServiceRefundDialog defaultOpen grade={PURCHASED_PASSES[0].grade} />

const FILTERS: readonly {value: PassFilter; label: string}[] = [
    {value: 'all', label: '전체'},
    {value: 'waiting', label: '대기중'},
    {value: 'expired', label: '만료'},
    {value: 'refunded', label: '환불'},
]

const isPassFilter = (value: string): value is PassFilter => FILTERS.some((item) => item.value === value)

const EMPTY_TITLES: Record<PassFilter, string> = {
    all: '구매한 이용권 내역이 없습니다.',
    waiting: '사용 대기중인 이용권이 없습니다.',
    expired: '만료된 이용권이 없습니다.',
    refunded: '환불한 이용권이 없습니다.',
}

const PassGradeImage = ({src, alt}: {src: string; alt: string}) => (
    <Image src={src} alt={alt} width={52} height={52} className="size-13 shrink-0" />
)

const PassMeta = ({label, children}: {label: string; children: React.ReactNode}) => (
    <span className="flex gap-1">
        <span className="text-foreground-subtle">{label}</span>
        <span className="text-foreground">{children}</span>
    </span>
)

const CurrentPass = ({
    item,
    usageHistoryDefaultOpen,
    onViewHistory,
    onUsageHistoryPageChange,
}: {
    item: CurrentPaidServicePass
    usageHistoryDefaultOpen?: boolean
    onViewHistory?: (id: string) => void
    onUsageHistoryPageChange?: (id: string, page: number) => void
}) => (
    <section aria-labelledby="current-pass-title" className="flex flex-col gap-6">
        <h2 id="current-pass-title" className="typo-h4-bold text-foreground">
            현재 사용중인 이용권
        </h2>
        <article className="border-primary bg-card overflow-hidden rounded-lg border">
            <div className="flex flex-col gap-6 px-6 pt-8 md:px-8">
                <div className="flex items-center gap-4">
                    <PassGradeImage src={item.gradeImage} alt={`${item.grade} 이용권 등급`} />
                    <div className="min-w-0 flex-1">
                        <p className="typo-body-m-medium text-foreground-subtle">K-BIGx 보고서 이용권</p>
                        <h3 className="typo-h4-bold text-foreground">{item.grade}</h3>
                    </div>
                    <Badge color="info" shape="round">
                        사용중
                    </Badge>
                </div>
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="typo-title-m-regular text-foreground">
                            잔여 <strong className="typo-title-l-bold">{item.remaining}</strong>건
                        </p>
                        <div className="typo-body-l-regular mt-1 flex flex-wrap gap-x-2">
                            <PassMeta label="이용기간">{item.period}</PassMeta>
                            <strong className="text-primary">{item.periodAccent}</strong>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="bg-background h-2 overflow-hidden rounded-full">
                            <div
                                className="bg-navy-500 h-full rounded-full"
                                style={{width: `${Math.min(Math.max((item.used / item.total) * 100, 0), 100)}%`}}
                            />
                        </div>
                        <div className="typo-body-l-regular flex justify-between">
                            <span className="text-foreground-subtle">사용량</span>
                            <span className="text-foreground">
                                <strong>{item.used}</strong>건 / {item.total}건
                            </span>
                        </div>
                    </div>
                    <div className="typo-body-l-regular flex flex-wrap gap-x-6 gap-y-1 pb-6">
                        <PassMeta label="구매일">{item.purchasedAt}</PassMeta>
                        <PassMeta label="상품 구성">{item.composition}</PassMeta>
                        <PassMeta label="금액">{item.price}</PassMeta>
                    </div>
                </div>
            </div>
            <div className="border-subtle-3 bg-secondary flex flex-col gap-3 border-t border-dashed px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
                <p className="typo-body-m-regular text-foreground-subtle">
                    사용 이력이 있는 이용권은 환불할 수 없습니다.
                </p>
                <PaidServiceUsageHistoryDialog
                    defaultOpen={usageHistoryDefaultOpen}
                    pass={{grade: item.grade, remaining: item.remaining}}
                    items={item.usageHistory}
                    totalPages={item.usageHistoryTotalPages}
                    onPageChange={(page) => onUsageHistoryPageChange?.(item.id, page)}
                >
                    <Button type="button" variant="tertiary" size="sm" onClick={() => onViewHistory?.(item.id)}>
                        이용내역
                    </Button>
                </PaidServiceUsageHistoryDialog>
            </div>
        </article>
    </section>
)

const PurchasedPassCard = ({
    item,
    refundDefaultOpen,
    usageHistoryDefaultOpen,
    onRefund,
    onViewHistory,
    onUsageHistoryPageChange,
}: {
    item: PaidServicePass
    refundDefaultOpen?: boolean
    usageHistoryDefaultOpen?: boolean
    onRefund?: (id: string) => void | Promise<unknown>
    onViewHistory?: (id: string) => void
    onUsageHistoryPageChange?: (id: string, page: number) => void
}) => (
    <article
        className={`border-subtle-3 overflow-hidden rounded-lg border ${item.status === 'waiting' ? 'bg-card' : 'bg-surface-subtle'}`}
    >
        <div className="flex flex-col gap-6 px-6 pt-8 md:px-8">
            <div className="flex items-center gap-4">
                {item.gradeImage ? <PassGradeImage src={item.gradeImage} alt={`${item.grade} 이용권 등급`} /> : null}
                <div className="min-w-0 flex-1">
                    <p className="typo-body-m-medium text-foreground-subtle">K-BIGx 보고서 이용권</p>
                    <h3 className="typo-h4-bold text-foreground break-keep">{item.grade}</h3>
                </div>
                <Badge
                    color={item.status === 'refunded' ? 'error' : item.status === 'expired' ? 'neutral' : 'success'}
                    shape="round"
                    variant={item.status === 'waiting' ? 'solid-pastel' : 'outline'}
                >
                    {item.status === 'refunded' ? '환불' : item.status === 'expired' ? '만료' : '대기중'}
                </Badge>
            </div>
            <div>
                <p className="typo-title-m-regular text-foreground">
                    {item.status === 'refunded' ? (
                        <>
                            환불금액 <strong className="typo-title-l-bold">{item.refundAmount}</strong>원
                        </>
                    ) : (
                        <>
                            잔여 <strong className="typo-title-l-bold">{item.remaining}</strong>건
                        </>
                    )}
                </p>
                <div className="typo-body-l-regular mt-1 flex flex-wrap gap-x-2">
                    <PassMeta label="이용기간">{item.period}</PassMeta>
                    {item.periodAccent ? (
                        <strong className={item.status === 'expired' ? 'text-foreground' : 'text-primary'}>
                            {item.periodAccent}
                        </strong>
                    ) : null}
                </div>
                <div className="typo-body-l-regular mt-4 flex flex-wrap gap-x-6 gap-y-1 pb-6">
                    <PassMeta label={item.purchasedLabel}>{item.acquiredAt}</PassMeta>
                    {item.refundedAt ? <PassMeta label="환불일">{item.refundedAt}</PassMeta> : null}
                    <PassMeta label="상품 구성">{item.composition}</PassMeta>
                    <PassMeta label="금액">{item.price}</PassMeta>
                </div>
            </div>
        </div>
        <div
            className={`border-subtle-3 flex flex-col gap-3 border-t border-dashed px-6 py-4 sm:flex-row sm:items-center md:px-8 ${item.refundNotice ? 'sm:justify-between' : 'sm:justify-end'} ${item.status === 'waiting' ? 'bg-secondary' : 'bg-surface-subtle'}`}
        >
            {item.refundNotice ? (
                <p className="typo-body-l-regular text-foreground-subtle">{item.refundNotice}</p>
            ) : null}
            <div className="flex justify-end gap-2">
                {item.refundable ? (
                    <PaidServiceRefundDialog
                        grade={item.grade}
                        defaultOpen={refundDefaultOpen}
                        onConfirm={() => onRefund?.(item.id)}
                    >
                        <Button type="button" variant="tertiary" size="sm">
                            환불하기
                        </Button>
                    </PaidServiceRefundDialog>
                ) : null}
                <PaidServiceUsageHistoryDialog
                    defaultOpen={usageHistoryDefaultOpen}
                    pass={{grade: item.grade, remaining: item.remaining}}
                    items={item.usageHistory}
                    totalPages={item.usageHistoryTotalPages}
                    onPageChange={(page) => onUsageHistoryPageChange?.(item.id, page)}
                >
                    <Button type="button" variant="tertiary" size="sm" onClick={() => onViewHistory?.(item.id)}>
                        이용내역
                    </Button>
                </PaidServiceUsageHistoryDialog>
            </div>
        </div>
    </article>
)

export type PaidServiceHistoryProps = {
    currentPass?: CurrentPaidServicePass | null
    purchasedPasses?: readonly PaidServicePass[]
    purchasedTotalCount?: number
    totalPages?: number
    pageSize?: number
    onFilterChange?: (filter: PassFilter) => void
    onSortChange?: (sortOrder: PassSortOrder) => void
    onPageChange?: (page: number) => void
    onRefund?: (id: string) => void | Promise<unknown>
    onViewHistory?: (id: string) => void
    onUsageHistoryPageChange?: (id: string, page: number) => void
    defaultOpenUsageHistoryId?: string
    defaultOpenRefundId?: string
}

const PaidServiceHistory = ({
    currentPass = CURRENT_PASS,
    purchasedPasses = PURCHASED_PASSES,
    purchasedTotalCount,
    totalPages,
    pageSize = 10,
    onFilterChange,
    onSortChange,
    onPageChange,
    onRefund,
    onViewHistory,
    onUsageHistoryPageChange,
    defaultOpenUsageHistoryId,
    defaultOpenRefundId,
}: PaidServiceHistoryProps) => {
    const [filter, setFilter] = useState<PassFilter>('all')
    const [sortOrder, setSortOrder] = useState<PassSortOrder>('desc')
    const [page, setPage] = useState(1)
    const isMobile = useIsMobile()
    const listRef = useRef<HTMLDivElement>(null)
    const shouldScrollAfterPageChangeRef = useRef(false)
    const items = useMemo(() => {
        const filteredItems = purchasedPasses.filter((item) => filter === 'all' || item.status === filter)
        return filteredItems.toSorted((a, b) => {
            const dateOrder = a.acquiredAt.localeCompare(b.acquiredAt)
            return sortOrder === 'desc' ? -dateOrder : dateOrder
        })
    }, [filter, purchasedPasses, sortOrder])
    const isServerPaginated = totalPages !== undefined
    const resolvedPageSize = Math.max(1, pageSize)
    const resolvedTotalPages = totalPages ?? Math.max(1, Math.ceil(items.length / resolvedPageSize))
    const visibleItems = isServerPaginated ? items : items.slice((page - 1) * resolvedPageSize, page * resolvedPageSize)

    useEffect(() => {
        if (!shouldScrollAfterPageChangeRef.current) return
        shouldScrollAfterPageChangeRef.current = false

        let secondFrame = 0
        const firstFrame = window.requestAnimationFrame(() => {
            secondFrame = window.requestAnimationFrame(() => {
                const target = listRef.current
                if (!target) return

                const fixedAreaHeight = window.innerWidth < 768 ? 224 : window.innerWidth < 1280 ? 112 : 128
                const targetTop = window.scrollY + target.getBoundingClientRect().top - fixedAreaHeight
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                window.scrollTo({top: targetTop, behavior: prefersReducedMotion ? 'auto' : 'smooth'})
            })
        })

        return () => {
            window.cancelAnimationFrame(firstFrame)
            window.cancelAnimationFrame(secondFrame)
        }
    }, [page])

    const changeFilter = (next: PassFilter) => {
        setFilter(next)
        setPage(1)
        onFilterChange?.(next)
        onPageChange?.(1)
    }

    const changeSortOrder = () => {
        const next = nextPassSortOrder(sortOrder)
        setSortOrder(next)
        setFilter('all')
        setPage(1)
        onSortChange?.(next)
        onFilterChange?.('all')
        onPageChange?.(1)
    }

    const changePage = (next: number) => {
        shouldScrollAfterPageChangeRef.current = true
        setPage(next)
        onPageChange?.(next)
    }

    return (
        <div className="flex flex-col gap-10">
            {currentPass ? (
                <CurrentPass
                    item={currentPass}
                    usageHistoryDefaultOpen={defaultOpenUsageHistoryId === currentPass.id}
                    onViewHistory={onViewHistory}
                    onUsageHistoryPageChange={onUsageHistoryPageChange}
                />
            ) : (
                <section aria-labelledby="current-pass-title" className="flex flex-col gap-6">
                    <h2 id="current-pass-title" className="typo-h4-bold text-foreground">
                        현재 사용중인 이용권
                    </h2>
                    <EmptyState title="현재 사용중인 이용권이 없습니다." className="bg-card min-h-52 rounded-lg" />
                </section>
            )}
            <section aria-labelledby="purchased-pass-title" className="flex flex-col gap-6">
                <h2 id="purchased-pass-title" className="typo-h4-bold text-foreground">
                    구매한 이용권 내역
                </h2>
                <SegmentedControl
                    type="radio"
                    variant="solid"
                    size="md"
                    value={filter}
                    aria-label="이용권 상태 필터"
                    onValueChange={(value) => {
                        if (isPassFilter(value)) changeFilter(value)
                    }}
                >
                    {FILTERS.map((item) => (
                        <SegmentedControlItem key={item.value} value={item.value}>
                            {item.label}
                        </SegmentedControlItem>
                    ))}
                </SegmentedControl>
                <div ref={listRef} className="flex scroll-mt-56 items-center gap-4 md:scroll-mt-28 xl:scroll-mt-32">
                    <p className="typo-body-xl-regular text-foreground min-w-0 flex-1">
                        총{' '}
                        <strong className="typo-body-xl-bold text-primary-strong">
                            {purchasedTotalCount ?? items.length}
                        </strong>
                        건
                    </p>
                    <Button
                        type="button"
                        variant="text"
                        size="md"
                        className="text-foreground min-w-25 justify-end font-medium"
                        aria-label={`${PASS_SORT_ORDER_LABEL[sortOrder]} 정렬, 누르면 ${PASS_SORT_ORDER_LABEL[nextPassSortOrder(sortOrder)]}으로 변경`}
                        onClick={changeSortOrder}
                    >
                        {PASS_SORT_ORDER_LABEL[sortOrder]}
                        {sortOrder === 'asc' ? <ArrowUp aria-hidden="true" /> : <ArrowDown aria-hidden="true" />}
                    </Button>
                </div>
                <div className="flex flex-col gap-4">
                    {visibleItems.length > 0 ? (
                        visibleItems.map((item) => (
                            <PurchasedPassCard
                                key={item.id}
                                item={item}
                                refundDefaultOpen={defaultOpenRefundId === item.id}
                                usageHistoryDefaultOpen={defaultOpenUsageHistoryId === item.id}
                                onRefund={onRefund}
                                onViewHistory={onViewHistory}
                                onUsageHistoryPageChange={onUsageHistoryPageChange}
                            />
                        ))
                    ) : (
                        <EmptyState title={EMPTY_TITLES[filter]} className="bg-card min-h-52 rounded-lg" />
                    )}
                </div>
                {items.length > 0 && resolvedTotalPages > 1 ? (
                    <Pagination
                        page={page}
                        total={resolvedTotalPages}
                        onPageChange={changePage}
                        siblingCount={isMobile ? 0 : 1}
                        prevLabel={isMobile ? '' : '이전'}
                        nextLabel={isMobile ? '' : '다음'}
                        maxVisibleItems={isMobile ? 5 : 10}
                        compact={isMobile}
                        aria-label="구매한 이용권 페이지 이동"
                        className="justify-center"
                    />
                ) : null}
            </section>
        </div>
    )
}

export {PaidServiceHistory, PaidServiceRefundPreview, PaidServiceUsageHistoryPreview}
