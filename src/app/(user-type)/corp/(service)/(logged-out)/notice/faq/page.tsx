import type {Metadata} from 'next'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {FaqList, type FaqItem} from '@/components/custom/faq-list'
import {PageTitleBar} from '@/components/composite/page-title-bar'

export const metadata: Metadata = {title: 'FAQ'}

// API 연동 전 화면 확인용 목업 데이터. 실제 작업에서는 FAQ 조회 결과로 교체한다.
const MOCK_FAQ_ITEMS: readonly FaqItem[] = [
    {
        id: 'corp-faq-001',
        question: 'K-TOP 서비스는 어떤 서비스인가요?',
        answer: 'K-TOP은 기업의 기술혁신 역량과 기술가치를 평가하고 관련 서비스를 제공하는 플랫폼입니다.',
    },
    {
        id: 'corp-faq-002',
        question: '회원가입은 어떻게 하나요?',
        answer: 'Header의 회원가입 메뉴에서 회원 유형을 선택한 후 본인 인증과 약관 동의를 진행하면 됩니다.',
    },
    {
        id: 'corp-faq-003',
        question: '기술평가 신청은 어디에서 하나요?',
        answer: '로그인 후 기술평가 메뉴에서 평가 유형을 선택해 신청할 수 있습니다.',
    },
    {
        id: 'corp-faq-004',
        question: '문의 답변은 어디에서 확인하나요?',
        answer: '문의하기가 완료되면 마이페이지의 문의 내역 또는 등록한 이메일에서 답변을 확인할 수 있습니다.',
    },
]

const CorpNoticeFaqPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="content-layout flex flex-col gap-10 pt-10 pb-25">
            <PageTitleBar
                title="FAQ"
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <span>알림마당</span>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>FAQ</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <FaqList items={MOCK_FAQ_ITEMS} />
        </div>
    </main>
)

export default CorpNoticeFaqPage
