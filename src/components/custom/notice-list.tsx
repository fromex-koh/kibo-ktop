'use client'

import {useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import {ChevronRight} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {EmptyState} from '@/components/composite/empty-state'
import {Pagination} from '@/components/composite/pagination'
import {SectionHeader, SectionHeaderTitle} from '@/components/composite/section-header'
import {InlineSeparator} from '@/components/composite/inline-separator'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {NOTICE_CATEGORY, type NoticeItem} from '@/components/custom/notice-category'
import {useIsMobile} from '@/hooks/use-mobile'

// 공지사항 목록 — 시안 "[알림마당] 공지사항"(40006759:28042).
// 구성은 기존 컴포넌트 조합이다: SectionHeader(제목) · BaseCard(흰 면·radius 16) · Badge(분류) ·
// Separator(항목 구분선) · Pagination(페이지 이동).
// 페이지 상태를 들고 있어야 해서 client 로 두고, 화면(page.tsx)은 서버 컴포넌트로 유지한다.
// 목록 데이터는 page.tsx에서 items props로 전달받고, pageSize 기준으로 현재 페이지 항목을 잘라 표시한다.

type NoticeListProps = {
    items: readonly NoticeItem[]
    pageSize?: number
}

const NoticeList = ({items, pageSize = 10}: NoticeListProps) => {
    const [page, setPage] = useState(1)
    const resolvedPageSize = Math.max(pageSize, 1)
    const totalPages = Math.max(Math.ceil(items.length / resolvedPageSize), 1)
    const currentPage = Math.min(page, totalPages)
    // 중요공지는 첫 페이지 맨 위로 올린다 — 게시판 목록의 일반적인 동작이다. 나머지는 받은 순서를
    // 그대로 둔다(sort 는 안정 정렬이라 최신순이 유지된다).
    // [프론트엔드 연동] 조회 API 가 이미 중요공지를 위로 정렬해 준다면 이 줄은 지워도 된다.
    const sortedItems = [...items].sort((left, right) => Number(right.isImportant) - Number(left.isImportant))
    const visibleItems = sortedItems.slice((currentPage - 1) * resolvedPageSize, currentPage * resolvedPageSize)

    // 시안(1200px)의 페이지 이동을 좁은 화면에 그대로 두면 한 줄을 넘겨 가로 스크롤이 생긴다.
    // 작은 화면에서는 현재 페이지 양옆 번호를 줄이고 이전·다음은 화살표만 남긴다.
    // 버튼 이름은 label 이 아니라 aria-label("이전 페이지"·"다음 페이지")이 제공하므로 글자를 빼도 읽힌다[5.1.1].
    const isMobile = useIsMobile()

    // 페이지를 넘기면 화면 맨 위로 되돌린다 — 아래쪽 페이지네이션을 누른 자리에서 목록이 바뀌면
    // 새 첫 항목이 화면 위로 벗어나 있어 매번 되돌아 올려야 한다(게시판 목록의 일반적인 동작).
    // 목록 상단이 아니라 페이지 상단으로 올려, 제목·브레드크럼부터 다시 보이게 한다.
    //
    // 클릭 핸들러가 아니라 effect 에서 옮긴다 — 핸들러에서 바로 부르면 목록이 다시 그려지기 전이라
    // 이동 중에 문서 높이가 바뀌고, 그 때 브라우저가 부드러운 스크롤을 취소한다. 특히 마지막(또는 첫)
    // 페이지로 가면서 이전·다음 버튼이 disabled 로 바뀌면 포커스까지 옮겨가 취소가 더 잘 일어난다.
    const isFirstRenderRef = useRef(true)

    useEffect(() => {
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false
            return
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth'})
    }, [currentPage])

    return (
        <section aria-labelledby="notice-list-title" className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
                <SectionHeader>
                    <SectionHeaderTitle id="notice-list-title">알려드립니다</SectionHeaderTitle>
                </SectionHeader>

                {/* 목록 자리에 최소 높이를 두지 않는다 — 한 페이지분(785px)을 미리 잡아 두면 마지막 페이지처럼
                    항목이 모자랄 때 페이지네이션이 화면 아래로 밀려 스크롤해야 눌 수 있다. 목록이 줄면
                    페이지네이션도 따라 올라온다(게시판 목록의 일반적인 동작). */}
                {visibleItems.length > 0 ? (
                    /* 카드 세로 여백은 32 다(Card 기본 24 를 사용처에서 덮는다). 시안은 위 32·아래 8 로 보이지만
                       마지막 항목 아래 구분선을 빼면 그 자리(24+선 1+8)가 아래 여백 32 가 되어 위아래가 같아진다.
                       가로 여백은 Card 기본값 24 로 시안과 같아 건드리지 않는다. */
                    <BaseCard className="py-8">
                        <ul className="flex flex-col">
                            {visibleItems.map((item, index) => {
                                return (
                                    <li key={item.id} className="flex flex-col">
                                        {/* 구분선은 항목 사이에만 둔다 — 마지막 항목 아래 선은 카드 여백이 대신한다. */}
                                        {index > 0 ? <Separator className="my-6" /> : null}
                                        {/* 글 묶음과 화살표 사이 40(시안). 제목이 길어 말줄임될 때도 이 간격은
                                            줄지 않는다 — 배지가 화살표에 붙지 않도록 글 묶음이 대신 좁아진다.
                                            좁은 화면에서는 40 을 그대로 두면 그만큼이 제목에서 빠지므로 16 으로 줄인다. */}
                                        <Link
                                            href={item.href}
                                            scroll={false}
                                            className="group/notice outline-ring rounded-2xs flex items-center gap-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid md:gap-10"
                                        >
                                            {/* 넓은 화면에서는 분류·제목·표시가 한 줄이다(시안). 좁은 화면(360)에서는 분류와
                                                구분선이 가로폭을 70 남짓 가져가, 배지까지 붙은 글은 제목이 몇 글자만 남는다 —
                                                분류를 윗줄로 빼서 제목에 한 줄을 통째로 내준다. */}
                                            <div className="flex min-w-0 flex-1 flex-col gap-y-1 md:flex-row md:items-center md:gap-x-1">
                                                <span className="typo-body-xl-regular text-label-foreground shrink-0">
                                                    {NOTICE_CATEGORY[item.category]}
                                                </span>
                                                {/* 좌우 16 은 이 구분선의 기본 여백 12 와 줄의 gap 4 가 합쳐진 값이다.
                                                    줄이 갈라지는 좁은 화면에는 가를 것이 없어 감춘다. */}
                                                <InlineSeparator className="max-md:hidden" />
                                                {/* 제목과 표시는 분류가 윗줄로 빠져도 서로 붙어 다닌다. 넓은 화면은 시안대로
                                                    한 줄 말줄임이다. 좁은 화면에서는 배지를 옆 칸에 세우지 않고 제목 글 흐름에
                                                    이어 붙여 두 줄까지 늘인다 — 칸을 나누면 제목이 배지 폭만큼 좁아진 채 두 줄이
                                                    되고, 짧아진 글 옆에 배지만 덩그러니 뜬다. */}
                                                <span className="min-w-0 max-md:line-clamp-2 md:flex md:items-center md:gap-x-1">
                                                    <span className="typo-title-m-medium text-foreground min-w-0 group-hover/notice:underline md:truncate">
                                                        {item.title}
                                                    </span>
                                                    {item.isImportant ? (
                                                        <Badge
                                                            color="error"
                                                            shape="round"
                                                            className="max-md:ml-1 max-md:align-middle"
                                                        >
                                                            중요공지
                                                        </Badge>
                                                    ) : null}
                                                    {/* 새 글 표시 — 글자 N 만으로는 뜻이 전해지지 않아 말로도 알린다[5.1.1]. */}
                                                    {item.isNew ? (
                                                        <Badge
                                                            type="number"
                                                            color="new"
                                                            className="max-md:ml-1 max-md:align-middle"
                                                        >
                                                            <span aria-hidden="true">N</span>
                                                            <span className="sr-only">새 글</span>
                                                        </Badge>
                                                    ) : null}
                                                </span>
                                            </div>
                                            <ChevronRight aria-hidden="true" className="size-icon-md shrink-0" />
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </BaseCard>
                ) : (
                    /* 시안의 빈 목록은 아이콘 + 한 줄 안내만 둔다(높이 360 은 EmptyState 기본값). */
                    <EmptyState title="등록된 공지사항이 없습니다." className="bg-card rounded-lg" />
                )}
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
export type {NoticeCategory, NoticeItem} from '@/components/custom/notice-category'
