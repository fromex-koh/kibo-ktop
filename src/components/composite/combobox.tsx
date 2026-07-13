'use client'

import type {ComponentPropsWithoutRef} from 'react'
import {useId, useState} from 'react'
import {CheckIcon, ChevronDownIcon} from 'lucide-react'
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/kit/command'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/kit/popover'
import {cn} from '@/lib/utils'

// 콤보박스(Combobox) — 검색으로 걸러 하나를 고르는 선택 컨트롤(L2 composite). shadcn 에 단일 프리미티브가
// 없어 kit Popover + Command(cmdk)를 조합한다. 트리거는 Input 과 시각적으로 통일한다(높이 48px·rounded-sm·
// border-input·bg-surface·px-4·text-base·점선 포커스) — DatePicker·Select 트리거와 동일 스킨. 우측 chevron.
// 값은 controlled(value/onValueChange). 열면 검색 입력 + 필터된 목록이 나오고, 고르면 닫힌다.

type ComboboxOption = {value: string; label: string}

type ComboboxProps = {
    options: ComboboxOption[]
    value?: string
    onValueChange?: (value: string) => void
    // 트리거에 값이 없을 때 문구.
    placeholder?: string
    // 검색 입력 placeholder.
    searchPlaceholder?: string
    // 검색 결과가 없을 때 문구.
    emptyText?: string
    disabled?: boolean
    readOnly?: boolean
    id?: string
    className?: string
} & Pick<ComponentPropsWithoutRef<'button'>, 'aria-invalid' | 'aria-describedby' | 'name'>

const Combobox = ({
    options,
    value,
    onValueChange,
    placeholder = '선택하세요',
    searchPlaceholder = '검색...',
    emptyText = '결과가 없습니다.',
    disabled,
    readOnly,
    id,
    className,
    ...props
}: ComboboxProps) => {
    const [open, setOpen] = useState(false)
    // 트리거(role=combobox)가 aria-controls 로 가리킬 목록 id. 목록은 열렸을 때만 렌더된다(콤보박스 표준).
    const listId = useId()
    const selected = options.find((option) => option.value === value)

    return (
        <Popover open={open} onOpenChange={(next) => !readOnly && setOpen(next)}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    id={id}
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={listId}
                    disabled={disabled}
                    data-slot="combobox-trigger"
                    data-readonly={readOnly || undefined}
                    className={cn(
                        'h-control-h-lg border-input bg-surface flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-sm border px-4 text-base transition-colors outline-none',
                        'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dotted',
                        'aria-invalid:border-destructive',
                        // readOnly: 값·모양은 유지하되 열리지 않는다(비활성과 달리 흐리지 않음). DatePicker 와 동일.
                        'data-[readonly]:bg-muted data-[readonly]:cursor-default',
                        'disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
                        className,
                    )}
                    {...props}
                >
                    <span className={cn('truncate', selected ? 'text-foreground' : 'text-placeholder')}>
                        {selected ? selected.label : placeholder}
                    </span>
                    <ChevronDownIcon aria-hidden="true" className="text-muted-foreground size-5 shrink-0" />
                </button>
            </PopoverTrigger>
            {/* 팝오버 폭을 트리거 폭에 맞춘다(콤보박스 표준) — radix 가 노출하는 CSS 변수 참조라 arbitrary 최소 사용([SC-01]) */}
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                {/* 기본 fuzzy 스코어러는 한국어 부분일치를 제대로 못 거르므로, 단순 대소문자 무시 substring 으로 필터한다. */}
                <Command
                    filter={(itemValue, search) => (itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
                >
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList id={listId}>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={() => {
                                        onValueChange?.(option.value)
                                        setOpen(false)
                                    }}
                                >
                                    {option.label}
                                    <CheckIcon
                                        className={cn(
                                            'ml-auto size-4',
                                            value === option.value ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export {Combobox}
export type {ComboboxProps, ComboboxOption}
