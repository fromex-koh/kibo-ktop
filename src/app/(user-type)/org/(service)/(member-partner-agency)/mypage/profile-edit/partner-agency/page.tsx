import type {Metadata} from 'next'
import OrgMypageProfileForm from '@/components/composite/org-mypage-profile-form'
import {OrgMypageProfileScreen} from '@/components/composite/org-mypage-profile-screen'
import {ORG_MEMBER_ACCOUNTS, ORG_MYPAGE_MEMBERS} from '@/constants/mypage-profile'

export const metadata: Metadata = {title: '내 정보'}

// 기관 마이페이지 내 정보 — 협약기관으로 로그인했을 때.
// 협약은행과 같은 구성이고 [평가사업 선택] 칸이 하나 더 있다(그 값을 가진 유형에서만 나온다).
const OrgMypageProfilePartnerAgencyPage = () => (
    <OrgMypageProfileScreen
        member={ORG_MYPAGE_MEMBERS.partnerAgency}
        form={<OrgMypageProfileForm account={ORG_MEMBER_ACCOUNTS.partnerAgency} />}
    />
)

export default OrgMypageProfilePartnerAgencyPage
