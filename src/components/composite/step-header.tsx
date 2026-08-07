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
            <h2 className="typo-h1-bold text-foreground text-balance">{title}</h2>
            {description ? <p className="typo-title-m-regular text-foreground-subtle">{description}</p> : null}
        </div>
        <StepProgress steps={steps} current={current} className="w-full max-w-147 xl:mt-3" />
    </header>
)

export {StepHeader}
export type {StepHeaderProps}
