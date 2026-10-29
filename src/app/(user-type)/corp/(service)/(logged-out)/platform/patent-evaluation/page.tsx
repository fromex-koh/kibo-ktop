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
import {PlatformPatentEvaluation} from '@/components/custom/platform-patent-evaluation'
import {PLATFORM_PATENT_EVALUATION} from '@/content/service/platform-patent-evaluation'

export const metadata: Metadata = {title: '특허평가 소개'}

// 플랫폼 소개 > 특허평가 — 화면 제목 → KPAS 소개 · 특허평가 구조도 · 평가절차 안내(PlatformPatentEvaluation).
// 간격(시안): 화면 제목과 본문 60 · 본문과 푸터 60.
// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
const CorpPlatformPatentEvaluationPage = () => (
    <main id="main" tabIndex={-1} className="bg-page flex-1">
        <div className="grid-layout gap-15 pt-10 pb-15 *:col-span-full">
            <PageTitleBar
                title={PLATFORM_PATENT_EVALUATION.title}
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/corp/home">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/corp/platform">플랫폼 소개</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{PLATFORM_PATENT_EVALUATION.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <PlatformPatentEvaluation />
        </div>
    </main>
)

export default CorpPlatformPatentEvaluationPage
