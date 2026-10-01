'use client'

// 'use client' — 가이드 화면 제목 옆 배지가 지금 주소(usePathname)로 폴더를 찾는다.
import {usePathname} from 'next/navigation'
import {Badge} from '@/components/ui/badge'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
import {COMPONENT_LAYER_BADGE, GUIDE_LAYERS_BY_HREF, type ComponentLayer} from '@/constants/publishing-guide'

// [퍼블리싱 가이드 전용] 컴포넌트 폴더 배지 — 그 컴포넌트가 src/components 의 어느 폴더에 있는지 알린다.
// 색은 COMPONENT_LAYER_BADGE 한 곳에서 정하고, 가이드 홈의 폴더 카드와 각 가이드 제목 옆이 함께 쓴다.

// 배지는 버튼이다 — 마우스를 올리거나 Tab 으로 초점을 주면 그 폴더가 무엇인지 툴팁으로 알린다[6.1.1].
// 누르는 동작은 없다. 툴팁 문구는 aria-describedby 로 이어져 스크린리더도 읽는다(radix Tooltip).
const ComponentLayerBadge = ({layer}: {layer: ComponentLayer}) => {
    const {label, color, variant, description} = COMPONENT_LAYER_BADGE[layer]

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge asChild color={color} variant={variant} shape="round" size="sm" className="font-mono">
                        <button
                            type="button"
                            className="outline-ring cursor-help focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            {label}
                        </button>
                    </Badge>
                </TooltipTrigger>
                {/* 제목 옆 배지는 화면 맨 위에 있어 툴팁을 아래로 띄운다 — 위로 띄우면 상단 바에 가린다. */}
                {/* 폭 — 셸 기본 상한(max-w-xs)을 풀어 문구가 한 줄로 나오게 한다. 상한은 radix 가 잰 '화면에 남은 폭'이라
                    좁은 화면에서는 그 안에서 줄을 바꾼다. */}
                <TooltipContent side="bottom" className="z-tooltip max-w-(--radix-tooltip-content-available-width)">
                    {description}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

// 가이드 화면 제목 옆 — 지금 주소가 메뉴 목록에 폴더와 함께 등록돼 있을 때만 나온다.
// 폴더는 화면마다 적지 않고 constants/publishing-guide.ts 의 메뉴 항목(layers)에서 찾는다.
const GuideTitleLayerBadges = () => {
    const layers = GUIDE_LAYERS_BY_HREF.get(usePathname())
    if (!layers) return null

    return (
        <p className="flex flex-wrap items-center gap-1.5">
            <span className="sr-only">컴포넌트 폴더: </span>
            {layers.map((layer) => (
                <ComponentLayerBadge key={layer} layer={layer} />
            ))}
        </p>
    )
}

export {ComponentLayerBadge, GuideTitleLayerBadges}
