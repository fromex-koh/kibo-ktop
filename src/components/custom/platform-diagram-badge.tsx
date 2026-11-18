import type {ReactNode} from 'react'
import {type VariantProps} from 'class-variance-authority'
import {platformDiagramBadgeVariants} from '@/components/theme/platform-intro.variants'
import {cn} from '@/lib/utils'

// 구조도 아이콘 배지 — 모형 구조도의 소제목 · 상자 머리 앞 작은 그라데이션 칸(흰 lucide 아이콘). 꾸밈이라 읽지 않는다.
// 쓰는 곳: custom/ktrs-fm-structure-diagram.tsx · tech-index-structure-diagram.tsx · investment-model-structure-diagram.tsx.

type PlatformDiagramBadgeProps = VariantProps<typeof platformDiagramBadgeVariants> & {
    /** lucide 아이콘. */
    children: ReactNode
    className?: string
}

const PlatformDiagramBadge = ({tone, size, children, className}: PlatformDiagramBadgeProps) => (
    <i aria-hidden="true" className={cn(platformDiagramBadgeVariants({tone, size}), 'not-italic', className)}>
        {children}
    </i>
)

export {PlatformDiagramBadge}
