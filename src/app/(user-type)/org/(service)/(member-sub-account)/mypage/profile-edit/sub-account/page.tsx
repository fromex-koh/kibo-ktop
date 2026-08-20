import type {Metadata} from 'next'
import OrgMypageProfileForm from '@/components/composite/org-mypage-profile-form'
import {OrgMypageProfileScreen} from '@/components/composite/org-mypage-profile-screen'
import {ORG_MEMBER_ACCOUNTS, ORG_MEMBER_VOUCHERS, ORG_MYPAGE_MEMBERS} from '@/constants/mypage-profile'

export const metadata: Metadata = {title: '내 정보'}

// 기관 마이페이지 내 정보 — 기관회원(하위 계정)으로 로그인했을 때.
// 상위 마스터 기관이 만들어 준 계정이라 보여 주는 칸이 다르고, [이용권 정보] 구획이 더 있다.
//
// [프론트엔드 연동] 계정 정보(account)와 배분받은 이용권(vouchers)을 이 화면이 읽어 폼에 내려 준다 —
// 조회 코드를 폼 안에서 찾아다닐 필요가 없다.
const OrgMypageProfileSubAccountPage = () => (
    <OrgMypageProfileScreen
        member={ORG_MYPAGE_MEMBERS.subAccount}
        form={
            <OrgMypageProfileForm
                account={ORG_MEMBER_ACCOUNTS.subAccount}
                variant="sub-account"
                vouchers={ORG_MEMBER_VOUCHERS}
            />
        }
    />
)

export default OrgMypageProfileSubAccountPage
