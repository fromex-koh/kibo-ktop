import type {Metadata} from 'next'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {FaqList, type FaqCategory, type FaqItem} from '@/components/custom/faq-list'
import {SectionHeader, SectionHeaderTitle} from '@/components/composite/section-header'
import {PageTitleBar} from '@/components/composite/page-title-bar'

export const metadata: Metadata = {title: '자주 묻는 질문'}

// 한 페이지에 보여줄 질문 수.
const FAQ_PAGE_SIZE = 10

const FAQ_CATEGORIES: readonly FaqCategory[] = [
    {value: 'all', label: '전체'},
    {value: 'member', label: '회원'},
    {value: 'payment', label: '결제·할인'},
    {value: 'certification', label: '인증센터'},
    {value: 'etc', label: '기타'},
]

// API 연동 전 화면 확인용 목업 데이터. 실제 작업에서는 FAQ 조회 결과로 교체한다.
const MOCK_FAQ_ITEMS: readonly FaqItem[] = [
    {
        id: 'corp-faq-001',
        category: 'member',
        question: 'K-TOP 서비스는 어떤 서비스인가요?',
        answer: 'K-TOP은 기업의 기술혁신 역량과 기술가치를 평가하고 관련 서비스를 제공하는 플랫폼입니다.',
    },
    {
        id: 'corp-faq-002',
        category: 'member',
        question: '회원가입은 어떻게 하나요?',
        answer: 'Header의 회원가입 메뉴에서 회원 유형을 선택한 후 본인 인증과 약관 동의를 진행하면 됩니다.\n가입 승인까지는 영업일 기준 1일이 걸립니다.',
    },
    {
        id: 'corp-faq-003',
        category: 'member',
        question: '아이디와 비밀번호를 잊어버렸어요.',
        answer: '로그인 화면의 아이디·비밀번호 찾기에서 가입할 때 등록한 담당자 정보로 확인할 수 있습니다.',
    },
    {
        id: 'corp-faq-004',
        category: 'payment',
        question: '평가 수수료는 어떻게 결제하나요?',
        answer: '평가 신청 마지막 단계에서 카드 결제와 계좌이체 중 하나를 선택할 수 있습니다.',
    },
    {
        id: 'corp-faq-005',
        category: 'payment',
        question: '할인 대상은 어떻게 확인하나요?',
        answer: '가격 정책에서 기업 규모와 인증 보유 여부에 따른 할인율을 확인할 수 있습니다.',
    },
    {
        id: 'corp-faq-006',
        category: 'payment',
        question: '세금계산서는 언제 발행되나요?',
        answer: '결제가 완료되면 영업일 기준 3일 안에 등록된 이메일로 발행됩니다.',
    },
    {
        id: 'corp-faq-007',
        category: 'certification',
        question: '인증서 등록은 꼭 해야 하나요?',
        answer: '기업 정보를 조회하고 평가 결과를 확인하려면 사업자 인증서 등록이 필요합니다.',
    },
    {
        id: 'corp-faq-008',
        category: 'certification',
        question: '인증서가 만료되면 어떻게 하나요?',
        answer: '인증센터에서 새 인증서를 다시 등록하면 이어서 이용할 수 있습니다.',
    },
    {
        id: 'corp-faq-009',
        category: 'etc',
        question: '기술평가 신청은 어디에서 하나요?',
        answer: '로그인 후 기술평가 메뉴에서 평가 유형을 선택해 신청할 수 있습니다.',
    },
    {
        id: 'corp-faq-010',
        category: 'etc',
        question: '문의 답변은 어디에서 확인하나요?',
        answer: '문의하기가 완료되면 마이페이지의 문의 내역 또는 등록한 이메일에서 답변을 확인할 수 있습니다.',
    },
    {
        id: 'corp-faq-011',
        category: 'etc',
        question: '자료실 파일이 열리지 않아요.',
        answer: 'PDF 문서는 최신 뷰어에서 열리며, 파일이 손상된 경우 1:1 문의로 알려주시면 다시 등록해 드립니다.',
    },
    {
        id: 'corp-faq-012',
        category: 'member',
        question: '담당자 정보는 어디에서 바꾸나요?',
        answer: '마이페이지 > 내 정보에서 담당자 이름·연락처·이메일을 수정할 수 있습니다.',
    },
]

const CorpNoticeFaqPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="grid-layout gap-10 pt-10 pb-25 *:col-span-full">
            <PageTitleBar
                title="자주 묻는 질문"
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
                                <BreadcrumbPage>자주 묻는 질문 (FAQ)</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <div className="flex flex-col gap-6">
                <SectionHeader>
                    <SectionHeaderTitle>자주 묻는 질문을 모아봤어요 (FAQ)</SectionHeaderTitle>
                </SectionHeader>
                <FaqList categories={FAQ_CATEGORIES} items={MOCK_FAQ_ITEMS} pageSize={FAQ_PAGE_SIZE} />
            </div>
        </div>
    </main>
)

export default CorpNoticeFaqPage
