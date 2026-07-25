import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {ArrowRight} from 'lucide-react'
import {StepProgress} from '@/components/composite/step-progress'
import {Stepper} from '@/components/composite/stepper'
import {cn} from '@/lib/utils'

// 스텝 헤더(StepHeader) — 다단계(마법사) 플로우 한 단계의 최상단 헤더(L2 composite).
// 제목·설명은 두 시안이 같고 우측 진행 인디케이터만 달라 variant 로 나눈다(둘 중 하나로 확정되면 분기 삭제).
//   · stepper(Figma "1depth")  : [제목(h1) + 번호 원 Stepper] 한 줄 + 아래 설명, 우측 상단에 다음 단계 라벨.
//   · progress(Figma "타이틀+step"): 좌측 [제목(h1) + 설명], 우측에 StepProgress 진행바(현재/전체·현재·다음 제목 포함).
// 단계 데이터는 steps(제목 배열) 하나로 통일한다 — 전체 수는 steps.length, 다음 단계 라벨은 steps[current] 다.
// 색: 제목 foreground(gray.900) · 설명 foreground-subtle(gray.500) · 다음단계 stepper-inactive(gray.200)
//   (Stepper 의 '예정(before)' 단계와 동일한 inactive 톤 — 아직 도달 전 단계라 희미하게. 아직 활성화되지
//    않은 UI 미리보기라 명도 대비 예외에 해당한다[KWCAG 5.3.3 / WCAG 1.4.3 inactive component].)
// 간격은 Figma 그대로 — 제목↔스텝 gap-6(24px) · 제목행↔설명 gap-2(8px) · 라벨↔화살표 gap-2(8px).
type StepHeaderVariant = 'stepper' | 'progress'

type StepHeaderProps = {
    // 단계 제목(예: "1단계. 고객 정보 활용 동의"). 페이지 최상단 제목이라 h1 로 렌더된다.
    title: ReactNode
    // 단계 제목 목록. 전체 단계 수는 이 배열 길이를 단일 소스로 쓴다.
    // stepper 는 길이만, progress 는 현재·다음 단계 제목까지 사용한다.
    steps: readonly string[]
    // 현재 단계(1부터).
    current: number
    // 우측 진행 인디케이터 형태. 시안 확정 전까지 두 가지를 함께 유지한다.
    variant?: StepHeaderVariant
    // 제목 아래 보조 설명(선택).
    description?: ReactNode
    // stepper 변형의 우측 다음 단계 라벨(선택). 기본은 steps[current] 이며, "2단계. …"처럼 접두어가 붙는
    // 화면 문구를 그대로 쓰고 싶을 때만 넘긴다. progress 변형은 진행바가 다음 단계를 그리므로 무시한다.
    nextLabel?: ReactNode
} & Omit<ComponentPropsWithoutRef<'header'>, 'title'>

const StepHeader = ({
    title,
    steps,
    current,
    variant = 'stepper',
    description,
    nextLabel,
    className,
    ...props
}: StepHeaderProps) => {
    const count = steps.length
    // progress 는 진행바가 다음 단계까지 그리므로 우측 라벨을 따로 두지 않는다.
    const nextStepLabel = variant === 'stepper' ? (nextLabel ?? steps[current]) : undefined

    return (
        <header data-slot="step-header" className={cn('flex items-start justify-between gap-4', className)} {...props}>
            <div data-slot="step-header-main" className="flex min-w-0 flex-col gap-2">
                <div data-slot="step-header-title-row" className="flex items-center gap-6">
                    <h1 className="typo-h1-bold text-foreground text-balance">{title}</h1>
                    {variant === 'stepper' ? <Stepper count={count} current={current} /> : null}
                </div>
                {description ? <p className="typo-title-m-regular text-foreground-subtle">{description}</p> : null}
            </div>
            {variant === 'progress' ? (
                // 시안 실측 — 진행바는 588px 폭으로 제목 블록 오른쪽에 오고, 제목 줄 높이에 맞춰 위에서 12px 내려온다.
                <StepProgress steps={steps} current={current} className="mt-3 w-full max-w-147" />
            ) : null}
            {nextStepLabel ? (
                <p data-slot="step-header-next" className="text-stepper-inactive flex shrink-0 items-center gap-2">
                    <span className="typo-title-l-medium">{nextStepLabel}</span>
                    <ArrowRight aria-hidden="true" className="size-icon-lg shrink-0" />
                </p>
            ) : null}
        </header>
    )
}

export {StepHeader}
export type {StepHeaderProps, StepHeaderVariant}
