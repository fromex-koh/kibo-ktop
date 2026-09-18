'use client'

import {useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import {ChevronRight} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {EmptyState} from '@/components/composite/empty-state'
import {Pagination} from '@/components/composite/pagination'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {InlineSeparator} from '@/components/composite/inline-separator'
import {Separator} from '@/components/ui/separator'
import {useIsMobile} from '@/hooks/use-mobile'
import {INQUIRY_STATUS, type InquiryStatus, type InquiryType} from '@/constants/inquiry'

// 1:1 문의 내역 목록 — Figma "[마이페이지] 1:1 문의내역_목록".
// 구성은 기존 컴포넌트 조합이다: BaseCard(흰 면·radius 16) · Separator(항목 구분선) · Badge(답변 상태) ·
// Pagination(페이지 이동). 공지사항 목록(notice-list)과 같은 틀이고, 한 줄에 담기는 것만 다르다.
// 페이지 상태를 들고 있어야 해서 client 로 두고, 화면(page.tsx)은 서버 컴포넌트로 유지한다.
// 목록 데이터는 page.tsx에서 items props로 전달받고, pageSize 기준으로 현재 페이지 항목을 잘라 표시한다.
//
// 기업·기관이 같은 화면을 쓴다 — 다른 것은 목록 데이터와 이동 경로뿐이라 화면이 props 로 넘긴다.

type InquiryItem = {
    id: string
    /** 문의 유형. 제목 앞에 세로 구분선과 함께 놓인다 — 문의하기 화면의 [유형 선택]과 같은 값이다. */
    category: InquiryType
    title: string
    status: InquiryStatus
    /** 등록일(YYYY-MM-DD). */
    date: string
    /** 이 문의를 눌렀을 때 가는 상세 화면. 문의마다 다르므로 목록이 아니라 항목이 들고 있는다. */
    href: string
}

type InquiryListProps = {
    items: readonly InquiryItem[]
    /** [문의 등록] 이 가는 화면. 이 버튼은 목록에 하나뿐이라 여기서 받는다. */
    createHref: string
    pageSize?: number
}

const InquiryList = ({items, createHref, pageSize = 10}: InquiryListProps) => {
    const [page, setPage] = useState(1)
    const resolvedPageSize = Math.max(pageSize, 1)
    const totalPages = Math.max(Math.ceil(items.length / resolvedPageSize), 1)
    const currentPage = Math.min(page, totalPages)
    const visibleItems = items.slice((currentPage - 1) * resolvedPageSize, currentPage * resolvedPageSize)

    // 시안(1200px)의 페이지 이동을 좁은 화면에 그대로 두면 한 줄을 넘겨 가로 스크롤이 생긴다.
    // 작은 화면에서는 현재 페이지 양옆 번호를 줄이고 이전·다음은 화살표만 남긴다.
    const isMobile = useIsMobile()

    // 페이지를 넘기면 목록의 맨 위로 되돌린다 — 화면 맨 위까지 올라가면 조회 조건을 다시 지나쳐야 해서
    // 방금 넘긴 목록이 어디서 시작하는지 찾기 어렵다. 목록 머리(총 N건)가 상단 바 아래에 오도록 맞춘다
    // (자리 확보는 아래 scroll-mt-* 가 한다).
    const listRef = useRef<HTMLDivElement>(null)
    const isFirstRenderRef = useRef(true)

    useEffect(() => {
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false

            return
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        listRef.current?.scrollIntoView({block: 'start', behavior: prefersReducedMotion ? 'auto' : 'smooth'})
    }, [currentPage])

    return (
        <div className="flex flex-col gap-10">
            {/* 목록 머리가 상단 바에 가리지 않게 띄우는 거리(바 높이 + 16)
              · md 미만 — 헤더(56) 아래에 마이페이지 메뉴 드롭다운 줄(152)까지 붙어 208 → 224(scroll-mt-56)
              · md~xl — 드롭다운 줄은 붙지 않고 헤더(100)만 → 112(scroll-mt-28)
              · xl 이상 — 헤더(112) → 128(scroll-mt-32) */}
            <div ref={listRef} className="flex scroll-mt-56 flex-col gap-4 md:scroll-mt-28 xl:scroll-mt-32">
                {/* 건수와 [문의 등록] 이 한 줄에 온다(시안). 좁은 화면에서는 버튼이 아래로 내려간다. */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* 건수만 굵고 브랜드 색이다(시안) — 몇 건인지가 이 줄에서 읽을 값이다. */}
                    <p className="typo-body-xl-regular text-foreground">
                        총 <span className="typo-body-xl-bold text-primary-strong">{items.length}</span>건
                    </p>
                    <Button asChild variant="secondary" size="xs">
                        <Link href={createHref}>문의 등록</Link>
                    </Button>
                </div>

                {visibleItems.length > 0 ? (
                    /* 카드 세로 여백 32 · 가로 24, 항목 사이 24 와 구분선 — 공지사항 목록과 같은 값이다(시안). */
                    <BaseCard className="py-8">
                        <ul className="flex flex-col">
                            {visibleItems.map((item, index) => {
                                const status = INQUIRY_STATUS[item.status]

                                return (
                                    <li key={item.id} className="flex flex-col">
                                        {/* 구분선은 항목 사이에만 둔다 — 마지막 항목 아래 선은 카드 여백이 대신한다. */}
                                        {index > 0 ? <Separator className="my-6" /> : null}
                                        {/* 글 묶음과 화살표 사이 24 — 시안 실측(글 영역 700 · 화살표 724~744).
                                            제목이 길어도 이 간격은 줄지 않는다(글 묶음이 대신 좁아진다). */}
                                        <Link
                                            href={item.href}
                                            scroll={false}
                                            className="group/inquiry outline-ring rounded-2xs flex items-center gap-6 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid"
                                        >
                                            <span className="flex min-w-0 flex-1 flex-col gap-2">
                                                {/* 제목은 말줄임하지 않고 줄바꿈해 모두 보인다. 상태 배지는 제목 글 끝에
                                                    이어 붙는다(인라인). 분류·구분선은 왼쪽에 고정하고 제목 첫 줄과
                                                    글자 기준선을 맞춘다(items-baseline).
                                                    모바일(md 미만)은 폭이 좁아 분류를 제목 위 줄로 올리고 구분선은 감춘다. */}
                                                <span className="flex min-w-0 flex-col gap-1 md:flex-row md:items-baseline md:gap-0">
                                                    <span className="flex shrink-0 items-center gap-x-1">
                                                        <span className="typo-body-xl-regular text-label-foreground">
                                                            {item.category}
                                                        </span>
                                                        {/* 좌우 16 은 이 구분선의 기본 여백 12 와 gap 4 가 합쳐진 값이다. */}
                                                        <InlineSeparator
                                                            inline
                                                            className="mx-3 data-vertical:self-center max-md:hidden"
                                                        />
                                                    </span>
                                                    <span className="typo-title-m-medium text-foreground min-w-0 flex-1 break-keep">
                                                        <span className="group-hover/inquiry:underline">
                                                            {item.title}
                                                        </span>
                                                        <Badge
                                                            variant="solid-pastel"
                                                            color={status.color}
                                                            shape="round"
                                                            className="ml-2 align-middle"
                                                        >
                                                            {status.label}
                                                        </Badge>
                                                    </span>
                                                </span>
                                                <span className="typo-body-l-regular text-foreground-subtle">
                                                    {item.date}
                                                </span>
                                            </span>
                                            <ChevronRight aria-hidden="true" className="size-icon-md shrink-0" />
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </BaseCard>
                ) : (
                    <EmptyState title="등록된 문의가 없습니다." className="bg-card rounded-lg" />
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
        </div>
    )
}

export {InquiryList}
export type {InquiryItem, InquiryListProps}
