'use client'

import {useId, useRef, type KeyboardEvent} from 'react'
import {cn} from '@/lib/utils'

// 텍스트 탭(TextTabs) — 면·밑줄 없이 글자만으로 고르는 탭(시안 "tap_1depth").
// 고른 항목은 진한 글자(gray.700)이고 나머지는 옅다(gray.500).
//
// 색만으로는 어느 것이 골라졌는지 전해지지 않으므로 aria-selected 로 함께 알린다[5.3.1 · 8.2.1].
// 좌우 화살표로 탭을 옮기고 탭 묶음에는 포커스가 한 번만 들어간다(roving tabindex) — 탭의 표준 동작이다.
// 고른 값이 무엇을 바꾸는지는 aria-controls 로 잇는다(패널 id 를 사용처가 넘긴다).

type TextTabItem = {value: string; label: string}

type TextTabsProps = {
    items: readonly TextTabItem[]
    value: string
    onValueChange: (value: string) => void
    /** 이 탭 묶음이 무엇을 고르는지 — 스크린리더가 읽을 이름이다. */
    label: string
    /** 탭이 바꾸는 영역의 id. 그 영역에는 role="tabpanel" 을 둔다. */
    panelId: string
    className?: string
}

const TextTabs = ({items, value, onValueChange, label, panelId, className}: TextTabsProps) => {
    const baseId = useId()
    const listRef = useRef<HTMLDivElement>(null)

    const moveFocus = (nextIndex: number) => {
        const next = items[(nextIndex + items.length) % items.length]
        onValueChange(next.value)
        listRef.current?.querySelector<HTMLButtonElement>(`#${CSS.escape(`${baseId}-${next.value}`)}`)?.focus()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        if (event.key === 'ArrowRight') moveFocus(index + 1)
        else if (event.key === 'ArrowLeft') moveFocus(index - 1)
        else if (event.key === 'Home') moveFocus(0)
        else if (event.key === 'End') moveFocus(items.length - 1)
        else return

        event.preventDefault()
    }

    return (
        // 좁은 화면에서는 네 모형이 한 줄에 들어가지 않아 접힌다 — 접힌 줄 사이는 좁게 둬 한 묶음으로 읽힌다.
        <div
            ref={listRef}
            role="tablist"
            aria-label={label}
            className={cn('flex flex-wrap gap-x-6 gap-y-3', className)}
        >
            {items.map((item, index) => {
                const isSelected = item.value === value

                return (
                    <button
                        key={item.value}
                        id={`${baseId}-${item.value}`}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        aria-controls={panelId}
                        tabIndex={isSelected ? 0 : -1}
                        onClick={() => onValueChange(item.value)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                        className={cn(
                            'typo-title-l-bold outline-ring rounded-2xs outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid',
                            isSelected ? 'text-label-foreground' : 'text-foreground-subtle',
                        )}
                    >
                        {item.label}
                    </button>
                )
            })}
        </div>
    )
}

export {TextTabs}
export type {TextTabItem, TextTabsProps}
