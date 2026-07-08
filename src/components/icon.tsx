import type {LucideIcon} from 'lucide-react'

// 아이콘 — lucide 글리프([NA-008] 표준 단일 아이콘 라이브러리)를 두 스타일(variant)로 렌더한다.
//  - outline(기본): 글리프만 그린다(span 없이 <svg> 하나). 크기는 size-icon-* 유틸로 지정.
//  - solid: 원형 배지 안에 글리프를 담아 강조한다(알림·상태 배지 등). 배지 크기 = size-icon-*,
//    안의 글리프는 배지의 60% 로 두어 여백을 둔다.
// 이 컴포넌트는 순수 '아이콘'이라 항상 장식용(aria-hidden)이다 — 버튼이 아니다. 클릭 가능한
// 아이콘 버튼이 필요하면 <button>/<a> 로 감싸고 그 요소에 aria-label 을 주며, 아이콘은 여기처럼
// aria-hidden 으로 둔다([5.1.1] — 아이콘만 있는 버튼/링크는 감싸는 요소가 대체 텍스트를 갖는다).
type IconVariant = 'outline' | 'solid'

type IconProps = {
    icon: LucideIcon
    variant?: IconVariant
    className?: string
}

const Icon = ({icon: Glyph, variant = 'outline', className = ''}: IconProps) => {
    if (variant === 'solid') {
        return (
            <span
                aria-hidden="true"
                className={`bg-info-surface text-info inline-flex items-center justify-center rounded-full ${className}`.trim()}
            >
                {/* 배지의 60% 로 여백을 둔다(고정 px 아닌 비율이라 어느 size-icon-* 에도 맞는다). */}
                <Glyph style={{width: '60%', height: '60%'}} />
            </span>
        )
    }

    return <Glyph aria-hidden="true" className={className} />
}

export {Icon}
export type {IconVariant}
