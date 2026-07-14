import type {ComponentPropsWithoutRef} from 'react'
import {cva, type VariantProps} from 'class-variance-authority'
import {cn} from '@/lib/utils'

// 숫자 배지(NumberBadge) — 개수/카운트를 원형 pill 로 표시하는 작은 배지. Figma "badge_number"(type=primary|new) 반영.
// 텍스트 배지(Badge)와 다른 별도 컴포넌트다 — 숫자 전용이라 좌우 패딩이 좁고(한 자리는 원형에 가깝다), 색은 2종뿐이다.
// 제목 옆 건수(예: "대표자 경력사항 [2]"), 탭·메뉴의 알림 개수 등에 쓴다.
//
// 색(Figma): primary = blue.500(#3f7deb, 브랜드 블루), new = error.500(#de3412, 알림 강조). 숫자는 흰색(badge-solid-fg).
// 색은 전용 시맨틱 토큰(number-badge-primary=blue.500 · number-badge-new=error.500)에 연결한다 — chip-checked 처럼
// 컴포넌트 액센트 토큰이라 tokens.json 에서 값만 바꾸면 되고, 다크는 토큰이 자동 반사한다([PB-06]).
// 크기: 높이 24px(h-6)·최소폭 28px(min-w-7, 한 자리 기준 Figma 실측), 두 자리 이상은 px-2 로 늘어난다. 14px Bold.
const numberBadgeVariants = cva(
    'typo-body-l-bold text-badge-solid-fg inline-flex h-6 min-w-7 items-center justify-center rounded-full px-2 whitespace-nowrap',
    {
        variants: {
            variant: {
                // primary — 일반 건수(브랜드 블루).
                primary: 'bg-number-badge-primary',
                // new — 새로움/알림 강조(빨강).
                new: 'bg-number-badge-new',
            },
        },
        defaultVariants: {
            variant: 'primary',
        },
    },
)

const NumberBadge = ({
    className,
    variant = 'primary',
    ...props
}: ComponentPropsWithoutRef<'span'> & VariantProps<typeof numberBadgeVariants>) => (
    <span
        data-slot="number-badge"
        data-variant={variant}
        className={cn(numberBadgeVariants({variant}), className)}
        {...props}
    />
)

export {NumberBadge, numberBadgeVariants}
