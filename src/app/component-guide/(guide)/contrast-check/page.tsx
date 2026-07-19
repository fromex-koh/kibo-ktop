import type {Metadata} from 'next'
import {Badge} from '@/components/ui/badge'

export const metadata: Metadata = {title: '명도 대비 검사'}

const BADGE_COLORS = [
    'info',
    'success',
    'warning',
    'error',
    'neutral',
    'navy',
    'secondary-green',
    'secondary-orange',
    'secondary-grape',
] as const

const ContrastCheckPage = () => (
    <div className="max-w-content mx-auto flex w-full flex-col gap-10 px-6 py-12 md:py-16">
        <header className="flex flex-col gap-2">
            <h1 className="typo-display-m-bold text-foreground">웹 접근성 명도 대비 검사</h1>
            <p className="typo-body-l-regular text-foreground-subtle">
                WCAG AA 기준은 일반 텍스트 4.5:1 이상, 24px 이상 또는 18.66px 굵은 텍스트 3:1 이상이며, 사용자
                인터페이스와 의미 있는 그래픽은 인접 색상과 3:1 이상이어야 합니다.
            </p>
        </header>

        <section className="flex flex-wrap items-center gap-4" aria-label="배지 명도 대비 검수 목록">
            {(['solid-pastel', 'outline', 'solid'] as const).flatMap((variant) =>
                BADGE_COLORS.map((color) => (
                    <Badge key={`${variant}-${color}`} variant={variant} color={color}>
                        상태
                    </Badge>
                )),
            )}
            <Badge type="number" color="primary">
                2
            </Badge>
            <Badge type="number" color="new">
                5
            </Badge>
        </section>
    </div>
)

export default ContrastCheckPage
