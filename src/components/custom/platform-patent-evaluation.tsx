import type {StaticImageData} from 'next/image'
import economicUseDarkIcon from '@public/images/platform-patent-evaluation/economic-use-dark.webp'
import economicUseIcon from '@public/images/platform-patent-evaluation/economic-use.webp'
import patentTradeDarkIcon from '@public/images/platform-patent-evaluation/patent-trade-dark.webp'
import patentTradeIcon from '@public/images/platform-patent-evaluation/patent-trade.webp'
import patentedKnowledgeDarkIcon from '@public/images/platform-patent-evaluation/patented-knowledge-dark.webp'
import patentedKnowledgeIcon from '@public/images/platform-patent-evaluation/patented-knowledge.webp'
import {ListMarker} from '@/components/custom/list-marker'
import {ProcedureSteps} from '@/components/custom/procedure-steps'
import {ScrollReveal} from '@/components/custom/scroll-reveal'
import {ThemeImage} from '@/components/custom/theme-image'
import {PLATFORM_PATENT_EVALUATION} from '@/content/service/platform-patent-evaluation'

// 플랫폼 소개 > 특허평가 본문(기업 · 기관 공용). 화면 제목 아래에 세 묶음이 놓인다.
//   ① KPAS 소개(KpasIntro) ② 특허평가 구조도(PatentEvaluationDiagram) ③ 평가절차(ProcedureSteps)
// 문구는 content/service/platform-patent-evaluation.ts 에서 고친다.
//
// 모션 — 열 때 KPAS 제목 · 목록이 떠오르고, 구조도 · 절차는 화면에 들어오면 나타난다. 동작 줄이기면 없다[6.3.1].

const {kpas, diagram, procedure} = PLATFORM_PATENT_EVALUATION

const KpasIntro = () => (
    <section aria-labelledby="platform-patent-evaluation-kpas" className="flex flex-col gap-2">
        <h2
            id="platform-patent-evaluation-kpas"
            className="typo-lead-title-bold text-foreground overflow-hidden break-keep"
        >
            <span className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-full motion-safe:ease-roll motion-safe:fill-mode-both block motion-safe:delay-100 motion-safe:duration-900">
                {kpas.title}
            </span>
        </h2>
        <ul className="typo-title-l-regular text-label-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-10 motion-safe:ease-roll motion-safe:fill-mode-both flex flex-col gap-2 motion-safe:delay-300 motion-safe:duration-900">
            {kpas.summary.map((line) => (
                <li key={line} className="flex">
                    <ListMarker className="h-lh" />
                    <span className="break-keep">{line}</span>
                </li>
            ))}
        </ul>
    </section>
)

// 관점 아이콘 — 원본 180 × 180 = 표시 크기(60)의 3배. 글자 없는 단색 그림이라도 무손실 webp 가 더 작아 무손실로 두었다.
type AspectIcon = (typeof diagram.aspects)[number]['icon']
const ASPECT_ICONS: Record<AspectIcon, {light: StaticImageData; dark: StaticImageData}> = {
    'patented-knowledge': {light: patentedKnowledgeIcon, dark: patentedKnowledgeDarkIcon},
    'patent-trade': {light: patentTradeIcon, dark: patentTradeDarkIcon},
    'economic-use': {light: economicUseIcon, dark: economicUseDarkIcon},
}

// 특허평가 구조도 — 평가모형 구조도 가이드(/component-guide/model-structure-diagram)에도 싣는다.
const PatentEvaluationDiagram = () => (
    <div className="bg-panel-subtle flex justify-center px-4 py-12 md:px-6">
        <ScrollReveal className="flex w-full max-w-120 flex-col items-center">
            <section aria-labelledby="platform-patent-evaluation-diagram" className="flex w-full flex-col">
                <h3
                    id="platform-patent-evaluation-diagram"
                    className="typo-body-xl-bold bg-primary text-primary-foreground px-2 py-4 text-center"
                >
                    {diagram.title}
                </h3>
                <div className="bg-panel-raised p-4">
                    <ul className="bg-panel-inset grid gap-6 px-6 py-4 sm:grid-cols-3 sm:gap-4">
                        {diagram.aspects.map((aspect) => (
                            <li key={aspect.title} className="flex flex-col items-center gap-4 text-center">
                                {/* 관점 아이콘(60) — 옆 제목이 같은 뜻을 말하므로 꾸밈이다(alt="")[5.1.1]. */}
                                <ThemeImage {...ASPECT_ICONS[aspect.icon]} className="size-15" />
                                <div className="flex flex-col">
                                    <p className="typo-body-l-bold text-label-foreground break-keep">{aspect.title}</p>
                                    <p className="typo-body-m-regular text-label-foreground">
                                        {aspect.descriptionLines.map((line) => (
                                            <span key={line} className="block">
                                                {line}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
            {/* 아래 화살표 — 구조도에서 결론으로. 꾸밈이라 읽지 않는다. */}
            <svg aria-hidden="true" viewBox="0 0 12 16" className="block h-4 w-3">
                <path
                    d="M 6 0 V 11"
                    strokeWidth={2}
                    pathLength={1}
                    strokeDasharray="1 2"
                    className="stroke-foreground-subtle/50 motion-safe:group-data-[revealed=true]/reveal:animate-chart-draw fill-none"
                />
                <polygon
                    points="3,11 9,11 6,16"
                    className="fill-foreground-subtle motion-safe:group-data-[revealed=true]/reveal:animate-chart-label"
                />
            </svg>
            <p className="typo-body-l-bold text-label-foreground mt-2 text-center break-keep">
                {diagram.conclusionLines.map((line) => (
                    <span key={line} className="block">
                        {line}
                    </span>
                ))}
            </p>
        </ScrollReveal>
    </div>
)

const EvaluationProcedure = () => (
    <section aria-labelledby="platform-patent-evaluation-procedure" className="flex flex-col gap-12">
        <h2 id="platform-patent-evaluation-procedure" className="typo-lead-title-bold text-foreground break-keep">
            {procedure.title}
        </h2>
        <ProcedureSteps steps={procedure.steps} />
    </section>
)

const PlatformPatentEvaluation = () => (
    <div className="flex flex-col gap-15">
        <div className="flex flex-col gap-10">
            <KpasIntro />
            <PatentEvaluationDiagram />
        </div>
        <EvaluationProcedure />
    </div>
)

export {PatentEvaluationDiagram, PlatformPatentEvaluation}
