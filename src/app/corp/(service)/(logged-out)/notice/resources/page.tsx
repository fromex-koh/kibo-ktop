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
import {ResourceList, type ResourceItem} from '@/components/custom/resource-list'

export const metadata: Metadata = {title: '자료실'}

// API 연동 전 화면 확인용 목업 데이터. 실제 작업에서는 이 배열을 조회 결과로 교체하고
// href 를 파일 서버 경로로 연결한다.
const MOCK_RESOURCE_ITEMS: readonly ResourceItem[] = [
    {id: 'corp-resource-001', title: 'K-TOP 서비스 이용 안내서', href: '#'},
    {id: 'corp-resource-002', title: '기술평가 신청 절차 안내서', href: '#'},
    {id: 'corp-resource-003', title: 'KTRS-FM 평가모형 설명자료', href: '#'},
    {id: 'corp-resource-004', title: 'Tech-Index 평가모형 설명자료', href: '#'},
    {id: 'corp-resource-005', title: '투자모형 평가 안내서', href: '#'},
    {id: 'corp-resource-006', title: 'K-BIGx 보고서 활용 가이드', href: '#'},
    {id: 'corp-resource-007', title: '특허등급평가 안내서', href: '#'},
    {id: 'corp-resource-008', title: '개인정보 활용 동의서 양식', href: '#'},
    {id: 'corp-resource-009', title: '기술혁신정보 이용동의 양식', href: '#'},
    {id: 'corp-resource-010', title: '자주 묻는 질문 모음집', href: '#'},
    {id: 'corp-resource-011', title: '탄소중립 평가 안내서', href: '#'},
    {id: 'corp-resource-012', title: '유료 서비스 이용 안내서', href: '#'},
]

const MOCK_RESOURCE_PAGE_SIZE = 10

// SkipNav의 #main 도착 대상. 목록·페이지 상태는 client 인 ResourceList가 담당한다.
const CorpNoticeResourcesPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="content-layout flex flex-col gap-10 pt-10 pb-25">
            <PageTitleBar
                title="자료실"
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
                                <BreadcrumbPage>자료실</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <ResourceList items={MOCK_RESOURCE_ITEMS} pageSize={MOCK_RESOURCE_PAGE_SIZE} />
        </div>
    </main>
)

export default CorpNoticeResourcesPage
