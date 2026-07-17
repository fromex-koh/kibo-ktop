import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {cn} from '@/lib/utils'

// 스테퍼(Stepper) — 다단계 흐름의 진행 단계를 번호 원으로 보여주는 인디케이터(L2 composite).
// Figma "step_atomic" 반영: 32px 원 + 16px Medium 번호, 상태 3가지.
//   · completion(완료)  : 흰 배경 · 테두리/숫자 stepper-accent(grape.900)
//   · ongoing(진행중)   : 채움 stepper-accent · 흰 숫자(text-primary-foreground, 다크 자동 대비)
//   · before(예정)      : 흰 배경 · 테두리/숫자 stepper-inactive(gray.200)
// shadcn 에 stepper 프리미티브가 없어 직접 만든다(순수 시각 인디케이터라 kit 조합 없음, compound 라 composite/).
// 색은 Figma 그대로 stepper-accent(grape.900)·stepper-inactive(gray.200) 컴포넌트 시맨틱 토큰.

type StepState = 'completion' | 'ongoing' | 'before'

// 상태별 스크린리더 보조 텍스트(번호만으론 진행 상태를 못 읽으므로).
const STATE_SR_LABEL: Record<StepState, string> = {
    completion: '완료',
    ongoing: '진행 중',
    before: '예정',
}

const STATE_CLASS: Record<StepState, string> = {
    completion: 'bg-surface border-stepper-accent text-stepper-accent',
    ongoing: 'bg-stepper-accent border-stepper-accent text-primary-foreground',
    before: 'bg-surface border-stepper-inactive text-stepper-inactive',
}

type StepProps = {
    state?: StepState
    children: ReactNode
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>

// 단계 하나 — 번호 원 + 아래 진행중 표식(▲ 캐럿). children 은 단계 번호. 진행중은 사용처에서 aria-current.
// Figma "Polygon 1"(grape.900, 8×7 둥근 위쪽 삼각형)을 원 아래에 둔다. 삼각형 자리(SVG)는 모든 상태가
// 차지하되 진행중일 때만 색을 채워(그 외 투명), 원들이 한 줄에서 위로 나란히 정렬된 채 표식만 나타난다.
const Step = ({state = 'before', children, className, ...props}: StepProps) => (
    <span
        data-slot="step"
        data-state={state}
        className={cn('inline-flex flex-col items-center gap-0.5', className)}
        {...props}
    >
        <span
            data-slot="step-circle"
            className={cn(
                'typo-body-xl-medium inline-flex size-8 shrink-0 items-center justify-center rounded-full border',
                STATE_CLASS[state],
            )}
        >
            <span className="sr-only">{STATE_SR_LABEL[state]} — </span>
            {children}
        </span>
        {/* 진행중 표식 — 원 아래 둥근 삼각형(▲) 캐럿(Figma "Polygon 1", 8×7). lucide 에 동일 모양이 없고
            CSS border 삼각형은 모서리가 뾰족해, 컴포넌트 전용 장식 도형으로 인라인 SVG 를 쓴다([NA-008] 예외).
            모서리 둥글기는 stroke-linejoin=round + 같은 색 stroke 로 낸다. 다른 상태는 투명으로 같은 자리만 차지. */}
        <svg
            viewBox="0 0 8 7"
            width="8"
            height="7"
            aria-hidden="true"
            className={cn(
                'shrink-0',
                state === 'ongoing'
                    ? 'fill-stepper-accent stroke-stepper-accent'
                    : 'fill-transparent stroke-transparent',
            )}
        >
            <path d="M4 1.4 1.4 5.6 6.6 5.6 Z" strokeWidth={2.2} strokeLinejoin="round" />
        </svg>
    </span>
)

type StepperProps = {
    // 전체 단계 수.
    count: number
    // 현재 진행 단계(1부터). 이보다 앞 = 완료, 같으면 진행중, 뒤 = 예정.
    current: number
    className?: string
} & Omit<ComponentPropsWithoutRef<'ol'>, 'children'>

// 스테퍼 — count·current 로 각 단계의 상태를 자동 계산해 번호 원을 한 줄로 나열한다.
const Stepper = ({count, current, className, ...props}: StepperProps) => (
    <ol className={cn('flex items-center gap-4', className)} {...props}>
        {Array.from({length: count}, (_, index) => {
            const step = index + 1
            const state: StepState = step < current ? 'completion' : step === current ? 'ongoing' : 'before'
            return (
                <li key={step}>
                    <Step state={state} aria-current={state === 'ongoing' ? 'step' : undefined}>
                        {step}
                    </Step>
                </li>
            )
        })}
    </ol>
)

export {Stepper, Step}
export type {StepperProps, StepProps, StepState}
