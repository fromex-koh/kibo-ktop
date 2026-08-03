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

export const metadata: Metadata = {title: '이용약관'}

// 시안([공통] 이용약관)의 본문 영역은 약관 원문 확정 전까지 자리만 잡아 둔 상태다.
// 바탕을 bg-surface로 덮는 이유 — body 기본색(bg-background)을 그대로 두면 같은 색인 안내 영역이 묻힌다.
const CorpTermsPage = () => (
    <main id="main" tabIndex={-1} className="bg-surface flex-1">
        <div className="content-layout flex flex-col gap-10 pt-10 pb-25">
            <PageTitleBar
                title="이용약관"
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>이용약관</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <section
                className="bg-background grid min-h-100 place-items-center px-6"
                aria-labelledby="terms-placeholder-title"
            >
                <h2 id="terms-placeholder-title" className="typo-title-l-bold text-center break-keep">
                    내용 추후 업데이트
                </h2>
            </section>
        </div>
    </main>
)

export default CorpTermsPage
