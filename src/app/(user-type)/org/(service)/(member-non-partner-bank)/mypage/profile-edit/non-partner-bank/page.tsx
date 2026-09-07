import type {Metadata} from 'next'
import OrgMypageProfileForm from '@/components/composite/org-mypage-profile-form'
import {OrgMypageProfileScreen} from '@/components/composite/org-mypage-profile-screen'
import {ORG_MEMBER_ACCOUNTS, ORG_MYPAGE_MEMBERS} from '@/constants/mypage-profile'

export const metadata: Metadata = {title: '내 정보'}

// 기관 마이페이지 내 정보 — 비협약 은행으로 로그인했을 때.
// 칸 구성은 협약은행과 같고, 협약할 때 정해지는 [평가사업 선택] 칸만 없다(시안 케이스 A).
const OrgMypageProfileNonPartnerBankPage = () => (
    <OrgMypageProfileScreen
        member={ORG_MYPAGE_MEMBERS.nonPartnerBank}
        form={<OrgMypageProfileForm account={ORG_MEMBER_ACCOUNTS.nonPartnerBank} />}
    />
)

export default OrgMypageProfileNonPartnerBankPage
