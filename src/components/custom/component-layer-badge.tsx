'use client'

// 'use client' — 가이드 화면 제목 옆 배지가 지금 주소(usePathname)로 폴더를 찾는다.
import {usePathname} from 'next/navigation'
import {Badge} from '@/components/ui/badge'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
import {
    COMPONENT_LAYER_BADGE,
    GUIDE_KBIGX_PRINT_HREFS,
    GUIDE_LAYERS_BY_HREF,
    KBIGX_PRINT_BADGE,
    type ComponentLayer,
} from '@/constants/publishing-guide'

// [퍼블리싱 가이드 전용] 가이드 제목 옆 배지.
//   · 컴포넌트 폴더 배지 — 그 컴포넌트가 src/components 의 어느 폴더에 있는지(COMPONENT_LAYER_BADGE).
//     가이드 홈의 폴더 카드와 각 가이드 제목 옆이 함께 쓴다.
//   · bigx print template 배지 — K-BIGx 보고서 인쇄 템플릿에서 쓰는 컴포넌트(KBIGX_PRINT_BADGE).
// 어느 가이드에 붙는지는 메뉴 목록(constants/publishing-guide.ts 의 layers · isKbigxPrint)에서 정한다.

type GuideTitleBadgeProps = {
    label: string
    color: 'neutral' | 'error' | 'success' | 'secondary-purple' | 'navy'
    variant: 'solid' | 'solid-pastel'
    description: string
}

// 배지는 버튼이다 — 마우스를 올리거나 Tab 으로 초점을 주면 무엇인지 툴팁으로 알린다[6.1.1].
// 누르는 동작은 없다. 툴팁 문구는 aria-describedby 로 이어져 스크린리더도 읽는다(radix Tooltip).
const GuideTitleBadge = ({label, color, variant, description}: GuideTitleBadgeProps) => (
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

const ComponentLayerBadge = ({layer}: {layer: ComponentLayer}) => <GuideTitleBadge {...COMPONENT_LAYER_BADGE[layer]} />

const KbigxPrintBadge = () => <GuideTitleBadge {...KBIGX_PRINT_BADGE} />

// 가이드 화면 제목 옆 — 지금 주소가 메뉴 목록에 폴더(layers)나 인쇄 템플릿 표시(isKbigxPrint)와 함께 등록돼 있을 때만 나온다.
// 순서: 폴더 배지 → bigx print template 배지.
const GuideTitleLayerBadges = () => {
    const pathname = usePathname()
    const layers = GUIDE_LAYERS_BY_HREF.get(pathname) ?? []
    const isKbigxPrint = GUIDE_KBIGX_PRINT_HREFS.has(pathname)
    if (!layers.length && !isKbigxPrint) return null

    return (
        <p className="flex flex-wrap items-center gap-1.5">
            {layers.length ? <span className="sr-only">컴포넌트 폴더: </span> : null}
            {layers.map((layer) => (
                <ComponentLayerBadge key={layer} layer={layer} />
            ))}
            {isKbigxPrint ? <KbigxPrintBadge /> : null}
        </p>
    )
}

export {ComponentLayerBadge, GuideTitleLayerBadges, KbigxPrintBadge}
