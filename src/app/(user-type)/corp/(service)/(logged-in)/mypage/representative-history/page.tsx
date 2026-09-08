import type {Metadata} from 'next'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {MypageSidebar} from '@/components/composite/mypage-sidebar'
import MypageRepresentativeHistoryForm from '@/components/composite/mypage-representative-history-form'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {SectionHeader, SectionHeaderDescription, SectionHeaderTitle} from '@/components/composite/section-header'
import {MYPAGE_MEMBER} from '@/constants/mypage-profile'
import {REPRESENTATIVE_HISTORY} from '@/constants/mypage-representative-history'

export const metadata: Metadata = {title: '대표자 이력'}

// 기업 마이페이지 (2) 대표자(경영자) 역량 및 경력 — Figma "[마이페이지] 내 정보"(대표자 이력).
// 두 열 배치·간격은 마이페이지 (1) 내 정보와 같다(사이드바 344 + 64 + 본문 792 = 1200).
const CorpMypageRepresentativeHistoryPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="grid-layout gap-y-10 pt-10 *:col-span-full">
            <PageTitleBar
                title="마이페이지"
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/corp/home">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <span>마이페이지</span>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>대표자 이력</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            <div className="flex flex-col gap-10 pb-15 xl:flex-row xl:gap-16">
                {/* 회원정보는 이 화면이 한 번 읽어 사이드바와 폼에 함께 내린다 — 두 곳이 값을 따로
                    가져가면 같은 화면에서 다른 기업 이름이 보인다. */}
                <MypageSidebar userType="corp" current="대표자 이력" companyName={MYPAGE_MEMBER.companyName} />

                <div className="flex min-w-0 flex-1 flex-col gap-10">
                    <SectionHeader>
                        <SectionHeaderTitle size="lg">대표자 이력</SectionHeaderTitle>
                        {/* 개인정보 안내는 카드([대표자 이력]) 부제로 옮겼다 — 시안 그대로다. */}
                        <SectionHeaderDescription size="lg">
                            등록된 대표자 이력 정보를 수정한 후 저장 버튼을 눌러주세요.
                        </SectionHeaderDescription>
                    </SectionHeader>

                    <MypageRepresentativeHistoryForm defaultValues={REPRESENTATIVE_HISTORY} />
                </div>
            </div>
        </div>
    </main>
)

export default CorpMypageRepresentativeHistoryPage
