'use client'

import type {ComponentProps, ReactNode} from 'react'
import {createContext, useContext} from 'react'
import {Checkbox} from '@/components/kit/checkbox'
import {RadioGroup, RadioGroupItem} from '@/components/kit/radio-group'
import {cn} from '@/lib/utils'

// 선택 가능한 카드(SelectableCard) — 카드 안에 라디오/체크박스 컨트롤 + 라벨(+우측 뱃지)을 담은 L2 composite.
// Figma "동의" 반영: 카드 전체가 하나의 선택 대상이고, 선택되면 연한 파란 배경 + 파란 테두리로 강조된다.
//   · control="radio"    → kit RadioGroupItem. <SelectableCardGroup>(=kit RadioGroup) 안에서 단일 선택. value 로 식별.
//   · control="checkbox" → kit Checkbox(독립 선택). checked/onCheckedChange 로 제어.
// 카드는 <label> 이라 카드 어디를 눌러도 컨트롤이 토글된다. 선택 강조는 CSS :has() 가 아니라 React 상태로
// data-selected 를 직접 얹어 적용한다 — :has([data-state=checked]) 는 동적 attribute 변경에 재평가가
// 불안정(Chrome 포함)해 토글 후 스타일이 안 바뀌기 때문이다. 색은 Figma 그대로 selectable-card-checked
// (blue.500, 테두리)·selectable-card-bg(blue.50=#f3f8ff, 배경) 컴포넌트 시맨틱 토큰.
// 상태: disabled = 컨트롤 비활성 + 카드 흐림, readOnly = 상호작용만 막고(값·모양 유지) 흐리지 않음.

// 라디오 그룹의 현재 선택 값 — 각 카드가 자기 value 와 비교해 선택 여부(data-selected)를 안정적으로 안다.
const SelectableCardValueContext = createContext<string | undefined>(undefined)

// 라디오형 선택 카드 그룹 — kit RadioGroup 을 감싸고 현재 값을 context 로 흘린다(value 로 제어).
const SelectableCardGroup = ({value, children, ...props}: ComponentProps<typeof RadioGroup>) => (
    <SelectableCardValueContext.Provider value={typeof value === 'string' ? value : undefined}>
        <RadioGroup value={value} {...props}>
            {children}
        </RadioGroup>
    </SelectableCardValueContext.Provider>
)

type SelectableCardProps = {
    control?: 'radio' | 'checkbox'
    // control="radio": 그룹 안 항목 값. control="checkbox": 폼 제출 값.
    value?: string
    // control="checkbox" 제어 상태.
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
    name?: string
    disabled?: boolean
    readOnly?: boolean
    // 우측 뱃지 슬롯(없으면 라벨이 폭을 채운다).
    badges?: ReactNode
    // 라벨 타이포 override(기본은 제목형 typo-title-l-bold). 예: 긴 본문형은 typo-body-xl-bold.
    labelClassName?: string
    id?: string
    className?: string
    children: ReactNode
}

const SelectableCard = ({
    control = 'checkbox',
    value,
    checked,
    onCheckedChange,
    name,
    disabled,
    readOnly,
    badges,
    labelClassName,
    id,
    className,
    children,
}: SelectableCardProps) => {
    const groupValue = useContext(SelectableCardValueContext)
    // 선택 여부 — 라디오는 그룹 값과 비교, 체크박스는 checked. 이 값으로 카드 강조를 직접 얹는다(:has 회피).
    const selected = control === 'radio' ? groupValue !== undefined && groupValue === value : Boolean(checked)
    // readOnly 는 상호작용만 차단(포커스 제외 + 클릭 차단은 카드에서). 컨트롤은 흐리지 않는다.
    const controlTabIndex = readOnly ? -1 : undefined

    return (
        // htmlFor 는 두지 않는다 — 라벨이 컨트롤을 감싸므로 카드 클릭이 네이티브 라벨 연결로 컨트롤을 토글한다
        // (버튼도 labelable). htmlFor 를 함께 두면 감싸기+for 로 이중 토글돼 상태가 안 바뀐다.
        <label
            data-slot="selectable-card"
            data-selected={selected || undefined}
            data-disabled={disabled || undefined}
            data-readonly={readOnly || undefined}
            className={cn(
                // 테두리는 항상 2px 로 두되 미선택은 투명(Figma: 흰 카드, 테두리 없음) — 선택 시에만 파란 2px 테두리가
                // 나타난다. 폭을 늘 2px 로 잡아 선택/해제 시 레이아웃 시프트가 없다.
                'bg-surface flex cursor-pointer items-center gap-2 rounded-lg border-2 border-transparent px-10 py-6 transition-colors',
                'data-[selected]:border-selectable-card-checked data-[selected]:bg-selectable-card-bg',
                'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                'data-[readonly]:pointer-events-none data-[readonly]:cursor-default',
                // 포커스링은 컨트롤이 아니라 카드 전체에 — 안의 컨트롤이 키보드 포커스되면(:has(:focus-visible)) 카드에 링을 얹는다.
                'has-[:focus-visible]:outline-ring has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-dotted',
                className,
            )}
        >
            {/* 컨트롤 자체 포커스링은 끈다(focus-visible:outline-none) — 링은 위에서 카드가 그린다. */}
            {control === 'radio' ? (
                <RadioGroupItem
                    id={id}
                    value={value ?? ''}
                    disabled={disabled}
                    tabIndex={controlTabIndex}
                    className="focus-visible:outline-none"
                />
            ) : (
                <Checkbox
                    id={id}
                    name={name}
                    value={value}
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                    disabled={disabled}
                    tabIndex={controlTabIndex}
                    className="focus-visible:outline-none"
                />
            )}
            <span className={cn('text-foreground typo-title-l-bold flex-1', labelClassName)}>{children}</span>
            {badges ? <span className="flex shrink-0 items-center gap-2">{badges}</span> : null}
        </label>
    )
}

export {SelectableCard, SelectableCardGroup}
export type {SelectableCardProps}
