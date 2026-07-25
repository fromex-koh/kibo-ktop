import type {ComponentPropsWithoutRef} from 'react'
import {ArrowRight, Check} from 'lucide-react'
import {cn} from '@/lib/utils'

// 스텝 진행바(StepProgress) — 다단계 흐름의 진행률을 한 줄 바로 보여주는 인디케이터(L2 composite).
// Figma "step" 프레임 반영 — StepHeader(번호 원 Stepper)와 같은 역할의 대안 시안이라 별도 컴포넌트로 둔다.
// 시안이 확정되면 둘 중 하나만 남긴다.
//   · 윗줄: [현재/전체 + 현재 단계 제목] ↔ [다음 단계 제목 + 화살표]
//   · 아랫줄: 트랙(muted) 위에 단계 마일스톤 점 + 현재 지점까지 채운 primary 바 + 흰 노브
// 색은 전부 기존 토큰 — 트랙 muted(gray.100) · 미도달 점 stepper-inactive(gray.200, 기존 Stepper 와 동일)
// · 채움 primary(blue.500) · 노브 surface. 새 토큰 없음.
type StepProgressProps = {
    // 단계 제목 목록. 전체 단계 수는 이 배열 길이를 단일 소스로 쓴다.
    steps: readonly string[]
    // 현재 진행 단계(1부터).
    current: number
    className?: string
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>

const StepProgress = ({steps, current, className, ...props}: StepProgressProps) => {
    const count = steps.length
    const safeCurrent = Math.min(Math.max(current, 1), count)
    const title = steps[safeCurrent - 1]
    const nextTitle = steps[safeCurrent]
    // 진행 비율 — 첫 단계 0, 마지막 단계 1. 단계가 하나뿐이면 항상 채운 상태로 둔다.
    const progress = count > 1 ? (safeCurrent - 1) / (count - 1) : 1

    return (
        <div data-slot="step-progress" className={cn('flex w-full flex-col gap-3', className)} {...props}>
            <div data-slot="step-progress-header" className="flex items-center justify-between gap-4">
                <p className="text-label-foreground flex min-w-0 items-center gap-2">
                    {/* 현재/전체 — 시안은 현재 번호만 primary + Bold 로 강조하고 "/ 전체"는 본문색 Medium 이다. */}
                    <span className="typo-body-l-medium shrink-0 tabular-nums">
                        <span className="typo-body-l-bold text-primary">{safeCurrent}</span> / {count}
                    </span>
                    <span className="typo-body-xl-medium truncate">{title}</span>
                </p>
                {nextTitle ? (
                    <p
                        data-slot="step-progress-next"
                        className="text-foreground-subtle flex shrink-0 items-center gap-1"
                    >
                        <span className="typo-body-m-regular">{nextTitle}</span>
                        <ArrowRight aria-hidden="true" className="size-icon-xs shrink-0" />
                    </p>
                ) : null}
            </div>

            <div
                data-slot="step-progress-track"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={count}
                aria-valuenow={safeCurrent}
                aria-valuetext={`${count}단계 중 ${safeCurrent}단계 · ${title}`}
                className="bg-muted relative h-5 w-full rounded-full"
            >
                {/* 마일스톤 — 트랙 좌우 4px 안쪽에서 균등 배치된다. 마지막 단계만 12px 링(도착점). */}
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-between px-1">
                    {steps.map((step, index) => (
                        <span
                            key={step}
                            className={
                                index === count - 1
                                    ? // 도착 링 — 시안 실측 기준 12px 원에 2px 테두리(안쪽 지름 8px).
                                      'border-primary bg-muted size-3 shrink-0 rounded-full border-2'
                                    : 'bg-stepper-inactive size-2 shrink-0 rounded-full'
                            }
                        />
                    ))}
                </span>
                {/* 채움 — 노브(12px)가 현재 마일스톤 위에 오도록 폭을 맞춘다. 마커 중심은 8px ~ (100%-10px)
                    구간에 놓이므로 그 폭이 100%-18px 이고, 노브 반지름(6)과 우측 여백(4)을 더해 끝을 맞춘다.
                    Tailwind 로 표현할 수 없는 런타임 비율이라 style 로 계산한다. min-w-5 는 첫 단계에서
                    채움이 원형으로 보이게 하는 최소 폭(시안 20px). */}
                <span
                    aria-hidden="true"
                    className="bg-primary absolute inset-y-0 left-0 flex min-w-5 items-center justify-end rounded-full pr-1"
                    style={{width: `calc(${progress} * (100% - 18px) + 18px)`}}
                >
                    {/* 노브 — 시안의 "체크" 프레임(흰 원 12px) 안에 primary 체크. 시안 체크 벡터의 실제 크기는
                        6×4.5px(선 굵기 포함)이라 흰 원의 딱 절반이다. lucide 체크는 뷰박스(24) 안에서 16×11 을
                        차지하므로 8px 박스 + strokeWidth 3.5(=8×3.5/24≈1.2px 선)로 그 비율에 맞춘다. */}
                    <span className="bg-surface flex size-3 shrink-0 items-center justify-center rounded-full">
                        <Check className="text-primary size-2" strokeWidth={3.5} />
                    </span>
                </span>
            </div>
        </div>
    )
}

export {StepProgress}
export type {StepProgressProps}
