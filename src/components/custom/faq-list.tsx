'use client'

import {useEffect, useRef, useState} from 'react'
import Image from 'next/image'
import faqQuestionMark from '@public/images/faq/faq-question-mark.webp'
import {Pagination} from '@/components/composite/pagination'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {useIsMobile} from '@/hooks/use-mobile'

// 자주 묻는 질문 — 시안 "[알림마당] 자주 묻는 질문"(40006799:25911).
// 기존 컴포넌트 조합이다: Tabs(분류·pill-outline) · Accordion(질문·답변) · Separator · Pagination.
// 분류·펼침·페이지 상태를 들고 있어야 해서 client 로 두고, 화면(page.tsx)은 서버 컴포넌트로 유지한다.

type FaqCategory = {
    value: string
    label: string
}

type FaqItem = {
    id: string
    category: string
    question: string
    answer: string
}

type FaqListProps = {
    categories: readonly FaqCategory[]
    items: readonly FaqItem[]
    pageSize?: number
}

// 분류 하나에 해당하는 목록 — 아코디언과 페이지 이동을 함께 갖는다.
const FaqPanel = ({items, pageSize}: {items: readonly FaqItem[]; pageSize: number}) => {
    const [page, setPage] = useState(1)
    const totalPages = Math.max(Math.ceil(items.length / pageSize), 1)
    const currentPage = Math.min(page, totalPages)
    const visibleItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    const isMobile = useIsMobile()

    // 페이지를 넘기면 화면 맨 위로 되돌린다(목록 화면과 같은 규칙). 목록이 다시 그려진 뒤에 옮겨야
    // 이동 중 문서 높이가 바뀌어 브라우저가 부드러운 스크롤을 취소하는 일이 없다.
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
        <div className="flex flex-col gap-10">
            {/* 카드 모양·간격·구분선은 Accordion 의 프로젝트 기본 스타일이 갖는다(theme/accordion.variants). */}
            <Accordion type="single" collapsible>
                {visibleItems.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                        <AccordionTrigger>
                            <span className="flex min-w-0 items-center gap-2">
                                {/* 질문 표시는 시안의 'Q.' 이미지다. 질문 글이 바로 옆에 있어 장식으로 둔다. */}
                                <Image src={faqQuestionMark} alt="" sizes="24px" className="size-icon-lg shrink-0" />
                                <span className="min-w-0 break-keep">{item.question}</span>
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            {/* 답변 최소 높이 200 은 시안 표기다. 줄바꿈은 원문 그대로 살린다. */}
                            <div className="min-h-50 break-keep whitespace-pre-line">{item.answer}</div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

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

const FaqList = ({categories, items, pageSize = 10}: FaqListProps) => (
    // 분류 탭과 목록 사이는 시안 40 이다.
    <Tabs defaultValue={categories[0]?.value} className="gap-10">
        <TabsList variant="pill-outline" aria-label="자주 묻는 질문 분류">
            {categories.map((category) => (
                <TabsTrigger key={category.value} value={category.value}>
                    {category.label}
                </TabsTrigger>
            ))}
        </TabsList>
        {categories.map((category, index) => (
            <TabsContent key={category.value} value={category.value}>
                {/* 첫 번째 분류는 '전체'라 모든 질문을 보여준다. */}
                <FaqPanel
                    items={index === 0 ? items : items.filter((item) => item.category === category.value)}
                    pageSize={Math.max(pageSize, 1)}
                />
            </TabsContent>
        ))}
    </Tabs>
)

export {FaqList}
export type {FaqListProps, FaqCategory, FaqItem}
