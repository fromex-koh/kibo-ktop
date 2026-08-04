'use client'

import {useState} from 'react'
import Link from 'next/link'
import {ChevronRight} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {EmptyState} from '@/components/composite/empty-state'
import {Pagination} from '@/components/composite/pagination'
import {SectionHeader, SectionHeaderTitle} from '@/components/composite/section-header'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {useIsMobile} from '@/hooks/use-mobile'

// 공지사항 목록 — 시안 "[알림마당] 공지사항"(40006759:28042).
// 구성은 기존 컴포넌트 조합이다: SectionHeader(제목) · BaseCard(흰 면·radius 16) · Badge(분류) ·
// Separator(항목 구분선) · Pagination(페이지 이동).
// 페이지 상태를 들고 있어야 해서 client 로 두고, 화면(page.tsx)은 서버 컴포넌트로 유지한다.
// 목록 데이터는 page.tsx에서 items props로 전달받고, pageSize 기준으로 현재 페이지 항목을 잘라 표시한다.

// 공지 분류 — 색은 시안 배지와 1:1 로 맞춘 기존 팔레트다(중요공지 error · 일반공고 info · 사업공고 purple).
const NOTICE_CATEGORY = {
    important: {label: '중요공지', color: 'error'},
    general: {label: '일반공고', color: 'info'},
    business: {label: '사업공고', color: 'secondary-purple'},
} as const

export type NoticeCategory = keyof typeof NOTICE_CATEGORY

export type NoticeItem = {
    id: string
    category: NoticeCategory
    title: string
}

type NoticeListProps = {
    items: readonly NoticeItem[]
    detailHref: string
    pageSize?: number
}

const NoticeList = ({items, detailHref, pageSize = 4}: NoticeListProps) => {
    const [page, setPage] = useState(1)
    const resolvedPageSize = Math.max(pageSize, 1)
    const totalPages = Math.max(Math.ceil(items.length / resolvedPageSize), 1)
    const currentPage = Math.min(page, totalPages)
    const visibleItems = items.slice((currentPage - 1) * resolvedPageSize, currentPage * resolvedPageSize)

    // 시안(1200px)의 페이지 이동을 좁은 화면에 그대로 두면 한 줄을 넘겨 가로 스크롤이 생긴다.
    // 작은 화면에서는 현재 페이지 양옆 번호를 줄이고 이전·다음은 화살표만 남긴다.
    // 버튼 이름은 label 이 아니라 aria-label("이전 페이지"·"다음 페이지")이 제공하므로 글자를 빼도 읽힌다[5.1.1].
    const isMobile = useIsMobile()

    return (
        <section aria-labelledby="notice-list-title" className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
                <SectionHeader>
                    <SectionHeaderTitle id="notice-list-title">알려드립니다</SectionHeaderTitle>
                </SectionHeader>

                {/* 목록 자리는 한 페이지가 가득 찬 높이(size.notice-list-min-h = 323px = 32+28×4+49×3+32)로
                    미리 잡아 둔다 — 마지막 페이지처럼 항목이 모자랄 때 아래 페이지네이션이 위로 딸려 올라가지 않는다.
                    최소 높이는 카드가 아니라 이 자리(상위 요소)에 준다. 카드에 주면 항목이 적을 때 카드가
                    빈 흰 면으로 늘어난다. */}
                <div className="min-h-notice-list-min-h">
                    {visibleItems.length > 0 ? (
                        /* 카드 세로 여백은 32 다(Card 기본 24 를 사용처에서 덮는다). 시안은 위 32·아래 8 로 보이지만
                           마지막 항목 아래 구분선을 빼면 그 자리(24+선 1+8)가 아래 여백 32 가 되어 위아래가 같아진다.
                           가로 여백은 Card 기본값 24 로 시안과 같아 건드리지 않는다. */
                        <BaseCard className="py-8">
                            <ul className="flex flex-col">
                                {visibleItems.map((item, index) => {
                                    const category = NOTICE_CATEGORY[item.category]

                                    return (
                                        <li key={item.id} className="flex flex-col">
                                            {/* 구분선은 항목 사이에만 둔다 — 마지막 항목 아래 선은 카드 여백이 대신한다. */}
                                            {index > 0 ? <Separator className="my-6" /> : null}
                                            <Link
                                                href={detailHref}
                                                className="group/notice outline-ring rounded-2xs flex items-center gap-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid"
                                            >
                                                <Badge color={category.color} shape="round">
                                                    {category.label}
                                                </Badge>
                                                <span className="typo-title-m-medium text-foreground min-w-0 flex-1 truncate group-hover/notice:underline">
                                                    {item.title}
                                                </span>
                                                <ChevronRight aria-hidden="true" className="size-icon-md shrink-0" />
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </BaseCard>
                    ) : (
                        <EmptyState
                            title="등록된 공지사항이 없습니다."
                            description="새로운 공지사항이 등록되면 이곳에 표시됩니다."
                            className="bg-card min-h-notice-list-min-h rounded-lg"
                        />
                    )}
                </div>
            </div>

            {items.length > 0 ? (
                <Pagination
                    page={currentPage}
                    total={totalPages}
                    onPageChange={setPage}
                    siblingCount={isMobile ? 0 : 1}
                    prevLabel={isMobile ? '' : '이전'}
                    nextLabel={isMobile ? '' : '다음'}
                    maxVisibleItems={isMobile ? 5 : 10}
                    compact={isMobile}
                    className="justify-center"
                />
            ) : null}
        </section>
    )
}

export {NoticeList}
export type {NoticeListProps}
