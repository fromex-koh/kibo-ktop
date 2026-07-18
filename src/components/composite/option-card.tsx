import Link from 'next/link'
import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {ArrowRight} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {
    optionCardArrowClassName,
    optionCardArrowIconClassName,
    optionCardBadgeClassName,
    optionCardBodyClassName,
    optionCardClassName,
    optionCardDescriptionClassName,
    optionCardHeaderClassName,
    optionCardHeadingGroupClassName,
    optionCardIllustrationClassName,
    optionCardSubtitleClassName,
    optionCardTitleClassName,
    optionCardTitleGroupClassName,
} from '@/components/theme/option-card.variants'
import {cn} from '@/lib/utils'

// 옵션 카드(OptionCard) — 여러 선택지(평가 모형 등) 중 하나로 진입하는 링크 카드. Figma "평가 모형 선택 카드" 반영.
// [상단 배지 · 제목 · 부제 · 우측 일러스트 · 설명 · 우하단 진입 화살표] 구조이고, hover/포커스 시 파란
// 테두리+배경으로 강조된다(강조는 별도 variant 가 아니라 상태 스타일 — theme/option-card.variants.ts).
//
// 접근성: 카드 전체를 next/link([NA-006])로 감싸 클릭 영역을 넓히고, 제목·부제·설명이 모두 링크 텍스트라
// 목적을 파악할 수 있다([6.4.3]). 화살표는 시각적 어포던스라 aria-hidden 이다. 제목은 heading 태그가 아니라
// 강조 텍스트로 둬서 페이지 헤딩 계층([6.4.2])을 깨지 않는다 — 카드 목록에 heading 이 필요하면 사용처에서
// 상위 섹션 heading 으로 묶는다. 일러스트가 장식이면 사용처에서 aria-hidden/alt="" 로 넘긴다([5.1.1]).

// badge 가 문자열이면 Figma 기본 배지(solid·info·pill·sm)로, 엘리먼트면 그대로 렌더한다.
const renderOptionBadge = (badge: ReactNode) =>
    typeof badge === 'string' ? (
        <Badge variant="solid" color="info" shape="pill" size="sm">
            {badge}
        </Badge>
    ) : (
        badge
    )

type OptionCardProps = {
    // 진입 경로. 카드 전체가 이 링크다.
    href: string
    // 상단 배지. 문자열이면 기본 배지로, 엘리먼트면 그대로 렌더. 생략하면 배지 없음.
    badge?: ReactNode
    // 카드 제목(굵은 강조 텍스트).
    title: ReactNode
    // 제목 아래 부제(모형 분류 등).
    subtitle?: ReactNode
    // 설명 본문.
    description?: ReactNode
    // 우측 일러스트/아이콘 슬롯. 장식이면 aria-hidden 요소를 넘긴다.
    illustration?: ReactNode
} & Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'title'>

const OptionCard = ({
    href,
    badge,
    title,
    subtitle,
    description,
    illustration,
    className,
    ...props
}: OptionCardProps) => (
    <Link href={href} data-slot="option-card" className={cn(optionCardClassName, className)} {...props}>
        <div className={optionCardBodyClassName}>
            <div className={optionCardHeaderClassName}>
                <div className={optionCardHeadingGroupClassName}>
                    {badge != null ? (
                        <span data-slot="option-card-badge" className={optionCardBadgeClassName}>
                            {renderOptionBadge(badge)}
                        </span>
                    ) : null}
                    <div className={optionCardTitleGroupClassName}>
                        <span data-slot="option-card-title" className={optionCardTitleClassName}>
                            {title}
                        </span>
                        {subtitle != null ? (
                            <span data-slot="option-card-subtitle" className={optionCardSubtitleClassName}>
                                {subtitle}
                            </span>
                        ) : null}
                    </div>
                </div>
                {illustration != null ? (
                    <div data-slot="option-card-illustration" className={optionCardIllustrationClassName}>
                        {illustration}
                    </div>
                ) : null}
            </div>
            {description != null ? (
                <p data-slot="option-card-description" className={optionCardDescriptionClassName}>
                    {description}
                </p>
            ) : null}
        </div>
        <span aria-hidden="true" data-slot="option-card-arrow" className={optionCardArrowClassName}>
            <ArrowRight className={optionCardArrowIconClassName} />
        </span>
    </Link>
)

export {OptionCard}
export type {OptionCardProps}
