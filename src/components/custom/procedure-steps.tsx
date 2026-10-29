import {ScrollReveal} from '@/components/custom/scroll-reveal'

// ProcedureSteps — 번호 · 이름 · 설명 단계를 가로로 늘어놓고 번호 사이를 화살표로 잇는다. 모바일은 세로로 쌓고 화살표를 감춘다.
// 쓰는 곳: 플랫폼 소개 > 특허평가 · K-BIGx 보고서 · 탄소중립(선도중소기업확인).
//
// 알아둘 점
//   · 순서 목록(ol)이라 순서가 읽힌다 — 화면의 숫자 · 화살표는 aria-hidden.
//   · 번호 글자는 text-primary-foreground — 다크에서 반사된 회색 면 위에서도 대비가 유지된다.
//   · 화면에 들어오면 단계가 왼쪽에서 차례로 밀려온다(STEP_STAGGER_MS 간격). 동작 줄이기면 없다[6.3.1].

type ProcedureStep = {title: string; description: string}

type ProcedureStepsProps = {
    steps: readonly ProcedureStep[]
    /** 단계 이름의 제목 단계 — 절차 제목(h2) 아래면 h3(기본). */
    stepHeadingLevel?: 'h3' | 'h4'
}

// 단계가 차례로 나타나는 간격(ms).
const STEP_STAGGER_MS = 120

// 단계 사이 화살표 — 번호 오른쪽 칸 끝에서 단계 사이 간격 가운데까지 걸친다(폭 96 · 오른쪽으로 60 넘침 = 48 + 사이 24 의 절반).
const StepArrow = () => (
    <svg aria-hidden="true" viewBox="0 0 96 12" className="-mr-15 hidden w-24 shrink-0 md:block">
        <path d="M 0 6 H 90" strokeWidth={2} className="stroke-foreground-subtle/50 fill-none" />
        <polygon points="90,3 96,6 90,9" className="fill-foreground-subtle" />
    </svg>
)

const ProcedureSteps = ({steps, stepHeadingLevel = 'h3'}: ProcedureStepsProps) => {
    const StepHeading = stepHeadingLevel

    return (
        <ScrollReveal hasRise={false}>
            <ol className="grid gap-10 md:auto-cols-fr md:grid-flow-col md:gap-6">
                {steps.map((step, index) => (
                    <li
                        key={step.title}
                        style={{transitionDelay: `${index * STEP_STAGGER_MS}ms`}}
                        className="flex flex-col items-center gap-4 text-center motion-safe:transition-[opacity,translate] motion-safe:duration-450 motion-safe:group-data-[revealed=false]/reveal:-translate-x-12 motion-safe:group-data-[revealed=false]/reveal:opacity-0"
                    >
                        <div className="flex w-full items-center">
                            <span className="flex-1" />
                            {/* 번호 — 순서는 목록(ol)이 알려 주므로 숫자는 읽지 않는다. */}
                            <span
                                aria-hidden="true"
                                className="typo-h1-bold text-primary-foreground flex size-15 shrink-0 items-center justify-center rounded-xl bg-gray-500"
                            >
                                {index + 1}
                            </span>
                            <span className="flex flex-1 justify-end">
                                {index < steps.length - 1 ? <StepArrow /> : null}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <StepHeading className="typo-h4-bold text-foreground break-keep">{step.title}</StepHeading>
                            <p className="typo-body-xl-medium text-foreground-subtle break-keep">{step.description}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </ScrollReveal>
    )
}

export {ProcedureSteps}
export type {ProcedureStep, ProcedureStepsProps}
