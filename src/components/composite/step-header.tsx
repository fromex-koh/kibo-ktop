import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {ArrowRight} from 'lucide-react'
import {Stepper} from '@/components/composite/stepper'
import {cn} from '@/lib/utils'

// 스텝 헤더(StepHeader) — 다단계(마법사) 플로우 한 단계의 최상단 헤더(L2 composite). Figma "1depth" 반영.
//   · 좌측: [단계 제목(h1) + Stepper(진행 인디케이터)] 한 줄 + 그 아래 설명문.
//   · 우측(상단): 다음 단계 미리보기 라벨 + 오른쪽 화살표(다음으로 진행됨을 암시).
// 기존 컴포넌트 조합 — Stepper(composite) + lucide ArrowRight([NA-008]). 제목/설명은 시맨틱 요소 + typo-* 토큰.
// 색: 제목 foreground(gray.900) · 설명 foreground-subtle(gray.500) · 다음단계 stepper-inactive(gray.200)
//   (Stepper 의 '예정(before)' 단계와 동일한 inactive 톤 — 아직 도달 전 단계라 희미하게. 아직 활성화되지
//    않은 UI 미리보기라 명도 대비 예외에 해당한다[KWCAG 5.3.3 / WCAG 1.4.3 inactive component].)
// 간격은 Figma 그대로 — 제목↔스텝 gap-6(24px) · 제목행↔설명 gap-2(8px) · 라벨↔화살표 gap-2(8px).

type StepHeaderProps = {
    // 단계 제목(예: "1단계. 고객 정보 활용 동의"). 페이지 최상단 제목이라 h1 로 렌더된다.
    title: ReactNode
    // 전체 단계 수 · 현재 단계(1부터) — Stepper 로 그대로 전달한다.
    count: number
    current: number
    // 제목 아래 보조 설명(선택).
    description?: ReactNode
    // 다음 단계 미리보기 라벨(선택 — 마지막 단계면 생략).
    nextLabel?: ReactNode
} & Omit<ComponentPropsWithoutRef<'header'>, 'title'>

const StepHeader = ({title, count, current, description, nextLabel, className, ...props}: StepHeaderProps) => (
    <header data-slot="step-header" className={cn('flex items-start justify-between gap-4', className)} {...props}>
        <div data-slot="step-header-main" className="flex flex-col gap-2">
            <div data-slot="step-header-title-row" className="flex items-center gap-6">
                <h1 className="typo-h1-bold text-foreground text-balance">{title}</h1>
                <Stepper count={count} current={current} />
            </div>
            {description ? <p className="typo-title-m-regular text-foreground-subtle">{description}</p> : null}
        </div>
        {nextLabel ? (
            <p data-slot="step-header-next" className="text-stepper-inactive flex shrink-0 items-center gap-2">
                <span className="typo-title-l-medium">{nextLabel}</span>
                <ArrowRight aria-hidden="true" className="size-icon-lg shrink-0" />
            </p>
        ) : null}
    </header>
)

export {StepHeader}
export type {StepHeaderProps}
