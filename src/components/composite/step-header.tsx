import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {StepProgress} from '@/components/composite/step-progress'
import {cn} from '@/lib/utils'

// 다단계 화면의 현재 단계 제목·설명과 진행 상태를 표시한다.

type StepHeaderProps = {
    // 화면 제목 아래에 표시할 단계 제목.
    title: ReactNode
    // 전체 단계 제목 목록.
    steps: readonly string[]
    // 현재 단계 번호(1부터 시작).
    current: number
    // 단계 제목 아래 보조 설명.
    description?: ReactNode
} & Omit<ComponentPropsWithoutRef<'header'>, 'title'>

// xl 미만에서는 제목 아래에 진행 상태를 배치하고, xl부터 가로로 배치한다.
const StepHeader = ({title, steps, current, description, className, ...props}: StepHeaderProps) => (
    <header
        data-slot="step-header"
        className={cn('flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between xl:gap-4', className)}
        {...props}
    >
        <div data-slot="step-header-main" className="flex min-w-0 flex-col gap-2">
            {/* 화면 제목 아래의 단계 제목이므로 h2로 렌더링한다. */}
            <h2 className="typo-h1-bold text-foreground">{title}</h2>
            {description ? <p className="typo-title-m-regular text-foreground-subtle">{description}</p> : null}
        </div>
        <StepProgress steps={steps} current={current} className="w-full max-w-147 xl:mt-3" />
    </header>
)

// 축약형 — 화면 폭이 좁아 진행바를 펼칠 자리가 없을 때 쓴다(시안 "Mobile_2단계_기업정보").
// 단계 수와 제목만 남기고, 진행바·설명은 두지 않는다. 좁은 화면에서 고정(sticky)되는 자리에 들어가므로
// 세로로 차지하는 높이가 작아야 한다.
//
// 제목을 h1 으로 두는 이유 — 이 축약형을 쓰는 화면은 같은 폭에서 PageTitleBar(h1)를 감춘다.
// 화면에 실제로 그려지는 제목이 이것 하나뿐이라 h1 이 맞고, 감춘 쪽은 display:none 이라
// 접근성 트리에서도 빠져 h1 이 둘이 되지 않는다[6.4.2].
const StepHeaderCompact = ({title, steps, current, className, ...props}: Omit<StepHeaderProps, 'description'>) => {
    const count = steps.length
    const safeCurrent = Math.min(Math.max(current, 1), count)

    return (
        <header data-slot="step-header-compact" className={cn('flex flex-col', className)} {...props}>
            {/* 현재/전체 — 강조 방식은 StepProgress 와 같다(현재 번호만 primary + Bold). */}
            <p className="text-label-foreground typo-body-l-medium tabular-nums">
                <span className="typo-body-l-bold text-primary">{safeCurrent}</span> / {count}
            </p>
            <h1 className="typo-h1-bold text-foreground">{title}</h1>
        </header>
    )
}

export {StepHeader, StepHeaderCompact}
export type {StepHeaderProps}
