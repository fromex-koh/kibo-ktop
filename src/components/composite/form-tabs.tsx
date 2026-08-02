'use client'

import type {ComponentProps, ReactNode} from 'react'
import type {LucideIcon} from 'lucide-react'
import {CircleCheck, MessageCircleMore} from 'lucide-react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {
    formTabsAccentClassName,
    formTabsBodyClassName,
    formTabsContentClassName,
    formTabsIconClassName,
    formTabsListClassName,
    formTabsStatusVariants,
    formTabsTitleClassName,
    formTabsTriggerClassName,
} from '@/components/theme/form-tabs.variants'
import {cn} from '@/lib/utils'

// 폼 탭(FormTabs) — 긴 입력 폼을 섹션 단위로 나눠 보여주는 카드형 탭(L2 composite). Figma "탭 타이틀" 반영.
// 각 탭은 [섹션 제목 + 작성 상태 + 상태 아이콘] 을 담고, 선택된 탭 아래에 그 섹션의 폼(FormCard 등)이 온다.
// 탭 동작·접근성(roving tabindex · aria-controls · 좌우 화살표 이동)은 shadcn Tabs(Radix)를 그대로 쓴다[SC-03].
type FormTabStatus = 'done' | 'writing' | 'todo'

// 상태 문구·아이콘은 시안 고정값이다 — 작성완료(체크) · 작성중(말풍선) · 미작성(아이콘 없음).
const STATUS_LABEL: Record<FormTabStatus, string> = {
    done: '작성완료',
    writing: '작성중',
    todo: '미작성',
}

const STATUS_ICON: Record<FormTabStatus, LucideIcon | null> = {
    done: CircleCheck,
    writing: MessageCircleMore,
    todo: null,
}

type FormTabItem = {
    // 탭 식별 값(TabsTrigger ↔ TabsContent 연결).
    value: string
    // 섹션 제목.
    title: ReactNode
    // 작성 상태 — 문구와 아이콘이 함께 정해진다.
    status: FormTabStatus
    // 탭 본문. 시안에서는 FormCard 가 들어간다.
    content: ReactNode
}

type FormTabsProps = {
    items: readonly FormTabItem[]
    className?: string
} & Omit<ComponentProps<typeof Tabs>, 'children' | 'className'>

const FormTabs = ({items, className, defaultValue, ...props}: FormTabsProps) => (
    <Tabs defaultValue={defaultValue ?? items[0]?.value} className={cn('gap-0', className)} {...props}>
        <TabsList variant="plain" className={formTabsListClassName}>
            {items.map((item) => {
                const StatusIcon = STATUS_ICON[item.status]

                return (
                    <TabsTrigger key={item.value} value={item.value} className={formTabsTriggerClassName}>
                        <span aria-hidden="true" className={formTabsAccentClassName} />
                        <span className={formTabsBodyClassName}>
                            <span className="flex min-w-0 flex-col">
                                <span data-slot="form-tab-title" className={formTabsTitleClassName}>
                                    {item.title}
                                </span>
                                <span className={formTabsStatusVariants({status: item.status})}>
                                    {STATUS_LABEL[item.status]}
                                </span>
                            </span>
                            {StatusIcon ? <StatusIcon aria-hidden="true" className={formTabsIconClassName} /> : null}
                        </span>
                    </TabsTrigger>
                )
            })}
        </TabsList>
        {items.map((item) => (
            <TabsContent key={item.value} value={item.value} className={formTabsContentClassName}>
                {item.content}
            </TabsContent>
        ))}
    </Tabs>
)

export {FormTabs}
export type {FormTabsProps, FormTabItem, FormTabStatus}
