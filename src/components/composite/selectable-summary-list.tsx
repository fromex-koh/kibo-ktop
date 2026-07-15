'use client'

import type {ComponentProps, ReactNode} from 'react'
import {createContext, useContext} from 'react'
import {summaryListBoxClassName} from '@/components/composite/summary-list'
import {RadioGroup, RadioGroupItem} from '@/components/kit/radio-group'
import {cn} from '@/lib/utils'

// 선택 가능한 요약 목록(SelectableSummaryList) — 여러 항목(기업 등) 중 하나를 라디오로 고르는 카드형
// 리스트. 기존 SelectableCard(라디오 카드 + 선택 강조)와 SummaryList(라벨+값 목록)를 조립한
// L2 composite다. Figma "리스트"(기업 선택) 반영: 카드 맨 위에 라디오, 그 아래 라벨+값 목록.
//
// 왜 <SummaryList>(=<dl>)를 그대로 감싸 쓰지 않고 조립하나 — 라디오(버튼)를 <dl> 의 직계 자식으로
// 두면 <dl> 의 콘텐츠 모델(dt/dd 그룹만 허용)을 벗어나 마크업이 무효가 된다([8.1.1]). 그래서 카드 박스
// 스타일(summaryListBoxClassName)만 <label> 에 재사용하고, 그 안에 라디오 + <dl>(행들)을 형제로 둔다.
//
// 라디오는 kit RadioGroupItem 을 그대로 쓴다 — Figma 라디오 색·크기(24px, 선택 시 blue.500)가 이미
// RadioGroupItem 의 기본 스타일(data-checked:bg-primary)과 동일해 커스텀이 필요 없다.
// 선택 강조는 SelectableCard 와 같은 토큰(selectable-card-checked 파란 테두리·selectable-card-bg 연한
// 파란 배경)을 쓴다 — 같은 "카드 선택" 개념이라 색을 재사용한다. 미선택 시엔 SummaryList 기본 테두리
// (border-subtle-3, 1px)를 유지하고, 선택 시에만 2px 로 두꺼워진다(Chip 의 선택 테두리와 같은 처리).

const SelectableSummaryListValueContext = createContext<string | undefined>(undefined)

// 그룹 — kit RadioGroup 을 감싸고 현재 선택값을 context 로 흘린다(value 로 제어).
const SelectableSummaryListGroup = ({className, value, children, ...props}: ComponentProps<typeof RadioGroup>) => (
    <SelectableSummaryListValueContext.Provider value={typeof value === 'string' ? value : undefined}>
        <RadioGroup value={value} className={cn('grid w-full gap-6 md:grid-cols-2', className)} {...props}>
            {children}
        </RadioGroup>
    </SelectableSummaryListValueContext.Provider>
)

type SelectableSummaryListProps = {
    // 그룹 안 항목 값 — 그룹의 선택값과 비교해 선택 여부를 안다.
    value: string
    disabled?: boolean
    id?: string
    className?: string
    // SummaryListItem 들.
    children: ReactNode
}

// 개별 카드 — <label> 이라 카드 어디를 눌러도 라디오가 토글된다(htmlFor 는 두지 않는다, selectable-card 와 동일 이유).
const SelectableSummaryList = ({value, disabled, id, className, children}: SelectableSummaryListProps) => {
    const groupValue = useContext(SelectableSummaryListValueContext)
    const selected = groupValue !== undefined && groupValue === value

    return (
        <label
            data-slot="selectable-summary-list"
            data-selected={selected || undefined}
            data-disabled={disabled || undefined}
            className={cn(
                summaryListBoxClassName,
                'cursor-pointer transition-colors',
                'data-[selected]:border-selectable-card-checked data-[selected]:bg-selectable-card-bg data-[selected]:border-2',
                'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                'has-[:focus-visible]:outline-ring has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-dotted',
                className,
            )}
        >
            <RadioGroupItem id={id} value={value} disabled={disabled} className="focus-visible:outline-none" />
            <dl className="flex flex-col gap-3">{children}</dl>
        </label>
    )
}

export {SelectableSummaryList, SelectableSummaryListGroup}
export type {SelectableSummaryListProps}
