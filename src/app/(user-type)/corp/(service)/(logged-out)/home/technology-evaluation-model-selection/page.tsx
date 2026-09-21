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
import EvaluationModelSelection from '@/components/custom/evaluation-model-selection'
import {EVALUATION_MODEL_SELECTION} from '@/content/service/evaluation-model-selection'

export const metadata: Metadata = {title: '평가모형 선택'}

// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
// 메인의 [기술평가 시작하기] 등에서 들어오는 평가모형 선택 화면 — 모형 카드와 안내는 EvaluationModelSelection 이 갖는다.
// 간격(시안): 제목과 설명 8 · 설명과 카드 40. 카드 · 안내 · [다음]은 EvaluationModelSelection 이 갖는다.
const CorpTechnologyEvaluationModelSelectionPage = () => (
    <main id="main" tabIndex={-1} className="bg-surface flex-1">
        <div className="grid-layout gap-10 pt-10 pb-15 *:col-span-full">
            <div className="flex flex-col gap-2">
                <PageTitleBar
                    title={EVALUATION_MODEL_SELECTION.title}
                    breadcrumb={
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/corp/home">홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>기술평가</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    }
                />
                <p className="typo-body-xl-regular text-foreground-subtle break-keep">
                    {EVALUATION_MODEL_SELECTION.description}
                </p>
            </div>
            <EvaluationModelSelection basePath="/corp" />
        </div>
    </main>
)

export default CorpTechnologyEvaluationModelSelectionPage
