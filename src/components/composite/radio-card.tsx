'use client'

import type {ComponentProps, ReactNode} from 'react'
import {RadioGroup as RadioGroupPrimitive} from 'radix-ui'
import {Badge} from '@/components/ui/badge'
import {
    radioCardBodyClassName,
    radioCardClassName,
    radioCardDescriptionClassName,
    radioCardGroupClassName,
    radioCardHeaderClassName,
    radioCardHeadingGroupClassName,
    radioCardIllustrationClassName,
    radioCardTitleClassName,
} from '@/components/theme/radio-card.variants'
import {cn} from '@/lib/utils'

// 라디오 카드(RadioCard) — 여러 선택지 중 하나를 고르는 큰 카드. Figma "평가모형 선택 카드" 반영.
// [배지 · 제목 · 우측 일러스트 · 설명] 구조이고, 고른 카드만 파란 테두리 + 옅은 파란 면으로 남는다.
//
// OptionCard(링크 카드)와 겉모습이 같고 하는 일이 다르다 — 누르면 이동하지 않고 값을 고른다.
// 고른 값은 폼에 실려 제출되고, 화면은 그 값으로 다음 버튼을 열어 준다.
//
// 동작·접근성은 Radix RadioGroup 이 갖는다 — 화살표 키 이동, 하나만 선택, 그룹 안에서 탭 한 번[6.1.1].
// 그룹 이름은 사용처에서 aria-label 이나 aria-labelledby 로 준다[7.4.1].
//
// 카드 안을 모두 span 으로 두는 이유 — Radix 가 카드를 <button role="radio"> 로 그리는데, 버튼 안에는
// p·div 같은 블록 요소를 넣을 수 없다(HTML 중첩 규칙[8.1.1]). 보이는 모양은 유틸리티 클래스가 만든다.

// badge 가 문자열이면 Figma 기본 배지(solid·info·pill·sm)로, 엘리먼트면 그대로 렌더한다.
const renderCardBadge = (badge: ReactNode) =>
    typeof badge === 'string' ? (
        <Badge variant="solid" color="info" shape="pill" size="sm">
            {badge}
        </Badge>
    ) : (
        badge
    )

const RadioCardGroup = ({className, ...props}: ComponentProps<typeof RadioGroupPrimitive.Root>) => (
    <RadioGroupPrimitive.Root
        data-slot="radio-card-group"
        className={cn(radioCardGroupClassName, className)}
        {...props}
    />
)

type RadioCardProps = {
    // 상단 배지. 문자열이면 기본 배지로, 엘리먼트면 그대로 렌더. 생략하면 배지 없음.
    badge?: ReactNode
    // 카드 제목(굵은 강조 텍스트). 라디오의 접근 이름이 된다.
    title: ReactNode
    // 설명 본문.
    description?: ReactNode
    // 우측 일러스트/아이콘 슬롯. 장식이면 aria-hidden/alt="" 요소를 넘긴다.
    illustration?: ReactNode
} & ComponentProps<typeof RadioGroupPrimitive.Item>

const RadioCard = ({badge, title, description, illustration, className, ...props}: RadioCardProps) => (
    <RadioGroupPrimitive.Item data-slot="radio-card" className={cn(radioCardClassName, className)} {...props}>
        <span className={radioCardBodyClassName}>
            <span className={radioCardHeaderClassName}>
                <span className={radioCardHeadingGroupClassName}>
                    {badge != null ? <span data-slot="radio-card-badge">{renderCardBadge(badge)}</span> : null}
                    <span data-slot="radio-card-title" className={radioCardTitleClassName}>
                        {title}
                    </span>
                </span>
                {illustration != null ? (
                    <span data-slot="radio-card-illustration" className={radioCardIllustrationClassName}>
                        {illustration}
                    </span>
                ) : null}
            </span>
            {description != null ? (
                <span data-slot="radio-card-description" className={radioCardDescriptionClassName}>
                    {description}
                </span>
            ) : null}
        </span>
    </RadioGroupPrimitive.Item>
)

export {RadioCard, RadioCardGroup}
export type {RadioCardProps}
