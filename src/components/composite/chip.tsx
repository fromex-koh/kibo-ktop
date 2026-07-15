'use client'

import type {ComponentProps} from 'react'
import {Checkbox as CheckboxPrimitive, RadioGroup as RadioGroupPrimitive} from 'radix-ui'
import {cva, type VariantProps} from 'class-variance-authority'
import {CheckIcon} from 'lucide-react'
import {cn} from '@/lib/utils'

// 칩(Chip) — 겉모습은 칩(박스 전체가 컨트롤)이지만, 기능이 다른 두 종류를 각각의 폼 프리미티브로 제공한다.
// Figma "chip_single"(라디오) · "chip_multi"(체크박스) 를 그대로 옮긴 것으로, 둘은 시각이 아니라 **기능**이 다르다.
//   · ChipRadioGroup + ChipRadio    → Radix RadioGroup. 그룹에서 하나만 고른다(단일 선택). 라벨 가운데 정렬, 아이콘 없음.
//   · ChipCheckboxGroup + ChipCheckbox → Radix Checkbox. 각 칩을 독립 토글한다(다중 선택). 선택 시 우측 체크 아이콘.
// 둘 다 name(+value) 을 주면 hidden input 으로 네이티브 폼 제출된다(라디오는 그룹의 선택값 1개, 체크박스는
// 체크된 칩마다 value). role/키보드/단일·다중 동작은 전부 radix 원본이 처리한다.
//
// 상태색(Figma, 두 종류 공통): 미선택 = 흰 배경·border-input(1px)·label-foreground(Regular),
//   선택 = border-chip-checked(blue.500, 2px)·text-primary(blue.500, Bold), 비활성 = bg-muted + 흐림.
// data-checked = radix data-state=checked (shadcn/tailwind.css 커스텀 변형). RadioGroup.Item·Checkbox.Root 모두
// 같은 data-state 를 쓰므로 상태 스타일(chipStateClassName)을 그대로 공유한다.
//
// size(Figma "size=large|medium"): large=control-h-lg(48px)·medium=control-h-md(40px, Figma 실측 그대로).
// medium 은 버튼의 sm/xs 와 같은 컴팩트 예외([6.1.3] 44px 미만, 인접 간격 확보 전제)라 min-h-11 을 두지 않는다
// — large 가 이미 44px 이상인 표준 크기이므로, medium 은 밀도가 필요한 자리에서만 제한적으로 쓴다.

// 칩 박스 골격(size 변형 포함). 라디오·체크박스가 공유한다.
const chipVariants = cva(
    'text-label-foreground border-input bg-surface inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border px-4 text-base font-normal whitespace-nowrap transition-colors outline-none',
    {
        variants: {
            size: {
                large: 'h-control-h-lg',
                medium: 'h-control-h-md',
            },
        },
        defaultVariants: {
            size: 'large',
        },
    },
)

// 칩 상태 스타일(size 무관 — 포커스·선택·비활성). 라디오·체크박스 공통. 선택 시 테두리 2px + 파란색 강조.
const chipStateClassName = cn(
    'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dotted',
    'data-checked:border-2 data-checked:border-chip-checked data-checked:text-primary data-checked:font-bold',
    'disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
)

// ── 라디오 칩(단일 선택, Figma "chip_single") ─────────────────────────────────────

// 라디오 칩 그룹 — name 을 주면 선택값이 hidden input 으로 폼에 제출된다. 화살표 키·단일 선택은 radix 처리.
const ChipRadioGroup = ({className, ...props}: ComponentProps<typeof RadioGroupPrimitive.Root>) => (
    <RadioGroupPrimitive.Root
        data-slot="chip-radio-group"
        className={cn('flex w-fit flex-wrap gap-2', className)}
        {...props}
    />
)

// 개별 라디오 칩 — 그룹 안에서 하나만 선택. 라벨은 가운데 정렬, 아이콘 없음.
const ChipRadio = ({
    className,
    size = 'large',
    ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item> & VariantProps<typeof chipVariants>) => (
    <RadioGroupPrimitive.Item
        data-slot="chip-radio"
        className={cn(chipVariants({size}), chipStateClassName, className)}
        {...props}
    />
)

// ── 체크박스 칩(다중 선택, Figma "chip_multi") ────────────────────────────────────

// 체크박스 칩 그룹 — Radix 에 CheckboxGroup 프리미티브는 없으므로, 레이아웃 + 접근성 그룹 라벨링만 담당하는
// 얇은 래퍼다(role="group"). 각 ChipCheckbox 는 자기 checked 를 독립적으로 가진다. aria-label/labelledby 로
// "무엇을 고르는 묶음인지"를 함께 준다.
const ChipCheckboxGroup = ({className, ...props}: ComponentProps<'div'>) => (
    <div
        data-slot="chip-checkbox-group"
        role="group"
        className={cn('flex w-fit flex-wrap gap-2', className)}
        {...props}
    />
)

// 개별 체크박스 칩 — 독립 토글(다중 선택). 선택 시 우측에 체크 아이콘(Figma chip_multi 디자인)이 나타난다.
// checked/onCheckedChange 로 제어하거나 defaultChecked 로 비제어. name+value 를 주면 체크 시 폼에 제출된다.
const ChipCheckbox = ({
    className,
    children,
    size = 'large',
    ...props
}: ComponentProps<typeof CheckboxPrimitive.Root> & VariantProps<typeof chipVariants>) => (
    <CheckboxPrimitive.Root
        data-slot="chip-checkbox"
        className={cn(chipVariants({size}), chipStateClassName, 'justify-between px-6', className)}
        {...props}
    >
        <span className="flex-1 text-left">{children}</span>
        {/* 선택 시에만 마운트되는 우측 체크 아이콘(radix Indicator). 색은 라벨(text-primary, blue.500)이 아니라
            border 와 같은 chip-checked(blue.500)를 명시 지정 — Figma 아이콘이 라벨보다 한 톤 밝은 테두리 동색이다.
            strokeWidth=3: lucide 기본(2, 24 viewBox)은 16px 렌더 시 실측 ~1.33px 라 Figma 체크(~1.9px)보다 얇아, 3 으로 맞춘다. */}
        <CheckboxPrimitive.Indicator data-slot="chip-checkbox-indicator" className="text-chip-checked shrink-0">
            <CheckIcon aria-hidden="true" strokeWidth={3} className="size-4" />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
)

export {ChipRadioGroup, ChipRadio, ChipCheckboxGroup, ChipCheckbox}
