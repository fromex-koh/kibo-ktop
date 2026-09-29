import type {ComponentPropsWithoutRef} from 'react'
import {ArrowRight} from 'lucide-react'
import {cn} from '@/lib/utils'

// 프로세스 흐름도(ProcessFlow) — 둥근 단계 여럿을 화살표로 이어 순서를 보여 준다.
// 특허평가 결과 보고서(인쇄용)의 참고자료 쪽에서 쓴다.
//
// 단계 색은 진한 파랑에서 옅은 파랑으로 다섯 단계까지 자동으로 짙기가 바뀐다 — 앞 단계일수록 진하다.
// 단계가 다섯을 넘으면 마지막 색을 이어 쓴다. 색은 순서를 거드는 장식이라 순서 자체는 글과 화살표가 전한다[5.3.1].
//
// 목록(ol)으로 그려 단계 수와 순서가 화면 낭독기에도 그대로 전해진다. 화살표는 장식이라 읽지 않는다.

// 단계 색 — blue.900 → blue.500. 앞 단계가 진하다.
const STEP_COLORS = ['bg-blue-900', 'bg-blue-800', 'bg-blue-700', 'bg-blue-600', 'bg-blue-500'] as const

type ProcessFlowStep = {
    id: string
    /** 단계 이름. 줄바꿈(\n)을 넣으면 그대로 여러 줄로 선다. */
    label: string
}

type ProcessFlowProps = Omit<ComponentPropsWithoutRef<'ol'>, 'children'> & {
    /** 흐름도 전체의 이름 — 무엇의 순서인지 알린다. */
    ariaLabel: string
    steps: ProcessFlowStep[]
}

const ProcessFlow = ({ariaLabel, steps, className, ...props}: ProcessFlowProps) => (
    <ol {...props} aria-label={ariaLabel} className={cn('flex list-none items-center justify-center', className)}>
        {steps.map((step, index) => (
            <li key={step.id} className="flex items-center">
                {/* 첫 단계 앞에는 화살표를 두지 않는다. */}
                {index > 0 ? (
                    <ArrowRight aria-hidden="true" className="text-label-foreground mx-6 size-6 shrink-0" />
                ) : (
                    <span className="sr-only">{`${steps.length}단계 중 `}</span>
                )}
                <span
                    className={cn(
                        'size-40 shrink-0 rounded-full',
                        'typo-title-m-bold flex items-center justify-center px-6 text-center whitespace-pre-line text-white',
                        STEP_COLORS[Math.min(index, STEP_COLORS.length - 1)],
                    )}
                >
                    {step.label}
                </span>
            </li>
        ))}
    </ol>
)

export {ProcessFlow}
export type {ProcessFlowProps, ProcessFlowStep}
