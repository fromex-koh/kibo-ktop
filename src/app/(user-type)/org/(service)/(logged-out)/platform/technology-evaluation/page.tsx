import type {Metadata} from 'next'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {EvaluationModelTabs} from '@/components/custom/evaluation-model-tabs'
import {PLATFORM_TECHNOLOGY_EVALUATION} from '@/content/service/platform-technology-evaluation'
import {cn} from '@/lib/utils'

export const metadata: Metadata = {title: '기술평가 소개'}

// 안내 제목 줄이 차례로 떠오르는 지연 — 줄 순서대로(클래스는 Tailwind 가 읽도록 리터럴로 둔다).
const HEADING_LINE_DELAY_CLASS = ['motion-safe:delay-100', 'motion-safe:delay-250'] as const

// 플랫폼 소개 > 기술평가 — 화면 제목 → 안내 제목(32) → 평가모형 탭(카드 3장 + 고른 모형 소개).
// 간격(시안 · PC · 태블릿 · 모바일 같음): 화면 제목과 안내 60 · 안내와 카드 40 · 모형 소개와 푸터 60.
// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
const OrgPlatformTechnologyEvaluationPage = () => (
    <main id="main" tabIndex={-1} className="bg-page flex-1">
        <div className="grid-layout gap-15 pt-10 pb-15 *:col-span-full">
            <PageTitleBar
                title={PLATFORM_TECHNOLOGY_EVALUATION.title}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/org/home">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/org/platform">플랫폼 소개</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{PLATFORM_TECHNOLOGY_EVALUATION.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <section aria-labelledby="platform-technology-evaluation-heading" className="flex flex-col gap-10">
                {/* 모바일 28 · 태블릿부터 32(시안) — 폭에 따라 크기가 바뀌는 화면 전용 타이포(lead-title)를 쓴다.
                    등장 연출 — 줄마다 칸 아래에 숨어 있다가 아래에서 위로 떠오르며 나타난다(첫 줄 0.1초 · 둘째 줄 0.25초 뒤,
                    0.9초 · ease-roll). 줄 칸이 넘친 부분을 가려 칸 밖에서는 보이지 않는다. 동작 줄이기면 바로 보인다[6.3.1]. */}
                <h2
                    id="platform-technology-evaluation-heading"
                    className="typo-lead-title-bold text-foreground break-keep"
                >
                    {PLATFORM_TECHNOLOGY_EVALUATION.headingLines.map((line, index) => (
                        <span key={line} className="block overflow-hidden">
                            <span
                                className={cn(
                                    'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-full motion-safe:ease-roll motion-safe:fill-mode-both block motion-safe:duration-900',
                                    HEADING_LINE_DELAY_CLASS[index],
                                )}
                            >
                                {line}
                            </span>
                        </span>
                    ))}
                </h2>
                <EvaluationModelTabs />
            </section>
        </div>
    </main>
)

export default OrgPlatformTechnologyEvaluationPage
