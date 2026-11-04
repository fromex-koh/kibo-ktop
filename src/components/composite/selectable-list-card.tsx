'use client'

import {useId, useRef, type ComponentProps, type PointerEvent, type ReactNode} from 'react'
import {ChevronRight} from 'lucide-react'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {getNameBreakClassName} from '@/lib/name-break'
import {cn} from '@/lib/utils'

// 선택 목록 카드(SelectableListCard) — 검색 결과처럼 건수가 많은 목록에서 한 건을 고르는 한 줄 카드다.
// 왼쪽 라디오 · 가운데 제목과 항목(이름 + 값) · 오른쪽 값(건수 등)과 화살표. 목록은 늘 1열이다.
// 카드 어디를 눌러도 고를 수 있고, 카드 안 글이 곧 라디오의 이름이다(aria-labelledby). <label> 로 감싸지 않는다 — 라디오가 button 이라
// WAVE 가 'Orphaned form label' 로 잡는다. 빈 영역 클릭은 SelectableCard 와 같이 라디오로 넘긴다[8.1.1].
// 긴 글 — 말줄임 없이 카드가 높아진다. 제목은 getNameBreakClassName, 값은 낱말 단위로 값 칸 안에서 줄을 바꾼다.
// 오른쪽 값은 줄지 않고, 제목 칸(최소 160)과 한 줄에 들어가지 않으면 아래 줄로 내려간다. 좁은 화면(md 미만)은 라디오를 첫 줄에 맞춘다.
// 고르면 테두리 · 면이 primary 로 바뀌고 라디오 표시로도 전한다[5.3.1]. 화살표는 꾸밈이라 좁은 화면(md 미만)에서는 뺀다.

type SelectableListCardField = {
    label: string
    value: string
}

const SelectableListCardGroup = ({className, ...props}: ComponentProps<typeof RadioGroup>) => (
    <RadioGroup data-slot="selectable-list-card-group" className={cn('gap-2', className)} {...props} />
)

type SelectableListCardProps = {
    value: string
    /** 제목 — 16 Bold. 띄어쓰기가 없으면 글자 사이에서 줄을 바꾼다. */
    title: string
    /** 제목 옆 표시(자사 등). */
    badge?: ReactNode
    /** 제목 아래 줄들 — 한 줄에 항목 여러 개를 이어 놓고, 폭이 모자라면 항목 단위로 접는다. */
    fieldRows?: readonly (readonly SelectableListCardField[])[]
    /** 오른쪽 값(건수 등). */
    trailing?: ReactNode
    /** 오른쪽 끝 화살표 — 고르면 아래 내용이 이어진다는 표시다. */
    hasChevron?: boolean
    disabled?: boolean
    id?: string
    className?: string
}

const SelectableListCard = ({
    value,
    title,
    badge,
    fieldRows,
    trailing,
    hasChevron = false,
    disabled,
    id,
    className,
}: SelectableListCardProps) => {
    const controlRef = useRef<HTMLButtonElement>(null)
    const contentId = useId()

    const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
        const controlElement = controlRef.current
        if (!controlElement) return
        if (event.target instanceof Node && controlElement.contains(event.target)) return
        controlElement.click()
    }

    return (
        <div
            data-slot="selectable-list-card"
            onPointerUp={handlePointerUp}
            className={cn(
                'border-subtle-3 bg-card has-data-checked:border-primary has-data-checked:bg-primary-subtle interactive:hover:border-primary has-[:focus-visible]:outline-ring flex cursor-pointer items-start gap-3 rounded-md border px-4 py-4 transition-colors has-disabled:cursor-not-allowed has-disabled:opacity-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 md:items-center md:gap-4 md:px-5',
                className,
            )}
        >
            <RadioGroupItem
                ref={controlRef}
                id={id}
                value={value}
                disabled={disabled}
                aria-labelledby={contentId}
                className="focus-visible:outline-none"
            />
            <span id={contentId} className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex max-w-full min-w-0 grow basis-40 flex-col gap-1">
                    <span className="typo-body-xl-bold text-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className={cn('min-w-0 wrap-anywhere', getNameBreakClassName(title))}>{title}</span>
                        {badge}
                    </span>
                    {fieldRows?.map((row) => (
                        <span
                            key={row[0]?.label}
                            className="typo-body-l-regular text-label-foreground flex flex-wrap gap-x-5 gap-y-1"
                        >
                            {row.map((field) => (
                                // 이름 | 값 두 칸 — 값이 길면 값 칸 안에서만 줄을 바꿔, 둘째 줄도 값 첫 글자에 맞춰 선다.
                                // 줄바꿈은 제목과 같은 규칙(getNameBreakClassName) — 띄어쓰기 없는 긴 값(가린 이름 '알*산더…')은
                                // 줄을 채운 뒤 글자 사이에서 끊어, '*' 뒤에서 한 글자만 남고 갈리지 않는다.
                                <span key={field.label} className="flex max-w-full min-w-0 gap-2">
                                    <span className="text-foreground-subtle shrink-0 whitespace-nowrap">
                                        {field.label}
                                    </span>
                                    <span className={cn('min-w-0 wrap-anywhere', getNameBreakClassName(field.value))}>
                                        {field.value}
                                    </span>
                                </span>
                            ))}
                        </span>
                    ))}
                </span>
                {trailing != null ? (
                    <span className="typo-body-l-regular text-foreground-subtle shrink-0 whitespace-nowrap">
                        {trailing}
                    </span>
                ) : null}
            </span>
            {hasChevron ? (
                <ChevronRight
                    aria-hidden="true"
                    className="size-icon-md text-foreground-subtle hidden shrink-0 md:block"
                />
            ) : null}
        </div>
    )
}

export {SelectableListCard, SelectableListCardGroup}
export type {SelectableListCardField, SelectableListCardProps}
