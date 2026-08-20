import type {Metadata} from 'next'
import OrgMypageProfileForm from '@/components/composite/org-mypage-profile-form'
import {OrgMypageProfileScreen} from '@/components/composite/org-mypage-profile-screen'
import {ORG_MEMBER_ACCOUNTS, ORG_MYPAGE_MEMBERS} from '@/constants/mypage-profile'

export const metadata: Metadata = {title: '내 정보'}

// 기관 마이페이지 내 정보 — 협약은행으로 로그인했을 때.
const OrgMypageProfilePartnerBankPage = () => (
    <OrgMypageProfileScreen
        member={ORG_MYPAGE_MEMBERS.partnerBank}
        form={<OrgMypageProfileForm account={ORG_MEMBER_ACCOUNTS.partnerBank} />}
    />
)

export default OrgMypageProfilePartnerBankPage
