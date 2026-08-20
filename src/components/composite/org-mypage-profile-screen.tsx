import type {ReactNode} from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {MypageSidebar} from '@/components/composite/mypage-sidebar'
import {PageTitleBar} from '@/components/composite/page-title-bar'
import {SectionHeader, SectionHeaderDescription, SectionHeaderTitle} from '@/components/composite/section-header'

// 기관 마이페이지 내 정보 — 회원 유형(협약은행·협약기관·기관회원) 세 화면이 공유하는 셸.
// 구성은 기업 마이페이지 내 정보(/corp/mypage/profile)와 같고, 달라지는 것은 메뉴 목록·회원정보·
// 브레드크럼뿐이다. 유형별로 다른 것은 이름과 값이라 화면(page)이 넘긴다.

type OrgMypageProfileScreenProps = {
    // 사이드바에 보이는 회원 — 기관명과 유형 배지. 이름은 그 화면의 헤더와 같은 값이다.
    member: {companyName: string; memberType: string}
    // 본문 폼. 회원 유형마다 묻는 것이 달라 화면(page)이 넘긴다.
    form: ReactNode
    // 화면 제목 아래 안내.
    description?: ReactNode
}

const OrgMypageProfileScreen = ({
    member,
    form,
    description = '등록된 회원 정보를 수정한 후 저장 버튼을 눌러주세요.',
}: OrgMypageProfileScreenProps) => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="grid-layout gap-y-10 pt-10 *:col-span-full">
            <PageTitleBar
                title="마이페이지"
                breadcrumb={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/org/home">홈</BreadcrumbLink>
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
                    가져가면 같은 화면에서 다른 이름이 보인다(연동 시에도 조회는 한 번이다). */}
                <MypageSidebar
                    userType="org"
                    current="내 정보"
                    companyName={member.companyName}
                    memberType={member.memberType}
                />

                <div className="flex min-w-0 flex-1 flex-col gap-10">
                    <SectionHeader>
                        <SectionHeaderTitle size="lg">내 정보</SectionHeaderTitle>
                        <SectionHeaderDescription size="lg">{description}</SectionHeaderDescription>
                    </SectionHeader>

                    {form}
                </div>
            </div>
        </div>
    </main>
)

export {OrgMypageProfileScreen}
export type {OrgMypageProfileScreenProps}
