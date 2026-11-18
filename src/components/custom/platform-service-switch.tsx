'use client'

import {createContext, useContext, useId, useRef, useState, type KeyboardEvent, type ReactNode} from 'react'
import {
    platformServiceSwitchListClassName,
    platformServiceSwitchTabClassName,
} from '@/components/theme/platform-intro.variants'
import {cn} from '@/lib/utils'

// 서비스 토글 — 한 화면이 두 서비스(예: 탄소중립 선도중소기업확인 · 개방형 K-택소노미)를 함께 소개할 때, 토글로 고른 서비스의
// 내용만 여러 섹션에 걸쳐 보인다(서비스 소개 · 주요 기능 · 이용 절차 등).
//
//   <PlatformServiceSwitchProvider options={[{value: 'a', label: '…'}, …]}>
//     <PlatformServiceSwitchTabs label="탄소중립 서비스" />   ← 섹션 탭 줄 등 어디든
//     <PlatformServicePanel value="a" panelKey="intro">…</PlatformServicePanel>   ← 섹션마다 서비스별 패널
//   </PlatformServiceSwitchProvider>
//
// 알아둘 점
//   · 탭 역할(tablist · tab · tabpanel)과 aria-selected · aria-controls(그 서비스의 패널 전부)를 둔다[8.2.1]. 패널은 섹션마다 있어
//     Radix Tabs(탭 하나에 패널 하나)로는 묶을 수 없어 직접 만든다. 방향키(← → · Home · End)로 서비스를 바꾸고 포커스를 옮긴다[6.1.1].
//   · 고르지 않은 서비스의 패널은 hidden — 화면 · 낭독기 모두에서 빠진다. 패널 id 는 `${panelKey}-${value}` 다.
//   · 색은 화면 <main> 의 --platform-switch-accent · --platform-switch-on-accent(theme platformServiceSwitch*ClassName).
// 쓰는 곳: custom/platform-carbon-neutrality.tsx(선도중소기업확인 · 개방형 K-택소노미).

type PlatformServiceOption = {value: string; label: string}

type PlatformServiceSwitchContextValue = {
    value: string
    setValue: (value: string) => void
    options: readonly PlatformServiceOption[]
    /** 서비스별 패널 묶음 이름들 — aria-controls 를 만든다. */
    panelKeys: readonly string[]
    tabIdOf: (value: string) => string
}

const PlatformServiceSwitchContext = createContext<PlatformServiceSwitchContextValue | null>(null)

const usePlatformServiceSwitch = () => {
    const context = useContext(PlatformServiceSwitchContext)
    if (!context) throw new Error('PlatformServiceSwitch 부품은 PlatformServiceSwitchProvider 안에서 쓴다.')
    return context
}

const PlatformServiceSwitchProvider = ({
    options,
    panelKeys,
    defaultValue,
    children,
}: {
    options: readonly PlatformServiceOption[]
    /** 서비스별 패널을 둔 섹션 이름들(예: intro · features · process) — 패널 id 의 앞부분. */
    panelKeys: readonly string[]
    defaultValue?: string
    children: ReactNode
}) => {
    const baseId = useId()
    const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? '')
    const tabIdOf = (optionValue: string) => `${baseId}-tab-${optionValue}`
    return (
        <PlatformServiceSwitchContext.Provider value={{value, setValue, options, panelKeys, tabIdOf}}>
            {children}
        </PlatformServiceSwitchContext.Provider>
    )
}

const PlatformServiceSwitchTabs = ({label, className}: {label: string; className?: string}) => {
    const {value, setValue, options, panelKeys, tabIdOf} = usePlatformServiceSwitch()
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

    // 방향키 — 옆 서비스로 바꾸고 그 칸에 포커스(끝에서는 처음으로 돈다).
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const lastIndex = options.length - 1
        const nextIndexByKey: Record<string, number> = {
            ArrowRight: index === lastIndex ? 0 : index + 1,
            ArrowLeft: index === 0 ? lastIndex : index - 1,
            Home: 0,
            End: lastIndex,
        }
        const nextIndex = nextIndexByKey[event.key] ?? null
        if (nextIndex === null) return
        event.preventDefault()
        const next = options[nextIndex]
        if (!next) return
        setValue(next.value)
        tabRefs.current[nextIndex]?.focus()
    }

    return (
        <div role="tablist" aria-label={label} className={cn(platformServiceSwitchListClassName, className)}>
            {options.map((option, index) => {
                const isSelected = option.value === value
                return (
                    <button
                        key={option.value}
                        ref={(element) => {
                            tabRefs.current[index] = element
                        }}
                        type="button"
                        role="tab"
                        id={tabIdOf(option.value)}
                        aria-selected={isSelected}
                        aria-controls={panelKeys.map((key) => `${key}-${option.value}`).join(' ')}
                        tabIndex={isSelected ? 0 : -1}
                        onClick={() => setValue(option.value)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                        className={platformServiceSwitchTabClassName}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}

const PlatformServicePanel = ({
    value,
    panelKey,
    children,
    className,
}: {
    value: string
    /** 섹션 이름 — PlatformServiceSwitchProvider 의 panelKeys 중 하나. */
    panelKey: string
    children: ReactNode
    className?: string
}) => {
    const {value: selectedValue, tabIdOf} = usePlatformServiceSwitch()
    return (
        <div
            role="tabpanel"
            id={`${panelKey}-${value}`}
            aria-labelledby={tabIdOf(value)}
            hidden={value !== selectedValue}
            className={className}
        >
            {children}
        </div>
    )
}

export {PlatformServicePanel, PlatformServiceSwitchProvider, PlatformServiceSwitchTabs}
export type {PlatformServiceOption}
