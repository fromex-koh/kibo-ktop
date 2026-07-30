import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {StepProgress} from '@/components/composite/step-progress'
import {cn} from '@/lib/utils'

// 스텝 헤더(StepHeader) — 다단계(마법사) 플로우 한 단계의 최상단 헤더(L2 composite).
// 좌측에 제목·설명, 우측에 StepProgress(현재/전체·현재·다음 제목 포함)를 배치한다.
// 단계 데이터는 steps(제목 배열) 하나로 통일하며 전체 수는 steps.length로 계산한다.

type StepHeaderProps = {
    // 단계 제목(예: "1단계. 고객 정보 활용 동의"). 화면 제목 아래에 오는 섹션 제목이라 h2 로 렌더된다.
    title: ReactNode
    // 단계 제목 목록. 전체 단계 수는 이 배열 길이를 단일 소스로 쓴다.
    steps: readonly string[]
    // 현재 단계(1부터).
    current: number
    // 제목 아래 보조 설명(선택).
    description?: ReactNode
} & Omit<ComponentPropsWithoutRef<'header'>, 'title'>

const StepHeader = ({title, steps, current, description, className, ...props}: StepHeaderProps) => (
    <header data-slot="step-header" className={cn('flex items-start justify-between gap-4', className)} {...props}>
        <div data-slot="step-header-main" className="flex min-w-0 flex-col gap-2">
            {/* 단계 제목은 화면 제목(PageTitleBar h1 등) 아래에 오는 섹션 제목이라 h2 다.
                크기는 시안 그대로 typo-h1-bold 를 유지한다(타이포 토큰과 헤딩 레벨은 별개). [KWCAG 6.4.2] */}
            <h2 className="typo-h1-bold text-foreground text-balance">{title}</h2>
            {description ? <p className="typo-title-m-regular text-foreground-subtle">{description}</p> : null}
        </div>
        {/* 시안 실측 — 진행바는 588px 폭으로 제목 블록 오른쪽에 오고, 제목 줄 높이에 맞춰 위에서 12px 내려온다. */}
        <StepProgress steps={steps} current={current} className="mt-3 w-full max-w-147" />
    </header>
)

export {StepHeader}
export type {StepHeaderProps}
