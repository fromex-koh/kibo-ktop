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
import MypageProfileForm from '@/components/composite/mypage-profile-form'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {SectionHeader, SectionHeaderDescription, SectionHeaderTitle} from '@/components/composite/section-header'
import {MYPAGE_MEMBER, MYPAGE_MEMBER_PROFILE} from '@/constants/mypage-profile'

export const metadata: Metadata = {title: '내 정보'}

// 기업 마이페이지 (1) 내 정보 — Figma "[마이페이지] 내 정보".
// 마이페이지는 좌측 LNB(고정) + 우측 본문 두 열이다. 시안 실측은 344 + 64 + 792 = 1200 으로,
// 페이지 컬럼 그리드가 아니라 사이드바 폭이 정해진 2단 배치다.
// 좁은 화면에서는 한 열로 떨어지고 사이드바가 위로 온다 — 메뉴가 본문보다 먼저 읽히는 순서가 맞다[7.3.1].
const CorpMypageProfilePage = () => (
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
                                <BreadcrumbPage>내 정보</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />

            {/* 두 열 사이 64 = gap-16(시안). 아래 여백 60 은 CTA 아래 간격이다.
                두 열은 xl 부터다 — 그 아래에서는 사이드바가 [현재 메뉴 줄]로 바뀌어 본문 위에 쌓인다. */}
            <div className="flex flex-col gap-10 pb-15 xl:flex-row xl:gap-16">
                {/* 회원정보는 이 화면이 한 번 읽어 사이드바와 폼에 함께 내린다 — 두 곳이 값을 따로
                    가져가면 같은 화면에서 다른 기업 이름이 보인다(연동 시에도 조회는 한 번이다). */}
                <MypageSidebar
                    userType="corp"
                    current="내 정보"
                    companyName={MYPAGE_MEMBER.companyName}
                    memberType={MYPAGE_MEMBER.memberType}
                />

                <div className="flex min-w-0 flex-1 flex-col gap-10">
                    <SectionHeader>
                        <SectionHeaderTitle size="lg">내 정보</SectionHeaderTitle>
                        <SectionHeaderDescription size="lg">
                            등록된 회원 정보를 확인하고 수정할 수 있습니다.
                        </SectionHeaderDescription>
                    </SectionHeader>

                    <MypageProfileForm defaultValues={MYPAGE_MEMBER_PROFILE} />
                </div>
            </div>
        </div>
    </main>
)

export default CorpMypageProfilePage
