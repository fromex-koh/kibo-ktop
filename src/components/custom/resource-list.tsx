'use client'

import {useEffect, useRef, useState} from 'react'
import {Download} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {EmptyState} from '@/components/composite/empty-state'
import {InlineSeparator} from '@/components/composite/inline-separator'
import {Pagination} from '@/components/composite/pagination'
import {SectionHeader, SectionHeaderTitle} from '@/components/composite/section-header'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import {useIsMobile} from '@/hooks/use-mobile'

// 자료실 목록 — 시안 "[알림마당] 자료실"(40007386:80392).
// 구성은 기존 컴포넌트 조합이다: SectionHeader(제목) · BaseCard(흰 면·radius 16) · InlineSeparator(분류│제목) ·
// Button(다운로드) · Separator(항목 구분선) · Pagination(페이지 이동). 공지사항 목록과 같은 골격이고
// 줄 끝에 오는 것만 다르다(공지는 배지와 화살표, 자료실은 다운로드 버튼).
// 페이지 상태를 들고 있어야 해서 client 로 두고, 화면(page.tsx)은 서버 컴포넌트로 유지한다.

// 분류 — 시안이 배지가 아니라 제목 앞의 글자로 두므로 색 없이 이름만 갖는다(공지사항 목록과 같다).
const RESOURCE_CATEGORY = {
    guide: '이용안내',
    form: '신청서식',
} as const satisfies Record<string, string>

type ResourceCategory = keyof typeof RESOURCE_CATEGORY

type ResourceItem = {
    id: string
    category: ResourceCategory
    title: string
    // 내려받을 파일 경로. 실제 연동 시 파일 서버 URL로 교체한다.
    href: string
}

type ResourceListProps = {
    items: readonly ResourceItem[]
    pageSize?: number
}

// 모바일은 제목 전체 너비를 확보하고 다운로드 버튼을 아래 왼쪽에 배치한다.
const ResourceRow = ({item}: {item: ResourceItem}) => (
    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-y-1 max-md:w-full md:flex-row md:items-center md:gap-x-1">
            <span className="typo-body-xl-regular text-label-foreground shrink-0">
                {RESOURCE_CATEGORY[item.category]}
            </span>
            <InlineSeparator className="max-md:hidden" />
            <span className="typo-title-m-medium text-foreground min-w-0 wrap-anywhere">{item.title}</span>
        </div>
        <Button asChild variant="tertiary" size="xs" className="shrink-0" aria-label={`${item.title} 다운로드`}>
            <a href={item.href} download>
                <Download aria-hidden="true" />
                다운로드
            </a>
        </Button>
    </div>
)

const ResourceList = ({items, pageSize = 10}: ResourceListProps) => {
    const [page, setPage] = useState(1)
    const resolvedPageSize = Math.max(pageSize, 1)
    const totalPages = Math.max(Math.ceil(items.length / resolvedPageSize), 1)
    const currentPage = Math.min(page, totalPages)
    const visibleItems = items.slice((currentPage - 1) * resolvedPageSize, currentPage * resolvedPageSize)

    // 좁은 화면에서는 현재 페이지 양옆 번호를 줄이고 이전·다음은 화살표만 남긴다(공지사항 목록과 같은 규칙).
    const isMobile = useIsMobile()

    // 페이지를 넘기면 화면 맨 위로 되돌린다. 목록이 다시 그려진 뒤에 옮겨야 이동 중 문서 높이가 바뀌어
    // 브라우저가 부드러운 스크롤을 취소하는 일이 없다(공지사항 목록과 같은 이유).
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
        <section aria-labelledby="resource-list-title" className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
                <SectionHeader>
                    <SectionHeaderTitle id="resource-list-title">필요한 자료를 모아봤어요</SectionHeaderTitle>
                </SectionHeader>

                {visibleItems.length > 0 ? (
                    /* 카드 세로 여백 32(py-8), 가로 여백은 Card 기본값 24 — 공지사항 목록과 같은 규칙이다. */
                    <BaseCard className="py-8">
                        <ul className="flex flex-col">
                            {visibleItems.map((item, index) => (
                                <li key={item.id} className="flex flex-col">
                                    {/* 구분선은 항목 사이에만 둔다 — 마지막 항목 아래 선은 카드 여백이 대신한다. */}
                                    {index > 0 ? <Separator className="my-6" /> : null}
                                    <ResourceRow item={item} />
                                </li>
                            ))}
                        </ul>
                    </BaseCard>
                ) : (
                    <EmptyState title="등록된 자료가 없습니다." className="bg-card rounded-lg" />
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

export {ResourceList, RESOURCE_CATEGORY}
export type {ResourceListProps, ResourceItem, ResourceCategory}
