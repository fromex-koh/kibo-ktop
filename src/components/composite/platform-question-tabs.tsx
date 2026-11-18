'use client'

import {Check} from 'lucide-react'
import {platformCardClassName, platformQuestionTriggerClassName} from '@/components/theme/platform-intro.variants'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {cn} from '@/lib/utils'

// 질문 탭 — 질문 카드(탭)를 고르면 아래 답변 칸이 바뀐다. 플랫폼 소개 · 질문으로 알아보는 K-TOP.
// 질문 칸은 PC(1280↑) 6칸 한 줄, 태블릿 3칸, 모바일 2칸. 답변 칸은 PC 에서 [번호 · 질문 | 답변 목록] 두 칸이다.
// 탭 역할(tablist · tab · tabpanel), 방향키 · Home · End 이동, aria-selected 는 Radix Tabs(ui/tabs)가 맡는다[8.2.1].

type PlatformQuestion = {
    id: string
    question: string
    answers: readonly string[]
}

const orderOf = (index: number) => String(index + 1).padStart(2, '0')

const PlatformQuestionTabs = ({
    items,
    label,
    className,
}: {
    items: readonly PlatformQuestion[]
    /** 질문 목록 이름(낭독기). */
    label: string
    className?: string
}) => (
    <Tabs defaultValue={items[0]?.id} className={cn('gap-5', className)}>
        <TabsList
            variant="plain"
            aria-label={label}
            className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3 xl:grid-cols-6"
        >
            {items.map((item, index) => (
                <TabsTrigger key={item.id} value={item.id} className={platformQuestionTriggerClassName}>
                    <span
                        aria-hidden="true"
                        className="typo-body-l-bold text-platform-accent-foreground in-data-[state=active]:text-white"
                    >
                        {orderOf(index)}
                    </span>
                    <span className="typo-title-m-bold break-keep">{item.question}</span>
                </TabsTrigger>
            ))}
        </TabsList>
        {items.map((item, index) => (
            <TabsContent
                key={item.id}
                value={item.id}
                className={cn(
                    platformCardClassName,
                    'grid items-center gap-5 p-6 md:p-9 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] xl:gap-10',
                )}
            >
                <div className="flex flex-col gap-1.5">
                    <span aria-hidden="true" className="typo-display-m-bold text-platform-accent-foreground">
                        {orderOf(index)}
                    </span>
                    <h3 className="typo-title-xl-bold text-foreground break-keep">{item.question}</h3>
                </div>
                <ul className="flex flex-col gap-2.5">
                    {item.answers.map((answer) => (
                        <li
                            key={answer}
                            className="typo-body-xl-medium bg-platform-panel-inset text-foreground flex items-start gap-3 rounded-md px-4 py-3.5 break-keep md:px-5 md:py-4"
                        >
                            <Check
                                aria-hidden="true"
                                className="text-platform-accent-foreground size-icon-md mt-0.5 shrink-0"
                            />
                            {answer}
                        </li>
                    ))}
                </ul>
            </TabsContent>
        ))}
    </Tabs>
)

export {PlatformQuestionTabs}
export type {PlatformQuestion}
