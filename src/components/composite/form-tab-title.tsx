'use client'

import type {ComponentProps, ReactNode} from 'react'
import type {LucideIcon} from 'lucide-react'
import {ChevronDown, CircleCheck, MessageCircleMore} from 'lucide-react'
import {Slot} from 'radix-ui'
import {
    formTabTitleAccentClassName,
    formTabTitleBodyClassName,
    formTabTitleChevronClassName,
    formTabTitleColumnVariants,
    formTabTitleIconBoxClassName,
    formTabTitleIconClassName,
    formTabTitleStatusVariants,
    formTabTitleTextClassName,
    formTabTitleVariants,
} from '@/components/theme/form-tab-title.variants'
import {cn} from '@/lib/utils'

// 탭 타이틀(FormTabTitle) — 폼 탭 한 칸이다. Figma "탭 타이틀" 섹션의 모든 경우를 담는다.
// [섹션 제목 + 작성 상태 문구 + 상태 아이콘]을 카드 면 위에 올리고, 선택된 칸에는 좌측 액센트 바가 붙는다.
// 제목 줄 수(1~2줄)는 내용에 따라 늘어나고, 목록 안에서는 가장 높은 칸에 나머지 칸이 맞춰진다.
// 탭으로 쓸 때는 asChild 로 TabsTrigger 에 얹어 동작·접근성을 Radix 에 맡긴다(FormTabs 참고).
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

type FormTabTitleProps = {
    // 섹션 제목. 줄바꿈이 필요하면 두 줄로 감싸도 된다.
    title: ReactNode
    // 작성 상태 — 문구와 아이콘이 함께 정해진다.
    status?: FormTabStatus
    // 선택 상태. Tabs 안에서는 Radix 가 data-state 로 알려주므로 넘기지 않는다.
    active?: boolean
    // 놓이는 자리 — tab(가로 탭 칸) · row(세로 목록의 카드 행) · bar(면 없는 한 줄).
    variant?: 'tab' | 'row' | 'bar'
    // 오른쪽 끝에 펼침 아이콘을 붙인다 — 누르면 펼쳐지거나 목록이 열리는 자리에만 쓴다.
    chevron?: boolean
    // 탭(TabsTrigger) 등 다른 요소에 이 생김새를 얹는다. 이때 children 이 그 대상 요소다.
    asChild?: boolean
} & Omit<ComponentProps<'button'>, 'title'>

const FormTabTitle = ({
    title,
    status = 'todo',
    active,
    variant = 'tab',
    chevron,
    asChild,
    children,
    className,
    type = 'button',
    ...props
}: FormTabTitleProps) => {
    const StatusIcon = STATUS_ICON[status]
    const Comp = asChild ? Slot.Root : 'button'
    // 값이 없을 때 키 자체를 만들지 않는다 — asChild 로 넘길 때 undefined 가 Radix 의 상태를 덮어쓴다.
    const activeProps = active === undefined ? {} : {'data-active': active}
    // 얹히는 요소(TabsTrigger 등)는 자기 data-slot 을 쓰므로 단독으로 쓸 때만 표식을 붙인다.
    const slotProps = asChild ? {} : {'data-slot': 'form-tab-title'}

    return (
        <Comp
            {...slotProps}
            data-status={status}
            {...activeProps}
            type={type}
            className={cn(formTabTitleVariants({variant}), className)}
            {...props}
        >
            {/* asChild 일 때 얹을 대상은 children 이고, 아래 본문은 그 요소의 내용이 된다(Radix Slottable). */}
            {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : null}
            <span className={formTabTitleBodyClassName}>
                <span aria-hidden="true" className={formTabTitleAccentClassName} />
                <span className={formTabTitleColumnVariants({variant})}>
                    <span data-slot="form-tab-title-text" className={formTabTitleTextClassName}>
                        {title}
                    </span>
                    <span className={formTabTitleStatusVariants({status})}>{STATUS_LABEL[status]}</span>
                </span>
                {StatusIcon ? (
                    <span className={formTabTitleIconBoxClassName}>
                        <StatusIcon aria-hidden="true" className={formTabTitleIconClassName} />
                    </span>
                ) : null}
                {chevron ? <ChevronDown aria-hidden="true" className={formTabTitleChevronClassName} /> : null}
            </span>
        </Comp>
    )
}

export {FormTabTitle}
export type {FormTabTitleProps, FormTabStatus}
